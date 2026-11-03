// 109.4 משוואות בשני צעדים — ax + b = c in two steps, undone in reverse order:
// first the number (+ or −) off both sides, then the division; x ÷ a + b = c;
// the unknown on the right; negative numbers; checking in the equation as written.
const { ltr, P, S, eq, eqn, solve, at, numQ, pans, balFig, balPic, lesson, xs, plug, steps } = require('./common');

const theory = `
<h2>משוואות בשני צעדים</h2>

<p>במשוואה ${eq('2x + 3 = 11')} עשו ל-x שני דברים: כפלו אותו ב-2, ואחר כך הוסיפו 3. כדי לגלות את x מבטלים אותם בסדר הפוך: קודם מורידים את ה-3, ואחר כך מחלקים ב-2. בכל צעד עושים אותו דבר לשני האגפים.</p>

<div class="formula">
  <div class="formula-title">שני צעדים</div>
  <div class="formula-content">${eq('2x + 3 = 11')}</div>
  <div class="formula-explanation">צעד ראשון: מורידים 3 משני האגפים, ${eq('2x = 8')}. צעד שני: מחלקים את שני האגפים ב-2, ${eq('x = 4')}.</div>
</div>

<h3>כלל 1: קודם המספר, אחר כך החלוקה</h3>
<div class="rules">
  <p>על המאזניים שתי קופסאות ו-3 קוביות, מול 11 קוביות. מורידים 3 קוביות משתי הכפות: נשארו שתי קופסאות מול 8 קוביות. מחלקים את שתי הכפות לשתי קבוצות שוות: בכל קופסה 4.</p>
  ${P.figures(
    balFig(pans([2, 3], [0, 11], { take: 3 }), `מורידים 3: ${eq('2x = 8')}`),
    balFig({ left: ['x', 'x'], right: [{ units: 8 }], groups: { left: 2, right: 2 } }, `שתי קבוצות: ${eq('x = 4')}`))}
</div>

<h3>כלל 2: בסדר הפוך</h3>
<div class="rules">
  <p>כשבונים את ${eq('3x − 4')} כופלים קודם ב-3 ואחר כך מורידים 4. כשפותרים, הולכים אחורה: קודם מבטלים את ה-4 ואחר כך את הכפל. במשוואה ${eq('3x − 4 = 11')} מוסיפים 4 לשני האגפים, ${eq('3x = 15')}, ומחלקים ב-3: ${eq('x = 5')}.</p>
  ${P.figures(balFig({ left: ['x', 'x', 'x'], right: [{ units: 15 }], groups: { left: 3, right: 3 } }, `אחרי שמוסיפים 4: ${eq('3x = 15')}`))}
</div>

<h3>כלל 3: חילוק ועוד מספר</h3>
<div class="rules">
  <p>גם כאן מתחילים מהמספר. במשוואה ${eq('x ÷ 2 + 5 = 9')} מורידים 5 משני האגפים, ${eq('x ÷ 2 = 4')}, ואחר כך כופלים את שני האגפים ב-2: ${eq('x = 8')}.</p>
  ${P.figures(balFig({ left: ['x'], right: [{ units: 8 }], groups: { right: 2 } }, `שתי קבוצות של 4: ${eq('x = 8')}`))}
</div>

<h3>כלל 4: הנעלם באגף ימין</h3>
<div class="rules">
  <p>במשוואה ${eq('13 = 2x + 3')} עושים אותם צעדים: מורידים 3 משני האגפים, ${eq('10 = 2x')}, ומחלקים ב-2: ${eq('x = 5')}.</p>
  ${P.figures(balFig(pans([0, 13], [2, 3], { take: 3 }), `מורידים 3: ${eq('10 = 2x')}`))}
</div>

<h3>כלל 5: בודקים במשוואה המקורית</h3>
<div class="rules">
  <p>מציבים את התשובה במשוואה שהתחלתם ממנה, לא בשלב באמצע. ${eq('x = 4')} הוא הפתרון של ${eq('2x + 3 = 11')}, כי ${eq('2 × 4 + 3 = 11')}.</p>
  ${P.figures(balFig({ left: [4, 4, { units: 3 }], right: [{ units: 11 }] }, `בדיקה: ${eq('2 × 4 + 3 = 11')}`))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לחלק רק חלק מהאגף. במשוואה ${eq('2x + 4 = 10')} מי שמחלק ב-2 רק את ה-${eq('2x')} מקבל ${eq('x + 4 = 5')}, כלומר 1. אבל ${eq('2 × 1 + 4 = 6')}, לא 10. ועוד טעות: לעצור אחרי הצעד הראשון, ובמשוואה ${eq('2x + 3 = 11')} לענות 8 במקום 4.
</div>

<div class="tip">
  <strong>טיפ:</strong> שאלו מה עשו ל-x ובאיזה סדר, ובטלו מהסוף להתחלה: קודם חיבור או חיסור, אחר כך כפל או חילוק.
</div>
`;

const isInt = (v) => Number.isInteger(v);

/**
 * a·x + b = c (b may be negative), written c = ax + b (`flip`) or asked as a
 * story (`text`, `first` states its equation). A balance of the first step
 * when every number is positive.
 */
function twoQ(n, level, a, b, c, { flip = false, text = null, first = '' } = {}) {
  const l = [a, b], r = [0, c];
  const x = solve(l, r);
  const shown = flip ? eqn(r, l) : eqn(l, r);
  const ask = text || `מה הפתרון של המשוואה ${ltr(shown)}?`;
  const why = flip ? steps(r, l, { first }) : steps(l, r, { first });
  const sides = flip ? [r, l] : [l, r];
  const picture = a > 0 && b > 0 && c > b && x > 0
    ? balPic(pans(...sides, { take: b }), `מורידים ${b}: ${eq(flip ? `${c - b} = ${xs(a)}` : `${xs(a)} = ${c - b}`)}`)
    : null;
  // Forgetting to divide (c − b), adding instead of taking off, dividing first, the sign.
  const cands = [c - b, (c + b) / a, c / a - b, (c - b) * a, -x, x + 1, x - 1].filter(isInt);
  return numQ(n, level, ask, x, cands, why, { picture });
}

/** x ÷ a + b = c: take b off, then multiply by a. */
function divTwoQ(n, level, a, b, c) {
  const x = (c - b) * a;
  const shown = `x ÷ ${a} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${S(c)}`;
  const first = b > 0 ? `מורידים ${b} משני האגפים` : `מוסיפים ${-b} לשני האגפים`;
  const why = `${first}: ${ltr(`x ÷ ${a} = ${S(c - b)}`)}. כופלים את שני האגפים ב-${a}: ${ltr(`x = ${S(x)}`)}. בדיקה: ${ltr(`${plug(shown.split(' = ')[0], x)} = ${S(c)}`)}.`;
  const cands = [(c - b) / a, c * a - b, (c + b) * a, c - b, -x, x + a].filter(isInt);
  return numQ(n, level, `מה הפתרון של המשוואה ${ltr(shown)}?`, x, cands, why);
}

/** Which number comes off (or goes onto) both sides first in ax + b = c. */
function firstStepQ(n, level, a, b, c) {
  const verb = b > 0 ? 'מורידים משני' : 'מוסיפים לשני';
  const why = `מבטלים קודם את ה${b > 0 ? 'חיבור' : 'חיסור'}: ${b > 0 ? `מורידים ${b} משני` : `מוסיפים ${-b} לשני`} האגפים, ומקבלים ${ltr(eqn([a, 0], [0, c - b]))}. רק אחר כך מחלקים ב-${a}.`;
  return numQ(n, level, `איזה מספר ${verb} האגפים בצעד הראשון של ${ltr(eqn([a, b], [0, c]))}?`, Math.abs(b), [a, c, c - b, Math.abs(b) + 1], why);
}

/** What stands opposite ax after the first step of ax + b = c. */
function afterFirstQ(n, level, a, b, c) {
  const verb = b > 0 ? `מורידים ${b} משני` : `מוסיפים ${-b} לשני`;
  const why = `${verb} האגפים: באגף שמאל נשאר ${ltr(xs(a))}, ובאגף ימין ${ltr(`${c} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${c - b}`)}.`;
  return numQ(n, level, `במשוואה ${ltr(eqn([a, b], [0, c]))} ${verb} האגפים. איזה מספר יהיה באגף ימין?`, c - b,
    [c + b, c, (c - b) / a, c - b + 1].filter(isInt), why);
}

const exercises = [
  // ---------- easy: ax + b = c with small positive numbers ----------
  twoQ(1, 'easy', 2, 3, 11),
  twoQ(2, 'easy', 3, 1, 13),
  twoQ(3, 'easy', 5, 2, 17),
  firstStepQ(4, 'easy', 3, 4, 19),
  twoQ(5, 'easy', 2, -1, 9),
  afterFirstQ(6, 'easy', 2, 6, 20),
  twoQ(7, 'easy', 4, 4, 24),
  twoQ(8, 'easy', 10, 5, 35),
  firstStepQ(9, 'easy', 3, -4, 11),
  twoQ(10, 'easy', 3, -2, 10),

  // ---------- medium: the unknown on the right, ÷, stories ----------
  twoQ(11, 'medium', 3, 4, 25, { flip: true }),
  divTwoQ(12, 'medium', 2, 5, 9),
  twoQ(13, 'medium', 3, 5, 26, { text: 'דנה קנתה 3 מחברות זהות ועט ב-5 שקלים, ושילמה בסך הכול 26 שקלים. כמה עולה מחברת אחת?',
    first: `נסמן ב-x את מחיר המחברת: ${ltr('3x + 5 = 26')}. ` }),
  twoQ(14, 'medium', 6, -5, 31),
  twoQ(15, 'medium', 4, 3, 31, { text: 'חשבתי על מספר, כפלתי אותו ב-4 והוספתי 3, וקיבלתי 31. על איזה מספר חשבתי?',
    first: `המשוואה: ${ltr('4x + 3 = 31')}. ` }),
  divTwoQ(16, 'medium', 3, -1, 4),
  twoQ(17, 'medium', 7, 10, 73),
  afterFirstQ(18, 'medium', 5, -3, 32),
  twoQ(19, 'medium', 3, 12, 42, { text: 'נסיעה במונית עולה 12 שקלים, ועוד 3 שקלים על כל קילומטר. נסיעה אחת עלתה 42 שקלים. כמה קילומטרים נסעו?',
    first: `נסמן ב-x את מספר הקילומטרים: ${ltr('3x + 12 = 42')}. ` }),
  twoQ(20, 'medium', 4, -8, 40, { flip: true }),

  // ---------- hard: negative numbers, ÷, stories ----------
  twoQ(21, 'hard', 2, 9, 1),
  twoQ(22, 'hard', 3, 15, 0),
  twoQ(23, 'hard', -2, 5, 13),
  twoQ(24, 'hard', 3, 10, 1, { text: 'חשבתי על מספר, כפלתי אותו ב-3 והוספתי 10, וקיבלתי 1. על איזה מספר חשבתי?',
    first: `המשוואה: ${ltr('3x + 10 = 1')}. ` }),
  twoQ(25, 'hard', 4, -7, -3),
  divTwoQ(26, 'hard', 4, 6, 2),
  twoQ(27, 'hard', 3, 1, -11, { flip: true }),
  twoQ(28, 'hard', -5, -2, 13),
  twoQ(29, 'hard', 5, -8, 27, { text: 'חשבתי על מספר, כפלתי אותו ב-5 והורדתי 8, וקיבלתי 27. על איזה מספר חשבתי?',
    first: `המשוואה: ${ltr('5x − 8 = 27')}. ` }),
  twoQ(30, 'hard', 9, -20, -2),
];

module.exports = lesson(4, 'Equations in Two Steps', 'משוואות בשני צעדים', theory, exercises);
