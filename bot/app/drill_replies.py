"""Hebrew replies for /kefel, the multiplication-table drill, built from the
API's data only: the questions, the verdict and the count come from the API.

The student types the number, so no reply has buttons (the keyboard goes
away). Expressions arrive wrapped in bidi isolates and are printed as they
are, so "7 × 8 = 56" keeps its order inside the Hebrew text."""
from .replies import Reply
from .encouragement import wrong_line

COMMAND = "/kefel"
START_INTRO = "🔢 לוח הכפל: 10 תרגילים, 5 כפל ו-5 חילוק. כתבו את התשובה בספרות, או /end כדי לעצור."
NOT_NUMBER = "כתבו את התשובה בספרות, או /end כדי לעצור:"


def question_text(question: dict) -> str:
    return f"🔢 תרגיל {question['number']}/{question['total']}\n{question['text']}"


def verdict_text(verdict: dict) -> str:
    if verdict["correct"]:
        return "✅ נכון!"
    return f"{wrong_line(verdict)}\nהתשובה: {verdict['fact']}"


def praise(correct: int, total: int) -> str:
    """Kind words for the count: never about the student, always a way on."""
    if correct == total:
        return "מושלם! 🌟 אתם אלופי לוח הכפל."
    if correct >= total - 2:
        return "כל הכבוד! 👏 כמעט הכול."
    if correct >= total // 2:
        return "יפה מאוד! 💪 כל סיבוב מחזק את הזיכרון."
    return "התחלה טובה! 🌱 לוח הכפל נלמד בתרגול, וכל סיבוב עוזר."


def result_text(result: dict) -> str:
    lines = [f"🏁 סיימתם: {result['correct']} מתוך {result['total']} נכונות. {praise(result['correct'], result['total'])}"]
    if result.get("missed"):
        lines.append("לחזרה:")
        lines += [f"• {fact}" for fact in result["missed"]]
    lines.append(f"כתבו {COMMAND} לסיבוב נוסף.")
    return "\n".join(lines)


def drill_start_reply(result: dict) -> Reply:
    if not result["ok"]:
        from .replies import error_reply
        return Reply(error_reply(result))
    return Reply(START_INTRO + "\n" + question_text(result["data"]["question"]))


def drill_answer_reply(data: dict) -> Reply:
    if data.get("ended"):
        return drill_end_reply(data)
    if data.get("notNumber"):
        return Reply(NOT_NUMBER + "\n" + question_text(data["question"]))
    verdict = verdict_text(data["verdict"])
    if data.get("done"):
        return Reply(verdict + "\n\n" + result_text(data["result"]))
    return Reply(verdict + "\n\n" + question_text(data["question"]))


def drill_end_reply(data: dict) -> Reply:
    return Reply(f"עצרנו את לוח הכפל ({data['answered']}/{data['total']} תרגילים, {data['correct']} נכונות). "
                 f"כתבו {COMMAND} כדי להתחיל סיבוב חדש.")


def drill_status_reply(data: dict) -> Reply:
    return Reply("התרגול ממשיך:\n" + question_text(data["question"]))
