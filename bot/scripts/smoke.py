"""End-to-end check without Telegram or a model: registers a student on the
local API, links a fake chat with a real code, and walks a short session
through the coach's fast path. Run with the emulator-backed API on :5000:

    API_URL=http://127.0.0.1:5000/api BOT_API_KEY=dev_bot_key .venv/bin/python scripts/smoke.py
"""
import asyncio
import os
import sys
import time

import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.coach import Coach  # noqa: E402

API = os.environ.get("API_URL", "http://127.0.0.1:5000/api")


async def main() -> int:
    async with httpx.AsyncClient(timeout=10) as http:
        reg = (await http.post(f"{API}/auth/register", json={"name": f"smoke-{int(time.time())}", "password": "check1234", "age": 12})).json()
        token = reg["data"]["token"]
        code = (await http.post(f"{API}/telegram/link-code", headers={"Authorization": f"Bearer {token}"})).json()["data"]["code"]
    coach = Coach(agent=None)
    coach.runner = None  # the fast path must carry the whole flow
    chat = "smoke-chat"
    say = lambda t: coach.handle(chat, t)
    print("> שלום\n<", await say("שלום"))
    print(f"> {code}\n<", await say(code))
    print("> מילים\n<", await say("מילים"))
    print("> 1\n<", await say("1"))
    for text in ["בטח לא", "גם לא", "עדיין לא"]:
        print(f"> {text}\n<", await say(text))
    print("> סיים\n<", await say("סיים"))
    print("> שלום\n<", await say("שלום") if coach.runner else "(agent path skipped: no model)")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
