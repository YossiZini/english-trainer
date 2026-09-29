const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth.middleware');
const ReportService = require('../services/report.service');

const router = express.Router();
router.use(authenticate);

const STATUS = { bad_reason: 400, exercise_not_found: 404, report_cap: 429 };
const MESSAGES = {
  report_cap: 'הגעת למכסת הדיווחים להיום. תודה על העזרה, נמשיך מחר!'
};

/** A student reports a question: { exerciseId, reason, note? }. */
router.post('/', [
  body('exerciseId').isString().notEmpty().isLength({ max: 100 }),
  body('reason').isString().isLength({ max: 30 }),
  body('note').optional({ nullable: true }).isString().isLength({ max: 500 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { exerciseId, reason, note } = req.body;
    const result = await ReportService.report(req.userId, { exerciseId, reason, note, source: 'web' });
    if (result.error) {
      return res.status(STATUS[result.error] || 400).json({ success: false, code: result.error, message: MESSAGES[result.error] });
    }
    res.status(result.duplicate ? 200 : 201).json({ success: true, data: result });
  } catch (e) { next(e); }
});

module.exports = router;
