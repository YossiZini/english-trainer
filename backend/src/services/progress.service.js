const UserProgress = require('../models/UserProgress');
const WrongAnswer = require('../models/WrongAnswer');
const GamificationService = require('./gamification.service');

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

    return {
      stats: {
        ...stats,
        average_score: Math.round(parseFloat(stats.average_score))
      },
      completion,
      nextLesson,
      recentActivity,
      mistakeStats,
      gamification
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
    const { pool } = require('../config/database');
    const query = `
      SELECT
        id,
        attempt_number,
        score,
        total_questions,
        correct_answers,
        wrong_answers,
        time_spent,
        completed_at
      FROM exercise_results
      WHERE user_id = $1 AND lesson_id = $2
      ORDER BY attempt_number DESC
    `;

    const result = await pool.query(query, [userId, lessonId]);

    return {
      ...progress,
      attempts_history: result.rows
    };
  }

  /**
   * Get statistics for charts
   */
  static async getChartStats(userId) {
    const { pool } = require('../config/database');

    // Score progression over time
    const scoresQuery = `
      SELECT
        DATE(completed_at) as date,
        AVG(score) as average_score,
        COUNT(*) as attempts
      FROM exercise_results
      WHERE user_id = $1
      GROUP BY DATE(completed_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    const scoresResult = await pool.query(scoresQuery, [userId]);

    // Lessons completed per topic
    const topicsQuery = `
      SELECT
        l.topic_number,
        COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed,
        COUNT(*) as total
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      GROUP BY l.topic_number
      ORDER BY l.topic_number
    `;

    const topicsResult = await pool.query(topicsQuery, [userId]);

    return {
      scoreProgression: scoresResult.rows.map(row => ({
        date: row.date,
        average_score: Math.round(parseFloat(row.average_score)),
        attempts: parseInt(row.attempts)
      })),
      topicsCompletion: topicsResult.rows.map(row => ({
        topic_number: parseInt(row.topic_number),
        completed: parseInt(row.completed),
        total: parseInt(row.total),
        percentage: parseInt(row.total) > 0
          ? Math.round((parseInt(row.completed) / parseInt(row.total)) * 100)
          : 0
      }))
    };
  }
}

module.exports = ProgressService;
