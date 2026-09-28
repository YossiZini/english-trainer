/**
 * Answer comparison shared by check, submit, mistake-retry and the bot
 * (`isCorrectAnswer`).
 *
 * A chosen multiple-choice option must be the answer exactly (case counts).
 * A typed answer compares trimmed and case-insensitively. When both answers
 * are numeric they compare by value, so a student is not marked wrong for
 * the form: 3/4 = 0.75 = 6/8, 1 1/2 = 1.5, 25% = 25, 90 ₪ = 90, -7 = −7,
 * 7,5 = 7.5.
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

/** True when both are numbers of the same value; null when either is not a number. */
function sameNumber(a, b) {
  const x = parseNumber(a);
  const y = parseNumber(b);
  return x !== null && y !== null ? Math.abs(x - y) < 1e-9 : null;
}

/** True when the student's (typed) answer matches the expected answer. */
function answersMatch(userAnswer, correctAnswer) {
  if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') return false;
  const numeric = sameNumber(userAnswer, correctAnswer);
  if (numeric !== null) return numeric;
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * True when a chosen multiple-choice option is the expected answer. The option
 * is one of the exercise's own strings, so text must match exactly: case is
 * part of the answer when the options differ only in capitals ("i like pizza"
 * vs "I like pizza"). Numbers still compare by value.
 */
function choiceMatches(choice, correctAnswer) {
  if (typeof choice !== 'string' || typeof correctAnswer !== 'string') return false;
  const numeric = sameNumber(choice, correctAnswer);
  if (numeric !== null) return numeric;
  return choice.trim() === correctAnswer.trim();
}

/** Whether `userAnswer` answers `exercise` ({ type, correct_answer }) correctly. */
function isCorrectAnswer(exercise, userAnswer) {
  const match = exercise.type === 'multiple_choice' ? choiceMatches : answersMatch;
  return match(userAnswer, exercise.correct_answer);
}

module.exports = { answersMatch, choiceMatches, isCorrectAnswer, parseNumber };
