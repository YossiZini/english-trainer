const BotSession = require('../models/BotSession');
const VocabularyWord = require('../models/VocabularyWord');
const VocabularyWordScores = require('../models/VocabularyWordScores');
const VocabularyFailedWords = require('../models/VocabularyFailedWords');
const VocabularyUserStats = require('../models/VocabularyUserStats');
const User = require('../models/User');
const { pickWordsForUser, LEVELS, WORD_SETS } = require('./bot/wordPicker');
const { hebrewAnswerMatches } = require('../utils/hebrewAnswer');
const { shuffleArray } = require('../utils/shuffle');
const { SESSION_SIZE, END_WORDS } = require('../config/bot');

/**
 * The chat-bot vocabulary session: start (setup questions), answer, end.
 * Every reply is plain data; the bot turns it into Hebrew text. The
 * service never talks to a model: words come from the vocabulary store,
 * verdicts from hebrewAnswer, points from User.addPoints.
 */

const POINTS_PER_CORRECT = 1;
const isEndCommand = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

const CHOICE_WORDS = {
  type: { 'הכול': 1, 'הכל': 1, 'כל המילים': 1, 'band 2': 2, 'band ii': 2, 'band 3': 3, 'band iii': 3 },
  level: { 'קל': 1, 'בינוני': 2, 'קשה': 3 }
};

/** 1, 2 or 3 from a button press or a word, else null. */
function parseChoice(step, text) {
  const t = String(text || '').trim().toLowerCase();
  if (/^[123]$/.test(t)) return Number(t);
  return CHOICE_WORDS[step][t] || null;
}

const options = (step) => Object.entries(step === 'type' ? WORD_SETS : LEVELS).map(([key, v]) => ({ key: Number(key), label: v.he }));

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

  /** A setup answer: word set, then level; the words are picked after the level. */
  static async setup(user, session, text) {
    const choice = parseChoice(session.setup_step, text);
    if (!choice) return { sessionId: session.id, ...setupView(session), invalid: true };
    if (session.setup_step === 'type') {
      const next = await BotSession.update(session.id, { word_set: choice, setup_step: 'level' });
      return { sessionId: session.id, ...setupView(next) };
    }
    const words = await pickWordsForUser(user, SESSION_SIZE, { level: choice, wordSet: session.word_set });
    if (words.length < 3) return { sessionId: session.id, ...setupView(session), notEnoughWords: true };
    const ids = words.map(w => w.id);
    const started = await BotSession.update(session.id, {
      level: choice, status: 'active', setup_step: null, word_ids: ids, queue: ids, round_size: ids.length
    });
    return {
      sessionId: started.id, started: true, wordSet: WORD_SETS[started.word_set].he, level: LEVELS[choice].he,
      word: wordView(words[0]), progress: progress(started)
    };
  }

  /** Check the student's text against the current word and move on. */
  static async answer(user, chatId, text) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { error: 'no_session' };
    if (isEndCommand(text)) return this.end(user, chatId);
    if (session.status === 'setup') return this.setup(user, session, text);

    const word = await currentWord(session);
    const correct = hebrewAnswerMatches(text, word.hebrew_translation);
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
      correct, expected: correct ? null : word.hebrew_translation, points: correct ? POINTS_PER_CORRECT : 0,
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
