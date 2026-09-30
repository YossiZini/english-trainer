"""ADK tools. Each one is an HTTP call to the trainer API for the chat that
owns the conversation; the chat id comes from the session state that the
webhook set, never from the model. Every tool returns a ready Hebrew reply."""
from google.adk.tools import ToolContext

from . import replies
from .api_client import TrainerApi
from .exercise_replies import exercise_start_reply, lesson_list_reply

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
    return {"reply": str(replies.answer_reply(await _api.answer(_chat(tool_context), text)))}


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


async def show_help(tool_context: ToolContext) -> dict:
    """Explain in Hebrew how the bot works and list its English commands."""
    return {"reply": replies.HELP}


TOOLS = [show_help, link_account, start_session, answer_word, end_session, session_status, start_lesson_exercise, list_lessons]
