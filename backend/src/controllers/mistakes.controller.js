const { validationResult } = require('express-validator');
const MistakesService = require('../services/mistakes.service');

/** 400 with the validation errors, or null when the request is valid. */
function invalid(req, res) {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : res.status(400).json({ success: false, errors: errors.array() });
}

class MistakesController {
  /**
   * Get mistakes for a specific lesson
   * GET /api/mistakes/lesson/:lessonId
   */
  static async getMistakesByLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const userId = req.userId;
      const onlyUncorrected = req.query.uncorrected === 'true';

      const mistakes = await MistakesService.getMistakesByLesson(userId, lessonId, onlyUncorrected);

      res.status(200).json({
        success: true,
        data: mistakes
      });
    } catch (error) {
      console.error('Get mistakes by lesson error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get mistakes'
      });
    }
  }

  /**
   * Get all mistakes for the user
   * GET /api/mistakes
   */
  static async getAllMistakes(req, res) {
    try {
      const userId = req.userId;
      const onlyUncorrected = req.query.uncorrected === 'true';

      const mistakes = await MistakesService.getAllMistakes(userId, onlyUncorrected);

      res.status(200).json({
        success: true,
        data: mistakes
      });
    } catch (error) {
      console.error('Get all mistakes error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get mistakes'
      });
    }
  }

  /**
   * Mark mistakes as reviewed
   * PUT /api/mistakes/lesson/:lessonId/reviewed
   */
  static async markAsReviewed(req, res) {
    try {
      const { lessonId } = req.params;
      const userId = req.userId;

      const result = await MistakesService.markMistakesAsReviewed(userId, lessonId);

      res.status(200).json({
        success: true,
        message: 'Mistakes marked as reviewed',
        data: result
      });
    } catch (error) {
      console.error('Mark as reviewed error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark mistakes as reviewed'
      });
    }
  }

  /**
   * Submit retry attempt
   * POST /api/mistakes/retry
   */
  static async submitRetry(req, res) {
    try {
      const { lessonId, answers } = req.body;
      const userId = req.userId;

      if (!lessonId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Lesson ID and answers array are required'
        });
      }

      const result = await MistakesService.submitRetry(userId, lessonId, answers);

      res.status(200).json({
        success: true,
        message: 'Retry submitted successfully',
        data: result
      });
    } catch (error) {
      console.error('Submit retry error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit retry'
      });
    }
  }

  /**
   * Get mistake statistics
   * GET /api/mistakes/stats
   */
  static async getStatistics(req, res) {
    try {
      const userId = req.userId;

      const stats = await MistakesService.getStatistics(userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get statistics'
      });
    }
  }

  /**
   * Get exercises for retry (only uncorrected mistakes)
   * GET /api/mistakes/lesson/:lessonId/exercises
   */
  static async getExercisesForRetry(req, res) {
    try {
      const { lessonId } = req.params;
      const userId = req.userId;

      const exercises = await MistakesService.getExercisesForRetry(userId, lessonId);

      res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Get exercises for retry error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get exercises for retry'
      });
    }
  }

  /**
   * Get cross-topic test (mix of all topics, prioritizing wrong answers)
   * GET /api/mistakes/cross-test
   */
  static async getCrossTopicTest(req, res) {
    try {
      const userId = req.userId;
      const questionCount = parseInt(req.query.count) || 20;

      const testData = await MistakesService.getCrossTopicTest(userId, questionCount);

      res.status(200).json({
        success: true,
        data: testData
      });
    } catch (error) {
      console.error('Get cross-topic test error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get cross-topic test'
      });
    }
  }

  /**
   * How many different questions wait to be fixed, per subject
   * GET /api/mistakes/waiting
   */
  static async getWaiting(req, res) {
    try {
      res.status(200).json({ success: true, data: await MistakesService.waitingBySubject(req.userId) });
    } catch (error) {
      console.error('Get waiting mistakes error:', error);
      res.status(500).json({ success: false, message: 'Failed to count mistakes' });
    }
  }

  /**
   * A mistakes exam for one subject
   * GET /api/mistakes/exam?subject=english|math|arabic
   */
  static async getSubjectExam(req, res) {
    if (invalid(req, res)) return;
    try {
      res.status(200).json({ success: true, data: await MistakesService.subjectExam(req.userId, req.query.subject) });
    } catch (error) {
      console.error('Get mistakes exam error:', error);
      res.status(500).json({ success: false, message: 'Failed to get the mistakes exam' });
    }
  }

  /**
   * Grade a mistakes exam; right answers fix their mistakes
   * POST /api/mistakes/exam { subject, answers: [{ exerciseId, userAnswer }] }
   */
  static async submitSubjectExam(req, res) {
    if (invalid(req, res)) return;
    try {
      const { subject, answers } = req.body;
      res.status(200).json({ success: true, data: await MistakesService.submitSubjectExam(req.userId, subject, answers) });
    } catch (error) {
      console.error('Submit mistakes exam error:', error);
      res.status(500).json({ success: false, message: 'Failed to submit the mistakes exam' });
    }
  }
}

module.exports = MistakesController;
