/**
 * @module imp-95688-vk-crossover-height-gap-viz-data
 * @fileoverview imp-95688 -- lightweight viz-data module reshaping the imp-95632
 *   VK-vs-window height gap into a two-landmark log10(T) axis: the imp-95519
 *   barrier window top (T = 1.9e16, log10 T = 16.28) and the Ford
 *   Vinogradov-Korobov / classical zero-free-region crossover
 *   (log t = 10242.24, log10 T = 4448.15), separated by ~4431.87 decades.
 *
 *   Self-computing from the already-measured imp-95632 gap -- no re-derivation,
 *   no fresh quadrature, no heavy imports. Viz data only; changes no bound; no QED.
 *
 *   @see imp-95632-vk-crossover-height-gap.js (the measured gap this reshapes)
 */

import { IMP_95632_VK_CROSSOVER_HEIGHT_GAP } from './imp-95632-vk-crossover-height-gap.js';

const { windowTop, crossover, gapLogT, gapDecadesT, gapFactor, verdict } =
  IMP_95632_VK_CROSSOVER_HEIGHT_GAP;

// Two landmarks on the common log10(T) axis, in ascending height order.
export const IMP95688_AXIS_LANDMARKS = Object.freeze([
  Object.freeze({
    name: 'window_top',
    label: 'imp-95519 barrier window top',
    T: windowTop.T_HI, // 1.9e16
    log10T: +windowTop.log10T.toFixed(4), // 16.28
  }),
  Object.freeze({
    name: 'crossover',
    label: 'Ford VK vs classical crossover',
    T: null, // exp(10242.24) overflows a double -- not representable directly
    log10T: +crossover.log10T.toFixed(4), // 4448.15
  }),
]);

export const IMP95688_GAP = Object.freeze({
  gapLogT: +gapLogT.toFixed(2), // 10204.75 (natural-log height variable)
  gapDecadesT: +gapDecadesT.toFixed(2), // 4431.87 (decades of T)
  gapFactor: Object.freeze({ mantissa: +gapFactor.mantissa.toFixed(2), exponent: gapFactor.exponent }), // ~7.43e4431
});

export const IMP95688_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-95632 height ' +
  'gap, not a new measurement. The Ford Vinogradov-Korobov zero-free-region crossover ' +
  `sits ~${IMP95688_GAP.gapDecadesT.toFixed(2)} decades of T above the imp-95519 barrier window top -- ` +
  'VK offers zero unconditional saving anywhere the barrier operates. Model seam family ' +
  'only; introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. No QED.';

export const IMP95688_VERDICT = verdict;

export const IMP95688_VK_CROSSOVER_HEIGHT_GAP_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95688-landmarks-ascending',
    description: 'the two axis landmarks are strictly ascending in log10T (window top < crossover)',
    holds: () => IMP95688_AXIS_LANDMARKS[0].log10T < IMP95688_AXIS_LANDMARKS[1].log10T,
  },
  {
    id: 'imp95688-landmarks-match-source',
    description: 'the window-top landmark matches the source imp-95632 gap exactly',
    holds: () => IMP95688_AXIS_LANDMARKS[0].T === windowTop.T_HI,
  },
  {
    id: 'imp95688-gap-decades-matches-source',
    description: 'the reshaped gap-decades value matches the source imp-95632 gapDecadesT to displayed precision',
    holds: () => Math.abs(IMP95688_GAP.gapDecadesT - gapDecadesT) < 1e-2,
  },
  {
    id: 'imp95688-gap-is-huge',
    description: 'the gap is at least a thousand decades (sanity floor on the claimed separation)',
    holds: () => IMP95688_GAP.gapDecadesT > 1000,
  },
  {
    id: 'imp95688-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95688_CAVEAT_BANNER) && /No QED/.test(IMP95688_CAVEAT_BANNER),
  },
];

for (const a of IMP95688_VK_CROSSOVER_HEIGHT_GAP_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95688-vk-crossover-height-gap-viz-data assertion failed: ${a.id}`);
  }
}
