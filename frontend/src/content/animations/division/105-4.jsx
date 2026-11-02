import React from 'react';
import { Expr } from '../primitives';
import { longScene, LdStage } from './longSteps';

// 105.4 חילוק ארוך: מספר תלת-ספרתי — hundreds, tens, ones; two digits when
// the hundreds are too small; a zero in the quotient; a remainder and the
// check by multiplication.
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  longScene('מאות, עשרות, אחדות', 576, 4, {
    intro: '576 ÷ 4: אותם ארבעה צעדים, שלוש פעמים: מאות, עשרות ואחדות.',
  }),
  longScene('מתחילים בשתי ספרות', 256, 8, {
    intro: '256 ÷ 8: הספרה 2 קטנה מ-8, ולכן אין מאות במנה, והמנה בת שתי ספרות.',
  }),
  longScene('אפס במנה', 412, 4, {
    intro: '412 ÷ 4: לכל ספרה שמורידים יש ספרה במנה, גם כשהיא 0.',
  }),
  longScene('שארית, ובדיקה בכפל', 749, 6, {
    extra: [{
      caption: 'בודקים: 124 × 6 + 5 = 749. יצא המחולק, והשארית 5 קטנה מ-6.',
      draw: () => (<>
        <LdStage a={749} d={6} upto={3} notes={[{ text: 'בודקים בכפל' }]} />
        <Expr x={455} y={170} size={24} gap={10} tokens={['124', '×', '6', '+', { t: '5', cls: 'b' }, '=', R('749')]} />
      </>),
    }],
  }),
];

export default scenes;
