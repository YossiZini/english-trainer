"""The thin Telegram side: parse an update, send a message or a photo, set the menu."""
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
    ("unseen", "קטע קריאה באנגלית (unseen) ו-5 שאלות הבנה"),
    ("unseen_list", "רשימת קטעי הקריאה באנגלית"),
    ("kefel", "לוח הכפל: 10 תרגילי כפל וחילוק"),
    ("hiluk", "חילוק: 5 עם שארית ו-5 חילוק ארוך"),
    ("arabic", "תרגילי השיעור הבא בערבית"),
    ("lessons_arabic", "רשימת שיעורי הערבית"),
    ("mistakes_english", "מבחן הטעויות באנגלית"),
    ("mistakes_math", "מבחן הטעויות בחשבון"),
    ("mistakes_arabic", "מבחן הטעויות בערבית"),
    ("report", "דיווח על מילה או שאלה שגויה"),
    ("usage", "מי תרגל השבוע והחודש"),
    ("review_manual", "בדיקת דיווחים: אחד אחרי השני"),
    ("review_auto", "בדיקת דיווחים אוטומטית"),
    ("end", "עצירת התרגול"),
]
COMMANDS_TIMEOUT_SECONDS = 5
# Telegram's limit on a photo's caption, in UTF-16 code units (an emoji counts two).
CAPTION_MAX = 1024


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


async def send_photo(chat_id: str, photo: str, caption: str = "", buttons: list[str] | None = None,
                     client: httpx.AsyncClient | None = None) -> bool:
    """A photo by its URL (Telegram fetches it), with a caption and the buttons under it."""
    url = f"{config.TELEGRAM_API}/bot{config.TELEGRAM_BOT_TOKEN}/sendPhoto"
    body = {"chat_id": chat_id, "photo": photo, "reply_markup": reply_markup(buttons)}
    if caption:
        body["caption"] = caption
    own = client is None
    client = client or httpx.AsyncClient(timeout=config.API_TIMEOUT_SECONDS)
    try:
        res = await client.post(url, json=body)
    except httpx.HTTPError as error:
        log.warning("sendPhoto failed: %s", type(error).__name__)
        return False
    finally:
        if own:
            await client.aclose()
    if res.status_code != 200:
        log.warning("sendPhoto refused: HTTP %s", res.status_code)
    return res.status_code == 200


def _caption_fits(text: str) -> bool:
    return len(text.encode("utf-16-le")) // 2 <= CAPTION_MAX


async def send_question_photo(chat_id: str, photo: str, text: str, buttons: list[str] | None = None,
                              client: httpx.AsyncClient | None = None) -> bool:
    """A question with its picture: the photo, the question as its caption, the buttons under it.
    A question too long for a caption follows the photo as its own message. If Telegram refuses
    the photo, the question still arrives, as text with the picture's link."""
    if _caption_fits(text):
        if await send_photo(chat_id, photo, text, buttons, client=client):
            return True
    elif await send_photo(chat_id, photo, client=client):
        return await send_message(chat_id, text, buttons, client=client)
    return await send_message(chat_id, f"{text}\n{photo}", buttons, client=client)


async def set_commands(client: httpx.AsyncClient | None = None) -> bool:
    """Set the command menu. Best effort: False (and a log line) on any failure."""
    if not config.TELEGRAM_BOT_TOKEN:
        return False
    url = f"{config.TELEGRAM_API}/bot{config.TELEGRAM_BOT_TOKEN}/setMyCommands"
    body = {"commands": [{"command": c, "description": d} for c, d in COMMANDS]}
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
