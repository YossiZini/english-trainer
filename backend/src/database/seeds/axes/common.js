// Shared bits for the coordinate-axes chapter (topic 107, shown as chapter
// 8): points written (x, y) with a real minus sign, wrong options from the
// common mistakes (x and y swapped, a sign flipped), the quarters, how a
// point is reached from the origin, grid pictures for the theory, the
// explanation and the question itself, and the lesson builder.
const { ltr, P, eq, mathLesson, optionsQuestion } = require('../multiplication/common');

/** An integer as written in the lessons: "−3", "0", "5". */
const S = P.signed;

/** A point as an option: "(2, −3)". */
const pair = (x, y) => `(${S(x)}, ${S(y)})`;

/** A point inside Hebrew text, kept left to right: "(2, −3)" or "A(2, −3)". */
const at = (x, y, name = '') => ltr(`${name}${pair(x, y)}`);

/** A signed number inside Hebrew text. */
const num = (v) => ltr(S(v));

const QUARTERS = ['הרביע הראשון', 'הרביע השני', 'הרביע השלישי', 'הרביע הרביעי'];

/** The quarter of a point (0–3), or -1 on an axis. */
const quarterOf = (x, y) => (x > 0 && y > 0 ? 0 : x < 0 && y > 0 ? 1 : x < 0 && y < 0 ? 2 : x > 0 && y < 0 ? 3 : -1);

/** How a point is reached from the origin: "3 ימינה, ואחר כך 2 למטה". */
function walk(x, y) {
  const sx = x > 0 ? `${x} ימינה` : x < 0 ? `${-x} שמאלה` : 'לא זזים ימינה או שמאלה';
  const sy = y > 0 ? `${y} למעלה` : y < 0 ? `${-y} למטה` : 'לא זזים למעלה או למטה';
  return `${sx}, ואחר כך ${sy}`;
}

/** The first three different points of `candidates` that are not (x, y), as options. */
function pairWrongs(x, y, candidates) {
  const out = [];
  for (const [a, b] of candidates) {
    const p = pair(a, b);
    if ((a !== x || b !== y) && !out.includes(p)) out.push(p);
  }
  if (out.length < 3) throw new Error(`Not enough wrong options for ${pair(x, y)}`);
  return out.slice(0, 3);
}

/** The usual mistakes with a point: x and y swapped, one sign or both flipped. */
const mistakesOf = (x, y) => [[y, x], [-x, y], [x, -y], [-x, -y], [-y, x], [y, -x]];

/** A grid for a question or a picture: the range fits the points, at least −4…4. */
function grid(points, opts = {}) {
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const range = {
    xMin: Math.min(-4, ...xs), xMax: Math.max(4, ...xs),
    yMin: Math.min(-4, ...ys), yMax: Math.max(4, ...ys)
  };
  return P.coordGrid({ ...range, points, ...opts });
}

/**
 * A grid under an explanation, at 0.8 of its size (about 180px): not through
 * pic(), whose 110px cap (and the phone's 72px) would make its numbers unreadable.
 */
const gridPic = (points, caption, opts = {}) => P.figures(P.figure(grid(points, { scale: 0.8, ...opts }), spans(caption)));

/**
 * A caption's points as <span dir="ltr"> rather than isolates: the caption's
 * dir="auto" skips such spans, so its Hebrew sets it right to left; inside an
 * isolate the letter A of "A(3, −2)" would make the caption left to right.
 */
const spans = (caption) => caption.replace(/\u2066([^\u2069]*)\u2069/g, '<span dir="ltr">$1</span>');

/** A question whose answer is a point. */
const pointQ = (n, level, text, [x, y], explanation, { extra = [], ...opts } = {}) =>
  optionsQuestion(n, level, text, pair(x, y), pairWrongs(x, y, [...extra, ...mistakesOf(x, y)]), explanation, opts);

/** A question whose answer is a whole number. */
function intQ(n, level, text, answer, candidates, explanation, opts) {
  const wrongs = [];
  for (const v of candidates) if (v !== answer && !wrongs.includes(v)) wrongs.push(v);
  if (wrongs.length < 3) throw new Error(`Not enough wrong options for ${answer}`);
  return optionsQuestion(n, level, text, S(answer), wrongs.slice(0, 3).map(S), explanation, opts);
}

/** A question with its own options (letters, quarters, words). */
const choiceQ = (n, level, text, answer, wrongs, explanation, opts) =>
  optionsQuestion(n, level, text, answer, wrongs, explanation, opts);

/** The quarter of (x, y) as a question. */
const quarterQ = (n, level, text, [x, y], explanation, opts = {}) =>
  choiceQ(n, level, text, QUARTERS[quarterOf(x, y)], QUARTERS.filter((_, i) => i !== quarterOf(x, y)), explanation, opts);

/** Points named A, B, C, D… from [[x, y], …]. */
const named = (coords, opts = {}) => coords.map(([x, y], i) => ({ x, y, label: 'ABCDEFG'[i], ...(opts[i] || {}) }));

/** A lesson object with the shared fields of topic 107: after negative numbers (1061…); triangles are 1081…. */
const lesson = (...args) => mathLesson({ topic: 107, order: 1070, options: 'letters', noQuote: true }, ...args);

module.exports = { ltr, P, S, pair, at, num, eq, spans, QUARTERS, quarterOf, walk, grid, gridPic, named, pointQ, intQ, choiceQ, quarterQ, lesson };
