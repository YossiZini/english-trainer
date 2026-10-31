// 100.1 כפל עד 10×10 — equal groups, order, ×1 ×10 ×2 ×5, ×9, doubling, squares, the full table.
const { ltr, mcq, P, pic, times, numberQuestion, productWrongs, timesTable, lesson } = require('./common');

const theory = `
<h2>כפל עד 10×10</h2>

<p>כפל הוא דרך קצרה לחבר את אותו מספר כמה פעמים. במקום <span dir="ltr">4 + 4 + 4</span> כותבים <span dir="ltr">3 × 4</span>: שלוש קבוצות של 4. מי שיודע את לוח הכפל עד <span dir="ltr">10 × 10</span> בעל פה פותר מהר יותר כל תרגיל: חילוק, שברים, אחוזים ובעיות מילוליות.</p>

<div class="formula">
  <div class="formula-title">כפל הוא חיבור חוזר</div>
  <div class="formula-content"><span dir="ltr">3 × 4 = 4 + 4 + 4 = 12</span></div>
  <div class="formula-explanation">3 קבוצות של 4 הן 12. המספרים שכופלים נקראים <strong>גורמים</strong>, והתוצאה נקראת <strong>מכפלה</strong>.</div>
</div>

<h3>כלל 1: כפל הוא קבוצות שוות</h3>
<div class="rules">
  <p><span dir="ltr">3 × 4</span> הם 3 קבוצות, ובכל אחת 4. סופרים את הכול: <span dir="ltr">4 + 4 + 4 = 12</span>.</p>
  ${P.figures(P.figure(P.groups(3, 4), '<span dir="ltr">3 × 4 = 12</span>'))}
</div>

<h3>כלל 2: סדר המספרים לא משנה</h3>
<div class="rules">
  <p><span dir="ltr">3 × 4 = 4 × 3 = 12</span>: 3 שורות של 4 הן אותן 12 נקודות כמו 4 שורות של 3. לכן מספיק לזכור חצי מהלוח.</p>
  ${P.figures(
    P.figure(P.array(3, 4), '<span dir="ltr">3 × 4 = 12</span>'),
    P.figure(P.array(4, 3), '<span dir="ltr">4 × 3 = 12</span>')
  )}
</div>

<h3>כלל 3: כפול 1, כפול 10, כפול 2 וכפול 5</h3>
<div class="rules">
  <ul>
    <li>כפול 1 – המספר עצמו: <span dir="ltr">1 × 8 = 8</span>.</li>
    <li>כפול 10 – מוסיפים 0 בסוף: <span dir="ltr">10 × 8 = 80</span>.</li>
    <li>כפול 2 – פעמיים המספר: <span dir="ltr">2 × 8 = 8 + 8 = 16</span>.</li>
    <li>כפול 5 – חצי מכפול 10: <span dir="ltr">10 × 8 = 80</span>, ולכן <span dir="ltr">5 × 8 = 40</span>.</li>
  </ul>
  ${P.figures(P.figure(P.array(3, 10, { fadeCols: 5 }), '<span dir="ltr">3 × 5 = 15</span> – חצי מ-<span dir="ltr">3 × 10 = 30</span>'))}
</div>

<h3>כלל 4: כפול 9 הוא כפול 10 פחות פעם אחת</h3>
<div class="rules">
  <p>כדי לחשב <span dir="ltr">6 × 9</span> מחשבים <span dir="ltr">6 × 10 = 60</span> ומורידים 6 אחד: <span dir="ltr">60 − 6 = 54</span>.</p>
  ${P.figures(P.figure(P.array(6, 10, { fadeCols: 1 }), '<span dir="ltr">6 × 9 = 60 − 6 = 54</span>'))}
</div>

<h3>כלל 5: כפול 4 וכפול 8 בעזרת הכפלה</h3>
<div class="rules">
  <p>כפול 4 הוא כפול 2 פעמיים: <span dir="ltr">2 × 7 = 14</span>, ולכן <span dir="ltr">4 × 7 = 14 + 14 = 28</span>. כפול 8 הוא כפול 4 פעמיים: <span dir="ltr">8 × 7 = 28 + 28 = 56</span>.</p>
  ${P.figures(P.figure(P.array(4, 7, { split: 2 }), '<span dir="ltr">4 × 7 = 14 + 14 = 28</span>'))}
</div>

<h3>כלל 6: מספר כפול עצמו</h3>
<div class="rules">
  <p>כשכופלים מספר בעצמו, הנקודות יוצרות ריבוע: <span dir="ltr">6 × 6 = 36</span>. כדאי לזכור את כל הריבועים: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.</p>
  ${P.figures(P.figure(P.array(6, 6), '<span dir="ltr">6 × 6 = 36</span>'))}
</div>

<h3>לוח הכפל</h3>
<p>כל משבצת היא מספר השורה כפול מספר העמודה. הריבועים מסומנים בצהוב, על האלכסון.</p>
${timesTable()}

<div class="warning">
  <strong>טעויות נפוצות:</strong> לחבר במקום לכפול (<span dir="ltr">3 × 4</span> הוא 12, לא 7), ולהתבלבל עם עובדה שכנה: <span dir="ltr">7 × 8 = 56</span>, לא 54 (<span dir="ltr">6 × 9</span>) ולא 63 (<span dir="ltr">7 × 9</span>).
</div>

<div class="tip">
  <strong>טיפ:</strong> עובדה קשה? התחילו מעובדה קלה לידה: <span dir="ltr">7 × 8</span> הוא <span dir="ltr">7 × 10 = 70</span> פחות <span dir="ltr">7 × 2 = 14</span>, כלומר 56.
</div>
`;

const exercises = [
  // ---------- easy: one fact with ×1, ×2, ×3, ×4, ×5 or ×10 ----------
  times(1, 'easy', 3, 4),
  times(2, 'easy', 2, 8),
  times(3, 'easy', 5, 6),
  times(4, 'easy', 10, 7),
  times(5, 'easy', 1, 9),
  times(6, 'easy', 4, 5),
  times(7, 'easy', 9, 2),
  times(8, 'easy', 5, 5),
  times(9, 'easy', 3, 3),
  times(10, 'easy', 10, 4),

  // ---------- medium: the harder facts, a missing factor, the order ----------
  times(11, 'medium', 6, 7),
  times(12, 'medium', 7, 8),
  times(13, 'medium', 9, 6),
  times(14, 'medium', 8, 4),
  times(15, 'medium', 7, 7),
  times(16, 'medium', 6, 8),
  times(17, 'medium', 9, 7),
  numberQuestion(18, 'medium', `איזה מספר חסר? ${ltr('? × 7 = 28')}`, 4, [3, 5, 21],
    `חושבים: איזה מספר כפול 7 נותן 28? ${ltr('4 × 7 = 28')}, ולכן המספר החסר הוא 4.`),
  numberQuestion(19, 'medium', `איזה מספר חסר? ${ltr('8 × ? = 72')}`, 9, [8, 10, 64],
    `חושבים: 8 כפול איזה מספר נותן 72? ${ltr('8 × 9 = 72')}, ולכן המספר החסר הוא 9.`),
  numberQuestion(20, 'medium', `${ltr('4 × 9 = 36')}. כמה זה ${ltr('9 × 4')}?`, 36, productWrongs(9, 4),
    `סדר המספרים בכפל לא משנה: ${ltr('9 × 4 = 4 × 9 = 36')}.`),

  // ---------- hard: word problems, reverse questions, traps ----------
  numberQuestion(21, 'hard', 'באולם 7 שורות, ובכל שורה 8 כיסאות. כמה כיסאות יש באולם?', 56, productWrongs(7, 8),
    `קבוצות שוות כופלים: 7 שורות של 8 כיסאות, ${ltr('7 × 8 = 56')}.`,
    pic(P.array(7, 8), '7 שורות של 8')),
  numberQuestion(22, 'hard', 'בקופסת ביצים יש 6 ביצים. כמה ביצים יש ב-9 קופסאות?', 54, productWrongs(9, 6),
    `9 קופסאות של 6 ביצים: ${ltr('9 × 6 = 60 − 6 = 54')}.`,
    pic(P.groups(9, 6), '9 קופסאות של 6')),
  numberQuestion(23, 'hard', 'לנועה 4 שקיות, ובכל שקית 9 סוכריות. כמה סוכריות יש לה בסך הכול?', 36, productWrongs(4, 9),
    `4 שקיות של 9 סוכריות: ${ltr('4 × 9 = 40 − 4 = 36')}.`,
    pic(P.groups(4, 9), '4 שקיות של 9')),
  numberQuestion(24, 'hard', 'מחברת עולה 5 ₪. כמה ₪ עולות 8 מחברות?', 40, productWrongs(8, 5),
    `8 מחברות של 5 ₪: ${ltr('8 × 5 = 40')} ₪ (חצי מ-${ltr('8 × 10 = 80')}).`,
    pic(P.groups(8, 5), '8 מחברות של 5 ₪')),
  mcq(25, 'hard', 'איזה תרגיל שווה ל-24?', '3 × 8', ['4 × 5', '5 × 5', '3 × 7'],
    `${ltr('3 × 8 = 24')}. האחרים: ${ltr('4 × 5 = 20')}, ${ltr('5 × 5 = 25')}, ${ltr('3 × 7 = 21')}.`),
  mcq(26, 'hard', `מה גדול יותר: ${ltr('6 × 8')} או ${ltr('7 × 7')}?`, '7 × 7', ['6 × 8', 'הם שווים'],
    `${ltr('6 × 8 = 48')} ו-${ltr('7 × 7 = 49')}, ולכן ${ltr('7 × 7')} גדול יותר, ב-1.`),
  numberQuestion(27, 'hard', `כמה זה ${ltr('2 × 3 × 4')}?`, 24, [9, 10, 20],
    `כופלים לפי הסדר: ${ltr('2 × 3 = 6')}, ואז ${ltr('6 × 4 = 24')}. (9 הוא חיבור במקום כפל.)`),
  numberQuestion(28, 'hard', 'בשבוע יש 7 ימים. כמה ימים יש ב-6 שבועות?', 42, productWrongs(6, 7),
    `6 שבועות של 7 ימים: ${ltr('6 × 7 = 35 + 7 = 42')}.`,
    pic(P.array(6, 7), '6 שבועות של 7 ימים')),
  numberQuestion(29, 'hard', 'במגרש 5 קבוצות כדורסל, ובכל קבוצה 5 שחקנים. כמה שחקנים יש במגרש?', 25, productWrongs(5, 5),
    `5 קבוצות של 5 שחקנים: ${ltr('5 × 5 = 25')}.`,
    pic(P.groups(5, 5), '5 קבוצות של 5')),
  numberQuestion(30, 'hard', 'לכלב יש 4 רגליים. כמה רגליים יש ל-9 כלבים?', 36, productWrongs(9, 4),
    `9 כלבים של 4 רגליים: ${ltr('9 × 4 = 40 − 4 = 36')}.`,
    pic(P.groups(9, 4), '9 כלבים של 4 רגליים'))
];

module.exports = lesson(1, 'Multiplication up to 10 × 10', 'כפל עד 10×10', theory, exercises);
