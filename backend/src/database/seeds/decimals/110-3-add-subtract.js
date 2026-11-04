// 110.3 חיבור וחיסור — adding and subtracting decimals in columns with the
// points lined up: filling zeros, ten tenths make a whole, subtracting from
// a whole number, and stories about money and lengths. Numbers, wrong options
// and pictures from ./common.js.
const { ltr, P, eq, pic, str, places, add, sub, addWrongs, subWrongs, pointWrongs, decQ, choiceQ, lesson } = require('./common');

/** Both numbers (and the result) with as many digits after the point as the longest. */
const lined = (...xs) => {
  const p = Math.max(...xs.map((x) => places(str(x))));
  return xs.map((x) => str(x, p));
};

/** The column picture of a ± b = r under an explanation. */
const columnPic = (a, op, b, r, caption = 'הנקודות זו מתחת לזו') =>
  pic(P.columnCalc({ top: str(a), bottom: str(b), op, result: str(r) }), caption);

/**
 * a + b or a − b. Asked as "a + b = ?" unless `text` tells a story; the wrong
 * options are the mistakes of `addWrongs`/`subWrongs`, then `more`, then the
 * point moved. `before` opens the explanation (what the story asks).
 */
function calcQ(n, level, a, op, b, more = [], opts = {}) {
  const r = op === '+' ? add(a, b) : sub(a, b);
  const mistakes = op === '+' ? addWrongs(a, b) : subWrongs(a, b);
  const [A, B, R] = lined(a, b, r);
  const filled = A !== a || B !== b ? 'מיישרים את הנקודות ומשלימים אפסים' : 'מיישרים את הנקודות';
  const why = `${opts.before || ''}${filled}: ${ltr(`${A} ${op} ${B} = ${R}`)}${R !== str(r) ? `, כלומר ${str(r)}` : ''}.`;
  const text = opts.text || ltr(`${a} ${op} ${b} = ?`);
  return decQ(n, level, text, r, [...mistakes, ...more, ...pointWrongs(r)], why, { picture: columnPic(a, op, b, r) });
}

const theory = `
<h2>חיבור וחיסור של שברים עשרוניים</h2>

<p>מחברים ומחסרים שברים עשרוניים כמו מספרים שלמים, בטור, אבל הנקודות עומדות זו מתחת לזו: עשיריות מתחת לעשיריות, ומאיות מתחת למאיות. גם הנקודה בתוצאה עומדת באותו מקום.</p>

<div class="formula">
  <div class="formula-title">הנקודות זו מתחת לזו</div>
  <div class="formula-content">${eq('2.50 + 1.75 = 4.25')}</div>
  <div class="formula-explanation">ל-2.5 מוסיפים אפס, כדי שלשני המספרים יהיו שתי ספרות אחרי הנקודה.</div>
</div>

<h3>כלל 1: מיישרים את הנקודות</h3>
<div class="rules">
  <p>כדי לחבר ${eq('2.5 + 1.75')} כותבים את המספרים בטור, נקודה מתחת לנקודה. משלימים ל-2.5 אפס, 2.50, ומחברים כמו מספרים שלמים: ${eq('2.50 + 1.75 = 4.25')}.</p>
  ${P.figures(P.figure(P.columnCalc({ top: '2.5', bottom: '1.75', op: '+', result: '4.25' }), 'האפס הכתום הושלם'))}
</div>

<h3>כלל 2: למספר שלם יש נקודה בסוף</h3>
<div class="rules">
  <p>המספר 3 הוא 3.00. לכן ${eq('3 + 0.45 = 3.00 + 0.45 = 3.45')}. אם מחברים בלי ליישר, מקבלים טעות כמו 0.48.</p>
  ${P.figures(P.figure(P.columnCalc({ top: '3', bottom: '0.45', op: '+', result: '3.45' }), `${eq('3 = 3.00')}`))}
</div>

<h3>כלל 3: עשר עשיריות הן שלם</h3>
<div class="rules">
  <p>${eq('0.7 + 0.6')} הן 7 עשיריות ועוד 6 עשיריות, כלומר 13 עשיריות. עשר עשיריות הן שלם אחד, ולכן ${eq('0.7 + 0.6 = 1.3')}. בטור זה נראה כמו העברה רגילה: 1 עובר מעבר לנקודה.</p>
  ${P.figures(P.figure(P.row(P.hundredGrid(7, { parts: 10, extra: 3 }), P.hundredGrid(0, { parts: 10, extra: 3 })), `${eq('0.7 + 0.6 = 1.3')}: ריבוע שלם ועוד 3 עשיריות`))}
</div>

<h3>כלל 4: חיסור ממספר שלם</h3>
<div class="rules">
  <p>כדי לחסר ${eq('5 − 1.25')} כותבים את 5 כ-5.00 ופורטים: ${eq('5.00 − 1.25 = 3.75')}. בודקים בחיבור: ${eq('3.75 + 1.25 = 5')}.</p>
  ${P.figures(P.figure(P.columnCalc({ top: '5', bottom: '1.25', op: '−', result: '3.75' }), 'שני אפסים הושלמו'))}
</div>

<h3>כלל 5: כסף ומידות</h3>
<div class="rules">
  <p>מחברת עולה 12.5 ₪ ועט 3.75 ₪. ביחד: ${eq('12.50 + 3.75 = 16.25')}, כלומר 16.25 ₪. משטר של 20 ₪ העודף הוא ${eq('20 − 16.25 = 3.75')}, כלומר 3.75 ₪.</p>
  ${P.figures(
    P.figure(P.columnCalc({ top: '12.5', bottom: '3.75', op: '+', result: '16.25' }), 'המחיר'),
    P.figure(P.columnCalc({ top: '20', bottom: '16.25', op: '−', result: '3.75' }), 'העודף')
  )}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לחבר בלי ליישר את הנקודות. ${eq('2.5 + 1.75')} איננו 2.00 (כאילו 25 ועוד 175), וגם לא 3.80 (שלמים לחוד וחלקים לחוד). התשובה היא 4.25.
</div>

<div class="tip">
  <strong>טיפ:</strong> בודקים אם התשובה הגיונית: ${eq('2.5 + 1.75')} הוא קצת יותר מ-${eq('2.5 + 1.5 = 4')}, ולכן 4.25 מתאים.
</div>
`;

const exercises = [
  // Easy
  calcQ(1, 'easy', '0.3', '+', '0.4', ['0.07', '0.12']),
  calcQ(2, 'easy', '1.2', '+', '2.5', ['3.07', '0.37']),
  calcQ(3, 'easy', '0.8', '−', '0.5', ['1.3', '0.03']),
  calcQ(4, 'easy', '4.6', '−', '1.3', ['5.9', '3.03']),
  calcQ(5, 'easy', '2.5', '+', '1.75'),
  calcQ(6, 'easy', '0.25', '+', '0.5', ['0.3', '0.52']),
  calcQ(7, 'easy', '3', '+', '0.45', ['3.045', '0.75']),
  calcQ(8, 'easy', '0.7', '+', '0.6', ['0.13', '1.03']),
  calcQ(9, 'easy', '5.9', '−', '2.4', ['3.05', '8.3']),
  calcQ(10, 'easy', '3.5', '+', '2.5', ['5.1', '5'], { text: 'לדני היו 3.5 שקלים, והוא קיבל עוד 2.5 שקלים. כמה שקלים יש לו עכשיו?' }),

  // Medium
  calcQ(11, 'medium', '5', '−', '1.25', ['3.25']),
  calcQ(12, 'medium', '3.2', '−', '1.45', ['1.85']),
  calcQ(13, 'medium', '12.5', '+', '3.75', ['15.25']),
  calcQ(14, 'medium', '0.9', '+', '0.35', ['1.025']),
  calcQ(15, 'medium', '10', '−', '0.6', ['9.6']),
  calcQ(16, 'medium', '2.75', '+', '1.25', ['3.1', '4.1', '3.9']),
  calcQ(17, 'medium', '7.04', '−', '2.5', ['4.46']),
  decQ(18, 'medium', `מהו המספר החסר? ${ltr('1.6 + □ = 2')}`, sub('2', '1.6'), ['0.6', '1.4', '0.04'],
    `מחסרים: ${ltr('2.0 − 1.6 = 0.4')}. בדיקה: ${ltr('1.6 + 0.4 = 2')}.`, { picture: columnPic('2', '−', '1.6', '0.4') }),
  calcQ(19, 'medium', '1.5', '−', '0.75', ['2.25', '0.85'], { text: 'בבקבוק היו 1.5 ליטרים של מים, ושתו מהם 0.75 ליטר. כמה ליטרים נשארו בבקבוק?' }),
  decQ(20, 'medium', 'בריבוע של 100 משבצות צבועים שני חלקים, בכחול ובכתום. איזה שבר עשרוני מתאים לכל החלק הצבוע?', add('0.3', '0.25'), ['0.3', '0.25', '0.45'],
    `בכחול 30 משבצות ובכתום 25: ${ltr('0.30 + 0.25 = 0.55')}.`, { question: P.hundredGrid(30, { extra: 25 }) }),

  // Hard
  decQ(21, 'hard', 'קנינו מחברת ב-4.9 שקלים ועט ב-3.75 שקלים, ושילמנו בשטר של 20 שקלים. כמה עודף קיבלנו?', sub('20', add('4.9', '3.75')), ['8.65', '15.1', '16.25'],
    `המחיר: ${ltr('4.90 + 3.75 = 8.65')}. העודף: ${ltr('20.00 − 8.65 = 11.35')}.`, { picture: columnPic('20', '−', '8.65', '11.35', 'העודף') }),
  calcQ(22, 'hard', '5', '−', '2.35', ['7.35', '2.75'], { text: 'סכום של שני מספרים הוא 5. אחד מהם הוא 2.35. מהו המספר השני?', before: 'המספר השני הוא 5 פחות 2.35. ' }),
  decQ(23, 'hard', 'רונית רצה 2.4 ק״מ ביום ראשון, 3.75 ק״מ ביום שני ו-1.85 ק״מ ביום שלישי. כמה קילומטרים רצה בסך הכול?', add(add('2.4', '3.75'), '1.85'), ['7.9', '8.1', '9'],
    `מחברים בשני שלבים: ${ltr('2.40 + 3.75 = 6.15')}, ואחר כך ${ltr('6.15 + 1.85 = 8.00')}, כלומר 8 ק״מ.`, { picture: columnPic('6.15', '+', '1.85', '8') }),
  calcQ(24, 'hard', '0.5', '−', '0.05', ['0', '0.4']),
  decQ(25, 'hard', `מהו המספר החסר? ${ltr('□ − 2.7 = 1.45')}`, add('1.45', '2.7'), ['1.25', '3.15', '4.05'],
    `מחברים את מה שהורידו: ${ltr('1.45 + 2.70 = 4.15')}. בדיקה: ${ltr('4.15 − 2.7 = 1.45')}.`, { picture: columnPic('1.45', '+', '2.7', '4.15') }),
  calcQ(26, 'hard', '59.9', '+', '15.25', ['44.65'], { text: 'חולצה עולה 59.9 שקלים, ומכנסיים עולים 15.25 שקלים יותר מהחולצה. כמה שקלים עולים המכנסיים?' }),
  calcQ(27, 'hard', '1.48', '+', '0.2', ['1.28', '3.48'], { text: 'הגובה של יואב הוא 1.48 מטרים, ואחותו גבוהה ממנו ב-0.2 מטר. מה הגובה של אחותו במטרים?' }),
  decQ(28, 'hard', ltr('8 − 3.6 − 1.25 = ?'), sub(sub('8', '3.6'), '1.25'), ['4.4', '5.65', '2.15'],
    `משמאל לימין: ${ltr('8.0 − 3.6 = 4.4')}, ואחר כך ${ltr('4.40 − 1.25 = 3.15')}.`, { picture: columnPic('4.4', '−', '1.25', '3.15') }),
  choiceQ(29, 'hard', 'איזה תרגיל נכון?', '3 − 0.4 = 2.6', ['3 − 0.4 = 3.4', '3 − 0.4 = 0.1', '3 − 0.4 = 2.4'],
    `כותבים את 3 כ-3.0: ${ltr('3.0 − 0.4 = 2.6')}. בדיקה: ${ltr('2.6 + 0.4 = 3')}.`, { picture: columnPic('3', '−', '0.4', '2.6') }),
  decQ(30, 'hard', 'מחבל באורך 5 מטרים חתכו שתי חתיכות, של 1.8 מטר ושל 0.75 מטר. כמה מטרים נשארו מהחבל?', sub(sub('5', '1.8'), '0.75'), ['3.2', '2.55', '2.35'],
    `מחסרים בשני שלבים: ${ltr('5.0 − 1.8 = 3.2')}, ואחר כך ${ltr('3.20 − 0.75 = 2.45')}.`, { picture: columnPic('3.2', '−', '0.75', '2.45') })
];

module.exports = lesson(3, 'Adding and Subtracting Decimals', 'חיבור וחיסור של שברים עשרוניים', theory, exercises);
