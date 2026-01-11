const ProgressService = require('../services/progress.service');

class ProgressController {
  /**
   * Get dashboard data
   * GET /api/progress/dashboard
   */
  static async getDashboard(req, res) {
    try {
      const userId = req.userId;

      const data = await ProgressService.getDashboardData(userId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get dashboard data'
      });
    }
  }

  /**
   * Get detailed progress
   * GET /api/progress
   */
  static async getProgress(req, res) {
    try {
      const userId = req.userId;

      const data = await ProgressService.getDetailedProgress(userId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get progress'
      });
    }
  }

  /**
   * Get progress for a specific lesson
   * GET /api/progress/lessons/:lessonId
   */
  static async getLessonProgress(req, res) {
    try {
      const { lessonId } = req.params;
      const userId = req.userId;

      const data = await ProgressService.getLessonProgress(userId, lessonId);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Progress not found'
        });
      }

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get lesson progress error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get lesson progress'
      });
    }
  }

  /**
   * Get chart statistics
   * GET /api/progress/stats
   */
  static async getChartStats(req, res) {
    try {
      const userId = req.userId;

      const data = await ProgressService.getChartStats(userId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get chart stats error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get chart stats'
      });
    }
  }
}

module.exports = ProgressController;
