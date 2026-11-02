import React from 'react';
import { Counters, DotArray, DivEq, Expr, Note } from '../primitives';

// 100.3 חזרה: כפל, חילוק ובעיות מילוליות — knowing the whole or a part:
// multiply for the whole, divide for a part, a missing number by the
// inverse operation, a two-step problem.
const AREA = { x: 20, y: 8, w: 600, h: 195 };
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  {
    name: 'רוצים את הכול: כופלים',
    steps: [
      {
        caption: 'ב-5 קופסאות יש 6 עפרונות בכל אחת. כמה עפרונות בסך הכול?',
        draw: () => (<>
          <Counters total={30} each={6} phase="gather" labels {...AREA} />
          <Expr y={245} size={28} tokens={['5', '×', '6', '=', { t: '?', cls: 'dim' }]} />
        </>),
      },
      {
        caption: 'יודעים חלק ורוצים את הכול, ולכן כופלים: 5 × 6 = 30.',
        draw: () => (<>
          <Counters total={30} each={6} labels {...AREA} />
          <Expr y={245} size={28} tokens={['5', '×', '6', '=', R('30')]} />
        </>),
      },
    ],
  },
  {
    name: 'יודעים את הכול: מחלקים',
    steps: [
      {
        caption: '30 עפרונות מתחלקים שווה ל-5 קופסאות. כמה בכל קופסה?',
        draw: () => (<>
          <Counters total={30} each={6} phase="pile" {...AREA} />
          <DivEq a={30} d={5} />
        </>),
      },
      {
        caption: 'יודעים את הכול, ולכן מחלקים: 30 ÷ 5 = 6 עפרונות בכל קופסה.',
        draw: () => (<>
          <Counters total={30} each={6} phase="gather" labels {...AREA} />
          <DivEq a={30} d={5} q={6} qAnim="pop d5" />
        </>),
      },
      {
        caption: 'וכמה קופסאות צריך ל-30 עפרונות, 6 בכל קופסה? 30 ÷ 6 = 5 קופסאות.',
        draw: () => (<>
          <Counters total={30} each={6} labels {...AREA} />
          <DivEq a={30} d={6} q={5} />
        </>),
      },
    ],
  },
  {
    name: 'מספר חסר',
    steps: [
      {
        caption: 'חסר גורם בכפל, ? × 8 = 48: מחלקים, 48 ÷ 8 = 6.',
        draw: () => (<>
          <DotArray rows={6} cols={8} phase="gather" {...AREA} />
          <Expr y={245} size={28} tokens={[R('6', 'pop d5'), '×', '8', '=', '48']} />
        </>),
      },
      {
        caption: 'חסר המחולק, ? ÷ 4 = 9: כופלים, 9 × 4 = 36.',
        draw: () => (<>
          <Counters total={36} each={9} phase="gather" labels {...AREA} />
          <Expr y={245} size={28} tokens={[R('36', 'pop d5'), '÷', '4', '=', '9']} />
        </>),
      },
    ],
  },
  {
    name: 'בעיה בשני שלבים',
    steps: [
      {
        caption: 'בכיתה 4 שורות של 6 שולחנות. שלב ראשון, כמה שולחנות: 4 × 6 = 24.',
        draw: () => (<>
          <DotArray rows={4} cols={6} phase="gather" x={20} y={8} w={600} h={170} />
          <Expr y={225} size={28} tokens={['4', '×', '6', '=', R('24', 'pop d5')]} />
        </>),
      },
      {
        caption: 'בכל שולחן יושבים 2 ילדים. שלב שני, כמה ילדים: 24 × 2 = 48. לא עוצרים אחרי השלב הראשון.',
        draw: () => (<>
          <DotArray rows={4} cols={12} splitCols={6} phase="gather" x={20} y={8} w={600} h={150} />
          <Expr y={195} size={24} tokens={[{ t: '4', cls: 'dim' }, { t: '×', cls: 'dim' }, { t: '6', cls: 'dim' }, { t: '=', cls: 'dim' }, { t: '24', cls: 'dim' }]} />
          <Expr y={245} size={28} tokens={['24', '×', '2', '=', R('48', 'pop d5')]} />
        </>),
      },
    ],
  },
];

export default scenes;
