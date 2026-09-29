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
router.post('/session/switch', BotController.switchDirection);
router.get('/session/status', BotController.status);

/**
 * POST /api/bot/exercise/start { chatId, subject | lessonId | subject+number, difficulty? }
 * — a lesson's exercises: the subject's next lesson, the given lesson, or
 * the subject's lesson with that list number, at the progress-based level
 * unless difficulty (easy / medium / hard) is given. Answers and the
 * end go through /session/answer and /session/end like vocabulary.
 */
router.post('/exercise/start', [
  body('subject').optional().isIn(['english', 'math']).withMessage('subject must be english or math'),
  body('lessonId').optional().isString().isLength({ min: 1, max: 64 }),
  body('number').optional().isInt({ min: 1, max: 999 }),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('difficulty must be easy, medium or hard'),
  body().custom(b => !!(b.subject || b.lessonId)).withMessage('subject or lessonId is required'),
  body().custom(b => !b.number || !!b.subject).withMessage('number needs a subject')
], BotController.startExercise);

/**
 * POST /api/bot/exercise/lessons { chatId, subject } — the subject's lessons,
 * numbered, 10 per page; the student answers with a number ('עוד' / 'הקודם'
 * turn the page) through /session/answer.
 */
router.post('/exercise/lessons', [
  body('subject').isIn(['english', 'math']).withMessage('subject must be english or math')
], BotController.listLessons);

/**
 * POST /api/bot/exercise/report { chatId, reason } — report the question the
 * student answered last in the chat's lesson session (else the current one).
 */
router.post('/exercise/report', [
  body('reason').isIn(['wrong_answer', 'two_answers', 'unclear', 'other']).withMessage('unknown reason')
], BotController.reportQuestion);

module.exports = router;
