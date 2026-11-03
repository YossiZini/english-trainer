// Topic 110: decimals (שברים עשרוניים) — Math, shown as chapter 4, right
// after Fractions (MATH_CHAPTER_ORDER in src/config/subjects.js): tenths and
// hundredths, comparing and rounding, adding and subtracting, multiplying and
// dividing. Each subtopic lives in ./decimals/ (theory with pictures + 30
// exercises); exact arithmetic, wrong options and the lesson builder come
// from ./decimals/common.js.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./decimals/110-1-tenths-hundredths'),
  require('./decimals/110-2-comparing-rounding'),
  require('./decimals/110-3-add-subtract'),
  require('./decimals/110-4-multiply-divide'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
