"""Hebrew replies built from API results. Deterministic on purpose: the
verdict, the expected translation and the next word never come from the
model, and the same text serves the fast path and the agent's tools."""

NOT_LINKED = ("הצ'אט הזה עדיין לא מחובר לחשבון. באתר, בכפתור \"טלגרם\" למעלה, קבלו קוד בן 6 ספרות "
              "ושלחו אותו לי כאן.")
NO_SESSION = "אין תרגול פעיל. כתבו \"מילים\" כדי להתחיל."
RATE_LIMITED = "הגעת למכסת ההודעות להיום. נמשיך מחר!"
UNREACHABLE = "משהו השתבש אצלנו. נסו שוב בעוד רגע."
BAD_CODE = "הקוד לא נכון או שפג תוקפו. קבלו קוד חדש באתר ושלחו אותו שוב."
LINKED = "מעולה, החשבון מחובר! כתבו \"מילים\" כדי להתחיל תרגול של 20 מילים."
NOT_ENOUGH_WORDS = "אין מספיק מילים ברמה שלכם כרגע."
HELP = ("אני מתרגל אתכם במילים באנגלית. כתבו \"מילים\" להתחלת תרגול של 20 מילים: אני שולח מילה, "
        "אתם עונים בעברית. \"סיים\" עוצר את התרגול.")


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
    return UNREACHABLE


def start_reply(result: dict) -> str:
    if not result["ok"]:
        return error_reply(result)
    data = result["data"]
    return "מתחילים! תרגמו לעברית:\n" + _word_line(data["word"], data["progress"])


def answer_reply(result: dict) -> str:
    if not result["ok"]:
        return error_reply(result)
    data = result["data"]
    verdict = "✅ נכון!" if data["correct"] else f"❌ לא בדיוק. התרגום: {data['expected']}"
    if data.get("done"):
        return verdict + "\n" + summary_text(data["summary"])
    lines = [verdict]
    if data.get("roundStarted"):
        lines.append(f"סיימנו את הסבב. עכשיו חוזרים על {data['progress']['total']} המילים שטעיתם בהן, בסדר אקראי:")
    lines.append(_word_line(data["word"], data["progress"]))
    return "\n".join(lines)


def end_reply(result: dict) -> str:
    if not result["ok"]:
        return error_reply(result)
    return "סיימנו להיום.\n" + summary_text(result["data"]["summary"])


def status_reply(result: dict) -> str:
    if not result["ok"]:
        return error_reply(result)
    data = result["data"]
    if not data.get("active"):
        return NO_SESSION
    return "התרגול ממשיך. המילה הנוכחית:\n" + _word_line(data["word"], data["progress"])


def summary_text(summary: dict) -> str:
    text = (f"סיכום: {summary['words']} מילים, {summary['rounds']} סבבים, "
            f"{summary['correct']} תשובות נכונות ו-{summary['wrong']} שגויות.")
    if summary.get("remainingFailed"):
        text += f" נשארו {summary['remainingFailed']} מילים לחזרה בפעם הבאה."
    else:
        text += " כל המילים נכונות, כל הכבוד! 🎉"
    return text
