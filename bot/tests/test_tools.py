"""Tools and replies against a mocked trainer API."""
import httpx
import respx

from app import replies, tools
from app.api_client import TrainerApi


class Ctx:
    def __init__(self, chat_id="42"):
        self.state = {"chat_id": chat_id}


def api():
    return TrainerApi(base_url="http://api.test/api", key="test-key", client=httpx.AsyncClient())


@respx.mock
async def test_start_sends_key_and_chat_and_formats_first_word():
    route = respx.post("http://api.test/api/bot/session/start").mock(return_value=httpx.Response(200, json={
        "success": True, "data": {"sessionId": "s1", "setup": "level",
                                  "options": [{"key": 1, "label": "קל"}, {"key": 2, "label": "בינוני"}, {"key": 3, "label": "קשה"}]}}))
    tools.set_api(api())
    result = await tools.start_session(Ctx())
    assert result["reply"] == "מתחילים תרגול של 20 מילים.\nאיזו רמה?\n1. קל\n2. בינוני\n3. קשה"
    request = route.calls.last.request
    assert request.headers["X-Bot-Key"] == "test-key"
    assert b'"chatId": "42"' in request.content or b'"chatId":"42"' in request.content


@respx.mock
async def test_answer_wrong_shows_expected_and_round_start_and_done():
    tools.set_api(api())
    respx.post("http://api.test/api/bot/session/answer").mock(side_effect=[
        httpx.Response(200, json={"success": True, "data": {
            "correct": False, "expected": "תפוח", "roundStarted": True, "done": False,
            "word": {"id": "w2", "english": "dog"}, "progress": {"round": 2, "index": 1, "total": 3, "failedInRound": 0}}}),
        httpx.Response(200, json={"success": True, "data": {
            "correct": True, "expected": None, "points": 1, "roundStarted": False, "done": True, "word": None,
            "summary": {"words": 20, "rounds": 2, "correct": 20, "wrong": 3, "remainingFailed": 0, "points": 20, "totalPoints": 57}}}),
    ])
    first = (await tools.answer_word("שולחן", Ctx()))["reply"]
    assert first.startswith("💡 לא בדיוק. התרגום: תפוח")
    assert "חוזרים על 3 המילים" in first and first.endswith("(1/3) dog")
    done = (await tools.answer_word("כלב", Ctx()))["reply"]
    assert done.startswith("✅ נכון! +1") and "כל הכבוד" in done and "20 מילים" in done
    assert "⭐ צברתם 20 נקודות (סה\"כ 57)." in done


@respx.mock
async def test_error_codes_become_hebrew_replies():
    tools.set_api(api())
    respx.post("http://api.test/api/bot/session/start").mock(return_value=httpx.Response(403, json={"code": "not_linked"}))
    assert (await tools.start_session(Ctx()))["reply"] == replies.NOT_LINKED
    respx.post("http://api.test/api/bot/session/answer").mock(return_value=httpx.Response(404, json={"code": "no_session"}))
    assert (await tools.answer_word("x", Ctx()))["reply"] == replies.NO_SESSION
    respx.post("http://api.test/api/bot/session/end").mock(return_value=httpx.Response(429, json={"message": "מכסה"}))
    assert (await tools.end_session(Ctx()))["reply"] == "מכסה"
    respx.post("http://api.test/api/bot/link").mock(return_value=httpx.Response(400, json={"code": "bad_code"}))
    assert (await tools.link_account("000000", Ctx()))["reply"] == replies.BAD_CODE
    respx.get("http://api.test/api/bot/session/status").mock(side_effect=httpx.ConnectError("down"))
    assert (await tools.session_status(Ctx()))["reply"] == replies.UNREACHABLE
