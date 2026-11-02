import React from 'react';
import { Counters, DotArray, Expr, Note } from '../primitives';

// 100.1 כפל עד 10×10 — one scene per rule of the written theory: equal
// groups, the order of the factors (an array that turns), × 10 and × 5,
// × 9 as × 10 minus one column, doubling for × 4 and × 8, squares.
const AREA = { x: 20, y: 8, w: 600, h: 195 };
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });
const EQ_Y = 245;

const scenes = [
  {
    name: 'קבוצות שוות',
    steps: [
      {
        caption: '3 × 4: שלוש קבוצות, ובכל אחת 4.',
        draw: () => (<>
          <Counters total={12} each={4} phase="pile" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['3', '×', '4', '=', { t: '?', cls: 'dim' }]} />
        </>),
      },
      {
        caption: 'מסדרים בקבוצות של 4: קבוצה ראשונה, שנייה, שלישית.',
        draw: () => (<>
          <Counters total={12} each={4} phase="gather" labels {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['3', '×', '4', '=', { t: '?', cls: 'dim' }]} />
        </>),
      },
      {
        caption: 'סופרים את הכול: 4 + 4 + 4 = 12, ולכן 3 × 4 = 12.',
        draw: () => (<>
          <Counters total={12} each={4} labels {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['4', '+', '4', '+', '4', '=', R('12')]} />
        </>),
      },
    ],
  },
  {
    name: 'סדר המספרים',
    steps: [
      {
        caption: '3 שורות של 4 נקודות: 3 × 4 = 12.',
        draw: () => (<>
          <DotArray rows={3} cols={4} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['3', '×', '4', '=', R('12', 'pop d5')]} />
        </>),
      },
      {
        caption: 'מסובבים את התמונה: 4 שורות של 3, אותן 12 נקודות. לכן 3 × 4 = 4 × 3 = 12.',
        draw: () => (<>
          <DotArray rows={4} cols={3} phase="turn" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['3', '×', '4', '=', '4', '×', '3', '=', R('12', 'pop d5')]} />
        </>),
      },
    ],
  },
  {
    name: 'כפול 10 וכפול 5',
    steps: [
      {
        caption: 'כפול 10: מוסיפים 0 בסוף. 3 × 10 = 30, שלוש שורות של 10.',
        draw: () => (<>
          <DotArray rows={3} cols={10} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['3', '×', '10', '=', R('30', 'pop d5')]} />
        </>),
      },
      {
        caption: 'כפול 5 הוא חצי מכפול 10: 3 × 5 = 15, חצי מ-30.',
        draw: () => (<>
          <DotArray rows={3} cols={10} fadeCols={5} {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['3', '×', '5', '=', R('15')]} />
        </>),
      },
    ],
  },
  {
    name: 'כפול 9',
    steps: [
      {
        caption: '6 × 9: קודם 6 × 10 = 60, שש שורות של 10.',
        draw: () => (<>
          <DotArray rows={6} cols={10} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['6', '×', '10', '=', R('60', 'pop d5')]} />
        </>),
      },
      {
        caption: 'מורידים עמודה אחת, 6 נקודות: 6 × 9 = 60 − 6 = 54.',
        draw: () => (<>
          <DotArray rows={6} cols={10} fadeCols={1} {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['6', '×', '9', '=', '60', '−', '6', '=', R('54')]} />
        </>),
      },
    ],
  },
  {
    name: 'כפול 4 וכפול 8',
    steps: [
      {
        caption: '2 × 7 = 14: שתי שורות של 7.',
        draw: () => (<>
          <DotArray rows={2} cols={7} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['2', '×', '7', '=', R('14', 'pop d4')]} />
        </>),
      },
      {
        caption: 'כפול 4 הוא כפול 2 פעמיים: 4 × 7 = 14 + 14 = 28.',
        draw: () => (<>
          <DotArray rows={4} cols={7} splitRows={2} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['4', '×', '7', '=', '14', '+', { t: '14', cls: 'b' }, '=', R('28', 'pop d5')]} />
        </>),
      },
      {
        caption: 'וכפול 8 הוא כפול 4 פעמיים: 8 × 7 = 28 + 28 = 56.',
        draw: () => (<>
          <DotArray rows={8} cols={7} splitRows={4} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['8', '×', '7', '=', '28', '+', { t: '28', cls: 'b' }, '=', R('56', 'pop d5')]} />
        </>),
      },
    ],
  },
  {
    name: 'מספר כפול עצמו',
    steps: [
      {
        caption: 'כשכופלים מספר בעצמו, הנקודות יוצרות ריבוע: 6 × 6 = 36.',
        draw: () => (<>
          <DotArray rows={6} cols={6} phase="gather" {...AREA} />
          <Expr y={EQ_Y} size={28} tokens={['6', '×', '6', '=', R('36', 'pop d5')]} />
        </>),
      },
      {
        caption: 'כדאי לזכור את כל הריבועים: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.',
        draw: () => (<>
          <Note x={320} y={70} anim="fadein">הריבועים בלוח הכפל</Note>
          <Expr y={140} size={26} gap={18} hl={[5, 5]} tokens={['1', '4', '9', '16', '25', R('36', ''), '49', '64', '81', '100'].map((t, i) => (typeof t === 'string' ? { t, anim: `pop d${Math.min(5, i + 1)}` } : t))} />
          <Note x={320} y={215} anim="fadein d5">6 × 6 = 36</Note>
        </>),
      },
    ],
  },
];

export default scenes;
