const VocabularyWord = require('../../models/VocabularyWord');
const VocabularyWordScores = require('../../models/VocabularyWordScores');
const { shuffleArray } = require('../../utils/shuffle');

/** Difficulty ranges the student can choose in the bot (1 easy .. 3 hard). */
const LEVELS = {
  1: { range: [1, 5], he: 'קל' },
  2: { range: [6, 7], he: 'בינוני' },
  3: { range: [8, 10], he: 'קשה' }
};

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

/** Words for a student's session at the chosen level, from all words. */
async function pickWordsForUser(user, n, { level = 1 } = {}) {
  const [min, max] = (LEVELS[level] || LEVELS[1]).range;
  const candidates = await VocabularyWord.findByDifficultyRange(min, max, [], Infinity);
  const scores = await VocabularyWordScores.getAllWordScores(user.id);
  const masteredIds = scores.filter(s => s.mastery_level === 'mastered').map(s => s.word_id);
  return pickWords(candidates, masteredIds, n);
}

module.exports = { LEVELS, pickWords, pickWordsForUser };
