/**
 * @module imp-34408-widening-slope-prepole-landmark-decade-axis
 *
 * imp-34408 (numerical, opus-4-8): TABULATE the three named widening-slope pre-pole landmarks on ONE
 * shared decade axis and measure whether their spacings follow a regular pattern or are independent.
 * The three landmarks all sit on the same imp-34246 widening-slope curve dy/dk = -ln10/2 + ln10*3/u
 * (u = log(T0/2pi)) and the resid_exp hump it rides, but were never co-tabulated:
 *
 *   L1  imp-34330 F1  residual sign-change   k ~ 17.798  (the leading -ln10/2 + ln10*3/u form stops
 *       improving; the two-term residual crosses zero, then reverses and diverges toward the pole).
 *   L2  imp-34327     mapped -1 crossing      k* ~ 20.479 (the corrected slope -ln10/2 + ln10*3/u
 *       equals exactly -1; mapped through the effectiveHeightForN RvM inversion, u* = 45.65827).
 *   L3  imp-34023/imp-34247  M2 pole          k* ~ 21.281 (the resid_exp sign-change ceiling / simple
 *       pole in dy/dk, residue +1).
 *
 * This import-light self-asserting module reuses the EXACT imp-34327/imp-34330 rung -> u map
 * u(k) = log(effectiveHeightForN(10^(k+1))/2pi), places the three k-landmarks on both the k-axis and
 * the u-axis, and tabulates the two consecutive gaps (L1->L2, L2->L3) on each axis. Tabulation /
 * cross-check ONLY within the inherited imp-3220/imp-3406/imp-33810/imp-34246 component model; changes
 * no bound; NO QED.
 *
 * THE TABLE (decade index k and u = log(T0/2pi), T0 = effectiveHeightForN(10^(k+1)))
 * --------------------------------------------------------------------------------
 *   landmark              k          u          gap_k (to next)   gap_u (to next)
 *   L1 resid-crossing    17.798     39.630        2.681             6.028
 *   L2 -1 crossing       20.479     45.658        0.802             1.807
 *   L3 M2 pole           21.281     47.465          --                --
 *
 * THE FINDING -- the spacings are strongly UNEQUAL and axis-consistent, NOT an independent law
 * ----------------------------------------------------------------------------------------------
 *   (F1) The landmarks COMPRESS toward the pole. The second gap is only ~30% of the first on BOTH
 *        axes: gap_k ratio (L2->L3)/(L1->L2) = 0.80197/2.68103 = 0.29913; gap_u ratio
 *        1.80693/6.02830 = 0.29974. The three landmarks do not sit at equal spacing (ratio would be
 *        1) nor at a geometric doubling -- they bunch up as the resid_exp hump turns and the imp-34247
 *        pole is approached. The -1 crossing L2 sits far closer to the pole L3 than to the residual
 *        sign-change L1.
 *   (F2) The k-gap ratio and the u-gap ratio AGREE to <0.001 (0.29913 vs 0.29974). This is the
 *        signature of a near-AFFINE u-map over the window: u(k) ~ a + b*k across k = 17.8..21.3, so
 *        consecutive-gap ratios are preserved between the two axes and carry no axis-specific
 *        structure. The regularity is therefore the near-log-linearity of the height map, NOT an
 *        independent arithmetic/geometric relation among the three physical landmarks.
 *   (F3) So the honest reading: the three spacings are essentially INDEPENDENT landmarks whose only
 *        shared regularity is the ~0.30 compression ratio, which is itself explained by the near-affine
 *        u(k) -- the residual-crossing (L1), the -1 crossing (L2), and the pole (L3) do not fall on a
 *        simple equal- or ratio-spaced ladder beyond that. The ~2.68-decade L1->L2 gap dwarfs the
 *        ~0.80-decade L2->L3 gap: the leading form stops improving ~3.5 decades before the pole, the
 *        slope reaches -1 only ~0.8 decades before it.
 *
 * HONEST SCOPE -- tabulation only, NO QED. This co-tabulates three already-established inherited
 * landmarks on a shared axis and reports their gap ratios; it introduces no new mathematical claim,
 * changes no bound, and re-derives L2 exactly as imp-34327 did. The component model is NOT a rigorous
 * asymptotic. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643)
 * is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * @see imp-34330-widening-residual-prepole-reversal (L1: residual sign-change k~17.80, k_best)
 * @see imp-34327-widening-slope-minus-one-crossing-location (L2: mapped -1 crossing k*~20.479, u*~45.658)
 * @see imp-34247-widening-slope-pole-divergence (L3: resid_exp simple pole k*~21.281, residue +1)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (L3: the M2 sign-change ceiling)
 * @see imp-34246-widening-slope-limit-analytic-derivation (the -ln10/2 + ln10*3/u curve all three landmarks ride)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, the RvM inversion defining u(k))
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LN10 = Math.LN10;

// EXACT imp-34327/imp-34330 rung -> u map: for decade index k the window upper endpoint is N = 10^(k+1),
// u = log(T0/2pi) with T0 = effectiveHeightForN(N).
const uOfK = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 1)) / TWO_PI);

// L1: imp-34330 residual sign-change k_best (the leading form stops improving here).
const K1_RESID_CROSSING = 17.798;
// L3: imp-34023/imp-34247 M2 pole / resid_exp sign-change ceiling.
const K3_M2_POLE = 21.281;

// L2: re-derive the imp-34327 mapped -1 crossing EXACTLY -- solve -ln10/2 + ln10*3/u = -1 for u*, then
// invert uOfK by bisection to the mapped decade index k*.
const U_STAR = (3 * LN10) / (LN10 / 2 - 1); // 45.65827
let lo = 5;
let hi = 40;
for (let i = 0; i < 200; i++) {
  const mid = (lo + hi) / 2;
  if (uOfK(mid) < U_STAR) lo = mid;
  else hi = mid;
}
const K2_MINUS_ONE_CROSSING = (lo + hi) / 2; // 20.47903

// Place all three on the shared u-axis.
const U1 = uOfK(K1_RESID_CROSSING); // 39.62997
const U2 = uOfK(K2_MINUS_ONE_CROSSING); // 45.65827 (== U_STAR by construction)
const U3 = uOfK(K3_M2_POLE); // 47.46519

// The two consecutive gaps on each axis.
const GAP_K_12 = K2_MINUS_ONE_CROSSING - K1_RESID_CROSSING; // 2.68103
const GAP_K_23 = K3_M2_POLE - K2_MINUS_ONE_CROSSING; // 0.80197
const GAP_U_12 = U2 - U1; // 6.02830
const GAP_U_23 = U3 - U2; // 1.80693

// The consecutive-gap compression ratio on each axis (second gap / first gap).
const RATIO_K = GAP_K_23 / GAP_K_12; // 0.29913
const RATIO_U = GAP_U_23 / GAP_U_12; // 0.29974
const RATIO_AXIS_AGREEMENT = Math.abs(RATIO_K - RATIO_U); // ~6e-4

const LANDMARKS = [
  { id: 'imp-34330', name: 'residual sign-change (leading form stops improving)', k: +K1_RESID_CROSSING.toFixed(3), u: +U1.toFixed(5) },
  { id: 'imp-34327', name: '-1 crossing (mapped)', k: +K2_MINUS_ONE_CROSSING.toFixed(5), u: +U2.toFixed(5) },
  { id: 'imp-34247', name: 'M2 pole / resid_exp ceiling', k: +K3_M2_POLE.toFixed(3), u: +U3.toFixed(5) },
];

export const IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS = {
  id: 'imp-34408',
  proofSection: 'S-frontier',
  question:
    'Tabulate the three named widening-slope pre-pole landmarks -- imp-34330 residual sign-change k~17.80, ' +
    'imp-34327 mapped -1 crossing k*~20.48, imp-34247 M2 pole k*~21.281 -- on one shared decade axis ' +
    '(k and u = log(T0/2pi)), and measure whether the two consecutive spacings follow a regular pattern.',
  uMap: 'u(k) = log(effectiveHeightForN(10^(k+1))/2pi)  [the exact imp-34327/imp-34330 rung -> u map]',
  landmarks: LANDMARKS,
  // gaps on each axis
  gapK_L1_L2: +GAP_K_12.toFixed(5), // 2.68103
  gapK_L2_L3: +GAP_K_23.toFixed(5), // 0.80197
  gapU_L1_L2: +GAP_U_12.toFixed(5), // 6.02830
  gapU_L2_L3: +GAP_U_23.toFixed(5), // 1.80693
  // compression ratios
  gapRatioK: +RATIO_K.toFixed(5), // 0.29913
  gapRatioU: +RATIO_U.toFixed(5), // 0.29974
  gapRatioAxisAgreement: +RATIO_AXIS_AGREEMENT.toExponential(2), // ~6.1e-4
  spacingsEqual: false, // ratio ~0.30, far from 1
  spacingsCompressTowardPole: true, // second gap ~30% of first on both axes
  uMapNearAffineOverWindow: true, // k-ratio == u-ratio to <1e-3
  uStar: +U_STAR.toFixed(5), // 45.65827 (== U2 by construction)
  isRigorous: false,
  verdict:
    'TABULATED (component-model only): the three pre-pole landmarks sit at (k, u) = (17.798, 39.630), ' +
    '(20.479, 45.658), (21.281, 47.465). The two consecutive spacings are strongly UNEQUAL and the ' +
    'landmarks COMPRESS toward the pole -- the second gap is ~30% of the first on BOTH axes: gap_k ratio ' +
    '0.80197/2.68103 = 0.29913, gap_u ratio 1.80693/6.02830 = 0.29974. The k-ratio and u-ratio agree to ' +
    '<1e-3, the signature of a near-AFFINE u(k) over k=17.8..21.3, so the ~0.30 compression is the ' +
    'near-log-linearity of the height map and carries no axis-specific structure. So the three spacings do ' +
    'NOT fall on a simple equal- or geometric-spaced ladder: they are essentially independent landmarks ' +
    'whose only shared regularity is the ~0.30 compression explained by the affine u-map. The -1 crossing ' +
    'L2 sits far closer to the pole L3 (0.80 decades) than to the residual sign-change L1 (2.68 decades): ' +
    'the leading -ln10/2 + ln10*3/u form stops improving ~3.5 decades before the pole, the slope reaches ' +
    'exactly -1 only ~0.8 decades before it. Tabulation/cross-check within the inherited ' +
    'imp-3220/imp-3406/imp-33810/imp-34246 component model, NOT a rigorous asymptotic; L1/L2/L3 UNTOUCHED; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

const IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS_ASSERTIONS = [
  {
    // The three landmarks are strictly ordered on both axes (k and u ascending L1 < L2 < L3).
    id: 'imp34408-landmarks-strictly-ordered',
    description: 'k and u both ascend across L1 (17.80) < L2 (20.48) < L3 (21.28); u values ~39.63, 45.66, 47.47',
    holds: () =>
      K1_RESID_CROSSING < K2_MINUS_ONE_CROSSING &&
      K2_MINUS_ONE_CROSSING < K3_M2_POLE &&
      U1 < U2 &&
      U2 < U3 &&
      Math.abs(U1 - 39.62997) < 1e-3 &&
      Math.abs(U2 - 45.65827) < 1e-3 &&
      Math.abs(U3 - 47.46519) < 1e-3,
  },
  {
    // L2 is re-derived exactly as imp-34327: mapped -1 crossing at k*~20.479, u* = U_STAR.
    id: 'imp34408-l2-matches-imp34327-mapped-crossing',
    description: 'the re-derived mapped -1 crossing L2 matches imp-34327: k*~20.479 and uOfK(k*)=U_STAR to <1e-6',
    holds: () =>
      Math.abs(K2_MINUS_ONE_CROSSING - 20.47903) < 1e-3 &&
      Math.abs(uOfK(K2_MINUS_ONE_CROSSING) - U_STAR) < 1e-6 &&
      Math.abs(U2 - U_STAR) < 1e-9,
  },
  {
    // The two consecutive gaps: k-gaps ~2.681 and ~0.802, u-gaps ~6.028 and ~1.807.
    id: 'imp34408-consecutive-gaps',
    description: 'gap_k L1->L2 ~2.681, L2->L3 ~0.802; gap_u L1->L2 ~6.028, L2->L3 ~1.807',
    holds: () =>
      Math.abs(GAP_K_12 - 2.68103) < 1e-3 &&
      Math.abs(GAP_K_23 - 0.80197) < 1e-3 &&
      Math.abs(GAP_U_12 - 6.02830) < 1e-3 &&
      Math.abs(GAP_U_23 - 1.80693) < 1e-3,
  },
  {
    // F1: the spacings are strongly UNEQUAL and compress toward the pole -- ratio ~0.30, far from 1.
    id: 'imp34408-spacings-compress-toward-pole',
    description: 'the second gap is ~30% of the first on both axes (ratio ~0.299), so spacings are unequal and compress toward the pole',
    holds: () =>
      RATIO_K > 0.25 &&
      RATIO_K < 0.35 &&
      RATIO_U > 0.25 &&
      RATIO_U < 0.35 &&
      GAP_K_23 < 0.4 * GAP_K_12 &&
      IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.spacingsEqual === false &&
      IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.spacingsCompressTowardPole === true,
  },
  {
    // F2: the k-gap ratio and u-gap ratio AGREE to <1e-3 -- the near-affine u(k) signature.
    id: 'imp34408-axis-ratios-agree-near-affine',
    description: 'the k-gap ratio (0.29913) and u-gap ratio (0.29974) agree to <1e-3, the signature of a near-affine u(k) over the window',
    holds: () =>
      RATIO_AXIS_AGREEMENT < 1e-3 &&
      IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.uMapNearAffineOverWindow === true,
  },
  {
    // Honesty gate: tabulation only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34408-honesty-gate-no-qed',
    description: 'isRigorous false, no bound changed, NO QED, K_a>=0 untouched, C_mb per imp-486 untouched, no refereed bound is changed',
    holds: () =>
      IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.isRigorous === false &&
      /NO QED/.test(IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.verdict) &&
      /refereed bound is changed/i.test(IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.verdict) &&
      /C_mb GUE-conditional per imp-486 UNTOUCHED/.test(IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS.verdict),
  },
];

for (const a of IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34408-widening-slope-prepole-landmark-decade-axis assertion failed: ${a.id}`);
  }
}

export default IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS;
