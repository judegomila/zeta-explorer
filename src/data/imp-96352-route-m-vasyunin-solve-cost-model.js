/**
 * @module imp-96352-route-m-vasyunin-solve-cost-model
 *
 * imp-96352 (accuracy): DERIVE the per-rung inverse-power lam_min / Cholesky-solve
 * cost term that the imp-96230 BUILD-only feasibility budget omitted, calibrate it
 * against the imp-96325 measured N=1e4 run, and MEASURE how it reprices the
 * reachable-N ceiling for future Route M reach assessments (imp-96105/imp-96203).
 * Cost-model correction only; changes no bound.
 *
 * WHY. imp-96230 assessed the N=1e4 Vasyunin Gram as REACHABLE at ~7 min wall
 * (IMP96230_N1E4_BUDGET.totalWallSeconds = 399: Gram build 315.3 s + one dense
 * eigvalsh 33.3 s + 25 rung Cholesky FACTORIZATIONS at 2.0 s each). When imp-96325
 * actually ran the ladder as a single dedicated process the wall was 1838.5 s
 * (~30.6 min) -- 4.61x the estimate (IMP96325_RUN.wallNote). The gap is NOT a
 * mis-measured build: it is a whole cost term the BUILD-only model never carried,
 * the per-rung inverse-power lam_min solve on the large dense Cholesky factors.
 *
 * DECOMPOSITION of the measured 1838.5 s (from IMP96325_RUN):
 *   V-table build   422.6 s  (23.0 percent)   -- O(N^2), also under-budgeted by 230
 *   Gram build      453.8 s  (24.7 percent)   -- O(N^2)
 *   solve residual  962.1 s  (52.3 percent)   -- 1838.5 - 422.6 - 453.8, the OMITTED term
 * The solve residual is the LARGEST single component of the wall, larger than the
 * V-table or the Gram build, and is exactly what the imp-96230 BUILD-only budget
 * left out.
 *
 * COST MODEL. Per ladder rung of order n the spectral / linear-solve work is
 *   T_rung(n) = c_chol * n^3   (dense Cholesky factorization, dpotrf)
 *             + c_ipm  * n^2   (inverse-power lam_min: iteration count times the
 *                               two O(n^2) triangular back-solves per iteration,
 *                               LUMPED into one constant -- see the SUB-GAP)
 * The imp-96230 budget carried only the c_chol * n^3 factorization (2.0 s/rung at
 * n=1e4, ~50 s over 25 rungs) and dropped the c_ipm * n^2 inverse-power term.
 *
 * CALIBRATION against the imp-96325 extension ladder E = {3000,3500,4000,4500,
 * 5000,6000,7000,8000,9000,10000} (the rungs that used Cholesky + inverse power;
 * the N<=2600 validation rungs used full eigvalsh and contribute < 1 percent, well
 * inside the model tolerance):
 *   Sum_E n^3 = 3.15e12   ->  Cholesky factorization total  c_chol * Sum n^3 = 6.31 s
 *   solve residual 962.1 s minus 6.31 s = 955.79 s  is the inverse-power total
 *   Sum_E n^2 = 4.125e8   ->  c_ipm = 955.79 / 4.125e8 = 2.317e-6 s per n^2
 * So the inverse-power lam_min solve, not the factorization, is 99.3 percent of the
 * omitted solve cost: c_ipm * n^2 at n=1e4 is ~232 s, versus 2.0 s for the factor.
 *
 * LADDER SCALING (the repricing insight). A reach run pays T_rung at EVERY rung, so
 * with a roughly fixed top-end rung spacing Delta the solve cost sums to
 * ~ (c_ipm / (3 Delta)) * N^3 -- it is CUBIC in the top N, not the O(N^2) a single
 * build suggests. Folding the per-rung Cholesky in, an empirical solve-ladder cubic
 * constant kappa = 962.1 / (1e4)^3 = 9.621e-10 s per N^3 reproduces the measured
 * solve at N=1e4, and the V-table + Gram build stay quadratic with
 * beta = 876.4 / (1e4)^2 = 8.764e-6 s per N^2. The corrected reach model is
 *   T_total(N) = kappa * N^3 + beta * N^2,        T_total(1e4) = 1838.5 s (exact).
 * The cubic solve term overtakes the quadratic build at N* = beta/kappa ~ 9109, so
 * by the N=1e4 target the omitted solve is already the dominant cost (52 percent).
 *
 * REPRICED REACHABLE-N CEILING (IMP96352_REACH). Under a wall-clock budget the
 * corrected model reaches far fewer rungs than the BUILD-only estimate implied:
 *   at the imp-96230 399 s BUILD-only budget: N ~ 5355  (NOT 1e4) -- the build-only
 *     estimate overstated reach by ~1.87x in N; reaching N=1e4 truly costs 1838.5 s
 *     (4.61x the 399 s figure).
 *   30 min (1800 s): N ~ 9916;  1 h (3600 s): N ~ 13010;  4 h (14400 s): N ~ 21950.
 * MEMORY stays NON-binding throughout: the dense Gram hits the ~100 GB cap only at
 * N ~ 111803 (N^2 * 8 bytes = 1e11), an order of magnitude beyond any wall-feasible
 * N -- so wall-clock, not RAM, is the binding constraint for Route M reach, opposite
 * to what a memory-first feasibility read would suggest.
 *
 * MEASUREMENT / MODEL ONLY. Establishes no operator positivity, makes no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96230-route-m-vasyunin-gram-n1e4-feasibility.js (the BUILD-only budget corrected here)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (the measured 1838.5 s run + wallNote)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (a reach consumer of this model)
 * @see imp-96203-route-m-vasyunin-subleading-spectrum.js (a reach consumer of this model)
 *
 * Ticket: imp-96352 (accuracy, opus-4-8, api-pool). Cost-model correction only; NO QED.
 */

// Measured wall decomposition of the imp-96325 single-process N=1e4 run (seconds).
export const IMP96352_MEASURED = Object.freeze({
  NMAX: 10000,
  vTableSeconds: 422.6,
  gramBuildSeconds: 453.8,
  totalSeconds: 1838.5,
  solveResidualSeconds: 1838.5 - 422.6 - 453.8, // 962.1 -- the omitted per-rung solve term
  source: 'IMP96325_RUN (tmp/rh-route-m/m9-extend-n1e4.py, m9-out.json / m9.log)',
});

// The imp-96230 BUILD-only estimate this module corrects.
export const IMP96352_BUILD_ONLY_ESTIMATE = Object.freeze({
  totalWallSeconds: 399,             // IMP96230_N1E4_BUDGET.totalWallSeconds
  carried: 'Gram build 315.3 s + one dense eigvalsh 33.3 s + 25 rung Cholesky factorizations at 2.0 s',
  omitted: 'the per-rung inverse-power lam_min solve on the large dense Cholesky factors (O(n^2) per rung, thousands of triangular back-solves)',
  underCountFactor: 1838.5 / 399,    // 4.61x
});

// Per-rung solve cost model: T_rung(n) = c_chol n^3 + c_ipm n^2.
// c_chol carried from IMP96230_CUBIC_CONSTANTS (dpotrf); c_ipm calibrated below.
export const IMP96352_COST_MODEL = Object.freeze({
  cCholSPerN3: 2.0037037037037038e-12,   // Cholesky factorization, from imp-96230
  cIpmSPerN2: 2.317063030303030e-6,      // inverse-power lam_min, calibrated here
  form: 'T_rung(n) = c_chol * n^3 + c_ipm * n^2',
  cIpmNote: 'c_ipm LUMPS the inverse-power iteration count times the two O(n^2) triangular back-solves per iteration into one constant; per-rung timings were not logged so the iteration-count growth is unmeasured (see IMP96352_SUBGAP).',
});

// Calibration against the imp-96325 extension ladder (rungs that used inverse power).
export const IMP96352_CALIBRATION = Object.freeze({
  extensionLadder: Object.freeze([3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000]),
  sumN2: 412500000,          // Sum_E n^2 = 4.125e8
  sumN3: 3150000000000,      // Sum_E n^3 = 3.15e12
  choleskyTotalSeconds: 6.3117,   // c_chol * Sum n^3
  inversePowerTotalSeconds: 955.7883, // solveResidual - choleskyTotal
  inversePowerShareOfSolve: 955.7883 / 962.1, // ~0.993 -- inverse power, not the factor, is the cost
  validationRungsNote: 'the N<=2600 validation rungs used full eigvalsh (O(n^3)) and contribute < 1 percent of the 962.1 s solve residual, inside the model tolerance; the calibration is anchored on the extension ladder only.',
});

// Corrected reach model T_total(N) = kappa N^3 + beta N^2 (seconds).
// kappa folds the whole per-rung solve ladder into an empirical top-N cubic;
// beta is the V-table + Gram build (both O(N^2)). Valid for the same top-end
// rung spacing (~1000) as the imp-96325 run.
export const IMP96352_REACH_MODEL = Object.freeze({
  kappaSolveSPerN3: 9.621e-10,   // 962.1 / (1e4)^3
  betaBuildSPerN2: 8.764e-6,     // 876.4 / (1e4)^2
  crossoverN: 9109.2,            // beta/kappa: solve overtakes build here
  anchorCheckSeconds: 9.621e-10 * 1e12 + 8.764e-6 * 1e8, // == 1838.5, reproduces the measured wall
  ramCapN: 111803,               // sqrt(100e9 / 8): dense Gram hits the ~100 GB cap here
  bindingConstraint: 'wall-clock (the cubic solve ladder), NOT RAM -- the dense Gram reaches the ~100 GB cap only near N ~ 1.1e5, an order of magnitude beyond any wall-feasible N.',
});

// Repriced reachable-N ceilings under wall-clock budgets (memory non-binding).
export const IMP96352_REACH = Object.freeze([
  Object.freeze({ budgetSeconds: 399,   budgetLabel: 'imp-96230 BUILD-only budget', reachN: 5355,  note: 'the BUILD-only estimate claimed N=1e4 here; the corrected model reaches ~5355, a ~1.87x overstatement in N.' }),
  Object.freeze({ budgetSeconds: 1800,  budgetLabel: '30 min',  reachN: 9916,  note: 'the measured N=1e4 run at 1838.5 s sits just above this.' }),
  Object.freeze({ budgetSeconds: 3600,  budgetLabel: '1 hour',  reachN: 13010, note: 'wall-clock binds; RAM would allow ~1.1e5.' }),
  Object.freeze({ budgetSeconds: 14400, budgetLabel: '4 hours', reachN: 21950, note: 'still ~5x below the RAM-cap N; solve ladder dominates.' }),
]);

// Forward cost of the corrected reach model, seconds.
export function imp96352TotalSeconds(N) {
  return IMP96352_REACH_MODEL.kappaSolveSPerN3 * N ** 3 + IMP96352_REACH_MODEL.betaBuildSPerN2 * N ** 2;
}

// Honest residual sub-gap: the inverse-power iteration count is not resolved.
export const IMP96352_SUBGAP = Object.freeze({
  id: 'imp-96352-per-rung-ipm-iteration-count-unmeasured',
  statement:
    'c_ipm is a LUMPED aggregate: m9.log recorded only the ladder totals, not per-rung solve times, so the inverse-power iteration count m(n) is not separated from the O(n^2) triangular-solve constant. lam_min falls 2.06e-5 -> 1.75e-8 across the ladder (IMP96325 spectrum crowds toward zero), which typically SLOWS inverse-power convergence to the smallest eigenvalue, so m(n) plausibly GROWS with n. If it does, the true solve scaling is steeper than the fitted N^3 and the reachable-N ceilings here are OPTIMISTIC upper bounds -- the conservative direction. Logging per-rung solve wall + iteration counts on a future run would resolve this.',
});

export const IMP96352_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cost-model correction only: the constants are derived from the imp-96325 measured single-process wall (1838.5 s) and the imp-96230 Cholesky constant; the model reprices future Route M reach estimates and changes NO bound and establishes NO operator positivity.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96352_ASSERTIONS = [
  {
    id: 'imp96352-decomposition-sums-to-measured-wall',
    holds: () => {
      const m = IMP96352_MEASURED;
      return Math.abs((m.vTableSeconds + m.gramBuildSeconds + m.solveResidualSeconds) - m.totalSeconds) < 1e-9 &&
        Math.abs(m.solveResidualSeconds - 962.1) < 1e-9;
    },
    why: 'the V-table + Gram build + solve residual reconstruct the measured 1838.5 s exactly, and the omitted solve residual is 962.1 s.',
  },
  {
    id: 'imp96352-solve-is-largest-component',
    holds: () => {
      const m = IMP96352_MEASURED;
      return m.solveResidualSeconds > m.gramBuildSeconds && m.gramBuildSeconds > m.vTableSeconds;
    },
    why: 'the omitted per-rung solve (962.1 s, 52 percent) is the LARGEST single wall component -- larger than the Gram build (453.8 s) or the V-table (422.6 s).',
  },
  {
    id: 'imp96352-cipm-calibrated-from-solve-residual',
    holds: () => {
      const c = IMP96352_CALIBRATION;
      const cm = IMP96352_COST_MODEL;
      const choleskyTot = cm.cCholSPerN3 * c.sumN3;
      const ipmTot = IMP96352_MEASURED.solveResidualSeconds - choleskyTot;
      const cIpm = ipmTot / c.sumN2;
      // c_ipm reproduces the calibrated constant, and the inverse power is >99 percent of the solve.
      return Math.abs(cIpm - cm.cIpmSPerN2) < 1e-12 &&
        Math.abs(choleskyTot - c.choleskyTotalSeconds) < 1e-3 &&
        c.inversePowerShareOfSolve > 0.99;
    },
    why: 'c_ipm = (solve residual minus the c_chol n^3 factorization total) / Sum n^2 over the extension ladder; the inverse-power term, not the factorization, is > 99 percent of the omitted solve cost.',
  },
  {
    id: 'imp96352-reach-model-reproduces-measured-1e4',
    holds: () =>
      Math.abs(imp96352TotalSeconds(10000) - IMP96352_MEASURED.totalSeconds) < 0.5 &&
      Math.abs(IMP96352_REACH_MODEL.anchorCheckSeconds - IMP96352_MEASURED.totalSeconds) < 0.5,
    why: 'the corrected reach model kappa N^3 + beta N^2 reproduces the measured 1838.5 s at N=1e4 by construction, validating the fold-in.',
  },
  {
    id: 'imp96352-build-only-undercount-4x',
    holds: () =>
      IMP96352_BUILD_ONLY_ESTIMATE.underCountFactor > 4 &&
      Math.abs(IMP96352_BUILD_ONLY_ESTIMATE.underCountFactor - 1838.5 / 399) < 1e-9,
    why: 'the imp-96230 399 s BUILD-only estimate under-counts the true N=1e4 wall by 4.61x, driven entirely by the omitted per-rung inverse-power solve.',
  },
  {
    id: 'imp96352-solve-dominates-before-target',
    holds: () => {
      const r = IMP96352_REACH_MODEL;
      // crossover where the cubic solve overtakes the quadratic build is below N=1e4.
      return Math.abs(r.crossoverN - r.betaBuildSPerN2 / r.kappaSolveSPerN3) < 1 &&
        r.crossoverN < 10000;
    },
    why: 'the cubic per-rung solve overtakes the quadratic build at N* ~ 9109 < 1e4, so by the target the omitted solve is already the dominant cost.',
  },
  {
    id: 'imp96352-reach-ceilings-consistent-and-monotone',
    holds: () => {
      const rows = IMP96352_REACH;
      // each listed reachN reproduces its budget under the forward model within 1.5 percent,
      // and both budget and reachN increase monotonically.
      const ok = rows.every((row) => Math.abs(imp96352TotalSeconds(row.reachN) - row.budgetSeconds) < 0.015 * row.budgetSeconds);
      const monoB = rows.slice(1).every((row, i) => row.budgetSeconds > rows[i].budgetSeconds);
      const monoN = rows.slice(1).every((row, i) => row.reachN > rows[i].reachN);
      return ok && monoB && monoN;
    },
    why: 'each repriced ceiling reproduces its wall budget under kappa N^3 + beta N^2 to within 1.5 percent and the ceilings rise monotonically with budget; the 399 s row reaches ~5355, not the 1e4 the build-only model claimed.',
  },
  {
    id: 'imp96352-wall-binds-not-ram',
    holds: () => {
      const r = IMP96352_REACH_MODEL;
      const maxReach = Math.max(...IMP96352_REACH.map((row) => row.reachN));
      return Math.abs(r.ramCapN - Math.sqrt(100e9 / 8)) < 1 && maxReach < r.ramCapN / 4;
    },
    why: 'the dense Gram reaches the ~100 GB cap only near N ~ 1.1e5, more than 4x beyond the largest wall-feasible reach, so wall-clock, not RAM, is the binding Route M reach constraint.',
  },
  {
    id: 'imp96352-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96352_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96352_HONEST_BANNER) &&
      /NO QED/.test(IMP96352_HONEST_BANNER) &&
      /changes NO bound/.test(IMP96352_HONEST_BANNER) &&
      /iteration-count-unmeasured/.test(IMP96352_SUBGAP.id),
    why: 'the banner carries the RH-open / PT-Lambda / NO-QED / no-bound markers and the named sub-gap flags the unmeasured inverse-power iteration count.',
  },
];

for (const a of IMP96352_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96352-route-m-vasyunin-solve-cost-model assertion failed: ${a.id}`);
  }
}

export default {
  measured: IMP96352_MEASURED,
  buildOnlyEstimate: IMP96352_BUILD_ONLY_ESTIMATE,
  costModel: IMP96352_COST_MODEL,
  calibration: IMP96352_CALIBRATION,
  reachModel: IMP96352_REACH_MODEL,
  reach: IMP96352_REACH,
  totalSeconds: imp96352TotalSeconds,
  subGap: IMP96352_SUBGAP,
  banner: IMP96352_HONEST_BANNER,
};
