// Shared bits for the triangles chapter (topic 108, shown as chapter 9):
// angles in degrees, lengths in ס״מ (with the Hebrew gershayim, not a
// quote mark), wrong options from the common mistakes, triangle pictures and
// the lesson builder.
const { ltr, P, eq, mathLesson, optionsQuestion } = require('../multiplication/common');

/** An angle: "70°". */
const deg = (v) => `${v}°`;

/** "∠A = 50°" inside Hebrew text, kept left to right. */
const ang = (name, v) => ltr(`∠${name} = ${deg(v)}`);

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
const numQ = (n, level, text, answer, candidates, explanation, opts) =>
  optionsQuestion(n, level, text, show(answer), firstWrongs(answer, candidates, show), explanation, opts);

/** A question whose answer is an angle in degrees. */
const degQ = (n, level, text, answer, candidates, explanation, opts) =>
  optionsQuestion(n, level, text, deg(answer), firstWrongs(answer, candidates, deg), explanation, opts);

/** A question with its own options (kinds of triangles, yes or no, triples). */
const choiceQ = (n, level, text, answer, wrongs, explanation, opts) =>
  optionsQuestion(n, level, text, answer, wrongs, explanation, opts);

/**
 * A triangle under an explanation or a rule: at 0.8 of its size, with the
 * class math-grid so the feedback box does not squeeze it further.
 */
const triPic = (opts, caption) => P.figures(P.figure(P.triangle({ scale: 0.8, ...opts }), caption));

/** A triangle in the theory, at its full size. */
const triFig = (opts, caption) => P.figure(P.triangle(opts), caption);

const BY_SIDES = ['שווה צלעות', 'שווה שוקיים', 'שונה צלעות'];
const BY_ANGLES = ['חד-זווית', 'ישר-זווית', 'קהה-זווית'];

/** A lesson object with the shared fields of topic 108: after the axes (1071…). */
const lesson = (...args) => mathLesson({ topic: 108, order: 1080, options: 'letters', noQuote: true }, ...args);

module.exports = { ltr, P, deg, ang, eq, show, numQ, degQ, choiceQ, triPic, triFig, BY_SIDES, BY_ANGLES, lesson };
