process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';
process.env.BOT_DAILY_MESSAGE_CAP = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');
const UsageService = require('../src/services/usage.service');

/** /usage: every student's participation over the last 7 and 30 days, no scores. */
describe('Usage summary', () => {
  // Monday 2026-06-15, 15:00 in Israel (UTC+3): the week is 06-09..06-15, the month 05-17..06-15.
  const NOW = new Date('2026-06-15T12:00:00Z');
  const chat = '8101';
  const ids = {};
  const bot = (chatId) => ({
    get: (path) => request(app).get(path).set('X-Bot-Key', 'test-bot-key').query({ chatId })
  });

  async function register(name) {
    const reg = await request(app).post('/api/auth/register').send({ name, password: 'secret123', age: 12 });
    ids[name] = (await db.findOne('users', { name })).id;
    return { Authorization: `Bearer ${reg.body.data.token}` };
  }

  beforeAll(async () => {
    await resetDatabase();
    const dana = await register('dana');
    await register('omer');
    await register('idle');
    const code = (await request(app).post('/api/telegram/link-code').set(dana)).body.data.code;
    await request(app).post('/api/bot/link').set('X-Bot-Key', 'test-bot-key').send({ chatId: chat, code });

    const result = (userId, at) => db.insert('exercise_results', { user_id: userId, lesson_id: 'l1', score: 90, correct_answers: 9, completed_at: at });
    // dana: a lesson late on Sunday night UTC = Monday in Israel (this week), one 7 days ago (month only).
    await result(ids.dana, '2026-06-14T21:30:00Z');
    await result(ids.dana, '2026-06-08T20:00:00Z');
    // three web quiz answers today, a reading text two days ago.
    for (let i = 0; i < 3; i++) {
      await db.insert('vocabulary_user_history', { user_id: ids.dana, word_id: `w${i}`, is_correct: i === 0, answered_at: '2026-06-15T08:00:00Z' });
    }
    await db.insert('unseen_sessions', { user_id: ids.dana, paragraph_id: 'p', started_at: '2026-06-13T09:00:00Z', completed_at: '2026-06-13T09:10:00Z', score: 80 });
    await db.insert('unseen_sessions', { user_id: ids.dana, paragraph_id: 'p', started_at: '2026-06-15T09:00:00Z', completed_at: null });
    // omer: a bot words exam 29 days ago (first day of the month window), and a lesson 30 days ago (outside).
    await db.insert('bot_sessions', { user_id: ids.omer, chat_id: 'x', kind: 'vocab', status: 'ended', started_at: '2026-05-17T10:00:00Z', correct_count: 5, wrong_count: 3 });
    await db.insert('bot_sessions', { user_id: ids.omer, chat_id: 'x', kind: 'exercise', status: 'ended', started_at: '2026-06-14T10:00:00Z', correct_count: 4, wrong_count: 1 });
    await result(ids.omer, '2026-05-16T12:00:00Z');
  });
  afterAll(shutdownDatabase);
  beforeEach(() => UsageService.clearCache());

  test('counts participation per window in Israel days, most active first', async () => {
    const summary = await UsageService.summary(NOW);
    expect(summary.today).toBe('2026-06-15');
    expect(summary.windows).toEqual({ week: { from: '2026-06-09', to: '2026-06-15' }, month: { from: '2026-05-17', to: '2026-06-15' } });
    expect(summary.students).toEqual([
      {
        name: 'dana',
        week: { activeDays: 2, lessons: 1, words: 3, reading: 1 },
        month: { activeDays: 3, lessons: 2, words: 3, reading: 1 },
        lastActive: '2026-06-15'
      },
      {
        name: 'omer',
        week: { activeDays: 0, lessons: 0, words: 0, reading: 0 },
        month: { activeDays: 1, lessons: 0, words: 8, reading: 0 },
        lastActive: '2026-05-17'
      }
    ]);
    expect(summary.inactive).toBe(1);
  });

  test('never carries scores, points or right/wrong counts', async () => {
    const text = JSON.stringify(await UsageService.summary(NOW));
    for (const field of ['score', 'correct', 'wrong', 'points', 'is_correct']) expect(text).not.toContain(field);
  });

  test('is cached until cleared', async () => {
    const first = await UsageService.summary(NOW);
    await db.insert('exercise_results', { user_id: ids.omer, lesson_id: 'l2', completed_at: '2026-06-15T07:00:00Z' });
    expect(await UsageService.summary(NOW)).toBe(first);
    UsageService.clearCache();
    const fresh = await UsageService.summary(NOW);
    expect(fresh.students.find(s => s.name === 'omer').week.lessons).toBe(1);
  });

  test('GET /api/bot/usage for a linked chat; an unlinked one is refused', async () => {
    const res = await bot(chat).get('/api/bot/usage');
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ students: expect.any(Array), inactive: expect.any(Number), windows: expect.any(Object) });
    const unlinked = await bot('8199').get('/api/bot/usage');
    expect(unlinked.status).toBe(403);
  });
});
