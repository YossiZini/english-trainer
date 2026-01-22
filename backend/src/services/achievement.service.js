const { db, withTransaction } = require('../config/database');
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
    const achievements = db.getCollection('achievements', true);
    const userAchievements = db.find('user_achievements', { user_id: userId });
    const uaMap = new Map(userAchievements.map(ua => [ua.achievement_id, ua]));

    const result = achievements.map(a => {
      const ua = uaMap.get(a.id);
      return {
        ...a,
        unlocked_at: ua?.unlocked_at || null,
        progress: ua?.progress || 0,
        unlocked: ua?.unlocked_at ? true : false
      };
    });

    // Sort by tier and requirement_value
    const tierOrder = { 'bronze': 1, 'silver': 2, 'gold': 3, 'platinum': 4 };
    result.sort((a, b) => {
      const tierDiff = (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
      if (tierDiff !== 0) return tierDiff;
      return (a.requirement_value || 0) - (b.requirement_value || 0);
    });

    return result;
  }

  /**
   * Check and unlock achievements for a user based on their stats
   */
  static async checkAndUnlockAchievements(userId) {
    // Get user stats
    const stats = await this.getUserStats(userId);

    // Get all achievements
    const achievements = db.getCollection('achievements', true);

    const newlyUnlocked = [];

    for (const achievement of achievements) {
      // Check if already unlocked
      const existing = db.findOne('user_achievements', {
        user_id: userId,
        achievement_id: achievement.id
      });

      if (existing && existing.unlocked_at) {
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
        case 'streak_days':
          progress = stats.current_streak;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'mistakes_corrected':
        case 'mistakes_fixed':
          progress = stats.mistakes_corrected;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'words_learned':
          progress = stats.words_learned || 0;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'quizzes_completed':
          progress = stats.quizzes_completed || 0;
          requirementMet = progress >= achievement.requirement_value;
          break;

        case 'time_spent':
          progress = stats.time_spent || 0;
          requirementMet = progress >= achievement.requirement_value;
          break;

        default:
          break;
      }

      // Update or create user achievement record with progress
      if (existing) {
        db.updateById('user_achievements', existing.id, { progress });
      } else {
        db.insert('user_achievements', {
          user_id: userId,
          achievement_id: achievement.id,
          progress,
          unlocked_at: null
        });
      }

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
    return withTransaction(async () => {
      // Find user achievement record
      const ua = db.findOne('user_achievements', {
        user_id: userId,
        achievement_id: achievementId
      });

      if (!ua) {
        // Create and unlock
        db.insert('user_achievements', {
          user_id: userId,
          achievement_id: achievementId,
          progress: 0,
          unlocked_at: new Date().toISOString()
        });
      } else if (!ua.unlocked_at) {
        // Mark as unlocked
        db.updateById('user_achievements', ua.id, {
          unlocked_at: new Date().toISOString()
        });
      }

      // Get achievement details
      const achievement = db.findById('achievements', achievementId);

      // Award bonus points
      if (achievement && achievement.points_reward > 0) {
        await User.addPoints(userId, achievement.points_reward);
      }

      return achievement;
    });
  }

  /**
   * Get user stats for achievement checking
   */
  static async getUserStats(userId) {
    // Lessons completed
    const userProgress = db.find('user_progress', { user_id: userId, status: 'completed' });
    const lessonsCompleted = new Set(userProgress.map(up => up.lesson_id)).size;

    // Perfect scores (100%)
    const exerciseResults = db.find('exercise_results', { user_id: userId });
    const perfectScores = exerciseResults.filter(er => er.score === 100).length;

    // Current streak
    const user = db.findById('users', userId);
    const currentStreak = user?.current_streak || 0;

    // Mistakes corrected (reviewed)
    const wrongAnswers = db.find('wrong_answers', { user_id: userId, is_reviewed: true });
    const mistakesCorrected = wrongAnswers.length;

    // Words learned
    const wordScores = db.find('vocabulary_word_scores', { user_id: userId, mastery_level: 'mastered' });
    const wordsLearned = wordScores.length;

    // Quizzes completed
    const quizSessions = db.find('vocabulary_quiz_sessions', { user_id: userId, status: 'completed' });
    const quizzesCompleted = quizSessions.length;

    // Total time spent
    const totalTimeSpent = userProgress.reduce((sum, up) => sum + (up.time_spent || 0), 0);

    return {
      lessons_completed: lessonsCompleted,
      perfect_scores: perfectScores,
      current_streak: currentStreak,
      mistakes_corrected: mistakesCorrected,
      words_learned: wordsLearned,
      quizzes_completed: quizzesCompleted,
      time_spent: totalTimeSpent
    };
  }

  /**
   * Get recently unlocked achievements
   */
  static async getRecentlyUnlocked(userId, limit = 5) {
    const userAchievements = db.find('user_achievements', { user_id: userId });
    const achievements = db.getCollection('achievements', true);
    const achievementMap = new Map(achievements.map(a => [a.id, a]));

    const unlocked = userAchievements
      .filter(ua => ua.unlocked_at)
      .map(ua => ({
        ...achievementMap.get(ua.achievement_id),
        unlocked_at: ua.unlocked_at
      }))
      .filter(a => a.id); // Filter out any nulls

    // Sort by unlocked_at descending
    unlocked.sort((a, b) => new Date(b.unlocked_at) - new Date(a.unlocked_at));

    return unlocked.slice(0, limit);
  }

  /**
   * Get achievement statistics
   */
  static async getAchievementStats(userId) {
    const achievements = db.getCollection('achievements', true);
    const userAchievements = db.find('user_achievements', { user_id: userId });

    const unlockedCount = userAchievements.filter(ua => ua.unlocked_at).length;
    const total = achievements.length;

    return {
      total,
      unlocked: unlockedCount,
      locked: total - unlockedCount,
      percentage: total > 0 ? Math.round((unlockedCount / total) * 100) : 0
    };
  }
}

module.exports = AchievementService;
