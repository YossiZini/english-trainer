"""Hebrew replies built from API results. Deterministic on purpose: the
verdict, the expected translation and the next word never come from the
model, and the same text serves the fast path and the agent's tools.

A reply is a `Reply(text, buttons)`; `buttons` (a list of strings) becomes
a Telegram reply keyboard for the setup questions."""
from dataclasses import dataclass, field


@dataclass
class Reply:
    text: str
    buttons: list[str] = field(default_factory=list)

    def __str__(self) -> str:
        return self.text

NOT_LINKED = ("הצ'אט הזה עדיין לא מחובר לחשבון. באתר, בכפתור \"טלגרם\" למעלה, קבלו קוד בן 6 ספרות "
              "ושלחו אותו לי כאן.")
NO_SESSION = "אין תרגול פעיל. כתבו /words, /english או /math כדי להתחיל, או /help להסבר."
RATE_LIMITED = "הגעת למכסת ההודעות להיום. נמשיך מחר!"
UNREACHABLE = "משהו השתבש אצלנו. נסו שוב בעוד רגע."
BAD_CODE = "הקוד לא נכון או שפג תוקפו. קבלו קוד חדש באתר ושלחו אותו שוב."
LINKED = ("מעולה, החשבון מחובר! כתבו /words לתרגול של 20 מילים, /english או /math לתרגילי השיעור הבא, "
          "או /help להסבר מלא.")
SETUP_QUESTIONS = {"level": "איזו רמה?"}
INVALID_CHOICE = "בחרו מספר מהאפשרויות:"
NOT_ENOUGH_FOR_CHOICE = "אין מספיק מילים ברמה הזו בקבוצה שבחרתם. בחרו רמה אחרת:"
NOT_ENOUGH_WORDS = "אין מספיק מילים ברמה שלכם כרגע."
HELP = """🤖 איך זה עובד
אני מתרגל אתכם באנגלית ובחשבון. כל מה שאתם עושים כאן נשמר בחשבון שלכם באתר: נקודות, התקדמות וטעויות לחזרה.
הפקודות באנגלית; אפשר ללחוץ עליהן או להקליד אותן (עם / או בלי).

📚 אוצר מילים: /words
בוחרים רמה (1 קל, 2 בינוני, 3 קשה) ומקבלים 20 מילים באנגלית, אחת בכל הודעה. כותבים את התרגום בעברית.
• כל תשובה נכונה שווה נקודה. תרגום נכון שלא מופיע במילון נבדק גם הוא.
• בסוף הסבב המילים שטעיתם בהן חוזרות בסדר אקראי, עד שכולן נכונות.
• ? נותן משפט לדוגמה עם המילה.

✏️ תרגילי שיעור: /english או /math
10 שאלות מהשיעור הבא שלכם, כמו באתר.
• בשאלה אמריקאית עונים במספר התשובה (1–4) או בכפתור. בשאלת השלמה כותבים את התשובה.
• אחרי כל תשובה תראו אם צדקתם, ואם לא, את התשובה הנכונה והסבר. ? נותן רמז.
• בסוף: ציון, נקודות והשיעור הבא. מ-70 ומעלה עברתם את השיעור.
• /lessons_english או /lessons_math: רשימת השיעורים (✅ עברתם, ▶️ הבא בתור). שולחים את מספר השיעור; more ו-back מדפדפים.
• english 12 מתחיל ישר את שיעור 12. math 3 hard מתחיל את שיעור 3 ברמה קשה (easy / medium / hard).

⏹ /end עוצר כל תרגול. תרגיל שלא הסתיים לא נשמר.
❓ /help מציג את ההסבר הזה.

עוד לא מחוברים? באתר, בכפתור "טלגרם" למעלה, קבלו קוד בן 6 ספרות ושלחו אותו לכאן."""
WHICH_LESSONS = "רשימת השיעורים של איזה מקצוע?"
LESSONS_BUTTONS = ("lessons english", "lessons math")
NO_EXAMPLE = "אין משפט לדוגמה למילה הזו."


def _word_line(word: dict | None, progress: dict | None) -> str:
    if not word:
        return ""
    prefix = ""
    if progress:
        prefix = f"({progress['index']}/{progress['total']}) "
    return f"{prefix}{word['english']}"


def error_reply(result: dict) -> str:
    code = result.get("code")
    if code == "not_linked":
        return NOT_LINKED
    if code == "no_session":
        return NO_SESSION
    if code == "rate_limited":
        return result.get("message") or RATE_LIMITED
    if code == "bad_code":
        return BAD_CODE
    if code == "not_enough_words":
        return NOT_ENOUGH_WORDS
    from .exercise_replies import EXERCISE_ERRORS
    return EXERCISE_ERRORS.get(code, UNREACHABLE)


def setup_reply(data: dict, intro: str = "") -> Reply:
    """A setup question with its numbered options as buttons."""
    options = data.get("options", [])
    lines = [intro] if intro else []
    lines.append(SETUP_QUESTIONS.get(data["setup"], ""))
    lines += [f"{o['key']}. {o['label']}" for o in options]
    return Reply("\n".join(lines), [str(o["key"]) for o in options])


def start_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    data = result["data"]
    if data.get("setup"):
        return setup_reply(data, "מתחילים תרגול של 20 מילים.")
    return Reply("מתחילים! תרגמו לעברית:\n" + _word_line(data["word"], data["progress"]))


def started_reply(data: dict) -> Reply:
    return Reply(f"רמה {data['level']}. תרגמו לעברית (\"?\" למשפט לדוגמה):\n" + _word_line(data["word"], data["progress"]))


def answer_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    data = result["data"]
    if data.get("kind") == "exercise":
        from .exercise_replies import exercise_answer_reply
        return exercise_answer_reply(data)
    if data.get("setup"):
        intro = NOT_ENOUGH_FOR_CHOICE if data.get("notEnoughWords") else INVALID_CHOICE if data.get("invalid") else ""
        return setup_reply(data, intro)
    if data.get("started"):
        return started_reply(data)
    if data.get("example"):
        line = f"💡 {data['sentence']}" if data.get("sentence") else NO_EXAMPLE
        return Reply(line + "\n" + _word_line(data["word"], data["progress"]))
    if data["correct"]:
        verdict = "✅ נכון!" + (f" +{data['points']}" if data.get("points") else "")
        if data.get("judged") and data.get("expected"):
            verdict += f"\nבמילון: {data['expected']}"
    else:
        verdict = f"❌ לא בדיוק. התרגום: {data['expected']}"
    if data.get("done"):
        return Reply(verdict + "\n" + summary_text(data["summary"]))
    lines = [verdict]
    if data.get("roundStarted"):
        lines.append(f"סיימנו את הסבב. עכשיו חוזרים על {data['progress']['total']} המילים שטעיתם בהן, בסדר אקראי:")
    lines.append(_word_line(data["word"], data["progress"]))
    return Reply("\n".join(lines))


def end_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    if result["data"].get("kind") == "exercise":
        from .exercise_replies import exercise_end_reply
        return exercise_end_reply(result["data"])
    return Reply("סיימנו להיום.\n" + summary_text(result["data"]["summary"]))


def status_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    data = result["data"]
    if not data.get("active"):
        return Reply(NO_SESSION)
    if data.get("kind") == "exercise":
        from .exercise_replies import exercise_status_reply
        return exercise_status_reply(data)
    if data.get("setup"):
        return setup_reply(data)
    return Reply("התרגול ממשיך. המילה הנוכחית:\n" + _word_line(data["word"], data["progress"]))


def summary_text(summary: dict) -> str:
    text = (f"סיכום: {summary['words']} מילים, {summary['rounds']} סבבים, "
            f"{summary['correct']} תשובות נכונות ו-{summary['wrong']} שגויות.")
    if summary.get("remainingFailed"):
        text += f" נשארו {summary['remainingFailed']} מילים לחזרה בפעם הבאה."
    else:
        text += " כל המילים נכונות, כל הכבוד! 🎉"
    points = summary.get("points") or 0
    if points:
        text += f"\n⭐ צברתם {points} נקודות"
        if summary.get("totalPoints") is not None:
            text += f" (סה\"כ {summary['totalPoints']})"
        text += "."
    return text
