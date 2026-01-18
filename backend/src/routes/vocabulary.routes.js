const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const VocabularyController = require('../controllers/vocabulary.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All vocabulary routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/vocabulary/quiz/start
 * @desc    Start a new vocabulary quiz
 * @access  Private
 */
router.post('/quiz/start', [
  body('quizSize').isInt({ min: 5, max: 50 }).withMessage('Quiz size must be between 5 and 50')
], VocabularyController.startQuiz);

/**
 * @route   GET /api/vocabulary/quiz/:sessionId/next
 * @desc    Get next question for a quiz session
 * @access  Private
 */
router.get('/quiz/:sessionId/next', VocabularyController.getNextQuestion);

/**
 * @route   POST /api/vocabulary/quiz/:sessionId/answer
 * @desc    Submit answer for a quiz question
 * @access  Private
 */
router.post('/quiz/:sessionId/answer', [
  body('wordId').notEmpty().withMessage('Word ID is required'),
  body('userAnswerId').notEmpty().withMessage('User answer ID is required')
], VocabularyController.submitAnswer);

/**
 * @route   POST /api/vocabulary/quiz/:sessionId/complete
 * @desc    Complete a quiz session
 * @access  Private
 */
router.post('/quiz/:sessionId/complete', VocabularyController.completeQuiz);

/**
 * @route   GET /api/vocabulary/quiz/:sessionId/status
 * @desc    Get quiz session status
 * @access  Private
 */
router.get('/quiz/:sessionId/status', VocabularyController.getQuizStatus);

/**
 * @route   GET /api/vocabulary/review/check
 * @desc    Check if review mode is required
 * @access  Private
 */
router.get('/review/check', VocabularyController.checkReviewRequired);

/**
 * @route   POST /api/vocabulary/review/start
 * @desc    Start a review session
 * @access  Private
 */
router.post('/review/start', VocabularyController.startReview);

/**
 * @route   GET /api/vocabulary/review/sentences
 * @desc    Get sentences for review mode educational phase
 * @access  Private
 */
router.get('/review/sentences', VocabularyController.getReviewSentences);

/**
 * @route   POST /api/vocabulary/review/:sessionId/answer
 * @desc    Submit answer for a review question
 * @access  Private
 */
router.post('/review/:sessionId/answer', [
  body('wordId').notEmpty().withMessage('Word ID is required'),
  body('userAnswerId').notEmpty().withMessage('User answer ID is required')
], VocabularyController.submitReviewAnswer);

/**
 * @route   POST /api/vocabulary/review/:sessionId/complete
 * @desc    Complete a review session
 * @access  Private
 */
router.post('/review/:sessionId/complete', VocabularyController.completeReview);

/**
 * @route   GET /api/vocabulary/stats
 * @desc    Get user vocabulary statistics
 * @access  Private
 */
router.get('/stats', VocabularyController.getUserStats);

/**
 * @route   GET /api/vocabulary/learned
 * @desc    Get learned words for user
 * @access  Private
 */
router.get('/learned', VocabularyController.getLearnedWords);

/**
 * @route   POST /api/vocabulary/quiz/smart/start
 * @desc    Start a smart quiz (30% failed words, 70% new words)
 * @access  Private
 */
router.post('/quiz/smart/start', [
  body('quizSize').isInt({ min: 5, max: 50 }).withMessage('Quiz size must be between 5 and 50')
], VocabularyController.startSmartQuiz);

/**
 * @route   POST /api/vocabulary/quiz/failed-words/start
 * @desc    Start a failed words quiz (only struggling words)
 * @access  Private
 */
router.post('/quiz/failed-words/start', VocabularyController.startFailedWordsQuiz);

/**
 * @route   POST /api/vocabulary/quiz/past-errors/start
 * @desc    Start a past errors quiz (words with 1+ failures in history)
 * @access  Private
 */
router.post('/quiz/past-errors/start', [
  body('quizSize').optional().isInt({ min: 5, max: 50 }).withMessage('Quiz size must be between 5 and 50'),
  body('minFailures').optional().isInt({ min: 1, max: 10 }).withMessage('Minimum failures must be between 1 and 10')
], VocabularyController.startPastErrorsQuiz);

/**
 * @route   GET /api/vocabulary/stats/detailed
 * @desc    Get detailed user statistics with mastery breakdown
 * @access  Private
 */
router.get('/stats/detailed', VocabularyController.getDetailedStats);

/**
 * @route   GET /api/vocabulary/words/:wordId/history
 * @desc    Get attempt history for a specific word
 * @access  Private
 */
router.get('/words/:wordId/history', VocabularyController.getWordHistory);

/**
 * @route   GET /api/vocabulary/words/scores
 * @desc    Get all word scores for current user
 * @access  Private
 */
router.get('/words/scores', VocabularyController.getAllWordScores);

/**
 * @route   GET /api/vocabulary/history
 * @desc    Get user's attempt history with filtering and pagination
 * @access  Private
 */
router.get('/history', VocabularyController.getUserHistory);

/**
 * @route   GET /api/vocabulary/history/stats
 * @desc    Get history statistics for user
 * @access  Private
 */
router.get('/history/stats', VocabularyController.getHistoryStats);

module.exports = router;
