// Independent check of topic 108 (triangles). Shares no code with the seeds:
// it reads the bundled JSON (or, with SEED=1, the seed module's output as
// data), reads every triangle picture back from its SVG (the three corners,
// so the real angles and side lengths) and checks the drawing against its
// labels: each angle label within 1° of the drawn angle, each right-angle
// mark on a right angle, equal-side marks on equal sides, the side and
// height labels in proportion to what is drawn. It re-computes every
// answer from the question (or from the picture of the question), checks
// the equations of explanations and captions, the glue of equations, and
// options that mix Hebrew with numbers or Latin letters.
// From backend/:
//   node scripts/checks/topic108.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic108.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic108-triangles.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe,
    explanation_picture: e.explanationPicture, question_picture: e.questionPicture, difficulty: e.difficulty
  })));
} else {
  lessons = require(path.join(ROOT, 'data/static/lessons.json')).filter((l) => l.topic_number === 108);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = require(path.join(ROOT, 'data/static/exercises.json')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const plain = (s) => String(s ?? '').replace(/[⁦-⁩]/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const HEBREW = /[֐-׿]/;
const fmt = (v) => String(Math.round(v * 100) / 100);
const numbers = (s) => (s.match(/\d+(?:\.\d+)?/g) || []).map(Number);

// ---- arithmetic ----
/** Numbers with × ÷ + − and parentheses (degrees ignored); NaN otherwise. */
function evaluate(text) {
  const s = plain(text).replace(/°/g, '').replace(/\s+/g, '');
  const tokens = s.match(/\d+(?:\.\d+)?|[×÷+−()]/g);
  if (!tokens || tokens.join('') !== s) return NaN;
  let i = 0;
  const peek = () => tokens[i];
  const expr = () => { let v = term(); while (peek() === '+' || peek() === '−') v = tokens[i++] === '+' ? v + term() : v - term(); return v; };
  const term = () => { let v = primary(); while (peek() === '×' || peek() === '÷') { const op = tokens[i++], w = primary(); v = op === '×' ? v * w : v / w; } return v; };
  const primary = () => { const t = tokens[i++]; if (/^\d/.test(t || '')) return Number(t); if (t === '(') { const v = expr(); return tokens[i++] === ')' ? v : NaN; } return NaN; };
  const v = expr();
  return i === tokens.length ? v : NaN;
}

/** Every equation and comparison in a plain text must hold (a quoted one is a mistake shown on purpose). */
function checkMath(where, text) {
  const s = text.replace(/"[^"]*"/g, ' ').replace(/∠[A-Z] = /g, ' ');
  // A point belongs to a number only between digits ("2.5"), not at a sentence's end.
  for (const m of s.matchAll(/(?:\d+(?:\.\d+)?|[°×÷+−() =<>])+/g)) {
    const run = m[0].trim();
    if (!/[=<>]/.test(run) || !/\d/.test(run)) continue;
    const parts = run.split(/ ([=<>]) /);
    if (parts.length < 3) { fail(where, `cannot read "${run}"`); continue; }
    const values = parts.filter((_, k) => k % 2 === 0).map(evaluate);
    if (!values.every(Number.isFinite)) { fail(where, `cannot read "${run}"`); continue; }
    for (let k = 1; k < parts.length; k += 2) {
      const [a, b] = [values[(k - 1) / 2], values[(k + 1) / 2]];
      const ok = parts[k] === '=' ? Math.abs(a - b) < 1e-9 : parts[k] === '<' ? a < b : a > b;
      if (!ok) fail(where, `"${run}" does not hold`);
    }
  }
}

const textOf = (html) => plain(String(html ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ¦ ').replace(/<[^>]+>/g, ' ¦ ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));

function checkGlue(where, html) {
  const s = String(html ?? '');
  const segs = [...s.matchAll(/⁦([^⁩]*)⁩/g), ...s.matchAll(/<span dir="ltr">([^<]*)<\/span>/g)].map((m) => m[1]);
  for (const seg of segs) if (seg.includes(' ')) fail(where, `"${seg}" can break across lines (plain space)`);
}

// ---- triangles, read back ----
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const angleAt = (v, a, b) => {
  const u = [a[0] - v[0], a[1] - v[1]], w = [b[0] - v[0], b[1] - v[1]];
  return (Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) * 180) / Math.PI;
};

/** Each triangle in the HTML: corners, angles, sides, labels; checks the drawing against its labels. */
function readTriangles(where, html) {
  const out = [];
  for (const m of String(html ?? '').matchAll(/<svg[^>]*aria-label="משולש ([A-Z]{3})"[\s\S]*?<\/svg>(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?/g)) {
    const body = m[0];
    const shape = body.match(/<path d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) Z" fill="#eef0fd"/);
    if (!shape) { fail(where, 'a triangle without its outline'); continue; }
    const V = [[shape[1], shape[2]], [shape[3], shape[4]], [shape[5], shape[6]]].map((p) => p.map(Number));
    const angles = V.map((v, i) => angleAt(v, V[(i + 1) % 3], V[(i + 2) % 3]));
    const sides = [dist(V[0], V[1]), dist(V[1], V[2]), dist(V[2], V[0])]; // AB, BC, CA
    const texts = [...body.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*fill="([^"]+)"[^>]*>([^<]*)<\/text>/g)]
      .map((t) => ({ x: Number(t[1]), y: Number(t[2]), fill: t[3], text: t[4] }));
    const nearestCorner = (t) => V.map((v, i) => [dist(v, [t.x, t.y - 4.5]), i]).sort((a, b) => a[0] - b[0])[0][1];
    // The vertices' names: each corner its own letter, in order.
    const names = m[1].split('');
    for (const t of texts.filter((x) => x.fill === '#2b2f3a' && /^[A-Z]$/.test(x.text))) {
      if (names[nearestCorner(t)] !== t.text) fail(where, `${t.text} is written at corner ${names[nearestCorner(t)]}`);
    }
    // Angle labels.
    const angleLabels = {};
    for (const t of texts.filter((x) => x.fill === '#c27c0e')) {
      const i = nearestCorner(t);
      angleLabels[names[i]] = t.text;
      if (t.text === '?') continue;
      const v = parseFloat(t.text);
      if (Math.abs(v - angles[i]) > 1) fail(where, `angle ${names[i]} labelled ${t.text}, drawn ${angles[i].toFixed(1)}°`);
    }
    // Right-angle marks: a corner square on a right angle.
    for (const sq of body.matchAll(/<path d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)" fill="none" stroke="#f5a623" stroke-width="1.8"\/>/g)) {
      const mid = [Number(sq[3]), Number(sq[4])];
      const i = V.map((v, k) => [dist(v, mid), k]).sort((a, b) => a[0] - b[0])[0][1];
      if (Math.abs(angles[i] - 90) > 0.5) fail(where, `a right-angle mark at ${names[i]}, drawn ${angles[i].toFixed(1)}°`);
      angleLabels[names[i]] = angleLabels[names[i]] || '90°';
    }
    // Equal-side marks: short strokes across a side; sides with the same count are equal.
    const sideMid = [[0, 1], [1, 2], [2, 0]].map(([i, j]) => [(V[i][0] + V[j][0]) / 2, (V[i][1] + V[j][1]) / 2]);
    const ticks = [0, 0, 0];
    for (const t of body.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="#2b2f3a" stroke-width="2"\/>/g)) {
      const c = [(Number(t[1]) + Number(t[3])) / 2, (Number(t[2]) + Number(t[4])) / 2];
      const k = sideMid.map((p, n) => [dist(p, c), n]).sort((a, b) => a[0] - b[0])[0][1];
      ticks[k]++;
    }
    for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
      if (ticks[a] && ticks[a] === ticks[b] && Math.abs(sides[a] - sides[b]) / sides[a] > 0.01) fail(where, 'two sides marked equal are drawn different');
    }
    // Side labels (beside a side) and the height label: in proportion to the drawing.
    const lengths = [];
    const sideLabels = ['', '', ''];
    for (const t of texts.filter((x) => x.fill === '#2b2f3a' && /^\d/.test(x.text))) {
      const k = sideMid.map((p, n) => [dist(p, [t.x, t.y - 4.5]), n]).sort((a, b) => a[0] - b[0])[0][1];
      sideLabels[k] = t.text;
      lengths.push([Number(t.text), sides[k]]);
    }
    let heightLabel = '';
    const hl = texts.find((x) => x.fill === '#667eea');
    if (hl) {
      heightLabel = hl.text;
      const a = V[0], b = V[1], c = V[2];
      const drawn = Math.abs((b[0] - a[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (b[1] - a[1])) / dist(a, b);
      lengths.push([Number(hl.text), drawn]);
    }
    const ratios = lengths.map(([label, drawn]) => drawn / label);
    if (ratios.some((r) => Math.abs(r - ratios[0]) / ratios[0] > 0.02)) fail(where, `lengths ${lengths.map((l) => l[0]).join(', ')} are not drawn in proportion`);
    const caption = textOf(m[2] || '').replace(/^¦ | ¦$/g, '');
    const c = caption.match(/∠([A-Z]) = (?:.* = )?(\d+)°$/);
    if (c && Math.abs(angles[names.indexOf(c[1])] - Number(c[2])) > 1) fail(where, `caption "${caption}" but the drawn angle is ${angles[names.indexOf(c[1])].toFixed(1)}°`);
    out.push({ names, angles, sides, ticks, angleLabels, sideLabels, heightLabel, caption });
  }
  return out;
}

// ---- kinds of triangles ----
const BY_SIDES = ['שווה צלעות', 'שווה שוקיים', 'שונה צלעות'];
const BY_ANGLES = ['חד-זווית', 'ישר-זווית', 'קהה-זווית'];
const kindBySides = (s) => { const eqs = [s[0] === s[1], s[1] === s[2], s[0] === s[2]].filter(Boolean).length; return eqs === 3 ? BY_SIDES[0] : eqs ? BY_SIDES[1] : BY_SIDES[2]; };
const kindByAngles = (a) => { const big = Math.max(...a); return Math.abs(big - 90) < 0.5 ? BY_ANGLES[1] : big > 90 ? BY_ANGLES[2] : BY_ANGLES[0]; };
/** Drawn sides as "equal" by the marks when there are any, else by length. */
const sidesOf = (t) => (t.ticks.some(Boolean) ? t.ticks.map((n, k) => (n ? `t${n}` : `s${k}`)) : t.sides.map((x) => Math.round(x * 10)));
/** Can a triangle be described so? ("ישר-זווית ושווה שוקיים", "משולש עם שתי זוויות ישרות") */
function possible(desc) {
  if (/שתי זוויות (ישרות|קהות)/.test(desc)) return false;
  const byAngles = BY_ANGLES.filter((k) => desc.includes(k)), bySides = BY_SIDES.filter((k) => desc.includes(k));
  if (byAngles.length > 1 || bySides.length > 1) return false;
  if (bySides[0] === BY_SIDES[0] && byAngles.length && byAngles[0] !== BY_ANGLES[0]) return false;
  return true;
}
const triangleOk = ([a, b, c]) => { const [x, y, z] = [a, b, c].sort((p, q) => p - q); return x + y > z; };
const only = (where, hits, what) => { if (hits.length !== 1) fail(where, `${hits.length} options are ${what}`); return hits[0]; };

function recompute(where, q, options, pic) {
  if (/שבציור/.test(q) && !pic) return undefined; // reported above: the picture is missing
  const n = numbers(q);
  const deg = (v) => `${fmt(v)}°`;
  let m;
  // Kinds, by sides and by angles.
  if (/כל שלוש הצלעות שוות\. איך הוא נקרא לפי הצלעות/.test(q)) return BY_SIDES[0];
  if (/^למשולש צלעות של .* איך הוא נקרא לפי הצלעות\?$/.test(q)) return kindBySides(n);
  if (/^אחת הזוויות של משולש היא 90°\. איך הוא נקרא לפי הזוויות\?$/.test(q)) return BY_ANGLES[1];
  if (/^הזוויות של משולש הן .* איך הוא נקרא לפי הזוויות\?$/.test(q)) {
    if (n.reduce((s, v) => s + v, 0) !== 180) fail(where, 'the angles do not add up to 180°');
    return kindByAngles(n);
  }
  if (/^שתי זוויות של משולש הן .* איך נקרא המשולש לפי הזוויות\?$/.test(q)) return kindByAngles([...n, 180 - n[0] - n[1]]);
  if (/שבציור לפי הצלעות\?$/.test(q)) return kindBySides(sidesOf(pic));
  if (/שבציור לפי הזוויות\?$/.test(q)) return kindByAngles(pic.angles);
  if (/^מה נכון לגבי המשולש שבציור\?$/.test(q)) return `${kindByAngles(pic.angles)} ו${kindBySides(sidesOf(pic))}`;
  if (/^הזוויות של משולש הן .* מה נכון לגביו\?$/.test(q)) return `${kindByAngles(n)} ו${kindBySides(n)}`; // equal angles, equal sides
  if (/^איזה משולש אי אפשר לבנות\?$/.test(q)) return only(where, options.filter((o) => !possible(o)), 'impossible');
  if (/^איזה משולש אפשר לבנות\?$/.test(q)) return only(where, options.filter(possible), 'possible');
  if ((m = q.match(/^משולש (\S+) יכול להיות גם:$/))) return only(where, options.filter((o) => possible(`${m[1]} ${o}`)), 'possible with it');
  if (/^משולש שווה צלעות הוא תמיד:$/.test(q)) return BY_ANGLES[0];
  // Which lengths and angles can be a triangle.
  if (/^האם אפשר לבנות משולש מצלעות של /.test(q)) return triangleOk(n) ? 'כן' : 'לא';
  if (/^האם יש משולש שזוויותיו /.test(q)) return n.reduce((s, v) => s + v, 0) === 180 ? 'כן' : 'לא';
  if (/^האם יש משולש שווה שוקיים שזוויות הבסיס שלו (\d+)°/.test(q)) return 2 * n[0] < 180 ? 'כן' : 'לא';
  if (/^איזו שלישייה יכולה להיות אורכי הצלעות של משולש\?$/.test(q)) return only(where, options.filter((o) => triangleOk(numbers(o))), 'triangles');
  if (/^איזו שלישייה יכולה להיות הזוויות של משולש\?$/.test(q)) return only(where, options.filter((o) => numbers(o).reduce((s, v) => s + v, 0) === 180), 'angles of a triangle');
  if (/^שתי צלעות של משולש הן .* איזה אורך יכול להיות לצלע השלישית/.test(q)) return only(where, options.filter((o) => triangleOk([n[0], n[1], Number(o)])), 'a possible third side');
  if (/^במשולש שווה שוקיים, אחת הצלעות .* מה אורך הצלע השלישית/.test(q)) return only(where, [n[0], n[1]].filter((x) => triangleOk([n[0], n[1], x])).map(fmt), 'a possible third side');
  if (/^שתי צלעות של משולש הן .* כמה אפשרויות/.test(q)) return fmt(n[0] + n[1] - Math.abs(n[0] - n[1]) - 1);
  if (/^כמה קודקודים יש למשולש\?$/.test(q)) return '3';
  if (/^כמה זוויות ישרות יש במשולש ישר-זווית\?$/.test(q)) return '1';
  if (/^כמה זוויות חדות יש במשולש קהה-זווית\?$/.test(q)) return '2';
  if (/^במשולש שווה צלעות, צלע אחת היא/.test(q)) return fmt(n[0]);
  if ((m = q.match(/הזווית הגדולה ביותר היא הזווית שבקודקוד ([A-Z])\. איזו צלע הארוכה ביותר\?$/))) return 'ABC'.replace(m[1], '');
  if ((m = q.match(/הצלעות ([A-Z]{2}) ו-([A-Z]{2}) שוות\. אילו זוויות שוות\?$/))) {
    const opposite = (side) => 'ABC'.split('').find((x) => !side.includes(x));
    return [opposite(m[1]), opposite(m[2])].sort().map((x) => `∠${x}`).join(', ');
  }
  // Angles.
  if (/^מה סכום הזוויות במשולש\?$/.test(q)) return '180°';
  if (/^מה גודל כל זווית במשולש שווה צלעות\?$/.test(q)) return deg(60);
  if (/^במשולש ישר-זווית ושווה שוקיים, מה גודל כל אחת מהזוויות החדות\?$/.test(q)) return deg(45);
  if (/∠A = \d+° ו-∠B = \d+°\. מה גודל הזווית C\?$/.test(q)) return deg(180 - n[0] - n[1]);
  if (/^במשולש ישר-זווית, אחת הזוויות החדות היא/.test(q)) return deg(90 - n[0]);
  if (/^במשולש ישר-זווית, זווית חדה אחת גדולה פי (\d+)/.test(q)) return deg(90 / (n[0] + 1));
  if (/^במשולש ישר-זווית, זווית חדה אחת גדולה מהשנייה ב-/.test(q)) return deg((90 + n[0]) / 2);
  if (/הזווית שבראש(?: הגג)? היא (\d+)°\. מה גודל כל זווית (?:בסיס|בבסיס)/.test(q)) return deg((180 - n[0]) / 2);
  if (/כל זווית בסיס היא (\d+)°\. מה גודל הזווית שבראש\?$/.test(q)) return deg(180 - 2 * n[0]);
  if (/^במשולש יש שתי זוויות של (\d+)°\. מה גודל הזווית השלישית\?$/.test(q)) return deg(180 - 2 * n[0]);
  if (/אחת הזוויות (\d+)° והשנייה (\d+)°\. מה גודל הזווית השלישית\?$/.test(q)) return deg(180 - n[0] - n[1]);
  if (/^סכום שתי זוויות של משולש הוא/.test(q)) return deg(180 - n[0]);
  if (/^אחת הזוויות של משולש היא (\d+)°\. מה סכום שתי הזוויות האחרות\?$/.test(q)) return deg(180 - n[0]);
  if (/∠A = (\d+)°, והזווית B גדולה ממנה ב-(\d+)°\. מה גודל הזווית C\?$/.test(q)) return deg(180 - n[0] - (n[0] + n[1]));
  if (/הזווית A שווה לזווית B, ו-∠C = (\d+)°\. מה גודל הזווית A\?$/.test(q)) return deg((180 - n[0]) / 2);
  if (/^במשולש שווה שוקיים, אחת הזוויות היא (\d+)°\. מה גודל אחת הזוויות האחרות\?$/.test(q)) {
    if (n[0] < 90) fail(where, 'two answers: the angle may be at the base or at the top');
    return deg((180 - n[0]) / 2);
  }
  if (/^במשולש שווה שוקיים, אחת הזוויות היא (\d+)°\. איזה גודל לא יכול להיות/.test(q)) {
    const can = [n[0], 180 - 2 * n[0], (180 - n[0]) / 2].map(deg);
    return only(where, options.filter((o) => !can.includes(o)), 'impossible');
  }
  // Perimeter.
  if ((m = q.match(/^למשולש צלעות של .* מה ההיקף שלו, ב(ס״מ|מטרים)\?$/))) return fmt(n.reduce((s, v) => s + v, 0) / (m[1] === 'מטרים' ? 100 : 1));
  if (/^למשולש שווה צלעות צלע של (\d+) ס״מ\. מה ההיקף/.test(q)) return fmt(3 * n[0]);
  if (/^במשולש שווה שוקיים, כל שוק (\d+) ס״מ והבסיס (\d+) ס״מ\. מה ההיקף/.test(q)) return fmt(2 * n[0] + n[1]);
  if (/^במשולש שווה שוקיים הבסיס (\d+) ס״מ וכל שוק (\d+) ס״מ\. מה ההיקף/.test(q)) return fmt(n[0] + 2 * n[1]);
  if (/^ההיקף של משולש שווה צלעות הוא (\d+)/.test(q)) return fmt(n[0] / 3);
  if (/^ההיקף של משולש (\d+) ס״מ, ושתיים מהצלעות/.test(q)) return fmt(n[0] - n[1] - n[2]);
  if (/^ההיקף של משולש שווה שוקיים (\d+) ס״מ, והבסיס שלו (\d+)/.test(q)) return fmt((n[0] - n[1]) / 2);
  // Area.
  if (/בסיס של משולש (\d+) ס״מ, והגובה אליו (\d+) ס״מ\. מה השטח/.test(q)) return fmt((n[0] * n[1]) / 2);
  if (/הניצבים (?:של משולש ישר-זווית הם|שלה) (\d+) (?:ו-|מטר ו-)(\d+)/.test(q)) return fmt((n[0] * n[1]) / 2);
  if (/^למשולש ישר-זווית צלעות של .* מה השטח/.test(q)) { const [a, b] = [...n].sort((x, y) => x - y); return fmt((a * b) / 2); }
  if (/^במשולש שווה שוקיים הבסיס (\d+) ס״מ, כל שוק (\d+) ס״מ, והגובה לבסיס (\d+) ס״מ\. מה השטח/.test(q)) return fmt((n[0] * n[2]) / 2);
  if (/^מה שטח המשולש שבציור/.test(q)) {
    if (pic.heightLabel) return fmt((Number(pic.sideLabels[0]) * Number(pic.heightLabel)) / 2);
    const right = pic.angles.findIndex((a) => Math.abs(a - 90) < 0.5);
    const legs = [[0, 2], [0, 1], [1, 2]][right].map((k) => Number(pic.sideLabels[k]));
    return fmt((legs[0] * legs[1]) / 2);
  }
  if (/^השטח של משולש (\d+) סמ״ר, והבסיס שלו (\d+) ס״מ\. מה הגובה/.test(q)) return fmt((2 * n[0]) / n[1]);
  if (/^השטח של משולש ישר-זווית (\d+) סמ״ר, ואחד הניצבים (\d+)/.test(q)) return fmt((2 * n[0]) / n[1]);
  if (/^השטח של משולש (\d+) סמ״ר, והגובה שלו פי (\d+) מהבסיס/.test(q)) return fmt(Math.sqrt((2 * n[0]) / n[1]));
  if (/^מכפילים את הבסיס של משולש, והגובה נשאר/.test(q)) return '2';
  if (/^מכפילים גם את הבסיס וגם את הגובה/.test(q)) return '4';
  if (/^ריבוע שצלעו (\d+) ס״מ נחתך לאורך האלכסון/.test(q)) return fmt((n[0] * n[0]) / 2);
  if (/^במלבן של (\d+) על (\d+) ס״מ, משולש שהבסיס שלו/.test(q)) return fmt((n[0] * n[1]) / 2);
  if (/^בתוך מלבן של (\d+) על (\d+) ס״מ צויר משולש .* כמה סמ״ר מהמלבן נשארים/.test(q)) return fmt(n[0] * n[1] - (n[2] * n[3]) / 2);
  if (/^לשני משולשים אותו בסיס, (\d+) ס״מ\. הגובה של האחד (\d+) ס״מ, ושל השני (\d+)/.test(q)) return fmt((n[0] * (n[2] - n[1])) / 2);
  return undefined;
}

// ---- theory ----
for (const l of lessons) {
  const where = `${l.subtopic_number} theory`;
  checkGlue(where, l.theory_content_he);
  checkMath(where, textOf(l.theory_content_he));
  readTriangles(where, l.theory_content_he);
}

// ---- exercises ----
const counts = {};
let recomputed = 0, withPicture = 0, triangles = 0;
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
  }
  for (const f of [e.question_text_he, e.explanation_he, e.explanation_picture]) checkGlue(where, f);
  checkMath(where, plain(e.explanation_he));
  checkMath(`${where} picture`, textOf(e.explanation_picture));
  triangles += readTriangles(`${where} picture`, e.explanation_picture).length;
  const q = plain(e.question_text_he);
  const pics = readTriangles(`${where} question picture`, e.question_picture);
  if (e.question_picture) withPicture++;
  if (/שבציור/.test(q) !== !!e.question_picture) fail(where, /שבציור/.test(q) ? 'the question needs its picture and has none' : 'a picture on a question that does not refer to it');
  const expected = recompute(where, q, options, pics[0]);
  if (expected === undefined) fail(where, `could not re-compute "${q}"`);
  else if (expected !== answer) fail(where, `answer ${answer}, re-computed ${expected}`);
  else recomputed++;
}

for (const [sub, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(sub, `counts ${JSON.stringify(c)}`);
}
if (lessons.length !== 3) fail('topic 108', `${lessons.length} lessons, expected 3`);
console.log(`${lessons.length} lessons, ${exercises.length} exercises (${withPicture} with a picture on the question, ${triangles} explanation triangles), ${recomputed} answers re-computed`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
