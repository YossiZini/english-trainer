// Independent check of topic 107 (the x and y axes). Shares no code with the
// seeds: it reads the bundled JSON (or, with SEED=1, the seed module's output
// as data), reads every grid picture back from its SVG (each point's place
// and name, the numbers on the axes, the segments and their labels) and
// re-computes every answer from the question and the points of its picture.
// It also checks the equations and the points written in explanations and
// captions, that equations are glued (one line on a phone), that every minus
// sits inside an isolate, and that no option mixes Hebrew with numbers or
// Latin letters.
// From backend/:
//   node scripts/checks/topic107.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic107.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic107-axes.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe,
    explanation_picture: e.explanationPicture, question_picture: e.questionPicture, difficulty: e.difficulty
  })));
} else {
  lessons = require(path.join(ROOT, 'data/static/lessons.json')).filter((l) => l.topic_number === 107);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = require(path.join(ROOT, 'data/static/exercises.json')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const MINUS = '−';
const plain = (s) => String(s ?? '').replace(/[⁦-⁩]/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const HEBREW = /[֐-׿]/;

// ---- numbers, points and expressions ----
const val = (s) => (/^−?\d+$/.test(s) ? (s.startsWith(MINUS) ? -Number(s.slice(1)) : Number(s)) : NaN);
const signed = (v) => (v < 0 ? `${MINUS}${-v}` : String(v));
const pairText = ([x, y]) => `(${signed(x)}, ${signed(y)})`;
const PAIR = /\((−?\d+), (−?\d+)\)/;
const pairsIn = (s) => [...s.matchAll(/\((−?\d+), (−?\d+)\)/g)].map((m) => [val(m[1]), val(m[2])]);
const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];

/** Integer expressions with × ÷ + −, parentheses and a leading minus; NaN otherwise. */
function evaluate(text) {
  const s = plain(text).replace(/\s+/g, '');
  const tokens = s.match(/\d+|[×÷+−()]/g);
  if (!tokens || tokens.join('') !== s) return NaN;
  let i = 0;
  const peek = () => tokens[i];
  const expr = () => { let v = term(); while (peek() === '+' || peek() === MINUS) v = tokens[i++] === '+' ? v + term() : v - term(); return v; };
  const term = () => { let v = unary(); while (peek() === '×' || peek() === '÷') { const op = tokens[i++], w = unary(); v = op === '×' ? v * w : (w && v % w === 0 ? v / w : NaN); } return v; };
  const unary = () => (peek() === MINUS ? (i++, -unary()) : primary());
  const primary = () => { const t = tokens[i++]; if (/^\d+$/.test(t || '')) return Number(t); if (t === '(') { const v = expr(); return tokens[i++] === ')' ? v : NaN; } return NaN; };
  const v = expr();
  return i === tokens.length ? v + 0 : NaN;
}

/**
 * Every equation in a plain text must hold. A point equation
 * "(1 + 3, 2 − 4) = (4, −2)" is checked part by part; a quoted one is a
 * mistake shown on purpose. Returns the values reached.
 */
function checkMath(where, text) {
  const reached = [];
  let s = text.replace(/"[^"]*"/g, ' ');
  s = s.replace(/\(([^(),]+), ([^(),]+)\) = \((−?\d+), (−?\d+)\)/g, (m, a, b, x, y) => {
    if (evaluate(a) !== val(x) || evaluate(b) !== val(y)) fail(where, `"${m}" does not hold`);
    return ' ';
  });
  for (const m of s.matchAll(/[\d−+×÷() =]+/g)) {
    const run = m[0].trim();
    if (!run.includes('=')) continue;
    const sides = run.split(/ ?= ?/).map((x) => x.trim()).filter((x, k) => !(k === 0 && x === ''));
    const values = sides.map(evaluate);
    if (!values.every(Number.isFinite)) { fail(where, `cannot read "${run}"`); continue; }
    if (values.some((v) => v !== values[0])) fail(where, `"${run}" does not hold`);
    reached.push(values[0]);
  }
  return reached;
}

const textOf = (html) => plain(String(html ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ¦ ').replace(/<[^>]+>/g, ' ¦ ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));

function checkGlue(where, html) {
  const s = String(html ?? '');
  const segs = [...s.matchAll(/⁦([^⁩]*)⁩/g), ...s.matchAll(/<span dir="ltr">([^<]*)<\/span>/g)].map((m) => m[1]);
  for (const seg of segs) {
    if (seg.includes(' ')) fail(where, `"${seg}" can break across lines (plain space)`);
    if (seg.includes('-')) fail(where, `"${seg}" has an ASCII hyphen, not the minus sign`);
  }
}

/** Every minus in Hebrew text sits inside an isolate or <span dir="ltr"> (alone, "−1" shows as "1−"). */
function checkIsolated(where, text) {
  const bare = String(text ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/⁦[^⁩]*⁩/g, ' ')
    .replace(/<span dir="ltr">[^<]*<\/span>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const m of bare.matchAll(/.{0,12}−.{0,6}/g)) fail(where, `a minus outside an isolate: "${m[0].trim()}"`);
}

// ---- grid pictures, read back ----
const PAD = 22; // the grid starts 22 from the picture's edge

/** Each grid in the HTML: { range, points: [{ name, x, y }], caption }. */
function readGrids(where, html) {
  const out = [];
  const re = /<svg[^>]*aria-label="מערכת צירים: x מ-(−?\d+) עד (−?\d+), y מ-(−?\d+) עד (−?\d+)"[\s\S]*?<\/svg>(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?/g;
  for (const m of String(html ?? '').matchAll(re)) {
    const [xMin, xMax, yMin, yMax] = m.slice(1, 5).map(val);
    const vb = m[0].match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const unit = (Number(vb[1]) - 2 * PAD) / (xMax - xMin);
    if (Math.abs((Number(vb[2]) - 2 * PAD) / (yMax - yMin) - unit) > 0.01) fail(where, 'grid squares are not square');
    const gx = (px) => xMin + (Number(px) - PAD) / unit, gy = (py) => yMax - (Number(py) - PAD) / unit;
    const whole = (v, what) => { if (Math.abs(v - Math.round(v)) > 0.01) fail(where, `${what} off the grid lines`); return Math.round(v) + 0; };
    // The numbers on the axes name the line they stand on.
    const ox = PAD + (0 - xMin) * unit, oy = PAD + (yMax - 0) * unit;
    for (const t of m[0].matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="11" text-anchor="(middle|end)" fill="#2b2f3a"(?: font-weight="700")?>([^<]*)<\/text>/g)) {
      const [x, y, anchor, label] = [Number(t[1]), Number(t[2]), t[3], t[4]];
      if (label === '0') continue;
      const v = anchor === 'middle' ? whole(gx(x), `x number ${label}`) : whole(gy(y - 4), `y number ${label}`);
      if (v !== val(label)) fail(where, `axis number ${label} stands at ${signed(v)}`);
      if (anchor === 'middle' && Math.abs(y - (oy + 14)) > 0.2) fail(where, `x number ${label} is not under the x axis`);
      if (anchor === 'end' && Math.abs(x - (ox - 5)) > 0.2) fail(where, `y number ${label} is not beside the y axis`);
    }
    const labels = [...m[0].matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="13" text-anchor="(start|end)" fill="[^"]+" font-weight="700" direction="ltr">([^<]*)<\/text>/g)]
      .map((t) => ({ x: Number(t[1]), y: Number(t[2]), anchor: t[3], name: t[4] }));
    const points = [...m[0].matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="5"/g)].map((c) => {
      const cx = Number(c[1]), cy = Number(c[2]);
      // A point's name is written 7 beside it, above or below.
      const label = labels.find((l) => Math.abs(Math.abs(l.x - cx) - 7) < 0.2 && (Math.abs(l.y - (cy - 7)) < 0.2 || Math.abs(l.y - (cy + 15)) < 0.2));
      return { name: label ? label.name : '', x: whole(gx(cx), 'a point'), y: whole(gy(cy), 'a point') };
    });
    const names = points.map((p) => p.name).filter(Boolean);
    if (new Set(names).size !== names.length) fail(where, `two points share a name: ${names.join(' ')}`);
    if (labels.length !== names.length) fail(where, `${labels.length - names.length} point label(s) not beside a point`);
    // Segments with a label: the label is the segment's length.
    for (const s of m[0].matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="#(?:667eea|f5a623)" stroke-width="2.5"[^>]*\/>(?:<path[^>]*\/>)?(?:<text[^>]*>([^<]*)<\/text>)?/g)) {
      const [x1, y1, x2, y2] = [gx(s[1]), gy(s[2]), gx(s[3]), gy(s[4])].map((v) => whole(v, 'a segment end'));
      if (s[5] !== undefined && (x1 === x2 || y1 === y2) && val(s[5]) !== Math.abs(x2 - x1) + Math.abs(y2 - y1)) fail(where, `segment ${pairText([x1, y1])}–${pairText([x2, y2])} labelled ${s[5]}`);
    }
    out.push({ points, caption: textOf(m[5] || '').replace(/^¦ | ¦$/g, '') });
  }
  return out;
}

/** A caption's points must be drawn: "A(2, 3)" as a point named A there, "(5, 1)" as some point there. */
function checkCaption(where, g) {
  for (const m of g.caption.matchAll(/([A-Z]?)\((−?\d+), (−?\d+)\)/g)) {
    const p = [val(m[2]), val(m[3])];
    const hit = g.points.find((q) => q.x === p[0] && q.y === p[1] && (!m[1] || q.name === m[1]));
    if (!hit) fail(where, `caption "${g.caption}": no point ${m[0]} in the picture`);
  }
}

// ---- answers re-computed ----
const QUARTERS = ['הרביע הראשון', 'הרביע השני', 'הרביע השלישי', 'הרביע הרביעי'];
const ORDINAL = { הראשון: 0, השני: 1, השלישי: 2, הרביעי: 3 };
const quarter = ([x, y]) => (x > 0 && y > 0 ? 0 : x < 0 && y > 0 ? 1 : x < 0 && y < 0 ? 2 : x > 0 && y < 0 ? 3 : -1);
const WORD = { ימינה: [1, 0], שמאלה: [-1, 0], למעלה: [0, 1], למטה: [0, -1] };
/** The moves in a text: "3 שמאלה ו-2 למעלה" → [−3, 2]. */
function moves(s) {
  const d = [0, 0];
  for (const m of s.matchAll(/(\d+) (ימינה|שמאלה|למעלה|למטה)/g)) { d[0] += WORD[m[2]][0] * Number(m[1]); d[1] += WORD[m[2]][1] * Number(m[1]); }
  return d;
}
const only = (where, hits, what) => { if (hits.length !== 1) fail(where, `${hits.length} options are ${what}`); return hits[0]; };

function recompute(where, q, options, pts) {
  const P = (name) => { const p = pts.find((x) => x.name === name); if (!p) fail(where, `no point ${name} in the question's picture`); return p ? [p.x, p.y] : null; };
  const pairs = pairsIn(q);
  let m;
  if ((m = q.match(/^מה שיעור ה-(x|y) של הנקודה \((−?\d+), (−?\d+)\)\?$/))) return signed(val(m[1] === 'x' ? m[2] : m[3]));
  if ((m = q.match(/באיזה רביע נמצאת הנקודה (?:החדשה)?\(?(−?\d+)?/)) && /באיזה רביע נמצאת הנקודה \(/.test(q)) return QUARTERS[quarter(pairs[pairs.length - 1])];
  if (/^הופכים את שני השיעורים של /.test(q)) return QUARTERS[quarter([-pairs[0][0], -pairs[0][1]])];
  if (/^מה השיעורים של ראשית הצירים\?$/.test(q)) return pairText([0, 0]);
  if ((m = q.match(/^מה השיעורים של הנקודה ([A-Z])\?$/))) return pairText(P(m[1]));
  if ((m = q.match(/^הנקודה \((−?\d+), (−?\d+)\) נמצאת על ציר:$/))) return val(m[2]) === 0 ? 'x' : val(m[1]) === 0 ? 'y' : undefined;
  if (/^מראשית הצירים הולכים /.test(q)) return pairText(moves(q));
  if (/^באיזה רביע שני השיעורים שליליים\?$/.test(q)) return QUARTERS[2];
  if ((m = q.match(/^שיעור ה-x של נקודה (חיובי|שלילי), ושיעור ה-y שלה (חיובי|שלילי)/))) return QUARTERS[quarter([m[1] === 'חיובי' ? 1 : -1, m[2] === 'חיובי' ? 1 : -1])];
  if ((m = q.match(/^איזו נקודה היא \((−?\d+), (−?\d+)\)\?$/))) {
    const p = [val(m[1]), val(m[2])];
    return only(where, options.filter((o) => same(P(o), p)), `the point ${pairText(p)}`);
  }
  if ((m = q.match(/^נקודה נמצאת על ציר ה-(x|y), (\d+) (ימינה|שמאלה|למעלה|למטה) מראשית הצירים/))) {
    const d = moves(`${m[2]} ${m[3]}`);
    if ((m[1] === 'x' && d[1]) || (m[1] === 'y' && d[0])) fail(where, 'the move leaves the axis');
    return pairText(d);
  }
  if ((m = q.match(/^נקודה נמצאת על ציר ה-x, (\d+) משמאל לנקודה \((−?\d+), 0\)/))) return pairText([val(m[2]) - Number(m[1]), 0]);
  if ((m = q.match(/^מה שיעור ה-(x|y) של כל נקודה על ציר ה-(x|y)\?$/))) return m[1] !== m[2] ? '0' : undefined;
  if ((m = q.match(/^איזו נקודה נמצאת ברביע (\S+)\?$/))) {
    const k = ORDINAL[m[1]];
    return only(where, options.filter((o) => quarter(PAIR.test(o) ? pairsIn(o)[0] : P(o)) === k), `in ${QUARTERS[k]}`);
  }
  if ((m = q.match(/^נקודה נמצאת ברביע (\S+)\. איזה מהזוגות/))) return only(where, options.filter((o) => quarter(pairsIn(o)[0]) === ORDINAL[m[1]]), `in ${m[1]}`);
  if (/^לאיזו נקודה שיעור ה-x שווה לשיעור ה-y\?$/.test(q)) return only(where, options.filter((o) => { const p = P(o); return p && p[0] === p[1]; }), 'with x = y');
  if ((m = q.match(/רצתה לסמן את .*, אבל הלכה (.*)\. איפה היא סימנה\?$/))) return pairText(moves(m[1]));
  if (/^מה המרחק (?:של הנקודה|בין) \((−?\d+), (−?\d+)\) (?:מראשית הצירים|לבין ראשית הצירים)\?$/.test(q)) {
    const [x, y] = pairs[0];
    if (x && y) fail(where, 'the point is not on an axis');
    return signed(Math.abs(x) + Math.abs(y));
  }
  if ((m = q.match(/^כמה נקודות עם שיעורים שלמים יש על ציר ה-x בין \((−?\d+), 0\) ל-\((−?\d+), 0\), בלי שתיהן\?$/))) return signed(val(m[2]) - val(m[1]) - 1);
  if ((m = q.match(/^איזו נקודה נמצאת על ציר ה-(x|y)\?$/))) return only(where, options.filter((o) => { const p = P(o); return p && p[m[1] === 'x' ? 1 : 0] === 0; }), `on the ${m[1]} axis`);
  if ((m = q.match(/^כמה מהנקודות נמצאות ברביע (\S+)\?$/))) return signed(pts.filter((p) => quarter([p.x, p.y]) === ORDINAL[m[1]]).length);
  if ((m = q.match(/^איזו נקודה רחוקה יותר מציר ה-(x|y): /))) {
    const k = m[1] === 'x' ? 1 : 0;
    const [a, b] = pairs;
    return Math.abs(a[k]) === Math.abs(b[k]) ? 'שתיהן באותו מרחק' : pairText(Math.abs(a[k]) > Math.abs(b[k]) ? a : b);
  }
  if ((m = q.match(/^הנקודה [A-Z]?\((−?\d+), (−?\d+)\) זזה (.*)\. מה השיעורים החדשים שלה\?$/))) {
    const d = moves(m[3]);
    return pairText([val(m[1]) + d[0], val(m[2]) + d[1]]);
  }
  if ((m = q.match(/^מה המרחק בין \((−?\d+), (−?\d+)\) ל-\((−?\d+), (−?\d+)\)\?$/))) {
    const [a, b] = pairs;
    if (a[0] !== b[0] && a[1] !== b[1]) fail(where, 'the points are not on one grid line');
    return signed(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]));
  }
  if ((m = q.match(/^ABCD הוא (?:מלבן|ריבוע)\. מה השיעורים של D\?$/))) {
    const [a, b, c] = ['A', 'B', 'C'].map(P);
    if (/ריבוע/.test(q) && Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) !== Math.abs(b[0] - c[0]) + Math.abs(b[1] - c[1])) fail(where, 'the square\'s sides differ');
    return pairText([a[0] + c[0] - b[0], a[1] + c[1] - b[1]]);
  }
  if ((m = q.match(/^הנקודות [A-Z]\((−?\d+), (−?\d+)\) ו-[A-Z]\((−?\d+), (−?\d+)\) נמצאות על קו:$/))) {
    const [a, b] = pairs;
    return a[0] === b[0] ? 'אנכי' : a[1] === b[1] ? 'אופקי' : 'אלכסוני';
  }
  if ((m = q.match(/^הנקודה [A-Z] נמצאת (.*) מהנקודה [A-Z]\((−?\d+), (−?\d+)\)\. /))) {
    const d = moves(m[1]);
    return pairText([val(m[2]) + d[0], val(m[3]) + d[1]]);
  }
  if ((m = q.match(/^בכמה גדל שיעור ה-(x|y) מ-([A-Z]) ל-([A-Z])\?$/))) {
    const k = m[1] === 'x' ? 0 : 1;
    return signed(P(m[3])[k] - P(m[2])[k]);
  }
  if ((m = q.match(/^מה (השטח|ההיקף) של המלבן/))) {
    const corners = /ABCD/.test(q) ? ['A', 'B', 'C', 'D'].map(P) : pairs;
    const xs = [...new Set(corners.map((p) => p[0]))], ys = [...new Set(corners.map((p) => p[1]))];
    if (xs.length !== 2 || ys.length !== 2) fail(where, 'the corners are not a rectangle on the grid');
    const w = Math.abs(xs[0] - xs[1]), h = Math.abs(ys[0] - ys[1]);
    return signed(m[1] === 'השטח' ? w * h : 2 * (w + h));
  }
  if ((m = q.match(/^הנקודה [A-Z] זזה (.*), והגיעה ל-\((−?\d+), (−?\d+)\)\. מאיפה היא יצאה\?$/))) {
    const d = moves(m[1]);
    return pairText([val(m[2]) - d[0], val(m[3]) - d[1]]);
  }
  if (/^מה הנקודה שבדיוק באמצע בין /.test(q)) {
    const [a, b] = pairs;
    return pairText([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
  }
  if ((m = q.match(/^איזו נקודה הכי רחוקה מציר ה-(x|y)\?$/))) {
    const k = m[1] === 'x' ? 1 : 0;
    const far = Math.max(...options.map((o) => Math.abs(P(o)[k])));
    return only(where, options.filter((o) => Math.abs(P(o)[k]) === far), 'the farthest');
  }
  if (/הם שלושה קודקודים של מלבן\. מה הקודקוד הרביעי\?$/.test(q)) {
    const once = (k) => pairs.map((p) => p[k]).find((v, _, a) => a.filter((w) => w === v).length === 1);
    return pairText([once(0), once(1)]);
  }
  return undefined;
}

// ---- theory ----
for (const l of lessons) {
  const where = `${l.subtopic_number} theory`;
  checkGlue(where, l.theory_content_he);
  checkIsolated(where, l.theory_content_he);
  checkMath(where, textOf(l.theory_content_he));
  for (const g of readGrids(where, l.theory_content_he)) checkCaption(where, g);
}

// ---- exercises ----
const counts = {};
let recomputed = 0, withPicture = 0;
// A question refers to its picture when it names a point without its
// coordinates, or when its options are the points' names.
const REFERS = /הנקודה [A-Z]\?|ABCD|מהנקודות נמצאות|מ-[A-Z] ל-[A-Z]\?/;
const needsPicture = (q, options) => REFERS.test(q) || options.every((o) => /^[A-Z]$/.test(o));
for (const e of exercises) {
  const l = lessons.find((x) => x.id === e.lesson_id);
  const where = `${l.subtopic_number} q${e.question_number} (${e.difficulty})`;
  counts[l.subtopic_number] = counts[l.subtopic_number] || { easy: 0, medium: 0, hard: 0 };
  counts[l.subtopic_number][e.difficulty]++;

  const options = (e.options || []).map(plain);
  const answer = plain(e.correct_answer);
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  if (options.length !== 4) fail(where, `${options.length} options`);
  if (new Set(options).size !== options.length) fail(where, 'two options are the same');
  if (!options.includes(answer)) fail(where, 'answer is not an option');
  for (const o of e.options || []) {
    if (HEBREW.test(o) && /[0-9A-Za-z]/.test(o)) fail(where, `option "${o}" mixes Hebrew with numbers or letters (reads scrambled)`);
    if (/-/.test(o)) fail(where, `option "${o}" has an ASCII hyphen, not the minus sign`);
  }
  for (const f of [e.question_text_he, e.explanation_he]) { checkGlue(where, f); checkIsolated(where, f); }
  checkGlue(where, e.explanation_picture);
  checkIsolated(where, e.explanation_picture);
  checkMath(where, plain(e.explanation_he));
  for (const g of readGrids(`${where} picture`, e.explanation_picture)) checkCaption(`${where} picture`, g);

  const q = plain(e.question_text_he);
  const grids = readGrids(`${where} question picture`, e.question_picture);
  if (e.question_picture) {
    withPicture++;
    if (grids.length !== 1) fail(where, `${grids.length} grids in the question's picture`);
  }
  if (needsPicture(q, options) && !e.question_picture) fail(where, 'the question needs its picture and has none');
  if (!needsPicture(q, options) && e.question_picture) fail(where, 'a picture on a question that does not refer to it');
  const pts = grids.length ? grids[0].points : [];
  // The explanation names points by their picture: "A(2, −1)" must be where A is.
  for (const m of plain(e.explanation_he).matchAll(/([A-Z])\((−?\d+), (−?\d+)\)/g)) {
    const p = pts.find((x) => x.name === m[1]);
    if (p && (p.x !== val(m[2]) || p.y !== val(m[3]))) fail(where, `explanation says ${m[0]}, the picture has ${m[1]}${pairText([p.x, p.y])}`);
  }
  const expected = recompute(where, q, options, pts);
  if (expected === undefined) fail(where, `could not re-compute "${q}"`);
  else if (expected !== answer) fail(where, `answer ${answer}, re-computed ${expected}`);
  else recomputed++;
}

for (const [sub, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(sub, `counts ${JSON.stringify(c)}`);
}
if (lessons.length !== 2) fail('topic 107', `${lessons.length} lessons, expected 2`);
console.log(`${lessons.length} lessons, ${exercises.length} exercises (${withPicture} with a picture on the question), ${recomputed} answers re-computed`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
