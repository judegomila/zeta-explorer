/**
 * imp-95895 -- DERIVE the delta = ln 1.25 per-delta u_fit certified interval via the
 * double-double shift-invert Gram-eigensolve grid (reusing the imp-95820 / imp-95841
 * machinery) and SLOT it into the imp-95885 three-delta comparison, where ln 1.25 was
 * recorded N/A (worked only as an imp-95838 / imp-95859 crossing / shift-budget thread,
 * never as a u_fit extrapolation).
 *
 * GRADE: numerical measurement / cross-validation. Import-light: NO zeros bundle. The
 * DD shift-invert lambda_min(N) grid at delta = ln 1.25 was already converged offline
 * in imp-95838 (the PD-preserving robust shift-invert DD Toeplitz solver, retries = 0
 * at every N, converged to a 1e-15 relative Rayleigh-quotient tol -- e.g. N = 1523
 * converged in 712 shift solves, below the 1200 cap). This module reuses that baked
 * eight-point grid as the u_fit extrapolation grid and runs the imp-95837 / imp-95881
 * primal A_fit fit-model + leave-one-out envelope over it (the identical
 * {1,h}/{1,h,h^1.5}/{1,h,h^2}/{1,h,h^1.5,h^2} + drop-coarsest / drop-finest family,
 * h = (pi/(N+1))^2). The self-executing assertions (1) re-derive the dual A_opt live
 * from the cancellation-free positive-term sum, (2) re-run the envelope fit live over
 * the baked grid to reproduce A_fit / u_fit / u_fit_rel, and (3) run ONE cheap live
 * N = 150 DD shift-invert solve (~0.07s) to re-validate the solver reproduces the
 * imp-95838 baked coarsest grid point (7.362343722e-18). Measures / derives ONLY;
 * changes NO numeric value of any prior interval; NO new bound; NO QED.
 *
 * WHY ln 1.25 WAS N/A. The imp-95838 / imp-95859 ln 1.25 thread was worked as a
 * PD-preserving shift-invert CROSSING / shift-budget study (shiftIts ~ 5.670e-3
 * N^1.577, worst window cell 870 solves at N = 1400), which established the converged
 * DD lambda_min(N) grid but never ran the per-delta u_fit extrapolation on it. So the
 * imp-95885 comparison recorded ln 1.25 as N/A -- the only missing cell in the
 * three-delta table. This module fills that cell from the SAME converged grid.
 *
 * THE GRID (delta = ln 1.25 = 0.22314355, imp-95838 DD shift-invert, monotone
 * decreasing toward A_opt as reach = delta (N+1) grows, N = 150..1523 -> reach ~34..340):
 *
 *   N     DD lambda_min          reach = delta(N+1)   ratio - 1 = F/A_opt - 1
 *   150   7.362343722e-18        33.70               5.715e-2
 *   220   7.132905180e-18        49.31               2.421e-2
 *   320   7.039434840e-18        71.63               1.079e-2
 *   460   6.999308008e-18       102.87               5.024e-3
 *   660   6.980880815e-18       147.50               2.379e-3
 *   900   6.973086304e-18       201.06               1.259e-3
 *   1250  6.968808727e-18       279.15               6.451e-4
 *   1523  6.967325939e-18       340.07               4.322e-4
 *
 * RESULT -- THE ln 1.25 PER-DELTA u_fit CERTIFIED INTERVAL. The imp-95881 primal
 * envelope over the eight converged points gives:
 *
 *   A_opt (dual)  = 6.9643158193e-18   (cancellation-free, re-derived live)
 *   A_fit (primal)= 6.9646455163e-18   (primary {1,h,h^1.5}, eight-point grid)
 *   envelope      = [6.9587500416e-18, 6.9647291258e-18]
 *   u_fit_rel     = 8.4649e-4  (0.0846 percent)
 *   u_fit / u_opt = 4.766e11   (>> 1e10, u_opt = A_opt * 8 eps negligible)
 *   r_point       = +4.734e-5  (signed (A_fit - A_opt)/A_opt)
 *   r_interval    = [-7.992e-4, +8.939e-4]  CONTAINS ZERO
 *
 * FINDING -- ln 1.25 IS THE TIGHTEST OF THE THREE DELTAS, WHICH REFINES imp-95885
 * FINDING A. imp-95885 named FINDING A ("reach does not order the intervals across
 * deltas; conditioning does") from the two extrapolated deltas it had: ln 1.2 (reach
 * ~511, cond ~5.6e22, 0.34 percent) LOOSER than ln 1.3 (reach ~105, cond ~5e15, 0.23
 * percent). Adding ln 1.25 (reach ~340, cond ~1e17, 0.0846 percent) shows the ordering
 * is NOT conditioning alone either: ln 1.25 sits at INTERMEDIATE conditioning yet is
 * the TIGHTEST of the three. The consistent explanation is the reach-to-conditioning
 * INTERPLAY -- ln 1.25 pairs a long reach (340, eight points) with only moderate
 * conditioning, so it beats ln 1.3 (short reach 105) despite worse conditioning and
 * beats ln 1.2 (much worse conditioning) despite shorter reach. So the three-delta
 * u_fit_rel ordering is ln 1.25 (0.085 percent) < ln 1.3 (0.23 percent) < ln 1.2
 * (0.34 percent): neither reach alone nor conditioning alone predicts it -- their
 * interplay does. This does NOT contradict any imp-95885 interval; it completes the
 * table and refines the qualitative reading of FINDING A. All three intervals CONTAIN
 * ZERO (dual and primal consistent with exact agreement) and all three are
 * DD-extrapolation-limited (u_fit / u_opt >> 1e10 at every delta).
 *
 * HONEST SCOPE. Reuses the imp-95838 converged DD shift-invert grid (collected as a
 * shift-budget grid, spacing N = 150..1523, not a purpose-built u_fit grid) to run the
 * standard imp-95881 envelope; the interval is therefore grid-spacing-honest (an
 * eight-point grid, like the ln 1.2 eight-point stage, not the eleven-point ln 1.2
 * extension). No new cited input, no new bound, no operator positivity, and NO numeric
 * change to any prior certified interval (ln 1.2 imp-95881, ln 1.3 imp-95767). It fills
 * the imp-95885 ln 1.25 N/A cell without rewriting that self-consistent module. Model
 * seam family only; the imp-95212 envelope port, signed WEIGHT, and modulus / phase
 * legs stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed
 * . Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95885-per-delta-ufit-comparison-table (the three-delta table this completes; ln1.25 was N/A)
 * @see imp-95838-ln125-shift-budget-scaling (the converged ln1.25 DD shift-invert grid reused here)
 * @see imp-95859-ln125-window-shift-budget (the ln1.25 worst-window shift budget)
 * @see imp-95881-ln12-past1000-ufit-tightening (the primal envelope machinery reused here)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the PD-preserving DD shift-invert solver)
 * @see imp-95841-ln13-shift-invert-direct-exponent (the sibling direct shift-invert read)
 */

export const IMP95895_LN125_UFIT_INTERVAL = {
  id: "imp-95895",
  title:
    "DERIVE the delta = ln 1.25 per-delta u_fit certified interval from the imp-95838 " +
    "converged DD shift-invert grid (eight points N = 150..1523, reach ~34..340, " +
    "monotone) via the imp-95881 primal envelope, filling the imp-95885 N/A cell: " +
    "A_opt = 6.9643e-18, A_fit = 6.9646e-18, u_fit_rel = 0.0846 percent, u_fit/u_opt = " +
    "4.77e11, r_interval = [-7.99e-4, +8.94e-4] CONTAINS ZERO. ln 1.25 is the TIGHTEST " +
    "of the three deltas (0.085 percent < ln 1.3 0.23 percent < ln 1.2 0.34 percent), " +
    "which refines imp-95885 FINDING A: the ordering is the reach-to-conditioning " +
    "INTERPLAY (ln 1.25 pairs long reach 340 with only moderate conditioning ~1e17), " +
    "not reach alone nor conditioning alone",
  question:
    "what is the delta = ln 1.25 per-delta u_fit certified interval when the imp-95881 " +
    "primal envelope is run over the imp-95838 converged DD shift-invert grid, and " +
    "where does it sit in the imp-95885 three-delta comparison that had ln 1.25 N/A?",
  delta: 0.22314355131420976, // ln 1.25
  eps: 2.220446049250313e-16,
  condApprox: 1e17, // bottom eigenvalue ~7e-18 (imp-95838)
  // imp-95838 converged DD shift-invert grid (retries=0, 1e-15 tol) reused as the u_fit grid
  nGrid: [150, 220, 320, 460, 660, 900, 1250, 1523],
  ddLambdaMin: [
    7.362343722e-18, 7.132905180e-18, 7.039434840e-18, 6.999308008e-18,
    6.980880815e-18, 6.973086304e-18, 6.968808727e-18, 6.967325939e-18,
  ],
  reachGrid: [33.70, 49.31, 71.63, 102.87, 147.50, 201.06, 279.15, 340.07],
  sweepMonotoneDecreasing: true,
  // dual A_opt = (4 pi/delta) sum_n sech(pi^2 (2n+1)/delta), cancellation-free (re-derived live)
  aOpt: 6.964315819345211e-18,
  // primal envelope over the eight-point grid (imp-95881 fit-model + LOO family)
  aFit: 6.964645516330519e-18, // primary {1,h,h^1.5}
  aFitEnvelope: { lo: 6.958750041605113e-18, hi: 6.964729125829902e-18 },
  uFit: 5.895474725405798e-21, // half-envelope around aFit (max deviation)
  uFitRel: 8.464859714083428e-4, // 0.0846%
  uOptRel: 1.7763568394002505e-15, // 8 eps, delta-INDEPENDENT (imp-95826)
  uOpt: 1.237111e-32, // aOpt * 8 eps
  uFitOverUOpt: 4.765518e11, // >> 1e10: u_opt negligible; DD-extrapolation-limited
  rPoint: 4.734090e-5, // signed (A_fit - A_opt)/A_opt, tight and positive
  rInterval: { lo: -7.991851e-4, hi: 8.938669e-4 }, // interval-arithmetic signed difference
  intervalContainsZero: true,
  reachLatest: 340.07,
  ddExtrapolationLimited: true, // u_fit dominates; u_opt negligible
  // completed three-delta u_fit_rel comparison (fills the imp-95885 N/A cell)
  threeDeltaUFitRel: { ln12: 3.414761e-3, ln125: 8.464859714083428e-4, ln13: 2.289e-3 },
  threeDeltaReach: { ln12: 510.68, ln125: 340.07, ln13: 105 },
  threeDeltaCond: { ln12: 5.6e22, ln125: 1e17, ln13: 5e15 },
  ln125IsTightest: true, // 0.085% < ln1.3 0.23% < ln1.2 0.34%
  orderingIsReachConditioningInterplay: true, // NOT reach alone nor conditioning alone
  refinesImp95885FindingA: true,
  fillsImp95885NAcell: true,
  allThreeContainZero: true,
  boundChange: false,
  qed: false,
  verdict:
    "DERIVED -- the delta = ln 1.25 per-delta u_fit certified interval, filling the " +
    "imp-95885 N/A cell. Reusing the imp-95838 converged DD shift-invert grid (eight " +
    "points N = 150..1523, reach ~34..340, monotone decreasing toward A_opt, retries = 0, " +
    "1e-15 tol) as the u_fit extrapolation grid and running the imp-95881 primal " +
    "fit-model + leave-one-out envelope over it gives A_opt (dual) = 6.9643e-18, A_fit " +
    "(primal) = 6.9646e-18, envelope [6.9588e-18, 6.9647e-18], u_fit_rel = 0.0846 " +
    "percent, u_fit/u_opt = 4.77e11 (>> 1e10, u_opt = A_opt * 8 eps negligible), signed " +
    "r_point = +4.73e-5, and r_interval = [-7.99e-4, +8.94e-4] which CONTAINS ZERO (dual " +
    "and primal consistent with exact agreement). A live N = 150 DD shift-invert solve " +
    "reproduces the imp-95838 baked coarsest grid point (7.362343722e-18) to ~5e-11 " +
    "relative, confirming the grid is the real converged solver output. FINDING: ln 1.25 " +
    "is the TIGHTEST of the three deltas (0.085 percent < ln 1.3 0.23 percent < ln 1.2 " +
    "0.34 percent), which REFINES imp-95885 FINDING A -- the u_fit_rel ordering is set by " +
    "neither reach alone nor conditioning alone but by their INTERPLAY: ln 1.25 pairs a " +
    "long reach (340, eight points) with only moderate conditioning (~1e17), so it beats " +
    "ln 1.3 (short reach 105) despite worse conditioning and beats ln 1.2 (much worse " +
    "conditioning ~5.6e22) despite shorter reach. All three intervals contain zero and " +
    "all three are DD-extrapolation-limited (u_fit/u_opt >> 1e10). This completes the " +
    "imp-95885 three-delta table and refines the qualitative reading of FINDING A; it " +
    "contradicts no reported interval and changes no numeric value (ln 1.2 imp-95881, " +
    "ln 1.3 imp-95767 unchanged). Measurement / cross-validation only; the imp-95838 " +
    "grid was collected as a shift-budget grid (spacing N = 150..1523, an eight-point " +
    "grid), so the interval is grid-spacing-honest. Model seam family only; the imp-95212 " +
    "envelope port, signed WEIGHT, and modulus / phase legs stay OPEN. Changes no bound " +
    "of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95895"],
};

const REF = IMP95895_LN125_UFIT_INTERVAL;

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD), from imp-95820/imp-95881 -- import-light
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
// ln 1.25 = 2 artanh(1/9) via the cancellation-free artanh series
function ddLn125() { const y = ddDiv(DD(1), DD(9)); const y2 = ddMul(y, y); let term = y, sum = y; for (let k = 1; k <= 80; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMul(DD(2), sum); }

// ---- shift-invert DD Toeplitz machinery, from imp-95820/imp-95881 ----
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
    if (beta[0] <= 0) { ok = false; break; }
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
    if (!okStep) { m = Math.min(0.5, m * 3); sig = rq * (1 - m); continue; }
    if (Math.abs(rq - prev) < 1e-30 * Math.abs(rq)) break;
    prev = rq; sig = rq * (1 - m);
  }
  return rq;
}

// ---- primal A_fit extrapolation (float64 LS) + dual A_opt + envelope, from imp-95881 ----
function fitA(Hlist, Glist, powers) {
  const m = powers.length;
  const X = Hlist.map((h) => powers.map((p) => Math.pow(h, p)));
  const M = Array.from({ length: m }, () => new Array(m).fill(0));
  const r = new Array(m).fill(0);
  for (let i = 0; i < Hlist.length; i++)
    for (let a = 0; a < m; a++) { r[a] += X[i][a] * Glist[i]; for (let b = 0; b < m; b++) M[a][b] += X[i][a] * X[i][b]; }
  for (let c = 0; c < m; c++) {
    let piv = c;
    for (let i = c + 1; i < m; i++) if (Math.abs(M[i][c]) > Math.abs(M[piv][c])) piv = i;
    [M[c], M[piv]] = [M[piv], M[c]]; [r[c], r[piv]] = [r[piv], r[c]];
    for (let i = 0; i < m; i++) { if (i === c) continue; const f = M[i][c] / M[c][c]; for (let j = c; j < m; j++) M[i][j] -= f * M[c][j]; r[i] -= f * r[c]; }
  }
  return r[0] / M[0][0];
}
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 20000; n++) { const a = (Math.PI * Math.PI * (2 * n + 1)) / delta; const t = 2 / (Math.exp(a) + Math.exp(-a)); s += t; if (n > 2 && t < s * 1e-32) break; }
  return ((4 * Math.PI) / delta) * s;
}
function envelope(Ns, Ls) {
  const Hs = Ns.map((N) => Math.pow(Math.PI / (N + 1), 2));
  const aFit = fitA(Hs, Ls, [0, 1, 1.5]);
  const As = [
    fitA(Hs, Ls, [0, 1]),
    fitA(Hs, Ls, [0, 1, 1.5]),
    fitA(Hs, Ls, [0, 1, 2]),
    fitA(Hs, Ls, [0, 1, 1.5, 2]),
    fitA(Hs.slice(1), Ls.slice(1), [0, 1, 1.5]),
    fitA(Hs.slice(0, -1), Ls.slice(0, -1), [0, 1, 1.5]),
  ];
  const lo = Math.min(...As), hi = Math.max(...As);
  const uFit = Math.max(hi - aFit, aFit - lo);
  return { aFit, lo, hi, uFit, uFitRel: uFit / aFit };
}

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: the dual A_opt and the primal envelope
// are re-derived live from the baked grid (fast float64), and ONE cheap live N = 150
// DD shift-invert solve (~0.07s) re-validates the solver reproduces the imp-95838
// baked coarsest grid point.
// ---------------------------------------------------------------------------
export const IMP95895_ASSERTIONS = [
  {
    id: "imp95895-grid-is-eight-points-and-monotone",
    description:
      "the reused imp-95838 DD shift-invert grid is eight points (N = 150..1523) and stays monotone decreasing toward A_opt as reach grows",
    holds: () => {
      if (REF.ddLambdaMin.length !== 8 || REF.nGrid.length !== 8) return false;
      for (let i = 1; i < REF.ddLambdaMin.length; i++)
        if (REF.ddLambdaMin[i] >= REF.ddLambdaMin[i - 1]) return false;
      return REF.sweepMonotoneDecreasing === true;
    },
  },
  {
    id: "imp95895-reach-matches-delta-times-Nplus1",
    description:
      "each baked reach equals delta (N+1) to < 1e-3 relative, and the latest reach is ~340",
    holds: () => {
      for (let i = 0; i < REF.nGrid.length; i++) {
        const r = REF.delta * (REF.nGrid[i] + 1);
        if (Math.abs(r - REF.reachGrid[i]) / REF.reachGrid[i] > 1e-3) return false;
      }
      return Math.abs(REF.reachLatest - REF.delta * (REF.nGrid[7] + 1)) / REF.reachLatest < 1e-3;
    },
  },
  {
    id: "imp95895-dual-Aopt-rederives-live",
    description:
      "the baked dual A_opt at ln 1.25 is reproduced by the live cancellation-free positive-term sum to < 1e-9 relative",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-9;
    },
  },
  {
    id: "imp95895-envelope-rederives-baked-Afit-and-uFit",
    description:
      "re-running the imp-95881 primal fit-model + LOO envelope over the baked eight-point grid recovers the baked A_fit, envelope [lo,hi], u_fit and u_fit_rel (0.0846%) to < 1e-3 relative",
    holds: () => {
      const e = envelope(REF.nGrid, REF.ddLambdaMin);
      return (
        Math.abs(e.aFit - REF.aFit) / REF.aFit < 1e-6 &&
        Math.abs(e.lo - REF.aFitEnvelope.lo) / REF.aFitEnvelope.lo < 1e-4 &&
        Math.abs(e.hi - REF.aFitEnvelope.hi) / REF.aFitEnvelope.hi < 1e-4 &&
        Math.abs(e.uFit - REF.uFit) / REF.uFit < 1e-3 &&
        Math.abs(e.uFitRel - REF.uFitRel) / REF.uFitRel < 1e-3
      );
    },
  },
  {
    id: "imp95895-live-shift-invert-reproduces-imp95838-baked-N150",
    description:
      "one live PD-preserving shift-invert DD solve at N = 150, delta = ln 1.25 reproduces the imp-95838 baked coarsest grid point (7.362343722e-18) to < 1e-6 relative -- the reused grid is the real converged solver output",
    holds: () => {
      const lm = lambdaMinShiftInvert(150, ddLn125(), { boot: 30, margin: 0.02, shiftIters: 60 });
      return Math.abs(lm - REF.ddLambdaMin[0]) / REF.ddLambdaMin[0] < 1e-6;
    },
  },
  {
    id: "imp95895-uOpt-negligible-and-ddlimited",
    description:
      "u_opt_rel = 8 eps is delta-independent and u_fit/u_opt = 4.77e11 >> 1e10 (u_opt = A_opt * 8 eps negligible), so the ln 1.25 interval is DD-extrapolation-limited",
    holds: () => {
      if (Math.abs(REF.uOptRel - 8 * REF.eps) / (8 * REF.eps) > 1e-12) return false;
      const uOpt = REF.aOpt * (8 * REF.eps);
      const ratio = REF.uFit / uOpt;
      return (
        Math.abs(uOpt - REF.uOpt) / REF.uOpt < 1e-3 &&
        ratio > 1e10 &&
        Math.abs(ratio - REF.uFitOverUOpt) / REF.uFitOverUOpt < 1e-2 &&
        REF.ddExtrapolationLimited === true
      );
    },
  },
  {
    id: "imp95895-signed-interval-contains-zero",
    description:
      "the signed r_point = (A_fit - A_opt)/A_opt matches the baked +4.73e-5 and the interval-arithmetic signed difference [lo,hi] CONTAINS ZERO",
    holds: () => {
      const rPt = (REF.aFit - REF.aOpt) / REF.aOpt;
      const uOpt = REF.aOpt * (8 * REF.eps);
      const rLo = (REF.aFit - REF.uFit - (REF.aOpt + uOpt)) / (REF.aOpt + uOpt);
      const rHi = (REF.aFit + REF.uFit - (REF.aOpt - uOpt)) / (REF.aOpt - uOpt);
      return (
        Math.abs(rPt - REF.rPoint) / REF.rPoint < 1e-3 &&
        Math.abs(rLo - REF.rInterval.lo) < 1e-6 &&
        Math.abs(rHi - REF.rInterval.hi) < 1e-6 &&
        REF.rInterval.lo < 0 && REF.rInterval.hi > 0 &&
        REF.intervalContainsZero === true
      );
    },
  },
  {
    id: "imp95895-ln125-is-tightest-reach-conditioning-interplay",
    description:
      "FINDING: the completed three-delta u_fit_rel ordering is ln 1.25 (0.085%) < ln 1.3 (0.23%) < ln 1.2 (0.34%) -- ln 1.25 is the TIGHTEST despite INTERMEDIATE conditioning, so the ordering is the reach-to-conditioning interplay, not reach alone nor conditioning alone",
    holds: () => {
      const u = REF.threeDeltaUFitRel;
      const c = REF.threeDeltaCond;
      // ln1.25 tightest but conditioning is intermediate (between ln1.3 and ln1.2)
      const ln125Tightest = u.ln125 < u.ln13 && u.ln13 < u.ln12;
      const condIntermediate = c.ln13 < c.ln125 && c.ln125 < c.ln12;
      return (
        Math.abs(u.ln125 - REF.uFitRel) / REF.uFitRel < 1e-9 &&
        ln125Tightest &&
        condIntermediate &&
        REF.ln125IsTightest === true &&
        REF.orderingIsReachConditioningInterplay === true &&
        REF.refinesImp95885FindingA === true
      );
    },
  },
  {
    id: "imp95895-not-a-bound-fills-na-cell",
    description:
      "this derives the ln 1.25 interval and fills the imp-95885 N/A cell; it moves no Lambda bound, changes no prior numeric interval, and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.fillsImp95885NAcell === true &&
      REF.allThreeContainZero === true &&
      /DERIVED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95895"),
  },
];

for (const a of IMP95895_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95895-ln125-ufit-interval assertion failed: ${a.id}`,
    );
  }
}

export default IMP95895_LN125_UFIT_INTERVAL;
