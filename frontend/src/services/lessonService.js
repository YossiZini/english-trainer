import api from './api';

const lessonService = {
  /**
   * Get all lessons with user progress
   */
  async getAllLessons(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.topicNumber) params.append('topicNumber', filters.topicNumber);

      const response = await api.get(`/lessons?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single lesson with full content
   */
  async getLessonById(lessonId) {
    try {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get exercises for a lesson
   */
  async getExercises(lessonId, difficulty = null) {
    try {
      const params = difficulty ? { difficulty } : {};
      const response = await api.get(`/lessons/${lessonId}/exercises`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all lessons for a specific topic
   */
  async getLessonsByTopic(topicNumber) {
    try {
      const topics = await this.getAllLessons({ topicNumber });
      // Backend returns array of topics, each with lessons array
      // We want just the lessons from the first (and only) topic
      return topics.length > 0 && topics[0].lessons ? topics[0].lessons : [];
    } catch (error) {
      throw error;
    }
  }
};

export default lessonService;
