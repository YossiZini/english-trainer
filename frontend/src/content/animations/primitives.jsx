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

// Arithmetic inside Hebrew text keeps its left-to-right order (bidi
// isolates); without them "85 × 4 = 340" shows as "340 = 4 × 85". Used by
// Note and by the player's captions; non-breaking spaces keep an equation
// on one line on a phone. A colon ends a run: in "מכנה משותף 6: 1/2 = 3/6"
// the 6 belongs to the words before it, not to the equation.
const MATH_RUN = /(\d[\d\s+−×÷=/.,%()₪?]*\d|\d)/g;
export const isolateMath = (text) => String(text).replace(MATH_RUN, (m) => (/[+−×÷=/]/.test(m) ? `\u2066${m.replace(/ /g, '\u00a0')}\u2069` : m));

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

/**
 * Arithmetic expression as a row of tokens, left-to-right, centred on (x, y).
 * A token is a string or { t, cls, anim } (cls "result" colours it, "dim"
 * greys it out). `hl` = [first, last] token indexes draws a highlight box
 * behind that range (the part being computed now).
 */
const exprTokens = (tokens) => tokens.map((t) => (typeof t === 'object' && t !== null ? t : { t: String(t) }));
const tokenWidths = (toks, size) => toks.map((k) => (/^[()]$/.test(k.t) ? size * 0.4 : Math.max(size * 0.7, String(k.t).length * size * 0.6)));
/** Width of an Expr row, to place things beside it. */
export const exprWidth = (tokens, size = 30, gap = 14) => {
  const toks = exprTokens(tokens);
  return tokenWidths(toks, size).reduce((a, b) => a + b, 0) + gap * (toks.length - 1);
};

export const Expr = ({ x = 320, y = 140, tokens, hl = null, size = 30, gap = 14, anim = '' }) => {
  const toks = exprTokens(tokens);
  const widths = tokenWidths(toks, size);
  const total = exprWidth(tokens, size, gap);
  let cursor = x - total / 2;
  const centres = widths.map((w) => { const c = cursor + w / 2; cursor += w + gap; return c; });
  let box = null;
  if (hl && toks.length) {
    const a = Math.max(0, hl[0]), b = Math.min(toks.length - 1, hl[1]);
    const x0 = centres[a] - widths[a] / 2 - 6, x1 = centres[b] + widths[b] / 2 + 6;
    box = <rect x={x0} y={y - size * 0.72} width={x1 - x0} height={size * 1.44} rx={8} className="la-hl la-expr-hl fadein" data-hl={`${a}-${b}`} />;
  }
  return (
    <g className={`la-expr-row ${anim}`.trim()} direction="ltr" style={{ transformOrigin: `${x}px ${y}px` }}>
      {box}
      {toks.map((k, i) => (
        <text
          key={i}
          x={centres[i]}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`la-expr ${k.cls || ''} ${k.anim || ''}`.trim()}
          style={{ fontSize: size, transformOrigin: `${centres[i]}px ${y}px` }}
          data-token={i}
        >
          {k.t}
        </text>
      ))}
    </g>
  );
};

/**
 * Bar chart of `values` = [{ label, value, color }] (value null = an empty
 * slot, for a missing number) scaled to `max` (default:
 * the largest value or the mean). `mean` draws a dashed line with its value.
 * `levelled` animates every bar to the mean height after mount (the "share
 * equally" picture of an average); the value labels then show the mean.
 */
export const BarChart = ({ x = 120, y = 40, w = 400, h = 180, values, max, mean = null, levelled = false, color = 'a', anim = '' }) => {
  const ref = useRef(null);
  const top = max || Math.max(...values.map((v) => v.value), mean || 0) || 1;
  const baseline = y + h;
  const yOf = (v) => baseline - (v / top) * h;
  const n = values.length, slot = w / n, bw = slot * 0.6;
  const bx = (i) => x + i * slot + (slot - bw) / 2;

  useEffect(() => {
    if (!levelled || mean == null || !ref.current) return undefined;
    const rects = ref.current.querySelectorAll('.la-bar');
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        rects.forEach((r) => { r.style.y = `${yOf(mean)}px`; r.style.height = `${baseline - yOf(mean)}px`; });
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  });

  return (
    <g ref={ref} className={`la-chart ${anim}`.trim()} style={{ transformOrigin: `${x + w / 2}px ${baseline}px` }}>
      <line x1={x} y1={baseline} x2={x + w} y2={baseline} className="la-fr-line" />
      {values.map((v, i) => (
        <g key={i} className={`rise d${Math.min(5, i + 1)}`} style={{ transformOrigin: `${bx(i) + bw / 2}px ${baseline}px` }}>
          {v.value != null && <rect x={bx(i)} y={yOf(v.value)} width={bw} height={baseline - yOf(v.value)} className={`la-part la-bar ${v.color || color}`} data-value={v.value} />}
          {v.value != null && <Text x={bx(i) + bw / 2} y={(levelled && mean != null ? yOf(mean) : yOf(v.value)) - 12} cls="la-bar-value">{levelled && mean != null ? mean : v.value}</Text>}
          {v.label != null && <Text x={bx(i) + bw / 2} y={baseline + 16} cls="la-tick" rtl={/[֐-׿]/.test(String(v.label))}>{v.label}</Text>}
        </g>
      ))}
      {mean != null && (
        <g className="fadein d3">
          <line x1={x - 10} y1={yOf(mean)} x2={x + w + 10} y2={yOf(mean)} className="la-mean" data-mean={mean} />
          <Text x={x + w + 14} y={yOf(mean)} cls="la-mean-label" anchor="start">{mean}</Text>
        </g>
      )}
    </g>
  );
};

/** 10 × 10 grid (one cell = 1%), the first `k` cells shaded row by row. */
export const HundredGrid = ({ x = 230, y = 40, size = 200, k = 0, color = 'a', anim = '' }) => {
  const c = size / 10;
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), col = i % 10;
    cells.push(<rect key={i} x={x + col * c} y={y + r * c} width={c} height={c} className={`la-part la-cell ${i < k ? color : 'empty'}`} />);
  }
  return <g className={`la-hundred ${anim}`.trim()} data-shaded={k} style={{ transformOrigin: `${x + size / 2}px ${y + size / 2}px` }}>{cells}</g>;
};

/**
 * Price tag centred on (x, y) showing `price` ₪ with an optional Hebrew
 * `label` underneath; `strike` crosses the price out (the old price).
 */
export const PriceTag = ({ x, y, price, label = '', strike = false, color = '', anim = '' }) => {
  const w = 120, h = 64, r = 6;
  const d = `M ${x - w / 2 + 22} ${y - h / 2} H ${x + w / 2 - r} a ${r} ${r} 0 0 1 ${r} ${r} V ${y + h / 2 - r} a ${r} ${r} 0 0 1 ${-r} ${r} H ${x - w / 2 + 22} L ${x - w / 2} ${y} Z`;
  return (
    <g className={`la-tag-group ${anim}`.trim()} style={{ transformOrigin: `${x}px ${y}px` }} data-price={price}>
      <path d={d} className={`la-tag ${color}`} />
      <circle cx={x - w / 2 + 16} cy={y} r={4} className="la-tag-hole" />
      <Text x={x + 10} y={label ? y - 8 : y} cls={`la-tag-price ${strike ? 'la-tag-old' : ''}`}>{`${price} ₪`}</Text>
      {strike && <line x1={x - 24} y1={label ? y - 8 : y} x2={x + 44} y2={label ? y - 8 : y} className="la-strike draw" />}
      {label && <Text x={x + 10} y={y + 16} cls="la-tag-sub" rtl>{label}</Text>}
    </g>
  );
};

/* ---------------- Division: counters in groups, long division ---------------- */

// A fixed shuffle (no Math.random), so a pile looks the same on every render.
const shuffled = (n) => {
  const order = Array.from({ length: n }, (_, i) => i);
  let seed = 7;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

/**
 * Where `total` counters go when they are arranged in `groups` groups of
 * `each` (default: as many full groups as fit) inside the box x, y, w, h:
 * the groups from right to left, as Hebrew is read, five counters to a line,
 * then the counters that are left over, right after the last group and
 * outside any group (their slot has room for one more group's outline).
 * One row of groups when it fits; more rows only when they draw the
 * counters at least 15% larger. `labels` leaves room for a count under each
 * group. Also gives each counter its place in a pile (a heap in the middle
 * of the box) for the gathering animation.
 * Returns { unit, r, groups, left, boxes: [{ x, y, w, h }], leftBox,
 * counters: [{ x, y, px, py, group, k }] } (group -1 = left over; k = place in it).
 */
export function groupLayout(total, each, { groups, x = 20, y = 10, w = 600, h = 200, labels = false, maxUnit = 28 } = {}) {
  const full = groups === undefined ? Math.floor(total / each) : groups;
  const left = total - full * each;
  const gap = 0.5; // between slots, in units
  const groupW = Math.min(each, 5) + 0.5;
  const widths = [...Array(full).fill(groupW), ...(left > 0 ? [Math.max(Math.min(left, 5), Math.min(each, 5)) + 0.5] : [])];
  const lines = Math.ceil(Math.max(each, left) / 5);
  const slotH = lines + 0.5 + (labels ? 0.9 : 0);
  const rowsOf = (across) => Array.from({ length: Math.ceil(widths.length / across) }, (_, r) => widths.slice(r * across, (r + 1) * across));
  const rowW = (row) => row.reduce((a, b) => a + b, 0) + gap * (row.length - 1);
  let best = null;
  for (let across = Math.min(Math.max(widths.length, 1), 6); across >= 1; across--) {
    const rows = rowsOf(across);
    const unit = Math.min(maxUnit, w / Math.max(...rows.map(rowW)), h / (rows.length * slotH + (rows.length - 1) * gap));
    if (!best || unit > best.unit * 1.15) best = { rows, unit };
  }
  const { rows, unit } = best;
  const blockW = Math.max(...rows.map(rowW)) * unit, blockH = (rows.length * slotH + (rows.length - 1) * gap) * unit;
  const right = x + (w + blockW) / 2, top = y + (h - blockH) / 2;
  const slots = [];
  rows.forEach((row, r) => {
    let cursor = right;
    row.forEach((sw) => {
      slots.push({ x: cursor - sw * unit, right: cursor, y: top + r * (slotH + gap) * unit });
      cursor -= (sw + gap) * unit;
    });
  });
  // Counters fill a slot from its right edge, line by line.
  const dot = (slot, k) => ({ x: slot.right - (0.75 + (k % 5)) * unit, y: slot.y + (0.75 + Math.floor(k / 5)) * unit });
  const boxOf = (slot) => ({ x: slot.right - groupW * unit, y: slot.y, w: groupW * unit, h: (Math.ceil(each / 5) + 0.5) * unit });
  const boxes = [], counters = [];
  for (let g = 0; g < full; g++) {
    boxes.push(boxOf(slots[g]));
    for (let k = 0; k < each; k++) counters.push({ ...dot(slots[g], k), group: g, k });
  }
  let leftBox = null;
  if (left > 0) {
    const s = slots[full];
    leftBox = { ...boxOf(s), seats: [], countX: s.right - ((Math.min(left, 5) + 0.5) * unit) / 2, countY: s.y + (Math.ceil(left / 5) + 0.95) * unit };
    for (let k = 0; k < left; k++) counters.push({ ...dot(s, k), group: -1, k });
    for (let k = left; k < each; k++) leftBox.seats.push(dot(s, k));
  }
  // The pile: a sunflower spiral in the middle, counters in a fixed shuffle.
  const cx = x + w / 2, cy = y + h / 2, r = 0.36 * unit;
  const spread = Math.min(unit * 0.62, (Math.min(w, h) / 2 - r - 2) / Math.sqrt(total));
  const order = shuffled(total);
  counters.forEach((c, i) => {
    const j = order[i], a = j * 2.39996, d = spread * Math.sqrt(j + 0.5);
    c.px = cx + d * Math.cos(a); c.py = cy + d * Math.sin(a);
  });
  return { unit, r, groups: full, left, each, boxes, leftBox, counters };
}

/**
 * Counters arranged as a division: `phase` "pile" (a heap), "gather" (they
 * move from the heap into equal groups, one group after another; each
 * outline appears when its group is full and the leftovers turn to the
 * second colour) or "grouped" (already in place). `left` styles the
 * leftovers: "b" (second colour), "dim" (dropped) or "extra" (one more
 * group: a dashed outline with empty seats). `labels` writes the count
 * under each group. With reduced motion the counters appear in place.
 */
/**
 * After mount, moves every counter inside `ref` from where its inline
 * transform puts it to its own place (a CSS transition, see .la-gather).
 */
function useSettle(ref, moving) {
  useEffect(() => {
    if (!moving || !ref.current) return undefined;
    const els = ref.current.querySelectorAll('.la-counter');
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => { els.forEach((el) => { el.style.transform = 'translate(0px, 0px)'; }); });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [ref, moving]);
}

export const Counters = ({ total, each, groups, phase = 'grouped', x = 20, y = 10, w = 600, h = 200, labels = false, left = 'b', anim = '' }) => {
  const ref = useRef(null);
  const L = groupLayout(total, each, { groups, x, y, w, h, labels });
  useSettle(ref, phase === 'gather');
  const pile = phase === 'pile', gather = phase === 'gather';
  const slotCount = L.groups + (L.left ? 1 : 0);
  const pace = Math.min(0.3, 1.8 / Math.max(1, slotCount)); // seconds between groups
  const start = (g) => (g < 0 ? L.groups : g) * pace;
  const settled = (g) => `${(start(g) + 0.75).toFixed(2)}s`;
  const leftCls = left === 'dim' ? 'dim' : 'b';
  return (
    <g ref={ref} className={`la-counters ${gather ? 'la-gather' : ''} ${anim}`.trim()} data-total={total} data-groups={L.groups} data-left={L.left}>
      {!pile && L.boxes.map((b, g) => (
        <rect key={`b${g}`} x={b.x} y={b.y} width={b.w} height={b.h} rx={L.unit * 0.3} className={`la-group-box ${gather ? 'fadein' : ''}`} style={gather ? { animationDelay: settled(g) } : undefined} data-box={g} />
      ))}
      {!pile && left === 'extra' && L.leftBox && (
        <g className={gather ? 'fadein' : ''} style={gather ? { animationDelay: settled(-1) } : undefined}>
          <rect x={L.leftBox.x} y={L.leftBox.y} width={L.leftBox.w} height={L.leftBox.h} rx={L.unit * 0.3} className="la-group-box extra" data-box="extra" />
          {L.leftBox.seats.map((s, i) => <circle key={`s${i}`} cx={s.x} cy={s.y} r={L.r} className="la-seat" />)}
        </g>
      )}
      {L.counters.map((c, i) => {
        const cls = pile ? 'a' : c.group < 0 ? (gather ? `${leftCls} la-turn` : leftCls) : 'a';
        const style = gather
          ? { transform: `translate(${(c.px - c.x).toFixed(1)}px, ${(c.py - c.y).toFixed(1)}px)`, transitionDelay: `${(start(c.group) + c.k * 0.03).toFixed(2)}s`, animationDelay: settled(c.group) }
          : undefined;
        return (
          <circle key={i} cx={pile ? c.px : c.x} cy={pile ? c.py : c.y} r={L.r} className={`la-counter ${cls}`} style={style} data-group={pile ? undefined : (c.group < 0 ? 'left' : c.group)} />
        );
      })}
      {labels && !pile && L.boxes.map((b, g) => (
        <Text key={`n${g}`} x={b.x + b.w / 2} y={b.y + b.h + 0.45 * L.unit} cls={`la-tick ${gather ? 'fadein' : ''}`} style={gather ? { animationDelay: settled(g) } : undefined}>{each}</Text>
      ))}
      {labels && !pile && L.leftBox && (
        <Text x={L.leftBox.countX} y={L.left > 0 && left === 'extra' ? L.leftBox.y + L.leftBox.h + 0.45 * L.unit : L.leftBox.countY} cls={`la-tick la-left-count ${leftCls} ${gather ? 'fadein' : ''}`} style={gather ? { animationDelay: settled(-1) } : undefined}>{L.left}</Text>
      )}
    </g>
  );
};

/**
 * `rows` rows of `cols` dots in the box x, y, w, h, as the theory's array
 * pictures (rows × columns). `phase`: "pile" (a heap), "gather" (from a heap
 * into the rows, one row after another), "turn" (every dot comes from its
 * place in the cols × rows array, so 4 rows of 3 become 3 rows of 4) or
 * "grouped" (in place). `fadeCols` dims that many last columns
 * (6 × 9 = 6 × 10 − 6); `splitRows` / `splitCols` draw the rows / columns
 * from that index on in the second colour (doubling; half of × 10).
 */
export function arrayLayout(rows, cols, { x = 20, y = 10, w = 600, h = 200, maxUnit = 30, turn = false } = {}) {
  const across = turn ? Math.max(rows, cols) : cols, down = turn ? Math.max(rows, cols) : rows;
  const unit = Math.min(maxUnit, w / across, h / down);
  const place = (R, C) => {
    const ox = x + (w - C * unit) / 2 + unit / 2, oy = y + (h - R * unit) / 2 + unit / 2;
    return (r, c) => ({ x: ox + c * unit, y: oy + r * unit });
  };
  const at = place(rows, cols), turned = place(cols, rows);
  const n = rows * cols, cx = x + w / 2, cy = y + h / 2, r = 0.36 * unit;
  const spread = Math.min(unit * 0.62, (Math.min(w, h) / 2 - r - 2) / Math.sqrt(n));
  const order = shuffled(n);
  const dots = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const k = i * cols + j, a = order[k] * 2.39996, d = spread * Math.sqrt(order[k] + 0.5);
      const from = turned(j, i);
      dots.push({ ...at(i, j), row: i, col: j, px: cx + d * Math.cos(a), py: cy + d * Math.sin(a), tx: from.x, ty: from.y });
    }
  }
  return { unit, r, dots };
}

export const DotArray = ({ rows, cols, phase = 'grouped', fadeCols = 0, splitRows = 0, splitCols = 0, x = 20, y = 10, w = 600, h = 200, anim = '' }) => {
  const ref = useRef(null);
  const moving = phase === 'gather' || phase === 'turn';
  const L = arrayLayout(rows, cols, { x, y, w, h, turn: phase === 'turn' });
  useSettle(ref, moving);
  const pace = Math.min(0.25, 1.6 / rows);
  return (
    <g ref={ref} className={`la-array ${moving ? 'la-gather' : ''} ${anim}`.trim()} data-rows={rows} data-cols={cols} data-faded={fadeCols * rows}>
      {L.dots.map((d, i) => {
        const cls = d.col >= cols - fadeCols ? 'dim' : (splitRows && d.row >= splitRows) || (splitCols && d.col >= splitCols) ? 'b' : 'a';
        const sx = phase === 'pile' ? d.px : d.x, sy = phase === 'pile' ? d.py : d.y;
        const fromX = phase === 'turn' ? d.tx : d.px, fromY = phase === 'turn' ? d.ty : d.py;
        const style = moving
          ? { transform: `translate(${(fromX - d.x).toFixed(1)}px, ${(fromY - d.y).toFixed(1)}px)`, transitionDelay: `${(phase === 'turn' ? i * 0.02 : d.row * pace + d.col * 0.03).toFixed(2)}s` }
          : undefined;
        return <circle key={i} cx={sx} cy={sy} r={L.r} className={`la-counter ${phase === 'pile' ? 'a' : cls}`} style={style} data-row={d.row} data-col={d.col} />;
      })}
    </g>
  );
};

/**
 * "a ÷ d = q" centred on (x, y), with "ושארית r" written after it in Hebrew
 * (to its left) when `r` is given. `q` null shows "?"; `r` "?" shows that a
 * remainder is still to come (never "17 ÷ 5 = 3" on its own). The quotient
 * is in the result colour, the remainder in the leftovers' colour.
 */
export const DivEq = ({ x = 320, y = 245, a, d, q = null, r = null, size = 28, anim = '', qAnim = 'pop d2', rAnim = 'fadein d4' }) => {
  const tokens = [String(a), '÷', String(d), '=', q == null ? { t: '?', cls: 'dim' } : { t: String(q), cls: 'result', anim: qAnim }];
  const ew = exprWidth(tokens, size);
  const tail = r == null ? '' : `ושארית ${r}`;
  const tw = tail ? tail.length * size * 0.5 : 0, between = tail ? size * 0.4 : 0;
  const right = x + (ew + between + tw) / 2;
  return (
    <g className={anim} data-div-eq={`${a}÷${d}=${q ?? '?'}${r == null ? '' : `r${r}`}`}>
      <Expr x={right - ew / 2} y={y} size={size} tokens={tokens} />
      {tail && <Text x={right - ew - between} y={y} anchor="start" rtl cls={`la-div-rest ${r === '?' ? 'dim' : ''} ${rAnim}`}>{tail}</Text>}
    </g>
  );
};

/**
 * The steps of a long division a ÷ d as written in school, one per digit of
 * the quotient: the same rows as the theory pictures (backend
 * seeds/math-svg.js, longDivisionSteps). A step is { col, current, qd,
 * product, rest, down, hl, rows }: the quotient digit qd goes over column
 * col; current is the number divided (shown at hl: { row, first, last }, row
 * -1 = the dividend); product is null for a 0 in the quotient (the next
 * digit comes down beside the last row); down is the digit brought down;
 * rows is the whole layout after this step.
 */
export function longDivisionSteps(a, d) {
  const digits = String(a).split('').map(Number), n = digits.length;
  const quotient = Array(n).fill('');
  const rows = [], steps = [];
  let current = 0, started = false;
  for (let i = 0; i < n; i++) {
    current = current * 10 + digits[i];
    if (!started && current < d && i < n - 1) continue;
    const last = rows[rows.length - 1];
    const hl = started
      ? { row: rows.length - 1, first: last.lastCol - last.text.length + 1, last: last.lastCol }
      : { row: -1, first: 0, last: i };
    started = true;
    const qd = Math.floor(current / d);
    quotient[i] = String(qd);
    const step = { col: i, current, qd, product: null, rest: current, down: i < n - 1 ? digits[i + 1] : null, hl };
    if (qd > 0 || i === n - 1) {
      step.product = qd * d;
      rows.push({ text: String(step.product), lastCol: i, minus: true, step: steps.length });
      current -= step.product;
      step.rest = current;
      rows.push({ text: i < n - 1 ? `${current}${digits[i + 1]}` : String(current), lastCol: i < n - 1 ? i + 1 : i, step: steps.length, down: i < n - 1 });
    } else {
      last.text += String(digits[i + 1]);
      last.lastCol = i + 1;
      last.grew = steps.length;
    }
    steps.push({ ...step, rows: rows.map((r) => ({ ...r })) });
  }
  return { quotient: Number(quotient.join('')), remainder: current, quotientDigits: quotient, steps };
}

// When each part of the newest step appears (seconds): divide, multiply,
// subtract, bring down. The notes beside the drawing use the same times.
export const LD_TIMES = [0.2, 1.1, 2.0, 2.9];

/**
 * A long division a ÷ d drawn after `upto` steps (0 = only the numbers),
 * left of the bracket the divisor, the quotient above the line. The newest
 * step appears in four beats (LD_TIMES): its quotient digit, the product
 * with a minus and a line, the difference, the digit brought down; the
 * number being divided is highlighted. The final difference (the
 * remainder) is in the leftovers' colour. `x` is the dividend's first
 * column, `y` the quotient's line; without `size` the digits are as large
 * as the stage allows for this division.
 */
export const LongDivision = ({ a, d, upto = 0, x = 200, y: top, size: wanted }) => {
  const { steps, quotientDigits } = longDivisionSteps(a, d);
  // As large as the finished layout allows on the 280-high stage (at most 36).
  const lines = steps[steps.length - 1].rows.length + 2;
  const size = wanted || Math.min(36, Math.floor(272 / (1.75 + 1.16 * (lines - 1))));
  const y = top === undefined ? size * 1.15 : top;
  const shown = Math.max(0, Math.min(upto, steps.length));
  const cw = size * 0.78, rh = size * 1.16;
  const cx = (col) => x + col * cw + cw / 2;
  const rowY = (r) => y + rh * (r + 2); // r = -1 is the dividend
  const digits = String(a).split('');
  const n = digits.length;
  const newest = shown - 1;
  const rows = shown ? steps[newest].rows : [];
  const prevRows = shown > 1 ? steps[newest - 1].rows : [];
  const beat = (i) => ({ animationDelay: `${LD_TIMES[i]}s` });
  const done = shown === steps.length;
  const els = [];
  // Highlight behind the number divided in the newest step.
  if (shown) {
    const { hl } = steps[newest];
    els.push(<rect key="hl" x={cx(hl.first) - cw / 2 - 3} y={rowY(hl.row) - size * 0.62} width={(hl.last - hl.first + 1) * cw + 6} height={size * 1.24} rx={6} className="la-hl la-ld-hl fadein" data-ld-hl={`${hl.row}:${hl.first}-${hl.last}`} />);
  }
  // Bracket, divisor, dividend.
  const barY = y + rh * 0.55;
  const bx = x - size * 0.42; // the bracket, clear of the first digit's highlight
  els.push(<path key="br" d={`M ${bx} ${rowY(-1) + size * 0.55} Q ${bx + size * 0.3} ${(barY + rowY(-1) + size * 0.55) / 2} ${bx} ${barY} L ${x + n * cw + 8} ${barY}`} className="la-ld-line" fill="none" />);
  const font = { fontSize: size };
  els.push(<Text key="dv" x={bx - size * 0.2} y={rowY(-1)} anchor="end" cls="la-ld-digit" style={font}>{d}</Text>);
  digits.forEach((c, i) => els.push(<Text key={`a${i}`} x={cx(i)} y={rowY(-1)} cls="la-ld-digit" style={font}>{c}</Text>));
  // Quotient digits.
  steps.slice(0, shown).forEach((s, k) => {
    const isNew = k === newest;
    els.push(<Text key={`q${k}`} x={cx(s.col)} y={y} cls={`la-ld-digit la-ld-q ${isNew ? 'pop' : ''}`} style={{ ...font, ...(isNew ? beat(0) : {}) }}>{quotientDigits[s.col]}</Text>);
  });
  // Rows under the dividend.
  rows.forEach((row, r) => {
    const first = row.lastCol - row.text.length + 1;
    const isNew = row.step === newest;
    const isLast = done && r === rows.length - 1;
    const grewBy = row.grew === newest && prevRows[r] ? row.text.length - prevRows[r].text.length : 0;
    row.text.split('').forEach((c, j) => {
      let cls = 'la-ld-digit', style;
      if (isLast) cls += ' la-ld-rest';
      if (isNew && row.minus) { cls += ' rise'; style = beat(1); }
      else if (isNew && row.down && j === row.text.length - 1) { cls += ' la-ld-down rise'; style = beat(3); }
      else if (isNew) { cls += ' fadein'; style = beat(2); }
      else if (j >= row.text.length - grewBy) { cls += ' la-ld-down rise'; style = beat(3); }
      els.push(<Text key={`r${r}-${j}`} x={cx(first + j)} y={rowY(r)} cls={cls} style={{ fontSize: size, ...style }}>{c}</Text>);
    });
    if (row.minus) {
      els.push(<Text key={`m${r}`} x={cx(first) - cw * 0.85} y={rowY(r)} cls={`la-ld-digit ${isNew ? 'rise' : ''}`} style={{ ...font, ...(isNew ? beat(1) : {}) }}>−</Text>);
      els.push(<line key={`l${r}`} x1={cx(first) - cw * 1.2} y1={rowY(r) + size * 0.62} x2={cx(row.lastCol) + cw * 0.5} y2={rowY(r) + size * 0.62} className={`la-ld-line ${isNew ? 'fadein' : ''}`} style={isNew ? beat(2) : undefined} />);
    }
  });
  return (
    <g className="la-ld" direction="ltr" data-ld={`${a}÷${d}`} data-ld-q={steps.slice(0, shown).map((s) => quotientDigits[s.col]).join('')} data-ld-rows={rows.map((r) => r.text).join(',')}>
      {els}
    </g>
  );
};
