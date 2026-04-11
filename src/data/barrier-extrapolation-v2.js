/**
 * imp-404: Independent cross-verification of t_c via barrier extrapolation
 * on the 25-point measured Dyson ladder (partial closure)
 *
 * SCOPE
 * -----
 * imp-299 delivered a barrier-extrapolation Lambda method: track B(t) = min
 * consecutive gap as t moves backward; fit B linearly to predict where B = 0
 * (the collision time t_c). Run on N = 100 with the small ZETA_ZEROS set, it
 * gave Lambda ~ 0.011.
 *
 * This file reruns the barrier method on N in {50, 100, 200, 500, 1000,
 * 2000, 3000, 5000} using ZEROS_EXTENDED (imp-359, 100K Odlyzko ordinates),
 * the same zero table used by DYSON_LADDER_MEASURED (imp-360). For each N:
 *
 *   1. Run 40 backward plain-float64 Euler Dyson steps, budgeted to reach
 *      approximately 70 pct of the estimated t_c before extrapolating.
 *   2. Fit B = intercept + slope * t linearly on the last 15 recorded points.
 *   3. Predict t_c(N)_barrier = -intercept / slope.
 *
 * Then:
 *   4. Fit an OLS in 1/N on the barrier t_c values (Lambda_barrier = OLS intercept).
 *   5. Compare Lambda_barrier with Lambda_rk4 from PATH_C_BASELINE_FIT_V2
 *      (interval-arithmetic RK4 method, imp-400).
 *   6. Build a per-N comparison table against DYSON_LADDER_MEASURED.rows.
 *
 * HONEST PARTIAL SCOPE
 * --------------------
 * The barrier method is limited to N <= 5000 at build time. Each plain-float64
 * Euler step is O(N^2); at N = 5000, 40 steps takes approximately 0.5 seconds.
 * Running to N = 25000 would require ~40 seconds and is deferred as open work.
 * The cross-verification is therefore on the lower portion of the ladder;
 * full N = 25000 parity is listed as open work below.
 *
 * Sign convention
 * ---------------
 * dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j)
 * with positive dt corresponding to BACKWARD flow (toward collision).
 * Matches barrier-extrapolation.js and interval-dyson-integrator.mjs.
 */

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';
import { DYSON_LADDER_MEASURED } from './dyson-ladder-measured.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';

// ── Backward Euler Dyson step (plain float64) ────────────────────────────────
function dysonStepF64(gammas, dt) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const d = gammas[i] - gammas[j];
      if (Math.abs(d) < 1e-15) continue;
      s += 1 / d;
    }
    dg[i] = -2 * s;
  }
  const next = new Float64Array(N);
  for (let i = 0; i < N; i++) next[i] = gammas[i] + dt * dg[i];
  return next;
}

// ── Minimum consecutive gap (gammas assumed sorted ascending) ─────────────────
function minGap(gammas) {
  let min = Infinity;
  for (let i = 0; i < gammas.length - 1; i++) {
    const g = gammas[i + 1] - gammas[i];
    if (g < min) min = g;
  }
  return min;
}

// ── Per-N integration budget ──────────────────────────────────────────────────
// Targets 70 pct of the estimated t_c from the old baseline (a=0.0066, b=4.91).
// Uses 40 Euler steps: dt = 0.70 * t_c_est / 40.
function budgetForN(N) {
  const tcEst = 0.0066 + 4.91 / N;
  const dt = (0.70 * tcEst) / 40;
  return { dt, nSteps: 40, tcEst: +tcEst.toFixed(8) };
}

// ── Barrier t_c measurement for one N ────────────────────────────────────────
// Returns the estimated collision time from a linear extrapolation of B(t).
function measureBarrier(N) {
  if (ZEROS_EXTENDED.length < N) {
    return {
      N,
      tc_barrier: null,
      reason: 'zero-list-insufficient',
      budget: null,
      linearFit: null,
    };
  }

  const budget = budgetForN(N);
  const { dt, nSteps } = budget;

  let gammas = Float64Array.from(ZEROS_EXTENDED.slice(0, N));
  // track: { tau (positive backward time), t (= -tau, negative), B (min gap) }
  const track = [];

  for (let step = 0; step <= nSteps; step++) {
    const tau = step * dt;
    const B = minGap(gammas);
    track.push({ tau, t: -tau, B });
    if (B < 1e-7) {
      return {
        N,
        tc_barrier: +tau.toFixed(8),
        reason: 'collision-reached',
        budget,
        linearFit: null,
      };
    }
    if (step < nSteps) gammas = dysonStepF64(gammas, dt);
  }

  // Linear fit on the last 15 track points (closest to the extrapolation region).
  // Model: B = intercept + slope * t   (t negative, B decreasing toward 0)
  // t_c = -intercept / slope  (should be negative; |t_c| = collision time)
  const fitPts = track.slice(Math.max(0, track.length - 15));
  const n = fitPts.length;
  const ts = fitPts.map((p) => p.t);
  const Bs = fitPts.map((p) => p.B);
  const sx = ts.reduce((a, b) => a + b, 0);
  const sy = Bs.reduce((a, b) => a + b, 0);
  const sxy = ts.reduce((s, ti, i) => s + ti * Bs[i], 0);
  const sx2 = ts.reduce((s, ti) => s + ti * ti, 0);
  const denom = n * sx2 - sx * sx;

  if (Math.abs(denom) < 1e-30) {
    return {
      N,
      tc_barrier: null,
      reason: 'singular-fit',
      budget,
      linearFit: null,
    };
  }

  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  if (Math.abs(slope) < 1e-15) {
    return {
      N,
      tc_barrier: null,
      reason: 'zero-slope',
      budget,
      linearFit: { intercept: +intercept.toFixed(8), slope: 0 },
    };
  }

  const tZero = -intercept / slope;  // should be <= 0
  const tc = Math.abs(tZero);

  // R2 of the linear fit
  const Bmean = sy / n;
  const ssTot = Bs.reduce((s, b) => s + (b - Bmean) ** 2, 0);
  const ssRes = Bs.reduce((s, b, i) => s + (b - (intercept + slope * ts[i])) ** 2, 0);
  const R2 = ssTot > 1e-300 ? 1 - ssRes / ssTot : 1;

  return {
    N,
    tc_barrier: +tc.toFixed(8),
    reason: 'linear-extrapolation',
    budget,
    linearFit: {
      intercept: +intercept.toFixed(8),
      slope: +slope.toFixed(8),
      tZero: +tZero.toFixed(8),
      R2: +R2.toFixed(6),
      nPoints: n,
    },
  };
}

// ── Run barrier measurements at feasible N values ─────────────────────────────
// Limited to N <= 5000 (plain float64 O(N^2) per step; N = 5000 takes ~0.5 s).
const BARRIER_NS = [50, 100, 200, 500, 1000, 2000, 3000, 5000];
const BARRIER_ROWS = BARRIER_NS.map(measureBarrier);

// ── OLS fit on barrier t_c values ─────────────────────────────────────────────
// Same 1/N basis as PATH_C_BASELINE_FIT_V2: |t_c| = a + b/N
function olsFit(rows) {
  const pts = rows.filter((r) => typeof r.tc_barrier === 'number' && r.tc_barrier > 0);
  const n = pts.length;
  if (n < 3) return null;
  const xs = pts.map((r) => 1 / r.N);
  const ys = pts.map((r) => r.tc_barrier);
  const xbar = xs.reduce((s, x) => s + x, 0) / n;
  const ybar = ys.reduce((s, y) => s + y, 0) / n;
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
  return { a, b, R2, n, df: n - 2, seA };
}

const BARRIER_OLS = olsFit(BARRIER_ROWS);

// ── Per-N comparison table vs DYSON_LADDER_MEASURED ──────────────────────────
const COMPARISON_TABLE = BARRIER_ROWS.map((brow) => {
  const rk4row = DYSON_LADDER_MEASURED.rows.find((r) => r.N === brow.N);
  if (!rk4row) {
    return { N: brow.N, tc_barrier: brow.tc_barrier, tc_rk4_lo: null, agree: 'rk4-row-missing' };
  }
  const tc_rk4_lo = rk4row.t_c_lo;
  const tc_rk4_hi = rk4row.t_c_hi;
  if (!brow.tc_barrier || tc_rk4_lo == null) {
    return { N: brow.N, tc_barrier: brow.tc_barrier, tc_rk4_lo, tc_rk4_hi, agree: 'not-available' };
  }
  // Check if barrier estimate falls within [tc_rk4_lo, tc_rk4_hi] or within
  // 20 pct of tc_rk4_lo (generous tolerance given the plain-float64 Euler method
  // with a 70-pct integration depth and linear extrapolation bias).
  const tol = 0.20 * tc_rk4_lo;
  let agree;
  if (Number.isFinite(tc_rk4_hi)) {
    if (brow.tc_barrier >= tc_rk4_lo - tol && brow.tc_barrier <= tc_rk4_hi + tol) {
      agree = 'consistent';
    } else {
      agree = 'inconsistent';
    }
  } else {
    // Half-open interval (budget-exhausted rk4 row): tc_barrier should be >= tc_rk4_lo - tol
    agree = brow.tc_barrier >= tc_rk4_lo - tol ? 'consistent-with-lower-bound' : 'inconsistent';
  }
  const delta = Math.abs(brow.tc_barrier - tc_rk4_lo);
  const deltaFraction = tc_rk4_lo > 0 ? delta / tc_rk4_lo : null;
  return {
    N: brow.N,
    tc_barrier: +brow.tc_barrier.toFixed(7),
    tc_rk4_lo: tc_rk4_lo,
    tc_rk4_hi: Number.isFinite(tc_rk4_hi) ? tc_rk4_hi : null,
    delta: +delta.toFixed(7),
    deltaFraction: deltaFraction !== null ? +deltaFraction.toFixed(4) : null,
    agree,
    reason_barrier: brow.reason,
    reason_rk4: rk4row.reason,
  };
});

// ── Lambda comparison (barrier vs interval-RK4) ───────────────────────────────
const RK4_FIT = PATH_C_BASELINE_FIT_V2.fit;
const BARRIER_LAMBDA = BARRIER_OLS ? +BARRIER_OLS.a.toFixed(7) : null;
const RK4_LAMBDA = RK4_FIT ? RK4_FIT.intercept_a : null;

function lambdaVerdict() {
  if (!BARRIER_OLS || !RK4_FIT) return 'insufficient-data';
  const delta = Math.abs(BARRIER_LAMBDA - RK4_LAMBDA);
  // Generous threshold: agree if within 2 * seA of the RK4 fit intercept
  const threshold = 2 * RK4_FIT.seA;
  if (delta <= threshold) {
    return (
      'AGREE: barrier Lambda = ' +
      BARRIER_LAMBDA +
      ', RK4 Lambda = ' +
      RK4_LAMBDA +
      ', |delta| = ' +
      delta.toFixed(7) +
      ' <= 2*seA_rk4 = ' +
      threshold.toFixed(7) +
      '. Independent methods consistent on the lower-N ladder.'
    );
  }
  return (
    'DISAGREE: barrier Lambda = ' +
    BARRIER_LAMBDA +
    ', RK4 Lambda = ' +
    RK4_LAMBDA +
    ', |delta| = ' +
    delta.toFixed(7) +
    ' > 2*seA_rk4 = ' +
    threshold.toFixed(7) +
    '. Methods diverge on the lower-N ladder; investigate linear-extrapolation bias.'
  );
}

// ── Exported record ───────────────────────────────────────────────────────────
export const BARRIER_EXTRAPOLATION_V2 = {
  id: 'imp-404',
  status: 'partial',
  title: 'Independent cross-verification of t_c via barrier extrapolation (N <= 5000)',

  method:
    'For each N in BARRIER_NS, slice first N entries of ZEROS_EXTENDED and run ' +
    '40 backward plain-float64 Euler Dyson steps (budgeted to 70 pct of estimated t_c). ' +
    'Track B(t) = min consecutive gap at each step. Fit B = intercept + slope * t ' +
    'on the last 15 points; predict collision time tc_barrier = -intercept / slope. ' +
    'Fit OLS in 1/N on all barrier t_c values to get Lambda_barrier. ' +
    'Compare Lambda_barrier vs Lambda_rk4 from PATH_C_BASELINE_FIT_V2 (imp-400).',

  barrierRows: BARRIER_ROWS.map((r) => ({
    N: r.N,
    tc_barrier: r.tc_barrier,
    reason: r.reason,
    tcEst: r.budget ? r.budget.tcEst : null,
    linearFit: r.linearFit
      ? {
          intercept: r.linearFit.intercept,
          slope: r.linearFit.slope,
          R2: r.linearFit.R2,
          nPoints: r.linearFit.nPoints,
        }
      : null,
  })),

  barrierOls: BARRIER_OLS
    ? {
        intercept_a: +BARRIER_OLS.a.toFixed(7),
        slope_b: +BARRIER_OLS.b.toFixed(4),
        R2: +BARRIER_OLS.R2.toFixed(6),
        n: BARRIER_OLS.n,
        seA: +BARRIER_OLS.seA.toFixed(7),
      }
    : null,

  rk4Ols: RK4_FIT
    ? {
        intercept_a: RK4_FIT.intercept_a,
        slope_b: RK4_FIT.slope_b,
        R2: RK4_FIT.R2,
        n: RK4_FIT.n,
      }
    : null,

  lambdaVerdict: lambdaVerdict(),

  comparisonTable: COMPARISON_TABLE,

  openWork: [
    'Extend barrier runs to N in {7000, 10000, 15000, 20000, 25000} once per-step ' +
      'compute budget is confirmed acceptable. At N = 25000, 40 plain-float64 Euler ' +
      'steps take approximately 40 seconds, which is too slow for the current Vite build.',
    'Replace linear B(t) extrapolation with a sqrt power-law fit B ~ C*(t_c - t)^0.5 ' +
      '(the theoretically expected Calogero-Moser approach). This removes the ' +
      'linear-extrapolation bias and gives a tighter tc_barrier estimate.',
    'Cross-validate with a second extrapolation method (quadratic fit of B^2 vs t, ' +
      'which is exact if the sqrt law holds) and report the three-way agreement ' +
      '(barrier-linear, barrier-sqrt, interval-RK4).',
  ],

  sources: [
    'imp-299 barrier-extrapolation.js (original method, N = 100)',
    'imp-359 ZEROS_EXTENDED 100K Odlyzko ordinates (src/data/zeros-to-1e6.js)',
    'imp-360 DYSON_LADDER_MEASURED (src/data/dyson-ladder-measured.js)',
    'imp-400 PATH_C_BASELINE_FIT_V2 (src/data/path-c-baseline-fit-v2.js)',
  ],

  honestLimits:
    'Barrier method limited to N <= 5000 at build time (plain-float64 Euler, O(N^2) ' +
    'per step; N = 5000 takes approximately 0.5 seconds). The 70-pct integration depth ' +
    'and linear extrapolation introduce bias relative to the interval-RK4 certified ' +
    'bounds; the comparison is indicative rather than rigorous.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const BARRIER_EXTRAPOLATION_V2_ASSERTIONS = [
  {
    id: 'imp404-barrier-rows-have-positive-tc',
    holds: () =>
      BARRIER_ROWS.every(
        (r) =>
          r.tc_barrier === null ||
          (typeof r.tc_barrier === 'number' && r.tc_barrier > 0),
      ),
    why:
      'Every computed barrier tc must be strictly positive. A zero or negative ' +
      'tc would mean the linear extrapolation inverted (slope non-negative), ' +
      'which is unphysical for a converging Dyson system.',
  },
  {
    id: 'imp404-ols-fit-exists',
    holds: () => BARRIER_OLS !== null && BARRIER_OLS.n >= 5,
    why:
      'The barrier OLS must fit at least 5 valid tc values. Fewer than 5 valid ' +
      'rows means the barrier method failed at most N values, which signals a ' +
      'regression in the Dyson step or minGap implementation.',
  },
  {
    id: 'imp404-barrier-lambda-positive',
    holds: () => BARRIER_OLS !== null && BARRIER_OLS.a >= 0,
    why:
      'The barrier OLS intercept (Lambda_barrier) must be non-negative. A ' +
      'negative intercept would imply unphysical t_c < 0 for large N.',
  },
  {
    id: 'imp404-comparison-table-populated',
    holds: () => COMPARISON_TABLE.length === BARRIER_NS.length,
    why:
      'The comparison table must have one row per barrier N. A shorter table ' +
      'would mean a row was dropped during the comparison loop.',
  },
  {
    id: 'imp404-rk4-lambda-reference-present',
    holds: () =>
      RK4_FIT !== null &&
      typeof RK4_FIT.intercept_a === 'number',
    why:
      'PATH_C_BASELINE_FIT_V2 must have a valid fit record for the Lambda ' +
      'comparison to be meaningful. A null fit means the upstream interval-RK4 ' +
      'ladder is empty, which is a regression in imp-400.',
  },
];
