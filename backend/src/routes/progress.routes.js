const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All progress routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/progress/dashboard
 * @desc    Get dashboard data (overview for homepage)
 * @access  Private
 */
router.get('/dashboard', ProgressController.getDashboard);

/**
 * @route   GET /api/progress/stats
 * @desc    Get chart statistics
 * @access  Private
 */
router.get('/stats', ProgressController.getChartStats);

/**
 * @route   GET /api/progress
 * @desc    Get detailed progress
 * @access  Private
 */
router.get('/', ProgressController.getProgress);

/**
 * @route   GET /api/progress/lessons/:lessonId
 * @desc    Get progress for a specific lesson
 * @access  Private
 */
router.get('/lessons/:lessonId', ProgressController.getLessonProgress);

module.exports = router;
