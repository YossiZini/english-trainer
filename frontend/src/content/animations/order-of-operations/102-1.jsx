import React from 'react';
import { Expr, Note, NumberLine, Arrow, ArrowDefs } from '../primitives';

// 102.1 סדר פעולות חשבון — one scene per rule of the written theory.
// Each step shows the expression, highlights the part computed now, and
// pops its result on the next row.
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });
const dim = (tokens) => tokens.map((t) => (typeof t === 'string' ? { t, cls: 'dim' } : t));

const scenes = [
  {
    name: 'סוגריים קודם',
    steps: [
      {
        caption: '(3 + 4) × 2. קודם מה שבתוך הסוגריים: 3 + 4 = 7.',
        draw: () => (<>
          <Expr y={100} tokens={['(', '3', '+', '4', ')', '×', '2']} hl={[0, 4]} anim="fadein" />
          <Expr y={200} tokens={[R('7'), '×', '2']} />
        </>),
      },
      {
        caption: 'עכשיו נשאר רק 7 × 2 = 14.',
        draw: () => (<>
          <Expr y={70} size={24} tokens={dim(['(', '3', '+', '4', ')', '×', '2'])} />
          <Expr y={140} tokens={['7', '×', '2']} hl={[0, 2]} />
          <Expr y={220} tokens={['=', R('14')]} />
        </>),
      },
      {
        caption: '18 ÷ (2 + 4): קודם הסוגריים, 2 + 4 = 6, ואז 18 ÷ 6 = 3.',
        draw: () => (<>
          <Expr y={70} tokens={['18', '÷', '(', '2', '+', '4', ')']} hl={[2, 6]} anim="fadein" />
          <Expr y={150} tokens={['18', '÷', R('6')]} />
          <Expr y={230} tokens={['=', R('3', 'pop d4')]} />
        </>),
      },
    ],
  },
  {
    name: 'כפל וחילוק לפני חיבור וחיסור',
    steps: [
      {
        caption: '3 + 4 × 2. אין סוגריים, אז קודם הכפל: 4 × 2 = 8.',
        draw: () => (<>
          <Expr y={100} tokens={['3', '+', '4', '×', '2']} hl={[2, 4]} anim="fadein" />
          <Expr y={200} tokens={['3', '+', R('8')]} />
        </>),
      },
      {
        caption: 'ואז החיבור: 3 + 8 = 11. מי שמחבר קודם מקבל 7 × 2 = 14, וזו טעות.',
        draw: () => (<>
          <Expr y={70} size={24} tokens={dim(['3', '+', '4', '×', '2'])} />
          <Expr y={140} tokens={['3', '+', '8', '=', R('11')]} hl={[0, 2]} />
          <Note x={320} y={230} anim="shake d4">לא 14!</Note>
        </>),
      },
      {
        caption: '20 − 8 ÷ 2: קודם החילוק 8 ÷ 2 = 4, ואז 20 − 4 = 16.',
        draw: () => (<>
          <Expr y={70} tokens={['20', '−', '8', '÷', '2']} hl={[2, 4]} anim="fadein" />
          <Expr y={150} tokens={['20', '−', R('4')]} />
          <Expr y={230} tokens={['=', R('16', 'pop d4')]} />
        </>),
      },
    ],
  },
  {
    name: 'משמאל לימין',
    steps: [
      {
        caption: '40 ÷ 5 × 2. חילוק וכפל באותה דרגה, לכן מחשבים משמאל לימין: קודם 40 ÷ 5 = 8.',
        draw: () => (<>
          <ArrowDefs />
          <Arrow d="M 200 50 L 440 50" anim="fadein d1" />
          <Expr y={120} tokens={['40', '÷', '5', '×', '2']} hl={[0, 2]} anim="fadein" />
          <Expr y={210} tokens={[R('8'), '×', '2']} />
        </>),
      },
      {
        caption: 'ואז 8 × 2 = 16. מי שמכפיל קודם, 5 × 2 = 10, מקבל 40 ÷ 10 = 4, וזו טעות.',
        draw: () => (<>
          <Expr y={70} size={24} tokens={dim(['40', '÷', '5', '×', '2'])} />
          <Expr y={140} tokens={['8', '×', '2', '=', R('16')]} hl={[0, 2]} />
          <Note x={320} y={230} anim="shake d4">לא 4!</Note>
        </>),
      },
      {
        caption: 'גם בחיסור וחיבור: 9 − 3 + 2. קודם 9 − 3 = 6, ואז 6 + 2 = 8. לא 9 − 5.',
        draw: () => (<>
          <Expr y={70} tokens={['9', '−', '3', '+', '2']} hl={[0, 2]} anim="fadein" />
          <Expr y={150} tokens={[R('6'), '+', '2']} />
          <Expr y={230} tokens={['=', R('8', 'pop d4')]} />
        </>),
      },
    ],
  },
  {
    name: 'סוגריים בתוך סוגריים',
    steps: [
      {
        caption: '2 × (3 + (10 − 4) ÷ 2). מתחילים מהסוגריים הפנימיים ביותר: 10 − 4 = 6.',
        draw: () => (<>
          <Expr y={100} size={26} tokens={['2', '×', '(', '3', '+', '(', '10', '−', '4', ')', '÷', '2', ')']} hl={[5, 9]} anim="fadein" />
          <Expr y={200} size={26} tokens={['2', '×', '(', '3', '+', R('6'), '÷', '2', ')']} />
        </>),
      },
      {
        caption: 'בתוך הסוגריים החיצוניים, קודם החילוק: 6 ÷ 2 = 3.',
        draw: () => (<>
          <Expr y={100} size={26} tokens={['2', '×', '(', '3', '+', '6', '÷', '2', ')']} hl={[5, 7]} />
          <Expr y={200} size={26} tokens={['2', '×', '(', '3', '+', R('3'), ')']} />
        </>),
      },
      {
        caption: 'עכשיו 3 + 3 = 6, ולבסוף 2 × 6 = 12.',
        draw: () => (<>
          <Expr y={70} size={26} tokens={['2', '×', '(', '3', '+', '3', ')']} hl={[2, 6]} />
          <Expr y={150} size={26} tokens={['2', '×', R('6')]} />
          <Expr y={230} tokens={['=', R('12', 'pop d4')]} />
        </>),
      },
    ],
  },
  {
    name: 'תוצאה שלילית',
    steps: [
      {
        caption: '5 − 3 × 4. קודם הכפל: 3 × 4 = 12.',
        draw: () => (<>
          <Expr y={100} tokens={['5', '−', '3', '×', '4']} hl={[2, 4]} anim="fadein" />
          <Expr y={200} tokens={['5', '−', R('12')]} />
        </>),
      },
      {
        caption: '5 − 12 = −7. מחסרים יותר ממה שיש, אז יורדים מתחת לאפס: התוצאה שלילית.',
        draw: () => (<>
          <Expr y={60} tokens={['5', '−', '12', '=', R('−7')]} />
          <ArrowDefs />
          <NumberLine y={190} from={-8} to={6} den={1} points={[{ value: 5, label: '5' }, { value: -7, label: '−7', color: 'b' }]} anim="fadein d1" />
          <Arrow d="M 520 150 Q 320 90 130 150" anim="fadein d3" />
          <Note x={320} y={250} anim="fadein d4">12 צעדים שמאלה מ-5</Note>
        </>),
      },
    ],
  },
];

export default scenes;
