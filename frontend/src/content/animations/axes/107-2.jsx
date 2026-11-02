import React from 'react';
import { Expr } from '../primitives';
import { CoordPlane, iso } from '../geometry';

// 107.2 סימון נקודות במערכת צירים — one scene per rule: placing a point,
// moving it, the distance along a grid line, the fourth corner of a rectangle.
const P = { ox: 200, oy: 140 };
const SIDE = 495;
const R = (t, anim = 'pop d4') => ({ t, cls: 'result', anim });

const scenes = [
  {
    name: 'מסמנים נקודה',
    steps: [
      {
        caption: `כדי לסמן את ${iso('A(−2, 3)')}: מראשית הצירים 2 שמאלה על ציר ה-x, ומשם 3 למעלה.`,
        draw: () => (<>
          <CoordPlane {...P} walk={{ x: -2, y: 3, label: 'A' }} />
          <Expr x={SIDE} y={140} size={30} gap={6} tokens={['A(−2,', { t: '3)', cls: 'b' }]} anim="fadein d3" />
        </>),
      },
    ],
  },
  {
    name: 'מזיזים נקודה',
    steps: [
      {
        caption: `${iso('A(1, 2)')} זזה 3 ימינה ו-4 למטה.`,
        draw: () => <CoordPlane {...P} points={[{ x: 1, y: 2, label: 'A' }]} />,
      },
      {
        caption: `ימינה מוסיף ל-x: ${iso('1 + 3 = 4')}. למטה מחסיר מ-y: ${iso('2 − 4 = −2')}. מגיעים ל-${iso('B(4, −2)')}.`,
        draw: () => (<>
          <CoordPlane {...P} points={[{ x: 1, y: 2, label: 'A' }, { x: 4, y: -2, label: 'B', color: 'b', at: 1.0 }]} moves={[{ from: [1, 2], to: [4, -2] }]} />
          <Expr x={SIDE} y={110} size={26} tokens={['1', '+', '3', '=', R('4', 'pop d2')]} />
          <Expr x={SIDE} y={170} size={26} tokens={['2', '−', '4', '=', R('−2')]} />
        </>),
      },
    ],
  },
  {
    name: 'מרחק על קו של המשבצות',
    steps: [
      {
        caption: `ל-${iso('(−3, 2)')} ול-${iso('(4, 2)')} אותו y: הן על קו אופקי אחד.`,
        draw: () => <CoordPlane {...P} points={[{ x: -3, y: 2, label: 'A' }, { x: 4, y: 2, label: 'B' }]} />,
      },
      {
        caption: `המרחק הוא ההפרש בין שיעורי ה-x של שתי הנקודות: ${iso('4 − (−3) = 7')}. 3 משבצות עד 0, ועוד 4 אחריו.`,
        draw: () => (<>
          <CoordPlane {...P} points={[{ x: -3, y: 2, label: 'A' }, { x: 4, y: 2, label: 'B' }]} segments={[{ from: [-3, 2], to: [4, 2], label: '7', color: 'b' }]} />
          <Expr x={SIDE} y={140} size={28} tokens={['4', '−', '(−3)', '=', R('7')]} />
        </>),
      },
    ],
  },
  {
    name: 'קודקודים של מלבן',
    steps: [
      {
        caption: `${iso('A(−3, 2)')}, ${iso('B(2, 2)')}, ${iso('C(2, −1)')}: שלושה קודקודים של מלבן. איפה הרביעי?`,
        draw: () => <CoordPlane {...P} points={[{ x: -3, y: 2, label: 'A' }, { x: 2, y: 2, label: 'B' }, { x: 2, y: -1, label: 'C' }]} segments={[{ from: [-3, 2], to: [2, 2] }, { from: [2, 2], to: [2, -1], at: 0.7 }]} />,
      },
      {
        caption: `ל-D אותו x כמו ל-A, ואותו y כמו ל-C: ${iso('D(−3, −1)')}.`,
        draw: () => (<>
          <CoordPlane {...P} points={[{ x: -3, y: 2, label: 'A' }, { x: 2, y: 2, label: 'B' }, { x: 2, y: -1, label: 'C' }, { x: -3, y: -1, label: 'D', color: 'b', at: 0.9 }]}
            segments={[{ from: [-3, 2], to: [2, 2], at: 0 }, { from: [2, 2], to: [2, -1], at: 0 }, { from: [2, -1], to: [-3, -1], dashed: true, color: 'b', at: 0.3 }, { from: [-3, -1], to: [-3, 2], dashed: true, color: 'b', at: 0.6 }]} />
          <Expr x={SIDE} y={140} size={30} gap={6} tokens={['D(−3,', { t: '−1)', cls: 'b' }]} anim="fadein d5" />
        </>),
      },
    ],
  },
];

export default scenes;
