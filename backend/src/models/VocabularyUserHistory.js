const { db } = require('../config/database');

class VocabularyUserHistory {
  /**
   * Record a user's answer to a word
   */
  static async recordAnswer(userId, wordId, sessionId, isCorrect) {
    const timestamp = new Date().toISOString();

    const record = db.insert('vocabulary_user_history', {
      user_id: userId,
      word_id: wordId,
      quiz_session_id: sessionId,
      is_correct: isCorrect,
      answered_at: timestamp
    });

    return {
      id: record.id,
      user_id: record.user_id,
      word_id: record.word_id,
      is_correct: record.is_correct,
      answered_at: record.answered_at
    };
  }

  /**
   * Get IDs of words the user has answered correctly
   * Used to avoid repeating words
   */
  static async getCorrectlyAnsweredWordIds(userId) {
    const history = db.find('vocabulary_user_history', {
      user_id: userId,
      is_correct: true
    });

    // Get distinct word_ids
    const wordIdSet = new Set(history.map(h => h.word_id));
    return Array.from(wordIdSet);
  }

  /**
   * Get user's overall word performance statistics
   */
  static async getUserWordStats(userId) {
    const history = db.find('vocabulary_user_history', { user_id: userId });

    const wordIds = new Set();
    const correctWordIds = new Set();
    let correctAttempts = 0;
    let wrongAttempts = 0;

    for (const h of history) {
      wordIds.add(h.word_id);
      if (h.is_correct) {
        correctWordIds.add(h.word_id);
        correctAttempts++;
      } else {
        wrongAttempts++;
      }
    }

    return {
      total_words_attempted: wordIds.size,
      words_learned: correctWordIds.size,
      total_attempts: history.length,
      correct_attempts: correctAttempts,
      wrong_attempts: wrongAttempts
    };
  }

  /**
   * Get all answers for a specific session
   */
  static async getSessionHistory(sessionId) {
    const history = db.find('vocabulary_user_history', { quiz_session_id: sessionId });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = history.map(h => {
      const word = wordMap.get(h.word_id);
      return {
        id: h.id,
        word_id: h.word_id,
        is_correct: h.is_correct,
        answered_at: h.answered_at,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level
      };
    });

    // Sort by answered_at ascending
    result.sort((a, b) => new Date(a.answered_at) - new Date(b.answered_at));

    return result;
  }

  /**
   * Get user's recent activity
   */
  static async getRecentActivity(userId, limit = 10) {
    const history = db.find('vocabulary_user_history', { user_id: userId });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    // Get quiz sessions for joining
    const sessions = db.getCollection('vocabulary_quiz_sessions', true);
    const sessionMap = new Map(sessions.map(s => [s.id, s]));

    const result = history.map(h => {
      const word = wordMap.get(h.word_id);
      const session = sessionMap.get(h.quiz_session_id);
      return {
        id: h.id,
        word_id: h.word_id,
        is_correct: h.is_correct,
        answered_at: h.answered_at,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        quiz_type: session?.quiz_type
      };
    });

    // Sort by answered_at descending
    result.sort((a, b) => new Date(b.answered_at) - new Date(a.answered_at));

    return result.slice(0, limit);
  }

  /**
   * Get word accuracy for a user (how many times correct vs incorrect)
   */
  static async getWordAccuracy(userId, wordId) {
    const history = db.find('vocabulary_user_history', {
      user_id: userId,
      word_id: wordId
    });

    let correctAttempts = 0;
    let wrongAttempts = 0;

    for (const h of history) {
      if (h.is_correct) {
        correctAttempts++;
      } else {
        wrongAttempts++;
      }
    }

    return {
      total_attempts: history.length,
      correct_attempts: correctAttempts,
      wrong_attempts: wrongAttempts
    };
  }

  /**
   * Check if user has ever answered a word correctly
   */
  static async hasAnsweredCorrectly(userId, wordId) {
    const history = db.find('vocabulary_user_history', {
      user_id: userId,
      word_id: wordId,
      is_correct: true
    });

    return history.length > 0;
  }

  /**
   * Get user's progress by difficulty level
   */
  static async getProgressByDifficulty(userId) {
    const words = db.getCollection('vocabulary_words', true);
    const history = db.find('vocabulary_user_history', { user_id: userId });

    // Build a set of word IDs that user has answered correctly
    const correctWordIds = new Set();
    for (const h of history) {
      if (h.is_correct) {
        correctWordIds.add(h.word_id);
      }
    }

    // Group words by difficulty level
    const levelStats = new Map();

    for (const word of words) {
      const level = word.difficulty_level;
      if (!levelStats.has(level)) {
        levelStats.set(level, {
          difficulty_level: level,
          total_words_in_level: 0,
          words_learned_in_level: 0
        });
      }

      const stats = levelStats.get(level);
      stats.total_words_in_level++;
      if (correctWordIds.has(word.id)) {
        stats.words_learned_in_level++;
      }
    }

    // Convert to array and sort
    const result = Array.from(levelStats.values());
    result.sort((a, b) => a.difficulty_level - b.difficulty_level);

    return result;
  }

  /**
   * Delete history for a specific session (if needed for cleanup)
   */
  static async deleteSessionHistory(sessionId) {
    db.delete('vocabulary_user_history', { quiz_session_id: sessionId });
  }

  /**
   * Get user's complete attempt history with filtering and pagination
   * @param {string} userId - User ID
   * @param {object} options - Filter and pagination options
   * @returns {object} History data with pagination info
   */
  static async getUserHistory(userId, options = {}) {
    const {
      page = 1,
      limit = 50,
      filter = 'all', // 'all', 'success', 'failed'
      wordId = null,
      startDate = null,
      endDate = null
    } = options;

    const offset = (page - 1) * limit;

    // Get all history for user
    let history = db.find('vocabulary_user_history', { user_id: userId });

    // Apply filters
    if (filter === 'success') {
      history = history.filter(h => h.is_correct === true);
    } else if (filter === 'failed') {
      history = history.filter(h => h.is_correct === false);
    }

    if (wordId) {
      history = history.filter(h => h.word_id === wordId);
    }

    if (startDate) {
      history = history.filter(h => new Date(h.answered_at) >= new Date(startDate));
    }

    if (endDate) {
      history = history.filter(h => new Date(h.answered_at) <= new Date(endDate));
    }

    const totalRecords = history.length;

    // Sort by answered_at descending
    history.sort((a, b) => new Date(b.answered_at) - new Date(a.answered_at));

    // Apply pagination
    const paginated = history.slice(offset, offset + limit);

    // Get vocabulary words and sessions for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const sessions = db.getCollection('vocabulary_quiz_sessions', true);
    const sessionMap = new Map(sessions.map(s => [s.id, s]));

    const records = paginated.map(h => {
      const word = wordMap.get(h.word_id);
      const session = sessionMap.get(h.quiz_session_id);
      return {
        id: h.id,
        word_id: h.word_id,
        is_correct: h.is_correct,
        answered_at: h.answered_at,
        quiz_session_id: h.quiz_session_id,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        source: word?.source,
        quiz_type: session?.quiz_type,
        quiz_size: session?.quiz_size,
        difficulty_range_start: session?.difficulty_range_start,
        difficulty_range_end: session?.difficulty_range_end
      };
    });

    return {
      records,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasMore: offset + paginated.length < totalRecords
      },
      filters: {
        filter,
        wordId,
        startDate,
        endDate
      }
    };
  }

  /**
   * Get history statistics for a user
   * @param {string} userId - User ID
   * @returns {object} Statistics summary
   */
  static async getHistoryStats(userId) {
    const history = db.find('vocabulary_user_history', { user_id: userId });

    const stats = {
      totalAttempts: 0,
      totalSuccesses: 0,
      totalFailures: 0,
      uniqueWordsAttempted: 0,
      uniqueWordsSucceeded: 0,
      uniqueWordsFailed: 0,
      totalQuizSessions: 0,
      firstAttemptDate: null,
      lastAttemptDate: null
    };

    if (history.length === 0) {
      return {
        ...stats,
        successRate: 0
      };
    }

    const wordIds = new Set();
    const succeededWordIds = new Set();
    const failedWordIds = new Set();
    const sessionIds = new Set();

    let firstDate = null;
    let lastDate = null;

    for (const h of history) {
      stats.totalAttempts++;
      wordIds.add(h.word_id);
      sessionIds.add(h.quiz_session_id);

      if (h.is_correct) {
        stats.totalSuccesses++;
        succeededWordIds.add(h.word_id);
      } else {
        stats.totalFailures++;
        failedWordIds.add(h.word_id);
      }

      const answeredAt = new Date(h.answered_at);
      if (!firstDate || answeredAt < firstDate) {
        firstDate = answeredAt;
      }
      if (!lastDate || answeredAt > lastDate) {
        lastDate = answeredAt;
      }
    }

    stats.uniqueWordsAttempted = wordIds.size;
    stats.uniqueWordsSucceeded = succeededWordIds.size;
    stats.uniqueWordsFailed = failedWordIds.size;
    stats.totalQuizSessions = sessionIds.size;
    stats.firstAttemptDate = firstDate ? firstDate.toISOString() : null;
    stats.lastAttemptDate = lastDate ? lastDate.toISOString() : null;
    stats.successRate = stats.totalAttempts > 0
      ? Math.round((stats.totalSuccesses / stats.totalAttempts) * 100)
      : 0;

    return stats;
  }

  /**
   * Get aggregated history by word (each word with all its attempts)
   * @param {string} userId - User ID
   * @param {object} options - { page, limit, filter }
   * @returns {object} Aggregated word history with pagination
   */
  static async getAggregatedWordHistory(userId, options = {}) {
    const {
      page = 1,
      limit = 30,
      filter = 'all' // 'all', 'success', 'failed'
    } = options;

    const offset = (page - 1) * limit;

    const history = db.find('vocabulary_user_history', { user_id: userId });

    // Get vocabulary words and sessions for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const sessions = db.getCollection('vocabulary_quiz_sessions', true);
    const sessionMap = new Map(sessions.map(s => [s.id, s]));

    // Group by word_id
    const wordGroups = new Map();

    for (const h of history) {
      if (!wordGroups.has(h.word_id)) {
        wordGroups.set(h.word_id, []);
      }
      wordGroups.get(h.word_id).push(h);
    }

    // Build aggregated records
    let aggregated = [];

    for (const [wordId, attempts] of wordGroups) {
      const word = wordMap.get(wordId);

      // Sort attempts by answered_at descending
      attempts.sort((a, b) => new Date(b.answered_at) - new Date(a.answered_at));

      const successCount = attempts.filter(a => a.is_correct).length;
      const failCount = attempts.filter(a => !a.is_correct).length;
      const lastAttempt = attempts[0];
      const firstAttempt = attempts[attempts.length - 1];

      // Apply filter based on latest attempt result
      if (filter === 'success' && !lastAttempt.is_correct) continue;
      if (filter === 'failed' && lastAttempt.is_correct) continue;

      const attemptsArray = attempts.map(a => {
        const session = sessionMap.get(a.quiz_session_id);
        return {
          id: a.id,
          is_correct: a.is_correct,
          answered_at: a.answered_at,
          quiz_type: session?.quiz_type,
          source: session?.source
        };
      });

      aggregated.push({
        word_id: wordId,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        total_attempts: attempts.length,
        success_count: successCount,
        fail_count: failCount,
        last_attempt_at: lastAttempt.answered_at,
        first_attempt_at: firstAttempt.answered_at,
        attempts: attemptsArray
      });
    }

    const totalRecords = aggregated.length;

    // Sort by last_attempt_at descending
    aggregated.sort((a, b) => new Date(b.last_attempt_at) - new Date(a.last_attempt_at));

    // Apply pagination
    const paginated = aggregated.slice(offset, offset + limit);

    return {
      records: paginated,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasMore: offset + paginated.length < totalRecords
      },
      filters: {
        filter
      }
    };
  }
}

module.exports = VocabularyUserHistory;
