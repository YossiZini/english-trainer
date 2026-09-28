// Helpers shared by the Math seed files (topic101…). The seeds are plain
// modules read by backend/src/data/generateJsonData.js; they never touch a
// database.

// Isolate a math expression inside Hebrew text so digits, operators and
// fractions keep their left-to-right order (U+2066 LRI … U+2069 PDI).
const ltr = (s) => `⁦${s}⁩`;

// A bare computation question: the expression followed by "= ?", kept LTR.
const expr = (e) => ltr(`${e} = ?`);

// Multiple-choice exercise. The correct answer must be one of the options.
function mc(questionNumber, difficulty, questionTextHe, options, correctAnswer, explanationHe, explanationPicture = null) {
  if (!options.includes(correctAnswer)) {
    throw new Error(`Question ${questionNumber}: correct answer "${correctAnswer}" is not an option`);
  }
  return { questionNumber, type: 'multiple_choice', questionTextHe, options, correctAnswer, explanationHe, explanationPicture, difficulty };
}

// Fill-in-the-blank exercise; hintHe tells the student the expected format.
// explanationPicture: optional HTML (inline SVG) shown under the explanation.
function fib(questionNumber, difficulty, questionTextHe, correctAnswer, explanationHe, hintHe, explanationPicture = null) {
  return { questionNumber, type: 'fill_in_blank', questionTextHe, correctAnswer, explanationHe, hintHe, explanationPicture, difficulty };
}

// Textbook notation for theory HTML: every a/b or mixed "1 a/b" in the text
// becomes a stacked fraction (numerator over denominator). Same pattern as
// the frontend's MathText, which does this for plain-text question fields.
// A '?' may stand for an unknown numerator or denominator (3/4 = ?/12).
const FRACTION = /(?<![\d./?]|\d[.,])(?:(\d+) )?(\d+|\?)\/(\d+|\?)(?![\d/?]|[.,]\d)/g;
const fracHtml = (whole, num, den) =>
  `<span class="frac">${whole ? `<span class="frac-whole">${whole}</span>` : ''}` +
  `<span class="frac-stack"><span class="frac-num">${num}</span><span class="frac-den">${den}</span></span></span>`;
// Text inside <svg> (number-line labels) is left alone.
const stackFractions = (html) => html
  .split(/(<svg[\s\S]*?<\/svg>)/)
  .map((part, i) => (i % 2 ? part : part.replace(FRACTION, (m, whole, num, den) => fracHtml(whole, num, den))))
  .join('');

// Apply the notation to every lesson's theory of a seed file.
const withStackedFractions = (lessons) =>
  lessons.map((l) => ({
    ...l,
    theoryContentHe: stackFractions(l.theoryContentHe),
    exercises: (l.exercises || []).map((e) =>
      e.explanationPicture ? { ...e, explanationPicture: stackFractions(e.explanationPicture) } : e)
  }));

// ---------------------------------------------------------------------------
// Every Math exercise is multiple choice: a fill-in written with a computed
// answer is converted here, with three wrong options derived from the
// answer's form. Hand-written multiple choice keeps its own (trap) options.
const R = require('./fractions/rat');

const num = (s) => { try { return R.value(s); } catch (e) { return Number(String(s).replace(',', '.')); } };

/** Candidate wrong answers, most plausible first. */
function candidates(answer) {
  let m;
  if ((m = answer.match(/^(\d+) (\d+)\/(\d+)$/))) {           // mixed w a/b
    const [w, a, b] = m.slice(1).map(Number);
    return [`${w + 1} ${a}/${b}`, `${w} ${b - a}/${b}`, `${w - 1 > 0 ? w - 1 : w + 2} ${a}/${b}`, `${w} ${a}/${b + 1}`, `${w * b + a}/${b + 1}`];
  }
  if ((m = answer.match(/^(\d+)\/(\d+)$/))) {                   // fraction a/b
    const [a, b] = m.slice(1).map(Number);
    return [`${a + 1}/${b}`, `${a}/${b + 1}`, a > 1 ? `${a - 1}/${b}` : `${a}/${b + 2}`, `${b}/${a}`, `${a + 1}/${b + 1}`, `${a * 2}/${b + 1}`];
  }
  if (/^-?\d+$/.test(answer)) {                                   // integer
    const n = Number(answer);
    const half = n % 2 === 0 ? n / 2 : null;
    return [n * 2, half, n + 10, n - 10, n + 1, n - 1, n + 2, n + 5].filter((v) => v !== null).map(String);
  }
  if (/^-?\d+[.,]\d+$/.test(answer)) {                           // decimal
    const x = Number(answer.replace(',', '.'));
    return [x + 0.5, x - 0.5, x * 2, x + 1, x - 1].map((v) => String(Math.round(v * 100) / 100));
  }
  return [];
}

/** Three wrong options, distinct from each other and from the answer by value. */
function distractors(answer) {
  const target = num(answer);
  const seen = [target];
  const out = [];
  for (const c of candidates(answer)) {
    const v = num(c);
    if (!Number.isFinite(v) || (v < 0 && target >= 0) || seen.some((x) => Math.abs(x - v) < 1e-9)) continue;
    if (/\/0$/.test(c) || /^0\//.test(c) && v === 0) continue;
    seen.push(v); out.push(c);
    if (out.length === 3) break;
  }
  if (out.length < 3) throw new Error(`Cannot build 3 wrong options for answer "${answer}"`);
  return out;
}

function toMultipleChoice(e) {
  if (e.type !== 'fill_in_blank') return e;
  const options = distractors(e.correctAnswer);
  options.splice(e.questionNumber % 4, 0, e.correctAnswer);
  const { hintHe, ...rest } = e;
  return { ...rest, type: 'multiple_choice', options };
}

const asMultipleChoice = (lessons) =>
  lessons.map((l) => ({ ...l, exercises: (l.exercises || []).map(toMultipleChoice) }));

/** What every Math seed exports: stacked fractions + multiple choice only. */
const finishMath = (lessons) => asMultipleChoice(withStackedFractions(lessons));

module.exports = { ltr, expr, mc, fib, stackFractions, withStackedFractions, asMultipleChoice, finishMath };
