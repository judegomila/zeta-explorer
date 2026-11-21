/**
 * @module imp-35764-collision-scale-pt-anchor-prefactor-propagation
 *
 * imp-35764 (numerical, measurement): imp-35724 propagated the imp-35696
 * cube-root collision-scale prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047 onto TWO of
 * the imp-35337 sigma-landmark heights -- the interior flat-cap sigma PEAK
 * (N ~ 9.22e5) and the E_coll = E_trunc CROSSOVER (N ~ 3.28e9, imp-35304) --
 * but it stopped there. The barrier does NOT live at either of those heights;
 * it lives at the Platt-Trudgian anchor T_PT = 3e12, whose zero count
 * N(T_PT) ~ 1.236e13 is ~3.8 decades (~3.6 in log10) ABOVE the crossover. This
 * module carries the propagation onto that actual verified-barrier height.
 *
 * THE MEASUREMENT. We map the PT-anchor HEIGHT T_PT = 3e12 to its zero count
 * N(T_PT) via the exact Riemann-von Mangoldt forward count zeroCountAtHeight
 * (the same lambda-rh-height-mapping counter used throughout the height ladder;
 * leading term (T/2pi)(log(T/2pi) - 1)), giving N(T_PT) ~ 1.23624e13. We then
 * apply the identical imp-35724 RvM surrogate (gap count over the local
 * unfolded window = zero count, M = N) and recompute the smallest-of-M-gaps
 * collision scale s_min(M; c) by BISECTION on the extreme-value balance
 * M F(s_min) = 1 with F(s) = c s^3 / 3 (NOT the closed form), separately for
 * the standard coefficient c = pi^2/3 and for c = C_C = (1/8) sqrt(3 pi). We
 * report:
 *   (i)  the O(1) shift  s_min(N_PT; C_C) / s_min(N_PT; pi^2/3), and
 *   (ii) that it equals the M-independent prefactor ratio ((pi^2/3)/C_C)^{1/3}
 *        ~ 2.0467 -- IDENTICAL to the value imp-35724 read at the peak and the
 *        crossover (N cancels; it is a pure amplitude);
 * and across cross -> PT (and peak -> PT) we read the log-log slope of s_min
 * against N, confirming it is -1/3 for BOTH coefficients (exponent untouched).
 *
 * WHAT COMES OUT.
 *   PT anchor (N ~ 1.236e13): s_min(std) ~ 4.194e-5,  s_min(C_C) ~ 8.583e-5,
 *                             ratio ~ 2.0467
 * The O(1) shift is IDENTICAL to imp-35724's peak/crossover value (~2.0467 =
 * ((pi^2/3)/C_C)^{1/3}, the cube root of the imp-35680/imp-35696 amplitude
 * mismatch (pi^2/3)/C_C ~ 8.573). The cross -> PT log-log slope of s_min against
 * N is -1/3 for BOTH readings, so extending the ladder ~3.8 decades up to the
 * height the barrier actually lives at changes NOTHING about the collision-scale
 * scaling law: the coefficient shift lifts s_min by the same fixed factor
 * ~2.047 and the -1/3 exponent is preserved.
 *
 * The std-reading s_min here is the bare N^{-1/3} extreme-value scale multiplied
 * by prefStd = (3/(pi^2/3))^{1/3} ~ 0.9697 -- cross-checked below at N_PT.
 *
 * Measurement only; propagates the imp-35696 prefactor onto the PT-anchor
 * height; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/
 * imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional
 * (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35724-collision-scale-landmark-prefactor-propagation (peak + crossover landmarks; this module adds the PT anchor)
 * @see imp-35696-collision-exponent-consistency-check (cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3)
 * @see lambda-rh-height-mapping (zeroCountAtHeight exact RvM forward count)
 * @see imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation (N_cross crossover anchor)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}); Riemann-von Mangoldt counting formula.
 * Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION } from './imp-35724-collision-scale-landmark-prefactor-propagation.js';
import { IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION } from './imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation.js';
import { zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient p(s) ~ (pi^2/3) s^2 (cubic beta = 2).
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

// The two imp-35724 sigma-landmark heights (peak + crossover), carried forward.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER (imp-35304)
// The verified-barrier anchor HEIGHT (Platt-Trudgian) mapped to its zero count
// by the exact Riemann-von Mangoldt forward count -- the height the barrier
// actually lives at, ~3.8 decades above the crossover.
const T_PT = 3e12;
const N_PT = zeroCountAtHeight(T_PT); // ~ 1.23624e13

// RvM surrogate: gap count over the local unfolded window = zero count, M = N.
const mapNtoM = (N) => N;

// Cumulative of the model small-gap density p(s) = c s^2: F(s) = c s^3 / 3.
const cumulative = (s, c) => (c * s * s * s) / 3;

// Smallest of M consecutive gaps under p(s) = c s^2, solved by BISECTION on the
// extreme-value balance M F(s_min) = 1 (NOT the closed form), so s_min is a
// genuinely measured quantity at each landmark (identical to imp-35724).
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

const PT = landmark(N_PT);
// Recompute peak + crossover here too, so the slope is self-contained and we can
// tie back to imp-35724's baked values.
const PEAK = landmark(N_PEAK);
const CROSS = landmark(N_CROSS);

// The M-independent prefactor ratio the shift should equal (imp-35696).
const PREF_RATIO = Math.cbrt(C_STD / C_C); // ~ 2.0467 = ((pi^2/3)/C_C)^{1/3}

// Log-log slope of s_min against N (should be -1/3), measured cross -> PT
// (the new ~3.6-in-log10 span) and peak -> PT (the full span), per coefficient.
const slope = (sHi, sLo, nHi, nLo) =>
  Math.log10(sHi / sLo) / Math.log10(nHi / nLo);
const SLOPE_STD_CROSS_TO_PT = slope(PT.sMinStd, CROSS.sMinStd, PT.N, CROSS.N); // ~ -1/3
const SLOPE_CC_CROSS_TO_PT = slope(PT.sMinCC, CROSS.sMinCC, PT.N, CROSS.N); // ~ -1/3
const SLOPE_STD_PEAK_TO_PT = slope(PT.sMinStd, PEAK.sMinStd, PT.N, PEAK.N); // ~ -1/3

export const IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION = {
  id: 'imp-35764',
  proofSection: 'S-frontier',
  question:
    'imp-35724 propagated the imp-35696 cube-root collision-scale prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047 onto the ' +
    'peak (N ~ 9.22e5) and crossover (N ~ 3.28e9) heights, but the barrier lives at the Platt-Trudgian anchor ' +
    'T_PT = 3e12 (N ~ 1.236e13), ~3.8 decades higher. Mapping T_PT to N by the exact RvM forward count and ' +
    'recomputing s_min(M; c) by bisection for c in {pi^2/3, C_C}, does the O(1) shift stay ~2.0467 and is the ' +
    '-1/3 exponent untouched at the actual verified-barrier height?',
  method:
    'Map T_PT = 3e12 to N(T_PT) ~ 1.236e13 by the exact Riemann-von Mangoldt forward count zeroCountAtHeight, ' +
    'then apply the identical imp-35724 RvM surrogate M = N and solve the extreme-value balance M F(s_min) = 1 ' +
    '(F(s) = c s^3 / 3) by BISECTION for c = pi^2/3 and c = C_C. Form the O(1) shift s_min(N_PT; C_C) / ' +
    's_min(N_PT; pi^2/3) and read the log-log slope of s_min against N over cross -> PT and peak -> PT.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
    cStd: +C_STD.toPrecision(8), // 3.2898681 (pi^2/3)
    prefactorRatioCCtoStd: +PREF_RATIO.toPrecision(8), // 2.0466534 = ((pi^2/3)/C_C)^{1/3}
    T_PT: T_PT, // 3e12 (Platt-Trudgian barrier height)
    ptAnchor: {
      N: +N_PT.toExponential(6), // ~1.236240e13
      M: PT.M, // = N (RvM surrogate)
      sMinStd: +PT.sMinStd.toExponential(4), // ~4.194e-5
      sMinCC: +PT.sMinCC.toExponential(4), // ~8.583e-5
      oShiftCCoverStd: +PT.oShift.toPrecision(8), // ~2.0466534 (identical to imp-35724)
    },
    slopeStdCrossToPt: +SLOPE_STD_CROSS_TO_PT.toPrecision(8), // ~ -0.33333
    slopeCCCrossToPt: +SLOPE_CC_CROSS_TO_PT.toPrecision(8), // ~ -0.33333
    slopeStdPeakToPt: +SLOPE_STD_PEAK_TO_PT.toPrecision(8), // ~ -0.33333
    decadesAboveCross: +Math.log10(N_PT / N_CROSS).toPrecision(4), // ~3.575
  },
  findings:
    'At the Platt-Trudgian anchor N(T_PT = 3e12) ~ 1.236e13 -- ~3.8 decades (~3.6 in log10) above the imp-35724 ' +
    'crossover -- the O(1) shift from reading C_C in place of pi^2/3 is ~2.0467 = ((pi^2/3)/C_C)^{1/3}, IDENTICAL ' +
    'to the value imp-35724 read at the peak and the crossover (N cancels; it is the cube root of the ' +
    'imp-35680/imp-35696 amplitude mismatch (pi^2/3)/C_C ~ 8.573). Concretely s_min moves from ~4.194e-5 ' +
    '(c = pi^2/3) to ~8.583e-5 (c = C_C). The cross -> PT and peak -> PT log-log slopes of s_min against N are ' +
    '-1/3 for BOTH coefficient readings, so extending the propagation to the height the barrier actually lives at ' +
    'leaves the amplitude-only ~2.047 ratio and the -1/3 exponent completely untouched.',
  oShiftMatchesImp35724: true,
  exponentUntouched: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Carrying the imp-35724 propagation onto the Platt-Trudgian verified-barrier ' +
    'height: mapping T_PT = 3e12 to its RvM zero count N(T_PT) ~ 1.236e13 and recomputing s_min(M; c) by ' +
    'bisection, the collision scale moves from ~4.194e-5 (c = pi^2/3) to ~8.583e-5 (c = C_C) -- an O(1) shift of ' +
    '~2.0467 = ((pi^2/3)/C_C)^{1/3} IDENTICAL to imp-35724 peak/crossover (N cancels; the cube root of the ' +
    'imp-35680 amplitude mismatch ~8.573). The cross -> PT and peak -> PT log-log slopes are -1/3 for BOTH ' +
    'readings, so the -1/3 exponent and the amplitude-only ratio persist ~3.8 decades up at the actual barrier ' +
    'height. Measurement only; propagates the imp-35696 prefactor onto the PT anchor; derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35724 (peak + crossover landmark propagation; this module adds the PT anchor); imp-35696 (cube-root ' +
    'prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047, exponent -1/3); imp-35680 (amplitude mismatch (pi^2/3)/C_C ~ ' +
    '8.573); imp-35304 (N_cross crossover anchor); lambda-rh-height-mapping (zeroCountAtHeight exact RvM forward ' +
    'count); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013, ' +
    'smallest GUE gaps ~ n^{-4/3}); Riemann-von Mangoldt counting formula. Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION_ASSERTIONS = [
  {
    // (1) the PT-anchor height is the exact RvM forward count of T_PT = 3e12, ~3.8 decades above N_cross.
    id: 'imp35764-pt-anchor-is-rvm-count-of-3e12',
    description: 'N(T_PT) is zeroCountAtHeight(3e12) ~ 1.236e13, ~3.5-3.6 decades (log10) above the imp-35724 crossover N ~ 3.28e9',
    holds: () =>
      Math.abs(N_PT - zeroCountAtHeight(3e12)) < 1e-6 &&
      N_PT > 1.2e13 && N_PT < 1.3e13 &&
      Math.log10(N_PT / N_CROSS) > 3.4 && Math.log10(N_PT / N_CROSS) < 3.7,
  },
  {
    // (2) the O(1) shift at the PT anchor equals the M-independent prefactor ratio ((pi^2/3)/C_C)^{1/3},
    //     IDENTICAL to the value imp-35724 read at the peak and the crossover (N cancels -- a pure amplitude).
    id: 'imp35764-oshift-equals-prefactor-and-matches-imp35724',
    description: 'the C_C/std O(1) shift at the PT anchor equals ((pi^2/3)/C_C)^{1/3} ~ 2.047 and matches the imp-35724 peak/crossover shift',
    holds: () => {
      const p = IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION.measurement;
      return (
        Math.abs(PT.oShift - PREF_RATIO) < 1e-9 &&
        Math.abs(PT.oShift - p.peak.oShiftCCoverStd) < 1e-6 &&
        Math.abs(PT.oShift - p.cross.oShiftCCoverStd) < 1e-6 &&
        PREF_RATIO > 2.04 && PREF_RATIO < 2.05
      );
    },
  },
  {
    // (3) the -1/3 exponent is untouched: the cross -> PT and peak -> PT log-log slopes are -1/3 for BOTH readings.
    id: 'imp35764-exponent-minus-one-third-both-readings',
    description: 'the cross -> PT and peak -> PT log-log slopes of s_min against N are -1/3 for both c = pi^2/3 and c = C_C (exponent untouched)',
    holds: () =>
      Math.abs(SLOPE_STD_CROSS_TO_PT - (-1 / 3)) < 5e-4 &&
      Math.abs(SLOPE_CC_CROSS_TO_PT - (-1 / 3)) < 5e-4 &&
      Math.abs(SLOPE_STD_PEAK_TO_PT - (-1 / 3)) < 5e-4 &&
      Math.abs(SLOPE_STD_CROSS_TO_PT - SLOPE_CC_CROSS_TO_PT) < 1e-9,
  },
  {
    // (4) cross-check the std-reading s_min against the bare N^{-1/3} extreme-value scale:
    //     s_min(std) = prefStd * N^{-1/3}, so s_min(std)/prefStd must reproduce N_PT^{-1/3}.
    id: 'imp35764-std-crosschecks-bare-nthird',
    description: 'the std-reading s_min divided by prefStd = (3/(pi^2/3))^{1/3} reproduces the bare N^{-1/3} extreme-value scale at the PT anchor',
    holds: () => {
      const prefStd = Math.cbrt(3 / C_STD); // ~0.96972
      return Math.abs(PT.sMinStd / prefStd - Math.pow(N_PT, -1 / 3)) < 1e-12;
    },
  },
  {
    // (5) the recomputed peak/crossover ties back to imp-35724 exactly (same helpers, same landmark heights).
    id: 'imp35764-ties-back-to-imp35724-peak-cross',
    description: 'the peak/crossover s_min recomputed here reproduce the imp-35724 baked sMinStd/sMinCC values row-for-row',
    holds: () => {
      const p = IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION.measurement;
      return (
        Math.abs(+PEAK.sMinStd.toExponential(4) - p.peak.sMinStd) < 1e-9 &&
        Math.abs(+PEAK.sMinCC.toExponential(4) - p.peak.sMinCC) < 1e-9 &&
        Math.abs(+CROSS.sMinStd.toExponential(4) - p.cross.sMinStd) < 1e-9 &&
        Math.abs(+CROSS.sMinCC.toExponential(4) - p.cross.sMinCC) < 1e-9
      );
    },
  },
  {
    // (imp-35840) drift/stray-typo guard: the hard-coded N_PEAK/N_CROSS literals here must reproduce
    // the SAME values carried by their own source modules (imp-35724 peak/cross landmarks, imp-35304
    // crossover cross-validation), not just be independently plausible. Traps the drift/stray-typo
    // class flagged in imp-58685 if either literal is ever hand-edited out of sync.
    id: 'imp35840-peak-cross-literals-match-source-modules',
    description: 'N_PEAK/N_CROSS reproduce the imp-35724 peak/cross landmark values and the imp-35304 crossover anchor (imp-58685 drift guard)',
    holds: () => {
      const src724 = IMP35724_COLLISION_SCALE_LANDMARK_PREFACTOR_PROPAGATION.measurement;
      const src304 = IMP35304_ECOLL_EXPONENT_RESIDUAL_CROSSOVER_ANCHOR_CROSSVALIDATION.measurement;
      return (
        N_PEAK === src724.peak.N &&
        N_CROSS === src724.cross.N &&
        Math.abs(N_CROSS - src304.N_cross) / src304.N_cross < 1e-6
      );
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35764-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION;
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

for (const a of IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35764-collision-scale-pt-anchor-prefactor-propagation assertion failed: ${a.id}`);
  }
}
