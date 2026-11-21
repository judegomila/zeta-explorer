/**
 * @module imp-97507-krein-nscaled-tgrid-heatmap-viz-data
 *
 * imp-97507 (ux): import-light viz-data leaf visualizing the imp-97484
 * extended well-resolved lam_min(N,T) table (N=84..164, T=4800..8000) for
 * the Krein c_sharp upper bracket at 2a=ln3, as a heatmap / column-family
 * grid: rows are N, columns are the cumulative-T checkpoints, and every
 * cell is a Rayleigh-Ritz UPPER bracket that increases with T (right edge
 * = most resolved) and decreases with N (bottom row = tightest bracket).
 *
 * PRESENTATION ONLY. Every cell is IMP97484_LAM_TABLE reused verbatim.
 * Establishes no operator positivity; changes no bound; interval-rigorous
 * reach stays 2a<=0.96; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-97484-krein-csharp-nscaled-tgrid-extended.js (the source table, findings, and verdict)
 *
 * Ticket: imp-97507 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97484_LAM_TABLE,
  IMP97484_N_ROWS,
  IMP97484_RESOLVED_COLUMNS,
  IMP97484_BEST_BRACKET,
  IMP97484_VERDICT,
} from './imp-97484-krein-csharp-nscaled-tgrid-extended.js';

// Flattened grid cells for a heatmap: one entry per (N,T), reused verbatim
// from the imp-97484 table.
export const IMP97507_GRID_CELLS = Object.freeze(
  IMP97484_N_ROWS.flatMap((N) =>
    IMP97484_RESOLVED_COLUMNS.map((T) =>
      Object.freeze({ N, T, value: IMP97484_LAM_TABLE[`${N},${T}`] }),
    ),
  ),
);

export const IMP97507_N_ROWS = IMP97484_N_ROWS;
export const IMP97507_T_COLUMNS = IMP97484_RESOLVED_COLUMNS;

export const IMP97507_VALUE_RANGE = Object.freeze({
  min: Math.min(...IMP97507_GRID_CELLS.map((c) => c.value)),
  max: Math.max(...IMP97507_GRID_CELLS.map((c) => c.value)),
});

export const IMP97507_BEST_CELL = Object.freeze({
  N: IMP97484_BEST_BRACKET.atN,
  T: IMP97484_BEST_BRACKET.atT,
  value: IMP97484_BEST_BRACKET.value,
});

export const IMP97507_VERDICT = Object.freeze({
  ticket: 'imp-97507',
  sourceTicket: 'imp-97484',
  claim:
    'renders the imp-97484 extended well-resolved lam_min(N,T) table (N=84..164, T=4800..8000) as a ' +
    'heatmap / column-family grid: every column increases left-to-right (T resolves the inner limit ' +
    'from below) and every row decreases top-to-bottom (the bracket falls with N), with the darkest, ' +
    'tightest cell at (N=164, T=8000) = 0.578574, the current best directly-read resolved upper bracket.',
  cellsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97507_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97507_ASSERTIONS = [
  {
    id: 'imp97507-grid-cell-count',
    holds: () => IMP97507_GRID_CELLS.length === IMP97484_N_ROWS.length * IMP97484_RESOLVED_COLUMNS.length,
    why: 'the flattened grid must have exactly one cell per (N,T) pair in the source table.',
  },
  {
    id: 'imp97507-best-cell-matches-imp97484',
    holds: () =>
      IMP97507_BEST_CELL.N === 164 &&
      IMP97507_BEST_CELL.T === 8000 &&
      Math.abs(IMP97507_BEST_CELL.value - 0.578574) < 1e-9,
    why: 'the charted best (darkest/tightest) cell must reproduce the imp-97484 FINDING 2 best resolved upper bracket exactly.',
  },
  {
    id: 'imp97507-value-range-matches-table-extremes',
    holds: () =>
      Math.abs(IMP97507_VALUE_RANGE.min - 0.576636) < 1e-9 &&
      Math.abs(IMP97507_VALUE_RANGE.max - 0.581134) < 1e-9,
    why: 'the color-scale range must span the full imp-97484 table, from the under-resolved (N=164,T=4800) minimum to the (N=84,T=8000) maximum.',
  },
  {
    id: 'imp97507-rows-decrease-and-columns-increase',
    holds: () => {
      for (const T of IMP97507_T_COLUMNS) {
        const col = IMP97507_N_ROWS.map((N) => IMP97484_LAM_TABLE[`${N},${T}`]);
        for (let i = 1; i < col.length; i++) {
          if (!(col[i] < col[i - 1])) return false;
        }
      }
      for (const N of IMP97507_N_ROWS) {
        const row = IMP97507_T_COLUMNS.map((T) => IMP97484_LAM_TABLE[`${N},${T}`]);
        for (let i = 1; i < row.length; i++) {
          if (!(row[i] > row[i - 1])) return false;
        }
      }
      return true;
    },
    why: 'every column must be strictly decreasing in N and every row strictly increasing in T, matching imp-97484 FINDING 1 and the T-resolution cross-check.',
  },
  {
    id: 'imp97507-measurement-only-no-qed',
    holds: () =>
      IMP97507_VERDICT.cellsReusedVerbatim === true &&
      IMP97507_VERDICT.operatorPositivityProved === false &&
      IMP97507_VERDICT.boundMoves === false &&
      IMP97507_VERDICT.qed === false &&
      IMP97484_VERDICT.qed === false,
    why: 'presentation only: cells reused verbatim from imp-97484; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97507_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97507-krein-nscaled-tgrid-heatmap-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
