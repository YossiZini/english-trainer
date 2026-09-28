"""HTTP client for the trainer's bot API (/api/bot). Every call carries the
service key and the Telegram chat id; the API decides which student that is.
Results are plain dicts, never exceptions, so a tool can always answer."""
from typing import Any

import httpx

from . import config


class TrainerApi:
    def __init__(self, base_url: str = config.API_URL, key: str = config.BOT_API_KEY,
                 client: httpx.AsyncClient | None = None):
        self.base_url = base_url
        self.key = key
        self.client = client or httpx.AsyncClient(timeout=config.API_TIMEOUT_SECONDS)

    async def _call(self, method: str, path: str, chat_id: str, **fields: Any) -> dict:
        url = f"{self.base_url}{path}"
        headers = {"X-Bot-Key": self.key}
        try:
            if method == "GET":
                res = await self.client.get(url, headers=headers, params={"chatId": chat_id})
            else:
                res = await self.client.post(url, headers=headers, json={"chatId": chat_id, **fields})
        except httpx.HTTPError as error:
            return {"ok": False, "status": 0, "code": "unreachable", "message": str(error)}
        try:
            body = res.json()
        except ValueError:
            body = {}
        if res.status_code == 429:
            return {"ok": False, "status": 429, "code": "rate_limited", "message": body.get("message", "")}
        if res.status_code >= 400:
            return {"ok": False, "status": res.status_code, "code": body.get("code", "error"),
                    "message": body.get("message", "")}
        return {"ok": True, "status": res.status_code, "data": body.get("data", {})}

    async def link(self, chat_id: str, code: str) -> dict:
        return await self._call("POST", "/bot/link", chat_id, code=code)

    async def start(self, chat_id: str) -> dict:
        return await self._call("POST", "/bot/session/start", chat_id)

    async def answer(self, chat_id: str, text: str) -> dict:
        return await self._call("POST", "/bot/session/answer", chat_id, text=text)

    async def end(self, chat_id: str) -> dict:
        return await self._call("POST", "/bot/session/end", chat_id)

    async def exercise_start(self, chat_id: str, subject: str | None = None, lesson_id: str | None = None) -> dict:
        fields = {"subject": subject} if subject else {"lessonId": lesson_id}
        return await self._call("POST", "/bot/exercise/start", chat_id, **fields)

    async def status(self, chat_id: str) -> dict:
        return await self._call("GET", "/bot/session/status", chat_id)
