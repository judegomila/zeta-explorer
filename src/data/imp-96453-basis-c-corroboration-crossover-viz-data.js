/**
 * @module imp-96453-basis-c-corroboration-crossover-viz-data
 *
 * imp-96453 (ux): import-light viz-data leaf for the imp-96430 basis-C corroboration-reach
 * crossover. imp-96430 bisected the L* where the growing L-linear basis-C cancellation floor
 * overtakes the shrinking exact |rho + 1/2| rigidity signal, but shipped only a baked object,
 * no chart. This module reshapes that object into a log-log-ready point series: the six
 * accessible-rung floor/signal pairs (L = 30..960), the PT anchor (L = 5.9e6), and the two
 * crossover-band endpoints (L* ~ 1.3e12 and ~ 2.5e12) -- nine points total spanning the whole
 * log10 L range the finding covers, plus the two straight L-linear floor-model lines
 * (floorModel(L) = slope * L is exact arithmetic on the copied slope constants, not a new
 * measurement or re-derivation).
 *
 * No re-derivation: every signal, floor, slope and crossover value is copied verbatim from
 * IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER. rho is the theoretical GUE (sine-kernel,
 * universality) two-interval correlation for boxes of unfolded length L; there are no computed
 * Riemann zeros behind these values. Changes no bound; establishes no operator positivity;
 * RH open; NO QED; no refereed bound is changed.
 *
 * HONESTY CARRY-FORWARD (imp-96448 reconciliation). The imp-96430 module quotes a PT-anchor
 * headroom of ~3.7e5 from its L-linear floor MODEL, but imp-96448 directly measured the
 * basis-C floor at the anchor and found it ~573x larger than the model predicts, so the true
 * measured headroom there is ~640, not ~3.7e5. This module plots the imp-96430 model line (the
 * finding this ticket visualizes) and carries that reconciliation note forward rather than
 * silently repeating the superseded ~3.7e5 figure as if it were unqualified.
 *
 * VALIDITY-BOUNDARY CARRY-FORWARD (imp-96486 / imp-96559). The two floor-model lines drawn
 * below are exact arithmetic (slope * L) across the FULL plotted range (L = 30 .. ~2.9e12), but
 * imp-96486 localized the model's actual validity to the L <= ~1e5 cancellation branch (where
 * the optimal panels-per-period ppp* stays >= 32); past that the achievable floor is set by
 * Simpson-truncation, not cancellation, and departs the line by 13.5x (3e5), 50x (1e6), 133x
 * (3e6), 573x at the anchor (5.9e6). So everything plotted on these lines above L ~ 1e5 --
 * including the PT anchor point and the whole crossover band [~1.3e12, ~2.5e12] -- sits outside
 * the model's own validated regime and is an extrapolation, not a tracked measurement.
 *
 * @see imp-96430-basis-c-corroboration-reach-crossover.js (the source object this reshapes)
 * @see imp-96448-direct-basis-c-anchor-floor.js (supersedes the anchor headroom figure)
 * @see imp-96486-basis-c-ppp-collapse-transition.js (localizes the L <= ~1e5 validity boundary)
 * @see imp-96559-basis-c-ppp-collapse-lmodel-validity-glossary-headword.js (quick-lookup headword)
 *
 * Ticket: imp-96453 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw (per the imp-96294 convention) -- values are validated below
 * via a plain exported check object instead of an import-time throw.
 */

import { IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER as SRC } from './imp-96430-basis-c-corroboration-reach-crossover.js';

const log10 = Math.log10;

// Nine points spanning L = 30 .. ~2.5e12: the six accessible rungs, the PT anchor, and the two
// crossover-band endpoints. Every (L, signal) pair here is copied verbatim from imp-96430.
const rawPoints = [
  ...SRC.floorRows.map((r) => ({ L: r.L, signal: r.signal, measuredFloor: r.floor })),
  { L: SRC.ptAnchorL, signal: SRC.atPtAnchor.signal, measuredFloor: null },
  { L: SRC.crossover.endpointSlope.L, signal: SRC.crossover.endpointSlope.signal, measuredFloor: null },
  { L: SRC.crossover.meanSlope.L, signal: SRC.crossover.meanSlope.signal, measuredFloor: null },
].sort((a, b) => a.L - b.L);

export const IMP96453_SIGNAL_SERIES = rawPoints.map((p) => ({
  L: p.L,
  log10L: log10(p.L),
  log10Signal: log10(p.signal),
}));

// The six measured accessible-rung floor points (basis-C direct-quadrature floor, from imp-96430).
export const IMP96453_MEASURED_FLOOR_POINTS = SRC.floorRows.map((r) => ({
  L: r.L,
  log10L: log10(r.L),
  log10Floor: log10(r.floor),
}));

// Two straight L-linear floor-model lines (floorModel(L) = slope * L), each drawn from L = 30 to
// the far edge of the crossover band -- exact arithmetic on the copied slope constants.
const LINE_L_MIN = 30;
const LINE_L_MAX = SRC.crossover.band[1] * 1.15;
const floorLine = (slope) => [
  { L: LINE_L_MIN, log10L: log10(LINE_L_MIN), log10Floor: log10(slope * LINE_L_MIN) },
  { L: LINE_L_MAX, log10L: log10(LINE_L_MAX), log10Floor: log10(slope * LINE_L_MAX) },
];

export const IMP96453_FLOOR_LINES = Object.freeze({
  endpointSlope: floorLine(SRC.floorModel.endpointSlope),
  meanSlope: floorLine(SRC.floorModel.meanSlope),
});

export const IMP96453_LANDMARKS = Object.freeze({
  rigidityLimit: SRC.rigidityLimit,
  ptAnchorL: SRC.ptAnchorL,
  ptAnchorSignal: SRC.atPtAnchor.signal,
  ptAnchorFloorModel: SRC.atPtAnchor.floorModel,
  ptAnchorHeadroomModel: SRC.atPtAnchor.signalOverFloor, // ~3.7e5, MODEL value -- see reconciliation
  crossoverBand: SRC.crossover.band, // [~1.3e12, ~2.5e12]
  crossoverEndpoint: SRC.crossover.endpointSlope,
  crossoverMean: SRC.crossover.meanSlope,
  lmodelValidityBoundaryL: 1e5, // imp-96486/imp-96559: L-linear floor model valid only below this
});

export const IMP96453_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every signal, floor and '
  + 'crossover value plotted here is copied verbatim from the imp-96430 baked object; the two '
  + 'floor-model lines are exact arithmetic (slope * L) on the copied slope constants, not a new '
  + 'measurement. rho is the theoretical GUE (sine-kernel, universality) two-interval correlation '
  + 'for boxes of unfolded length L, with no computed Riemann zeros behind it; the crossover band '
  + 'is an EXTRAPOLATION of an L-linear floor model calibrated only on accessible L (<= 960), not '
  + 'a measured value. VALIDITY BOUNDARY (imp-96486/imp-96559): the L-linear floor-model lines are '
  + 'only tracked by the measured direct-quadrature floor while L <= ~1e5 (optimal ppp* >= 32); '
  + 'past that the optimal ppp collapses toward truncation and the lines UNDERSTATE the real floor, '
  + 'departing by 13.5x (3e5), 50x (1e6), 133x (3e6), 573x at the PT anchor. So the PT-anchor point '
  + 'and the entire crossover band [~1.3e12, ~2.5e12] plotted here lie outside the model’s own '
  + 'validated range. The PT-anchor headroom marked here (~3.7e5) is the imp-96430 MODEL figure; '
  + 'imp-96448 directly measured the anchor floor and found the true headroom is ~640, ~570x '
  + 'smaller -- basis C still corroborates basis A at the anchor, just with far less margin than '
  + 'the model line implies. Changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96453_VALIDATION = Object.freeze({
  ninePointsPresent: IMP96453_SIGNAL_SERIES.length === 9,
  signalMonotonicallyShrinks: IMP96453_SIGNAL_SERIES.every(
    (p, i) => i === 0 || p.log10Signal <= IMP96453_SIGNAL_SERIES[i - 1].log10Signal,
  ),
  floorLinesHaveTwoPoints:
    IMP96453_FLOOR_LINES.endpointSlope.length === 2 && IMP96453_FLOOR_LINES.meanSlope.length === 2,
  crossoverBandMatchesSource:
    IMP96453_LANDMARKS.crossoverBand[0] === SRC.crossover.band[0]
    && IMP96453_LANDMARKS.crossoverBand[1] === SRC.crossover.band[1],
  ptAnchorInRange:
    IMP96453_LANDMARKS.ptAnchorL > IMP96453_MEASURED_FLOOR_POINTS[IMP96453_MEASURED_FLOOR_POINTS.length - 1].L
    && IMP96453_LANDMARKS.ptAnchorL < IMP96453_LANDMARKS.crossoverBand[0],
  ptAnchorPastValidityBoundary:
    IMP96453_LANDMARKS.ptAnchorL > IMP96453_LANDMARKS.lmodelValidityBoundaryL,
  bannerNamesValidityBoundary: /L <= ~1e5/.test(IMP96453_HONEST_BANNER),
});
