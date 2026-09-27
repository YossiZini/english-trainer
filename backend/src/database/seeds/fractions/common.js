// Shared bits for the six Fractions subtopic seeds.
const { ltr, expr, mc, fib } = require('../math-helpers');
const P = require('../math-svg');
const R = require('./rat');
const pictures = require('./pictures');

const FRACTION_HINT = 'כתבו שבר, למשל 3/4 (אפשר גם מספר עשרוני כמו 0.75)';
const MIXED_HINT = 'כתבו מספר מעורב כמו 2 1/3 (או שבר מדומה כמו 7/3)';
const INT_HINT = 'כתבו מספר שלם';

/**
 * Multiple-choice with the correct answer placed at a position that varies
 * with the question number, so it is not always first.
 * `answer` and `wrongs` are strings as the student should read them.
 */
function mcq(n, difficulty, questionTextHe, answer, wrongs, explanationHe, picture = null) {
  const options = [...wrongs];
  options.splice(n % (wrongs.length + 1), 0, answer);
  if (new Set(options).size !== options.length) {
    throw new Error(`Question ${n}: duplicate options ${options.join(', ')}`);
  }
  return mc(n, difficulty, questionTextHe, options, answer, explanationHe, picture);
}

/** Fill-in whose answer is a rational computed by rat.js. */
function fibR(n, difficulty, questionTextHe, rational, explanationHe, hint = FRACTION_HINT, picture = null) {
  return fib(n, difficulty, questionTextHe, R.str(rational), explanationHe, hint, picture);
}

// A bare computation question ("a ∘ b = ?") gets its picture from the
// expression unless one was given explicitly.
// Other common question shapes get a picture from their pattern:
// reduce, fraction of a quantity, compare two fractions, mixed <-> improper.
const ISO = '\u2066([^\u2069]+)\u2069';
function autoPicture(e) {
  const q = e.questionTextHe;
  let m = q.match(new RegExp(`^${ISO} = \\?$`)) || q.match(/^\u2066(.*) = \?\u2069$/);
  if (m) return pictures.pictureFor(m[1]);
  m = q.match(new RegExp(`^צמצמו: ${ISO}$`));
  if (m) return pictures.equivalent(m[1], e.correctAnswer);
  m = q.match(new RegExp(`^(?:כמה זה )?${ISO} מ-(\\d+)\\??$`));
  if (m) return pictures.ofQuantity(m[1], Number(m[2]));
  m = q.match(new RegExp(`(?:גדול|קטן) יותר: ${ISO} או ${ISO}`)) || q.match(new RegExp(`^${ISO} לעומת ${ISO}`));
  if (m) return pictures.compare(m[1], m[2]);
  m = q.match(new RegExp(`${ISO} (?:כשבר מדומה|כמספר מעורב)`)) || q.match(new RegExp(`כתבו את ${ISO} (?:כשבר מדומה|כמספר מעורב)`));
  if (m) return pictures.mixed(m[1]);
  // "a shape cut into N equal parts, K of them shaded / eaten"
  m = q.match(/(עיגול|פס|ריבוע|עוגה|פיצה)[^.]*?ל-(\d+) (?:חלקים|משולשים) שווים[^.]*?(?:\.| ו-?)\s*(?:אכלו |צבעו )?(\d+) (?:מהם|חלקים)/);
  if (m) {
    const shape = m[1] === 'פס' ? P.bar(Number(m[3]), Number(m[2]), { width: 200, height: 30 }) : P.circle(Number(m[3]), Number(m[2]), { size: 72 });
    return P.figure(shape, `${m[3]} מתוך ${m[2]}`);
  }
  // Two eaten parts of one whole: the sum, or what is left
  m = q.match(new RegExp(`אכל ${ISO}[^.]*אכלה ${ISO}`));
  if (m) return q.includes('נשאר') ? pictures.addSub(1, R.add(m[1], m[2]), '−') : pictures.addSub(m[1], m[2], '+');
  // A single fraction named in the question: show it
  m = q.match(new RegExp(`^(?:בשבר )?${ISO}(?:,| שווה ל| לעומת)`));
  if (m && /^\d+\/\d+$/.test(m[1])) { const [n, d] = m[1].split('/').map(Number); if (d <= 12 && n <= d) return P.figure(P.bar(n, d, { width: 200, height: 30 }), `<span dir="ltr">${m[1]}</span>`); }
  return null;
}

function withPictures(exercises) {
  return exercises.map((e) => (e.explanationPicture ? e : { ...e, explanationPicture: autoPicture(e) }));
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
    exercises: withPictures(exercises)
  };
}

module.exports = { ltr, expr, mc, fib, mcq, fibR, lesson, P, R, pictures, FRACTION_HINT, MIXED_HINT, INT_HINT };
