/**
 * @module imp371-barrier-cross-validation
 * @fileoverview imp-2546 / imp-371: Rerun the imp-299 effective-barrier
 * extrapolation on the post-imp-833 extended Dyson ladder (N up to 1e6) and
 * cross-validate it against the Path C Hybrid measured pipeline.
 *
 * Two independent estimates of the first-collision time |t_c(N)| under the
 * backward Dyson flow are compared on the SAME extended ladder:
 *
 *   1. Barrier extrapolation (imp-299 / imp-371).  The effective barrier
 *      B(t) = min_n |gamma_{n+1}(t) - gamma_n(t)| obeys the near-collision
 *      square-root law B(t) ~ (t_c - t)^{1/2}.  Evaluated at t = 0 with the
 *      pairwise-collapse normalisation this gives the closed-form estimate
 *      t_c_barrier(N) = H_raw(N)^2 / 8, where H_raw(N) = B(0) is the initial
 *      minimum gap.  This is an ANALYTIC estimate — no ODE integration.
 *
 *   2. Path C measured ladder (imp-360 / imp-362).  A certified one-ULP
 *      interval-RK4 backward integrator produces a rigorous bracket
 *      [t_c_lo, t_c_hi] on |t_c(N)| for each rung.
 *
 * closesIf (lambda-roadmap VERIFICATION_EFFORTS cross-validation-barrier):
 *   "imp-371 rerun confirms agreement on extended ladder".
 *
 * Result: on every CLOSED rung (N in {25k, 50k, 100k}) the barrier estimate
 * lands strictly INSIDE the certified interval-RK4 bracket; on every
 * budget-exhausted rung (t_c_hi = +Infinity) it is >= the certified lower
 * bound.  The two pipelines therefore agree on the extended ladder.  At the
 * Lambda-intercept level the barrier method (imp-299, Lambda ~ 0.011) agrees
 * with the Path C Hybrid central value (Lambda ~ 0.0066 +/- 0.01) within the
 * stated error bar: |0.011 - 0.0066| = 0.0044 < 0.01.
 *
 * @see imp-2546, imp-371, imp-299
 * @see src/math/barrier-extrapolation.js
 * @see src/data/imp-360-extended-ladder-N1e6.js
 * @see src/data/bridge-lambda-rh.js  (LAMBDA_RH_BRIDGE.pathCBound)
 */

import { IMP_360_EXTENDED_LADDER_N1E6 } from './imp-360-extended-ladder-N1e6.js';
import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';

// ── Barrier closed-form collapse time: t_c = B(0)^2 / 8 = H_raw^2 / 8 ─────────
function barrierTc(H_raw) {
  return (H_raw * H_raw) / 8;
}

// ── Per-rung comparison table on the extended ladder ─────────────────────────
const ROWS = IMP_360_EXTENDED_LADDER_N1E6.rows;

const COMPARISON_TABLE = ROWS.map((r) => {
  const tc_barrier = barrierTc(r.H_raw);
  const finiteHi = typeof r.t_c_hi === 'number' && Number.isFinite(r.t_c_hi);
  let agree;
  let mode;
  if (r.closed === true && finiteHi) {
    // Closed bracket: the analytic barrier estimate must fall inside it.
    agree = tc_barrier >= r.t_c_lo && tc_barrier <= r.t_c_hi;
    mode = 'inside-bracket';
  } else {
    // Budget-exhausted rung (t_c_hi = +Infinity): only the lower bound is
    // certified, so consistency means barrier estimate >= certified floor.
    agree = tc_barrier >= r.t_c_lo;
    mode = 'lower-bound-consistent';
  }
  return {
    N: r.N,
    H_raw: r.H_raw,
    tc_barrier: +tc_barrier.toExponential(6),
    t_c_lo: r.t_c_lo,
    t_c_hi: finiteHi ? r.t_c_hi : null,
    closed: r.closed === true,
    mode,
    agree,
  };
});

const CLOSED_ROWS = COMPARISON_TABLE.filter((r) => r.closed);
const PARTIAL_ROWS = COMPARISON_TABLE.filter((r) => !r.closed);
const ALL_CLOSED_AGREE = CLOSED_ROWS.length > 0 && CLOSED_ROWS.every((r) => r.agree);
const ALL_PARTIAL_CONSISTENT = PARTIAL_ROWS.every((r) => r.agree);

// ── Lambda-intercept level agreement (barrier imp-299 vs Path C Hybrid) ──────
// imp-299 reported Lambda ~ 0.011 from the barrier extrapolation; the Path C
// Hybrid central value is LAMBDA_RH_BRIDGE.pathCBound.centralValue +/- errorBar.
const BARRIER_LAMBDA = 0.011; // imp-299 barrier extrapolation central estimate
const PATH_C_CENTRAL = LAMBDA_RH_BRIDGE.pathCBound.centralValue; // 0.0066
const PATH_C_ERRORBAR = LAMBDA_RH_BRIDGE.pathCBound.errorBar; // 0.01
const LAMBDA_GAP = Math.abs(BARRIER_LAMBDA - PATH_C_CENTRAL);
const LAMBDA_AGREE = LAMBDA_GAP <= PATH_C_ERRORBAR;

// ── Exported record ──────────────────────────────────────────────────────────
export const IMP371_BARRIER_CROSS_VALIDATION = Object.freeze({
  id: 'imp-2546',
  tickets: ['imp-2546', 'imp-371', 'imp-299'],
  title:
    'Cross-validation: barrier extrapolation (imp-299/imp-371) vs Path C ' +
    'measured ladder on the extended N-to-1e6 Dyson ladder',
  status:
    ALL_CLOSED_AGREE && ALL_PARTIAL_CONSISTENT
      ? 'cross-validated-agreement'
      : 'divergence-found',

  method:
    'Barrier estimate t_c(N) = H_raw(N)^2 / 8 (B(t) ~ (t_c - t)^{1/2} at ' +
    't = 0) compared per-rung against the certified interval-RK4 bracket ' +
    '[t_c_lo, t_c_hi] from imp-360. Closed rungs require the barrier estimate ' +
    'inside the bracket; budget-exhausted rungs require it >= the certified ' +
    'lower bound.',

  ladder: {
    source: IMP_360_EXTENDED_LADDER_N1E6.id,
    targetNs: IMP_360_EXTENDED_LADDER_N1E6.targetNs,
    nClosed: CLOSED_ROWS.length,
    nPartial: PARTIAL_ROWS.length,
  },

  comparisonTable: COMPARISON_TABLE,

  perRungVerdict: {
    allClosedAgree: ALL_CLOSED_AGREE,
    allPartialConsistent: ALL_PARTIAL_CONSISTENT,
    closedRungs: CLOSED_ROWS.map((r) => r.N),
    summary:
      ALL_CLOSED_AGREE && ALL_PARTIAL_CONSISTENT
        ? 'Barrier estimate inside the measured bracket on every closed rung ' +
          'and >= the certified floor on every budget-exhausted rung. The two ' +
          'pipelines agree on the extended ladder.'
        : 'At least one rung diverges — see comparisonTable.agree flags.',
  },

  lambdaIntercept: {
    barrierLambda: BARRIER_LAMBDA,
    pathCCentral: PATH_C_CENTRAL,
    pathCErrorBar: PATH_C_ERRORBAR,
    gap: +LAMBDA_GAP.toFixed(6),
    agreeWithinErrorBar: LAMBDA_AGREE,
    note:
      'Barrier extrapolation Lambda ~ ' +
      BARRIER_LAMBDA +
      ' (imp-299) vs Path C Hybrid Lambda ~ ' +
      PATH_C_CENTRAL +
      ' +/- ' +
      PATH_C_ERRORBAR +
      '. |gap| = ' +
      LAMBDA_GAP.toFixed(4) +
      (LAMBDA_AGREE ? ' <= ' : ' > ') +
      PATH_C_ERRORBAR +
      '.',
  },

  honestLimits: [
    'The per-rung agreement is rigorous only on the three CLOSED rungs ' +
      '(N in {25k, 50k, 100k}); the larger rungs (150k..1M) are ' +
      'budget-exhausted (t_c_hi = +Infinity) so only lower-bound consistency ' +
      'is checkable there.',
    'The barrier estimate H_raw^2/8 tracks the single dominant near-collision ' +
      'pair (the global minimum gap). At large N that pair freezes ' +
      '(H_raw constant across 100k..250k, then 400k, then 500k..1M in the ' +
      'ladder), so a 1/N OLS of the raw barrier ladder is NOT used here — the ' +
      'cross-validation is the per-rung bracket containment, not a refit.',
    'The Lambda-intercept agreement reuses the published imp-299 barrier ' +
      'estimate (Lambda ~ 0.011) rather than recomputing it; the contribution ' +
      'of this module is the extended-ladder per-rung confirmation.',
  ],

  sources: [
    'src/math/barrier-extrapolation.js (imp-299 barrier method)',
    'src/data/imp-360-extended-ladder-N1e6.js (Path C measured ladder)',
    'src/data/bridge-lambda-rh.js LAMBDA_RH_BRIDGE.pathCBound (Path C central value)',
    'src/data/lambda-roadmap.js VERIFICATION_EFFORTS cross-validation-barrier',
  ],
});

// ── Build-time assertions ─────────────────────────────────────────────────────
export const IMP371_BARRIER_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp2546-ladder-has-closed-rungs',
    holds: () => CLOSED_ROWS.length >= 3,
    why:
      'The cross-validation needs at least the three closed extended-ladder ' +
      'rungs (N in {25k, 50k, 100k}) with finite measured brackets. Fewer ' +
      'would mean the imp-360 ladder regressed.',
  },
  {
    id: 'imp2546-barrier-formula-reproduces-t_c_pair',
    holds: () =>
      ROWS.every(
        (r) => Math.abs(barrierTc(r.H_raw) - r.t_c_pair) <= 1e-9 + 1e-4 * Math.abs(r.t_c_pair),
      ),
    why:
      'The barrier closed form t_c = H_raw^2/8 must reproduce the ladder ' +
      't_c_pair field for every rung. The relative tolerance is 1e-4: both ' +
      'H_raw and t_c_pair are stored in the ladder JSON at ~5-6 significant ' +
      'figures, and squaring the rounded H_raw doubles its relative error, so ' +
      'the recomputed H_raw^2/8 agrees with the stored t_c_pair only to ~3e-5 ' +
      'relative (e.g. N=25k diff 4.3e-9 on t_c_pair 1.56e-4). A 1e-6 relative ' +
      'tolerance would be tighter than the storage precision and reject a true ' +
      'match; a mismatch beyond 1e-4 means a genuinely different estimate.',
  },
  {
    id: 'imp2546-barrier-inside-bracket-on-closed-rungs',
    holds: () => ALL_CLOSED_AGREE,
    why:
      'On every CLOSED rung the analytic barrier estimate t_c = H_raw^2/8 must ' +
      'fall inside the certified interval-RK4 bracket [t_c_lo, t_c_hi]. This ' +
      'is the core cross-validation: two independent pipelines agree on the ' +
      'extended ladder (closesIf for cross-validation-barrier).',
  },
  {
    id: 'imp2546-barrier-above-floor-on-partial-rungs',
    holds: () => ALL_PARTIAL_CONSISTENT,
    why:
      'On every budget-exhausted rung (t_c_hi = +Infinity) the barrier ' +
      'estimate must be >= the certified lower bound t_c_lo. A barrier ' +
      'estimate below the certified floor would be a genuine contradiction.',
  },
  {
    id: 'imp2546-lambda-agrees-within-error-bar',
    holds: () => LAMBDA_AGREE,
    why:
      'The barrier-extrapolation Lambda estimate (~0.011, imp-299) must agree ' +
      'with the Path C Hybrid central value (~0.0066) within the stated ' +
      '+/-0.01 error bar. |0.011 - 0.0066| = 0.0044 <= 0.01.',
  },
  {
    id: 'imp2546-table-length-matches-ladder',
    holds: () => COMPARISON_TABLE.length === ROWS.length,
    why:
      'The comparison table must have exactly one row per extended-ladder ' +
      'rung. A mismatch means rows were dropped or duplicated.',
  },
];
