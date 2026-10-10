const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');

/** A mistakes exam per subject: the student's unfixed mistakes only (/api/mistakes/exam). */
describe('Mistakes exam per subject', () => {
  let token;
  let userId;
  let english;
  let math;
  let arabic;
  const auth = () => ({ Authorization: `Bearer ${token}` });
  const lessonsOf = (subject) => db.getCollection('lessons', true).filter(l => (l.subject || 'english') === subject);
  const easy = (lesson) => db.getCollection('exercises', true).filter(e => e.lesson_id === lesson.id && e.difficulty === 'easy');
  const wrong = (e) => (Array.isArray(e.options) && e.options.find(o => o !== e.correct_answer)) || 'zzz';
  const submit = (lesson, exercises) => request(app).post('/api/exercises/submit').set(auth()).send({
    lessonId: lesson.id, answers: exercises.map(e => ({ exerciseId: e.id, userAnswer: wrong(e) })), timeSpent: 60, difficulty: 'easy'
  });
  const waiting = async () => (await request(app).get('/api/mistakes/waiting').set(auth())).body.data;
  const exam = (subject) => request(app).get(`/api/mistakes/exam?subject=${subject}`).set(auth());
  const answerExam = (subject, answers) => request(app).post('/api/mistakes/exam').set(auth()).send({ subject, answers });

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'mistakes', password: 'secret123', age: 12 });
    token = res.body.data.token;
    userId = (await db.findOne('users', { name: 'mistakes' })).id;
    [english] = lessonsOf('english');
    [math] = lessonsOf('math');
    arabic = lessonsOf('arabic').slice(0, 3);
    // English: every easy question wrong in two attempts, so each has two records.
    await submit(english, easy(english));
    await submit(english, easy(english));
    // Math: three wrong. Arabic: 25 wrong in three lessons, more than one exam holds.
    await submit(math, easy(math).slice(0, 3));
    await submit(arabic[0], easy(arabic[0]));
    await submit(arabic[1], easy(arabic[1]));
    await submit(arabic[2], easy(arabic[2]).slice(0, 5));
  });
  afterAll(async () => { await shutdownDatabase(); });

  test('needs a login', async () => {
    expect((await request(app).get('/api/mistakes/waiting')).status).toBe(401);
    expect((await request(app).get('/api/mistakes/exam?subject=math')).status).toBe(401);
  });

  test('waiting counts questions, not records, per subject', async () => {
    expect(await waiting()).toEqual({ english: easy(english).length, math: 3, arabic: 25 });
  });

  test("an exam holds up to 20 of the subject's mistakes and nothing else", async () => {
    const res = await exam('arabic');
    expect(res.status).toBe(200);
    const { subject, waiting: left, exercises } = res.body.data;
    expect([subject, left, exercises.length]).toEqual(['arabic', 25, 20]);
    const arabicIds = new Set(arabic.flatMap(l => easy(l).map(e => e.id)));
    expect(exercises.every(e => arabicIds.has(e.id) && e.subject === 'arabic')).toBe(true);
    expect(new Set(exercises.map(e => e.id)).size).toBe(20);
    expect(exercises.map(e => e.question_number)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(exercises[0]).not.toHaveProperty('correct_answer');
    expect(exercises[0].lesson_title).toBeTruthy();

    // A question answered wrong twice is asked once.
    const englishExam = (await exam('english')).body.data.exercises;
    expect(englishExam).toHaveLength(easy(english).length);
    expect(new Set(englishExam.map(e => e.id)).size).toBe(englishExam.length);
  });

  test('bad requests: an unknown or missing subject, no answers, too many, not text', async () => {
    expect((await exam('history')).status).toBe(400);
    expect((await request(app).get('/api/mistakes/exam').set(auth())).status).toBe(400);
    expect((await answerExam('math', [])).status).toBe(400);
    const many = Array.from({ length: 21 }, (_, i) => ({ exerciseId: `x${i}`, userAnswer: 'a' }));
    expect((await answerExam('math', many)).status).toBe(400);
    expect((await answerExam('math', [{ exerciseId: 'x', userAnswer: 5 }])).status).toBe(400);
    expect((await answerExam('history', [{ exerciseId: 'x', userAnswer: 'a' }])).status).toBe(400);
  });

  test('a right answer fixes every record of its question; anything else is ignored', async () => {
    const questions = easy(english);
    const [a, b, c] = questions;
    const [mathQuestion] = easy(math);
    const res = await answerExam('english', [
      { exerciseId: a.id, userAnswer: a.correct_answer },
      { exerciseId: b.id, userAnswer: b.correct_answer },
      { exerciseId: c.id, userAnswer: wrong(c) },
      { exerciseId: a.id, userAnswer: wrong(a) }, // the same question again: graded once
      { exerciseId: mathQuestion.id, userAnswer: mathQuestion.correct_answer }, // another subject's mistake
      { exerciseId: 'no-such-question', userAnswer: 'x' }
    ]);
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data).toMatchObject({ subject: 'english', total: 3, correct: 2, fixed: 2, waiting: questions.length - 2 });
    expect(data.results.map(r => [r.exerciseId, r.isCorrect])).toEqual([[a.id, true], [b.id, true], [c.id, false]]);
    expect(data.results[2]).toMatchObject({ correctAnswer: c.correct_answer, questionTextHe: c.question_text_he });

    const records = await db.find('wrong_answers', { user_id: userId, exercise_id: a.id });
    expect(records).toHaveLength(2);
    expect(records.every(r => r.is_corrected && r.corrected_at)).toBe(true);
    expect(await waiting()).toEqual({ english: questions.length - 2, math: 3, arabic: 25 });

    // The next exam no longer asks the fixed questions; the math mistake is still there.
    const next = (await exam('english')).body.data.exercises.map(e => e.id);
    expect(next).not.toContain(a.id);
    expect(next).not.toContain(b.id);
    expect(next).toContain(c.id);
  });

  test('a question hidden after a report or gone from the content is neither asked nor counted', async () => {
    const [hidden] = easy(math);
    expect((await request(app).post('/api/reports').set(auth()).send({ exerciseId: hidden.id, reason: 'unclear' })).status).toBe(201);
    await db.insert('wrong_answers', {
      user_id: userId, lesson_id: math.id, exercise_id: 'gone-from-the-content', user_answer: 'x', correct_answer: 'y',
      attempt_number: 1, is_reviewed: false, is_corrected: false, created_at: new Date().toISOString()
    });
    expect((await waiting()).math).toBe(2);
    const asked = (await exam('math')).body.data.exercises.map(e => e.id);
    expect(asked).toHaveLength(2);
    expect(asked).not.toContain(hidden.id);
  });

  test('with nothing left to fix, the exam is empty', async () => {
    const { exercises } = (await exam('math')).body.data;
    const answerOf = new Map(easy(math).map(e => [e.id, e.correct_answer]));
    const res = await answerExam('math', exercises.map(e => ({ exerciseId: e.id, userAnswer: answerOf.get(e.id) })));
    expect(res.body.data).toMatchObject({ total: 2, correct: 2, waiting: 0 });
    expect((await exam('math')).body.data).toEqual({ subject: 'math', waiting: 0, exercises: [] });
  });
});
