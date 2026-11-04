// 111.3 פרופורציה — two equal ratios: checking with the product of the outer
// and the inner terms, a missing term by "how many times" and by an equation
// (chapter 11), unit price, recipes and map scale.
// Terms, wrong options and pictures from ./common.js.
const { ltr, P, eq, ratio, same, missing, numQ, choiceQ, tablePic, lesson } = require('./common');

const show = (v) => (v === null ? 'x' : v);

/**
 * "Find x: a:b = c:d" (one term null). The explanation: the product of the
 * outer terms equals the product of the inner ones, an equation in x.
 */
function propQ(n, level, terms, more = []) {
  const [a, b, c, d] = terms;
  const x = missing(a, b, c, d);
  const i = terms.indexOf(null);
  const outer = `${show(a)} × ${show(d)}`;
  const inner = `${show(b)} × ${show(c)}`;
  // The x side: x times its partner across; the number side: the other product.
  const k = { 0: d, 3: a, 1: c, 2: b }[i];
  const p = i === 0 || i === 3 ? b * c : a * d;
  const solved = k === 1 ? `כלומר ${ltr(`x = ${p}`)}` : `כלומר ${ltr(`${k}x = ${p}`)}, ולכן ${ltr(`x = ${p} ÷ ${k} = ${x}`)}`;
  const why = `מכפלת הקיצוניים שווה למכפלת האמצעיים: ${ltr(`${outer} = ${inner}`)}, ${solved}.`;
  // The mistakes: adding instead of multiplying, the known ratio read the
  // other way round, and the product not divided.
  const full = terms.map((t) => (t === null ? x : t));
  const added = { 0: c - (d - b), 1: d - (c - a), 2: a + (d - b), 3: b + (c - a) }[i];
  const backwards = i >= 2 ? (b * a ? (i === 2 ? b * d / a : a * c / b) : null) : (i === 0 ? d * b / c : c * a / d);
  const picture = tablePic({ heads: ['', ''], cols: [[show(a), show(b)], [show(c), show(d)]] }, `${eq(ratio(...full.slice(0, 2)))} שווה ל-${eq(ratio(...full.slice(2)))}`);
  return numQ(n, level, `מצאו את x: ${ltr(`${ratio(show(a), show(b))} = ${ratio(show(c), show(d))}`)}`, x, [...more, added, backwards, p, x + 1, x - 1], why, { picture });
}

/** "Is a:b = c:d?" — yes when the products of the outer and inner terms are equal. */
function isPropQ(n, level, a, b, c, d) {
  const yes = same([a, b], [c, d]);
  const why = `מכפלת הקיצוניים ${ltr(`${a} × ${d} = ${a * d}`)}, ומכפלת האמצעיים ${ltr(`${b} × ${c} = ${b * c}`)}. ${yes ? 'הן שוות, ולכן כן.' : 'הן לא שוות, ולכן לא.'}`;
  return choiceQ(n, level, `האם ${ltr(`${ratio(a, b)} = ${ratio(c, d)}`)}?`, yes ? 'כן' : 'לא', [yes ? 'לא' : 'כן', 'אי אפשר לדעת'], why);
}

/** A ratio table of a story: the given pair, one unit, and the asked pair. */
const storyTable = (heads, cols, steps, caption) => tablePic({ heads, cols, steps }, caption);

const theory = `
<h2>פרופורציה: יחסים שווים ואיבר חסר</h2>

<p>פרופורציה היא שוויון בין שני יחסים, כמו ${eq('3:4 = 6:8')}. בעזרתה מוצאים כמות חסרה: מחיר של כמה מחברות, כמות קמח למתכון גדול יותר, או מרחק לפי מפה.</p>

<div class="formula">
  <div class="formula-title">מכפלת הקיצוניים שווה למכפלת האמצעיים</div>
  <div class="formula-content">${eq('3:4 = 6:8')} &nbsp; ${eq('3 × 8 = 4 × 6')}</div>
  <div class="formula-explanation">3 ו-8 הם האיברים הקיצוניים, 4 ו-6 האמצעיים. בפרופורציה שתי המכפלות שוות.</div>
</div>

<h3>כלל 1: יחסים שווים</h3>
<div class="rules">
  <p>כופלים את שני האיברים של יחס באותו מספר ומקבלים יחס שווה: ${eq('3:4 = 6:8 = 12:16')}. כל שני יחסים כאלה הם פרופורציה.</p>
  ${P.figures(P.figure(P.ratioTable({ heads: ['קמח', 'סוכר'], cols: [[3, 4], [6, 8], [12, 16]], steps: ['× 2', '× 2'] }), `${eq('3:4 = 6:8 = 12:16')}`))}
</div>

<h3>כלל 2: בודקים בכפל בהצלבה</h3>
<div class="rules">
  <p>האם ${eq('3:4 = 6:8')}? מכפלת הקיצוניים ${eq('3 × 8 = 24')}, ומכפלת האמצעיים ${eq('4 × 6 = 24')}. הן שוות, ולכן זו פרופורציה. ב-${eq('3:4')} מול ${eq('5:6')} המכפלות 18 ו-20, ואין פרופורציה.</p>
  ${P.figures(P.figure(P.ratioTable({ heads: ['', ''], cols: [[3, 4], [6, 8]] }), `${eq('3 × 8 = 4 × 6')}`))}
</div>

<h3>כלל 3: איבר חסר: פי כמה?</h3>
<div class="rules">
  <p>ב-${eq('3:4 = x:12')} המספר 12 גדול פי 3 מ-4, כי ${eq('12 ÷ 4 = 3')}. לכן גם x גדול פי 3 מ-3: ${eq('x = 3 × 3 = 9')}.</p>
  ${P.figures(P.figure(P.ratioTable({ heads: ['', ''], cols: [[3, 4], ['x', 12]], steps: ['× 3'] }), `${eq('x = 3 × 3 = 9')}`))}
</div>

<h3>כלל 4: איבר חסר במשוואה</h3>
<div class="rules">
  <p>כשאין פי שלם, פותרים משוואה. ב-${eq('6:8 = x:12')}: ${eq('6 × 12 = 8 × x')}, כלומר ${eq('8x = 72')}, ומחלקים ב-8: ${eq('x = 9')}. זו משוואה כמו בפרק של המשוואות.</p>
  ${P.figures(P.figure(P.balance({ left: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'], right: [72] }), `${eq('8x = 72')}`))}
</div>

<h3>כלל 5: מחיר ליחידה</h3>
<div class="rules">
  <p>3 מחברות עולות 12 שקלים. מחברת אחת עולה ${eq('12 ÷ 3 = 4')} שקלים, ולכן 5 מחברות עולות ${eq('5 × 4 = 20')} שקלים. בטבלה עוברים דרך יחידה אחת.</p>
  ${P.figures(P.figure(P.ratioTable({ heads: ['מחברות', 'שקלים'], cols: [[3, 12], [1, 4], [5, 20]], steps: ['÷ 3', '× 5'] }), 'דרך מחברת אחת'))}
</div>

<h3>כלל 6: מתכון וקנה מידה</h3>
<div class="rules">
  <p>מתכון ל-4 אנשים צריך 200 גרם קמח. לאדם אחד ${eq('200 ÷ 4 = 50')} גרם, ול-6 אנשים ${eq('6 × 50 = 300')} גרם. כך גם במפה: אם ס״מ אחד הוא 5 ק״מ, אז 7 ס״מ הם ${eq('7 × 5 = 35')} ק״מ.</p>
  ${P.figures(P.figure(P.ratioTable({ heads: ['אנשים', 'גרם'], cols: [[4, 200], [1, 50], [6, 300]], steps: ['÷ 4', '× 6'] }), 'דרך אדם אחד'))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> להוסיף במקום לכפול. מ-${eq('3:4')} ל-${eq('x:12')} עוברים בכפל ב-3, לא בהוספה של 8, ולכן x הוא 9 ולא 11.
</div>

<div class="tip">
  <strong>טיפ:</strong> בסוף בודקים: מציבים את התשובה ובודקים שמכפלת הקיצוניים שווה למכפלת האמצעיים.
</div>
`;

const exercises = [
  // Easy
  propQ(1, 'easy', [3, 4, null, 12]),
  propQ(2, 'easy', [2, 5, 4, null]),
  propQ(3, 'easy', [1, 3, 5, null]),
  isPropQ(4, 'easy', 2, 3, 4, 6),
  isPropQ(5, 'easy', 3, 4, 5, 6),
  numQ(6, 'easy', '3 מחברות עולות 12 שקלים. כמה שקלים עולה מחברת אחת?', 4, [36, 9, 15],
    `מחלקים את המחיר במספר המחברות: ${ltr('12 ÷ 3 = 4')}.`,
    { picture: storyTable(['מחברות', 'שקלים'], [[3, 12], [1, 4]], ['÷ 3'], 'מחברת אחת') }),
  numQ(7, 'easy', '3 מחברות עולות 12 שקלים. כמה שקלים עולות 5 מחברות?', 20, [14, 60, 15],
    `מחברת אחת ${ltr('12 ÷ 3 = 4')}, ו-5 מחברות ${ltr('5 × 4 = 20')}.`,
    { picture: storyTable(['מחברות', 'שקלים'], [[3, 12], [1, 4], [5, 20]], ['÷ 3', '× 5'], 'דרך מחברת אחת') }),
  propQ(8, 'easy', [null, 10, 3, 5], [8]),
  numQ(9, 'easy', 'לפי הטבלה, כמה שקלים עולות 6 מחברות?', 30, [14, 12, 60],
    `6 מחברות הן פי 3 מ-2 מחברות, ולכן גם המחיר פי 3: ${ltr('3 × 10 = 30')}.`,
    { question: P.ratioTable({ heads: ['מחברות', 'שקלים'], cols: [[2, 10], [6, 'x']] }) }),
  propQ(10, 'easy', [5, 2, 15, null]),

  // Medium
  numQ(11, 'medium', 'מתכון ל-4 אנשים צריך 200 גרם קמח. כמה גרם קמח צריך ל-6 אנשים?', 300, [202, 1200, 250],
    `לאדם אחד ${ltr('200 ÷ 4 = 50')} גרם, ול-6 אנשים ${ltr('6 × 50 = 300')} גרם.`,
    { picture: storyTable(['אנשים', 'גרם'], [[4, 200], [1, 50], [6, 300]], ['÷ 4', '× 6'], 'דרך אדם אחד') }),
  numQ(12, 'medium', 'מכונית נוסעת 180 ק״מ ב-2 שעות, באותה מהירות כל הזמן. כמה ק״מ תיסע ב-5 שעות?', 450, [183, 900, 360],
    `בשעה אחת ${ltr('180 ÷ 2 = 90')} ק״מ, וב-5 שעות ${ltr('5 × 90 = 450')} ק״מ.`,
    { picture: storyTable(['שעות', 'ק״מ'], [[2, 180], [1, 90], [5, 450]], ['÷ 2', '× 5'], 'דרך שעה אחת') }),
  propQ(13, 'medium', [4, null, 6, 9], [7]),
  propQ(14, 'medium', [null, 8, 15, 24]),
  propQ(15, 'medium', [6, 9, 10, null], [13]),
  isPropQ(16, 'medium', 4, 6, 10, 15),
  isPropQ(17, 'medium', 5, 8, 10, 15),
  numQ(18, 'medium', '5 עטים עולים 15 שקלים. כמה עטים קונים ב-27 שקלים?', 9, [17, 3, 81],
    `עט אחד עולה ${ltr('15 ÷ 5 = 3')} שקלים, וב-27 שקלים קונים ${ltr('27 ÷ 3 = 9')} עטים.`,
    { picture: storyTable(['עטים', 'שקלים'], [[5, 15], [1, 3], [9, 27]], ['÷ 5', '× 9'], 'דרך עט אחד') }),
  numQ(19, 'medium', 'לפי הטבלה, כמה גרם צריך ל-10 אנשים?', 500, [206, 2000, 800],
    `לאדם אחד ${ltr('200 ÷ 4 = 50')} גרם, ול-10 אנשים ${ltr('10 × 50 = 500')} גרם.`,
    { question: P.ratioTable({ heads: ['אנשים', 'גרם'], cols: [[4, 200], [10, 'x']] }) }),
  numQ(20, 'medium', 'במפה ס״מ אחד הוא 5 ק״מ במציאות. כמה ק״מ במציאות הם 7 ס״מ במפה?', 35, [12, 7, 5],
    `כל ס״מ הוא 5 ק״מ: ${ltr('7 × 5 = 35')}.`,
    { picture: storyTable(['ס״מ במפה', 'ק״מ'], [[1, 5], [7, 35]], ['× 7'], 'פי 7') }),

  // Hard
  propQ(21, 'hard', [12, null, 18, 15], [9]),
  numQ(22, 'hard', `מצאו את x: ${ltr('2.5:4 = 5:x')}`, 8, [10, 2, 20],
    `5 הוא פי 2 מ-2.5, ולכן x הוא פי 2 מ-4: ${ltr('x = 2 × 4 = 8')}. בדיקה: ${ltr('2.5 × 8 = 4 × 5')}.`),
  numQ(23, 'hard', 'ברז ממלא 30 ליטרים ב-6 דקות. בכמה דקות ימלא 75 ליטרים?', 15, [51, 30, 375],
    `בדקה אחת ${ltr('30 ÷ 6 = 5')} ליטרים, ו-75 ליטרים ימלא ב-${ltr('75 ÷ 5 = 15')} דקות.`,
    { picture: storyTable(['דקות', 'ליטרים'], [[6, 30], [1, 5], [15, 75]], ['÷ 6', '× 15'], 'דרך דקה אחת') }),
  propQ(24, 'hard', [null, 6, 6, 9]),
  numQ(25, 'hard', 'במתכון 3 ביצים לכל 2 כוסות קמח. כמה ביצים צריך ל-8 כוסות קמח?', 12, [9, 16, 6],
    `8 כוסות הן פי 4 מ-2 כוסות, ולכן גם הביצים פי 4: ${ltr('4 × 3 = 12')}.`,
    { picture: storyTable(['ביצים', 'כוסות קמח'], [[3, 2], [12, 8]], ['× 4'], 'פי 4') }),
  choiceQ(26, 'hard', `האם ${ltr('1.5:2 = 3:4')}?`, 'כן', ['לא', 'אי אפשר לדעת'],
    `מכפלת הקיצוניים ${ltr('1.5 × 4 = 6')}, ומכפלת האמצעיים ${ltr('2 × 3 = 6')}. הן שוות, ולכן כן.`),
  numQ(27, 'hard', '4 ק״ג תפוחים עולים 26 שקלים. כמה שקלים עולים 6 ק״ג תפוחים?', 39, [28, 156, 32],
    `קילו אחד עולה ${ltr('26 ÷ 4 = 6.5')} שקלים, ו-6 ק״ג עולים ${ltr('6 × 6.5 = 39')} שקלים.`,
    { picture: storyTable(['ק״ג', 'שקלים'], [[4, 26], [2, 13], [6, 39]], ['÷ 2', '× 3'], 'דרך 2 ק״ג') }),
  numQ(28, 'hard', 'בכיתה היחס בין מספר הבנים למספר הבנות הוא 4:5. בכיתה 16 בנים. כמה בנות בכיתה?', 20, [17, 9, 36],
    `16 הוא פי 4 מ-4, ולכן מספר הבנות פי 4 מ-5: ${ltr('4 × 5 = 20')}. בדיקה: ${ltr('16:20 = 4:5')}.`,
    { picture: storyTable(['בנים', 'בנות'], [[4, 5], [16, 20]], ['× 4'], 'פי 4') }),
  choiceQ(29, 'hard', 'איזו פרופורציה נכונה?', '2:3 = 8:12', ['2:3 = 4:5', '2:3 = 3:2', '2:3 = 6:8'],
    `בודקים בכפל בהצלבה: ${ltr('2 × 12 = 24')} וגם ${ltr('3 × 8 = 24')}, ולכן ${ltr('2:3 = 8:12')}. בשאר המכפלות שונות.`),
  numQ(30, 'hard', 'מכונה ממלאת 120 בקבוקים ב-8 דקות. כמה בקבוקים תמלא ב-20 דקות?', 300, [132, 960, 240],
    `בדקה אחת ${ltr('120 ÷ 8 = 15')} בקבוקים, וב-20 דקות ${ltr('20 × 15 = 300')}.`,
    { picture: storyTable(['דקות', 'בקבוקים'], [[8, 120], [1, 15], [20, 300]], ['÷ 8', '× 20'], 'דרך דקה אחת') })
];

module.exports = lesson(3, 'Proportion and a Missing Term', 'פרופורציה: יחסים שווים ואיבר חסר', theory, exercises);
