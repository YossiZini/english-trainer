const { db, withTransaction } = require('../config/database');
const { isCorrectAnswer } = require('../utils/answers');
const QuestionOverride = require('./QuestionOverride');

/**
 * Lesson questions: the bundled content with the live review corrections
 * (QuestionOverride) applied. Grading and lookups by id always see the
 * corrected question; what is served to students leaves out questions that
 * are hidden (reported, under review) or removed.
 */
class Exercise {
  /**
   * All exercises of a lesson, corrected, hidden ones included (grading of
   * a lesson that was already served needs them).
   */
  static async findByLessonId(lessonId) {
    const exercises = await db.findByIndex('exercises', 'lesson_id', lessonId);
    const overrides = await QuestionOverride.all();

    // Sort by question_number
    exercises.sort((a, b) => a.question_number - b.question_number);

    return exercises.map(e => QuestionOverride.apply(e, overrides.get(e.id)));
  }

  /**
   * The corrections and a visibility test, for callers that join many
   * exercises at once (mistakes).
   */
  static async overlay() {
    const overrides = await QuestionOverride.all();
    return {
      apply: (e) => (e ? QuestionOverride.apply(e, overrides.get(e.id)) : e),
      visible: (id) => QuestionOverride.visible(overrides.get(id))
    };
  }

  /**
   * Get exercises without answers (for client): only the questions students
   * may be given now.
   */
  static async findByLessonIdForClient(lessonId) {
    const overrides = await QuestionOverride.all();
    const exercises = (await this.findByLessonId(lessonId)).filter(e => QuestionOverride.visible(overrides.get(e.id)));

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
    if (!exercise) return null;
    return QuestionOverride.apply(exercise, await QuestionOverride.get(id));
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

    const isCorrect = isCorrectAnswer(exercise, userAnswer);

    return {
      isCorrect,
      correctAnswer: exercise.correct_answer,
      explanationHe: exercise.explanation_he,
      explanationEn: exercise.explanation_en,
      explanationPicture: exercise.explanation_picture || null
    };
  }
}

module.exports = Exercise;
