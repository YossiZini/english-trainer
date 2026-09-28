"""The thin Telegram side: parse an update, send a message."""
import httpx

from . import config


def parse_update(update: dict) -> tuple[str, str] | None:
    """(chat_id, text) of a text message, or None for anything else."""
    message = update.get("message") or update.get("edited_message")
    if not message or not isinstance(message.get("text"), str):
        return None
    chat = message.get("chat") or {}
    if "id" not in chat:
        return None
    return str(chat["id"]), message["text"]


async def send_message(chat_id: str, text: str, client: httpx.AsyncClient | None = None) -> bool:
    url = f"{config.TELEGRAM_API}/bot{config.TELEGRAM_BOT_TOKEN}/sendMessage"
    own = client is None
    client = client or httpx.AsyncClient(timeout=config.API_TIMEOUT_SECONDS)
    try:
        res = await client.post(url, json={"chat_id": chat_id, "text": text})
        return res.status_code == 200
    except httpx.HTTPError:
        return False
    finally:
        if own:
            await client.aclose()
