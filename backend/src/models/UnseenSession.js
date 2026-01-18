const { pool } = require('../config/database');

class UnseenSession {
  /**
   * Create a new reading session
   */
  static async create(userId, paragraphId) {
    const query = `
      INSERT INTO unseen_sessions (user_id, paragraph_id, total_questions, status)
      VALUES ($1, $2, 5, 'in_progress')
      RETURNING id, user_id, paragraph_id, total_questions, status, started_at
    `;

    const result = await pool.query(query, [userId, paragraphId]);
    return result.rows[0];
  }

  /**
   * Find a session by ID
   */
  static async findById(sessionId) {
    const query = `
      SELECT id, user_id, paragraph_id, score, correct_answers, total_questions,
             started_at, completed_at, status
      FROM unseen_sessions
      WHERE id = $1
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  /**
   * Get session with paragraph and questions details
   */
  static async getSessionWithDetails(sessionId) {
    const query = `
      SELECT
        s.id, s.user_id, s.paragraph_id, s.score, s.correct_answers, s.total_questions,
        s.started_at, s.completed_at, s.status,
        p.title_en, p.title_he, p.content, p.complexity_level, p.topic, p.hard_words
      FROM unseen_sessions s
      JOIN unseen_paragraphs p ON s.paragraph_id = p.id
      WHERE s.id = $1
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  /**
   * Record an answer for a session
   */
  static async recordAnswer(sessionId, questionId, userAnswer, isCorrect) {
    const query = `
      INSERT INTO unseen_answers (session_id, question_id, user_answer, is_correct)
      VALUES ($1, $2, $3, $4)
      RETURNING id, session_id, question_id, is_correct
    `;

    const result = await pool.query(query, [sessionId, questionId, userAnswer, isCorrect]);
    return result.rows[0];
  }

  /**
   * Get all answers for a session
   */
  static async getSessionAnswers(sessionId) {
    const query = `
      SELECT
        a.id, a.session_id, a.question_id, a.user_answer, a.is_correct, a.answered_at,
        q.question_number, q.question_text_en, q.question_text_he,
        q.options, q.correct_answer, q.explanation_he
      FROM unseen_answers a
      JOIN unseen_questions q ON a.question_id = q.id
      WHERE a.session_id = $1
      ORDER BY q.question_number ASC
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }

  /**
   * Complete a session and calculate final score
   */
  static async complete(sessionId) {
    // First, count correct answers
    const countQuery = `
      SELECT COUNT(*) as correct_count
      FROM unseen_answers
      WHERE session_id = $1 AND is_correct = TRUE
    `;

    const countResult = await pool.query(countQuery, [sessionId]);
    const correctCount = parseInt(countResult.rows[0].correct_count);

    // Calculate score percentage (out of 5 questions)
    const score = Math.round((correctCount / 5) * 100);

    // Update session
    const updateQuery = `
      UPDATE unseen_sessions
      SET correct_answers = $1,
          score = $2,
          completed_at = CURRENT_TIMESTAMP,
          status = 'completed'
      WHERE id = $3
      RETURNING id, user_id, paragraph_id, score, correct_answers, total_questions, completed_at
    `;

    const result = await pool.query(updateQuery, [correctCount, score, sessionId]);
    return result.rows[0];
  }

  /**
   * Get all sessions for a user
   */
  static async getByUser(userId, limit = 50) {
    const query = `
      SELECT
        s.id, s.paragraph_id, s.score, s.correct_answers, s.total_questions,
        s.started_at, s.completed_at, s.status,
        p.title_en, p.title_he, p.complexity_level
      FROM unseen_sessions s
      JOIN unseen_paragraphs p ON s.paragraph_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.started_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get sessions for a specific paragraph by a user
   */
  static async getByUserAndParagraph(userId, paragraphId, limit = 10) {
    const query = `
      SELECT id, user_id, paragraph_id, score, correct_answers, total_questions,
             started_at, completed_at, status
      FROM unseen_sessions
      WHERE user_id = $1 AND paragraph_id = $2
      ORDER BY started_at DESC
      LIMIT $3
    `;

    const result = await pool.query(query, [userId, paragraphId, limit]);
    return result.rows;
  }

  /**
   * Mark session as abandoned
   */
  static async abandon(sessionId) {
    const query = `
      UPDATE unseen_sessions
      SET status = 'abandoned'
      WHERE id = $1
      RETURNING id, status
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  /**
   * Delete a session and all its answers
   */
  static async delete(sessionId) {
    const query = 'DELETE FROM unseen_sessions WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  /**
   * Get user's session statistics
   */
  static async getUserSessionStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN score END), 0) as average_score,
        COALESCE(MAX(score), 0) as highest_score
      FROM unseen_sessions
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = UnseenSession;
