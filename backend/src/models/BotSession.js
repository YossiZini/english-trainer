const { db } = require('../config/database');

/** The fields that close a session. */
const endFields = (reason) => ({ status: 'ended', end_reason: reason, ended_at: new Date().toISOString() });

/**
 * A practice session driven from a chat bot. `kind` is 'vocab', 'exercise',
 * 'review', 'drill' or 'unseen'. A vocabulary session starts in `setup`, where the student
 * picks the level and the direction ('en-he' shows the English word, 'he-en'
 * the Hebrew; rows without one are 'en-he'), then holds 20 words (from all words) and rounds of the
 * failed words until none are left. An exercise session holds one lesson's
 * questions (createExercise); a drill, ten multiplication-table questions
 * (createDrill); an unseen, one reading text's questions (createUnseen). One
 * open session per chat, of any kind.
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

  /**
   * A subject's mistakes exam: an exercise session (same answers, report and
   * end) whose questions are the student's unfixed mistakes in the subject,
   * frozen at start. Each right answer fixes its mistake at once.
   */
  static async createMistakes({ userId, chatId, subject, waiting, exercises }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'exercise',
      source: 'mistakes',
      user_id: userId,
      chat_id: String(chatId),
      status: 'active',
      lesson_id: null,
      lesson_title: null,
      lesson_number: null,
      subject,
      difficulty: null,
      waiting,
      exercises,
      index: 0,
      answers: [],
      correct_count: 0,
      fixed_count: 0,
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

  /** The admin's review of reported questions (kind 'review'): mode manual | auto. */
  static async createReview({ userId, chatId, mode }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'review',
      user_id: userId,
      chat_id: String(chatId),
      status: 'active',
      mode,
      current: null,
      proposal: null,
      skipped: [],
      counts: {},
      started_at: now,
      ended_at: null
    });
  }

  /**
   * A /kefel drill (kind 'drill'): ten multiplication-table questions made at
   * start ({ text, answer }), answered by typing the number. Only the counts
   * and the missed questions are kept: nothing goes to results, points,
   * progress or mistakes (/usage counts the answered questions).
   */
  static async createDrill({ userId, chatId, questions }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'drill',
      user_id: userId,
      chat_id: String(chatId),
      status: 'active',
      questions,
      index: 0,
      correct_count: 0,
      wrong_count: 0,
      wrong_streak: 0,
      missed: [],
      started_at: now,
      ended_at: null
    });
  }

  /**
   * A reading from the website's Unseen section (kind 'unseen'): the text's
   * number in the list, its titles and level, its questions frozen at start
   * ({ id, text, textHe, options, answer, explanation }), and the website's
   * reading session (unseen_sessions) that records the answers and the score.
   */
  static async createUnseen({ userId, chatId, paragraph, number, count, questions, unseenSessionId }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      kind: 'unseen',
      user_id: userId,
      chat_id: String(chatId),
      status: 'active',
      paragraph_id: paragraph.id,
      number,
      count,
      title_en: paragraph.title_en,
      title_he: paragraph.title_he || null,
      level: paragraph.complexity_level,
      questions,
      unseen_session_id: unseenSessionId,
      index: 0,
      answers: [],
      correct_count: 0,
      wrong_count: 0,
      wrong_streak: 0,
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

  /** End the session; `updates` (the last answer's counts) are saved in the same write. */
  static async end(id, reason = 'ended', updates = {}) {
    return this.update(id, { ...updates, ...endFields(reason) });
  }

  /**
   * One answer, applied only while the session is still active at question
   * `index` (a Firestore transaction): of two answers sent together, the
   * first moves the session on and the second changes nothing. With
   * `endReason` the same write ends the session. Returns the session after
   * the write, or null when that question was already answered.
   */
  static async claimAnswer(id, index, updates, endReason = null) {
    let claimed = false;
    const after = await db.transactUpdate('bot_sessions', id, (current) => {
      // A transaction may run this more than once; the last run decides.
      claimed = current.status === 'active' && current.index === index;
      if (!claimed) return null;
      return endReason ? { ...updates, ...endFields(endReason) } : updates;
    });
    return claimed ? after : null;
  }

  /**
   * Bot words exams and /kefel drills started at or after `since` (ISO) with
   * at least one answer, for the usage summary:
   * { kind: 'words' | 'drill', userId, startedAt, answers }. A drill's
   * answers are its graded questions (a text that was not a number is none).
   */
  static async practiceAnswersSince(since) {
    const sessions = await db.findSince('bot_sessions', 'started_at', since);
    return sessions
      .filter(s => s.user_id)
      .map((s) => {
        const kind = this.kindOf(s);
        if (kind === 'vocab') {
          return { kind: 'words', userId: s.user_id, startedAt: s.started_at, answers: (s.correct_count || 0) + (s.wrong_count || 0) };
        }
        if (kind === 'drill') return { kind: 'drill', userId: s.user_id, startedAt: s.started_at, answers: s.index || 0 };
        return null;
      })
      .filter(s => s && s.answers > 0);
  }
}

module.exports = BotSession;
