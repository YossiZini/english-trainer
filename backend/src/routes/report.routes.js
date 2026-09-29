const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth.middleware');
const ReportService = require('../services/report.service');

const router = express.Router();
router.use(authenticate);

const STATUS = { bad_reason: 400, exercise_not_found: 404, word_not_found: 404, report_cap: 429 };
const MESSAGES = {
  report_cap: 'הגעת למכסת הדיווחים להיום. תודה על העזרה, נמשיך מחר!'
};

/** A student reports a question or a word: { exerciseId | wordId, reason, note? }. */
router.post('/', [
  body('exerciseId').optional().isString().notEmpty().isLength({ max: 100 }),
  body('wordId').optional().isString().notEmpty().isLength({ max: 100 }),
  body().custom(b => !!b.exerciseId !== !!b.wordId).withMessage('exerciseId or wordId is required'),
  body('reason').isString().isLength({ max: 30 }),
  body('note').optional({ nullable: true }).isString().isLength({ max: 500 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { exerciseId, wordId, reason, note } = req.body;
    const result = wordId
      ? await ReportService.reportWord(req.userId, { wordId, reason, note, source: 'web' })
      : await ReportService.report(req.userId, { exerciseId, reason, note, source: 'web' });
    if (result.error) {
      return res.status(STATUS[result.error] || 400).json({ success: false, code: result.error, message: MESSAGES[result.error] });
    }
    res.status(result.duplicate ? 200 : 201).json({ success: true, data: { reportId: result.reportId, duplicate: result.duplicate } });
  } catch (e) { next(e); }
});

module.exports = router;
