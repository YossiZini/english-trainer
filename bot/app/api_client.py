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

    async def usage(self, chat_id: str) -> dict:
        """Every student's participation in the last 7 and 30 days (/usage)."""
        return await self._call("GET", "/bot/usage", chat_id)

    async def switch(self, chat_id: str) -> dict:
        return await self._call("POST", "/bot/session/switch", chat_id)

    async def end(self, chat_id: str) -> dict:
        return await self._call("POST", "/bot/session/end", chat_id)

    async def exercise_start(self, chat_id: str, subject: str | None = None, lesson_id: str | None = None,
                             number: int | None = None, difficulty: str | None = None) -> dict:
        fields = {"subject": subject} if subject else {"lessonId": lesson_id}
        if number:
            fields["number"] = number
        if difficulty:
            fields["difficulty"] = difficulty
        return await self._call("POST", "/bot/exercise/start", chat_id, **fields)

    async def report(self, chat_id: str, reason: str | None = None) -> dict:
        """Without a reason: what /report would report (a word or a question) and its reasons."""
        fields = {"reason": reason} if reason else {}
        return await self._call("POST", "/bot/report", chat_id, **fields)

    async def review_reserve(self, chat_id: str) -> dict:
        """One unit of the student's daily review cap, taken before each review-agent call."""
        return await self._call("POST", "/bot/review/reserve", chat_id)

    async def review_start(self, chat_id: str, mode: str) -> dict:
        return await self._call("POST", "/bot/review/start", chat_id, mode=mode)

    async def review_propose(self, chat_id: str, proposal: dict) -> dict:
        return await self._call("POST", "/bot/review/proposal", chat_id, proposal=proposal)

    async def review_act(self, chat_id: str, action: str) -> dict:
        return await self._call("POST", "/bot/review/act", chat_id, action=action)

    async def exercise_lessons(self, chat_id: str, subject: str) -> dict:
        return await self._call("POST", "/bot/exercise/lessons", chat_id, subject=subject)

    async def status(self, chat_id: str) -> dict:
        return await self._call("GET", "/bot/session/status", chat_id)
