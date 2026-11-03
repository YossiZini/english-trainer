// 109.7 מסיפור למשוואה — word problems in four steps: choose what x is (and
// write every other amount with it), write the equation, solve, check in the
// story and answer what was asked. Questions: which expression or equation
// fits a story (options with x), and stories to solve (ages, money, sharing,
// perimeter, consecutive numbers, tickets).
const { ltr, S, eq, solve, at, numQ, choiceQ, balFig, lesson, P, steps } = require('./common');
// Equation and expression options are glued (U+00A0), so the right answer never breaks across lines.
const { glue } = require('../multiplication/common');

const theory = `
<h2>מסיפור למשוואה</h2>

<p>בבעיה מילולית המשוואה מסתתרת בסיפור. פותרים אותה בארבעה צעדים: בוחרים מה x, כותבים משוואה, פותרים, ובודקים בסיפור. נראה אותם על הסיפור הזה: דנה גדולה מאחיה ב-4 שנים, ויחד הגילים שלהם 20. בן כמה האח?</p>

<div class="formula">
  <div class="formula-title">ארבעה צעדים</div>
  <div class="formula-content">${eq('x + x + 4 = 20')}</div>
  <div class="formula-explanation">בוחרים מה x, כותבים משוואה, פותרים, ובודקים בסיפור.</div>
</div>

<h3>כלל 1: בוחרים מה x</h3>
<div class="rules">
  <p>שאלו על גיל האח, ולכן נסמן ב-x את גיל האח. את שאר הכמויות כותבים בעזרת x: דנה גדולה ממנו ב-4, ולכן היא בת ${eq('x + 4')}. על המאזניים דנה היא שקית: קופסה ועוד 4 קוביות, וכף השקית כבדה יותר.</p>
  ${P.figures(balFig({ left: ['x'], right: [{ bag: ['x', { units: 4 }] }], tilt: 'right' }, `האח ${eq('x')}, דנה ${eq('x + 4')}`))}
</div>

<h3>כלל 2: כותבים משוואה</h3>
<div class="rules">
  <p>מתרגמים את המילים: גדול ב-4 הוא ${eq('x + 4')}, קטן ב-4 הוא ${eq('x − 4')}, פי 3 הוא ${eq('3x')}, חצי הוא ${eq('x ÷ 2')}, ויחד פירושו מחברים. הגילים יחד הם 20, ולכן ${eq('x + x + 4 = 20')}.</p>
  ${P.figures(balFig({ left: ['x', { bag: ['x', { units: 4 }] }], right: [20] }, `יחד 20: ${eq('x + x + 4 = 20')}`))}
</div>

<h3>כלל 3: פותרים</h3>
<div class="rules">
  <p>פותרים כמו בשיעורים הקודמים. מכנסים: ${eq('2x + 4 = 20')}. מורידים 4 משני האגפים: ${eq('2x = 16')}. מחלקים ב-2: ${eq('x = 8')}.</p>
  ${P.figures(
    balFig({ left: ['x', 'x', { units: 4, crossed: true }], right: [{ units: 16 }, { units: 4, crossed: true }] }, `מורידים 4: ${eq('2x = 16')}`),
    balFig({ left: ['x', 'x'], right: [{ units: 16 }], groups: { left: 2, right: 2 } }, `שתי קבוצות: ${eq('x = 8')}`))}
</div>

<h3>כלל 4: בודקים בסיפור</h3>
<div class="rules">
  <p>בודקים במילים של הסיפור, לא רק במשוואה: האח בן 8 ודנה בת 12. היא גדולה ממנו ב-4, ויחד ${eq('8 + 12 = 20')}. הסיפור מתקיים.</p>
  ${P.figures(balFig({ left: [8, 12], right: [20] }, 'האח 8 ודנה 12: יחד 20'))}
</div>

<h3>כלל 5: עונים על מה ששאלו</h3>
<div class="rules">
  <p>שאלו בן כמה האח, ולכן התשובה 8. אילו שאלו בת כמה דנה, התשובה הייתה ${eq('x + 4 = 12')}, ולא 8. בסוף קוראים שוב את השאלה.</p>
  ${P.figures(balFig({ left: [{ bag: [8, { units: 4 }] }], right: [12] }, `דנה: ${eq('8 + 4 = 12')}`))}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לבדוק רק במשוואה. אם המשוואה עצמה לא מתאימה לסיפור, הבדיקה בה תצליח, והתשובה בכל זאת תהיה שגויה. ועוד טעות: לענות x כששאלו על כמות אחרת.
</div>

<div class="tip">
  <strong>טיפ:</strong> לפני שכותבים משוואה, נסו מספר לדוגמה. אם האח בן 5, דנה בת 9, ויחד 14, לא 20. כך רואים מה מחברים למה.
</div>
`;

// ---------------------------------------------------------------- stories
// A story: its text, what x stands for, how the other amounts are written
// with x (`say`), the equation as written (`written`, its sides `l` and `r`
// after `arrange`), the check in its words, the questions it can ask (each
// with what it asks as a·x + b, and how to name the answer), and equations
// a student writes by mistake (`wrongs`), each with another solution.

const story = (o) => o;

const ageSum = (name, d, s) => story({
  text: `${name} גדולה מאחיה ב-${d} שנים, ויחד הגילים שלהם ${s}.`,
  x: 'גיל האח',
  say: `${name} בת ${ltr(`x + ${d}`)}`,
  written: `x + x + ${d} = ${s}`, l: [2, d], r: [0, s],
  arrange: `מכנסים: ${ltr('x + x = 2x')}, ומקבלים ${ltr(`2x + ${d} = ${s}`)}.`,
  check: (x) => `האח בן ${x} ו${name} בת ${x + d}: היא גדולה ממנו ב-${d}, ויחד ${ltr(`${x} + ${x + d} = ${s}`)}.`,
  asks: { brother: ['בן כמה האח?', [1, 0], 'האח', (v) => `האח בן ${v}`], sister: [`בת כמה ${name}?`, [1, d], name] },
  wrongs: [`x + ${d} = ${s}`, `x + x − ${d} = ${s}`, `${d}x = ${s}`],
});

const momAge = (k, s) => story({
  text: `אמא גדולה פי ${k} מבתה, ויחד הגילים שלהן ${s}.`,
  x: 'גיל הבת',
  say: `אמא בת ${ltr(`${k}x`)}`,
  written: `${k}x + x = ${s}`, l: [k + 1, 0], r: [0, s],
  arrange: `מכנסים: ${ltr(`${k}x + x = ${k + 1}x`)}, ומקבלים ${ltr(`${k + 1}x = ${s}`)}.`,
  check: (x) => `הבת בת ${x} ואמא בת ${k * x}: פי ${k} ממנה, ויחד ${ltr(`${x} + ${k * x} = ${s}`)}.`,
  asks: { daughter: ['בת כמה הבת?', [1, 0], 'הבת', (v) => `הבת בת ${v}`], mom: ['בת כמה אמא?', [k, 0], 'אמא'] },
  wrongs: [`${k}x = ${s}`, `x + ${k} = ${s}`, `x ÷ ${k} + x = ${s}`],
});

const futureAge = (a, b, k) => story({
  text: `אבא בן ${a} ובנו בן ${b}.`,
  whichAsk: `בעוד כמה שנים יהיה האבא גדול פי ${k} מבנו?`,
  x: 'מספר השנים',
  say: `בעוד x שנים האבא יהיה בן ${ltr(`${a} + x`)} והבן בן ${ltr(`${b} + x`)}`,
  written: `${a} + x = ${k}(${b} + x)`, l: [1, a], r: [k, k * b],
  arrange: `פותחים סוגריים: ${ltr(`${k}(${b} + x) = ${k * b} + ${k}x`)}, ומקבלים ${ltr(`x + ${a} = ${k}x + ${k * b}`)}.`,
  check: (x) => `בעוד ${x} שנים האבא יהיה בן ${a + x} והבן בן ${b + x}, ו-${ltr(`${b + x} × ${k} = ${a + x}`)}.`,
  asks: { years: [`בעוד כמה שנים יהיה האבא גדול פי ${k} מבנו?`, [1, 0], 'מספר השנים', (v) => `בעוד ${v} שנים`] },
  wrongs: [`${a} + x = ${k} × ${b}`, `${a} = ${k}(${b} + x)`, `${k}(${a} + x) = ${b} + x`],
});

const moneyLeft = (name, a, k, items, item, r, fem = false) => story({
  text: `ל${name} היו ${a} שקלים. הוא קנה ${k} ${items} במחיר זהה, ונשארו לו ${r} שקלים.`,
  x: `המחיר של ${item} ${fem ? 'אחת' : 'אחד'}`,
  say: `${k} ${items} ${fem ? 'עולות' : 'עולים'} ${ltr(`${k}x`)}, ומה ששילם ועוד מה שנשאר הם ${a}`,
  written: `${k}x + ${r} = ${a}`, l: [k, r], r: [0, a],
  arrange: '',
  check: (x) => `${k} ${items} ב-${x} שקלים ${fem ? 'עולות' : 'עולים'} ${ltr(`${k} × ${x} = ${k * x}`)}, ונשארים ${ltr(`${a} − ${k * x} = ${r}`)}.`,
  asks: { price: [`כמה עלה כל ${item}?`, [1, 0], `${item} ${fem ? 'אחת' : 'אחד'}`, (v) => `כל ${item} ${fem ? 'עלתה' : 'עלה'} ${v} שקלים`], total: [`כמה שילם ${name} על כל ה${items}?`, [k, 0], `כל ה${items}`] },
  wrongs: [`${k}x − ${r} = ${a}`, `x + ${r} = ${a}`, `${k}x = ${a}`],
});

const shareDiff = (s, d) => story({
  text: `שני אחים חילקו ביניהם ${s} שקלים. הגדול קיבל ${d} שקלים יותר מהקטן.`,
  x: 'מה שקיבל הקטן',
  say: `הגדול קיבל ${ltr(`x + ${d}`)}`,
  written: `x + x + ${d} = ${s}`, l: [2, d], r: [0, s],
  arrange: `מכנסים: ${ltr('x + x = 2x')}, ומקבלים ${ltr(`2x + ${d} = ${s}`)}.`,
  check: (x) => `הקטן קיבל ${x} והגדול ${x + d}: יותר ב-${d}, ויחד ${ltr(`${x} + ${x + d} = ${s}`)}.`,
  asks: { small: ['כמה קיבל הקטן?', [1, 0], 'הקטן', (v) => `הקטן קיבל ${v} שקלים`], big: ['כמה קיבל הגדול?', [1, d], 'הגדול'] },
  wrongs: [`x + ${d} = ${s}`, `x + x = ${s} + ${d}`, `${d}x = ${s}`],
});

const shareTimes = (s, k) => story({
  text: `${s} גולות חולקו בין רון לגיל, ולרון יש פי ${k} יותר גולות מאשר לגיל.`,
  x: 'מספר הגולות של גיל',
  say: `לרון ${ltr(`${k}x`)}`,
  written: `${k}x + x = ${s}`, l: [k + 1, 0], r: [0, s],
  arrange: `מכנסים: ${ltr(`${k}x + x = ${k + 1}x`)}, ומקבלים ${ltr(`${k + 1}x = ${s}`)}.`,
  check: (x) => `לגיל ${x} ולרון ${k * x}: פי ${k}, ויחד ${ltr(`${x} + ${k * x} = ${s}`)}.`,
  asks: { gil: ['כמה גולות יש לגיל?', [1, 0], 'גיל', (v) => `לגיל יש ${v} גולות`], ron: ['כמה גולות יש לרון?', [k, 0], 'רון'] },
  wrongs: [`${k}x = ${s}`, `x + ${k} = ${s}`, `${k}x + ${k} = ${s}`],
});

const rectTimes = (k, per) => story({
  text: `אורך של מלבן גדול פי ${k} מהרוחב שלו, וההיקף שלו ${per} סנטימטרים.`,
  x: 'הרוחב',
  say: `האורך ${ltr(`${k}x`)}, וההיקף הוא פעמיים הסכום של האורך והרוחב`,
  written: `2(${k}x + x) = ${per}`, l: [2 * (k + 1), 0], r: [0, per],
  arrange: `מכנסים בתוך הסוגריים: ${ltr(`${k}x + x = ${k + 1}x`)}. פותחים: ${ltr(`2 × ${k + 1}x = ${2 * (k + 1)}x`)}, ומקבלים ${ltr(`${2 * (k + 1)}x = ${per}`)}.`,
  check: (x) => `הרוחב ${x} והאורך ${k * x} סנטימטרים, וההיקף ${ltr(`2 × (${k * x} + ${x}) = ${per}`)}.`,
  asks: { width: ['מה הרוחב של המלבן?', [1, 0], 'הרוחב', (v) => `הרוחב ${v} סנטימטרים`], length: ['מה האורך של המלבן?', [k, 0], 'האורך'] },
  wrongs: [`${k}x + x = ${per}`, `2(x + ${k}) = ${per}`, `4x = ${per}`],
});

const isos = (d, per) => story({
  text: `במשולש שווה שוקיים כל שוק ארוכה מהבסיס ב-${d} סנטימטרים, וההיקף שלו ${per} סנטימטרים.`,
  x: 'אורך הבסיס',
  say: `כל שוק ${ltr(`x + ${d}`)}, ויש שתי שוקיים`,
  written: `x + 2(x + ${d}) = ${per}`, l: [3, 2 * d], r: [0, per],
  arrange: `פותחים סוגריים: ${ltr(`2(x + ${d}) = 2x + ${2 * d}`)}. מכנסים: ${ltr('x + 2x = 3x')}, ומקבלים ${ltr(`3x + ${2 * d} = ${per}`)}.`,
  check: (x) => `הבסיס ${x} וכל שוק ${x + d} סנטימטרים, וההיקף ${ltr(`${x} + ${x + d} + ${x + d} = ${per}`)}.`,
  asks: { base: ['מה אורך הבסיס?', [1, 0], 'הבסיס', (v) => `הבסיס ${v} סנטימטרים`], leg: ['מה אורך כל שוק?', [1, d], 'כל שוק'] },
  wrongs: [`x + x + ${d} = ${per}`, `3x + ${d} = ${per}`, `x + 2(x − ${d}) = ${per}`],
});

const consec2 = (sum) => story({
  text: `הסכום של שני מספרים עוקבים הוא ${sum}.`,
  x: 'המספר הקטן',
  say: `המספר הבא הוא ${ltr('x + 1')}`,
  written: `x + x + 1 = ${sum}`, l: [2, 1], r: [0, sum],
  arrange: `מכנסים: ${ltr('x + x = 2x')}, ומקבלים ${ltr(`2x + 1 = ${sum}`)}.`,
  check: (x) => `המספרים ${x} ו-${x + 1} עוקבים, ו-${ltr(`${x} + ${x + 1} = ${sum}`)}.`,
  asks: { small: ['מה המספר הקטן?', [1, 0], 'המספר הקטן', (v) => `המספר הקטן הוא ${v}`], big: ['מה המספר הגדול?', [1, 1], 'המספר הגדול'] },
  wrongs: [`x + 1 = ${sum}`, `2x = ${sum}`, `x + x + 2 = ${sum}`],
});

const evens3 = (sum) => story({
  text: `הסכום של שלושה מספרים זוגיים עוקבים הוא ${sum}.`,
  x: 'המספר הקטן',
  say: `שני האחרים ${ltr('x + 2')} ו-${ltr('x + 4')}`,
  written: `x + x + 2 + x + 4 = ${sum}`, l: [3, 6], r: [0, sum],
  arrange: `מכנסים: ${ltr('x + x + x = 3x')} ו-${ltr('2 + 4 = 6')}, ומקבלים ${ltr(`3x + 6 = ${sum}`)}.`,
  check: (x) => `המספרים ${x}, ${x + 2} ו-${x + 4} זוגיים עוקבים, ו-${ltr(`${x} + ${x + 2} + ${x + 4} = ${sum}`)}.`,
  asks: { small: ['מה המספר הקטן?', [1, 0], 'המספר הקטן', (v) => `המספר הקטן הוא ${v}`], middle: ['מה המספר האמצעי?', [1, 2], 'המספר האמצעי'] },
  wrongs: [`x + x + 1 + x + 2 = ${sum}`, `3x = ${sum}`, `x + 2 + 4 = ${sum}`],
});

const sweets = (n, s, r) => story({
  text: `${n} ילדים חילקו ביניהם ${s} סוכריות שווה בשווה, ונשארו ${r} סוכריות.`,
  x: 'מספר הסוכריות שקיבל כל ילד',
  say: `${n} הילדים קיבלו יחד ${ltr(`${n}x`)}`,
  written: `${n}x + ${r} = ${s}`, l: [n, r], r: [0, s],
  arrange: '',
  check: (x) => `כל ילד קיבל ${x}, ו-${ltr(`${n} × ${x} + ${r} = ${s}`)}.`,
  asks: { each: ['כמה סוכריות קיבל כל ילד?', [1, 0], 'כל ילד', (v) => `כל ילד קיבל ${v} סוכריות`] },
  wrongs: [`${n}x − ${r} = ${s}`, `${n}x = ${s}`, `x + ${r} = ${s}`],
});

const tickets = (d, m, c, s) => story({
  text: `כרטיס למבוגר יקר ב-${d} שקלים מכרטיס לילד. ${m} מבוגרים ו-${c} ילדים שילמו יחד ${s} שקלים.`,
  x: 'המחיר של כרטיס לילד',
  say: `כרטיס למבוגר עולה ${ltr(`x + ${d}`)}`,
  written: `${m}(x + ${d}) + ${c}x = ${s}`, l: [m + c, m * d], r: [0, s],
  arrange: `פותחים סוגריים: ${ltr(`${m}(x + ${d}) = ${m}x + ${m * d}`)}. מכנסים: ${ltr(`${m}x + ${c}x = ${m + c}x`)}, ומקבלים ${ltr(`${m + c}x + ${m * d} = ${s}`)}.`,
  check: (x) => `כרטיס לילד ${x} שקלים ולמבוגר ${x + d}, ו-${ltr(`${m} × ${x + d} + ${c} × ${x} = ${s}`)}.`,
  asks: { child: ['כמה עולה כרטיס לילד?', [1, 0], 'כרטיס לילד', (v) => `כרטיס לילד עולה ${v} שקלים`], adult: ['כמה עולה כרטיס למבוגר?', [1, d], 'כרטיס למבוגר'] },
  wrongs: [`${m}x + ${d} + ${c}x = ${s}`, `${m + c}x = ${s}`, `${m}(x − ${d}) + ${c}x = ${s}`],
});

// ---------------------------------------------------------------- questions

/** Solve the story and answer what `ask` asks: the four steps, the check in the story. */
function solveQ(n, level, st, ask) {
  const [question, form, who, tell] = st.asks[ask];
  const x = solve(st.l, st.r);
  const answer = at(form, x);
  const said = form[0] === 1 && form[1] === 0
    ? `התשובה: ${tell(answer)}.`
    : `שאלו על ${who}: ${ltr(`${form[0] === 1 ? 'x' : `${form[0]}x`}${form[1] ? ` + ${form[1]}` : ''} = ${form[0] === 1 ? x : `${form[0]} × ${x}`}${form[1] ? ` + ${form[1]}` : ''} = ${answer}`)}.`;
  const why = steps(st.l, st.r, {
    first: `נסמן ב-x את ${st.x}. ${st.say}. המשוואה: ${ltr(st.written)}. ${st.arrange ? `${st.arrange} ` : ''}`,
    check: `בדיקה בסיפור: ${st.check(x)} ${said}`,
  });
  // The other amount of the story (x when the other was asked), one off, double.
  const other = form[0] === 1 && form[1] === 0 ? Object.values(st.asks).map(([, f]) => at(f, x)) : [x];
  const cands = [...other, answer + 1, answer - 1, answer * 2, answer + 2].filter((v) => v > 0);
  return numQ(n, level, `${st.text} ${question}`, answer, cands, why);
}

/** Which equation fits the story, with x chosen for the reader. */
function whichEqQ(n, level, st) {
  const x = solve(st.l, st.r);
  const why = `נסמן ב-x את ${st.x}. ${st.say}, ולכן ${ltr(st.written)}. הפתרון שלה ${x}, והוא מתאים לסיפור: ${st.check(x)}`;
  return choiceQ(n, level, `${st.text}${st.whichAsk ? ` ${st.whichAsk}` : ''} נסמן ב-x את ${st.x}. איזו משוואה מתאימה לסיפור?`, glue(st.written), st.wrongs.map(glue), why);
}

/** Which expression says how much B has when A has x: more, fewer, times, half, times and more. */
function exprQ(n, level, a, b, things, rel, answer, wrongs, why) {
  return choiceQ(n, level, `ל${a} יש x ${things}, ול${b} יש ${rel}. איזה ביטוי מתאר כמה ${things} יש ל${b}?`, glue(answer), wrongs.map(glue), why);
}

const exercises = [
  // ---------- easy: words to expressions, simple stories ----------
  exprQ(1, 'easy', 'נועה', 'דני', 'מדבקות', '3 מדבקות יותר ממנה', 'x + 3', ['3x', 'x − 3', 'x ÷ 3'],
    `יותר ב-3 פירושו מוסיפים 3: ${ltr('x + 3')}. למשל, אם לנועה יש 10, לדני יש ${ltr('10 + 3 = 13')}.`),
  exprQ(2, 'easy', 'מאיה', 'אחיה', 'גולות', 'פי 2 ממה שיש לה', '2x', ['x + 2', 'x ÷ 2', 'x − 2'],
    `פי 2 פירושו כופלים ב-2: ${ltr('2x')}. למשל, אם למאיה יש 10, לאחיה יש ${ltr('2 × 10 = 20')}.`),
  whichEqQ(3, 'easy', consec2(25)),
  solveQ(4, 'easy', consec2(31), 'small'),
  solveQ(5, 'easy', sweets(4, 30, 2), 'each'),
  exprQ(6, 'easy', 'שירה', 'רון', 'שקלים', '5 שקלים פחות ממנה', 'x − 5', ['x + 5', '5x', 'x ÷ 5'],
    `פחות ב-5 פירושו מורידים 5: ${ltr('x − 5')}. למשל, אם לשירה יש 12, לרון יש ${ltr('12 − 5 = 7')}.`),
  whichEqQ(7, 'easy', shareDiff(30, 6)),
  solveQ(8, 'easy', ageSum('דנה', 2, 16), 'brother'),
  solveQ(9, 'easy', moneyLeft('עומר', 50, 3, 'ספרים', 'ספר', 14), 'price'),
  whichEqQ(10, 'easy', sweets(5, 37, 2)),

  // ---------- medium: times and half, the other amount, perimeter ----------
  exprQ(11, 'medium', 'נועה', 'אחותה', 'עפרונות', 'חצי ממה שיש לה', 'x ÷ 2', ['2x', 'x − 2', 'x + 2'],
    `חצי פירושו מחלקים ב-2: ${ltr('x ÷ 2')}. למשל, אם לנועה יש 12, לאחותה יש ${ltr('12 ÷ 2 = 6')}.`),
  whichEqQ(12, 'medium', momAge(4, 50)),
  solveQ(13, 'medium', shareTimes(48, 3), 'gil'),
  solveQ(14, 'medium', ageSum('מיכל', 5, 29), 'sister'),
  whichEqQ(15, 'medium', rectTimes(2, 48)),
  solveQ(16, 'medium', isos(3, 36), 'base'),
  solveQ(17, 'medium', shareDiff(50, 8), 'big'),
  whichEqQ(18, 'medium', moneyLeft('אורי', 40, 4, 'מחברות', 'מחברת', 8, true)),
  solveQ(19, 'medium', momAge(3, 48), 'mom'),
  exprQ(20, 'medium', 'יעל', 'גיל', 'בולים', 'פי 3 ממה שיש לה', '3x', ['x + 3', 'x ÷ 3', '3 − x'],
    `פי 3 פירושו כופלים ב-3: ${ltr('3x')}. למשל, אם ליעל יש 5, לגיל יש ${ltr('3 × 5 = 15')}.`),

  // ---------- hard: ages in the future, tickets, three numbers ----------
  whichEqQ(21, 'hard', futureAge(40, 10, 3)),
  solveQ(22, 'hard', futureAge(32, 8, 3), 'years'),
  whichEqQ(23, 'hard', tickets(10, 2, 3, 95)),
  solveQ(24, 'hard', tickets(5, 3, 2, 65), 'adult'),
  solveQ(25, 'hard', evens3(48), 'middle'),
  exprQ(26, 'hard', 'תמר', 'עידו', 'קלפים', 'פי 2 ממה שיש לה ועוד 5', '2x + 5', ['5x + 2', '2(x + 5)', '2x − 5'],
    `קודם פי 2, ${ltr('2x')}, ואחר כך מוסיפים 5: ${ltr('2x + 5')}. למשל, אם לתמר יש 10, לעידו יש ${ltr('2 × 10 + 5 = 25')}.`),
  whichEqQ(27, 'hard', isos(4, 41)),
  solveQ(28, 'hard', rectTimes(3, 64), 'length'),
  whichEqQ(29, 'hard', evens3(60)),
  solveQ(30, 'hard', moneyLeft('איתי', 100, 6, 'כרטיסים', 'כרטיס', 28), 'total'),
];

module.exports = lesson(7, 'From a Story to an Equation', 'מסיפור למשוואה', theory, exercises);
