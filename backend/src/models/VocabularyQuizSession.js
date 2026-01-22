const { db, indexManager } = require('../config/database');

class VocabularyQuizSession {
  /**
   * Create a new quiz session
   */
  static async create(userId, quizType, quizSize, difficultyStart, difficultyEnd, source = null) {
    // Determine initial stage based on difficulty range
    let initialStage = 1;
    if (difficultyStart >= 3 && difficultyEnd <= 5) {
      initialStage = 2;
    } else if (difficultyStart >= 5) {
      initialStage = 3;
    }

    const timestamp = new Date().toISOString();

    const session = db.insert('vocabulary_quiz_sessions', {
      user_id: userId,
      quiz_type: quizType,
      quiz_size: quizSize,
      difficulty_range_start: difficultyStart,
      difficulty_range_end: difficultyEnd,
      current_difficulty_stage: initialStage,
      source: source,
      total_questions: 0,
      correct_answers: 0,
      wrong_answers: 0,
      points_earned: 0,
      consecutive_correct: 0,
      started_at: timestamp,
      completed_at: null,
      status: 'in_progress'
    });

    return {
      id: session.id,
      user_id: session.user_id,
      quiz_type: session.quiz_type,
      quiz_size: session.quiz_size,
      difficulty_range_start: session.difficulty_range_start,
      difficulty_range_end: session.difficulty_range_end,
      current_difficulty_stage: session.current_difficulty_stage,
      source: session.source,
      started_at: session.started_at,
      status: session.status
    };
  }

  /**
   * Find session by ID
   */
  static async findById(id) {
    const session = db.findById('vocabulary_quiz_sessions', id);
    if (!session) return undefined;

    return {
      id: session.id,
      user_id: session.user_id,
      quiz_type: session.quiz_type,
      quiz_size: session.quiz_size,
      difficulty_range_start: session.difficulty_range_start,
      difficulty_range_end: session.difficulty_range_end,
      total_questions: session.total_questions,
      correct_answers: session.correct_answers,
      wrong_answers: session.wrong_answers,
      points_earned: session.points_earned,
      consecutive_correct: session.consecutive_correct,
      current_difficulty_stage: session.current_difficulty_stage,
      source: session.source,
      started_at: session.started_at,
      completed_at: session.completed_at,
      status: session.status
    };
  }

  /**
   * Update session progress after answering a question
   */
  static async updateProgress(id, correctAnswers, wrongAnswers, consecutiveCorrect, stage) {
    const totalQuestions = correctAnswers + wrongAnswers;

    const result = db.updateById('vocabulary_quiz_sessions', id, {
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
      consecutive_correct: consecutiveCorrect,
      current_difficulty_stage: stage,
      total_questions: totalQuestions
    });

    if (result.modified === 0) return undefined;

    const session = db.findById('vocabulary_quiz_sessions', id);
    return {
      id: session.id,
      correct_answers: session.correct_answers,
      wrong_answers: session.wrong_answers,
      consecutive_correct: session.consecutive_correct,
      current_difficulty_stage: session.current_difficulty_stage,
      total_questions: session.total_questions
    };
  }

  /**
   * Update difficulty range during progression
   */
  static async updateDifficultyRange(id, newStart, newEnd, newStage) {
    const result = db.updateById('vocabulary_quiz_sessions', id, {
      difficulty_range_start: newStart,
      difficulty_range_end: newEnd,
      current_difficulty_stage: newStage
    });

    if (result.modified === 0) return undefined;

    const session = db.findById('vocabulary_quiz_sessions', id);
    return {
      id: session.id,
      difficulty_range_start: session.difficulty_range_start,
      difficulty_range_end: session.difficulty_range_end,
      current_difficulty_stage: session.current_difficulty_stage
    };
  }

  /**
   * Complete a quiz session
   */
  static async complete(id, pointsEarned) {
    const timestamp = new Date().toISOString();

    const result = db.updateById('vocabulary_quiz_sessions', id, {
      status: 'completed',
      completed_at: timestamp,
      points_earned: pointsEarned
    });

    if (result.modified === 0) return undefined;

    const session = db.findById('vocabulary_quiz_sessions', id);
    return {
      id: session.id,
      user_id: session.user_id,
      quiz_type: session.quiz_type,
      total_questions: session.total_questions,
      correct_answers: session.correct_answers,
      wrong_answers: session.wrong_answers,
      points_earned: session.points_earned,
      completed_at: session.completed_at,
      status: session.status
    };
  }

  /**
   * Get active session for a user (if exists)
   */
  static async getActiveSession(userId) {
    const sessions = db.find('vocabulary_quiz_sessions', {
      user_id: userId,
      status: 'in_progress'
    });

    if (sessions.length === 0) return undefined;

    // Sort by started_at descending and get the most recent
    sessions.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    const session = sessions[0];

    return {
      id: session.id,
      user_id: session.user_id,
      quiz_type: session.quiz_type,
      quiz_size: session.quiz_size,
      difficulty_range_start: session.difficulty_range_start,
      difficulty_range_end: session.difficulty_range_end,
      total_questions: session.total_questions,
      correct_answers: session.correct_answers,
      wrong_answers: session.wrong_answers,
      consecutive_correct: session.consecutive_correct,
      current_difficulty_stage: session.current_difficulty_stage,
      source: session.source,
      started_at: session.started_at,
      status: session.status
    };
  }

  /**
   * Cancel/invalidate a session
   */
  static async cancelSession(id) {
    const result = db.updateById('vocabulary_quiz_sessions', id, {
      status: 'cancelled'
    });

    if (result.modified === 0) return undefined;

    return { id };
  }

  /**
   * Get user's session history
   */
  static async getUserSessionHistory(userId, limit = 10) {
    const sessions = db.find('vocabulary_quiz_sessions', { user_id: userId });

    // Sort by started_at descending
    sessions.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));

    // Limit results
    const limited = sessions.slice(0, limit);

    return limited.map(s => ({
      id: s.id,
      quiz_type: s.quiz_type,
      quiz_size: s.quiz_size,
      total_questions: s.total_questions,
      correct_answers: s.correct_answers,
      wrong_answers: s.wrong_answers,
      points_earned: s.points_earned,
      started_at: s.started_at,
      completed_at: s.completed_at,
      status: s.status
    }));
  }

  /**
   * Get user's completed quizzes count
   */
  static async getCompletedQuizzesCount(userId) {
    const sessions = db.find('vocabulary_quiz_sessions', {
      user_id: userId,
      status: 'completed'
    });

    return sessions.length;
  }

  /**
   * Get user's completed review sessions count
   */
  static async getCompletedReviewSessionsCount(userId) {
    const sessions = db.find('vocabulary_quiz_sessions', {
      user_id: userId,
      status: 'completed',
      quiz_type: 'review'
    });

    return sessions.length;
  }

  /**
   * Abandon a session (mark as abandoned if not completed)
   */
  static async abandon(id) {
    const session = db.findById('vocabulary_quiz_sessions', id);
    if (!session || session.status !== 'in_progress') {
      return undefined;
    }

    db.updateById('vocabulary_quiz_sessions', id, {
      status: 'abandoned'
    });

    return { id, status: 'abandoned' };
  }

  /**
   * Get session statistics for a user
   */
  static async getUserSessionStats(userId) {
    const sessions = db.find('vocabulary_quiz_sessions', { user_id: userId });

    const stats = {
      total_sessions: sessions.length,
      completed_sessions: 0,
      review_sessions: 0,
      average_score: 0,
      total_points_earned: 0
    };

    let scoreSum = 0;
    let scoreCount = 0;

    for (const s of sessions) {
      if (s.status === 'completed') {
        stats.completed_sessions++;
        if (s.total_questions > 0) {
          scoreSum += (s.correct_answers * 100.0) / s.total_questions;
          scoreCount++;
        }
      }
      if (s.quiz_type === 'review') {
        stats.review_sessions++;
      }
      stats.total_points_earned += s.points_earned || 0;
    }

    stats.average_score = scoreCount > 0 ? scoreSum / scoreCount : 0;

    return stats;
  }

  /**
   * Delete a session (for cleanup or testing)
   */
  static async delete(id) {
    db.deleteById('vocabulary_quiz_sessions', id);
  }
}

module.exports = VocabularyQuizSession;
