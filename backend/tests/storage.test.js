const { db, resetDatabase, shutdownDatabase } = require('./helpers');

describe('FirestoreDatabase', () => {
  beforeAll(resetDatabase);
  afterAll(shutdownDatabase);

  describe('static content', () => {
    test('serves bundled lessons, exercises and vocabulary', async () => {
      const lessons = await db.find('lessons', {}, { sort: { order_index: 'asc' } });
      expect(lessons.length).toBeGreaterThan(50);
      expect(db.getCollection('vocabulary_words').length).toBeGreaterThan(1000);

      const first = lessons[0];
      expect(await db.findById('lessons', first.id)).toEqual(first);
      const exercises = await db.find('exercises', { lesson_id: first.id });
      expect(exercises.length).toBeGreaterThan(0);
      expect(await db.count('exercises', { lesson_id: first.id })).toBe(exercises.length);
    });

    test('supports range operators, sort and limit', async () => {
      const [third] = await db.find('lessons', { order_index: 3 });
      const [next] = await db.find('lessons', { order_index: { $gt: third.order_index } },
        { sort: { order_index: 'asc' }, limit: 1 });
      expect(next.order_index).toBe(4);
    });

    test('rejects writes', async () => {
      await expect(db.insert('lessons', { title_en: 'x' })).rejects.toThrow(/read-only/);
      expect(() => db.getCollection('users')).toThrow(/static/);
    });
  });

  describe('dynamic collections', () => {
    test('insert assigns id and created_at, and round-trips', async () => {
      const inserted = await db.insert('users', { name: 'alice', total_points: 0, email: null });
      expect(inserted.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(inserted.created_at).toBeTruthy();

      expect(await db.findById('users', inserted.id)).toEqual(inserted);
      expect(await db.findOne('users', { name: 'alice' })).toEqual(inserted);
      expect(await db.findOne('users', { email: null })).toEqual(inserted);
      expect(await db.findByIndex('users', 'name', 'alice')).toHaveLength(1);
      expect(await db.findById('users', 'missing')).toBeNull();
      expect(await db.findById('users', undefined)).toBeNull();
    });

    test('updateById merges fields and reports modified count', async () => {
      const user = await db.insert('users', { name: 'bob', total_points: 5 });
      expect(await db.updateById('users', user.id, { total_points: 7 })).toEqual({ modified: 1 });
      const after = await db.findById('users', user.id);
      expect(after.total_points).toBe(7);
      expect(after.name).toBe('bob');
      expect(after.updated_at).toBeTruthy();
      expect(await db.updateById('users', 'missing', { x: 1 })).toEqual({ modified: 0 });
    });

    test('find applies $in, range operators, sort, offset and limit in memory', async () => {
      const userId = 'u-range';
      for (const [date, score] of [['2026-01-01', 10], ['2026-01-02', 20], ['2026-01-03', 30]]) {
        await db.insert('exercise_results', { user_id: userId, completed_at: date, score });
      }
      const upTo = await db.find('exercise_results',
        { user_id: userId, completed_at: { $lte: '2026-01-02' } },
        { sort: { completed_at: 'desc' } });
      expect(upTo.map(r => r.score)).toEqual([20, 10]);

      const some = await db.find('exercise_results', { user_id: userId, score: [10, 30] },
        { sort: { score: 'asc' }, offset: 1, limit: 1 });
      expect(some.map(r => r.score)).toEqual([30]);
      expect(await db.count('exercise_results', { user_id: userId })).toBe(3);
    });

    test('delete by criteria and by id', async () => {
      const a = await db.insert('wrong_answers', { user_id: 'u-del', lesson_id: 'l1' });
      await db.insert('wrong_answers', { user_id: 'u-del', lesson_id: 'l1' });
      await db.insert('wrong_answers', { user_id: 'u-del', lesson_id: 'l2' });

      expect(await db.deleteById('wrong_answers', a.id)).toEqual({ deleted: 1 });
      expect(await db.deleteById('wrong_answers', a.id)).toEqual({ deleted: 0 });
      expect(await db.delete('wrong_answers', { user_id: 'u-del', lesson_id: 'l1' })).toEqual({ deleted: 1 });
      expect(await db.count('wrong_answers', { user_id: 'u-del' })).toBe(1);
    });

    test('transactUpdate applies concurrent increments without losing any', async () => {
      const user = await db.insert('users', { name: 'carol', total_points: 0 });
      await Promise.all(Array.from({ length: 8 }, () =>
        db.transactUpdate('users', user.id, current => ({ total_points: (current.total_points || 0) + 1 }))
      ));
      expect((await db.findById('users', user.id)).total_points).toBe(8);
      expect(await db.transactUpdate('users', 'missing', () => ({ x: 1 }))).toBeNull();
    });
  });
});
