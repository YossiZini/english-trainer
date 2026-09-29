const { db } = require('../config/database');

/**
 * A student's report that a question is wrong (`question_reports`). It keeps
 * a snapshot of the question as the student saw it, so a later content change
 * does not change what was reported. `status` is 'open' until the owner
 * decides ('decided', with `decision`: change | remove | keep).
 */
const today = () => new Date().toISOString().slice(0, 10);

class QuestionReport {
  static async create({ userId, exercise, lesson, reason, note, source }) {
    return db.insert('question_reports', {
      exercise_id: exercise.id,
      lesson_id: exercise.lesson_id,
      lesson_title: lesson ? lesson.title_he : null,
      subject: lesson ? lesson.subject || 'english' : null,
      user_id: userId,
      reason,
      note: note || null,
      source,
      snapshot: {
        question: exercise.question_text_he,
        options: exercise.options || [],
        answer: exercise.correct_answer,
        explanation: exercise.explanation_he || null,
        difficulty: exercise.difficulty || null
      },
      status: 'open',
      decision: null,
      decided_at: null,
      date: today(),
      created_at: new Date().toISOString()
    });
  }

  /** The student's open report on this question, if any. */
  static async findOpen(userId, exerciseId) {
    return db.findOne('question_reports', { user_id: userId, exercise_id: exerciseId, status: 'open' });
  }

  /** Reports the student filed today. */
  static async countToday(userId) {
    return (await db.find('question_reports', { user_id: userId, date: today() })).length;
  }

  static async findOpenReports() {
    return db.find('question_reports', { status: 'open' });
  }

  /** Close every open report on the question with the owner's decision. */
  static async decide(exerciseId, decision, note = null) {
    const open = await db.find('question_reports', { exercise_id: exerciseId, status: 'open' });
    const decidedAt = new Date().toISOString();
    for (const report of open) {
      await db.updateById('question_reports', report.id, { status: 'decided', decision, decision_note: note, decided_at: decidedAt });
    }
    return open.length;
  }
}

module.exports = QuestionReport;
