// Independent check of topic 112 (linear functions). Shares no code with the
// seeds: it reads the bundled JSON (or, with SEED=1, the seed module's output
// as data; with DATA=<dir>, <dir>/lessons.json and <dir>/exercises.json) and
// - re-computes every answer with its own exact arithmetic (fractions of
//   BigInts) from the words of the question: a rule's value, the x that gives
//   a y, points on a line, the slope and the crossings, the rule through two
//   points, the stories (a taxi, savings, candles, a plan) and the graphs;
// - checks every equation shown: numbers that must be equal are, an equation
//   in one letter has one solution and every step of an explanation agrees on
//   it, a rule is written the textbook way (y = 2x + 1, y = −x + 3, y = 3x, y = −2);
// - reads every picture back from its SVG: each whole line from its two ends
//   in pixels (they must sit on the grid's edge; the two ends give the slope
//   and the intercept), the points, the steps of a slope (the arrow's label is
//   the rise, and rise ÷ run is the slope of the line the step starts on), the
//   labels of lines and segments, and tables of values (one rule for all
//   columns, every step right); a caption's rules and points must be drawn,
//   and a point said to be on the line (or not) must be (or not);
// - enforces the reading-order rules of math-content-guide.md ("Linear
//   functions"): no =, operator, minus or point outside an isolate, two bare
//   Latin letters never with only a comma, colon or space between them, glued
//   isolates, no question, explanation or caption starting with a Latin
//   letter or an isolate, equation spans marked math-line, options that are
//   bare numbers, fractions, points, glued rules, letters or Hebrew words.
// From backend/:
//   node scripts/checks/topic112.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic112.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
const TOPIC = 112;

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic112-functions.js'));
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
const NBSP = ' ', LRI = '⁦', PDI = '⁩', MINUS = '−';
const bare = (s) => String(s ?? '').replace(/ /g, ' ').replace(/[⁦-⁩]/g, '');
const unescape = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const FRAC = /<span class="frac">(?:<span class="frac-whole">(\d+)<\/span>)?<span class="frac-stack"><span class="frac-num">([^<]*)<\/span><span class="frac-den">([^<]*)<\/span><\/span><\/span>/g;
const unstack = (html) => String(html ?? '').replace(FRAC, (m, w, n, d) => `${w ? `${w} ` : ''}${n}/${d}`);

// ---------------------------------------------------------------- exact numbers
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d === 0n) throw new Error('division by 0'); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const ZERO = Q(0), ONE = Q(1);
/** "−12", "1.5", "−1/2" → an exact number. */
function num(s) {
  const t = String(s).trim().replace(/^-/, MINUS);
  const m = t.match(/^(−?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/);
  if (!m) throw new Error(`not a number: "${s}"`);
  const sign = m[1] ? -1n : 1n;
  if (m[4]) return Q(sign * BigInt(m[2]), BigInt(m[4]));
  return Q(sign * BigInt(m[2] + (m[3] || '')), 10n ** BigInt((m[3] || '').length));
}
const isNum = (s) => { try { num(s); return true; } catch (e) { return false; } };
const add = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const neg = (a) => Q(-a.n, a.d);
const sub = (a, b) => add(a, neg(b));
const mul = (a, b) => Q(a.n * b.n, a.d * b.d);
const div = (a, b) => Q(a.n * b.d, a.d * b.n);
const same = (a, b) => a.n === b.n && a.d === b.d;
const sign = (a) => (a.n > 0n ? 1 : a.n < 0n ? -1 : 0);
/** Written the lessons' way: −3, 1.5, or (frac) −1/2. */
function write(q, { frac = false } = {}) {
  const s = q.n < 0n ? MINUS : '';
  const n = q.n < 0n ? -q.n : q.n;
  if (q.d === 1n) return `${s}${n}`;
  if (frac) return `${s}${n}/${q.d}`;
  let p = 0;
  while (10n ** BigInt(p) % q.d !== 0n) { p++; if (p > 12) return `${s}${n}/${q.d}`; }
  const digits = (n * (10n ** BigInt(p) / q.d)).toString().padStart(p + 1, '0');
  return `${s}${digits.slice(0, -p)}.${digits.slice(-p).replace(/0+$/, '')}`;
}
/** A float from a picture's pixels, as the nearest fraction with a denominator up to 4 (within 0.02), or null. */
function fromFloat(v) {
  for (const d of [1, 2, 3, 4]) {
    const n = Math.round(v * d);
    if (Math.abs(n / d - v) < 0.02) return Q(n, d);
  }
  return null;
}

// ---------------------------------------------------------------- expressions in one letter
/**
 * A linear form a·v + b in one letter v (x, a, b, k or m), from + − × ÷,
 * parentheses, a leading minus, decimals and a/b; 3x is 3 × x.
 * Returns { a, b, letter }.
 */
function linear(text) {
  const src = bare(unescape(text)).replace(/\s+/g, '').replace(/(\d)([a-z])/g, '$1×$2');
  let i = 0, letter = null;
  const L = (a, b) => ({ a, b });
  function factor() {
    if (src[i] === MINUS) { i++; const v = factor(); return L(neg(v.a), neg(v.b)); }
    if (src[i] === '(') { i++; const v = sum(); if (src[i++] !== ')') throw new Error(`no ")" in ${src}`); return v; }
    if (/[a-z]/.test(src[i] || '')) {
      if (letter && letter !== src[i]) throw new Error(`two letters in ${src}`);
      letter = src[i++];
      return L(ONE, ZERO);
    }
    const m = src.slice(i).match(/^\d+(?:\.\d+)?(?:\/\d+)?/);
    if (!m) throw new Error(`cannot read "${src.slice(i)}" in ${src}`);
    i += m[0].length;
    return L(ZERO, num(m[0]));
  }
  function product() {
    let v = factor();
    while (src[i] === '×' || src[i] === '÷') {
      const op = src[i++]; const w = factor();
      if (op === '×') {
        if (v.a.n && w.a.n) throw new Error(`a letter times a letter in ${src}`);
        v = v.a.n ? L(mul(v.a, w.b), mul(v.b, w.b)) : L(mul(w.a, v.b), mul(w.b, v.b));
      } else {
        if (w.a.n) throw new Error(`÷ a letter in ${src}`);
        v = L(div(v.a, w.b), div(v.b, w.b));
      }
    }
    return v;
  }
  function sum() {
    let v = product();
    while (src[i] === '+' || src[i] === MINUS) { const op = src[i++]; const w = product(); v = op === '+' ? L(add(v.a, w.a), add(v.b, w.b)) : L(sub(v.a, w.a), sub(v.b, w.b)); }
    return v;
  }
  const v = sum();
  if (i !== src.length) throw new Error(`cannot read "${src.slice(i)}" in ${src}`);
  return { ...v, letter };
}

// ---------------------------------------------------------------- rules
/** "y = 2x + 1" → { m, b }; null when the text is not a rule in x with whole numbers. */
function readRule(text) {
  const t = bare(unescape(text)).trim();
  const m = t.match(/^y = (.*)$/);
  if (!m || /=/.test(m[1])) return null;
  if (!/x/.test(m[1])) return isNum(m[1]) ? { m: ZERO, b: num(m[1]) } : null;
  if (/[a-wz]/.test(m[1].replace(/x/g, ''))) return null;
  const f = linear(m[1]);
  return { m: f.a, b: f.b };
}
/** A rule as the guide writes it: y first, the x term, then the number; whole numbers; no 1x, + 0 or + −. */
function canonical(m, b) {
  if (m.d !== 1n || b.d !== 1n) return null;
  const mx = sign(m) === 0 ? '' : same(m, ONE) ? 'x' : same(m, Q(-1)) ? `${MINUS}x` : `${write(m)}x`;
  if (!mx) return `y = ${write(b)}`;
  return sign(b) === 0 ? `y = ${mx}` : `y = ${mx} ${sign(b) > 0 ? '+' : MINUS} ${write(sign(b) > 0 ? b : neg(b))}`;
}
const ruleText = (r) => canonical(r.m, r.b) || `y = ${write(r.m, { frac: true })}x + ${write(r.b)}`;
const at = (r, x) => add(mul(r.m, x), r.b);
const onRule = (r, [x, y]) => same(at(r, x), y);
const sameRule = (r, s) => same(r.m, s.m) && same(r.b, s.b);
/** "(2, −3)" → [x, y]. */
function readPoint(text) {
  const m = bare(text).trim().match(/^[A-Z]?\(([^,()]+), ([^,()]+)\)$/);
  return m && isNum(m[1]) && isNum(m[2]) ? [num(m[1]), num(m[2])] : null;
}
const pointText = ([x, y]) => `(${write(x)}, ${write(y)})`;
function through([x1, y1], [x2, y2]) {
  const m = div(sub(y2, y1), sub(x2, x1));
  return { m, b: sub(y1, mul(m, x1)) };
}

// ---------------------------------------------------------------- equations and chains
/**
 * Checks a chain "a = b = c": a rule (y = 2x + 1) is checked for its form;
 * "y = 2 × 3 + 1 = 7" for its numbers; an equation in one letter is solved
 * from its first link and must hold in every link. Returns { letter, value, trivial } or null.
 */
function checkChain(where, chain) {
  const parts = bare(unescape(chain)).split(/\s*=\s*/);
  if (parts.length < 2) return null;
  try {
    if (parts[0] === 'y' && parts.length === 2 && /x/.test(parts[1])) {
      if (/[a-wz]/.test(parts[1].replace(/x/g, ''))) return null; // a rule with a letter to find (y = kx + 1)
      const r = readRule(chain);
      if (!r) throw new Error('not a rule');
      if (/\d\/\d+x/.test(parts[1])) fail(where, `a fraction inside the rule "${bare(chain)}"`);
      else if (canonical(r.m, r.b) !== bare(chain).trim()) fail(where, `the rule "${bare(chain)}" is not written as ${canonical(r.m, r.b) || 'a rule with whole numbers'}`);
      return null;
    }
    const forms = parts.map((p, k) => (k === 0 && p === 'y' ? null : linear(p)));
    const letters = [...new Set(forms.filter(Boolean).map((f) => f.letter).filter(Boolean))];
    if (letters.length > 1) throw new Error('two letters');
    const rest = forms.filter(Boolean);
    if (!letters.length) {
      for (let k = 1; k < rest.length; k++) if (!same(rest[k].b, rest[0].b)) { fail(where, `"${bare(chain)}" is false`); break; }
      return null;
    }
    const letter = letters[0];
    if (forms[0] === null) throw new Error('y and another letter');
    let value = null;
    for (let k = 0; k + 1 < rest.length && value === null; k++) {
      const a = sub(rest[k].a, rest[k + 1].a);
      if (a.n) value = div(sub(rest[k + 1].b, rest[k].b), a);
    }
    if (value === null) throw new Error(`${letter} cannot be found`);
    for (let k = 0; k + 1 < rest.length; k++) {
      if (!same(add(mul(rest[k].a, value), rest[k].b), add(mul(rest[k + 1].a, value), rest[k + 1].b))) { fail(where, `"${bare(chain)}" does not hold for ${letter} = ${write(value)}`); break; }
    }
    const trivial = parts.length === 2 && parts.some((p) => p.trim() === letter);
    return { letter, value, trivial };
  } catch (e) {
    fail(where, `"${bare(chain)}": ${e.message}`);
    return null;
  }
}
/** Every equation of a text; the steps of one explanation agree on each letter they solve for. */
function checkEquations(where, isos) {
  const solved = {};
  for (const iso of isos) {
    const r = checkChain(where, iso);
    // "x = 1" alone names a place ("מ-x = 1 ל-x = 0"); only the steps of a solution must agree.
    if (!r || r.trivial) continue;
    if (solved[r.letter] && !same(solved[r.letter], r.value)) fail(where, `the steps disagree on ${r.letter}: ${write(solved[r.letter])} and ${write(r.value)}`);
    solved[r.letter] = solved[r.letter] || r.value;
  }
  return solved;
}

// ---------------------------------------------------------------- reading order (guide: "Linear functions")
const isolates = (s) => [...String(s ?? '').matchAll(/⁦([^⁩]*)⁩/g)].map((m) => m[1]);
const spans = (s) => [...String(s).matchAll(/<span dir="ltr"(?: class="math-line")?>(.*?)<\/span>/g)].map((m) => unstack(m[1]));
const outside = (s) => unescape(String(s).replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/⁦[^⁩]*⁩/g, ' \u0001 ').replace(/<span dir="ltr"[^>]*>.*?<\/span>/g, ' \u0001 ').replace(/<[^>]+>/g, ' '));
function checkText(where, s, { start = false } = {}) {
  const raw = String(s ?? '');
  const text = outside(unstack(raw));
  if (/[+×÷=<>]/.test(text)) fail(where, `an operator or = outside an isolate: "${text.trim().slice(0, 60)}"`);
  if (/[−-]\s*\d/.test(text.replace(/[א-ת]-\d/g, ''))) fail(where, 'a negative number or a minus outside an isolate');
  if (/\(\s*[^\s(),]+\s*,\s*[^\s(),]+\s*\)/.test(text)) fail(where, 'a point outside an isolate');
  if (/\d[a-z]/.test(text)) fail(where, 'an expression with a letter outside an isolate');
  const pair = text.match(/(?<![A-Za-z])[A-Za-z][\s,:;.]+[A-Za-z](?![A-Za-z])/);
  if (pair) fail(where, `two bare letters with only "${pair[0].slice(1, -1)}" between them read as one run`);
  for (const iso of isolates(raw)) {
    if (/₪|[֐-׿]/.test(iso)) fail(where, `a unit or a Hebrew word inside an isolate: "${iso}"`);
    if (/ /.test(iso)) fail(where, `an isolate with plain spaces (not glued): "${iso}"`);
  }
  for (const sp of spans(raw)) if (/ /.test(sp.replace(/<[^>]+>/g, ''))) fail(where, `a span with plain spaces (not glued): "${sp}"`);
  if (start && /^\s*(⁦|[A-Za-z]|\d+[A-Za-z])/.test(raw)) fail(where, 'starts with a Latin letter or an isolate (a dir="auto" line turns left to right)');
}

// ---------------------------------------------------------------- pictures
const PAD = 22;
const COLOR = { '#667eea': 'a', '#f5a623': 'b' };
const px = (v) => Number(v);
function figures(html) {
  const s = String(html || '');
  const out = [...s.matchAll(/<figure class="math-figure">([\s\S]*?)<\/figure>/g)].map((f) => ({
    svgs: [...f[1].matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]),
    caption: (f[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/) || [, ''])[1]
  }));
  if (!out.length && /<svg/.test(s)) out.push({ svgs: [...s.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]), caption: '' });
  return out;
}
/** A grid: its lines { rule, color, label }, points { x, y, name, color }, segments; checked as it is read. */
function readGrid(where, svg) {
  const m = svg.match(/aria-label="מערכת צירים: x מ-(−?\d+) עד (−?\d+), y מ-(−?\d+) עד (−?\d+)"/);
  const [xMin, xMax, yMin, yMax] = m.slice(1, 5).map((v) => Number(write(num(v)).replace(MINUS, '-')));
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const unit = (px(vb[1]) - 2 * PAD) / (xMax - xMin);
  if (Math.abs((px(vb[2]) - 2 * PAD) / (yMax - yMin) - unit) > 0.01) fail(where, 'grid squares are not square');
  const gx = (v) => xMin + (px(v) - PAD) / unit, gy = (v) => yMax - (px(v) - PAD) / unit;
  const ox = PAD + (0 - xMin) * unit, oy = PAD + yMax * unit;
  // The numbers on the axes name the line they stand on.
  for (const t of svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="11" text-anchor="(middle|end)" fill="#2b2f3a"(?: font-weight="700")?>([^<]*)<\/text>/g)) {
    const [x, y, anchor, label] = [px(t[1]), px(t[2]), t[3], t[4]];
    if (label === '0') continue;
    const v = anchor === 'middle' ? gx(x) : gy(y - 4);
    if (Math.abs(v - Number(label.replace(MINUS, '-'))) > 0.01) fail(where, `axis number ${label} stands at ${v.toFixed(2)}`);
    if (anchor === 'middle' && Math.abs(y - (oy + 14)) > 0.2) fail(where, `x number ${label} is not under the x axis`);
    if (anchor === 'end' && Math.abs(x - (ox - 5)) > 0.2) fail(where, `y number ${label} is not beside the y axis`);
  }
  const lines = [];
  for (const l of svg.matchAll(/<line data-graph="1" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="(#\w+)"[^>]*\/>/g)) {
    const [x1, y1, x2, y2] = [gx(l[1]), gy(l[2]), gx(l[3]), gy(l[4])];
    const edge = (x, y) => [xMin, xMax].some((e) => Math.abs(x - e) < 0.03) || [yMin, yMax].some((e) => Math.abs(y - e) < 0.03);
    if (!edge(x1, y1) || !edge(x2, y2)) fail(where, 'a line that stops before the edge of the grid');
    const mm = fromFloat((y2 - y1) / (x2 - x1));
    const bb = mm && fromFloat(y1 - (y2 - y1) / (x2 - x1) * x1);
    if (!mm || !bb) { fail(where, 'a line whose slope or intercept is not a simple number'); continue; }
    lines.push({ rule: { m: mm, b: bb }, color: COLOR[l[5]] });
  }
  // A line's label (its rule, or a name) is in its own colour.
  for (const t of svg.matchAll(/<text x="[\d.]+" y="[\d.]+" font-size="12" text-anchor="(?:start|end)" fill="(#\w+)" font-weight="700" direction="ltr" stroke="#fff"[^>]*>([^<]*)<\/text>/g)) {
    const r = readRule(t[2]);
    const mine = lines.filter((l) => l.color === COLOR[t[1]]);
    if (r && !mine.some((l) => sameRule(l.rule, r))) fail(where, `the label "${t[2]}" names no line of its colour`);
    if (r && canonical(r.m, r.b) !== t[2]) fail(where, `the label "${t[2]}" is not written as ${canonical(r.m, r.b)}`);
    for (const l of mine) l.label = t[2];
  }
  const labels = [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="13" text-anchor="(start|end)" fill="[^"]+" font-weight="700" direction="ltr">([^<]*)<\/text>/g)]
    .map((t) => ({ x: px(t[1]), y: px(t[2]), name: t[4] }));
  const points = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="5" fill="(#\w+)"/g)].map((c) => {
    const cx = px(c[1]), cy = px(c[2]);
    const label = labels.find((l) => Math.abs(Math.abs(l.x - cx) - 7) < 0.2 && (Math.abs(l.y - (cy - 7)) < 0.2 || Math.abs(l.y - (cy + 15)) < 0.2));
    const [x, y] = [fromFloat(gx(cx)), fromFloat(gy(cy))];
    if (!x || !y) fail(where, 'a point off the grid lines');
    return { x, y, name: label ? label.name : '', color: COLOR[c[3]] };
  });
  const names = points.map((p) => p.name).filter(Boolean);
  if (new Set(names).size !== names.length) fail(where, `two points share a name: ${names.join(' ')}`);
  if (labels.length !== names.length) fail(where, `${labels.length - names.length} point label(s) not beside a point`);
  const segments = [...svg.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="#\w+" stroke-width="2.5"[^>]*\/>(?:<path[^>]*\/>)?(?:<text[^>]*>([^<]*)<\/text>)?/g)].map((s) => {
    const [x1, y1, x2, y2] = [gx(s[1]), gy(s[2]), gx(s[3]), gy(s[4])].map(fromFloat);
    const seg = { from: [x1, y1], to: [x2, y2], label: s[5] };
    if (s[5] !== undefined) {
      const len = same(x1, x2) ? sub(y2, y1) : same(y1, y2) ? sub(x2, x1) : null;
      if (!len || !isNum(s[5]) || !same(num(s[5]), len)) fail(where, `segment ${pointText(seg.from)}–${pointText(seg.to)} labelled ${s[5]}`);
    }
    return seg;
  });
  // The steps of a slope: run, then rise; rise ÷ run is the slope of the line the step starts on.
  for (const v of segments.filter((s) => same(s.from[0], s.to[0]) && s.label !== undefined)) {
    const h = segments.find((s) => same(s.from[1], s.to[1]) && same(s.to[0], v.from[0]) && same(s.to[1], v.from[1]));
    if (!h) continue;
    const slope = div(sub(v.to[1], v.from[1]), sub(h.to[0], h.from[0]));
    const line = lines.find((l) => onRule(l.rule, h.from));
    if (!line) fail(where, `a step from ${pointText(h.from)} that does not start on a line`);
    else if (!same(line.rule.m, slope)) fail(where, `a step of ${write(slope, { frac: true })} on a line of slope ${write(line.rule.m, { frac: true })}`);
  }
  return { kind: 'grid', lines, points, segments, range: { xMin, xMax, yMin, yMax } };
}
/** A table of values: its columns [x, y] ('?' kept); the known ones on one rule; every step right. */
function readTable(where, svg) {
  const cells = [...svg.matchAll(/data-col="(\d+)" data-row="(\d)" data-value="([^"]*)" x="[\d.]+" y="([\d.]+)"[^>]*>([^<]*)</g)];
  const cols = [];
  let topY = Infinity;
  for (const [, c, r, v, y, shown] of cells) {
    if (v !== shown) fail(where, `cell ${c},${r} shows "${shown}", carries "${v}"`);
    (cols[Number(c)] = cols[Number(c)] || [])[Number(r)] = v === '?' ? null : num(v);
    topY = Math.min(topY, px(y));
  }
  const known = cols.filter((c) => c[0] && c[1]);
  for (let k = 1; k < cols.length; k++) if (cols[k][0] && cols[k - 1][0] && sign(sub(cols[k][0], cols[k - 1][0])) <= 0) fail(where, 'x does not grow to the right');
  let rule = null;
  if (known.length >= 2) {
    rule = through(known[0], known[1]);
    if (known.some((c) => !onRule(rule, c))) fail(where, 'the columns are not on one line');
  }
  const steps = [...svg.matchAll(/<text data-step="([^"]+)" x="([\d.]+)" y="([\d.]+)"/g)].map((s) => ({ text: s[1], x: px(s[2]), top: px(s[3]) < topY }));
  const colX = (k) => k * 54 + 27;
  for (const s of steps) {
    const k = Math.round((s.x - 54) / 54);
    if (!cols[k] || !cols[k + 1] || Math.abs(s.x - (colX(k) + colX(k + 1)) / 2) > 0.5) { fail(where, `a step "${s.text}" between no two columns`); continue; }
    const r = s.top ? 0 : 1;
    if (!cols[k][r] || !cols[k + 1][r]) continue;
    const d = sub(cols[k + 1][r], cols[k][r]);
    const said = s.text.replace(/^\+/, '');
    if (!isNum(said) || !same(num(said), d) || (sign(d) > 0) !== s.text.startsWith('+')) fail(where, `step "${s.text}" between ${write(cols[k][r])} and ${write(cols[k + 1][r])}`);
  }
  return { kind: 'table', cols, rule };
}
let pictureCount = 0;
/** Every picture of a fragment, read back and matched to its caption; returns what was read. */
function checkPictures(where, html) {
  const read = [];
  for (const f of figures(html)) {
    const got = [];
    for (const svg of f.svgs) {
      pictureCount++;
      if (/aria-label="מערכת צירים/.test(svg)) got.push(readGrid(where, svg));
      else if (/data-value-table="1"/.test(svg)) got.push(readTable(where, svg));
      else fail(where, 'a picture the check cannot read');
    }
    read.push(...got);
    if (!f.caption) continue;
    checkText(`${where} caption`, f.caption, { start: false });
    if (/^\s*(⁦|[A-Za-z])/.test(f.caption)) fail(`${where} caption`, 'starts with a Latin letter or an isolate');
    const caption = unstack(f.caption);
    const grids = got.filter((g) => g.kind === 'grid');
    for (const sp of spans(caption)) {
      checkChain(`${where} caption`, sp);
      const r = readRule(sp);
      if (r && !grids.some((g) => g.lines.some((l) => sameRule(l.rule, r))) && !got.some((g) => g.kind === 'table' && g.rule && sameRule(g.rule, r))) fail(`${where} caption`, `the caption's ${bare(sp)} is not drawn`);
      const p = readPoint(sp);
      if (p && grids.length && !grids.some((g) => g.points.some((q) => same(q.x, p[0]) && same(q.y, p[1])))) fail(`${where} caption`, `the caption's point ${bare(sp)} is not drawn`);
    }
    // "A(2, 5) על הישר, B(3, 6) לא", "(2, 4) מתחת לישר": the point is on the line, or not.
    const text = caption.replace(/<span dir="ltr"[^>]*>(.*?)<\/span>/g, '⟨$1⟩').replace(/<[^>]+>/g, '');
    for (const m of text.matchAll(/⟨([^⟩]*)⟩ (על הישר|לא|מתחת לישר|מעל הישר)/g)) {
      const p = readPoint(m[1]);
      const ls = grids.flatMap((g) => g.lines);
      if (!p || !ls.length) continue;
      const on = ls.some((l) => onRule(l.rule, p));
      if (on !== (m[2] === 'על הישר')) fail(`${where} caption`, `${bare(m[1])} is${on ? '' : ' not'} on the line, the caption says ${m[2]}`);
    }
    // "השיפוע: 6 ÷ 2 = 3": the line's slope.
    const sl = text.match(/השיפוע: ⟨([^⟩]*)⟩/);
    if (sl) {
      const v = num(bare(sl[1]).split(' = ').pop());
      if (!grids.some((g) => g.lines.some((l) => same(l.rule.m, v)))) fail(`${where} caption`, `no line of slope ${write(v)}`);
    }
  }
  return read;
}

// ---------------------------------------------------------------- re-computing answers
const RULE = '(y = [^?.,:]+?)';
const PT = '(\\(\\S+, \\S+\\))';
const lineOf = (pics, k = 0) => {
  const ls = pics.filter((p) => p.kind === 'grid').flatMap((g) => g.lines);
  if (!ls[k]) throw new Error('no line in the picture');
  return ls[k].rule;
};
const tableOf = (pics) => { const t = pics.find((p) => p.kind === 'table'); if (!t) throw new Error('no table in the picture'); return t; };
const pointsOf = (pics) => pics.filter((p) => p.kind === 'grid').flatMap((g) => g.points);
/** The letter of a rule to complete (y = kx + 1, y = 2x + b) when the line goes through [x, y]. */
function solveTemplate(template, [x, y], letter) {
  const X = `(${write(x)})`;
  const f = linear(bare(template).replace(/^y = /, '').replace(/([\da-wz])x/g, `$1×${X}`).replace(/x/g, X));
  if (f.letter !== letter) throw new Error(`the rule "${bare(template)}" has no ${letter}`);
  return div(sub(y, f.b), f.a);
}
const ways = (m) => (sign(m) > 0 ? 'עולה' : sign(m) < 0 ? 'יורד' : 'קבוע');

function recompute(q, options, pics) {
  const t = bare(q).trim();
  let m;
  const R = (s) => { const r = readRule(s); if (!r) throw new Error(`"${s}" is not a rule`); return r; };
  const P = (s) => { const p = readPoint(s); if (!p) throw new Error(`"${s}" is not a point`); return p; };
  const one = (pred, what) => {
    const ok = options.filter((o) => { try { return pred(o); } catch (e) { return false; } });
    if (ok.length !== 1) throw new Error(`${ok.length} options are ${what}`);
    return { option: ok[0] };
  };
  const named = (pred, what) => {
    const pts = pointsOf(pics).filter((p) => p.name);
    const ok = pts.filter(pred);
    if (ok.length !== 1) throw new Error(`${ok.length} points are ${what}`);
    return { option: ok[0].name };
  };
  const optRule = (o) => readRule(o);
  // ---- 112.1
  if ((m = t.match(new RegExp(`^בכלל ${RULE}, מה y כאשר x = (\\S+)\\?$`)))) return { value: at(R(m[1]), num(m[2])) };
  if ((m = t.match(new RegExp(`^בכלל ${RULE}, עבור איזה x מתקבל y = (\\S+)\\?$`)))) { const r = R(m[1]); return { value: div(sub(num(m[2]), r.b), r.m) }; }
  if ((m = t.match(new RegExp(`^מה המספר החסר בטבלה של ${RULE}\\?$`)))) {
    const r = R(m[1]); const col = tableOf(pics).cols.find((c) => !c[0] || !c[1]);
    return col[1] ? { value: div(sub(col[1], r.b), r.m) } : { value: at(r, col[0]) };
  }
  if ((m = t.match(new RegExp(`^מה ה-x החסר בטבלה של ${RULE}\\?$`)))) {
    const r = R(m[1]); const col = tableOf(pics).cols.find((c) => !c[0]);
    return { value: div(sub(col[1], r.b), r.m) };
  }
  if ((m = t.match(new RegExp(`^בטבלה של ${RULE} חסר ה-y של x = (\\S+)\\. מהו\\?$`)))) {
    const col = tableOf(pics).cols.find((c) => !c[1]);
    if (!col || !same(col[0], num(m[2]))) throw new Error(`the table's missing y is not at x = ${m[2]}`);
    return { value: at(R(m[1]), num(m[2])) };
  }
  if ((m = t.match(new RegExp(`^האם הנקודה ${PT} נמצאת על הישר ${RULE}\\?$`)))) return { option: onRule(R(m[2]), P(m[1])) ? 'כן' : 'לא' };
  if ((m = t.match(new RegExp(`^איזו נקודה נמצאת על הישר ${RULE}\\?$`)))) {
    const r = R(m[1]);
    return pics.length ? named((p) => onRule(r, [p.x, p.y]), 'on the line') : one((o) => onRule(r, P(o)), 'on the line');
  }
  if ((m = t.match(new RegExp(`^איזו נקודה נמצאת גם על הישר ${RULE} וגם על הישר ${RULE}\\?$`)))) {
    const [r, s] = [R(m[1]), R(m[2])];
    return one((o) => onRule(r, P(o)) && onRule(s, P(o)), 'on both lines');
  }
  if (/^איזו נקודה נמצאת על הישר שבציור\?$/.test(t)) { const r = lineOf(pics); return named((p) => onRule(r, [p.x, p.y]), 'on the line'); }
  if (/^איזו נקודה לא נמצאת על הישר שבציור\?$/.test(t)) { const r = lineOf(pics); return named((p) => !onRule(r, [p.x, p.y]), 'off the line'); }
  if (/^איזה ישר עובר בראשית הצירים\?$/.test(t)) return one((o) => sign(optRule(o).b) === 0, 'through the origin');
  if (/^איזה כלל נותן את הטבלה\?$/.test(t)) { const cols = tableOf(pics).cols; return one((o) => cols.every((c) => onRule(optRule(o), c)), 'the table\'s rule'); }
  if ((m = t.match(new RegExp(`^לנקודה על הישר ${RULE} ה-x הוא (\\S+)\\. מה ה-y שלה\\?$`)))) return { value: at(R(m[1]), num(m[2])) };
  if ((m = t.match(new RegExp(`^הישר (y = [^?]+?) עובר (?:בנקודה|דרך הנקודה) ${PT}\\. מה ([a-z])\\?$`)))) return { value: solveTemplate(m[1], P(m[2]), m[3]) };
  if ((m = t.match(new RegExp(`^עבור איזה x הכללים ${RULE} ו-${RULE} נותנים אותו y\\?$`)))) {
    const [r, s] = [R(m[1]), R(m[2])];
    return { value: div(sub(s.b, r.b), sub(r.m, s.m)) };
  }
  if ((m = t.match(new RegExp(`^הישר שבציור עובר בראשית הצירים ובנקודה [A-Z]?${PT}\\. מה הכלל שלו\\?$`)))) {
    const r = lineOf(pics), p = P(m[1]);
    if (sign(r.b) !== 0 || !onRule(r, p)) throw new Error('the drawn line is not the one the question describes');
    return one((o) => sameRule(optRule(o), r), 'the line\'s rule');
  }
  if ((m = t.match(new RegExp(`^הנקודה \\(a, (\\S+)\\) נמצאת על הישר ${RULE}\\. מה a\\?$`)))) { const r = R(m[2]); return { value: div(sub(num(m[1]), r.b), r.m) }; }
  if ((m = t.match(new RegExp(`^איזה ישר עובר גם דרך ${PT} וגם דרך ${PT}\\?$`)))) { const [p, q2] = [P(m[1]), P(m[2])]; return one((o) => onRule(optRule(o), p) && onRule(optRule(o), q2), 'through both points'); }
  if ((m = t.match(/^על הישר שבציור יש נקודה שה-x שלה (\S+)\. מה ה-y שלה\?$/))) return { value: at(lineOf(pics), num(m[1])) };
  // ---- 112.2
  if ((m = t.match(new RegExp(`^מה השיפוע של הישר ${RULE}\\?$`)))) return { value: R(m[1]).m };
  if ((m = t.match(new RegExp(`^באיזו נקודה הישר ${RULE} חותך את ציר ה-y\\?$`)))) return { option: pointText([ZERO, R(m[1]).b]) };
  if ((m = t.match(new RegExp(`^באיזו נקודה הישר ${RULE} חותך את ציר ה-x\\?$`)))) { const r = R(m[1]); return { option: pointText([div(neg(r.b), r.m), ZERO]) }; }
  if ((m = t.match(new RegExp(`^הישר ${RULE} הוא:$`)))) return { option: ways(R(m[1]).m) };
  if (/^הישר שבציור הוא:$/.test(t)) return { option: ways(lineOf(pics).m) };
  if (/^מה השיפוע לפי הטבלה\?$/.test(t)) { const tb = tableOf(pics); if (!tb.rule) throw new Error('a table without a rule'); return { value: tb.rule.m }; }
  if (/^באיזו נקודה הישר שבציור חותך את ציר ה-y\?$/.test(t)) return { option: pointText([ZERO, lineOf(pics).b]) };
  if (/^באיזו נקודה הישר שבציור חותך את ציר ה-x\?$/.test(t)) { const r = lineOf(pics); return { option: pointText([div(neg(r.b), r.m), ZERO]) }; }
  if ((m = t.match(/^לאיזה ישר שיפוע (\S+)\?$/))) return one((o) => same(optRule(o).m, num(m[1])), `of slope ${m[1]}`);
  if ((m = t.match(new RegExp(`^מה השיפוע של הישר שעובר דרך ${PT} ו-${PT}\\?$`)))) return { value: through(P(m[1]), P(m[2])).m, frac: true };
  if (/^מה הכלל של הישר שבציור\?$/.test(t)) { const r = lineOf(pics); return one((o) => sameRule(optRule(o), r), 'the line\'s rule'); }
  if (/^מה השיפוע של הישר שבציור\?$/.test(t)) return { value: lineOf(pics).m, frac: true };
  if ((m = t.match(new RegExp(`^לישר שיפוע (\\S+), והוא חותך את ציר ה-y ב-${PT}\\. מה הכלל שלו\\?$`)))) {
    const p = P(m[2]); if (sign(p[0])) throw new Error(`${m[2]} is not on the y axis`);
    return one((o) => sameRule(optRule(o), { m: num(m[1]), b: p[1] }), 'the rule');
  }
  if ((m = t.match(new RegExp(`^לישר שיפוע (\\S+), והוא עובר דרך ${PT}\\. מה הכלל שלו\\?$`)))) {
    const [k, p] = [num(m[1]), P(m[2])];
    return one((o) => sameRule(optRule(o), { m: k, b: sub(p[1], mul(k, p[0])) }), 'the rule');
  }
  if ((m = t.match(new RegExp(`^איזה ישר מקביל לישר ${RULE}\\?$`)))) { const r = R(m[1]); return one((o) => same(optRule(o).m, r.m) && !same(optRule(o).b, r.b), 'parallel'); }
  if ((m = t.match(new RegExp(`^ישר עובר דרך ${PT}, והשיפוע שלו (\\S+)\\. באיזו נקודה הוא חותך את ציר ה-y\\?$`)))) {
    const [p, k] = [P(m[1]), num(m[2])];
    return { option: pointText([ZERO, sub(p[1], mul(k, p[0]))]) };
  }
  if ((m = t.match(/^השיפוע של ישר הוא (\S+)\. בכמה משתנה y כש-x גדל ב-(\S+)\?$/))) return { value: mul(num(m[1]), num(m[2])) };
  if ((m = t.match(new RegExp(`^מה הכלל של הישר שעובר דרך ${PT} ו-${PT}\\?$`)))) { const r = through(P(m[1]), P(m[2])); return one((o) => sameRule(optRule(o), r), 'the rule'); }
  if ((m = t.match(new RegExp(`^ישר מקביל לישר ${RULE} ועובר דרך ${PT}\\. מה הכלל שלו\\?$`)))) {
    const [r, p] = [R(m[1]), P(m[2])];
    return one((o) => sameRule(optRule(o), { m: r.m, b: sub(p[1], mul(r.m, p[0])) }), 'the parallel through the point');
  }
  if ((m = t.match(new RegExp(`^ישר עם שיפוע (\\S+) עובר דרך ${PT}\\. מה ה-y של הנקודה שלו שה-x שלה (\\S+)\\?$`)))) {
    const [k, p, x] = [num(m[1]), P(m[2]), num(m[3])];
    return { value: add(p[1], mul(k, sub(x, p[0]))) };
  }
  // ---- 112.3
  if ((m = t.match(new RegExp(`^כמה פעמים הישר ${RULE} חותך את ציר ה-x\\?$`)))) { const r = R(m[1]); if (!sign(r.m) && !sign(r.b)) throw new Error('the line is the x axis'); return { value: Q(sign(r.m) ? 1 : 0) }; }
  if ((m = t.match(new RegExp(`^ישר חותך את ציר ה-y ב-${PT} ואת ציר ה-x ב-${PT}\\. מה הכלל שלו\\?$`)))) {
    const [p, q2] = [P(m[1]), P(m[2])];
    if (sign(p[0]) || sign(q2[1])) throw new Error('the points are not on the axes they are said to be on');
    return one((o) => sameRule(optRule(o), through(p, q2)), 'the rule');
  }
  if ((m = t.match(new RegExp(`^הישר ${RULE} והצירים יוצרים משולש\\. מה השטח שלו\\?$`)))) {
    const r = R(m[1]); const x0 = div(neg(r.b), r.m);
    const abs = (v) => (sign(v) < 0 ? neg(v) : v);
    return { value: div(mul(abs(x0), abs(r.b)), Q(2)) };
  }
  // Stories: a fixed amount and an amount for each step.
  if ((m = t.match(/^נסיעה במונית עולה (\d+) ₪ בכניסה ועוד (\d+) ₪ לכל קילומטר\. כמה שקלים עולה נסיעה של (\d+) קילומטרים\?$/))) return { value: add(num(m[1]), mul(num(m[2]), num(m[3]))) };
  if ((m = t.match(/^נסיעה במונית עולה (\d+) ₪ בכניסה ועוד (\d+) ₪ לכל קילומטר\. נסיעה עלתה (\d+) ₪\. כמה קילומטרים נסעו\?$/))) return { value: div(sub(num(m[3]), num(m[1])), num(m[2])) };
  if ((m = t.match(new RegExp(`^המחיר של נסיעה במונית הוא ${RULE} שקלים, כאשר x הוא מספר הקילומטרים\\. כמה עולה כל קילומטר\\?$`)))) return { value: R(m[1]).m };
  if ((m = t.match(/^נר באורך (\d+) ס״מ נשרף (\d+) ס״מ בכל שעה\. מה האורך שלו בס״מ אחרי (\d+) שעות\?$/))) return { value: sub(num(m[1]), mul(num(m[2]), num(m[3]))) };
  if ((m = t.match(/^נר באורך (\d+) ס״מ נשרף (\d+) ס״מ בכל שעה\. אחרי כמה שעות הוא נגמר\?$/))) return { value: div(num(m[1]), num(m[2])) };
  if ((m = t.match(/^נר א׳ באורך (\d+) ס״מ נשרף (\d+) ס״מ בשעה, ונר ב׳ באורך (\d+) ס״מ נשרף (\d+) ס״מ בשעה\. אחרי כמה שעות האורך שלהם שווה\?$/))) {
    return { value: div(sub(num(m[1]), num(m[3])), sub(num(m[2]), num(m[4]))) };
  }
  if ((m = t.match(/^ליעל (\d+) ₪ בקופה, והיא מוסיפה (\d+) ₪ בכל שבוע\. מה הכלל של הסכום y אחרי x שבועות\?$/))
    || (m = t.match(/^תוכנית טלפון עולה (\d+) ₪ בחודש ועוד (\d+) ₪ לכל שיחה ארוכה\. מה הכלל של המחיר y אחרי x שיחות\?$/))) {
    // What there is at the start is b; what each week or call adds is the slope.
    return one((o) => sameRule(optRule(o), { m: num(m[2]), b: num(m[1]) }), 'the story\'s rule');
  }
  if ((m = t.match(/^ליעל (\d+) ₪, והיא חוסכת (\d+) ₪ בכל שבוע\. אחרי כמה שבועות יהיו לה (\d+) ₪\?$/))) return { value: div(sub(num(m[3]), num(m[1])), num(m[2])) };
  if ((m = t.match(new RegExp(`^נסיעה במונית א׳ עולה ${RULE} שקלים, ובמונית ב׳ ${RULE} שקלים, כאשר x הוא מספר הקילומטרים\\. אחרי כמה קילומטרים המחיר שווה\\?$`)))) {
    const [r, s] = [R(m[1]), R(m[2])];
    return { value: div(sub(s.b, r.b), sub(r.m, s.m)) };
  }
  if ((m = t.match(/אחרי (\d+) חודשים שילמו (\d+) ₪, ואחרי (\d+) חודשים (\d+) ₪\. מה המחיר לכל חודש\?$/))) return { value: div(sub(num(m[4]), num(m[2])), sub(num(m[3]), num(m[1]))) };
  if ((m = t.match(/(\d+) שיעורים עולים (\d+) ₪, ו-(\d+) שיעורים עולים (\d+) ₪\. מה התשלום הקבוע\?$/))) {
    const each = div(sub(num(m[4]), num(m[2])), sub(num(m[3]), num(m[1])));
    return { value: sub(num(m[2]), mul(each, num(m[1]))) };
  }
  if ((m = t.match(/^בבוקר הטמפרטורה הייתה (\S+) מעלות, והיא עלתה (\d+) מעלות בכל שעה\. אחרי כמה שעות היא הגיעה ל-0\?$/))) return { value: div(neg(num(m[1])), num(m[2])) };
  if ((m = t.match(/^לדן (\d+) נקודות, והוא מקבל (נקודה אחת|\d+) בכל סיבוב\. לרון (נקודה אחת|\d+ נקודות), והוא מקבל (\d+) בכל סיבוב\. למי יש יותר נקודות אחרי (\d+) סיבובים\?$/))) {
    const n = (s) => (/נקודה אחת/.test(s) ? ONE : num(s.replace(' נקודות', '')));
    const dan = add(n(m[1]), mul(n(m[2]), num(m[5]))), ron = add(n(m[3]), mul(num(m[4]), num(m[5])));
    return { option: same(dan, ron) ? 'לשניהם אותו מספר' : sign(sub(dan, ron)) > 0 ? 'לדן' : 'לרון' };
  }
  // Graphs of stories.
  if (/^הגרף מראה/.test(t) || /^בגרף:/.test(t)) {
    if ((m = t.match(/מה האורך אחרי (שעה אחת|\d+ שעות)\?$/))) return { value: at(lineOf(pics), /שעה אחת/.test(m[1]) ? ONE : num(m[1].split(' ')[0])) };
    if ((m = t.match(/אחרי כמה שעות האורך (\d+) ס״מ\?$/))) { const r = lineOf(pics); return { value: div(sub(num(m[1]), r.b), r.m) }; }
    if (/כמה ליטרים היו בו בהתחלה\?$/.test(t)) return { value: lineOf(pics).b };
    if (/בכמה ליטרים גדלה הכמות בכל דקה\?$/.test(t)) return { value: lineOf(pics).m };
    if ((m = t.match(/מה יהיה הגובה שלו אחרי (\d+) שבועות\?$/))) return { value: at(lineOf(pics), num(m[1])) };
    if (/אחרי כמה סיבובים יש להם אותו מספר נקודות\?$/.test(t)) { const [r, s] = [lineOf(pics, 0), lineOf(pics, 1)]; return { value: div(sub(s.b, r.b), sub(r.m, s.m)) }; }
  }
  return undefined;
}

// ---------------------------------------------------------------- options
function optionKind(raw) {
  const o = bare(raw);
  if (isNum(o)) return 'number';
  if (readPoint(o) && !/^[A-Z]/.test(o)) return 'point';
  if (/^[A-D]$/.test(o)) return 'letter';
  if (HEBREW.test(o) && !/[0-9A-Za-z−=:]/.test(o)) return 'words';
  try { if (readRule(o)) return 'rule'; } catch (e) { /* not a rule */ }
  return null;
}
const optionValue = (o) => (isNum(o) ? write(num(o), { frac: true }) : readRule(o) ? ruleText(readRule(o)) : readPoint(o) ? pointText(readPoint(o)) : o);

// ---------------------------------------------------------------- run
const counts = {};
let recomputed = 0;
for (const lesson of lessons) {
  const where = `${lesson.subtopic_number} theory`;
  if (/<span dir="ltr">/.test(lesson.theory_content_he)) fail(where, 'an equation span without class math-line');
  const html = unstack(lesson.theory_content_he);
  if (/⁦/.test(html)) fail(where, 'an isolate in the theory (use <span dir="ltr">)');
  for (const p of html.matchAll(/<p>([\s\S]*?)<\/p>/g)) checkText(`${where} paragraph`, p[1], { start: true });
  for (const box of html.matchAll(/<div class="(?:warning|tip|formula-explanation)">([\s\S]*?)<\/div>/g)) checkText(`${where} box`, box[1]);
  for (const h of html.matchAll(/<h[23]>([\s\S]*?)<\/h[23]>/g)) checkText(`${where} title`, h[1]);
  for (const sp of spans(html)) checkChain(`${where} "${bare(unescape(sp))}"`, sp);
  checkPictures(where, html);
}

for (const e of exercises) {
  const lesson = lessons.find((l) => l.id === e.lesson_id);
  const sub_ = lesson.subtopic_number;
  const where = `${sub_} q${e.question_number}`;
  counts[sub_] = counts[sub_] || { easy: 0, medium: 0, hard: 0 };
  counts[sub_][e.difficulty]++;
  const rawOptions = e.options || [];
  const options = rawOptions.map(bare);
  const answer = bare(e.correct_answer);
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  const kinds = rawOptions.map(optionKind);
  const words = kinds.every((k) => k === 'words');
  if (options.length !== (words && options.length === 3 ? 3 : 4)) fail(where, `${options.length} options`);
  if (!options.includes(answer)) fail(where, 'the answer is not an option');
  kinds.forEach((k, i) => {
    if (!k) fail(where, `option "${options[i]}" is not a number, fraction, point, rule, letter or Hebrew words`);
    if (k === 'rule' && / /.test(rawOptions[i])) fail(where, `option "${options[i]}" is a rule with plain spaces (not glued)`);
    if (k === 'rule') checkChain(`${where} option`, options[i]);
  });
  if (new Set(kinds).size > 1) fail(where, `options of different kinds: ${kinds.join(', ')}`);
  const values = options.map(optionValue);
  if (new Set(values).size !== values.length) fail(where, 'two options are the same');

  checkText(`${where} question`, e.question_text_he, { start: true });
  checkText(`${where} explanation`, e.explanation_he, { start: true });
  if (/<span dir="ltr">/.test(e.explanation_picture || '')) fail(where, 'an equation span without class math-line in the explanation picture');
  for (const iso of isolates(e.question_text_he)) checkChain(`${where} question`, iso);

  const qPicture = e.question_picture ? checkPictures(`${where} question picture`, `<figure class="math-figure">${e.question_picture}</figure>`) : [];
  if (e.question_picture) {
    const g = qPicture.find((p) => p.kind === 'grid');
    if (g && g.range.yMax - g.range.yMin > 9) fail(where, `the question's grid is ${g.range.yMax - g.range.yMin} units high (at most 9)`);
  }
  if (e.explanation_picture) checkPictures(`${where} explanation picture`, unstack(e.explanation_picture));
  let r;
  try { r = recompute(e.question_text_he, options, qPicture); } catch (err) { fail(where, err.message); continue; }
  if (r === undefined) { fail(where, `could not re-compute "${bare(e.question_text_he)}"`); continue; }
  const expected = r.option !== undefined ? r.option : write(r.value, { frac: !!r.frac });
  const ok = r.option !== undefined ? optionValue(expected) === optionValue(answer) : isNum(answer) && same(num(answer), r.value);
  if (!ok) fail(where, `answer ${answer}, re-computed ${expected}`);
  else recomputed++;
  // A question about a letter: the explanation's steps solve it to the answer.
  const asked = bare(e.question_text_he).match(/מה ([a-z])\?$|עבור איזה (x) /);
  if (asked && isNum(answer)) {
    const letter = asked[1] || asked[2];
    const solved = checkEquations(`${where} explanation`, isolates(e.explanation_he));
    if (solved[letter] && !same(solved[letter], num(answer))) fail(where, `the explanation solves ${letter} to ${write(solved[letter])}, the answer is ${answer}`);
  } else {
    checkEquations(`${where} explanation`, isolates(e.explanation_he));
  }
}

for (const [s, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(s, `counts ${JSON.stringify(c)}`);
}
if (!lessons.length) fail('topic 112', 'no lessons');
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed, ${pictureCount} pictures read back`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
