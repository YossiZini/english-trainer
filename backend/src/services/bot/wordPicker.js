const VocabularyWord = require('../../models/VocabularyWord');
const VocabularyWordScores = require('../../models/VocabularyWordScores');
const { shuffleArray } = require('../../utils/shuffle');

/**
 * The levels the student can choose in the bot, each two word levels
 * (docs/words/relevel), from a real beginner level up in small steps. A
 * session keeps the words it picked, so one started under the old three
 * levels finishes as it began.
 */
const LEVELS = {
  1: { range: [1, 2], he: 'מתחיל' },
  2: { range: [3, 4], he: 'קל' },
  3: { range: [5, 6], he: 'בינוני' },
  4: { range: [7, 8], he: 'מתקדם' },
  5: { range: [9, 10], he: 'קשה' }
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
