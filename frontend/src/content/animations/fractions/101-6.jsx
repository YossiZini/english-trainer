import React from 'react';
import { Bar, Frac, Circle, Eq, Note, NumberLine } from '../primitives';

// 101.6 מספרים מעורבים ושברים מדומים — one scene per rule of the written theory.
const row3 = (k3, color = 'a', anim = '') => (<>
  <Circle cx={170} cy={130} r={58} n={3} k={3} color={color} anim={anim ? `${anim}` : ''} />
  <Circle cx={320} cy={130} r={58} n={3} k={3} color={color} anim={anim ? `${anim} d1` : ''} />
  <Circle cx={470} cy={130} r={58} n={3} k={k3} color={color} anim={anim ? `${anim} d2` : ''} />
</>);

const scenes = [
  {
    name: 'יותר משלם אחד',
    steps: [
      {
        caption: 'אפשר לאכול יותר מפיצה אחת: שתי פיצות שלמות ועוד שליש.',
        draw: () => (<>{row3(1, 'a', 'pop')}</>),
      },
      {
        caption: 'זה מספר מעורב: 2 1/3 (שלמים ועוד שבר).',
        draw: () => (<>
          {row3(1)}
          <Eq x={280} y={235} anim="pop d2">2</Eq><Frac x={330} y={235} n={1} d={3} anim="pop d2" />
        </>),
      },
      {
        caption: 'ואפשר לספור שלישים: 3 + 3 + 1 = 7 שלישים. זה שבר מדומה: 7/3. המונה גדול מהמכנה.',
        draw: () => (<>
          {row3(1)}
          <Eq x={230} y={235}>2</Eq><Frac x={280} y={235} n={1} d={3} />
          <Eq x={340} y={235} anim="fadein d1">=</Eq>
          <Frac x={400} y={235} n={7} d={3} anim="pop d2" />
        </>),
      },
    ],
  },
  {
    name: 'ממעורב למדומה',
    steps: [
      {
        caption: '3 2/5 כשבר מדומה. כל שלם הוא 5 חמישיות: 3 שלמים הם 3 × 5 = 15 חמישיות.',
        draw: () => (<>
          <Circle cx={120} cy={120} r={50} n={5} k={5} anim="pop" />
          <Circle cx={240} cy={120} r={50} n={5} k={5} anim="pop d1" />
          <Circle cx={360} cy={120} r={50} n={5} k={5} anim="pop d2" />
          <Circle cx={480} cy={120} r={50} n={5} k={2} color="b" anim="pop d3" />
          <Note x={320} y={215} anim="fadein d4">3 × 5 = 15 חמישיות</Note>
        </>),
      },
      {
        caption: 'ועוד 2 חמישיות: 15 + 2 = 17. לכן 3 2/5 = 17/5. כופלים שלמים במכנה ומוסיפים את המונה.',
        draw: () => (<>
          <Eq x={150} y={140}>3</Eq><Frac x={200} y={140} n={2} d={5} />
          <Eq x={260} y={140} anim="fadein d1">=</Eq>
          <Frac x={340} y={140} n="3×5+2" d={5} anim="pop d2" />
          <Eq x={430} y={140} anim="fadein d3">=</Eq>
          <Frac x={500} y={140} n={17} d={5} anim="pop d4" />
        </>),
      },
    ],
  },
  {
    name: 'ממדומה למעורב',
    steps: [
      {
        caption: '11/4 כמספר מעורב. 11 רבעים: מקבצים כל 4 רבעים לשלם.',
        draw: () => (<>
          <Bar x={60} y={110} w={520} n={11} k={11} anim="rise" />
          <Note x={320} y={200} anim="fadein d2">11 רבעים</Note>
        </>),
      },
      {
        caption: '11 ÷ 4 = 2 ושארית 3: שני שלמים ועוד 3 רבעים. 11/4 = 2 3/4.',
        draw: () => (<>
          <Circle cx={150} cy={120} r={58} n={4} k={4} anim="pop" />
          <Circle cx={300} cy={120} r={58} n={4} k={4} anim="pop d1" />
          <Circle cx={450} cy={120} r={58} n={4} k={3} color="b" anim="pop d2" />
          <Frac x={230} y={230} n={11} d={4} /><Eq x={290} y={230} anim="fadein d3">=</Eq>
          <Eq x={340} y={230} anim="pop d4">2</Eq><Frac x={390} y={230} n={3} d={4} anim="pop d4" />
        </>),
      },
    ],
  },
  {
    name: 'ישר המספרים',
    steps: [
      {
        caption: '3/4 נמצא לפני 1, ו-1 1/4 נמצא בין 1 ל-2, רבע אחרי ה-1.',
        draw: () => (<>
          <NumberLine y={150} from={0} to={2} den={4} points={[{ value: 0.75, label: '3/4' }, { value: 1.25, label: '1 1/4' }]} anim="fadein" />
        </>),
      },
      {
        caption: 'החלק השלם אומר בין אילו שלמים המספר נמצא: 2 3/5 נמצא בין 2 ל-3.',
        draw: () => (<>
          <NumberLine y={150} from={0} to={3} den={5} points={[{ value: 2.6, label: '2 3/5' }]} anim="fadein" />
          <Note x={320} y={230} anim="fadein d3">בין 2 ל-3</Note>
        </>),
      },
    ],
  },
  {
    name: 'חיבור מספרים מעורבים',
    steps: [
      {
        caption: '1 1/2 + 2 3/4. דרך א: שלמים עם שלמים, שברים עם שברים.',
        draw: () => (<>
          <Eq x={110} y={140} anim="pop">1</Eq><Frac x={155} y={140} n={1} d={2} anim="pop" />
          <Eq x={215} y={140}>+</Eq>
          <Eq x={270} y={140} anim="pop d1">2</Eq><Frac x={315} y={140} n={3} d={4} anim="pop d1" />
          <Note x={320} y={230} anim="fadein d3">שלמים: 1 + 2 = 3</Note>
        </>),
      },
      {
        caption: 'שברים: 1/2 + 3/4 = 2/4 + 3/4 = 5/4, וזה 1 1/4. יחד: 3 + 1 1/4 = 4 1/4.',
        draw: () => (<>
          <Frac x={60} y={100} n={2} d={4} /><Bar y={73} n={4} k={2} />
          <Bar y={178} n={4} k={3} color="b" onlyFilled slide={{ dy: -105 }} />
          <Frac x={60} y={205} n={3} d={4} />
          <Circle cx={590} cy={100} r={30} n={4} k={4} color="sum" anim="pop d4" />
          <Note x={320} y={255} anim="fadein d5">5 רבעים = שלם ועוד רבע, סך הכול 4 1/4</Note>
        </>),
      },
      {
        caption: 'דרך ב: הופכים לשברים מדומים. 3/2 + 11/4 = 6/4 + 11/4 = 17/4 = 4 1/4.',
        draw: () => (<>
          <Frac x={90} y={140} n={3} d={2} anim="pop" /><Eq x={135} y={140}>+</Eq>
          <Frac x={180} y={140} n={11} d={4} anim="pop d1" /><Eq x={230} y={140}>=</Eq>
          <Frac x={280} y={140} n={6} d={4} anim="pop d2" /><Eq x={325} y={140}>+</Eq>
          <Frac x={370} y={140} n={11} d={4} anim="pop d3" /><Eq x={420} y={140}>=</Eq>
          <Frac x={470} y={140} n={17} d={4} anim="pop d4" /><Eq x={520} y={140}>=</Eq>
          <Eq x={560} y={140} anim="pop d5">4</Eq><Frac x={600} y={140} n={1} d={4} anim="pop d5" />
        </>),
      },
    ],
  },
];

export default scenes;
