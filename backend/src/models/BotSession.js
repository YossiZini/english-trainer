const { db } = require('../config/database');

/**
 * A vocabulary session driven from a chat bot: 20 words, then rounds of the
 * failed words until none are left. One active session per chat.
 */
class BotSession {
  static async create({ userId, chatId, wordIds }) {
    const now = new Date().toISOString();
    return db.insert('bot_sessions', {
      user_id: userId,
      chat_id: String(chatId),
      word_ids: wordIds,
      queue: [...wordIds],
      round: 1,
      round_size: wordIds.length,
      asked_in_round: 0,
      failed_word_ids: [],
      correct_count: 0,
      wrong_count: 0,
      status: 'active',
      started_at: now,
      ended_at: null
    });
  }

  static async findActiveByChat(chatId) {
    const sessions = await db.find('bot_sessions', { chat_id: String(chatId), status: 'active' });
    if (sessions.length === 0) return null;
    sessions.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    return sessions[0];
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
