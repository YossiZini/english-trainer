import React from 'react';
import { Counters, DivEq, Expr, Note } from '../primitives';

// 105.1 חילוק עם שארית — one scene per rule of the written theory. Counters
// gather from a pile into equal groups; what is left over turns orange and
// is the remainder. The equation under the drawing fills in.
const AREA = { x: 20, y: 8, w: 600, h: 195 };
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  {
    name: 'קבוצות שוות ושארית',
    steps: [
      {
        caption: '17 עפרונות. מסדרים אותם בקבוצות של 5.',
        draw: () => (<>
          <Counters total={17} each={5} phase="pile" {...AREA} />
          <DivEq a={17} d={5} />
        </>),
      },
      {
        caption: 'קבוצה ראשונה, שנייה, שלישית: 3 קבוצות של 5. נשארו 2 עפרונות.',
        draw: () => (<>
          <Counters total={17} each={5} phase="gather" labels {...AREA} />
          <DivEq a={17} d={5} q={3} r="?" qAnim="pop" rAnim="fadein d5" />
        </>),
      },
      {
        caption: 'לקבוצה רביעית צריך עוד 3, ולכן עוצרים: 17 ÷ 5 = 3, ושארית 2.',
        draw: () => (<>
          <Counters total={17} each={5} labels {...AREA} />
          <DivEq a={17} d={5} q={3} r={2} qAnim="" rAnim="pop d1" />
        </>),
      },
    ],
  },
  {
    name: 'השארית קטנה מהמחלק',
    steps: [
      {
        caption: 'אחרי 2 קבוצות של 5 נשארו 7. ב-7 יש עוד קבוצה של 5, ולכן לא עוצרים.',
        draw: () => (<>
          <Counters total={17} each={5} groups={2} labels {...AREA} />
          <Note x={320} y={245} anim="shake d2">7 גדול מ-5: אפשר לבנות עוד קבוצה</Note>
        </>),
      },
      {
        caption: 'בונים עוד קבוצה: נשארו 2, פחות מ-5. עכשיו אי אפשר להמשיך.',
        draw: () => (<>
          <Counters total={17} each={5} phase="gather" labels {...AREA} />
          <DivEq a={17} d={5} q={3} r={2} qAnim="fadein" rAnim="pop d5" />
        </>),
      },
      {
        caption: 'בחילוק ב-5 השארית יכולה להיות 0, 1, 2, 3 או 4: תמיד קטנה מ-5.',
        draw: () => (<>
          <Note x={320} y={60} anim="fadein">השאריות האפשריות בחילוק ב-5</Note>
          <Expr y={130} size={34} gap={26} tokens={['0', '1', '2', '3', '4'].map((t, i) => ({ t, cls: 'b', anim: `pop d${i + 1}` }))} />
          <Expr y={205} size={34} tokens={[{ t: '5', cls: 'dim', anim: 'shake d5' }]} />
          <Note x={320} y={250} anim="fadein d5">5 כבר יוצרים עוד קבוצה</Note>
        </>),
      },
    ],
  },
  {
    name: 'המנה מלוח הכפל',
    steps: [
      {
        caption: '38 ÷ 7: סופרים בשורה של 7 בלוח הכפל: 7, 14, 21, 28, 35. הכפולה הבאה, 42, כבר גדולה מ-38.',
        draw: () => (<>
          <Note x={320} y={60} anim="fadein">השורה של 7 בלוח הכפל</Note>
          <Expr y={135} size={30} gap={22} hl={[4, 4]} tokens={['7', '14', '21', '28', R('35', 'pop d3'), { t: '42', cls: 'dim', anim: 'shake d5' }]} />
          <Note x={320} y={215} anim="fadein d4">35 לא עובר את 38, ו-42 כבר עובר</Note>
        </>),
      },
      {
        caption: '5 × 7 = 35: חמש קבוצות של 7. נשארו 38 − 35 = 3.',
        draw: () => (<>
          <Counters total={38} each={7} phase="gather" labels {...AREA} />
          <DivEq a={38} d={7} q={5} r="?" qAnim="pop" rAnim="fadein d5" />
        </>),
      },
      {
        caption: 'המנה 5 והשארית 3: 38 ÷ 7 = 5, ושארית 3.',
        draw: () => (<>
          <Counters total={38} each={7} labels {...AREA} />
          <DivEq a={38} d={7} q={5} r={3} qAnim="" rAnim="pop d1" />
        </>),
      },
    ],
  },
  {
    name: 'שארית 0',
    steps: [
      {
        caption: '20 עפרונות בקבוצות של 5.',
        draw: () => (<>
          <Counters total={20} each={5} phase="pile" {...AREA} />
          <DivEq a={20} d={5} />
        </>),
      },
      {
        caption: '4 קבוצות, ולא נשאר אף עיפרון: 20 ÷ 5 = 4, ושארית 0. אומרים ש-20 מתחלק ב-5.',
        draw: () => (<>
          <Counters total={20} each={5} phase="gather" labels {...AREA} />
          <DivEq a={20} d={5} q={4} r={0} qAnim="pop d5" rAnim="pop d5" />
        </>),
      },
    ],
  },
  {
    name: 'בודקים',
    steps: [
      {
        caption: 'חישבנו 38 ÷ 7 = 5, ושארית 3. בודקים: 5 × 7 + 3 = 38.',
        draw: () => (<>
          <Counters total={38} each={7} labels {...AREA} />
          <Expr y={245} size={28} tokens={['5', '×', '7', '+', { t: '3', cls: 'b' }, '=', R('38', 'pop d3')]} />
        </>),
      },
      {
        caption: 'יצא המחולק, 38. וגם השארית 3 קטנה מ-7, ולכן התשובה נכונה.',
        draw: () => (<>
          <Counters total={38} each={7} labels {...AREA} />
          <DivEq y={232} a={38} d={7} q={5} r={3} qAnim="" rAnim="" />
          <Note x={320} y={266} anim="fadein d3">3 קטן מ-7 ✓</Note>
        </>),
      },
    ],
  },
];

export default scenes;
