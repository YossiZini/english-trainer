// Shared bits for the ratio chapter (topic 111, shown as chapter 12, after
// Equations): ratios written a:b with no spaces, simplifying, sharing an
// amount in a ratio, the missing term of a proportion, wrong options from the
// common mistakes, pictures under an explanation, and the lesson builder.
// Reading order: math-content-guide.md, "Ratios".
const { ltr, P, eq, pic, mathLesson, optionsQuestion, firstWrongs } = require('../multiplication/common');

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** A ratio as written: ratio(3, 5) → "3:5" (no spaces: "3 : 5" reads backwards in Hebrew). */
const ratio = (...terms) => terms.join(':');

/** The simplest form of a ratio of whole numbers: simplest(12, 18) → [2, 3]. */
function simplest(...terms) {
  if (terms.some((t) => !Number.isInteger(t) || t <= 0)) throw new Error(`simplest: ${terms.join(':')} is not a ratio of whole numbers`);
  const g = terms.reduce(gcd);
  return terms.map((t) => t / g);
}

/** Two ratios are equal when one is the other times a number: same(2, 3, 4, 6). */
const same = ([a, b], [c, d]) => a * d === b * c;

/**
 * An amount shared in a ratio: share(40, [3, 5]) → { parts: 8, one: 5, shares: [15, 25] }.
 * Refused unless every share is a whole number.
 */
function share(total, terms) {
  const parts = terms.reduce((s, t) => s + t, 0);
  if (total % parts) throw new Error(`share: ${total} does not split into ${parts} equal parts`);
  const one = total / parts;
  return { parts, one, shares: terms.map((t) => t * one) };
}

/**
 * The missing term of a:b = c:d (exactly one of them null), from the product
 * of the outer terms and of the inner ones; refused unless it is whole.
 */
function missing(a, b, c, d) {
  const terms = [a, b, c, d];
  if (terms.filter((t) => t === null).length !== 1) throw new Error('missing: exactly one term is missing');
  const i = terms.indexOf(null);
  // a × d = b × c: the missing term is the product of the two across from it divided by its partner.
  const [num, den] = { 0: [b * c, d], 1: [a * d, c], 2: [a * d, b], 3: [b * c, a] }[i];
  if (num % den) throw new Error(`missing: ${terms.map((t) => (t === null ? 'x' : t)).join(':')} has no whole term`);
  return num / den;
}

/** The first three different whole numbers of `candidates` that are not `answer`, as options. */
const wrongsOf = (answer, candidates) => firstWrongs(answer, candidates).map(String);

/** A question whose answer is a whole number. */
const numQ = (n, level, text, answer, candidates, explanation, opts) =>
  optionsQuestion(n, level, text, String(answer), wrongsOf(answer, candidates), explanation, opts);

/** A question with its own options (ratios, fractions, yes or no, names). */
const choiceQ = (n, level, text, answer, wrongs, explanation, opts) =>
  optionsQuestion(n, level, text, answer, wrongs, explanation, opts);

/** A bar model under an explanation; P.ratioBar carries math-grid, so the feedback box does not squeeze it. */
const barPic = (rows, caption) => pic(P.ratioBar(rows), caption);

/** A ratio table under an explanation. */
const tablePic = (opts, caption) => pic(P.ratioTable(opts), caption);

/**
 * A lesson object with the shared fields of topic 111: after the equations
 * (1091–1097). `oneLine`: its equations hold stacked fractions (2/5 of the class).
 */
const lesson = (...args) => mathLesson({ topic: 111, order: 1110, options: 'letters', noQuote: true, oneLine: true }, ...args);

module.exports = { ltr, P, eq, pic, gcd, ratio, simplest, same, share, missing, wrongsOf, numQ, choiceQ, barPic, tablePic, lesson };
