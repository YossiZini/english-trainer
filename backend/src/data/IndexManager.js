/**
 * IndexManager - Advanced index management for JsonDatabase
 * Provides composite indexes, unique constraints, and foreign key lookups
 */
class IndexManager {
  constructor(db) {
    this.db = db;
    this.compositeIndexes = new Map();
    this.uniqueConstraints = new Map();
    this.foreignKeys = new Map();
  }

  /**
   * Create a composite index on multiple fields
   */
  createCompositeIndex(collection, fields, name = null) {
    const indexName = name || `${collection}_${fields.join('_')}`;
    const data = this.db.getCollection(collection);
    const index = new Map();

    data.forEach(record => {
      const key = fields.map(f => record[f]).join('::');
      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key).push(record.id);
    });

    this.compositeIndexes.set(indexName, {
      collection,
      fields,
      index
    });

    return indexName;
  }

  /**
   * Find by composite index
   */
  findByCompositeIndex(indexName, values) {
    const indexInfo = this.compositeIndexes.get(indexName);
    if (!indexInfo) {
      throw new Error(`Composite index ${indexName} not found`);
    }

    const key = values.join('::');
    const ids = indexInfo.index.get(key) || [];
    const data = this.db.getCollection(indexInfo.collection);

    return data.filter(record => ids.includes(record.id));
  }

  /**
   * Define a unique constraint
   */
  defineUniqueConstraint(collection, fields) {
    const constraintKey = `${collection}_${fields.join('_')}_unique`;
    this.uniqueConstraints.set(constraintKey, { collection, fields });
    return constraintKey;
  }

  /**
   * Check if a unique constraint would be violated
   */
  checkUniqueConstraint(collection, record, excludeId = null) {
    for (const [key, constraint] of this.uniqueConstraints) {
      if (constraint.collection !== collection) continue;

      const criteria = {};
      constraint.fields.forEach(field => {
        criteria[field] = record[field];
      });

      const existing = this.db.find(collection, criteria);

      for (const existingRecord of existing) {
        if (excludeId && existingRecord.id === excludeId) continue;
        return { violated: true, constraint: key, conflictWith: existingRecord };
      }
    }

    return { violated: false };
  }

  /**
   * Define a foreign key relationship
   */
  defineForeignKey(collection, field, referencesCollection, referencesField = 'id') {
    const fkKey = `${collection}_${field}_fk`;
    this.foreignKeys.set(fkKey, {
      collection,
      field,
      referencesCollection,
      referencesField
    });
    return fkKey;
  }

  /**
   * Validate foreign key reference exists
   */
  validateForeignKey(collection, field, value) {
    for (const [_, fk] of this.foreignKeys) {
      if (fk.collection === collection && fk.field === field) {
        const referenced = this.db.findOne(fk.referencesCollection, {
          [fk.referencesField]: value
        });
        return referenced !== null;
      }
    }
    return true; // No FK defined, assume valid
  }

  /**
   * Get related records (simulate JOIN)
   */
  getRelated(collection, id, relatedCollection, foreignKeyField) {
    return this.db.find(relatedCollection, { [foreignKeyField]: id });
  }

  /**
   * Perform a LEFT JOIN operation
   */
  leftJoin(leftCollection, rightCollection, leftKey, rightKey, options = {}) {
    const leftData = this.db.find(leftCollection, options.leftCriteria || {});
    const rightData = this.db.getCollection(rightCollection);

    // Create a map for fast lookup
    const rightMap = new Map();
    rightData.forEach(record => {
      const key = record[rightKey];
      if (!rightMap.has(key)) {
        rightMap.set(key, []);
      }
      rightMap.get(key).push(record);
    });

    return leftData.map(leftRecord => {
      const rightRecords = rightMap.get(leftRecord[leftKey]) || [];
      const rightRecord = rightRecords[0] || null;

      if (options.selectRight) {
        const selected = {};
        options.selectRight.forEach(field => {
          const alias = options.aliases?.[field] || field;
          selected[alias] = rightRecord ? rightRecord[field] : null;
        });
        return { ...leftRecord, ...selected };
      }

      return {
        ...leftRecord,
        _related: rightRecord
      };
    });
  }

  /**
   * Perform an INNER JOIN operation
   */
  innerJoin(leftCollection, rightCollection, leftKey, rightKey, options = {}) {
    const results = this.leftJoin(leftCollection, rightCollection, leftKey, rightKey, options);
    return results.filter(record => record._related !== null ||
      (options.selectRight && options.selectRight.some(f => record[options.aliases?.[f] || f] !== null)));
  }

  /**
   * Multi-table JOIN
   */
  multiJoin(config) {
    let results = this.db.find(config.from, config.criteria || {});

    for (const join of config.joins) {
      const rightData = this.db.getCollection(join.collection);
      const rightMap = new Map();

      rightData.forEach(record => {
        const key = record[join.rightKey];
        if (!rightMap.has(key)) {
          rightMap.set(key, []);
        }
        rightMap.get(key).push(record);
      });

      results = results.map(leftRecord => {
        const leftKeyValue = join.leftKey.includes('.')
          ? this._getNestedValue(leftRecord, join.leftKey)
          : leftRecord[join.leftKey];

        const rightRecords = rightMap.get(leftKeyValue) || [];
        const rightRecord = rightRecords[0] || null;

        if (join.select) {
          const selected = {};
          join.select.forEach(field => {
            const alias = join.aliases?.[field] || `${join.as || join.collection}_${field}`;
            selected[alias] = rightRecord ? rightRecord[field] : null;
          });
          return { ...leftRecord, ...selected };
        }

        return {
          ...leftRecord,
          [join.as || join.collection]: rightRecord
        };
      });

      if (join.type === 'inner') {
        results = results.filter(record =>
          record[join.as || join.collection] !== null);
      }
    }

    return results;
  }

  /**
   * Get nested value from object using dot notation
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Rebuild all composite indexes for a collection
   */
  rebuildIndexes(collection) {
    for (const [name, info] of this.compositeIndexes) {
      if (info.collection === collection) {
        this.createCompositeIndex(collection, info.fields, name);
      }
    }
  }

  /**
   * Initialize common indexes and constraints
   */
  initializeCommonIndexes() {
    // Composite indexes for common queries
    this.createCompositeIndex('user_progress', ['user_id', 'lesson_id']);
    this.createCompositeIndex('wrong_answers', ['user_id', 'lesson_id']);
    this.createCompositeIndex('vocabulary_word_scores', ['user_id', 'word_id']);
    this.createCompositeIndex('vocabulary_failed_words', ['user_id', 'word_id']);
    this.createCompositeIndex('unseen_user_progress', ['user_id', 'paragraph_id']);
    this.createCompositeIndex('lessons', ['topic_number', 'subtopic_number']);

    // Unique constraints
    this.defineUniqueConstraint('users', ['email']);
    this.defineUniqueConstraint('lessons', ['topic_number', 'subtopic_number']);
    this.defineUniqueConstraint('user_progress', ['user_id', 'lesson_id']);
    this.defineUniqueConstraint('unseen_user_progress', ['user_id', 'paragraph_id']);

    // Foreign keys
    this.defineForeignKey('exercises', 'lesson_id', 'lessons');
    this.defineForeignKey('user_progress', 'user_id', 'users');
    this.defineForeignKey('user_progress', 'lesson_id', 'lessons');
    this.defineForeignKey('wrong_answers', 'user_id', 'users');
    this.defineForeignKey('wrong_answers', 'exercise_id', 'exercises');
    this.defineForeignKey('vocabulary_quiz_sessions', 'user_id', 'users');
    this.defineForeignKey('vocabulary_word_scores', 'user_id', 'users');
    this.defineForeignKey('vocabulary_word_scores', 'word_id', 'vocabulary_words');

    console.log('IndexManager initialized with common indexes and constraints');
  }
}

module.exports = IndexManager;
