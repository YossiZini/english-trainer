import React from 'react';
import { Expr } from '../primitives';
import { HopLine, afterHops, iso } from '../geometry';

// 106.3 כפל וחילוק עם מספרים שליליים — one scene per rule: a positive
// times a negative as equal hops to the left, a negative times a negative
// from the pattern, division by the same rules, and several factors.
const R = (t, anim = 'pop d4') => ({ t, cls: 'result', anim });
const hops = (count, size) => Array.from({ length: count }, (_, i) => ({ from: i * size, to: (i + 1) * size, label: size < 0 ? `−${-size}` : `${size}`, color: 'b' }));

const PATTERN = [[2, -4], [1, -2], [0, 0], [-1, 2], [-2, 4]];
const term = (v) => (v < 0 ? `(−${-v})` : String(v));
const sgn = (v) => (v < 0 ? `−${-v}` : String(v));
const patternRow = ([b, r], i, shown) => (
  <Expr key={b} y={32 + i * 44} size={26} anim={i >= shown ? 'pop d2' : ''} tokens={['−2', '×', term(b), '=', i >= 3 ? R(sgn(r), 'pop d3') : sgn(r)]} />
);

const scenes = [
  {
    name: 'חיובי כפול שלילי – שלילי',
    steps: [
      {
        caption: `${iso('4 × (−3)')}: ארבע פעמים ${iso('−3')}. קפיצה ראשונה של ${iso('−3')}, שמאלה.`,
        draw: () => (<>
          <HopLine from={-13} to={1} flat hops={hops(1, -3)} points={[{ value: 0, label: '0', color: 'a' }]} />
          <Expr y={255} tokens={['4', '×', '(−3)', '=', '?']} />
        </>),
      },
      {
        caption: `ארבע קפיצות שוות של ${iso('−3')} מגיעות ל-${iso('−12')}: ${iso('4 × (−3) = −12')}.`,
        draw: () => (<>
          <HopLine from={-13} to={1} flat hops={hops(4, -3)} points={[{ value: -12, label: '−12', color: 'b', at: afterHops(4) }]} />
          <Expr y={255} tokens={['4', '×', '(−3)', '=', R('−12')]} />
        </>),
      },
      {
        caption: `אפשר להחליף את סדר הגורמים: גם ${iso('−3 × 4 = −12')}. חיובי כפול שלילי, או שלילי כפול חיובי: התוצאה שלילית.`,
        draw: () => (<>
          <Expr y={100} size={32} tokens={['4', '×', '(−3)', '=', '−12']} />
          <Expr y={190} size={32} tokens={['−3', '×', '4', '=', R('−12', 'pop d2')]} />
        </>),
      },
    ],
  },
  {
    name: 'שלילי כפול שלילי – חיובי',
    steps: [
      {
        caption: 'הסדרה: בכל שורה הגורם השני קטן ב-1, והתוצאה גדלה ב-2.',
        draw: () => <>{PATTERN.slice(0, 3).map((row, i) => patternRow(row, i, 3))}</>,
      },
      {
        caption: `ממשיכים באותו כלל אחרי 0: ${iso('−2 × (−1) = 2')}, ${iso('−2 × (−2) = 4')}.`,
        draw: () => <>{PATTERN.map((row, i) => patternRow(row, i, 3))}</>,
      },
      {
        caption: 'על ישר המספרים התוצאות עולות ב-2 בכל שורה: שלילי כפול שלילי הוא חיובי.',
        draw: () => <HopLine from={-5} to={5} flat hops={[-4, -2, 0, 2].map((v) => ({ from: v, to: v + 2, label: '+2' }))} points={[-4, -2, 0, 2, 4].map((v, i) => ({ value: v, label: sgn(v), color: i === 4 ? 'b' : 'a', at: i === 4 ? afterHops(4) : 0.1 * i }))} />,
      },
    ],
  },
  {
    name: 'חילוק – אותם כללים',
    steps: [
      {
        caption: `${iso('−12 ÷ 3')}: מחלקים את ${iso('−12')} לשלוש קפיצות שוות.`,
        draw: () => (<>
          <HopLine from={-13} to={1} points={[{ value: -12, label: '−12', color: 'b' }, { value: 0, label: '0', color: 'a' }]} />
          <Expr y={255} tokens={['−12', '÷', '3', '=', '?']} />
        </>),
      },
      {
        caption: `כל קפיצה היא ${iso('−4')}: ${iso('−12 ÷ 3 = −4')}. בדיקה: ${iso('−4 × 3 = −12')}.`,
        draw: () => (<>
          <HopLine from={-13} to={1} flat hops={hops(3, -4)} points={[{ value: -12, label: '−12', color: 'b', at: afterHops(3) }]} />
          <Expr y={255} tokens={['−12', '÷', '3', '=', R('−4')]} />
        </>),
      },
      {
        caption: `ושלילי חלקי שלילי הוא חיובי: ${iso('−12 ÷ (−3) = 4')}, כי ${iso('4 × (−3) = −12')}.`,
        draw: () => (<>
          <Expr y={100} size={32} tokens={['−12', '÷', '(−3)', '=', R('4', 'pop d2')]} />
          <Expr y={190} size={28} tokens={['4', '×', '(−3)', '=', '−12']} anim="fadein d4" />
        </>),
      },
    ],
  },
  {
    name: 'כמה גורמים',
    steps: [
      {
        caption: `${iso('−1 × (−2) × (−3)')}: משמאל לימין. ${iso('−1 × (−2) = 2')}, שני שליליים: חיובי.`,
        draw: () => (<>
          <Expr y={100} size={30} hl={[0, 2]} tokens={['−1', '×', '(−2)', '×', '(−3)']} />
          <Expr y={190} size={30} tokens={['−1', '×', '(−2)', '=', R('2', 'pop d2')]} />
        </>),
      },
      {
        caption: `ואחר כך ${iso('2 × (−3) = −6')}. שלושה שליליים, מספר אי-זוגי: התוצאה שלילית.`,
        draw: () => (<>
          <Expr y={100} size={30} tokens={['−1', '×', '(−2)', '×', '(−3)', '=', R('−6', 'pop d3')]} />
          <Expr y={190} size={28} tokens={['2', '×', '(−3)', '=', '−6']} anim="fadein d1" />
        </>),
      },
    ],
  },
];

export default scenes;
