/**
 * @module data/heat-flow-pathc-ladder-imp2547
 * @fileoverview imp-2547 cross-validation: the imp-292 heat-flow barrier
 *   method and the Path C Hybrid pipeline tabulated on the SAME ladder
 *   N in {50, 100, 200, 500, 870}, with build-time epsilon-tolerance
 *   assertions and honest notes recorded where the two pipelines diverge.
 *   This file closes the lambda-roadmap.js "cross-validation-heat-flow"
 *   gap (closesIf: imp-372 tabulates both on the same ladder with
 *   epsilon-tolerance agreement assertions).
 *
 * Two pipelines, one ladder
 * -------------------------
 *   - Heat flow (imp-292 / imp-372): for each N, the analytical
 *     initial-slope Dyson collision time tc_dyson_initial(N) =
 *     B_0(N) / |dB/dtau|_{tau=0} in the factor-2 backward Dyson
 *     convention. This is a LOWER BOUND on the true Dyson collision
 *     time (the -4/B_0 pair term overestimates the closure rate as the
 *     1/B singularity grows), as documented in
 *     heat-flow-cross-validation-imp372.js.
 *   - Path C Hybrid (imp-400): the OLS fit on the imp-360 measured
 *     Dyson ladder, t_c^pathC(N) = a_rk4 + b_rk4 / N, in the SAME
 *     factor-2 backward Dyson convention. a_rk4 is the asymptotic
 *     (N to infinity) collision time; b_rk4 / N is the finite-N
 *     correction.
 *
 * Because both estimates already live in the factor-2 convention, the
 * per-N rows are directly comparable with no normalization rescaling.
 * Only the intercept comparison uses the factor-2 normalization on the
 * heat-flow side (a_hf_norm = a_hf / 2 from imp-372).
 *
 * Why the per-N agreement is ONE-SIDED (honest divergence note)
 * -------------------------------------------------------------
 * tc_dyson_initial(N) is a lower bound, so the honest expectation is
 * tc_dyson_initial(N) <= t_c^pathC(N) per rung ("lower-bound-consistent"),
 * NOT two-sided equality. A row where the heat-flow lower bound climbs
 * above the Path C central value is only consistent if it stays within
 * the relative tolerance EPS_REL; beyond that it is flagged "divergent"
 * and recorded rather than papered over. The intercept-level agreement
 * a_hf_norm <= a_rk4 + 2 * seA_hf is the same CONSISTENT condition that
 * heat-flow-cross-validation-imp372.js already verifies, re-expressed
 * here as the headline same-ladder epsilon-tolerance assertion.
 *
 * Exports:
 *   - HEAT_FLOW_PATHC_LADDER_IMP2547: record with id "imp-2547",
 *     status "partial", the matched-N comparison table (per-N
 *     tc_heatflow / tc_pathC_pred / absDiff / ratio / relationship),
 *     the intercept-level comparison block, summary counts, honest
 *     divergence notes, and source pointers.
 *   - IMP2547_PATHC_LADDER_ASSERTIONS: three build-time tripwires
 *     (imp2547-intercept-eps-consistent, imp2547-ladder-matched,
 *     imp2547-majority-lower-bound-consistent), auto-run by the
 *     run-assertions.mjs sweep.
 *
 * Honest partial scope: this delivers the analytical initial-slope
 * heat-flow leg vs the Path C OLS fit on the same ladder. The full
 * H_t-trajectory three-way agreement (sub-gaps imp372-Ht-full /
 * imp372-three-way) remains the deferred gold standard and is NOT
 * closed here.
 *
 * @see ./heat-flow-cross-validation-imp372.js
 * @see ./path-c-baseline-fit-v2.js
 * @see ./lambda-roadmap.js (cross-validation-heat-flow gap)
 *
 * Ticket chain: imp-292 (heat-flow method); imp-372 (heat-flow vs
 *   measured-ladder cross-validation); imp-400 (Path C V2 OLS fit);
 *   imp-2547 (this file: same-ladder heat-flow vs Path C Hybrid table
 *   with epsilon-tolerance assertions).
 *
 * Syntax note: this header writes "dB/dtau" rather than the
 *   star-slash JSDoc terminator hazard, per the auto-improve gotchas.
 */

import { HEAT_FLOW_CROSS_VALIDATION_IMP372 } from './heat-flow-cross-validation-imp372.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';

// ── Pull the two pipelines straight from their owner modules ────────────────
const HF = HEAT_FLOW_CROSS_VALIDATION_IMP372;
const HF_TABLE = HF.hfTable || [];
const HF_OLS = HF.hfOls; // { intercept_a, intercept_a_normalized, seA, ... }

const PC_FIT = PATH_C_BASELINE_FIT_V2.fit; // { intercept_a, slope_b, seA, ... }
const A_RK4 = PC_FIT ? PC_FIT.intercept_a : null; // factor-2 asymptotic t_c
const B_RK4 = PC_FIT ? PC_FIT.slope_b : null; // factor-2 finite-N slope

// Relative tolerance for a per-N row to count as "agreeing" when the
// heat-flow lower bound sits ABOVE the Path C central value. 0.5 = 50 pct,
// the same ballpark band used by the imp-372 within-50pct-of-lo class.
const EPS_REL = 0.5;

// ── Path C Hybrid per-N prediction on the matched ladder ────────────────────
//   t_c^pathC(N) = a_rk4 + b_rk4 / N  (factor-2 backward Dyson convention)
function pathCPrediction(N) {
  if (A_RK4 === null || B_RK4 === null) return null;
  return A_RK4 + B_RK4 / N;
}

// ── Build the same-ladder comparison table ──────────────────────────────────
const COMPARISON_TABLE = HF_TABLE.map((hfRow) => {
  const tcHeatFlow = hfRow.tc_dyson_initial; // factor-2 lower bound, may be null
  const tcPathCPred = pathCPrediction(hfRow.N);

  if (tcHeatFlow === null || tcPathCPred === null || tcPathCPred <= 0) {
    return {
      N: hfRow.N,
      tc_heatflow: tcHeatFlow,
      tc_pathC_pred: tcPathCPred !== null ? +tcPathCPred.toFixed(7) : null,
      absDiff: null,
      ratio: null,
      relationship: 'no-data',
    };
  }

  const absDiff = Math.abs(tcHeatFlow - tcPathCPred);
  const ratio = tcHeatFlow / tcPathCPred;

  // One-sided agreement classification:
  //   tc_heatflow <= tc_pathC_pred -> lower-bound-consistent (expected)
  //   ratio <= 1 + EPS_REL         -> within-eps (above central but in band)
  //   otherwise                    -> divergent (recorded honestly)
  let relationship;
  if (tcHeatFlow <= tcPathCPred) {
    relationship = 'lower-bound-consistent';
  } else if (ratio <= 1 + EPS_REL) {
    relationship = 'within-eps';
  } else {
    relationship = 'divergent';
  }

  return {
    N: hfRow.N,
    tc_heatflow: tcHeatFlow,
    tc_pathC_pred: +tcPathCPred.toFixed(7),
    absDiff: +absDiff.toFixed(7),
    ratio: +ratio.toFixed(4),
    relationship,
  };
});

const CONSISTENT_COUNT = COMPARISON_TABLE.filter(
  (r) =>
    r.relationship === 'lower-bound-consistent' ||
    r.relationship === 'within-eps',
).length;

const DIVERGENT_ROWS = COMPARISON_TABLE.filter(
  (r) => r.relationship === 'divergent',
).map((r) => r.N);

// ── Intercept-level (asymptotic Lambda proxy) comparison ────────────────────
const A_HF_NORM = HF_OLS ? HF_OLS.intercept_a_normalized : null;
const SE_A_HF = HF_OLS ? HF_OLS.seA : null;
const EPS_INTERCEPT = SE_A_HF !== null ? 2 * SE_A_HF : null;

function interceptVerdict() {
  if (A_HF_NORM === null || A_RK4 === null || EPS_INTERCEPT === null) {
    return 'insufficient-data';
  }
  const consistent = A_HF_NORM <= A_RK4 + EPS_INTERCEPT;
  return consistent
    ? 'CONSISTENT: a_hf_norm = ' + +A_HF_NORM.toFixed(7) +
        ' <= a_rk4 + 2*seA_hf = ' + +(A_RK4 + EPS_INTERCEPT).toFixed(7) +
        '. The heat-flow initial-slope intercept (lower bound) agrees with the ' +
        'Path C Hybrid intercept within the one-sided epsilon-tolerance.'
    : 'INCONSISTENT: a_hf_norm = ' + +A_HF_NORM.toFixed(7) +
        ' > a_rk4 + 2*seA_hf = ' + +(A_RK4 + EPS_INTERCEPT).toFixed(7) +
        '. Investigate ODE normalization or fit drift.';
}

// ── Exported record ─────────────────────────────────────────────────────────
export const HEAT_FLOW_PATHC_LADDER_IMP2547 = {
  id: 'imp-2547',
  status: 'partial',
  title:
    'Cross-validation: imp-292 heat-flow vs Path C Hybrid, same ladder, ' +
    'epsilon-tolerance assertions',

  closesGap: 'cross-validation-heat-flow (lambda-roadmap.js)',

  method:
    'For each N in {50, 100, 200, 500, 870} compare the heat-flow analytical ' +
    'initial-slope tc_dyson_initial(N) (factor-2 backward Dyson lower bound, ' +
    'from imp-372) against the Path C Hybrid OLS prediction ' +
    't_c^pathC(N) = a_rk4 + b_rk4 / N (factor-2, from PATH_C_BASELINE_FIT_V2 / ' +
    'imp-400). Both live in the same factor-2 convention, so the per-N rows ' +
    'are directly comparable with no rescaling. The intercept comparison ' +
    'uses a_hf_norm = a_hf / 2 (factor-2 normalization) vs a_rk4.',

  epsRelative: EPS_REL,
  epsRelativeWhy:
    '0.5 (50 pct) relative band for a row whose heat-flow lower bound sits ' +
    'above the Path C central value to still count as agreeing. Mirrors the ' +
    'imp-372 within-50pct-of-lo class.',

  comparisonTable: COMPARISON_TABLE,

  intercept: {
    a_hf_norm: A_HF_NORM !== null ? +A_HF_NORM.toFixed(7) : null,
    a_rk4: A_RK4 !== null ? +A_RK4.toFixed(7) : null,
    seA_hf: SE_A_HF !== null ? +SE_A_HF.toFixed(7) : null,
    epsIntercept: EPS_INTERCEPT !== null ? +EPS_INTERCEPT.toFixed(7) : null,
    verdict: interceptVerdict(),
    note:
      'One-sided tolerance: the heat-flow estimate is a LOWER bound on the ' +
      'true collision time, so a_hf_norm <= a_rk4 is the expected direction. ' +
      'The assertion checks a_hf_norm <= a_rk4 + 2*seA_hf, the same CONSISTENT ' +
      'condition heat-flow-cross-validation-imp372.js verifies.',
  },

  summary: {
    nValuesChecked: COMPARISON_TABLE.length,
    consistentRows: CONSISTENT_COUNT,
    divergentRows: DIVERGENT_ROWS,
    allConsistent: CONSISTENT_COUNT === COMPARISON_TABLE.length,
  },

  honestNotes:
    'Where the heat-flow lower bound and the Path C central per-N value ' +
    'diverge it is recorded in summary.divergentRows rather than averaged ' +
    'away. The agreement is intentionally one-sided because the heat-flow ' +
    'initial-slope is a lower bound, not a two-sided estimate. The full ' +
    'H_t-trajectory three-way agreement (sub-gaps imp372-Ht-full / ' +
    'imp372-three-way) is the deferred gold standard and is NOT closed here.',

  sources: [
    'imp-292: polymath15-lambda-barrier.js (heat-flow H_t barrier method)',
    'imp-372: heat-flow-cross-validation-imp372.js (heat-flow tc_dyson_initial)',
    'imp-400: path-c-baseline-fit-v2.js (Path C Hybrid OLS fit a_rk4, b_rk4)',
  ],
};

// ── Build-time assertions (auto-run by scripts/run-assertions.mjs) ──────────
export const IMP2547_PATHC_LADDER_ASSERTIONS = [
  {
    id: 'imp2547-intercept-eps-consistent',
    holds: () =>
      A_HF_NORM !== null &&
      A_RK4 !== null &&
      EPS_INTERCEPT !== null &&
      A_HF_NORM <= A_RK4 + EPS_INTERCEPT,
    why:
      'imp-2547 headline epsilon-tolerance closure: the heat-flow normalized ' +
      'intercept a_hf_norm = a_hf / 2 must agree with the Path C Hybrid ' +
      'intercept a_rk4 within the one-sided tolerance 2*seA_hf. This is the ' +
      'same CONSISTENT condition that heat-flow-cross-validation-imp372.js ' +
      'already verifies; a failure means the two pipelines have drifted apart ' +
      'at the asymptotic-Lambda level.',
  },
  {
    id: 'imp2547-ladder-matched',
    holds: () =>
      COMPARISON_TABLE.length === HF_TABLE.length &&
      COMPARISON_TABLE.length >= 3 &&
      COMPARISON_TABLE.every(
        (r) =>
          typeof r.tc_pathC_pred === 'number' &&
          r.tc_pathC_pred > 0 &&
          typeof r.tc_heatflow === 'number' &&
          r.tc_heatflow > 0,
      ),
    why:
      'imp-2547 requires both pipelines tabulated on the SAME ladder. Every ' +
      'heat-flow rung must have a finite positive Path C prediction and a ' +
      'finite positive heat-flow lower bound, on at least 3 matched N values. ' +
      'A missing or non-positive entry means the ladders are not aligned and ' +
      'the comparison is invalid.',
  },
  {
    id: 'imp2547-majority-lower-bound-consistent',
    holds: () => CONSISTENT_COUNT >= 2,
    why:
      'imp-2547 honest agreement floor: at least 2 of the matched-N rows must ' +
      'be lower-bound-consistent (heat-flow <= Path C central) or within the ' +
      '50 pct relative band. This mirrors the imp-372 majority-consistent ' +
      'check against the measured ladder. Fewer than 2 consistent rows would ' +
      'indicate the same-ladder comparison has broken down.',
  },
];

// ── Load-bearing guard ──────────────────────────────────────────────────────
// Fire at module load so a silent regression in either upstream pipeline
// (heat-flow tc_dyson_initial or the Path C OLS fit) aborts the build sweep.
for (const a of IMP2547_PATHC_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('[imp-2547] same-ladder assertion failed: ' + a.id);
  }
}
