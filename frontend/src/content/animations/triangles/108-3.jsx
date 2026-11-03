import React from 'react';
import { Expr } from '../primitives';
import { TriangleShape, triangleFromSides, triangleFromBase, iso } from '../geometry';

// 108.3 היקף ושטח של משולש — one scene per rule: the perimeter, a right
// triangle as half a rectangle, base × height ÷ 2 for any triangle (the
// parts of the rectangle outside it are as big as the inside), the legs of
// a right triangle, a height outside an obtuse triangle.
const R = (t, anim = 'pop d4') => ({ t, cls: 'result', anim });
const SIDE = 480;

const scenes = [
  {
    name: 'ההיקף – מחברים את הצלעות',
    steps: [
      {
        caption: 'למשולש צלעות של 5, 6 ו-7 ס״מ.',
        draw: () => <TriangleShape V={triangleFromSides(7, 6, 5, { x: 70, y: 235, unit: 36 })} sideLabels={['7', '6', '5']} />,
      },
      {
        caption: `ההיקף הוא כל הגבול: ${iso('5 + 6 + 7 = 18')} ס״מ.`,
        draw: () => (<>
          <TriangleShape V={triangleFromSides(7, 6, 5, { x: 70, y: 235, unit: 36 })} sideLabels={['7', '6', '5']} />
          <Expr x={SIDE} y={140} size={28} tokens={['5', '+', '6', '+', '7', '=', R('18')]} />
        </>),
      },
    ],
  },
  {
    name: 'משולש ישר-זווית הוא חצי מלבן',
    steps: [
      {
        caption: 'משולש ישר-זווית עם ניצבים של 6 ו-4 ס״מ.',
        draw: () => <TriangleShape V={triangleFromBase(6, [0, 4], { x: 90, y: 240, unit: 45 })} sideLabels={['6', '', '4']} angleLabels={['90°', '', '']} />,
      },
      {
        caption: `הוא חצי ממלבן של 6 על 4: ${iso('6 × 4 = 24')} סמ״ר למלבן כולו.`,
        draw: () => (<>
          <TriangleShape V={triangleFromBase(6, [0, 4], { x: 90, y: 240, unit: 45 })} sideLabels={['6', '', '4']} angleLabels={['90°', '', '']} box halves />
          <Expr x={SIDE} y={140} size={28} tokens={['6', '×', '4', '=', R('24')]} />
        </>),
      },
      {
        caption: `והמשולש חצי ממנו: ${iso('24 ÷ 2 = 12')} סמ״ר.`,
        draw: () => (<>
          <TriangleShape V={triangleFromBase(6, [0, 4], { x: 90, y: 240, unit: 45 })} sideLabels={['6', '', '4']} angleLabels={['90°', '', '']} />
          <Expr x={SIDE} y={140} size={28} tokens={['24', '÷', '2', '=', R('12')]} />
        </>),
      },
    ],
  },
  {
    name: 'בסיס כפול גובה, חלקי 2',
    steps: [
      {
        caption: 'בסיס של 8 ס״מ. הגובה יורד מהקודקוד אל הבסיס בזווית ישרה: 5 ס״מ.',
        draw: () => <TriangleShape V={triangleFromBase(8, [3, 5], { x: 60, y: 240, unit: 36 })} sideLabels={['8', '', '']} height heightLabel="5" />,
      },
      {
        caption: 'סביבו מלבן של 8 על 5. החלקים שמחוץ למשולש שווים בגודלם לחלקים שבתוכו: המשולש חצי מהמלבן.',
        draw: () => <TriangleShape V={triangleFromBase(8, [3, 5], { x: 60, y: 240, unit: 36 })} sideLabels={['8', '', '']} height heightLabel="5" box halves />,
      },
      {
        caption: `${iso('8 × 5 ÷ 2 = 20')} סמ״ר.`,
        draw: () => (<>
          <TriangleShape V={triangleFromBase(8, [3, 5], { x: 60, y: 240, unit: 36 })} sideLabels={['8', '', '']} height heightLabel="5" />
          <Expr x={SIDE} y={140} size={28} tokens={['8', '×', '5', '÷', '2', '=', R('20')]} />
        </>),
      },
    ],
  },
  {
    name: 'במשולש ישר-זווית, הניצבים הם בסיס וגובה',
    steps: [
      {
        caption: 'צלעות של 3, 4 ו-5 ס״מ. הניצבים 3 ו-4 מאונכים זה לזה: אחד הבסיס, והשני הגובה.',
        draw: () => <TriangleShape V={triangleFromBase(4, [0, 3], { x: 100, y: 235, unit: 55 })} sideLabels={['4', '5', '3']} angleLabels={['90°', '', '']} />,
      },
      {
        caption: `השטח: ${iso('4 × 3 ÷ 2 = 6')} סמ״ר. הצלע של 5, היתר, אינה גובה.`,
        draw: () => (<>
          <TriangleShape V={triangleFromBase(4, [0, 3], { x: 100, y: 235, unit: 55 })} sideLabels={['4', '5', '3']} angleLabels={['90°', '', '']} />
          <Expr x={SIDE} y={140} size={28} tokens={['4', '×', '3', '÷', '2', '=', R('6')]} />
        </>),
      },
    ],
  },
  {
    name: 'גובה מחוץ למשולש',
    steps: [
      {
        caption: 'במשולש קהה-זווית הגובה יכול ליפול מחוץ למשולש, על המשך הבסיס.',
        draw: () => <TriangleShape V={triangleFromBase(4, [7, 5], { x: 60, y: 240, unit: 34 })} sideLabels={['4', '', '']} height heightLabel="5" />,
      },
      {
        caption: `החשבון לא משתנה: בסיס 4 וגובה 5, ${iso('4 × 5 ÷ 2 = 10')} סמ״ר.`,
        draw: () => (<>
          <TriangleShape V={triangleFromBase(4, [7, 5], { x: 60, y: 240, unit: 34 })} sideLabels={['4', '', '']} height heightLabel="5" />
          <Expr x={SIDE} y={140} size={28} tokens={['4', '×', '5', '÷', '2', '=', R('10')]} />
        </>),
      },
    ],
  },
];

export default scenes;
