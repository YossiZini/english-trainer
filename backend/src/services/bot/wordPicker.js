const VocabularyWord = require('../../models/VocabularyWord');
const VocabularyWordScores = require('../../models/VocabularyWordScores');
const { shuffleArray } = require('../../utils/shuffle');

/** Difficulty range per student level (same stages as the web quiz). */
const LEVEL_RANGES = {
  beginner: [1, 3],
  intermediate: [3, 5],
  advanced: [5, 10]
};

function rangeForLevel(level) {
  return LEVEL_RANGES[level] || LEVEL_RANGES.beginner;
}

/**
 * Choose `n` distinct words: the ones not yet mastered first, then mastered
 * ones when there are not enough. Pure, for tests.
 */
function pickWords(candidates, masteredIds, n) {
  const mastered = new Set(masteredIds);
  const fresh = shuffleArray(candidates.filter(w => !mastered.has(w.id)));
  const known = shuffleArray(candidates.filter(w => mastered.has(w.id)));
  return [...fresh, ...known].slice(0, n);
}

/** Words for a student's session, by level. */
async function pickWordsForUser(user, n) {
  const [min, max] = rangeForLevel(user.current_level);
  const candidates = await VocabularyWord.findByDifficultyRange(min, max, [], Infinity);
  const scores = await VocabularyWordScores.getAllWordScores(user.id);
  const masteredIds = scores.filter(s => s.mastery_level === 'mastered').map(s => s.word_id);
  return pickWords(candidates, masteredIds, n);
}

module.exports = { LEVEL_RANGES, rangeForLevel, pickWords, pickWordsForUser };
