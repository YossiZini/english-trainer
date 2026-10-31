// Shared bits for the three multiplication-table lessons (topic 100, shown
// first in Math): computed answers, wrong options from the common mistakes,
// explanations by the easiest rule, and the full table.
const helpers = require('../math-helpers');
const P = require('../math-svg');
const { mcq } = require('../fractions/common');

// Every equation stays on one line. A phone may otherwise break "5 × 2 = 10"
// into "5 ×" at the end of a line and "2 = 10" at the start of the next,
// which reads backwards in right-to-left text. Non-breaking spaces inside
// the isolate (exercise text) and inside <span dir="ltr"> (theory, captions)
// prevent that; keep each equation short enough for a phone line.
const glue = (s) => s.replace(/ /g, '\u00a0');
const ltr = (s) => helpers.ltr(glue(s));
const expr = (e) => ltr(`${e} = ?`);
const glueEquations = (html) =>
  html.replace(/<span dir="ltr">([^<]*)<\/span>/g, (m, eq) => `<span dir="ltr">${glue(eq)}</span>`);

/** The first three different positive values of `candidates` that are not `answer`. */
function firstWrongs(answer, candidates) {
  const wrongs = [];
  for (const v of candidates) {
    if (Number.isInteger(v) && v >= 0 && v !== answer && !wrongs.includes(v)) wrongs.push(v);
  }
  if (wrongs.length < 3) throw new Error(`Not enough wrong options for ${answer}`);
  return wrongs.slice(0, 3);
}

/**
 * Wrong answers for a × b: one group too many or too few, the neighbouring
 * row, and adding instead of multiplying.
 */
function productWrongs(a, b) {
  const p = a * b;
  return firstWrongs(p, [
    a * (b < 10 ? b + 1 : b - 1),
    (a > 1 ? a - 1 : a + 1) * b,
    a + b,
    a * (b > 1 ? b - 1 : b + 2),
    (a < 10 ? a + 1 : a - 1) * b,
    p + 10
  ]);
}

/** Wrong answers for c ÷ a: a neighbouring quotient, the divisor, or subtracting. */
function quotientWrongs(c, a) {
  const b = c / a;
  return firstWrongs(b, [b + 1, b - 1, a, c - a, b + 2, b - 2, b + 3]);
}

/** a × b explained by the easiest rule of lesson 100.1. */
function explainProduct(a, b) {
  const p = a * b;
  const has = (k) => a === k || b === k;
  const other = (k) => (a === k ? b : a);
  if (has(1)) return `כפול 1 לא משנה את המספר: ${ltr(`${a} × ${b} = ${p}`)}.`;
  if (has(10)) return `כפול 10 מוסיפים 0 בסוף: ${ltr(`${a} × ${b} = ${p}`)}.`;
  if (has(2)) {
    const x = other(2);
    return `כפול 2 הוא פעמיים: ${ltr(`${x} + ${x} = ${p}`)}.`;
  }
  if (has(5)) {
    const x = other(5);
    return `כפול 5 הוא חצי מכפול 10: ${ltr(`${x} × 10 = ${x * 10}`)}, והחצי הוא ${p}.`;
  }
  if (has(3)) {
    const x = other(3);
    return `כפול 3 הוא שלוש פעמים: ${ltr(`${x} + ${x} + ${x} = ${p}`)}.`;
  }
  if (a === b) return `מספר כפול עצמו: ${ltr(`${a} × ${a} = ${p}`)}.`;
  if (has(9)) {
    const x = other(9);
    return `כפול 9 הוא כפול 10 פחות פעם אחת: ${ltr(`${x} × 10 − ${x} = ${x * 10} − ${x} = ${p}`)}.`;
  }
  if (has(4)) {
    const x = other(4);
    return `כפול 4 הוא כפול 2 פעמיים: ${ltr(`${x} × 2 = ${2 * x}`)}, ${ltr(`${2 * x} + ${2 * x} = ${p}`)}.`;
  }
  if (has(8)) {
    const x = other(8);
    return `כפול 8 הוא כפול 4 פעמיים: ${ltr(`${x} × 4 = ${4 * x}`)}, ${ltr(`${4 * x} + ${4 * x} = ${p}`)}.`;
  }
  const x = other(6);
  return `כפול 6 הוא כפול 5 ועוד פעם אחת: ${ltr(`${x} × 5 + ${x} = ${5 * x} + ${x} = ${p}`)}.`;
}

/** c ÷ a explained as the multiplication it undoes. */
function explainQuotient(c, a) {
  const b = c / a;
  if (c === 0) return `אפס חלקי כל מספר הוא אפס: ${ltr(`0 ÷ ${a} = 0`)}.`;
  if (a === 1) return `חילוק ב-1 לא משנה את המספר: ${ltr(`${c} ÷ 1 = ${c}`)}.`;
  if (a === c) return `מספר חלקי עצמו הוא 1: ${ltr(`${c} ÷ ${c} = 1`)}.`;
  return `חושבים: איזה מספר כפול ${a} נותן ${c}? ${ltr(`${b} × ${a} = ${c}`)}, ולכן ${ltr(`${c} ÷ ${a} = ${b}`)}.`;
}

/** A bare multiplication "a × b = ?". */
const times = (n, level, a, b) =>
  mcq(n, level, expr(`${a} × ${b}`), String(a * b), productWrongs(a, b).map(String), explainProduct(a, b));

/** A bare division "c ÷ a = ?". */
const divide = (n, level, c, a) =>
  mcq(n, level, expr(`${c} ÷ ${a}`), String(c / a), quotientWrongs(c, a).map(String), explainQuotient(c, a));

/** A question whose answer is a number, with its wrong options given. */
const numberQuestion = (n, level, text, answer, wrongs, explanation, picture = null) =>
  mcq(n, level, text, String(answer), wrongs.map(String), explanation, picture);

/**
 * One picture under an explanation, at most 110px tall: a tall dot array
 * (10 rows) would otherwise push the feedback far below the pinned bar on a
 * laptop. Phones scale it down further (ExerciseFeedback.css).
 */
const PIC_MAX_HEIGHT = 110;
const fitHeight = (svg) => svg.replace(/<svg([^>]*?) width="([\d.]+)" height="([\d.]+)"/g, (m, attrs, w, h) =>
  (Number(h) <= PIC_MAX_HEIGHT ? m
    : `<svg${attrs} width="${Math.round((Number(w) * PIC_MAX_HEIGHT) / Number(h))}" height="${PIC_MAX_HEIGHT}"`));
const pic = (picture, caption) => P.figures(P.figure(fitHeight(picture), caption));

/** The multiplication table 1–10 (row × column), the squares marked. */
function timesTable() {
  const n = Array.from({ length: 10 }, (_, i) => i + 1);
  const head = `<tr><th>×</th>${n.map((c) => `<th>${c}</th>`).join('')}</tr>`;
  const rows = n.map((r) => `<tr><th>${r}</th>${n.map((c) => `<td${r === c ? ' class="square"' : ''}>${r * c}</td>`).join('')}</tr>`);
  return `<div class="times-table-wrap"><table class="times-table" dir="ltr">${head}${rows.join('')}</table></div>`;
}

/** A lesson object with the shared fields of topic 100. */
function lesson(index, titleEn, titleHe, theoryContentHe, exercises) {
  const byLevel = exercises.reduce((m, e) => ({ ...m, [e.difficulty]: (m[e.difficulty] || 0) + 1 }), {});
  for (const level of ['easy', 'medium', 'hard']) {
    if (byLevel[level] !== 10) throw new Error(`100.${index} ${titleEn}: ${byLevel[level] || 0} ${level} exercises, expected 10`);
  }
  return {
    topicNumber: 100,
    subtopicNumber: `100.${index}`,
    titleEn,
    titleHe,
    level: 'beginner',
    orderIndex: 990 + index,
    theoryContentHe: glueEquations(theoryContentHe),
    exercises: exercises.map((e) =>
      (e.explanationPicture ? { ...e, explanationPicture: glueEquations(e.explanationPicture) } : e))
  };
}

module.exports = {
  ltr, expr, mcq, P, pic, times, divide, numberQuestion, productWrongs, quotientWrongs,
  explainProduct, explainQuotient, timesTable, lesson
};
