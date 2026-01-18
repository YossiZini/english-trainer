const { pool } = require('../config/database');

class VocabularyUserStats {
  /**
   * Find or create stats record for a user
   */
  static async findOrCreate(userId) {
    // Try to find existing record
    let query = 'SELECT * FROM vocabulary_user_stats WHERE user_id = $1';
    let result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new record if not exists
    query = `
      INSERT INTO vocabulary_user_stats (user_id, accumulated_fails, total_words_learned)
      VALUES ($1, 0, 0)
      RETURNING *
    `;
    result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get user stats
   */
  static async getStats(userId) {
    const query = 'SELECT * FROM vocabulary_user_stats WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Increment accumulated fails
   */
  static async incrementFails(userId, count = 1) {
    const query = `
      INSERT INTO vocabulary_user_stats (user_id, accumulated_fails)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        accumulated_fails = vocabulary_user_stats.accumulated_fails + $2,
        updated_at = CURRENT_TIMESTAMP
      RETURNING accumulated_fails
    `;

    const result = await pool.query(query, [userId, count]);
    return result.rows[0].accumulated_fails;
  }

  /**
   * Decrement accumulated fails (after review correct answers)
   */
  static async decrementFails(userId, count) {
    const query = `
      UPDATE vocabulary_user_stats
      SET accumulated_fails = GREATEST(0, accumulated_fails - $2),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING accumulated_fails
    `;

    const result = await pool.query(query, [userId, count]);
    return result.rows[0] ? result.rows[0].accumulated_fails : 0;
  }

  /**
   * Reset accumulated fails to zero
   */
  static async resetFails(userId) {
    const query = `
      UPDATE vocabulary_user_stats
      SET accumulated_fails = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING accumulated_fails
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Set accumulated fails to a specific value
   */
  static async setFails(userId, count) {
    const query = `
      INSERT INTO vocabulary_user_stats (user_id, accumulated_fails)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        accumulated_fails = $2,
        updated_at = CURRENT_TIMESTAMP
      RETURNING accumulated_fails
    `;

    const result = await pool.query(query, [userId, count]);
    return result.rows[0].accumulated_fails;
  }

  /**
   * Increment total words learned
   */
  static async incrementWordsLearned(userId, count = 1) {
    const query = `
      INSERT INTO vocabulary_user_stats (user_id, total_words_learned)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_words_learned = vocabulary_user_stats.total_words_learned + $2,
        updated_at = CURRENT_TIMESTAMP
      RETURNING total_words_learned
    `;

    const result = await pool.query(query, [userId, count]);
    return result.rows[0].total_words_learned;
  }

  /**
   * Update total words learned to a specific count
   */
  static async updateWordsLearned(userId, count) {
    const query = `
      INSERT INTO vocabulary_user_stats (user_id, total_words_learned)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_words_learned = $2,
        updated_at = CURRENT_TIMESTAMP
      RETURNING total_words_learned
    `;

    const result = await pool.query(query, [userId, count]);
    return result.rows[0].total_words_learned;
  }

  /**
   * Increment total quizzes completed
   */
  static async incrementQuizzesCompleted(userId) {
    const query = `
      INSERT INTO vocabulary_user_stats (user_id, total_quizzes_completed)
      VALUES ($1, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_quizzes_completed = vocabulary_user_stats.total_quizzes_completed + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING total_quizzes_completed
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0].total_quizzes_completed;
  }

  /**
   * Increment total review sessions
   */
  static async incrementReviewSessions(userId) {
    const query = `
      INSERT INTO vocabulary_user_stats (user_id, total_review_sessions)
      VALUES ($1, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_review_sessions = vocabulary_user_stats.total_review_sessions + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING total_review_sessions
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0].total_review_sessions;
  }

  /**
   * Get accumulated fails count
   */
  static async getAccumulatedFails(userId) {
    const query = `
      SELECT COALESCE(accumulated_fails, 0) as accumulated_fails
      FROM vocabulary_user_stats
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0] ? parseInt(result.rows[0].accumulated_fails) : 0;
  }

  /**
   * Check if review mode should be triggered (accumulated_fails >= 10)
   */
  static async shouldTriggerReview(userId) {
    const fails = await this.getAccumulatedFails(userId);
    return fails >= 10;
  }

  /**
   * Update all stats at once
   */
  static async updateStats(userId, updates) {
    const {
      accumulated_fails,
      total_words_learned,
      total_quizzes_completed,
      total_review_sessions
    } = updates;

    const fields = [];
    const values = [userId];
    let paramIndex = 2;

    if (accumulated_fails !== undefined) {
      fields.push(`accumulated_fails = $${paramIndex++}`);
      values.push(accumulated_fails);
    }
    if (total_words_learned !== undefined) {
      fields.push(`total_words_learned = $${paramIndex++}`);
      values.push(total_words_learned);
    }
    if (total_quizzes_completed !== undefined) {
      fields.push(`total_quizzes_completed = $${paramIndex++}`);
      values.push(total_quizzes_completed);
    }
    if (total_review_sessions !== undefined) {
      fields.push(`total_review_sessions = $${paramIndex++}`);
      values.push(total_review_sessions);
    }

    if (fields.length === 0) {
      return this.getStats(userId);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const query = `
      UPDATE vocabulary_user_stats
      SET ${fields.join(', ')}
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete user stats (for cleanup)
   */
  static async delete(userId) {
    const query = 'DELETE FROM vocabulary_user_stats WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = VocabularyUserStats;
