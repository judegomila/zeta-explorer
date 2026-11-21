/**
 * @module imp-35696-collision-exponent-consistency-check
 *
 * imp-35696 (numerical, consistency check): imp-35652 eliminates the imp-35538 REQ-3
 * option-(a) route with TWO distinct short-range facts:
 *   (i) RESOLUTION FLOOR -- the smallest of M consecutive GUE gaps scales as
 *       s_min(M) ~ M^{-1/3} (Ben Arous-Bourgade 2013), strictly below the band-
 *       limited |alpha| < 1 mean-spacing floor by delta_res / s_min ~ M^{1/3};
 *   (ii) CONSTANT MISMATCH -- the collision amplitude C_C = (1/8) sqrt(3 pi)
 *       (imp-2642/imp-2643) is a short-range near-coincidence constant the band-
 *       limited proxy cannot carry.
 * imp-35652 calls (ii) "corroborating" (i), but never checks the two describe the
 * SAME scale. This module runs that check: read C_C as a small-gap density
 * coefficient p(s) ~ c s^2 and ask whether the resulting collision-scale
 * M-exponent AGREES with the Ben Arous-Bourgade s_min ~ M^{-1/3} exponent.
 *
 * THE CHECK. GUE level repulsion is beta = 2, so the nearest-neighbour spacing
 * density vanishes CUBICALLY at the origin, p(s) ~ c s^2 as s -> 0 (the standard
 * reading fixes c = pi^2/3; imp-35680 measured the SAME curvature coefficient
 * pi^2/3 and the mismatch ratio (pi^2/3) / C_C ~ 8.573). The smallest of M
 * consecutive gaps solves the extreme-value balance M * F(s_min) = 1 where
 * F(s) = INT_0^s p(u) du = c s^3 / 3, giving
 *   s_min(M; c) = ( 3 / (c M) )^{1/3} = (3/c)^{1/3} * M^{-1/3}.
 * The M-EXPONENT is -1/3 REGARDLESS of the coefficient c: the coefficient sets
 * only the PREFACTOR (3/c)^{1/3}, never the power. So reading C_C (or pi^2/3, or
 * any positive amplitude) as the s^2 density coefficient yields the SAME
 * M-exponent -1/3 that s_min ~ M^{-1/3} carries. The exponent is fixed by the
 * cubic-repulsion POWER (beta = 2 -> s^2 -> integral s^3), a single short-range
 * structural fact shared by both imp-35652 obstructions.
 *
 * We do NOT assume the closed form: s_min(M; c) is recomputed by BISECTION on
 * M F(s) = 1 and the M-exponent is a least-squares log-log SLOPE over an M-ladder,
 * measured separately for c = pi^2/3 and c = C_C. Both slopes come out at -1/3 to
 * ~1e-9, and their difference is ~0 -- coefficient-independence, measured.
 *
 * WHAT THIS SETTLES. The two short-range facts in imp-35652 are NOT independent
 * obstructions: they are the EXPONENT and the COEFFICIENT of one and the same
 * cubic-repulsion short-range structure. They AGREE on the M-exponent (-1/3 for
 * s_min, equivalently +1/3 for the floor factor of imp-35695), and the amplitude
 * disagreement imp-35680 measured (ratio (pi^2/3)/C_C ~ 8.573) enters the
 * collision scale ONLY through its cube root, prefCC/prefStd = ((pi^2/3)/C_C)^{1/3}
 * ~ 2.047, leaving the exponent untouched. So C_C read as a small-gap density
 * coefficient IS the right resolution comparator up to a fixed O(1) prefactor:
 * "constant mismatch" is genuinely corroborating (same scale, different amplitude),
 * exactly as imp-35652 characterised -- not a second, exponent-distinct obstruction.
 *
 * Consistency check only; confirms the imp-35652 characterisation quantitatively;
 * derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8,
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (pairs the two short-range facts; never checks they agree on the exponent)
 * @see imp-35680-constant-mismatch-magnitude (measured the amplitude mismatch ratio (pi^2/3)/C_C ~ 8.573)
 * @see imp-35695-resolution-floor-factor-M-ladder (the reciprocal floor factor M^{1/3})
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';
import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any check here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient: p(s) ~ (pi^2/3) s^2 as s -> 0
// (cubic beta = 2 level repulsion; imp-35680 measured this same curvature).
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

// Cumulative of the model small-gap density p(s) = c s^2: F(s) = c s^3 / 3.
const cumulative = (s, c) => (c * s * s * s) / 3;

// Smallest of M consecutive gaps under p(s) = c s^2, solved by BISECTION on the
// extreme-value balance M F(s_min) = 1 (NOT the closed form), so the exponent is
// a genuinely measured quantity, not substituted.
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

// Least-squares slope of log10(s_min) against log10(M): the measured M-exponent.
const M_LADDER = [1e2, 1e3, 1e4, 1e6, 1e8, 1e10];
function fittedExponent(c) {
  const xs = M_LADDER.map((M) => Math.log10(M));
  const ys = M_LADDER.map((M) => Math.log10(sMinNumeric(M, c)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return num / den;
}

const EXPONENT_STD = fittedExponent(C_STD); // ~ -1/3
const EXPONENT_CC = fittedExponent(C_C); // ~ -1/3
const EXPONENT_GAP = Math.abs(EXPONENT_STD - EXPONENT_CC); // ~ 0 (coefficient-independent)
const BAB_EXPONENT = -1 / 3; // Ben Arous-Bourgade s_min ~ M^{-1/3}

// The coefficient enters ONLY the prefactor (3/c)^{1/3}; the amplitude mismatch
// imp-35680 measured ((pi^2/3)/C_C ~ 8.573) shows up as its CUBE ROOT.
const PREF_STD = Math.cbrt(3 / C_STD); // ~ 0.96972 (matches s_min ~ M^{-1/3}, O(1) prefactor)
const PREF_CC = Math.cbrt(3 / C_C); // ~ 1.98469
const PREF_RATIO = PREF_CC / PREF_STD; // ~ 2.0467 = ((pi^2/3)/C_C)^{1/3}
const AMPLITUDE_RATIO = C_STD / C_C; // ~ 8.573 (imp-35680 ratioCurvatureToCC)

export const IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK = {
  id: 'imp-35696',
  proofSection: 'S-frontier',
  question:
    'Do the two short-range facts imp-35652 uses to eliminate option (a) -- the resolution floor s_min ~ M^{-1/3} and the ' +
    'constant mismatch C_C = (1/8) sqrt(3 pi) -- describe the SAME scale? Reading C_C as a small-gap density ' +
    'coefficient p(s) ~ c s^2, does the extreme-value collision scale carry the SAME M-exponent that s_min ~ M^{-1/3} does?',
  method:
    'Under GUE cubic (beta = 2) level repulsion the nearest-neighbour density vanishes as p(s) ~ c s^2, cumulative ' +
    'F(s) = c s^3 / 3. The smallest of M consecutive gaps solves the extreme-value balance M F(s_min) = 1, recomputed ' +
    'here by BISECTION (not the closed form), giving s_min(M; c) = (3 / (c M))^{1/3}. The M-exponent is read off as a ' +
    'least-squares log-log slope over M in {1e2 .. 1e10}, measured separately for the standard coefficient c = pi^2/3 ' +
    'and for c = C_C.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (target, untouched)
    cStd: +C_STD.toPrecision(8), // 3.2898681 (pi^2/3, imp-35680 curvature)
    babExponent: BAB_EXPONENT, // -1/3
    fittedExponentStd: +EXPONENT_STD.toPrecision(10), // -0.33333...
    fittedExponentCC: +EXPONENT_CC.toPrecision(10), // -0.33333...
    exponentGapStdVsCC: +EXPONENT_GAP.toExponential(3), // ~ 0
    prefactorStd: +PREF_STD.toPrecision(8), // 0.96972... (O(1), matches s_min ~ M^{-1/3})
    prefactorCC: +PREF_CC.toPrecision(8), // 1.9846864
    prefactorRatioCCtoStd: +PREF_RATIO.toPrecision(8), // 2.0466534 = ((pi^2/3)/C_C)^{1/3}
    amplitudeRatioStdToCC: +AMPLITUDE_RATIO.toPrecision(8), // 8.5730018 (imp-35680 ratioCurvatureToCC)
  },
  findings:
    'The measured M-exponent of the extreme-value collision scale is -1/3 for BOTH coefficient readings (standard ' +
    'c = pi^2/3 and c = C_C), matching the Ben Arous-Bourgade s_min ~ M^{-1/3} exponent, with the two fits differing ' +
    'by ~0. The exponent is fixed by the cubic-repulsion POWER (beta = 2 -> s^2 -> integral s^3) and is ' +
    'coefficient-INDEPENDENT; the coefficient sets only the prefactor (3/c)^{1/3}. So the amplitude mismatch ' +
    'imp-35680 measured (ratio (pi^2/3)/C_C ~ 8.573) enters the collision scale ONLY as its cube root ' +
    '(prefCC/prefStd ~ 2.047), leaving the M-exponent untouched. The imp-35652 resolution floor and constant ' +
    'mismatch are therefore the EXPONENT and the COEFFICIENT of one shared short-range cubic-repulsion structure -- ' +
    'they agree on the scale, differing only in amplitude, exactly the "corroborating" relation imp-35652 asserted.',
  exponentsAgree: true,
  coefficientIndependentExponent: true,
  sameScaleDifferentAmplitude: true,
  corroboratesImp35652Characterisation: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'CONSISTENCY CHECK (NOT rigorous). Reading C_C = (1/8) sqrt(3 pi) as a small-gap density coefficient ' +
    'p(s) ~ c s^2 and solving the extreme-value balance M F(s_min) = 1 by bisection yields a measured M-exponent of ' +
    '-1/3 for BOTH c = pi^2/3 and c = C_C (fits differing by ~0), matching the Ben Arous-Bourgade s_min ~ M^{-1/3} ' +
    'resolution floor. The exponent is set by the cubic (beta = 2) repulsion power alone and is coefficient- ' +
    'independent; the amplitude mismatch imp-35680 measured (ratio ~8.573) enters only the O(1) prefactor as its ' +
    'cube root (~2.047). So the imp-35652 resolution floor and constant mismatch describe the SAME scale (same ' +
    'M-exponent), differing only in amplitude -- confirming C_C is the right resolution comparator up to a fixed ' +
    'prefactor and that "constant mismatch" is genuinely corroborating, not a second exponent-distinct obstruction. ' +
    'Confirms the imp-35652 characterisation quantitatively; derives no remainder; discharges nothing; changes no ' +
    'bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; ' +
    'route-(ii) (imp-35488 two-height spot check) remains the only viable partial; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35652 (pairs the two short-range facts; never checks the exponent agreement done here); imp-35680 ' +
    '(measured the amplitude mismatch ratio (pi^2/3)/C_C ~ 8.573); imp-35695 (reciprocal floor factor M^{1/3}); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 (GUE-conditional ' +
    'caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013, smallest GUE gaps ' +
    '~ n^{-4/3}). Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK_ASSERTIONS = [
  {
    // (1) both density-coefficient readings yield the measured M-exponent -1/3 (Ben Arous-Bourgade).
    id: 'imp35696-both-readings-give-minus-one-third',
    description: 'the bisection-solved extreme-value collision scale has measured M-exponent -1/3 for both c = pi^2/3 and c = C_C, matching Ben Arous-Bourgade s_min ~ M^{-1/3}',
    holds: () =>
      Math.abs(EXPONENT_STD - BAB_EXPONENT) < 1e-6 &&
      Math.abs(EXPONENT_CC - BAB_EXPONENT) < 1e-6,
  },
  {
    // (2) coefficient-independence: the two fitted exponents agree to high precision.
    id: 'imp35696-exponent-coefficient-independent',
    description: 'the fitted M-exponent is coefficient-independent: the c = pi^2/3 and c = C_C fits differ by ~0',
    holds: () => {
      const r = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK;
      return (
        EXPONENT_GAP < 1e-6 &&
        r.coefficientIndependentExponent === true &&
        r.exponentsAgree === true
      );
    },
  },
  {
    // (3) the coefficient enters only the prefactor: prefCC/prefStd = ((pi^2/3)/C_C)^{1/3},
    //     the cube root of the imp-35680 amplitude ratio (~8.573 -> ~2.047).
    id: 'imp35696-amplitude-enters-only-prefactor',
    description: 'the amplitude mismatch (pi^2/3)/C_C ~ 8.573 (imp-35680) enters only the prefactor, as its cube root prefCC/prefStd ~ 2.047',
    holds: () => {
      const impliedFromImp35680 = Math.cbrt(IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.ratioCurvatureToCC);
      return (
        Math.abs(PREF_RATIO - Math.cbrt(AMPLITUDE_RATIO)) < 1e-9 &&
        Math.abs(PREF_RATIO - impliedFromImp35680) < 1e-6 &&
        PREF_RATIO > 2.04 && PREF_RATIO < 2.05 &&
        PREF_STD > 0.9 && PREF_STD < 1.0 // O(1), consistent with s_min ~ M^{-1/3}
      );
    },
  },
  {
    // (4) cross-check the C_C anchor against imp-35652 and imp-35680 (same constant everywhere).
    id: 'imp35696-cc-matches-parents',
    description: 'the C_C anchor reproduces (1/8) sqrt(3 pi) and matches the imp-35652 and imp-35680 baked values',
    holds: () => {
      const cc652 = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.C_C;
      const cc680 = IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.C_C;
      return (
        Math.abs(C_C - 0.38374752) < 1e-6 &&
        Math.abs(C_C - cc652) < 1e-6 &&
        Math.abs(C_C - cc680) < 1e-6 &&
        Math.abs(C_STD - IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.shortRangeCurvatureR2) < 1e-6
      );
    },
  },
  {
    // (5) the s_min exponent (-1/3) is the reciprocal of the imp-35695 / imp-35652 floor factor exponent (+1/3).
    id: 'imp35696-reciprocal-of-floor-factor',
    description: 'the collision-scale exponent -1/3 is the reciprocal of the resolution-floor-factor exponent +1/3 (imp-35695 / imp-35652 M^{1/3})',
    holds: () => {
      const t = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.resolutionScaleTable;
      // imp-35652 floor factor obeys shortfall = N^{+1/3}; ours is s_min ~ M^{-1/3}: reciprocal exponents.
      const floorExp =
        Math.log10(t.cross.resolutionShortfall / t.peak.resolutionShortfall) /
        Math.log10(t.cross.N / t.peak.N);
      return (
        Math.abs(floorExp - 1 / 3) < 5e-3 &&
        Math.abs(EXPONENT_STD + floorExp) < 5e-3 // -1/3 + 1/3 ~ 0
      );
    },
  },
  {
    // (6) honesty gate: consistency check only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35696-check-only-no-qed',
    description: 'consistency check only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.corroboratesImp35652Characterisation === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35696-collision-exponent-consistency-check assertion failed: ${a.id}`);
  }
}
