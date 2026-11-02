import React from 'react';
import { LongDivision, longDivisionSteps, LD_TIMES, Text, isolateMath } from '../primitives';

// Long division scenes for the division chapter (2.3, 2.4). The caption and
// the notes beside the drawing are written from the same steps the drawing
// uses (longDivisionSteps), so their numbers cannot disagree.

/** The actions of step k in words, each with the beat it appears on. */
export function ldActions(a, d, k) {
  const s = longDivisionSteps(a, d).steps[k];
  if (s.product == null) {
    return [{ text: `${s.current} קטן מ-${d}: כותבים 0`, beat: 0 }, { text: `מורידים את ${s.down}`, beat: 3 }];
  }
  const lines = [
    { text: `מחלקים: ${s.current} ÷ ${d} = ${s.qd}`, beat: 0 },
    { text: `כופלים: ${s.qd} × ${d} = ${s.product}`, beat: 1 },
    { text: `מחסרים: ${s.current} − ${s.product} = ${s.rest}`, beat: 2 },
  ];
  if (s.down != null) lines.push({ text: `מורידים את ${s.down}`, beat: 3 });
  return lines;
}

/** The caption of step k: what is divided, multiplied, subtracted and brought down. */
export function ldCaption(a, d, k) {
  const { steps, quotient, remainder } = longDivisionSteps(a, d);
  const s = steps[k];
  let text = k === 0 && s.hl.last > 0 ? `${String(a)[0]} קטן מ-${d}, ולכן מתחילים ב-${s.current}: ` : '';
  if (s.product == null) return `${text}${s.current} קטן מ-${d}: כותבים 0 במנה ומורידים את ${s.down}.`;
  text += `${s.current} ÷ ${d} = ${s.qd}, כופלים ${s.qd} × ${d} = ${s.product}, מחסרים ${s.current} − ${s.product} = ${s.rest}`;
  if (s.down != null) return `${text}, ומורידים את ${s.down}.`;
  return `${text}. ${remainder ? `המנה ${quotient} והשארית ${remainder}.` : `המנה ${quotient}.`}`;
}

const NOTE_X = 455;

/** Notes in a column beside the drawing, appearing on their beats. */
const Notes = ({ lines }) => lines.map((l, i) => (
  <Text
    key={i}
    x={NOTE_X}
    y={62 + i * 46}
    rtl
    cls={`la-ld-note ${l.beat == null ? '' : 'fadein'}`}
    style={l.beat == null ? undefined : { animationDelay: `${LD_TIMES[l.beat]}s` }}
  >
    {isolateMath(l.text)}
  </Text>
));

/** The drawing after `upto` steps, with the newest step's actions beside it. */
export const LdStage = ({ a, d, upto, notes }) => (
  <>
    <LongDivision a={a} d={d} upto={upto} x={150} />
    <Notes lines={notes || (upto > 0 ? ldActions(a, d, upto - 1) : [
      { text: 'מחלקים' }, { text: 'כופלים' }, { text: 'מחסרים' }, { text: 'מורידים' },
    ])} />
  </>
);

/**
 * A scene that writes a ÷ d step by step: an optional opening step (the
 * numbers only, the four actions listed), then one step per quotient digit.
 */
export function longScene(name, a, d, { intro = null, extra = [] } = {}) {
  const { steps } = longDivisionSteps(a, d);
  return {
    name,
    steps: [
      ...(intro ? [{ caption: intro, draw: () => <LdStage a={a} d={d} upto={0} /> }] : []),
      ...steps.map((_, k) => ({ caption: ldCaption(a, d, k), draw: () => <LdStage a={a} d={d} upto={k + 1} /> })),
      ...extra,
    ],
  };
}
