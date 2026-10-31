// 100.2 חילוק – הפעולה ההפוכה לכפל — sharing, fact families, dividing with the table, special cases, checking.
const { ltr, mcq, P, pic, divide, numberQuestion, quotientWrongs, lesson } = require('./common');

const theory = `
<h2>חילוק – הפעולה ההפוכה לכפל</h2>

<p>חילוק הוא חלוקה ל<strong>קבוצות שוות</strong>. כל תרגיל חילוק בלוח הכפל מתאים לתרגיל כפל: מי שיודע ש-<span dir="ltr">3 × 4 = 12</span> יודע גם ש-<span dir="ltr">12 ÷ 3 = 4</span>.</p>

<div class="formula">
  <div class="formula-title">חילוק הופך כפל</div>
  <div class="formula-content"><span dir="ltr">12 ÷ 3 = 4</span>, כי <span dir="ltr">4 × 3 = 12</span></div>
  <div class="formula-explanation">המספר שמחלקים נקרא <strong>מחולק</strong> (12), המספר שמחלקים בו נקרא <strong>מחלק</strong> (3), והתוצאה נקראת <strong>מנה</strong> (4).</div>
</div>

<h3>כלל 1: חילוק הוא חלוקה שווה</h3>
<div class="rules">
  <p><span dir="ltr">12 ÷ 3</span>: מחלקים 12 ל-3 קבוצות שוות. בכל קבוצה יש 4, ולכן <span dir="ltr">12 ÷ 3 = 4</span>. אפשר לשאול גם אחרת: כמה קבוצות של 4 יש ב-12? שלוש.</p>
  ${P.figures(P.figure(P.groups(3, 4), '<span dir="ltr">12 ÷ 3 = 4</span>'))}
</div>

<h3>כלל 2: משפחה של ארבעה תרגילים</h3>
<div class="rules">
  <p>3 שורות של 4 נקודות נותנות ארבעה תרגילים: <span dir="ltr">3 × 4 = 12</span>, <span dir="ltr">4 × 3 = 12</span>, <span dir="ltr">12 ÷ 3 = 4</span>, <span dir="ltr">12 ÷ 4 = 3</span>.</p>
  ${P.figures(P.figure(P.array(3, 4), 'שלושה מספרים: 3, 4 ו-12'))}
</div>

<h3>כלל 3: מחלקים בעזרת לוח הכפל</h3>
<div class="rules">
  <p>כדי לחשב <span dir="ltr">56 ÷ 8</span> שואלים: איזה מספר כפול 8 נותן 56? <span dir="ltr">7 × 8 = 56</span>, ולכן <span dir="ltr">56 ÷ 8 = 7</span>.</p>
  ${P.figures(P.figure(P.array(7, 8), '<span dir="ltr">56 ÷ 8 = 7</span>: 7 שורות של 8'))}
</div>

<h3>כלל 4: מקרים מיוחדים</h3>
<div class="rules">
  <ul>
    <li>חלקי 1 – המספר עצמו: <span dir="ltr">9 ÷ 1 = 9</span>.</li>
    <li>מספר חלקי עצמו – 1: <span dir="ltr">9 ÷ 9 = 1</span>.</li>
    <li>אפס חלקי מספר – 0: <span dir="ltr">0 ÷ 9 = 0</span>.</li>
    <li>בחילוק ב-0 אין תשובה: אי אפשר לחלק ל-0 קבוצות.</li>
  </ul>
  ${P.figures(
    P.figure(P.groups(1, 9), '<span dir="ltr">9 ÷ 1 = 9</span>'),
    P.figure(P.groups(9, 1), '<span dir="ltr">9 ÷ 9 = 1</span>')
  )}
</div>

<h3>כלל 5: בודקים חילוק בכפל</h3>
<div class="rules">
  <p>חישבתם <span dir="ltr">42 ÷ 6 = 7</span>? כופלים את התשובה במחלק: <span dir="ltr">7 × 6 = 42</span>. יצא המחולק – התשובה נכונה.</p>
  ${P.figures(P.figure(P.array(6, 7), '<span dir="ltr">7 × 6 = 42</span>'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> בחילוק הסדר חשוב. <span dir="ltr">12 ÷ 3 = 4</span>, אבל <span dir="ltr">3 ÷ 12</span> הוא לא 4. ועוד טעות: לחסר במקום לחלק – <span dir="ltr">56 ÷ 8</span> הוא 7, לא 48.
</div>

<div class="tip">
  <strong>טיפ:</strong> כל חילוק הופכים לשאלת כפל: <span dir="ltr">63 ÷ 9 = ?</span> הוא בעצם <span dir="ltr">? × 9 = 63</span>, והתשובה 7.
</div>
`;

const exercises = [
  // ---------- easy: one division with ÷1, ÷2, ÷3, ÷4, ÷5, ÷10 or by itself ----------
  divide(1, 'easy', 10, 2),
  divide(2, 'easy', 20, 10),
  divide(3, 'easy', 15, 5),
  divide(4, 'easy', 8, 1),
  divide(5, 'easy', 9, 9),
  divide(6, 'easy', 12, 3),
  divide(7, 'easy', 18, 2),
  divide(8, 'easy', 40, 10),
  divide(9, 'easy', 25, 5),
  divide(10, 'easy', 16, 4),

  // ---------- medium: the harder divisions, a fact family, a missing number ----------
  divide(11, 'medium', 56, 8),
  divide(12, 'medium', 63, 9),
  divide(13, 'medium', 42, 7),
  divide(14, 'medium', 48, 8),
  divide(15, 'medium', 54, 6),
  divide(16, 'medium', 49, 7),
  divide(17, 'medium', 72, 9),
  numberQuestion(18, 'medium', `${ltr('6 × 8 = 48')}. כמה זה ${ltr('48 ÷ 6')}?`, 8, quotientWrongs(48, 6),
    `מאותה משפחה: ${ltr('6 × 8 = 48')}, ולכן ${ltr('48 ÷ 6 = 8')}.`),
  numberQuestion(19, 'medium', `איזה מספר חסר? ${ltr('? ÷ 4 = 7')}`, 28, [11, 24, 32],
    `החסר הוא המחולק, ולכן כופלים: ${ltr('7 × 4 = 28')}. בדיקה: ${ltr('28 ÷ 4 = 7')}.`),
  numberQuestion(20, 'medium', `איזה מספר חסר? ${ltr('36 ÷ ? = 9')}`, 4, [3, 5, 27],
    `חושבים: 9 כפול איזה מספר נותן 36? ${ltr('9 × 4 = 36')}, ולכן ${ltr('36 ÷ 4 = 9')}: המספר החסר הוא 4.`),

  // ---------- hard: word problems, reverse questions, traps ----------
  numberQuestion(21, 'hard', '24 סוכריות מתחלקות שווה בשווה בין 6 ילדים. כמה סוכריות יקבל כל ילד?', 4, quotientWrongs(24, 6),
    `חלוקה שווה היא חילוק: ${ltr('24 ÷ 6 = 4')}, כי ${ltr('4 × 6 = 24')}.`,
    pic(P.groups(6, 4), '6 ילדים, 4 לכל אחד')),
  numberQuestion(22, 'hard', 'בכיתה 30 תלמידים, והמורה מחלקת אותם לקבוצות של 5. כמה קבוצות יהיו?', 6, quotientWrongs(30, 5),
    `כמה קבוצות של 5 יש ב-30? ${ltr('30 ÷ 5 = 6')}, כי ${ltr('6 × 5 = 30')}.`,
    pic(P.groups(6, 5), '6 קבוצות של 5')),
  numberQuestion(23, 'hard', 'כמה פעמים נכנס 8 ב-64?', 8, quotientWrongs(64, 8),
    `${ltr('64 ÷ 8 = 8')}, כי ${ltr('8 × 8 = 64')}.`,
    pic(P.array(8, 8), '8 שורות של 8')),
  numberQuestion(24, 'hard', 'בחבילה 40 עוגיות, ושמים 10 עוגיות בכל צלחת. כמה צלחות צריך?', 4, quotientWrongs(40, 10),
    `כמה קבוצות של 10 יש ב-40? ${ltr('40 ÷ 10 = 4')}.`,
    pic(P.groups(4, 10), '4 צלחות של 10')),
  mcq(25, 'hard', 'איזה תרגיל לא נכון?', '32 ÷ 4 = 9', ['35 ÷ 5 = 7', '27 ÷ 3 = 9', '81 ÷ 9 = 9'],
    `${ltr('32 ÷ 4 = 8')}, כי ${ltr('8 × 4 = 32')}. שלושת התרגילים האחרים נכונים.`),
  divide(26, 'hard', 0, 7),
  numberQuestion(27, 'hard', 'סבתא נתנה 36 ₪ ל-4 נכדים, לחלק שווה בשווה. כמה ₪ יקבל כל נכד?', 9, quotientWrongs(36, 4),
    `חלוקה שווה: ${ltr('36 ÷ 4 = 9')} ₪, כי ${ltr('9 × 4 = 36')}.`,
    pic(P.groups(4, 9), '4 נכדים, 9 ₪ לכל אחד')),
  numberQuestion(28, 'hard', 'מספר כפול 7 הוא 63. מה המספר?', 9, quotientWrongs(63, 7),
    `הפעולה ההפוכה לכפל היא חילוק: ${ltr('63 ÷ 7 = 9')}, כי ${ltr('9 × 7 = 63')}.`),
  mcq(29, 'hard', `מה נכון על ${ltr('45 ÷ 5')} ועל ${ltr('72 ÷ 8')}?`, 'שניהם 9', ['שניהם 8', 'הראשון גדול יותר', 'השני גדול יותר'],
    `${ltr('45 ÷ 5 = 9')} ו-${ltr('72 ÷ 8 = 9')}: שניהם 9.`),
  numberQuestion(30, 'hard', 'במגדל 56 קוביות, בשורות של 7 קוביות. כמה שורות יש במגדל?', 8, quotientWrongs(56, 7),
    `כמה שורות של 7 יש ב-56? ${ltr('56 ÷ 7 = 8')}, כי ${ltr('8 × 7 = 56')}.`,
    pic(P.array(8, 7), '8 שורות של 7'))
];

module.exports = lesson(2, 'Division, the Inverse of Multiplication', 'חילוק – הפעולה ההפוכה לכפל', theory, exercises);
