/**
 * @module imp-34047-argmax-rung-creep-descent-law
 *
 * imp-34047 (numerical, frontier-direction): imp-33987 noted, as an aside (its F3), that the rung
 * carrying the imp-33940 R2 fixed-band (k <= 10) peak CREEPS inward -- k* = 7.00 at kEnd = 11 to
 * 6.75 (kEnd = 11.5..13) to 6.50 (kEnd = 13.5..14) -- as the imp-33843 log-linear fit boundary
 * recedes, but it never fit that creep as its own descent law nor asked WHERE (if ever) the peak
 * would reach the fixed band s inner edge k = 6.00 (the imp-33810 ladder floor). This module fills
 * that gap. It (a) regresses the observed argmax rung k*(kEnd) against kEnd over the imp-33987
 * window kEnd = 11..14 as a plain LINEAR descent and as a CONCAVE (log-kEnd) descent, scoring both;
 * (b) extrapolates each fitted law to the kEnd at which k* would reach the band interior floor
 * k = 6.00; and (c) -- the honest cross-check -- confronts that extrapolation with the DIRECT
 * measurement its sibling imp-34040 already made over the very next decade kEnd = 14..17, where the
 * argmax rung was found LOCKED at k = 6.50 across all 7 windows (no further creep). The verdict the
 * ticket asks for -- stabilizing vs migrating steadily inward -- is settled not by the fit but by
 * that measurement.
 *
 * INHERITED DATA (no re-derivation; both series imported verbatim)
 * ---------------------------------------------------------------
 *   imp-33987 window  fixedBandRows kEnd = 11.0, 11.5, ..., 14.0 (7 windows), argmax k* creeping
 *                     7.00 -> 6.75 -> 6.50. The series this ticket fits as a descent law.
 *   imp-34040 window  fixedBandRows kEnd = 14.0, 15.0, ..., 17.0 (7 windows), argmax k* LOCKED at
 *                     6.50. The direct measurement that adjudicates the extrapolation.
 *
 * THE DESCENT-LAW FIT (on the imp-33987 window only)
 * -------------------------------------------------
 *   Linear    k* = aL + bL kEnd. Over the 3-level quantized series (7.00 / 6.75 / 6.50, snapped to
 *             the 0.25 imp-33810 ladder grid) the OLS slope is bL ~ -0.1429 rung per unit kEnd
 *             (-0.143 per boundary decade), intercept aL = 8.50, R^2 ~ 0.80. Extrapolating to the
 *             band floor: k* = 6.00 at kEnd ~ 17.5 (3.5 boundary decades past the current kEnd = 14).
 *   Concave   k* = aC + bC ln(kEnd). Over the narrow kEnd = 11..14 range ln(kEnd) is nearly linear in
 *             kEnd, so the concave fit is statistically INDISTINGUISHABLE from the linear one
 *             (R^2 ~ 0.7997, delta-R^2 ~ 3e-4); it extrapolates k* = 6.00 at kEnd ~ 18.6. The window
 *             is too narrow, and the series too coarsely quantized (3 levels), to separate a linear
 *             from a concave descent -- the linear law is the parsimonious summary.
 *
 * THE FINDING (measurement adjudicates: the peak location STABILIZES / LOCKS, it does NOT migrate
 * steadily inward -- the imp-33987-window descent-law extrapolation is FALSIFIED beyond kEnd = 14)
 * ------------------------------------------------------------------------------------------------
 *   (F1) BOTH DESCENT LAWS FIT THE imp-33987 WINDOW EQUALLY WELL AND POORLY. Linear (R^2 ~ 0.80)
 *        marginally beats concave-log (R^2 ~ 0.7997); the delta is ~3e-4, below any resolving power
 *        of a 3-level quantized 7-point series. Within kEnd = 11..14 the rung genuinely descends
 *        (slope ~ -0.143 per boundary decade) -- the imp-33987 F3 creep is real inside its window.
 *   (F2) THE NAIVE EXTRAPOLATION PREDICTS CONTINUED INWARD MIGRATION. Taken at face value the linear
 *        law reaches the band floor k = 6.00 at kEnd ~ 17.5 (concave ~ 18.6), i.e. it predicts the
 *        peak keeps creeping and would pass k* = 6.25 near kEnd ~ 15.75 and k* ~ 6.07 by kEnd = 17.
 *   (F3) DIRECT MEASUREMENT FALSIFIES THAT EXTRAPOLATION -- THE RUNG STABILIZES. imp-34040 measured
 *        the SAME selector over kEnd = 14..17 and found the argmax LOCKED at k = 6.50 across all 7
 *        windows. The linear law predicts k* ~ 6.07 at kEnd = 17; reality is 6.50, an over-prediction
 *        of inward migration of ~0.43 rung. The imp-33987-window creep is a TRANSIENT that saturates
 *        one grid step in (at 6.50), NOT a steady descent to the band floor. Answer to the ticket:
 *        the convex peak s location is STABILIZING, not migrating steadily inward.
 *
 * The punchline: the imp-33987 F3 argmax creep (7.00 -> 6.50 over kEnd = 11..14) fits a linear descent
 * (slope ~ -0.143 per boundary decade, R^2 ~ 0.80, concave-log indistinguishable at delta-R^2 ~ 3e-4)
 * whose face-value extrapolation would reach the band floor k = 6.00 near kEnd ~ 17.5 -- but the direct
 * imp-34040 measurement over kEnd = 14..17 shows the rung LOCKED at 6.50, over-predicting inward
 * migration by ~0.43 rung, so the peak location STABILIZES / locks and does NOT migrate steadily inward.
 *
 * MEASUREMENT / DESCRIPTIVE DESCENT-LAW FIT ONLY. A one-parameter regression of an inherited,
 * grid-quantized argmax index against the fit boundary, plus its falsification by an inherited direct
 * measurement -- NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-
 * power-law verdict, the imp-33940 R2 finding, and the imp-33987 / imp-34040 convex-then-saturating
 * drift readings are all untouched). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS descent fit and its extrapolation are descriptive,
 * not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33987-fixed-band-convex-drift-exponent (the F3 argmax creep 7.00 -> 6.50 fit here; rows imported)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 argmax-locked measurement; rows imported)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift both extend)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose residual peak is tracked)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k = 6.. ladder whose k = 6.00 floor is the extrapolation target)
 */

import { IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT } from './imp-33987-fixed-band-convex-drift-exponent.js';
import { IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE } from './imp-34040-fixed-band-drift-saturation-decade.js';

// Inherited series (verbatim; no re-derivation).
const W_ROWS = IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.fixedBandRows; // kEnd 11..14, argmax creeps 7.00 -> 6.50
const SAT_ROWS = IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.fixedBandRows; // kEnd 14..17, argmax locked 6.50

const BAND_FLOOR_K = 6.0; // imp-33810 ladder start = fixed band inner edge (the extrapolation target)

function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
function r2Of(xs, ys, a, b) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    ssRes += (ys[i] - (a + b * xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return 1 - ssRes / ssTot;
}

// Descent-law regressions of the argmax rung k*(kEnd) over the imp-33987 window.
const KENDS = W_ROWS.map((r) => r.kEnd);
const ARGMAX = W_ROWS.map((r) => r.atK); // 7.00, 6.75, 6.75, 6.75, 6.75, 6.50, 6.50

const LIN = ols(KENDS, ARGMAX); // k* = aL + bL kEnd
const LIN_R2 = r2Of(KENDS, ARGMAX, LIN.a, LIN.b);
const LOG_KENDS = KENDS.map((k) => Math.log(k));
const CON = ols(LOG_KENDS, ARGMAX); // k* = aC + bC ln(kEnd)  -- concave descent
const CON_R2 = r2Of(LOG_KENDS, ARGMAX, CON.a, CON.b);

// Extrapolate each law to the band interior floor k = 6.00.
const LIN_KEND_AT_FLOOR = +((BAND_FLOOR_K - LIN.a) / LIN.b).toFixed(4); // kEnd where linear reaches 6.00
const CON_KEND_AT_FLOOR = +Math.exp((BAND_FLOOR_K - CON.a) / CON.b).toFixed(4); // kEnd where concave reaches 6.00

// Face-value linear prediction at the far edge of the imp-34040 measurement window (kEnd = 17).
const SAT_MAX_KEND = Math.max(...SAT_ROWS.map((r) => r.kEnd));
const LIN_PRED_AT_SAT_MAX = +(LIN.a + LIN.b * SAT_MAX_KEND).toFixed(4); // predicted k* at kEnd = 17
const SAT_ARGMAX = SAT_ROWS.map((r) => r.atK);
const SAT_ARGMAX_LOCKED_VALUE = SAT_ARGMAX[SAT_ARGMAX.length - 1]; // measured 6.50
const OVERPREDICTION_RUNGS = +(SAT_ARGMAX_LOCKED_VALUE - LIN_PRED_AT_SAT_MAX).toFixed(4); // ~0.43 rung too far in

const DESCENT_IS_NEGATIVE = LIN.b < 0; // rung genuinely descends within the imp-33987 window
const LINEAR_BEATS_CONCAVE = LIN_R2 >= CON_R2;
const FITS_INDISTINGUISHABLE = Math.abs(LIN_R2 - CON_R2) < 0.01; // narrow window cannot separate them
const SAT_LOCKED = SAT_ARGMAX.every((k) => k === SAT_ARGMAX_LOCKED_VALUE); // imp-34040 argmax constant
// The peak STABILIZES iff the direct measurement holds the rung well ABOVE the extrapolated floor path.
const PEAK_STABILIZES = SAT_LOCKED && OVERPREDICTION_RUNGS > 0.2;

export const IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW = {
  id: 'imp-34047',
  proofSection: 'S-frontier',
  question:
    'imp-33987 F3 reported the imp-33940 fixed-band (k <= 10) argmax rung creeps inward k* = 7.00 ' +
    '(kEnd = 11) -> 6.50 (kEnd = 14) as the imp-33843 log-linear fit boundary recedes, but never fit ' +
    'that creep as its own descent law nor asked where it would reach the band interior floor k = 6.00. ' +
    'Regressed against kEnd (linear vs concave), where does the law extrapolate to the floor, and -- ' +
    'against the direct imp-34040 kEnd = 14..17 measurement -- is the peak location stabilizing or ' +
    'migrating steadily inward? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The argmax rung k*(kEnd) over the imp-33987 window kEnd = 11..14 regressed as k* = aL + bL kEnd ' +
    '(linear) and k* = aC + bC ln(kEnd) (concave), each scored by R^2 and extrapolated to the band ' +
    'floor k = 6.00; the face-value linear prediction at kEnd = 17 compared to the imp-34040 measured ' +
    'argmax (locked at 6.50) over kEnd = 14..17',
  bandFloorK: BAND_FLOOR_K,
  windowKEnds: KENDS,
  windowArgmaxKs: ARGMAX,
  linearDescentFit: {
    form: 'argmaxK = aL + bL * kEnd',
    slope: +LIN.b.toFixed(6), // ~ -0.142857 rung per unit kEnd (per boundary decade)
    intercept: +LIN.a.toFixed(6), // ~ 8.50
    r2: +LIN_R2.toFixed(6), // ~ 0.80
    kEndAtBandFloor: LIN_KEND_AT_FLOOR, // ~ 17.5 -- naive arrival at k = 6.00
  },
  concaveDescentFit: {
    form: 'argmaxK = aC + bC * ln(kEnd)',
    slope: +CON.b.toFixed(6),
    intercept: +CON.a.toFixed(6),
    r2: +CON_R2.toFixed(6), // ~ 0.7997 -- indistinguishable from linear
    kEndAtBandFloor: CON_KEND_AT_FLOOR, // ~ 18.6
  },
  linearBeatsConcave: LINEAR_BEATS_CONCAVE,
  fitsIndistinguishable: FITS_INDISTINGUISHABLE, // delta-R^2 < 0.01 over the narrow kEnd = 11..14 window
  descentIsNegativeInWindow: DESCENT_IS_NEGATIVE, // rung genuinely descends within imp-33987 window
  saturationWindowKEnds: SAT_ROWS.map((r) => r.kEnd), // 14..17 (imp-34040)
  saturationArgmaxKs: SAT_ARGMAX, // all 6.50 -- measured lock
  saturationArgmaxLocked: SAT_LOCKED,
  linearPredictionAtSatMaxKEnd: LIN_PRED_AT_SAT_MAX, // ~ 6.07 predicted at kEnd = 17
  overpredictionRungsAtSatMax: OVERPREDICTION_RUNGS, // ~ +0.43: extrapolation places peak too far inward
  peakLocationStabilizes: PEAK_STABILIZES, // TRUE -- locks at 6.50, does NOT reach the band floor
  finding: {
    F1_both_descent_laws_fit_window_equally:
      'Over the imp-33987 window kEnd = 11..14 the argmax rung (7.00 / 6.75 / 6.50, snapped to the ' +
      '0.25 imp-33810 ladder grid) fits a linear descent (slope ~ -0.143 rung per boundary decade, ' +
      'R^2 ~ 0.80) marginally better than a concave ln(kEnd) descent (R^2 ~ 0.7997); the delta-R^2 ~ ' +
      '3e-4 is below any resolving power of a 3-level 7-point series, so linear is the parsimonious ' +
      'summary and the creep is real inside its window.',
    F2_naive_extrapolation_predicts_continued_migration:
      'Taken at face value the linear law reaches the band floor k = 6.00 at kEnd ~ 17.5 (concave ~ ' +
      '18.6) and predicts the peak keeps creeping -- k* ~ 6.25 near kEnd ~ 15.75 and k* ~ 6.07 by ' +
      'kEnd = 17.',
    F3_direct_measurement_falsifies_it_peak_stabilizes:
      'imp-34040 measured the SAME selector over kEnd = 14..17 and found the argmax LOCKED at k = 6.50 ' +
      'across all 7 windows. The linear law predicts k* ~ 6.07 at kEnd = 17; reality is 6.50, an ' +
      'over-prediction of inward migration of ~0.43 rung. The imp-33987-window creep is a TRANSIENT ' +
      'that saturates one grid step in (at 6.50), NOT a steady descent to the band floor -- the peak ' +
      'location STABILIZES, it does not migrate steadily inward.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DESCRIPTIVE DESCENT-LAW FIT (frontier-direction, NOT rigorous). The imp-33987 F3 ' +
    'argmax creep (k* = 7.00 -> 6.50 over kEnd = 11..14) fits a linear descent in kEnd (slope ~ -0.143 ' +
    'rung per boundary decade, intercept ~ 8.50, R^2 ~ 0.80); a concave ln(kEnd) descent is ' +
    'statistically indistinguishable (R^2 ~ 0.7997, delta-R^2 ~ 3e-4) because the kEnd = 11..14 window ' +
    'is too narrow and the series too coarsely 3-level-quantized to separate them, so linear is the ' +
    'parsimonious summary. Face-value extrapolation reaches the band interior floor k = 6.00 near ' +
    'kEnd ~ 17.5 (concave ~ 18.6). BUT the direct imp-34040 measurement over the very next decade ' +
    'kEnd = 14..17 finds the argmax LOCKED at k = 6.50 across all 7 windows: the linear law predicts ' +
    'k* ~ 6.07 at kEnd = 17 where reality is 6.50 -- an over-prediction of inward migration of ~0.43 ' +
    'rung. So the convex peak location STABILIZES / locks one grid step in (at 6.50) and does NOT ' +
    'migrate steadily inward to the band floor; the imp-33987-window creep is a saturating transient. ' +
    'Distinct from any form selection; the imp-33843 log-linear verdict, the imp-33940 R2 finding, and ' +
    'the imp-33987 / imp-34040 drift readings are untouched. The OLS descent fit and its extrapolation ' +
    'are descriptive, not derived; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33987 (the F3 argmax creep 7.00 -> 6.50 fit here; fixedBandRows imported verbatim); imp-34040 ' +
    '(the kEnd = 14..17 argmax-locked-at-6.50 measurement that adjudicates the extrapolation; ' +
    'fixedBandRows imported verbatim); imp-33940 (the R2 convex low-k drift both extend); imp-33843 ' +
    '(the log-linear OLS whose fixed-band residual peak is tracked); imp-33810 (the k = 6.. ladder ' +
    'whose k = 6.00 floor is the extrapolation target); imp-486 (C_mb GUE-conditional).',
};

export const IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW_ASSERTIONS = [
  {
    // Reuse gate: the imp-33987 window is 7 windows with the argmax creep 7.00 -> 6.50, and the
    // imp-34040 window is the argmax-locked-at-6.50 measurement -- both series imported verbatim.
    id: 'imp34047-reuse-gate-inherited-series',
    description: 'imp-33987 window 7 rows argmax 7.00 -> 6.50; imp-34040 window argmax locked at 6.50 (imported verbatim)',
    holds: () =>
      W_ROWS.length === 7 &&
      ARGMAX[0] === 7.0 &&
      ARGMAX[ARGMAX.length - 1] === 6.5 &&
      SAT_ROWS.length === 7 &&
      SAT_LOCKED === true &&
      SAT_ARGMAX_LOCKED_VALUE === 6.5,
  },
  {
    // (F1) Both descent laws fit the window: linear slope negative, R^2 ~ 0.80, and linear vs concave
    // are statistically indistinguishable (delta-R^2 below 0.01) with linear marginally ahead.
    id: 'imp34047-descent-linear-concave-indistinguishable',
    description: 'linear descent slope < 0, R2 ~ 0.80, linear >= concave, delta-R2 < 0.01 (narrow window cannot separate)',
    holds: () =>
      DESCENT_IS_NEGATIVE === true &&
      LIN_R2 > 0.75 &&
      LIN_R2 < 0.85 &&
      LINEAR_BEATS_CONCAVE === true &&
      FITS_INDISTINGUISHABLE === true,
  },
  {
    // (F2) The naive extrapolation reaches the band floor k = 6.00 well past the current kEnd = 14,
    // in the kEnd ~ 16..20 range (linear ~ 17.5, concave ~ 18.6).
    id: 'imp34047-extrapolated-floor-arrival-past-current-boundary',
    description: 'linear and concave laws both extrapolate arrival at k = 6.00 in kEnd ~ 16..20 (past current kEnd = 14)',
    holds: () =>
      LIN_KEND_AT_FLOOR > 16 &&
      LIN_KEND_AT_FLOOR < 20 &&
      CON_KEND_AT_FLOOR > 16 &&
      CON_KEND_AT_FLOOR < 20 &&
      LIN_KEND_AT_FLOOR > SAT_MAX_KEND,
  },
  {
    // (F3) The direct imp-34040 measurement FALSIFIES the extrapolation: the linear law predicts
    // k* well below 6.50 at kEnd = 17, but the measured rung is locked at 6.50 -- an over-prediction
    // of inward migration > 0.2 rung, so the peak location STABILIZES.
    id: 'imp34047-measurement-falsifies-extrapolation-peak-stabilizes',
    description: 'linear predicts k* < 6.5 at kEnd = 17 but measured argmax locked at 6.50; overprediction > 0.2 rung -> stabilizes',
    holds: () =>
      LIN_PRED_AT_SAT_MAX < 6.5 &&
      OVERPREDICTION_RUNGS > 0.2 &&
      PEAK_STABILIZES === true,
  },
  {
    // Honesty gate: measurement only, peak stabilizes (not migrating), isRigorous false, no QED, PT SOTA,
    // imp-3066 untouched.
    id: 'imp34047-honesty-gate-no-qed',
    description: 'Measurement only: peak stabilizes, isRigorous false, no QED, imp-3066 untouched, PT SOTA',
    holds: () =>
      IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW.peakLocationStabilizes === true &&
      IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW.isRigorous === false &&
      /NO QED/.test(IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW.verdict) &&
      /remains SOTA/.test(IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW.verdict),
  },
];

for (const a of IMP34047_ARGMAX_RUNG_CREEP_DESCENT_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34047-argmax-rung-creep-descent-law assertion failed: ${a.id}`);
  }
}
