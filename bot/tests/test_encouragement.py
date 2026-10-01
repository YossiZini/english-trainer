"""Kind lines for a wrong answer: a new one every time, more cheer after a streak."""
from app.encouragement import LINES, STREAK, STREAK_LINES, wrong_line
from app.exercise_replies import verdict_text
from app.replies import answer_reply


def test_two_wrong_answers_in_a_row_never_get_the_same_line():
    lines = [wrong_line({"wrongCount": n, "wrongStreak": 1}) for n in range(1, 40)]
    assert all(a != b for a, b in zip(lines, lines[1:]))
    assert set(lines) == set(LINES)


def test_a_streak_gets_more_cheer_and_a_right_answer_resets_it():
    assert wrong_line({"wrongCount": 5, "wrongStreak": STREAK - 1}) in LINES
    streak = [wrong_line({"wrongCount": 9, "wrongStreak": s}) for s in range(STREAK, STREAK + 6)]
    assert all(line in STREAK_LINES for line in streak)
    assert all(a != b for a, b in zip(streak, streak[1:]))
    assert wrong_line({}) == LINES[0]  # an older API without the counts


def test_the_lines_are_short_kind_and_never_say_wrong():
    for line in LINES + STREAK_LINES:
        assert len(line) <= 60, line
        assert "לא נכון" not in line and "טעיתם" not in line, line


def test_lesson_and_words_replies_keep_the_answer_and_the_explanation():
    text = verdict_text({"correct": False, "correctAnswer": "ד׳", "correctOption": 1,
                         "explanation": "ذ היא ד׳אל.", "wrongCount": 2, "wrongStreak": 1})
    assert text == f"{LINES[1]}\nהתשובה: 1) ד׳\n📖 ذ היא ד׳אל."
    assert text.count("💡") <= 1
    words = answer_reply({"ok": True, "data": {"correct": False, "expected": "חתול", "wrongCount": 3, "wrongStreak": 3,
                                                "done": False, "word": {"prompt": "cat"},
                                                "progress": {"index": 4, "total": 20}}})
    assert words.text.startswith(f"{STREAK_LINES[0]}\nהתרגום: חתול\n")
