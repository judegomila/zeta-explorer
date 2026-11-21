/**
 * @module imp-35891-flattest-point-vs-sigmoid-knee-crosslocation
 *
 * imp-35891 (accuracy, cross-validation): CROSS-CHECK whether the imp-35853 REQ-4
 * required-height-multiple "flattest point" (sigma ~ 0.407, the mid-downslope minimum
 * of |d multiple / d sigma|) coincides in N with the imp-33701 sigmoid decay-rate
 * "knee" (the single second-difference inflection of the per-decade local decay
 * exponent, which imp-33701 placed in the [1e10,1e11] decade).
 *
 * Two independent frontier diagnostics each report a "knee" on the sigma post-peak
 * downslope, but of DIFFERENT curves:
 *   - imp-35853 flattest point: the minimum rate of change of the REQ-4 required-height
 *     multiple 200 / log T0 as a function of sigma; located at sigma ~ 0.407.
 *   - imp-33701 inflection: the sign change of the discrete second difference of the
 *     per-decade LOCAL DECAY EXPONENT p_dec(k) of sigma(N) itself; placed in [1e10,1e11].
 * They were never cross-located in the shared N coordinate. This module maps the
 * imp-35853 flattest-point sigma to its downslope N on the EXACT same imp-3406 /
 * imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll)) and reports the N
 * of each marker, testing whether the two "knee" characterizations locate a consistent
 * height.
 *
 * THE MODEL (identical imp-3406 / imp-33582 sub-terms -- no re-derivation, no fresh term)
 * -------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     log T0 = log(effectiveHeightForN(N))   (imp-3220 / imp-3406 RvM surrogate).
 * These reproduce the imp-33582 / imp-35813 interior peak (N ~ 9.22e5, sigma_max ~ 0.9494)
 * and the imp-35889 flattest-point height (N ~ 7.20e9), which serve as the reuse gates.
 *
 * THE MEASUREMENT: map sigma_flat -> N_flat, compare to the imp-33701 inflection decade
 * -------------------------------------------------------------------------------------
 *   (a) N_flat = downslope N at which sigma = imp-35853 flattest-point sigma (~0.407),
 *       located by bisection on sigma(N) for N > N_peak.
 *   (b) The imp-33701 inflection decade [1e10,1e11] and its steepest-ramp STEP k = 9
 *       (the [1e9,1e10] -> [1e10,1e11] transition, imp-33701 argmax of the velocity D1).
 *   (c) Compare log10(N_flat) against those decades; report coincide vs distinct.
 *
 * THE FINDING (cross-validation / measurement only)
 * -------------------------------------------------
 *   (F1) THE TWO KNEES DO NOT COINCIDE -- THEY ARE OFF BY ROUGHLY ONE DECADE. The
 *        imp-35853 flattest point (sigma ~ 0.407) maps to N_flat ~ 7.20e9
 *        (log10 N ~ 9.86, decade [1e9,1e10]), whereas the imp-33701 exponent-ramp
 *        inflection lands in the [1e10,1e11] decade. N_flat sits ONE decade BELOW the
 *        inflection decade, so the two "knee" labels are DISTINCT features of the
 *        downslope, not one height under two names.
 *   (F2) BUT THEY ARE ADJACENT, PINNED TO THE SAME TWO-DECADE [1e9,1e11] WINDOW. N_flat
 *        ~ 7.20e9 sits at the TOP edge of [1e9,1e10], i.e. exactly at the lower boundary
 *        of imp-33701 steepest-ramp STEP k = 9 (the [1e9,1e10] -> [1e10,1e11] transition,
 *        imp-33701 argmax D1 ~ 0.12). So the required-height-multiple stops changing
 *        fastest (flattest in sigma) just as the sigma decay-exponent ramp is climbing
 *        fastest -- the two markers bracket the same [1e9,1e11] downslope region from
 *        adjacent decades rather than agreeing on a point.
 *   (F3) THE DISAGREEMENT IS EXPECTED, NOT A DEFECT: the two knees measure DIFFERENT
 *        curves (flatness of the required-height multiple vs sigma; inflection of the
 *        decay exponent vs N), so a ~1-decade offset is the honest reading, consistent
 *        with imp-35943 that the imp-35853 markers are locator-dependent.
 *
 * Cross-validation / measurement only. Reuses both existing models on the shared
 * imp-3220 / imp-3406 surrogate; instantiates no interval; derives no remainder;
 * discharges nothing; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35853-req4-required-height-continuous-sigma-knee (flattest-point locator, sigma ~ 0.407)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (exponent-ramp inflection, [1e10,1e11])
 * @see imp-35889-e-share-decomposition-at-knees (independent flattest-point height N ~ 7.20e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma-decay model)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from './imp-33701-sigma-postpeak-ramp-curvature-inflection.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (no re-derivation, no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// Interior peak (reproduces imp-33582 / imp-35813 N ~ 9.22e5, sigma_max ~ 0.9494).
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();
const SIGMA_MAX = sigma(N_PEAK);

// Downslope N (N > N_peak) at which sigma first drops below thr (bisection).
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (a) Map the imp-35853 flattest-point sigma to its downslope N.
const SIGMA_FLAT = IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.flattestPoint.sigma; // ~0.407
const N_FLAT = crossBelow(SIGMA_FLAT);
const LOG10_N_FLAT = Math.log10(N_FLAT);
const DECADE_N_FLAT = Math.floor(LOG10_N_FLAT); // 9 -> [1e9,1e10]

// (b) The imp-33701 inflection decade and its steepest-ramp step, read from the source object.
const INFLECTION_DECADE = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.inflectionDecade; // "1e10->1e11"
const INFLECTION_LO_K = parseInt(INFLECTION_DECADE.match(/1e(\d+)/)[1], 10); // 10
const STEEPEST_STEP_DECADE = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.steepestStepDecade;

// (c) Coincidence test: does N_flat fall inside the [1e10,1e11] inflection decade?
const N_FLAT_IN_INFLECTION_DECADE =
  LOG10_N_FLAT >= INFLECTION_LO_K && LOG10_N_FLAT < INFLECTION_LO_K + 1;
// Offset in decades between the flattest-point decade and the inflection decade.
const DECADE_OFFSET = INFLECTION_LO_K - DECADE_N_FLAT; // 1
// N_flat sits at the lower boundary of the imp-33701 steepest-ramp STEP k=9 ([1e9,1e10]->[1e10,1e11]).
const N_FLAT_AT_STEEPEST_STEP_LOWER_EDGE = DECADE_N_FLAT === 9;

export const IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION = {
  id: 'imp-35891',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35853 REQ-4 required-height-multiple flattest point (sigma ~ 0.407, mid-downslope minimum ' +
    'of |d multiple / d sigma|) coincide in N with the imp-33701 sigmoid decay-rate knee (the single ' +
    'second-difference inflection of the per-decade local decay exponent, placed in the [1e10,1e11] decade)?',
  method:
    'Replicate the exact imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll)), map the ' +
    'imp-35853 flattest-point sigma (~0.407) to its downslope N by bisection on the shared imp-3220 / imp-3406 ' +
    'RvM surrogate, and compare log10(N_flat) against the imp-33701 inflection decade [1e10,1e11] and its ' +
    'steepest-ramp step k=9 ([1e9,1e10] -> [1e10,1e11]).',
  sigmaMax: +SIGMA_MAX.toFixed(6),
  flattestPointSigma: SIGMA_FLAT,
  flattestPointN: +N_FLAT.toExponential(4),
  flattestPointLog10N: +LOG10_N_FLAT.toFixed(4),
  flattestPointDecade: `1e${DECADE_N_FLAT}->1e${DECADE_N_FLAT + 1}`,
  imp33701InflectionDecade: INFLECTION_DECADE,
  imp33701SteepestStepDecade: STEEPEST_STEP_DECADE,
  coincide: N_FLAT_IN_INFLECTION_DECADE,
  decadeOffset: DECADE_OFFSET,
  flattestPointAtSteepestStepLowerEdge: N_FLAT_AT_STEEPEST_STEP_LOWER_EDGE,
  finding: {
    F1_do_not_coincide_off_by_one_decade:
      'The imp-35853 flattest point (sigma ~ 0.407) maps to N_flat ~ 7.20e9 (log10 N ~ 9.86, decade ' +
      '[1e9,1e10]), whereas the imp-33701 exponent-ramp inflection lands in [1e10,1e11]. N_flat sits ONE ' +
      'decade BELOW the inflection decade, so the two knee labels are DISTINCT features, not one height.',
    F2_adjacent_same_two_decade_window:
      'N_flat ~ 7.20e9 sits at the TOP edge of [1e9,1e10], exactly the lower boundary of the imp-33701 ' +
      'steepest-ramp STEP k=9 (the [1e9,1e10] -> [1e10,1e11] transition, argmax D1 ~ 0.12). The required-height ' +
      'multiple is flattest in sigma just as the decay-exponent ramp climbs fastest; the two markers bracket the ' +
      'same [1e9,1e11] downslope region from adjacent decades rather than agreeing on a point.',
    F3_disagreement_expected_different_curves:
      'The two knees measure DIFFERENT curves (flatness of the required-height multiple vs sigma; inflection of ' +
      'the decay exponent vs N), so the ~1-decade offset is the honest reading, consistent with imp-35943 that ' +
      'the imp-35853 markers are locator-dependent.',
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'CROSS-VALIDATION (NOT rigorous). Mapping the imp-35853 required-height-multiple flattest point ' +
    '(sigma ~ 0.407) to the shared surrogate gives N_flat ~ 7.20e9 (log10 N ~ 9.86, decade [1e9,1e10]), ' +
    'reproducing the independent imp-35889 flattest-point height. The imp-33701 sigmoid decay-exponent ' +
    'inflection lands one decade higher, in [1e10,1e11]. So the two "knee" characterizations DO NOT coincide -- ' +
    'they are DISTINCT features off by roughly one decade in N -- but they are ADJACENT: N_flat sits at the top ' +
    'edge of [1e9,1e10], exactly the lower boundary of the imp-33701 steepest-ramp step k=9 ([1e9,1e10] -> ' +
    '[1e10,1e11]), so both markers pin the same two-decade [1e9,1e11] downslope window. The disagreement is ' +
    'expected: the flattest point measures the rate of the required-height multiple in sigma, while the ' +
    'inflection measures the curvature of the sigma decay exponent in N -- different curves, so a ~1-decade ' +
    'offset is the honest reading (consistent with imp-35943 locator-dependence). Reuses both existing models on ' +
    'the same imp-3220 / imp-3406 surrogate; instantiates no interval; derives no remainder; discharges nothing; ' +
    'changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35853 (flattest-point locator, sigma ~ 0.407); imp-33701 (exponent-ramp inflection, [1e10,1e11]); ' +
    'imp-35889 (independent flattest-point height N ~ 7.20e9); imp-33582 (sigma-decay model; peak sigma_max ' +
    '~ 0.9494); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat); imp-35943 (locator-dependence). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION_ASSERTIONS = [
  {
    // (1) reproduces the imp-33582 / imp-35813 interior peak (identical sub-terms in use).
    id: 'imp35891-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5, sigma_max ~ 0.9494 -- confirms the identical imp-33582 sigma model is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3 && Math.abs(SIGMA_MAX - 0.9494) < 5e-4,
  },
  {
    // (2) reuse gate: N_flat reproduces the independent imp-35889 flattest-point height N ~ 7.20e9.
    id: 'imp35891-flattest-N-reproduces-imp35889',
    description: 'flattest-point N ~ 7.20e9 (log10 N ~ 9.86), matching the independent imp-35889 height',
    holds: () =>
      Math.abs(N_FLAT / 7.20e9 - 1) < 5e-2 &&
      Math.abs(LOG10_N_FLAT - 9.857) < 0.05 &&
      DECADE_N_FLAT === 9,
  },
  {
    // (3) the imp-33701 inflection decade read from the source object is [1e10,1e11].
    id: 'imp35891-imp33701-inflection-decade-1e10',
    description: 'the imp-33701 source inflection decade is [1e10,1e11] (INFLECTION_LO_K = 10)',
    holds: () => INFLECTION_LO_K === 10 && INFLECTION_DECADE === '1e10->1e11',
  },
  {
    // (4) THE FINDING: the two knees do NOT coincide -- off by exactly one decade, N_flat below the inflection.
    id: 'imp35891-knees-do-not-coincide-one-decade-offset',
    description: 'N_flat is NOT in the [1e10,1e11] inflection decade; the offset is exactly one decade (N_flat below)',
    holds: () =>
      N_FLAT_IN_INFLECTION_DECADE === false &&
      DECADE_OFFSET === 1 &&
      IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION.coincide === false,
  },
  {
    // (5) but they are ADJACENT: N_flat sits at the lower edge of the imp-33701 steepest-ramp step k=9.
    id: 'imp35891-adjacent-at-steepest-step-lower-edge',
    description: 'N_flat is at the top of [1e9,1e10] = the lower boundary of the imp-33701 steepest step k=9',
    holds: () =>
      N_FLAT_AT_STEEPEST_STEP_LOWER_EDGE === true &&
      LOG10_N_FLAT > 9.5 && LOG10_N_FLAT < 10.0,
  },
  {
    // (6) honesty gate: cross-validation only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35891-crossvalidation-only-no-qed',
    description: 'cross-validation only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35891-flattest-point-vs-sigmoid-knee-crosslocation assertion failed: ${a.id}`);
  }
}
