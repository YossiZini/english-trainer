// Topic 105: division (חילוק) — Math, shown second, right after the
// multiplication table (MATH_CHAPTER_ORDER in src/config/subjects.js), in four
// subtopics: division with a remainder, the remainder in word problems, and
// long division of two-digit and three-digit numbers by one digit.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
// Each subtopic lives in ./division/ (theory with pictures + 30 exercises);
// answers and wrong options are computed in ./division/common.js.
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./division/105-1-remainder'),
  require('./division/105-2-word-problems'),
  require('./division/105-3-long-division-two-digits'),
  require('./division/105-4-long-division-three-digits'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
