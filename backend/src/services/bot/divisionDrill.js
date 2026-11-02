const { ltr } = require('../../utils/bidi');

/**
 * /hiluk in the chat bot: the division variant of the drill (the Math
 * chapter "חילוק"). Ten new questions per round, easiest first: five with a
 * remainder (17 ÷ 5: divisor and quotient 2–9) and five long divisions (two
 * of a two-digit number, three of a three-digit one, one of them with a 0
 * inside the quotient), about half with a remainder. A question is
 * { text: '17 ÷ 5', answer: 3, remainder: 2 } (remainder 0 when exact).
 *
 * The student types the quotient and the remainder: "3 2", "3 שארית 2",
 * "3 ש 2", "3r2" or "מנה 3, שארית 2"; an exact quotient alone ("24").
 */
const SIZE = 10;

const pick = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
/** A remainder for a divisor about half of the time (0 otherwise). */
const someRemainder = (d) => (Math.random() < 0.5 ? 0 : pick(1, d - 1));

/** Five different "a ÷ d" with a remainder: d and the quotient 2–9. */
function remainderQuestions(count) {
  const out = new Map();
  while (out.size < count) {
    const d = pick(2, 9), q = pick(2, 9), r = pick(1, d - 1);
    const a = d * q + r;
    out.set(`${a} ÷ ${d}`, { text: `${a} ÷ ${d}`, answer: q, remainder: r });
  }
  return [...out.values()];
}

/**
 * One long division: a two-digit or three-digit dividend, a quotient of at
 * least 10 (so the division takes more than one step); `zero` asks for a 0
 * between the quotient's first and last digit (412 ÷ 4 = 103).
 */
function longQuestion({ digits, zero = false }) {
  for (;;) {
    const d = pick(2, 9);
    const q = zero ? pick(1, 9) * 100 + pick(1, 9) : pick(10, Math.floor((10 ** digits - 1) / d));
    const r = someRemainder(d);
    const a = d * q + r;
    if (q >= 10 && String(a).length === digits) return { text: `${a} ÷ ${d}`, answer: q, remainder: r };
  }
}

function makeQuestions() {
  const questions = remainderQuestions(SIZE / 2);
  const seen = new Set(questions.map(q => q.text));
  for (const spec of [{ digits: 2 }, { digits: 2 }, { digits: 3 }, { digits: 3 }, { digits: 3, zero: true }]) {
    let q;
    do q = longQuestion(spec); while (seen.has(q.text));
    seen.add(q.text);
    questions.push(q);
  }
  return questions;
}

// Words and signs between the quotient and the remainder; "מנה" before it.
const SEPARATORS = new Set(['שארית', 'ושארית', 'ש', "ש'", 'ש׳', 'r', 'מנה', ',']);

/**
 * A typed answer as { quotient, remainder } (remainder null when only one
 * number was typed), or null when the text is not an answer.
 */
function read(text) {
  const tokens = String(text || '')
    .replace(/[⁦-⁩‎‏]/g, '')
    .toLowerCase()
    .replace(/,/g, ' , ')
    .replace(/(\d)(?=\D)/g, '$1 ')
    .replace(/(\D)(?=\d)/g, '$1 ')
    .split(/\s+/)
    .filter(t => t && !SEPARATORS.has(t));
  if (tokens.length < 1 || tokens.length > 2 || !tokens.every(t => /^\d{1,4}$/.test(t))) return null;
  return { quotient: Number(tokens[0]), remainder: tokens.length === 2 ? Number(tokens[1]) : null };
}

/**
 * 'correct', 'wrong', or 'missingRemainder' when the quotient is right but
 * the remainder was left out (the question is asked again, nothing counted).
 */
function judge(question, given) {
  if (given.remainder === null) {
    if (given.quotient !== question.answer) return 'wrong';
    return question.remainder > 0 ? 'missingRemainder' : 'correct';
  }
  return given.quotient === question.answer && given.remainder === question.remainder ? 'correct' : 'wrong';
}

const divisorOf = (question) => Number(question.text.split(' ÷ ')[1]);
const dividendOf = (question) => Number(question.text.split(' ÷ ')[0]);

/** The whole fact: "17 ÷ 5 = 3 ושארית 2", or "84 ÷ 4 = 21". */
function fact(question) {
  const eq = ltr(`${question.text} = ${question.answer}`);
  return question.remainder ? `${eq} ושארית ${question.remainder}` : eq;
}

/** The check by multiplication: "3 × 5 + 2 = 17". */
function check(question) {
  const d = divisorOf(question), a = dividendOf(question);
  return question.remainder ? ltr(`${question.answer} × ${d} + ${question.remainder} = ${a}`) : ltr(`${question.answer} × ${d} = ${a}`);
}

/** A hint for a wrong answer whose remainder is not smaller than the divisor. */
function hint(question, given) {
  return given.remainder !== null && given.remainder >= divisorOf(question) ? { remainderTooBig: divisorOf(question) } : {};
}

module.exports = { makeQuestions, read, judge, fact, check, hint, SIZE };
