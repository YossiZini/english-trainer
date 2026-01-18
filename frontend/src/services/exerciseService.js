import api from './api';

const exerciseService = {
  /**
   * Check a single answer
   */
  async checkAnswer(exerciseId, userAnswer) {
    try {
      const response = await api.post('/exercises/check', {
        exerciseId,
        userAnswer
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit complete exercise
   */
  async submitExercise(lessonId, answers, timeSpent, difficulty = 'easy') {
    try {
      const response = await api.post('/exercises/submit', {
        lessonId,
        answers,
        timeSpent,
        difficulty
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get result by ID
   */
  async getResult(resultId) {
    try {
      const response = await api.get(`/exercises/results/${resultId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default exerciseService;
