import api from './api';

const mistakesService = {
  /**
   * Get all mistakes for the user
   */
  async getAllMistakes(onlyUncorrected = false) {
    try {
      const response = await api.get('/mistakes', {
        params: { uncorrected: onlyUncorrected }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get mistakes for a specific lesson
   */
  async getMistakesByLesson(lessonId, onlyUncorrected = false) {
    try {
      const response = await api.get(`/mistakes/lesson/${lessonId}`, {
        params: { uncorrected: onlyUncorrected }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get exercises for retry (only uncorrected mistakes)
   */
  async getExercisesForRetry(lessonId) {
    try {
      const response = await api.get(`/mistakes/lesson/${lessonId}/exercises`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark mistakes as reviewed
   */
  async markAsReviewed(lessonId) {
    try {
      const response = await api.put(`/mistakes/lesson/${lessonId}/reviewed`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit retry attempt
   */
  async submitRetry(lessonId, answers) {
    try {
      const response = await api.post('/mistakes/retry', {
        lessonId,
        answers
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get mistake statistics
   */
  async getStatistics() {
    try {
      const response = await api.get('/mistakes/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get cross-topic test (mix of all topics, prioritizing wrong answers)
   */
  async getCrossTopicTest(questionCount = 20) {
    try {
      const response = await api.get('/mistakes/cross-test', {
        params: { count: questionCount }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /** How many different questions wait to be fixed, per subject: { english, math, arabic }. */
  async getWaiting() {
    const response = await api.get('/mistakes/waiting');
    return response.data;
  },

  /** A mistakes exam: up to 20 of the subject's unfixed mistakes ({ subject, waiting, exercises }). */
  async getSubjectExam(subject) {
    const response = await api.get('/mistakes/exam', { params: { subject } });
    return response.data;
  },

  /** Grade a mistakes exam; a right answer fixes its mistake ({ total, correct, fixed, waiting, results }). */
  async submitSubjectExam(subject, answers) {
    const response = await api.post('/mistakes/exam', { subject, answers });
    return response.data;
  }
};

export default mistakesService;
