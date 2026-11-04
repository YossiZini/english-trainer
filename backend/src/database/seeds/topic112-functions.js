// Topic 112: linear functions (פונקציה קווית) — Math, shown as chapter 13,
// last (MATH_CHAPTER_ORDER in src/config/subjects.js): from a rule to a table
// and a line, slope and the y-intercept, crossing the axes and stories. Each
// subtopic lives in ./functions/ (theory with grids and tables of values + 30
// exercises); rules, points, wrong options, pictures and the lesson builder
// come from ./functions/common.js.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./functions/112-1-rule-to-line'),
  require('./functions/112-2-slope'),
  require('./functions/112-3-axes-and-stories'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
