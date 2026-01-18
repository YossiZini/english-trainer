import api from './api';

const kanbanService = {
  /**
   * Get all Kanban tasks
   */
  async getAllTasks() {
    try {
      const response = await api.get('/kanban/tasks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get tasks grouped by status
   */
  async getTasksGrouped() {
    try {
      const response = await api.get('/kanban/tasks/grouped');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status) {
    try {
      const response = await api.get(`/kanban/tasks/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    try {
      const response = await api.post('/kanban/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update task status
   */
  async updateTaskStatus(taskId, status) {
    try {
      const response = await api.patch(`/kanban/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update task
   */
  async updateTask(taskId, updates) {
    try {
      const response = await api.put(`/kanban/tasks/${taskId}`, updates);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/kanban/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get Kanban statistics
   */
  async getStats() {
    try {
      const response = await api.get('/kanban/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default kanbanService;
