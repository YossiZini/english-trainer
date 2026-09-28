import React from 'react';
import { Bar, Frac, Circle, Eq, Note, STAGE } from '../primitives';

// 101.4 חיבור וחיסור שברים — one scene per rule; the parts of the second
// fraction slide up into the first fraction's row (from the reference).
const X = STAGE.barX, W = STAGE.barW, H = STAGE.barH;

const scenes = [
  {
    name: 'אותו מכנה',
    steps: [
      {
        caption: '1/4 + 2/4. שני השברים ברבעים, אז כל החלקים באותו גודל.',
        draw: () => (<>
          <Frac x={60} y={100} n={1} d={4} anim="pop" /><Bar y={73} n={4} k={1} anim="rise" />
          <Eq x={60} y={158} anim="fadein d1">+</Eq>
          <Frac x={60} y={205} n={2} d={4} anim="pop d1" /><Bar y={178} n={4} k={2} color="b" offset={1} anim="rise d1" />
        </>),
      },
      {
        caption: 'החלקים עוברים לאותה שורה: 1 רבע + 2 רבעים = 3 רבעים. מחברים מונים, המכנה נשאר: 3/4.',
        draw: () => (<>
          <Bar y={73} n={4} k={1} />
          <Bar y={178} n={4} k={2} color="b" offset={1} onlyFilled slide={{ dy: -105 }} />
          <Frac x={60} y={100} n={1} d={4} /><Eq x={60} y={158}>+</Eq><Frac x={60} y={205} n={2} d={4} />
          <Eq x={555} y={100} anim="fadein d4">=</Eq><Frac x={600} y={100} n={3} d={4} anim="pop d5" />
          <Note x={X + W / 2} y={73 + H + 18} anim="fadein d5">3 מתוך 4</Note>
        </>),
      },
    ],
  },
  {
    name: 'טעות נפוצה',
    steps: [
      {
        caption: '1/2 + 1/2. האם התשובה היא 2/4? נבדוק בציור.',
        draw: () => (<>
          <Circle cx={170} cy={140} r={70} n={2} k={1} anim="pop" />
          <Eq x={260} y={140}>+</Eq>
          <Circle cx={350} cy={140} r={70} n={2} k={1} color="b" anim="pop d1" />
          <Eq x={440} y={140} anim="fadein d2">=</Eq>
          <Eq x={520} y={140} anim="shake d4">?</Eq>
        </>),
      },
      {
        caption: 'שני חצאים הם שלם אחד: 2/2 = 1. אם מחברים גם את המכנים מקבלים 2/4, וזה רק חצי. טעות!',
        draw: () => (<>
          <Circle cx={170} cy={140} r={70} n={2} k={1} /><Eq x={260} y={140}>+</Eq>
          <Circle cx={350} cy={140} r={70} n={2} k={1} color="b" /><Eq x={440} y={140}>=</Eq>
          <Circle cx={530} cy={140} r={70} n={2} k={2} color="sum" anim="pop d2" />
          <Note x={320} y={250} anim="fadein d4">המכנה אומר מה גודל החלק, הוא לא משתנה</Note>
        </>),
      },
    ],
  },
  {
    name: 'מכנים שונים',
    steps: [
      {
        caption: '1/2 + 1/3. החלקים בגדלים שונים, אי אפשר לספור אותם יחד.',
        draw: () => (<>
          <Frac x={60} y={80} n={1} d={2} anim="pop" /><Bar y={53} n={2} k={1} anim="rise" />
          <Eq x={60} y={140} anim="fadein d1">+</Eq>
          <Frac x={60} y={200} n={1} d={3} anim="pop d1" /><Bar y={173} n={3} k={1} color="b" anim="rise d1" />
          <Eq x={600} y={140} anim="shake d4">?</Eq>
        </>),
      },
      {
        caption: 'מכנה משותף 6: 1/2 = 3/6 (כל חצי לשלושה), 1/3 = 2/6 (כל שליש לשניים).',
        draw: () => (<>
          <Frac x={60} y={80} n={1} d={2} /><Bar y={53} n={2} k={1} subdiv={3} /><Frac x={600} y={80} n={3} d={6} anim="pop d3" />
          <Eq x={60} y={140}>+</Eq>
          <Frac x={60} y={200} n={1} d={3} /><Bar y={173} n={3} k={1} color="b" subdiv={2} /><Frac x={600} y={200} n={2} d={6} anim="pop d3" />
        </>),
      },
      {
        caption: 'עכשיו הכול בשישיות: 3 שישיות + 2 שישיות = 5 שישיות. 1/2 + 1/3 = 5/6.',
        draw: () => (<>
          <Bar y={73} n={6} k={3} />
          <Bar y={178} n={6} k={2} color="b" offset={3} onlyFilled slide={{ dy: -105 }} />
          <Frac x={60} y={100} n={3} d={6} /><Eq x={60} y={158}>+</Eq><Frac x={60} y={205} n={2} d={6} />
          <Eq x={555} y={100} anim="fadein d4">=</Eq><Frac x={600} y={100} n={5} d={6} anim="pop d5" />
        </>),
      },
    ],
  },
  {
    name: 'חיסור',
    steps: [
      {
        caption: '3/4 − 1/6. קודם מכנה משותף: 12. 3/4 = 9/12, 1/6 = 2/12.',
        draw: () => (<>
          <Frac x={60} y={80} n={3} d={4} anim="pop" /><Bar y={53} n={4} k={3} subdiv={3} /><Frac x={600} y={80} n={9} d={12} anim="pop d3" />
          <Eq x={60} y={140}>−</Eq>
          <Frac x={60} y={200} n={1} d={6} anim="pop d1" /><Bar y={173} n={6} k={1} color="b" subdiv={2} /><Frac x={600} y={200} n={2} d={12} anim="pop d3" />
        </>),
      },
      {
        caption: 'מורידים 2 חלקים מתוך 9: נשארים 7. 9/12 − 2/12 = 7/12.',
        draw: () => (<>
          <Frac x={60} y={100} n={9} d={12} /><Bar y={73} n={12} k={7} anim="fadein" />
          <Bar y={73} n={12} k={2} color="b" offset={7} onlyFilled slide={{ dy: 105 }} />
          <Eq x={60} y={158}>−</Eq><Frac x={60} y={205} n={2} d={12} />
          <Eq x={555} y={100} anim="fadein d4">=</Eq><Frac x={600} y={100} n={7} d={12} anim="pop d5" />
        </>),
      },
    ],
  },
  {
    name: 'מחסרים משלם',
    steps: [
      {
        caption: 'מפיצה שלמה אכלו 7/12. כמה נשאר? שלם אחד הוא 12/12.',
        draw: () => (<>
          <Circle cx={230} cy={140} r={85} n={12} k={7} anim="pop" />
          <Eq x={360} y={140} anim="fadein d2">1 =</Eq>
          <Frac x={430} y={140} n={12} d={12} anim="pop d3" />
        </>),
      },
      {
        caption: '12/12 − 7/12 = 5/12. נשארו 5 חלקים מתוך 12.',
        draw: () => (<>
          <Circle cx={230} cy={140} r={85} n={12} k={7} />
          <Frac x={380} y={140} n={12} d={12} /><Eq x={430} y={140}>−</Eq>
          <Frac x={480} y={140} n={7} d={12} /><Eq x={530} y={140} anim="fadein d2">=</Eq>
          <Frac x={585} y={140} n={5} d={12} anim="pop d3" />
          <Note x={230} y={250} anim="fadein d4">5 חלקים לבנים נשארו</Note>
        </>),
      },
    ],
  },
];

export default scenes;
