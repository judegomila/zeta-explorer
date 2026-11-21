/**
 * @module imp-34327-widening-slope-minus-one-crossing-location
 *
 * imp-34327 (numerical, frontier-direction): imp-34246 V3 argued imp-34188 s b_inf ~ -1.003 is a COINCIDENCE
 * of the finite pre-pole window -- the vanishing-log-correction curve -ln10/2 + ln10*3/u (u = log(T0/2pi))
 * "happens to cross ~ -1.0 somewhere in the k~12..18 (u~27..40) range where the fit lives" -- but never
 * located the -1 crossing precisely. This module SOLVES -ln10/2 + ln10*3/u = -1 for u* in closed form, maps
 * u* back to the RvM height and the decade index k*, and compares to the k=12..18 window imp-34188 sampled.
 * Measurement/derivation ONLY within the inherited imp-3220/imp-3406/imp-33810 component model; NO QED.
 *
 * THE CLOSED-FORM CROSSING
 * -----------------------
 *   -ln10/2 + ln10*(3/u) = -1
 *     => ln10*(3/u) = -1 + ln10/2 = ln10/2 - 1 = 0.151292546...   (POSITIVE, since ln10/2 = 1.15129 > 1)
 *     => u* = 3*ln10 / (ln10/2 - 1) = 45.65827.
 *   The decade index at the crossing depends on the height map used:
 *     (a) NAIVE (u = ln(10^k) = k*ln10, no 2pi shift): k* = u* over ln10 = 3/(ln10/2 - 1) = 19.82913 exactly.
 *     (b) MAPPED (u = log(effectiveHeightForN(10^(k+1))/2pi), the same rung->u map imp-34246 used):
 *         invert numerically -> k* = 20.47903 (the 2pi shift and the (T0/2pi)(u-1)=N RvM inversion push k*
 *         up by ~0.65 vs the naive value).
 *
 * THE VERDICT -- the -1 crossing sits ABOVE the fitted window, not inside it
 * ------------------------------------------------------------------------
 *   (V1) REFUTES the literal "crosses inside k~12..18" reading. Over the sampled window the two-term slope
 *        -ln10/2 + ln10*3/u is ENTIRELY ABOVE -1.0: it runs monotonically from -0.89245 at k=12 (u~26.69)
 *        to -0.97896 at k=18 (u~40.08). It never touches -1 in the window; the exact crossing u*~45.66
 *        (k*~20.48 mapped) lies ~2.48 decades ABOVE the k=18 upper edge (u* - u(18) ~ 5.57 in u).
 *   (V2) CONFIRMS the crossing is real and PRE-POLE. k*~20.48 sits BELOW the imp-34023 M2 sign-change ceiling
 *        k*~21.281 by ~0.80 decades, so the monotonically-descending correction curve DOES reach exactly -1
 *        within the finite pre-pole window -- just not inside the k=12..18 SUB-window where imp-34188 fit.
 *        imp-34188 s free exponential-approach limit b_inf~-1.003 is the fit EXTRAPOLATING the window s
 *        -0.89..-0.98 band slightly past its k=18 edge value toward the -1 crossing region near k~20.5.
 *   (V3) QUANTIFIES the leading-value gap. The true leading value -ln10/2 = -1.15129 lies BELOW (more
 *        negative than) the sampled plateau by exactly the correction ln10*3/u: 0.25884 at k=12, 0.20704 at
 *        k=15, 0.17233 at k=18. So across the fitted window the sampled slope UNDERSHOOTS the true leading
 *        value by ~0.17..0.26; the plateau is nowhere near -ln10/2 because the +ln10*3/u E_flow correction is
 *        still 0.17..0.26 in magnitude over u~27..40 and only decays to 0 as u -> inf (unreachable past k*).
 *
 * So imp-34246 s "crosses ~ -1.0 in the window" is REFINED: the -1 crossing is at k*~20.48 (u*~45.66),
 * ~2.5 decades ABOVE the k=12..18 fit window and ~0.8 decades BELOW the M2 ceiling -- a genuine pre-pole
 * crossing, but OUTSIDE the sampled sub-window, which is why the descriptive b_inf~-1 needs the extrapolation.
 *
 * NAMED SUB-GAP (honest partial): the exact mapped k* depends on the effectiveHeightForN RvM inversion; the
 * naive (19.82913) and mapped (20.47903) decade indices differ by ~0.65, and which one the descriptive fit
 * "sees" is set by the u-weighting of imp-34188 s exponential-approach kernel, not resolved here.
 *
 * MEASUREMENT/DERIVATION ONLY within the inherited imp-3220/imp-3406/imp-33810 component model, which is NOT
 * a rigorous asymptotic. Changes no bound; establishes no operator positivity; the imp-33843 log-linear
 * verdict, imp-34188 statistical finding, and imp-34246 derivation are UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34246-widening-slope-limit-analytic-derivation (the -ln10/2 + ln10*3/u correction curve this locates the -1 crossing of)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the b_inf ~ -1.003 descriptive fit)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the M2 sign-change ceiling k*~21.281)
 * @see imp-34247-widening-slope-pole-divergence (the same ceiling as a simple pole in dy/dk)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, the RvM inversion)
 * @see imp-34326-widening-slope-background-reconciliation (sibling: reconciles the two-term prediction this crossing is solved from)
 * @see imp-34329-crossover-surplus-fartail-composite-limit (sibling: same k*~21.281-ceiling era, far-tail composite-exponent extension)
 * @see imp-34330-widening-residual-prepole-reversal (sibling: the finer-grid residual that finds the SAME crossing reappears as a pre-pole sign flip)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127 (leading
 * closed form) -> imp-34189 (next-order term) -> imp-34188 (widening-slope leading -ln10/2, observed -1 a
 * finite-window coincidence per imp-34246) -> imp-34246 (derives the -ln10/2 + ln10*3/u correction) ->
 * imp-34327 (this module, locates the exact -1 crossing at u*~45.66 / k*~20.48, above the k=12..18 window)
 * -> imp-34247 (simple-pole residue +1 fit) -> imp-34169/imp-34237 (fixed-band peak re-acceleration).
 * Later siblings: imp-34326 (background reconciliation), imp-34330 (pre-pole residual reversal),
 * imp-34329 (crossover-surplus far-tail limit, same era). All share the same kEnd* ceiling; see
 * reciprocal @see links above.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LN10 = Math.LN10;

// The imp-34246 correction curve for the local per-k widening slope: dy/dk = -ln10/2 + ln10*(3/u).
const LEADING_SLOPE = -LN10 / 2; // -1.151293 (the true leading value as u -> inf)
const slopeOfU = (u) => LEADING_SLOPE + (LN10 * 3) / u;

// The same rung -> u map imp-34246 used: for decade index k the window upper endpoint is N = 10^(k+1),
// u = log(T0/2pi) with T0 = effectiveHeightForN(N).
const uOfK = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 1)) / TWO_PI);

// CLOSED-FORM CROSSING: solve -ln10/2 + ln10*3/u = -1  =>  u* = 3*ln10 / (ln10/2 - 1).
const U_STAR = (3 * LN10) / (LN10 / 2 - 1); // 45.65827
// (a) naive decade index (u = k*ln10): k* = u*/ln10 = 3/(ln10/2 - 1).
const K_STAR_NAIVE = 3 / (LN10 / 2 - 1); // 19.82913
// (b) mapped decade index: invert uOfK by bisection to k* with uOfK(k*) = U_STAR.
let lo = 5;
let hi = 40;
for (let i = 0; i < 200; i++) {
  const mid = (lo + hi) / 2;
  if (uOfK(mid) < U_STAR) lo = mid;
  else hi = mid;
}
const K_STAR_MAPPED = (lo + hi) / 2; // 20.47903

// The fitted window k=12..18 in u, and the two-term slope value there (entirely above -1).
const WINDOW = [12, 13, 14, 15, 16, 17, 18].map((k) => {
  const u = uOfK(k);
  return {
    k,
    u: +u.toFixed(4),
    slope: +slopeOfU(u).toFixed(5),
    gapAboveLeading: +(slopeOfU(u) - LEADING_SLOPE).toFixed(5), // = ln10*3/u, how far plateau sits above -ln10/2
  };
});
const WINDOW_SLOPE_MAX = Math.max(...WINDOW.map((w) => w.slope)); // shallowest (least negative), at k=12
const WINDOW_SLOPE_MIN = Math.min(...WINDOW.map((w) => w.slope)); // steepest (most negative), at k=18
const U_18 = uOfK(18);
const U_12 = uOfK(12);
const M2_CEILING_KSTAR = 21.281; // imp-34023 bisected kEnd*

export const IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING = {
  id: 'imp-34327',
  proofSection: 'S-frontier',
  question:
    'Where does the imp-34246 corrected widening-slope -ln10/2 + ln10*3/u cross exactly -1.0? Solve for u*, ' +
    'map to the decade index k*, and check whether the crossing sits inside the k=12..18 window imp-34188 fit.',
  // closed-form crossing
  crossingEquation: '-ln10/2 + ln10*(3/u) = -1',
  uStar: +U_STAR.toFixed(5), // 45.65827
  uStarClosedForm: 'u* = 3*ln10 / (ln10/2 - 1) = 45.65827',
  kStarNaive: +K_STAR_NAIVE.toFixed(5), // 19.82913 (u = k*ln10)
  kStarNaiveClosedForm: 'k* = 3/(ln10/2 - 1) = 19.82913 (u = k*ln10, no 2pi shift)',
  kStarMapped: +K_STAR_MAPPED.toFixed(5), // 20.47903 (effectiveHeightForN RvM inversion, with 2pi shift)
  // the fitted window
  fittedWindowKRange: [12, 18],
  fittedWindowURange: [+U_12.toFixed(4), +U_18.toFixed(4)], // [26.6876, 40.0834] ~ ticket "u~27..40"
  windowTwoTermSlopes: WINDOW,
  windowSlopeShallowest: +WINDOW_SLOPE_MAX.toFixed(5), // -0.89245 at k=12
  windowSlopeSteepest: +WINDOW_SLOPE_MIN.toFixed(5), // -0.97896 at k=18
  // comparison
  crossingInsideWindow: false, // curve is ENTIRELY above -1 across k=12..18
  crossingDecadesAboveWindowTop: +(K_STAR_MAPPED - 18).toFixed(5), // ~2.479 decades above k=18
  crossingDecadesBelowCeiling: +(M2_CEILING_KSTAR - K_STAR_MAPPED).toFixed(5), // ~0.802 below k*~21.281
  m2CeilingKStar: M2_CEILING_KSTAR,
  crossingIsPrePole: true, // k*~20.48 < ceiling 21.281, so the -1 crossing IS reached before truncation
  // leading-value gap over the window (= ln10*3/u)
  leadingSlope: +LEADING_SLOPE.toFixed(6), // -1.151293
  plateauGapAboveLeadingAtK12: +(slopeOfU(U_12) - LEADING_SLOPE).toFixed(5), // 0.25884
  plateauGapAboveLeadingAtK18: +(slopeOfU(U_18) - LEADING_SLOPE).toFixed(5), // 0.17233
  isRigorous: false,
  verdict:
    'LOCATED (component-model only): solving -ln10/2 + ln10*3/u = -1 gives u* = 3*ln10/(ln10/2 - 1) = ' +
    '45.65827, i.e. decade index k* = 19.82913 naive (u = k*ln10) or 20.47903 mapped through the ' +
    'effectiveHeightForN RvM inversion. REFUTES the literal "crosses inside k~12..18": over the fitted window ' +
    'the two-term slope is ENTIRELY ABOVE -1, running -0.89245 (k=12) -> -0.97896 (k=18); the exact -1 ' +
    'crossing sits ~2.48 decades ABOVE the k=18 edge. But it IS a genuine PRE-POLE crossing -- k*~20.48 is ' +
    '~0.80 decades below the imp-34023 M2 ceiling k*~21.281 -- so imp-34188 s b_inf~-1.003 is the fit ' +
    'extrapolating the window s -0.89..-0.98 band past its k=18 edge toward that crossing. The true leading ' +
    'value -ln10/2 = -1.15129 lies 0.172..0.259 BELOW the sampled plateau (the residual +ln10*3/u correction). ' +
    'Named sub-gap: naive vs mapped k* differ ~0.65; which the exponential-approach kernel sees is unresolved. ' +
    'Measurement/derivation within the inherited imp-3220/imp-3406/imp-33810 component model, NOT a rigorous ' +
    'asymptotic; imp-33843/imp-34188/imp-34246 UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
};

const IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING_ASSERTIONS = [
  {
    // closed-form crossing solves the equation exactly.
    id: 'imp34327-closed-form-crossing-solves-equation',
    description: 'u* = 3*ln10/(ln10/2 - 1) satisfies -ln10/2 + ln10*3/u* = -1 to <1e-12; u* ~ 45.658',
    holds: () =>
      Math.abs(slopeOfU(U_STAR) - -1.0) < 1e-12 &&
      Math.abs(U_STAR - 45.65827) < 1e-3 &&
      Math.abs(K_STAR_NAIVE - 19.82913) < 1e-3,
  },
  {
    // mapped decade index k* via effectiveHeightForN inversion.
    id: 'imp34327-mapped-decade-index',
    description: 'uOfK(k*_mapped) = u* and k*_mapped ~ 20.479, above the naive 19.829 by ~0.65',
    holds: () =>
      Math.abs(uOfK(K_STAR_MAPPED) - U_STAR) < 1e-6 &&
      Math.abs(K_STAR_MAPPED - 20.47903) < 1e-3 &&
      K_STAR_MAPPED - K_STAR_NAIVE > 0.5,
  },
  {
    // the crossing is OUTSIDE (above) the fitted window: the slope is entirely above -1 over k=12..18.
    id: 'imp34327-crossing-above-fitted-window',
    description: 'two-term slope stays in (-1, -0.89) across k=12..18 and the -1 crossing is >2 decades above k=18',
    holds: () =>
      WINDOW_SLOPE_MAX < -0.89 &&
      WINDOW_SLOPE_MIN > -1.0 &&
      IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.crossingInsideWindow === false &&
      K_STAR_MAPPED - 18 > 2.0,
  },
  {
    // but the crossing IS pre-pole: k* sits below the M2 sign-change ceiling k*~21.281.
    id: 'imp34327-crossing-is-pre-pole',
    description: 'k*_mapped ~ 20.48 < M2 ceiling 21.281 by ~0.8 decades, so the -1 crossing is reached before truncation',
    holds: () =>
      K_STAR_MAPPED < M2_CEILING_KSTAR &&
      M2_CEILING_KSTAR - K_STAR_MAPPED > 0.5 &&
      IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.crossingIsPrePole === true,
  },
  {
    // leading value -ln10/2 lies below the sampled plateau by the +ln10*3/u correction (0.17..0.26).
    id: 'imp34327-leading-value-gap-over-window',
    description: 'plateau sits 0.17..0.26 above the true leading -ln10/2 = -1.15129 across the window',
    holds: () => {
      const g12 = slopeOfU(U_12) - LEADING_SLOPE;
      const g18 = slopeOfU(U_18) - LEADING_SLOPE;
      return (
        Math.abs(LEADING_SLOPE - -1.151293) < 1e-5 &&
        g18 > 0.16 &&
        g18 < 0.18 &&
        g12 > 0.25 &&
        g12 < 0.27
      );
    },
  },
  {
    // honesty gate: measurement/derivation only, isRigorous false, no QED, SOTA + K_a untouched.
    id: 'imp34327-honesty-gate-no-qed',
    description: 'isRigorous false, no bound changed, NO QED, K_a>=0 untouched, no refereed bound is changed',
    holds: () =>
      IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING.verdict),
  },
];

for (const a of IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34327-widening-slope-minus-one-crossing-location assertion failed: ${a.id}`);
  }
}

export default IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING;
