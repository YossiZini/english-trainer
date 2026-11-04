const { balance, hundredGrid, decimalLine, placeValue, columnCalc, ratioBar, ratioTable, valueTable, coordGrid } = require('../src/database/seeds/math-svg');

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

/** The cells of a hundred grid: { kind, x, y } in the order drawn. */
const cells = (svg) => [...svg.matchAll(/<rect data-cell="(\w)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="([^"]+)"/g)]
  .map((m) => ({ kind: m[1], x: Number(m[2]), y: Number(m[3]), w: Number(m[4]), h: Number(m[5]), fill: m[6] }));

describe('hundredGrid(): tenths and hundredths of a square', () => {
  test('the first cells are shaded column by column, so a full column is a tenth', () => {
    const c = cells(hundredGrid(45));
    expect(c).toHaveLength(100);
    const shaded = c.filter((q) => q.kind === 'a');
    expect(shaded).toHaveLength(45);
    // Four full columns and five cells of the fifth, from the top.
    expect(new Set(shaded.map((q) => q.x)).size).toBe(5);
    expect(shaded.filter((q) => q.x === Math.max(...shaded.map((s) => s.x))).map((q) => q.y)).toEqual([0, 12, 24, 36, 48]);
    expect(shaded.every((q) => q.fill === '#667eea')).toBe(true);
  });

  test('parts 10 draws ten whole columns', () => {
    const c = cells(hundredGrid(3, { parts: 10 }));
    expect(c).toHaveLength(10);
    expect(c.every((q) => q.h === 120)).toBe(true);
    expect(c.filter((q) => q.kind === 'a').map((q) => q.x)).toEqual([0, 12, 24]);
  });

  test('extra cells follow in the second colour', () => {
    const svg = hundredGrid(30, { extra: 25 });
    const c = cells(svg);
    expect(c.filter((q) => q.kind === 'b')).toHaveLength(25);
    expect(c.filter((q) => q.kind === 'b').every((q) => q.fill === '#f5a623' && q.x >= 36)).toBe(true);
    expect(svg).toContain('data-shaded="30" data-extra="25"');
  });

  test('too many cells or other parts are refused', () => {
    expect(() => hundredGrid(80, { extra: 30 })).toThrow('do not fit');
    expect(() => hundredGrid(5, { parts: 20 })).toThrow('parts must be 10 or 100');
  });
});

/** Ticks, labels and points of a decimal number line, with their x. */
function line(svg) {
  const ticks = [...svg.matchAll(/<line data-tick="([\d.]+)" x1="([\d.]+)"/g)].map((m) => [m[1], Number(m[2])]);
  const labels = [...svg.matchAll(/<text data-label="([\d.]+)" x="([\d.]+)"[^>]*>([^<]*)</g)].map((m) => [m[1], Number(m[2]), m[3]]);
  const points = [...svg.matchAll(/<circle data-point="([\d.]+)" cx="([\d.]+)"/g)].map((m) => [m[1], Number(m[2])]);
  return { ticks, labels, points };
}

describe('decimalLine(): a number line of tenths or hundredths', () => {
  test('a tick for every tenth, evenly spaced, each labelled with its number', () => {
    const { ticks, labels } = line(decimalLine({ from: '0', to: '1' }));
    expect(ticks.map((t) => t[0])).toEqual(['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
    const gaps = ticks.slice(1).map((t, i) => +(t[1] - ticks[i][1]).toFixed(1));
    expect(new Set(gaps).size).toBe(1);
    expect(labels.every(([v, , text]) => v === text)).toBe(true);
  });

  test('hundredths between two tenths; labelEvery keeps the ends and every fifth', () => {
    const { ticks, labels } = line(decimalLine({ from: '0.4', to: '0.5', places: 2, labelEvery: 5 }));
    expect(ticks).toHaveLength(11);
    expect(ticks[5][0]).toBe('0.45');
    expect(labels.map((l) => l[0])).toEqual(['0.4', '0.45', '0.5']);
  });

  test('a point stands on its tick, with its label or the number above it', () => {
    const svg = decimalLine({ from: '0.4', to: '0.5', places: 2, points: [{ at: '0.45' }, { at: '0.42', label: 'A', color: 'b' }] });
    const { ticks, points } = line(svg);
    for (const [at, x] of points) expect(x).toBe(ticks.find((t) => t[0] === at)[1]);
    expect(svg).toMatch(/fill="#667eea">0\.45</);
    expect(svg).toMatch(/fill="#f5a623">A</);
  });

  test('too many ticks, a point off the line, or too many digits are refused', () => {
    expect(() => decimalLine({ from: '0', to: '1', places: 2 })).toThrow('1 to 20 ticks');
    expect(() => decimalLine({ from: '0', to: '1', points: [{ at: '1.5' }] })).toThrow('off the line');
    expect(() => decimalLine({ from: '0', to: '1', points: [{ at: '0.45' }] })).toThrow('at most 1 places');
  });
});

/** The digits of each row of a place-value table, by place, and the column of each header. */
function table(svg) {
  const digits = [...svg.matchAll(/data-row="(\d)" data-place="(\w+)" data-digit="(\d)" x="([\d.]+)"/g)]
    .map((m) => ({ row: Number(m[1]), place: m[2], digit: m[3], x: Number(m[4]) }));
  const heads = [...svg.matchAll(/<text x="([\d.]+)" y="17"[^>]*>([^<]+)</g)].map((m) => [m[2], Number(m[1])]);
  const points = [...svg.matchAll(/data-row="(\d)" data-point="1" x="([\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
  return { digits, heads, points };
}

describe('placeValue(): a place-value table', () => {
  test('each digit stands under its place, the point between ones and tenths', () => {
    const { digits, heads, points } = table(placeValue(['3.45']));
    expect(heads.map((h) => h[0])).toEqual(['אחדות', 'עשיריות', 'מאיות']);
    expect(digits.map((d) => `${d.place}:${d.digit}`)).toEqual(['ones:3', 'tenths:4', 'hundredths:5']);
    const headX = Object.fromEntries(heads);
    expect(digits.map((d) => d.x)).toEqual([headX['אחדות'], headX['עשיריות'], headX['מאיות']]);
    expect(points[0][1]).toBeGreaterThan(digits[0].x);
    expect(points[0][1]).toBeLessThan(digits[1].x);
  });

  test('only the columns the numbers need; a whole number has no point', () => {
    const { heads, points } = table(placeValue(['125.6', '7']));
    expect(heads.map((h) => h[0])).toEqual(['מאות', 'עשרות', 'אחדות', 'עשיריות']);
    expect(points.map((p) => p[0])).toEqual([0]);
  });

  test('mark shades the column of that place', () => {
    const svg = placeValue(['3.45'], { mark: 'tenths' });
    const x = Number(svg.match(/data-mark="tenths" x="([\d.]+)" y="0" width="([\d.]+)"/)[1]);
    const w = Number(svg.match(/data-mark="tenths" x="[\d.]+" y="0" width="([\d.]+)"/)[1]);
    const four = table(svg).digits.find((d) => d.place === 'tenths');
    expect(four.x).toBe(x + w / 2);
    expect(() => placeValue(['3.45'], { mark: 'thousandths' })).toThrow('no thousandths column');
  });

  test('move draws an arrow from each digit to its new place, from the first non-zero digit', () => {
    const times10 = placeValue(['0.45', '4.5'], { move: 1 });
    expect([...times10.matchAll(/data-arrow="([^"]+)"/g)].map((m) => m[1])).toEqual(['tenths>ones', 'hundredths>tenths']);
    const by100 = placeValue(['125.6', '1.256'], { move: -2 });
    expect([...by100.matchAll(/data-arrow="([^"]+)"/g)].map((m) => m[1])).toEqual(['hundreds>ones', 'tens>tenths', 'ones>hundredths', 'tenths>thousandths']);
    expect(placeValue(['3.45'])).not.toContain('data-arrow');
  });

  test('a number it cannot draw is refused', () => {
    expect(() => placeValue(['3.4567'])).toThrow('not a decimal');
    expect(() => placeValue(['.5'])).toThrow('not a decimal');
  });
});

/** Each row of a column sum as written (digits, point and filled zeros) and the x of its point. */
function columns(svg) {
  return Object.fromEntries([...svg.matchAll(/<g data-row="(\w+)" data-value="([\d.]+)">(.*?)<\/g>/g)].map((m) => {
    const chars = [...m[3].matchAll(/<text x="([\d.-]+)" y="[\d.]+"( data-filled="1")?[^>]*>([^<]+)</g)]
      .map((c) => ({ x: Number(c[1]), filled: !!c[2], ch: c[3] }))
      .filter((c) => /[\d.]/.test(c.ch))
      .sort((a, b) => a.x - b.x);
    return [m[1], { value: m[2], written: chars.map((c) => c.ch).join(''), filled: chars.filter((c) => c.filled).length, point: (chars.find((c) => c.ch === '.') || {}).x, xs: chars.map((c) => c.x) }];
  }));
}

describe('columnCalc(): adding and subtracting with the points lined up', () => {
  test('every row has as many digits after the point as the longest; the filled zeros are marked', () => {
    const c = columns(columnCalc({ top: '2.5', bottom: '1.75', op: '+', result: '4.25' }));
    expect([c.top.written, c.bottom.written, c.result.written]).toEqual(['2.50', '1.75', '4.25']);
    expect([c.top.filled, c.bottom.filled, c.result.filled]).toEqual([1, 0, 0]);
    expect(new Set([c.top.point, c.bottom.point, c.result.point]).size).toBe(1);
  });

  test('digits of the same place stand in one column; a whole number gets its point and zeros', () => {
    const svg = columnCalc({ top: '5', bottom: '1.25', op: '−', result: '3.75' });
    const c = columns(svg);
    expect(c.top.written).toBe('5.00');
    expect(c.top.filled).toBe(2);
    expect(c.top.xs).toEqual(c.bottom.xs);
    expect(c.bottom.xs).toEqual(c.result.xs);
    expect(svg).toMatch(/>−<\/text>/);
    // A longer whole part lines up from the point too.
    const d = columns(columnCalc({ top: '12.5', bottom: '3.75', result: '16.25' }));
    expect(d.bottom.xs).toEqual(d.top.xs.slice(1));
  });

  test('only + and − are drawn', () => {
    expect(() => columnCalc({ top: '2', bottom: '3', op: '×', result: '6' })).toThrow('op must be + or −');
  });
});

/** The rows of a bar model: label, parts, each value and the colour of each part, with x of each part. */
const bars = (svg) => [...svg.matchAll(/<g data-row="(\d+)" data-label="([^"]*)" data-parts="(\d+)" data-each="([^"]*)" data-split="([^"]*)">([\s\S]*?)<\/g>/g)]
  .map((m) => ({
    label: m[2], parts: Number(m[3]), each: m[4], split: m[5],
    kinds: [...m[6].matchAll(/data-part="(\w)" x="([\d.]+)"/g)].map((p) => p[1]).join(''),
    xs: [...m[6].matchAll(/data-part="\w" x="([\d.]+)"/g)].map((p) => Number(p[1])),
    values: [...m[6].matchAll(/fill="#ffffff">([^<]+)</g)].map((v) => v[1])
  }));

describe('ratioBar(): a bar model of a ratio', () => {
  test('a row of equal parts for each amount, lined up from the same edge, named at the right', () => {
    const svg = ratioBar([{ label: 'בנים', parts: 2 }, { label: 'בנות', parts: 3, color: 'b' }]);
    const [boys, girls] = bars(svg);
    expect([boys.parts, girls.parts]).toEqual([2, 3]);
    expect([boys.kinds, girls.kinds]).toEqual(['aa', 'bbb']);
    expect(girls.xs.slice(0, 2)).toEqual(boys.xs);
    expect(new Set(girls.xs.slice(1).map((x, i) => x - girls.xs[i])).size).toBe(1);
    expect(svg).toMatch(/text-anchor="end"[^>]*>בנים</);
  });

  test('each writes the value of one part in every part', () => {
    const [dan] = bars(ratioBar([{ label: 'דן', parts: 3, each: 5 }]));
    expect(dan.values).toEqual(['5', '5', '5']);
    expect(bars(ratioBar([{ label: 'דן', parts: 3 }]))[0].values).toEqual([]);
  });

  test('split colours the first parts blue and the rest orange', () => {
    const [whole] = bars(ratioBar([{ label: 'הכיתה', parts: 5, split: 2 }]));
    expect(whole.kinds).toBe('aabbb');
    expect(() => ratioBar([{ parts: 3, split: 3 }])).toThrow('does not cut');
    expect(() => ratioBar([{ parts: 13 }])).toThrow('1 to 12 parts');
  });
});

describe('ratioTable(): a table of equal ratios', () => {
  test('a column per pair, each value in its row and column', () => {
    const svg = ratioTable({ heads: ['מחברות', 'מחיר'], cols: [[3, 12], [1, 4], [5, 20]] });
    const cells = [...svg.matchAll(/data-col="(\d)" data-row="(\d)" data-value="([^"]*)" x="([\d.]+)" y="([\d.]+)"/g)]
      .map((m) => ({ c: Number(m[1]), r: Number(m[2]), v: m[3], x: Number(m[4]), y: Number(m[5]) }));
    expect(cells.map((q) => `${q.c}${q.r}:${q.v}`)).toEqual(['00:3', '01:12', '10:1', '11:4', '20:5', '21:20']);
    // A column shares its x; a row shares its y, the top row above the bottom one.
    expect(cells[0].x).toBe(cells[1].x);
    expect(cells[0].y).toBe(cells[2].y);
    expect(cells[1].y).toBeGreaterThan(cells[0].y);
    expect(svg).not.toContain('data-step');
  });

  test('steps are written above and below with an arrow; the missing term stands out', () => {
    const svg = ratioTable({ heads: ['מחברות', 'מחיר'], cols: [[3, 12], [1, 4], [5, 'x']], steps: ['÷ 3', '× 5'] });
    expect([...svg.matchAll(/data-step="([^"]+)"/g)].map((m) => m[1])).toEqual(['÷ 3', '÷ 3', '× 5', '× 5']);
    expect((svg.match(/marker-end="url\(#rt-head\)"/g) || []).length).toBe(4);
    expect(svg).toMatch(/data-value="x"[^>]*fill="#f5a623" font-style="italic">x</);
    expect(() => ratioTable({ heads: ['א', 'ב'], cols: [[1, 2], [2, 4]], steps: ['× 2', '× 3'] })).toThrow('2 steps for 2 columns');
  });
});

describe('valueTable(): the table of values of a rule', () => {
  test('x on top and y under it, negatives with a real minus, "x" and "y" in italics at the right', () => {
    const svg = valueTable({ cols: [[-1, -1], [0, 1], [1, 3], [2, '?']] });
    const cells = [...svg.matchAll(/data-col="(\d)" data-row="(\d)" data-value="([^"]*)" x="([\d.]+)"/g)].map((m) => `${m[1]}${m[2]}:${m[3]}`);
    expect(cells).toEqual(['00:\u22121', '01:\u22121', '10:0', '11:1', '20:1', '21:3', '30:2', '31:?']);
    // A negative value is a value, not the one to find; '?' is.
    expect(svg).toMatch(/data-value="\u22121"[^>]*fill="#2b2f3a">\u22121</);
    expect(svg).toMatch(/data-value="\?"[^>]*fill="#f5a623" font-style="italic">\?</);
    expect(svg).toMatch(/font-style="italic">x<\/text>/);
    expect(svg).toMatch(/aria-label="טבלת ערכים של x ו-y"/);
  });

  test('a negative typed with a hyphen is a value with a real minus, not the one to find', () => {
    const svg = valueTable({ cols: [[-1, '-3'], [0, '?']] });
    expect(svg).toMatch(/data-value="\u22123"[^>]*fill="#2b2f3a">\u22123</);
    expect((svg.match(/font-style="italic">\?</g) || []).length).toBe(1);
    expect(svg).not.toMatch(/data-value="-3"/);
  });

  test('a step can differ between the rows, and one row may have no arrow', () => {
    const svg = valueTable({ cols: [[0, 1], [1, 3], [2, 5]], steps: [['+1', '+2'], ['+1', null]] });
    expect([...svg.matchAll(/data-step="([^"]+)"/g)].map((m) => m[1])).toEqual(['+1', '+2', '+1']);
    expect((svg.match(/marker-end="url\(#rt-head\)"/g) || []).length).toBe(3);
    expect(() => valueTable({ cols: [[0, 1], [1, 3]], steps: [['+1', '+2'], ['+1', '+2']] })).toThrow('valueTable: 2 steps for 2 columns');
  });

  test('a ratio table is unchanged: plain heads, one step for both rows', () => {
    const svg = ratioTable({ heads: ['מחברות', 'מחיר'], cols: [[3, 12], [6, 24]], steps: ['× 2'] });
    expect(svg).toMatch(/text-anchor="end" fill="#2b2f3a">מחברות<\/text>/);
    expect(svg).toContain('data-ratio-table="1"');
    expect(svg).not.toContain('data-value-table');
  });
});

describe('coordGrid(): a whole line y = mx + b', () => {
  // Back from pixels to the grid: 22 per unit, 22 from the edge.
  const ends = (svg, xMin = -4, yMax = 4) => {
    const m = svg.match(/<line data-graph="1" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/);
    return [[m[1], m[2]], [m[3], m[4]]].map(([x, y]) => [xMin + (Number(x) - 22) / 22, yMax - (Number(y) - 22) / 22]);
  };

  test('the line runs from edge to edge of the grid and keeps its rule', () => {
    const [[x1, y1], [x2, y2]] = ends(coordGrid({ graphs: [{ m: 2, b: 1 }] }));
    // y = 2x + 1 leaves a −4…4 grid through its bottom and top edges.
    expect([x1, y1, x2, y2]).toEqual([-2.5, -4, 1.5, 4]);
    const [[a, c], [d, e]] = ends(coordGrid({ xMin: -2, xMax: 6, yMin: -3, yMax: 6, graphs: [{ m: -1, b: 3 }] }), -2, 6);
    expect([a, c, d, e]).toEqual([-2, 5, 6, -3]);
    expect((e - c) / (d - a)).toBe(-1);
  });

  test('a flat line spans the grid; a line that misses it, or a label without a place, is refused', () => {
    expect(ends(coordGrid({ graphs: [{ m: 0, b: 3 }] }))).toEqual([[-4, 3], [4, 3]]);
    expect(() => coordGrid({ graphs: [{ m: 0, b: 5 }] })).toThrow('misses the grid');
    expect(() => coordGrid({ graphs: [{ m: 1, b: 9 }] })).toThrow('misses the grid');
    expect(() => coordGrid({ graphs: [{ m: 1, b: 0, label: 'y = x' }] })).toThrow('needs labelAt');
  });

  test('the line is drawn under the points, with its rule left to right', () => {
    const svg = coordGrid({ points: [{ x: 1, y: 3, label: 'A' }], graphs: [{ m: 2, b: 1, color: 'b', label: 'y = 2x + 1', labelAt: [1.5, 4], anchor: 'end' }] });
    expect(svg.indexOf('data-graph')).toBeLessThan(svg.indexOf('<circle'));
    expect(svg).toMatch(/<line data-graph="1"[^>]*stroke="#f5a623"/);
    expect(svg).toMatch(/text-anchor="end"[^>]*direction="ltr"[^>]*>y = 2x \+ 1<\/text>/);
    expect(coordGrid({})).not.toContain('data-graph');
  });
});
