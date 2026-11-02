// Topic 106: negative numbers (מספרים שליליים) — Math, shown as chapter 7,
// after percentage (MATH_CHAPTER_ORDER in src/config/subjects.js), in three
// subtopics: negative numbers on the number line, adding and subtracting,
// and multiplying and dividing (the sign rules).
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
// Each subtopic lives in ./negatives/ (theory with pictures + 30 exercises);
// signed numbers, wrong options and number-line pictures come from
// ./negatives/common.js.
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./negatives/106-1-number-line'),
  require('./negatives/106-2-add-subtract'),
  require('./negatives/106-3-multiply-divide'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
