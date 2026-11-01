const BotSession = require('../../models/BotSession');
const BotService = require('../bot.service');
const ExerciseSession = require('./exerciseSession');

/**
 * The service that owns the chat's open session: vocabulary (BotService),
 * lesson exercises (ExerciseSession), the admin's review (ReviewSession),
 * the /kefel drill (DrillSession) or an /unseen reading (UnseenBotSession).
 * With no open session, vocabulary answers the "no session" reply as before.
 */
async function serviceFor(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  const kind = BotSession.kindOf(session);
  if (kind === 'exercise') return ExerciseSession;
  if (kind === 'review') return require('./reviewSession');
  if (kind === 'drill') return require('./drillSession');
  if (kind === 'unseen') return require('./unseenSession');
  return BotService;
}

/**
 * The chat's status: the open session's, or with none open, which kind
 * just ended with its last answer ({ justEnded: kind }), so the bot can
 * tell that answer's twin (a double tap) from a new message.
 */
async function statusOf(chatId, user) {
  const status = await (await serviceFor(chatId)).status(chatId);
  if (status.active) return status;
  const last = await BotSession.findLatest(chatId, user.id, s => s.status === 'ended');
  return BotSession.justCompleted(last) ? { ...status, justEnded: BotSession.kindOf(last) } : status;
}

module.exports = { serviceFor, statusOf };
