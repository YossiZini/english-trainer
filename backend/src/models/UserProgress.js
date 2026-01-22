const { db, indexManager } = require('../config/database');

class UserProgress {
  /**
   * Get or create progress for a lesson
   */
  static async findOrCreate(userId, lessonId) {
    // Try to find using composite index
    const existing = indexManager.findByCompositeIndex('user_progress_user_id_lesson_id', [userId, lessonId]);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new progress record
    const progress = db.insert('user_progress', {
      user_id: userId,
      lesson_id: lessonId,
      status: 'not_started',
      best_score: 0,
      attempts: 0,
      time_spent: 0,
      first_completed_at: null,
      last_attempted_at: null,
      created_at: new Date().toISOString()
    });

    return progress;
  }

  /**
   * Update progress after exercise completion
   */
  static async updateProgress(userId, lessonId, score, timeSpent) {
    const progress = await this.findOrCreate(userId, lessonId);

    const newAttempts = progress.attempts + 1;
    const newBestScore = Math.max(progress.best_score, score);
    const newTotalTime = progress.time_spent + timeSpent;
    const newStatus = score >= 70 ? 'completed' : 'in_progress';
    const firstCompletedAt = progress.first_completed_at || (score >= 70 ? new Date().toISOString() : null);
    const lastAttemptedAt = new Date().toISOString();

    db.updateById('user_progress', progress.id, {
      status: newStatus,
      best_score: newBestScore,
      attempts: newAttempts,
      time_spent: newTotalTime,
      first_completed_at: firstCompletedAt,
      last_attempted_at: lastAttemptedAt
    });

    return {
      id: progress.id,
      user_id: userId,
      lesson_id: lessonId,
      status: newStatus,
      best_score: newBestScore,
      attempts: newAttempts,
      first_completed_at: firstCompletedAt,
      last_attempted_at: lastAttemptedAt,
      time_spent: newTotalTime
    };
  }

  /**
   * Get progress for a specific lesson
   */
  static async getProgress(userId, lessonId) {
    const results = indexManager.findByCompositeIndex('user_progress_user_id_lesson_id', [userId, lessonId]);
    return results[0] || null;
  }

  /**
   * Get all progress for a user
   */
  static async getAllProgress(userId) {
    const progress = db.findByIndex('user_progress', 'user_id', userId);

    // Get lessons for joining
    const lessons = db.getCollection('lessons', true);
    const lessonMap = new Map(lessons.map(l => [l.id, l]));

    // Join with lessons
    const result = progress.map(up => {
      const lesson = lessonMap.get(up.lesson_id);
      return {
        id: up.id,
        user_id: up.user_id,
        lesson_id: up.lesson_id,
        status: up.status,
        best_score: up.best_score,
        attempts: up.attempts,
        first_completed_at: up.first_completed_at,
        last_attempted_at: up.last_attempted_at,
        time_spent: up.time_spent,
        title_en: lesson?.title_en,
        title_he: lesson?.title_he,
        topic_number: lesson?.topic_number,
        subtopic_number: lesson?.subtopic_number
      };
    });

    // Sort by lesson order_index
    result.sort((a, b) => {
      const lessonA = lessonMap.get(a.lesson_id);
      const lessonB = lessonMap.get(b.lesson_id);
      return (lessonA?.order_index || 0) - (lessonB?.order_index || 0);
    });

    return result;
  }

  /**
   * Get overall statistics for a user
   */
  static async getOverallStats(userId) {
    const progress = db.findByIndex('user_progress', 'user_id', userId);

    const stats = {
      total_lessons_attempted: progress.length,
      lessons_completed: 0,
      lessons_in_progress: 0,
      average_score: 0,
      total_time_spent: 0,
      total_attempts: 0,
      last_activity: null
    };

    let scoreSum = 0;
    let scoreCount = 0;

    for (const p of progress) {
      if (p.status === 'completed') {
        stats.lessons_completed++;
      } else if (p.status === 'in_progress') {
        stats.lessons_in_progress++;
      }

      if (p.best_score > 0) {
        scoreSum += p.best_score;
        scoreCount++;
      }

      stats.total_time_spent += p.time_spent || 0;
      stats.total_attempts += p.attempts || 0;

      if (!stats.last_activity || (p.last_attempted_at && p.last_attempted_at > stats.last_activity)) {
        stats.last_activity = p.last_attempted_at;
      }
    }

    stats.average_score = scoreCount > 0 ? Math.round(scoreSum / scoreCount * 100) / 100 : 0;

    return stats;
  }

  /**
   * Get progress grouped by topic
   */
  static async getProgressByTopic(userId) {
    const lessons = db.getCollection('lessons', true);
    const progress = db.findByIndex('user_progress', 'user_id', userId);
    const progressMap = new Map(progress.map(p => [p.lesson_id, p]));

    // Group by topic
    const topicStats = new Map();

    for (const lesson of lessons) {
      const topic = lesson.topic_number;
      if (!topicStats.has(topic)) {
        topicStats.set(topic, {
          topic_number: topic,
          total_lessons: 0,
          completed_count: 0,
          in_progress_count: 0,
          not_started_count: 0,
          scores: []
        });
      }

      const stat = topicStats.get(topic);
      stat.total_lessons++;

      const p = progressMap.get(lesson.id);
      if (!p || p.status === 'not_started') {
        stat.not_started_count++;
      } else if (p.status === 'completed') {
        stat.completed_count++;
        if (p.best_score > 0) stat.scores.push(p.best_score);
      } else if (p.status === 'in_progress') {
        stat.in_progress_count++;
        if (p.best_score > 0) stat.scores.push(p.best_score);
      }
    }

    // Calculate averages and format results
    const result = [];
    for (const [topic, stat] of topicStats) {
      result.push({
        topic_number: stat.topic_number,
        total_lessons: stat.total_lessons,
        completed_count: stat.completed_count,
        in_progress_count: stat.in_progress_count,
        not_started_count: stat.not_started_count,
        average_score: stat.scores.length > 0
          ? Math.round(stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length * 100) / 100
          : 0
      });
    }

    result.sort((a, b) => a.topic_number - b.topic_number);
    return result;
  }

  /**
   * Get recent activity (last N attempts)
   */
  static async getRecentActivity(userId, limit = 10) {
    const results = db.find('exercise_results', { user_id: userId });

    // Get lessons for joining
    const lessons = db.getCollection('lessons', true);
    const lessonMap = new Map(lessons.map(l => [l.id, l]));

    // Join and sort by completed_at
    const activity = results.map(er => {
      const lesson = lessonMap.get(er.lesson_id);
      return {
        id: er.id,
        lesson_id: er.lesson_id,
        attempt_number: er.attempt_number,
        score: er.score,
        total_questions: er.total_questions,
        correct_answers: er.correct_answers,
        wrong_answers: er.wrong_answers,
        time_spent: er.time_spent,
        completed_at: er.completed_at,
        difficulty: er.difficulty,
        title_he: lesson?.title_he,
        title_en: lesson?.title_en,
        subtopic_number: lesson?.subtopic_number
      };
    });

    // Sort by completed_at descending
    activity.sort((a, b) => {
      if (!a.completed_at) return 1;
      if (!b.completed_at) return -1;
      return new Date(b.completed_at) - new Date(a.completed_at);
    });

    return activity.slice(0, limit);
  }

  /**
   * Get next lesson to study (first incomplete or not started)
   */
  static async getNextLesson(userId) {
    const lessons = db.getCollection('lessons', true);
    const progress = db.findByIndex('user_progress', 'user_id', userId);
    const progressMap = new Map(progress.map(p => [p.lesson_id, p]));

    // Sort lessons by order_index
    const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

    for (const lesson of sortedLessons) {
      const p = progressMap.get(lesson.id);
      const status = p?.status || 'not_started';

      if (status !== 'completed') {
        return {
          id: lesson.id,
          title_he: lesson.title_he,
          title_en: lesson.title_en,
          subtopic_number: lesson.subtopic_number,
          status
        };
      }
    }

    return null;
  }

  /**
   * Get lesson completion percentage
   */
  static async getCompletionPercentage(userId) {
    const lessons = db.getCollection('lessons', true);
    const progress = db.findByIndex('user_progress', 'user_id', userId);

    const completedLessons = progress.filter(p => p.status === 'completed').length;
    const totalLessons = lessons.length;

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      percentage
    };
  }
}

module.exports = UserProgress;
