import React from 'react';
import { Expr } from '../primitives';
import { HopLine, afterHops, iso } from '../geometry';

// 106.2 חיבור וחיסור עם מספרים שליליים — one scene per rule: adding a
// positive number goes right, adding a negative one goes left, two
// negatives add their distances, different signs subtract them, and
// subtracting is adding the opposite.
const R = (t) => ({ t, cls: 'result', anim: 'pop d4' });
const at1 = afterHops(1);

const scenes = [
  {
    name: 'מוסיפים חיובי – ימינה',
    steps: [
      {
        caption: `${iso('−2 + 5')}: מתחילים ב-${iso('−2')}.`,
        draw: () => (<>
          <HopLine from={-4} to={5} points={[{ value: -2, label: '−2', color: 'a' }]} />
          <Expr y={255} tokens={['−2', '+', '5', '=', '?']} />
        </>),
      },
      {
        caption: `מוסיפים 5: הולכים 5 צעדים ימינה ומגיעים ל-3. ${iso('−2 + 5 = 3')}.`,
        draw: () => (<>
          <HopLine from={-4} to={5} hops={[{ from: -2, to: 3, label: '+5' }]} points={[{ value: -2, label: '−2', color: 'a' }, { value: 3, label: '3', color: 'b', at: at1 }]} />
          <Expr y={255} tokens={['−2', '+', '5', '=', R('3')]} />
        </>),
      },
    ],
  },
  {
    name: 'מוסיפים שלילי – שמאלה',
    steps: [
      {
        caption: `${iso('4 + (−6)')}: מתחילים ב-4.`,
        draw: () => (<>
          <HopLine from={-4} to={6} points={[{ value: 4, label: '4', color: 'a' }]} />
          <Expr y={255} tokens={['4', '+', '(−6)', '=', '?']} />
        </>),
      },
      {
        caption: `מוסיפים ${iso('−6')}: הולכים 6 צעדים שמאלה ומגיעים ל-${iso('−2')}. ${iso('4 + (−6) = −2')}.`,
        draw: () => (<>
          <HopLine from={-4} to={6} hops={[{ from: 4, to: -2, label: '−6', color: 'b' }]} points={[{ value: 4, label: '4', color: 'a' }, { value: -2, label: '−2', color: 'b', at: at1 }]} />
          <Expr y={255} tokens={['4', '+', '(−6)', '=', R('−2')]} />
        </>),
      },
    ],
  },
  {
    name: 'שני שליליים – מחברים את המרחקים',
    steps: [
      {
        caption: `${iso('−3 + (−4)')}: מ-${iso('−3')} הולכים עוד 4 צעדים שמאלה.`,
        draw: () => (<>
          <HopLine from={-8} to={1} hops={[{ from: -3, to: -7, label: '−4', color: 'b' }]} points={[{ value: -3, label: '−3', color: 'a' }, { value: -7, label: '−7', color: 'b', at: at1 }]} />
          <Expr y={255} tokens={['−3', '+', '(−4)', '=', '?']} />
        </>),
      },
      {
        caption: `מחברים את המרחקים, ${iso('3 + 4 = 7')}, ושמים מינוס: ${iso('−3 + (−4) = −7')}. חוב ועוד חוב הם חוב גדול יותר.`,
        draw: () => (<>
          <Expr y={95} size={28} tokens={['3', '+', '4', '=', { t: '7', cls: 'b', anim: 'pop d1' }]} />
          <Expr y={190} size={32} tokens={['−3', '+', '(−4)', '=', R('−7')]} />
        </>),
      },
    ],
  },
  {
    name: 'סימנים שונים – מחסרים את המרחקים',
    steps: [
      {
        caption: `${iso('−8 + 5')}: הצעדים ימינה מבטלים חלק מהצעדים שמאלה.`,
        draw: () => (<>
          <HopLine from={-9} to={1} hops={[{ from: -8, to: -3, label: '+5' }]} points={[{ value: -8, label: '−8', color: 'a' }, { value: -3, label: '−3', color: 'b', at: at1 }]} />
          <Expr y={255} tokens={['−8', '+', '5', '=', '?']} />
        </>),
      },
      {
        caption: `מחסרים את המרחקים, ${iso('8 − 5 = 3')}. הסימן של המספר הרחוק יותר מ-0, כאן ${iso('−8')}: ${iso('−8 + 5 = −3')}.`,
        draw: () => (<>
          <Expr y={95} size={28} tokens={['8', '−', '5', '=', { t: '3', cls: 'b', anim: 'pop d1' }]} />
          <Expr y={190} size={32} tokens={['−8', '+', '5', '=', R('−3')]} />
        </>),
      },
    ],
  },
  {
    name: 'חיסור – מחברים את הנגדי',
    steps: [
      {
        caption: `${iso('5 − (−3)')}: לחסר מספר זה לחבר את הנגדי שלו. הנגדי של ${iso('−3')} הוא 3.`,
        draw: () => (<>
          <Expr y={95} size={32} hl={[1, 2]} tokens={['5', '−', '(−3)']} />
          <Expr y={190} size={32} tokens={['5', '−', '(−3)', '=', '5', '+', { t: '3', cls: 'b', anim: 'pop d2' }]} />
        </>),
      },
      {
        caption: `ומחברים: ${iso('5 + 3 = 8')}. לחסר חוב זה כמו להרוויח.`,
        draw: () => (<>
          <HopLine from={3} to={9} y={120} hops={[{ from: 5, to: 8, label: '+3' }]} points={[{ value: 5, label: '5', color: 'a' }, { value: 8, label: '8', color: 'b', at: at1 }]} />
          <Expr y={250} size={30} tokens={['5', '−', '(−3)', '=', '5', '+', '3', '=', R('8')]} />
        </>),
      },
      {
        caption: `וחיסור של מספר חיובי הוא הליכה שמאלה: ${iso('−2 − 4 = −2 + (−4) = −6')}.`,
        draw: () => (<>
          <HopLine from={-7} to={0} y={120} hops={[{ from: -2, to: -6, label: '−4', color: 'b' }]} points={[{ value: -2, label: '−2', color: 'a' }, { value: -6, label: '−6', color: 'b', at: at1 }]} />
          <Expr y={250} size={30} tokens={['−2', '−', '4', '=', '−2', '+', '(−4)', '=', R('−6')]} />
        </>),
      },
    ],
  },
];

export default scenes;
