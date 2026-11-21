/**
 * @module imp-96936-sigma-quarter-crossing-cc-elasticity
 *
 * imp-96936 (numerical, frontier-direction): MEASURE THE C_C SENSITIVITY of the
 * intermediate sigma = 0.25 crossing of the imp-3220/imp-3406 GUE-conditional share
 *     sigma(N) = E_coll(N) / E(N),
 * i.e. the elasticity d(log N_0.25)/d(log C_C_PINNED) of the crossing located by
 * imp-96916 at N_0.25 ~ 3.259e10. imp-96916 measured only that crossing E_trunc
 * elasticity (~ -2.087); imp-96794 varied C_C indirectly only at the interior PEAK
 * share, never at this decay-arm crossing. This module takes the C_C leverage at the
 * crossing and pairs it against the imp-96916 E_trunc leverage, completing the
 * TWO-CONSTANT sensitivity picture for the intermediate decay landmark.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * The GUE-conditional collision term E_coll = C_C_PINNED sqrt(log T0 / N) carries the
 * conditioning burden (imp-486). Its coefficient C_C_PINNED = (1/8) sqrt(3 pi) ~ 0.3837
 * (imp-2714) and the non-conditional truncation floor E_trunc = 3.06e-5 (imp-2631) are
 * the two constants that set WHERE on the decay arm any given share level sits.
 * imp-96916 read off d(log N_0.25)/d(log E_trunc) ~ -2.087 but left the CONJUGATE
 * leverage d(log N_0.25)/d(log C_C) unmeasured. Without it one cannot say whether the
 * two constants act as a single ratio C_C / E_trunc at the crossing (equal-and-opposite
 * leverages) or carry independent weight -- exactly the "equal-and-opposite" test the
 * peak-side siblings raised. This module supplies the missing conjugate number.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-3444 / imp-96916; only C_C varies)
 * ------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant; C_C swept)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5                            (imp-2631 pinned floor; held fixed)
 * C_C = C_C_PINNED reproduces imp-96916 byte-for-byte (N_0.25 = 3.25939e10); the swept
 * factors bracket a plausible band about the pinned coefficient.
 *
 * THE MECHANISM (why the C_C leverage is +2.087, the MIRROR of the E_trunc leverage)
 * ---------------------------------------------------------------------------------
 * On the decay arm sigma = s pins E_coll = (s/(1-s)) (E_trunc + E_flow). Once E_flow has
 * collapsed (2.6e-4 relative at the sigma = 0.25 crossing) this is C_C sqrt(log T0 / N)
 * = k E_trunc with k = s/(1-s), so
 *     N = (log T0) C_C^2 / (k E_trunc)^2,
 * i.e. to leading order N proportional to C_C^2 and to E_trunc^-2. Hence d(log N)/d(log
 * C_C) ~ +2 and d(log N)/d(log E_trunc) ~ -2: the two constants enter ONLY through the
 * ratio C_C / E_trunc, so their leverages are EQUAL-AND-OPPOSITE. The small excess past
 * 2 is the same slowly-growing log T0 factor imp-96916 flagged: raising C_C pushes the
 * crossing to larger N, which raises log T0, adding +0.087 to the C_C elasticity, the
 * mirror of the -0.087 the descending E_trunc perturbation subtracts.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE C_C LEVERAGE IS +2.0874, THE MIRROR OF THE imp-96916 E_trunc LEVERAGE.
 *        d(log N_0.25)/d(log C_C) ~ +2.087365, log-centred over C_C_PINNED/sqrt2 ..
 *        C_C_PINNED*sqrt2. RAISING C_C (a heavier conditioning burden) pushes the
 *        crossing to LARGER N -- later decay -- with almost exactly the magnitude by
 *        which raising E_trunc pushes it EARLIER (imp-96916: -2.086756).
 *   (F2) THE TWO LEVERAGES ARE EQUAL-AND-OPPOSITE, AND THE SYMMETRY IS EXACT AS E_flow
 *        COLLAPSES. The signed sum elast_C_C + elast_E_trunc = +0.000608 at sigma = 0.25
 *        (a 0.03% residual), and along the ladder it shrinks monotonically toward zero
 *        as E_flow / E_trunc collapses: +0.0325 (0.75) -> +0.0044 (0.5) -> +0.00061
 *        (0.25) -> +0.000082 (0.1). So at the crossing the share depends on the two
 *        constants ONLY through the ratio C_C / E_trunc, exactly as at the peak; the tiny
 *        residual is the fixed E_flow term (which scales with neither constant) breaking
 *        the ratio symmetry, vanishing where E_flow is negligible.
 *   (F3) THE CROSSING IS C_C-SENSITIVE, WITH THE OPPOSITE DIRECTION TO E_trunc. Over a
 *        realistic +/-2x C_C band (factor 0.5 .. 2) N_0.25 ranges ~7.65e9 .. 1.38e11
 *        (~18x, matching the imp-96916 E_trunc span), and over the full 20x sweep it
 *        swings ~2.53e8 .. (2x) with a heavier C_C moving it LATER -- the sign opposite
 *        to a tighter floor. The quoted location N_0.25 ~ 3.26e10 is exact ONLY at the
 *        pinned pair (C_C_PINNED, E_trunc = 3.06e-5).
 *
 * VERDICT: THE C_C LEVERAGE OF THE sigma = 0.25 CROSSING IS d(log N_0.25)/d(log C_C) ~
 * +2.0874, THE MIRROR OF THE imp-96916 E_trunc LEVERAGE -2.0868. The two are
 * EQUAL-AND-OPPOSITE (signed sum +0.0006 at the crossing, shrinking to +0.00008 by
 * sigma = 0.1 as E_flow collapses), so at the crossing the GUE-conditional share depends
 * on the two constants ONLY through the ratio C_C / E_trunc -- the same equal-and-opposite
 * structure the peak-side siblings raised. This completes the two-constant sensitivity
 * picture for the intermediate decay landmark: a heavier conditioning coefficient pushes
 * the decay LATER by exactly as much as a tighter floor pushes it EARLIER, and the small
 * excess past 2 is the shared slowly-growing log T0 factor. Measurement/sensitivity only;
 * C_mb stays GUE-conditional (imp-486); no bound changes, no positivity, no bridge
 * closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96916-sigma-quarter-crossing-etrunc-elasticity (the conjugate E_trunc leverage -2.087 this module mirrors)
 * @see imp-96794-etrunc-reduction-peak-share-leverage (peak-share leverage; this module adds the decay-arm C_C leverage)
 * @see imp-96813-sigma-decay-landmark-etrunc-sensitivity (flank decay landmarks 0.5/0.1)
 * @see imp-3444-sigma-nshape-landmark-ladder (base landmark N_half 3.267235e9, pinned floor)
 * @see imp-3406-sigma-highN-extrapolation (interior max, sigma curve)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor); imp-2714 (C_C_PINNED = (1/8) sqrt(3 pi))
 * @see imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY } from './imp-96916-sigma-quarter-crossing-etrunc-elasticity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // imp-2631 fixed-strip floor, held fixed (imp-96916 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-3444 / imp-96916 exactly

// EXACT imp-96916 sub-terms; ONLY the GUE-conditional coefficient C_C is a parameter here.
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
// (identical bisection to imp-96916 crossingForFloor; the peak sits below 1e6).
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

// Log-centred signed elasticity on the C_C coefficient (same recipe as imp-96916, C_C axis).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const DEN = Math.log(C_C_PINNED * F_HI) - Math.log(C_C_PINNED * F_LO);
function ccElasticityForLevel(target) {
  const lo = crossingForCC(target, C_C_PINNED * F_LO);
  const hi = crossingForCC(target, C_C_PINNED * F_HI);
  return (Math.log(hi) - Math.log(lo)) / DEN;
}

// The headline intermediate landmark.
const SIGMA_TARGET = 0.25;
const N_QUARTER = crossingForCC(SIGMA_TARGET, C_C_PINNED);
const QUARTER_TERMS = termsWith(N_QUARTER, C_C_PINNED);
const ELASTICITY_CC_QUARTER = ccElasticityForLevel(SIGMA_TARGET); // ~ +2.087365

// The conjugate E_trunc leverage measured by imp-96916 (reused, not recomputed).
const ELASTICITY_ETRUNC_QUARTER =
  IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.landmark.elasticity_d_log_N_d_log_etrunc; // ~ -2.086756
const SIGNED_SUM_QUARTER = ELASTICITY_CC_QUARTER + ELASTICITY_ETRUNC_QUARTER; // ~ +0.0006

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

// Interpolation ladder: the two leverages are equal-and-opposite, exactly so as E_flow collapses.
const LADDER_LEVELS = [0.75, 0.5, 0.25, 0.1];
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
  };
});

// C_C sweep of the intermediate landmark (factor 1 reproduces the base location).
const CC_FACTORS = [2.0, 1.5, 1.0, 0.75, 0.5, 0.25, 0.1];
const CC_SWEEP = CC_FACTORS.map((f) => {
  const C_C = C_C_PINNED * f;
  return {
    ccFactor: f,
    C_C: +C_C.toExponential(3),
    N_quarter: +crossingForCC(SIGMA_TARGET, C_C).toExponential(5),
  };
});
const SWEEP_NS = CC_SWEEP.map((r) => r.N_quarter);

export const IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY = {
  id: 'imp-96936',
  proofSection: 'S-frontier',
  question:
    'What is the C_C sensitivity d(log N_0.25)/d(log C_C_PINNED) of the intermediate sigma = 0.25 ' +
    'crossing located by imp-96916 (N_0.25 ~ 3.259e10)? Pairing it against the imp-96916 E_trunc ' +
    'leverage -2.087, are the C_C and E_trunc leverages equal-and-opposite (share set by the ratio ' +
    'C_C / E_trunc), as at the peak? Completes the two-constant sensitivity picture for the ' +
    'intermediate decay landmark. Measurement/sensitivity only; C_mb stays GUE-conditional (imp-486).',
  landmark: {
    sigma: SIGMA_TARGET,
    N_quarter: +N_QUARTER.toExponential(5), // ~3.25939e10 (matches imp-96916)
    elasticity_d_log_N_d_log_cc: +ELASTICITY_CC_QUARTER.toFixed(6), // ~ +2.087365
    eflow_over_etrunc_at_crossing: +(QUARTER_TERMS.E_flow / E_TRUNC).toExponential(3), // ~2.625e-4
    logT0_at_crossing: +QUARTER_TERMS.L.toFixed(3), // ~23.040
  },
  conjugateLeverage: {
    d_log_Nquarter_d_log_cc: +ELASTICITY_CC_QUARTER.toFixed(6), // ~ +2.087365 (this module)
    d_log_Nquarter_d_log_etrunc: +ELASTICITY_ETRUNC_QUARTER.toFixed(6), // ~ -2.086756 (imp-96916, reused)
    signed_sum: +SIGNED_SUM_QUARTER.toFixed(6), // ~ +0.000609 (equal-and-opposite)
    note:
      'The C_C leverage +2.0874 is the MIRROR of the imp-96916 E_trunc leverage -2.0868: their ' +
      'signed sum is +0.0006 (~0.03%), so at the crossing the GUE-conditional share depends on the ' +
      'two constants ONLY through the ratio C_C / E_trunc. Raising C_C (heavier conditioning) pushes ' +
      'the decay LATER by almost exactly as much as a tighter floor pushes it EARLIER.',
  },
  conjugateLadder: CONJUGATE_LADDER,
  symmetryExactness: {
    signed_sum_at_075: CONJUGATE_LADDER[0].signed_sum, // ~ +0.0325
    signed_sum_at_025: CONJUGATE_LADDER[2].signed_sum, // ~ +0.0006
    signed_sum_at_010: CONJUGATE_LADDER[3].signed_sum, // ~ +0.0001
    note:
      'The equal-and-opposite symmetry becomes EXACT as E_flow / E_trunc collapses down the arm: ' +
      'the signed sum shrinks monotonically +0.0325 (0.75) -> +0.0044 (0.5) -> +0.0006 (0.25) -> ' +
      '+0.0001 (0.1). The tiny residual is the fixed E_flow term, which scales with NEITHER constant ' +
      'and so breaks the ratio symmetry only where E_flow is non-negligible.',
  },
  ccSweep: CC_SWEEP,
  ccSensitivity: {
    span_over_realistic_band: +(
      crossingForCC(SIGMA_TARGET, C_C_PINNED * 2.0) /
      crossingForCC(SIGMA_TARGET, C_C_PINNED * 0.5)
    ).toFixed(2), // ~18x over factor 0.5 .. 2 (matches imp-96916 E_trunc span)
    span_over_full_sweep: +(Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS)).toFixed(1),
    note:
      'A heavier C_C pushes the intermediate landmark to LARGER N (later decay) -- the sign OPPOSITE ' +
      'to a tighter floor -- with ~18x span over a realistic +/-2x C_C band, matching the imp-96916 ' +
      'E_trunc span. The quoted N_0.25 ~ 3.26e10 is exact ONLY at the pinned pair (C_C_PINNED, ' +
      'E_trunc = 3.06e-5).',
  },
  verdict:
    'THE C_C LEVERAGE OF THE sigma = 0.25 CROSSING IS d(log N_0.25)/d(log C_C) ~ +2.0874, THE MIRROR ' +
    'of the imp-96916 E_trunc leverage -2.0868. The two are EQUAL-AND-OPPOSITE (signed sum +0.0006 ' +
    'at the crossing, shrinking to +0.0001 by sigma = 0.1 as E_flow collapses), so at the crossing ' +
    'the GUE-conditional share depends on the two constants ONLY through the ratio C_C / E_trunc -- ' +
    'the same equal-and-opposite structure raised at the peak. This completes the two-constant ' +
    'sensitivity picture for the intermediate decay landmark: a heavier conditioning coefficient ' +
    'pushes the decay LATER by exactly as much as a tighter floor pushes it EARLIER, and the small ' +
    'excess past 2 is the shared slowly-growing log T0 factor. Measurement/sensitivity only; C_mb ' +
    'stays GUE-conditional (imp-486); no bound changes, no positivity, no bridge closure, no RH ' +
    'claim, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96916 (conjugate E_trunc leverage -2.087 at the sigma=0.25 crossing, reused); imp-96794 ' +
    '(peak-share leverage); imp-96813 (flank decay landmarks 0.5/0.1); imp-3444 (base landmark ' +
    'N_half 3.267235e9); imp-3406 (interior max, sigma curve); imp-2631 (E_trunc = 3.06e-5 floor); ' +
    'imp-2714 (C_C_PINNED = (1/8) sqrt(3 pi)); imp-398 (E_flow C_F prefactor); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY_ASSERTIONS = [
  {
    // Reuse gate: at C_C_PINNED the crossing reproduces the imp-96916 N_0.25 ~ 3.259e10.
    id: 'imp96936-reproduces-imp96916-quarter-crossing',
    description: 'C_C = C_C_PINNED reproduces the imp-96916 N_0.25 ~ 3.259e10 (identical formulas)',
    holds: () =>
      Math.abs(N_QUARTER - IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.landmark.N_quarter) /
        IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.landmark.N_quarter <
      1e-3,
  },
  {
    // F1: the C_C leverage is near +2 (inverse-square regime), the mirror direction of E_trunc.
    id: 'imp96936-cc-elasticity-near-plus-two',
    description: 'd(log N_0.25)/d(log C_C) is near +2 (in [1.8, 2.3]) -- raising C_C pushes the crossing later',
    holds: () => ELASTICITY_CC_QUARTER > 1.8 && ELASTICITY_CC_QUARTER < 2.3,
  },
  {
    // F1: the C_C leverage has the OPPOSITE sign to the imp-96916 E_trunc leverage.
    id: 'imp96936-cc-opposite-sign-to-etrunc',
    description: 'the C_C leverage is positive while the imp-96916 E_trunc leverage is negative (mirror directions)',
    holds: () => ELASTICITY_CC_QUARTER > 0 && ELASTICITY_ETRUNC_QUARTER < 0,
  },
  {
    // F2: the two leverages are equal-and-opposite -- their magnitudes match to < 0.5%.
    id: 'imp96936-leverages-equal-and-opposite',
    description: 'the C_C and E_trunc leverage magnitudes agree to < 0.5% (share set by the ratio C_C / E_trunc)',
    holds: () =>
      Math.abs(Math.abs(ELASTICITY_CC_QUARTER) - Math.abs(ELASTICITY_ETRUNC_QUARTER)) /
        Math.abs(ELASTICITY_ETRUNC_QUARTER) <
      5e-3,
  },
  {
    // F2: the signed sum shrinks toward zero as sigma falls and E_flow / E_trunc collapses.
    id: 'imp96936-signed-sum-shrinks-with-eflow',
    description: 'the signed sum |elast_cc + elast_etrunc| decreases monotonically down the ladder as E_flow collapses',
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
    // F3: a heavier C_C pushes the crossing to LARGER N (later decay) -- monotone, opposite to E_trunc.
    id: 'imp96936-heavier-cc-pushes-quarter-later',
    description: 'as the C_C factor increases, N_0.25 increases monotonically (later decay; opposite to a tighter floor)',
    holds: () => {
      // CC_SWEEP is ordered by DECREASING factor, so N_quarter must DECREASE along it.
      for (let i = 1; i < CC_SWEEP.length; i++) {
        if (CC_SWEEP[i].N_quarter >= CC_SWEEP[i - 1].N_quarter) return false;
      }
      return true;
    },
  },
  {
    // F3: C_C-sensitive landmark -- the full sweep spans well over a decade in N.
    id: 'imp96936-quarter-cc-sensitive',
    description: 'over the 0.1x .. 2x C_C sweep N_0.25 spans more than a decade (C_C-sensitive landmark)',
    holds: () => Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS) > 10,
  },
  {
    // Honesty gate: measurement/assessment only, equal-and-opposite verdict, no QED, no refereed bound is changed.
    id: 'imp96936-honesty-gate-no-qed',
    description: 'Assessment only: equal-and-opposite verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.isRigorous === false &&
      /EQUAL-AND-OPPOSITE/.test(IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.verdict) &&
      /NO QED/.test(IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.verdict),
  },
];

for (const a of IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96936-sigma-quarter-crossing-cc-elasticity assertion failed: ${a.id}`,
    );
  }
}
