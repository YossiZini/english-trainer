"""Hebrew reply for /usage: every student's participation in the last 7 and
30 days, from the API's summary (never scores).

One short block per student, most active first: the name and the last day
practised, then a line for the week and a line for the month. Each line
names only what the student did ("2 ימים · שיעור אחד · 10 תרגילי כפל"), in
Hebrew word order, so nothing reads as a pair of bare numbers. The name sits
in a first-strong isolate after a right-to-left mark: an English name keeps
its own direction and does not turn the line left to right (a line's
direction comes from its first letter). Long lists are cut to fit one Telegram
message. "כפל" and "חילוק" are /kefel and /hiluk questions answered."""
from .replies import Reply, error_reply

MAX_STUDENTS = 30
MAX_CHARS = 3800  # Telegram's limit is 4096
MAX_NAME = 20
FSI, PDI = "⁨", "⁩"
RLM = "‏"  # a line's direction comes from its first letter: this makes a name line right to left
NOBODY = "אף אחד לא תרגל ב-30 הימים האחרונים."
NOTHING = "בלי תרגול"

# What a student did, in the order shown: (field, one, many). "one" is the
# whole phrase for 1; "many" takes the number in front.
ITEMS = (
    ("activeDays", "יום אחד", "ימים"),
    ("lessons", "שיעור אחד", "שיעורים"),
    ("words", "מילה אחת", "מילים"),
    ("reading", "קטע קריאה אחד", "קטעי קריאה"),
    ("drill", "תרגיל כפל אחד", "תרגילי כפל"),
    ("division", "תרגיל חילוק אחד", "תרגילי חילוק"),
)


def _day(iso: str) -> str:
    """2026-06-15 → 15.06"""
    return f"{iso[8:10]}.{iso[5:7]}" if iso else ""


def _name(name: str) -> str:
    name = " ".join(str(name).split())
    name = name if len(name) <= MAX_NAME else name[:MAX_NAME - 1] + "…"
    return f"{FSI}{name}{PDI}"


def _counts(window: dict) -> str:
    """"2 ימים · שיעור אחד · 10 תרגילי כפל": only what was done."""
    parts = []
    for field, one, many in ITEMS:
        n = window.get(field) or 0
        if n:
            parts.append(one if n == 1 else f"{n} {many}")
    return " · ".join(parts) if parts else NOTHING


def student_block(s: dict) -> str:
    head = f"{RLM}👤 {_name(s['name'])}"
    if s.get("lastActive"):
        head += f" · תרגול אחרון: {_day(s['lastActive'])}"
    return "\n".join([head, f"השבוע: {_counts(s['week'])}", f"החודש: {_counts(s['month'])}"])


def usage_reply(result: dict) -> Reply:
    if not result["ok"]:
        return Reply(error_reply(result))
    data = result["data"]
    week, month = data["windows"]["week"], data["windows"]["month"]
    head = ("📊 מי תרגל\n"
            f"השבוע: {_day(week['from'])} עד {_day(week['to'])}\n"
            f"החודש: {_day(month['from'])} עד {_day(month['to'])}")
    students = data.get("students") or []
    if not students:
        return Reply(f"{head}\n\n{NOBODY}")
    blocks = []
    for s in students[:MAX_STUDENTS]:
        block = student_block(s)
        if len("\n\n".join([head, *blocks, block])) > MAX_CHARS:
            break
        blocks.append(block)
    tail = []
    more = len(students) - len(blocks)
    if more:
        tail.append("ועוד תלמיד אחד." if more == 1 else f"ועוד {more} תלמידים.")
    inactive = data.get("inactive") or 0
    if inactive:
        tail.append("תלמיד אחד לא תרגל ב-30 הימים האחרונים." if inactive == 1
                    else f"{inactive} תלמידים לא תרגלו ב-30 הימים האחרונים.")
    return Reply("\n\n".join([head, *blocks, *(["\n".join(tail)] if tail else [])]))
