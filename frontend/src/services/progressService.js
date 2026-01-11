import api from './api';

const progressService = {
  /**
   * Get dashboard data
   */
  async getDashboard() {
    try {
      const response = await api.get('/progress/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detailed progress
   */
  async getProgress() {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get progress for a specific lesson
   */
  async getLessonProgress(lessonId) {
    try {
      const response = await api.get(`/progress/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get chart statistics
   */
  async getChartStats() {
    try {
      const response = await api.get('/progress/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default progressService;
