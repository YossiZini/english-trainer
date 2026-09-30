"""/usage: every student's participation in the last 7 and 30 days (a fake API)."""
import httpx
import respx

from app.api_client import TrainerApi
from app.coach import Coach, parse_command
from app.usage_replies import MAX_CHARS, NOBODY, usage_reply

API = "http://api.test/api"
WINDOWS = {"week": {"from": "2026-06-09", "to": "2026-06-15"}, "month": {"from": "2026-05-17", "to": "2026-06-15"}}


class NoAgentRunner:
    async def run_async(self, **_):
        raise AssertionError("/usage never goes through the chat agent")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def student(name, week_days=2, month_days=3, last="2026-06-15"):
    return {"name": name, "week": {"activeDays": week_days, "lessons": 1, "words": 3, "reading": 1},
            "month": {"activeDays": month_days, "lessons": 2, "words": 3, "reading": 1}, "lastActive": last}


def ok(data):
    return {"ok": True, "status": 200, "data": data}


def test_parse_usage():
    assert parse_command("/usage") == ("usage", {})
    assert parse_command("usage") == ("usage", {})


def test_one_line_per_student_week_then_month_without_scores():
    reply = usage_reply(ok({"windows": WINDOWS, "students": [student("dana"), student("omer", 0, 1, "2026-05-17")], "inactive": 2}))
    lines = reply.text.split("\n")
    assert lines[0] == "📊 מי תרגל: שבוע (09.06–15.06) | חודש (17.05–15.06)"
    assert lines[1] == "המספרים: השבוע|החודש"
    assert lines[2] == "1. dana: ימים 2|3 · שיעורים 1|2 · מילים 3|3 · קריאה 1|1 · אחרון 15.06"
    assert lines[3].startswith("2. omer: ימים 0|1") and lines[3].endswith("אחרון 17.05")
    assert lines[4] == "2 תלמידים לא תרגלו ב-30 הימים האחרונים."
    assert "ציון" not in reply.text and reply.buttons == []


def test_long_lists_are_cut_to_30_lines_and_one_message():
    many = [student(f"student number {i} with a very long name indeed") for i in range(45)]
    reply = usage_reply(ok({"windows": WINDOWS, "students": many, "inactive": 0}))
    assert len(reply.text) <= MAX_CHARS
    shown = [l for l in reply.text.split("\n") if l[:1].isdigit() and ". " in l]
    assert 0 < len(shown) <= 30
    assert reply.text.endswith(f"ועוד {45 - len(shown)} תלמידים.")
    assert "…" in shown[0]  # long names are shortened


def test_nobody_active_and_errors():
    assert NOBODY in usage_reply(ok({"windows": WINDOWS, "students": [], "inactive": 3})).text
    assert "לא מחובר" in usage_reply({"ok": False, "code": "not_linked"}).text


@respx.mock
async def test_usage_command_calls_the_api():
    route = respx.get(f"{API}/bot/usage").mock(return_value=httpx.Response(200, json={
        "success": True, "data": {"windows": WINDOWS, "students": [student("dana")], "inactive": 0}}))
    reply = await coach().handle("7", "/usage")
    assert route.calls.last.request.url.params["chatId"] == "7"
    assert "1. dana:" in reply.text
