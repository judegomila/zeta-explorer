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
  'established; no RH claim; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.';

export default IMP95697_ROWS;
