const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const { pool } = require('../config/database');

class LessonService {
  /**
   * Get all lessons with user progress
   */
  static async getAllLessons(userId, filters = {}) {
    const lessons = await Lesson.findAllWithProgress(userId, filters);

    // Query to get best score per difficulty for each lesson
    const difficultyScoresQuery = `
      SELECT
        lesson_id,
        difficulty,
        MAX(score) as best_score,
        COUNT(*) as attempts
      FROM exercise_results
      WHERE user_id = $1
      GROUP BY lesson_id, difficulty
    `;
    const difficultyScoresResult = await pool.query(difficultyScoresQuery, [userId]);

    // Build a map of lesson_id -> difficulty -> {score, attempts}
    const difficultyScoresMap = {};
    difficultyScoresResult.rows.forEach(row => {
      if (!difficultyScoresMap[row.lesson_id]) {
        difficultyScoresMap[row.lesson_id] = {};
      }
      difficultyScoresMap[row.lesson_id][row.difficulty] = {
        score: parseInt(row.best_score),
        attempts: parseInt(row.attempts)
      };
    });

    // Group lessons by topic
    const groupedLessons = lessons.reduce((acc, lesson) => {
      const topicKey = lesson.topic_number;

      if (!acc[topicKey]) {
        acc[topicKey] = {
          topicNumber: lesson.topic_number,
          level: lesson.level,
          lessons: []
        };
      }

      // Get difficulty scores for this lesson
      const difficultyScores = {
        easy: difficultyScoresMap[lesson.id]?.easy || null,
        medium: difficultyScoresMap[lesson.id]?.medium || null,
        hard: difficultyScoresMap[lesson.id]?.hard || null
      };

      acc[topicKey].lessons.push({
        id: lesson.id,
        subtopicNumber: lesson.subtopic_number,
        titleEn: lesson.title_en,
        titleHe: lesson.title_he,
        level: lesson.level,
        orderIndex: lesson.order_index,
        progress: {
          status: lesson.status || 'not_started',
          bestScore: lesson.best_score || 0,
          attempts: lesson.attempts || 0,
          firstCompletedAt: lesson.first_completed_at,
          lastAttemptedAt: lesson.last_attempted_at,
          difficultyScores // Add per-difficulty scores
        }
      });

      return acc;
    }, {});

    return Object.values(groupedLessons);
  }

  /**
   * Get single lesson with full content
   */
  static async getLessonById(lessonId, userId) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Get user progress for this lesson
    const progressQuery = `
      SELECT status, best_score, attempts, first_completed_at, last_attempted_at
      FROM user_progress
      WHERE user_id = $1 AND lesson_id = $2
    `;

    const progressResult = await pool.query(progressQuery, [userId, lessonId]);
    const progress = progressResult.rows[0] || {
      status: 'not_started',
      best_score: 0,
      attempts: 0
    };

    // Get next and previous lessons
    const nextLesson = await Lesson.getNextLesson(lesson.order_index);
    const previousLesson = await Lesson.getPreviousLesson(lesson.order_index);

    return {
      id: lesson.id,
      topicNumber: lesson.topic_number,
      subtopicNumber: lesson.subtopic_number,
      titleEn: lesson.title_en,
      titleHe: lesson.title_he,
      level: lesson.level,
      orderIndex: lesson.order_index,
      theoryContentHe: lesson.theory_content_he,
      theoryContentEn: lesson.theory_content_en,
      progress,
      navigation: {
        next: nextLesson ? {
          id: nextLesson.id,
          titleHe: nextLesson.title_he,
          titleEn: nextLesson.title_en
        } : null,
        previous: previousLesson ? {
          id: previousLesson.id,
          titleHe: previousLesson.title_he,
          titleEn: previousLesson.title_en
        } : null
      }
    };
  }

  /**
   * Get exercises for a lesson (without answers)
   * Randomly selects exercises based on difficulty level
   */
  static async getExercises(lessonId, userId, manualDifficulty = null) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Use manual difficulty if provided, otherwise determine from progress
    let targetDifficulty;

    if (manualDifficulty && ['easy', 'medium', 'hard'].includes(manualDifficulty)) {
      // User manually selected difficulty
      targetDifficulty = manualDifficulty;
    } else {
      // Determine user's current difficulty level for this lesson based on progress
      const progressQuery = `
        SELECT best_score, attempts
        FROM user_progress
        WHERE user_id = $1 AND lesson_id = $2
      `;
      const progressResult = await pool.query(progressQuery, [userId, lessonId]);
      const progress = progressResult.rows[0];

      // Determine difficulty level based on progress
      if (!progress || progress.attempts === 0) {
        // First attempt - start with easy
        targetDifficulty = 'easy';
      } else if (progress.best_score >= 80) {
        // High score - suggest hard
        targetDifficulty = 'hard';
      } else if (progress.best_score >= 60) {
        // Medium score - suggest medium
        targetDifficulty = 'medium';
      } else {
        // Low score - suggest easy
        targetDifficulty = 'easy';
      }
    }

    // Get all exercises of target difficulty
    const allExercises = await Exercise.findByLessonIdForClient(lessonId);
    const targetExercises = allExercises.filter(ex => ex.difficulty === targetDifficulty);

    // If not enough exercises at target difficulty, include some from adjacent levels
    let selectedExercises = [...targetExercises];
    if (selectedExercises.length < 10) {
      const otherExercises = allExercises.filter(ex => ex.difficulty !== targetDifficulty);
      selectedExercises = [...selectedExercises, ...otherExercises];
    }

    // Shuffle exercises randomly
    selectedExercises = selectedExercises.sort(() => Math.random() - 0.5);

    // Take first 10 exercises
    selectedExercises = selectedExercises.slice(0, Math.min(10, selectedExercises.length));

    // Renumber questions sequentially
    selectedExercises = selectedExercises.map((ex, index) => ({
      id: ex.id,
      question_number: index + 1,
      type: ex.type,
      question_text_he: ex.question_text_he,
      question_text_en: ex.question_text_en,
      options: ex.options,
      difficulty: ex.difficulty
    }));

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title_he,
      currentDifficulty: targetDifficulty,
      totalQuestions: selectedExercises.length,
      exercises: selectedExercises
    };
  }

  /**
   * Check if user can access a lesson (unlocking logic)
   */
  static async canAccessLesson(userId, lessonId) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // First lesson is always accessible
    if (lesson.order_index === 1) {
      return true;
    }

    // Check if previous lesson is completed with passing score
    const previousLesson = await Lesson.getPreviousLesson(lesson.order_index);

    if (!previousLesson) {
      return true; // No previous lesson, allow access
    }

    const progressQuery = `
      SELECT status, best_score
      FROM user_progress
      WHERE user_id = $1 AND lesson_id = $2
    `;

    const result = await pool.query(progressQuery, [userId, previousLesson.id]);
    const progress = result.rows[0];

    // Previous lesson must be completed with at least 70% score
    return progress && progress.status === 'completed' && progress.best_score >= 70;
  }
}

module.exports = LessonService;
