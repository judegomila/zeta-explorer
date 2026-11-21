/**
 * @module imp-33809-saturation-curvature-hump-vs-k
 *
 * imp-33809 (numerical, frontier-direction): imp-33773 finding M3 concluded the
 * sub-leading p_sigma/p_ecoll offset residual is NOT the near-peak E_flow term but the
 * intra-decade curvature of the (1 - sigma) saturation factor -- the mismatch between the
 * OLS decade-slope p_sigma (which averages the masking factor across the whole decade) and
 * the endpoint-evaluated p_ecoll*(1 - sigma_hi). imp-33773 reported that the residual
 * hump peaks at decade index k = 9, the E_coll = E_trunc crossover decade, but described
 * the hump QUALITATIVELY: it tabulated resid_exp only on the imp-33727 overlap window
 * k = 6..11 and never tracked the amplitude as an explicit function of k, never confirmed
 * k = 9 is the GLOBAL argmax past the overlap window, and never quantified how fast the
 * hump decays on either side of the peak. This module tabulates the curvature-hump
 * amplitude across an EXTENDED decade ladder k = 6..13, confirms the maximum lands at the
 * k = 9 crossover decade, and measures the falloff on each side.
 *
 * THE HUMP AMPLITUDE (identical inherited imp-3220/imp-3406/imp-33773 parts, no fresh model)
 * -----------------------------------------------------------------------------------------
 *   Same sub-terms as imp-33773 (no re-derivation):
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5 (N-independent fixed strip, imp-2631),
 *     E_coll   = C_C_PINNED sqrt(log T0 / N)  (GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398),
 *     T0       = effectiveHeightForN(N).
 *   Per decade [10^k, 10^(k+1)]:
 *     p_sigma  = -slope OLS(ln sigma vs ln N), 4 pts/decade  (imp-33582/imp-33730 defn),
 *     p_ecoll  = -d log E_coll / d log N over the endpoints  (imp-33620/imp-33727 defn),
 *   and the CURVATURE-HUMP AMPLITUDE is the imp-33773 M3 sub-leading residual
 *     hump(k) = p_ecoll * (1 - sigma_hi) - p_sigma,
 *   the amount by which the endpoint-evaluated masking factor overshoots the OLS
 *   decade-averaged slope -- large exactly where sigma has the most intra-decade curvature.
 *
 * THE MEASUREMENT (measurement only -- confirms + quantifies the imp-33773 M3 hump)
 * --------------------------------------------------------------------------------
 *   (H1) THE HUMP PEAKS AT THE k = 9 CROSSOVER DECADE, GLOBALLY over k = 6..13.
 *        hump(k) = {2.3886e-2, 3.2910e-2, 5.4863e-2, 6.4758e-2, 4.5058e-2, 2.0884e-2,
 *        7.8506e-3, 2.7085e-3} for k = 6..13. The maximum is 6.4758e-2 at k = 9 -- the
 *        E_coll = E_trunc crossover decade (sigma 0.6367 -> 0.3697 across [1e9,1e10],
 *        crossing 1/2). Extending two decades past the imp-33727 overlap tail (k = 12, 13)
 *        the hump keeps shrinking, so k = 9 is the true interior argmax, not a
 *        window-edge artifact of the k = 6..11 tabulation.
 *   (H2) THE HUMP IS ASYMMETRIC: GENTLE RISE, ACCELERATING TAIL DECAY. The head-side
 *        step ratios hump(k)/hump(k-1) rising into the peak are {1.378, 1.667, 1.180}
 *        for k = 7,8,9 -- all sub-1.7x and non-monotone. The tail-side decay ratios
 *        hump(k)/hump(k+1) are {1.437, 2.158, 2.660, 2.899} for k = 9,10,11,12 --
 *        monotonically accelerating away from the peak. So the hump falls off FASTER on
 *        the high-N (tail) side than it rises on the low-N (head) side.
 *   (H3) THE TAIL DECAY TRACKS sigma ~ N^(-1/2). The tail decay ratio climbs toward
 *        sqrt(10) ~ 3.1623 (2.66 -> 2.90 for k = 11,12), exactly the per-decade decay of
 *        sigma_hi itself (sigma_hi decade ratios 2.70, 2.91, 3.00 for k = 10,11,12), and
 *        hump(k)/sigma_hi(k) settles into a narrow band 0.28 -> 0.39 across k = 10..13. So
 *        once past the crossover the curvature hump decays proportionally to the residual
 *        saturation sigma_hi ~ sqrt(log N / N), i.e. like N^(-1/2), consistent with the
 *        imp-3463 far-tail sqrt(1/N) picture both exponent ladders ramp toward.
 *
 * The punchline: imp-33773 M3 asserted the saturation-curvature residual peaks at the
 * k = 9 crossover decade; tabulated across an extended ladder, k = 9 is confirmed as the
 * GLOBAL hump argmax (6.4758e-2), the hump is asymmetric (gentle rise, faster tail decay),
 * and its tail falloff tracks sigma ~ N^(-1/2). The imp-33773 M3 attribution stands and is
 * now quantified as a function of k.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Confirms + quantifies the imp-33773 M3 hump, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (M3 curvature-hump asserted, tabulated here)
 * @see imp-33727-sigma-ecoll-exponent-ladder-crossvalidation (offset ladder overlap window k=6..11)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (separated-E_coll exponent ladder)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (full-sigma OLS exponent ladder)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail sqrt(1/N) leading form)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33727/imp-33730/imp-33773 exactly

// EXACT inherited imp-3406/imp-33773 sub-terms (no re-derivation, no fresh model).
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

// Extended ladder: two decades past the imp-33727 overlap tail (k=11) so the k=9 argmax is
// certified as an INTERIOR global maximum, not a window-edge artifact of the k=6..11 span.
const LADDER_DECADES = [6, 7, 8, 9, 10, 11, 12, 13];
const CROSSOVER_K = 9; // E_coll = E_trunc crossover decade (sigma crosses 1/2 in [1e9,1e10])

// hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma = the imp-33773 M3 intra-decade saturation-curvature
// residual: the amount the endpoint masking factor overshoots the OLS decade-averaged slope.
const HUMP_LADDER = LADDER_DECADES.map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  const hump = pEcoll * (1 - sigmaHi) - pSigma;
  return {
    k,
    decade: `1e${k}->1e${k + 1}`,
    hump: +hump.toExponential(4), // curvature-hump amplitude at decade k
    sigmaHi: +sigmaHi.toFixed(4), // endpoint saturation (crosses 1/2 at k=9)
    humpOverSigmaHi: +(hump / sigmaHi).toFixed(4), // tail proportionality to sigma_hi
  };
});

const HUMPS = HUMP_LADDER.map((r) => r.hump);
const HUMP_ARGMAX_I = HUMPS.indexOf(Math.max(...HUMPS));
const HUMP_ARGMAX_K = LADDER_DECADES[HUMP_ARGMAX_I]; // 9
const HUMP_PEAK = HUMPS[HUMP_ARGMAX_I]; // ~6.4758e-2

// Head-side step ratios hump(k)/hump(k-1) rising into the peak (k = 7,8,9): gentle, sub-1.7x.
const HEAD_RATIOS = [7, 8, 9].map((k) => {
  const i = LADDER_DECADES.indexOf(k);
  return +(HUMPS[i] / HUMPS[i - 1]).toFixed(4);
});
// Tail-side decay ratios hump(k)/hump(k+1) away from the peak (k = 9..12): accelerating.
const TAIL_RATIOS = [9, 10, 11, 12].map((k) => {
  const i = LADDER_DECADES.indexOf(k);
  return +(HUMPS[i] / HUMPS[i + 1]).toFixed(4);
});
const SQRT10 = Math.sqrt(10); // ~3.1623: per-decade decay of sigma ~ N^(-1/2)

// Published imp-33773 M3 overlap-window residual ladder (k=6..11) for the reuse gate.
const IMP33773_HUMP_PUBLISHED_6_11 = [2.39e-2, 3.29e-2, 5.49e-2, 6.48e-2, 4.51e-2, 2.09e-2];

export const IMP33809_SATURATION_CURVATURE_HUMP_VS_K = {
  id: 'imp-33809',
  proofSection: 'S-frontier',
  question:
    'imp-33773 finding M3 concluded the sub-leading offset residual is the intra-decade curvature ' +
    'of the (1 - sigma) saturation factor, peaking at decade index k = 9 (the E_coll = E_trunc ' +
    'crossover), but tabulated it only on the k = 6..11 overlap window and never tracked the hump ' +
    'amplitude as a function of k or quantified its decay. Tabulate the curvature-hump amplitude ' +
    'across an extended decade ladder, confirm the maximum lands at the k = 9 crossover decade, and ' +
    'quantify how fast it decays on either side. Measurement only; establishes no positivity; no QED.',
  measuredQuantity:
    'per decade [10^k,10^(k+1)], k=6..13: hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma (the imp-33773 ' +
    'M3 intra-decade saturation-curvature residual); its global argmax over k; the head-side rise ' +
    'ratios hump(k)/hump(k-1) and tail-side decay ratios hump(k)/hump(k+1); and hump(k)/sigma_hi(k)',
  crossoverDecadeK: CROSSOVER_K,
  humpLadder: HUMP_LADDER,
  humpAmplitudes: HUMPS, // {2.3886e-2 .. 6.4758e-2 (k=9) .. 2.7085e-3 (k=13)}
  humpArgmaxK: HUMP_ARGMAX_K, // 9 (crossover decade)
  humpPeak: HUMP_PEAK, // ~6.4758e-2
  decay: {
    head_rise_ratios_k789: HEAD_RATIOS, // {1.378, 1.667, 1.180}: gentle, sub-1.7x, non-monotone
    tail_decay_ratios_k9_12: TAIL_RATIOS, // {1.437, 2.158, 2.660, 2.899}: monotonically accelerating
    tail_decay_limit_sqrt10: +SQRT10.toFixed(4), // ~3.1623: sigma ~ N^(-1/2) per-decade decay
    hump_over_sigmaHi_tail: HUMP_LADDER.slice(-4).map((r) => r.humpOverSigmaHi), // 0.28 -> 0.39 band
  },
  finding: {
    H1_peak_at_k9_crossover:
      'hump(k) = {2.3886e-2,3.2910e-2,5.4863e-2,6.4758e-2,4.5058e-2,2.0884e-2,7.8506e-3,2.7085e-3} ' +
      'for k=6..13; the global maximum is 6.4758e-2 at k=9, the E_coll = E_trunc crossover decade ' +
      '(sigma 0.6367 -> 0.3697 across [1e9,1e10], crossing 1/2). Extending two decades past the ' +
      'imp-33727 overlap tail the hump keeps shrinking, so k=9 is the true interior argmax, not a ' +
      'window-edge artifact of the k=6..11 tabulation.',
    H2_asymmetric_gentle_rise_fast_tail:
      'Head-side rise ratios hump(k)/hump(k-1) = {1.378,1.667,1.180} for k=7,8,9 are all sub-1.7x and ' +
      'non-monotone, while tail-side decay ratios hump(k)/hump(k+1) = {1.437,2.158,2.660,2.899} for ' +
      'k=9,10,11,12 accelerate monotonically -- the hump falls off faster on the high-N tail side ' +
      'than it rises on the low-N head side.',
    H3_tail_decays_like_sqrtN:
      'The tail decay ratio climbs toward sqrt(10) ~ 3.1623 (2.66 -> 2.90 at k=11,12), the per-decade ' +
      'decay of sigma_hi itself (sigma_hi decade ratios 2.70,2.91,3.00 at k=10,11,12), and ' +
      'hump(k)/sigma_hi(k) settles into a narrow 0.28 -> 0.39 band across k=10..13 -- so past the ' +
      'crossover the curvature hump decays proportionally to sigma_hi ~ sqrt(log N / N), i.e. like ' +
      'N^(-1/2), matching the imp-3463 far-tail sqrt(1/N) picture.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33773 M3 intra-decade ' +
    'saturation-curvature hump hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma, tabulated across the ' +
    'extended decade ladder k=6..13, has its GLOBAL maximum 6.4758e-2 at k=9 -- the E_coll = E_trunc ' +
    'crossover decade where sigma swings most (0.6367 -> 0.3697 across [1e9,1e10]) -- confirming the ' +
    'imp-33773 M3 assertion and certifying k=9 as an interior argmax, not a k=6..11 window edge. The ' +
    'hump is asymmetric: it rises gently on the low-N head side (step ratios sub-1.7x, non-monotone) ' +
    'and decays faster and monotonically-accelerating on the high-N tail side (ratios 1.44 -> 2.90), ' +
    'with the tail decay approaching sqrt(10) ~ 3.16 per decade -- the decay of sigma_hi ~ N^(-1/2) ' +
    'itself, hump(k)/sigma_hi(k) holding a 0.28 -> 0.39 band. So the curvature hump peaks at the ' +
    'crossover and its tail falloff tracks the residual saturation, consistent with imp-3463. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33773 (M3 curvature-hump asserted, tabulated vs k here); imp-33727 (offset ladder overlap ' +
    'window k=6..11); imp-33620 (separated-E_coll exponent ladder); imp-33582 (full-sigma OLS ladder); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3463 (far-tail sqrt(1/N) leading form); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33809_SATURATION_CURVATURE_HUMP_VS_K_ASSERTIONS = [
  {
    // (H1 reuse gate) The k=6..11 slice of the extended hump ladder reproduces the imp-33773 M3
    // published residual ladder to the printed precision.
    id: 'imp33809-hump-reproduces-imp33773-m3',
    description: 'hump(k) on k=6..11 matches the imp-33773 M3 residual ladder to <5e-4',
    holds: () =>
      IMP33773_HUMP_PUBLISHED_6_11.every((v, i) => Math.abs(HUMPS[i] - v) < 5e-4),
  },
  {
    // (H1) The hump global argmax over the extended ladder k=6..13 is the k=9 crossover decade,
    // and it is an INTERIOR maximum (not at either endpoint of the ladder).
    id: 'imp33809-hump-peaks-at-k9-crossover',
    description: 'hump global argmax is k=9 (interior), peak ~6.4758e-2, and k=9 is the crossover decade',
    holds: () => {
      const interior = HUMP_ARGMAX_I > 0 && HUMP_ARGMAX_I < HUMPS.length - 1;
      const sigLo = sigmaOf(1e9);
      const sigHi = sigmaOf(1e10);
      const bracketsHalf = sigLo > 0.5 && sigHi < 0.5; // crossover inside k=9
      return (
        HUMP_ARGMAX_K === CROSSOVER_K &&
        interior &&
        Math.abs(HUMP_PEAK - 6.4758e-2) < 5e-4 &&
        bracketsHalf
      );
    },
  },
  {
    // (H1) Two decades past the imp-33727 overlap tail the hump keeps shrinking, certifying k=9 is
    // not a window-edge artifact of the k=6..11 tabulation.
    id: 'imp33809-hump-shrinks-past-overlap-tail',
    description: 'hump strictly decreases past the peak: hump(11) > hump(12) > hump(13)',
    holds: () => {
      const i11 = LADDER_DECADES.indexOf(11);
      return HUMPS[i11] > HUMPS[i11 + 1] && HUMPS[i11 + 1] > HUMPS[i11 + 2];
    },
  },
  {
    // (H2) Asymmetry: the head-side rise is gentle (all step ratios sub-1.7x) while the tail-side
    // decay accelerates monotonically and outpaces the head rise near the peak.
    id: 'imp33809-hump-asymmetric-rise-vs-decay',
    description: 'head rise ratios all < 1.7, tail decay ratios monotonically increasing and > head rise past k=10',
    holds: () => {
      const headGentle = HEAD_RATIOS.every((r) => r < 1.7);
      const tailAccelerates = TAIL_RATIOS.every((r, i) => i === 0 || r > TAIL_RATIOS[i - 1]);
      const tailOutpaces = TAIL_RATIOS[TAIL_RATIOS.length - 1] > Math.max(...HEAD_RATIOS);
      return headGentle && tailAccelerates && tailOutpaces;
    },
  },
  {
    // (H3) The tail decay ratio approaches sqrt(10) from below, tracking sigma ~ N^(-1/2), and
    // hump/sigma_hi holds a narrow band in the tail (proportional falloff).
    id: 'imp33809-tail-decays-like-sqrtN',
    description: 'tail decay ratio climbs toward sqrt(10)~3.1623 from below; hump/sigma_hi in [0.25,0.45] over k=10..13',
    holds: () => {
      const last = TAIL_RATIOS[TAIL_RATIOS.length - 1];
      const approaching = last < SQRT10 && last > 2.5;
      const band = HUMP_LADDER.slice(-4).map((r) => r.humpOverSigmaHi);
      const bandTight = band.every((x) => x > 0.25 && x < 0.45);
      const bandRising = band.every((x, i) => i === 0 || x > band[i - 1]);
      return approaching && bandTight && bandRising;
    },
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33809-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k=9, no QED, no refereed bound is changed',
    holds: () =>
      IMP33809_SATURATION_CURVATURE_HUMP_VS_K.isRigorous === false &&
      IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpArgmaxK === 9 &&
      IMP33809_SATURATION_CURVATURE_HUMP_VS_K.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP33809_SATURATION_CURVATURE_HUMP_VS_K.verdict) &&
      /refereed bound is changed/i.test(IMP33809_SATURATION_CURVATURE_HUMP_VS_K.verdict),
  },
];

for (const a of IMP33809_SATURATION_CURVATURE_HUMP_VS_K_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33809-saturation-curvature-hump-vs-k assertion failed: ${a.id}`);
  }
}
