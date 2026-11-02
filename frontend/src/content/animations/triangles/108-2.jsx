import React from 'react';
import { Expr } from '../primitives';
import { TriangleShape, triangleFromAngles, iso } from '../geometry';

// 108.2 סכום הזוויות במשולש — one scene per rule: the three corners torn
// off fill a straight angle (180°), a missing angle, a right triangle, an
// isosceles triangle, an equilateral one.
const at = { x: 60, y: 235, base: 240, maxHeight: 180 };
const R = (t, anim = 'pop d3') => ({ t, cls: 'result', anim });
const SIDE = 470;

const scenes = [
  {
    name: `שלוש הזוויות יחד – 180°`,
    steps: [
      {
        caption: `משולש עם הזוויות ${iso('50°')}, ${iso('60°')} ו-${iso('70°')}. צובעים כל פינה בצבע אחר.`,
        draw: () => <TriangleShape V={triangleFromAngles(50, 60, at)} angleLabels={['50°', '60°', '70°']} corners="whole" />,
      },
      {
        caption: 'קורעים את שלוש הפינות ומניחים אותן זו ליד זו: הן ממלאות קו ישר, זווית של 180°.',
        draw: () => <TriangleShape V={triangleFromAngles(50, 60, at)} corners="torn" line={[SIDE, 210]} />,
      },
      {
        caption: `${iso('50° + 60° + 70° = 180°')}. בכל משולש, גדול או קטן.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(50, 60, at)} angleLabels={['50°', '60°', '70°']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['50°', '+', '60°', '+', '70°', '=', R('180°')]} />
        </>),
      },
    ],
  },
  {
    name: 'זווית חסרה',
    steps: [
      {
        caption: `${iso('∠A = 40°')} ו-${iso('∠B = 75°')}. כמה היא הזווית C?`,
        draw: () => <TriangleShape V={triangleFromAngles(40, 75, at)} angleLabels={['40°', '75°', '?']} />,
      },
      {
        caption: `מחסרים מ-${iso('180°')}: ${iso('180° − 40° − 75° = 65°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(40, 75, at)} angleLabels={['40°', '75°', '65°']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['180°', '−', '40°', '−', '75°', '=', R('65°')]} />
        </>),
      },
    ],
  },
  {
    name: 'משולש ישר-זווית',
    steps: [
      {
        caption: `הזווית הישרה לוקחת ${iso('90°')}. לשתי האחרות נשארים ${iso('180° − 90° = 90°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(90, 35, at)} angleLabels={['90°', '35°', '?']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['180°', '−', '90°', '=', R('90°')]} />
        </>),
      },
      {
        caption: `אם אחת מהן ${iso('35°')}, השנייה ${iso('90° − 35° = 55°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(90, 35, at)} angleLabels={['90°', '35°', '55°']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['90°', '−', '35°', '=', R('55°')]} />
        </>),
      },
    ],
  },
  {
    name: 'משולש שווה שוקיים',
    steps: [
      {
        caption: `זוויות הבסיס שוות. הזווית שבראש ${iso('40°')}: לשתיהן נשארים ${iso('180° − 40° = 140°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(70, 70, { ...at, base: 200 })} ticks={[0, 1, 1]} angleLabels={['?', '?', '40°']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['180°', '−', '40°', '=', R('140°')]} />
        </>),
      },
      {
        caption: `וכל אחת חצי: ${iso('140° ÷ 2 = 70°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(70, 70, { ...at, base: 200 })} ticks={[0, 1, 1]} angleLabels={['70°', '70°', '40°']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['140°', '÷', '2', '=', R('70°')]} />
        </>),
      },
    ],
  },
  {
    name: 'משולש שווה צלעות',
    steps: [
      {
        caption: `שלוש הזוויות שוות, ולכן כל אחת ${iso('180° ÷ 3 = 60°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(60, 60, { ...at, base: 210 })} ticks={[1, 1, 1]} angleLabels={['60°', '60°', '60°']} />
          <Expr x={SIDE} y={140} size={24} gap={10} tokens={['180°', '÷', '3', '=', R('60°')]} />
        </>),
      },
    ],
  },
];

export default scenes;
