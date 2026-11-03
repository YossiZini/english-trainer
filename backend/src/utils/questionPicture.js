const crypto = require('crypto');

/**
 * Where the website serves a question picture as a PNG, for the chat bot
 * (Telegram shows pictures, not inline SVG). The name is a hash of the
 * picture itself, so a changed picture gets a new file and nothing cached
 * (Telegram, the browser, Hosting) can show the old one. The PNGs are drawn
 * by frontend/scripts/render-question-pictures.js after `npm run generate-data`
 * and checked by tests/questionPictures.test.js.
 */
const QUESTION_PICTURES_DIR = 'question-pictures';

function questionPictureFile(picture) {
  return `${crypto.createHash('sha256').update(String(picture)).digest('hex').slice(0, 16)}.png`;
}

/** The site path of a question picture's PNG, or null when there is no picture. */
function questionPicturePath(picture) {
  return picture ? `/${QUESTION_PICTURES_DIR}/${questionPictureFile(picture)}` : null;
}

module.exports = { QUESTION_PICTURES_DIR, questionPictureFile, questionPicturePath };
