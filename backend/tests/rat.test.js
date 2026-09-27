const R = require('../src/database/seeds/fractions/rat');

describe('rational helper used by the Fractions seeds', () => {
  test('parse and normalise', () => {
    expect(R.parse('6/8')).toEqual([3, 4]);
    expect(R.parse('1 1/2')).toEqual([3, 2]);
    expect(R.parse(5)).toEqual([5, 1]);
    expect(() => R.parse('1/0')).toThrow();
  });

  test('arithmetic', () => {
    expect(R.str(R.add('1/2', '1/3'))).toBe('5/6');
    expect(R.str(R.sub('3/4', '1/6'))).toBe('7/12');
    expect(R.str(R.mul('2/3', '3/4'))).toBe('1/2');
    expect(R.str(R.div('3/4', '1/2'))).toBe('3/2');
    expect(R.str(R.mul('3/8', 24))).toBe('9');
    expect(R.str(R.sub(1, R.add('1/3', '1/4')))).toBe('5/12');
  });

  test('formatting and comparison', () => {
    expect(R.mixed('11/4')).toBe('2 3/4');
    expect(R.mixed('4/2')).toBe('2');
    expect(R.mixed(R.add('1 1/2', '2 3/4'))).toBe('4 1/4');
    expect(R.cmp('2/3', '3/5')).toBe(1);
    expect(R.largest(['2/3', '3/5', '7/10'])).toBe('7/10');
    expect(R.smallest(['2/3', '3/5', '7/10'])).toBe('3/5');
  });
});
