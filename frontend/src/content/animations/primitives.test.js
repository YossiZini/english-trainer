import { render } from '@testing-library/react';
import { Expr, BarChart, HundredGrid, PriceTag, isolateMath, groupLayout, Counters, arrayLayout, DotArray, DivEq, longDivisionSteps, LongDivision } from './primitives';

const inSvg = (el) => render(<svg>{el}</svg>).container;

describe('Expr', () => {
  test('lays tokens out left to right in order and highlights a range', () => {
    const c = inSvg(<Expr tokens={['3', '+', '4', '×', { t: '2', cls: 'result' }]} hl={[2, 4]} />);
    const texts = [...c.querySelectorAll('text')];
    expect(texts.map((t) => t.textContent)).toEqual(['3', '+', '4', '×', '2']);
    const xs = texts.map((t) => Number(t.getAttribute('x')));
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
    expect(c.querySelector('.la-expr-row').getAttribute('direction')).toBe('ltr');
    expect(texts[4].classList.contains('result')).toBe(true);
    const box = c.querySelector('[data-hl="2-4"]');
    expect(Number(box.getAttribute('x'))).toBeLessThan(xs[2]);
    expect(Number(box.getAttribute('x')) + Number(box.getAttribute('width'))).toBeGreaterThan(xs[4]);
  });

  test('draws no box without hl and centres the row on x', () => {
    const c = inSvg(<Expr x={300} tokens={['8', '=', '8']} />);
    expect(c.querySelector('.la-expr-hl')).toBeNull();
    const xs = [...c.querySelectorAll('text')].map((t) => Number(t.getAttribute('x')));
    expect(xs[1]).toBeCloseTo(300);
  });
});

describe('BarChart', () => {
  const values = [{ label: 'א', value: 80 }, { label: 'ב', value: 90 }, { label: 'ג', value: 100 }];

  test('scales bars to the largest value and draws the mean line', () => {
    const c = inSvg(<BarChart y={40} h={180} values={values} mean={90} />);
    const bars = [...c.querySelectorAll('.la-bar')];
    expect(bars.map((b) => b.getAttribute('data-value'))).toEqual(['80', '90', '100']);
    expect(Number(bars[2].getAttribute('height'))).toBeCloseTo(180);
    expect(Number(bars[0].getAttribute('height'))).toBeCloseTo(144);
    const mean = c.querySelector('[data-mean="90"]');
    expect(Number(mean.getAttribute('y1'))).toBeCloseTo(40 + 180 - 162);
    expect(c.querySelector('.la-mean-label').textContent).toBe('90');
  });

  test('a null value leaves an empty slot', () => {
    const c = inSvg(<BarChart values={[{ value: 70 }, { value: null }]} mean={80} />);
    expect(c.querySelectorAll('.la-bar')).toHaveLength(1);
    expect([...c.querySelectorAll('.la-bar-value')].map((t) => t.textContent)).toEqual(['70']);
  });

  test('levelled shows the mean as every value label', () => {
    const c = inSvg(<BarChart values={values} mean={90} levelled />);
    expect([...c.querySelectorAll('.la-bar-value')].map((t) => t.textContent)).toEqual(['90', '90', '90']);
  });
});

describe('HundredGrid', () => {
  test('shades k of 100 cells', () => {
    const c = inSvg(<HundredGrid k={40} />);
    expect(c.querySelectorAll('.la-cell')).toHaveLength(100);
    expect(c.querySelectorAll('.la-cell.a')).toHaveLength(40);
    expect(c.querySelectorAll('.la-cell.empty')).toHaveLength(60);
  });
});

describe('PriceTag', () => {
  test('shows the price in shekels, a label, and a strike-through when asked', () => {
    const c = inSvg(<PriceTag x={100} y={100} price={150} label="לפני" strike />);
    expect(c.querySelector('.la-tag-price').textContent).toBe('150 ₪');
    expect(c.querySelector('.la-tag-sub').textContent).toBe('לפני');
    expect(c.querySelector('.la-strike')).not.toBeNull();
    expect(inSvg(<PriceTag x={1} y={1} price={9} />).querySelector('.la-strike')).toBeNull();
  });
});

describe('groupLayout and Counters', () => {
  const perGroup = (L) => L.counters.reduce((m, c) => ({ ...m, [c.group]: (m[c.group] || 0) + 1 }), {});
  const inStage = (x, y, r) => x - r >= 0 && x + r <= 640 && y - r >= 0 && y + r <= 280;

  test.each([[17, 5, 3, 2], [12, 3, 4, 0], [7, 7, 1, 0]])('%i ÷ %i: %i groups and %i left over', (total, each, groups, left) => {
    const L = groupLayout(total, each);
    expect([L.groups, L.left]).toEqual([groups, left]);
    const counts = perGroup(L);
    for (let g = 0; g < groups; g++) expect(counts[g]).toBe(each);
    expect(counts[-1] || 0).toBe(left);
    expect(L.boxes).toHaveLength(groups);
  });

  test('a set number of groups leaves the rest over: 30 shared by 8, 17 after two groups of 5', () => {
    expect(groupLayout(30, 3, { groups: 8 })).toMatchObject({ groups: 8, left: 6 });
    expect(groupLayout(17, 5, { groups: 2 })).toMatchObject({ groups: 2, left: 7 });
  });

  test('every counter, in the pile and in its group, and every outline stays on the stage', () => {
    const cases = [];
    for (let each = 2; each <= 9; each++) for (let total = each; total <= 50; total++) cases.push([total, each, {}]);
    cases.push([30, 3, { groups: 8 }], [17, 5, { groups: 2 }], [38, 7, { labels: true }]);
    for (const [total, each, opts] of cases) {
      const L = groupLayout(total, each, { x: 20, y: 10, w: 600, h: 195, ...opts });
      for (const c of L.counters) {
        expect(inStage(c.x, c.y, L.r)).toBe(true);
        expect(inStage(c.px, c.py, L.r)).toBe(true);
      }
      for (const b of [...L.boxes, ...(L.leftBox ? [L.leftBox] : [])]) {
        expect(b.x >= 0 && b.x + b.w <= 640 && b.y >= 0 && b.y + b.h <= 280).toBe(true);
      }
    }
  });

  test('groups run right to left, row after row, and the leftovers come after the last group', () => {
    for (const [total, each, opts] of [[17, 5, {}], [38, 7, { labels: true }], [30, 3, { groups: 8 }]]) {
      const L = groupLayout(total, each, { h: 195, ...opts });
      const slots = [...L.boxes, L.leftBox];
      for (let i = 1; i < slots.length; i++) {
        const [a, b] = [slots[i - 1], slots[i]];
        expect(b.y > a.y || (b.y === a.y && b.x < a.x)).toBe(true);
      }
    }
    expect(new Set(groupLayout(17, 5).boxes.map((b) => b.y)).size).toBe(1); // one row
  });

  test('renders the groups, the leftovers in the second colour, and the pile without outlines', () => {
    const c = inSvg(<Counters total={17} each={5} labels />);
    expect(c.querySelectorAll('.la-counter[data-group="0"]')).toHaveLength(5);
    expect(c.querySelectorAll('.la-counter[data-group="left"].b')).toHaveLength(2);
    expect(c.querySelectorAll('[data-box]')).toHaveLength(3);
    expect(c.querySelector('.la-left-count').textContent).toBe('2');
    const pile = inSvg(<Counters total={17} each={5} phase="pile" />);
    expect(pile.querySelectorAll('.la-counter')).toHaveLength(17);
    expect(pile.querySelectorAll('[data-box]')).toHaveLength(0);
  });

  test('gather starts each counter at its pile place; leftovers can be dropped or get one more group', () => {
    const g = inSvg(<Counters total={17} each={5} phase="gather" />);
    const moved = [...g.querySelectorAll('.la-counter')].filter((el) => /translate\(/.test(el.getAttribute('style')));
    expect(moved).toHaveLength(17);
    expect(g.querySelectorAll('.la-counter.la-turn')).toHaveLength(2);
    expect(inSvg(<Counters total={30} each={8} left="dim" />).querySelectorAll('.la-counter.dim')).toHaveLength(6);
    const extra = inSvg(<Counters total={30} each={8} left="extra" />);
    expect(extra.querySelector('[data-box="extra"]')).not.toBeNull();
    expect(extra.querySelectorAll('.la-seat')).toHaveLength(2);
  });
});

describe('DivEq', () => {
  test('writes the quotient, then "ושארית" with the remainder', () => {
    const c = inSvg(<DivEq a={17} d={5} q={3} r={2} />);
    expect([...c.querySelectorAll('.la-expr')].map((t) => t.textContent)).toEqual(['17', '÷', '5', '=', '3']);
    expect(c.querySelector('.la-div-rest').textContent).toBe('ושארית 2');
    expect(inSvg(<DivEq a={17} d={5} />).querySelector('.la-div-rest')).toBeNull();
  });
});

describe('long division', () => {
  test('75 ÷ 3: two steps, as written in school', () => {
    const { quotient, remainder, steps } = longDivisionSteps(75, 3);
    expect([quotient, remainder]).toEqual([25, 0]);
    expect(steps.map(({ col, current, qd, product, rest, down }) => ({ col, current, qd, product, rest, down }))).toEqual([
      { col: 0, current: 7, qd: 2, product: 6, rest: 1, down: 5 },
      { col: 1, current: 15, qd: 5, product: 15, rest: 0, down: null },
    ]);
    expect(steps[1].rows.map((r) => r.text)).toEqual(['6', '15', '15', '0']);
  });

  test('412 ÷ 4: a zero in the quotient brings the next digit down beside the last row', () => {
    const { quotient, steps } = longDivisionSteps(412, 4);
    expect(quotient).toBe(103);
    expect(steps.map((s) => [s.qd, s.product])).toEqual([[1, 4], [0, null], [3, 12]]);
    expect(steps.map((s) => s.rows.map((r) => r.text).join(','))).toEqual(['4,01', '4,012', '4,012,12,0']);
    expect(steps[2].hl).toEqual({ row: 1, first: 0, last: 2 });
  });

  test('every step multiplies, subtracts and ends at the quotient and remainder', () => {
    for (let d = 2; d <= 9; d++) {
      for (let a = d; a <= 999; a += 7) {
        const { quotient, remainder, steps } = longDivisionSteps(a, d);
        expect([quotient, remainder]).toEqual([Math.floor(a / d), a % d]);
        for (const s of steps) {
          expect(s.qd).toBe(Math.floor(s.current / d));
          if (s.product != null) expect([s.product, s.rest]).toEqual([s.qd * d, s.current - s.qd * d]);
        }
      }
    }
  });

  test('draws the quotient and rows so far, the newest step highlighted, inside the stage', () => {
    const one = inSvg(<LongDivision a={75} d={3} upto={1} />).querySelector('.la-ld');
    expect([one.getAttribute('data-ld-q'), one.getAttribute('data-ld-rows')]).toEqual(['2', '6,15']);
    expect(one.querySelector('[data-ld-hl]').getAttribute('data-ld-hl')).toBe('-1:0-0');
    const full = inSvg(<LongDivision a={749} d={6} upto={3} x={170} />);
    expect(full.querySelector('.la-ld').getAttribute('data-ld-q')).toBe('124');
    expect(full.querySelector('.la-ld-rest').textContent).toBe('5');
    for (const t of full.querySelectorAll('text')) {
      const x = Number(t.getAttribute('x')), y = Number(t.getAttribute('y'));
      expect(x > 10 && x < 630 && y > 10 && y < 270).toBe(true);
    }
  });
});

describe('isolateMath', () => {
  test('isolates an equation on one line; a number before a colon stays with its words', () => {
    const nb = (t) => t.replace(/ /g, '\u00a0');
    expect(isolateMath('מחברים: 85 × 4 = 340.')).toBe(`מחברים: \u2066${nb('85 × 4 = 340')}\u2069.`);
    expect(isolateMath('מכנה משותף 6: 1/2 = 3/6')).toBe(`מכנה משותף 6: \u2066${nb('1/2 = 3/6')}\u2069`);
    expect(isolateMath('7, 14, 21')).toBe('7, 14, 21');
  });
});

describe('DotArray', () => {
  test('rows × cols dots; faded last columns; the second colour from a row or a column on', () => {
    const c = inSvg(<DotArray rows={6} cols={10} fadeCols={1} />);
    expect(c.querySelectorAll('.la-counter')).toHaveLength(60);
    expect(c.querySelectorAll('.la-counter.dim')).toHaveLength(6);
    expect([...c.querySelectorAll('.la-counter.dim')].every((d) => d.getAttribute('data-col') === '9')).toBe(true);
    expect(inSvg(<DotArray rows={4} cols={7} splitRows={2} />).querySelectorAll('.la-counter.b')).toHaveLength(14);
    expect(inSvg(<DotArray rows={4} cols={12} splitCols={6} />).querySelectorAll('.la-counter.b')).toHaveLength(24);
  });

  test('a turn starts every dot at its place in the turned array (3 rows of 4 become 4 rows of 3)', () => {
    const turned = arrayLayout(4, 3, { turn: true }), before = arrayLayout(3, 4, { turn: true });
    for (const d of turned.dots) {
      const from = before.dots.find((e) => e.row === d.col && e.col === d.row);
      expect([d.tx, d.ty]).toEqual([from.x, from.y]);
    }
    const moved = [...inSvg(<DotArray rows={4} cols={3} phase="turn" />).querySelectorAll('.la-counter')]
      .filter((el) => /translate\(/.test(el.getAttribute('style')));
    expect(moved).toHaveLength(12);
  });

  test('every dot, in the pile, in place and where a turn starts, stays on the stage', () => {
    for (let rows = 1; rows <= 10; rows++) {
      for (let cols = 1; cols <= 12; cols++) {
        for (const turn of [false, true]) {
          const L = arrayLayout(rows, cols, { x: 20, y: 8, w: 600, h: 195, turn });
          for (const d of L.dots) {
            for (const [x, y] of [[d.x, d.y], [d.px, d.py], ...(turn ? [[d.tx, d.ty]] : [])]) {
              expect(x - L.r >= 0 && x + L.r <= 640 && y - L.r >= 0 && y + L.r <= 280).toBe(true);
            }
          }
        }
      }
    }
  });
});
