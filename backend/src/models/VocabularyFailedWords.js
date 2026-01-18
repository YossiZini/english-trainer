const { pool } = require('../config/database');

class VocabularyFailedWords {
  /**
   * Add a failed word or increment fail count if it already exists
   */
  static async addOrIncrementFail(userId, wordId) {
    const query = `
      INSERT INTO vocabulary_failed_words (user_id, word_id, fail_count, is_pending_review)
      VALUES ($1, $2, 1, true)
      ON CONFLICT (user_id, word_id)
      DO UPDATE SET
        fail_count = vocabulary_failed_words.fail_count + 1,
        last_failed_at = CURRENT_TIMESTAMP,
        is_pending_review = true
      RETURNING id, user_id, word_id, fail_count, is_pending_review
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0];
  }

  /**
   * Get all pending review words for a user
   */
  static async getPendingReviewWords(userId, limit = null) {
    let query = `
      SELECT
        vfw.id,
        vfw.word_id,
        vfw.fail_count,
        vfw.last_failed_at,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vw.sentence_en,
        vw.sentence_he
      FROM vocabulary_failed_words vfw
      JOIN vocabulary_words vw ON vfw.word_id = vw.id
      WHERE vfw.user_id = $1 AND vfw.is_pending_review = true
      ORDER BY vfw.last_failed_at DESC
    `;

    const values = [userId];

    if (limit !== null) {
      query += ` LIMIT $2`;
      values.push(limit);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get count of pending review words
   */
  static async getPendingReviewCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM vocabulary_failed_words
      WHERE user_id = $1 AND is_pending_review = true
    `;

    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Mark words as reviewed (link to review session)
   */
  static async markAsReviewed(userId, wordIds, sessionId) {
    if (!wordIds || wordIds.length === 0) {
      return [];
    }

    const query = `
      UPDATE vocabulary_failed_words
      SET reviewed_in_session_id = $1
      WHERE user_id = $2 AND word_id = ANY($3)
      RETURNING id, word_id, reviewed_in_session_id
    `;

    const result = await pool.query(query, [sessionId, userId, wordIds]);
    return result.rows;
  }

  /**
   * Reset word status after successful review (remove from pending)
   */
  static async resetWordStatus(userId, wordId) {
    const query = `
      UPDATE vocabulary_failed_words
      SET is_pending_review = false
      WHERE user_id = $1 AND word_id = $2
      RETURNING id, word_id, is_pending_review
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0];
  }

  /**
   * Remove a word from failed words (if user mastered it)
   */
  static async removeWord(userId, wordId) {
    const query = `
      DELETE FROM vocabulary_failed_words
      WHERE user_id = $1 AND word_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0];
  }

  /**
   * Get word IDs that are pending review for a user
   */
  static async getPendingReviewWordIds(userId) {
    const query = `
      SELECT word_id
      FROM vocabulary_failed_words
      WHERE user_id = $1 AND is_pending_review = true
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.word_id);
  }

  /**
   * Get user's failed words statistics
   */
  static async getUserFailedStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_failed_words,
        COUNT(CASE WHEN is_pending_review THEN 1 END) as pending_review_words,
        COUNT(CASE WHEN NOT is_pending_review THEN 1 END) as reviewed_words,
        COALESCE(SUM(fail_count), 0) as total_fails
      FROM vocabulary_failed_words
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get most failed words for a user (top mistakes)
   */
  static async getTopFailedWords(userId, limit = 10) {
    const query = `
      SELECT
        vfw.word_id,
        vfw.fail_count,
        vfw.is_pending_review,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level
      FROM vocabulary_failed_words vfw
      JOIN vocabulary_words vw ON vfw.word_id = vw.id
      WHERE vfw.user_id = $1
      ORDER BY vfw.fail_count DESC, vfw.last_failed_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Clear all pending review words (after successful review session)
   */
  static async clearPendingReview(userId, wordIds) {
    if (!wordIds || wordIds.length === 0) {
      return 0;
    }

    const query = `
      UPDATE vocabulary_failed_words
      SET is_pending_review = false
      WHERE user_id = $1 AND word_id = ANY($2) AND is_pending_review = true
      RETURNING id
    `;

    const result = await pool.query(query, [userId, wordIds]);
    return result.rows.length;
  }

  /**
   * Check if a word is in the user's failed words list
   */
  static async isWordFailed(userId, wordId) {
    const query = `
      SELECT EXISTS(
        SELECT 1
        FROM vocabulary_failed_words
        WHERE user_id = $1 AND word_id = $2
      ) as is_failed
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0].is_failed;
  }
}

module.exports = VocabularyFailedWords;
