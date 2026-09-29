const { db } = require('../config/database');

/**
 * A practice session driven from a chat bot. `kind` is 'vocab' or
 * 'exercise'. A vocabulary session starts in `setup`, where the student
 * picks the level and the direction ('en-he' shows the English word, 'he-en'
 * the Hebrew; rows without one are 'en-he'), then holds 20 words (from all words) and rounds of the
 * failed words until none are left. An exercise session holds one lesson's
 * questions (createExercise). One open session per chat, of either kind.
 */
class BotSession {
  static async create({ userId, chatId }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'vocab',
      user_id: userId,
      chat_id: String(chatId),
      status: 'setup',
      setup_step: 'level',
      level: null,
      direction: null,
      word_ids: [],
      queue: [],
      round: 1,
      round_size: 0,
      asked_in_round: 0,
      failed_word_ids: [],
      correct_count: 0,
      wrong_count: 0,
      points_earned: 0,
      started_at: now,
      ended_at: null
    });
  }

  /**
   * A lesson-exercise session: the lesson's questions frozen at start (ids,
   * type, options in the order shown), then one answer per question. The
   * answers are graded together at the end, like the web exercise page.
   */
  static async createExercise({ userId, chatId, lesson, number, difficulty, exercises }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'exercise',
      user_id: userId,
      chat_id: String(chatId),
      status: 'active',
      lesson_id: lesson.id,
      lesson_title: lesson.title_he,
      lesson_number: number,
      subject: lesson.subject || 'english',
      difficulty,
      exercises,
      index: 0,
      answers: [],
      correct_count: 0,
      started_at: now,
      ended_at: null
    });
  }

  /** An exercise session waiting for the student to pick a lesson from a list. */
  static async createLessonPick({ userId, chatId, subject }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'exercise',
      user_id: userId,
      chat_id: String(chatId),
      status: 'setup',
      setup_step: 'lesson',
      subject,
      page: 1,
      started_at: now,
      ended_at: null
    });
  }

  /** Session kind; rows from before exercise sessions are vocabulary sessions. */
  static kindOf(session) {
    return (session && session.kind) || 'vocab';
  }

  /** The chat's open session (in setup or active), newest first. */
  static async findOpenByChat(chatId) {
    const sessions = await db.find('bot_sessions', { chat_id: String(chatId) });
    const open = sessions.filter(s => s.status === 'setup' || s.status === 'active');
    if (open.length === 0) return null;
    open.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    return open[0];
  }

  /** The student's latest lesson-exercise session in this chat with questions (open or ended), or null. */
  static async findLatestExercise(chatId, userId) {
    const sessions = await db.find('bot_sessions', { chat_id: String(chatId) });
    const found = sessions.filter(s => s.user_id === userId && s.kind === 'exercise' && Array.isArray(s.exercises));
    found.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    return found[0] || null;
  }

  /** The student's latest finished vocabulary session in this chat that had words, or null. */
  static async findLastFinishedVocab(chatId, userId) {
    const sessions = await db.find('bot_sessions', { chat_id: String(chatId) });
    const done = sessions.filter(s => s.status === 'ended' && s.user_id === userId
      && this.kindOf(s) === 'vocab' && Array.isArray(s.word_ids) && s.word_ids.length > 0);
    done.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    return done[0] || null;
  }

  static async findById(id) {
    return db.findById('bot_sessions', id);
  }

  static async update(id, updates) {
    await db.updateById('bot_sessions', id, updates);
    return db.findById('bot_sessions', id);
  }

  static async end(id, reason = 'ended') {
    return this.update(id, { status: 'ended', end_reason: reason, ended_at: new Date().toISOString() });
  }
}

module.exports = BotSession;
