const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const UnseenController = require('../controllers/unseen.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All unseen routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/unseen/paragraphs
 * @desc    Get all paragraphs with optional filters (complexity, topic)
 * @access  Private
 */
router.get('/paragraphs', UnseenController.getAllParagraphs);

/**
 * @route   GET /api/unseen/paragraphs/:id
 * @desc    Get single paragraph with questions
 * @access  Private
 */
router.get('/paragraphs/:id', UnseenController.getParagraphById);

/**
 * @route   POST /api/unseen/sessions/start
 * @desc    Start a new reading session
 * @access  Private
 */
router.post('/sessions/start', [
  body('paragraphId').notEmpty().withMessage('Paragraph ID is required')
], UnseenController.startSession);

/**
 * @route   POST /api/unseen/sessions/:sessionId/answer
 * @desc    Submit answer for a question
 * @access  Private
 */
router.post('/sessions/:sessionId/answer', [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('userAnswer').isInt({ min: 0, max: 3 }).withMessage('User answer must be an integer between 0 and 3')
], UnseenController.submitAnswer);

/**
 * @route   POST /api/unseen/sessions/:sessionId/complete
 * @desc    Complete a session and get results
 * @access  Private
 */
router.post('/sessions/:sessionId/complete', UnseenController.completeSession);

/**
 * @route   GET /api/unseen/sessions/:sessionId
 * @desc    Get session results
 * @access  Private
 */
router.get('/sessions/:sessionId', UnseenController.getSessionResults);

/**
 * @route   GET /api/unseen/progress
 * @desc    Get user's overall progress
 * @access  Private
 */
router.get('/progress', UnseenController.getUserProgress);

/**
 * @route   GET /api/unseen/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', UnseenController.getUserStats);

module.exports = router;
