// Shared bits for the equations chapter (topic 109, shown as chapter 10, after
// the triangles): linear expressions a·x + b written the textbook way ("3x + 2",
// a real minus sign), an exact solver, wrong options from the common mistakes,
// balance pictures built from an equation, and the lesson builder.
// Reading order: math-content-guide.md, "Equations with the unknown x".
const { ltr, mcq, P, eq, mathLesson } = require('../multiplication/common');

/** An integer as written in the lessons: "−3", "0", "5". */
const S = P.signed;

/** a·x + b as text: [3, 2] → "3x + 2", [1, −4] → "x − 4", [−1, 5] → "−x + 5", [0, 7] → "7". */
function lin([a, b]) {
  const ax = a === 0 ? '' : a === 1 ? 'x' : a === -1 ? '−x' : `${S(a)}x`;
  if (!ax) return S(b);
  return b === 0 ? ax : `${ax} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
}

/** The equation l = r as text: eqn([1, 5], [0, 12]) → "x + 5 = 12". */
const eqn = (l, r) => `${lin(l)} = ${lin(r)}`;

/** The one solution of a·x + b = c·x + d; an equation without one whole solution is refused. */
function solve([a, b], [c, d]) {
  if (a === c) throw new Error(`${eqn([a, b], [c, d])}: no single solution`);
  const x = (d - b) / (a - c);
  if (!Number.isInteger(x)) throw new Error(`${eqn([a, b], [c, d])}: x = ${x} is not a whole number`);
  return x;
}

/** The value of a·x + b at x. */
const at = ([a, b], x) => a * x + b;

/** The first three different whole numbers of `candidates` that are not `answer`, as options. */
function wrongsOf(answer, candidates) {
  const out = [];
  for (const v of candidates) {
    if (Number.isInteger(v) && S(v) !== S(answer) && !out.includes(S(v))) out.push(S(v));
  }
  if (out.length < 3) throw new Error(`Not enough wrong options for ${answer}`);
  return out.slice(0, 3);
}

/** A question whose answer is a whole number (the value of x, or of an expression). */
const numQ = (n, level, text, answer, candidates, explanation, { picture = null } = {}) =>
  mcq(n, level, text, S(answer), wrongsOf(answer, candidates), explanation, picture);

/** A question with its own options (yes or no, words). */
const choiceQ = (n, level, text, answer, wrongs, explanation, { picture = null } = {}) =>
  mcq(n, level, text, answer, wrongs, explanation, picture);

/**
 * The pans of a·x + b = c·x + d as balance items: a boxes and b cubes (a
 * weight above 15) against c boxes and d. Only for equations whose numbers
 * are all whole and positive: a negative weight has no place on a balance.
 * `take` strikes that many cubes from both pans (what leaves both sides);
 * `box` labels the boxes ('?' in 10.1).
 */
function pans([a, b], [c, d], { take = 0, box = 'x' } = {}) {
  if ([a, b, c, d].some((v) => v < 0 || !Number.isInteger(v))) throw new Error(`pans: ${eqn([a, b], [c, d])} has a negative or broken number`);
  const side = (k, m) => {
    const items = Array.from({ length: k }, () => ({ box }));
    const keep = m - take;
    if (keep < 0) throw new Error(`pans: cannot take ${take} from ${m}`);
    const weigh = (v, crossed) => (v ? [m > 15 ? { weight: v, crossed } : { units: v, crossed }] : []);
    return [...items, ...weigh(keep, false), ...weigh(take, true)];
  };
  return { left: side(a, b), right: side(c, d) };
}

/** A balance in the theory, at full size. */
const balFig = (opts, caption) => P.figure(P.balance(opts), caption);

/**
 * A balance under an explanation, at 0.8 of its size: P.balance carries the
 * class math-grid, so the feedback box does not squeeze it further.
 */
const balPic = (opts, caption) => P.figures(P.figure(P.balance({ scale: 0.8, ...opts }), caption));

/** A lesson object with the shared fields of topic 109: after the triangles (1081…). */
const lesson = (...args) => mathLesson({ topic: 109, order: 1090, options: 'letters', noQuote: true }, ...args);

module.exports = { ltr, P, eq, S, lin, eqn, solve, at, wrongsOf, numQ, choiceQ, pans, balFig, balPic, lesson };
