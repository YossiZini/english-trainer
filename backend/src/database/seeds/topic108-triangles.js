// Topic 108: triangles (משולשים) — Math, shown as chapter 9, after the axes
// (MATH_CHAPTER_ORDER in src/config/subjects.js), in three subtopics: kinds
// of triangles, the angle sum (180°), and perimeter and area.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
// Each subtopic lives in ./triangles/ (theory with triangle pictures + 30
// exercises); angles, wrong options and pictures come from ./triangles/common.js.
const { finishMath } = require('./math-helpers');

const lessonsData = [
  require('./triangles/108-1-kinds'),
  require('./triangles/108-2-angle-sum'),
  require('./triangles/108-3-perimeter-area'),
];

module.exports = { lessonsData: finishMath(lessonsData) };
