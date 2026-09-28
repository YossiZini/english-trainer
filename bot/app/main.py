"""FastAPI entry point: the Telegram webhook and a health check."""
import hmac
import logging

from fastapi import FastAPI, Header, Request, Response

from . import config, replies, telegram
from .coach import Coach

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("bot")


def create_app(coach: Coach | None = None) -> FastAPI:
    app = FastAPI(title="English Trainer Telegram bot", docs_url=None, redoc_url=None)
    app.state.coach = coach

    def get_coach() -> Coach:
        if app.state.coach is None:
            app.state.coach = Coach()
        return app.state.coach

    @app.get("/health")
    async def health():
        return {"status": "OK"}

    @app.post("/telegram/webhook")
    async def webhook(request: Request, x_telegram_bot_api_secret_token: str = Header(default="")):
        if not config.TELEGRAM_WEBHOOK_SECRET or not hmac.compare_digest(
                x_telegram_bot_api_secret_token, config.TELEGRAM_WEBHOOK_SECRET):
            return Response(status_code=403)
        update = await request.json()
        parsed = telegram.parse_update(update)
        if parsed is None:
            return {"ok": True, "ignored": True}
        chat_id, text = parsed
        try:
            reply = await get_coach().handle(chat_id, text)
        except Exception as error:  # never let Telegram retry the same update forever
            log.exception("handling failed: %s", error)
            reply = replies.UNREACHABLE
        await telegram.send_message(chat_id, reply)
        return {"ok": True}

    return app


app = create_app()
