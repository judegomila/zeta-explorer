/**
 * @module imp-96039-route-b-half-gram-interlacing-census-viz-data
 * @fileoverview imp-96039 -- lightweight viz-data module reshaping the Route B
 *   Lemma H interlacing census (rh-route-b-arithmetic-freeze-flow-2026-09-23.js)
 *   into chart-ready rows: the n=1 half-Gram lattice violates interlacing with
 *   the zeta zeros in 167 of 302 intervals up to gamma_300 (first violation
 *   holds gamma_2, gamma_3 in interval (20.654, 25.492)), against the far
 *   sparser classical Gram-law failure (16 of 302, first failure at g_125/g_126,
 *   t = 280.80..282.45, Titchmarsh). Also exposes the imp-96021 height-census
 *   bands showing the half-Gram violation fraction stays height-flat near 0.55.
 *
 *   Self-computing from the already-baked Route B interlacing literals -- no
 *   re-derivation, no fresh measurement, no heavy imports. Viz data only;
 *   changes no bound; NO QED.
 *
 *   @see rh-route-b-arithmetic-freeze-flow-2026-09-23.js (source: interlacing)
 */

import { ROUTE_B_FREEZE_FLOW } from './rh-route-b-arithmetic-freeze-flow-2026-09-23.js';

const { halfGram, classicalGram, heightCensus } = ROUTE_B_FREEZE_FLOW.interlacing;

export const IMP96039_CENSUS_ROWS = Object.freeze([
  Object.freeze({
    label: 'Half-Gram (n=1 pencil)',
    intervals: halfGram.intervals,
    violations: halfGram.violations,
    fraction: halfGram.violations / halfGram.intervals,
    firstViolation: halfGram.firstViolationInterval,
  }),
  Object.freeze({
    label: 'Classical Gram',
    intervals: classicalGram.intervals,
    violations: classicalGram.violations,
    fraction: classicalGram.violations / classicalGram.intervals,
    firstViolation: classicalGram.firstViolationAt,
  }),
]);

// imp-96021 height bands (half-Gram only) -- violation fraction vs height, showing
// it stays flat near 0.55 rather than decaying toward 0 (never approaching interlacing).
export const IMP96039_HEIGHT_BANDS = Object.freeze(
  heightCensus.bands.map(([lo, hi, intervals, violations, fraction]) =>
    Object.freeze({ lo, hi, intervals, violations, fraction }),
  ),
);

export const IMP96039_HEIGHT_AGGREGATE = Object.freeze({ ...heightCensus.aggregate });

export const IMP96039_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen Route B Lemma H interlacing census (baked literals, ' +
  'no re-derivation, no new measurement). The n=1 half-Gram pencil fails interlacing with the ' +
  'zeta zeros at the FIRST pair (167/302 intervals violate up to gamma_300) and the violation ' +
  'fraction stays height-flat near 0.55 rather than decaying -- interlacing is never approached. ' +
  'Interlacing would presuppose RH (HKO real-rootedness); this chart establishes no operator ' +
  'positivity and carries no RH claim. Platt-Trudgian Lambda <= 0.2 remains SOTA. NO QED.';

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  if (IMP96039_CENSUS_ROWS.length !== 2) throw new Error('imp-96039: expected exactly two census rows');
  const [hg, cg] = IMP96039_CENSUS_ROWS;
  if (hg.intervals !== 302 || hg.violations !== 167) throw new Error('imp-96039: half-Gram census mismatch');
  if (cg.intervals !== 302 || cg.violations !== 16) throw new Error('imp-96039: classical-Gram census mismatch');
  if (!(hg.fraction > cg.fraction)) throw new Error('imp-96039: half-Gram must violate far more often than classical Gram');
  if (Math.abs(hg.fraction - 167 / 302) > 1e-9) throw new Error('imp-96039: half-Gram fraction recompute mismatch');
  if (Math.abs(cg.fraction - 16 / 302) > 1e-9) throw new Error('imp-96039: classical-Gram fraction recompute mismatch');

  if (IMP96039_HEIGHT_BANDS.length !== 5) throw new Error('imp-96039: expected five height bands');
  for (const b of IMP96039_HEIGHT_BANDS) {
    if (!(b.hi > b.lo)) throw new Error('imp-96039: height band range must be increasing');
    // band fractions are baked to 4 decimals in the source (e.g. 21/29 = 0.724138 stored as
    // 0.7241), so the recompute tolerance is that storage rounding (5e-5), not 1e-6.
    if (Math.abs(b.fraction - b.violations / b.intervals) > 5e-5)
      throw new Error('imp-96039: height band fraction must match violations/intervals');
  }
  // height-flat: no band fraction may be within an order of magnitude of 0 -- i.e. it never
  // trends toward interlacing (fraction 0).
  for (const b of IMP96039_HEIGHT_BANDS) {
    if (!(b.fraction > 0.4)) throw new Error('imp-96039: height bands must stay well above the interlacing floor');
  }
  if (!/NO QED/.test(IMP96039_CAVEAT_BANNER)) throw new Error('imp-96039: caveat banner dropped NO QED');
  if (!/Lambda <= 0\.2 remains SOTA/.test(IMP96039_CAVEAT_BANNER))
    throw new Error('imp-96039: caveat banner dropped the PT Lambda <= 0.2 SOTA banner');
})();
