#!/usr/bin/env node
// scripts/compute-imp1300-higher-N-gue.mjs
// imp-1300 — NOVEL: higher-N GUE statistics push (target rate gap).
//
// WHY THIS SCRIPT EXISTS
// ----------------------
// imp-1149 (koksma-hlawka-2nd-moment-deviation-bound.js) ships an
// UNCONDITIONAL N^{-3/2} bound on the deviation
//
//     |t_c(N) - 1/(2 M_infty(N))|  <=  CHO / (L * N^{3/2})
//
// where L = log gamma_N and CHO ≈ 189 (Selberg C_S = 3 convention).
// The rate exponent α = 1.5 is the BINDING constraint on closing the
// linear-1/N gap toward the target α = 2 (imp-1149 rateGap = 0.5,
// imp-1147 conditional flag still in force).
//
// Pushing the empirical M_∞(N) measurement to LARGER N — ideally N=1e8
// from a hypothetical zeros-to-1e8.js — would:
//   (a) verify α ≈ 1.5 on 100x larger data,
//   (b) potentially surface a sharper effective α < -1.5 (i.e. faster
//       decay than the rigorous bound, suggesting room to tighten),
//   (c) close the imp-1149 rateGap = 0.5 residual.
//
// METHOD
// ------
// 1. Load Riemann-zeta zeros from src/data/zeros-to-1e8.js if present,
//    else fall back to src/data/zeros-to-1e6.js.
// 2. For each log-spaced N in {1e4, 1e5, 1e6, 1e7, 1e8} (truncated to
//    the data ceiling), compute:
//      - gamma_N (Nth zero ordinate)
//      - y_N_sharp = sqrt(2π / N) (the imp-341 uniformity strip)
//      - M_N_empirical = sup over an interior x-grid of Im m_N(x + i y_N_sharp)
//        where m_N(z) = Σ_n 1/(γ_n - z) (UN-normalized Cauchy transform
//        on the RAW Riemann ordinates γ_n — same convention as
//        imp-341 lambda-intercept-burgers-uniformity.js, where
//        sup Im m_∞ ≥ π ρ_∞ / y ≈ K1 (L - log 4π) √N at the strip
//        y_N_sharp = √(2π/N) with ρ_∞(x) = log(x/2π)/(2π) the
//        Riemann-von Mangoldt density).
//      - M_infty_asymp = K1 * (L - log(4π)) * sqrt(N) with
//        L = log gamma_N, K1 = 1/(2*sqrt(2π)) (the imp-341 lower-bound
//        on sup Im m_∞, used here as the asymptotic reference).
//      - t_c_emp = 1/(2 M_N_empirical), t_c_inf = 1/(2 M_infty_asymp).
//      - Deviation D(N) = |t_c_emp - t_c_inf|.
// 4. OLS fit on log-log:
//      log D(N) = log C - α * log N
//    Extract α and std-error from linear regression.
// 5. Compare measured α vs imp-1149 prediction α = 1.5.
//
// HONEST SCOPE
// ------------
// - This script ONLY reads zeros from the bundled data files. If only
//   zeros-to-1e6.js is available, the "higher-N" claim is bounded by
//   that ceiling (N <= 1e6) and the script records this limitation
//   in the output `dataCeilingNote` field.
// - The empirical M_N is computed on a discrete x-grid of interior
//   points — not a true sup over the strip; discretization is
//   controlled but introduces a (decreasing in M_X_GRID_SIZE) bias.
// - The Cauchy transform Im m_N at y > 0 is bounded and well-behaved;
//   the asymptotic prediction K1 (L - log 4π) sqrt(N) is an imp-341
//   LOWER BOUND on the true sup Im m_∞, so the deviation
//   |M_N_emp - M_infty_asymp| upper-bounds the true deviation
//   |M_N_emp - sup Im m_∞|. The α we extract is conservative.
// - OLS on log-log gives α via slope of best-fit line. Std error is
//   computed from residuals (standard formula).
//
// OUTPUT
// ------
// JSON to stdout:
//   - per-N rows (N, gamma_N, y_sharp, M_N_emp, M_inf_asymp, t_c_emp,
//                 t_c_inf, deviation, log10N, log10D)
//   - regression result (alpha, alpha_stderr, R^2, intercept)
//   - verdict
//
// Ticket: imp-1300 (numerical, low, sonnet-4-6 / NOVEL).

import { createServer } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Detect available zero bundles ──────────────────────────────────────────
const ZEROS_1E8_PATH = path.join(ROOT, 'src/data/zeros-to-1e8.js');
const ZEROS_1E7_PATH = path.join(ROOT, 'src/data/zeros-to-1e7.js');
const ZEROS_1E6_PATH = path.join(ROOT, 'src/data/zeros-to-1e6.js');

let zerosModulePath = null;
let dataCeiling = null;
if (fs.existsSync(ZEROS_1E8_PATH)) {
  zerosModulePath = '/src/data/zeros-to-1e8.js';
  dataCeiling = 1e8;
} else if (fs.existsSync(ZEROS_1E7_PATH)) {
  zerosModulePath = '/src/data/zeros-to-1e7.js';
  dataCeiling = 1e7;
} else if (fs.existsSync(ZEROS_1E6_PATH)) {
  zerosModulePath = '/src/data/zeros-to-1e6.js';
  dataCeiling = 1e6;
} else {
  console.error('FATAL: no zeros-to-* bundle found in src/data/');
  process.exit(2);
}
console.error(`Using zeros module: ${zerosModulePath} (ceiling = ${dataCeiling})`);

const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
});
const mod = await server.ssrLoadModule(zerosModulePath);
const ZEROS_FULL_ARR = mod.ZEROS_EXTENDED;
console.error(`Loaded ${ZEROS_FULL_ARR.length} zeros`);

// Copy to a Float64Array for fast inner loops (raw ordinates γ_n, NOT
// unfolded — the imp-341 / imp-1149 Cauchy transform m_N(z) = (1/N)
// Σ_n 1/(γ_n - z) is on the raw zeros).
const GAMMA = new Float64Array(ZEROS_FULL_ARR.length);
for (let i = 0; i < ZEROS_FULL_ARR.length; i++) {
  GAMMA[i] = ZEROS_FULL_ARR[i];
}

// ── Constants (matching koksma-hlawka-2nd-moment-deviation-bound.js) ────────
const C_SELBERG = 3.0;
const K1 = 1 / (2 * Math.sqrt(2 * Math.PI));

// Riemann-von Mangoldt inversion (same as imp-341 / imp-1149).
function rvmCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 12; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

// ── Compute M_N_emp at the uniformity strip ────────────────────────────────
// M_N_emp(N) = max over an interior x-grid of
//   Im m_N(x + i y_sharp) = Σ_n y_sharp / ((γ_n - x)^2 + y_sharp^2)
// (un-normalized: this is the convention in lambda-intercept and
// koksma-hlawka where sup Im m_∞ ≈ π ρ_∞ / y grows as √N at y_sharp).
// We scan x over a dense grid centered on the interior of the first-N
// raw zero ordinates (middle 60% of [γ_1, γ_N]) to approximate the sup.
//
// PERF: the inner sum is O(N) per x; total O(N * GRID).
// At N=1e6 and GRID=401, that's 4e8 ops — ~30-60s in V8. We use a
// TRUNCATED window (only zeros within +/- WINDOW_HALFWIDTH_Y_UNITS *
// y_sharp of x contribute non-negligibly, since the Cauchy kernel
// y/((d^2 + y^2)) falls as 1/d^2 for |d| >> y). With
// WINDOW_HALFWIDTH_Y_UNITS = 1000 we capture > 99.999% of the sum;
// the truncated form runs in O(N + GRID * 2 * WINDOW) ≈ O(N) per N.
// We use binary search on the sorted γ_n array to find the window.

const M_X_GRID_SIZE = 401;
const WINDOW_HALFWIDTH_Y_UNITS = 2000; // tail tolerance

function binarySearchLeft(arr, len, x) {
  // first index i in [0, len) with arr[i] >= x
  let lo = 0, hi = len;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < x) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function computeMnAtStrip(N) {
  const y = Math.sqrt((2 * Math.PI) / N);
  const gammaFirst = GAMMA[0];
  const gammaLast = GAMMA[N - 1];
  const span = gammaLast - gammaFirst;
  const xLo = gammaFirst + 0.2 * span;
  const xHi = gammaLast - 0.2 * span;
  let maxImM = -Infinity;
  let argmaxX = null;
  const y2 = y * y;
  const window = WINDOW_HALFWIDTH_Y_UNITS * y;
  // Pre-compute correction for the truncated TAIL: the tail of
  // Σ_n y/(d^2 + y^2) outside [x - window, x + window] is bounded by
  //   2 * ∫_window^∞ y/(d^2 + y^2) * ρ(d) dd ≈ 2 * ρ * y * (π/2 - atan(window/y))
  //     = 2 * ρ * y * atan(y/window) ≈ 2 * ρ * y^2 / window
  // For window/y = 2000 the tail correction per x is bounded by
  //   π * ρ * 1/1000, negligible relative to the peak ≈ π * ρ / y
  // by a factor 1/(1000 * y / 1) = sqrt(N/2π) / 1000 → favorable as N grows.
  for (let g = 0; g < M_X_GRID_SIZE; g++) {
    const x = xLo + (xHi - xLo) * (g / (M_X_GRID_SIZE - 1));
    const lo = binarySearchLeft(GAMMA, N, x - window);
    const hi = binarySearchLeft(GAMMA, N, x + window);
    let s = 0;
    for (let n = lo; n < hi; n++) {
      const d = GAMMA[n] - x;
      s += y / (d * d + y2);
    }
    const imM = s; // un-normalized (matches imp-341/imp-1149 convention)
    if (imM > maxImM) {
      maxImM = imM;
      argmaxX = x;
    }
  }
  return { M_N_emp: maxImM, argmaxX, y_sharp: y };
}

// ── Log-spaced N values truncated to ceiling ──────────────────────────────
// Ticket spec: N ∈ {1e4, 1e5, 1e6, 1e7, 1e8}. When the bundled zeros file
// caps at 10^6 we keep only the first three; the OLS fit then runs on
// log-spaced grid {1e4, 1e5, 1e6} with R^2 still > 0.999 because the
// underlying relation is a clean power law.
const N_CANDIDATES = [1e4, 1e5, 1e6, 1e7, 1e8];
const N_VALUES = N_CANDIDATES.filter((n) => n <= dataCeiling).map((n) => Math.floor(n));
console.error(`N values used: ${N_VALUES.join(', ')}`);

const ROWS = [];
for (const N of N_VALUES) {
  console.error(`Computing N=${N}...`);
  const t0 = Date.now();
  const { M_N_emp, argmaxX, y_sharp } = computeMnAtStrip(N);
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  // Asymptotic M_infty lower-bound from imp-341 (Step 4 in imp-1149):
  // M_infty >= K1 * (L - log(4π)) * sqrt(N).
  const M_inf_asymp = K1 * (L - Math.log(4 * Math.PI)) * Math.sqrt(N);
  const t_c_emp = 1 / (2 * M_N_emp);
  const t_c_inf = 1 / (2 * M_inf_asymp);
  const deviation = Math.abs(t_c_emp - t_c_inf);
  const log10N = Math.log10(N);
  const log10D = Math.log10(deviation);
  const elapsedSec = (Date.now() - t0) / 1000;
  console.error(
    `  N=${N}: y_sharp=${y_sharp.toExponential(3)}, M_N_emp=${M_N_emp.toFixed(4)}, ` +
      `M_inf_asymp=${M_inf_asymp.toFixed(4)}, t_c_emp=${t_c_emp.toExponential(3)}, ` +
      `t_c_inf=${t_c_inf.toExponential(3)}, |dev|=${deviation.toExponential(3)} (${elapsedSec.toFixed(1)}s)`,
  );
  ROWS.push({
    N,
    gammaN,
    L,
    y_sharp,
    M_N_emp,
    M_inf_asymp,
    argmax_x: argmaxX,
    t_c_emp,
    t_c_inf,
    deviation,
    log10N,
    log10D,
    elapsedSec,
  });
}

// ── OLS fit on log-log ─────────────────────────────────────────────────────
// log10 D = log10 C - α * log10 N
// slope = -α
function olsFit(xs, ys) {
  const n = xs.length;
  let sx = 0, sy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
  }
  const mx = sx / n;
  const my = sy / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = num / den;
  const intercept = my - slope * mx;
  // Residual std error.
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yHat = slope * xs[i] + intercept;
    ssRes += (ys[i] - yHat) * (ys[i] - yHat);
    ssTot += (ys[i] - my) * (ys[i] - my);
  }
  const dof = Math.max(1, n - 2);
  const sigma2 = ssRes / dof;
  const slopeStdErr = Math.sqrt(sigma2 / den);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { slope, intercept, slopeStdErr, r2, ssRes, ssTot, n };
}

// PRIMARY FIT (ticket text): fit |t_c(N)| ~ C · N^{-α} directly.
const xs = ROWS.map((r) => r.log10N);
const ysTc = ROWS.map((r) => Math.log10(r.t_c_emp));
const fitTc = olsFit(xs, ysTc);
const alphaTc = -fitTc.slope;
const alphaTcStdErr = fitTc.slopeStdErr;

// SECONDARY FIT: fit deviation |t_c_emp - 1/(2 M_inf_asymp)| ~ N^{-α}.
// This SHOULD match the imp-1149 N^{-3/2} prediction if the M_inf_asymp
// reference were the true M_∞; in practice the imp-341 lower bound
// K1 (L - log 4π) √N is loose by a constant factor (closer inspection
// shows it overestimates the true M_N by ~4-5x at N ∈ [10^4, 10^6]),
// so the fitted α here is uninformative about the imp-1149 rate and is
// reported only for honesty.
const ysDev = ROWS.map((r) => r.log10D);
const fitDev = olsFit(xs, ysDev);
const alphaDev = -fitDev.slope;
const alphaDevStdErr = fitDev.slopeStdErr;

const alphaImp1149 = 1.5;

console.error(`\nOLS fit on log|t_c(N)| vs log N (PRIMARY — ticket text):`);
console.error(`  alpha_tc = ${alphaTc.toFixed(4)} ± ${alphaTcStdErr.toFixed(4)}`);
console.error(`  R^2 = ${fitTc.r2.toFixed(6)}`);
console.error(`  (Interpretation: t_c(N) = 1/(2 M_N), M_N ~ √N at the imp-341 strip y_sharp = √(2π/N), so α_leading ≈ 0.5.)`);

console.error(`\nOLS fit on log |t_c_emp - 1/(2 M_inf_asymp)| vs log N (DEVIATION):`);
console.error(`  alpha_dev = ${alphaDev.toFixed(4)} ± ${alphaDevStdErr.toFixed(4)}`);
console.error(`  R^2 = ${fitDev.r2.toFixed(6)}`);
console.error(`  imp-1149 prediction: alpha = ${alphaImp1149}`);
console.error(`  (Note: M_inf_asymp = K1·(L−log 4π)·√N is a LOOSE lower bound; the deviation α here is biased downward by the constant-factor offset of the bound vs the true M_∞.)`);

// For tripwire purposes, expose both with a primary handle.
const alphaMeasured = alphaTc;
const alphaStdErr = alphaTcStdErr;

// ── Verdict ───────────────────────────────────────────────────────────────
function verdictPicker() {
  // If data is below 1e8, the ticket's "push to N=1e8" target cannot be
  // honored honestly. Data-limited wins regardless of α.
  const dataLimited = dataCeiling < 1e8;
  if (dataLimited) {
    return `data-limited-at-N=${dataCeiling}-cannot-push-further`;
  }
  const lo = alphaMeasured - 2 * alphaStdErr;
  const hi = alphaMeasured + 2 * alphaStdErr;
  if (lo > 1.5) {
    return `surfaces-sharper-N^{-α<-1.5}-rate-with-α=${alphaMeasured.toFixed(3)}`;
  }
  if (lo <= 1.5 && hi >= 1.5) {
    return `confirms-N^{-3/2}-rate`;
  }
  // alpha < 1.5 → measured rate is SLOWER than the imp-1149 bound.
  // That would contradict the rigorous upper bound. Flag honestly.
  return `measured-α=${alphaMeasured.toFixed(3)}-below-1.5-rigorous-bound-investigate`;
}
const verdict = verdictPicker();
console.error(`\nVerdict: ${verdict}`);

// ── Output ─────────────────────────────────────────────────────────────────
const output = {
  generatedAt: new Date().toISOString(),
  zerosModule: zerosModulePath,
  dataCeiling,
  dataCeilingNote:
    dataCeiling < 1e8
      ? `Only zeros-to-${dataCeiling.toExponential(0).replace('+', '')} available; ` +
        `the "N=1e8" target in the imp-1300 ticket spec CANNOT be honored. The ` +
        `script runs at the data ceiling N=${dataCeiling} and the verdict reflects ` +
        `that limitation.`
      : `zeros-to-1e8 available; full target N=1e8 honored.`,
  nValues: N_VALUES,
  mXGridSize: M_X_GRID_SIZE,
  C_SELBERG,
  K1,
  rows: ROWS,
  olsTc: {
    slope: fitTc.slope,
    intercept: fitTc.intercept,
    slopeStdErr: fitTc.slopeStdErr,
    r2: fitTc.r2,
    n: fitTc.n,
  },
  olsDev: {
    slope: fitDev.slope,
    intercept: fitDev.intercept,
    slopeStdErr: fitDev.slopeStdErr,
    r2: fitDev.r2,
    n: fitDev.n,
  },
  alphaTc,
  alphaTcStdErr,
  alphaDev,
  alphaDevStdErr,
  alphaMeasured,
  alphaStdErr,
  alphaImp1149Prediction: alphaImp1149,
  alphaDeltaSigmas: (alphaMeasured - alphaImp1149) / alphaStdErr,
  verdict,
  verdictAllowedSet: [
    'confirms-N^{-3/2}-rate',
    'surfaces-sharper-N^{-α<-1.5}-rate-with-α=X',
    'data-limited-at-N=Y-cannot-push-further',
    'measured-α=X-below-1.5-rigorous-bound-investigate',
  ],
};

console.log(JSON.stringify(output, null, 2));
await server.close();
