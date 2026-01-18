const { pool } = require('../config/database');

class UnseenParagraph {
  /**
   * Find all paragraphs with optional filters
   */
  static async findAll(filters = {}) {
    const { complexity, topic, isCustom, limit = 100, offset = 0 } = filters;

    let query = `
      SELECT id, title_en, title_he, content, complexity_level, topic,
             hard_words, is_custom, uses_failed_words, created_at
      FROM unseen_paragraphs
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (complexity !== undefined) {
      query += ` AND complexity_level = $${paramIndex}`;
      values.push(complexity);
      paramIndex++;
    }

    if (topic) {
      query += ` AND topic = $${paramIndex}`;
      values.push(topic);
      paramIndex++;
    }

    if (isCustom !== undefined) {
      query += ` AND is_custom = $${paramIndex}`;
      values.push(isCustom);
      paramIndex++;
    }

    query += ` ORDER BY complexity_level ASC, title_en ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find a single paragraph by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, title_en, title_he, content, complexity_level, topic,
             hard_words, is_custom, uses_failed_words, created_at
      FROM unseen_paragraphs
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Create a new paragraph
   */
  static async create(paragraphData) {
    const {
      titleEn,
      titleHe = null,
      content,
      complexityLevel,
      topic = null,
      hardWords = [],
      isCustom = false,
      usesFailedWords = false,
      createdBy = null
    } = paragraphData;

    const query = `
      INSERT INTO unseen_paragraphs (
        title_en, title_he, content, complexity_level, topic,
        hard_words, is_custom, uses_failed_words, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, title_en, title_he, complexity_level, topic
    `;

    const values = [
      titleEn,
      titleHe,
      content,
      complexityLevel,
      topic,
      JSON.stringify(hardWords),
      isCustom,
      usesFailedWords,
      createdBy
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update an existing paragraph
   */
  static async update(id, paragraphData) {
    const {
      titleEn,
      titleHe,
      content,
      complexityLevel,
      topic,
      hardWords
    } = paragraphData;

    const query = `
      UPDATE unseen_paragraphs
      SET title_en = COALESCE($1, title_en),
          title_he = COALESCE($2, title_he),
          content = COALESCE($3, content),
          complexity_level = COALESCE($4, complexity_level),
          topic = COALESCE($5, topic),
          hard_words = COALESCE($6, hard_words)
      WHERE id = $7
      RETURNING id, title_en, title_he, complexity_level, topic
    `;

    const values = [
      titleEn,
      titleHe,
      content,
      complexityLevel,
      topic,
      hardWords ? JSON.stringify(hardWords) : null,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a paragraph
   */
  static async delete(id) {
    const query = 'DELETE FROM unseen_paragraphs WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get count of paragraphs by complexity level
   */
  static async getCountByComplexity() {
    const query = `
      SELECT complexity_level, COUNT(*) as count
      FROM unseen_paragraphs
      GROUP BY complexity_level
      ORDER BY complexity_level ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get all unique topics
   */
  static async getAllTopics() {
    const query = `
      SELECT DISTINCT topic
      FROM unseen_paragraphs
      WHERE topic IS NOT NULL
      ORDER BY topic ASC
    `;

    const result = await pool.query(query);
    return result.rows.map(row => row.topic);
  }

  /**
   * Get total paragraph count
   */
  static async getTotalCount() {
    const query = 'SELECT COUNT(*) as total FROM unseen_paragraphs';
    const result = await pool.query(query);
    return parseInt(result.rows[0].total);
  }
}

module.exports = UnseenParagraph;
