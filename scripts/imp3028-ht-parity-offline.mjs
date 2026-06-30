// imp-3028 OFFLINE measurement (NOT part of the Vite build).
// Integrates the ACTUAL factor-2 backward-Dyson ODE for the full N-body
// system at small N, extracts the true min-gap collision time t_c_actual,
// and compares its 1/N OLS intercept against the initial-slope LOWER-BOUND
// intercept (a_hf_norm leg, imp-372). Quantifies the imp372-Ht-full parity gap.
//
// Factor-2 backward-Dyson convention (matches heat-flow-cross-validation-imp372.js):
//   dg_k/dtau = -2 * sum_{j!=k} 1/(g_k - g_j)
// increasing tau = backward flow, the minimum consecutive gap shrinks to 0.
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const TARGET_NS = [50, 100, 200];

// ── initial-slope lower bound (verbatim re-derivation of imp-372) ────────────
function initialSlope(N) {
  let kStar = 0;
  let B0 = ZEROS_EXTENDED[1] - ZEROS_EXTENDED[0];
  for (let k = 1; k < N - 1; k++) {
    const gap = ZEROS_EXTENDED[k + 1] - ZEROS_EXTENDED[k];
    if (gap < B0) { B0 = gap; kStar = k; }
  }
  const gK = ZEROS_EXTENDED[kStar];
  const gK1 = ZEROS_EXTENDED[kStar + 1];
  let S = 0;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const d1 = gK - ZEROS_EXTENDED[j];
    const d2 = gK1 - ZEROS_EXTENDED[j];
    if (Math.abs(d1 * d2) < 1e-30) continue;
    S += 1 / (d1 * d2);
  }
  const dBdtau = -4 / B0 + 2 * B0 * S;
  const tc_dyson_initial = B0 / (-dBdtau); // factor-2 collision-time estimate
  return { N, B0, kStar, tc_dyson_initial };
}

// ── actual full N-body factor-2 backward-Dyson integration ───────────────────
function deriv(g) {
  const n = g.length;
  const d = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    let s = 0;
    for (let j = 0; j < n; j++) {
      if (j === k) continue;
      s += 1 / (g[k] - g[j]);
    }
    d[k] = -2 * s;
  }
  return d;
}

function minGap(g) {
  let m = Infinity, idx = 0;
  for (let k = 0; k < g.length - 1; k++) {
    const gap = g[k + 1] - g[k];
    if (gap < m) { m = gap; idx = k; }
  }
  return { m, idx };
}

function rk4step(g, h) {
  const n = g.length;
  const k1 = deriv(g);
  const t2 = new Float64Array(n); for (let i = 0; i < n; i++) t2[i] = g[i] + 0.5 * h * k1[i];
  const k2 = deriv(t2);
  const t3 = new Float64Array(n); for (let i = 0; i < n; i++) t3[i] = g[i] + 0.5 * h * k2[i];
  const k3 = deriv(t3);
  const t4 = new Float64Array(n); for (let i = 0; i < n; i++) t4[i] = g[i] + h * k3[i];
  const k4 = deriv(t4);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = g[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return out;
}

function actualCollisionTime(N, B0) {
  let g = new Float64Array(N);
  for (let i = 0; i < N; i++) g[i] = ZEROS_EXTENDED[i];
  let tau = 0;
  // step proportional to B0 so the early flow is well resolved; refine near closure
  let h = B0 * 5e-4;
  const COLLIDE = B0 * 1e-6;
  let steps = 0;
  const MAX = 5e7;
  while (steps < MAX) {
    const next = rk4step(g, h);
    const { m } = minGap(next);
    if (m <= COLLIDE) { tau += h; break; }
    if (m < B0 * 1e-2 && h > B0 * 1e-7) { h *= 0.5; continue; } // refine near closure
    g = next; tau += h; steps++;
  }
  return tau; // factor-2 collision time
}

function ols(xs, ys) {
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const yb = ys.reduce((a, b) => a + b, 0) / n;
  const Sxx = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  const Sxy = xs.reduce((s, x, i) => s + (x - xb) * (ys[i] - yb), 0);
  const b = Sxy / Sxx;
  const a = yb - b * xb;
  return { a, b };
}

const rows = [];
for (const N of TARGET_NS) {
  const is = initialSlope(N);
  const tcActual = actualCollisionTime(N, is.B0);
  rows.push({ N, B0: is.B0, tc_initial: is.tc_dyson_initial, tc_actual: tcActual,
    ratio: tcActual / is.tc_dyson_initial });
  console.log(`N=${N}  B0=${is.B0.toFixed(7)}  tc_init=${is.tc_dyson_initial.toExponential(6)}  tc_actual=${tcActual.toExponential(6)}  ratio=${(tcActual / is.tc_dyson_initial).toFixed(5)}`);
}

const xs = rows.map((r) => 1 / r.N);
const olsInit = ols(xs, rows.map((r) => r.tc_initial));
const olsActual = ols(xs, rows.map((r) => r.tc_actual));
console.log('\n-- 1/N OLS intercepts (factor-2 / Dyson convention) --');
console.log('initial-slope lower-bound intercept a_init =', olsInit.a.toExponential(6));
console.log('actual-trajectory intercept       a_actual =', olsActual.a.toExponential(6));
console.log('parity gap (a_actual - a_init)               =', (olsActual.a - olsInit.a).toExponential(6));
console.log('intercept ratio a_actual / a_init            =', (olsActual.a / olsInit.a).toFixed(5));
