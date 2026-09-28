process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_DAILY_MESSAGE_CAP = '1000';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');
const { parseOptionNumber } = require('../src/services/bot/exerciseSession');
const { compareLessons } = require('../src/utils/lessonOrder');

const bundled = new Map(require('../data/static/exercises.json').map(e => [e.id, e]));
const lessons = require('../data/static/lessons.json');

/**
 * Lesson exercises in the bot: start by subject or lesson, answer multiple
 * choice by number and fill-in by text, grade like the web at the end.
 */
describe('Bot lesson exercises', () => {
  let token;
  let userId;
  const chatId = '777';
  const bot = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body });
  const status = () => request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId });

  /** The text to send for the current question: the option number, or the fill-in answer. */
  const rightAnswer = (question, exerciseId) => {
    const correct = bundled.get(exerciseId).correct_answer;
    if (question.type !== 'multiple_choice') return correct;
    const { answersMatch } = require('../src/utils/answers');
    return String(question.options.findIndex(o => answersMatch(o, correct)) + 1);
  };
  const wrongAnswer = (question, exerciseId) => {
    const right = rightAnswer(question, exerciseId);
    if (question.type !== 'multiple_choice') return 'תשובה שגויה';
    return String((Number(right) % question.options.length) + 1);
  };
  const currentExerciseId = async () => {
    const session = (await db.find('bot_sessions', { chat_id: chatId })).find(s => s.status === 'active');
    return session.exercises[session.index].id;
  };

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'bot-lessons', password: 'secret123', age: 12 });
    token = res.body.data.token;
    userId = res.body.data.user.id;
    const code = (await request(app).post('/api/telegram/link-code').set({ Authorization: `Bearer ${token}` })).body.data.code;
    expect((await bot('/api/bot/link', { code })).status).toBe(200);
  });
  afterAll(shutdownDatabase);

  test('option numbers: 1..n only', () => {
    expect(parseOptionNumber('2', 4)).toBe(2);
    expect(parseOptionNumber(' 4 ', 4)).toBe(4);
    expect(parseOptionNumber('4', 3)).toBeNull();
    expect(parseOptionNumber('0', 4)).toBeNull();
    expect(parseOptionNumber('goes', 4)).toBeNull();
    expect(parseOptionNumber('1.5', 4)).toBeNull();
  });

  test('bad input: subject, unknown lesson, nothing given', async () => {
    expect((await bot('/api/bot/exercise/start', { subject: 'history' })).status).toBe(400);
    expect((await bot('/api/bot/exercise/start', {})).status).toBe(400);
    expect((await bot('/api/bot/exercise/start', { lessonId: 'nope' })).status).toBe(404);
  });

  test('the next English lesson, a whole lesson graded exactly like the web', async () => {
    const start = await bot('/api/bot/exercise/start', { subject: 'english' });
    expect(start.status).toBe(200);
    const first = [...lessons].filter(l => (l.subject || 'english') === 'english').sort(compareLessons)[0];
    expect(start.body.data.lesson).toMatchObject({ id: first.id, subject: 'english', difficulty: 'easy' });
    let question = start.body.data.question;
    expect(question).toMatchObject({ number: 1, total: 10 });
    expect((await status()).body.data).toMatchObject({ active: true, kind: 'exercise' });

    const resultsBefore = (await db.find('exercise_results', { user_id: userId })).length;
    const pointsBefore = (await db.findById('users', userId)).total_points || 0;

    let reply;
    for (let i = 0; i < 10; i++) {
      const exerciseId = await currentExerciseId();
      if (question.type === 'multiple_choice') {
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        // Anything but an option number repeats the question and records nothing.
        const retry = (await bot('/api/bot/session/answer', { text: 'goes' })).body.data;
        expect(retry.chooseNumber).toBe(true);
        expect(retry.question.number).toBe(i + 1);
        expect((await bot('/api/bot/session/answer', { text: String(question.options.length + 1) })).body.data.chooseNumber).toBe(true);
      }
      const text = i === 0 ? wrongAnswer(question, exerciseId) : rightAnswer(question, exerciseId);
      reply = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(reply.verdict.correct).toBe(i !== 0);
      if (i === 0) {
        expect(reply.verdict.correctAnswer).toBe(bundled.get(exerciseId).correct_answer);
        if (question.type === 'multiple_choice') expect(reply.verdict.correctOption).toBe(Number(rightAnswer(question, exerciseId)));
      }
      if (i < 9) {
        expect(reply.question.number).toBe(i + 2);
        question = reply.question;
      }
    }

    // Graded by ExerciseService.submitExercise: 9 of 10, +1 each, -2 for the wrong one, +3 pass bonus.
    expect(reply.done).toBe(true);
    expect(reply.result).toMatchObject({ score: 90, passed: true, correct: 9, total: 10, pointsEarned: 10 });
    expect(reply.result.totalPoints).toBe(pointsBefore + 10);
    const results = await db.find('exercise_results', { user_id: userId });
    expect(results.length).toBe(resultsBefore + 1);
    expect(results.find(r => r.lesson_id === first.id)).toMatchObject({ score: 90, difficulty: 'easy', total_questions: 10 });
    expect((await db.find('wrong_answers', { user_id: userId })).length).toBe(1);
    expect(reply.result.nextLesson.id).toBe([...lessons].filter(l => (l.subject || 'english') === 'english').sort(compareLessons)[1].id);
    expect((await status()).body.data.active).toBe(false);
  });

  test('a chosen Math lesson; ending early records nothing', async () => {
    const math = [...lessons].filter(l => l.subject === 'math').sort(compareLessons)[3];
    const start = (await bot('/api/bot/exercise/start', { lessonId: math.id })).body.data;
    expect(start.lesson).toMatchObject({ id: math.id, subject: 'math' });

    const before = (await db.find('exercise_results', { user_id: userId })).length;
    const exerciseId = await currentExerciseId();
    await bot('/api/bot/session/answer', { text: rightAnswer(start.question, exerciseId) });
    // '?' is not an answer: the hint (none in the content yet) and the same question.
    const hint = (await bot('/api/bot/session/answer', { text: '?' })).body.data;
    expect(hint).toMatchObject({ hintAsked: true, hint: null, question: { number: 2 } });
    const ended = (await bot('/api/bot/session/answer', { text: 'end' })).body.data;
    expect(ended).toMatchObject({ kind: 'exercise', ended: true, answered: 1, correct: 1, total: 10 });
    expect((await db.find('exercise_results', { user_id: userId })).length).toBe(before);
    expect((await bot('/api/bot/session/answer', { text: '1' })).status).toBe(404);
  });

  test('an exercise session and a vocabulary session replace each other', async () => {
    const vocab = (await bot('/api/bot/session/start')).body.data;
    expect((await status()).body.data.kind).toBe('vocab');

    const exercise = (await bot('/api/bot/exercise/start', { subject: 'math' })).body.data;
    expect((await db.findById('bot_sessions', vocab.sessionId)).status).toBe('ended');
    expect((await status()).body.data.kind).toBe('exercise');
    // An answer now goes to the exercise, not to the vocabulary level question.
    expect((await bot('/api/bot/session/answer', { text: 'לא מספר' })).body.data.kind).toBe('exercise');

    await bot('/api/bot/session/start');
    expect((await db.findById('bot_sessions', exercise.sessionId)).status).toBe('ended');
    expect((await status()).body.data).toMatchObject({ kind: 'vocab', setup: 'level' });
    await bot('/api/bot/session/end');
  });

  test('the lesson list: curriculum order, marks, paging, pick by number', async () => {
    const english = [...lessons].filter(l => (l.subject || 'english') === 'english').sort(compareLessons);
    expect((await bot('/api/bot/exercise/lessons', { subject: 'history' })).status).toBe(400);

    const list = (await bot('/api/bot/exercise/lessons', { subject: 'english' })).body.data;
    expect(list).toMatchObject({ kind: 'exercise', pick: true, page: 1, count: english.length, pages: Math.ceil(english.length / 10) });
    expect(list.items.map(i => i.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(list.items.map(i => i.id)).toEqual(english.slice(0, 10).map(l => l.id));
    // Lesson 1 was passed above; lesson 2 is the next one.
    expect(list.items.slice(0, 3).map(i => i.status)).toEqual(['done', 'next', 'open']);
    expect((await status()).body.data).toMatchObject({ active: true, kind: 'exercise', pick: true, page: 1 });

    const more = (await bot('/api/bot/session/answer', { text: 'more' })).body.data;
    expect(more).toMatchObject({ pick: true, page: 2 });
    expect(more.items[0]).toMatchObject({ n: 11, id: english[10].id });
    expect((await bot('/api/bot/session/answer', { text: 'back' })).body.data.page).toBe(1);

    for (const text of ['0', String(english.length + 1), 'lesson']) {
      const bad = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(bad).toMatchObject({ pick: true, invalid: true, page: 1 });
    }

    const picked = (await bot('/api/bot/session/answer', { text: '12' })).body.data;
    expect(picked.lesson.id).toBe(english[11].id);
    expect(picked.question.number).toBe(1);
    expect((await status()).body.data).toMatchObject({ kind: 'exercise', lesson: { id: english[11].id } });

    // 'end' closes a list without starting anything.
    await bot('/api/bot/exercise/lessons', { subject: 'math' });
    const closed = (await bot('/api/bot/session/answer', { text: 'end' })).body.data;
    expect(closed).toMatchObject({ ended: true, pickClosed: true });
    expect((await status()).body.data.active).toBe(false);
  });

  test('start the n-th lesson of a subject directly', async () => {
    const math = [...lessons].filter(l => l.subject === 'math').sort(compareLessons);
    const start = (await bot('/api/bot/exercise/start', { subject: 'math', number: 5 })).body.data;
    expect(start.lesson).toMatchObject({ id: math[4].id, number: 5 });
    expect((await bot('/api/bot/exercise/start', { subject: 'math', number: math.length + 1 })).status).toBe(404);
    expect((await bot('/api/bot/exercise/start', { number: 5 })).status).toBe(400);

    // A chosen difficulty overrides the progress-based level and is graded at it.
    expect((await bot('/api/bot/exercise/start', { subject: 'math', number: 2, difficulty: 'expert' })).status).toBe(400);
    const hard = (await bot('/api/bot/exercise/start', { subject: 'math', number: 2, difficulty: 'hard' })).body.data;
    expect(hard.lesson).toMatchObject({ id: math[1].id, number: 2, difficulty: 'hard' });
    const hardIds = (await db.find('bot_sessions', { chat_id: chatId })).find(s => s.status === 'active').exercises.map(e => e.id);
    expect(hardIds.every(id => bundled.get(id).difficulty === 'hard')).toBe(true);
    await bot('/api/bot/session/end');
  });
});
