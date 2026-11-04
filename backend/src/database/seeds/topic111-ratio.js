// Topic 111: ratio and proportion (יחס ופרופורציה) — Math, shown as chapter
// 12, after the equations (MATH_CHAPTER_ORDER in src/config/subjects.js):
// what a ratio is, dividing in a ratio, proportion and a missing term. Each
// subtopic lives in ./ratio/ (theory with bar models and ratio tables + 30
// exercises); ratios, shares, missing terms, wrong options and the lesson
// builder come from ./ratio/common.js.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./ratio/111-1-what-is-a-ratio'),
  require('./ratio/111-2-dividing'),
  require('./ratio/111-3-proportion'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
