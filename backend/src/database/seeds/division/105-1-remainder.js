// 105.1 חילוק עם שארית — equal groups and what is left, the remainder is
// smaller than the divisor, finding the quotient with the table, remainder 0,
// checking: quotient × divisor + remainder = dividend.
const { ltr, mcq, P, pic, remainderQ, numberQuestion, lesson } = require('./common');

const theory = `
<h2>חילוק עם שארית</h2>

<p>לא כל חילוק יוצא שווה. כשמסדרים 17 עפרונות בקבוצות של 5, יוצאות 3 קבוצות, ונשארים 2 עפרונות שלא מספיקים לקבוצה נוספת. ה-2 האלה הם <strong>השארית</strong>.</p>

<div class="formula">
  <div class="formula-title">חילוק עם שארית</div>
  <div class="formula-content"><span dir="ltr">17 ÷ 5 = 3</span> ושארית 2</div>
  <div class="formula-explanation">3 היא <strong>המנה</strong>: כמה קבוצות שלמות יש. 2 היא <strong>השארית</strong>: כמה נשארו בחוץ.</div>
</div>

<h3>כלל 1: מחלקים לקבוצות שוות, ומה שלא נכנס הוא השארית</h3>
<div class="rules">
  <p>מסדרים 17 בקבוצות של 5: קבוצה ראשונה, שנייה, שלישית, ונשארו 2. לקבוצה רביעית צריך עוד 3, ולכן עוצרים: <span dir="ltr">17 ÷ 5 = 3</span> ושארית 2.</p>
  ${P.figures(P.figure(P.groups(3, 5, { leftover: 2 }), '3 קבוצות של 5, ונשארו 2'))}
</div>

<h3>כלל 2: השארית תמיד קטנה מהמחלק</h3>
<div class="rules">
  <p>אם נשארו 5 או יותר, אפשר לבנות עוד קבוצה של 5. לכן בחילוק ב-5 השארית יכולה להיות 0, 1, 2, 3 או 4, ואף פעם לא 5 או יותר.</p>
  ${P.figures(
    P.figure(P.groups(2, 5, { leftover: 7 }), '✗ נשארו 7: יש מקום לעוד קבוצה'),
    P.figure(P.groups(3, 5, { leftover: 2 }), '✓ נשארו 2: פחות מ-5')
  )}
</div>

<h3>כלל 3: מוצאים את המנה בעזרת לוח הכפל</h3>
<div class="rules">
  <p>כדי לחשב <span dir="ltr">38 ÷ 7</span> מחפשים בשורה של 7 את הכפולה הגדולה ביותר שלא עוברת את 38: <span dir="ltr">5 × 7 = 35</span>. הכפולה הבאה, 42, כבר גדולה מדי. המנה היא 5, והשארית <span dir="ltr">38 − 35 = 3</span>.</p>
  ${P.figures(P.figure(P.groups(5, 7, { leftover: 3 }), '<span dir="ltr">38 ÷ 7 = 5</span> ושארית 3'))}
</div>

<h3>כלל 4: שארית 0 – החילוק יוצא שווה</h3>
<div class="rules">
  <p><span dir="ltr">20 ÷ 5 = 4</span> ושארית 0: כל הפריטים נכנסו לקבוצות. כשהשארית היא 0 אומרים ש-20 <strong>מתחלק</strong> ב-5.</p>
  ${P.figures(P.figure(P.groups(4, 5), '<span dir="ltr">20 ÷ 5 = 4</span>, שארית 0'))}
</div>

<h3>כלל 5: בודקים: מנה × מחלק + שארית = מחולק</h3>
<div class="rules">
  <p>חישבתם <span dir="ltr">38 ÷ 7 = 5</span> ושארית 3? כופלים ומוסיפים: <span dir="ltr">5 × 7 + 3 = 38</span>. יצא המחולק, ולכן התשובה נכונה. בודקים גם שהשארית קטנה מהמחלק: 3 קטן מ-7.</p>
  ${P.figures(P.figure(P.groups(5, 7, { leftover: 3 }), '<span dir="ltr">5 × 7 + 3 = 38</span>'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> שארית גדולה מהמחלק. "<span dir="ltr">38 ÷ 7 = 4</span> ושארית 10" לא נכון, כי ב-10 נכנסת עוד קבוצה של 7. ועוד טעות: לשכוח את השארית ולכתוב רק את המנה.
</div>

<div class="tip">
  <strong>טיפ:</strong> השארית הגדולה ביותר קטנה ב-1 מהמחלק: בחילוק ב-7 היא 6, בחילוק ב-9 היא 8.
</div>
`;

const exercises = [
  // ---------- easy: divisors 2–5, a small dividend ----------
  remainderQ(1, 'easy', 7, 2),
  remainderQ(2, 'easy', 11, 3),
  remainderQ(3, 'easy', 13, 4),
  remainderQ(4, 'easy', 17, 5),
  remainderQ(5, 'easy', 9, 4),
  remainderQ(6, 'easy', 14, 3),
  remainderQ(7, 'easy', 22, 5),
  remainderQ(8, 'easy', 15, 2),
  remainderQ(9, 'easy', 20, 5),
  numberQuestion(10, 'easy', 'מסדרים 19 כדורים בקבוצות של 4. כמה כדורים נשארים בחוץ?', 3, [4, 16, 1],
    `${ltr('4 × 4 = 16')}, ונשארו ${ltr('19 − 16 = 3')}. השארית 3, קטנה מ-4.`,
    pic(P.groups(4, 4, { leftover: 3 }), '4 קבוצות של 4, ונשארו 3')),

  // ---------- medium: divisors 6–9, the remainder alone, a missing number ----------
  remainderQ(11, 'medium', 38, 7),
  remainderQ(12, 'medium', 50, 6),
  remainderQ(13, 'medium', 47, 9),
  remainderQ(14, 'medium', 60, 8),
  remainderQ(15, 'medium', 29, 6),
  remainderQ(16, 'medium', 70, 9),
  remainderQ(17, 'medium', 55, 7),
  numberQuestion(18, 'medium', `מה השארית בחילוק ${ltr('46 ÷ 8')}?`, 6, [5, 2, 40],
    `${ltr('5 × 8 = 40')}, ונשארו ${ltr('46 − 40 = 6')}. המנה 5 והשארית 6.`),
  numberQuestion(19, 'medium', `איזה מספר חסר? ${ltr('? ÷ 4 = 6')} ושארית 3`, 27, [24, 30, 13],
    `מנה × מחלק + שארית: ${ltr('6 × 4 + 3 = 27')}. בדיקה: ${ltr('27 ÷ 4 = 6')} ושארית 3.`),
  mcq(20, 'medium', 'איזה מספר מתחלק ב-6 בלי שארית?', '42', ['44', '46', '40'],
    `${ltr('7 × 6 = 42')}, ולכן ${ltr('42 ÷ 6 = 7')} ושארית 0. ב-40, 44 ו-46 נשארת שארית.`),

  // ---------- hard: reverse questions, traps, reasoning ----------
  numberQuestion(21, 'hard', 'מה השארית הגדולה ביותר שיכולה להיות בחילוק ב-8?', 7, [8, 9, 6],
    'השארית קטנה תמיד מהמחלק: עם 8 שאריות כבר יש עוד קבוצה של 8. לכן הגדולה ביותר היא 7.'),
  numberQuestion(22, 'hard', 'חילקו מספר ב-6 וקיבלו 7 ושארית 4. מה המספר?', 46, [42, 17, 45],
    `מנה × מחלק + שארית: ${ltr('7 × 6 + 4 = 46')}. מי שענה 42 שכח את השארית.`),
  remainderQ(23, 'hard', 61, 9),
  mcq(24, 'hard', 'בחילוק ב-5 יצאה שארית 4. מה תהיה השארית אם נוסיף למחולק עוד 1?', 'השארית תהיה 0',
    ['השארית תהיה 5', 'השארית תהיה 4', 'השארית תהיה 3'],
    `ארבעת הנותרים ועוד 1 הם 5, קבוצה שלמה. למשל ${ltr('19 ÷ 5 = 3')} ושארית 4, ו-${ltr('20 ÷ 5 = 4')} ושארית 0.`),
  numberQuestion(25, 'hard', 'מה המספר הקטן ביותר שצריך להוסיף ל-31 כדי שיתחלק ב-4 בלי שארית?', 1, [3, 4, 2],
    `${ltr('31 ÷ 4 = 7')} ושארית 3: לקבוצה הבאה חסר 1. ${ltr('32 ÷ 4 = 8')} בדיוק.`),
  remainderQ(26, 'hard', 83, 9),
  remainderQ(27, 'hard', 76, 8),
  numberQuestion(28, 'hard', `${ltr('? ÷ 9 = 8')} ושארית 5. מה המחולק?`, 77, [72, 85, 22],
    `מנה × מחלק + שארית: ${ltr('8 × 9 + 5 = 77')}. בדיקה: ${ltr('77 ÷ 9 = 8')} ושארית 5.`),
  mcq(29, 'hard', 'באיזה מספר 36 מתחלק בלי שארית?', '9', ['5', '7', '8'],
    `${ltr('4 × 9 = 36')}, ולכן ${ltr('36 ÷ 9 = 4')} ושארית 0. ב-5, 7 ו-8 נשארת שארית: למשל ${ltr('36 ÷ 8 = 4')} ושארית 4.`),
  numberQuestion(30, 'hard', 'כמה שאריות שונות יכולות לצאת בחילוק ב-6?', 6, [5, 7, 1],
    'השארית קטנה מ-6: היא יכולה להיות 0, 1, 2, 3, 4 או 5. אלה 6 שאריות שונות.')
];

module.exports = lesson(1, 'Division with a Remainder', 'חילוק עם שארית', theory, exercises);
