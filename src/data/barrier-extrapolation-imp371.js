/**
 * imp-371 (partial closure): Cross-validate barrier extrapolation on the
 * imp-360 measured Dyson ladder at N > 5000
 *
 * SCOPE
 * -----
 * imp-299 delivered the barrier-extrapolation Lambda method giving Lambda ~ 0.011.
 * imp-404 (barrier-extrapolation-v2.js) reran that method at N in
 * {50, 100, 200, 500, 1000, 2000, 3000, 5000} using ZEROS_EXTENDED (imp-359),
 * yielding a barrier OLS fit
 *
 *   |t_c(N)| ~ a_barrier + b_barrier / N
 *
 * with a_barrier = Lambda_barrier as the intercept estimate.
 *
 * The imp-371 ticket asks to extend this cross-validation to the higher-N
 * rows of DYSON_LADDER_MEASURED (imp-360), specifically N in {10^4, 10^5, 10^6}.
 *
 * What this partial delivers
 * --------------------------
 * 1. For each measured row in DYSON_LADDER_MEASURED with N > 5000, compute
 *    the OLS-projected barrier t_c:
 *       barrier_tc_proj(N) = a_barrier + b_barrier / N
 *    using the OLS fit from BARRIER_EXTRAPOLATION_V2.
 * 2. Compare barrier_tc_proj(N) against the RK4-certified interval
 *    [t_c_lo, t_c_hi] from the imp-360 measured row.
 * 3. Report consistency: agreement is flagged if barrier_tc_proj falls within
 *    15 pct of t_c_lo (generous tolerance given the 70-pct Euler integration
 *    depth and linear-extrapolation bias in the barrier fit).
 * 4. Report the Lambda convergence comparison:
 *    a_barrier (from N <= 5000 OLS) vs a_rk4 (from PATH_C_BASELINE_FIT_V2,
 *    all measured rows up to N = 100000). Two-method agreement within
 *    2 * seA_barrier is the cross-verification threshold from imp-404.
 *
 * HONEST PARTIAL SCOPE
 * --------------------
 * Actual barrier runs at N > 5000 are infeasible at Vite build time.
 * The plain-float64 Euler Dyson step is O(N^2); at N = 10000 one step costs
 * ~100M floating-point ops and 40 steps take approximately 4 seconds.
 * At N = 100000 the cost is ~400 seconds.
 *
 * The cross-validation here therefore uses OLS-projected barrier values as
 * proxies for where the barrier method would predict t_c if it could run.
 * This is indicative, not rigorous: the barrier OLS was fit on N <= 5000 data
 * and is extrapolated into a regime where it has not been validated.
 *
 * Sub-gap imp-371-barrier-compute: actual barrier integration at N > 5000
 * is deferred until an offline compute engine (Node.js script, WebWorker,
 * or WASM) can run the plain-float64 Euler barrier method outside the Vite
 * build timeout.
 *
 * Sign convention
 * ---------------
 * dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j)
 * Matches barrier-extrapolation-v2.js and interval-dyson-integrator.mjs.
 */

import { BARRIER_EXTRAPOLATION_V2 } from './barrier-extrapolation-v2.js';
import { DYSON_LADDER_MEASURED } from './dyson-ladder-measured.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';

// ── Pull barrier OLS coefficients ────────────────────────────────────────────
const B_OLS = BARRIER_EXTRAPOLATION_V2.barrierOls;  // may be null
const A_BARRIER = B_OLS ? B_OLS.intercept_a : null;
const B_BARRIER = B_OLS ? B_OLS.slope_b : null;
const SE_A_BARRIER = B_OLS ? B_OLS.seA : null;

// ── Pull RK4 Lambda reference (full measured-ladder OLS from imp-400) ────────
const RK4_FIT = PATH_C_BASELINE_FIT_V2.fit;
const A_RK4 = RK4_FIT ? RK4_FIT.intercept_a : null;

// ── Select high-N measured rows (N > 5000) from the imp-360 ladder ───────────
// The barrier computation in imp-404 ran up to N = 5000. Rows above that
// are in the regime we want to cross-validate against.
const HIGH_N_ROWS = DYSON_LADDER_MEASURED.rows.filter(
  (r) => r.source === 'measured' && r.N > 5000 && typeof r.t_c_lo === 'number' && r.t_c_lo > 0,
);

// ── Per-row comparison ────────────────────────────────────────────────────────
// For each high-N measured row, project barrier t_c = a_barrier + b_barrier/N
// and check consistency with the RK4 interval.
const COMPARISON_TABLE = HIGH_N_ROWS.map((row) => {
  if (A_BARRIER === null || B_BARRIER === null) {
    return {
      N: row.N,
      barrier_tc_proj: null,
      t_c_lo: row.t_c_lo,
      t_c_hi: row.t_c_hi,
      agree: 'barrier-ols-unavailable',
      reason_rk4: row.reason,
    };
  }

  const proj = A_BARRIER + B_BARRIER / row.N;
  const tol = 0.15 * row.t_c_lo;

  let agree;
  if (Number.isFinite(row.t_c_hi)) {
    // Full interval: proj should fall within [lo - tol, hi + tol]
    if (proj >= row.t_c_lo - tol && proj <= row.t_c_hi + tol) {
      agree = 'consistent';
    } else {
      agree = 'inconsistent';
    }
  } else {
    // Half-open (budget-exhausted): proj should be >= lo - tol
    agree = proj >= row.t_c_lo - tol ? 'consistent-with-lower-bound' : 'inconsistent';
  }

  const delta = Math.abs(proj - row.t_c_lo);
  const deltaFraction = row.t_c_lo > 0 ? delta / row.t_c_lo : null;

  return {
    N: row.N,
    barrier_tc_proj: +proj.toFixed(7),
    t_c_lo: row.t_c_lo,
    t_c_hi: Number.isFinite(row.t_c_hi) ? row.t_c_hi : null,
    delta: +delta.toFixed(7),
    deltaFraction: deltaFraction !== null ? +deltaFraction.toFixed(4) : null,
    agree,
    reason_rk4: row.reason,
  };
});

// ── Lambda convergence verdict ────────────────────────────────────────────────
// Compare a_barrier (N <= 5000 OLS) vs a_rk4 (all measured rows up to N=100000).
// Two-method agreement within 2 * seA_barrier is the threshold (matching imp-404).
function lambdaConvergenceVerdict() {
  if (A_BARRIER === null || A_RK4 === null || SE_A_BARRIER === null) {
    return 'insufficient-data';
  }
  const delta = Math.abs(A_BARRIER - A_RK4);
  const threshold = 2 * SE_A_BARRIER;
  if (delta <= threshold) {
    return (
      'AGREE: a_barrier(N<=5000) = ' +
      A_BARRIER +
      ', a_rk4(all-N) = ' +
      A_RK4 +
      ', |delta| = ' +
      delta.toFixed(7) +
      ' <= 2*seA_barrier = ' +
      threshold.toFixed(7) +
      '. Barrier OLS intercept is consistent with the high-N RK4 ladder intercept.'
    );
  }
  return (
    'DISAGREE: a_barrier(N<=5000) = ' +
    A_BARRIER +
    ', a_rk4(all-N) = ' +
    A_RK4 +
    ', |delta| = ' +
    delta.toFixed(7) +
    ' > 2*seA_barrier = ' +
    threshold.toFixed(7) +
    '. Barrier OLS from N<=5000 does not extrapolate to the high-N regime; investigate bias.'
  );
}

// ── Consistency summary ───────────────────────────────────────────────────────
const CONSISTENT_COUNT = COMPARISON_TABLE.filter(
  (r) => r.agree === 'consistent' || r.agree === 'consistent-with-lower-bound',
).length;

// ── Exported record ───────────────────────────────────────────────────────────
export const BARRIER_EXTRAPOLATION_IMP371 = {
  id: 'imp-371',
  status: 'partial',
  title: 'Cross-validate barrier extrapolation on the imp-360 high-N measured ladder',

  method:
    'For each measured row in DYSON_LADDER_MEASURED with N > 5000, project ' +
    'barrier_tc_proj(N) = a_barrier + b_barrier/N using the OLS fit from ' +
    'BARRIER_EXTRAPOLATION_V2 (imp-404, fitted on N <= 5000). Compare the ' +
    'projection against the RK4-certified interval [t_c_lo, t_c_hi]. ' +
    'Consistency threshold: 15 pct of t_c_lo (generous, given linear-extrapolation ' +
    'bias at high N). Lambda convergence check: |a_barrier - a_rk4| <= 2*seA_barrier.',

  barrierOlsSource: B_OLS
    ? {
        intercept_a: B_OLS.intercept_a,
        slope_b: B_OLS.slope_b,
        R2: B_OLS.R2,
        n: B_OLS.n,
        seA: B_OLS.seA,
        fittedOnN: 'N in {50, 100, 200, 500, 1000, 2000, 3000, 5000}',
      }
    : null,

  rk4OlsReference: RK4_FIT
    ? {
        intercept_a: RK4_FIT.intercept_a,
        slope_b: RK4_FIT.slope_b,
        R2: RK4_FIT.R2,
        n: RK4_FIT.n,
        fittedOnN: 'all measured rows in DYSON_LADDER_MEASURED',
      }
    : null,

  lambdaConvergenceVerdict: lambdaConvergenceVerdict(),

  comparisonTable: COMPARISON_TABLE,

  summary: {
    highNRowsChecked: COMPARISON_TABLE.length,
    consistentRows: CONSISTENT_COUNT,
    allConsistent: CONSISTENT_COUNT === COMPARISON_TABLE.length,
  },

  openWork: [
    'Sub-gap imp-371-barrier-compute: run actual barrier integration at N in ' +
      '{6000, 7000, 8000, 9000, 10000, 15000, 20000, 25000, 50000, 100000} ' +
      'via an offline Node.js compute script. Plain-float64 Euler at N = 10000 ' +
      'takes approximately 4 seconds per 40-step run; feasible in a shell script ' +
      'but not in the Vite build pipeline.',
    'Once barrier tc values are measured at N > 5000, refit the barrier OLS on ' +
      'the full ladder and compare the updated a_barrier against the RK4 OLS ' +
      'to complete the cross-verification required by imp-371.',
    'Three-way agreement check (barrier + RK4 + heat-flow from imp-372) is the ' +
      'full cross-verification standard for the SOTA claim.',
  ],

  upgradeBlockerNote:
    'imp-527 investigation (2026-04-13): checked whether imp-462 (M-raw bridge), ' +
    'imp-463 (D-monotone analytic closure), imp-464 (NoSwap condition), and ' +
    'imp-471 (many-body correction, sole blocker on unconditional Lambda <= 0.121 beat) ' +
    'enable upgrading this partial to full. They do not. Those four closures address ' +
    'the B1/B2 monotonicity and NoSwap conditions inside the Lambda attack route, ' +
    'which is orthogonal to the barrier extrapolation cross-validation. ' +
    'The remaining blocker is purely computational: actual barrier integration at ' +
    'N > 5000 requires an offline compute engine (est. 4 s at N = 10000, ' +
    '>400 s at N = 100000) that cannot run in the Vite build pipeline. ' +
    'Status remains partial until sub-gap imp-371-barrier-compute is closed. ' +
    'imp-619 re-investigation (2026-04-14): confirmed same finding; no new proof ' +
    'chain closures since imp-527 change the blocker. Sub-gap imp-371-barrier-compute ' +
    'remains the sole open item gating full closure.',

  residualSubGap: {
    id:     'imp-371-barrier-compute',
    title:  'Run offline barrier integration at N in {6000..100000} to extend the OLS fit',
    status: 'open',
    route:
      'Execute an offline Node.js compute script running plain-float64 Euler ' +
      'integration at N in {6000, 7000, 8000, 9000, 10000, 15000, 20000, 25000, ' +
      '50000, 100000}. Refit the barrier OLS on the full ladder and compare ' +
      'the updated a_barrier against the RK4 OLS to complete the cross-verification ' +
      'required by imp-371. Three-way agreement (barrier + RK4 + heat-flow from imp-372) ' +
      'is the full cross-verification standard for the SOTA claim.',
    blocker: true,
    note:
      'imp-527 (2026-04-13) and imp-619 (2026-04-14) both confirmed this is the sole ' +
      'computational blocker. The B1/B2 monotonicity and NoSwap closures ' +
      '(imp-462/463/464/471) are orthogonal to this barrier cross-validation; ' +
      'they address the Lambda attack route, not the barrier OLS extrapolation. ' +
      'Estimated compute: ~4 s at N=10000, >400 s at N=100000 (plain-float64 Euler). ' +
      'Cannot run in the Vite build pipeline; requires a dedicated offline script.',
  },

  sources: [
    'imp-404 BARRIER_EXTRAPOLATION_V2 (src/data/barrier-extrapolation-v2.js)',
    'imp-360 DYSON_LADDER_MEASURED (src/data/dyson-ladder-measured.js)',
    'imp-400 PATH_C_BASELINE_FIT_V2 (src/data/path-c-baseline-fit-v2.js)',
  ],

  honestLimits:
    'The OLS projection a_barrier + b_barrier/N is fit on N <= 5000 data only. ' +
    'Extrapolating it to N = 100000 assumes the same linear-in-1/N shape holds, ' +
    'which is plausible under the Calogero-Moser scaling but has not been ' +
    'verified by actual barrier integration above N = 5000.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const BARRIER_IMP371_ASSERTIONS = [
  {
    id: 'imp371-barrier-ols-present',
    holds: () => B_OLS !== null && typeof B_OLS.intercept_a === 'number',
    why:
      'BARRIER_EXTRAPOLATION_V2 must supply a valid OLS fit for the projection ' +
      'to be meaningful. A null barrierOls means imp-404 failed to fit, which ' +
      'would be a regression in the upstream barrier computation.',
  },
  {
    id: 'imp371-high-n-rows-present',
    holds: () => HIGH_N_ROWS.length >= 10,
    why:
      'DYSON_LADDER_MEASURED must supply at least 10 measured rows with N > 5000. ' +
      'Fewer than 10 rows would mean imp-405 partial closure did not extend the ' +
      'ladder far enough to be useful for high-N cross-validation.',
  },
  {
    id: 'imp371-majority-consistent',
    holds: () =>
      COMPARISON_TABLE.length === 0 ||
      CONSISTENT_COUNT >= Math.ceil(0.5 * COMPARISON_TABLE.length),
    why:
      'At least half the OLS-projected barrier t_c values must be consistent ' +
      'with the RK4 intervals. A majority of inconsistent rows would indicate ' +
      'the barrier OLS fit from N <= 5000 does not extrapolate to high N, which ' +
      'would require investigation of linear-extrapolation bias.',
  },
  {
    id: 'imp371-barrier-lambda-positive',
    holds: () => A_BARRIER === null || A_BARRIER >= 0,
    why:
      'The barrier OLS intercept (Lambda_barrier) must be non-negative. ' +
      'A negative intercept would imply unphysical t_c < 0 for large N.',
  },
];
