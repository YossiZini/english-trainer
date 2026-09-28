const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const TelegramLink = require('../models/TelegramLink');

const router = express.Router();
router.use(authenticate);

/** Student side of the Telegram link: get a code, see the state, unlink. */
router.post('/link-code', async (req, res, next) => {
  try {
    res.json({ success: true, data: await TelegramLink.issueCode(req.userId) });
  } catch (e) { next(e); }
});

router.get('/link', async (req, res, next) => {
  try {
    const link = await TelegramLink.findByUser(req.userId);
    res.json({ success: true, data: { linked: !!(link && link.chat_id), linkedAt: link?.linked_at || null } });
  } catch (e) { next(e); }
});

router.delete('/link', async (req, res, next) => {
  try {
    res.json({ success: true, data: { removed: await TelegramLink.unlink(req.userId) } });
  } catch (e) { next(e); }
});

module.exports = router;
