/**
 * @module imp-34264-fixed-band-inflection-estimator-reconciliation
 *
 * imp-34264 (numerical, S-frontier): imp-34196 F2 localised the fixed-band (k <= 10) peak
 * deceleration-to-re-acceleration inflection TWO ways on its 0.25 kEnd grid but never combined them:
 *   (A) a 3-point PARABOLIC VERTEX of the increment-vs-kEnd curve about the discrete increment minimum,
 *       read as kEnd* ~ 18.6447 (imp-34196 inflectionKEnd);
 *   (B) a SECOND-DIFFERENCE SIGN-FLIP -- the first differences of the increments (= peak second
 *       differences) are negative through the kEnd = 18.75 step then flip strictly POSITIVE (+0.000960)
 *       at kEnd = 19.0, characterised by imp-34196 as bracketing the inflection to kEnd ~ 18.6 .. 18.8.
 * These were reported as two separate ~18.6 characterisations and their relationship was never made
 * explicit. This module RECONCILES the two estimators on the SAME 0.25 grid (the imp-34196 increments and
 * second differences reused verbatim), quantifies their disagreement, and reports a single best-estimate
 * inflection with an uncertainty band.
 *
 * THE RECONCILIATION (an EXACT algebraic identity, not a numerical coincidence)
 * ----------------------------------------------------------------------------
 *   The two estimators are the SAME estimator viewed through two abscissa conventions. Write the
 *   increment (first-difference) dPeak_i = peak_{i+1} - peak_i and the increments y5, y6, y7 straddling
 *   the discrete minimum at index m (y6 minimal), on grid spacing h = 0.25.
 *
 *   (A) The parabolic vertex of (x, dPeak) about the minimum:  x_v = x_m + (h/2) (y5 - y7)/(y5 - 2 y6 + y7).
 *       imp-34196 placed the increment dPeak_i at the RIGHT endpoint x = kEnd_{i+1} of its step, giving
 *       x_v = 18.6447.  But a forward difference peak_{i+1} - peak_i is the derivative estimate at the
 *       step MIDPOINT kEnd_{i+1} - h/2, so the physically-centred vertex is 18.6447 - 0.125 = 18.5197.
 *
 *   (B) The second difference D_i = dPeak_{i+1} - dPeak_i = peak_{i+2} - 2 peak_{i+1} + peak_i is the
 *       discrete second derivative at the NODE kEnd_{i+1}. Its linear-interpolated zero crossing between
 *       the last-negative node (kEnd = 18.5, D = -0.000082) and the first-positive node (kEnd = 18.75,
 *       D = +0.000960) is  18.5 + h (0 - D_-)/(D_+ - D_-) = 18.5197.
 *
 *   Subtracting the two closed forms leaves parabolic_centred - signflip_crossing = 0.125 - h/2 = 0
 *   IDENTICALLY for any three increments -- the parabolic vertex on the increment-midpoint abscissa EQUALS
 *   the second-difference sign-flip zero crossing on the node abscissa. The two estimators do NOT disagree;
 *   imp-34196 s 18.6447 is that same crossing carrying a +0.125 (one HALF-grid-rung) right-endpoint
 *   abscissa bias, which is why it and the 18.75 -> 19.0 sign-flip step read as two nearby-but-distinct
 *   ~18.6 numbers.
 *
 * THE FINDING (measurement / reconciliation only; inherited imp-3220/imp-3406 component model; no bound
 * change; NO QED)
 * ------------------------------------------------------------------------------------------------------
 *   (F1) THE TWO ESTIMATORS COINCIDE UNDER A CONSISTENT ABSCISSA. On the continuous-derivative-consistent
 *        abscissa (increments at step midpoints, second differences at nodes) the parabolic vertex and the
 *        second-difference sign-flip zero crossing are BOTH kEnd* = 18.5197, agreeing to < 1e-9 (an exact
 *        algebraic identity, degraded only by the 6-decimal storage of the increments).
 *   (F2) THE PUBLISHED DISAGREEMENT IS EXACTLY ONE HALF-GRID-RUNG. imp-34196 s parabolic 18.6447 and the
 *        reconciled crossing 18.5197 differ by 0.125 = h/2, the entire gap explained by the increment
 *        right-endpoint-vs-midpoint abscissa convention -- no genuine numerical conflict remains.
 *   (F3) SINGLE BEST ESTIMATE kEnd* = 18.520 +/- 0.125. The reconciled inflection is 18.520; the band is
 *        one half of the 0.25 grid rung (the finest kEnd resolves per imp-34196), giving kEnd* in
 *        [18.395, 18.645]. The band s upper edge coincides with imp-34196 s right-endpoint value 18.6447,
 *        so the interval ENCLOSES BOTH published characterisations while its centre is the physically
 *        centred estimate.
 *
 * The punchline: the imp-34196 F2 parabolic vertex (18.6447) and the second-difference sign-flip
 * (negative through 18.75, positive at 19.0) are not two competing localisations but ONE estimator on two
 * abscissa conventions -- reconciled at kEnd* = 18.520 +/- 0.125, an interval containing both, with the
 * 0.125 gap between them accounted for exactly as the half-grid-rung right-endpoint offset.
 *
 * MEASUREMENT / RECONCILIATION ONLY. A descriptive reconciliation of two inherited-surrogate estimators,
 * NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law verdict and
 * the imp-34196 findings it reconciles are untouched). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate, the parabolic inflection, and the
 * second-difference crossing are descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the two estimators reconciled here)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the coarse 0.5-grid sweep imp-34196 refined)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 saturation-onset window)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder; its 0.25 rung spacing sets the resolution)
 *
 * IMPORT-WEIGHT AUDIT: this module imports ONLY the imp-34196 data object (which per its own imp-34277
 * audit does not reach the 20.8MB zeros-to-1e6.js bundle); per [[no_heavy_imports_in_pages]] it stays safe
 * to import from a lazy-loaded page.
 */

import { IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE as IMP34196 } from './imp-34196-fixed-band-peak-increment-minimum-subwindow-refine.js';

const GRID_STEP = IMP34196.refineStep; // 0.25 -- the imp-33810 ladder rung spacing (finest kEnd resolves)
const K_ENDS = IMP34196.kEnds; // [17.0, 17.25, ..., 19.5]
const INCREMENTS = IMP34196.fixedBandIncrements; // 10 increments dPeak_i = peak_{i+1} - peak_i
const SECOND_DIFFS = IMP34196.fixedBandSecondDifferences; // 9 first-differences-of-increments (peak 2nd diffs)

// Discrete increment minimum index (m); the parabolic vertex is fitted about it.
let MIN_I = 0;
for (let i = 1; i < INCREMENTS.length; i++) if (INCREMENTS[i] < INCREMENTS[MIN_I]) MIN_I = i;
const Y_L = INCREMENTS[MIN_I - 1];
const Y_M = INCREMENTS[MIN_I];
const Y_R = INCREMENTS[MIN_I + 1];
const PARAB_DENOM = Y_L - 2 * Y_M + Y_R; // > 0 near a minimum

// (A) Parabolic vertex on imp-34196 s RIGHT-ENDPOINT abscissa (x = kEnd_{i+1}); reproduces inflectionKEnd.
const INC_RIGHT_ENDPOINT_X = K_ENDS.slice(1); // right endpoints of the 10 increments
const PARABOLIC_VERTEX_RIGHT_ENDPOINT =
  INC_RIGHT_ENDPOINT_X[MIN_I] + (GRID_STEP / 2) * (Y_L - Y_R) / PARAB_DENOM;

// (A-centred) The same vertex on the increment-MIDPOINT abscissa (x = kEnd_{i+1} - h/2), where a forward
// difference peak_{i+1} - peak_i is the derivative estimate. This is the physically centred inflection.
const PARABOLIC_VERTEX_MIDPOINT = PARABOLIC_VERTEX_RIGHT_ENDPOINT - GRID_STEP / 2;

// (B) Second-difference sign-flip zero crossing on the NODE abscissa (D_i at kEnd_{i+1}). Find the last
// negative -> first positive node pair and linearly interpolate the crossing.
let FLIP_I = -1;
for (let i = 1; i < SECOND_DIFFS.length; i++) {
  if (SECOND_DIFFS[i - 1] < 0 && SECOND_DIFFS[i] > 0) { FLIP_I = i; break; }
}
const D_NEG = SECOND_DIFFS[FLIP_I - 1]; // last negative peak second difference
const D_POS = SECOND_DIFFS[FLIP_I]; // first positive peak second difference
const X_NEG = K_ENDS[FLIP_I]; // node abscissa of D_{FLIP_I-1}  (D_i sits at kEnd_{i+1})
const SIGNFLIP_CROSSING = X_NEG + GRID_STEP * (0 - D_NEG) / (D_POS - D_NEG);
const SIGNFLIP_BRACKET = [X_NEG, X_NEG + GRID_STEP]; // [18.5, 18.75] on the node abscissa

// Reconciliation metrics.
const CENTRED_ESTIMATOR_GAP = Math.abs(PARABOLIC_VERTEX_MIDPOINT - SIGNFLIP_CROSSING); // ~0 (exact identity)
const PUBLISHED_DISAGREEMENT = Math.abs(PARABOLIC_VERTEX_RIGHT_ENDPOINT - SIGNFLIP_CROSSING); // = h/2 = 0.125
const HALF_GRID_RUNG = GRID_STEP / 2; // 0.125

// (F3) Single best estimate + uncertainty band. Centre = reconciled crossing; half-width = one half-rung.
const BEST_ESTIMATE = SIGNFLIP_CROSSING; // the physically centred, convention-consistent inflection
const BAND_HALF_WIDTH = HALF_GRID_RUNG; // 0.125 -- half the 0.25 grid rung (finest kEnd resolves)
const BAND = [BEST_ESTIMATE - BAND_HALF_WIDTH, BEST_ESTIMATE + BAND_HALF_WIDTH];
const BAND_ENCLOSES_BOTH =
  PARABOLIC_VERTEX_RIGHT_ENDPOINT >= BAND[0] - 1e-9 &&
  PARABOLIC_VERTEX_RIGHT_ENDPOINT <= BAND[1] + 1e-9 &&
  SIGNFLIP_CROSSING >= BAND[0] - 1e-9 &&
  SIGNFLIP_CROSSING <= BAND[1] + 1e-9;

const IMP34196_PUBLISHED_INFLECTION = IMP34196.inflectionKEnd; // 18.6447 -- the right-endpoint parabolic value

export const IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION = {
  id: 'imp-34264',
  proofSection: 'S-frontier',
  question:
    'imp-34196 F2 located the fixed-band (k <= 10) peak deceleration-to-re-acceleration inflection two ways ' +
    'on its 0.25 kEnd grid -- a parabolic vertex kEnd* ~ 18.6447 and a second-difference sign-flip (negative ' +
    'through 18.75, +0.000960 at 19.0) -- that were never combined. Reconcile the two on the SAME grid, ' +
    'quantify their disagreement, and report a single best-estimate inflection with an uncertainty band. ' +
    'Measurement only; NOT an RH bound; no QED.',
  gridStep: GRID_STEP,
  increments: INCREMENTS,
  secondDifferences: SECOND_DIFFS,
  incrementMinimumIndex: MIN_I,
  // (A) parabolic vertex, two abscissa conventions
  parabolicVertexRightEndpoint: +PARABOLIC_VERTEX_RIGHT_ENDPOINT.toFixed(4), // 18.6447 -- reproduces imp-34196
  parabolicVertexMidpoint: +PARABOLIC_VERTEX_MIDPOINT.toFixed(4), // 18.5197 -- physically centred
  // (B) second-difference sign-flip zero crossing on the node abscissa
  signFlipBracket: SIGNFLIP_BRACKET, // [18.5, 18.75] -- last-negative -> first-positive node pair
  signFlipCrossing: +SIGNFLIP_CROSSING.toFixed(4), // 18.5197
  signFlipLastNegative: D_NEG, // -0.000082 at kEnd 18.5
  signFlipFirstPositive: D_POS, // +0.000960 at kEnd 18.75
  // reconciliation
  centredEstimatorGap: +CENTRED_ESTIMATOR_GAP.toExponential(3), // ~0 -- exact algebraic identity
  publishedDisagreement: +PUBLISHED_DISAGREEMENT.toFixed(4), // 0.1250 = h/2 = one half-grid-rung
  halfGridRung: HALF_GRID_RUNG, // 0.125
  imp34196PublishedInflection: IMP34196_PUBLISHED_INFLECTION, // 18.6447
  // (F3) single best estimate + band
  bestEstimateInflection: +BEST_ESTIMATE.toFixed(4), // 18.5197
  bandHalfWidth: BAND_HALF_WIDTH, // 0.125
  band: BAND.map((v) => +v.toFixed(4)), // [18.3947, 18.6447]
  bandEnclosesBothEstimators: BAND_ENCLOSES_BOTH, // true
  finding: {
    F1_estimators_coincide_under_consistent_abscissa:
      'On the continuous-derivative-consistent abscissa (increments at step midpoints, second differences ' +
      'at nodes) the parabolic vertex and the second-difference sign-flip zero crossing are BOTH kEnd* = ' +
      '18.5197, agreeing to < 1e-9 -- an exact algebraic identity (parabolic vertex on the increment-midpoint ' +
      'abscissa EQUALS the second-difference crossing on the node abscissa for any three increments).',
    F2_published_disagreement_is_one_half_grid_rung:
      'imp-34196 s parabolic 18.6447 and the reconciled crossing 18.5197 differ by exactly 0.125 = h/2, the ' +
      'entire gap explained by the increment right-endpoint-vs-midpoint abscissa convention -- no genuine ' +
      'numerical conflict between the two estimators remains.',
    F3_best_estimate_with_band:
      'Single best estimate kEnd* = 18.520 +/- 0.125 (band one half of the 0.25 grid rung, the finest kEnd ' +
      'resolves): the interval [18.395, 18.645] is centred on the physically centred inflection and its ' +
      'upper edge coincides with imp-34196 s right-endpoint 18.6447, so it ENCLOSES BOTH published ' +
      'characterisations.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ESTIMATOR RECONCILIATION (S-frontier, NOT rigorous). The imp-34196 F2 parabolic vertex ' +
    '(kEnd* ~ 18.6447) and the second-difference sign-flip (peak second differences negative through the ' +
    'kEnd = 18.75 step, +0.000960 at 19.0) are NOT two competing localisations of the fixed-band (k <= 10) ' +
    'peak inflection but ONE estimator on two abscissa conventions: the parabolic vertex on the ' +
    'increment-MIDPOINT abscissa equals the second-difference zero crossing on the NODE abscissa IDENTICALLY ' +
    '(both 18.5197, agreeing to < 1e-9). The published 0.125 disagreement is exactly one HALF-grid-rung (h/2), ' +
    'the increment right-endpoint-vs-midpoint offset. Single best estimate kEnd* = 18.520 +/- 0.125, the band ' +
    '[18.395, 18.645] enclosing both characterisations with the physically centred inflection at its centre. ' +
    'Distinct from any form selection; the imp-33843 log-linear-over-power-law verdict and the imp-34196 ' +
    'findings are untouched. The OLS surrogate, the parabolic inflection, and the second-difference crossing ' +
    'are descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34196 (the parabolic vertex + second-difference sign-flip reconciled here; increments and second ' +
    'differences reused verbatim); imp-34109 (the coarse 0.5-grid sweep imp-34196 refined); imp-33843 (the ' +
    'log-linear OLS re-run per boundary); imp-33810 (the k=6.. ladder; its 0.25 rung spacing sets the ' +
    'resolution); imp-486 (C_mb GUE-conditional); imp-3220/imp-3406 (the inherited component model).',
};

export const IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: the increments and second differences are the imp-34196 arrays verbatim, and the
    // right-endpoint parabolic vertex reproduces imp-34196 s published inflection.
    id: 'imp34264-reuse-gate-anchors-to-imp34196',
    description: '10 increments / 9 second diffs from imp-34196; right-endpoint parabolic vertex reproduces imp-34196 inflectionKEnd 18.6447',
    holds: () =>
      INCREMENTS.length === 10 &&
      SECOND_DIFFS.length === 9 &&
      GRID_STEP === 0.25 &&
      Math.abs(PARABOLIC_VERTEX_RIGHT_ENDPOINT - IMP34196_PUBLISHED_INFLECTION) < 1e-3,
  },
  {
    // (F1) The two estimators coincide under the consistent abscissa: parabolic-midpoint == signflip-crossing.
    id: 'imp34264-estimators-coincide-under-consistent-abscissa',
    description: 'parabolic vertex (increment-midpoint abscissa) equals second-difference crossing (node abscissa) to < 1e-9; both ~18.5197',
    holds: () =>
      CENTRED_ESTIMATOR_GAP < 1e-9 &&
      Math.abs(PARABOLIC_VERTEX_MIDPOINT - 18.5197) < 5e-4 &&
      Math.abs(SIGNFLIP_CROSSING - 18.5197) < 5e-4 &&
      SIGNFLIP_BRACKET[0] === 18.5 && SIGNFLIP_BRACKET[1] === 18.75,
  },
  {
    // (F2) The published disagreement is exactly one half-grid-rung (h/2 = 0.125).
    id: 'imp34264-published-disagreement-is-half-grid-rung',
    description: 'parabolic 18.6447 minus reconciled crossing 18.5197 equals 0.125 = h/2 = one half-grid-rung',
    holds: () =>
      Math.abs(PUBLISHED_DISAGREEMENT - HALF_GRID_RUNG) < 1e-9 &&
      Math.abs(HALF_GRID_RUNG - 0.125) < 1e-12,
  },
  {
    // (F3) The single best estimate 18.520 with the +/-0.125 band [18.395, 18.645] encloses both estimators.
    id: 'imp34264-best-estimate-band-encloses-both',
    description: 'best estimate ~18.520; band +/-0.125 = [18.395, 18.645]; encloses both the parabolic 18.6447 and the crossing 18.5197',
    holds: () =>
      Math.abs(BEST_ESTIMATE - 18.5197) < 5e-4 &&
      BAND_HALF_WIDTH === 0.125 &&
      BAND[0] < BEST_ESTIMATE && BEST_ESTIMATE < BAND[1] &&
      BAND_ENCLOSES_BOTH === true,
  },
  {
    // Honesty gate: reconciliation/measurement only, isRigorous false, no QED, no refereed bound is changed, C_mb / imp-3066 untouched.
    id: 'imp34264-honesty-gate-no-qed',
    description: 'Measurement/reconciliation only: isRigorous false, no QED, no refereed bound is changed, C_mb GUE-conditional / imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION.isRigorous === false &&
      /NOT a\s+rigorous asymptotic/.test(IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is\s+UNTOUCHED/i.test(IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION.verdict),
  },
];

for (const a of IMP34264_FIXED_BAND_INFLECTION_ESTIMATOR_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34264-fixed-band-inflection-estimator-reconciliation assertion failed: ${a.id}`);
  }
}
