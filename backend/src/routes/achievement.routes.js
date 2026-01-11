const express = require('express');
const router = express.Router();
const AchievementController = require('../controllers/achievement.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All achievement routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements with user progress
 * @access  Private
 */
router.get('/', AchievementController.getUserAchievements);

/**
 * @route   GET /api/achievements/stats
 * @desc    Get achievement statistics (total, unlocked, percentage)
 * @access  Private
 */
router.get('/stats', AchievementController.getAchievementStats);

/**
 * @route   GET /api/achievements/recent
 * @desc    Get recently unlocked achievements
 * @access  Private
 * @query   limit - Number of recent achievements to return (default: 5)
 */
router.get('/recent', AchievementController.getRecentlyUnlocked);

module.exports = router;
