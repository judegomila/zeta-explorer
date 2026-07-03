/**
 * @module imp-3540-power-iteration-budget-viz-data
 * @fileoverview imp-3540 -- lightweight, import-light literal data for a
 *   visualization of the imp-3505 power-iteration budget-to-1e-9 measurement.
 *
 *   imp-3505 (never imported by any page -- pure offline assertion module,
 *   O(N^2) power iteration up to 33280 steps at N=800) measured two things on
 *   the imp-3240 U-grid {4,6,8,10,12,16,20} (N=U/0.025):
 *     (A) the power-iteration step budget needed to reach 1e-9 relative
 *         agreement with a converged Lanczos reference, growing monotonically
 *         with N (160 -> 520 up to 800 -> ~6250, bracketed between the swept
 *         6000/6500 checkpoints);
 *     (B) at a FIXED budget of 2080 steps, the relative gap against that same
 *         converged reference, also growing monotonically with N (1.55e-14 at
 *         N=160 up to 3.08e-6 at N=800) -- the direct signature of the
 *         skew-Toeplitz top-singular gap shrinking as the section grows and
 *         slowing power-iteration convergence.
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-3505-power-iteration-budget-convergence-sweep.js (its
 *   `measured.budgetLadder` / `measured.fixedBudgetGaps` fields); this module
 *   does NOT re-run that computation, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the source measurement)
 *   @see imp-3530-power-iteration-budget-closed-form-fit.js (the closed-form fit of this ladder)
 *
 *   Ticket: imp-3540 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3540_BUDGET_LADDER = Object.freeze([
  { N: 160, budgetToClose: 520 },
  { N: 240, budgetToClose: 1040 },
  { N: 320, budgetToClose: 1040 },
  { N: 400, budgetToClose: 2080 },
  { N: 480, budgetToClose: 4160 },
  { N: 640, budgetToClose: 4160 },
  { N: 800, budgetToClose: 6500 }, // crossing bracketed 6000 (1.63e-9) / 6500 (6.24e-10), interpolates to ~6250
]);

export const IMP3540_FIXED_BUDGET = 2080;

export const IMP3540_FIXED_BUDGET_GAPS = Object.freeze([
  { N: 160, gap: 1.5506691816534077e-14 },
  { N: 240, gap: 3.262137467969951e-14 },
  { N: 320, gap: 3.7611844685585923e-14 },
  { N: 400, gap: 2.3087656230152325e-11 },
  { N: 480, gap: 2.7289484839032987e-9 },
  { N: 640, gap: 3.268978341061355e-7 },
  { N: 800, gap: 3.075385136775655e-6 },
]);
