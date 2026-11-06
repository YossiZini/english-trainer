const BotSession = require('../models/BotSession');
const VocabularyWord = require('../models/VocabularyWord');
const VocabularyWordScores = require('../models/VocabularyWordScores');
const VocabularyFailedWords = require('../models/VocabularyFailedWords');
const VocabularyUserStats = require('../models/VocabularyUserStats');
const User = require('../models/User');
const { pickWordsForUser, LEVELS } = require('./bot/wordPicker');
const { pickOptions } = require('./bot/wordOptions');
const { maskAnswer } = require('../utils/englishAnswer');
const { shuffleArray } = require('../utils/shuffle');
const { SESSION_SIZE, EXAMPLE_WORDS } = require('../config/bot');
const { isEndCommand } = require('../utils/botWords');
const ReportService = require('./report.service');

/**
 * The chat-bot vocabulary session: start (setup questions), answer, end.
 * Words are always drawn from all words; the student picks only the level.
 * Every word is a question with four options (bot/wordOptions.js), stored
 * with the session while the word waits; the student answers with a button
 * (the option's text) or its number, and the verdict is whether the chosen
 * option is the word.
 * Every reply is plain data; the bot turns it into Hebrew text. The
 * service never talks to a model: words come from the vocabulary store,
 * points from User.addPoints.
 */

const POINTS_PER_CORRECT = 1;
const isExampleRequest = (text) => EXAMPLE_WORDS.includes(String(text || '').trim().toLowerCase());

const LEVEL_WORDS = { easy: 1, medium: 2, hard: 3, 'קל': 1, 'בינוני': 2, 'קשה': 3 };

/** The two directions of the words exam: the shown side → the side the student chooses from. */
const DIRECTIONS = {
  1: { key: 'en-he', he: 'מאנגלית לעברית' },
  2: { key: 'he-en', he: 'מעברית לאנגלית' }
};
const DIRECTION_WORDS = { 'en-he': 1, 'he-en': 2, 'מאנגלית לעברית': 1, 'מעברית לאנגלית': 2 };
const directionOf = (session) => session.direction || 'en-he';
const directionLabel = (key) => Object.values(DIRECTIONS).find(d => d.key === key).he;
const opposite = (key) => (key === 'he-en' ? 'en-he' : 'he-en');

/** 1, 2 or 3 from a button press or a level word, else null. */
function parseChoice(text) {
  const t = String(text || '').trim().toLowerCase();
  if (/^[123]$/.test(t)) return Number(t);
  return LEVEL_WORDS[t] || null;
}

/** 'en-he' or 'he-en' from a button press ('1', '2') or a direction word, else null. */
function parseDirection(text) {
  const t = String(text || '').trim().toLowerCase();
  const n = /^[12]$/.test(t) ? Number(t) : DIRECTION_WORDS[t];
  return n ? DIRECTIONS[n].key : null;
}

const options = (step) => (step === 'direction'
  ? Object.entries(DIRECTIONS).map(([key, v]) => ({ key: Number(key), label: v.he }))
  : Object.entries(LEVELS).map(([key, v]) => ({ key: Number(key), label: v.he })));

function setupView(session) {
  return { setup: session.setup_step, options: options(session.setup_step) };
}

/**
 * The word as shown to the student, with its options' texts: en-he shows
 * the English (and keeps the `english` field older bot versions read) and
 * Hebrew options, he-en the Hebrew and English options.
 */
function wordView(word, direction = 'en-he', options = null) {
  if (!word) return null;
  const choices = options ? { options: options.map(o => o.text) } : {};
  if (direction === 'he-en') return { id: word.id, direction, prompt: word.hebrew_translation, ...choices };
  return { id: word.id, direction, prompt: word.english_word, english: word.english_word, sentence: word.sentence_en || null, ...choices };
}

/** The example sentence for "?": in he-en with the answer blanked, so it does not give it away. */
const exampleOf = (word, direction) => (direction === 'he-en'
  ? maskAnswer(word.sentence_en, word.english_word)
  : word.sentence_en || null);

/** The four options of `word` in this direction, as the session stores them: [{ id, text }]. */
async function optionsFor(word, direction) {
  if (!word) return null;
  const { options } = pickOptions(word, await VocabularyWord.visible(), { direction });
  return options.map(({ id, text }) => ({ id, text }));
}

/** An option's text as compared: no isolates or direction marks, spaces and case ignored. */
const plain = (s) => String(s || '').replace(/[\u2066-\u2069\u200e\u200f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/** The index of the option the student chose, by its number (1–4) or its text (a button), else -1. */
function chosenOption(text, options) {
  const t = plain(text);
  if (/^[1-9]$/.test(t)) return Number(t) <= options.length ? Number(t) - 1 : -1;
  return options.findIndex(o => plain(o.text) === t);
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
    totalPoints,
    // The same words can be taken again the other way round (switchDirection).
    switchTo: session.word_ids.length
      ? { direction: opposite(directionOf(session)), label: directionLabel(opposite(directionOf(session))) }
      : null
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

  /**
   * The setup answers: first the level, then the direction; the words are
   * picked right after the direction.
   */
  static async setup(user, session, text) {
    if (session.setup_step !== 'direction') {
      const choice = parseChoice(text);
      if (!choice) return { sessionId: session.id, ...setupView(session), invalid: true };
      const next = await BotSession.update(session.id, { level: choice, setup_step: 'direction' });
      return { sessionId: next.id, level: LEVELS[choice].he, ...setupView(next) };
    }
    const direction = parseDirection(text);
    if (!direction) return { sessionId: session.id, ...setupView(session), invalid: true };
    const words = await pickWordsForUser(user, SESSION_SIZE, { level: session.level });
    if (words.length < 3) return { sessionId: session.id, ...setupView(session), notEnoughWords: true };
    const ids = words.map(w => w.id);
    const options = await optionsFor(words[0], direction);
    const started = await BotSession.update(session.id, {
      direction, status: 'active', setup_step: null, word_ids: ids, queue: ids, round_size: ids.length, current_options: options
    });
    return {
      sessionId: started.id, started: true, level: LEVELS[session.level].he,
      direction, directionLabel: directionLabel(direction),
      word: wordView(words[0], direction, options), progress: progress(started)
    };
  }

  /**
   * The student's choice for the current word: right when the chosen option
   * is the word. Anything that is not one of the options (a typed word, a
   * stale button) is not an answer: the question is asked again.
   */
  static async answer(user, chatId, text) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { error: 'no_session' };
    // "stop" and "end" are words of the list: as one of the options they are
    // an answer, not the end ("/end" always ends).
    const isOption = session.status === 'active' && !!session.current_options && chosenOption(text, session.current_options) >= 0;
    if (isEndCommand(text) && !isOption) return this.end(user, chatId);
    if (session.status === 'setup') return this.setup(user, session, text);

    const word = await currentWord(session);
    const direction = directionOf(session);
    let options = session.current_options;
    if (!options || !options.length) {
      // A session from before the choices: its word gets its options now, and waits for a choice.
      options = await optionsFor(word, direction);
      await BotSession.update(session.id, { current_options: options });
      if (!isExampleRequest(text)) return { invalid: true, word: wordView(word, direction, options), progress: progress(session) };
    }
    if (isExampleRequest(text)) {
      // The example sentence of the current word; not an answer, nothing recorded.
      return { example: true, sentence: exampleOf(word, direction), word: wordView(word, direction, options), progress: progress(session) };
    }
    const chosen = chosenOption(text, options);
    if (chosen < 0) return { invalid: true, word: wordView(word, direction, options), progress: progress(session) };
    const correct = options[chosen].id === word.id;
    const expected = correct ? null : options.find(o => o.id === word.id).text;

    const updates = {
      queue: session.queue.slice(1),
      asked_in_round: session.asked_in_round + 1,
      correct_count: session.correct_count + (correct ? 1 : 0),
      wrong_count: session.wrong_count + (correct ? 0 : 1),
      // Wrong answers in a row, for the bot's encouragement (a right answer resets it).
      wrong_streak: correct ? 0 : (session.wrong_streak || 0) + 1,
      points_earned: (session.points_earned || 0) + (correct ? POINTS_PER_CORRECT : 0),
      failed_word_ids: correct ? session.failed_word_ids : [...session.failed_word_ids, word.id],
      // What /report refers to: the word answered last, and the option chosen.
      last_word_id: word.id,
      last_given: options[chosen].text.slice(0, 100),
      answered: (session.answered || 0) + 1
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
    const nextWord = updates.queue.length ? await VocabularyWord.findById(updates.queue[0]) : null;
    updates.current_options = await optionsFor(nextWord, direction);
    // Only the request that moves the exam past this word goes on: of two
    // choices sent together (a double tap), the second records nothing. The
    // last answer and the end are one write.
    const next = await BotSession.claimAnswer(session.id, session.answered || 0, updates, nextWord ? null : 'completed', 'answered');
    if (!next) return this.alreadyAnswered(chatId);

    await VocabularyWordScores.recordAttempt(user.id, word.id, correct);
    let totalPoints = null;
    if (correct) {
      totalPoints = (await User.addPoints(user.id, POINTS_PER_CORRECT)).total_points;
    } else {
      await VocabularyFailedWords.addOrIncrementFail(user.id, word.id);
      await VocabularyUserStats.incrementFails(user.id);
    }
    const reply = {
      correct, chosen: options[chosen].text, expected, points: correct ? POINTS_PER_CORRECT : 0,
      roundStarted, done: false,
      // For the bot's encouraging line: which one (a new one each wrong answer) and whether to cheer harder.
      wrongCount: updates.wrong_count, wrongStreak: updates.wrong_streak
    };
    if (!nextWord) return { ...reply, done: true, word: null, summary: summary(next, totalPoints) };
    return { ...reply, word: wordView(nextWord, direction, next.current_options), progress: progress(next) };
  }

  /** The choice was the twin of one just recorded (a double tap): where the exam is now, or no session after its end. */
  static async alreadyAnswered(chatId) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session || session.status !== 'active') return { error: 'no_session' };
    return {
      alreadyAnswered: true,
      word: wordView(await currentWord(session), directionOf(session), session.current_options), progress: progress(session)
    };
  }

  /**
   * The same words as the chat's last finished words exam, the other way
   * round: all of them again, in a new order, at the same level, with no
   * setup questions. An open session is replaced, as with start.
   */
  static async switchDirection(user, chatId) {
    // An exam still open with words is the one to turn round; else the last finished one.
    const open = await BotSession.findOpenByChat(chatId);
    const openWords = open && BotSession.kindOf(open) === 'vocab' && open.word_ids && open.word_ids.length ? open : null;
    const last = openWords || await BotSession.findLastFinishedVocab(chatId, user.id);
    if (!last) return { error: 'no_session' };
    if (open) await BotSession.end(open.id, 'replaced');
    const direction = opposite(directionOf(last));
    const ids = shuffleArray(last.word_ids);
    const first = await VocabularyWord.findById(ids[0]);
    const options = await optionsFor(first, direction);
    const created = await BotSession.create({ userId: user.id, chatId });
    const started = await BotSession.update(created.id, {
      level: last.level, direction, status: 'active', setup_step: null,
      word_ids: ids, queue: ids, round_size: ids.length, switched_from: last.id, current_options: options
    });
    return {
      sessionId: started.id, started: true, switched: true, level: LEVELS[last.level] ? LEVELS[last.level].he : null,
      direction, directionLabel: directionLabel(direction),
      word: wordView(first, direction, options), progress: progress(started)
    };
  }

  static async end(user, chatId) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { error: 'no_session' };
    const ended = await BotSession.end(session.id, 'ended');
    const fresh = await User.findById(user.id);
    return { done: true, word: null, summary: summary(ended, fresh ? fresh.total_points : null) };
  }

  /**
   * Report a word of a words exam (`session`, open or finished within the
   * hour; found by bot/report.js): the word answered last, else the current
   * one. Nothing in the exam changes; the reply shows the word as the exam
   * showed it, so an unanswered he-en word does not give its English away.
   */
  static async reportWord(user, session, reason) {
    const answered = !!session.last_word_id;
    const wordId = session.last_word_id || (session.status === 'active' ? session.queue[0] : null);
    if (!wordId) return { error: 'no_session' };
    const direction = directionOf(session);
    const result = await ReportService.reportWord(user.id, {
      wordId, reason, source: 'bot', direction, given: answered ? session.last_given || null : null
    });
    if (result.error) return result;
    return {
      kind: 'vocab', reported: true, duplicate: result.duplicate,
      reportedWord: wordView(result.word, answered ? 'en-he' : direction).prompt,
      active: session.status === 'active'
    };
  }

  static async status(chatId) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { active: false };
    if (session.status === 'setup') return { active: true, kind: 'vocab', sessionId: session.id, ...setupView(session) };
    return {
      active: true, kind: 'vocab', sessionId: session.id,
      word: wordView(await currentWord(session), directionOf(session), session.current_options), progress: progress(session)
    };
  }
}

module.exports = BotService;
module.exports.isEndCommand = isEndCommand;
module.exports.parseChoice = parseChoice;
module.exports.parseDirection = parseDirection;
