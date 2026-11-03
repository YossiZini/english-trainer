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
 * `take` strikes that many cubes from both pans (what leaves both sides),
 * `takeX` that many boxes; `box` labels the boxes ('?' in 10.1).
 */
function pans([a, b], [c, d], { take = 0, takeX = 0, box = 'x' } = {}) {
  if ([a, b, c, d].some((v) => v < 0 || !Number.isInteger(v))) throw new Error(`pans: ${eqn([a, b], [c, d])} has a negative or broken number`);
  const side = (k, m) => {
    if (k < takeX) throw new Error(`pans: cannot take ${takeX} boxes from ${k}`);
    const items = Array.from({ length: k }, (_, i) => (i < k - takeX ? { box } : { box, crossed: true }));
    const keep = m - take;
    if (keep < 0) throw new Error(`pans: cannot take ${take} from ${m}`);
    const weigh = (v, crossed) => (v ? [m > 15 ? { weight: v, crossed } : { units: v, crossed }] : []);
    return [...items, ...weigh(keep, false), ...weigh(take, true)];
  };
  return { left: side(a, b), right: side(c, d) };
}

/** "ב-3", or "ב-⁦(−3)⁩": a negative number in Hebrew text stays in its isolate. */
const by = (v) => (v < 0 ? ltr(`(${S(v)})`) : S(v));

/** kx as written: 1 → "x", 3 → "3x", −1 → "−x". */
const xs = (k) => (k === 1 ? 'x' : k === -1 ? '−x' : `${S(k)}x`);

/**
 * The equation as written with x put in: plug('2(x + 3)', 4) → "2 × (4 + 3)",
 * plug('3x − 2', −1) → "3 × (−1) − 2". A negative x goes in parentheses,
 * except first in the expression or right after "(": "−5 + 7", "2 × (−5 + 7)".
 */
function plug(text, x) {
  const X = x < 0 ? `(${S(x)})` : S(x);
  return text
    .replace(/(\d)\(/g, '$1 × (')
    .replace(/(\d)x/g, `$1 × ${X}`)
    .replace(/−x/g, `−${X}`)
    .replace(/^x|\(x/g, (m) => `${m === 'x' ? '' : '('}${S(x)}`)
    .replace(/x/g, X);
}

/** One side with x put in and its value: "3 × 4 + 2 = 14"; a side that is just x gives its value alone. */
const putIn = (side, x, v) => (plug(side, x).replace(/[()]/g, '') === S(v) ? S(v) : `${plug(side, x)} = ${S(v)}`);

/**
 * The steps that solve l = r, one sentence each, then the check in the
 * equation as written (`text`, default eqn(l, r)): take the smaller number
 * of x off both sides (so x stays positive), then the number on the side of
 * x, then divide. `first` opens the explanation (a story's equation, opening
 * parentheses); `orig` the sides of the written equation, when l = r is
 * another form of it (2(x + 3) = 14 solved as x + 3 = 7).
 */
function steps(l, r, { text = null, first = '', orig = null } = {}) {
  let [a, b] = l;
  let [c, d] = r;
  const x = solve(l, r);
  const out = [];
  const show = (L, R) => ltr(eqn(L, R));
  if (a !== 0 && c !== 0) {
    const k = a > c ? c : a;
    out.push(`${k > 0 ? `מורידים ${ltr(xs(k))} משני` : `מוסיפים ${ltr(xs(-k))} לשני`} האגפים: ${show([a - k, b], [c - k, d])}.`);
    a -= k; c -= k;
  }
  const left = a !== 0;
  const coef = left ? a : c;
  let num = left ? b : d;
  let other = left ? d : b;
  if (num !== 0) {
    other -= num;
    out.push(`${num > 0 ? `מורידים ${num} משני` : `מוסיפים ${-num} לשני`} האגפים: ${left ? show([coef, 0], [0, other]) : show([0, other], [coef, 0])}.`);
    num = 0;
  }
  if (coef !== 1) out.push(`מחלקים את שני האגפים ב-${by(coef)}: ${ltr(`x = ${S(x)}`)}.`);
  else if (!left) out.push(`כלומר ${ltr(`x = ${S(x)}`)}.`);
  // The check puts x into the equation as written: `orig` are its sides when the steps start from another form.
  const [lt, rt] = (text || eqn(l, r)).split(' = ');
  const [L0, R0] = orig || [l, r];
  const lv = at(L0, x), rv = at(R0, x);
  const lx = /x/.test(lt), rx = /x/.test(rt);
  const check = lx && rx
    ? `בדיקה: באגף שמאל ${ltr(putIn(lt, x, lv))}, ובאגף ימין ${ltr(putIn(rt, x, rv))}.`
    : `בדיקה: ${ltr(lx ? `${plug(lt, x)} = ${S(rv)}` : `${S(lv)} = ${plug(rt, x)}`)}.`;
  return `${first}${out.join(' ')} ${check}`;
}

/**
 * Is x = s the solution of l = r (written `shown`)? Both sides with s put in;
 * yes, no, or "cannot be checked".
 */
function checkQ(n, level, l, r, s, { shown = null } = {}) {
  const text = shown || eqn(l, r);
  const [lt, rt] = text.split(' = ');
  const lv = at(l, s), rv = at(r, s);
  const right = lv === rv;
  const why = `מציבים ${s < 0 ? ltr(S(s)) : s} במקום x: באגף שמאל ${ltr(putIn(lt, s, lv))}, ובאגף ימין ${ltr(putIn(rt, s, rv))}. ${right ? 'שני האגפים שווים, ולכן כן.' : 'האגפים לא שווים, ולכן לא.'}`;
  return choiceQ(n, level, `האם ${ltr(`x = ${S(s)}`)} הוא הפתרון של המשוואה ${ltr(text)}?`, right ? 'כן' : 'לא',
    [right ? 'לא' : 'כן', 'אי אפשר לבדוק'], why);
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

module.exports = { ltr, P, eq, S, lin, eqn, solve, at, wrongsOf, numQ, choiceQ, pans, balFig, balPic, lesson, by, xs, plug, putIn, steps, checkQ };
