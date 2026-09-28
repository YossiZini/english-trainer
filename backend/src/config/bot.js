/**
 * Settings of the Telegram bot API (/api/bot). The bot service authenticates
 * with BOT_API_KEY, injected from Secret Manager in production; the
 * development fallback never runs in production.
 */
// Without a key in production the bot routes stay switched off (503) rather
// than falling back to the development key.
const production = process.env.NODE_ENV === 'production';
const BOT_API_KEY = process.env.BOT_API_KEY || (production ? null : 'dev_bot_key');

const toInt = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

module.exports = {
  BOT_API_KEY,
  /** False when no key is configured: every bot route answers 503. */
  BOT_ENABLED: !!BOT_API_KEY,
  /** Words per session. */
  SESSION_SIZE: toInt(process.env.BOT_SESSION_SIZE, 20),
  /** Messages a chat may send per minute. */
  CHAT_RATE_PER_MINUTE: toInt(process.env.BOT_CHAT_RATE_PER_MINUTE, 60),
  /** Bot messages a student may send per day. */
  DAILY_MESSAGE_CAP: toInt(process.env.BOT_DAILY_MESSAGE_CAP, 300),
  /** Minutes a link code stays valid. */
  LINK_CODE_MINUTES: toInt(process.env.BOT_LINK_CODE_MINUTES, 10),
  /** Gemini second opinion on a Hebrew answer that misses the dictionary. */
  JUDGE_ANSWERS: (process.env.JUDGE_ANSWERS || 'true').toLowerCase() !== 'false',
  JUDGE_MODEL: process.env.JUDGE_MODEL || 'gemini-2.5-flash',
  JUDGE_LOCATION: process.env.GOOGLE_CLOUD_LOCATION || 'europe-west1',
  JUDGE_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || null,
  JUDGE_MAX_OUTPUT_TOKENS: toInt(process.env.JUDGE_MAX_OUTPUT_TOKENS, 30),
  JUDGE_TIMEOUT_MS: toInt(process.env.JUDGE_TIMEOUT_MS, 8000),
  /** Answer checks a student may use per day. */
  DAILY_JUDGE_CAP: toInt(process.env.BOT_DAILY_JUDGE_CAP, 100),
  /** Words the student can type to end a session. */
  END_WORDS: ['end', 'stop', 'quit', 'סיים', 'סיום', 'סיימתי', 'די', 'עצור'],
  /** Words that ask for the current word's example sentence (not an answer). */
  EXAMPLE_WORDS: ['?', '？', 'דוגמה', 'דוגמא', 'משפט', 'example', 'hint']
};
