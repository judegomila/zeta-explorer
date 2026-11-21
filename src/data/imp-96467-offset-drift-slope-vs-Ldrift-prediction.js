/**
 * @module imp-96467-offset-drift-slope-vs-Ldrift-prediction
 *
 * imp-96467 (numerical, frontier-direction): DERIVE the analytic leading prediction for the
 * imp-96431 W2 offset-drift slope d(offset)/d(log10 crossover) from the L(N) = log(effectiveHeight)
 * running and compare it against the measured -0.00143/decade.
 *
 * imp-96431 W2 found the (sigma-inflection minus crossover) offset drifts STRICTLY MONOTONICALLY
 * (16/16 steps) and near-linearly in the crossover log10 (slope ~-0.00143/decade, R^2 ~0.96) across
 * ~5.24 decades, attributing the drift to the L(N) log-factor running that breaks the exact-logistic
 * form (imp-96405 M3 / imp-33744) rather than a random walk. It never CHECKED the measured slope
 * against the analytic L-drift prediction. This module derives that prediction and reports the ratio.
 *
 * THE DERIVATION (leading L-drift term, from the imp-33744 logistic-flow closed form)
 * ----------------------------------------------------------------------------------
 * imp-33744 established, in the E_flow-negligible logistic flow d sigma/dt = -g(t) sigma(1-sigma),
 * t = ln N, g(t) = (1/2)(1 - d ln L/d ln N) -> (1/2)(1 - 1/t) = (t-1)/(2t):
 *
 *     the sigmoid inflection sits at sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - 1/(t-1)^2.       (A)
 *
 * The crossover (imp-33723 E_coll = E_trunc fixed point) is sigma = 1/2. Because sigma decreases in
 * t and the inflection sits BELOW 1/2 by delta = 1/(t-1)^2, the inflection lands at LARGER N. To
 * leading order the t-offset follows from the local slope sigma_prime(t) = -g sigma(1-sigma) = -g/4
 * at sigma = 1/2:
 *
 *     -delta = sigma_prime * (t_infl - t_cross)  =>  t_infl - t_cross = 4 delta / g = 4/(g (t-1)^2).
 *
 * Converting to log10 and substituting g = (t-1)/(2t) gives the leading offset and its slope:
 *
 *     offset(t)  =  (t_infl - t_cross)/ln10  =  8 t / ((t-1)^3 ln10),                            (B)
 *     d offset / d(log10 crossover)  =  ln10 * d offset/dt  =  -8 (2t + 1) / (t - 1)^4.          (C)
 *
 * (B) is strongly curved in t (offset ~ 8/((t-1)^2 ln10) for large t), so the pointwise slope (C)
 * runs from ~-0.00422/decade at the small-N end (crossover log10 ~7.41, t ~17.1) to ~-0.00076/decade
 * at the large-N end (crossover log10 ~12.65, t ~29.1); the measured single linear-fit slope is the
 * secant across the whole range, so the fair comparison is a LINEAR FIT of (B) over the SAME
 * crossover points as imp-96431, matched against imp-96431 own linear fit.
 *
 * THE MEASUREMENTS
 * ----------------
 *   (M1) Recomputing the imp-96431 measured-offset linear fit reproduces its reported
 *        -0.00143/decade EXACTLY (reuse gate: identical rows / model in play).
 *   (M2) The analytic leading prediction (B), linearly fitted over the same crossover points, gives
 *        slope ~-0.00173/decade (R^2 ~0.94, near-linear like the measured drift). The endpoint
 *        offsets it predicts (~+0.01431 -> +0.00455) bracket the measured (~+0.01235 -> +0.00443).
 *   (M3) RATIO predicted/measured ~ 1.21: the L-drift term alone OVER-predicts the drift slope by
 *        ~21%. So the L(N) log-factor running is the DOMINANT and correctly-signed source of the
 *        monotone drift (it reproduces the sign, near-linearity, and magnitude to ~20%), but it does
 *        NOT fully account for it -- a ~17-21% residual sub-leading term remains (higher orders in
 *        1/t dropped from g = (t-1)/(2t) and from the single-step local-slope displacement, plus the
 *        small E_flow-off vs the imp-96431 flow-off inflection-finder discretization). The mean
 *        absolute per-row offset residual is ~6e-4 in log10.
 *
 * VERDICT: the imp-96431 W2 attribution is CONFIRMED in direction and magnitude -- the leading
 * L-drift prediction d(offset)/d(log10 crossover) = -8(2t+1)/(t-1)^4 gives a fitted -0.00173/decade
 * vs the measured -0.00143/decade (ratio ~1.21), so the log-factor running is the dominant driver
 * but a ~20% residual sub-leading correction survives. This SHARPENS (does not overturn) imp-96431.
 *
 * DERIVATION + MEASUREMENT ONLY. Conditional-share landmark diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96431-knee-crossover-tracking-wide-range (W2: measured -0.00143/decade monotone drift)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - 1/(t-1)^2)
 * @see imp-96405-knee-crossover-forced-vs-coincidental (M3: L(N) running breaks the exact-logistic form)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover fixed point)
 */

import { IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE } from './imp-96431-knee-crossover-tracking-wide-range.js';

const LN10 = Math.log(10);

// Rows from imp-96431 (same model / same crossover ladder); keep only rows with a located offset.
const ROWS_SRC = IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.rows.filter((r) => r.offsetLog10 != null);
const CROSSES = ROWS_SRC.map((r) => r.crossoverLog10);
const MEAS_OFFSETS = ROWS_SRC.map((r) => r.offsetLog10);

// Analytic leading L-drift prediction (B): offset(t) = 8 t / ((t-1)^3 ln10), t = ln N_cross.
function offsetAnalytic(crossLog10) {
  const t = crossLog10 * LN10;
  return (8 * t) / ((t - 1) ** 3 * LN10);
}
// Analytic pointwise slope (C): d offset / d(log10 crossover) = -8 (2t + 1) / (t-1)^4.
function slopeAnalyticPointwise(crossLog10) {
  const t = crossLog10 * LN10;
  return -8 * (2 * t + 1) / (t - 1) ** 4;
}

const ANA_OFFSETS = CROSSES.map(offsetAnalytic);

// Ordinary-least-squares slope + R^2 of y vs x (same estimator as imp-96431 OFFSET_FIT).
function linFit(xs, ys) {
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
  return { slope: sxy / sxx, r2: (sxy * sxy) / (sxx * syy) };
}

const MEAS_FIT = linFit(CROSSES, MEAS_OFFSETS);
const ANA_FIT = linFit(CROSSES, ANA_OFFSETS);
const RATIO_PRED_OVER_MEAS = ANA_FIT.slope / MEAS_FIT.slope;
const FRACTION_ACCOUNTED = MEAS_FIT.slope / ANA_FIT.slope; // measured / predicted
const RESIDUAL_FRACTION = 1 - FRACTION_ACCOUNTED; // sub-leading share the L-drift term misses

const MEAN_ABS_OFFSET_RESIDUAL =
  MEAS_OFFSETS.map((m, i) => Math.abs(m - ANA_OFFSETS[i])).reduce((a, b) => a + b, 0) / CROSSES.length;

const CROSS_LO = Math.min(...CROSSES);
const CROSS_HI = Math.max(...CROSSES);
const CROSS_MID = (CROSS_LO + CROSS_HI) / 2;

const ROWS = ROWS_SRC.map((r, i) => ({
  crossoverLog10: r.crossoverLog10,
  measuredOffsetLog10: r.offsetLog10,
  analyticOffsetLog10: +ANA_OFFSETS[i].toFixed(5),
  analyticSlopePointwise: +slopeAnalyticPointwise(r.crossoverLog10).toFixed(6),
}));

export const IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION = Object.freeze({
  id: 'imp-96467',
  proofSection: 'S-frontier',
  question:
    'Does the imp-96431 W2 measured offset-drift slope d(offset)/d(log10 crossover) ~ -0.00143/decade ' +
    'match the analytic leading prediction from the L(N) = log(effectiveHeight) sub-leading running ' +
    '(differentiating sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - 1/(t-1)^2, imp-33744)? ' +
    'Derivation + measurement only; conditional-share diagnostic, NOT an RH bound; NO QED.',
  verdictShort:
    'Leading L-drift prediction fits to -0.00173/decade vs measured -0.00143/decade (ratio ~1.21): ' +
    'the log-factor running is the DOMINANT, correctly-signed driver but OVER-predicts by ~21%, so a ' +
    '~20% residual sub-leading term survives -- SHARPENS imp-96431 W2.',
  analyticOffsetFormula: 'offset(t) = 8 t / ((t-1)^3 ln10),  t = ln N_cross   (leading L-drift term)',
  analyticSlopeFormula: 'd offset / d(log10 crossover) = -8 (2t + 1) / (t-1)^4   (pointwise, t = ln N_cross)',
  crossoverSpanDecades: +(CROSS_HI - CROSS_LO).toFixed(3),
  measuredFit: {
    slopePerDecade: +MEAS_FIT.slope.toFixed(6), // ~-0.00143 (reproduces imp-96431 OFFSET_FIT)
    r2: +MEAS_FIT.r2.toFixed(4),
    imp96431ReportedSlope: IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.offset.fit.slopePerDecade,
  },
  analyticFit: {
    slopePerDecade: +ANA_FIT.slope.toFixed(6), // ~-0.00173
    r2: +ANA_FIT.r2.toFixed(4), // ~0.94 (near-linear, like the measured drift)
    pointwiseSlopeAtLoCrossover: +slopeAnalyticPointwise(CROSS_LO).toFixed(6), // ~-0.00422
    pointwiseSlopeAtMidCrossover: +slopeAnalyticPointwise(CROSS_MID).toFixed(6), // ~-0.00158
    pointwiseSlopeAtHiCrossover: +slopeAnalyticPointwise(CROSS_HI).toFixed(6), // ~-0.00076
  },
  ratioPredictedOverMeasured: +RATIO_PRED_OVER_MEAS.toFixed(4), // ~1.21
  fractionOfDriftAccountedByLdrift: +FRACTION_ACCOUNTED.toFixed(4), // ~0.826 (measured/predicted)
  residualSubleadingFraction: +RESIDUAL_FRACTION.toFixed(4), // ~0.174 (term the L-drift misses)
  meanAbsOffsetResidualLog10: +MEAN_ABS_OFFSET_RESIDUAL.toFixed(6), // ~6e-4
  rows: ROWS,
  finding: {
    M1_reuse_reproduces_measured_slope:
      'A fresh OLS fit of the imp-96431 measured offsets vs crossover log10 reproduces its reported ' +
      '-0.00143/decade exactly -- the identical rows / component model are in play.',
    M2_analytic_leading_prediction:
      'The leading L-drift prediction offset(t) = 8 t/((t-1)^3 ln10), fitted over the same crossover ' +
      'points, gives -0.00173/decade (R^2 ~0.94, near-linear like the data); its endpoint offsets ' +
      '(~+0.0143 -> +0.0046) bracket the measured (~+0.0124 -> +0.0044). The pointwise slope ' +
      '-8(2t+1)/(t-1)^4 runs -0.0042/decade (small N) -> -0.0008/decade (large N).',
    M3_ratio_and_residual:
      'Ratio predicted/measured ~1.21: the L(N) log-factor running is the DOMINANT, correctly-signed ' +
      'driver of the monotone drift (sign, near-linearity, magnitude to ~20%) but OVER-predicts the ' +
      'slope by ~21%, leaving a ~17-21% residual sub-leading correction (higher orders in 1/t dropped ' +
      'from g = (t-1)/(2t) and the single-step local-slope displacement, plus flow-off finder ' +
      'discretization). The L-drift term alone does NOT fully account for the drift.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). Differentiating the imp-33744 ' +
    'closed form sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - 1/(t-1)^2 through the local logistic ' +
    'slope gives the leading L-drift offset offset(t) = 8 t/((t-1)^3 ln10) and slope ' +
    'd(offset)/d(log10 crossover) = -8(2t+1)/(t-1)^4 (t = ln N_cross). Fitted over the imp-96431 ' +
    'crossover ladder this predicts -0.00173/decade (R^2 ~0.94) against the measured -0.00143/decade ' +
    '(a fresh fit reproduces imp-96431 exactly), ratio predicted/measured ~1.21. So the L(N) = ' +
    'log(effectiveHeight) running is the DOMINANT and correctly-signed source of the monotone offset ' +
    'drift -- it reproduces the sign, the near-linearity and the magnitude to ~20% -- but it OVER-' +
    'predicts by ~21%, leaving a ~17-21% residual sub-leading term (higher orders in 1/t and the ' +
    'flow-off finder discretization). imp-96431 W2 attribution CONFIRMED in direction and magnitude; ' +
    'the residual SHARPENS rather than overturns it. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96431 (measured -0.00143/decade monotone offset drift); imp-33744 (sigma_infl = 1/2 - ' +
    'g_prime/(2 g^2) = 1/2 - 1/(t-1)^2); imp-96405 M3 (L(N) running breaks the exact-logistic form); ' +
    'imp-33723 (closed-form crossover fixed point); imp-486 (C_mb GUE-conditional).',
});

export default IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96467_ASSERTIONS = [
  {
    id: 'imp96467-reuse-reproduces-imp96431-measured-slope',
    description: 'a fresh OLS fit of the imp-96431 offsets reproduces its reported -0.00143/decade',
    holds: () =>
      Math.abs(MEAS_FIT.slope - IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.offset.fit.slopePerDecade) < 1e-5,
  },
  {
    id: 'imp96467-analytic-slope-is-negative-and-near-linear',
    description: 'the leading L-drift prediction fits a negative, near-linear slope in the crossover log10',
    holds: () => ANA_FIT.slope < 0 && ANA_FIT.r2 > 0.9,
  },
  {
    id: 'imp96467-ratio-order-unity',
    description: 'predicted/measured slope ratio is order unity (~1.0-1.5): L-drift is the dominant driver',
    holds: () => RATIO_PRED_OVER_MEAS > 1.0 && RATIO_PRED_OVER_MEAS < 1.5,
  },
  {
    id: 'imp96467-residual-subleading-term-survives',
    description: 'the L-drift term does not FULLY account for the drift: a nonzero residual sub-leading share remains',
    holds: () => RESIDUAL_FRACTION > 0.05 && RESIDUAL_FRACTION < 0.4,
  },
  {
    id: 'imp96467-pointwise-slope-runs-steeper-at-small-N',
    description: 'the pointwise analytic slope is steeper (more negative) at the small-N crossover than the large-N one',
    holds: () => slopeAnalyticPointwise(CROSS_LO) < slopeAnalyticPointwise(CROSS_HI),
  },
  {
    id: 'imp96467-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION.isRigorous === false &&
      /NO QED/.test(IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION.verdict) &&
      /refereed bound is changed/i.test(IMP96467_OFFSET_DRIFT_SLOPE_VS_LDRIFT_PREDICTION.verdict),
  },
];

for (const a of IMP96467_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96467-offset-drift-slope-vs-Ldrift-prediction assertion failed: ${a.id}`);
  }
}
