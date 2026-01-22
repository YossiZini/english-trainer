const { db } = require('../config/database');

class UnseenSession {
  /**
   * Create a new reading session
   */
  static async create(userId, paragraphId) {
    const timestamp = new Date().toISOString();

    const session = db.insert('unseen_sessions', {
      user_id: userId,
      paragraph_id: paragraphId,
      total_questions: 5,
      status: 'in_progress',
      score: null,
      correct_answers: null,
      started_at: timestamp,
      completed_at: null
    });

    return {
      id: session.id,
      user_id: session.user_id,
      paragraph_id: session.paragraph_id,
      total_questions: session.total_questions,
      status: session.status,
      started_at: session.started_at
    };
  }

  /**
   * Find a session by ID
   */
  static async findById(sessionId) {
    const session = db.findById('unseen_sessions', sessionId);
    if (!session) return undefined;

    return {
      id: session.id,
      user_id: session.user_id,
      paragraph_id: session.paragraph_id,
      score: session.score,
      correct_answers: session.correct_answers,
      total_questions: session.total_questions,
      started_at: session.started_at,
      completed_at: session.completed_at,
      status: session.status
    };
  }

  /**
   * Get session with paragraph and questions details
   */
  static async getSessionWithDetails(sessionId) {
    const session = db.findById('unseen_sessions', sessionId);
    if (!session) return undefined;

    // Get paragraph details
    const paragraphs = db.getCollection('unseen_paragraphs', true);
    const paragraphMap = new Map(paragraphs.map(p => [p.id, p]));
    const paragraph = paragraphMap.get(session.paragraph_id);

    return {
      id: session.id,
      user_id: session.user_id,
      paragraph_id: session.paragraph_id,
      score: session.score,
      correct_answers: session.correct_answers,
      total_questions: session.total_questions,
      started_at: session.started_at,
      completed_at: session.completed_at,
      status: session.status,
      title_en: paragraph?.title_en,
      title_he: paragraph?.title_he,
      content: paragraph?.content,
      complexity_level: paragraph?.complexity_level,
      topic: paragraph?.topic,
      hard_words: paragraph?.hard_words
    };
  }

  /**
   * Record an answer for a session
   */
  static async recordAnswer(sessionId, questionId, userAnswer, isCorrect) {
    const timestamp = new Date().toISOString();

    const answer = db.insert('unseen_answers', {
      session_id: sessionId,
      question_id: questionId,
      user_answer: userAnswer,
      is_correct: isCorrect,
      answered_at: timestamp
    });

    return {
      id: answer.id,
      session_id: answer.session_id,
      question_id: answer.question_id,
      is_correct: answer.is_correct
    };
  }

  /**
   * Get all answers for a session
   */
  static async getSessionAnswers(sessionId) {
    const answers = db.find('unseen_answers', { session_id: sessionId });

    // Get questions for joining
    const questions = db.getCollection('unseen_questions', true);
    const questionMap = new Map(questions.map(q => [q.id, q]));

    const result = answers.map(a => {
      const question = questionMap.get(a.question_id);
      return {
        id: a.id,
        session_id: a.session_id,
        question_id: a.question_id,
        user_answer: a.user_answer,
        is_correct: a.is_correct,
        answered_at: a.answered_at,
        question_number: question?.question_number,
        question_text_en: question?.question_text_en,
        question_text_he: question?.question_text_he,
        options: question?.options,
        correct_answer: question?.correct_answer,
        explanation_he: question?.explanation_he
      };
    });

    // Sort by question_number ascending
    result.sort((a, b) => (a.question_number || 0) - (b.question_number || 0));

    return result;
  }

  /**
   * Complete a session and calculate final score
   */
  static async complete(sessionId) {
    // Count correct answers
    const answers = db.find('unseen_answers', { session_id: sessionId });
    const correctCount = answers.filter(a => a.is_correct === true).length;

    // Calculate score percentage (out of 5 questions)
    const score = Math.round((correctCount / 5) * 100);
    const timestamp = new Date().toISOString();

    db.updateById('unseen_sessions', sessionId, {
      correct_answers: correctCount,
      score: score,
      completed_at: timestamp,
      status: 'completed'
    });

    const session = db.findById('unseen_sessions', sessionId);
    return {
      id: session.id,
      user_id: session.user_id,
      paragraph_id: session.paragraph_id,
      score: session.score,
      correct_answers: session.correct_answers,
      total_questions: session.total_questions,
      completed_at: session.completed_at
    };
  }

  /**
   * Get all sessions for a user
   */
  static async getByUser(userId, limit = 50) {
    const sessions = db.find('unseen_sessions', { user_id: userId });

    // Get paragraphs for joining
    const paragraphs = db.getCollection('unseen_paragraphs', true);
    const paragraphMap = new Map(paragraphs.map(p => [p.id, p]));

    const result = sessions.map(s => {
      const paragraph = paragraphMap.get(s.paragraph_id);
      return {
        id: s.id,
        paragraph_id: s.paragraph_id,
        score: s.score,
        correct_answers: s.correct_answers,
        total_questions: s.total_questions,
        started_at: s.started_at,
        completed_at: s.completed_at,
        status: s.status,
        title_en: paragraph?.title_en,
        title_he: paragraph?.title_he,
        complexity_level: paragraph?.complexity_level
      };
    });

    // Sort by started_at descending
    result.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));

    return result.slice(0, limit);
  }

  /**
   * Get sessions for a specific paragraph by a user
   */
  static async getByUserAndParagraph(userId, paragraphId, limit = 10) {
    const sessions = db.find('unseen_sessions', {
      user_id: userId,
      paragraph_id: paragraphId
    });

    const result = sessions.map(s => ({
      id: s.id,
      user_id: s.user_id,
      paragraph_id: s.paragraph_id,
      score: s.score,
      correct_answers: s.correct_answers,
      total_questions: s.total_questions,
      started_at: s.started_at,
      completed_at: s.completed_at,
      status: s.status
    }));

    // Sort by started_at descending
    result.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));

    return result.slice(0, limit);
  }

  /**
   * Mark session as abandoned
   */
  static async abandon(sessionId) {
    const result = db.updateById('unseen_sessions', sessionId, {
      status: 'abandoned'
    });

    if (result.modified === 0) return undefined;

    return { id: sessionId, status: 'abandoned' };
  }

  /**
   * Delete a session and all its answers
   */
  static async delete(sessionId) {
    const existing = db.findById('unseen_sessions', sessionId);
    if (!existing) return undefined;

    // Delete answers first (cascade delete simulation)
    db.delete('unseen_answers', { session_id: sessionId });

    // Delete the session
    db.deleteById('unseen_sessions', sessionId);

    return { id: sessionId };
  }

  /**
   * Get user's session statistics
   */
  static async getUserSessionStats(userId) {
    const sessions = db.find('unseen_sessions', { user_id: userId });

    const stats = {
      total_sessions: sessions.length,
      completed_sessions: 0,
      average_score: 0,
      highest_score: 0
    };

    let scoreSum = 0;
    let scoreCount = 0;

    for (const s of sessions) {
      if (s.status === 'completed') {
        stats.completed_sessions++;
        if (s.score !== null) {
          scoreSum += s.score;
          scoreCount++;
          if (s.score > stats.highest_score) {
            stats.highest_score = s.score;
          }
        }
      }
    }

    stats.average_score = scoreCount > 0 ? scoreSum / scoreCount : 0;

    return stats;
  }
}

module.exports = UnseenSession;
