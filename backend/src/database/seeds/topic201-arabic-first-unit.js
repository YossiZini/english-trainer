// Topic 201: Arabic, first unit — letters, alif and hamza, vowels, first
// words (the material of the 11.10 test, book pages 13–25). Reading and
// recognition only. Plain module read by backend/src/data/generateJsonData.js.
const lessonsData = [
  require('./arabic/201-1-letters'),
  require('./arabic/201-2-alif-hamza'),
  require('./arabic/201-3-vowels'),
  require('./arabic/201-4-words'),
  require('./arabic/201-5-review')
];

module.exports = { lessonsData };
