/**
 * @module imp-97198-ceiling-ladder-five-rung-viz-data
 * @fileoverview imp-97198 -- VIZ DATA ONLY. Bakes the imp-96918 reconciled
 *   five-rung Route M conditioning-ceiling band (trace < Frobenius-rigorous <
 *   concave-tail < concave-quad < measured/fit) into a single chart-ready
 *   series with adjacent-gap percentages, so the tightening margin toward the
 *   measured rung (44.5% -> 2.4% -> 6.9% -> 0.15%) reads directly off one row
 *   set. Values are literals recomputed once from imp-96918's exported
 *   IMP96918_ORDER_CHECK (itself importing IMP96682_LADDER and
 *   IMP96890_CEILING unchanged) -- no re-derivation, no Gram rebuilt, no
 *   bound moved.
 *
 *   Honesty note carried forward from imp-96918/imp-97081: the quadratic rung
 *   (concaveQuad, 4.103e7) is the LATER-REJECTED top end of the band --
 *   imp-97081 supplies an independent far-field anchor and narrows the
 *   credible band to [3.775e7, 3.838e7], below this rung. It is kept here
 *   only because it is part of the imp-96918 ladder this ticket visualizes;
 *   see the `laterCorrection` field below.
 *
 *   @see imp-96918-route-m-ceiling-ladder-concave-reconciliation.js (the
 *        five-rung reconciliation this bakes)
 *   @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js
 *        (later correction rejecting the quadratic top end)
 *
 *   Ticket: imp-97198 (ux, low). Presentation of an already-derived ladder;
 *   adds no new Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- five-rung ceiling ladder, exact N values recomputed from imp-96918's exports --
export const IMP97198_LADDER_ROWS = Object.freeze([
  Object.freeze({ rung: 'trace', label: 'Trace (rigorous)', N: 25937278.29573841 }),
  Object.freeze({ rung: 'frobeniusRigorous', label: 'Frobenius (rigorous, sharper)', N: 37479074.57561329 }),
  Object.freeze({ rung: 'concaveTail', label: 'Concave-tail (+d/N, safer extrapolant)', N: 38383636.06582387 }),
  Object.freeze({ rung: 'concaveQuad', label: 'Concave-quad (unphysical far out)', N: 41029191.34241058 }),
  Object.freeze({ rung: 'measured', label: 'Measured / fit (composed)', N: 41088904.757400334 }),
]);

// -- adjacent-gap percentages: (next.N / prev.N - 1) * 100, in ladder order --
export const IMP97198_ADJACENT_GAPS_PCT = Object.freeze([
  Object.freeze({ from: 'trace', to: 'frobeniusRigorous', gapPct: 44.498872041525026 }),
  Object.freeze({ from: 'frobeniusRigorous', to: 'concaveTail', gapPct: 2.413510740201552 }),
  Object.freeze({ from: 'concaveTail', to: 'concaveQuad', gapPct: 6.892404023552801 }),
  Object.freeze({ from: 'concaveQuad', to: 'measured', gapPct: 0.14553885425481194 }),
]);

export const IMP97198_TIGHTEST_GAP = Object.freeze({
  pair: ['concaveQuad', 'measured'],
  gapPct: 0.14553885425481194,
  isTightestInLadder: true,
});

// -- honesty carry-forward: imp-97081 later rejects the concaveQuad rung as an unphysical
// curvature over-run and narrows the credible band to [3.775e7, 3.838e7] --
export const IMP97198_LATER_CORRECTION = Object.freeze({
  supersededBy: 'imp-97081',
  rungRejected: 'concaveQuad',
  narrowedBandLo: 3.775e7,
  narrowedBandHi: 38383636.06582387,
});

export const IMP97198_VERDICT = Object.freeze({
  rowCount: 5,
  strictlyOrdered: true,
  tightestGapPair: 'concaveQuad -> measured',
  boundMoved: false,
});

export const IMP97198_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: reshapes the ' +
  'already-derived (imp-96918) five-rung conditioning-ceiling ladder into a single ' +
  'chart-ready series with adjacent-gap percentages. No re-derivation, no bound moved, ' +
  'says nothing about the zeros. The concaveQuad rung is later rejected by imp-97081.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97198_VALIDATION = Object.freeze({
  rows_present: IMP97198_LADDER_ROWS.length === 5,
  gaps_present: IMP97198_ADJACENT_GAPS_PCT.length === 4,
  strictly_increasing: IMP97198_LADDER_ROWS.every(
    (r, i) => i === 0 || r.N > IMP97198_LADDER_ROWS[i - 1].N,
  ),
  gaps_all_positive: IMP97198_ADJACENT_GAPS_PCT.every((g) => g.gapPct > 0),
  tightest_gap_is_last: IMP97198_ADJACENT_GAPS_PCT[3].gapPct === IMP97198_TIGHTEST_GAP.gapPct &&
    IMP97198_ADJACENT_GAPS_PCT.every((g, i) => i === 3 || g.gapPct > IMP97198_ADJACENT_GAPS_PCT[3].gapPct),
});

export default Object.freeze({
  id: 'imp-97198-ceiling-ladder-five-rung-viz-data',
  ticket: 'imp-97198',
  source: 'imp-96918-route-m-ceiling-ladder-concave-reconciliation.js',
  rows: IMP97198_LADDER_ROWS,
  adjacentGapsPct: IMP97198_ADJACENT_GAPS_PCT,
  tightestGap: IMP97198_TIGHTEST_GAP,
  laterCorrection: IMP97198_LATER_CORRECTION,
  verdict: IMP97198_VERDICT,
  boundMoved: false,
});
