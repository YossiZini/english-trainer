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

module.exports = { circle, bar, numberLine, integerLine, coordGrid, signed, grid, array, groups, longDivision, longDivisionSteps, row, figure, figures };
