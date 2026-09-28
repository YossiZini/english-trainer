import React from 'react';
import { Bar, Frac, Eq, Note, Arrow, ArrowDefs } from '../primitives';

// 101.2 שברים שווים וצמצום — one scene per rule of the written theory.
// Captions are plain Hebrew; fractions written a/b are shown stacked.
const Y1 = 73, Y2 = 208;

const scenes = [
  {
    name: 'הרחבה',
    steps: [
      {
        caption: 'נתחיל מהשבר 1/2: שלם שחולק ל-2 חלקים שווים, וחלק אחד צבוע.',
        draw: () => (<>
          <Frac x={60} y={100} n={1} d={2} anim="pop" />
          <Bar y={Y1} n={2} k={1} anim="rise" />
        </>),
      },
      {
        caption: 'נחלק כל חלק ל-2. עכשיו יש 4 חלקים, ו-2 מהם צבועים: 2/4.',
        draw: () => (<>
          <Frac x={60} y={100} n={1} d={2} />
          <Bar y={Y1} n={2} k={1} subdiv={2} />
          <Eq x={60} y={205} anim="fadein d3">=</Eq>
          <Frac x={60} y={235} n={2} d={4} anim="pop d4" />
          <Bar y={Y2} n={4} k={2} anim="rise d3" />
        </>),
      },
      {
        caption: 'הצבע לא זז, רק החלוקה השתנתה. 1/2 = 2/4 = 3/6. ערך השבר נשמר.',
        draw: () => (<>
          <Frac x={60} y={60} n={1} d={2} /><Bar y={33} n={2} k={1} />
          <Frac x={60} y={150} n={2} d={4} /><Bar y={123} n={4} k={2} />
          <Frac x={60} y={240} n={3} d={6} anim="pop" /><Bar y={213} n={6} k={3} anim="rise" />
        </>),
      },
      {
        caption: 'הכלל: כופלים את המונה ואת המכנה באותו מספר. 1/2 × 3/3 = 3/6.',
        draw: () => (<>
          <ArrowDefs />
          <Frac x={150} y={140} n={1} d={2} /><Eq x={210} y={140}>×</Eq>
          <Frac x={265} y={140} n={3} d={3} anim="pop" /><Eq x={325} y={140}>=</Eq>
          <Frac x={385} y={140} n={3} d={6} anim="pop d2" />
          <Arrow d="M150 105 Q 385 40 385 105" anim="fadein d3" />
          <Arrow d="M150 175 Q 385 240 385 175" anim="fadein d3" />
          <Note x={268} y={60} anim="fadein d4">×3</Note>
          <Note x={268} y={222} anim="fadein d4">×3</Note>
        </>),
      },
    ],
  },
  {
    name: 'צמצום',
    steps: [
      {
        caption: 'הפעולה ההפוכה. נתחיל מ-4/8: 8 חלקים, 4 צבועים.',
        draw: () => (<>
          <Frac x={60} y={100} n={4} d={8} anim="pop" />
          <Bar y={Y1} n={8} k={4} anim="rise" />
        </>),
      },
      {
        caption: 'נאחד כל זוג חלקים סמוכים לחלק אחד. מ-8 חלקים נשארו 4.',
        draw: () => (<>
          <Frac x={60} y={100} n={4} d={8} />
          <Bar y={Y1} n={4} k={2} subdiv={2} />
          <Eq x={60} y={205} anim="fadein d3">=</Eq>
          <Frac x={60} y={235} n={2} d={4} anim="pop d4" />
          <Bar y={Y2} n={4} k={2} anim="rise d3" />
        </>),
      },
      {
        caption: 'ושוב: 2/4 = 1/2. השטח הצבוע זהה, רק פחות קווים.',
        draw: () => (<>
          <Frac x={60} y={60} n={4} d={8} /><Bar y={33} n={8} k={4} />
          <Frac x={60} y={150} n={2} d={4} /><Bar y={123} n={4} k={2} />
          <Frac x={60} y={240} n={1} d={2} anim="pop" /><Bar y={213} n={2} k={1} anim="rise" />
        </>),
      },
      {
        caption: 'הכלל: מחלקים את המונה ואת המכנה באותו מספר. 4/8 ÷ 4/4 = 1/2. שבר שאי אפשר לצמצם עוד נקרא מצומצם.',
        draw: () => (<>
          <ArrowDefs />
          <Frac x={150} y={140} n={4} d={8} /><Eq x={210} y={140}>÷</Eq>
          <Frac x={265} y={140} n={4} d={4} anim="pop" /><Eq x={325} y={140}>=</Eq>
          <Frac x={385} y={140} n={1} d={2} anim="pop d2" />
          <Arrow d="M150 105 Q 385 40 385 105" anim="fadein d3" />
          <Arrow d="M150 175 Q 385 240 385 175" anim="fadein d3" />
          <Note x={268} y={60} anim="fadein d4">÷4</Note>
          <Note x={268} y={222} anim="fadein d4">÷4</Note>
        </>),
      },
    ],
  },
  {
    name: 'שבר מצומצם',
    steps: [
      {
        caption: '12/18: גם 12 וגם 18 מתחלקים ב-6. זה המחלק המשותף הגדול ביותר שלהם.',
        draw: () => (<>
          <Frac x={60} y={100} n={12} d={18} anim="pop" />
          <Bar y={Y1} n={18} k={12} anim="rise" />
          <Note x={320} y={170} anim="fadein d3">מחלקים של 12: 1, 2, 3, 4, 6, 12</Note>
          <Note x={320} y={200} anim="fadein d4">מחלקים של 18: 1, 2, 3, 6, 9, 18</Note>
          <circle cx={320} cy={245} r={22} className="la-hl pop d5" style={{ transformOrigin: '320px 245px' }} />
          <Eq x={320} y={245} anim="pop d5">6</Eq>
        </>),
      },
      {
        caption: 'מחלקים בבת אחת ב-6: 12/18 = 2/3. את 2/3 אי אפשר לצמצם עוד, הוא מצומצם.',
        draw: () => (<>
          <Frac x={60} y={80} n={12} d={18} /><Bar y={53} n={18} k={12} />
          <Eq x={60} y={140} anim="fadein d2">=</Eq>
          <Frac x={60} y={200} n={2} d={3} anim="pop d3" /><Bar y={173} n={3} k={2} anim="rise d3" />
          <Note x={320} y={255} anim="fadein d5">ל-2 ול-3 אין מחלק משותף חוץ מ-1</Note>
        </>),
      },
    ],
  },
  {
    name: 'מספר חסר',
    steps: [
      {
        caption: '3/4 = ?/12. שואלים: במה כפלו את 4 כדי לקבל 12?',
        draw: () => (<>
          <Frac x={150} y={140} n={3} d={4} anim="pop" /><Eq x={225} y={140}>=</Eq>
          <Frac x={300} y={140} n="?" d={12} anim="pop d1" />
          <Bar x={380} y={113} w={220} n={4} k={3} anim="rise d2" />
        </>),
      },
      {
        caption: 'ב-3. אז כופלים גם את המונה ב-3: 3 × 3 = 9. לכן 3/4 = 9/12.',
        draw: () => (<>
          <ArrowDefs />
          <Frac x={150} y={140} n={3} d={4} /><Eq x={225} y={140}>=</Eq>
          <Frac x={300} y={140} n={9} d={12} anim="pop d2" />
          <Arrow d="M150 105 Q 225 50 300 105" anim="fadein" />
          <Arrow d="M150 175 Q 225 230 300 175" anim="fadein" />
          <Note x={225} y={62} anim="fadein d1">×3</Note>
          <Note x={225} y={218} anim="fadein d1">×3</Note>
          <Bar x={380} y={113} w={220} n={4} k={3} subdiv={3} />
        </>),
      },
    ],
  },
  {
    name: 'טעות נפוצה',
    steps: [
      {
        caption: 'רון הוסיף 1 למונה ולמכנה: מ-1/2 ל-2/3. האם זה אותו שבר?',
        draw: () => (<>
          <Frac x={60} y={80} n={1} d={2} /><Bar y={53} n={2} k={1} />
          <Frac x={60} y={200} n={2} d={3} anim="pop d1" /><Bar y={173} n={3} k={2} color="b" anim="rise d1" />
          <Eq x={600} y={140} anim="shake d4">?</Eq>
        </>),
      },
      {
        caption: 'לא! החלק הצבוע גדל. חיבור משנה את הערך. רק כפל וחילוק של המונה והמכנה שומרים עליו.',
        draw: () => (<>
          <Frac x={60} y={80} n={1} d={2} /><Bar y={53} n={2} k={1} />
          <Frac x={60} y={200} n={2} d={3} /><Bar y={173} n={3} k={2} color="b" />
          <line x1={320} y1={45} x2={320} y2={235} className="la-dashed draw" style={{ transformOrigin: '320px 140px' }} />
          <Note x={470} y={255} anim="fadein d3">2/3 גדול מ-1/2</Note>
          <Eq x={600} y={140} anim="pop d2">✗</Eq>
        </>),
      },
    ],
  },
];

export default scenes;
