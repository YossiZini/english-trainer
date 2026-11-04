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

// ---------------------------------------------------------------------------
// Shared by the math chapters built from these helpers (1, 2 and 7 on): one
// home, so a fix to escaping or to the lesson checks is made once.

/**
 * Theory HTML: an equation, a comparison or a number that keeps its order.
 * < and > are escaped: a raw "<" would end the span early for
 * glueEquations, and the comparison could break across lines.
 */
const eq = (s) => `<span dir="ltr">${s.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;

/** A question asked on its own picture (a grid, a triangle): `question` is its SVG. */
const withQuestionPicture = (e, question) => (question ? { ...e, questionPicture: question } : e);

/**
 * A multiple-choice question whose pictures come as an options object,
 * `{ picture, question }` (the builders of chapters 7–10). A picture passed in
 * its place, or an unknown option, is refused: destructuring would drop it
 * without a word.
 */
function optionsQuestion(n, level, text, answer, wrongs, explanation, opts = {}) {
  if (opts === null || typeof opts !== 'object' || Array.isArray(opts)) {
    throw new Error(`Question ${n}: pass pictures as { picture, question }, not a ${opts === null ? 'null' : typeof opts}`);
  }
  const { picture = null, question = null, ...rest } = opts;
  if (Object.keys(rest).length) throw new Error(`Question ${n}: unknown option ${Object.keys(rest).join(', ')}`);
  return withQuestionPicture(mcq(n, level, text, answer, wrongs, explanation, picture), question);
}

const HEBREW = /[֐-׿]/;
// An option is shown left to right: Hebrew words with numbers in it read
// scrambled ("−2 גדול מ-−8" the wrong way round), and so do Hebrew words
// with a Latin letter ("ציר x" as "x ציר").
const MIXED = { digits: /\d/, letters: /[0-9A-Za-z]/ };
// A quote mark anywhere (`noQuote: true`), or only inside a Hebrew word, where
// it stands for the gershayim of a unit (ס"מ for ס״מ): `noQuote: 'units'`
// still lets an explanation quote a question ("כמה נשארו").
const QUOTE = { all: /"/, units: /[\u0590-\u05FF]"[\u0590-\u05FF]/ };

/**
 * A math lesson object: `chapter` gives the topic number, where its lessons
 * sort (`order` + index) and the checks it runs. Every lesson has 10
 * questions per level and its equations glued to one line (glueEquations).
 * Checks, each by its option: `options` ('digits' or 'letters'), no option
 * mixes Hebrew with digits (or with digits or Latin letters); `noQuote`, no
 * quote mark in a question or explanation (units take ״, as in ס״מ), or with
 * `noQuote: 'units'` none inside a Hebrew word.
 * `oneLine: true` marks every equation span of the theory and the pictures'
 * captions `class="math-line"`, which the website keeps on one line: a
 * browser breaks a line right next to a stacked fraction, even before a
 * no-break space (measured in Chromium at 360 and 390 px), so glue alone does
 * not hold an equation with a fraction together.
 */
function mathLesson(chapter, index, titleEn, titleHe, theoryContentHe, exercises) {
  const { topic, order, options = null, noQuote = false, oneLine = false } = chapter;
  const id = `${topic}.${index}`;
  // A misspelt check would turn itself off (noQuote) or fail with a TypeError (options).
  if (options !== null && !MIXED[options]) throw new Error(`${id}: options must be 'digits' or 'letters', not ${JSON.stringify(options)}`);
  if (noQuote !== false && noQuote !== true && !QUOTE[noQuote]) throw new Error(`${id}: noQuote must be true, false or 'units', not ${JSON.stringify(noQuote)}`);
  if (oneLine !== false && oneLine !== true) throw new Error(`${id}: oneLine must be true or false, not ${JSON.stringify(oneLine)}`);
  const lines = (html) => (oneLine ? glueEquations(html).replace(/<span dir="ltr">/g, '<span dir="ltr" class="math-line">') : glueEquations(html));
  const byLevel = exercises.reduce((m, e) => ({ ...m, [e.difficulty]: (m[e.difficulty] || 0) + 1 }), {});
  for (const level of ['easy', 'medium', 'hard']) {
    if (byLevel[level] !== 10) throw new Error(`${id} ${titleEn}: ${byLevel[level] || 0} ${level} exercises, expected 10`);
  }
  for (const e of exercises) {
    for (const o of (options && e.options) || []) {
      if (HEBREW.test(o) && MIXED[options].test(o)) {
        throw new Error(`${id} q${e.questionNumber}: option mixes Hebrew with ${options === 'digits' ? 'numbers' : 'numbers or letters'}: ${o}`);
      }
    }
    const quote = noQuote && QUOTE[noQuote === true ? 'all' : noQuote];
    if (quote && quote.test([e.questionTextHe, e.explanationHe, ...(e.options || [])].join(' '))) throw new Error(`${id} q${e.questionNumber}: a quote mark (write ס״מ with ״)`);
  }
  return {
    topicNumber: topic,
    subtopicNumber: id,
    titleEn,
    titleHe,
    level: 'beginner',
    orderIndex: order + index,
    theoryContentHe: lines(theoryContentHe),
    exercises: exercises.map((e) =>
      (e.explanationPicture ? { ...e, explanationPicture: lines(e.explanationPicture) } : e))
  };
}

/** A lesson object with the shared fields of topic 100. */
const lesson = (...args) => mathLesson({ topic: 100, order: 990, noQuote: true }, ...args);

module.exports = {
  ltr, expr, mcq, P, pic, times, divide, numberQuestion, productWrongs, quotientWrongs,
  explainProduct, explainQuotient, timesTable, lesson, glueEquations, firstWrongs,
  eq, withQuestionPicture, mathLesson, optionsQuestion, glue
};
