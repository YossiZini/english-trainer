const { pool } = require('../config/database');

class UnseenQuestion {
  /**
   * Find all questions for a paragraph
   */
  static async findByParagraphId(paragraphId) {
    const query = `
      SELECT id, paragraph_id, question_number, question_text_en, question_text_he,
             options, correct_answer, explanation_he, created_at
      FROM unseen_questions
      WHERE paragraph_id = $1
      ORDER BY question_number ASC
    `;

    const result = await pool.query(query, [paragraphId]);
    return result.rows;
  }

  /**
   * Find a single question by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, paragraph_id, question_number, question_text_en, question_text_he,
             options, correct_answer, explanation_he, created_at
      FROM unseen_questions
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Create a new question
   */
  static async create(questionData) {
    const {
      paragraphId,
      questionNumber,
      questionTextEn,
      questionTextHe = null,
      options,
      correctAnswer,
      explanationHe = null
    } = questionData;

    const query = `
      INSERT INTO unseen_questions (
        paragraph_id, question_number, question_text_en, question_text_he,
        options, correct_answer, explanation_he
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, paragraph_id, question_number, question_text_en
    `;

    const values = [
      paragraphId,
      questionNumber,
      questionTextEn,
      questionTextHe,
      JSON.stringify(options),
      correctAnswer,
      explanationHe
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Bulk create questions for a paragraph
   */
  static async bulkCreate(paragraphId, questionsArray) {
    if (!questionsArray || questionsArray.length === 0) {
      return [];
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const createdQuestions = [];
      for (const questionData of questionsArray) {
        const result = await client.query(
          `
          INSERT INTO unseen_questions (
            paragraph_id, question_number, question_text_en, question_text_he,
            options, correct_answer, explanation_he
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, question_number
          `,
          [
            paragraphId,
            questionData.questionNumber,
            questionData.questionTextEn,
            questionData.questionTextHe || null,
            JSON.stringify(questionData.options),
            questionData.correctAnswer,
            questionData.explanationHe || null
          ]
        );
        createdQuestions.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdQuestions;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update a question
   */
  static async update(id, questionData) {
    const {
      questionTextEn,
      questionTextHe,
      options,
      correctAnswer,
      explanationHe
    } = questionData;

    const query = `
      UPDATE unseen_questions
      SET question_text_en = COALESCE($1, question_text_en),
          question_text_he = COALESCE($2, question_text_he),
          options = COALESCE($3, options),
          correct_answer = COALESCE($4, correct_answer),
          explanation_he = COALESCE($5, explanation_he)
      WHERE id = $6
      RETURNING id, paragraph_id, question_number
    `;

    const values = [
      questionTextEn,
      questionTextHe,
      options ? JSON.stringify(options) : null,
      correctAnswer,
      explanationHe,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a question
   */
  static async delete(id) {
    const query = 'DELETE FROM unseen_questions WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Delete all questions for a paragraph
   */
  static async deleteByParagraphId(paragraphId) {
    const query = 'DELETE FROM unseen_questions WHERE paragraph_id = $1 RETURNING id';
    const result = await pool.query(query, [paragraphId]);
    return result.rows;
  }

  /**
   * Get count of questions for a paragraph
   */
  static async getCountByParagraphId(paragraphId) {
    const query = `
      SELECT COUNT(*) as count
      FROM unseen_questions
      WHERE paragraph_id = $1
    `;

    const result = await pool.query(query, [paragraphId]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = UnseenQuestion;
