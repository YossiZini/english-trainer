#!/usr/bin/env node
/**
 * Reading-order check for math in Hebrew text, on the real pages.
 *
 * At 1366, 390 and 360 px it opens the learn page and the exercise page (each
 * level) of the given lessons, answers every question and opens its feedback,
 * and measures where each character is drawn (Range.getClientRects): every
 * isolate (LRI…PDI), every <span dir="ltr">, every option without letters and
 * every decimal number and ratio must stay on one line and read left to right. A
 * stacked fraction counts as one token. With BOT_MESSAGES (a JSON list of
 * { where, text }, the bot's messages) it measures each line of each message
 * in a dir="auto" line, as Telegram shows it.
 *
 * Usage: API on :5000 (emulator-backed), then from frontend/:
 *   npm run build && TOPICS=110 node scripts/reading-order-check.js
 * Env: TOPICS (math topic numbers) or LESSONS (lesson ids), BOT_MESSAGES,
 * APP_URL, API_URL, SERVE_BUILD=0 with a dev server, CHROMIUM_PATH.
 * Exits 1 and lists every problem when anything reads out of order.
 */
const fs = require('fs');
const { chromium } = require('playwright');
const { serveBuild } = require('./serve-build');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://127.0.0.1:5000/api';
const SERVE_BUILD = process.env.SERVE_BUILD !== '0';
const TOPICS = (process.env.TOPICS || '').split(',').map(Number).filter(Boolean);
const WIDTHS = (process.env.WIDTHS || '').split(',').map(Number).filter(Boolean);
const SIZES = [
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'phone', width: 390, height: 844, mobile: true },
  { name: 'narrow-phone', width: 360, height: 740, mobile: true }
].filter((s) => !WIDTHS.length || WIDTHS.includes(s.width));

async function api(route, opts = {}) {
  const res = await fetch(API_URL + route, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const body = await res.json();
  if (!res.ok || body.success === false) throw new Error(`${route}: HTTP ${res.status} ${body.message || ''}`);
  return body;
}

/**
 * In the page: the runs under `selector` that must read left to right on one
 * line, measured. Returns { count, problems: [text] }.
 */
function measure(selector) {
  const FRAC = '.math-frac, .frac';
  const ISO_OPEN = '⁦', ISO_CLOSE = '⁩';
  const charRect = (node, i) => {
    const r = document.createRange();
    r.setStart(node, i);
    r.setEnd(node, i + 1);
    const rect = [...r.getClientRects()][0];
    return rect && rect.width > 0 ? rect : null;
  };
  // Tokens of an element in order: each visible character, and each stacked fraction as one.
  function tokens(root, from = null, to = null) {
    const out = [];
    const walk = (el) => {
      for (const child of el.childNodes) {
        if (child.nodeType === 1 && child.matches(FRAC)) {
          const rect = child.getBoundingClientRect();
          if (rect.width > 0) out.push({ ch: child.getAttribute('aria-label') || 'frac', rect });
        } else if (child.nodeType === 1) {
          if (child.tagName !== 'svg') walk(child);
        } else if (child.nodeType === 3) {
          for (let i = 0; i < child.data.length; i++) {
            const ch = child.data[i];
            if (/[\s ⁦-⁩]/.test(ch)) continue;
            const rect = charRect(child, i);
            if (rect) out.push({ ch, rect, node: child, i });
          }
        }
      }
    };
    walk(root);
    return from === null ? out : out.slice(from, to);
  }
  let box = null; // the measured root: a run kept on one line must not stick out of it
  function check(list, label, problems) {
    if (!list.length) return;
    const text = list.map((t) => t.ch).join('');
    if (list.some((t) => t.rect.right > box.right + 1 || t.rect.left < box.left - 1)) problems.push(`${label} "${text}" sticks out of its box`);
    if (list.length < 2) return;
    const first = list[0].rect;
    const line = list.every((t) => t.rect.top < first.bottom - 2 && t.rect.bottom > first.top + 2);
    const ordered = list.every((t, k) => !k || t.rect.left + t.rect.width / 2 > list[k - 1].rect.left + list[k - 1].rect.width / 2);
    if (!line) problems.push(`${label} "${text}" breaks across lines`);
    else if (!ordered) problems.push(`${label} "${text}" reads out of order`);
  }
  const problems = [];
  let count = 0;
  for (const root of document.querySelectorAll(selector)) {
    box = root.getBoundingClientRect();
    // Isolates, which may span text nodes and fractions (MathText splits them).
    const all = [];
    const walkIso = (el) => {
      for (const child of el.childNodes) {
        if (child.nodeType === 1 && child.matches(FRAC)) all.push({ frac: child });
        else if (child.nodeType === 1 && child.tagName !== 'svg') walkIso(child);
        else if (child.nodeType === 3) for (let i = 0; i < child.data.length; i++) all.push({ node: child, i, ch: child.data[i] });
      }
    };
    walkIso(root);
    let run = null;
    for (const t of all) {
      if (t.ch === ISO_OPEN) { run = []; continue; }
      if (t.ch === ISO_CLOSE) { if (run) { count++; check(run, 'isolate', problems); } run = null; continue; }
      if (!run) continue;
      if (t.frac) { const rect = t.frac.getBoundingClientRect(); if (rect.width) run.push({ ch: t.frac.getAttribute('aria-label') || 'frac', rect }); continue; }
      if (/[\s ]/.test(t.ch)) continue;
      const rect = charRect(t.node, t.i);
      if (rect) run.push({ ch: t.ch, rect });
    }
    // Spans the theory and the captions write math in.
    for (const span of root.querySelectorAll('span[dir="ltr"]:not(.math-frac)')) {
      if (span.closest(FRAC)) continue;
      count++;
      check(tokens(span), 'span', problems);
    }
    // Options without letters (numbers, comparisons, equations).
    for (const opt of root.querySelectorAll('.option-text')) {
      if (/[A-Za-z֐-׿؀-ۿ]/.test(opt.textContent)) continue;
      count++;
      check(tokens(opt), 'option', problems);
    }
    // Every decimal number and every ratio (3:5, 1.5:2), wherever it stands.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('svg')) continue;
      for (const m of node.data.matchAll(/\d+(?:[.:]\d+)+/g)) {
        const list = [];
        for (let i = m.index; i < m.index + m[0].length; i++) { const rect = charRect(node, i); if (rect) list.push({ ch: node.data[i], rect }); }
        count++;
        check(list, 'decimal', problems);
      }
    }
  }
  return { count, problems };
}

(async () => {
  let server = null;
  if (SERVE_BUILD) server = await serveBuild(Number(new URL(APP_URL).port || 3000), API_URL);
  const reg = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'order-' + Date.now(), password: 'check1234', age: 12 }) });
  const token = reg.data.token;
  let lessonIds = (process.env.LESSONS || '').split(',').filter(Boolean);
  if (TOPICS.length) {
    const all = await api('/lessons?subject=math', { headers: { Authorization: `Bearer ${token}` } });
    lessonIds = all.data.filter((t) => TOPICS.includes(t.topicNumber)).flatMap((t) => t.lessons.map((l) => l.id));
  }
  if (!lessonIds.length && !process.env.BOT_MESSAGES) throw new Error('no lessons: set TOPICS or LESSONS');

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  let total = 0;
  const problems = [];
  const note = (where, r) => { total += r.count; problems.push(...r.problems.map((p) => `${where}: ${p}`)); };
  for (const size of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, isMobile: !!size.mobile, hasTouch: !!size.mobile, deviceScaleFactor: 1 });
    await ctx.addInitScript(({ t, u }) => { localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); }, { t: token, u: reg.data.user });
    const page = await ctx.newPage();
    for (const id of lessonIds) {
      await page.goto(`${APP_URL}/learn/${id}`);
      await page.waitForSelector('.theory-html');
      const title = await page.evaluate(() => (document.querySelector('.lesson-title-en') || {}).textContent || '');
      note(`${size.name} ${title.trim()} theory`, await page.evaluate(measure, '.theory-html'));
      for (const level of ['easy', 'medium', 'hard']) {
        await page.goto(`${APP_URL}/exercise/${id}?difficulty=${level}`);
        await page.waitForSelector('.question-container');
        for (let q = 1; q <= 10; q++) {
          const where = `${size.name} ${title.trim()} ${level} #${q}`;
          note(`${where} question`, await page.evaluate(measure, '.question-container'));
          await page.click('.option');
          await page.click('.check-button');
          await page.waitForSelector('.feedback');
          // Open a clamped explanation, so every line is laid out as a student reads it.
          if (await page.$('.feedback-toggle')) await page.click('.feedback-toggle');
          note(`${where} feedback`, await page.evaluate(measure, '.feedback'));
          if (!(await page.$('.next-button'))) break;
          await page.click('.next-button');
          await page.waitForTimeout(300);
        }
      }
    }
    // The bot's messages: each line in a dir="auto" box, as a chat shows it.
    if (process.env.BOT_MESSAGES) {
      const messages = JSON.parse(fs.readFileSync(process.env.BOT_MESSAGES, 'utf8'));
      const width = Math.min(size.width - 40, 520);
      await page.setContent(`<!doctype html><meta charset="utf-8"><body style="font:16px Arial;margin:12px">${messages.map((m, k) =>
        `<div class="msg" data-k="${k}" style="width:${width}px">${m.text.split('\n').map((l) => `<div dir="auto">${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>`).join('')}</div>`).join('')}</body>`);
      for (const [k, m] of messages.entries()) note(`${size.name} bot ${m.where}`, await page.evaluate(measure, `.msg[data-k="${k}"]`));
    }
    await ctx.close();
  }
  await browser.close();
  if (server) server.close();
  console.log(`${total} runs measured at ${SIZES.map((s) => s.width).join('/')} px`);
  console.log(problems.length ? problems.join('\n') : 'every run reads in order on one line');
  process.exit(problems.length ? 1 : 0);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
