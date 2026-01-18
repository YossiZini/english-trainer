const { pool } = require('../config/database');

class VocabularyQuizSession {
  /**
   * Create a new quiz session
   */
  static async create(userId, quizType, quizSize, difficultyStart, difficultyEnd, source = null) {
    const query = `
      INSERT INTO vocabulary_quiz_sessions (
        user_id, quiz_type, quiz_size, difficulty_range_start,
        difficulty_range_end, current_difficulty_stage, source
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, user_id, quiz_type, quiz_size, difficulty_range_start,
                difficulty_range_end, current_difficulty_stage, source, started_at, status
    `;

    // Determine initial stage based on difficulty range
    let initialStage = 1;
    if (difficultyStart >= 3 && difficultyEnd <= 5) {
      initialStage = 2;
    } else if (difficultyStart >= 5) {
      initialStage = 3;
    }

    const result = await pool.query(query, [
      userId,
      quizType,
      quizSize,
      difficultyStart,
      difficultyEnd,
      initialStage,
      source
    ]);
    return result.rows[0];
  }

  /**
   * Find session by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, user_id, quiz_type, quiz_size, difficulty_range_start,
             difficulty_range_end, total_questions, correct_answers,
             wrong_answers, points_earned, consecutive_correct,
             current_difficulty_stage, source, started_at, completed_at, status
      FROM vocabulary_quiz_sessions
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Update session progress after answering a question
   */
  static async updateProgress(id, correctAnswers, wrongAnswers, consecutiveCorrect, stage) {
    const query = `
      UPDATE vocabulary_quiz_sessions
      SET correct_answers = $2,
          wrong_answers = $3,
          consecutive_correct = $4,
          current_difficulty_stage = $5,
          total_questions = CAST($2 AS INTEGER) + CAST($3 AS INTEGER)
      WHERE id = $1
      RETURNING id, correct_answers, wrong_answers, consecutive_correct,
                current_difficulty_stage, total_questions
    `;

    const result = await pool.query(query, [
      id,
      correctAnswers,
      wrongAnswers,
      consecutiveCorrect,
      stage
    ]);
    return result.rows[0];
  }

  /**
   * Update difficulty range during progression
   */
  static async updateDifficultyRange(id, newStart, newEnd, newStage) {
    const query = `
      UPDATE vocabulary_quiz_sessions
      SET difficulty_range_start = $2,
          difficulty_range_end = $3,
          current_difficulty_stage = $4
      WHERE id = $1
      RETURNING id, difficulty_range_start, difficulty_range_end, current_difficulty_stage
    `;

    const result = await pool.query(query, [id, newStart, newEnd, newStage]);
    return result.rows[0];
  }

  /**
   * Complete a quiz session
   */
  static async complete(id, pointsEarned) {
    const query = `
      UPDATE vocabulary_quiz_sessions
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          points_earned = $2
      WHERE id = $1
      RETURNING id, user_id, quiz_type, total_questions, correct_answers,
                wrong_answers, points_earned, completed_at, status
    `;

    const result = await pool.query(query, [id, pointsEarned]);
    return result.rows[0];
  }

  /**
   * Get active session for a user (if exists)
   */
  static async getActiveSession(userId) {
    const query = `
      SELECT id, user_id, quiz_type, quiz_size, difficulty_range_start,
             difficulty_range_end, total_questions, correct_answers,
             wrong_answers, consecutive_correct, current_difficulty_stage,
             source, started_at, status
      FROM vocabulary_quiz_sessions
      WHERE user_id = $1 AND status = 'in_progress'
      ORDER BY started_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Cancel/invalidate a session
   */
  static async cancelSession(id) {
    const query = `
      UPDATE vocabulary_quiz_sessions
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get user's session history
   */
  static async getUserSessionHistory(userId, limit = 10) {
    const query = `
      SELECT id, quiz_type, quiz_size, total_questions, correct_answers,
             wrong_answers, points_earned, started_at, completed_at, status
      FROM vocabulary_quiz_sessions
      WHERE user_id = $1
      ORDER BY started_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get user's completed quizzes count
   */
  static async getCompletedQuizzesCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM vocabulary_quiz_sessions
      WHERE user_id = $1 AND status = 'completed'
    `;

    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get user's completed review sessions count
   */
  static async getCompletedReviewSessionsCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM vocabulary_quiz_sessions
      WHERE user_id = $1 AND status = 'completed' AND quiz_type = 'review'
    `;

    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Abandon a session (mark as abandoned if not completed)
   */
  static async abandon(id) {
    const query = `
      UPDATE vocabulary_quiz_sessions
      SET status = 'abandoned'
      WHERE id = $1 AND status = 'in_progress'
      RETURNING id, status
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get session statistics for a user
   */
  static async getUserSessionStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN quiz_type = 'review' THEN 1 END) as review_sessions,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN correct_answers * 100.0 / NULLIF(total_questions, 0) END), 0) as average_score,
        COALESCE(SUM(points_earned), 0) as total_points_earned
      FROM vocabulary_quiz_sessions
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Delete a session (for cleanup or testing)
   */
  static async delete(id) {
    const query = 'DELETE FROM vocabulary_quiz_sessions WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = VocabularyQuizSession;
