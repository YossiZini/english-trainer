/**
 * Answer comparison shared by check, submit and mistake-retry.
 *
 * Text answers (English exercises) compare trimmed and case-insensitively,
 * as before. When both answers are numeric they compare by value, so a
 * student is not marked wrong for the form: 3/4 = 0.75 = 6/8, 1 1/2 = 1.5,
 * 25% = 25, 90 ₪ = 90, -7 = −7, 7,5 = 7.5.
 */

const NUMBER = /^[+\-−]?\d+(?:[.,]\d+)?$/;
const FRACTION = /^([+\-−]?)(\d+)\s*\/\s*(\d+)$/;
const MIXED = /^([+\-−]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/;

/** Numeric value of an answer string, or null when it is not a number. */
function parseNumber(text) {
  if (typeof text !== 'string') return null;
  // Strip bidi isolates/marks, a percent sign and currency symbols, then spaces.
  const s = text
    .replace(/[⁦-⁩‎‏]/g, '')
    .replace(/[%₪$€]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!s) return null;
  const sign = (m) => (m === '-' || m === '−' ? -1 : 1);

  let m = s.match(MIXED);
  if (m) {
    const [, sg, whole, num, den] = m;
    if (Number(den) === 0) return null;
    return sign(sg) * (Number(whole) + Number(num) / Number(den));
  }
  m = s.match(FRACTION);
  if (m) {
    const [, sg, num, den] = m;
    if (Number(den) === 0) return null;
    return sign(sg) * (Number(num) / Number(den));
  }
  if (NUMBER.test(s)) {
    return Number(s.replace('−', '-').replace(',', '.'));
  }
  return null;
}

/** True when the student's answer matches the expected answer. */
function answersMatch(userAnswer, correctAnswer) {
  if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') return false;
  const user = parseNumber(userAnswer);
  const correct = parseNumber(correctAnswer);
  if (user !== null && correct !== null) {
    return Math.abs(user - correct) < 1e-9;
  }
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

module.exports = { answersMatch, parseNumber };
