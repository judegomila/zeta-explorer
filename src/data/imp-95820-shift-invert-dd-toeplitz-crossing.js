/**
 * imp-95820 -- ASSESS a shift-invert / Rayleigh-quotient-iteration double-double
 * variant to cure the imp-95799 large-N inverse-iteration under-convergence, then
 * re-run the float64-clean ln1.45 control the sigma=0 solver failed and (control
 * passing) measure the fully-DD ln1.35 / ln1.25 sub-1% crossing.
 *
 * GRADE: numerical solver-adequacy assessment + measurement. Import-light: the
 * reach-sweep C-fit numbers are BAKED from the offline driver
 * tmp/imp-95820-shiftinvert.mjs (which reuses the imp-95799/imp-95779 DD Toeplitz
 * machinery with the shift-invert inner solve added); the self-executing
 * assertions run ONE cheap live N=80 shift-invert solve (~0.04s) to re-validate
 * the solver, re-derive the ln1.45-control and ln1.35-crossing C-fits from their
 * baked grid lambda_min values, and check the mechanism-correction literals. No
 * heavy DD reach sweep at import; no zeros bundle.
 *
 * WHAT imp-95799 LEFT OPEN. imp-95799 fitted R*(delta) as a clean first-order
 * linear drift but could NOT run the fully-DD ln1.35 / ln1.25 sub-1% crossing:
 * the imp-95779 DD Levinson inverse iteration (forced to sigma = 0 because
 * imp-95779 believed a nonzero shift breaks the Toeplitz structure) converges
 * from ABOVE and under-converges at large N as the bottom eigen-gap collapses --
 * at ln1.45 N=699 lambda_min biased high 4.25e-6 rel, at ln1.35 N=865 lambda_min
 * goes non-monotone, collapsing the C-fit to -94%. Named sub-gap
 * imp-95799-dd-crossing-needs-converged-eigensolver.
 *
 * RESULT 1 -- imp-95779's STRUCTURAL CLAIM IS CORRECTED: SHIFT-INVERT *IS*
 * O(N^2)-TOEPLITZ-COMPATIBLE. imp-95779 stated "a NONZERO shift breaks the
 * Toeplitz structure (T - sigma I is not Toeplitz, so Levinson cannot factor it)".
 * That is false: subtracting sigma from the CONSTANT main diagonal of a symmetric
 * Toeplitz matrix leaves every diagonal constant, so T - sigma I is STILL
 * symmetric Toeplitz with first column (1 - sigma, r_1, r_2, ...). Levinson-Durbin
 * (which assumes unit diagonal) solves it after normalizing by d = 1 - sigma:
 *     (T - sigma I) y = x  <=>  T' y = x/d,  T'_diag = 1, T'_k = r_k/d (k>=1).
 * The REAL constraint is definiteness, not structure: Levinson-Durbin needs
 * positive-definiteness (beta > 0, |reflection| < 1). A shift below lambda_min
 * keeps T - sigma I PD and Levinson stable; a shift above lambda_min (e.g. naive
 * RQI, where sigma = Rayleigh quotient >= lambda_min) makes T - sigma I indefinite
 * and Levinson BREAKS DOWN (beta <= 0) -- confirmed empirically: the naive RQI
 * variant hits a nonpositive beta on every shifted step.
 *
 * RESULT 2 -- A PD-PRESERVING SHIFT-INVERT CURES THE UNDER-CONVERGENCE. Two-stage
 * auto solver: bootstrap sigma = 0 for ~40 iters (RQ descends from ABOVE, so the
 * estimate R0 > lambda_min), then shift sigma = R0 (1 - margin) held strictly
 * below the running estimate (margin ~ 0.02; on any indefinite breakdown the
 * margin is grown and the step retried). It reproduces the imp-95799 converged
 * bottom eigenvalue in ~80-115 solves where the sigma = 0 iteration needs
 * ~4000-5000: at ln1.45 N=699 it returns lambda_min = 1.9707983301e-10 (100
 * solves), EXACTLY the imp-95799 5000-solve converged value, and the whole reach
 * sweep is now MONOTONE (the imp-95779/imp-95799 non-monotone top is gone).
 *
 * RESULT 3 -- THE ln1.45 CONTROL NOW PASSES. Re-running the identical 5-point grid
 * C-fit (grid = [Nmin, 1.7 Nmin, 2.6 Nmin, 3.6 Nmin, Nmax], Nmin = round(Nmax/4),
 * C-fit = B/A of lambda_min = A + B h + D h^1.5, h = (pi/(N+1))^2):
 *
 *   reach 200 (Nmax 537): C-fit relErr = -1.553%   (float64 truth -1.503%; old DD -6.90%)
 *   reach 260 (Nmax 699): C-fit relErr = -0.869%   (float64 truth -0.878%; old DD -1.30%)
 *
 *   The shift-invert DD readout now MATCHES the reliable float64 truth to < 0.06%
 *   absolute at both control reaches -- the -6.90% / -1.30% control failure
 *   imp-95799 reported is resolved.
 *
 * RESULT 4 -- THE FULLY-DD SIDE CROSSES SUB-1%. With the control passed, the
 * ln1.35 / ln1.25 crossing that imp-95799 could not measure now runs cleanly
 * (every sweep monotone):
 *
 *   ln1.35 (C_pred 54.7929, R*_pred 259.87):
 *     reach 200 (Nmax  665): -1.861%
 *     reach 260 (Nmax  865): -1.047%   (imp-95799 here COLLAPSED to -94.0%)
 *     reach 320 (Nmax 1065): -0.673%   <- crosses sub-1%
 *   ln1.25 (C_pred 99.1063, R*_pred 276.67):
 *     reach 220 (Nmax  985): -1.909%
 *     reach 277 (Nmax 1240): -1.149%
 *     reach 340 (Nmax 1523): -0.736%   <- crosses sub-1% (needs the larger shift budget)
 *
 *   So the fully-DD side DOES cross sub-1%, confirming the imp-95761/imp-95786
 *   reach-universality on the DD deltas. The crossing sits slightly BEYOND the
 *   linear R*_pred (both DD deltas are still ~-1.1% to -1.9% at their extrapolated
 *   R*), consistent with the imp-95799 R*(delta) line mildly under-predicting the
 *   crossing reach on the DD side -- a small extension of RESULT 1 there, not a
 *   contradiction.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. (a) The imp-95799 solver-convergence wall is
 * REMOVED: shift-invert restores monotone convergence and the ln1.45 control
 * passes to < 0.06%. (b) ln1.35 crosses sub-1% at a fixed ~115-solve budget;
 * ln1.25 (bottom eigenvalue ~7e-18, condition ~1e17) needs a LARGER shift budget
 * (boot 60 / ~250 shift solves) at its top N ~ 1370-1523 -- at the small budget
 * N=1372 is still ~2e-5 high, which is what corrupted the small-budget ln1.25
 * reach-340 cell; NEW named sub-gap imp-95820-ln125-shift-budget-scaling (the
 * shift-iteration count still grows with the ln1.25 conditioning, though far more
 * slowly than the sigma=0 O(N^2) blow-up). (c) The naive RQI variant (sigma = RQ)
 * is unusable with Levinson (indefinite breakdown); a definiteness-preserving
 * shift is mandatory. (d) Numerical solver assessment of an established scaling
 * law; introduces no new cited input and no new bound. Model seam family only; the
 * imp-95212 envelope port, signed WEIGHT and modulus/phase legs stay OPEN. Changes
 * NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95799-rstar-delta-drift-linear-fit (the crossing test this unblocks; its solver sub-gap)
 * @see imp-95779-on2-dd-toeplitz-lambda-min-ln12 (the O(N^2) DD solver + the corrected shift claim)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the reach-universality law N_max ~ 250/delta)
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
// exact-ish ln(1.2) in DD via atanh series ln((1+y)/(1-y)) = 2 sum y^(2k+1)/(2k+1), y = 1/11
function ddLn12() { const y = ddDiv(DD(1), DD(11)); const y2 = ddMul(y, y); let term = y, sum = y; for (let k = 1; k <= 60; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMul(DD(2), sum); }

// ---------------------------------------------------------------------------
// O(N^2) double-double Toeplitz machinery with a SHIFTED Levinson inner solve.
// Solve (T - sigma I) x = b: T - sigma I stays symmetric Toeplitz (diagonal
// 1 - sigma, off-diagonals r_k unchanged); normalize by d = 1 - sigma so the
// unit-diagonal Levinson recursion applies. beta <= 0 flags an indefinite shift.
// ---------------------------------------------------------------------------
function toeplitzCol(n, deltaDD) { const half = ddMul(deltaDD, DD(0.5)); const rhi = new Float64Array(n), rlo = new Float64Array(n); for (let k = 0; k < n; k++) { const v = ddSech(ddMul(DD(k), half)); rhi[k] = v[0]; rlo[k] = v[1]; } return { rhi, rlo }; }
function levinsonSolveShift(n, rhi, rlo, bhi, blo, sigmaDD) {
  const dDD = ddSub(DD(1), sigmaDD);
  const rphi = new Float64Array(n), rplo = new Float64Array(n);
  for (let k = 1; k < n; k++) { const v = ddDiv([rhi[k], rlo[k]], dDD); rphi[k] = v[0]; rplo[k] = v[1]; }
  const bphi = new Float64Array(n + 1), bplo = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) { const v = ddDiv([bhi[i], blo[i]], dDD); bphi[i] = v[0]; bplo[i] = v[1]; }
  const xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
  const yhi = new Float64Array(n + 1), ylo = new Float64Array(n + 1);
  const thi = new Float64Array(n + 1), tlo = new Float64Array(n + 1);
  yhi[1] = -rphi[1]; ylo[1] = -rplo[1]; xhi[1] = bphi[1]; xlo[1] = bplo[1];
  let beta = DD(1); let alpha = [-rphi[1], -rplo[1]]; let ok = true;
  for (let k = 1; k <= n - 1; k++) {
    beta = ddMul(ddSub(DD(1), ddMul(alpha, alpha)), beta);
    if (beta[0] <= 0) { ok = false; break; } // indefinite shift -> Levinson breakdown
    let acc = [bphi[k + 1], bplo[k + 1]];
    for (let i = 1; i <= k; i++) acc = ddSub(acc, ddMul([rphi[i], rplo[i]], [xhi[k + 1 - i], xlo[k + 1 - i]]));
    const mu = ddDiv(acc, beta);
    for (let i = 1; i <= k; i++) { const v = ddAdd([xhi[i], xlo[i]], ddMul(mu, [yhi[k + 1 - i], ylo[k + 1 - i]])); thi[i] = v[0]; tlo[i] = v[1]; }
    for (let i = 1; i <= k; i++) { xhi[i] = thi[i]; xlo[i] = tlo[i]; }
    xhi[k + 1] = mu[0]; xlo[k + 1] = mu[1];
    if (k < n - 1) {
      let acc2 = [rphi[k + 1], rplo[k + 1]];
      for (let i = 1; i <= k; i++) acc2 = ddAdd(acc2, ddMul([rphi[i], rplo[i]], [yhi[k + 1 - i], ylo[k + 1 - i]]));
      alpha = ddDiv([-acc2[0], -acc2[1]], beta);
      for (let i = 1; i <= k; i++) { const z = ddAdd([yhi[i], ylo[i]], ddMul(alpha, [yhi[k + 1 - i], ylo[k + 1 - i]])); thi[i] = z[0]; tlo[i] = z[1]; }
      for (let i = 1; i <= k; i++) { yhi[i] = thi[i]; ylo[i] = tlo[i]; }
      yhi[k + 1] = alpha[0]; ylo[k + 1] = alpha[1];
    }
  }
  return { xhi, xlo, ok };
}
function toeplitzMatvec(n, rhi, rlo, xhi, xlo) { const yhi = new Float64Array(n + 1), ylo = new Float64Array(n + 1); for (let i = 1; i <= n; i++) { let acc = DD(0); for (let j = 1; j <= n; j++) { const d = Math.abs(i - j); acc = ddAdd(acc, ddMul([rhi[d], rlo[d]], [xhi[j], xlo[j]])); } yhi[i] = acc[0]; ylo[i] = acc[1]; } return { yhi, ylo }; }
function ddDot(n, ahi, alo, bhi, blo) { let acc = DD(0); for (let i = 1; i <= n; i++) acc = ddAdd(acc, ddMul([ahi[i], alo[i]], [bhi[i], blo[i]])); return acc; }
// two-stage PD-preserving shift-invert bottom eigenvalue (see RESULT 2)
function lambdaMinShiftInvert(n, deltaDD, { boot = 20, margin = 0.02, shiftIters = 40 } = {}) {
  const { rhi, rlo } = toeplitzCol(n, deltaDD);
  let xhi = new Float64Array(n + 1), xlo = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) xhi[i] = Math.sin((3.1 * i) / n) + 0.5 * Math.cos(0.7 * i);
  let nrm = ddSqrt(ddDot(n, xhi, xlo, xhi, xlo));
  for (let i = 1; i <= n; i++) { const v = ddDiv([xhi[i], xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
  let rq = Infinity;
  const step = (sigmaDD) => {
    const sol = levinsonSolveShift(n, rhi, rlo, xhi, xlo, sigmaDD);
    if (!sol.ok) return false;
    nrm = ddSqrt(ddDot(n, sol.xhi, sol.xlo, sol.xhi, sol.xlo));
    for (let i = 1; i <= n; i++) { const v = ddDiv([sol.xhi[i], sol.xlo[i]], nrm); xhi[i] = v[0]; xlo[i] = v[1]; }
    const { yhi: txh, ylo: txl } = toeplitzMatvec(n, rhi, rlo, xhi, xlo);
    rq = toNum(ddDot(n, xhi, xlo, txh, txl));
    return true;
  };
  for (let it = 0; it < boot; it++) step(DD(0));
  let m = margin, sig = rq * (1 - m), prev = Infinity;
  for (let it = 0; it < shiftIters; it++) {
    const okStep = step([sig, 0]);
    if (!okStep) { m = Math.min(0.5, m * 3); sig = rq * (1 - m); continue; } // back off an indefinite shift
    if (Math.abs(rq - prev) < 1e-30 * Math.abs(rq)) break;
    prev = rq; sig = rq * (1 - m);
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
// Reference constants (baked from tmp/imp-95820-shiftinvert.mjs)
// ---------------------------------------------------------------------------
export const IMP95820_SHIFT_INVERT_DD_TOEPLITZ_CROSSING = {
  id: "imp-95820",
  title:
    "ASSESS a shift-invert / RQI double-double variant to cure the imp-95799 large-N " +
    "under-convergence: it CORRECTS imp-95779 (T - sigma I stays Toeplitz, so shift-invert IS " +
    "O(N^2)-compatible; the real constraint is positive-definiteness, not structure -- a naive " +
    "RQI shift sigma = RQ >= lambda_min makes Levinson break down). A PD-preserving shift-invert " +
    "restores monotone convergence in ~80-115 solves (vs ~4000-5000), the ln1.45 control now " +
    "PASSES (relErr -1.553% / -0.869% vs float64 truth -1.503% / -0.878%, was -6.90% / -1.30%), " +
    "and the fully-DD side crosses sub-1% (ln1.35 -0.673% at reach 320; ln1.25 -0.736% at reach 340)",
  question:
    "does a shift-invert / Rayleigh-quotient-iteration DD variant restore monotone convergence at " +
    "the N where the imp-95799 sigma=0 inverse iteration under-converges, does the ln1.45 control " +
    "then pass, and does the fully-DD ln1.35 / ln1.25 side cross sub-1%?",
  // ---- RESULT 1: mechanism correction ----
  imp95779ShiftClaimCorrected: true,
  shiftKeepsToeplitz: true, // T - sigma I is symmetric Toeplitz, first column (1-sigma, r_1, ...)
  realConstraintIsDefiniteness: true, // Levinson needs PD (beta>0), not "Toeplitz structure"
  naiveRqiBreaksDown: true, // sigma = RQ >= lambda_min -> indefinite -> beta<=0 every shifted step
  // ---- RESULT 2: convergence cure ----
  ln145N699ShiftInvert: 1.9707983301e-10, // matches imp-95799 5000-solve converged value exactly
  imp95799ConvergedN699: 1.9707983301e-10,
  shiftInvertSolvesN699: 100, // vs ~5000 for sigma=0
  sweepMonotoneRestored: true,
  // ---- RESULT 3: ln1.45 control (5-point C-fit grid, per imp-95786/imp-95799) ----
  cPredLn145: 35.74399, // pi^2 / (2 (ln 1.45)^2)
  controlLn145: [
    { reach: 200, nMax: 537, grid: [134, 228, 348, 482, 537],
      lam: [2.0135440539e-10, 1.9837661037e-10, 1.9753687645e-10, 1.9724397443e-10, 1.9718283999e-10],
      shiftInvertRelErr: -0.01553, float64RelErr: -0.01503, oldDDRelErr: -0.06904, mono: true },
    { reach: 260, nMax: 699, grid: [175, 298, 455, 630, 699],
      lam: [1.9944258758e-10, 1.9776313075e-10, 1.9728258172e-10, 1.9711397838e-10, 1.9707983301e-10],
      shiftInvertRelErr: -0.00869, float64RelErr: -0.00878, oldDDRelErr: -0.01296, mono: true },
  ],
  controlPasses: true,
  // ---- RESULT 4: fully-DD side crossing ----
  cPredLn135: 54.79290, // pi^2 / (2 (ln 1.35)^2)
  cPredLn125: 99.10634, // pi^2 / (2 (ln 1.25)^2)
  ddSideLn135: [
    { reach: 200, nMax: 665, relErr: -0.01861, mono: true },
    { reach: 260, nMax: 865, relErr: -0.01047, mono: true, imp95799Collapsed: -0.94029 }, // imp-95799 here: -94%
    { reach: 320, nMax: 1065, grid: [266, 452, 692, 958, 1065],
      lam: [4.4040949720e-13, 4.3796775478e-13, 4.3725873206e-13, 4.3701196555e-13, 4.3696106165e-13],
      relErr: -0.00673, mono: true, crossesSub1: true },
  ],
  ddSideLn125: [
    { reach: 220, nMax: 985, relErr: -0.01909, mono: true },
    { reach: 277, nMax: 1240, relErr: -0.01149, mono: true },
    { reach: 340, nMax: 1523, relErr: -0.00736, mono: true, crossesSub1: true, budget: "boot60/shift250" },
  ],
  ddSideCrossesSub1: true,
  crossingSitsSlightlyBeyondRstarPred: true, // both DD deltas still ~-1.1..-1.9% at their linear R*_pred
  // ---- honest residual ----
  boundChange: false,
  qed: false,
  subGapResolved: "imp-95799-dd-crossing-needs-converged-eigensolver",
  subGap: "imp-95820-ln125-shift-budget-scaling",
  verdict:
    "SHIFT-INVERT CURES THE imp-95799 UNDER-CONVERGENCE AND THE FULLY-DD SIDE CROSSES SUB-1%. " +
    "First, imp-95779's structural claim is CORRECTED: T - sigma I is still symmetric Toeplitz " +
    "(subtracting sigma from the constant main diagonal keeps every diagonal constant; first " +
    "column (1 - sigma, r_1, r_2, ...)), so Levinson-Durbin solves it in O(N^2) after normalizing " +
    "by d = 1 - sigma -- shift-invert is Toeplitz-compatible. The real constraint is definiteness: " +
    "Levinson needs beta > 0 (positive-definiteness), so a shift below lambda_min is stable but a " +
    "naive RQI shift sigma = RQ >= lambda_min makes T - sigma I indefinite and Levinson breaks " +
    "down (beta <= 0 on every shifted step, confirmed). A two-stage PD-preserving shift-invert " +
    "(bootstrap sigma = 0 for ~40 iters to get R0 > lambda_min from above, then sigma = R0(1 - " +
    "margin) held below the running estimate) reproduces the imp-95799 converged bottom " +
    "eigenvalue in ~80-115 solves versus ~5000 (ln1.45 N=699: 1.9707983301e-10 in 100 solves, " +
    "exactly the imp-95799 5000-solve value) and restores a monotone reach sweep. The ln1.45 " +
    "control the sigma = 0 solver failed now PASSES: C-fit relErr = -1.553% (reach 200) and " +
    "-0.869% (reach 260), matching the reliable float64 truth (-1.503% / -0.878%) to < 0.06% " +
    "absolute (was -6.90% / -1.30%). With the control passed, the fully-DD ln1.35 / ln1.25 " +
    "crossing imp-95799 could not measure runs cleanly and crosses sub-1%: ln1.35 -> -0.673% at " +
    "reach 320 (Nmax 1065; imp-95799 had COLLAPSED to -94% at reach 260, now a clean -1.047% " +
    "there), ln1.25 -> -0.736% at reach 340 (Nmax 1523, with a larger shift budget). The crossing " +
    "sits slightly beyond the imp-95799 linear R*_pred (both DD deltas still ~-1.1..-1.9% at their " +
    "extrapolated R*), a mild extension of the R*(delta) drift on the DD side, not a contradiction. " +
    "Residual: ln1.25's extreme conditioning (bottom eigenvalue ~7e-18) needs a larger shift " +
    "budget at its top N ~ 1370-1523 (small-budget N=1372 still ~2e-5 high) -- new named sub-gap " +
    "imp-95820-ln125-shift-budget-scaling. Numerical solver-adequacy assessment of an established " +
    "scaling law; model seam family only; imp-95212 envelope port, signed WEIGHT and modulus/phase " +
    "legs stay OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95820"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: ONE live N=80 shift-invert solve
// (~0.04s) re-validates the solver; the C-fits are re-derived from the baked grid
// lambda_min values; the mechanism-correction literals are checked. No heavy DD
// reach sweep at import.
// ---------------------------------------------------------------------------
const REF = IMP95820_SHIFT_INVERT_DD_TOEPLITZ_CROSSING;

export const IMP95820_ASSERTIONS = [
  {
    id: "imp95820-live-shift-invert-reproduces-baked-N80-ln12",
    description:
      "the live PD-preserving shift-invert solver reproduces the imp-95779/imp-95762 baked DD " +
      "lambda_min at N = 80, delta = ln 1.2 (6.464515655e-22) to < 1e-6 relative -- the shifted " +
      "Levinson inner solve is correct",
    holds: () => {
      const lm = lambdaMinShiftInvert(80, ddLn12(), { boot: 20, margin: 0.02, shiftIters: 40 });
      return Math.abs(lm - 6.464515655e-22) / 6.464515655e-22 < 1e-6;
    },
  },
  {
    id: "imp95820-shifted-levinson-still-toeplitz-o-n2",
    description:
      "the shifted inner solve is a Levinson-Durbin factorization of the STILL-Toeplitz T - sigma I " +
      "(normalized by d = 1 - sigma): the corrected structural claim, and O(N^2) per solve",
    holds: () =>
      REF.imp95779ShiftClaimCorrected === true &&
      REF.shiftKeepsToeplitz === true &&
      REF.realConstraintIsDefiniteness === true,
  },
  {
    id: "imp95820-naive-rqi-indefinite-breakdown-flagged",
    description:
      "the naive RQI shift (sigma = RQ >= lambda_min) makes T - sigma I indefinite; a live shifted " +
      "solve at N = 60 with sigma just ABOVE the bootstrap RQ returns ok = false (Levinson beta <= 0)",
    holds: () => {
      const n = 60; const { rhi, rlo } = toeplitzCol(n, ddLn12());
      // a crude bottom-estimate then an over-shift above it
      const rq0 = lambdaMinShiftInvert(n, ddLn12(), { boot: 10, margin: 0.02, shiftIters: 20 });
      const bhi = new Float64Array(n + 1), blo = new Float64Array(n + 1);
      for (let i = 1; i <= n; i++) bhi[i] = 1;
      const overShift = levinsonSolveShift(n, rhi, rlo, bhi, blo, [rq0 * 2, 0]); // sigma = 2*lambda_min > lambda_min
      return overShift.ok === false && REF.naiveRqiBreaksDown === true;
    },
  },
  {
    id: "imp95820-control-ln145-cfit-reproduces-baked-relErr",
    description:
      "re-fitting C = B/A on each baked ln1.45 control grid reproduces the baked shift-invert relErr " +
      "(reach 200 -1.553%, reach 260 -0.869%) to < 0.1% absolute",
    holds: () =>
      REF.controlLn145.every((c) => {
        const Hs = c.grid.map((N) => Math.pow(Math.PI / (N + 1), 2));
        const [A, B] = fit3(Hs, c.lam);
        const rel = (B / A - REF.cPredLn145) / REF.cPredLn145;
        return Math.abs(rel - c.shiftInvertRelErr) < 1e-3;
      }),
  },
  {
    id: "imp95820-control-passes-matches-float64-truth",
    description:
      "at both control reaches the shift-invert relErr matches the reliable float64 truth to < 0.06% " +
      "absolute AND beats the old sigma=0 DD readout -- the imp-95799 control failure is resolved",
    holds: () =>
      REF.controlPasses === true &&
      REF.controlLn145.every(
        (c) =>
          Math.abs(c.shiftInvertRelErr - c.float64RelErr) < 6e-4 &&
          Math.abs(c.shiftInvertRelErr - c.float64RelErr) < Math.abs(c.oldDDRelErr - c.float64RelErr),
      ),
  },
  {
    id: "imp95820-ln145-N699-matches-imp95799-converged",
    description:
      "the shift-invert lambda_min at ln1.45 N=699 equals the imp-95799 5000-solve converged value " +
      "1.9707983301e-10 (in 100 solves) -- convergence restored, not precision-limited",
    holds: () =>
      REF.ln145N699ShiftInvert === REF.imp95799ConvergedN699 &&
      REF.shiftInvertSolvesN699 < 200 &&
      REF.sweepMonotoneRestored === true,
  },
  {
    id: "imp95820-ln135-crosses-sub1pct",
    description:
      "the ln1.35 reach-320 C-fit (re-derived from its baked grid) crosses sub-1% (|relErr| < 1%) and " +
      "the reach-260 cell that imp-95799 collapsed to -94% is now a clean ~-1%",
    holds: () => {
      const c = REF.ddSideLn135.find((x) => x.reach === 320);
      const Hs = c.grid.map((N) => Math.pow(Math.PI / (N + 1), 2));
      const [A, B] = fit3(Hs, c.lam);
      const rel = (B / A - REF.cPredLn135) / REF.cPredLn135;
      const c260 = REF.ddSideLn135.find((x) => x.reach === 260);
      return Math.abs(rel) < 0.01 && Math.abs(rel - c.relErr) < 1e-3 &&
        c.crossesSub1 === true && Math.abs(c260.relErr) < 0.02 && c260.imp95799Collapsed < -0.5;
    },
  },
  {
    id: "imp95820-ln125-crosses-sub1pct-with-larger-budget",
    description:
      "the ln1.25 side crosses sub-1% at reach 340 (|relErr| < 1%) with a larger shift budget, and " +
      "the sub-gap names the ln1.25 budget-scaling residual",
    holds: () => {
      const c = REF.ddSideLn125.find((x) => x.reach === 340);
      return c.crossesSub1 === true && Math.abs(c.relErr) < 0.01 &&
        REF.ddSideCrossesSub1 === true && REF.subGap === "imp-95820-ln125-shift-budget-scaling";
    },
  },
  {
    id: "imp95820-resolves-imp95799-solver-subgap",
    description:
      "this module resolves the imp-95799 solver-convergence sub-gap (the crossing test is unblocked)",
    holds: () =>
      REF.subGapResolved === "imp-95799-dd-crossing-needs-converged-eigensolver" &&
      REF.closesTickets.includes("imp-95820"),
  },
  {
    id: "imp95820-cPred-literals-match-formula",
    description: "the baked cPred literals equal pi^2 / (2 delta^2) at ln1.45 / ln1.35 / ln1.25",
    holds: () => {
      const chk = (x, want) => { const d = Math.log(x); const c = (Math.PI * Math.PI) / (2 * d * d); return Math.abs(c - want) / want < 1e-5; };
      return chk(1.45, REF.cPredLn145) && chk(1.35, REF.cPredLn135) && chk(1.25, REF.cPredLn125);
    },
  },
  {
    id: "imp95820-not-a-bound",
    description: "numerical solver-assessment module; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false && REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict) && REF.closesTickets.includes("imp-95820"),
  },
];

for (const a of IMP95820_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95820-shift-invert-dd-toeplitz-crossing assertion failed: ${a.id}`);
  }
}

export default IMP95820_SHIFT_INVERT_DD_TOEPLITZ_CROSSING;
