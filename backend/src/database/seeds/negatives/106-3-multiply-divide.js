// 106.3 כפל וחילוק — the sign rules: a positive times a negative as equal
// hops to the left, a negative times a negative from the pattern, division
// by the same rules (checked by multiplication), several factors, the order
// of operations with negatives; word problems with temperatures, depths,
// debts and an average.
const { ltr, P, S, term, op, num, ask, eq, intQ, choiceQ, linePic, lesson } = require('./common');

/** `count` equal hops of `size` from 0, on one level. */
const equalHops = (count, size) =>
  Array.from({ length: count }, (_, i) => ({ from: i * size, to: (i + 1) * size, label: S(size) }));

const theory = `
<h2>כפל וחילוק עם מספרים שליליים</h2>

<p>כפל הוא חיבור חוזר: ${eq('4 × 3')} הוא ארבע פעמים 3. כך גם ${eq('4 × (−3)')}: ארבע פעמים ${eq('−3')}. מזה לומדים מה קורה לסימן בכפל, ואותם כללים עובדים גם בחילוק.</p>

<div class="formula">
  <div class="formula-title">כללי הסימנים</div>
  <div class="formula-content">סימנים שווים – חיובי, סימנים שונים – שלילי</div>
  <div class="formula-explanation">קודם כופלים או מחלקים בלי הסימנים, ואחר כך קובעים את הסימן: ${eq('−3 × (−4) = 12')}, ${eq('3 × (−4) = −12')}.</div>
</div>

<h3>כלל 1: חיובי כפול שלילי – שלילי</h3>
<div class="rules">
  <p>${eq('4 × (−3)')}: ארבעה צעדים של ${eq('−3')}, כולם שמאלה, ומגיעים ל-${eq('−12')}. לכן ${eq('4 × (−3) = −12')}. אפשר להחליף את סדר הגורמים, ולכן גם ${eq('−3 × 4 = −12')}.</p>
  ${P.figures(P.figure(P.integerLine({ from: -12, to: 1, points: [{ value: -12, label: S(-12), color: 'b' }], hops: equalHops(4, -3), flat: true, labelEvery: 3 }), eq('4 × (−3) = −12')))}
</div>

<h3>כלל 2: שלילי כפול שלילי – חיובי</h3>
<div class="rules">
  <p>מסתכלים על הסדרה: בכל שורה הגורם השני קטן ב-1, והתוצאה גדלה ב-2.</p>
  <ul>
    <li>${eq('−2 × 2 = −4')}</li>
    <li>${eq('−2 × 1 = −2')}</li>
    <li>${eq('−2 × 0 = 0')}</li>
    <li>${eq('−2 × (−1) = 2')}</li>
    <li>${eq('−2 × (−2) = 4')}</li>
  </ul>
  <p>ממשיכים באותו כלל אחרי 0, ולכן ${eq('−2 × (−2) = 4')}: שלילי כפול שלילי הוא חיובי.</p>
  ${P.figures(P.figure(P.integerLine({ from: -5, to: 5, points: [-4, -2, 0, 2, 4].map((v, i) => ({ value: v, label: S(v), color: i === 4 ? 'b' : 'a' })), hops: [-4, -2, 0, 2].map((v) => ({ from: v, to: v + 2, label: '+2' })), flat: true }), 'בכל שורה התוצאה גדלה ב-2'))}
</div>

<h3>כלל 3: חילוק – אותם כללים</h3>
<div class="rules">
  <p>${eq('−12 ÷ 3')}: מחלקים את ${eq('−12')} לשלושה צעדים שווים, וכל צעד הוא ${eq('−4')}. לכן ${eq('−12 ÷ 3 = −4')}, ובודקים בכפל: ${eq('−4 × 3 = −12')}. וגם ${eq('−12 ÷ (−3) = 4')}, כי ${eq('4 × (−3) = −12')}.</p>
  ${P.figures(P.figure(P.integerLine({ from: -12, to: 1, points: [{ value: -12, label: S(-12), color: 'b' }], hops: equalHops(3, -4), flat: true, labelEvery: 4 }), eq('−12 ÷ 3 = −4')))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> "${eq('−3 × (−4) = −12')}". מי שעונה כך שכח שסימנים שווים נותנים תוצאה חיובית. וזה לא כמו בחיבור: ${eq('−3 + (−4) = −7')}, אבל ${eq('−3 × (−4) = 12')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> בכפל של כמה גורמים סופרים את השליליים: מספר זוגי של שליליים – התוצאה חיובית, מספר אי-זוגי – שלילית. ${eq('−1 × (−2) × (−3) = −6')}: שלושה שליליים.
</div>
`;

/** a ∘ b for ∘ = × or ÷. */
const calc = (a, sym, b) => (sym === '×' ? a * b : a / b);

/** The picture of a positive count of equal negative hops from 0, when it is small enough to draw. */
function hopsPic(count, size, caption) {
  const end = count * size;
  if (count < 1 || size >= 0 || end < -24) return null;
  return linePic({ from: end, to: 1, points: [{ value: end, label: S(end), color: 'b' }], hops: equalHops(count, size), flat: true, labelEvery: -size }, caption);
}

/** How a ∘ b is found: without the signs first, then the sign rule; a division is checked by multiplication. */
function explainSign(a, sym, b) {
  const r = calc(a, sym, b);
  const e = ltr(`${op(a, sym, b)} = ${S(r)}`);
  if (r === 0) return `0 כפול כל מספר הוא 0: ${e}.`;
  const plain = ltr(`${Math.abs(a)} ${sym} ${Math.abs(b)} = ${Math.abs(r)}`);
  const same = (a < 0) === (b < 0);
  const rule = same ? 'הסימנים שווים, ולכן התוצאה חיובית' : 'הסימנים שונים, ולכן התוצאה שלילית';
  const check = sym === '÷' ? ` בדיקה: ${ltr(`${S(r)} × ${term(b)} = ${S(a)}`)}.` : '';
  return `בלי הסימנים: ${plain}. ${rule}: ${e}.${check}`;
}

/** The picture of a ∘ b when it is a count of equal negative hops: 4 × (−3), −5 × 2, −12 ÷ 3. */
function signPic(a, sym, b) {
  const r = calc(a, sym, b);
  const caption = ltr(`${op(a, sym, b)} = ${S(r)}`);
  if (sym === '×') return a > 0 && b < 0 ? hopsPic(a, b, caption) : a < 0 && b > 0 ? hopsPic(b, a, caption) : null;
  return a < 0 && b > 0 ? hopsPic(b, r, caption) : null;
}

/** a × b or a ÷ b: wrong options from the wrong sign, adding instead, the next or previous row of the table. */
function signQ(n, level, a, sym, b) {
  const r = calc(a, sym, b);
  const sign = Math.sign(r);
  const near = sym === '×'
    ? [sign * (Math.abs(a) + 1) * Math.abs(b), sign * (Math.abs(a) - 1) * Math.abs(b)]
    : [sign * (Math.abs(r) + 1), sign * (Math.abs(r) - 1)];
  // (0 instead of −0 when a row of the table is 0)
  const cands = sym === '×' ? [-r, a + b, ...near, -(a + b)] : [-r, ...near, -near[0]];
  return intQ(n, level, ask(op(a, sym, b)), r, cands, explainSign(a, sym, b), signPic(a, sym, b));
}

const exercises = [
  // ---------- easy: one product or quotient, small numbers ----------
  signQ(1, 'easy', 3, '×', -4),
  signQ(2, 'easy', -5, '×', 2),
  signQ(3, 'easy', -3, '×', -3),
  signQ(4, 'easy', -6, '×', -1),
  signQ(5, 'easy', 7, '×', -1),
  signQ(6, 'easy', -12, '÷', 3),
  signQ(7, 'easy', 10, '÷', -2),
  signQ(8, 'easy', -8, '÷', -4),
  intQ(9, 'easy', ask(op(0, '×', -9)), 0, [-9, 9, 1],
    `0 כפול כל מספר הוא 0, גם כפול מספר שלילי: ${ltr('0 × (−9) = 0')}.`),
  signQ(10, 'easy', -6, '÷', 6),

  // ---------- medium: the times table with signs, stories, a missing factor ----------
  signQ(11, 'medium', -7, '×', 8),
  signQ(12, 'medium', -9, '×', -6),
  signQ(13, 'medium', -42, '÷', 6),
  signQ(14, 'medium', -63, '÷', -7),
  signQ(15, 'medium', 72, '÷', -9),
  signQ(16, 'medium', -12, '×', 5),
  intQ(17, 'medium', 'בחצות היו 0 מעלות, ומאז הטמפרטורה יורדת ב-2 מעלות בכל שעה. כמה מעלות יהיו אחרי 5 שעות?', -10, [10, -7, -3],
    `ירידה של 2 מעלות היא ${num(-2)}, חמש פעמים: ${ltr('5 × (−2) = −10')}.`,
    hopsPic(5, -2, ltr('5 × (−2) = −10'))),
  intQ(18, 'medium', `שלושה חברים חייבים יחד 60 ₪, כלומר ${num(-60)} ₪, ומחלקים את החוב שווה בשווה. מה החלק של כל אחד?`, -20, [20, -57, -180],
    `${ltr('−60 ÷ 3 = −20')}: חוב של 20 ₪ לכל אחד. בדיקה: ${ltr('−20 × 3 = −60')}.`),
  intQ(19, 'medium', `איזה מספר חסר? ${ltr('? × (−4) = 20')}`, -5, [5, 24, -16],
    `מחלקים: ${ltr('20 ÷ (−4) = −5')}. בדיקה: ${ltr('−5 × (−4) = 20')}, סימנים שווים ותוצאה חיובית.`),
  choiceQ(20, 'medium', 'באיזה תרגיל התוצאה חיובית?', '−6 × (−2)', ['−6 × 2', '6 ÷ (−2)', '−6 ÷ 2'],
    `${ltr('−6 × (−2) = 12')}: שני גורמים שליליים. בשאר הסימנים שונים, והתוצאה שלילית: ${ltr('−6 × 2 = −12')}, ${ltr('6 ÷ (−2) = −3')}, ${ltr('−6 ÷ 2 = −3')}.`),

  // ---------- hard: several factors, the order of operations, stories ----------
  intQ(21, 'hard', ask('−2 × 3 × (−5)'), 30, [-30, -6, -15],
    `משמאל לימין: ${ltr('−2 × 3 = −6')}, ואחר כך ${ltr('−6 × (−5) = 30')}. שני גורמים שליליים: התוצאה חיובית.`),
  intQ(22, 'hard', ask('−2 × (−2) × (−2)'), -8, [8, -6, 6],
    `${ltr('−2 × (−2) = 4')}, ואחר כך ${ltr('4 × (−2) = −8')}. שלושה גורמים שליליים, מספר אי-זוגי: התוצאה שלילית.`),
  intQ(23, 'hard', ask('−3 × 4 + 5'), -7, [-27, 17, 7],
    `קודם כפל: ${ltr('−3 × 4 = −12')}, ואחר כך ${ltr('−12 + 5 = −7')}.`),
  intQ(24, 'hard', ask('20 ÷ (−4) − 3'), -8, [-2, 2, 8],
    `קודם חילוק: ${ltr('20 ÷ (−4) = −5')}, ואחר כך ${ltr('−5 − 3 = −8')}.`),
  intQ(25, 'hard', ask('(−6 + 2) × (−3)'), 12, [-12, 24, -7],
    `קודם הסוגריים: ${ltr('−6 + 2 = −4')}, ואחר כך ${ltr('−4 × (−3) = 12')}.`),
  intQ(26, 'hard', 'צוללת יוצאת מפני המים (0) ויורדת 4 מטר בכל דקה. באיזה עומק היא אחרי 6 דקות?', -24, [24, -10, -2],
    `ירידה של 4 מטר היא ${num(-4)}, שש פעמים: ${ltr('6 × (−4) = −24')}, כלומר 24 מטר מתחת לפני המים.`,
    hopsPic(6, -4, ltr('6 × (−4) = −24'))),
  intQ(27, 'hard', `בשלושה לילות נמדדו ${num(-8)}, ${num(-4)} ו-0 מעלות. מה הטמפרטורה הממוצעת?`, -4, [4, -6, -12],
    `הסכום: ${ltr('−8 + (−4) + 0 = −12')}. מחלקים במספר הלילות, 3 (גם 0 נספר): ${ltr('−12 ÷ 3 = −4')}.`),
  intQ(28, 'hard', `איזה מספר חסר? ${ltr('−36 ÷ ? = 4')}`, -9, [9, -8, 8],
    `${ltr('−36 ÷ 4 = −9')}. בדיקה: ${ltr('−36 ÷ (−9) = 4')}, סימנים שווים ותוצאה חיובית.`),
  choiceQ(29, 'hard', 'כופלים חמישה מספרים שליליים. מה אפשר לומר על התוצאה?', 'היא שלילית', ['היא חיובית', 'היא אפס', 'אי אפשר לדעת'],
    'כל שני שליליים נותנים חיובי. ארבעה שליליים הם שני זוגות, והתוצאה שלהם חיובית; החמישי הופך אותה לשלילית. מספר אי-זוגי של גורמים שליליים: התוצאה שלילית.'),
  intQ(30, 'hard', `במשך 5 שעות הטמפרטורה ירדה מ-0 ל-${num(-15)} מעלות, כל שעה באותה מידה. מה השינוי בכל שעה?`, -3, [3, -10, -20],
    `${ltr('−15 ÷ 5 = −3')}: ירידה של 3 מעלות בכל שעה. בדיקה: ${ltr('5 × (−3) = −15')}.`,
    hopsPic(5, -3, ltr('−15 ÷ 5 = −3'))),
];

module.exports = lesson(3, 'Multiplying and Dividing Negative Numbers', 'כפל וחילוק עם מספרים שליליים', theory, exercises);
