process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';
process.env.BOT_DAILY_MESSAGE_CAP = '1000';
process.env.ADMIN_USERS = 'Some One, Yossi Zini';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');
const Exercise = require('../src/models/Exercise');
const { invalidChange } = require('../src/services/review.service');

/** The admin reviews reported questions from the bot (/api/bot/review/*). */
describe('Review of reported questions', () => {
  const adminChat = '9001';
  const studentChat = '9002';
  let student;
  const bot = (chatId) => ({
    get: (path) => request(app).get(path).set('X-Bot-Key', 'test-bot-key').query({ chatId }),
    post: (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body })
  });
  const pool = () => db.getCollection('exercises', true).filter(e => e.type === 'multiple_choice' && e.options.length === 4);

  async function linkedAccount(name, chatId) {
    const reg = await request(app).post('/api/auth/register').send({ name, password: 'secret123', age: 12 });
    const auth = { Authorization: `Bearer ${reg.body.data.token}` };
    const code = (await request(app).post('/api/telegram/link-code').set(auth)).body.data.code;
    expect((await bot(chatId).post('/api/bot/link', { code })).status).toBe(200);
    return auth;
  }

  beforeAll(async () => {
    await resetDatabase();
    await linkedAccount('Yossi Zini', adminChat);
    // Same name in other letters is another account, never the admin.
    student = await linkedAccount('yossi zini', studentChat);
  });
  afterAll(shutdownDatabase);

  test('only the admin chat may review', async () => {
    const res = await bot(studentChat).get('/api/bot/review/queue');
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('not_admin');
    expect((await bot(studentChat).post('/api/bot/review/decide', { exerciseId: pool()[0].id, decision: 'keep' })).status).toBe(403);
    expect((await bot(adminChat).get('/api/bot/review/queue')).body.data).toEqual({ total: 0, items: [] });
  });

  test('the queue groups open reports by question, oldest first', async () => {
    const [a, b] = pool();
    await request(app).post('/api/reports').set(student).send({ exerciseId: a.id, reason: 'two_answers' });
    await request(app).post('/api/reports').set(student).send({ exerciseId: b.id, reason: 'other', note: 'typo in 2' });
    const { data } = (await bot(adminChat).get('/api/bot/review/queue')).body;
    expect(data.total).toBe(2);
    expect(data.items.map(i => i.exerciseId)).toEqual([a.id, b.id]);
    expect(data.items[0]).toMatchObject({
      question: { text: a.question_text_he, options: a.options, answer: a.correct_answer },
      reports: [{ reason: 'two_answers', note: null, source: 'web' }]
    });
    expect(data.items[0].lesson.title).toBeTruthy();
    expect(data.items[1].reports[0].note).toBe('typo in 2');
  });

  test('a change is validated, applied live, and closes the reports', async () => {
    const [a] = pool();
    const decide = (body) => bot(adminChat).post('/api/bot/review/decide', { exerciseId: a.id, ...body });
    const bad = await decide({ decision: 'change', change: { question_text_he: 'x', options: ['one', 'two', 'two'], correct_answer: 'one' } });
    expect(bad.status).toBe(400);
    expect(bad.body).toMatchObject({ code: 'invalid_change', message: 'options must be different' });
    expect((await decide({ decision: 'maybe' })).status).toBe(400);

    const change = { question_text_he: 'שאלה מתוקנת _______', options: ['in', 'on', 'at', 'by'], correct_answer: 'on', explanation_he: 'תשובה נכונה: on.' };
    const ok = await decide({ decision: 'change', change: { ...change, extra: 'ignored' } });
    expect(ok.body.data).toMatchObject({ decided: true, decision: 'change', closed: 1 });
    const served = (await Exercise.findByLessonIdForClient(a.lesson_id)).find(e => e.id === a.id);
    expect(served).toMatchObject({ question_text_he: change.question_text_he, options: change.options });
    expect((await Exercise.findById(a.id)).extra).toBeUndefined();
    const [report] = await db.find('question_reports', { exercise_id: a.id });
    expect(report).toMatchObject({ status: 'decided', decision: 'change' });
  });

  test('remove keeps the question hidden; the queue empties', async () => {
    const [, b] = pool();
    const res = await bot(adminChat).post('/api/bot/review/decide', { exerciseId: b.id, decision: 'remove' });
    expect(res.body.data.closed).toBe(1);
    expect((await Exercise.findByLessonIdForClient(b.lesson_id)).find(e => e.id === b.id)).toBeUndefined();
    expect((await bot(adminChat).get('/api/bot/review/queue')).body.data.total).toBe(0);
  });

  test('change validation rules', () => {
    const base = { question_text_he: 'q', options: ['a1', 'b1', 'c1'], correct_answer: 'b1' };
    expect(invalidChange(base)).toBeNull();
    expect(invalidChange({ ...base, options: ['a1', 'b1'] })).toMatch(/3 or 4/);
    expect(invalidChange({ ...base, correct_answer: 'd1' })).toMatch(/exactly one/);
    expect(invalidChange({ ...base, options: [' a1', 'b1', 'c1'] })).toMatch(/outer spaces/);
    expect(invalidChange({ ...base, question_text_he: '' })).toMatch(/empty/);
    expect(invalidChange(null)).toMatch(/missing/);
  });

  test('a review session: proposal, approve, skip, keep, and the end', async () => {
    const [, , c, d, e] = pool();
    for (const ex of [c, d, e]) await request(app).post('/api/reports').set(student).send({ exerciseId: ex.id, reason: 'unclear' });
    const admin = bot(adminChat);

    let res = (await admin.post('/api/bot/review/start', { mode: 'manual' })).body.data;
    expect(res).toMatchObject({ kind: 'review', mode: 'manual', remaining: 3, done: false, proposal: null });
    expect(res.item.exerciseId).toBe(c.id);
    expect((await admin.get('/api/bot/session/status')).body.data).toMatchObject({ active: true, kind: 'review' });
    // Approve needs a proposal; a proposal that is not valid stays pending with the reason.
    expect((await admin.post('/api/bot/review/act', { action: 'approve' })).status).toBe(409);
    const bad = { decision: 'change', reason: 'x', change: { question_text_he: 'q', options: ['a', 'b'], correct_answer: 'a' } };
    await admin.post('/api/bot/review/proposal', { proposal: bad });
    res = (await admin.post('/api/bot/review/act', { action: 'approve' })).body.data;
    expect(res.rejected).toMatch(/3 or 4/);
    expect(res.item.exerciseId).toBe(c.id);

    const good = { decision: 'change', reason: 'two answers fit', change: { question_text_he: 'חדש _______', options: ['in', 'on', 'at'], correct_answer: 'at', explanation_he: 'at' } };
    res = (await admin.post('/api/bot/review/proposal', { proposal: good })).body.data;
    expect(res.proposal).toEqual(good);
    res = (await admin.post('/api/bot/review/act', { action: 'approve' })).body.data;
    expect(res.decided).toMatchObject({ exerciseId: c.id, decision: 'change', closed: 1 });
    expect(res.item.exerciseId).toBe(d.id);
    expect(res.proposal).toBeNull();

    res = (await admin.post('/api/bot/review/act', { action: 'skip' })).body.data;
    expect(res).toMatchObject({ skipped: d.id, remaining: 1 });
    expect(res.item.exerciseId).toBe(e.id);
    res = (await admin.post('/api/bot/review/act', { action: 'keep' })).body.data;
    expect(res).toMatchObject({ done: true, item: null, counts: { change: 1, skip: 1, keep: 1 } });
    expect((await admin.get('/api/bot/session/status')).body.data.active).toBe(false);
    // The skipped question is still under review for next time.
    expect((await admin.get('/api/bot/review/queue')).body.data.items.map(i => i.exerciseId)).toEqual([d.id]);
    expect((await bot(studentChat).post('/api/bot/review/start', { mode: 'auto' })).status).toBe(403);
  });
});
