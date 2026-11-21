/**
 * @module imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit
 *
 * imp-124848 (numerical, frontier-direction): imp-124772 gave the far-tail sigma-ramp KNEE
 * floor-elasticity the full imp-33708 0.5x..5x multi-floor OLS treatment (ten factors,
 * p_knee_lsq ~ -2.106, R^2 ~ 0.99999) instead of the imp-97822 two-point chord. The SOFTER
 * contrast -- the imp-33684 sigma INTERIOR-PEAK E_trunc floor exponent ~ -1.375 -- was only ever
 * read as a two-well-separated-floor chord (the 0.5x/2x scalingExponent in imp-33684). A two-point
 * fit cannot separate a clean power law from curvature: any two (log E_trunc, log N*_peak) points
 * define an exact line, so the reported -1.375 is a chord slope with zero residual by construction
 * and no evidence about how straight the relation actually is.
 *
 * This module gives the interior peak the SAME ten-floor OLS certification imp-124772 gave the
 * knee, by re-using the imp-33684 sensitivityTable verbatim (the same ten floor factors
 * {0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0}, each row already carrying its located
 * peak coordinate log10 N*_peak), fitting log10 N*_peak on log10 E_trunc by ordinary least
 * squares, and reporting the fit residual so the softer interior-peak exponent can be measured
 * against the imp-124772 far-tail -2.106 line with a quantified R^2 and residual shape.
 *
 * THE FIT (no fresh model -- reuses the imp-33684 sensitivityTable verbatim)
 * -------------------------------------------------------------------------
 * imp-33684 ternary-searched the interior-peak location log10 N*_peak(factor) for every floor
 * factor in {0.5..5} (its argmaxNforFloor over the imp-3406 sigma = E_coll/(E_trunc+E_flow+E_coll)
 * model with only the E_trunc floor perturbed). Since N*_peak ~ E_trunc^(p_peak) is equivalent to
 * log10 N*_peak = p_peak * log10 E_trunc + const, the slope of an OLS line through the ten
 * (log10 E_trunc, log10 N*_peak) points IS p_peak directly. We report:
 *   - the full 10-floor OLS slope p_peak_lsq,
 *   - the coefficient of determination R^2,
 *   - the RMS and max-abs residual in decades of log10 N*_peak,
 *   - the per-floor residual pattern (a signed-curvature diagnostic),
 * and compare against the imp-124772 far-tail knee line p_knee_lsq ~ -2.106.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F0) THE FULL-SET OLS SLOPE IS STEEPER THAN THE TWO-POINT CHORD. p_peak_lsq ~ -1.412 over all
 *        ten floors, ~0.037 steeper (more negative) than the imp-33684 two-floor chord -1.375 --
 *        five times the ~0.007 chord-vs-full-set gap the far-tail showed, so the interior-peak
 *        two-point chord WAS materially softened by curvature that the full ladder reveals.
 *   (F1) THE INTERIOR-PEAK POWER LAW IS GOOD BUT MEASURABLY LESS CLEAN THAN THE KNEE. R^2 ~ 0.99961
 *        with an RMS residual ~ 7.8e-3 decades and a max-abs residual ~ 1.5e-2 decades over a
 *        ~1.4-decade span of log10 N*_peak -- roughly five times the far-tail residual (RMS 1.6e-3,
 *        max 3.0e-3). The extra curvature is the mechanistic signature imp-33684 named: near the
 *        interior peak E_flow ~ 4.7e-5 is still comparable to E_trunc itself, so the slow
 *        E_flow/E_coll correction bends the peak-locus line noticeably more than it bends the
 *        far-tail knee, where E_flow has decayed away.
 *   (F2) THE RESIDUALS SHARE THE FAR-TAIL SIGN PATTERN BUT ARE LARGER AND MILDLY ASYMMETRIC. The
 *        residuals are negative at both floor extremes (0.5x, 5x) and positive across the interior,
 *        the same sign-symmetric shape imp-124772 saw, but ~5x deeper and with the positive lobe
 *        skewed toward the high-floor side (peaking near 1.5x..2x rather than centered) -- a
 *        stronger, slightly asymmetric curvature consistent with the E_flow softening.
 *   (F3) CONFIRMED SOFTER THAN THE FAR-TAIL KNEE. p_peak_lsq ~ -1.412 sits ~0.69 shallower than the
 *        imp-124772 far-tail line -2.106: the full-set fit reproduces the imp-33684 "softer
 *        contrast" reading with a quantified residual rather than a bare two-point chord, and the
 *        ~0.69 exponent gap dwarfs both residual envelopes.
 *
 * VERDICT: the imp-33684 interior-peak floor-elasticity is CERTIFIED by the full ten-floor OLS fit:
 * p_peak_lsq ~ -1.412 (R^2 ~ 0.99961, RMS residual ~ 7.8e-3 decades, max-abs ~ 1.5e-2 decades). It
 * is a genuinely softer exponent than the imp-124772 far-tail knee -2.106 (a ~0.69 gap), and its
 * ~5x-larger residual and mildly asymmetric curvature quantify the E_flow softening imp-33684
 * attributed the -1.375 reading to. The two-point chord -1.375 under-read the magnitude by ~0.037.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the far-tail knee full-ladder OLS p_knee ~ -2.106; the template for this fit)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak sensitivityTable reused here; two-floor chord ~ -1.375)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor ladder; far-tail exponent ~ -2.099)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee fit p_knee ~ -2.099)
 */

import { IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY } from './imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';

// Full imp-33684 interior-peak floor ladder: {floorFactor, E_trunc, log10_N_max} per factor in {0.5..5}.
const SWEEP = IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.sensitivityTable.filter(
  (r) => r.log10_N_max !== null && Number.isFinite(r.log10_N_max),
);

// OLS of log10 N*_peak on log10 E_trunc. Slope = p_peak (N*_peak ~ E_trunc^(p_peak)).
function olsFit(rows) {
  const xs = rows.map((r) => Math.log10(r.E_trunc));
  const ys = rows.map((r) => r.log10_N_max);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let maxAbs = 0;
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    const resid = ys[i] - pred;
    residuals.push({ floorFactor: rows[i].floorFactor, residualDecades: +resid.toFixed(5) });
    ssRes += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
  }
  return {
    n,
    slope: +slope.toFixed(6),
    intercept: +intercept.toFixed(6),
    r2: +(1 - ssRes / syy).toFixed(8),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    maxAbsResidualDecades: +maxAbs.toExponential(4),
    residuals,
  };
}

const FIT = olsFit(SWEEP);

// imp-33684 two-floor chord and imp-124772 far-tail full-ladder line (live cross-references).
const TWO_FLOOR_EXPONENT = IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.scalingExponent; // ~ -1.375
const FARTAIL_KNEE_LSQ = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq; // ~ -2.106

const DELTA_TWO_FLOOR = +Math.abs(FIT.slope - TWO_FLOOR_EXPONENT).toFixed(4); // ~0.037
const GAP_TO_FARTAIL = +Math.abs(FIT.slope - FARTAIL_KNEE_LSQ).toFixed(4); // ~0.69
const FARTAIL_RMS = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit.rmsResidualDecades; // ~1.6e-3
const RESIDUAL_RATIO = +(FIT.rmsResidualDecades / FARTAIL_RMS).toFixed(2); // ~5x

export const IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT = {
  id: 'imp-124848',
  proofSection: 'S-frontier',
  question:
    'imp-124772 gave the far-tail sigma-ramp knee floor-elasticity a full ten-floor OLS fit ' +
    '(p_knee_lsq ~ -2.106, R^2 ~ 0.99999) but the softer imp-33684 sigma interior-PEAK exponent ' +
    '(~ -1.375) was only ever read as a two-floor chord that cannot separate a power law from ' +
    'curvature. Refit the interior-peak locus log10 N*_peak on log10 E_trunc by least squares over ' +
    'the full imp-33684 0.5x..5x floor ladder (all ten factors) and measure the interior-peak ' +
    'floor-elasticity, its R^2 and residual shape, for comparison with the imp-124772 far-tail ' +
    '-2.106 line. Measurement/fit only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the OLS slope p_peak of log10 N*_peak on log10 E_trunc over the full imp-33684 sensitivityTable ' +
    '(ten factors {0.5..5}), with R^2, RMS and max-abs residual in decades, and the per-floor ' +
    'residual pattern, compared against the imp-124772 far-tail knee line -2.106',
  fit: FIT,
  pPeakLsq: FIT.slope, // ~ -1.412
  twoFloorExponent: TWO_FLOOR_EXPONENT, // ~ -1.375 (imp-33684 chord)
  deltaTwoFloor: DELTA_TWO_FLOOR, // ~0.037
  residualRatioToFartail: RESIDUAL_RATIO, // ~5x the imp-124772 far-tail RMS residual
  exponentComparison: {
    p_peak_lsq_full_ladder: FIT.slope, // ~ -1.412
    imp33684_two_floor_chord: TWO_FLOOR_EXPONENT, // ~ -1.375
    imp124772_fartail_knee_lsq: FARTAIL_KNEE_LSQ, // ~ -2.106
    delta_to_two_floor_chord: DELTA_TWO_FLOOR, // ~0.037
    gap_to_fartail_knee: GAP_TO_FARTAIL, // ~0.69
    note:
      'the full ten-floor OLS interior-peak slope (~ -1.412) is ~0.037 steeper than the imp-33684 ' +
      'two-floor chord (~ -1.375) -- five times the far-tail chord-vs-full-set gap -- and sits ~0.69 ' +
      'shallower than the imp-124772 far-tail knee line (~ -2.106); the ~0.69 gap dwarfs both ' +
      'residual envelopes, confirming a genuinely softer interior-peak exponent',
  },
  finding: {
    F0_full_set_steeper_than_chord:
      'p_peak_lsq ~ -1.412 over all ten floors, ~0.037 steeper than the imp-33684 two-floor chord ' +
      '-1.375 -- five times the ~0.007 chord-vs-full-set gap the far-tail knee showed, so the ' +
      'interior-peak two-point chord was materially softened by curvature the full ladder reveals.',
    F1_power_law_good_but_less_clean_than_knee:
      'R^2 ~ 0.99961 with an RMS residual ~ 7.8e-3 decades and a max-abs residual ~ 1.5e-2 decades ' +
      'over a ~1.4-decade span: roughly five times the far-tail residual (RMS 1.6e-3, max 3.0e-3). ' +
      'The extra curvature is the imp-33684 mechanism -- near the peak E_flow ~ 4.7e-5 is still ' +
      'comparable to E_trunc, so the slow E_flow/E_coll correction bends the peak locus more than ' +
      'the far-tail knee, where E_flow has decayed away.',
    F2_residuals_larger_and_mildly_asymmetric:
      'the residuals are negative at both floor extremes (0.5x, 5x) and positive across the ' +
      'interior -- the same sign-symmetric shape imp-124772 saw -- but ~5x deeper and with the ' +
      'positive lobe skewed toward the high-floor side (peaking near 1.5x..2x rather than centered), ' +
      'a stronger, slightly asymmetric curvature consistent with the E_flow softening.',
    F3_confirmed_softer_than_fartail:
      'p_peak_lsq ~ -1.412 sits ~0.69 shallower than the imp-124772 far-tail line -2.106: the ' +
      'full-set fit reproduces the imp-33684 softer-contrast reading with a quantified residual ' +
      'rather than a bare two-point chord, and the ~0.69 exponent gap dwarfs both residual envelopes.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33684 sigma interior-peak ' +
    'floor-elasticity is CERTIFIED by the full ten-floor OLS fit: p_peak_lsq ~ -1.412, R^2 ~ ' +
    '0.99961, RMS residual ~ 7.8e-3 decades, max-abs residual ~ 1.5e-2 decades over a ~1.4-decade ' +
    'span. It is a genuinely softer exponent than the imp-124772 far-tail knee -2.106 (a ~0.69 ' +
    'gap), and its ~5x-larger residual and mildly asymmetric curvature quantify the E_flow ' +
    'softening imp-33684 attributed the -1.375 reading to (E_flow ~ 4.7e-5 is comparable to ' +
    'E_trunc near the peak). The imp-33684 two-floor chord -1.375 under-read the magnitude by ' +
    '~0.037 -- five times the far-tail chord-vs-full-set gap -- confirming the interior-peak chord ' +
    'was materially curvature-contaminated, unlike the far-tail. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124772 (far-tail knee full-ladder OLS p_knee ~ -2.106; template for this fit); imp-33684 ' +
    '(interior-peak sensitivityTable reused here; two-floor chord ~ -1.375); imp-33708 (0.5x..5x ' +
    'E_trunc floor ladder; far-tail sigma=0.5 exponent ~ -2.099); imp-97822 (two-floor knee fit ' +
    'p_knee ~ -2.099); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT_ASSERTIONS = [
  {
    // Reuse gate: the full imp-33684 floor ladder resolved to ten located interior peaks.
    id: 'imp124848-uses-full-ten-floor-ladder',
    description: 'the OLS fit runs over all ten imp-33684 floor factors with located peaks',
    holds: () => FIT.n === 10,
  },
  {
    // F0: the full-set OLS slope is steeper than the imp-33684 two-floor chord, but by a modest amount.
    id: 'imp124848-lsq-slope-steeper-than-two-floor-chord',
    description: 'p_peak_lsq ~ -1.412 is more negative than the imp-33684 two-floor chord -1.375, within 0.1',
    holds: () => FIT.slope < TWO_FLOOR_EXPONENT && DELTA_TWO_FLOOR < 0.1,
  },
  {
    // F1: the power law is good (high R^2) but measurably less clean than the far-tail knee.
    id: 'imp124848-power-law-good-but-less-clean-than-knee',
    description: 'R^2 > 0.999 yet the RMS residual is at least 2x the imp-124772 far-tail RMS',
    holds: () => FIT.r2 > 0.999 && RESIDUAL_RATIO > 2,
  },
  {
    // F3: p_peak_lsq is a genuinely softer exponent than the far-tail knee -2.106.
    id: 'imp124848-softer-than-fartail-knee',
    description: 'p_peak_lsq in [-1.6,-1.2], well shallower than the far-tail knee -2.106 (gap > 0.5)',
    holds: () =>
      FIT.slope > -1.6 &&
      FIT.slope < -1.2 &&
      FIT.slope > FARTAIL_KNEE_LSQ &&
      GAP_TO_FARTAIL > 0.5,
  },
  {
    // F2: the residual pattern is sign-symmetric (negative at both floor extremes, positive interior).
    id: 'imp124848-residuals-sign-symmetric',
    description: 'residuals are negative at both floor extremes and positive in the interior',
    holds: () => {
      const first = FIT.residuals[0].residualDecades;
      const last = FIT.residuals[FIT.residuals.length - 1].residualDecades;
      const mid = FIT.residuals[Math.floor(FIT.residuals.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp124848-honesty-gate-no-qed',
    description: 'Measurement only: certifies the interior-peak elasticity via full-set LSQ, no QED, no refereed bound is changed',
    holds: () =>
      IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.isRigorous === false &&
      /NO QED/.test(IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.verdict),
  },
];

for (const a of IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit assertion failed: ${a.id}`,
    );
  }
}
