// Topic 107: the x and y axes (מערכת צירים) — Math, shown as chapter 8,
// after negative numbers (MATH_CHAPTER_ORDER in src/config/subjects.js), in
// two subtopics: the axes and a point (x, y), and plotting points.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
// Each subtopic lives in ./axes/ (theory with grid pictures + 30 exercises);
// points, wrong options, quarters and grids come from ./axes/common.js. A
// question that needs its grid carries it as questionPicture.
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./axes/107-1-axes-and-point'),
  require('./axes/107-2-plotting'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
