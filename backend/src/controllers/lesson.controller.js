const LessonService = require('../services/lesson.service');

class LessonController {
  /**
   * Get all lessons with user progress
   * GET /api/lessons
   */
  static async getAllLessons(req, res) {
    try {
      const { level, topicNumber } = req.query;
      const userId = req.userId;

      const filters = {};
      if (level) filters.level = level;
      if (topicNumber) filters.topicNumber = parseInt(topicNumber);

      const lessons = await LessonService.getAllLessons(userId, filters);

      res.status(200).json({
        success: true,
        data: lessons
      });
    } catch (error) {
      console.error('Get lessons error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch lessons'
      });
    }
  }

  /**
   * Get single lesson with full content
   * GET /api/lessons/:id
   */
  static async getLessonById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const lesson = await LessonService.getLessonById(id, userId);

      res.status(200).json({
        success: true,
        data: lesson
      });
    } catch (error) {
      console.error('Get lesson error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Lesson not found'
      });
    }
  }

  /**
   * Get exercises for a lesson
   * GET /api/lessons/:id/exercises
   */
  static async getExercises(req, res) {
    try {
      const { id } = req.params;
      const { difficulty } = req.query;
      const userId = req.userId;

      const exercises = await LessonService.getExercises(id, userId, difficulty);

      res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Get exercises error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Exercises not found'
      });
    }
  }
}

module.exports = LessonController;
