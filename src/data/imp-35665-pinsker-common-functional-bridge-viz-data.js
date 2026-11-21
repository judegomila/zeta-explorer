/**
 * @module imp-35665-pinsker-common-functional-bridge-viz-data
 * @fileoverview imp-35665 -- VIZ DATA ONLY for the imp-35556 Pinsker common-first-order-functional
 *   bridge: the three KL g_true values (free 3.214e-4, 1/logT0 1.146e-3, 1/logT0^2 6.816e-4), their
 *   Pinsker TV <= sqrt(KL/2) upper bounds (1.2677e-2, 2.3938e-2, 1.8460e-2), and the E_coll-multiple
 *   ratios (414.3x, 782.3x, 603.3x). Includes an UPPER-ONLY banner stating the Pinsker bound cannot
 *   certify the g_true >> E_coll gap.
 *
 *   Re-exports the imp-35556 pinskerBridge literals directly (that module is import-light: pure
 *   Math, no heavy dependency, never the 16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35556-gtrue-ecoll-dimensional-comparability.js (the Pinsker bridge table this re-exports)
 *   @see imp-35530-crossover-gtrue-trend-extrapolation.js (the projected ~10.5x raw gap)
 *   @see imp-35337-sigma-landmarks-double-double-certification.js (imp-35337a surrogate->observable dictionary, OPEN)
 *
 *   Ticket: imp-35665 (ux, medium). Presentation only of an already-established assessment; adds no
 *   new Lambda bound. Discharges nothing; imp-35556a/imp-35337a stay OPEN. C_mb GUE-conditional per
 *   imp-486 UNTOUCHED. NO QED. No refereed bound is changed.
 */

import { IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY } from './imp-35556-gtrue-ecoll-dimensional-comparability.js';

const { pinskerBridge, dimensionalReading } = IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY;

export const IMP35665_ROWS = [
  { key: 'free', label: 'free exponent', kl: pinskerBridge.freeFit.kl, tvUpperBound: pinskerBridge.freeFit.tvUpperBound, tvUbOverEcoll: pinskerBridge.freeFit.tvUbOverEcoll },
  { key: 'p1', label: 'forced 1/logT0', kl: pinskerBridge.p1.kl, tvUpperBound: pinskerBridge.p1.tvUpperBound, tvUbOverEcoll: pinskerBridge.p1.tvUbOverEcoll },
  { key: 'p2', label: 'forced 1/logT0^2', kl: pinskerBridge.p2.kl, tvUpperBound: pinskerBridge.p2.tvUpperBound, tvUbOverEcoll: pinskerBridge.p2.tvUbOverEcoll },
];

export const IMP35665_ECOLL_CROSS = pinskerBridge.ecollCross;
export const IMP35665_RAW_RATIO = dimensionalReading.rawRatio;

export const IMP35665_SUMMARY = Object.freeze({
  rowCount: IMP35665_ROWS.length,
  rawRatio: IMP35665_RAW_RATIO,
  multiplierChangesEntirely: IMP35665_ROWS.every((r) => Math.abs(r.tvUbOverEcoll - IMP35665_RAW_RATIO) > 300),
  upperBoundOnly: pinskerBridge.upperBoundOnly,
});

export default Object.freeze({
  id: 'imp-35665-pinsker-common-functional-bridge-viz-data',
  ticket: 'imp-35665',
  sources: ['imp-35556-gtrue-ecoll-dimensional-comparability.js'],
  rows: IMP35665_ROWS,
  ecollCross: IMP35665_ECOLL_CROSS,
  rawRatio: IMP35665_RAW_RATIO,
  summary: IMP35665_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35665_ASSERTIONS = [
  {
    id: 'imp35665-three-rows-present',
    holds: () => IMP35665_ROWS.length === 3,
    why: 'The table must cover all three KL fits (free, forced 1/logT0, forced 1/logT0^2).',
  },
  {
    id: 'imp35665-tv-values-match-imp35556',
    holds: () =>
      Math.abs(IMP35665_ROWS[0].tvUpperBound - 1.2677e-2) < 5e-5 &&
      Math.abs(IMP35665_ROWS[1].tvUpperBound - 2.3938e-2) < 5e-5 &&
      Math.abs(IMP35665_ROWS[2].tvUpperBound - 1.8460e-2) < 5e-5,
    why: 'The three Pinsker TV upper bounds must reproduce imp-35556 to within rounding.',
  },
  {
    id: 'imp35665-ecoll-multiples-match-imp35556',
    holds: () =>
      Math.abs(IMP35665_ROWS[0].tvUbOverEcoll - 414.3) < 1 &&
      Math.abs(IMP35665_ROWS[1].tvUbOverEcoll - 782.3) < 1 &&
      Math.abs(IMP35665_ROWS[2].tvUbOverEcoll - 603.3) < 1,
    why: 'The three E_coll-multiple ratios must reproduce imp-35556: 414.3x, 782.3x, 603.3x.',
  },
  {
    id: 'imp35665-raw-ratio-is-10-point-5x',
    holds: () => IMP35665_RAW_RATIO > 10 && IMP35665_RAW_RATIO < 11,
    why: 'The raw KL/E_coll ratio must be the imp-35530 ~10.5x figure this page contrasts against.',
  },
  {
    id: 'imp35665-multiplier-changes-entirely-and-is-upper-only',
    holds: () => IMP35665_SUMMARY.multiplierChangesEntirely === true && IMP35665_SUMMARY.upperBoundOnly === true,
    why: 'The banner claim requires the Pinsker multiplier to differ from the raw ratio by hundreds-x and the bound to be flagged upper-only.',
  },
];

for (const assertion of IMP35665_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35665-pinsker-common-functional-bridge-viz-data assertion failed: ${assertion.id}`);
  }
}
