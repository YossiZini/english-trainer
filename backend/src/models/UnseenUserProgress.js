const { db } = require('../config/database');

class UnseenUserProgress {
  /**
   * Get user's progress for a specific paragraph
   */
  static async getByUserAndParagraph(userId, paragraphId) {
    const progress = db.findOne('unseen_user_progress', {
      user_id: userId,
      paragraph_id: paragraphId
    });

    if (!progress) return undefined;

    return {
      id: progress.id,
      user_id: progress.user_id,
      paragraph_id: progress.paragraph_id,
      best_score: progress.best_score,
      attempts: progress.attempts,
      last_attempted_at: progress.last_attempted_at,
      first_completed_at: progress.first_completed_at,
      created_at: progress.created_at,
      updated_at: progress.updated_at
    };
  }

  /**
   * Get all progress for a user
   */
  static async getAllByUser(userId) {
    const progress = db.find('unseen_user_progress', { user_id: userId });

    // Get paragraphs for joining
    const paragraphs = db.getCollection('unseen_paragraphs', true);
    const paragraphMap = new Map(paragraphs.map(p => [p.id, p]));

    const result = progress.map(up => {
      const paragraph = paragraphMap.get(up.paragraph_id);
      return {
        id: up.id,
        user_id: up.user_id,
        paragraph_id: up.paragraph_id,
        best_score: up.best_score,
        attempts: up.attempts,
        last_attempted_at: up.last_attempted_at,
        first_completed_at: up.first_completed_at,
        title_en: paragraph?.title_en,
        title_he: paragraph?.title_he,
        complexity_level: paragraph?.complexity_level,
        topic: paragraph?.topic
      };
    });

    // Sort by last_attempted_at descending
    result.sort((a, b) => new Date(b.last_attempted_at) - new Date(a.last_attempted_at));

    return result;
  }

  /**
   * Create or update progress after completing a session
   */
  static async upsertProgress(userId, paragraphId, sessionScore) {
    const existing = db.findOne('unseen_user_progress', {
      user_id: userId,
      paragraph_id: paragraphId
    });

    const timestamp = new Date().toISOString();

    if (existing) {
      // Update existing record
      const newBestScore = Math.max(existing.best_score || 0, sessionScore);
      const newAttempts = (existing.attempts || 0) + 1;

      db.updateById('unseen_user_progress', existing.id, {
        best_score: newBestScore,
        attempts: newAttempts,
        last_attempted_at: timestamp,
        updated_at: timestamp
      });

      return {
        id: existing.id,
        user_id: userId,
        paragraph_id: paragraphId,
        best_score: newBestScore,
        attempts: newAttempts
      };
    }

    // Create new record
    const progress = db.insert('unseen_user_progress', {
      user_id: userId,
      paragraph_id: paragraphId,
      best_score: sessionScore,
      attempts: 1,
      last_attempted_at: timestamp,
      first_completed_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp
    });

    return {
      id: progress.id,
      user_id: progress.user_id,
      paragraph_id: progress.paragraph_id,
      best_score: progress.best_score,
      attempts: progress.attempts
    };
  }

  /**
   * Get user's overall statistics
   */
  static async getUserStats(userId) {
    const progress = db.find('unseen_user_progress', { user_id: userId });

    const stats = {
      total_attempted: progress.length,
      excellent_count: 0,
      good_count: 0,
      needs_work_count: 0,
      average_score: 0,
      total_attempts: 0
    };

    let scoreSum = 0;

    for (const p of progress) {
      if (p.best_score >= 80) {
        stats.excellent_count++;
      } else if (p.best_score >= 60) {
        stats.good_count++;
      } else {
        stats.needs_work_count++;
      }

      scoreSum += p.best_score || 0;
      stats.total_attempts += p.attempts || 0;
    }

    stats.average_score = progress.length > 0 ? scoreSum / progress.length : 0;

    return stats;
  }

  /**
   * Get progress with paragraph details for a user
   */
  static async getProgressWithDetails(userId) {
    const progress = db.find('unseen_user_progress', { user_id: userId });

    // Get paragraphs for joining
    const paragraphs = db.getCollection('unseen_paragraphs', true);
    const paragraphMap = new Map(paragraphs.map(p => [p.id, p]));

    const result = progress.map(up => {
      const paragraph = paragraphMap.get(up.paragraph_id);
      return {
        paragraph_id: up.paragraph_id,
        best_score: up.best_score,
        attempts: up.attempts,
        last_attempted_at: up.last_attempted_at,
        title_en: paragraph?.title_en,
        title_he: paragraph?.title_he,
        complexity_level: paragraph?.complexity_level,
        topic: paragraph?.topic
      };
    });

    // Sort by last_attempted_at descending
    result.sort((a, b) => new Date(b.last_attempted_at) - new Date(a.last_attempted_at));

    return result;
  }

  /**
   * Get paragraphs not yet attempted by user
   */
  static async getUnattemptedParagraphs(userId) {
    const progress = db.find('unseen_user_progress', { user_id: userId });
    const attemptedIds = new Set(progress.map(p => p.paragraph_id));

    const paragraphs = db.getCollection('unseen_paragraphs', true);

    // Filter out attempted paragraphs
    const unattempted = paragraphs.filter(p => !attemptedIds.has(p.id));

    // Sort by complexity_level ascending, then by title_en ascending
    unattempted.sort((a, b) => {
      if (a.complexity_level !== b.complexity_level) {
        return a.complexity_level - b.complexity_level;
      }
      return (a.title_en || '').localeCompare(b.title_en || '');
    });

    return unattempted.map(p => ({
      id: p.id,
      title_en: p.title_en,
      title_he: p.title_he,
      complexity_level: p.complexity_level,
      topic: p.topic
    }));
  }

  /**
   * Get count of paragraphs by complexity level that user has attempted
   */
  static async getProgressByComplexity(userId) {
    const progress = db.find('unseen_user_progress', { user_id: userId });

    // Get paragraphs for joining
    const paragraphs = db.getCollection('unseen_paragraphs', true);
    const paragraphMap = new Map(paragraphs.map(p => [p.id, p]));

    // Group by complexity level
    const levelStats = new Map();

    for (const up of progress) {
      const paragraph = paragraphMap.get(up.paragraph_id);
      if (!paragraph) continue;

      const level = paragraph.complexity_level;
      if (!levelStats.has(level)) {
        levelStats.set(level, {
          complexity_level: level,
          attempted_count: 0,
          scores: []
        });
      }

      const stats = levelStats.get(level);
      stats.attempted_count++;
      stats.scores.push(up.best_score || 0);
    }

    // Calculate averages and format results
    const result = [];
    for (const [level, stats] of levelStats) {
      const avgScore = stats.scores.length > 0
        ? stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length
        : 0;

      result.push({
        complexity_level: stats.complexity_level,
        attempted_count: stats.attempted_count,
        average_score: avgScore
      });
    }

    result.sort((a, b) => a.complexity_level - b.complexity_level);

    return result;
  }

  /**
   * Delete progress for a user and paragraph
   */
  static async delete(userId, paragraphId) {
    const existing = db.findOne('unseen_user_progress', {
      user_id: userId,
      paragraph_id: paragraphId
    });

    if (!existing) return undefined;

    db.deleteById('unseen_user_progress', existing.id);

    return { id: existing.id };
  }
}

module.exports = UnseenUserProgress;
