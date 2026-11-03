#!/usr/bin/env node
/**
 * Draws every question picture (the inline SVG a question needs, such as a
 * grid with labelled points) as a PNG in public/question-pictures/, so the
 * website serves it and the Telegram bot can send it as a photo. The file
 * name is a hash of the picture (backend/src/utils/questionPicture.js), so
 * only new or changed pictures are drawn and pictures no question uses any
 * more are removed. A dev-time step, like `npm run generate-data`; the
 * backend test tests/questionPictures.test.js fails when a PNG is missing.
 *
 * Usage, after `cd backend && npm run generate-data`:
 *   cd frontend && CHROMIUM_PATH=/opt/pw-browsers/chromium npm run question-pictures
 * Env: CHROMIUM_PATH; ALL=1 draws every picture again.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { QUESTION_PICTURES_DIR, questionPictureFile } = require('../../backend/src/utils/questionPicture');

const EXERCISES = path.join(__dirname, '../../backend/data/static/exercises.json');
const OUT = path.join(__dirname, '../public', QUESTION_PICTURES_DIR);
// Sharp enough for a phone screen: Telegram shows photos up to 1280 px wide.
const SCALE = 3;
// The font the website draws the pictures' labels in (the right-to-left page's).
const FONT = "'Arial Hebrew', Tahoma, Arial, sans-serif";

const page = (svg) => `<!doctype html><html><head><meta charset="utf-8"><style>
html, body { margin: 0; background: #fff; font-family: ${FONT}; }
#picture { display: inline-block; padding: 10px; background: #fff; }
#picture svg { display: block; }
</style></head><body><div id="picture" dir="ltr">${svg}</div></body></html>`;

async function main() {
  const exercises = JSON.parse(fs.readFileSync(EXERCISES, 'utf8'));
  const pictures = new Map();
  for (const e of exercises) if (e.question_picture) pictures.set(questionPictureFile(e.question_picture), e.question_picture);
  fs.mkdirSync(OUT, { recursive: true });

  const stale = fs.readdirSync(OUT).filter(f => f.endsWith('.png') && !pictures.has(f));
  for (const f of stale) fs.unlinkSync(path.join(OUT, f));
  const todo = [...pictures].filter(([file]) => process.env.ALL || !fs.existsSync(path.join(OUT, file)));

  if (todo.length) {
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
    const tab = await browser.newPage({ deviceScaleFactor: SCALE });
    for (const [file, svg] of todo) {
      await tab.setContent(page(svg));
      await tab.locator('#picture').screenshot({ path: path.join(OUT, file) });
    }
    await browser.close();
  }
  console.log(`${pictures.size} question pictures: ${todo.length} drawn, ${stale.length} removed, ${pictures.size - todo.length} unchanged.`);
}

main().catch((error) => { console.error(error); process.exit(1); });
