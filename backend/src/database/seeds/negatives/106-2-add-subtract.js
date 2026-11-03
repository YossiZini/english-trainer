// 106.2 חיבור וחיסור — adding on the number line (a positive number goes
// right, a negative one goes left), two negatives, different signs, and
// subtracting as adding the opposite; word problems with temperatures,
// floors, depths and money.
const { ltr, P, S, op, num, ask, eq, intQ, choiceQ, linePic, lesson } = require('./common');

const theory = `
<h2>חיבור וחיסור עם מספרים שליליים</h2>

<p>על ישר המספרים חיבור הוא הליכה: מתחילים במספר הראשון, ומוסיפים מספר <strong>חיובי</strong> בצעדים ימינה, או מספר <strong>שלילי</strong> בצעדים שמאלה. וחיסור? חיסור של מספר הוא חיבור של הנגדי שלו.</p>

<div class="formula">
  <div class="formula-title">חיסור הוא חיבור של הנגדי</div>
  <div class="formula-content">${eq('5 − (−3) = 5 + 3')}</div>
  <div class="formula-explanation">מחסרים ${eq('−3')}? מוסיפים 3, והתוצאה 8. מחסרים 4? מוסיפים ${eq('−4')}.</div>
</div>

<h3>כלל 1: מוסיפים מספר חיובי – הולכים ימינה</h3>
<div class="rules">
  <p>${eq('−2 + 5')}: מתחילים ב-${eq('−2')} והולכים 5 צעדים ימינה, ומגיעים ל-3. לכן ${eq('−2 + 5 = 3')}.</p>
  ${P.figures(P.figure(P.integerLine({ from: -4, to: 5, points: [{ value: -2, label: S(-2) }, { value: 3, label: '3', color: 'b' }], hops: [{ from: -2, to: 3, label: '+5' }] }), eq('−2 + 5 = 3')))}
</div>

<h3>כלל 2: מוסיפים מספר שלילי – הולכים שמאלה</h3>
<div class="rules">
  <p>${eq('4 + (−6)')}: מתחילים ב-4 והולכים 6 צעדים שמאלה, ומגיעים ל-${eq('−2')}. לכן ${eq('4 + (−6) = −2')}.</p>
  ${P.figures(P.figure(P.integerLine({ from: -4, to: 6, points: [{ value: 4, label: '4' }, { value: -2, label: S(-2), color: 'b' }], hops: [{ from: 4, to: -2, label: S(-6) }] }), eq('4 + (−6) = −2')))}
</div>

<h3>כלל 3: שני מספרים שליליים – מחברים את המרחקים</h3>
<div class="rules">
  <p>${eq('−3 + (−4)')}: גם הצעד השני שמאלה. מחברים ${eq('3 + 4 = 7')} ושמים מינוס: ${eq('−3 + (−4) = −7')}. כמו חוב של 3 ₪ ועוד חוב של 4 ₪: חוב של 7 ₪.</p>
  ${P.figures(P.figure(P.integerLine({ from: -8, to: 1, points: [{ value: -3, label: S(-3) }, { value: -7, label: S(-7), color: 'b' }], hops: [{ from: -3, to: -7, label: S(-4) }] }), eq('−3 + (−4) = −7')))}
</div>

<h3>כלל 4: סימנים שונים – מחסרים את המרחקים</h3>
<div class="rules">
  <p>${eq('−8 + 5')}: הצעדים ימינה מבטלים חלק מהצעדים שמאלה. מחסרים ${eq('8 − 5 = 3')}, והסימן הוא של המספר הרחוק יותר מ-0, כאן ${eq('−8')}: ${eq('−8 + 5 = −3')}.</p>
  ${P.figures(P.figure(P.integerLine({ from: -9, to: 1, points: [{ value: -8, label: S(-8) }, { value: -3, label: S(-3), color: 'b' }], hops: [{ from: -8, to: -3, label: '+5' }] }), eq('−8 + 5 = −3')))}
</div>

<h3>כלל 5: חיסור – מחברים את הנגדי</h3>
<div class="rules">
  <p>${eq('5 − (−3) = 5 + 3 = 8')}: לחסר חוב זה כמו להרוויח. ו-${eq('−2 − 4 = −2 + (−4) = −6')}: לחסר מספר חיובי זה ללכת שמאלה.</p>
  ${P.figures(
    P.figure(P.integerLine({ from: 3, to: 9, points: [{ value: 5, label: '5' }, { value: 8, label: '8', color: 'b' }], hops: [{ from: 5, to: 8, label: '+3' }] }), eq('5 − (−3) = 8')),
    P.figure(P.integerLine({ from: -7, to: 0, points: [{ value: -2, label: S(-2) }, { value: -6, label: S(-6), color: 'b' }], hops: [{ from: -2, to: -6, label: S(-4) }] }), eq('−2 − 4 = −6'))
  )}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> "${eq('5 − (−3) = 2')}". מי שעונה כך שכח שחיסור של ${eq('−3')} הוא חיבור של 3. הבדיקה: ${eq('8 + (−3) = 5')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> חשבו על מדחום. ${eq('−4 + 6')}: היה ${eq('−4')} והתחמם ב-6 מעלות, ועכשיו 2.
</div>
`;

/** The number line of a + b (b may be negative), when the numbers are small enough to draw. */
function hopPic(a, b, caption) {
  const r = a + b;
  const from = Math.min(a, r, 0) - 1, to = Math.max(a, r, 0) + 1;
  if (to - from > 22) return null;
  return linePic({ from, to, points: [{ value: a, label: S(a) }, { value: r, label: S(r), color: 'b' }], hops: [{ from: a, to: r, label: b < 0 ? S(b) : `+${b}` }] }, caption);
}

/** How a + b is found, by the rule of the lesson that fits it. */
function explainAdd(a, b) {
  const r = a + b;
  const e = ltr(`${op(a, '+', b)} = ${S(r)}`);
  if (b >= 0) return `מתחילים ב-${num(a)} והולכים ${b} צעדים ימינה: ${e}.`;
  if (a < 0) return `שני מספרים שליליים: מחברים את המרחקים, ${ltr(`${-a} + ${-b} = ${-r}`)}, ושמים מינוס: ${e}.`;
  return `מוסיפים מספר שלילי, ולכן הולכים ${-b} צעדים שמאלה מ-${a}: ${e}.`;
}

/** a + b: wrong options from adding the distances, the wrong sign, subtracting. */
const addQ = (n, level, a, b) => intQ(n, level, ask(op(a, '+', b)), a + b,
  [-(a + b), a - b, b - a, Math.abs(a) + Math.abs(b), -(Math.abs(a) + Math.abs(b)), a + b + 1, a + b - 1],
  explainAdd(a, b), { picture: hopPic(a, b, ltr(`${op(a, '+', b)} = ${S(a + b)}`)) });

/** a − b as a plus the opposite. */
function explainSub(a, b) {
  const r = a - b;
  return `חיסור הוא חיבור של הנגדי: ${ltr(`${op(a, '−', b)} = ${op(a, '+', -b)} = ${S(r)}`)}.`;
}

/** a − b: wrong options from forgetting the opposite (a + b), the wrong sign, one off. */
const subQ = (n, level, a, b) => intQ(n, level, ask(op(a, '−', b)), a - b,
  [a + b, -(a - b), b - a, -(a + b), a - b + 1, a - b - 1],
  explainSub(a, b), { picture: hopPic(a, -b, ltr(`${op(a, '−', b)} = ${S(a - b)}`)) });

/**
 * A story whose answer is a ∘ b (∘ is + or −): the explanation writes the
 * exercise, then the wrong options come from the same mistakes.
 */
function storyQ(n, level, text, a, sym, b, why = '') {
  const r = sym === '+' ? a + b : a - b;
  const exercise = ltr(`${op(a, sym, b)} = ${S(r)}`);
  const cands = sym === '+' ? [-r, a - b, a + b + 1, a + b - 1, -(Math.abs(a) + Math.abs(b))] : [a + b, -r, r + 1, r - 1, -(a + b)];
  const picture = sym === '+' ? hopPic(a, b, exercise) : hopPic(a, -b, exercise);
  return intQ(n, level, text, r, cands, `התרגיל: ${exercise}.${why ? ` ${why}` : ''}`, { picture });
}

const exercises = [
  // ---------- easy: adding on the number line, small numbers ----------
  addQ(1, 'easy', -2, 5),
  addQ(2, 'easy', 4, -6),
  addQ(3, 'easy', -3, -4),
  addQ(4, 'easy', -1, 3),
  addQ(5, 'easy', 6, -2),
  addQ(6, 'easy', -5, 5),
  addQ(7, 'easy', -4, -2),
  addQ(8, 'easy', 2, -7),
  subQ(9, 'easy', 3, 5),
  subQ(10, 'easy', -2, 1),

  // ---------- medium: subtracting negatives, bigger numbers, stories ----------
  subQ(11, 'medium', 5, -3),
  subQ(12, 'medium', -2, -6),
  subQ(13, 'medium', -7, -2),
  subQ(14, 'medium', 0, -4),
  subQ(15, 'medium', -3, 5),
  addQ(16, 'medium', -12, 7),
  addQ(17, 'medium', 15, -20),
  addQ(18, 'medium', -9, -8),
  storyQ(19, 'medium', `בבוקר הטמפרטורה הייתה ${num(-3)} מעלות, ועד הצהריים היא עלתה ב-7 מעלות. כמה מעלות היו בצהריים?`, -3, '+', 7,
    'עלייה בטמפרטורה היא צעדים ימינה.'),
  storyQ(20, 'medium', 'מעלית יצאה מקומה 2 וירדה 5 קומות. באיזו קומה היא עכשיו?', 2, '−', 5,
    `ירידה היא צעדים שמאלה; מתחת לקומת הקרקע (0) הקומות שליליות.`),

  // ---------- hard: three numbers, stories, a missing number ----------
  intQ(21, 'hard', ask('−4 + 9 − 7'), -2, [2, -20, 12, -12],
    `משמאל לימין: ${ltr('−4 + 9 = 5')}, ואחר כך ${ltr('5 − 7 = −2')}.`),
  intQ(22, 'hard', ask('5 − (−2) + (−10)'), -3, [-7, 3, 17, -17],
    `${ltr('5 − (−2) = 5 + 2 = 7')}, ואחר כך ${ltr('7 + (−10) = −3')}.`),
  storyQ(23, 'hard', `צוללן נמצא בעומק ${num(-12)} מטר ועולה 5 מטר. באיזה עומק הוא עכשיו?`, -12, '+', 5,
    'עלייה מקרבת אותו לפני המים (0).'),
  storyQ(24, 'hard', `בצהריים היו 6 מעלות, ובלילה ${num(-4)} מעלות. בכמה מעלות ירדה הטמפרטורה?`, 6, '−', -4,
    `מחסרים: חם פחות קר. מ-${num(-4)} עד 0 יש 4 מעלות, ומ-0 עד 6 עוד 6.`),
  storyQ(25, 'hard', `ביתרה של דנה היה חוב של 50 ₪, כלומר ${num(-50)} ₪. היא הפקידה 120 ₪. כמה כסף יש לה עכשיו?`, -50, '+', 120,
    'ההפקדה מכסה את החוב, ומה שנשאר הוא שלה.'),
  intQ(26, 'hard', `איזה מספר חסר? ${ltr('? + (−5) = −2')}`, 3, [-3, -7, 7],
    `מחפשים מספר שאם הולכים ממנו 5 צעדים שמאלה מגיעים ל-${num(-2)}: ${ltr('−2 − (−5) = −2 + 5 = 3')}. בדיקה: ${ltr('3 + (−5) = −2')}.`),
  intQ(27, 'hard', `איזה מספר חסר? ${ltr('−3 − ? = 4')}`, -7, [7, 1, -1],
    `${ltr('−3 − (−7) = −3 + 7 = 4')}. מחסרים מספר שלילי כדי לעלות מ-${num(-3)} ל-4.`),
  storyQ(28, 'hard', `באילת נמדדו 21 מעלות ובחרמון ${num(-3)} מעלות. בכמה מעלות חם יותר באילת?`, 21, '−', -3,
    'ההפרש הוא חיסור: חם פחות קר.'),
  addQ(29, 'hard', -18, 18),
  choiceQ(30, 'hard', 'באיזה תרגיל התוצאה הגדולה ביותר?', '(−3) − (−4)', ['(−3) + (−4)', '3 − 4', '(−3) − 4'],
    `${ltr('(−3) − (−4) = −3 + 4 = 1')}, ובשאר התוצאות שליליות: ${ltr('(−3) + (−4) = −7')}, ${ltr('3 − 4 = −1')}, ${ltr('(−3) − 4 = −7')}.`),
];

module.exports = lesson(2, 'Adding and Subtracting Negative Numbers', 'חיבור וחיסור עם מספרים שליליים', theory, exercises);
