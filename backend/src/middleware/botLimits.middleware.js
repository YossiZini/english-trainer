const BotUsage = require('../models/BotUsage');
const { CHAT_RATE_PER_MINUTE, DAILY_MESSAGE_CAP } = require('../config/bot');

/**
 * Two caps on bot traffic, both answered with 429 and a Hebrew message:
 * a per-chat sliding window (in memory, protects the API from a chatty
 * client) and a per-student daily counter in Firestore (durable, the one
 * that bounds the model bill).
 */

const windows = new Map(); // chatId -> [timestamps in the last minute]

function chatAllowed(chatId, now = Date.now()) {
  const recent = (windows.get(chatId) || []).filter(t => now - t < 60 * 1000);
  if (recent.length >= CHAT_RATE_PER_MINUTE) { windows.set(chatId, recent); return false; }
  recent.push(now);
  windows.set(chatId, recent);
  if (windows.size > 10000) windows.delete(windows.keys().next().value);
  return true;
}

function tooMany(res, message) {
  res.status(429).json({ success: false, code: 'rate_limited', message });
}

function chatRateLimit(req, res, next) {
  if (!chatAllowed(req.chatId)) return tooMany(res, 'לאט יותר, יותר מדי הודעות בדקה.');
  next();
}

async function dailyCap(req, res, next) {
  try {
    const count = await BotUsage.countMessage(req.userId);
    if (count > DAILY_MESSAGE_CAP) return tooMany(res, 'הגעת למכסת ההודעות היומית. נמשיך מחר!');
    next();
  } catch (e) { next(e); }
}

module.exports = { chatRateLimit, dailyCap, chatAllowed, _windows: windows };
