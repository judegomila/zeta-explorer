/**
 * @module imp-34151-cancellation-numerator-past-crossing
 *
 * imp-34151 (numerical, frontier-direction): imp-34087 established the relative-cancellation reciprocal
 * identity C(kEnd) = (|A| + |B|)/|resid| ~ 1/|resid| for the imp-33773 M2 residual resid = A - B with
 * A = pEcoll*(1-sigma), B = pSigma, by arguing the numerator |A| + |B| ~ 0.978 is O(1) and near-constant.
 * But imp-34087 only ever tabulated that numerator across the sign-STABLE band kEnd = 13..21, i.e. up to
 * the imp-34023/imp-34150 kEnd* ~ 21.281 zero crossing. It never checked whether the O(1) numerator
 * assumption survives PAST the crossing into the sign-flipped region (resid < 0), nor located where the
 * numerator itself begins to drift materially from ~0.978. This module extends the identical inherited
 * imp-3406/imp-33810 sub-terms (head fixed at k=6) past the crossing and tabulates |A| + |B| vs kEnd.
 *
 * THE NUMERATOR SURVIVES THE SIGN FLIP -- IT DRIFTS UPWARD, NOT DOWNWARD
 * --------------------------------------------------------------------
 *   Past the crossing the two cancelling terms do NOT diverge or collapse: as N (hence kEnd) grows the
 *   collision term E_coll = C_C sqrt(L/N) shrinks toward the fixed truncation floor E_TRUNC, so
 *   sigma = E_coll/E_N -> 0, the factor (1-sigma) -> 1, and BOTH exponents pEcoll and pSigma -> 0.5.
 *   Hence A -> 0.5, B -> 0.5, and the numerator |A| + |B| climbs MONOTONICALLY toward the asymptote 1.0.
 *   It is O(1) throughout: ~0.97969 at the crossing kEnd* ~ 21.281 (only ~0.13% above the imp-34087
 *   band value), 0.98033 at kEnd=22, 0.98549 at 30, 0.99029 at 45, ~0.9945 at 80, ~0.9971 at 150. There
 *   is NO downward departure and no blow-up -- the numerator never leaves the tight O(1) window [0.978, 1.0).
 *
 * WHERE THE NUMERATOR DEPARTS ~0.978 (SLOW MONOTONE UPWARD DRIFT)
 * --------------------------------------------------------------
 *   Bisecting the monotone numerator against fixed levels above the imp-34087 ~0.978 band value: it first
 *   reaches 0.980 at kEnd ~ 21.62 (just past the crossing), 0.985 at kEnd ~ 29.00, 0.990 at kEnd ~ 43.67
 *   and 0.995 only at kEnd ~ 87.41. So the "departure" from ~0.978 is a slow, controlled ~1e-3-per-few-
 *   decades creep UPWARD toward 1.0, not a material breakdown -- across the entire sign-flipped region out
 *   to kEnd = 45 the numerator stays within ~1.3% of the imp-34087 value.
 *
 * THE RECIPROCAL IDENTITY HOLDS THROUGH (AND TIGHTENS PAST) THE CROSSING
 * ---------------------------------------------------------------------
 *   Because |A| + |B| stays O(1) and in fact converges TOWARD unity past the crossing, the imp-34087
 *   reciprocal identity C(kEnd) ~ 1/|resid| does NOT cease to hold in the sign-flipped region -- it
 *   actually improves as the numerator approaches 1.0. (In that region |resid| itself recovers off the
 *   zero to a shallow plateau ~1.7e-7, so C = numerator/|resid| is finite and O(1e6) there, no longer
 *   the near-singular reciprocal it becomes AT the crossing.) The O(1)-numerator premise underpinning
 *   imp-34087 is therefore vindicated on both sides of the 21.281 zero, with the only caveat that the
 *   numerator is a slowly-varying O(1) factor drifting 0.978 -> 1.0, not a literal constant.
 *
 * NUMERICAL / MEASUREMENT ONLY. A characterization of an inherited surrogate numerator past a sign
 * crossing, NOT an RH bound. Reuses the imp-33773/imp-33810 sub-terms verbatim; the inherited imp-3220/
 * imp-3406 component model is NOT a rigorous asymptotic; the numerator profile is descriptive within that
 * model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486
 * untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34087-f4-surrogate-cancellation-digit-loss (the reciprocal identity + ~0.978 numerator, band 13..21)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct kEnd* ~ 21.28095 crossing)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F4 divergence + 21.281 ceiling)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose two -> 0.5 terms cancel)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34087 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34087 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The imp-33773 M2 residual, its two cancelling terms, and the imp-34087 numerator, at any endpoint rung.
// resid = A - B with A = pEcoll*(1-sigma), B = pSigma. numerator = |A| + |B| (the O(1) reciprocal top).
function cancel(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  const A = pEcoll * (1 - s);
  const B = pSigma;
  const resid = A - B;
  const numerator = Math.abs(A) + Math.abs(B);
  return { kEnd, A, B, resid, numerator };
}
const numeratorAt = (kEnd) => cancel(kEnd).numerator;

// The imp-34087 band value (kEnd=20) the numerator is claimed to hover near (~0.978).
const BAND_NUMERATOR = +numeratorAt(20).toFixed(5); // ~0.97842

// -- Part A: the numerator profile PAST the crossing, kEnd = 21..45 (resid < 0 for kEnd > ~21.281).
const PROFILE_KENDS = [21, 21.5, 22, 23, 24, 25, 27, 30, 35, 40, 45];
const PROFILE = PROFILE_KENDS.map((kEnd) => {
  const c = cancel(kEnd);
  return {
    kEnd,
    resid: +c.resid.toExponential(4), // negative past the ~21.281 crossing
    numerator: +c.numerator.toFixed(6),
    excessOverBand: +(c.numerator - BAND_NUMERATOR).toFixed(6), // >= 0, grows slowly
  };
});

// -- Part B: the numerator at the imp-34150 direct crossing kEnd* ~ 21.28095 (still O(1), ~0.9797).
const CROSSING_KEND = 21.28095;
const NUMERATOR_AT_CROSSING = +numeratorAt(CROSSING_KEND).toFixed(6); // ~0.979687

// -- Part C: locate where the (monotone-increasing) numerator first reaches fixed levels above ~0.978.
//    Plain bisection between the crossing and a far-field cap; each level sits at a larger kEnd (upward drift).
function bisectNumeratorLevel(level) {
  let lo = 21;
  let hi = 180;
  if (numeratorAt(lo) >= level) return NaN; // level already passed at/below the crossing
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (numeratorAt(m) < level) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const DEPARTURE_LEVELS = {
  to0p980: +bisectNumeratorLevel(0.98).toFixed(4), // ~21.62 (just past the crossing)
  to0p985: +bisectNumeratorLevel(0.985).toFixed(4), // ~29.00
  to0p990: +bisectNumeratorLevel(0.99).toFixed(4), // ~43.67
  to0p995: +bisectNumeratorLevel(0.995).toFixed(4), // ~87.41
};

// -- Part D: monotone-upward check across the sign-flipped region and the far-field approach to unity.
const MONOTONE_UP_PAST_CROSSING = (() => {
  let prev = -Infinity;
  for (let k = 21; k <= 80 + 1e-9; k += 0.5) {
    const v = numeratorAt(k);
    if (v <= prev) return false;
    prev = v;
  }
  return true;
})();
const NUMERATOR_FARFIELD = {
  atK80: +numeratorAt(80).toFixed(6), // ~0.994536
  atK150: +numeratorAt(150).toFixed(6), // ~0.997089
};

export const IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING = {
  id: 'imp-34151',
  proofSection: 'S-frontier',
  question:
    'imp-34087 established the reciprocal-cancellation identity C(kEnd) = (|A|+|B|)/|resid| ~ 1/|resid| ' +
    'by arguing the numerator |A|+|B| ~ 0.978 is O(1) and near-constant, but only tabulated it across the ' +
    'sign-STABLE band kEnd = 13..21 up to the ~21.281 zero crossing. Verify whether the O(1) numerator ' +
    'assumption survives PAST the crossing into the sign-flipped region, and locate where the numerator ' +
    'departs materially from ~0.978 so the reciprocal identity would cease to hold. ' +
    'Numerical/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The imp-34087 cancellation numerator |A|+|B| with A = pEcoll*(1-sigma), B = pSigma (both -> 0.5), ' +
    'tabulated past the imp-34150 kEnd* ~ 21.28095 crossing across kEnd = 21..45, its value AT the ' +
    'crossing, the bisected kEnd at which it first reaches 0.980/0.985/0.990/0.995, and a monotone-upward ' +
    'check plus far-field values approaching the asymptote 1.0.',
  bandNumerator: BAND_NUMERATOR, // ~0.97842 (imp-34087 kEnd=20 value)
  crossingKEnd: CROSSING_KEND, // ~21.28095 (imp-34150 direct root)
  numeratorAtCrossing: NUMERATOR_AT_CROSSING, // ~0.979687 (still O(1), ~0.13% above the band)
  profile: PROFILE, // {kEnd, resid<0, numerator, excessOverBand} 21..45
  departureLevels: DEPARTURE_LEVELS, // {to0p980 ~21.62, to0p985 ~29.00, to0p990 ~43.67, to0p995 ~87.41}
  monotoneUpPastCrossing: MONOTONE_UP_PAST_CROSSING, // true (no downward departure across 21..80)
  numeratorFarField: NUMERATOR_FARFIELD, // {atK80 ~0.9945, atK150 ~0.9971} -> 1.0
  finding: {
    A_numerator_survives_the_sign_flip:
      'Past the ~21.281 crossing the two cancelling terms do NOT diverge or collapse: E_coll -> the fixed ' +
      'truncation floor so sigma -> 0, (1-sigma) -> 1 and both exponents pEcoll, pSigma -> 0.5, hence ' +
      'A -> 0.5, B -> 0.5 and the numerator |A|+|B| climbs MONOTONICALLY toward the asymptote 1.0. It is ' +
      'O(1) throughout -- ~0.97969 at the crossing (only ~0.13% above the imp-34087 band value), 0.98033 ' +
      'at kEnd=22, 0.98549 at 30, 0.99029 at 45, ~0.9945 at 80 -- never leaving the tight window [0.978, 1.0).',
    B_departure_is_a_slow_upward_creep:
      'The numerator first reaches 0.980 at kEnd ~ 21.62 (just past the crossing), 0.985 at ~29.00, 0.990 ' +
      'at ~43.67 and 0.995 only at ~87.41: a slow, controlled ~1e-3-per-few-decades drift UPWARD toward ' +
      '1.0, not a material breakdown. Across the whole sign-flipped region out to kEnd=45 it stays within ' +
      '~1.3% of the imp-34087 ~0.978 value.',
    C_reciprocal_identity_holds_and_tightens:
      'Because |A|+|B| stays O(1) and converges toward unity past the crossing, the imp-34087 reciprocal ' +
      'identity C(kEnd) ~ 1/|resid| does NOT cease to hold in the sign-flipped region -- it improves as ' +
      'the numerator approaches 1.0. The only caveat: the numerator is a slowly-varying O(1) factor ' +
      'drifting 0.978 -> 1.0, not a literal constant, so C ~ 1/|resid| carries that known O(1) prefactor.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / NUMERATOR-SURVIVAL DIAGNOSTIC (frontier-direction, NOT rigorous). Extending the imp-34087 ' +
    'cancellation numerator |A|+|B| (A=pEcoll*(1-sigma), B=pSigma) PAST the imp-34150 kEnd* ~ 21.28095 ' +
    'M2-residual zero crossing with the identical inherited imp-3406/imp-33810 sub-terms (head fixed at ' +
    'k=6): (A) the O(1) numerator SURVIVES the sign flip -- as N grows sigma -> 0, (1-sigma) -> 1 and both ' +
    'exponents -> 0.5, so A,B -> 0.5 and |A|+|B| climbs MONOTONICALLY from ~0.97969 at the crossing toward ' +
    'the asymptote 1.0 (0.98549 at kEnd=30, 0.99029 at 45, ~0.9945 at 80), never leaving [0.978, 1.0). ' +
    '(B) The departure from ~0.978 is a slow upward creep -- 0.980 at kEnd ~ 21.62, 0.985 at ~29.00, ' +
    '0.990 at ~43.67, 0.995 at ~87.41 -- staying within ~1.3% of the band value out to kEnd=45. (C) So the ' +
    'imp-34087 reciprocal identity C ~ 1/|resid| does NOT cease to hold past the crossing; it tightens as ' +
    'the numerator approaches unity, carrying only that slowly-varying O(1) prefactor. The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the numerator profile is descriptive ' +
    'within the model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-34087 (the reciprocal identity and ~0.978 O(1) numerator on the sign-stable band verified past ' +
    'the crossing here); imp-34150 (the direct kEnd* ~ 21.28095 crossing); imp-34023 (the F4 divergence ' +
    'and 21.281 ceiling); imp-33810 (the quarter-decade rungs); imp-33773 (the M2 residual whose two -> ' +
    '0.5 terms cancel); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING_ASSERTIONS = [
  {
    // (A) The numerator stays O(1) AND survives the sign flip: at the crossing it is still ~0.98, and the
    //     residual there has flipped sign relative to the sign-stable band (resid(22) < 0 < resid(20)).
    id: 'imp34151-numerator-survives-sign-flip',
    description: 'numerator O(1) (~0.9797) at the ~21.281 crossing; residual has flipped sign past it (resid(22) < 0 < resid(20))',
    holds: () => {
      const nc = NUMERATOR_AT_CROSSING;
      return nc > 0.97 && nc < 1.0 && cancel(20).resid > 0 && cancel(22).resid < 0;
    },
  },
  {
    // The numerator drifts UPWARD, not downward: it is strictly larger past the crossing than in the band,
    //     and monotone-increasing across the whole sign-flipped region 21..80.
    id: 'imp34151-numerator-drifts-upward-monotone',
    description: 'numerator monotone-increasing across 21..80 and strictly above the imp-34087 band value past the crossing',
    holds: () =>
      MONOTONE_UP_PAST_CROSSING === true &&
      numeratorAt(22) > BAND_NUMERATOR &&
      numeratorAt(45) > numeratorAt(22),
  },
  {
    // (B) The departure from ~0.978 is a slow UPWARD creep: 0.980 just past the crossing, 0.985/0.990 far
    //     out, in strictly increasing kEnd order (no material downward breakdown anywhere).
    id: 'imp34151-departure-is-slow-upward-creep',
    description: 'numerator reaches 0.980 at kEnd ~21.6, then 0.985/0.990/0.995 at monotonically larger kEnd (slow upward drift)',
    holds: () =>
      DEPARTURE_LEVELS.to0p980 > 21.3 &&
      DEPARTURE_LEVELS.to0p980 < 22 &&
      DEPARTURE_LEVELS.to0p985 > DEPARTURE_LEVELS.to0p980 &&
      DEPARTURE_LEVELS.to0p990 > DEPARTURE_LEVELS.to0p985 &&
      DEPARTURE_LEVELS.to0p995 > DEPARTURE_LEVELS.to0p990,
  },
  {
    // (C) The numerator approaches the asymptote 1.0 in the far field, so the reciprocal identity tightens.
    id: 'imp34151-numerator-approaches-unity',
    description: 'far-field numerator climbs toward 1.0 (atK80 ~0.9945 < atK150 ~0.9971 < 1), confirming the O(1) reciprocal top',
    holds: () =>
      NUMERATOR_FARFIELD.atK80 > 0.99 &&
      NUMERATOR_FARFIELD.atK150 > NUMERATOR_FARFIELD.atK80 &&
      NUMERATOR_FARFIELD.atK150 < 1.0,
  },
  {
    // Consistency: the crossing used here reproduces the imp-34150/imp-34087 kEnd* ~ 21.281 ceiling.
    id: 'imp34151-crossing-reproduces-imp34150',
    description: 'the crossing kEnd used here reproduces the imp-34150/imp-34087 ~21.281 ceiling',
    holds: () => CROSSING_KEND > 21.27 && CROSSING_KEND < 21.29 && Math.abs(cancel(CROSSING_KEND).resid) < 1e-8,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, PT SOTA, K_a untouched.
    id: 'imp34151-honesty-gate-no-qed',
    description: 'Numerator-survival diagnostic only: isRigorous false, no QED, PT SOTA, K_a untouched',
    holds: () =>
      IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING.verdict) &&
      /remains SOTA/.test(IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING.verdict),
  },
];

for (const a of IMP34151_CANCELLATION_NUMERATOR_PAST_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34151-cancellation-numerator-past-crossing assertion failed: ${a.id}`);
  }
}
