const crypto = require('crypto');
const { BOT_API_KEY } = require('../config/bot');
const TelegramLink = require('../models/TelegramLink');
const User = require('../models/User');

const sameKey = (given) => {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(BOT_API_KEY);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/** The bot service must present the shared key in X-Bot-Key. */
function requireBotKey(req, res, next) {
  if (!sameKey(req.get('x-bot-key'))) {
    return res.status(401).json({ success: false, message: 'Invalid bot key' });
  }
  const chatId = req.body?.chatId ?? req.query?.chatId;
  if (chatId === undefined || chatId === null || String(chatId).trim() === '') {
    return res.status(400).json({ success: false, message: 'chatId is required' });
  }
  req.chatId = String(chatId);
  next();
}

/** The chat must be linked to a student; the request then acts as that student. */
async function requireLinkedChat(req, res, next) {
  try {
    const link = await TelegramLink.findByChat(req.chatId);
    const user = link && link.chat_id ? await User.findById(link.user_id) : null;
    if (!user) {
      return res.status(403).json({ success: false, code: 'not_linked', message: 'Chat is not linked to a student' });
    }
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Bot auth error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}

module.exports = { requireBotKey, requireLinkedChat };
