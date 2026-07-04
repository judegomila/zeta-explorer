/**
 * @module imp-33630-grade-vs-node-budget-viz-data
 *
 * imp-33630 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33600 origin-concentration grade-vs-node-budget sweep at the fixed rung
 * n=596. Presents, for each graded-GL origin-concentration grade in {4,5,6,8},
 * the residual ULP (vs the imp-33213 A_log target) across the imp-33539
 * resolved node-budget ladder {200,300,500,1000,2000,4000} nodes, alongside
 * the imp-33316 &lt; 64 ULP deep-tail band line and each grade's minInBandNodes
 * marker (the smallest budget in the ladder whose residual enters the band,
 * null when none does).
 *
 * Reference literals are baked from a direct re-run of the imp-33600
 * self-computing gradeTable (same phiKernel/saddleTau/graded-GL formulas,
 * same PANEL_SWEEP node ladder) -- no re-derivation of the underlying A(tau)
 * kernel or quadrature rules here.
 *
 * @see imp-33600-band-crossing-grade-vs-node-driver.js (source module: the grade sweep)
 * @see imp-33557-band-crossing-min-budget.js (the grade-4 n=596 Infinity floor this refines)
 * @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP deep band)
 *
 * Ticket: imp-33630 (ux, medium). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda &lt;= 0.2 stays SOTA; NO QED.
 */

export const IMP33630_BAND_ULP = 64;
export const IMP33630_N_FIXED = 596;
export const IMP33630_NODE_BUDGETS = [200, 300, 500, 1000, 2000, 4000];

// Per-grade residual ULP across the resolved node-budget ladder (imp-33539 ladder,
// budgets >= 200 nodes once the unresolved-peak spike has collapsed).
export const IMP33630_GRADE_TABLE = [
  { grade: 4, ulpByNodes: [65.3028, 67.0442, 68.7856, 69.6563, 70.5270, 74.0098], minInBandNodes: null, floorUlp: 65.3028 },
  { grade: 5, ulpByNodes: [90.5532, 77.4926, 68.7856, 74.0098, 77.4926, 77.4926], minInBandNodes: null, floorUlp: 68.7856 },
  { grade: 6, ulpByNodes: [33.9574, 100.1309, 57.4664, 61.8199, 71.3977, 78.3633], minInBandNodes: 200, floorUlp: 33.9574 },
  { grade: 8, ulpByNodes: [71.3977, 59.2078, 60.0785, 67.9149, 73.1391, 91.4239], minInBandNodes: 300, floorUlp: 59.2078 },
];
