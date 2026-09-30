"""Hebrew reply for /usage: every student's participation in the last 7 and
30 days, from the API's summary (never scores). One line per student, most
active first; long lists are cut to fit one Telegram message."""
from .replies import Reply, error_reply

MAX_STUDENTS = 30
MAX_CHARS = 3800  # Telegram's limit is 4096
MAX_NAME = 20
NOBODY = "אף אחד לא תרגל ב-30 הימים האחרונים."


def _day(iso: str) -> str:
    """2026-06-15 → 15.06"""
    return f"{iso[8:10]}.{iso[5:7]}" if iso else ""


def _name(name: str) -> str:
    name = " ".join(str(name).split())
    return name if len(name) <= MAX_NAME else name[:MAX_NAME - 1] + "…"


def student_line(n: int, s: dict) -> str:
    w, m = s["week"], s["month"]
    return (f"{n}. {_name(s['name'])}: ימים {w['activeDays']}|{m['activeDays']} · "
            f"שיעורים {w['lessons']}|{m['lessons']} · מילים {w['words']}|{m['words']} · "
            f"קריאה {w['reading']}|{m['reading']} · אחרון {_day(s['lastActive'])}")


def usage_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    data = result["data"]
    week, month = data["windows"]["week"], data["windows"]["month"]
    head = [f"📊 מי תרגל: שבוע ({_day(week['from'])}–{_day(week['to'])}) | חודש ({_day(month['from'])}–{_day(month['to'])})"]
    students = data.get("students") or []
    if not students:
        return Reply("\n".join(head + [NOBODY]))
    head.append("המספרים: השבוע|החודש")
    lines = []
    for n, s in enumerate(students[:MAX_STUDENTS], start=1):
        line = student_line(n, s)
        if len("\n".join(head + lines + [line])) > MAX_CHARS:
            break
        lines.append(line)
    tail = []
    if len(lines) < len(students):
        tail.append(f"ועוד {len(students) - len(lines)} תלמידים.")
    if data.get("inactive"):
        tail.append(f"{data['inactive']} תלמידים לא תרגלו ב-30 הימים האחרונים.")
    return Reply("\n".join(head + lines + tail))
