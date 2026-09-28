const crypto = require('crypto');
const { db } = require('../config/database');
const { LINK_CODE_MINUTES } = require('../config/bot');

const hash = (code) => crypto.createHash('sha256').update(String(code)).digest('hex');

/**
 * Links a Telegram chat to a student. A student requests a one-time code in
 * the web app and sends it to the bot; the record then carries the chat id.
 * Only the hash of the code is stored.
 */
class TelegramLink {
  static async findByUser(userId) {
    return db.findOne('telegram_links', { user_id: userId });
  }

  static async findByChat(chatId) {
    return db.findOne('telegram_links', { chat_id: String(chatId) });
  }

  /** Create (or replace) the student's pending code. Returns the plain code once. */
  static async issueCode(userId) {
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const expiresAt = new Date(Date.now() + LINK_CODE_MINUTES * 60 * 1000).toISOString();
    const existing = await this.findByUser(userId);
    const fields = { code_hash: hash(code), code_expires_at: expiresAt };
    if (existing) {
      await db.updateById('telegram_links', existing.id, fields);
    } else {
      await db.insert('telegram_links', { user_id: userId, chat_id: null, linked_at: null, ...fields });
    }
    return { code, expiresAt };
  }

  /** Bind a chat to the student whose pending code matches. */
  static async linkChat(chatId, code) {
    const record = await db.findOne('telegram_links', { code_hash: hash(code) });
    if (!record || !record.code_expires_at || new Date(record.code_expires_at) < new Date()) return null;
    // A chat belongs to one student: drop any older link of this chat.
    const previous = await this.findByChat(chatId);
    if (previous && previous.id !== record.id) {
      await db.updateById('telegram_links', previous.id, { chat_id: null, linked_at: null });
    }
    await db.updateById('telegram_links', record.id, {
      chat_id: String(chatId), linked_at: new Date().toISOString(), code_hash: null, code_expires_at: null
    });
    return db.findById('telegram_links', record.id);
  }

  static async unlink(userId) {
    const existing = await this.findByUser(userId);
    if (!existing) return false;
    await db.deleteById('telegram_links', existing.id);
    return true;
  }
}

module.exports = TelegramLink;
