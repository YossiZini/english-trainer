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
// Not part of a decimal (7,5 / 7.5), a longer number or a path (1/2/3);
// a comma that separates list items is fine.
// A '?' may stand for an unknown numerator or denominator (3/4 = ?/12).
const FRACTION = /(?<![\d./?]|\d[.,])(?:(\d+) )?(\d+|\?)\/(\d+|\?)(?![\d/?]|[.,]\d)/g;

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

// A glued isolate (LRI…PDI with no-break spaces and no plain one) is one
// equation. When it holds a fraction it is kept on one line: a browser breaks
// a line right next to the fraction's box, even before a no-break space
// (measured in Chromium at 360 and 390 px), and an equation broken in two
// reads backwards in Hebrew.
const GLUED_ISOLATE = /⁦[^⁩ ]* [^⁩ ]*⁩/g;

const renderParts = (text, prefix) => splitFractions(text).map((part, i) =>
  part.text !== undefined ? part.text : <Fraction key={`${prefix}${i}`} {...part} />
);

const MathText = ({ text, as: Tag = 'span', className = '', ...rest }) => {
  const source = String(text ?? '');
  const nodes = [];
  let last = 0;
  for (const match of source.matchAll(GLUED_ISOLATE)) {
    if (!splitFractions(match[0]).some((part) => part.num !== undefined)) continue;
    if (match.index > last) nodes.push(...renderParts(source.slice(last, match.index), `t${match.index}-`));
    nodes.push(<span key={`l${match.index}`} className="math-line">{renderParts(match[0], `l${match.index}-`)}</span>);
    last = match.index + match[0].length;
  }
  if (last < source.length || !nodes.length) nodes.push(...renderParts(source.slice(last), `e${last}-`));
  return (
    <Tag className={`math-text ${className}`.trim()} {...rest}>
      {nodes}
    </Tag>
  );
};

export default MathText;
