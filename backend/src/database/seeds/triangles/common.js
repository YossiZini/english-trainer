// Shared bits for the triangles chapter (topic 108, shown as chapter 9):
// angles in degrees, lengths in ס״מ (with the Hebrew gershayim, not a
// quote mark), wrong options from the common mistakes, triangle pictures and
// the lesson builder.
const { ltr, mcq, P, glueEquations } = require('../multiplication/common');

/** An angle: "70°". */
const deg = (v) => `${v}°`;

/** "∠A = 50°" inside Hebrew text, kept left to right. */
const ang = (name, v) => ltr(`∠${name} = ${deg(v)}`);

/** Theory HTML: an expression that keeps its order (< and > escaped, see negatives/common.js). */
const eq = (s) => `<span dir="ltr">${s.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;

/** A number as an option: "12", "2.5". */
const show = (v) => String(Math.round(v * 100) / 100);

/** The first three different positive values of `candidates` that are not the answer. */
function firstWrongs(answer, candidates, fmt) {
  const out = [];
  for (const v of candidates) {
    if (Number.isFinite(v) && v > 0 && fmt(v) !== fmt(answer) && !out.includes(fmt(v))) out.push(fmt(v));
  }
  if (out.length < 3) throw new Error(`Not enough wrong options for ${answer}`);
  return out.slice(0, 3);
}

/** A question whose answer is a number (a length, an area, a count). */
const numQ = (n, level, text, answer, candidates, explanation, { picture = null, question = null } = {}) =>
  withQuestionPicture(mcq(n, level, text, show(answer), firstWrongs(answer, candidates, show), explanation, picture), question);

/** A question whose answer is an angle in degrees. */
const degQ = (n, level, text, answer, candidates, explanation, { picture = null, question = null } = {}) =>
  withQuestionPicture(mcq(n, level, text, deg(answer), firstWrongs(answer, candidates, deg), explanation, picture), question);

/** A question with its own options (kinds of triangles, yes or no, triples). */
const choiceQ = (n, level, text, answer, wrongs, explanation, { picture = null, question = null } = {}) =>
  withQuestionPicture(mcq(n, level, text, answer, wrongs, explanation, picture), question);

function withQuestionPicture(e, question) {
  return question ? { ...e, questionPicture: question } : e;
}

/**
 * A triangle under an explanation or a rule: at 0.8 of its size, with the
 * class math-grid so the feedback box does not squeeze it further.
 */
const triPic = (opts, caption) => P.figures(P.figure(P.triangle({ scale: 0.8, ...opts }), caption));

/** A triangle in the theory, at its full size. */
const triFig = (opts, caption) => P.figure(P.triangle(opts), caption);

const BY_SIDES = ['שווה צלעות', 'שווה שוקיים', 'שונה צלעות'];
const BY_ANGLES = ['חד-זווית', 'ישר-זווית', 'קהה-זווית'];

// An option is shown left to right: Hebrew with numbers or Latin letters in
// it would read scrambled.
const HEBREW = /[֐-׿]/;
const MIXED = /[0-9A-Za-z]/;

/** A lesson object with the shared fields of topic 108. */
function lesson(index, titleEn, titleHe, theoryContentHe, exercises) {
  const byLevel = exercises.reduce((m, e) => ({ ...m, [e.difficulty]: (m[e.difficulty] || 0) + 1 }), {});
  for (const level of ['easy', 'medium', 'hard']) {
    if (byLevel[level] !== 10) throw new Error(`108.${index} ${titleEn}: ${byLevel[level] || 0} ${level} exercises, expected 10`);
  }
  for (const e of exercises) {
    for (const o of e.options || []) {
      if (HEBREW.test(o) && MIXED.test(o)) throw new Error(`108.${index} q${e.questionNumber}: option mixes Hebrew with numbers or letters: ${o}`);
    }
    if (/"/.test(e.questionTextHe + e.explanationHe)) throw new Error(`108.${index} q${e.questionNumber}: a quote mark (write ס״מ with ״)`);
  }
  return {
    topicNumber: 108,
    subtopicNumber: `108.${index}`,
    titleEn,
    titleHe,
    level: 'beginner',
    // After the axes (1071…).
    orderIndex: 1080 + index,
    theoryContentHe: glueEquations(theoryContentHe),
    exercises: exercises.map((e) =>
      (e.explanationPicture ? { ...e, explanationPicture: glueEquations(e.explanationPicture) } : e))
  };
}

module.exports = { ltr, P, deg, ang, eq, show, numQ, degQ, choiceQ, triPic, triFig, BY_SIDES, BY_ANGLES, lesson };
