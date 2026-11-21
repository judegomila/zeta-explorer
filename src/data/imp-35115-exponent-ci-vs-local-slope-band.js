/**
 * @module imp-35115-exponent-ci-vs-local-slope-band
 *
 * imp-35115 (numerical, frontier): imp-34994 widened the bootstrap 95% percentile CI on the pinned
 * E_flow crossing-strength exponent to ~[1.5475, 1.5521] (a resampling band, ~1.35x the textbook residual
 * SE). imp-34950 F2 separately reported that the LOCAL log-log slope d ln s-star per d ln C_mb drifts across
 * a ~0.034-wide band [1.528, 1.562] over the same 21-point C_mb grid -- the mild convexity of the power law.
 * These two bands were never placed side by side. This module reconciles them: it asks (a) whether the
 * single-power-law exponent CI sits strictly INSIDE the local-slope spread (so a single power law with a
 * constant exponent in the CI is compatible with the measured convexity) and (b) whether the local-slope
 * endpoints fall OUTSIDE the resampling CI (so the drift is a real feature, larger than the single-exponent
 * sampling uncertainty), quantifying the tension in CI-width units.
 *
 * THE FINDING (measurement only; answers imp-35115)
 * -------------------------------------------------
 *   (F1) THE EXPONENT CI IS A STRICT SUB-INTERVAL OF THE LOCAL-SLOPE BAND. The imp-34994 bootstrap CI
 *        [1.5475, 1.5521] lies entirely inside the imp-34950 local-slope band [1.528, 1.562]: the CI floor
 *        1.5475 is above the slope-band floor 1.528, and the CI ceiling 1.5521 is below the slope-band ceiling
 *        1.562. So NO single constant exponent within the CI is excluded by the local-slope spread -- the mild
 *        convexity is fully COMPATIBLE with one power law whose exponent sits in the resampling CI. The CI is
 *        also ~7.4x NARROWER than the local-slope band (widths ~0.0046 vs ~0.034).
 *   (F2) BUT THE LOCAL-SLOPE ENDPOINTS FALL OUTSIDE THE RESAMPLING CI, ON BOTH SIDES. The slope-band floor
 *        1.528 lies ~4.2 CI-widths BELOW the CI floor and the slope-band ceiling 1.562 lies ~2.2 CI-widths
 *        ABOVE the CI ceiling. So while the global-fit exponent is compatible with a single power law, the
 *        LOCAL slope visits values the resampling CI never covers: the convexity/drift is a genuine feature of
 *        the surrogate fit, NOT sampling noise on the global exponent. The two statements are not in tension --
 *        they answer different questions (is a constant exponent admissible? yes; is the drift real? yes).
 *
 * MEASUREMENT ONLY. This RE-USES the exported imp-34994 bootstrap CI and imp-34950 local-slope band verbatim
 * and compares them; it re-runs no kernel and changes NO bound. It does NOT discharge the GUE conditional
 * (C_mb GUE-conditional per imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34994-cmb-exponent-bootstrap-jackknife (the widened bootstrap 95% percentile CI ~[1.5475,1.5521])
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the F2 local log-log slope band [1.528,1.562])
 * @see imp-34925-eflow-crossing-strength-cmb-functional-form (the power-law form + point p ~ 1.549)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 */

import { IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE } from './imp-34994-cmb-exponent-bootstrap-jackknife.js';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL } from './imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';

// --- the two bands, read straight from the source modules (kept in sync automatically) ----------------------
const CI_LO = IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.bootstrap.ci95_lo; // ~1.5475
const CI_HI = IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE.bootstrap.ci95_hi; // ~1.5521
const SLOPE_LO = IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.powerLawConstancy.local_loglog_slope_min; // ~1.528
const SLOPE_HI = IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.powerLawConstancy.local_loglog_slope_max; // ~1.562

const CI_WIDTH = CI_HI - CI_LO; // ~0.0046
const SLOPE_WIDTH = SLOPE_HI - SLOPE_LO; // ~0.034
const WIDTH_RATIO = SLOPE_WIDTH / CI_WIDTH; // ~7.4 (slope band is ~7.4x wider than the CI)

// (F1) is the exponent CI a STRICT sub-interval of the local-slope band?
const CI_STRICTLY_INSIDE_SLOPE = CI_LO > SLOPE_LO && CI_HI < SLOPE_HI;

// (F2) do the local-slope endpoints fall OUTSIDE the resampling CI, and by how many CI-widths?
const SLOPE_LO_BELOW_CI = SLOPE_LO < CI_LO;
const SLOPE_HI_ABOVE_CI = SLOPE_HI > CI_HI;
const LO_ENDPOINT_CIWIDTHS = (CI_LO - SLOPE_LO) / CI_WIDTH; // ~4.2 (slope floor below CI floor)
const HI_ENDPOINT_CIWIDTHS = (SLOPE_HI - CI_HI) / CI_WIDTH; // ~2.2 (slope ceiling above CI ceiling)

// midpoints: the slope band is slightly DOWN-shifted vs the CI (more excursion below than above).
const CI_MID = 0.5 * (CI_LO + CI_HI); // ~1.5498
const SLOPE_MID = 0.5 * (SLOPE_LO + SLOPE_HI); // ~1.545
const MID_OFFSET_CIWIDTHS = (CI_MID - SLOPE_MID) / CI_WIDTH; // ~1.0 (slope centre below CI centre)

export const IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND = {
  id: 'imp-35115',
  proofSection: 'S-frontier',
  question:
    'imp-34994 widened the bootstrap 95% percentile CI on the pinned E_flow crossing-strength exponent to ' +
    '~[1.5475, 1.5521], and imp-34950 F2 reported the LOCAL log-log slope drifts across [1.528, 1.562] on the ' +
    'same 21-point C_mb grid. Place the two bands side by side: does the single-power-law exponent CI sit ' +
    'strictly INSIDE the local-slope spread (so the mild convexity is compatible with one power law), or do ' +
    'the local-slope endpoints fall OUTSIDE the resampling CI? Quantify the tension in CI-width units. ' +
    'Measurement only; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'The two bands are NESTED, not in contradiction, and they answer different questions. (F1) The imp-34994 ' +
    'bootstrap CI [1.5475, 1.5521] is a STRICT sub-interval of the imp-34950 local-slope band [1.528, 1.562] ' +
    '(CI floor 1.5475 > slope floor 1.528; CI ceiling 1.5521 < slope ceiling 1.562), and ~7.4x narrower, so ' +
    'no constant exponent within the CI is excluded by the local-slope spread -- one power law is compatible ' +
    'with the measured convexity. (F2) Yet the local-slope endpoints fall OUTSIDE the CI on both sides: the ' +
    'slope floor lies ~4.2 CI-widths below the CI floor and the slope ceiling ~2.2 CI-widths above the CI ' +
    'ceiling, so the LOCAL slope visits values the resampling CI never covers -- the drift is a genuine ' +
    'feature of the surrogate fit, not sampling noise on the global exponent.',
  measuredQuantity:
    'the containment relation between the imp-34994 bootstrap 95% percentile CI on the pinned exponent and ' +
    'the imp-34950 F2 local log-log slope drift band, plus the band-width ratio and the distances (in ' +
    'CI-width units) by which each local-slope endpoint sits outside the resampling CI',
  bands: {
    exponent_ci95: { lo: +CI_LO.toFixed(5), hi: +CI_HI.toFixed(5), width: +CI_WIDTH.toExponential(3) }, // ~[1.5475,1.5521], w~4.6e-3
    local_slope: { lo: +SLOPE_LO.toFixed(4), hi: +SLOPE_HI.toFixed(4), width: +SLOPE_WIDTH.toFixed(4) }, // ~[1.528,1.562], w~0.034
    slope_over_ci_width_ratio: +WIDTH_RATIO.toFixed(2), // ~7.4
  },
  containment: {
    ci_strictly_inside_slope_band: CI_STRICTLY_INSIDE_SLOPE, // true
    slope_lo_below_ci: SLOPE_LO_BELOW_CI, // true
    slope_hi_above_ci: SLOPE_HI_ABOVE_CI, // true
    lo_endpoint_ci_widths_below: +LO_ENDPOINT_CIWIDTHS.toFixed(2), // ~4.2
    hi_endpoint_ci_widths_above: +HI_ENDPOINT_CIWIDTHS.toFixed(2), // ~2.2
    ci_mid: +CI_MID.toFixed(5), // ~1.5498
    slope_mid: +SLOPE_MID.toFixed(5), // ~1.545
    slope_mid_below_ci_mid_ci_widths: +MID_OFFSET_CIWIDTHS.toFixed(2), // ~1.0
  },
  finding: {
    F1_ci_strict_subinterval_of_slope_band:
      'The imp-34994 bootstrap 95% percentile CI [1.5475, 1.5521] lies ENTIRELY inside the imp-34950 local ' +
      'log-log slope band [1.528, 1.562] and is ~7.4x narrower. No constant exponent within the CI is ' +
      'excluded by the local-slope spread, so a single power law with an exponent in the resampling CI is ' +
      'fully compatible with the measured mild convexity.',
    F2_slope_endpoints_outside_ci:
      'The local-slope endpoints fall OUTSIDE the resampling CI on both sides: the slope floor 1.528 sits ' +
      '~4.2 CI-widths below the CI floor and the slope ceiling 1.562 sits ~2.2 CI-widths above the CI ' +
      'ceiling. The local slope visits values the CI never covers, so the drift is a genuine feature of the ' +
      'surrogate fit, not sampling noise on the global exponent. The two bands answer different questions ' +
      '(is a constant exponent admissible? yes; is the local drift real? yes) and are not in tension.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Placing the imp-34994 bootstrap 95% percentile CI [1.5475, 1.5521] ' +
    'beside the imp-34950 F2 local log-log slope band [1.528, 1.562] on the shared 21-point C_mb grid: ' +
    '(F1) the exponent CI is a STRICT sub-interval of the local-slope band (CI floor above slope floor, CI ' +
    'ceiling below slope ceiling) and ~7.4x narrower, so a single power law with an exponent in the CI is ' +
    'compatible with the measured convexity; (F2) the local-slope endpoints nonetheless fall OUTSIDE the CI ' +
    'on both sides (~4.2 CI-widths below the floor, ~2.2 above the ceiling), so the local drift is a genuine ' +
    'surrogate feature, not sampling noise on the global exponent -- the two statements answer different ' +
    'questions and are not in tension. This RE-USES the exported imp-34994 CI and imp-34950 slope band ' +
    'verbatim; it re-runs no kernel and changes NO bound; does NOT discharge the GUE conditional (C_mb ' +
    'GUE-conditional per imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-35115: the imp-34994 exponent CI [1.5475, 1.5521] is nested strictly inside the imp-34950 ' +
    'local-slope band [1.528, 1.562] (compatible with one power law) yet the slope endpoints sit ~2.2-4.2 ' +
    'CI-widths outside the CI (drift is real, not sampling noise). What stays OPEN (deferred, changes no ' +
    'bound): whether the local-slope band itself is surrogate-independent or drifts with the imp-3220/imp-3406 ' +
    'extrapolation; and a derivation PINNING C_mb below the GUE bound of 1 (imp-486) would fix the physical ' +
    's* via C_mb^p. NO QED; no refereed bound is changed.',
  citation:
    'imp-34994 (the widened bootstrap 95% percentile CI reconciled here); imp-34950 (the F2 local log-log ' +
    'slope band); imp-34925 (the power-law form and point exponent p ~ 1.549); imp-3463 (far-tail exponent ' +
    '1/2); imp-486 (C_mb GUE-conditional).',
};

export const IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND_ASSERTIONS = [
  {
    // Reuse gate: the two bands are read verbatim from the source modules and land where expected.
    id: 'imp35115-bands-match-source-modules',
    description: 'the exponent CI and local-slope band reproduce the imp-34994 / imp-34950 exported values',
    holds: () =>
      Math.abs(CI_LO - 1.5475) < 5e-3 &&
      Math.abs(CI_HI - 1.5521) < 5e-3 &&
      Math.abs(SLOPE_LO - 1.528) < 5e-3 &&
      Math.abs(SLOPE_HI - 1.562) < 5e-3,
  },
  {
    // (F1): the exponent CI is a STRICT sub-interval of the local-slope band and much narrower.
    id: 'imp35115-ci-strictly-inside-slope-band',
    description: 'the bootstrap exponent CI lies strictly inside the local-slope band and is >3x narrower',
    holds: () => CI_STRICTLY_INSIDE_SLOPE === true && WIDTH_RATIO > 3,
  },
  {
    // (F2): both local-slope endpoints fall OUTSIDE the CI, each by more than one CI-width.
    id: 'imp35115-slope-endpoints-outside-ci',
    description: 'both local-slope endpoints sit outside the resampling CI, each by more than one CI-width',
    holds: () =>
      SLOPE_LO_BELOW_CI === true &&
      SLOPE_HI_ABOVE_CI === true &&
      LO_ENDPOINT_CIWIDTHS > 1 &&
      HI_ENDPOINT_CIWIDTHS > 1,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp35115-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND.isRigorous === false &&
      IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND.farTailExponent === 0.5 &&
      typeof IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND.subGap === 'string' &&
      /imp-486/.test(IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND.subGap) &&
      /NO QED/.test(IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND.verdict),
  },
];

for (const a of IMP35115_EXPONENT_CI_VS_LOCAL_SLOPE_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35115-exponent-ci-vs-local-slope-band assertion failed: ${a.id}`);
  }
}
