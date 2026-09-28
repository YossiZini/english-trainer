"""The coach: caps and the fast path never call the model."""
from datetime import date

import httpx
import respx

from app import config, replies
from app.api_client import TrainerApi
from app.coach import Coach
from app.limits import DailyTurnCounter


class NoAgentRunner:
    """Stands in for the ADK runner: any call is a test failure."""
    async def run_async(self, **_):
        raise AssertionError("the model must not be called on the fast path")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url="http://api.test/api", key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def test_daily_turn_counter_resets_per_day():
    counter = DailyTurnCounter(2)
    assert counter.allow("a", date(2026, 1, 1)) and counter.allow("a", date(2026, 1, 1))
    assert not counter.allow("a", date(2026, 1, 1))
    assert counter.allow("b", date(2026, 1, 1))
    assert counter.allow("a", date(2026, 1, 2))


@respx.mock
async def test_code_start_answer_and_end_take_the_fast_path():
    respx.post("http://api.test/api/bot/link").mock(return_value=httpx.Response(200, json={"success": True, "data": {"linked": True}}))
    respx.post("http://api.test/api/bot/session/start").mock(return_value=httpx.Response(200, json={"success": True, "data": {
        "sessionId": "s", "setup": "type", "options": [{"key": 1, "label": "כל המילים"}, {"key": 2, "label": "Band II"}]}}))
    respx.get("http://api.test/api/bot/session/status").mock(return_value=httpx.Response(200, json={"success": True, "data": {"active": True}}))
    respx.post("http://api.test/api/bot/session/answer").mock(side_effect=[
        httpx.Response(200, json={"success": True, "data": {"sessionId": "s", "setup": "level", "options": [{"key": 1, "label": "קל"}, {"key": 2, "label": "בינוני"}, {"key": 3, "label": "קשה"}]}}),
        httpx.Response(200, json={"success": True, "data": {"sessionId": "s", "started": True, "wordSet": "Band II", "level": "קל",
                                                             "word": {"id": "w", "english": "cat"}, "progress": {"round": 1, "index": 1, "total": 20, "failedInRound": 0}}}),
        httpx.Response(200, json={"success": True, "data": {
            "correct": True, "expected": None, "points": 1, "roundStarted": False, "done": False,
            "word": {"id": "w2", "english": "dog"}, "progress": {"round": 1, "index": 2, "total": 20, "failedInRound": 0}}}),
    ])
    respx.post("http://api.test/api/bot/session/end").mock(return_value=httpx.Response(200, json={"success": True, "data": {
        "done": True, "summary": {"words": 20, "rounds": 1, "correct": 1, "wrong": 0, "remainingFailed": 19}}}))
    c = coach()
    assert (await c.handle("7", "123456")).text == replies.LINKED
    setup = await c.handle("7", "מילים")
    assert setup.text.startswith("מתחילים תרגול של 20 מילים.\nאיזה מילים נתרגל?") and setup.buttons == ["1", "2"]
    level = await c.handle("7", "2")
    assert level.text.startswith("איזו רמה?") and level.buttons == ["1", "2", "3"]
    started = await c.handle("7", "1")
    assert started.text == "Band II, רמה קל. תרגמו לעברית:\n(1/20) cat" and started.buttons == []
    assert (await c.handle("7", "חתול")).text.startswith("✅ נכון! +1")
    assert "נשארו 19 מילים" in (await c.handle("7", "סיים")).text


@respx.mock
async def test_unlinked_chat_is_told_without_the_model():
    respx.get("http://api.test/api/bot/session/status").mock(return_value=httpx.Response(403, json={"code": "not_linked"}))
    assert (await c_handle("שלום")).text == replies.NOT_LINKED


async def c_handle(text):
    return await coach().handle("9", text)


async def test_turn_cap_short_circuits(monkeypatch):
    c = coach()
    c.turns = DailyTurnCounter(1)
    assert (await c.handle("5", "")).text == replies.HELP  # empty text never counts
    with respx.mock:
        respx.get("http://api.test/api/bot/session/status").mock(return_value=httpx.Response(200, json={"success": True, "data": {"active": False}}))
        respx.post("http://api.test/api/bot/session/start").mock(return_value=httpx.Response(200, json={"success": True, "data": {
            "sessionId": "s", "setup": "type", "options": [{"key": 1, "label": "כל המילים"}]}}))
        assert (await c.handle("5", "מילים")).text.startswith("מתחילים")
    assert (await c.handle("5", "מילים")).text == replies.RATE_LIMITED
