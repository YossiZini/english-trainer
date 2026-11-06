// Shared bits for the linear functions chapter (topic 112, shown as chapter
// 13, last): a rule y = mx + b written as in a textbook, its value at x with
// the substitution shown, points, the slope between two points, wrong options
// from the common mistakes, grids with the whole line and tables of values for
// the theory, the explanation and the question, and the lesson builder.
// Reading order: math-content-guide.md, "Linear functions".
const { ltr, P, eq, pic, glue, mathLesson, optionsQuestion } = require('../multiplication/common');
// pointQ: a question whose answer is a point ("(3, 0)"), wrong ones from `extra`
// first, then x and y swapped and the signs flipped; it refuses fewer than three.
const { S, pair, at, num, spans, pointQ } = require('../axes/common');
const { gcd } = require('../ratio/common');

/**
 * A rule as written: rule(2, 1) → "y = 2x + 1", rule(−1, 3) → "y = −x + 3",
 * rule(3, 0) → "y = 3x", rule(0, −2) → "y = −2". Whole slopes and
 * intercepts only: the bot shows a fraction flat, and "1/2x" reads as 1 ÷ 2x.
 */
function rule(m, b) {
  if (!Number.isInteger(m) || !Number.isInteger(b)) throw new Error(`rule: y = ${m}x + ${b} needs a whole slope and intercept`);
  const mx = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : `${S(m)}x`;
  if (!mx) return `y = ${S(b)}`;
  return b === 0 ? `y = ${mx}` : `y = ${mx} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
}

/** The value of y = mx + b at x. */
const value = (m, b, x) => m * x + b;

/**
 * Putting x into the rule, as one line: "y = 2 × 3 + 1 = 7",
 * "y = 2 × (−1) + 1 = −1", "y = −(−2) + 3 = 5", "y = 3 + 1 = 4" (slope 1).
 * A negative x is in parentheses unless it comes first.
 */
function subst(m, b, x) {
  const xp = x < 0 ? `(${S(x)})` : S(x);
  const mx = m === 0 ? '' : m === 1 ? S(x) : m === -1 ? `−${xp}` : `${S(m)} × ${xp}`;
  const sum = !mx ? S(b) : b === 0 ? mx : `${mx} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
  const y = value(m, b, x);
  return sum === S(y) ? `y = ${sum}` : `y = ${sum} = ${S(y)}`;
}

/** The slope between two points: [rise, run] and the slope as a whole number or "a/b". */
function slopeOf([x1, y1], [x2, y2]) {
  if (x1 === x2) throw new Error('slopeOf: the two points are one above the other');
  const rise = y2 - y1, run = x2 - x1;
  const g = gcd(Math.abs(rise), Math.abs(run)) || 1;
  const [p, q] = [rise / g * Math.sign(run), Math.abs(run) / g];
  return { rise, run, slope: q === 1 ? S(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}` };
}

/** The first three different whole numbers of `candidates` that are not `answer`, written with a real minus. */
function wrongsOf(answer, candidates) {
  const out = [];
  for (const v of candidates) {
    if (Number.isInteger(v) && v !== answer && !out.includes(v)) out.push(v);
  }
  if (out.length < 3) throw new Error(`Not enough wrong options for ${answer}`);
  return out.slice(0, 3).map(S);
}

/** A question whose answer is a whole number. */
const numQ = (n, level, text, answer, candidates, explanation, opts) =>
  optionsQuestion(n, level, text, S(answer), wrongsOf(answer, candidates), explanation, opts);

/** A question with its own options (words, letters, fractions). */
const choiceQ = (n, level, text, answer, wrongs, explanation, opts) =>
  optionsQuestion(n, level, text, answer, wrongs, explanation, opts);

/** The usual mistakes with a rule: slope and intercept swapped, a sign flipped, one of them off by one. */
const ruleMistakes = (m, b) => [[b, m], [m, -b], [-m, b], [-m, -b], [m, b + 1], [m + 1, b], [m - 1, b], [m, b - 1]];

/**
 * A question whose answer is a rule: options are rules glued to one line
 * (y = 2x + 1), wrong ones from `extra` first, then the usual mistakes.
 */
function ruleQ(n, level, text, [m, b], explanation, { extra = [], ...opts } = {}) {
  const answer = glue(rule(m, b));
  const wrongs = [];
  for (const [p, q] of [...extra, ...ruleMistakes(m, b)]) {
    const r = glue(rule(p, q));
    if (r !== answer && !wrongs.includes(r)) wrongs.push(r);
  }
  if (wrongs.length < 3) throw new Error(`Not enough wrong rules for ${answer}`);
  return optionsQuestion(n, level, text, answer, wrongs.slice(0, 3), explanation, opts);
}

/**
 * A grid with whole lines: graph({ xMin, xMax, yMin, yMax, lines: [{ m, b, … }],
 * points, segments }). Lines are coordGrid's `graphs`; segments its `lines`.
 */
const graph = ({ lines = [], segments = [], ...opts }) => P.coordGrid({ ...opts, graphs: lines, lines: segments });

/** A grid for a question: at most 9 units high, so a 360px phone shows it with its options. */
function questionGraph(opts) {
  const { yMin = -4, yMax = 4 } = opts;
  if (yMax - yMin > 9) throw new Error(`questionGraph: ${yMax - yMin} units high, at most 9`);
  return graph(opts);
}

/**
 * A grid under an explanation or in the theory, at 0.8 of its size (not
 * through pic(), whose 110px cap would make the numbers unreadable); the
 * caption's isolates become <span dir="ltr">, which its dir="auto" skips.
 */
const graphPic = (opts, caption) => P.figures(P.figure(graph({ scale: 0.8, ...opts }), spans(caption)));

/**
 * The steps of a slope on a grid, as coordGrid segments: from the line at
 * each x, 1 to the right (dashed) and m up or down (an arrow labelled m).
 * stairs(2, 1, [0, 1]) climbs from (0, 1) to (1, 3) and on to (2, 5).
 */
const stairs = (m, b, xs) => xs.flatMap((x) => [
  { from: [x, value(m, b, x)], to: [x + 1, value(m, b, x)], dashed: true, color: 'b' },
  { from: [x + 1, value(m, b, x)], to: [x + 1, value(m, b, x + 1)], arrow: true, color: 'b', label: S(m) }
]);

/** A table of values under an explanation or in the theory. */
const tablePic = (cols, steps, caption) => pic(P.valueTable({ cols, steps }), caption);

/** The columns of a rule's table of values at the given x's. */
const tableOf = (m, b, xs) => xs.map((x) => [x, value(m, b, x)]);

/**
 * A lesson object with the shared fields of topic 112: after ratio and
 * proportion (1111–1113). `oneLine`: a slope may be a stacked fraction in an
 * equation (2 ÷ 4 = 1/2).
 */
const lesson = (...args) => mathLesson({ topic: 112, order: 1120, options: 'letters', noQuote: true, oneLine: true }, ...args);

module.exports = {
  ltr, P, S, eq, pic, glue, pair, at, num, rule, value, subst, slopeOf, wrongsOf, numQ, choiceQ, ruleQ, pointQ,
  graph, questionGraph, graphPic, stairs, tablePic, tableOf, lesson
};
