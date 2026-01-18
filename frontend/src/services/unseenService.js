import api from './api';

const unseenService = {
  /**
   * Get all unseen paragraphs with optional filters
   */
  async getAllParagraphs(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.complexity) params.append('complexity', filters.complexity);
      if (filters.topic) params.append('topic', filters.topic);
      if (filters.isCustom !== undefined) params.append('isCustom', filters.isCustom);

      const response = await api.get(`/unseen/paragraphs?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single paragraph with questions
   */
  async getParagraphById(paragraphId) {
    try {
      const response = await api.get(`/unseen/paragraphs/${paragraphId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Start a new reading session
   */
  async startSession(paragraphId) {
    try {
      const response = await api.post('/unseen/sessions/start', { paragraphId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit answer for a question
   */
  async submitAnswer(sessionId, questionId, userAnswer) {
    try {
      const response = await api.post(`/unseen/sessions/${sessionId}/answer`, {
        questionId,
        userAnswer
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete a session
   */
  async completeSession(sessionId) {
    try {
      const response = await api.post(`/unseen/sessions/${sessionId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get session results
   */
  async getSessionResults(sessionId) {
    try {
      const response = await api.get(`/unseen/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's overall progress
   */
  async getUserProgress() {
    try {
      const response = await api.get('/unseen/progress');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const response = await api.get('/unseen/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default unseenService;
