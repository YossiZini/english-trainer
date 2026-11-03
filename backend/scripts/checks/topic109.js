// Independent check of topic 109 (equations with one unknown). Shares no code
// with the seeds: it reads the bundled JSON (or, with SEED=1, the seed
// module's output as data) and
// - re-computes every answer with its own parser and solver of linear
//   equations (exact fractions, implied multiplication, □ as the unknown),
//   from the question, or for a story from its words;
// - checks every equation shown in explanations, captions and the theory
//   (each one holds at the question's solution, or has one whole solution);
// - reads every balance back from its SVG (data-* attributes): what each pan
//   holds, level or tilted the right way, struck items equal on both pans,
//   equal groups, and the box on the side where the question writes x;
// - enforces the reading-order rules of math-content-guide.md ("Equations
//   with the unknown x"): every expression with an operator or = inside an
//   isolate or <span dir="ltr">, no question, explanation or caption starting
//   with x or an isolate, no x/4, options numbers or Hebrew words only, no
//   negative number outside an isolate, glued equations.
// From backend/:
//   node scripts/checks/topic109.js          # data/static/{lessons,exercises}.json
//   SEED=1 node scripts/checks/topic109.js   # the seed module, before generate-data
// Exits 1 and lists the problems when anything is wrong.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

let lessons, exercises;
if (process.env.SEED) {
  const { lessonsData } = require(path.join(ROOT, 'src/database/seeds/topic109-equations.js'));
  lessons = lessonsData.map((l, i) => ({ id: `L${i}`, topic_number: l.topicNumber, subtopic_number: l.subtopicNumber, theory_content_he: l.theoryContentHe }));
  exercises = lessonsData.flatMap((l, i) => l.exercises.map((e) => ({
    lesson_id: `L${i}`, question_number: e.questionNumber, type: e.type, question_text_he: e.questionTextHe,
    options: e.options, correct_answer: e.correctAnswer, explanation_he: e.explanationHe,
    explanation_picture: e.explanationPicture, question_picture: e.questionPicture, difficulty: e.difficulty
  })));
} else {
  lessons = require(path.join(ROOT, 'data/static/lessons.json')).filter((l) => l.topic_number === 109);
  const ids = new Set(lessons.map((l) => l.id));
  exercises = require(path.join(ROOT, 'data/static/exercises.json')).filter((e) => ids.has(e.lesson_id));
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);
const LRI = '⁦', PDI = '⁩';
const HEBREW = /[֐-׿]/;
const flat = (s) => String(s ?? '').replace(/ /g, ' ');

// ---------------------------------------------------------------- fractions
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
const qadd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qneg = (a) => Q(-a.n, a.d);
const qdiv = (a, b) => { if (!b.n) throw new Error('division by 0'); return Q(a.n * b.d, a.d * b.n); };
const qeq = (a, b) => a.n === b.n && a.d === b.d;
const qstr = (a) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);

// A linear form a·x + b.
const L = (a, b) => ({ a, b });
const ladd = (p, q) => L(qadd(p.a, q.a), qadd(p.b, q.b));
const lneg = (p) => L(qneg(p.a), qneg(p.b));
function lmul(p, q) {
  if (p.a.n && q.a.n) throw new Error('x × x');
  return L(qadd(qmul(p.a, q.b), qmul(q.a, p.b)), qmul(p.b, q.b));
}
function ldiv(p, q) {
  if (q.a.n) throw new Error('division by x');
  return L(qdiv(p.a, q.b), qdiv(p.b, q.b));
}
const lat = (p, x) => qadd(qmul(p.a, x), p.b);

// ---------------------------------------------------------------- parser
/** Tokens of an expression: numbers, x (□ too), operators, parentheses. */
function tokens(text) {
  const s = flat(text).replace(/[⁦-⁩]/g, '').replace(/\s+/g, '').replace(/□/g, 'x');
  const out = s.match(/\d+|x|[−+×÷()]/g);
  if (!out || out.join('') !== s) throw new Error(`cannot read "${text}"`);
  return out;
}
/** A linear form from an expression: + − × ÷, parentheses, unary −, 3x and 2(…) as products. */
function parse(text) {
  const t = tokens(text);
  let i = 0;
  const peek = () => t[i];
  function primary() {
    const k = t[i++];
    if (k === '−') return lneg(primary());
    if (k === '(') { const v = sum(); if (t[i++] !== ')') throw new Error(`no ) in "${text}"`); return v; }
    if (k === 'x') return L(Q(1), Q(0));
    if (/^\d+$/.test(k)) {
      let v = L(Q(0), Q(Number(k)));
      // Implied product: 3x, 2(x + 3)
      while (peek() === 'x' || peek() === '(') v = lmul(v, primary());
      return v;
    }
    throw new Error(`unexpected "${k}" in "${text}"`);
  }
  function product() {
    let v = primary();
    while (peek() === '×' || peek() === '÷') v = t[i++] === '×' ? lmul(v, primary()) : ldiv(v, primary());
    return v;
  }
  function sum() {
    let v = product();
    while (peek() === '+' || peek() === '−') v = t[i++] === '+' ? ladd(v, product()) : ladd(v, lneg(product()));
    return v;
  }
  const v = sum();
  if (i !== t.length) throw new Error(`left over in "${text}"`);
  return v;
}
/** The one solution of l = r (both linear forms), or null. */
function solveForms(l, r) {
  const a = qadd(l.a, qneg(r.a)), b = qadd(r.b, qneg(l.b));
  return a.n ? qdiv(b, a) : null;
}
/** "E = F" → its solution as text, or throws. */
function solveText(eqText) {
  const [l, r, ...rest] = flat(eqText).split('=');
  if (rest.length || r === undefined) throw new Error(`not one equation: "${eqText}"`);
  const x = solveForms(parse(l), parse(r));
  if (!x) throw new Error(`no single solution: "${eqText}"`);
  return x;
}
/** A number written in the lessons: "−5" → −5; null otherwise. */
const num = (s) => (/^−?\d+$/.test(flat(s).trim()) ? Number(flat(s).trim().replace('−', '-')) : null);
const show = (q) => (q.d === 1 ? (q.n < 0 ? `−${-q.n}` : `${q.n}`) : null);

/** Every chain "A = B = C" (or a comparison) in a text must hold, at x when x appears. */
function checkChain(where, chain, x) {
  const s = flat(chain).replace(/[⁦-⁩]/g, '');
  if (/[<>]/.test(s)) {
    const [a, b] = s.split(/[<>]/).map((p) => parse(p));
    if (a.a.n || b.a.n) return;
    const ok = s.includes('<') ? a.b.n / a.b.d < b.b.n / b.b.d : a.b.n / a.b.d > b.b.n / b.b.d;
    if (!ok) fail(where, `"${s}" does not hold`);
    return;
  }
  if (!s.includes('=') || !/[\dx]/.test(s)) return;
  let parts;
  try { parts = s.split('=').map((p) => parse(p)); } catch (err) { fail(where, err.message); return; }
  const withX = parts.some((p) => p.a.n);
  // An identity (3x + 2x = 5x, 2(x + 3) = 2x + 6): the same form on every side holds for every x.
  if (withX && parts.every((p) => qeq(p.a, parts[0].a) && qeq(p.b, parts[0].b))) return;
  if (withX && !x) {
    // An equation on its own (theory): it must have one whole solution, and every part agree with it.
    const sol = solveForms(parts[0], parts[1]);
    if (!sol || sol.d !== 1) { fail(where, `"${s}" has no single whole solution`); return; }
    // No equation of the theory solves to 0: that is an identity written wrong (3x + 2x = 6x).
    if (!sol.n) { fail(where, `"${s}" solves to 0: a broken identity?`); return; }
    x = sol;
  }
  const values = parts.map((p) => (x ? lat(p, x) : p.b));
  if (!values.every((v) => qeq(v, values[0]))) fail(where, `"${s}" does not hold${x ? ` at x = ${qstr(x)}` : ''}`);
}
/** The isolates of a text, and its <span dir="ltr"> contents. */
const isolates = (s) => [...flat(s).matchAll(/⁦([^⁩]*)⁩/g)].map((m) => m[1]);
const spans = (s) => [...flat(s).matchAll(/<span dir="ltr">([^<]*)<\/span>/g)].map((m) => m[1]);

// ---------------------------------------------------------------- reading order
/** Text outside isolates and spans, tags removed. */
const outside = (s) => flat(s).replace(/⁦[^⁩]*⁩/g, ' ').replace(/<span dir="ltr">[^<]*<\/span>/g, ' ').replace(/<[^>]+>/g, ' ');
function checkOrder(where, s, { caption = false } = {}) {
  if (!s) return;
  const out = outside(s);
  // Every expression with an operator or = in an isolate or span; a negative number too.
  if (/[=+×÷<>]|&lt;|&gt;/.test(out)) fail(where, `an operator or = outside an isolate: "${out.trim().slice(0, 60)}"`);
  if (/−/.test(out)) fail(where, 'a minus sign outside an isolate');
  // x alone may stand in Hebrew; 3x and x with a number must be isolated.
  if (/\dx|x\d/.test(out)) fail(where, '3x outside an isolate');
  if (/x\s*\//.test(flat(s))) fail(where, 'x/n written as a fraction (shows flat): write x ÷ n');
  // Glue: an equation must not break across lines (U+00A0, not plain spaces).
  const raw = String(s);
  for (const g of [...raw.matchAll(/\u2066([^\u2069]*)\u2069/g), ...raw.matchAll(/<span dir="ltr">([^<]*)<\/span>/g)]) {
    if (/ /.test(g[1])) fail(where, `"${g[1]}" is not glued (plain spaces)`);
  }
  // Start: never x or an isolate (a dir="auto" box turns the line left to right).
  // A caption may start with a <span dir="ltr">: dir="auto" skips spans.
  const start = (caption ? flat(s).replace(/<span dir="ltr">[^<]*<\/span>/g, '') : flat(s)).replace(/<[^>]+>/g, '').trimStart();
  if (start.startsWith(LRI) || /^x\b/.test(start)) fail(where, `starts with ${start.startsWith(LRI) ? 'an isolate' : 'x'}`);
  if (!caption && /^<span dir="ltr">/.test(flat(s).trimStart())) fail(where, 'starts with an equation');
  if (caption && /⁦/.test(s)) fail(where, 'a caption with an isolate (use <span dir="ltr">)');
}

// ---------------------------------------------------------------- balances
/** Every balance in an HTML string, read from its data-* attributes. */
function balances(html) {
  const out = [];
  for (const m of flat(html).matchAll(/<figure class="math-figure">(.*?)<\/figure>/g)) {
    const fig = m[1];
    if (!fig.includes('data-balance')) continue;
    const tilt = fig.match(/data-tilt="(\w+)"/)[1];
    // Each pan's side from where it is drawn (its stem's x against the middle), not from its label.
    const width = Number(fig.match(/viewBox="0 0 ([\d.]+)/)[1]);
    const parts = fig.split(/<g data-pan="(?:left|right)">/).slice(1);
    if (parts.length !== 2) { out.push({ broken: true }); continue; }
    const stemX = (s) => Number((s.match(/x1="([\d.]+)"/) || [])[1]);
    const [leftPart, rightPart] = stemX(parts[0]) < width / 2 ? parts : [parts[1], parts[0]];
    const caption = (fig.match(/<figcaption[^>]*>(.*)<\/figcaption>/) || [])[1] || '';
    const pan = (s) => {
      const items = [...s.matchAll(/data-item="(\w+)"((?: data-\w+="[^"]*")*)/g)].map((it) => ({
        kind: it[1], label: (it[2].match(/data-label="([^"]*)"/) || [])[1],
        value: Number((it[2].match(/data-value="(\d+)"/) || [])[1] || 0), crossed: /data-crossed="1"/.test(it[2])
      }));
      const sum = (pred) => items.filter(pred).reduce((v, it) => (it.kind === 'box' ? ladd(v, L(Q(1), Q(0)))
        : it.kind === 'weight' ? ladd(v, L(Q(0), Q(it.value))) : it.kind === 'unit' ? ladd(v, L(Q(0), Q(1))) : v), L(Q(0), Q(0)));
      return {
        all: sum(() => true), kept: sum((it) => !it.crossed), struck: sum((it) => it.crossed),
        boxes: items.filter((it) => it.kind === 'box').length, labels: [...new Set(items.filter((it) => it.kind === 'box').map((it) => it.label))],
        groups: [...s.matchAll(/data-group="\d+"/g)].length,
        groupUnits: s.split('data-group="').slice(1).map((g) => (g.match(/data-item="unit"/g) || []).length + (g.match(/data-item="box"/g) || []).length * 1000)
      };
    };
    out.push({ tilt, left: pan(leftPart), right: pan(rightPart), caption });
  }
  return out;
}
/**
 * A balance must weigh right: level when both pans are equal at x, tilted to
 * the heavier pan otherwise; struck items the same on both pans; equal groups.
 * `x` is the question's solution, or the caption's "x = n", or the balance's own.
 */
function checkBalance(where, b, x, sides = null) {
  if (b.broken) { fail(where, 'a balance without two pans'); return; }
  if (!x) {
    // The caption's own equation with x (x = 9 + 4 = 13): its solution.
    for (const sp of spans(b.caption)) {
      if (x || !/x/.test(sp) || !sp.includes('=')) continue;
      try {
        const parts = sp.split('=').map(parse);
        const withX = parts.find((p) => p.a.n), without = parts.find((p) => !p.a.n);
        if (withX && without) x = solveForms(withX, without);
      } catch (err) { /* not an equation of x */ }
    }
  }
  // The same boxes on both pans (x against x + 4): the tilt is the numbers' alone, for every x.
  const cancel = !x && (b.left.boxes || b.right.boxes) && qeq(b.left.all.a, b.right.all.a);
  if (!x && !cancel && (b.left.boxes || b.right.boxes)) {
    const own = solveForms(b.left.all, b.right.all);
    if (!own || own.d !== 1 || own.n <= 0) { fail(where, 'a balance without one positive whole weight for the box'); return; }
    x = own;
  }
  const at = (p) => (x ? lat(p, x) : p.b);
  const l = at(b.left.all), r = at(b.right.all);
  const diff = l.n / l.d - r.n / r.d;
  const want = diff === 0 ? 'level' : diff > 0 ? 'left' : 'right';
  if (b.tilt !== want) fail(where, `balance drawn ${b.tilt}, but its pans weigh ${qstr(l)} and ${qstr(r)}${x ? ` at x = ${qstr(x)}` : ''}`);
  const sameStruck = x ? qeq(at(b.left.struck), at(b.right.struck)) : qeq(b.left.struck.a, b.right.struck.a) && qeq(b.left.struck.b, b.right.struck.b);
  if (!sameStruck) fail(where, 'struck items differ between the pans (both sides must lose the same)');
  if (b.left.groups && b.right.groups && b.left.groups !== b.right.groups) fail(where, `${b.left.groups} groups against ${b.right.groups}`);
  for (const side of ['left', 'right']) {
    const g = b[side].groupUnits;
    if (g.length && !g.every((v) => v === g[0])) fail(where, `unequal groups on the ${side} pan`);
  }
  // The box on the side where the question writes x.
  if (sides) {
    const boxSide = b.left.boxes && !b.right.boxes ? 'left' : b.right.boxes && !b.left.boxes ? 'right' : null;
    if (boxSide && sides !== boxSide) fail(where, `the box is on the ${boxSide} pan, but the question writes x on the ${sides}`);
  }
  if (b.left.labels.length + b.right.labels.length > 1 && new Set([...b.left.labels, ...b.right.labels]).size > 1) fail(where, 'boxes with different labels');
}

// ---------------------------------------------------------------- stories
const WORDS = { 'שלוש': 3, 'ארבע': 4, 'שש': 6, 'רבע': 4, 'שלושה': 3, 'ארבעה': 4, 'אחד': 1 };
const n = (s) => (WORDS[s] !== undefined ? WORDS[s] : num(s));
/** The equation a story describes, from its words; null when not recognised. */
function storyEquation(q) {
  const N = '(−?\\d+|שלושה|ארבעה|שלוש|ארבע|שש)';
  const rules = [
    [new RegExp(`הוספתי לו ${N} וקיבלתי ${N}`), (a, b) => `x + ${a} = ${b}`],
    [new RegExp(`כפלתי אותו ב-${N}(?: וקיבלתי|\\. יצא) ${N}`), (a, b) => `${a}x = ${b}`],
    [new RegExp(`הורדתי ממנו ${N} וקיבלתי ${N}`), (a, b) => `x − ${a} = ${b}`],
    [new RegExp(`הצטרפו עוד ${N}, ועכשיו יש ${N}`), (a, b) => `x + ${a} = ${b}`],
    [new RegExp(`קנתה .* ב-${N} שקלים, ונשארו לה ${N}`), (a, b) => `x − ${a} = ${b}`],
    [new RegExp(`עלתה ב-${N} מעלות והגיעה ל-${N}`), (a, b) => `x + ${a} = ${b}`],
    [new RegExp(`עלתה ${N} קומות והגיעה לקומה ${N}`), (a, b) => `x + ${a} = ${b}`],
    [new RegExp(`${N} חברים חילקו .* ויחד היו ${N}`), (a, b) => `${a}x = ${b}`],
    [new RegExp(`ל${N} קבוצות שוות, ובכל קבוצה ${N}`), (a, b) => `x ÷ ${a} = ${b}`],
    [new RegExp(`${N} מחברות זהות עולות יחד ${N}`), (a, b) => `${a}x = ${b}`],
    [new RegExp(`(רבע) מהתלמידים בשכבה הם ${N}`), (a, b) => `x ÷ ${a} = ${b}`],
    [new RegExp(`על כף אחת קופסה ו-${N} קוביות, ועל הכף השנייה ${N} קוביות`), (a, b) => `x + ${a} = ${b}`],
    [new RegExp(`על כף אחת ${N} קופסאות שוות, ועל הכף השנייה ${N} קוביות`), (a, b) => `${a}x = ${b}`],
    [new RegExp(`כפלתי אותו ב-${N} והוספתי ${N}, וקיבלתי ${N}`), (a, b, c) => `${a}x + ${b} = ${c}`],
    [new RegExp(`כפלתי אותו ב-${N} והורדתי ${N}, וקיבלתי ${N}`), (a, b, c) => `${a}x − ${b} = ${c}`],
    [new RegExp(`קנתה ${N} מחברות זהות ועט ב-${N} שקלים, ושילמה בסך הכול ${N} שקלים`), (a, b, c) => `${a}x + ${b} = ${c}`],
    [new RegExp(`במונית עולה ${N} שקלים, ועוד ${N} שקלים על כל קילומטר\\. נסיעה אחת עלתה ${N} שקלים`), (a, b, c) => `${b}x + ${a} = ${c}`],
    // 10.5: the unknown on both sides
    [new RegExp(`יש ${N} שקלים, והוא חוסך ${N} שקלים בכל שבוע\\. לרוני יש ${N} שקלים, והיא חוסכת ${N} שקלים בכל שבוע`), (a, b, c, d) => `${b}x + ${a} = ${d}x + ${c}`],
    [new RegExp(`כפלתי אותו ב-${N} והוספתי ${N}, וקיבלתי את אותה תוצאה כמו כשכפלתי אותו ב-${N} והורדתי ${N}`), (a, b, c, d) => `${a}x + ${b} = ${c}x − ${d}`],
    [new RegExp(`משלמים ${N} שקלים דמי הרשמה, ועוד ${N} שקלים לכל אימון\\. במכון השני אין דמי הרשמה, ומשלמים ${N} שקלים לכל אימון`), (a, b, c) => `${b}x + ${a} = ${c}x`],
    [new RegExp(`נר אחד באורך ${N} סנטימטרים מתקצר ב-${N} סנטימטרים בכל שעה\\. נר שני באורך ${N} סנטימטרים מתקצר (?:ב-${N} סנטימטרים|בסנטימטר (אחד)) בכל שעה`), (a, b, c, d, one) => `${a} − ${b}x = ${c} − ${[d, one].find((v) => /\d/.test(v))}x`],
    [new RegExp(`יש פי ${N} מדבקות מאשר לאחיה\\. אם היא תיתן לו ${N} מדבקות, יהיה להם אותו מספר`), (a, b) => `${a}x − ${b} = x + ${b}`],
    // 10.6: parentheses and like terms
    [new RegExp(`${N} חברים הלכו לסרט\\. כל אחד שילם על כרטיס, ועוד ${N} שקלים על פופקורן\\. יחד הם שילמו ${N} שקלים`), (a, b, c) => `${a}(x + ${b}) = ${c}`],
    [new RegExp(`הסכום של (שלושה) מספרים עוקבים הוא ${N}`), (a, b) => (a === '3' ? `x + x + 1 + x + 2 = ${b}` : null)],
    [new RegExp(`אורך של מלבן גדול ב-${N} סנטימטרים מהרוחב שלו, וההיקף שלו ${N} סנטימטרים`), (a, b) => `2(x + x + ${a}) = ${b}`],
    [new RegExp(`לריבוע ולמשולש שווה צלעות יש אותו היקף\\. הצלע של המשולש ארוכה ב-${N} סנטימטרים מהצלע של הריבוע`), (a) => `4x = 3(x + ${a})`]
  ];
  for (const [re, eqOf] of rules) {
    const m = flat(q).replace(/[⁦-⁩]/g, '').match(re);
    if (m) return eqOf(...m.slice(1).map((v) => flat(String(n(v))).replace('-', '−')));
  }
  return null;
}

/**
 * 10.7: a story, its equation (x as the story's own "נסמן" would choose it),
 * and what each of its questions asks, as an expression in x.
 */
function wordProblem(q) {
  const N = '(\\d+)';
  const t = flat(q).replace(/[⁦-⁩]/g, '');
  const rules = [
    [`(\\S+) גדולה מאחיה ב-${N} שנים, ויחד הגילים שלהם ${N}\\.`, ([name, d, s]) => [`x + x + ${d} = ${s}`, [['בן כמה האח\\?', 'x'], [`בת כמה ${name}\\?`, `x + ${d}`]]]],
    [`אמא גדולה פי ${N} מבתה, ויחד הגילים שלהן ${N}\\.`, ([k, s]) => [`${k}x + x = ${s}`, [['בת כמה הבת\\?', 'x'], ['בת כמה אמא\\?', `${k}x`]]]],
    [`אבא בן ${N} ובנו בן ${N}\\. בעוד כמה שנים יהיה האבא גדול פי ${N} מבנו\\?`, ([a, b, k]) => [`${a} + x = ${k}(${b} + x)`, [['', 'x']]]],  // the story is its question
    [`ל(\\S+) היו ${N} שקלים\\. הוא קנה ${N} (\\S+) במחיר זהה, ונשארו לו ${N} שקלים\\.`, ([name, a, k, items, r]) => [`${k}x + ${r} = ${a}`, [['כמה עלה כל \\S+\\?', 'x'], [`כמה שילם ${name} על כל ה${items}\\?`, `${k}x`]]]],
    [`שני אחים חילקו ביניהם ${N} שקלים\\. הגדול קיבל ${N} שקלים יותר מהקטן\\.`, ([s, d]) => [`x + x + ${d} = ${s}`, [['כמה קיבל הקטן\\?', 'x'], ['כמה קיבל הגדול\\?', `x + ${d}`]]]],
    [`${N} גולות חולקו בין רון לגיל, ולרון יש פי ${N} יותר גולות מאשר לגיל\\.`, ([s, k]) => [`${k}x + x = ${s}`, [['כמה גולות יש לגיל\\?', 'x'], ['כמה גולות יש לרון\\?', `${k}x`]]]],
    [`אורך של מלבן גדול פי ${N} מהרוחב שלו, וההיקף שלו ${N} סנטימטרים\\.`, ([k, p]) => [`2(${k}x + x) = ${p}`, [['מה הרוחב של המלבן\\?', 'x'], ['מה האורך של המלבן\\?', `${k}x`]]]],
    [`במשולש שווה שוקיים כל שוק ארוכה מהבסיס ב-${N} סנטימטרים, וההיקף שלו ${N} סנטימטרים\\.`, ([d, p]) => [`x + 2(x + ${d}) = ${p}`, [['מה אורך הבסיס\\?', 'x'], ['מה אורך כל שוק\\?', `x + ${d}`]]]],
    [`הסכום של שני מספרים עוקבים הוא ${N}\\.`, ([s]) => [`x + x + 1 = ${s}`, [['מה המספר הקטן\\?', 'x'], ['מה המספר הגדול\\?', 'x + 1']]]],
    [`הסכום של שלושה מספרים זוגיים עוקבים הוא ${N}\\.`, ([s]) => [`x + x + 2 + x + 4 = ${s}`, [['מה המספר הקטן\\?', 'x'], ['מה המספר האמצעי\\?', 'x + 2'], ['מה המספר הגדול\\?', 'x + 4']]]],
    [`${N} ילדים חילקו ביניהם ${N} סוכריות שווה בשווה, ונשארו ${N} סוכריות\\.`, ([k, s, r]) => [`${k}x + ${r} = ${s}`, [['כמה סוכריות קיבל כל ילד\\?', 'x']]]],
    [`כרטיס למבוגר יקר ב-${N} שקלים מכרטיס לילד\\. ${N} מבוגרים ו-${N} ילדים שילמו יחד ${N} שקלים\\.`, ([d, m, c, s]) => [`${m}(x + ${d}) + ${c}x = ${s}`, [['כמה עולה כרטיס לילד\\?', 'x'], ['כמה עולה כרטיס למבוגר\\?', `x + ${d}`]]]]
  ];
  for (const [re, of] of rules) {
    const m = t.match(new RegExp(`^${re}`));
    if (!m) continue;
    const [eq, asks] = of(m.slice(1));
    const rest = t.slice(m[0].length).trim();
    const ask = asks.find(([a]) => new RegExp(`^${a}$`).test(rest));
    return { eq, ask: ask ? ask[1] : null, rest };
  }
  return null;
}

/** 10.7: what an expression question describes ("3 מדבקות יותר ממנה" → x + 3), as a linear form. */
function describedExpression(q) {
  const m = flat(q).match(/^ל(\S+) יש x (\S+), ול(\S+) יש (.+)\. איזה ביטוי מתאר כמה (\S+) יש ל(\S+)\?$/);
  if (!m || m[5] !== m[2] || m[6] !== m[3]) return null;
  const [rel, things] = [m[4], m[2]];
  let k;
  if ((k = rel.match(new RegExp(`^(\\d+) ${things} יותר ממנה$`)))) return parse(`x + ${k[1]}`);
  if ((k = rel.match(new RegExp(`^(\\d+) ${things} פחות ממנה$`)))) return parse(`x − ${k[1]}`);
  if ((k = rel.match(/^פי (\d+) ממה שיש לה$/))) return parse(`${k[1]}x`);
  if ((k = rel.match(/^פי (\d+) ממה שיש לה ועוד (\d+)$/))) return parse(`${k[1]}x + ${k[2]}`);
  if (rel === 'חצי ממה שיש לה') return parse('x ÷ 2');
  return null;
}

// ---------------------------------------------------------------- questions
/**
 * The answer a question asks for, re-computed from its text, and the x its
 * explanation works with; undefined when the question is not recognised.
 */
function recompute(q, options = []) {
  const iso = isolates(q);
  let m;
  // 10.7: which equation fits the story — exactly one option solves to the story's x.
  if (q.endsWith('איזו משוואה מתאימה לסיפור?')) {
    const w = wordProblem(q);
    if (!w) return undefined;
    const x = solveText(w.eq);
    const fits = options.filter((o) => { try { return qeq(solveText(o), x); } catch (err) { return false; } });
    if (fits.length !== 1) return { answer: `(${fits.length} options fit the story ${w.eq})`, x: null };
    return { answer: fits[0], x, eq: w.eq, story: true };
  }
  // 10.7: which expression the words describe — exactly one option is that expression.
  if (q.endsWith('איזה ביטוי מתאר כמה') || /איזה ביטוי מתאר כמה \S+ יש ל\S+\?$/.test(q)) {
    const want = describedExpression(q);
    if (!want) return undefined;
    const same = options.filter((o) => { try { const v = parse(o); return qeq(v.a, want.a) && qeq(v.b, want.b); } catch (err) { return false; } });
    return same.length === 1 ? { answer: same[0], x: null } : { answer: `(${same.length} options are the expression)`, x: null };
  }
  // 10.7: a word problem — its equation from its words, the answer to what it asks.
  const w = wordProblem(q);
  if (w) {
    if (!w.ask) return undefined;
    const x = solveText(w.eq);
    return { answer: show(lat(parse(w.ask), x)), x, eq: w.eq, story: true };
  }
  if ((m = q.match(/^מה הפתרון של המשוואה ⁦([^⁩]*)⁩\?$/)) || (m = q.match(/^מה מסתתר בקופסה\? ⁦([^⁩]*)⁩$/))) {
    const x = solveText(m[1]);
    return { answer: show(x), x, eq: m[1] };
  }
  if ((m = q.match(/^מה הערך של ⁦([^⁩]*)⁩ כאשר ⁦x\s*=\s*([^⁩]*)⁩\?$/))) {
    const x = Q(num(m[2]));
    return { answer: show(lat(parse(m[1]), x)), x: null };
  }
  if ((m = q.match(/^האם ⁦x\s*=\s*([^⁩]*)⁩ הוא הפתרון של המשוואה ⁦([^⁩]*)⁩\?$/))
    || (m = q.match(/הפתרון של המשוואה ⁦([^⁩]*)⁩ הוא (−?\d+)\. האם היא צודקת\?$/))) {
    const [s, e] = q.startsWith('האם') ? [m[1], m[2]] : [m[2], m[1]];
    const [l, r] = flat(e).split('=').map(parse);
    const v = Q(num(s));
    return { answer: qeq(lat(l, v), lat(r, v)) ? 'כן' : 'לא', x: solveText(e), eq: e };
  }
  if ((m = q.match(/^איזה מספר (מורידים מ|מוסיפים ל)שני האגפים (?:כדי לפתור את|בצעד הראשון של) ⁦([^⁩]*)⁩\?$/))) {
    // The number beside x (x on one side only): taken off when added, added when taken off.
    const [l, r] = flat(m[2]).split('=').map(parse);
    if (l.a.n && r.a.n) return undefined;
    const b = l.a.n ? l.b : r.b;
    if (!b.n || (m[1] === 'מורידים מ') !== (b.n > 0)) return { answer: '(the wrong step is asked)', x: null };
    return { answer: show(Q(Math.abs(b.n), b.d)), x: solveText(m[2]), eq: m[2] };
  }
  if ((m = q.match(/^באיזה מספר (מחלקים|כופלים) את שני האגפים כדי לפתור את ⁦([^⁩]*)⁩\?$/))) {
    const e = m[2];
    const k = m[1] === 'מחלקים' ? (e.match(/^(\d+)x =/) || [])[1] : (e.match(/^x ÷ (\d+) =/) || [])[1];
    return k ? { answer: k, x: solveText(e), eq: e } : undefined;
  }
  if ((m = q.match(/^במשוואה ⁦([^⁩]*)⁩ (מורידים (\d+) משני האגפים|מוסיפים (\d+) לשני האגפים|מחלקים את שני האגפים ב-(\d+))\. איזה מספר יהיה באגף ימין\?$/))) {
    const r = parse(flat(m[1]).split('=')[1]);
    if (r.a.n) return undefined;
    const v = m[3] ? qadd(r.b, Q(-Number(m[3]))) : m[4] ? qadd(r.b, Q(Number(m[4]))) : qdiv(r.b, Q(Number(m[5])));
    return { answer: show(v), x: solveText(m[1]), eq: m[1] };
  }
  if ((m = q.match(/^במשוואה ⁦([^⁩]*)⁩ (מורידים|מוסיפים) ⁦(\d*)x⁩ (?:משני|לשני) האגפים\. כמה x יהיו באגף (שמאל|ימין)\?$/))) {
    // How many x stay on one side after k·x leave (or join) both sides.
    if ((m[2] === 'מורידים') !== q.includes('משני האגפים')) return { answer: '(the wrong step is asked)', x: null };
    const [l, r] = flat(m[1]).split('=').map(parse);
    const k = Q((m[2] === 'מורידים' ? 1 : -1) * Number(m[3] || 1));
    const v = qadd(m[4] === 'שמאל' ? l.a : r.a, qneg(k));
    return { answer: show(v), x: solveText(m[1]), eq: m[1] };
  }
  if ((m = q.match(/^כשפותחים את הסוגריים ב-⁦([^⁩]*)⁩ מקבלים ⁦([^⁩]*)⁩ (ועוד|פחות) מספר\. איזה מספר\?$/))) {
    // k(px + q) opened: the x part must be the one named, the number is ±k·q.
    const e = parse(m[1]), named = parse(m[2]);
    if (named.b.n || !qeq(named.a, e.a)) return { answer: `(the x part is ${qstr(e.a)}x)`, x: null };
    return { answer: show(m[3] === 'ועוד' ? e.b : qneg(e.b)), x: null };
  }
  if ((m = q.match(/^במשוואה ⁦([^⁩]*)⁩ מכנסים את ה-x באגף (שמאל|ימין)\. כמה x יהיו שם\?$/))) {
    const [l, r] = flat(m[1]).split('=').map(parse);
    return { answer: show(m[2] === 'שמאל' ? l.a : r.a), x: solveText(m[1]), eq: m[1] };
  }
  // A story: its equation from its words.
  const e = storyEquation(q);
  if (e) { const x = solveText(e); return { answer: show(x), x, eq: e, story: true }; }
  return undefined;
}

// ---------------------------------------------------------------- run
const counts = {};
let recomputed = 0, pictures = 0, theoryPictures = 0;
for (const lesson of lessons) {
  const where = `${lesson.subtopic_number} theory`;
  const html = lesson.theory_content_he;
  // Theory: equations in spans, glued; paragraphs and captions in order.
  for (const p of String(html).matchAll(/<p>(.*?)<\/p>/g)) checkOrder(`${where} paragraph`, p[1]);
  for (const c of String(html).matchAll(/<figcaption[^>]*>(.*?)<\/figcaption>/g)) checkOrder(`${where} caption`, c[1], { caption: true });
  if (/⁦/.test(html)) fail(where, 'an isolate in the theory (use <span dir="ltr">)');
  for (const sp of spans(html)) checkChain(`${where} "${sp}"`, sp.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), null);
  for (const b of balances(html)) { theoryPictures++; checkBalance(`${where} balance "${outside(b.caption).trim() || spans(b.caption).join(' ')}"`, b, null); }
}

for (const e of exercises) {
  const lesson = lessons.find((l) => l.id === e.lesson_id);
  const sub = lesson.subtopic_number;
  const where = `${sub} q${e.question_number}`;
  counts[sub] = counts[sub] || { easy: 0, medium: 0, hard: 0 };
  counts[sub][e.difficulty]++;
  const options = (e.options || []).map((o) => flat(o));
  const answer = flat(e.correct_answer);
  if (e.type !== 'multiple_choice') fail(where, `type ${e.type}`);
  const yesNo = options.includes('כן');
  if (options.length !== (yesNo ? 3 : 4)) fail(where, `${options.length} options`);
  if (new Set(options).size !== options.length) fail(where, 'two options are the same');
  if (!options.includes(answer)) fail(where, 'answer is not an option');
  // An option with x (10.7): an expression or an equation of x, no Hebrew, that parses.
  const mathOption = (o) => !HEBREW.test(o) && /x/.test(o) && !/[A-Za-wyz]/.test(o) && (() => {
    try { o.split('=').forEach((p) => parse(p)); return o.split('=').length <= 2; } catch (err) { return false; }
  })();
  for (const raw of e.options || []) if (mathOption(flat(raw)) && / /.test(raw)) fail(where, `option "${raw}" is not glued (plain spaces)`);
  for (const o of options) {
    if (!(num(o) !== null || (HEBREW.test(o) && !/[0-9A-Za-z−=]/.test(o)) || mathOption(o))) fail(where, `option "${o}" is neither a number, Hebrew words nor an expression of x`);
    if (/^-/.test(o)) fail(where, `option "${o}" with a hyphen for minus`);
  }
  if (num(answer) !== null && options.filter((o) => num(o) === num(answer)).length > 1) fail(where, 'a wrong option equals the answer');
  if (e.question_picture) fail(where, 'a question picture (not in this chapter)');

  checkOrder(`${where} question`, e.question_text_he);
  checkOrder(`${where} explanation`, e.explanation_he);
  let r;
  try { r = recompute(flat(e.question_text_he), options); } catch (err) { fail(where, err.message); }
  if (r === undefined) { fail(where, `could not re-compute "${flat(e.question_text_he)}"`); continue; }
  if (!r) continue;
  if (r.answer !== answer) fail(where, `answer ${answer}, re-computed ${r.answer}`);
  else recomputed++;
  // A story's explanation states the equation its words describe.
  if (r.story) {
    const said = isolates(e.explanation_he).find((s) => s.includes('x') && s.includes('='));
    if (!said) fail(where, 'the story explanation states no equation');
    else if (!qeq(solveText(said), r.x)) fail(where, `the explanation's equation "${said}" is not the story's (${r.eq})`);
  }
  // Every equation of the explanation holds at the question's x.
  for (const iso of isolates(e.explanation_he)) checkChain(`${where} explanation "${flat(iso)}"`, iso, iso.includes('x') ? r.x : null);
  // The explanation picture: captions in order, the balance weighs right, the box where x is written.
  if (e.explanation_picture) {
    for (const c of String(e.explanation_picture).matchAll(/<figcaption[^>]*>(.*?)<\/figcaption>/g)) checkOrder(`${where} caption`, c[1], { caption: true });
    for (const sp of spans(e.explanation_picture)) checkChain(`${where} caption "${sp}"`, sp, sp.includes('x') || sp.includes('□') ? r.x : null);
    const side = r.eq ? (/x|□/.test(flat(r.eq).split('=')[0]) ? 'left' : 'right') : null;
    for (const b of balances(e.explanation_picture)) { pictures++; checkBalance(`${where} balance`, b, r.x, side); }
  }
}

for (const [sub, c] of Object.entries(counts)) {
  if (c.easy !== 10 || c.medium !== 10 || c.hard !== 10) fail(sub, `counts ${JSON.stringify(c)}`);
}
console.log(`${lessons.length} lessons, ${exercises.length} exercises, ${recomputed} answers re-computed, ${pictures} explanation balances and ${theoryPictures} theory balances read back`);
console.log(problems.length ? problems.join('\n') : 'no problems');
process.exit(problems.length ? 1 : 0);
