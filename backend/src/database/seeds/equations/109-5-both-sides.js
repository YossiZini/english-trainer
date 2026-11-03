// 109.5 הנעלם בשני האגפים — ax + b = cx + d: take the same number of x off
// both sides (from the side with fewer), then finish in two steps as in 10.4;
// the unknown may end on the right; negative numbers; checking both sides.
const { ltr, eq, eqn, solve, numQ, pans, balFig, balPic, lesson, P, xs, steps, checkQ } = require('./common');

const theory = `
<h2>הנעלם בשני האגפים</h2>

<p>במשוואה ${eq('3x + 2 = x + 10')} יש x בשני האגפים. על המאזניים: שלוש קופסאות ו-2 קוביות מול קופסה אחת ו-10 קוביות. בכל הקופסאות אותו משקל, ולכן אפשר להוריד קופסה משתי הכפות, והמאזניים נשארים מאוזנים.</p>

<div class="formula">
  <div class="formula-title">קודם ה-x, אחר כך המספרים</div>
  <div class="formula-content">${eq('3x + 2 = x + 10')}</div>
  <div class="formula-explanation">מורידים x משני האגפים: ${eq('2x + 2 = 10')}. מורידים 2: ${eq('2x = 8')}. מחלקים ב-2: ${eq('x = 4')}.</div>
</div>

<h3>כלל 1: מורידים את אותן קופסאות משתי הכפות</h3>
<div class="rules">
  <p>מורידים קופסה אחת מכל כף: נשארו שתי קופסאות ו-2 קוביות מול 10 קוביות. מכאן ממשיכים כמו בשיעור הקודם: מורידים 2 קוביות, ובכל קופסה 4.</p>
  ${P.figures(
    balFig(pans([3, 2], [1, 10], { takeX: 1 }), `מורידים ${eq('x')}: ${eq('2x + 2 = 10')}`),
    balFig(pans([2, 2], [0, 10], { take: 2 }), `מורידים 2: ${eq('2x = 8')}`))}
</div>

<h3>כלל 2: מורידים מהאגף שיש בו פחות x</h3>
<div class="rules">
  <p>במשוואה ${eq('5x = 2x + 12')} באגף ימין יש פחות x, ולכן מורידים ${eq('2x')} משני האגפים: ${eq('3x = 12')}, ו-x הוא 4. כך x נשאר רק באגף אחד.</p>
  ${P.figures(balFig(pans([5, 0], [2, 12], { takeX: 2 }), `מורידים ${eq('2x')}: ${eq('3x = 12')}`))}
</div>

<h3>כלל 3: קודם ה-x, אחר כך המספרים</h3>
<div class="rules">
  <p>במשוואה ${eq('4x + 1 = 2x + 9')} מורידים ${eq('2x')} משני האגפים: ${eq('2x + 1 = 9')}. מורידים 1: ${eq('2x = 8')}. מחלקים ב-2: ${eq('x = 4')}.</p>
  ${P.figures(balFig(pans([4, 1], [2, 9], { takeX: 2, take: 1 }), `מורידים ${eq('2x')} ו-1: ${eq('2x = 8')}`))}
</div>

<h3>כלל 4: הנעלם יכול להישאר באגף ימין</h3>
<div class="rules">
  <p>במשוואה ${eq('x + 15 = 4x + 3')} באגף שמאל יש פחות x. מורידים x משני האגפים: ${eq('15 = 3x + 3')}. מורידים 3: ${eq('12 = 3x')}, ולכן ${eq('x = 4')}. זה בסדר ש-x נשאר מימין.</p>
  ${P.figures(balFig(pans([1, 15], [4, 3], { takeX: 1, take: 3 }), `מורידים ${eq('x')} ו-3: ${eq('12 = 3x')}`))}
</div>

<h3>כלל 5: בודקים את שני האגפים</h3>
<div class="rules">
  <p>מציבים את התשובה בשני האגפים של המשוואה המקורית. כאשר ${eq('x = 4')} במשוואה ${eq('3x + 2 = x + 10')}: באגף שמאל ${eq('3 × 4 + 2 = 14')}, ובאגף ימין ${eq('4 + 10 = 14')}. שני האגפים שווים.</p>
  ${P.figures(balFig({ left: [4, 4, 4, { units: 2 }], right: [4, { units: 10 }] }, 'בכל כף 14'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> להוריד x רק מאגף אחד. כשמורידים קופסה מכף אחת בלבד, המאזניים נוטים. ועוד טעות: לחבר את ה-x של שני האגפים. במשוואה ${eq('3x + 2 = x + 10')} מורידים x משני האגפים ומקבלים ${eq('2x')}, לא ${eq('4x')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> אחרי שה-x נשאר באגף אחד, המשוואה היא כמו בשיעור הקודם, ופותרים אותה בשני צעדים.
</div>
`;

const isInt = (v) => Number.isInteger(v);

/**
 * a·x + b = c·x + d, written as `shown` (default eqn(l, r)) or asked as a
 * story (`text`, `first` states its equation). A balance of the first step
 * (the same boxes off both pans) when every number is positive and small.
 */
function bothQ(n, level, l, r, { shown = null, text = null, first = '' } = {}) {
  const [a, b] = l, [c, d] = r;
  const x = solve(l, r);
  const written = shown || eqn(l, r);
  const ask = text || `מה הפתרון של המשוואה ${ltr(written)}?`;
  const why = steps(l, r, { text: written, first });
  const k = Math.min(a, c);
  const picture = !text && [a, b, c, d].every((v) => v >= 0) && x > 0 && k > 0 && Math.max(a, c) <= 5 && Math.max(b, d) <= 15
    ? balPic(pans(l, r, { takeX: k }), `מורידים ${eq(xs(k))}: ${eq(eqn([a - k, b], [c - k, d]))}`)
    : null;
  // Adding the x of both sides, the number moved without its sign, forgetting to divide, the sign of x;
  // a story or an easy question with a positive answer offers positive numbers only.
  const positive = x > 0 && (text || level === 'easy');
  const cands = [(d - b) / (a + c), (d + b) / (a - c), d - b, b - d, -x, x + 1, x - 1, x * 2, x + 2]
    .filter((v) => isInt(v) && (!positive || v > 0));
  return numQ(n, level, ask, x, cands, why, { picture });
}

/** How many x stand on one side after k·x come off (or, k < 0, go onto) both sides. */
function takeXQ(n, level, l, r, k, side, { shown = null } = {}) {
  const verb = k > 0 ? `מורידים ${ltr(xs(k))} משני` : `מוסיפים ${ltr(xs(-k))} לשני`;
  const L2 = [l[0] - k, l[1]], R2 = [r[0] - k, r[1]];
  const answer = side === 'שמאל' ? L2[0] : R2[0];
  const before = side === 'שמאל' ? l[0] : r[0];
  const had = before === 1 ? 'היה x אחד' : `היו ${ltr(xs(before))}`;
  const why = `${verb} האגפים: ${ltr(eqn(L2, R2))}. באגף ${side} ${had}, ועכשיו ${ltr(xs(answer))}.`;
  return numQ(n, level, `במשוואה ${ltr(shown || eqn(l, r))} ${verb} האגפים. כמה x יהיו באגף ${side}?`, answer,
    [before + k, before, Math.abs(k), answer + 1, answer - 1].filter((v) => v > 0), why);
}

const exercises = [
  // ---------- easy: positive numbers, x left on the left ----------
  bothQ(1, 'easy', [3, 2], [1, 12]),
  bothQ(2, 'easy', [4, 0], [1, 9]),
  takeXQ(3, 'easy', [5, 3], [2, 9], 2, 'שמאל'),
  bothQ(4, 'easy', [5, 0], [3, 8]),
  checkQ(5, 'easy', [4, 1], [2, 7], 3),
  bothQ(6, 'easy', [2, 7], [1, 10]),
  bothQ(7, 'easy', [6, 1], [4, 9]),
  takeXQ(8, 'easy', [2, 11], [5, 2], 2, 'ימין'),
  checkQ(9, 'easy', [3, 4], [1, 12], 5),
  bothQ(10, 'easy', [3, 5], [2, 9]),

  // ---------- medium: x on the right, a minus, stories ----------
  bothQ(11, 'medium', [1, 15], [3, 5]),
  bothQ(12, 'medium', [5, -2], [3, 6]),
  bothQ(13, 'medium', [5, 20], [7, 8], {
    text: 'לדני יש 20 שקלים, והוא חוסך 5 שקלים בכל שבוע. לרוני יש 8 שקלים, והיא חוסכת 7 שקלים בכל שבוע. אחרי כמה שבועות יהיה להם אותו סכום?',
    first: `נסמן ב-x את מספר השבועות: ${ltr('5x + 20 = 7x + 8')}. ` }),
  bothQ(14, 'medium', [7, -4], [4, 8]),
  takeXQ(15, 'medium', [6, -5], [2, 7], 2, 'שמאל'),
  checkQ(16, 'medium', [5, -3], [2, 3], 2),
  bothQ(17, 'medium', [2, 9], [5, 0]),
  bothQ(18, 'medium', [3, 4], [5, -6], {
    text: 'חשבתי על מספר. כפלתי אותו ב-3 והוספתי 4, וקיבלתי את אותה תוצאה כמו כשכפלתי אותו ב-5 והורדתי 6. על איזה מספר חשבתי?',
    first: `המשוואה: ${ltr('3x + 4 = 5x − 6')}. ` }),
  bothQ(19, 'medium', [4, -6], [1, 9]),
  bothQ(20, 'medium', [20, 50], [30, 0], {
    text: 'במכון הכושר הראשון משלמים 50 שקלים דמי הרשמה, ועוד 20 שקלים לכל אימון. במכון השני אין דמי הרשמה, ומשלמים 30 שקלים לכל אימון. אחרי כמה אימונים המחיר יהיה שווה?',
    first: `נסמן ב-x את מספר האימונים: ${ltr('20x + 50 = 30x')}. ` }),

  // ---------- hard: negative solutions, x taken with a minus ----------
  bothQ(21, 'hard', [3, 7], [1, 1]),
  bothQ(22, 'hard', [5, 4], [2, -8]),
  bothQ(23, 'hard', [-2, 9], [1, 0], { shown: '9 − 2x = x' }),
  bothQ(24, 'hard', [-2, 30], [-1, 20], {
    text: 'נר אחד באורך 30 סנטימטרים מתקצר ב-2 סנטימטרים בכל שעה. נר שני באורך 20 סנטימטרים מתקצר בסנטימטר אחד בכל שעה. אחרי כמה שעות יהיו שני הנרות באותו אורך?',
    shown: '30 − 2x = 20 − x',
    first: `נסמן ב-x את מספר השעות: ${ltr('30 − 2x = 20 − x')}. ` }),
  bothQ(25, 'hard', [4, -3], [6, 7]),
  takeXQ(26, 'hard', [-3, 7], [1, 15], -3, 'ימין', { shown: '7 − 3x = x + 15' }),
  checkQ(27, 'hard', [3, 1], [1, -3], -2),
  bothQ(28, 'hard', [2, -5], [-1, 10], { shown: '2x − 5 = 10 − x' }),
  bothQ(29, 'hard', [3, -10], [1, 10], {
    text: 'לנועה יש פי 3 מדבקות מאשר לאחיה. אם היא תיתן לו 10 מדבקות, יהיה להם אותו מספר. כמה מדבקות יש לאחיה?',
    first: `נסמן ב-x את מספר המדבקות של האח. לנועה ${ltr('3x')}, ואחרי שהיא נותנת 10: ${ltr('3x − 10 = x + 10')}. ` }),
  bothQ(30, 'hard', [6, 5], [8, 13]),
];

module.exports = lesson(5, 'The Unknown on Both Sides', 'הנעלם בשני האגפים', theory, exercises);
