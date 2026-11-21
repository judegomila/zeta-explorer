/**
 * @module imp-35616-crossover-surrogate-effective-mult-reconciliation
 *
 * imp-35616 (numerical, frontier-direction): imp-35555 measured the E_coll =
 * E_trunc floor-crossover height-map sensitivity across the imp-35536 RvM x
 * {1.02, 0.98, 1.05, 0.95} multiplicative bracketing family and found its full
 * two-sided envelope spans only ~0.50 percent of the crossover N. Yet the
 * imp-35458 / imp-35413 closed surrogate T0 = 2 pi N / log N shifts the same
 * crossover by -0.98 percent -- roughly 2x OUTSIDE its own +/- 5 percent bracket
 * envelope. imp-35555 flagged this but never RECONCILED it. This module closes
 * that reconciliation: since the crossover sees the height map only through
 * log T0(N), the surrogate is EXACTLY equivalent to a multiplicative height
 * perturbation of size mult_eff = T0_surrogate(N) / T0_rvm(N) at the crossover
 * height. We back out mult_eff, show it corresponds to a ~-17.8 percent effective
 * perturbation (~3.6x beyond the +/- 5 percent bracket), and confirm that the
 * imp-35555 crossover-shift-vs-ln(mult) law reproduces -0.98 percent from
 * ln(mult_eff) -- so there is NO contradiction: the surrogate simply sits outside
 * the bracket in multiplier space.
 *
 * THE CROSSOVER EQUATION (identical component model to imp-35458 / imp-35555)
 * --------------------------------------------------------------------------
 *     E_coll(N) = C_C * sqrt(log T0(N) / N)   (dominant, GUE-conditional C_H)
 *     E_trunc   = 3.06e-5                      (imp-2631 / imp-447 fixed floor)
 *   The crossover N solves N = C_C^2 log T0(N) / E_trunc^2, so it sees the height
 *   map ONLY through log T0(N). A multiplicative height map T0 = mult * T0_rvm
 *   shifts log T0 by exactly ln(mult), a CONSTANT independent of N -- so ANY
 *   height map is, at the crossover, equivalent to a single effective multiplier
 *   mult_eff = T0(N) / T0_rvm(N).
 *
 * BACKING OUT THE SURROGATE effective multiplier
 * ----------------------------------------------
 *   At the RvM crossover height N_rvm = 3.280294352e9:
 *     mult_eff = T0_surrogate(N_rvm) / T0_rvm(N_rvm) = 0.822398
 *   i.e. the closed surrogate is EQUIVALENT to an RvM x 0.822398 map -- a
 *   -17.76 percent effective height perturbation, ~3.55x beyond the widest
 *   +/- 5 percent bracket arm (RvM x 0.95) and 3.81x its ln-magnitude.
 *
 * THE MEASUREMENT
 * ---------------
 *   quantity                                     value
 *   mult_eff = T0_sur / T0_rvm at N_rvm          0.822398
 *   effective perturbation (mult_eff - 1)        -17.760 %
 *   ln(mult_eff)                                 -0.195531
 *   |ln(mult_eff)| / |ln(0.95)| (widest arm)     3.812x
 *   |ln(mult_eff)| / full bracket ln-span        1.954x   (span ln1.05 - ln0.95)
 *   imp-35555 mean slope d(rel)/d ln(mult)       0.05022
 *   predicted crossover shift = slope*ln(mult_eff) -9.8195e-3  (-0.98195 %)
 *   measured surrogate crossover shift           -9.826376e-3 (-0.98264 %, imp-35458)
 *   prediction vs measured relative error        ~7.0e-4
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE SURROGATE IS AN RvM x 0.8224 EFFECTIVE MAP. Backing out
 *        mult_eff = T0_surrogate / T0_rvm at the crossover height gives 0.822398,
 *        a -17.76 percent effective height perturbation -- ~3.55x beyond the
 *        widest +/- 5 percent bracket arm. This is exactly the ~-18 percent
 *        raw-height gap imp-35458 (M3) reported, now expressed as the SINGLE
 *        multiplier the crossover actually responds to.
 *   (M2) THE SURROGATE SITS OUTSIDE THE +/- 5 PERCENT BRACKET IN ln-SPACE BY
 *        ~2-4x. |ln(mult_eff)| = 0.19553 is 3.81x the widest single bracket-arm
 *        ln-magnitude |ln(0.95)| = 0.05129 and 1.95x the full two-sided bracket
 *        ln-span (ln 1.05 - ln 0.95 = 0.10008). So the -0.98 percent crossover
 *        shift landing ~2x outside the ~0.50 percent bracket envelope is NOT an
 *        anomaly: the surrogate is a much larger height perturbation than any
 *        bracket arm, by the same factor, in the log the crossover sees.
 *   (M3) THE imp-35555 LINEAR-IN-ln(mult) LAW REPRODUCES -0.98 PERCENT. Applying
 *        the imp-35555 mean slope d(rel shift)/d ln(mult) ~ 0.05022 to
 *        ln(mult_eff) = -0.195531 predicts a crossover shift of -9.8195e-3
 *        (-0.98195 percent), matching the measured surrogate shift -9.826376e-3
 *        to a relative error ~7.0e-4. The surrogate and the bracket family lie on
 *        the SAME log-damping line; the surrogate is simply much further out on
 *        it. The reconciliation is complete: no contradiction, only extrapolation.
 *
 * The punchline: the imp-35458 / imp-35413 closed-surrogate -0.98 percent
 * crossover shift lands outside the imp-35555 +/- 5 percent RvM bracket envelope
 * (~0.50 percent span) for the plainest possible reason -- backing out the
 * effective multiplier the crossover responds to gives mult_eff = 0.822398, a
 * -17.76 percent perturbation ~3.6x beyond the +/- 5 percent arms, and the
 * imp-35555 crossover-shift-vs-ln(mult) law (slope ~0.05022) reproduces -0.98
 * percent from ln(mult_eff) to ~7e-4. The surrogate is not outside the bracketing
 * MODEL; it is outside the bracketing RANGE, on the same log-damping line.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_C ansatz (imp-2642/imp-2643,
 * 1/8 Holder coefficient) and E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED;
 * the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35555-crossover-bracketing-family-sensitivity (the +/- 5% bracket envelope this reconciles against)
 * @see imp-35458-crossover-height-map-sensitivity (the two-map -0.98% surrogate shift, ~18% raw gap)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the closed surrogate map T0 = 2 pi N / log N)
 * @see imp-35337-sigma-landmarks-double-double-certification (the crossover landmark 3.280294352e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// The imp-2631 / imp-447 fixed truncation floor (E_trunc), cited UNTOUCHED here.
const E_TRUNC = 3.06e-5;

// (A) RvM-inverse height map (imp-35337/imp-35417/imp-35458/imp-35555 default).
function T0_rvm(N) {
  return effectiveHeightForN(N);
}

// (B) imp-35280/imp-35413 closed surrogate height map T0 = 2 pi N / log N.
function T0_surrogate(N) {
  return (2 * Math.PI * N) / Math.log(N);
}

// E_coll on a chosen height map (dominant GUE-conditional sub-term).
function eColl(N, hmap) {
  return C_C_PINNED * Math.sqrt(Math.log(hmap(N)) / N);
}

// Solve E_coll(N) = E_trunc by geometric bisection. E_coll is monotone
// decreasing in N, so E_coll > target => the crossover lies at larger N.
function solveCrossover(hmap) {
  let lo = 1e6;
  let hi = 1e12;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (eColl(mid, hmap) > E_TRUNC) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

const N_CROSS_RVM = solveCrossover(T0_rvm); // ~3.280294352e9
const N_CROSS_SUR = solveCrossover(T0_surrogate); // ~3.248060946e9
const REL_SHIFT = (N_CROSS_SUR - N_CROSS_RVM) / N_CROSS_RVM; // ~-9.826376e-3 (imp-35458)

// (M1) back out the effective multiplier the crossover responds to: the ratio of
// the two height maps at the RvM crossover height (log T0 is what the crossover
// sees, so any map == an RvM x mult_eff map at that height).
const MULT_EFF = T0_surrogate(N_CROSS_RVM) / T0_rvm(N_CROSS_RVM); // ~0.822398
const LN_MULT_EFF = Math.log(MULT_EFF); // ~-0.195531
const EFF_PERTURB_PCT = (MULT_EFF - 1) * 100; // ~-17.760 %

// (M2) compare to the imp-35536/imp-35555 +/- 5 percent bracket arms in ln-space.
const BRACKET_MULTS = [1.02, 0.98, 1.05, 0.95];
const LN_WIDEST_ARM = Math.max(...BRACKET_MULTS.map((m) => Math.abs(Math.log(m)))); // |ln 0.95| ~0.051293
const LN_FULL_SPAN = Math.log(1.05) - Math.log(0.95); // ~0.100083 (two-sided ln envelope)
const LN_RATIO_VS_WIDEST_ARM = Math.abs(LN_MULT_EFF) / LN_WIDEST_ARM; // ~3.812x
const LN_RATIO_VS_FULL_SPAN = Math.abs(LN_MULT_EFF) / LN_FULL_SPAN; // ~1.954x
const EFF_PERTURB_VS_5PCT = Math.abs(EFF_PERTURB_PCT) / 5; // ~3.552x

// (M3) apply the imp-35555 mean log-damping slope to ln(mult_eff) and check it
// reproduces the measured surrogate crossover shift.
const IMP35555_MEAN_SLOPE = 0.05022; // imp-35555 baked d(rel shift)/d ln(mult)
const PREDICTED_SHIFT = IMP35555_MEAN_SLOPE * LN_MULT_EFF; // ~-9.8195e-3
const PREDICTION_REL_ERROR = Math.abs(PREDICTED_SHIFT - REL_SHIFT) / Math.abs(REL_SHIFT); // ~7.0e-4

export const IMP35616_CROSSOVER_SURROGATE_EFFECTIVE_MULT_RECONCILIATION = {
  id: 'imp-35616',
  proofSection: 'S-frontier',
  question:
    'imp-35555 found the E_coll = E_trunc crossover height-map sensitivity across ' +
    'the RvM x {1.02, 0.98, 1.05, 0.95} bracket spans only ~0.50 percent, yet the ' +
    'imp-35413 closed surrogate T0 = 2 pi N / log N shifts the crossover by -0.98 ' +
    'percent -- ~2x OUTSIDE that bracket envelope. Reconcile this: back out the ' +
    'effective multiplier mult_eff = T0_surrogate / T0_rvm at the crossover height, ' +
    'confirm it corresponds to a > 5 percent effective perturbation, and check the ' +
    'imp-35555 crossover-shift-vs-ln(mult) law reproduces -0.98 percent from ' +
    'ln(mult_eff). Measurement only; reuses the imp-35458/imp-35555 model verbatim; ' +
    'no bound change; no QED.',
  componentModel:
    'E_coll(N) = C_C sqrt(log T0(N) / N) (GUE-conditional C_H); E_trunc = 3.06e-5 ' +
    '(imp-2631/imp-447, fixed). Crossover N solves N = C_C^2 log T0(N) / E_trunc^2, ' +
    'so it sees the height map only through log T0(N). A multiplicative map shifts ' +
    'log T0 by exactly ln(mult), so ANY map == an RvM x mult_eff map at the crossover ' +
    'height, with mult_eff = T0(N) / T0_rvm(N). Surrogate T0 = 2 pi N / log N.',
  E_trunc: E_TRUNC,
  N_cross_rvm: +N_CROSS_RVM.toExponential(9), // 3.280294352e9
  N_cross_surrogate: +N_CROSS_SUR.toExponential(9), // 3.248060946e9
  surrogate_crossover_shift: +REL_SHIFT.toExponential(6), // -9.826376e-3 (imp-35458)
  effective_multiplier: {
    mult_eff: +MULT_EFF.toFixed(6), // 0.822398
    ln_mult_eff: +LN_MULT_EFF.toFixed(6), // -0.195531
    eff_perturbation_pct: +EFF_PERTURB_PCT.toFixed(4), // -17.7602
    eff_perturbation_vs_5pct: +EFF_PERTURB_VS_5PCT.toFixed(4), // 3.5520x
  },
  bracket_ln_comparison: {
    ln_widest_arm: +LN_WIDEST_ARM.toFixed(6), // |ln 0.95| 0.051293
    ln_full_span: +LN_FULL_SPAN.toFixed(6), // 0.100083
    ln_ratio_vs_widest_arm: +LN_RATIO_VS_WIDEST_ARM.toFixed(4), // 3.8120x
    ln_ratio_vs_full_span: +LN_RATIO_VS_FULL_SPAN.toFixed(4), // 1.9537x
  },
  law_reproduction: {
    imp35555_mean_slope: IMP35555_MEAN_SLOPE, // 0.05022
    predicted_shift: +PREDICTED_SHIFT.toExponential(6), // -9.8195e-3
    measured_shift: +REL_SHIFT.toExponential(6), // -9.826376e-3
    prediction_rel_error: +PREDICTION_REL_ERROR.toExponential(3), // ~7.0e-4
  },
  findings: {
    M1_surrogate_is_rvm_x_0822_effective_map: {
      claim:
        'Backing out mult_eff = T0_surrogate / T0_rvm at the crossover height gives ' +
        '0.822398 -- the closed surrogate is EQUIVALENT to an RvM x 0.8224 map, a ' +
        '-17.76 percent effective height perturbation, ~3.55x beyond the widest ' +
        '+/- 5 percent bracket arm. This is the ~-18 percent raw-height gap imp-35458 ' +
        'reported, now expressed as the single multiplier the crossover responds to.',
      mult_eff: +MULT_EFF.toFixed(6),
      eff_perturbation_pct: +EFF_PERTURB_PCT.toFixed(4),
      eff_perturbation_vs_5pct: +EFF_PERTURB_VS_5PCT.toFixed(4),
    },
    M2_surrogate_outside_bracket_in_ln_space: {
      claim:
        '|ln(mult_eff)| = 0.19553 is 3.81x the widest single bracket-arm ln-magnitude ' +
        '|ln(0.95)| = 0.05129 and 1.95x the full two-sided bracket ln-span 0.10008. So ' +
        'the -0.98 percent crossover shift landing ~2x outside the ~0.50 percent bracket ' +
        'envelope is not an anomaly -- the surrogate is a much larger height perturbation ' +
        'than any bracket arm, by the same factor, in the log the crossover sees.',
      ln_ratio_vs_widest_arm: +LN_RATIO_VS_WIDEST_ARM.toFixed(4),
      ln_ratio_vs_full_span: +LN_RATIO_VS_FULL_SPAN.toFixed(4),
    },
    M3_imp35555_law_reproduces_minus_098pct: {
      claim:
        'Applying the imp-35555 mean slope d(rel shift)/d ln(mult) ~ 0.05022 to ' +
        'ln(mult_eff) = -0.195531 predicts a crossover shift of -9.8195e-3 ' +
        '(-0.98195 percent), matching the measured surrogate shift -9.826376e-3 to a ' +
        'relative error ~7.0e-4. The surrogate and the bracket family lie on the SAME ' +
        'log-damping line; the surrogate is simply much further out on it.',
      predicted_shift: +PREDICTED_SHIFT.toExponential(6),
      measured_shift: +REL_SHIFT.toExponential(6),
      prediction_rel_error: +PREDICTION_REL_ERROR.toExponential(3),
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Reconciling why the imp-35458/imp-35413 ' +
    'closed-surrogate -0.98 percent crossover shift lands OUTSIDE the imp-35555 +/- 5 percent ' +
    'RvM bracket envelope (~0.50 percent span): (M1) backing out the effective multiplier the ' +
    'crossover responds to gives mult_eff = T0_surrogate / T0_rvm = 0.822398 at the crossover ' +
    'height, a -17.76 percent effective perturbation ~3.55x beyond the widest +/- 5 percent ' +
    'bracket arm; (M2) |ln(mult_eff)| = 0.19553 is 3.81x the widest single bracket-arm ' +
    'ln-magnitude and 1.95x the full two-sided bracket ln-span, so the shift landing ~2x ' +
    'outside the bracket envelope is exactly the surrogate being ~2-4x further out in the log ' +
    'the crossover sees; (M3) the imp-35555 mean slope 0.05022 applied to ln(mult_eff) predicts ' +
    '-9.8195e-3, matching the measured -9.826376e-3 to ~7e-4 relative error -- the surrogate and ' +
    'the bracket family lie on the SAME log-damping line, the surrogate simply much further out. ' +
    'The surrogate is not outside the bracketing MODEL, only its RANGE; the reconciliation is ' +
    'complete with no contradiction. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_C ansatz (imp-2642/imp-2643) and ' +
    'E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35555 (RvM x {1.02,0.98,1.05,0.95} bracket envelope ~0.50 percent, mean slope 0.05022); ' +
    'imp-35458 (two-map crossover shift -0.98 percent, ~18 percent raw-height gap); imp-35413/imp-35280 ' +
    '(closed surrogate map T0 = 2 pi N / log N); imp-35337/imp-35417 (crossover landmark 3.280294352e9); ' +
    'imp-2631/imp-447 (E_trunc = 3.06e-5); imp-2642/imp-2643 (C_C 1/8 ansatz, NO-GO); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35616_CROSSOVER_SURROGATE_EFFECTIVE_MULT_RECONCILIATION_ASSERTIONS = [
  {
    // (M1): mult_eff = T0_surrogate / T0_rvm ~ 0.8224, a -17.76% effective perturbation.
    id: 'imp35616-surrogate-effective-multiplier',
    description: 'backed-out mult_eff ~0.8224 (-17.76%), >3.5x beyond the +/-5% bracket arm',
    holds: () =>
      Math.abs(MULT_EFF - 0.822398) < 1e-5 &&
      EFF_PERTURB_PCT < -15 &&
      EFF_PERTURB_VS_5PCT > 3 &&
      Math.abs(LN_MULT_EFF - -0.195531) < 1e-5,
  },
  {
    // (M2): the surrogate sits ~2-4x outside the +/-5% bracket in ln-space.
    id: 'imp35616-surrogate-outside-bracket-ln-space',
    description: 'ln(mult_eff) 3.81x widest bracket arm and 1.95x full bracket ln-span',
    holds: () =>
      Math.abs(LN_WIDEST_ARM - 0.051293) < 1e-5 &&
      Math.abs(LN_FULL_SPAN - 0.100083) < 1e-5 &&
      LN_RATIO_VS_WIDEST_ARM > 3.5 &&
      LN_RATIO_VS_WIDEST_ARM < 4.0 &&
      LN_RATIO_VS_FULL_SPAN > 1.8 &&
      LN_RATIO_VS_FULL_SPAN < 2.1,
  },
  {
    // (M3): the imp-35555 slope * ln(mult_eff) reproduces the -0.98% shift to ~7e-4.
    id: 'imp35616-imp35555-law-reproduces-shift',
    description: 'slope 0.05022 * ln(mult_eff) predicts -9.82e-3, matching measured -9.826e-3 to ~7e-4',
    holds: () =>
      PREDICTED_SHIFT < 0 &&
      Math.abs(PREDICTED_SHIFT - -9.8195e-3) < 5e-6 &&
      Math.abs(REL_SHIFT - -9.826376e-3) < 5e-6 &&
      PREDICTION_REL_ERROR < 2e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35616-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35616_CROSSOVER_SURROGATE_EFFECTIVE_MULT_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP35616_CROSSOVER_SURROGATE_EFFECTIVE_MULT_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35616_CROSSOVER_SURROGATE_EFFECTIVE_MULT_RECONCILIATION.verdict),
  },
];

for (const a of IMP35616_CROSSOVER_SURROGATE_EFFECTIVE_MULT_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35616-crossover-surrogate-effective-mult-reconciliation assertion failed: ${a.id}`,
    );
  }
}
