const { db } = require('../config/database');

/**
 * VocabularyWordScores Model
 * Tracks per-word performance with chronological attempt history and mastery levels
 */
class VocabularyWordScores {
  /**
   * Record an attempt and update word score
   * @param {string} userId - User ID
   * @param {string} wordId - Word ID
   * @param {boolean} isCorrect - Whether the attempt was correct
   * @returns {object} Updated word score record
   */
  static async recordAttempt(userId, wordId, isCorrect) {
    const attemptResult = isCorrect ? 'success' : 'failed';

    // Get existing record if it exists
    const existing = await this.getWordScore(userId, wordId);

    let attemptHistory = [];
    let successCount = 0;
    let failCount = 0;

    if (existing) {
      attemptHistory = existing.attempt_history || [];
      successCount = existing.success_count || 0;
      failCount = existing.fail_count || 0;
    }

    // Add new attempt to history (keep last 50 attempts)
    attemptHistory.push(attemptResult);
    if (attemptHistory.length > 50) {
      attemptHistory = attemptHistory.slice(-50);
    }

    // Update counters
    if (isCorrect) {
      successCount++;
    } else {
      failCount++;
    }

    // Calculate mastery level
    const masteryLevel = this.calculateMasteryLevel(attemptHistory, successCount);
    const timestamp = new Date().toISOString();

    if (existing) {
      // Update existing record
      db.updateById('vocabulary_word_scores', existing.id, {
        success_count: successCount,
        fail_count: failCount,
        attempt_history: attemptHistory,
        mastery_level: masteryLevel,
        last_attempt_at: timestamp,
        updated_at: timestamp
      });

      return db.findById('vocabulary_word_scores', existing.id);
    }

    // Create new record
    const record = db.insert('vocabulary_word_scores', {
      user_id: userId,
      word_id: wordId,
      success_count: successCount,
      fail_count: failCount,
      attempt_history: attemptHistory,
      mastery_level: masteryLevel,
      last_attempt_at: timestamp,
      updated_at: timestamp,
      created_at: timestamp
    });

    return record;
  }

  /**
   * Calculate mastery level based on attempt history
   * @param {Array} attemptHistory - Array of 'success' or 'failed'
   * @param {number} successCount - Total success count
   * @returns {string} Mastery level: not_started, learning, struggling, mastered
   */
  static calculateMasteryLevel(attemptHistory, successCount) {
    if (!attemptHistory || attemptHistory.length === 0) {
      return 'not_started';
    }

    const last3 = attemptHistory.slice(-3);
    const last2 = attemptHistory.slice(-2);

    // Mastered: Last 3 attempts all success AND at least 3 total successes
    if (last3.length === 3 && last3.every(a => a === 'success') && successCount >= 3) {
      return 'mastered';
    }

    // Struggling: Last 2+ attempts are failures
    if (last2.length >= 2 && last2.every(a => a === 'failed')) {
      return 'struggling';
    }

    // Learning: Has attempts but not mastered or struggling
    if (successCount < 3) {
      return 'learning';
    }

    return 'learning';
  }

  /**
   * Get word score for a specific word and user
   * @param {string} userId - User ID
   * @param {string} wordId - Word ID
   * @returns {object|null} Word score record
   */
  static async getWordScore(userId, wordId) {
    const record = db.findOne('vocabulary_word_scores', {
      user_id: userId,
      word_id: wordId
    });

    return record || null;
  }

  /**
   * Get all word scores for a user
   * @param {string} userId - User ID
   * @returns {Array} All word scores with word details
   */
  static async getAllWordScores(userId) {
    const scores = db.find('vocabulary_word_scores', { user_id: userId });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = scores.map(s => {
      const word = wordMap.get(s.word_id);
      return {
        ...s,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level
      };
    });

    // Sort by last_attempt_at descending
    result.sort((a, b) => new Date(b.last_attempt_at) - new Date(a.last_attempt_at));

    return result;
  }

  /**
   * Get words by mastery level
   * @param {string} userId - User ID
   * @param {string} masteryLevel - Mastery level to filter by
   * @returns {Array} Words at the specified mastery level
   */
  static async getWordsByMastery(userId, masteryLevel) {
    const scores = db.find('vocabulary_word_scores', {
      user_id: userId,
      mastery_level: masteryLevel
    });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = scores.map(s => {
      const word = wordMap.get(s.word_id);
      return {
        ...s,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        source: word?.source
      };
    });

    // Sort by last_attempt_at descending
    result.sort((a, b) => new Date(b.last_attempt_at) - new Date(a.last_attempt_at));

    return result;
  }

  /**
   * Get recently failed words (mastery level = 'struggling')
   * These are words where last 2+ attempts were failures
   * @param {string} userId - User ID
   * @returns {Array} Struggling words
   */
  static async getRecentlyFailedWords(userId) {
    return this.getWordsByMastery(userId, 'struggling');
  }

  /**
   * Get prioritized failed words for smart quiz building
   * Prioritizes words with recent failures (struggling) first
   * @param {string} userId - User ID
   * @param {number} limit - Maximum number of words to return
   * @returns {Array} Failed words sorted by priority
   */
  static async getPrioritizedFailedWords(userId, limit) {
    const scores = db.find('vocabulary_word_scores', {
      user_id: userId,
      mastery_level: 'struggling'
    });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = scores.map(s => {
      const word = wordMap.get(s.word_id);
      return {
        ...s,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        source: word?.source
      };
    });

    // Sort by last_attempt_at descending
    result.sort((a, b) => new Date(b.last_attempt_at) - new Date(a.last_attempt_at));

    return result.slice(0, limit);
  }

  /**
   * Get all word IDs that user has attempted
   * @param {string} userId - User ID
   * @returns {Array} Array of word IDs
   */
  static async getAllAttemptedWordIds(userId) {
    const scores = db.find('vocabulary_word_scores', { user_id: userId });
    return scores.map(s => s.word_id);
  }

  /**
   * Get statistics summary for a user
   * @param {string} userId - User ID
   * @returns {object} Statistics summary
   */
  static async getStatsSummary(userId) {
    const scores = db.find('vocabulary_word_scores', { user_id: userId });

    const stats = {
      totalWordsAttempted: 0,
      wordsWithSuccess: 0,
      wordsWithFailure: 0,
      byMastery: {
        mastered: 0,
        learning: 0,
        struggling: 0,
        not_started: 0
      },
      avgSuccessPerWord: '0.00',
      avgFailsPerWord: '0.00'
    };

    if (scores.length === 0) {
      return stats;
    }

    let totalSuccess = 0;
    let totalFails = 0;

    for (const s of scores) {
      stats.totalWordsAttempted++;

      if (s.success_count > 0) {
        stats.wordsWithSuccess++;
        totalSuccess += s.success_count;
      }
      if (s.fail_count > 0) {
        stats.wordsWithFailure++;
        totalFails += s.fail_count;
      }

      const level = s.mastery_level || 'not_started';
      if (stats.byMastery.hasOwnProperty(level)) {
        stats.byMastery[level]++;
      }
    }

    stats.avgSuccessPerWord = (totalSuccess / scores.length).toFixed(2);
    stats.avgFailsPerWord = (totalFails / scores.length).toFixed(2);

    return stats;
  }

  /**
   * Get top struggling words (most failed recently)
   * @param {string} userId - User ID
   * @param {number} limit - Number of words to return
   * @returns {Array} Top struggling words
   */
  static async getTopStrugglingWords(userId, limit = 10) {
    const scores = db.find('vocabulary_word_scores', {
      user_id: userId,
      mastery_level: 'struggling'
    });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = scores.map(s => {
      const word = wordMap.get(s.word_id);
      return {
        ...s,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level
      };
    });

    // Sort by fail_count descending, then by last_attempt_at descending
    result.sort((a, b) => {
      if (b.fail_count !== a.fail_count) {
        return b.fail_count - a.fail_count;
      }
      return new Date(b.last_attempt_at) - new Date(a.last_attempt_at);
    });

    return result.slice(0, limit);
  }

  /**
   * Get recently mastered words
   * @param {string} userId - User ID
   * @param {number} limit - Number of words to return
   * @returns {Array} Recently mastered words
   */
  static async getRecentlyMastered(userId, limit = 5) {
    const scores = db.find('vocabulary_word_scores', {
      user_id: userId,
      mastery_level: 'mastered'
    });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = scores.map(s => {
      const word = wordMap.get(s.word_id);
      return {
        ...s,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level
      };
    });

    // Sort by last_attempt_at descending
    result.sort((a, b) => new Date(b.last_attempt_at) - new Date(a.last_attempt_at));

    return result.slice(0, limit);
  }

  /**
   * Get attempt history for a specific word
   * @param {string} userId - User ID
   * @param {string} wordId - Word ID
   * @returns {object|null} Word score with full history
   */
  static async getWordHistory(userId, wordId) {
    const score = db.findOne('vocabulary_word_scores', {
      user_id: userId,
      word_id: wordId
    });

    if (!score) return null;

    // Get vocabulary word for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));
    const word = wordMap.get(wordId);

    return {
      ...score,
      english_word: word?.english_word,
      hebrew_translation: word?.hebrew_translation,
      difficulty_level: word?.difficulty_level,
      source: word?.source
    };
  }

  /**
   * Get words with past errors (any word with at least N failures in history)
   * This includes words that may now be mastered but had failures along the way
   * @param {string} userId - User ID
   * @param {number} minFailures - Minimum number of failures (default 1)
   * @param {number} limit - Maximum number of words to return
   * @returns {Array} Words with past errors
   */
  static async getWordsWithPastErrors(userId, minFailures = 1, limit = null) {
    const scores = db.find('vocabulary_word_scores', { user_id: userId });

    // Filter by minimum failures
    const filtered = scores.filter(s => (s.fail_count || 0) >= minFailures);

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = filtered.map(s => {
      const word = wordMap.get(s.word_id);
      return {
        ...s,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        source: word?.source
      };
    });

    // Sort by fail_count descending, then by last_attempt_at descending
    result.sort((a, b) => {
      if (b.fail_count !== a.fail_count) {
        return b.fail_count - a.fail_count;
      }
      return new Date(b.last_attempt_at) - new Date(a.last_attempt_at);
    });

    if (limit) {
      return result.slice(0, limit);
    }

    return result;
  }
}

module.exports = VocabularyWordScores;
