const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');
const { DAILY_REPORT_CAP } = require('../src/services/report.service');

/** Students report questions they think are wrong (/api/reports). */
describe('Question reports', () => {
  let token;
  let userId;
  const auth = () => ({ Authorization: `Bearer ${token}` });
  const report = (bodyFields) => request(app).post('/api/reports').set(auth()).send(bodyFields);
  const exercises = () => db.getCollection('exercises', true);

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'reporter', password: 'secret123', age: 12 });
    token = res.body.data.token;
    userId = (await db.findOne('users', { name: 'reporter' })).id;
  });
  afterAll(async () => { await shutdownDatabase(); });

  test('needs a login', async () => {
    const res = await request(app).post('/api/reports').send({ exerciseId: exercises()[0].id, reason: 'unclear' });
    expect(res.status).toBe(401);
  });

  test('stores an open report with a snapshot of the question', async () => {
    const exercise = exercises()[0];
    const res = await report({ exerciseId: exercise.id, reason: 'wrong_answer' });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ duplicate: false });
    const stored = await db.findById('question_reports', res.body.data.reportId);
    expect(stored).toMatchObject({
      exercise_id: exercise.id, lesson_id: exercise.lesson_id, user_id: userId, reason: 'wrong_answer',
      note: null, source: 'web', status: 'open', decision: null
    });
    expect(stored.snapshot).toMatchObject({
      question: exercise.question_text_he, options: exercise.options, answer: exercise.correct_answer
    });
    expect(stored.lesson_title).toBeTruthy();
  });

  test('a second report of the same open question returns the first', async () => {
    const exercise = exercises()[0];
    const res = await report({ exerciseId: exercise.id, reason: 'unclear' });
    expect(res.status).toBe(200);
    expect(res.body.data.duplicate).toBe(true);
    expect((await db.find('question_reports', { exercise_id: exercise.id })).length).toBe(1);
  });

  test('"other" keeps a short note; other reasons drop it', async () => {
    const [, a, b] = exercises();
    const other = await report({ exerciseId: a.id, reason: 'other', note: `  ${'x'.repeat(300)}  ` });
    expect((await db.findById('question_reports', other.body.data.reportId)).note).toHaveLength(200);
    const twoAnswers = await report({ exerciseId: b.id, reason: 'two_answers', note: 'ignored' });
    expect((await db.findById('question_reports', twoAnswers.body.data.reportId)).note).toBeNull();
  });

  test('rejects an unknown question or reason', async () => {
    expect((await report({ exerciseId: 'no-such-question', reason: 'unclear' })).status).toBe(404);
    const bad = await report({ exerciseId: exercises()[5].id, reason: 'boring' });
    expect(bad.status).toBe(400);
    expect(bad.body.code).toBe('bad_reason');
    expect((await report({ reason: 'unclear' })).status).toBe(400);
  });

  test(`at most ${DAILY_REPORT_CAP} reports a day`, async () => {
    const already = (await db.find('question_reports', { user_id: userId })).length;
    const pool = exercises().slice(10, 10 + DAILY_REPORT_CAP - already);
    for (const e of pool) expect((await report({ exerciseId: e.id, reason: 'unclear' })).status).toBe(201);
    const capped = await report({ exerciseId: exercises()[100].id, reason: 'unclear' });
    expect(capped.status).toBe(429);
    expect(capped.body.message).toMatch(/מכסת/);
  });

  test('deciding closes every open report on the question', async () => {
    const QuestionReport = require('../src/models/QuestionReport');
    const exercise = exercises()[0];
    expect(await QuestionReport.decide(exercise.id, 'keep', 'the key is right')).toBe(1);
    const [stored] = await db.find('question_reports', { exercise_id: exercise.id });
    expect(stored).toMatchObject({ status: 'decided', decision: 'keep', decision_note: 'the key is right' });
    expect(await QuestionReport.decide(exercise.id, 'keep')).toBe(0);
  });
});
