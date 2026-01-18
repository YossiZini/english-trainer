const { pool } = require('../config/database');

class VocabularyUserHistory {
  /**
   * Record a user's answer to a word
   */
  static async recordAnswer(userId, wordId, sessionId, isCorrect) {
    const query = `
      INSERT INTO vocabulary_user_history (
        user_id, word_id, quiz_session_id, is_correct
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, word_id, is_correct, answered_at
    `;

    const result = await pool.query(query, [userId, wordId, sessionId, isCorrect]);
    return result.rows[0];
  }

  /**
   * Get IDs of words the user has answered correctly
   * Used to avoid repeating words
   */
  static async getCorrectlyAnsweredWordIds(userId) {
    const query = `
      SELECT DISTINCT word_id
      FROM vocabulary_user_history
      WHERE user_id = $1 AND is_correct = true
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.word_id);
  }

  /**
   * Get user's overall word performance statistics
   */
  static async getUserWordStats(userId) {
    const query = `
      SELECT
        COUNT(DISTINCT word_id) as total_words_attempted,
        COUNT(DISTINCT CASE WHEN is_correct THEN word_id END) as words_learned,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
        SUM(CASE WHEN NOT is_correct THEN 1 ELSE 0 END) as wrong_attempts
      FROM vocabulary_user_history
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all answers for a specific session
   */
  static async getSessionHistory(sessionId) {
    const query = `
      SELECT
        vuh.id,
        vuh.word_id,
        vuh.is_correct,
        vuh.answered_at,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level
      FROM vocabulary_user_history vuh
      JOIN vocabulary_words vw ON vuh.word_id = vw.id
      WHERE vuh.quiz_session_id = $1
      ORDER BY vuh.answered_at ASC
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }

  /**
   * Get user's recent activity
   */
  static async getRecentActivity(userId, limit = 10) {
    const query = `
      SELECT
        vuh.id,
        vuh.word_id,
        vuh.is_correct,
        vuh.answered_at,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vqs.quiz_type
      FROM vocabulary_user_history vuh
      JOIN vocabulary_words vw ON vuh.word_id = vw.id
      LEFT JOIN vocabulary_quiz_sessions vqs ON vuh.quiz_session_id = vqs.id
      WHERE vuh.user_id = $1
      ORDER BY vuh.answered_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get word accuracy for a user (how many times correct vs incorrect)
   */
  static async getWordAccuracy(userId, wordId) {
    const query = `
      SELECT
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
        SUM(CASE WHEN NOT is_correct THEN 1 ELSE 0 END) as wrong_attempts
      FROM vocabulary_user_history
      WHERE user_id = $1 AND word_id = $2
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0];
  }

  /**
   * Check if user has ever answered a word correctly
   */
  static async hasAnsweredCorrectly(userId, wordId) {
    const query = `
      SELECT EXISTS(
        SELECT 1
        FROM vocabulary_user_history
        WHERE user_id = $1 AND word_id = $2 AND is_correct = true
      ) as has_answered_correctly
    `;

    const result = await pool.query(query, [userId, wordId]);
    return result.rows[0].has_answered_correctly;
  }

  /**
   * Get user's progress by difficulty level
   */
  static async getProgressByDifficulty(userId) {
    const query = `
      SELECT
        vw.difficulty_level,
        COUNT(DISTINCT vw.id) as total_words_in_level,
        COUNT(DISTINCT CASE WHEN vuh.is_correct THEN vw.id END) as words_learned_in_level
      FROM vocabulary_words vw
      LEFT JOIN vocabulary_user_history vuh
        ON vw.id = vuh.word_id AND vuh.user_id = $1
      GROUP BY vw.difficulty_level
      ORDER BY vw.difficulty_level ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Delete history for a specific session (if needed for cleanup)
   */
  static async deleteSessionHistory(sessionId) {
    const query = 'DELETE FROM vocabulary_user_history WHERE quiz_session_id = $1';
    await pool.query(query, [sessionId]);
  }

  /**
   * Get user's complete attempt history with filtering and pagination
   * @param {string} userId - User ID
   * @param {object} options - Filter and pagination options
   * @returns {object} History data with pagination info
   */
  static async getUserHistory(userId, options = {}) {
    const {
      page = 1,
      limit = 50,
      filter = 'all', // 'all', 'success', 'failed'
      wordId = null,
      startDate = null,
      endDate = null
    } = options;

    const offset = (page - 1) * limit;
    const conditions = ['vuh.user_id = $1'];
    const params = [userId];
    let paramIndex = 2;

    // Filter by result
    if (filter === 'success') {
      conditions.push('vuh.is_correct = true');
    } else if (filter === 'failed') {
      conditions.push('vuh.is_correct = false');
    }

    // Filter by specific word
    if (wordId) {
      conditions.push(`vuh.word_id = $${paramIndex}`);
      params.push(wordId);
      paramIndex++;
    }

    // Filter by date range
    if (startDate) {
      conditions.push(`vuh.answered_at >= $${paramIndex}`);
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      conditions.push(`vuh.answered_at <= $${paramIndex}`);
      params.push(endDate);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM vocabulary_user_history vuh
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].total);

    // Get history records
    const historyQuery = `
      SELECT
        vuh.id,
        vuh.word_id,
        vuh.is_correct,
        vuh.answered_at,
        vuh.quiz_session_id,
        vw.english_word,
        vw.hebrew_translation,
        vw.difficulty_level,
        vw.source,
        vqs.quiz_type,
        vqs.quiz_size,
        vqs.difficulty_range_start,
        vqs.difficulty_range_end
      FROM vocabulary_user_history vuh
      JOIN vocabulary_words vw ON vuh.word_id = vw.id
      LEFT JOIN vocabulary_quiz_sessions vqs ON vuh.quiz_session_id = vqs.id
      WHERE ${whereClause}
      ORDER BY vuh.answered_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const historyResult = await pool.query(historyQuery, params);

    return {
      records: historyResult.rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasMore: offset + historyResult.rows.length < totalRecords
      },
      filters: {
        filter,
        wordId,
        startDate,
        endDate
      }
    };
  }

  /**
   * Get history statistics for a user
   * @param {string} userId - User ID
   * @returns {object} Statistics summary
   */
  static async getHistoryStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE is_correct = true) as total_successes,
        COUNT(*) FILTER (WHERE is_correct = false) as total_failures,
        COUNT(DISTINCT word_id) as unique_words_attempted,
        COUNT(DISTINCT word_id) FILTER (WHERE is_correct = true) as unique_words_succeeded,
        COUNT(DISTINCT word_id) FILTER (WHERE is_correct = false) as unique_words_failed,
        COUNT(DISTINCT quiz_session_id) as total_quiz_sessions,
        MIN(answered_at) as first_attempt_date,
        MAX(answered_at) as last_attempt_date
      FROM vocabulary_user_history
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const stats = result.rows[0];

    return {
      totalAttempts: parseInt(stats.total_attempts),
      totalSuccesses: parseInt(stats.total_successes),
      totalFailures: parseInt(stats.total_failures),
      successRate: stats.total_attempts > 0
        ? Math.round((stats.total_successes / stats.total_attempts) * 100)
        : 0,
      uniqueWordsAttempted: parseInt(stats.unique_words_attempted),
      uniqueWordsSucceeded: parseInt(stats.unique_words_succeeded),
      uniqueWordsFailed: parseInt(stats.unique_words_failed),
      totalQuizSessions: parseInt(stats.total_quiz_sessions),
      firstAttemptDate: stats.first_attempt_date,
      lastAttemptDate: stats.last_attempt_date
    };
  }

  /**
   * Get aggregated history by word (each word with all its attempts)
   * @param {string} userId - User ID
   * @param {object} options - { page, limit, filter }
   * @returns {object} Aggregated word history with pagination
   */
  static async getAggregatedWordHistory(userId, options = {}) {
    const {
      page = 1,
      limit = 30,
      filter = 'all' // 'all', 'success', 'failed'
    } = options;

    const offset = (page - 1) * limit;

    // Build WHERE clause for filtering
    let filterClause = '';
    if (filter === 'success') {
      // Words where latest attempt was success
      filterClause = `AND (
        SELECT is_correct
        FROM vocabulary_user_history sub
        WHERE sub.user_id = vuh.user_id AND sub.word_id = vuh.word_id
        ORDER BY answered_at DESC LIMIT 1
      ) = true`;
    } else if (filter === 'failed') {
      // Words where latest attempt was failure
      filterClause = `AND (
        SELECT is_correct
        FROM vocabulary_user_history sub
        WHERE sub.user_id = vuh.user_id AND sub.word_id = vuh.word_id
        ORDER BY answered_at DESC LIMIT 1
      ) = false`;
    }

    // Get aggregated words with their attempts
    const query = `
      WITH word_summary AS (
        SELECT
          vuh.word_id,
          vw.english_word,
          vw.hebrew_translation,
          vw.difficulty_level,
          COUNT(*) as total_attempts,
          COUNT(*) FILTER (WHERE vuh.is_correct = true) as success_count,
          COUNT(*) FILTER (WHERE vuh.is_correct = false) as fail_count,
          MAX(vuh.answered_at) as last_attempt_at,
          MIN(vuh.answered_at) as first_attempt_at,
          json_agg(
            json_build_object(
              'id', vuh.id,
              'is_correct', vuh.is_correct,
              'answered_at', vuh.answered_at,
              'quiz_type', vqs.quiz_type,
              'source', vqs.source
            ) ORDER BY vuh.answered_at DESC
          ) as attempts
        FROM vocabulary_user_history vuh
        JOIN vocabulary_words vw ON vuh.word_id = vw.id
        LEFT JOIN vocabulary_quiz_sessions vqs ON vuh.quiz_session_id = vqs.id
        WHERE vuh.user_id = $1
        ${filterClause}
        GROUP BY vuh.word_id, vw.english_word, vw.hebrew_translation, vw.difficulty_level
      )
      SELECT * FROM word_summary
      ORDER BY last_attempt_at DESC
      LIMIT $2 OFFSET $3
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT vuh.word_id) as total
      FROM vocabulary_user_history vuh
      WHERE vuh.user_id = $1
      ${filterClause}
    `;

    const [historyResult, countResult] = await Promise.all([
      pool.query(query, [userId, limit, offset]),
      pool.query(countQuery, [userId])
    ]);

    const totalRecords = parseInt(countResult.rows[0].total);

    return {
      records: historyResult.rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasMore: offset + historyResult.rows.length < totalRecords
      },
      filters: {
        filter
      }
    };
  }
}

module.exports = VocabularyUserHistory;
