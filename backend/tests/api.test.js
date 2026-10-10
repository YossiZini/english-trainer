const request = require('supertest');
const { resetDatabase, shutdownDatabase } = require('./helpers');
const app = require('../src/app');
const { db } = require('../src/config/database');

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
    // Lessons come grouped by topic: 15 English topics plus the Math ones.
    const topics = res.body.data;
    expect(Array.isArray(topics)).toBe(true);
    expect(topics.filter(t => t.subject === 'english').length).toBe(15);
    expect(topics.length).toBeGreaterThan(15);
    const lessons = topics.flatMap(t => t.lessons || []);
    expect(lessons.length).toBeGreaterThan(50);
    lesson = lessons[0];

    const ex = await request(app).get(`/api/lessons/${lesson.id}/exercises`).set(auth());
    expect(ex.status).toBe(200);
  });

  test('lessons can be filtered by subject', async () => {
    const english = await request(app).get('/api/lessons?subject=english').set(auth());
    expect(english.status).toBe(200);
    expect(english.body.data.length).toBe(15);
    expect(english.body.data.every(t => t.subject === 'english')).toBe(true);

    const math = await request(app).get('/api/lessons?subject=math').set(auth());
    expect(math.status).toBe(200);
    expect(math.body.data.every(t => t.subject === 'math')).toBe(true);
    expect(math.body.data.every(t => t.topicNumber >= 101)).toBe(true);

    // Arabic is a subject of its own: only its lessons, never the others'.
    const arabic = await request(app).get('/api/lessons?subject=arabic').set(auth());
    expect(arabic.status).toBe(200);
    expect(arabic.body.data.every(t => t.subject === 'arabic' && t.topicNumber >= 201)).toBe(true);

    // An unknown subject is ignored, not an error
    const all = await request(app).get('/api/lessons?subject=music').set(auth());
    expect(all.status).toBe(200);
    expect(all.body.data.length).toBeGreaterThanOrEqual(15);
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

      // The cross-test is padded only from the subjects the student made
      // mistakes in (English here), and every question carries its subject.
      const cross = await request(app).get('/api/mistakes/cross-test').set(auth());
      expect(cross.status).toBe(200);
      const crossExercises = cross.body.data.exercises;
      expect(crossExercises.length).toBeGreaterThan(1);
      expect(crossExercises.every(e => e.subject === 'english')).toBe(true);
    }

    const me = await request(app).get('/api/auth/me').set(auth());
    expect(me.status).toBe(200);
  });

  test('Math lessons are ordered by subtopic and navigate across topics', async () => {
    const math = await request(app).get('/api/lessons?subject=math').set(auth());
    const numbers = math.body.data.flatMap(t => t.lessons.map(l => l.subtopicNumber));
    expect(numbers.slice(0, 7)).toEqual(['101.1', '101.2', '101.3', '101.4', '101.5', '101.6', '102.1']);

    const last = math.body.data[0].lessons[5];
    const detail = await request(app).get(`/api/lessons/${last.id}`).set(auth());
    expect(detail.status).toBe(200);
    const first102 = math.body.data[1].lessons[0];
    expect(detail.body.data.navigation.next.id).toBe(first102.id);
    expect(detail.body.data.navigation.previous.id).toBe(math.body.data[0].lessons[4].id);
  });

  test('next and previous lesson after a Math exercise stay in Math', async () => {
    const math = await request(app).get('/api/lessons?subject=math').set(auth());
    // The second Math lesson has a Math neighbour on each side.
    const mathLesson = math.body.data[1].lessons[0];
    const ex = await request(app).get(`/api/lessons/${mathLesson.id}/exercises?difficulty=easy`).set(auth());
    const exercises = ex.body.data.exercises || ex.body.data;
    // Correct answers are not sent to the client; take them from the bundled content.
    const bundled = new Map(require('../data/static/exercises.json').map(e => [e.id, e.correct_answer]));
    const answers = exercises.map(e => ({ exerciseId: e.id, userAnswer: bundled.get(e.id) }));

    const submit = await request(app).post('/api/exercises/submit').set(auth())
      .send({ lessonId: mathLesson.id, answers, timeSpent: 60, difficulty: 'easy' });
    expect(submit.status).toBe(200);
    const isMath = (l) => l && l.topic_number >= 101;
    expect(isMath(submit.body.data.nextLesson)).toBe(true);
    expect(isMath(submit.body.data.previousLesson)).toBe(true);

    const result = await request(app).get(`/api/exercises/results/${submit.body.data.resultId}`).set(auth());
    expect(result.status).toBe(200);
    expect(isMath(result.body.data.nextLesson)).toBe(true);
    expect(isMath(result.body.data.previousLesson)).toBe(true);
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

  test('the dashboard keeps each subject apart: next lesson, completion, last activity', async () => {
    const res = await request(app).get('/api/progress/dashboard').set(auth());
    expect(res.status).toBe(200);
    const { subjects, completion, recentActivity } = res.body.data;
    const math = await request(app).get('/api/lessons?subject=math').set(auth());
    const mathLessons = math.body.data.flatMap(t => t.lessons);

    // Totals split the lessons between the subjects.
    expect(subjects.math.completion.total_lessons).toBe(mathLessons.length);
    // The subjects' lessons add up to the whole curriculum (English, math and Arabic).
    const arabic = await request(app).get('/api/lessons?subject=arabic').set(auth());
    expect(subjects.arabic.completion.total_lessons).toBe(arabic.body.data.flatMap(t => t.lessons).length);
    expect(subjects.english.completion.total_lessons + subjects.math.completion.total_lessons
      + subjects.arabic.completion.total_lessons).toBe(completion.total_lessons);

    // Each subject continues in its own lessons, even though Math comes after every English lesson.
    expect(Number(subjects.english.nextLesson.subtopic_number)).toBeLessThan(101);
    expect(subjects.math.nextLesson.subtopic_number).toBe('101.1');
    expect(subjects.arabic.nextLesson.subtopic_number).toBe('201.1');

    // Last activity per subject: the Math exercise submitted above, and the English one before it.
    expect(subjects.math.lastActivity).toMatchObject({ subject: 'math', lesson_id: mathLessons[6].id, difficulty: 'easy' });
    expect(subjects.english.lastActivity.subject).toBe('english');
    expect(recentActivity.map(a => a.subject).sort()).toEqual(['english', 'math']);
    // Every subject is listed, in display order; Arabic, not tried yet, has no last activity.
    expect(Object.keys(subjects)).toEqual(['english', 'math', 'arabic']);
    expect(subjects.arabic.lastActivity).toBeNull();
  });

  test("the dashboard reads the student's progress and results once, for every subject", async () => {
    const find = jest.spyOn(db, 'find');
    try {
      const res = await request(app).get('/api/progress/dashboard').set(auth());
      expect(res.status).toBe(200);
      const reads = (collection) => find.mock.calls.filter(([c]) => c === collection).length;
      expect([reads('user_progress'), reads('exercise_results')]).toEqual([1, 1]);
    } finally {
      find.mockRestore();
    }
  });

  test('reading passages, achievements, challenges and dashboard respond', async () => {
    for (const path of ['/api/unseen/paragraphs', '/api/achievements', '/api/challenges/today',
      '/api/progress/dashboard', '/api/progress/stats', '/api/kanban/tasks']) {
      const res = await request(app).get(path).set(auth());
      expect([path, res.status]).toEqual([path, 200]);
    }
  });
});
