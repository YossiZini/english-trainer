"""Kind, slightly funny lines for a wrong answer (Hebrew, plural like the rest
of the bot). The line is about the moment, never about the student, and the
right answer always follows it.

The bot keeps no state, so the API sends how many wrong answers the session
has had (wrongCount) and how many in a row (wrongStreak): the count picks the
line, so two wrong answers in a row never get the same one, and a streak of
STREAK or more gets a bigger dose of cheer. Lines stay short (one row on a
narrow phone on the website). Keep the website's list
(frontend/src/content/encouragement.js) in the same spirit."""

LINES = [
    "💡 כמעט! גם איינשטיין טעה.",
    "🙈 אופס! עכשיו זה ייזכר.",
    "🌱 טעות היא צעד בדרך.",
    "🐢 לאט ובטוח – הצב ניצח.",
    "🎯 פספוס קטן, הבא בול!",
    "🧠 המוח שלכם למד משהו חדש.",
    "⚽ גם מסי מחטיא לפעמים.",
    "🦉 גם הינשוף החכם מתבלבל.",
    "🍀 לא הפעם, הכיוון טוב!",
    "🚲 נפלתם? עולים על האופניים.",
    "🐣 כל אלוף התחיל ככה.",
    "🎈 לא נורא! עכשיו יודעים.",
]

STREAK = 3
STREAK_LINES = [
    "💪 רגע קשה? ככה המוח גדל!",
    "🍫 הפסקת שוקולד ואז ממשיכים!",
    "🦸 גיבורי-על מתאמנים כשקשה!",
    "🌈 אחרי גשם בא קשת!",
]


def wrong_line(verdict: dict) -> str:
    """The encouraging line for a wrong answer; any missing count falls back to the first line."""
    count = int(verdict.get("wrongCount") or 1)
    streak = int(verdict.get("wrongStreak") or 0)
    if streak >= STREAK:
        return STREAK_LINES[(streak - STREAK) % len(STREAK_LINES)]
    return LINES[(count - 1) % len(LINES)]
