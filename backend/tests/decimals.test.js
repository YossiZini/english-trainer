const d = require('../src/database/seeds/decimals/common');

/**
 * The exact decimal arithmetic of the decimals chapter (seeds/decimals/common.js):
 * every promise its comments make, on whole numbers only (no floating point).
 */
const s = (v) => d.str(v);

describe('decimals: exact arithmetic', () => {
  test('numbers are written with a leading zero and no trailing zeros, unless places are asked', () => {
    expect([s('2.360'), s('3.0'), s('0.5'), s('7')]).toEqual(['2.36', '3', '0.5', '7']);
    expect([d.str('2.5', 2), d.str('3', 2)]).toEqual(['2.50', '3.00']);
    expect(() => d.str('2.555', 2)).toThrow('more than 2 digits');
    expect(() => d.D('.5')).toThrow('not a decimal');
    expect(() => d.D('-1')).toThrow('not a decimal');
  });

  test('the four operations are exact where floating point is not', () => {
    expect(s(d.add('0.1', '0.2'))).toBe('0.3');
    expect(s(d.sub('3.2', '1.45'))).toBe('1.75');
    expect(s(d.mul('0.3', '0.2'))).toBe('0.06');
    expect(s(d.mul('1.1', '1.1'))).toBe('1.21');
    expect(s(d.div('1.2', '0.3'))).toBe('4');
    expect(s(d.div('7', '4'))).toBe('1.75');
    expect(() => d.sub('1', '2')).toThrow('negative');
    expect(() => d.div('1', '3')).toThrow('does not end');
  });

  test('shift multiplies and divides by 10, 100, 1000', () => {
    expect([1, 2, 3, -1, -2].map((k) => s(d.shift('3.45', k)))).toEqual(['34.5', '345', '3450', '0.345', '0.0345']);
  });

  test('round is half up; cut drops the digits', () => {
    expect([s(d.round('2.47', 1)), s(d.round('2.45', 1)), s(d.round('2.44', 1)), s(d.round('9.96', 1)), s(d.round('3.5', 0))]).toEqual(['2.5', '2.5', '2.4', '10', '4']);
    expect(s(d.cut('2.47', 1))).toBe('2.4');
  });

  test('compare and fractions', () => {
    expect([d.cmp('0.45', '0.5'), d.cmp('0.5', '0.50'), d.cmp('1.2', '1.15')]).toEqual([-1, 0, 1]);
    expect([s(d.ofFraction(3, 4)), s(d.ofFraction(1, 8)), s(d.ofFraction(7, 20))]).toEqual(['0.75', '0.125', '0.35']);
  });
});

describe('decimals: wrong options from the common mistakes', () => {
  test('points not lined up: digits from the right, or wholes and parts apart', () => {
    expect(d.addWrongs('2.5', '1.75').map(s)).toEqual(['2', '3.8']);
    expect(d.addWrongs('1.5', '2.5')).toEqual([]); // the same number of places: no such mistake
  });

  test('the smaller digit from the larger in each column, or the wholes only', () => {
    expect(d.subWrongs('3.2', '1.45').map(s)).toEqual(['2.25']);
    expect(d.subWrongs('5', '1.25').map(s)).toEqual(['4.25', '4.25']);
  });

  test('the point counted from one factor only: 0.3 × 0.2 = 0.6', () => {
    expect(s(d.mulWrongs('0.3', '0.2')[0])).toBe('0.6');
    expect(s(d.mulWrongs('0.3', '0.2')[1])).toBe('0.5');
  });

  test('wrongsOf keeps three options that differ from the answer by value', () => {
    expect(d.wrongsOf('0.5', ['0.50', '0.05', '5', '0.5', '50'])).toEqual(['0.05', '5', '50']);
    expect(d.wrongsOf('2.5', ['2.75', '3', '2.25'], 2)).toEqual(['2.75', '3.00', '2.25']);
    expect(() => d.wrongsOf('1', ['1.0', '2'])).toThrow('Not enough wrong options');
  });

  test('decQ writes the answer and its options alike, with places for money', () => {
    const q = d.decQ(1, 'easy', 'כמה?', d.add('1.25', '1.25'), ['2', '3', '2.25'], 'הסבר', { places: 2 });
    expect(q.correctAnswer).toBe('2.50');
    expect(q.options.sort()).toEqual(['2.00', '2.25', '2.50', '3.00']);
  });
});
