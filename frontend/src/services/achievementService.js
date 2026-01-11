import api from './api';

const achievementService = {
  /**
   * Get all achievements with user progress
   */
  async getAchievements() {
    try {
      const response = await api.get('/achievements');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get achievement statistics
   */
  async getStats() {
    try {
      const response = await api.get('/achievements/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get recently unlocked achievements
   * @param {number} limit - Number of recent achievements to fetch (default: 5)
   */
  async getRecentlyUnlocked(limit = 5) {
    try {
      const response = await api.get(`/achievements/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default achievementService;
