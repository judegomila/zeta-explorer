/**
 * imp-400: Refit 1/N OLS on the measured Dyson backward-collision ladder
 *
 * Background
 * ----------
 * The old PATH_C_BASELINE_FIT in src/math/dyson-scaling-N5000.js (imp-315)
 * was fit on five Euler-integrator baseline points at N in {50, 100, 200, 500,
 * 2458}. The Euler integrator overshoots the first-collision singularity at
 * small N (imp353c_baseline_dt_overshoot): at N = 50 it reports t_c = 0.1435
 * while the RK4-correct first-collision time is approximately 0.0958 (33 pct
 * lower). This upward bias propagates into the intercept and any downstream
 * Lambda bound that reads PATH_C_BASELINE_FIT.
 *
 * What this file delivers
 * -----------------------
 * A refitted OLS using the measured Dyson ladder from imp-360 (up to N = 25000
 * via the imp-362 interval-arithmetic backward RK4 integrator on the imp-359
 * Odlyzko 100K-zero table). Each measured row carries a certified lower bound
 * t_c_lo on |t_c(N)|. For rows where t_c_hi is also finite we use the
 * midpoint (t_c_lo + t_c_hi) / 2 as the point estimate; for budget-exhausted
 * rows (t_c_hi = +Infinity) we fall back to t_c_lo.
 *
 * Export surface
 * --------------
 *   PATH_C_BASELINE_FIT_V2        -- the updated fit record (drop-in shadow
 *                                    for PATH_C_BASELINE_FIT consumers)
 *   PATH_C_BASELINE_FIT_V2_ASSERTIONS -- build-time sanity checks
 *
 * Backward-compatibility note
 * ---------------------------
 * PATH_C_BASELINE_FIT in dyson-scaling-N5000.js is NOT replaced by this file.
 * It is kept intact so the import chains that depend on it (lambda-intercept-
 * confidence.js, lambda-intercept-analytic.js, dyson-ladder-measured.js) are
 * unaffected. Downstream consumers should migrate to PATH_C_BASELINE_FIT_V2
 * progressively once they confirm the new fit matches their expectations.
 */

import { DYSON_LADDER_MEASURED } from './dyson-ladder-measured.js';

// ── Point-estimate extraction ────────────────────────────────────────────────
// For each measured row in the ladder:
//   - Use midpoint (t_c_lo + t_c_hi) / 2 when both endpoints are finite.
//   - Fall back to t_c_lo when t_c_hi is +Infinity (budget-exhausted row).
// This is a certified lower bound in the fallback case; the midpoint is the
// best available unbiased estimate when the interval closed.
const MEASURED_FIT_POINTS = DYSON_LADDER_MEASURED.rows
  .filter((r) => r.source === 'measured' && typeof r.t_c_lo === 'number' && r.t_c_lo > 0)
  .map((r) => ({
    N: r.N,
    tc: Number.isFinite(r.t_c_hi) ? (r.t_c_lo + r.t_c_hi) / 2 : r.t_c_lo,
    t_c_lo: r.t_c_lo,
    t_c_hi: r.t_c_hi,
    pointEstimateMethod: Number.isFinite(r.t_c_hi) ? 'midpoint' : 'lower-bound-only',
  }));

// ── OLS in x = 1/N basis: fit |t_c| = a + b/N ──────────────────────────────
function olsFit(points) {
  const n = points.length;
  if (n < 3) return null;
  const xs = points.map((p) => 1 / p.N);
  const ys = points.map((p) => p.tc);
  const sx = xs.reduce((s, x) => s + x, 0);
  const sy = ys.reduce((s, y) => s + y, 0);
  const xbar = sx / n;
  const ybar = sy / n;
  const Sxx = xs.reduce((s, x) => s + (x - xbar) ** 2, 0);
  const Sxy = xs.reduce((s, x, i) => s + (x - xbar) * (ys[i] - ybar), 0);
  const b = Sxy / Sxx;
  const a = ybar - b * xbar;
  const ssRes = ys.reduce((s, y, i) => s + (y - (a + b * xs[i])) ** 2, 0);
  const ssTot = ys.reduce((s, y) => s + (y - ybar) ** 2, 0);
  const R2 = ssTot > 1e-300 ? 1 - ssRes / ssTot : 1;
  const sigma2 = n > 2 ? ssRes / (n - 2) : 0;
  const varA = Sxx > 1e-300 ? sigma2 * (1 / n + xbar ** 2 / Sxx) : 0;
  const seA = Math.sqrt(varA);
  return { a, b, R2, n, df: n - 2, sigma2, seA };
}

// ── Student-t critical values for one-sided 95% CI (t_{0.95, df}) ───────────
// Hard-coded from standard t-tables to avoid shipping a full quantile
// routine for a single use site.
const T_CRIT_TABLE = [
  [3, 2.353], [5, 2.015], [7, 1.895], [10, 1.812],
  [15, 1.753], [20, 1.725], [23, 1.714], [25, 1.708],
  [28, 1.701], [30, 1.697], [40, 1.684], [60, 1.671],
];

function tCritOneSided95(df) {
  for (let i = T_CRIT_TABLE.length - 1; i >= 0; i--) {
    if (df >= T_CRIT_TABLE[i][0]) return T_CRIT_TABLE[i][1];
  }
  return T_CRIT_TABLE[0][1]; // df=3 floor
}

// ── Compute the fit ──────────────────────────────────────────────────────────
const V2_FIT = olsFit(MEASURED_FIT_POINTS);
const V2_T95 = V2_FIT ? tCritOneSided95(V2_FIT.df) : null;
const V2_UPPER_CL = V2_FIT ? V2_FIT.a + V2_T95 * V2_FIT.seA : null;
const V2_LOWER_CL = V2_FIT ? V2_FIT.a - V2_T95 * V2_FIT.seA : null;

// Reference: old 5-point Euler-baseline fit (imp-309 / imp-315).
const OLD_BASELINE = { a: 0.0066, b: 4.91, R2: 0.943, n: 5 };

// ── Exported record ──────────────────────────────────────────────────────────
export const PATH_C_BASELINE_FIT_V2 = {
  id: 'imp-400',
  status: 'delivered',
  title: 'Refit 1/N OLS on the measured Dyson backward-collision ladder (imp-360)',

  points: MEASURED_FIT_POINTS,

  fit: V2_FIT
    ? {
        intercept_a:         +V2_FIT.a.toFixed(7),
        slope_b:             +V2_FIT.b.toFixed(4),
        R2:                  +V2_FIT.R2.toFixed(6),
        n:                   V2_FIT.n,
        df:                  V2_FIT.df,
        seA:                 +V2_FIT.seA.toFixed(7),
        tCrit_onesided_95:   V2_T95,
        interceptUpperCL_95: V2_UPPER_CL !== null ? +V2_UPPER_CL.toFixed(7) : null,
        interceptLowerCL_95: V2_LOWER_CL !== null ? +V2_LOWER_CL.toFixed(7) : null,
      }
    : null,

  oldBaseline: OLD_BASELINE,

  deltaVsOld: V2_FIT
    ? {
        delta_a: +(V2_FIT.a - OLD_BASELINE.a).toFixed(7),
        delta_b: +(V2_FIT.b - OLD_BASELINE.b).toFixed(4),
        delta_R2: +(V2_FIT.R2 - OLD_BASELINE.R2).toFixed(6),
      }
    : null,

  b2aVerdict: V2_FIT
    ? (V2_UPPER_CL <= 0
        ? 'B2(a) CLOSED at one-sided 95 pct: a_upper(95%) = ' +
            V2_UPPER_CL.toFixed(7) +
            ' is <= 0 — the measured ladder data establishes Lambda <= 0 at the controlled height under the monotonicity hypothesis.'
        : 'B2(a) OPEN: a_upper(95%) = ' +
            V2_UPPER_CL.toFixed(7) +
            ' > 0. Intercept statistically consistent with Lambda = 0 but not yet proven. Angle (b) (analytic bound on a from the Dyson ODE) remains the only theorem-grade path to closure.')
    : 'insufficient data for fit',

  method:
    'OLS on |t_c| = a + b/N using measured rows from DYSON_LADDER_MEASURED (imp-360). ' +
    'Point estimate = midpoint (t_c_lo + t_c_hi) / 2 when both endpoints are finite; ' +
    'falls back to t_c_lo (certified lower bound) for budget-exhausted rows. ' +
    'Confidence interval uses one-sided Student-t at df = n - 2.',

  sources: [
    'imp-360 DYSON_LADDER_MEASURED (src/data/dyson-ladder-measured.js)',
    'imp-362 backwardCollisionInterval (src/math/interval-dyson-integrator.mjs)',
    'imp-359 ZEROS_EXTENDED 100K Odlyzko ordinates (src/data/zeros-to-1e6.js)',
  ],

  upstreamNote:
    'PATH_C_BASELINE_FIT in src/math/dyson-scaling-N5000.js is NOT modified. ' +
    'It remains the source of truth for lambda-intercept-confidence.js, ' +
    'lambda-intercept-analytic.js, and dyson-ladder-measured.js. Migrate ' +
    'downstream consumers to PATH_C_BASELINE_FIT_V2 progressively.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const PATH_C_BASELINE_FIT_V2_ASSERTIONS = [
  {
    id: 'imp400-fit-has-enough-points',
    holds: () => V2_FIT !== null && V2_FIT.n >= 20,
    why:
      'The v2 fit should span at least 20 measured points. A count below 20 ' +
      'would mean the interval integrator failed to produce valid t_c_lo for ' +
      'most of the ladder, which is a regression in imp-360.',
  },
  {
    id: 'imp400-fit-r2-above-threshold',
    holds: () => V2_FIT !== null && V2_FIT.R2 >= 0.95,
    why:
      'The 1/N linear model should fit the measured data with R-squared >= 0.95. ' +
      'The old 5-point Euler baseline had R-squared = 0.943; with 5x more points ' +
      'spanning more decades the v2 fit should be tighter, not worse.',
  },
  {
    id: 'imp400-intercept-positive',
    holds: () => V2_FIT !== null && V2_FIT.a >= 0,
    why:
      'The OLS intercept must be non-negative. A negative intercept would mean ' +
      'the fit is extrapolating |t_c| < 0, which is unphysical and signals a ' +
      'regression in the measured data or the fit implementation.',
  },
  {
    id: 'imp400-slope-positive',
    holds: () => V2_FIT !== null && V2_FIT.b > 0,
    why:
      'The slope b in |t_c| = a + b/N must be positive (collision time decreases ' +
      'with N). A non-positive slope would mean the fit is inverted, which is ' +
      'unphysical.',
  },
  {
    id: 'imp400-v2-r2-beats-old-baseline',
    holds: () => V2_FIT !== null && V2_FIT.R2 >= OLD_BASELINE.R2,
    why:
      'The v2 fit on the full measured ladder should have R-squared >= the old ' +
      '5-point Euler baseline (0.943). More data spanning more decades should ' +
      'not degrade the fit quality.',
  },
  {
    id: 'imp400-upper-cl-matches-fit',
    holds: () =>
      V2_FIT !== null &&
      V2_UPPER_CL !== null &&
      V2_UPPER_CL > V2_FIT.a - 1e-10 &&
      V2_UPPER_CL < V2_FIT.a + 10 * V2_FIT.seA,
    why:
      'The one-sided 95% upper confidence limit must be strictly above the point ' +
      'estimate a and within a reasonable multiple of seA. A value outside that ' +
      'range signals a bug in the t-critical lookup or CI formula.',
  },
  {
    id: 'imp400-points-count-equals-fit-n',
    holds: () => V2_FIT !== null && V2_FIT.n === MEASURED_FIT_POINTS.length,
    why:
      'The number of points fed to olsFit must equal the length of MEASURED_FIT_POINTS. ' +
      'A mismatch would mean the fit was computed on a different slice than the ' +
      'exported points array.',
  },
];
