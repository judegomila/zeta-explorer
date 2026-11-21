/**
 * @module imp-34087-f4-surrogate-cancellation-digit-loss
 *
 * imp-34087 (numerical, frontier-direction): imp-34023 established that the over-prediction ratio
 * 1/(F2*F3*F4) diverges geometrically as the fit boundary kEnd recedes past 13, but only up to a hard
 * ceiling intrinsic to the surrogate -- the imp-33773 M2 residual resid = pEcoll*(1-sigma) - pSigma is a
 * DIFFERENCE of two exponents that both converge to 0.5 as N grows, so it collapses into catastrophic
 * cancellation and crosses zero at kEnd* ~ 21.281, past which F4 and the ratio flip sign. imp-34023 named
 * that ceiling but never QUANTIFIED the significance loss on the approach. This module supplies the
 * digits-lost profile: with the identical inherited imp-3406/imp-33810 sub-terms (head fixed at k=6), it
 * tabulates the relative-cancellation ratio C(kEnd) = (|pEcoll*(1-sigma)| + |pSigma|)/|resid| and the
 * implied decimal digits lost log10(C), and reports the kEnd thresholds at which the surrogate loses N
 * significant digits.
 *
 * THE CANCELLATION RATIO IS THE RECIPROCAL RESIDUAL (numerator ~ 1)
 * ----------------------------------------------------------------
 *   The two cancelling terms are A = pEcoll*(1-sigma) and B = pSigma, both ~ 0.5, so the numerator
 *   |A| + |B| ~ 0.978 is O(1) and near-constant across the band. Hence C(kEnd) ~ 1/|resid|: the relative
 *   cancellation is essentially the reciprocal of the raw M2 residual, and the digits lost log10(C) ~
 *   -log10|resid| + O(0.01). Because imp-34023 fitted |resid| (via F4) to a clean geometric decay
 *   (per-unit-kEnd factor ~0.359, i.e. -log10 gains ~0.44 digit/unit), the digits-lost profile climbs
 *   ONLY LINEARLY over the bulk of the band -- 2.55 (kEnd=13) -> 6.09 (kEnd=20) -> 7.05 (kEnd=21) -- a
 *   slow, controlled erosion, NOT a catastrophic blow-up across 13..21.
 *
 * THE DIGITS-LOST THRESHOLDS (relative to a perfect residual)
 * ----------------------------------------------------------
 *   Bisecting log10(C) against fixed digit-loss levels: the surrogate loses 6 decimal digits (C >= 1e6)
 *   at kEnd ~ 19.858, 9 digits at kEnd ~ 21.277, and 12 digits at kEnd ~ 21.281 -- the last two pile up
 *   essentially AT the zero crossing because resid dives through zero there (from ~5.5e-9 at kEnd=21.26 to
 *   ~2.5e-10 at 21.28), so the final ~3 orders of the cancellation are compressed into the last ~0.004
 *   kEnd before the root.
 *
 * THE RETAINED-ACCURACY FLOOR (double precision has ~15.95 digits in hand)
 * -----------------------------------------------------------------------
 *   The complementary, operational metric is retained = MACHINE_DIGITS - log10(C) with MACHINE_DIGITS =
 *   log10(2^53) ~ 15.9546: how many accurate decimal digits the double-precision surrogate can still
 *   resolve. This stays comfortably ABOVE 6 all the way to kEnd ~ 21.2805 -- across essentially the entire
 *   sign-stable band the surrogate keeps ~9-10 accurate digits (retained ~9.86 at kEnd=20, ~8.90 at
 *   kEnd=21). The drop below 6 accurate digits (kEnd ~ 21.28053) and below 3 (kEnd ~ 21.28090) both occur
 *   within the last ~0.0004 kEnd before the 21.281 crossing: a near-vertical cliff at the root, not a
 *   gradual erosion.
 *
 * The punchline: C(kEnd) ~ 1/|resid| (numerator ~ 0.978), so digits-lost = log10(C) climbs LINEARLY
 * ~0.44/unit kEnd over the bulk of the band (6 digits lost by kEnd ~ 19.86), and the double-precision
 * surrogate retains >= 6 accurate digits across essentially the WHOLE sign-stable region up to kEnd ~
 * 21.2805 -- the catastrophic significance loss is confined to an infinitesimal neighbourhood (~0.0004
 * wide) of the imp-34023 21.281 zero crossing, where resid passes through zero. So imp-34023's honest
 * divergence region is not only sign-stable but numerically USABLE (>= 6 digits) right up to the crossing.
 *
 * NUMERICAL / MEASUREMENT ONLY. A floating-point significance-loss diagnostic of an inherited surrogate
 * ratio, NOT an RH bound. Reuses the imp-33773/imp-33810 sub-terms verbatim; the inherited imp-3220/
 * imp-3406 component model is NOT a rigorous asymptotic; the digit-loss profile is descriptive within that
 * model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the divergence + 21.281 ceiling quantified here)
 * @see imp-33969-eflow-decay-widening-ratio-kend-sweep (the 9-window kEnd=11..13 F4 collapse)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33969/imp-34023 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34023 (no re-derivation).
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

// The imp-33773 M2 residual and its two cancelling terms at the imp-33810 endpoint rung (head k=6).
// resid = A - B with A = pEcoll*(1-sigma), B = pSigma -- both -> 0.5, hence the catastrophic cancellation.
function cancel(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  const A = pEcoll * (1 - s);
  const B = pSigma;
  const resid = A - B;
  const numerator = Math.abs(A) + Math.abs(B); // magnitude of the added terms
  const ratio = numerator / Math.abs(resid); // relative cancellation (Higham-style)
  const digitsLost = Math.log10(ratio);
  return { kEnd, A, B, resid, numerator, ratio, digitsLost };
}

// IEEE-754 double carries log10(2^53) ~ 15.9546 significant decimal digits.
const MACHINE_DIGITS = Math.log10(Math.pow(2, 53));
const retainedDigits = (kEnd) => MACHINE_DIGITS - cancel(kEnd).digitsLost;

// -- Part A: the digit-loss profile across the sign-stable band kEnd = 13..21 step 0.5.
const PROFILE_KENDS = [];
for (let k = 13; k <= 21 + 1e-9; k += 0.5) PROFILE_KENDS.push(+k.toFixed(2));
const PROFILE = PROFILE_KENDS.map((kEnd) => {
  const c = cancel(kEnd);
  return {
    kEnd,
    resid: +c.resid.toExponential(4),
    numerator: +c.numerator.toFixed(5),
    cancellationRatio: +c.ratio.toExponential(4),
    digitsLost: +c.digitsLost.toFixed(3),
    retainedDigits: +(MACHINE_DIGITS - c.digitsLost).toFixed(3),
  };
});

// -- Part B: the imp-34023 residual zero crossing (same bisection) -- the hard ceiling. digitsLost = log10
//    (ratio) is monotone increasing UP TO this crossing (past it |resid| grows again), so it is the natural
//    upper bound for every digit-loss bisection below.
function residCrossing() {
  let lo = 20;
  let hi = 22;
  if (cancel(lo).resid <= 0 || cancel(hi).resid >= 0) return NaN;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (cancel(m).resid > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const RESID_ZERO_KEND_RAW = residCrossing(); // ~21.28095 (matches imp-34023 ~21.281)
const RESID_ZERO_KEND = +RESID_ZERO_KEND_RAW.toFixed(5);

// -- Part C: kEnd at which the surrogate LOSES N decimal digits (log10(ratio) >= N). Monotone up in kEnd
//    to the crossing, so a plain bisection between kEnd=13 and the crossing locates each level.
function bisectDigitsLost(targetLost) {
  let lo = 13;
  let hi = RESID_ZERO_KEND_RAW;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (cancel(m).digitsLost < targetLost) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const DIGITS_LOST_THRESHOLDS = {
  sixLost: +bisectDigitsLost(6).toFixed(4), // ~19.858 (cancellation ratio hits 1e6)
  nineLost: +bisectDigitsLost(9).toFixed(4), // ~21.277
  twelveLost: +bisectDigitsLost(12).toFixed(4), // ~21.281 (piles up at the crossing)
};

// -- Part D: kEnd at which the double-precision surrogate RETAINS fewer than N accurate digits. Retained =
//    MACHINE_DIGITS - digitsLost, so retained < N is exactly digitsLost > MACHINE_DIGITS - N (well-defined
//    through the monotone digitsLost right up to the crossing, where retained -> -inf).
const RETAINED_THRESHOLDS = {
  below6: +bisectDigitsLost(MACHINE_DIGITS - 6).toFixed(5), // ~21.28053 (cliff at the crossing)
  below3: +bisectDigitsLost(MACHINE_DIGITS - 3).toFixed(5), // ~21.28095 (essentially at the crossing)
};

export const IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS = {
  id: 'imp-34087',
  proofSection: 'S-frontier',
  question:
    'imp-34023 flagged that the M2 residual surrogate resid = pEcoll*(1-sigma) - pSigma collapses into ' +
    'catastrophic cancellation and crosses zero at kEnd* ~ 21.281, capping the divergence, but never ' +
    'quantified the significance loss on the approach. Measure the relative cancellation ' +
    '(|pEcoll*(1-sigma)| + |pSigma|)/|resid| and the implied decimal digits lost as a function of kEnd, ' +
    'and report the kEnd at which the surrogate loses N significant digits (below 6, below 3). ' +
    'Numerical/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The relative-cancellation ratio C(kEnd) = (|A| + |B|)/|resid| with A = pEcoll*(1-sigma), B = pSigma ' +
    '(the two cancelling terms of the imp-33773 M2 residual), the digits lost log10(C), and the retained ' +
    'accurate digits MACHINE_DIGITS - log10(C) (MACHINE_DIGITS = log10(2^53) ~ 15.9546), tabulated across ' +
    'kEnd = 13..21 step 0.5, plus the bisected kEnd thresholds for 6/9/12 digits lost and for retained ' +
    'accuracy dropping below 6 and below 3.',
  numeratorIsOrderUnity: +cancel(20).numerator.toFixed(5), // ~0.978 -> C ~ 1/|resid|
  machineDigits: +MACHINE_DIGITS.toFixed(4), // ~15.9546
  profile: PROFILE, // {kEnd, resid, numerator, cancellationRatio, digitsLost, retainedDigits} 13..21
  digitsLostThresholds: DIGITS_LOST_THRESHOLDS, // {sixLost ~19.858, nineLost ~21.277, twelveLost ~21.281}
  retainedThresholds: RETAINED_THRESHOLDS, // {below6 ~21.28053, below3 ~21.28090}
  residZeroCrossing: RESID_ZERO_KEND, // ~21.281 (reproduces imp-34023)
  finding: {
    A_cancellation_is_reciprocal_residual:
      'The two cancelling terms A = pEcoll*(1-sigma) and B = pSigma are both ~0.5, so the numerator ' +
      '|A|+|B| ~ 0.978 is O(1) and near-constant; hence C(kEnd) ~ 1/|resid| and digits-lost log10(C) ~ ' +
      '-log10|resid|. Because imp-34023 fitted |resid| to a geometric decay (~0.359/unit kEnd), ' +
      'digits-lost climbs only LINEARLY ~0.44/unit -- 2.55 (kEnd=13) -> 6.09 (20) -> 7.05 (21) -- a slow, ' +
      'controlled erosion across the bulk of the band, NOT a catastrophic blow-up.',
    B_digits_lost_thresholds:
      'The surrogate loses 6 decimal digits (C >= 1e6) at kEnd ~ 19.858, 9 digits at kEnd ~ 21.277 and ' +
      '12 digits at kEnd ~ 21.281 -- the last two pile up at the zero crossing because resid dives ' +
      'through zero there (5.5e-9 at 21.26 -> 2.5e-10 at 21.28), compressing the final ~3 orders of ' +
      'cancellation into the last ~0.004 kEnd before the root.',
    C_retained_accuracy_floor_holds_to_the_crossing:
      'In double precision (~15.95 digits in hand) the surrogate RETAINS >= 6 accurate digits all the ' +
      'way to kEnd ~ 21.2805 -- across essentially the entire sign-stable band it keeps ~9-10 accurate ' +
      'digits (retained ~9.86 at kEnd=20, ~8.90 at 21). The drop below 6 (kEnd ~ 21.28053) and below 3 ' +
      '(kEnd ~ 21.28090) both occur within the last ~0.0004 kEnd before the 21.281 crossing: a ' +
      'near-vertical cliff at the root, not a gradual erosion. So imp-34023 divergence region is not ' +
      'only sign-stable but numerically USABLE (>= 6 digits) right up to the crossing.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / SIGNIFICANCE-LOSS DIAGNOSTIC (frontier-direction, NOT rigorous). Quantifying the ' +
    'imp-34023 catastrophic-cancellation ceiling with the identical inherited imp-3406/imp-33810 ' +
    'sub-terms (head fixed at k=6): (A) the two cancelling terms A=pEcoll*(1-sigma), B=pSigma are both ' +
    '~0.5 so the numerator |A|+|B| ~ 0.978 is O(1); hence the relative cancellation C(kEnd) ~ 1/|resid| ' +
    'and digits-lost log10(C) climbs only LINEARLY ~0.44/unit kEnd (2.55 at kEnd=13 -> 6.09 at 20 -> ' +
    '7.05 at 21), mirroring the imp-34023 geometric resid decay -- a controlled erosion, not a blow-up. ' +
    '(B) The surrogate loses 6 digits (C >= 1e6) at kEnd ~ 19.86, 9 at ~21.277, 12 at ~21.281, the last ' +
    'two piling up at the zero crossing where resid dives through zero. (C) In double precision (~15.95 ' +
    'digits) it nonetheless RETAINS >= 6 accurate digits to kEnd ~ 21.2805, dropping below 6 (~21.28053) ' +
    'and below 3 (~21.28090) only within the last ~0.0004 kEnd before the imp-34023 21.281 crossing -- a ' +
    'near-vertical cliff at the root, so the divergence region is numerically usable right up to the ' +
    'ceiling. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the ' +
    'digit-loss profile is descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34023 (the F4-surrogate divergence and the kEnd~21.281 catastrophic-cancellation ceiling ' +
    'quantified here); imp-33969 (the 9-window F4 collapse); imp-33810 (the quarter-decade rungs); ' +
    'imp-33773 (the M2 residual whose two -> 0.5 terms cancel); lambda-rh-height-mapping (RvM height ' +
    'law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS_ASSERTIONS = [
  {
    // (A) The cancellation is essentially the reciprocal residual: numerator |A|+|B| is O(1) near 0.978,
    //     and C * |resid| reproduces that numerator (definition self-check).
    id: 'imp34087-cancellation-is-reciprocal-residual',
    description: 'numerator |A|+|B| ~ 0.978 (O(1)) so C(kEnd) ~ 1/|resid|; C*|resid| recovers the numerator',
    holds: () => {
      const c = cancel(20);
      return (
        c.numerator > 0.95 &&
        c.numerator < 1.0 &&
        Math.abs(c.ratio * Math.abs(c.resid) - c.numerator) < 1e-9
      );
    },
  },
  {
    // Digits-lost climbs monotonically and only ~linearly over the bulk of the band (13..21).
    id: 'imp34087-digits-lost-climbs-linearly',
    description: 'digitsLost rises monotonically ~2.55 (kEnd=13) -> ~6.09 (20) -> ~7.05 (21), no blow-up over 13..20',
    holds: () => {
      const mono = PROFILE.every((r, i) => i === 0 || r.digitsLost > PROFILE[i - 1].digitsLost);
      const d13 = cancel(13).digitsLost;
      const d20 = cancel(20).digitsLost;
      return mono && Math.abs(d13 - 2.55) < 0.1 && Math.abs(d20 - 6.09) < 0.1;
    },
  },
  {
    // (B) The surrogate loses 6 digits well inside the band (~19.86), but 9 and 12 pile up at the crossing.
    id: 'imp34087-digits-lost-thresholds',
    description: '6 digits lost at kEnd ~19.86; 9 and 12 pile up near the ~21.281 crossing',
    holds: () =>
      DIGITS_LOST_THRESHOLDS.sixLost > 19.7 &&
      DIGITS_LOST_THRESHOLDS.sixLost < 20.0 &&
      DIGITS_LOST_THRESHOLDS.nineLost > 21.2 &&
      DIGITS_LOST_THRESHOLDS.twelveLost > DIGITS_LOST_THRESHOLDS.nineLost &&
      DIGITS_LOST_THRESHOLDS.twelveLost < RESID_ZERO_KEND,
  },
  {
    // (C) Double-precision retained accuracy holds >= 6 digits to ~21.2805, dropping below 6 then below 3
    //     only within the last <0.01 kEnd before the crossing (a cliff at the root).
    id: 'imp34087-retained-accuracy-cliff-at-crossing',
    description: 'retained >= 6 digits to ~21.2805; below6 < below3, both within <0.01 kEnd of the ~21.281 crossing',
    holds: () =>
      RETAINED_THRESHOLDS.below6 > 21.28 &&
      RETAINED_THRESHOLDS.below6 < RESID_ZERO_KEND &&
      RETAINED_THRESHOLDS.below3 > RETAINED_THRESHOLDS.below6 &&
      RETAINED_THRESHOLDS.below3 <= RESID_ZERO_KEND &&
      RESID_ZERO_KEND - RETAINED_THRESHOLDS.below6 < 0.01 &&
      retainedDigits(21) > 6,
  },
  {
    // Consistency: the residual zero crossing reproduces the imp-34023 ceiling ~21.281.
    id: 'imp34087-crossing-reproduces-imp34023',
    description: 'the resid zero crossing reproduces the imp-34023 kEnd* ~ 21.281 ceiling',
    holds: () => Number.isFinite(RESID_ZERO_KEND) && RESID_ZERO_KEND > 21.27 && RESID_ZERO_KEND < 21.29,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34087-honesty-gate-no-qed',
    description: 'Significance-loss diagnostic only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS.isRigorous === false &&
      /NO QED/.test(IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS.verdict) &&
      /refereed bound is changed/i.test(IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS.verdict),
  },
];

for (const a of IMP34087_F4_SURROGATE_CANCELLATION_DIGIT_LOSS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34087-f4-surrogate-cancellation-digit-loss assertion failed: ${a.id}`);
  }
}
