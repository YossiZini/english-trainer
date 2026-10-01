"""Kind, slightly funny lines for a wrong answer (Hebrew, plural like the rest
of the bot). The line is about the moment, never about the student, and the
right answer always follows it.

The bot keeps no state, so the API sends how many wrong answers the session
has had (wrongCount) and how many in a row (wrongStreak): the count picks the
line, so two wrong answers in a row never get the same one, and a streak of
STREAK or more gets a bigger dose of cheer. Keep the website's list
(frontend/src/content/encouragement.js) in the same spirit."""

LINES = [
    "💡 כמעט! גם איינשטיין טעה לפעמים.",
    "🙈 אופס, הפעם לא. אבל עכשיו זה ייזכר לתמיד!",
    "🌱 טעות היא רק צעד בדרך.",
    "🐢 לאט ובטוח – הצב ניצח בסוף.",
    "🎯 פספוס קטן. בפעם הבאה בול!",
    "🧠 המוח שלכם בדיוק למד משהו חדש.",
    "⚽ גם מסי מחטיא לפעמים.",
    "🦉 אפילו הינשוף החכם מתבלבל לפעמים.",
    "🍀 לא הפעם, אבל הכיוון טוב.",
    "🚲 נפלתם? עולים בחזרה על האופניים.",
    "🐣 כל אלוף התחיל ככה.",
    "🎈 לא נורא! עכשיו אתם יודעים.",
]

STREAK = 3
STREAK_LINES = [
    "💪 רגע קשה? זה בדיוק הזמן שבו המוח גדל. ממשיכים!",
    "🍫 מגיעה לכם הפסקת שוקולד קטנה… ואז שאלה הבאה!",
    "🦸 גיבורי-על מתאמנים הכי הרבה כשקשה. אתם בדרך!",
    "🌈 אחרי גשם בא קשת. עוד שאלה ואתם שם!",
]


def wrong_line(verdict: dict) -> str:
    """The encouraging line for a wrong answer; any missing count falls back to the first line."""
    count = int(verdict.get("wrongCount") or 1)
    streak = int(verdict.get("wrongStreak") or 0)
    if streak >= STREAK:
        return STREAK_LINES[(streak - STREAK) % len(STREAK_LINES)]
    return LINES[(count - 1) % len(LINES)]
