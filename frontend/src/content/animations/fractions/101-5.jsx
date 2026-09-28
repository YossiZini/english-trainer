import React from 'react';
import { Bar, Frac, Circle, Eq, Note, Grid } from '../primitives';

// 101.5 כפל וחילוק שברים — one scene per rule of the written theory.
const scenes = [
  {
    name: 'שבר כפול מספר',
    steps: [
      {
        caption: '3 × 1/4: שלוש פעמים רבע.',
        draw: () => (<>
          <Eq x={80} y={140} anim="pop">3 ×</Eq>
          <Circle cx={200} cy={140} r={60} n={4} k={1} anim="pop d1" />
          <Circle cx={340} cy={140} r={60} n={4} k={1} anim="pop d2" />
          <Circle cx={480} cy={140} r={60} n={4} k={1} anim="pop d3" />
        </>),
      },
      {
        caption: 'שלושה רבעים ביחד: 3/4. כופלים את המונה, המכנה נשאר.',
        draw: () => (<>
          <Eq x={80} y={140}>3 ×</Eq>
          <Frac x={150} y={140} n={1} d={4} />
          <Eq x={210} y={140} anim="fadein d1">=</Eq>
          <Circle cx={320} cy={140} r={70} n={4} k={3} anim="pop d2" />
          <Eq x={430} y={140} anim="fadein d3">=</Eq>
          <Frac x={490} y={140} n={3} d={4} anim="pop d4" />
        </>),
      },
    ],
  },
  {
    name: 'שבר כפול שבר',
    steps: [
      {
        caption: '2/3 × 3/4 פירושו: שני שלישים מתוך שלושה רבעים. נצבע 3/4 מהריבוע בעמודות.',
        draw: () => (<>
          <Grid x={220} y={40} size={200} rows={3} cols={4} shadeRows={0} shadeCols={3} anim="pop" />
          <Frac x={520} y={140} n={3} d={4} anim="pop d2" />
          <Note x={320} y={262} anim="fadein d3">3 עמודות מתוך 4</Note>
        </>),
      },
      {
        caption: 'עכשיו 2/3 מזה, בשורות. החלק הצבוע פעמיים הוא התוצאה.',
        draw: () => (<>
          <Grid x={220} y={40} size={200} rows={3} cols={4} shadeRows={2} shadeCols={3} />
          <Frac x={120} y={140} n={2} d={3} anim="pop" />
          <Note x={320} y={262} anim="fadein d2">2 שורות מתוך 3</Note>
        </>),
      },
      {
        caption: '6 משבצות כפולות מתוך 12: 2/3 × 3/4 = 6/12 = 1/2. מונה במונה, מכנה במכנה.',
        draw: () => (<>
          <Grid x={40} y={40} size={200} rows={3} cols={4} shadeRows={2} shadeCols={3} />
          <Frac x={310} y={140} n={2} d={3} /><Eq x={355} y={140}>×</Eq>
          <Frac x={400} y={140} n={3} d={4} /><Eq x={445} y={140}>=</Eq>
          <Frac x={490} y={140} n={6} d={12} anim="pop d2" /><Eq x={540} y={140} anim="fadein d3">=</Eq>
          <Frac x={590} y={140} n={1} d={2} anim="pop d4" />
        </>),
      },
    ],
  },
  {
    name: 'מצמצמים לפני הכפל',
    steps: [
      {
        caption: '4/5 × 15/16. במקום לכפול מספרים גדולים, מצמצמים לפני: 4 עם 16, ו-5 עם 15.',
        draw: () => (<>
          <Frac x={150} y={140} n={4} d={5} anim="pop" /><Eq x={220} y={140}>×</Eq>
          <Frac x={290} y={140} n={15} d={16} anim="pop d1" />
          <line x1={130} y1={124} x2={310} y2={156} className="la-dashed draw d3" style={{ transformOrigin: '220px 140px' }} />
          <line x1={130} y1={156} x2={310} y2={124} className="la-dashed draw d3" style={{ transformOrigin: '220px 140px' }} />
          <Note x={220} y={60} anim="fadein d4">4 ו-16: מחלקים ב-4</Note>
          <Note x={220} y={225} anim="fadein d5">5 ו-15: מחלקים ב-5</Note>
        </>),
      },
      {
        caption: 'נשאר 1/1 × 3/4 = 3/4. אותה תוצאה, בלי לחשב 60/80.',
        draw: () => (<>
          <Frac x={150} y={140} n={1} d={1} anim="pop" /><Eq x={220} y={140}>×</Eq>
          <Frac x={290} y={140} n={3} d={4} anim="pop d1" /><Eq x={360} y={140} anim="fadein d2">=</Eq>
          <Frac x={430} y={140} n={3} d={4} anim="pop d3" />
          <Bar x={480} y={113} w={140} n={4} k={3} anim="rise d4" />
        </>),
      },
    ],
  },
  {
    name: 'חילוק בשבר',
    steps: [
      {
        caption: '3 ÷ 1/2 שואל: כמה חצאים יש ב-3 שלמים?',
        draw: () => (<>
          <Circle cx={180} cy={140} r={62} n={2} k={2} anim="pop" />
          <Circle cx={320} cy={140} r={62} n={2} k={2} anim="pop d1" />
          <Circle cx={460} cy={140} r={62} n={2} k={2} anim="pop d2" />
          <Note x={320} y={250} anim="fadein d4">בכל שלם 2 חצאים</Note>
        </>),
      },
      {
        caption: '6 חצאים. לכן 3 ÷ 1/2 = 3 × 2 = 6. לחלק בשבר זה לכפול בשבר ההופכי.',
        draw: () => (<>
          <Eq x={110} y={140}>3 ÷</Eq><Frac x={165} y={140} n={1} d={2} />
          <Eq x={230} y={140} anim="fadein d1">=</Eq>
          <Eq x={290} y={140} anim="pop d2">3 ×</Eq><Frac x={350} y={140} n={2} d={1} anim="pop d2" />
          <Eq x={415} y={140} anim="fadein d3">=</Eq><Eq x={470} y={140} anim="pop d4">6</Eq>
          <Note x={320} y={240} anim="fadein d5">ההופכי של 1/2 הוא 2/1</Note>
        </>),
      },
      {
        caption: 'וכך גם 3/4 ÷ 1/2: כמה חצאים נכנסים ב-3/4? אחד וחצי. 3/4 × 2/1 = 6/4 = 3/2.',
        draw: () => (<>
          <Frac x={60} y={80} n={3} d={4} /><Bar y={53} n={4} k={3} anim="rise" />
          <Frac x={60} y={200} n={1} d={2} /><Bar y={173} n={4} k={2} color="b" anim="rise d1" />
          <Note x={320} y={255} anim="fadein d3">חצי נכנס פעם אחת ועוד חצי פעם: 1 1/2</Note>
        </>),
      },
    ],
  },
  {
    name: 'מקטין או מגדיל?',
    steps: [
      {
        caption: 'כפל בשבר שקטן מ-1 מקטין: חצי מ-8 הוא 4.',
        draw: () => (<>
          <Bar x={120} y={60} w={400} n={8} k={8} anim="rise" />
          <Note x={320} y={40}>8</Note>
          <Bar x={120} y={160} w={400} n={8} k={4} color="b" anim="rise d2" />
          <Note x={320} y={240} anim="fadein d3">8 × 1/2 = 4</Note>
        </>),
      },
      {
        caption: 'וחילוק בשבר שקטן מ-1 מגדיל: ב-8 יש 16 חצאים.',
        draw: () => (<>
          <Bar x={120} y={60} w={400} n={8} k={8} />
          <Note x={320} y={40}>8</Note>
          <Bar x={120} y={160} w={400} n={16} k={16} color="b" anim="rise d1" />
          <Note x={320} y={240} anim="fadein d3">8 ÷ 1/2 = 16</Note>
        </>),
      },
    ],
  },
];

export default scenes;
