// Topic 100: the multiplication table (לוח הכפל) — Math, shown first, before
// Fractions, in three subtopics: multiplication up to 10 × 10, division as its
// inverse, and a review with word problems.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
// Each subtopic lives in ./multiplication/ (theory with pictures + 30 exercises);
// answers and wrong options are computed in ./multiplication/common.js.
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./multiplication/100-1-multiplication'),
  require('./multiplication/100-2-division'),
  require('./multiplication/100-3-review'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
