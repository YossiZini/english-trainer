import React from 'react';
import { Expr, Note } from '../primitives';
import { TriangleShape, Rods, triangleFromSides, triangleFromAngles, iso } from '../geometry';

// 108.1 סוגי משולשים — one scene per rule: kinds by sides, kinds by angles,
// equal sides opposite equal angles (a triangle can be of two kinds), and
// which three lengths make a triangle. The triangle on the left, its kind
// on the right.
const SIDE = 490;
const at = { x: 90, y: 240, maxHeight: 180 };

const scenes = [
  {
    name: 'לפי הצלעות',
    steps: [
      {
        caption: 'שווה צלעות: שלוש הצלעות שוות. סימנים זהים על צלעות אומרים שהן שוות.',
        draw: () => (<>
          <TriangleShape V={triangleFromSides(5, 5, 5, { ...at, unit: 42 })} ticks={[1, 1, 1]} />
          <Note x={SIDE} y={140} anim="fadein d2">שווה צלעות</Note>
        </>),
      },
      {
        caption: 'שווה שוקיים: שתי צלעות שוות, השוקיים. הצלע השלישית היא הבסיס.',
        draw: () => (<>
          <TriangleShape V={triangleFromSides(6, 5, 5, { ...at, unit: 38 })} ticks={[0, 1, 1]} sideLabels={['בסיס', '', '']} />
          <Note x={SIDE} y={140} anim="fadein d2">שווה שוקיים</Note>
        </>),
      },
      {
        caption: 'שונה צלעות: כל הצלעות שונות.',
        draw: () => (<>
          <TriangleShape V={triangleFromSides(7, 5, 4, { ...at, unit: 34 })} sideLabels={['7', '5', '4']} />
          <Note x={SIDE} y={140} anim="fadein d2">שונה צלעות</Note>
        </>),
      },
    ],
  },
  {
    name: 'לפי הזוויות',
    steps: [
      {
        caption: `חד-זווית: כל הזוויות קטנות מ-${iso('90°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(60, 70, { ...at, base: 220 })} angleLabels={['60°', '70°', '50°']} />
          <Note x={SIDE} y={140} anim="fadein d3">חד-זווית</Note>
        </>),
      },
      {
        caption: `ישר-זווית: אחת הזוויות היא ${iso('90°')}. ריבוע קטן בפינה מסמן אותה.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(90, 40, { ...at, base: 240 })} angleLabels={['90°', '40°', '50°']} />
          <Note x={SIDE} y={140} anim="fadein d3">ישר-זווית</Note>
        </>),
      },
      {
        caption: `קהה-זווית: אחת הזוויות גדולה מ-${iso('90°')}.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(25, 35, { ...at, base: 300 })} angleLabels={['25°', '35°', '120°']} />
          <Note x={SIDE + 20} y={120} anim="fadein d3">קהה-זווית</Note>
        </>),
      },
    ],
  },
  {
    name: 'מול צלעות שוות – זוויות שוות',
    steps: [
      {
        caption: 'במשולש שווה שוקיים, הזוויות שמול השוקיים שוות: אלה זוויות הבסיס.',
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(70, 70, { ...at, base: 200 })} ticks={[0, 1, 1]} angleLabels={['70°', '70°', '']} />
          <Note x={SIDE} y={140} anim="fadein d3">זוויות הבסיס שוות</Note>
        </>),
      },
      {
        caption: `משולש יכול להיות משני הסוגים יחד: ${iso('90°')}, ${iso('45°')}, ${iso('45°')} הוא ישר-זווית ושווה שוקיים.`,
        draw: () => (<>
          <TriangleShape V={triangleFromAngles(90, 45, { ...at, base: 200 })} ticks={[1, 0, 1]} angleLabels={['90°', '45°', '45°']} />
          <Note x={SIDE} y={120} anim="fadein d2">ישר-זווית</Note>
          <Note x={SIDE} y={160} anim="fadein d4">ושווה שוקיים</Note>
        </>),
      },
    ],
  },
  {
    name: 'אילו צלעות יוצרות משולש',
    steps: [
      {
        caption: `צלעות של 3 ו-4 על בסיס של 8: ${iso('3 + 4 = 7')}, קטן מ-8. הן לא נפגשות, ואין משולש.`,
        draw: () => (<>
          <Rods base={8} left={3} right={4} x={140} y={170} unit={45} />
          <Expr y={250} size={28} tokens={['3', '+', '4', '=', { t: '7', cls: 'b', anim: 'pop d5' }]} />
        </>),
      },
      {
        caption: `על בסיס של 6: ${iso('3 + 4 = 7')}, גדול מ-6. הן נפגשות, ויש משולש. סכום כל שתי צלעות גדול מהשלישית.`,
        draw: () => (<>
          <Rods base={6} left={3} right={4} x={185} y={200} unit={45} />
          <Expr y={252} size={28} tokens={['3', '+', '4', '=', { t: '7', cls: 'result', anim: 'pop d5' }]} />
        </>),
      },
    ],
  },
];

export default scenes;
