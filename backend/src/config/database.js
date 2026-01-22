const path = require('path');
const JsonDatabase = require('../data/JsonDatabase');
const IndexManager = require('../data/IndexManager');

// Initialize JSON Database
const dataDir = path.join(__dirname, '../../data');
const db = new JsonDatabase(dataDir);
const indexManager = new IndexManager(db);

// Flag to track initialization
let initialized = false;

/**
 * Initialize the database
 * Call this during server startup
 */
async function initializeDatabase() {
  if (initialized) return;

  console.log('🔄 Initializing JSON Database...');

  await db.initialize();
  indexManager.initializeCommonIndexes();

  initialized = true;
  console.log('✅ JSON Database initialized successfully');

  return { db, indexManager };
}

/**
 * Shutdown the database
 * Call this during server shutdown
 */
async function shutdownDatabase() {
  console.log('🔄 Shutting down JSON Database...');
  await db.shutdown();
  console.log('✅ JSON Database shut down successfully');
}

/**
 * Get the database instance
 */
function getDatabase() {
  return db;
}

/**
 * Get the index manager instance
 */
function getIndexManager() {
  return indexManager;
}

/**
 * Transaction helper - wraps operations in a transaction
 * Returns a client-like object for compatibility
 */
function getClient() {
  const transactionId = db.beginTransaction();

  return {
    transactionId,
    query: async (sql, params) => {
      // This is for backwards compatibility during migration
      // Models should be updated to use db methods directly
      console.warn('Warning: Direct SQL query detected. Please migrate to JSON methods.');
      return { rows: [] };
    },
    release: () => {
      // No-op for JSON database
    }
  };
}

/**
 * Begin a transaction
 */
function beginTransaction() {
  return db.beginTransaction();
}

/**
 * Commit a transaction
 */
function commitTransaction(transactionId) {
  return db.commitTransaction(transactionId);
}

/**
 * Rollback a transaction
 */
function rollbackTransaction(transactionId) {
  return db.rollbackTransaction(transactionId);
}

/**
 * Execute within a transaction
 */
async function withTransaction(callback) {
  return db.withTransaction(callback);
}

// Legacy pool-like interface for gradual migration
const pool = {
  query: async (text, params) => {
    console.warn('Warning: pool.query() called. Please migrate to JSON methods.');
    return { rows: [] };
  },
  connect: async () => {
    return getClient();
  }
};

module.exports = {
  // New JSON Database API
  db,
  indexManager,
  initializeDatabase,
  shutdownDatabase,
  getDatabase,
  getIndexManager,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  withTransaction,

  // Legacy API for backwards compatibility during migration
  pool,
  getClient,
  query: pool.query
};
