// Shared bits for the decimals chapter (topic 110, shown as chapter 4, after
// Fractions): exact decimal arithmetic on whole numbers (no floating point),
// numbers written the way the math guide says (a leading zero, no trailing
// zeros unless asked), wrong options from the common mistakes, pictures under
// an explanation, and the lesson builder.
// Reading order: math-content-guide.md, "Decimal numbers".
const { ltr, P, eq, pic, mathLesson, optionsQuestion } = require('../multiplication/common');

// A decimal is kept as a whole number of millionths (BigInt): 2.36 → 2360000n.
const PLACES = 6;
const ONE = 10n ** BigInt(PLACES);

/** A decimal from its text ('2.36', '0.5', '7') or as it is (a BigInt). Negative and over-long numbers are refused. */
function D(v) {
  if (typeof v === 'bigint') {
    if (v < 0n) throw new Error(`D: negative ${v}`);
    return v;
  }
  const m = String(v).match(/^(\d+)(?:\.(\d+))?$/);
  if (!m || (m[2] || '').length > PLACES) throw new Error(`D: not a decimal: ${v}`);
  return BigInt(m[1]) * ONE + BigInt((m[2] || '').padEnd(PLACES, '0') || '0');
}

/**
 * A decimal as the lessons write it: str('2.360') → '2.36', str('3.0') → '3'.
 * `places` writes exactly that many digits after the point (money: 2.50); a
 * number that needs more is refused.
 */
function str(v, places = null) {
  const n = D(v);
  const whole = n / ONE;
  let frac = (n % ONE).toString().padStart(PLACES, '0').replace(/0+$/, '');
  if (places !== null) {
    if (frac.length > places) throw new Error(`str: ${whole}.${frac} has more than ${places} digits after the point`);
    frac = frac.padEnd(places, '0');
  }
  return frac ? `${whole}.${frac}` : String(whole);
}

/** Digits after the point, as written: places('2.50') = 2, places('7') = 0. */
const places = (s) => (String(s).split('.')[1] || '').length;

const add = (a, b) => D(a) + D(b);
/** a − b; a negative difference is refused (this chapter has none). */
const sub = (a, b) => D(D(a) - D(b));
/** a × b, refused when the product needs more than six digits after the point. */
function mul(a, b) {
  const p = D(a) * D(b);
  if (p % ONE) throw new Error(`mul: ${str(a)} × ${str(b)} needs more than ${PLACES} places`);
  return p / ONE;
}
/** a ÷ b, refused unless it ends within six digits after the point. */
function div(a, b) {
  const q = D(a) * ONE;
  if (D(b) === 0n || q % D(b)) throw new Error(`div: ${str(a)} ÷ ${str(b)} does not end`);
  return q / D(b);
}
/** a × 10^k: k > 0 multiplies by 10, 100, 1000; k < 0 divides. */
const shift = (a, k) => (k >= 0 ? D(a) * 10n ** BigInt(k) : div(a, 10n ** BigInt(-k) * ONE));
/** Rounded to `k` digits after the point, half up: round('2.47', 1) → 2.5. */
function round(a, k) {
  const unit = 10n ** BigInt(PLACES - k);
  return ((D(a) + unit / 2n) / unit) * unit;
}
/** Cut to `k` digits after the point (the mistake of rounding down every time). */
const cut = (a, k) => { const unit = 10n ** BigInt(PLACES - k); return (D(a) / unit) * unit; };
/** −1, 0 or 1. */
const cmp = (a, b) => (D(a) > D(b) ? 1 : D(a) < D(b) ? -1 : 0);
/** The value a fraction n/d has as a decimal (it must end). */
const ofFraction = (n, d) => div(String(n), String(d));

/** The digits of a decimal without the point, as a whole number: digits('0.25') = 25. */
const digits = (s) => Number(String(s).replace('.', ''));

// ---------------------------------------------------------------------------
// Wrong options from the common mistakes. Each returns candidates as values
// (BigInt) or text; wrongsOf keeps the first three that differ from the answer
// by value.

/** The point in the wrong place: × 10, ÷ 10, × 100, ÷ 100 (when they end). */
function pointWrongs(v) {
  const out = [];
  for (const k of [1, -1, 2, -2]) {
    try { out.push(shift(v, k)); } catch (e) { /* does not end within six places */ }
  }
  return out;
}

/**
 * a + b with the points not lined up: the digits lined up from the right
 * (2.5 + 1.75 as 25 + 175, the point of the longer: 2.00), and the wholes and
 * the parts after the point added apart (2.5 + 1.75 = 3.80).
 */
function addWrongs(a, b) {
  const pa = places(a), pb = places(b);
  const right = digits(a) + digits(b);
  const [wa, fa = ''] = String(a).split('.');
  const [wb, fb = ''] = String(b).split('.');
  const out = [];
  if (pa !== pb) {
    out.push((BigInt(right) * ONE) / 10n ** BigInt(Math.max(pa, pb)));
    const parts = Number(fa || 0) + Number(fb || 0);
    out.push(D(`${Number(wa) + Number(wb)}.${parts}`));
  }
  return out;
}

/**
 * a − b with the common mistakes: the smaller digit taken from the larger in
 * each column (3.2 − 1.45 → 2.25), and only the wholes subtracted (5 − 1.25 → 4.25).
 */
function subWrongs(a, b) {
  const p = Math.max(places(a), places(b));
  const A = str(a, p).replace('.', ''), B = str(b, p).replace('.', '');
  const len = Math.max(A.length, B.length);
  const [ca, cb] = [A.padStart(len, '0'), B.padStart(len, '0')];
  const col = ca.split('').map((d, i) => Math.abs(Number(d) - Number(cb[i]))).join('');
  const out = [(BigInt(col) * ONE) / 10n ** BigInt(p)];
  const [wa] = String(a).split('.');
  const [wb, fb = ''] = String(b).split('.');
  if (fb && !String(a).includes('.') && Number(wa) >= Number(wb)) out.push(D(`${Number(wa) - Number(wb)}.${fb}`));
  return out;
}

/** a × b with the point counted wrong: the places of one factor only (0.3 × 0.2 = 0.6), or a + b. */
function mulWrongs(a, b) {
  const prod = BigInt(digits(a) * digits(b));
  const k = Math.max(places(a), places(b));
  return [(prod * ONE) / 10n ** BigInt(k), add(a, b), ...pointWrongs(mul(a, b))];
}

// ---------------------------------------------------------------------------
// Questions.

/** The first three different decimals of `candidates` that differ from `answer` by value, written with `places`. */
function wrongsOf(answer, candidates, places = null) {
  const seen = new Set([D(answer)]);
  const out = [];
  for (const c of candidates) {
    if (c === null || c === undefined) continue;
    if (typeof c === 'bigint' && c < 0n) continue;
    const v = D(c);
    if (seen.has(v)) continue;
    if (places !== null && str(v).split('.')[1]?.length > places) continue;
    seen.add(v);
    out.push(str(v, places));
  }
  if (out.length < 3) throw new Error(`Not enough wrong options for ${str(answer)}`);
  return out.slice(0, 3);
}

/**
 * A question whose answer is a decimal. `opts`: `picture` (under the
 * explanation), `question` (its own picture) and `places` (write every
 * option with that many digits after the point: 2.50 for money).
 */
function decQ(n, level, text, answer, candidates, explanation, opts = {}) {
  const { places: p = null, ...pictures } = opts;
  return optionsQuestion(n, level, text, str(answer, p), wrongsOf(answer, candidates, p), explanation, pictures);
}

/** A question with its own options (a digit, a fraction, words, a comparison). */
const choiceQ = (n, level, text, answer, wrongs, explanation, opts) =>
  optionsQuestion(n, level, text, answer, wrongs, explanation, opts);

/**
 * A lesson object with the shared fields of topic 110: after Fractions
 * (1001–1006). `oneLine`: its equations hold stacked fractions (0.7 = 7/10).
 */
const lesson = (...args) => mathLesson({ topic: 110, order: 1010, options: 'letters', noQuote: true, oneLine: true }, ...args);

module.exports = {
  ltr, P, eq, pic, D, str, places, add, sub, mul, div, shift, round, cut, cmp, ofFraction, digits,
  pointWrongs, addWrongs, subWrongs, mulWrongs, wrongsOf, decQ, choiceQ, lesson
};
