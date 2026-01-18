const ExerciseService = require('../services/exercise.service');

class ExerciseController {
  /**
   * Check a single answer (immediate feedback)
   * POST /api/exercises/check
   */
  static async checkAnswer(req, res) {
    try {
      const { exerciseId, userAnswer } = req.body;

      if (!exerciseId || userAnswer === undefined || userAnswer === null) {
        return res.status(400).json({
          success: false,
          message: 'Exercise ID and user answer are required'
        });
      }

      const result = await ExerciseService.checkAnswer(exerciseId, userAnswer);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Check answer error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to check answer'
      });
    }
  }

  /**
   * Submit complete exercise
   * POST /api/exercises/submit
   */
  static async submitExercise(req, res) {
    try {
      const { lessonId, answers, timeSpent, difficulty } = req.body;
      const userId = req.userId;

      if (!lessonId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Lesson ID and answers array are required'
        });
      }

      if (!timeSpent || timeSpent < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid time spent is required'
        });
      }

      const result = await ExerciseService.submitExercise(
        userId,
        lessonId,
        answers,
        timeSpent,
        difficulty || 'easy'
      );

      res.status(200).json({
        success: true,
        message: 'Exercise submitted successfully',
        data: result
      });
    } catch (error) {
      console.error('Submit exercise error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit exercise'
      });
    }
  }

  /**
   * Get result by ID
   * GET /api/exercises/results/:id
   */
  static async getResult(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const result = await ExerciseService.getResultById(id, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Result not found'
        });
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get result error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get result'
      });
    }
  }
}

module.exports = ExerciseController;
