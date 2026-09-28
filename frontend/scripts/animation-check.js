#!/usr/bin/env node
/**
 * Walks every step of every animated lesson scene at a laptop and a phone
 * viewport: no page errors, stage inside the viewport, caption non-empty.
 * Screenshots (first step of each scene) go to SHOTS_DIR when set.
 *
 * Usage: API on :5000 (emulator-backed), `npm run build`, then
 *   CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/animation-check.js
 * Env: APP_URL, API_URL, SHOTS_DIR, CHROMIUM_PATH, LESSONS (comma list of
 * subtopic numbers, default: every Math lesson that has a player).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://127.0.0.1:5000/api';
const SHOTS_DIR = process.env.SHOTS_DIR || '';
const SIZES = [{ name: 'laptop', width: 1366, height: 768 }, { name: 'phone', width: 360, height: 740, mobile: true }];

function serveBuild(port) {
  const build = path.join(__dirname, '..', 'build');
  const api = new URL(API_URL);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) {
      const { origin, ...headers } = req.headers;
      const p = http.request({ host: api.hostname, port: api.port, path: req.url, method: req.method, headers }, (up) => { res.writeHead(up.statusCode, up.headers); up.pipe(res); });
      p.on('error', (e) => { res.writeHead(502); res.end(String(e)); }); req.pipe(p); return;
    }
    let file = path.resolve(build, '.' + req.url.split('?')[0]);
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(build, 'index.html');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}
async function api(route, opts = {}) {
  const res = await fetch(API_URL + route, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const body = await res.json(); if (!res.ok) throw new Error(`${route}: HTTP ${res.status}`); return body;
}

(async () => {
  const server = await serveBuild(Number(new URL(APP_URL).port || 3000));
  if (SHOTS_DIR) fs.mkdirSync(SHOTS_DIR, { recursive: true });
  const reg = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'anim-' + Date.now(), password: 'check1234', age: 13 }) });
  const token = reg.data.token;
  const math = await api('/lessons?subject=math', { headers: { Authorization: `Bearer ${token}` } });
  const lessons = math.data.flatMap((t) => t.lessons);
  const wanted = process.env.LESSONS ? process.env.LESSONS.split(',') : null;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  let failures = 0, steps = 0;
  for (const size of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, isMobile: !!size.mobile, hasTouch: !!size.mobile, deviceScaleFactor: 1 });
    await ctx.addInitScript(({ t, u }) => { localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); }, { t: token, u: reg.data.user });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => { failures++; console.log('PAGE ERROR', size.name, e.message); });
    for (const l of lessons) {
      if (wanted && !wanted.includes(l.subtopicNumber)) continue;
      await page.goto(`${APP_URL}/learn/${l.id}`); await page.waitForSelector('.theory-html');
      const player = await page.$('.lesson-animation');
      if (!player) continue;
      if ((await page.textContent('.lesson-animation .la-btn-primary')).includes('השהה')) await page.click('.lesson-animation .la-btn-primary'); // pause when playing
      const tabs = await page.$$('.lesson-animation .la-tab');
      for (let t = 0; t < tabs.length; t++) {
        await tabs[t].click(); await page.waitForTimeout(150);
        let guard = 0;
        while (guard++ < 12) {
          steps++;
          const m = await page.evaluate(() => {
            const svg = document.querySelector('.lesson-animation svg').getBoundingClientRect();
            return { inside: svg.left >= 0 && svg.right <= window.innerWidth + 1, caption: document.querySelector('.lesson-animation .la-caption').textContent.trim(), stepLabel: document.querySelector('.la-scene-title small').textContent, hscroll: document.documentElement.scrollWidth > window.innerWidth + 1 };
          });
          if (!m.inside || m.hscroll || !m.caption) { failures++; console.log('FAIL', size.name, l.subtopicNumber, 'tab', t + 1, m); }
          if (SHOTS_DIR && m.stepLabel.startsWith('שלב 1 ')) { await page.waitForTimeout(900); await page.screenshot({ path: path.join(SHOTS_DIR, `${size.name}-${l.subtopicNumber}-scene${t + 1}.png`) }); }
          const next = await page.$('.lesson-animation .la-btn[aria-label="צעד קדימה"]:not([disabled])');
          if (!next) break;
          const before = m.stepLabel;
          await next.click(); await page.waitForTimeout(120);
          const after = await page.$eval('.la-scene-title small', (e) => e.textContent);
          if (after === before || after.startsWith('שלב 1 ')) break; // moved to the next scene or did not move
        }
      }
      console.log(size.name, l.subtopicNumber, 'scenes:', tabs.length, 'steps walked so far:', steps);
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`steps: ${steps}, failures: ${failures}`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
