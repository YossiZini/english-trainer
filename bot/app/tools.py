"""ADK tools. Each one is an HTTP call to the trainer API for the chat that
owns the conversation; the chat id comes from the session state that the
webhook set, never from the model. Every tool returns a ready Hebrew reply."""
from google.adk.tools import ToolContext

from . import replies
from .api_client import TrainerApi

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
    return {"reply": replies.start_reply(await _api.start(_chat(tool_context)))}


async def answer_word(text: str, tool_context: ToolContext) -> dict:
    """Submit the student's Hebrew translation of the current word; returns the verdict and the next word."""
    return {"reply": replies.answer_reply(await _api.answer(_chat(tool_context), text))}


async def end_session(tool_context: ToolContext) -> dict:
    """End the current practice session and return the summary."""
    return {"reply": replies.end_reply(await _api.end(_chat(tool_context)))}


async def session_status(tool_context: ToolContext) -> dict:
    """Tell whether a session is active and repeat the current word."""
    return {"reply": replies.status_reply(await _api.status(_chat(tool_context)))}


TOOLS = [link_account, start_session, answer_word, end_session, session_status]
