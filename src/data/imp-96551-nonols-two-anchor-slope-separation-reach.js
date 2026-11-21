/**
 * imp-96551 -- ASSESSMENT: can a NON-OLS estimator (inverse-variance weighting, or a Bayesian fit
 * with the known single-height log-scatter sigma = sqrt(pi^2/8) ~ 1.11 as prior) combining ONLY the
 * two imp-96493 interior anchors separate the p = 0 vs p = -1/4 dip-depth exponents better than the
 * imp-96528 OLS floor SE(p) >= 0.21, or does the irreducible chi scatter cap every estimator?
 *
 * BACKGROUND. imp-96528 quantified that the fixed 10^6 Odlyzko set supplies only ~6 mutually
 * independent unclipped +/-30 percent interior heights (just 2 in the excursion regime T >= 1.5e5:
 * exactly the two imp-96493 anchors T = 1.5e5 and 3.879e5), and that an OLS fit of log relErr against
 * log T bottoms out at SE(p) >= ~0.21 (reached only at +/-10 percent with ~20 narrower-span heights),
 * separating the systematic (p = 0) and sampling-noise (p = -1/4) readings by at most ~1.2 sigma. That
 * verdict left OPEN whether the OLS SE(p) >= 0.21 is an estimator artifact -- OLS estimates the noise
 * from residuals, so at K = 2 it gives NO error bar at all (zero residual dof). This module asks
 * whether a smarter estimator that INJECTS the known scatter sigma = sqrt(pi^2/8) can do better on the
 * two anchors alone.
 *
 * THE TWO ANCHORS AS A KNOWN-VARIANCE SLOPE PROBLEM. Write x = log T, y = log relErr, and the dip
 * depth as relErr ~ C T^p, so y_i = log C + p x_i + eta_i with eta_i the irreducible single-height
 * log-relErr scatter (relErr ~ sqrt(2/n_w) |Z|, Z ~ N(0,1), Var(log|Z|) = trigamma(1/2)/4 = pi^2/8,
 * so sd(eta) = sigma = sqrt(pi^2/8) ~ 1.1107, s-independent -- imp-96528). The two anchors are
 * mutually independent (non-overlapping windows), so eta_1, eta_2 are independent with EQUAL variance.
 * The intercept log C is a free nuisance, so with two points only the DIFFERENCE carries slope:
 *   p_hat = (y_2 - y_1) / (x_2 - x_1),   Var(p_hat) = 2 sigma^2 / (Delta_x)^2,   Delta_x = log(T_2/T_1).
 *
 * ESTIMATOR (1): INVERSE-VARIANCE WEIGHTING. IVW weights each height by 1/Var(eta_i). But the scatter
 * sigma is s-independent and EQUAL across the two anchors, so the weights are equal: IVW is IDENTICAL
 * to OLS in point estimate. Weighting buys NOTHING when the variances are equal -- there is no
 * heteroscedasticity to exploit. (This is why imp-96528 never separated the two estimators.)
 *
 * ESTIMATOR (2): BAYESIAN / KNOWN-SIGMA (GLS). Feeding the known sigma as a prior on the noise turns
 * the fit into a known-variance GLS / Gaussian-likelihood posterior. Unlike OLS -- which at K = 2 has
 * zero residual dof and returns an UNDEFINED error bar -- the known-sigma posterior DOES yield a finite
 * slope SD:  SD(p) = sigma * sqrt(2) / Delta_x. And here sigma * sqrt(2) = sqrt(pi^2/8) * sqrt(2) =
 * sqrt(pi^2/4) = pi/2 EXACTLY, so SD(p) = (pi/2) / Delta_x. With Delta_x = log(3.879e5/1.5e5) ~ 0.9501
 * (only ~0.41 decade of lever arm), SD(p) ~ 1.653 -- about 7.9x LOOSER than the OLS floor 0.21, and it
 * separates Delta_p = 1/4 by only ~0.151 sigma. So the Bayesian estimator supplies an error bar where
 * OLS could not, but that bar is dramatically WORSE, not better: two points on a 0.41-decade arm carry
 * no averaging and a short baseline.
 *
 * BAYESIAN MODEL COMPARISON (the two readings as two discrete hypotheses). Instead of a continuous
 * slope, test H_A: p = 0 against H_B: p = -1/4 directly. With the intercept free, only y_2 - y_1
 * discriminates: the model prediction difference between the hypotheses is Delta_p * Delta_x =
 * 0.25 * 0.9501 = 0.2375, against noise sd(y_2 - y_1) = sqrt(2) sigma = pi/2 = 1.5708, giving a
 * discrimination of 0.2375 / 1.5708 = 0.151 sigma -- IDENTICAL to the continuous-slope separation.
 * The two framings coincide because both extract the identical difference statistic; the chi-scatter
 * prior constrains the NOISE magnitude, not the slope, so it cannot shrink the posterior below the
 * likelihood width.
 *
 * WHY NO ESTIMATOR ESCAPES. For a linear model with known noise the Gauss-Markov / Cramer-Rao bound
 * floors the variance of ANY unbiased slope estimator at 2 sigma^2 / (Delta_x)^2 = the known-sigma GLS
 * value; OLS, IVW and the Bayesian posterior mean all achieve it (they are the same BLUE here). The
 * only way to shrink SD(p) further is an informative prior ON p itself -- i.e. assuming p is near 0 or
 * near -1/4, which is assuming the answer. A legitimate prior on the chi scatter does not touch the
 * slope likelihood. So the irreducible chi scatter CAPS every estimator on the two anchors.
 *
 * FINDINGS.
 *  1. Inverse-variance weighting = OLS here: the scatter sigma is s-independent and equal across the
 *     two anchors, so there is no heteroscedasticity to exploit and weighting gives zero gain.
 *  2. The known-sigma / Bayesian estimator does give a DEFINED two-point error bar (which OLS cannot),
 *     SD(p) = (pi/2) / Delta_x ~ 1.653 -- but that is ~7.9x LOOSER than the imp-96528 OLS floor 0.21,
 *     separating Delta_p = 1/4 by only ~0.151 sigma (worse even than imp-96528s ~0.58 sigma native
 *     +/-30 percent full-band reading, which used all six heights, not just the two anchors).
 *  3. Bayesian model comparison of the two discrete readings gives the SAME 0.151 sigma: the prior is
 *     on the noise, not the slope, so it cannot beat the likelihood width. The Cramer-Rao / BLUE bound
 *     floors every unbiased estimator at the same 2 sigma^2/(Delta_x)^2. No non-OLS estimator on the
 *     two anchors improves the p separation; the irreducible chi scatter caps them all.
 *
 * VERDICT. NO. A non-OLS estimator combining ONLY the two imp-96493 anchors cannot separate the p = 0
 * and p = -1/4 dip-depth exponents better than the imp-96528 OLS SE(p) >= 0.21 -- it does ~7.9x WORSE.
 * Inverse-variance weighting collapses to OLS because the log-relErr scatter sigma = sqrt(pi^2/8) is
 * s-independent and equal across the anchors (no heteroscedasticity to exploit); the known-sigma /
 * Bayesian estimator supplies a finite two-point error bar SD(p) = (pi/2)/Delta_x ~ 1.653 where OLS
 * gives none, but on the short 0.41-decade anchor baseline that bar separates Delta_p = 1/4 by only
 * ~0.151 sigma. Bayesian model comparison of the two readings reproduces the identical 0.151 sigma:
 * the chi-scatter prior constrains the noise, not the slope, so it cannot shrink the posterior below
 * the Cramer-Rao / BLUE floor 2 sigma^2/(Delta_x)^2 that OLS, IVW and the Bayesian mean all share.
 * The irreducible chi scatter caps EVERY estimator on the two anchors; the imp-96528 SE(p) >= 0.21
 * floor (which already used all accessible heights) is not an OLS artifact and cannot be beaten by a
 * smarter estimator on the pair. This confirms imp-96528 and does NOT close the imp-96510
 * systematic-vs-noise sub-gap. Assessment only; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96528-independent-unclipped-height-count-exponent-fit-reach (the OLS SE(p) >= 0.21 floor)
 * @see imp-96493-excursion-2sigma-interior-scan (the two interior anchors T = 1.5e5, 3.879e5)
 * @see imp-96510-deeper-interior-dip-height-source-reach (the open systematic-vs-noise sub-gap)
 *
 * Import-light: no zeros bundle, no sibling imports. The two anchor centers T = 1.5e5 and 3.879e5 and
 * the OLS floor SE(p) = 0.21 are baked literals (imp-96493 / imp-96528); every SD / sigma-separation
 * is recomputed here.
 */

const T_ANCHOR_LO = 1.5e5; // imp-96493 reference excursion (z = 1.9234), the deepest below-envelope dip
const T_ANCHOR_HI = 3.879e5; // imp-96493 deepest higher clean dip (z = 1.0358)
const OLS_FLOOR_SE = 0.21; // imp-96528 best-reach OLS slope error (at +/-10%, ~20 heights)

// competing exponents: systematic relErr ~ T^0, sampling-noise relErr ~ T^(-1/4).
const P_SYSTEMATIC = 0;
const P_SAMPLING_NOISE = -0.25;
const DELTA_P = Math.abs(P_SYSTEMATIC - P_SAMPLING_NOISE); // 0.25 separation the estimator must resolve

// irreducible single-height log-relErr scatter (imp-96528): sd(log|Z|), Var = trigamma(1/2)/4 = pi^2/8.
const SIGMA_LOG_RELERR = Math.sqrt((Math.PI * Math.PI) / 8); // ~1.1107, s-independent and equal across heights

// the two-anchor lever arm in log T (only ~0.41 decade).
const DELTA_X = Math.log(T_ANCHOR_HI / T_ANCHOR_LO); // ~0.9501
const LEVER_ARM_DECADES = DELTA_X / Math.log(10); // ~0.413

// known-variance / GLS / Bayesian posterior slope SD on the two mutually-independent equal-variance anchors:
// Var(p_hat) = 2 sigma^2 / (Delta_x)^2, and sigma*sqrt(2) = sqrt(pi^2/4) = pi/2 exactly.
const SE_TWO_ANCHOR = (SIGMA_LOG_RELERR * Math.SQRT2) / DELTA_X; // (pi/2)/Delta_x ~ 1.653
const SEPARATION_SIGMA_CONTINUOUS = DELTA_P / SE_TWO_ANCHOR; // ~0.151

// Bayesian two-hypothesis discrimination: signal Delta_p*Delta_x against noise sqrt(2)*sigma.
const MODEL_CMP_SIGNAL = DELTA_P * DELTA_X; // 0.2375: prediction gap between p=0 and p=-1/4 across the pair
const MODEL_CMP_NOISE = Math.SQRT2 * SIGMA_LOG_RELERR; // pi/2 ~ 1.5708: sd(y2 - y1)
const SEPARATION_SIGMA_MODELCMP = MODEL_CMP_SIGNAL / MODEL_CMP_NOISE; // ~0.151, identical to continuous

// how the two-anchor bar compares to the imp-96528 OLS floor.
const WORSE_THAN_OLS_FLOOR = SE_TWO_ANCHOR / OLS_FLOOR_SE; // ~7.9x looser
const BEATS_OLS_FLOOR = SE_TWO_ANCHOR < OLS_FLOOR_SE; // false
const CAN_RESOLVE_SUBGAP = SEPARATION_SIGMA_CONTINUOUS >= 3; // false

export const IMP96551_NONOLS_TWO_ANCHOR_SLOPE_SEPARATION_REACH = {
  ticket: 'imp-96551',
  question:
    'Can a non-OLS estimator (inverse-variance weighting, or a Bayesian fit with the known single-height log-scatter sigma = sqrt(pi^2/8) ~ 1.11 as prior) combining only the two imp-96493 interior anchors separate the p = 0 vs p = -1/4 dip-depth exponents better than the imp-96528 OLS floor SE(p) >= 0.21, or does the irreducible chi scatter cap every estimator?',
  method:
    'Model log relErr = log C + p log T + eta with eta the irreducible single-height scatter sd(eta) = sigma = sqrt(pi^2/8) ~ 1.11 (s-independent, equal across the two mutually-independent anchors). With the intercept a free nuisance only the difference carries slope, so p_hat = (y2 - y1)/Delta_x with Var = 2 sigma^2/(Delta_x)^2. (1) Inverse-variance weighting: equal variances => equal weights => identical to OLS. (2) Known-sigma / Bayesian GLS: yields a defined two-point SD(p) = sigma*sqrt(2)/Delta_x = (pi/2)/Delta_x (OLS gives none at K=2). Also run a Bayesian two-hypothesis comparison of p=0 vs p=-1/4. Import-light; baked anchor and OLS-floor literals.',
  anchors: {
    tLo: T_ANCHOR_LO, // 1.5e5
    tHi: T_ANCHOR_HI, // 3.879e5
    leverArmLogT: DELTA_X, // ~0.9501
    leverArmDecades: LEVER_ARM_DECADES, // ~0.413: a short baseline, no averaging
    note: 'The two imp-96493 excursion-regime anchors; mutually independent (non-overlapping +/-30% windows), equal-variance.',
  },
  perHeightScatter: {
    sigmaLogRelErr: SIGMA_LOG_RELERR, // sqrt(pi^2/8) ~ 1.1107
    sigmaTimesSqrt2IsHalfPi: SIGMA_LOG_RELERR * Math.SQRT2, // pi/2 exactly
    derivation: 'relErr ~ sqrt(2/n_w)*|Z|, Z ~ N(0,1); Var(log|Z|) = trigamma(1/2)/4 = pi^2/8; s-independent and EQUAL across the two anchors (imp-96528).',
  },
  inverseVarianceWeighting: {
    identicalToOLS: true,
    reason: 'The scatter sigma is s-independent and equal across the two anchors, so IVW weights are equal -- no heteroscedasticity to exploit; the point estimate and its variance coincide with OLS. Weighting gives ZERO gain.',
  },
  knownSigmaBayesian: {
    definedAtK2: true, // unlike OLS, which has zero residual dof at K=2
    SE_slope: SE_TWO_ANCHOR, // (pi/2)/Delta_x ~ 1.653
    separationSigma: SEPARATION_SIGMA_CONTINUOUS, // ~0.151
    worseThanOLSFloorBy: WORSE_THAN_OLS_FLOOR, // ~7.9x
    note: 'The known-sigma prior supplies a finite two-point error bar where OLS gives none, but on the 0.41-decade anchor baseline that bar is ~7.9x LOOSER than the imp-96528 OLS floor 0.21 and separates Delta_p = 1/4 by only ~0.151 sigma.',
  },
  bayesianModelComparison: {
    signal: MODEL_CMP_SIGNAL, // Delta_p*Delta_x ~ 0.2375
    noise: MODEL_CMP_NOISE, // sqrt(2)*sigma = pi/2 ~ 1.5708
    separationSigma: SEPARATION_SIGMA_MODELCMP, // ~0.151, identical to the continuous framing
    note: 'Testing p=0 vs p=-1/4 as two discrete hypotheses reproduces the identical 0.151 sigma: the chi-scatter prior constrains the noise, not the slope, so it cannot beat the likelihood width.',
  },
  cramerRaoFloor: {
    varianceFloor: (2 * SIGMA_LOG_RELERR * SIGMA_LOG_RELERR) / (DELTA_X * DELTA_X), // 2 sigma^2/(Delta_x)^2
    note: 'For a linear model with known noise the Gauss-Markov / Cramer-Rao bound floors ANY unbiased slope estimator at 2 sigma^2/(Delta_x)^2; OLS, IVW and the Bayesian posterior mean all achieve it. Only an informative prior ON p (assuming the answer) could shrink it -- illegitimate.',
  },
  beatsOLSFloor: BEATS_OLS_FLOOR, // false
  canResolveSubGap: CAN_RESOLVE_SUBGAP, // false
  verdict:
    'NO. A non-OLS estimator combining ONLY the two imp-96493 anchors cannot separate the p = 0 and p = -1/4 dip-depth exponents better than the imp-96528 OLS SE(p) >= 0.21 -- it does ~7.9x WORSE. Inverse-variance weighting collapses to OLS because the log-relErr scatter sigma = sqrt(pi^2/8) is s-independent and equal across the anchors (no heteroscedasticity to exploit); the known-sigma / Bayesian estimator supplies a finite two-point error bar SD(p) = (pi/2)/Delta_x ~ 1.653 where OLS gives none, but on the short ~0.41-decade anchor baseline that bar separates Delta_p = 1/4 by only ~0.151 sigma. Bayesian model comparison of the two readings reproduces the identical 0.151 sigma: the chi-scatter prior constrains the noise, not the slope, so it cannot shrink the posterior below the Cramer-Rao / BLUE floor 2 sigma^2/(Delta_x)^2 that OLS, IVW and the Bayesian mean all share. The irreducible chi scatter caps EVERY estimator on the two anchors; the imp-96528 SE(p) >= 0.21 floor (which already used all accessible heights) is not an OLS artifact and cannot be beaten by a smarter estimator on the pair. This confirms imp-96528 and does NOT close the imp-96510 systematic-vs-noise sub-gap. Assessment only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96510 / imp-96528 convention).
export const IMP96551_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: a non-OLS estimator (inverse-variance '
  + 'weighting, or a Bayesian known-sigma fit) on ONLY the two imp-96493 anchors cannot beat the imp-96528 OLS '
  + 'SE(p) >= 0.21 -- IVW = OLS (equal s-independent scatter, no heteroscedasticity), and the known-sigma bar '
  + 'SD(p) = (pi/2)/Delta_x ~ 1.653 is ~7.9x LOOSER (~0.151 sigma on Delta_p = 1/4). The irreducible chi scatter '
  + 'caps every estimator; the imp-96510 systematic-vs-noise sub-gap stays open; changes no bound.';

// --- self-executing internal-consistency assertions (formula re-derivation, generous tolerances) ---
(() => {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  // exponent separation is exactly 1/4
  if (rel(DELTA_P, 0.25) > 1e-12) throw new Error('imp-96551: exponent separation not 1/4');
  // irreducible scatter sqrt(pi^2/8) ~ 1.1107, and sigma*sqrt(2) = pi/2 exactly
  if (rel(SIGMA_LOG_RELERR, 1.110720734539592) > 1e-9) throw new Error('imp-96551: sigma(log relErr) drifted from sqrt(pi^2/8)');
  if (rel(SIGMA_LOG_RELERR * Math.SQRT2, Math.PI / 2) > 1e-12) throw new Error('imp-96551: sigma*sqrt(2) should equal pi/2 exactly');
  // two-anchor lever arm ~0.9501 log-units (~0.41 decade)
  if (rel(DELTA_X, 0.9501122803496657, 5e-6) > 5e-6) throw new Error('imp-96551: two-anchor lever arm drifted from ~0.9501');
  if (!(LEVER_ARM_DECADES > 0.40 && LEVER_ARM_DECADES < 0.42)) throw new Error('imp-96551: lever arm should be ~0.41 decade');
  // known-sigma / Bayesian two-point SD ~1.653 = (pi/2)/Delta_x
  if (rel(SE_TWO_ANCHOR, (Math.PI / 2) / DELTA_X) > 1e-12) throw new Error('imp-96551: two-anchor SD should equal (pi/2)/Delta_x');
  if (!(SE_TWO_ANCHOR > 1.6 && SE_TWO_ANCHOR < 1.7)) throw new Error('imp-96551: two-anchor SD(p) drifted from ~1.653');
  // it is LOOSER than the OLS floor, not tighter, by ~7.9x
  if (BEATS_OLS_FLOOR) throw new Error('imp-96551: two-anchor estimator must NOT beat the imp-96528 OLS floor 0.21');
  if (!(WORSE_THAN_OLS_FLOOR > 7 && WORSE_THAN_OLS_FLOOR < 9)) throw new Error('imp-96551: two-anchor bar should be ~7.9x looser than 0.21');
  // continuous and Bayesian-model-comparison separations coincide at ~0.151 sigma
  if (rel(SEPARATION_SIGMA_CONTINUOUS, SEPARATION_SIGMA_MODELCMP) > 1e-12) throw new Error('imp-96551: continuous and model-comparison separations should coincide');
  if (!(SEPARATION_SIGMA_CONTINUOUS > 0.14 && SEPARATION_SIGMA_CONTINUOUS < 0.16)) throw new Error('imp-96551: separation should be ~0.151 sigma');
  // cannot resolve the sub-gap at 3 sigma
  if (CAN_RESOLVE_SUBGAP) throw new Error('imp-96551: two-anchor estimator must NOT resolve the sub-gap at 3 sigma');
  // honesty gates
  if (!/NO QED/.test(IMP96551_NONOLS_TWO_ANCHOR_SLOPE_SEPARATION_REACH.verdict))
    throw new Error('imp-96551: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96551_NONOLS_TWO_ANCHOR_SLOPE_SEPARATION_REACH.verdict))
    throw new Error('imp-96551: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96551_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96551_HONEST_BANNER) && /NO QED/.test(IMP96551_HONEST_BANNER)))
    throw new Error('imp-96551: IMP96551_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96551_NONOLS_TWO_ANCHOR_SLOPE_SEPARATION_REACH;
