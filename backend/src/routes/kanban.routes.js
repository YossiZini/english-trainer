const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const KanbanController = require('../controllers/kanban.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All Kanban routes require authentication
// TODO: Add admin-only middleware when role system is implemented
router.use(authenticate);

/**
 * @route   GET /api/kanban/tasks
 * @desc    Get all Kanban tasks
 * @access  Private (TODO: Admin only)
 */
router.get('/tasks', KanbanController.getAllTasks);

/**
 * @route   GET /api/kanban/tasks/grouped
 * @desc    Get tasks grouped by status
 * @access  Private (TODO: Admin only)
 */
router.get('/tasks/grouped', KanbanController.getTasksGrouped);

/**
 * @route   GET /api/kanban/tasks/status/:status
 * @desc    Get tasks by status
 * @access  Private (TODO: Admin only)
 */
router.get('/tasks/status/:status', KanbanController.getTasksByStatus);

/**
 * @route   POST /api/kanban/tasks
 * @desc    Create a new task
 * @access  Private (TODO: Admin only)
 */
router.post('/tasks', [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['backlog', 'in_progress', 'done']).withMessage('Invalid status')
], KanbanController.createTask);

/**
 * @route   PATCH /api/kanban/tasks/:id/status
 * @desc    Update task status
 * @access  Private (TODO: Admin only)
 */
router.patch('/tasks/:id/status', [
  body('status').isIn(['backlog', 'in_progress', 'done']).withMessage('Invalid status')
], KanbanController.updateTaskStatus);

/**
 * @route   PUT /api/kanban/tasks/:id
 * @desc    Update a task
 * @access  Private (TODO: Admin only)
 */
router.put('/tasks/:id', KanbanController.updateTask);

/**
 * @route   DELETE /api/kanban/tasks/:id
 * @desc    Delete a task
 * @access  Private (TODO: Admin only)
 */
router.delete('/tasks/:id', KanbanController.deleteTask);

/**
 * @route   GET /api/kanban/stats
 * @desc    Get Kanban statistics
 * @access  Private (TODO: Admin only)
 */
router.get('/stats', KanbanController.getStats);

module.exports = router;
