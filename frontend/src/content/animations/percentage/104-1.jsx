import React from 'react';
import { Bar, Frac, Eq, Note, Expr, HundredGrid, PriceTag, Arrow, ArrowDefs } from '../primitives';

// 104.1 אחוזים — one scene per rule of the written theory.
const R = (t, anim = 'pop d2') => ({ t, cls: 'result', anim });

const scenes = [
  {
    name: 'אחוז, שבר ועשרוני',
    steps: [
      {
        caption: 'אחוז פירושו "מתוך 100". 40% הם 40 משבצות מתוך 100.',
        draw: () => (<>
          <HundredGrid x={80} y={40} size={200} k={40} anim="pop" />
          <Eq x={440} y={140} anim="pop d2">40%</Eq>
          <Note x={440} y={190} anim="fadein d3">40 מתוך 100</Note>
        </>),
      },
      {
        caption: '40% = 40/100 = 0.4, ואחרי צמצום ב-20: 2/5.',
        draw: () => (<>
          <HundredGrid x={40} y={40} size={200} k={40} />
          <Eq x={320} y={110}>40%</Eq><Eq x={375} y={110}>=</Eq>
          <Frac x={425} y={110} n={40} d={100} anim="pop d1" /><Eq x={480} y={110} anim="fadein d2">=</Eq>
          <Eq x={540} y={110} anim="pop d3">0.4</Eq>
          <Eq x={375} y={205}>=</Eq><Frac x={425} y={205} n={2} d={5} anim="pop d4" />
          <Note x={520} y={205} anim="fadein d5">צמצום ב-20</Note>
        </>),
      },
      {
        caption: 'ולהפך: 3/4 = 75/100 = 75%. עשרוני קטן: 0.07 = 7%.',
        draw: () => (<>
          <HundredGrid x={40} y={40} size={200} k={75} anim="pop" />
          <Frac x={320} y={110} n={3} d={4} /><Eq x={375} y={110}>=</Eq>
          <Frac x={430} y={110} n={75} d={100} anim="pop d1" /><Eq x={490} y={110} anim="fadein d2">=</Eq>
          <Eq x={560} y={110} anim="pop d3">75%</Eq>
          <Eq x={450} y={205} anim="pop d4">0.07 = 7%</Eq>
        </>),
      },
    ],
  },
  {
    name: 'אחוז ממספר',
    steps: [
      {
        caption: '25% מ-80: 25% הם רבע, ורבע מ-80 הוא 80 ÷ 4 = 20.',
        draw: () => (<>
          <Note x={320} y={40}>80</Note>
          <Bar y={60} n={4} k={1} anim="rise" />
          {[0, 1, 2, 3].map((i) => <Note key={i} x={170 + i * 100} y={140} anim={`fadein d${i + 1}`}>20</Note>)}
          <Expr y={215} tokens={['80', '÷', '4', '=', R('20', 'pop d5')]} />
        </>),
      },
      {
        caption: '30% מ-150 בעזרת 10%: 10% הם עשירית, 150 ÷ 10 = 15.',
        draw: () => (<>
          <Note x={320} y={40}>150</Note>
          <Bar y={60} n={10} k={1} anim="rise" />
          <Note x={140} y={140} anim="fadein d2">15</Note>
          <Expr y={215} tokens={['150', '÷', '10', '=', R('15', 'pop d3')]} />
        </>),
      },
      {
        caption: '30% הם שלוש פעמים 10%: 15 × 3 = 45.',
        draw: () => (<>
          <Note x={320} y={40}>150</Note>
          <Bar y={60} n={10} k={3} anim="rise" />
          {[0, 1, 2].map((i) => <Note key={i} x={140 + i * 40} y={140} anim={`fadein d${i + 1}`}>15</Note>)}
          <Expr y={215} tokens={['15', '×', '3', '=', R('45', 'pop d4')]} />
        </>),
      },
    ],
  },
  {
    name: 'כמה אחוזים',
    steps: [
      {
        caption: '12 מתוך 40: כמה אחוזים? מחלקים 12 ÷ 40 = 0.3, וכופלים ב-100.',
        draw: () => (<>
          <HundredGrid x={60} y={50} size={180} k={30} anim="pop d3" />
          <Expr x={430} y={110} size={24} tokens={['12', '÷', '40', '=', R('0.3', 'pop d1')]} anim="fadein" />
          <Expr x={430} y={190} size={24} tokens={['0.3', '×', '100', '=', R('30%', 'pop d3')]} />
        </>),
      },
      {
        caption: '45 תשובות נכונות מתוך 50: 45 ÷ 50 = 0.9, כלומר 90%.',
        draw: () => (<>
          <HundredGrid x={60} y={50} size={180} k={90} anim="pop d3" />
          <Expr x={430} y={110} size={24} tokens={['45', '÷', '50', '=', R('0.9', 'pop d1')]} anim="fadein" />
          <Expr x={430} y={190} size={24} tokens={['0.9', '×', '100', '=', R('90%', 'pop d3')]} />
        </>),
      },
    ],
  },
  {
    name: 'מוצאים את השלם',
    steps: [
      {
        caption: '20 תלמידים הם 40% מהכיתה. כמה תלמידים בכיתה כולה (100%)?',
        draw: () => (<>
          <Bar y={60} n={10} k={4} anim="rise" />
          <Note x={200} y={140} anim="fadein d2">40% = 20 תלמידים</Note>
          <Note x={320} y={200} anim="fadein d3">100% = ?</Note>
          <Eq x={600} y={87} anim="shake d4">?</Eq>
        </>),
      },
      {
        caption: 'קודם מוצאים כמה זה 1%: 20 ÷ 40 = 0.5.',
        draw: () => (<>
          <Note x={320} y={60} anim="fadein">40% הם 20, אז 1% הוא</Note>
          <Expr y={150} tokens={['20', '÷', '40', '=', R('0.5')]} />
        </>),
      },
      {
        caption: '100% הם 0.5 × 100 = 50. בכיתה 50 תלמידים.',
        draw: () => (<>
          <Expr y={60} tokens={['0.5', '×', '100', '=', R('50')]} />
          <Bar y={130} n={10} k={10} anim="rise d3" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <Note key={i} x={140 + i * 40} y={210} anim="fadein d4">5</Note>)}
          <Note x={320} y={255} anim="fadein d5">10 × 5 = 50 תלמידים</Note>
        </>),
      },
    ],
  },
  {
    name: 'הנחה ותוספת',
    steps: [
      {
        caption: 'הנחה של 10% על 150 ₪. ההנחה היא 10% מ-150: 150 ÷ 10 = 15 ₪.',
        draw: () => (<>
          <PriceTag x={170} y={120} price={150} label="מחיר מלא" anim="pop" />
          <Expr x={440} y={120} size={24} tokens={['150', '÷', '10', '=', R('15')]} />
          <Note x={440} y={200} anim="fadein d3">ההנחה: 15 ₪</Note>
        </>),
      },
      {
        caption: 'משלמים 150 − 15 = 135 ₪.',
        draw: () => (<>
          <ArrowDefs />
          <PriceTag x={170} y={110} price={150} label="לפני" strike />
          <Arrow d="M 250 110 L 390 110" anim="fadein d1" />
          <PriceTag x={470} y={110} price={135} label="אחרי הנחה" color="a" anim="pop d2" />
          <Expr y={225} tokens={['150', '−', '15', '=', R('135', 'pop d3')]} />
        </>),
      },
      {
        caption: 'תוספת: מוצר ב-200 ₪ ועליו מע"מ 18%. 18% מ-200 הם 36 ₪, ובסך הכול 200 × 1.18 = 236 ₪.',
        draw: () => (<>
          <ArrowDefs />
          <PriceTag x={170} y={110} price={200} label='לפני מע"מ' />
          <Arrow d="M 250 110 L 390 110" anim="fadein d1" />
          <PriceTag x={470} y={110} price={236} label='כולל מע"מ' color="a" anim="pop d2" />
          <Expr y={225} tokens={['200', '×', '1.18', '=', R('236', 'pop d3')]} />
        </>),
      },
      {
        caption: 'מלכודת: הנחה של 20% על 100 ₪ נותנת 80 ₪. תוספת של 20% על 80 היא 16 ₪, ומגיעים ל-96 ₪, לא ל-100.',
        draw: () => (<>
          <ArrowDefs />
          <PriceTag x={110} y={100} price={100} label="מחיר מקורי" />
          <Arrow d="M 185 100 L 250 100" anim="fadein d1" />
          <PriceTag x={320} y={100} price={80} label="אחרי 20% הנחה" anim="pop d1" />
          <Arrow d="M 395 100 L 460 100" anim="fadein d3" />
          <PriceTag x={530} y={100} price={96} label="אחרי 20% תוספת" color="a" anim="pop d3" />
          <Expr y={215} size={24} tokens={['80', '+', '16', '=', R('96', 'pop d4')]} />
          <Note x={320} y={262} anim="shake d5">20% מ-80 הם רק 16, לא 20</Note>
        </>),
      },
    ],
  },
];

export default scenes;
