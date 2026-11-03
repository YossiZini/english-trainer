import { render } from '@testing-library/react';
import MathText, { splitFractions } from './MathText';

describe('splitFractions', () => {
  test('simple fraction inside Hebrew text', () => {
    expect(splitFractions('כמה זה 3/4 מתוך 24?')).toEqual([
      { text: 'כמה זה ' },
      { whole: null, num: '3', den: '4', raw: '3/4' },
      { text: ' מתוך 24?' },
    ]);
  });

  test('mixed number and expression with bidi isolates', () => {
    const parts = splitFractions('⁦1 1/2 + 2 3/4 = ?⁩');
    expect(parts.map(p => p.raw || p.text)).toEqual(['⁦', '1 1/2', ' + ', '2 3/4', ' = ?⁩']);
    expect(parts[1]).toMatchObject({ whole: '1', num: '1', den: '2' });
  });

  test('plain numbers, decimals, percents and dates are left alone', () => {
    expect(splitFractions('25% מ-80 הם 20')).toEqual([{ text: '25% מ-80 הם 20' }]);
    expect(splitFractions('0.75 = 3/4')).toEqual([
      { text: '0.75 = ' },
      { whole: null, num: '3', den: '4', raw: '3/4' },
    ]);
    expect(splitFractions('1/2/3')).toEqual([{ text: '1/2/3' }]);
    expect(splitFractions('7,5/8')).toEqual([{ text: '7,5/8' }]);
    expect(splitFractions('1/2, 3/4').filter(p => p.raw).map(p => p.raw)).toEqual(['1/2', '3/4']);
    expect(splitFractions('סך הכול 4 1/4.').filter(p => p.raw).map(p => p.raw)).toEqual(['4 1/4']);
    expect(splitFractions('3/4.5')).toEqual([{ text: '3/4.5' }]);
    expect(splitFractions('')).toEqual([]);
  });

  test('an unknown numerator or denominator is a fraction too', () => {
    expect(splitFractions('3/4 = ?/12').filter(p => p.raw).map(p => p.raw)).toEqual(['3/4', '?/12']);
    expect(splitFractions('9/? = 3/4').filter(p => p.raw).map(p => p.raw)).toEqual(['9/?', '3/4']);
  });
});

test('MathText renders numerator over denominator', () => {
  const { container } = render(<MathText text="3/4 ÷ 1/2 = ?" />);
  const fracs = container.querySelectorAll('.math-frac');
  expect(fracs).toHaveLength(2);
  expect(fracs[0].querySelector('.math-frac-num').textContent).toBe('3');
  expect(fracs[0].querySelector('.math-frac-den').textContent).toBe('4');
  expect(fracs[0].getAttribute('aria-label')).toBe('3/4');
  expect(container.textContent).toContain('÷');
});

describe('a glued equation that holds a fraction stays on one line', () => {
  const LRI = '⁦', PDI = '⁩', NB = ' ';

  test('a glued isolate with a fraction is wrapped in math-line; the text around it is not', () => {
    const text = `מכנה 10: ${LRI}3/10${NB}=${NB}0.3${PDI}.`;
    const { container } = render(<MathText text={text} />);
    const lines = container.querySelectorAll('.math-line');
    expect(lines).toHaveLength(1);
    // The fraction reads as its numerator and denominator: "3" over "10".
    expect(lines[0].textContent).toBe(`${LRI}310${NB}=${NB}0.3${PDI}`);
    expect(lines[0].querySelectorAll('.math-frac')).toHaveLength(1);
    expect(container.textContent.startsWith('מכנה 10: ')).toBe(true);
    expect(container.textContent.endsWith(`${PDI}.`)).toBe(true);
  });

  test('isolates with plain spaces (the fractions chapter), without a fraction, or a lone fraction stay as they were', () => {
    for (const text of [`${LRI}9/12 − 2/12 = 7/12${PDI}`, `${LRI}2.5${NB}+${NB}1.75${PDI}`, `השבר ${LRI}3/4${PDI} גדול`]) {
      const { container } = render(<MathText text={text} />);
      expect(container.querySelector('.math-line')).toBeNull();
    }
  });
});
