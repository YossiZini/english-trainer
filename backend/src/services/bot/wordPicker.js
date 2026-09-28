const VocabularyWord = require('../../models/VocabularyWord');
const VocabularyWordScores = require('../../models/VocabularyWordScores');
const { shuffleArray } = require('../../utils/shuffle');

/** Difficulty ranges the student can choose in the bot (1 easy .. 3 hard). */
const LEVELS = {
  1: { range: [1, 5], he: 'קל' },
  2: { range: [6, 7], he: 'בינוני' },
  3: { range: [8, 10], he: 'קשה' }
};

/** Word sets the student can choose: the school vocabulary bands. */
const WORD_SETS = {
  1: { he: 'כל המילים', match: () => true },
  2: { he: 'Band II', match: (source) => /band22/.test(source || '') },
  3: { he: 'Band III', match: (source) => /band33|lexisband3/.test(source || '') }
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

/** Words for a student's session by chosen level and word set. */
async function pickWordsForUser(user, n, { level = 1, wordSet = 1 } = {}) {
  const [min, max] = (LEVELS[level] || LEVELS[1]).range;
  const inSet = (WORD_SETS[wordSet] || WORD_SETS[1]).match;
  const candidates = (await VocabularyWord.findByDifficultyRange(min, max, [], Infinity)).filter(w => inSet(w.source));
  const scores = await VocabularyWordScores.getAllWordScores(user.id);
  const masteredIds = scores.filter(s => s.mastery_level === 'mastered').map(s => s.word_id);
  return pickWords(candidates, masteredIds, n);
}

module.exports = { LEVELS, WORD_SETS, pickWords, pickWordsForUser };
