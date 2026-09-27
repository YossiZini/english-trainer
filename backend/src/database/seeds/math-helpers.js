// Helpers shared by the Math seed files (topic101…). The seeds are plain
// modules read by backend/src/data/generateJsonData.js; they never touch a
// database.

// Isolate a math expression inside Hebrew text so digits, operators and
// fractions keep their left-to-right order (U+2066 LRI … U+2069 PDI).
const ltr = (s) => `⁦${s}⁩`;

// A bare computation question: the expression followed by "= ?", kept LTR.
const expr = (e) => ltr(`${e} = ?`);

// Multiple-choice exercise. The correct answer must be one of the options.
function mc(questionNumber, difficulty, questionTextHe, options, correctAnswer, explanationHe) {
  if (!options.includes(correctAnswer)) {
    throw new Error(`Question ${questionNumber}: correct answer "${correctAnswer}" is not an option`);
  }
  return { questionNumber, type: 'multiple_choice', questionTextHe, options, correctAnswer, explanationHe, difficulty };
}

// Fill-in-the-blank exercise; hintHe tells the student the expected format.
function fib(questionNumber, difficulty, questionTextHe, correctAnswer, explanationHe, hintHe) {
  return { questionNumber, type: 'fill_in_blank', questionTextHe, correctAnswer, explanationHe, hintHe, difficulty };
}

// Textbook notation for theory HTML: every a/b or mixed "1 a/b" in the text
// becomes a stacked fraction (numerator over denominator). Same pattern as
// the frontend's MathText, which does this for plain-text question fields.
const FRACTION = /(?<![\d.,/])(?:(\d+) )?(\d+)\/(\d+)(?![\d.,/])/g;
const fracHtml = (whole, num, den) =>
  `<span class="frac">${whole ? `<span class="frac-whole">${whole}</span>` : ''}` +
  `<span class="frac-stack"><span class="frac-num">${num}</span><span class="frac-den">${den}</span></span></span>`;
const stackFractions = (html) => html.replace(FRACTION, (m, whole, num, den) => fracHtml(whole, num, den));

// Apply the notation to every lesson's theory of a seed file.
const withStackedFractions = (lessons) =>
  lessons.map((l) => ({ ...l, theoryContentHe: stackFractions(l.theoryContentHe) }));

module.exports = { ltr, expr, mc, fib, stackFractions, withStackedFractions };
