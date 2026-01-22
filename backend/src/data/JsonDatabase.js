const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * JsonDatabase - Core data access layer for JSON file storage
 * Replaces PostgreSQL pool with in-memory caching and file persistence
 */
class JsonDatabase {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.staticDir = path.join(dataDir, 'static');
    this.dynamicDir = path.join(dataDir, 'dynamic');

    // In-memory data cache
    this.collections = new Map();

    // Indexes for fast lookups
    this.indexes = new Map();

    // Write queue for debounced persistence
    this.writeQueue = new Map();
    this.writeDebounceMs = 1000;
    this.writeTimers = new Map();

    // File locks for concurrent access
    this.locks = new Map();

    // Transaction support
    this.activeTransactions = new Map();

    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.dataDir, this.staticDir, this.dynamicDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Generate a UUID v4
   */
  generateId() {
    return crypto.randomUUID();
  }

  /**
   * Get file path for a collection
   */
  getFilePath(collection, isStatic = false) {
    const dir = isStatic ? this.staticDir : this.dynamicDir;
    return path.join(dir, `${collection}.json`);
  }

  /**
   * Load a collection from disk into memory
   */
  loadCollection(collection, isStatic = false) {
    const filePath = this.getFilePath(collection, isStatic);

    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        this.collections.set(collection, parsed);
        return parsed;
      } catch (error) {
        console.error(`Error loading collection ${collection}:`, error);
        this.collections.set(collection, []);
        return [];
      }
    }

    this.collections.set(collection, []);
    return [];
  }

  /**
   * Get collection data (from memory or load from disk)
   */
  getCollection(collection, isStatic = false) {
    if (!this.collections.has(collection)) {
      this.loadCollection(collection, isStatic);
    }
    return this.collections.get(collection);
  }

  /**
   * Save collection to disk (debounced)
   */
  saveCollection(collection, isStatic = false, immediate = false) {
    const filePath = this.getFilePath(collection, isStatic);
    const data = this.collections.get(collection) || [];

    if (immediate) {
      this._writeFile(filePath, data);
      return;
    }

    // Debounced write
    if (this.writeTimers.has(collection)) {
      clearTimeout(this.writeTimers.get(collection));
    }

    this.writeQueue.set(collection, { filePath, data, isStatic });

    const timer = setTimeout(() => {
      const pending = this.writeQueue.get(collection);
      if (pending) {
        this._writeFile(pending.filePath, pending.data);
        this.writeQueue.delete(collection);
      }
      this.writeTimers.delete(collection);
    }, this.writeDebounceMs);

    this.writeTimers.set(collection, timer);
  }

  /**
   * Write file with lock
   */
  _writeFile(filePath, data) {
    const lockKey = filePath;

    // Simple mutex implementation
    const tryWrite = () => {
      if (this.locks.get(lockKey)) {
        setTimeout(tryWrite, 10);
        return;
      }

      this.locks.set(lockKey, true);
      try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      } finally {
        this.locks.set(lockKey, false);
      }
    };

    tryWrite();
  }

  /**
   * Flush all pending writes to disk
   */
  async flushAll() {
    // Clear all timers and write immediately
    for (const [collection, timer] of this.writeTimers) {
      clearTimeout(timer);
    }
    this.writeTimers.clear();

    // Write all pending
    for (const [collection, pending] of this.writeQueue) {
      this._writeFile(pending.filePath, pending.data);
    }
    this.writeQueue.clear();

    // Also save all loaded collections
    for (const [collection, data] of this.collections) {
      const isStatic = this._isStaticCollection(collection);
      const filePath = this.getFilePath(collection, isStatic);
      this._writeFile(filePath, data);
    }
  }

  _isStaticCollection(collection) {
    const staticCollections = [
      'lessons', 'exercises', 'vocabulary_words', 'achievements',
      'unseen_paragraphs', 'unseen_questions'
    ];
    return staticCollections.includes(collection);
  }

  // ============= CRUD Operations =============

  /**
   * Find all records matching criteria
   * @param {string} collection - Collection name
   * @param {Object} criteria - Filter criteria (optional)
   * @param {Object} options - Query options (sort, limit, offset)
   */
  find(collection, criteria = {}, options = {}) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    let results = this._filter(data, criteria);

    // Apply sorting
    if (options.sort) {
      results = this._sort(results, options.sort);
    }

    // Apply offset
    if (options.offset) {
      results = results.slice(options.offset);
    }

    // Apply limit
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Find one record matching criteria
   */
  findOne(collection, criteria = {}) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    return this._filter(data, criteria)[0] || null;
  }

  /**
   * Find record by ID
   */
  findById(collection, id) {
    return this.findOne(collection, { id });
  }

  /**
   * Insert a new record
   */
  insert(collection, record) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));

    // Auto-generate ID if not provided
    if (!record.id) {
      record.id = this.generateId();
    }

    // Auto-add timestamps
    if (!record.created_at) {
      record.created_at = new Date().toISOString();
    }

    data.push(record);
    this.collections.set(collection, data);
    this.saveCollection(collection, this._isStaticCollection(collection));

    // Update indexes
    this._updateIndexes(collection, record);

    return record;
  }

  /**
   * Insert multiple records
   */
  insertMany(collection, records) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));

    const inserted = records.map(record => {
      if (!record.id) {
        record.id = this.generateId();
      }
      if (!record.created_at) {
        record.created_at = new Date().toISOString();
      }
      return record;
    });

    data.push(...inserted);
    this.collections.set(collection, data);
    this.saveCollection(collection, this._isStaticCollection(collection));

    // Update indexes
    inserted.forEach(record => this._updateIndexes(collection, record));

    return inserted;
  }

  /**
   * Update records matching criteria
   */
  update(collection, criteria, updates, options = {}) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    let updated = 0;

    for (let i = 0; i < data.length; i++) {
      if (this._matchesCriteria(data[i], criteria)) {
        // Apply updates
        Object.assign(data[i], updates);
        data[i].updated_at = new Date().toISOString();
        updated++;

        // Update indexes
        this._updateIndexes(collection, data[i]);

        if (!options.multi) break; // Only update first match unless multi is true
      }
    }

    if (updated > 0) {
      this.collections.set(collection, data);
      this.saveCollection(collection, this._isStaticCollection(collection));
    }

    return { modified: updated };
  }

  /**
   * Update a record by ID
   */
  updateById(collection, id, updates) {
    return this.update(collection, { id }, updates);
  }

  /**
   * Upsert - Update if exists, insert if not
   */
  upsert(collection, criteria, record) {
    const existing = this.findOne(collection, criteria);

    if (existing) {
      return this.update(collection, criteria, record);
    } else {
      return this.insert(collection, { ...criteria, ...record });
    }
  }

  /**
   * Delete records matching criteria
   */
  delete(collection, criteria) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    const originalLength = data.length;

    const filtered = data.filter(record => !this._matchesCriteria(record, criteria));

    this.collections.set(collection, filtered);
    this.saveCollection(collection, this._isStaticCollection(collection));

    // Rebuild indexes for this collection
    this._rebuildIndexes(collection);

    return { deleted: originalLength - filtered.length };
  }

  /**
   * Delete a record by ID
   */
  deleteById(collection, id) {
    return this.delete(collection, { id });
  }

  /**
   * Count records matching criteria
   */
  count(collection, criteria = {}) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    if (Object.keys(criteria).length === 0) {
      return data.length;
    }
    return this._filter(data, criteria).length;
  }

  /**
   * Check if a record exists
   */
  exists(collection, criteria) {
    return this.findOne(collection, criteria) !== null;
  }

  // ============= Index Management =============

  /**
   * Create an index on a field
   */
  createIndex(collection, field) {
    const indexKey = `${collection}.${field}`;
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    const index = new Map();

    data.forEach(record => {
      const value = record[field];
      if (value !== undefined) {
        if (!index.has(value)) {
          index.set(value, []);
        }
        index.get(value).push(record.id);
      }
    });

    this.indexes.set(indexKey, index);
  }

  /**
   * Update indexes when a record changes
   */
  _updateIndexes(collection, record) {
    for (const [indexKey, index] of this.indexes) {
      if (indexKey.startsWith(`${collection}.`)) {
        const field = indexKey.split('.')[1];
        const value = record[field];
        if (value !== undefined) {
          if (!index.has(value)) {
            index.set(value, []);
          }
          const ids = index.get(value);
          if (!ids.includes(record.id)) {
            ids.push(record.id);
          }
        }
      }
    }
  }

  /**
   * Rebuild all indexes for a collection
   */
  _rebuildIndexes(collection) {
    for (const [indexKey, _] of this.indexes) {
      if (indexKey.startsWith(`${collection}.`)) {
        const field = indexKey.split('.')[1];
        this.createIndex(collection, field);
      }
    }
  }

  /**
   * Find using index (fast lookup)
   */
  findByIndex(collection, field, value) {
    const indexKey = `${collection}.${field}`;
    const index = this.indexes.get(indexKey);

    if (!index) {
      // Fallback to regular find
      return this.find(collection, { [field]: value });
    }

    const ids = index.get(value) || [];
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    return data.filter(record => ids.includes(record.id));
  }

  // ============= Helper Methods =============

  /**
   * Filter records by criteria
   */
  _filter(data, criteria) {
    if (Object.keys(criteria).length === 0) {
      return [...data];
    }
    return data.filter(record => this._matchesCriteria(record, criteria));
  }

  /**
   * Check if a record matches criteria
   */
  _matchesCriteria(record, criteria) {
    for (const [key, value] of Object.entries(criteria)) {
      // Handle special operators
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!this._matchesOperators(record[key], value)) {
          return false;
        }
      } else if (Array.isArray(value)) {
        // $in operator (value is array)
        if (!value.includes(record[key])) {
          return false;
        }
      } else if (record[key] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Handle query operators
   */
  _matchesOperators(fieldValue, operators) {
    for (const [op, opValue] of Object.entries(operators)) {
      switch (op) {
        case '$gt':
          if (!(fieldValue > opValue)) return false;
          break;
        case '$gte':
          if (!(fieldValue >= opValue)) return false;
          break;
        case '$lt':
          if (!(fieldValue < opValue)) return false;
          break;
        case '$lte':
          if (!(fieldValue <= opValue)) return false;
          break;
        case '$ne':
          if (fieldValue === opValue) return false;
          break;
        case '$in':
          if (!opValue.includes(fieldValue)) return false;
          break;
        case '$nin':
          if (opValue.includes(fieldValue)) return false;
          break;
        case '$exists':
          if (opValue && fieldValue === undefined) return false;
          if (!opValue && fieldValue !== undefined) return false;
          break;
        case '$regex':
          const regex = new RegExp(opValue, operators.$options || '');
          if (!regex.test(fieldValue)) return false;
          break;
        case '$like':
          // SQL LIKE equivalent (case-insensitive contains)
          if (!fieldValue || !fieldValue.toLowerCase().includes(opValue.toLowerCase())) return false;
          break;
        default:
          // Unknown operator, treat as equality
          if (fieldValue !== opValue) return false;
      }
    }
    return true;
  }

  /**
   * Sort records
   */
  _sort(data, sortOptions) {
    return [...data].sort((a, b) => {
      for (const [field, direction] of Object.entries(sortOptions)) {
        const aVal = a[field];
        const bVal = b[field];

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // ============= Aggregation Operations =============

  /**
   * Group by field and aggregate
   */
  aggregate(collection, options) {
    const data = this.getCollection(collection, this._isStaticCollection(collection));
    let results = options.match ? this._filter(data, options.match) : data;

    if (options.groupBy) {
      const groups = new Map();

      results.forEach(record => {
        const key = record[options.groupBy];
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key).push(record);
      });

      results = [];
      for (const [key, groupRecords] of groups) {
        const aggregated = { [options.groupBy]: key };

        if (options.aggregations) {
          for (const [alias, aggConfig] of Object.entries(options.aggregations)) {
            aggregated[alias] = this._computeAggregation(groupRecords, aggConfig);
          }
        }

        results.push(aggregated);
      }
    }

    if (options.sort) {
      results = this._sort(results, options.sort);
    }

    return results;
  }

  /**
   * Compute aggregation function
   */
  _computeAggregation(records, config) {
    const { $count, $sum, $avg, $min, $max, $first, $last } = config;

    if ($count !== undefined) {
      if ($count === '*') return records.length;
      // Count where field exists
      return records.filter(r => r[$count] !== undefined).length;
    }

    if ($sum !== undefined) {
      return records.reduce((sum, r) => sum + (r[$sum] || 0), 0);
    }

    if ($avg !== undefined) {
      const values = records.map(r => r[$avg]).filter(v => v !== undefined);
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    if ($min !== undefined) {
      const values = records.map(r => r[$min]).filter(v => v !== undefined);
      return values.length > 0 ? Math.min(...values) : null;
    }

    if ($max !== undefined) {
      const values = records.map(r => r[$max]).filter(v => v !== undefined);
      return values.length > 0 ? Math.max(...values) : null;
    }

    if ($first !== undefined) {
      return records[0] ? records[0][$first] : null;
    }

    if ($last !== undefined) {
      return records[records.length - 1] ? records[records.length - 1][$last] : null;
    }

    return null;
  }

  // ============= Transaction Support =============

  /**
   * Begin a transaction (creates a snapshot)
   */
  beginTransaction() {
    const transactionId = this.generateId();
    const snapshot = new Map();

    // Clone all collections
    for (const [name, data] of this.collections) {
      snapshot.set(name, JSON.parse(JSON.stringify(data)));
    }

    this.activeTransactions.set(transactionId, {
      snapshot,
      operations: []
    });

    return transactionId;
  }

  /**
   * Commit a transaction (persist changes)
   */
  commitTransaction(transactionId) {
    const transaction = this.activeTransactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    this.activeTransactions.delete(transactionId);

    // Force immediate save for all modified collections
    const modifiedCollections = new Set(transaction.operations.map(op => op.collection));
    for (const collection of modifiedCollections) {
      this.saveCollection(collection, this._isStaticCollection(collection), true);
    }

    return true;
  }

  /**
   * Rollback a transaction (restore snapshot)
   */
  rollbackTransaction(transactionId) {
    const transaction = this.activeTransactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    // Restore from snapshot
    for (const [name, data] of transaction.snapshot) {
      this.collections.set(name, data);
    }

    this.activeTransactions.delete(transactionId);
    return true;
  }

  /**
   * Execute within a transaction
   */
  async withTransaction(callback) {
    const transactionId = this.beginTransaction();

    try {
      const result = await callback(transactionId);
      this.commitTransaction(transactionId);
      return result;
    } catch (error) {
      this.rollbackTransaction(transactionId);
      throw error;
    }
  }

  // ============= Utility Methods =============

  /**
   * Get random records (replacement for SQL RANDOM())
   */
  findRandom(collection, criteria = {}, limit = 1) {
    let data = this.find(collection, criteria);

    // Fisher-Yates shuffle
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    return data.slice(0, limit);
  }

  /**
   * Distinct values for a field
   */
  distinct(collection, field, criteria = {}) {
    const data = this.find(collection, criteria);
    const values = new Set(data.map(record => record[field]));
    return [...values].filter(v => v !== undefined);
  }

  /**
   * Initialize database - load all collections
   */
  async initialize() {
    // Load static collections
    const staticCollections = [
      'lessons', 'exercises', 'vocabulary_words', 'achievements',
      'unseen_paragraphs', 'unseen_questions'
    ];

    staticCollections.forEach(collection => {
      this.loadCollection(collection, true);
    });

    // Load dynamic collections
    const dynamicCollections = [
      'users', 'user_progress', 'exercise_results', 'wrong_answers',
      'user_achievements', 'vocabulary_quiz_sessions', 'vocabulary_word_scores',
      'vocabulary_user_stats', 'vocabulary_user_history', 'vocabulary_failed_words',
      'unseen_sessions', 'unseen_answers', 'unseen_user_progress',
      'daily_challenges', 'user_daily_challenges', 'vocabulary_kanban_tasks'
    ];

    dynamicCollections.forEach(collection => {
      this.loadCollection(collection, false);
    });

    // Create indexes for frequently queried fields
    this.createIndex('users', 'email');
    this.createIndex('users', 'name');
    this.createIndex('user_progress', 'user_id');
    this.createIndex('user_progress', 'lesson_id');
    this.createIndex('exercises', 'lesson_id');
    this.createIndex('wrong_answers', 'user_id');
    this.createIndex('vocabulary_word_scores', 'user_id');
    this.createIndex('vocabulary_quiz_sessions', 'user_id');

    console.log('JsonDatabase initialized');
  }

  /**
   * Shutdown - flush all pending writes
   */
  async shutdown() {
    console.log('Shutting down JsonDatabase...');
    await this.flushAll();
    console.log('All data saved to disk');
  }
}

module.exports = JsonDatabase;
