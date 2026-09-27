// Inline SVG pictures for the Math teaching documents (theory HTML).
// Pure functions returning SVG strings; no files, no runtime dependencies.
// Colours are fixed: the theory page is light-themed.

const SHADE = '#667eea';      // shaded part of a whole
const SHADE_2 = '#f5a623';    // second colour (comparisons, products)
const OVERLAP = '#b3421e';    // both colours at once (multiplication grid)
const LINE = '#2b2f3a';
const LIGHT = '#ffffff';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function svg(width, height, body, label, viewBox = `0 0 ${width} ${height}`) {
  return `<svg class="math-pic" direction="ltr" style="direction:ltr" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}">${body}</svg>`;
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

module.exports = { circle, bar, numberLine, grid, row, figure, figures };
