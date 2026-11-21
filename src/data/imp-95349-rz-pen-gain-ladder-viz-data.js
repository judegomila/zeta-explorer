/**
 * @module imp-95349-rz-pen-gain-ladder-viz-data
 *
 * imp-95349 (ux): lightweight, import-light viz-data module charting the
 * RZ-PEN symbol-pencil floor gain ladder across the committed chain legs
 * imp-95329 (LEMMA BCAP / THEOREM RZ-PEN3, beta-trace cap), imp-95330
 * (LEMMA G-MONO / THEOREM RZ-PEN4, K = 256 chart refinement), imp-95331
 * (LEMMA ROOT-MONO + LEMMA W-SPLIT / THEOREM RZ-PEN5, split-weight
 * exact-root), and imp-95332 (LEMMA TAIL-CHART / THEOREM RZ-PEN6,
 * per-chart tail cap), at rho = e^6 (r = 2 for the two split-weight /
 * tail legs, r-independent for the first two per COROLLARY PEN-UNIF3 /
 * PEN-UNIF4).
 *
 * Two things are plotted: (1) the per-leg floor gain factor
 * A_pen_{k}/A_pen_{k-1} at each leg (6.0731x, 1.1458x, 1.5389x, 1.2025x),
 * and the resulting cumulative floor gain relative to RZ-PEN2
 * (12.877x by RZ-PEN6); (2) the residual looseness inf/A_pen against the
 * exact symbol-pencil infimum at (rho, r) = (e^6, 2), which the imp-95331
 * and imp-95332 modules already baked at three of these legs: RZ-PEN4
 * (9.3179, imp-95331's "Pen4Ref"), RZ-PEN5 (6.085), RZ-PEN6 (5.060).
 *
 * All values are taken verbatim from the cited modules' own exported
 * records -- no re-derivation, no re-execution of the underlying 256-chart
 * / pair-identity numerics beyond what those modules already compute at
 * import time. This module only multiplies and re-presents already-baked
 * numbers (the cumulative gain is the product of the four per-leg gains;
 * the looseness values are copied fields cross-checked for consistency
 * between the imp-95331 and imp-95332 records, which name the same
 * imp-95331 RZ-PEN5 floor as "Pen4Ref" / bare and "Pen5Ref" respectively).
 * Follows the imp-95317 / imp-95319 import-light viz-data pattern.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-95329-beta-trace-capped-pencil-floor.js (THEOREM RZ-PEN3,
 *   gainRhoE6)
 * @see imp-95330-chart-refined-pencil-floor.js (THEOREM RZ-PEN4,
 *   gainRhoE6)
 * @see imp-95331-split-weight-exact-root-pencil-floor.js (THEOREM RZ-PEN5,
 *   gainRhoE6R2, loosenessRhoE6R2, loosenessRhoE6R2Pen4Ref)
 * @see imp-95332-chart-tail-pencil-floor.js (THEOREM RZ-PEN6,
 *   gainRhoE6R2, loosenessRhoE6R2, loosenessRhoE6R2Pen5Ref)
 *
 * Ticket: imp-95349 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR } from './imp-95329-beta-trace-capped-pencil-floor.js';
import { IMP95330_CHART_REFINED_PENCIL_FLOOR } from './imp-95330-chart-refined-pencil-floor.js';
import { IMP95331_SPLIT_WEIGHT_EXACT_ROOT_PENCIL_FLOOR } from './imp-95331-split-weight-exact-root-pencil-floor.js';
import { IMP95332_CHART_TAIL_PENCIL_FLOOR } from './imp-95332-chart-tail-pencil-floor.js';

const pen3 = IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR.theoremRzPen3;
const pen4 = IMP95330_CHART_REFINED_PENCIL_FLOOR.theoremRzPen4;
const pen5 = IMP95331_SPLIT_WEIGHT_EXACT_ROOT_PENCIL_FLOOR.theoremRzPen5;
const pen6 = IMP95332_CHART_TAIL_PENCIL_FLOOR.theoremRzPen6;

// per-leg floor gain factor A_pen_k / A_pen_{k-1} at rho = e^6
// (r-independent for RZ-PEN3/RZ-PEN4 per COROLLARY PEN-UNIF3/4; r = 2 for
// RZ-PEN5/RZ-PEN6, the two legs where the split-weight / tail floors
// depend on r)
export const IMP95349_LEG_GAINS = [
  { leg: 'RZ-PEN3', module: 'imp-95329', label: 'beta-trace cap', gain: pen3.gainRhoE6 },
  { leg: 'RZ-PEN4', module: 'imp-95330', label: 'K=256 chart refine', gain: pen4.gainRhoE6 },
  { leg: 'RZ-PEN5', module: 'imp-95331', label: 'split-weight exact-root (r=2)', gain: pen5.gainRhoE6R2 },
  { leg: 'RZ-PEN6', module: 'imp-95332', label: 'per-chart tail cap (r=2)', gain: pen6.gainRhoE6R2 },
];

// cumulative floor gain relative to RZ-PEN2, at rho = e^6
export const IMP95349_CUMULATIVE_GAINS = (() => {
  let running = 1;
  const rows = [{ leg: 'RZ-PEN2', module: 'imp-95328', cumulativeGain: 1 }];
  for (const g of IMP95349_LEG_GAINS) {
    running *= g.gain;
    rows.push({ leg: g.leg, module: g.module, cumulativeGain: running });
  }
  return rows;
})();

// residual looseness inf(exact symbol-pencil) / A_pen at (rho, r) = (e^6, 2),
// as baked directly in the imp-95331 / imp-95332 records
export const IMP95349_LOOSENESS_LADDER = [
  { leg: 'RZ-PEN4', module: 'imp-95331', looseness: pen5.loosenessRhoE6R2Pen4Ref },
  { leg: 'RZ-PEN5', module: 'imp-95331', looseness: pen5.loosenessRhoE6R2 },
  { leg: 'RZ-PEN6', module: 'imp-95332', looseness: pen6.loosenessRhoE6R2 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95349_ASSERTIONS = [
  {
    id: 'imp95349-leg-gains-match-source-records',
    description:
      'every baked per-leg gain factor is copied verbatim from its source module record field (gainRhoE6 / gainRhoE6R2)',
    holds: () =>
      IMP95349_LEG_GAINS[0].gain === pen3.gainRhoE6 &&
      IMP95349_LEG_GAINS[1].gain === pen4.gainRhoE6 &&
      IMP95349_LEG_GAINS[2].gain === pen5.gainRhoE6R2 &&
      IMP95349_LEG_GAINS[3].gain === pen6.gainRhoE6R2,
  },
  {
    id: 'imp95349-leg-gains-all-exceed-one',
    description:
      'every committed leg is a genuine floor sharpening at rho = e^6 (gain > 1, per each leg’s A_pen_k >= A_pen_{k-1} dominance argument)',
    holds: () => IMP95349_LEG_GAINS.every((g) => g.gain > 1),
  },
  {
    id: 'imp95349-cumulative-gain-is-running-product',
    description:
      'the cumulative gain at each rung equals the running product of the per-leg gains up to that rung',
    holds: () => {
      let running = 1;
      for (let i = 0; i < IMP95349_LEG_GAINS.length; i++) {
        running *= IMP95349_LEG_GAINS[i].gain;
        const row = IMP95349_CUMULATIVE_GAINS[i + 1];
        if (Math.abs(row.cumulativeGain - running) > 1e-9) return false;
      }
      return IMP95349_CUMULATIVE_GAINS[0].cumulativeGain === 1;
    },
  },
  {
    id: 'imp95349-cumulative-gain-strictly-increasing',
    description:
      'the cumulative floor level relative to RZ-PEN2 strictly increases rung by rung',
    holds: () =>
      IMP95349_CUMULATIVE_GAINS.every(
        (row, i) => i === 0 || row.cumulativeGain > IMP95349_CUMULATIVE_GAINS[i - 1].cumulativeGain,
      ),
  },
  {
    id: 'imp95349-looseness-ladder-matches-source-records-and-decreases',
    description:
      'the residual looseness ladder is copied verbatim from the imp-95331/imp-95332 records, the imp-95331 Pen4Ref and imp-95332 Pen5Ref both name the same RZ-PEN5 floor consistently, and looseness strictly decreases 9.3179 -> 6.085 -> 5.060',
    holds: () =>
      IMP95349_LOOSENESS_LADDER[0].looseness === pen5.loosenessRhoE6R2Pen4Ref &&
      IMP95349_LOOSENESS_LADDER[1].looseness === pen5.loosenessRhoE6R2 &&
      IMP95349_LOOSENESS_LADDER[2].looseness === pen6.loosenessRhoE6R2 &&
      pen6.loosenessRhoE6R2Pen5Ref === pen5.loosenessRhoE6R2 &&
      IMP95349_LOOSENESS_LADDER[0].looseness > IMP95349_LOOSENESS_LADDER[1].looseness &&
      IMP95349_LOOSENESS_LADDER[1].looseness > IMP95349_LOOSENESS_LADDER[2].looseness,
  },
];

for (const a of IMP95349_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95349-rz-pen-gain-ladder-viz-data assertion failed: ${a.id}`);
  }
}
