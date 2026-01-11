const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ExerciseController = require('../controllers/exercise.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All exercise routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/exercises/check
 * @desc    Check a single answer (immediate feedback)
 * @access  Private
 */
router.post('/check', [
  body('exerciseId').notEmpty().withMessage('Exercise ID is required'),
  body('userAnswer').notEmpty().withMessage('User answer is required')
], ExerciseController.checkAnswer);

/**
 * @route   POST /api/exercises/submit
 * @desc    Submit complete exercise with all answers
 * @access  Private
 */
router.post('/submit', [
  body('lessonId').notEmpty().withMessage('Lesson ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a positive number')
], ExerciseController.submitExercise);

/**
 * @route   GET /api/exercises/results/:id
 * @desc    Get result by ID
 * @access  Private
 */
router.get('/results/:id', ExerciseController.getResult);

module.exports = router;
