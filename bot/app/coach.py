"""One student message in, one Hebrew reply out.

Order of checks: the daily turn cap, then the deterministic fast path (a
link code, a start or end word, or an answer while a session is active),
then the ADK agent for anything else, with a bound on model calls per turn
and a bounded conversation history."""
import logging
import re

from google.adk.agents.run_config import RunConfig
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from . import config, replies
from .replies import Reply
from .agent import build_agent
from .api_client import TrainerApi
from .limits import DailyTurnCounter
from . import tools

log = logging.getLogger("bot")
CODE = re.compile(r"^\d{6}$")


class Coach:
    def __init__(self, api: TrainerApi | None = None, agent=None):
        self.api = api or TrainerApi()
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
        lowered = text.lower()
        if CODE.match(text):
            result = await self.api.link(chat_id, text)
            return Reply(replies.LINKED if result["ok"] else replies.error_reply(result))
        if lowered in config.START_WORDS or lowered == "/start":
            return replies.start_reply(await self.api.start(chat_id))
        if lowered in config.END_WORDS:
            return replies.end_reply(await self.api.end(chat_id))
        if not config.FAST_PATH_ANSWERS:
            return None
        status = await self.api.status(chat_id)
        if status["ok"] and status["data"].get("active"):
            # In setup or mid-session every message is an answer (a choice or a translation).
            return replies.answer_reply(await self.api.answer(chat_id, text))
        if not status["ok"] and status.get("code") in ("not_linked", "rate_limited", "unreachable"):
            return Reply(replies.error_reply(status))
        return None

    async def ask_agent(self, chat_id: str, text: str) -> str:
        session = await self._session(chat_id)
        message = types.Content(role="user", parts=[types.Part(text=text)])
        reply = ""
        try:
            async for event in self.runner.run_async(
                user_id=chat_id, session_id=session.id, new_message=message,
                run_config=RunConfig(max_llm_calls=config.MAX_LLM_CALLS_PER_TURN),
            ):
                if event.is_final_response() and event.content and event.content.parts:
                    reply = "".join(p.text or "" for p in event.content.parts).strip()
        except Exception as error:  # the model or a tool failed: never leak it to the chat
            log.exception("agent failed for chat %s: %s", chat_id, error)
            return replies.UNREACHABLE
        return reply or replies.HELP

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
