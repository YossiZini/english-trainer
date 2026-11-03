// 109.3 כפל וחילוק — solving ax = c by dividing both sides into equal groups,
// and x ÷ a = c by multiplying both sides: the opposite operation, the
// unknown on the right, checking, a negative number in the equation.
const { ltr, P, S, eq, eqn, solve, numQ, balFig, balPic, lesson } = require('./common');

const theory = `
<h2>כפל וחילוק: מחלקים את הכפות</h2>

<p>כשהנעלם מוכפל במספר, כמו ב-${eq('3x = 12')}, מחלקים את שני האגפים באותו מספר. כשהוא מחולק במספר, כמו ב-${eq('x ÷ 4 = 5')}, כופלים את שני האגפים. גם כאן המאזניים נשארים מאוזנים, כי עושים לשני האגפים אותו דבר.</p>

<div class="formula">
  <div class="formula-title">חילוק מבטל כפל, כפל מבטל חילוק</div>
  <div class="formula-content">${eq('3x ÷ 3 = 12 ÷ 3')}</div>
  <div class="formula-explanation">מחלקים את שני האגפים ב-3 ומקבלים ${eq('x = 4')}. במשוואה ${eq('x ÷ 4 = 5')} כופלים את שני האגפים ב-4: ${eq('x = 20')}.</div>
</div>

<h3>כלל 1: מחלקים את שתי הכפות לקבוצות שוות</h3>
<div class="rules">
  <p>במשוואה ${eq('3x = 12')} יש שלוש קופסאות שוות מול 12 קוביות. מחלקים כל כף לשלוש קבוצות שוות: בכל קבוצה משמאל קופסה אחת, ובכל קבוצה מימין 4 קוביות. לכן ${eq('x = 4')}.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x'], right: [{ units: 12 }], groups: { left: 3, right: 3 } }, `שלוש קבוצות שוות: ${eq('12 ÷ 3 = 4')}`))}
</div>

<h3>כלל 2: חילוק מבטל כפל</h3>
<div class="rules">
  <p>ב-${eq('5x = 35')} המספר 5 כופל את x. מחלקים את שני האגפים ב-5: ${eq('5x ÷ 5 = 35 ÷ 5')}, כלומר ${eq('x = 7')}. כך עושים גם כשהמספרים גדולים מכדי לספור קוביות.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x', 'x', 'x'], right: [35] }, `כל קופסה: ${eq('35 ÷ 5 = 7')}`))}
</div>

<h3>כלל 3: כפל מבטל חילוק</h3>
<div class="rules">
  <p>${eq('x ÷ 4 = 5')} אומר שאם מחלקים את x לארבעה חלקים שווים, בכל חלק 5. לכן x שווה לארבע קבוצות של 5: כופלים את שני האגפים ב-4 ומקבלים ${eq('x = 4 × 5 = 20')}.</p>
  ${P.figures(balFig({ left: ['x'], right: [{ units: 20 }], groups: { right: 4 } }, `ארבע קבוצות של 5: ${eq('x = 20')}`))}
</div>

<h3>כלל 4: הנעלם באגף ימין</h3>
<div class="rules">
  <p>במשוואה ${eq('18 = 6x')} מחלקים את שני האגפים ב-6: ${eq('3 = x')}, כלומר ${eq('x = 3')}. אין זה משנה באיזה צד נמצא הנעלם.</p>
  ${P.figures(balFig({ left: [{ units: 18 }], right: ['x', 'x', 'x', 'x', 'x', 'x'], groups: { left: 6, right: 6 } }, `שש קבוצות שוות: ${eq('18 ÷ 6 = 3')}`))}
</div>

<h3>כלל 5: בודקים בכפל</h3>
<div class="rules">
  <p>מציבים את התשובה במקום x. ${eq('x = 4')} הוא הפתרון של ${eq('3x = 12')}, כי ${eq('3 × 4 = 12')}: שלוש משקולות של 4 מאזנות 12 קוביות.</p>
  ${P.figures(balFig({ left: [4, 4, 4], right: [{ units: 12 }] }, `בדיקה: ${eq('3 × 4 = 12')}`))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> להוריד במקום לחלק: במשוואה ${eq('3x = 12')} לענות ${eq('12 − 3 = 9')}. מציבים ורואים ${eq('3 × 9 = 27')}, לא 12. ועוד טעות: במשוואה ${eq('x ÷ 4 = 5')} לחלק שוב, במקום לכפול.
</div>

<div class="tip">
  <strong>טיפ:</strong> מספר שכתוב צמוד ל-x כופל אותו, ולכן מחלקים בו. כש-x מחולק במספר, כופלים בו.
</div>
`;

/** A number after an operator: a negative one in parentheses, "(−3)". */
const T = (v) => (v < 0 ? `(${S(v)})` : S(v));

/** The check "3 × 4 = 12" for a·x = c, or "20 ÷ 4 = 5" for x ÷ a = c. */
const checkMul = (a, x, c) => `בדיקה: ${ltr(`${S(a)} × ${T(x)} = ${S(c)}`)}.`;
const checkDiv = (a, x, c) => `בדיקה: ${ltr(`${S(x)} ÷ ${T(a)} = ${S(c)}`)}.`;

/** The balance of a·x = c in groups when it fits (cubes up to 24), or boxes against a weight. */
function mulPicture(a, c, x, flip) {
  if (!(a > 0 && c > 0 && x > 0)) return null;
  const boxes = Array.from({ length: a }, () => 'x');
  const opts = c <= 24
    ? { left: boxes, right: [{ units: c }], groups: { left: a, right: a } }
    : { left: boxes, right: [c] };
  const shown = flip ? { left: opts.right, right: opts.left, groups: opts.groups && { left: a, right: a } } : opts;
  return balPic(shown, eq(`x = ${x}`));
}

/** a·x = c, written c = ax (`flip`) or asked as a story (`text`, `before` opens the explanation). */
function mulQ(n, level, a, c, { flip = false, text = null, before = '' } = {}) {
  const l = [a, 0], r = [0, c];
  const x = solve(l, r);
  const shown = flip ? eqn(r, l) : eqn(l, r);
  const ask = text || `מה הפתרון של המשוואה ${ltr(shown)}?`;
  const why = `${before}מחלקים את שני האגפים ב-${T(a)}: ${ltr(`x = ${S(c)} ÷ ${T(a)} = ${S(x)}`)}. ${checkMul(a, x, c)}`;
  // Subtracting or adding instead of dividing, multiplying, the sign.
  return numQ(n, level, ask, x, [c - a, ...(x < 0 || a < 0 ? [-x] : []), c * a, c + a, x + 1, x - 1], why,
    { picture: mulPicture(a, c, x, flip) });
}

/** x ÷ a = c, written c = x ÷ a (`flip`) or as a story. */
function divQ(n, level, a, c, { flip = false, text = null, before = '' } = {}) {
  const x = a * c;
  const shown = flip ? `${S(c)} = x ÷ ${T(a)}` : `x ÷ ${T(a)} = ${S(c)}`;
  const ask = text || `מה הפתרון של המשוואה ${ltr(shown)}?`;
  const why = `${before}כופלים את שני האגפים ב-${T(a)}: ${ltr(`x = ${S(c)} × ${T(a)} = ${S(x)}`)}. ${checkDiv(a, x, c)}`;
  const picture = a > 0 && c > 0 && x <= 24
    ? balPic(flip ? { left: [{ units: x }], right: ['x'], groups: { left: a } } : { left: ['x'], right: [{ units: x }], groups: { right: a } },
      `${a} קבוצות של ${c}: ${eq(`x = ${x}`)}`)
    : null;
  // Dividing again instead of multiplying, adding, subtracting, the sign.
  const again = Number.isInteger(c / a) ? c / a : null;
  return numQ(n, level, ask, x, [again, c + a, ...(x < 0 ? [-x] : []), c - a, c, x + 1].filter((v) => v !== null), why, { picture });
}

/** By which number both sides are divided (ax = c) or multiplied (x ÷ a = c). */
function stepQ(n, level, a, c, { div = false } = {}) {
  const ask = div
    ? `באיזה מספר כופלים את שני האגפים כדי לפתור את ${ltr(`x ÷ ${a} = ${c}`)}?`
    : `באיזה מספר מחלקים את שני האגפים כדי לפתור את ${ltr(eqn([a, 0], [0, c]))}?`;
  const why = div
    ? `את x חילקו ב-${a}, ומבטלים זאת בכפל: כופלים את שני האגפים ב-${a} ומקבלים ${ltr(`x = ${a * c}`)}.`
    : `המספר ${a} כופל את x, ומבטלים זאת בחילוק: מחלקים את שני האגפים ב-${a} ומקבלים ${ltr(`x = ${c / a}`)}.`;
  return numQ(n, level, ask, a, [c, div ? a * c : c / a, c - a, a + 1], why);
}

/** What stands opposite x after dividing both sides of ax = c by a. */
function afterQ(n, level, a, c) {
  const x = c / a;
  const why = `מחלקים את שני האגפים ב-${a}: באגף שמאל נשאר x, ובאגף ימין ${ltr(`${c} ÷ ${a} = ${x}`)}.`;
  return numQ(n, level, `במשוואה ${ltr(eqn([a, 0], [0, c]))} מחלקים את שני האגפים ב-${a}. איזה מספר יהיה באגף ימין?`, x,
    [c - a, c, c * a, x + 1], why, { picture: mulPicture(a, c, x, false) });
}

const exercises = [
  // ---------- easy: one step, small numbers ----------
  mulQ(1, 'easy', 3, 12),
  mulQ(2, 'easy', 5, 30),
  divQ(3, 'easy', 2, 6),
  stepQ(4, 'easy', 6, 42),
  mulQ(5, 'easy', 2, 16),
  divQ(6, 'easy', 3, 4),
  afterQ(7, 'easy', 4, 28),
  mulQ(8, 'easy', 10, 50),
  divQ(9, 'easy', 5, 2),
  mulQ(10, 'easy', 7, 21),

  // ---------- medium: the unknown on the right, larger numbers, stories ----------
  mulQ(11, 'medium', 9, 36, { flip: true }),
  divQ(12, 'medium', 3, 8, { flip: true }),
  mulQ(13, 'medium', 12, 144),
  divQ(14, 'medium', 7, 8),
  mulQ(15, 'medium', 6, 54, { text: '6 חברים חילקו ביניהם סוכריות שווה בשווה. כל אחד קיבל אותו מספר, ויחד היו 54 סוכריות. כמה קיבל כל אחד?',
    before: `נסמן ב-x את מה שקיבל כל אחד: ${ltr('6x = 54')}. ` }),
  divQ(16, 'medium', 4, 9, { text: 'חילקו את התלמידים לארבע קבוצות שוות, ובכל קבוצה 9 תלמידים. כמה תלמידים יש?',
    before: `נסמן ב-x את מספר התלמידים: ${ltr('x ÷ 4 = 9')}. ` }),
  stepQ(17, 'medium', 5, 6, { div: true }),
  mulQ(18, 'medium', 15, 90),
  divQ(19, 'medium', 10, 7),
  mulQ(20, 'medium', 5, 25, { flip: true }),

  // ---------- hard: negative numbers, stories, x = 0 ----------
  mulQ(21, 'hard', -3, 12),
  mulQ(22, 'hard', 4, -20),
  divQ(23, 'hard', -2, 6),
  divQ(24, 'hard', 3, -4),
  mulQ(25, 'hard', 2, 0),
  mulQ(26, 'hard', 3, 27, { text: 'שלוש מחברות זהות עולות יחד 27 שקלים. כמה עולה מחברת אחת?',
    before: `נסמן ב-x את מחיר מחברת אחת: ${ltr('3x = 27')}. ` }),
  divQ(27, 'hard', 4, 8, { text: 'רבע מהתלמידים בשכבה הם 8 תלמידים. כמה תלמידים בשכבה?',
    before: `רבע הוא חלוקה ב-4. נסמן ב-x את מספר התלמידים: ${ltr('x ÷ 4 = 8')}. ` }),
  mulQ(28, 'hard', 7, -35, { text: `חשבתי על מספר וכפלתי אותו ב-7. יצא ${ltr('−35')}. על איזה מספר חשבתי?`,
    before: `המשוואה: ${ltr('7x = −35')}. ` }),
  mulQ(29, 'hard', 3, 27, { text: `מה הפתרון של המשוואה ${ltr('x + x + x = 27')}?`,
    before: `החיבור ${ltr('x + x + x')} הוא ${ltr('3x')}. ` }),
  mulQ(30, 'hard', -6, -42, { flip: true }),
];

module.exports = lesson(3, 'Multiplication and Division', 'כפל וחילוק', theory, exercises);
