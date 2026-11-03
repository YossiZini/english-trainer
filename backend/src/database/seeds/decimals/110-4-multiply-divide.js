// 110.4 כפל וחילוק — multiplying and dividing decimals: × and ÷ 10, 100,
// 1000 move every digit; a decimal times a whole number; a decimal times a
// decimal (multiply without the points, then count the digits after them);
// dividing by a whole number; dividing by a decimal (move both points).
// Numbers, wrong options and pictures from ./common.js.
const { ltr, P, eq, pic, D, str, places, digits, mul, div, shift, mulWrongs, pointWrongs, decQ, choiceQ, lesson } = require('./common');

const PLACE_WORD = { 1: 'מקום אחד', 2: 'שני מקומות', 3: 'שלושה מקומות' };

/** a × 10^k or a ÷ 10^k: every digit moves k places; the picture shows the move when the table can hold both numbers. */
function shiftQ(n, level, a, op, k, more = []) {
  const r = shift(a, op === '×' ? k : -k);
  const by = 10 ** k;
  const why = op === '×'
    ? `כופלים ב-${by}: כל ספרה זזה ${PLACE_WORD[k]} שמאלה, כאילו הנקודה זזה ${PLACE_WORD[k]} ימינה. ${ltr(`${a} × ${by} = ${str(r)}`)}.`
    : `מחלקים ב-${by}: כל ספרה זזה ${PLACE_WORD[k]} ימינה, כאילו הנקודה זזה ${PLACE_WORD[k]} שמאלה. ${ltr(`${a} ÷ ${by} = ${str(r)}`)}.`;
  // The mistakes: one place too few or too many, the wrong way, or "a zero at the end" (the number unchanged).
  const wrongs = [shift(a, op === '×' ? k - 1 : -(k - 1)), shift(a, op === '×' ? k + 1 : -(k + 1)), op === '×' ? shift(a, -k) : shift(a, k), a, ...more];
  let picture = null;
  try { picture = pic(P.placeValue([str(a), str(r)], { move: op === '×' ? k : -k }), `כל ספרה זזה ${PLACE_WORD[k]}`); } catch (e) { /* too long for the table */ }
  return decQ(n, level, ltr(`${a} ${op} ${by} = ?`), r, wrongs, why, { picture });
}

/**
 * a × b: multiply without the points, then put back as many digits after the
 * point as both factors have. The picture: an area model for two tenths,
 * equal groups for a decimal times a small whole number.
 */
function mulQ(n, level, a, b, more = [], opts = {}) {
  const r = mul(a, b);
  const k = places(a) + places(b);
  const raw = digits(a) * digits(b);
  const rawText = k ? str(D(String(raw)) / 10n ** BigInt(k), k) : String(raw);
  const count = { 1: 'ספרה אחת', 2: 'שתי ספרות', 3: 'שלוש ספרות', 4: 'ארבע ספרות' }[k];
  const why = `${opts.before || ''}כופלים בלי הנקודות: ${ltr(`${digits(a)} × ${digits(b)} = ${raw}`)}. ב-${a} וב-${b} יש ביחד ${count} אחרי הנקודה, ולכן ${ltr(`${a} × ${b} = ${rawText}`)}${rawText !== str(r) ? `, כלומר ${str(r)}` : ''}.`;
  let picture = null;
  if (places(a) === 1 && places(b) === 1 && D(a) < D('1') && D(b) < D('1')) {
    const [ta, tb] = [digits(a), digits(b)];
    picture = pic(P.grid(10, 10, tb, ta), `${tb} שורות ו-${ta} עמודות: ${ta * tb} מאיות`);
  } else if (places(b) === 0 && Number(b) <= 5 && digits(a) <= 6 && places(a) === 1) {
    picture = pic(P.groups(Number(b), digits(a)), `${b} קבוצות של ${digits(a)} עשיריות`);
  }
  return decQ(n, level, opts.text || ltr(`${a} × ${b} = ?`), r, [...mulWrongs(a, b), ...more], why, { picture });
}

/**
 * a ÷ b. By a whole number: divide as usual, the point stays in its place.
 * By a decimal: move both points as many places as b has digits after its
 * point, then divide by a whole number. Equal groups when they are few.
 */
function divQ(n, level, a, b, more = [], opts = {}) {
  const r = div(a, b);
  const k = places(b);
  let why;
  let picture = null;
  if (k === 0) {
    why = `מחלקים כמו במספרים שלמים, והנקודה נשארת במקומה: ${ltr(`${a} ÷ ${b} = ${str(r)}`)}. בדיקה: ${ltr(`${str(r)} × ${b} = ${a}`)}.`;
  } else {
    const A = str(shift(a, k)), B = str(shift(b, k));
    why = `מזיזים את הנקודה ${PLACE_WORD[k]} ימינה בשני המספרים: ${ltr(`${a} ÷ ${b} = ${A} ÷ ${B} = ${str(r)}`)}.`;
    const groupsOf = Number(B), many = Number(str(r));
    if (Number.isInteger(many) && Number.isInteger(Number(A)) && Number(A) <= 40 && many <= 10) {
      const unit = k === 1 ? 'עשיריות' : 'מאיות';
      picture = pic(P.groups(many, groupsOf), `${A} ${unit} בקבוצות של ${B}: ${many} קבוצות`);
    }
  }
  // The mistakes: only one point moved (× 10 or ÷ 10 off), or multiplying instead.
  return decQ(n, level, opts.text || ltr(`${a} ÷ ${b} = ?`), r, [...more, ...pointWrongs(r), mul(a, b)], `${opts.before || ''}${why}`, { picture });
}

const theory = `
<h2>כפל וחילוק של שברים עשרוניים</h2>

<p>בכפל ובחילוק של שברים עשרוניים לא מיישרים נקודות. מחשבים כמו במספרים שלמים, ואז קובעים איפה עומדת הנקודה. בכפל ובחילוק ב-10, ב-100 וב-1000 כל ספרה פשוט זזה למקום אחר.</p>

<div class="formula">
  <div class="formula-title">סופרים ספרות אחרי הנקודה</div>
  <div class="formula-content">${eq('0.3 × 0.2 = 0.06')}</div>
  <div class="formula-explanation">${eq('3 × 2 = 6')}, ובשני הגורמים יחד יש שתי ספרות אחרי הנקודה, ולכן 0.06.</div>
</div>

<h3>כלל 1: כפל ב-10, ב-100 וב-1000</h3>
<div class="rules">
  <p>בכפל ב-10 כל ספרה זזה מקום אחד שמאלה, לערך גדול פי 10. נראה כאילו הנקודה זזה מקום אחד ימינה: ${eq('3.45 × 10 = 34.5')}. בכפל ב-100 היא זזה שני מקומות: ${eq('3.45 × 100 = 345')}, וב-1000 שלושה: ${eq('3.45 × 1000 = 3450')}.</p>
  ${P.figures(P.figure(P.placeValue(['3.45', '34.5'], { move: 1 }), `${eq('3.45 × 10 = 34.5')}`))}
</div>

<h3>כלל 2: חילוק ב-10, ב-100 וב-1000</h3>
<div class="rules">
  <p>בחילוק כל ספרה זזה ימינה, והנקודה כאילו זזה שמאלה: ${eq('125.6 ÷ 100 = 1.256')}. כשחסרות ספרות משלימים אפסים: ${eq('4.5 ÷ 100 = 0.045')}.</p>
  ${P.figures(P.figure(P.placeValue(['125.6', '1.256'], { move: -2 }), `${eq('125.6 ÷ 100 = 1.256')}`))}
</div>

<h3>כלל 3: שבר עשרוני כפול מספר שלם</h3>
<div class="rules">
  <p>${eq('0.4 × 3')} הן שלוש קבוצות של 4 עשיריות, כלומר 12 עשיריות: ${eq('0.4 × 3 = 1.2')}. מחשבים ${eq('4 × 3 = 12')} ומחזירים ספרה אחת אחרי הנקודה.</p>
  ${P.figures(P.figure(P.groups(3, 4), 'שלוש קבוצות של 4 עשיריות: 12 עשיריות'))}
</div>

<h3>כלל 4: שבר עשרוני כפול שבר עשרוני</h3>
<div class="rules">
  <p>כופלים בלי הנקודות, ואחר כך סופרים כמה ספרות יש אחרי הנקודה בשני הגורמים יחד. ${eq('0.3 × 0.2')}: ${eq('3 × 2 = 6')}, ויש שתי ספרות אחרי הנקודה, ולכן ${eq('0.3 × 0.2 = 0.06')}. בריבוע של 100 משבצות זה החלק הכהה: 2 שורות כפול 3 עמודות, 6 משבצות.</p>
  ${P.figures(P.figure(P.grid(10, 10, 2, 3), `${eq('0.2 × 0.3 = 0.06')}: 6 משבצות כהות`))}
</div>

<h3>כלל 5: חילוק במספר שלם</h3>
<div class="rules">
  <p>מחלקים כמו במספרים שלמים, והנקודה של המנה עומדת מעל הנקודה של המחולק. ${eq('7.5 ÷ 3')}: 75 עשיריות חלקי 3 הן 25 עשיריות, ולכן ${eq('7.5 ÷ 3 = 2.5')}. בודקים: ${eq('2.5 × 3 = 7.5')}.</p>
  ${P.figures(P.figure(P.longDivision(75, 3), `${eq('75 ÷ 3 = 25')}: 25 עשיריות הן 2.5`))}
</div>

<h3>כלל 6: חילוק בשבר עשרוני</h3>
<div class="rules">
  <p>מזיזים את הנקודה ימינה, אותו מספר מקומות בשני המספרים, עד שהמחלק הוא מספר שלם. זה כמו לכפול את שניהם ב-10 או ב-100, והמנה לא משתנה: ${eq('1.2 ÷ 0.3 = 12 ÷ 3 = 4')}. כמה פעמים נכנסות 3 עשיריות ב-12 עשיריות? ארבע פעמים.</p>
  ${P.figures(P.figure(P.groups(4, 3), '12 עשיריות בקבוצות של 3: ארבע קבוצות'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לכתוב ${eq('0.3 × 0.2 = 0.6')}. סופרים את הספרות אחרי הנקודה בשני הגורמים: שתיים, ולכן 0.06. ועוד דבר מפתיע: כפל במספר קטן מ-1 מקטין: ${eq('8 × 0.5 = 4')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> מעריכים לפני שמחשבים. ${eq('3.9 × 2.1')} הוא בערך ${eq('4 × 2 = 8')}, ולכן התשובה 8.19 הגיונית, ו-81.9 לא.
</div>
`;

const exercises = [
  // Easy
  shiftQ(1, 'easy', '3.45', '×', 1),
  shiftQ(2, 'easy', '0.7', '×', 2),
  shiftQ(3, 'easy', '45.6', '÷', 1),
  shiftQ(4, 'easy', '2.5', '÷', 2),
  mulQ(5, 'easy', '0.4', '3'),
  mulQ(6, 'easy', '0.3', '0.2'),
  shiftQ(7, 'easy', '1.2', '×', 3),
  mulQ(8, 'easy', '6', '0.5', ['30', '0.3']),
  divQ(9, 'easy', '8.4', '2', ['4.02']),
  shiftQ(10, 'easy', '0.06', '×', 1),

  // Medium
  mulQ(11, 'medium', '1.5', '0.4'),
  mulQ(12, 'medium', '2.5', '1.2'),
  divQ(13, 'medium', '7.5', '3', ['2.05']),
  divQ(14, 'medium', '1.2', '0.3', ['0.4', '40']),
  divQ(15, 'medium', '4.5', '0.5', ['0.9', '90']),
  mulQ(16, 'medium', '0.25', '4', ['0.1', '10']),
  divQ(17, 'medium', '3.6', '0.04', ['9', '900']),
  mulQ(18, 'medium', '0.8', '0.8', ['6.4']),
  mulQ(19, 'medium', '6.5', '3', ['18.15', '9.5'], { text: 'קילוגרם תפוחים עולה 6.5 שקלים. כמה שקלים עולים 3 קילוגרמים?' }),
  decQ(20, 'medium', `מהו המספר החסר? ${ltr('0.45 × □ = 45')}`, div('45', '0.45'), ['10', '1000', '0.01'],
    `הספרות 4 ו-5 זזו שני מקומות שמאלה, ולכן כפלו ב-100: ${ltr('0.45 × 100 = 45')}.`,
    { picture: pic(P.placeValue(['0.45', '45'], { move: 2 }), 'כל ספרה זזה שני מקומות') }),

  // Hard
  mulQ(21, 'hard', '2.5', '38', ['76', '9.5'], { text: 'קילוגרם גבינה עולה 38 שקלים. כמה שקלים עולים 2.5 קילוגרמים?' }),
  divQ(22, 'hard', '4.8', '0.6', ['0.8', '80'], { text: 'חבל באורך 4.8 מטרים חותכים לחתיכות של 0.6 מטר. כמה חתיכות מקבלים?' }),
  divQ(23, 'hard', '13.8', '4', ['3.2'], { text: 'ארבע מחברות עולות 13.8 שקלים. כמה שקלים עולה מחברת אחת?' }),
  decQ(24, 'hard', ltr('0.2 × 0.3 × 10 = ?'), shift(mul('0.2', '0.3'), 1), ['6', '0.06', '0.006'],
    `משמאל לימין: ${ltr('0.2 × 0.3 = 0.06')}, ואחר כך ${ltr('0.06 × 10 = 0.6')}.`,
    { picture: pic(P.grid(10, 10, 3, 2), '6 משבצות הן 0.06') }),
  choiceQ(25, 'hard', 'איזה תרגיל נכון?', '0.3 × 0.3 = 0.09', ['0.3 × 0.3 = 0.9', '0.3 × 0.3 = 0.6', '0.3 × 0.3 = 9'],
    `כופלים ${ltr('3 × 3 = 9')}, ויש שתי ספרות אחרי הנקודה בשני הגורמים יחד, ולכן 0.09.`,
    { picture: pic(P.grid(10, 10, 3, 3), '9 משבצות הן 0.09') }),
  choiceQ(26, 'hard', 'בלי לחשב: איזו מכפלה קטנה מ-8?', '8 × 0.9', ['8 × 1.1', '8 × 1', '8 × 2.5'],
    `כפל במספר קטן מ-1 מקטין, ו-0.9 קטן מ-1. אכן ${ltr('8 × 0.9 = 7.2')}. כפל ב-1 לא משנה, וכפל במספר גדול מ-1 מגדיל.`),
  divQ(27, 'hard', '180', '7.2', ['2.5', '250'], { text: 'ליטר דלק עולה 7.2 שקלים. כמה ליטרים קונים ב-180 שקלים?' }),
  divQ(28, 'hard', '12', '0.25', ['3', '4.8']),
  decQ(29, 'hard', `מהו המספר החסר? ${ltr('□ ÷ 100 = 0.07')}`, shift('0.07', 2), ['0.7', '70', '0.0007'],
    `חילוק ב-100 מזיז כל ספרה שני מקומות ימינה, ולכן המספר החסר הוא ${ltr('0.07 × 100 = 7')}.`,
    { picture: pic(P.placeValue(['7', '0.07'], { move: -2 }), 'כל ספרה זזה שני מקומות ימינה') }),
  mulQ(30, 'hard', '2.5', '4.2', ['13.4', '6.7'], { text: 'מלבן שרוחבו 2.5 ס״מ ואורכו 4.2 ס״מ. מה שטח המלבן בסמ״ר?', before: 'שטח מלבן הוא אורך כפול רוחב. ' })
];

module.exports = lesson(4, 'Multiplying and Dividing Decimals', 'כפל וחילוק של שברים עשרוניים', theory, exercises);
