const { db, indexManager } = require('../config/database');

class Lesson {
  /**
   * Get all lessons with optional filtering
   */
  static async findAll({ level, topicNumber } = {}) {
    let criteria = {};

    if (level) {
      criteria.level = level;
    }

    if (topicNumber) {
      criteria.topic_number = parseInt(topicNumber);
    }

    const lessons = db.find('lessons', criteria, { sort: { order_index: 'asc' } });

    // Return only the fields needed (without theory content)
    return lessons.map(l => ({
      id: l.id,
      topic_number: l.topic_number,
      subtopic_number: l.subtopic_number,
      title_en: l.title_en,
      title_he: l.title_he,
      level: l.level,
      order_index: l.order_index,
      created_at: l.created_at
    }));
  }

  /**
   * Get lesson by ID with full content
   */
  static async findById(id) {
    const lesson = db.findById('lessons', id);
    return lesson || null;
  }

  /**
   * Get lessons with user progress
   */
  static async findAllWithProgress(userId, { level, topicNumber } = {}) {
    let criteria = {};

    if (level) {
      criteria.level = level;
    }

    if (topicNumber) {
      criteria.topic_number = parseInt(topicNumber);
    }

    const lessons = db.find('lessons', criteria, { sort: { order_index: 'asc' } });

    // Get user progress for all lessons
    const userProgress = db.find('user_progress', { user_id: userId });
    const progressMap = new Map(userProgress.map(up => [up.lesson_id, up]));

    return lessons.map(l => {
      const progress = progressMap.get(l.id);
      return {
        id: l.id,
        topic_number: l.topic_number,
        subtopic_number: l.subtopic_number,
        title_en: l.title_en,
        title_he: l.title_he,
        level: l.level,
        order_index: l.order_index,
        status: progress?.status || null,
        best_score: progress?.best_score || null,
        attempts: progress?.attempts || null,
        first_completed_at: progress?.first_completed_at || null,
        last_attempted_at: progress?.last_attempted_at || null
      };
    });
  }

  /**
   * Create a new lesson
   */
  static async create(lessonData) {
    const {
      topicNumber,
      subtopicNumber,
      titleEn,
      titleHe,
      level,
      orderIndex,
      theoryContentHe,
      theoryContentEn
    } = lessonData;

    const lesson = db.insert('lessons', {
      topic_number: topicNumber,
      subtopic_number: subtopicNumber,
      title_en: titleEn,
      title_he: titleHe,
      level,
      order_index: orderIndex,
      theory_content_he: theoryContentHe,
      theory_content_en: theoryContentEn || null,
      created_at: new Date().toISOString()
    });

    return {
      id: lesson.id,
      topic_number: lesson.topic_number,
      subtopic_number: lesson.subtopic_number,
      title_en: lesson.title_en,
      title_he: lesson.title_he,
      level: lesson.level,
      order_index: lesson.order_index
    };
  }

  /**
   * Get next lesson by order
   */
  static async getNextLesson(currentOrderIndex) {
    const lessons = db.find('lessons',
      { order_index: { $gt: currentOrderIndex } },
      { sort: { order_index: 'asc' }, limit: 1 }
    );

    if (lessons.length === 0) return null;

    const l = lessons[0];
    return {
      id: l.id,
      topic_number: l.topic_number,
      subtopic_number: l.subtopic_number,
      title_en: l.title_en,
      title_he: l.title_he,
      level: l.level,
      order_index: l.order_index
    };
  }

  /**
   * Get previous lesson by order
   */
  static async getPreviousLesson(currentOrderIndex) {
    const lessons = db.find('lessons',
      { order_index: { $lt: currentOrderIndex } },
      { sort: { order_index: 'desc' }, limit: 1 }
    );

    if (lessons.length === 0) return null;

    const l = lessons[0];
    return {
      id: l.id,
      topic_number: l.topic_number,
      subtopic_number: l.subtopic_number,
      title_en: l.title_en,
      title_he: l.title_he,
      level: l.level,
      order_index: l.order_index
    };
  }
}

module.exports = Lesson;
