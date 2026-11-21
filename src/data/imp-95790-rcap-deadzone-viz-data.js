/**
 * @module imp-95790-rcap-deadzone-viz-data
 * @fileoverview imp-95790 -- lightweight viz-data module reshaping the imp-95766
 *   r_cap(T) dead-zone measurement into a chart-ready curve: the seven
 *   deadZoneRows plotted against log10 T, the three named landmarks (the
 *   imp-95750 direct-measurement ceiling gamma_1e6, the imp-95729 crossover
 *   T0, and the imp-95519 window bottom), and the (1 - r_cap) margin-below-one
 *   band between the curve and the GUE asymptote r=1.
 *
 *   Self-computing from the already-measured imp-95766 dead-zone rows -- no
 *   re-derivation, no fresh quadrature, no heavy imports. Viz data only;
 *   changes no bound; no QED.
 *
 *   @see imp-95766-number-variance-cap-crossover-deadzone.js (the measurement this reshapes)
 */

import { IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE } from './imp-95766-number-variance-cap-crossover-deadzone.js';

const { deadZoneRows, crossover } = IMP95766_NUMBER_VARIANCE_CAP_CROSSOVER_DEADZONE;

// Chart-ready curve points: one per dead-zone row, ascending log10 T.
export const IMP95790_CURVE_POINTS = Object.freeze(
  deadZoneRows.map((r) =>
    Object.freeze({
      T: r.T,
      log10T: r.log10T,
      rCap: r.rCap,
      marginBelowOne: r.marginBelowOne,
    }),
  ),
);

const LANDMARK_ROW = (T) => deadZoneRows.find((r) => Math.abs(r.T - T) < 1);

// Three named landmarks on the same log10 T axis as the curve.
export const IMP95790_LANDMARKS = Object.freeze([
  Object.freeze({
    name: 'ceiling',
    label: 'imp-95750 direct-measurement ceiling',
    T: deadZoneRows[0].T,
    log10T: deadZoneRows[0].log10T,
    rCap: deadZoneRows[0].rCap,
  }),
  Object.freeze({
    name: 'crossover',
    label: 'imp-95729 crossover T0',
    T: crossover.T,
    log10T: +Math.log10(crossover.T).toFixed(4),
    rCap: crossover.rCap,
  }),
  Object.freeze({
    name: 'window_bottom',
    label: 'imp-95519 window bottom',
    T: deadZoneRows[deadZoneRows.length - 1].T,
    log10T: deadZoneRows[deadZoneRows.length - 1].log10T,
    rCap: deadZoneRows[deadZoneRows.length - 1].rCap,
  }),
]);

export const IMP95790_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-95766 r_cap(T) dead-zone ' +
  'descent, not a new measurement. r_cap(T) is a DERIVED upper envelope (r(T) in (0, r_cap(T)]), ' +
  'not the true pointwise ratio; the shaded band is the margin (1 - r_cap) between that envelope ' +
  'and the GUE asymptote r=1, not a measured uncertainty band. Introduces no new cited input and ' +
  'changes no bound; no refereed bound is changed. No QED.';

export const IMP95790_RCAP_DEADZONE_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95790-curve-has-seven-points',
    description: 'the reshaped curve carries all seven imp-95766 dead-zone rows',
    holds: () => IMP95790_CURVE_POINTS.length === 7,
  },
  {
    id: 'imp95790-curve-strictly-ascending-log10T',
    description: 'the curve points are strictly ascending in log10T',
    holds: () =>
      IMP95790_CURVE_POINTS.every(
        (p, i) => i === 0 || p.log10T > IMP95790_CURVE_POINTS[i - 1].log10T,
      ),
  },
  {
    id: 'imp95790-curve-rcap-monotone-decreasing',
    description: 'r_cap is monotonically non-increasing across the reshaped curve (reproduces imp-95766 F2)',
    holds: () =>
      IMP95790_CURVE_POINTS.every(
        (p, i) => i === 0 || p.rCap <= IMP95790_CURVE_POINTS[i - 1].rCap + 1e-12,
      ),
  },
  {
    id: 'imp95790-landmarks-ascending-and-sub-one',
    description: 'the three landmarks are ascending in log10T and every rCap stays strictly below 1',
    holds: () =>
      IMP95790_LANDMARKS[0].log10T < IMP95790_LANDMARKS[1].log10T &&
      IMP95790_LANDMARKS[1].log10T < IMP95790_LANDMARKS[2].log10T &&
      IMP95790_LANDMARKS.every((m) => m.rCap > 0 && m.rCap < 1),
  },
  {
    id: 'imp95790-landmarks-match-source',
    description: 'the landmark T and rCap values match the source imp-95766 rows/crossover exactly',
    holds: () =>
      IMP95790_LANDMARKS[0].T === deadZoneRows[0].T &&
      IMP95790_LANDMARKS[0].rCap === deadZoneRows[0].rCap &&
      IMP95790_LANDMARKS[1].T === crossover.T &&
      IMP95790_LANDMARKS[1].rCap === crossover.rCap &&
      IMP95790_LANDMARKS[2].T === deadZoneRows[deadZoneRows.length - 1].T &&
      IMP95790_LANDMARKS[2].rCap === deadZoneRows[deadZoneRows.length - 1].rCap,
  },
  {
    id: 'imp95790-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95790_CAVEAT_BANNER) && /No QED/.test(IMP95790_CAVEAT_BANNER),
  },
];

for (const a of IMP95790_RCAP_DEADZONE_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95790-rcap-deadzone-viz-data assertion failed: ${a.id}`);
  }
}
