"""The webhook: secret token, update parsing, reply sending."""
import httpx
import respx
from fastapi.testclient import TestClient

from app import telegram
from app.main import create_app


class FakeCoach:
    def __init__(self):
        self.calls = []

    async def handle(self, chat_id, text):
        self.calls.append((chat_id, text))
        return "תשובה"


def update(text="מילים", chat_id=42):
    return {"update_id": 1, "message": {"message_id": 5, "chat": {"id": chat_id}, "text": text}}


def test_parse_update_only_text_messages():
    assert telegram.parse_update(update("hi", 3)) == ("3", "hi")
    assert telegram.parse_update({"update_id": 1, "message": {"chat": {"id": 3}, "photo": []}}) is None
    assert telegram.parse_update({"callback_query": {}}) is None


def test_rejects_missing_or_wrong_secret():
    client = TestClient(create_app(FakeCoach()))
    assert client.post("/telegram/webhook", json=update()).status_code == 403
    assert client.post("/telegram/webhook", json=update(), headers={"X-Telegram-Bot-Api-Secret-Token": "nope"}).status_code == 403


@respx.mock
def test_handles_a_text_update_and_sends_the_reply():
    send = respx.post("http://telegram.test/bot123:abc/sendMessage").mock(return_value=httpx.Response(200, json={"ok": True}))
    coach = FakeCoach()
    client = TestClient(create_app(coach))
    res = client.post("/telegram/webhook", json=update("cat", 42), headers={"X-Telegram-Bot-Api-Secret-Token": "hook-secret"})
    assert res.status_code == 200 and res.json() == {"ok": True}
    assert coach.calls == [("42", "cat")]
    assert b'"chat_id": "42"' in send.calls.last.request.content or b'"chat_id":"42"' in send.calls.last.request.content
    assert client.get("/health").json() == {"status": "OK"}


def test_non_text_updates_are_ignored():
    coach = FakeCoach()
    client = TestClient(create_app(coach))
    res = client.post("/telegram/webhook", json={"update_id": 2, "message": {"chat": {"id": 1}, "sticker": {}}},
                      headers={"X-Telegram-Bot-Api-Secret-Token": "hook-secret"})
    assert res.json()["ignored"] is True and coach.calls == []
