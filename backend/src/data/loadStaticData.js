const JsonDatabase = require('./JsonDatabase');
const IndexManager = require('./IndexManager');
const path = require('path');

/**
 * Initialize the database and load all data
 */
async function initializeDatabase() {
  const dataDir = path.join(__dirname, '../../data');
  const db = new JsonDatabase(dataDir);
  const indexManager = new IndexManager(db);

  // Initialize database (loads all collections)
  await db.initialize();

  // Initialize indexes and constraints
  indexManager.initializeCommonIndexes();

  return { db, indexManager };
}

/**
 * Create lookup maps for frequently accessed static data
 * This provides O(1) lookups by ID
 */
function createLookupMaps(db) {
  const lookups = {
    lessons: new Map(),
    exercises: new Map(),
    vocabularyWords: new Map(),
    achievements: new Map(),
    unseenParagraphs: new Map(),
    unseenQuestions: new Map()
  };

  // Build lessons lookup
  const lessons = db.getCollection('lessons', true);
  lessons.forEach(lesson => {
    lookups.lessons.set(lesson.id, lesson);
  });

  // Build exercises lookup (by ID and by lesson_id)
  const exercises = db.getCollection('exercises', true);
  lookups.exercisesByLesson = new Map();
  exercises.forEach(exercise => {
    lookups.exercises.set(exercise.id, exercise);

    if (!lookups.exercisesByLesson.has(exercise.lesson_id)) {
      lookups.exercisesByLesson.set(exercise.lesson_id, []);
    }
    lookups.exercisesByLesson.get(exercise.lesson_id).push(exercise);
  });

  // Build vocabulary words lookup (by ID and by difficulty)
  const words = db.getCollection('vocabulary_words', true);
  lookups.vocabularyByDifficulty = new Map();
  words.forEach(word => {
    lookups.vocabularyWords.set(word.id, word);

    if (!lookups.vocabularyByDifficulty.has(word.difficulty_level)) {
      lookups.vocabularyByDifficulty.set(word.difficulty_level, []);
    }
    lookups.vocabularyByDifficulty.get(word.difficulty_level).push(word);
  });

  // Build achievements lookup
  const achievements = db.getCollection('achievements', true);
  achievements.forEach(achievement => {
    lookups.achievements.set(achievement.id, achievement);
  });

  // Build unseen paragraphs lookup
  const paragraphs = db.getCollection('unseen_paragraphs', true);
  lookups.paragraphsByComplexity = new Map();
  paragraphs.forEach(paragraph => {
    lookups.unseenParagraphs.set(paragraph.id, paragraph);

    if (!lookups.paragraphsByComplexity.has(paragraph.complexity_level)) {
      lookups.paragraphsByComplexity.set(paragraph.complexity_level, []);
    }
    lookups.paragraphsByComplexity.get(paragraph.complexity_level).push(paragraph);
  });

  // Build unseen questions lookup (by ID and by paragraph_id)
  const questions = db.getCollection('unseen_questions', true);
  lookups.questionsByParagraph = new Map();
  questions.forEach(question => {
    lookups.unseenQuestions.set(question.id, question);

    if (!lookups.questionsByParagraph.has(question.paragraph_id)) {
      lookups.questionsByParagraph.set(question.paragraph_id, []);
    }
    lookups.questionsByParagraph.get(question.paragraph_id).push(question);
  });

  return lookups;
}

/**
 * Precompute vocabulary word pools for quiz selection
 */
function createVocabularyPools(db) {
  const words = db.getCollection('vocabulary_words', true);
  const pools = {
    byDifficulty: new Map(),
    bySource: new Map(),
    all: [...words]
  };

  // Shuffle all words
  shuffleArray(pools.all);

  // Group by difficulty
  for (let level = 1; level <= 10; level++) {
    const levelWords = words.filter(w => w.difficulty_level === level);
    shuffleArray(levelWords);
    pools.byDifficulty.set(level, levelWords);
  }

  // Group by source
  const sources = [...new Set(words.map(w => w.source))];
  sources.forEach(source => {
    const sourceWords = words.filter(w => w.source === source);
    shuffleArray(sourceWords);
    pools.bySource.set(source, sourceWords);
  });

  return pools;
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get statistics about loaded data
 */
function getDataStats(db) {
  return {
    lessons: db.count('lessons'),
    exercises: db.count('exercises'),
    vocabularyWords: db.count('vocabulary_words'),
    achievements: db.count('achievements'),
    unseenParagraphs: db.count('unseen_paragraphs'),
    unseenQuestions: db.count('unseen_questions'),
    users: db.count('users'),
    userProgress: db.count('user_progress'),
    wrongAnswers: db.count('wrong_answers'),
    vocabularyQuizSessions: db.count('vocabulary_quiz_sessions'),
    vocabularyWordScores: db.count('vocabulary_word_scores')
  };
}

module.exports = {
  initializeDatabase,
  createLookupMaps,
  createVocabularyPools,
  shuffleArray,
  getDataStats
};
