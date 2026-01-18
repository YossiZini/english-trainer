const VocabularyKanbanTask = require('../models/VocabularyKanbanTask');

/**
 * Kanban Controller
 * Manages Kanban tasks for feature implementation tracking
 * TODO: Add admin-only authorization when admin role system is implemented
 */
class KanbanController {
  /**
   * Get all tasks
   * GET /api/kanban/tasks
   */
  static async getAllTasks(req, res) {
    try {
      const tasks = await VocabularyKanbanTask.findAll();

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get all tasks error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get tasks'
      });
    }
  }

  /**
   * Get tasks grouped by status
   * GET /api/kanban/tasks/grouped
   */
  static async getTasksGrouped(req, res) {
    try {
      const tasks = await VocabularyKanbanTask.findGroupedByStatus();

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get grouped tasks error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get grouped tasks'
      });
    }
  }

  /**
   * Get tasks by status
   * GET /api/kanban/tasks/status/:status
   */
  static async getTasksByStatus(req, res) {
    try {
      const { status } = req.params;

      if (!['backlog', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be one of: backlog, in_progress, done'
        });
      }

      const tasks = await VocabularyKanbanTask.findByStatus(status);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get tasks by status error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get tasks by status'
      });
    }
  }

  /**
   * Create a new task
   * POST /api/kanban/tasks
   */
  static async createTask(req, res) {
    try {
      const taskData = req.body;

      const task = await VocabularyKanbanTask.create(taskData);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create task'
      });
    }
  }

  /**
   * Update task status
   * PATCH /api/kanban/tasks/:id/status
   */
  static async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['backlog', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required: backlog, in_progress, or done'
        });
      }

      const task = await VocabularyKanbanTask.updateStatus(id, status);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: task
      });
    } catch (error) {
      console.error('Update task status error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update task status'
      });
    }
  }

  /**
   * Update task
   * PUT /api/kanban/tasks/:id
   */
  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const task = await VocabularyKanbanTask.update(id, updates);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update task'
      });
    }
  }

  /**
   * Delete a task
   * DELETE /api/kanban/tasks/:id
   */
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;

      const deleted = await VocabularyKanbanTask.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete task'
      });
    }
  }

  /**
   * Get Kanban statistics
   * GET /api/kanban/stats
   */
  static async getStats(req, res) {
    try {
      const stats = await VocabularyKanbanTask.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get Kanban stats error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get statistics'
      });
    }
  }
}

module.exports = KanbanController;
