const crypto = require('crypto');
const { StaticStore } = require('./StaticStore');
const { filterRecords, applyOptions, splitCriteria } = require('./query');

/**
 * FirestoreDatabase — the data access layer used by every model.
 *
 * Read-only curriculum content is served from the bundled StaticStore;
 * everything a student produces (accounts, progress, results, scores…) lives
 * in Firestore, one Firestore collection per logical collection, document id
 * = record id (UUID v4, generated here as before).
 *
 * Query strategy: plain equality filters run in Firestore; range operators,
 * $in on arrays, sorting, offset and limit run in memory on the fetched set.
 * Every dynamic query in this app is scoped to a user, so those sets are
 * small, and no composite indexes are needed.
 */
class FirestoreDatabase {
  constructor({ firestore, staticStore }) {
    this.firestore = firestore;
    this.staticStore = staticStore;
  }

  generateId() {
    return crypto.randomUUID();
  }

  _isStatic(collection) {
    return StaticStore.isStatic(collection);
  }

  _assertDynamic(collection, verb) {
    if (this._isStatic(collection)) {
      throw new Error(`Cannot ${verb} static collection '${collection}': content is read-only at runtime (edit the seed files and run npm run generate-data)`);
    }
  }

  _ref(collection) {
    return this.firestore.collection(collection);
  }

  async _fetch(collection, criteria = {}, options = {}) {
    const { remote, local } = splitCriteria(criteria);
    let query = this._ref(collection);
    for (const [field, value] of Object.entries(remote)) {
      query = query.where(field, '==', value);
    }
    const snapshot = await query.get();
    const records = snapshot.docs.map(doc => doc.data());
    return applyOptions(filterRecords(records, local), options);
  }

  // ============= Reads =============

  /**
   * Synchronous access to a static collection's array (curriculum content).
   * Dynamic collections must be queried with find().
   */
  getCollection(collection) {
    if (!this._isStatic(collection)) {
      throw new Error(`getCollection('${collection}') is only available for static content; use find()`);
    }
    return this.staticStore.getCollection(collection);
  }

  async find(collection, criteria = {}, options = {}) {
    if (this._isStatic(collection)) return this.staticStore.find(collection, criteria, options);
    return this._fetch(collection, criteria, options);
  }

  async findOne(collection, criteria = {}) {
    if (this._isStatic(collection)) return this.staticStore.findOne(collection, criteria);
    if (Object.keys(criteria).length === 1 && typeof criteria.id === 'string') {
      return this.findById(collection, criteria.id);
    }
    const results = await this._fetch(collection, criteria, { limit: 1 });
    return results[0] || null;
  }

  async findById(collection, id) {
    if (this._isStatic(collection)) return this.staticStore.findById(collection, id);
    if (typeof id !== 'string' || id.length === 0) return null;
    const doc = await this._ref(collection).doc(id).get();
    return doc.exists ? doc.data() : null;
  }

  async findByIndex(collection, field, value) {
    return this.find(collection, { [field]: value });
  }

  async count(collection, criteria = {}) {
    if (this._isStatic(collection)) return this.staticStore.count(collection, criteria);
    return (await this._fetch(collection, criteria)).length;
  }

  // ============= Writes =============

  async insert(collection, record) {
    this._assertDynamic(collection, 'insert into');
    const doc = { ...record };
    if (!doc.id) doc.id = this.generateId();
    if (!doc.created_at) doc.created_at = new Date().toISOString();
    await this._ref(collection).doc(doc.id).set(doc);
    return doc;
  }

  /**
   * Update the first record matching criteria. Returns { modified } like the
   * previous implementation.
   */
  async update(collection, criteria, updates) {
    this._assertDynamic(collection, 'update');
    const target = await this.findOne(collection, criteria);
    if (!target) return { modified: 0 };
    await this._ref(collection).doc(target.id).update({
      ...updates,
      updated_at: new Date().toISOString()
    });
    return { modified: 1 };
  }

  async updateById(collection, id, updates) {
    this._assertDynamic(collection, 'update');
    const ref = this._ref(collection).doc(id);
    const doc = await ref.get();
    if (!doc.exists) return { modified: 0 };
    await ref.update({ ...updates, updated_at: new Date().toISOString() });
    return { modified: 1 };
  }

  /**
   * Atomic read-modify-write of one document, for counters (points, streaks,
   * attempt counts). `mutate(current)` returns the fields to merge; the whole
   * step retries automatically on concurrent modification.
   */
  async transactUpdate(collection, id, mutate) {
    this._assertDynamic(collection, 'update');
    const ref = this._ref(collection).doc(id);
    return this.firestore.runTransaction(async tx => {
      const doc = await tx.get(ref);
      if (!doc.exists) return null;
      const updates = mutate(doc.data());
      if (updates && Object.keys(updates).length > 0) {
        tx.update(ref, { ...updates, updated_at: new Date().toISOString() });
      }
      return { ...doc.data(), ...updates };
    });
  }

  async delete(collection, criteria) {
    this._assertDynamic(collection, 'delete from');
    const targets = await this._fetch(collection, criteria);
    if (targets.length === 0) return { deleted: 0 };
    const batchSize = 400;
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = this.firestore.batch();
      targets.slice(i, i + batchSize).forEach(t => batch.delete(this._ref(collection).doc(t.id)));
      await batch.commit();
    }
    return { deleted: targets.length };
  }

  async deleteById(collection, id) {
    this._assertDynamic(collection, 'delete from');
    const ref = this._ref(collection).doc(id);
    const doc = await ref.get();
    if (!doc.exists) return { deleted: 0 };
    await ref.delete();
    return { deleted: 1 };
  }

  /**
   * Runs `callback` as a sequential unit of work. Firestore transactions
   * require every read to precede every write, which the model layer's nested
   * read/write flows do not satisfy, so this provides ordering only, not
   * atomicity; counters use transactUpdate() for that.
   */
  async withTransaction(callback) {
    return callback();
  }

  // ============= Test support =============

  /** Delete every document of the given dynamic collections. */
  async clearCollections(collections) {
    for (const collection of collections) {
      this._assertDynamic(collection, 'clear');
      await this.delete(collection, {});
    }
  }
}

module.exports = FirestoreDatabase;
