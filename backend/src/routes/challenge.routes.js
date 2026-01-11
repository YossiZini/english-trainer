const express = require('express');
const router = express.Router();
const ChallengeController = require('../controllers/challenge.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All challenge routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/challenges/today
 * @desc    Get today's daily challenge
 * @access  Private
 */
router.get('/today', ChallengeController.getTodayChallenge);

/**
 * @route   GET /api/challenges/progress
 * @desc    Get user's progress on today's challenge
 * @access  Private
 */
router.get('/progress', ChallengeController.getChallengeProgress);

/**
 * @route   GET /api/challenges/history
 * @desc    Get past daily challenges
 * @access  Private
 * @query   limit - Number of past challenges to return (default: 7)
 */
router.get('/history', ChallengeController.getChallengeHistory);

/**
 * @route   GET /api/challenges/stats
 * @desc    Get challenge completion statistics
 * @access  Private
 */
router.get('/stats', ChallengeController.getChallengeStats);

module.exports = router;
