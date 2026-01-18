const { pool } = require('../config/database');

class UnseenUserProgress {
  /**
   * Get user's progress for a specific paragraph
   */
  static async getByUserAndParagraph(userId, paragraphId) {
    const query = `
      SELECT id, user_id, paragraph_id, best_score, attempts,
             last_attempted_at, first_completed_at, created_at, updated_at
      FROM unseen_user_progress
      WHERE user_id = $1 AND paragraph_id = $2
    `;

    const result = await pool.query(query, [userId, paragraphId]);
    return result.rows[0];
  }

  /**
   * Get all progress for a user
   */
  static async getAllByUser(userId) {
    const query = `
      SELECT
        up.id, up.user_id, up.paragraph_id, up.best_score, up.attempts,
        up.last_attempted_at, up.first_completed_at,
        p.title_en, p.title_he, p.complexity_level, p.topic
      FROM unseen_user_progress up
      JOIN unseen_paragraphs p ON up.paragraph_id = p.id
      WHERE up.user_id = $1
      ORDER BY up.last_attempted_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Create or update progress after completing a session
   */
  static async upsertProgress(userId, paragraphId, sessionScore) {
    const query = `
      INSERT INTO unseen_user_progress (
        user_id, paragraph_id, best_score, attempts, last_attempted_at, first_completed_at, updated_at
      )
      VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, paragraph_id)
      DO UPDATE SET
        best_score = GREATEST(unseen_user_progress.best_score, EXCLUDED.best_score),
        attempts = unseen_user_progress.attempts + 1,
        last_attempted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, user_id, paragraph_id, best_score, attempts
    `;

    const result = await pool.query(query, [userId, paragraphId, sessionScore]);
    return result.rows[0];
  }

  /**
   * Get user's overall statistics
   */
  static async getUserStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_attempted,
        COUNT(CASE WHEN best_score >= 80 THEN 1 END) as excellent_count,
        COUNT(CASE WHEN best_score >= 60 AND best_score < 80 THEN 1 END) as good_count,
        COUNT(CASE WHEN best_score < 60 THEN 1 END) as needs_work_count,
        COALESCE(AVG(best_score), 0) as average_score,
        COALESCE(SUM(attempts), 0) as total_attempts
      FROM unseen_user_progress
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get progress with paragraph details for a user
   */
  static async getProgressWithDetails(userId) {
    const query = `
      SELECT
        up.paragraph_id,
        up.best_score,
        up.attempts,
        up.last_attempted_at,
        p.title_en,
        p.title_he,
        p.complexity_level,
        p.topic
      FROM unseen_user_progress up
      JOIN unseen_paragraphs p ON up.paragraph_id = p.id
      WHERE up.user_id = $1
      ORDER BY up.last_attempted_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get paragraphs not yet attempted by user
   */
  static async getUnattemptedParagraphs(userId) {
    const query = `
      SELECT p.id, p.title_en, p.title_he, p.complexity_level, p.topic
      FROM unseen_paragraphs p
      WHERE NOT EXISTS (
        SELECT 1
        FROM unseen_user_progress up
        WHERE up.user_id = $1 AND up.paragraph_id = p.id
      )
      ORDER BY p.complexity_level ASC, p.title_en ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get count of paragraphs by complexity level that user has attempted
   */
  static async getProgressByComplexity(userId) {
    const query = `
      SELECT
        p.complexity_level,
        COUNT(*) as attempted_count,
        COALESCE(AVG(up.best_score), 0) as average_score
      FROM unseen_user_progress up
      JOIN unseen_paragraphs p ON up.paragraph_id = p.id
      WHERE up.user_id = $1
      GROUP BY p.complexity_level
      ORDER BY p.complexity_level ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Delete progress for a user and paragraph
   */
  static async delete(userId, paragraphId) {
    const query = `
      DELETE FROM unseen_user_progress
      WHERE user_id = $1 AND paragraph_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [userId, paragraphId]);
    return result.rows[0];
  }
}

module.exports = UnseenUserProgress;
