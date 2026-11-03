// 109.1 מהו נעלם? — the concept of an unknown: a number hidden in a box on a
// level balance, a letter (x) in its place, an equation as two equal sides,
// a solution and how to check it by putting it in, and 3x as 3 times x.
// Solving here is by thinking backwards and checking; balancing both pans
// comes in 109.2.
const { ltr, P, S, eq, eqn, lin, solve, at, numQ, choiceQ, pans, balFig, balPic, lesson, plug, checkQ } = require('./common');

const theory = `
<h2>מהו נעלם?</h2>

<p>לפעמים יש מספר שעוד לא יודעים מהו, אבל יודעים עליו משהו: למשל, שאם מוסיפים לו 5 מקבלים 12. מספר כזה נקרא <strong>נעלם</strong>. בפרק הזה מוצאים נעלמים בעזרת מאזניים: כשהמאזניים מאוזנים, בשני הצדדים יש אותו משקל.</p>

<div class="formula">
  <div class="formula-title">משוואה</div>
  <div class="formula-content">${eq('x + 5 = 12')}</div>
  <div class="formula-explanation">שני אגפים שווים, כמו מאזניים מאוזנים. הנעלם הוא x, והפתרון הוא המספר שבמקומו המשוואה נכונה: ${eq('x = 7')}, כי ${eq('7 + 5 = 12')}.</div>
</div>

<h3>כלל 1: מספר שמסתתר בקופסה</h3>
<div class="rules">
  <p>על כף אחת של המאזניים יש קופסה סגורה ו-5 קוביות, ועל הכף השנייה 12 קוביות. המאזניים מאוזנים, ולכן בשתי הכפות אותו משקל. כמה קוביות בקופסה? מחפשים מספר שאם מוסיפים לו 5 מקבלים 12: זה 7.</p>
  ${P.figures(balFig(pans([1, 5], [0, 12], { box: '?' }), eq('□ + 5 = 12')))}
</div>

<h3>כלל 2: אות במקום הקופסה</h3>
<div class="rules">
  <p>במקום לצייר קופסה כותבים אות, בדרך כלל x. המאזניים מהכלל הקודם הם המשוואה ${eq('x + 5 = 12')}: האות x היא הנעלם, ו-5 ו-12 הם מספרים ידועים.</p>
  ${P.figures(balFig(pans([1, 5], [0, 12]), `הקופסה היא x: ${eq('x + 5 = 12')}`))}
</div>

<h3>כלל 3: משוואה היא מאזניים מאוזנים</h3>
<div class="rules">
  <p>משוואה אומרת ששני צדדים שווים. הצד שמשמאל לסימן ${eq('=')} נקרא <strong>אגף שמאל</strong>, והצד שמימינו <strong>אגף ימין</strong>. במשוואה ${eq('x + 5 = 12')} אגף שמאל הוא ${eq('x + 5')}, ואגף ימין הוא 12.</p>
  <p>מספר שאינו הפתרון מטה את המאזניים. אם במקום x שמים 5, באגף שמאל יש ${eq('5 + 5 = 10')}, פחות מ-12, והמאזניים נוטים לצד של ה-12.</p>
  ${P.figures(balFig({ left: [5, { units: 5 }], right: [{ units: 12 }], tilt: 'right' }, `אם במקום x שמים 5: ${eq('10 < 12')}`))}
</div>

<h3>כלל 4: פתרון ובדיקה</h3>
<div class="rules">
  <p>הפתרון הוא המספר שבמקום x הופך את המשוואה לנכונה. כדי לבדוק מספר <strong>מציבים</strong> אותו: כותבים אותו במקום x ומחשבים כל אגף. במשוואה ${eq('x + 5 = 12')} מציבים 7: ${eq('7 + 5 = 12')}. שני האגפים שווים, ולכן ${eq('x = 7')} הוא הפתרון.</p>
  ${P.figures(balFig({ left: [7, { units: 5 }], right: [{ units: 12 }] }, `מציבים 7: ${eq('7 + 5 = 12')}`))}
</div>

<h3>כלל 5: ${eq('3x')} הוא 3 פעמים x</h3>
<div class="rules">
  <p>מספר שכתוב צמוד ל-x כופל אותו: ${eq('3x')} הוא ${eq('3 × x')}, כלומר ${eq('x + x + x')}. במשוואה ${eq('3x = 12')} יש שלוש קופסאות שוות, ומולן 12 קוביות. מחלקים את הקוביות לשלוש קבוצות שוות: בכל קופסה 4, כי ${eq('3 × 4 = 12')}.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x'], right: [{ units: 12 }], groups: { left: 3, right: 3 } }, `כל קופסה מול 4 קוביות: ${eq('x = 4')}`))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לחבר את המספרים שרואים. במשוואה ${eq('x + 5 = 12')} התשובה איננה 17: מציבים ורואים ${eq('17 + 5 = 22')}, לא 12. ועוד טעות: לקרוא את ${eq('3x')} כמו מספר. כאשר ${eq('x = 5')}, הערך של ${eq('3x')} הוא ${eq('3 × 5 = 15')}, לא 35.
</div>

<div class="tip">
  <strong>טיפ:</strong> תמיד אפשר לבדוק תשובה: מציבים אותה במקום x. אם שני האגפים יוצאים שווים, צדקתם.
</div>
`;

const BOX = '□';

/** x + b = c, or □ + b = c (`box`), or written c = x + b (`flip`); `first` opens the explanation. */
function addQ(n, level, b, c, { box = false, flip = false, text = null, first = '' } = {}) {
  const x = c - b;
  const u = box ? BOX : 'x';
  const shown = flip ? `${c} = ${u} + ${b}` : `${u} + ${b} = ${c}`;
  const ask = text || (box ? `מה מסתתר בקופסה? ${ltr(shown)}` : `מה הפתרון של המשוואה ${ltr(shown)}?`);
  const why = `${first}מחפשים מספר שאם מוסיפים לו ${b} מקבלים ${S(c)}: ${ltr(`${S(c)} − ${b} = ${S(x)}`)}. בדיקה: ${ltr(`${S(x)} + ${b} = ${S(c)}`)}.`;
  // The pans follow the written sides: 12 = x + 4 has the box on the right.
  const sides = flip ? [[0, c], [1, b]] : [[1, b], [0, c]];
  const picture = x > 0 && c > 0 ? balPic(pans(...sides, { box: box ? '?' : 'x' }), eq(`${u} = ${x}`)) : null;
  return numQ(n, level, ask, x, [c + b, ...(x < 0 ? [-x] : []), c, b, x + 1, x - 1], why, { picture });
}

/** x − b = c, or □ − b = c. */
function subQ(n, level, b, c, { box = false } = {}) {
  const x = c + b;
  const u = box ? BOX : 'x';
  const shown = `${u} − ${b} = ${c}`;
  const ask = box ? `מה מסתתר בקופסה? ${ltr(shown)}` : `מה הפתרון של המשוואה ${ltr(shown)}?`;
  const why = `מחפשים מספר שאם מורידים ממנו ${b} נשארים ${c}: ${ltr(`${c} + ${b} = ${x}`)}. בדיקה: ${ltr(`${x} − ${b} = ${c}`)}.`;
  return numQ(n, level, ask, x, [c - b, c, b, x + 1, x - 1], why);
}

/**
 * a·x = c, or □ × a = c (`box`), written c = ax (`flip`) or as `shown`
 * (x + x = 14); `text` asks it in words, `first` opens the explanation.
 */
function mulQ(n, level, a, c, { box = false, flip = false, shown = null, text = null, first = '' } = {}) {
  const x = c / a;
  if (!Number.isInteger(x)) throw new Error(`mulQ ${n}: ${c} ÷ ${a}`);
  const written = shown || (box ? `${BOX} × ${a} = ${c}` : flip ? `${c} = ${a}x` : `${a}x = ${c}`);
  const ask = text || (box ? `מה מסתתר בקופסה? ${ltr(written)}` : `מה הפתרון של המשוואה ${ltr(written)}?`);
  const why = `${first}מחפשים מספר שאם כופלים אותו ב-${a} מקבלים ${c}: ${ltr(`${c} ÷ ${a} = ${x}`)}. בדיקה: ${ltr(`${a} × ${x} = ${c}`)}.`;
  // The pans follow the written sides: 20 = 4x has the boxes on the right.
  const boxes = Array.from({ length: a }, () => ({ box: box ? '?' : 'x' }));
  const pans2 = flip ? { left: [{ units: c }], right: boxes } : { left: boxes, right: [{ units: c }] };
  const picture = x > 0 && c <= 24 ? balPic({ ...pans2, groups: { left: a, right: a } }, eq(`${c} ÷ ${a} = ${x}`)) : null;
  return numQ(n, level, ask, x, [c - a, c + a, c * a, x + 1, x - 1], why, { picture });
}

/** x ÷ a = c. */
function divQ(n, level, a, c) {
  const x = c * a;
  const why = `מחפשים מספר שאם מחלקים אותו ב-${a} מקבלים ${c}: ${ltr(`${c} × ${a} = ${x}`)}. בדיקה: ${ltr(`${x} ÷ ${a} = ${c}`)}.`;
  return numQ(n, level, `מה הפתרון של המשוואה ${ltr(`x ÷ ${a} = ${c}`)}?`, x, [c + a, c - a, Math.round(c / a) || 1, c, x + a], why);
}

/** The number written for x in a·x + b: "3 × 4 + 2", "−2 + 5" (math guide). */
const substituted = (form, x) => plug(lin(form), x);

/**
 * The value of a·x + b when x is given; `shown` and `put` write the same
 * expression and its substitution another way (5 − x, 5 − 8), `wrongs`
 * replaces the computed mistakes.
 */
function valQ(n, level, [a, b], x, { shown = null, put = null, wrongs = null } = {}) {
  const v = at([a, b], x);
  const expr = shown || lin([a, b]);
  // 3x at x = 5 read as the number 35; adding a and x; a times (x + b).
  const concat = a > 1 && x >= 0 ? Number(`${a}${x}`) + b : null;
  const why = `מציבים ${S(x)} במקום x: ${ltr(`${put || substituted([a, b], x)} = ${S(v)}`)}.`;
  return numQ(n, level, `מה הערך של ${ltr(expr)} כאשר ${ltr(`x = ${S(x)}`)}?`, v,
    wrongs || [concat, a + x + b, a * (x + b), v + a, x, b, v + 1, v - 1, -v].filter((c) => c !== null), why);
}


/** "I thought of a number…": a story whose equation is l = r. */
function storyQ(n, level, text, l, r, steps) {
  const x = solve(l, r);
  const why = `המשוואה: ${ltr(eqn(l, r))}. ${steps(x)} בדיקה: ${ltr(`${substituted(l, x)} = ${S(at(r, x))}`)}.`;
  return numQ(n, level, text, x, [at(r, 0) + (l[1] || 0), at(r, 0) - (l[1] || 0), at(r, 0) * (l[0] || 1), at(r, 0), x + 1, x - 1], why);
}

const exercises = [
  // ---------- easy: the box, the letter, putting a number in ----------
  addQ(1, 'easy', 4, 9, { box: true }),
  addQ(2, 'easy', 3, 10),
  checkQ(3, 'easy', [1, 6], [0, 10], 4),
  valQ(4, 'easy', [1, 5], 3),
  valQ(5, 'easy', [3, 0], 5),
  subQ(6, 'easy', 3, 8, { box: true }),
  addQ(7, 'easy', 9, 20),
  valQ(8, 'easy', [2, 0], 6),
  mulQ(9, 'easy', 4, 20),
  checkQ(10, 'easy', [1, 2], [0, 9], 11),

  // ---------- medium: the unknown on the right, × and ÷, a story ----------
  subQ(11, 'medium', 7, 5),
  addQ(12, 'medium', 4, 12, { flip: true }),
  mulQ(13, 'medium', 5, 35),
  checkQ(14, 'medium', [2, 0], [0, 18], 16, { text: `דנה אומרת שהפתרון של המשוואה ${ltr('2x = 18')} הוא 16. האם היא צודקת?` }),
  valQ(15, 'medium', [3, 2], 4),
  mulQ(16, 'medium', 6, 42, { box: true }),
  divQ(17, 'medium', 3, 5),
  storyQ(18, 'medium', 'חשבתי על מספר, הוספתי לו 6 וקיבלתי 14. על איזה מספר חשבתי?', [1, 6], [0, 14],
    (x) => `מחפשים מספר שאם מוסיפים לו 6 מקבלים 14: ${ltr(`14 − 6 = ${x}`)}.`),
  addQ(19, 'medium', 3, 11, {
    text: 'מאזניים מאוזנים: על כף אחת קופסה ו-3 קוביות, ועל הכף השנייה 11 קוביות. כמה קוביות בקופסה?',
    first: `המאזניים הם המשוואה ${ltr('x + 3 = 11')}. `
  }),
  valQ(20, 'medium', [1, -4], 10),

  // ---------- hard: a negative solution, x + x, stories, x = 0 ----------
  addQ(21, 'hard', 8, 3),
  valQ(22, 'hard', [-1, 5], 8, { shown: '5 − x', put: '5 − 8', wrongs: [3, 13, -13, -2] }),
  mulQ(23, 'hard', 2, 14, { shown: 'x + x = 14', first: `החיבור ${ltr('x + x')} הוא ${ltr('2x')}. ` }),
  storyQ(24, 'hard', 'חשבתי על מספר, כפלתי אותו ב-4 וקיבלתי 36. על איזה מספר חשבתי?', [4, 0], [0, 36],
    (x) => `מחפשים מספר שאם כופלים אותו ב-4 מקבלים 36: ${ltr(`36 ÷ 4 = ${x}`)}.`),
  valQ(25, 'hard', [3, 0], 5, { shown: 'x + 2x', put: '5 + 2 × 5', wrongs: [30, 35, 12, 20] }),
  mulQ(26, 'hard', 3, 21, { text: 'מאזניים מאוזנים: על כף אחת 3 קופסאות שוות, ועל הכף השנייה 21 קוביות. כמה קוביות בכל קופסה?',
    first: `המאזניים הם המשוואה ${ltr('3x = 21')}. ` }),
  mulQ(27, 'hard', 6, 42, { flip: true }),
  storyQ(28, 'hard', 'חשבתי על מספר, הורדתי ממנו 9 וקיבלתי 0. על איזה מספר חשבתי?', [1, -9], [0, 0],
    (x) => `מחפשים מספר שאם מורידים ממנו 9 נשאר 0: ${ltr(`0 + 9 = ${x}`)}.`),
  mulQ(29, 'hard', 3, 0),
  valQ(30, 'hard', [2, -7], 3),
];

module.exports = lesson(1, 'What Is an Unknown?', 'מהו נעלם?', theory, exercises);
