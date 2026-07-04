/**
 * @module imp-33324-graded-vs-uniform-node-budget-viz-data
 *
 * imp-33324 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33295 graded-vs-uniform inner node budget. Presents, for each saddle-a
 * rung n in {10,20,...,80}, the inner-node count needed to reach the imp-33275
 * A_log double-precision floor band (&lt; 30 ULP) by three routes -- the graded
 * min-node lattice hit (120-140 nodes), the robust graded plateau rule
 * (grade4/400p, 4000 nodes, constant across rungs) and the uniform-Simpson
 * Richardson ladder (37205 nodes, constant across rungs) -- alongside the
 * per-rung worst-window ULP each route actually reaches.
 *
 * Reference literals are baked from a direct re-run of the imp-33295
 * self-computing rungTable (node budgets + worst-window ULPs) -- no
 * re-derivation of the underlying A(tau) kernel or quadrature rules here.
 *
 * @see imp-33295-graded-inner-grid-a-node-budget.js (source module: node-budget measurement)
 * @see imp-33275-richardson-saddle-a-rung-uniformity.js (the uniform Richardson ladder baseline)
 *
 * Ticket: imp-33324 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33324_FLOOR_ULP = 30;
export const IMP33324_UNIFORM_LADDER_NODES = 37205;
export const IMP33324_PLATEAU_NODES = 4000;
export const IMP33324_MIN_NODE_SAVING_RANGE = { min: 265.75, max: 310.04 };
export const IMP33324_PLATEAU_SAVING = 9.3;

export const IMP33324_RUNG_TABLE = [
  { n: 10, gradedMinNodeGrade: 3, gradedMinNodeNodes: 120, gradedMinNodeUlp: 1.4877, gradedPlateauUlp: 14.1335, uniformLadderUlp: 18.5967 },
  { n: 20, gradedMinNodeGrade: 3, gradedMinNodeNodes: 120, gradedMinNodeUlp: 12.3185, gradedPlateauUlp: 4.9274, uniformLadderUlp: 4.1062 },
  { n: 30, gradedMinNodeGrade: 4, gradedMinNodeNodes: 120, gradedMinNodeUlp: 7.3973, gradedPlateauUlp: 2.2761, uniformLadderUlp: 4.5522 },
  { n: 40, gradedMinNodeGrade: 3, gradedMinNodeNodes: 120, gradedMinNodeUlp: 6.6046, gradedPlateauUlp: 21.0147, uniformLadderUlp: 21.0147 },
  { n: 50, gradedMinNodeGrade: 4, gradedMinNodeNodes: 120, gradedMinNodeUlp: 23.6473, gradedPlateauUlp: 9.4589, uniformLadderUlp: 21.5453 },
  { n: 60, gradedMinNodeGrade: 3, gradedMinNodeNodes: 140, gradedMinNodeUlp: 2.3998, gradedPlateauUlp: 6.3995, uniformLadderUlp: 15.1988 },
  { n: 70, gradedMinNodeGrade: 3, gradedMinNodeNodes: 140, gradedMinNodeUlp: 27.2705, gradedPlateauUlp: 5.4541, uniformLadderUlp: 6.5449 },
  { n: 80, gradedMinNodeGrade: 4, gradedMinNodeNodes: 140, gradedMinNodeUlp: 10.1965, gradedPlateauUlp: 2.0393, uniformLadderUlp: 10.8763 },
];
