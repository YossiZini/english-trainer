const { db } = require('../config/database');

/**
 * Live corrections over bundled, read-only content (questions, words): one
 * document per content id in `collection`. A report hides the item until it
 * is reviewed; the review then keeps it (restored), changes it (the corrected
 * fields are served and graded), or removes it (stays hidden).
 *
 *   { hidden: bool, removed: bool, change: { …corrected fields } | null, decision, updated_at }
 *
 * The collection is small (reported items only) and read whole, cached for a
 * few seconds per instance; writes in this instance clear the cache.
 */
const CACHE_MS = 15 * 1000;

function overrideStore(collection) {
  let cache = null;
  let cachedAt = 0;

  const store = {
    /** Map of content id → override. */
    async all() {
      if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
      const rows = await db.find(collection, {});
      cache = new Map(rows.map(r => [r.id, r]));
      cachedAt = Date.now();
      return cache;
    },

    clearCache() {
      cache = null;
    },

    async get(id) {
      return (await store.all()).get(id) || null;
    },

    async save(id, fields) {
      const current = await db.findById(collection, id);
      const updated_at = new Date().toISOString();
      if (current) await db.updateById(collection, id, { ...fields, updated_at });
      else await db.insert(collection, { id, hidden: false, removed: false, change: null, decision: null, ...fields, updated_at });
      store.clearCache();
    },

    /** A report hides the item from new sessions until it is reviewed. */
    async hide(id) {
      await store.save(id, { hidden: true });
    },

    /** The review decision: keep (restore), change (serve the corrected fields), remove. */
    async decide(id, decision, change = null) {
      if (decision === 'remove') return store.save(id, { hidden: false, removed: true, decision });
      if (decision === 'change') return store.save(id, { hidden: false, removed: false, change, decision });
      return store.save(id, { hidden: false, removed: false, decision });
    },

    /** Whether students may be given this item now. */
    visible: (override) => !override || (!override.hidden && !override.removed),

    /** The item with the override's corrected fields, if any. */
    apply: (item, override) => {
      if (!item || !override || !override.change) return item;
      return { ...item, ...override.change };
    }
  };
  return store;
}

module.exports = overrideStore;
