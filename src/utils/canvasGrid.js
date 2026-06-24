/**
 * Shared canvas coordinate / axis-grid helpers for viz pages.
 *
 * All functions operate on a 2D canvas context and use the project's
 * standard dark-theme palette: axes #334155, grid #1e293b, labels #64748b.
 *
 * Margin objects follow { left, right, top, bottom } in CSS-box order.
 */

/**
 * Set up a canvas for HiDPI rendering and return the 2D context plus logical
 * pixel dimensions.  Call this at the top of every draw callback.
 *
 * @param {React.RefObject} canvasRef
 * @returns {{ ctx: CanvasRenderingContext2D, w: number, h: number } | null}
 */
export function initCanvas(canvasRef) {
  const canvas = canvasRef.current;
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

/**
 * Draw an L-shaped axis frame (left + bottom edges of the plot area).
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ left: number, right: number, top: number, bottom: number }} margin
 * @param {number} w  logical canvas width
 * @param {number} h  logical canvas height
 */
export function drawAxes(ctx, margin, w, h) {
  ctx.save();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, h - margin.bottom);
  ctx.lineTo(w - margin.right, h - margin.bottom);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw horizontal dashed gridlines and Y-axis tick labels.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ left: number, right: number, top: number, bottom: number }} margin
 * @param {number} w
 * @param {number} h
 * @param {number} yMin   data value at the bottom of the plot
 * @param {number} yMax   data value at the top of the plot
 * @param {number} numTicks  number of gridline intervals
 * @param {((v: number) => string) | null} formatFn  label formatter (default: 2 d.p.)
 */
export function drawYGrid(ctx, margin, w, h, yMin, yMax, numTicks, formatFn) {
  const plotH = h - margin.top - margin.bottom;
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = '9px var(--font-mono, monospace)';
  ctx.textAlign = 'right';
  for (let i = 0; i <= numTicks; i++) {
    const val = yMin + (i / numTicks) * (yMax - yMin);
    const y = h - margin.bottom - (i / numTicks) * plotH;
    ctx.beginPath();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.8;
    ctx.moveTo(margin.left, y);
    ctx.lineTo(w - margin.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(formatFn ? formatFn(val) : val.toFixed(2), margin.left - 6, y + 3);
  }
  ctx.restore();
}

/**
 * Draw vertical dashed gridlines and X-axis tick labels.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ left: number, right: number, top: number, bottom: number }} margin
 * @param {number} w
 * @param {number} h
 * @param {number} xMin   data value at the left edge
 * @param {number} xMax   data value at the right edge
 * @param {number} numTicks
 * @param {((v: number) => string) | null} formatFn  label formatter (default: no decimals)
 */
export function drawXGrid(ctx, margin, w, h, xMin, xMax, numTicks, formatFn) {
  const plotW = w - margin.left - margin.right;
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = '9px var(--font-mono, monospace)';
  ctx.textAlign = 'center';
  for (let i = 0; i <= numTicks; i++) {
    const val = xMin + (i / numTicks) * (xMax - xMin);
    const x = margin.left + (i / numTicks) * plotW;
    ctx.beginPath();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.8;
    ctx.moveTo(x, margin.top);
    ctx.lineTo(x, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(formatFn ? formatFn(val) : val.toFixed(0), x, h - margin.bottom + 13);
  }
  ctx.restore();
}

/**
 * Return a linear scale function mapping [dataMin, dataMax] onto [pixelMin, pixelMax].
 *
 * @param {number} dataMin
 * @param {number} dataMax
 * @param {number} pixelMin
 * @param {number} pixelMax
 * @returns {(v: number) => number}
 */
export function linearScale(dataMin, dataMax, pixelMin, pixelMax) {
  const range = dataMax - dataMin || 1;
  return v => pixelMin + ((v - dataMin) / range) * (pixelMax - pixelMin);
}
