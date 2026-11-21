/**
 * @module imp-95810-reach-universality-viz-data
 * @fileoverview imp-95810 -- lightweight viz-data module reshaping the imp-95786
 *   reach-universality cross-validation (relative C_fit error vs reach
 *   R = delta(N_max+1)) across the four float64-clean deltas ln 1.6 / ln 1.5 /
 *   ln 1.45 / ln 1.4 into chart-ready rows, plus the imp-95786 measured
 *   sub-1% crossing reaches R* for the three cleanly-monotone deltas.
 *
 *   Self-computing from the already-baked imp-95786 reachTable/crossings and
 *   the imp-95761 ln14PrecisionWall -- no re-derivation, no fresh solve, no
 *   heavy imports. Viz data only; changes no bound; no QED.
 *
 *   @see imp-95786-reach-universality-crossval.js (reachTable, crossings: the source for ln1.6/ln1.5/ln1.45)
 *   @see imp-95761-szego-coefficient-larger-grid-subpct.js (ln14PrecisionWall: the source for ln1.4)
 */

import { IMP95786_REACH_UNIVERSALITY_CROSSVAL } from './imp-95786-reach-universality-crossval.js';
import { IMP95761_SZEGO_COEFFICIENT_LARGER_GRID_SUBPCT } from './imp-95761-szego-coefficient-larger-grid-subpct.js';

const { reachTable, crossings } = IMP95786_REACH_UNIVERSALITY_CROSSVAL;
const { ln14PrecisionWall } = IMP95761_SZEGO_COEFFICIENT_LARGER_GRID_SUBPCT;

// ln1.4 relErr keyed by reach (only measured at 260 / 350 / 450 -- degrades at
// large R because float64 sinks toward the cancellation floor there).
const LN14_BY_REACH = new Map(ln14PrecisionWall.map((p) => [p.reach, p.relErr]));

export const IMP95810_REACH_ROWS = Object.freeze(
  reachTable.map((r) =>
    Object.freeze({
      reach: r.reach,
      ln16: r.ln16,
      ln15: r.ln15,
      ln145: r.ln145,
      ln14: LN14_BY_REACH.has(r.reach) ? LN14_BY_REACH.get(r.reach) : null,
    }),
  ),
);

// Crossing table: the three cleanly-monotone deltas have a measured sub-1% R*.
// ln1.4 has no clean R* -- it dips sub-1% only at reach 260 (-0.75%) then
// DEGRADES at larger reach (-1.05% at 350, -3.08% at 450) as float64 sinks
// toward the cancellation floor, which is exactly why it marks the precision
// wall rather than joining the clean cohort.
export const IMP95810_CROSSINGS = Object.freeze(
  crossings.map((c) => Object.freeze({ ...c, hasCleanRStar: true })),
);

export const IMP95810_LN14_WALL = Object.freeze({
  deltaVal: Math.log(1.4),
  points: ln14PrecisionWall.map((p) => Object.freeze({ ...p })),
  hasCleanRStar: false,
  note:
    'dips sub-1% at reach 260 (-0.75%) but DEGRADES at larger reach (-1.05% at ' +
    '350, -3.08% at 450) as float64 sinks toward the cancellation floor -- the ' +
    'precision-wall boundary, not a clean crossing',
});

export const IMP95810_REACH_MIN = Math.min(...IMP95810_REACH_ROWS.map((r) => r.reach));
export const IMP95810_REACH_MAX = Math.max(...IMP95810_REACH_ROWS.map((r) => r.reach));

export const IMP95810_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95786 reachTable/crossings and ' +
  'imp-95761 ln14PrecisionWall verbatim (no re-derivation, no fresh solve); ' +
  'the reach-universality is an interior model-seam finite-grid diagnostic, ' +
  'not an RH bound. Changes no bound of the Lambda program; NO QED; ' +
  'no refereed bound is changed.';

// imp-95813: the imp-95786 R*-delta-drift sub-gap previously lived only as
// prose in the imp-95786 module's header comment / verdict string. Surfaced
// here as a structured open-residual object so this rendered viz page (the
// frontier surface for this thread) reflects it directly.
export const IMP95810_OPEN_RESIDUAL = Object.freeze({
  id: IMP95786_REACH_UNIVERSALITY_CROSSVAL.subGap,
  status: 'OPEN',
  question:
    'Does R* follow a clean second-order R* = 250 - c*delta form, and does ' +
    'the fully-DD side (ln 1.35 / ln 1.25) cross at the extrapolated R*?',
  context:
    'R* drifts ~10% as delta shrinks (223.0 at ln 1.6 -> 244.7 at ln 1.45), ' +
    'so the N_max ~ 250/delta crossing law is an upper envelope, not exact.',
});
