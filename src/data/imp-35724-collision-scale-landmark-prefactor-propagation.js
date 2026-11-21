/**
 * @module imp-35724-collision-scale-landmark-prefactor-propagation
 *
 * imp-35724 (numerical, measurement): imp-35696 showed that reading C_C =
 * (1/8) sqrt(3 pi) versus the standard curvature pi^2/3 as the GUE small-gap
 * density coefficient c in p(s) ~ c s^2 shifts only the collision-scale
 * PREFACTOR (3/c)^{1/3} -- the two readings ratio to
 * prefCC/prefStd = ((pi^2/3)/C_C)^{1/3} ~ 2.047 -- while the M-exponent stays
 * fixed at -1/3 (coefficient-free, set by the cubic beta = 2 repulsion power).
 * imp-35720 confirmed that prefactor is FLAT across an abstract gap-count
 * ladder M in {10 .. 1e8}. What was never done: PROPAGATE that cube-root
 * prefactor onto the ACTUAL imp-35337 sigma-landmark heights the collision
 * frontier lives at -- N_peak ~ 9.22e5 (interior flat-cap sigma peak) and
 * N_cross ~ 3.28e9 (E_coll = E_trunc crossover, imp-35304). This module does
 * that.
 *
 * THE MEASUREMENT. At each landmark we map N -> M via the Riemann-von Mangoldt
 * surrogate used throughout the imp-35652 collision assessment: the gap count
 * over the local unfolded window equals the zero count, M = N (mean spacing =
 * 1). We then recompute the smallest-of-M-consecutive-gaps collision scale
 * s_min(M; c) by BISECTION on the extreme-value balance M F(s_min) = 1 with
 * F(s) = c s^3 / 3 (NOT the closed form), separately for the standard
 * coefficient c = pi^2/3 and for c = C_C. At each landmark we report:
 *   (i) the O(1) shift  s_min(N; C_C) / s_min(N; pi^2/3), and
 *   (ii) that the shift equals the M-independent prefactor ratio
 *        ((pi^2/3)/C_C)^{1/3} ~ 2.047 -- identical at both landmarks;
 * and across the two landmarks we read the log-log slope of s_min(N; c) against
 * N, confirming it is -1/3 for BOTH coefficients (the exponent is untouched).
 *
 * WHAT COMES OUT.
 *   peak  (N ~ 9.22e5): s_min(std) ~ 9.97e-3,  s_min(C_C) ~ 2.04e-2,  ratio ~ 2.0467
 *   cross (N ~ 3.28e9): s_min(std) ~ 6.53e-4,  s_min(C_C) ~ 1.34e-3,  ratio ~ 2.0467
 * The O(1) shift is IDENTICAL at both landmarks (a pure amplitude -- N cancels
 * in the ratio), equal to ((pi^2/3)/C_C)^{1/3}, i.e. the cube root of the
 * imp-35680/imp-35696 amplitude mismatch (pi^2/3)/C_C ~ 8.573. The two-landmark
 * log-log slope of s_min against N is -1/3 for BOTH readings, reproducing the
 * Ben Arous-Bourgade s_min ~ M^{-1/3} exponent: reading C_C in place of pi^2/3
 * moves the collision scale up by a fixed factor ~2.047 at every height but
 * leaves the -1/3 exponent completely untouched.
 *
 * The std-reading s_min values here are the imp-35652 resolutionScaleTable
 * sMinMeanSpacingUnits (which used the bare N^{-1/3}, prefactor 1) multiplied by
 * prefStd = (3/(pi^2/3))^{1/3} ~ 0.9697 -- cross-checked row-for-row below.
 *
 * Measurement only; propagates the imp-35696 prefactor onto the named landmark
 * heights; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/
 * imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional
 * (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35696-collision-exponent-consistency-check (cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3)
 * @see imp-35720-prefactor-M-independence-ladder (prefactor flat across an abstract M-ladder)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (landmark heights + bare N^{-1/3} sMinMeanSpacingUnits)
 * @see imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation (N_cross crossover anchor)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK } from './imp-35696-collision-exponent-consistency-check.js';
import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient p(s) ~ (pi^2/3) s^2 (cubic beta = 2).
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

// The two imp-35337 sigma-landmark heights (taken as given, same as imp-35652).
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER (imp-35304)

// RvM surrogate: gap count over the local unfolded window = zero count, M = N.
const mapNtoM = (N) => N;

// Cumulative of the model small-gap density p(s) = c s^2: F(s) = c s^3 / 3.
const cumulative = (s, c) => (c * s * s * s) / 3;

// Smallest of M consecutive gaps under p(s) = c s^2, solved by BISECTION on the
// extreme-value balance M F(s_min) = 1 (NOT the closed form), so s_min is a
// genuinely measured quantity at each landmark.
function sMinNumeric(M, c) {
  let lo = 0;
  let hi = 1;
  while (M * cumulative(hi, c) < 1) hi *= 2; // bracket the root
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (M * cumulative(mid, c) < 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Per-landmark propagation: s_min under both coefficient readings + the O(1) shift.
function landmark(N) {
  const M = mapNtoM(N);
  const sMinStd = sMinNumeric(M, C_STD);
  const sMinCC = sMinNumeric(M, C_C);
  return { N, M, sMinStd, sMinCC, oShift: sMinCC / sMinStd };
}

const PEAK = landmark(N_PEAK);
const CROSS = landmark(N_CROSS);

// The M-independent prefactor ratio the shift should equal (imp-35696).
const PREF_RATIO = Math.cbrt(C_STD / C_C); // ~ 2.0467 = ((pi^2/3)/C_C)^{1/3}

// Two-landmark log-log slope of s_min against N, per coefficient (should be -1/3).
const slope = (sHi, sLo) =>
  Math.log10(sHi / sLo) / Math.log10(CROSS.N / PEAK.N);
const SLOPE_STD = slope(CROSS.sMinStd, PEAK.sMinStd); // ~ -1/3
const SLOPE_CC = slope(CROSS.sMinCC, PEAK.sMinCC); // ~ -1/3

export const IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION = {
  id: 'imp-35724',
  proofSection: 'S-frontier',
  question:
    'How does the imp-35696 cube-root collision-scale prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047 propagate onto the ' +
    'actual imp-35337 sigma-landmark heights N_peak ~ 9.22e5 and N_cross ~ 3.28e9? Mapping N -> M by the RvM ' +
    'surrogate and recomputing s_min(M; c) by bisection for c in {pi^2/3, C_C}, what is the O(1) shift at each ' +
    'landmark, and is the -1/3 exponent untouched?',
  method:
    'RvM surrogate: gap count over the local unfolded window = zero count, M = N. At each landmark solve the ' +
    'extreme-value balance M F(s_min) = 1 (F(s) = c s^3 / 3) by BISECTION for c = pi^2/3 and c = C_C, form the ' +
    'O(1) shift s_min(N; C_C) / s_min(N; pi^2/3), and read the two-landmark log-log slope of s_min against N for ' +
    'each coefficient.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
    cStd: +C_STD.toPrecision(8), // 3.2898681 (pi^2/3)
    prefactorRatioCCtoStd: +PREF_RATIO.toPrecision(8), // 2.0466534 = ((pi^2/3)/C_C)^{1/3}
    peak: {
      N: N_PEAK,
      M: PEAK.M, // = N (RvM surrogate)
      sMinStd: +PEAK.sMinStd.toExponential(4), // ~9.967e-3
      sMinCC: +PEAK.sMinCC.toExponential(4), // ~2.040e-2
      oShiftCCoverStd: +PEAK.oShift.toPrecision(8), // ~2.0466534
    },
    cross: {
      N: N_CROSS,
      M: CROSS.M, // = N (RvM surrogate)
      sMinStd: +CROSS.sMinStd.toExponential(4), // ~6.527e-4
      sMinCC: +CROSS.sMinCC.toExponential(4), // ~1.336e-3
      oShiftCCoverStd: +CROSS.oShift.toPrecision(8), // ~2.0466534
    },
    slopeStd: +SLOPE_STD.toPrecision(8), // ~ -0.33333
    slopeCC: +SLOPE_CC.toPrecision(8), // ~ -0.33333
  },
  findings:
    'At BOTH landmarks the O(1) shift from reading C_C in place of pi^2/3 is IDENTICAL, ~2.0467 = ' +
    '((pi^2/3)/C_C)^{1/3} -- a pure amplitude in which N cancels, equal to the cube root of the imp-35680/' +
    'imp-35696 amplitude mismatch (pi^2/3)/C_C ~ 8.573. Concretely s_min moves from ~9.97e-3 to ~2.04e-2 at the ' +
    'peak (N ~ 9.22e5) and from ~6.53e-4 to ~1.34e-3 at the crossover (N ~ 3.28e9). The two-landmark log-log ' +
    'slope of s_min against N is -1/3 for BOTH coefficient readings, reproducing the Ben Arous-Bourgade ' +
    's_min ~ M^{-1/3} exponent: the coefficient shift lifts the collision scale by a fixed factor ~2.047 at every ' +
    'height but leaves the -1/3 exponent completely untouched.',
  oShiftIdenticalAcrossLandmarks: true,
  exponentUntouched: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Propagating the imp-35696 cube-root prefactor onto the imp-35337 sigma-landmark ' +
    'heights via the RvM surrogate (M = N) and recomputing s_min(M; c) by bisection: at N_peak ~ 9.22e5 the ' +
    'collision scale moves from ~9.97e-3 (c = pi^2/3) to ~2.04e-2 (c = C_C), and at N_cross ~ 3.28e9 from ' +
    '~6.53e-4 to ~1.34e-3 -- an O(1) shift of ~2.0467 = ((pi^2/3)/C_C)^{1/3} that is IDENTICAL at both landmarks ' +
    '(N cancels; it is the cube root of the imp-35680 amplitude mismatch ~8.573). The two-landmark log-log slope ' +
    'is -1/3 for BOTH readings, so the exponent -1/3 is untouched. Measurement only; propagates the imp-35696 ' +
    'prefactor onto the named heights; derives no remainder; discharges nothing; changes no bound; establishes no ' +
    'operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and ' +
    'C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35696 (cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3); imp-35720 (prefactor flat on an ' +
    'abstract M-ladder); imp-35652 (landmark heights + bare N^{-1/3} sMinMeanSpacingUnits); imp-35680 (amplitude ' +
    'mismatch (pi^2/3)/C_C ~ 8.573); imp-35304 (N_cross crossover anchor); imp-2642/imp-2643 (C_C = (1/8) ' +
    'sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}). ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION_ASSERTIONS = [
  {
    // (1) the O(1) shift at each landmark equals the M-independent prefactor ratio ((pi^2/3)/C_C)^{1/3},
    //     and it is IDENTICAL across the two landmarks (N cancels in the ratio -- a pure amplitude).
    id: 'imp35724-oshift-equals-prefactor-and-identical',
    description: 'the C_C/std O(1) shift at both landmarks equals ((pi^2/3)/C_C)^{1/3} ~ 2.047 and is identical at peak and crossover',
    holds: () =>
      Math.abs(PEAK.oShift - PREF_RATIO) < 1e-9 &&
      Math.abs(CROSS.oShift - PREF_RATIO) < 1e-9 &&
      Math.abs(PEAK.oShift - CROSS.oShift) < 1e-9 &&
      PREF_RATIO > 2.04 && PREF_RATIO < 2.05,
  },
  {
    // (2) the prefactor ratio is the cube root of the imp-35680/imp-35696 amplitude mismatch (~8.573).
    id: 'imp35724-shift-is-cube-root-of-amplitude-mismatch',
    description: 'the O(1) shift equals the cube root of the imp-35696 amplitude mismatch amplitudeRatioStdToCC ~ 8.573',
    holds: () => {
      const amp = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.amplitudeRatioStdToCC;
      return (
        Math.abs(PREF_RATIO - Math.cbrt(amp)) < 1e-6 &&
        Math.abs(PREF_RATIO - IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.prefactorRatioCCtoStd) < 1e-6
      );
    },
  },
  {
    // (3) the -1/3 exponent is untouched: the two-landmark log-log slope of s_min vs N is -1/3 for BOTH readings.
    id: 'imp35724-exponent-minus-one-third-both-readings',
    description: 'the two-landmark log-log slope of s_min against N is -1/3 for both c = pi^2/3 and c = C_C (exponent untouched)',
    holds: () =>
      Math.abs(SLOPE_STD - (-1 / 3)) < 5e-4 &&
      Math.abs(SLOPE_CC - (-1 / 3)) < 5e-4 &&
      Math.abs(SLOPE_STD - SLOPE_CC) < 1e-9, // same exponent for both readings
  },
  {
    // (4) cross-check the std-reading s_min against the imp-35652 bare-N^{-1/3} sMinMeanSpacingUnits:
    //     s_min(std) = prefStd * N^{-1/3}, so s_min(std)/prefStd must reproduce the imp-35652 baked value.
    id: 'imp35724-std-crosschecks-imp35652-table',
    description: 'the std-reading s_min divided by prefStd reproduces the imp-35652 resolutionScaleTable sMinMeanSpacingUnits (bare N^{-1/3}) at both landmarks',
    holds: () => {
      const t = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.resolutionScaleTable;
      const prefStd = Math.cbrt(3 / C_STD); // ~0.96972
      return (
        Math.abs(PEAK.sMinStd / prefStd - t.peak.sMinMeanSpacingUnits) < 5e-6 &&
        Math.abs(CROSS.sMinStd / prefStd - t.cross.sMinMeanSpacingUnits) < 5e-7
      );
    },
  },
  {
    // (5) C_C anchor reproduces (1/8) sqrt(3 pi) and matches the imp-35696 / imp-35652 baked values.
    id: 'imp35724-cc-matches-parents',
    description: 'the C_C anchor reproduces (1/8) sqrt(3 pi) and matches the imp-35696 and imp-35652 baked values',
    holds: () =>
      Math.abs(C_C - 0.38374752) < 1e-6 &&
      Math.abs(C_C - IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.C_C) < 1e-6 &&
      Math.abs(C_C - IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.C_C) < 1e-6,
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35724-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.exponentUntouched === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35724-collision-scale-landmark-prefactor-propagation assertion failed: ${a.id}`);
  }
}
