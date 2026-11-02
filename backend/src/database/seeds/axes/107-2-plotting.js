// 107.2 סימון נקודות במערכת צירים — placing a point, moving a point (right
// and left change x, up and down change y), the distance along a grid line,
// the fourth corner of a rectangle, and a rectangle's sides on the grid.
const { ltr, P, S, pair, at, num, eq, QUARTERS, walk, grid, gridPic, named, pointQ, intQ, choiceQ, quarterQ, lesson } = require('./common');

const theory = `
<h2>סימון נקודות במערכת צירים</h2>

<p>כדי לסמן נקודה מתחילים תמיד בראשית הצירים: קודם הולכים לפי x ימינה או שמאלה, ואחר כך לפי y למעלה או למטה. כך אפשר גם להזיז נקודה, למדוד מרחקים על קווי המשבצות ולמצוא קודקודים של צורות.</p>

<div class="formula">
  <div class="formula-title">הזזת נקודה</div>
  <div class="formula-content">ימינה ושמאלה משנים את x, למעלה ולמטה משנים את y</div>
  <div class="formula-explanation">${eq('A(1, 2)')} זזה 3 ימינה ו-4 למטה: ${eq('(1 + 3, 2 − 4) = (4, −2)')}.</div>
</div>

<h3>כלל 1: מסמנים נקודה</h3>
<div class="rules">
  <p>כדי לסמן את ${eq('A(−2, 3)')}: מראשית הצירים הולכים 2 שמאלה על ציר ה-x, ומשם 3 למעלה. שם מסמנים נקודה וכותבים לידה A.</p>
  ${P.figures(P.figure(grid([{ x: -2, y: 3, label: 'A', guide: true }]), eq('A(−2, 3)')))}
</div>

<h3>כלל 2: מזיזים נקודה</h3>
<div class="rules">
  <p>הזזה ימינה מוסיפה ל-x, ושמאלה מחסירה מ-x. הזזה למעלה מוסיפה ל-y, ולמטה מחסירה מ-y. ${eq('A(1, 2)')} זזה 3 ימינה ו-4 למטה, ומגיעה ל-${eq('B(4, −2)')}.</p>
  ${P.figures(P.figure(grid([{ x: 1, y: 2, label: 'A' }, { x: 4, y: -2, label: 'B', color: 'b', at: 'sw' }], { lines: [{ from: [1, 2], to: [4, -2], arrow: true, color: 'b' }] }), `${eq('A(1, 2)')} עוברת ל-${eq('B(4, −2)')}`))}
</div>

<h3>כלל 3: מרחק על קו של המשבצות</h3>
<div class="rules">
  <p>לנקודות ${eq('(−3, 2)')} ו-${eq('(4, 2)')} אותו y, ולכן הן על קו אופקי אחד. המרחק ביניהן הוא ההפרש בין שיעורי ה-x: ${eq('4 − (−3) = 7')}. כשה-x שווה, הקו אנכי, ומחסרים את שיעורי ה-y.</p>
  ${P.figures(P.figure(grid([{ x: -3, y: 2, label: 'A', at: 'nw' }, { x: 4, y: 2, label: 'B' }], { lines: [{ from: [-3, 2], to: [4, 2], label: '7', labelAt: [1.5, 2] }] }), eq('AB = 4 − (−3) = 7')))}
</div>

<h3>כלל 4: קודקודים של מלבן</h3>
<div class="rules">
  <p>במלבן שצלעותיו על קווי המשבצות, לכל שני קודקודים שכנים אותו x או אותו y. ${eq('A(−3, 2)')}, ${eq('B(2, 2)')}, ${eq('C(2, −1)')}: לקודקוד הרביעי D אותו x כמו ל-A, ואותו y כמו ל-C, ולכן ${eq('D(−3, −1)')}.</p>
  ${P.figures(P.figure(grid([{ x: -3, y: 2, label: 'A', at: 'nw' }, { x: 2, y: 2, label: 'B' }, { x: 2, y: -1, label: 'C', at: 'se' }, { x: -3, y: -1, label: 'D', color: 'b', at: 'sw' }], { lines: [{ from: [-3, 2], to: [2, 2] }, { from: [2, 2], to: [2, -1] }, { from: [2, -1], to: [-3, -1], dashed: true, color: 'b' }, { from: [-3, -1], to: [-3, 2], dashed: true, color: 'b' }] }), eq('D(−3, −1)')))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> במרחק בין ${eq('(−3, 2)')} ל-${eq('(4, 2)')} לחשב "${eq('4 − 3 = 1')}". המרחק עובר דרך 0: 3 משבצות עד 0, ועוד 4 אחריו, כלומר 7.
</div>

<div class="tip">
  <strong>טיפ:</strong> אחרי שסימנתם נקודה, בדקו: האם היא ברביע הנכון לפי הסימנים של x ושל y?
</div>
`;

/** Where (x, y) gets after moving dx (right +) and dy (up +). */
const moved = (x, y, dx, dy) => [x + dx, y + dy];

/** "3 ימינה ו-4 למטה". */
const moveWords = (dx, dy) => [dx > 0 ? `${dx} ימינה` : dx < 0 ? `${-dx} שמאלה` : '', dy > 0 ? `${dy} למעלה` : dy < 0 ? `${-dy} למטה` : '']
  .filter(Boolean).join(' ו-');

/** Explaining a move: x changes by dx, y by dy. */
function explainMove(x, y, dx, dy) {
  const [nx, ny] = moved(x, y, dx, dy);
  const parts = [];
  if (dx) parts.push(`x: ${ltr(`${S(x)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${S(nx)}`)}`);
  if (dy) parts.push(`y: ${ltr(`${S(y)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${S(ny)}`)}`);
  return `${parts.join(', ')}. לכן ${at(nx, ny)}.`;
}

/** A move question: wrong options from moving the wrong way on one axis or both. */
function moveQ(n, level, [x, y], dx, dy, name = 'A') {
  const [nx, ny] = moved(x, y, dx, dy);
  return pointQ(n, level, `הנקודה ${at(x, y, name)} זזה ${moveWords(dx, dy)}. מה השיעורים החדשים שלה?`, [nx, ny], explainMove(x, y, dx, dy), {
    extra: [[x - dx, y + dy], [x + dx, y - dy], [x - dx, y - dy], [x + dy, y + dx]],
    picture: gridPic([{ x, y, label: name }, { x: nx, y: ny, label: '', color: 'b' }], at(nx, ny), { lines: [{ from: [x, y], to: [nx, ny], arrow: true, color: 'b' }] })
  });
}

/** The distance between two points on one grid line. */
function distanceQ(n, level, [x1, y1], [x2, y2]) {
  const horizontal = y1 === y2;
  const [a, b] = horizontal ? [x1, x2] : [y1, y2];
  const d = Math.abs(b - a);
  const [hi, lo] = b > a ? [b, a] : [a, b];
  const why = `${horizontal ? 'אותו y: קו אופקי, מחסרים את שיעורי ה-x' : 'אותו x: קו אנכי, מחסרים את שיעורי ה-y'}: ${ltr(`${S(hi)} − ${lo < 0 ? `(${S(lo)})` : S(lo)} = ${d}`)}.`;
  return intQ(n, level, `מה המרחק בין ${at(x1, y1)} ל-${at(x2, y2)}?`, d, [Math.abs(Math.abs(b) - Math.abs(a)), d + 1, d - 1, Math.abs(a) + Math.abs(b) + 1],
    why);
}

// Points for the picture questions.
const SET_1 = named([[3, 1], [1, 3], [-3, 1], [3, -1]]);
const SET_2 = named([[3, -2], [2, 3], [-2, 3], [-2, -3]]);
const SET_3 = named([[1, 2], [-4, -2], [-3, 3], [1, -4]]);
const SET_4 = named([[-3, -4], [-4, -3], [3, -4], [-3, 4]]);
const SET_5 = named([[-2, 1], [3, 0], [-1, -3], [2, 4]]);
const SET_6 = named([[-4, 3], [2, -1], [1, 4], [-3, -2]]);
const SET_7 = named([[-1, 2], [-3, 4], [2, 3], [-2, -1]]);

const RECT_1 = [[-3, 2], [2, 2], [2, -1]];
const SQUARE = [[-1, 1], [2, 1], [2, -2]];
const corners = (abc, extra = {}) => named(abc, { 1: {}, 2: { at: 'se' }, ...extra });
const sides = ([a, b, c]) => [{ from: a, to: b }, { from: b, to: c }];

const exercises = [
  // ---------- easy: which point, its coordinates, one move, a short distance ----------
  choiceQ(1, 'easy', `איזו נקודה היא ${at(3, 1)}?`, 'A', ['B', 'C', 'D'],
    `${walk(3, 1)}: הנקודה A. B היא ${at(1, 3)}, הסדר הפוך.`,
    { question: grid(SET_1) }),
  choiceQ(2, 'easy', `איזו נקודה היא ${at(-2, 3)}?`, 'C', ['A', 'B', 'D'],
    `${walk(-2, 3)}: הנקודה C.`,
    { question: grid(SET_2) }),
  pointQ(3, 'easy', 'מה השיעורים של הנקודה B?', [-4, -2],
    `מראשית הצירים: ${walk(-4, -2)}. לכן ${at(-4, -2, 'B')}.`,
    { question: grid(SET_3) }),
  pointQ(4, 'easy', 'מה השיעורים של הנקודה D?', [1, -4],
    `מראשית הצירים: ${walk(1, -4)}. לכן ${at(1, -4, 'D')}.`,
    { question: grid(SET_3) }),
  moveQ(5, 'easy', [2, 1], 3, 0),
  moveQ(6, 'easy', [2, 1], 0, -4),
  distanceQ(7, 'easy', [1, 2], [5, 2]),
  choiceQ(8, 'easy', 'איזו נקודה נמצאת ברביע השלישי?', 'C', ['A', 'B', 'D'],
    `ברביע השלישי x ו-y שליליים: C היא ${at(-1, -3)}.`,
    { question: grid(SET_5) }),
  choiceQ(9, 'easy', 'איזו נקודה נמצאת על ציר ה-x?', 'B', ['A', 'C', 'D'],
    `על ציר ה-x שיעור ה-y הוא 0: B היא ${at(3, 0)}.`,
    { question: grid(SET_5) }),
  moveQ(10, 'easy', [0, 0], -2, 3, 'O'),

  // ---------- medium: points close to each other, two moves, distances across 0, rectangles ----------
  choiceQ(11, 'medium', `איזו נקודה היא ${at(-3, -4)}?`, 'A', ['B', 'C', 'D'],
    `${walk(-3, -4)}: הנקודה A. B היא ${at(-4, -3)}, הסדר הפוך.`,
    { question: grid(SET_4) }),
  pointQ(12, 'medium', 'מה השיעורים של הנקודה A?', [-4, 3],
    `מראשית הצירים: ${walk(-4, 3)}. לכן ${at(-4, 3, 'A')}.`,
    { question: grid(SET_6) }),
  moveQ(13, 'medium', [-1, 3], 4, -5),
  distanceQ(14, 'medium', [-3, 2], [4, 2]),
  distanceQ(15, 'medium', [2, -4], [2, 3]),
  pointQ(16, 'medium', 'ABCD הוא מלבן. מה השיעורים של D?', [-3, -1],
    `ל-D אותו x כמו ל-A, ${num(-3)}, ואותו y כמו ל-C, ${num(-1)}: ${at(-3, -1, 'D')}.`,
    { question: grid(corners(RECT_1), { lines: sides(RECT_1) }), extra: [[-1, -3], [3, -1], [-3, 1]] }),
  pointQ(17, 'medium', 'ABCD הוא ריבוע. מה השיעורים של D?', [-1, -2],
    `ל-D אותו x כמו ל-A, ${num(-1)}, ואותו y כמו ל-C, ${num(-2)}: ${at(-1, -2, 'D')}.`,
    { question: grid(corners(SQUARE), { lines: sides(SQUARE) }), extra: [[-2, -1], [1, -2], [-1, 2]] }),
  choiceQ(18, 'medium', `הנקודות ${at(1, 3, 'A')} ו-${at(1, -2, 'B')} נמצאות על קו:`, 'אנכי', ['אופקי', 'אלכסוני', 'אי אפשר לדעת'],
    `לשתיהן אותו x, 1: הקו ביניהן עובר למעלה ולמטה, כלומר אנכי.`),
  pointQ(19, 'medium', `הנקודה B נמצאת 3 ימינה מהנקודה ${at(-4, 1, 'A')}. מה השיעורים של B?`, [-1, 1],
    `ימינה מוסיפה ל-x: ${ltr('−4 + 3 = −1')}, ו-y לא משתנה. לכן ${at(-1, 1, 'B')}.`,
    { extra: [[-7, 1], [-4, 4], [-1, 4]] }),
  intQ(20, 'medium', 'בכמה גדל שיעור ה-x מ-D ל-C?', 5, [1, -5, 3],
    `D היא ${at(-3, -2)} ו-C היא ${at(2, 3)}: ${ltr('2 − (−3) = 5')}.`,
    { question: grid(named([[-1, 2], [-3, 4], [2, 3], [-3, -2]])) }),

  // ---------- hard: area and perimeter, moving back, the middle, counting ----------
  intQ(21, 'hard', 'מה השטח של המלבן ABCD?', 20, [18, 9, 16],
    `האורך: ${ltr('3 − (−2) = 5')}. הרוחב: ${ltr('3 − (−1) = 4')}. השטח: ${ltr('5 × 4 = 20')}.`,
    { question: grid(named([[-2, 3], [3, 3], [3, -1], [-2, -1]], { 0: { at: 'nw' }, 2: { at: 'se' }, 3: { at: 'sw' } }), { lines: [{ from: [-2, 3], to: [3, 3] }, { from: [3, 3], to: [3, -1] }, { from: [3, -1], to: [-2, -1] }, { from: [-2, -1], to: [-2, 3] }] }) }),
  intQ(22, 'hard', `מה ההיקף של המלבן שקודקודיו ${at(-2, 3)}, ${at(3, 3)}, ${at(3, -1)}, ${at(-2, -1)}?`, 18, [20, 9, 14],
    `האורך: ${ltr('3 − (−2) = 5')}. הרוחב: ${ltr('3 − (−1) = 4')}. ההיקף: ${ltr('5 + 4 + 5 + 4 = 18')}.`),
  pointQ(23, 'hard', `הנקודה A זזה 3 שמאלה ו-2 למעלה, והגיעה ל-${at(1, -1)}. מאיפה היא יצאה?`, [4, -3],
    `חוזרים אחורה: 3 ימינה ו-2 למטה. x: ${ltr('1 + 3 = 4')}, y: ${ltr('−1 − 2 = −3')}. לכן ${at(4, -3, 'A')}.`,
    { extra: [[-2, 1], [4, 1], [-2, -3]] }),
  pointQ(24, 'hard', `מה הנקודה שבדיוק באמצע בין ${at(-4, 2)} ל-${at(6, 2)}?`, [1, 2],
    `אותו y, 2. המרחק בין שיעורי ה-x: ${ltr('6 − (−4) = 10')}, וחציו 5. מ-${num(-4)} הולכים 5 ימינה: ${ltr('−4 + 5 = 1')}. לכן ${at(1, 2)}.`,
    { extra: [[5, 2], [2, 2], [1, 0]] }),
  choiceQ(25, 'hard', 'איזו נקודה הכי רחוקה מציר ה-y?', 'A', ['B', 'C', 'D'],
    `המרחק מציר ה-y הוא שיעור ה-x בלי הסימן: ${at(-4, 3, 'A')} רחוקה 4, ${at(2, -1, 'B')} רחוקה 2, ${at(1, 4, 'C')} רחוקה 1 ו-${at(-3, -2, 'D')} רחוקה 3.`,
    { question: grid(SET_6) }),
  pointQ(26, 'hard', `${at(-3, -2)}, ${at(-3, 1)} ו-${at(2, 1)} הם שלושה קודקודים של מלבן. מה הקודקוד הרביעי?`, [2, -2],
    `הקודקוד הרביעי מקבל את ה-x שמופיע פעם אחת, 2, ואת ה-y שמופיע פעם אחת, ${num(-2)}: ${at(2, -2)}.`,
    { extra: [[-2, 2], [2, 2], [-2, -2]] }),
  intQ(27, 'hard', 'כמה מהנקודות נמצאות ברביע השני?', 2, [1, 3, 4],
    `ברביע השני x שלילי ו-y חיובי: ${at(-1, 2, 'A')} ו-${at(-3, 4, 'B')}. ${at(2, 3, 'C')} ברביע הראשון, ו-${at(-2, -1, 'D')} ברביע השלישי.`,
    { question: grid(SET_7) }),
  intQ(28, 'hard', `מה המרחק בין ${at(0, -5)} לבין ראשית הצירים?`, 5, [-5, 0, 10],
    `הנקודה על ציר ה-y, 5 למטה מ-${at(0, 0)}: ${ltr('0 − (−5) = 5')}.`),
  pointQ(29, 'hard', `נקודה נמצאת על ציר ה-x, 4 משמאל לנקודה ${at(1, 0)}. מה השיעורים שלה?`, [-3, 0],
    `שמאלה מחסירה מ-x: ${ltr('1 − 4 = −3')}, ועל ציר ה-x שיעור ה-y הוא 0. לכן ${at(-3, 0)}.`,
    { extra: [[5, 0], [0, -3], [-4, 0]] }),
  quarterQ(30, 'hard', `הופכים את שני השיעורים של ${at(3, -2)} לנגדיים שלהם. באיזה רביע נמצאת הנקודה החדשה?`, [-3, 2],
    `הנקודה החדשה היא ${at(-3, 2)}: x שלילי ו-y חיובי, הרביע השני.`),
];

module.exports = lesson(2, 'Plotting Points', 'סימון נקודות במערכת צירים', theory, exercises);
