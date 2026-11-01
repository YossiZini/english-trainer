import React from 'react';
import { Expr } from '../primitives';
import { longScene, LdStage } from './longSteps';

// 105.3 חילוק ארוך: מספר דו-ספרתי — the four actions (divide, multiply,
// subtract, bring down) one quotient digit at a time; captions and notes
// come from the same steps as the drawing (longSteps.jsx).
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  longScene('עשרות, ואחר כך אחדות', 72, 3, {
    intro: '72 ÷ 3: את 72 כותבים מתחת לקו, את 3 משמאל, והמנה תיכתב מעל הקו, ספרה מעל ספרה.',
  }),
  longScene('מתחילים בשתי ספרות', 56, 7, {
    intro: '56 ÷ 7: הספרה 5 קטנה מ-7, ולכן אין עשרות במנה.',
  }),
  longScene('השארית בסוף', 87, 4, {
    intro: '87 ÷ 4: מחלקים את העשרות, ואחר כך את האחדות. מה שנשאר בסוף הוא השארית.',
  }),
  {
    name: 'בודקים בכפל',
    steps: [
      {
        caption: 'בודקים את 72 ÷ 3 = 24: כופלים 24 × 3 = 72. יצא המחולק.',
        draw: () => <LdStage a={72} d={3} upto={2} notes={[{ text: 'בודקים בכפל' }]} />,
      },
      {
        caption: 'עם שארית מוסיפים אותה: 21 × 4 + 3 = 87.',
        draw: () => <LdStage a={87} d={4} upto={2} notes={[{ text: 'בודקים בכפל' }]} />,
      },
    ].map((step, i) => ({
      ...step,
      draw: () => (<>
        {step.draw()}
        <Expr x={455} y={170} size={26} tokens={i === 0 ? ['24', '×', '3', '=', R('72')] : ['21', '×', '4', '+', { t: '3', cls: 'b' }, '=', R('87')]} />
      </>),
    })),
  },
];

export default scenes;
