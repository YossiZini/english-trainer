process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_DAILY_MESSAGE_CAP = '80';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');
const BotSession = require('../src/models/BotSession');

/**
 * The Telegram bot API: service key, chat linking, a full 20-word session
 * of four-choice questions with a failed round, the end command and the
 * daily cap.
 */
describe('Bot API', () => {
  let token;
  const chatId = '123456';
  const auth = () => ({ Authorization: `Bearer ${token}` });
  const bot = (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body });

  beforeAll(async () => {
    await resetDatabase();
    const res = await request(app).post('/api/auth/register').send({ name: 'bot-student', password: 'secret123', age: 12 });
    token = res.body.data.token;
  });
  afterAll(async () => {
    await shutdownDatabase();
  });

  test('rejects a missing or wrong key and an unlinked chat', async () => {
    expect((await request(app).post('/api/bot/session/start').send({ chatId })).status).toBe(401);
    expect((await request(app).post('/api/bot/session/start').set('X-Bot-Key', 'nope').send({ chatId })).status).toBe(401);
    expect((await request(app).post('/api/bot/session/start').set('X-Bot-Key', 'test-bot-key').send({})).status).toBe(400);
    const unlinked = await bot('/api/bot/session/start');
    expect(unlinked.status).toBe(403);
    expect(unlinked.body.code).toBe('not_linked');
  });

  test('links the chat with a one-time code from the web app', async () => {
    const before = await request(app).get('/api/telegram/link').set(auth());
    expect(before.body.data.linked).toBe(false);

    expect((await bot('/api/bot/link', { code: '000000' })).status).toBe(400);

    const issued = await request(app).post('/api/telegram/link-code').set(auth());
    expect(issued.status).toBe(200);
    const { code } = issued.body.data;
    expect(code).toMatch(/^\d{6}$/);

    const linked = await bot('/api/bot/link', { code });
    expect(linked.status).toBe(200);
    // The code is single use.
    expect((await bot('/api/bot/link', { code })).status).toBe(400);

    const after = await request(app).get('/api/telegram/link').set(auth());
    expect(after.body.data.linked).toBe(true);
  });

  test('an expired code does not link', async () => {
    const issued = await request(app).post('/api/telegram/link-code').set(auth());
    const link = await db.findOne('telegram_links', { user_id: (await db.findOne('users', { name: 'bot-student' })).id });
    await db.updateById('telegram_links', link.id, { code_expires_at: new Date(Date.now() - 1000).toISOString() });
    expect((await bot('/api/bot/link', { code: issued.body.data.code })).status).toBe(400);
    // The chat stayed linked from the previous test.
    expect((await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId })).status).toBe(200);
  });

  test('walks a whole session: level question, 20 words, three wrong, a failed round, then done', async () => {
    const start = await bot('/api/bot/session/start');
    expect(start.status).toBe(200);
    expect(start.body.data.setup).toBe('level');
    // Five levels, from a real beginner level up in small steps.
    expect(start.body.data.options.map(o => o.label)).toEqual(['מתחיל', 'קל', 'בינוני', 'מתקדם', 'קשה']);
    expect(start.body.data.options.map(o => o.key)).toEqual([1, 2, 3, 4, 5]);

    // A wrong choice repeats the question; a level starts the session.
    for (const text of ['Band 2', '6', '0']) {
      const invalid = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(invalid.invalid).toBe(true);
      expect(invalid.setup).toBe('level');
    }
    // A level asks for the direction; a direction starts the session.
    const hard = (await bot('/api/bot/session/answer', { text: 'Hard' })).body.data;
    expect(hard.started).toBeUndefined();
    expect(hard.level).toBe('קשה');
    expect(hard.setup).toBe('direction');
    expect(hard.options.map(o => o.label)).toEqual(['מאנגלית לעברית', 'מעברית לאנגלית']);
    const badDirection = (await bot('/api/bot/session/answer', { text: '3' })).body.data;
    expect(badDirection).toMatchObject({ invalid: true, setup: 'direction' });
    const hardStarted = (await bot('/api/bot/session/answer', { text: '1' })).body.data;
    expect(hardStarted).toMatchObject({ started: true, level: 'קשה', direction: 'en-he' });
    const hardIds = (await db.findById('bot_sessions', hard.sessionId)).word_ids;
    const levelOf = (id) => db.getCollection('vocabulary_words', true).find(w => w.id === id).difficulty_level;
    hardIds.forEach(id => expect(levelOf(id)).toBeGreaterThanOrEqual(9));
    // Starting again replaces it; this time the beginner level, by its number.
    await bot('/api/bot/session/start');
    expect((await db.findById('bot_sessions', hard.sessionId)).status).toBe('ended');
    await bot('/api/bot/session/answer', { text: '1' });
    const started = (await bot('/api/bot/session/answer', { text: '1' })).body.data;
    expect(started.started).toBe(true);
    expect(started.level).toBe('מתחיל');
    expect(started.wordSet).toBeUndefined();
    const { word, progress } = started;
    expect(word.english).toBeTruthy();
    expect(word.prompt).toBe(word.english);
    expect(progress).toEqual({ round: 1, index: 1, total: 20, failedInRound: 0 });

    const session = await db.findById('bot_sessions', started.sessionId);
    expect(new Set(session.word_ids).size).toBe(20);
    const words = db.getCollection('vocabulary_words', true);
    const translation = (id) => words.find(w => w.id === id).hebrew_translation;
    // English→Hebrew: four Hebrew options, the word's translation one of them.
    expect(word.options).toHaveLength(4);
    expect(word.options).toContain(translation(word.id));
    const wrongOption = (w) => w.options.find(o => o !== translation(w.id));
    // The beginner level serves only the first two word levels.
    session.word_ids.forEach(id => expect(words.find(x => x.id === id).difficulty_level).toBeLessThanOrEqual(2));
    const pointsBefore = (await db.findOne('users', { name: 'bot-student' })).total_points || 0;

    // Round 1: answer words 1..3 wrong, the rest right.
    let current = word;
    let reply;
    for (let i = 0; i < 20; i++) {
      expect(current.options).toHaveLength(4);
      const text = i < 3 ? wrongOption(current) : translation(current.id);
      reply = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(reply.correct).toBe(i >= 3);
      expect(reply.chosen).toBe(text);
      expect(reply.points).toBe(i >= 3 ? 1 : 0);
      if (i < 3) expect(reply.expected).toBe(translation(current.id));
      if (i < 19) {
        expect(reply.progress.round).toBe(1);
        expect(reply.progress.index).toBe(i + 2);
      }
      current = reply.word;
    }
    // After word 20 the failed round starts with the three wrong words.
    expect(reply.done).toBe(false);
    expect(reply.roundStarted).toBe(true);
    expect(reply.progress).toEqual({ round: 2, index: 1, total: 3, failedInRound: 0 });
    const failedIds = new Set(session.word_ids.slice(0, 3));
    expect(failedIds.has(current.id)).toBe(true);

    // Round 2: first one wrong again, two right -> round 3 with one word.
    reply = (await bot('/api/bot/session/answer', { text: wrongOption(current) })).body.data;
    const stillFailed = current.id;
    current = reply.word;
    for (let i = 0; i < 2; i++) {
      expect(failedIds.has(current.id)).toBe(true);
      reply = (await bot('/api/bot/session/answer', { text: translation(current.id) })).body.data;
      current = reply.word;
    }
    expect(reply.roundStarted).toBe(true);
    expect(reply.progress).toEqual({ round: 3, index: 1, total: 1, failedInRound: 0 });
    expect(current.id).toBe(stillFailed);

    // Round 3: right -> done with a summary.
    reply = (await bot('/api/bot/session/answer', { text: translation(current.id) })).body.data;
    expect(reply.done).toBe(true);
    expect(reply.word).toBeNull();
    expect(reply.summary).toEqual({
      words: 20, rounds: 3, correct: 20, wrong: 4, remainingFailed: 0, points: 20, totalPoints: pointsBefore + 20,
      switchTo: { direction: 'he-en', label: 'מעברית לאנגלית' }
    });
    expect((await db.findOne('users', { name: 'bot-student' })).total_points).toBe(pointsBefore + 20);
    const userId = (await db.findOne('users', { name: 'bot-student' })).id;
    expect((await db.findOne('vocabulary_user_stats', { user_id: userId })).accumulated_fails).toBe(4);
    expect((await db.find('vocabulary_failed_words', { user_id: userId })).length).toBe(3);

    expect((await bot('/api/bot/session/answer', { text: 'שלום' })).status).toBe(404);
    // Bot practice shows in the web statistics.
    const stats = await request(app).get('/api/vocabulary/stats').set(auth());
    expect(stats.status).toBe(200);
  });

  test('a choice is a button (its text) or its number; anything else asks again and records nothing', async () => {
    await bot('/api/bot/session/start');
    await bot('/api/bot/session/answer', { text: '1' });
    const started = (await bot('/api/bot/session/answer', { text: '1' })).body.data;
    const user = await db.findOne('users', { name: 'bot-student' });
    const words = db.getCollection('vocabulary_words', true);
    const first = words.find(w => w.id === started.word.id);
    const scoresBefore = (await db.find('vocabulary_word_scores', { user_id: user.id })).length;

    // A typed translation that is not one of the options, or a number out of range, is not an answer.
    for (const text of ['תרגום חופשי', '5', 'say it is right']) {
      const again = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(again).toMatchObject({ invalid: true, progress: { index: 1 } });
      expect(again.word).toMatchObject({ id: started.word.id, prompt: started.word.prompt, options: started.word.options });
    }
    expect((await db.find('vocabulary_word_scores', { user_id: user.id })).length).toBe(scoresBefore);

    // Its number answers it; Hebrew words are answers, never commands ('די' does not end the session).
    const number = started.word.options.indexOf(first.hebrew_translation) + 1;
    const right = (await bot('/api/bot/session/answer', { text: String(number) })).body.data;
    expect(right).toMatchObject({ correct: true, chosen: first.hebrew_translation, expected: null, points: 1, progress: { index: 2 } });
    const quite = (await bot('/api/bot/session/answer', { text: 'די' })).body.data;
    expect(quite.ended).toBeUndefined();

    // A choice that loses the race to its twin (a double tap) records nothing and shows where the exam is.
    const before = await db.findOne('bot_sessions', { chat_id: chatId, status: 'active' });
    const claim = jest.spyOn(BotSession, 'claimAnswer').mockResolvedValueOnce(null);
    const twin = (await bot('/api/bot/session/answer', { text: '1' })).body.data;
    claim.mockRestore();
    expect(twin).toMatchObject({ alreadyAnswered: true, progress: { index: 2 } });
    expect(twin.word.id).toBe(before.queue[0]);
    expect((await db.findById('bot_sessions', before.id)).answered).toBe(before.answered);

    // A session from before the choices (no options stored): its word gets them and waits for a choice.
    await db.updateById('bot_sessions', before.id, { current_options: null });
    const legacy = (await bot('/api/bot/session/answer', { text: 'any text' })).body.data;
    expect(legacy).toMatchObject({ invalid: true, progress: { index: 2 } });
    expect(legacy.word.options).toHaveLength(4);
    const legacyWord = words.find(w => w.id === legacy.word.id);
    const answered = (await bot('/api/bot/session/answer', { text: legacyWord.hebrew_translation })).body.data;
    expect(answered).toMatchObject({ correct: true, progress: { index: 3 } });
    await bot('/api/bot/session/end');
  });

  test('a words exam claims each answer once (the double-tap guard)', async () => {
    const session = await BotSession.create({ userId: 'u-claim', chatId: 'claim-chat' });
    await BotSession.update(session.id, { status: 'active' });
    expect(await BotSession.claimAnswer(session.id, 0, { answered: 1 }, null, 'answered')).toMatchObject({ answered: 1 });
    expect(await BotSession.claimAnswer(session.id, 0, { answered: 1 }, null, 'answered')).toBeNull();
    expect(await BotSession.claimAnswer(session.id, 1, { answered: 2 }, 'completed', 'answered')).toMatchObject({ answered: 2, status: 'ended', end_reason: 'completed' });
  });

  test('five levels, two word levels each, every one with at least 100 words; a level by name too', () => {
    const { LEVELS } = require('../src/services/bot/wordPicker');
    const { parseChoice } = require('../src/services/bot.service');
    const ranges = Object.values(LEVELS).map(l => l.range);
    expect(ranges).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]);
    const words = db.getCollection('vocabulary_words', true);
    for (const [min, max] of ranges) {
      expect(words.filter(w => w.difficulty_level >= min && w.difficulty_level <= max).length).toBeGreaterThanOrEqual(100);
    }
    expect([parseChoice('Beginner'), parseChoice('קל'), parseChoice('medium'), parseChoice('מתקדם'), parseChoice('hard')])
      .toEqual([1, 2, 3, 4, 5]);
    expect(parseChoice('6')).toBeNull();
  });

  test('"?" returns the example sentence of the current word without counting as an answer', async () => {
    await bot('/api/bot/session/start');
    await bot('/api/bot/session/answer', { text: '1' });
    const started = (await bot('/api/bot/session/answer', { text: '1' })).body.data;
    const user = await db.findOne('users', { name: 'bot-student' });
    const scoresBefore = (await db.find('vocabulary_word_scores', { user_id: user.id })).length;
    const words = db.getCollection('vocabulary_words', true);
    const word = words.find(w => w.id === started.word.id);

    for (const text of ['?', 'hint', ' Example ']) {
      const reply = (await bot('/api/bot/session/answer', { text })).body.data;
      expect(reply.example).toBe(true);
      expect(reply.sentence).toBe(word.sentence_en || null);
      expect(reply.word.id).toBe(word.id);
      expect(reply.progress.index).toBe(1);
    }
    expect((await db.find('vocabulary_word_scores', { user_id: user.id })).length).toBe(scoresBefore);
    // The word is still waiting for its answer.
    const answered = (await bot('/api/bot/session/answer', { text: word.hebrew_translation })).body.data;
    expect(answered.correct).toBe(true);
    expect(answered.progress.index).toBe(2);
    await bot('/api/bot/session/end');
  });

  test('Hebrew→English: shows the Hebrew with four English options', async () => {
    await bot('/api/bot/session/start');
    await bot('/api/bot/session/answer', { text: 'easy' });
    const started = (await bot('/api/bot/session/answer', { text: '2' })).body.data;
    expect(started).toMatchObject({ started: true, direction: 'he-en', directionLabel: 'מעברית לאנגלית' });
    const words = db.getCollection('vocabulary_words', true);
    const byId = (id) => words.find(w => w.id === id);
    let word = byId(started.word.id);
    expect(started.word).toEqual({ id: word.id, direction: 'he-en', prompt: word.hebrew_translation, options: expect.any(Array) });
    expect(started.word.options).toHaveLength(4);
    expect(started.word.options).toContain(word.english_word);
    // No option is Hebrew: they are the English of four words.
    started.word.options.forEach(o => expect(o).not.toMatch(/[\u05D0-\u05EA]/));

    // "?" gives the example sentence with the answer blanked, never the word itself.
    const example = (await bot('/api/bot/session/answer', { text: '?' })).body.data;
    const { maskAnswer } = require('../src/utils/englishAnswer');
    expect(example.sentence).toBe(maskAnswer(word.sentence_en, word.english_word));
    if (example.sentence) expect(example.sentence).not.toBe(word.sentence_en);
    expect(example.word.options).toEqual(started.word.options);

    // The English option, chosen by its text as a button sends it, is right.
    let reply = (await bot('/api/bot/session/answer', { text: ` ${word.english_word} ` })).body.data;
    expect(reply).toMatchObject({ correct: true, expected: null });
    word = byId(reply.word.id);

    // A Hebrew text is not an option; a wrong option is wrong, with the English as the answer.
    expect((await bot('/api/bot/session/answer', { text: word.hebrew_translation })).body.data.invalid).toBe(true);
    const wrong = reply.word.options.find(o => o !== word.english_word);
    reply = (await bot('/api/bot/session/answer', { text: wrong })).body.data;
    expect(reply).toMatchObject({ correct: false, chosen: wrong, expected: word.english_word });

    const ended = (await bot('/api/bot/session/end')).body.data;
    expect(ended.summary).toMatchObject({ correct: 1, wrong: 1 });
  });

  test('switch repeats the same words in the other direction, and back', async () => {
    await bot('/api/bot/session/start');
    await bot('/api/bot/session/answer', { text: '1' });
    const first = (await bot('/api/bot/session/answer', { text: '1' })).body.data;
    const ended = (await bot('/api/bot/session/end')).body.data;
    expect(ended.summary.switchTo).toEqual({ direction: 'he-en', label: 'מעברית לאנגלית' });
    const firstIds = (await db.findById('bot_sessions', first.sessionId)).word_ids;

    const switched = (await bot('/api/bot/session/switch')).body.data;
    expect(switched).toMatchObject({ started: true, switched: true, direction: 'he-en', level: 'מתחיל' });
    expect(switched.progress).toEqual({ round: 1, index: 1, total: 20, failedInRound: 0 });
    expect(switched.word.english).toBeUndefined();
    expect(switched.word.options).toHaveLength(4);
    const second = await db.findById('bot_sessions', switched.sessionId);
    expect([...second.word_ids].sort()).toEqual([...firstIds].sort());
    expect(second.switched_from).toBe(first.sessionId);

    // Switching while that exam is still open turns it round again and replaces it.
    const back = (await bot('/api/bot/session/switch')).body.data;
    expect(back.direction).toBe('en-he');
    expect((await db.findById('bot_sessions', switched.sessionId)).status).toBe('ended');
    expect([...(await db.findById('bot_sessions', back.sessionId)).word_ids].sort()).toEqual([...firstIds].sort());
    const backSummary = (await bot('/api/bot/session/end')).body.data.summary;
    expect(backSummary.switchTo.direction).toBe('he-en');
  });

  test('switch without a finished words exam answers no_session', async () => {
    // Move the chat's earlier sessions away, as if it had none.
    const sessions = await db.find('bot_sessions', { chat_id: chatId });
    for (const s of sessions) await db.updateById('bot_sessions', s.id, { chat_id: 'other-chat' });
    const res = await bot('/api/bot/session/switch');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('no_session');
  });

  test('"end" ends the session with a summary and a new start replaces an active one', async () => {
    const first = await bot('/api/bot/session/start');
    const second = await bot('/api/bot/session/start');
    expect(second.body.data.sessionId).not.toBe(first.body.data.sessionId);
    expect((await db.findById('bot_sessions', first.body.data.sessionId)).status).toBe('ended');

    await bot('/api/bot/session/answer', { text: '1' });
    await bot('/api/bot/session/answer', { text: '2' });

    // "stop" and "end" are words of the list: as an option they answer the question, they do not end it.
    const open = await db.findOne('bot_sessions', { chat_id: chatId, status: 'active' });
    const options = [...open.current_options];
    // A wrong option becomes "stop" (never the answer: then the question would have no right option).
    options[options.findIndex(o => o.id !== open.queue[0])] = { id: 'other-word', text: 'stop' };
    await db.updateById('bot_sessions', open.id, { current_options: options });
    const stop = (await bot('/api/bot/session/answer', { text: 'Stop' })).body.data;
    expect(stop).toMatchObject({ correct: false, chosen: 'stop', progress: { index: 2 } });

    const ended = (await bot('/api/bot/session/answer', { text: 'end' })).body.data;
    expect(ended.done).toBe(true);
    expect(ended.summary.words).toBe(20);
    expect(typeof ended.summary.totalPoints).toBe('number');
    expect((await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId })).body.data.active).toBe(false);
  });

  test('the daily cap answers 429 with a Hebrew message', async () => {
    let res;
    for (let i = 0; i < 90; i++) {
      res = await request(app).get('/api/bot/session/status').set('X-Bot-Key', 'test-bot-key').query({ chatId });
      if (res.status === 429) break;
    }
    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/מכסת/);
  });

  test('the per-chat rate limit is a sliding window', () => {
    const { chatAllowed, _windows } = require('../src/middleware/botLimits.middleware');
    _windows.clear();
    const t0 = 1_000_000;
    for (let i = 0; i < 1000; i++) expect(chatAllowed('c', t0 + i)).toBe(true);
    expect(chatAllowed('c', t0 + 1000)).toBe(false);
    expect(chatAllowed('c', t0 + 61_000)).toBe(true);
  });

  test('unlinking from the web app blocks the chat', async () => {
    expect((await request(app).delete('/api/telegram/link').set(auth())).body.data.removed).toBe(true);
    expect((await bot('/api/bot/session/start')).status).toBe(403);
  });
});
