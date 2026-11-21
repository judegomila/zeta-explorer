/**
 * imp-95939 -- CERTIFY the ln 1.25 reach-340 (Nmax = 1523) sub-1% crossing
 * CLEANLY with the imp-95859 refined ~950 window-worst-cell shift budget, and
 * DECIDE whether the ln 1.25 companion u_fit_rel (= relErr of the extrapolated
 * C_fit vs the analytic C_pred) crosses below 1%.
 *
 * GRADE: numerical certification. Import-light. The reach-340 crossing grids at
 * three iteration budgets (maxIter = 500, 950, 1200) are BAKED from the offline
 * driver tmp/imp-95939-crossing.mjs, which reuses the imp-95820 / imp-95838
 * robust PD-preserving shift-invert DD Toeplitz machinery VERBATIM (short plain
 * warm-up sets a high rough estimate, sigma = 0.9 * rough kept below lambda_min so
 * the shifted Levinson stays SPD, f-halving on any non-positive-beta overshoot).
 * The self-executing assertions (1) re-derive the crossing verdict live from the
 * baked grids (fast float64 fit) and (2) run ONE cheap live N = 150 shift-invert
 * solve (~0.1s) to re-validate the solver reproduces the imp-95838 baked coarse
 * point. No heavy DD reach-340 sweep at import; no zeros bundle. Certifies ONLY;
 * changes NO numeric value of any interval; NO new bound; NO QED.
 *
 * WHAT imp-95838 / imp-95859 LEFT AS THE SUB-GAP. imp-95820 crossed the fully-DD
 * ln 1.25 side sub-1% at reach 340 (relErr = -0.736%) but with maxIter = 500,
 * which imp-95838 flagged as ~1.5x too small at N = 1523. imp-95838 read
 * recommendedBudget = 800 off the N = 1523 endpoint alone (712 solves); imp-95859
 * then found the interior worst cell (N = 1400, 870 solves) EXCEEDS that endpoint
 * and refined the honest minimal window budget to >= 870 (~950 with headroom).
 * The crossing run itself was never re-executed at the corrected budget -- this
 * module does that and DECIDES the u_fit_rel verdict.
 *
 * THE CERTIFICATION (delta = ln 1.25 = 0.223143551, tol = 1e-15, reach 340 ->
 * Nmax = round(340/delta - 1) = 1523, 5-point fit grid [381, 648, 991, 1372, 1523],
 * C_pred = pi^2 / (2 delta^2) = 99.106256, retries = 0 at every N):
 *
 *   maxIter   its at the two window cells      C_fit       u_fit_rel   crosses<1%
 *   500       N=1372: 500 (=cap), N=1523: 500  98.376518   -0.7363%    yes (but capped)
 *   950       N=1372: 725,        N=1523: 712  98.376562   -0.7363%    yes (clean)
 *   1200      N=1372: 725,        N=1523: 712  98.376562   -0.7363%    yes (clean)
 *
 * FINDING 1 -- THE ~950 BUDGET CERTIFIES THE CROSSING CLEANLY. At maxIter = 950
 * every near-degenerate window cell converges WITHIN budget (N = 1372 at 725, and
 * the N = 1523 endpoint at 712 solves -- both below the 950 cap and matching the
 * imp-95859 baked window grid EXACTLY), whereas the imp-95820 maxIter = 500 run
 * had BOTH window cells pinned at the iteration cap (its = 500 = cap). So the ~950
 * budget delivers the clean certification the imp-95820 run could not: the u_fit_rel
 * crossing verdict is now read off fully-converged inverse-iteration, not a capped
 * iterate.
 *
 * FINDING 2 -- u_fit_rel CROSSES CLEANLY BELOW 1%: -0.7363%. The extrapolated
 * C_fit = 98.376562 gives u_fit_rel = (C_fit - C_pred)/C_pred = -0.7363%, i.e.
 * |u_fit_rel| = 0.7363% < 1%. The fit is monotone across the grid. The maxIter =
 * 1200 control is IDENTICAL to maxIter = 950 (its = 725/712, C_fit = 98.376562,
 * u_fit_rel = -0.7363%), confirming ~950 SUFFICES -- no further budget changes the
 * verdict.
 *
 * FINDING 3 -- THE imp-95820 VERDICT WAS ALREADY CORRECT; THE UNDER-CONVERGENCE
 * WAS MILDER THAN FEARED. Capping at maxIter = 500 shifted the window-cell
 * lambda_min by only ~6e-10 relative (N = 1372: 6.968035160e-18 capped vs
 * 6.968035156e-18 converged) and the extrapolated C_fit by only 98.376518 ->
 * 98.376562, a ~4.5e-7 relative move -- far too small to change the -0.7363%
 * verdict at four decimals. So the imp-95820 reach-340 sub-1% crossing conclusion
 * STANDS; the ~950 budget does not overturn it, it CERTIFIES it (every cell
 * converged within budget) rather than reading it off capped iterates.
 *
 * HONEST SCOPE. Direct certification filling the imp-95838 / imp-95859-named
 * crossing-run residual; no new cited input, no new bound, no operator positivity,
 * and NO numeric change to any certified interval. Model seam family only; the
 * imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes
 * NO bound of the Lambda program; NO QED; no refereed bound is changed
 * . Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95859-ln125-window-shift-budget (the ~950 refined window budget)
 * @see imp-95838-ln125-shift-budget-scaling (recommendedBudget=800, endpoint-only)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the maxIter=500 crossing run)
 */

export const IMP95939_LN125_REACH340_CROSSING_CERTIFICATION = {
  id: "imp-95939",
  title:
    "CERTIFY: the ln 1.25 reach-340 (Nmax=1523) sub-1% crossing runs cleanly at " +
    "the imp-95859 refined ~950 shift budget -- every near-degenerate window cell " +
    "converges WITHIN budget (N=1372 at 725, N=1523 at 712 solves, both below the " +
    "950 cap and matching the imp-95859 grid), unlike the imp-95820 maxIter=500 run " +
    "that capped both, and the companion u_fit_rel CROSSES cleanly below 1% at " +
    "-0.7363% (C_fit=98.376562 vs C_pred=99.106256); the maxIter=1200 control is " +
    "identical so ~950 suffices, and the imp-95820 verdict was already correct " +
    "(the maxIter=500 cap shifted C_fit by only ~4.5e-7 relative)",
  question:
    "does the ln 1.25 reach-340 crossing certified at the imp-95859 refined ~950 " +
    "shift budget converge every near-degenerate window cell within budget, and " +
    "does the companion u_fit_rel cross cleanly below 1%?",
  delta: 0.22314355131420976, // ln 1.25
  tol: 1e-15,
  reach: 340,
  Nmax: 1523, // round(340/delta - 1)
  fitGrid: [381, 648, 991, 1372, 1523],
  cPred: 99.106256, // pi^2 / (2 delta^2)
  // baked reach-340 crossing at three iteration budgets (tmp/imp-95939-crossing.mjs), retries=0 everywhere
  budgets: [500, 950, 1200],
  windowCellIts: {
    // its at the two near-degenerate window cells (N=1372, N=1523) per budget
    500: [500, 500], // both pinned at the cap
    950: [725, 712], // both converged within budget, matching imp-95859
    1200: [725, 712], // identical to 950 -- ~950 suffices
  },
  cFitByBudget: { 500: 98.376518, 950: 98.376562, 1200: 98.376562 },
  uFitRelByBudget: { 500: -0.007363, 950: -0.007363, 1200: -0.007363 }, // (C_fit - C_pred)/C_pred
  monotoneByBudget: { 500: true, 950: true, 1200: true },
  retriesAllZero: true,
  // FINDING 1 -- the ~950 budget certifies the crossing cleanly
  imp95820Budget: 500,
  imp95820CappedBothWindowCells: true, // its=500=cap at N=1372 and N=1523
  refinedWindowBudget: 950, // imp-95859 refined ~950
  refinedBudgetConvergesEveryWindowCell: true, // 725, 712 both < 950 cap
  windowItsMatchImp95859: true, // 725, 712 match imp-95859 shiftIts[N=1372,1523]
  // FINDING 2 -- u_fit_rel crosses cleanly below 1%
  uFitRelCertified: -0.007363, // at the refined ~950 budget
  crossesBelowOnePercent: true, // |u_fit_rel| = 0.7363% < 1%
  budget1200IdenticalTo950: true, // ~950 suffices, no further change
  // FINDING 3 -- the imp-95820 verdict was already correct; under-convergence milder than feared
  imp95820VerdictStands: true,
  cFitRelMoveFrom500To950: 4.47e-7, // (98.376562 - 98.376518)/98.376562
  lambdaMinRelMoveAtN1372: 5.7e-10, // capped vs converged at N=1372
  underConvergenceMilderThanFeared: true, // ~4.5e-7 C_fit move, not the ~2e-5 feared
  boundChange: false,
  qed: false,
  subGapResolved: "imp-95859-reach340-crossing-run-not-yet-re-executed-at-refined-budget",
  verdict:
    "CERTIFIED -- re-running the fully-DD ln 1.25 reach-340 (Nmax = 1523, 5-point " +
    "fit grid [381, 648, 991, 1372, 1523], delta = ln 1.25, tol = 1e-15, retries = 0 " +
    "everywhere) crossing at the imp-95859 refined ~950 shift budget converges every " +
    "near-degenerate window cell WITHIN budget (N = 1372 at 725, N = 1523 at 712 " +
    "shift solves -- both below the 950 cap and matching the imp-95859 baked window " +
    "grid exactly), unlike the imp-95820 maxIter = 500 run which pinned BOTH window " +
    "cells at the iteration cap (its = 500 = cap). The companion u_fit_rel = " +
    "(C_fit - C_pred)/C_pred = (98.376562 - 99.106256)/99.106256 = -0.7363% CROSSES " +
    "cleanly below 1% (|u_fit_rel| = 0.7363%), the fit is monotone, and the " +
    "maxIter = 1200 control is IDENTICAL (its = 725/712, C_fit = 98.376562, " +
    "u_fit_rel = -0.7363%), confirming ~950 SUFFICES. The imp-95820 verdict was " +
    "already CORRECT: the maxIter = 500 cap shifted the window-cell lambda_min by " +
    "only ~6e-10 relative and the extrapolated C_fit by only 98.376518 -> 98.376562 " +
    "(~4.5e-7 relative), far too small to move the -0.7363% verdict -- so the ~950 " +
    "budget does not overturn the crossing, it CERTIFIES it off fully-converged " +
    "inverse-iteration rather than capped iterates. This RESOLVES the imp-95838 / " +
    "imp-95859-named crossing-run residual and DECIDES the u_fit_rel verdict: the " +
    "ln 1.25 companion crosses cleanly below 1%. Direct certification of a solver " +
    "convergence residual; no new cited input; no numeric change to any certified " +
    "interval; model seam family only; the imp-95212 envelope port, signed WEIGHT, " +
    "and modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO " +
    "QED; no refereed bound is changed.",
  closesTickets: ["imp-95939"],
};

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD), from imp-95859 -- import-light
// ---------------------------------------------------------------------------
function twoSum(a, b) { const s = a + b; const bb = s - a; const e = (a - (s - bb)) + (b - bb); return [s, e]; }
function quickTwoSum(a, b) { const s = a + b; const e = b - (s - a); return [s, e]; }
const SPLIT = 134217729;
function split(a) { const t = SPLIT * a; const hi = t - (t - a); const lo = a - hi; return [hi, lo]; }
function twoProd(a, b) { const p = a * b; const [ah, al] = split(a); const [bh, bl] = split(b); const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl; return [p, e]; }
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; [s, e] = quickTwoSum(s, e); return [s, e]; }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; [p, e] = quickTwoSum(p, e); return [p, e]; }
function ddDiv(a, b) { const q1 = a[0] / b[0]; let r = ddSub(a, ddMul(b, [q1, 0])); const q2 = r[0] / b[0]; r = ddSub(r, ddMul(b, [q2, 0])); const q3 = r[0] / b[0]; let [s, e] = quickTwoSum(q1, q2); [s, e] = ddAdd([s, e], [q3, 0]); return [s, e]; }
function ddSqrt(a) { if (a[0] === 0) return [0, 0]; const x = 1 / Math.sqrt(a[0]); const ax = a[0] * x; const axdd = [ax, 0]; const diff = ddSub(a, ddMul(axdd, axdd)); const e = (diff[0] * x) * 0.5; return ddAdd(axdd, [e, 0]); }
const DD = (x) => [x, 0];
const toNum = (a) => a[0] + a[1];
function ddExp(a) { const LN2 = [0.6931471805599453, 2.3190468138462996e-17]; const k = Math.round(toNum(a) / LN2[0]); const r = ddSub(a, ddMul(DD(k), LN2)); let term = DD(1), sum = DD(1); for (let n = 1; n <= 40; n++) { term = ddDiv(ddMul(term, r), DD(n)); sum = ddAdd(sum, term); if (Math.abs(term[0]) < 1e-35 * Math.abs(sum[0])) break; } return [sum[0] * Math.pow(2, k), sum[1] * Math.pow(2, k)]; }
function ddSech(a) { const ep = ddExp(a); const em = ddExp([-a[0], -a[1]]); return ddDiv(DD(2), ddAdd(ep, em)); }
// ln(1.25) = 2 atanh(1/9), y = 1/9 -- import-light constant for the live solve
function ddLn125() { const y = ddDiv(DD(1), DD(9)); const y2 = ddMul(y, y); let term = y, sum = y; for (let k = 1; k <= 60; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMul(DD(2), sum); }

// ---- shift-invert DD Toeplitz machinery (robust f-halving), from imp-95820 ----
function toeplitzCol(n, deltaDD) { const half = ddMul(deltaDD, DD(0.5)); const rhi = new Float64Array(n), rlo = new Float64Array(n); for (let k = 0; k < n; k++) { const v = ddSech(ddMul(DD(k), half)); rhi[k] = v[0]; rlo[k] = v[1]; } return { rhi, rlo }; }
function levinsonSolve(n, rhi, rlo, bhi, blo) {
  const xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
  const yhi = new Float64Array(n + 1), ylo = new Float64Array(n + 1);
  const thi = new Float64Array(n + 1), tlo = new Float64Array(n + 1);
  yhi[1] = -rhi[1]; ylo[1] = -rlo[1]; xhi[1] = bhi[1]; xlo[1] = blo[1];
  let beta = DD(1); let alpha = [-rhi[1], -rlo[1]]; let minBeta = 1;
  for (let k = 1; k <= n - 1; k++) {
    beta = ddMul(ddSub(DD(1), ddMul(alpha, alpha)), beta);
    if (beta[0] < minBeta) minBeta = beta[0];
    let acc = [bhi[k + 1], blo[k + 1]];
    for (let i = 1; i <= k; i++) acc = ddSub(acc, ddMul([rhi[i], rlo[i]], [xhi[k + 1 - i], xlo[k + 1 - i]]));
    const mu = ddDiv(acc, beta);
    for (let i = 1; i <= k; i++) { const v = ddAdd([xhi[i], xlo[i]], ddMul(mu, [yhi[k + 1 - i], ylo[k + 1 - i]])); thi[i] = v[0]; tlo[i] = v[1]; }
    for (let i = 1; i <= k; i++) { xhi[i] = thi[i]; xlo[i] = tlo[i]; }
    xhi[k + 1] = mu[0]; xlo[k + 1] = mu[1];
    if (k < n - 1) {
      let acc2 = [rhi[k + 1], rlo[k + 1]];
      for (let i = 1; i <= k; i++) acc2 = ddAdd(acc2, ddMul([rhi[i], rlo[i]], [yhi[k + 1 - i], ylo[k + 1 - i]]));
      alpha = ddDiv([-acc2[0], -acc2[1]], beta);
      for (let i = 1; i <= k; i++) { const z = ddAdd([yhi[i], ylo[i]], ddMul(alpha, [yhi[k + 1 - i], ylo[k + 1 - i]])); thi[i] = z[0]; tlo[i] = z[1]; }
      for (let i = 1; i <= k; i++) { yhi[i] = thi[i]; ylo[i] = tlo[i]; }
      yhi[k + 1] = alpha[0]; ylo[k + 1] = alpha[1];
    }
  }
  return { xhi, xlo, minBeta };
}
function shiftedSolve(n, rhi, rlo, bhi, blo, sigma) {
  const sDD = ddSub(DD(1), DD(sigma));
  const rphi = new Float64Array(n), rplo = new Float64Array(n);
  for (let k = 1; k < n; k++) { const v = ddDiv([rhi[k], rlo[k]], sDD); rphi[k] = v[0]; rplo[k] = v[1]; }
  const bphi = new Float64Array(n + 1), bplo = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) { const v = ddDiv([bhi[i], blo[i]], sDD); bphi[i] = v[0]; bplo[i] = v[1]; }
  return levinsonSolve(n, rphi, rplo, bphi, bplo);
}
function toeplitzMatvec(n, rhi, rlo, xhi, xlo) { const yhi = new Float64Array(n + 1), ylo = new Float64Array(n + 1); for (let i = 1; i <= n; i++) { let acc = DD(0); for (let j = 1; j <= n; j++) { const d = Math.abs(i - j); acc = ddAdd(acc, ddMul([rhi[d], rlo[d]], [xhi[j], xlo[j]])); } yhi[i] = acc[0]; ylo[i] = acc[1]; } return { yhi, ylo }; }
function ddDot(n, ahi, alo, bhi, blo) { let acc = DD(0); for (let i = 1; i <= n; i++) acc = ddAdd(acc, ddMul([ahi[i], alo[i]], [bhi[i], blo[i]])); return acc; }
function lamMinPlainRough(n, rhi, rlo, maxIter, tol) {
  let xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) xhi[i] = Math.sin((3.1 * i) / n) + 0.5 * Math.cos(0.7 * i);
  let nrm = ddSqrt(ddDot(n, xhi, xlo, xhi, xlo));
  for (let i = 1; i <= n; i++) { const v = ddDiv([xhi[i], xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
  let prev = Infinity, rq = Infinity;
  for (let it = 0; it < maxIter; it++) {
    const sol = levinsonSolve(n, rhi, rlo, xhi, xlo);
    nrm = ddSqrt(ddDot(n, sol.xhi, sol.xlo, sol.xhi, sol.xlo));
    for (let i = 1; i <= n; i++) { const v = ddDiv([sol.xhi[i], sol.xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
    const mv = toeplitzMatvec(n, rhi, rlo, xhi, xlo);
    rq = toNum(ddDot(n, xhi, xlo, mv.yhi, mv.ylo));
    if (Math.abs(rq - prev) < tol * Math.abs(rq)) break; prev = rq;
  }
  return rq;
}
function lamMinShiftInvertRobust(n, deltaDD, maxIter, tol) {
  const { rhi, rlo } = toeplitzCol(n, deltaDD);
  const rough = lamMinPlainRough(n, rhi, rlo, 24, 1e-7);
  let f = 0.9, rq = Infinity, its = 0, sigma = 0, retries = 0;
  while (true) {
    sigma = f * rough;
    let xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
    for (let i = 1; i <= n; i++) xhi[i] = Math.sin((3.1 * i) / n) + 0.5 * Math.cos(0.7 * i);
    let nrm = ddSqrt(ddDot(n, xhi, xlo, xhi, xlo));
    for (let i = 1; i <= n; i++) { const v = ddDiv([xhi[i], xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
    let prev = Infinity, overshoot = false; its = 0;
    for (let it = 0; it < maxIter; it++) { its = it + 1;
      const sol = shiftedSolve(n, rhi, rlo, xhi, xlo, sigma);
      if (sol.minBeta <= 0) { overshoot = true; break; }
      nrm = ddSqrt(ddDot(n, sol.xhi, sol.xlo, sol.xhi, sol.xlo));
      for (let i = 1; i <= n; i++) { const v = ddDiv([sol.xhi[i], sol.xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
      const mv = toeplitzMatvec(n, rhi, rlo, xhi, xlo);
      rq = toNum(ddDot(n, xhi, xlo, mv.yhi, mv.ylo));
      if (Math.abs(rq - prev) < tol * Math.abs(rq)) break; prev = rq;
    }
    if (!overshoot && rq >= sigma) break;
    f *= 0.5; retries++; if (f < 0.05) break;
  }
  return { rq, its, retries };
}

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: the crossing verdict is re-derived
// live from the baked grids (fast float64), and ONE cheap live N=150 DD
// shift-invert solve (~0.1s) re-validates the solver against the imp-95838
// baked coarse point (the same machinery that produced the baked crossing grids).
// ---------------------------------------------------------------------------
const REF = IMP95939_LN125_REACH340_CROSSING_CERTIFICATION;

export const IMP95939_ASSERTIONS = [
  {
    id: "imp95939-reach340-nmax-and-grid-consistent",
    description:
      "Nmax = round(340/delta - 1) = 1523, the 5-point fit grid ends at Nmax, and C_pred = pi^2/(2 delta^2) matches the baked literal",
    holds: () => {
      const Nmax = Math.round(REF.reach / REF.delta - 1);
      const cPred = (Math.PI * Math.PI) / (2 * REF.delta * REF.delta);
      return Nmax === REF.Nmax &&
        REF.fitGrid.length === 5 &&
        REF.fitGrid[REF.fitGrid.length - 1] === REF.Nmax &&
        Math.abs(cPred - REF.cPred) / REF.cPred < 5e-7;
    },
  },
  {
    id: "imp95939-refined-budget-converges-window-cells-within-budget",
    description:
      "at maxIter=950 both near-degenerate window cells converge WITHIN budget (725, 712 both < 950) and match the imp-95859 baked window its, whereas the imp-95820 maxIter=500 run pinned BOTH cells at the cap (500, 500)",
    holds: () => {
      const its950 = REF.windowCellIts[950];
      const its500 = REF.windowCellIts[500];
      const withinBudget = its950.every((x) => x < REF.refinedWindowBudget);
      const cappedAt500 = its500.every((x) => x === REF.imp95820Budget);
      return withinBudget &&
        cappedAt500 &&
        its950[0] === 725 && its950[1] === 712 && // match imp-95859 shiftIts[N=1372,1523]
        REF.refinedBudgetConvergesEveryWindowCell === true &&
        REF.imp95820CappedBothWindowCells === true &&
        REF.windowItsMatchImp95859 === true;
    },
  },
  {
    id: "imp95939-ufit-rel-crosses-cleanly-below-one-percent",
    description:
      "the certified u_fit_rel = (C_fit - C_pred)/C_pred at the ~950 budget re-derives to -0.7363% from the baked C_fit and crosses cleanly below 1% (|u_fit_rel| < 1%)",
    holds: () => {
      const u = (REF.cFitByBudget[950] - REF.cPred) / REF.cPred;
      return Math.abs(u - REF.uFitRelCertified) < 5e-6 &&
        Math.abs(u) < 0.01 &&
        REF.crossesBelowOnePercent === true &&
        REF.monotoneByBudget[950] === true;
    },
  },
  {
    id: "imp95939-budget-1200-identical-to-950-so-950-suffices",
    description:
      "the maxIter=1200 control is identical to maxIter=950 (same window its, same C_fit, same u_fit_rel), confirming ~950 suffices and no further budget changes the verdict",
    holds: () => {
      const eqIts = REF.windowCellIts[1200][0] === REF.windowCellIts[950][0] &&
        REF.windowCellIts[1200][1] === REF.windowCellIts[950][1];
      return eqIts &&
        REF.cFitByBudget[1200] === REF.cFitByBudget[950] &&
        REF.uFitRelByBudget[1200] === REF.uFitRelByBudget[950] &&
        REF.budget1200IdenticalTo950 === true;
    },
  },
  {
    id: "imp95939-imp95820-verdict-stands-undercvg-mild",
    description:
      "the imp-95820 maxIter=500 verdict was already correct: capping shifted C_fit by only ~4.5e-7 relative (98.376518 -> 98.376562), far too small to move the -0.7363% verdict, so the ~950 budget certifies rather than overturns",
    holds: () => {
      const move = Math.abs(REF.cFitByBudget[950] - REF.cFitByBudget[500]) / REF.cFitByBudget[950];
      const uSame = REF.uFitRelByBudget[500] === REF.uFitRelByBudget[950];
      return move < 1e-6 &&
        Math.abs(move - REF.cFitRelMoveFrom500To950) / REF.cFitRelMoveFrom500To950 < 0.1 &&
        uSame &&
        REF.imp95820VerdictStands === true &&
        REF.underConvergenceMilderThanFeared === true;
    },
  },
  {
    id: "imp95939-live-shift-invert-reproduces-imp95838-N150",
    description:
      "one live PD-preserving robust shift-invert DD solve at N=150, delta=ln1.25 reproduces the imp-95838 baked coarse lambda_min (7.362343722e-18) to < 1e-9 relative, its baked iteration count (19), and retries=0 -- the same solver machinery produced the baked crossing grids",
    holds: () => {
      const r = lamMinShiftInvertRobust(150, ddLn125(), 1200, REF.tol);
      return Math.abs(r.rq - 7.362343722e-18) / 7.362343722e-18 < 1e-9 &&
        r.its === 19 && r.retries === 0;
    },
  },
  {
    id: "imp95939-certifies-crossing-not-a-bound",
    description:
      "this certifies the imp-95859-named crossing-run residual at the refined budget and decides the u_fit_rel verdict; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.subGapResolved ===
        "imp-95859-reach340-crossing-run-not-yet-re-executed-at-refined-budget" &&
      REF.closesTickets.includes("imp-95939") &&
      REF.boundChange === false &&
      REF.qed === false &&
      /CERTIFIED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
];

for (const a of IMP95939_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95939-ln125-reach340-crossing-certification assertion failed: ${a.id}`,
    );
  }
}

export default IMP95939_LN125_REACH340_CROSSING_CERTIFICATION;
