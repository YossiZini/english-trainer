// 105.3 חילוק ארוך: מספר דו-ספרתי — divide the tens, then the ones:
// divide, multiply, subtract, bring down; two digits when the first is too
// small; a remainder at the end; checking with multiplication.
const { ltr, mcq, P, longQ, explainLong, longPicture, numberQuestion, lesson } = require('./common');

const theory = `
<h2>חילוק ארוך: מספר דו-ספרתי</h2>

<p>את <span dir="ltr">72 ÷ 3</span> קשה לחשב בלוח הכפל, כי 72 גדול מ-30. מחלקים בשלבים: קודם את העשרות, ואחר כך את האחדות. כותבים את המחולק מתחת לקו, את המחלק משמאל, ואת המנה מעל הקו, ספרה מעל ספרה.</p>

<div class="formula">
  <div class="formula-title">ארבעה צעדים שחוזרים</div>
  <div class="formula-content">מחלקים, כופלים, מחסרים, מורידים</div>
  <div class="formula-explanation">חוזרים על ארבעת הצעדים עד שאין עוד ספרה להוריד. מה שנשאר בסוף הוא השארית.</div>
</div>

<h3>כלל 1: מחלקים את העשרות, ואחר כך את האחדות</h3>
<div class="rules">
  <p><span dir="ltr">72 ÷ 3</span>: מחלקים: <span dir="ltr">7 ÷ 3 = 2</span>, כותבים 2 מעל ה-7. כופלים: <span dir="ltr">2 × 3 = 6</span>. מחסרים: <span dir="ltr">7 − 6 = 1</span>. מורידים את ה-2 ומקבלים 12. שוב: <span dir="ltr">12 ÷ 3 = 4</span>, כותבים 4 מעל ה-2. המנה 24.</p>
  ${P.figures(P.figure(P.longDivision(72, 3), '<span dir="ltr">72 ÷ 3 = 24</span>'))}
</div>

<h3>כלל 2: כשהספרה הראשונה קטנה מהמחלק, לוקחים שתי ספרות</h3>
<div class="rules">
  <p><span dir="ltr">56 ÷ 7</span>: הספרה 5 קטנה מ-7, ולכן אין עשרות במנה. מחלקים את כל 56: <span dir="ltr">56 ÷ 7 = 8</span>, וכותבים 8 מעל ה-6.</p>
  ${P.figures(P.figure(P.longDivision(56, 7), '<span dir="ltr">56 ÷ 7 = 8</span>'))}
</div>

<h3>כלל 3: מה שנשאר בסוף הוא השארית</h3>
<div class="rules">
  <p><span dir="ltr">87 ÷ 4</span>: <span dir="ltr">8 ÷ 4 = 2</span>, ואין מה לחסר. מורידים את ה-7: <span dir="ltr">7 ÷ 4 = 1</span>, <span dir="ltr">7 − 4 = 3</span>. אין עוד ספרה להוריד, ולכן <span dir="ltr">87 ÷ 4 = 21</span> ושארית 3.</p>
  ${P.figures(P.figure(P.longDivision(87, 4), '<span dir="ltr">87 ÷ 4 = 21</span> ושארית 3'))}
</div>

<h3>כלל 4: בודקים בכפל</h3>
<div class="rules">
  <p>כופלים את המנה במחלק ומוסיפים את השארית: <span dir="ltr">24 × 3 = 72</span>, <span dir="ltr">21 × 4 + 3 = 87</span>. יצא המחולק, ולכן החילוק נכון.</p>
  ${P.figures(P.figure(P.longDivision(72, 3), '<span dir="ltr">24 × 3 = 72</span>'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לשכוח להוריד את הספרה הבאה, או לכתוב ספרה של המנה מעל הספרה הלא נכונה. ב-<span dir="ltr">72 ÷ 3</span> התשובה 24, לא 42 ולא 2.
</div>

<div class="tip">
  <strong>טיפ:</strong> לפני שמתחילים מעריכים: <span dir="ltr">20 × 3 = 60</span> ו-<span dir="ltr">30 × 3 = 90</span>, ולכן <span dir="ltr">72 ÷ 3</span> בין 20 ל-30.
</div>
`;

const exercises = [
  // ---------- easy: every digit divides on its own ----------
  longQ(1, 'easy', 48, 2),
  longQ(2, 'easy', 69, 3),
  longQ(3, 'easy', 84, 4),
  longQ(4, 'easy', 55, 5),
  longQ(5, 'easy', 96, 3),
  longQ(6, 'easy', 62, 2),
  longQ(7, 'easy', 88, 4),
  longQ(8, 'easy', 64, 2),
  longQ(9, 'easy', 99, 9),
  longQ(10, 'easy', 77, 7),

  // ---------- medium: what is left of the tens goes on to the ones ----------
  longQ(11, 'medium', 72, 3),
  longQ(12, 'medium', 54, 3),
  longQ(13, 'medium', 76, 4),
  longQ(14, 'medium', 90, 6),
  longQ(15, 'medium', 84, 6),
  longQ(16, 'medium', 98, 7),
  longQ(17, 'medium', 75, 5),
  longQ(18, 'medium', 96, 8),
  longQ(19, 'medium', 91, 7),
  longQ(20, 'medium', 78, 6),

  // ---------- hard: a remainder, word problems, a missing number ----------
  longQ(21, 'hard', 87, 4),
  longQ(22, 'hard', 59, 4),
  longQ(23, 'hard', 95, 6),
  longQ(24, 'hard', 79, 3),
  longQ(25, 'hard', 68, 5),
  numberQuestion(26, 'hard', 'ספרייה מסדרת 84 ספרים חדשים שווה בשווה על 6 מדפים. כמה ספרים יהיו בכל מדף?', 14, [41, 13, 15],
    explainLong(84, 6), longPicture(84, 6)),
  numberQuestion(27, 'hard', 'בחנות 96 ביצים באריזות של 8. כמה אריזות יש בחנות?', 12, [21, 11, 13],
    explainLong(96, 8), longPicture(96, 8)),
  numberQuestion(28, 'hard', `איזה מספר חסר? ${ltr('? ÷ 4 = 23')}`, 92, [82, 27, 19],
    `החסר הוא המחולק, ולכן כופלים: ${ltr('23 × 4 = 92')} (${ltr('20 × 4 = 80')} ועוד ${ltr('3 × 4 = 12')}). מי שענה 82 שכח את העשרת של ה-12.`),
  mcq(29, 'hard', 'באיזה תרגיל המנה גדולה מ-20?', '84 ÷ 4', ['72 ÷ 4', '57 ÷ 3', '95 ÷ 5'],
    `${ltr('84 ÷ 4 = 21')}. בשאר התרגילים המנה קטנה מ-20: ${ltr('72 ÷ 4 = 18')}, ${ltr('57 ÷ 3 = 19')}, ${ltr('95 ÷ 5 = 19')}.`),
  numberQuestion(30, 'hard', '70 ילדים ישנים בחדרים של 3 מיטות. כמה חדרים צריך לכל הילדים?', 24, [23, 1, 25],
    `${explainLong(70, 3)} גם הילד שנשאר צריך מיטה, ולכן מוסיפים חדר: 24.`, longPicture(70, 3))
];

module.exports = lesson(3, 'Long Division with Two-Digit Numbers', 'חילוק ארוך: מספר דו-ספרתי', theory, exercises);
