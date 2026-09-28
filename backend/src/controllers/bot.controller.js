const { validationResult } = require('express-validator');
const BotService = require('../services/bot.service');
const TelegramLink = require('../models/TelegramLink');

const ERROR_STATUS = { no_session: 404, not_enough_words: 409 };

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

  static async answer(req, res) {
    if (invalid(req, res)) return;
    const { text, judge = false, verdict = null } = req.body;
    send(res, await BotService.answer(req.user, req.chatId, text, { judge: judge === true, verdict }));
  }

  static async end(req, res) {
    send(res, await BotService.end(req.user, req.chatId));
  }

  static async status(req, res) {
    send(res, await BotService.status(req.chatId));
  }
}

module.exports = BotController;
