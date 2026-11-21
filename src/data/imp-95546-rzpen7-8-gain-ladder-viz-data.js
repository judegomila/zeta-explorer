/**
 * @module imp-95546-rzpen7-8-gain-ladder-viz-data
 *
 * imp-95546 (ux): the imp-95407 surfacing audit flagged imp-95333
 * (RZ-PEN7 / LEMMA PAIR-2) and imp-95334 (RZ-PEN8 / LEMMA T-EXACT) as
 * ORPHAN -- import-light modules with no dedicated routed viz page and
 * no visualizations-index.js row, unlike the RZ-PEN3..6 cohort already
 * surfaced by the imp-95349 gain-ladder page. This module extends that
 * gain-ladder presentation two legs further, continuing from RZ-PEN6
 * (the imp-95349 endpoint) through RZ-PEN7 and RZ-PEN8, at
 * (rho, r) = (e^6, 2).
 *
 * All values are copied verbatim from the imp-95333 / imp-95334 exported
 * records -- no re-derivation, no re-execution of the underlying
 * chart-scan numerics beyond what those modules already compute at
 * import time. Follows the imp-95349 gain-ladder viz-data pattern.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-95333-pair-extended-pencil-floor.js (THEOREM RZ-PEN7,
 *   gainRhoE6R2, loosenessRhoE6R2, loosenessRhoE6R2Pen6Ref)
 * @see imp-95334-b-exact-trace-pencil-floor.js (THEOREM RZ-PEN8,
 *   gainRhoE6R2, loosenessRhoE6R2)
 * @see imp-95349-rz-pen-gain-ladder-viz-data.js (RZ-PEN2..RZ-PEN6
 *   predecessor ladder)
 *
 * Ticket: imp-95546 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP95333_PAIR_EXTENDED_PENCIL_FLOOR } from './imp-95333-pair-extended-pencil-floor.js';
import { IMP95334_B_EXACT_TRACE_PENCIL_FLOOR } from './imp-95334-b-exact-trace-pencil-floor.js';

const pen7 = IMP95333_PAIR_EXTENDED_PENCIL_FLOOR.theoremRzPen7;
const pen8 = IMP95334_B_EXACT_TRACE_PENCIL_FLOOR.theoremRzPen8;

// per-leg floor gain factor A_pen_k / A_pen_{k-1} at (rho, r) = (e^6, 2)
export const IMP95546_LEG_GAINS = [
  { leg: 'RZ-PEN7', module: 'imp-95333', label: 'pair-extended dist-1/dist-2 (r=2)', gain: pen7.gainRhoE6R2 },
  { leg: 'RZ-PEN8', module: 'imp-95334', label: 'b-exact pointwise trace (r=2)', gain: pen8.gainRhoE6R2 },
];

// cumulative floor gain relative to RZ-PEN6 (the imp-95349 endpoint), at (rho, r) = (e^6, 2)
export const IMP95546_CUMULATIVE_GAINS = (() => {
  let running = 1;
  const rows = [{ leg: 'RZ-PEN6', module: 'imp-95332', cumulativeGain: 1 }];
  for (const g of IMP95546_LEG_GAINS) {
    running *= g.gain;
    rows.push({ leg: g.leg, module: g.module, cumulativeGain: running });
  }
  return rows;
})();

// residual looseness inf(exact symbol-pencil) / A_pen at (rho, r) = (e^6, 2),
// as baked directly in the imp-95333 / imp-95334 records
export const IMP95546_LOOSENESS_LADDER = [
  { leg: 'RZ-PEN6', module: 'imp-95332', looseness: pen7.loosenessRhoE6R2Pen6Ref },
  { leg: 'RZ-PEN7', module: 'imp-95333', looseness: pen7.loosenessRhoE6R2 },
  { leg: 'RZ-PEN8', module: 'imp-95334', looseness: pen8.loosenessRhoE6R2 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95546_ASSERTIONS = [
  {
    id: 'imp95546-leg-gains-match-source-records',
    description:
      'every baked per-leg gain factor is copied verbatim from its source module record field (gainRhoE6R2)',
    holds: () =>
      IMP95546_LEG_GAINS[0].gain === pen7.gainRhoE6R2 &&
      IMP95546_LEG_GAINS[1].gain === pen8.gainRhoE6R2,
  },
  {
    id: 'imp95546-cumulative-is-running-product',
    description: 'cumulative gain at each leg equals the running product of the per-leg gains',
    holds: () => {
      const c = IMP95546_CUMULATIVE_GAINS;
      return (
        c[0].cumulativeGain === 1 &&
        Math.abs(c[1].cumulativeGain - pen7.gainRhoE6R2) < 1e-12 &&
        Math.abs(c[2].cumulativeGain - pen7.gainRhoE6R2 * pen8.gainRhoE6R2) < 1e-12
      );
    },
  },
  {
    id: 'imp95546-looseness-ladder-monotone-decreasing',
    description: 'the residual looseness against the exact symbol-pencil infimum strictly decreases across the ladder',
    holds: () => {
      const l = IMP95546_LOOSENESS_LADDER;
      return l[0].looseness > l[1].looseness && l[1].looseness > l[2].looseness && l[2].looseness >= 1;
    },
  },
  {
    id: 'imp95546-gains-at-least-one',
    description: 'every leg gain factor is >= 1 (unconditional dominance A_pen_k >= A_pen_{k-1})',
    holds: () => IMP95546_LEG_GAINS.every((g) => g.gain >= 1),
  },
];

for (const a of IMP95546_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95546-rzpen7-8-gain-ladder-viz-data assertion failed: ${a.id}`);
  }
}
