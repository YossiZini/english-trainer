const BotSession = require('../../models/BotSession');
const UnseenParagraph = require('../../models/UnseenParagraph');
const UnseenQuestion = require('../../models/UnseenQuestion');
const UnseenSession = require('../../models/UnseenSession');
const UnseenUserProgress = require('../../models/UnseenUserProgress');
const { parseOptionNumber } = require('../../utils/answers');
const { isEndCommand, isHintCommand } = require('../../utils/botWords');

/**
 * /unseen in the chat bot (session kind 'unseen'): an English reading text
 * from the website's Unseen section, sent first, then its five questions,
 * one per message. The text is the student's next one not finished, in the
 * website's order (level, then English title), or number N of that list.
 *
 * An answer is an option's number; "?" shows the text's hard words and the
 * question in Hebrew and is not an answer. The reading is recorded exactly
 * like one on the website (UnseenSession, UnseenUserProgress): each answer
 * when it is checked, the score and the text's progress at the end, so the
 * website's Unseen page and /usage see it. No points and no mistakes, as on
 * the website. Ending early completes nothing. Replies are plain data; the
 * bot turns them into text.
 */

/** Every text in the website's order (level, then English title); a text's number is its place here, from 1. */
const allTexts = () => UnseenParagraph.findAll();

/** Ids of the texts the student finished: a completed reading, on the website or here. */
async function finishedIds(userId) {
  return new Set((await UnseenUserProgress.getAllByUser(userId)).map(p => p.paragraph_id));
}

/** The place (0-based) of the student's next text: the first one not finished, or -1 when all are. */
async function nextIndex(userId, texts) {
  const finished = await finishedIds(userId);
  return texts.findIndex(p => !finished.has(p.id));
}

/** A question as the session keeps it from the start. */
const frozenQuestion = (q) => ({
  id: q.id,
  text: q.question_text_en,
  textHe: q.question_text_he || null,
  options: q.options,
  answer: q.correct_answer,
  explanation: q.explanation_he || null
});

const readingView = (session) => ({
  number: session.number,
  count: session.count,
  title: session.title_en,
  titleHe: session.title_he,
  level: session.level
});

function questionView(session) {
  const q = session.questions[session.index];
  return {
    number: session.index + 1,
    total: session.questions.length,
    // Answered with an option number, so a bare command still works during the question.
    type: 'multiple_choice',
    text: q.text,
    options: q.options
  };
}

/** The chat's open reading, or null. A reading with every question answered is over, even if closing it failed. */
async function openReading(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  if (!session || BotSession.kindOf(session) !== 'unseen') return null;
  if (session.status === 'active' && session.index >= session.questions.length) {
    await BotSession.end(session.id, 'completed');
    return null;
  }
  return session;
}

/** End the chat's open session, of any kind, for a new one; a reading left half-done is abandoned on the website too. */
async function replaceOpen(chatId) {
  const open = await BotSession.findOpenByChat(chatId);
  if (!open) return;
  await BotSession.end(open.id, 'replaced');
  if (BotSession.kindOf(open) === 'unseen' && open.unseen_session_id) await UnseenSession.abandon(open.unseen_session_id);
}

/** Help that is not an answer: the text's hard words with their translations, and the question in Hebrew. */
async function hintFor(session) {
  const paragraph = await UnseenParagraph.findById(session.paragraph_id);
  const words = ((paragraph && paragraph.hard_words) || []).map(w => ({ word: w.word, translation: w.translation }));
  return { words, questionHe: session.questions[session.index].textHe };
}

/**
 * Record answer `i` of the session (its chosen option) on the website. The
 * row's id is fixed per reading and question, so writing it twice (a late
 * write, or the final check below) leaves one row with the same answer.
 */
function recordAnswer(session, i, choice) {
  const q = session.questions[i];
  return UnseenSession.recordAnswer(session.unseen_session_id, q.id, choice, choice === q.answer, `${session.unseen_session_id}-q${i + 1}`);
}

/**
 * The website's end of a reading: every answer the session took is on the
 * website (an earlier answer's write may still be on its way when two
 * messages arrive together), then the score, the text's progress (best
 * score, attempts) and the student's next text.
 */
async function finish(user, session) {
  await Promise.all(session.answers.map((choice, i) => recordAnswer(session, i, choice)));
  const completed = await UnseenSession.complete(session.unseen_session_id);
  const progress = await UnseenUserProgress.upsertProgress(user.id, session.paragraph_id, completed.score);
  const texts = await allTexts();
  const next = await nextIndex(user.id, texts);
  return {
    correct: completed.correct_answers,
    total: session.questions.length,
    score: completed.score,
    bestScore: progress.best_score,
    attempts: progress.attempts,
    next: next >= 0 ? { number: next + 1, title: texts[next].title_en } : null
  };
}

class UnseenBotSession {
  /**
   * Start a reading: text `number` of the list, or the student's next text
   * not finished. Opens the website's reading session, as the reading page
   * does, and replaces any open session. Returns the text, then question 1.
   */
  static async start(user, chatId, { number } = {}) {
    const texts = await allTexts();
    let index;
    if (number) {
      index = Number(number) - 1;
      if (!texts[index]) return { error: 'text_not_found' };
    } else {
      index = await nextIndex(user.id, texts);
      if (index < 0) return { error: 'all_read' };
    }
    const paragraph = texts[index];
    const questions = (await UnseenQuestion.findByParagraphId(paragraph.id)).map(frozenQuestion);
    if (!questions.length) return { error: 'no_questions' };

    await replaceOpen(chatId);
    const reading = await UnseenSession.create(user.id, paragraph.id);
    const session = await BotSession.createUnseen({
      userId: user.id, chatId, paragraph, number: index + 1, count: texts.length, questions, unseenSessionId: reading.id
    });
    return {
      kind: 'unseen', sessionId: session.id, reading: readingView(session), passage: paragraph.content, question: questionView(session)
    };
  }

  /** One message during a reading: an option number, "?", or the end word. The fifth answer ends the reading. */
  static async answer(user, chatId, text) {
    const session = await openReading(chatId);
    if (!session) return { error: 'no_session' };
    if (isEndCommand(text)) return this.end(user, chatId);
    const shown = { reading: readingView(session), question: questionView(session) };
    if (isHintCommand(text)) return { kind: 'unseen', hintAsked: true, hint: await hintFor(session), ...shown };

    const current = session.questions[session.index];
    const n = parseOptionNumber(text, current.options.length);
    if (!n) return { kind: 'unseen', chooseNumber: true, ...shown };

    const correct = n - 1 === current.answer;
    // Wrong answers in this reading and in a row, for the bot's encouraging line.
    const wrongCount = (session.wrong_count || 0) + (correct ? 0 : 1);
    const wrongStreak = correct ? 0 : (session.wrong_streak || 0) + 1;
    const verdict = {
      correct,
      given: current.options[n - 1],
      correctOption: current.answer + 1,
      correctAnswer: current.options[current.answer],
      explanation: correct ? null : current.explanation,
      wrongCount,
      wrongStreak
    };
    const updates = {
      index: session.index + 1,
      answers: [...(session.answers || []), n - 1],
      correct_count: (session.correct_count || 0) + (correct ? 1 : 0),
      wrong_count: wrongCount,
      wrong_streak: wrongStreak
    };

    const last = updates.index >= session.questions.length;
    // Only the request that moves the reading past this question goes on: of
    // two answers sent together (a double tap), the second records nothing.
    // The last answer and the end are one write: no moment with an open
    // reading past its questions.
    const after = await BotSession.claimAnswer(session.id, session.index, updates, last ? 'completed' : null);
    if (!after) return this.alreadyAnswered(chatId);
    if (!last) {
      // Recorded like the website: each answer when it is checked.
      await recordAnswer(after, session.index, n - 1);
      return { kind: 'unseen', verdict, reading: readingView(after), question: questionView(after), done: false };
    }
    return { kind: 'unseen', verdict, reading: readingView(after), done: true, result: await finish(user, after) };
  }

  /** The answer's question was answered a moment ago (sent twice): where the reading is now, or no session after its end. */
  static async alreadyAnswered(chatId) {
    const session = await openReading(chatId);
    if (!session) return { error: 'no_session' };
    return { kind: 'unseen', alreadyAnswered: true, reading: readingView(session), question: questionView(session) };
  }

  /** Stop now: how far the reading got; the website's reading is abandoned, not completed. */
  static async end(user, chatId) {
    const session = await openReading(chatId);
    if (!session) return { error: 'no_session' };
    await BotSession.end(session.id, 'ended');
    if (session.unseen_session_id) await UnseenSession.abandon(session.unseen_session_id);
    return {
      kind: 'unseen',
      done: true,
      ended: true,
      reading: readingView(session),
      answered: session.index,
      correct: session.correct_count || 0,
      total: session.questions.length
    };
  }

  static async status(chatId) {
    const session = await openReading(chatId);
    if (!session) return { active: false };
    return { active: true, kind: 'unseen', sessionId: session.id, reading: readingView(session), question: questionView(session) };
  }
}

module.exports = UnseenBotSession;
