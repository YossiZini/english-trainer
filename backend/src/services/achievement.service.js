const { pool } = require('../config/database');
const User = require('../models/User');

/**
 * Achievement Service
 * Handles achievement checking, unlocking, and progress tracking
 */
class AchievementService {
  /**
   * Get all achievements with user progress
   */
  static async getUserAchievements(userId) {
    const query = `
      SELECT
        a.*,
        ua.unlocked_at,
        ua.progress,
        CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as unlocked
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      ORDER BY
        CASE a.tier
          WHEN 'bronze' THEN 1
          WHEN 'silver' THEN 2
          WHEN 'gold' THEN 3
          WHEN 'platinum' THEN 4
        END,
        a.requirement_value
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Check and unlock achievements for a user based on their stats
   */
  static async checkAndUnlockAchievements(userId) {
    // Get user stats
    const stats = await this.getUserStats(userId);

    // Get all achievements
    const achievements = await pool.query('SELECT * FROM achievements');

    const newlyUnlocked = [];

    for (const achievement of achievements.rows) {
      // Check if already unlocked
      const existingCheck = await pool.query(
        'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
        [userId, achievement.id]
      );

      if (existingCheck.rows.length > 0) {
        continue; // Already unlocked
      }

      // Check if requirements are met
      let requirementMet = false;
      let progress = 0;

      switch (achievement.requirement_type) {
        case 'lessons_completed':
          progress = stats.lessons_completed;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'perfect_score':
          progress = stats.perfect_scores;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'streak':
          progress = stats.current_streak;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'mistakes_corrected':
          progress = stats.mistakes_corrected;
          requirementMet = progress >= achievement.requirement_value;
          break;

        default:
          break;
      }

      // Update or create user achievement record with progress
      await pool.query(
        `INSERT INTO user_achievements (user_id, achievement_id, progress)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, achievement_id)
         DO UPDATE SET progress = $3`,
        [userId, achievement.id, progress]
      );

      // If requirement met, unlock it
      if (requirementMet) {
        await this.unlockAchievement(userId, achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Unlock a specific achievement for a user
   */
  static async unlockAchievement(userId, achievementId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Mark as unlocked
      await client.query(
        `UPDATE user_achievements
         SET unlocked_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND achievement_id = $2 AND unlocked_at IS NULL`,
        [userId, achievementId]
      );

      // Get achievement details
      const achievement = await client.query(
        'SELECT * FROM achievements WHERE id = $1',
        [achievementId]
      );

      // Award bonus points
      if (achievement.rows[0] && achievement.rows[0].points_reward > 0) {
        await User.addPoints(userId, achievement.rows[0].points_reward);
      }

      await client.query('COMMIT');

      return achievement.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user stats for achievement checking
   */
  static async getUserStats(userId) {
    // Lessons completed
    const lessonsResult = await pool.query(
      `SELECT COUNT(DISTINCT lesson_id) as count
       FROM user_progress
       WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );

    // Perfect scores (100%)
    const perfectScoresResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM exercise_results
       WHERE user_id = $1 AND score = 100`,
      [userId]
    );

    // Current streak
    const userResult = await pool.query(
      'SELECT current_streak FROM users WHERE id = $1',
      [userId]
    );

    // Mistakes corrected
    const mistakesResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM wrong_answers
       WHERE user_id = $1 AND is_reviewed = true`,
      [userId]
    );

    return {
      lessons_completed: parseInt(lessonsResult.rows[0].count),
      perfect_scores: parseInt(perfectScoresResult.rows[0].count),
      current_streak: userResult.rows[0]?.current_streak || 0,
      mistakes_corrected: parseInt(mistakesResult.rows[0].count)
    };
  }

  /**
   * Get recently unlocked achievements
   */
  static async getRecentlyUnlocked(userId, limit = 5) {
    const query = `
      SELECT a.*, ua.unlocked_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1 AND ua.unlocked_at IS NOT NULL
      ORDER BY ua.unlocked_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get achievement statistics
   */
  static async getAchievementStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_achievements,
        COUNT(CASE WHEN ua.unlocked_at IS NOT NULL THEN 1 END) as unlocked_count
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const stats = result.rows[0];

    return {
      total: parseInt(stats.total_achievements),
      unlocked: parseInt(stats.unlocked_count),
      locked: parseInt(stats.total_achievements) - parseInt(stats.unlocked_count),
      percentage: stats.total_achievements > 0
        ? Math.round((parseInt(stats.unlocked_count) / parseInt(stats.total_achievements)) * 100)
        : 0
    };
  }
}

module.exports = AchievementService;
