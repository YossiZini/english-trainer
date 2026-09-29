"""The thin Telegram side: parse an update, send a message, set the menu."""
import logging

import httpx

from . import config

log = logging.getLogger("bot")

# The command menu next to the text box (English commands, Hebrew
# descriptions). The bot sets it itself at startup: nothing to run by hand.
COMMANDS = [
    ("help", "איך זה עובד ומה אפשר לעשות"),
    ("words", "מבחן 20 מילים, מאנגלית לעברית או מעברית לאנגלית"),
    ("switch", "אותן מילים שוב, בכיוון השני"),
    ("english", "תרגילי השיעור הבא באנגלית"),
    ("math", "תרגילי השיעור הבא בחשבון"),
    ("lessons_english", "רשימת שיעורי האנגלית"),
    ("lessons_math", "רשימת שיעורי החשבון"),
    ("report", "דיווח על שאלה שגויה"),
    ("end", "עצירת התרגול"),
]
# Added to the menu of the admin's chat only (a chat-scoped menu).
ADMIN_COMMANDS = [
    ("review_manual", "בדיקת דיווחים: שאלה אחר שאלה"),
    ("review_auto", "בדיקת דיווחים אוטומטית"),
]
COMMANDS_TIMEOUT_SECONDS = 5


def parse_update(update: dict) -> tuple[str, str] | None:
    """(chat_id, text) of a text message, or None for anything else."""
    message = update.get("message") or update.get("edited_message")
    if not message or not isinstance(message.get("text"), str):
        return None
    chat = message.get("chat") or {}
    if "id" not in chat:
        return None
    return str(chat["id"]), message["text"]


def reply_markup(buttons: list[str] | None) -> dict:
    """A one-row reply keyboard for the given buttons, or remove the keyboard."""
    if buttons:
        return {"keyboard": [[{"text": b} for b in buttons]], "resize_keyboard": True, "one_time_keyboard": True}
    return {"remove_keyboard": True}


async def send_message(chat_id: str, text: str, buttons: list[str] | None = None,
                       client: httpx.AsyncClient | None = None) -> bool:
    url = f"{config.TELEGRAM_API}/bot{config.TELEGRAM_BOT_TOKEN}/sendMessage"
    own = client is None
    client = client or httpx.AsyncClient(timeout=config.API_TIMEOUT_SECONDS)
    try:
        res = await client.post(url, json={"chat_id": chat_id, "text": text, "reply_markup": reply_markup(buttons)})
        return res.status_code == 200
    except httpx.HTTPError:
        return False
    finally:
        if own:
            await client.aclose()


async def set_commands(client: httpx.AsyncClient | None = None, admin_chat: str | None = None) -> bool:
    """Set the command menu: everyone's, or with `admin_chat` that chat's menu with
    the admin commands too. Best effort: False (and a log line) on any failure."""
    if not config.TELEGRAM_BOT_TOKEN:
        return False
    url = f"{config.TELEGRAM_API}/bot{config.TELEGRAM_BOT_TOKEN}/setMyCommands"
    commands = COMMANDS[:-1] + ADMIN_COMMANDS + COMMANDS[-1:] if admin_chat else COMMANDS
    body = {"commands": [{"command": c, "description": d} for c, d in commands]}
    if admin_chat:
        body["scope"] = {"type": "chat", "chat_id": admin_chat}
    own = client is None
    client = client or httpx.AsyncClient(timeout=COMMANDS_TIMEOUT_SECONDS)
    try:
        res = await client.post(url, json=body)
        ok = res.status_code == 200 and res.json().get("ok") is True
    except (httpx.HTTPError, ValueError) as error:
        log.warning("setMyCommands failed: %s", type(error).__name__)
        return False
    finally:
        if own:
            await client.aclose()
    if not ok:
        log.warning("setMyCommands refused: HTTP %s", res.status_code)
    return ok
