import { render } from '@testing-library/react';
import { HopLine, lineX, CoordPlane, TriangleShape, triangleFromAngles, triangleFromSides, cornerWedges, angleAt, Rods, signed } from './geometry';

const inSvg = (el) => render(<svg>{el}</svg>).container;
const nums = (s) => s.match(/-?\d+(\.\d+)?/g).map(Number);

describe('HopLine', () => {
  test('every hop ends at the number it goes to; points sit on their values', () => {
    const X = lineX(-6, 4, 40, 560);
    const c = inSvg(<HopLine from={-6} to={4} hops={[{ from: 2, to: -3, label: '−5' }, { from: -3, to: -5 }]} points={[{ value: 2, label: '2' }, { value: -5, label: '−5' }]} />);
    const hops = [...c.querySelectorAll('[data-hop]')];
    expect(hops.map((h) => h.getAttribute('data-hop'))).toEqual(['2:-3', '-3:-5']);
    hops.forEach((h, i) => {
      const d = nums(h.querySelector('.la-hop').getAttribute('d'));
      expect(d[0]).toBeCloseTo(X([2, -3][i]), 1);
      expect(d[d.length - 2]).toBeCloseTo(X([-3, -5][i]), 1);
    });
    const pts = [...c.querySelectorAll('[data-point] circle')].map((p) => Number(p.getAttribute('cx')));
    expect(pts[0]).toBeCloseTo(X(2)); expect(pts[1]).toBeCloseTo(X(-5));
    // Numbers with a real minus sign, 0 in bold.
    expect([...c.querySelectorAll('.la-tick')].map((t) => t.textContent)).toContain('−6');
    expect(c.querySelector('.la-zero').textContent).toBe('0');
  });
  test('hops come one after another', () => {
    const c = inSvg(<HopLine from={-13} to={1} flat hops={[0, 1, 2, 3].map((i) => ({ from: -3 * i, to: -3 * i - 3 }))} />);
    const delays = [...c.querySelectorAll('.la-hop')].map((h) => parseFloat(h.style.animationDelay));
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(new Set(delays).size).toBe(4);
    expect(signed(-4)).toBe('−4');
  });
});

describe('CoordPlane', () => {
  test('points and the walk end where their coordinates are', () => {
    const c = inSvg(<CoordPlane ox={300} oy={140} unit={25} points={[{ x: -4, y: 1, label: 'B' }]} walk={{ x: 3, y: -2, label: 'A' }} />);
    const at = (x, y) => [300 + 25 * x, 140 - 25 * y];
    const b = c.querySelector('[data-point="-4,1"] circle');
    expect([Number(b.getAttribute('cx')), Number(b.getAttribute('cy'))]).toEqual(at(-4, 1));
    const a = c.querySelector('[data-point="3,-2"] circle');
    expect([Number(a.getAttribute('cx')), Number(a.getAttribute('cy'))]).toEqual(at(3, -2));
    const wx = c.querySelector('.la-walk.x'), wy = c.querySelector('.la-walk.y');
    expect(Number(wx.getAttribute('x2'))).toBe(at(3, 0)[0]);
    expect([Number(wy.getAttribute('x2')), Number(wy.getAttribute('y2'))]).toEqual(at(3, -2));
    // x first, then y.
    expect(parseFloat(wy.style.animationDelay)).toBeGreaterThan(parseFloat(wx.style.animationDelay));
  });
});

describe('triangles', () => {
  test('a triangle from its angles has those angles', () => {
    const V = triangleFromAngles(40, 75);
    expect(angleAt(V[0], V[1], V[2])).toBeCloseTo(40, 5);
    expect(angleAt(V[1], V[2], V[0])).toBeCloseTo(75, 5);
    expect(angleAt(V[2], V[0], V[1])).toBeCloseTo(65, 5);
    const T = triangleFromAngles(70, 70, { y: 235, base: 200, maxHeight: 180 });
    expect(T[0][1] - T[2][1]).toBeCloseTo(180, 5);
    expect(angleAt(T[2], T[0], T[1])).toBeCloseTo(40, 5);
    const S = triangleFromSides(6, 4, 3, { unit: 30 });
    expect(Math.hypot(S[2][0] - S[1][0], S[2][1] - S[1][1])).toBeCloseTo(120, 5);
  });
  test('the torn corners fill 180° side by side, from the left', () => {
    for (const [a, b] of [[50, 60], [90, 35], [30, 30], [25, 35]]) {
      const W = cornerWedges(triangleFromAngles(a, b));
      expect(W.reduce((s, w) => s + w.angle, 0)).toBeCloseTo(180, 5);
      expect(W[0].target).toBe(180);
      expect(W[1].target).toBeCloseTo(180 + W[0].angle, 5);
      expect(W[2].target + W[2].angle).toBeCloseTo(360, 5);
      // Each wedge, turned by `rotate`, starts at its target.
      W.forEach((w) => expect(w.start + w.rotate).toBeCloseTo(w.target, 5));
    }
  });
  test('angle labels and right-angle marks sit on the angles they name', () => {
    const c = inSvg(<TriangleShape V={triangleFromAngles(90, 35)} angleLabels={['90°', '35°', '55°']} corners="torn" />);
    expect(c.querySelector('[data-right]').getAttribute('data-right')).toBe('A');
    const labels = [...c.querySelectorAll('[data-angle]')].map((g) => g.getAttribute('data-angle').split(':'));
    labels.forEach(([, label, drawn]) => expect(Number(drawn)).toBeCloseTo(parseFloat(label), 0));
    const wedges = [...c.querySelectorAll('[data-wedge]')].map((w) => Number(w.getAttribute('data-wedge').split(':')[0]));
    expect(wedges.reduce((s, x) => s + x, 0)).toBeCloseTo(180, 0);
  });
  test('rods meet when the two are longer than the base, and lie flat with a gap when not', () => {
    const end = (rod) => {
      const [tx, ty, deg] = nums(rod.getAttribute('data-to'));
      const len = Number(rod.getAttribute('data-rod')) * 45, r = (deg * Math.PI) / 180;
      return [tx + len * Math.sin(r), ty - len * Math.cos(r)];
    };
    const yes = inSvg(<Rods base={6} left={3} right={4} />);
    const [l, r] = [...yes.querySelectorAll('[data-rod]')].map(end);
    // Within half a pixel (the turn is written to 0.1°).
    expect(Math.abs(l[0] - r[0])).toBeLessThan(0.5); expect(Math.abs(l[1] - r[1])).toBeLessThan(0.5);
    expect(yes.querySelector('.la-rods').getAttribute('data-meet')).toBe('yes');
    const no = inSvg(<Rods base={8} left={3} right={4} />);
    const [l2, r2] = [...no.querySelectorAll('[data-rod]')].map(end);
    expect(l2[1]).toBeCloseTo(220, 3); expect(r2[1]).toBeCloseTo(220, 3);
    expect(r2[0] - l2[0]).toBeCloseTo(45, 3);
    expect(no.querySelector('.la-gap')).not.toBeNull();
  });
});
