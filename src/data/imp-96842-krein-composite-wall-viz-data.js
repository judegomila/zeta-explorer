/**
 * @module imp-96842-krein-composite-wall-viz-data
 *
 * imp-96842 (ux): import-light viz-data leaf for the imp-96732 Route I Krein composite-wall
 * assessment. imp-96732 projects two rung-by-rung series across the disputed window
 * 2a in {0.96, 0.98, 0.99, 1.00, 1.0134, ln3}: the certified design margin
 * eps(2a) = 200(1 - 2a) and the tail atom l1-norm magnitude in mantissa bits log2(l1). This
 * leaf reshapes both series into a single chart-ready overlay (twoA on the x-axis, eps and
 * log2L1 as two y-series) plus the two wall markers, so the "eps hits zero at 2a=1.0 while
 * l1 is still only ~30 bits -- the margin wall is reached well before the l1 conditioning
 * blow-up at ln3" reading can be seen at a glance.
 *
 * No re-derivation: every eps value, every log2(l1) value, and both wall locations are
 * copied verbatim from imp-96732. The only new arithmetic here is reshaping into a
 * plot-ready overlay array.
 *
 * @see imp-96732-krein-extended-precision-reach-assessment.js (source rungs, walls, verdict)
 * @see imp-96841-route-m-ceiling-ladder-viz-data.js (sibling import-light viz-data leaf, same convention)
 *
 * Ticket: imp-96842 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294/imp-96819 convention) --
 * values are validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96732_RUNGS, IMP96732_WALLS, IMP96732_VERDICT } from './imp-96732-krein-extended-precision-reach-assessment.js';

// FINDING (composite overlay): eps(2a) and log2(l1) plotted against the same 2a axis, so the
// two walls' relative arrival order is visible on one chart.
export const IMP96842_OVERLAY_SERIES = Object.freeze(
  IMP96732_RUNGS.map((r) => ({
    twoA: r.twoA,
    eps: r.eps,
    log2L1: r.log2L1,
    marginPositive: r.marginPositive,
  })),
);

// FINDING (wall markers): the two projected walls, reshaped for vertical reference lines.
export const IMP96842_WALL_MARKERS = Object.freeze([
  { key: 'epsMarginWall', twoA: IMP96732_WALLS.epsMarginWallTwoA, label: 'eps margin -> 0', log2L1AtWall: Math.log2(IMP96732_WALLS.l1AtEpsWall) },
  { key: 'l1ConditioningBandLo', twoA: IMP96732_WALLS.l1ConditioningBandTwoA.lo, label: 'l1 conditioning band (lo)' },
  { key: 'l1ConditioningBandHi', twoA: IMP96732_WALLS.l1ConditioningBandTwoA.hi, label: 'l1 conditioning band (hi)' },
]);

export const IMP96842_LANDMARKS = Object.freeze({
  epsWallTwoA: IMP96732_WALLS.epsMarginWallTwoA,
  epsWallReachedFirst: IMP96732_WALLS.epsWallReachedFirst,
  log2L1AtEpsWall: Math.log2(IMP96732_WALLS.l1AtEpsWall),
  log2L1AtLn3: Math.log2(IMP96732_WALLS.l1AtLn3),
  plausibleRecoverableWindow: IMP96732_VERDICT.plausibleRecoverableWindow,
  extendedPrecisionReachesLn3: IMP96732_VERDICT.extendedPrecisionReachesLn3,
});

export const IMP96842_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every eps(2a) and ' +
  'log2(l1) value plotted here is copied verbatim from the imp-96732 rung-by-rung projection ' +
  '(itself an assessment, not a solve); the only new arithmetic is the overlay reshaping. ' +
  'Interval-rigorous reach stays exactly 2a <= 0.96; the composite wall reading (eps margin ' +
  'vanishes at 2a=1.0 before the l1 conditioning blow-up near ln3) is a projection from baked ' +
  'log-linear/linear fits, not a re-derivation. Changes no bound and establishes no operator ' +
  'positivity.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP96842_VALIDATION = Object.freeze({
  sixRungsPresent: IMP96842_OVERLAY_SERIES.length === 6,
  threeMarkersPresent: IMP96842_WALL_MARKERS.length === 3,
  epsWallReachedBeforeL1Blowup:
    IMP96842_LANDMARKS.epsWallReachedFirst === true &&
    IMP96842_LANDMARKS.log2L1AtEpsWall < 32 &&
    IMP96842_LANDMARKS.log2L1AtLn3 > 50,
  monotoneDecreasingEps: IMP96842_OVERLAY_SERIES.every(
    (r, i) => i === 0 || r.eps <= IMP96842_OVERLAY_SERIES[i - 1].eps,
  ),
  monotoneIncreasingLog2L1: IMP96842_OVERLAY_SERIES.every(
    (r, i) => i === 0 || r.log2L1 >= IMP96842_OVERLAY_SERIES[i - 1].log2L1,
  ),
});

export default {
  overlaySeries: IMP96842_OVERLAY_SERIES,
  wallMarkers: IMP96842_WALL_MARKERS,
  landmarks: IMP96842_LANDMARKS,
  banner: IMP96842_HONEST_BANNER,
  validation: IMP96842_VALIDATION,
};
