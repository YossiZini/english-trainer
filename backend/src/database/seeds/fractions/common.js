// Shared bits for the six Fractions subtopic seeds.
const { ltr, expr, mc, fib } = require('../math-helpers');
const P = require('../math-svg');
const R = require('./rat');

const FRACTION_HINT = 'כתבו שבר, למשל 3/4 (אפשר גם מספר עשרוני כמו 0.75)';
const MIXED_HINT = 'כתבו מספר מעורב כמו 2 1/3 (או שבר מדומה כמו 7/3)';
const INT_HINT = 'כתבו מספר שלם';

/**
 * Multiple-choice with the correct answer placed at a position that varies
 * with the question number, so it is not always first.
 * `answer` and `wrongs` are strings as the student should read them.
 */
function mcq(n, difficulty, questionTextHe, answer, wrongs, explanationHe) {
  const options = [...wrongs];
  options.splice(n % (wrongs.length + 1), 0, answer);
  if (new Set(options).size !== options.length) {
    throw new Error(`Question ${n}: duplicate options ${options.join(', ')}`);
  }
  return mc(n, difficulty, questionTextHe, options, answer, explanationHe);
}

/** Fill-in whose answer is a rational computed by rat.js. */
function fibR(n, difficulty, questionTextHe, rational, explanationHe, hint = FRACTION_HINT) {
  return fib(n, difficulty, questionTextHe, R.str(rational), explanationHe, hint);
}

/** A lesson object with the shared fields of topic 101. */
function lesson(index, titleEn, titleHe, theoryContentHe, exercises) {
  const byLevel = exercises.reduce((m, e) => ({ ...m, [e.difficulty]: (m[e.difficulty] || 0) + 1 }), {});
  for (const level of ['easy', 'medium', 'hard']) {
    if (byLevel[level] !== 10) throw new Error(`101.${index} ${titleEn}: ${byLevel[level] || 0} ${level} exercises, expected 10`);
  }
  return {
    topicNumber: 101,
    subtopicNumber: `101.${index}`,
    titleEn,
    titleHe,
    level: 'intermediate',
    orderIndex: 1000 + index,
    theoryContentHe,
    exercises
  };
}

module.exports = { ltr, expr, mc, fib, mcq, fibR, lesson, P, R, FRACTION_HINT, MIXED_HINT, INT_HINT };
