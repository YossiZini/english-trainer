const UserProgress = require('../models/UserProgress');
const WrongAnswer = require('../models/WrongAnswer');
const GamificationService = require('./gamification.service');
const User = require('../models/User');
const { db } = require('../config/database');
// Subjects shown side by side on the home page, in display order.
const { SUBJECTS } = require('../config/subjects');

class ProgressService {
  /**
   * Home page data. Shared scores (stats, streak, points, level, mistakes)
   * cover every subject; `subjects` holds each subject's next lesson,
   * completion and last activity. The top-level `nextLesson`/`completion`
   * are kept for sites deployed before the per-subject home page.
   */
  static async getDashboardData(userId) {
    // Independent reads, all at once: the student's progress and results
    // (read once; the overall figures and each subject's are worked out from
    // them), mistake statistics, points and level, today's streak and points.
    const [progress, results, mistakeStats, gamification, dailyStats] = await Promise.all([
      UserProgress.progressRows(userId),
      UserProgress.resultRows(userId),
      WrongAnswer.getStatistics(userId),
      GamificationService.getUserGamificationStatus(userId),
      User.getDailyStats(userId)
    ]);
    const stats = UserProgress.overallStatsFrom(progress);
    const completion = UserProgress.completionFrom(progress);
    const nextLesson = UserProgress.nextLessonFrom(progress);
    const recentActivity = UserProgress.recentActivityFrom(results, 5);

    // Per subject: where to continue and how far along the student is
    const subjects = {};
    for (const subject of SUBJECTS) {
      subjects[subject] = {
        nextLesson: UserProgress.nextLessonFrom(progress, { subject }),
        completion: UserProgress.completionFrom(progress, { subject }),
        lastActivity: UserProgress.recentActivityFrom(results, 1, { subject })[0] || null
      };
    }

    return {
      stats: {
        ...stats,
        average_score: Math.round(parseFloat(stats.average_score))
      },
      completion,
      nextLesson,
      recentActivity,
      mistakeStats,
      gamification,
      dailyStats,
      subjects
    };
  }

  /**
   * Get detailed progress data
   */
  static async getDetailedProgress(userId) {
    // The student's progress is read once; every figure is worked out from it.
    const progress = await UserProgress.progressRows(userId);
    const allProgress = UserProgress.allProgressFrom(progress);
    const byTopic = UserProgress.progressByTopicFrom(progress);
    const stats = UserProgress.overallStatsFrom(progress);
    const completion = UserProgress.completionFrom(progress);

    return {
      allProgress,
      byTopic: byTopic.map(topic => ({
        ...topic,
        average_score: Math.round(parseFloat(topic.average_score)),
        completion_percentage: topic.total_lessons > 0
          ? Math.round((parseInt(topic.completed_count) / parseInt(topic.total_lessons)) * 100)
          : 0
      })),
      stats: {
        ...stats,
        average_score: Math.round(parseFloat(stats.average_score))
      },
      completion
    };
  }

  /**
   * Get progress for a specific lesson
   */
  static async getLessonProgress(userId, lessonId) {
    const progress = await UserProgress.getProgress(userId, lessonId);

    if (!progress) {
      return null;
    }

    // Get attempt history for this lesson
    const results = await db.find('exercise_results', { user_id: userId, lesson_id: lessonId });

    // Sort by attempt_number descending
    results.sort((a, b) => (b.attempt_number || 0) - (a.attempt_number || 0));

    const attemptsHistory = results.map(r => ({
      id: r.id,
      attempt_number: r.attempt_number,
      score: r.score,
      total_questions: r.total_questions,
      correct_answers: r.correct_answers,
      wrong_answers: r.wrong_answers,
      time_spent: r.time_spent,
      completed_at: r.completed_at
    }));

    return {
      ...progress,
      attempts_history: attemptsHistory
    };
  }

  /**
   * Get statistics for charts
   */
  static async getChartStats(userId) {
    // Score progression over time
    const exerciseResults = await db.find('exercise_results', { user_id: userId });

    // Group by date and calculate averages
    const dateStats = new Map();
    for (const result of exerciseResults) {
      if (!result.completed_at) continue;
      const date = result.completed_at.split('T')[0];
      if (!dateStats.has(date)) {
        dateStats.set(date, { scores: [], count: 0 });
      }
      dateStats.get(date).scores.push(result.score || 0);
      dateStats.get(date).count++;
    }

    const scoreProgression = Array.from(dateStats.entries())
      .map(([date, data]) => ({
        date,
        average_score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        attempts: data.count
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    // Lessons completed per topic
    const lessons = db.getCollection('lessons', true);
    const userProgress = await db.find('user_progress', { user_id: userId });
    const progressMap = new Map(userProgress.map(p => [p.lesson_id, p]));

    // Group by topic
    const topicStats = new Map();
    for (const lesson of lessons) {
      const topic = lesson.topic_number;
      if (!topicStats.has(topic)) {
        topicStats.set(topic, { total: 0, completed: 0 });
      }
      topicStats.get(topic).total++;

      const progress = progressMap.get(lesson.id);
      if (progress && progress.status === 'completed') {
        topicStats.get(topic).completed++;
      }
    }

    const topicsCompletion = Array.from(topicStats.entries())
      .map(([topic_number, data]) => ({
        topic_number,
        completed: data.completed,
        total: data.total,
        percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
      }))
      .sort((a, b) => a.topic_number - b.topic_number);

    return {
      scoreProgression,
      topicsCompletion
    };
  }
}

module.exports = ProgressService;
