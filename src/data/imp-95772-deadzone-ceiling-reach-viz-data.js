/**
 * @module imp-95772-deadzone-ceiling-reach-viz-data
 * @fileoverview imp-95772 -- extends the imp-95753 dead-zone log-T axis with a fourth
 *   landmark: the imp-95750 direct-measurement ceiling gamma_1e6 = 6.003e5 (the largest
 *   verified ordinate in the repo). Annotates how little of the ~3.36-decade gap to the
 *   imp-3444 crossover that ceiling actually reaches: only ~0.079 decade, ~2.4% of the
 *   gap, leaving 3.279 decades to the crossover and 6.699 decades to the imp-95519 window
 *   bottom UNREACHED by direct measurement.
 *
 *   Self-computing from the already-published imp-95753 axis landmarks and the imp-95750
 *   ceiling assessment -- no re-derivation, no fresh quadrature, no heavy imports.
 *   Presentation/reshaping only; changes no bound; no refereed bound is changed
 *   ; no QED.
 *
 *   @see imp-95753-crossover-height-window-viz-data.js (the three-landmark axis this extends)
 *   @see imp-95750-number-variance-deadzone-measurement-reach.js (the ceiling + reach figures)
 */

import { IMP95753_AXIS_LANDMARKS, IMP95753_GAP_DECADES } from './imp-95753-crossover-height-window-viz-data.js';
import { IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH } from './imp-95750-number-variance-deadzone-measurement-reach.js';

const { measurementCeiling, decades } = IMP95750_NUMBER_VARIANCE_DEADZONE_MEASUREMENT_REACH;

// The ceiling landmark, inserted between the imp-95753 conservatism_top and crossover.
export const IMP95772_CEILING_LANDMARK = Object.freeze({
  name: 'measurement_ceiling',
  label: 'imp-95750 direct-measurement ceiling (gamma_1e6)',
  T: measurementCeiling.largestOrdinate,
  log10T: +Math.log10(measurementCeiling.largestOrdinate).toFixed(4),
});

// Full four-landmark axis, ascending in log10T: conservatism_top, ceiling, crossover, window_bottom.
export const IMP95772_EXTENDED_AXIS_LANDMARKS = Object.freeze([
  IMP95753_AXIS_LANDMARKS[0],
  IMP95772_CEILING_LANDMARK,
  IMP95753_AXIS_LANDMARKS[1],
  IMP95753_AXIS_LANDMARKS[2],
]);

export const IMP95772_REACH_ANNOTATION = Object.freeze({
  ceilingGainDecades: decades.ceilingGainDecades, // ~0.079
  fractionOfGapAttainablePct: decades.fractionOfGapAttainablePct, // ~2.36
  remainingToCrossoverDecades: decades.remainingToCrossoverDecades, // ~3.279
  remainingToWindowBottomDecades: decades.remainingToWindowBottomDecades, // ~6.699
  text:
    `Pushing the measured top from 5e5 to the gamma_1e6 = 6.003e5 ceiling gains only ` +
    `~${decades.ceilingGainDecades.toFixed(3)} decade -- ~${decades.fractionOfGapAttainablePct.toFixed(1)}% of the ` +
    `${IMP95753_GAP_DECADES.belowCrossover.toFixed(2)}-decade gap to the crossover. From the ceiling, ` +
    `${decades.remainingToCrossoverDecades.toFixed(3)} decades remain to the crossover and ` +
    `${decades.remainingToWindowBottomDecades.toFixed(3)} decades remain to the window bottom -- ` +
    `both stay reliant on the imp-95722 derived envelope, not direct measurement.`,
});

export const IMP95772_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW placing the already-assessed imp-95750 direct-measurement ' +
  'ceiling on the imp-95753 log-T axis. It shows how little of the dead zone the ceiling reaches -- ' +
  'about 2.4% of the gap to the crossover. Presentation only; introduces no new cited input and ' +
  'changes no bound; no refereed bound is changed. No QED.';

export const IMP95772_DEADZONE_CEILING_REACH_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95772-four-landmarks-ascending',
    description: 'the four extended axis landmarks are strictly ascending in log10T',
    holds: () =>
      IMP95772_EXTENDED_AXIS_LANDMARKS.every(
        (m, i) => i === 0 || IMP95772_EXTENDED_AXIS_LANDMARKS[i - 1].log10T < m.log10T,
      ),
  },
  {
    id: 'imp95772-ceiling-between-top-and-crossover',
    description: 'the ceiling landmark sits strictly between the conservatism top and the crossover',
    holds: () =>
      IMP95772_CEILING_LANDMARK.T > IMP95753_AXIS_LANDMARKS[0].T &&
      IMP95772_CEILING_LANDMARK.T < IMP95753_AXIS_LANDMARKS[1].T,
  },
  {
    id: 'imp95772-reach-fraction-small',
    description: 'the attainable fraction of the gap is a few percent, not a meaningful dent',
    holds: () => IMP95772_REACH_ANNOTATION.fractionOfGapAttainablePct > 0 && IMP95772_REACH_ANNOTATION.fractionOfGapAttainablePct < 5,
  },
  {
    id: 'imp95772-remaining-decades-exceed-three',
    description: 'more than three decades remain unreached to the crossover from the ceiling',
    holds: () => IMP95772_REACH_ANNOTATION.remainingToCrossoverDecades > 3,
  },
  {
    id: 'imp95772-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95772_CAVEAT_BANNER) && /No QED/.test(IMP95772_CAVEAT_BANNER),
  },
];

for (const a of IMP95772_DEADZONE_CEILING_REACH_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95772-deadzone-ceiling-reach-viz-data assertion failed: ${a.id}`);
  }
}
