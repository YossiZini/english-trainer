import { render } from '@testing-library/react';
import { ldCaption, ldActions } from './longSteps';
import { getScenes } from '../index';

describe('long-division captions', () => {
  test('say what the drawing does, step by step', () => {
    expect(ldCaption(72, 3, 0)).toBe('7 ÷ 3 = 2, כופלים 2 × 3 = 6, מחסרים 7 − 6 = 1, ומורידים את 2.');
    expect(ldCaption(72, 3, 1)).toBe('12 ÷ 3 = 4, כופלים 4 × 3 = 12, מחסרים 12 − 12 = 0. המנה 24.');
    expect(ldCaption(56, 7, 0)).toBe('5 קטן מ-7, ולכן מתחילים ב-56: 56 ÷ 7 = 8, כופלים 8 × 7 = 56, מחסרים 56 − 56 = 0. המנה 8.');
    expect(ldCaption(412, 4, 1)).toBe('1 קטן מ-4: כותבים 0 במנה ומורידים את 2.');
    expect(ldCaption(749, 6, 2)).toBe('29 ÷ 6 = 4, כופלים 4 × 6 = 24, מחסרים 29 − 24 = 5. המנה 124 והשארית 5.');
  });

  test('the notes beside the drawing list the same actions on their beats', () => {
    expect(ldActions(72, 3, 0).map((l) => [l.text, l.beat])).toEqual([
      ['מחלקים: 7 ÷ 3 = 2', 0], ['כופלים: 2 × 3 = 6', 1], ['מחסרים: 7 − 6 = 1', 2], ['מורידים את 2', 3],
    ]);
    expect(ldActions(412, 4, 1).map((l) => l.text)).toEqual(['1 קטן מ-4: כותבים 0', 'מורידים את 2']);
  });
});

// In every division scene the drawing agrees with itself and with the caption.
describe('division scenes', () => {
  const steps = ['105.1', '105.2', '105.3', '105.4'].flatMap((key) => getScenes(key).flatMap((scene) => scene.steps.map((step) => ({ key, scene: scene.name, step }))));

  test.each(steps.map((s) => [s.key, s.scene, s.step.caption, s.step]))('%s %s: %s', (key, scene, caption, step) => {
    const { container, unmount } = render(<svg>{step.draw()}</svg>);
    // Counters and the equation: the groups and their size are the quotient
    // and the divisor (or the other way round, when sharing), the leftovers the remainder.
    const eq = container.querySelector('[data-div-eq]');
    const counters = container.querySelector('.la-counters');
    if (eq && counters && /r\d+$/.test(eq.getAttribute('data-div-eq'))) {
      const [, a, d, q, r] = eq.getAttribute('data-div-eq').match(/^(\d+)÷(\d+)=(\d+)r(\d+)$/).map(Number);
      expect(Number(counters.getAttribute('data-total'))).toBe(a);
      expect(Number(counters.getAttribute('data-left'))).toBe(r);
      const groups = Number(counters.getAttribute('data-groups'));
      expect([q, d]).toContain(groups);
    }
    // Long division: the newest quotient digit is the one the caption divides to.
    const ld = container.querySelector('.la-ld');
    const divided = caption.match(/(\d+) ÷ (\d+) = (\d+), כופלים/);
    if (ld && divided) expect(ld.getAttribute('data-ld-q').slice(-1)).toBe(divided[3].slice(-1));
    if (ld && /כותבים 0 במנה/.test(caption)) expect(ld.getAttribute('data-ld-q').slice(-1)).toBe('0');
    unmount();
  });
});
