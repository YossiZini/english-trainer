process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_DAILY_MESSAGE_CAP = '200';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db, DYNAMIC_COLLECTIONS } = require('./helpers');
const app = require('../src/app');
const division = require('../src/services/bot/divisionDrill');
const UsageService = require('../src/services/usage.service');

const LRI = '⁦';
const PDI = '⁩';

/**
 * /hiluk in the bot: the division variant of the drill. Ten new questions
 * each time (five with a remainder, five long divisions), the quotient and
 * the remainder typed, a count at the end; nothing recorded but /usage.
 */
describe('Bot division drill', () => {
  const chatId = '777';
  const bot = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body });
  const status = () => request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId });
  const answer = (text) => bot('/api/bot/session/answer', { text });
  const openDrill = async () => (await db.find('bot_sessions', { chat_id: chatId }))
    .find(s => s.kind === 'drill' && s.status === 'active');
  const typed = (q) => (q.remainder ? `${q.answer} ${q.remainder}` : String(q.answer));
  const fact = (q) => `${LRI}${q.text} = ${q.answer}${PDI}${q.remainder ? ` ושארית ${q.remainder}` : ''}`;

  /** This week's /usage counts of the test student. */
  const usage = async () => {
    UsageService.clearCache();
    const me = (await UsageService.summary()).students.find(s => s.name === 'bot-hiluk');
    return me ? { division: me.week.division, drill: me.week.drill } : { division: 0, drill: 0 };
  };

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
    const res = await request(app).post('/api/auth/register').send({ name: 'bot-hiluk', password: 'secret123', age: 10 });
    const code = (await request(app).post('/api/telegram/link-code').set({ Authorization: `Bearer ${res.body.data.token}` })).body.data.code;
    expect((await bot('/api/bot/link', { code })).status).toBe(200);
  });
  afterAll(shutdownDatabase);

  test('ten different questions: five with a remainder, then five long divisions; every answer right', () => {
    for (let run = 0; run < 300; run++) {
      const questions = division.makeQuestions();
      expect(questions).toHaveLength(10);
      expect(new Set(questions.map(q => q.text)).size).toBe(10);
      questions.forEach((q, i) => {
        const [a, d] = q.text.match(/^(\d+) ÷ (\d+)$/).slice(1).map(Number);
        expect(d).toBeGreaterThanOrEqual(2);
        expect(d).toBeLessThanOrEqual(9);
        expect([q.answer, q.remainder]).toEqual([Math.floor(a / d), a % d]);
        if (i < 5) {
          // 17 ÷ 5: a quotient from the table and a remainder that is not 0.
          expect(q.answer).toBeGreaterThanOrEqual(2);
          expect(q.answer).toBeLessThanOrEqual(9);
          expect(q.remainder).toBeGreaterThan(0);
        } else {
          // Long division: a quotient of at least 10; two two-digit dividends, three three-digit.
          expect(q.answer).toBeGreaterThanOrEqual(10);
          expect(String(a)).toHaveLength(i < 7 ? 2 : 3);
        }
      });
      // The last one has a 0 inside its quotient (412 ÷ 4 = 103).
      expect(String(questions[9].answer)).toMatch(/^\d0\d$/);
    }
  });

  test('reads the quotient and the remainder as students type them', () => {
    const two = { quotient: 3, remainder: 2 };
    for (const text of ['3 2', '3 שארית 2', '3 ש 2', "3 ש' 2", '3r2', '3R2', '3 r 2', 'מנה 3, שארית 2', '3, 2', '3 ושארית 2', `${LRI}3 2${PDI}`, ' 3  2 ']) {
      expect([text, division.read(text)]).toEqual([text, two]);
    }
    expect(division.read('24')).toEqual({ quotient: 24, remainder: null });
    expect(division.read('21 0')).toEqual({ quotient: 21, remainder: 0 });
    for (const text of ['שלום', '3.5', '3 2 1', '', '-3', 'r', 'שלוש', '3 שלוש', '?']) expect([text, division.read(text)]).toEqual([text, null]);
  });

  test('judges: the remainder counts; the right quotient alone asks for the remainder', () => {
    const q = { text: '17 ÷ 5', answer: 3, remainder: 2 };
    expect(division.judge(q, { quotient: 3, remainder: 2 })).toBe('correct');
    expect(division.judge(q, { quotient: 3, remainder: null })).toBe('missingRemainder');
    expect(division.judge(q, { quotient: 4, remainder: null })).toBe('wrong');
    expect(division.judge(q, { quotient: 2, remainder: 7 })).toBe('wrong');
    expect(division.hint(q, { quotient: 2, remainder: 7 })).toEqual({ remainderTooBig: 5 });
    const exact = { text: '84 ÷ 4', answer: 21, remainder: 0 };
    expect(division.judge(exact, { quotient: 21, remainder: null })).toBe('correct');
    expect(division.judge(exact, { quotient: 21, remainder: 0 })).toBe('correct');
    expect(division.judge(exact, { quotient: 21, remainder: 1 })).toBe('wrong');
    expect(division.fact(q)).toBe(`${LRI}17 ÷ 5 = 3${PDI} ושארית 2`);
    expect(division.check(q)).toBe(`${LRI}3 × 5 + 2 = 17${PDI}`);
    expect(division.check(exact)).toBe(`${LRI}21 × 4 = 84${PDI}`);
  });

  test('ten typed answers, a count with the missed facts; only /usage counts them, as division', async () => {
    const before = await snapshot();
    const usageBefore = await usage();
    const start = (await bot('/api/bot/drill/start', { variant: 'hiluk' })).body.data;
    expect(start).toMatchObject({ kind: 'drill', variant: 'hiluk', question: { number: 1, total: 10, type: 'number', variant: 'hiluk' } });
    expect(start.question.text).toMatch(new RegExp(`^${LRI}\\d+ ÷ \\d = \\?${PDI}$`));
    expect((await status()).body.data).toMatchObject({ active: true, kind: 'drill', variant: 'hiluk' });

    // Not an answer: the same question again, nothing counted.
    for (const text of ['שבע', '?', '3.5']) {
      expect((await answer(text)).body.data).toMatchObject({ kind: 'drill', variant: 'hiluk', notNumber: true, question: { number: 1 } });
    }
    // The right quotient without its remainder: asked again, nothing counted.
    const first = (await openDrill()).questions[0];
    expect((await answer(String(first.answer))).body.data).toMatchObject({ missingRemainder: true, question: { number: 1 } });
    expect(await openDrill()).toMatchObject({ index: 0, correct_count: 0, wrong_count: 0 });

    let reply;
    const missed = [];
    for (let i = 0; i < 10; i++) {
      const session = await openDrill();
      const q = session.questions[session.index];
      const wrong = i === 1 || i === 6;
      if (wrong) missed.push(fact(q));
      // Wrong at 1: a remainder that is not smaller than the divisor; at 6: a quotient one off.
      const d = Number(q.text.split(' ÷ ')[1]);
      const text = i === 1 ? `${q.answer - 1} ${q.remainder + d}` : i === 6 ? `${q.answer + 1} ${q.remainder}` : i === 3 ? `מנה ${q.answer}, שארית ${q.remainder}` : typed(q);
      reply = (await answer(text)).body.data;
      expect(reply.verdict).toMatchObject({ correct: !wrong, fact: fact(q) });
      if (wrong) {
        const check = q.remainder ? `${q.answer} × ${d} + ${q.remainder} = ${q.text.split(' ')[0]}` : `${q.answer} × ${d} = ${q.text.split(' ')[0]}`;
        expect(reply.verdict.check).toBe(`${LRI}${check}${PDI}`);
      } else {
        expect(reply.verdict.check).toBeUndefined();
      }
      if (i === 1) expect(reply.verdict.remainderTooBig).toBe(d);
      if (i === 6) expect(reply.verdict.remainderTooBig).toBeUndefined();
      if (i < 9) expect(reply).toMatchObject({ done: false, question: { number: i + 2, variant: 'hiluk' } });
    }
    expect(reply).toMatchObject({ kind: 'drill', variant: 'hiluk', done: true, result: { correct: 8, total: 10, missed } });
    expect((await status()).body.data.active).toBe(false);

    // Only the bot's own session and usage changed; /usage counts ten division answers, no /kefel ones.
    expect(await snapshot()).toEqual(before);
    expect(await usage()).toEqual({ division: usageBefore.division + 10, drill: usageBefore.drill });
  });

  test('/end stops it with its counts; an unknown variant is refused; /kefel still starts the table', async () => {
    await bot('/api/bot/drill/start', { variant: 'hiluk' });
    expect((await bot('/api/bot/session/end')).body.data).toMatchObject({ kind: 'drill', variant: 'hiluk', ended: true, answered: 0 });
    expect((await bot('/api/bot/drill/start', { variant: 'chiluk' })).status).toBe(400);
    const kefel = (await bot('/api/bot/drill/start')).body.data;
    expect(kefel).toMatchObject({ variant: 'kefel', question: { variant: 'kefel' } });
    expect(kefel.question.text).toMatch(/[×÷]/);
    await bot('/api/bot/session/end');
  });
});
