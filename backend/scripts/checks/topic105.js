// Independent check of topic 105 (division). Shares no code with the seeds:
// it reads the bundled JSON (or, with SEED=1, the seed module's output as
// data) and re-computes every answer with its own arithmetic. It also checks
// every equation shown ("a ÷ d = q" with its remainder), that equations are
// glued (one line on a phone), that each groups picture matches its caption,
// and reads every long-division picture back: the quotient digits and the
// remainder drawn must be the right ones.
// From backend/:
//   node scripts/checks/topic105.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic105.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic105-division.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe, explanation_picture: e.explanationPicture, difficulty: e.difficulty
  })));
} else {
  lessons = require(path.join(ROOT, 'data/static/lessons.json')).filter((l) => l.topic_number === 105);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = require(path.join(ROOT, 'data/static/exercises.json')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const plain = (s) => String(s ?? '').replace(/[⁦-⁩]/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const isInt = (s) => /^\d+$/.test(plain(s));
const div = (a, d) => ({ q: Math.floor(a / d), r: a % d });

/** Integers with × + − (no division: those are checked with their remainder); NaN otherwise. */
function evaluate(text) {
  const s = plain(text).replace(/\s+/g, '');
  const tokens = s.match(/\d+|[×+−]/g);
  if (!tokens || tokens.join('') !== s) return NaN;
  const terms = [], ops = [];
  let i = 0;
  const num = () => (/^\d+$/.test(tokens[i]) ? Number(tokens[i++]) : NaN);
  let acc = num();
  while (i < tokens.length) {
    const op = tokens[i++], v = num();
    if (op === '×') acc *= v; else { terms.push(acc); ops.push(op); acc = v; }
  }
  terms.push(acc);
  return ops.reduce((r, op, k) => (op === '+' ? r + terms[k + 1] : r - terms[k + 1]), terms[0]);
}

/**
 * Every equation in a text: "a ÷ d = q" must have q = a ÷ d rounded down, and
 * the "ושארית r" after it the true remainder; other chains must hold.
 * `text` is plain (isolates removed). Returns the values reached.
 */
function checkEquations(where, text) {
  const reached = [];
  // A quoted equation is shown on purpose as a mistake ("38 ÷ 7 = 4 ושארית 10" לא נכון).
  text = text.replace(/"[^"]*"/g, ' ');
  for (const m of text.matchAll(/(\d+) ÷ (\d+) = (\d+)( ושארית (\d+))?/g)) {
    const [, a, d, q, , r] = m.map((x) => (x === undefined ? x : x));
    const real = div(Number(a), Number(d));
    if (Number(q) !== real.q) fail(where, `"${m[0]}": the quotient is ${real.q}`);
    if (r !== undefined && Number(r) !== real.r) fail(where, `"${m[0]}": the remainder is ${real.r}`);
    reached.push(Number(q));
  }
  for (const m of text.matchAll(/((?:\d+ [×+−] )+\d+) = (\d+)/g)) {
    const v = evaluate(m[1]);
    if (v !== Number(m[2])) fail(where, `"${m[0]}" does not hold (${v})`);
    reached.push(Number(m[2]));
  }
  return reached;
}

/** Text of the theory and captions with tags removed, isolates and <span dir="ltr"> unwrapped. */
const textOf = (html) => plain(String(html ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ''));

/** Plain spaces inside an isolate or <span dir="ltr"> let a phone break the equation. */
function checkGlue(where, html) {
  const s = String(html ?? '');
  const segs = [...s.matchAll(/⁦([^⁩]*)⁩/g), ...s.matchAll(/<span dir="ltr">([^<]*)<\/span>/g)].map((m) => m[1]);
  segs.forEach((seg) => { if (seg.includes(' ')) fail(where, `"${seg}" can break across lines (plain space)`); });
}

/** Groups pictures match their captions; long divisions draw the right quotient and remainder. */
function checkPictures(where, html) {
  const s = String(html ?? '');
  for (const m of s.matchAll(/<svg[^>]*aria-label="(\d+) קבוצות של (\d+)(?:, ונשארו (\d+))?"[\s\S]*?<\/svg>(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?/g)) {
    const [, count, each, left = '0', caption = ''] = m;
    const body = m[0];
    const dots = (body.match(/<circle /g) || []).length;
    if (dots !== Number(count) * Number(each) + Number(left)) fail(where, `groups picture: ${dots} dots for ${count} × ${each} + ${left}`);
    const text = plain(caption.replace(/<[^>]+>/g, ''));
    for (const c of text.matchAll(/(\d+) ÷ (\d+) = (\d+)(?: ושארית (\d+))?/g)) {
      const total = Number(count) * Number(each) + Number(left);
      const okShare = Number(c[1]) === total && Number(c[2]) === Number(each) && Number(c[3]) === Number(count);
      if (!okShare || (c[4] !== undefined && Number(c[4]) !== Number(left))) fail(where, `groups ${count} × ${each} + ${left} captioned "${text}"`);
    }
    for (const c of text.matchAll(/(\d+) קבוצות של (\d+)(?:, ונשארו (\d+))?/g)) {
      if (c[1] !== count || c[2] !== each || (c[3] || '0') !== left) fail(where, `groups ${count} × ${each} + ${left} captioned "${text}"`);
    }
  }
  for (const m of s.matchAll(/<svg[^>]*aria-label="חילוק ארוך: (\d+) ÷ (\d+)"[\s\S]*?<\/svg>/g)) {
    const a = Number(m[1]), d = Number(m[2]);
    const { q, r } = div(a, d);
    const texts = [...m[0].matchAll(/<text[^>]*fill="([^"]+)"[^>]*>([^<]*)<\/text>/g)].map((t) => ({ fill: t[1], t: t[2] }));
    const quotient = texts.filter((t) => t.fill === '#667eea').map((t) => t.t).join('');
    if (quotient !== String(q)) fail(where, `long division ${a} ÷ ${d} draws the quotient ${quotient}, not ${q}`);
    const orange = texts.filter((t) => t.fill === '#f5a623').map((t) => t.t).join('');
    if (orange !== String(r)) fail(where, `long division ${a} ÷ ${d} draws the remainder ${orange}, not ${r}`);
  }
}

// ---- theory ----
for (const l of lessons) {
  const where = `${l.subtopic_number} theory`;
  checkGlue(where, l.theory_content_he);
  checkEquations(where, textOf(l.theory_content_he));
  checkPictures(where, l.theory_content_he);
}

// ---- exercises ----
const counts = {};
let recomputed = 0;
const REST = /נשאר|יישאר|ישאר|ועוד כמה/;
const UP = /צריך|לפחות/;
const DOWN = /יכול|אפשר|שלמ|מלא|יקבל/;
for (const e of exercises) {
  const l = lessons.find((x) => x.id === e.lesson_id);
  const where = `${l.subtopic_number} q${e.question_number} (${e.difficulty})`;
  counts[l.subtopic_number] = counts[l.subtopic_number] || { easy: 0, medium: 0, hard: 0 };
  counts[l.subtopic_number][e.difficulty]++;

  const options = e.options || [];
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  if (options.length < 3 || options.length > 4) fail(where, `${options.length} options`);
  if (new Set(options).size !== options.length) fail(where, 'duplicate options');
  if (!options.includes(e.correct_answer)) fail(where, 'answer is not an option');
  if (isInt(e.correct_answer) && !options.every(isInt)) fail(where, 'numeric answer with a non-numeric option');
  for (const o of options) {
    if (/^מנה/.test(o) && !/^מנה \d+, שארית \d+$/.test(o)) fail(where, `option "${o}" is not "מנה q, שארית r"`);
  }

  for (const f of [e.question_text_he, e.explanation_he, e.explanation_picture]) checkGlue(where, f);
  checkPictures(where, e.explanation_picture);
  const reached = checkEquations(where, plain(e.explanation_he));

  // Re-compute the answer from the question.
  const q = plain(e.question_text_he);
  const nums = (q.match(/\d+/g) || []).map(Number);
  let expected, m;
  if ((m = q.match(/^(\d+) ÷ (\d+) = \?$/))) {
    const { q: qq, r } = div(Number(m[1]), Number(m[2]));
    expected = options.every(isInt) ? (r === 0 ? String(qq) : undefined) : `מנה ${qq}, שארית ${r}`;
  } else if ((m = q.match(/\? ÷ (\d+) = (\d+)(?: ושארית (\d+))?/))) {
    expected = String(Number(m[2]) * Number(m[1]) + Number(m[3] || 0));
  } else if ((m = q.match(/מה השארית בחילוק (\d+) ÷ (\d+)/))) {
    expected = String(div(Number(m[1]), Number(m[2])).r);
  } else if ((m = q.match(/השארית הגדולה ביותר .* ב-(\d+)/))) {
    expected = String(Number(m[1]) - 1);
  } else if ((m = q.match(/כמה שאריות שונות .* ב-(\d+)/))) {
    expected = m[1];
  } else if ((m = q.match(/חילקו מספר ב-(\d+) וקיבלו (\d+) ושארית (\d+)/))) {
    expected = String(Number(m[1]) * Number(m[2]) + Number(m[3]));
  } else if ((m = q.match(/שארית (\d+)\. מה תהיה השארית אם נוסיף למחולק עוד (\d+)/))) {
    const d = Number(q.match(/בחילוק ב-(\d+)/)[1]);
    expected = `השארית תהיה ${(Number(m[1]) + Number(m[2])) % d}`;
  } else if ((m = q.match(/להוסיף ל-(\d+) כדי שיתחלק ב-(\d+)/))) {
    expected = String((Number(m[2]) - (Number(m[1]) % Number(m[2]))) % Number(m[2]));
  } else if ((m = q.match(/באיזה מספר (\d+) מתחלק בלי שארית/))) {
    const hits = options.filter((o) => Number(m[1]) % Number(o) === 0);
    if (hits.length !== 1) fail(where, `${hits.length} options divide ${m[1]}`);
    expected = hits[0];
  } else if ((m = q.match(/איזה מספר מתחלק ב-(\d+) בלי שארית/))) {
    const hits = options.filter((o) => Number(o) % Number(m[1]) === 0);
    if (hits.length !== 1) fail(where, `${hits.length} options divisible by ${m[1]}`);
    expected = hits[0];
  } else if ((m = q.match(/באיזה תרגיל המנה גדולה מ-(\d+)/))) {
    const hits = options.filter((o) => { const [a, d] = o.split('÷').map((x) => Number(plain(x))); return Math.floor(a / d) > Number(m[1]); });
    if (hits.length !== 1) fail(where, `${hits.length} quotients above ${m[1]}`);
    expected = hits[0];
  } else if ((m = q.match(/כמה ספרות יהיו במנה של (\d+) ÷ (\d+)/))) {
    expected = ['', 'ספרה אחת', 'שתי ספרות', 'שלוש ספרות', 'ארבע ספרות'][String(div(Number(m[1]), Number(m[2])).q).length];
  } else if (/באיזו שאלה התשובה היא השארית/.test(q)) {
    const hits = options.filter((o) => REST.test(o));
    if (hits.length !== 1) fail(where, `${hits.length} options ask what is left`);
    expected = hits[0];
  } else if (nums.length >= 2) {
    // A story: the two largest numbers are the dividend and the divisor; the
    // question decides what the remainder means.
    const [a, d] = [...nums].sort((x, y) => y - x);
    const { q: qq, r } = div(a, d);
    // "אפשר להרכיב" outranks a "צריך 2" in the story's setup; "נשאר" outranks both.
    const kind = REST.test(q) ? 'rest' : DOWN.test(q) ? 'down' : UP.test(q) ? 'up' : r === 0 ? 'exact' : null;
    if (!kind) fail(where, `cannot tell what "${q}" asks`);
    const n = kind === 'rest' ? r : kind === 'up' ? qq + (r > 0 ? 1 : 0) : qq;
    expected = isInt(e.correct_answer) ? String(n) : options.find((o) => (o.match(/\d+/g) || []).map(Number)[0] === n && options.filter((x) => (x.match(/\d+/g) || [])[0] === String(n)).length === 1);
    const said = plain(e.explanation_he);
    if (!reached.includes(n) && !said.includes(`המנה ${qq}`) && !said.includes(`${a} ÷ ${d}`)) fail(where, `explanation reaches neither ${n} nor ${a} ÷ ${d}`);
  }
  if (expected === undefined) fail(where, `could not re-compute "${q}"`);
  else if (String(expected) !== String(e.correct_answer)) fail(where, `answer ${e.correct_answer}, re-computed ${expected}`);
  else recomputed++;
}

for (const [sub, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(sub, `counts ${JSON.stringify(c)}`);
}
if (lessons.length !== 4) fail('topic 105', `${lessons.length} lessons, expected 4`);
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
