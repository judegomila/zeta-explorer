/**
 * @module imp-33257-node-budget-full-window-ulp-viz-data
 * @fileoverview imp-33257 -- lightweight, import-light literal data for a
 *   visualization of the imp-33232 full-window sweep: worst-in-window ULP
 *   (vs a converged sigma-tracking substitution-Simpson reference) for each
 *   imp-3919 tabulated minimal (grade,panels) graded-GL budget, alongside
 *   the ULP at the single tau=6 endpoint imp-3919 originally measured.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js
 *   MEASURED.sweep field. This module does NOT import that solver (and
 *   transitively no zeros bundle), so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js (the measured sweep)
 *   @see imp-3919-a-weight-fixed-graded-gl-crossover-budget-tau6.js (the crossover + budget table audited)
 *
 *   Ticket: imp-33257 (ux, low). Presentation only; measures nothing new; makes no claim.
 */

// Worst-in-window ULP, worst-tau, and ULP-at-tau=6 per tabulated minimal (grade,panels) budget,
// baked from imp-33232 MEASURED.sweep (12-point tau grid in [0.5,6], converged Xmax=120/n=80000 ref).
export const IMP33257_SWEEP_ROWS = Object.freeze([
  { grade: 3, panels: 16704, glNodes: 167040, tauStar: 6.000, worstUlp: 10.7, worstTau: 0.5, ulpAtTau6: 0.0, passes: true },
  { grade: 4, panels: 1470, glNodes: 14700, tauStar: 6.000, worstUlp: 4.7, worstTau: 0.5, ulpAtTau6: 0.83, passes: true },
  { grade: 5, panels: 342, glNodes: 3420, tauStar: 6.001, worstUlp: 4.7, worstTau: 0.5, ulpAtTau6: 0.83, passes: true },
  { grade: 6, panels: 130, glNodes: 1300, tauStar: 6.009, worstUlp: 157, worstTau: 6, ulpAtTau6: 157, passes: false },
  { grade: 7, panels: 65, glNodes: 650, tauStar: 6.013, worstUlp: 3548, worstTau: 6, ulpAtTau6: 3548, passes: false },
  { grade: 8, panels: 39, glNodes: 390, tauStar: 6.035, worstUlp: 15400, worstTau: 6, ulpAtTau6: 15400, passes: false },
]);

export const IMP33257_PASS_ULP_LINE = 1;
export const IMP33257_TAU_STAR_THRESHOLD = 6;
