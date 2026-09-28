const express = require('express');
const { body } = require('express-validator');
const BotController = require('../controllers/bot.controller');
const { requireBotKey, requireLinkedChat } = require('../middleware/botAuth.middleware');
const { chatRateLimit, dailyCap } = require('../middleware/botLimits.middleware');

const router = express.Router();

// Every bot route needs the service key and a chat id.
router.use(requireBotKey);
router.use(chatRateLimit);

/** POST /api/bot/link { chatId, code } — bind the chat to the student who got the code. */
router.post('/link', [body('code').isString().isLength({ min: 6, max: 6 })], BotController.link);

// The session routes act on behalf of the linked student.
router.use(requireLinkedChat);
router.use(dailyCap);
router.post('/session/start', BotController.start);
router.post('/session/answer', [body('text').isString().notEmpty().isLength({ max: 200 })], BotController.answer);
router.post('/session/end', BotController.end);
router.get('/session/status', BotController.status);

module.exports = router;
