const BotSession = require('../models/BotSession');
const VocabularyWord = require('../models/VocabularyWord');
const VocabularyWordScores = require('../models/VocabularyWordScores');
const VocabularyFailedWords = require('../models/VocabularyFailedWords');
const { pickWordsForUser } = require('./bot/wordPicker');
const { hebrewAnswerMatches } = require('../utils/hebrewAnswer');
const { shuffleArray } = require('../utils/shuffle');
const { SESSION_SIZE, END_WORDS } = require('../config/bot');

/**
 * The chat-bot vocabulary session: start, answer, end. Every reply is plain
 * data; the bot turns it into Hebrew text. The service never talks to a
 * model: words come from the vocabulary store, verdicts from hebrewAnswer.
 */

const isEndCommand = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

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

function summary(session) {
  return {
    words: session.word_ids.length,
    rounds: session.round,
    correct: session.correct_count,
    wrong: session.wrong_count,
    remainingFailed: session.failed_word_ids.length + session.queue.length
  };
}

const currentWord = (session) => (session.queue.length ? VocabularyWord.findById(session.queue[0]) : null);

class BotService {
  /** Start a session for the chat; an active one is replaced. */
  static async start(user, chatId) {
    const active = await BotSession.findActiveByChat(chatId);
    if (active) await BotSession.end(active.id, 'replaced');
    const words = await pickWordsForUser(user, SESSION_SIZE);
    if (words.length < 3) return { error: 'not_enough_words' };
    const session = await BotSession.create({ userId: user.id, chatId, wordIds: words.map(w => w.id) });
    return { sessionId: session.id, word: wordView(words[0]), progress: progress(session) };
  }

  /** Check the student's text against the current word and move on. */
  static async answer(user, chatId, text) {
    const session = await BotSession.findActiveByChat(chatId);
    if (!session) return { error: 'no_session' };
    if (isEndCommand(text)) return this.end(user, chatId);

    const word = await currentWord(session);
    const correct = hebrewAnswerMatches(text, word.hebrew_translation);
    await VocabularyWordScores.recordAttempt(user.id, word.id, correct);
    if (!correct) await VocabularyFailedWords.addOrIncrementFail(user.id, word.id);

    const updates = {
      queue: session.queue.slice(1),
      asked_in_round: session.asked_in_round + 1,
      correct_count: session.correct_count + (correct ? 1 : 0),
      wrong_count: session.wrong_count + (correct ? 0 : 1),
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
    const reply = { correct, expected: correct ? null : word.hebrew_translation, roundStarted, done: false };
    if (next.queue.length === 0) {
      const ended = await BotSession.end(next.id, 'completed');
      return { ...reply, done: true, word: null, summary: summary(ended) };
    }
    return { ...reply, word: wordView(await currentWord(next)), progress: progress(next) };
  }

  static async end(user, chatId) {
    const session = await BotSession.findActiveByChat(chatId);
    if (!session) return { error: 'no_session' };
    const ended = await BotSession.end(session.id, 'ended');
    return { done: true, word: null, summary: summary(ended) };
  }

  static async status(chatId) {
    const session = await BotSession.findActiveByChat(chatId);
    if (!session) return { active: false };
    return { active: true, sessionId: session.id, word: wordView(await currentWord(session)), progress: progress(session) };
  }
}

module.exports = BotService;
module.exports.isEndCommand = isEndCommand;
