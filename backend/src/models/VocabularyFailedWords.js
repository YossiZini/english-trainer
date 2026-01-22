const { db } = require('../config/database');

class VocabularyFailedWords {
  /**
   * Add a failed word or increment fail count if it already exists
   */
  static async addOrIncrementFail(userId, wordId) {
    // Check if record already exists
    const existing = db.findOne('vocabulary_failed_words', {
      user_id: userId,
      word_id: wordId
    });

    if (existing) {
      // Update existing record
      const timestamp = new Date().toISOString();
      db.updateById('vocabulary_failed_words', existing.id, {
        fail_count: existing.fail_count + 1,
        last_failed_at: timestamp,
        is_pending_review: true
      });

      return {
        id: existing.id,
        user_id: existing.user_id,
        word_id: existing.word_id,
        fail_count: existing.fail_count + 1,
        is_pending_review: true
      };
    }

    // Create new record
    const record = db.insert('vocabulary_failed_words', {
      user_id: userId,
      word_id: wordId,
      fail_count: 1,
      is_pending_review: true,
      last_failed_at: new Date().toISOString(),
      reviewed_in_session_id: null
    });

    return {
      id: record.id,
      user_id: record.user_id,
      word_id: record.word_id,
      fail_count: record.fail_count,
      is_pending_review: record.is_pending_review
    };
  }

  /**
   * Get all pending review words for a user
   */
  static async getPendingReviewWords(userId, limit = null) {
    const failedWords = db.find('vocabulary_failed_words', {
      user_id: userId,
      is_pending_review: true
    });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = failedWords.map(fw => {
      const word = wordMap.get(fw.word_id);
      return {
        id: fw.id,
        word_id: fw.word_id,
        fail_count: fw.fail_count,
        last_failed_at: fw.last_failed_at,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level,
        sentence_en: word?.sentence_en,
        sentence_he: word?.sentence_he
      };
    });

    // Sort by last_failed_at descending
    result.sort((a, b) => new Date(b.last_failed_at) - new Date(a.last_failed_at));

    if (limit !== null) {
      return result.slice(0, limit);
    }

    return result;
  }

  /**
   * Get count of pending review words
   */
  static async getPendingReviewCount(userId) {
    const failedWords = db.find('vocabulary_failed_words', {
      user_id: userId,
      is_pending_review: true
    });

    return failedWords.length;
  }

  /**
   * Mark words as reviewed (link to review session)
   */
  static async markAsReviewed(userId, wordIds, sessionId) {
    if (!wordIds || wordIds.length === 0) {
      return [];
    }

    const wordIdSet = new Set(wordIds);
    const failedWords = db.find('vocabulary_failed_words', { user_id: userId });

    const updated = [];
    for (const fw of failedWords) {
      if (wordIdSet.has(fw.word_id)) {
        db.updateById('vocabulary_failed_words', fw.id, {
          reviewed_in_session_id: sessionId
        });
        updated.push({
          id: fw.id,
          word_id: fw.word_id,
          reviewed_in_session_id: sessionId
        });
      }
    }

    return updated;
  }

  /**
   * Reset word status after successful review (remove from pending)
   */
  static async resetWordStatus(userId, wordId) {
    const existing = db.findOne('vocabulary_failed_words', {
      user_id: userId,
      word_id: wordId
    });

    if (!existing) {
      return undefined;
    }

    db.updateById('vocabulary_failed_words', existing.id, {
      is_pending_review: false
    });

    return {
      id: existing.id,
      word_id: existing.word_id,
      is_pending_review: false
    };
  }

  /**
   * Remove a word from failed words (if user mastered it)
   */
  static async removeWord(userId, wordId) {
    const existing = db.findOne('vocabulary_failed_words', {
      user_id: userId,
      word_id: wordId
    });

    if (!existing) {
      return undefined;
    }

    db.deleteById('vocabulary_failed_words', existing.id);

    return { id: existing.id };
  }

  /**
   * Get word IDs that are pending review for a user
   */
  static async getPendingReviewWordIds(userId) {
    const failedWords = db.find('vocabulary_failed_words', {
      user_id: userId,
      is_pending_review: true
    });

    return failedWords.map(fw => fw.word_id);
  }

  /**
   * Get user's failed words statistics
   */
  static async getUserFailedStats(userId) {
    const failedWords = db.find('vocabulary_failed_words', { user_id: userId });

    let pendingReviewWords = 0;
    let reviewedWords = 0;
    let totalFails = 0;

    for (const fw of failedWords) {
      if (fw.is_pending_review) {
        pendingReviewWords++;
      } else {
        reviewedWords++;
      }
      totalFails += fw.fail_count || 0;
    }

    return {
      total_failed_words: failedWords.length,
      pending_review_words: pendingReviewWords,
      reviewed_words: reviewedWords,
      total_fails: totalFails
    };
  }

  /**
   * Get most failed words for a user (top mistakes)
   */
  static async getTopFailedWords(userId, limit = 10) {
    const failedWords = db.find('vocabulary_failed_words', { user_id: userId });

    // Get vocabulary words for joining
    const words = db.getCollection('vocabulary_words', true);
    const wordMap = new Map(words.map(w => [w.id, w]));

    const result = failedWords.map(fw => {
      const word = wordMap.get(fw.word_id);
      return {
        word_id: fw.word_id,
        fail_count: fw.fail_count,
        is_pending_review: fw.is_pending_review,
        last_failed_at: fw.last_failed_at,
        english_word: word?.english_word,
        hebrew_translation: word?.hebrew_translation,
        difficulty_level: word?.difficulty_level
      };
    });

    // Sort by fail_count descending, then by last_failed_at descending
    result.sort((a, b) => {
      if (b.fail_count !== a.fail_count) {
        return b.fail_count - a.fail_count;
      }
      return new Date(b.last_failed_at) - new Date(a.last_failed_at);
    });

    return result.slice(0, limit);
  }

  /**
   * Clear all pending review words (after successful review session)
   */
  static async clearPendingReview(userId, wordIds) {
    if (!wordIds || wordIds.length === 0) {
      return 0;
    }

    const wordIdSet = new Set(wordIds);
    const failedWords = db.find('vocabulary_failed_words', {
      user_id: userId,
      is_pending_review: true
    });

    let count = 0;
    for (const fw of failedWords) {
      if (wordIdSet.has(fw.word_id)) {
        db.updateById('vocabulary_failed_words', fw.id, {
          is_pending_review: false
        });
        count++;
      }
    }

    return count;
  }

  /**
   * Check if a word is in the user's failed words list
   */
  static async isWordFailed(userId, wordId) {
    const existing = db.findOne('vocabulary_failed_words', {
      user_id: userId,
      word_id: wordId
    });

    return existing !== null && existing !== undefined;
  }
}

module.exports = VocabularyFailedWords;
