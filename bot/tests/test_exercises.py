"""Lesson exercises in the bot: commands, 1..n buttons, verdicts, summary."""
import json

import httpx
import respx

from app import exercise_replies as er
from app.api_client import TrainerApi
from app import replies
from app.coach import Coach, parse_command

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


def no_session():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": False}))


def mc(number, options):
    return {"number": number, "total": 10, "type": "multiple_choice", "text": 'מהו חלק הדיבור של "book"?',
            "textEn": None, "options": options}


def fill(number):
    return {"number": number, "total": 10, "type": "fill_in_blank", "text": "3/4 + 1/4 = ?", "textEn": None, "options": None}


@respx.mock
async def test_command_starts_the_subject_lesson_with_numbered_options_and_buttons():
    no_session()
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": LESSON, "question": mc(1, ["Noun", "Verb", "Adjective", "Adverb"])}))
    reply = await coach().handle("7", "/english")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "english"}
    assert reply.text.splitlines()[1:] == [
        "📘 חלקי הדיבור · קל · שאלה 1/10", 'מהו חלק הדיבור של "book"?', "1) Noun", "2) Verb", "3) Adjective", "4) Adverb"]
    assert reply.buttons == ["1", "2", "3", "4"]

    respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": {**LESSON, "subject": "math"}, "question": mc(1, ["1/2", "1/3", "2/3"])}))
    three = await coach().handle("7", "math")
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
    from app.encouragement import LINES
    assert wrong.text.startswith(f"{LINES[0]}\nהתשובה: 1) Noun\n📖 book הוא שם עצם.")
    assert wrong.text.endswith("כתבו את התשובה (? לרמז):") and wrong.buttons == []  # fill-in: keyboard removed
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
    assert 'השיעור הבא: מבנה המשפט. כתבו /english כדי להמשיך.' in done.text

    failed = er.result_text({"lesson": {**LESSON, "subject": "math"}, "result": {
        "score": 40, "passed": False, "correct": 4, "total": 10, "pointsEarned": -8, "totalPoints": 30, "nextLesson": None}})
    assert "כדי לעבור צריך ציון 70" in failed and "⭐ -8 נקודות" in failed and 'כתבו /math' in failed

    ended = er.exercise_answer_reply({"kind": "exercise", "done": True, "ended": True, "lesson": LESSON,
                                      "answered": 3, "correct": 2, "total": 10})
    assert ended.text.startswith('עצרנו באמצע "חלקי הדיבור" (3/10 שאלות, 2 נכונות).')


@respx.mock
async def test_errors_become_hebrew_replies():
    no_session()
    respx.post(f"{API}/bot/exercise/start").mock(return_value=httpx.Response(409, json={"code": "all_done"}))
    assert (await coach().handle("7", "math")).text == er.ALL_DONE


def page(n, pages=10, statuses=("done", "next", "open")):
    items = [{"n": (n - 1) * 10 + i + 1, "id": f"L{i}", "title": f"שיעור {i}", "status": statuses[i] if i < len(statuses) else "open"}
             for i in range(3)]
    return {"kind": "exercise", "pick": True, "sessionId": "s", "subject": "math", "page": n, "pages": pages, "count": 97, "items": items}


@respx.mock
async def test_lesson_list_marks_paging_and_pick():
    route = respx.post(f"{API}/bot/exercise/lessons").mock(return_value=ok(page(1)))
    listed = await coach().handle("7", "/lessons_math")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "math"}
    assert listed.text.splitlines()[:4] == ["📚 שיעורי חשבון · עמוד 1/10", "1. ✅ שיעור 0", "2. ▶️ שיעור 1", "3. שיעור 2"]
    assert listed.buttons == ["more"]

    respx.get(f"{API}/bot/session/status").mock(return_value=ok({"active": True, "kind": "exercise", "pick": True}))
    respx.post(f"{API}/bot/session/answer").mock(side_effect=[
        ok(page(2, statuses=())),
        ok({**page(2, statuses=()), "invalid": True}),
        ok({"kind": "exercise", "sessionId": "s2", "lesson": LESSON, "question": mc(1, ["a", "b", "c", "d"])}),
        httpx.Response(409, json={"code": "no_exercises"}),
    ])
    c = coach()
    more = await c.handle("7", "more")
    assert more.text.splitlines()[1] == "11. שיעור 0" and more.buttons == ["back", "more"]
    bad = await c.handle("7", "999")
    assert bad.text.startswith(er.PICK_INVALID)
    picked = await c.handle("7", "12")
    assert picked.text.startswith(er.START_INTRO) and picked.buttons == ["1", "2", "3", "4"]
    assert (await c.handle("7", "13")).text == er.NO_EXERCISES

    assert er.exercise_end_reply({"kind": "exercise", "ended": True, "pickClosed": True}).text == er.PICK_CLOSED
    assert er.lesson_list_text(page(10)).buttons == ["back"]


@respx.mock
async def test_numbered_command_starts_that_lesson():
    no_session()
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": LESSON, "question": fill(1)}))
    reply = await coach().handle("7", "english 12")
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
    assert '(רמה: בינוני)' in text and 'כתבו "/english 12 hard" לאותו שיעור ברמה קשה.' in text
    hardest = er.result_text({"lesson": {**lesson, "difficulty": "hard"}, "result": {
        "score": 80, "passed": True, "correct": 8, "total": 10, "pointsEarned": 7, "totalPoints": 20, "nextDifficulty": None}})
    assert "רוצים אתגר" not in hardest


def test_english_commands():
    assert parse_command("/help") == ("help", {}) and parse_command("help") == ("help", {})
    assert parse_command("/start") == ("help", {}) and parse_command("/help@Yzteacher_bot") == ("help", {})
    assert parse_command("Words") == ("words", {}) and parse_command("/end") == ("end", {})
    assert parse_command("english") == ("exercise", {"subject": "english", "number": None, "difficulty": None})
    assert parse_command("/math hard") == ("exercise", {"subject": "math", "number": None, "difficulty": "hard"})
    assert parse_command("english 12 medium") == ("exercise", {"subject": "english", "number": 12, "difficulty": "medium"})
    assert parse_command("/lessons_math") == ("lessons", {"subject": "math"})
    assert parse_command("lessons english") == ("lessons", {"subject": "english"})
    assert parse_command("lessons") == ("lessons", {})
    # Hebrew words are answers, never commands; unknown extras are not commands either.
    for text in ["מילים", "סיים", "די", "מילה", "תרגיל אנגלית", "english tomorrow", "lessons history", "help me"]:
        assert parse_command(text) is None, text


@respx.mock
async def test_help_needs_no_api_and_bare_words_answer_an_open_question():
    assert (await coach().handle("7", "/help")).text == replies.HELP
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "exercise", "lesson": LESSON, "question": fill(2)}))
    answer = respx.post(f"{API}/bot/session/answer").mock(return_value=ok(
        {"kind": "exercise", "done": False, "lesson": LESSON, "question": fill(3),
         "verdict": {"correct": True, "correctAnswer": "help"}}))
    c = coach()
    # "help" may be the fill-in answer ("Can you ___ me?"); "/help" is always the command.
    assert (await c.handle("7", "help")).text.startswith("✅ נכון!")
    assert json.loads(answer.calls.last.request.content)["text"] == "help"
    assert (await c.handle("7", "/help")).text == replies.HELP


@respx.mock
async def test_bare_command_works_during_a_multiple_choice_question():
    # A multiple-choice answer is a number, so "help" there is the command.
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "exercise", "lesson": LESSON, "question": mc(2, ["a", "b", "c", "d"])}))
    answer = respx.post(f"{API}/bot/session/answer")
    assert (await coach().handle("7", "help")).text == replies.HELP
    assert not answer.called


@respx.mock
async def test_lessons_without_a_subject_offers_both():
    no_session()
    reply = await coach().handle("7", "lessons")
    assert reply.text == replies.WHICH_LESSONS and reply.buttons == ["lessons english", "lessons math", "lessons arabic"]


@respx.mock
async def test_difficulty_goes_to_the_api():
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": {**LESSON, "difficulty": "hard"}, "question": fill(1)}))
    reply = await coach().handle("7", "/english 3 hard")
    assert json.loads(route.calls.last.request.content) == {"chatId": "7", "subject": "english", "number": 3, "difficulty": "hard"}
    assert "📘 חלקי הדיבור · קשה · שאלה 1/10" in reply.text


@respx.mock
async def test_report_shows_reason_buttons_files_the_report_and_repeats_the_question():
    question = mc(2, ["Noun", "Verb", "Adjective", "Adverb"])
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "exercise", "lesson": LESSON, "question": question}))
    route = respx.post(f"{API}/bot/report").mock(side_effect=[
        ok({"ask": True, "target": "question", "reasons": ["wrong_answer", "two_answers", "unclear", "other"]}),
        ok({"kind": "exercise", "reported": True, "duplicate": False, "reportedNumber": 1, "active": True}),
        ok({"kind": "exercise", "reported": True, "duplicate": True, "reportedNumber": 1, "active": True}),
        httpx.Response(409, json={"success": False, "code": "report_cap"}),
    ])
    answer = respx.post(f"{API}/bot/session/answer")
    c = coach()
    ask = await c.handle("7", "report")
    assert ask.text == er.REPORT_ASK and ask.buttons == list(er.REPORT_REASONS)
    reply = await c.handle("7", "🚩 יש יותר מתשובה נכונה אחת")
    assert reply.text.startswith("🚩 תודה! דיווחנו על שאלה 1 ונבדוק אותה.\n\nהתרגיל ממשיך:")
    assert "שאלה 2/10" in reply.text and reply.buttons == ["1", "2", "3", "4"]
    assert json.loads(route.calls[0].request.content) == {"chatId": "7"}
    assert json.loads(route.calls[1].request.content) == {"chatId": "7", "reason": "two_answers"}
    assert (await c.handle("7", "🚩 השאלה לא ברורה")).text.startswith("🚩 כבר דיווחתם על שאלה 1.")
    assert (await c.handle("7", "🚩 משהו אחר")).text == er.REPORT_CAP
    assert not answer.called  # a reason is never an answer


@respx.mock
async def test_report_without_a_lesson_says_when_it_works():
    no_session()
    respx.post(f"{API}/bot/report").mock(return_value=httpx.Response(404, json={"success": False, "code": "no_session"}))
    assert (await coach().handle("7", "🚩 השאלה לא ברורה")).text == er.REPORT_NO_LESSON
    assert (await coach().handle("7", "/report")).text == er.REPORT_NO_LESSON
    assert parse_command("/report") == ("report", {})


@respx.mock
async def test_report_in_a_words_exam_offers_word_reasons_and_shows_the_word_again():
    respx.get(f"{API}/bot/session/status").mock(return_value=ok(
        {"active": True, "kind": "vocab", "word": {"id": "w", "direction": "en-he", "prompt": "house", "english": "house"},
         "progress": {"round": 1, "index": 3, "total": 20, "failedInRound": 0}}))
    route = respx.post(f"{API}/bot/report").mock(side_effect=[
        ok({"ask": True, "target": "word", "reasons": ["wrong_translation", "missing_translation", "bad_sentence", "other"]}),
        ok({"kind": "vocab", "reported": True, "duplicate": False, "reportedWord": "dog", "active": True}),
    ])
    answer = respx.post(f"{API}/bot/session/answer")
    c = coach()
    ask = await c.handle("7", "/report")
    assert ask.text == er.WORD_REPORT_ASK and ask.buttons == list(er.WORD_REPORT_REASONS)
    reply = await c.handle("7", "🚩 גם התשובה שלי נכונה")
    assert json.loads(route.calls[1].request.content) == {"chatId": "7", "reason": "missing_translation"}
    assert reply.text.startswith("🚩 תודה! דיווחנו על המילה dog ונבדוק אותה.\n\nהתרגול ממשיך. המילה הנוכחית:")
    assert "(3/20) house" in reply.text
    assert not answer.called


@respx.mock
async def test_arabic_is_a_subject_of_its_own():
    from app.tools import _subject
    assert _subject("arabic") == "arabic" and _subject("ערבית") == "arabic" and _subject("math") == "math"
    assert parse_command("/arabic") == ("exercise", {"subject": "arabic", "number": None, "difficulty": None})
    assert parse_command("arabic 2 easy") == ("exercise", {"subject": "arabic", "number": 2, "difficulty": "easy"})
    assert parse_command("/lessons_arabic") == ("lessons", {"subject": "arabic"})
    route = respx.post(f"{API}/bot/exercise/start").mock(return_value=ok(
        {"kind": "exercise", "sessionId": "s", "lesson": {**LESSON, "subject": "arabic", "title": "אותיות"},
         "question": mc(1, ["ד", "ד׳", "א", "ר"])}))
    reply = await coach().handle("7", "/arabic")
    assert json.loads(route.calls.last.request.content)["subject"] == "arabic"
    assert "📘 אותיות" in reply.text and reply.buttons == ["1", "2", "3", "4"]
