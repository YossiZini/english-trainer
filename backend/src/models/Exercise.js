const { pool } = require('../config/database');

class Exercise {
  /**
   * Get all exercises for a lesson
   */
  static async findByLessonId(lessonId) {
    const query = `
      SELECT id, lesson_id, question_number, type,
             question_text_he, question_text_en, options,
             correct_answer, explanation_he, explanation_en, difficulty
      FROM exercises
      WHERE lesson_id = $1
      ORDER BY question_number ASC
    `;

    const result = await pool.query(query, [lessonId]);
    return result.rows;
  }

  /**
   * Get exercises without answers (for client)
   */
  static async findByLessonIdForClient(lessonId) {
    const query = `
      SELECT id, lesson_id, question_number, type,
             question_text_he, question_text_en, options, difficulty
      FROM exercises
      WHERE lesson_id = $1
      ORDER BY question_number ASC
    `;

    const result = await pool.query(query, [lessonId]);
    return result.rows;
  }

  /**
   * Get single exercise by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, lesson_id, question_number, type,
             question_text_he, question_text_en, options,
             correct_answer, explanation_he, explanation_en, difficulty
      FROM exercises
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Create a new exercise
   */
  static async create(exerciseData) {
    const {
      lessonId,
      questionNumber,
      type,
      questionTextHe,
      questionTextEn,
      options,
      correctAnswer,
      explanationHe,
      explanationEn,
      difficulty
    } = exerciseData;

    const query = `
      INSERT INTO exercises (
        lesson_id, question_number, type, question_text_he, question_text_en,
        options, correct_answer, explanation_he, explanation_en, difficulty
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, lesson_id, question_number, type
    `;

    const values = [
      lessonId,
      questionNumber,
      type,
      questionTextHe,
      questionTextEn || null,
      options ? JSON.stringify(options) : null,
      correctAnswer,
      explanationHe,
      explanationEn || null,
      difficulty || 'medium'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create multiple exercises at once
   */
  static async createMany(exercises) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const createdExercises = [];
      for (const exercise of exercises) {
        const result = await this.create(exercise);
        createdExercises.push(result);
      }

      await client.query('COMMIT');
      return createdExercises;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if answer is correct
   */
  static async checkAnswer(exerciseId, userAnswer) {
    const exercise = await this.findById(exerciseId);

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // Normalize answers for comparison (trim, lowercase)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = exercise.correct_answer.trim().toLowerCase();

    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    return {
      isCorrect,
      correctAnswer: exercise.correct_answer,
      explanationHe: exercise.explanation_he,
      explanationEn: exercise.explanation_en
    };
  }
}

module.exports = Exercise;
