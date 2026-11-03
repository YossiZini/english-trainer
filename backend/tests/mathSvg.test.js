const { balance } = require('../src/database/seeds/math-svg');

/**
 * The balance scale of the equations chapter (math-svg.js balance()): each
 * option tested by what the picture shows. A pan's content is read back
 * from the data-* attributes the picture carries (the chapter's check reads
 * them the same way).
 */
function read(svg) {
  const [, leftPart, rightPart] = svg.split(/data-pan="(?:left|right)"/);
  const pan = (s) => ({
    boxes: (s.match(/data-item="box"/g) || []).length,
    labels: [...s.matchAll(/data-item="box" data-label="([^"]*)"/g)].map((m) => m[1]),
    weights: [...s.matchAll(/data-item="weight" data-value="(\d+)"/g)].map((m) => Number(m[1])),
    units: (s.match(/data-item="unit"/g) || []).length,
    crossed: (s.match(/data-crossed="1"/g) || []).length,
    bags: (s.match(/data-item="bag"/g) || []).length,
    groups: (s.match(/data-group="/g) || []).length
  });
  return { tilt: svg.match(/data-tilt="(\w+)"/)[1], left: pan(leftPart), right: pan(rightPart) };
}
const viewBox = (svg) => svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
const beam = (svg) => [...svg.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="#2b2f3a" stroke-width="5"/g)]
  .map((m) => m.slice(1).map(Number)).find(([x1, , x2]) => x1 !== x2);

describe('balance(): a balance scale for equations', () => {
  test('each pan holds its boxes, weights and unit cubes', () => {
    const b = read(balance({ left: ['x', { units: 5 }], right: [12] }));
    expect(b.left).toMatchObject({ boxes: 1, labels: ['x'], weights: [], units: 5, crossed: 0 });
    expect(b.right).toMatchObject({ boxes: 0, weights: [12], units: 0 });
    // { box: '?' } before the letter (10.1); { weight: n } is the same as n.
    const q = read(balance({ left: [{ box: '?' }, { weight: 3 }], right: [{ units: 7 }] }));
    expect(q.left).toMatchObject({ labels: ['?'], weights: [3] });
    expect(q.right.units).toBe(7);
  });

  test('level unless tilted; the heavier side is lower', () => {
    const level = balance({ left: ['x'], right: [4] });
    expect(read(level).tilt).toBe('level');
    const [, ly, , ry] = beam(level);
    expect(ly).toBe(ry);
    const left = balance({ left: ['x', 'x', 5], right: [8], tilt: 'left' });
    expect(read(left).tilt).toBe('left');
    const [, y1, , y2] = beam(left);
    expect(y1).toBeGreaterThan(y2); // SVG y grows downwards: the left end is lower
    const [, z1, , z2] = beam(balance({ left: [3], right: ['x', 'x'], tilt: 'right' }));
    expect(z2).toBeGreaterThan(z1);
  });

  test('crossed items are struck and counted on both pans', () => {
    const svg = balance({ left: ['x', { units: 5, crossed: true }], right: [{ units: 7 }, { units: 5, crossed: true }] });
    const b = read(svg);
    expect([b.left.crossed, b.right.crossed]).toEqual([5, 5]);
    expect([b.left.units, b.right.units]).toEqual([5, 12]);
    // A struck cube: faded, with a red line over it.
    expect((svg.match(/stroke="#d0342c"/g) || []).length).toBe(10);
  });

  test('groups ring a pan in equal parts, or refuse', () => {
    const svg = balance({ left: ['x', 'x', 'x'], right: [{ units: 12 }], groups: { left: 3, right: 3 } });
    const b = read(svg);
    expect([b.left.groups, b.right.groups]).toEqual([3, 3]);
    // Each ring on the right holds 4 cubes.
    const rings = svg.split('data-pan="right"')[1].split('data-group="').slice(1);
    expect(rings.map((r) => (r.match(/data-item="unit"/g) || []).length)).toEqual([4, 4, 4]);
    expect(() => balance({ left: ['x', 'x'], right: [{ units: 7 }], groups: { right: 2 } })).toThrow('7 pieces do not split into 2 equal groups');
  });

  test('a bag holds its items: 2(x + 3) is two bags of a box and 3 cubes', () => {
    const b = read(balance({ left: [{ bag: ['x', { units: 3 }] }, { bag: ['x', { units: 3 }] }], right: [{ units: 14 }] }));
    expect(b.left).toMatchObject({ bags: 2, boxes: 2, units: 6 });
    expect(b.right.units).toBe(14);
  });

  test('every piece stays inside the picture, at any scale', () => {
    for (const opts of [
      { left: ['x', { units: 5 }], right: [{ units: 12 }] },
      { left: [{ bag: ['x', { units: 3 }] }, { bag: ['x', { units: 3 }] }], right: [{ units: 14 }] },
      { left: ['x', 'x', 'x', { units: 2 }], right: ['x', { units: 10 }], tilt: 'left' },
      { left: ['x', 'x', 'x'], right: [{ units: 12 }], groups: { left: 3, right: 3 }, scale: 0.8 }
    ]) {
      const svg = balance(opts);
      const [W, H] = viewBox(svg);
      for (const m of svg.matchAll(/<rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
        const [x, y, w, h] = m.slice(1).map(Number);
        expect(x).toBeGreaterThanOrEqual(0); expect(y).toBeGreaterThanOrEqual(0);
        expect(x + w).toBeLessThanOrEqual(W); expect(y + h).toBeLessThanOrEqual(H);
      }
      const width = Number(svg.match(/ width="(\d+)"/)[1]);
      expect(width).toBe(Math.round(W * (opts.scale || 1)));
    }
  });

  test('an unknown item is refused', () => {
    expect(() => balance({ left: [{ apple: 1 }], right: [1] })).toThrow('balance: unknown item');
  });
});
