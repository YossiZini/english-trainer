const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const MistakesController = require('../controllers/mistakes.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All mistake routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/mistakes
 * @desc    Get all mistakes for the user
 * @query   uncorrected=true (optional) - only get uncorrected mistakes
 * @access  Private
 */
router.get('/', MistakesController.getAllMistakes);

/**
 * @route   GET /api/mistakes/stats
 * @desc    Get mistake statistics
 * @access  Private
 */
router.get('/stats', MistakesController.getStatistics);

/**
 * @route   GET /api/mistakes/cross-test
 * @desc    Get cross-topic test (mix of all topics, prioritizing wrong answers)
 * @query   count (optional) - number of questions (default: 20)
 * @access  Private
 */
router.get('/cross-test', MistakesController.getCrossTopicTest);

/**
 * @route   GET /api/mistakes/lesson/:lessonId
 * @desc    Get mistakes for a specific lesson
 * @query   uncorrected=true (optional) - only get uncorrected mistakes
 * @access  Private
 */
router.get('/lesson/:lessonId', MistakesController.getMistakesByLesson);

/**
 * @route   GET /api/mistakes/lesson/:lessonId/exercises
 * @desc    Get exercises for retry (only uncorrected mistakes)
 * @access  Private
 */
router.get('/lesson/:lessonId/exercises', MistakesController.getExercisesForRetry);

/**
 * @route   PUT /api/mistakes/lesson/:lessonId/reviewed
 * @desc    Mark mistakes as reviewed
 * @access  Private
 */
router.put('/lesson/:lessonId/reviewed', MistakesController.markAsReviewed);

/**
 * @route   POST /api/mistakes/retry
 * @desc    Submit retry attempt for wrong answers
 * @access  Private
 */
router.post('/retry', [
  body('lessonId').notEmpty().withMessage('Lesson ID is required'),
  body('answers').isArray().withMessage('Answers must be an array')
], MistakesController.submitRetry);

module.exports = router;
