const { END_WORDS } = require('../config/bot');

/** True when a chat message asks to end the session: "end", "/end", "stop" … in any case. */
const isEndCommand = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

module.exports = { isEndCommand };
