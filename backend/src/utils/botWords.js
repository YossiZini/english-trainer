const { END_WORDS } = require('../config/bot');

/** True when a chat message asks to end the session: "end", "/end", "stop" … in any case. */
const isEndCommand = (text) => END_WORDS.includes(String(text || '').trim().toLowerCase());

/** Words that ask for help with the current question (a lesson's hint, a reading's hard words); never an answer. */
const HINT_WORDS = ['?', '？', 'hint', '/hint'];

const isHintCommand = (text) => HINT_WORDS.includes(String(text || '').trim().toLowerCase());

module.exports = { isEndCommand, isHintCommand };
