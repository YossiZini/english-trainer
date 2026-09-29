const BotSession = require('../models/BotSession');
const VocabularyWord = require('../models/VocabularyWord');
const VocabularyWordScores = require('../models/VocabularyWordScores');
const VocabularyFailedWords = require('../models/VocabularyFailedWords');
const VocabularyUserStats = require('../models/VocabularyUserStats');
const User = require('../models/User');
const { pickWordsForUser, LEVELS } = require('./bot/wordPicker');
const { hebrewAnswerMatches, judgeable } = require('../utils/hebrewAnswer');
const {
  englishAnswerMatch, core: englishCore, judgeable: englishJudgeable, maskAnswer
} = require('../utils/englishAnswer');
const { shuffleArray } = require('../utils/shuffle');
const BotUsage = require('../models/BotUsage');
const { SESSION_SIZE, END_WORDS, EXAMPLE_WORDS, DAILY_JUDGE_CAP } = require('../config/bot');
const answerJudge = require('./bot/answerJudge');
const ReportService = require('./report.service');

/**
 * The chat-bot vocabulary session: start (setup questions), answer, end.
 * Words are always drawn from all words; the student picks only the level.
 * A short Hebrew answer that misses the dictionary gets one Gemini check
 * (bot/answerJudge.js), within the student's daily judge cap; the API
 * owns the verdict either way.
 * Every reply is plain data; the bot turns it into Hebrew text. The
 * service never talks to a model: words come from the vocabulary store,
 * verdicts from hebrewAnswer, points from User.addPoints.
 */

const POINTS_PER_CORRECT = 1;
const isEndCommand = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());
const isExampleRequest = (text) => EXAMPLE_WORDS.includes(String(text || '').trim().toLowerCase());

const LEVEL_WORDS = { easy: 1, medium: 2, hard: 3, 'קל': 1, 'בינוני': 2, 'קשה': 3 };

/** The two directions of the words exam: the shown side → the side the student types. */
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
 * The word as shown to the student: en-he shows the English (and keeps the
 * `english` field older bot versions read), he-en shows only the Hebrew.
 */
function wordView(word, direction = 'en-he') {
  if (!word) return null;
  if (direction === 'he-en') return { id: word.id, direction, prompt: word.hebrew_translation };
  return { id: word.id, direction, prompt: word.english_word, english: word.english_word, sentence: word.sentence_en || null };
}

/** The example sentence for "?": in he-en with the answer blanked, so it does not give it away. */
const exampleOf = (word, direction) => (direction === 'he-en'
  ? maskAnswer(word.sentence_en, word.english_word)
  : word.sentence_en || null);

/** Is the student's text right for the current word in this direction? */
async function checkAnswer(user, word, text, direction) {
  const given = String(text).trim();
  if (direction === 'he-en') {
    const others = [
      ...(await VocabularyWord.findEnglishByHebrew(word.hebrew_translation, word.id)),
      ...(word.english_alternatives || [])
    ];
    const match = englishAnswerMatch(text, word.english_word, others);
    // A one-letter slip that spells another stored word is a different word, not a typo.
    const matched = match === 'exact' || (match === 'typo' && !(await VocabularyWord.isEnglishWord(text, englishCore)));
    const judged = !matched && englishJudgeable(text) && await BotUsage.reserveJudgement(user.id, DAILY_JUDGE_CAP)
      && await answerJudge.accepts({ direction, hebrew: word.hebrew_translation, english: word.english_word, given });
    return { matched, judged, expected: word.english_word };
  }
  const matched = hebrewAnswerMatches(text, word.hebrew_translation);
  const judged = !matched && judgeable(text) && await BotUsage.reserveJudgement(user.id, DAILY_JUDGE_CAP)
    && await answerJudge.accepts({ english: word.english_word, expected: word.hebrew_translation, given });
  return { matched, judged, expected: word.hebrew_translation };
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
    const started = await BotSession.update(session.id, {
      direction, status: 'active', setup_step: null, word_ids: ids, queue: ids, round_size: ids.length
    });
    return {
      sessionId: started.id, started: true, level: LEVELS[session.level].he,
      direction, directionLabel: directionLabel(direction),
      word: wordView(words[0], direction), progress: progress(started)
    };
  }

  /** Check the student's text against the current word and move on. */
  static async answer(user, chatId, text) {
    const session = await BotSession.findOpenByChat(chatId);
    if (!session) return { error: 'no_session' };
    if (isEndCommand(text)) return this.end(user, chatId);
    if (session.status === 'setup') return this.setup(user, session, text);

    const word = await currentWord(session);
    const direction = directionOf(session);
    if (isExampleRequest(text)) {
      // The example sentence of the current word; not an answer, nothing recorded.
      return { example: true, sentence: exampleOf(word, direction), word: wordView(word, direction), progress: progress(session) };
    }
    const { matched, judged, expected } = await checkAnswer(user, word, text, direction);
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
      failed_word_ids: correct ? session.failed_word_ids : [...session.failed_word_ids, word.id],
      // What /report refers to: the word answered last, and the answer.
      last_word_id: word.id,
      last_given: String(text).trim().slice(0, 100)
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
      correct, judged, expected: matched ? null : expected, points: correct ? POINTS_PER_CORRECT : 0,
      roundStarted, done: false
    };
    if (next.queue.length === 0) {
      const ended = await BotSession.end(next.id, 'completed');
      return { ...reply, done: true, word: null, summary: summary(ended, totalPoints) };
    }
    return { ...reply, word: wordView(await currentWord(next), direction), progress: progress(next) };
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
    const created = await BotSession.create({ userId: user.id, chatId });
    const started = await BotSession.update(created.id, {
      level: last.level, direction, status: 'active', setup_step: null,
      word_ids: ids, queue: ids, round_size: ids.length, switched_from: last.id
    });
    return {
      sessionId: started.id, started: true, switched: true, level: LEVELS[last.level] ? LEVELS[last.level].he : null,
      direction, directionLabel: directionLabel(direction),
      word: wordView(await currentWord(started), direction), progress: progress(started)
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
      word: wordView(await currentWord(session), directionOf(session)), progress: progress(session)
    };
  }
}

module.exports = BotService;
module.exports.isEndCommand = isEndCommand;
module.exports.parseChoice = parseChoice;
module.exports.parseDirection = parseDirection;
