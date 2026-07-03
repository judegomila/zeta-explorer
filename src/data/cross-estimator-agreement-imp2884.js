/**
 * @module data/cross-estimator-agreement-imp2884
 * @fileoverview imp-2884 single build-time tripwire asserting that all three
 *   heuristic finite-N Lambda-intercept ESTIMATES triangulate the same
 *   asymptotic collision-time intercept within their mutually-declared
 *   agreement bands. Previously the three estimators each compared only
 *   pairwise against the Path C / interval-RK4 reference in their own owner
 *   modules; there was no single module asserting the full triangle agrees.
 *
 * The three estimators (all proxies for the same N to infinity intercept a)
 * --------------------------------------------------------------------------
 *   1. Heat flow (imp-292 / imp-372): a_hf_norm = a_hf / 2, the normalized
 *      OLS intercept of the analytical initial-slope Dyson collision-time
 *      estimates. This is a LOWER BOUND on the true intercept (the -4/B_0
 *      pair term overestimates the closure rate), so its agreement with the
 *      other two is ONE-SIDED: a_hf_norm <= a_other + band.
 *      Source: heat-flow-cross-validation-imp372.js -> hfOls.
 *   2. Barrier extrapolation (imp-299 / imp-404): a_barrier, the OLS
 *      intercept in 1/N of the backward-Euler barrier collision times.
 *      A genuine (biased) two-sided estimate of the same intercept.
 *      Source: barrier-extrapolation-v2.js -> barrierOls.
 *   3. Path C / interval-RK4 baseline (imp-400), the reference intercept
 *      a_rk4 that the kernel-hack imp-360 analytical-Lambda table consumes
 *      (kernel-hack-at-imp360.js reads PATH_C_BASELINE_FIT_V2.fit.intercept_a
 *      as its OLS anchor). This is the central reference leg of the triangle.
 *      Source: path-c-baseline-fit-v2.js -> fit.
 *
 * Mutually-declared agreement bands (REUSED, not reinvented)
 * ----------------------------------------------------------
 * This module introduces NO new arbitrary tolerance. Each pairwise band is
 * the exact band the owner module already publishes:
 *   - barrier vs RK4: |a_barrier - a_rk4| <= 2 * seA_rk4
 *       (the threshold in barrier-extrapolation-v2.js lambdaVerdict()).
 *   - heat-flow vs RK4: a_hf_norm <= a_rk4 + 2 * seA_hf  (one-sided)
 *       (the CONSISTENT condition in heat-flow-cross-validation-imp372.js
 *        and heat-flow-pathc-ladder-imp2547.js).
 *   - heat-flow vs barrier: a_hf_norm <= a_barrier + 2 * seA_combined
 *       (one-sided, seA_combined = sqrt(seA_hf^2 + seA_barrier^2); the same
 *        lower-bound logic since the heat-flow leg is a lower bound, applied
 *        to the barrier estimate with its own fit uncertainty folded in).
 *
 * Honest labelling (imp-2754 guard)
 * ---------------------------------
 * Every leg stays an ESTIMATE. This tripwire asserts mutual numerical
 * AGREEMENT of three heuristics; it does NOT promote any of them to a
 * rigorous bound, and the Lambda finite-height claim continues to rest on
 * the certified interval-RK4 brackets, not on this triangulation.
 *
 * Exports:
 *   - CROSS_ESTIMATOR_AGREEMENT_IMP2884: record (id "imp-2884", status
 *     "complete") with the three baked intercepts, the three pairwise
 *     agreement blocks (delta / band / verdict), and an allAgree summary.
 *   - CROSS_ESTIMATOR_AGREEMENT_IMP2884_ASSERTIONS: build-time tripwires
 *     (one per pair plus a data-present guard), auto-run by the
 *     run-assertions.mjs sweep.
 *
 * @see ./heat-flow-cross-validation-imp372.js
 * @see ./barrier-extrapolation-v2.js
 * @see ./path-c-baseline-fit-v2.js
 * @see ./kernel-hack-at-imp360.js
 *
 * Syntax note: this header writes "dB/dtau" rather than the star-slash JSDoc
 *   terminator hazard, per the auto-improve gotchas.
 */

import { HEAT_FLOW_CROSS_VALIDATION_IMP372 } from './heat-flow-cross-validation-imp372.js';
import { BARRIER_EXTRAPOLATION_V2 } from './barrier-extrapolation-v2.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';

// ── Pull the three estimator intercepts straight from their owner modules ────
const HF_OLS = HEAT_FLOW_CROSS_VALIDATION_IMP372.hfOls; // heat-flow (imp-292/372)
const BAR_OLS = BARRIER_EXTRAPOLATION_V2.barrierOls;    // barrier (imp-299/404)
const RK4_FIT = PATH_C_BASELINE_FIT_V2.fit;             // Path C / RK4 (imp-400)

const A_HF = HF_OLS ? HF_OLS.intercept_a_normalized : null; // a_hf / 2 (lower bound)
const SE_HF = HF_OLS ? HF_OLS.seA : null;
const A_BAR = BAR_OLS ? BAR_OLS.intercept_a : null;
const SE_BAR = BAR_OLS ? BAR_OLS.seA : null;
const A_RK4 = RK4_FIT ? RK4_FIT.intercept_a : null;         // central reference leg
const SE_RK4 = RK4_FIT ? RK4_FIT.seA : null;

const HAVE_ALL =
  A_HF !== null && SE_HF !== null &&
  A_BAR !== null && SE_BAR !== null &&
  A_RK4 !== null && SE_RK4 !== null;

// ── Pairwise agreement helpers ───────────────────────────────────────────────
// Two-sided (both are genuine estimates of the same intercept).
function twoSidedPair(aLabel, a, bLabel, b, band, bandLabel) {
  const delta = Math.abs(a - b);
  return {
    pair: aLabel + ' vs ' + bLabel,
    a: +a.toFixed(7),
    b: +b.toFixed(7),
    delta: +delta.toFixed(7),
    band: +band.toFixed(7),
    bandLabel,
    sided: 'two-sided',
    agree: delta <= band,
  };
}

// One-sided (the heat-flow leg is a LOWER bound, so only over-shoot beyond the
// band counts as disagreement; under-shoot is the expected direction).
function lowerBoundPair(loLabel, lo, hiLabel, hi, band, bandLabel) {
  const over = lo - hi; // positive only if the lower-bound estimate over-shoots
  return {
    pair: loLabel + ' vs ' + hiLabel,
    a: +lo.toFixed(7),
    b: +hi.toFixed(7),
    overshoot: +over.toFixed(7),
    band: +band.toFixed(7),
    bandLabel,
    sided: 'one-sided (heat-flow is a lower bound)',
    agree: lo > 0 && lo <= hi + band,
  };
}

const SE_HF_BAR = HAVE_ALL ? Math.sqrt(SE_HF * SE_HF + SE_BAR * SE_BAR) : null;

const PAIR_BARRIER_RK4 = HAVE_ALL
  ? twoSidedPair('barrier', A_BAR, 'rk4', A_RK4, 2 * SE_RK4, '2 * seA_rk4')
  : null;
const PAIR_HF_RK4 = HAVE_ALL
  ? lowerBoundPair('heat-flow', A_HF, 'rk4', A_RK4, 2 * SE_HF, '2 * seA_hf')
  : null;
const PAIR_HF_BARRIER = HAVE_ALL
  ? lowerBoundPair('heat-flow', A_HF, 'barrier', A_BAR, 2 * SE_HF_BAR, '2 * sqrt(seA_hf^2 + seA_barrier^2)')
  : null;

const ALL_PAIRS = [PAIR_BARRIER_RK4, PAIR_HF_RK4, PAIR_HF_BARRIER].filter(Boolean);
const ALL_AGREE = HAVE_ALL && ALL_PAIRS.every((p) => p.agree);

// ── Exported record ──────────────────────────────────────────────────────────
export const CROSS_ESTIMATOR_AGREEMENT_IMP2884 = {
  id: 'imp-2884',
  status: 'complete',
  title:
    'Cross-estimator agreement: heat-flow (imp-292/372), barrier (imp-299/404) ' +
    'and Path-C/RK4 (imp-400, consumed by kernel-hack imp-360) intercepts ' +
    'triangulate within their mutually-declared bands',

  method:
    'Read the three baked Lambda-intercept ESTIMATES (heat-flow a_hf_norm, ' +
    'barrier a_barrier, Path-C/RK4 a_rk4) and assert each pair agrees within ' +
    'the band the owner module already publishes. The heat-flow leg is a ' +
    'LOWER bound, so its two pairings are one-sided; the barrier vs RK4 ' +
    'pairing is two-sided. No new tolerance is introduced.',

  estimators: {
    heatFlow: {
      label: 'ESTIMATE (lower bound)',
      a_hf_norm: A_HF !== null ? +A_HF.toFixed(7) : null,
      seA: SE_HF !== null ? +SE_HF.toFixed(7) : null,
      source: 'heat-flow-cross-validation-imp372.js (imp-292/372)',
    },
    barrier: {
      label: 'ESTIMATE',
      a_barrier: A_BAR !== null ? +A_BAR.toFixed(7) : null,
      seA: SE_BAR !== null ? +SE_BAR.toFixed(7) : null,
      source: 'barrier-extrapolation-v2.js (imp-299/404)',
    },
    rk4: {
      label: 'ESTIMATE (central reference, consumed by kernel-hack imp-360)',
      a_rk4: A_RK4 !== null ? +A_RK4.toFixed(7) : null,
      seA: SE_RK4 !== null ? +SE_RK4.toFixed(7) : null,
      source: 'path-c-baseline-fit-v2.js (imp-400) <- kernel-hack-at-imp360.js',
    },
  },

  pairwise: {
    barrier_vs_rk4: PAIR_BARRIER_RK4,
    heatflow_vs_rk4: PAIR_HF_RK4,
    heatflow_vs_barrier: PAIR_HF_BARRIER,
  },

  summary: {
    allAgree: ALL_AGREE,
    pairsChecked: ALL_PAIRS.length,
    pairsAgreeing: ALL_PAIRS.filter((p) => p.agree).length,
  },

  honestLimits:
    'Each leg stays an ESTIMATE; this module asserts mutual numerical ' +
    'agreement of three heuristics, NOT promotion to a rigorous bound ' +
    '(imp-2754 guard). The certified Lambda finite-height claim continues to ' +
    'rest on the interval-RK4 brackets, not on this triangulation. The bands ' +
    'are the owner modules’ own published tolerances; a build-time ' +
    'failure here means one estimator regressed relative to the other two.',

  sources: [
    'imp-292/372: heat-flow-cross-validation-imp372.js (a_hf_norm)',
    'imp-299/404: barrier-extrapolation-v2.js (a_barrier)',
    'imp-400: path-c-baseline-fit-v2.js (a_rk4)',
    'imp-360: kernel-hack-at-imp360.js (consumer of a_rk4 as its OLS anchor)',
    'imp-2547: heat-flow-pathc-ladder-imp2547.js (pairwise heat-flow vs Path C precedent)',
  ],
};

// ── Build-time assertions (auto-run by scripts/run-assertions.mjs) ───────────
export const CROSS_ESTIMATOR_AGREEMENT_IMP2884_ASSERTIONS = [
  {
    id: 'imp2884-estimators-present',
    holds: () => HAVE_ALL,
    why:
      'All three estimator intercepts (heat-flow a_hf_norm, barrier a_barrier, ' +
      'Path-C/RK4 a_rk4) plus their standard errors must be present. A null leg ' +
      'means an upstream OLS fit failed, which is itself a regression to surface.',
  },
  {
    id: 'imp2884-barrier-rk4-agree',
    holds: () => PAIR_BARRIER_RK4 !== null && PAIR_BARRIER_RK4.agree,
    why:
      'Barrier and Path-C/RK4 intercepts must agree within 2*seA_rk4 (the band ' +
      'barrier-extrapolation-v2.js lambdaVerdict already publishes). These are ' +
      'two independent estimates of the same N to infinity intercept; drift ' +
      'beyond the band signals a regression in either the barrier Euler step or ' +
      'the interval-RK4 ladder.',
  },
  {
    id: 'imp2884-heatflow-rk4-agree',
    holds: () => PAIR_HF_RK4 !== null && PAIR_HF_RK4.agree,
    why:
      'The heat-flow normalized intercept (a LOWER bound) must satisfy ' +
      'a_hf_norm <= a_rk4 + 2*seA_hf, the same one-sided CONSISTENT condition ' +
      'heat-flow-cross-validation-imp372.js verifies. A failure means the ' +
      'heat-flow leg over-shot the reference beyond its declared uncertainty.',
  },
  {
    id: 'imp2884-heatflow-barrier-agree',
    holds: () => PAIR_HF_BARRIER !== null && PAIR_HF_BARRIER.agree,
    why:
      'The heat-flow lower bound must also sit below the barrier estimate ' +
      'within the combined fit uncertainty 2*sqrt(seA_hf^2 + seA_barrier^2). ' +
      'This closes the third edge of the triangle so no pair can silently drift ' +
      'while the other two still agree.',
  },
];

// ── Load-bearing guard ───────────────────────────────────────────────────────
// Fire at module load so a silent regression in any one estimator aborts the
// build-assertion sweep rather than passing unnoticed.
for (const a of CROSS_ESTIMATOR_AGREEMENT_IMP2884_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('[imp-2884] cross-estimator agreement assertion failed: ' + a.id);
  }
}
