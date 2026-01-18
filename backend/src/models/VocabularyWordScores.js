const { pool } = require('../config/database');

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

    // Upsert the record
    const query = `
      INSERT INTO vocabulary_word_scores
        (user_id, word_id, success_count, fail_count, attempt_history, mastery_level, last_attempt_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5::jsonb, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, word_id)
      DO UPDATE SET
        success_count = $3,
        fail_count = $4,
        attempt_history = $5::jsonb,
        mastery_level = $6,
        last_attempt_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      wordId,
      successCount,
      failCount,
      JSON.stringify(attemptHistory),
      masteryLevel
    ]);

    return result.rows[0];
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
    const query = `
      SELECT * FROM vocabulary_word_scores
      WHERE user_id = $1 AND word_id = $2
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0] || null;
  }

  /**
   * Get all word scores for a user
   * @param {string} userId - User ID
   * @returns {Array} All word scores with word details
   */
  static async getAllWordScores(userId) {
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1
      ORDER BY vws.last_attempt_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get words by mastery level
   * @param {string} userId - User ID
   * @param {string} masteryLevel - Mastery level to filter by
   * @returns {Array} Words at the specified mastery level
   */
  static async getWordsByMastery(userId, masteryLevel) {
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vw.source
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1 AND vws.mastery_level = $2
      ORDER BY vws.last_attempt_at DESC
    `;

    const result = await pool.query(query, [userId, masteryLevel]);
    return result.rows;
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
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vw.source
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1
        AND vws.mastery_level = 'struggling'
      ORDER BY vws.last_attempt_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get all word IDs that user has attempted
   * @param {string} userId - User ID
   * @returns {Array} Array of word IDs
   */
  static async getAllAttemptedWordIds(userId) {
    const query = `
      SELECT word_id
      FROM vocabulary_word_scores
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.word_id);
  }

  /**
   * Get statistics summary for a user
   * @param {string} userId - User ID
   * @returns {object} Statistics summary
   */
  static async getStatsSummary(userId) {
    const query = `
      SELECT
        COUNT(*) as total_words_attempted,
        COUNT(*) FILTER (WHERE success_count > 0) as words_with_success,
        COUNT(*) FILTER (WHERE fail_count > 0) as words_with_failure,
        COUNT(*) FILTER (WHERE mastery_level = 'mastered') as mastered_count,
        COUNT(*) FILTER (WHERE mastery_level = 'learning') as learning_count,
        COUNT(*) FILTER (WHERE mastery_level = 'struggling') as struggling_count,
        COUNT(*) FILTER (WHERE mastery_level = 'not_started') as not_started_count,
        AVG(success_count) as avg_success_per_word,
        AVG(fail_count) as avg_fails_per_word
      FROM vocabulary_word_scores
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const stats = result.rows[0];

    return {
      totalWordsAttempted: parseInt(stats.total_words_attempted),
      wordsWithSuccess: parseInt(stats.words_with_success),
      wordsWithFailure: parseInt(stats.words_with_failure),
      byMastery: {
        mastered: parseInt(stats.mastered_count),
        learning: parseInt(stats.learning_count),
        struggling: parseInt(stats.struggling_count),
        not_started: parseInt(stats.not_started_count)
      },
      avgSuccessPerWord: parseFloat(stats.avg_success_per_word || 0).toFixed(2),
      avgFailsPerWord: parseFloat(stats.avg_fails_per_word || 0).toFixed(2)
    };
  }

  /**
   * Get top struggling words (most failed recently)
   * @param {string} userId - User ID
   * @param {number} limit - Number of words to return
   * @returns {Array} Top struggling words
   */
  static async getTopStrugglingWords(userId, limit = 10) {
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1 AND vws.mastery_level = 'struggling'
      ORDER BY vws.fail_count DESC, vws.last_attempt_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get recently mastered words
   * @param {string} userId - User ID
   * @param {number} limit - Number of words to return
   * @returns {Array} Recently mastered words
   */
  static async getRecentlyMastered(userId, limit = 5) {
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1 AND vws.mastery_level = 'mastered'
      ORDER BY vws.last_attempt_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get attempt history for a specific word
   * @param {string} userId - User ID
   * @param {string} wordId - Word ID
   * @returns {object|null} Word score with full history
   */
  static async getWordHistory(userId, wordId) {
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vw.source
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1 AND vws.word_id = $2
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0] || null;
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
    const query = `
      SELECT
        vws.*,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vw.source
      FROM vocabulary_word_scores vws
      JOIN vocabulary_words vw ON vws.word_id = vw.id
      WHERE vws.user_id = $1
        AND vws.fail_count >= $2
      ORDER BY vws.fail_count DESC, vws.last_attempt_at DESC
      ${limit ? 'LIMIT $3' : ''}
    `;

    const params = [userId, minFailures];
    if (limit) {
      params.push(limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = VocabularyWordScores;
