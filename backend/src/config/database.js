const path = require('path');
const { StaticStore } = require('../data/StaticStore');
const FirestoreDatabase = require('../data/FirestoreDatabase');
const { getFirestore } = require('./firestore');

// Curriculum content bundled with the image; student data in Firestore.
const staticStore = new StaticStore(path.join(__dirname, '../../data/static'));
const db = new FirestoreDatabase({ firestore: getFirestore(), staticStore });

// The dynamic (student-produced) collections. Kept here as the single list
// for tests and maintenance scripts.
const DYNAMIC_COLLECTIONS = [
  'users', 'user_progress', 'exercise_results', 'wrong_answers',
  'user_achievements', 'vocabulary_quiz_sessions', 'vocabulary_word_scores',
  'vocabulary_user_stats', 'vocabulary_user_history', 'vocabulary_failed_words',
  'unseen_sessions', 'unseen_answers', 'unseen_user_progress',
  'daily_challenges', 'user_daily_challenges', 'vocabulary_kanban_tasks',
  'bot_sessions', 'telegram_links', 'bot_usage', 'question_reports',
  'question_overrides', 'word_reports', 'word_overrides'
];

let initialized = false;

/**
 * Load the static content into memory. Call during server startup.
 */
async function initializeDatabase() {
  if (initialized) return db;
  console.log('🔄 Loading curriculum content...');
  staticStore.load();
  initialized = true;
  console.log('✅ Content loaded; student data in Firestore');
  return db;
}

/**
 * Nothing to flush: every write is persisted in Firestore immediately.
 */
async function shutdownDatabase() {
  await db.firestore.terminate();
}

function getDatabase() {
  return db;
}

async function withTransaction(callback) {
  return db.withTransaction(callback);
}

module.exports = {
  db,
  DYNAMIC_COLLECTIONS,
  initializeDatabase,
  shutdownDatabase,
  getDatabase,
  withTransaction
};
