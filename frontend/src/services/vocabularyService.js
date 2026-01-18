import api from './api';

const vocabularyService = {
  /**
   * Start a new vocabulary quiz
   */
  async startQuiz(quizSize, startingDifficulty = 1, source = null) {
    try {
      const response = await api.post('/vocabulary/quiz/start', { quizSize, startingDifficulty, source });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get next question for a quiz session
   */
  async getNextQuestion(sessionId) {
    try {
      const response = await api.get(`/vocabulary/quiz/${sessionId}/next`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit answer for a quiz question
   */
  async submitAnswer(sessionId, wordId, userAnswerId) {
    try {
      const response = await api.post(`/vocabulary/quiz/${sessionId}/answer`, {
        wordId,
        userAnswerId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete a quiz session
   */
  async completeQuiz(sessionId) {
    try {
      const response = await api.post(`/vocabulary/quiz/${sessionId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get quiz session status
   */
  async getQuizStatus(sessionId) {
    try {
      const response = await api.get(`/vocabulary/quiz/${sessionId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if review mode is required
   */
  async checkReviewRequired() {
    try {
      const response = await api.get('/vocabulary/review/check');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Start a review session
   */
  async startReview() {
    try {
      const response = await api.post('/vocabulary/review/start');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get sentences for review mode educational phase
   */
  async getReviewSentences() {
    try {
      const response = await api.get('/vocabulary/review/sentences');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit answer for a review question
   */
  async submitReviewAnswer(sessionId, wordId, userAnswerId) {
    try {
      const response = await api.post(`/vocabulary/review/${sessionId}/answer`, {
        wordId,
        userAnswerId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete a review session
   */
  async completeReview(sessionId) {
    try {
      const response = await api.post(`/vocabulary/review/${sessionId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user vocabulary statistics
   */
  async getStats() {
    try {
      const response = await api.get('/vocabulary/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get learned words for user
   */
  async getLearnedWords() {
    try {
      const response = await api.get('/vocabulary/learned');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Start a smart quiz (30% failed words, 70% new words)
   */
  async startSmartQuiz(quizSize, startingDifficulty = 1, source = null) {
    try {
      const response = await api.post('/vocabulary/quiz/smart/start', { quizSize, startingDifficulty, source });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Start a failed words quiz (only struggling words)
   */
  async startFailedWordsQuiz() {
    try {
      const response = await api.post('/vocabulary/quiz/failed-words/start');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Start a past errors quiz (words with 1+ failures in history)
   */
  async startPastErrorsQuiz(quizSize = 20, minFailures = 1) {
    try {
      const response = await api.post('/vocabulary/quiz/past-errors/start', { quizSize, minFailures });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get detailed user statistics with mastery breakdown
   */
  async getDetailedStats() {
    try {
      const response = await api.get('/vocabulary/stats/detailed');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get attempt history for a specific word
   */
  async getWordHistory(wordId) {
    try {
      const response = await api.get(`/vocabulary/words/${wordId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all word scores for current user
   */
  async getAllWordScores() {
    try {
      const response = await api.get('/vocabulary/words/scores');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's attempt history with filtering and pagination
   */
  async getUserHistory(page = 1, limit = 50, filter = 'all', wordId = null, startDate = null, endDate = null) {
    try {
      const params = { page, limit, filter };
      if (wordId) params.wordId = wordId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/vocabulary/history', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get history statistics for user
   */
  async getHistoryStats() {
    try {
      const response = await api.get('/vocabulary/history/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default vocabularyService;
