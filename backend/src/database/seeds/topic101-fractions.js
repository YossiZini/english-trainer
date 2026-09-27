// Topic 101: Fractions (שברים) — Math, grades 7–8, in six subtopics.
// Plain module: read by backend/src/data/generateJsonData.js (npm run generate-data).
// Each subtopic lives in ./fractions/ (theory with pictures + 30 exercises);
// answers are computed with ./fractions/rat.js, not typed by hand.
const { withStackedFractions } = require('./math-helpers');

const lessonsData = [
  require('./fractions/101-1-what-is-a-fraction'),
  require('./fractions/101-2-equivalent-and-reducing'),
  require('./fractions/101-3-comparing'),
  require('./fractions/101-4-adding-and-subtracting'),
  require('./fractions/101-5-multiplying-and-dividing'),
  require('./fractions/101-6-mixed-numbers'),
];

module.exports = { lessonsData: withStackedFractions(lessonsData) };
