process.env.BOT_API_KEY = 'test-bot-key';
process.env.BOT_CHAT_RATE_PER_MINUTE = '1000';
process.env.BOT_DAILY_MESSAGE_CAP = '1000';

const request = require('supertest');
const { resetDatabase, shutdownDatabase, db } = require('./helpers');
const app = require('../src/app');
const VocabularyWord = require('../src/models/VocabularyWord');
const { invalidWordChange } = require('../src/services/review.service');

/**
 * Students report vocabulary words (web quiz and the bot's words exam); a
 * reported word is hidden until the admin reviews it in /review.
 */
describe('Word reports', () => {
  const adminChat = '7001';
  const studentChat = '7002';
  let student;
  let studentId;
  const bot = (chatId) => ({
    get: (path) => request(app).get(path).set('X-Bot-Key', 'test-bot-key').query({ chatId }),
    post: (path, body) => request(app).post(path).set('X-Bot-Key', 'test-bot-key').send({ chatId, ...body })
  });
  const words = () => db.getCollection('vocabulary_words', true);
  const webReport = (body) => request(app).post('/api/reports').set(student).send(body);

  async function linkedAccount(name, chatId) {
    const reg = await request(app).post('/api/auth/register').send({ name, password: 'secret123', age: 12 });
    const auth = { Authorization: `Bearer ${reg.body.data.token}` };
    const code = (await request(app).post('/api/telegram/link-code').set(auth)).body.data.code;
    expect((await bot(chatId).post('/api/bot/link', { code })).status).toBe(200);
    return auth;
  }

  /** A words exam in the student's chat, in `direction` (1 en-he, 2 he-en). */
  async function startExam(direction = '1') {
    await bot(studentChat).post('/api/bot/session/start');
    await bot(studentChat).post('/api/bot/session/answer', { text: '1' });
    return (await bot(studentChat).post('/api/bot/session/answer', { text: direction })).body.data;
  }

  beforeAll(async () => {
    await resetDatabase();
    await linkedAccount('word-reviewer', adminChat);
    student = await linkedAccount('word-student', studentChat);
    studentId = (await db.findOne('users', { name: 'word-student' })).id;
  });
  afterAll(shutdownDatabase);

  test('the web quiz reports a word; it is hidden from new quizzes and wrong options', async () => {
    const word = words().find(w => w.difficulty_level === 1);
    const res = await webReport({ wordId: word.id, reason: 'wrong_translation' });
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ reportId: expect.any(String), duplicate: false });
    const stored = await db.findById('word_reports', res.body.data.reportId);
    expect(stored).toMatchObject({
      word_id: word.id, user_id: studentId, reason: 'wrong_translation', source: 'web', status: 'open',
      snapshot: { english: word.english_word, hebrew: word.hebrew_translation }
    });
    expect((await webReport({ wordId: word.id, reason: 'other' })).body.data.duplicate).toBe(true);

    const picked = await VocabularyWord.findByDifficultyRange(1, 3, [], Infinity);
    expect(picked.some(w => w.id === word.id)).toBe(false);
    const neighbour = words().find(w => w.difficulty_level === word.difficulty_level && w.id !== word.id);
    for (let i = 0; i < 20; i++) {
      const wrong = await VocabularyWord.getRandomWrongOptions(neighbour.id, neighbour.difficulty_level, 3);
      expect(wrong.some(w => w.id === word.id)).toBe(false);
    }
    // Still found by id: an open quiz grades it.
    expect((await VocabularyWord.findById(word.id)).id).toBe(word.id);
  });

  test('rejects a bad reason, an unknown word, and both or neither ids', async () => {
    const word = words()[5];
    expect((await webReport({ wordId: word.id, reason: 'unclear' })).status).toBe(400);
    expect((await webReport({ wordId: 'no-such-word', reason: 'other' })).status).toBe(404);
    expect((await webReport({ reason: 'other' })).status).toBe(400);
    expect((await webReport({ wordId: word.id, exerciseId: 'x', reason: 'other' })).status).toBe(400);
  });

  test('/report in the bot words exam: word reasons, the word answered last, the exam goes on', async () => {
    // Nothing in front of the student yet.
    expect((await bot(studentChat).post('/api/bot/report')).body.code).toBe('no_session');

    const started = await startExam('2'); // he-en: the English is the answer
    const ask = (await bot(studentChat).post('/api/bot/report')).body.data;
    expect(ask).toEqual({ ask: true, target: 'word', reasons: ['wrong_translation', 'missing_translation', 'bad_sentence', 'other'] });
    expect((await bot(studentChat).post('/api/bot/report', { reason: 'unclear' })).status).toBe(400);

    // Unanswered: the current word, shown as the exam shows it (the Hebrew, not the answer).
    let res = (await bot(studentChat).post('/api/bot/report', { reason: 'bad_sentence' })).body.data;
    expect(res).toMatchObject({ kind: 'vocab', reported: true, duplicate: false, reportedWord: started.word.prompt, active: true });
    const current = await db.findOne('word_reports', { word_id: started.word.id });
    expect(current).toMatchObject({ source: 'bot', direction: 'he-en', given: null });

    // After an answer, the answered word, with the student's answer.
    await bot(studentChat).post('/api/bot/session/answer', { text: 'my guess' });
    const status = (await bot(studentChat).get('/api/bot/session/status')).body.data;
    res = (await bot(studentChat).post('/api/bot/report', { reason: 'missing_translation' })).body.data;
    expect(res).toMatchObject({ reported: true, duplicate: true, active: true });
    expect((await bot(studentChat).get('/api/bot/session/status')).body.data.word).toEqual(status.word);

    // After the exam ends, its last word can still be reported.
    await bot(studentChat).post('/api/bot/session/end');
    expect((await bot(studentChat).post('/api/bot/report')).body.data.target).toBe('word');
  });

  test('a lesson in front of the student makes /report a question report', async () => {
    const started = await bot(studentChat).post('/api/bot/exercise/start', { subject: 'english' });
    expect(started.status).toBe(200);
    expect((await bot(studentChat).post('/api/bot/report')).body.data.target).toBe('question');
    const res = await bot(studentChat).post('/api/bot/report', { reason: 'unclear' });
    expect(res.body.data).toMatchObject({ kind: 'exercise', reported: true, reportedNumber: 1 });
    await bot(studentChat).post('/api/bot/session/end');
  });

  test('the word change is validated', () => {
    expect(invalidWordChange({ hebrew_translation: 'גדול / ענק', sentence_en: 'A big dog.' })).toBeNull();
    expect(invalidWordChange({ hebrew_translation: 'גדול' })).toBeNull();
    expect(invalidWordChange({ hebrew_translation: '  ' })).toMatch(/empty/);
    expect(invalidWordChange({ hebrew_translation: 'big' })).toMatch(/Hebrew/);
    expect(invalidWordChange({ hebrew_translation: 'גדול / big' })).toMatch(/Hebrew/);
    expect(invalidWordChange({ hebrew_translation: 'גדול //' })).toMatch(/alternative/);
    expect(invalidWordChange({ hebrew_translation: 'גדול', sentence_en: 'כלב גדול' })).toMatch(/English/);
    expect(invalidWordChange({ hebrew_translation: 'גדול', sentence_en: 'x'.repeat(301) })).toMatch(/long/);
    expect(invalidWordChange({ hebrew_translation: 'גדול', english_alternatives: ['large', 'huge'] })).toBeNull();
    expect(invalidWordChange({ hebrew_translation: 'גדול', english_alternatives: ['גדול'] })).toMatch(/English/);
    expect(invalidWordChange({ hebrew_translation: 'גדול', english_alternatives: ['a', 'b', 'c', 'd', 'e', 'f'] })).toMatch(/at most/);
    expect(invalidWordChange({ hebrew_translation: 'גדול', english_alternatives: 'large' })).toMatch(/at most/);
  });

  test('/review lists words with questions; a change is live, keep restores', async () => {
    const queue = (await bot(adminChat).get('/api/bot/review/queue')).body.data;
    const wordItems = queue.items.filter(i => i.kind === 'word');
    expect(wordItems.length).toBe(2);
    expect(queue.items.some(i => i.kind === 'question')).toBe(true);
    const [first, second] = wordItems;
    expect(first.key).toBe(`word:${first.wordId}`);
    expect(first.word).toMatchObject({ english: expect.any(String), hebrew: expect.any(String) });
    expect(first.reports[0]).toMatchObject({ reason: 'wrong_translation', source: 'web' });

    const decide = (body) => bot(adminChat).post('/api/bot/review/decide', body);
    const bad = await decide({ key: first.key, decision: 'change', change: { hebrew_translation: 'wrong' } });
    expect(bad.body).toMatchObject({ code: 'invalid_change' });
    expect((await decide({ key: 'word:nope', decision: 'keep' })).status).toBe(404);

    const ok = await decide({ key: first.key, decision: 'change', change: { hebrew_translation: 'תרגום מתוקן / חלופה', sentence_en: 'A fixed sentence.' } });
    expect(ok.body.data).toMatchObject({ decided: true, decision: 'change', closed: 1 });
    const fixed = await VocabularyWord.findById(first.wordId);
    expect(fixed).toMatchObject({ hebrew_translation: 'תרגום מתוקן / חלופה', sentence_en: 'A fixed sentence.' });
    const served = await VocabularyWord.findByDifficultyRange(1, 10, [], Infinity);
    expect(served.find(w => w.id === first.wordId).hebrew_translation).toBe('תרגום מתוקן / חלופה');
    expect((await db.findOne('word_reports', { word_id: first.wordId })).status).toBe('decided');

    // Through the review session: keep restores the second word.
    const start = (await bot(adminChat).post('/api/bot/review/start', { mode: 'manual' })).body.data;
    let data = start;
    while (data.item && data.item.key !== second.key) {
      data = (await bot(adminChat).post('/api/bot/review/act', { action: 'skip' })).body.data;
    }
    expect(data.item).toMatchObject({ kind: 'word', key: second.key });
    const kept = (await bot(adminChat).post('/api/bot/review/act', { action: 'keep' })).body.data;
    expect(kept.decided).toMatchObject({ key: second.key, decision: 'keep', closed: 1 });
    const back = await VocabularyWord.findByDifficultyRange(1, 10, [], Infinity);
    expect(back.some(w => w.id === second.wordId)).toBe(true);
  });

  test('an English alternative is accepted in Hebrew→English; a new sentence drops the old Hebrew one', async () => {
    const BotSession = require('../src/models/BotSession');
    const word = words().find(w => w.difficulty_level === 2 && /^[a-z]+$/.test(w.english_word));
    await webReport({ wordId: word.id, reason: 'wrong_translation' });
    const change = { hebrew_translation: word.hebrew_translation, sentence_en: 'A brand new sentence.', english_alternatives: ['zzqword'] };
    const res = await bot(adminChat).post('/api/bot/review/decide', { key: `word:${word.id}`, decision: 'change', change });
    expect(res.body.data).toMatchObject({ decided: true, decision: 'change' });
    expect(await VocabularyWord.findById(word.id)).toMatchObject({
      english_alternatives: ['zzqword'], sentence_en: 'A brand new sentence.', sentence_he: null
    });

    // A Hebrew→English exam on that word accepts the reviewed alternative.
    const studentUser = await db.findOne('users', { name: 'word-student' });
    const created = await BotSession.create({ userId: studentUser.id, chatId: studentChat });
    await BotSession.update(created.id, {
      level: 2, direction: 'he-en', status: 'active', setup_step: null, word_ids: [word.id], queue: [word.id], round_size: 1
    });
    const answer = (await bot(studentChat).post('/api/bot/session/answer', { text: 'zzqword' })).body.data;
    expect(answer).toMatchObject({ correct: true, judged: false });
  });

  test('a removed word stays out', async () => {
    const word = words()[10];
    await webReport({ wordId: word.id, reason: 'other', note: 'not a word' });
    const res = await bot(adminChat).post('/api/bot/review/decide', { key: `word:${word.id}`, decision: 'remove' });
    expect(res.body.data).toMatchObject({ decision: 'remove', closed: 1 });
    const picked = await VocabularyWord.findByDifficultyRange(1, 10, [], Infinity);
    expect(picked.some(w => w.id === word.id)).toBe(false);
  });
});
