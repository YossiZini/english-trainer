"""Questions that need their picture (a grid, a triangle): sent as a photo with the question as its caption."""
import importlib
import json
from pathlib import Path

import httpx
import respx
from fastapi.testclient import TestClient

from app import config, replies, telegram, tools
from app import exercise_replies as er
from app.api_client import TrainerApi
from app.coach import Coach
from app.main import create_app
from app.replies import Reply

API = "http://api.test/api"
SITE = "http://api.test"
PNG = "/question-pictures/0123456789abcdef.png"
LESSON = {"id": "L2", "title": "נקודות במערכת צירים", "subject": "math", "difficulty": "easy"}
EXERCISES = Path(__file__).resolve().parents[2] / "backend" / "data" / "static" / "exercises.json"
SEND = "http://telegram.test/bot123:abc/sendMessage"
PHOTO = "http://telegram.test/bot123:abc/sendPhoto"


class NoAgentRunner:
    async def run_async(self, **_):
        raise AssertionError("exercises never go through the model")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def ok(data):
    return httpx.Response(200, json={"success": True, "data": data})


def grid(number, picture=PNG):
    return {"number": number, "total": 10, "type": "multiple_choice", "text": "איזו נקודה היא ⁦(3, 1)⁩?",
            "textEn": None, "options": ["A", "B", "C", "D"], "picture": picture}


def test_the_site_is_where_the_api_is_unless_set():
    assert config.SITE_URL == SITE
    try:
        import os
        os.environ["SITE_URL"] = "https://example.test/"
        assert importlib.reload(config).SITE_URL == "https://example.test"
    finally:
        del os.environ["SITE_URL"]
        importlib.reload(config)
    assert config.SITE_URL == SITE


def test_a_question_with_a_picture_is_a_photo_and_its_text_the_caption():
    reply = er.question_reply({"lesson": LESSON, "question": grid(1)}, er.START_INTRO)
    assert reply.photo == SITE + PNG
    assert reply.text == er.question_reply({"lesson": LESSON, "question": grid(1, None)}, er.START_INTRO).text
    assert reply.text.startswith(er.START_INTRO) and "1) A" in reply.text and reply.buttons == ["1", "2", "3", "4"]
    assert er.question_reply({"lesson": LESSON, "question": grid(1, None)}).photo is None


@respx.mock
async def test_after_an_answer_the_verdict_comes_first_and_the_next_picture_question_is_the_photo():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "exercise"}))
    verdict = {"correct": False, "given": "B", "correctAnswer": "A", "correctOption": 1, "explanation": None}
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"kind": "exercise", "done": False, "lesson": LESSON, "question": grid(2), "verdict": verdict}),
        ok({"kind": "exercise", "done": False, "lesson": LESSON, "question": grid(3, None), "verdict": {**verdict, "correct": True}}),
    ])
    c = coach()
    wrong = await c.handle("7", "2")
    assert len(wrong.before) == 1 and wrong.before[0].endswith("התשובה: 1) A")
    assert wrong.photo == SITE + PNG and "שאלה 2/10" in wrong.text and wrong.buttons == ["1", "2", "3", "4"]
    # A question without a picture: the verdict and the question in one message, as before.
    right = await c.handle("7", "1")
    assert right.photo is None and right.before == [] and right.text.startswith("✅ נכון!\n\n")


@respx.mock
async def test_a_hint_and_a_report_show_the_picture_question_again():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "exercise", "lesson": LESSON, "question": grid(4)}))
    respx.post(f"{API}/bot/session/answer").mock(return_value=ok(
        {"kind": "exercise", "hintAsked": True, "hint": "קודם x.", "lesson": LESSON, "question": grid(4)}))
    respx.post(f"{API}/bot/report").mock(return_value=ok(
        {"kind": "exercise", "reported": True, "duplicate": False, "reportedNumber": 3, "active": True}))
    c = coach()
    hint = await c.handle("7", "?")
    assert hint.text.startswith("💡 קודם x.") and hint.photo == SITE + PNG
    reported = await c.handle("7", "🚩 השאלה לא ברורה")
    assert reported.before == ["🚩 תודה! דיווחנו על שאלה 3 ונבדוק אותה."]
    assert reported.text.startswith("התרגיל ממשיך:") and reported.photo == SITE + PNG


class PhotoCoach:
    async def handle(self, chat_id, text):
        return Reply("שאלה 2/10\n1) A", ["1", "2"], before=["✅ נכון!"], photo=SITE + PNG)


def post(client):
    return client.post("/telegram/webhook", json={"update_id": 1, "message": {"chat": {"id": 42}, "text": "1"}},
                       headers={"X-Telegram-Bot-Api-Secret-Token": "hook-secret"})


@respx.mock
def test_the_webhook_sends_the_verdict_then_the_photo_with_the_question_and_buttons():
    send = respx.post(SEND).mock(return_value=httpx.Response(200, json={"ok": True}))
    photo = respx.post(PHOTO).mock(return_value=httpx.Response(200, json={"ok": True}))
    post(TestClient(create_app(PhotoCoach())))
    assert [json.loads(c.request.content)["text"] for c in send.calls] == ["✅ נכון!"]
    body = json.loads(photo.calls.last.request.content)
    assert body["chat_id"] == "42" and body["photo"] == SITE + PNG and body["caption"] == "שאלה 2/10\n1) A"
    assert body["reply_markup"]["keyboard"] == [[{"text": "1"}, {"text": "2"}]]


@respx.mock
async def test_a_refused_photo_still_sends_the_question_with_the_picture_link():
    send = respx.post(SEND).mock(return_value=httpx.Response(200, json={"ok": True}))
    respx.post(PHOTO).mock(return_value=httpx.Response(400, json={"ok": False}))
    assert await telegram.send_question_photo("42", SITE + PNG, "שאלה", ["1", "2"]) is True
    body = json.loads(send.calls.last.request.content)
    assert body["text"] == f"שאלה\n{SITE + PNG}" and body["reply_markup"]["keyboard"] == [[{"text": "1"}, {"text": "2"}]]


@respx.mock
async def test_a_question_too_long_for_a_caption_follows_the_photo():
    send = respx.post(SEND).mock(return_value=httpx.Response(200, json={"ok": True}))
    photo = respx.post(PHOTO).mock(return_value=httpx.Response(200, json={"ok": True}))
    text = "🎯" * 600  # 1200 UTF-16 units: over the caption limit, though 600 characters
    await telegram.send_question_photo("42", SITE + PNG, text, ["1"])
    sent = json.loads(photo.calls.last.request.content)
    assert "caption" not in sent and sent["reply_markup"] == {"remove_keyboard": True}
    assert json.loads(send.calls.last.request.content)["text"] == text


def test_every_real_picture_question_fits_a_caption_even_with_the_longest_intro():
    exercises = [e for e in json.loads(EXERCISES.read_text(encoding="utf-8")) if e.get("question_picture")]
    assert exercises
    intro = "🎯 מבחן הטעויות בחשבון: 20 שאלות מתוך 35 שמחכות. תשובה נכונה מתקנת את הטעות. ענו במספר התשובה, או /end כדי לעצור."
    for e in exercises:
        q = {"number": 10, "total": 10, "type": e["type"], "text": e["question_text_he"], "textEn": None,
             "options": e.get("options"), "picture": PNG}
        reply = er.question_reply({"lesson": {**LESSON, "title": "x" * 60}, "question": q}, intro)
        assert telegram._caption_fits(reply.text), e["id"]


class ToolCtx:
    def __init__(self):
        from google.adk.events.event_actions import EventActions
        self.state = {"chat_id": "7"}
        self.actions = EventActions()


class OneToolRunner:
    """The model calls one tool, and the tool's result comes back as an event."""
    def __init__(self, tool, ctx):
        self.tool, self.ctx = tool, ctx

    async def run_async(self, **_):
        from google.adk.events import Event
        from google.genai import types
        yield Event(author="practice_coach", content=types.Content(role="model", parts=[
            types.Part(function_call=types.FunctionCall(name=self.tool.__name__, args={}))]))
        result = await self.tool("math", self.ctx)
        yield Event(author="practice_coach", actions=self.ctx.actions, content=types.Content(role="user", parts=[
            types.Part(function_response=types.FunctionResponse(name=self.tool.__name__, response=result))]))


@respx.mock
async def test_through_the_agent_a_picture_question_goes_out_as_it_is_with_its_photo():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
    respx.post(f"{API}/bot/exercise/start").mock(side_effect=[
        ok({"kind": "exercise", "sessionId": "s", "lesson": LESSON, "question": grid(1)}),
        ok({"kind": "exercise", "sessionId": "s", "lesson": LESSON, "question": grid(1, None)}),
    ])
    c = coach()
    ctx = ToolCtx()
    c.runner = OneToolRunner(tools.start_lesson_exercise, ctx)
    reply = await c.handle("7", "אני רוצה לתרגל צירים")
    # The model cannot send a photo: the tool's reply goes out as it is.
    assert ctx.actions.skip_summarization is True
    assert reply.photo == SITE + PNG and reply.text.startswith(er.START_INTRO) and reply.buttons == ["1", "2", "3", "4"]
    # A question without a picture is still the model's to pass on.
    plain = await tools.start_lesson_exercise("math", ToolCtx())
    assert "direct" not in plain and plain["reply"].startswith(er.START_INTRO)
    assert replies.Reply("q").photo is None
