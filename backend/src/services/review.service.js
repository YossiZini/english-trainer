const Exercise = require('../models/Exercise');
const Lesson = require('../models/Lesson');
const QuestionReport = require('../models/QuestionReport');
const QuestionOverride = require('../models/QuestionOverride');
const { choiceMatches } = require('../utils/answers');

/**
 * The admin's review of reported questions (from the Telegram bot's
 * /review). The queue groups open reports by question; a decision keeps,
 * changes or removes the question (QuestionOverride, live at once) and
 * closes its reports. Every change is validated here, whoever proposed it.
 */
const DECISIONS = ['keep', 'change', 'remove'];
const MAX_TEXT = 500;
const MAX_EXPLANATION = 1000;
const MAX_OPTION = 120;

/**
 * Admin account names from ADMIN_USERS (comma-separated), matched exactly:
 * account names are unique only case-sensitively, so "yossi zini" could be
 * registered by someone else.
 */
function adminNames() {
  return String(process.env.ADMIN_USERS || '').split(',').map(s => s.trim()).filter(Boolean);
}

const isAdmin = (user) => !!user && adminNames().includes(String(user.name || ''));

/** Why a proposed change is not a valid question, or null when it is. */
function invalidChange(change) {
  if (!change || typeof change !== 'object') return 'missing change';
  const { question_text_he: text, options, correct_answer: answer, explanation_he: explanation } = change;
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_TEXT) return 'question text is empty or too long';
  if (!Array.isArray(options) || options.length < 3 || options.length > 4) return 'there must be 3 or 4 options';
  if (options.some(o => typeof o !== 'string' || !o.trim() || o !== o.trim() || o.length > MAX_OPTION)) {
    return 'every option must be a short non-empty text without outer spaces';
  }
  if (new Set(options).size !== options.length) return 'options must be different';
  if (typeof answer !== 'string' || options.filter(o => choiceMatches(o, answer)).length !== 1) {
    return 'the answer must be exactly one of the options';
  }
  if (explanation !== undefined && explanation !== null && (typeof explanation !== 'string' || explanation.length > MAX_EXPLANATION)) {
    return 'explanation is too long';
  }
  return null;
}

/** The fields a change may set, nothing else. */
const pick = (change) => ({
  question_text_he: change.question_text_he.trim(),
  options: change.options,
  correct_answer: change.correct_answer,
  explanation_he: typeof change.explanation_he === 'string' ? change.explanation_he.trim() : null
});

class ReviewService {
  /** Questions under review, oldest report first, with the reports and the question as now served. */
  static async queue() {
    const open = await QuestionReport.findOpenReports();
    const byExercise = new Map();
    for (const r of open) {
      if (!byExercise.has(r.exercise_id)) byExercise.set(r.exercise_id, []);
      byExercise.get(r.exercise_id).push(r);
    }
    const items = [];
    for (const [exerciseId, reports] of byExercise) {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) continue;
      const lesson = await Lesson.findById(exercise.lesson_id);
      reports.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      items.push({
        exerciseId,
        lesson: lesson ? { title: lesson.title_he, subject: lesson.subject || 'english', number: lesson.subtopic_number || null } : null,
        question: {
          text: exercise.question_text_he,
          textEn: exercise.question_text_en || null,
          options: exercise.options || [],
          answer: exercise.correct_answer,
          explanation: exercise.explanation_he || null,
          difficulty: exercise.difficulty || null
        },
        reports: reports.map(r => ({ reason: r.reason, note: r.note || null, source: r.source, at: r.created_at })),
        firstReportedAt: reports[0].created_at
      });
    }
    items.sort((a, b) => new Date(a.firstReportedAt) - new Date(b.firstReportedAt));
    return { total: items.length, items };
  }

  /** Apply the admin's decision to a question under review and close its reports. */
  static async decide(exerciseId, decision, change = null) {
    if (!DECISIONS.includes(decision)) return { error: 'bad_decision' };
    const exercise = typeof exerciseId === 'string' && exerciseId ? await Exercise.findById(exerciseId) : null;
    if (!exercise) return { error: 'exercise_not_found' };
    if (decision === 'change') {
      const reason = invalidChange(change);
      if (reason) return { error: 'invalid_change', reason };
      await QuestionOverride.decide(exerciseId, 'change', pick(change));
    } else {
      await QuestionOverride.decide(exerciseId, decision);
    }
    const closed = await QuestionReport.decide(exerciseId, decision);
    return { decided: true, decision, closed };
  }
}

module.exports = ReviewService;
module.exports.isAdmin = isAdmin;
module.exports.invalidChange = invalidChange;
