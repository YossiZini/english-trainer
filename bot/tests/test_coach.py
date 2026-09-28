"""The coach: caps and the fast path never call the agent."""
from datetime import date

import httpx
import respx

from app import replies
from app.api_client import TrainerApi
from app.coach import Coach
from app.limits import DailyTurnCounter

API = "http://api.test/api"
WORD = {"id": "w", "english": "cat"}


class NoAgentRunner:
    """Stands in for the ADK runner: any call is a test failure."""
    async def run_async(self, **_):
        raise AssertionError("the agent must not be called on the fast path")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def ok(data):
    return httpx.Response(200, json={"success": True, "data": data})


def progress(i):
    return {"round": 1, "index": i, "total": 20, "failedInRound": 0}


def test_daily_turn_counter_resets_per_day():
    counter = DailyTurnCounter(2)
    assert counter.allow("a", date(2026, 1, 1)) and counter.allow("a", date(2026, 1, 1))
    assert not counter.allow("a", date(2026, 1, 1))
    assert counter.allow("b", date(2026, 1, 1))
    assert counter.allow("a", date(2026, 1, 2))


@respx.mock
async def test_code_start_level_answer_and_end_take_the_fast_path():
    respx.post(f"{API}/bot/link").mock(return_value=ok({"linked": True}))
    respx.post(f"{API}/bot/session/start").mock(return_value=ok({
        "sessionId": "s", "setup": "level", "options": [{"key": 1, "label": "קל"}, {"key": 2, "label": "בינוני"}, {"key": 3, "label": "קשה"}]}))
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"sessionId": "s", "started": True, "level": "קל", "word": WORD, "progress": progress(1)}),
        ok({"correct": True, "judged": False, "expected": None, "points": 1, "roundStarted": False, "done": False,
            "word": {"id": "w2", "english": "dog"}, "progress": progress(2)}),
    ])
    respx.post(f"{API}/bot/session/end").mock(return_value=ok({
        "done": True, "summary": {"words": 20, "rounds": 1, "correct": 1, "wrong": 0, "remainingFailed": 19}}))
    c = coach()
    assert (await c.handle("7", "123456")).text == replies.LINKED
    setup = await c.handle("7", "/words")
    assert setup.text == "מתחילים תרגול של 20 מילים.\nאיזו רמה?\n1. קל\n2. בינוני\n3. קשה" and setup.buttons == ["1", "2", "3"]
    started = await c.handle("7", "1")
    assert started.text == "רמה קל. תרגמו לעברית (\"?\" למשפט לדוגמה):\n(1/20) cat" and started.buttons == []
    assert (await c.handle("7", "חתול")).text.startswith("✅ נכון! +1")
    assert "נשארו 19 מילים" in (await c.handle("7", "end")).text


@respx.mock
async def test_an_answer_the_api_accepted_through_gemini_shows_the_dictionary_word():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True}))
    route = respx.post(f"{API}/bot/session/answer").mock(return_value=ok({
        "correct": True, "judged": True, "expected": "חתול", "points": 1, "roundStarted": False, "done": False,
        "word": {"id": "w2", "english": "dog"}, "progress": progress(2)}))
    reply = await coach().handle("7", "חתלתול")
    assert reply.text == "✅ נכון! +1\nבמילון: חתול\n(2/20) dog"
    assert __import__("json").loads(route.calls.last.request.content) == {"chatId": "7", "text": "חתלתול"}


@respx.mock
async def test_unlinked_chat_is_told_without_the_model():
    respx.get(f"{API}/bot/session/status").mock(return_value=httpx.Response(403, json={"code": "not_linked"}))
    assert (await coach().handle("9", "שלום")).text == replies.NOT_LINKED


async def test_turn_cap_short_circuits():
    c = coach()
    c.turns = DailyTurnCounter(1)
    assert (await c.handle("5", "")).text == replies.HELP  # empty text never counts
    with respx.mock:
        respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
        respx.post(f"{API}/bot/session/start").mock(return_value=ok({
            "sessionId": "s", "setup": "level", "options": [{"key": 1, "label": "קל"}]}))
        assert (await c.handle("5", "words")).text.startswith("מתחילים")
    assert (await c.handle("5", "words")).text == replies.RATE_LIMITED


@respx.mock
async def test_question_mark_shows_the_example_sentence_and_repeats_the_word():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"example": True, "sentence": "The cat is sleeping.", "word": WORD, "progress": progress(1)}),
        ok({"example": True, "sentence": None, "word": WORD, "progress": progress(1)}),
    ])
    c = coach()
    assert (await c.handle("7", "?")).text == "💡 The cat is sleeping.\n(1/20) cat"
    assert (await c.handle("7", "?")).text == replies.NO_EXAMPLE + "\n(1/20) cat"
