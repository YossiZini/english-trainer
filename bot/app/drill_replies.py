"""Hebrew replies for the drills, built from the API's data only: the
questions, the verdict and the count come from the API. Two variants:
/kefel, the multiplication table, and /hiluk, division with a remainder and
long division (the API's `variant`, "kefel" when missing).

The student types the answer, so no reply has buttons (the keyboard goes
away). Expressions arrive wrapped in bidi isolates and are printed as they
are, so "7 × 8 = 56" keeps its order inside the Hebrew text."""
from .replies import Reply
from .encouragement import wrong_line

COMMAND = "/kefel"
START_INTRO = "🔢 לוח הכפל: 10 תרגילים, 5 כפל ו-5 חילוק. כתבו את התשובה בספרות, או /end כדי לעצור."
NOT_NUMBER = "כתבו את התשובה בספרות, או /end כדי לעצור:"

DIVISION_COMMAND = "/hiluk"
DIVISION_INTRO = ("➗ חילוק: 10 תרגילים, 5 עם שארית ו-5 חילוק ארוך. כתבו את המנה ואת השארית עם רווח ביניהן, "
                  "למשל 3 2 (או 3 שארית 2); כשאין שארית, רק את המנה. /end עוצר.")
DIVISION_NOT_ANSWER = "כתבו את המנה ואת השארית בספרות, עם רווח ביניהן, או /end כדי לעצור:"
MISSING_REMAINDER = "✔️ המנה נכונה, ויש גם שארית. כתבו את המנה ואת השארית עם רווח ביניהן:"

TEXTS = {
    "kefel": {"command": COMMAND, "intro": START_INTRO, "not_answer": NOT_NUMBER, "sign": "🔢",
              "name": "לוח הכפל", "champions": "אתם אלופי לוח הכפל", "learnt": "לוח הכפל נלמד בתרגול"},
    "hiluk": {"command": DIVISION_COMMAND, "intro": DIVISION_INTRO, "not_answer": DIVISION_NOT_ANSWER, "sign": "➗",
              "name": "תרגול החילוק", "champions": "אתם אלופי החילוק", "learnt": "חילוק נלמד בתרגול"},
}


def variant_of(data: dict) -> str:
    variant = data.get("variant") or (data.get("question") or {}).get("variant")
    return variant if variant in TEXTS else "kefel"


def question_text(question: dict) -> str:
    sign = TEXTS[variant_of({"question": question})]["sign"]
    return f"{sign} תרגיל {question['number']}/{question['total']}\n{question['text']}"


def verdict_text(verdict: dict) -> str:
    if verdict["correct"]:
        return "✅ נכון!"
    lines = [wrong_line(verdict), f"התשובה: {verdict['fact']}"]
    if verdict.get("check"):
        lines.append(f"בדיקה: {verdict['check']}")
    if verdict.get("remainderTooBig"):
        lines.append(f"השארית תמיד קטנה מהמחלק, {verdict['remainderTooBig']}.")
    return "\n".join(lines)


def praise(correct: int, total: int, variant: str = "kefel") -> str:
    """Kind words for the count: never about the student, always a way on."""
    t = TEXTS[variant]
    if correct == total:
        return f"מושלם! 🌟 {t['champions']}."
    if correct >= total - 2:
        return "כל הכבוד! 👏 כמעט הכול."
    if correct >= total // 2:
        return "יפה מאוד! 💪 כל סיבוב מחזק את הזיכרון."
    return f"התחלה טובה! 🌱 {t['learnt']}, וכל סיבוב עוזר."


def result_text(result: dict, variant: str = "kefel") -> str:
    lines = [f"🏁 סיימתם: {result['correct']} מתוך {result['total']} נכונות. {praise(result['correct'], result['total'], variant)}"]
    if result.get("missed"):
        lines.append("לחזרה:")
        lines += [f"• {fact}" for fact in result["missed"]]
    lines.append(f"כתבו {TEXTS[variant]['command']} לסיבוב נוסף.")
    return "\n".join(lines)


def drill_start_reply(result: dict) -> Reply:
    if not result["ok"]:
        from .replies import error_reply
        return Reply(error_reply(result))
    data = result["data"]
    return Reply(TEXTS[variant_of(data)]["intro"] + "\n" + question_text(data["question"]))


def drill_answer_reply(data: dict) -> Reply:
    if data.get("ended"):
        return drill_end_reply(data)
    variant = variant_of(data)
    if data.get("notNumber"):
        return Reply(TEXTS[variant]["not_answer"] + "\n" + question_text(data["question"]))
    if data.get("missingRemainder"):
        return Reply(MISSING_REMAINDER + "\n" + question_text(data["question"]))
    verdict = verdict_text(data["verdict"])
    if data.get("done"):
        return Reply(verdict + "\n\n" + result_text(data["result"], variant))
    return Reply(verdict + "\n\n" + question_text(data["question"]))


def drill_end_reply(data: dict) -> Reply:
    t = TEXTS[variant_of(data)]
    return Reply(f"עצרנו את {t['name']} ({data['answered']}/{data['total']} תרגילים, {data['correct']} נכונות). "
                 f"כתבו {t['command']} כדי להתחיל סיבוב חדש.")


def drill_status_reply(data: dict) -> Reply:
    return Reply("התרגול ממשיך:\n" + question_text(data["question"]))
