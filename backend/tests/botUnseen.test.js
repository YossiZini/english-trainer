process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_DAILY_MESSAGE_CAP = '120';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db, DYNAMIC_COLLECTIONS } = require('./helpers');
const app = require('../src/app');
const UsageService = require('../src/services/usage.service');
const BotSession = require('../src/models/BotSession');
const UnseenSession = require('../src/models/UnseenSession');
const UnseenUserProgress = require('../src/models/UnseenUserProgress');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * /unseen in the bot: a reading text from the website's Unseen section, then
 * its five questions; recorded like a reading on the website (score,
 * progress, /usage), with no points or mistakes.
 */
describe('Bot unseen reading', () => {
  let token;
  let texts; // the website's list, in its order
  const chatId = '777';
  const bot = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body });
  const status = () => request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId });
  const answer = (text) => bot('/api/bot/session/answer', { text });
  const web = (path) => request(app).get(path).set({ Authorization: `Bearer ${token}` });
  const openReading = async () => (await db.find('bot_sessions', { chat_id: chatId }))
    .find(s => s.kind === 'unseen' && s.status === 'active');
  /** A text's questions as the website serves them, with their right answers. */
  const questionsOf = async (id) => (await web(`/api/unseen/paragraphs/${id}`)).body.data.questions;
  /** The website's progress on a text: null until a reading of it is completed. */
  const progressOf = async (id) => (await web('/api/unseen/paragraphs')).body.data.find(p => p.id === id).userProgress;

  /** This week's completed reading texts of the test student in /usage. */
  const readingUsage = async () => {
    UsageService.clearCache();
    const me = (await UsageService.summary()).students.find(s => s.name === 'bot-unseen');
    return me ? me.week.reading : 0;
  };

  /** Every student-data row except the bot's own and the reading records (points, results, mistakes …). */
  const snapshot = async () => {
    const own = ['bot_sessions', 'bot_usage', 'telegram_links', 'unseen_sessions', 'unseen_answers', 'unseen_user_progress'];
    const rows = {};
    for (const name of DYNAMIC_COLLECTIONS.filter(c => !own.includes(c))) {
      rows[name] = (await db.find(name, {})).map(r => JSON.stringify(r)).sort();
    }
    return rows;
  };

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'bot-unseen', password: 'secret123', age: 12 });
    token = res.body.data.token;
    const code = (await request(app).post('/api/telegram/link-code').set({ Authorization: `Bearer ${token}` })).body.data.code;
    expect((await bot('/api/bot/link', { code })).status).toBe(200);
    texts = (await web('/api/unseen/paragraphs')).body.data;
    expect(texts.length).toBeGreaterThan(1);
  });
  afterAll(shutdownDatabase);

  test('needs the bot key and a linked chat', async () => {
    expect((await request(app).post('/api/bot/unseen/start').send({ chatId })).status).toBe(401);
    const unlinked = await request(app).post('/api/bot/unseen/start').set('X-Bot-Key', 'test-bot-key').send({ chatId: '999' });
    expect(unlinked.status).toBe(403);
    expect(unlinked.body.code).toBe('not_linked');
  });

  test('starts with the easiest text not finished: the text, then question 1', async () => {
    const start = (await bot('/api/bot/unseen/start')).body.data;
    const [first] = texts;
    const questions = await questionsOf(first.id);
    expect(start).toMatchObject({
      kind: 'unseen',
      reading: { number: 1, count: texts.length, title: first.title_en, titleHe: first.title_he, level: first.complexity_level },
      passage: first.content,
      question: { number: 1, total: 5, type: 'multiple_choice', text: questions[0].question_text_en, options: questions[0].options }
    });
    expect((await status()).body.data).toMatchObject({ active: true, kind: 'unseen', question: { number: 1, total: 5 } });
    // The website's reading session is open, as when the reading page opens.
    const session = await openReading();
    expect(await db.findById('unseen_sessions', session.unseen_session_id))
      .toMatchObject({ paragraph_id: first.id, status: 'in_progress', user_id: session.user_id });
    await bot('/api/bot/session/end');
  });

  test('every text by its number in the website\'s list; a number outside it is refused', async () => {
    for (let n = 1; n <= texts.length; n++) {
      const data = (await bot('/api/bot/unseen/start', { number: n })).body.data;
      const questions = await questionsOf(texts[n - 1].id);
      expect(data.reading).toMatchObject({ number: n, title: texts[n - 1].title_en });
      expect(data.passage).toBe(texts[n - 1].content);
      expect(data.question).toMatchObject({ number: 1, total: questions.length, text: questions[0].question_text_en });
    }
    const missing = await bot('/api/bot/unseen/start', { number: texts.length + 1 });
    expect(missing.status).toBe(404);
    expect(missing.body.code).toBe('text_not_found');
    expect((await bot('/api/bot/unseen/start', { number: 0 })).status).toBe(400);
    expect((await bot('/api/bot/unseen/start', { number: 'seven' })).status).toBe(400);
    await bot('/api/bot/session/end');
  });

  test('a whole reading: verdicts, "?", the score and the website\'s progress; no points or mistakes', async () => {
    const before = await snapshot();
    const usageBefore = await readingUsage();
    const [first, second] = texts;
    const questions = await questionsOf(first.id);
    const start = (await bot('/api/bot/unseen/start')).body.data;
    expect(start.reading.number).toBe(1);
    const reading = await openReading();
    const recorded = async () => (await db.find('unseen_answers', { session_id: reading.unseen_session_id })).length;

    // Not an option number: the same question again, nothing recorded.
    for (const text of ['yes', 'unseen', '5', '0', '1.5', 'help']) {
      expect((await answer(text)).body.data).toMatchObject({ kind: 'unseen', chooseNumber: true, question: { number: 1 } });
    }
    // "?" is help, not an answer: the text's hard words and the question in Hebrew.
    for (const text of ['?', 'hint']) {
      expect((await answer(text)).body.data).toMatchObject({
        kind: 'unseen',
        hintAsked: true,
        hint: { words: first.hard_words.map(w => ({ word: w.word, translation: w.translation })), questionHe: questions[0].question_text_he },
        question: { number: 1 }
      });
    }
    expect(first.hard_words.length).toBeGreaterThan(0);
    expect(await recorded()).toBe(0);

    const wrongAt = [1, 4];
    const expected = [[0, 0], [1, 1], [1, 0], [1, 0], [2, 1]]; // wrong answers so far and in a row
    let reply;
    for (let i = 0; i < 5; i++) {
      const q = questions[i];
      const wrong = wrongAt.includes(i);
      const option = wrong ? ((q.correct_answer + 1) % q.options.length) + 1 : q.correct_answer + 1;
      reply = (await answer(String(option))).body.data;
      expect(reply.verdict).toMatchObject({
        correct: !wrong,
        given: q.options[option - 1],
        correctOption: q.correct_answer + 1,
        correctAnswer: q.options[q.correct_answer],
        explanation: wrong ? q.explanation_he : null,
        wrongCount: expected[i][0],
        wrongStreak: expected[i][1]
      });
      // Recorded like the website: each answer when it is checked.
      expect(await recorded()).toBe(i + 1);
      if (i < 4) expect(reply).toMatchObject({ done: false, question: { number: i + 2, text: questions[i + 1].question_text_en } });
    }
    expect(reply).toMatchObject({
      kind: 'unseen',
      done: true,
      reading: { number: 1, title: first.title_en },
      result: { correct: 3, total: 5, score: 60, bestScore: 60, attempts: 1, next: { number: 2, title: second.title_en } }
    });
    expect((await status()).body.data.active).toBe(false);
    expect(await db.findById('bot_sessions', reading.id))
      .toMatchObject({ status: 'ended', end_reason: 'completed', index: 5, correct_count: 3, wrong_count: 2 });

    // The website sees a completed reading: the score, and the text done with its best score.
    expect(await db.findById('unseen_sessions', reading.unseen_session_id))
      .toMatchObject({ status: 'completed', score: 60, correct_answers: 3 });
    expect(await progressOf(first.id)).toMatchObject({ best_score: 60, attempts: 1 });
    expect(await readingUsage()).toBe(usageBefore + 1);
    // No points, results or mistakes: every other student-data row is unchanged.
    expect(await snapshot()).toEqual(before);

    // The next /unseen is the next text not finished.
    expect((await bot('/api/bot/unseen/start')).body.data.reading).toMatchObject({ number: 2, title: second.title_en });
    await bot('/api/bot/session/end');
  });

  test('/end stops a reading and completes nothing; a new start replaces an open one', async () => {
    const usageBefore = await readingUsage();
    await bot('/api/bot/unseen/start', { number: 5 });
    const half = await openReading();
    await answer(String(half.questions[0].answer + 1));
    expect((await bot('/api/bot/session/end')).body.data).toMatchObject({
      kind: 'unseen', done: true, ended: true, reading: { number: 5 }, answered: 1, correct: 1, total: 5
    });
    // Not finished: the website's reading is abandoned, the text has no progress, /usage does not count it.
    expect(await db.findById('unseen_sessions', half.unseen_session_id)).toMatchObject({ status: 'abandoned', score: null });
    expect(await progressOf(texts[4].id)).toBeNull();
    expect(await readingUsage()).toBe(usageBefore);
    expect((await status()).body.data.active).toBe(false);
    expect((await answer('1')).status).toBe(404);

    // A new start replaces an open reading, which is abandoned on the website too.
    const one = (await bot('/api/bot/unseen/start')).body.data.sessionId;
    const replaced = await db.findById('bot_sessions', one);
    const two = (await bot('/api/bot/unseen/start')).body.data.sessionId;
    expect(two).not.toBe(one);
    expect(await db.findById('bot_sessions', one)).toMatchObject({ status: 'ended', end_reason: 'replaced' });
    expect(await db.findById('unseen_sessions', replaced.unseen_session_id)).toMatchObject({ status: 'abandoned' });

    // A reading question cannot be reported (reports cover words and lesson questions).
    expect((await bot('/api/bot/report')).status).toBe(404);
    // The end word works as an answer too.
    expect((await answer('end')).body.data).toMatchObject({ kind: 'unseen', ended: true, answered: 0 });

    // Starting a lesson replaces an open reading.
    await bot('/api/bot/unseen/start');
    const reading = await openReading();
    expect((await bot('/api/bot/exercise/start', { subject: 'math' })).body.data.kind).toBe('exercise');
    expect(await db.findById('bot_sessions', reading.id)).toMatchObject({ status: 'ended', end_reason: 'replaced' });
    await bot('/api/bot/session/end');
  });

  test('an open reading with every question answered is over, never an error', async () => {
    // As if the reading's last write had failed to close it.
    const userId = (await db.findOne('users', { name: 'bot-unseen' })).id;
    const question = { id: 'q', text: 'Q?', textHe: null, options: ['a', 'b', 'c', 'd'], answer: 0, explanation: null };
    const stuck = await db.insert('bot_sessions', {
      kind: 'unseen', user_id: userId, chat_id: chatId, status: 'active', index: 5, questions: Array(5).fill(question),
      answers: [0, 0, 0, 0, 0], correct_count: 5, wrong_count: 0, wrong_streak: 0,
      started_at: new Date(Date.now() + 1000).toISOString(), ended_at: null
    });
    expect((await answer('1')).status).toBe(404);
    expect((await status()).body.data.active).toBe(false);
    expect(await db.findById('bot_sessions', stuck.id)).toMatchObject({ status: 'ended', end_reason: 'completed' });
  });

  test('two answers sent together never count twice', async () => {
    // The guard: two claims of the same question at once, only one wins.
    await bot('/api/bot/unseen/start', { number: 3 });
    const first = await openReading();
    const claims = await Promise.all([1, 2].map(() => BotSession.claimAnswer(first.id, 0, { index: 1, answers: [0] })));
    expect(claims.filter(Boolean)).toHaveLength(1);
    expect(await db.findById('bot_sessions', first.id)).toMatchObject({ index: 1, answers: [0] });
    await bot('/api/bot/session/end');

    // Through the API: every answer of a whole reading sent twice at once (a double tap).
    const usageBefore = await readingUsage();
    await bot('/api/bot/unseen/start', { number: 4 });
    const reading = await openReading();
    const replies = [];
    for (let pair = 0; pair < 10; pair++) {
      const now = await db.findById('bot_sessions', reading.id);
      if (now.status !== 'active') break;
      const option = String(now.questions[now.index].answer + 1);
      replies.push(...await Promise.all([answer(option), answer(option)]));
    }
    // Each question took one answer; a twin found its question answered (and the reading as it is now) or the reading over.
    const verdicts = replies.filter(r => r.status === 200 && r.body.data.verdict);
    expect(verdicts).toHaveLength(5);
    expect(verdicts.filter(r => r.body.data.done)).toHaveLength(1);
    for (const r of replies.filter(x => !verdicts.includes(x))) {
      if (r.status === 200) expect(r.body.data).toMatchObject({ kind: 'unseen', alreadyAnswered: true });
      else expect(r.body.code).toBe('no_session');
    }
    // The website has exactly the session's five answers, and one completed attempt.
    const ended = await db.findById('bot_sessions', reading.id);
    const rows = await db.find('unseen_answers', { session_id: reading.unseen_session_id });
    expect(rows).toHaveLength(5);
    reading.questions.forEach((q, i) => {
      expect(rows.find(r => r.question_id === q.id)).toMatchObject({ user_answer: ended.answers[i] });
    });
    expect(await progressOf(texts[3].id)).toMatchObject({ attempts: 1, best_score: Math.round((ended.correct_count / 5) * 100) });
    expect(await readingUsage()).toBe(usageBefore + 1);
  });

  test('an answer whose website write is late still counts at the end', async () => {
    // As if the request that took question 4 had not written it yet when question 5 ends the reading.
    await bot('/api/bot/unseen/start', { number: 6 });
    const reading = await openReading();
    const right = reading.questions.map(q => q.answer);
    for (let i = 0; i < 3; i++) await answer(String(right[i] + 1));
    expect(await BotSession.claimAnswer(reading.id, 3, { index: 4, answers: right.slice(0, 4), correct_count: 4 })).not.toBeNull();
    expect(await db.find('unseen_answers', { session_id: reading.unseen_session_id })).toHaveLength(3);
    const last = (await answer(String(right[4] + 1))).body.data;
    expect(last).toMatchObject({ done: true, result: { correct: 5, total: 5, score: 100 } });
    expect(await db.find('unseen_answers', { session_id: reading.unseen_session_id })).toHaveLength(5);
  });

  test('a score counts each question once, by its first answer', async () => {
    // The website's rule too: an answer recorded twice never raises the score.
    const userId = (await db.findOne('users', { name: 'bot-unseen' })).id;
    const [q1, q2] = await questionsOf(texts[0].id);
    const reading = await UnseenSession.create(userId, texts[0].id);
    for (const [q, choice] of [[q1, q1.correct_answer], [q1, q1.correct_answer], [q2, (q2.correct_answer + 1) % 4], [q2, q2.correct_answer]]) {
      await UnseenSession.recordAnswer(reading.id, q.id, choice, choice === q.correct_answer);
      await pause(3); // distinct answer times: "first" is well defined
    }
    expect(await UnseenSession.complete(reading.id)).toMatchObject({ correct_answers: 1, score: 20 });
  });

  test('unseen list: every text in the website\'s order, marked done or next; a number starts it', async () => {
    const list = (await bot('/api/bot/unseen/list')).body.data;
    // The website's own marks: a text is done once a reading of it was completed.
    const website = (await web('/api/unseen/paragraphs')).body.data;
    const next = website.findIndex(p => !p.userProgress);
    expect(list).toMatchObject({ kind: 'unseen', pick: true, count: website.length, allDone: false });
    expect(list.items).toEqual(website.map((p, i) => ({
      n: i + 1,
      title: p.title_en,
      titleHe: p.title_he,
      level: p.complexity_level,
      status: p.userProgress ? 'done' : i === next ? 'next' : 'open',
      bestScore: p.userProgress ? p.userProgress.best_score : null
    })));
    expect(list.items.some(i => i.status === 'done')).toBe(true); // the readings finished above
    expect((await status()).body.data).toMatchObject({ active: true, kind: 'unseen', pick: true, count: website.length });

    // Not a text's number: the list again, nothing started.
    for (const text of ['0', String(website.length + 1), 'seven', '?']) {
      expect((await answer(text)).body.data).toMatchObject({ kind: 'unseen', pick: true, invalid: true });
    }
    // A number starts that text, a finished one too (to read it again).
    const done = list.items.find(i => i.status === 'done');
    const started = (await answer(String(done.n))).body.data;
    expect(started).toMatchObject({ kind: 'unseen', reading: { number: done.n, title: done.title }, question: { number: 1 } });
    expect(started.passage).toBe(website[done.n - 1].content);

    // /end closes the list too.
    await bot('/api/bot/unseen/list');
    expect((await bot('/api/bot/session/end')).body.data).toMatchObject({ kind: 'unseen', ended: true, pickClosed: true });
    expect((await status()).body.data.active).toBe(false);
  });

  test('with every text finished, /unseen shows the list to read one again', async () => {
    const userId = (await db.findOne('users', { name: 'bot-unseen' })).id;
    for (const p of texts) {
      if (!(await progressOf(p.id))) await UnseenUserProgress.upsertProgress(userId, p.id, 80);
    }
    const data = (await bot('/api/bot/unseen/start')).body.data;
    expect(data).toMatchObject({ kind: 'unseen', pick: true, allDone: true, count: texts.length });
    expect(data.items.every(i => i.status === 'done')).toBe(true);
    // The list is open: a number starts that text again.
    expect((await answer('2')).body.data).toMatchObject({ kind: 'unseen', reading: { number: 2, title: texts[1].title_en } });
    await bot('/api/bot/session/end');
  });

  test('the daily message cap covers /unseen', async () => {
    // Its own student and chat, so the other tests keep their quota in any order.
    const capped = '778';
    const reg = await request(app).post('/api/auth/register').send({ name: 'bot-unseen-cap', password: 'secret123', age: 12 });
    const code = (await request(app).post('/api/telegram/link-code').set({ Authorization: `Bearer ${reg.body.data.token}` })).body.data.code;
    const call = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId: capped, ...body });
    expect((await call('/api/bot/link', { code })).status).toBe(200);
    expect((await call('/api/bot/unseen/start')).status).toBe(200);
    let res;
    for (let i = 0; i < 130; i++) {
      res = await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId: capped });
      if (res.status === 429) break;
    }
    expect(res.status).toBe(429);
    expect((await call('/api/bot/unseen/start')).status).toBe(429);
    expect((await call('/api/bot/session/answer', { text: '1' })).status).toBe(429);
  });
});
