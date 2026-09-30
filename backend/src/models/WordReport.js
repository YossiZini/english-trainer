const { db } = require('../config/database');

/**
 * A student's report that a vocabulary word is wrong (`word_reports`), with a
 * snapshot of the word as the student saw it. `status` is 'open' until the
 * admin decides ('decided', with `decision`: change | remove | keep).
 */
const today = () => new Date().toISOString().slice(0, 10);

class WordReport {
  static async create({ userId, word, reason, note, source, direction = null, given = null }) {
    return db.insert('word_reports', {
      word_id: word.id,
      user_id: userId,
      reason,
      note: note || null,
      source,
      // The exam direction and the student's answer, when reported from the bot.
      direction,
      given,
      snapshot: {
        english: word.english_word,
        hebrew: word.hebrew_translation,
        sentence: word.sentence_en || null,
        difficulty: word.difficulty_level || null
      },
      status: 'open',
      decision: null,
      decided_at: null,
      date: today(),
      created_at: new Date().toISOString()
    });
  }

  /** The student's open report on this word, if any. */
  static async findOpen(userId, wordId) {
    return db.findOne('word_reports', { user_id: userId, word_id: wordId, status: 'open' });
  }

  /** Whether any report on the word is still open (under review). */
  static async hasOpen(wordId) {
    return !!(await db.findOne('word_reports', { word_id: wordId, status: 'open' }));
  }

  /** Word reports the student filed today. */
  static async countToday(userId) {
    return (await db.find('word_reports', { user_id: userId, date: today() })).length;
  }

  static async findOpenReports() {
    return db.find('word_reports', { status: 'open' });
  }

  /** Close every open report on the word with the admin's decision. */
  static async decide(wordId, decision, note = null) {
    const open = await db.find('word_reports', { word_id: wordId, status: 'open' });
    const decidedAt = new Date().toISOString();
    for (const report of open) {
      await db.updateById('word_reports', report.id, { status: 'decided', decision, decision_note: note, decided_at: decidedAt });
    }
    return open.length;
  }
}

module.exports = WordReport;
