// Independent check of topic 111 (ratio and proportion). Shares no code with
// the seeds: it reads the bundled JSON (or, with SEED=1, the seed module's
// output as data; with DATA=<dir>, <dir>/lessons.json and <dir>/exercises.json) and
// - re-computes every answer with its own exact arithmetic (fractions of
//   BigInts): ratios from the counts a story names, simplest forms, equal
//   ratios, parts of the whole, shares, missing terms, and stories from their
//   numbers and the words that say what to do with them;
// - checks every equation and chain of equal ratios shown in the theory, the
//   explanations, the captions and the options, with x put in;
// - reads every picture back from its SVG: bar models (parts, the value of a
//   part, the split of a whole) against their captions and questions, ratio
//   tables (every column an equal ratio, every step right), the balance;
// - enforces the reading-order rules of math-content-guide.md ("Ratios"):
//   no ratio with spaces around its colon, no =, operator, ratio with x or
//   negative number outside an isolate, glued isolates, equation spans marked
//   math-line, options that are bare ratios, numbers, fractions, Hebrew words
//   or letterless equations, no explanation starting with an isolate.
// From backend/:
//   node scripts/checks/topic111.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic111.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const TOPIC = 111;

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic111-ratio.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe,
    explanation_picture: e.explanationPicture, question_picture: e.questionPicture, difficulty: e.difficulty
  })));
} else {
  const dir = process.env.DATA || path.join(ROOT, 'data/static');
  lessons = JSON.parse(fs.readFileSync(path.join(dir, 'lessons.json'), 'utf8')).filter((l) => l.topic_number === TOPIC);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = JSON.parse(fs.readFileSync(path.join(dir, 'exercises.json'), 'utf8')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const HEBREW = /[֐-׿]/;
const bare = (s) => String(s ?? '').replace(/ /g, ' ').replace(/[⁦-⁩]/g, '');
const unescape = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const FRAC = /<span class="frac">(?:<span class="frac-whole">(\d+)<\/span>)?<span class="frac-stack"><span class="frac-num">([^<]*)<\/span><span class="frac-den">([^<]*)<\/span><\/span><\/span>/g;
const unstack = (html) => String(html ?? '').replace(FRAC, (m, w, n, d) => `${w ? `${w} ` : ''}${n}/${d}`);

// ---------------------------------------------------------------- exact numbers
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d === 0n) throw new Error('division by 0'); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const num = (s) => { const m = String(s).trim().match(/^(\d+)(?:\.(\d+))?$/); if (!m) throw new Error(`not a number: "${s}"`); return Q(BigInt(m[1] + (m[2] || '')), 10n ** BigInt((m[2] || '').length)); };
const add = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => add(a, Q(-b.n, b.d));
const mul = (a, b) => Q(a.n * b.n, a.d * b.d);
const div = (a, b) => Q(a.n * b.d, a.d * b.n);
const same = (a, b) => a.n === b.n && a.d === b.d;
const isNum = (s) => /^\d+(?:\.\d+)?$/.test(String(s).trim());
/** Written the lessons' way: a whole number, a decimal, or (frac) the reduced fraction n/d. */
function write(q, { frac = false } = {}) {
  if (frac) return `${q.n}/${q.d}`;
  let p = 0;
  while (10n ** BigInt(p) % q.d !== 0n) { p++; if (p > 12) return `${q.n}/${q.d}`; }
  const s = (q.n * (10n ** BigInt(p) / q.d)).toString().padStart(p + 1, '0');
  const whole = p ? s.slice(0, -p) : s, f = p ? s.slice(-p).replace(/0+$/, '') : '';
  return f ? `${whole}.${f}` : whole;
}
/** A ratio "a:b(:c)" → its terms as exact numbers; equal ratios are proportional. */
const terms = (r) => r.split(':').map((t) => num(t));
const proportional = (r1, r2) => r1.length === r2.length && r1.every((t, i) => same(mul(t, r2[0]), mul(r2[i], r1[0])));
/** The simplest whole-number form of a ratio. */
function simplest(r) {
  const den = r.reduce((l, t) => l * t.d / gcd(l, t.d), 1n);
  const whole = r.map((t) => t.n * (den / t.d));
  const g = whole.reduce((a, b) => gcd(a, b));
  return whole.map((w) => (w / g).toString()).join(':');
}

// ---------------------------------------------------------------- expressions and chains
/** A linear form a·x + b from + − × ÷, parentheses, decimals, a/b and x (3x is 3 × x). */
function linear(text, x = null) {
  const src = bare(unescape(text)).replace(/\s+/g, '').replace(/(\d)x/g, '$1×x');
  let i = 0;
  const L = (a, b) => ({ a, b });
  function factor() {
    if (src[i] === '(') { i++; const v = sum(); if (src[i++] !== ')') throw new Error(`no ")" in ${src}`); return v; }
    if (src[i] === 'x') { i++; return x ? L(Q(0), x) : L(Q(1), Q(0)); }
    const m = src.slice(i).match(/^\d+(?:\.\d+)?/);
    if (!m) throw new Error(`cannot read "${src.slice(i)}" in ${src}`);
    i += m[0].length;
    let v = num(m[0]);
    if (src[i] === '/' && /\d/.test(src[i + 1] || '')) { i++; const d = src.slice(i).match(/^\d+/)[0]; i += d.length; v = div(v, num(d)); }
    return L(Q(0), v);
  }
  function product() {
    let v = factor();
    while (src[i] === '×' || src[i] === '÷') {
      const op = src[i++]; const w = factor();
      if (op === '×') { if (v.a.n && w.a.n) throw new Error('x × x'); v = v.a.n ? L(mul(v.a, w.b), mul(v.b, w.b)) : L(mul(w.a, v.b), mul(w.b, v.b)); } else { if (w.a.n) throw new Error('÷ x'); v = L(div(v.a, w.b), div(v.b, w.b)); }
    }
    return v;
  }
  function sum() {
    let v = product();
    while (src[i] === '+' || src[i] === '−') { const op = src[i++]; const w = product(); v = op === '+' ? L(add(v.a, w.a), add(v.b, w.b)) : L(sub(v.a, w.a), sub(v.b, w.b)); }
    return v;
  }
  const v = sum();
  if (i !== src.length) throw new Error(`cannot read "${src.slice(i)}" in ${src}`);
  return v;
}
/** One side of a chain: a ratio (terms, x put in) or a number. */
function side(text, x) {
  const t = bare(unescape(text)).trim();
  if (/:/.test(t)) return { ratio: t.split(':').map((p) => { const v = linear(p, x); if (v.a.n) throw new Error('x left'); return v.b; }) };
  const v = linear(t, x);
  return v.a.n ? { lin: v } : { value: v.b };
}
/**
 * The x a chain is about, from its first link with x: a ratio link a:b = c:d
 * by its products (a × d = b × c), any other as a linear equation.
 */
function solveX(parts) {
  const form = (p) => (/:/.test(p) ? { ratio: p.split(':').map((q) => linear(q)) } : { lin: linear(p) });
  const prod = (u, v) => { if (u.a.n && v.a.n) throw new Error('x × x'); return { a: add(mul(u.a, v.b), mul(v.a, u.b)), b: mul(u.b, v.b) }; };
  for (let k = 0; k + 1 < parts.length; k++) {
    const [l, r] = [form(parts[k]), form(parts[k + 1])];
    let left, right;
    if (l.ratio && r.ratio) { left = prod(l.ratio[0], r.ratio[1]); right = prod(l.ratio[1], r.ratio[0]); } else if (l.lin && r.lin) { [left, right] = [l.lin, r.lin]; } else continue;
    const a = sub(left.a, right.a);
    if (a.n) return div(sub(right.b, left.b), a);
  }
  throw new Error('x cannot be found');
}
/**
 * Does a chain hold ("12:18 = 2:3", "3 × 12 = 4 × x", "4x = 36")? x is put in
 * when given, else found from the chain (it must have one). null when there
 * is no "=".
 */
function holds(chain, x = null) {
  const parts = bare(unescape(chain)).split(/\s*=\s*/);
  if (parts.length < 2) return null;
  if (x === null && parts.some((p) => /x/.test(p))) x = solveX(parts);
  const sides = parts.map((p) => side(p, x));
  for (let k = 0; k + 1 < sides.length; k++) {
    const [l, r] = [sides[k], sides[k + 1]];
    if (l.ratio || r.ratio) {
      if (!l.ratio || !r.ratio) throw new Error('a ratio equal to a number');
      if (!proportional(l.ratio, r.ratio)) return false;
    } else if (l.lin || r.lin) {
      const a = sub((l.lin || { a: Q(0) }).a, (r.lin || { a: Q(0) }).a);
      const b = sub((r.lin || { b: r.value }).b, (l.lin || { b: l.value }).b);
      if (!a.n) return !b.n;
    } else if (!same(l.value, r.value)) return false;
  }
  return true;
}
function checkChain(where, chain, x) {
  try { if (holds(chain, x) === false) fail(where, `"${bare(chain)}" is false`); } catch (e) { fail(where, `"${bare(chain)}": ${e.message}`); }
}

// ---------------------------------------------------------------- reading order (guide: "Ratios")
const isolates = (s) => [...String(s ?? '').matchAll(/⁦([^⁩]*)⁩/g)].map((m) => m[1]);
const spans = (s) => [...String(s).matchAll(/<span dir="ltr"(?: class="math-line")?>(.*?)<\/span>/g)].map((m) => m[1]);
const outside = (s) => unescape(String(s).replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/⁦[^⁩]*⁩/g, ' ').replace(/<span dir="ltr"[^>]*>.*?<\/span>/g, ' ').replace(/<[^>]+>/g, ' '));
function checkText(where, s, { explanation = false } = {}) {
  const raw = String(s ?? '');
  const text = outside(raw);
  // A spaced ratio in Hebrew text or in an isolate (a sentence colon after a number, before an isolate, is not one).
  const spaced = /\d *: +\d|\d +: *\d/;
  if (spaced.test(text) || isolates(raw).some((iso) => spaced.test(bare(iso))) || spans(raw).some((sp) => spaced.test(bare(sp)))) {
    fail(where, 'a ratio with spaces around its colon (it shows turned round)');
  }
  if (/[+×÷=<>]/.test(text)) fail(where, `an operator or = outside an isolate: "${text.trim().slice(0, 60)}"`);
  if (/[−-]\s*\d/.test(text.replace(/[א-ת]-\d/g, ''))) fail(where, 'a negative number or a minus outside an isolate');
  if (/x:\d|\d:x|\dx/.test(text)) fail(where, 'a ratio or an expression with x outside an isolate');
  for (const iso of isolates(raw)) {
    if (/₪|[֐-׿]/.test(iso)) fail(where, `a unit or a Hebrew word inside an isolate: "${iso}"`);
    if (/ /.test(iso)) fail(where, `an isolate with plain spaces (not glued): "${iso}"`);
  }
  for (const sp of spans(raw)) if (/ /.test(sp)) fail(where, `a span with plain spaces (not glued): "${sp}"`);
  if (explanation && /^⁦/.test(raw)) fail(where, 'starts with an isolate');
}

// ---------------------------------------------------------------- pictures
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}="([^"]*)"`)); return m ? m[1] : null; };
function figures(html) {
  const s = String(html || '');
  const out = [...s.matchAll(/<figure class="math-figure">([\s\S]*?)<\/figure>/g)].map((f) => ({
    svgs: [...f[1].matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]),
    caption: (f[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/) || [, ''])[1]
  }));
  if (!out.length && /<svg/.test(s)) out.push({ svgs: [...s.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]), caption: '' });
  return out;
}
/** A bar model: its rows { label, parts, each, split, kinds }, checked against their own attributes. */
function readBars(where, svg) {
  return [...svg.matchAll(/<g data-row="\d+" data-label="([^"]*)" data-parts="(\d+)" data-each="([^"]*)" data-split="([^"]*)">([\s\S]*?)<\/g>/g)].map((m) => {
    const [, label, parts, each, split, body] = m;
    const kinds = [...body.matchAll(/data-part="(\w)"/g)].map((k) => k[1]).join('');
    const values = [...body.matchAll(/fill="#ffffff">([^<]+)</g)].map((v) => v[1]);
    if (kinds.length !== Number(parts)) fail(where, `row "${label}" draws ${kinds.length} parts, not ${parts}`);
    if (each && (values.length !== Number(parts) || values.some((v) => v !== each))) fail(where, `row "${label}" does not write ${each} in every part`);
    if (!each && values.length) fail(where, `row "${label}" writes values it does not carry`);
    if (split && kinds !== 'a'.repeat(Number(split)) + 'b'.repeat(Number(parts) - Number(split))) fail(where, `row "${label}" is not split ${split}`);
    const label0 = (svg.match(new RegExp(`text-anchor="end"[^>]*>${label}<`)) || []).length || !label;
    if (!label0) fail(where, `row "${label}" is not named`);
    return { label, parts: Number(parts), each: each ? Number(each) : null, split: split ? Number(split) : null };
  });
}
/** A ratio table: its columns; every column an equal ratio (x put in), every step right. */
function readTable(where, svg, x) {
  const cells = [...svg.matchAll(/data-col="(\d+)" data-row="(\d)" data-value="([^"]*)"[^>]*>([^<]*)</g)];
  const cols = [];
  for (const [, c, r, v, shown] of cells) {
    if (v !== shown) fail(where, `cell ${c},${r} shows "${shown}", carries "${v}"`);
    (cols[Number(c)] = cols[Number(c)] || [])[Number(r)] = v;
  }
  const val = (v) => (v === 'x' ? x : num(v));
  if (x || cols.every((c) => c.every(isNum))) {
    const full = cols.map((c) => c.map(val));
    if (full.some((c) => c.some((v) => !v))) fail(where, 'a missing term the check cannot put in');
    else for (const c of full.slice(1)) if (!proportional(full[0], c)) fail(where, `${full[0].map(write).join(':')} and ${c.map(write).join(':')} are not equal ratios`);
    const steps = [...svg.matchAll(/data-step="([×÷]) (\d+(?:\.\d+)?)"/g)].filter((_, k) => k % 2 === 0).map((m) => [m[1], num(m[2])]);
    steps.forEach(([op, k], s) => {
      if (!full[s + 1]) return;
      for (let r = 0; r < 2; r++) {
        const got = op === '×' ? mul(full[s][r], k) : div(full[s][r], k);
        if (!same(got, full[s + 1][r])) fail(where, `step ${op} ${write(k)} does not turn ${write(full[s][r])} into ${write(full[s + 1][r])}`);
      }
    });
  }
  return cols;
}
let pictureCount = 0;
/** Every picture of a fragment, read back and matched to its caption; returns what was read. */
function checkPictures(where, html, x = null) {
  const read = [];
  for (const f of figures(html)) {
    const capText = bare(unescape(String(f.caption).replace(/<[^>]+>/g, ' ')));
    if (f.caption) checkText(`${where} caption`, f.caption);
    for (const sp of spans(f.caption)) checkChain(`${where} caption`, sp, x);
    for (const svg of f.svgs) {
      pictureCount++;
      if (/data-ratio-bar="1"/.test(svg)) {
        const rows = readBars(where, svg);
        read.push({ kind: 'bars', rows });
        const ratios = [...capText.matchAll(/\d+(?::\d+)+/g)].map((m) => m[0]);
        const parts = rows.map((r) => r.parts).join(':');
        if (ratios.length && rows.length > 1 && !ratios.includes(parts)) fail(where, `the caption's ratio is not the parts ${parts}`);
        const each = capText.match(/כל חלק (\d+)/);
        if (each && rows.some((r) => r.each !== null && r.each !== Number(each[1]))) fail(where, `the caption says every part is ${each[1]}`);
        const fr = capText.match(/(\d+)\/(\d+)/);
        const whole = rows.find((r) => r.split !== null);
        if (whole && fr && !same(Q(fr[1], fr[2]), Q(whole.split, whole.parts))) fail(where, `the caption's ${fr[0]} is not the blue part ${whole.split}/${whole.parts}`);
        const colours = capText.match(/(\d+) חלקים כחולים ו-(\d+) כתומים/);
        if (whole && colours && (Number(colours[1]) !== whole.split || Number(colours[2]) !== whole.parts - whole.split)) fail(where, 'the caption counts other colours');
      } else if (/data-ratio-table="1"/.test(svg)) {
        read.push({ kind: 'table', cols: readTable(where, svg, x) });
      } else if (/data-balance="1"/.test(svg)) {
        const boxes = (svg.match(/data-item="box"/g) || []).length;
        const weights = [...svg.matchAll(/data-item="weight" data-value="(\d+)"/g)].map((m) => Number(m[1]));
        const said = capText.match(/(\d+)x = (\d+)/);
        if (!said || Number(said[1]) !== boxes || weights.reduce((s, w) => s + w, 0) !== Number(said[2])) fail(where, `the balance (${boxes} boxes, ${weights.join('+')}) is not "${capText.trim()}"`);
      } else {
        fail(where, 'a picture the check cannot read');
      }
    }
  }
  return read;
}

// ---------------------------------------------------------------- re-computing answers
const strip = (w) => w.replace(/^[הלו]+(?=\S{2,})/, '');
const numbersIn = (t) => [...t.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]).filter((s) => !/:/.test(s));
const WORDS = { 'ארבע': 4, 'שלוש': 3 };
const UNIT = { 'דקות': 1, 'שעות': 60, 'אגורות': 1, 'שקלים': 100, 'ס״מ': 1, 'מטרים': 100 };
/** "30 דקות", "2 שקלים", "שעתיים" as one unit's count. */
function quantity(s) {
  if (s === 'שעתיים') return Q(120);
  const m = s.match(/^(\d+) (\S+)$/);
  if (!m || !UNIT[m[2]]) throw new Error(`no unit in "${s}"`);
  return mul(num(m[1]), Q(UNIT[m[2]]));
}
/** The count a story gives a noun: "3 כדורים אדומים" for אדומים. */
function countOf(t, noun) {
  const m = t.match(new RegExp(`(\\d+) (?:\\S+ )?ה?${noun}`));
  return m ? num(m[1]) : null;
}
/** Names of a sharing: "בין דן ליעל", "בין אבי, בני ודני", "רון וגיל חילקו". */
function namesOf(t) {
  let m = t.match(/בין (.+?) ביחס/) || t.match(/^(\S+ ו\S+) חילקו/) || t.match(/היחס בין (?:מספר )?(\S+ ל(?:מספר )?\S+) (?:בכיתה )?הוא/);
  if (!m) m = t.match(/בתערובת (.+?) ביחס/);
  if (!m) return null;
  return m[1].replace(/מספר /g, '').split(/, | ו| ל/).map((w) => strip(w.replace(/^ל/, '')));
}
const ratioIn = (t) => (t.match(/(\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)+)/) || [])[1];

function recompute(q, options, picture) {
  const t = bare(q).trim();
  let m;
  const one = (pred, what) => {
    const ok = options.filter(pred);
    if (ok.length !== 1) throw new Error(`${ok.length} options are ${what}`);
    return { option: ok[0] };
  };
  const isRatio = (o) => /^\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)+$/.test(o);
  // 111.1
  if ((m = t.match(/^צמצמו את היחס ([\d:]+)\.$/))) return { option: simplest(terms(m[1])) };
  if ((m = t.match(/^איזה יחס (איננו )?שווה ל-([\d.:]+)\?$/))) {
    const r = terms(m[2]);
    return one((o) => isRatio(o) && (proportional(terms(o), r) === !m[1]), m[1] ? 'not equal' : 'equal');
  }
  if ((m = t.match(/^באיזה מספר כפלו את שני האיברים\? (\d+):(\d+) = (\d+):(\d+)$/))) {
    const k = div(num(m[3]), num(m[1]));
    if (!same(k, div(num(m[4]), num(m[2])))) throw new Error('the two terms were not multiplied alike');
    return { value: k };
  }
  if ((m = t.match(/^מהו היחס בין (\d+ \S+|\d+) (?:ל-|ל)(\d+ \S+|\S+), בצורה המצומצמת\?$/))) {
    const [a, b] = /^\d+$/.test(m[1]) ? [num(m[1]), num(m[2])] : [quantity(m[1]), quantity(m[2])];
    return { option: simplest([a, b]) };
  }
  if (/^לפי מודל הפסים, מהו היחס בין/.test(t)) {
    const [, A, B] = t.match(/בין (\S+) (\S+)\?$/);
    const rows = picture.find((p) => p.kind === 'bars').rows;
    const get = (w) => rows.find((r) => r.label === strip(w.replace(/^ל/, '')));
    if (!get(A) || !get(B)) throw new Error('a name the bar model does not have');
    return { option: `${get(A).parts}:${get(B).parts}` };
  }
  if (/^לפי מודל הפסים, איזה חלק מהשלם צבוע בכחול\?$/.test(t)) {
    const w = picture.find((p) => p.kind === 'bars').rows.find((r) => r.split !== null);
    return { option: write(Q(w.split, w.parts), { frac: true }) };
  }
  if ((m = t.match(/איזה חלק מה\S+ (?:הוא|הם|הן) (\S+)\?$/))) {
    const asked = strip(m[1]);
    const r = ratioIn(t);
    if (r) {
      const names = namesOf(t);
      const k = names.indexOf(asked);
      if (k < 0) throw new Error(`"${asked}" is not one of ${names}`);
      const rt = terms(r);
      return { option: write(div(rt[k], rt.reduce(add)), { frac: true }) };
    }
    const nouns = [...t.matchAll(/(\d+) (\S+)/g)].map((x) => [strip(x[2]), num(x[1])]);
    const mine = nouns.find(([w]) => w === asked);
    return { option: write(div(mine[1], nouns.map(([, v]) => v).reduce(add)), { frac: true }) };
  }
  if ((m = t.match(/מהו היחס בין מספר ה(\S+) למספר (?:כל )?ה(\S+?)(, בצורה המצומצמת)?\?$/))) {
    const [A, B, simplestForm] = [m[1], m[2], !!m[3]];
    let a = countOf(t, A), b = countOf(t, B);
    const given = t.match(/היחס בין מספר ה(\S+) למספר ה(\S+) .*הוא ([\d:]+)\./);
    if (given) {
      const r = given[3].split(':');
      if (given[1] === B && given[2] === A) [a, b] = [num(r[1]), num(r[0])];
      else if (given[1] === A && given[2] === B) [a, b] = [num(r[0]), num(r[1])];
    }
    if (b === null && /(\d+) תלמידים/.test(t)) b = sub(num(t.match(/(\d+) תלמידים/)[1]), a);
    if (/ניצחה ב-(\d+) משחקים והפסידה ב-(\d+)/.test(t)) {
      const [, w, l] = t.match(/ניצחה ב-(\d+) משחקים והפסידה ב-(\d+)/);
      a = num(w); b = add(num(w), num(l));
    }
    if (a === null || b === null) throw new Error(`no counts for ${A} and ${B}`);
    return { option: simplestForm ? simplest([a, b]) : `${write(a)}:${write(b)}` };
  }
  // 111.3
  if ((m = t.match(/^מצאו את x: ([\d.x]+):([\d.x]+) = ([\d.x]+):([\d.x]+)$/))) {
    const ts = m.slice(1, 5);
    const at = ts.indexOf('x');
    const v = ts.map((s) => (s === 'x' ? null : num(s)));
    // a × d = b × c
    const [a, b, c, d] = v;
    // a × d = b × c: the missing term is the product across from it divided by its partner.
    if (at === 0) return { value: div(mul(b, c), d) };
    if (at === 1) return { value: div(mul(a, d), c) };
    if (at === 2) return { value: div(mul(a, d), b) };
    return { value: div(mul(b, c), a) };
  }
  if ((m = t.match(/^האם ([\d.]+:[\d.]+) = ([\d.]+:[\d.]+)\?$/))) return { option: proportional(terms(m[1]), terms(m[2])) ? 'כן' : 'לא' };
  if (/^איזו פרופורציה נכונה\?$/.test(t)) return one((o) => holds(o) === true, 'true');
  if (/^לפי הטבלה, כמה/.test(t)) {
    const cols = picture.find((p) => p.kind === 'table').cols;
    const known = cols.find((c) => c.every(isNum));
    const ask = cols.find((c) => c.includes('x'));
    const k = ask.indexOf('x');
    return { value: div(mul(num(ask[1 - k]), num(known[k])), num(known[1 - k])) };
  }
  // 111.2: bar models
  if (/^לפי מודל הפסים/.test(t)) {
    const rows = picture.find((p) => p.kind === 'bars').rows;
    const row = (w) => rows.find((r) => r.label === strip(w.replace(/^מ/, '')));
    if ((m = t.match(/כמה מקבלת (\S+)\?$/))) return { value: Q(row(m[1]).parts * row(m[1]).each) };
    if ((m = t.match(/, (\S+) קיבל (\d+)\. כמה קיבלה (\S+)\?$/))) return { value: div(mul(num(m[2]), Q(row(m[3]).parts)), Q(row(m[1]).parts)) };
    if ((m = t.match(/, (\S+) קיבלה (\d+) יותר מ(\S+)\. כמה קיבלו שניהם יחד\?$/))) {
      const one_ = div(num(m[2]), Q(row(m[1]).parts - row(m[3]).parts));
      return { value: mul(one_, Q(rows.reduce((s, r) => s + r.parts, 0))) };
    }
  }
  // 111.3: a ratio and one count: the other count (before sharing, which has a total).
  if ((m = t.match(/היחס בין מספר ה(\S+) למספר ה(\S+) הוא ([\d:]+)\. בכיתה (\d+) (\S+)\. כמה (\S+) בכיתה\?$/))) {
    const rt = terms(m[3]);
    const known = m[5] === m[1] ? 0 : 1;
    return { value: mul(div(num(m[4]), rt[known]), rt[1 - known]) };
  }
  // 111.2: sharing
  const r = ratioIn(t);
  const names = namesOf(t);
  if (r && names) {
    const rt = terms(r);
    const parts = rt.reduce(add);
    const total = (t.match(/(?:מחלקים |בכיתה |בבית הספר )(\d+)/) || [])[1];
    const T = total ? num(total) : null;
    const k = (w) => { const i = names.indexOf(strip(w)); if (i < 0) throw new Error(`"${w}" is not one of ${names}`); return i; };
    if (/כמה חלקים שווים יש בסך הכול/.test(t)) return { value: parts };
    if (/בחלק אחד\?$/.test(t)) return { value: div(T, parts) };
    if ((m = t.match(/(\S+) (?:קיבל|קיבלה) (\d+) \S+ יותר מ(\S+)\. כמה \S+ (?:קיבל|קיבלה) (\S+)\?$/))) {
      const one_ = div(num(m[2]), sub(rt[k(m[1])], rt[k(m[3].replace(/^מ/, ''))]));
      return { value: mul(one_, rt[k(m[4])]) };
    }
    if ((m = t.match(/\. (\S+) קיבל(?:ה)? (\d+) \S+\. כמה (?:\S+ )?(?:קיבל|קיבלה) (\S+)\?$/))) {
      return { value: div(mul(num(m[2]), rt[k(m[3])]), rt[k(m[1])]) };
    }
    if ((m = t.match(/\. (\S+) קיבל(?:ה)? (\d+) \S+\. כמה \S+ חולק(?:ו)? בסך הכול\?$/))) {
      return { value: div(mul(num(m[2]), parts), rt[k(m[1])]) };
    }
    // "כמה בנות יש יותר מבנים?", "כמה שקלים קיבל גיל יותר מרון?"
    if ((m = t.match(/כמה (\S+) יש יותר מ(\S+)\?$/)) || (m = t.match(/כמה \S+ קיבל(?:ה)? (\S+) יותר מ(\S+)\?$/))) {
      return { value: mul(div(T, parts), sub(rt[k(m[1])], rt[k(m[2])])) };
    }
    if ((m = t.match(/כמה (?:\S+ )?(?:מקבל|מקבלת) (\S+)\?$/)) || (m = t.match(/כמה (\S+) בכיתה\?$/)) || (m = t.match(/כמה (\S+) בבית הספר\?$/))) {
      return { value: mul(div(T, parts), rt[k(m[1])]) };
    }
    if ((m = t.match(/כמה קילוגרמים של (\S+) יש ב-(\d+)/))) return { value: mul(div(num(m[2]), parts), rt[k(m[1])]) };
  }
  if (r && /חבל באורך (\d+) מטרים נחתך לשני חלקים ביחס .* החלק הארוך/.test(t)) {
    const rt = terms(r); const T = num(t.match(/באורך (\d+)/)[1]);
    return { value: mul(div(T, rt.reduce(add)), rt.reduce((a, b) => (a.n * b.d > b.n * a.d ? a : b))) };
  }
  if (r && /במשולש היחס בין הזוויות .* הזווית הגדולה/.test(t)) {
    const rt = terms(r);
    return { value: mul(div(Q(180), rt.reduce(add)), rt.reduce((a, b) => (a.n * b.d > b.n * a.d ? a : b))) };
  }
  if (r && /היקף מלבן (\d+) .* בין האורך לרוחב .* מה האורך/.test(t)) {
    const rt = terms(r); const P = num(t.match(/היקף מלבן (\d+)/)[1]);
    return { value: mul(div(div(P, Q(2)), rt.reduce(add)), rt[0]) };
  }
  if (r && /אגוזים ושקדים ביחס .* הוסיפו לשקית (\d+) אגוזים, ועכשיו מספר האגוזים שווה למספר השקדים\. כמה שקדים/.test(t)) {
    const rt = terms(r); const added = num(t.match(/הוסיפו לשקית (\d+)/)[1]);
    const one_ = div(added, sub(rt[1], rt[0]));
    return { value: mul(one_, rt[1]) };
  }
  // 111.3: proportion stories, by what the words say
  const n = numbersIn(t).map(num);
  if (/כמה שקלים עולה מחברת אחת\?$/.test(t)) return { value: div(n[1], n[0]) };
  if (/^\d+ \S+ (?:עולות|עולים) \d+ שקלים\. כמה שקלים (?:עולות|עולים) \d+/.test(t)) return { value: mul(div(n[1], n[0]), n[2]) };
  if (/^(\d+) ק״ג \S+ עולים (\d+) שקלים\. כמה שקלים עולים (\d+) ק״ג/.test(t)) return { value: mul(div(n[1], n[0]), n[2]) };
  if (/כמה עטים קונים ב-/.test(t)) return { value: div(n[2], div(n[1], n[0])) };
  if (/^מתכון ל-\d+ אנשים צריך \d+ גרם/.test(t)) return { value: mul(div(n[1], n[0]), n[2]) };
  if (/^מכונית נוסעת \d+ ק״מ ב-\d+ שעות/.test(t)) return { value: mul(div(n[0], n[1]), n[2]) };
  if (/^במפה ס״מ אחד הוא \d+ ק״מ/.test(t)) return { value: mul(n[0], n[1]) };
  if (/^ברז ממלא \d+ ליטרים ב-\d+ דקות\. בכמה דקות ימלא/.test(t)) return { value: div(n[2], div(n[0], n[1])) };
  if (/ביצים לכל \d+ כוסות קמח\. כמה ביצים צריך ל-/.test(t)) return { value: mul(div(n[0], n[1]), n[2]) };
  if (/^מכונה ממלאת \d+ בקבוקים ב-\d+ דקות\. כמה בקבוקים תמלא ב-/.test(t)) return { value: mul(div(n[0], n[1]), n[2]) };
  return undefined;
}

// ---------------------------------------------------------------- run
const counts = {};
let recomputed = 0;
for (const lesson of lessons) {
  const where = `${lesson.subtopic_number} theory`;
  if (/<span dir="ltr">/.test(lesson.theory_content_he)) fail(where, 'an equation span without class math-line');
  const html = unstack(lesson.theory_content_he);
  if (/⁦/.test(html)) fail(where, 'an isolate in the theory (use <span dir="ltr">)');
  for (const p of html.matchAll(/<p>([\s\S]*?)<\/p>/g)) checkText(`${where} paragraph`, p[1]);
  for (const box of html.matchAll(/<div class="(?:warning|tip|formula-explanation)">([\s\S]*?)<\/div>/g)) checkText(`${where} box`, box[1]);
  for (const sp of spans(html)) checkChain(`${where} "${bare(unescape(sp))}"`, sp, null);
  checkPictures(where, html, null);
}

for (const e of exercises) {
  const lesson = lessons.find((l) => l.id === e.lesson_id);
  const sub_ = lesson.subtopic_number;
  const where = `${sub_} q${e.question_number}`;
  counts[sub_] = counts[sub_] || { easy: 0, medium: 0, hard: 0 };
  counts[sub_][e.difficulty]++;
  const options = (e.options || []).map(bare);
  const answer = bare(e.correct_answer);
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  const yesNo = options.includes('כן');
  if (options.length !== (yesNo ? 3 : 4)) fail(where, `${options.length} options`);
  if (new Set(options).size !== options.length) fail(where, 'two options are the same');
  if (!options.includes(answer)) fail(where, 'the answer is not an option');
  for (const o of options) {
    const ok = isNum(o) || /^\d+\/\d+$/.test(o) || /^\d+(?:\.\d+)?(?::\d+(?:\.\d+)?)+$/.test(o)
      || (HEBREW.test(o) && !/[0-9A-Za-z−=:]/.test(o)) || (!HEBREW.test(o) && /^[\d.:\s×÷+−=]+$/.test(o) && /=/.test(o));
    if (!ok) fail(where, `option "${o}" is not a bare number, ratio, fraction, Hebrew words or a letterless equation`);
    if (/=/.test(o)) { try { holds(o); } catch (err) { fail(where, `option "${o}": ${err.message}`); } }
  }
  const values = options.map((o) => (isNum(o) ? num(o) : /^\d+\/\d+$/.test(o) ? div(num(o.split('/')[0]), num(o.split('/')[1])) : null)).filter(Boolean);
  for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) if (same(values[i], values[j])) fail(where, 'two options have the same value');

  checkText(`${where} question`, e.question_text_he);
  checkText(`${where} explanation`, e.explanation_he, { explanation: true });
  if (/<span dir="ltr">/.test(e.explanation_picture || '')) fail(where, 'an equation span without class math-line in the explanation picture');

  const qPicture = e.question_picture ? checkPictures(`${where} question picture`, `<figure class="math-figure">${e.question_picture}</figure>`, null) : [];
  let r;
  try { r = recompute(e.question_text_he, options, qPicture); } catch (err) { fail(where, err.message); continue; }
  if (r === undefined) { fail(where, `could not re-compute "${bare(e.question_text_he)}"`); continue; }
  const expected = r.option !== undefined ? r.option : write(r.value);
  if (expected !== answer) fail(where, `answer ${answer}, re-computed ${expected}`);
  else recomputed++;
  // Equations of the question and the explanation hold, x being the answer where it appears.
  const x = /x/.test(bare(e.question_text_he)) && isNum(answer) ? num(answer) : null;
  // A question's equation is a claim unless the question asks about it ("האם", "איזו").
  if (!/^(האם|איזו)/.test(bare(e.question_text_he))) {
    for (const iso of isolates(e.question_text_he)) if (/=/.test(iso) && !/x|□/.test(iso)) checkChain(`${where} question`, iso, null);
  }
  for (const iso of isolates(e.explanation_he)) checkChain(`${where} explanation`, iso, x);
  if (e.explanation_picture) checkPictures(`${where} explanation picture`, unstack(e.explanation_picture), x);
}

for (const [s, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(s, `counts ${JSON.stringify(c)}`);
}
if (!lessons.length) fail('topic 111', 'no lessons');
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed, ${pictureCount} pictures read back`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
