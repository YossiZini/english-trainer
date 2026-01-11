const { pool } = require('../config/database');

class WrongAnswer {
  /**
   * Get all wrong answers for a specific lesson and user
   */
  static async findByUserAndLesson(userId, lessonId, onlyUncorrected = false) {
    const baseQuery = `
      SELECT wa.id, wa.user_id, wa.lesson_id, wa.exercise_id,
             wa.user_answer, wa.correct_answer, wa.attempt_number,
             wa.is_reviewed, wa.is_corrected, wa.created_at, wa.corrected_at,
             e.question_text_he, e.question_number, e.type, e.options,
             e.explanation_he, e.explanation_en
      FROM wrong_answers wa
      JOIN exercises e ON wa.exercise_id = e.id
      WHERE wa.user_id = $1 AND wa.lesson_id = $2
    `;

    const query = onlyUncorrected
      ? baseQuery + ' AND wa.is_corrected = FALSE ORDER BY e.question_number'
      : baseQuery + ' ORDER BY e.question_number';

    const result = await pool.query(query, [userId, lessonId]);
    return result.rows;
  }

  /**
   * Get all wrong answers for a user (all lessons)
   */
  static async findByUser(userId, onlyUncorrected = false) {
    const baseQuery = `
      SELECT wa.id, wa.user_id, wa.lesson_id, wa.exercise_id,
             wa.user_answer, wa.correct_answer, wa.attempt_number,
             wa.is_reviewed, wa.is_corrected, wa.created_at, wa.corrected_at,
             e.question_text_he, e.question_number, e.type, e.options,
             e.explanation_he, e.explanation_en,
             l.title_he as lesson_title_he, l.title_en as lesson_title_en
      FROM wrong_answers wa
      JOIN exercises e ON wa.exercise_id = e.id
      JOIN lessons l ON wa.lesson_id = l.id
      WHERE wa.user_id = $1
    `;

    const query = onlyUncorrected
      ? baseQuery + ' AND wa.is_corrected = FALSE ORDER BY wa.created_at DESC'
      : baseQuery + ' ORDER BY wa.created_at DESC';

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Mark mistakes as reviewed
   */
  static async markAsReviewed(userId, lessonId) {
    const query = `
      UPDATE wrong_answers
      SET is_reviewed = TRUE
      WHERE user_id = $1 AND lesson_id = $2 AND is_reviewed = FALSE
      RETURNING id
    `;

    const result = await pool.query(query, [userId, lessonId]);
    return result.rows.length;
  }

  /**
   * Mark a single mistake as corrected
   */
  static async markAsCorrected(exerciseId, userId) {
    const query = `
      UPDATE wrong_answers
      SET is_corrected = TRUE, corrected_at = CURRENT_TIMESTAMP
      WHERE exercise_id = $1 AND user_id = $2 AND is_corrected = FALSE
      RETURNING id
    `;

    const result = await pool.query(query, [exerciseId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Get mistake statistics for a user
   */
  static async getStatistics(userId) {
    const query = `
      SELECT
        COUNT(*) as total_mistakes,
        COUNT(CASE WHEN is_corrected = TRUE THEN 1 END) as corrected_count,
        COUNT(CASE WHEN is_corrected = FALSE THEN 1 END) as uncorrected_count,
        COUNT(CASE WHEN is_reviewed = TRUE THEN 1 END) as reviewed_count
      FROM wrong_answers
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get mistakes grouped by lesson for a user
   */
  static async getMistakesByLesson(userId) {
    const query = `
      SELECT
        l.id as lesson_id,
        l.title_he,
        l.title_en,
        l.subtopic_number,
        COUNT(*) as total_mistakes,
        COUNT(CASE WHEN wa.is_corrected = TRUE THEN 1 END) as corrected_count,
        COUNT(CASE WHEN wa.is_corrected = FALSE THEN 1 END) as uncorrected_count
      FROM wrong_answers wa
      JOIN lessons l ON wa.lesson_id = l.id
      WHERE wa.user_id = $1
      GROUP BY l.id, l.title_he, l.title_en, l.subtopic_number
      ORDER BY l.subtopic_number
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Delete all wrong answers for a specific exercise and user
   * (Used when user wants to reset their mistakes)
   */
  static async deleteByExerciseAndUser(exerciseId, userId) {
    const query = `
      DELETE FROM wrong_answers
      WHERE exercise_id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [exerciseId, userId]);
    return result.rowCount;
  }

  /**
   * Check if a user has any uncorrected mistakes for a lesson
   */
  static async hasUncorrectedMistakes(userId, lessonId) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM wrong_answers
        WHERE user_id = $1 AND lesson_id = $2 AND is_corrected = FALSE
      ) as has_mistakes
    `;

    const result = await pool.query(query, [userId, lessonId]);
    return result.rows[0].has_mistakes;
  }
}

module.exports = WrongAnswer;
