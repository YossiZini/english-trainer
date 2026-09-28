const BotSession = require('../models/BotSession');
const VocabularyWord = require('../models/VocabularyWord');
const VocabularyWordScores = require('../models/VocabularyWordScores');
const VocabularyFailedWords = require('../models/VocabularyFailedWords');
const VocabularyUserStats = require('../models/VocabularyUserStats');
const User = require('../models/User');
const { pickWordsForUser, LEVELS } = require('./bot/wordPicker');
const { hebrewAnswerMatches, judgeable } = require('../utils/hebrewAnswer');
const { shuffleArray } = require('../utils/shuffle');
const { SESSION_SIZE, END_WORDS } = require('../config/bot');

/**
 * The chat-bot vocabulary session: start (setup questions), answer, end.
 * Words are always drawn from all words; the student picks only the level.
 * A Hebrew answer that does not match the dictionary can get a second
 * opinion: with `judge`, the API returns `needsJudgement` without recording
 * anything, and the bot answers again with `verdict` ('accepted' or
 * 'rejected') from its model. The caller holds the service key, so the
 * verdict is trusted; the API still records, scores and advances.
 * Every reply is plain data; the bot turns it into Hebrew text. The
 * service never talks to a model: words come from the vocabulary store,
 * verdicts from hebrewAnswer, points from User.addPoints.
 */

const POINTS_PER_CORRECT = 1;
const isEndCommand = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

const LEVEL_WORDS = { 'קל': 1, 'בינוני': 2, 'קשה': 3 };

/** 1, 2 or 3 from a button press or a level word, else null. */
function parseChoice(text) {
  const t = String(text || '').trim().toLowerCase();
  if (/^[123]$/.test(t)) return Number(t);
  return LEVEL_WORDS[t] || null;
}

const options = () => Object.entries(LEVELS).map(([key, v]) => ({ key: Number(key), label: v.he }));

function setupView(session) {
  return { setup: session.setup_step, options: options(session.setup_step) };
}

function wordView(word) {
  if (!word) return null;
  return { id: word.id, english: word.english_word, sentence: word.sentence_en || null };
}

function progress(session) {
  return {
    round: session.round,
    index: Math.min(session.asked_in_round + 1, session.round_size),
    total: session.round_size,
    failedInRound: session.failed_word_ids.length
  };
}

function summary(session, totalPoints = null) {
  return {
    words: session.word_ids.length,
    rounds: session.round,
    correct: session.correct_count,
    wrong: session.wrong_count,
    remainingFailed: session.failed_word_ids.length + session.queue.length,
    points: session.points_earned || 0,
    totalPoints
  };
}

const currentWord = (session) => (session.queue.length ? VocabularyWord.findById(session.queue[0]) : null);

class BotService {
  /** Open a session for the chat and ask the first setup question; an open one is replaced. */
  static async start(user, chatId) {
    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.create({ userId: user.id, chatId });
    return { sessionId: session.id, ...setupView(session) };
  }

  /** The setup answer: the level; the words are picked right after it. */
  static async setup(user, session, text) {
    const choice = parseChoice(text);
    if (!choice) return { sessionId: session.id, ...setupView(session), invalid: true };
    const words = await pickWordsForUser(user, SESSION_SIZE, { level: choice });
    if (words.length < 3) return { sessionId: session.id, ...setupView(session), notEnoughWords: true };
    const ids = words.map(w => w.id);
    const started = await BotSession.update(session.id, {
      level: choice, status: 'active', setup_step: null, word_ids: ids, queue: ids, round_size: ids.length
    });
    return {
      sessionId: started.id, started: true, level: LEVELS[choice].he,
      word: wordView(words[0]), progress: progress(started)
    };
  }

  /** Check the student's text against the current word and move on. */
  static async answer(user, chatId, text, { judge = false, verdict = null } = {}) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { error: 'no_session' };
    if (isEndCommand(text)) return this.end(user, chatId);
    if (session.status === 'setup') return this.setup(user, session, text);

    const word = await currentWord(session);
    const matched = hebrewAnswerMatches(text, word.hebrew_translation);
    const canJudge = !matched && judgeable(text);
    if (canJudge && judge && !verdict) {
      return { needsJudgement: true, english: word.english_word, expected: word.hebrew_translation, given: String(text).trim() };
    }
    const judged = canJudge && verdict === 'accepted';
    const correct = matched || judged;
    await VocabularyWordScores.recordAttempt(user.id, word.id, correct);
    let totalPoints = null;
    if (correct) {
      totalPoints = (await User.addPoints(user.id, POINTS_PER_CORRECT)).total_points;
    } else {
      await VocabularyFailedWords.addOrIncrementFail(user.id, word.id);
      await VocabularyUserStats.incrementFails(user.id);
    }

    const updates = {
      queue: session.queue.slice(1),
      asked_in_round: session.asked_in_round + 1,
      correct_count: session.correct_count + (correct ? 1 : 0),
      wrong_count: session.wrong_count + (correct ? 0 : 1),
      points_earned: (session.points_earned || 0) + (correct ? POINTS_PER_CORRECT : 0),
      failed_word_ids: correct ? session.failed_word_ids : [...session.failed_word_ids, word.id]
    };
    let roundStarted = false;
    if (updates.queue.length === 0 && updates.failed_word_ids.length > 0) {
      // Next round: the failed words, in random order.
      updates.queue = shuffleArray(updates.failed_word_ids);
      updates.failed_word_ids = [];
      updates.round = session.round + 1;
      updates.round_size = updates.queue.length;
      updates.asked_in_round = 0;
      roundStarted = true;
    }
    const next = await BotSession.update(session.id, updates);
    const reply = {
      correct, judged, expected: matched ? null : word.hebrew_translation, points: correct ? POINTS_PER_CORRECT : 0,
      roundStarted, done: false
    };
    if (next.queue.length === 0) {
      const ended = await BotSession.end(next.id, 'completed');
      return { ...reply, done: true, word: null, summary: summary(ended, totalPoints) };
    }
    return { ...reply, word: wordView(await currentWord(next)), progress: progress(next) };
  }

  static async end(user, chatId) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { error: 'no_session' };
    const ended = await BotSession.end(session.id, 'ended');
    const fresh = await User.findById(user.id);
    return { done: true, word: null, summary: summary(ended, fresh ? fresh.total_points : null) };
  }

  static async status(chatId) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { active: false };
    if (session.status === 'setup') return { active: true, sessionId: session.id, ...setupView(session) };
    return { active: true, sessionId: session.id, word: wordView(await currentWord(session)), progress: progress(session) };
  }
}

module.exports = BotService;
module.exports.isEndCommand = isEndCommand;
module.exports.parseChoice = parseChoice;
