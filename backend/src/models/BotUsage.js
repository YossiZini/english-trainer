const { db } = require('../config/database');

/**
 * Per-student daily bot usage, one document per student and day
 * (`<userId>_<YYYY-MM-DD>` in bot_usage): messages sent and answer checks
 * used. Counters change inside Firestore transactions.
 */
const today = () => new Date().toISOString().slice(0, 10);
const docId = (userId) => `${userId}_${today()}`;

class BotUsage {
  /** Count one message; returns today's count. */
  static async countMessage(userId) {
    const updated = await db.transactUpdate('bot_usage', docId(userId), (doc) => ({ count: (doc.count || 0) + 1 }));
    if (updated) return updated.count;
    await db.insert('bot_usage', { id: docId(userId), user_id: userId, date: today(), count: 1, judges: 0 });
    return 1;
  }

  /** Take one answer check if today's count is below `cap`; true when taken. */
  static async reserveJudgement(userId, cap) {
    return this.reserve(userId, 'judges', cap);
  }

  /** Take one review-agent proposal if today's count is below `cap`; true when taken. */
  static async reserveReview(userId, cap) {
    return this.reserve(userId, 'reviews', cap);
  }

  /** Take one unit of today's `field` counter if it is below `cap`; true when taken. */
  static async reserve(userId, field, cap) {
    let allowed = false;
    const updated = await db.transactUpdate('bot_usage', docId(userId), (doc) => {
      allowed = (doc[field] || 0) < cap;
      return allowed ? { [field]: (doc[field] || 0) + 1 } : {};
    });
    if (updated) return allowed;
    if (cap < 1) return false;
    await db.insert('bot_usage', { id: docId(userId), user_id: userId, date: today(), count: 0, judges: 0, [field]: 1 });
    return true;
  }
}

module.exports = BotUsage;
