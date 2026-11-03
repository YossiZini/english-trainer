// Independent check of topic 110 (decimals). Shares no code with the seeds:
// it reads the bundled JSON (or, with SEED=1, the seed module's output as
// data; with DATA=<dir>, <dir>/lessons.json and <dir>/exercises.json) and
// - re-computes every answer with its own exact arithmetic (fractions of
//   BigInts) and expression parser (+ − × ÷, parentheses, a/b, □ as the
//   missing number), from the question, or for a story from its numbers and
//   the words that say what to do with them;
// - checks every equation, comparison (<, >, =) and rounding (≈) shown in the
//   theory, the explanations, the captions and the options;
// - reads every picture back from its SVG: hundred squares (cells shaded
//   column by column, the value a caption states), number lines (even ticks,
//   labels, points on their ticks, the point A unlabelled), place-value
//   tables (each digit under its place, the point after the ones, arrows that
//   move every digit alike), column sums (points lined up, filled zeros
//   marked, the sum right), area models and equal groups;
// - enforces the reading-order rules of math-content-guide.md ("Decimal
//   numbers"): a leading zero (no .5), no decimal comma, no decimal over a
//   fraction bar, no operator, =, ≈ or negative number outside an isolate,
//   no unit inside one, glued isolates, options that are bare numbers,
//   Hebrew words or letterless comparisons, numeric options that differ by
//   value and carry no trailing zero, no explanation starting with an isolate,
//   and every equation span of the theory and captions marked math-line.
// From backend/:
//   node scripts/checks/topic110.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic110.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const TOPIC = 110;

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic110-decimals.js'));
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
const flat = (s) => String(s ?? '').replace(/ /g, ' ');
// The export stacks a/b in the theory and the pictures' captions; read them as a/b again.
const FRAC = /<span class="frac">(?:<span class="frac-whole">(\d+)<\/span>)?<span class="frac-stack"><span class="frac-num">([^<]*)<\/span><span class="frac-den">([^<]*)<\/span><\/span><\/span>/g;
const unstack = (html) => String(html ?? '').replace(FRAC, (m, w, n, d) => `${w ? `${w} ` : ''}${n}/${d}`);
const stackedDecimal = (html) => [...String(html ?? '').matchAll(FRAC)].some((m) => /\./.test(m[2] + m[3]));
const bare = (s) => flat(s).replace(/[⁦-⁩]/g, '');
const unescape = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

// ---------------------------------------------------------------- exact numbers (fractions of BigInts)
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d === 0n) throw new Error('division by 0'); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const add = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const neg = (a) => Q(-a.n, a.d);
const mul = (a, b) => Q(a.n * b.n, a.d * b.d);
const div = (a, b) => Q(a.n * b.d, a.d * b.n);
const cmp = (a, b) => { const v = a.n * b.d - b.n * a.d; return v > 0n ? 1 : v < 0n ? -1 : 0; };
const same = (a, b) => cmp(a, b) === 0;
/** A decimal or a whole number as written ("2.36", "7") → exact. */
function dec(s) {
  const m = String(s).trim().match(/^(\d+)(?:\.(\d+))?$/);
  if (!m) throw new Error(`not a decimal: "${s}"`);
  return Q(BigInt(m[1] + (m[2] || '')), 10n ** BigInt((m[2] || '').length));
}
const isDec = (s) => /^\d+(?:\.\d+)?$/.test(String(s).trim());
/** Written the lessons' way: a leading zero, no trailing zeros; null when it does not end. */
function write(q) {
  let p = 0; // the fewest digits after the point that hold q exactly
  while (10n ** BigInt(p) % q.d !== 0n) { p++; if (p > 12) return null; }
  const scaled = q.n * (10n ** BigInt(p) / q.d);
  const neg = scaled < 0n; const abs = neg ? -scaled : scaled;
  const s = abs.toString().padStart(p + 1, '0');
  const whole = p ? s.slice(0, -p) : s;
  const frac = p ? s.slice(-p).replace(/0+$/, '') : '';
  return `${neg ? '−' : ''}${whole}${frac ? `.${frac}` : ''}`;
}
/** Rounded half up to k digits after the point. */
function roundTo(q, k) {
  const unit = 10n ** BigInt(k);
  const scaled = q.n * unit * 2n + q.d; // 2·q·10^k + 1, over 2d: floor gives half up
  return Q(scaled / (2n * q.d), unit);
}
const placesOf = (s) => (String(s).split('.')[1] || '').length;

// ---------------------------------------------------------------- expressions
/** Value of an expression of decimals, a/b, + − × ÷ and parentheses; □ makes it a linear form { a, b } (a·□ + b). */
function evaluate(text) {
  const src = bare(unescape(text)).replace(/\s+/g, '');
  let i = 0;
  const L = (a, b) => ({ a, b });
  const peek = () => src[i];
  function factor() {
    if (peek() === '(') { i++; const v = sum(); if (src[i++] !== ')') throw new Error(`no ")" in ${src}`); return v; }
    if (peek() === '□') { i++; return L(Q(1), Q(0)); }
    const m = src.slice(i).match(/^\d+(?:\.\d+)?/);
    if (!m) throw new Error(`cannot read "${src.slice(i)}" in ${src}`);
    i += m[0].length;
    let v = dec(m[0]);
    if (peek() === '/' && /\d/.test(src[i + 1] || '')) { i++; const d = src.slice(i).match(/^\d+/)[0]; i += d.length; v = div(v, dec(d)); }
    return L(Q(0), v);
  }
  function product() {
    let v = factor();
    while (peek() === '×' || peek() === '÷') {
      const op = src[i++]; const w = factor();
      if (op === '×') {
        if (v.a.n && w.a.n) throw new Error('□ × □');
        v = v.a.n ? L(mul(v.a, w.b), mul(v.b, w.b)) : L(mul(w.a, v.b), mul(w.b, v.b));
      } else {
        if (w.a.n) throw new Error('÷ □');
        v = L(div(v.a, w.b), div(v.b, w.b));
      }
    }
    return v;
  }
  function sum() {
    let v = product();
    while (peek() === '+' || peek() === '−') {
      const op = src[i++]; const w = product();
      v = op === '+' ? L(add(v.a, w.a), add(v.b, w.b)) : L(add(v.a, neg(w.a)), add(v.b, neg(w.b)));
    }
    return v;
  }
  const v = sum();
  if (i !== src.length) throw new Error(`cannot read "${src.slice(i)}" in ${src}`);
  return v;
}
const value = (text) => { const v = evaluate(text); if (v.a.n) throw new Error(`□ in ${text}`); return v.b; };

/**
 * A chain of relations ("0.3 × 0.2 = 0.06", "0.405 < 0.45 < 0.5", "2.47 ≈ 2.5"):
 * true when every link holds. ≈ rounds the left side to the places of the right.
 */
function holds(chain) {
  const parts = bare(unescape(chain)).split(/\s*(<|>|=|≈)\s*/);
  if (parts.length < 3) return null; // no relation
  for (let k = 0; k + 2 < parts.length; k += 2) {
    const left = value(parts[k]), rel = parts[k + 1], right = value(parts[k + 2]);
    const c = cmp(left, right);
    if (rel === '<' && c !== -1) return false;
    if (rel === '>' && c !== 1) return false;
    if (rel === '=' && c !== 0) return false;
    if (rel === '≈' && !same(roundTo(left, placesOf(parts[k + 2].trim())), right)) return false;
  }
  return true;
}
function checkChain(where, chain) {
  try {
    if (holds(chain) === false) fail(where, `"${bare(chain)}" is false`);
  } catch (e) { fail(where, `"${bare(chain)}": ${e.message}`); }
}

// ---------------------------------------------------------------- reading order (guide: "Decimal numbers")
// The raw text: a no-break space is not a plain space here (the glue check reads them).
const isolates = (s) => [...String(s ?? '').matchAll(/⁦([^⁩]*)⁩/g)].map((m) => m[1]);
const spans = (s) => [...String(s).matchAll(/<span dir="ltr"(?: class="math-line")?>(.*?)<\/span>/g)].map((m) => m[1]);
const outside = (s) => unescape(String(s).replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/⁦[^⁩]*⁩/g, ' ').replace(/<span dir="ltr"[^>]*>.*?<\/span>/g, ' ').replace(/<[^>]+>/g, ' '));
/** Every equation span keeps its line on the website (class math-line: a stacked fraction would break it). */
const unmarked = (html) => /<span dir="ltr">/.test(String(html ?? ''));
function checkText(where, s, { explanation = false } = {}) {
  const raw = String(s ?? '');
  const text = outside(raw);
  if (/(^|[^\d])\.\d/.test(text) || /(^|[^\d])\.\d/.test(bare(raw).replace(/<[^>]+>/g, ' '))) fail(where, 'a decimal without its leading zero (.5)');
  if (/\d,\d/.test(bare(raw))) fail(where, 'a decimal comma');
  if (/\d\.\d+\/\d|\d\/\d+\.\d/.test(bare(raw))) fail(where, 'a decimal over a fraction bar');
  if (/[+×÷=≈<>]/.test(text)) fail(where, `an operator, =, ≈ or a comparison outside an isolate: "${text.trim().slice(0, 60)}"`);
  if (/[−-]\s*\d/.test(text.replace(/[א-ת]-\d/g, ''))) fail(where, 'a negative number or a minus outside an isolate');
  for (const iso of isolates(raw)) {
    if (/₪|[֐-׿]/.test(iso)) fail(where, `a unit or a Hebrew word inside an isolate: "${iso}"`);
    if (/ /.test(iso)) fail(where, `an isolate with plain spaces (not glued): "${iso}"`);
  }
  for (const sp of spans(raw)) if (/ /.test(sp)) fail(where, `a span with plain spaces (not glued): "${sp}"`);
  if (explanation && /^⁦/.test(raw)) fail(where, 'starts with an isolate');
}

// ---------------------------------------------------------------- pictures
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}="([^"]*)"`)); return m ? m[1] : null; };
/** The figures of an HTML fragment: { svg, caption } (a picture outside a figure has no caption). */
function figures(html) {
  const out = [];
  const s = String(html || '');
  for (const f of s.matchAll(/<figure class="math-figure">([\s\S]*?)<\/figure>/g)) {
    const caption = (f[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/) || [, ''])[1];
    out.push({ svgs: [...f[1].matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]), caption });
  }
  if (!out.length && /<svg/.test(s)) out.push({ svgs: [...s.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]), caption: '' });
  return out;
}
/** The numbers a caption states: decimals and "N מאיות / עשיריות / משבצות" as values (a square's parts for משבצות). */
function stated(caption, parts = 100) {
  const text = bare(unescape(String(caption).replace(/<[^>]+>/g, ' '))).replace(/\d+\/\d+/g, ' ');
  const vals = [...text.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]);
  const counted = [...text.matchAll(/(\d+) (מאיות|עשיריות|משבצות)/g)].map((m) => div(dec(m[1]), Q(m[2] === 'מאיות' ? 100 : m[2] === 'עשיריות' ? 10 : parts)));
  return { decimals: vals.filter((v) => v.includes('.')).map(dec), counted, all: vals.map(dec) };
}

/** A hundred square: { parts, a, b } read from its cells, checked against its attributes and the column-first order. */
function readSquare(where, svg) {
  const g = svg.match(/<g data-hundred="1"[^>]*>/)[0];
  const parts = Number(attr(g, 'data-parts'));
  const cells = [...svg.matchAll(/<rect data-cell="(\w)" x="([\d.]+)" y="([\d.]+)"/g)].map((m) => ({ k: m[1], x: Number(m[2]), y: Number(m[3]) }));
  if (cells.length !== parts) fail(where, `${cells.length} cells in a square of ${parts}`);
  cells.sort((p, q) => p.x - q.x || p.y - q.y);
  const kinds = cells.map((c) => c.k).join('');
  if (!/^a*b*0*$/.test(kinds)) fail(where, 'the shaded cells are not the first ones, column by column');
  const a = (kinds.match(/a/g) || []).length, b = (kinds.match(/b/g) || []).length;
  if (String(a) !== attr(g, 'data-shaded') || String(b) !== attr(g, 'data-extra')) fail(where, 'the cells disagree with the square\'s attributes');
  return { parts, a, b };
}

/** A decimal number line: ticks, labels and points, checked; returns { ticks: Map value→x, points: [{ at, x, label }] }. */
function readLine(where, svg) {
  const ticks = [...svg.matchAll(/<line data-tick="([\d.]+)" x1="([\d.]+)"/g)].map((m) => ({ v: m[1], x: Number(m[2]) }));
  const steps = ticks.slice(1).map((t, i) => sub(dec(t.v), dec(ticks[i].v)));
  if (steps.some((s) => !same(s, steps[0])) || !steps.length || cmp(steps[0], Q(0)) <= 0) fail(where, 'the ticks do not grow by one step');
  const gaps = ticks.slice(1).map((t, i) => t.x - ticks[i].x);
  if (gaps.some((g) => Math.abs(g - gaps[0]) > 0.15)) fail(where, 'the ticks are not evenly spaced');
  const at = new Map(ticks.map((t) => [write(dec(t.v)), t.x]));
  for (const m of svg.matchAll(/<text data-label="([\d.]+)" x="([\d.]+)"[^>]*>([^<]*)</g)) {
    if (m[1] !== m[3] || at.get(write(dec(m[1]))) !== Number(m[2])) fail(where, `label "${m[3]}" is not under its tick`);
  }
  const points = [...svg.matchAll(/<circle data-point="([\d.]+)" cx="([\d.]+)"[^>]*\/><text x="([\d.]+)"[^>]*>([^<]*)</g)]
    .map((m) => ({ at: m[1], x: Number(m[2]), label: m[4] }));
  for (const p of points) {
    if (at.get(write(dec(p.at))) !== p.x) fail(where, `point ${p.at} is not on its tick`);
    if (p.label !== 'A' && p.label !== p.at) fail(where, `point ${p.at} labelled "${p.label}"`);
  }
  const labelled = new Set([...svg.matchAll(/data-label="([\d.]+)"/g)].map((m) => write(dec(m[1]))));
  return { ticks: at, points, labelled };
}
const sub = (a, b) => add(a, neg(b));

const PLACES = ['thousands', 'hundreds', 'tens', 'ones', 'tenths', 'hundredths', 'thousandths'];
const HEAD = { 'אלפים': 'thousands', 'מאות': 'hundreds', 'עשרות': 'tens', 'אחדות': 'ones', 'עשיריות': 'tenths', 'מאיות': 'hundredths', 'אלפיות': 'thousandths' };
/** A place-value table: the number of each row, each digit under its own header; arrows checked. */
function readTable(where, svg) {
  const heads = new Map([...svg.matchAll(/<text x="([\d.]+)" y="17"[^>]*>([^<]+)</g)].map((m) => [HEAD[m[2]], Number(m[1])]));
  const xs = [...heads.values()];
  if (xs.some((x, i) => i && x <= xs[i - 1])) fail(where, 'the headers are not in place order');
  const rows = new Map();
  for (const m of svg.matchAll(/data-row="(\d)" data-place="(\w+)" data-digit="(\d)" x="([\d.]+)"[^>]*>(\d)</g)) {
    const [, r, place, d, x, shown] = m;
    if (d !== shown) fail(where, `digit ${shown} carries ${d}`);
    if (heads.get(place) !== Number(x)) fail(where, `a ${place} digit is not under its header`);
    if (!rows.has(r)) rows.set(r, {});
    rows.get(r)[place] = d;
  }
  const pointX = [...svg.matchAll(/data-row="(\d)" data-point="1" x="([\d.]+)"/g)].map((m) => [m[1], Number(m[2])]);
  const numbers = [...rows.entries()].map(([r, ds]) => {
    const whole = PLACES.slice(0, 4).map((p) => ds[p] ?? '').join('').replace(/^0+(?=\d)/, '') || '0';
    const frac = PLACES.slice(4).map((p) => ds[p] ?? '').join('');
    const hasPoint = pointX.some(([pr]) => pr === r);
    if (frac && !hasPoint) fail(where, `row ${r} has digits after the point but no point`);
    for (const [, x] of pointX.filter(([pr]) => pr === r)) {
      if (!(x > (heads.get('ones') ?? -Infinity) && x < (heads.get('tenths') ?? Infinity))) fail(where, `the point of row ${r} is not between ones and tenths`);
    }
    return frac ? `${whole}.${frac}` : whole;
  });
  const arrows = [...svg.matchAll(/data-arrow="(\w+)>(\w+)"/g)].map((m) => PLACES.indexOf(m[1]) - PLACES.indexOf(m[2]));
  if (arrows.length) {
    if (arrows.some((k) => k !== arrows[0])) fail(where, 'the arrows do not move every digit alike');
    const factor = arrows[0] > 0 ? Q(10n ** BigInt(arrows[0])) : Q(1n, 10n ** BigInt(-arrows[0]));
    if (!same(mul(dec(numbers[0]), factor), dec(numbers[1]))) fail(where, `${numbers[0]} moved ${arrows[0]} places is not ${numbers[1]}`);
  }
  const mark = (svg.match(/data-mark="(\w+)"/) || [])[1];
  return { numbers, mark, marked: mark ? (rows.get('0') || {})[mark] : null };
}

/** A column sum: each row as written, the points lined up, the filled zeros marked, the sum right. */
function readColumn(where, svg) {
  const op = svg.match(/data-column="([^"]+)"/)[1];
  const rows = {};
  for (const m of svg.matchAll(/<g data-row="(\w+)" data-value="([\d.]+)">([\s\S]*?)<\/g>/g)) {
    const chars = [...m[3].matchAll(/<text x="([\d.]+)" y="[\d.]+"( data-filled="1")?[^>]*>([^<]+)</g)]
      .map((c) => ({ x: Number(c[1]), filled: !!c[2], ch: c[3] })).filter((c) => /[\d.]/.test(c.ch)).sort((p, q) => p.x - q.x);
    rows[m[1]] = { value: m[2], written: chars.map((c) => c.ch).join(''), chars };
  }
  const p = Math.max(...Object.values(rows).map((r) => placesOf(r.value)));
  for (const [name, r] of Object.entries(rows)) {
    if (!same(dec(r.written), dec(r.value))) fail(where, `${name} row shows ${r.written}, not ${r.value}`);
    if (placesOf(r.written) !== p) fail(where, `${name} row ${r.written} is not filled to ${p} places`);
    const filled = r.chars.filter((c) => c.filled).length;
    if (filled !== p - placesOf(r.value)) fail(where, `${name} row marks ${filled} filled zeros`);
  }
  const points = Object.values(rows).map((r) => (r.chars.find((c) => c.ch === '.') || {}).x);
  if (p && new Set(points).size !== 1) fail(where, 'the points are not lined up');
  const lastX = Object.values(rows).map((r) => r.chars[r.chars.length - 1].x);
  if (new Set(lastX).size !== 1) fail(where, 'the last digits are not in one column');
  const t = dec(rows.top.value), b = dec(rows.bottom.value), r = dec(rows.result.value);
  if (!same(op === '+' ? add(t, b) : sub(t, b), r)) fail(where, `${rows.top.value} ${op} ${rows.bottom.value} is not ${rows.result.value}`);
  return { op, top: rows.top.value, bottom: rows.bottom.value, result: rows.result.value };
}

/**
 * Every picture of a fragment: read back, and matched to what its caption
 * states. Returns the question picture's reading (a square or a line).
 */
let pictureCount = 0;
function checkPictures(where, html) {
  const read = [];
  for (const f of figures(html)) {
    const cap = stated(f.caption);
    const capText = bare(unescape(String(f.caption).replace(/<[^>]+>/g, ' ')));
    for (const sp of spans(f.caption)) checkChain(`${where} caption`, sp);
    if (f.caption) checkText(`${where} caption`, f.caption);
    const squares = [];
    for (const svg of f.svgs) {
      pictureCount++;
      if (/data-hundred="1"/.test(svg)) {
        const s = readSquare(where, svg);
        squares.push(div(Q(s.a + s.b), Q(s.parts)));
        read.push({ kind: 'square', value: div(Q(s.a + s.b), Q(s.parts)) });
      } else if (/data-line="1"/.test(svg)) {
        const l = readLine(where, svg);
        read.push({ kind: 'line', ...l });
        for (const p of l.points) if (p.label !== 'A' && f.caption && !cap.all.some((v) => same(v, dec(p.at)))) fail(where, `the caption does not name point ${p.at}`);
      } else if (/data-place-value="1"/.test(svg)) {
        const t = readTable(where, svg);
        for (const d of cap.decimals) if (!t.numbers.some((n) => same(dec(n), d))) fail(where, `the caption's ${write(d)} is not a row of the table`);
        const said = capText.match(/הספרה (\d)|(אפס) במקום/);
        if (said && t.mark && (said[1] || '0') !== t.marked) fail(where, `the caption names digit ${said[1] || '0'}, the marked one is ${t.marked}`);
        const ofNumber = capText.match(/של (\d+\.\d+) היא (\d)/);
        if (ofNumber && t.mark && ofNumber[2] !== t.marked) fail(where, `the caption says ${ofNumber[2]}, the marked digit is ${t.marked}`);
      } else if (/data-column=/.test(svg)) {
        readColumn(where, svg);
      } else if (/fill="#b3421e"/.test(svg)) {
        // The area model of a product: the darker cells are the product, in hundredths.
        const dark = (svg.match(/fill="#b3421e"/g) || []).length;
        const v = div(Q(dark), Q(100));
        if (f.caption && !cap.all.concat(cap.counted).some((x) => same(x, v) || same(x, Q(dark)))) fail(where, `the area model shows ${dark} hundredths, the caption does not say so`);
      } else if (/קבוצות של/.test(svg)) {
        const [, n, each] = svg.match(/aria-label="(\d+) קבוצות של (\d+)"/);
        const dots = (svg.match(/<circle/g) || []).length;
        if (dots !== Number(n) * Number(each)) fail(where, `${dots} dots in ${n} groups of ${each}`);
        const said = capText.match(/(\d+) קבוצות של (\d+)/);
        if (said && (said[1] !== n || said[2] !== each)) fail(where, `the caption says ${said[1]} groups of ${said[2]}, the picture ${n} of ${each}`);
        const total = capText.match(/^(\d+) \S+ בקבוצות של (\d+)/);
        if (total && (Number(total[1]) !== dots || total[2] !== each)) fail(where, `the caption says ${total[1]} in groups of ${total[2]}, the picture ${dots} in ${each}s`);
      } else if (/חילוק ארוך/.test(svg)) {
        // A long division: its label is the division the caption shows.
        const [, a, b] = svg.match(/aria-label="חילוק ארוך: (\d+) ÷ (\d+)"/);
        if (!spans(f.caption).some((sp) => bare(unescape(sp)).startsWith(`${a} ÷ ${b} =`))) fail(where, `the long division ${a} ÷ ${b} is not the caption's`);
      } else {
        fail(where, 'a picture the check cannot read');
      }
    }
    // A square (or two side by side) shows a value the caption states.
    if (squares.length && f.caption) {
      const shown = squares.reduce(add, Q(0));
      const values = [...cap.decimals, ...cap.counted, ...cap.all];
      const each = squares.every((v) => values.some((x) => same(x, v)));
      if (!values.some((x) => same(x, shown)) && !each) fail(where, `the square shows ${write(shown)}, the caption does not say so`);
    }
  }
  return read;
}

// ---------------------------------------------------------------- re-computing answers
const WORDS = { 'אחד': 1, 'אחת': 1, 'שתיים': 2, 'שלוש': 3, 'ארבע': 4, 'חמש': 5, 'שש': 6, 'שבע': 7 };
const numbersIn = (text) => [...bare(text).matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]);
const valueOf = (o) => (isDec(o) ? dec(o) : /^\d+\/\d+$/.test(o) ? value(o) : null);

/** Stories: what to do with the numbers of the story, by the words that say it. */
const STORIES = [
  [/איזה חלק מהשוקולד נשאר/, (n) => div(sub(dec(n[0]), dec(n[1])), dec(n[0]))],
  [/כמה שקלים הם (\d+) מטבעות של 10 אגורות/, (n, t) => mul(dec(t.match(/כמה שקלים הם (\d+) מטבעות/)[1]), Q(1, 10))],
  [/כמה אגורות הן/, (n) => mul(dec(n[0]), Q(100))],
  [/בעיגול לשלם/, (n) => roundTo(dec(n[0]), 0)],
  [/בעיגול לעשירית/, (n) => roundTo(dec(n[0]), 1)],
  [/קיבל עוד/, (n) => add(dec(n[0]), dec(n[1]))],
  [/ושתו מהם .* כמה ליטרים נשארו/, (n) => sub(dec(n[0]), dec(n[1]))],
  [/כמה עודף/, (n) => sub(dec(n[n.length - 1]), n.slice(0, -1).map(dec).reduce(add))],
  [/סכום של שני מספרים הוא .* מהו המספר השני/, (n) => sub(dec(n[0]), dec(n[1]))],
  [/בסך הכול/, (n) => n.map(dec).reduce(add)],
  [/יותר מהחולצה/, (n) => add(dec(n[0]), dec(n[1]))],
  [/גבוהה ממנו ב-/, (n) => add(dec(n[0]), dec(n[1]))],
  [/חתכו .* כמה מטרים נשארו/, (n) => n.slice(1).map(dec).reduce((v, x) => sub(v, x), dec(n[0]))],
  [/^קילוגרם .* עולה .* כמה שקלים עולים/, (n) => mul(dec(n[0]), dec(n[1]))],
  [/חותכים לחתיכות של/, (n) => div(dec(n[0]), dec(n[1]))],
  [/^(\S+) מחברות עולות .* כמה שקלים עולה מחברת אחת/, (n, t) => div(dec(n[0]), Q(WORDS[t.split(' ')[0]]))],
  [/כמה ליטרים קונים ב-/, (n) => div(dec(n[1]), dec(n[0]))],
  [/שטח המלבן/, (n) => mul(dec(n[0]), dec(n[1]))]
];

/** The number of "A שלמים ו-B מאיות" or "4 עשיריות ו-12 מאיות" or "שלם אחד וחמש עשיריות". */
function described(t) {
  let v = Q(0), any = false;
  const unit = { 'שלמים': Q(1), 'שלם': Q(1), 'עשיריות': Q(1, 10), 'מאיות': Q(1, 100) };
  for (const m of t.matchAll(/(?:(\d+|אחד|אחת|חמש|שבע) )?(שלמים|שלם|עשיריות|מאיות)(?: (אחד))?/g)) {
    const k = m[1] ? (WORDS[m[1]] ?? Number(m[1])) : m[3] ? 1 : null;
    if (k === null) continue;
    v = add(v, mul(Q(k), unit[m[2]])); any = true;
  }
  return any ? v : null;
}

/** The answer the question asks for, as an option's text, or a value (a number) to be written. */
function recompute(q, options, picture) {
  const t = bare(q).trim();
  let m;
  const one = (pred, what) => {
    const ok = options.filter(pred);
    if (ok.length !== 1) throw new Error(`${ok.length} options are ${what}`);
    return { option: ok[0] };
  };
  if ((m = t.match(/^איזה שבר עשרוני שווה ל-(\d+)\/(\d+)\?$/))) return { value: div(dec(m[1]), dec(m[2])) };
  if ((m = t.match(/איזה שבר (?:באמת )?שווה (?:באמת )?ל-(\d+(?:\.\d+)?)\?$/))) return one((o) => /^\d+\/\d+$/.test(o) && same(value(o), dec(m[1])), `fractions equal to ${m[1]}`);
  if ((m = t.match(/^מהי ספרת (העשיריות|המאיות) במספר (\d+\.\d+)\?$/))) {
    const frac = m[2].split('.')[1].padEnd(2, '0');
    return { option: frac[m[1] === 'העשיריות' ? 0 : 1] };
  }
  if (/^כמה מאיות יש בעשירית אחת\?$/.test(t)) return { value: div(Q(1, 10), Q(1, 100)) };
  if ((m = t.match(/^מה הערך של הספרה (\d) במספר (\d+\.\d+)\?$/))) {
    const [w, f] = m[2].split('.');
    const digits = w + f, at = digits.indexOf(m[1]);
    if (at < 0 || digits.indexOf(m[1], at + 1) >= 0) throw new Error('the digit is not in the number once');
    const exp = w.length - 1 - at; // 0 for ones, −1 for tenths, −2 for hundredths
    return { value: exp >= 0 ? mul(dec(m[1]), Q(10n ** BigInt(exp))) : div(dec(m[1]), Q(10n ** BigInt(-exp))) };
  }
  if ((m = t.match(/^איזה מספר הוא (.+)\?$/)) && !/הגדול|הקטן/.test(t)) { const v = described(m[1]); if (v) return { value: v }; }
  if ((m = t.match(/^מה התוצאה של (.+)\?$/))) return { value: value(m[1]) };
  if ((m = t.match(/^(.+) = \?$/))) return { value: value(m[1]) };
  if (/מתאים לחלק הצבוע|מתאים לכל החלק הצבוע/.test(t)) {
    const sq = picture.find((p) => p.kind === 'square');
    if (!sq) throw new Error('no square to read');
    return { value: sq.value };
  }
  if ((m = t.match(/^איזה מספר שווה ל-(\d+\.\d+)\?$/))) return one((o) => isDec(o) && same(dec(o), dec(m[1])), `equal to ${m[1]}`);
  if ((m = t.match(/^איזה מספר נמצא בדיוק באמצע בין (\d+(?:\.\d+)?) ל-(\d+(?:\.\d+)?)\?$/))) return { value: div(add(dec(m[1]), dec(m[2])), Q(2)) };
  if ((m = t.match(/^איזה מספר (?:נמצא בין |גדול מ-)(\d+(?:\.\d+)?) (?:ל-|וקטן מ-)(\d+(?:\.\d+)?)\?$/))) {
    return one((o) => isDec(o) && cmp(dec(o), dec(m[1])) > 0 && cmp(dec(o), dec(m[2])) < 0, `between ${m[1]} and ${m[2]}`);
  }
  if ((m = t.match(/(הגדול|הקטן|הנמוך|הגבוה) ביותר\?$/))) {
    const big = m[1] === 'הגדול' || m[1] === 'הגבוה';
    const nums = options.filter(isDec);
    if (nums.length !== options.length) throw new Error('an option is not a number');
    // A story's options are the numbers it lists.
    const listed = numbersIn(t);
    if (listed.length && listed.sort().join() !== [...options].sort().join()) throw new Error('the options are not the numbers of the story');
    const best = nums.reduce((x, y) => (cmp(dec(y), dec(x)) * (big ? 1 : -1) > 0 ? y : x));
    return { option: best };
  }
  if (/^(איזה משפט נכון|איזה תרגיל נכון|איזה סדר נכון, מהקטן לגדול)\?$/.test(t)) {
    if (/סדר/.test(t) && !options.every((o) => /^[\d.]+( < [\d.]+)+$/.test(o))) throw new Error('an order option is not a chain of <');
    return one((o) => holds(o) === true, 'true');
  }
  if ((m = t.match(/^עגלו את (\d+\.\d+) (לשלם|לעשירית)\.$/))) return { value: roundTo(dec(m[1]), m[2] === 'לשלם' ? 0 : 1) };
  if (/^איזה מספר מסומן באות A\?$/.test(t)) {
    const line = picture.find((p) => p.kind === 'line');
    const a = line && line.points.find((p) => p.label === 'A');
    if (!a) throw new Error('no point A to read');
    if (line.labelled.has(write(dec(a.at)))) throw new Error('the tick of A is labelled: the answer shows');
    return { value: dec(a.at) };
  }
  if ((m = t.match(/^מהי הספרה הקטנה ביותר שאפשר לכתוב במקום הריבוע, כדי ש-(\d+)\.□(\d+) יהיה גדול מ-(\d+\.\d+)\?$/))) {
    for (let d = 0; d <= 9; d++) if (cmp(dec(`${m[1]}.${d}${m[2]}`), dec(m[3])) > 0) return { option: String(d) };
    throw new Error('no digit fits');
  }
  if ((m = t.match(/^מספר עוגל לעשירית, והתקבל (\d+\.\d+)\. איזה מספר יכול להיות המספר\?$/))) {
    return one((o) => isDec(o) && same(roundTo(dec(o), 1), dec(m[1])), `rounding to ${m[1]}`);
  }
  if ((m = t.match(/^מהו המספר החסר\? (.+) = (.+)$/))) {
    const l = evaluate(m[1]), r = evaluate(m[2]);
    const a = sub(l.a, r.a), b = sub(r.b, l.b);
    if (!a.n) throw new Error('□ cancels out');
    return { value: div(b, a) };
  }
  if ((m = t.match(/^בלי לחשב: איזו מכפלה קטנה מ-(\d+)\?$/))) return one((o) => cmp(value(o), dec(m[1])) < 0, `less than ${m[1]}`);
  if ((m = t.match(/דנה קפצה .* מי קפצה הכי רחוק\?$/))) {
    const jumps = [...t.matchAll(/(\S+) (?:קפצה )?(\d+(?:\.\d+)?) מטרים/g)].map((x) => [x[1].replace(/^ו/, ''), dec(x[2])]);
    if (jumps.length !== 3 || !jumps.every(([name]) => options.includes(name))) throw new Error('the jumpers are not the options');
    const best = jumps.reduce((x, y) => (cmp(y[1], x[1]) > 0 ? y : x));
    if (jumps.filter((j) => same(j[1], best[1])).length > 1) return { option: 'שלושתן קפצו אותו מרחק' };
    return { option: best[0] };
  }
  for (const [re, f] of STORIES) if (re.test(t)) return { value: f(numbersIn(t), t), story: true };
  return undefined;
}

// ---------------------------------------------------------------- run
const counts = {};
let recomputed = 0;
for (const lesson of lessons) {
  const where = `${lesson.subtopic_number} theory`;
  if (stackedDecimal(lesson.theory_content_he)) fail(where, 'a decimal over a fraction bar');
  if (unmarked(lesson.theory_content_he)) fail(where, 'an equation span without class math-line');
  const html = unstack(lesson.theory_content_he);
  if (/⁦/.test(html)) fail(where, 'an isolate in the theory (use <span dir="ltr">)');
  for (const p of html.matchAll(/<p>([\s\S]*?)<\/p>/g)) checkText(`${where} paragraph`, p[1]);
  for (const box of html.matchAll(/<div class="(?:warning|tip|formula-explanation)">([\s\S]*?)<\/div>/g)) checkText(`${where} box`, box[1]);
  for (const sp of spans(html)) checkChain(`${where} "${bare(unescape(sp))}"`, sp);
  checkPictures(where, html);
}

for (const e of exercises) {
  const lesson = lessons.find((l) => l.id === e.lesson_id);
  const sub_ = lesson.subtopic_number;
  const where = `${sub_} q${e.question_number}`;
  counts[sub_] = counts[sub_] || { easy: 0, medium: 0, hard: 0 };
  counts[sub_][e.difficulty]++;
  const options = (e.options || []).map((o) => bare(o));
  const answer = bare(e.correct_answer);
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  const comparisons = options.every((o) => /[<>=]/.test(o));
  if (options.length !== 4 && !(options.length === 3 && comparisons)) fail(where, `${options.length} options`);
  if (new Set(options).size !== options.length) fail(where, 'two options are the same');
  if (!options.includes(answer)) fail(where, 'the answer is not an option');
  // Options: bare numbers, fractions, one digit, Hebrew words, or letterless comparisons and expressions.
  for (const o of options) {
    const ok = isDec(o) || /^\d+\/\d+$/.test(o) || (HEBREW.test(o) && !/[0-9A-Za-z₪−=<>]/.test(o))
      || (!HEBREW.test(o) && /^[\d.\s×÷+−<>=]+$/.test(o) && /[×÷+−<>=]/.test(o));
    if (!ok) fail(where, `option "${o}" is not a bare number, a fraction, Hebrew words or a comparison`);
    if (/₪/.test(o)) fail(where, `option "${o}" carries a unit`);
    if (isDec(o) && /\.\d*0$/.test(o) && !/שווה ל-/.test(bare(e.question_text_he))) fail(where, `option "${o}" has a trailing zero`);
    if (/[\d.]/.test(o) && !HEBREW.test(o)) checkText(`${where} option`, o.replace(/[<>=×÷+−]/g, ' '));
    if (/[<>=]/.test(o)) { try { holds(o); } catch (err) { fail(where, `option "${o}": ${err.message}`); } }
  }
  const numeric = options.map(valueOf).filter(Boolean);
  for (let i = 0; i < numeric.length; i++) for (let j = i + 1; j < numeric.length; j++) if (same(numeric[i], numeric[j])) fail(where, 'two options have the same value');

  checkText(`${where} question`, e.question_text_he);
  checkText(`${where} explanation`, e.explanation_he, { explanation: true });
  for (const iso of isolates(e.question_text_he)) if (!/[=?]/.test(iso)) checkChain(`${where} question`, iso);
  for (const iso of isolates(e.explanation_he)) checkChain(`${where} explanation`, iso);

  const qPicture = e.question_picture ? checkPictures(`${where} question picture`, `<figure class="math-figure">${e.question_picture}</figure>`) : [];
  if (stackedDecimal(e.explanation_picture)) fail(where, 'a decimal over a fraction bar in the explanation picture');
  if (unmarked(e.explanation_picture)) fail(where, 'an equation span without class math-line in the explanation picture');
  if (e.explanation_picture) checkPictures(`${where} explanation picture`, unstack(e.explanation_picture));

  let r;
  try { r = recompute(e.question_text_he, options, qPicture); } catch (err) { fail(where, err.message); continue; }
  if (r === undefined) { fail(where, `could not re-compute "${bare(e.question_text_he)}"`); continue; }
  const expected = r.option !== undefined ? r.option : write(r.value);
  if (expected === null) { fail(where, 'the answer does not end'); continue; }
  if (expected !== answer) fail(where, `answer ${answer}, re-computed ${expected}`);
  else recomputed++;
}

for (const [s, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(s, `counts ${JSON.stringify(c)}`);
}
if (!lessons.length) fail('topic 110', 'no lessons');
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed, ${pictureCount} pictures read back`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
