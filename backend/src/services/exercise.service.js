const Exercise = require('../models/Exercise');
const UserProgress = require('../models/UserProgress');
const { pool } = require('../config/database');

class ExerciseService {
  /**
   * Check a single answer (for immediate feedback)
   */
  static async checkAnswer(exerciseId, userAnswer) {
    const result = await Exercise.checkAnswer(exerciseId, userAnswer);
    return result;
  }

  /**
   * Submit complete exercise and save results
   */
  static async submitExercise(userId, lessonId, answers, timeSpent) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get all exercises for this lesson to validate
      const exercises = await Exercise.findByLessonId(lessonId);

      if (exercises.length === 0) {
        throw new Error('No exercises found for this lesson');
      }

      // Check each answer
      const results = [];
      const wrongAnswers = [];

      for (const answer of answers) {
        const exercise = exercises.find(ex => ex.id === answer.exerciseId);

        if (!exercise) {
          continue; // Skip if exercise not found
        }

        const normalizedUserAnswer = answer.userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = exercise.correct_answer.trim().toLowerCase();
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        results.push({
          exerciseId: answer.exerciseId,
          userAnswer: answer.userAnswer,
          correctAnswer: exercise.correct_answer,
          isCorrect
        });

        if (!isCorrect) {
          wrongAnswers.push({
            exerciseId: answer.exerciseId,
            userAnswer: answer.userAnswer,
            correctAnswer: exercise.correct_answer
          });
        }
      }

      const totalQuestions = results.length;
      const correctAnswers = results.filter(r => r.isCorrect).length;
      const wrongAnswersCount = totalQuestions - correctAnswers;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      // Get current attempt number
      const progress = await UserProgress.findOrCreate(userId, lessonId);
      const attemptNumber = progress.attempts + 1;

      // Save exercise result
      const resultQuery = `
        INSERT INTO exercise_results (
          user_id, lesson_id, attempt_number, total_questions,
          correct_answers, wrong_answers, score, time_spent
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, attempt_number, score, completed_at
      `;

      const resultValues = [
        userId,
        lessonId,
        attemptNumber,
        totalQuestions,
        correctAnswers,
        wrongAnswersCount,
        score,
        timeSpent
      ];

      const resultRecord = await client.query(resultQuery, resultValues);

      // Save wrong answers for retry functionality
      for (const wrongAnswer of wrongAnswers) {
        const wrongAnswerQuery = `
          INSERT INTO wrong_answers (
            user_id, lesson_id, exercise_id, user_answer,
            correct_answer, attempt_number
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await client.query(wrongAnswerQuery, [
          userId,
          lessonId,
          wrongAnswer.exerciseId,
          wrongAnswer.userAnswer,
          wrongAnswer.correctAnswer,
          attemptNumber
        ]);
      }

      // Update user progress
      await UserProgress.updateProgress(userId, lessonId, score, Math.floor(timeSpent / 60));

      await client.query('COMMIT');

      // Get next lesson if passed
      let nextLesson = null;
      if (score >= 70) {
        const lessonQuery = `
          SELECT l2.id, l2.title_en, l2.title_he
          FROM lessons l1
          JOIN lessons l2 ON l2.order_index = l1.order_index + 1
          WHERE l1.id = $1
        `;
        const nextResult = await pool.query(lessonQuery, [lessonId]);
        nextLesson = nextResult.rows[0] || null;
      }

      return {
        resultId: resultRecord.rows[0].id,
        attemptNumber,
        totalQuestions,
        correctAnswers,
        wrongAnswers: wrongAnswersCount,
        score,
        isPassed: score >= 70,
        timeSpent,
        results,
        nextLesson
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get results for a specific attempt
   */
  static async getResultById(resultId, userId) {
    const query = `
      SELECT er.id, er.user_id, er.lesson_id, er.attempt_number,
             er.total_questions, er.correct_answers, er.wrong_answers,
             er.score, er.time_spent, er.completed_at,
             l.title_en, l.title_he
      FROM exercise_results er
      JOIN lessons l ON er.lesson_id = l.id
      WHERE er.id = $1 AND er.user_id = $2
    `;

    const result = await pool.query(query, [resultId, userId]);
    return result.rows[0];
  }
}

module.exports = ExerciseService;
