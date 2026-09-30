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

/**
 * POST /api/bot/report { chatId, reason? } — /report for whatever is in front
 * of the student: the word of the words exam or the lesson question (open,
 * or ended within the hour). Without a reason: { ask, target: word|question,
 * reasons }; with one: the report is filed.
 */
router.post('/report', [
  body('reason').optional({ nullable: true }).isString().isLength({ max: 30 })
], BotController.report);

/**
 * GET /api/bot/usage — /usage: every student's participation (active days,
 * lessons, words, reading; no scores) in the last 7 and 30 days, for any
 * linked chat. Cached for 10 minutes.
 */
router.get('/usage', BotController.usage);

/**
 * Review of reported questions and words, for every linked student:
 * GET /api/bot/review/queue — questions under review with their reports;
 * POST /api/bot/review/decide { chatId, key (or exerciseId), decision: keep|change|remove, change? };
 * a word's key is "word:<id>".
 */
router.get('/review/queue', BotController.reviewQueue);
// The bot takes one unit of the student's daily review cap before each call to the review agent.
router.post('/review/reserve', BotController.reviewReserve);
router.post('/review/start', [
  body('mode').isIn(['manual', 'auto']).withMessage('mode must be manual or auto')
], BotController.reviewStart);
router.post('/review/proposal', [body('proposal').isObject()], BotController.reviewPropose);
router.post('/review/act', [
  body('action').isIn(['approve', 'keep', 'remove', 'skip']).withMessage('action must be approve, keep, remove or skip')
], BotController.reviewAct);
router.post('/review/decide', [
  body('key').optional().isString().isLength({ min: 1, max: 110 }),
  body('exerciseId').optional().isString().isLength({ min: 1, max: 100 }),
  body().custom(b => !!(b.key || b.exerciseId)).withMessage('key or exerciseId is required'),
  body('decision').isIn(['keep', 'change', 'remove']).withMessage('decision must be keep, change or remove'),
  body('change').optional({ nullable: true }).isObject()
], BotController.reviewDecide);

module.exports = router;
