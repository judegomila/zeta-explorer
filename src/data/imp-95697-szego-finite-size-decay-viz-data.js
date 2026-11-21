/**
 * @module imp-95697-szego-finite-size-decay-viz-data
 * @fileoverview imp-95697 -- lightweight viz-data module reshaping the imp-95677
 *   rho = 1 finite-size Szego tabulation (F / A_opt vs point count) into a
 *   chart-ready row list, carrying the float64 cancellation-noise band
 *   (lmin / (lmax*eps)) alongside the ratio so the sub-1 undershoot at the
 *   largest section reads as numerical noise, not a physical dip below the
 *   infinite-lattice symbol infimum. Self-computing from the already-measured
 *   imp-95677 table -- no re-derivation, no fresh quadrature, no heavy imports.
 *   Viz data only; changes no bound; no QED.
 *
 *   @see imp-95677-rho1-szego-finite-size-convergence.js (the measured table this reshapes)
 */

import { IMP95677_RHO1_SZEGO_FINITE_SIZE_CONVERGENCE } from './imp-95677-rho1-szego-finite-size-convergence.js';

const SRC = IMP95677_RHO1_SZEGO_FINITE_SIZE_CONVERGENCE;

export const IMP95697_ROWS = Object.freeze(
  SRC.table.map((row) =>
    Object.freeze({
      nPairs: row.nPairs,
      nPts: row.nPts,
      F: row.F,
      ratio: row.ratio,
      lminOverFloor: row.lminOverFloor,
      log2NPts: Math.log2(row.nPts),
    }),
  ),
);

export const IMP95697_DELTA = SRC.delta;
export const IMP95697_A_OPT = SRC.aOpt;
export const IMP95697_CROSSES_UNITY_NEAR_NPAIRS = SRC.crossesUnityNearNPairs;
export const IMP95697_MONOTONE_DECREASING = SRC.monotoneDecreasing;
export const IMP95697_FLOAT64_LIMITED = SRC.float64Limited;
export const IMP95697_VERDICT = SRC.verdict;
export const IMP95697_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95677 tabulation verbatim (no ' +
  're-derivation, no fresh quadrature); the sub-1 undershoot at 320 pairs is ' +
  'float64 cancellation noise (lmin sits at the lmax*eps floor, cond ~5e15 ' +
  '> 1/eps), not a physical drop below the symbol infimum; model seam family ' +
  'only. Changes no bound of the Lambda program; no operator positivity ' +
  'established; no RH claim; no refereed bound is changed; NO QED.';

// ---------------------------------------------------------------------------
// imp-95833: float64-cancellation-floor caveat guard. Throws if any row with
// ratio < 1 is NOT within the lmax*eps noise band (which would mean the
// undershoot is no longer explainable as cancellation noise), or if the
// caveat banner drops its honesty markers -- so this module can never be
// consumed by a page/assertion that treats the rho=1 F/A_opt < 1 undershoot
// as a real drop below the symbol infimum.
// ---------------------------------------------------------------------------

export const IMP95697_ASSERTIONS = [
  {
    id: 'imp95697-sub-unity-rows-stay-inside-noise-band',
    description:
      'every row with ratio < 1 has lminOverFloor within the O(1) float64 ' +
      'cancellation-noise band, so the undershoot is never asserted as a ' +
      'real drop below the symbol infimum',
    holds: () =>
      IMP95697_ROWS.every(
        (row) => row.ratio >= 1 || (row.lminOverFloor > 0.3 && row.lminOverFloor < 3),
      ),
  },
  {
    id: 'imp95697-caveat-banner-carries-honesty-markers',
    description:
      'the caveat banner explicitly names the undershoot as noise and keeps ' +
      'the NO QED / SOTA guardrail',
    holds: () =>
      /cancellation noise/.test(IMP95697_CAVEAT_BANNER) &&
      /NO QED/.test(IMP95697_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP95697_CAVEAT_BANNER),
  },
];

for (const a of IMP95697_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95697-szego-finite-size-decay-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default IMP95697_ROWS;
