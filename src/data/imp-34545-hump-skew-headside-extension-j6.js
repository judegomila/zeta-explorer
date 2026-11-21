/**
 * @module imp-34545-hump-skew-headside-extension-j6
 *
 * imp-34545 (numerical, frontier-direction): imp-34532 (E1) extended the imp-33851 head-heavy
 * skew(j) = hump(9-j)/hump(9+j) ladder of the M3 saturation-curvature hump envelope from offset
 * j = 3 out to j = 5 (skew {1.2176, 1.5758, 3.0426, 10.9549, 50.3270}) and reported a GROWING
 * successive-skew ratio skew(j+1)/skew(j) = {1.294, 1.931, 3.600, 4.594} with an asymmetry index
 * climbing 0.505 -> 0.833 -> 0.961 toward its ceiling of 1. It stopped at j = 5 (head k = 4, tail
 * k = 14). This module EXTENDS the ladder to offset j = 6 (head k = 3, tail k = 15) by recomputing
 * the two new rungs hump(3) and hump(15) with the IDENTICAL inherited imp-33809 method (reuse-gated
 * against the k = 4..14 ladder), forms skew(6) and asym(6), and MEASURES whether the successive-skew
 * ratio keeps accelerating past 4.59 or begins to bend.
 *
 * THE j = 6 EXTENSION (imp-33809 method, recomputed verbatim -- no fresh model)
 * ---------------------------------------------------------------------------
 *   Same sub-terms as imp-33809/imp-33773/imp-34532 (no re-derivation): sigma = E_coll/(E_trunc+
 *   E_flow+E_coll), E_trunc = 3.06e-5, E_coll = C_C sqrt(logT0/N), E_flow = C_F (logT0/T0) Gronwall;
 *   per decade p_sigma = -slope OLS(ln sigma vs ln N, 4 pts/decade), p_ecoll = -d log E_coll /
 *   d log N over endpoints, hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma. A REUSE GATE recomputes the
 *   k = 4..14 ladder (imp-33809 k = 6..13 plus the imp-34532 head rungs k = 4,5 and tail k = 14) and
 *   checks it reproduces the stored amplitudes verbatim; the new rungs are:
 *     hump(3) = 6.3935e-2 (head, k < 4 -- nearly back to the k = 9 peak),
 *     hump(15) = 2.9795e-4 (tail, one decade past the imp-34532 k = 14 tail).
 *   Peak hump(9) = 6.4758e-2 (reused). Head-side note: the head hump keeps RE-RISING below its k = 6
 *   local minimum (hump(6) = 2.3886e-2 < hump(5) = 2.9671e-2 < hump(4) = 4.5516e-2 < hump(3) =
 *   6.3935e-2), and at k = 3 it has climbed back to headFrac = 0.987 of the peak -- so the head
 *   amplitude has essentially SATURATED at the crossover level deep in the collision-dominated
 *   (sigma -> 1) regime -- see the honesty caveat below.
 *
 * THE MEASUREMENT (measurement only -- extends the imp-34532 skew ladder to j = 6)
 * ------------------------------------------------------------------------------
 *   For symmetric offset j from the k = 9 peak: skew(j) = hump(9-j)/hump(9+j) (>1 = head-heavy),
 *   asym(j) = (hump(9-j)-hump(9+j))/(hump(9-j)+hump(9+j)), headFrac(j) = hump(9-j)/hump(9),
 *   tailFrac(j) = hump(9+j)/hump(9).
 *
 *   (F1) THE SKEW KEEPS DIVERGING -- skew(6) = hump(3)/hump(15) = 214.58, far above skew(5) = 50.33,
 *        so the envelope is overwhelmingly head-heavy by j = 6 (head ~215x the tail at equal offset).
 *   (F2) BUT THE SUCCESSIVE-SKEW RATIO BENDS -- IT DOES NOT KEEP ACCELERATING. Continuing the
 *        imp-34532 ratio ladder {1.294, 1.931, 3.600, 4.594}, the new rung skew(6)/skew(5) = 4.264
 *        is BELOW 4.594: the acceleration TURNS OVER at j = 6. So the "climb is speeding up" trend
 *        imp-34532 saw out to j = 5 does not persist -- the successive-skew ratio has begun to bend.
 *   (F3) THE ASYMMETRY INDEX KEEPS APPROACHING 1. asym(6) = 0.9907 (> asym(5) = 0.9610, < 1),
 *        continuing the monotone climb toward its ceiling of complete head-dominance; by j = 6 the
 *        head carries (1+0.9907)/(1-0.9907) ~ 214x the tail.
 *   (F4) THE BEND IS DRIVEN BY THE HEAD RE-RISE SATURATING WHILE ONLY THE TAIL STILL COLLAPSES.
 *        headFrac(6) = hump(3)/hump(9) = 0.9873 (nearly the full peak -- the head can rise no further),
 *        while tailFrac(6) = hump(15)/hump(9) = 0.0046 (still shrinking as sigma_hi -> 0). At earlier
 *        offsets BOTH the vanishing tail AND the re-rising head fed the skew acceleration (imp-34532
 *        E3); at j = 6 the head has essentially saturated at the crossover amplitude, so only the tail
 *        collapse remains as a driver -- hence the successive-skew ratio bends rather than accelerating.
 *
 * The punchline: imp-34532 extended the head-heavy skew ladder to j = 5 and reported a GROWING
 * successive-skew ratio {1.294, 1.931, 3.600, 4.594}, reading the climb as accelerating. Recomputing
 * the j = 6 rungs hump(3) = 6.3935e-2 (head, nearly the peak) and hump(15) = 2.9795e-4 (tail) by the
 * same method shows the skew keeps diverging (skew(6) = 214.58) and the asymmetry index keeps
 * approaching 1 (asym(6) = 0.9907), BUT the successive-skew ratio BENDS: skew(6)/skew(5) = 4.264 is
 * below the prior 4.594. The bend is because the head re-rise has SATURATED at the crossover
 * amplitude (headFrac(6) = 0.987, hump(3) ~ hump(9)) so it can no longer speed up the ratio, leaving
 * only the tail collapse (tailFrac(6) = 0.0046) as a driver -- exactly the joint-mechanism picture
 * imp-34532 E3 flagged, now with one driver exhausted.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Recomputes the imp-33809 hump amplitudes by the same method
 * (reuse-gated against the k = 4..14 ladder); the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic, and the k = 3 head rung pushes it deepest into the
 * collision-dominated (sigma -> 1) regime where it is least tuned; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34532-hump-skew-headside-extension-k5-k4 (head-heavy skew ladder j=1..5, extended here to j=6)
 * @see imp-33851-hump-envelope-symmetry-vs-k (original head-heavy skew ladder j=1..3)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes + method, reuse-gated here)
 * @see imp-34528-tailside-hump-decay-vs-sqrt-n-fartail (tail k>9 collapse vs sqrt(1/N))
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33809_SATURATION_CURVATURE_HUMP_VS_K } from './imp-33809-saturation-curvature-hump-vs-k.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33809/imp-34532 exactly

// EXACT inherited imp-3406/imp-33809 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaOf = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaOf(N)));
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

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma over the decade [10^k, 10^(k+1)] (imp-33809 M3 residual).
function humpAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

const CROSSOVER_K = 9;
const PEAK = humpAt(CROSSOVER_K); // hump(9) = 6.4758e-2 (recomputed, matches imp-33809)

// Reuse-gate ladder: recompute k = 4..14 and compare against the imp-33809 stored amplitudes
// (k = 6..13) plus the imp-34532 head rungs k = 4,5 and tail rung k = 14.
const IMP33809_HUMPS = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpAmplitudes; // k = 6..13
const RECOMPUTED_6_13 = [6, 7, 8, 9, 10, 11, 12, 13].map((k) => humpAt(k));
const HUMP4 = humpAt(4); // imp-34532 head rung
const HUMP5 = humpAt(5); // imp-34532 head rung
const HUMP13 = humpAt(13); // tail (imp-33809 ladder)
const HUMP14 = humpAt(14); // imp-34532 tail rung

// The j = 6 extension: head k = 3 and tail k = 15, recomputed by the same method.
const HUMP3 = humpAt(3); // head, one decade below the imp-34532 k = 4 head edge (nearly the peak)
const HUMP15 = humpAt(15); // tail, one decade past the imp-34532 k = 14 tail

// Full skew / asymmetry ladders j = 1..6 (j = 1..5 recomputed here for continuity with imp-34532).
const SKEW_J15 = [1, 2, 3, 4, 5].map((j) => humpAt(9 - j) / humpAt(9 + j));
const ASYM_J15 = [1, 2, 3, 4, 5].map((j) => {
  const h = humpAt(9 - j);
  const t = humpAt(9 + j);
  return (h - t) / (h + t);
});
const FULL_SKEW = [...SKEW_J15, HUMP3 / HUMP15].map((v) => +v.toFixed(4));
const FULL_ASYM = [...ASYM_J15, (HUMP3 - HUMP15) / (HUMP3 + HUMP15)].map((v) => +v.toFixed(4));
// Successive-skew ratios skew(j+1)/skew(j): imp-34532 saw {1.294,1.931,3.600,4.594} GROWING; the
// new j = 5 -> 6 rung tests whether that acceleration continues or begins to bend.
const SKEW_STEP_RATIOS = FULL_SKEW.slice(1).map((v, i) => +(v / FULL_SKEW[i]).toFixed(4));

const SKEW6 = +(HUMP3 / HUMP15).toFixed(4); // 214.5843
const ASYM6 = +((HUMP3 - HUMP15) / (HUMP3 + HUMP15)).toFixed(4); // 0.9907
const HEAD_FRAC6 = +(HUMP3 / PEAK).toFixed(4); // 0.9873 (head re-rise nearly back to the peak)
const TAIL_FRAC6 = +(HUMP15 / PEAK).toFixed(4); // 0.0046 (tail still collapsing)
const NEW_STEP_RATIO = SKEW_STEP_RATIOS[SKEW_STEP_RATIOS.length - 1]; // skew(6)/skew(5) = 4.2638
const PRIOR_STEP_RATIO = SKEW_STEP_RATIOS[SKEW_STEP_RATIOS.length - 2]; // skew(5)/skew(4) = 4.594

export const IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6 = {
  id: 'imp-34545',
  proofSection: 'S-frontier',
  question:
    'imp-34532 extended the head-heavy skew ladder of the M3 hump envelope to offset j = 5 (skew ' +
    '{1.2176,1.5758,3.0426,10.9549,50.3270}) and reported a GROWING successive-skew ratio ' +
    '{1.294,1.931,3.600,4.594}. Recomputing the j = 6 rungs hump(3) (head) and hump(15) (tail) by ' +
    'the same method, does that ratio keep accelerating past 4.59 or begin to bend? Measurement only; ' +
    'inherited component model NOT rigorous; reuse-gated against imp-33809/imp-34532; no QED.',
  measuredQuantity:
    'hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma recomputed at k = 3 (head) and k = 15 (tail); at ' +
    'symmetric offset j = 6 from the k = 9 peak: skew(6) = hump(3)/hump(15), asym(6), headFrac(6), ' +
    'tailFrac(6); plus the successive-skew ratio skew(j+1)/skew(j) across the full j = 1..6 ladder',
  crossoverDecadeK: CROSSOVER_K,
  humpPeak: +PEAK.toExponential(4), // 6.4758e-2 (recomputed, matches imp-33809)
  j6ExtensionAmplitudes: {
    hump3: +HUMP3.toExponential(4), // 6.3935e-2 (head, nearly the peak)
    hump15: +HUMP15.toExponential(4), // 2.9795e-4 (recomputed tail)
    hump4: +HUMP4.toExponential(4), // 4.5516e-2 (imp-34532)
    hump14: +HUMP14.toExponential(4), // 9.0441e-4 (imp-34532 tail)
    headLocalMinK6: +IMP33809_HUMPS[0].toExponential(4), // 2.3886e-2 local min: head re-rises above k=6
  },
  j6Rung: {
    offset: 6,
    headK: 3,
    tailK: 15,
    headHump: +HUMP3.toExponential(4),
    tailHump: +HUMP15.toExponential(4),
    headFrac: HEAD_FRAC6, // 0.9873
    tailFrac: TAIL_FRAC6, // 0.0046
    skew: SKEW6, // 214.5843
    asym: ASYM6, // 0.9907
  },
  fullSkewLadder: FULL_SKEW, // {1.2176,1.5759,3.0425,10.9549,50.327,214.5843} for j = 1..6
  fullAsymmetryLadder: FULL_ASYM, // {0.0981,0.2236,0.5053,0.8327,0.961,0.9907} for j = 1..6
  successiveSkewRatios: SKEW_STEP_RATIOS, // {1.2942,1.9307,3.6006,4.594,4.2638}: the ratio BENDS at j=6
  newStepRatio: NEW_STEP_RATIO, // 4.2638 = skew(6)/skew(5)
  priorStepRatio: PRIOR_STEP_RATIO, // 4.594 = skew(5)/skew(4)
  finding: {
    F1_skew_keeps_diverging:
      'skew(6) = hump(3)/hump(15) = 214.58, far above skew(5) = 50.33; the envelope is ' +
      'overwhelmingly head-heavy by j = 6 (head ~215x the tail at equal offset).',
    F2_successive_ratio_bends_no_longer_accelerating:
      'the successive-skew ratio skew(j+1)/skew(j) = {1.294, 1.931, 3.600, 4.594, 4.264} -- the new ' +
      'j = 5 -> 6 rung 4.264 is BELOW the prior 4.594, so the acceleration imp-34532 saw out to j = 5 ' +
      'TURNS OVER at j = 6: the ratio bends rather than continuing to grow.',
    F3_asymmetry_index_keeps_approaching_one:
      'asym(6) = 0.9907 (> asym(5) = 0.9610, < 1), continuing the monotone climb toward its ceiling ' +
      'of complete head-dominance; by j = 6 the head carries ~214x the tail ((1+0.9907)/(1-0.9907)).',
    F4_bend_driven_by_head_saturation_only_tail_still_collapses:
      'headFrac(6) = hump(3)/hump(9) = 0.9873 (nearly the full peak -- the head re-rise has saturated ' +
      'at the crossover amplitude and can rise no further) while tailFrac(6) = hump(15)/hump(9) = ' +
      '0.0046 (still shrinking as sigma_hi -> 0). At earlier offsets BOTH the vanishing tail AND the ' +
      're-rising head fed the acceleration (imp-34532 E3); at j = 6 only the tail collapse remains a ' +
      'driver, so the successive-skew ratio bends instead of accelerating.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-33809 curvature-hump ' +
    'amplitude hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma at the head rung k = 3 (6.3935e-2, nearly ' +
    'the peak) and the tail rung k = 15 (2.9795e-4) -- reuse-gated against the imp-33809 k = 6..13 ' +
    'ladder plus the imp-34532 k = 4,5,14 rungs -- extends the head-heavy skew ladder to j = 6: ' +
    'skew(j) = hump(9-j)/hump(9+j) = {1.2176, 1.5759, 3.0425, 10.9549, 50.327, 214.5843} for ' +
    'j = 1..6. The skew keeps DIVERGING (skew(6) = 214.58) and the asymmetry index keeps approaching ' +
    'its ceiling (asym(6) = 0.9907 < 1), BUT the successive-skew ratio skew(j+1)/skew(j) = {1.294, ' +
    '1.931, 3.600, 4.594, 4.264} now BENDS -- the new j = 5 -> 6 rung 4.264 falls below the prior ' +
    '4.594, so the acceleration imp-34532 reported out to j = 5 does NOT persist. The bend is because ' +
    'the head re-rise has SATURATED at the crossover amplitude (headFrac(6) = 0.9873, hump(3) ~ ' +
    'hump(9)) and can no longer speed up the ratio, leaving only the tail collapse (tailFrac(6) = ' +
    '0.0046 as sigma_hi -> 0) as a driver -- one of the two imp-34532 E3 mechanisms is now exhausted. ' +
    'This is a measurement of the inherited component model in the deep collision-dominated ' +
    '(sigma -> 1) regime where the imp-3220/imp-3406 extrapolation is least trustworthy, not a ' +
    'rigorous asymptotic. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34532 (head-heavy skew ladder j = 1..5, extended here to j = 6); imp-33851 (original skew ' +
    'ladder j = 1..3); imp-33809 (per-k hump amplitudes + method, reuse-gated here); imp-34528 (tail ' +
    'k > 9 collapse vs sqrt(1/N)); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_mb ' +
    'GUE-conditional); imp-3066 (K_a >= 0 untouched); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6_ASSERTIONS = [
  {
    // (Reuse gate) Recomputing k = 6..13 by the same method reproduces the imp-33809 amplitudes,
    // and the recomputed k = 9 peak is the crossover amplitude 6.4758e-2.
    id: 'imp34545-reuse-gate-matches-imp33809',
    description: 'recomputed hump(k) for k = 6..13 matches the imp-33809 humpAmplitudes to <5e-4; peak ~6.4758e-2',
    holds: () =>
      RECOMPUTED_6_13.every((v, i) => Math.abs(v - IMP33809_HUMPS[i]) < 5e-4) &&
      Math.abs(PEAK - 6.4758e-2) < 5e-4,
  },
  {
    // (Continuity) The recomputed j = 1..5 skews reproduce the imp-34532 ladder.
    id: 'imp34545-continuity-with-imp34532-j15',
    description: 'recomputed skew(1..5) reproduces the imp-34532 ladder {1.2176,1.5758,3.0426,10.9549,50.3270} to <5e-2',
    holds: () =>
      [1.2176, 1.5758, 3.0426, 10.9549, 50.327].every((v, i) => Math.abs(FULL_SKEW[i] - v) < 5e-2),
  },
  {
    // (F1) The head-heavy skew keeps diverging at j = 6.
    id: 'imp34545-skew6-keeps-diverging',
    description: 'skew(6) = 214.58 > skew(5) = 50.33; head ~215x tail at offset j = 6',
    holds: () => SKEW6 > FULL_SKEW[4] && Math.abs(SKEW6 - 214.5843) < 5e-1,
  },
  {
    // (F2) The KEY finding: the successive-skew ratio BENDS at j = 6 (does not keep accelerating).
    id: 'imp34545-successive-ratio-bends-at-j6',
    description: 'skew(6)/skew(5) = 4.2638 < skew(5)/skew(4) = 4.594: the successive-skew ratio bends, acceleration turns over',
    holds: () =>
      NEW_STEP_RATIO < PRIOR_STEP_RATIO &&
      Math.abs(NEW_STEP_RATIO - 4.2638) < 5e-3 &&
      Math.abs(PRIOR_STEP_RATIO - 4.594) < 5e-3,
  },
  {
    // (F3) The asymmetry index keeps climbing toward its ceiling of 1.
    id: 'imp34545-asym6-approaches-one',
    description: 'asym(6) = 0.9907 > asym(5) = 0.9610, still < 1 (monotone climb toward complete head-dominance)',
    holds: () =>
      ASYM6 > FULL_ASYM[4] && ASYM6 < 1 && Math.abs(ASYM6 - 0.9907) < 5e-4,
  },
  {
    // (F4) The bend is driven by head-re-rise saturation: headFrac(6) nearly 1 while the tail still collapses.
    id: 'imp34545-head-saturates-tail-collapses',
    description: 'headFrac(6) = 0.9873 (head re-rise near the peak, hump(3) < hump(9)) while tailFrac(6) = 0.0046 (tail still shrinking)',
    holds: () =>
      HEAD_FRAC6 > 0.98 &&
      HEAD_FRAC6 < 1 &&
      HUMP3 < PEAK &&
      HUMP3 > HUMP4 &&
      TAIL_FRAC6 < 0.01 &&
      HUMP15 < HUMP14 &&
      Math.abs(HUMP3 - 6.3935e-2) < 5e-4 &&
      Math.abs(HUMP15 - 2.9795e-4) < 5e-5,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34545-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6.isRigorous === false &&
      IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6.verdict) &&
      /refereed bound is changed/i.test(IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6.verdict),
  },
];

for (const a of IMP34545_HUMP_SKEW_HEADSIDE_EXTENSION_J6_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34545-hump-skew-headside-extension-j6 assertion failed: ${a.id}`);
  }
}
