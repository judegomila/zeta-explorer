/**
 * @module imp-96508-next-order-correction-Ldrift-offset-residual
 *
 * imp-96508 (proof/derivation, frontier-direction): DERIVE the next order in 1/t of the imp-96467
 * leading L-drift offset prediction and MEASURE whether it closes the surviving ~17-21% residual
 * (imp-96467 leading prediction -0.00173/decade OVER-predicts the imp-96431 measured -0.00143/decade
 * by ~1.21x).
 *
 * imp-96467 derived the LEADING L-drift offset from the imp-33744 logistic-flow closed form and found
 * it reproduces the sign, near-linearity and magnitude of the imp-96431 W2 monotone offset drift to
 * ~20%, but OVER-predicts the fitted slope by ~21% (ratio predicted/measured ~1.21), leaving an
 * unmodeled ~17-21% residual sub-leading term attributed to "higher orders in 1/t dropped from
 * g = (t-1)/(2t) and the single-step local-slope displacement, plus flow-off finder discretization."
 * This module derives the FIRST of those two candidate sources -- the next order in 1/t -- and
 * measures how much of the residual it actually closes.
 *
 * THE NEXT-ORDER DERIVATION (from the exact inflection condition + a two-term displacement)
 * ---------------------------------------------------------------------------------------
 * In the E_flow-negligible logistic flow d sigma/dt = -g(t) sigma(1-sigma), t = ln N, with the
 * imp-33744 running coupling g(t) = (t-1)/(2t), the inflection condition sigma_prime_prime = 0 is
 * EXACT:  sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - 1/(t-1)^2, so the inflection sits BELOW the
 * crossover sigma = 1/2 by delta(t) = 1/(t-1)^2 (delta evaluated at t_infl, not t_cross).
 *
 * The imp-96467 LEADING offset used a ONE-term local-slope displacement at t_cross:
 *   -delta = sigma_prime(t_cross) * Dt,  sigma_prime(t_cross) = -g/4  =>  Dt_0 = 4 delta/g = 8t/(t-1)^3.
 *
 * The NEXT order keeps (i) the curvature of sigma over the interval and (ii) that delta must be read
 * at t_infl, not t_cross. Taylor-expanding sigma(t_infl) - sigma(t_cross) to second order with the
 * exact flow derivatives at sigma = 1/2 (sigma_prime = -g/4, sigma_prime_prime = -g_prime/4) and
 * delta(t_infl) = delta + delta_prime Dt gives
 *     Dt + (g_prime/(2g)) Dt^2 = (4/g)[delta + delta_prime Dt],
 * whose solution Dt = Dt_0 + Dt_1 has the closed-form relative correction
 *
 *     Dt_1/Dt_0 = (4/g)[delta_prime - g_prime delta/(2g)] = -4 (4t + 1) / (t - 1)^4.               (*)
 *
 * With g = (t-1)/(2t), g_prime = 1/(2t^2), delta = 1/(t-1)^2, delta_prime = -2/(t-1)^3, both pieces of
 * (*) -- the delta-at-t_infl piece (-16t/(t-1)^4) and the curvature piece (-4/(t-1)^4) -- are
 * O(1/t^3) RELATIVE to the leading term. The corrected offset is therefore
 *
 *     offset_2(t) = (8t/((t-1)^3 ln10)) * [1 - 4(4t+1)/(t-1)^4].                                    (**)
 *
 * THE MEASUREMENT (over the imp-96431 crossover ladder, same 17 rows / same model)
 * -------------------------------------------------------------------------------
 *   (M1) The relative correction (*) is TINY: -0.416% at the small-N end (t ~ 17.06) shrinking to
 *        -0.075% at the large-N end (t ~ 29.13). It is negative, so it moves the prediction toward the
 *        measured value (reduces the over-prediction) -- correct direction.
 *   (M2) The corrected linear-fit slope is -0.001722/decade vs the leading -0.001731/decade and the
 *        measured -0.001430/decade: the ratio predicted/measured drops only from ~1.2107 to ~1.2046.
 *   (M3) So the next order in 1/t closes only ~2.4% of the ~17.4% residual (residual share 0.1741 ->
 *        0.1699). The 1/t expansion of the offset is "clean" -- the first correction is suppressed by
 *        1/t^3, with NO O(1/t) or O(1/t^2) term -- so truncated asymptotics CANNOT be the source of the
 *        ~20% gap.
 *
 * VERDICT: the next-order 1/t correction to the imp-96467 leading L-drift offset is O(1/t^3) relative
 * (Dt_1/Dt_0 = -4(4t+1)/(t-1)^4) and closes only ~2.4% of the ~17-21% residual. This ISOLATES the
 * residual: it is NOT a dropped higher-order-in-1/t term but is dominated by the OTHER candidate
 * imp-96467 named -- the E_flow-negligible approximation and the flow-off inflection-finder
 * discretization / imp-3220-imp-3406 extrapolation-model imprecision. SHARPENS imp-96467 (which
 * lumped both candidates together); does NOT overturn it.
 *
 * DERIVATION + MEASUREMENT ONLY. Conditional-share landmark diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-96467-offset-drift-slope-vs-Ldrift-prediction (leading L-drift offset, ~1.21x over-predict)
 * @see imp-96431-knee-crossover-tracking-wide-range (measured -0.00143/decade monotone offset drift)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (exact sigma_infl = 1/2 - g_prime/(2 g^2))
 */

import { IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE } from './imp-96431-knee-crossover-tracking-wide-range.js';

const LN10 = Math.log(10);

// Same 17 rows / same crossover ladder as imp-96467 (keep only rows with a located offset).
const ROWS_SRC = IMP96431_KNEE_CROSSOVER_TRACKING_WIDE_RANGE.rows.filter((r) => r.offsetLog10 != null);
const CROSSES = ROWS_SRC.map((r) => r.crossoverLog10);
const MEAS_OFFSETS = ROWS_SRC.map((r) => r.offsetLog10);

// imp-96467 leading L-drift offset (B): offset(t) = 8 t / ((t-1)^3 ln10), t = ln N_cross.
function offsetLeading(crossLog10) {
  const t = crossLog10 * LN10;
  return (8 * t) / ((t - 1) ** 3 * LN10);
}
// Next-order relative correction (*): Dt_1/Dt_0 = -4 (4t + 1) / (t - 1)^4, t = ln N_cross.
function relCorrection(crossLog10) {
  const t = crossLog10 * LN10;
  return (-4 * (4 * t + 1)) / (t - 1) ** 4;
}
// Corrected offset (**): offset_2(t) = offset_leading(t) * (1 + Dt_1/Dt_0).
function offsetCorrected(crossLog10) {
  return offsetLeading(crossLog10) * (1 + relCorrection(crossLog10));
}

const LEAD_OFFSETS = CROSSES.map(offsetLeading);
const CORR_OFFSETS = CROSSES.map(offsetCorrected);

// Ordinary-least-squares slope + R^2 of y vs x (same estimator as imp-96431/imp-96467).
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
const LEAD_FIT = linFit(CROSSES, LEAD_OFFSETS);
const CORR_FIT = linFit(CROSSES, CORR_OFFSETS);

const RATIO_LEADING = LEAD_FIT.slope / MEAS_FIT.slope; // ~1.2107
const RATIO_CORRECTED = CORR_FIT.slope / MEAS_FIT.slope; // ~1.2046
const RESIDUAL_LEADING = 1 - MEAS_FIT.slope / LEAD_FIT.slope; // ~0.1741
const RESIDUAL_CORRECTED = 1 - MEAS_FIT.slope / CORR_FIT.slope; // ~0.1699
const FRACTION_OF_RESIDUAL_CLOSED = (RESIDUAL_LEADING - RESIDUAL_CORRECTED) / RESIDUAL_LEADING; // ~0.024

const CROSS_LO = Math.min(...CROSSES);
const CROSS_HI = Math.max(...CROSSES);

const ROWS = ROWS_SRC.map((r) => ({
  crossoverLog10: r.crossoverLog10,
  measuredOffsetLog10: r.offsetLog10,
  leadingOffsetLog10: +offsetLeading(r.crossoverLog10).toFixed(5),
  correctedOffsetLog10: +offsetCorrected(r.crossoverLog10).toFixed(5),
  relCorrection: +relCorrection(r.crossoverLog10).toFixed(6),
}));

export const IMP96508_NEXT_ORDER_CORRECTION_LDRIFT_OFFSET_RESIDUAL = Object.freeze({
  id: 'imp-96508',
  proofSection: 'S-frontier',
  question:
    'Does the next order in 1/t of the imp-96467 leading L-drift offset prediction close the surviving ' +
    '~17-21% residual (leading -0.00173/decade over-predicts the imp-96431 measured -0.00143/decade by ' +
    '~1.21x)? Derivation + measurement only; conditional-share diagnostic, NOT an RH bound; NO QED.',
  verdictShort:
    'The next-order 1/t correction is O(1/t^3) relative (Dt_1/Dt_0 = -4(4t+1)/(t-1)^4, -0.42% to -0.08% ' +
    'across the ladder) and closes only ~2.4% of the ~17.4% residual (ratio 1.2107 -> 1.2046): the 1/t ' +
    'expansion is clean, so the residual is the E_flow-off / finder-discretization piece, NOT truncated ' +
    'asymptotics -- SHARPENS imp-96467.',
  relCorrectionFormula: 'Dt_1/Dt_0 = (4/g)[delta_prime - g_prime delta/(2g)] = -4 (4t + 1) / (t - 1)^4,  t = ln N_cross',
  correctedOffsetFormula: 'offset_2(t) = (8 t / ((t-1)^3 ln10)) * [1 - 4(4t+1)/(t-1)^4]',
  crossoverSpanDecades: +(CROSS_HI - CROSS_LO).toFixed(3),
  measuredSlopePerDecade: +MEAS_FIT.slope.toFixed(6), // ~-0.001430 (reproduces imp-96431/imp-96467)
  leadingSlopePerDecade: +LEAD_FIT.slope.toFixed(6), // ~-0.001731 (imp-96467)
  correctedSlopePerDecade: +CORR_FIT.slope.toFixed(6), // ~-0.001722
  ratioLeadingOverMeasured: +RATIO_LEADING.toFixed(4), // ~1.2107
  ratioCorrectedOverMeasured: +RATIO_CORRECTED.toFixed(4), // ~1.2046
  residualLeading: +RESIDUAL_LEADING.toFixed(4), // ~0.1741
  residualCorrected: +RESIDUAL_CORRECTED.toFixed(4), // ~0.1699
  fractionOfResidualClosedByNextOrder: +FRACTION_OF_RESIDUAL_CLOSED.toFixed(4), // ~0.024
  relCorrectionAtLoCrossover: +relCorrection(CROSS_LO).toFixed(6), // ~-0.004164 (t ~17.06)
  relCorrectionAtHiCrossover: +relCorrection(CROSS_HI).toFixed(6), // ~-0.000751 (t ~29.13)
  rows: ROWS,
  finding: {
    M1_correction_is_tiny_and_correctly_signed:
      'The next-order relative correction Dt_1/Dt_0 = -4(4t+1)/(t-1)^4 is negative (moves the prediction ' +
      'toward the measured value, reducing the over-prediction) but tiny: -0.416% at the small-N crossover ' +
      '(t ~17.06) shrinking to -0.075% at the large-N crossover (t ~29.13). It is O(1/t^3) RELATIVE to the ' +
      'leading offset -- there is NO O(1/t) or O(1/t^2) term.',
    M2_corrected_slope_barely_moves:
      'The corrected linear-fit slope is -0.001722/decade vs the leading -0.001731/decade and the measured ' +
      '-0.001430/decade; the ratio predicted/measured drops only from ~1.2107 to ~1.2046.',
    M3_closes_essentially_none_of_the_residual:
      'The next order in 1/t closes only ~2.4% of the ~17.4% residual (share 0.1741 -> 0.1699). Because the ' +
      'offset 1/t expansion is clean (first correction suppressed by 1/t^3), truncated asymptotics CANNOT be ' +
      'the source of the ~20% gap; the residual is dominated by the E_flow-negligible approximation and the ' +
      'flow-off inflection-finder discretization / imp-3220-imp-3406 extrapolation-model imprecision.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). Solving the exact logistic inflection ' +
    'condition sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - 1/(t-1)^2 against the crossover sigma = 1/2 with a ' +
    'TWO-term (curvature + delta-at-t_infl) displacement gives the next-order relative correction to the ' +
    'imp-96467 leading offset Dt_1/Dt_0 = (4/g)[delta_prime - g_prime delta/(2g)] = -4(4t+1)/(t-1)^4 ' +
    '(t = ln N_cross), which is O(1/t^3) relative -- there is no O(1/t) or O(1/t^2) term. Over the imp-96431 ' +
    'crossover ladder it shifts the fitted slope from -0.001731/decade to -0.001722/decade against the ' +
    'measured -0.001430/decade, moving the ratio only from ~1.2107 to ~1.2046 and closing just ~2.4% of the ' +
    '~17.4% residual. So the surviving ~17-21% over-prediction is NOT a dropped higher-order-in-1/t term: ' +
    'the offset 1/t expansion is clean and the residual is dominated by the OTHER imp-96467 candidate -- the ' +
    'E_flow-negligible approximation and the flow-off inflection-finder discretization / imp-3220-imp-3406 ' +
    'extrapolation-model imprecision. This SHARPENS imp-96467 (which lumped the two candidates together) and ' +
    'does NOT overturn it. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96467 (leading L-drift offset, ~1.21x over-predict, ~17-21% residual); imp-96431 (measured ' +
    '-0.00143/decade monotone offset drift); imp-33744 (exact sigma_infl = 1/2 - g_prime/(2 g^2) = 1/2 - ' +
    '1/(t-1)^2); imp-486 (C_mb GUE-conditional).',
});

export default IMP96508_NEXT_ORDER_CORRECTION_LDRIFT_OFFSET_RESIDUAL;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96508_ASSERTIONS = [
  {
    id: 'imp96508-reuse-reproduces-imp96467-leading-ratio',
    description: 'a fresh fit of the imp-96467 leading offset over the same ladder reproduces the ~1.21 over-prediction',
    holds: () => RATIO_LEADING > 1.19 && RATIO_LEADING < 1.23,
  },
  {
    id: 'imp96508-next-order-correction-is-negative-and-small',
    description: 'the next-order relative correction is negative (right direction) and < 1% in magnitude across the ladder',
    holds: () =>
      relCorrection(CROSS_LO) < 0 &&
      relCorrection(CROSS_HI) < 0 &&
      Math.abs(relCorrection(CROSS_LO)) < 0.01 &&
      Math.abs(relCorrection(CROSS_HI)) < Math.abs(relCorrection(CROSS_LO)),
  },
  {
    id: 'imp96508-correction-does-not-close-the-residual',
    description: 'the next order in 1/t closes only a small fraction (<10%) of the ~17-21% residual',
    holds: () => FRACTION_OF_RESIDUAL_CLOSED > 0 && FRACTION_OF_RESIDUAL_CLOSED < 0.1,
  },
  {
    id: 'imp96508-residual-still-survives',
    description: 'a substantial residual (>15%) survives the next-order correction -- SHARPENS not overturns imp-96467',
    holds: () => RESIDUAL_CORRECTED > 0.15 && RESIDUAL_CORRECTED < 0.25,
  },
  {
    id: 'imp96508-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96508_NEXT_ORDER_CORRECTION_LDRIFT_OFFSET_RESIDUAL.isRigorous === false &&
      /NO QED/.test(IMP96508_NEXT_ORDER_CORRECTION_LDRIFT_OFFSET_RESIDUAL.verdict) &&
      /refereed bound is changed/i.test(IMP96508_NEXT_ORDER_CORRECTION_LDRIFT_OFFSET_RESIDUAL.verdict),
  },
];

for (const a of IMP96508_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96508-next-order-correction-Ldrift-offset-residual assertion failed: ${a.id}`);
  }
}
