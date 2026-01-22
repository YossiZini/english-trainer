const UserProgress = require('../models/UserProgress');
const WrongAnswer = require('../models/WrongAnswer');
const GamificationService = require('./gamification.service');
const User = require('../models/User');
const { db } = require('../config/database');

class ProgressService {
  /**
   * Get dashboard data for a user
   */
  static async getDashboardData(userId) {
    // Get overall stats
    const stats = await UserProgress.getOverallStats(userId);

    // Get completion percentage
    const completion = await UserProgress.getCompletionPercentage(userId);

    // Get next lesson
    const nextLesson = await UserProgress.getNextLesson(userId);

    // Get recent activity
    const recentActivity = await UserProgress.getRecentActivity(userId, 5);

    // Get mistake statistics
    const mistakeStats = await WrongAnswer.getStatistics(userId);

    // Get gamification data
    const gamification = await GamificationService.getUserGamificationStatus(userId);

    // Get daily stats (streak and points today)
    const dailyStats = await User.getDailyStats(userId);

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
      dailyStats
    };
  }

  /**
   * Get detailed progress data
   */
  static async getDetailedProgress(userId) {
    // Get all progress
    const allProgress = await UserProgress.getAllProgress(userId);

    // Get progress by topic
    const byTopic = await UserProgress.getProgressByTopic(userId);

    // Get overall stats
    const stats = await UserProgress.getOverallStats(userId);

    // Get completion percentage
    const completion = await UserProgress.getCompletionPercentage(userId);

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
    const results = db.find('exercise_results', { user_id: userId, lesson_id: lessonId });

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
    const exerciseResults = db.find('exercise_results', { user_id: userId });

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
    const userProgress = db.find('user_progress', { user_id: userId });
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
