const BotSession = require('../../models/BotSession');
const ReviewService = require('../review.service');

/**
 * The admin's review of reported questions in the chat bot (/review manual
 * or /review auto), as a bot session of kind 'review' so the bot keeps no
 * state: the session holds the question being reviewed, the review agent's
 * pending proposal (written by the bot) and the questions skipped this time.
 * The agent runs in the bot; every decision still goes through
 * ReviewService.decide, which validates it.
 */
const ACTIONS = ['approve', 'keep', 'remove', 'skip'];
const PROPOSAL_DECISIONS = ['keep', 'change', 'remove'];

/** The next question under review that was not skipped in this session, and how many remain. */
async function nextItem(session) {
  const { items } = await ReviewService.queue();
  const skipped = new Set(session.skipped || []);
  const left = items.filter(i => !skipped.has(i.exerciseId));
  return { item: left[0] || null, remaining: left.length };
}

function view(session, item, remaining, extra = {}) {
  return {
    kind: 'review', mode: session.mode, sessionId: session.id,
    item, proposal: session.proposal || null, remaining,
    done: !item, counts: session.counts, ...extra
  };
}

async function moveOn(session, extra) {
  const { item, remaining } = await nextItem(session);
  const updated = await BotSession.update(session.id, { current: item ? item.exerciseId : null, proposal: null });
  if (!item) await BotSession.end(session.id, 'completed');
  return view(updated, item, remaining, extra);
}

async function openReview(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  return session && BotSession.kindOf(session) === 'review' ? session : null;
}

class ReviewSession {
  /** Start reviewing (manual or auto); an open session of any kind is replaced. */
  static async start(user, chatId, mode) {
    const open = await BotSession.findOpenByChat(chatId);
    if (open) await BotSession.end(open.id, 'replaced');
    const session = await BotSession.createReview({ userId: user.id, chatId, mode });
    return moveOn(session);
  }

  /** The bot stores the agent's proposal for the current question. */
  static async propose(user, chatId, proposal) {
    const session = await openReview(chatId);
    if (!session || !session.current) return { error: 'no_session' };
    if (!proposal || !PROPOSAL_DECISIONS.includes(proposal.decision)) return { error: 'bad_proposal' };
    const updated = await BotSession.update(session.id, { proposal });
    const { item, remaining } = await nextItem(updated);
    return view(updated, item, remaining);
  }

  /** approve (the pending proposal), keep, remove or skip the current question. */
  static async act(user, chatId, action) {
    const session = await openReview(chatId);
    if (!session || !session.current) return { error: 'no_session' };
    if (!ACTIONS.includes(action)) return { error: 'bad_action' };
    const counts = { ...(session.counts || {}) };
    const bump = (k) => { counts[k] = (counts[k] || 0) + 1; };
    if (action === 'skip') {
      const updated = await BotSession.update(session.id, { skipped: [...(session.skipped || []), session.current], counts: (bump('skip'), counts) });
      return moveOn(updated, { skipped: session.current });
    }
    let decision = action;
    let change = null;
    if (action === 'approve') {
      if (!session.proposal) return { error: 'no_proposal' };
      decision = session.proposal.decision;
      change = session.proposal.change || null;
    }
    const result = await ReviewService.decide(session.current, decision, change);
    if (result.error) {
      // An invalid change stays pending: the admin can correct it or decide otherwise.
      const { item, remaining } = await nextItem(session);
      return view(session, item, remaining, { rejected: result.reason || result.error });
    }
    bump(decision);
    const updated = await BotSession.update(session.id, { counts });
    return moveOn(updated, { decided: { exerciseId: session.current, decision, closed: result.closed } });
  }

  // Generic session routes (sessionKinds): status and end work for a review too.
  static async status(chatId) {
    const session = await openReview(chatId);
    if (!session) return { active: false };
    const { item, remaining } = await nextItem(session);
    return { active: true, ...view(session, item, remaining) };
  }

  /** A typed message during a review is the admin's correction, handled by the bot's agent. */
  static async answer(user, chatId) {
    const status = await this.status(chatId);
    return status.active ? { ...status, needsBot: true } : { error: 'no_session' };
  }

  static async end(user, chatId) {
    const session = await openReview(chatId);
    if (!session) return { error: 'no_session' };
    await BotSession.end(session.id, 'ended');
    return { kind: 'review', done: true, ended: true, counts: session.counts || {} };
  }
}

module.exports = ReviewSession;
