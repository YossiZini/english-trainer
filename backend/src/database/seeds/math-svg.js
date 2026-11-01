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

module.exports = { circle, bar, numberLine, grid, array, groups, longDivision, longDivisionSteps, row, figure, figures };
