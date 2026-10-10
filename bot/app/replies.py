"""Hebrew replies built from API results. Deterministic on purpose: the
verdict, the expected translation and the next word never come from the
model, and the same text serves the fast path and the agent's tools.

A reply is a `Reply(text, buttons)`; `buttons` (a list of strings) becomes
a Telegram reply keyboard for the setup questions."""
from dataclasses import dataclass, field

from .encouragement import wrong_line


@dataclass
class Reply:
    text: str
    buttons: list[str] = field(default_factory=list)

    def __str__(self) -> str:
        return self.text

NOT_LINKED = ("הצ'אט הזה עדיין לא מחובר לחשבון. באתר, בכפתור \"טלגרם\" למעלה, קבלו קוד בן 6 ספרות "
              "ושלחו אותו לי כאן.")
NO_SESSION = "אין תרגול פעיל. כתבו /words, /english, /math או /arabic כדי להתחיל, /mistakes למבחן הטעויות, או /help להסבר."
RATE_LIMITED = "הגעת למכסת ההודעות להיום. נמשיך מחר!"
UNREACHABLE = "משהו השתבש אצלנו. נסו שוב בעוד רגע."
BAD_CODE = "הקוד לא נכון או שפג תוקפו. קבלו קוד חדש באתר ושלחו אותו שוב."
LINKED = ("מעולה, החשבון מחובר! כתבו /words לתרגול של 20 מילים, /english, /math או /arabic לתרגילי השיעור הבא, "
          "/mistakes למבחן הטעויות, או /help להסבר מלא.")
SETUP_QUESTIONS = {"level": "איזו רמה?", "direction": "באיזה כיוון?"}
# The button under a words summary; the coach knows it by this sign (no
# translation starts with it), so it works without a session.
SWITCH_SIGN = "🔄"
TRANSLATE_TO = {"en-he": "תרגמו לעברית", "he-en": "תרגמו לאנגלית"}
INVALID_CHOICE = "בחרו מספר מהאפשרויות:"
NOT_ENOUGH_FOR_CHOICE = "אין מספיק מילים ברמה הזו בקבוצה שבחרתם. בחרו רמה אחרת:"
NOT_ENOUGH_WORDS = "אין מספיק מילים ברמה שלכם כרגע."
HELP = """🤖 איך זה עובד
אני מתרגל אתכם באנגלית, בחשבון ובערבית. כל מה שאתם עושים כאן נשמר בחשבון שלכם באתר: נקודות, התקדמות וטעויות לחזרה.
הפקודות באנגלית; אפשר ללחוץ עליהן, להקליד אותן (עם / או בלי) או לבחור מכפתור התפריט ליד תיבת הטקסט.

📚 אוצר מילים: /words
בוחרים רמה (1 קל, 2 בינוני, 3 קשה) וכיוון בכפתור: מאנגלית לעברית או מעברית לאנגלית. מקבלים 20 מילים, אחת בכל הודעה, וכותבים את התרגום.
• כל תשובה נכונה שווה נקודה. תרגום נכון שלא מופיע במילון נבדק גם הוא.
• בסוף הסבב המילים שטעיתם בהן חוזרות בסדר אקראי, עד שכולן נכונות.
• ? נותן משפט לדוגמה (מעברית לאנגלית: עם מקום ריק במקום המילה).
• בסוף המבחן כפתור 🔄 (או /switch) נותן את אותן מילים בכיוון השני.

✏️ תרגילי שיעור: /english, /math או /arabic
10 שאלות מהשיעור הבא שלכם, כמו באתר.
• כל השאלות אמריקאיות: עונים במספר התשובה (1–4) או בלחיצה על כפתור, בלי להקליד.
• אחרי כל תשובה תראו אם צדקתם, ואם לא, את התשובה הנכונה והסבר. ? נותן רמז.
• בסוף: ציון, נקודות והשיעור הבא. מ-70 ומעלה עברתם את השיעור.
• /lessons_english, /lessons_math או /lessons_arabic: רשימת השיעורים (✅ עברתם, ▶️ הבא בתור). שולחים את מספר השיעור; more ו-back מדפדפים.
• english 12 מתחיל ישר את שיעור 12. math 3 hard מתחיל את שיעור 3 ברמה קשה (easy / medium / hard). arabic מתחיל את שיעור הערבית הבא.

🎯 מבחן טעויות: /mistakes_english, /mistakes_math או /mistakes_arabic
עד 20 מהשאלות שטעיתם בהן במקצוע ועוד לא תיקנתם, באתר או כאן. תשובה נכונה מתקנת את הטעות מיד, ולכן כל סיבוב שואל רק את מה שנשאר. בסוף: כמה תיקנתם וכמה עוד מחכות.

📊 /usage מראה מי תרגל ב-7 וב-30 הימים האחרונים: ימי פעילות, שיעורים, מילים וקטעי קריאה (בלי ציונים).
🚩 /report מדווח על מילה או שאלה שנראית לכם שגויה (במבחן מילים או בתרגיל שיעור). היא יורדת מהתרגול עד שתיבדק.
🧐 /review_manual בודק את מה שדווח, אחד אחרי השני: סוכן הבדיקה מציע תיקון, ואתם מאשרים, משאירים, מסירים או כותבים תיקון משלכם. /review_auto מחיל את ההצעות התקינות לבד. כל שינוי נבדק לפני שהוא נכנס לתרגול של כולם.
⏹ /end עוצר כל תרגול. תרגיל שיעור שלא הסתיים לא נשמר; במבחן טעויות, מה שתיקנתם נשמר.
❓ /help מציג את ההסבר הזה.

עוד לא מחוברים? באתר, בכפתור "טלגרם" למעלה, קבלו קוד בן 6 ספרות ושלחו אותו לכאן."""
WHICH_LESSONS = "רשימת השיעורים של איזה מקצוע?"
LESSONS_BUTTONS = ("lessons english", "lessons math", "lessons arabic")
WHICH_MISTAKES = "מבחן הטעויות של איזה מקצוע?"
MISTAKES_BUTTONS = ("mistakes english", "mistakes math", "mistakes arabic")
NO_EXAMPLE = "אין משפט לדוגמה למילה הזו."
NO_WORDS_TO_SWITCH = "אין עדיין מבחן מילים לחזור עליו. כתבו /words כדי להתחיל."


def _word_line(word: dict | None, progress: dict | None) -> str:
    if not word:
        return ""
    prefix = ""
    if progress:
        prefix = f"({progress['index']}/{progress['total']}) "
    return f"{prefix}{word.get('prompt') or word.get('english', '')}"


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
    """A setup question with its numbered options as buttons.

    The level buttons are the numbers; the direction buttons carry their
    labels ("מאנגלית לעברית"), which the API accepts as well as 1 and 2."""
    options = data.get("options", [])
    lines = [intro] if intro else []
    if data.get("level") and data["setup"] == "direction":
        lines.append(f"רמה {data['level']}.")
    lines.append(SETUP_QUESTIONS.get(data["setup"], ""))
    lines += [f"{o['key']}. {o['label']}" for o in options]
    labels = data["setup"] == "direction"
    return Reply("\n".join(lines), [o["label"] if labels else str(o["key"]) for o in options])


def start_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    data = result["data"]
    if data.get("setup"):
        return setup_reply(data, "מתחילים תרגול של 20 מילים.")
    return Reply("מתחילים! תרגמו לעברית:\n" + _word_line(data["word"], data["progress"]))


def started_reply(data: dict) -> Reply:
    direction = data.get("direction") or "en-he"
    head = f"רמה {data['level']}" if data.get("level") else "מתחילים"
    if data.get("switched"):
        head = f"אותן מילים, {data['directionLabel']}"
    elif data.get("directionLabel"):
        head += f", {data['directionLabel']}"
    return Reply(f"{head}. {TRANSLATE_TO[direction]} (\"?\" למשפט לדוגמה):\n" + _word_line(data["word"], data["progress"]))


def switch_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(NO_WORDS_TO_SWITCH if result.get("code") == "no_session" else error_reply(result))
    return started_reply(result["data"])


def _summary_reply(head: str, summary: dict) -> Reply:
    """The words summary, with a button for the same words the other way round."""
    switch = summary.get("switchTo")
    buttons = [f"{SWITCH_SIGN} אותן מילים {switch['label']}"] if switch else []
    return Reply(head + summary_text(summary), buttons)


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
        verdict = f"{wrong_line(data)}\nהתרגום: {data['expected']}"
    if data.get("done"):
        return _summary_reply(verdict + "\n", data["summary"])
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
    if result["data"].get("kind") == "review":
        from .review_replies import summary_reply
        return summary_reply(result["data"])
    return _summary_reply("סיימנו להיום.\n", result["data"]["summary"])


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
