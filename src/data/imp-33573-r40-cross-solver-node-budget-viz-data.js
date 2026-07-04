/**
 * @module imp-33573-r40-cross-solver-node-budget-viz-data
 * @fileoverview imp-33573 -- baked viz-data constants for the imp-33536 R_40 cross-solver node
 *   budget: the number of inner nodes each of three independent quadrature rules needs to clear
 *   the imp-33292 converged R_40 floor band, and the imp-33308 ~63x graded-vs-Simpson saving this
 *   sits underneath.
 *
 *   Baked (not recomputed) from src/data/imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js
 *   and src/data/imp-33308-graded-inner-grid-r40-node-budget.js -- viz pages stay import-light.
 * @see imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js (the cross-solver measurement)
 * @see imp-33308-graded-inner-grid-r40-node-budget.js (the ~63x/~315x Simpson-baseline saving)
 */

export const IMP33573_FLOOR_ULP = 64;

// One row per solver: smallest inner-node budget that clears the < 64 ULP R_40 floor band
// against the imp-33536 independently-converged Clenshaw-Curtis target.
export const IMP33573_ROWS = Object.freeze([
  Object.freeze({
    solver: 'Clenshaw-Curtis',
    label: 'CC (single grid, N=68)',
    minNodes: 69,
    note: 'independent of both the Simpson family and Gauss-Legendre',
  }),
  Object.freeze({
    solver: 'Graded-GL',
    label: 'graded-GL min (grade3/8panels)',
    minNodes: 80,
    note: 'imp-33308 min-node hit, ~15.6 ULP against the CC target',
  }),
  Object.freeze({
    solver: 'Graded-GL',
    label: 'graded-GL plateau (grade3/40panels)',
    minNodes: 400,
    note: 'imp-33308 robust plateau rule, ~15.6 ULP against the CC target',
  }),
  Object.freeze({
    solver: 'Simpson ladder',
    label: 'uniform-Simpson doubling+Richardson',
    minNodes: 25206,
    note: 'imp-33292/imp-33308 baseline; a single uniform Simpson grid misses the floor even at 25601 nodes',
  }),
]);

export const IMP33573_PLATEAU_SAVING_VS_SIMPSON = 25206 / 400; // ~63.0x
export const IMP33573_MINNODE_SAVING_VS_SIMPSON = 25206 / 80; // ~315.1x
export const IMP33573_GRADED_VS_CC_NODE_RATIO = 80 / 69; // ~1.16x -- node-competitive, not ~63x
