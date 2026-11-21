/**
 * @module imp-95808-twin-pair-bias-union-heatmap-viz-data
 * @fileoverview imp-95808 -- lightweight viz-data module reshaping the imp-95785
 *   13-cell union biasPct table (three deltas ln1.2/ln1.3/ln1.5, nine rho values)
 *   into a chart-ready dense grid: BIAS_PCT[i][j] and SOURCE[i][j] over
 *   delta-columns x rho-rows, with missing (delta, rho) combinations left null
 *   so the heatmap can mark them as not measured rather than zero.
 *
 *   Self-computing from the already-assembled imp-95785 union table -- no
 *   re-derivation, no fresh term, no heavy imports. Viz data only; changes no
 *   bound; no QED.
 *
 *   @see imp-95785-twin-pair-block-bias-union-grid.js (the union table this reshapes)
 */

import { IMP95785_TWIN_PAIR_BLOCK_BIAS_UNION_GRID } from './imp-95785-twin-pair-block-bias-union-grid.js';

const { unionTable } = IMP95785_TWIN_PAIR_BLOCK_BIAS_UNION_GRID;

// Column labels: the three deltas in the union, ascending.
export const IMP95808_DELTA_LABELS = Object.freeze(['ln1.2', 'ln1.3', 'ln1.5']);

// Row labels: the union of all rho values present across the 13 cells, ascending.
export const IMP95808_RHO_LABELS = Object.freeze([1, 1.5, 2, 3, 5, 10, 20, 50, 100]);

function cellAt(deltaLabel, rho) {
  return unionTable.find((c) => c.delta === deltaLabel && c.rho === rho) || null;
}

// Dense grids over (delta, rho): null where the union table has no cell.
export const IMP95808_BIAS_PCT = Object.freeze(
  IMP95808_DELTA_LABELS.map((d) =>
    Object.freeze(IMP95808_RHO_LABELS.map((rho) => cellAt(d, rho)?.biasPct ?? null)),
  ),
);

export const IMP95808_SOURCE = Object.freeze(
  IMP95808_DELTA_LABELS.map((d) =>
    Object.freeze(IMP95808_RHO_LABELS.map((rho) => cellAt(d, rho)?.source ?? null)),
  ),
);

// Flat row list for the table underneath the heatmap: only the 13 measured cells.
export const IMP95808_FLAT_ROWS = Object.freeze(
  unionTable.map((c) => Object.freeze({ ...c })),
);

export const IMP95808_MEASURED_CELL_COUNT = unionTable.length;
export const IMP95808_TOTAL_GRID_CELLS =
  IMP95808_DELTA_LABELS.length * IMP95808_RHO_LABELS.length;

export const IMP95808_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95785 union table verbatim (no ' +
  're-derivation, no fresh term); biasPct is an interior model-seam quantity, ' +
  'not an RH bound; the 13 measured cells sit inside a 27-cell (delta, rho) grid ' +
  'because the two sources are delta-disjoint -- the other 14 cells were never ' +
  'measured and are shown blank, not zero. Changes no bound of the Lambda ' +
  'program; NO QED; no refereed bound is changed.';
