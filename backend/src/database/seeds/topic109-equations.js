// Topic 109: equations with one unknown (משוואה עם נעלם אחד) — Math, shown as
// chapter 10, after the triangles (MATH_CHAPTER_ORDER in src/config/subjects.js):
// what an unknown is, then solving by keeping a balance level. Each subtopic
// lives in ./equations/ (theory with balance pictures + 30 exercises);
// expressions, the solver, wrong options and pictures come from
// ./equations/common.js.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./equations/109-1-the-unknown'),
  require('./equations/109-2-add-subtract'),
  require('./equations/109-3-multiply-divide'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
