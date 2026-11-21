/**
 * @module imp-95753-crossover-height-window-viz-data
 * @fileoverview imp-95753 -- lightweight viz-data module reshaping the imp-95729
 *   common-RvM-height placement into a single log-T axis: three landmarks (the
 *   imp-95710 measured conservatism top T = 5e5, the imp-3444 E_coll = E_trunc
 *   crossover T0 ~ 1.14e9, and the imp-95519 verified-height window bottom
 *   T = 3.0e12), plus the log-midpoint diagnostic showing the crossover lands
 *   almost exactly halfway (in log10 T) between the measured top and the
 *   window bottom.
 *
 *   Self-computing from the already-measured imp-95729 placement -- no
 *   re-derivation, no fresh quadrature, no heavy imports. Viz data only;
 *   changes no bound; no QED.
 *
 *   @see imp-95729-crossover-height-vs-variance-window.js (the measured placement this reshapes)
 */

import { IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW } from './imp-95729-crossover-height-vs-variance-window.js';

const { placement } = IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW;

// Three landmarks on the common log-T axis, in ascending height order.
export const IMP95753_AXIS_LANDMARKS = Object.freeze([
  Object.freeze({
    name: 'conservatism_top',
    label: 'imp-95710 measured top',
    T: placement.varianceMeasuredWindowT[1], // 5e5
    log10T: +Math.log10(placement.varianceMeasuredWindowT[1]).toFixed(4),
  }),
  Object.freeze({
    name: 'crossover',
    label: 'imp-3444 E_coll = E_trunc crossover',
    T: placement.crossoverT0, // ~1.14e9
    log10T: placement.crossoverLog10T0,
  }),
  Object.freeze({
    name: 'window_bottom',
    label: 'imp-95519 window bottom',
    T: placement.windowBottomT, // 3.0e12
    log10T: +Math.log10(placement.windowBottomT).toFixed(4),
  }),
]);

export const IMP95753_GAP_DECADES = Object.freeze({
  belowCrossover: placement.decadesAboveMeasuredTop, // ~3.36
  aboveCrossover: placement.decadesBelowWindowBottom, // ~3.42
  total: placement.gapTotalDecades, // ~6.78
  logMidpointOffset: placement.logMidpointOffsetDecades, // ~0.03
});

export const IMP95753_GEOMETRIC_MEAN_GAP_T = placement.geometricMeanGapT; // sqrt(5e5 * 3e12)

export const IMP95753_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-95729 common-height ' +
  'placement, not a new measurement. The axis shows the imp-3444 E_coll = E_trunc crossover ' +
  'landing inside the ~6.78-decade UNMEASURED gap between the imp-95710 conservatism top and the ' +
  'imp-95519 window bottom, near the log-midpoint of that gap. Model seam family only; introduces ' +
  'no new cited input and changes no bound; no refereed bound is changed' +
  '. No QED.';

export const IMP95753_CROSSOVER_HEIGHT_WINDOW_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95753-landmarks-ascending',
    description: 'the three axis landmarks are strictly ascending in log10T (measured top < crossover < window bottom)',
    holds: () =>
      IMP95753_AXIS_LANDMARKS[0].log10T < IMP95753_AXIS_LANDMARKS[1].log10T &&
      IMP95753_AXIS_LANDMARKS[1].log10T < IMP95753_AXIS_LANDMARKS[2].log10T,
  },
  {
    id: 'imp95753-landmarks-match-source',
    description: 'every reshaped landmark T value matches the source imp-95729 placement exactly',
    holds: () =>
      IMP95753_AXIS_LANDMARKS[0].T === placement.varianceMeasuredWindowT[1] &&
      IMP95753_AXIS_LANDMARKS[1].T === placement.crossoverT0 &&
      IMP95753_AXIS_LANDMARKS[2].T === placement.windowBottomT,
  },
  {
    id: 'imp95753-gap-decades-sum',
    description: 'the below-crossover and above-crossover decade gaps sum to the total gap decades',
    holds: () =>
      Math.abs(
        IMP95753_GAP_DECADES.belowCrossover + IMP95753_GAP_DECADES.aboveCrossover - IMP95753_GAP_DECADES.total,
      ) < 1e-3,
  },
  {
    id: 'imp95753-near-log-midpoint',
    description: 'the crossover sits near the log-midpoint of the gap (offset well under a decade)',
    holds: () => IMP95753_GAP_DECADES.logMidpointOffset < 0.5,
  },
  {
    id: 'imp95753-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95753_CAVEAT_BANNER) && /No QED/.test(IMP95753_CAVEAT_BANNER),
  },
];

for (const a of IMP95753_CROSSOVER_HEIGHT_WINDOW_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95753-crossover-height-window-viz-data assertion failed: ${a.id}`);
  }
}
