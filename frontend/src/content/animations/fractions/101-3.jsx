import React from 'react';
import { Bar, Frac, Circle, Eq, Note, NumberLine, Arrow, ArrowDefs } from '../primitives';

// 101.3 השוואת שברים — one scene per rule of the written theory.
const scenes = [
  {
    name: 'אותו מכנה',
    steps: [
      {
        caption: '5/7 או 3/7? כשהחלקים באותו גודל, סופרים חלקים.',
        draw: () => (<>
          <Frac x={60} y={80} n={5} d={7} anim="pop" /><Bar y={53} n={7} k={5} anim="rise" />
          <Frac x={60} y={200} n={3} d={7} anim="pop d1" /><Bar y={173} n={7} k={3} color="b" anim="rise d1" />
        </>),
      },
      {
        caption: '5 חלקים זה יותר מ-3 חלקים. לכן 5/7 גדול מ-3/7. המונה הגדול מנצח.',
        draw: () => (<>
          <Frac x={60} y={80} n={5} d={7} /><Bar y={53} n={7} k={5} />
          <Frac x={60} y={200} n={3} d={7} /><Bar y={173} n={7} k={3} color="b" />
          <Eq x={600} y={140} anim="pop d2">&gt;</Eq>
        </>),
      },
    ],
  },
  {
    name: 'אותו מונה',
    steps: [
      {
        caption: '2/3 או 2/5? לוקחים 2 חלקים בשני המקרים, אבל החלקים בגודל שונה.',
        draw: () => (<>
          <Circle cx={200} cy={140} r={80} n={3} k={2} anim="pop" />
          <Frac x={310} y={140} n={2} d={3} anim="pop d1" />
          <Circle cx={440} cy={140} r={80} n={5} k={2} color="b" anim="pop d2" />
          <Frac x={560} y={140} n={2} d={5} anim="pop d3" />
        </>),
      },
      {
        caption: 'שליש גדול מחמישית, כי חילקנו לפחות חלקים. לכן 2/3 גדול מ-2/5. המכנה הקטן מנצח.',
        draw: () => (<>
          <Circle cx={200} cy={140} r={80} n={3} k={2} />
          <Frac x={310} y={140} n={2} d={3} />
          <Eq x={375} y={140} anim="pop d2">&gt;</Eq>
          <Circle cx={470} cy={140} r={80} n={5} k={2} color="b" />
          <Frac x={585} y={140} n={2} d={5} />
        </>),
      },
    ],
  },
  {
    name: 'מכנה משותף',
    steps: [
      {
        caption: '2/3 או 3/5? גם המונים וגם המכנים שונים. אי אפשר להשוות ישירות.',
        draw: () => (<>
          <Frac x={60} y={80} n={2} d={3} anim="pop" /><Bar y={53} n={3} k={2} anim="rise" />
          <Frac x={60} y={200} n={3} d={5} anim="pop d1" /><Bar y={173} n={5} k={3} color="b" anim="rise d1" />
          <Eq x={600} y={140} anim="shake d4">?</Eq>
        </>),
      },
      {
        caption: 'מרחיבים למכנה משותף 15: 2/3 = 10/15 (כל שליש לחמישה), 3/5 = 9/15 (כל חמישית לשלושה).',
        draw: () => (<>
          <Frac x={60} y={80} n={2} d={3} /><Bar y={53} n={3} k={2} subdiv={5} /><Frac x={590} y={80} n={10} d={15} anim="pop d3" />
          <Frac x={60} y={200} n={3} d={5} /><Bar y={173} n={5} k={3} color="b" subdiv={3} /><Frac x={590} y={200} n={9} d={15} anim="pop d3" />
        </>),
      },
      {
        caption: 'עכשיו החלקים שווים: 10 חלקים לעומת 9. לכן 2/3 גדול מ-3/5.',
        draw: () => (<>
          <Frac x={60} y={80} n={10} d={15} /><Bar y={53} n={15} k={10} />
          <Frac x={60} y={200} n={9} d={15} /><Bar y={173} n={15} k={9} color="b" />
          <Eq x={600} y={140} anim="pop d2">&gt;</Eq>
        </>),
      },
    ],
  },
  {
    name: 'השוואה לחצי',
    steps: [
      {
        caption: 'דרך מהירה: האם השבר גדול מחצי? 5/8: חצי מ-8 הוא 4, ו-5 גדול מ-4.',
        draw: () => (<>
          <Frac x={60} y={100} n={5} d={8} anim="pop" /><Bar y={73} n={8} k={5} anim="rise" />
          <line x1={320} y1={60} x2={320} y2={140} className="la-dashed draw d2" style={{ transformOrigin: '320px 100px' }} />
          <Note x={320} y={160} anim="fadein d3">חצי</Note>
          <Note x={320} y={225} anim="fadein d4">5/8 גדול מחצי</Note>
        </>),
      },
      {
        caption: '3/8 לעומת 5/9: 3/8 קטן מחצי (3 קטן מ-4), 5/9 גדול מחצי (5 גדול מ-4.5). לכן 5/9 גדול, בלי מכנה משותף.',
        draw: () => (<>
          <Frac x={60} y={80} n={3} d={8} /><Bar y={53} n={8} k={3} anim="rise" />
          <Frac x={60} y={200} n={5} d={9} /><Bar y={173} n={9} k={5} color="b" anim="rise d1" />
          <line x1={320} y1={40} x2={320} y2={240} className="la-dashed draw d2" style={{ transformOrigin: '320px 140px' }} />
          <Note x={320} y={262} anim="fadein d3">חצי</Note>
          <Eq x={600} y={140} anim="pop d4">&lt;</Eq>
        </>),
      },
    ],
  },
  {
    name: 'ישר המספרים',
    steps: [
      {
        caption: 'כל שבר הוא נקודה על ישר המספרים. 3/8 ו-3/4 על ישר מחולק לשמיניות.',
        draw: () => (<>
          <NumberLine y={150} den={8} points={[{ value: 3 / 8, label: '3/8' }, { value: 3 / 4, label: '3/4' }]} anim="fadein" />
        </>),
      },
      {
        caption: 'ימינה זה יותר גדול. 3/4 נמצא ימינה מ-3/8, לכן 3/4 גדול יותר.',
        draw: () => (<>
          <NumberLine y={150} den={8} points={[{ value: 3 / 8, label: '3/8' }, { value: 3 / 4, label: '3/4' }]} />
          <ArrowDefs />
          <Arrow d="M 270 100 L 430 100" anim="fadein d2" />
          <Note x={320} y={230} anim="fadein d3">3/4 &gt; 3/8</Note>
        </>),
      },
    ],
  },
];

export default scenes;
