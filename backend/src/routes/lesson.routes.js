const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lesson.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All lesson routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/lessons
 * @desc    Get all lessons with user progress
 * @access  Private
 * @query   level - Filter by level (beginner/elementary/intermediate)
 * @query   topicNumber - Filter by topic number
 */
router.get('/', LessonController.getAllLessons);

/**
 * @route   GET /api/lessons/:id
 * @desc    Get specific lesson with theory content
 * @access  Private
 */
router.get('/:id', LessonController.getLessonById);

/**
 * @route   GET /api/lessons/:id/exercises
 * @desc    Get exercises for a specific lesson
 * @access  Private
 */
router.get('/:id/exercises', LessonController.getExercises);

module.exports = router;
