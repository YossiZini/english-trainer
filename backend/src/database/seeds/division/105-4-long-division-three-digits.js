// 105.4 חילוק ארוך: מספר תלת-ספרתי — hundreds, tens, ones; two digits when
// the hundreds are too small; a zero in the quotient; a remainder and the check.
const { ltr, mcq, P, longQ, explainLong, longPicture, numberQuestion, lesson } = require('./common');

const theory = `
<h2>חילוק ארוך: מספר תלת-ספרתי</h2>

<p>אותם ארבעה צעדים, רק יותר פעמים: מחלקים את המאות, אחר כך את העשרות, ובסוף את האחדות. בכל פעם כופלים, מחסרים ומורידים את הספרה הבאה.</p>

<div class="formula">
  <div class="formula-title">כמה ספרות יהיו במנה?</div>
  <div class="formula-content">משווים את ספרת המאות למחלק</div>
  <div class="formula-explanation">אם ספרת המאות גדולה מהמחלק או שווה לו, במנה שלוש ספרות. אם היא קטנה ממנו, שתי ספרות.</div>
</div>

<h3>כלל 1: מאות, עשרות, אחדות</h3>
<div class="rules">
  <p><span dir="ltr">576 ÷ 4</span>: <span dir="ltr">5 ÷ 4 = 1</span> ושארית 1. מורידים את ה-7: <span dir="ltr">17 ÷ 4 = 4</span> ושארית 1. מורידים את ה-6: <span dir="ltr">16 ÷ 4 = 4</span>. המנה 144.</p>
  ${P.figures(P.figure(P.longDivision(576, 4), '<span dir="ltr">576 ÷ 4 = 144</span>'))}
</div>

<h3>כלל 2: ספרת המאות קטנה מהמחלק? מתחילים בשתי ספרות</h3>
<div class="rules">
  <p><span dir="ltr">256 ÷ 8</span>: הספרה 2 קטנה מ-8, ולכן אין מאות במנה. מתחילים ב-25: <span dir="ltr">25 ÷ 8 = 3</span> ושארית 1. מורידים את ה-6: <span dir="ltr">16 ÷ 8 = 2</span>. המנה 32, שתי ספרות.</p>
  ${P.figures(P.figure(P.longDivision(256, 8), '<span dir="ltr">256 ÷ 8 = 32</span>'))}
</div>

<h3>כלל 3: אפס במנה</h3>
<div class="rules">
  <p><span dir="ltr">412 ÷ 4</span>: <span dir="ltr">4 ÷ 4 = 1</span>. מורידים את ה-1: <span dir="ltr">1 ÷ 4 = 0</span>, ולכן כותבים <strong>0</strong> במנה ומורידים גם את ה-2: <span dir="ltr">12 ÷ 4 = 3</span>. המנה 103: לכל ספרה שהורדנו יש ספרה במנה.</p>
  ${P.figures(P.figure(P.longDivision(412, 4), '<span dir="ltr">412 ÷ 4 = 103</span>'))}
</div>

<h3>כלל 4: שארית, ובדיקה בכפל</h3>
<div class="rules">
  <p><span dir="ltr">749 ÷ 6</span>: <span dir="ltr">7 ÷ 6 = 1</span> ושארית 1, <span dir="ltr">14 ÷ 6 = 2</span> ושארית 2, <span dir="ltr">29 ÷ 6 = 4</span> ושארית 5. המנה 124 והשארית 5. בדיקה: <span dir="ltr">124 × 6 + 5 = 749</span>.</p>
  ${P.figures(P.figure(P.longDivision(749, 6), '<span dir="ltr">749 ÷ 6 = 124</span> ושארית 5'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לשכוח את האפס במנה. <span dir="ltr">412 ÷ 4 = 103</span>, לא 13: בבדיקה <span dir="ltr">13 × 4 = 52</span>, רחוק מאוד מ-412.
</div>

<div class="tip">
  <strong>טיפ:</strong> מעריכים לפני שמחלקים: <span dir="ltr">100 × 4 = 400</span>, ולכן <span dir="ltr">412 ÷ 4</span> קצת יותר מ-100. תשובה כמו 13 לא יכולה להיות נכונה.
</div>
`;

const exercises = [
  // ---------- easy: every digit divides on its own ----------
  longQ(1, 'easy', 248, 2),
  longQ(2, 'easy', 369, 3),
  longQ(3, 'easy', 484, 4),
  longQ(4, 'easy', 555, 5),
  longQ(5, 'easy', 642, 2),
  longQ(6, 'easy', 936, 3),
  longQ(7, 'easy', 488, 4),
  longQ(8, 'easy', 826, 2),
  longQ(9, 'easy', 699, 3),
  longQ(10, 'easy', 884, 4),

  // ---------- medium: what is left goes on, or the hundreds are too small ----------
  longQ(11, 'medium', 576, 4),
  longQ(12, 'medium', 256, 8),
  longQ(13, 'medium', 738, 6),
  longQ(14, 'medium', 945, 7),
  longQ(15, 'medium', 512, 4),
  longQ(16, 'medium', 315, 5),
  longQ(17, 'medium', 852, 6),
  longQ(18, 'medium', 672, 8),
  longQ(19, 'medium', 783, 9),
  longQ(20, 'medium', 456, 3),

  // ---------- hard: a zero in the quotient, remainders, word problems ----------
  longQ(21, 'hard', 412, 4),
  longQ(22, 'hard', 624, 6),
  longQ(23, 'hard', 840, 4),
  longQ(24, 'hard', 749, 6),
  longQ(25, 'hard', 563, 7),
  longQ(26, 'hard', 917, 3),
  numberQuestion(27, 'hard', 'בבית ספר 432 תלמידים, והם מתחלקים שווה בשווה ל-4 שכבות. כמה תלמידים בכל שכבה?', 108, [18, 107, 109],
    `${explainLong(432, 4)} מי שענה 18 שכח את האפס במנה.`, longPicture(432, 4)),
  numberQuestion(28, 'hard', 'בשנה 365 ימים, ובשבוע 7 ימים. כמה שבועות שלמים יש בשנה?', 52, [53, 51, 1],
    `${explainLong(365, 7)} שואלים על שבועות שלמים, ולכן משמיטים את השארית: 52.`, longPicture(365, 7)),
  numberQuestion(29, 'hard', '500 מטיילים עולים לרכבל, 6 בכל קרונית. כמה קרוניות צריך לכולם?', 84, [83, 85, 2],
    `${explainLong(500, 6)} גם 2 המטיילים שנשארו צריכים קרונית, ולכן מוסיפים 1: 84.`, longPicture(500, 6)),
  mcq(30, 'hard', `כמה ספרות יהיו במנה של ${ltr('245 ÷ 7')}?`, 'שתי ספרות', ['ספרה אחת', 'שלוש ספרות', 'ארבע ספרות'],
    `ספרת המאות, 2, קטנה מ-7, ולכן מתחילים ב-24 ואין מאות במנה. ${explainLong(245, 7)}`)
];

module.exports = lesson(4, 'Long Division with Three-Digit Numbers', 'חילוק ארוך: מספר תלת-ספרתי', theory, exercises);
