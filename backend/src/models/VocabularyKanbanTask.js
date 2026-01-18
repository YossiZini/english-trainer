const { pool } = require('../config/database');

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
    const query = `
      SELECT *
      FROM vocabulary_kanban_tasks
      ORDER BY priority ASC, created_at ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get tasks by status
   * @param {string} status - Status to filter by (backlog, in_progress, done)
   * @returns {Array} Tasks with the specified status
   */
  static async findByStatus(status) {
    const query = `
      SELECT *
      FROM vocabulary_kanban_tasks
      WHERE status = $1
      ORDER BY priority ASC, created_at ASC
    `;

    const result = await pool.query(query, [status]);
    return result.rows;
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
    const query = `
      SELECT *
      FROM vocabulary_kanban_tasks
      WHERE category = $1
      ORDER BY status ASC, priority ASC
    `;

    const result = await pool.query(query, [category]);
    return result.rows;
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {object|null} Task
   */
  static async findById(id) {
    const query = `
      SELECT *
      FROM vocabulary_kanban_tasks
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
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

    const query = `
      INSERT INTO vocabulary_kanban_tasks
        (title, description, status, priority, category, estimated_hours, assignee)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      description,
      status,
      priority,
      category,
      estimated_hours,
      assignee
    ]);

    return result.rows[0];
  }

  /**
   * Update task status
   * @param {string} id - Task ID
   * @param {string} newStatus - New status
   * @returns {object} Updated task
   */
  static async updateStatus(id, newStatus) {
    const completedAt = newStatus === 'done' ? 'CURRENT_TIMESTAMP' : 'NULL';

    const query = `
      UPDATE vocabulary_kanban_tasks
      SET
        status = $1,
        completed_at = ${completedAt},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [newStatus, id]);
    return result.rows[0];
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

    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Handle completed_at when status changes to done
    if (updates.status === 'done') {
      fields.push('completed_at = CURRENT_TIMESTAMP');
    } else if (updates.status && updates.status !== 'done') {
      fields.push('completed_at = NULL');
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
      UPDATE vocabulary_kanban_tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {boolean} Success status
   */
  static async delete(id) {
    const query = `
      DELETE FROM vocabulary_kanban_tasks
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Get task statistics
   * @returns {object} Statistics about tasks
   */
  static async getStats() {
    const query = `
      SELECT
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'backlog') as backlog_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'done') as done_count,
        COUNT(*) FILTER (WHERE category = 'database') as database_count,
        COUNT(*) FILTER (WHERE category = 'backend') as backend_count,
        COUNT(*) FILTER (WHERE category = 'frontend') as frontend_count,
        COUNT(*) FILTER (WHERE category = 'testing') as testing_count,
        SUM(estimated_hours) FILTER (WHERE estimated_hours IS NOT NULL) as total_estimated_hours,
        SUM(actual_hours) FILTER (WHERE actual_hours IS NOT NULL) as total_actual_hours
      FROM vocabulary_kanban_tasks
    `;

    const result = await pool.query(query);
    const stats = result.rows[0];

    return {
      totalTasks: parseInt(stats.total_tasks),
      byStatus: {
        backlog: parseInt(stats.backlog_count),
        in_progress: parseInt(stats.in_progress_count),
        done: parseInt(stats.done_count)
      },
      byCategory: {
        database: parseInt(stats.database_count),
        backend: parseInt(stats.backend_count),
        frontend: parseInt(stats.frontend_count),
        testing: parseInt(stats.testing_count)
      },
      completionPercentage:
        stats.total_tasks > 0
          ? Math.round((stats.done_count / stats.total_tasks) * 100)
          : 0,
      totalEstimatedHours: parseFloat(stats.total_estimated_hours || 0),
      totalActualHours: parseFloat(stats.total_actual_hours || 0)
    };
  }
}

module.exports = VocabularyKanbanTask;
