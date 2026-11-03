const fs = require('fs');
const path = require('path');
const { QUESTION_PICTURES_DIR, questionPictureFile, questionPicturePath } = require('../src/utils/questionPicture');

/**
 * The chat bot sends a question's picture as a PNG the website serves
 * (frontend/public/question-pictures, drawn by
 * frontend/scripts/render-question-pictures.js). After a picture changes,
 * `npm run question-pictures` in frontend/ draws its new PNG.
 */
const exercises = require('../data/static/exercises.json');
const dir = path.join(__dirname, '../../frontend/public', QUESTION_PICTURES_DIR);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('question pictures as PNG', () => {
  const pictures = new Set(exercises.filter(e => e.question_picture).map(e => questionPictureFile(e.question_picture)));

  test('every question picture has its PNG (run `npm run question-pictures` in frontend/ when one is missing)', () => {
    expect(pictures.size).toBeGreaterThan(0);
    const missing = [...pictures].filter(file => !fs.existsSync(path.join(dir, file)));
    expect(missing).toEqual([]);
    for (const file of pictures) {
      expect(fs.readFileSync(path.join(dir, file)).subarray(0, 8).equals(PNG)).toBe(true);
    }
  });

  test('no PNG is left over from a picture no question uses any more', () => {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    expect(files.filter(f => !pictures.has(f))).toEqual([]);
  });

  test('the path follows the picture: a changed picture gets a new file', () => {
    expect(questionPicturePath('<svg>a</svg>')).toMatch(/^\/question-pictures\/[0-9a-f]{16}\.png$/);
    expect(questionPicturePath('<svg>a</svg>')).toBe(questionPicturePath('<svg>a</svg>'));
    expect(questionPicturePath('<svg>a</svg>')).not.toBe(questionPicturePath('<svg>b</svg>'));
    expect(questionPicturePath(null)).toBeNull();
  });
});
