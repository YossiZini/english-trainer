// 110.1 עשיריות ומאיות — what a decimal is: tenths and hundredths of a
// square, the place of each digit, from a fraction to a decimal and back, and
// zeros at the end. Numbers, wrong options and pictures from ./common.js.
const { ltr, P, eq, pic, D, str, places, mul, div, add, sub, ofFraction, decQ, choiceQ, lesson } = require('./common');

/** The square of a decimal below 1 with at most two places: tenths as ten columns, hundredths as 100 cells. */
function square(v) {
  const s = str(v);
  const p = places(s);
  if (D(s) >= D('1') || p === 0 || p > 2) throw new Error(`square: ${s} is not tenths or hundredths below 1`);
  const frac = s.split('.')[1];
  return p === 1 ? P.hundredGrid(Number(frac), { parts: 10 }) : P.hundredGrid(Number(frac));
}

/** The square of a decimal under an explanation, with its caption. */
const squarePic = (v, caption) => pic(square(v), caption);

/** What the square shows in words: "3 עשיריות" or "45 מאיות". */
const inWords = (v) => {
  const s = str(v);
  return places(s) === 1 ? `${s.split('.')[1]} עשיריות` : `${Number(s.split('.')[1])} מאיות`;
};

/** n/d as a decimal: d = 10 or 100 directly, another d widened to 10 or 100 first. */
function fracQ(n, level, num, den, wrongs, opts = {}) {
  const ans = ofFraction(num, den);
  let why;
  if (den === 10 || den === 100) {
    why = `מכנה ${den}: ${den === 10 ? 'ספרה אחת' : 'שתי ספרות'} אחרי הנקודה, ${ltr(`${num}/${den} = ${str(ans)}`)}.`;
  } else {
    const to = 10 % den === 0 ? 10 : 100;
    const k = to / den;
    why = `מרחיבים למכנה ${to}: ${ltr(`${num}/${den} = ${num * k}/${to} = ${str(ans)}`)}.`;
  }
  const picture = D(ans) < D('1') && places(str(ans)) <= 2 ? squarePic(ans, inWords(ans)) : null;
  return decQ(n, level, opts.text || `איזה שבר עשרוני שווה ל-${ltr(`${num}/${den}`)}?`, ans, wrongs, `${opts.before || ''}${why}`, { picture });
}

/** A decimal as a fraction of 10 or 100 (not reduced): '0.07' → '7/100'. */
const asFraction = (s) => `${Number(String(s).replace('.', ''))}/${10 ** places(s)}`;

/** The digit of `number` in a place ('tenths' or 'hundredths'). */
function digitQ(n, level, number, place) {
  const s = str(number);
  const frac = (s.split('.')[1] || '').padEnd(2, '0');
  const ans = place === 'tenths' ? frac[0] : frac[1];
  const others = [...new Set([...s.replace('.', '')].filter((d) => d !== ans)), '0', '1'].filter((d) => d !== ans);
  const name = place === 'tenths' ? 'העשיריות' : 'המאיות';
  return choiceQ(n, level, `מהי ספרת ${name} במספר ${s}?`, ans, [...new Set(others)].slice(0, 3),
    `ספרת העשיריות היא הראשונה אחרי הנקודה, וספרת המאיות היא השנייה. במספר ${s} ספרת ${name} היא ${ans}.`,
    { picture: pic(P.placeValue([s], { mark: place }), `ספרת ${name} מסומנת`) });
}

const theory = `
<h2>שברים עשרוניים: עשיריות ומאיות</h2>

<p>שבר עשרוני הוא דרך אחרת לכתוב שבר שהמכנה שלו 10, 100 או 1000. הנקודה העשרונית מפרידה בין השלמים לחלקים: משמאל לנקודה השלמים, ומימין לה החלקים של השלם. למשל 2.5 הם שני שלמים וחמש עשיריות.</p>

<div class="formula">
  <div class="formula-title">עשירית ומאית</div>
  <div class="formula-content">${eq('0.1 = 1/10')} &nbsp; ${eq('0.01 = 1/100')}</div>
  <div class="formula-explanation">ספרה אחת אחרי הנקודה היא עשיריות, וספרה שנייה היא מאיות.</div>
</div>

<h3>כלל 1: עשיריות</h3>
<div class="rules">
  <p>מחלקים שלם ל-10 חלקים שווים. כל חלק הוא עשירית: ${eq('1/10 = 0.1')}. שלוש עשיריות הן ${eq('3/10 = 0.3')}: שלושה חלקים מתוך עשרה.</p>
  ${P.figures(P.figure(P.hundredGrid(3, { parts: 10 }), `שלוש עשיריות: ${eq('0.3 = 3/10')}`))}
</div>

<h3>כלל 2: מאיות</h3>
<div class="rules">
  <p>מחלקים שלם ל-100 חלקים שווים. כל חלק הוא מאית: ${eq('1/100 = 0.01')}. בריבוע של 100 משבצות, כל עמודה של 10 משבצות היא עשירית. המספר 0.45 הוא 45 משבצות: ארבע עמודות שלמות, שהן 4 עשיריות, ועוד 5 משבצות, שהן 5 מאיות.</p>
  ${P.figures(P.figure(P.hundredGrid(45), `${eq('0.45 = 45/100')}: ארבע עמודות וחמש משבצות`))}
</div>

<h3>כלל 3: לכל ספרה יש מקום</h3>
<div class="rules">
  <p>במספר 3.47 הספרה 3 היא אחדות, הספרה 4 היא עשיריות והספרה 7 היא מאיות. לכן ${eq('3.47 = 3 + 0.4 + 0.07')}. הספרה הראשונה אחרי הנקודה היא תמיד ספרת העשיריות.</p>
  ${P.figures(P.figure(P.placeValue(['3.47'], { mark: 'tenths' }), 'ספרת העשיריות של 3.47 היא 4'))}
</div>

<h3>כלל 4: משבר לשבר עשרוני ובחזרה</h3>
<div class="rules">
  <p>כשהמכנה הוא 10, כותבים ספרה אחת אחרי הנקודה: ${eq('7/10 = 0.7')}. כשהמכנה הוא 100, כותבים שתי ספרות: ${eq('7/100 = 0.07')}. האפס שומר על מקום העשיריות, ולכן 0.07 קטן בהרבה מ-0.7. שבר עם מכנה אחר מרחיבים קודם למכנה 10 או 100: ${eq('1/2 = 5/10 = 0.5')}, ${eq('3/4 = 75/100 = 0.75')}.</p>
  ${P.figures(
    P.figure(P.hundredGrid(7), `${eq('0.07')}: שבע משבצות`),
    P.figure(P.hundredGrid(70), `${eq('0.7')}: שבע עמודות`)
  )}
</div>

<h3>כלל 5: אפסים בסוף לא משנים את המספר</h3>
<div class="rules">
  <p>חמש עשיריות הן חמישים מאיות, ולכן ${eq('0.5 = 0.50')}. אפס בסוף, אחרי הספרות, לא משנה את המספר. אבל אפס מיד אחרי הנקודה משנה אותו: 0.05 הן חמש מאיות בלבד.</p>
  ${P.figures(
    P.figure(P.hundredGrid(5, { parts: 10 }), `${eq('0.5')}: חמש עשיריות`),
    P.figure(P.hundredGrid(50), `${eq('0.50')}: חמישים מאיות`)
  )}
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong> לכתוב את ${eq('7/100')} כ-0.7. במכנה 100 יש שתי ספרות אחרי הנקודה, ולכן ${eq('7/100 = 0.07')}. ועוד טעות: לחשוב ש-0.5 הוא ${eq('1/5')}. למעשה ${eq('0.5 = 5/10 = 1/2')}.
</div>

<div class="tip">
  <strong>טיפ:</strong> מספר הספרות אחרי הנקודה שווה למספר האפסים במכנה: 0.3 הוא ${eq('3/10')}, ו-0.03 הוא ${eq('3/100')}.
</div>
`;

const exercises = [
  // Easy: one step, a rule as it is.
  fracQ(1, 'easy', 3, 10, ['0.03', '3', '3.1']),
  fracQ(2, 'easy', 7, 10, ['0.07', '7', '7.1']),
  choiceQ(3, 'easy', 'איזה שבר שווה ל-0.9?', '9/10', ['9/100', '1/9', '9/1000'],
    `ספרה אחת אחרי הנקודה היא עשיריות: ${ltr('0.9 = 9/10')}.`, { picture: squarePic('0.9', '9 עשיריות') }),
  digitQ(4, 'easy', '4.27', 'tenths'),
  digitQ(5, 'easy', '0.36', 'hundredths'),
  decQ(6, 'easy', 'כמה מאיות יש בעשירית אחת?', '10', ['100', '1', '0.1'],
    `עשירית היא עמודה אחת בריבוע של 100 משבצות, ובעמודה 10 משבצות: ${ltr('0.1 = 10/100')}.`,
    { picture: squarePic('0.1', 'עמודה אחת: 10 מאיות') }),
  fracQ(7, 'easy', 45, 100, ['4.5', '0.045', '45.1']),
  choiceQ(8, 'easy', 'איזה שבר שווה ל-0.08?', '8/100', ['8/10', '8/1000', '1/8'],
    `שתי ספרות אחרי הנקודה הן מאיות: ${ltr('0.08 = 8/100')}.`, { picture: squarePic('0.08', '8 מאיות') }),
  decQ(9, 'easy', 'איזה מספר הוא שלם אחד וחמש עשיריות?', '1.5', ['1.05', '15', '0.15'],
    'השלם משמאל לנקודה, והעשיריות בספרה הראשונה אחריה: 1.5.',
    { picture: pic(P.placeValue(['1.5']), 'שלם אחד וחמש עשיריות') }),
  decQ(10, 'easy', 'איזה שבר עשרוני מתאים לחלק הצבוע בריבוע?', '0.35', ['0.65', '3.5', '0.035'],
    `צבועות 3 עמודות ועוד 5 משבצות, כלומר 35 מתוך 100: ${ltr('35/100 = 0.35')}.`,
    { question: P.hundredGrid(35) }),

  // Medium: widening a fraction, the value of a digit, two steps.
  fracQ(11, 'medium', 1, 2, ['0.12', '1.2', '0.2']),
  fracQ(12, 'medium', 1, 4, ['0.14', '0.4', '1.4']),
  fracQ(13, 'medium', 3, 4, ['0.34', '0.43', '3.4']),
  fracQ(14, 'medium', 1, 5, ['0.15', '0.5', '1.5']),
  decQ(15, 'medium', 'מה הערך של הספרה 4 במספר 2.14?', '0.04', ['0.4', '4', '40'],
    `הספרה 4 היא השנייה אחרי הנקודה, ספרת המאיות: היא שווה ${ltr('4/100 = 0.04')}.`,
    { picture: pic(P.placeValue(['2.14'], { mark: 'hundredths' }), 'הספרה 4 במקום המאיות') }),
  decQ(16, 'medium', 'איזה מספר הוא 2 שלמים ו-7 מאיות?', '2.07', ['2.7', '2.007', '0.27'],
    'אין עשיריות, ולכן כותבים 0 במקום העשיריות ו-7 במקום המאיות: 2.07.',
    { picture: pic(P.placeValue(['2.07'], { mark: 'tenths' }), 'אפס במקום העשיריות') }),
  decQ(17, 'medium', `מה התוצאה של ${ltr('3 + 0.4 + 0.09')}?`, add(add('3', '0.4'), '0.09'), ['3.94', '3.409', '0.349'],
    `3 אחדות, 4 עשיריות ו-9 מאיות: ${ltr('3 + 0.4 + 0.09 = 3.49')}.`,
    { picture: pic(P.placeValue(['3.49']), '3 אחדות, 4 עשיריות, 9 מאיות') }),
  choiceQ(18, 'medium', 'איזה מספר שווה ל-0.6?', '0.60', ['0.06', '0.006', '6'],
    `שש עשיריות הן שישים מאיות: ${ltr('0.6 = 0.60')}. אפס אחרי הנקודה, לפני ה-6, כבר משנה את המספר.`,
    { picture: squarePic('0.6', '6 עשיריות הן 60 מאיות') }),
  decQ(19, 'medium', 'איזה שבר עשרוני מתאים לחלק הצבוע בריבוע?', '0.07', ['0.7', '7', '0.007'],
    `צבועות 7 משבצות מתוך 100, פחות מעמודה אחת: ${ltr('7/100 = 0.07')}.`,
    { question: P.hundredGrid(7) }),
  choiceQ(20, 'medium', 'איזה שבר שווה ל-0.75?', '3/4', ['7/5', '75/10', '3/5'],
    `0.75 הן 75 מאיות, ומצמצמים ב-25: ${ltr('75/100 = 3/4')}.`, { picture: squarePic('0.75', '75 מאיות') }),

  // Hard: stories, traps and several steps.
  decQ(21, 'hard', 'בריבוע של שוקולד יש 100 קוביות. נועה אכלה 35 קוביות. איזה חלק מהשוקולד נשאר?', sub('1', '0.35'), ['0.35', '6.5', '0.065'],
    `נשארו ${ltr('100 − 35 = 65')} קוביות מתוך 100: ${ltr('65/100 = 0.65')}.`, { picture: squarePic('0.35', 'נאכלו 35, נשארו 65') }),
  fracQ(22, 'hard', 3, 100, ['0.3', '3.1', '0.003'], { before: 'המכנה 100, לא 10. ' }),
  fracQ(23, 'hard', 12, 10, ['0.12', '12.1', '1.02'], { before: `${ltr('12/10')} הם יותר משלם: 10 עשיריות הן שלם, ועוד 2 עשיריות. ` }),
  decQ(24, 'hard', 'איזה מספר הוא 4 עשיריות ו-12 מאיות?', add('0.4', '0.12'), ['0.412', '4.12', '0.16'],
    `12 מאיות הן עשירית ועוד 2 מאיות, ולכן יש 5 עשיריות: ${ltr('0.4 + 0.12 = 0.52')}.`, { picture: squarePic('0.52', '40 ועוד 12: 52 משבצות') }),
  fracQ(25, 'hard', 3, 20, ['0.32', '0.3', '1.5']),
  decQ(26, 'hard', 'איזה מספר הוא 7 שלמים ו-3 מאיות?', '7.03', ['7.3', '7.003', '0.73'],
    'אין עשיריות: כותבים 0 במקום העשיריות ו-3 במקום המאיות, 7.03.',
    { picture: pic(P.placeValue(['7.03'], { mark: 'tenths' }), 'אפס במקום העשיריות') }),
  choiceQ(27, 'hard', 'דני כתב ש-0.5 הוא חמישית. איזה שבר שווה באמת ל-0.5?', '1/2', ['1/5', '5/100', '1/50'],
    `0.5 הן חמש עשיריות: ${ltr('0.5 = 5/10 = 1/2')}. חמישית היא ${ltr('1/5 = 2/10 = 0.2')}.`, { picture: squarePic('0.5', 'חצי ריבוע: 5 עשיריות') }),
  decQ(28, 'hard', 'מטבע של 10 אגורות הוא עשירית של שקל. כמה שקלים הם 7 מטבעות של 10 אגורות?', mul('7', '0.1'), ['0.07', '7', '70'],
    `7 עשיריות של שקל: ${ltr('7 × 0.1 = 0.7')}, כלומר 70 אגורות.`, { picture: squarePic('0.7', '7 עשיריות של שקל') }),
  decQ(29, 'hard', 'כמה אגורות הן 2.05 שקלים?', mul('2.05', '100'), ['25', '250', '2050'],
    `בשקל 100 אגורות: ${ltr('2.05 × 100 = 205')}. האפס במקום העשיריות אומר שאין מטבעות של 10 אגורות.`),
  decQ(30, 'hard', 'איזה מספר נמצא בדיוק באמצע בין 0.3 ל-0.4?', div(add('0.3', '0.4'), '2'), ['0.34', '0.305', '3.5'],
    `0.3 הן 30 מאיות ו-0.4 הן 40 מאיות. באמצע בין 30 ל-40 נמצא 35, כלומר 0.35.`,
    { picture: pic(P.decimalLine({ from: '0.3', to: '0.4', places: 2, labelEvery: 5, points: [{ at: '0.35' }] }), 'באמצע בין 0.3 ל-0.4') })
];

module.exports = lesson(1, 'Tenths and Hundredths', 'שברים עשרוניים: עשיריות ומאיות', theory, exercises);
