// Shared bits for the division chapter (topic 105, shown second in Math,
// right after the multiplication table): answers with a remainder, wrong
// options from the common mistakes, explanations, pictures and the lesson
// builder. Equations stay on one line (see multiplication/common.js).
const { ltr, expr, mcq, P, pic, glueEquations, firstWrongs } = require('../multiplication/common');

/**
 * A quotient with a remainder as an option: Hebrew first, so it reads the
 * same in the website's left-to-right option box and in Telegram
 * ("3 (שארית 2)" would come out scrambled next to the Hebrew word).
 */
const withRemainder = (q, r) => `מנה ${q}, שארית ${r}`;

const split = (a, d) => ({ q: Math.floor(a / d), r: a % d });

/**
 * Wrong answers for a ÷ d with a remainder, from the common mistakes: a
 * remainder not smaller than the divisor (one group too few), a quotient one
 * too many, a forgotten remainder, what is missing to the next group, the
 * two numbers swapped.
 */
function remainderWrongs(a, d) {
  const { q, r } = split(a, d);
  const candidates = [
    [q - 1, r + d],
    [q + 1, r],
    [q, 0],
    [q, d - r],
    [r, q],
    [q - 1, r],
    [q, r + 1],
    [q + 1, 0]
  ];
  const answer = withRemainder(q, r);
  const wrongs = [];
  for (const [wq, wr] of candidates) {
    const text = withRemainder(wq, wr);
    if (wq >= 0 && wr >= 0 && text !== answer && !wrongs.includes(text)) wrongs.push(text);
  }
  if (wrongs.length < 3) throw new Error(`Not enough wrong options for ${a} ÷ ${d}`);
  return wrongs.slice(0, 3);
}

/** a ÷ d explained: the largest multiple that fits, what is left, the check. */
function explainRemainder(a, d) {
  const { q, r } = split(a, d);
  if (r === 0) {
    return `${ltr(`${q} × ${d} = ${a}`)} בדיוק, ולכן ${ltr(`${a} ÷ ${d} = ${q}`)} ושארית 0.`;
  }
  return `הכפולה הגדולה של ${d} שלא עוברת את ${a}: ${ltr(`${q} × ${d} = ${q * d}`)}. `
    + `נשארו ${ltr(`${a} − ${q * d} = ${r}`)}, ו-${r} קטן מ-${d}. בדיקה: ${ltr(`${q} × ${d} + ${r} = ${a}`)}.`;
}

/** The groups and the leftovers of a ÷ d, when they are few enough to draw. */
function groupsPicture(a, d) {
  const { q, r } = split(a, d);
  if (a > 50 || q === 0) return null;
  return pic(P.groups(q, d, { leftover: r }), r ? `${q} קבוצות של ${d}, ונשארו ${r}` : `${q} קבוצות של ${d}`);
}

/** "a ÷ d = ?" answered as a quotient and a remainder. */
const remainderQ = (n, level, a, d) => {
  const { q, r } = split(a, d);
  return mcq(n, level, expr(`${a} ÷ ${d}`), withRemainder(q, r), remainderWrongs(a, d), explainRemainder(a, d), groupsPicture(a, d));
};

/**
 * The written steps of a long division, in one line each: divide, what is
 * left, bring down the next digit; a zero in the quotient is a step too
 * ("1 ÷ 4 = 0 ושארית 1"). Ends with the quotient and the check.
 */
function explainLong(a, d) {
  const digits = String(a).split('').map(Number);
  const pieces = [];
  let current = 0, started = false;
  for (let i = 0; i < digits.length; i++) {
    current = current * 10 + digits[i];
    if (!started && current < d && i < digits.length - 1) continue;
    started = true;
    const qd = Math.floor(current / d), rest = current - qd * d;
    let piece = `${ltr(`${current} ÷ ${d} = ${qd}`)}${rest ? ` ושארית ${rest}` : ''}`;
    if (i < digits.length - 1) piece += `, מורידים את ${digits[i + 1]}`;
    pieces.push(piece);
    current = rest;
  }
  const { q, r } = split(a, d);
  const check = r ? ltr(`${q} × ${d} + ${r} = ${a}`) : ltr(`${q} × ${d} = ${a}`);
  return `${pieces.join('; ')}. המנה ${q}${r ? ` ושארית ${r}` : ''}. בדיקה: ${check}.`;
}

/** The long division of a ÷ d as a picture under an explanation. */
const longPicture = (a, d) => pic(P.longDivision(a, d), `${ltr(`${a} ÷ ${d}`)} בחילוק ארוך`);

/**
 * Wrong answers for an exact long division: a dropped zero (103 → 13), the
 * digits swapped, one off in a digit, the tens forgotten, a digit too many.
 */
function longWrongs(a, d) {
  const q = a / d;
  const swapped = Number(String(q).split('').reverse().join(''));
  const noZero = Number(String(q).replace(/0/g, '')) || q;
  return firstWrongs(q, [noZero, swapped, q + 1, q - 1, q + 10, q - 10, Math.floor(a / 10 / d), q * 10, q + 2]);
}

/** "a ÷ d = ?" by long division: the quotient, or the quotient and a remainder. */
function longQ(n, level, a, d) {
  const { q, r } = split(a, d);
  if (r === 0) return mcq(n, level, expr(`${a} ÷ ${d}`), String(q), longWrongs(a, d).map(String), explainLong(a, d), longPicture(a, d));
  return mcq(n, level, expr(`${a} ÷ ${d}`), withRemainder(q, r), remainderWrongs(a, d), explainLong(a, d), longPicture(a, d));
}

/** A question whose answer is a number, with its wrong options given. */
const numberQuestion = (n, level, text, answer, wrongs, explanation, picture = null) =>
  mcq(n, level, text, String(answer), wrongs.map(String), explanation, picture);

/** A lesson object with the shared fields of topic 105. */
function lesson(index, titleEn, titleHe, theoryContentHe, exercises) {
  const byLevel = exercises.reduce((m, e) => ({ ...m, [e.difficulty]: (m[e.difficulty] || 0) + 1 }), {});
  for (const level of ['easy', 'medium', 'hard']) {
    if (byLevel[level] !== 10) throw new Error(`105.${index} ${titleEn}: ${byLevel[level] || 0} ${level} exercises, expected 10`);
  }
  return {
    topicNumber: 105,
    subtopicNumber: `105.${index}`,
    titleEn,
    titleHe,
    level: 'beginner',
    // After the multiplication table (991–993), before fractions (1001–).
    orderIndex: 993 + index,
    theoryContentHe: glueEquations(theoryContentHe),
    exercises: exercises.map((e) =>
      (e.explanationPicture ? { ...e, explanationPicture: glueEquations(e.explanationPicture) } : e))
  };
}

module.exports = {
  ltr, expr, mcq, P, pic, split, withRemainder, remainderWrongs, explainRemainder, groupsPicture,
  remainderQ, explainLong, longPicture, longWrongs, longQ, numberQuestion, firstWrongs, lesson
};
