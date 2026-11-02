import React from 'react';
import { Counters, DotArray, DivEq, Expr, Note } from '../primitives';

// 100.2 חילוק – הפעולה ההפוכה לכפל — sharing into equal groups, a fact
// family from one array, finding a quotient in the table, special cases,
// checking by multiplication.
const AREA = { x: 20, y: 8, w: 600, h: 195 };
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  {
    name: 'חלוקה שווה',
    steps: [
      {
        caption: 'מחלקים 12 נקודות ל-3 קבוצות שוות.',
        draw: () => (<>
          <Counters total={12} each={4} phase="pile" {...AREA} />
          <DivEq a={12} d={3} />
        </>),
      },
      {
        caption: 'בכל קבוצה יש 4, ולכן 12 ÷ 3 = 4.',
        draw: () => (<>
          <Counters total={12} each={4} phase="gather" labels {...AREA} />
          <DivEq a={12} d={3} q={4} qAnim="pop d5" />
        </>),
      },
      {
        caption: 'ואפשר לשאול אחרת: כמה קבוצות של 4 יש ב-12? 3 קבוצות, ולכן 12 ÷ 4 = 3.',
        draw: () => (<>
          <Counters total={12} each={4} labels {...AREA} />
          <DivEq a={12} d={4} q={3} />
        </>),
      },
    ],
  },
  {
    name: 'משפחה של ארבעה תרגילים',
    steps: [
      {
        caption: '3 שורות של 4 נקודות נותנות שני תרגילי כפל: 3 × 4 = 12 ו-4 × 3 = 12.',
        draw: () => (<>
          <DotArray rows={3} cols={4} phase="gather" x={20} y={20} w={280} h={200} />
          <Expr x={470} y={70} size={28} tokens={['3', '×', '4', '=', R('12', 'pop d4')]} />
          <Expr x={470} y={125} size={28} tokens={['4', '×', '3', '=', R('12', 'pop d5')]} />
        </>),
      },
      {
        caption: 'ושני תרגילי חילוק: 12 ÷ 3 = 4 ו-12 ÷ 4 = 3. ארבעה תרגילים מאותן נקודות.',
        draw: () => (<>
          <DotArray rows={3} cols={4} x={20} y={20} w={280} h={200} />
          <Expr x={470} y={70} size={28} tokens={['3', '×', '4', '=', R('12', '')]} />
          <Expr x={470} y={125} size={28} tokens={['4', '×', '3', '=', R('12', '')]} />
          <Expr x={470} y={180} size={28} anim="fadein d1" tokens={['12', '÷', '3', '=', R('4', 'pop d2')]} />
          <Expr x={470} y={235} size={28} anim="fadein d3" tokens={['12', '÷', '4', '=', R('3', 'pop d4')]} />
        </>),
      },
    ],
  },
  {
    name: 'בעזרת לוח הכפל',
    steps: [
      {
        caption: '56 ÷ 8: איזה מספר כפול 8 נותן 56? סופרים בשורה של 8: 8, 16, 24, 32, 40, 48, 56.',
        draw: () => (<>
          <Note x={320} y={60} anim="fadein">השורה של 8 בלוח הכפל</Note>
          <Expr y={135} size={28} gap={18} hl={[6, 6]} tokens={['8', '16', '24', '32', '40', '48', R('56', 'pop d4')]} />
          <Note x={320} y={215} anim="fadein d4">56 הוא המספר השביעי בשורה</Note>
        </>),
      },
      {
        caption: '7 × 8 = 56: שבע קבוצות של 8. לכן 56 ÷ 8 = 7.',
        draw: () => (<>
          <Counters total={56} each={8} labels {...AREA} />
          <DivEq a={56} d={8} q={7} />
        </>),
      },
    ],
  },
  {
    name: 'מקרים מיוחדים',
    steps: [
      {
        caption: 'חלקי 1: כל ה-9 בקבוצה אחת, 9 ÷ 1 = 9.',
        draw: () => (<>
          <Counters total={9} each={9} phase="gather" labels {...AREA} />
          <DivEq a={9} d={1} q={9} qAnim="pop d5" />
        </>),
      },
      {
        caption: 'מספר חלקי עצמו: 9 קבוצות, ובכל אחת 1, ולכן 9 ÷ 9 = 1.',
        draw: () => (<>
          <Counters total={9} each={1} phase="gather" labels {...AREA} />
          <DivEq a={9} d={9} q={1} qAnim="pop d5" />
        </>),
      },
      {
        caption: 'אפס חלקי מספר הוא 0: 0 ÷ 9 = 0. ובחילוק ב-0 אין תשובה: אי אפשר לחלק ל-0 קבוצות.',
        draw: () => (<>
          <Expr y={100} size={30} tokens={['0', '÷', '9', '=', R('0')]} />
          <Expr y={175} size={30} tokens={['9', '÷', '0', '=', { t: '✗', cls: 'dim', anim: 'shake d4' }]} />
          <Note x={320} y={240} anim="fadein d4">אי אפשר לחלק ל-0 קבוצות</Note>
        </>),
      },
    ],
  },
  {
    name: 'בודקים בכפל',
    steps: [
      {
        caption: 'חישבנו 42 ÷ 6 = 7: שש קבוצות של 7.',
        draw: () => (<>
          <Counters total={42} each={7} phase="gather" labels {...AREA} />
          <DivEq a={42} d={6} q={7} qAnim="pop d5" />
        </>),
      },
      {
        caption: 'בודקים: כופלים את התשובה במחלק, 7 × 6 = 42. יצא המחולק, ולכן התשובה נכונה.',
        draw: () => (<>
          <Counters total={42} each={7} labels {...AREA} />
          <Expr y={245} size={28} tokens={['7', '×', '6', '=', R('42')]} />
        </>),
      },
    ],
  },
];

export default scenes;
