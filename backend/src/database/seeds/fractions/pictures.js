// Pictures for solution explanations of Fractions exercises.
// pictureFor(expression) draws the computation the explanation describes;
// the named helpers build pictures for word problems and comparisons.
// Everything returns a <figure> HTML string (or null when no picture helps).
const P = require('../math-svg');
const R = require('./rat');

const lcm = (a, b) => (a * b) / R.gcd(a, b);
const cap = (s) => `<span dir="ltr">${s}</span>`;
const BAR = { width: 200, height: 30 };

/** Circles for a value ≥ 1: whole circles plus the remaining part. */
function wholesAndPart(value, den, size = 56) {
  const [n, d] = R.parse(value);
  const whole = Math.floor(n / d);
  const rest = n % d;
  if (whole > 5) return null;
  const circles = [];
  for (let i = 0; i < whole; i++) circles.push(P.circle(den, den, { size }));
  if (rest) circles.push(P.circle((rest * den) / d, den, { size }));
  return P.row(...circles);
}

/** Bars at a common denominator for a + b or a − b, and the result. */
function addSub(a, b, op) {
  const [n1, d1] = R.parse(a), [n2, d2] = R.parse(b);
  const d = lcm(d1, d2);
  if (d > 24) return null;
  const x = n1 * (d / d1), y = n2 * (d / d2);
  const result = op === '+' ? R.add(a, b) : R.sub(a, b);
  const [rn, rd] = result;
  if (rn < 0) return null;
  const resultPic = rn <= rd ? P.bar((rn * d) / rd, d, BAR) : wholesAndPart(result, d <= 12 ? d : rd);
  if (!resultPic) return null;
  return P.figures(
    P.figure(P.bar(x, d, BAR), cap(`${R.str(a)}${d !== d1 ? ` = ${x}/${d}` : ''}`)),
    P.figure(P.bar(y, d, BAR), cap(`${op} ${R.str(b)}${d !== d2 ? ` = ${y}/${d}` : ''}`)),
    P.figure(resultPic, cap(`= ${rn > rd ? R.mixed(result) : R.str(result)}`))
  );
}

/** Area grid for a proper fraction times a proper fraction; circles for n × a/b. */
function mul(a, b) {
  const [n1, d1] = R.parse(a), [n2, d2] = R.parse(b);
  const result = R.mul(a, b);
  if (d1 === 1 && d2 > 1 && n1 <= 6) {
    const circles = Array.from({ length: n1 }, () => P.circle(n2, d2, { size: 56 }));
    return P.figure(P.row(...circles), cap(`${n1} × ${R.str(b)} = ${R.str(result)}`));
  }
  if (d2 === 1 && d1 > 1 && n2 <= 6) return mul(b, a);
  if (d1 > 1 && d2 > 1 && n1 <= d1 && n2 <= d2 && d1 <= 8 && d2 <= 8) {
    return P.figure(P.grid(d1, d2, n1, n2), cap(`${R.str(a)} × ${R.str(b)}: ${n1 * n2} מתוך ${d1 * d2} = ${R.str(result)}`));
  }
  return null;
}

/** Division: how many pieces of b fit in a. */
function div(a, b) {
  const [n1, d1] = R.parse(a), [n2, d2] = R.parse(b);
  const result = R.div(a, b);
  if (d2 > 1 && n2 === 1 && d1 === 1 && n1 <= 5) {
    // whole number ÷ unit fraction: n circles cut into d2 pieces
    const circles = Array.from({ length: n1 }, () => P.circle(d2, d2, { size: 56 }));
    return P.figure(P.row(...circles), cap(`${n1} ÷ ${R.str(b)}: ${n1 * d2} חלקים`));
  }
  const d = lcm(d1, d2);
  if (d > 24 || n1 / d1 > 3) return null;
  const x = n1 * (d / d1), y = n2 * (d / d2);
  const dividend = x <= d ? P.bar(x, d, BAR) : wholesAndPart(a, d);
  if (!dividend) return null;
  return P.figures(
    P.figure(dividend, cap(`${R.str(a)}${d !== d1 ? ` = ${x}/${d}` : ''}`)),
    P.figure(P.bar(y, d, BAR), cap(`÷ ${R.str(b)}${d !== d2 ? ` = ${y}/${d}` : ''}`)),
    P.figure(P.bar(Math.min(y, d), d, BAR), `${cap(R.str(b))} נכנס ${cap(R.str(result))} פעמים`)
  );
}

/** One fraction next to its reduced (or expanded) form. */
function equivalent(a, b) {
  const [n1, d1] = R.parse([...String(a).split('/').map(Number)]);
  const [n2, d2] = R.parse([...String(b).split('/').map(Number)]);
  if (d1 > 24 || d2 > 24) return null;
  return P.figures(
    P.figure(P.bar(n1, d1, BAR), cap(a)),
    P.figure(P.bar(n2, d2, BAR), cap(`= ${b}`))
  );
}

/** Two fractions at a common denominator, for comparisons. */
function compare(a, b) {
  const [n1, d1] = R.parse(a), [n2, d2] = R.parse(b);
  const d = lcm(d1, d2);
  if (d > 24 || n1 > d1 || n2 > d2) return null;
  return P.figures(
    P.figure(P.bar(n1 * (d / d1), d, BAR), cap(`${R.str(a)}${d !== d1 ? ` = ${n1 * (d / d1)}/${d}` : ''}`)),
    P.figure(P.bar(n2 * (d / d2), d, BAR), cap(`${R.str(b)}${d !== d2 ? ` = ${n2 * (d / d2)}/${d}` : ''}`))
  );
}

/** A mixed number / improper fraction as whole circles and a part. */
function mixed(value) {
  const [n, d] = R.parse(value);
  if (d > 12 || n / d > 5) return null;
  const pic = wholesAndPart(value, d);
  return pic && P.figure(pic, cap(`${R.mixed(value)} = ${R.str(value)}`));
}

/** A fraction of a quantity: the bar's shaded part is the answer. */
function ofQuantity(fraction, total) {
  const [n, d] = R.parse(fraction);
  if (d > 12) return null;
  const part = (total / d) * n;
  return P.figure(P.bar(n, d, { width: 240, height: 30 }), `${total} מחולק ל-${d} חלקים של ${total / d}; ${n} חלקים הם ${part}`);
}

/**
 * Picture for a bare computation "a ∘ b" written with ×, ÷, +, −.
 * Handles one operation only; returns null for anything else.
 */
function pictureFor(expression) {
  const m = expression.trim().match(/^(\d+ \d+\/\d+|\d+\/\d+|\d+) ([+−×÷]) (\d+ \d+\/\d+|\d+\/\d+|\d+)$/);
  if (!m) return null;
  const [, a, op, b] = m;
  try {
    if (op === '+' || op === '−') return addSub(a, b, op);
    if (op === '×') return mul(a, b);
    if (op === '÷') return div(a, b);
  } catch (e) {
    return null;
  }
  return null;
}

module.exports = { pictureFor, addSub, mul, div, equivalent, compare, mixed, ofQuantity };
