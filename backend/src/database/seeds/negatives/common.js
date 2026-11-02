// Shared bits for the negative-numbers chapter (topic 106, shown as chapter
// 7, after percentage): signed numbers with a real minus sign (U+2212),
// expressions with negative terms in parentheses, wrong options from the
// common mistakes, number-line pictures and the lesson builder. Equations
// stay on one line (see multiplication/common.js).
const { ltr, mcq, P, pic, glueEquations } = require('../multiplication/common');

/** An integer as written in the lessons: "−3", "0", "5". */
const S = P.signed;

/** A term after an operator: a negative one in parentheses, "(−3)". */
const term = (v) => (v < 0 ? `(${S(v)})` : S(v));

/** "a ∘ b" with the second number in parentheses when it is negative. */
const op = (a, sym, b) => `${S(a)} ${sym} ${term(b)}`;

/** A signed number inside Hebrew text, kept left to right. */
const num = (v) => ltr(S(v));

/** "a ∘ b = ?" as a question. */
const ask = (e) => ltr(`${e} = ?`);

/**
 * Theory HTML: an equation, a comparison or a signed number that keeps its
 * order. < and > are escaped: a raw "<" would end the span early for
 * glueEquations, and the comparison could break across lines.
 */
const eq = (s) => `<span dir="ltr">${s.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;

/**
 * The first three different integers of `candidates` that are not `answer`,
 * as options ("−3"), most plausible first.
 */
function signedWrongs(answer, candidates) {
  const wrongs = [];
  for (const v of candidates) {
    if (Number.isInteger(v) && v !== answer && !wrongs.includes(v)) wrongs.push(v);
  }
  if (wrongs.length < 3) throw new Error(`Not enough wrong options for ${answer}`);
  return wrongs.slice(0, 3).map(S);
}

/** A question whose answer is an integer. */
const intQ = (n, level, text, answer, candidates, explanation, picture = null) =>
  mcq(n, level, text, S(answer), signedWrongs(answer, candidates), explanation, picture);

/** A question with its own options (words, comparisons, orders). */
const choiceQ = (n, level, text, answer, wrongs, explanation, picture = null) =>
  mcq(n, level, text, answer, wrongs, explanation, picture);

/** A number line picture under an explanation or a rule. */
const linePic = (opts, caption) => pic(P.integerLine(opts), caption);

const HEBREW = /[֐-׿]/;

/** A lesson object with the shared fields of topic 106. */
function lesson(index, titleEn, titleHe, theoryContentHe, exercises) {
  const byLevel = exercises.reduce((m, e) => ({ ...m, [e.difficulty]: (m[e.difficulty] || 0) + 1 }), {});
  for (const level of ['easy', 'medium', 'hard']) {
    if (byLevel[level] !== 10) throw new Error(`106.${index} ${titleEn}: ${byLevel[level] || 0} ${level} exercises, expected 10`);
  }
  for (const e of exercises) {
    // An option is shown left to right: Hebrew words with numbers in it
    // would read scrambled ("−2 גדול מ-−8" the wrong way round).
    for (const o of e.options || []) {
      if (HEBREW.test(o) && /\d/.test(o)) throw new Error(`106.${index} q${e.questionNumber}: option mixes Hebrew and numbers: ${o}`);
    }
  }
  return {
    topicNumber: 106,
    subtopicNumber: `106.${index}`,
    titleEn,
    titleHe,
    level: 'beginner',
    // After percentage (1041); chapters 7–9 are 1061…, 1071…, 1081….
    orderIndex: 1060 + index,
    theoryContentHe: glueEquations(theoryContentHe),
    exercises: exercises.map((e) =>
      (e.explanationPicture ? { ...e, explanationPicture: glueEquations(e.explanationPicture) } : e))
  };
}

module.exports = { ltr, P, pic, S, term, op, num, ask, eq, signedWrongs, intQ, choiceQ, linePic, lesson };
