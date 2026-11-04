const f = require('../src/database/seeds/functions/common');

const M = '−';

/** The helpers of the linear functions chapter (seeds/functions/common.js): each promise of their comments. */
describe('linear function helpers', () => {
  test('a rule is written y first, then the x term, then the number', () => {
    expect(f.rule(2, 1)).toBe('y = 2x + 1');
    expect(f.rule(-1, 3)).toBe(`y = ${M}x + 3`);
    expect(f.rule(1, -2)).toBe(`y = x ${M} 2`);
    expect(f.rule(3, 0)).toBe('y = 3x');
    expect(f.rule(0, -2)).toBe(`y = ${M}2`);
    expect(f.rule(-2, -6)).toBe(`y = ${M}2x ${M} 6`);
  });

  test('a rule takes whole numbers only (the bot shows a fraction flat)', () => {
    expect(() => f.rule(0.5, 1)).toThrow('whole slope and intercept');
    expect(() => f.rule(2, 1.5)).toThrow('whole slope and intercept');
  });

  test('subst puts x in, a negative x in parentheses unless it comes first', () => {
    expect(f.subst(2, 1, 3)).toBe('y = 2 × 3 + 1 = 7');
    expect(f.subst(2, 1, -1)).toBe(`y = 2 × (${M}1) + 1 = ${M}1`);
    expect(f.subst(-1, 3, -2)).toBe(`y = ${M}(${M}2) + 3 = 5`);
    expect(f.subst(1, 5, -2)).toBe(`y = ${M}2 + 5 = 3`);
    expect(f.subst(4, 0, 0)).toBe('y = 4 × 0 = 0');
    expect(f.subst(-2, 8, 3)).toBe(`y = ${M}2 × 3 + 8 = 2`);
  });

  test('slopeOf two points: rise, run and the slope, a fraction when it is one', () => {
    expect(f.slopeOf([1, 3], [3, 7])).toEqual({ rise: 4, run: 2, slope: '2' });
    expect(f.slopeOf([0, 5], [2, 1])).toEqual({ rise: -4, run: 2, slope: `${M}2` });
    expect(f.slopeOf([0, 1], [4, 3])).toEqual({ rise: 2, run: 4, slope: '1/2' });
    expect(f.slopeOf([4, 3], [0, 1]).slope).toBe('1/2');
    expect(() => f.slopeOf([2, 1], [2, 5])).toThrow('one above the other');
  });

  test('ruleQ offers glued rules, the swapped and sign-flipped ones as wrong options', () => {
    const q = f.ruleQ(1, 'easy', 'מה הכלל?', [2, -1], 'הסבר.');
    const glued = (s) => s.replace(/ /g, ' ');
    expect(q.correctAnswer).toBe(glued(`y = 2x ${M} 1`));
    expect(q.options).toHaveLength(4);
    expect(q.options).toEqual(expect.arrayContaining([glued(`y = ${M}x + 2`), glued('y = 2x + 1')]));
    q.options.forEach((o) => expect(o).not.toMatch(/ /));
  });

  test('pointQ and numQ write a real minus; wrong options never repeat the answer', () => {
    const p = f.pointQ(1, 'easy', 'איזו נקודה?', [3, 0], 'הסבר.', { extra: [[0, 3]] });
    expect(p.correctAnswer).toBe('(3, 0)');
    expect(p.options).toContain('(0, 3)');
    expect(new Set(p.options).size).toBe(4);
    const n = f.numQ(2, 'easy', 'כמה?', -3, [3, -3, 2, 0], 'הסבר.');
    expect(n.correctAnswer).toBe(`${M}3`);
    expect(n.options.sort()).toEqual(['0', '2', '3', `${M}3`].sort());
    expect(() => f.wrongsOf(1, [1, 2])).toThrow('Not enough wrong options');
  });

  test('a question grid is at most 9 units high', () => {
    expect(() => f.questionGraph({ yMin: -4, yMax: 6, lines: [{ m: 1, b: 0 }] })).toThrow('10 units high');
    expect(f.questionGraph({ yMin: -3, yMax: 6, lines: [{ m: 1, b: 0 }] })).toContain('data-graph="1"');
  });

  test('stairs climb along the line: 1 to the right, then the slope up or down', () => {
    expect(f.stairs(-2, 3, [0])).toEqual([
      { from: [0, 3], to: [1, 3], dashed: true, color: 'b' },
      { from: [1, 3], to: [1, 1], arrow: true, color: 'b', label: `${M}2` }
    ]);
    expect(f.tableOf(2, 1, [-1, 0, 2])).toEqual([[-1, -1], [0, 1], [2, 5]]);
  });

  test('graphPic turns the caption\'s isolates into spans its dir="auto" skips', () => {
    const html = f.graphPic({ lines: [{ m: 1, b: 0 }] }, `הישר ${f.ltr('y = x')}`);
    expect(html).toContain('<span dir="ltr">y = x</span>');
    expect(html).not.toMatch(/[⁦⁩]/);
  });
});
