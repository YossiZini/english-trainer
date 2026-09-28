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

/**
 * POST /api/bot/exercise/start { chatId, subject | lessonId } — a lesson's
 * exercises: the subject's next lesson, or the given lesson. Answers and the
 * end go through /session/answer and /session/end like vocabulary.
 */
router.post('/exercise/start', [
  body('subject').optional().isIn(['english', 'math']).withMessage('subject must be english or math'),
  body('lessonId').optional().isString().isLength({ min: 1, max: 64 }),
  body().custom(b => !!(b.subject || b.lessonId)).withMessage('subject or lessonId is required')
], BotController.startExercise);

module.exports = router;
