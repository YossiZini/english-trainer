const { validationResult } = require('express-validator');
const UnseenParagraph = require('../models/UnseenParagraph');
const UnseenQuestion = require('../models/UnseenQuestion');
const UnseenSession = require('../models/UnseenSession');
const UnseenUserProgress = require('../models/UnseenUserProgress');

class UnseenController {
  /**
   * Get all paragraphs with filters
   * GET /api/unseen/paragraphs
   */
  static async getAllParagraphs(req, res) {
    try {
      const { complexity, topic, isCustom } = req.query;
      const userId = req.userId;

      const filters = {
        complexity: complexity ? parseInt(complexity) : undefined,
        topic: topic || undefined,
        isCustom: isCustom === 'true' ? true : isCustom === 'false' ? false : undefined
      };

      const paragraphs = await UnseenParagraph.findAll(filters);

      // Get user progress for each paragraph
      const progressPromises = paragraphs.map(p =>
        UnseenUserProgress.getByUserAndParagraph(userId, p.id)
      );
      const progressArray = await Promise.all(progressPromises);

      // Merge progress data with paragraphs
      const paragraphsWithProgress = paragraphs.map((paragraph, index) => ({
        ...paragraph,
        userProgress: progressArray[index] || null
      }));

      res.status(200).json({
        success: true,
        data: paragraphsWithProgress
      });
    } catch (error) {
      console.error('Get paragraphs error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch paragraphs'
      });
    }
  }

  /**
   * Get a single paragraph with questions
   * GET /api/unseen/paragraphs/:id
   */
  static async getParagraphById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const paragraph = await UnseenParagraph.findById(id);

      if (!paragraph) {
        return res.status(404).json({
          success: false,
          message: 'Paragraph not found'
        });
      }

      const questions = await UnseenQuestion.findByParagraphId(id);
      const userProgress = await UnseenUserProgress.getByUserAndParagraph(userId, id);

      res.status(200).json({
        success: true,
        data: {
          paragraph,
          questions,
          userProgress: userProgress || null
        }
      });
    } catch (error) {
      console.error('Get paragraph error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch paragraph'
      });
    }
  }

  /**
   * Start a new reading session
   * POST /api/unseen/sessions/start
   */
  static async startSession(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { paragraphId } = req.body;
      const userId = req.userId;

      // Verify paragraph exists
      const paragraph = await UnseenParagraph.findById(paragraphId);
      if (!paragraph) {
        return res.status(404).json({
          success: false,
          message: 'Paragraph not found'
        });
      }

      // Create session
      const session = await UnseenSession.create(userId, paragraphId);

      // Get questions for this paragraph
      const questions = await UnseenQuestion.findByParagraphId(paragraphId);

      res.status(201).json({
        success: true,
        message: 'Session started successfully',
        data: {
          session,
          paragraph,
          questions
        }
      });
    } catch (error) {
      console.error('Start session error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to start session'
      });
    }
  }

  /**
   * Submit an answer for a question
   * POST /api/unseen/sessions/:sessionId/answer
   */
  static async submitAnswer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { sessionId } = req.params;
      const { questionId, userAnswer } = req.body;
      const userId = req.userId;

      // Verify session exists and belongs to user
      const session = await UnseenSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to session'
        });
      }

      if (session.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Session is not active'
        });
      }

      // Get question to check correct answer
      const question = await UnseenQuestion.findById(questionId);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      // Check if answer is correct
      const isCorrect = parseInt(userAnswer) === question.correct_answer;

      // Record the answer
      const answer = await UnseenSession.recordAnswer(
        sessionId,
        questionId,
        parseInt(userAnswer),
        isCorrect
      );

      res.status(200).json({
        success: true,
        data: {
          answer,
          isCorrect,
          correctAnswer: question.correct_answer,
          explanation: question.explanation_he
        }
      });
    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit answer'
      });
    }
  }

  /**
   * Complete a session
   * POST /api/unseen/sessions/:sessionId/complete
   */
  static async completeSession(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      // Verify session exists and belongs to user
      const session = await UnseenSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to session'
        });
      }

      // Complete the session (calculates score)
      const completedSession = await UnseenSession.complete(sessionId);

      // Update user progress
      const progress = await UnseenUserProgress.upsertProgress(
        userId,
        session.paragraph_id,
        completedSession.score
      );

      // Get session answers for review
      const answers = await UnseenSession.getSessionAnswers(sessionId);

      res.status(200).json({
        success: true,
        message: 'Session completed successfully',
        data: {
          session: completedSession,
          progress,
          answers
        }
      });
    } catch (error) {
      console.error('Complete session error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to complete session'
      });
    }
  }

  /**
   * Get session results
   * GET /api/unseen/sessions/:sessionId
   */
  static async getSessionResults(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      const session = await UnseenSession.getSessionWithDetails(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to session'
        });
      }

      const answers = await UnseenSession.getSessionAnswers(sessionId);

      res.status(200).json({
        success: true,
        data: {
          session,
          answers
        }
      });
    } catch (error) {
      console.error('Get session results error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch session results'
      });
    }
  }

  /**
   * Get user's overall progress
   * GET /api/unseen/progress
   */
  static async getUserProgress(req, res) {
    try {
      const userId = req.userId;

      const progress = await UnseenUserProgress.getAllByUser(userId);
      const stats = await UnseenUserProgress.getUserStats(userId);
      const unattempted = await UnseenUserProgress.getUnattemptedParagraphs(userId);

      res.status(200).json({
        success: true,
        data: {
          progress,
          stats,
          unattempted
        }
      });
    } catch (error) {
      console.error('Get user progress error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch user progress'
      });
    }
  }

  /**
   * Get user's statistics
   * GET /api/unseen/stats
   */
  static async getUserStats(req, res) {
    try {
      const userId = req.userId;

      const progressStats = await UnseenUserProgress.getUserStats(userId);
      const sessionStats = await UnseenSession.getUserSessionStats(userId);
      const progressByComplexity = await UnseenUserProgress.getProgressByComplexity(userId);

      res.status(200).json({
        success: true,
        data: {
          progressStats,
          sessionStats,
          progressByComplexity
        }
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch user statistics'
      });
    }
  }
}

module.exports = UnseenController;
