const BotSession = require('../../models/BotSession');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');
const UserProgress = require('../../models/UserProgress');
const LessonService = require('../lesson.service');
const ExerciseService = require('../exercise.service');
const { isCorrectAnswer, choiceMatches } = require('../../utils/answers');
const { END_WORDS } = require('../../config/bot');
const ReportService = require('../report.service');
const { SUBJECTS } = require('../../config/subjects');

/** A finished lesson's questions can be reported for this long after it ended. */
const REPORT_WINDOW_MS = 60 * 60 * 1000;

/**
 * A lesson's exercises in the chat bot, one question per message.
 *
 * The questions come from LessonService.getExercises (same selection and
 * option shuffle as the web page) and are frozen in the session. A
 * multiple-choice answer is the option's number (1..n); a fill-in answer is
 * the text; "?" shows the question's hint. Each answer gets immediate
 * feedback; after the last one all answers go to
 * ExerciseService.submitExercise, so score, points, progress, mistakes and
 * the next lesson are exactly the web's. Ending early records
 * nothing. Replies are plain data; the bot turns them into text.
 */

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const EXPLANATION_MAX = 400;
const PAGE_SIZE = 10;
const MORE_WORDS = ['more', '/more', 'next'];
const BACK_WORDS = ['back', '/back', 'prev'];
const HINT_WORDS = ['?', '？', 'hint', '/hint'];

const isEnd = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

/** The option number the student sent (1..count), or null. */
function parseOptionNumber(text, count) {
  const t = String(text || '').trim();
  if (!/^\d{1,2}$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 && n <= count ? n : null;
}

const capped = (text) => {
  if (!text) return null;
  const s = String(text).trim();
  return s.length > EXPLANATION_MAX ? `${s.slice(0, EXPLANATION_MAX - 1)}…` : s;
};

function questionView(session) {
  const ex = session.exercises[session.index];
  return {
    number: session.index + 1,
    total: session.exercises.length,
    type: ex.type,
    text: ex.text,
    textEn: ex.textEn || null,
    options: ex.type === 'multiple_choice' ? ex.options : null
  };
}

function lessonView(session) {
  return {
    id: session.lesson_id,
    title: session.lesson_title,
    subject: session.subject,
    number: session.lesson_number || null,
    difficulty: session.difficulty
  };
}

/**
 * One page of a subject's lessons, numbered 1..N in curriculum order across
 * pages, marked done (completed) or next (the subject's next lesson).
 */
async function lessonPage(user, subject, page) {
  const lessons = await Lesson.listBySubject(subject);
  const pages = Math.max(1, Math.ceil(lessons.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const progress = await UserProgress.getAllProgress(user.id);
  const done = new Set(progress.filter(p => p.status === 'completed').map(p => p.lesson_id));
  const next = await UserProgress.getNextLesson(user.id, { subject });
  const items = lessons.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((l, i) => ({
    n: (current - 1) * PAGE_SIZE + i + 1,
    id: l.id,
    title: l.title_he,
    status: done.has(l.id) ? 'done' : next && next.id === l.id ? 'next' : 'open'
  }));
  return { subject, page: current, pages, count: lessons.length, items };
}

const openSession = async (chatId) => {
  const session = await BotSession.findOpenByChat(chatId);
  return session && BotSession.kindOf(session) === 'exercise' ? session : null;
};

class ExerciseSession {
  /**
   * Start a lesson: `lessonId`, the `number`-th lesson of `subject`, or the
   * next lesson of `subject`. `difficulty` overrides the progress-based level.
   * Replaces any open session.
   */
  static async start(user, chatId, { subject, lessonId, number, difficulty } = {}) {
    let lesson;
    if (lessonId) {
      lesson = await Lesson.findById(lessonId);
      if (!lesson) return { error: 'lesson_not_found' };
    } else if (number) {
      // The n-th lesson of the subject, as numbered in the lesson list.
      if (!SUBJECTS.includes(subject)) return { error: 'bad_subject' };
      lesson = (await Lesson.listBySubject(subject))[Number(number) - 1];
      if (!lesson) return { error: 'lesson_not_found' };
    } else {
      if (!SUBJECTS.includes(subject)) return { error: 'bad_subject' };
      const next = await UserProgress.getNextLesson(user.id, { subject });
      if (!next) return { error: 'all_done' };
      lesson = await Lesson.findById(next.id);
    }

    const list = await Lesson.listBySubject(lesson.subject || 'english');
    const position = list.findIndex(l => l.id === lesson.id) + 1 || null;
    const set = await LessonService.getExercises(lesson.id, user.id, DIFFICULTIES.includes(difficulty) ? difficulty : null);
    if (!set.exercises.length) return { error: 'no_exercises' };
    const exercises = set.exercises.map(ex => ({
      id: ex.id,
      type: ex.type,
      text: ex.question_text_he || ex.question_text_en,
      textEn: ex.question_text_he ? ex.question_text_en || null : null,
      options: ex.type === 'multiple_choice' ? ex.options : null,
      hint: ex.hint_he || null
    }));

    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.createExercise({
      userId: user.id, chatId, lesson, number: position, difficulty: set.currentDifficulty, exercises
    });
    return { kind: 'exercise', sessionId: session.id, lesson: lessonView(session), question: questionView(session) };
  }

  /** Open the lesson list of a subject; the student answers with a lesson number. */
  static async listLessons(user, chatId, { subject }) {
    if (!SUBJECTS.includes(subject)) return { error: 'bad_subject' };
    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.createLessonPick({ userId: user.id, chatId, subject });
    return { kind: 'exercise', pick: true, sessionId: session.id, ...(await lessonPage(user, subject, 1)) };
  }

  /** In the lesson list: a number starts that lesson; 'more' / 'back' turn the page. */
  static async pick(user, chatId, session, text) {
    const t = String(text || '').trim().toLowerCase();
    let page = session.page || 1;
    if (MORE_WORDS.includes(t) || BACK_WORDS.includes(t)) {
      page += MORE_WORDS.includes(t) ? 1 : -1;
      const view = await lessonPage(user, session.subject, page);
      await BotSession.update(session.id, { page: view.page });
      return { kind: 'exercise', pick: true, sessionId: session.id, ...view };
    }
    const lessons = await Lesson.listBySubject(session.subject);
    const n = /^\d{1,3}$/.test(t) ? Number(t) : 0;
    if (n < 1 || n > lessons.length) {
      return { kind: 'exercise', pick: true, invalid: true, sessionId: session.id, ...(await lessonPage(user, session.subject, page)) };
    }
    return this.start(user, chatId, { lessonId: lessons[n - 1].id });
  }

  /** One answer: an option number or fill-in text. The last answer grades the lesson. */
  static async answer(user, chatId, text) {
    const session = await openSession(chatId);
    if (!session) return { error: 'no_session' };
    if (isEnd(text)) return this.end(user, chatId);
    if (session.status === 'setup') return this.pick(user, chatId, session, text);

    const current = session.exercises[session.index];
    if (HINT_WORDS.includes(String(text || '').trim().toLowerCase())) {
      // Not an answer: the hint (when the question has one) and the same question.
      return { kind: 'exercise', hintAsked: true, hint: capped(current.hint), lesson: lessonView(session), question: questionView(session) };
    }
    let given;
    if (current.type === 'multiple_choice') {
      const n = parseOptionNumber(text, current.options.length);
      if (!n) {
        return { kind: 'exercise', chooseNumber: true, lesson: lessonView(session), question: questionView(session) };
      }
      given = current.options[n - 1];
    } else {
      given = String(text).trim();
    }

    const exercise = await Exercise.findById(current.id);
    // Graded as the session froze the question (a typed question open
    // during a content change keeps its lenient check).
    const correct = isCorrectAnswer({ type: current.type, correct_answer: exercise.correct_answer }, given);
    const verdict = {
      correct,
      given,
      correctAnswer: exercise.correct_answer,
      correctOption: current.type === 'multiple_choice'
        ? current.options.findIndex(o => choiceMatches(o, exercise.correct_answer)) + 1 || null
        : null,
      explanation: correct ? null : capped(exercise.explanation_he)
    };
    // Wrong answers in this lesson and in a row, for the bot's encouraging line.
    const wrongCount = (session.wrong_count || 0) + (correct ? 0 : 1);
    const wrongStreak = correct ? 0 : (session.wrong_streak || 0) + 1;
    verdict.wrongCount = wrongCount;
    verdict.wrongStreak = wrongStreak;

    const answers = [...(session.answers || []), { exerciseId: current.id, userAnswer: given }];
    const index = session.index + 1;
    const correctCount = (session.correct_count || 0) + (correct ? 1 : 0);

    if (index < session.exercises.length) {
      const next = await BotSession.update(session.id, {
        answers, index, correct_count: correctCount, wrong_count: wrongCount, wrong_streak: wrongStreak
      });
      return { kind: 'exercise', verdict, lesson: lessonView(next), question: questionView(next), done: false };
    }

    // Last answer: grade the whole lesson exactly like the web.
    const seconds = Math.max(1, Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000));
    const result = await ExerciseService.submitExercise(user.id, session.lesson_id, answers, seconds, session.difficulty);
    await BotSession.update(session.id, {
      answers, index, correct_count: correctCount, wrong_count: wrongCount, wrong_streak: wrongStreak, result_id: result.resultId
    });
    await BotSession.end(session.id, 'completed');
    return {
      kind: 'exercise',
      verdict,
      lesson: lessonView(session),
      done: true,
      result: {
        score: result.score,
        passed: result.isPassed,
        correct: result.correctAnswers,
        total: result.totalQuestions,
        pointsEarned: result.gamification.pointsEarned,
        totalPoints: result.gamification.totalPoints,
        nextLesson: result.nextLesson ? { id: result.nextLesson.id, title: result.nextLesson.title_he } : null,
        nextDifficulty: result.nextDifficulty
      }
    };
  }

  /** End without grading: nothing is recorded for a half-done lesson. */
  static async end(user, chatId) {
    const session = await openSession(chatId);
    if (!session) return { error: 'no_session' };
    await BotSession.end(session.id, 'ended');
    if (session.status === 'setup') return { kind: 'exercise', done: true, ended: true, pickClosed: true };
    return {
      kind: 'exercise',
      done: true,
      ended: true,
      lesson: lessonView(session),
      answered: session.index,
      correct: session.correct_count || 0,
      total: session.exercises.length
    };
  }

  /**
   * Report a question from the chat's latest lesson session: the question
   * answered last, or the current one when none was answered yet. Works
   * after the lesson ended too, so the last question can be reported from
   * the summary. Nothing in the session changes.
   */
  static async report(user, chatId, reason) {
    // Only the lesson in front of the student: an open one, or one that
    // ended within the hour when no other session is open.
    const open = await BotSession.findOpenByChat(chatId);
    if (open && BotSession.kindOf(open) !== 'exercise') return { error: 'no_session' };
    const session = await BotSession.findLatestExercise(chatId, user.id);
    if (!session) return { error: 'no_session' };
    const endedLongAgo = session.status === 'ended'
      && Date.now() - new Date(session.ended_at || session.started_at).getTime() > REPORT_WINDOW_MS;
    if (endedLongAgo) return { error: 'no_session' };
    const answers = session.answers || [];
    const exerciseId = answers.length
      ? answers[answers.length - 1].exerciseId
      : session.exercises[session.index] && session.exercises[session.index].id;
    if (!exerciseId) return { error: 'no_session' };
    const result = await ReportService.report(user.id, { exerciseId, reason, source: 'bot' });
    if (result.error) return result;
    const ex = session.exercises.find(e => e.id === exerciseId);
    return {
      kind: 'exercise', reported: true, duplicate: result.duplicate,
      reportedNumber: session.exercises.indexOf(ex) + 1, reportedText: ex ? ex.text : null,
      active: session.status === 'active'
    };
  }

  static async status(chatId) {
    const session = await openSession(chatId);
    if (!session) return { active: false };
    if (session.status === 'setup') {
      const user = { id: session.user_id };
      return { active: true, kind: 'exercise', pick: true, sessionId: session.id, ...(await lessonPage(user, session.subject, session.page || 1)) };
    }
    return { active: true, kind: 'exercise', sessionId: session.id, lesson: lessonView(session), question: questionView(session) };
  }
}

module.exports = ExerciseSession;
module.exports.parseOptionNumber = parseOptionNumber;
