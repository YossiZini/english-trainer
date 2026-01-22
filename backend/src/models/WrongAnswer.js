const { db } = require('../config/database');

class WrongAnswer {
  /**
   * Get all wrong answers for a specific lesson and user
   */
  static async findByUserAndLesson(userId, lessonId, onlyUncorrected = false) {
    let criteria = { user_id: userId, lesson_id: lessonId };

    if (onlyUncorrected) {
      criteria.is_corrected = false;
    }

    const wrongAnswers = db.find('wrong_answers', criteria);

    // Get exercises for joining
    const exercises = db.getCollection('exercises', true);
    const exerciseMap = new Map(exercises.map(e => [e.id, e]));

    // Join with exercises and sort
    const result = wrongAnswers.map(wa => {
      const exercise = exerciseMap.get(wa.exercise_id);
      return {
        id: wa.id,
        user_id: wa.user_id,
        lesson_id: wa.lesson_id,
        exercise_id: wa.exercise_id,
        user_answer: wa.user_answer,
        correct_answer: wa.correct_answer,
        attempt_number: wa.attempt_number,
        is_reviewed: wa.is_reviewed,
        is_corrected: wa.is_corrected,
        created_at: wa.created_at,
        corrected_at: wa.corrected_at,
        question_text_he: exercise?.question_text_he,
        question_number: exercise?.question_number,
        type: exercise?.type,
        options: exercise?.options,
        explanation_he: exercise?.explanation_he,
        explanation_en: exercise?.explanation_en
      };
    });

    // Sort by question_number
    result.sort((a, b) => (a.question_number || 0) - (b.question_number || 0));

    return result;
  }

  /**
   * Get all wrong answers for a user (all lessons)
   */
  static async findByUser(userId, onlyUncorrected = false) {
    let criteria = { user_id: userId };

    if (onlyUncorrected) {
      criteria.is_corrected = false;
    }

    const wrongAnswers = db.find('wrong_answers', criteria);

    // Get exercises and lessons for joining
    const exercises = db.getCollection('exercises', true);
    const exerciseMap = new Map(exercises.map(e => [e.id, e]));

    const lessons = db.getCollection('lessons', true);
    const lessonMap = new Map(lessons.map(l => [l.id, l]));

    // Join with exercises and lessons
    const result = wrongAnswers.map(wa => {
      const exercise = exerciseMap.get(wa.exercise_id);
      const lesson = lessonMap.get(wa.lesson_id);
      return {
        id: wa.id,
        user_id: wa.user_id,
        lesson_id: wa.lesson_id,
        exercise_id: wa.exercise_id,
        user_answer: wa.user_answer,
        correct_answer: wa.correct_answer,
        attempt_number: wa.attempt_number,
        is_reviewed: wa.is_reviewed,
        is_corrected: wa.is_corrected,
        created_at: wa.created_at,
        corrected_at: wa.corrected_at,
        question_text_he: exercise?.question_text_he,
        question_number: exercise?.question_number,
        type: exercise?.type,
        options: exercise?.options,
        explanation_he: exercise?.explanation_he,
        explanation_en: exercise?.explanation_en,
        lesson_title_he: lesson?.title_he,
        lesson_title_en: lesson?.title_en
      };
    });

    // Sort by created_at descending
    result.sort((a, b) => {
      if (!a.created_at) return 1;
      if (!b.created_at) return -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return result;
  }

  /**
   * Mark mistakes as reviewed
   */
  static async markAsReviewed(userId, lessonId) {
    const wrongAnswers = db.find('wrong_answers', {
      user_id: userId,
      lesson_id: lessonId,
      is_reviewed: false
    });

    let count = 0;
    for (const wa of wrongAnswers) {
      db.updateById('wrong_answers', wa.id, { is_reviewed: true });
      count++;
    }

    return count;
  }

  /**
   * Mark a single mistake as corrected
   */
  static async markAsCorrected(exerciseId, userId) {
    const wrongAnswers = db.find('wrong_answers', {
      exercise_id: exerciseId,
      user_id: userId,
      is_corrected: false
    });

    if (wrongAnswers.length === 0) {
      return false;
    }

    const timestamp = new Date().toISOString();
    for (const wa of wrongAnswers) {
      db.updateById('wrong_answers', wa.id, {
        is_corrected: true,
        corrected_at: timestamp
      });
    }

    return true;
  }

  /**
   * Get mistake statistics for a user
   */
  static async getStatistics(userId) {
    const wrongAnswers = db.find('wrong_answers', { user_id: userId });

    const stats = {
      total_mistakes: wrongAnswers.length,
      corrected_count: 0,
      uncorrected_count: 0,
      reviewed_count: 0
    };

    for (const wa of wrongAnswers) {
      if (wa.is_corrected) {
        stats.corrected_count++;
      } else {
        stats.uncorrected_count++;
      }
      if (wa.is_reviewed) {
        stats.reviewed_count++;
      }
    }

    return stats;
  }

  /**
   * Get mistakes grouped by lesson for a user
   */
  static async getMistakesByLesson(userId) {
    const wrongAnswers = db.find('wrong_answers', { user_id: userId });

    const lessons = db.getCollection('lessons', true);
    const lessonMap = new Map(lessons.map(l => [l.id, l]));

    // Group by lesson
    const lessonStats = new Map();

    for (const wa of wrongAnswers) {
      if (!lessonStats.has(wa.lesson_id)) {
        const lesson = lessonMap.get(wa.lesson_id);
        lessonStats.set(wa.lesson_id, {
          lesson_id: wa.lesson_id,
          title_he: lesson?.title_he,
          title_en: lesson?.title_en,
          subtopic_number: lesson?.subtopic_number,
          total_mistakes: 0,
          corrected_count: 0,
          uncorrected_count: 0
        });
      }

      const stat = lessonStats.get(wa.lesson_id);
      stat.total_mistakes++;
      if (wa.is_corrected) {
        stat.corrected_count++;
      } else {
        stat.uncorrected_count++;
      }
    }

    // Convert to array and sort by subtopic_number
    const result = Array.from(lessonStats.values());
    result.sort((a, b) => {
      const aNum = parseFloat(a.subtopic_number) || 0;
      const bNum = parseFloat(b.subtopic_number) || 0;
      return aNum - bNum;
    });

    return result;
  }

  /**
   * Delete all wrong answers for a specific exercise and user
   * (Used when user wants to reset their mistakes)
   */
  static async deleteByExerciseAndUser(exerciseId, userId) {
    const result = db.delete('wrong_answers', {
      exercise_id: exerciseId,
      user_id: userId
    });

    return result.deleted;
  }

  /**
   * Check if a user has any uncorrected mistakes for a lesson
   */
  static async hasUncorrectedMistakes(userId, lessonId) {
    const wrongAnswers = db.find('wrong_answers', {
      user_id: userId,
      lesson_id: lessonId,
      is_corrected: false
    });

    return wrongAnswers.length > 0;
  }

  /**
   * Create a new wrong answer record
   */
  static async create(data) {
    const wrongAnswer = db.insert('wrong_answers', {
      user_id: data.userId,
      lesson_id: data.lessonId,
      exercise_id: data.exerciseId,
      user_answer: data.userAnswer,
      correct_answer: data.correctAnswer,
      attempt_number: data.attemptNumber || 1,
      is_reviewed: false,
      is_corrected: false,
      created_at: new Date().toISOString()
    });

    return wrongAnswer;
  }
}

module.exports = WrongAnswer;
