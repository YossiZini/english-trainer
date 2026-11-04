const r = require('../src/database/seeds/ratio/common');

/** The ratio helpers of the ratio chapter (seeds/ratio/common.js): each promise of their comments. */
describe('ratio helpers', () => {
  test('a ratio is written with no spaces', () => {
    expect(r.ratio(3, 5)).toBe('3:5');
    expect(r.ratio(2, 3, 4)).toBe('2:3:4');
  });

  test('simplest divides every term by their greatest common divisor', () => {
    expect(r.simplest(12, 18)).toEqual([2, 3]);
    expect(r.simplest(6, 9, 12)).toEqual([2, 3, 4]);
    expect(r.simplest(2, 3)).toEqual([2, 3]);
    expect(() => r.simplest(2, 0)).toThrow('not a ratio of whole numbers');
    expect(() => r.simplest(1.5, 2)).toThrow('not a ratio of whole numbers');
  });

  test('same compares by cross products', () => {
    expect(r.same([2, 3], [4, 6])).toBe(true);
    expect(r.same([2, 3], [3, 2])).toBe(false);
    expect(r.same([2, 3], [4, 5])).toBe(false);
  });

  test('share counts the parts, one part and every share', () => {
    expect(r.share(40, [3, 5])).toEqual({ parts: 8, one: 5, shares: [15, 25] });
    expect(r.share(84, [1, 2, 4])).toEqual({ parts: 7, one: 12, shares: [12, 24, 48] });
    expect(() => r.share(40, [3, 4])).toThrow('does not split into 7 equal parts');
  });

  test('missing finds any one term of a proportion, or refuses', () => {
    expect(r.missing(3, 4, null, 12)).toBe(9);
    expect(r.missing(2, 5, 4, null)).toBe(10);
    expect(r.missing(null, 10, 3, 5)).toBe(6);
    expect(r.missing(4, null, 6, 9)).toBe(6);
    expect(() => r.missing(3, 4, 5, null)).toThrow('has no whole term');
    expect(() => r.missing(3, 4, null, null)).toThrow('exactly one term');
  });

  test('wrongsOf keeps three whole numbers that are not the answer', () => {
    expect(r.wrongsOf(9, [11, 9, 16, 11, -1, 2.5, 36])).toEqual(['11', '16', '36']);
    expect(() => r.wrongsOf(1, [1, 2])).toThrow('Not enough wrong options');
  });
});
