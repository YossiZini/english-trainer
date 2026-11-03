// 110.2 השוואה ועיגול — comparing decimals place by place (the wholes first,
// then the tenths, then the hundredths; longer is not larger), the number
// line, putting numbers in order, and rounding to a whole and to a tenth.
// Numbers, wrong options and pictures from ./common.js.
const { ltr, P, eq, pic, D, str, places, round, cut, cmp, digits, decQ, choiceQ, lesson } = require('./common');

/** a ? b written as a comparison: "0.5 > 0.45". */
const rel = (a, b) => `${a} ${cmp(a, b) > 0 ? '>' : cmp(a, b) < 0 ? '<' : '='} ${b}`;
const fill = (s, p) => str(s, p);

/** Which comparison of a and b is right: the true one and the two false ones. */
function signQ(n, level, a, b, why) {
  const right = rel(a, b);
  const wrongs = ['>', '<', '='].map((s) => `${a} ${s} ${b}`).filter((s) => s !== right);
  return choiceQ(n, level, `איזה משפט נכון?`, right, wrongs, why);
}

/** The largest or the smallest of `numbers` (the options are the numbers). */
function extremeQ(n, level, which, numbers, opts = {}) {
  const sorted = [...numbers].sort((x, y) => cmp(x, y));
  const ans = which === 'max' ? sorted[sorted.length - 1] : sorted[0];
  const p = Math.max(...numbers.map(places));
  const why = `${opts.before || ''}משלימים אפסים עד ${p} ספרות אחרי הנקודה: ${numbers.map((s) => fill(s, p)).join(', ')}. ${which === 'max' ? 'הגדול ביותר' : 'הקטן ביותר'} הוא ${ans}.`;
  return choiceQ(n, level, opts.text || `איזה מספר הוא ${which === 'max' ? 'הגדול' : 'הקטן'} ביותר?`, ans, numbers.filter((s) => s !== ans), why,
    { picture: pic(P.placeValue(numbers.map((s) => fill(s, p))), 'משווים מקום אחר מקום') });
}

/**
 * Which order is right, small to large: the right chain, the chain of the
 * mistake "longer is larger" (the digits as whole numbers), the right chain
 * backwards, and the right one with its first two swapped.
 */
function orderQ(n, level, numbers) {
  const up = [...numbers].sort((x, y) => cmp(x, y));
  const chain = (list) => list.join(' < ');
  const byLength = [...numbers].sort((x, y) => digits(x) - digits(y));
  const swapFirst = [up[1], up[0], ...up.slice(2)];
  const swapLast = [...up.slice(0, -2), up[up.length - 1], up[up.length - 2]];
  const wrongs = [...new Set([chain(byLength), chain([...up].reverse()), chain(swapFirst), chain(swapLast)])].filter((c) => c !== chain(up));
  const p = Math.max(...numbers.map(places));
  return choiceQ(n, level, 'איזה סדר נכון, מהקטן לגדול?', chain(up), wrongs.slice(0, 3),
    `משלימים אפסים עד ${p} ספרות אחרי הנקודה ומשווים: ${ltr(chain(up.map((s) => fill(s, p))))}.`,
    { picture: pic(P.placeValue(up.slice(0, 3).map((s) => fill(s, p))), 'אותו מספר ספרות אחרי הנקודה') });
}

/** Round x to a whole (k = 0) or to a tenth (k = 1); the picture shows the two neighbours. */
function roundQ(n, level, x, k, wrongs, opts = {}) {
  const r = round(x, k);
  const next = (str(x).split('.')[1] || '').padEnd(k + 1, '0')[k];
  const placeName = k === 0 ? 'העשיריות' : 'המאיות';
  const up = Number(next) >= 5;
  const why = `מסתכלים על ספרת ${placeName}: ${next}, ${up ? 'שהיא 5 או יותר, ולכן מעגלים למעלה' : 'שהיא פחות מ-5, ולכן מעגלים למטה'}. ${ltr(`${x} ≈ ${str(r)}`)}.${opts.after || ''}`;
  let picture = null;
  if (places(x) === k + 1) {
    const low = cut(x, k);
    const high = low + 10n ** BigInt(6 - k);
    picture = pic(P.decimalLine({ from: str(low), to: str(high), places: k + 1, labelEvery: k ? 5 : 1, points: [{ at: str(x) }] }), `${x} קרוב יותר ל-${str(r)}`);
  }
  const text = opts.text || `עגלו את ${x} ${k === 0 ? 'לשלם' : 'לעשירית'}.`;
  return decQ(n, level, text, r, wrongs, why, { picture });
}

/** Which number is marked A on a number line whose labels are only every `labelEvery` ticks. */
function lineQ(n, level, from, to, p, at, wrongs, labelEvery) {
  const step = p === 1 ? 'עשירית' : 'מאית';
  const why = `כל שנת היא ${step}. סופרים מ-${from} ימינה עד A: ${at}.`;
  return decQ(n, level, 'איזה מספר מסומן באות A?', at, wrongs, why,
    { question: P.decimalLine({ from, to, places: p, labelEvery, points: [{ at, label: 'A' }] }) });
}

const theory = `
<h2>השוואה ועיגול של שברים עשרוניים</h2>

<p>משווים שברים עשרוניים מקום אחרי מקום: קודם את השלמים, אחר כך את העשיריות ואז את המאיות. מספר עם יותר ספרות אחרי הנקודה איננו בהכרח גדול יותר. מעגלים מספר כשמספיק לדעת את ערכו בקירוב.</p>

<div class="formula">
  <div class="formula-title">השוואה</div>
  <div class="formula-content">${eq('0.5 > 0.45')}</div>
  <div class="formula-explanation">השלמים שווים (0), ובעשיריות 5 גדול מ-4. לכן 0.5 גדול יותר, אף על פי שיש לו פחות ספרות.</div>
</div>

<h3>כלל 1: קודם משווים את השלמים</h3>
<div class="rules">
  <p>המספר 3.2 גדול מ-2.95, כי יש בו 3 שלמים, וב-2.95 רק 2. כשהשלמים שונים, הספרות אחרי הנקודה לא משנות.</p>
  ${P.figures(P.figure(P.placeValue(['3.2', '2.95'], { mark: 'ones' }), `${eq('3.2 > 2.95')}: באחדות 3 מול 2`))}
</div>

<h3>כלל 2: אחר כך עשיריות, ואז מאיות</h3>
<div class="rules">
  <p>כשהשלמים שווים, משווים את העשיריות. ב-0.5 יש 5 עשיריות, וב-0.45 רק 4, ולכן ${eq('0.5 > 0.45')}. כדאי להשלים אפס: ${eq('0.50 > 0.45')}, כלומר 50 מאיות מול 45 מאיות.</p>
  ${P.figures(
    P.figure(P.hundredGrid(50), `${eq('0.5 = 0.50')}: 50 משבצות`),
    P.figure(P.hundredGrid(45), `${eq('0.45')}: 45 משבצות`)
  )}
</div>

<h3>כלל 3: על ישר המספרים</h3>
<div class="rules">
  <p>על ישר המספרים, מספר שנמצא ימינה יותר הוא גדול יותר. בין 0.4 ל-0.5 יש עשר מאיות: 0.41, 0.42 וכן הלאה. המספר 0.47 נמצא ימינה מ-0.42, ולכן ${eq('0.47 > 0.42')}.</p>
  ${P.figures(P.figure(P.decimalLine({ from: '0.4', to: '0.5', places: 2, points: [{ at: '0.42', color: 'b' }, { at: '0.47' }] }), `${eq('0.42 < 0.47')}`))}
</div>

<h3>כלל 4: מסדרים מהקטן לגדול</h3>
<div class="rules">
  <p>כדי לסדר את 0.5, 0.45 ו-0.405 משלימים אפסים, כך שלכולם אותו מספר ספרות אחרי הנקודה: 0.500, 0.450 ו-0.405. עכשיו משווים כמו מספרים שלמים: ${eq('0.405 < 0.45 < 0.5')}.</p>
  ${P.figures(P.figure(P.placeValue(['0.405', '0.450', '0.500']), 'שלוש ספרות אחרי הנקודה לכל מספר'))}
</div>

<h3>כלל 5: עיגול לשלם</h3>
<div class="rules">
  <p>מעגלים לשלם הקרוב. מסתכלים על ספרת העשיריות: אם היא 5 או יותר מעגלים למעלה, ואם היא פחות מ-5 מעגלים למטה. ${eq('2.7 ≈ 3')}, ${eq('2.4 ≈ 2')}, ו-${eq('2.5 ≈ 3')}.</p>
  ${P.figures(P.figure(P.decimalLine({ from: '2', to: '3', points: [{ at: '2.7' }] }), `${eq('2.7 ≈ 3')}: קרוב יותר ל-3`))}
</div>

<h3>כלל 6: עיגול לעשירית</h3>
<div class="rules">
  <p>כדי לעגל לעשירית מסתכלים על ספרת המאיות. ב-2.47 ספרת המאיות היא 7, ולכן ${eq('2.47 ≈ 2.5')}. ב-2.43 היא 3, ולכן ${eq('2.43 ≈ 2.4')}.</p>
  ${P.figures(P.figure(P.decimalLine({ from: '2.4', to: '2.5', places: 2, labelEvery: 5, points: [{ at: '2.47' }] }), `${eq('2.47 ≈ 2.5')}`))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לחשוב שמספר ארוך יותר גדול יותר: ${eq('0.45 < 0.5')}, כי 45 מאיות הן פחות מ-50 מאיות. ועוד טעות: בעיגול לעשירית להסתכל על כל הספרות. ב-2.449 מסתכלים רק על ספרת המאיות, 4, ולכן ${eq('2.449 ≈ 2.4')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> לפני השוואה משלימים אפסים בסוף, כך שלשני המספרים אותו מספר ספרות אחרי הנקודה. אפסים בסוף לא משנים את המספר.
</div>
`;

const exercises = [
  // Easy
  extremeQ(1, 'easy', 'max', ['0.07', '0.17', '0.7', '0.071']),
  extremeQ(2, 'easy', 'min', ['0.3', '0.29', '0.31', '0.4']),
  signQ(3, 'easy', '0.5', '0.45', `בעשיריות 5 גדול מ-4: ${ltr('0.50 > 0.45')}.`),
  roundQ(4, 'easy', '3.7', 0, ['3', '3.8', '37']),
  roundQ(5, 'easy', '6.2', 0, ['7', '6.3', '62']),
  roundQ(6, 'easy', '2.47', 1, [cut('2.47', 1), '3', '2.48']),
  signQ(7, 'easy', '1.2', '1.15', `השלמים שווים, ובעשיריות 2 גדול מ-1: ${ltr('1.20 > 1.15')}.`),
  choiceQ(8, 'easy', 'איזה מספר נמצא בין 0.3 ל-0.4?', '0.35', ['0.29', '0.41', '0.5'],
    `בין 30 מאיות ל-40 מאיות: ${ltr('0.30 < 0.35 < 0.40')}.`,
    { picture: pic(P.decimalLine({ from: '0.3', to: '0.4', places: 2, labelEvery: 5, points: [{ at: '0.35' }] }), '0.35 בין 0.3 ל-0.4') }),
  lineQ(9, 'easy', '0', '1', 1, '0.6', ['0.4', '0.06', '6'], 10),
  roundQ(10, 'easy', '5.5', 0, ['5', '5.6', '55']),

  // Medium
  orderQ(11, 'medium', ['0.5', '0.45', '0.405']),
  extremeQ(12, 'medium', 'max', ['2.3', '2.29', '2.31', '2.209']),
  extremeQ(13, 'medium', 'min', ['0.8', '0.08', '0.81', '0.18']),
  roundQ(14, 'medium', '0.74', 1, ['0.8', '1', '0.75']),
  roundQ(15, 'medium', '12.38', 0, ['13', '12.4', '12.3']),
  signQ(16, 'medium', '0.7', '0.70', `אפס בסוף לא משנה את המספר: 7 עשיריות הן 70 מאיות, ולכן ${ltr('0.7 = 0.70')}.`),
  lineQ(17, 'medium', '0.4', '0.5', 2, '0.47', ['0.43', '0.407', '4.7'], 5),
  choiceQ(18, 'medium', 'איזה מספר גדול מ-0.6 וקטן מ-0.7?', '0.65', ['0.59', '0.71', '0.067'],
    `משלימים אפסים: ${ltr('0.60 < 0.65 < 0.70')}.`,
    { picture: pic(P.decimalLine({ from: '0.6', to: '0.7', places: 2, labelEvery: 5, points: [{ at: '0.65' }] }), '0.65 בין 0.6 ל-0.7') }),
  roundQ(19, 'medium', '6.05', 1, ['6', '6.5', '7']),
  extremeQ(20, 'medium', 'max', ['1.09', '1.9', '1.19', '1.099']),

  // Hard
  choiceQ(21, 'hard', 'בתחרות קפיצה דנה קפצה 3.45 מטרים, יעל 3.5 מטרים ונועה 3.405 מטרים. מי קפצה הכי רחוק?', 'יעל',
    ['דנה', 'נועה', 'שלושתן קפצו אותו מרחק'],
    `משלימים אפסים: 3.450, 3.500 ו-3.405. הגדול ביותר הוא 3.5, ולכן יעל קפצה הכי רחוק.`,
    { picture: pic(P.placeValue(['3.450', '3.500', '3.405']), 'דנה, יעל ונועה') }),
  roundQ(22, 'hard', '9.96', 1, ['9.9', '9.1', '11'], { after: ' עשירית אחת יותר מ-9.9 היא 10.0, כלומר 10.' }),
  orderQ(23, 'hard', ['2.1', '2.09', '2.19', '2.9']),
  roundQ(24, 'hard', '4.95', 0, ['4', '4.9', '6'], { text: 'מחברת עולה 4.95 שקלים. כמה שקלים היא עולה בעיגול לשלם?' }),
  choiceQ(25, 'hard', `מהי הספרה הקטנה ביותר שאפשר לכתוב במקום הריבוע, כדי ש-${ltr('0.□5')} יהיה גדול מ-0.45?`, '5', ['4', '6', '9'],
    `עם 4 מקבלים ${ltr('0.45 = 0.45')}, שאינו גדול יותר. עם 5 מקבלים ${ltr('0.55 > 0.45')}.`),
  choiceQ(26, 'hard', 'מספר עוגל לעשירית, והתקבל 3.4. איזה מספר יכול להיות המספר?', '3.44', ['3.45', '3.34', '3.49'],
    `${ltr('3.44 ≈ 3.4')}, כי ספרת המאיות 4. אבל ${ltr('3.45 ≈ 3.5')}, ${ltr('3.49 ≈ 3.5')} ו-${ltr('3.34 ≈ 3.3')}.`),
  lineQ(27, 'hard', '2.3', '2.4', 2, '2.36', ['2.34', '2.306', '2.6'], 5),
  extremeQ(28, 'hard', 'min', ['6.9', '6.85', '6.09', '6.95'],
    { text: 'מחיר ליטר חלב בארבע חנויות הוא 6.9, 6.85, 6.09 ו-6.95 שקלים. מהו המחיר הנמוך ביותר?' }),
  choiceQ(29, 'hard', 'איזה משפט נכון?', '2.1 > 2.09', ['2.1 < 2.09', '2.01 > 2.1', '2.10 = 2.01'],
    `משלימים אפס: ${ltr('2.10 > 2.09')}, כי 10 מאיות הן יותר מ-9 מאיות.`),
  roundQ(30, 'hard', '12.47', 1, ['12.4', '12', '13'], { text: 'רץ סיים מרוץ ב-12.47 שניות. מה הזמן בעיגול לעשירית שנייה?' })
];

module.exports = lesson(2, 'Comparing and Rounding Decimals', 'השוואה ועיגול של שברים עשרוניים', theory, exercises);
