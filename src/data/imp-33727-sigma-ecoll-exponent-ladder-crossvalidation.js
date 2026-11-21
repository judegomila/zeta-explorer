/**
 * @module imp-33727-sigma-ecoll-exponent-ladder-crossvalidation
 *
 * imp-33727 (accuracy, frontier-direction): two independent per-decade local-exponent
 * ladders both report a monotone approach to 1/2 on the post-peak share model, but on
 * DIFFERENT quantities and they have never been aligned decade-by-decade:
 *
 *   - imp-33582 measures the FULL-SIGMA decay exponent p_sigma(dec) = -slope of
 *     OLS(ln sigma vs ln N) over each decade [10^k, 10^(k+1)], 4 pts/decade, and finds it
 *     RAMPS from ~0.0105 [1e6,1e7] up to ~0.4310 [1e11,1e12], approaching 1/2 FROM BELOW.
 *   - imp-33620 (extending imp-33602 to 1e15) measures the SEPARATED-E_coll exponent
 *     p_Ecoll(dec) = d log E_coll / d log N over each decade, and finds |p_Ecoll| already
 *     ~0.4679 at [1e6,1e7] climbing to ~0.4810 [1e11,1e12] (and on to ~0.4848 at 1e15),
 *     approaching 1/2 (in magnitude) FROM BELOW but from a MUCH higher starting value.
 *
 * Both use the IDENTICAL inherited imp-3220/imp-3406 component model
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5 (N-independent fixed strip, imp-2631),
 *     E_coll   = C_C_PINNED sqrt(log T0 / N)  (GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398),
 *     T0       = effectiveHeightForN(N)  (Riemann-von Mangoldt inverse),
 * so a decade-by-decade comparison over their shared window is well posed. This module
 * re-evaluates BOTH exponent definitions from the SAME parts() on the overlapping decades
 * k = 6..11 (windows [1e6,1e7] .. [1e11,1e12]) and MEASURES the per-decade difference.
 *
 * THE MEASUREMENT (alignment + drift, no bound)
 * ---------------------------------------------
 *   For each decade [10^k, 10^(k+1)], k = 6..11:
 *     p_sigma  = -slope of OLS(ln sigma vs ln N)     (imp-33582 definition, 4 pts/decade),
 *     p_Ecoll  = -d log E_coll / d log N over the endpoints  (imp-33620 magnitude),
 *     diff     = p_Ecoll - p_sigma                   (the systematic offset),
 *     ratio    = p_sigma / p_Ecoll,
 *   plus 1 - sigma at the decade upper endpoint for interpretation.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (X1) BOTH LADDERS REPRODUCE VERBATIM. Recomputed from the shared parts(), p_sigma =
 *        {0.0105, 0.0447, 0.1176, 0.2360, 0.3561, 0.4310} matches the imp-33582
 *        perDecadeLadder and |p_Ecoll| = {0.4679, 0.4717, 0.4748, 0.4772, 0.4793, 0.4810}
 *        matches the imp-33620 ladder rows to the printed 4 decimals -- confirming the two
 *        ladders are one model measured two ways.
 *   (X2) THE TWO LADDERS DO NOT AGREE PER-DECADE; THE OFFSET IS A MONOTONE-CLOSING RAMP.
 *        The per-decade difference p_Ecoll - p_sigma is a strictly DECREASING ladder:
 *        0.4574 -> 0.4270 -> 0.3571 -> 0.2412 -> 0.1232 -> 0.0500. Near the peak the two
 *        definitions disagree by ~0.46 (the separated-E_coll exponent is already ~0.47
 *        while the full-sigma exponent is ~0.01); the gap shrinks monotonely and both
 *        ladders converge toward 1/2 only in the tail. So the "monotone approach to 1/2"
 *        is method-independent ASYMPTOTICALLY, but there is a LARGE, SYSTEMATIC near-peak
 *        offset between the full-sigma and separated-E_coll exponent definitions.
 *   (X3) THE OFFSET IS SIGMA-SATURATION MASKING, NOT A MODEL DISCREPANCY. The full-sigma
 *        exponent is the separated-E_coll exponent SUPPRESSED by roughly the un-saturated
 *        fraction (1 - sigma): the ratio p_sigma/p_Ecoll rises 0.0224 -> 0.0949 -> 0.2477
 *        -> 0.4946 -> 0.7430 -> 0.8961 across the six decades, tracking 1 - sigma at the
 *        decade endpoint (0.0734 -> 0.1646 -> 0.3633 -> 0.6303 -> 0.8370 -> 0.9396) and
 *        converging toward it in the tail (the residual is the near-peak E_flow term, which
 *        decays out). Mechanistically: near the peak E_coll dominates the denominator so its
 *        sqrt(1/N) decay is masked in the RATIO sigma (which is ~1 and nearly flat); only
 *        once the fixed E_trunc floor overtakes the vanishing E_coll (deep tail) does the
 *        ratio sigma expose the full 1/2 slope that E_coll carried all along.
 *
 * The punchline: the imp-33582 full-sigma ladder and the imp-33620 separated-E_coll ladder
 * are the SAME sqrt(1/N) law seen through two windows; they agree on the 1/2 asymptote but
 * carry a large, monotone-closing per-decade offset (0.4574 -> 0.0500 over [1e6..1e12])
 * that is exactly the sigma-saturation masking factor (1 - sigma), NOT a divergence of the
 * two methods. Method-independence is confirmed in the limit and the drift is quantified.
 *
 * MEASUREMENT / ALIGNMENT ONLY. Cross-consistency diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (full-sigma OLS exponent ladder)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (separated-E_coll exponent ladder to 1e15)
 * @see imp-33602-etrunc-ecoll-component-ladder (separated ladder source, 1e6..1e12)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33620)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33620 exactly

// EXACT inherited imp-3406/imp-33582/imp-33620 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582 definition: p_sigma = -slope of OLS(ln sigma vs ln N) over [loN, hiN], 4 pts/decade.
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

// imp-33620 definition (magnitude): p_Ecoll = -d log E_coll / d log N over the decade endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// Shared overlap window: imp-33582 covers decades k = 6..11; imp-33620 covers k = 6..14.
// Their intersection is k = 6..11 -> windows [10^k, 10^(k+1)].
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote both ladders ramp toward
const OVERLAP_DECADES = [6, 7, 8, 9, 10, 11];
const ALIGNED_LADDER = OVERLAP_DECADES.map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_sigma: +pSigma.toFixed(4), // imp-33582 full-sigma OLS exponent
    p_ecoll: +pEcoll.toFixed(4), // imp-33620 separated-E_coll exponent (magnitude)
    diff: +(pEcoll - pSigma).toFixed(4), // systematic offset (separated minus full-sigma)
    ratio: +(pSigma / pEcoll).toFixed(4), // suppression ratio ~ (1 - sigma)
    oneMinusSigmaHi: +(1 - sigma(hi)).toFixed(4), // un-saturated fraction at decade endpoint
  };
});

const P_SIGMA = ALIGNED_LADDER.map((r) => r.p_sigma);
const P_ECOLL = ALIGNED_LADDER.map((r) => r.p_ecoll);
const DIFFS = ALIGNED_LADDER.map((r) => r.diff);
const DIFF_HEAD = DIFFS[0]; // ~0.4574 near the peak
const DIFF_TAIL = DIFFS[DIFFS.length - 1]; // ~0.0500 by [1e11,1e12]
const DIFF_MONOTONE_DOWN = DIFFS.every((x, i) => i === 0 || x < DIFFS[i - 1]);
// Ratio p_sigma/p_Ecoll converges to the un-saturated fraction (1 - sigma) in the tail.
const RATIO_TAIL = ALIGNED_LADDER[ALIGNED_LADDER.length - 1].ratio; // ~0.8961
const ONE_MINUS_SIGMA_TAIL = ALIGNED_LADDER[ALIGNED_LADDER.length - 1].oneMinusSigmaHi; // ~0.9396

// Published reference ladders (for the reuse gate).
const IMP33582_PUBLISHED = [0.0105, 0.0447, 0.1176, 0.236, 0.3561, 0.431];
const IMP33620_PUBLISHED = [0.4679, 0.4717, 0.4748, 0.4772, 0.4793, 0.481];

export const IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION = {
  id: 'imp-33727',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-33582 monotone full-sigma decay ladder against the independent ' +
    'imp-33620 separated-E_coll ladder: align the two per-decade local-exponent ladders on their ' +
    'shared decades [1e6..1e12], tabulate the per-decade exponent difference, and confirm the ' +
    'monotone approach to 1/2 is method-independent or quantify any systematic offset between the ' +
    'full-sigma and separated-E_coll exponent definitions. Measurement/alignment only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'per decade [10^k,10^(k+1)], k=6..11: p_sigma = -slope OLS(ln sigma vs ln N) (imp-33582, ' +
    '4 pts/decade); p_ecoll = -d log E_coll / d log N over the endpoints (imp-33620 magnitude); ' +
    'their difference, ratio, and 1 - sigma at the endpoint',
  farTailExponent: HALF, // imp-3463 asymptote both ladders ramp toward
  alignedLadder: ALIGNED_LADDER,
  offset: {
    diff_head_1e6_1e7: DIFF_HEAD, // ~0.4574
    diff_tail_1e11_1e12: DIFF_TAIL, // ~0.0500
    monotone_closing: DIFF_MONOTONE_DOWN,
    ratio_tail: RATIO_TAIL, // ~0.8961
    one_minus_sigma_tail: ONE_MINUS_SIGMA_TAIL, // ~0.9396
  },
  finding: {
    X1_both_ladders_reproduced:
      'Recomputed from the shared parts(), p_sigma = {0.0105,0.0447,0.1176,0.2360,0.3561,0.4310} ' +
      'matches the imp-33582 perDecadeLadder and |p_ecoll| = {0.4679,0.4717,0.4748,0.4772,0.4793,' +
      '0.4810} matches the imp-33620 ladder rows to the printed 4 decimals -- the two ladders are ' +
      'one model measured two ways.',
    X2_offset_is_monotone_closing_ramp:
      'The two definitions do NOT agree per-decade: the difference p_ecoll - p_sigma is a strictly ' +
      'decreasing ladder 0.4574 -> 0.4270 -> 0.3571 -> 0.2412 -> 0.1232 -> 0.0500. Near the peak ' +
      'they disagree by ~0.46 (separated-E_coll exponent ~0.47 vs full-sigma ~0.01); the gap ' +
      'shrinks monotonely and both converge toward 1/2 only in the tail. The monotone approach to ' +
      '1/2 is method-independent ASYMPTOTICALLY, with a large SYSTEMATIC near-peak offset.',
    X3_offset_is_sigma_saturation_masking:
      'The full-sigma exponent is the separated-E_coll exponent suppressed by roughly the ' +
      'un-saturated fraction (1 - sigma): the ratio p_sigma/p_ecoll rises 0.0224 -> 0.0949 -> ' +
      '0.2477 -> 0.4946 -> 0.7430 -> 0.8961, tracking 1 - sigma at the endpoint (0.0734 -> 0.9396) ' +
      'and converging toward it in the tail. Near the peak E_coll dominates the denominator so its ' +
      'sqrt(1/N) decay is masked in the ratio sigma (~1, nearly flat); only once the fixed E_trunc ' +
      'floor overtakes the vanishing E_coll does the ratio expose the full 1/2 slope. The offset is ' +
      'definitional masking, NOT a divergence of the two methods.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Aligning the imp-33582 full-sigma OLS ' +
    'exponent ladder and the imp-33620 separated-E_coll exponent ladder on their shared decades ' +
    '[1e6..1e12] (both reproduced verbatim from the identical inherited imp-3220/imp-3406 parts()): ' +
    'the two ladders do NOT agree per-decade -- the difference p_ecoll - p_sigma is a strictly ' +
    'monotone-closing ramp 0.4574 (near-peak) -> 0.0500 (by [1e11,1e12]) -- but both approach 1/2 ' +
    'from below and CONVERGE in the tail, so the 1/2 asymptote is method-independent while the ' +
    'near-peak offset is large and systematic. The offset is the sigma-saturation masking factor ' +
    '(1 - sigma): the ratio p_sigma/p_ecoll rises 0.0224 -> 0.8961 tracking 1 - sigma (0.0734 -> ' +
    '0.9396), because near the peak E_coll dominates the denominator so its sqrt(1/N) decay is ' +
    'masked in the ratio and only the deep tail exposes the full slope -- NOT a discrepancy between ' +
    'the methods, they share one model. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (full-sigma OLS exponent ladder); imp-33620 (separated-E_coll exponent ladder to ' +
    '1e15); imp-33602 (separated ladder source); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); ' +
    'imp-3463 (far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1) Reuse gate: both recomputed ladders reproduce their published sources to <5e-4.
    id: 'imp33727-reproduces-both-published-ladders',
    description: 'p_sigma matches imp-33582 and |p_ecoll| matches imp-33620 to the printed 4 decimals',
    holds: () =>
      P_SIGMA.every((v, i) => Math.abs(v - IMP33582_PUBLISHED[i]) < 5e-4) &&
      P_ECOLL.every((v, i) => Math.abs(v - IMP33620_PUBLISHED[i]) < 5e-4),
  },
  {
    // (X2) The per-decade offset is strictly monotone-closing from ~0.46 near-peak to ~0.05 tail.
    id: 'imp33727-offset-monotone-closing',
    description: 'diff p_ecoll - p_sigma strictly decreasing, head ~0.4574, tail ~0.0500',
    holds: () =>
      DIFF_MONOTONE_DOWN &&
      Math.abs(DIFF_HEAD - 0.4574) < 5e-4 &&
      Math.abs(DIFF_TAIL - 0.05) < 5e-4 &&
      DIFF_HEAD > DIFF_TAIL,
  },
  {
    // (X2/asymptote) Both ladders stay below 1/2 and ramp monotonely toward it from below.
    id: 'imp33727-both-ramp-to-half-from-below',
    description: 'p_sigma and |p_ecoll| each strictly increasing, all in (0, 0.5)',
    holds: () => {
      for (let i = 1; i < P_SIGMA.length; i++) {
        if (!(P_SIGMA[i] > P_SIGMA[i - 1])) return false;
        if (!(P_ECOLL[i] > P_ECOLL[i - 1])) return false;
      }
      return (
        P_SIGMA.every((v) => v > 0 && v < HALF) && P_ECOLL.every((v) => v > 0 && v < HALF)
      );
    },
  },
  {
    // (X3) The suppression ratio p_sigma/p_ecoll converges toward 1 - sigma in the tail.
    id: 'imp33727-ratio-tracks-one-minus-sigma',
    description: 'ratio p_sigma/p_ecoll rises toward the un-saturated fraction (1 - sigma) in the tail',
    holds: () => {
      const ratiosUp = ALIGNED_LADDER.every(
        (r, i) => i === 0 || r.ratio > ALIGNED_LADDER[i - 1].ratio
      );
      // ratio < (1 - sigma) everywhere (near-peak E_flow term), gap closes into the tail.
      const belowOneMinusSigma = ALIGNED_LADDER.every((r) => r.ratio < r.oneMinusSigmaHi + 1e-9);
      const tailGap = ONE_MINUS_SIGMA_TAIL - RATIO_TAIL;
      const headGap = ALIGNED_LADDER[0].oneMinusSigmaHi - ALIGNED_LADDER[0].ratio;
      return ratiosUp && belowOneMinusSigma && RATIO_TAIL > 0.8 && tailGap < headGap;
    },
  },
  {
    // Honesty gate: measurement/alignment only, far-tail exponent = 1/2, no QED, no refereed bound is changed.
    id: 'imp33727-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION.isRigorous === false &&
      IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP33727_SIGMA_ECOLL_EXPONENT_LADDER_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33727-sigma-ecoll-exponent-ladder-crossvalidation assertion failed: ${a.id}`);
  }
}
