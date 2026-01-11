const { pool } = require('../config/database');

class UserProgress {
  /**
   * Get or create progress for a lesson
   */
  static async findOrCreate(userId, lessonId) {
    // Check if progress exists
    const findQuery = `
      SELECT id, user_id, lesson_id, status, best_score, attempts,
             first_completed_at, last_attempted_at, time_spent
      FROM user_progress
      WHERE user_id = $1 AND lesson_id = $2
    `;

    const result = await pool.query(findQuery, [userId, lessonId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new progress record
    const createQuery = `
      INSERT INTO user_progress (user_id, lesson_id, status, best_score, attempts, time_spent)
      VALUES ($1, $2, 'not_started', 0, 0, 0)
      RETURNING id, user_id, lesson_id, status, best_score, attempts,
                first_completed_at, last_attempted_at, time_spent
    `;

    const createResult = await pool.query(createQuery, [userId, lessonId]);
    return createResult.rows[0];
  }

  /**
   * Update progress after exercise completion
   */
  static async updateProgress(userId, lessonId, score, timeSpent) {
    const progress = await this.findOrCreate(userId, lessonId);

    const newAttempts = progress.attempts + 1;
    const newBestScore = Math.max(progress.best_score, score);
    const newTotalTime = progress.time_spent + timeSpent;
    const newStatus = score >= 70 ? 'completed' : 'in_progress';
    const firstCompletedAt = progress.first_completed_at || (score >= 70 ? new Date() : null);

    const query = `
      UPDATE user_progress
      SET status = $1,
          best_score = $2,
          attempts = $3,
          time_spent = $4,
          first_completed_at = $5,
          last_attempted_at = CURRENT_TIMESTAMP
      WHERE user_id = $6 AND lesson_id = $7
      RETURNING id, user_id, lesson_id, status, best_score, attempts,
                first_completed_at, last_attempted_at, time_spent
    `;

    const values = [
      newStatus,
      newBestScore,
      newAttempts,
      newTotalTime,
      firstCompletedAt,
      userId,
      lessonId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get progress for a specific lesson
   */
  static async getProgress(userId, lessonId) {
    const query = `
      SELECT id, user_id, lesson_id, status, best_score, attempts,
             first_completed_at, last_attempted_at, time_spent
      FROM user_progress
      WHERE user_id = $1 AND lesson_id = $2
    `;

    const result = await pool.query(query, [userId, lessonId]);
    return result.rows[0];
  }

  /**
   * Get all progress for a user
   */
  static async getAllProgress(userId) {
    const query = `
      SELECT up.id, up.user_id, up.lesson_id, up.status, up.best_score, up.attempts,
             up.first_completed_at, up.last_attempted_at, up.time_spent,
             l.title_en, l.title_he, l.topic_number, l.subtopic_number
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = $1
      ORDER BY l.order_index ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get overall statistics for a user
   */
  static async getOverallStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_lessons_attempted,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as lessons_completed,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as lessons_in_progress,
        COALESCE(AVG(CASE WHEN best_score > 0 THEN best_score END), 0) as average_score,
        COALESCE(SUM(time_spent), 0) as total_time_spent,
        COALESCE(SUM(attempts), 0) as total_attempts,
        MAX(last_attempted_at) as last_activity
      FROM user_progress
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get progress grouped by topic
   */
  static async getProgressByTopic(userId) {
    const query = `
      SELECT
        l.topic_number,
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN up.status = 'in_progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN up.status IS NULL OR up.status = 'not_started' THEN 1 END) as not_started_count,
        COALESCE(AVG(CASE WHEN up.best_score > 0 THEN up.best_score END), 0) as average_score
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      GROUP BY l.topic_number
      ORDER BY l.topic_number
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get recent activity (last N attempts)
   */
  static async getRecentActivity(userId, limit = 10) {
    const query = `
      SELECT
        er.id,
        er.lesson_id,
        er.attempt_number,
        er.score,
        er.total_questions,
        er.correct_answers,
        er.wrong_answers,
        er.time_spent,
        er.completed_at,
        l.title_he,
        l.title_en,
        l.subtopic_number
      FROM exercise_results er
      JOIN lessons l ON er.lesson_id = l.id
      WHERE er.user_id = $1
      ORDER BY er.completed_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get next lesson to study (first incomplete or not started)
   */
  static async getNextLesson(userId) {
    const query = `
      SELECT l.id, l.title_he, l.title_en, l.subtopic_number,
             COALESCE(up.status, 'not_started') as status
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE COALESCE(up.status, 'not_started') != 'completed'
      ORDER BY l.order_index ASC
      LIMIT 1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get lesson completion percentage
   */
  static async getCompletionPercentage(userId) {
    const query = `
      SELECT
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const { total_lessons, completed_lessons } = result.rows[0];
    const percentage = total_lessons > 0 ? Math.round((completed_lessons / total_lessons) * 100) : 0;

    return {
      total_lessons: parseInt(total_lessons),
      completed_lessons: parseInt(completed_lessons),
      percentage
    };
  }
}

module.exports = UserProgress;
