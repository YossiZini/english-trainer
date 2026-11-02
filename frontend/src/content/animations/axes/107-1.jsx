import React from 'react';
import { Expr, Note } from '../primitives';
import { CoordPlane, iso } from '../geometry';

// 107.1 מערכת צירים: הצירים והנקודה — one scene per rule: the axes and the
// origin, reading a point (x first, then y), negative coordinates, the four
// quarters, points on the axes. The plane is on the left, words on the right.
const P = { ox: 200, oy: 140 };
const SIDE = 495;

const scenes = [
  {
    name: 'הצירים וראשית הצירים',
    steps: [
      {
        caption: 'שני ישרי מספרים נחתכים ב-0: האופקי הוא ציר ה-x, והאנכי הוא ציר ה-y.',
        draw: () => (<>
          <CoordPlane {...P} />
          <Note x={SIDE} y={110} anim="fadein d1">ציר ה-x: ימינה ושמאלה</Note>
          <Note x={SIDE} y={150} anim="fadein d3">ציר ה-y: למעלה ולמטה</Note>
        </>),
      },
      {
        caption: `הם נפגשים בראשית הצירים, הנקודה ${iso('O(0, 0)')}.`,
        draw: () => (<>
          <CoordPlane {...P} points={[{ x: 0, y: 0, label: 'O' }]} />
          <Expr x={SIDE} y={140} size={30} tokens={['O(0,', '0)']} gap={8} anim="pop d2" />
        </>),
      },
    ],
  },
  {
    name: 'קוראים נקודה: קודם x',
    steps: [
      {
        caption: `${iso('A(3, 2)')}: מראשית הצירים הולכים 3 ימינה, ואחר כך 2 למעלה.`,
        draw: () => (<>
          <CoordPlane {...P} walk={{ x: 3, y: 2, label: 'A' }} />
          <Expr x={SIDE} y={140} size={32} gap={6} tokens={['A(', { t: '3', cls: '' }, ',', { t: '2', cls: 'b' }, ')']} anim="fadein d3" />
        </>),
      },
      {
        caption: 'המספר הראשון, 3, הוא שיעור ה-x. המספר השני, 2, הוא שיעור ה-y.',
        draw: () => (<>
          <CoordPlane {...P} points={[{ x: 3, y: 2, label: 'A' }]} />
          <Note x={SIDE} y={110} anim="fadein">שיעור ה-x הוא 3</Note>
          <Note x={SIDE} y={150} anim="fadein d2">שיעור ה-y הוא 2</Note>
        </>),
      },
    ],
  },
  {
    name: 'שיעורים שליליים',
    steps: [
      {
        caption: `x שלילי: הולכים שמאלה. ${iso('B(−4, 1)')}: 4 שמאלה, ואחר כך 1 למעלה.`,
        draw: () => <CoordPlane {...P} walk={{ x: -4, y: 1, label: 'B' }} />,
      },
      {
        caption: `y שלילי: הולכים למטה. ${iso('C(2, −3)')}: 2 ימינה, ואחר כך 3 למטה.`,
        draw: () => <CoordPlane {...P} points={[{ x: -4, y: 1, label: 'B' }]} walk={{ x: 2, y: -3, label: 'C', color: 'b' }} />,
      },
    ],
  },
  {
    name: 'ארבעת הרביעים',
    steps: [
      {
        caption: `הצירים מחלקים את המערכת לארבעה רביעים. ברביע הראשון, מימין ולמעלה, x ו-y חיוביים: ${iso('(+, +)')}.`,
        draw: () => <CoordPlane {...P} quarters={[{ q: 1, text: 'ראשון' }]} points={[{ x: 4, y: 3, at: 0.5 }]} />,
      },
      {
        caption: `מונים נגד כיוון השעון: בשני ${iso('(−, +)')}, בשלישי ${iso('(−, −)')}, וברביעי ${iso('(+, −)')}.`,
        draw: () => <CoordPlane {...P} quarters={[{ q: 1, text: 'ראשון' }, { q: 2, text: 'שני', at: 0.4 }, { q: 3, text: 'שלישי', at: 0.9 }, { q: 4, text: 'רביעי', at: 1.4 }]} />,
      },
    ],
  },
  {
    name: 'נקודות על הצירים',
    steps: [
      {
        caption: `${iso('D(4, 0)')}: 4 ימינה, ולא זזים למעלה או למטה. היא על ציר ה-x.`,
        draw: () => <CoordPlane {...P} walk={{ x: 4, y: 0, label: 'D' }} />,
      },
      {
        caption: `${iso('E(0, −3)')}: לא זזים ימינה או שמאלה, רק 3 למטה. היא על ציר ה-y. נקודה על ציר אינה בשום רביע.`,
        draw: () => <CoordPlane {...P} points={[{ x: 4, y: 0, label: 'D' }]} walk={{ x: 0, y: -3, label: 'E', color: 'b' }} />,
      },
    ],
  },
];

export default scenes;
