"""Hebrew replies for lesson exercises, built from the API's data only.

A multiple-choice question lists its options as "1) …" lines and offers
buttons 1..n; a fill-in question removes the keyboard. The lesson list is
numbered across pages; the student sends a lesson's number. The verdict, the
right option and the score always come from the API."""
from .replies import Reply

SUBJECT_COMMAND = {"english": "/english", "math": "/math"}
SUBJECT_NAME = {"english": "אנגלית", "math": "חשבון"}
LEVEL_NAME = {"easy": "קל", "medium": "בינוני", "hard": "קשה"}
MARKS = {"done": "✅ ", "next": "▶️ ", "open": ""}
MORE, BACK = "more", "back"
PICK_INVALID = "שלחו מספר של שיעור מהרשימה:"
PICK_CLOSED = "סגרנו את רשימת השיעורים."
NO_HINT = "אין רמז לשאלה הזו."
START_INTRO = "מתחילים! ענו במספר התשובה (? לרמז), או /end כדי לעצור."

ALL_DONE = "סיימתם את כל השיעורים במקצוע הזה! 🎓 אפשר לבחור שיעור לחזרה מהרשימה: /lessons_english או /lessons_math."
LESSON_NOT_FOUND = "לא מצאתי את השיעור הזה."
NO_EXERCISES = "לשיעור הזה אין עדיין תרגילים."
EXERCISE_ERRORS = {
    "all_done": ALL_DONE,
    "lesson_not_found": LESSON_NOT_FOUND,
    "no_exercises": NO_EXERCISES,
    "bad_subject": "אפשר לתרגל אנגלית או חשבון.",
}

# Reporting a question or a word: the reasons are buttons carrying this sign,
# so the coach knows them from an answer (no option or translation starts
# with it). The API decides whether the report is about a word or a question.
REPORT_SIGN = "🚩"
REPORT_REASONS = {
    f"{REPORT_SIGN} התשובה הנכונה שגויה": "wrong_answer",
    f"{REPORT_SIGN} יש יותר מתשובה נכונה אחת": "two_answers",
    f"{REPORT_SIGN} השאלה לא ברורה": "unclear",
    f"{REPORT_SIGN} משהו אחר": "other",
}
WORD_REPORT_REASONS = {
    f"{REPORT_SIGN} התרגום שגוי": "wrong_translation",
    f"{REPORT_SIGN} גם התשובה שלי נכונה": "missing_translation",
    f"{REPORT_SIGN} משפט הדוגמה שגוי": "bad_sentence",
    f"{REPORT_SIGN} משהו אחר": "other",
}
REPORT_ASK = ("🚩 דיווח על השאלה האחרונה שעניתם עליה (או על השאלה הנוכחית). מה לא בסדר בה?\n"
              "בחרו בכפתור. אם אתם באמצע תרגיל, אחרי הדיווח ממשיכים מאותה שאלה.")
WORD_REPORT_ASK = ("🚩 דיווח על המילה האחרונה שעניתם עליה (או על המילה הנוכחית). מה לא בסדר בה?\n"
                   "בחרו בכפתור. אחרי הדיווח ממשיכים מאותה מילה.")
REPORT_NO_LESSON = ("אפשר לדווח על מילה או שאלה במהלך מבחן מילים (/words) או תרגילי שיעור "
                    "(/english או /math), או מיד אחריהם.")
REPORT_CAP = "הגעת למכסת הדיווחים להיום. תודה על העזרה, נמשיך מחר!"


def report_ask_reply(target: str = "question") -> Reply:
    if target == "word":
        return Reply(WORD_REPORT_ASK, list(WORD_REPORT_REASONS))
    return Reply(REPORT_ASK, list(REPORT_REASONS))


def report_reason(text: str) -> str | None:
    """The reason key of a reason button (question or word), or None."""
    t = text.strip()
    return REPORT_REASONS.get(t) or WORD_REPORT_REASONS.get(t)


def report_reply(result: dict) -> Reply:
    """The report's confirmation; the caller adds the current question when a lesson is open."""
    if not result["ok"]:
        code = result.get("code")
        if code == "no_session":
            return Reply(REPORT_NO_LESSON)
        if code == "report_cap":
            return Reply(REPORT_CAP)
        return Reply(_error(result))
    data = result["data"]
    if data.get("kind") == "vocab":
        if data.get("duplicate"):
            return Reply(f"🚩 כבר דיווחתם על המילה {data['reportedWord']}. תודה, נבדוק אותה!")
        return Reply(f"🚩 תודה! דיווחנו על המילה {data['reportedWord']} ונבדוק אותה.")
    if data.get("duplicate"):
        return Reply(f"🚩 כבר דיווחתם על שאלה {data['reportedNumber']}. תודה, נבדוק אותה!")
    return Reply(f"🚩 תודה! דיווחנו על שאלה {data['reportedNumber']} ונבדוק אותה.")


def question_reply(data: dict, intro: str = "") -> Reply:
    lesson, q = data["lesson"], data["question"]
    lines = [intro] if intro else []
    level = LEVEL_NAME.get(lesson.get("difficulty"))
    lines.append(f"📘 {lesson['title']}" + (f" · {level}" if level and q["number"] == 1 else "") + f" · שאלה {q['number']}/{q['total']}")
    lines.append(q["text"])
    if q.get("textEn"):
        lines.append(q["textEn"])
    if q.get("options"):
        lines += [f"{i}) {option}" for i, option in enumerate(q["options"], start=1)]
        return Reply("\n".join(lines), [str(i) for i in range(1, len(q["options"]) + 1)])
    lines.append("כתבו את התשובה (? לרמז):")
    return Reply("\n".join(lines))


def verdict_text(verdict: dict) -> str:
    if verdict["correct"]:
        return "✅ נכון!"
    answer = verdict["correctAnswer"]
    if verdict.get("correctOption"):
        answer = f"{verdict['correctOption']}) {answer}"
    text = f"💡 לא נכון. התשובה: {answer}"
    if verdict.get("explanation"):
        text += f"\n💡 {verdict['explanation']}"
    return text


def result_text(data: dict) -> str:
    lesson, r = data["lesson"], data["result"]
    level = LEVEL_NAME.get(lesson.get("difficulty"))
    at_level = f" (רמה: {level})" if level else ""
    lines = [f"🏁 סיימתם את \"{lesson['title']}\"{at_level}: {r['correct']}/{r['total']} נכונות, ציון {r['score']}."]
    lines.append("עברתם את השיעור! ✨" if r["passed"] else "כדי לעבור צריך ציון 70. אפשר לנסות שוב.")
    points = r.get("pointsEarned") or 0
    lines.append(f"⭐ {points:+d} נקודות (סה\"כ {r['totalPoints']}).")
    command = SUBJECT_COMMAND.get(lesson.get("subject"), "/english")
    harder = LEVEL_NAME.get(r.get("nextDifficulty"))
    if r["passed"] and harder and lesson.get("number"):
        lines.append(f"רוצים אתגר? כתבו \"{command} {lesson['number']} {r['nextDifficulty']}\" לאותו שיעור ברמה {harder}.")
    if r.get("nextLesson"):
        lines.append(f"השיעור הבא: {r['nextLesson']['title']}. כתבו {command} כדי להמשיך.")
    else:
        lines.append(f"כתבו {command} כדי לתרגל שוב.")
    return "\n".join(lines)


def lesson_list_text(data: dict) -> Reply:
    """One page of the lesson list; buttons turn the page, the number is typed."""
    lines = [PICK_INVALID] if data.get("invalid") else []
    lines.append(f"📚 שיעורי {SUBJECT_NAME.get(data['subject'], '')} · עמוד {data['page']}/{data['pages']}")
    lines += [f"{item['n']}. {MARKS.get(item['status'], '')}{item['title']}" for item in data["items"]]
    lines.append("שלחו את מספר השיעור (✅ עברתם, ▶️ הבא בתור); more / back מדפדפים, /end סוגר.")
    buttons = ([BACK] if data["page"] > 1 else []) + ([MORE] if data["page"] < data["pages"] else [])
    return Reply("\n".join(lines), buttons)


def lesson_list_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(_error(result))
    return lesson_list_text(result["data"])


def exercise_start_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(_error(result))
    return question_reply(result["data"], START_INTRO)


def exercise_answer_reply(data: dict) -> Reply:
    if data.get("ended"):
        return exercise_end_reply(data)
    if data.get("pick"):
        return lesson_list_text(data)
    if data.get("hintAsked"):
        return question_reply(data, f"💡 {data['hint']}" if data.get("hint") else NO_HINT)
    if data.get("chooseNumber"):
        count = len(data["question"].get("options") or [])
        return question_reply(data, f"ענו במספר בין 1 ל-{count}:")
    if "verdict" not in data:
        # A lesson picked from the list: its first question.
        return question_reply(data, START_INTRO)
    verdict = verdict_text(data["verdict"])
    if data.get("done"):
        return Reply(verdict + "\n\n" + result_text(data))
    reply = question_reply(data)
    return Reply(verdict + "\n\n" + reply.text, reply.buttons)


def exercise_end_reply(data: dict) -> Reply:
    if data.get("pickClosed"):
        return Reply(PICK_CLOSED)
    lesson = data["lesson"]
    return Reply(
        f"עצרנו באמצע \"{lesson['title']}\" ({data['answered']}/{data['total']} שאלות, {data['correct']} נכונות). "
        "הציון לא נשמר; אפשר להתחיל מחדש מתי שתרצו."
    )


def exercise_status_reply(data: dict) -> Reply:
    if data.get("pick"):
        return lesson_list_text(data)
    return question_reply(data, "התרגיל ממשיך:")


def _error(result: dict) -> str:
    from .replies import error_reply
    return error_reply(result)
