// 109.2 חיבור וחיסור: שומרים על איזון — solving x + b = c and x − b = c by
// doing the same to both sides: take the same off both pans, add the same,
// the opposite operation, the unknown on the right, checking, and a negative
// solution (on the number line: a balance has no negative weights).
const { ltr, P, S, eq, eqn, solve, at, numQ, pans, balFig, balPic, lesson } = require('./common');

const theory = `
<h2>חיבור וחיסור: שומרים על איזון</h2>

<p>במקום לנחש את הנעלם, פותרים את המשוואה צעד אחרי צעד. הכלל אחד: <strong>מה שעושים לאגף אחד, עושים גם לאגף השני</strong>. כך המאזניים נשארים מאוזנים, וכל צעד מקרב אותנו למצב שבו x עומד לבדו.</p>

<div class="formula">
  <div class="formula-title">שומרים על איזון</div>
  <div class="formula-content">${eq('x + 5 − 5 = 12 − 5')}</div>
  <div class="formula-explanation">מורידים 5 משני האגפים, ונשאר ${eq('x = 7')}. כדי לבטל חיבור מחסרים, וכדי לבטל חיסור מחברים.</div>
</div>

<h3>כלל 1: מורידים אותו דבר משתי הכפות</h3>
<div class="rules">
  <p>במשוואה ${eq('x + 5 = 12')} יש ליד x חמש קוביות. מורידים 5 קוביות משתי הכפות: המאזניים נשארים מאוזנים, ועל הכף של x נשאר רק x. מול x נשארו ${eq('12 − 5 = 7')} קוביות, ולכן ${eq('x = 7')}.</p>
  ${P.figures(balFig(pans([1, 5], [0, 12], { take: 5 }), `מורידים 5 משתי הכפות: ${eq('x = 7')}`))}
</div>

<h3>כלל 2: הפעולה ההפוכה</h3>
<div class="rules">
  <p>חיסור מבטל חיבור, וחיבור מבטל חיסור. במשוואה ${eq('x − 4 = 9')} הורידו מ-x ארבע, ולכן מוסיפים 4 לשני האגפים: ${eq('x − 4 + 4 = 9 + 4')}, כלומר ${eq('x = 13')}.</p>
  ${P.figures(balFig({ left: ['x'], right: [{ units: 9 }, { units: 4 }] }, `מוסיפים 4 לשני האגפים: ${eq('x = 9 + 4 = 13')}`))}
</div>

<h3>כלל 3: הנעלם באגף ימין</h3>
<div class="rules">
  <p>אפשר שהנעלם יופיע מימין לסימן =. במשוואה ${eq('15 = x + 6')} מורידים 6 משני האגפים ומקבלים ${eq('9 = x')}, שזה בדיוק ${eq('x = 9')}: המאזניים מאוזנים מכל צד שמסתכלים.</p>
  ${P.figures(balFig(pans([0, 15], [1, 6], { take: 6 }), `מורידים 6 משתי הכפות: ${eq('9 = x')}`))}
</div>

<h3>כלל 4: בודקים בסוף</h3>
<div class="rules">
  <p>אחרי שמצאתם את x, מציבים אותו במשוואה המקורית. ${eq('x = 7')} הוא הפתרון של ${eq('x + 5 = 12')}, כי ${eq('7 + 5 = 12')}. אם האגפים יוצאים שונים, יש טעות באחד הצעדים.</p>
  ${P.figures(balFig({ left: [7, { units: 5 }], right: [{ units: 12 }] }, `בדיקה: ${eq('7 + 5 = 12')}`))}
</div>

<h3>כלל 5: פתרון שלילי</h3>
<div class="rules">
  <p>אותם צעדים עובדים גם כשהפתרון שלילי. במשוואה ${eq('x + 9 = 4')} מורידים 9 משני האגפים: ${eq('x = 4 − 9 = −5')}. בדיקה על ישר המספרים: מ-${eq('−5')} קופצים 9 ימינה ומגיעים ל-4.</p>
  ${P.figures(P.figure(P.integerLine({ from: -6, to: 5, points: [{ value: -5, label: S(-5) }, { value: 4, label: '4', color: 'b' }], hops: [{ from: -5, to: 4, label: '+9' }] }), eq('−5 + 9 = 4')))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לעשות את אותה פעולה במקום את ההפוכה: במשוואה ${eq('x + 5 = 12')} לענות ${eq('12 + 5 = 17')}. ועוד טעות: לשנות רק אגף אחד. אם מורידים 5 רק מאגף שמאל, המאזניים כבר לא מאוזנים.
</div>

<div class="tip">
  <strong>טיפ:</strong> כתבו כל צעד בשורה חדשה, ובכל שורה עשו את אותה פעולה לשני האגפים. בסוף הציבו את התשובה במשוואה המקורית.
</div>
`;

/** "בדיקה: 7 + 5 = 12" for the solution x of l = r. */
const check = (l, r, x) => {
  const term = ([a, b]) => {
    const X = x < 0 ? `(${S(x)})` : S(x);
    const ax = a === 0 ? '' : X;
    if (!ax) return S(b);
    return b === 0 ? ax : `${ax} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
  };
  return `בדיקה: ${ltr(`${term(l)} = ${term(r)}`)}.`;
};

/**
 * x + b = c (or x − b = c when b < 0), the unknown on the left or the right
 * (`flip`), `text` for a story. Solved by doing the opposite to both sides;
 * a balance picture when every number is positive.
 */
function solveQ(n, level, b, c, { flip = false, text = null, before = '' } = {}) {
  const l = [1, b], r = [0, c];
  const x = solve(l, r);
  const shown = flip ? eqn(r, l) : eqn(l, r);
  const ask = text || `מה הפתרון של המשוואה ${ltr(shown)}?`;
  const undo = b > 0
    ? `מורידים ${b} משני האגפים: ${ltr(flip ? `${S(c)} − ${b} = x` : `x = ${S(c)} − ${b} = ${S(x)}`)}`
    : `מוסיפים ${-b} לשני האגפים: ${ltr(flip ? `${S(c)} + ${-b} = x` : `x = ${S(c)} + ${-b} = ${S(x)}`)}`;
  const why = `${before}${undo}${flip ? `, כלומר ${ltr(`x = ${S(x)}`)}` : ''}. ${check(l, r, x)}`;
  const sides = flip ? [r, l] : [l, r];
  const picture = b > 0 && c > 0 && x > 0 ? balPic(pans(...sides, { take: b }), eq(`x = ${x}`)) : null;
  // The same operation instead of the opposite (c + b), the sign, the numbers seen.
  return numQ(n, level, ask, x, [c + b, -x, c - b === x ? null : c - b, c, Math.abs(b), x + 1, x - 1].filter((v) => v !== null), why, { picture });
}

/** Which number comes off (or goes onto) both sides first, in x + b = c. */
function stepQ(n, level, b, c) {
  const ask = b > 0
    ? `איזה מספר מורידים משני האגפים כדי לפתור את ${ltr(eqn([1, b], [0, c]))}?`
    : `איזה מספר מוסיפים לשני האגפים כדי לפתור את ${ltr(eqn([1, b], [0, c]))}?`;
  const why = b > 0
    ? `ליד x יש ${ltr(`+ ${b}`)}, ומבטלים אותו בחיסור: מורידים ${b} משני האגפים ומקבלים ${ltr(`x = ${S(c - b)}`)}.`
    : `מ-x הורידו ${-b}, ומבטלים זאת בחיבור: מוסיפים ${-b} לשני האגפים ומקבלים ${ltr(`x = ${S(c - b)}`)}.`;
  return numQ(n, level, ask, Math.abs(b), [c, c - b, c + b, Math.abs(b) + 1], why);
}

/** What stands opposite x after b comes off both sides of x + b = c. */
function afterQ(n, level, b, c) {
  const why = `מורידים ${b} משני האגפים: באגף שמאל נשאר x, ובאגף ימין ${ltr(`${c} − ${b} = ${c - b}`)}.`;
  return numQ(n, level, `במשוואה ${ltr(eqn([1, b], [0, c]))} מורידים ${b} משני האגפים. איזה מספר יהיה באגף ימין?`, c - b,
    [c + b, c, b, c - b + 1], why, { picture: balPic(pans([1, b], [0, c], { take: b }), eq(`x = ${c - b}`)) });
}

const exercises = [
  // ---------- easy: one step, every number positive ----------
  solveQ(1, 'easy', 3, 8),
  solveQ(2, 'easy', 6, 10),
  solveQ(3, 'easy', -2, 5),
  stepQ(4, 'easy', 7, 15),
  solveQ(5, 'easy', 12, 20),
  solveQ(6, 'easy', -5, 9),
  afterQ(7, 'easy', 4, 11),
  solveQ(8, 'easy', 7, 15, { text: `מה הפתרון של המשוואה ${ltr('7 + x = 15')}?`, before: `החיבור ${ltr('7 + x')} שווה ל-${ltr('x + 7')}. ` }),
  stepQ(9, 'easy', -6, 4),
  solveQ(10, 'easy', -10, 10),

  // ---------- medium: the unknown on the right, larger numbers, stories ----------
  solveQ(11, 'medium', 9, 14, { flip: true }),
  solveQ(12, 'medium', -6, 20, { flip: true }),
  solveQ(13, 'medium', 27, 63),
  solveQ(14, 'medium', -18, 45),
  solveQ(15, 'medium', 4, 31, { text: 'בכיתה היו כמה תלמידים. הצטרפו עוד 4, ועכשיו יש 31. כמה תלמידים היו בהתחלה?',
    before: `נסמן ב-x את מספר התלמידים בהתחלה: ${ltr('x + 4 = 31')}. ` }),
  solveQ(16, 'medium', -15, 38, { text: 'לנועה היה סכום כסף. היא קנתה ספר ב-15 שקלים, ונשארו לה 38 שקלים. כמה כסף היה לה?',
    before: `נסמן ב-x את הסכום שהיה לה: ${ltr('x − 15 = 38')}. ` }),
  stepQ(17, 'medium', 25, 40),
  afterQ(18, 'medium', 9, 30),
  solveQ(19, 'medium', 35, 100),
  solveQ(20, 'medium', -40, 60, { flip: true }),

  // ---------- hard: negative solutions and numbers, stories ----------
  solveQ(21, 'hard', 9, 4),
  solveQ(22, 'hard', 12, 0),
  solveQ(23, 'hard', -3, -8),
  solveQ(24, 'hard', 6, 2, { text: 'הטמפרטורה עלתה ב-6 מעלות והגיעה ל-2 מעלות. מה הייתה הטמפרטורה לפני העלייה?',
    before: `נסמן ב-x את הטמפרטורה בהתחלה: ${ltr('x + 6 = 2')}. ` }),
  solveQ(25, 'hard', -7, -2),
  solveQ(26, 'hard', 15, -5, { flip: true }),
  solveQ(27, 'hard', -4, -4),
  solveQ(28, 'hard', 8, 3, { text: 'מעלית עלתה 8 קומות והגיעה לקומה 3. מאיזו קומה יצאה?',
    before: `נסמן ב-x את הקומה שממנה יצאה: ${ltr('x + 8 = 3')}. ` }),
  solveQ(29, 'hard', 20, 5),
  solveQ(30, 'hard', -9, -12, { flip: true }),
];

module.exports = lesson(2, 'Addition and Subtraction: Keep the Balance', 'חיבור וחיסור: שומרים על איזון', theory, exercises);
