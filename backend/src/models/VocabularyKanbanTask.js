const { db } = require('../config/database');

/**
 * VocabularyKanbanTask Model
 * Manages Kanban tasks for tracking feature implementation progress
 */
class VocabularyKanbanTask {
  /**
   * Get all tasks
   * @returns {Array} All Kanban tasks
   */
  static async findAll() {
    const tasks = db.find('vocabulary_kanban_tasks', {});

    // Sort by priority ascending, then by created_at ascending
    tasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

    return tasks;
  }

  /**
   * Get tasks by status
   * @param {string} status - Status to filter by (backlog, in_progress, done)
   * @returns {Array} Tasks with the specified status
   */
  static async findByStatus(status) {
    const tasks = db.find('vocabulary_kanban_tasks', { status });

    // Sort by priority ascending, then by created_at ascending
    tasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

    return tasks;
  }

  /**
   * Get tasks grouped by status
   * @returns {object} Tasks grouped by status
   */
  static async findGroupedByStatus() {
    const tasks = await this.findAll();

    return {
      backlog: tasks.filter(t => t.status === 'backlog'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      done: tasks.filter(t => t.status === 'done')
    };
  }

  /**
   * Get tasks by category
   * @param {string} category - Category to filter by
   * @returns {Array} Tasks in the specified category
   */
  static async findByCategory(category) {
    const tasks = db.find('vocabulary_kanban_tasks', { category });

    // Sort by status ascending, then by priority ascending
    const statusOrder = { backlog: 0, in_progress: 1, done: 2 };
    tasks.sort((a, b) => {
      const statusDiff = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      if (statusDiff !== 0) return statusDiff;
      return a.priority - b.priority;
    });

    return tasks;
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {object|null} Task
   */
  static async findById(id) {
    const task = db.findById('vocabulary_kanban_tasks', id);
    return task || null;
  }

  /**
   * Create a new task
   * @param {object} taskData - Task data
   * @returns {object} Created task
   */
  static async create(taskData) {
    const {
      title,
      description = null,
      status = 'backlog',
      priority = 0,
      category = null,
      estimated_hours = null,
      assignee = null
    } = taskData;

    const timestamp = new Date().toISOString();

    const task = db.insert('vocabulary_kanban_tasks', {
      title,
      description,
      status,
      priority,
      category,
      estimated_hours,
      actual_hours: null,
      assignee,
      completed_at: null,
      created_at: timestamp,
      updated_at: timestamp
    });

    return task;
  }

  /**
   * Update task status
   * @param {string} id - Task ID
   * @param {string} newStatus - New status
   * @returns {object} Updated task
   */
  static async updateStatus(id, newStatus) {
    const timestamp = new Date().toISOString();
    const completedAt = newStatus === 'done' ? timestamp : null;

    const result = db.updateById('vocabulary_kanban_tasks', id, {
      status: newStatus,
      completed_at: completedAt,
      updated_at: timestamp
    });

    if (result.modified === 0) return undefined;

    return db.findById('vocabulary_kanban_tasks', id);
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {object} updates - Fields to update
   * @returns {object} Updated task
   */
  static async update(id, updates) {
    const allowedFields = [
      'title',
      'description',
      'status',
      'priority',
      'category',
      'estimated_hours',
      'actual_hours',
      'assignee'
    ];

    const updateData = { updated_at: new Date().toISOString() };
    let hasUpdates = false;

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        updateData[key] = updates[key];
        hasUpdates = true;
      }
    }

    if (!hasUpdates) {
      throw new Error('No valid fields to update');
    }

    // Handle completed_at when status changes to done
    if (updates.status === 'done') {
      updateData.completed_at = new Date().toISOString();
    } else if (updates.status && updates.status !== 'done') {
      updateData.completed_at = null;
    }

    const result = db.updateById('vocabulary_kanban_tasks', id, updateData);

    if (result.modified === 0) return undefined;

    return db.findById('vocabulary_kanban_tasks', id);
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {boolean} Success status
   */
  static async delete(id) {
    const result = db.deleteById('vocabulary_kanban_tasks', id);
    return result.deleted > 0;
  }

  /**
   * Get task statistics
   * @returns {object} Statistics about tasks
   */
  static async getStats() {
    const tasks = db.find('vocabulary_kanban_tasks', {});

    const stats = {
      totalTasks: tasks.length,
      byStatus: {
        backlog: 0,
        in_progress: 0,
        done: 0
      },
      byCategory: {
        database: 0,
        backend: 0,
        frontend: 0,
        testing: 0
      },
      completionPercentage: 0,
      totalEstimatedHours: 0,
      totalActualHours: 0
    };

    for (const task of tasks) {
      // Count by status
      if (stats.byStatus.hasOwnProperty(task.status)) {
        stats.byStatus[task.status]++;
      }

      // Count by category
      if (task.category && stats.byCategory.hasOwnProperty(task.category)) {
        stats.byCategory[task.category]++;
      }

      // Sum hours
      if (task.estimated_hours) {
        stats.totalEstimatedHours += parseFloat(task.estimated_hours);
      }
      if (task.actual_hours) {
        stats.totalActualHours += parseFloat(task.actual_hours);
      }
    }

    // Calculate completion percentage
    if (stats.totalTasks > 0) {
      stats.completionPercentage = Math.round((stats.byStatus.done / stats.totalTasks) * 100);
    }

    return stats;
  }
}

module.exports = VocabularyKanbanTask;
