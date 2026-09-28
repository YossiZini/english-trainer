import React, { useEffect, useRef } from 'react';

/**
 * Stage primitives for lesson animations (see LessonAnimation.jsx).
 * The stage is an SVG with viewBox 0 0 640 280, drawn left-to-right.
 * Geometry and colours match the theory pictures (backend seeds/math-svg.js):
 * colour "a" = accent, "b" = second fraction, "sum" = result / overlap.
 *
 * Animation classes (defined in LessonAnimation.css): pop, rise, fadein,
 * draw, shake; delays d1..d5. Pass them via `anim`.
 */

const STAGE_W = 640;
export const STAGE = { width: STAGE_W, height: 280, barX: 120, barW: 400, barH: 54 };

/** Text helper: centred, middle baseline. */
export const Text = ({ x, y, children, cls = '', anchor = 'middle', rtl = false, style }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    dominantBaseline="middle"
    className={cls}
    direction={rtl ? 'rtl' : undefined}
    unicodeBidi={rtl ? 'embed' : undefined}
    style={style}
  >
    {children}
  </text>
);

/** Stacked fraction label n/d centred on (x, y). */
export const Frac = ({ x, y, n, d, cls = '', anim = '' }) => (
  <g className={anim} style={{ transformOrigin: `${x}px ${y}px` }}>
    <Text x={x} y={y - 16} cls={`la-fr-label ${cls}`}>{n}</Text>
    <line x1={x - 16} y1={y} x2={x + 16} y2={y} className="la-fr-line" />
    <Text x={x} y={y + 18} cls={`la-fr-label ${cls}`}>{d}</Text>
  </g>
);

/** Big operator / equals sign. */
export const Eq = ({ x, y, children, anim = '' }) => (
  <Text x={x} y={y} cls={`la-eq ${anim}`} style={{ transformOrigin: `${x}px ${y}px` }}>{children}</Text>
);

// Arithmetic inside a Hebrew note keeps its left-to-right order (bidi isolates).
const MATH_RUN = /(\d[\d\s+−×÷=/.,%:()₪?]*\d|\d)/g;
const isolateMath = (text) => String(text).replace(MATH_RUN, (m) => (/[+−×÷=/]/.test(m) ? `\u2066${m}\u2069` : m));

/** Hebrew note under a drawing. */
export const Note = ({ x, y, children, anim = '' }) => (
  <Text x={x} y={y} cls={`la-note ${anim}`} rtl>{typeof children === 'string' ? isolateMath(children) : children}</Text>
);

/**
 * A bar of `n` equal parts, `k` of them filled (from `offset`), optional
 * dashed sub-division of each part into `subdiv`, optional per-part labels.
 * `slide` = { dy } moves the whole bar after mount (transition), e.g. to put
 * the second fraction's parts on the first fraction's row.
 * `onlyFilled` draws just the filled parts (for sliding them alone).
 */
export const Bar = ({
  x = STAGE.barX, y, w = STAGE.barW, h = STAGE.barH, n, k, color = 'a',
  anim = '', subdiv = 0, offset = 0, labelParts = false, onlyFilled = false, slide = null
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!slide || !ref.current) return undefined;
    const el = ref.current;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => { el.style.transform = `translate(${slide.dx || 0}px, ${slide.dy || 0}px)`; });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [slide]);

  const pw = w / n;
  const parts = [];
  for (let i = 0; i < n; i++) {
    const filled = i >= offset && i < offset + k;
    if (onlyFilled && !filled) continue;
    parts.push(<rect key={`p${i}`} x={x + i * pw} y={y} width={pw} height={h} className={`la-part ${filled ? color : 'empty'}`} />);
  }
  const dividers = [];
  if (subdiv > 1) {
    for (let i = 0; i < n; i++) {
      for (let j = 1; j < subdiv; j++) {
        const lx = x + i * pw + (pw / subdiv) * j;
        dividers.push(
          <line key={`s${i}-${j}`} x1={lx} y1={y} x2={lx} y2={y + h} className={`la-dashed draw d${Math.min(5, j + i)}`} style={{ transformOrigin: `${lx}px ${y + h / 2}px` }} />
        );
      }
    }
  }
  const labels = labelParts
    ? Array.from({ length: n }, (_, i) => <Text key={`l${i}`} x={x + i * pw + pw / 2} y={y + h + 16} cls="la-tick">{`1/${n}`}</Text>)
    : null;
  return (
    <g ref={ref} className={`${anim} ${slide ? 'la-slide' : ''}`.trim()} style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}>
      {parts}{dividers}{labels}
    </g>
  );
};

/** A circle cut into `n` slices, `k` filled. */
export const Circle = ({ cx, cy, r = 46, n, k, color = 'a', anim = '' }) => {
  const slices = [];
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n - Math.PI / 2;
    const a1 = (2 * Math.PI * (i + 1)) / n - Math.PI / 2;
    const d = n === 1
      ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
      : `M ${cx} ${cy} L ${(cx + r * Math.cos(a0)).toFixed(2)} ${(cy + r * Math.sin(a0)).toFixed(2)} A ${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(2)} ${(cy + r * Math.sin(a1)).toFixed(2)} Z`;
    slices.push(<path key={i} d={d} className={`la-part ${i < k ? color : 'empty'}`} />);
  }
  return <g className={anim} style={{ transformOrigin: `${cx}px ${cy}px` }}>{slices}</g>;
};

/** Number line from `from` to `to` with `den` ticks per whole and marked points [{value, label, color}]. */
export const NumberLine = ({ x = 80, y = 150, w = 480, from = 0, to = 1, den = 4, points = [], anim = '' }) => {
  const px = (v) => x + ((v - from) / (to - from)) * w;
  const ticks = [];
  for (let whole = from; whole <= to; whole++) {
    for (let j = 0; j < den; j++) {
      const v = whole + j / den;
      if (v > to) break;
      const big = j === 0;
      ticks.push(<line key={`t${v}`} x1={px(v)} y1={y - (big ? 12 : 6)} x2={px(v)} y2={y + (big ? 12 : 6)} className="la-fr-line" />);
      if (big) ticks.push(<Text key={`n${v}`} x={px(v)} y={y + 30} cls="la-tick">{v}</Text>);
    }
  }
  return (
    <g className={anim}>
      <line x1={x} y1={y} x2={x + w} y2={y} className="la-fr-line" />
      {ticks}
      {points.map((p, i) => (
        <g key={i} className={`pop d${Math.min(5, i + 1)}`} style={{ transformOrigin: `${px(p.value)}px ${y}px` }}>
          <circle cx={px(p.value)} cy={y} r={7} className={`la-point ${p.color || (i === 0 ? 'a' : 'b')}`} />
          <Text x={px(p.value)} y={y - 24} cls={`la-point-label ${p.color || (i === 0 ? 'a' : 'b')}`}>{p.label}</Text>
        </g>
      ))}
    </g>
  );
};

/** Curved arrow with an arrow head; put <ArrowDefs/> once in the stage. */
export const ArrowDefs = () => (
  <defs>
    <marker id="la-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" className="la-arrow-head" />
    </marker>
  </defs>
);
export const Arrow = ({ d, anim = '' }) => (
  <path d={d} className={`la-arrow ${anim}`} markerEnd="url(#la-arr)" />
);

/** Area grid rows × cols; first shadeRows rows colour a, first shadeCols columns colour b, overlap sum. */
export const Grid = ({ x, y, size = 200, rows, cols, shadeRows = 0, shadeCols = 0, anim = '' }) => {
  const w = size / cols, h = size / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const inRow = r < shadeRows, inCol = c < shadeCols;
      const cls = inRow && inCol ? 'sum' : inRow ? 'a' : inCol ? 'b' : 'empty';
      cells.push(<rect key={`${r}-${c}`} x={x + c * w} y={y + r * h} width={w} height={h} className={`la-part la-cell ${cls}`} />);
    }
  }
  return <g className={anim} style={{ transformOrigin: `${x + size / 2}px ${y + size / 2}px` }}>{cells}</g>;
};
