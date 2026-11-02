const BotSession = require('../../models/BotSession');
const { parseNumber } = require('../../utils/answers');
const { isEndCommand } = require('../../utils/botWords');
const { ltr } = require('../../utils/bidi');
const { shuffleArray } = require('../../utils/shuffle');

/**
 * Drills in the chat bot (session kind 'drill'), in two variants:
 * - /kefel, the multiplication table (the default): every start makes ten
 *   new questions, five products and five quotients of different facts with
 *   factors 2–10 (×1 teaches nothing), and no division starts from a number
 *   that answers one of the round's products, so no question gives another
 *   one away. The student types the number.
 * - /hiluk, division with a remainder and long division (divisionDrill.js):
 *   the student types the quotient and the remainder.
 * Text that is not an answer asks the same question again and counts
 * nothing. Only the session's own counts change: no exercise result,
 * points, progress or mistakes, on purpose; /usage counts the answered
 * questions as practice. Replies are plain data; the bot turns them into text.
 */
const SIZE = 10;
const LOW = 2;
const HIGH = 10;

/** Factors in a random order: 7 × 8 or 8 × 7. */
const anyOrder = ([p, q]) => (Math.random() < 0.5 ? [p, q] : [q, p]);

/**
 * Ten questions { text: 'a × b' | 'c ÷ a', answer }, shuffled: five products
 * and five quotients of ten different facts. A quotient shows its dividend,
 * so its fact's product must not be one of the products asked (4 × 6 and
 * 24 ÷ 3 would show 24).
 */
function makeQuestions() {
  const facts = [];
  for (let a = LOW; a <= HIGH; a++) {
    for (let b = a; b <= HIGH; b++) facts.push([a, b]);
  }
  const shuffled = shuffleArray(facts);
  const products = shuffled.slice(0, SIZE / 2);
  const asked = new Set(products.map(([a, b]) => a * b));
  const quotients = shuffled.slice(SIZE / 2).filter(([a, b]) => !asked.has(a * b)).slice(0, SIZE / 2);
  return shuffleArray([
    ...products.map(anyOrder).map(([a, b]) => ({ text: `${a} × ${b}`, answer: a * b })),
    ...quotients.map(anyOrder).map(([a, b]) => ({ text: `${a * b} ÷ ${a}`, answer: b }))
  ]);
}

/** The multiplication table: a typed number, right or wrong. */
const kefel = {
  makeQuestions,
  read: (text) => parseNumber(String(text || '')),
  judge: (question, value) => (value === question.answer ? 'correct' : 'wrong'),
  /** The whole fact, for the right answer and the summary: "7 × 8 = 56". */
  fact: (question) => ltr(`${question.text} = ${question.answer}`),
  check: () => undefined,
  hint: () => ({}),
};
const VARIANTS = { kefel, hiluk: require('./divisionDrill') };
const variantOf = (session) => (VARIANTS[session.variant] ? session.variant : 'kefel');

const questionView = (session) => ({
  number: session.index + 1,
  total: session.questions.length,
  // Typed, not multiple choice: the bot sends any text here as an answer.
  type: 'number',
  variant: variantOf(session),
  text: ltr(`${session.questions[session.index].text} = ?`)
});

/** The chat's open drill, or null. A drill with every question answered is over, even if closing it failed. */
async function openDrill(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  if (!session || BotSession.kindOf(session) !== 'drill') return null;
  if (session.index >= session.questions.length) {
    await BotSession.end(session.id, 'completed');
    return null;
  }
  return session;
}

class DrillSession {
  /** Ten new questions of a variant ('kefel' or 'hiluk'); any open session is replaced. */
  static async start(user, chatId, { variant = 'kefel' } = {}) {
    if (!VARIANTS[variant]) return { error: 'bad_variant' };
    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.createDrill({ userId: user.id, chatId, variant, questions: VARIANTS[variant].makeQuestions() });
    return { kind: 'drill', variant, sessionId: session.id, question: questionView(session) };
  }

  /**
   * A typed answer: the verdict, then the next question or, after the tenth,
   * the count. A /hiluk answer with the right quotient and no remainder
   * (when there is one) asks again for the remainder and counts nothing.
   */
  static async answer(user, chatId, text) {
    const session = await openDrill(chatId);
    if (!session) return { error: 'no_session' };
    if (isEndCommand(text)) return this.end(user, chatId);
    const variant = variantOf(session);
    const V = VARIANTS[variant];
    const given = V.read(text);
    if (given === null) return { kind: 'drill', variant, notNumber: true, question: questionView(session) };

    const current = session.questions[session.index];
    const judged = V.judge(current, given);
    if (judged === 'missingRemainder') return { kind: 'drill', variant, missingRemainder: true, question: questionView(session) };
    const correct = judged === 'correct';
    // Wrong answers so far and in a row, for the bot's encouraging line.
    const wrongCount = (session.wrong_count || 0) + (correct ? 0 : 1);
    const wrongStreak = correct ? 0 : (session.wrong_streak || 0) + 1;
    const verdict = {
      correct, given: String(text).trim(), correctAnswer: current.answer, fact: V.fact(current), wrongCount, wrongStreak,
      ...(correct ? {} : { check: V.check(current), ...V.hint(current, given) })
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
      return { kind: 'drill', variant, verdict, question: questionView(next), done: false };
    }
    // The last answer and the end in one write: no moment with an open drill past its questions.
    await BotSession.end(session.id, 'completed', updates);
    return {
      kind: 'drill',
      variant,
      verdict,
      done: true,
      result: {
        correct: updates.correct_count,
        total: session.questions.length,
        missed: updates.missed.map(i => V.fact(session.questions[i]))
      }
    };
  }

  /** Stop now; the counts so far are shown and nothing is recorded. */
  static async end(user, chatId) {
    const session = await openDrill(chatId);
    if (!session) return { error: 'no_session' };
    await BotSession.end(session.id, 'ended');
    return {
      kind: 'drill', variant: variantOf(session), done: true, ended: true,
      answered: session.index, correct: session.correct_count || 0, total: session.questions.length
    };
  }

  static async status(chatId) {
    const session = await openDrill(chatId);
    if (!session) return { active: false };
    return { active: true, kind: 'drill', variant: variantOf(session), sessionId: session.id, question: questionView(session) };
  }
}

module.exports = DrillSession;
module.exports.makeQuestions = makeQuestions;
