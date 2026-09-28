#!/usr/bin/env node
/**
 * Viewport regression check for the Exercise page.
 *
 * At a laptop (1366x768) and a phone (390x844) viewport it registers a
 * throwaway student, opens the first lesson's exercise, and for the first
 * QUESTIONS questions: answers, shows feedback and asserts the content card
 * ends above the pinned action bar (no scrolling needed); then presses Next
 * and asserts the new question is at the top with the previous feedback gone.
 *
 * Usage (see SETUP.md for the full sequence):
 *   API running on http://127.0.0.1:5000 (emulator-backed) and either
 *   - the production build:  npm run build && npm run check:viewport
 *     (the script serves frontend/build on :3000 and proxies /api to :5000), or
 *   - a dev server on :3000: APP_URL=http://127.0.0.1:3000 SERVE_BUILD=0 npm run check:viewport
 *
 * Environment: APP_URL, API_URL, QUESTIONS (default 6), SHOTS_DIR (default
 * none: no screenshots), CHROMIUM_PATH (default: Playwright's own Chromium),
 * LESSONS (comma-separated lesson ids instead of the first lesson) and
 * DIFFICULTY (easy | medium | hard) to walk the questions most likely to
 * overflow, e.g. the lessons with the longest options.
 * Exits 1 when any check fails.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// localhost (not 127.0.0.1): the API's default CORS allow-list is http://localhost:3000,
// which matters for the SERVE_BUILD=0 dev-server path where the browser calls the API directly.
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://127.0.0.1:5000/api';
const QUESTIONS = Number(process.env.QUESTIONS || 6);
const SHOTS_DIR = process.env.SHOTS_DIR || '';
const SERVE_BUILD = process.env.SERVE_BUILD !== '0';
const LESSONS = (process.env.LESSONS || '').split(',').map(s => s.trim()).filter(Boolean);
const DIFFICULTY = process.env.DIFFICULTY || '';
const SIZES = [
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'phone', width: 390, height: 844, mobile: true },
  { name: 'narrow-phone', width: 360, height: 740, mobile: true },
];

/** Serve frontend/build and forward /api/* to the API, like the Hosting rewrite. */
function serveBuild(port) {
  const build = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(path.join(build, 'index.html'))) {
    throw new Error('frontend/build not found: run `npm run build` first (or set SERVE_BUILD=0 and APP_URL)');
  }
  const api = new URL(API_URL);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg' };
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) {
      // Same-origin from the browser's point of view: drop Origin so the
      // API's CORS allow-list does not apply (as behind the Hosting rewrite).
      const { origin, ...headers } = req.headers;
      const proxy = http.request({ host: api.hostname, port: api.port, path: req.url, method: req.method, headers }, (up) => {
        res.writeHead(up.statusCode, up.headers);
        up.pipe(res);
      });
      proxy.on('error', (e) => { res.writeHead(502); res.end(String(e)); });
      req.pipe(proxy);
      return;
    }
    // Stay inside build/ and survive malformed percent-encoding
    let pathname = '/';
    try { pathname = decodeURIComponent(req.url.split('?')[0]); } catch (e) { pathname = '/'; }
    let file = path.resolve(build, '.' + pathname);
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(build, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function api(route, opts = {}) {
  const res = await fetch(API_URL + route, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const text = await res.text();
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const body = isJson ? JSON.parse(text) : null;
  if (!res.ok || !body || body.success === false) {
    throw new Error(`${route}: HTTP ${res.status}${body && body.message ? ' - ' + body.message : ''}${!isJson ? ' - ' + text.slice(0, 120) : ''}`);
  }
  return body;
}

(async () => {
  let server = null;
  if (SERVE_BUILD) server = await serveBuild(Number(new URL(APP_URL).port || 3000));
  if (SHOTS_DIR) fs.mkdirSync(SHOTS_DIR, { recursive: true });

  const reg = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'viewport-' + Date.now(), password: 'check1234', age: 11 }) });
  const token = reg.data.token;
  let lessonIds = LESSONS;
  if (!lessonIds.length) {
    const lessons = await api('/lessons', { headers: { Authorization: `Bearer ${token}` } });
    lessonIds = [lessons.data.flatMap(t => t.lessons || [])[0].id];
  }

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  let failures = 0;
  for (const size of SIZES) for (const [li, lessonId] of lessonIds.entries()) {
    const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, isMobile: !!size.mobile, hasTouch: !!size.mobile, deviceScaleFactor: 1 });
    await ctx.addInitScript(({ t, u }) => { localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); }, { t: token, u: reg.data.user });
    const page = await ctx.newPage();
    await page.goto(`${APP_URL}/exercise/${lessonId}${DIFFICULTY ? `?difficulty=${DIFFICULTY}` : ''}`);
    await page.waitForSelector('.question-container');
    const tag = lessonIds.length > 1 ? `${size.name}-L${li + 1}` : size.name;

    const metric = () => page.evaluate(() => {
      const bar = document.querySelector('.exercise-actionbar').getBoundingClientRect();
      const navbar = document.querySelector('.navbar');
      return {
        scrollY: window.scrollY,
        contentBottom: document.querySelector('.exercise-content').getBoundingClientRect().bottom,
        barTop: bar.top,
        barVisible: bar.bottom <= window.innerHeight + 1 && bar.top >= 0,
        questionTop: document.querySelector('.question-container').getBoundingClientRect().top,
        navbarBottom: navbar ? navbar.getBoundingClientRect().bottom : 0,
        type: document.querySelector('.option') ? 'mc' : 'fill',
        // labels must stay inside their buttons (narrow phones)
        buttonsFit: [...document.querySelectorAll('.exercise-navigation button')].every(b => b.scrollWidth <= b.clientWidth + 1),
      };
    });

    let worst = -Infinity;
    for (let q = 0; q < QUESTIONS; q++) {
      if (await page.$('.option')) await page.click('.option'); else await page.fill('.answer-input', 'is');
      await page.click('.check-button');
      await page.waitForSelector('.feedback');
      await page.waitForTimeout(350);
      const m = await metric();
      const overflow = Math.round(m.contentBottom - m.barTop);
      worst = Math.max(worst, overflow);
      const fits = overflow <= 1 && m.barVisible && m.buttonsFit;
      console.log(`${tag} q${q + 1} (${m.type}): overflow=${overflow}px fits=${fits}${m.buttonsFit ? '' : ' (button label overflows)'}`);
      if (!fits) failures++;
      if (SHOTS_DIR && (q === 0 || !fits)) await page.screenshot({ path: path.join(SHOTS_DIR, `${tag}-q${q + 1}${fits ? '' : '-overflow'}.png`) });

      if (!(await page.$('.next-button'))) break;
      await page.click('.next-button');
      await page.waitForTimeout(700);
      const after = await metric();
      const atTop = (after.scrollY === 0 && after.contentBottom <= after.barTop + 1) ||
        (after.questionTop >= after.navbarBottom - 2 && after.questionTop <= after.navbarBottom + 90);
      const feedbackGone = !(await page.$('.feedback'));
      if (!atTop || !feedbackGone) {
        failures++;
        console.log(`${tag} after q${q + 1}: questionTop=${Math.round(after.questionTop)} navbarBottom=${Math.round(after.navbarBottom)} atTop=${atTop} feedbackGone=${feedbackGone}`);
      }
    }
    console.log(`${tag}: worst overflow ${worst}px over ${QUESTIONS} questions`);
    await ctx.close();
  }
  await browser.close();
  if (server) server.close();
  console.log(failures ? `VIEWPORT CHECK FAILED (${failures})` : 'VIEWPORT CHECK PASSED');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
