const request = require('supertest');
const { resetDatabase, shutdownDatabase } = require('./helpers');
const app = require('../src/app');

/**
 * End-to-end smoke tests through the HTTP API against the Firestore emulator:
 * the flows a student goes through in one session.
 */
describe('API', () => {
  let token;
  let lesson;

  const auth = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    await resetDatabase();
  });
  afterAll(shutdownDatabase);

  test('health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('register, duplicate name rejected, login by name', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ name: 'dana', password: 'secret123', age: 11 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.name).toBe('dana');

    const dup = await request(app).post('/api/auth/register')
      .send({ name: 'dana', password: 'secret123' });
    expect(dup.status).toBe(400);

    const login = await request(app).post('/api/auth/login')
      .send({ identifier: 'dana', password: 'secret123' });
    expect(login.status).toBe(200);
    token = login.body.data.token;

    const bad = await request(app).post('/api/auth/login')
      .send({ identifier: 'dana', password: 'wrong' });
    expect(bad.status).toBeGreaterThanOrEqual(400);

    const me = await request(app).get('/api/auth/me').set(auth());
    expect(me.status).toBe(200);
    expect(me.body.data.name).toBe('dana');
  });

  test('protected routes need a token', async () => {
    const res = await request(app).get('/api/lessons');
    expect(res.status).toBe(401);
  });

  test('lessons and exercises are served from bundled content', async () => {
    const res = await request(app).get('/api/lessons').set(auth());
    expect(res.status).toBe(200);
    // Lessons come grouped by topic (15 topics); flatten to individual lessons.
    const topics = res.body.data;
    expect(Array.isArray(topics)).toBe(true);
    expect(topics.length).toBe(15);
    const lessons = topics.flatMap(t => t.lessons || []);
    expect(lessons.length).toBeGreaterThan(50);
    lesson = lessons[0];

    const ex = await request(app).get(`/api/lessons/${lesson.id}/exercises`).set(auth());
    expect(ex.status).toBe(200);
  });

  test('submitting an exercise records results, progress, mistakes and points', async () => {
    const ex = await request(app).get(`/api/lessons/${lesson.id}/exercises`).set(auth());
    expect(ex.status).toBe(200);
    const exercises = ex.body.data.exercises || ex.body.data;
    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises.length).toBeGreaterThan(0);

    // Answer the first one correctly and the second one wrongly.
    const [first, second] = exercises;
    const answers = [
      { exerciseId: first.id, userAnswer: first.correct_answer || first.correctAnswer || 'x' }
    ];
    if (second) answers.push({ exerciseId: second.id, userAnswer: '__definitely_wrong__' });

    const submit = await request(app).post('/api/exercises/submit').set(auth())
      .send({ lessonId: lesson.id, answers, timeSpent: 90, difficulty: 'easy' });
    expect(submit.status).toBe(200);
    expect(submit.body.success).toBe(true);

    const progress = await request(app).get('/api/progress').set(auth());
    expect(progress.status).toBe(200);

    if (second) {
      const mistakes = await request(app).get('/api/mistakes').set(auth());
      expect(mistakes.status).toBe(200);
      expect(JSON.stringify(mistakes.body)).toContain(second.id);
    }

    const me = await request(app).get('/api/auth/me').set(auth());
    expect(me.status).toBe(200);
  });

  test('vocabulary quiz round-trip', async () => {
    const start = await request(app).post('/api/vocabulary/quiz/start').set(auth())
      .send({ quizSize: 5 });
    expect(start.status).toBe(200);
    const { sessionId } = start.body.data;
    expect(sessionId).toBeTruthy();

    const next = await request(app).get(`/api/vocabulary/quiz/${sessionId}/next`).set(auth());
    expect(next.status).toBe(200);
    const question = next.body.data;
    const wordId = question.word && question.word.id;
    const options = question.options || [];
    expect(wordId).toBeTruthy();
    expect(options.length).toBeGreaterThan(1);

    const answer = await request(app).post(`/api/vocabulary/quiz/${sessionId}/answer`).set(auth())
      .send({ wordId, userAnswerId: options[0].id });
    expect(answer.status).toBe(200);

    const status = await request(app).get(`/api/vocabulary/quiz/${sessionId}/status`).set(auth());
    expect(status.status).toBe(200);

    const stats = await request(app).get('/api/vocabulary/stats').set(auth());
    expect(stats.status).toBe(200);
  });

  test('reading passages, achievements, challenges and dashboard respond', async () => {
    for (const path of ['/api/unseen/paragraphs', '/api/achievements', '/api/challenges/today',
      '/api/progress/dashboard', '/api/progress/stats', '/api/kanban/tasks']) {
      const res = await request(app).get(path).set(auth());
      expect([path, res.status]).toEqual([path, 200]);
    }
  });
});
