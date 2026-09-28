const { db } = require('../config/database');

/**
 * A vocabulary session driven from a chat bot. It starts in `setup`, where
 * the student picks the word set and the level, then holds 20 words and
 * rounds of the failed words until none are left. One active session per
 * chat.
 */
class BotSession {
  static async create({ userId, chatId }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      user_id: userId,
      chat_id: String(chatId),
      status: 'setup',
      setup_step: 'type',
      word_set: null,
      level: null,
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

  /** The chat's open session (in setup or active), newest first. */
  static async findOpenByChat(chatId) {
    const sessions = await db.find('bot_sessions', { chat_id: String(chatId) });
    const open = sessions.filter(s => s.status === 'setup' || s.status === 'active');
    if (open.length === 0) return null;
    open.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    return open[0];
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
