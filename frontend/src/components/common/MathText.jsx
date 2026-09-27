import React from 'react';
import './MathText.css';

/**
 * Renders text that may contain fractions written as a/b or as mixed numbers
 * (1 1/2) the way textbooks print them: numerator over denominator with a
 * horizontal bar. Everything else is rendered as plain text, including the
 * bidi isolate characters the Math seeds use around expressions.
 *
 * Students still type answers as 3/4; this component only changes display.
 */

// A mixed number "1 1/2" or a simple fraction "3/4". The whole part must be
// a standalone number (not the tail of a longer one).
const FRACTION = /(?<![\d.,/])(?:(\d+) )?(\d+)\/(\d+)(?![\d.,/])/g;

export function splitFractions(text) {
  const parts = [];
  const source = String(text ?? '');
  let last = 0;
  for (const match of source.matchAll(FRACTION)) {
    const [whole, mixed, num, den] = match;
    if (match.index > last) parts.push({ text: source.slice(last, match.index) });
    parts.push({ whole: mixed || null, num, den, raw: whole });
    last = match.index + whole.length;
  }
  if (last < source.length) parts.push({ text: source.slice(last) });
  return parts;
}

const Fraction = ({ whole, num, den, raw }) => (
  <span className="math-frac" dir="ltr" role="math" aria-label={raw}>
    {whole && <span className="math-frac-whole">{whole}</span>}
    <span className="math-frac-stack" aria-hidden="true">
      <span className="math-frac-num">{num}</span>
      <span className="math-frac-den">{den}</span>
    </span>
  </span>
);

const MathText = ({ text, as: Tag = 'span', className = '', ...rest }) => {
  const parts = splitFractions(text);
  return (
    <Tag className={`math-text ${className}`.trim()} {...rest}>
      {parts.map((part, i) =>
        part.text !== undefined ? part.text : <Fraction key={i} {...part} />
      )}
    </Tag>
  );
};

export default MathText;
