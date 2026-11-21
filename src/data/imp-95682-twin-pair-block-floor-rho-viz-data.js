/**
 * @module imp-95682-twin-pair-block-floor-rho-viz-data
 * @fileoverview imp-95682 -- lightweight viz-data module reshaping the imp-95659
 *   interior tabulation of the twin-pair block floor F(delta, rho) into a
 *   chart-ready row list carrying log10 of all three curves (F, F/A_opt,
 *   F/blockIso) so a single log-y panel can span the full ~12-order-of-magnitude
 *   sweep at once. Self-computing from the already-measured imp-95659 table --
 *   no re-derivation, no fresh quadrature, no heavy imports. Viz data only;
 *   changes no bound; no QED.
 *
 *   @see imp-95659-twin-pair-block-floor-rho-tabulation.js (the measured table this reshapes)
 *   @see imp-95693-twin-pair-block-floor-second-delta.js (delta-specific crossover: the
 *     half-retention rho is NOT a fixed constant, it drifts with delta; the ln1.3 entry
 *     of crossoverByDelta is the precise value at this module's fixed delta)
 */

import { IMP95659_TWIN_PAIR_BLOCK_FLOOR_RHO_TABULATION } from './imp-95659-twin-pair-block-floor-rho-tabulation.js';
import { IMP95693_TWIN_PAIR_BLOCK_FLOOR_SECOND_DELTA } from './imp-95693-twin-pair-block-floor-second-delta.js';

const SRC = IMP95659_TWIN_PAIR_BLOCK_FLOOR_RHO_TABULATION;
const LN13_CROSSOVER = IMP95693_TWIN_PAIR_BLOCK_FLOOR_SECOND_DELTA.crossoverByDelta.find(
  (e) => e.label === 'ln1.3',
);

function log10(v) {
  return Math.log10(v);
}

export const IMP95682_ROWS = Object.freeze(
  SRC.table.map((row) =>
    Object.freeze({
      rho: row.rho,
      D: row.D,
      F: row.F,
      FoverAopt: row.FoverAopt,
      FoverBlock: row.FoverBlock,
      log10Rho: log10(row.rho),
      log10F: log10(row.F),
      log10FoverAopt: log10(row.FoverAopt),
      log10FoverBlock: log10(row.FoverBlock),
    }),
  ),
);

export const IMP95682_DELTA = SRC.delta;
export const IMP95682_A_OPT = SRC.aOpt;
export const IMP95682_BLOCK_FLOOR_ISOLATED = SRC.blockFloorIsolated;
export const IMP95682_HALF_RETENTION_RHO = LN13_CROSSOVER.rhoCross;
export const IMP95682_MONOTONE = SRC.monotone;
export const IMP95682_VERDICT = SRC.verdict;
export const IMP95682_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95659 tabulation verbatim (no ' +
  're-derivation, no fresh term); the rho = 1 value carries the same ' +
  'finite-size Szego factor 1.092 as imp-95642 and is not the infinite-lattice ' +
  'infimum; model seam family only. Changes no bound of the Lambda program; ' +
  'no operator positivity established; no RH claim; no refereed bound is changed' +
  '; NO QED.';

export default IMP95682_ROWS;
