/**
 * @module imp-96238-joint-leak-region-viz-data
 *
 * imp-96238 (ux): import-light viz-data leaf for the imp-96206 joint (eps_a, eps_b)
 * Kato-Temple certify region. imp-96206 measured the coupled admissible region (the
 * set of simultaneous adjacent-leak / bottom-twin-leak overlaps a 3-level test
 * function can carry while still certifying U < 1) as a table of five slices, but
 * shipped with no chart surface for the region shape itself.
 *
 * Reshapes the imp-96206 boundary into a chart-ready curve (eps_a on the x-axis,
 * max tolerable eps_b on the y-axis) by re-running the SAME baked bisection
 * (`maxTolerableBottom`, imported verbatim, not re-derived) at plot resolution, and
 * carries the three named markers verbatim from the imp-96206 literals: the
 * pure-bottom worst case, the equal-split per-channel boundary, and the full-
 * adjacent-threshold collapse point.
 *
 * MEASUREMENT / PRESENTATION ONLY. The boundary-defining function
 * (`katoTempleUpperThreeLevel` / `maxTolerableBottom`) and every named literal are
 * imported unchanged from imp-96206; only the plot-resolution SAMPLING is computed
 * here. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96206-route-i-kato-temple-joint-leak.js (region, literals, coupled slices)
 *
 * Ticket: imp-96238 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  maxTolerableBottom,
  IMP_96206_COUPLED_SLICES,
  IMP_96206_LITERALS,
} from './imp-96206-route-i-kato-temple-joint-leak.js';

const SRC = IMP_96206_LITERALS;

// Boundary curve of the admissible (certified U < 1) region: for eps_a swept from
// 0 to the separate adjacent threshold, the max tolerable eps_b (same bisection as
// imp-96206, run at plot resolution rather than only the five baked slice points).
function sampleBoundary(numSamples) {
  const points = [];
  for (let i = 0; i < numSamples; i += 1) {
    const epsA = (SRC.separateAdjacentEps * i) / (numSamples - 1);
    points.push({ epsA, epsB: maxTolerableBottom(epsA) });
  }
  return points;
}

export const IMP96238_BOUNDARY_CURVE = sampleBoundary(48);

// The five baked coupled-slice points (imp-96206), reshaped for direct plotting.
export const IMP96238_SLICE_POINTS = IMP_96206_COUPLED_SLICES.map((row) => ({
  epsA: row.epsA,
  epsB: row.maxEb,
}));

export const IMP96238_MARKERS = {
  pureBottom: { epsA: 0, epsB: SRC.separateBottomEps, label: 'pure-bottom worst case' },
  equalSplit: { epsA: SRC.equalSplitPerChannelEps, epsB: SRC.equalSplitPerChannelEps, label: 'equal-split boundary' },
  fullAdjacent: { epsA: SRC.separateAdjacentEps, epsB: 0, label: 'full adjacent threshold (bottom collapses)' },
};

export const IMP96238_ANCHORS = {
  separateAdjacentEps: SRC.separateAdjacentEps,
  separateBottomEps: SRC.separateBottomEps,
  jointWorstCaseTotalMag: SRC.jointWorstCaseTotalMag,
  equalSplitPerChannelEps: SRC.equalSplitPerChannelEps,
};

export const IMP96238_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the boundary curve re-runs '
  + 'the imp-96206 maxTolerableBottom bisection verbatim at plot resolution (not a re-derivation), '
  + 'and the three named markers (pure-bottom, equal-split, full-adjacent) are copied from the '
  + 'imp-96206 baked literals. The region uses the exact FFT-Mellin semilocal {oo,2} spectrum '
  + '(Rayleigh-Ritz N=32, not a rigorous enclosure) and a 3-level single-magnitude-per-channel '
  + 'ansatz; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96238_ASSERTIONS = [
  {
    id: 'imp96238-boundary-curve-endpoints-match-axes',
    holds: () => approx(IMP96238_BOUNDARY_CURVE[0].epsB, SRC.separateBottomEps, 1e-7)
      && IMP96238_BOUNDARY_CURVE[IMP96238_BOUNDARY_CURVE.length - 1].epsB < 1e-6,
    why: 'at eps_a = 0 the boundary must recover the separate bottom-twin threshold; at eps_a = the full separate adjacent threshold the tolerable eps_b must have collapsed to ~0.',
  },
  {
    id: 'imp96238-boundary-strictly-decreasing',
    holds: () => IMP96238_BOUNDARY_CURVE.every((p, i) => i === 0 || p.epsB <= IMP96238_BOUNDARY_CURVE[i - 1].epsB),
    why: 'imp-96206: the certify region is strictly coupled, so the tolerable bottom overlap is monotonically non-increasing in the adjacent leak.',
  },
  {
    id: 'imp96238-slice-points-lie-on-sampled-boundary-scale',
    holds: () => IMP96238_SLICE_POINTS.every((p) => approx(p.epsB, maxTolerableBottom(p.epsA), 1e-7)),
    why: 'the five baked imp-96206 coupled-slice points must reproduce the live boundary function at their own eps_a values.',
  },
  {
    id: 'imp96238-markers-below-separate-thresholds',
    holds: () => IMP96238_MARKERS.pureBottom.epsB > 0
      && IMP96238_MARKERS.equalSplit.epsA < IMP96238_MARKERS.pureBottom.epsB
      && approx(IMP96238_MARKERS.equalSplit.epsA, 0.001180627, 1e-8)
      && approx(IMP96238_MARKERS.fullAdjacent.epsA, 0.008415876, 1e-8),
    why: 'the equal-split per-channel boundary must sit strictly below the pure-bottom threshold, and the full-adjacent marker must match the imp-96206 separate adjacent threshold.',
  },
];

for (const a of IMP96238_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96238-joint-leak-region-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
