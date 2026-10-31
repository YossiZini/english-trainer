const BotSession = require('../../models/BotSession');
const { parseNumber } = require('../../utils/answers');
const { END_WORDS } = require('../../config/bot');
const { shuffleArray } = require('../../utils/shuffle');

/**
 * /kefel in the chat bot: a one-minute drill of the multiplication table
 * (session kind 'drill'). Every start makes ten new questions: five
 * products and five quotients of different facts with factors 2–10 (×1
 * teaches nothing), so a division never gives away a product's answer. The
 * student types the number; text that is not a number asks the same
 * question again and counts nothing. Only the session's own counts change:
 * no exercise result, points, progress or mistakes, on purpose.
 * Replies are plain data; the bot turns them into text.
 */
const SIZE = 10;
const LOW = 2;
const HIGH = 10;

/** An expression kept left to right inside Hebrew text (LRI … PDI), as in the math seeds. */
const ltr = (s) => `⁦${s}⁩`;
const isEnd = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

/** Ten questions { text: 'a × b' | 'c ÷ a', answer }: different facts, five of each, shuffled. */
function makeQuestions() {
  const facts = [];
  for (let a = LOW; a <= HIGH; a++) {
    for (let b = a; b <= HIGH; b++) facts.push([a, b]);
  }
  const questions = shuffleArray(facts).slice(0, SIZE).map(([p, q], i) => {
    const [a, b] = Math.random() < 0.5 ? [p, q] : [q, p];
    return i < SIZE / 2
      ? { text: `${a} × ${b}`, answer: a * b }
      : { text: `${a * b} ÷ ${a}`, answer: b };
  });
  return shuffleArray(questions);
}

const questionView = (session) => ({
  number: session.index + 1,
  total: session.questions.length,
  // Typed, not multiple choice: the bot sends any text here as an answer.
  type: 'number',
  text: ltr(`${session.questions[session.index].text} = ?`)
});

/** The whole fact, for the right answer and the summary: "7 × 8 = 56". */
const factOf = (question) => ltr(`${question.text} = ${question.answer}`);

async function openDrill(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  return session && BotSession.kindOf(session) === 'drill' ? session : null;
}

class DrillSession {
  /** Ten new questions; any open session is replaced. */
  static async start(user, chatId) {
    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.createDrill({ userId: user.id, chatId, questions: makeQuestions() });
    return { kind: 'drill', sessionId: session.id, question: questionView(session) };
  }

  /** A typed number: the verdict, then the next question or, after the tenth, the count. */
  static async answer(user, chatId, text) {
    const session = await openDrill(chatId);
    if (!session) return { error: 'no_session' };
    if (isEnd(text)) return this.end(user, chatId);
    const value = parseNumber(String(text || ''));
    if (value === null) return { kind: 'drill', notNumber: true, question: questionView(session) };

    const current = session.questions[session.index];
    const correct = value === current.answer;
    // Wrong answers so far and in a row, for the bot's encouraging line.
    const wrongCount = (session.wrong_count || 0) + (correct ? 0 : 1);
    const wrongStreak = correct ? 0 : (session.wrong_streak || 0) + 1;
    const verdict = {
      correct, given: String(text).trim(), correctAnswer: current.answer, fact: factOf(current), wrongCount, wrongStreak
    };
    const updates = {
      index: session.index + 1,
      correct_count: (session.correct_count || 0) + (correct ? 1 : 0),
      wrong_count: wrongCount,
      wrong_streak: wrongStreak,
      missed: correct ? session.missed || [] : [...(session.missed || []), session.index]
    };
    if (updates.index < session.questions.length) {
      const next = await BotSession.update(session.id, updates);
      return { kind: 'drill', verdict, question: questionView(next), done: false };
    }
    await BotSession.update(session.id, updates);
    await BotSession.end(session.id, 'completed');
    return {
      kind: 'drill',
      verdict,
      done: true,
      result: {
        correct: updates.correct_count,
        total: session.questions.length,
        missed: updates.missed.map(i => factOf(session.questions[i]))
      }
    };
  }

  /** Stop now; the counts so far are shown and nothing is recorded. */
  static async end(user, chatId) {
    const session = await openDrill(chatId);
    if (!session) return { error: 'no_session' };
    await BotSession.end(session.id, 'ended');
    return {
      kind: 'drill', done: true, ended: true,
      answered: session.index, correct: session.correct_count || 0, total: session.questions.length
    };
  }

  static async status(chatId) {
    const session = await openDrill(chatId);
    if (!session) return { active: false };
    return { active: true, kind: 'drill', sessionId: session.id, question: questionView(session) };
  }
}

module.exports = DrillSession;
module.exports.makeQuestions = makeQuestions;
