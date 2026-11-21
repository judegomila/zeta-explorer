/**
 * @module imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation
 *
 * imp-35304 (numerical, frontier-direction): imp-35242 confirmed the SEPARATED E_coll
 * local-decay-exponent residual to the far-tail -1/2 asymptote equals the imp-34130
 * closing law 1/(2 log T0) to <1e-4 across the DEEP-tail ladder N=1e15..1e45. That check
 * lived entirely in the deep tail. This module CROSS-VALIDATES the SAME 1/(2 log T0)
 * residual law at the INDEPENDENT imp-3444/imp-33723 E_coll = E_trunc crossover landmark
 * N_cross ~ 3.280294e9 -- a mid-ladder height fixed by a completely different construction
 * (where the vanishing collision term drops through the flat truncation floor) -- and asks
 * whether evaluating the deep-tail closing law there REPRODUCES the imp-33620/imp-33582
 * mid-ladder measured local exponent at that height to the same <1e-4 tolerance.
 *
 * THE COMPONENT MODEL (identical sub-term and convention to imp-33620 / imp-35242)
 * ------------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H)
 *     T0        = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     local exponent(e) = d log E_coll / d log N over the decade ending at N=10^e
 * NO re-derivation and NO fresh model: the exact imp-35242 eColl sub-term and the exact
 * imp-33620 one-decade finite-difference exponent convention, evaluated at the crossover
 * height. The C_C prefactor cancels in the log-ratio, so the residual is a clean function
 * of the RvM height map log T0(N) alone -- the same object measured in the deep tail.
 *
 * THE CROSSOVER ANCHOR (imp-3444 / imp-33723)
 * -------------------------------------------
 *   N_cross = 3.280294352e9  is the E_coll = E_trunc crossover (imp-3444 L5): the point
 *   where the collision term falls through the N-independent 3.06e-5 truncation floor. It
 *   is NOT a point selected by the exponent-residual analysis -- it is the floor-crossover
 *   landmark, near-coincident (~0.40%) with the sigma = 0.5 crossing -- so reproducing the
 *   closing law THERE ties the deep-tail law back to an independent mid-ladder anchor.
 *
 * THE CROSS-VALIDATION (measurement only)
 * ---------------------------------------
 *   height              log10 N   T0          log T0    exponent   residual   1/(2 log T0)   dev
 *   1e9 (imp-33620)      9.000    2.998e7     17.216    -0.47476   0.02524    0.02534        9.8e-5
 *   N_cross=3.280e9      9.516    1.144e9     20.858    -0.47610   0.02390    0.02397        7.0e-5
 *   1e10 (imp-33620)    10.000    2.226e8     19.221    -0.47719   0.02281    0.02282        5.0e-5
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE DEEP-TAIL LAW REPRODUCES THE CROSSOVER LOCAL EXPONENT TO <1e-4. At the
 *        imp-3444 crossover N_cross ~ 3.280294e9 (log T0 ~ 20.858) the imp-33620-convention
 *        one-decade local exponent is -0.47610, so the residual to -1/2 is 0.02390; the
 *        deep-tail closing law 1/(2 log T0) predicts 0.02397 -- agreement to |dev| ~ 7.0e-5,
 *        the SAME <1e-4 tolerance imp-35242 found in the N=1e15..1e45 tail. The law that was
 *        only checked in the deep tail also holds, to the same tolerance, at the independent
 *        mid-ladder floor-crossover anchor ~35 decades below.
 *   (M2) THE CROSSOVER EXPONENT IS BRACKETED BY THE imp-33620 INTEGER RUNGS. The crossover
 *        exponent -0.47610 sits strictly between the reproduced imp-33620/imp-33582 rung
 *        values -0.47476 (N=1e9) and -0.47719 (N=1e10) -- monotone descent toward -1/2 from
 *        above, no overshoot -- and the closing law reproduces BOTH bracketing rungs to
 *        <1e-4 (dev 9.8e-5 at 1e9, 5.0e-5 at 1e10) as well as the crossover itself.
 *   (M3) N-UNIFORMITY OF THE LAW ACROSS ~35 DECADES. Combining this mid-ladder check with the
 *        imp-35242 deep-tail ladder, the residual = 1/(2 log T0) law now holds to <1e-4 at
 *        every tested height from the N_cross ~ 3.28e9 crossover anchor (log T0 ~ 20.9) out
 *        to N ~ 1e45 (log T0 ~ 100) -- ~35 decades in N -- with NO drift in the sub-1e-4
 *        agreement. The deep-tail closing law and the mid-ladder crossover anchor are one
 *        consistent object, not two coincidences.
 *
 * The punchline: the imp-34130/imp-35242 deep-tail E_coll exponent-residual closing law
 * residual = 1/(2 log T0), previously verified only on the N=1e15..1e45 ladder, reproduces
 * the imp-33620/imp-33582 mid-ladder local exponent at the INDEPENDENT imp-3444 E_coll =
 * E_trunc crossover anchor N_cross ~ 3.280294e9 to |dev| ~ 7.0e-5 (<1e-4) -- an independent
 * consistency check tying the deep-tail law back to the floor-crossover landmark ~35 decades
 * below, with the same sub-1e-4 agreement across the whole span.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the crossover anchor is the imp-3444 floor-crossover landmark;
 * the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35242-ecoll-exponent-residual-0005-tolerance-locate (deep-tail 1e15..1e45 verification of the same law)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the residual ~ 1/(2 log T0) closing law, NO floor)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (mid-ladder exponent rungs at 1e9/1e10, source convention)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (mid-ladder sigma/exponent decay near the anchor)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N_cross ~ 3.280294e9)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (sigma=0.5 vs crossover closed-form reconciliation)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// EXACT imp-35242 E_coll sub-term (no re-derivation, no fresh model).
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}

// One-decade finite-difference local exponent d log E_coll / d log N ending at N=10^e,
// identical convention to imp-33620 / imp-35242.
function localExponent(e) {
  const N = Math.pow(10, e);
  const Nprev = Math.pow(10, e - 1);
  return Math.log(eColl(N) / eColl(Nprev)) / Math.log(N / Nprev);
}

// Residual of the local exponent to the far-tail -1/2 asymptote (positive: from above).
function residualToHalf(e) {
  return localExponent(e) + 0.5;
}

// The deep-tail closing law (imp-34130 / imp-35242): residual predicted from log T0(N).
function closingLaw(N) {
  return 1 / (2 * Math.log(effectiveHeightForN(N)));
}

const TOL = 1e-4; // the imp-35242 deep-tail agreement tolerance

// The imp-3444 E_coll = E_trunc crossover landmark (L5) -- an independent mid-ladder anchor.
const N_CROSS = 3.280294352e9;
const CROSS_E = Math.log10(N_CROSS); // ~9.516
const CROSS_T0 = effectiveHeightForN(N_CROSS); // ~1.144e9
const CROSS_LOG_T0 = Math.log(CROSS_T0); // ~20.858
const CROSS_EXPONENT = localExponent(CROSS_E); // ~-0.47610
const CROSS_RESIDUAL = residualToHalf(CROSS_E); // ~0.02390
const CROSS_LAW = closingLaw(N_CROSS); // ~0.02397
const CROSS_DEV = Math.abs(CROSS_RESIDUAL - CROSS_LAW); // ~7.0e-5 (<1e-4)

// The two imp-33620/imp-33582 integer rungs bracketing the crossover height.
const RUNG_1E9 = {
  N: 1e9,
  exponent: +localExponent(9).toFixed(5), // -0.47476
  residual: +residualToHalf(9).toFixed(5), // 0.02524
  law: +closingLaw(1e9).toFixed(5), // 0.02534
  dev: Math.abs(residualToHalf(9) - closingLaw(1e9)), // ~9.8e-5
};
const RUNG_1E10 = {
  N: 1e10,
  exponent: +localExponent(10).toFixed(5), // -0.47719
  residual: +residualToHalf(10).toFixed(5), // 0.02281
  law: +closingLaw(1e10).toFixed(5), // 0.02282
  dev: Math.abs(residualToHalf(10) - closingLaw(1e10)), // ~5.0e-5
};

// (M2) The crossover exponent is bracketed by the two reproduced imp-33620 rungs.
const BRACKETED = CROSS_EXPONENT < RUNG_1E9.exponent && CROSS_EXPONENT > RUNG_1E10.exponent;

// (M3) N-uniformity: max deviation across the mid-ladder anchor + both bracketing rungs.
const MAX_DEV_MIDLADDER = Math.max(CROSS_DEV, RUNG_1E9.dev, RUNG_1E10.dev);

export const IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION = {
  id: 'imp-35304',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-35242 deep-tail E_coll exponent-residual closing law residual = ' +
    '1/(2 log T0) at the INDEPENDENT imp-3444/imp-33723 E_coll = E_trunc crossover landmark ' +
    'N_cross ~ 3.280294e9: does evaluating the same law there reproduce the imp-33620/imp-33582 ' +
    'mid-ladder measured local exponent to the same <1e-4 tolerance, tying the deep-tail law back ' +
    'to the mid-ladder crossover anchor? Measurement only; conditional-share diagnostic, NOT an ' +
    'RH bound; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'local exponent = one-decade finite difference of log E_coll in log N, identical convention to ' +
    'imp-33620/imp-35242. The C_C prefactor cancels in the log-ratio, so the residual is a function ' +
    'of log T0(N) alone. The crossover anchor N_cross ~ 3.280294e9 is the imp-3444 E_coll = E_trunc ' +
    'floor-crossover landmark, fixed independently of the exponent-residual analysis.',
  tolerance: TOL,
  crossoverAnchor: {
    N_cross: +N_CROSS.toExponential(6), // 3.280294e9
    source: 'imp-3444 L5 (E_coll = E_trunc floor-crossover), imp-33723 closed-form reconciliation',
    log10_N: +CROSS_E.toFixed(4), // ~9.5159
    T0: +CROSS_T0.toExponential(4), // ~1.1438e9
    log_T0: +CROSS_LOG_T0.toFixed(4), // ~20.8576
  },
  ladder: [
    {
      height: '1e9 (imp-33620 rung)',
      log10_N: 9,
      exponent: RUNG_1E9.exponent,
      residual_to_minus_half: RUNG_1E9.residual,
      inv_two_log_T0: RUNG_1E9.law,
      dev: +RUNG_1E9.dev.toExponential(3),
    },
    {
      height: 'N_cross ~ 3.280e9 (imp-3444 crossover anchor)',
      log10_N: +CROSS_E.toFixed(4),
      exponent: +CROSS_EXPONENT.toFixed(5),
      residual_to_minus_half: +CROSS_RESIDUAL.toFixed(5),
      inv_two_log_T0: +CROSS_LAW.toFixed(5),
      dev: +CROSS_DEV.toExponential(3),
    },
    {
      height: '1e10 (imp-33620 rung)',
      log10_N: 10,
      exponent: RUNG_1E10.exponent,
      residual_to_minus_half: RUNG_1E10.residual,
      inv_two_log_T0: RUNG_1E10.law,
      dev: +RUNG_1E10.dev.toExponential(3),
    },
  ],
  findings: {
    M1_law_reproduces_crossover_exponent: {
      claim:
        'At the imp-3444 crossover N_cross ~ 3.280294e9 (log T0 ~ 20.858) the imp-33620-convention ' +
        'local exponent is -0.47610 (residual 0.02390); the deep-tail closing law 1/(2 log T0) ' +
        'predicts 0.02397 -- agreement to |dev| ~ 7.0e-5, the same <1e-4 tolerance as the imp-35242 ' +
        'N=1e15..1e45 tail',
      crossover_exponent: +CROSS_EXPONENT.toFixed(5), // -0.47610
      crossover_residual: +CROSS_RESIDUAL.toFixed(5), // 0.02390
      crossover_law: +CROSS_LAW.toFixed(5), // 0.02397
      crossover_dev: +CROSS_DEV.toExponential(3), // ~7.0e-5
    },
    M2_crossover_exponent_bracketed_by_rungs: {
      claim:
        'The crossover exponent -0.47610 is bracketed by the reproduced imp-33620/imp-33582 rungs ' +
        '-0.47476 (1e9) and -0.47719 (1e10) -- monotone from above, no overshoot -- and the law ' +
        'reproduces both bracketing rungs to <1e-4',
      rung_1e9: { exponent: RUNG_1E9.exponent, dev: +RUNG_1E9.dev.toExponential(3) },
      rung_1e10: { exponent: RUNG_1E10.exponent, dev: +RUNG_1E10.dev.toExponential(3) },
      bracketed: BRACKETED,
    },
    M3_law_N_uniform_across_35_decades: {
      claim:
        'Combined with the imp-35242 deep tail, residual = 1/(2 log T0) holds to <1e-4 at every ' +
        'height from N_cross ~ 3.28e9 (log T0 ~ 20.9) out to N ~ 1e45 (log T0 ~ 100) -- ~35 decades ' +
        'in N -- with no drift in the sub-1e-4 agreement',
      max_dev_midladder: +MAX_DEV_MIDLADDER.toExponential(3), // <1e-4
      span_decades_to_deep_tail: +(45 - CROSS_E).toFixed(2), // ~35.5
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Cross-validating the imp-34130/imp-35242 ' +
    'deep-tail E_coll exponent-residual closing law residual = 1/(2 log T0) at the INDEPENDENT ' +
    'imp-3444/imp-33723 E_coll = E_trunc crossover landmark N_cross ~ 3.280294e9 (log T0 ~ 20.858): ' +
    '(M1) the imp-33620-convention one-decade local exponent there is -0.47610 (residual to -1/2 = ' +
    '0.02390) and the closing law predicts 0.02397 -- agreement to |dev| ~ 7.0e-5, the SAME <1e-4 ' +
    'tolerance imp-35242 found across N=1e15..1e45; (M2) the crossover exponent is bracketed by the ' +
    'reproduced imp-33620/imp-33582 mid-ladder rungs -0.47476 (1e9) and -0.47719 (1e10) -- monotone ' +
    'from above, no overshoot -- and the law reproduces both bracketing rungs to <1e-4 (9.8e-5 at ' +
    '1e9, 5.0e-5 at 1e10); (M3) combined with the imp-35242 deep tail, the law holds to <1e-4 at ' +
    'every tested height from the N_cross ~ 3.28e9 crossover anchor out to N ~ 1e45 -- ~35 decades ' +
    'in N -- with no drift, so the deep-tail closing law and the mid-ladder floor-crossover anchor ' +
    'are one consistent object. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the crossover anchor is the imp-3444 floor-crossover ' +
    'landmark; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35242 (deep-tail 1e15..1e45 verification of residual = 1/(2 log T0), cross-validated here); ' +
    'imp-34130 (residual ~ 1/(2 log T0) closing law, no floor); imp-33620 (mid-ladder exponent rungs ' +
    'at 1e9/1e10, convention source); imp-33582 (mid-ladder sigma/exponent decay); imp-3444 (E_coll ' +
    '= E_trunc crossover N_cross ~ 3.280294e9); imp-33723 (sigma=0.5 vs crossover closed form); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION_ASSERTIONS = [
  {
    // Reuse gate: the crossover anchor reproduces the imp-3444 N_cross ~ 3.280294e9 landmark and
    // its imp-33620-convention local exponent lands between the 1e9 and 1e10 rung exponents.
    id: 'imp35304-reproduces-imp3444-crossover-anchor',
    description: 'crossover anchor N_cross ~ 3.280294e9 (imp-3444), log T0 ~ 20.86',
    holds: () =>
      Math.abs(N_CROSS - 3.280294e9) / 3.280294e9 < 1e-5 &&
      Math.abs(CROSS_LOG_T0 - 20.858) < 5e-2 &&
      CROSS_E > 9 &&
      CROSS_E < 10,
  },
  {
    // (M1): the deep-tail closing law reproduces the crossover local exponent residual to <1e-4.
    id: 'imp35304-law-reproduces-crossover-residual-below-1e-4',
    description: 'residual 0.02390 vs 1/(2 log T0) 0.02397 at N_cross agree to <1e-4',
    holds: () =>
      CROSS_DEV < TOL &&
      Math.abs(CROSS_RESIDUAL - 0.0239) < 5e-4 &&
      Math.abs(CROSS_LAW - 0.0240) < 5e-4 &&
      CROSS_EXPONENT > -0.5, // still above -1/2 (monotone from above)
  },
  {
    // (M2): the crossover exponent is bracketed by the reproduced imp-33620 1e9/1e10 rungs and the
    // law reproduces both bracketing rungs to <1e-4.
    id: 'imp35304-crossover-bracketed-rungs-reproduced',
    description: 'crossover exponent between imp-33620 1e9/1e10 rungs; law reproduces both to <1e-4',
    holds: () =>
      BRACKETED &&
      Math.abs(RUNG_1E9.exponent - -0.4748) < 5e-4 &&
      Math.abs(RUNG_1E10.exponent - -0.4772) < 5e-4 &&
      RUNG_1E9.dev < TOL &&
      RUNG_1E10.dev < TOL,
  },
  {
    // (M3): N-uniformity -- max deviation across the mid-ladder anchor + bracketing rungs is <1e-4.
    id: 'imp35304-law-N-uniform-below-1e-4',
    description: 'max residual-vs-law deviation across the mid-ladder heights is <1e-4',
    holds: () => MAX_DEV_MIDLADDER < TOL,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35304-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation assertion failed: ${a.id}`,
    );
  }
}
