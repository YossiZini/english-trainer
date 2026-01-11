const AchievementService = require('../services/achievement.service');

/**
 * Achievement Controller
 * Handles HTTP requests for achievement-related operations
 */
class AchievementController {
  /**
   * Get all achievements with user progress
   * GET /api/achievements
   */
  static async getUserAchievements(req, res, next) {
    try {
      const userId = req.user.id;
      const achievements = await AchievementService.getUserAchievements(userId);

      res.json({
        success: true,
        data: achievements
      });
    } catch (error) {
      console.error('Error getting user achievements:', error);
      next(error);
    }
  }

  /**
   * Get achievement statistics
   * GET /api/achievements/stats
   */
  static async getAchievementStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await AchievementService.getAchievementStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      next(error);
    }
  }

  /**
   * Get recently unlocked achievements
   * GET /api/achievements/recent
   */
  static async getRecentlyUnlocked(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 5;
      const recent = await AchievementService.getRecentlyUnlocked(userId, limit);

      res.json({
        success: true,
        data: recent
      });
    } catch (error) {
      console.error('Error getting recently unlocked achievements:', error);
      next(error);
    }
  }
}

module.exports = AchievementController;
