/**
 * @module imp-34544-hump-headside-minimum-locate-deephead-k3-k2
 *
 * imp-34544 (numerical, frontier-direction): imp-34532 recomputed the imp-33809 curvature-hump
 * amplitude hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma at the head rungs k = 5,4 and found the head
 * side is NON-MONOTONE: below the k = 6 LOCAL MINIMUM (2.3886e-2) the hump RE-RISES
 * (hump(6) < hump(5) < hump(4)) in the collision-dominated (sigma -> 1) regime. imp-34532 flagged
 * two open sub-questions it never resolved: (i) the head-side local minimum was never LOCATED
 * (it was only bracketed at the integer decade k = 6), and (ii) whether the deep-head re-rise keeps
 * climbing toward k = 3 or itself turns over. This module resolves BOTH by treating hump(k) as a
 * continuous function of the (real-valued) decade exponent k -- identical inherited imp-3220/imp-3406
 * sub-terms, no fresh model.
 *
 * THE METHOD (imp-33809 hump(k), recomputed verbatim -- no fresh model)
 * --------------------------------------------------------------------
 *   Same sub-terms as imp-33809/imp-34532 (no re-derivation): sigma = E_coll/(E_trunc+E_flow+E_coll),
 *   E_trunc = 3.06e-5, E_coll = C_C sqrt(logT0/N), E_flow = C_F (logT0/T0) Gronwall; per decade
 *   p_sigma = -slope OLS(ln sigma vs ln N, 4 pts/decade), p_ecoll = -d log E_coll over d log N over
 *   endpoints, hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma. Because every sub-term is a smooth function
 *   of N = 10^k, hump(k) extends continuously to real k; the central-difference derivative
 *   dhump(k) = (hump(k+h) - hump(k-h))/(2h), h = 1e-4, is bisected for its sign changes. A REUSE GATE
 *   recomputes k = 4,5,6 and checks it reproduces the imp-33809/imp-34532 amplitudes verbatim.
 *
 * THE MEASUREMENT (measurement only)
 * ----------------------------------
 *   (A) THE HEAD-SIDE LOCAL MINIMUM IS AT k ~ 5.937, NOT THE INTEGER DECADE k = 6. Bisecting the
 *       central-difference derivative between k = 5 (dhump < 0) and k = 7 (dhump > 0) locates the
 *       minimum at k* = 5.9371 with hump(k*) = 2.3857e-2 -- fractionally below the integer-decade
 *       value hump(6) = 2.3886e-2 that imp-33809/imp-34532 reported as "the k = 6 local minimum". So
 *       the true head minimum sits just inside the sixth decade, and 2.3886e-2 is a near-exact upper
 *       bound on it (the two differ only at the 4th significant figure).
 *   (B) hump(3) = 6.3935e-2, hump(2) = 7.1352e-2, hump(1) = 5.5040e-2 (recomputed, reuse-gated). The
 *       deep-head re-rise below k* keeps climbing through k = 4,3,2: hump(5) = 2.9671e-2 <
 *       hump(4) = 4.5516e-2 < hump(3) = 6.3935e-2 < hump(2) = 7.1352e-2.
 *   (C) THE DEEP-HEAD RE-RISE DOES NOT KEEP ACCELERATING -- IT TURNS OVER, AND OVERSHOOTS THE
 *       CROSSOVER PEAK. The per-decade re-rise increment hump(k-1) - hump(k) GROWS
 *       {5.7853e-3, 1.5845e-2, 1.8418e-2} over k = 6->5, 5->4, 4->3 (accelerating), then FALLS to
 *       7.4176e-3 over k = 3->2 (decelerating), and turns negative below k = 2: bisecting dhump
 *       between k = 1 (dhump > 0) and k = 3 (dhump < 0) locates a deep-head LOCAL MAXIMUM at
 *       k = 2.1365 with hump = 7.1587e-2. That deep-head maximum OVERSHOOTS the k = 9 crossover peak
 *       hump(9) = 6.4758e-2 by a factor of 1.1055. So the head amplitude has BOTH a local minimum
 *       (k ~ 5.937) and, deeper in, a local maximum (k ~ 2.137) that exceeds the crossover peak --
 *       the re-rise does NOT run away; it peaks and turns over.
 *
 * The punchline: imp-34532 left the head-side minimum only bracketed at k = 6 and the deep-head
 * re-rise untested past k = 4. Locating the derivative zeros shows (A) the minimum is at k* = 5.937
 * (hump 2.3857e-2, just below the integer-decade 2.3886e-2), and (C) the re-rise ACCELERATES to
 * k = 3 but then TURNS OVER at a deep-head local maximum k = 2.137 (hump 7.1587e-2) that OVERSHOOTS
 * the k = 9 crossover peak by 10.5%. So the head hump is a double-turning curve -- min then max -- not
 * a runaway climb. This all lives in the deep collision-dominated (sigma -> 1) regime (sigma_hi ~ 0.86
 * at k = 2) where the inherited imp-3220/imp-3406 component model is LEAST trustworthy; state honestly.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Recomputes the imp-33809 hump amplitudes by the same method
 * (reuse-gated against k = 4,5,6); the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic, and the k = 3,2,1 head rungs push it into the deep
 * collision-dominated (sigma -> 1) regime where it is least tuned; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34532-hump-skew-headside-extension-k5-k4 (head re-rise noted at k=5,4; minimum never located)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes + method, reuse-gated here)
 * @see imp-33851-hump-envelope-symmetry-vs-k (head-heavy skew ladder about the k=9 crossover)
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

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll over d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma over the decade [10^k, 10^(k+1)] (imp-33809 M3 residual).
// Continuous in real k because every sub-term is smooth in N = 10^k.
function humpAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

// Central-difference derivative of hump wrt the decade exponent k.
const DH = 1e-4;
const dHumpAt = (k) => (humpAt(k + DH) - humpAt(k - DH)) / (2 * DH);

// Bisect the central-difference derivative on [aa, bb] for its zero (dHumpAt(aa) and dHumpAt(bb)
// must straddle zero). Returns the interior k where dhump = 0.
function bisectDerivativeZero(aa, bb) {
  let a = aa;
  let b = bb;
  let fa = dHumpAt(a);
  for (let i = 0; i < 100; i++) {
    const m = (a + b) / 2;
    const fm = dHumpAt(m);
    if (fa * fm <= 0) {
      b = m;
    } else {
      a = m;
      fa = fm;
    }
  }
  return (a + b) / 2;
}

const CROSSOVER_K = 9;
const PEAK = humpAt(CROSSOVER_K); // hump(9) = 6.4758e-2 (recomputed, matches imp-33809)

// (A) Head-side local MINIMUM: derivative goes - to + between k = 5 and k = 7.
const K_MIN = bisectDerivativeZero(5, 7); // ~5.9371
const HUMP_MIN = humpAt(K_MIN); // ~2.3857e-2

// (C) Deep-head local MAXIMUM: derivative goes + to - between k = 1 and k = 3.
const K_MAX = bisectDerivativeZero(1, 3); // ~2.1365
const HUMP_MAX = humpAt(K_MAX); // ~7.1587e-2
const OVERSHOOT_RATIO = HUMP_MAX / PEAK; // ~1.1055 (deep-head max overshoots the crossover peak)

// Reuse-gate: recompute k = 4,5,6 and compare against imp-33809/imp-34532 values.
const HUMP6 = humpAt(6); // 2.3886e-2 (imp-33809 integer-decade "local minimum")
const HUMP5 = humpAt(5); // 2.9671e-2 (imp-34532)
const HUMP4 = humpAt(4); // 4.5516e-2 (imp-34532)
const IMP33809_HUMP6 = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpAmplitudes[0]; // 2.3886e-2

// (B) New deep-head rungs recomputed by the identical method.
const HUMP3 = humpAt(3); // 6.3935e-2
const HUMP2 = humpAt(2); // 7.1352e-2
const HUMP1 = humpAt(1); // 5.5040e-2

// (C) Per-decade re-rise increments hump(k-1) - hump(k) below the minimum: grow then fall (turnover).
const RERISE_INCREMENTS = [
  +(HUMP5 - HUMP6).toExponential(4), // k 6->5
  +(HUMP4 - HUMP5).toExponential(4), // k 5->4
  +(HUMP3 - HUMP4).toExponential(4), // k 4->3
  +(HUMP2 - HUMP3).toExponential(4), // k 3->2
];

export const IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2 = {
  id: 'imp-34544',
  proofSection: 'S-frontier',
  question:
    'imp-34532 found the M3 curvature-hump head side re-rises below a k = 6 local minimum ' +
    '(hump(6) < hump(5) < hump(4)) but never LOCATED the minimum (only bracketed at k = 6) and never ' +
    'tested whether the deep-head re-rise keeps climbing toward k = 3 or turns over. Treating hump(k) ' +
    'as continuous in the decade exponent k and bisecting its derivative: where is the head minimum, ' +
    'and does the re-rise keep accelerating or turn over? Measurement only; inherited component model ' +
    'NOT rigorous; reuse-gated against imp-33809/imp-34532; changes no bound; no QED.',
  measuredQuantity:
    'the head-side local minimum k* and hump(k*) via bisecting dhump/dk between k = 5,7; recomputed ' +
    'deep-head amplitudes hump(3), hump(2), hump(1); the per-decade re-rise increments hump(k-1) - ' +
    'hump(k); and the deep-head local maximum k** and hump(k**) via bisecting dhump/dk between ' +
    'k = 1,3, plus its overshoot ratio hump(k**)/hump(9) over the crossover peak',
  crossoverDecadeK: CROSSOVER_K,
  humpPeak: +PEAK.toExponential(4), // 6.4758e-2
  headMinimum: {
    kStar: +K_MIN.toFixed(4), // 5.9371 (interior of the sixth decade, NOT the integer k = 6)
    humpAtKStar: +HUMP_MIN.toExponential(4), // 2.3857e-2
    integerDecadeHump6: +HUMP6.toExponential(4), // 2.3886e-2 (imp-33809 near-exact upper bound)
  },
  deepHeadAmplitudes: {
    hump5: +HUMP5.toExponential(4), // 2.9671e-2 (imp-34532)
    hump4: +HUMP4.toExponential(4), // 4.5516e-2 (imp-34532)
    hump3: +HUMP3.toExponential(4), // 6.3935e-2 (new)
    hump2: +HUMP2.toExponential(4), // 7.1352e-2 (new)
    hump1: +HUMP1.toExponential(4), // 5.5040e-2 (new)
  },
  reRiseIncrements: RERISE_INCREMENTS, // {5.7853e-3, 1.5845e-2, 1.8418e-2, 7.4176e-3}: grow then fall
  deepHeadMaximum: {
    kStarStar: +K_MAX.toFixed(4), // 2.1365
    humpAtKStarStar: +HUMP_MAX.toExponential(4), // 7.1587e-2
    overshootRatioOverCrossoverPeak: +OVERSHOOT_RATIO.toFixed(4), // 1.1055
  },
  finding: {
    A_head_minimum_is_at_k_5p937_not_integer_6:
      'bisecting dhump/dk between k = 5 (dhump < 0) and k = 7 (dhump > 0) locates the head-side local ' +
      'minimum at k* = 5.9371 with hump(k*) = 2.3857e-2 -- fractionally below the integer-decade value ' +
      'hump(6) = 2.3886e-2 that imp-33809/imp-34532 reported, so 2.3886e-2 is a near-exact upper bound ' +
      'on the true head minimum (they differ only at the 4th significant figure).',
    B_deep_head_re_rise_climbs_through_k4_k3_k2:
      'the deep-head amplitudes recomputed by the identical method are hump(5) = 2.9671e-2 < hump(4) = ' +
      '4.5516e-2 < hump(3) = 6.3935e-2 < hump(2) = 7.1352e-2, so the re-rise below k* keeps climbing ' +
      'through the third and second decades.',
    C_re_rise_turns_over_and_overshoots_the_crossover_peak:
      'the per-decade re-rise increment hump(k-1) - hump(k) = {5.7853e-3, 1.5845e-2, 1.8418e-2} over ' +
      'k = 6->5, 5->4, 4->3 GROWS (accelerating), then FALLS to 7.4176e-3 over k = 3->2 and turns ' +
      'negative below k = 2: bisecting dhump/dk between k = 1 (dhump > 0) and k = 3 (dhump < 0) locates ' +
      'a deep-head local MAXIMUM at k** = 2.1365 with hump = 7.1587e-2, which OVERSHOOTS the k = 9 ' +
      'crossover peak hump(9) = 6.4758e-2 by a factor of 1.1055. So the re-rise does NOT run away -- ' +
      'the head hump is a double-turning curve (minimum at k ~ 5.937, maximum at k ~ 2.137).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Treating the imp-33809 curvature-hump amplitude ' +
    'hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma as continuous in the decade exponent k and bisecting ' +
    'its central-difference derivative (reuse-gated against the imp-33809/imp-34532 k = 4,5,6 values): ' +
    '(A) the head-side local MINIMUM is at k* = 5.9371 with hump(k*) = 2.3857e-2 -- just inside the ' +
    'sixth decade, below the integer-decade hump(6) = 2.3886e-2 that imp-33809/imp-34532 reported as ' +
    '"the k = 6 minimum". (B) The recomputed deep-head rungs hump(3) = 6.3935e-2, hump(2) = 7.1352e-2, ' +
    'hump(1) = 5.5040e-2 continue the re-rise. (C) The re-rise ACCELERATES to k = 3 (increment ' +
    '{5.7853e-3, 1.5845e-2, 1.8418e-2}) but then TURNS OVER: the increment falls to 7.4176e-3 at ' +
    'k = 3->2 and dhump/dk = 0 again at a deep-head local MAXIMUM k** = 2.1365 (hump = 7.1587e-2) that ' +
    'OVERSHOOTS the k = 9 crossover peak by 10.55%. So the head amplitude is a double-turning curve -- ' +
    'a minimum at k ~ 5.937 then a maximum at k ~ 2.137 -- not a runaway climb. This all sits in the ' +
    'deep collision-dominated (sigma -> 1) regime (sigma_hi ~ 0.86 at k = 2) where the inherited ' +
    'imp-3220/imp-3406 component model is LEAST trustworthy -- this is a measurement of that model, not ' +
    'a rigorous asymptotic. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34532 (head re-rise at k = 5,4, minimum never located); imp-33809 (per-k hump amplitudes + ' +
    'method, reuse-gated here); imp-33851 (head-heavy skew ladder); imp-3444 (E_coll = E_trunc ' +
    'crossover N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-3066 (K_a >= 0 untouched); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2_ASSERTIONS = [
  {
    // (Reuse gate) Recomputing k = 4,5,6 by the same method reproduces the imp-33809/imp-34532 values,
    // and the recomputed k = 9 peak is the crossover amplitude 6.4758e-2.
    id: 'imp34544-reuse-gate-matches-imp33809-imp34532',
    description: 'recomputed hump(6),(5),(4) match imp-33809/imp-34532 to <5e-4; peak ~6.4758e-2',
    holds: () =>
      Math.abs(HUMP6 - IMP33809_HUMP6) < 5e-4 &&
      Math.abs(HUMP5 - 2.9671e-2) < 5e-4 &&
      Math.abs(HUMP4 - 4.5516e-2) < 5e-4 &&
      Math.abs(PEAK - 6.4758e-2) < 5e-4,
  },
  {
    // (A) The head-side local minimum is interior to the sixth decade at k* ~ 5.937, below hump(6).
    id: 'imp34544-head-minimum-at-k5p937',
    description: 'head minimum bisected at k* = 5.9371, hump(k*) = 2.3857e-2 < integer-decade hump(6) = 2.3886e-2',
    holds: () =>
      Math.abs(K_MIN - 5.9371) < 5e-3 &&
      K_MIN > 5 &&
      K_MIN < 6 &&
      Math.abs(HUMP_MIN - 2.3857e-2) < 5e-5 &&
      HUMP_MIN < HUMP6,
  },
  {
    // (B) The deep-head re-rise keeps climbing through k = 4,3,2 (recomputed rungs monotone up).
    id: 'imp34544-deep-head-re-rise-climbs-k4-k3-k2',
    description: 'hump(5) < hump(4) < hump(3) < hump(2); hump(3) = 6.3935e-2, hump(2) = 7.1352e-2, hump(1) = 5.5040e-2',
    holds: () =>
      HUMP5 < HUMP4 &&
      HUMP4 < HUMP3 &&
      HUMP3 < HUMP2 &&
      Math.abs(HUMP3 - 6.3935e-2) < 5e-4 &&
      Math.abs(HUMP2 - 7.1352e-2) < 5e-4 &&
      Math.abs(HUMP1 - 5.504e-2) < 5e-4,
  },
  {
    // (C) The re-rise increment accelerates to k = 3 then decelerates at k = 3->2 (turnover onset).
    id: 'imp34544-re-rise-increment-accelerates-then-turns-over',
    description: 're-rise increments {5.7853e-3, 1.5845e-2, 1.8418e-2, 7.4176e-3}: rise to k=4->3 then fall at k=3->2',
    holds: () =>
      RERISE_INCREMENTS[0] < RERISE_INCREMENTS[1] &&
      RERISE_INCREMENTS[1] < RERISE_INCREMENTS[2] &&
      RERISE_INCREMENTS[3] < RERISE_INCREMENTS[2] &&
      RERISE_INCREMENTS.every((v) => v > 0),
  },
  {
    // (C) The re-rise turns over at a deep-head local maximum k** ~ 2.137 that overshoots the peak.
    id: 'imp34544-deep-head-maximum-overshoots-crossover-peak',
    description: 'deep-head maximum bisected at k** = 2.1365, hump = 7.1587e-2, overshoots hump(9) by 1.1055',
    holds: () =>
      Math.abs(K_MAX - 2.1365) < 5e-3 &&
      K_MAX > 1 &&
      K_MAX < 3 &&
      Math.abs(HUMP_MAX - 7.1587e-2) < 5e-5 &&
      HUMP_MAX > PEAK &&
      Math.abs(OVERSHOOT_RATIO - 1.1055) < 5e-4,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34544-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2.isRigorous === false &&
      IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2.verdict) &&
      /refereed bound is changed/i.test(IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2.verdict),
  },
];

for (const a of IMP34544_HUMP_HEADSIDE_MINIMUM_LOCATE_DEEPHEAD_K3_K2_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34544-hump-headside-minimum-locate-deephead-k3-k2 assertion failed: ${a.id}`);
  }
}
