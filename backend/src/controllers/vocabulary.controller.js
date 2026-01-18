const VocabularyService = require('../services/vocabulary.service');

class VocabularyController {
  /**
   * Start a new quiz
   * POST /api/vocabulary/quiz/start
   */
  static async startQuiz(req, res) {
    try {
      const { quizSize, startingDifficulty = 1, source = null } = req.body;
      const userId = req.userId;

      if (!quizSize || quizSize < 5 || quizSize > 50) {
        return res.status(400).json({
          success: false,
          message: 'Quiz size must be between 5 and 50'
        });
      }

      if (startingDifficulty < 1 || startingDifficulty > 3) {
        return res.status(400).json({
          success: false,
          message: 'Starting difficulty must be 1 (beginner), 2 (intermediate), or 3 (advanced)'
        });
      }

      const result = await VocabularyService.startQuiz(userId, quizSize, startingDifficulty, source);

      if (result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
          data: { sessionId: result.sessionId }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Quiz started successfully',
        data: result
      });
    } catch (error) {
      console.error('Start quiz error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start quiz'
      });
    }
  }

  /**
   * Get next question
   * GET /api/vocabulary/quiz/:sessionId/next
   */
  static async getNextQuestion(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const result = await VocabularyService.getNextQuestion(sessionId, userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get next question error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get next question'
      });
    }
  }

  /**
   * Submit answer
   * POST /api/vocabulary/quiz/:sessionId/answer
   */
  static async submitAnswer(req, res) {
    try {
      const { sessionId } = req.params;
      const { wordId, userAnswerId } = req.body;
      const userId = req.userId;

      if (!sessionId || !wordId || !userAnswerId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID, word ID, and user answer ID are required'
        });
      }

      const result = await VocabularyService.submitAnswer(
        sessionId,
        userId,
        wordId,
        userAnswerId
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit answer'
      });
    }
  }

  /**
   * Complete quiz
   * POST /api/vocabulary/quiz/:sessionId/complete
   */
  static async completeQuiz(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const result = await VocabularyService.completeQuiz(sessionId, userId);

      res.status(200).json({
        success: true,
        message: 'Quiz completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Complete quiz error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to complete quiz'
      });
    }
  }

  /**
   * Get quiz status
   * GET /api/vocabulary/quiz/:sessionId/status
   */
  static async getQuizStatus(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const VocabularyQuizSession = require('../models/VocabularyQuizSession');
      const session = await VocabularyQuizSession.findById(sessionId);

      if (!session || session.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Quiz session not found'
        });
      }

      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Get quiz status error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get quiz status'
      });
    }
  }

  /**
   * Check if review mode is required
   * GET /api/vocabulary/review/check
   */
  static async checkReviewRequired(req, res) {
    try {
      const userId = req.userId;

      const result = await VocabularyService.checkReviewModeTrigger(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Check review required error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to check review status'
      });
    }
  }

  /**
   * Start review session
   * POST /api/vocabulary/review/start
   */
  static async startReview(req, res) {
    try {
      const userId = req.userId;

      const result = await VocabularyService.startReviewSession(userId);

      res.status(200).json({
        success: true,
        message: 'Review session started successfully',
        data: result
      });
    } catch (error) {
      console.error('Start review error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start review session'
      });
    }
  }

  /**
   * Get review sentences (educational phase)
   * GET /api/vocabulary/review/sentences
   */
  static async getReviewSentences(req, res) {
    try {
      const userId = req.userId;

      const result = await VocabularyService.getReviewSentences(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get review sentences error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get review sentences'
      });
    }
  }

  /**
   * Submit review answer
   * POST /api/vocabulary/review/:sessionId/answer
   */
  static async submitReviewAnswer(req, res) {
    try {
      const { sessionId } = req.params;
      const { wordId, userAnswerId } = req.body;
      const userId = req.userId;

      if (!sessionId || !wordId || !userAnswerId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID, word ID, and user answer ID are required'
        });
      }

      const result = await VocabularyService.submitReviewAnswer(
        sessionId,
        userId,
        wordId,
        userAnswerId
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Submit review answer error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit review answer'
      });
    }
  }

  /**
   * Complete review session
   * POST /api/vocabulary/review/:sessionId/complete
   */
  static async completeReview(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const result = await VocabularyService.completeReviewSession(sessionId, userId);

      res.status(200).json({
        success: true,
        message: 'Review session completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Complete review error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to complete review session'
      });
    }
  }

  /**
   * Get user vocabulary statistics
   * GET /api/vocabulary/stats
   */
  static async getUserStats(req, res) {
    try {
      const userId = req.userId;

      const result = await VocabularyService.getUserVocabularyStats(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get user statistics'
      });
    }
  }

  /**
   * Get learned words
   * GET /api/vocabulary/learned
   */
  static async getLearnedWords(req, res) {
    try {
      const userId = req.userId;
      const VocabularyUserHistory = require('../models/VocabularyUserHistory');

      const wordsLearnedIds = await VocabularyUserHistory.getCorrectlyAnsweredWordIds(userId);

      res.status(200).json({
        success: true,
        data: {
          count: wordsLearnedIds.length,
          wordIds: wordsLearnedIds
        }
      });
    } catch (error) {
      console.error('Get learned words error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get learned words'
      });
    }
  }

  /**
   * Start a smart quiz (30% failed words, 70% new words)
   * POST /api/vocabulary/quiz/smart/start
   */
  static async startSmartQuiz(req, res) {
    try {
      const { quizSize, startingDifficulty = 1, source = null } = req.body;
      const userId = req.userId;

      if (!quizSize || quizSize < 5 || quizSize > 50) {
        return res.status(400).json({
          success: false,
          message: 'Quiz size must be between 5 and 50'
        });
      }

      if (startingDifficulty < 1 || startingDifficulty > 3) {
        return res.status(400).json({
          success: false,
          message: 'Starting difficulty must be 1 (beginner), 2 (intermediate), or 3 (advanced)'
        });
      }

      const result = await VocabularyService.startSmartQuiz(userId, quizSize, startingDifficulty, source);

      if (result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
          data: { sessionId: result.sessionId }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Smart quiz started successfully',
        data: result
      });
    } catch (error) {
      console.error('Start smart quiz error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start smart quiz'
      });
    }
  }

  /**
   * Start a failed words quiz
   * POST /api/vocabulary/quiz/failed-words/start
   */
  static async startFailedWordsQuiz(req, res) {
    try {
      const userId = req.userId;

      const result = await VocabularyService.startFailedWordsQuiz(userId);

      if (result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
          data: { sessionId: result.sessionId }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Failed words quiz started successfully',
        data: result
      });
    } catch (error) {
      console.error('Start failed words quiz error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start failed words quiz'
      });
    }
  }

  /**
   * Start a past errors quiz (words with 1+ failures in history)
   * POST /api/vocabulary/quiz/past-errors/start
   */
  static async startPastErrorsQuiz(req, res) {
    try {
      const userId = req.userId;
      const { quizSize = 20, minFailures = 1 } = req.body;

      if (quizSize && (quizSize < 5 || quizSize > 50)) {
        return res.status(400).json({
          success: false,
          message: 'Quiz size must be between 5 and 50'
        });
      }

      if (minFailures && (minFailures < 1 || minFailures > 10)) {
        return res.status(400).json({
          success: false,
          message: 'Minimum failures must be between 1 and 10'
        });
      }

      const result = await VocabularyService.startPastErrorsQuiz(userId, quizSize, minFailures);

      if (result.error) {
        return res.status(400).json({
          success: false,
          message: result.error,
          data: { sessionId: result.sessionId }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Past errors quiz started successfully',
        data: result
      });
    } catch (error) {
      console.error('Start past errors quiz error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start past errors quiz'
      });
    }
  }

  /**
   * Get detailed user statistics with mastery breakdown
   * GET /api/vocabulary/stats/detailed
   */
  static async getDetailedStats(req, res) {
    try {
      const userId = req.userId;

      const result = await VocabularyService.getDetailedUserStats(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get detailed stats error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get detailed statistics'
      });
    }
  }

  /**
   * Get word history for a specific word
   * GET /api/vocabulary/words/:wordId/history
   */
  static async getWordHistory(req, res) {
    try {
      const { wordId } = req.params;
      const userId = req.userId;
      const VocabularyWordScores = require('../models/VocabularyWordScores');

      if (!wordId) {
        return res.status(400).json({
          success: false,
          message: 'Word ID is required'
        });
      }

      const result = await VocabularyWordScores.getWordHistory(userId, wordId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'No history found for this word'
        });
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get word history error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get word history'
      });
    }
  }

  /**
   * Get all word scores for current user
   * GET /api/vocabulary/words/scores
   */
  static async getAllWordScores(req, res) {
    try {
      const userId = req.userId;
      const VocabularyWordScores = require('../models/VocabularyWordScores');

      const result = await VocabularyWordScores.getAllWordScores(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get all word scores error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get word scores'
      });
    }
  }

  /**
   * Get user's attempt history aggregated by word with filtering and pagination
   * GET /api/vocabulary/history
   */
  static async getUserHistory(req, res) {
    try {
      const userId = req.userId;
      const { page, limit, filter } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 30,
        filter: filter || 'all'
      };

      const VocabularyUserHistory = require('../models/VocabularyUserHistory');
      const result = await VocabularyUserHistory.getAggregatedWordHistory(userId, options);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get user history error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get user history'
      });
    }
  }

  /**
   * Get history statistics for user
   * GET /api/vocabulary/history/stats
   */
  static async getHistoryStats(req, res) {
    try {
      const userId = req.userId;
      const VocabularyUserHistory = require('../models/VocabularyUserHistory');

      const result = await VocabularyUserHistory.getHistoryStats(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get history stats error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get history statistics'
      });
    }
  }
}

module.exports = VocabularyController;
