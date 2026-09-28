import { render } from '@testing-library/react';
import { Expr, BarChart, HundredGrid, PriceTag } from './primitives';

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
