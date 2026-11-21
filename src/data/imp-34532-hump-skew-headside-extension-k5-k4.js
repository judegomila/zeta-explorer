/**
 * @module imp-34532-hump-skew-headside-extension-k5-k4
 *
 * imp-34532 (numerical, frontier-direction): imp-33851 measured the head-heavy skew of the M3
 * saturation-curvature hump envelope about the k = 9 (E_coll = E_trunc) crossover only out to
 * offset j = 3 (skew 1.2176 -> 1.5758 -> 3.0426), because the imp-33809 per-k amplitude ladder
 * starts at k = 6 -- exactly one decade past j = 3 on the head side. This module EXTENDS the head
 * side by recomputing the imp-33809 curvature-hump amplitude hump(k) = p_ecoll*(1 - sigma_hi) -
 * p_sigma (identical inherited imp-3220/imp-3406 parts, no fresh model) at k = 5 and k = 4, pairs
 * them with the tail decades k = 13 (already in the imp-33809 ladder) and k = 14 (recomputed here),
 * and measures skew(4), skew(5), asym(4), asym(5) to test whether the head-heavy skew keeps climbing
 * its 1.22 -> 3.04 ramp or saturates further out from the peak.
 *
 * THE HEAD-SIDE EXTENSION (imp-33809 method, recomputed verbatim -- no fresh model)
 * -------------------------------------------------------------------------------
 *   Same sub-terms as imp-33809/imp-33773 (no re-derivation): sigma = E_coll/(E_trunc+E_flow+E_coll),
 *   E_trunc = 3.06e-5, E_coll = C_C sqrt(logT0/N), E_flow = C_F (logT0/T0) Gronwall; per decade
 *   p_sigma = -slope OLS(ln sigma vs ln N, 4 pts/decade), p_ecoll = -d log E_coll / d log N over
 *   endpoints, hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma. A REUSE GATE recomputes k = 6..13 and
 *   checks it reproduces the imp-33809 humpAmplitudes verbatim; the new rungs are:
 *     hump(5) = 2.9671e-2, hump(4) = 4.5516e-2 (head side, k < 6),
 *     hump(14) = 9.0441e-4 (tail side, one decade past the imp-33809 k = 13 tail).
 *   Peak hump(9) = 6.4758e-2 (reused). Head-side note: below the k = 6 LOCAL MINIMUM 2.3886e-2 the
 *   hump RE-RISES (hump(6) < hump(5) < hump(4)), so the head amplitude is NON-MONOTONE deep in the
 *   collision-dominated (sigma -> 1) regime -- see the honesty caveat below.
 *
 * THE MEASUREMENT (measurement only -- extends the imp-33851 skew ladder to j = 4,5)
 * --------------------------------------------------------------------------------
 *   For symmetric offset j from the k = 9 peak: skew(j) = hump(9-j)/hump(9+j) (>1 = head-heavy),
 *   asym(j) = (hump(9-j)-hump(9+j))/(hump(9-j)+hump(9+j)), headFrac(j) = hump(9-j)/hump(9),
 *   tailFrac(j) = hump(9+j)/hump(9).
 *
 *   (E1) THE HEAD-HEAVY SKEW DOES NOT SATURATE -- IT ACCELERATES. Continuing the imp-33851 ladder,
 *        skew(j) = {1.2176, 1.5758, 3.0426, 10.9549, 50.3270} for j = 1..5. The j = 4,5 rungs are
 *        FAR above the 1.22 -> 3.04 head, and the successive-skew ratio itself GROWS: skew(j+1)/
 *        skew(j) = {1.294, 1.931, 3.600, 4.594}, so the climb is not merely continuing but speeding
 *        up. The envelope becomes overwhelmingly head-heavy by j = 5 (head ~50x the tail at equal
 *        offset). NO saturation is seen out to j = 5.
 *   (E2) THE ASYMMETRY INDEX SATURATES TOWARD 1 (COMPLETE HEAD-DOMINANCE). asym(j) = {0.0981,
 *        0.2236, 0.5053, 0.8327, 0.9610} for j = 1..5 -- monotonically increasing and approaching
 *        1 (the limit skew -> infinity). By j = 5 the head carries (1+0.961)/(1-0.961) ~ 50x the
 *        tail. So while the SKEW ratio diverges, the bounded asymmetry index is heading to its
 *        ceiling of complete head-dominance.
 *   (E3) THE ACCELERATION IS DRIVEN BY THE TAIL COLLAPSING AND THE HEAD RE-RISING. tailFrac(j) =
 *        hump(9+j)/hump(9) = {..., 0.0418, 0.0140} for j = 4,5 (tail k = 13,14 -> 2.7085e-3,
 *        9.0441e-4, near zero as sigma_hi -> 0), while headFrac(j) = hump(9-j)/hump(9) = {...,
 *        0.4582, 0.7029} for j = 4,5 RISES back toward the peak because the head hump re-rises below
 *        its k = 6 local minimum. So the j = 4,5 skew explosion is BOTH the E_trunc-dominated tail
 *        vanishing AND the deep collision-dominated head re-strengthening -- not a single mechanism.
 *
 * The punchline: imp-33851 stopped the head-heavy skew ladder at j = 3 (skew 3.04) only because the
 * imp-33809 amplitude table started at k = 6. Recomputing the head side at k = 5,4 (and the tail at
 * k = 14) shows the skew does NOT saturate -- it ACCELERATES to skew(4) = 10.95, skew(5) = 50.33
 * (successive ratio growing 1.29 -> 4.59), with the asymmetry index climbing 0.505 -> 0.833 -> 0.961
 * toward its ceiling of 1. The imp-33851 "head-heavy, growing with offset" verdict strengthens far
 * out from the peak, though at j = 4,5 the growth is carried jointly by the vanishing tail and a
 * re-rising deep-head amplitude in the collision-dominated (sigma -> 1) regime where the inherited
 * component model is least trustworthy.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Recomputes the imp-33809 hump amplitudes by the same method
 * (reuse-gated against the k = 6..13 ladder); the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic, and the k = 4,5 head rungs push it into the deep
 * collision-dominated (sigma -> 1) regime where it is least tuned; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33851-hump-envelope-symmetry-vs-k (head-heavy skew ladder j=1..3, extended here to j=4,5)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes + method, reuse-gated here)
 * @see imp-34527-hump-skew-growth-law-vs-decay-asymmetry (log-linear skew-growth fit extrapolating j=4)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33809/imp-33727/imp-33773 exactly

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

// Reuse-gate ladder: recompute k = 6..13 and compare against the imp-33809 stored amplitudes.
const RECOMPUTED_6_13 = [6, 7, 8, 9, 10, 11, 12, 13].map((k) => humpAt(k));
const IMP33809_HUMPS = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpAmplitudes; // k = 6..13

// The head extension (k = 5,4) and the extra tail decade (k = 14), recomputed by the same method.
const HUMP5 = humpAt(5); // head, one decade below the imp-33809 k = 6 head edge
const HUMP4 = humpAt(4); // head, two decades below the k = 6 head edge
const HUMP13 = humpAt(13); // tail (already in the imp-33809 ladder), pairs with head k = 5
const HUMP14 = humpAt(14); // tail, one decade past the imp-33809 k = 13 tail, pairs with head k = 4

// Extended symmetric offsets j = 4 (head k = 5 vs tail k = 13) and j = 5 (head k = 4 vs tail k = 14).
const EXTENDED_LADDER = [
  { offset: 4, headK: 5, tailK: 13, head: HUMP5, tail: HUMP13 },
  { offset: 5, headK: 4, tailK: 14, head: HUMP4, tail: HUMP14 },
].map(({ offset, headK, tailK, head, tail }) => ({
  offset,
  headK,
  tailK,
  headHump: +head.toExponential(4),
  tailHump: +tail.toExponential(4),
  headFrac: +(head / PEAK).toFixed(4), // hump(9-j)/hump(9)
  tailFrac: +(tail / PEAK).toFixed(4), // hump(9+j)/hump(9)
  skew: +(head / tail).toFixed(4), // head-over-tail at equal offset (>1 = head-heavy)
  asym: +((head - tail) / (head + tail)).toFixed(4), // signed asymmetry index
}));

// Full skew / asymmetry ladders j = 1..5 (imp-33851 j = 1,2,3 recomputed here for continuity).
const SKEW_J123 = [1, 2, 3].map((j) => humpAt(9 - j) / humpAt(9 + j));
const ASYM_J123 = [1, 2, 3].map((j) => {
  const h = humpAt(9 - j);
  const t = humpAt(9 + j);
  return (h - t) / (h + t);
});
const FULL_SKEW = [...SKEW_J123, HUMP5 / HUMP13, HUMP4 / HUMP14].map((v) => +v.toFixed(4));
const FULL_ASYM = [
  ...ASYM_J123,
  (HUMP5 - HUMP13) / (HUMP5 + HUMP13),
  (HUMP4 - HUMP14) / (HUMP4 + HUMP14),
].map((v) => +v.toFixed(4));
// Successive-skew ratios skew(j+1)/skew(j) -- growing => the climb accelerates, not saturates.
const SKEW_STEP_RATIOS = FULL_SKEW.slice(1).map((v, i) => +(v / FULL_SKEW[i]).toFixed(4));

const SKEW4 = EXTENDED_LADDER[0].skew; // 10.9549
const SKEW5 = EXTENDED_LADDER[1].skew; // 50.3270
const ASYM4 = EXTENDED_LADDER[0].asym; // 0.8327
const ASYM5 = EXTENDED_LADDER[1].asym; // 0.9610

export const IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4 = {
  id: 'imp-34532',
  proofSection: 'S-frontier',
  question:
    'imp-33851 measured the head-heavy skew of the M3 hump envelope only to offset j = 3 (skew ' +
    '1.2176 -> 1.5758 -> 3.0426) because the imp-33809 amplitude ladder starts at k = 6. Recomputing ' +
    'the head side at k = 5,4 (and the tail at k = 14) by the same method, does the head-heavy skew ' +
    'keep climbing at j = 4,5 or saturate? Measurement only; inherited component model NOT rigorous; ' +
    'reuse-gated against imp-33809; changes no bound; no QED.',
  measuredQuantity:
    'hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma recomputed at k = 5,4 (head) and k = 14 (tail); at ' +
    'symmetric offsets j = 4,5 from the k = 9 peak: skew(j) = hump(9-j)/hump(9+j), asym(j) = ' +
    '(hump(9-j)-hump(9+j))/(hump(9-j)+hump(9+j)), headFrac(j), tailFrac(j); plus the successive-skew ' +
    'ratio skew(j+1)/skew(j) across the full j = 1..5 ladder',
  crossoverDecadeK: CROSSOVER_K,
  humpPeak: +PEAK.toExponential(4), // 6.4758e-2 (recomputed, matches imp-33809)
  headExtensionAmplitudes: {
    hump5: +HUMP5.toExponential(4), // 2.9671e-2
    hump4: +HUMP4.toExponential(4), // 4.5516e-2
    hump13: +HUMP13.toExponential(4), // 2.7085e-3 (imp-33809 tail)
    hump14: +HUMP14.toExponential(4), // 9.0441e-4 (recomputed tail)
    headLocalMinK6: +IMP33809_HUMPS[0].toExponential(4), // 2.3886e-2 local min: head re-rises below k=6
  },
  extendedLadder: EXTENDED_LADDER,
  fullSkewLadder: FULL_SKEW, // {1.2176, 1.5758, 3.0426, 10.9549, 50.3270} for j = 1..5
  fullAsymmetryLadder: FULL_ASYM, // {0.0981, 0.2236, 0.5053, 0.8327, 0.9610} for j = 1..5
  successiveSkewRatios: SKEW_STEP_RATIOS, // {1.294, 1.931, 3.600, 4.594}: the climb ACCELERATES
  finding: {
    E1_skew_does_not_saturate_it_accelerates:
      'skew(j) = hump(9-j)/hump(9+j) = {1.2176, 1.5758, 3.0426, 10.9549, 50.3270} for j = 1..5; the ' +
      'j = 4,5 rungs are far above the imp-33851 1.22 -> 3.04 head, and the successive-skew ratio ' +
      'skew(j+1)/skew(j) = {1.294, 1.931, 3.600, 4.594} itself GROWS, so the head-heavy climb is ' +
      'accelerating, not saturating, out to j = 5.',
    E2_asymmetry_index_saturates_toward_one:
      'asym(j) = {0.0981, 0.2236, 0.5053, 0.8327, 0.9610} for j = 1..5 -- monotonically increasing ' +
      'toward its ceiling of 1 (the skew -> infinity limit); by j = 5 the head carries ~50x the tail ' +
      'at equal offset ((1+0.961)/(1-0.961)).',
    E3_driven_by_tail_collapse_and_head_rerise:
      'the acceleration is BOTH mechanisms: tailFrac(j) = hump(9+j)/hump(9) = {0.0418, 0.0140} for ' +
      'j = 4,5 (tail k = 13,14 near zero as sigma_hi -> 0) AND headFrac(j) = {0.4582, 0.7029} RISES ' +
      'because the head hump re-rises below its k = 6 local minimum (hump(6) = 2.3886e-2 < hump(5) = ' +
      '2.9671e-2 < hump(4) = 4.5516e-2) -- so the head amplitude is non-monotone in the deep ' +
      'collision-dominated (sigma -> 1) regime where the inherited model is least trustworthy.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-33809 curvature-hump ' +
    'amplitude hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma at the head rungs k = 5,4 and the tail rung ' +
    'k = 14 (reuse-gated against the imp-33809 k = 6..13 ladder) extends the imp-33851 head-heavy ' +
    'skew ladder to j = 4,5: skew(j) = hump(9-j)/hump(9+j) = {1.2176, 1.5758, 3.0426, 10.9549, ' +
    '50.3270} for j = 1..5. The skew does NOT saturate -- it ACCELERATES: the successive-skew ratio ' +
    'skew(j+1)/skew(j) = {1.294, 1.931, 3.600, 4.594} itself grows, and the bounded asymmetry index ' +
    'asym(j) = {0.0981, 0.2236, 0.5053, 0.8327, 0.9610} climbs monotonically toward its ceiling of 1 ' +
    '(head ~50x tail by j = 5). The imp-33851 head-heavy verdict thus strengthens far from the peak. ' +
    'Honestly, the j = 4,5 growth is carried JOINTLY by the E_trunc-dominated tail vanishing ' +
    '(tailFrac 0.0418, 0.0140 as sigma_hi -> 0) AND a deep-head amplitude RE-RISING below its k = 6 ' +
    'local minimum (hump(6) < hump(5) < hump(4)), so the head hump is non-monotone in the collision- ' +
    'dominated (sigma -> 1) regime where the inherited imp-3220/imp-3406 extrapolation is least ' +
    'trustworthy -- this is a measurement of the inherited component model, not a rigorous asymptotic. ' +
    'The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33851 (head-heavy skew ladder j = 1..3, extended here to j = 4,5); imp-33809 (per-k hump ' +
    'amplitudes + method, reuse-gated here); imp-34527 (log-linear skew-growth fit extrapolating ' +
    'j = 4); imp-34528 (tail k > 9 collapse vs sqrt(1/N)); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-3066 (K_a >= 0 untouched); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4_ASSERTIONS = [
  {
    // (Reuse gate) Recomputing k = 6..13 by the same method reproduces the imp-33809 amplitudes,
    // and the recomputed k = 9 peak is the crossover amplitude 6.4758e-2.
    id: 'imp34532-reuse-gate-matches-imp33809',
    description: 'recomputed hump(k) for k = 6..13 matches the imp-33809 humpAmplitudes to <5e-4; peak ~6.4758e-2',
    holds: () =>
      RECOMPUTED_6_13.every((v, i) => Math.abs(v - IMP33809_HUMPS[i]) < 5e-4) &&
      Math.abs(PEAK - 6.4758e-2) < 5e-4,
  },
  {
    // (Continuity) The recomputed j = 1,2,3 skews reproduce the imp-33851 ladder {1.2176,1.5758,3.0426}.
    id: 'imp34532-continuity-with-imp33851-j123',
    description: 'recomputed skew(1,2,3) reproduces the imp-33851 head-heavy ladder {1.2176,1.5758,3.0426} to <1e-3',
    holds: () =>
      [1.2176, 1.5758, 3.0426].every((v, i) => Math.abs(FULL_SKEW[i] - v) < 1e-3),
  },
  {
    // (E1) The head-heavy skew does NOT saturate at j = 4,5: it keeps climbing and the climb accelerates.
    id: 'imp34532-skew-does-not-saturate-accelerates',
    description: 'skew(4) = 10.9549 > skew(3), skew(5) = 50.3270 > skew(4); successive-skew ratio grows (accelerating)',
    holds: () =>
      SKEW4 > FULL_SKEW[2] &&
      SKEW5 > SKEW4 &&
      Math.abs(SKEW4 - 10.9549) < 5e-3 &&
      Math.abs(SKEW5 - 50.327) < 5e-2 &&
      SKEW_STEP_RATIOS.every((r, i) => i === 0 || r > SKEW_STEP_RATIOS[i - 1]),
  },
  {
    // (E2) The asymmetry index continues rising toward its ceiling of 1 (all < 1, monotone up).
    id: 'imp34532-asymmetry-rises-toward-one',
    description: 'asym(4) = 0.8327, asym(5) = 0.9610, both < 1, > asym(3) = 0.5053, monotonically increasing',
    holds: () =>
      ASYM4 > FULL_ASYM[2] &&
      ASYM5 > ASYM4 &&
      ASYM5 < 1 &&
      Math.abs(ASYM4 - 0.8327) < 5e-4 &&
      Math.abs(ASYM5 - 0.961) < 5e-4 &&
      FULL_ASYM.every((a, i) => i === 0 || a > FULL_ASYM[i - 1]),
  },
  {
    // (E3) The head hump is NON-MONOTONE below the k = 6 local minimum: hump(6) < hump(5) < hump(4),
    // so the head re-rises deep in the collision-dominated regime (part of the skew acceleration).
    id: 'imp34532-head-rerises-below-k6-minimum',
    description: 'head hump re-rises below its k = 6 local minimum: hump(6) < hump(5) < hump(4)',
    holds: () =>
      IMP33809_HUMPS[0] < HUMP5 &&
      HUMP5 < HUMP4 &&
      Math.abs(HUMP5 - 2.9671e-2) < 5e-4 &&
      Math.abs(HUMP4 - 4.5516e-2) < 5e-4,
  },
  {
    // (E3) The tail collapses toward zero at the extended offsets (tailFrac shrinking, sigma_hi -> 0).
    id: 'imp34532-tail-collapses-at-extended-offsets',
    description: 'tailFrac(4) = 0.0418 > tailFrac(5) = 0.0140, both small; tail hump(14) = 9.0441e-4 < hump(13)',
    holds: () =>
      EXTENDED_LADDER[0].tailFrac > EXTENDED_LADDER[1].tailFrac &&
      EXTENDED_LADDER[1].tailFrac < 0.02 &&
      HUMP14 < HUMP13 &&
      Math.abs(HUMP14 - 9.0441e-4) < 5e-5,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34532-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.isRigorous === false &&
      IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.verdict) &&
      /refereed bound is changed/i.test(IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4.verdict),
  },
];

for (const a of IMP34532_HUMP_SKEW_HEADSIDE_EXTENSION_K5_K4_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34532-hump-skew-headside-extension-k5-k4 assertion failed: ${a.id}`);
  }
}
