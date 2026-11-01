"""/kefel, the multiplication-table drill: command, typed answers, verdicts, the count."""
import json

import httpx
import respx

from app import drill_replies as dr
from app import replies, tools
from app.api_client import TrainerApi
from app.coach import Coach, parse_command
from app.encouragement import LINES

API = "http://api.test/api"
LRI, PDI = "⁦", "⁩"


class NoAgentRunner:
    async def run_async(self, **_):
        raise AssertionError("the drill never goes through the model")
        yield  # pragma: no cover


def coach():
    c = Coach(api=TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()), agent=None)
    c.runner = NoAgentRunner()
    return c


def ok(data):
    return httpx.Response(200, json={"success": True, "data": data})


def question(number, text="7 × 8"):
    return {"number": number, "total": 10, "type": "number", "text": f"{LRI}{text} = ?{PDI}"}


def fact(text):
    return f"{LRI}{text}{PDI}"


def drill_status(number=3):
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "drill", "sessionId": "d", "question": question(number)}))


def test_kefel_is_a_command_with_or_without_slash():
    for text in ("/kefel", "kefel", "KEFEL", "/kefel@trainer_bot"):
        assert parse_command(text) == ("drill", {}), text
    assert parse_command("kefel 3") is None


@respx.mock
async def test_kefel_starts_ten_questions_without_buttons():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))
    route = respx.post(f"{API}/bot/drill/start").mock(return_value=ok(
        {"kind": "drill", "sessionId": "d", "question": question(1)}))
    for text in ("/kefel", "kefel"):
        reply = await coach().handle("7", text)
        assert json.loads(route.calls.last.request.content) == {"chatId": "7"}
        assert reply.text == f"{dr.START_INTRO}\n🔢 תרגיל 1/10\n{LRI}7 × 8 = ?{PDI}"
        assert reply.buttons == []  # typed answers: the keyboard goes away


@respx.mock
async def test_every_message_in_a_drill_is_an_answer_but_slash_commands_still_work():
    drill_status()
    answer = respx.post(f"{API}/bot/session/answer").mock(return_value=ok(
        {"kind": "drill", "notNumber": True, "question": question(3)}))
    c = coach()
    # Bare command words are typed answers here (the API asks again), like in a fill-in question.
    for text in ("help", "kefel", "math"):
        reply = await c.handle("7", text)
        assert json.loads(answer.calls.last.request.content) == {"chatId": "7", "text": text}
        assert reply.text == f"{dr.NOT_NUMBER}\n🔢 תרגיל 3/10\n{LRI}7 × 8 = ?{PDI}"
    assert answer.call_count == 3
    assert (await c.handle("7", "/help")).text == replies.HELP
    assert answer.call_count == 3


@respx.mock
async def test_verdicts_right_and_wrong_then_the_next_question():
    drill_status()
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"kind": "drill", "done": False, "question": question(4, "54 ÷ 9"),
            "verdict": {"correct": False, "given": "54", "correctAnswer": 56, "fact": fact("7 × 8 = 56"),
                        "wrongCount": 1, "wrongStreak": 1}}),
        ok({"kind": "drill", "done": False, "question": question(5, "6 × 6"),
            "verdict": {"correct": True, "given": "6", "correctAnswer": 6, "fact": fact("54 ÷ 9 = 6"),
                        "wrongCount": 1, "wrongStreak": 0}}),
    ])
    c = coach()
    wrong = await c.handle("7", "54")
    assert wrong.text == f"{LINES[0]}\nהתשובה: {fact('7 × 8 = 56')}\n\n🔢 תרגיל 4/10\n{LRI}54 ÷ 9 = ?{PDI}"
    right = await c.handle("7", "6")
    assert right.text == f"✅ נכון!\n\n🔢 תרגיל 5/10\n{LRI}6 × 6 = ?{PDI}"
    assert right.buttons == []


def test_the_last_answer_gives_the_count_kind_words_and_the_facts_to_review():
    done = dr.drill_answer_reply({
        "kind": "drill", "done": True,
        "verdict": {"correct": True, "fact": fact("9 × 9 = 81")},
        "result": {"correct": 8, "total": 10, "missed": [fact("7 × 8 = 56"), fact("54 ÷ 9 = 6")]}})
    assert done.text == "\n".join([
        "✅ נכון!", "",
        "🏁 סיימתם: 8 מתוך 10 נכונות. כל הכבוד! 👏 כמעט הכול.",
        "לחזרה:", f"• {fact('7 × 8 = 56')}", f"• {fact('54 ÷ 9 = 6')}",
        "כתבו /kefel לסיבוב נוסף."])
    perfect = dr.result_text({"correct": 10, "total": 10, "missed": []})
    assert "מושלם" in perfect and "לחזרה" not in perfect
    assert "יפה מאוד" in dr.result_text({"correct": 5, "total": 10, "missed": []})
    assert "התחלה טובה" in dr.result_text({"correct": 4, "total": 10, "missed": []})
    assert "התחלה טובה" in dr.result_text({"correct": 0, "total": 10, "missed": []})


@respx.mock
async def test_end_and_status_of_a_drill():
    respx.post(f"{API}/bot/session/end").mock(return_value=ok(
        {"kind": "drill", "done": True, "ended": True, "answered": 3, "correct": 2, "total": 10}))
    ended = await coach().handle("7", "/end")
    assert ended.text == "עצרנו את לוח הכפל (3/10 תרגילים, 2 נכונות). כתבו /kefel כדי להתחיל סיבוב חדש."
    drill_status(6)
    status = replies.status_reply(await TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()).status("7"))
    assert status.text == f"התרגול ממשיך:\n🔢 תרגיל 6/10\n{LRI}7 × 8 = ?{PDI}"


@respx.mock
async def test_errors_and_the_agent_tool():
    respx.post(f"{API}/bot/drill/start").mock(side_effect=[
        httpx.Response(403, json={"code": "not_linked"}),
        httpx.Response(429, json={"message": "הגעת למכסת ההודעות היומית. נמשיך מחר!"}),
        ok({"kind": "drill", "sessionId": "d", "question": question(1)}),
    ])
    tools.set_api(TrainerApi(base_url=API, key="k", client=httpx.AsyncClient()))

    class Ctx:
        state = {"chat_id": "7"}

    assert (await tools.start_kefel_drill(Ctx()))["reply"] == replies.NOT_LINKED
    assert (await tools.start_kefel_drill(Ctx()))["reply"] == "הגעת למכסת ההודעות היומית. נמשיך מחר!"
    assert (await tools.start_kefel_drill(Ctx()))["reply"].startswith(dr.START_INTRO)
    assert tools.start_kefel_drill in tools.TOOLS


def test_help_and_the_pointers_name_kefel():
    assert "🔢 לוח הכפל: /kefel" in replies.HELP
    assert "/kefel" in replies.NO_SESSION and "/kefel" in replies.LINKED
