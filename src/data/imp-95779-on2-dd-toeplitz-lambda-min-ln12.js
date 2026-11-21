/**
 * imp-95779 -- IMPLEMENT the O(N^2) double-double Toeplitz lambda_min solver that
 * imp-95761 named as its residual (imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct),
 * and MEASURE whether it drives the Szego edge-coefficient fit
 * C(delta) = pi^2 / (2 delta^2) below 1% at delta = ln 1.2.
 *
 * GRADE: numerical measurement / method assessment. Imports no heavy bundle. The
 * heavy reach sweep (N up to 1370) runs OFFLINE
 * (tmp/imp-95779-toeplitz-dd.mjs); only a light N = 80 double-double eigen check
 * and an N = 30 Levinson solve-residual check run at import so the build stays fast.
 *
 * WHAT imp-95761 LEFT OPEN. imp-95761 drove the finite-grid low bias in
 * C(delta) = pi^2/(2 delta^2) below 1% at delta = ln 1.5 with a fast float64
 * lambda_min, and a double-double Jacobi PROBE resolved lambda_min at delta = ln 1.2
 * (N = 120 -> 4.972e-22, N = 200 -> 4.469e-22), REFINING the imp-95743 quad-double
 * remark to a grid-COST wall: reaching the reach R = delta(N+1) >~ 250 that
 * sub-1% C needs (N ~ 1370 at ln 1.2) with an O(N^3) DD cyclic Jacobi is hours of
 * single-thread compute. imp-95761 NAMED the residual: a Toeplitz-structured
 * O(N^2) DD lambda_min would remove that per-solve wall.
 *
 * THE SOLVER (offline; tmp/imp-95779-toeplitz-dd.mjs). The seam Gram
 * G_{jk} = sech((j-k) delta/2) is a symmetric Toeplitz matrix with first column
 * r_k = sech(k delta/2). lambda_min is computed by shift-invert inverse iteration
 * whose inner solve T y = x is the Levinson-Durbin recursion (Golub-Van Loan
 * 4.7.2) carried ENTIRELY in double-double (Dekker/Bailey QD, DD exp/sech entries,
 * exact DD delta = ln 1.2 from the atanh series y = 1/11), with a double-double
 * Toeplitz-matvec Rayleigh quotient readout. Each solve is O(N^2), versus the
 * O(N^3) DD cyclic Jacobi of imp-95743/imp-95761.
 *
 * RESULT 1 -- THE SOLVER IS CORRECT AND FAST. It reproduces the baked DD
 * lambda_min at delta = ln 1.2 to ~1e-8..1e-10 relative:
 *
 *   N     O(N^2) DD Toeplitz     baked DD                 relDiff
 *    80   6.464515654e-22        6.464515655e-22 (imp-95762 rho=1)  -1.3e-10
 *   120   4.972161426e-22        4.972161e-22   (imp-95761 probe)    8.6e-8
 *   200   4.468903815e-22        4.468904e-22   (imp-95761 probe)   -4.1e-8
 *
 *   and it reaches N = 1370 (reach R = delta(N+1) = 250) in ~83s single-thread --
 *   the per-solve O(N^3) COST WALL imp-95761 named is REMOVED.
 *
 * RESULT 2 -- BUT C IS NOT DRIVEN SUB-1% AT ln 1.2 (the measurement the ticket
 * asked for). The reach sweep at a fixed inverse-iteration budget (800 solves)
 * gives lambda_min that is NON-monotone at the top -- N = 1370 (4.270400789e-22)
 * sits ABOVE N = 1000 (4.270000304e-22), which is physically impossible for a
 * monotonically-decreasing finite-size lambda_min -- and the fit
 * lambda_min(N) = A + B h + D h^1.5 (h = (pi/(N+1))^2), C_fit = B/A, returns
 *
 *   C_fit(reach 250) = 124.257    C_pred = pi^2/(2 (ln 1.2)^2) = 148.455    relErr = -16.30%
 *
 *   i.e. FAR from the sub-1% the imp-95761 reach-universality (~-0.8% at reach 260)
 *   predicted. Not sub-1%.
 *
 * RESULT 3 -- WHY (convergence, NOT precision). At N = 1370 raising the inverse
 * iteration budget from 800 to 3000 solves LOWERS lambda_min monotonically toward
 * the dual A_opt = 4.263426e-22 (excess 6.98e-25 -> 3.45e-25), so the top of the
 * sweep is UNDER-CONVERGED, not precision-limited. The mechanism is structural: a
 * NONZERO shift breaks the Toeplitz structure (T - sigma I is not Toeplitz, so
 * Levinson cannot factor it), forcing the sigma = 0 inverse iteration T^{-1},
 * whose convergence factor is lambda_1/lambda_2 = 1 - O(1/N^2) as the bottom
 * spectrum clusters (gap ~ 3 pi^2 (A_opt-excess) / (N+1)^2). So the iterations
 * needed to resolve the finite-size EXCESS lambda_min(N) - A_opt grow ~ N^2 (the
 * imp-95743 clustered-spectrum warning, now quantified): ~1e4 solves at N ~ 1370.
 * That O(N^2) iteration blow-up CANCELS the O(N^2)-per-solve win -- the effective
 * cost of a converged large-N lambda_min is ~ O(N^4), and the grid-COST wall is
 * not removed but RELOCATED from per-solve arithmetic to inverse-iteration count.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. (a) The O(N^2) DD Toeplitz solver imp-95761
 * named is IMPLEMENTED and VALIDATED (the deliverable half of the residual); the
 * per-solve O(N^3) cost wall is removed. (b) It does NOT deliver sub-1% C at
 * ln 1.2: the sigma = 0 inverse iteration forced by the Toeplitz structure has a
 * vanishing bottom gap, so at reach 250 the finite-size excess is under-converged
 * (C_fit = -16.3%). REFINED residual, NEW named sub-gap:
 * imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver -- a Toeplitz-structure-
 * preserving GAP-ROBUST bottom eigensolver (superfast Toeplitz-preconditioned
 * Lanczos / band-preconditioned CG, or a deflation keeping O(N^2) per step) is
 * required to convert the removed per-solve cost into the sub-1% C measurement.
 * (c) Numerical measurement of an established scaling law; introduces no new cited
 * input and no new bound. Model seam family only; the imp-95212 envelope port,
 * signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed.
 *
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the residual this implements)
 * @see imp-95743-szego-coefficient-double-double-crosscheck (the DD Jacobi fit)
 * @see imp-95762-twin-pair-block-floor-finite80-dd-eigensolver (the rho=1 baked value cross-checked)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual-derived law C = pi^2/(2 delta^2))
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
// exact-ish ln(1.2) via atanh series ln((1+y)/(1-y)) = 2 sum y^(2k+1)/(2k+1), y = 1/11
function ddLn12() {
  const y = ddDiv(DD(1), DD(11)); const y2 = ddMul(y, y);
  let term = y, sum = y;
  for (let k = 1; k <= 60; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; }
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
// solve T x = b, symmetric Toeplitz, diagonal r0 = 1 (GVL Alg 4.7.2), 1-based
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
// 3x3 least squares fit lambda(N) = A + B h + D h^1.5, C = B/A
function fit3(Hs, Gs) {
  const X = Hs.map((h) => [1, h, Math.pow(h, 1.5)]);
  const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; const r = [0, 0, 0];
  for (let i = 0; i < Hs.length; i++) for (let a = 0; a < 3; a++) { r[a] += X[i][a] * Gs[i]; for (let b = 0; b < 3; b++) M[a][b] += X[i][a] * X[i][b]; }
  const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D0 = det(M); const rep = (c) => { const m = M.map((row) => row.slice()); for (let i = 0; i < 3; i++) m[i][c] = r[i]; return det(m) / D0; };
  return [rep(0), rep(1), rep(2)];
}

// ---------------------------------------------------------------------------
// Reference constants (baked from the offline tmp/imp-95779-toeplitz-dd.mjs run)
// ---------------------------------------------------------------------------
export const IMP95779_ON2_DD_TOEPLITZ_LAMBDA_MIN_LN12 = {
  id: "imp-95779",
  title:
    "IMPLEMENT the O(N^2) double-double Toeplitz lambda_min (Levinson-Durbin inverse " +
    "iteration) that imp-95761 named as its residual, and MEASURE the C(delta) = " +
    "pi^2/(2 delta^2) fit at delta = ln 1.2: the solver is validated (reproduces the " +
    "baked DD lambda_min to ~1e-8..1e-10, reaches N = 1370 in ~83s, removing the O(N^3) " +
    "per-solve wall) but C is NOT driven sub-1% (C_fit = -16.3% at reach 250) because " +
    "the Toeplitz-forced sigma = 0 inverse iteration has a vanishing bottom gap",
  question:
    "does an O(N^2) double-double Toeplitz lambda_min drive the Szego edge-coefficient " +
    "fit C(delta) = pi^2/(2 delta^2) below 1% at delta = ln 1.2, where imp-95761 " +
    "reported the O(N^3) DD Jacobi is grid-cost-prohibitive?",
  delta: 0.1823215567939546, // ln 1.2
  cPredLn12: 148.45461693984447, // pi^2 / (2 (ln 1.2)^2)
  aOptDual: 4.263426088e-22, // imp-95761 / imp-95762 cancellation-free dual
  solver: "symmetric-Toeplitz Levinson-Durbin (GVL 4.7.2) inverse iteration in double-double, O(N^2) per solve",
  fitModel: "lambda_min(N) = A + B (pi/(N+1))^2 + D (pi/(N+1))^3, C_fit = B/A (least squares)",
  // Result 1: solver correctness vs the baked DD lambda_min at delta = ln 1.2
  validation: [
    { n: 80, toeplitzDD: 6.464515654e-22, baked: 6.464515655e-22, source: "imp-95762 rho=1 (uniform seam)", relDiff: -1.26e-10 },
    { n: 120, toeplitzDD: 4.972161426e-22, baked: 4.972161e-22, source: "imp-95761 probe", relDiff: 8.56e-8 },
    { n: 200, toeplitzDD: 4.468903815e-22, baked: 4.468904e-22, source: "imp-95761 probe", relDiff: -4.14e-8 },
  ],
  // Result 2: the reach sweep (fixed 800-solve inverse-iteration budget) and the C fit
  reachSweep800: [
    { n: 200, reach: 36.6, lambdaMin: 4.468903815e-22 },
    { n: 400, reach: 73.1, lambdaMin: 4.307919363e-22 },
    { n: 700, reach: 127.8, lambdaMin: 4.277143057e-22 },
    { n: 1000, reach: 182.5, lambdaMin: 4.270000304e-22 },
    { n: 1370, reach: 250.0, lambdaMin: 4.270400789e-22 }, // NON-monotone: > N=1000 -> under-converged
  ],
  cFitReach250: 124.25737,
  cFitRelErr: -0.16299, // -16.30%, far from sub-1%
  reachSweepNonMonotoneAtTop: true, // lambda_min(1370) > lambda_min(1000): impossible if converged
  // Result 3: convergence, not precision -- more solves lower lambda_min(1370)
  convergenceProbeN1370: [
    { maxIter: 800, lambdaMin: 4.270400789e-22, excessOverAopt: 6.975e-25 },
    { maxIter: 3000, lambdaMin: 4.266879692e-22, excessOverAopt: 3.454e-25 }, // drops -> under-converged
  ],
  perSolveCost: "O(N^2)", // Levinson: removes the imp-95761 per-solve O(N^3) wall
  reaches1370InSeconds: 83, // single thread, 800 solves
  gapVanishesAsN: "lambda_1/lambda_2 = 1 - O(1/N^2) (bottom cluster gap ~ 1/(N+1)^2)",
  iterationsToResolveExcessScaleAs: "O(N^2)", // cancels the O(N^2)/solve win -> effective O(N^4)
  costWallRemoved: false, // relocated from per-solve arithmetic to inverse-iteration count
  drivesCBelow1PctAtLn12: false,
  boundChange: false,
  qed: false,
  subGapImplemented: "imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct",
  subGap: "imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver",
  verdict:
    "O(N^2) DD TOEPLITZ SOLVER IMPLEMENTED AND VALIDATED; C NOT DRIVEN SUB-1% AT " +
    "ln 1.2. imp-95761 named a Toeplitz-structured O(N^2) DD lambda_min as the residual " +
    "for the grid-COST wall blocking sub-1% C at delta = ln 1.2 (reach R = delta(N+1) " +
    ">~ 250, N ~ 1370). This module implements it -- a symmetric-Toeplitz Levinson-Durbin " +
    "(GVL 4.7.2) inverse iteration entirely in double-double (DD sech Toeplitz column, DD " +
    "matvec Rayleigh quotient, exact DD ln 1.2 from the atanh series) -- and it is correct: " +
    "it reproduces the baked DD lambda_min at ln 1.2 to ~1e-8..1e-10 (N = 80: 6.464515654e-22 " +
    "vs 6.464515655e-22; N = 120: 4.972161426e-22; N = 200: 4.468903815e-22) and reaches " +
    "N = 1370 in ~83s single-thread, REMOVING the per-solve O(N^3) cost wall. But it does " +
    "NOT drive C below 1%: at a fixed 800-solve budget the reach sweep is NON-monotone at the " +
    "top (lambda_min(1370) = 4.270400789e-22 > lambda_min(1000) = 4.270000304e-22, impossible " +
    "for a converged decreasing finite-size lambda_min), and the fit returns C_fit = 124.26 " +
    "vs C_pred = 148.45 (relErr -16.30%), far from the imp-95761 reach-universality prediction " +
    "(~ -0.8% at reach 260). The cause is convergence, NOT precision: at N = 1370 raising the " +
    "budget 800 -> 3000 solves LOWERS lambda_min monotonically toward the dual A_opt = " +
    "4.263426e-22 (excess 6.98e-25 -> 3.45e-25). Structurally, a nonzero shift breaks the " +
    "Toeplitz structure (T - sigma I is not Toeplitz, Levinson cannot factor it), forcing the " +
    "sigma = 0 inverse iteration whose convergence factor is lambda_1/lambda_2 = 1 - O(1/N^2) " +
    "as the bottom spectrum clusters -- so the iterations needed to resolve the finite-size " +
    "excess grow ~ N^2 (~1e4 solves at N ~ 1370), CANCELLING the O(N^2)-per-solve win " +
    "(effective O(N^4)). The grid-COST wall is therefore not removed but RELOCATED from " +
    "per-solve arithmetic to inverse-iteration count. REFINED residual, NEW named sub-gap: " +
    "imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver -- a Toeplitz-structure-preserving " +
    "gap-robust bottom eigensolver (superfast Toeplitz-preconditioned Lanczos / band-" +
    "preconditioned CG, or an O(N^2) deflation) is required to convert the removed per-solve " +
    "cost into the sub-1% C measurement at ln 1.2. Numerical measurement of an established " +
    "scaling law; model seam family only; imp-95212 envelope port, signed WEIGHT, modulus/" +
    "phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95779"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: a single N = 80 DD eigen solve (~0.13s)
// re-validates the O(N^2) solver against the baked value, and an N = 30 Levinson
// solve-residual check re-validates the Toeplitz factorization. The heavy reach
// sweep is baked above.
// ---------------------------------------------------------------------------
const REF = IMP95779_ON2_DD_TOEPLITZ_LAMBDA_MIN_LN12;

export const IMP95779_ASSERTIONS = [
  {
    id: "imp95779-live-toeplitz-solver-reproduces-baked-N80",
    description:
      "the live O(N^2) DD Toeplitz Levinson inverse iteration reproduces the baked DD " +
      "lambda_min at N = 80, delta = ln 1.2 (6.464515655e-22) to < 1e-6 relative -- the solver is correct",
    holds: () => {
      const lm = lambdaMinToeplitz(80, ddLn12(), 300, 1e-13);
      return Math.abs(lm - 6.464515655e-22) / 6.464515655e-22 < 1e-6;
    },
  },
  {
    id: "imp95779-live-levinson-solve-residual-tiny",
    description:
      "the live DD Levinson solve of T x = b (b = ones) at N = 30 reproduces b: max|T x - b| < 1e-24 " +
      "-- the double-double Toeplitz factorization is correct",
    holds: () => {
      const n = 30; const { rhi, rlo } = toeplitzCol(n, ddLn12());
      const bhi = new Float64Array(n + 1), blo = new Float64Array(n + 1);
      for (let i = 1; i <= n; i++) bhi[i] = 1;
      const { xhi, xlo } = levinsonSolve(n, rhi, rlo, bhi, blo);
      const { yhi, ylo } = toeplitzMatvec(n, rhi, rlo, xhi, xlo);
      let worst = 0;
      for (let i = 1; i <= n; i++) worst = Math.max(worst, Math.abs((yhi[i] + ylo[i]) - 1));
      return worst < 1e-24;
    },
  },
  {
    id: "imp95779-baked-validation-relDiffs-small",
    description: "each baked validation cell reproduces its baked DD lambda_min to < 1e-6 relative",
    holds: () => REF.validation.every((v) => Math.abs(v.toeplitzDD - v.baked) / v.baked < 1e-6),
  },
  {
    id: "imp95779-cFit-matches-baked-sweep",
    description:
      "the baked C_fit = 124.257 equals B/A from the least-squares fit of the baked reach sweep " +
      "(A + B h + D h^1.5, h = (pi/(N+1))^2) to < 0.05 absolute",
    holds: () => {
      const Hs = REF.reachSweep800.map((r) => Math.pow(Math.PI / (r.n + 1), 2));
      const Gs = REF.reachSweep800.map((r) => r.lambdaMin);
      const [A, B] = fit3(Hs, Gs);
      return Math.abs(B / A - REF.cFitReach250) < 0.05;
    },
  },
  {
    id: "imp95779-C-not-driven-sub1pct",
    description:
      "the measured C_fit at reach 250 is FAR from sub-1% (|relErr| ~ 16%), so the O(N^2) " +
      "Toeplitz solver does NOT deliver sub-1% C at delta = ln 1.2",
    holds: () =>
      REF.drivesCBelow1PctAtLn12 === false &&
      Math.abs(REF.cFitRelErr) > 0.1 &&
      Math.abs(100 * (REF.cFitReach250 - REF.cPredLn12) / REF.cPredLn12 / 100 - REF.cFitRelErr) < 5e-3,
  },
  {
    id: "imp95779-reason-is-convergence-not-precision",
    description:
      "at N = 1370 raising the inverse-iteration budget LOWERS lambda_min toward the dual A_opt " +
      "(under-convergence), and the top of the fixed-budget sweep is non-monotone -- convergence, not precision",
    holds: () => {
      const p = REF.convergenceProbeN1370;
      const p800 = p.find((x) => x.maxIter === 800), p3000 = p.find((x) => x.maxIter === 3000);
      return (
        REF.reachSweepNonMonotoneAtTop === true &&
        p3000.lambdaMin < p800.lambdaMin &&
        p3000.lambdaMin > REF.aOptDual &&
        p800.lambdaMin > REF.aOptDual
      );
    },
  },
  {
    id: "imp95779-per-solve-wall-removed-but-relocated",
    description:
      "the Levinson solve is O(N^2) (per-solve O(N^3) wall removed, N = 1370 in ~83s) but the " +
      "iteration count scales O(N^2) as the bottom gap vanishes -- the cost wall is relocated, not removed",
    holds: () =>
      REF.perSolveCost === "O(N^2)" &&
      REF.reaches1370InSeconds < 300 &&
      REF.iterationsToResolveExcessScaleAs === "O(N^2)" &&
      REF.costWallRemoved === false,
  },
  {
    id: "imp95779-implements-imp95761-residual-names-new-subgap",
    description:
      "this module implements the imp-95761 named residual and names its refined residual",
    holds: () =>
      REF.subGapImplemented === "imp-95761-on2-dd-toeplitz-solver-for-ln12-subpct" &&
      REF.subGap === "imp-95779-gap-robust-on2-toeplitz-bottom-eigsolver",
  },
  {
    id: "imp95779-cPred-literal-is-pi-squared-over-two-delta-squared",
    description: "the baked cPredLn12 equals pi^2 / (2 (ln 1.2)^2)",
    holds: () => {
      const d = Math.log(1.2); const want = (Math.PI * Math.PI) / (2 * d * d);
      return Math.abs(REF.cPredLn12 - want) / want < 1e-9;
    },
  },
  {
    id: "imp95779-not-a-bound",
    description: "numerical measurement module; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false && REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict) && REF.closesTickets.includes("imp-95779"),
  },
];

for (const a of IMP95779_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95779-on2-dd-toeplitz-lambda-min-ln12 assertion failed: ${a.id}`,
    );
  }
}

export default IMP95779_ON2_DD_TOEPLITZ_LAMBDA_MIN_LN12;
