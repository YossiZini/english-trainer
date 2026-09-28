process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_DAILY_MESSAGE_CAP = '80';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');

/**
 * The Telegram bot API: service key, chat linking, a full 20-word session
 * with a failed round, the end command and the daily cap.
 */
describe('Bot API', () => {
  let token;
  const chatId = '123456';
  const auth = () => ({ Authorization: `Bearer ${token}` });
  const bot = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body });

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'bot-student', password: 'secret123', age: 12 });
    token = res.body.data.token;
  });
  afterAll(shutdownDatabase);

  test('rejects a missing or wrong key and an unlinked chat', async () => {
    expect((await request(app).post('/api/bot/session/start').send({ chatId })).status).toBe(401);
    expect((await request(app).post('/api/bot/session/start').set('X-Bot-Key', 'nope').send({ chatId })).status).toBe(401);
    expect((await request(app).post('/api/bot/session/start').set('X-Bot-Key', 'test-bot-key').send({})).status).toBe(400);
    const unlinked = await bot('/api/bot/session/start');
    expect(unlinked.status).toBe(403);
    expect(unlinked.body.code).toBe('not_linked');
  });

  test('links the chat with a one-time code from the web app', async () => {
    const before = await request(app).get('/api/telegram/link').set(auth());
    expect(before.body.data.linked).toBe(false);

    expect((await bot('/api/bot/link', { code: '000000' })).status).toBe(400);

    const issued = await request(app).post('/api/telegram/link-code').set(auth());
    expect(issued.status).toBe(200);
    const { code } = issued.body.data;
    expect(code).toMatch(/^\d{6}$/);

    const linked = await bot('/api/bot/link', { code });
    expect(linked.status).toBe(200);
    // The code is single use.
    expect((await bot('/api/bot/link', { code })).status).toBe(400);

    const after = await request(app).get('/api/telegram/link').set(auth());
    expect(after.body.data.linked).toBe(true);
  });

  test('an expired code does not link', async () => {
    const issued = await request(app).post('/api/telegram/link-code').set(auth());
    const link = await db.findOne('telegram_links', { user_id: (await db.findOne('users', { name: 'bot-student' })).id });
    await db.updateById('telegram_links', link.id, { code_expires_at: new Date(Date.now() - 1000).toISOString() });
    expect((await bot('/api/bot/link', { code: issued.body.data.code })).status).toBe(400);
    // The chat stayed linked from the previous test.
    expect((await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId })).status).toBe(200);
  });

  test('walks a whole session: 20 words, three wrong, a failed round, then done', async () => {
    const start = await bot('/api/bot/session/start');
    expect(start.status).toBe(200);
    const { word, progress } = start.body.data;
    expect(word.english).toBeTruthy();
    expect(progress).toEqual({ round: 1, index: 1, total: 20, failedInRound: 0 });

    const session = await db.findById('bot_sessions', start.body.data.sessionId);
    expect(new Set(session.word_ids).size).toBe(20);
    const words = db.getCollection('vocabulary_words', true);
    const translation = (id) => words.find(w => w.id === id).hebrew_translation;
    session.word_ids.forEach(id => expect(words.find(w => w.id === id).difficulty_level).toBeLessThanOrEqual(3));

    // Round 1: answer words 1..3 wrong, the rest right.
    let current = word;
    let reply;
    for (let i = 0; i < 20; i++) {
      const text = i < 3 ? 'תשובה לא נכונה' : translation(current.id);
      reply = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(reply.correct).toBe(i >= 3);
      if (i < 3) expect(reply.expected).toBe(translation(current.id));
      if (i < 19) {
        expect(reply.progress.round).toBe(1);
        expect(reply.progress.index).toBe(i + 2);
      }
      current = reply.word;
    }
    // After word 20 the failed round starts with the three wrong words.
    expect(reply.done).toBe(false);
    expect(reply.roundStarted).toBe(true);
    expect(reply.progress).toEqual({ round: 2, index: 1, total: 3, failedInRound: 0 });
    const failedIds = new Set(session.word_ids.slice(0, 3));
    expect(failedIds.has(current.id)).toBe(true);

    // Round 2: first one wrong again, two right -> round 3 with one word.
    reply = (await bot('/api/bot/session/answer', { text: 'עדיין לא' })).body.data;
    const stillFailed = current.id;
    current = reply.word;
    for (let i = 0; i < 2; i++) {
      expect(failedIds.has(current.id)).toBe(true);
      reply = (await bot('/api/bot/session/answer', { text: translation(current.id) })).body.data;
      current = reply.word;
    }
    expect(reply.roundStarted).toBe(true);
    expect(reply.progress).toEqual({ round: 3, index: 1, total: 1, failedInRound: 0 });
    expect(current.id).toBe(stillFailed);

    // Round 3: right -> done with a summary.
    reply = (await bot('/api/bot/session/answer', { text: translation(current.id) })).body.data;
    expect(reply.done).toBe(true);
    expect(reply.word).toBeNull();
    expect(reply.summary).toEqual({ words: 20, rounds: 3, correct: 20, wrong: 4, remainingFailed: 0 });

    expect((await bot('/api/bot/session/answer', { text: 'שלום' })).status).toBe(404);
    // Bot practice shows in the web statistics.
    const stats = await request(app).get('/api/vocabulary/stats').set(auth());
    expect(stats.status).toBe(200);
  });

  test('"end" ends the session with a summary and a new start replaces an active one', async () => {
    const first = await bot('/api/bot/session/start');
    const second = await bot('/api/bot/session/start');
    expect(second.body.data.sessionId).not.toBe(first.body.data.sessionId);
    expect((await db.findById('bot_sessions', first.body.data.sessionId)).status).toBe('ended');

    const ended = (await bot('/api/bot/session/answer', { text: 'סיים' })).body.data;
    expect(ended.done).toBe(true);
    expect(ended.summary.words).toBe(20);
    expect((await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId })).body.data.active).toBe(false);
  });

  test('the daily cap answers 429 with a Hebrew message', async () => {
    let res;
    for (let i = 0; i < 90; i++) {
      res = await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId });
      if (res.status === 429) break;
    }
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/מכסת/);
  });

  test('the per-chat rate limit is a sliding window', () => {
    const { chatAllowed, _windows } = require('../src/middleware/botLimits.middleware');
    _windows.clear();
    const t0 = 1_000_000;
    for (let i = 0; i < 1000; i++) expect(chatAllowed('c', t0 + i)).toBe(true);
    expect(chatAllowed('c', t0 + 1000)).toBe(false);
    expect(chatAllowed('c', t0 + 61_000)).toBe(true);
  });

  test('unlinking from the web app blocks the chat', async () => {
    expect((await request(app).delete('/api/telegram/link').set(auth())).body.data.removed).toBe(true);
    expect((await bot('/api/bot/session/start')).status).toBe(403);
  });
});
