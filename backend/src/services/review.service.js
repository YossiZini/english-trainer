const Exercise = require('../models/Exercise');
const Lesson = require('../models/Lesson');
const QuestionReport = require('../models/QuestionReport');
const QuestionOverride = require('../models/QuestionOverride');
const VocabularyWord = require('../models/VocabularyWord');
const WordReport = require('../models/WordReport');
const WordOverride = require('../models/WordOverride');
const { choiceMatches } = require('../utils/answers');

/**
 * The review of reported questions and words, open to every linked student
 * in the Telegram bot (/review), within a daily cap on the review agent's
 * proposals. The queue groups open reports by item; a decision keeps,
 * changes or removes the item (QuestionOverride / WordOverride, live at
 * once) and closes its reports. Every change is validated here, whoever
 * proposed it.
 *
 * Items are addressed by a key: a question's key is its exercise id, a
 * word's is "word:<id>".
 */
const DECISIONS = ['keep', 'change', 'remove'];
const MAX_TEXT = 500;
const MAX_EXPLANATION = 1000;
const MAX_OPTION = 120;
const MAX_TRANSLATION = 120;
const MAX_SENTENCE = 300;
const MAX_ENGLISH_ALTERNATIVES = 5;
const MAX_ENGLISH = 60;
const WORD_KEY = 'word:';
const wordKey = (id) => WORD_KEY + id;

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

/**
 * Why a proposed word change is not valid, or null. The translation may list
 * alternatives ("גדול / ענק"), each accepted as an answer in English→Hebrew;
 * `english_alternatives` are other English answers accepted in
 * Hebrew→English; the sentence is English and should use the word.
 */
function invalidWordChange(change) {
  if (!change || typeof change !== 'object') return 'missing change';
  const { hebrew_translation: hebrew, sentence_en: sentence, english_alternatives: english } = change;
  if (typeof hebrew !== 'string' || !hebrew.trim() || hebrew.length > MAX_TRANSLATION) return 'hebrew translation is empty or too long';
  if (!/[\u05D0-\u05EA]/.test(hebrew) || /[A-Za-z]/.test(hebrew)) return 'the translation must be in Hebrew';
  if (hebrew.split(/[/,;|]/).some(part => !part.trim())) return 'every alternative must be a non-empty text';
  if (sentence !== undefined && sentence !== null) {
    if (typeof sentence !== 'string' || sentence.length > MAX_SENTENCE) return 'example sentence is too long';
    if (/[\u0590-\u05FF]/.test(sentence)) return 'the example sentence must be in English';
  }
  if (english !== undefined && english !== null) {
    if (!Array.isArray(english) || english.length > MAX_ENGLISH_ALTERNATIVES) return `at most ${MAX_ENGLISH_ALTERNATIVES} English alternatives`;
    if (english.some(e => typeof e !== 'string' || !e.trim() || e.length > MAX_ENGLISH || !/^[A-Za-z][A-Za-z '()\-.,;]*$/.test(e.trim()))) {
      return 'every English alternative must be a short English word or phrase';
    }
  }
  return null;
}

/**
 * The fields a word change may set. A new English sentence drops the Hebrew
 * one, which translated the old sentence.
 */
function pickWord(change, word) {
  const sentence = typeof change.sentence_en === 'string' && change.sentence_en.trim() ? change.sentence_en.trim() : null;
  const fields = {
    hebrew_translation: change.hebrew_translation.trim(),
    sentence_en: sentence,
    english_alternatives: Array.isArray(change.english_alternatives)
      ? [...new Set(change.english_alternatives.map(e => e.trim()))] : []
  };
  if (sentence !== (word.sentence_en || null)) fields.sentence_he = null;
  return fields;
}

/** The fields a change may set, nothing else. */
const pick = (change) => ({
  question_text_he: change.question_text_he.trim(),
  options: change.options,
  correct_answer: change.correct_answer,
  explanation_he: typeof change.explanation_he === 'string' ? change.explanation_he.trim() : null
});

class ReviewService {
  /** Questions and words under review, oldest report first. */
  static async queue() {
    const items = [...(await this.questionItems()), ...(await this.wordItems())];
    items.sort((a, b) => new Date(a.firstReportedAt) - new Date(b.firstReportedAt));
    return { total: items.length, items };
  }

  /** Words under review, with their reports and the word as now served. */
  static async wordItems() {
    const byWord = new Map();
    for (const r of await WordReport.findOpenReports()) {
      if (!byWord.has(r.word_id)) byWord.set(r.word_id, []);
      byWord.get(r.word_id).push(r);
    }
    const items = [];
    for (const [wordId, reports] of byWord) {
      const word = await VocabularyWord.findById(wordId);
      if (!word) continue;
      reports.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      items.push({
        kind: 'word', key: wordKey(wordId), wordId,
        word: {
          english: word.english_word, hebrew: word.hebrew_translation,
          sentence: word.sentence_en || null, difficulty: word.difficulty_level || null,
          englishAlternatives: word.english_alternatives || []
        },
        reports: reports.map(r => ({
          reason: r.reason, note: r.note || null, source: r.source,
          direction: r.direction || null, given: r.given || null, at: r.created_at
        })),
        firstReportedAt: reports[0].created_at
      });
    }
    return items;
  }

  /** Questions under review, with the reports and the question as now served. */
  static async questionItems() {
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
        kind: 'question', key: exerciseId,
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
    return items;
  }

  /** Apply the admin's decision to a question ("<exercise id>") or word ("word:<id>") under review. */
  static async decide(key, decision, change = null) {
    if (!DECISIONS.includes(decision)) return { error: 'bad_decision' };
    if (typeof key === 'string' && key.startsWith(WORD_KEY)) return this.decideWord(key.slice(WORD_KEY.length), decision, change);
    const exerciseId = key;
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

  static async decideWord(wordId, decision, change) {
    const word = wordId ? await VocabularyWord.findById(wordId) : null;
    if (!word) return { error: 'word_not_found' };
    if (decision === 'change') {
      const reason = invalidWordChange(change);
      if (reason) return { error: 'invalid_change', reason };
      await WordOverride.decide(wordId, 'change', pickWord(change, word));
    } else {
      await WordOverride.decide(wordId, decision);
    }
    const closed = await WordReport.decide(wordId, decision);
    return { decided: true, decision, closed };
  }
}

module.exports = ReviewService;
module.exports.invalidChange = invalidChange;
module.exports.invalidWordChange = invalidWordChange;
module.exports.wordKey = wordKey;
