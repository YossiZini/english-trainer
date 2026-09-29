const overrideStore = require('./overrideStore');

/**
 * Live corrections over the bundled vocabulary (`word_overrides`, one
 * document per word id); see overrideStore. A change carries
 * { hebrew_translation, sentence_en }.
 */
module.exports = overrideStore('word_overrides');
