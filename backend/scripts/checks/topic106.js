// Independent check of topic 106 (negative numbers). Shares no code with the
// seeds: it reads the bundled JSON (or, with SEED=1, the seed module's output
// as data) and re-computes every answer with its own parser of signed
// expressions (× ÷ + −, parentheses, |x|, the minus sign U+2212). It also
// checks every equation and comparison shown, that equations are glued (one
// line on a phone) and use the real minus sign, that no option mixes Hebrew
// with numbers, that a story's explanation is built from the story's numbers,
// and reads every number-line picture back: points sit on their labels, each
// hop's label is its length, and the line ends where the caption's equation does.
// From backend/:
//   node scripts/checks/topic106.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic106.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic106-negatives.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe, explanation_picture: e.explanationPicture, difficulty: e.difficulty
  })));
} else {
  lessons = require(path.join(ROOT, 'data/static/lessons.json')).filter((l) => l.topic_number === 106);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = require(path.join(ROOT, 'data/static/exercises.json')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const MINUS = '−';
const plain = (s) => String(s ?? '').replace(/[⁦-⁩]/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const HEBREW = /[֐-׿]/;

// ---- a parser of signed integer expressions ----

/** The value of an expression, or NaN when it is not one (or a division is not exact). */
function evaluate(text) {
  const s = plain(text).replace(/\s+/g, '');
  const tokens = s.match(/\d+|[×÷+−()|]/g);
  if (!tokens || tokens.join('') !== s) return NaN;
  let i = 0;
  const peek = () => tokens[i];
  function expr() {
    let v = term();
    while (peek() === '+' || peek() === MINUS) v = tokens[i++] === '+' ? v + term() : v - term();
    return v;
  }
  function term() {
    let v = unary();
    while (peek() === '×' || peek() === '÷') {
      const op = tokens[i++], w = unary();
      if (op === '×') v *= w;
      else v = w !== 0 && v % w === 0 ? v / w : NaN;
    }
    return v;
  }
  function unary() {
    if (peek() === MINUS) { i++; return -unary(); }
    return primary();
  }
  function primary() {
    const t = tokens[i++];
    if (t === undefined) return NaN;
    if (/^\d+$/.test(t)) return Number(t);
    if (t === '(') { const v = expr(); return tokens[i++] === ')' ? v : NaN; }
    if (t === '|') { const v = expr(); return tokens[i++] === '|' ? Math.abs(v) : NaN; }
    return NaN;
  }
  const v = expr();
  return i === tokens.length ? v + 0 : NaN; // + 0: −0 is 0
}

/** "−12" → −12; NaN when the text is not one signed integer. */
const valueOf = (s) => (/^−?\d+$/.test(plain(s)) ? evaluate(s) : NaN);
/** A list "−5, −2, 0, 3" as numbers (null when an item is not a number). */
const listOf = (s) => { const v = plain(s).split(', ').map(valueOf); return v.every(Number.isFinite) ? v : null; };
const signed = (v) => (v < 0 ? `${MINUS}${-v}` : String(v));

const RELATIONS = { '<': (a, b) => a < b, '>': (a, b) => a > b, '=': (a, b) => a === b };

/** true / false for "a < b", "a = b = c", "|−3| = −3"…; null when it is not a statement. */
function holds(statement) {
  const parts = plain(statement).split(/ ([<>=]) /);
  if (parts.length < 3) return null;
  const values = parts.filter((_, k) => k % 2 === 0).map(evaluate);
  if (!values.every(Number.isFinite)) return null;
  for (let k = 1; k < parts.length; k += 2) {
    if (!RELATIONS[parts[k]](values[(k - 1) / 2], values[(k + 1) / 2])) return false;
  }
  return true;
}

/**
 * Every equation or comparison in a plain text must hold. A quoted one is a
 * mistake shown on purpose ("5 − (−3) = 2"). Returns the equations as
 * { left, value } (left: the first side, value: the last).
 */
function checkMath(where, text) {
  const found = [];
  const unquoted = text.replace(/"[^"]*"/g, ' ');
  for (const m of unquoted.matchAll(/[\d−+×÷()| <>=?]+/g)) {
    const run = m[0].trim().replace(/^[)(]+(?=\s)|(?<=\s)[)(]+$/g, '').trim();
    if (!/[<>=]/.test(run) || run.includes('?')) continue;
    const ok = holds(run);
    if (ok === null) { fail(where, `cannot read "${run}"`); continue; }
    if (!ok) fail(where, `"${run}" does not hold`);
    if (run.includes('=') && !/[<>]/.test(run)) {
      const sides = run.split(' = ');
      found.push({ left: sides[0], value: evaluate(sides[sides.length - 1]) });
    }
  }
  return found;
}

/** Text of the theory, captions and explanations with tags (and pictures) removed; a tag ends a run of math. */
const textOf = (html) => plain(String(html ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ¦ ').replace(/<[^>]+>/g, ' ¦ ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));

/**
 * Inside an isolate or <span dir="ltr">: no plain space (a phone would break
 * the line), no ASCII minus. In HTML, a comparison's "<" is written &lt;: a
 * raw one hides the rest of the span from the glue (and from this check).
 */
function checkGlue(where, html, isHtml = true) {
  const s = String(html ?? '');
  if (isHtml) for (const m of s.matchAll(/<(?![a-z/!])[^]{0,12}/gi)) fail(where, `raw "<" in HTML: "${m[0]}"`);
  const segs = [...s.matchAll(/⁦([^⁩]*)⁩/g), ...s.matchAll(/<span dir="ltr">([^<]*)<\/span>/g)].map((m) => m[1]);
  for (const seg of segs) {
    if (seg.includes(' ')) fail(where, `"${seg}" can break across lines (plain space)`);
    if (seg.includes('-')) fail(where, `"${seg}" has an ASCII hyphen, not the minus sign`);
  }
}

/**
 * A negative number outside an isolate or <span dir="ltr"> in Hebrew text
 * shows its minus on the wrong side ("1−"): every "−" must be inside one.
 */
function checkIsolated(where, text) {
  const bare = String(text ?? '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/\u2066[^\u2069]*\u2069/g, ' ')
    .replace(/<span dir="ltr">[^<]*<\/span>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const m of bare.matchAll(/.{0,12}−.{0,6}/g)) fail(where, `a minus outside an isolate: "${m[0].trim()}"`);
}

// ---- number-line pictures ----
const PAD = 16; // the line's first number at x = 16, its last at 16 from the right edge

/** Reads each integer line back and checks it against its own labels and its caption. */
function checkPictures(where, html) {
  const s = String(html ?? '');
  const re = /<svg[^>]*aria-label="ישר המספרים בין (−?\d+) ל-(−?\d+)"[\s\S]*?<\/svg>(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?/g;
  for (const m of s.matchAll(re)) {
    const from = valueOf(m[1]), to = valueOf(m[2]);
    const span = Number(m[0].match(/viewBox="0 0 ([\d.]+) /)[1]) - 2 * PAD;
    const at = (x) => from + ((Number(x) - PAD) / span) * (to - from);
    const whole = (x, what) => {
      const v = at(x);
      if (Math.abs(v - Math.round(v)) > 0.01) fail(where, `${what} at x=${x} is not on a whole number`);
      return Math.round(v) + 0;
    };
    const body = m[0];
    // Points and their labels (the label straight above the point).
    const labels = [...body.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*fill="([^"]+)" font-weight="700" direction="ltr">([^<]*)<\/text>/g)]
      .map((t) => ({ x: Number(t[1]), y: Number(t[2]), fill: t[3], text: t[4] }));
    const points = [...body.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="5.5" fill="([^"]+)"/g)]
      .map((c) => ({ x: Number(c[1]), value: whole(c[1], 'a point'), fill: c[3] }));
    for (const t of body.matchAll(/<text x="([\d.]+)" y="[\d.]+" font-size="\d+" text-anchor="middle" fill="#2b2f3a"(?: font-weight="700")?>([^<]*)<\/text>/g)) {
      if (whole(t[1], 'a tick label') !== valueOf(t[2])) fail(where, `tick ${signed(whole(t[1], 'a tick label'))} labelled ${t[2]}`);
    }
    const atPoint = (l) => points.some((p) => Math.abs(p.x - l.x) < 0.2 && p.fill === l.fill);
    for (const p of points) {
      const label = labels.find((l) => Math.abs(l.x - p.x) < 0.2 && l.fill === p.fill);
      if (label && valueOf(label.text) !== p.value) fail(where, `point at ${signed(p.value)} labelled ${label.text}`);
    }
    // Hops: "M x1 y Q mid top x2 y", the arrowhead at x2; the label is the hop's length.
    const hops = [...body.matchAll(/<path d="M ([\d.]+) ([\d.]+) Q ([\d.]+) ([\d.]+) ([\d.]+) [\d.]+" fill="none" stroke="([^"]+)"/g)]
      .map((h) => ({ from: whole(h[1], 'a hop'), to: whole(h[5], 'a hop'), mid: Number(h[3]), fill: h[6] }));
    for (const h of hops) {
      const label = labels.find((l) => Math.abs(l.x - h.mid) < 0.2 && l.fill === h.fill && !atPoint(l));
      if (!label) continue;
      const t = label.text.replace(/^\+/, '');
      const length = h.to - h.from;
      const ok = label.text.startsWith('+') ? valueOf(t) === length && length > 0
        : t.startsWith(MINUS) ? valueOf(t) === length : valueOf(t) === Math.abs(length);
      if (!ok) fail(where, `hop ${signed(h.from)} → ${signed(h.to)} labelled ${label.text}`);
    }
    // The caption's equation. A sum ends where the equation does; a product
    // a × b is |b| equal hops of a (or |a| of b) from 0; a quotient a ÷ b
    // splits a into |b| equal hops, each the quotient.
    const caption = textOf(m[3] || '').replace(/^¦ | ¦$/g, '');
    const eq = caption.match(/^([^:=¦]*?) = (−?\d+)$/);
    if (eq && Number.isFinite(evaluate(eq[1]))) {
      const value = evaluate(eq[1]);
      const product = eq[1].match(/^(−?\d+) × \(?(−?\d+)\)?$/), quotient = eq[1].match(/^(−?\d+) ÷ \(?(−?\d+)\)?$/);
      const end = quotient ? valueOf(quotient[1]) : value;
      const ends = hops.length ? hops[hops.length - 1].to : null;
      if (ends !== null && ends !== end) fail(where, `the hops end at ${signed(ends)}, "${caption}" at ${signed(end)}`);
      if (!points.some((p) => p.value === end)) fail(where, `no point at ${signed(end)} for "${caption}"`);
      if ((product || quotient) && hops.length) {
        const size = hops[0].to - hops[0].from;
        if (hops[0].from !== 0 || hops.some((h, k) => h.to - h.from !== size || (k && h.from !== hops[k - 1].to))) fail(where, `"${caption}": the hops are not equal steps from 0`);
        const [a, b] = (product || quotient).slice(1, 3).map(valueOf);
        const fits = product ? (hops.length === Math.abs(b) && size === a) || (hops.length === Math.abs(a) && size === b)
          : hops.length === Math.abs(b) && size === value;
        if (!fits) fail(where, `"${caption}" drawn as ${hops.length} hops of ${signed(size)}`);
      }
    }
  }
}

// ---- answers re-computed from the question ----
const WORDS = { שניים: 2, שתי: 2, שני: 2, שלושה: 3, שלוש: 3, ארבעה: 4, ארבע: 4, חמישה: 5, חמש: 5, שישה: 6, שש: 6, שבעה: 7, שבע: 7 };
/** The numbers a story gives: digits (signed) and number words. */
function storyNumbers(q) {
  const out = (q.match(/−?\d+/g) || []).map(valueOf);
  for (const [w, v] of Object.entries(WORDS)) if (new RegExp(`(^|\\s)[ובלכמהש]{0,2}${w}(?=\\s)`).test(q)) out.push(v);
  return out;
}

const only = (where, hits, what) => {
  if (hits.length !== 1) fail(where, `${hits.length} options are ${what}`);
  return hits[0];
};

function recompute(where, q, options, steps, answer) {
  let m;
  const nums = (q.match(/−?\d+/g) || []).map(valueOf);
  if ((m = q.match(/^(.*) = \?$/))) return signed(evaluate(m[1]));
  if ((m = q.match(/^איזה מספר חסר\? (.*)$/))) {
    return only(where, options.filter((o) => holds(m[1].replace('?', /^−/.test(o) && !/^\? /.test(m[1]) ? `(${o})` : o))), `the missing number of "${m[1]}"`);
  }
  if ((m = q.match(/^איזה מספר (גדול|רחוק) יותר(?: מ-0)?: (−?\d+) או (−?\d+)\?$/))) {
    const [a, b] = [valueOf(m[2]), valueOf(m[3])];
    const key = m[1] === 'גדול' ? (v) => v : Math.abs;
    return key(a) === key(b) ? undefined : signed(key(a) > key(b) ? a : b);
  }
  if ((m = q.match(/^איזה מספר הוא הקטן ביותר: (.*)\?$/))) return signed(Math.min(...listOf(m[1])));
  if ((m = q.match(/^סדרו מה(קטן לגדול|גדול לקטן): (.*)$/))) {
    const sorted = [...listOf(m[2])].sort((a, b) => a - b);
    return (m[1] === 'קטן לגדול' ? sorted : sorted.reverse()).map(signed).join(', ');
  }
  if (/^איזה מהמשפטים נכון\?$/.test(q)) return only(where, options.filter((o) => holds(o) === true), 'true statements');
  if ((m = q.match(/הנגדי (?:ל-|למספר מסוים הוא )(−?\d+)/))) return signed(-valueOf(m[1]));
  if ((m = q.match(/^מה המרחק של (−?\d+) מ-0\?$/))) return signed(Math.abs(valueOf(m[1])));
  if ((m = q.match(/^כמה צעדים יש על ישר המספרים (?:מ-|בין )(−?\d+) (?:עד |ל-)(−?\d+)\?$/))) return signed(valueOf(m[2]) - valueOf(m[1]));
  if ((m = q.match(/^כמה מספרים שלמים יש בין (−?\d+) ל-(−?\d+), בלי/))) return signed(valueOf(m[2]) - valueOf(m[1]) - 1);
  if ((m = q.match(/^איזה מספר שלם נמצא בין (−?\d+) ל-(−?\d+)\?$/))) {
    return only(where, options.filter((o) => valueOf(o) > valueOf(m[1]) && valueOf(o) < valueOf(m[2])), 'between');
  }
  if (/^איזה מהמספרים נמצא משמאל ל-0/.test(q)) return only(where, options.filter((o) => valueOf(o) < 0), 'negative');
  if ((m = q.match(/^איזה מספר שלם קטן ב-(\d+) מ-(−?\d+)\?$/))) return signed(valueOf(m[2]) - valueOf(m[1]));
  if ((m = q.match(/^מספר נמצא (\d+) צעדים (משמאל|מימין) ל-(−?\d+)\. מהו\?$/))) return signed(valueOf(m[3]) + (m[2] === 'משמאל' ? -1 : 1) * valueOf(m[1]));
  if ((m = q.match(/^איזה מספר נמצא בדיוק באמצע בין (−?\d+) ל-(−?\d+)\?$/))) return signed((valueOf(m[1]) + valueOf(m[2])) / 2);
  if ((m = q.match(/^אילו מספרים נמצאים במרחק (\d+) מ-0\?$|^לאילו מספרים הערך המוחלט הוא (\d+)\?$/))) {
    const k = valueOf(m[1] || m[2]);
    return `${signed(-k)}, ${k}`;
  }
  if ((m = q.match(/^כמה מספרים שלמים שליליים גדולים מ-(−?\d+)\?$/))) return signed(-valueOf(m[1]) - 1);
  if ((m = q.match(/^באיזה תרגיל התוצאה (הגדולה ביותר|חיובית)\?$/))) {
    const values = options.map(evaluate);
    if (m[1] === 'חיובית') return only(where, options.filter((_, k) => values[k] > 0), 'positive');
    return only(where, options.filter((_, k) => values[k] === Math.max(...values)), 'the largest');
  }
  if ((m = q.match(/^כופלים (\S+) מספרים שליליים\./))) return WORDS[m[1]] % 2 ? 'היא שלילית' : 'היא חיובית';
  if (/איפה היה (?:קר יותר|הכי קר)\?$/.test(q)) {
    // Each option is a place; its temperature is the number written after it.
    const temp = (o) => { const t = q.match(new RegExp(`${o} (−?\\d+)`)); return t ? valueOf(t[1]) : NaN; };
    const temps = options.map(temp).filter(Number.isFinite);
    return only(where, options.filter((o) => temp(o) === Math.min(...temps)), 'the coldest');
  }
  if ((m = q.match(/(\d+) \S+ מתחת ל/)) && !/[×÷+]/.test(q)) return signed(-valueOf(m[1]));

  // A story: the explanation's equations, built from the story's numbers
  // (or from results reached before), must reach the answer.
  const known = new Set([...storyNumbers(q), ...nums].map(Math.abs));
  for (const st of steps) {
    for (const n of (st.left.match(/\d+/g) || []).map(Number)) {
      if (!known.has(n)) fail(where, `the explanation uses ${n}, which is not in the story`);
    }
    known.add(Math.abs(st.value));
  }
  if (!steps.some((st) => st.value === valueOf(answer))) fail(where, `no equation in the explanation reaches ${answer}`);
  return steps.length ? answer : undefined;
}

// ---- theory ----
for (const l of lessons) {
  const where = `${l.subtopic_number} theory`;
  checkGlue(where, l.theory_content_he);
  checkIsolated(where, l.theory_content_he);
  checkMath(where, textOf(l.theory_content_he));
  checkPictures(where, l.theory_content_he);
}

// ---- exercises ----
const counts = {};
let recomputed = 0;
for (const e of exercises) {
  const l = lessons.find((x) => x.id === e.lesson_id);
  const where = `${l.subtopic_number} q${e.question_number} (${e.difficulty})`;
  counts[l.subtopic_number] = counts[l.subtopic_number] || { easy: 0, medium: 0, hard: 0 };
  counts[l.subtopic_number][e.difficulty]++;

  const options = (e.options || []).map(plain);
  const answer = plain(e.correct_answer);
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  if (options.length !== 4) fail(where, `${options.length} options`);
  if (new Set(options.map((o) => (Number.isFinite(valueOf(o)) ? valueOf(o) : o))).size !== options.length) fail(where, 'two options are the same');
  if (!options.includes(answer)) fail(where, 'answer is not an option');
  for (const o of e.options || []) {
    if (HEBREW.test(o) && /\d/.test(o)) fail(where, `option "${o}" mixes Hebrew and numbers (reads scrambled)`);
    if (/-/.test(o)) fail(where, `option "${o}" has an ASCII hyphen, not the minus sign`);
  }

  checkGlue(where, e.question_text_he, false);
  checkGlue(where, e.explanation_he, false);
  checkGlue(where, e.explanation_picture);
  for (const f of [e.question_text_he, e.explanation_he, e.explanation_picture]) checkIsolated(where, f);
  checkPictures(where, e.explanation_picture);
  checkMath(`${where} picture`, textOf(e.explanation_picture));
  const q = plain(e.question_text_he);
  const steps = checkMath(where, plain(e.explanation_he));
  const expected = recompute(where, q, options, steps, answer);
  if (expected === undefined) fail(where, `could not re-compute "${q}"`);
  else if (String(expected) !== answer) fail(where, `answer ${answer}, re-computed ${expected}`);
  else recomputed++;
}

for (const [sub, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(sub, `counts ${JSON.stringify(c)}`);
}
if (lessons.length !== 3) fail('topic 106', `${lessons.length} lessons, expected 3`);
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
