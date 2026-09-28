const BotSession = require('../../models/BotSession');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');
const UserProgress = require('../../models/UserProgress');
const LessonService = require('../lesson.service');
const ExerciseService = require('../exercise.service');
const { answersMatch } = require('../../utils/answers');
const { END_WORDS } = require('../../config/bot');

/**
 * A lesson's exercises in the chat bot, one question per message.
 *
 * The questions come from LessonService.getExercises (same selection and
 * option shuffle as the web page) and are frozen in the session. A
 * multiple-choice answer is the option's number (1..n); a fill-in answer is
 * the text. Each answer gets immediate feedback; after the last one all
 * answers go to ExerciseService.submitExercise, so score, points, progress,
 * mistakes and the next lesson are exactly the web's. Ending early records
 * nothing. Replies are plain data; the bot turns them into text.
 */

const SUBJECTS = ['english', 'math'];
const EXPLANATION_MAX = 400;

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
  return { id: session.lesson_id, title: session.lesson_title, subject: session.subject, difficulty: session.difficulty };
}

const openSession = async (chatId) => {
  const session = await BotSession.findOpenByChat(chatId);
  return session && BotSession.kindOf(session) === 'exercise' ? session : null;
};

class ExerciseSession {
  /** Start a lesson: `lessonId`, or the next lesson of `subject`. Replaces any open session. */
  static async start(user, chatId, { subject, lessonId } = {}) {
    let lesson;
    if (lessonId) {
      lesson = await Lesson.findById(lessonId);
      if (!lesson) return { error: 'lesson_not_found' };
    } else {
      if (!SUBJECTS.includes(subject)) return { error: 'bad_subject' };
      const next = await UserProgress.getNextLesson(user.id, { subject });
      if (!next) return { error: 'all_done' };
      lesson = await Lesson.findById(next.id);
    }

    const set = await LessonService.getExercises(lesson.id, user.id);
    if (!set.exercises.length) return { error: 'no_exercises' };
    const exercises = set.exercises.map(ex => ({
      id: ex.id,
      type: ex.type,
      text: ex.question_text_he || ex.question_text_en,
      textEn: ex.question_text_he ? ex.question_text_en || null : null,
      options: ex.type === 'multiple_choice' ? ex.options : null
    }));

    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.createExercise({
      userId: user.id, chatId, lesson, difficulty: set.currentDifficulty, exercises
    });
    return { kind: 'exercise', sessionId: session.id, lesson: lessonView(session), question: questionView(session) };
  }

  /** One answer: an option number or fill-in text. The last answer grades the lesson. */
  static async answer(user, chatId, text) {
    const session = await openSession(chatId);
    if (!session) return { error: 'no_session' };
    if (isEnd(text)) return this.end(user, chatId);

    const current = session.exercises[session.index];
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
    const correct = answersMatch(given, exercise.correct_answer);
    const verdict = {
      correct,
      given,
      correctAnswer: exercise.correct_answer,
      correctOption: current.type === 'multiple_choice'
        ? current.options.findIndex(o => answersMatch(o, exercise.correct_answer)) + 1 || null
        : null,
      explanation: correct ? null : capped(exercise.explanation_he)
    };

    const answers = [...(session.answers || []), { exerciseId: current.id, userAnswer: given }];
    const index = session.index + 1;
    const correctCount = (session.correct_count || 0) + (correct ? 1 : 0);

    if (index < session.exercises.length) {
      const next = await BotSession.update(session.id, { answers, index, correct_count: correctCount });
      return { kind: 'exercise', verdict, lesson: lessonView(next), question: questionView(next), done: false };
    }

    // Last answer: grade the whole lesson exactly like the web.
    const seconds = Math.max(1, Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000));
    const result = await ExerciseService.submitExercise(user.id, session.lesson_id, answers, seconds, session.difficulty);
    await BotSession.update(session.id, { answers, index, correct_count: correctCount, result_id: result.resultId });
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

  static async status(chatId) {
    const session = await openSession(chatId);
    if (!session) return { active: false };
    return { active: true, kind: 'exercise', sessionId: session.id, lesson: lessonView(session), question: questionView(session) };
  }
}

module.exports = ExerciseSession;
module.exports.parseOptionNumber = parseOptionNumber;
