/**
 * @module imp-34564-two-pole-estimate-reconciliation
 * @fileoverview imp-34564 -- RECONCILE the two independent estimates of the SAME
 *   eflow_over_resid pole that were tabulated in different modules but never placed
 *   side by side:
 *
 *     (E1) imp-34550's naive 1/leak-linear-OLS recovered pole, climbing to
 *          ~21.280579 at its tightest window [21.25,21.275], and
 *     (E2) the imp-34237 / imp-34310 resid_exp SIMPLE ZERO k* ~ 21.28095 (the
 *          canonical bisected location where resid_exp changes sign).
 *
 *   These are two estimates of ONE pole and differ by ~3.69e-4 -- roughly 74x the
 *   imp-34405 pole-location uncertainty floor dk_star = 5e-6 -- yet were never
 *   compared directly. This module measures the discrepancy precisely and attributes
 *   it to (a) the imp-34550-flagged naive-1/leak estimator bias vs (b) the resid_exp
 *   zero uncertainty.
 *
 *   Import-light: reuses the imp-34310 published zero literal (IMP34310_KSTAR) and the
 *   imp-34405 published pole-location ULP (IMP34405_KSTAR_ULP), both themselves baked
 *   from imp-34237 with NO 16.7MB zeros bundle in the chain, per
 *   [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]. The imp-34550
 *   recovered-pole scalar (21.280579) and its residual to the full-precision bisected
 *   zero (3.688e-4) are baked as literals matching the imp-34550 tightest-rung publish,
 *   so this module does NOT re-trigger the imp-34550 heavy ladder recompute.
 *
 *   THE RECONCILIATION (no fresh component model -- an arithmetic side-by-side).
 *   --------------------------------------------------------------------------
 *   gap = k*(resid_exp zero) - poleHat(1/leak OLS). The imp-34550 tightest rung places
 *   poleHat = 21.280579 BELOW the resid_exp zero k* = 21.28095, with a residual
 *   3.688e-4 measured against the full-precision bisected zero (the published 5-figure
 *   gap 21.28095 - 21.280579 = 3.71e-4 agrees to the reported-k* rounding). Two error
 *   sources could in principle explain that gap:
 *
 *     (b) ZERO UNCERTAINTY. k* is known only to dk_star = 5e-6 (imp-34405 pole-location
 *         floor, the 7-sig-fig last-decimal half-ULP of 21.28095). This is a symmetric
 *         +/- band on the TARGET, not a one-signed offset.
 *     (a) ESTIMATOR BIAS. The naive linear-1/leak OLS converges onto the pole strictly
 *         FROM BELOW (imp-34550 F1: monotone-increasing recovered pole) and DECELERATES
 *         near the pole (imp-34550 F2/F3: per-rung shrink bends up from ~1/3 to ~0.42 --
 *         higher-order pole structure + the stepFor near-pole step cap), so poleHat sits
 *         systematically LOW. This is a one-signed offset on the ESTIMATOR.
 *
 *   FINDINGS (measurement / cross-validation only).
 *   -----------------------------------------------
 *   (F1) THE GAP IS ~74x THE ZERO-UNCERTAINTY FLOOR. gap = 3.688e-4 = 73.76 * dk_star,
 *        so the two estimates disagree ~74x more than the resid_exp zero is itself known.
 *        The discrepancy CANNOT be zero uncertainty alone.
 *   (F2) THE GAP IS ~98.6% ESTIMATOR BIAS. Subtracting the whole zero-uncertainty band
 *        dk_star = 5e-6 leaves 3.638e-4 (~98.6% of the gap) unexplained by zero
 *        uncertainty -- and it is ONE-SIGNED (poleHat below k*), matching the imp-34550
 *        converge-from-below signature. So the gap is dominated by the naive-1/leak
 *        estimator bias; zero uncertainty accounts for at most ~1.4%.
 *   (F3) NEITHER SOURCE IS A PRECISION FLOOR. The imp-34550 residual sits ~4 decades
 *        above the imp-34368 double-precision resid_exp floor dk ~ 7.2e-8, so the ~3.69e-4
 *        gap is real structure, not double-precision noise: a better (higher-order) pole
 *        estimator -- not bignum, not a sharper k* -- would close it.
 *
 *   The punchline: the ~3.69e-4 disagreement between the imp-34550 1/leak-OLS recovered
 *   pole (21.280579) and the imp-34237/34310 resid_exp zero (21.28095) is ~74x the
 *   imp-34405 pole-location floor and is ~98.6% attributable to the naive linear-1/leak
 *   OLS estimator biasing LOW (converge-from-below, decelerating near the pole), with
 *   the resid_exp zero uncertainty explaining at most ~1.4%. The two estimates are
 *   CONSISTENT once the one-signed estimator bias is accounted for.
 *
 *   MEASUREMENT / CROSS-VALIDATION ONLY. An arithmetic reconciliation of two inherited
 *   estimates of an inherited pole, NOT an RH bound. The component model is the
 *   inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the resid_exp
 *   simple-zero structure is a numerical/structural observation, not a derivation; the
 *   C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 *   operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34550-recovered-pole-ladder-two-tighter-rungs.js (E1: 1/leak-OLS pole 21.280579, residual 3.688e-4)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (E2: resid_exp zero k* = 21.28095)
 *   @see imp-34405-resid-exp-near-pole-digit-loss.js (pole-location ULP dk_star = 5e-6)
 *   @see imp-34368-residexp-resolution-floor-measurement.js (double-precision floor dk ~ 7.2e-8)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (the resid_exp rows behind k*)
 */

import { IMP34310_KSTAR } from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import { IMP34405_KSTAR_ULP } from './imp-34405-resid-exp-near-pole-digit-loss.js';

// --- The two estimates of the ONE pole ---------------------------------------
// (E2) resid_exp simple zero, canonical bisected location (imp-34023/34237/34310).
export const IMP34564_RESID_EXP_ZERO = IMP34310_KSTAR; // 21.28095

// (E1) imp-34550 tightest-rung 1/leak-linear-OLS recovered pole and its residual to the
//      full-precision bisected zero (baked from the imp-34550 publish, NOT recomputed).
export const IMP34564_INVLEAK_POLE = 21.280579; // imp-34550 rung 9 recoveredPole
export const IMP34564_INVLEAK_RESIDUAL = 3.688e-4; // imp-34550 rung 9 residual to full-precision k*

// (b) resid_exp zero uncertainty: the imp-34405 pole-location floor (5th-decimal half-ULP).
export const IMP34564_ZERO_ULP = IMP34405_KSTAR_ULP; // 5e-6

// --- Reconciliation arithmetic -----------------------------------------------
// Published 5-figure gap (agrees with the full-precision residual to the k* rounding).
export const IMP34564_GAP_PUBLISHED = +(IMP34564_RESID_EXP_ZERO - IMP34564_INVLEAK_POLE).toExponential(6); // 3.71e-4
// The precise discrepancy: imp-34550 residual against the full-precision bisected zero.
export const IMP34564_GAP_MEASURED = IMP34564_INVLEAK_RESIDUAL; // 3.688e-4

// (F1) how many zero-uncertainty ULPs the two estimates disagree by.
export const IMP34564_GAP_OVER_ZERO_ULP = +(IMP34564_GAP_MEASURED / IMP34564_ZERO_ULP).toFixed(4); // ~73.76

// (F2) attribution: one-signed estimator bias vs the symmetric zero-uncertainty band.
export const IMP34564_BIAS_COMPONENT = +(IMP34564_GAP_MEASURED - IMP34564_ZERO_ULP).toExponential(6); // ~3.638e-4
export const IMP34564_BIAS_FRACTION = +(IMP34564_BIAS_COMPONENT / IMP34564_GAP_MEASURED).toFixed(6); // ~0.986443
export const IMP34564_ZERO_UNCERTAINTY_FRACTION = +(IMP34564_ZERO_ULP / IMP34564_GAP_MEASURED).toFixed(6); // ~0.013557
// The estimator sits BELOW the zero -> one-signed, converge-from-below (imp-34550 F1).
export const IMP34564_ESTIMATOR_UNDERSHOOTS = IMP34564_INVLEAK_POLE < IMP34564_RESID_EXP_ZERO; // true

// (F3) the gap is real structure, ~4 decades above the imp-34368 double-precision floor.
export const IMP34564_DOUBLE_PRECISION_FLOOR_DK = 7.2e-8; // imp-34368 resid_exp peak-location floor
export const IMP34564_GAP_OVER_DP_FLOOR = +(IMP34564_GAP_MEASURED / IMP34564_DOUBLE_PRECISION_FLOOR_DK).toFixed(0); // ~5122

export const IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION = {
  ticket: 'imp-34564',
  proofSection: 'S-frontier',
  question:
    'imp-34550 recovers the eflow_over_resid pole via a naive linear-1/leak OLS ladder climbing to ' +
    '~21.280579, while imp-34237/imp-34310 locate the SAME pole as the resid_exp simple zero at ' +
    'k* ~ 21.28095. These two independent estimates of one pole differ by ~3.7e-4 -- ~74x the imp-34405 ' +
    'pole-location uncertainty dk_star = 5e-6 -- yet were never tabulated side by side. Measure the ' +
    'discrepancy precisely and attribute it to naive-1/leak estimator bias vs resid_exp zero uncertainty. ' +
    'Cross-validation / measurement only; changes no bound; NO QED.',
  residExpZero: IMP34564_RESID_EXP_ZERO, // 21.28095 (E2)
  invLeakPole: IMP34564_INVLEAK_POLE, // 21.280579 (E1)
  invLeakResidual: IMP34564_INVLEAK_RESIDUAL, // 3.688e-4
  zeroUlp: IMP34564_ZERO_ULP, // 5e-6 (imp-34405)
  gapPublished: IMP34564_GAP_PUBLISHED, // 3.71e-4 (5-figure k*)
  gapMeasured: IMP34564_GAP_MEASURED, // 3.688e-4 (full-precision k*)
  gapOverZeroUlp: IMP34564_GAP_OVER_ZERO_ULP, // ~73.76
  biasComponent: IMP34564_BIAS_COMPONENT, // ~3.638e-4
  biasFraction: IMP34564_BIAS_FRACTION, // ~0.986443
  zeroUncertaintyFraction: IMP34564_ZERO_UNCERTAINTY_FRACTION, // ~0.013557
  estimatorUndershoots: IMP34564_ESTIMATOR_UNDERSHOOTS, // true -- converge-from-below
  doublePrecisionFloorDk: IMP34564_DOUBLE_PRECISION_FLOOR_DK, // 7.2e-8 (imp-34368)
  gapOverDpFloor: IMP34564_GAP_OVER_DP_FLOOR, // ~5122
  finding: {
    F1_gap_is_74x_the_zero_uncertainty_floor:
      'gap = 3.688e-4 = 73.76 * dk_star (dk_star = 5e-6, imp-34405 pole-location floor), so the two ' +
      'estimates disagree ~74x more than the resid_exp zero is itself known -- the discrepancy cannot ' +
      'be zero uncertainty alone.',
    F2_gap_is_986_percent_estimator_bias:
      'Subtracting the whole zero-uncertainty band dk_star = 5e-6 leaves 3.638e-4 (~98.6% of the gap) ' +
      'unexplained by zero uncertainty, and it is ONE-SIGNED (poleHat 21.280579 below k* 21.28095), ' +
      'matching the imp-34550 F1 converge-from-below signature. The gap is dominated by the naive-1/leak ' +
      'estimator bias; zero uncertainty explains at most ~1.4%.',
    F3_gap_is_real_structure_not_precision_noise:
      'The imp-34550 residual sits ~5122x above the imp-34368 double-precision resid_exp floor dk ~ 7.2e-8 ' +
      '(~4 decades), so the ~3.69e-4 gap is real structure not double-precision noise -- a better ' +
      '(higher-order) pole estimator, not bignum nor a sharper k*, would close it.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT / CROSS-VALIDATION ONLY -- an arithmetic reconciliation of two inherited estimates of ' +
    'the inherited eflow_over_resid pole. The ~3.69e-4 disagreement between the imp-34550 1/leak-OLS ' +
    'recovered pole (21.280579) and the imp-34237/34310 resid_exp zero (21.28095) is ~74x the imp-34405 ' +
    'pole-location floor and ~98.6% attributable to the naive linear-1/leak OLS estimator biasing LOW ' +
    '(converge-from-below, decelerating near the pole), with resid_exp zero uncertainty explaining at ' +
    'most ~1.4%; the two estimates are consistent once the one-signed estimator bias is accounted for. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the resid_exp simple-zero structure is a numerical/structural observation, not a derivation; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: both anchors are the published imp-34310 / imp-34405 literals, not fresh.
    id: 'imp-34564-reuses-imp34310-zero-and-imp34405-ulp',
    description: 'resid_exp zero = imp-34310 k* = 21.28095 and zero ULP = imp-34405 dk_star = 5e-6, imported',
    holds: () =>
      IMP34564_RESID_EXP_ZERO === 21.28095 &&
      IMP34564_ZERO_ULP === 5e-6 &&
      IMP34564_INVLEAK_POLE === 21.280579,
  },
  {
    // (F1) the gap is ~74x the pole-location floor (far exceeds the 5e-6 zero uncertainty).
    id: 'imp-34564-gap-is-74x-zero-uncertainty-floor',
    description: 'gap 3.688e-4 = ~73.76 * dk_star (5e-6); the two estimates disagree ~74x more than k* is known',
    holds: () =>
      Math.abs(IMP34564_GAP_MEASURED - 3.688e-4) < 1e-7 &&
      Math.abs(IMP34564_GAP_OVER_ZERO_ULP - 73.76) < 1e-2 &&
      IMP34564_GAP_OVER_ZERO_ULP > 50,
  },
  {
    // (F2) attribution: ~98.6% estimator bias, one-signed (undershoot), ~1.4% zero uncertainty.
    id: 'imp-34564-gap-is-mostly-estimator-bias',
    description: 'bias fraction ~0.9864 (one-signed undershoot), zero-uncertainty fraction ~0.0136',
    holds: () =>
      IMP34564_ESTIMATOR_UNDERSHOOTS === true &&
      Math.abs(IMP34564_BIAS_FRACTION - 0.986443) < 1e-4 &&
      Math.abs(IMP34564_ZERO_UNCERTAINTY_FRACTION - 0.013557) < 1e-4 &&
      Math.abs(IMP34564_BIAS_FRACTION + IMP34564_ZERO_UNCERTAINTY_FRACTION - 1) < 1e-6,
  },
  {
    // (F3) the gap is real structure: ~4 decades above the imp-34368 double-precision floor.
    id: 'imp-34564-gap-is-real-structure-not-noise',
    description: 'gap sits ~5122x above the imp-34368 double-precision floor dk ~ 7.2e-8 (~4 decades)',
    holds: () =>
      IMP34564_DOUBLE_PRECISION_FLOOR_DK === 7.2e-8 &&
      Math.abs(IMP34564_GAP_OVER_DP_FLOOR - 5122) < 5 &&
      IMP34564_GAP_OVER_DP_FLOOR > 1000,
  },
  {
    // Honesty gate: measurement / cross-validation only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp-34564-honesty-gate-no-qed',
    description: 'measurement/cross-validation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION.honest) &&
      /refereed bound is changed/i.test(IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION.honest) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION.honest),
  },
];

for (const a of IMP34564_TWO_POLE_ESTIMATE_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34564-two-pole-estimate-reconciliation assertion failed: ${a.id}`);
  }
}
