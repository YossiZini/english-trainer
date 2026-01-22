const { db, withTransaction } = require('../config/database');
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
    let challenge = db.findOne('daily_challenges', { challenge_date: today });

    if (!challenge) {
      // Generate new challenge
      challenge = await this.generateDailyChallenge(today);
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
    const userProgress = db.findOne('user_daily_challenges', {
      user_id: userId,
      challenge_id: challenge.id
    });

    if (userProgress) {
      return {
        ...challenge,
        ...userProgress
      };
    }

    // Create initial progress record
    db.insert('user_daily_challenges', {
      user_id: userId,
      challenge_id: challenge.id,
      progress: 0,
      completed: false,
      completed_at: null
    });

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
    let currentProgress = db.findOne('user_daily_challenges', {
      user_id: userId,
      challenge_id: challenge.id
    });

    if (!currentProgress) {
      // Create progress record
      currentProgress = db.insert('user_daily_challenges', {
        user_id: userId,
        challenge_id: challenge.id,
        progress: progressIncrement,
        completed: false,
        completed_at: null
      });
      return { completed: false, progress: progressIncrement };
    }

    // If already completed, don't update
    if (currentProgress.completed) {
      return { completed: true, alreadyCompleted: true };
    }

    return withTransaction(async () => {
      // Update progress
      const newProgress = currentProgress.progress + progressIncrement;
      const isCompleted = newProgress >= challenge.challenge_target;

      db.updateById('user_daily_challenges', currentProgress.id, {
        progress: newProgress,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      });

      // If completed, award bonus points
      if (isCompleted && !currentProgress.completed) {
        await User.addPoints(userId, challenge.points_reward);
      }

      return {
        completed: isCompleted,
        newlyCompleted: isCompleted && !currentProgress.completed,
        progress: newProgress,
        target: challenge.challenge_target,
        pointsAwarded: isCompleted ? challenge.points_reward : 0
      };
    });
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

    const newChallenge = db.insert('daily_challenges', {
      challenge_date: date,
      challenge_type: challenge.type,
      challenge_target: target,
      title_en,
      title_he,
      description_en: desc_en,
      description_he: desc_he,
      points_reward: points,
      icon: challenge.icon
    });

    return newChallenge;
  }

  /**
   * Check and update challenge progress based on activity
   */
  static async checkChallengeProgress(userId, activityType, value = 1) {
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
    const today = new Date().toISOString().split('T')[0];

    // Get all challenges up to today
    const challenges = db.find('daily_challenges', {
      challenge_date: { $lte: today }
    }, {
      sort: { challenge_date: 'desc' },
      limit
    });

    // Get user progress for these challenges
    const userProgress = db.find('user_daily_challenges', { user_id: userId });
    const progressMap = new Map(userProgress.map(up => [up.challenge_id, up]));

    return challenges.map(dc => {
      const udc = progressMap.get(dc.id);
      return {
        ...dc,
        progress: udc?.progress || 0,
        completed: udc?.completed || false,
        completed_at: udc?.completed_at || null
      };
    });
  }

  /**
   * Get challenge completion stats
   */
  static async getChallengeStats(userId) {
    const today = new Date().toISOString().split('T')[0];

    // Get all challenges up to today
    const challenges = db.find('daily_challenges', {
      challenge_date: { $lte: today }
    });

    // Get user's completed challenges
    const userProgress = db.find('user_daily_challenges', {
      user_id: userId,
      completed: true
    });

    const total = challenges.length;
    const completed = userProgress.length;

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
}

module.exports = DailyChallengeService;
