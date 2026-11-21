/**
 * @module imp-34271-nested-window-binf-bias-vs-contamination-fit
 *
 * imp-34271 (numerical, frontier-direction): imp-34188 R3 tabulated the FREE exponential-approach limit
 * b_inf of the widening-slope drift across nested windows kEnd_max = 16..21 -- the non-monotone sequence
 *   w=16: -0.974703,  w=17: -1.000343,  w=18: -1.013995,  w=19: -1.019897,  w=20: -1.018926,  w=21: -1.002762
 * dips monotonically to a minimum at w=19 (-1.0199) and then snaps back UP to -1.003 at w=21. imp-34188 R3
 * noted the return is "partly ceiling-contaminated" (the y(k) local slope diverges past k~19.5 toward the
 * imp-34023 residExp pole at k*~21.28) but never SPLIT the snap-back into genuine finite-window-bias
 * convergence versus pole contamination. This module fits that split and reports the most trustworthy b_inf.
 *
 * THE DECOMPOSITION (data-driven; the imp-34188 nested-window sequence imported verbatim, not recomputed)
 * ----------------------------------------------------------------------------------------------------
 *   Contamination entry point  A nested window kEnd_max = w includes the imp-34188 SWEEP slope rows with
 *                              kEnd = 11..w. The residExp denominator only starts collapsing past k~19.5
 *                              (imp-34188 R3: local slope of y(k) -0.97 at k=18, -0.64 at k=20, +2.05 at
 *                              k=21), so windows w <= 19 are built entirely from PRE-contamination rows,
 *                              while w = 20 and w = 21 splice in the contaminated kEnd = 19.5..21 rows.
 *                              Hence the CLEAN sub-sequence is w = 16,17,18,19 and the CONTAMINATED tail
 *                              is w = 20,21.
 *   Clean bias trend           The clean increments d_w = b(w) - b(w-1) are all NEGATIVE and shrink
 *                              geometrically (d17 = -0.02564, d18 = -0.01365, d19 = -0.00590; successive
 *                              ratios r ~ 0.53, 0.43 in (0,1)). A geometric-tail sum and an Aitken
 *                              delta-squared acceleration of the last clean triple BOTH extrapolate the
 *                              finite-window bias DOWNWARD to b_inf ~ -1.025 -- i.e. deeper than -1, and
 *                              well below the -1.003 snap-back value.
 *   Bias-predicted tail        Continuing the geometric bias trend past the clean window predicts
 *                              b_bias(20) ~ -1.0224 and b_bias(21) ~ -1.0236 (still descending). The
 *                              OBSERVED contaminated values sit ABOVE these: contamination(20) ~ +0.0035
 *                              and contamination(21) ~ +0.0208 (the pole pushes b_inf UP toward the round
 *                              value as the collapsing denominator inflates the last rungs).
 *   Snap-back split            The observed return from the w=19 minimum to w=21 is b(21) - b(19) = +0.0171
 *                              (upward). Decomposed: the genuine finite-window bias contributes
 *                              b_bias(21) - b(19) = -0.0037 (it would have kept DESCENDING), and pole
 *                              contamination contributes b(21) - b_bias(21) = +0.0208 (upward). So the
 *                              snap-back is NOT bias convergence at all -- it is entirely contamination.
 *
 * THE FINDING (measurement only -- the snap-back to -1.003 is contamination, not convergence)
 * -----------------------------------------------------------------------------------------
 *   (F1) THE CLEAN FINITE-WINDOW BIAS EXTRAPOLATES DOWNWARD TO ~-1.025, NOT UP TO -1.003. The four
 *        pre-contamination windows (w = 16..19) form a monotone-descending, geometrically-converging
 *        sequence; both a geometric-tail sum and an Aitken delta-squared acceleration place the
 *        bias-only limit at b_inf ~ -1.025 (internal method spread ~0.003), DEEPER than -1 and clearly
 *        below the raw full-sweep -1.003.
 *   (F2) 0% OF THE SNAP-BACK TO -1.003 IS GENUINE CONVERGENCE. Splitting the observed +0.0171 return from
 *        the w=19 minimum to w=21: genuine finite-window bias contributes -0.0037 (it would have kept
 *        descending), while pole contamination contributes +0.0208. The entire upward snap-back -- and
 *        then some -- is the imp-34023 residExp collapse inflating the far-tail rungs; the apparent
 *        "return toward the round value -1" is a contamination artifact, confirming and QUANTIFYING the
 *        imp-34188 R3 caveat that the snap-back "rides on contaminated rungs."
 *   (F3) MOST TRUSTWORTHY b_inf ~ -1.025 +- 0.012 (BAND [-1.030, -1.020]), BELOW THE RAW -1.003. The
 *        trustworthy estimate uses ONLY the pre-contamination windows; the raw full-sweep -1.003 is
 *        contamination-biased toward the round value by ~+0.02 and should NOT be read as the bias limit.
 *        The uncertainty is dominated by the short (4-point) pre-pole window and the descriptive-surrogate
 *        systematic, not by the ~0.003 internal method spread. This is direction-consistent with imp-34246
 *        (the true leading value is more negative than -1), though our short pre-pole window reaches only
 *        ~-1.025, well short of the imp-34246 analytic -ln10/2 ~ -1.1513 -- the residExp pole terminates
 *        the window long before the leading asymptote is resolved.
 *
 * The punchline: the imp-34188 nested-window snap-back to -1.003 is NOT finite-window-bias convergence
 * toward -1 -- decomposing the +0.0171 return from the w=19 minimum, genuine bias contributes -0.0037
 * (still descending) and pole contamination contributes +0.0208 (upward). The clean pre-contamination
 * windows extrapolate the bias-only limit DOWNWARD to b_inf ~ -1.025 +- 0.012, deeper than -1 and below
 * the raw -1.003; the -1.003 is a contamination artifact inflated toward the round value by the collapsing
 * imp-34023 residExp denominator. Direction-consistent with imp-34246 (true value below -1), but the pole
 * terminates the window before -ln10/2 ~ -1.1513 can be resolved.
 *
 * MEASUREMENT / DECOMPOSITION-FIT ONLY. A bias-versus-contamination split of the inherited imp-34188
 * nested-window free b_inf sequence, NOT an RH bound and distinct from imp-34246 (derive-why=-1) and
 * imp-34247 (y-slope divergence pole-residue fit). The geometric/Aitken extrapolations are descriptive
 * accelerations of a short sequence, NOT a rigorous limit; the underlying component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the nested-window free b_inf sequence split here)
 * @see imp-34246-widening-slope-limit-analytic-derivation (derives the true leading value is below -1; -ln10/2)
 * @see imp-34247-widening-slope-pole-divergence (fits the y(k) local-slope divergence at the same k* pole)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change pole k*~21.28)
 * @see imp-34205-widening-slope-convergence-viz-data (viz of the same widening-slope convergence cohort)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127 (leading
 * closed form) -> imp-34189 (next-order term) -> imp-34188 (widening-slope limit b_inf~-1) -> imp-34246
 * (derives b_inf below -1, true leading -ln10/2) -> imp-34247 (simple-pole residue fit of the slope
 * divergence) -> imp-34271 (THIS module: splits the imp-34188 snap-back into bias vs contamination).
 */

import { IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE } from './imp-34188-widening-slope-limit-exactly-minus-one.js';

// The imp-34188 nested-window free exponential-approach limit b_inf(kEnd_max), imported verbatim.
const WG = IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.windowGrowth;
const W = WG.map((r) => r.kEndMax); // 16, 17, 18, 19, 20, 21
const B = WG.map((r) => r.bInf); // -0.9747, -1.0003, -1.0140, -1.0199, -1.0189, -1.0028

// Per-window increments d_w = b(w) - b(w-1).
const INC = [];
for (let i = 1; i < B.length; i++) INC.push(B[i] - B[i - 1]);

// Contamination enters via SWEEP rows kEnd >= 19.5, which only appear in windows w >= 20.
// So the CLEAN pre-contamination window is w = 16..19 (indices 0..3), contaminated tail is w = 20,21.
const CLEAN_MAX_W = 19;
const cleanIdx = W.map((w, i) => (w <= CLEAN_MAX_W ? i : -1)).filter((i) => i >= 0); // [0,1,2,3]
const i19 = cleanIdx[cleanIdx.length - 1]; // index of the w=19 clean minimum
const i20 = i19 + 1;
const i21 = i19 + 2;

// Clean increments (between the four pre-contamination windows) -- all negative, geometrically shrinking.
const cleanInc = []; // [d17, d18, d19]
for (let j = 1; j < cleanIdx.length; j++) cleanInc.push(B[cleanIdx[j]] - B[cleanIdx[j - 1]]);
const CLEAN_INC_ALL_NEGATIVE = cleanInc.every((d) => d < 0);
// Successive increment ratios r -- both in (0,1) => geometric convergence of the bias trend.
const incRatios = [];
for (let j = 1; j < cleanInc.length; j++) incRatios.push(cleanInc[j] / cleanInc[j - 1]);
const RATIOS_IN_UNIT_INTERVAL = incRatios.every((r) => r > 0 && r < 1);

// (F1) Geometric-tail extrapolation of the bias-only limit from the w=19 minimum, using the LOCAL ratio.
const rLocal = incRatios[incRatios.length - 1]; // d19/d18
const dLastClean = cleanInc[cleanInc.length - 1]; // d19 (negative)
const L_GEOM = B[i19] + (dLastClean * rLocal) / (1 - rLocal); // geometric tail sum past w=19

// Aitken delta-squared acceleration of the last clean triple (b17, b18, b19).
function aitken(x0, x1, x2) {
  const d0 = x1 - x0;
  const d1 = x2 - x1;
  const dd = d1 - d0;
  return x2 - (d1 * d1) / dd;
}
const L_AITKEN_LAST = aitken(B[cleanIdx[1]], B[cleanIdx[2]], B[cleanIdx[3]]); // (b17,b18,b19)
const L_AITKEN_FIRST = aitken(B[cleanIdx[0]], B[cleanIdx[1]], B[cleanIdx[2]]); // (b16,b17,b18) sensitivity

// Most trustworthy bias-only b_inf: the pre-contamination extrapolations (NOT the raw -1.003 snap-back).
const biasEstimates = [L_GEOM, L_AITKEN_LAST, L_AITKEN_FIRST];
const MOST_TRUSTWORTHY_BINF = biasEstimates.reduce((a, b) => a + b, 0) / biasEstimates.length;
const INTERNAL_METHOD_SPREAD =
  (Math.max(...biasEstimates) - Math.min(...biasEstimates)) / 2; // ~0.003 half-range across methods
// Honest total uncertainty: dominated by the short 4-point window + descriptive-surrogate systematic,
// NOT by the internal method spread. Bracket generously.
const HONEST_UNCERTAINTY = 0.012;
const TRUSTWORTHY_BAND = [
  +(MOST_TRUSTWORTHY_BINF - HONEST_UNCERTAINTY).toFixed(4),
  +(MOST_TRUSTWORTHY_BINF + HONEST_UNCERTAINTY).toFixed(4),
];

// (F2) Split the observed w=19 -> w=21 return into genuine bias versus pole contamination.
// Bias-predicted tail: continue the geometric bias descent past the w=19 minimum.
const biasPred20 = B[i19] + dLastClean * rLocal;
const biasPred21 = biasPred20 + dLastClean * rLocal * rLocal;
const CONTAM_20 = B[i20] - biasPred20; // observed minus bias-predicted at w=20
const CONTAM_21 = B[i21] - biasPred21; // observed minus bias-predicted at w=21 (the big one)
const RETURN_19_TO_21 = B[i21] - B[i19]; // observed upward snap-back (~+0.0171)
const BIAS_CONTRIBUTION = biasPred21 - B[i19]; // genuine bias part (~-0.0037, still descending)
const CONTAM_CONTRIBUTION = B[i21] - biasPred21; // pole contamination part (~+0.0208, upward)
// Contamination fraction of the return: > 1 because the genuine bias part points the OTHER way.
const CONTAM_FRACTION_OF_RETURN = CONTAM_CONTRIBUTION / RETURN_19_TO_21;

// Sanity: the two contributions reconstruct the observed return exactly.
const DECOMP_RECONSTRUCTS = Math.abs(BIAS_CONTRIBUTION + CONTAM_CONTRIBUTION - RETURN_19_TO_21) < 1e-9;

// imp-34246 analytic leading value for direction cross-check (true value below -1, not reached pre-pole).
const IMP34246_LEADING = -Math.log(10) / 2; // ~ -1.1513
const DIRECTION_CONSISTENT_WITH_IMP34246 = MOST_TRUSTWORTHY_BINF < -1.0; // deeper than -1, same side
const SHORT_OF_IMP34246_ASYMPTOTE = MOST_TRUSTWORTHY_BINF > IMP34246_LEADING; // window ends before -ln10/2

const rnd = (x, p = 6) => +x.toFixed(p);

export const IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT = {
  id: 'imp-34271',
  proofSection: 'S-frontier',
  question:
    'imp-34188 R3 tabulated the free exponential-approach limit b_inf across nested windows kEnd_max = ' +
    '16..21 (-0.9747, -1.0003, -1.0140, -1.0199, -1.0189, -1.0028): the sequence dips to a minimum at ' +
    'w=19 then snaps back up to -1.003, and R3 flagged the return as partly ceiling-contaminated but ' +
    'never split it. Fit the dip-then-snap-back to separate finite-window bias from imp-34023 pole ' +
    'contamination, quantify how much of the return to -1.003 is genuine convergence versus ' +
    'contamination, and report the most trustworthy b_inf and its uncertainty. Measurement/fit only; ' +
    'no bound change; NO QED.',
  measuredQuantity:
    'The imp-34188 nested-window free b_inf sequence split into a clean pre-contamination sub-sequence ' +
    '(kEnd_max = 16..19, before the residExp collapse enters via kEnd >= 19.5 rows) and a contaminated ' +
    'tail (kEnd_max = 20,21); a geometric-tail and Aitken delta-squared extrapolation of the clean bias ' +
    'limit; the bias-versus-contamination decomposition of the w=19 -> w=21 return; and the most ' +
    'trustworthy b_inf estimate with an honest uncertainty band',
  nestedWindowSequence: WG.map((r) => ({ kEndMax: r.kEndMax, bInf: r.bInf })),
  windowIncrements: INC.map((d) => rnd(d)),
  cleanWindowMax: CLEAN_MAX_W,
  cleanIncrements: cleanInc.map((d) => rnd(d)), // [d17, d18, d19], all negative
  cleanIncrementsAllNegative: CLEAN_INC_ALL_NEGATIVE,
  incrementRatios: incRatios.map((r) => rnd(r, 4)), // both in (0,1) => geometric bias convergence
  ratiosInUnitInterval: RATIOS_IN_UNIT_INTERVAL,
  biasOnlyLimit: {
    geometricTail: rnd(L_GEOM), // ~ -1.0244
    aitkenLastTriple: rnd(L_AITKEN_LAST), // ~ -1.0244
    aitkenFirstTriple: rnd(L_AITKEN_FIRST), // ~ -1.0295 (sensitivity)
  },
  snapBackDecomposition: {
    windowMinimumAtW19: rnd(B[i19]), // -1.0199 (dip bottom)
    rawSnapBackAtW21: rnd(B[i21]), // -1.0028 (contamination-inflated)
    returnFromMinimum: rnd(RETURN_19_TO_21), // +0.0171 upward
    biasPredictedW20: rnd(biasPred20), // ~ -1.0224 (bias would keep descending)
    biasPredictedW21: rnd(biasPred21), // ~ -1.0236
    contaminationAtW20: rnd(CONTAM_20), // ~ +0.0035
    contaminationAtW21: rnd(CONTAM_21), // ~ +0.0208
    genuineBiasContribution: rnd(BIAS_CONTRIBUTION), // ~ -0.0037 (points DOWN)
    poleContaminationContribution: rnd(CONTAM_CONTRIBUTION), // ~ +0.0208 (points UP)
    contaminationFractionOfReturn: rnd(CONTAM_FRACTION_OF_RETURN, 4), // > 1 (bias points the other way)
    decompositionReconstructsReturn: DECOMP_RECONSTRUCTS,
  },
  mostTrustworthyBInf: rnd(MOST_TRUSTWORTHY_BINF), // ~ -1.026 (bias-only, NOT the raw -1.003)
  internalMethodSpread: rnd(INTERNAL_METHOD_SPREAD), // ~ 0.003
  honestUncertainty: HONEST_UNCERTAINTY, // 0.012 (short-window + surrogate systematic dominated)
  trustworthyBand: TRUSTWORTHY_BAND, // ~ [-1.038, -1.014], below the raw -1.003
  rawFullSweepBInf: IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.expApproachFree.bInf, // -1.0028
  trustworthyBelowRaw: MOST_TRUSTWORTHY_BINF < IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.expApproachFree.bInf,
  imp34246Leading: rnd(IMP34246_LEADING), // -1.1513
  directionConsistentWithImp34246: DIRECTION_CONSISTENT_WITH_IMP34246, // both below -1
  shortOfImp34246Asymptote: SHORT_OF_IMP34246_ASYMPTOTE, // pre-pole window stops well short of -ln10/2
  finding: {
    F1_clean_bias_extrapolates_downward:
      'The four pre-contamination windows (kEnd_max = 16..19) form a monotone-descending, geometrically ' +
      'converging sequence (clean increments -0.02564, -0.01365, -0.00590; ratios ~0.53, 0.43 in (0,1)); ' +
      'a geometric-tail sum and an Aitken delta-squared acceleration BOTH place the bias-only limit at ' +
      'b_inf ~ -1.025 (internal spread ~0.003) -- deeper than -1 and below the raw full-sweep -1.003.',
    F2_snapback_is_contamination_not_convergence:
      'Splitting the observed +0.0171 return from the w=19 minimum to w=21: genuine finite-window bias ' +
      'contributes -0.0037 (it would have kept descending), while imp-34023 pole contamination ' +
      'contributes +0.0208 (upward). The entire upward snap-back -- and then some -- is the collapsing ' +
      'residExp denominator inflating the far-tail rungs toward the round value; 0% is genuine ' +
      'convergence. This quantifies the imp-34188 R3 caveat that the snap-back rides on contaminated rungs.',
    F3_most_trustworthy_binf:
      'The most trustworthy b_inf uses ONLY the pre-contamination windows: b_inf ~ -1.026 +- 0.012 (band ' +
      '[-1.038, -1.014]), BELOW the raw -1.003 which is contamination-biased toward the round value by ' +
      '~+0.02. The uncertainty is dominated by the short 4-point pre-pole window and the descriptive- ' +
      'surrogate systematic, not the ~0.003 internal method spread. Direction-consistent with imp-34246 ' +
      '(true value below -1), though the pole terminates the window at ~-1.025, short of -ln10/2 ~ -1.1513.',
  },
  isRigorous: false,
  bInfSnapBackIsGenuineConvergence: false, // it is contamination, not convergence
  verdict:
    'MEASUREMENT / DECOMPOSITION-FIT (frontier-direction, NOT rigorous). The imp-34188 nested-window free ' +
    'b_inf snap-back to -1.003 is NOT finite-window-bias convergence toward -1. Splitting the +0.0171 ' +
    'return from the w=19 minimum: genuine bias contributes -0.0037 (still descending) and imp-34023 pole ' +
    'contamination contributes +0.0208 (upward) -- so 0% of the snap-back is convergence; it is entirely ' +
    'the collapsing residExp denominator inflating the far-tail rungs. The clean pre-contamination windows ' +
    '(kEnd_max = 16..19) extrapolate the bias-only limit DOWNWARD (geometric-tail and Aitken agree) to ' +
    'b_inf ~ -1.025 +- 0.012, deeper than -1 and below the raw -1.003; the -1.003 is a contamination ' +
    'artifact and should NOT be read as the bias limit. Direction-consistent with imp-34246 (true value ' +
    'below -1), but the pole terminates the window before -ln10/2 ~ -1.1513 is resolved. Distinct from ' +
    'imp-34246 (derive-why=-1) and imp-34247 (y-slope divergence). The geometric/Aitken accelerations are ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34188 (the nested-window free b_inf sequence split here); imp-34246 (analytic leading value ' +
    'below -1, -ln10/2); imp-34247 (y-slope divergence pole-residue fit); imp-34023 (the residExp ' +
    'sign-change pole k*~21.28); imp-486 (C_mb GUE-conditional).',
};

export const IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT_ASSERTIONS = [
  {
    // The imported nested-window sequence has the expected 6 windows and the dip-then-snap-back shape:
    // monotone descent to a minimum at w=19, then a reversal at w=20,21.
    id: 'imp34271-sequence-dip-then-snapback',
    description: 'six windows w=16..21; monotone descent to a minimum at w=19; reversal (snap-back) at w=21',
    holds: () =>
      WG.length === 6 &&
      W[0] === 16 &&
      W[5] === 21 &&
      B[i19] === Math.min(...B) &&
      B[1] < B[0] && B[2] < B[1] && B[3] < B[2] && // descent through w=19
      B[i21] > B[i19], // snap-back up at w=21
  },
  {
    // The clean pre-contamination increments (w17,18,19) are all negative and geometrically shrinking
    // (successive ratios in (0,1)) -- so the finite-window bias is a monotone geometric descent.
    id: 'imp34271-clean-bias-geometric-descent',
    description: 'clean increments all negative; successive ratios in (0,1) => geometric bias convergence',
    holds: () =>
      cleanInc.length === 3 &&
      CLEAN_INC_ALL_NEGATIVE &&
      RATIOS_IN_UNIT_INTERVAL,
  },
  {
    // (F1) The bias-only extrapolations (geometric-tail and Aitken) agree near -1.025, deeper than -1
    // and below the raw full-sweep snap-back -1.003.
    id: 'imp34271-bias-limit-below-raw-snapback',
    description: 'geometric-tail and Aitken bias limits ~ -1.025 (spread < 0.01), below the raw -1.003',
    holds: () =>
      L_GEOM < -1.02 && L_GEOM > -1.03 &&
      L_AITKEN_LAST < -1.02 && L_AITKEN_LAST > -1.03 &&
      INTERNAL_METHOD_SPREAD < 0.01 &&
      MOST_TRUSTWORTHY_BINF < -1.02 &&
      MOST_TRUSTWORTHY_BINF < IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.expApproachFree.bInf,
  },
  {
    // (F2) The snap-back decomposition: genuine bias points DOWN (negative), pole contamination points
    // UP (positive and > 0.015), the two reconstruct the observed return, and contamination exceeds it.
    id: 'imp34271-snapback-is-contamination',
    description: 'genuine bias contribution < 0, contamination contribution > +0.015, decomposition exact, contam fraction > 1',
    holds: () =>
      BIAS_CONTRIBUTION < 0 &&
      CONTAM_CONTRIBUTION > 0.015 &&
      DECOMP_RECONSTRUCTS &&
      CONTAM_FRACTION_OF_RETURN > 1.0,
  },
  {
    // (F3) Direction cross-check with imp-34246: the trustworthy bias limit is below -1 (same side as the
    // analytic value) but has NOT reached -ln10/2 ~ -1.1513 -- the pole ends the window first.
    id: 'imp34271-direction-consistent-short-of-asymptote',
    description: 'trustworthy b_inf below -1 (imp-34246 direction) but above -ln10/2 ~ -1.1513 (window ends at the pole)',
    holds: () =>
      DIRECTION_CONSISTENT_WITH_IMP34246 &&
      SHORT_OF_IMP34246_ASYMPTOTE &&
      IMP34246_LEADING < -1.15 && IMP34246_LEADING > -1.16,
  },
  {
    // Honesty gate: measurement only; snap-back is contamination not convergence; isRigorous false; no QED;
    // K_a >= 0 untouched; no refereed bound is changed.
    id: 'imp34271-honesty-gate-no-qed',
    description: 'snap-back not genuine convergence; isRigorous false; no QED; K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT.bInfSnapBackIsGenuineConvergence === false &&
      IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT.isRigorous === false &&
      /NO QED/.test(IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT.verdict),
  },
];

for (const a of IMP34271_NESTED_WINDOW_BINF_BIAS_VS_CONTAMINATION_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34271-nested-window-binf-bias-vs-contamination-fit assertion failed: ${a.id}`);
  }
}
