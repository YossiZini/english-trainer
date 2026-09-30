const { db } = require('../config/database');
const { compareLessons } = require('../utils/lessonOrder');

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

    const lessons = await db.find('lessons', criteria, { sort: { order_index: 'asc' } });

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
    const lesson = await db.findById('lessons', id);
    return lesson || null;
  }

  /** A subject's lessons in curriculum order (topic, then subtopic). */
  static async listBySubject(subject) {
    const lessons = await db.find('lessons', {});
    return lessons.filter(l => (l.subject || 'english') === subject).sort(compareLessons);
  }

  /**
   * Get lessons with user progress
   */
  static async findAllWithProgress(userId, { level, topicNumber, subject } = {}) {
    let criteria = {};

    if (level) {
      criteria.level = level;
    }

    if (topicNumber) {
      criteria.topic_number = parseInt(topicNumber);
    }

    // 'english' | 'math' | 'arabic'; no filter returns every subject
    if (subject) {
      criteria.subject = subject;
    }

    const lessons = await db.find('lessons', criteria, { sort: { order_index: 'asc' } });

    // Get user progress for all lessons
    const userProgress = await db.find('user_progress', { user_id: userId });
    const progressMap = new Map(userProgress.map(up => [up.lesson_id, up]));

    return lessons.map(l => {
      const progress = progressMap.get(l.id);
      return {
        id: l.id,
        subject: l.subject || 'english',
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

    const lesson = await db.insert('lessons', {
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
   * The lesson after `lesson` within the same subject, or null. Takes the
   * lesson object so callers cannot forget the subject. Curriculum order
   * (topic, then subtopic): English lessons store order_index per topic.
   */
  static async getNextLesson(lesson) {
    return this._neighbour(lesson, +1);
  }

  /** The lesson before `lesson` within the same subject, or null. */
  static async getPreviousLesson(lesson) {
    return this._neighbour(lesson, -1);
  }

  static async _neighbour(lesson, step) {
    const subject = lesson.subject || 'english';
    const lessons = (await db.find('lessons', {})).filter(l => (l.subject || 'english') === subject).sort(compareLessons);
    const index = lessons.findIndex(l => l.id === lesson.id);
    const l = index >= 0 ? lessons[index + step] : null;
    if (!l) return null;
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
