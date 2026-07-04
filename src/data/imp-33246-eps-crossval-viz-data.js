/**
 * @module imp-33246-eps-crossval-viz-data
 * @fileoverview imp-33246 -- lightweight, import-light literal data for a
 *   visualization of the imp-3918 three-solver eps_n = Q_n/tau*(n)^2 - 1
 *   cross-validation table: side-by-side eps_n for composite Simpson
 *   (imp-3849), 5-point Gauss-Legendre (imp-3868) and Clenshaw-Curtis
 *   (imp-3895) at n in {100, 148, 149, 200, 300}, with every pairwise
 *   inter-solver |delta|, showing all three rules agree to ~1e-6 and all
 *   put eps_148 > 0 > eps_149 (the n = 149 sign-change is
 *   quadrature-rule-family-independent).
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3918-eps-sign-change-three-solver-crossval.js MEASURED.crossValTable
 *   field. This module does NOT import the imp-3918 solver (and
 *   transitively no zeros bundle), so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3918-eps-sign-change-three-solver-crossval.js (the assembled cross-validation)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (Simpson solver)
 *   @see imp-3868-saddle-crossing-gauss-legendre-cross-solver.js (Gauss-Legendre solver)
 *   @see imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js (Clenshaw-Curtis solver)
 *
 *   Ticket: imp-33246 (ux, low). Presentation only; measurement-only finding,
 *   RH-equivalent, necessary-but-not-sufficient; no new bound; NO QED.
 */

// eps_n = Q_n/tau*(n)^2 - 1 for all three solvers, n in {100,148,149,200,300},
// with every pairwise inter-solver |delta| (baked from imp-3918 crossValTable).
export const IMP33246_CROSSVAL_ROWS = Object.freeze([
  {
    n: 100,
    simpson: 0.001034796543409433,
    gl: 0.0010347897510256665,
    cc: 0.0010347897510245563,
    deltaSimpsonGl: 6.7923837665517794e-9,
    deltaSimpsonCc: 6.792384876774804e-9,
    deltaGlCc: 1.1102230246251565e-15,
  },
  {
    n: 148,
    simpson: 0.000007597581374918505,
    gl: 0.000007583261019794563,
    cc: 0.000007583261004029396,
    deltaSimpsonGl: 1.4320355123942363e-8,
    deltaSimpsonCc: 1.4320370889109313e-8,
    deltaGlCc: 1.5765166949677223e-14,
  },
  {
    n: 149,
    simpson: -0.0000034626265551507274,
    gl: -0.00000347713607029565,
    cc: -0.0000034771360867269507,
    deltaSimpsonGl: 1.4509515144922602e-8,
    deltaSimpsonCc: 1.4509531576223367e-8,
    deltaGlCc: 1.6431300764452317e-14,
  },
  {
    n: 200,
    simpson: -0.0003428930845839062,
    gl: -0.0003429190781425451,
    cc: -0.00034291907824901546,
    deltaSimpsonGl: 2.5993558638859326e-8,
    deltaSimpsonCc: 2.5993665109247388e-8,
    deltaGlCc: 1.0647038806155251e-13,
  },
  {
    n: 300,
    simpson: -0.0005049856014829324,
    gl: -0.0005050452444651521,
    cc: -0.0005050452458902344,
    deltaSimpsonGl: 5.964298221972086e-8,
    deltaSimpsonCc: 5.964440730199527e-8,
    deltaGlCc: 1.425082274408851e-12,
  },
]);

export const IMP33246_SIGN_CHANGE_N = 149;
export const IMP33246_MAX_PAIRWISE_DELTA = 5.964440730199527e-8; // worst pairwise |delta| across the table, at n=300
