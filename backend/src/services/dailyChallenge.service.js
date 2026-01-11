const { pool } = require('../config/database');
const User = require('../models/User');

/**
 * Daily Challenge Service
 * Handles daily challenge generation, progress tracking, and completion
 */
class DailyChallengeService {
  /**
   * Get today's challenge, creating one if it doesn't exist
   */
  static async getTodayChallenge() {
    const today = new Date().toISOString().split('T')[0];

    // Check if challenge exists for today
    let challenge = await pool.query(
      'SELECT * FROM daily_challenges WHERE challenge_date = $1',
      [today]
    );

    if (challenge.rows.length === 0) {
      // Generate new challenge
      challenge = await this.generateDailyChallenge(today);
    } else {
      challenge = challenge.rows[0];
    }

    return challenge;
  }

  /**
   * Get user's progress on today's challenge
   */
  static async getUserChallengeProgress(userId) {
    const today = new Date().toISOString().split('T')[0];

    // Get today's challenge
    const challenge = await this.getTodayChallenge();

    // Get user progress
    const progressResult = await pool.query(
      `SELECT udc.*, dc.*
       FROM user_daily_challenges udc
       JOIN daily_challenges dc ON udc.challenge_id = dc.id
       WHERE udc.user_id = $1 AND dc.challenge_date = $2`,
      [userId, today]
    );

    if (progressResult.rows.length > 0) {
      return progressResult.rows[0];
    }

    // Create initial progress record
    await pool.query(
      `INSERT INTO user_daily_challenges (user_id, challenge_id, progress, completed)
       VALUES ($1, $2, 0, false)`,
      [userId, challenge.id]
    );

    return {
      ...challenge,
      progress: 0,
      completed: false,
      completed_at: null
    };
  }

  /**
   * Update user's progress on today's challenge
   */
  static async updateChallengeProgress(userId, progressIncrement = 1) {
    const today = new Date().toISOString().split('T')[0];
    const challenge = await this.getTodayChallenge();

    // Get current progress
    const currentProgress = await pool.query(
      `SELECT udc.*, dc.challenge_target, dc.points_reward
       FROM user_daily_challenges udc
       JOIN daily_challenges dc ON udc.challenge_id = dc.id
       WHERE udc.user_id = $1 AND dc.challenge_date = $2`,
      [userId, today]
    );

    if (currentProgress.rows.length === 0) {
      // Create progress record
      await pool.query(
        `INSERT INTO user_daily_challenges (user_id, challenge_id, progress)
         VALUES ($1, $2, $3)`,
        [userId, challenge.id, progressIncrement]
      );
      return { completed: false, progress: progressIncrement };
    }

    const current = currentProgress.rows[0];

    // If already completed, don't update
    if (current.completed) {
      return { completed: true, alreadyCompleted: true };
    }

    // Update progress
    const newProgress = current.progress + progressIncrement;
    const isCompleted = newProgress >= current.challenge_target;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update progress
      await client.query(
        `UPDATE user_daily_challenges
         SET progress = $1,
             completed = $2,
             completed_at = CASE WHEN $2 THEN CURRENT_TIMESTAMP ELSE NULL END
         WHERE user_id = $3 AND challenge_id = $4`,
        [newProgress, isCompleted, userId, challenge.id]
      );

      // If completed, award bonus points
      if (isCompleted && !current.completed) {
        await User.addPoints(userId, current.points_reward);
      }

      await client.query('COMMIT');

      return {
        completed: isCompleted,
        newlyCompleted: isCompleted && !current.completed,
        progress: newProgress,
        target: current.challenge_target,
        pointsAwarded: isCompleted ? current.points_reward : 0
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Generate a new daily challenge
   */
  static async generateDailyChallenge(date) {
    const challengeTypes = [
      {
        type: 'complete_lessons',
        targets: [1, 2, 3],
        titleTemplate: { en: 'Complete {target} lessons', he: 'השלם {target} שיעורים' },
        descTemplate: { en: 'Complete {target} lessons today', he: 'השלם {target} שיעורים היום' },
        icon: '📚',
        points: [10, 15, 20]
      },
      {
        type: 'perfect_score',
        targets: [1, 2],
        titleTemplate: { en: 'Perfect Score Challenge', he: 'אתגר ציון מושלם' },
        descTemplate: { en: 'Get {target} perfect scores (100%)', he: 'השג {target} ציונים מושלמים (100%)' },
        icon: '💯',
        points: [15, 25]
      },
      {
        type: 'practice_time',
        targets: [10, 15, 20],
        titleTemplate: { en: 'Practice Time', he: 'זמן תרגול' },
        descTemplate: { en: 'Practice for {target} minutes', he: 'תרגל למשך {target} דקות' },
        icon: '⏱️',
        points: [10, 15, 20]
      },
      {
        type: 'correct_answers',
        targets: [10, 15, 20],
        titleTemplate: { en: 'Answer Streak', he: 'רצף תשובות' },
        descTemplate: { en: 'Answer {target} questions correctly', he: 'ענה נכון על {target} שאלות' },
        icon: '✅',
        points: [10, 15, 20]
      },
      {
        type: 'mistakes_review',
        targets: [3, 5],
        titleTemplate: { en: 'Error Correction', he: 'תיקון טעויות' },
        descTemplate: { en: 'Review and correct {target} mistakes', he: 'סקור ותקן {target} טעויות' },
        icon: '🔧',
        points: [10, 15]
      }
    ];

    // Use date as seed for consistent daily challenges
    const dateNumber = parseInt(date.replace(/-/g, ''));
    const challengeIndex = dateNumber % challengeTypes.length;
    const challenge = challengeTypes[challengeIndex];

    const targetIndex = (dateNumber % challenge.targets.length);
    const target = challenge.targets[targetIndex];
    const points = challenge.points[targetIndex];

    const title_en = challenge.titleTemplate.en.replace('{target}', target);
    const title_he = challenge.titleTemplate.he.replace('{target}', target);
    const desc_en = challenge.descTemplate.en.replace('{target}', target);
    const desc_he = challenge.descTemplate.he.replace('{target}', target);

    const result = await pool.query(
      `INSERT INTO daily_challenges
       (challenge_date, challenge_type, challenge_target, title_en, title_he, description_en, description_he, points_reward, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [date, challenge.type, target, title_en, title_he, desc_en, desc_he, points, challenge.icon]
    );

    return result.rows[0];
  }

  /**
   * Check and update challenge progress based on activity
   */
  static async checkChallengeProgress(userId, activityType, value = 1) {
    const today = new Date().toISOString().split('T')[0];
    const challenge = await this.getTodayChallenge();

    // Map activity types to challenge types
    const activityMapping = {
      'lesson_completed': 'complete_lessons',
      'perfect_score': 'perfect_score',
      'practice_minute': 'practice_time',
      'correct_answer': 'correct_answers',
      'mistake_reviewed': 'mistakes_review'
    };

    const mappedType = activityMapping[activityType];

    if (mappedType === challenge.challenge_type) {
      return await this.updateChallengeProgress(userId, value);
    }

    return { updated: false };
  }

  /**
   * Get challenge history for a user
   */
  static async getChallengeHistory(userId, limit = 7) {
    const query = `
      SELECT dc.*, udc.progress, udc.completed, udc.completed_at
      FROM daily_challenges dc
      LEFT JOIN user_daily_challenges udc
        ON dc.id = udc.challenge_id AND udc.user_id = $1
      WHERE dc.challenge_date <= CURRENT_DATE
      ORDER BY dc.challenge_date DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Get challenge completion stats
   */
  static async getChallengeStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_challenges,
        COUNT(CASE WHEN udc.completed = true THEN 1 END) as completed_count
      FROM daily_challenges dc
      LEFT JOIN user_daily_challenges udc
        ON dc.id = udc.challenge_id AND udc.user_id = $1
      WHERE dc.challenge_date <= CURRENT_DATE
    `;

    const result = await pool.query(query, [userId]);
    const stats = result.rows[0];

    return {
      total: parseInt(stats.total_challenges),
      completed: parseInt(stats.completed_count),
      percentage: stats.total_challenges > 0
        ? Math.round((parseInt(stats.completed_count) / parseInt(stats.total_challenges)) * 100)
        : 0
    };
  }
}

module.exports = DailyChallengeService;
