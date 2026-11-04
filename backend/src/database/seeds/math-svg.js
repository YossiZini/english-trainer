// Inline SVG pictures for the Math teaching documents (theory HTML).
// Pure functions returning SVG strings; no files, no runtime dependencies.
// Colours are fixed: the theory page is light-themed.

const SHADE = '#667eea';      // shaded part of a whole
const SHADE_2 = '#f5a623';    // second colour (comparisons, products)
const OVERLAP = '#b3421e';    // both colours at once (multiplication grid)
const LINE = '#2b2f3a';
const LIGHT = '#ffffff';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function svg(width, height, body, label, viewBox = `0 0 ${width} ${height}`, extraClass = '') {
  return `<svg class="math-pic${extraClass ? ` ${extraClass}` : ''}" direction="ltr" style="direction:ltr" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}">${body}</svg>`;
}

/** A circle cut into `den` equal slices, the first `num` shaded. */
function circle(num, den, { size = 96, color = SHADE } = {}) {
  const r = 46, c = 50;
  const slices = [];
  for (let i = 0; i < den; i++) {
    const a0 = (2 * Math.PI * i) / den - Math.PI / 2;
    const a1 = (2 * Math.PI * (i + 1)) / den - Math.PI / 2;
    const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0);
    const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
    const large = den === 1 ? 1 : 0;
    const d = den === 1
      ? `M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c - 0.01} ${c - r} Z`
      : `M ${c} ${c} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
    slices.push(`<path d="${d}" fill="${i < num ? color : LIGHT}" stroke="${LINE}" stroke-width="1.5" stroke-linejoin="round"/>`);
  }
  return svg(size, size, slices.join(''), `${num} מתוך ${den} חלקים צבועים`, '0 0 100 100');
}

/** A bar cut into `den` equal cells, the first `num` shaded. */
function bar(num, den, { width = 240, height = 36, color = SHADE } = {}) {
  const cell = width / den;
  const cells = [];
  for (let i = 0; i < den; i++) {
    cells.push(`<rect x="${(i * cell).toFixed(2)}" y="1" width="${cell.toFixed(2)}" height="${height - 2}" fill="${i < num ? color : LIGHT}" stroke="${LINE}" stroke-width="1.5"/>`);
  }
  return svg(width, height, cells.join(''), `${num} מתוך ${den} חלקים צבועים`, `-1 0 ${width + 2} ${height}`);
}

/**
 * A number line from `from` to `to` with `den` ticks per whole, and points
 * marked on it: [{ value: 3/4 (number), label: '3/4' }].
 */
function numberLine({ from = 0, to = 1, den = 4, points = [] } = {}) {
  const width = 280, pad = 16, y = 26;
  const span = width - 2 * pad;
  const x = (v) => pad + ((v - from) / (to - from)) * span;
  const parts = [`<line x1="${pad}" y1="${y}" x2="${width - pad}" y2="${y}" stroke="${LINE}" stroke-width="2"/>`];
  for (let w = from; w <= to; w++) {
    for (let k = 0; k < den; k++) {
      const v = w + k / den;
      if (v > to) break;
      const whole = k === 0;
      parts.push(`<line x1="${x(v).toFixed(1)}" y1="${y - (whole ? 9 : 5)}" x2="${x(v).toFixed(1)}" y2="${y + (whole ? 9 : 5)}" stroke="${LINE}" stroke-width="${whole ? 2 : 1}"/>`);
      if (whole) parts.push(`<text x="${x(v).toFixed(1)}" y="${y + 24}" font-size="12" text-anchor="middle" fill="${LINE}">${v}</text>`);
    }
  }
  points.forEach((p, i) => {
    const color = i === 0 ? SHADE : SHADE_2;
    parts.push(`<circle cx="${x(p.value).toFixed(1)}" cy="${y}" r="5" fill="${color}" stroke="${LIGHT}" stroke-width="1.5"/>`);
    parts.push(`<text x="${x(p.value).toFixed(1)}" y="${y - 13}" font-size="12" text-anchor="middle" fill="${color}" font-weight="700">${esc(p.label)}</text>`);
  });
  return svg(width, 56, parts.join(''), `ישר מספרים מ-${from} עד ${to}`);
}

/** An integer with a real minus sign (U+2212): "−3", "0", "5". */
const signed = (v) => (v < 0 ? `\u2212${-v}` : String(v));

/**
 * A number line of whole numbers from `from` to `to` (negatives allowed),
 * every number (every second one on a long line) labelled with a real minus
 * sign, 0 in bold. `points` mark
 * numbers ([{ value, label, color: 'a' | 'b' }], label above the line);
 * `hops` draw arrows above the line from one number to another
 * ([{ from, to, label }]), each a level higher than the one before, as when
 * adding on the line; `flat` keeps them on one level (equal hops in a row,
 * 4 × (−3) as four hops of −3); `labelEvery` labels only the multiples of a
 * number (the ends of equal hops: 0, −3, −6…), larger when they are far
 * apart. A separate function from numberLine, whose pictures (fractions, 0
 * and up) stay as they are.
 */
function integerLine({ from = -6, to = 6, points = [], hops = [], flat = false, labelEvery = 0 } = {}) {
  // 28px per number, between 200 and 320 wide: a short line is drawn narrower,
  // so a phone shrinks it less and its labels stay readable.
  const pad = 16, width = Math.max(200, Math.min(320, (to - from) * 28 + 2 * pad));
  const span = width - 2 * pad;
  const x = (v) => pad + ((v - from) / (to - from)) * span;
  const levels = flat ? Math.min(hops.length, 1) : hops.length;
  const lift = (i) => 12 + (flat ? 0 : i) * 22;
  // Hop labels sit 10 higher when points are labelled too, so a short hop's
  // label does not cover the labels of its two ends.
  const raise = levels && points.some((p) => p.label) ? 10 : 0;
  // Room above the line: up to the highest hop label, or the point labels.
  const above = levels ? lift(levels - 1) + 18 + raise : points.some((p) => p.label) ? 24 : 12;
  const y = above + 4;
  // Every number labelled, or every second one when they would touch; with
  // labelEvery only its multiples, at 14px when they are 36px apart or more.
  const unit = span / (to - from);
  const step = labelEvery || (unit < 24 ? 2 : 1);
  const font = labelEvery && labelEvery * unit >= 36 ? 14 : 12;
  const height = y + 16 + font;
  const labelled = (v) => (labelEvery ? v % labelEvery === 0 : (v - from) % step === 0 || v === 0);
  const parts = [`<line x1="${pad - 6}" y1="${y}" x2="${width - pad + 6}" y2="${y}" stroke="${LINE}" stroke-width="2"/>`];
  for (let v = from; v <= to; v++) {
    const zero = v === 0;
    parts.push(`<line x1="${x(v).toFixed(1)}" y1="${y - (zero ? 10 : 6)}" x2="${x(v).toFixed(1)}" y2="${y + (zero ? 10 : 6)}" stroke="${LINE}" stroke-width="${zero ? 2.5 : 1.5}"/>`);
    if (labelled(v)) {
      parts.push(`<text x="${x(v).toFixed(1)}" y="${y + 10 + font}" font-size="${font}" text-anchor="middle" fill="${LINE}"${zero ? ' font-weight="700"' : ''}>${signed(v)}</text>`);
    }
  }
  hops.forEach((h, i) => {
    const x1 = x(h.from), x2 = x(h.to), mid = (x1 + x2) / 2;
    const color = flat || i === 0 ? SHADE : SHADE_2;
    const dir = x2 > x1 ? 1 : -1;
    parts.push(`<path d="M ${x1.toFixed(1)} ${y - 4} Q ${mid.toFixed(1)} ${y - 4 - 2 * lift(i)} ${x2.toFixed(1)} ${y - 4}" fill="none" stroke="${color}" stroke-width="2"/>`);
    parts.push(`<path d="M ${x2.toFixed(1)} ${y - 4} l ${(-dir * 7).toFixed(1)} -5 l 0 8 z" fill="${color}"/>`);
    if (h.label) parts.push(`<text x="${mid.toFixed(1)}" y="${(y - 6 - lift(i) - raise).toFixed(1)}" font-size="12" text-anchor="middle" fill="${color}" font-weight="700" direction="ltr">${esc(h.label)}</text>`);
  });
  points.forEach((p, i) => {
    const color = p.color === 'b' || (p.color === undefined && i > 0) ? SHADE_2 : SHADE;
    parts.push(`<circle cx="${x(p.value).toFixed(1)}" cy="${y}" r="5.5" fill="${color}" stroke="${LIGHT}" stroke-width="1.5"/>`);
    if (p.label) parts.push(`<text x="${x(p.value).toFixed(1)}" y="${y - 12}" font-size="12" text-anchor="middle" fill="${color}" font-weight="700" direction="ltr">${esc(p.label)}</text>`);
  });
  return svg(width, height, parts.join(''), `ישר המספרים בין ${signed(from)} ל-${signed(to)}`, `0 0 ${width} ${height}`);
}

/**
 * A coordinate grid: x to the right and y up, from xMin to xMax and yMin to
 * yMax (0 inside both), grid lines every 1, both axes numbered with a real
 * minus sign, "x" and "y" at the arrow ends, 0 at the origin.
 * - points: [{ x, y, label, color: 'a' | 'b', guide, at }] a dot with its
 *   label beside it (`at`: 'ne' (default), 'nw', 'se', 'sw'); `guide` draws
 *   dashed lines from the dot to both axes (how the point is read).
 * - lines: [{ from: [x, y], to: [x, y], arrow, label, labelAt, dashed }] a
 *   segment, with an arrowhead at `to` when `arrow`, its label at the middle
 *   (or at `labelAt`: [x, y], away from the axes' numbers).
 * - texts: [{ x, y, text }] a word at a place (the quarters' names).
 * Each number is 22px apart; a picture for a question stays at most 9 units
 * high, so a phone shows it whole with the options under it. `scale` draws
 * it smaller (under an explanation); the class math-grid keeps the feedback
 * box from squeezing it further (ExerciseFeedback.css).
 */
function coordGrid({ xMin = -4, xMax = 4, yMin = -4, yMax = 4, points = [], lines = [], texts = [], scale = 1 } = {}) {
  const unit = 22, pad = 22;
  const width = (xMax - xMin) * unit + 2 * pad, height = (yMax - yMin) * unit + 2 * pad;
  const X = (x) => pad + (x - xMin) * unit, Y = (y) => pad + (yMax - y) * unit;
  const f = (v) => v.toFixed(1);
  const parts = [];
  for (let x = xMin; x <= xMax; x++) parts.push(`<line x1="${f(X(x))}" y1="${f(Y(yMax))}" x2="${f(X(x))}" y2="${f(Y(yMin))}" stroke="#d6d9e0" stroke-width="1"/>`);
  for (let y = yMin; y <= yMax; y++) parts.push(`<line x1="${f(X(xMin))}" y1="${f(Y(y))}" x2="${f(X(xMax))}" y2="${f(Y(y))}" stroke="#d6d9e0" stroke-width="1"/>`);
  // The axes, a little longer than the grid, with arrowheads and their names.
  const ox = X(0), oy = Y(0);
  parts.push(`<line x1="${f(X(xMin) - 8)}" y1="${f(oy)}" x2="${f(X(xMax) + 12)}" y2="${f(oy)}" stroke="${LINE}" stroke-width="2"/>`);
  parts.push(`<path d="M ${f(X(xMax) + 16)} ${f(oy)} l -9 -4.5 l 0 9 z" fill="${LINE}"/>`);
  parts.push(`<line x1="${f(ox)}" y1="${f(Y(yMin) + 8)}" x2="${f(ox)}" y2="${f(Y(yMax) - 12)}" stroke="${LINE}" stroke-width="2"/>`);
  parts.push(`<path d="M ${f(ox)} ${f(Y(yMax) - 16)} l -4.5 9 l 9 0 z" fill="${LINE}"/>`);
  parts.push(`<text x="${f(X(xMax) + 12)}" y="${f(oy - 8)}" font-size="13" font-style="italic" font-weight="700" text-anchor="middle" fill="${LINE}">x</text>`);
  parts.push(`<text x="${f(ox + 11)}" y="${f(Y(yMax) - 8)}" font-size="13" font-style="italic" font-weight="700" text-anchor="middle" fill="${LINE}">y</text>`);
  // Numbers: under the x axis, left of the y axis; 0 once, below-left of the origin.
  for (let x = xMin; x <= xMax; x++) {
    if (x === 0) continue;
    parts.push(`<line x1="${f(X(x))}" y1="${f(oy - 3)}" x2="${f(X(x))}" y2="${f(oy + 3)}" stroke="${LINE}" stroke-width="1.5"/>`);
    parts.push(`<text x="${f(X(x))}" y="${f(oy + 14)}" font-size="11" text-anchor="middle" fill="${LINE}">${signed(x)}</text>`);
  }
  for (let y = yMin; y <= yMax; y++) {
    if (y === 0) continue;
    parts.push(`<line x1="${f(ox - 3)}" y1="${f(Y(y))}" x2="${f(ox + 3)}" y2="${f(Y(y))}" stroke="${LINE}" stroke-width="1.5"/>`);
    parts.push(`<text x="${f(ox - 5)}" y="${f(Y(y) + 4)}" font-size="11" text-anchor="end" fill="${LINE}">${signed(y)}</text>`);
  }
  parts.push(`<text x="${f(ox - 5)}" y="${f(oy + 14)}" font-size="11" text-anchor="end" fill="${LINE}" font-weight="700">0</text>`);
  for (const t of texts) {
    parts.push(`<text x="${f(X(t.x))}" y="${f(Y(t.y) + 4)}" font-size="12" text-anchor="middle" fill="#8a8fa0" font-weight="700">${esc(t.text)}</text>`);
  }
  for (const l of lines) {
    const [x1, y1] = l.from, [x2, y2] = l.to;
    const color = l.color === 'b' ? SHADE_2 : SHADE;
    parts.push(`<line x1="${f(X(x1))}" y1="${f(Y(y1))}" x2="${f(X(x2))}" y2="${f(Y(y2))}" stroke="${color}" stroke-width="2.5"${l.dashed ? ' stroke-dasharray="5 4"' : ''}/>`);
    if (l.arrow) {
      const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1));
      const tip = [X(x2) - 6 * Math.cos(a), Y(y2) - 6 * Math.sin(a)];
      const side = (d) => [tip[0] - 10 * Math.cos(a) + d * 5 * Math.sin(a), tip[1] - 10 * Math.sin(a) - d * 5 * Math.cos(a)];
      const [l1, l2] = [side(1), side(-1)];
      parts.push(`<path d="M ${f(tip[0])} ${f(tip[1])} L ${f(l1[0])} ${f(l1[1])} L ${f(l2[0])} ${f(l2[1])} z" fill="${color}"/>`);
    }
    if (l.label) {
      const horizontal = y1 === y2;
      const [lx, ly] = l.labelAt ? [X(l.labelAt[0]), Y(l.labelAt[1])] : [(X(x1) + X(x2)) / 2, (Y(y1) + Y(y2)) / 2];
      const mx = lx + (horizontal ? 0 : 9), my = ly + (horizontal ? -6 : 4);
      parts.push(`<text x="${f(mx)}" y="${f(my)}" font-size="12" text-anchor="${horizontal ? 'middle' : 'start'}" fill="${color}" font-weight="700" direction="ltr">${esc(l.label)}</text>`);
    }
  }
  const OFFSET = { ne: [7, -7, 'start'], nw: [-7, -7, 'end'], se: [7, 15, 'start'], sw: [-7, 15, 'end'] };
  for (const p of points) {
    const color = p.color === 'b' ? SHADE_2 : SHADE;
    const px = X(p.x), py = Y(p.y);
    if (p.guide) {
      parts.push(`<line x1="${f(px)}" y1="${f(py)}" x2="${f(px)}" y2="${f(oy)}" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 3"/>`);
      parts.push(`<line x1="${f(px)}" y1="${f(py)}" x2="${f(ox)}" y2="${f(py)}" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 3"/>`);
    }
    parts.push(`<circle cx="${f(px)}" cy="${f(py)}" r="5" fill="${color}" stroke="${LIGHT}" stroke-width="1.5"/>`);
    if (p.label) {
      // A label stays clear of the axes' numbers: just under the x axis it
      // goes below the point, beside the y axis it goes away from the numbers.
      let at = p.at || 'ne';
      if (p.y === -1) at = at.replace('n', 's');
      if (p.y === 0) at = at.replace('s', 'n');
      if (p.x === -1) at = at.replace('e', 'w');
      if (p.x === 0) at = at.replace('w', 'e');
      // A label never leaves the picture: at the grid's edge it turns inward.
      if (p.x === xMax) at = at.replace('e', 'w');
      if (p.x === xMin) at = at.replace('w', 'e');
      if (p.y === yMax) at = at.replace('n', 's');
      if (p.y === yMin) at = at.replace('s', 'n');
      const [dx, dy, anchor] = OFFSET[at];
      parts.push(`<text x="${f(px + dx)}" y="${f(py + dy)}" font-size="13" text-anchor="${anchor}" fill="${color}" font-weight="700" direction="ltr">${esc(p.label)}</text>`);
    }
  }
  return svg(Math.round(width * scale), Math.round(height * scale), parts.join(''),
    `מערכת צירים: x מ-${signed(xMin)} עד ${signed(xMax)}, y מ-${signed(yMin)} עד ${signed(yMax)}`, `0 0 ${width} ${height}`, 'math-grid');
}

/**
 * A triangle ABC drawn to shape, from one of:
 * - angles: [A, B] in degrees (C is the rest of 180°), the base AB horizontal;
 * - sides: [AB, BC, CA];
 * - base, apex: A(0, 0), B(base, 0) and C at apex [x, y], in the same units
 *   (y is the height to AB; x outside 0…base for a height outside).
 * Options (each list in the order A, B, C or AB, BC, CA):
 * - names: the vertices' letters, outside each corner;
 * - angleLabels: ['50°', '?', ''] an arc and its label at a corner ('' none);
 *   a right angle gets a small square instead of the arc;
 * - sideLabels: ['8', '', ''] a length beside a side;
 * - ticks: [1, 1, 0] equal-side marks;
 * - height: true draws the height from C to AB (dashed, with its right
 *   angle; AB extended when it falls outside), heightLabel beside it;
 * - box: true draws the rectangle the triangle is half of (dashed).
 * Fits in about 240 × 170; `scale` draws it smaller.
 */
function triangle({ angles = null, sides = null, base = null, apex = [0, 1], names = ['A', 'B', 'C'], angleLabels = [], sideLabels = [], ticks = [], height = false, heightLabel = '', box = false, scale = 1 } = {}) {
  const rad = (d) => (d * Math.PI) / 180;
  let P;
  if (angles) {
    const [a, b] = angles.map(rad), c = Math.PI - a - b;
    const ac = Math.sin(b) / Math.sin(c); // AB = 1
    P = [[0, 0], [1, 0], [ac * Math.cos(a), ac * Math.sin(a)]];
  } else if (sides) {
    const [ab, bc, ca] = sides;
    const x = (ab * ab + ca * ca - bc * bc) / (2 * ab);
    P = [[0, 0], [ab, 0], [x, Math.sqrt(Math.max(0, ca * ca - x * x))]];
  } else {
    P = [[0, 0], [base, 0], apex];
  }
  // Fit: units to pixels, y up.
  const foot = [P[2][0], 0];
  const xs = [...P.map((p) => p[0]), height ? foot[0] : 0], ys = P.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), maxY = Math.max(...ys);
  const k = Math.min(240 / (maxX - minX), 150 / maxY);
  const pad = 30;
  const W = (maxX - minX) * k + 2 * pad, H = maxY * k + 2 * pad;
  const X = (p) => [pad + (p[0] - minX) * k, pad + (maxY - p[1]) * k];
  const V = P.map(X);
  const f = (v) => v.toFixed(1);
  const parts = [];
  const centroid = [(V[0][0] + V[1][0] + V[2][0]) / 3, (V[0][1] + V[1][1] + V[2][1]) / 3];
  const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
  if (box) {
    const [x0, x1] = [Math.min(V[0][0], V[1][0], V[2][0]), Math.max(V[0][0], V[1][0], V[2][0])];
    const [y0, y1] = [Math.min(V[0][1], V[2][1]), Math.max(V[0][1], V[2][1])];
    parts.push(`<rect x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" fill="none" stroke="${SHADE_2}" stroke-width="1.5" stroke-dasharray="5 4"/>`);
  }
  parts.push(`<path d="M ${f(V[0][0])} ${f(V[0][1])} L ${f(V[1][0])} ${f(V[1][1])} L ${f(V[2][0])} ${f(V[2][1])} Z" fill="#eef0fd" stroke="${LINE}" stroke-width="2" stroke-linejoin="round"/>`);
  if (height) {
    const F = X(foot);
    const [x0, x1] = [Math.min(V[0][0], V[1][0]), Math.max(V[0][0], V[1][0])];
    if (F[0] < x0 - 0.5 || F[0] > x1 + 0.5) {
      const near = F[0] < x0 ? x0 : x1;
      parts.push(`<line x1="${f(near)}" y1="${f(F[1])}" x2="${f(F[0])}" y2="${f(F[1])}" stroke="${LINE}" stroke-width="1.5" stroke-dasharray="4 3"/>`);
    }
    parts.push(`<line x1="${f(V[2][0])}" y1="${f(V[2][1])}" x2="${f(F[0])}" y2="${f(F[1])}" stroke="${SHADE}" stroke-width="2" stroke-dasharray="6 4"/>`);
    const s = 9, side = F[0] >= centroid[0] ? -1 : 1;
    parts.push(`<path d="M ${f(F[0] + side * s)} ${f(F[1])} L ${f(F[0] + side * s)} ${f(F[1] - s)} L ${f(F[0])} ${f(F[1] - s)}" fill="none" stroke="${SHADE}" stroke-width="1.5"/>`);
    if (heightLabel) parts.push(`<text x="${f(F[0] - side * 6)}" y="${f((V[2][1] + F[1]) / 2 + 4)}" font-size="13" text-anchor="${side > 0 ? 'end' : 'start'}" fill="${SHADE}" font-weight="700" direction="ltr">${esc(heightLabel)}</text>`);
  }
  // Sides AB, BC, CA: equal-side ticks and lengths.
  [[0, 1], [1, 2], [2, 0]].forEach(([i, j], n) => {
    const a = V[i], b = V[j], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const [ux, uy] = unit(a, b);
    let nx = -uy, ny = ux;
    if ((mid[0] - centroid[0]) * nx + (mid[1] - centroid[1]) * ny < 0) { nx = -nx; ny = -ny; }
    for (let t = 0; t < (ticks[n] || 0); t++) {
      const o = (t - ((ticks[n] || 0) - 1) / 2) * 5;
      const c = [mid[0] + ux * o, mid[1] + uy * o];
      parts.push(`<line x1="${f(c[0] - nx * 6)}" y1="${f(c[1] - ny * 6)}" x2="${f(c[0] + nx * 6)}" y2="${f(c[1] + ny * 6)}" stroke="${LINE}" stroke-width="2"/>`);
    }
    if (sideLabels[n]) {
      parts.push(`<text x="${f(mid[0] + nx * 15)}" y="${f(mid[1] + ny * 15 + 4.5)}" font-size="13" text-anchor="middle" fill="${LINE}" font-weight="700" direction="ltr">${esc(sideLabels[n])}</text>`);
    }
  });
  // Corners: angle marks and the vertices' names.
  V.forEach((v, i) => {
    const u1 = unit(v, V[(i + 1) % 3]), u2 = unit(v, V[(i + 2) % 3]);
    const bis = unit([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]);
    const angle = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) * 180 / Math.PI;
    if (angleLabels[i]) {
      const right = Math.abs(angle - 90) < 0.5;
      if (right) {
        const s = 11;
        parts.push(`<path d="M ${f(v[0] + u1[0] * s)} ${f(v[1] + u1[1] * s)} L ${f(v[0] + (u1[0] + u2[0]) * s)} ${f(v[1] + (u1[1] + u2[1]) * s)} L ${f(v[0] + u2[0] * s)} ${f(v[1] + u2[1] * s)}" fill="none" stroke="${SHADE_2}" stroke-width="1.8"/>`);
      } else {
        const r = 20;
        const p1 = [v[0] + u1[0] * r, v[1] + u1[1] * r], p2 = [v[0] + u2[0] * r, v[1] + u2[1] * r];
        const sweep = u1[0] * u2[1] - u1[1] * u2[0] > 0 ? 1 : 0;
        parts.push(`<path d="M ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 ${sweep} ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="${SHADE_2}" stroke-width="2"/>`);
      }
      if (angleLabels[i] !== '90°' || !right) {
        const d = angle < 40 ? 44 : 34;
        parts.push(`<text x="${f(v[0] + bis[0] * d)}" y="${f(v[1] + bis[1] * d + 4.5)}" font-size="12" text-anchor="middle" fill="#c27c0e" font-weight="700" direction="ltr">${esc(angleLabels[i])}</text>`);
      }
    }
    if (names[i]) {
      parts.push(`<text x="${f(v[0] - bis[0] * 14)}" y="${f(v[1] - bis[1] * 14 + 5)}" font-size="14" text-anchor="middle" fill="${LINE}" font-weight="700" font-style="italic" direction="ltr">${esc(names[i])}</text>`);
    }
  });
  return svg(Math.round(W * scale), Math.round(H * scale), parts.join(''), `משולש ${names.join('')}`, `0 0 ${f(W)} ${f(H)}`, 'math-grid');
}

/**
 * Area model for a product of fractions: a square cut into `rows` × `cols`
 * cells; the first `shadeRows` rows and `shadeCols` columns are coloured, the
 * overlap darker. Shows (shadeRows/rows) × (shadeCols/cols).
 */
function grid(rows, cols, shadeRows, shadeCols, { size = 120 } = {}) {
  const w = size / cols, h = size / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const inRow = r < shadeRows, inCol = c < shadeCols;
      const fill = inRow && inCol ? OVERLAP : inRow ? SHADE : inCol ? SHADE_2 : LIGHT;
      cells.push(`<rect x="${(c * w).toFixed(2)}" y="${(r * h).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="${fill}" fill-opacity="${inRow && inCol ? 0.9 : 0.55}" stroke="${LINE}" stroke-width="1.2"/>`);
    }
  }
  return svg(size, size, cells.join(''), `${shadeRows} מתוך ${rows} שורות ו-${shadeCols} מתוך ${cols} עמודות`, `-1 -1 ${size + 2} ${size + 2}`);
}

/**
 * An array of dots: `rows` rows of `cols` (a product rows × cols). Options:
 * the last `fadeCols` columns faded (taken away, as in ×9 = ×10 − ×1), and
 * the rows from `split` on in the second colour (a product cut in two).
 */
function array(rows, cols, { fadeCols = 0, split = 0 } = {}) {
  const gap = 20, r = 7;
  const dots = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const faded = j >= cols - fadeCols;
      const fill = faded ? LIGHT : split && i >= split ? SHADE_2 : SHADE;
      dots.push(`<circle cx="${gap / 2 + j * gap}" cy="${gap / 2 + i * gap}" r="${r}" fill="${fill}" stroke="${faded ? '#999' : LINE}" stroke-width="1.2"${faded ? ' stroke-dasharray="2 2"' : ''}/>`);
    }
  }
  return svg(cols * gap, rows * gap, dots.join(''), `${rows} שורות של ${cols} נקודות`, `-1 -1 ${cols * gap + 2} ${rows * gap + 2}`);
}

/**
 * `count` equal groups (rounded boxes) with `each` dots in every one, five
 * dots to a line and `across` (five) groups to a row: count × each, or a sharing.
 * `leftover` dots that make no full group stand after the groups, outside
 * any box, in the second colour (a division with a remainder). Then the
 * groups are laid out from the right, the way a Hebrew reader counts them,
 * so the leftovers come last, on the left; without leftovers the order
 * does not show and the picture stays as it was.
 */
function groups(count, each, { leftover = 0, across = 5 } = {}) {
  const dot = 14, pad = 6, between = 10;
  const lineDots = Math.min(Math.max(each, leftover), 5), lines = Math.ceil(Math.max(each, leftover, 1) / 5);
  const w = lineDots * dot + 2 * pad, h = lines * dot + 2 * pad;
  const slots = count + (leftover > 0 ? 1 : 0);
  const perRow = Math.min(slots, across), rowsOfGroups = Math.ceil(slots / across);
  const parts = [];
  const col = (g) => (leftover > 0 ? perRow - 1 - (g % across) : g % across);
  const place = (g) => [col(g) * (w + between), Math.floor(g / across) * (h + between)];
  for (let g = 0; g < count; g++) {
    const [x, y] = place(g);
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f4f5ff" stroke="${LINE}" stroke-width="1.2"/>`);
    for (let k = 0; k < each; k++) {
      const cx = x + pad + dot / 2 + (k % 5) * dot, cy = y + pad + dot / 2 + Math.floor(k / 5) * dot;
      parts.push(`<circle cx="${cx}" cy="${cy}" r="5" fill="${SHADE}" stroke="${LINE}" stroke-width="1"/>`);
    }
  }
  if (leftover > 0) {
    const [x, y] = place(count);
    for (let k = 0; k < leftover; k++) {
      const cx = x + pad + dot / 2 + (k % 5) * dot, cy = y + pad + dot / 2 + Math.floor(k / 5) * dot;
      parts.push(`<circle cx="${cx}" cy="${cy}" r="5" fill="${SHADE_2}" stroke="${LINE}" stroke-width="1"/>`);
    }
  }
  const width = perRow * w + (perRow - 1) * between, height = rowsOfGroups * h + (rowsOfGroups - 1) * between;
  const label = `${count} קבוצות של ${each}${leftover ? `, ונשארו ${leftover}` : ''}`;
  return svg(width, height, parts.join(''), label, `-1 -1 ${width + 2} ${height + 2}`);
}

/**
 * The steps of a long division, as written in school: the quotient above
 * the dividend, the divisor at the side of the bracket, and under the
 * dividend each product (with a minus and a line) followed by what is left
 * with the next digit brought down. A zero in the quotient brings the next
 * digit down without a product. Returns { quotient, remainder, rows } for
 * checks; longDivision() draws it.
 */
function longDivisionSteps(dividend, divisor) {
  const digits = String(dividend).split('').map(Number);
  const n = digits.length;
  const quotient = Array(n).fill('');
  const rows = []; // { text, lastCol, minus }
  let current = 0, started = false;
  for (let i = 0; i < n; i++) {
    current = current * 10 + digits[i];
    if (!started && current < divisor && i < n - 1) continue;
    started = true;
    const qd = Math.floor(current / divisor);
    quotient[i] = String(qd);
    if (qd > 0 || i === n - 1) {
      const product = qd * divisor;
      rows.push({ text: String(product), lastCol: i, minus: true });
      current -= product;
      rows.push({ text: i < n - 1 ? `${current}${digits[i + 1]}` : String(current), lastCol: i < n - 1 ? i + 1 : i });
    } else {
      // A zero in the quotient: the line above takes the next digit as well.
      const last = rows[rows.length - 1];
      last.text += String(digits[i + 1]);
      last.lastCol = i + 1;
    }
  }
  return { quotient: Number(quotient.join('')), remainder: current, quotientDigits: quotient, rows };
}

function longDivision(dividend, divisor, { scale = 1 } = {}) {
  const cw = 12, rh = 24, left = 48, top = 24;
  const { quotientDigits, rows } = longDivisionSteps(dividend, divisor);
  const digits = String(dividend).split('');
  const n = digits.length;
  const x = (col) => left + col * cw + cw / 2;
  const t = (cx, cy, s, fill = LINE, weight = 'normal') =>
    `<text x="${cx}" y="${cy}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="${weight}" fill="${fill}">${s}</text>`;
  const parts = [];
  quotientDigits.forEach((d, i) => { if (d !== '') parts.push(t(x(i), top, d, SHADE, 'bold')); });
  const barY = top + 7;
  parts.push(`<path d="M ${left - 6} ${barY + rh} Q ${left + 2} ${barY + rh / 2} ${left - 6} ${barY} L ${left + n * cw + 6} ${barY}" fill="none" stroke="${LINE}" stroke-width="1.6"/>`);
  parts.push(`<text x="${left - 12}" y="${top + rh}" text-anchor="end" font-family="Arial, sans-serif" font-size="18" fill="${LINE}">${divisor}</text>`);
  digits.forEach((d, i) => parts.push(t(x(i), top + rh, d)));
  rows.forEach((row, r) => {
    const y = top + rh * (r + 2);
    const first = row.lastCol - row.text.length + 1;
    row.text.split('').forEach((d, k) => parts.push(t(x(first + k), y, d, r === rows.length - 1 ? SHADE_2 : LINE, r === rows.length - 1 ? 'bold' : 'normal')));
    if (row.minus) {
      parts.push(t(x(first) - 12, y, '−'));
      parts.push(`<line x1="${x(first) - 17}" y1="${y + 6}" x2="${x(row.lastCol) + 8}" y2="${y + 6}" stroke="${LINE}" stroke-width="1.4"/>`);
    }
  });
  const width = left + n * cw + 12, height = top + rh * (rows.length + 1) + 10;
  // Shown at its own size (class math-long): squeezed to a width or to the
  // phone's picture height, the digits would be too small to read.
  return svg(Math.round(width * scale), Math.round(height * scale), parts.join(''),
    `חילוק ארוך: ${dividend} ÷ ${divisor}`, `0 0 ${width} ${height}`, 'math-long');
}

/**
 * A balance scale for an equation with one unknown: a beam on a post, a pan
 * at each end. Each pan holds a list of items, laid out in rows:
 *   'x' or { box: 'x' }  a box hiding the unknown (label 'x', or '?' in 10.1)
 *   5 or { weight: 5 }   a weight with its number
 *   { units: 4 }         four unit cubes of 1 each
 *   { bag: [items] }     a bag holding items: one copy of (x + 3) in 2(x + 3)
 * Any item may be `crossed: true` (faded and struck: taken off both pans).
 * `groups: { left: 3, right: 3 }` rings a pan's pieces in that many equal
 * groups (3x = 12 → each box against 4 cubes). `tilt` is 'left' or 'right'
 * (that pan is heavier and lower) or null (level). Every pan, item and group
 * carries data-* attributes, so the chapter's check reads the picture back.
 */
function balance({ left = [], right = [], tilt = null, groups = {}, scale = 1 } = {}) {
  const f = (v) => v.toFixed(1);
  const BOX = 26, UNIT = 12, GAP = 4, PAN_W = 140, ROW_W = 132, BOX_FILL = '#e8e4fb', WEIGHT_FILL = '#fde9c8', CROSS = '#d0342c';
  const norm = (it) => (typeof it === 'number' ? { weight: it } : it === 'x' ? { box: 'x' } : it);

  // An item as drawable pieces: each { w, h, draw(x, y), data }.
  function pieces(item) {
    const it = norm(item);
    const crossed = !!it.crossed;
    const mark = (x, y, w, h) => (crossed
      ? `<line x1="${f(x - 2)}" y1="${f(y + h + 2)}" x2="${f(x + w + 2)}" y2="${f(y - 2)}" stroke="${CROSS}" stroke-width="2.5" stroke-linecap="round"/>` : '');
    const fade = crossed ? ' opacity="0.4"' : '';
    if (it.box !== undefined) {
      return [{ w: BOX, h: BOX, data: `data-item="box" data-label="${esc(it.box)}"${crossed ? ' data-crossed="1"' : ''}`,
        draw: (x, y) => `<g${fade}><rect x="${f(x)}" y="${f(y)}" width="${BOX}" height="${BOX}" rx="4" fill="${BOX_FILL}" stroke="${SHADE}" stroke-width="2"/>`
          + `<text x="${f(x + BOX / 2)}" y="${f(y + BOX / 2 + 5.5)}" font-size="16" font-style="italic" font-weight="700" text-anchor="middle" fill="${SHADE}">${esc(it.box)}</text></g>${mark(x, y, BOX, BOX)}` }];
    }
    if (it.weight !== undefined) {
      const w = Math.max(28, 12 + 9 * String(it.weight).length), h = 24;
      return [{ w, h, data: `data-item="weight" data-value="${it.weight}"${crossed ? ' data-crossed="1"' : ''}`,
        draw: (x, y) => `<g${fade}><path d="M ${f(x + 4)} ${f(y)} L ${f(x + w - 4)} ${f(y)} L ${f(x + w)} ${f(y + h)} L ${f(x)} ${f(y + h)} Z" fill="${WEIGHT_FILL}" stroke="${LINE}" stroke-width="1.5" stroke-linejoin="round"/>`
          + `<text x="${f(x + w / 2)}" y="${f(y + h / 2 + 5)}" font-size="14" font-weight="700" text-anchor="middle" fill="${LINE}">${it.weight}</text></g>${mark(x, y, w, h)}` }];
    }
    if (it.units !== undefined) {
      return Array.from({ length: it.units }, () => ({ w: UNIT, h: UNIT, data: `data-item="unit"${crossed ? ' data-crossed="1"' : ''}`,
        draw: (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${UNIT}" height="${UNIT}" rx="1.5" fill="${SHADE_2}" fill-opacity="0.75" stroke="${LINE}" stroke-width="1"${fade}/>${mark(x, y, UNIT, UNIT)}` }));
    }
    if (it.bag) {
      const inner = it.bag.flatMap(pieces);
      const w = inner.reduce((s, p) => s + p.w, 0) + GAP * (inner.length - 1) + 12;
      const h = Math.max(...inner.map((p) => p.h)) + 12;
      return [{ w, h, data: `data-item="bag"${crossed ? ' data-crossed="1"' : ''}`,
        draw: (x, y) => {
          let cx = x + 6;
          const kids = inner.map((p) => { const s = `<g ${p.data}>${p.draw(cx, y + h - 6 - p.h)}</g>`; cx += p.w + GAP; return s; });
          return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="9" fill="#f3f4f8" stroke="${LINE}" stroke-width="1.5" stroke-dasharray="4 3"/>${kids.join('')}${mark(x, y, w, h)}`;
        } }];
    }
    throw new Error(`balance: unknown item ${JSON.stringify(item)}`);
  }

  // Rows of pieces, bottom up, each row centred; returns { w, h, place(cx, baseY) }.
  function stack(ps, maxW = ROW_W) {
    const rows = [[]];
    let width = 0;
    for (const p of ps) {
      const row = rows[rows.length - 1];
      const next = width + (row.length ? GAP : 0) + p.w;
      if (row.length && next > maxW) { rows.push([p]); width = p.w; } else { row.push(p); width = next; }
    }
    const rowW = rows.map((r) => r.reduce((s, p) => s + p.w, 0) + GAP * (r.length - 1));
    const rowH = rows.map((r) => Math.max(0, ...r.map((p) => p.h)));
    return {
      w: Math.max(0, ...rowW),
      h: rowH.reduce((s, h) => s + h, 0) + GAP * (rows.length - 1),
      place(cx, baseY) {
        let y = baseY;
        return rows.map((r, i) => {
          let x = cx - rowW[i] / 2;
          const out = r.map((p) => { const s = `<g ${p.data}>${p.draw(x, y - p.h)}</g>`; x += p.w + GAP; return s; }).join('');
          y -= rowH[i] + GAP;
          return out;
        }).join('');
      }
    };
  }

  // A pan's content: its pieces, in equal ringed groups when asked.
  function content(items, n) {
    const ps = items.flatMap(pieces);
    if (!n) return stack(ps);
    if (ps.length % n) throw new Error(`balance: ${ps.length} pieces do not split into ${n} equal groups`);
    const size = ps.length / n;
    const per = Math.min(ROW_W, Math.max(...ps.map((p) => p.w)) * Math.ceil(Math.sqrt(size)) + GAP * 2);
    const gs = Array.from({ length: n }, (_, i) => stack(ps.slice(i * size, (i + 1) * size), per));
    const PAD = 4;
    const w = gs.reduce((s, g) => s + g.w + 2 * PAD, 0) + 6 * (n - 1);
    const h = Math.max(...gs.map((g) => g.h)) + 2 * PAD;
    return {
      w, h,
      place(cx, baseY) {
        let x = cx - w / 2;
        return gs.map((g, i) => {
          const gx = x;
          x += g.w + 2 * PAD + 6;
          return `<g data-group="${i + 1}"><rect x="${f(gx)}" y="${f(baseY - h)}" width="${f(g.w + 2 * PAD)}" height="${f(h)}" rx="6" fill="none" stroke="${SHADE}" stroke-width="1.5" stroke-dasharray="4 3"/>${g.place(gx + PAD + g.w / 2, baseY - PAD)}</g>`;
        }).join('');
      }
    };
  }

  const L = content(left, groups.left), R = content(right, groups.right);
  // A beam on a post; each end carries a tray on a short stem, so a tall pile
  // never crosses a string. The width follows the wider tray or pile.
  const panW = Math.max(PAN_W, L.w + 12, R.w + 12);
  const reach = 118, STEM = 14, cos7 = Math.cos((7 * Math.PI) / 180), sin7 = Math.sin((7 * Math.PI) / 180);
  const W = Math.round(2 * (reach * cos7 + panW / 2 + 6)), cx = W / 2;
  const t = tilt === 'left' ? 1 : tilt === 'right' ? -1 : 0;
  const drop = t * reach * sin7;
  const pile = Math.max(L.h, R.h, BOX);
  const pivot = 8 + pile + 4 + STEM + Math.abs(drop) + 4;
  const ends = [[cx - reach * cos7, pivot + drop], [cx + reach * cos7, pivot - drop]];
  const baseY = pivot + 46;
  const H = baseY + 6;
  const pan = ([ex, ey], c, side) => {
    const ty = ey - STEM;
    return `<g data-pan="${side}"><line x1="${f(ex)}" y1="${f(ey)}" x2="${f(ex)}" y2="${f(ty)}" stroke="${LINE}" stroke-width="3"/>`
      + `<path d="M ${f(ex - panW / 2)} ${f(ty - 3)} L ${f(ex + panW / 2)} ${f(ty - 3)} L ${f(ex + panW / 2 - 8)} ${f(ty + 3)} L ${f(ex - panW / 2 + 8)} ${f(ty + 3)} Z" fill="#dfe3ea" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>`
      + `${c.place(ex, ty - 4)}</g>`;
  };
  const parts = [
    `<path d="M ${f(cx - 34)} ${f(baseY)} L ${f(cx + 34)} ${f(baseY)} L ${f(cx + 20)} ${f(baseY - 9)} L ${f(cx - 20)} ${f(baseY - 9)} Z" fill="${LINE}"/>`,
    `<line x1="${f(cx)}" y1="${f(pivot)}" x2="${f(cx)}" y2="${f(baseY - 9)}" stroke="${LINE}" stroke-width="5" stroke-linecap="round"/>`,
    `<line x1="${f(ends[0][0])}" y1="${f(ends[0][1])}" x2="${f(ends[1][0])}" y2="${f(ends[1][1])}" stroke="${LINE}" stroke-width="5" stroke-linecap="round"/>`,
    `<path d="M ${f(cx)} ${f(pivot - 2)} L ${f(cx - 8)} ${f(pivot + 12)} L ${f(cx + 8)} ${f(pivot + 12)} Z" fill="${SHADE}"/>`,
    pan(ends[0], L, 'left'),
    pan(ends[1], R, 'right')
  ];
  const label = `מאזניים ${t ? 'נוטים' : 'מאוזנים'}`;
  return svg(Math.round(W * scale), Math.round(H * scale), `<g data-balance="1" data-tilt="${tilt || 'level'}">${parts.join('')}</g>`, label, `0 0 ${W} ${f(H)}`, 'math-grid');
}

// ---------------------------------------------------------------------------
// Decimals (chapter 4). Each picture carries data-* attributes, so the
// chapter's check reads back what is drawn.

/** A decimal as a whole number of 10^-places units: units('0.45', 2) = 45; more places than that are refused. */
function units(s, places) {
  const m = String(s).match(/^(\d+)(?:\.(\d+))?$/);
  if (!m || (m[2] || '').length > places) throw new Error(`decimals: ${s} is not a decimal with at most ${places} places`);
  return Number(m[1]) * 10 ** places + Number((m[2] || '').padEnd(places, '0') || 0);
}
/** Back to text, without trailing zeros: text(45, 2) = '0.45', text(40, 2) = '0.4'. */
function unitsText(u, places) {
  const whole = Math.floor(u / 10 ** places);
  const frac = String(u % 10 ** places).padStart(places, '0').replace(/0+$/, '');
  return places && frac ? `${whole}.${frac}` : String(whole);
}

/**
 * A square of 100 cells (10 columns of 10) for hundredths, or of 10 columns
 * for tenths (`parts: 10`). The first `count` cells are shaded column by
 * column from the left, so each full column is a tenth; `extra` more cells
 * follow in the second colour (adding). The square carries data-parts,
 * data-shaded and data-extra, and every cell data-cell ("a", "b" or "0").
 */
function hundredGrid(count, { parts = 100, extra = 0, size = 120 } = {}) {
  if (parts !== 10 && parts !== 100) throw new Error(`hundredGrid: parts must be 10 or 100, not ${parts}`);
  if (![count, extra].every((v) => Number.isInteger(v) && v >= 0) || count + extra > parts) {
    throw new Error(`hundredGrid: ${count} + ${extra} cells do not fit in ${parts}`);
  }
  const rows = parts / 10, cw = size / 10, ch = size / rows;
  const cells = [];
  for (let c = 0; c < 10; c++) {
    for (let r = 0; r < rows; r++) {
      const i = c * rows + r;
      const kind = i < count ? 'a' : i < count + extra ? 'b' : '0';
      const fill = kind === 'a' ? SHADE : kind === 'b' ? SHADE_2 : LIGHT;
      cells.push(`<rect data-cell="${kind}" x="${(c * cw).toFixed(2)}" y="${(r * ch).toFixed(2)}" width="${cw.toFixed(2)}" height="${ch.toFixed(2)}" fill="${fill}" stroke="${LINE}" stroke-width="${rows > 1 ? 0.6 : 1.2}"/>`);
    }
  }
  // The columns (tenths) drawn bolder over the cells, and the outline.
  const cols = Array.from({ length: 9 }, (_, k) => `<line x1="${((k + 1) * cw).toFixed(2)}" y1="0" x2="${((k + 1) * cw).toFixed(2)}" y2="${size}" stroke="${LINE}" stroke-width="1.4"/>`);
  const body = `<g data-hundred="1" data-parts="${parts}" data-shaded="${count}" data-extra="${extra}">${cells.join('')}${cols.join('')}<rect x="0" y="0" width="${size}" height="${size}" fill="none" stroke="${LINE}" stroke-width="2"/></g>`;
  return svg(size, size, body, `${count + extra} מתוך ${parts} חלקים צבועים`, `-1 -1 ${size + 2} ${size + 2}`);
}

/**
 * A number line of decimals from `from` to `to` (text: '0', '0.4'), a tick
 * every 10^-places (places 1: tenths, 2: hundredths), at most 20 ticks. Every
 * `labelEvery`-th tick (and both ends) is labelled; `points` are marked above
 * the line ([{ at: '0.45', label, color: 'a' | 'b' }], the label defaults to
 * the number). Ticks, labels and points carry data-tick, data-label and
 * data-point.
 */
function decimalLine({ from = '0', to = '1', places = 1, points = [], labelEvery = 1, width = 300 } = {}) {
  const a = units(from, places), b = units(to, places);
  if (!(b > a) || b - a > 20) throw new Error(`decimalLine: ${from} to ${to} needs 1 to 20 ticks of ${unitsText(1, places)}`);
  const pad = 18, y = 30, span = width - 2 * pad;
  const x = (u) => pad + ((u - a) / (b - a)) * span;
  const parts = [`<line x1="${pad - 6}" y1="${y}" x2="${width - pad + 6}" y2="${y}" stroke="${LINE}" stroke-width="2"/>`];
  for (let u = a; u <= b; u++) {
    const labelled = u === a || u === b || (u - a) % labelEvery === 0;
    const big = u % 10 ** places === 0 || u % 10 === 0;
    parts.push(`<line data-tick="${unitsText(u, places)}" x1="${x(u).toFixed(1)}" y1="${y - (big ? 9 : 6)}" x2="${x(u).toFixed(1)}" y2="${y + (big ? 9 : 6)}" stroke="${LINE}" stroke-width="${big ? 2 : 1}"/>`);
    if (labelled) parts.push(`<text data-label="${unitsText(u, places)}" x="${x(u).toFixed(1)}" y="${y + 24}" font-size="11" text-anchor="middle" fill="${LINE}">${unitsText(u, places)}</text>`);
  }
  for (const p of points) {
    const u = units(p.at, places);
    if (u < a || u > b) throw new Error(`decimalLine: point ${p.at} is off the line`);
    const color = p.color === 'b' ? SHADE_2 : SHADE;
    parts.push(`<circle data-point="${unitsText(u, places)}" cx="${x(u).toFixed(1)}" cy="${y}" r="5" fill="${color}" stroke="${LIGHT}" stroke-width="1.5"/>`);
    parts.push(`<text x="${x(u).toFixed(1)}" y="${y - 12}" font-size="12" font-weight="700" text-anchor="middle" fill="${color}">${esc(p.label ?? unitsText(u, places))}</text>`);
  }
  return svg(width, 62, `<g data-line="1" data-from="${unitsText(a, places)}" data-to="${unitsText(b, places)}">${parts.join('')}</g>`, `ישר מספרים מ-${from} עד ${to}`);
}

const PLACE_NAMES = {
  thousands: 'אלפים', hundreds: 'מאות', tens: 'עשרות', ones: 'אחדות',
  tenths: 'עשיריות', hundredths: 'מאיות', thousandths: 'אלפיות'
};
const WHOLE_PLACES = ['thousands', 'hundreds', 'tens', 'ones'];
const FRACTION_PLACES = ['tenths', 'hundredths', 'thousandths'];

/**
 * A place-value table: a column for each place (hundreds … thousandths, as
 * many as the numbers need), the point between ones and tenths, and one row
 * per number in `rows` ('3.45'). `mark` shades one place's column
 * ('tenths'); `move` draws an arrow from each digit of the first row to its
 * place in the second, `move` columns to the left (× 10, × 100) or right
 * (÷, a negative `move`). Digits carry data-row, data-place and data-digit;
 * the point data-point.
 */
function placeValue(rows, { mark = null, move = null, scale = 1 } = {}) {
  const nums = rows.map((r) => {
    const m = String(r).match(/^(\d{1,4})(?:\.(\d{1,3}))?$/);
    if (!m) throw new Error(`placeValue: ${r} is not a decimal with at most 4 whole digits and 3 after the point`);
    return { whole: m[1], frac: m[2] ?? null };
  });
  const nw = Math.max(...nums.map((n) => n.whole.length));
  const nf = Math.max(0, ...nums.map((n) => (n.frac || '').length));
  const places = [...WHOLE_PLACES.slice(4 - nw), ...FRACTION_PLACES.slice(0, nf)];
  if (mark && !places.includes(mark)) throw new Error(`placeValue: no ${mark} column`);
  const CW = 52, PT = 14, HEAD = 26, RH = 34, ARROW = move ? 22 : 0;
  const colX = (i) => i * CW + (i >= nw ? PT : 0); // left edge of column i
  const width = places.length * CW + (nf ? PT : 0);
  const rowY = (r) => HEAD + r * (RH + ARROW) + RH / 2 + 7;
  const parts = [];
  places.forEach((p, i) => {
    if (p === mark) parts.push(`<rect data-mark="${p}" x="${colX(i)}" y="0" width="${CW}" height="${HEAD + rows.length * RH + (rows.length - 1) * ARROW}" fill="${SHADE}" fill-opacity="0.14"/>`);
    parts.push(`<text x="${colX(i) + CW / 2}" y="17" font-size="12" font-weight="700" text-anchor="middle" fill="${LINE}">${PLACE_NAMES[p]}</text>`);
  });
  parts.push(`<line x1="0" y1="${HEAD}" x2="${width}" y2="${HEAD}" stroke="${LINE}" stroke-width="1.5"/>`);
  for (let i = 1; i < places.length; i++) {
    const x = i === nw ? colX(i) - PT / 2 : colX(i);
    if (i !== nw) parts.push(`<line x1="${x}" y1="4" x2="${x}" y2="${HEAD + rows.length * RH + (rows.length - 1) * ARROW}" stroke="${LINE}" stroke-opacity="0.35" stroke-width="1"/>`);
  }
  const centre = (r, place) => colX(places.indexOf(place)) + CW / 2;
  nums.forEach((n, r) => {
    const y = rowY(r);
    const ds = [
      ...n.whole.split('').map((d, k) => ({ d, place: WHOLE_PLACES[4 - n.whole.length + k] })),
      ...(n.frac || '').split('').map((d, k) => ({ d, place: FRACTION_PLACES[k] }))
    ];
    for (const { d, place } of ds) {
      parts.push(`<text data-row="${r}" data-place="${place}" data-digit="${d}" x="${centre(r, place)}" y="${y}" font-size="20" font-weight="700" text-anchor="middle" fill="${r ? SHADE : LINE}">${d}</text>`);
    }
    if (n.frac !== null) parts.push(`<text data-row="${r}" data-point="1" x="${colX(nw) - PT / 2}" y="${y}" font-size="22" font-weight="700" text-anchor="middle" fill="${LINE}">.</text>`);
  });
  if (move && rows.length === 2) {
    // Each digit of the first row, from its first non-zero digit, moves `move` places.
    const first = [...nums[0].whole.split('').map((d, k) => ({ d, place: WHOLE_PLACES[4 - nums[0].whole.length + k] })),
      ...(nums[0].frac || '').split('').map((d, k) => ({ d, place: FRACTION_PLACES[k] }))];
    const all = [...WHOLE_PLACES, ...FRACTION_PLACES];
    const from = first.findIndex((q) => q.d !== '0');
    first.slice(from < 0 ? first.length : from).forEach(({ place }) => {
      const to = all[all.indexOf(place) - move];
      if (!to || !places.includes(to)) return;
      const x1 = centre(0, place), x2 = centre(1, to);
      const y1 = rowY(0) + 6, y2 = rowY(1) - 20;
      parts.push(`<line data-arrow="${place}>${to}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${SHADE_2}" stroke-width="2" marker-end="url(#pv-head)"/>`);
    });
  }
  const height = HEAD + rows.length * RH + (rows.length - 1) * ARROW + 4;
  const defs = move ? `<defs><marker id="pv-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="${SHADE_2}"/></marker></defs>` : '';
  return svg(Math.round(width * scale), Math.round(height * scale), `${defs}<g data-place-value="1">${parts.join('')}</g>`,
    `טבלת ערך המקום: ${rows.join(', ')}`, `0 0 ${width} ${height}`, 'math-grid');
}

/**
 * Adding or subtracting in columns with the points lined up: `top`, then
 * `op` ('+' or '−') and `bottom`, a line, and `result`. Every number is
 * written with as many digits after the point as the longest; the zeros
 * added to fill a number up are drawn in the second colour. Each row is a
 * group with data-row ("top", "bottom", "result") and data-value; its
 * characters are separate texts, so the check reads the row back.
 */
function columnCalc({ top, bottom, op = '+', result, scale = 1 } = {}) {
  if (op !== '+' && op !== '−') throw new Error(`columnCalc: op must be + or −, not ${op}`);
  const nums = [top, bottom, result].map((s) => {
    const m = String(s).match(/^(\d+)(?:\.(\d+))?$/);
    if (!m) throw new Error(`columnCalc: ${s} is not a decimal`);
    return { whole: m[1], frac: m[2] || '' };
  });
  const nw = Math.max(...nums.map((n) => n.whole.length));
  const nf = Math.max(...nums.map((n) => n.frac.length));
  const CW = 15, PT = 9, RH = 28, LEFT = 22;
  const x = (k) => LEFT + k * CW + (k >= nw ? PT : 0) + CW / 2; // centre of digit column k (0 = leftmost whole digit)
  const pointX = LEFT + nw * CW + PT / 2;
  const t = (cx, cy, s, fill, extra = '') => `<text x="${cx}" y="${cy}"${extra} font-family="Arial, sans-serif" font-size="19" font-weight="700" text-anchor="middle" fill="${fill}">${s}</text>`;
  const rowsSvg = nums.map((n, r) => {
    const y = 22 + r * RH + (r === 2 ? 8 : 0);
    const color = r === 2 ? SHADE : LINE;
    const chars = [];
    n.whole.split('').forEach((d, k) => chars.push(t(x(nw - n.whole.length + k), y, d, color)));
    if (nf) {
      chars.push(t(pointX, y, '.', color));
      for (let k = 0; k < nf; k++) {
        const filled = k >= n.frac.length;
        chars.push(t(x(nw + k), y, filled ? '0' : n.frac[k], filled ? SHADE_2 : color, filled ? ' data-filled="1"' : ''));
      }
    }
    if (r === 1) chars.push(t(LEFT - 8, y, op, LINE));
    return `<g data-row="${['top', 'bottom', 'result'][r]}" data-value="${[top, bottom, result][r]}">${chars.join('')}</g>`;
  });
  const width = LEFT + (nw + nf) * CW + (nf ? PT : 0) + 8;
  const lineY = 22 + RH + 9;
  const height = 22 + 2 * RH + 8 + 10;
  const body = `${rowsSvg.join('')}<line x1="${LEFT - 16}" y1="${lineY}" x2="${width - 4}" y2="${lineY}" stroke="${LINE}" stroke-width="1.6"/>`;
  return svg(Math.round(width * scale), Math.round(height * scale), `<g data-column="${op}">${body}</g>`,
    `${top} ${op} ${bottom} = ${result}`, `0 0 ${width} ${height}`, 'math-grid');
}

// ---------------------------------------------------------------------------
// Ratios (chapter 12). Each picture carries data-* attributes for the checks.

/**
 * A bar model of a ratio: one row per amount, each a row of equal parts, its
 * Hebrew name at the right. A row is { label, parts, each, color, split }:
 * `each` writes the value of one part in every part, `color` is 'a' (blue)
 * or 'b' (orange), and `split` colours the first `split` parts 'a' and the
 * rest 'b' (one whole cut in a ratio). Every row carries data-label,
 * data-parts, data-each and data-split; every part data-part ("a" or "b").
 */
function ratioBar(rows, { scale = 1 } = {}) {
  const PART = 30, H = 26, GAP = 8, LABEL = 58;
  if (!rows.length || rows.some((r) => !Number.isInteger(r.parts) || r.parts < 1 || r.parts > 12)) {
    throw new Error('ratioBar: every row needs 1 to 12 parts');
  }
  const most = Math.max(...rows.map((r) => r.parts));
  const width = most * PART + GAP + LABEL;
  const parts = rows.map((r, i) => {
    if (r.split !== undefined && !(Number.isInteger(r.split) && r.split > 0 && r.split < r.parts)) throw new Error(`ratioBar: split ${r.split} does not cut ${r.parts} parts`);
    const y = i * (H + GAP);
    const boxes = Array.from({ length: r.parts }, (_, k) => {
      const kind = r.split !== undefined ? (k < r.split ? 'a' : 'b') : (r.color === 'b' ? 'b' : 'a');
      const fill = kind === 'a' ? SHADE : SHADE_2;
      const x = k * PART;
      const value = r.each !== undefined && r.each !== null
        ? `<text x="${x + PART / 2}" y="${y + H / 2 + 5}" font-size="13" font-weight="700" text-anchor="middle" fill="${LIGHT}">${esc(r.each)}</text>` : '';
      return `<rect data-part="${kind}" x="${x}" y="${y}" width="${PART}" height="${H}" fill="${fill}" stroke="${LINE}" stroke-width="1.5"/>${value}`;
    }).join('');
    const label = `<text x="${width - 2}" y="${y + H / 2 + 5}" font-size="14" font-weight="700" text-anchor="end" fill="${LINE}">${esc(r.label || '')}</text>`;
    return `<g data-row="${i}" data-label="${esc(r.label || '')}" data-parts="${r.parts}" data-each="${r.each ?? ''}" data-split="${r.split ?? ''}">${boxes}${label}</g>`;
  }).join('');
  const height = rows.length * (H + GAP) - GAP;
  return svg(Math.round(width * scale), Math.round(height * scale), `<g data-ratio-bar="1">${parts}</g>`,
    `מודל פסים: ${rows.map((r) => `${r.label || ''} ${r.parts}`).join(', ')}`, `-1 -1 ${width + 2} ${height + 2}`, 'math-grid');
}

/**
 * A ratio table: two rows (`heads`, Hebrew names at the right) and a column
 * per pair of equal ratios, `cols` ([[3, 12], [1, 4], [5, 20]]); a value may
 * be 'x' or '?' (the missing term, in the second colour). `steps` writes
 * what turns each column into the next ('÷ 3', '× 5') above the top row and
 * under the bottom one, with an arrow. Cells carry data-col, data-row and
 * data-value; steps data-step.
 */
function ratioTable({ heads, cols, steps = [], scale = 1 }) {
  if (!heads || heads.length !== 2 || !cols.length || cols.some((c) => c.length !== 2)) throw new Error('ratioTable: two heads and columns of two values');
  if (steps.length && steps.length !== cols.length - 1) throw new Error(`ratioTable: ${steps.length} steps for ${cols.length} columns`);
  const CW = 54, RH = 32, HEAD = 70, TOP = steps.length ? 24 : 2, BOTTOM = steps.length ? 24 : 2;
  const width = cols.length * CW + HEAD;
  const height = TOP + 2 * RH + BOTTOM;
  const out = [];
  cols.forEach((col, c) => col.forEach((v, r) => {
    const x = c * CW, y = TOP + r * RH;
    const missing = typeof v === 'string' && !/^\d/.test(v);
    out.push(`<rect x="${x}" y="${y}" width="${CW}" height="${RH}" fill="${r ? '#fff7ea' : '#eef0fd'}" stroke="${LINE}" stroke-width="1.2"/>`);
    out.push(`<text data-col="${c}" data-row="${r}" data-value="${esc(v)}" x="${x + CW / 2}" y="${y + RH / 2 + 6}" font-size="17" font-weight="700" text-anchor="middle" fill="${missing ? SHADE_2 : LINE}"${missing ? ' font-style="italic"' : ''}>${esc(v)}</text>`);
  }));
  heads.forEach((h, r) => out.push(`<text x="${width - 4}" y="${TOP + r * RH + RH / 2 + 5}" font-size="14" font-weight="700" text-anchor="end" fill="${LINE}">${esc(h)}</text>`));
  steps.forEach((s, c) => {
    const x1 = c * CW + CW / 2 + 6, x2 = (c + 1) * CW + CW / 2 - 6, mid = (x1 + x2) / 2;
    for (const [y, ty] of [[TOP - 6, TOP - 10], [TOP + 2 * RH + 6, TOP + 2 * RH + 20]]) {
      out.push(`<path d="M ${x1} ${y} Q ${mid} ${y + (y < TOP ? -10 : 10)} ${x2} ${y}" fill="none" stroke="${SHADE}" stroke-width="1.6" marker-end="url(#rt-head)"/>`);
      out.push(`<text data-step="${esc(s)}" x="${mid}" y="${ty}" font-size="12" font-weight="700" text-anchor="middle" fill="${SHADE}">${esc(s)}</text>`);
    }
  });
  const defs = steps.length ? `<defs><marker id="rt-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="${SHADE}"/></marker></defs>` : '';
  return svg(Math.round(width * scale), Math.round(height * scale), `${defs}<g data-ratio-table="1">${out.join('')}</g>`,
    `טבלת יחסים: ${heads.join(' ו')}`, `0 0 ${width} ${height}`, 'math-grid');
}

/** Several shapes in a row (e.g. two whole circles and a part). */
function row(...svgs) {
  return `<span class="math-row">${svgs.join('')}</span>`;
}

/** A picture with a caption under it. Use inside the theory HTML. */
function figure(picture, caption) {
  return `<figure class="math-figure">${picture}${caption ? `<figcaption dir="auto">${caption}</figcaption>` : ''}</figure>`;
}

/** Several figures side by side (wrap on phones). */
function figures(...figs) {
  return `<div class="math-figures">${figs.join('')}</div>`;
}

module.exports = {
  circle, bar, numberLine, integerLine, coordGrid, triangle, balance, signed, grid, array, groups, longDivision, longDivisionSteps,
  hundredGrid, decimalLine, placeValue, columnCalc, ratioBar, ratioTable, row, figure, figures
};
