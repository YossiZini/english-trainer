// Kind, slightly funny lines for a wrong answer (Hebrew, plural like the rest
// of the site). A line is about the moment, never about the student, and the
// right answer is always shown with it. The Telegram bot has the same kind of
// list in bot/app/encouragement.py; keep the two in the same spirit.
//
// Each test page (a lesson, the mixed test, a vocabulary quiz or review, a
// reading) calls startEncouragement() when the test starts, so a retake gets
// fresh lines and a streak never carries over into another test. Within the
// test, encouragementFor(key, isCorrect) counts each question once (by its
// key): two wrong answers in a row never get the same line, and STREAK or
// more wrong in a row get a bigger cheer. Showing the same question again
// returns its line again; an answer changed from right to wrong counts as a
// new wrong answer. Lines stay at most 26 characters so they fit one row on
// a narrow phone (the viewport check).

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

// The current test: each answered question's line (null when it was right),
// and its wrong answers so far and in a row.
const answered = new Map();
let wrongCount = 0;
let wrongStreak = 0;

/** A new test starts: count its wrong answers from zero. */
export function startEncouragement() {
  answered.clear();
  wrongCount = 0;
  wrongStreak = 0;
}

/** The line for this answered question in the current test (null when it was right). */
export function encouragementFor(key, isCorrect) {
  if (isCorrect) {
    if (!answered.has(key)) {
      wrongStreak = 0;
      answered.set(key, null);
    }
    return null;
  }
  if (!answered.get(key)) {
    wrongCount += 1;
    wrongStreak += 1;
    answered.set(key, lineFor(wrongCount, wrongStreak));
  }
  return answered.get(key);
}
