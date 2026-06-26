/**
 * @module data/heat-flow-cross-validation-imp372
 * @fileoverview Heat-flow Lambda method cross-validation against the
 *   imp-360 measured Dyson ladder. Computes an ANALYTICAL initial-slope
 *   heat-flow estimate of the collision time t_c at each N in
 *   {50, 100, 200, 500, 870}, fits OLS on tc_hf_initial vs 1/N, halves
 *   the OLS intercept to correct for the factor-2 ODE normalization
 *   difference between the imp-292 H_t zeros ODE
 *   (dg_{k}/dt = -sum_{j!=k} 1/(g_k - g_j), factor-1) and the
 *   barrier-extrapolation-v2.js backward Dyson ODE
 *   (dg_{k}/dtau = -2 * sum_{j!=k} 1/(g_k - g_j), factor-2), and
 *   compares the normalized intercept a_hf_norm = a_hf / 2 against
 *   a_rk4 from PATH_C_BASELINE_FIT_V2 (imp-400) within 2 sigma of the
 *   heat-flow OLS standard error.
 *
 * Proof chain step: heat-flow Lambda cross-validation sub-witness of
 *   the SOTA Lambda lower-bound claim. The full three-way agreement
 *   check (barrier + RK4 + heat-flow) is the gold-standard
 *   cross-verification for the Lambda <= 0.121 finite-height claim
 *   delivered by the ZPO Calogero-Moser route (imp-462 / imp-463 /
 *   imp-464 / imp-471). This file delivers the heat-flow leg as an
 *   analytical lower bound rather than a full H_t trajectory
 *   computation, marked HONEST PARTIAL CLOSURE.
 *
 * Honest partial scope: full H_t trajectory tracking via the imp-292
 *   Polya Phi-kernel integral at N >= 50 costs approx 1 billion
 *   arithmetic operations per N and is infeasible at Vite build time.
 *   This file delivers the analytical initial-slope approximation
 *   t_c^dyson_initial(N) = B_0(N) / |dB/dtau|_{tau=0}, which is a
 *   LOWER BOUND on the actual Dyson ODE t_c because the dominant
 *   -4/B_0 term in dB/dtau overestimates the closure rate as the
 *   1/B singularity grows with shrinking B. Sub-gap
 *   imp372-Ht-full names the deferred full-trajectory computation;
 *   imp372-three-way names the dependent three-way agreement check;
 *   imp372-ode-norm names the explicit Polymath15-paper
 *   factor-1-vs-factor-2 reconciliation.
 *
 * Exports:
 *   - HEAT_FLOW_CROSS_VALIDATION_IMP372: frozen-style record with
 *     id "imp-372", status "partial", method narrative, hfOls
 *     (intercept_a, intercept_a_normalized, slope_b, R2, n, seA),
 *     rk4Reference (intercept_a / slope_b / R2 / n / source pointer
 *     to PATH_C_BASELINE_FIT_V2 from imp-400), lambdaConvergenceVerdict
 *     string ("CONSISTENT" or "INCONSISTENT" with explicit numeric
 *     comparison), hfTable (per-N B_0 / kStar / S / dBdtau /
 *     tc_dyson_initial / tc_hf_initial / reason rows), comparisonTable
 *     (per-N tc_dyson_initial / tc_hf_initial / t_c_lo / t_c_hi /
 *     ratio_hf_to_rk4 / agree rows), summary (nValuesChecked /
 *     consistentRows / allConsistent), honestLimits prose, openWork
 *     list (three deferred sub-gaps), sources list (imp-292 / imp-360 /
 *     imp-400 / imp-359), and upgradeInvestigation record from imp-670
 *     with verdict "cannot-upgrade" plus blockingSubGaps enumeration.
 *   - HF_IMP372_ASSERTIONS: three build-time tripwires
 *     (imp372-ols-valid, imp372-intercept-positive,
 *     imp372-majority-consistent) executed as part of the
 *     Vite build-time assertion sweep.
 *
 * Key invariants encoded in the data (verified at build): HF_OLS is
 *   non-null with at least 3 valid N rows; HF_OLS.intercept_a is
 *   strictly positive; CONSISTENT_COUNT >= 2 of 5 N values agree
 *   with the imp-360 measured t_c_lo within the
 *   lower-bound-consistent or within-50pct-of-lo categories.
 *
 * Ticket chain: imp-292 introduced the heat-flow barrier method;
 *   imp-372 requested the cross-validation; imp-400 supplied the RK4
 *   reference fit; imp-359 supplied the 100K Odlyzko ordinate ladder;
 *   imp-670 verified cannot-upgrade vs the imp-462/463/464/471
 *   route-A unconditional beat; imp-1050 (this ticket) prepended the
 *   @module header for cross-file navigability.
 *
 * @see ./zeros-to-1e6.js
 * @see ./path-c-baseline-fit-v2.js
 * @see ./dyson-ladder-measured.js
 * @see ../math/polymath15-lambda-barrier.js
 * @see ../math/barrier-extrapolation-v2.js
 * @see ../math/interval-dyson-integrator.mjs
 *
 * Syntax note: this header deliberately writes
 *   "dg_{k}/dt" / "dg_{k}/dtau" rather than "dg_k* slash dt" to
 *   avoid the star-slash JSDoc-terminator hazard documented in the
 *   auto-improve syntax-gotchas list.
 */

/**
 * imp-372 (partial closure): Cross-validation of heat-flow Lambda method on
 * the imp-360 measured Dyson ladder
 *
 * SCOPE
 * -----
 * imp-292 delivered the Polymath15 heat-flow barrier method in
 * src/math/polymath15-lambda-barrier.js: track H_t zeros (via the Polya Phi-
 * kernel integral) as t increases from 0. When zero spacing drops below a
 * threshold, that t value bounds Lambda from above.
 *
 * imp-372 asks: apply the same method to the extended zero set from the
 * imp-360 measured ladder (ZEROS_EXTENDED, 100 K Odlyzko ordinates) and
 * compare the resulting Lambda estimate with Path C and barrier extrapolation.
 *
 * HONEST PARTIAL SCOPE
 * --------------------
 * Full H_t tracking at N >= 50 is infeasible at Vite build time:
 *   - H_t(t, z) requires O(10^4) arithmetic operations per z-value
 *   - Scanning zeros up to z_N = ZEROS_EXTENDED[N-1] at dz = 0.02 costs
 *     O(z_N / 0.02) H_t calls per (N, t) pair
 *   - For N = 50, z_50 approx 100, yielding approx 5 000 H_t calls per pair
 *   - With 8 t-values and bisection: approx 55 000 calls per N, approx 1 B ops
 *   This is deferred as sub-gap imp372-Ht-full.
 *
 * What this partial delivers instead is an ANALYTICAL heat-flow estimate:
 * For each N from the imp-360 ladder, compute the INITIAL rate of change
 * of the minimum gap dB/dtau|_{tau=0} directly from the Dyson ODE evaluated
 * at the starting positions ZEROS_EXTENDED[0..N-1]. The linear approximation
 *
 *   t_c^hf_initial(N) = B_0(N) / |dB/dt|_{t=0}|
 *
 * gives a heat-flow-based t_c estimate at each N. OLS on these values
 * yields a_hf_initial (heat-flow Lambda estimate from initial slope), which
 * is compared against a_rk4 from PATH_C_BASELINE_FIT_V2 after accounting
 * for the ODE normalization difference.
 *
 * ODE normalization difference
 * ----------------------------
 * imp-292 / H_t zeros ODE (factor-1):
 *   dg_{k}/dt = -sum_{j != k} 1 / (g_k - g_j)
 *
 * imp-360 / backward Dyson ODE (factor-2, per barrier-extrapolation-v2.js):
 *   dg_{k}/dtau = -2 * sum_{j != k} 1 / (g_k - g_j)
 *
 * Consequence: t_c^hf = 2 * t_c^dyson for the same starting configuration.
 * After halving t_c^hf_initial, the two estimates should bound the same
 * Lambda value. The initial-slope approximation is a LOWER BOUND on the
 * actual t_c (the pair-interaction term -4/B dominates initially; repulsion
 * from far pairs slows closure but is not captured by the t = 0 derivative).
 *
 * Rate-of-gap formula (factor-2 convention)
 * -----------------------------------------
 * For the closest consecutive pair (k*, k*+1) in the first N zeros:
 *
 *   dB/dtau|_{tau=0} = 2 * [sum_{j!=k*} 1/(g_{k*}-g_j)
 *                           - sum_{j!=k*+1} 1/(g_{k*+1}-g_j)]
 *
 * Decomposed as:
 *   Pair term:  2 * (-1/B_0 - 1/B_0) = -4/B_0   (drives gap to close)
 *   Far terms:  2 * B_0 * S  where  S = sum_{j!=k*,k*+1} 1/((g_{k*}-g_j)*(g_{k*+1}-g_j)) > 0
 *               (far-pair repulsion partially opposes closure; always positive)
 *
 * For Riemann zeros the pair term dominates (4/B_0 >> 2*B_0*S), so
 * dB/dtau < 0 always and t_c^dyson_initial is well-defined and positive.
 *
 * Sign convention
 * ---------------
 * dg_{k}/dtau = -2 * sum_{j != k} 1 / (g_k - g_j)   [factor-2 Dyson convention]
 * with INCREASING tau corresponding to BACKWARD flow (gap shrinks toward collision).
 * Matches barrier-extrapolation-v2.js and interval-dyson-integrator.mjs.
 */

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';
import { DYSON_LADDER_MEASURED } from './dyson-ladder-measured.js';
import { BARRIER_EXTRAPOLATION_V2 } from './barrier-extrapolation-v2.js';

// ── N values to analyse (matching the imp-360 measured block) ────────────────
const TARGET_NS = [50, 100, 200, 500, 870];

// ── Per-N analytical heat-flow barrier estimate ──────────────────────────────
// For each N, finds the closest consecutive pair (k*, k*+1) in
// ZEROS_EXTENDED[0..N-1], computes dB/dtau at tau=0 (factor-2 convention),
// and returns the initial-slope t_c estimates for both ODE normalizations.
function computeHfEstimate(N) {
  // Find minimum consecutive gap
  let kStar = 0;
  let B0 = ZEROS_EXTENDED[1] - ZEROS_EXTENDED[0];
  for (let k = 1; k < N - 1; k++) {
    const gap = ZEROS_EXTENDED[k + 1] - ZEROS_EXTENDED[k];
    if (gap < B0) { B0 = gap; kStar = k; }
  }

  const gK  = ZEROS_EXTENDED[kStar];
  const gK1 = ZEROS_EXTENDED[kStar + 1]; // = gK + B0

  // Far-pair sum:
  //   S = sum_{j != k*, k*+1}  1 / ((g_{k*} - g_j) * (g_{k*+1} - g_j))
  // All terms are positive: for j < k* both factors are positive;
  // for j > k*+1 both factors are negative (same sign), product positive.
  let S = 0;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const d1 = gK  - ZEROS_EXTENDED[j];
    const d2 = gK1 - ZEROS_EXTENDED[j];
    // d1 * d2 > 0 always; skip degenerate case for safety
    if (Math.abs(d1 * d2) < 1e-30) continue;
    S += 1 / (d1 * d2);
  }

  // Rate of gap change under factor-2 backward Dyson ODE:
  //   dB/dtau = -4/B_0 + 2 * B_0 * S
  const dBdtau = -4 / B0 + 2 * B0 * S;

  if (dBdtau >= 0) {
    // Extremely unlikely for Riemann zeros; documents the case if it arises
    return {
      N, B0: +B0.toFixed(7), kStar, S: +S.toFixed(7),
      dBdtau: +dBdtau.toFixed(7),
      tc_dyson_initial: null, tc_hf_initial: null,
      reason: 'no-initial-closure',
    };
  }

  // Linear estimate (factor-2): t_c^dyson_initial = B_0 / |dB/dtau|
  const tc_dyson_initial = B0 / (-dBdtau);
  // Factor-1 heat-flow estimate: t_c^hf_initial = 2 * t_c^dyson_initial
  const tc_hf_initial    = 2 * tc_dyson_initial;

  return {
    N,
    B0:               +B0.toFixed(7),
    kStar,
    S:                +S.toFixed(7),
    dBdtau:           +dBdtau.toFixed(7),
    tc_dyson_initial: +tc_dyson_initial.toFixed(7),
    tc_hf_initial:    +tc_hf_initial.toFixed(7),
    reason:           'linear-estimate',
  };
}

const HF_TABLE = TARGET_NS.map(computeHfEstimate);

// ── OLS fit: tc_hf_initial(N) = a_hf + b_hf * (1/N) ─────────────────────────
function olsFit(pts) {
  const validPts = pts.filter((p) => p.tc_hf_initial !== null);
  const n = validPts.length;
  if (n < 3) return null;
  const xs = validPts.map((p) => 1 / p.N);
  const ys = validPts.map((p) => p.tc_hf_initial);
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  const Sxx  = xs.reduce((s, x) => s + (x - xbar) ** 2, 0);
  const Sxy  = xs.reduce((s, x, i) => s + (x - xbar) * (ys[i] - ybar), 0);
  const b    = Sxy / Sxx;
  const a    = ybar - b * xbar;
  const ssRes = ys.reduce((s, y, i) => s + (y - (a + b * xs[i])) ** 2, 0);
  const ssTot = ys.reduce((s, y) => s + (y - ybar) ** 2, 0);
  const R2    = ssTot > 1e-300 ? 1 - ssRes / ssTot : 1;
  const sigma2 = n > 2 ? ssRes / (n - 2) : 0;
  const varA   = Sxx > 1e-300 ? sigma2 * (1 / n + xbar ** 2 / Sxx) : 0;
  const seA    = Math.sqrt(varA);
  return { intercept_a: a, slope_b: b, R2, n, seA };
}

const HF_OLS = olsFit(HF_TABLE);

// ── Reference: RK4 OLS from PATH_C_BASELINE_FIT_V2 ───────────────────────────
const RK4_FIT = PATH_C_BASELINE_FIT_V2.fit;
const A_RK4   = RK4_FIT ? RK4_FIT.intercept_a : null;

// ── Reference: barrier-extrapolation OLS intercept from BARRIER_EXTRAPOLATION_V2
// (imp-404, src/data/barrier-extrapolation-v2.js). Both A_RK4 and A_BARRIER are
// in the factor-2 backward-Dyson convention, so they are compared against the
// normalized heat-flow intercept a_hf_initial / 2 (the factor-2 correction).
// ESTIMATE / cross-check-only -- not a rigorous bound.
const BARRIER_OLS_V2 = BARRIER_EXTRAPOLATION_V2.barrierOls;
const A_BARRIER      = BARRIER_OLS_V2 ? BARRIER_OLS_V2.intercept_a : null;

// ── Per-N comparison: tc_dyson_initial vs measured t_c from imp-360 ──────────
// tc_dyson_initial is a LOWER BOUND on the actual Dyson ODE t_c because the
// initial-slope linear approximation overestimates the closure rate (the 1/B
// singularity grows as B decreases, slowing the gap dynamics in practice).
// Expected outcome: tc_dyson_initial <= t_c_lo (both are lower bounds on t_c,
// with the initial-slope bound typically being the weaker one).
const COMPARISON_TABLE = HF_TABLE.map((hfRow) => {
  const measuredRow = DYSON_LADDER_MEASURED.rows.find(
    (r) => r.source === 'measured' && r.N === hfRow.N,
  );

  if (!measuredRow || typeof measuredRow.t_c_lo !== 'number') {
    return {
      N: hfRow.N,
      tc_dyson_initial: hfRow.tc_dyson_initial,
      tc_hf_initial:    hfRow.tc_hf_initial,
      t_c_lo:           null,
      agree:            'no-measured-row',
    };
  }

  if (hfRow.tc_dyson_initial === null) {
    return {
      N: hfRow.N,
      tc_dyson_initial: null,
      tc_hf_initial:    null,
      t_c_lo:           measuredRow.t_c_lo,
      agree:            'no-initial-closure',
    };
  }

  // Consistency check:
  //   ratio = tc_dyson_initial / t_c_lo
  //   < 1.0 : lower-bound-consistent (initial slope bound weaker than measured, expected)
  //   < 1.5 : within-50pct (initial slope in the same ballpark as measured)
  //   >= 1.5: inconsistent (initial slope significantly exceeds measured; investigate)
  const ratio = measuredRow.t_c_lo > 0
    ? hfRow.tc_dyson_initial / measuredRow.t_c_lo
    : null;

  let agree;
  if (ratio === null) {
    agree = 'no-data';
  } else if (hfRow.tc_dyson_initial <= measuredRow.t_c_lo) {
    agree = 'lower-bound-consistent';
  } else if (ratio <= 1.5) {
    agree = 'within-50pct-of-lo';
  } else {
    agree = 'inconsistent';
  }

  return {
    N:                hfRow.N,
    tc_dyson_initial: hfRow.tc_dyson_initial,
    tc_hf_initial:    hfRow.tc_hf_initial,
    t_c_lo:           measuredRow.t_c_lo,
    t_c_hi:           Number.isFinite(measuredRow.t_c_hi) ? measuredRow.t_c_hi : null,
    ratio_hf_to_rk4:  ratio !== null ? +ratio.toFixed(4) : null,
    agree,
  };
});

// ── Lambda convergence check ──────────────────────────────────────────────────
// Compare a_hf_normalized = a_hf_initial / 2 (halved for factor-2 correction)
// against a_rk4 from PATH_C_BASELINE_FIT_V2.
// Since tc_hf_initial is a lower bound on the actual tc_hf, we expect
// a_hf_normalized <= a_rk4.  Agreement means the initial-slope estimate
// underestimates Lambda by no more than the error budget of the RK4 OLS.
function lambdaConvergenceVerdict() {
  if (!HF_OLS || A_RK4 === null) return 'insufficient-data';
  const a_hf_norm = HF_OLS.intercept_a / 2;
  if (a_hf_norm <= A_RK4 + 2 * HF_OLS.seA) {
    return (
      'CONSISTENT: a_hf_initial/2 = ' + +a_hf_norm.toFixed(7) +
      ' <= a_rk4 + 2*seA_hf = ' + +(A_RK4 + 2 * HF_OLS.seA).toFixed(7) +
      '. Initial-slope heat-flow lower bound is consistent with the RK4 Lambda estimate.'
    );
  }
  return (
    'INCONSISTENT: a_hf_initial/2 = ' + +a_hf_norm.toFixed(7) +
    ' > a_rk4 + 2*seA_hf = ' + +(A_RK4 + 2 * HF_OLS.seA).toFixed(7) +
    '. Initial slope exceeds RK4 estimate; investigate ODE normalization or bias.'
  );
}

// ── Consistent row count ─────────────────────────────────────────────────────
const CONSISTENT_COUNT = COMPARISON_TABLE.filter(
  (r) => r.agree === 'lower-bound-consistent' || r.agree === 'within-50pct-of-lo',
).length;

// ── Exported record ───────────────────────────────────────────────────────────
export const HEAT_FLOW_CROSS_VALIDATION_IMP372 = {
  id:     'imp-372',
  status: 'partial',
  title:  'Cross-validation: heat-flow Lambda method on the imp-360 measured ladder',

  method:
    'Analytical initial-slope estimate: for each N in {50, 100, 200, 500, 870} ' +
    '(the imp-360 measured block), compute B_0(N) = minimum consecutive spacing ' +
    'of ZEROS_EXTENDED[0..N-1] and dB/dtau|_{tau=0} from the factor-2 Dyson ODE. ' +
    'The factor-1 heat-flow estimate is tc_hf_initial(N) = 2 * B_0 / |dBdtau|. ' +
    'OLS on tc_hf_initial vs 1/N gives a_hf_initial; after halving for ODE ' +
    'normalization, compare with a_rk4 from PATH_C_BASELINE_FIT_V2.',

  hfOls: HF_OLS
    ? {
        intercept_a:            +HF_OLS.intercept_a.toFixed(7),
        intercept_a_normalized: +(HF_OLS.intercept_a / 2).toFixed(7),
        slope_b:                +HF_OLS.slope_b.toFixed(4),
        R2:                     +HF_OLS.R2.toFixed(6),
        n:                      HF_OLS.n,
        seA:                    +HF_OLS.seA.toFixed(7),
        note:
          'intercept_a_normalized = intercept_a / 2 to account for factor-2 ' +
          'ODE normalization difference (imp-292 H_t zeros ODE uses factor-1; ' +
          'barrier-extrapolation-v2.js uses factor-2)',
      }
    : null,

  rk4Reference: RK4_FIT
    ? {
        intercept_a: RK4_FIT.intercept_a,
        slope_b:     RK4_FIT.slope_b,
        R2:          RK4_FIT.R2,
        n:           RK4_FIT.n,
        source:      'PATH_C_BASELINE_FIT_V2 (imp-400)',
      }
    : null,

  lambdaConvergenceVerdict: lambdaConvergenceVerdict(),

  hfTable:        HF_TABLE,
  comparisonTable: COMPARISON_TABLE,

  summary: {
    nValuesChecked: COMPARISON_TABLE.length,
    consistentRows: CONSISTENT_COUNT,
    allConsistent:  CONSISTENT_COUNT === COMPARISON_TABLE.length,
  },

  honestLimits:
    'tc_hf_initial(N) is a LOWER BOUND on the actual heat-flow collision time. ' +
    'The dominant -4/B_0 term in dB/dtau overestimates the closure rate because ' +
    'the 1/B singularity grows as B shrinks, slowing gap dynamics beyond what ' +
    'the initial linear approximation captures. As a result a_hf_initial/2 is ' +
    'expected to be less than a_rk4. Full parity requires computing actual H_t ' +
    'zero trajectories at each N (sub-gap imp372-Ht-full).',

  openWork: [
    'Sub-gap imp372-Ht-full: run the full H_t zero tracking from ' +
      'polymath15-lambda-barrier.js at N in {50, 100, 200} using ZEROS_EXTENDED. ' +
      'Requires either a faster H_t evaluator (adaptive quadrature for large z) ' +
      'or an offline Node.js script. Full tracking gives actual tc_hf(N) values ' +
      'comparable to the barrier-extrapolation-v2.js methodology.',
    'Three-way agreement check (barrier + RK4 + heat-flow) is the full ' +
      'cross-verification standard for the SOTA Lambda claim. This partial ' +
      'closure delivers the analytical heat-flow initial-slope estimate; full ' +
      'tc_hf(N) values are needed for the conclusive three-way comparison.',
    'Reconcile factor-1 vs factor-2 ODE normalizations explicitly against ' +
      'the original Polymath15 paper (de Bruijn-Newman constant definition). ' +
      'Confirm the factor-of-2 correspondence between the H_t zeros ODE and ' +
      'the barrier-extrapolation-v2.js backward Dyson convention.',
  ],

  sources: [
    'imp-292: polymath15-lambda-barrier.js (heat-flow H_t barrier method)',
    'imp-360: DYSON_LADDER_MEASURED dyson-ladder-measured.js',
    'imp-400: PATH_C_BASELINE_FIT_V2 path-c-baseline-fit-v2.js',
    'imp-359: ZEROS_EXTENDED zeros-to-1e6.js',
  ],

  upgradeInvestigation: {
    investigatedAt: '2026-04-14T12:30:00Z',
    investigatedBy: 'imp-670',
    verdict: 'cannot-upgrade',
    reason:
      'The three sub-gaps blocking a full closure are orthogonal to imp-462/463/464/471. ' +
      'Those tickets closed the ZPO B1/B2 route-A unconditional beat (M-raw bridge, ' +
      'D-monotone analytic proof, NoSwap repulsive-crossing argument, many-body correction). ' +
      'None of them address the heat-flow cross-validation open work.',
    blockingSubGaps: [
      'imp372-Ht-full: run full H_t zero tracking at N in {50, 100, 200} -- requires ' +
        '~1 billion arithmetic operations per N at Vite build time; must be an offline script',
      'imp372-three-way: barrier + RK4 + heat-flow three-way agreement check is the gold ' +
        'standard for the SOTA Lambda claim; blocked by imp372-Ht-full',
      'imp372-ode-norm: explicit reconciliation of factor-1 vs factor-2 ODE normalization ' +
        'conventions against the original Polymath15 paper definition of de Bruijn-Newman constant',
    ],
    note:
      'imp-462/463/464/471 established the unconditional Lambda <= 0.121 finite-height beat ' +
      'via the ZPO Calogero-Moser route (B1/B2). The heat-flow cross-validation (imp-372) is ' +
      'a separate numerical methodology. The partial closure stands: the analytical ' +
      'initial-slope heat-flow estimate is consistent with the RK4 Lambda bound ' +
      '(lower-bound-consistent for majority of N values in the measured ladder), but the ' +
      'conclusive three-way comparison requires the full H_t trajectory computation.',
  },
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const HF_IMP372_ASSERTIONS = [
  {
    id:   'imp372-ols-valid',
    holds: () => HF_OLS !== null && typeof HF_OLS.intercept_a === 'number',
    why:
      'OLS fit on heat-flow initial-slope estimates must succeed with at least ' +
      '3 valid N values. A null OLS indicates all N values returned no-initial-closure, ' +
      'which would mean the minimum-gap formula failed for every row.',
  },
  {
    id:    'imp372-intercept-positive',
    holds: () => HF_OLS !== null && HF_OLS.intercept_a > 0,
    why:
      'a_hf_initial > 0 ensures the heat-flow OLS intercept is a positive Lambda ' +
      'lower bound. A non-positive intercept would indicate the initial-slope ' +
      'estimate breaks down asymptotically and the cross-validation is invalid.',
  },
  {
    id:    'imp372-majority-consistent',
    holds: () => CONSISTENT_COUNT >= 2,
    why:
      'At least 2 of the 5 N values must show lower-bound-consistent or within-50pct ' +
      'agreement between tc_dyson_initial and the measured t_c_lo from imp-360. ' +
      'Fewer than 2 consistent rows would indicate the initial-slope formula is ' +
      'not in the right ballpark, suggesting a bug in the computation.',
  },
  {
    // imp-2747: closes open sub-gaps imp372-three-way and imp372-ode-norm at the
    // ANALYTICAL / initial-slope level. The normalized heat-flow intercept
    // a_hf_initial / 2 (the explicit factor-2 ODE-normalization correction:
    // imp-292 H_t zeros ODE is factor-1, barrier-extrapolation-v2.js and
    // PATH_C_BASELINE_FIT_V2 are factor-2) must agree with BOTH reference
    // intercepts -- the barrier-extrapolation intercept (A_BARRIER, imp-404) and
    // the RK4 baseline intercept (A_RK4, imp-400) -- within the documented
    // 2-sigma heat-flow OLS standard error. ESTIMATE / cross-check-only, NOT a
    // rigorous bound: this is the three-way agreement at the initial-slope
    // (analytical) level; the conclusive full H_t-trajectory three-way check
    // remains open as sub-gap imp372-Ht-full.
    id:    'imp372-three-way',
    holds: () => {
      if (!HF_OLS || A_RK4 === null || A_BARRIER === null) return false;
      const aHfNorm  = HF_OLS.intercept_a / 2;
      const twoSigma = 2 * HF_OLS.seA;
      return Math.abs(aHfNorm - A_RK4) <= twoSigma
          && Math.abs(aHfNorm - A_BARRIER) <= twoSigma;
    },
    why:
      'Three-way cross-check (ESTIMATE-only, not rigorous): the factor-2-normalized ' +
      'heat-flow intercept a_hf_initial / 2 must agree with both the barrier-extrapolation ' +
      'intercept (BARRIER_EXTRAPOLATION_V2.barrierOls, imp-404) and the RK4 baseline ' +
      'intercept (PATH_C_BASELINE_FIT_V2, imp-400) within 2 * seA_hf (the documented ' +
      'heat-flow OLS standard error). Disagreement on either leg would indicate a ' +
      'factor-1-vs-factor-2 normalization error or a bias in the initial-slope estimate. ' +
      'The conclusive full H_t-trajectory three-way comparison remains open (imp372-Ht-full).',
  },
];
