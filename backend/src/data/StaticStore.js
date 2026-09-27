const fs = require('fs');
const path = require('path');
const { filterRecords, applyOptions } = require('./query');

/**
 * Read-only, in-memory store for the curriculum content that ships with the
 * container image (backend/data/static/*.json). Content is authored in the
 * seed files and regenerated with `npm run generate-data`; it is never
 * written at runtime.
 */
const STATIC_COLLECTIONS = [
  'lessons', 'exercises', 'vocabulary_words', 'achievements',
  'unseen_paragraphs', 'unseen_questions'
];

class StaticStore {
  constructor(staticDir) {
    this.staticDir = staticDir;
    this.collections = new Map();
    this.byId = new Map();
  }

  static isStatic(collection) {
    return STATIC_COLLECTIONS.includes(collection);
  }

  load() {
    for (const collection of STATIC_COLLECTIONS) {
      const filePath = path.join(this.staticDir, `${collection}.json`);
      let records = [];
      if (fs.existsSync(filePath)) {
        records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } else {
        console.warn(`Static collection file missing: ${filePath}`);
      }
      this.collections.set(collection, records);
      this.byId.set(collection, new Map(records.map(r => [r.id, r])));
    }
  }

  getCollection(collection) {
    if (!this.collections.has(collection)) {
      throw new Error(`Unknown static collection: ${collection}`);
    }
    return this.collections.get(collection);
  }

  find(collection, criteria = {}, options = {}) {
    return applyOptions(filterRecords(this.getCollection(collection), criteria), options);
  }

  findOne(collection, criteria = {}) {
    if (Object.keys(criteria).length === 1 && typeof criteria.id === 'string') {
      return this.findById(collection, criteria.id);
    }
    return filterRecords(this.getCollection(collection), criteria)[0] || null;
  }

  findById(collection, id) {
    return this.byId.get(collection)?.get(id) || null;
  }

  count(collection, criteria = {}) {
    return filterRecords(this.getCollection(collection), criteria).length;
  }
}

module.exports = { StaticStore, STATIC_COLLECTIONS };
