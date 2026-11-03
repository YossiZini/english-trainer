const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');

/**
 * Fixing a lesson's mistakes on the website (/exercise/:lessonId?mode=retry):
 * the questions come in the shape of a lesson's exercises, which the exercise
 * page reads, with their picture and without their answers.
 */
describe("Retrying a lesson's mistakes", () => {
  let token;
  const auth = () => ({ Authorization: `Bearer ${token}` });
  const bundled = new Map(require('../data/static/exercises.json').map(e => [e.id, e]));

  beforeAll(async () => {
    await resetDatabase();
    token = (await request(app).post('/api/auth/register').send({ name: 'retry', password: 'secret123', age: 12 })).body.data.token;
  });
  afterAll(async () => { await shutdownDatabase(); });

  test('each mistake comes back with its question text, options and picture, not its answer', async () => {
    // Plotting points (107.2): most of its questions are asked on a grid.
    const plotting = db.getCollection('lessons', true).find(l => l.subtopic_number === '107.2');
    const asked = [...bundled.values()].filter(e => e.lesson_id === plotting.id && e.difficulty === 'easy');
    expect(asked.some(e => e.question_picture)).toBe(true);
    await request(app).post('/api/exercises/submit').set(auth()).send({
      lessonId: plotting.id, timeSpent: 60, difficulty: 'easy',
      answers: asked.map(e => ({ exerciseId: e.id, userAnswer: e.options.find(o => o !== e.correct_answer) }))
    });

    const res = await request(app).get(`/api/mistakes/lesson/${plotting.id}/exercises`).set(auth());
    expect(res.status).toBe(200);
    const exercises = res.body.data;
    expect(exercises.map(e => e.id).sort()).toEqual(asked.map(e => e.id).sort());
    for (const e of exercises) {
      const source = bundled.get(e.id);
      expect(e).toMatchObject({ type: 'multiple_choice', question_text_he: source.question_text_he, options: source.options });
      expect(e.question_picture).toBe(source.question_picture);
      expect(JSON.stringify(e)).not.toMatch(/correct|explanation/i);
    }
  });
});
