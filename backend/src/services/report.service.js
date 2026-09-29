const Exercise = require('../models/Exercise');
const Lesson = require('../models/Lesson');
const QuestionReport = require('../models/QuestionReport');
const QuestionOverride = require('../models/QuestionOverride');
const VocabularyWord = require('../models/VocabularyWord');
const WordReport = require('../models/WordReport');
const WordOverride = require('../models/WordOverride');

/**
 * Students report questions and vocabulary words they think are wrong, from
 * the web or the bot. A reported item is hidden until the admin reviews it
 * in Telegram (/review): keep, change or remove. The daily cap counts
 * question and word reports together.
 */
const REASONS = ['wrong_answer', 'two_answers', 'unclear', 'other'];
const WORD_REASONS = ['wrong_translation', 'missing_translation', 'bad_sentence', 'other'];
const DAILY_REPORT_CAP = 20;
const MAX_NOTE = 200;

class ReportService {
  /**
   * File a report; a second report of the same question by the same student
   * while the first is open returns the first one.
   */
  static async report(userId, { exerciseId, reason, note, source = 'web' }) {
    if (!REASONS.includes(reason)) return { error: 'bad_reason' };
    const exercise = typeof exerciseId === 'string' && exerciseId ? await Exercise.findById(exerciseId) : null;
    if (!exercise) return { error: 'exercise_not_found' };
    const existing = await QuestionReport.findOpen(userId, exercise.id);
    if (existing) return { reportId: existing.id, duplicate: true };
    if (await this.countToday(userId) >= DAILY_REPORT_CAP) return { error: 'report_cap' };
    const lesson = await Lesson.findById(exercise.lesson_id);
    const created = await QuestionReport.create({ userId, exercise, lesson, reason, note: cleanNote(reason, note), source });
    // Hidden from new lessons until the admin reviews it.
    await QuestionOverride.hide(exercise.id);
    return { reportId: created.id, duplicate: false };
  }

  /**
   * File a word report; from the bot it also records the exam direction and
   * the student's answer, which show why "my translation was right" was sent.
   */
  static async reportWord(userId, { wordId, reason, note, source = 'web', direction = null, given = null }) {
    if (!WORD_REASONS.includes(reason)) return { error: 'bad_reason' };
    const word = typeof wordId === 'string' && wordId ? await VocabularyWord.findById(wordId) : null;
    if (!word) return { error: 'word_not_found' };
    const existing = await WordReport.findOpen(userId, word.id);
    if (existing) return { reportId: existing.id, duplicate: true, word };
    if (await this.countToday(userId) >= DAILY_REPORT_CAP) return { error: 'report_cap' };
    const created = await WordReport.create({
      userId, word, reason, note: cleanNote(reason, note), source,
      direction, given: typeof given === 'string' ? given.slice(0, MAX_NOTE) : null
    });
    // Not picked for new quizzes until the admin reviews it.
    await WordOverride.hide(word.id);
    return { reportId: created.id, duplicate: false, word };
  }

  static async countToday(userId) {
    return (await QuestionReport.countToday(userId)) + (await WordReport.countToday(userId));
  }
}

const cleanNote = (reason, note) => (reason === 'other' && typeof note === 'string' ? note.trim().slice(0, MAX_NOTE) : null);

module.exports = ReportService;
module.exports.REASONS = REASONS;
module.exports.WORD_REASONS = WORD_REASONS;
module.exports.DAILY_REPORT_CAP = DAILY_REPORT_CAP;
