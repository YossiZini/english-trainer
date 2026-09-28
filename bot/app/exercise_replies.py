"""Hebrew replies for lesson exercises, built from the API's data only.

A multiple-choice question lists its options as "1) …" lines and offers
buttons 1..n; a fill-in question removes the keyboard. The lesson list is
numbered across pages; the student sends a lesson's number. The verdict, the
right option and the score always come from the API."""
from .replies import Reply

SUBJECT_COMMAND = {"english": "תרגיל אנגלית", "math": "תרגיל חשבון"}
SUBJECT_NAME = {"english": "אנגלית", "math": "חשבון"}
MARKS = {"done": "✅ ", "next": "▶️ ", "open": ""}
MORE, BACK = "עוד", "הקודם"
PICK_INVALID = "שלחו מספר של שיעור מהרשימה:"
PICK_CLOSED = "סגרנו את רשימת השיעורים."
START_INTRO = "מתחילים! ענו במספר התשובה, או כתבו \"סיים\" כדי לעצור."

ALL_DONE = "סיימתם את כל השיעורים במקצוע הזה! 🎓 אפשר לבחור שיעור לחזרה מהרשימה."
LESSON_NOT_FOUND = "לא מצאתי את השיעור הזה."
NO_EXERCISES = "לשיעור הזה אין עדיין תרגילים."
EXERCISE_ERRORS = {
    "all_done": ALL_DONE,
    "lesson_not_found": LESSON_NOT_FOUND,
    "no_exercises": NO_EXERCISES,
    "bad_subject": "אפשר לתרגל אנגלית או חשבון.",
}


def question_reply(data: dict, intro: str = "") -> Reply:
    lesson, q = data["lesson"], data["question"]
    lines = [intro] if intro else []
    lines.append(f"📘 {lesson['title']} · שאלה {q['number']}/{q['total']}")
    lines.append(q["text"])
    if q.get("textEn"):
        lines.append(q["textEn"])
    if q.get("options"):
        lines += [f"{i}) {option}" for i, option in enumerate(q["options"], start=1)]
        return Reply("\n".join(lines), [str(i) for i in range(1, len(q["options"]) + 1)])
    lines.append("כתבו את התשובה:")
    return Reply("\n".join(lines))


def verdict_text(verdict: dict) -> str:
    if verdict["correct"]:
        return "✅ נכון!"
    answer = verdict["correctAnswer"]
    if verdict.get("correctOption"):
        answer = f"{verdict['correctOption']}) {answer}"
    text = f"❌ לא נכון. התשובה: {answer}"
    if verdict.get("explanation"):
        text += f"\n💡 {verdict['explanation']}"
    return text


def result_text(data: dict) -> str:
    lesson, r = data["lesson"], data["result"]
    lines = [f"🏁 סיימתם את \"{lesson['title']}\": {r['correct']}/{r['total']} נכונות, ציון {r['score']}."]
    lines.append("עברתם את השיעור! ✨" if r["passed"] else "כדי לעבור צריך ציון 70. אפשר לנסות שוב.")
    points = r.get("pointsEarned") or 0
    lines.append(f"⭐ {points:+d} נקודות (סה\"כ {r['totalPoints']}).")
    command = SUBJECT_COMMAND.get(lesson.get("subject"), "תרגיל אנגלית")
    if r.get("nextLesson"):
        lines.append(f"השיעור הבא: {r['nextLesson']['title']}. כתבו \"{command}\" כדי להמשיך.")
    else:
        lines.append(f"כתבו \"{command}\" כדי לתרגל שוב.")
    return "\n".join(lines)


def lesson_list_text(data: dict) -> Reply:
    """One page of the lesson list; buttons turn the page, the number is typed."""
    lines = [PICK_INVALID] if data.get("invalid") else []
    lines.append(f"📚 שיעורי {SUBJECT_NAME.get(data['subject'], '')} · עמוד {data['page']}/{data['pages']}")
    lines += [f"{item['n']}. {MARKS.get(item['status'], '')}{item['title']}" for item in data["items"]]
    lines.append("שלחו את מספר השיעור (✅ עברתם, ▶️ הבא בתור), או \"סיים\" כדי לסגור.")
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
