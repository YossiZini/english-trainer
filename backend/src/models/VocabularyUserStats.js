const { db } = require('../config/database');

class VocabularyUserStats {
  /**
   * Find or create stats record for a user
   */
  static async findOrCreate(userId) {
    // Try to find existing record
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });

    if (existing) {
      return existing;
    }

    // Create new record
    const timestamp = new Date().toISOString();
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: 0,
      total_words_learned: 0,
      total_quizzes_completed: 0,
      total_review_sessions: 0,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats;
  }

  /**
   * Get user stats
   */
  static async getStats(userId) {
    const stats = db.findOne('vocabulary_user_stats', { user_id: userId });
    return stats || undefined;
  }

  /**
   * Increment accumulated fails
   */
  static async incrementFails(userId, count = 1) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    const timestamp = new Date().toISOString();

    if (existing) {
      const newFails = existing.accumulated_fails + count;
      db.updateById('vocabulary_user_stats', existing.id, {
        accumulated_fails: newFails,
        updated_at: timestamp
      });
      return newFails;
    }

    // Create new record
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: count,
      total_words_learned: 0,
      total_quizzes_completed: 0,
      total_review_sessions: 0,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats.accumulated_fails;
  }

  /**
   * Decrement accumulated fails (after review correct answers)
   */
  static async decrementFails(userId, count) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });

    if (!existing) {
      return 0;
    }

    const timestamp = new Date().toISOString();
    const newFails = Math.max(0, existing.accumulated_fails - count);
    db.updateById('vocabulary_user_stats', existing.id, {
      accumulated_fails: newFails,
      updated_at: timestamp
    });

    return newFails;
  }

  /**
   * Reset accumulated fails to zero
   */
  static async resetFails(userId) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });

    if (!existing) {
      return undefined;
    }

    const timestamp = new Date().toISOString();
    db.updateById('vocabulary_user_stats', existing.id, {
      accumulated_fails: 0,
      updated_at: timestamp
    });

    return { accumulated_fails: 0 };
  }

  /**
   * Set accumulated fails to a specific value
   */
  static async setFails(userId, count) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    const timestamp = new Date().toISOString();

    if (existing) {
      db.updateById('vocabulary_user_stats', existing.id, {
        accumulated_fails: count,
        updated_at: timestamp
      });
      return count;
    }

    // Create new record
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: count,
      total_words_learned: 0,
      total_quizzes_completed: 0,
      total_review_sessions: 0,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats.accumulated_fails;
  }

  /**
   * Increment total words learned
   */
  static async incrementWordsLearned(userId, count = 1) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    const timestamp = new Date().toISOString();

    if (existing) {
      const newCount = (existing.total_words_learned || 0) + count;
      db.updateById('vocabulary_user_stats', existing.id, {
        total_words_learned: newCount,
        updated_at: timestamp
      });
      return newCount;
    }

    // Create new record
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: 0,
      total_words_learned: count,
      total_quizzes_completed: 0,
      total_review_sessions: 0,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats.total_words_learned;
  }

  /**
   * Update total words learned to a specific count
   */
  static async updateWordsLearned(userId, count) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    const timestamp = new Date().toISOString();

    if (existing) {
      db.updateById('vocabulary_user_stats', existing.id, {
        total_words_learned: count,
        updated_at: timestamp
      });
      return count;
    }

    // Create new record
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: 0,
      total_words_learned: count,
      total_quizzes_completed: 0,
      total_review_sessions: 0,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats.total_words_learned;
  }

  /**
   * Increment total quizzes completed
   */
  static async incrementQuizzesCompleted(userId) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    const timestamp = new Date().toISOString();

    if (existing) {
      const newCount = (existing.total_quizzes_completed || 0) + 1;
      db.updateById('vocabulary_user_stats', existing.id, {
        total_quizzes_completed: newCount,
        updated_at: timestamp
      });
      return newCount;
    }

    // Create new record
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: 0,
      total_words_learned: 0,
      total_quizzes_completed: 1,
      total_review_sessions: 0,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats.total_quizzes_completed;
  }

  /**
   * Increment total review sessions
   */
  static async incrementReviewSessions(userId) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    const timestamp = new Date().toISOString();

    if (existing) {
      const newCount = (existing.total_review_sessions || 0) + 1;
      db.updateById('vocabulary_user_stats', existing.id, {
        total_review_sessions: newCount,
        updated_at: timestamp
      });
      return newCount;
    }

    // Create new record
    const stats = db.insert('vocabulary_user_stats', {
      user_id: userId,
      accumulated_fails: 0,
      total_words_learned: 0,
      total_quizzes_completed: 0,
      total_review_sessions: 1,
      created_at: timestamp,
      updated_at: timestamp
    });

    return stats.total_review_sessions;
  }

  /**
   * Get accumulated fails count
   */
  static async getAccumulatedFails(userId) {
    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });
    return existing ? (existing.accumulated_fails || 0) : 0;
  }

  /**
   * Check if review mode should be triggered (accumulated_fails >= 10)
   */
  static async shouldTriggerReview(userId) {
    const fails = await this.getAccumulatedFails(userId);
    return fails >= 10;
  }

  /**
   * Update all stats at once
   */
  static async updateStats(userId, updates) {
    const {
      accumulated_fails,
      total_words_learned,
      total_quizzes_completed,
      total_review_sessions
    } = updates;

    const existing = db.findOne('vocabulary_user_stats', { user_id: userId });

    if (!existing) {
      return this.getStats(userId);
    }

    const updateData = { updated_at: new Date().toISOString() };

    if (accumulated_fails !== undefined) {
      updateData.accumulated_fails = accumulated_fails;
    }
    if (total_words_learned !== undefined) {
      updateData.total_words_learned = total_words_learned;
    }
    if (total_quizzes_completed !== undefined) {
      updateData.total_quizzes_completed = total_quizzes_completed;
    }
    if (total_review_sessions !== undefined) {
      updateData.total_review_sessions = total_review_sessions;
    }

    db.updateById('vocabulary_user_stats', existing.id, updateData);

    return db.findById('vocabulary_user_stats', existing.id);
  }

  /**
   * Delete user stats (for cleanup)
   */
  static async delete(userId) {
    db.delete('vocabulary_user_stats', { user_id: userId });
  }
}

module.exports = VocabularyUserStats;
