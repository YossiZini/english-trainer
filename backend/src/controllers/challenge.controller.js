const DailyChallengeService = require('../services/dailyChallenge.service');

/**
 * Challenge Controller
 * Handles HTTP requests for daily challenge operations
 */
class ChallengeController {
  /**
   * Get today's challenge
   * GET /api/challenges/today
   */
  static async getTodayChallenge(req, res, next) {
    try {
      const challenge = await DailyChallengeService.getTodayChallenge();

      res.json({
        success: true,
        data: challenge
      });
    } catch (error) {
      console.error('Error getting today\'s challenge:', error);
      next(error);
    }
  }

  /**
   * Get user's challenge progress for today
   * GET /api/challenges/progress
   */
  static async getChallengeProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const progress = await DailyChallengeService.getUserChallengeProgress(userId);

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error getting challenge progress:', error);
      next(error);
    }
  }

  /**
   * Get challenge history
   * GET /api/challenges/history
   */
  static async getChallengeHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 7;
      const history = await DailyChallengeService.getChallengeHistory(userId, limit);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error getting challenge history:', error);
      next(error);
    }
  }

  /**
   * Get challenge statistics
   * GET /api/challenges/stats
   */
  static async getChallengeStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await DailyChallengeService.getChallengeStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting challenge stats:', error);
      next(error);
    }
  }
}

module.exports = ChallengeController;
