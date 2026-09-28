const { validationResult } = require('express-validator');
const BotService = require('../services/bot.service');
const ExerciseSession = require('../services/bot/exerciseSession');
const { serviceFor } = require('../services/bot/sessionKinds');
const TelegramLink = require('../models/TelegramLink');

const ERROR_STATUS = {
  no_session: 404, not_enough_words: 409, lesson_not_found: 404, bad_subject: 400, all_done: 409, no_exercises: 409
};

function send(res, result) {
  if (result.error) {
    return res.status(ERROR_STATUS[result.error] || 400).json({ success: false, code: result.error });
  }
  res.json({ success: true, data: result });
}

function invalid(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ success: false, message: errors.array()[0].msg });
  return true;
}

/** Thin handlers for /api/bot: validate, call the service, answer. */
class BotController {
  static async link(req, res) {
    if (invalid(req, res)) return;
    const link = await TelegramLink.linkChat(req.chatId, req.body.code);
    if (!link) return res.status(400).json({ success: false, code: 'bad_code', message: 'Code is wrong or expired' });
    res.json({ success: true, data: { linked: true } });
  }

  static async start(req, res) {
    send(res, await BotService.start(req.user, req.chatId));
  }

  // answer, end and status go to the service of the chat's open session.
  static async answer(req, res) {
    if (invalid(req, res)) return;
    send(res, await (await serviceFor(req.chatId)).answer(req.user, req.chatId, req.body.text));
  }

  static async end(req, res) {
    send(res, await (await serviceFor(req.chatId)).end(req.user, req.chatId));
  }

  static async status(req, res) {
    send(res, await (await serviceFor(req.chatId)).status(req.chatId));
  }

  static async startExercise(req, res) {
    if (invalid(req, res)) return;
    const { subject, lessonId, number, difficulty } = req.body;
    send(res, await ExerciseSession.start(req.user, req.chatId, { subject, lessonId, number, difficulty }));
  }

  static async listLessons(req, res) {
    if (invalid(req, res)) return;
    send(res, await ExerciseSession.listLessons(req.user, req.chatId, { subject: req.body.subject }));
  }
}

module.exports = BotController;
