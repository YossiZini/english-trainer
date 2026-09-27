// Exact rational arithmetic for the Fractions seeds: answers are computed,
// never typed by hand. Values are "a/b", "w a/b", or integers as strings.

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** Parse "3/4", "1 1/2", "5" or a number into [num, den] in lowest terms. */
function parse(v) {
  if (Array.isArray(v)) return norm(v[0], v[1]);
  if (typeof v === 'number') return norm(v, 1);
  const s = String(v).trim().replace('−', '-');
  let m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
  if (m) {
    const sign = m[1] ? -1 : 1;
    return norm(sign * (Number(m[2]) * Number(m[4]) + Number(m[3])), Number(m[4]));
  }
  m = s.match(/^(-?\d+)\/(\d+)$/);
  if (m) return norm(Number(m[1]), Number(m[2]));
  if (/^-?\d+$/.test(s)) return norm(Number(s), 1);
  throw new Error(`Not a rational: ${v}`);
}

function norm(n, d) {
  if (d === 0) throw new Error('Zero denominator');
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}

const add = (a, b) => { const [n1, d1] = parse(a), [n2, d2] = parse(b); return norm(n1 * d2 + n2 * d1, d1 * d2); };
const sub = (a, b) => { const [n1, d1] = parse(a), [n2, d2] = parse(b); return norm(n1 * d2 - n2 * d1, d1 * d2); };
const mul = (a, b) => { const [n1, d1] = parse(a), [n2, d2] = parse(b); return norm(n1 * n2, d1 * d2); };
const div = (a, b) => { const [n1, d1] = parse(a), [n2, d2] = parse(b); return norm(n1 * d2, d1 * n2); };
const cmp = (a, b) => { const [n1, d1] = parse(a), [n2, d2] = parse(b); return Math.sign(n1 * d2 - n2 * d1); };
const value = (a) => { const [n, d] = parse(a); return n / d; };

/** "3/4", "7/3" (improper), "5" for whole numbers. */
function str(a) {
  const [n, d] = parse(a);
  return d === 1 ? String(n) : `${n}/${d}`;
}

/** Mixed form: "2 1/3", "5", "3/4". */
function mixed(a) {
  const [n, d] = parse(a);
  if (d === 1) return String(n);
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const whole = Math.floor(abs / d);
  const rest = abs % d;
  return whole === 0 ? `${sign}${rest}/${d}` : `${sign}${whole} ${rest}/${d}`;
}

/** Unreduced fraction as written, e.g. raw(6, 8) -> "6/8". */
const raw = (n, d) => `${n}/${d}`;

/** Largest of several fractions, returned as written in the list. */
const largest = (list) => list.reduce((best, x) => (cmp(x, best) > 0 ? x : best));
const smallest = (list) => list.reduce((best, x) => (cmp(x, best) < 0 ? x : best));

module.exports = { gcd, parse, add, sub, mul, div, cmp, value, str, mixed, raw, largest, smallest };
