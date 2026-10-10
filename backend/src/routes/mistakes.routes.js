const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const MistakesController = require('../controllers/mistakes.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { SUBJECTS } = require('../config/subjects');
const { EXAM_SIZE } = require('../services/mistakes.service');

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
 * @route   GET /api/mistakes/waiting
 * @desc    How many different questions wait to be fixed, per subject
 * @access  Private
 */
router.get('/waiting', MistakesController.getWaiting);

/**
 * @route   GET /api/mistakes/exam?subject=english|math|arabic
 * @desc    A mistakes exam: up to 20 of the subject's unfixed mistakes, no other questions
 * @access  Private
 */
router.get('/exam', [
  query('subject').isIn(SUBJECTS).withMessage(`subject must be one of ${SUBJECTS.join(', ')}`)
], MistakesController.getSubjectExam);

/**
 * @route   POST /api/mistakes/exam
 * @desc    Grade a mistakes exam; a right answer fixes its mistake
 * @body    { subject, answers: [{ exerciseId, userAnswer }] }
 * @access  Private
 */
router.post('/exam', [
  body('subject').isIn(SUBJECTS).withMessage(`subject must be one of ${SUBJECTS.join(', ')}`),
  body('answers').isArray({ min: 1, max: EXAM_SIZE }).withMessage(`answers must be a list of 1 to ${EXAM_SIZE}`),
  body('answers.*.exerciseId').isString().isLength({ min: 1, max: 64 }),
  body('answers.*.userAnswer').isString().isLength({ max: 500 })
], MistakesController.submitSubjectExam);

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
