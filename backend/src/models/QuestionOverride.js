const { db } = require('../config/database');

/**
 * Live corrections over the bundled questions (`question_overrides`, one
 * document per exercise id). A report hides the question until it is
 * reviewed; the review then keeps it (restored), changes it (the corrected
 * fields are served and graded), or removes it (stays hidden).
 *
 *   { hidden: bool, removed: bool, change: { question_text_he, options,
 *     correct_answer, explanation_he } | null, decision, updated_at }
 *
 * The collection is small (reported questions only) and read whole, cached
 * for a few seconds per instance; writes in this instance clear the cache.
 */
const CACHE_MS = 15 * 1000;
let cache = null;
let cachedAt = 0;

class QuestionOverride {
  /** Map of exercise id → override. */
  static async all() {
    if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
    const rows = await db.find('question_overrides', {});
    cache = new Map(rows.map(r => [r.id, r]));
    cachedAt = Date.now();
    return cache;
  }

  static clearCache() {
    cache = null;
  }

  static async get(exerciseId) {
    return (await this.all()).get(exerciseId) || null;
  }

  static async save(exerciseId, fields) {
    const current = await db.findById('question_overrides', exerciseId);
    const updated_at = new Date().toISOString();
    if (current) await db.updateById('question_overrides', exerciseId, { ...fields, updated_at });
    else await db.insert('question_overrides', { id: exerciseId, hidden: false, removed: false, change: null, decision: null, ...fields, updated_at });
    this.clearCache();
  }

  /** A report hides the question from new sessions until it is reviewed. */
  static async hide(exerciseId) {
    await this.save(exerciseId, { hidden: true });
  }

  /** The review decision: keep (restore), change (serve the corrected fields), remove. */
  static async decide(exerciseId, decision, change = null) {
    if (decision === 'remove') return this.save(exerciseId, { hidden: false, removed: true, decision });
    if (decision === 'change') return this.save(exerciseId, { hidden: false, removed: false, change, decision });
    return this.save(exerciseId, { hidden: false, removed: false, decision });
  }
}

/** Whether students may be given this question now. */
QuestionOverride.visible = (override) => !override || (!override.hidden && !override.removed);

/** The exercise with the override's corrected fields, if any. */
QuestionOverride.apply = (exercise, override) => {
  if (!exercise || !override || !override.change) return exercise;
  return { ...exercise, ...override.change };
};

module.exports = QuestionOverride;
