const Exercise = require('../models/Exercise');
const Lesson = require('../models/Lesson');
const QuestionReport = require('../models/QuestionReport');

/**
 * Students report questions they think are wrong, from the web or the bot.
 * The owner reviews open reports with Claude Code (/reports) and decides.
 */
const REASONS = ['wrong_answer', 'two_answers', 'unclear', 'other'];
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
    if (await QuestionReport.countToday(userId) >= DAILY_REPORT_CAP) return { error: 'report_cap' };
    const lesson = await Lesson.findById(exercise.lesson_id);
    const clean = reason === 'other' && typeof note === 'string' ? note.trim().slice(0, MAX_NOTE) : null;
    const created = await QuestionReport.create({ userId, exercise, lesson, reason, note: clean, source });
    return { reportId: created.id, duplicate: false };
  }
}

module.exports = ReportService;
module.exports.REASONS = REASONS;
module.exports.DAILY_REPORT_CAP = DAILY_REPORT_CAP;
