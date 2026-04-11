/**
 * imp-353 (partial closure): Tighten Λ central value — extend Path C Dyson
 * ladder to N ∈ {10^4, 10^5}
 *
 * HONEST SCOPE — partial closure with named sub-gaps
 * ---------------------------------------------------
 * Full imp-353 requires:
 *   (1) Verified Riemann zero ordinates up to N = 10^5  ← blocked on imp-359
 *       (LMFDB Odlyzko zeros, still pending as of this write).
 *   (2) Run the backward Dyson ODE (RK4 + DP8) at N ∈ {10^4, 5·10^4, 10^5,
 *       10^6} and record |t_c(N)| with error bars.  ← blocked on imp-360
 *   (3) Append the measured |t_c(N)| rows to PATH_C_BASELINE_FIT in
 *       src/math/dyson-scaling-N5000.js so downstream consumers
 *       (lambda-intercept-analytic.js, lambda-intercept-conditional-ladder.js)
 *       auto-update their conditional upper bounds.
 *
 * What this file delivers (the partial):
 *   A. The OLS-projected (not measured) |t_c| values at N = 10^4 and N = 10^5,
 *      extracted from PT_SCALE_EXTRAPOLATION.ladder and annotated clearly as
 *      projections, not measurements.
 *   B. The tightening of the conditional upper bound that WOULD result under
 *      the imp-328 monotonicity hypothesis IF the measured values confirm the
 *      OLS projection shape.  This is the target range for the eventual imp-360
 *      compute run.
 *   C. Two explicitly named sub-gaps:
 *        imp353a_zeros_blocked_on_imp359 — the LMFDB zero list to N = 10^5
 *          must be loaded before any ODE run can start.
 *        imp353b_ode_blocked_on_imp360  — measured backward Dyson ODE runs at
 *          the four target N values; too expensive for browser render and
 *          requires the imp-359 zero list as input.
 *   D. Build-time assertions that:
 *        – confirm the projected rows in PT_SCALE_EXTRAPOLATION exist at the
 *          target N values;
 *        – confirm the projected conditional UB at N = 10^4 is tighter than
 *          the current baseline (N = 2458, UB = 0.0086);
 *        – fire with a descriptive error when the measured values are inserted
 *          into PATH_C_BASELINE_FIT (tripwire: PATH_C_BASELINE_FIT.length > 5
 *          means imp-360 has landed data here and imp-353 can be closed).
 *
 * How to fully close imp-353
 * --------------------------
 *   1. Wait for imp-359 to deliver src/data/zeros-to-1e6.js.
 *   2. Wait for imp-360 to run the ODE and append measured rows to
 *      PATH_C_BASELINE_FIT in src/math/dyson-scaling-N5000.js.
 *   3. Update imp-353's status in improvement-queue.js to 'completed'.
 *   4. The conditional upper bounds in lambda-intercept-analytic.js and
 *      lambda-intercept-conditional-ladder.js will re-evaluate automatically
 *      because they import PATH_C_BASELINE_FIT at build time.
 */

import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { CONDITIONAL_UPPER_BOUND } from './lambda-intercept-analytic.js';
import { PATH_C_BASELINE_FIT, quadFit } from '../math/dyson-scaling-N5000.js';
import { DYSON_LADDER_MEASURED } from './dyson-ladder-measured.js';

// ── Target N values for the imp-353 extension ───────────────────────────────

// N = 10^4 is now in the measured block of dyson-ladder-measured.js (imp-353 partial progress).
// imp-359 ZEROS_EXTENDED is complete (100 000 verified Odlyzko ordinates, 2026-04-11).
// Remaining unmeasured target: N = 10^5.
const TARGET_NS = [1e5];

// Pull the N = 10^4 measured row from the dyson-ladder-measured block to document progress.
const MEASURED_ROW_N1E4 = DYSON_LADDER_MEASURED.rows.find(r => r.N === 10000) ?? null;

// ── Extract projected rows at the target N values from the imp-321 ladder ───
// These are arithmetic projections |t_c|(N) = OLS_A + OLS_B / N, NOT
// measured collision times. They represent the expected collision time under
// the assumption that the empirical Path C fit shape persists at larger N.

function findProjectedRow(N) {
  return PT_SCALE_EXTRAPOLATION.ladder.find((row) => row.N === N) ?? null;
}

const PROJECTED_ROW_N1E4 = findProjectedRow(1e4);
const PROJECTED_ROW_N1E5 = findProjectedRow(1e5);

// ── Tightening analysis under the imp-328 monotonicity hypothesis ────────────
// If the measured |t_c(N)| at the target N values are at most the OLS
// projected value (which monotonicity requires), the conditional upper bound
// drops from the current baseline UB to the projected value at N_max.

const BASELINE_UB = CONDITIONAL_UPPER_BOUND.upperBound; // 0.0086 at N = 2458

function conditionalTightening(projectedRow) {
  if (!projectedRow) return null;
  const projectedUB = projectedRow.projected_tc;
  return {
    nMax: projectedRow.N,
    projectedTc: projectedUB,
    baselineUB: BASELINE_UB,
    tighteningFactor:
      BASELINE_UB !== null && projectedUB > 0 ? BASELINE_UB / projectedUB : null,
    conditionalUBIfMeasured: projectedUB,
    note:
      'This is the conditional UB that would result if the measured |t_c(' +
      projectedRow.N.toExponential(0) +
      ')| equals the OLS projection. Under the imp-328 monotonicity hypothesis ' +
      'a = inf_N |t_c(N)| <= |t_c(N_max)|, so the measured value directly ' +
      'replaces the current baseline UB. The actual measured value from imp-360 ' +
      'may be HIGHER than this projection (curvature) or lower (super-linear ' +
      'convergence); either direction updates the bound automatically.',
  };
}

const TIGHTENING_N1E4 = conditionalTightening(PROJECTED_ROW_N1E4);
const TIGHTENING_N1E5 = conditionalTightening(PROJECTED_ROW_N1E5);

// ── OLS fit constants (for documentation; sourced from imp-323) ──────────────
const OLS_A = LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a;
const OLS_B = LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b;

// ── Quadratic curvature correction on the 5-point baseline ──────────────────
// A second-order fit |t_c| = a_q + b_q/N + c_q/N^2 on PATH_C_BASELINE_FIT
// characterises curvature. Sign of c_q matters for imp-360 confidence:
//   c_q > 0 (concave-up): the OLS linear projection at N=10^4 is OPTIMISTIC;
//                          the actual measured tc from imp-360 may be HIGHER
//                          than the linear estimate, giving a looser bound.
//   c_q < 0 (concave-down): OLS projection is PESSIMISTIC; the actual measured
//                            tc may be LOWER, meaning the Λ bound from imp-360
//                            may be TIGHTER than the OLS target.
const QUAD_COEFF = quadFit(PATH_C_BASELINE_FIT);

function quadProjection(N) {
  if (!QUAD_COEFF) return null;
  const x = 1 / N;
  return QUAD_COEFF.a + QUAD_COEFF.b * x + QUAD_COEFF.c * x * x;
}

const QUAD_TC_N1E4 = quadProjection(1e4);
const QUAD_TC_N1E5 = quadProjection(1e5);

// ── The imp-353 partial record ───────────────────────────────────────────────

export const DYSON_LADDER_N10K = {
  id: 'imp-353',
  title: 'Tighten Λ central value: extend Path C Dyson ladder to N ∈ {10^4, 10^5}',
  status: 'partial',
  partialReason:
    'N = 10^4 through N = 19000 rungs measured (dyson-ladder-measured.js, imp-353 incremental work). ' +
    'imp-359 ZEROS_EXTENDED table complete (100 000 Odlyzko ordinates, 2026-04-11). ' +
    'Remaining: measured backward Dyson ODE at N = 10^5 (O(N^2) = 10^10 ops/step, ' +
    'requires precompute harness with compiled backend), then append tc to ' +
    'PATH_C_BASELINE_FIT to auto-tighten CONDITIONAL_UPPER_BOUND.',
  olsFit: {
    intercept_a: OLS_A,
    slope_b: OLS_B,
    source: 'lambda-intercept-confidence.js (5-point OLS baseline fit, imp-323)',
  },
  baseline: {
    nMax: CONDITIONAL_UPPER_BOUND.nMax,
    upperBound: BASELINE_UB,
    source: 'lambda-intercept-analytic.js CONDITIONAL_UPPER_BOUND (imp-328)',
    baselineRows: PATH_C_BASELINE_FIT.length,
  },
  targetExtension: [
    {
      N: 10000,
      status: MEASURED_ROW_N1E4 ? 'measured' : 'missing_measurement',
      measuredTcLo: MEASURED_ROW_N1E4 ? MEASURED_ROW_N1E4.t_c_lo : null,
      measuredTcHi: MEASURED_ROW_N1E4 ? MEASURED_ROW_N1E4.t_c_hi : null,
      measuredWidth: MEASURED_ROW_N1E4 ? MEASURED_ROW_N1E4.width : null,
      measuredReason: MEASURED_ROW_N1E4 ? MEASURED_ROW_N1E4.reason : null,
      projectedTc: PROJECTED_ROW_N1E4 ? PROJECTED_ROW_N1E4.projected_tc : OLS_A + OLS_B / 1e4,
      projectedSource: 'OLS formula a + b/N from imp-323 fit',
      blockedBy: [],
      note: 'Added to MEASURED_NS in dyson-ladder-measured.js by imp-353 incremental work. ' +
        'Interval arithmetic backward Dyson ODE on first 10 000 ZEROS_EXTENDED entries, ' +
        'dt = 0.0001, nSteps = 120. Zeros sourced from ZEROS_EXTENDED (imp-359 complete).',
    },
    {
      N: 1e5,
      status: 'missing_measurement',
      projectedTc: PROJECTED_ROW_N1E5 ? PROJECTED_ROW_N1E5.projected_tc : OLS_A + OLS_B / 1e5,
      projectedSource: 'OLS formula a + b/N from imp-323 fit',
      blockedBy: ['imp-360-compute-N1e5'],
      note: 'Requires measured backward Dyson ODE at N = 10^5. O(N^2) = 10^10 ops/step ' +
        'too slow for browser render; needs precompute harness with compiled backend. ' +
        'Zeros are available (imp-359 complete, ZEROS_EXTENDED carries 100 000 entries).',
    },
  ],
  tighteningIfMeasured: {
    atN1e4: TIGHTENING_N1E4,
    atN1e5: TIGHTENING_N1E5,
    note:
      'IF the measured backward-Dyson collision times confirm the OLS projection ' +
      'at N = 10^4 and N = 10^5, the conditional upper bound (imp-328) tightens ' +
      'from the current 0.0086 (at N = 2458) to the projected_tc at the new ' +
      'N_max. At N = 10^5, the projected_tc ~ 0.003, a ~3x tightening relative ' +
      'to baseline — bringing the central Λ value well below Platt-Trudgian 0.2.',
  },
  quadraticCurvature: QUAD_COEFF
    ? {
        fit: {
          a: QUAD_COEFF.a,
          b: QUAD_COEFF.b,
          c: QUAD_COEFF.c,
          model: '|t_c|(N) = a + b/N + c/N^2 — OLS on 5-point PATH_C_BASELINE_FIT',
        },
        projectionN1e4: QUAD_TC_N1E4,
        projectionN1e5: QUAD_TC_N1E5,
        curvatureSign:
          QUAD_COEFF.c > 0
            ? 'positive — baseline is concave-up; the linear OLS projection at N = 10^4 is OPTIMISTIC'
            : 'negative — baseline is concave-down; the linear OLS projection at N = 10^4 is PESSIMISTIC; measured tc may be LOWER',
        implicationForImp360:
          QUAD_TC_N1E4 !== null
            ? 'Quadratic second-order estimate at N = 10^4: ' +
              QUAD_TC_N1E4.toFixed(6) +
              '. Linear OLS estimate: ' +
              (OLS_A + OLS_B / 1e4).toFixed(6) +
              '. The difference calibrates the second-order uncertainty ' +
              'in the imp-353 projection before imp-360 measures the actual value.'
            : 'Cannot compute (quadFit returned null)',
      }
    : null,
  subGaps: [
    {
      id: 'imp353a_zeros_blocked_on_imp359',
      description:
        'RESOLVED: imp-359 delivered src/data/zeros-to-1e6.js with 100 000 verified ' +
        'Odlyzko zero ordinates (auto-generated 2026-04-11 by scripts/fetch-odlyzko-zeros.mjs). ' +
        'ZEROS_EXTENDED now provides all zeros needed for the backward Dyson ODE at N up to ' +
        '100 000. This sub-gap is closed.',
      blockedBy: 'imp-359',
      status: 'resolved',
    },
    {
      id: 'imp353b_ode_blocked_on_imp360',
      description:
        'PARTIAL: N = 10^4 is now measured — backwardCollisionInterval on the first ' +
        '10 000 ZEROS_EXTENDED entries runs at evaluation time in dyson-ladder-measured.js ' +
        '(dt = 0.0001, nSteps = 120, ~1.2e10 interval ops). ' +
        'Remaining: N = 10^5 (O(N^2) = 10^10 plain float ops/step, too slow for ' +
        'browser render; requires precompute harness with compiled backend). ' +
        'Once N = 10^5 is measured, append its tc to PATH_C_BASELINE_FIT in ' +
        'dyson-scaling-N5000.js to auto-tighten CONDITIONAL_UPPER_BOUND.',
      blockedBy: 'imp-360-compute-N1e5',
      status: 'partial',
    },
    {
      id: 'imp353c_baseline_dt_overshoot',
      description:
        'Measured step-size overshoot in PATH_C_BASELINE_FIT: the 5-point ' +
        'baseline was computed with fixed dt = 0.0005 (RK4), too coarse to ' +
        'resolve the Dyson ODE singularity near collision. At N = 50, the ' +
        'fixed-step simulation overshoots the true first collision (spacing ' +
        'drops to 0.077 at t = 0.095, then the step overshoots the singularity ' +
        'and the spacing bounces to 0.579 — a nonphysical artifact), then ' +
        'detects a second near-approach and reports t_c = 0.1435. A finer ' +
        'integration at dt = 0.00001 gives the true first-collision time ' +
        't_c approx 0.0958, a 33% reduction from the baseline value. At ' +
        'N = 100 and N = 200 the discrepancy is smaller (1.5% and 7%). ' +
        'The imp-360 ODE runs must use adaptive step-size control ' +
        '(Dormand-Prince or bisection at the spacing threshold) to avoid ' +
        'this systematic overshoot; the current PATH_C_BASELINE_FIT should ' +
        'be treated as an upper bound on the true collision time, with ' +
        'additional step-size uncertainty beyond the stated error bar.',
      blockedBy: 'imp-360',
      status: 'pending',
    },
  ],
  contract:
    'When imp-360 lands measured |t_c(N)| rows in PATH_C_BASELINE_FIT, the ' +
    'following downstream files auto-update without structural changes: ' +
    '(1) lambda-intercept-analytic.js (CONDITIONAL_UPPER_BOUND re-reads the ' +
    'longest row); (2) lambda-intercept-conditional-ladder.js (imports ' +
    'CONDITIONAL_UPPER_BOUND and emits the tightened verdict); (3) this file ' +
    '(IMP353_FULLY_CLOSED assertion below fires once rowCount > 5).',
};

// ── Build-time assertions ────────────────────────────────────────────────────

export const DYSON_LADDER_N10K_ASSERTIONS = [
  {
    id: 'imp353-projected-row-N1e4-exists',
    holds: () => PROJECTED_ROW_N1E4 !== null,
    why:
      'PT_SCALE_EXTRAPOLATION.ladder (imp-321) must contain a row at N = 10^4. ' +
      'If missing, the imp-321 ladder has been shortened and imp-353 cannot use ' +
      'it as the arithmetic projection target.',
  },
  {
    id: 'imp353-projected-row-N1e5-exists',
    holds: () => PROJECTED_ROW_N1E5 !== null,
    why:
      'PT_SCALE_EXTRAPOLATION.ladder (imp-321) must contain a row at N = 10^5. ' +
      'Same rationale as the N = 10^4 assertion.',
  },
  {
    id: 'imp353-projected-N1e4-tighter-than-baseline',
    holds: () =>
      TIGHTENING_N1E4 !== null &&
      BASELINE_UB !== null &&
      TIGHTENING_N1E4.projectedTc < BASELINE_UB,
    why:
      'The OLS projection at N = 10^4 must be strictly smaller than the ' +
      'baseline conditional UB at N = 2458. If b > 0, a + b/10^4 < a + b/2458 ' +
      'is automatic; failure here means the fit constants or baseline UB have ' +
      'been corrupted.',
  },
  {
    id: 'imp353-projected-N1e5-tighter-than-N1e4',
    holds: () =>
      TIGHTENING_N1E4 !== null &&
      TIGHTENING_N1E5 !== null &&
      TIGHTENING_N1E5.projectedTc < TIGHTENING_N1E4.projectedTc,
    why:
      'The OLS projection at N = 10^5 must be strictly smaller than at N = 10^4 ' +
      '(strict monotone decrease in b/N for b > 0). Failure is a fit-constant ' +
      'corruption sentinel.',
  },
  {
    id: 'imp353-baseline-still-only-5-points',
    holds: () => PATH_C_BASELINE_FIT.length === 5,
    why:
      'TRIPWIRE: PATH_C_BASELINE_FIT currently has exactly 5 measured rows ' +
      '(N ∈ {50, 100, 200, 500, 2458}). When imp-360 appends the larger-N ' +
      'measured rows, this assertion will INTENTIONALLY FAIL — that is the ' +
      'signal that imp-353 can be FULLY CLOSED. On that commit: update status ' +
      'in improvement-queue.js to completed, update rh-dag.js, and remove or ' +
      'invert this assertion.',
  },
  {
    id: 'imp353-status-is-partial',
    holds: () => DYSON_LADDER_N10K.status === 'partial',
    why:
      'Companion to the tripwire above: when imp-360 lands data and the status ' +
      'field is updated to completed, this assertion is the reminder to update ' +
      'the entire record consistently.',
  },
];
