process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_DAILY_MESSAGE_CAP = '70';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db, DYNAMIC_COLLECTIONS } = require('./helpers');
const app = require('../src/app');
const { makeQuestions } = require('../src/services/bot/drillSession');

const LRI = '⁦';
const PDI = '⁩';

/**
 * /kefel in the bot: ten new multiplication-table questions each time,
 * typed answers, a count at the end, and nothing recorded.
 */
describe('Bot multiplication drill', () => {
  let token;
  const chatId = '888';
  const bot = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body });
  const status = () => request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId });
  const answer = (text) => bot('/api/bot/session/answer', { text });
  const openDrill = async () => (await db.find('bot_sessions', { chat_id: chatId }))
    .find(s => s.kind === 'drill' && s.status === 'active');

  /** Every student-data row except the bot's own session and usage counter. */
  const snapshot = async () => {
    const rows = {};
    for (const name of DYNAMIC_COLLECTIONS.filter(c => !['bot_sessions', 'bot_usage', 'telegram_links'].includes(c))) {
      rows[name] = (await db.find(name, {})).map(r => JSON.stringify(r)).sort();
    }
    return rows;
  };

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'bot-kefel', password: 'secret123', age: 9 });
    token = res.body.data.token;
    const code = (await request(app).post('/api/telegram/link-code').set({ Authorization: `Bearer ${token}` })).body.data.code;
    expect((await bot('/api/bot/link', { code })).status).toBe(200);
  });
  afterAll(shutdownDatabase);

  test('ten different facts with factors 2–10: five products, five quotients, every answer right', () => {
    for (let run = 0; run < 300; run++) {
      const questions = makeQuestions();
      expect(questions).toHaveLength(10);
      const facts = new Set();
      let products = 0;
      for (const q of questions) {
        const [, x, op, y] = q.text.match(/^(\d+) ([×÷]) (\d+)$/).map((v, i) => (i === 2 ? v : Number(v)));
        // The fact behind the question: its two factors, whatever the order.
        const factors = op === '×' ? [x, y] : [y, x / y];
        if (op === '×') {
          products++;
          expect(q.answer).toBe(x * y);
        } else {
          expect(x % y).toBe(0);
          expect(q.answer).toBe(x / y);
        }
        factors.forEach(f => { expect(f).toBeGreaterThanOrEqual(2); expect(f).toBeLessThanOrEqual(10); });
        facts.add(factors.sort((a, b) => a - b).join('x'));
      }
      expect(products).toBe(5);
      expect(facts.size).toBe(10); // no fact twice, so a quotient never repeats a product
    }
  });

  test('needs the bot key and a linked chat', async () => {
    expect((await request(app).post('/api/bot/drill/start').send({ chatId })).status).toBe(401);
    const unlinked = await request(app).post('/api/bot/drill/start').set('X-Bot-Key', 'test-bot-key').send({ chatId: '999' });
    expect(unlinked.status).toBe(403);
    expect(unlinked.body.code).toBe('not_linked');
  });

  test('ten typed answers, a count with the missed facts at the end, and nothing recorded', async () => {
    const before = await snapshot();
    const start = (await bot('/api/bot/drill/start')).body.data;
    expect(start).toMatchObject({ kind: 'drill', question: { number: 1, total: 10, type: 'number' } });
    expect(start.question.text).toMatch(new RegExp(`^${LRI}\\d+ [×÷] \\d+ = \\?${PDI}$`));
    expect((await status()).body.data).toMatchObject({ active: true, kind: 'drill', question: { number: 1, type: 'number' } });

    // Not a number: the same question again, nothing counted.
    for (const text of ['שבע', '?', 'kefel', 'help']) {
      expect((await answer(text)).body.data).toMatchObject({ kind: 'drill', notNumber: true, question: { number: 1 } });
    }
    expect(await openDrill()).toMatchObject({ index: 0, correct_count: 0, wrong_count: 0 });

    let reply;
    const wrongAt = [0, 1, 9];
    const missed = [];
    for (let i = 0; i < 10; i++) {
      const session = await openDrill();
      const q = session.questions[session.index];
      expect(reply ? reply.question.text : start.question.text).toBe(`${LRI}${q.text} = ?${PDI}`);
      const wrong = wrongAt.includes(i);
      if (wrong) missed.push(`${LRI}${q.text} = ${q.answer}${PDI}`);
      // A right answer may come with spaces or as 56.0; a wrong one is any other number.
      reply = (await answer(wrong ? String(q.answer + 1) : i === 2 ? `${q.answer}.0` : ` ${q.answer} `)).body.data;
      expect(reply.verdict).toMatchObject({ correct: !wrong, correctAnswer: q.answer, fact: `${LRI}${q.text} = ${q.answer}${PDI}` });
      // For the bot's encouraging line: wrong answers so far and in a row.
      const expected = { 0: [1, 1], 1: [2, 2], 9: [3, 1] }[i] || [2, 0];
      expect(reply.verdict).toMatchObject({ wrongCount: expected[0], wrongStreak: expected[1] });
      if (i < 9) expect(reply).toMatchObject({ done: false, question: { number: i + 2, total: 10 } });
    }
    expect(reply).toMatchObject({ kind: 'drill', done: true, result: { correct: 7, total: 10, missed } });
    expect((await status()).body.data.active).toBe(false);
    const ended = (await db.find('bot_sessions', { chat_id: chatId })).find(s => s.kind === 'drill');
    expect(ended).toMatchObject({ status: 'ended', end_reason: 'completed', correct_count: 7, wrong_count: 3 });

    // Only the bot's own session and usage changed: no result, points, progress or mistake.
    expect(await snapshot()).toEqual(before);
  });

  test('/end stops a drill with its counts; a new start replaces an open one; nothing to report', async () => {
    await bot('/api/bot/drill/start');
    const first = await openDrill();
    await answer(String(first.questions[0].answer));
    expect((await bot('/api/bot/session/end')).body.data)
      .toMatchObject({ kind: 'drill', done: true, ended: true, answered: 1, correct: 1, total: 10 });
    expect((await status()).body.data.active).toBe(false);
    expect((await answer('5')).status).toBe(404);

    const one = (await bot('/api/bot/drill/start')).body.data.sessionId;
    const two = (await bot('/api/bot/drill/start')).body.data.sessionId;
    expect(two).not.toBe(one);
    expect(await db.findById('bot_sessions', one)).toMatchObject({ status: 'ended', end_reason: 'replaced' });
    // Every round has new questions (ten random facts out of 45: equal by chance about once in 10^12).
    const [a, b] = await Promise.all([one, two].map(id => db.findById('bot_sessions', id)));
    expect(a.questions).not.toEqual(b.questions);

    // A drill has no question to report.
    expect((await bot('/api/bot/report')).status).toBe(404);
    // The end word works as an answer too.
    expect((await answer('end')).body.data).toMatchObject({ kind: 'drill', ended: true, answered: 0 });

    // Starting a lesson replaces an open drill.
    await bot('/api/bot/drill/start');
    const drill = await openDrill();
    expect((await bot('/api/bot/exercise/start', { subject: 'math' })).body.data.kind).toBe('exercise');
    expect(await db.findById('bot_sessions', drill.id)).toMatchObject({ status: 'ended', end_reason: 'replaced' });
    await bot('/api/bot/session/end');
  });

  test('the daily message cap covers the drill', async () => {
    // Its own student and chat, so the other tests keep their quota in any order.
    const capped = '889';
    const reg = await request(app).post('/api/auth/register').send({ name: 'bot-kefel-cap', password: 'secret123', age: 9 });
    const code = (await request(app).post('/api/telegram/link-code').set({ Authorization: `Bearer ${reg.body.data.token}` })).body.data.code;
    const call = (path) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId: capped });
    expect((await request(app).post('/api/bot/link').set('X-Bot-Key', 'test-bot-key').send({ chatId: capped, code })).status).toBe(200);
    expect((await call('/api/bot/drill/start')).status).toBe(200);
    let res;
    for (let i = 0; i < 80; i++) {
      res = await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId: capped });
      if (res.status === 429) break;
    }
    expect(res.status).toBe(429);
    expect((await call('/api/bot/drill/start')).status).toBe(429);
    expect((await call('/api/bot/session/answer')).status).toBe(429);
  });
});
