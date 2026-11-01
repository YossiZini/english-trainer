// Independent check of topic 100 (the multiplication table). Shares no code
// with the seeds: it reads the bundled JSON (or, with SEED=1, the seed
// module's output as data) and re-computes every answer with its own
// evaluator; it also checks that equations are glued (one line on a phone)
// and that every dot picture matches its caption (rows × columns).
// From backend/:
//   node scripts/checks/topic100.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic100.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic100-multiplication.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe, explanation_picture: e.explanationPicture, difficulty: e.difficulty
  })));
} else {
  lessons = require(path.join(ROOT, 'data/static/lessons.json')).filter((l) => l.topic_number === 100);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = require(path.join(ROOT, 'data/static/exercises.json')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const plain = (s) => String(s).replace(/[⁦-⁩]/g, '').replace(/\u00a0/g, ' ').trim();
const isInt = (s) => /^\d+$/.test(plain(s));

/** Integers with × ÷ + −; × and ÷ first, left to right; NaN when not exact or not an expression. */
function evaluate(text) {
  const tokens = plain(text).replace(/\s+/g, '').match(/\d+|[×÷+−]/g);
  if (!tokens || tokens.join('') !== plain(text).replace(/\s+/g, '')) return NaN;
  const terms = [];
  const ops = [];
  let i = 0;
  const factor = () => (/^\d+$/.test(tokens[i]) ? Number(tokens[i++]) : NaN);
  let acc = factor();
  while (i < tokens.length) {
    const op = tokens[i++];
    const v = factor();
    if (op === '×') acc *= v;
    else if (op === '÷') acc = v !== 0 && acc % v === 0 ? acc / v : NaN;
    else { terms.push(acc); ops.push(op); acc = v; }
  }
  terms.push(acc);
  let result = terms[0];
  ops.forEach((op, k) => { result = op === '+' ? result + terms[k + 1] : result - terms[k + 1]; });
  return result;
}

/** Every "a = b = c" in a math segment must hold; returns the last value or null. */
function checkChain(where, segment) {
  if (!segment.includes('=') || segment.includes('?')) return null;
  const parts = segment.split('=').map((p) => p.trim()).filter(Boolean);
  const values = parts.map(evaluate);
  if (values.some((v) => Number.isNaN(v))) return null; // not pure arithmetic (words around it)
  if (!values.every((v) => v === values[0])) fail(where, `"${segment}" does not hold (${values.join(' / ')})`);
  return values[values.length - 1];
}

const segmentsOf = (text) => [...String(text).matchAll(/⁦([^⁩]*)⁩/g)].map((m) => m[1]);

// ---- theory: every equation shown holds; the table cells are products ----
for (const l of lessons) {
  const html = l.theory_content_he;
  for (const m of html.matchAll(/<span dir="ltr">([^<]*)<\/span>/g)) {
    checkChain(`${l.subtopic_number} theory`, m[1]);
    if (m[1].includes(' ')) fail(`${l.subtopic_number} theory`, `"${m[1]}" can break across lines (plain space)`);
  }
  const table = html.match(/<table class="times-table"[\s\S]*?<\/table>/);
  if (table) {
    const rows = [...table[0].matchAll(/<tr><th>(\d+)<\/th>([\s\S]*?)<\/tr>/g)];
    if (rows.length !== 10) fail(`${l.subtopic_number} table`, `${rows.length} rows`);
    rows.forEach((r) => {
      const cells = [...r[2].matchAll(/<td[^>]*>(\d+)<\/td>/g)].map((c) => Number(c[1]));
      cells.forEach((v, j) => { if (v !== Number(r[1]) * (j + 1)) fail(`${l.subtopic_number} table`, `row ${r[1]} col ${j + 1} = ${v}`); });
      if (cells.length !== 10) fail(`${l.subtopic_number} table`, `row ${r[1]} has ${cells.length} cells`);
    });
  }
}

// ---- pictures: a dot array of R rows of C is the fact R × C (the rows × columns rule of 100.1) ----
function checkArrays(where, html) {
  for (const m of String(html || '').matchAll(/aria-label="(\d+) שורות של (\d+) נקודות"([\s\S]*?)<\/svg>(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?/g)) {
    const [, rows, cols, body, caption = ''] = m;
    // Faded (dashed) columns show a part of the array: 6 rows of 10 with one faded is 6 × 9.
    const faded = (body.match(/stroke-dasharray/g) || []).length / Number(rows);
    const shown = [Number(cols), Number(cols) - faded];
    const text = plain(caption.replace(/<[^>]+>/g, ''));
    const pairs = [...text.matchAll(/(\d+) × (\d+)/g), ...text.matchAll(/(\d+) (?:שורות|קבוצות|כרטיסים|ימים) של (\d+)/g)]
      .map(x => [Number(x[1]), Number(x[2])]);
    if (pairs.length && !pairs.some(([r, c]) => r === Number(rows) && shown.includes(c))) {
      fail(where, `picture of ${rows} rows of ${cols}${faded ? ` (${faded} faded)` : ''} captioned "${text}"`);
    }
  }
}
for (const l of lessons) checkArrays(`${l.subtopic_number} theory`, l.theory_content_he);

// ---- exercises ----
const counts = {};
let recomputed = 0;
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
  const numeric = isInt(e.correct_answer);
  if (numeric && !options.every(isInt)) fail(where, 'numeric answer with a non-numeric option');
  if (numeric && options.filter((o) => Number(o) === Number(e.correct_answer)).length !== 1) fail(where, 'a wrong option equals the answer');

  checkArrays(where, e.explanation_picture);

  // Every isolated equation is glued with non-breaking spaces (one line on a phone).
  for (const field of [e.question_text_he, e.explanation_he, e.explanation_picture || '']) {
    for (const seg of [...segmentsOf(field), ...[...String(field).matchAll(/<span dir="ltr">([^<]*)<\/span>/g)].map((m) => m[1])]) {
      if (seg.includes(' ')) fail(where, `"${seg}" can break across lines (plain space)`);
    }
  }

  // The explanation's arithmetic holds, and a numeric answer is its result.
  const results = segmentsOf(e.explanation_he).map((s) => checkChain(where, s)).filter((v) => v !== null);
  if (numeric && !results.includes(Number(e.correct_answer)) && !e.explanation_he.includes(`הוא ${e.correct_answer}`)) {
    fail(where, `explanation never reaches the answer ${e.correct_answer}`);
  }

  // Re-compute the answer from the question.
  const q = plain(e.question_text_he);
  const segs = segmentsOf(e.question_text_he).map(plain);
  let expected;
  let m;
  if ((m = q.match(/^(\d+) ([×÷]) (\d+) = \?$/))) expected = String(evaluate(`${m[1]}${m[2]}${m[3]}`));
  else if ((m = q.match(/\? × (\d+) = (\d+)/))) expected = String(Number(m[2]) / Number(m[1]));
  else if ((m = q.match(/(\d+) × \? = (\d+)/))) expected = String(Number(m[2]) / Number(m[1]));
  else if ((m = q.match(/\? ÷ (\d+) = (\d+)/))) expected = String(Number(m[2]) * Number(m[1]));
  else if ((m = q.match(/(\d+) ÷ \? = (\d+)/))) expected = String(Number(m[1]) / Number(m[2]));
  else if (/^כמה זה /.test(q) || /כמה זה/.test(q)) {
    const given = segs.find((s) => s.includes('='));
    if (given) checkChain(where, given);
    expected = String(evaluate(segs[segs.length - 1]));
  } else if (/גדול|גדולה/.test(q) && segs.length === 2) {
    const [a, b] = segs.map(evaluate);
    expected = a === b ? options.find((o) => /שווים|שוות/.test(o)) : (a > b ? segs[0] : segs[1]);
  } else if ((m = q.match(/איזה תרגיל שווה ל-(\d+)/))) {
    const hits = options.filter((o) => evaluate(o) === Number(m[1]));
    if (hits.length !== 1) fail(where, `${hits.length} options equal ${m[1]}`);
    expected = hits[0];
  } else if (/איזה תרגיל לא נכון/.test(q)) {
    const wrong = options.filter((o) => { const [lhs, rhs] = o.split('='); return evaluate(lhs) !== evaluate(rhs); });
    if (wrong.length !== 1) fail(where, `${wrong.length} wrong equations`);
    expected = wrong[0];
  } else if (/^מה נכון על/.test(q) && segs.length === 2) {
    const [a, b] = segs.map(evaluate);
    expected = a === b ? `שניהם ${a}` : a > b ? 'הראשון גדול יותר' : 'השני גדול יותר';
  } else if (/איזה תרגיל מראה/.test(q)) {
    // which operation: the answer is an expression whose value the explanation reaches
    const v = evaluate(e.correct_answer);
    if (!results.includes(v)) fail(where, `the chosen expression (${v}) is not what the explanation computes`);
    expected = e.correct_answer;
  } else {
    // A word problem: every number in it is used by the explanation.
    const numbers = (q.match(/\d+/g) || []);
    const explanationNumbers = new Set((plain(e.explanation_he).match(/\d+/g) || []));
    numbers.forEach((n) => { if (!explanationNumbers.has(n)) fail(where, `the number ${n} is not used in the explanation`); });
    expected = e.correct_answer; // by the explanation chain above
  }
  if (expected === undefined || expected === 'NaN') fail(where, `could not re-compute "${q}"`);
  else if (String(expected) !== String(e.correct_answer)) fail(where, `answer ${e.correct_answer}, re-computed ${expected}`);
  else recomputed++;
}

for (const [sub, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(sub, `counts ${JSON.stringify(c)}`);
}
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
