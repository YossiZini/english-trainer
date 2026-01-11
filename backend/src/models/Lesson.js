const { pool } = require('../config/database');

class Lesson {
  /**
   * Get all lessons with optional filtering
   */
  static async findAll({ level, topicNumber } = {}) {
    let query = `
      SELECT id, topic_number, subtopic_number, title_en, title_he,
             level, order_index, created_at
      FROM lessons
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (level) {
      query += ` AND level = $${paramIndex}`;
      values.push(level);
      paramIndex++;
    }

    if (topicNumber) {
      query += ` AND topic_number = $${paramIndex}`;
      values.push(topicNumber);
      paramIndex++;
    }

    query += ' ORDER BY order_index ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get lesson by ID with full content
   */
  static async findById(id) {
    const query = `
      SELECT id, topic_number, subtopic_number, title_en, title_he,
             level, order_index, theory_content_he, theory_content_en,
             created_at, updated_at
      FROM lessons
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get lessons with user progress
   */
  static async findAllWithProgress(userId, { level, topicNumber } = {}) {
    let query = `
      SELECT
        l.id, l.topic_number, l.subtopic_number, l.title_en, l.title_he,
        l.level, l.order_index,
        up.status, up.best_score, up.attempts,
        up.first_completed_at, up.last_attempted_at
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE 1=1
    `;
    const values = [userId];
    let paramIndex = 2;

    if (level) {
      query += ` AND l.level = $${paramIndex}`;
      values.push(level);
      paramIndex++;
    }

    if (topicNumber) {
      query += ` AND l.topic_number = $${paramIndex}`;
      values.push(topicNumber);
      paramIndex++;
    }

    query += ' ORDER BY l.order_index ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Create a new lesson
   */
  static async create(lessonData) {
    const {
      topicNumber,
      subtopicNumber,
      titleEn,
      titleHe,
      level,
      orderIndex,
      theoryContentHe,
      theoryContentEn
    } = lessonData;

    const query = `
      INSERT INTO lessons (
        topic_number, subtopic_number, title_en, title_he,
        level, order_index, theory_content_he, theory_content_en
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, topic_number, subtopic_number, title_en, title_he, level, order_index
    `;

    const values = [
      topicNumber,
      subtopicNumber,
      titleEn,
      titleHe,
      level,
      orderIndex,
      theoryContentHe,
      theoryContentEn || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get next lesson by order
   */
  static async getNextLesson(currentOrderIndex) {
    const query = `
      SELECT id, topic_number, subtopic_number, title_en, title_he,
             level, order_index
      FROM lessons
      WHERE order_index = $1
      ORDER BY order_index ASC
      LIMIT 1
    `;

    const result = await pool.query(query, [currentOrderIndex + 1]);
    return result.rows[0];
  }

  /**
   * Get previous lesson by order
   */
  static async getPreviousLesson(currentOrderIndex) {
    const query = `
      SELECT id, topic_number, subtopic_number, title_en, title_he,
             level, order_index
      FROM lessons
      WHERE order_index = $1
      ORDER BY order_index DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [currentOrderIndex - 1]);
    return result.rows[0];
  }
}

module.exports = Lesson;
