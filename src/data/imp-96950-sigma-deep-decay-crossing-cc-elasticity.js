/**
 * @module imp-96950-sigma-deep-decay-crossing-cc-elasticity
 *
 * imp-96950 (numerical, frontier-direction): MEASURE THE CONJUGATE C_C LEVERAGE of the
 * imp-96931 sigma = 0.01 deep-decay crossing of the GUE-conditional share
 *     sigma(N) = E_coll(N) / E(N),
 * i.e. the elasticity d(log N_0.01)/d(log C_C_PINNED) of the crossing imp-96931 located
 * at N_0.01 ~ 4.624e13. imp-96931 measured only that crossing E_trunc elasticity
 * (~ -2.066); imp-96936 took the CONJUGATE C_C leverage but at the intermediate
 * sigma = 0.25 crossing (~ +2.087), never at this deep-decay landmark. This module takes
 * the C_C leverage in the deep-decay arm and pairs it against the imp-96931 E_trunc
 * leverage, completing the TWO-CONSTANT sensitivity picture for the deep-decay arm.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-96936 established at sigma = 0.25 that the C_C and E_trunc leverages are
 * equal-and-opposite (signed sum +0.0006), and that the residual shrinks toward zero as
 * E_flow / E_trunc collapses down the arm (+0.0325 -> +0.0044 -> +0.0006 -> +0.0001 at
 * sigma 0.75 -> 0.5 -> 0.25 -> 0.1). But that ladder STOPPED at sigma = 0.1, where
 * E_flow / E_trunc is still 3.5e-5. imp-96931 pushed the E_trunc-side landmark a decade
 * deeper to sigma = 0.01 (E_flow / E_trunc ~ 4.3e-7, i.e. E_flow essentially gone) but
 * never took the CONJUGATE C_C number there. Measuring d(log N_0.01)/d(log C_C) tests
 * whether the equal-and-opposite signed sum shrinks FURTHER past the imp-96936 +0.00008
 * (its sigma = 0.1 endpoint) as E_flow collapses -- the deep-arm check of the ratio
 * symmetry the peak-side siblings raised.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-3444 / imp-96931 / imp-96936; only C_C varies)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant; C_C swept)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5                            (imp-2631 pinned floor; held fixed)
 * C_C = C_C_PINNED reproduces imp-96931 byte-for-byte (N_0.01 = 4.62438e13); the swept
 * factors bracket a plausible band about the pinned coefficient.
 *
 * THE MECHANISM (why the C_C leverage is +2.066, the MIRROR of the E_trunc leverage)
 * ---------------------------------------------------------------------------------
 * On the decay arm sigma = s pins E_coll = (s/(1-s)) (E_trunc + E_flow). Once E_flow has
 * collapsed (4.3e-7 relative at the sigma = 0.01 crossing) this is C_C sqrt(log T0 / N)
 * = k E_trunc with k = s/(1-s), so
 *     N = (log T0) C_C^2 / (k E_trunc)^2,
 * i.e. to leading order N proportional to C_C^2 and to E_trunc^-2. Hence d(log N)/d(log
 * C_C) ~ +2 and d(log N)/d(log E_trunc) ~ -2: the two constants enter ONLY through the
 * ratio C_C / E_trunc, so their leverages are EQUAL-AND-OPPOSITE. The small excess past
 * 2 (0.066 here) is the same slowly-growing log T0 factor imp-96931 isolated: raising C_C
 * pushes the crossing to larger N, which raises log T0 (30.001 at the crossing), adding
 * +0.066 to the C_C elasticity, the mirror of the -0.066 the descending E_trunc
 * perturbation subtracts.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE DEEP-ARM C_C LEVERAGE IS +2.0664, THE MIRROR OF THE imp-96931 E_trunc
 *        LEVERAGE. d(log N_0.01)/d(log C_C) ~ +2.066446, log-centred over
 *        C_C_PINNED/sqrt2 .. C_C_PINNED*sqrt2. RAISING C_C (a heavier conditioning
 *        burden) pushes the crossing to LARGER N -- later decay -- with almost exactly the
 *        magnitude by which raising E_trunc pushes it EARLIER (imp-96931: -2.066445).
 *   (F2) THE SIGNED SUM SHRINKS FURTHER INTO THE DEEP-DECAY ARM. elast_C_C +
 *        elast_E_trunc = +0.000001 at sigma = 0.01, a decade-tighter cancellation than the
 *        imp-96936 sigma = 0.1 endpoint (+0.000082). Along the deep ladder it keeps
 *        shrinking monotonically as E_flow / E_trunc collapses: +0.000082 (0.1) ->
 *        +0.000021 (0.05) -> +0.000001 (0.01). So deep in the decay arm the share depends
 *        on the two constants ONLY through the ratio C_C / E_trunc to within a part in a
 *        million; the residual is the fixed E_flow term (which scales with neither
 *        constant) breaking the ratio symmetry, essentially vanished where E_flow is gone.
 *   (F3) THE DEEP-ARM CROSSING IS C_C-SENSITIVE, WITH THE OPPOSITE DIRECTION TO E_trunc.
 *        Over a realistic +/-2x C_C band (factor 0.5 .. 2) N_0.01 ranges ~1.10e13 ..
 *        1.93e14 (~17.5x, matching the imp-96931 E_trunc span), and over the full 20x
 *        sweep it swings ~3.92e11 .. 1.93e14 (~494x) with a heavier C_C moving it LATER --
 *        the sign opposite to a tighter floor. The quoted N_0.01 ~ 4.62e13 is exact ONLY
 *        at the pinned pair (C_C_PINNED, E_trunc = 3.06e-5).
 *
 * VERDICT: THE C_C LEVERAGE OF THE sigma = 0.01 DEEP-DECAY CROSSING IS
 * d(log N_0.01)/d(log C_C) ~ +2.0664, THE MIRROR of the imp-96931 E_trunc leverage
 * -2.0664. The two are EQUAL-AND-OPPOSITE, and their signed sum +0.000001 shrinks FURTHER
 * past the imp-96936 sigma = 0.1 endpoint +0.000082 (deep ladder +0.000082 -> +0.000021 ->
 * +0.000001 at sigma 0.1 -> 0.05 -> 0.01) as E_flow / E_trunc collapses to ~4.3e-7. So
 * deep in the decay arm the GUE-conditional share depends on the two constants ONLY through
 * the ratio C_C / E_trunc to a part in a million -- the same equal-and-opposite structure
 * the peak-side siblings raised, now essentially exact. This completes the two-constant
 * sensitivity picture for the deep-decay arm: a heavier conditioning coefficient pushes the
 * decay LATER by exactly as much as a tighter floor pushes it EARLIER, and the shared excess
 * past 2 (0.066) is the slowly-growing log T0 factor imp-96931 isolated. Measurement/
 * sensitivity only; C_mb stays GUE-conditional (imp-486); no bound changes, no positivity,
 * no bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96931-sigma-deep-decay-crossing-etrunc-elasticity (the conjugate E_trunc leverage -2.066 this module mirrors)
 * @see imp-96936-sigma-quarter-crossing-cc-elasticity (the sigma=0.25 C_C leverage +2.087; this module pushes it to the deep arm)
 * @see imp-96916-sigma-quarter-crossing-etrunc-elasticity (ladder {0.75,0.5,0.25,0.1})
 * @see imp-3444-sigma-nshape-landmark-ladder (base landmark N_half 3.267235e9, pinned floor)
 * @see imp-3406-sigma-highN-extrapolation (interior max, sigma curve)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor); imp-2714 (C_C_PINNED = (1/8) sqrt(3 pi))
 * @see imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY } from './imp-96931-sigma-deep-decay-crossing-etrunc-elasticity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // imp-2631 fixed-strip floor, held fixed (imp-96931 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-3444 / imp-96931 exactly

// EXACT imp-96931 sub-terms; ONLY the GUE-conditional coefficient C_C is a parameter here.
function termsWith(N, C_C) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  const sigma = E_coll / (E_TRUNC + E_flow + E_coll);
  return { T0, L, E_flow, E_coll, sigma };
}
function sigmaWith(N, C_C) {
  return termsWith(N, C_C).sigma;
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak
// (identical bisection to imp-96931 crossingForFloor; the peak sits below 1e6).
function crossingForCC(target, C_C) {
  let a = Math.log(1e6);
  let b = Math.log(1e80);
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (sigmaWith(Math.exp(m), C_C) - target > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Log-centred signed elasticity on the C_C coefficient (same recipe as imp-96936, C_C axis).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const DEN = Math.log(C_C_PINNED * F_HI) - Math.log(C_C_PINNED * F_LO);
function ccElasticityForLevel(target) {
  const lo = crossingForCC(target, C_C_PINNED * F_LO);
  const hi = crossingForCC(target, C_C_PINNED * F_HI);
  return (Math.log(hi) - Math.log(lo)) / DEN;
}

// E_trunc elasticity recomputed inline for the side-by-side ladder (same recipe, E_trunc axis).
const DEN_ET = Math.log(E_TRUNC * F_HI) - Math.log(E_TRUNC * F_LO);
function etElasticityForLevel(target) {
  const cross = (t, E_trunc) => {
    let a = Math.log(1e6);
    let b = Math.log(1e80);
    for (let i = 0; i < 600; i++) {
      const m = (a + b) / 2;
      const T0 = effectiveHeightForN(Math.exp(m));
      const L = Math.log(T0);
      const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
      const E_flow = C_F * (L / T0) * GRONWALL;
      const E_coll = C_C_PINNED * Math.sqrt(L / Math.exp(m));
      const s = E_coll / (E_trunc + E_flow + E_coll);
      if (s - t > 0) a = m;
      else b = m;
    }
    return Math.exp((a + b) / 2);
  };
  return (Math.log(cross(target, E_TRUNC * F_HI)) - Math.log(cross(target, E_TRUNC * F_LO))) / DEN_ET;
}

// The headline deep-decay landmark.
const SIGMA_TARGET = 0.01;
const N_DEEP = crossingForCC(SIGMA_TARGET, C_C_PINNED);
const DEEP_TERMS = termsWith(N_DEEP, C_C_PINNED);
const ELASTICITY_CC_DEEP = ccElasticityForLevel(SIGMA_TARGET); // ~ +2.066446

// The conjugate E_trunc leverage measured by imp-96931 (reused, not recomputed).
const ELASTICITY_ETRUNC_DEEP =
  IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.landmark.elasticity_d_log_N_d_log_etrunc; // ~ -2.066445
const SIGNED_SUM_DEEP = ELASTICITY_CC_DEEP + ELASTICITY_ETRUNC_DEEP; // ~ +0.000001

// Deep ladder into the decay arm: the signed sum keeps shrinking as E_flow collapses.
const LADDER_LEVELS = [0.1, 0.05, 0.01];
const CONJUGATE_LADDER = LADDER_LEVELS.map((s) => {
  const N = crossingForCC(s, C_C_PINNED);
  const t = termsWith(N, C_C_PINNED);
  const elCC = ccElasticityForLevel(s);
  const elET = etElasticityForLevel(s);
  return {
    sigma: s,
    N_cross: +N.toExponential(5),
    elasticity_cc: +elCC.toFixed(6),
    elasticity_etrunc: +elET.toFixed(6),
    signed_sum: +(elCC + elET).toFixed(6),
    eflow_over_etrunc: +(t.E_flow / E_TRUNC).toExponential(3),
    logT0: +t.L.toFixed(3),
  };
});

// C_C sweep of the deep-arm landmark (factor 1 reproduces the base location).
const CC_FACTORS = [2.0, 1.5, 1.0, 0.75, 0.5, 0.25, 0.1];
const CC_SWEEP = CC_FACTORS.map((f) => {
  const C_C = C_C_PINNED * f;
  return {
    ccFactor: f,
    C_C: +C_C.toExponential(3),
    N_deep: +crossingForCC(SIGMA_TARGET, C_C).toExponential(5),
  };
});
const SWEEP_NS = CC_SWEEP.map((r) => r.N_deep);

export const IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY = {
  id: 'imp-96950',
  proofSection: 'S-frontier',
  question:
    'What is the conjugate C_C sensitivity d(log N_0.01)/d(log C_C_PINNED) of the imp-96931 ' +
    'sigma = 0.01 deep-decay crossing (N_0.01 ~ 4.624e13)? Pairing it against the imp-96931 ' +
    'E_trunc leverage -2.066, does the equal-and-opposite signed sum shrink FURTHER past the ' +
    'imp-96936 +0.00008 (its sigma = 0.1 endpoint) as E_flow / E_trunc collapses to ~4.3e-7? ' +
    'Completes the two-constant sensitivity picture for the deep-decay arm. Measurement/ ' +
    'sensitivity only; C_mb stays GUE-conditional (imp-486).',
  landmark: {
    sigma: SIGMA_TARGET,
    N_deep: +N_DEEP.toExponential(5), // ~4.62438e13 (matches imp-96931)
    elasticity_d_log_N_d_log_cc: +ELASTICITY_CC_DEEP.toFixed(6), // ~ +2.066446
    eflow_over_etrunc_at_crossing: +(DEEP_TERMS.E_flow / E_TRUNC).toExponential(3), // ~4.255e-7
    logT0_at_crossing: +DEEP_TERMS.L.toFixed(3), // ~30.001
  },
  conjugateLeverage: {
    d_log_Ndeep_d_log_cc: +ELASTICITY_CC_DEEP.toFixed(6), // ~ +2.066446 (this module)
    d_log_Ndeep_d_log_etrunc: +ELASTICITY_ETRUNC_DEEP.toFixed(6), // ~ -2.066445 (imp-96931, reused)
    signed_sum: +SIGNED_SUM_DEEP.toFixed(6), // ~ +0.000001 (equal-and-opposite, essentially exact)
    note:
      'The deep-arm C_C leverage +2.0664 is the MIRROR of the imp-96931 E_trunc leverage ' +
      '-2.0664: their signed sum is +0.000001, a part in a million, so deep in the decay arm the ' +
      'GUE-conditional share depends on the two constants ONLY through the ratio C_C / E_trunc. ' +
      'Raising C_C (heavier conditioning) pushes the decay LATER by almost exactly as much as a ' +
      'tighter floor pushes it EARLIER.',
  },
  conjugateLadder: CONJUGATE_LADDER,
  symmetryExactness: {
    signed_sum_at_010: CONJUGATE_LADDER[0].signed_sum, // ~ +0.000082 (imp-96936 endpoint)
    signed_sum_at_005: CONJUGATE_LADDER[1].signed_sum, // ~ +0.000021
    signed_sum_at_001: CONJUGATE_LADDER[2].signed_sum, // ~ +0.000001
    note:
      'The equal-and-opposite symmetry keeps becoming MORE exact deep in the decay arm as ' +
      'E_flow / E_trunc collapses: the signed sum shrinks monotonically +0.000082 (0.1) -> ' +
      '+0.000021 (0.05) -> +0.000001 (0.01), a decade tighter than the imp-96936 sigma = 0.1 ' +
      'endpoint. The tiny residual is the fixed E_flow term, which scales with NEITHER constant ' +
      'and so breaks the ratio symmetry only where E_flow is non-negligible -- essentially gone ' +
      'here.',
  },
  ccSweep: CC_SWEEP,
  ccSensitivity: {
    span_over_realistic_band: +(
      crossingForCC(SIGMA_TARGET, C_C_PINNED * 2.0) /
      crossingForCC(SIGMA_TARGET, C_C_PINNED * 0.5)
    ).toFixed(2), // ~17.5x over factor 0.5 .. 2 (matches imp-96931 E_trunc span)
    span_over_full_sweep: +(Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS)).toFixed(1), // ~494x
    note:
      'A heavier C_C pushes the deep-arm landmark to LARGER N (later decay) -- the sign OPPOSITE ' +
      'to a tighter floor -- with ~17.5x span over a realistic +/-2x C_C band, matching the ' +
      'imp-96931 E_trunc span. The quoted N_0.01 ~ 4.62e13 is exact ONLY at the pinned pair ' +
      '(C_C_PINNED, E_trunc = 3.06e-5).',
  },
  verdict:
    'THE C_C LEVERAGE OF THE sigma = 0.01 DEEP-DECAY CROSSING IS d(log N_0.01)/d(log C_C) ~ ' +
    '+2.0664, THE MIRROR of the imp-96931 E_trunc leverage -2.0664. The two are ' +
    'EQUAL-AND-OPPOSITE, and their signed sum +0.000001 shrinks FURTHER past the imp-96936 ' +
    'sigma = 0.1 endpoint +0.000082 (deep ladder +0.000082 -> +0.000021 -> +0.000001 at sigma ' +
    '0.1 -> 0.05 -> 0.01) as E_flow / E_trunc collapses to ~4.3e-7. So deep in the decay arm the ' +
    'GUE-conditional share depends on the two constants ONLY through the ratio C_C / E_trunc to a ' +
    'part in a million -- the same equal-and-opposite structure raised at the peak, now ' +
    'essentially exact. This completes the two-constant sensitivity picture for the deep-decay ' +
    'arm: a heavier conditioning coefficient pushes the decay LATER by exactly as much as a ' +
    'tighter floor pushes it EARLIER, and the shared excess past 2 (0.066) is the slowly-growing ' +
    'log T0 factor imp-96931 isolated. Measurement/sensitivity only; C_mb stays GUE-conditional ' +
    '(imp-486); no bound changes, no positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96931 (conjugate E_trunc leverage -2.066 at the sigma=0.01 deep-decay crossing, reused); ' +
    'imp-96936 (sigma=0.25 C_C leverage +2.087, signed sum +0.00008 by sigma=0.1); imp-96916 ' +
    '(ladder {0.75,0.5,0.25,0.1}); imp-3444 (base landmark N_half 3.267235e9); imp-3406 (interior ' +
    'max, sigma curve); imp-2631 (E_trunc = 3.06e-5 floor); imp-2714 (C_C_PINNED = (1/8) ' +
    'sqrt(3 pi)); imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping.',
};

export const IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY_ASSERTIONS = [
  {
    // Reuse gate: at C_C_PINNED the crossing reproduces the imp-96931 N_0.01 ~ 4.624e13.
    id: 'imp96950-reproduces-imp96931-deep-crossing',
    description: 'C_C = C_C_PINNED reproduces the imp-96931 N_0.01 ~ 4.624e13 (identical formulas)',
    holds: () =>
      Math.abs(N_DEEP - IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.landmark.N_deep) /
        IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.landmark.N_deep <
      1e-3,
  },
  {
    // F1: the C_C leverage is near +2 (inverse-square regime), the mirror direction of E_trunc.
    id: 'imp96950-cc-elasticity-near-plus-two',
    description: 'd(log N_0.01)/d(log C_C) is near +2 (in [1.9, 2.2]) -- raising C_C pushes the crossing later',
    holds: () => ELASTICITY_CC_DEEP > 1.9 && ELASTICITY_CC_DEEP < 2.2,
  },
  {
    // F1: the C_C leverage has the OPPOSITE sign to the imp-96931 E_trunc leverage.
    id: 'imp96950-cc-opposite-sign-to-etrunc',
    description: 'the C_C leverage is positive while the imp-96931 E_trunc leverage is negative (mirror directions)',
    holds: () => ELASTICITY_CC_DEEP > 0 && ELASTICITY_ETRUNC_DEEP < 0,
  },
  {
    // F1: the deep-arm C_C leverage matches the imp-96931 E_trunc leverage magnitude to < 0.01%.
    id: 'imp96950-leverages-equal-and-opposite',
    description: 'the C_C and E_trunc leverage magnitudes agree to < 0.01% (share set by the ratio C_C / E_trunc)',
    holds: () =>
      Math.abs(Math.abs(ELASTICITY_CC_DEEP) - Math.abs(ELASTICITY_ETRUNC_DEEP)) /
        Math.abs(ELASTICITY_ETRUNC_DEEP) <
      1e-4,
  },
  {
    // F2: the signed sum at sigma=0.01 is tighter than the imp-96936 sigma=0.1 endpoint (+0.000082).
    id: 'imp96950-signed-sum-shrinks-past-imp96936',
    description: 'the signed sum at sigma=0.01 is smaller in magnitude than the imp-96936 sigma=0.1 endpoint (~+0.00008)',
    holds: () => Math.abs(SIGNED_SUM_DEEP) < 8.2e-5,
  },
  {
    // F2: the signed sum shrinks monotonically down the deep ladder as E_flow collapses.
    id: 'imp96950-signed-sum-shrinks-with-eflow',
    description: 'the signed sum |elast_cc + elast_etrunc| decreases monotonically down the deep ladder as E_flow collapses',
    holds: () => {
      for (let i = 1; i < CONJUGATE_LADDER.length; i++) {
        if (Math.abs(CONJUGATE_LADDER[i].signed_sum) >= Math.abs(CONJUGATE_LADDER[i - 1].signed_sum)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    // F2: E_flow has essentially vanished at the crossing (the symmetry breaker is gone).
    id: 'imp96950-eflow-vanished-at-deep',
    description: 'E_flow / E_trunc at the sigma=0.01 crossing is < 1e-6 (symmetry breaker essentially gone)',
    holds: () => DEEP_TERMS.E_flow / E_TRUNC < 1e-6,
  },
  {
    // F3: a heavier C_C pushes the crossing to LARGER N (later decay) -- monotone, opposite to E_trunc.
    id: 'imp96950-heavier-cc-pushes-deep-later',
    description: 'as the C_C factor increases, N_0.01 increases monotonically (later decay; opposite to a tighter floor)',
    holds: () => {
      // CC_SWEEP is ordered by DECREASING factor, so N_deep must DECREASE along it.
      for (let i = 1; i < CC_SWEEP.length; i++) {
        if (CC_SWEEP[i].N_deep >= CC_SWEEP[i - 1].N_deep) return false;
      }
      return true;
    },
  },
  {
    // F3: C_C-sensitive landmark -- the full sweep spans well over a decade in N.
    id: 'imp96950-deep-cc-sensitive',
    description: 'over the 0.1x .. 2x C_C sweep N_0.01 spans more than a decade (C_C-sensitive landmark)',
    holds: () => Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS) > 10,
  },
  {
    // Honesty gate: measurement/assessment only, equal-and-opposite verdict, no QED, no refereed bound is changed.
    id: 'imp96950-honesty-gate-no-qed',
    description: 'Assessment only: equal-and-opposite verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.isRigorous === false &&
      /EQUAL-AND-OPPOSITE/.test(IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.verdict) &&
      /NO QED/.test(IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.verdict),
  },
];

for (const a of IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96950-sigma-deep-decay-crossing-cc-elasticity assertion failed: ${a.id}`,
    );
  }
}
