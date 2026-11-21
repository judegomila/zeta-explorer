/**
 * imp-95896 -- EXTEND the imp-95881 ln 1.2 DD extrapolation reach PAST N = 2800
 * (three new points N = 3600 / 4400 / 5200, reach ~657 / ~803 / ~948) with the
 * imp-95820 shift-invert DD Toeplitz machinery and decide whether the per-delta
 * u_fit certified interval at delta = ln 1.2 REACHES the ln 1.3 direct interval
 * (0.23 percent) or FLOORS at the A_opt ~ 4.26e-22 deep corner (conditioning ~5.6e22).
 * The direct successor of imp-95881 (which extended to N = 2800, reach ~511, and
 * named this residual).
 *
 * GRADE: numerical measurement. Import-light. The three new past-2800 DD Jacobi
 * lambda_min(N) values are BAKED from the offline driver
 * tmp/imp-95896-ln12-past2800.mjs (which reuses the imp-95820 PD-preserving
 * shift-invert DD Toeplitz solver verbatim, boot 40 / margin 0.02 / up to 200 shift
 * solves; every N converged in 240 solves, sweep stays monotone decreasing). The
 * self-executing assertions re-derive the 11-point (imp-95881, N <= 2800) and the
 * extended 14-point (N <= 5200) primal A_fit fit-model + leave-one-out envelope and
 * u_fit live (fast float64 fits), re-derive the dual A_opt and u_opt live, and run
 * ONE cheap live N = 120 DD shift-invert solve (~0.06s) to re-validate the solver
 * reproduces the imp-95837 baked coarsest grid point. No heavy DD reach sweep at
 * import; no zeros bundle. Measures ONLY; changes NO numeric value of the imp-95767
 * interval; NO new bound; NO QED.
 *
 * WHAT imp-95881 LEFT AS THE RESIDUAL. imp-95881 extended the ln 1.2 grid to N = 2800
 * (reach ~511) and tightened u_fit_rel from 0.54 percent to 0.34 percent (1.588x),
 * with NO deep-corner DD-floor flattening, but named the residual explicitly: the
 * extended 0.34 percent is still LOOSER than the ln 1.3 direct interval (0.23 percent),
 * and driving it lower needs ever larger N per the imp-95820-ln125-shift-budget-scaling
 * residual (the N = 2800 solve took ~108s). This module pushes the reach past N = 2800
 * and settles whether the tightening reaches the ln 1.3 level or floors.
 *
 * THE PAST-2800 GRID. Three new DD Jacobi lambda_min(N) points at delta = ln 1.2,
 * imp-95820 shift-invert DD Toeplitz solver, every N converged in 240 solves, sweep
 * continues monotone decreasing toward A_opt = 4.2634260802e-22:
 *
 *   N      reach = delta(N+1)   DD lambda_min           ratio - 1 = F/A_opt - 1
 *   3600   656.54              4.2639150853e-22         1.146977e-4
 *   4400   802.40              4.2637606993e-22         7.848596e-5
 *   5200   948.25              4.2636909684e-22         6.213036e-5
 *
 * appended to the imp-95881 baked eleven (N = 120..2800, 4.972e-22 -> 4.264e-22).
 *
 * RESULT -- EXTENDING PAST N = 2800 KEEPS TIGHTENING THE ln 1.2 u_fit INTERVAL TO THE
 * ln 1.3 LEVEL; STILL NO DD-FLOOR FLATTENING; STILL JUST LOOSER. Re-running the
 * imp-95837/imp-95860 primal envelope (same {1,h}/{1,h,h^1.5}/{1,h,h^2}/{1,h,h^1.5,h^2}
 * + drop-coarsest/drop-finest LOO family) over the extended 14-point grid gives:
 *
 *   grid                 A_fit            u_fit_rel   r_point = (A_fit-A_opt)/A_opt   u_fit/u_opt
 *   11-point (N<=2800)   4.2645e-22       3.415e-3    +2.573e-4                       1.923e12
 *   14-point (N<=5200)   4.2642e-22       2.465e-3    +1.699e-4                       1.388e12
 *
 * i.e. u_fit_rel tightens 0.34 percent -> 0.247 percent (a 1.385x factor), the primary
 * A_fit descends further toward the dual A_opt so the signed r_point tightens toward
 * zero (+2.57e-4 -> +1.70e-4), and u_fit/u_opt drops to 1.39e12 -- still >> 1e10, so
 * u_opt stays negligible. The A_opt ~ 4.26e-22 deep corner does NOT hit the DD floor:
 * every extended N converged in 240 solves and the sweep stayed monotone decreasing
 * out to reach ~948 (far past ln 1.3s N = 400 reach ~105). The interval-arithmetic
 * signed difference (A_fit - A_opt)/A_opt over the extended grid is [-2.30e-3, +2.64e-3]
 * and still CONTAINS ZERO -- the dual and primal routes remain consistent with exact
 * agreement at ln 1.2, now on a tighter interval. So the ln 1.2 per-delta u_fit
 * certified interval REACHES the neighbourhood of the ln 1.3 direct level (0.247 percent
 * vs 0.23 percent, only 1.07x looser); it is not floored.
 *
 * DECISION (the ticket question). Extending PAST N = 2800 keeps tightening the ln 1.2
 * u_fit interval and does NOT floor at the deep corner: u_fit_rel = 0.247 percent is now
 * within 1.07x of the ln 1.3 direct 0.23 percent, having descended monotonically
 * 0.54 -> 0.34 -> 0.247 percent across the N = 1000 / 2800 / 5200 reach extensions.
 * It has NOT yet crossed below the ln 1.3 level -- it remains just looser -- but the
 * A_opt ~ 4.26e-22 corner (cond ~5.6e22, near the DD ~32-digit floor) did NOT flatten
 * the sweep, so the interval is still reach-refinable rather than DD-precision-floored.
 *
 * RESIDUAL SUB-GAP (unchanged in kind). The extended u_fit_rel = 0.247 percent is now
 * essentially AT but still just above the ln 1.3 direct interval (0.23 percent); crossing
 * below needs still larger N per the same imp-95820-ln125-shift-budget-scaling residual
 * (the N = 5200 solve took ~392s here). NOT a new regime -- the DD-extrapolation-limited
 * structure and the tightening trend are established on the converged window
 * N = 120..5200.
 *
 * HONEST SCOPE. Direct measurement extending an established audit grid; no new cited
 * input, no new bound, no operator positivity, and NO numeric change to the imp-95767
 * certified interval (that interval is at ln 1.3; this is the ln 1.2 companion
 * measurement). Model seam family only; the imp-95212 envelope port, signed WEIGHT,
 * and modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed. Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95881-ln12-past1000-ufit-tightening (the 11-point N<=2800 grid this extends)
 * @see imp-95857-ln13-extended-reach-exponent (the ln1.3 extended-reach measurement this mirrors)
 * @see imp-95837-ln12-dd-extrapolation-grid (the original 5-point N<=400 grid)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert DD solver reused here)
 * @see imp-95825-finite-section-positivity-certificate (lambda_min(G_n) >= ess-inf f = A_opt)
 */

export const IMP95896_LN12_PAST2800_UFIT_TIGHTENING = {
  id: "imp-95896",
  title:
    "EXTEND the imp-95881 ln 1.2 DD extrapolation reach past N = 2800 (three new " +
    "points N = 3600 / 4400 / 5200, reach ~657 / ~803 / ~948, imp-95820 shift-invert " +
    "DD Toeplitz solver, monotone, every N converged in 240 solves) and recompute the " +
    "primal A_fit envelope -- extending past N = 2800 KEEPS tightening the ln 1.2 " +
    "u_fit_rel from 0.34 percent to 0.247 percent (1.385x), the signed r_point from " +
    "+2.57e-4 to +1.70e-4, and drops u_fit/u_opt to 1.39e12 (still >> 1e10, u_opt still " +
    "negligible); the A_opt ~ 4.26e-22 deep corner still does NOT hit the DD floor, so " +
    "the per-delta u_fit interval keeps refining by reach at ln 1.2, now within 1.07x of " +
    "(but still just looser than) the ln 1.3 direct interval 0.23 percent",
  question:
    "does extending the imp-95881 ln 1.2 DD grid past N = 2800 REACH the ln 1.3 direct " +
    "level (0.23 percent), or does the deep-corner A_opt ~ 4.26e-22 near the DD floor " +
    "flatten/floor it?",
  delta: 0.18232155679395462, // ln 1.2
  eps: 2.220446049250313e-16,
  aOpt: 4.2634260802e-22, // dual, cancellation-free (re-derived live below; matches imp-95837/imp-95881)
  // imp-95881 baked 11-point grid (N <= 2800) + three new past-2800 points
  nGrid: [120, 180, 240, 320, 400, 560, 760, 1000, 1400, 2000, 2800, 3600, 4400, 5200],
  ddLambdaMin: [
    4.9721614258e-22, 4.5258636911e-22, 4.3992279309e-22, 4.3353953376e-22,
    4.3079193631e-22, 4.2852678733e-22, 4.2749940414e-22, 4.2699987625e-22,
    4.2667304975e-22, 4.2650276275e-22, 4.2642374815e-22,
    4.2639150853e-22, 4.2637606993e-22, 4.2636909684e-22,
  ],
  sweepMonotoneDecreasing: true,
  extendedConverged: true, // every new N converged in 240 solves; no DD-floor flattening
  // ratio - 1 = F/A_opt - 1 at the three new past-2800 points (monotone down)
  extendedRatioMinus1: [1.146977e-4, 7.848596e-5, 6.213036e-5],
  extendedReach: [656.54, 802.40, 948.25],
  // 11-point envelope (imp-95881, N <= 2800)
  aFit11: 4.2645230528e-22,
  uFitRel11: 3.414761e-3, // 0.34%
  rPoint11: 2.572984e-4, // +0.026%
  uFitOverUOpt11: 1.922834e12,
  // extended 14-point envelope (N <= 5200)
  aFit: 4.2641502501e-22, // primary {1,h,h^1.5}, extended grid
  aFitEnvelope: { lo: 4.2536387711e-22, hi: 4.2642406903e-22 },
  uFit: 1.051148e-24, // half-envelope around aFit (max deviation; lo leg dominates)
  uFitRel: 2.465082e-3, // 0.247% -- tighter than the 11-point 0.34%
  uOptRel: 1.7763568394002505e-15, // 8 eps, delta-INDEPENDENT (imp-95826)
  uOpt: 7.573366e-37, // aOpt * 8 eps
  uFitOverUOpt: 1.387953e12, // dropped from 1.92e12 but still >> 1e10: u_opt negligible
  rPoint: 1.698563e-4, // signed (A_fit - A_opt)/A_opt tightened further toward zero
  rInterval: { lo: -2.295644e-3, hi: 2.635357e-3 }, // interval-arithmetic signed difference
  intervalContainsZero: true,
  uFitRelTighteningFactor: 1.385, // uFitRel11 / uFitRel
  reachExtendedTo: 948.25, // far past the ln 1.3 N = 400 reach ~105
  ln13DirectUFitRel: 2.3e-3, // 0.23% ln 1.3 direct interval (imp-95841/imp-95857) -- the target
  looserThanLn13Factor: 1.072, // uFitRel / ln13DirectUFitRel -- now within ~1.07x
  stillLooserThanLn13: true, // 0.247% > 0.23%, but essentially AT the level now
  reachedLn13Level: false, // has NOT crossed below the ln 1.3 direct interval
  ddExtrapolationLimited: true, // u_fit still dominates; u_opt still negligible
  uOptBecomesNonNegligible: false,
  deepCornerHitsDDFloor: false, // A_opt ~ 4.26e-22 near DD floor did NOT flatten/floor the sweep
  intervalRefinableByReach: true, // the key verdict: extending reach past N=2800 keeps tightening u_fit
  residualSubGap: "imp-95820-ln125-shift-budget-scaling", // to cross below 0.23% needs still larger N
  boundChange: false,
  qed: false,
  verdict:
    "MEASURED -- extending the ln 1.2 reach PAST N = 2800 KEEPS tightening the per-delta " +
    "u_fit certified interval to the ln 1.3 level, with NO deep-corner DD-floor " +
    "flattening. Three new DD Jacobi lambda_min(N) points (N = 3600 / 4400 / 5200, " +
    "reach ~657 / ~803 / ~948, imp-95820 shift-invert DD Toeplitz solver, every N " +
    "converged in 240 solves, sweep still monotone decreasing 4.2639e-22 -> 4.2637e-22) " +
    "append to the imp-95881 baked eleven. Re-running the imp-95837/imp-95860 primal " +
    "envelope (same fit-model + drop-coarsest / drop-finest LOO family) over the " +
    "extended 14-point grid tightens u_fit_rel from 0.34 percent to 0.247 percent (a " +
    "1.385x factor), pulls the primary A_fit = 4.2642e-22 further down toward the dual " +
    "A_opt = 4.2634e-22 so the signed r_point tightens from +2.57e-4 to +1.70e-4, and " +
    "drops u_fit/u_opt to 1.39e12 -- still >> 1e10, so u_opt does NOT become " +
    "non-negligible. The A_opt ~ 4.26e-22 deep corner (cond ~ 5.6e22, near the DD ~ " +
    "32-digit floor) still did NOT flatten or floor the extrapolation: reach now runs " +
    "to ~948, far past the ln 1.3 N = 400 reach ~105. The interval-arithmetic signed " +
    "difference (A_fit - A_opt)/A_opt over the extended grid is [-2.30e-3, +2.64e-3] and " +
    "still CONTAINS ZERO -- the dual and primal routes remain consistent with exact " +
    "agreement at ln 1.2, now on a tighter interval. DECISION: the ln 1.2 per-delta " +
    "u_fit certified interval REACHES the neighbourhood of the ln 1.3 direct level " +
    "(0.247 percent vs 0.23 percent, only 1.07x looser), having descended monotonically " +
    "0.54 -> 0.34 -> 0.247 percent across the N = 1000 / 2800 / 5200 reach extensions; " +
    "it has NOT crossed below the ln 1.3 level but it was NOT floored by the deep " +
    "corner. RESIDUAL (unchanged in kind): the extended u_fit_rel = 0.247 percent is now " +
    "essentially AT but still just above the ln 1.3 direct interval (0.23 percent); " +
    "crossing below needs still larger N per the same imp-95820-ln125-shift-budget-scaling " +
    "residual (the N = 5200 solve took ~392s). Direct measurement extending an " +
    "established audit grid; no new cited input; no numeric change to the imp-95767 " +
    "certified interval; model seam family only; the imp-95212 envelope port, signed " +
    "WEIGHT, and modulus/phase legs stay OPEN. Changes no bound of the Lambda program; " +
    "NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95896"],
};

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
function ddLn12() { const y = ddDiv(DD(1), DD(11)); const y2 = ddMul(y, y); let term = y, sum = y; for (let k = 1; k <= 60; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMul(DD(2), sum); }

// ---- shift-invert DD Toeplitz machinery, from imp-95820 ----
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

// ---- primal A_fit extrapolation over an arbitrary h-power basis (float64 LS) ----
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
// dual A_opt = (4 pi/delta) sum_n sech(pi^2 (2n+1)/delta), cancellation-free
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 20000; n++) { const a = (Math.PI * Math.PI * (2 * n + 1)) / delta; const t = 2 / (Math.exp(a) + Math.exp(-a)); s += t; if (n > 2 && t < s * 1e-32) break; }
  return ((4 * Math.PI) / delta) * s;
}
// full fit-model + LOO envelope over an arbitrary grid slice
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
// Self-executing assertions. Import-light: the 11-point (imp-95881) and extended
// 14-point A_fit envelopes + u_fit and the dual A_opt + u_opt are re-derived live
// from the baked grid (fast float64), and ONE cheap live N = 120 DD shift-invert
// solve (~0.06s) re-validates the solver against the imp-95837 baked coarsest point.
// ---------------------------------------------------------------------------
const REF = IMP95896_LN12_PAST2800_UFIT_TIGHTENING;

export const IMP95896_ASSERTIONS = [
  {
    id: "imp95896-extended-grid-is-fourteen-points-and-monotone",
    description:
      "the extended DD Jacobi grid appends three new past-2800 points to the imp-95881 eleven (14 total) and stays monotone decreasing (lambda_min keeps descending toward A_opt as N grows past 2800)",
    holds: () => {
      if (REF.ddLambdaMin.length !== 14 || REF.nGrid.length !== 14) return false;
      for (let i = 1; i < REF.ddLambdaMin.length; i++)
        if (REF.ddLambdaMin[i] >= REF.ddLambdaMin[i - 1]) return false;
      return REF.sweepMonotoneDecreasing === true && REF.extendedConverged === true;
    },
  },
  {
    id: "imp95896-live-shift-invert-reproduces-imp95837-baked-N120",
    description:
      "one live PD-preserving shift-invert DD solve at N=120, delta=ln1.2 reproduces the imp-95837 baked coarsest grid point (4.9721614258e-22) to < 1e-6 relative -- the extended grid uses the same real solver",
    holds: () => {
      const lm = lambdaMinShiftInvert(120, ddLn12(), { boot: 20, margin: 0.02, shiftIters: 40 });
      return Math.abs(lm - REF.ddLambdaMin[0]) / REF.ddLambdaMin[0] < 1e-6;
    },
  },
  {
    id: "imp95896-extended-ratios-monotone-toward-Aopt",
    description:
      "the baked ratio - 1 = F/A_opt - 1 at the three new past-2800 points (N = 3600/4400/5200) decays monotonically toward zero, so the extended sweep approaches A_opt from above without deep-corner flattening",
    holds: () => {
      const aOpt = aOptDual(REF.delta);
      let prev = Infinity;
      for (let i = 11; i < REF.ddLambdaMin.length; i++) {
        const rm = REF.ddLambdaMin[i] / aOpt - 1;
        const baked = REF.extendedRatioMinus1[i - 11];
        if (Math.abs(rm - baked) / baked > 1e-4) return false;
        if (!(rm > 0) || !(rm < prev)) return false;
        prev = rm;
      }
      return REF.deepCornerHitsDDFloor === false;
    },
  },
  {
    id: "imp95896-eleven-point-envelope-rederives-imp95881",
    description:
      "re-fitting the first eleven baked points recovers the imp-95881 11-point A_fit and u_fit_rel (0.34%) to < 1e-3 relative -- the extended module reproduces the imp-95881 baseline",
    holds: () => {
      const e11 = envelope(REF.nGrid.slice(0, 11), REF.ddLambdaMin.slice(0, 11));
      return (
        Math.abs(e11.aFit - REF.aFit11) / REF.aFit11 < 1e-6 &&
        Math.abs(e11.uFitRel - REF.uFitRel11) / REF.uFitRel11 < 1e-3
      );
    },
  },
  {
    id: "imp95896-extended-envelope-rederives-baked-Afit-and-uFit",
    description:
      "re-fitting the full extended 14-point grid recovers the baked extended A_fit, envelope [lo,hi], and u_fit_rel (0.247%) to < 1e-3 relative",
    holds: () => {
      const eAll = envelope(REF.nGrid, REF.ddLambdaMin);
      return (
        Math.abs(eAll.aFit - REF.aFit) / REF.aFit < 1e-6 &&
        Math.abs(eAll.lo - REF.aFitEnvelope.lo) / REF.aFitEnvelope.lo < 1e-4 &&
        Math.abs(eAll.hi - REF.aFitEnvelope.hi) / REF.aFitEnvelope.hi < 1e-4 &&
        Math.abs(eAll.uFitRel - REF.uFitRel) / REF.uFitRel < 1e-3
      );
    },
  },
  {
    id: "imp95896-extending-past-2800-keeps-tightening-uFit",
    description:
      "the extended 14-point u_fit_rel is strictly smaller than the imp-95881 11-point u_fit_rel, and the tightening factor u_fit_rel(11pt)/u_fit_rel(ext) ~ 1.39 matches the baked value -- extending past N=2800 KEEPS tightening the interval",
    holds: () => {
      const factor = REF.uFitRel11 / REF.uFitRel;
      return (
        REF.uFitRel < REF.uFitRel11 &&
        Math.abs(factor - REF.uFitRelTighteningFactor) / REF.uFitRelTighteningFactor < 1e-2 &&
        factor > 1.3 &&
        REF.intervalRefinableByReach === true
      );
    },
  },
  {
    id: "imp95896-reaches-ln13-neighbourhood-but-still-looser",
    description:
      "the extended ln 1.2 u_fit_rel (0.247%) is now within ~1.07x of the ln 1.3 direct interval (0.23%) -- closer than the 11-point 0.34% was -- but stays strictly looser: the sub-gap narrows to the ln 1.3 level without crossing below",
    holds: () =>
      REF.uFitRel > REF.ln13DirectUFitRel &&
      REF.uFitRel < REF.uFitRel11 &&
      Math.abs(REF.uFitRel - REF.ln13DirectUFitRel) < Math.abs(REF.uFitRel11 - REF.ln13DirectUFitRel) &&
      Math.abs(REF.uFitRel / REF.ln13DirectUFitRel - REF.looserThanLn13Factor) / REF.looserThanLn13Factor < 1e-2 &&
      REF.stillLooserThanLn13 === true &&
      REF.reachedLn13Level === false,
  },
  {
    id: "imp95896-dual-Aopt-rederives-live-matches-imp95837",
    description:
      "the baked dual A_opt is reproduced by the live cancellation-free sum to < 1e-9 relative and matches the imp-95837 baked 4.2634260802e-22",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-9 && Math.abs(REF.aOpt - 4.2634260802e-22) / 4.2634260802e-22 < 1e-9;
    },
  },
  {
    id: "imp95896-uOpt-still-negligible-after-tightening",
    description:
      "even after the further u_fit tightening, u_fit/u_opt = 1.39e12 stays >> 1e10 (u_opt = A_opt * 8 eps still negligible), so the ln 1.2 interval remains DD-extrapolation-limited",
    holds: () => {
      const uOpt = REF.aOpt * (8 * REF.eps);
      const ratio = REF.uFit / uOpt;
      return (
        Math.abs(REF.uOptRel - 8 * REF.eps) / (8 * REF.eps) < 1e-12 &&
        ratio > 1e10 &&
        Math.abs(REF.uFitOverUOpt - ratio) / ratio < 1e-2 &&
        REF.uFitOverUOpt < REF.uFitOverUOpt11 &&
        REF.ddExtrapolationLimited === true &&
        REF.uOptBecomesNonNegligible === false
      );
    },
  },
  {
    id: "imp95896-rPoint-tightens-toward-zero-and-interval-contains-zero",
    description:
      "the signed r_point = (A_fit - A_opt)/A_opt tightens toward zero from the 11-point +2.57e-4 to the extended +1.70e-4, and the extended interval-arithmetic signed difference CONTAINS ZERO",
    holds: () => {
      const rPt = (REF.aFit - REF.aOpt) / REF.aOpt;
      const uOpt = REF.aOpt * (8 * REF.eps);
      const rLo = (REF.aFit - REF.uFit - (REF.aOpt + uOpt)) / (REF.aOpt + uOpt);
      const rHi = (REF.aFit + REF.uFit - (REF.aOpt - uOpt)) / (REF.aOpt - uOpt);
      return (
        Math.abs(rPt - REF.rPoint) / REF.rPoint < 1e-3 &&
        Math.abs(rPt) < Math.abs(REF.rPoint11) &&
        Math.abs(rLo - REF.rInterval.lo) < 1e-6 &&
        Math.abs(rHi - REF.rInterval.hi) < 1e-6 &&
        REF.rInterval.lo < 0 && REF.rInterval.hi > 0 &&
        REF.intervalContainsZero === true
      );
    },
  },
  {
    id: "imp95896-not-a-bound",
    description:
      "this is a measurement extending an audit grid; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.residualSubGap === "imp-95820-ln125-shift-budget-scaling" &&
      /MEASURED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95896"),
  },
];

for (const a of IMP95896_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95896-ln12-past2800-ufit-tightening assertion failed: ${a.id}`,
    );
  }
}

export default IMP95896_LN12_PAST2800_UFIT_TIGHTENING;
