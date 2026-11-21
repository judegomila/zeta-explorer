/**
 * @module imp-97554-b4-ceiling-minb-p0-viz-data
 *
 * imp-97554 (ux): import-light viz-data leaf visualizing the imp-97500 RESULT 3
 * CROSSINGS table -- the counterexample size log10(b) = Prod_{P0<=p<=Ycross} p vs
 * the window floor P0 -- showing the INTERIOR minimum at P0=1409
 * (log10(b_min) = 17,823,049, ~17.82 million digits), ~44% fewer digits than the
 * imp-97496 boundary witness at P0=379.
 *
 * PRESENTATION ONLY. All (P0, log10b) points are reused verbatim from the
 * committed IMP97500_KERNEL.CROSSINGS; nothing is re-derived. The b/4-ceiling
 * lower edge was already REFUTED (imp-97481) and is a dead route; this only
 * charts the already-measured smallest-witness curve. No bound moves;
 * kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (the CROSSINGS table, reused verbatim)
 * @see imp-97540-route-m-b4-ceiling-minb-p0-optimum-refined.js (fine-grid refinement: true optimum P0=1429, ~0.004% smaller)
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (proved the lower edge false; dead route)
 *
 * Ticket: imp-97554 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP97500_KERNEL, IMP97500_VERDICT } from './imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js';

// Only the P0 values with an exact crossing within the 1e8 sieve reach (drop
// the two null rows: P0=101 and P0=20011 never cross within Y=1e8).
export const IMP97554_POINTS = Object.freeze(
  IMP97500_KERNEL.CROSSINGS.filter((r) => r.log10b !== null).map((r) =>
    Object.freeze({ P0: r.P0, crossY: r.crossY, log10b: r.log10b })
  )
);

export const IMP97554_MIN_WITNESS = Object.freeze({ ...IMP97500_KERNEL.MIN_B_WITNESS });

export const IMP97554_VERDICT = Object.freeze({
  ticket: 'imp-97554',
  sourceTicket: 'imp-97500',
  claim:
    'charts the imp-97500 RESULT 3 counterexample-size curve log10(b) vs P0: the size is minimized at an ' +
    'interior P0=1409 (log10(b_min)=17,823,049, ~17.82M digits), not at the imp-97496 boundary P0=379 ' +
    '(log10b=31,966,693, ~31.97M digits) -- ~44% fewer digits.',
  dataReusedVerbatim: true,
  minBIsInterior: IMP97500_VERDICT.minBIsInterior,
  boundMoves: false,
  qed: false,
});
export default IMP97554_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97554_ASSERTIONS = [
  {
    id: 'imp97554-points-drop-null-crossings',
    holds: () => IMP97554_POINTS.length === IMP97500_KERNEL.CROSSINGS.length - 2 && IMP97554_POINTS.every((p) => Number.isFinite(p.log10b)),
    why: 'the plotted set must drop the two rows (P0=101, P0=20011) where the 1e8 sieve never reaches a crossing.',
  },
  {
    id: 'imp97554-interior-minimum-at-p0-1409',
    holds: () => {
      let best = null;
      for (const p of IMP97554_POINTS) if (!best || p.log10b < best.log10b) best = p;
      return best.P0 === 1409 && best.log10b === IMP97554_MIN_WITNESS.log10b;
    },
    why: 'the minimum of the charted curve must sit at P0=1409, matching the imp-97500 MIN_B_WITNESS.',
  },
  {
    id: 'imp97554-min-below-both-neighbours-in-P0',
    holds: () => {
      const sorted = [...IMP97554_POINTS].sort((a, b) => a.P0 - b.P0);
      const idx = sorted.findIndex((p) => p.P0 === 1409);
      return idx > 0 && idx < sorted.length - 1 && sorted[idx - 1].log10b > sorted[idx].log10b && sorted[idx + 1].log10b > sorted[idx].log10b;
    },
    why: 'confirms the P0=1409 point is a genuine interior minimum: both its P0-neighbours in the charted set sit higher.',
  },
  {
    id: 'imp97554-min-witness-matches-source',
    holds: () =>
      IMP97554_MIN_WITNESS.P0 === 1409 &&
      IMP97554_MIN_WITNESS.log10b === 17823049 &&
      IMP97554_MIN_WITNESS.vsImp97496P0379Log10b === 31966693,
    why: 'the min-witness summary must reproduce the imp-97500 baked constants exactly.',
  },
  {
    id: 'imp97554-honesty-gate-no-qed',
    holds: () =>
      IMP97554_VERDICT.dataReusedVerbatim === true &&
      IMP97554_VERDICT.minBIsInterior === true &&
      IMP97554_VERDICT.boundMoves === false &&
      IMP97554_VERDICT.qed === false,
    why: 'presentation-only leaf: data reused verbatim from imp-97500; no bound moves; NO QED.',
  },
];

for (const t of IMP97554_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97554-b4-ceiling-minb-p0-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
