// Kind, slightly funny lines for a wrong answer (Hebrew, plural like the rest
// of the site). A line is about the moment, never about the student, and the
// right answer is always shown with it. The Telegram bot has the same kind of
// list in bot/app/encouragement.py; keep the two in the same spirit.
//
// encouragementFor(key, isCorrect) records each answered question once (by
// its key) in this browser session: wrong answers are counted so two wrong
// answers in a row never get the same line, and STREAK or more wrong in a row
// get a bigger cheer. Lines stay at most 26 characters so they fit one row
// on a narrow phone (the viewport check). Showing the same question again returns its line again.

export const LINES = [
  { icon: '💡', text: 'כמעט! גם איינשטיין טעה.' },
  { icon: '🙈', text: 'אופס! עכשיו זה ייזכר.' },
  { icon: '🌱', text: 'טעות היא צעד בדרך.' },
  { icon: '🐢', text: 'לאט ובטוח – הצב ניצח.' },
  { icon: '🎯', text: 'פספוס קטן, הבא בול!' },
  { icon: '🧠', text: 'המוח שלכם למד משהו חדש.' },
  { icon: '⚽', text: 'גם מסי מחטיא לפעמים.' },
  { icon: '🦉', text: 'גם הינשוף החכם מתבלבל.' },
  { icon: '🍀', text: 'לא הפעם, הכיוון טוב!' },
  { icon: '🚲', text: 'נפלתם? עולים על האופניים.' },
  { icon: '🐣', text: 'כל אלוף התחיל ככה.' },
  { icon: '🎈', text: 'לא נורא! עכשיו יודעים.' }
];

export const STREAK = 3;
export const STREAK_LINES = [
  { icon: '💪', text: 'רגע קשה? ככה המוח גדל!' },
  { icon: '🍫', text: 'הפסקת שוקולד ואז ממשיכים!' },
  { icon: '🦸', text: 'גיבורי-על מתאמנים כשקשה!' },
  { icon: '🌈', text: 'אחרי גשם בא קשת!' }
];

/** The line for the `count`-th wrong answer with `streak` wrong in a row. */
export function lineFor(count, streak) {
  if (streak >= STREAK) return STREAK_LINES[(streak - STREAK) % STREAK_LINES.length];
  return LINES[(Math.max(1, count) - 1) % LINES.length];
}

const answered = new Map();
let wrongCount = 0;
let wrongStreak = 0;

/** The line for this answered question (null when it was right). */
export function encouragementFor(key, isCorrect) {
  if (!answered.has(key)) {
    if (isCorrect) {
      wrongStreak = 0;
      answered.set(key, null);
    } else {
      wrongCount += 1;
      wrongStreak += 1;
      answered.set(key, lineFor(wrongCount, wrongStreak));
    }
  }
  return isCorrect ? null : answered.get(key) || lineFor(1, 1);
}

/** Tests only: forget every answer. */
export function resetEncouragement() {
  answered.clear();
  wrongCount = 0;
  wrongStreak = 0;
}
