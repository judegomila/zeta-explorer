/**
 * @module imp-96515-ppp-collapse-viz-data
 *
 * imp-96515 (ux): import-light viz-data leaf for the imp-96486 basis-C ppp-collapse map.
 * imp-96486 swept the achievable direct basis-C floor across nine L rungs (960 .. the PT
 * anchor 5.9e6), finding the optimal panels-per-period (ppp) collapses monotonically
 * 640 -> 3 and the achievable floor tracks the imp-96430 L-linear cancellation model to
 * within ~2-4x only while ppp* >= 32 (L <= ~1e5), then departs into a ppp-truncation
 * regime reaching 573x above the model at the anchor. It shipped only a baked object,
 * no chart. This module reshapes the nine-rung map into two plot-ready log-log series
 * (optimal ppp vs L, floor-over-model ratio vs L) with the cancellation/truncation
 * branch boundary marked.
 *
 * No re-derivation: every L, optPpp, floor, floorModel and floorOverModel value is
 * copied verbatim from IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION (imp-96486). The only
 * new arithmetic here is deriving each rung's branch label (cancellation / truncation)
 * from the existing truncationOnsetL landmark. Changes no bound; establishes no operator
 * positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96486-basis-c-ppp-collapse-transition.js (the source object this reshapes)
 * @see imp-96430-basis-c-corroboration-reach-crossover.js (the L-linear floor model)
 *
 * Ticket: imp-96515 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no
 * bound; NO QED. No self-executing assertion throw (per the imp-96294 convention) --
 * values are validated below via a plain exported check object instead of an import-time
 * throw.
 */

import { IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION as SRC } from './imp-96486-basis-c-ppp-collapse-transition.js';

const branchFor = (r) =>
  r.L <= SRC.transition.truncationOnsetL ? 'cancellation' : 'truncation';

export const IMP96515_RUNG_POINTS = SRC.rungMap.map((r) => ({
  L: r.L,
  optPpp: r.optPpp,
  floor: r.floor,
  floorModel: r.floorModel,
  floorOverModel: r.floorOverModel,
  branch: branchFor(r),
}));

export const IMP96515_LANDMARKS = Object.freeze({
  ptAnchorL: SRC.ptAnchorL, // 5.9e6
  lastCancellationOptimalL: SRC.transition.lastCancellationOptimalL, // 960
  collapseOnsetL: SRC.transition.collapseOnsetL, // 3e3
  truncationOnsetL: SRC.transition.truncationOnsetL, // 3e5
  truncationOnsetOptPpp: SRC.transition.truncationOnsetOptPpp, // ~16
  anchorFloorOverModel: SRC.transition.anchorFloorOverModel, // ~573
});

export const IMP96515_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every L, optPpp, '
  + 'floor, floorModel and floorOverModel value plotted here is copied verbatim from the '
  + 'imp-96486 baked rung map; the only new step is labelling each rung cancellation or '
  + 'truncation branch from the existing crossover landmark. This maps a theoretical GUE '
  + '(sine-kernel) quadrature/cancellation floor transition, not a property of real Riemann '
  + 'zeros: it changes no bound and establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96515_VALIDATION = Object.freeze({
  nineRungsPresent: IMP96515_RUNG_POINTS.length === 9,
  pppNonIncreasing: IMP96515_RUNG_POINTS.every(
    (p, i) => i === 0 || p.optPpp <= IMP96515_RUNG_POINTS[i - 1].optPpp
  ),
  endpointsMatch:
    IMP96515_RUNG_POINTS[0].optPpp === 640
    && IMP96515_RUNG_POINTS[IMP96515_RUNG_POINTS.length - 1].optPpp === 3,
  truncationBranchRungs: IMP96515_RUNG_POINTS.filter((p) => p.branch === 'truncation').length,
  anchorRatioMatchesLandmark:
    IMP96515_RUNG_POINTS[IMP96515_RUNG_POINTS.length - 1].floorOverModel
      === IMP96515_LANDMARKS.anchorFloorOverModel,
});
