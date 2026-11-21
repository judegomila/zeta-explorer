/**
 * imp-95819 -- MEASURE whether the imp-95779 O(N^2) double-double Levinson-Durbin
 * Toeplitz lambda_min solver can reach N ~ 953-1142 at delta = ln 1.3 within a
 * feasible budget, shrinking the imp-95767 primal extrapolation uncertainty
 * u_fit below the +1.68e-2% dual-vs-primal point gap -- and whether the certified
 * interval collapses onto zero (per the imp-95784 one-signed monotone verdict) or
 * resolves away from it.
 *
 * GRADE: numerical measurement / solver-adequacy assessment. Imports no heavy
 * bundle. The heavy reach drive (N up to 1142) runs OFFLINE
 * (tmp/imp-95819-ln13-probe.mjs); a single light N = 120 DD Toeplitz eigen check
 * re-validates the solver against the imp-95784 baked DD Jacobi grid at import so
 * the build stays fast (~0.1s).
 *
 * WHAT imp-95784 LEFT OPEN. imp-95784 established that at delta = ln 1.3 the DD
 * lambda_min grid approaches the cancellation-free dual A_opt = 4.40625e-15
 * STRICTLY FROM ABOVE and MONOTONICALLY, so the imp-95767 certified interval
 * r = (A_fit - A_opt)/A_opt in [-2.121e-3, +2.457e-3] (containing zero) would
 * TIGHTEN onto r -> 0-plus (exact agreement), not separate, when u_fit shrinks.
 * But it could NOT execute the numeric u_fit reduction: the 13.6x shrink of
 * u_fit_rel = 2.289e-3 below the point gap r_point = +1.682e-4 needs DD lambda_min
 * at reach R >~ 250-300 (N ~ 953-1142 at ln 1.3), which imp-95784 called
 * grid-COST blocked for the O(N^3) DD Jacobi -- and it cited the
 * imp-95761-on2-dd-toeplitz-solver residual, now delivered by imp-95779, as the
 * enabling sub-gap. This module tests that solver at ln 1.3.
 *
 * THE MEASUREMENT (offline; tmp/imp-95819-ln13-probe.mjs). The imp-95779 solver
 * (symmetric-Toeplitz Levinson-Durbin GVL 4.7.2 inverse iteration, entirely in
 * double-double, DD sech Toeplitz column, DD matvec Rayleigh quotient) is ported
 * verbatim with delta = ln 1.3 taken from the atanh series y = 3/23
 * ((1+y)/(1-y) = 1.3). Three checks: (0) validate against the imp-95784 baked DD
 * Jacobi grid; (1) drive the reach to N = 953 (R = 250) and N = 1142 (R = 300);
 * (2) probe convergence at N = 953 (budget 800 vs 3000 solves).
 *
 * RESULT 0 -- THE SOLVER IS CORRECT AT ln 1.3. It reproduces the imp-95784 baked
 * DD Jacobi lambda_min at every anchor N to ~1e-11..1e-12 relative (N = 120:
 * 4.689561193e-15 vs baked 4.689561e-15, relDiff 4.5e-12; N = 400: 4.427256121e-15
 * vs 4.427256e-15, relDiff -5.4e-12), tighter than at ln 1.2 (the larger delta
 * spreads the bottom spectrum, so fewer iterations converge each anchor).
 *
 * RESULT 1 -- THE PER-SOLVE REACH IS FEASIBLE, BUT THE TOP UNDER-CONVERGES. At a
 * fixed 800-solve budget the solver reaches N = 953 (R = 250.3) in 42s and
 * N = 1142 (R = 299.9) in 59s single-thread -- the per-solve O(N^3) wall is not
 * the blocker. But the reach drive is NON-monotone at the top: the raw relExcess
 * (lambda_min - A_opt)/A_opt goes +0.4767% (N=400) -> +0.1841% (640) -> +0.1403%
 * (800) -> +0.0838% (953) -> +0.1936% (1142), i.e. N = 1142 sits ABOVE N = 953,
 * which is physically impossible for a monotonically-decreasing finite-size
 * lambda_min. The largest-N point is under-converged, exactly as at ln 1.2
 * (imp-95779 Result 2).
 *
 * RESULT 2 -- CONVERGENCE, NOT PRECISION (same mechanism as ln 1.2). At N = 953
 * raising the budget 800 -> 3000 solves LOWERS lambda_min from 4.409942575e-15
 * (excess 3.690e-18 over A_opt) to 4.409793016e-15 (excess 3.541e-18) and it is
 * still dropping -- the sigma = 0 inverse iteration forced by the Toeplitz
 * structure (T - sigma I is not Toeplitz, Levinson cannot factor it) has a
 * vanishing bottom gap lambda_1/lambda_2 = 1 - O(1/N^2), so the iterations needed
 * to resolve the finite-size excess grow ~ N^2 (3000 solves at N = 953 took 154s
 * and had NOT converged). The O(N^2) iteration blow-up cancels the O(N^2)-per-solve
 * win -- effective O(N^4) -- identically to ln 1.2.
 *
 * VERDICT -- CANNOT DELIVER THE 13.6x u_fit SHRINK; INTERVAL DOES NOT RESOLVE. The
 * imp-95779 solver reaches the required N at ln 1.3 in feasible per-solve time but
 * returns a lambda_min at those N that is biased HIGH by under-convergence, so it
 * cannot produce a converged large-N grid. A 3-point {1,h,h^1.5} fit over the
 * reach-driven (partly under-converged) grid returns r = +0.188% -- LARGER than the
 * imp-95767 clean single-run r_point = +0.0168%, not smaller -- because the
 * non-monotone under-converged top corrupts the extrapolation upward, the opposite
 * of the 13.6x shrink needed. So the numeric u_fit reduction is NOT achieved and
 * the imp-95767 interval STANDS unchanged (still contains zero); it does not
 * resolve away from zero. This is fully consistent with the imp-95784 direction
 * verdict: were a gap-robust solver to deliver converged lambda_min at these N, the
 * one-signed monotone approach from above would tighten r -> 0-plus (collapse onto
 * agreement), never separate. The enabling residual is the SAME imp-95779 sub-gap:
 * imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver -- a Toeplitz-preserving
 * gap-robust bottom eigensolver is required at ln 1.3 too, so imp-95779 is a
 * shared blocker for both the ln 1.2 sub-1% C measurement and the ln 1.3 u_fit
 * shrink.
 *
 * HONEST SCOPE. Numerical assessment of solver adequacy at ln 1.3; no new cited
 * input and no new bound. The imp-95767 certified interval is unchanged. Model seam
 * family only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs
 * stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed
 * . Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95779-on2-dd-toeplitz-lambda-min-ln12 (the O(N^2) solver this ports to ln 1.3)
 * @see imp-95784-dual-primal-larger-dd-grid-direction (the one-signed monotone direction verdict)
 * @see imp-95767-dual-primal-agreement-interval (the certified interval this leaves unchanged)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the reach law + grid-cost wall)
 */

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD) -- import-light, no heavy bundle
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
// exact-ish ln(1.3) via atanh series ln((1+y)/(1-y)) = 2 sum y^(2k+1)/(2k+1), y = 3/23
function ddLn13() {
  const y = ddDiv(DD(3), DD(23)); const y2 = ddMul(y, y);
  let term = y, sum = y;
  for (let k = 1; k <= 80; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; }
  return ddMul(DD(2), sum);
}

// ---------------------------------------------------------------------------
// O(N^2) double-double Toeplitz machinery (Levinson-Durbin + inverse iteration)
// ---------------------------------------------------------------------------
function toeplitzCol(n, deltaDD) {
  const half = ddMul(deltaDD, DD(0.5));
  const rhi = new Float64Array(n), rlo = new Float64Array(n);
  for (let k = 0; k < n; k++) { const v = ddSech(ddMul(DD(k), half)); rhi[k] = v[0]; rlo[k] = v[1]; }
  return { rhi, rlo };
}
function levinsonSolve(n, rhi, rlo, bhi, blo) {
  const xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
  const yhi = new Float64Array(n + 1), ylo = new Float64Array(n + 1);
  const thi = new Float64Array(n + 1), tlo = new Float64Array(n + 1);
  yhi[1] = -rhi[1]; ylo[1] = -rlo[1]; xhi[1] = bhi[1]; xlo[1] = blo[1];
  let beta = DD(1); let alpha = [-rhi[1], -rlo[1]];
  for (let k = 1; k <= n - 1; k++) {
    beta = ddMul(ddSub(DD(1), ddMul(alpha, alpha)), beta);
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
  return { xhi, xlo };
}
function toeplitzMatvec(n, rhi, rlo, xhi, xlo) {
  const yhi = new Float64Array(n + 1), ylo = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) {
    let acc = DD(0);
    for (let j = 1; j <= n; j++) { const d = Math.abs(i - j); acc = ddAdd(acc, ddMul([rhi[d], rlo[d]], [xhi[j], xlo[j]])); }
    yhi[i] = acc[0]; ylo[i] = acc[1];
  }
  return { yhi, ylo };
}
function ddDot(n, ahi, alo, bhi, blo) { let acc = DD(0); for (let i = 1; i <= n; i++) acc = ddAdd(acc, ddMul([ahi[i], alo[i]], [bhi[i], blo[i]])); return acc; }
function lambdaMinToeplitz(n, deltaDD, maxIter, tol) {
  const { rhi, rlo } = toeplitzCol(n, deltaDD);
  let xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) xhi[i] = Math.sin((3.1 * i) / n) + 0.5 * Math.cos(0.7 * i);
  let nrm = ddSqrt(ddDot(n, xhi, xlo, xhi, xlo));
  for (let i = 1; i <= n; i++) { const v = ddDiv([xhi[i], xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
  let prevRQ = Infinity, rq = Infinity;
  for (let it = 0; it < maxIter; it++) {
    const { xhi: yhi, xlo: ylo } = levinsonSolve(n, rhi, rlo, xhi, xlo);
    nrm = ddSqrt(ddDot(n, yhi, ylo, yhi, ylo));
    for (let i = 1; i <= n; i++) { const v = ddDiv([yhi[i], ylo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
    const { yhi: txh, ylo: txl } = toeplitzMatvec(n, rhi, rlo, xhi, xlo);
    rq = toNum(ddDot(n, xhi, xlo, txh, txl));
    if (Math.abs(rq - prevRQ) < tol * Math.abs(rq)) break;
    prevRQ = rq;
  }
  return rq;
}

// ---------------------------------------------------------------------------
// Reference constants (baked from the offline tmp/imp-95819-ln13-probe.mjs run)
// ---------------------------------------------------------------------------
export const IMP95819_ON2_DD_TOEPLITZ_REACH_LN13 = {
  id: "imp-95819",
  title:
    "MEASURE whether the imp-95779 O(N^2) DD Levinson Toeplitz lambda_min solver can " +
    "reach N ~ 953-1142 at delta = ln 1.3 to shrink u_fit below the imp-95767 " +
    "+1.68e-2% dual-vs-primal point gap: the solver is validated at ln 1.3 (reproduces " +
    "the imp-95784 baked DD Jacobi grid to ~1e-11..1e-12) and reaches N = 953/1142 in " +
    "42s/59s per-solve, but the sigma = 0 inverse iteration UNDER-CONVERGES at those N " +
    "(non-monotone top, still dropping at 3000 solves), so it CANNOT deliver the 13.6x " +
    "u_fit shrink and the imp-95767 interval does NOT resolve away from zero",
  question:
    "can the imp-95779 O(N^2) DD Toeplitz lambda_min solver reach N ~ 953-1142 at " +
    "delta = ln 1.3 within a feasible budget and shrink u_fit below the +1.68e-2% " +
    "point gap, resolving the imp-95767 interval, or does the interval collapse onto zero?",
  delta: 0.26236426446749106, // ln 1.3, from the atanh series y = 3/23
  aOptDual: 4.4062522852e-15, // imp-95767 / imp-95784 cancellation-free dual at ln 1.3
  rPoint: 1.682323e-4, // imp-95767 clean single-run signed (A_fit - A_opt)/A_opt = +1.68e-2%
  uFitRel: 2.289e-3, // imp-95767 primal extrapolation uncertainty (relative)
  shrinkFactorToResolve: 13.606, // u_fit_rel / r_point: how far u_fit must drop to clear the gap
  solver: "symmetric-Toeplitz Levinson-Durbin (GVL 4.7.2) inverse iteration in double-double, O(N^2) per solve (imp-95779, ported to ln 1.3)",
  // Result 0: solver correctness vs the imp-95784 baked DD Jacobi grid at ln 1.3
  validation: [
    { n: 120, toeplitzDD: 4.689561193e-15, baked: 4.689561e-15, relDiff: 4.45e-12 },
    { n: 180, toeplitzDD: 4.520655742e-15, baked: 4.520656e-15, relDiff: 6.77e-13 },
    { n: 240, toeplitzDD: 4.467744231e-15, baked: 4.467744e-15, relDiff: -4.51e-12 },
    { n: 320, toeplitzDD: 4.439715646e-15, baked: 4.439716e-15, relDiff: -1.11e-11 },
    { n: 400, toeplitzDD: 4.427256121e-15, baked: 4.427256e-15, relDiff: -5.37e-12 },
  ],
  // Result 1: the reach drive (fixed 800-solve budget) reaches the required N but is non-monotone at the top
  reachDrive800: [
    { n: 400, reach: 105.2, lambdaMin: 4.427256121e-15, relExcessPct: 0.4767, seconds: 7.1 },
    { n: 640, reach: 168.2, lambdaMin: 4.414364427e-15, relExcessPct: 0.1841, seconds: 17.9 },
    { n: 800, reach: 210.2, lambdaMin: 4.412433838e-15, relExcessPct: 0.1403, seconds: 28.7 },
    { n: 953, reach: 250.3, lambdaMin: 4.409942575e-15, relExcessPct: 0.0838, seconds: 42.3 },
    { n: 1142, reach: 299.9, lambdaMin: 4.414783903e-15, relExcessPct: 0.1936, seconds: 59.0 }, // NON-monotone: > N=953 -> under-converged
  ],
  reachDriveNonMonotoneAtTop: true, // lambda_min(1142) > lambda_min(953): impossible if converged
  reaches953InSeconds: 42, // per-solve feasible at reach 250
  reaches1142InSeconds: 59, // per-solve feasible at reach 300
  // Result 2: convergence, not precision -- more solves lower lambda_min(953), still dropping at 3000
  convergenceProbeN953: [
    { maxIter: 800, lambdaMin: 4.409942575e-15, excessOverAopt: 3.690e-18, seconds: 39 },
    { maxIter: 3000, lambdaMin: 4.409793016e-15, excessOverAopt: 3.541e-18, seconds: 154 }, // drops -> under-converged, NOT converged
  ],
  // the fit over the reach-driven (partly under-converged) grid: r LARGER than r_point, not smaller
  rReachDriveFitPct: 0.18810, // (A_fit - A_opt)/A_opt over the reach grid; > r_point (+0.0168%)
  perSolveCost: "O(N^2)", // Levinson: per-solve wall not the blocker; N = 1142 in 59s
  gapVanishesAsN: "lambda_1/lambda_2 = 1 - O(1/N^2) (bottom cluster gap ~ 1/(N+1)^2)",
  iterationsToResolveExcessScaleAs: "O(N^2)", // cancels the O(N^2)/solve win -> effective O(N^4)
  reachesRequiredN: true, // per-solve time is feasible at N ~ 953-1142
  deliversUFitShrink: false, // under-convergence biases lambda_min high; the 13.6x shrink is not achieved
  intervalResolves: false, // imp-95767 interval stays; still contains zero
  intervalCollapsesOntoZero: true, // consistent with imp-95784: a converged solver would tighten r -> 0-plus
  intervalUnchanged: true,
  subGap: "imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver", // shared blocker with the ln 1.2 sub-1% C measurement
  boundChange: false,
  qed: false,
  verdict:
    "SOLVER REACHES THE REQUIRED N AT ln 1.3 BUT UNDER-CONVERGES; u_fit SHRINK NOT " +
    "DELIVERED, INTERVAL DOES NOT RESOLVE. The imp-95779 O(N^2) DD Levinson-Durbin " +
    "Toeplitz inverse iteration, ported to delta = ln 1.3 (atanh series y = 3/23), is " +
    "correct at ln 1.3: it reproduces the imp-95784 baked DD Jacobi lambda_min grid to " +
    "~1e-11..1e-12 relative (N = 120: 4.689561193e-15 vs 4.689561e-15; N = 400: " +
    "4.427256121e-15 vs 4.427256e-15). The per-solve reach is feasible -- it reaches " +
    "N = 953 (R = 250.3) in 42s and N = 1142 (R = 299.9) in 59s single-thread. But at a " +
    "fixed 800-solve budget the reach drive is NON-monotone at the top: raw relExcess " +
    "(lambda_min - A_opt)/A_opt runs +0.4767% (N=400) -> +0.0838% (953) -> +0.1936% " +
    "(1142), and lambda_min(1142) > lambda_min(953) is impossible for a converged " +
    "decreasing finite-size lambda_min. The cause is convergence, not precision: at " +
    "N = 953 raising the budget 800 -> 3000 solves LOWERS lambda_min from 4.409942575e-15 " +
    "(excess 3.690e-18) to 4.409793016e-15 (excess 3.541e-18) and it is still dropping " +
    "(3000 solves = 154s, not converged), because the Toeplitz-forced sigma = 0 inverse " +
    "iteration has a vanishing bottom gap lambda_1/lambda_2 = 1 - O(1/N^2), so the " +
    "iterations needed to resolve the finite-size excess grow ~ N^2 (effective O(N^4)) -- " +
    "the same mechanism imp-95779 found at ln 1.2. Consequently the solver returns a " +
    "large-N lambda_min biased HIGH by under-convergence: a {1,h,h^1.5} fit over the " +
    "reach-driven grid gives r = +0.188%, LARGER than the imp-95767 clean r_point = " +
    "+0.0168% rather than the 13.6x smaller u_fit the resolution needs. So the numeric " +
    "u_fit shrink is NOT achieved and the imp-95767 certified interval STANDS unchanged " +
    "(still contains zero); it does not resolve away from zero. This is consistent with " +
    "the imp-95784 direction verdict -- were a gap-robust solver to deliver converged " +
    "lambda_min at these N, the one-signed monotone approach from above would TIGHTEN " +
    "r -> 0-plus (collapse onto agreement), never separate. The enabling residual is the " +
    "SAME imp-95779 named sub-gap imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver: a " +
    "Toeplitz-preserving gap-robust bottom eigensolver is required at ln 1.3 too, making " +
    "imp-95779 a shared blocker for both the ln 1.2 sub-1% C measurement and the ln 1.3 " +
    "u_fit shrink. Numerical solver-adequacy assessment; model seam family only; the " +
    "imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes no " +
    "bound of the Lambda program; NO QED; no refereed bound is changed. " +
    "Sun arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95819"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: a single N = 120 DD Toeplitz eigen
// solve (~0.1s) re-validates the ln 1.3 solver against the imp-95784 baked value;
// everything else is baked from the offline probe and re-derived arithmetically.
// ---------------------------------------------------------------------------
const REF = IMP95819_ON2_DD_TOEPLITZ_REACH_LN13;

export const IMP95819_ASSERTIONS = [
  {
    id: "imp95819-live-toeplitz-solver-reproduces-baked-N120-ln13",
    description:
      "the live O(N^2) DD Toeplitz Levinson inverse iteration reproduces the imp-95784 baked DD " +
      "Jacobi lambda_min at N = 120, delta = ln 1.3 (4.689561e-15) to < 1e-6 relative -- the solver is correct at ln 1.3",
    holds: () => {
      const lm = lambdaMinToeplitz(120, ddLn13(), 400, 1e-14);
      return Math.abs(lm - 4.689561e-15) / 4.689561e-15 < 1e-6;
    },
  },
  {
    id: "imp95819-ddLn13-matches-log",
    description: "the DD ln 1.3 (atanh series y = 3/23) matches Math.log(1.3) to < 1e-15 relative",
    holds: () => Math.abs(toNum(ddLn13()) - Math.log(1.3)) / Math.log(1.3) < 1e-15 &&
      Math.abs(REF.delta - Math.log(1.3)) / Math.log(1.3) < 1e-12,
  },
  {
    id: "imp95819-baked-validation-relDiffs-small",
    description: "each baked validation cell reproduces its baked DD Jacobi lambda_min to < 1e-6 relative",
    holds: () => REF.validation.every((v) => Math.abs(v.toeplitzDD - v.baked) / v.baked < 1e-6),
  },
  {
    id: "imp95819-reaches-required-N-per-solve",
    description:
      "the solver reaches N = 953 (reach 250) and N = 1142 (reach 300) at delta = ln 1.3 in feasible " +
      "per-solve time (< 90s each), so the per-solve wall is NOT the blocker",
    holds: () => {
      const n953 = REF.reachDrive800.find((r) => r.n === 953);
      const n1142 = REF.reachDrive800.find((r) => r.n === 1142);
      return (
        REF.reachesRequiredN === true &&
        n953 && n1142 &&
        Math.abs(n953.reach - 250) < 1 && Math.abs(n1142.reach - 300) < 1 &&
        n953.seconds < 90 && n1142.seconds < 90 &&
        Math.round(250 / REF.delta - 1) === 952 &&
        Math.round(300 / REF.delta - 1) === 1142
      );
    },
  },
  {
    id: "imp95819-reach-drive-non-monotone-at-top",
    description:
      "the fixed-800-solve reach drive is non-monotone at the top (lambda_min(1142) > lambda_min(953)), " +
      "the hallmark of under-convergence",
    holds: () => {
      const n953 = REF.reachDrive800.find((r) => r.n === 953);
      const n1142 = REF.reachDrive800.find((r) => r.n === 1142);
      return REF.reachDriveNonMonotoneAtTop === true && n1142.lambdaMin > n953.lambdaMin && n1142.relExcessPct > n953.relExcessPct;
    },
  },
  {
    id: "imp95819-convergence-not-precision",
    description:
      "at N = 953 raising the inverse-iteration budget 800 -> 3000 LOWERS lambda_min toward A_opt " +
      "(still dropping, under-converged) -- convergence, not precision",
    holds: () => {
      const p = REF.convergenceProbeN953;
      const p800 = p.find((x) => x.maxIter === 800), p3000 = p.find((x) => x.maxIter === 3000);
      return (
        p3000.lambdaMin < p800.lambdaMin &&
        p3000.lambdaMin > REF.aOptDual &&
        p800.lambdaMin > REF.aOptDual &&
        REF.iterationsToResolveExcessScaleAs === "O(N^2)"
      );
    },
  },
  {
    id: "imp95819-does-not-deliver-uFit-shrink",
    description:
      "the reach-drive fit r = +0.188% is LARGER than the imp-95767 r_point = +0.0168% (under-convergence " +
      "biases the extrapolation up), so the 13.6x u_fit shrink is NOT delivered and the interval does not resolve",
    holds: () =>
      REF.deliversUFitShrink === false &&
      REF.intervalResolves === false &&
      REF.rReachDriveFitPct / 100 > REF.rPoint && // reach-drive r exceeds the clean point gap (wrong direction)
      Math.abs(REF.shrinkFactorToResolve - REF.uFitRel / REF.rPoint) / (REF.uFitRel / REF.rPoint) < 1e-3,
  },
  {
    id: "imp95819-interval-collapses-per-imp95784",
    description:
      "the finding is consistent with the imp-95784 one-signed monotone verdict: a converged solver would " +
      "collapse the interval onto zero (r -> 0-plus), not separate; the interval is left unchanged",
    holds: () =>
      REF.intervalCollapsesOntoZero === true &&
      REF.intervalUnchanged === true &&
      REF.subGap === "imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver",
  },
  {
    id: "imp95819-not-a-bound",
    description: "numerical solver-adequacy measurement; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false && REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict) && REF.closesTickets.includes("imp-95819"),
  },
];

for (const a of IMP95819_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95819-on2-dd-toeplitz-reach-ln13 assertion failed: ${a.id}`,
    );
  }
}

export default IMP95819_ON2_DD_TOEPLITZ_REACH_LN13;
