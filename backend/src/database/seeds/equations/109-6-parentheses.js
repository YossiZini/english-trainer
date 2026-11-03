// 109.6 סוגריים וכינוס איברים — arrange each side first: collect the x
// together and the numbers together, open parentheses (2(x + 3) is two bags of
// x + 3), or divide by the number outside them; then solve as in 10.4 and 10.5.
const { ltr, S, eq, eqn, lin, solve, numQ, balFig, balPic, lesson, P, xs, steps, checkQ } = require('./common');

const theory = `
<h2>סוגריים וכינוס איברים</h2>

<p>לפעמים x מופיע כמה פעמים באותו אגף, או בתוך סוגריים. לפני שפותרים מסדרים כל אגף: מחברים את ה-x יחד ואת המספרים יחד, ופותחים סוגריים. אחר כך פותרים כמו בשיעורים הקודמים.</p>

<div class="formula">
  <div class="formula-title">פותחים סוגריים</div>
  <div class="formula-content">${eq('2(x + 3) = 2x + 6')}</div>
  <div class="formula-explanation">כופלים ב-2 כל מה שבתוך הסוגריים: גם את x וגם את 3.</div>
</div>

<h3>כלל 1: מכנסים את ה-x</h3>
<div class="rules">
  <p>הביטוי ${eq('3x + 2x')} הוא שלוש קופסאות ועוד שתי קופסאות, כלומר חמש קופסאות: ${eq('3x + 2x = 5x')}. במשוואה ${eq('3x + 2x = 15')} מכנסים, ${eq('5x = 15')}, ומחלקים ב-5: ${eq('x = 3')}.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x', 'x', 'x'], right: [{ units: 15 }], groups: { left: 5, right: 5 } }, `חמש קבוצות: ${eq('x = 3')}`))}
</div>

<h3>כלל 2: מכנסים גם את המספרים</h3>
<div class="rules">
  <p>במשוואה ${eq('2x + 5 + x + 1 = 21')} יש באגף שמאל ${eq('2x + x = 3x')} וגם ${eq('5 + 1 = 6')}. אחרי הכינוס: ${eq('3x + 6 = 21')}. מורידים 6: ${eq('3x = 15')}, ומחלקים ב-3: ${eq('x = 5')}.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x', { units: 6 }], right: [21] }, `אחרי הכינוס: ${eq('3x + 6 = 21')}`))}
</div>

<h3>כלל 3: סוגריים הם שקיות שוות</h3>
<div class="rules">
  <p>הביטוי ${eq('2(x + 3)')} הוא שתי שקיות, ובכל אחת קופסה ו-3 קוביות. במשוואה ${eq('2(x + 3) = 14')} מחלקים את שתי הכפות לשתי קבוצות: כל שקית שוקלת 7, כלומר ${eq('x + 3 = 7')}, ולכן ${eq('x = 4')}.</p>
  ${P.figures(balFig({ left: [{ bag: ['x', { units: 3 }] }, { bag: ['x', { units: 3 }] }], right: [{ units: 14 }], groups: { left: 2, right: 2 } }, `כל שקית שוקלת 7: ${eq('x + 3 = 7')}`))}
</div>

<h3>כלל 4: פותחים סוגריים</h3>
<div class="rules">
  <p>אפשר גם לפתוח את הסוגריים. ב-${eq('4(x + 2)')} ארבע שקיות, ובהן ארבע קופסאות ו-8 קוביות: ${eq('4(x + 2) = 4x + 8')}. במשוואה ${eq('4(x + 2) = 20')} מקבלים ${eq('4x + 8 = 20')}. מורידים 8: ${eq('4x = 12')}, ומחלקים ב-4: ${eq('x = 3')}.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x', 'x', { units: 8 }], right: [20] }, `אחרי שפותחים: ${eq('4x + 8 = 20')}`))}
</div>

<h3>כלל 5: סוגריים ו-x בשני האגפים</h3>
<div class="rules">
  <p>קודם מסדרים, אחר כך פותרים. במשוואה ${eq('2(x + 1) = x + 7')} פותחים סוגריים: ${eq('2x + 2 = x + 7')}. מורידים x משני האגפים: ${eq('x + 2 = 7')}, ולכן ${eq('x = 5')}.</p>
  ${P.figures(balFig({ left: ['x', { box: 'x', crossed: true }, { units: 2 }], right: [{ box: 'x', crossed: true }, { units: 7 }] }, `מורידים ${eq('x')}: ${eq('x + 2 = 7')}`))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לכפול רק את האיבר הראשון שבסוגריים. ${eq('2(x + 3)')} איננו ${eq('2x + 3')}: כופלים ב-2 גם את ה-3, ומקבלים ${eq('2x + 6')}. ועוד טעות: לכנס x עם מספר. ${eq('3x + 2')} איננו ${eq('5x')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> קודם מסדרים כל אגף לבד (פותחים סוגריים ומכנסים), ורק אחר כך עושים צעדים לשני האגפים.
</div>
`;

const isInt = (v) => Number.isInteger(v);
/** The solution of a·x + b = c·x + d as a number (any, for wrong options). */
const raw = ([a, b], [c, d]) => (d - b) / (a - c);

/**
 * An equation that is arranged first: `written` as the student sees it, `l`
 * and `r` the sides after arranging, `arrange` the sentence that arranges
 * them (ending with the arranged equation). `mistakes` are arranged forms a
 * student gets by a slip (the 3 not multiplied); their solutions are wrong
 * options. `text` asks it as a story, `first` states its equation.
 */
function arrQ(n, level, written, l, r, arrange, { mistakes = [], text = null, first = '', picture = null } = {}) {
  const x = solve(l, r);
  const ask = text || `מה הפתרון של המשוואה ${ltr(written)}?`;
  const why = steps(l, r, { text: written, first: `${first}${arrange} ` });
  const positive = x > 0 && (text || level === 'easy');
  const cands = [...mistakes.map(([L, R]) => raw(L, R)), -x, x + 1, x - 1, x * 2, x + 2]
    .filter((v) => isInt(v) && (!positive || v > 0));
  return numQ(n, level, ask, x, cands, why, { picture });
}

/** "k(px + q)" as written, and its sides when opened: [k·p, k·q]. */
const par = (k, [p, q]) => ({ text: `${k}(${xs(p)} ${q < 0 ? '−' : '+'} ${Math.abs(q)})`, form: [k * p, k * q] });
/** The sentence that opens k(px + q) and gives the arranged equation. */
const opens = (k, pq, l, r) => { const { text, form } = par(k, pq); return `פותחים סוגריים: ${ltr(`${text} = ${lin(form)}`)}, ומקבלים ${ltr(eqn(l, r))}.`; };

/** k(x + q) = d (or = c·x + d), opened; `divide` divides by k first instead. */
function parQ(n, level, k, pq, right, { divide = false } = {}) {
  const { text, form } = par(k, pq);
  const written = `${text} = ${typeof right === 'number' ? S(right) : lin(right)}`;
  const r = typeof right === 'number' ? [0, right] : right;
  // The slip: only the first term multiplied (2(x + 3) read as 2x + 3).
  const mistakes = [[[form[0], pq[1]], r]];
  const [p, q] = pq;
  const d = r[1];
  const picture = p === 1 && q > 0 && r[0] === 0 && k <= 3 && d % k === 0 && d / k > q && d <= 24
    ? balPic({ left: Array.from({ length: k }, () => ({ bag: ['x', { units: q }] })), right: [{ units: d }], groups: { left: k, right: k } },
      `כל שקית שוקלת ${d / k}: ${eq(`x + ${q} = ${d / k}`)}`)
    : null;
  if (divide) {
    // k(x + q) = d: divide by k, then x + q = d ÷ k.
    const x = solve(form, r);
    const why = steps([p, q], [0, d / k], { text: written, orig: [form, r], first: `מחלקים את שני האגפים ב-${k}: ${ltr(eqn([p, q], [0, d / k]))}. ` });
    const cands = [raw(mistakes[0][0], r), d / k, d - q, -x, x + 1, x - 1].filter((v) => isInt(v) && v > 0);
    return numQ(n, level, `מה הפתרון של המשוואה ${ltr(written)}?`, x, cands, why, { picture });
  }
  return arrQ(n, level, written, form, r, opens(k, pq, form, r), { mistakes, picture });
}

/** The number left beside kx after opening k(px + q): "ועוד" for +, "פחות" for −. */
function openQ(n, level, k, pq) {
  const { text, form } = par(k, pq);
  const word = form[1] > 0 ? 'ועוד' : 'פחות';
  const v = Math.abs(form[1]);
  const why = `כופלים ב-${k} כל מה שבתוך הסוגריים: ${ltr(`${k} × ${Math.abs(pq[1])} = ${v}`)}, כלומר ${ltr(`${text} = ${lin(form)}`)}.`;
  return numQ(n, level, `כשפותחים את הסוגריים ב-${ltr(text)} מקבלים ${ltr(xs(form[0]))} ${word} מספר. איזה מספר?`, v,
    [Math.abs(pq[1]), k + Math.abs(pq[1]), Number(`${k}${Math.abs(pq[1])}`), v + k, v - 1], why);
}

/** How many x stand on one side of `written` after collecting them. */
function countXQ(n, level, written, side, terms, wrongs) {
  const answer = terms.reduce((s, t) => s + t, 0);
  const sum = terms.map((t, i) => (i === 0 ? xs(t) : `${t < 0 ? '−' : '+'} ${xs(Math.abs(t))}`)).join(' ');
  const why = `מחברים את ה-x של אגף ${side}: ${ltr(`${sum} = ${xs(answer)}`)}. המספרים לא מצטרפים ל-x.`;
  return numQ(n, level, `במשוואה ${ltr(written)} מכנסים את ה-x באגף ${side}. כמה x יהיו שם?`, answer, wrongs, why);
}

const exercises = [
  // ---------- easy: collecting x, opening parentheses ----------
  arrQ(1, 'easy', '3x + 2x = 20', [5, 0], [0, 20], `מכנסים: ${ltr('3x + 2x = 5x')}, ומקבלים ${ltr('5x = 20')}.`,
    { mistakes: [[[6, 0], [0, 20]], [[1, 0], [0, 20]]] }),
  parQ(2, 'easy', 2, [1, 1], 12),
  openQ(3, 'easy', 3, [1, 4]),
  arrQ(4, 'easy', 'x + x + x = 18', [3, 0], [0, 18], `מכנסים: ${ltr('x + x + x = 3x')}, ומקבלים ${ltr('3x = 18')}.`,
    { mistakes: [[[2, 0], [0, 18]], [[1, 0], [0, 18]]] }),
  countXQ(5, 'easy', '4x + x − 2x + 5 = 14', 'שמאל', [4, 1, -2], [7, 5, 8, 2]),
  parQ(6, 'easy', 3, [1, 2], 18, { divide: true }),
  arrQ(7, 'easy', '2x + 3 + x = 15', [3, 3], [0, 15], `מכנסים: ${ltr('2x + x = 3x')}, ומקבלים ${ltr('3x + 3 = 15')}.`,
    { mistakes: [[[2, 3], [0, 15]], [[3, 0], [0, 15]]] }),
  openQ(8, 'easy', 5, [1, 2]),
  checkQ(9, 'easy', [2, 8], [0, 14], 3, { shown: '2(x + 4) = 14' }),
  parQ(10, 'easy', 4, [1, 1], 20),

  // ---------- medium: a minus inside, x on both sides, stories ----------
  parQ(11, 'medium', 3, [1, -2], 12),
  arrQ(12, 'medium', '5x − 2x + 4 = 19', [3, 4], [0, 19], `מכנסים: ${ltr('5x − 2x = 3x')}, ומקבלים ${ltr('3x + 4 = 19')}.`,
    { mistakes: [[[7, 4], [0, 19]]] }),
  arrQ(13, 'medium', '3(x + 5) = 45', [3, 15], [0, 45], `פותחים סוגריים: ${ltr('3(x + 5) = 3x + 15')}, ומקבלים ${ltr('3x + 15 = 45')}.`, {
    mistakes: [[[3, 5], [0, 45]]],
    text: 'שלושה חברים הלכו לסרט. כל אחד שילם על כרטיס, ועוד 5 שקלים על פופקורן. יחד הם שילמו 45 שקלים. כמה עולה כרטיס?',
    first: `נסמן ב-x את מחיר הכרטיס. כל אחד שילם ${ltr('x + 5')}, ולכן ${ltr('3(x + 5) = 45')}. ` }),
  parQ(14, 'medium', 2, [1, 3], [1, 10]),
  openQ(15, 'medium', 4, [1, -3]),
  arrQ(16, 'medium', '4x + 7 − x − 1 = 18', [3, 6], [0, 18], `מכנסים: ${ltr('4x − x = 3x')} ו-${ltr('7 − 1 = 6')}, ומקבלים ${ltr('3x + 6 = 18')}.`,
    { mistakes: [[[5, 6], [0, 18]], [[3, 8], [0, 18]]] }),
  arrQ(17, 'medium', 'x + x + 1 + x + 2 = 48', [3, 3], [0, 48], `מכנסים: ${ltr('x + x + x = 3x')} ו-${ltr('1 + 2 = 3')}, ומקבלים ${ltr('3x + 3 = 48')}.`, {
    mistakes: [[[3, 0], [0, 48]], [[1, 3], [0, 48]]],
    text: 'הסכום של שלושה מספרים עוקבים הוא 48. מה המספר הקטן מביניהם?',
    first: `נסמן ב-x את המספר הקטן. המספרים הם x, ${ltr('x + 1')} ו-${ltr('x + 2')}, ולכן ${ltr('x + x + 1 + x + 2 = 48')}. ` }),
  countXQ(18, 'medium', '6 + 2x = 7x − 3x + 2', 'ימין', [7, -3], [10, 6, 3, 2]),
  checkQ(19, 'medium', [3, -3], [2, 4], 5, { shown: '3(x − 1) = 2x + 4' }),
  parQ(20, 'medium', 5, [1, -1], [3, 7]),

  // ---------- hard: negative solutions, parentheses on both sides ----------
  parQ(21, 'hard', 2, [1, 7], 4),
  arrQ(22, 'hard', '3(x + 4) = 2(x + 1)', [3, 12], [2, 2],
    `פותחים את שני הסוגריים: ${ltr('3(x + 4) = 3x + 12')} ו-${ltr('2(x + 1) = 2x + 2')}, ומקבלים ${ltr('3x + 12 = 2x + 2')}.`,
    { mistakes: [[[3, 4], [2, 1]], [[3, 12], [2, 1]]] }),
  arrQ(23, 'hard', '2(x + x + 4) = 32', [4, 8], [0, 32],
    `מכנסים בתוך הסוגריים: ${ltr('x + x + 4 = 2x + 4')}. פותחים: ${ltr('2(2x + 4) = 4x + 8')}, ומקבלים ${ltr('4x + 8 = 32')}.`, {
    mistakes: [[[2, 4], [0, 32]], [[4, 4], [0, 32]]],
    text: 'אורך של מלבן גדול ב-4 סנטימטרים מהרוחב שלו, וההיקף שלו 32 סנטימטרים. מה הרוחב של המלבן?',
    first: `נסמן ב-x את הרוחב. האורך ${ltr('x + 4')}, וההיקף הוא פעמיים הסכום של האורך והרוחב: ${ltr('2(x + x + 4) = 32')}. ` }),
  arrQ(24, 'hard', '3x − 8 − 5x = 4', [-2, -8], [0, 4], `מכנסים: ${ltr('3x − 5x = −2x')}, ומקבלים ${ltr('−2x − 8 = 4')}.`,
    { mistakes: [[[2, -8], [0, 4]], [[8, -8], [0, 4]]] }),
  parQ(25, 'hard', 4, [1, -2], [1, 10]),
  openQ(26, 'hard', 6, [2, 3]),
  checkQ(27, 'hard', [2, 6], [5, 12], -2, { shown: '2(x + 3) = 5x + 12' }),
  arrQ(28, 'hard', '5(x + 2) = 3(x − 2)', [5, 10], [3, -6],
    `פותחים את שני הסוגריים: ${ltr('5(x + 2) = 5x + 10')} ו-${ltr('3(x − 2) = 3x − 6')}, ומקבלים ${ltr('5x + 10 = 3x − 6')}.`,
    { mistakes: [[[5, 2], [3, -2]], [[5, 10], [3, 6]]] }),
  arrQ(29, 'hard', '4x = 3(x + 3)', [4, 0], [3, 9], `פותחים סוגריים: ${ltr('3(x + 3) = 3x + 9')}, ומקבלים ${ltr('4x = 3x + 9')}.`, {
    mistakes: [[[4, 0], [3, 3]]],
    text: 'לריבוע ולמשולש שווה צלעות יש אותו היקף. הצלע של המשולש ארוכה ב-3 סנטימטרים מהצלע של הריבוע. מה אורך הצלע של הריבוע?',
    first: `נסמן ב-x את הצלע של הריבוע. ההיקף שלו ${ltr('4x')}, והיקף המשולש ${ltr('3(x + 3)')}, ולכן ${ltr('4x = 3(x + 3)')}. ` }),
  arrQ(30, 'hard', '3(x − 4) − x = 2', [2, -12], [0, 2],
    `פותחים סוגריים: ${ltr('3(x − 4) = 3x − 12')}. מכנסים: ${ltr('3x − x = 2x')}, ומקבלים ${ltr('2x − 12 = 2')}.`,
    { mistakes: [[[2, -4], [0, 2]], [[4, -12], [0, 2]]] }),
];

module.exports = lesson(6, 'Parentheses and Like Terms', 'סוגריים וכינוס איברים', theory, exercises);
