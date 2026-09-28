const BotSession = require('../../models/BotSession');
const BotService = require('../bot.service');
const ExerciseSession = require('./exerciseSession');

/**
 * The service that owns the chat's open session: vocabulary (BotService) or
 * lesson exercises (ExerciseSession). With no open session, vocabulary
 * answers the "no session" reply as before.
 */
async function serviceFor(chatId) {
  const session = await BotSession.findOpenByChat(chatId);
  return BotSession.kindOf(session) === 'exercise' ? ExerciseSession : BotService;
}

module.exports = { serviceFor };
