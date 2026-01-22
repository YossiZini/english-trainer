const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const UserProgress = require('../models/UserProgress');
const { db } = require('../config/database');
const { shuffleArray } = require('../utils/shuffle');

class LessonService {
  /**
   * Get all lessons with user progress
   */
  static async getAllLessons(userId, filters = {}) {
    const lessons = await Lesson.findAllWithProgress(userId, filters);

    // Get difficulty scores for all lessons
    const exerciseResults = db.find('exercise_results', { user_id: userId });

    // Build a map of lesson_id -> difficulty -> {score, attempts}
    const difficultyScoresMap = {};
    for (const result of exerciseResults) {
      if (!difficultyScoresMap[result.lesson_id]) {
        difficultyScoresMap[result.lesson_id] = {};
      }
      const difficulty = result.difficulty || 'easy';
      if (!difficultyScoresMap[result.lesson_id][difficulty]) {
        difficultyScoresMap[result.lesson_id][difficulty] = { score: 0, attempts: 0 };
      }
      const current = difficultyScoresMap[result.lesson_id][difficulty];
      current.score = Math.max(current.score, result.score || 0);
      current.attempts++;
    }

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
    const progressResult = await UserProgress.getProgress(userId, lessonId);
    const progress = progressResult || {
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
      const progress = await UserProgress.getProgress(userId, lessonId);

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

    // Shuffle exercises randomly using proper shuffle
    selectedExercises = shuffleArray(selectedExercises);

    // Take first 10 exercises
    selectedExercises = selectedExercises.slice(0, Math.min(10, selectedExercises.length));

    // Renumber questions sequentially and shuffle options for each exercise
    selectedExercises = selectedExercises.map((ex, index) => ({
      id: ex.id,
      question_number: index + 1,
      type: ex.type,
      question_text_he: ex.question_text_he,
      question_text_en: ex.question_text_en,
      options: ex.type === 'multiple_choice' && ex.options ? shuffleArray(ex.options) : ex.options,
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

    const progress = await UserProgress.getProgress(userId, previousLesson.id);

    // Previous lesson must be completed with at least 70% score
    return progress && progress.status === 'completed' && progress.best_score >= 70;
  }
}

module.exports = LessonService;
