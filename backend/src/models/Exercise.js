const { db, withTransaction } = require('../config/database');
const { answersMatch } = require('../utils/answers');

class Exercise {
  /**
   * Get all exercises for a lesson
   */
  static async findByLessonId(lessonId) {
    const exercises = await db.findByIndex('exercises', 'lesson_id', lessonId);

    // Sort by question_number
    exercises.sort((a, b) => a.question_number - b.question_number);

    return exercises;
  }

  /**
   * Get exercises without answers (for client)
   */
  static async findByLessonIdForClient(lessonId) {
    const exercises = await this.findByLessonId(lessonId);

    // Return without correct_answer and explanations
    return exercises.map(e => ({
      id: e.id,
      lesson_id: e.lesson_id,
      question_number: e.question_number,
      type: e.type,
      question_text_he: e.question_text_he,
      question_text_en: e.question_text_en,
      options: e.options,
      difficulty: e.difficulty
    }));
  }

  /**
   * Get single exercise by ID
   */
  static async findById(id) {
    const exercise = await db.findById('exercises', id);
    return exercise || null;
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

    const exercise = await db.insert('exercises', {
      lesson_id: lessonId,
      question_number: questionNumber,
      type,
      question_text_he: questionTextHe,
      question_text_en: questionTextEn || null,
      options: options || null,
      correct_answer: correctAnswer,
      explanation_he: explanationHe,
      explanation_en: explanationEn || null,
      difficulty: difficulty || 'medium',
      created_at: new Date().toISOString()
    });

    return {
      id: exercise.id,
      lesson_id: exercise.lesson_id,
      question_number: exercise.question_number,
      type: exercise.type
    };
  }

  /**
   * Create multiple exercises at once
   */
  static async createMany(exercises) {
    return withTransaction(async () => {
      const createdExercises = [];
      for (const exerciseData of exercises) {
        const result = await this.create(exerciseData);
        createdExercises.push(result);
      }
      return createdExercises;
    });
  }

  /**
   * Check if answer is correct
   */
  static async checkAnswer(exerciseId, userAnswer) {
    const exercise = await this.findById(exerciseId);

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    const isCorrect = answersMatch(userAnswer, exercise.correct_answer);

    return {
      isCorrect,
      correctAnswer: exercise.correct_answer,
      explanationHe: exercise.explanation_he,
      explanationEn: exercise.explanation_en
    };
  }
}

module.exports = Exercise;
