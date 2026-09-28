import React from 'react';
import { Bar, Frac, Circle, Eq, Note } from '../primitives';

// 101.1 מה זה שבר — one scene per rule of the written theory.
const scenes = [
  {
    name: 'מונה ומכנה',
    steps: [
      {
        caption: 'פיצה שלמה. חותכים אותה ל-4 משולשים שווים.',
        draw: () => (<>
          <Circle cx={320} cy={140} r={90} n={4} k={0} anim="pop" />
          <Note x={320} y={262} anim="fadein d3">4 חלקים שווים</Note>
        </>),
      },
      {
        caption: 'אכלנו 3 משולשים. אכלנו 3/4 מהפיצה.',
        draw: () => (<>
          <Circle cx={230} cy={140} r={90} n={4} k={3} anim="pop" />
          <Frac x={470} y={140} n={3} d={4} anim="pop d2" />
        </>),
      },
      {
        caption: 'המספר התחתון הוא המכנה: לכמה חלקים חילקנו (4). העליון הוא המונה: כמה לקחנו (3).',
        draw: () => (<>
          <Circle cx={230} cy={140} r={90} n={4} k={3} />
          <Frac x={470} y={140} n={3} d={4} />
          <Note x={560} y={112} anim="fadein d1">מונה ← לקחנו 3</Note>
          <Note x={560} y={170} anim="fadein d3">מכנה ← חילקנו ל-4</Note>
        </>),
      },
    ],
  },
  {
    name: 'אותו שבר, צורות שונות',
    steps: [
      {
        caption: '2/5 זה 2 חלקים מתוך 5 שווים. לא משנה מה צורת השלם.',
        draw: () => (<>
          <Frac x={60} y={100} n={2} d={5} anim="pop" />
          <Bar y={73} n={5} k={2} anim="rise" />
        </>),
      },
      {
        caption: 'גם בעיגול: 5 חלקים שווים, 2 צבועים. אותו 2/5.',
        draw: () => (<>
          <Frac x={60} y={100} n={2} d={5} />
          <Bar y={73} n={5} k={2} />
          <Circle cx={320} cy={215} r={55} n={5} k={2} anim="pop d2" />
          <Eq x={420} y={215} anim="fadein d3">=</Eq>
          <Frac x={470} y={215} n={2} d={5} anim="pop d4" />
        </>),
      },
    ],
  },
  {
    name: 'שבר מתוך קבוצה',
    steps: [
      {
        caption: 'השלם יכול להיות קבוצה: 6 כדורים. 4 מהם אדומים.',
        draw: () => (<>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={140 + i * 72} cy={130} r={26} className={`la-part ${i < 4 ? 'sum' : 'empty'} pop d${Math.min(5, i + 1)}`} style={{ transformOrigin: `${140 + i * 72}px 130px` }} />
          ))}
        </>),
      },
      {
        caption: 'המכנה הוא כל הקבוצה (6), המונה הוא מה שספרנו (4): 4/6 מהכדורים אדומים.',
        draw: () => (<>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={140 + i * 72} cy={110} r={26} className={`la-part ${i < 4 ? 'sum' : 'empty'}`} />
          ))}
          <Frac x={320} y={215} n={4} d={6} anim="pop d2" />
        </>),
      },
    ],
  },
  {
    name: 'שלם ואפס',
    steps: [
      {
        caption: 'כשלוקחים את כל 4 החלקים, זה 4/4: שלם אחד. המונה שווה למכנה.',
        draw: () => (<>
          <Circle cx={230} cy={140} r={80} n={4} k={4} anim="pop" />
          <Frac x={420} y={140} n={4} d={4} anim="pop d2" />
          <Eq x={480} y={140} anim="fadein d3">=</Eq>
          <Eq x={530} y={140} anim="pop d4">1</Eq>
        </>),
      },
      {
        caption: 'וכשלא לוקחים כלום, 0/4: זה 0.',
        draw: () => (<>
          <Circle cx={230} cy={140} r={80} n={4} k={0} anim="pop" />
          <Frac x={420} y={140} n={0} d={4} anim="pop d2" />
          <Eq x={480} y={140} anim="fadein d3">=</Eq>
          <Eq x={530} y={140} anim="pop d4">0</Eq>
        </>),
      },
    ],
  },
  {
    name: 'שבר מתוך כמות',
    steps: [
      {
        caption: 'כמה זה 3/5 מ-30 ₪? מחלקים את 30 ל-5 חלקים שווים.',
        draw: () => (<>
          <Frac x={60} y={110} n={3} d={5} anim="pop" />
          <Bar y={83} n={5} k={0} anim="rise" labelParts={false} />
          {[0, 1, 2, 3, 4].map((i) => <Note key={i} x={120 + 40 + i * 80} y={160} anim={`fadein d${i + 1}`}>6 ₪</Note>)}
          <Note x={320} y={220} anim="fadein d5">30 ÷ 5 = 6</Note>
        </>),
      },
      {
        caption: 'כל חלק הוא 6 ₪. לוקחים 3 חלקים: 6 × 3 = 18 ₪.',
        draw: () => (<>
          <Frac x={60} y={110} n={3} d={5} />
          <Bar y={83} n={5} k={3} anim="rise" />
          {[0, 1, 2, 3, 4].map((i) => <Note key={i} x={120 + 40 + i * 80} y={160}>6 ₪</Note>)}
          <Note x={320} y={220} anim="fadein d3">6 × 3 = 18 ₪</Note>
        </>),
      },
    ],
  },
];

export default scenes;
