"""Hebrew replies for /unseen, an English reading text and its questions,
built from the API's data only: the text, the questions, the verdict and the
score always come from the API.

The text is its own message, sent before the first question (Reply.before),
so it stands on its own above the questions. A question lists its options as
"1) …" with buttons 1..n, "?" (the text's hard words and the question in
Hebrew) and 📄 (the text again); an option without letters ("30%") is
isolated left to right. List lines start with Hebrew, so each line keeps one
direction."""
from .encouragement import wrong_line
from .exercise_replies import keep_ltr
from .replies import Reply

COMMAND = "/unseen"
LIST_COMMAND = "/unseen_list"
HINT = "?"
# The button that sends the text again; the API knows it by this sign (no option number starts with it).
TEXT_AGAIN = "📄"
START_INTRO = ("קראו את הקטע שלמעלה וענו על השאלות. ענו במספר התשובה, ? למילים קשות ולשאלה בעברית, "
               "📄 לקטע שוב, או /end כדי לעצור.")
TEXT_AGAIN_INTRO = "📄 הקטע שוב, למעלה. ממשיכים בשאלה:"
NO_HARD_WORDS = "אין מילים קשות לקטע הזה."
ALREADY_ANSWERED = "על השאלה הזו כבר עניתם. ממשיכים:"
PICK_INVALID = "שלחו מספר של קטע מהרשימה:"
PICK_CLOSED = "סגרנו את רשימת הקטעים."
ALL_DONE = "🎉 קראתם את כל הקטעים! בחרו קטע לקריאה חוזרת:"
MARKS = {"done": "✅ ", "next": "▶️ ", "open": ""}
UNSEEN_ERRORS = {
    "text_not_found": f"אין קטע במספר הזה. כתבו {LIST_COMMAND} כדי לראות את רשימת הקטעים.",
    "no_questions": "לקטע הזה אין עדיין שאלות.",
}


def _error(result: dict) -> str:
    """The Hebrew line for an API error; error_reply knows the reading codes too."""
    from .replies import error_reply
    return error_reply(result)


def passage_text(data: dict) -> str:
    """The text's own message: the English title, the Hebrew title with its place and level, then the text."""
    r = data["reading"]
    about = " · ".join(part for part in (r.get("titleHe"), f"קטע {r['number']} מתוך {r['count']}", f"רמה {r['level']}") if part)
    return f"📖 {r['title']}\n{about}\n\n{data['passage']}"


def question_reply(data: dict, intro: str = "") -> Reply:
    """A question with its options; buttons for the options, "?" and 📄."""
    r, q = data["reading"], data["question"]
    lines = [intro] if intro else []
    lines.append(f"❓ שאלה {q['number']}/{q['total']} · {r['title']}")
    lines.append(q["text"])
    lines += [f"{i}) {keep_ltr(option)}" for i, option in enumerate(q["options"], start=1)]
    return Reply("\n".join(lines), [str(i) for i in range(1, len(q["options"]) + 1)] + [HINT, TEXT_AGAIN])


def verdict_text(verdict: dict) -> str:
    if verdict["correct"]:
        return "✅ נכון!"
    text = f"{wrong_line(verdict)}\nהתשובה: {verdict['correctOption']}) {keep_ltr(verdict['correctAnswer'])}"
    if verdict.get("explanation"):
        text += f"\n📖 {verdict['explanation']}"
    return text


def hint_text(hint: dict) -> str:
    """The text's hard words with their translations, and the question in Hebrew."""
    words = hint.get("words") or []
    lines = ["💡 מילים קשות בקטע:", *[f"{w['word']} – {w['translation']}" for w in words]] if words else [NO_HARD_WORDS]
    if hint.get("questionHe"):
        lines.append(f"השאלה בעברית: {hint['questionHe']}")
    return "\n".join(lines)


def praise(correct: int, total: int) -> str:
    """Kind words for the count: never a judgement, always a way on."""
    if correct == total:
        return "מושלם! 🌟 הבנתם את הקטע עד הסוף."
    if correct >= total - 1:
        return "כל הכבוד! 👏 כמעט הכול."
    if correct * 2 >= total:
        return "יפה מאוד! 💪 כל קטע מחזק את הקריאה."
    return "התחלה טובה! 🌱 הבנת הנקרא נבנית בתרגול, וכל קטע עוזר."


def result_text(data: dict) -> str:
    r, res = data["reading"], data["result"]
    lines = [f"🏁 סיימתם את \"{r['title']}\": {res['correct']} מתוך {res['total']} נכונות, ציון {res['score']}. "
             f"{praise(res['correct'], res['total'])}"]
    if (res.get("attempts") or 1) > 1 and res.get("bestScore", 0) > res["score"]:
        lines.append(f"הציון הכי גבוה שלכם בקטע הזה: {res['bestScore']}.")
    if res.get("next"):
        lines.append(f"הקטע הבא: {res['next']['title']}. כתבו {COMMAND} כדי להמשיך.")
    else:
        lines.append(f"קראתם את כל הקטעים! 🎉 כתבו {LIST_COMMAND} כדי לבחור קטע לקריאה חוזרת.")
    return "\n".join(lines)


def list_text(data: dict) -> Reply:
    """The numbered list of texts; the student types a text's number (no buttons)."""
    lines = [ALL_DONE] if data.get("allDone") else [PICK_INVALID] if data.get("invalid") else []
    lines.append(f"📚 קטעי קריאה באנגלית ({data['count']})")
    for item in data["items"]:
        score = f" · ציון {item['bestScore']}" if item.get("bestScore") is not None else ""
        lines.append(f"{item['n']}. {MARKS.get(item['status'], '')}{item.get('titleHe') or item['title']} · רמה {item['level']}{score}")
    lines.append("שלחו את מספר הקטע (✅ קראתם, ▶️ הבא בתור), או /end כדי לסגור.")
    return Reply("\n".join(lines))


def unseen_start_reply(result: dict) -> Reply:
    """The text as its own message, then the first question; with every text read, the list."""
    if not result["ok"]:
        return Reply(_error(result))
    data = result["data"]
    if data.get("pick"):
        return list_text(data)
    first = question_reply(data, START_INTRO)
    return Reply(first.text, first.buttons, before=[passage_text(data)])


def unseen_list_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(_error(result))
    return list_text(result["data"])


def unseen_answer_reply(data: dict) -> Reply:
    if data.get("ended"):
        return unseen_end_reply(data)
    if data.get("pick"):
        return list_text(data)
    if data.get("passageAgain"):
        # 📄: the text again as its own message, then the same question.
        again = question_reply(data, TEXT_AGAIN_INTRO)
        return Reply(again.text, again.buttons, before=[passage_text(data)])
    if "passage" in data:
        # A text picked from the list: the text, then its first question.
        return unseen_start_reply({"ok": True, "data": data})
    if data.get("hintAsked"):
        return question_reply(data, hint_text(data["hint"]))
    if data.get("chooseNumber"):
        return question_reply(data, f"ענו במספר בין 1 ל-{len(data['question']['options'])}, או ? לעזרה:")
    if data.get("alreadyAnswered"):
        return question_reply(data, ALREADY_ANSWERED)
    verdict = verdict_text(data["verdict"])
    if data.get("done"):
        return Reply(verdict + "\n\n" + result_text(data))
    reply = question_reply(data)
    return Reply(verdict + "\n\n" + reply.text, reply.buttons)


def unseen_end_reply(data: dict) -> Reply:
    if data.get("pickClosed"):
        return Reply(PICK_CLOSED)
    return Reply(f"עצרנו באמצע \"{data['reading']['title']}\" ({data['answered']}/{data['total']} שאלות, "
                 f"{data['correct']} נכונות). הקטע לא נשמר כגמור; כתבו {COMMAND} כדי להתחיל מחדש.")


def unseen_status_reply(data: dict) -> Reply:
    if data.get("pick"):
        return list_text(data)
    return question_reply(data, "הקריאה ממשיכה:")
