"""End-to-end check without Telegram or a model: registers a student on the
local API, links a fake chat with a real code, and walks a short vocabulary
session, a lesson's exercises and the lesson list through the coach's fast
path. Run with the emulator-backed API on :5000:

    API_URL=http://127.0.0.1:5000/api BOT_API_KEY=dev_bot_key .venv/bin/python scripts/smoke.py

It sends about 30 messages from one chat; start the API with
BOT_CHAT_RATE_PER_MINUTE=1000 to run it more than once a minute.
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
    print("> ?\n<", await say("?"))
    for text in ["בטח לא", "גם לא", "עדיין לא"]:
        print(f"> {text}\n<", await say(text))
    print("> סיים\n<", await say("סיים"))
    # Lesson exercises: next lesson, an invalid number, two answers, early end.
    for text in ["תרגיל אנגלית", "9", "1", "2", "סיים"]:
        print(f"> {text}\n<", await say(text))
    # The lesson list: page 2, an unknown number, pick lesson 12, end.
    for text in ["שיעורים אנגלית", "עוד", "500", "12", "1", "סיים"]:
        print(f"> {text}\n<", await say(text))
    for text in ["תרגיל חשבון 3", "סיים"]:
        print(f"> {text}\n<", await say(text))
    print("> שלום\n<", await say("שלום") if coach.runner else "(agent path skipped: no model)")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
