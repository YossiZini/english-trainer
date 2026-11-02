import { render } from '@testing-library/react';
import registry, { getScenes } from './index';

// Every equation drawn on a stage is right: an Expr row with "=" (numbers
// and + − × ÷ only; "?" rows and lists are skipped) has equal sides, and a
// DivEq (the division with its remainder) gives back its dividend.
const value = (side) => {
  const js = side.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  if (!/^[\d\s+\-*/().]+$/.test(js)) return null;
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${js});`)();
};

const steps = Object.keys(registry).flatMap((key) => getScenes(key).flatMap((scene) => scene.steps.map((step) => [key, scene.name, step.caption, step])));

test.each(steps)('%s %s: %s', (key, scene, caption, step) => {
  const { container, unmount } = render(<svg>{step.draw()}</svg>);
  for (const row of container.querySelectorAll('.la-expr-row')) {
    if (row.closest('[data-div-eq]')) continue; // "17 ÷ 5 = 3" with its remainder: checked below
    const text = [...row.querySelectorAll('.la-expr')].map((t) => t.textContent).join(' ');
    if (!text.includes('=')) continue;
    const sides = text.split('=').map((s) => value(s.trim()));
    if (sides.some((v) => v === null)) continue;
    sides.forEach((v) => expect([text, v]).toEqual([text, sides[0]]));
  }
  for (const eq of container.querySelectorAll('[data-div-eq]')) {
    const m = eq.getAttribute('data-div-eq').match(/^(\d+)÷(\d+)=(\d+)(?:r(\d+))?$/);
    if (!m) continue;
    const [a, d, q, r] = [m[1], m[2], m[3], m[4] || 0].map(Number);
    expect([eq.getAttribute('data-div-eq'), q * d + r, r < d]).toEqual([eq.getAttribute('data-div-eq'), a, true]);
  }
  unmount();
});
