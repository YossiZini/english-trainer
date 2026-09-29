const BotSession = require('../../models/BotSession');
const BotService = require('../bot.service');
const ExerciseSession = require('./exerciseSession');

/**
 * The service that owns the chat's open session: vocabulary (BotService),
 * lesson exercises (ExerciseSession) or the admin's review (ReviewSession). With no open session, vocabulary
 * answers the "no session" reply as before.
 */
async function serviceFor(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  const kind = BotSession.kindOf(session);
  if (kind === 'exercise') return ExerciseSession;
  if (kind === 'review') return require('./reviewSession');
  return BotService;
}

module.exports = { serviceFor };
