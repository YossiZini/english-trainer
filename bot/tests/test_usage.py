"""/usage: every student's participation in the last 7 and 30 days (a fake API)."""
import httpx
import respx

from app.api_client import TrainerApi
from app.coach import Coach, parse_command
from app.usage_replies import FSI, MAX_CHARS, NOBODY, NOTHING, PDI, RLM, usage_reply

API = "http://api.test/api"
WINDOWS = {"week": {"from": "2026-06-09", "to": "2026-06-15"}, "month": {"from": "2026-05-17", "to": "2026-06-15"}}
ZERO = {"activeDays": 0, "lessons": 0, "words": 0, "reading": 0, "drill": 0, "division": 0}


class NoAgentRunner:
    async def run_async(self, **_):
        raise AssertionError("/usage never goes through the chat agent")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def student(name, week=None, month=None, last="2026-06-15"):
    return {"name": name,
            "week": week or {"activeDays": 2, "lessons": 1, "words": 3, "reading": 1, "drill": 10, "division": 4},
            "month": month or {"activeDays": 3, "lessons": 2, "words": 3, "reading": 1, "drill": 24, "division": 7},
            "lastActive": last}


def ok(data):
    return {"ok": True, "status": 200, "data": data}


def test_parse_usage():
    assert parse_command("/usage") == ("usage", {})
    assert parse_command("usage") == ("usage", {})


def test_one_block_per_student_the_week_then_the_month_in_words_without_scores():
    omer = student("omer", week=ZERO, month={**ZERO, "activeDays": 1, "lessons": 1}, last="2026-05-17")
    reply = usage_reply(ok({"windows": WINDOWS, "students": [student("dana"), omer], "inactive": 2}))
    assert reply.text.split("\n") == [
        "📊 מי תרגל",
        "השבוע: 09.06 עד 15.06",
        "החודש: 17.05 עד 15.06",
        "",
        f"{RLM}👤 {FSI}dana{PDI} · תרגול אחרון: 15.06",
        "השבוע: 2 ימים · שיעור אחד · 3 מילים · קטע קריאה אחד · 10 תרגילי כפל · 4 תרגילי חילוק",
        "החודש: 3 ימים · 2 שיעורים · 3 מילים · קטע קריאה אחד · 24 תרגילי כפל · 7 תרגילי חילוק",
        "",
        f"{RLM}👤 {FSI}omer{PDI} · תרגול אחרון: 17.05",
        f"השבוע: {NOTHING}",
        "החודש: יום אחד · שיעור אחד",
        "",
        "2 תלמידים לא תרגלו ב-30 הימים האחרונים.",
    ]
    assert "ציון" not in reply.text and "|" not in reply.text and reply.buttons == []


def test_what_a_student_did_not_do_is_left_out():
    old = student("dana", week={"activeDays": 1, "words": 1}, month={"activeDays": 4, "words": 12})
    lines = usage_reply(ok({"windows": WINDOWS, "students": [old], "inactive": 0})).text.split("\n")
    assert lines[5:7] == ["השבוע: יום אחד · מילה אחת", "החודש: 4 ימים · 12 מילים"]


def test_a_hebrew_or_english_name_cannot_turn_the_line_around():
    # The line starts with a right-to-left mark (its first letter sets its direction); the name is isolated.
    reply = usage_reply(ok({"windows": WINDOWS, "students": [student("Dana Levi"), student("אלונה")], "inactive": 0}))
    assert f"\n{RLM}👤 {FSI}Dana Levi{PDI} · " in reply.text and f"\n{RLM}👤 {FSI}אלונה{PDI} · " in reply.text


def test_long_lists_are_cut_to_30_students_and_one_message():
    many = [student(f"student number {i} with a very long name indeed") for i in range(45)]
    reply = usage_reply(ok({"windows": WINDOWS, "students": many, "inactive": 0}))
    assert len(reply.text) <= MAX_CHARS
    shown = [l for l in reply.text.split("\n") if l.startswith(f"{RLM}👤")]
    assert 0 < len(shown) <= 30
    assert reply.text.endswith(f"ועוד {45 - len(shown)} תלמידים.")
    assert "…" in shown[0]  # long names are shortened


def test_one_inactive_student_is_said_in_the_singular():
    reply = usage_reply(ok({"windows": WINDOWS, "students": [student("dana")], "inactive": 1}))
    assert reply.text.endswith("תלמיד אחד לא תרגל ב-30 הימים האחרונים.")


def test_nobody_active_and_errors():
    assert NOBODY in usage_reply(ok({"windows": WINDOWS, "students": [], "inactive": 3})).text
    assert "לא מחובר" in usage_reply({"ok": False, "code": "not_linked"}).text


@respx.mock
async def test_usage_command_calls_the_api():
    route = respx.get(f"{API}/bot/usage").mock(return_value=httpx.Response(200, json={
        "success": True, "data": {"windows": WINDOWS, "students": [student("dana")], "inactive": 0}}))
    reply = await coach().handle("7", "/usage")
    assert route.calls.last.request.url.params["chatId"] == "7"
    assert f"{RLM}👤 {FSI}dana{PDI}" in reply.text
