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
        "📘 חלקי הדיבור · שאלה 1/10", 'מהו חלק הדיבור של "book"?', "1) Noun", "2) Verb", "3) Adjective", "4) Adverb"]
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
    assert wrong.text.endswith("כתבו את התשובה:") and wrong.buttons == []  # fill-in: keyboard removed
    right = await c.handle("7", "1")
    assert right.text.startswith("✅ נכון!") and right.buttons == ["1", "2", "3", "4"]


def test_final_summary_and_early_end():
    done = er.exercise_answer_reply({
        "kind": "exercise", "done": True, "lesson": LESSON,
        "verdict": {"correct": True, "correctAnswer": "x"},
        "result": {"score": 90, "passed": True, "correct": 9, "total": 10, "pointsEarned": 10, "totalPoints": 57,
                   "nextLesson": {"id": "L2", "title": "מבנה המשפט"}, "nextDifficulty": "medium"}})
    assert '🏁 סיימתם את "חלקי הדיבור": 9/10 נכונות, ציון 90.' in done.text
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
