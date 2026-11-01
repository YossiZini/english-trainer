import React from 'react';
import { Counters, DivEq, Expr, Note } from '../primitives';

// 105.2 מה עושים עם השארית? — the same division, 30 ÷ 8 = 3 and 6 left
// over, answers three different questions: one more boat for the children
// left on the shore, no fourth notebook for 6 ₪, or the 6 cards left over.
const AREA = { x: 20, y: 8, w: 600, h: 195 };
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  {
    name: 'מוסיפים 1',
    steps: [
      {
        caption: '30 ילדים יוצאים לשייט בסירות של 8 מקומות. כמה סירות צריך?',
        draw: () => (<>
          <Counters total={30} each={8} phase="pile" {...AREA} />
          <DivEq a={30} d={8} />
        </>),
      },
      {
        caption: '30 ÷ 8 = 3, ושארית 6: שלוש סירות מלאות, ו-6 ילדים נשארים על החוף.',
        draw: () => (<>
          <Counters total={30} each={8} phase="gather" labels {...AREA} />
          <DivEq a={30} d={8} q={3} r={6} qAnim="pop d3" rAnim="pop d5" />
        </>),
      },
      {
        caption: 'גם ל-6 הילדים צריך סירה, ולכן מוסיפים 1: צריך 4 סירות.',
        draw: () => (<>
          <Counters total={30} each={8} left="extra" labels {...AREA} />
          <Note x={320} y={245} anim="pop d2">צריך 4 סירות</Note>
        </>),
      },
    ],
  },
  {
    name: 'משמיטים את השארית',
    steps: [
      {
        caption: 'יש 30 ₪, ומחברת עולה 8 ₪. 30 ÷ 8 = 3, ושארית 6.',
        draw: () => (<>
          <Counters total={30} each={8} phase="gather" labels {...AREA} />
          <DivEq a={30} d={8} q={3} r={6} qAnim="pop d3" rAnim="pop d5" />
        </>),
      },
      {
        caption: 'ב-6 ₪ שנשארו אי אפשר לקנות מחברת רביעית, ולכן התשובה 3 מחברות.',
        draw: () => (<>
          <Counters total={30} each={8} left="dim" labels {...AREA} />
          <Note x={320} y={245} anim="pop d2">אפשר לקנות 3 מחברות</Note>
        </>),
      },
    ],
  },
  {
    name: 'התשובה היא השארית',
    steps: [
      {
        caption: 'מחלקים 30 קלפים שווה בשווה ל-8 ילדים, כמה שיותר לכל אחד.',
        draw: () => (<>
          <Counters total={30} each={3} groups={8} phase="pile" {...AREA} />
          <DivEq a={30} d={8} />
        </>),
      },
      {
        caption: 'כל ילד מקבל 3: שמונה קבוצות של 3, ונשארים 6 קלפים. 30 ÷ 8 = 3, ושארית 6.',
        draw: () => (<>
          <Counters total={30} each={3} groups={8} phase="gather" labels {...AREA} />
          <DivEq a={30} d={8} q={3} r={6} qAnim="pop d3" rAnim="pop d5" />
        </>),
      },
      {
        caption: 'השאלה היא כמה קלפים נשארים, ולכן התשובה היא השארית: 6 קלפים.',
        draw: () => (<>
          <Counters total={30} each={3} groups={8} labels {...AREA} />
          <Note x={320} y={245} anim="pop d2">נשארים 6 קלפים</Note>
        </>),
      },
    ],
  },
  {
    name: 'בודקים בסיפור',
    steps: [
      {
        caption: 'ב-4 סירות יש 4 × 8 = 32 מקומות: מספיק ל-30 ילדים.',
        draw: () => (<>
          <Counters total={30} each={8} left="extra" labels {...AREA} />
          <Expr y={245} size={28} tokens={['4', '×', '8', '=', R('32')]} />
        </>),
      },
      {
        caption: 'ב-3 סירות יש רק 3 × 8 = 24 מקומות, ו-6 ילדים נשארים בחוץ. וגם אין "חצי סירה": התשובה מספר שלם.',
        draw: () => (<>
          <Counters total={30} each={8} labels {...AREA} />
          <Expr y={245} size={28} tokens={['3', '×', '8', '=', R('24')]} />
        </>),
      },
    ],
  },
];

export default scenes;
