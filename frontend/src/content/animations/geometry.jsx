import React, { useEffect, useRef } from 'react';
import { Text } from './primitives';

/**
 * Stage primitives for Math chapters 7–9 (negative numbers, the axes,
 * triangles), drawn on the same 640×280 stage as primitives.jsx and with
 * the same colours. Movement is CSS only (LessonAnimation.css): `la-trace`
 * draws a line or an arc from its start (hops, walks), `la-move` slides a
 * piece from where it was drawn to its place (torn corners, rods). Things
 * that come one after another carry an inline animation delay and the class
 * `la-seq`, which reduced motion shows at once.
 */

export const MINUS = '−';
/** An integer with a real minus sign: "−3". */
export const signed = (v) => (v < 0 ? `${MINUS}${-v}` : String(v));

const seq = (s) => ({ animationDelay: `${s.toFixed(2)}s` });
const f = (v) => Number(v.toFixed(1));

/**
 * After mount, moves every `.la-move` inside `ref` from its inline start
 * transform to its `data-to` transform (a CSS transition).
 */
function useMove(ref, on) {
  useEffect(() => {
    if (!on || !ref.current) return undefined;
    const els = ref.current.querySelectorAll('.la-move');
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => { els.forEach((el) => { el.style.transform = el.getAttribute('data-to'); }); });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [ref, on]);
}

// ---------------------------------------------------------------- number line

/** x of a value on a line from `from` to `to` drawn from x over w. */
export const lineX = (from, to, x, w) => (v) => x + ((v - from) / (to - from)) * w;

/** Seconds between hops: all of them drawn within about 2.4 s. */
export const hopPace = (n) => Math.min(0.7, 2.4 / Math.max(1, n));

/**
 * Whole numbers from `from` to `to`, each ticked and numbered (every second
 * one when they would touch), 0 in bold.
 * - points: [{ value, label, color: 'a' | 'b', at }] dots, label above; `at`
 *   (seconds) makes a dot appear later (the end of the hops).
 * - hops: [{ from, to, label, color }] arcs above the line, traced one after
 *   another; `flat` keeps them on one level, else each one higher.
 * - brace: { from, to, label } a bracket under the numbers (a distance).
 */
export const HopLine = ({ from, to, x = 40, y = 175, w = 560, points = [], hops = [], flat = false, brace = null, anim = '' }) => {
  const X = lineX(from, to, x, w);
  const unit = w / (to - from);
  const every = unit < 26 ? 2 : 1;
  const pace = hopPace(hops.length);
  const ticks = [];
  for (let v = from; v <= to; v++) {
    const zero = v === 0;
    ticks.push(<line key={`t${v}`} x1={X(v)} y1={y - (zero ? 12 : 7)} x2={X(v)} y2={y + (zero ? 12 : 7)} className="la-fr-line" />);
    if ((v - from) % every === 0 || zero) ticks.push(<Text key={`n${v}`} x={X(v)} y={y + 28} cls={`la-tick ${zero ? 'la-zero' : ''}`}>{signed(v)}</Text>);
  }
  return (
    <g className={`la-hopline ${anim}`.trim()} data-from={from} data-to={to}>
      <line x1={x - 10} y1={y} x2={x + w + 10} y2={y} className="la-fr-line" />
      {ticks}
      {hops.map((h, i) => {
        const x1 = X(h.from), x2 = X(h.to), lift = Math.min(70, 26 + (flat ? 0 : i) * 30), mid = (x1 + x2) / 2;
        const dir = x2 > x1 ? 1 : -1, c = h.color || 'a';
        return (
          <g key={`h${i}`} data-hop={`${h.from}:${h.to}`}>
            <path d={`M ${f(x1)} ${y - 5} Q ${f(mid)} ${y - 5 - 2 * lift} ${f(x2)} ${y - 5}`} pathLength="1" className={`la-hop ${c} la-trace la-seq`} style={seq(i * pace)} data-end={f(x2)} />
            <path d={`M ${f(x2)} ${y - 5} l ${-dir * 9} -6 l 0 10 z`} className={`la-hop-head ${c} fadein la-seq`} style={seq(i * pace + pace * 0.8)} />
            {h.label && <Text x={mid} y={y - 14 - lift} cls={`la-hop-label ${c} fadein la-seq`} style={seq(i * pace + pace * 0.5)}>{h.label}</Text>}
          </g>
        );
      })}
      {points.map((p, i) => {
        const c = p.color || (i === 0 ? 'a' : 'b');
        return (
          <g key={`p${i}`} className={`pop la-seq`} style={{ ...seq(p.at ?? 0.15 * i), transformOrigin: `${X(p.value)}px ${y}px` }} data-point={p.value}>
            <circle cx={X(p.value)} cy={y} r={7} className={`la-point ${c}`} />
            {p.label && <Text x={X(p.value)} y={y - 22} cls={`la-point-label ${c}`}>{p.label}</Text>}
          </g>
        );
      })}
      {brace && (
        <g className="fadein la-seq" style={seq(brace.at ?? 0.3)} data-brace={`${brace.from}:${brace.to}`}>
          <path d={`M ${X(brace.from)} ${y + 40} v 8 H ${X(brace.to)} v -8`} className="la-brace" />
          <Text x={(X(brace.from) + X(brace.to)) / 2} y={y + 64} cls="la-hop-label b">{brace.label}</Text>
        </g>
      )}
    </g>
  );
};

/** When the last of `n` hops has been drawn (for the point at its end). */
export const afterHops = (n) => (n - 1) * hopPace(n) + hopPace(n) * 0.9;

// ---------------------------------------------------------- coordinate plane

/**
 * A coordinate plane, x to the right and y up, `unit` px per number, the
 * origin at (ox, oy) on the stage. Grid lines, both axes numbered.
 * - points: [{ x, y, label, color, at }] dots with their names;
 * - walk: { x, y, label, color } from the origin along x, then along y,
 *   then the point appears (how a point is read and placed);
 * - moves: [{ from: [x, y], to: [x, y], color }] an arrow from point to point;
 * - segments: [{ from, to, label, dashed, color, at }] straight lines;
 * - quarters: [{ q: 1..4, text, at }] a quarter shaded with its name.
 */
export const CoordPlane = ({ xMin = -5, xMax = 5, yMin = -4, yMax = 4, ox = 320, oy = 140, unit = 25, points = [], walk = null, moves = [], segments = [], quarters = [], anim = '' }) => {
  const X = (v) => ox + v * unit, Y = (v) => oy - v * unit;
  const grid = [];
  for (let v = xMin; v <= xMax; v++) grid.push(<line key={`gx${v}`} x1={X(v)} y1={Y(yMax)} x2={X(v)} y2={Y(yMin)} className="la-grid-line" />);
  for (let v = yMin; v <= yMax; v++) grid.push(<line key={`gy${v}`} x1={X(xMin)} y1={Y(v)} x2={X(xMax)} y2={Y(v)} className="la-grid-line" />);
  const nums = [];
  for (let v = xMin; v <= xMax; v++) if (v) nums.push(<Text key={`nx${v}`} x={X(v)} y={oy + 13} cls="la-axis-num">{signed(v)}</Text>);
  for (let v = yMin; v <= yMax; v++) if (v) nums.push(<Text key={`ny${v}`} x={ox - 6} y={Y(v)} anchor="end" cls="la-axis-num">{signed(v)}</Text>);
  const QX = { 1: [0, xMax], 2: [xMin, 0], 3: [xMin, 0], 4: [0, xMax] }, QY = { 1: [yMax, 0], 2: [yMax, 0], 3: [0, yMin], 4: [0, yMin] };
  const walkAt = 0.2;
  return (
    <g className={`la-plane ${anim}`.trim()}>
      {quarters.map((q) => (
        <g key={`q${q.q}`} className="fadein la-seq" style={seq(q.at ?? 0)} data-quarter={q.q}>
          <rect x={X(QX[q.q][0])} y={Y(QY[q.q][0])} width={(QX[q.q][1] - QX[q.q][0]) * unit} height={(QY[q.q][0] - QY[q.q][1]) * unit} className={`la-quarter q${q.q}`} />
          {q.text && <Text x={X((QX[q.q][0] + QX[q.q][1]) / 2)} y={Y((QY[q.q][0] + QY[q.q][1]) / 2)} cls="la-quarter-text" rtl>{q.text}</Text>}
        </g>
      ))}
      {grid}
      <line x1={X(xMin) - 8} y1={oy} x2={X(xMax) + 14} y2={oy} className="la-axis" />
      <path d={`M ${X(xMax) + 20} ${oy} l -10 -5 l 0 10 z`} className="la-axis-head" />
      <line x1={ox} y1={Y(yMin) + 8} x2={ox} y2={Y(yMax) - 14} className="la-axis" />
      <path d={`M ${ox} ${Y(yMax) - 20} l -5 10 l 10 0 z`} className="la-axis-head" />
      <Text x={X(xMax) + 18} y={oy - 14} cls="la-axis-name">x</Text>
      <Text x={ox + 14} y={Y(yMax) - 16} cls="la-axis-name">y</Text>
      {nums}
      <Text x={ox - 6} y={oy + 13} anchor="end" cls="la-axis-num la-zero">0</Text>
      {segments.map((s, i) => (
        <g key={`s${i}`} data-segment={`${s.from}|${s.to}`}>
          <line x1={X(s.from[0])} y1={Y(s.from[1])} x2={X(s.to[0])} y2={Y(s.to[1])} pathLength="1" className={`la-seg ${s.color || 'a'} ${s.dashed ? 'dashed' : 'la-trace'} la-seq`} style={seq(s.at ?? 0.2)} />
          {s.label && <Text x={X((s.from[0] + s.to[0]) / 2) + (s.from[0] === s.to[0] ? 16 : 0)} y={Y((s.from[1] + s.to[1]) / 2) - (s.from[1] === s.to[1] ? 14 : 0)} cls={`la-hop-label ${s.color || 'a'} fadein la-seq`} style={seq((s.at ?? 0.2) + 0.6)}>{s.label}</Text>}
        </g>
      ))}
      {walk && (
        <g data-walk={`${walk.x},${walk.y}`}>
          {walk.x !== 0 && <line x1={ox} y1={oy} x2={X(walk.x)} y2={oy} pathLength="1" className="la-walk x la-trace la-seq" style={seq(walkAt)} />}
          {walk.y !== 0 && <line x1={X(walk.x)} y1={oy} x2={X(walk.x)} y2={Y(walk.y)} pathLength="1" className="la-walk y la-trace la-seq" style={seq(walkAt + 0.9)} />}
          {walk.x !== 0 && <Text x={X(walk.x / 2)} y={oy + (walk.y < 0 ? -12 : 28)} cls="la-hop-label a fadein la-seq" style={seq(walkAt + 0.4)}>{`${Math.abs(walk.x)} ${walk.x > 0 ? '→' : '←'}`}</Text>}
          {walk.y !== 0 && <Text x={X(walk.x) + (walk.x < 0 ? -22 : 22)} y={Y(walk.y / 2)} cls="la-hop-label b fadein la-seq" style={seq(walkAt + 1.3)}>{`${Math.abs(walk.y)} ${walk.y > 0 ? '↑' : '↓'}`}</Text>}
        </g>
      )}
      {moves.map((m, i) => {
        const [x1, y1] = [X(m.from[0]), Y(m.from[1])], [x2, y2] = [X(m.to[0]), Y(m.to[1])];
        const a = Math.atan2(y2 - y1, x2 - x1), tip = [x2 - 8 * Math.cos(a), y2 - 8 * Math.sin(a)];
        const side = (d) => `${f(tip[0] - 11 * Math.cos(a) + d * 6 * Math.sin(a))} ${f(tip[1] - 11 * Math.sin(a) - d * 6 * Math.cos(a))}`;
        return (
          <g key={`m${i}`} data-move={`${m.from}|${m.to}`}>
            <line x1={x1} y1={y1} x2={f(tip[0])} y2={f(tip[1])} pathLength="1" className={`la-seg ${m.color || 'b'} la-trace la-seq`} style={seq(m.at ?? 0.3)} />
            <path d={`M ${f(tip[0])} ${f(tip[1])} L ${side(1)} L ${side(-1)} z`} className={`la-hop-head ${m.color || 'b'} fadein la-seq`} style={seq((m.at ?? 0.3) + 0.6)} />
          </g>
        );
      })}
      {[...points, ...(walk ? [{ ...walk, at: walkAt + (walk.y ? 1.8 : 0.9) }] : [])].map((p, i) => {
        const c = p.color || 'a', px = X(p.x), py = Y(p.y);
        const right = p.x < xMax - 0.5, up = p.y > yMin + 0.5 && p.y !== -1;
        return (
          <g key={`p${i}`} className="pop la-seq" style={{ ...seq(p.at ?? 0.15 * i), transformOrigin: `${px}px ${py}px` }} data-point={`${p.x},${p.y}`}>
            <circle cx={px} cy={py} r={7} className={`la-point ${c}`} />
            {p.label && <Text x={px + (right ? 12 : -12)} y={py + (up ? -14 : 16)} anchor={right ? 'start' : 'end'} cls={`la-point-label ${c}`}>{p.label}</Text>}
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ triangle

const rad = (d) => (d * Math.PI) / 180;

/**
 * Stage corners of a triangle with angles a at A and b at B, AB horizontal
 * and `base` px long from (x, y), C above it; a triangle taller than
 * `maxHeight` gets a shorter base (same angles), so it stays on the stage.
 */
export function triangleFromAngles(a, b, { x = 200, y = 230, base = 240, maxHeight = Infinity } = {}) {
  const c = 180 - a - b;
  const height = (base * Math.sin(rad(a)) * Math.sin(rad(b))) / Math.sin(rad(c));
  const k = Math.min(1, maxHeight / height);
  const ac = (base * k * Math.sin(rad(b))) / Math.sin(rad(c));
  return [[x, y], [x + base * k, y], [x + ac * Math.cos(rad(a)), y - ac * Math.sin(rad(a))]];
}

/** Stage corners of a triangle with sides AB, BC, CA in units of `unit` px. */
export function triangleFromSides(ab, bc, ca, { x = 200, y = 230, unit = 30 } = {}) {
  const px = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  return [[x, y], [x + ab * unit, y], [x + px * unit, y - Math.sqrt(Math.max(0, ca * ca - px * px)) * unit]];
}

/** The angle at corner v between the directions to p and q, in degrees. */
export const angleAt = (v, p, q) => {
  const u = [p[0] - v[0], p[1] - v[1]], w = [q[0] - v[0], q[1] - v[1]];
  return (Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) * 180) / Math.PI;
};

/** Direction from p to q in degrees on the stage (y down). */
const dirDeg = (p, q) => (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;

/** A wedge (sector) of radius r from angle s, sweeping by `sweep` degrees, around (0, 0). */
const wedge = (s, sweep, r) => {
  const p1 = [r * Math.cos(rad(s)), r * Math.sin(rad(s))], p2 = [r * Math.cos(rad(s + sweep)), r * Math.sin(rad(s + sweep))];
  return `M 0 0 L ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${f(p2[0])} ${f(p2[1])} Z`;
};

/**
 * The corner wedges of a triangle: for each corner its start direction (so
 * the wedge sweeps clockwise on the stage, inside the triangle) and its
 * angle; `torn` gives each one the rotation and place that lays the three
 * side by side above a straight line at `line` = [x, y], from the left:
 * together they fill 180°.
 */
export function cornerWedges(V, line = [320, 250]) {
  let start = 180;
  return V.map((v, i) => {
    const p = V[(i + 1) % 3], q = V[(i + 2) % 3];
    const angle = angleAt(v, p, q);
    let s = dirDeg(v, p);
    // Sweep clockwise (positive on the stage) from s to the other side.
    if (Math.abs((((s + angle - dirDeg(v, q)) % 360) + 540) % 360 - 180) > 0.5) s = dirDeg(v, q);
    const target = start;
    start += angle;
    return { corner: v, start: s, angle, rotate: target - s, target, at: line };
  });
}

const TONES = ['a', 'b', 'sum'];

/**
 * A triangle with corners V (stage points), names beside the corners.
 * - angleLabels: ['50°', '?', ''] an arc and its label (a square for 90°);
 * - ticks: [1, 1, 0] equal-side marks on AB, BC, CA; sideLabels likewise;
 * - height: true a dashed height from C to AB (AB extended if needed), heightLabel;
 * - box: true the rectangle around it (dashed), halves: true shades the
 *   parts of the box outside the triangle, which are as big as the inside;
 * - corners: 'whole' coloured corner wedges in place, 'torn' they slide onto
 *   a straight line at `line` and fill 180° there.
 */
export const TriangleShape = ({ V, names = ['A', 'B', 'C'], angleLabels = [], ticks = [], sideLabels = [], height = false, heightLabel = '', box = false, halves = false, corners = null, line = [320, 255], fill = true, anim = '' }) => {
  const ref = useRef(null);
  useMove(ref, corners === 'torn');
  const [A, B, C] = V;
  const cx = (A[0] + B[0] + C[0]) / 3, cy = (A[1] + B[1] + C[1]) / 3;
  const unit = (p, q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; };
  const foot = [C[0], A[1]];
  const xs = [A[0], B[0], C[0]];
  const parts = [];
  if (box) {
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    parts.push(<rect key="box" x={x0} y={C[1]} width={x1 - x0} height={A[1] - C[1]} className="la-box" />);
    if (halves) {
      // The box minus the triangle: right triangles beside the height.
      const pieces = [];
      if (C[0] > x0 + 0.5) pieces.push(`M ${x0} ${A[1]} L ${x0} ${C[1]} L ${C[0]} ${C[1]} Z`);
      if (C[0] < x1 - 0.5) pieces.push(`M ${x1} ${A[1]} L ${x1} ${C[1]} L ${C[0]} ${C[1]} Z`);
      pieces.forEach((d, i) => parts.push(<path key={`half${i}`} d={d} className="la-half fadein la-seq" style={seq(0.4 + 0.4 * i)} data-half={i} />));
    }
  }
  parts.push(<path key="tri" d={`M ${f(A[0])} ${f(A[1])} L ${f(B[0])} ${f(B[1])} L ${f(C[0])} ${f(C[1])} Z`} className={`la-tri ${fill ? '' : 'empty'}`} data-tri={V.map((p) => p.map(f).join(',')).join(' ')} />);
  if (height) {
    const [x0, x1] = [Math.min(A[0], B[0]), Math.max(A[0], B[0])];
    if (foot[0] < x0 - 0.5 || foot[0] > x1 + 0.5) parts.push(<line key="ext" x1={foot[0] < x0 ? x0 : x1} y1={A[1]} x2={foot[0]} y2={A[1]} className="la-dashed thin" />);
    parts.push(<line key="h" x1={C[0]} y1={C[1]} x2={foot[0]} y2={foot[1]} className="la-height fadein la-seq" style={seq(0.3)} data-height={f(A[1] - C[1])} />);
    const s = foot[0] >= cx ? -1 : 1;
    parts.push(<path key="hsq" d={`M ${foot[0] + s * 10} ${foot[1]} v -10 h ${-s * 10}`} className="la-height-sq fadein la-seq" style={seq(0.9)} />);
    if (heightLabel) parts.push(<Text key="hl" x={foot[0] - s * 8} y={(C[1] + foot[1]) / 2} anchor={s > 0 ? 'end' : 'start'} cls="la-hop-label a fadein la-seq" style={seq(0.9)}>{heightLabel}</Text>);
  }
  [[0, 1], [1, 2], [2, 0]].forEach(([i, j], n) => {
    const p = V[i], q = V[j], mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const [ux, uy] = unit(p, q);
    let [nx, ny] = [-uy, ux];
    if ((mid[0] - cx) * nx + (mid[1] - cy) * ny < 0) { nx = -nx; ny = -ny; }
    for (let t = 0; t < (ticks[n] || 0); t++) {
      const o = (t - ((ticks[n] || 0) - 1) / 2) * 6, c = [mid[0] + ux * o, mid[1] + uy * o];
      parts.push(<line key={`tk${n}${t}`} x1={c[0] - nx * 7} y1={c[1] - ny * 7} x2={c[0] + nx * 7} y2={c[1] + ny * 7} className="la-tick-mark pop" style={{ transformOrigin: `${c[0]}px ${c[1]}px` }} />);
    }
    if (sideLabels[n]) parts.push(<Text key={`sl${n}`} x={mid[0] + nx * 18} y={mid[1] + ny * 18} cls="la-side-label">{sideLabels[n]}</Text>);
  });
  V.forEach((v, i) => {
    const u1 = unit(v, V[(i + 1) % 3]), u2 = unit(v, V[(i + 2) % 3]);
    const bx = u1[0] + u2[0], by = u1[1] + u2[1], bl = Math.hypot(bx, by);
    const bis = [bx / bl, by / bl];
    const angle = angleAt(v, V[(i + 1) % 3], V[(i + 2) % 3]);
    if (angleLabels[i]) {
      if (Math.abs(angle - 90) < 0.5) {
        parts.push(<path key={`sq${i}`} d={`M ${f(v[0] + u1[0] * 14)} ${f(v[1] + u1[1] * 14)} L ${f(v[0] + (u1[0] + u2[0]) * 14)} ${f(v[1] + (u1[1] + u2[1]) * 14)} L ${f(v[0] + u2[0] * 14)} ${f(v[1] + u2[1] * 14)}`} className="la-angle-mark" data-right={names[i]} />);
      } else {
        const r = 24, p1 = [v[0] + u1[0] * r, v[1] + u1[1] * r], p2 = [v[0] + u2[0] * r, v[1] + u2[1] * r];
        const sweep = u1[0] * u2[1] - u1[1] * u2[0] > 0 ? 1 : 0;
        parts.push(<path key={`arc${i}`} d={`M ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 ${sweep} ${f(p2[0])} ${f(p2[1])}`} className="la-angle-mark" />);
      }
      if (!(angleLabels[i] === '90°' && Math.abs(angle - 90) < 0.5)) {
        const d = angle < 40 ? 50 : 40;
        parts.push(
          <g key={`al${i}`} className="pop" style={{ transformOrigin: `${v[0] + bis[0] * d}px ${v[1] + bis[1] * d}px` }} data-angle={`${names[i]}:${angleLabels[i]}:${f(angle)}`}>
            <Text x={v[0] + bis[0] * d} y={v[1] + bis[1] * d} cls="la-angle-label">{angleLabels[i]}</Text>
          </g>
        );
      }
    }
    if (names[i]) parts.push(<Text key={`nm${i}`} x={v[0] - bis[0] * 16} y={v[1] - bis[1] * 16} cls="la-vertex">{names[i]}</Text>);
  });
  if (corners) {
    const W = cornerWedges(V, line);
    const torn = corners === 'torn';
    if (torn) {
      parts.push(<line key="base180" x1={line[0] - 80} y1={line[1]} x2={line[0] + 80} y2={line[1]} className="la-fr-line fadein la-seq" style={seq(0.2)} />);
      parts.push(<Text key="l180" x={line[0]} y={line[1] - 72} cls="la-hop-label sum fadein la-seq" style={seq(1.9)}>180°</Text>);
    }
    W.forEach((w, i) => {
      const from = `translate(${f(w.corner[0])}px, ${f(w.corner[1])}px) rotate(0deg)`;
      const to = `translate(${f(line[0])}px, ${f(line[1])}px) rotate(${f(w.rotate)}deg)`;
      parts.push(
        <path key={`w${i}`} d={wedge(w.start, w.angle, 30)} className={`la-wedge ${TONES[i]} ${torn ? 'la-move' : 'fadein'}`}
          style={{ transform: from, transitionDelay: torn ? `${0.3 + i * 0.4}s` : undefined }} data-to={to}
          data-wedge={`${f(w.angle)}:${f(w.target)}`} />
      );
    });
  }
  return <g ref={ref} className={`la-triangle ${anim}`.trim()}>{parts}</g>;
};

/**
 * Three lengths, or not, as a triangle: the base AB of `base` units, a rod
 * of `left` units at A and one of `right` units at B, both starting leaning
 * outwards and turning down. When left + right is more than the base they meet at C;
 * otherwise they end flat on the base and the gap between them shows.
 */
export const Rods = ({ base, left, right, x = 140, y = 220, unit = 45, labels = true }) => {
  const ref = useRef(null);
  useMove(ref, true);
  const A = [x, y], B = [x + base * unit, y];
  const meet = left + right > base;
  // Final turn of each rod from upright: the triangle's angle at A and B, or flat.
  let a = 0, b = 0;
  if (meet) {
    const px = (base * base + left * left - right * right) / (2 * base);
    a = (Math.acos(px / left) * 180) / Math.PI;
    b = (Math.acos((base - px) / right) * 180) / Math.PI;
  }
  const rod = (len, at, sign, turn, cls, key) => (
    <line key={key} x1={0} y1={0} x2={0} y2={-len * unit} className={`la-rod ${cls} la-move`}
      style={{ transform: `translate(${at[0]}px, ${at[1]}px) rotate(${-sign * 30}deg)`, transitionDelay: '0.3s' }}
      data-to={`translate(${at[0]}px, ${at[1]}px) rotate(${f(sign * (90 - turn))}deg)`} data-rod={len} />
  );
  return (
    <g ref={ref} className="la-rods" data-meet={meet ? 'yes' : 'no'}>
      <line x1={A[0]} y1={y} x2={B[0]} y2={y} className="la-rod base" />
      {rod(left, A, 1, a, 'a', 'l')}
      {rod(right, B, -1, b, 'b', 'r')}
      {labels && <Text x={(A[0] + B[0]) / 2} y={y + 24} cls="la-side-label">{base}</Text>}
      {!meet && left + right < base && (
        <g className="fadein la-seq" style={seq(1.6)}>
          <line x1={x + left * unit} y1={y - 12} x2={x + left * unit} y2={y + 6} className="la-gap" />
          <line x1={B[0] - right * unit} y1={y - 12} x2={B[0] - right * unit} y2={y + 6} className="la-gap" />
        </g>
      )}
    </g>
  );
};

/**
 * Math in a caption or a note, kept left to right on one line. The player's
 * isolateMath starts a run at a digit, so "−2 > −5" (a leading minus, a
 * comparison) needs its own isolate.
 */
export const iso = (s) => `⁦${String(s).replace(/ /g, ' ')}⁩`;

/** Stage corners of a triangle with base AB of `base` units and C at apex [x, y] units. */
export const triangleFromBase = (base, [ax, ay], { x = 200, y = 230, unit = 30 } = {}) => [[x, y], [x + base * unit, y], [x + ax * unit, y - ay * unit]];
