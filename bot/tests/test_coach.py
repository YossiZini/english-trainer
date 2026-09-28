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
        "sessionId": "s", "word": {"id": "w", "english": "cat"}, "progress": {"round": 1, "index": 1, "total": 20, "failedInRound": 0}}}))
    respx.get("http://api.test/api/bot/session/status").mock(return_value=httpx.Response(200, json={"success": True, "data": {"active": True}}))
    respx.post("http://api.test/api/bot/session/answer").mock(return_value=httpx.Response(200, json={"success": True, "data": {
        "correct": True, "expected": None, "roundStarted": False, "done": False,
        "word": {"id": "w2", "english": "dog"}, "progress": {"round": 1, "index": 2, "total": 20, "failedInRound": 0}}}))
    respx.post("http://api.test/api/bot/session/end").mock(return_value=httpx.Response(200, json={"success": True, "data": {
        "done": True, "summary": {"words": 20, "rounds": 1, "correct": 1, "wrong": 0, "remainingFailed": 19}}}))
    c = coach()
    assert await c.handle("7", "123456") == replies.LINKED
    assert (await c.handle("7", "מילים")).endswith("(1/20) cat")
    assert (await c.handle("7", "חתול")).startswith("✅ נכון!")
    assert "נשארו 19 מילים" in await c.handle("7", "סיים")


@respx.mock
async def test_unlinked_chat_is_told_without_the_model():
    respx.get("http://api.test/api/bot/session/status").mock(return_value=httpx.Response(403, json={"code": "not_linked"}))
    assert await c_handle("שלום") == replies.NOT_LINKED


async def c_handle(text):
    return await coach().handle("9", text)


async def test_turn_cap_short_circuits(monkeypatch):
    c = coach()
    c.turns = DailyTurnCounter(1)
    assert await c.handle("5", "") == replies.HELP  # empty text never counts
    with respx.mock:
        respx.get("http://api.test/api/bot/session/status").mock(return_value=httpx.Response(200, json={"success": True, "data": {"active": False}}))
        respx.post("http://api.test/api/bot/session/start").mock(return_value=httpx.Response(200, json={"success": True, "data": {
            "sessionId": "s", "word": {"id": "w", "english": "cat"}, "progress": {"round": 1, "index": 1, "total": 20, "failedInRound": 0}}}))
        assert (await c.handle("5", "מילים")).startswith("מתחילים")
    assert await c.handle("5", "מילים") == replies.RATE_LIMITED
