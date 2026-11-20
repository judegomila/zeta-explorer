/**
 * Figures for the exposition page. Everything is computed here from the
 * Observatory's own zeta code; nothing is a stored picture.
 */
import { ZERO_HEIGHTS, hardyZ } from '../math.js';

const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const $ = id => document.getElementById(id);

/** Primes up to n by the sieve of Eratosthenes. */
export function primesUpTo(n) {
  const composite = new Uint8Array(n + 1), primes = [];
  for (let i = 2; i <= n; i++) {
    if (composite[i]) continue;
    primes.push(i);
    for (let j = i * i; j <= n; j += i) composite[j] = 1;
  }
  return primes;
}

/** Li(x) = integral from 2 to x of dt / ln t, by Simpson's rule. */
export function logIntegral(x, steps = 400) {
  if (x <= 2) return 0;
  const h = (x - 2) / steps;
  let sum = 1 / Math.log(2) + 1 / Math.log(x);
  for (let i = 1; i < steps; i++) sum += (i % 2 ? 4 : 2) / Math.log(2 + i * h);
  return sum * h / 3;
}

/** Chebyshev's psi(x): sum of ln p over prime powers p^k <= x. */
export function chebyshevPsi(x, primes) {
  let total = 0;
  for (const p of primes) {
    if (p > x) break;
    total += Math.log(p) * Math.floor(Math.log(x) / Math.log(p) + 1e-12);
  }
  return total;
}

/**
 * Von Mangoldt's explicit formula truncated to the first `count` zero pairs,
 * each taken on the critical line at its tabulated height:
 *   x - sum 2 Re(x^rho / rho) - ln 2pi - (1/2) ln(1 - x^-2),  rho = 1/2 + i gamma.
 */
export function psiFromZeros(x, count, heights = ZERO_HEIGHTS) {
  const lx = Math.log(x), root = Math.sqrt(x);
  let waves = 0;
  for (let k = 0; k < count && k < heights.length; k++) {
    const g = heights[k];
    waves += 2 * root * (0.5 * Math.cos(g * lx) + g * Math.sin(g * lx)) / (0.25 + g * g);
  }
  return x - waves - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - 1 / (x * x));
}

function plot(canvas, { xmin, xmax, ymin, ymax, series, marks = [], zeroLine = false }) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth, height = canvas.clientHeight;
  if (!width || !height) return;
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  const c = canvas.getContext('2d');
  c.setTransform(ratio, 0, 0, ratio, 0, 0);
  const pad = { l: 44, r: 12, t: 10, b: 26 };
  const X = x => pad.l + (x - xmin) / (xmax - xmin) * (width - pad.l - pad.r);
  const Y = y => height - pad.b - (y - ymin) / (ymax - ymin) * (height - pad.t - pad.b);
  c.clearRect(0, 0, width, height);
  c.font = '11px ' + (css('--mono') || 'monospace');
  c.fillStyle = css('--dim'); c.strokeStyle = css('--line'); c.lineWidth = 1;
  const ticks = (lo, hi, n) => {
    const raw = (hi - lo) / n, mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].find(m => m * mag >= raw) * mag, out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.abs(v) < 1e-9 ? 0 : v);
    return out;
  };
  c.textAlign = 'center'; c.textBaseline = 'top';
  for (const v of ticks(xmin, xmax, 6)) {
    c.beginPath(); c.moveTo(X(v), pad.t); c.lineTo(X(v), height - pad.b); c.stroke();
    c.fillText(String(+v.toFixed(6)), X(v), height - pad.b + 7);
  }
  c.textAlign = 'right'; c.textBaseline = 'middle';
  for (const v of ticks(ymin, ymax, 5)) {
    c.beginPath(); c.moveTo(pad.l, Y(v)); c.lineTo(width - pad.r, Y(v)); c.stroke();
    c.fillText(String(+v.toFixed(6)), pad.l - 7, Y(v));
  }
  if (zeroLine) {
    c.strokeStyle = css('--muted'); c.beginPath(); c.moveTo(pad.l, Y(0)); c.lineTo(width - pad.r, Y(0)); c.stroke();
  }
  c.save();
  c.beginPath(); c.rect(pad.l, pad.t, width - pad.l - pad.r, height - pad.t - pad.b); c.clip();
  for (const s of series) {
    c.strokeStyle = s.color; c.lineWidth = s.width || 2; c.lineJoin = 'round';
    c.beginPath();
    s.points.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))));
    c.stroke();
  }
  for (const m of marks) {
    c.fillStyle = m.color; c.beginPath(); c.arc(X(m.x), Y(m.y), 4, 0, 2 * Math.PI); c.fill();
  }
  c.restore();
}

/** Staircase points for a step function with jumps at the given places. */
function staircase(xmin, xmax, jumps, valueAt) {
  const points = [[xmin, valueAt(xmin)]];
  for (const j of jumps) {
    if (j <= xmin || j > xmax) continue;
    points.push([j, points[points.length - 1][1]], [j, valueAt(j)]);
  }
  points.push([xmax, points[points.length - 1][1]]);
  return points;
}

const PRIMES = primesUpTo(3000);

function drawPrimes() {
  const xmax = Number($('primeRange').value);
  $('primeRangeOut').textContent = xmax;
  const count = x => { let n = 0; for (const p of PRIMES) { if (p > x) break; n++; } return n; };
  const smooth = fn => Array.from({ length: 241 }, (_, i) => { const x = 2 + (xmax - 2) * i / 240; return [x, fn(x)]; });
  plot($('figPrimes'), {
    xmin: 0, xmax, ymin: 0, ymax: Math.max(count(xmax), logIntegral(xmax)) * 1.06,
    series: [
      { color: css('--blue'), width: 1.6, points: smooth(x => x / Math.log(x)) },
      { color: css('--accent'), width: 1.6, points: smooth(x => logIntegral(x)) },
      { color: css('--text'), width: 1.8, points: staircase(0, xmax, PRIMES, count) },
    ],
  });
}

function drawHardy() {
  const tmax = Number($('hardyRange').value);
  $('hardyRangeOut').textContent = tmax;
  const n = 600, points = [];
  let lo = 0, hi = 0;
  for (let i = 0; i <= n; i++) {
    const t = 0.5 + (tmax - 0.5) * i / n, z = hardyZ(t);
    if (!Number.isFinite(z)) continue;
    points.push([t, z]); lo = Math.min(lo, z); hi = Math.max(hi, z);
  }
  plot($('figHardy'), {
    xmin: 0, xmax: tmax, ymin: lo * 1.1, ymax: hi * 1.1, zeroLine: true,
    series: [{ color: css('--accent'), points }],
    marks: ZERO_HEIGHTS.filter(g => g < tmax).map(g => ({ x: g, y: 0, color: css('--pink') })),
  });
}

const PSI_MAX = 50;
function drawExplicit() {
  const count = Number($('zeroCount').value);
  $('zeroCountOut').textContent = count;
  const powers = [];
  for (const p of PRIMES) { if (p > PSI_MAX) break; for (let q = p; q <= PSI_MAX; q *= p) powers.push(q); }
  powers.sort((a, b) => a - b);
  const n = 900, approx = [];
  for (let i = 0; i <= n; i++) { const x = 1.5 + (PSI_MAX - 1.5) * i / n; approx.push([x, psiFromZeros(x, count)]); }
  plot($('figExplicit'), {
    xmin: 0, xmax: PSI_MAX, ymin: -2, ymax: PSI_MAX * 1.02,
    series: [
      { color: css('--text'), width: 1.6, points: staircase(1.5, PSI_MAX, powers, x => chebyshevPsi(x, PRIMES)) },
      { color: css('--accent'), width: 2, points: approx },
    ],
  });
}

if (typeof document !== 'undefined' && $('figPrimes')) {
  const all = () => { drawPrimes(); drawHardy(); drawExplicit(); };
  $('primeRange').addEventListener('input', drawPrimes);
  $('hardyRange').addEventListener('input', drawHardy);
  $('zeroCount').addEventListener('input', drawExplicit);
  window.addEventListener('resize', all);
  all();
}
