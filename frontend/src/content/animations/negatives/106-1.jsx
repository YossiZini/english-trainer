import React from 'react';
import { Expr } from '../primitives';
import { HopLine, iso } from '../geometry';

// 106.1 מספרים שליליים על ישר המספרים — one scene per rule of the written
// theory: the place of a number, the one to the right is bigger, opposites,
// the distance from 0.
const LINE = { from: -6, to: 6 };
const R = (t) => ({ t, cls: 'result', anim: 'pop d2' });

const scenes = [
  {
    name: 'מקום על ישר המספרים',
    steps: [
      {
        caption: 'באמצע ישר המספרים נמצא 0. מימין המספרים החיוביים, ומשמאל, באותם מרווחים, השליליים.',
        draw: () => <HopLine {...LINE} points={[{ value: 0, label: '0' }]} />,
      },
      {
        caption: '3 נמצא שלושה צעדים מימין ל-0.',
        draw: () => <HopLine {...LINE} hops={[{ from: 0, to: 3, label: '3' }]} points={[{ value: 3, label: '3', at: 0.7 }]} />,
      },
      {
        caption: `${iso('−4')} נמצא ארבעה צעדים משמאל ל-0.`,
        draw: () => <HopLine {...LINE} hops={[{ from: 0, to: -4, label: '4', color: 'b' }]} points={[{ value: 3, label: '3', color: 'a' }, { value: -4, label: '−4', color: 'b', at: 0.7 }]} />,
      },
    ],
  },
  {
    name: 'מימין גדול יותר',
    steps: [
      {
        caption: `איזה מספר גדול יותר: ${iso('−5')} או ${iso('−2')}?`,
        draw: () => <HopLine {...LINE} points={[{ value: -5, label: '−5', color: 'a' }, { value: -2, label: '−2', color: 'b' }]} />,
      },
      {
        caption: `${iso('−2')} נמצא ימינה יותר, ולכן ${iso('−2 > −5')}, אף ש-5 גדול מ-2.`,
        draw: () => (<>
          <HopLine {...LINE} points={[{ value: -5, label: '−5', color: 'a' }, { value: -2, label: '−2', color: 'b' }]} hops={[{ from: -5, to: -2, label: 'ימינה', color: 'b' }]} />
          <Expr y={255} size={28} tokens={['−2', '>', R('−5')]} />
        </>),
      },
      {
        caption: `כל מספר חיובי גדול מכל מספר שלילי: ${iso('1 > −6')}. וגם 0 גדול מכל מספר שלילי.`,
        draw: () => (<>
          <HopLine {...LINE} points={[{ value: -6, label: '−6', color: 'a' }, { value: 0, label: '0', color: 'b' }, { value: 1, label: '1', color: 'b' }]} />
          <Expr y={255} size={28} tokens={['1', '>', '0', '>', R('−6')]} />
        </>),
      },
    ],
  },
  {
    name: 'מספרים נגדיים',
    steps: [
      {
        caption: `3 ו-${iso('−3')} נמצאים באותו מרחק מ-0, משני הצדדים.`,
        draw: () => <HopLine {...LINE} flat hops={[{ from: 0, to: 3, label: '3' }, { from: 0, to: -3, label: '3', color: 'b' }]} points={[{ value: 3, label: '3', color: 'a', at: 0.8 }, { value: -3, label: '−3', color: 'b', at: 1.4 }]} />,
      },
      {
        caption: `הם מספרים נגדיים: הנגדי של 3 הוא ${iso('−3')}, והנגדי של ${iso('−3')} הוא 3. הנגדי של 0 הוא 0.`,
        draw: () => (<>
          <HopLine {...LINE} points={[{ value: 3, label: '3', color: 'a' }, { value: -3, label: '−3', color: 'b' }, { value: 0, label: '0', color: 'a' }]} />
          <Expr y={255} size={26} gap={18} tokens={['3', '↔', R('−3')]} />
        </>),
      },
    ],
  },
  {
    name: 'המרחק מ-0, הערך המוחלט',
    steps: [
      {
        caption: `מ-${iso('−7')} עד 0 יש 7 צעדים: המרחק של ${iso('−7')} מ-0 הוא 7.`,
        draw: () => <HopLine from={-8} to={2} points={[{ value: -7, label: '−7', color: 'b' }]} brace={{ from: -7, to: 0, label: '7', at: 0.4 }} />,
      },
      {
        caption: `המרחק מ-0 נקרא ערך מוחלט, וכותבים אותו בין שני קווים: ${iso('|−7| = 7')}. מרחק אף פעם אינו שלילי.`,
        draw: () => (<>
          <HopLine from={-8} to={8} points={[{ value: -7, label: '−7', color: 'b' }, { value: 7, label: '7', color: 'a' }]} />
          <Expr y={250} size={28} gap={16} tokens={['|−7|', '=', R('7'), '=', '|7|']} />
        </>),
      },
    ],
  },
];

export default scenes;
