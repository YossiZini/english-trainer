"""The webhook: secret token, update parsing, reply sending."""
import httpx
import respx
from fastapi.testclient import TestClient

from app import telegram
from app.main import create_app
from app.replies import Reply


class FakeCoach:
    def __init__(self):
        self.calls = []

    async def handle(self, chat_id, text):
        self.calls.append((chat_id, text))
        return Reply("תשובה", ["1", "2"])


def update(text="words", chat_id=42):
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
    import json
    body = json.loads(send.calls.last.request.content)
    assert body["chat_id"] == "42" and body["text"] == "תשובה"
    assert body["reply_markup"]["keyboard"] == [[{"text": "1"}, {"text": "2"}]]
    assert telegram.reply_markup([]) == {"remove_keyboard": True}
    assert client.get("/health").json() == {"status": "OK"}


MENU = "http://telegram.test/bot123:abc/setMyCommands"


@respx.mock
async def test_set_commands_sends_the_menu_of_commands_the_coach_understands():
    import json
    from app.coach import parse_command
    route = respx.post(MENU).mock(return_value=httpx.Response(200, json={"ok": True, "result": True}))
    assert await telegram.set_commands() is True
    sent = json.loads(route.calls.last.request.content)["commands"]
    assert [c["command"] for c in sent] == ["help", "words", "switch", "english", "math", "lessons_english", "lessons_math", "arabic", "lessons_arabic",
                                            "report", "usage", "review_manual", "review_auto", "end"]
    assert "scope" not in json.loads(route.calls.last.request.content)  # one menu for every chat
    assert all(c["description"] for c in sent)
    for c in sent:
        assert parse_command("/" + c["command"]) is not None, c["command"]


@respx.mock
async def test_set_commands_failures_return_false():
    respx.post(MENU).mock(side_effect=[
        httpx.Response(401, json={"ok": False, "description": "Unauthorized"}),
        httpx.ConnectError("down"),
        httpx.Response(200, text="not json"),
    ])
    assert await telegram.set_commands() is False
    assert await telegram.set_commands() is False
    assert await telegram.set_commands() is False


@respx.mock
def test_startup_sets_the_menu_and_a_failure_does_not_stop_the_app():
    route = respx.post(MENU).mock(side_effect=httpx.ConnectError("down"))
    with TestClient(create_app(FakeCoach())) as client:
        assert client.get("/health").json() == {"status": "OK"}
    assert route.called


def test_non_text_updates_are_ignored():
    coach = FakeCoach()
    client = TestClient(create_app(coach))
    res = client.post("/telegram/webhook", json={"update_id": 2, "message": {"chat": {"id": 1}, "sticker": {}}},
                      headers={"X-Telegram-Bot-Api-Secret-Token": "hook-secret"})
    assert res.json()["ignored"] is True and coach.calls == []
