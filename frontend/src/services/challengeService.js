import api from './api';

const challengeService = {
  /**
   * Get today's challenge with user progress
   */
  async getTodayChallenge() {
    try {
      const response = await api.get('/challenges/today');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's progress on today's challenge
   */
  async getChallengeProgress() {
    try {
      const response = await api.get('/challenges/progress');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get past daily challenges
   * @param {number} limit - Number of past challenges to fetch (default: 7)
   */
  async getChallengeHistory(limit = 7) {
    try {
      const response = await api.get(`/challenges/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get challenge completion statistics
   */
  async getChallengeStats() {
    try {
      const response = await api.get('/challenges/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default challengeService;
