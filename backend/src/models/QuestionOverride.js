const overrideStore = require('./overrideStore');

/**
 * Live corrections over the bundled questions (`question_overrides`, one
 * document per exercise id); see overrideStore. A change carries
 * { question_text_he, options, correct_answer, explanation_he }.
 */
module.exports = overrideStore('question_overrides');
