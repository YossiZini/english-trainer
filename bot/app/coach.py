"""One student message in, one Hebrew reply out.

Order of checks: the daily turn cap, then the deterministic fast path (a
link code, an English command, or an answer while a session is active),
then the ADK agent for anything else, with a bound on model calls per turn
and a bounded conversation history."""
import logging
import re
import time

from google.adk.agents.run_config import RunConfig
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from . import config, replies
from .replies import Reply
from .exercise_replies import (exercise_start_reply, exercise_status_reply, lesson_list_reply,
                               report_ask_reply, report_reason, report_reply)
from .agent import build_agent
from .api_client import TrainerApi
from .limits import DailyTurnCounter
from . import tools
from . import review_replies as rr

log = logging.getLogger("bot")
CODE = re.compile(r"^\d{6}$")
LIST_NUMBER = re.compile(r"^\d{1,3}$")


def parse_command(text: str) -> tuple[str, dict] | None:
    """An English command, with or without "/" (and "@bot" in groups), else None.

    help | words | end | switch | report | review [manual|auto] |
    english|math [N] [easy|medium|hard] |
    lessons english|math (also lessons_english) | lessons"""
    words = text.lower().split()
    if not words or len(words) > 3:
        return None
    first = words[0].lstrip("/").split("@")[0]
    if first.startswith(config.LESSONS_WORD + "_"):
        first, words = config.LESSONS_WORD, [first, first.split("_", 1)[1], *words[1:]]
    rest = words[1:]
    if not rest and first in config.HELP_WORDS:
        return "help", {}
    if not rest and first in config.START_WORDS:
        return "words", {}
    if not rest and first in config.END_WORDS:
        return "end", {}
    if not rest and first in config.SWITCH_WORDS:
        return "switch", {}
    if not rest and first in config.REPORT_WORDS:
        return "report", {}
    if first == config.REVIEW_WORD and len(rest) <= 1:
        mode = rest[0] if rest else "manual"
        return ("review", {"mode": mode}) if mode in config.REVIEW_MODES else None
    if first == config.LESSONS_WORD:
        if not rest:
            return "lessons", {}
        if len(rest) == 1 and rest[0] in config.SUBJECTS:
            return "lessons", {"subject": rest[0]}
        return None
    if first in config.SUBJECTS:
        number = difficulty = None
        if rest and LIST_NUMBER.match(rest[0]):
            number, rest = int(rest[0]), rest[1:]
        if rest and rest[0] in config.DIFFICULTIES:
            difficulty, rest = rest[0], rest[1:]
        if rest:
            return None
        return "exercise", {"subject": first, "number": number, "difficulty": difficulty}
    return None


class Coach:
    def __init__(self, api: TrainerApi | None = None, agent=None, reviewer=None):
        self.api = api or TrainerApi()
        self._reviewer = reviewer
        tools.set_api(self.api)
        self.turns = DailyTurnCounter(config.MAX_TURNS_PER_CHAT_PER_DAY)
        self.sessions = InMemorySessionService()
        self.runner = Runner(app_name=config.APP_NAME, agent=agent or build_agent(), session_service=self.sessions)

    async def handle(self, chat_id: str, text: str) -> Reply:
        chat_id = str(chat_id)
        text = (text or "").strip()
        if not text:
            return Reply(replies.HELP)
        if not self.turns.allow(chat_id):
            return Reply(replies.RATE_LIMITED)
        fast = await self.fast_path(chat_id, text)
        if fast is not None:
            return fast
        return Reply(await self.ask_agent(chat_id, text))

    async def fast_path(self, chat_id: str, text: str) -> Reply | None:
        """Replies that need no model: they are fully determined by the API."""
        if CODE.match(text):
            result = await self.api.link(chat_id, text)
            return Reply(replies.LINKED if result["ok"] else replies.error_reply(result))
        reason = report_reason(text)
        if reason:
            # A report-reason button: never an answer to the open question.
            return await self.report(chat_id, reason)
        if text.startswith(replies.SWITCH_SIGN):
            # The button under a words summary: the same words, the other way round.
            return await self.run_command(chat_id, "switch", {})
        command = parse_command(text)
        if command and (text.startswith("/") or command[0] == "end"):
            return await self.run_command(chat_id, *command)
        if not config.FAST_PATH_ANSWERS:
            return await self.run_command(chat_id, *command) if command else None
        status = await self.api.status(chat_id)
        active = status["ok"] and status["data"].get("active")
        # A bare word is an answer only while a typed (fill-in) question is
        # open, where it may be "help" or "english"; a multiple-choice answer
        # is a number, so there a bare command still works. "/help" always does.
        question = status["data"].get("question") if active else None
        typed = bool(question) and question.get("type") != "multiple_choice"
        if command and not typed:
            return await self.run_command(chat_id, *command)
        if active and status["data"].get("kind") == "review":
            return await self.review_message(chat_id, text, status["data"])
        if active:
            # In setup or mid-session every message is an answer: a level, a
            # translation, or an exercise option number; the API routes it by
            # the session's kind and the reply builder follows the data.
            return replies.answer_reply(await self.api.answer(chat_id, text))
        if not status["ok"] and status.get("code") in ("not_linked", "rate_limited", "unreachable"):
            return Reply(replies.error_reply(status))
        return None

    async def run_command(self, chat_id: str, action: str, args: dict) -> Reply:
        if action == "help":
            return Reply(replies.HELP)
        if action == "words":
            return replies.start_reply(await self.api.start(chat_id))
        if action == "end":
            return replies.end_reply(await self.api.end(chat_id))
        if action == "switch":
            return replies.switch_reply(await self.api.switch(chat_id))
        if action == "report":
            # The API knows what is in front of the student: a word or a question.
            result = await self.api.report(chat_id)
            if not result["ok"]:
                return report_reply(result)
            return report_ask_reply(result["data"].get("target", "question"))
        if action == "review":
            result = await self.api.review_start(chat_id, args["mode"])
            if not result["ok"]:
                return Reply(rr.ADMIN_ONLY if result.get("code") == "not_admin" else replies.error_reply(result))
            if args["mode"] == "auto":
                return await self.review_auto(chat_id, result["data"])
            return await self.review_show(chat_id, result["data"])
        if action == "lessons" and not args:
            return Reply(replies.WHICH_LESSONS, list(replies.LESSONS_BUTTONS))
        if action == "lessons":
            return lesson_list_reply(await self.api.exercise_lessons(chat_id, args["subject"]))
        return exercise_start_reply(await self.api.exercise_start(chat_id, **args))

    async def report(self, chat_id: str, reason: str) -> Reply:
        """File the report; when a lesson or words exam is still open, show where it stands again."""
        result = await self.api.report(chat_id, reason)
        confirmation = report_reply(result)
        if not (result["ok"] and result["data"].get("active")):
            return confirmation
        status = await self.api.status(chat_id)
        if not (status["ok"] and status["data"].get("active")):
            return confirmation
        kind = status["data"].get("kind")
        if kind == "exercise":
            current = exercise_status_reply(status["data"])
        elif kind == "vocab" and status["data"].get("word"):
            current = replies.status_reply(status)
        else:
            return confirmation
        return Reply(confirmation.text + "\n\n" + current.text, current.buttons)

    # ---------------------------------------------------------------- review
    @property
    def reviewer(self):
        """The review agent (Gemini Pro), built on first use."""
        if self._reviewer is None:
            from .review_agent import ReviewAgent
            self._reviewer = ReviewAgent()
        return self._reviewer

    async def _propose(self, item: dict, proposal: dict | None = None, instruction: str | None = None):
        """(proposal, error text): the agent's proposal, or why there is none."""
        try:
            if instruction:
                return await self.reviewer.revise(item, proposal, instruction), ""
            return await self.reviewer.propose(item), ""
        except Exception as error:  # model unavailable, timeout, unparsable output
            log.warning("review agent failed: %s", type(error).__name__)
            return None, rr.AGENT_DOWN.format(model=config.REVIEW_MODEL)

    async def review_show(self, chat_id: str, data: dict, intro: str = "", instruction: str | None = None) -> Reply:
        """Ask the agent about the current question, store the proposal, show both with the buttons."""
        if data.get("done") or not data.get("item"):
            return rr.summary_reply(data, intro)
        proposal, error = await self._propose(data["item"], data.get("proposal"), instruction)
        if proposal:
            stored = await self.api.review_propose(chat_id, proposal)
            if stored["ok"]:
                data = stored["data"]
        return rr.review_reply(data, proposal, intro, error)

    async def review_message(self, chat_id: str, text: str, data: dict) -> Reply:
        """A message during a review: a decision button, "continue" (auto), or a correction for the agent."""
        if text == rr.CONTINUE and data.get("mode") == "auto":
            return await self.review_auto(chat_id, data)
        action = rr.ACTIONS.get(text)
        if action:
            result = await self.api.review_act(chat_id, action)
            if not result["ok"]:
                return Reply(replies.error_reply(result))
            after = result["data"]
            if after.get("rejected"):
                return rr.review_reply(after, None, f"⚠️ ההצעה לא תקינה: {after['rejected']}. כתבו תיקון או החליטו בכפתורים.")
            return await self.review_show(chat_id, after, "✔️ נשמר.")
        # Anything else is the admin's correction: the agent revises its proposal.
        return await self.review_show(chat_id, data, instruction=text)

    async def review_auto(self, chat_id: str, data: dict) -> Reply:
        """Apply the agent's valid proposals for as long as Telegram's webhook allows, then report."""
        results = []
        deadline = time.monotonic() + config.REVIEW_AUTO_BUDGET_SECONDS
        while data.get("item") and not data.get("done") and time.monotonic() < deadline:
            item = data["item"]
            title = rr.item_title(item)
            proposal, error = await self._propose(item)
            if not proposal:
                results.append(f"⏭ {title}: {error}")
                data = (await self.api.review_act(chat_id, "skip"))["data"]
                continue
            await self.api.review_propose(chat_id, proposal)
            after = (await self.api.review_act(chat_id, "approve"))["data"]
            if after.get("rejected"):
                results.append(f"⏭ {title}: ההצעה לא תקינה ({after['rejected']})")
                after = (await self.api.review_act(chat_id, "skip"))["data"]
            else:
                results.append(f"{'✏️' if proposal['decision'] == 'change' else '🗑' if proposal['decision'] == 'remove' else '↩️'} "
                               f"{title}: {rr.DECISION_NAME[proposal['decision']]}. {proposal.get('reason', '')}")
            data = after
        return rr.auto_reply(results, data)

    async def ask_agent(self, chat_id: str, text: str) -> str:
        session = await self._session(chat_id)
        message = types.Content(role="user", parts=[types.Part(text=text)])
        reply = ""
        helped = False
        try:
            async for event in self.runner.run_async(
                user_id=chat_id, session_id=session.id, new_message=message,
                run_config=RunConfig(max_llm_calls=config.MAX_LLM_CALLS_PER_TURN),
            ):
                if any(call.name == "show_help" for call in event.get_function_calls() or []):
                    helped = True
                if event.is_final_response() and event.content and event.content.parts:
                    reply = "".join(p.text or "" for p in event.content.parts).strip()
        except Exception as error:  # the model or a tool failed: never leak it to the chat
            log.exception("agent failed for chat %s: %s", chat_id, error)
            return replies.UNREACHABLE
        # The help text is longer than the model's output cap: send it as is.
        return replies.HELP if helped else reply or replies.HELP

    async def _session(self, chat_id: str):
        session = await self.sessions.get_session(app_name=config.APP_NAME, user_id=chat_id, session_id=chat_id)
        if session and len(session.events) > config.HISTORY_EVENTS:
            # Bound the context the model sees: start a fresh session, same state.
            await self.sessions.delete_session(app_name=config.APP_NAME, user_id=chat_id, session_id=chat_id)
            session = None
        if session is None:
            session = await self.sessions.create_session(
                app_name=config.APP_NAME, user_id=chat_id, session_id=chat_id, state={"chat_id": chat_id})
        return session
