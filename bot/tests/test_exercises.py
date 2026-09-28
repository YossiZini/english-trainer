"""Lesson exercises in the bot: commands, 1..n buttons, verdicts, summary."""
import json

import httpx
import respx

from app import exercise_replies as er
from app.api_client import TrainerApi
from app.coach import Coach

API = "http://api.test/api"
LESSON = {"id": "L1", "title": "חלקי הדיבור", "subject": "english", "difficulty": "easy"}


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


def mc(number, options):
    return {"number": number, "total": 10, "type": "multiple_choice", "text": 'מהו חלק הדיבור של "book"?',
            "textEn": None, "options": options}


def fill(number):
    return {"number": number, "total": 10, "type": "fill_in_blank", "text": "3/4 + 1/4 = ?", "textEn": None, "options": None}


@respx.mock
async def test_command_starts_the_subject_lesson_with_numbered_options_and_buttons():
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": LESSON, "question": mc(1, ["Noun", "Verb", "Adjective", "Adverb"])}))
    reply = await coach().handle("7", "תרגיל אנגלית")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "english"}
    assert reply.text.splitlines()[1:] == [
        "📘 חלקי הדיבור · קל · שאלה 1/10", 'מהו חלק הדיבור של "book"?', "1) Noun", "2) Verb", "3) Adjective", "4) Adverb"]
    assert reply.buttons == ["1", "2", "3", "4"]

    respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": {**LESSON, "subject": "math"}, "question": mc(1, ["1/2", "1/3", "2/3"])}))
    three = await coach().handle("7", "תרגיל חשבון")
    assert three.buttons == ["1", "2", "3"]


@respx.mock
async def test_answers_go_to_the_open_exercise_and_show_the_verdict():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "exercise"}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok({"kind": "exercise", "chooseNumber": True, "lesson": LESSON, "question": mc(1, ["Noun", "Verb", "Adjective", "Adverb"])}),
        ok({"kind": "exercise", "done": False, "lesson": LESSON, "question": fill(2),
            "verdict": {"correct": False, "given": "Verb", "correctAnswer": "Noun", "correctOption": 1,
                        "explanation": "book הוא שם עצם."}}),
        ok({"kind": "exercise", "done": False, "lesson": LESSON, "question": mc(3, ["a", "b", "c", "d"]),
            "verdict": {"correct": True, "given": "1", "correctAnswer": "1", "correctOption": None, "explanation": None}}),
    ])
    c = coach()
    again = await c.handle("7", "goes")
    assert again.text.startswith("ענו במספר בין 1 ל-4:") and again.buttons == ["1", "2", "3", "4"]
    wrong = await c.handle("7", "2")
    assert wrong.text.startswith("❌ לא נכון. התשובה: 1) Noun\n💡 book הוא שם עצם.")
    assert wrong.text.endswith('כתבו את התשובה ("?" לרמז):') and wrong.buttons == []  # fill-in: keyboard removed
    right = await c.handle("7", "1")
    assert right.text.startswith("✅ נכון!") and right.buttons == ["1", "2", "3", "4"]


def test_final_summary_and_early_end():
    done = er.exercise_answer_reply({
        "kind": "exercise", "done": True, "lesson": LESSON,
        "verdict": {"correct": True, "correctAnswer": "x"},
        "result": {"score": 90, "passed": True, "correct": 9, "total": 10, "pointsEarned": 10, "totalPoints": 57,
                   "nextLesson": {"id": "L2", "title": "מבנה המשפט"}, "nextDifficulty": "medium"}})
    assert '🏁 סיימתם את "חלקי הדיבור" (רמה: קל): 9/10 נכונות, ציון 90.' in done.text
    assert "רוצים אתגר" not in done.text  # no list number known
    assert "עברתם את השיעור!" in done.text and "⭐ +10 נקודות (סה\"כ 57)." in done.text
    assert 'השיעור הבא: מבנה המשפט. כתבו "תרגיל אנגלית" כדי להמשיך.' in done.text

    failed = er.result_text({"lesson": {**LESSON, "subject": "math"}, "result": {
        "score": 40, "passed": False, "correct": 4, "total": 10, "pointsEarned": -8, "totalPoints": 30, "nextLesson": None}})
    assert "כדי לעבור צריך ציון 70" in failed and "⭐ -8 נקודות" in failed and 'כתבו "תרגיל חשבון"' in failed

    ended = er.exercise_answer_reply({"kind": "exercise", "done": True, "ended": True, "lesson": LESSON,
                                      "answered": 3, "correct": 2, "total": 10})
    assert ended.text.startswith('עצרנו באמצע "חלקי הדיבור" (3/10 שאלות, 2 נכונות).')


@respx.mock
async def test_errors_become_hebrew_replies():
    respx.post(f"{API}/bot/exercise/start").mock(return_value=httpx.Response(409, json={"code": "all_done"}))
    assert (await coach().handle("7", "תרגיל חשבון")).text == er.ALL_DONE


def page(n, pages=10, statuses=("done", "next", "open")):
    items = [{"n": (n - 1) * 10 + i + 1, "id": f"L{i}", "title": f"שיעור {i}", "status": statuses[i] if i < len(statuses) else "open"}
             for i in range(3)]
    return {"kind": "exercise", "pick": True, "sessionId": "s", "subject": "math", "page": n, "pages": pages, "count": 97, "items": items}


@respx.mock
async def test_lesson_list_marks_paging_and_pick():
    route = respx.post(f"{API}/bot/exercise/lessons").mock(return_value=ok(page(1)))
    listed = await coach().handle("7", "שיעורים חשבון")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "math"}
    assert listed.text.splitlines()[:4] == ["📚 שיעורי חשבון · עמוד 1/10", "1. ✅ שיעור 0", "2. ▶️ שיעור 1", "3. שיעור 2"]
    assert listed.buttons == ["עוד"]

    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "exercise", "pick": True}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok(page(2, statuses=())),
        ok({**page(2, statuses=()), "invalid": True}),
        ok({"kind": "exercise", "sessionId": "s2", "lesson": LESSON, "question": mc(1, ["a", "b", "c", "d"])}),
        httpx.Response(409, json={"code": "no_exercises"}),
    ])
    c = coach()
    more = await c.handle("7", "עוד")
    assert more.text.splitlines()[1] == "11. שיעור 0" and more.buttons == ["הקודם", "עוד"]
    bad = await c.handle("7", "999")
    assert bad.text.startswith(er.PICK_INVALID)
    picked = await c.handle("7", "12")
    assert picked.text.startswith(er.START_INTRO) and picked.buttons == ["1", "2", "3", "4"]
    assert (await c.handle("7", "13")).text == er.NO_EXERCISES

    assert er.exercise_end_reply({"kind": "exercise", "ended": True, "pickClosed": True}).text == er.PICK_CLOSED
    assert er.lesson_list_text(page(10)).buttons == ["הקודם"]


@respx.mock
async def test_numbered_command_starts_that_lesson():
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": LESSON, "question": fill(1)}))
    reply = await coach().handle("7", "תרגיל אנגלית 12")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "english", "number": 12}
    assert reply.text.startswith(er.START_INTRO)


def test_hint_repeats_the_question():
    data = {"kind": "exercise", "hintAsked": True, "hint": "חשבו על המכנה.", "lesson": LESSON, "question": mc(2, ["a", "b", "c"])}
    reply = er.exercise_answer_reply(data)
    assert reply.text.startswith("💡 חשבו על המכנה.\n📘 חלקי הדיבור · שאלה 2/10") and reply.buttons == ["1", "2", "3"]
    assert er.exercise_answer_reply({**data, "hint": None}).text.startswith(er.NO_HINT)


def test_passed_lesson_suggests_the_next_level():
    lesson = {**LESSON, "number": 12, "difficulty": "medium"}
    text = er.result_text({"lesson": lesson, "result": {"score": 80, "passed": True, "correct": 8, "total": 10,
                                                         "pointsEarned": 7, "totalPoints": 20, "nextDifficulty": "hard"}})
    assert '(רמה: בינוני)' in text and 'כתבו "תרגיל אנגלית 12 קשה" לאותו שיעור ברמה קשה.' in text
    hardest = er.result_text({"lesson": {**lesson, "difficulty": "hard"}, "result": {
        "score": 80, "passed": True, "correct": 8, "total": 10, "pointsEarned": 7, "totalPoints": 20, "nextDifficulty": None}})
    assert "רוצים אתגר" not in hardest


def test_exercise_command_parsing():
    parse = Coach.exercise_command
    assert parse("תרגיל אנגלית") == {"subject": "english", "number": None, "difficulty": None}
    assert parse("תרגיל חשבון קשה") == {"subject": "math", "number": None, "difficulty": "hard"}
    assert parse("תרגיל אנגלית 12 בינוני") == {"subject": "english", "number": 12, "difficulty": "medium"}
    assert parse("תרגיל אנגלית 12") == {"subject": "english", "number": 12, "difficulty": None}
    assert parse("תרגיל אנגלית מחר") is None
    assert parse("חשבון") is None and parse("מילים") is None


@respx.mock
async def test_difficulty_goes_to_the_api():
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": {**LESSON, "difficulty": "hard"}, "question": fill(1)}))
    reply = await coach().handle("7", "תרגיל אנגלית 3 קשה")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "english", "number": 3, "difficulty": "hard"}
    assert "📘 חלקי הדיבור · קשה · שאלה 1/10" in reply.text
