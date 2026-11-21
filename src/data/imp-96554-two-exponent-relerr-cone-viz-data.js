/**
 * @module imp-96554-two-exponent-relerr-cone-viz-data
 *
 * imp-96554 (ux): import-light viz-data leaf charting the imp-96528 two-exponent
 * log-log relErr(T) cone. imp-96528 quantified that the imp-96510 systematic-vs-noise
 * sub-gap reduces to distinguishing two power laws relErr(T) ~ C*T^p -- systematic
 * (p=0, flat) vs sampling-noise (p=-1/4) -- separated by only Delta_p=1/4, and that
 * the fixed 10^6 Odlyzko set's best-reachable exponent standard error SE(p) ~ 0.21
 * leaves the two readings at most ~1.2 sigma apart. That verdict was shipped as a
 * baked object with no chart. This module reshapes it (plus the two imp-96493
 * interior anchors it is defined at) into a plottable series: the two candidate
 * power-law lines anchored through the T=1.5e5 measurement, an SE(p)-width log-log
 * error cone around their midpoint, and both actual anchor points overlaid so the
 * "neither line predicts the second anchor cleanly" scatter is visible directly.
 *
 * No re-derivation of the exponent-fit reach itself: SE(p), Delta_p and the
 * separation-in-sigma are copied verbatim from IMP96528_..._REACH (imp-96528); the
 * two relErr(T) measurements are copied verbatim from IMP96493_EXCURSION_2SIGMA_
 * INTERIOR_SCAN (imp-96493). The only new computation here is evaluating the two
 * power laws and the cone bounds over a plotting grid. Changes no bound; establishes
 * no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96528-independent-unclipped-height-count-exponent-fit-reach.js (SE(p), Delta_p)
 * @see imp-96493-excursion-2sigma-interior-scan.js (the two anchor measurements)
 * @see imp-96510-deeper-interior-dip-height-source-reach.js (the sub-gap this bears on)
 *
 * Ticket: imp-96554 (ux, sonnet-4-6, medium). Visualization only, RH-free; changes
 * no bound; NO QED. No self-executing assertion throw (per the imp-96294 convention)
 * -- values are validated below via a plain exported check object instead.
 */

import { IMP96528_INDEPENDENT_UNCLIPPED_HEIGHT_COUNT_EXPONENT_FIT_REACH as FIT } from './imp-96528-independent-unclipped-height-count-exponent-fit-reach.js';
import { IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN as SCAN } from './imp-96493-excursion-2sigma-interior-scan.js';

const ANCHOR_1 = { Tc: SCAN.reference.Tc, relErr: SCAN.reference.relErr }; // T=1.5e5, relErr~0.15946
const ANCHOR_2 = { Tc: SCAN.deepestInteriorDip.Tc, relErr: SCAN.deepestInteriorDip.relErr }; // T=3.879e5, relErr~0.06772

const P_SYSTEMATIC = FIT.competingReadings.systematicExponent; // 0
const P_SAMPLING_NOISE = FIT.competingReadings.samplingNoiseExponent; // -0.25
const DELTA_P = FIT.competingReadings.exponentSeparation; // 0.25
const SE_P = FIT.bestReach.SE_exponent; // ~0.21 (the best-reachable standard error anywhere on the fixed set)
const SEPARATION_SIGMA = FIT.bestReach.separationSigma; // ~1.16

// power law anchored at ANCHOR_1: relErr(T) = relErr1 * (T/T1)^p
const powerLawFrom = (anchor, p) => (T) => anchor.relErr * (T / anchor.Tc) ** p;
const systematicLine = powerLawFrom(ANCHOR_1, P_SYSTEMATIC);
const samplingNoiseLine = powerLawFrom(ANCHOR_1, P_SAMPLING_NOISE);

// cone centered on the midpoint exponent, half-width SE_P * |ln(T/T1)| in log-space (natural log,
// matching the OLS slope-error derivation in imp-96528).
const P_MID = (P_SYSTEMATIC + P_SAMPLING_NOISE) / 2; // -0.125
const midLine = powerLawFrom(ANCHOR_1, P_MID);
const coneHalfWidth = (T) => SE_P * Math.abs(Math.log(T / ANCHOR_1.Tc));
const coneUpper = (T) => midLine(T) * Math.exp(coneHalfWidth(T));
const coneLower = (T) => midLine(T) * Math.exp(-coneHalfWidth(T));

// plotting grid: log-spaced from just below anchor 1 to just above anchor 2.
const GRID_T_MIN = 1.2e5;
const GRID_T_MAX = 5.2e5;
const GRID_POINTS = 60;
const logGrid = Array.from({ length: GRID_POINTS }, (_, i) => {
  const t = Math.log10(GRID_T_MIN) + (i / (GRID_POINTS - 1)) * (Math.log10(GRID_T_MAX) - Math.log10(GRID_T_MIN));
  return 10 ** t;
});

export const IMP96554_CONE_SERIES = logGrid.map((T) => ({
  Tc: T,
  log10T: Math.log10(T),
  systematicRelErr: systematicLine(T),
  samplingNoiseRelErr: samplingNoiseLine(T),
  coneUpperRelErr: coneUpper(T),
  coneLowerRelErr: coneLower(T),
}));

export const IMP96554_ANCHORS = Object.freeze({
  anchor1: { Tc: ANCHOR_1.Tc, relErr: ANCHOR_1.relErr, log10T: Math.log10(ANCHOR_1.Tc) },
  anchor2: {
    Tc: ANCHOR_2.Tc,
    relErr: ANCHOR_2.relErr,
    log10T: Math.log10(ANCHOR_2.Tc),
    systematicPrediction: systematicLine(ANCHOR_2.Tc),
    samplingNoisePrediction: samplingNoiseLine(ANCHOR_2.Tc),
    insideCone: ANCHOR_2.relErr <= coneUpper(ANCHOR_2.Tc) && ANCHOR_2.relErr >= coneLower(ANCHOR_2.Tc),
  },
});

export const IMP96554_LANDMARKS = Object.freeze({
  exponentSystematic: P_SYSTEMATIC,
  exponentSamplingNoise: P_SAMPLING_NOISE,
  deltaP: DELTA_P,
  SE_p: SE_P,
  separationSigma: SEPARATION_SIGMA,
});

export const IMP96554_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the two candidate power-law '
  + 'lines and the SE(p)~0.21 cone are computed from the imp-96528 exponent-fit-reach verdict copied '
  + 'verbatim, anchored through the imp-96493 T=1.5e5 measurement; the T=3.879e5 point is the actual '
  + 'imp-96493 measurement, not a prediction. Neither exponent is established -- the fixed 10^6 '
  + 'Odlyzko set cannot resolve Delta_p=0.25 at better than ~' + SEPARATION_SIGMA.toFixed(2)
  + ' sigma. Changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96554_VALIDATION = Object.freeze({
  seriesCoversGrid: IMP96554_CONE_SERIES.length === GRID_POINTS,
  seriesMonotoneInT: IMP96554_CONE_SERIES.every((p, i) => i === 0 || p.Tc > IMP96554_CONE_SERIES[i - 1].Tc),
  systematicLineFlatThroughAnchor1: Math.abs(systematicLine(ANCHOR_1.Tc) - ANCHOR_1.relErr) < 1e-12,
  samplingNoiseLineThroughAnchor1: Math.abs(samplingNoiseLine(ANCHOR_1.Tc) - ANCHOR_1.relErr) < 1e-12,
  coneWidensAwayFromAnchor1: coneHalfWidth(ANCHOR_2.Tc) > coneHalfWidth(1.6e5),
  anchor2BelowBothPredictions:
    ANCHOR_2.relErr < systematicLine(ANCHOR_2.Tc) && ANCHOR_2.relErr < samplingNoiseLine(ANCHOR_2.Tc),
  separationSigmaMatchesSource: Math.abs(SEPARATION_SIGMA - DELTA_P / SE_P) < 1e-9,
});

export default IMP96554_CONE_SERIES;
