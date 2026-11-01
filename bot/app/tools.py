"""ADK tools. Each one is an HTTP call to the trainer API for the chat that
owns the conversation; the chat id comes from the session state that the
webhook set, never from the model. Every tool returns a ready Hebrew reply.

A reply longer than the model may write (an /unseen text) is `direct`: the
tool ends the turn without asking the model again, and the coach sends the
reply as it is, with its buttons and the messages before it."""
from google.adk.tools import ToolContext

from . import replies
from .api_client import TrainerApi
from .exercise_replies import exercise_start_reply, lesson_list_reply, mistakes_start_reply
from .drill_replies import drill_start_reply
from .unseen_replies import unseen_list_reply, unseen_start_reply

_api: TrainerApi | None = None


def set_api(api: TrainerApi) -> None:
    global _api
    _api = api


def _chat(tool_context: ToolContext) -> str:
    return str(tool_context.state.get("chat_id", ""))


async def link_account(code: str, tool_context: ToolContext) -> dict:
    """Link this chat to the student's account with the 6-digit code from the web app."""
    result = await _api.link(_chat(tool_context), code.strip())
    return {"reply": replies.LINKED if result["ok"] else replies.error_reply(result)}


async def start_session(tool_context: ToolContext) -> dict:
    """Start a new practice session of 20 English words and return the first word."""
    return {"reply": str(replies.start_reply(await _api.start(_chat(tool_context))))}


async def answer_word(text: str, tool_context: ToolContext) -> dict:
    """Submit the student's answer in the open session (a word's translation, or an exercise option number); returns the verdict and what comes next."""
    reply = replies.answer_reply(await _api.answer(_chat(tool_context), text))
    # With messages before it (a reading's text, then its question) the reply is longer than the model may write.
    return _direct(reply, tool_context) if reply.before else {"reply": str(reply)}


async def end_session(tool_context: ToolContext) -> dict:
    """End the current practice session and return the summary."""
    return {"reply": str(replies.end_reply(await _api.end(_chat(tool_context))))}


async def session_status(tool_context: ToolContext) -> dict:
    """Tell whether a session is active and repeat the current word."""
    return {"reply": str(replies.status_reply(await _api.status(_chat(tool_context))))}


def _subject(subject: str) -> str:
    s = subject.strip().lower()
    if s in ("math", "חשבון", "מתמטיקה"):
        return "math"
    if s in ("arabic", "ערבית"):
        return "arabic"
    return "english"


async def start_lesson_exercise(subject: str, tool_context: ToolContext, number: int = 0, difficulty: str = "") -> dict:
    """Start a lesson's exercises. subject is "english", "math" or "arabic"; number is the lesson's number in the
    subject's lesson list, or 0 for the student's next lesson; difficulty is "easy", "medium", "hard"
    or "" for the student's current level."""
    level = difficulty.strip().lower()
    level = level if level in ("easy", "medium", "hard") else None
    result = await _api.exercise_start(_chat(tool_context), subject=_subject(subject), number=number or None,
                                       difficulty=level)
    return {"reply": str(exercise_start_reply(result))}


async def list_lessons(subject: str, tool_context: ToolContext) -> dict:
    """Show the numbered lesson list of a subject ("english", "math" or "arabic") so the student can pick one by number."""
    return {"reply": str(lesson_list_reply(await _api.exercise_lessons(_chat(tool_context), _subject(subject))))}


async def start_mistakes_exam(subject: str, tool_context: ToolContext) -> dict:
    """Start a subject's mistakes exam: up to 20 questions the student got wrong and has not fixed yet.
    subject is "english", "math" or "arabic"."""
    return {"reply": str(mistakes_start_reply(await _api.mistakes_start(_chat(tool_context), _subject(subject))))}


async def start_kefel_drill(tool_context: ToolContext) -> dict:
    """Start a quick multiplication-table drill (לוח הכפל): 10 new multiplication and division questions
    up to 10×10, answered by typing the number. Nothing is saved as a score."""
    return {"reply": str(drill_start_reply(await _api.drill_start(_chat(tool_context))))}


def _direct(reply: replies.Reply, tool_context: ToolContext) -> dict:
    """A reply the coach sends as it is; the model is not asked to write it again."""
    tool_context.actions.skip_summarization = True
    return {"reply": reply.text, "buttons": reply.buttons, "before": reply.before, "direct": True}


async def start_unseen(tool_context: ToolContext, number: int = 0) -> dict:
    """Start an English reading text (unseen, קטע קריאה, הבנת הנקרא) with five comprehension questions:
    the student's next text, or text number N of the reading list (0 for the next one). The text and the
    first question are sent to the student as they are."""
    return _direct(unseen_start_reply(await _api.unseen_start(_chat(tool_context), number or None)), tool_context)


async def list_unseen_texts(tool_context: ToolContext) -> dict:
    """Show the numbered list of English reading texts (unseen) so the student can pick one by number."""
    return _direct(unseen_list_reply(await _api.unseen_list(_chat(tool_context))), tool_context)


async def show_help(tool_context: ToolContext) -> dict:
    """Explain in Hebrew how the bot works and list its English commands."""
    return {"reply": replies.HELP}


TOOLS = [show_help, link_account, start_session, answer_word, end_session, session_status, start_lesson_exercise, list_lessons,
         start_mistakes_exam, start_kefel_drill, start_unseen, list_unseen_texts]
