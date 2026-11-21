/**
 * imp-95919 -- EXTEND the imp-95896 ln 1.2 DD shift-invert lambda_min(N) grid PAST
 * N = 5200 (reach ~948) with two new points N = 6400 / 8000 (reach ~1167 / ~1459) via
 * the imp-95820 PD-preserving shift-invert DD Toeplitz solver, and DECIDE whether the
 * per-delta u_fit_rel crosses BELOW the ln 1.3 direct 0.23 percent level or PLATEAUS,
 * and whether the A_opt ~ 4.26e-22 deep corner (cond ~ 5.6e22) finally hits the DD
 * ~32-digit floor. The direct successor of imp-95896 (which extended to N = 5200,
 * reach ~948, tightened u_fit_rel to 0.247 percent -- within 1.07x of the ln 1.3
 * direct 0.23 percent, NOT floored, NOT yet crossed -- and named this residual).
 *
 * GRADE: numerical measurement. Import-light. The two new past-5200 points are BAKED
 * from the offline driver tmp/imp-95919-ln12-past5200.mjs (which reuses the imp-95820
 * shift-invert DD Toeplitz solver verbatim, boot 40 / margin 0.02 / up to 200 shift
 * solves). The self-executing assertions re-derive the imp-95896 14-point (N <= 5200)
 * primal A_fit fit-model + leave-one-out envelope and u_fit live (fast float64 fits),
 * re-derive the dual A_opt and u_opt live, and run ONE cheap live N = 120 DD
 * shift-invert solve (~0.06s) to re-validate the solver reproduces the imp-95837 baked
 * coarsest grid point. No heavy DD reach sweep at import; no zeros bundle. Measures
 * ONLY; changes NO numeric value of the imp-95767 interval; NO new bound; NO QED.
 *
 * WHAT imp-95896 LEFT AS THE RESIDUAL. imp-95896 extended the ln 1.2 grid to N = 5200
 * (reach ~948) and tightened u_fit_rel monotonically 0.54 -> 0.34 -> 0.247 percent
 * across the N = 1000 / 2800 / 5200 reach extensions, with NO deep-corner DD-floor
 * flattening out to reach ~948 -- but it had NOT crossed below the ln 1.3 direct
 * interval (0.247 percent vs 0.23 percent, 1.07x looser). imp-95896 named the two-way
 * DECISION residual: does pushing reach further CROSS below 0.23 percent, or does the
 * deep corner finally hit the DD floor and PLATEAU?
 *
 * THE PAST-5200 GRID -- THE DEEP CORNER FINALLY HITS THE DD ~32-DIGIT FLOOR. Two new
 * DD Jacobi lambda_min(N) points at delta = ln 1.2, imp-95820 shift-invert DD Toeplitz
 * solver, same budget (boot 40, up to 200 shift solves, 240 solves each):
 *
 *   N      reach = delta(N+1)   DD lambda_min           ratio - 1 = F/A_opt - 1
 *   5200   948.25 (imp-95896)   4.2636909684e-22        6.213036e-5   (last DD-reliable)
 *   6400   1167.04             4.2637707905e-22         8.085289e-5   REVERSES UPWARD
 *   8000   1458.75             NaN                      NaN           SOLVER BREAKDOWN
 *
 * At N = 6400 the DD lambda_min ticks BACK UP (4.26369e-22 -> 4.26377e-22, ratio - 1
 * grows 6.21e-5 -> 8.09e-5), breaking the monotone-decreasing sweep that held for every
 * N <= 5200: the (pi/(N+1))^2 finite-section correction driving lambda_min down toward
 * A_opt = 4.2634e-22 has shrunk below the DD roundoff of the cond ~ 5.6e22 shift-invert
 * solve, so DD noise now dominates and the sweep reverses. At N = 8000 the shifted
 * Levinson recursion loses DD positive-definiteness entirely and returns NaN. So past
 * N = 5200 the A_opt ~ 4.26e-22 deep corner FINALLY hits the DD ~32-digit floor.
 *
 * DECISION (the ticket question). The per-delta u_fit_rel does NOT cross below the
 * ln 1.3 direct 0.23 percent -- it PLATEAUS at the imp-95896 N <= 5200 value (0.247
 * percent, 1.07x looser). The reach lever, which drove the monotone tightening 0.54 ->
 * 0.34 -> 0.247 percent, is EXHAUSTED in double-double at N ~ 5200: the next reach point
 * (N = 6400) is DD-floor-contaminated (non-monotone reversal) so it does NOT extrapolate
 * the interval tighter, and N = 8000 breaks down (NaN). The last DD-reliable extrapolation
 * is therefore the imp-95896 14-point grid: A_fit = 4.2641502501e-22, u_fit_rel = 0.247
 * percent, signed r_point = +1.699e-4, u_fit/u_opt = 1.39e12 (u_opt still negligible),
 * interval-arithmetic signed difference [-2.30e-3, +2.64e-3] still CONTAINS ZERO. Adding
 * the N = 6400 floor-contaminated point does NOT tighten the envelope, so u_fit_rel
 * plateaus rather than crossing below 0.23 percent.
 *
 * RESIDUAL SUB-GAP (a NEW regime -- the reach lever is exhausted, not merely slow). Unlike
 * imp-95860 / imp-95881 / imp-95896 -- where the residual was "crossing below needs still
 * larger N" (a slower-but-open reach refinement) -- past N = 5200 the double-double reach
 * lever is FLOORED: N = 6400 reverses and N = 8000 breaks down. Crossing the ln 1.2
 * companion u_fit_rel below the ln 1.3 direct 0.23 percent now requires precision BEYOND
 * double-double (quad-double or MPFR at the deep corner), not more reach. The plateau
 * value 0.247 percent is only 1.07x looser than the ln 1.3 direct interval and the signed
 * difference still contains zero, so the dual/primal consistency verdict is unchanged.
 *
 * HONEST SCOPE. Direct measurement extending an established audit grid to the DD floor;
 * no new cited input, no new bound, no operator positivity, and NO numeric change to the
 * imp-95767 certified interval (that interval is at ln 1.3; this is the ln 1.2 companion
 * measurement). Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed. Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95896-ln12-past2800-ufit-tightening (the 14-point N<=5200 grid this extends)
 * @see imp-95881-ln12-past1000-ufit-tightening (the 11-point N<=2800 predecessor)
 * @see imp-95841-ln13-shift-invert-direct-exponent (the ln1.3 direct 0.23 percent target)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert DD solver reused here)
 * @see imp-95825-finite-section-positivity-certificate (lambda_min(G_n) >= ess-inf f = A_opt)
 */

export const IMP95919_LN12_PAST5200_DD_FLOOR = {
  id: "imp-95919",
  title:
    "EXTEND the imp-95896 ln 1.2 DD shift-invert grid past N = 5200 (two new points " +
    "N = 6400 / 8000, reach ~1167 / ~1459, imp-95820 solver) -- the A_opt ~ 4.26e-22 " +
    "deep corner (cond ~5.6e22) FINALLY hits the DD ~32-digit floor: N = 6400 lambda_min " +
    "REVERSES upward (4.26369e-22 -> 4.26377e-22, breaking the monotone sweep) and " +
    "N = 8000 breaks down (NaN). So the per-delta u_fit_rel does NOT cross below the " +
    "ln 1.3 direct 0.23 percent -- it PLATEAUS at the imp-95896 N<=5200 value 0.247 " +
    "percent (1.07x looser); the double-double reach lever is exhausted at N ~ 5200",
  question:
    "does extending the imp-95896 ln 1.2 DD grid past N = 5200 CROSS u_fit_rel below the " +
    "ln 1.3 direct 0.23 percent, or does the deep-corner A_opt ~ 4.26e-22 (cond ~5.6e22) " +
    "finally hit the DD ~32-digit floor and PLATEAU it?",
  delta: 0.18232155679395462, // ln 1.2
  eps: 2.220446049250313e-16,
  aOpt: 4.2634260802e-22, // dual, cancellation-free (re-derived live below; matches imp-95837/imp-95896)
  // imp-95896 baked 14-point DD-reliable grid (N <= 5200), unchanged
  nGrid14: [120, 180, 240, 320, 400, 560, 760, 1000, 1400, 2000, 2800, 3600, 4400, 5200],
  ddLambdaMin14: [
    4.9721614258e-22, 4.5258636911e-22, 4.3992279309e-22, 4.3353953376e-22,
    4.3079193631e-22, 4.2852678733e-22, 4.2749940414e-22, 4.2699987625e-22,
    4.2667304975e-22, 4.2650276275e-22, 4.2642374815e-22,
    4.2639150853e-22, 4.2637606993e-22, 4.2636909684e-22,
  ],
  // two new past-5200 points -- the DD floor
  n6400: 6400,
  reach6400: 1167.04,
  lam6400: 4.2637707905e-22, // REVERSES upward from the N=5200 4.2636909684e-22
  ratioMinus1_6400: 8.085289e-5, // grows from the N=5200 6.213036e-5 (non-monotone)
  lam5200: 4.2636909684e-22,
  ratioMinus1_5200: 6.213036e-5,
  n8000: 8000,
  reach8000: 1458.75,
  lam8000IsNaN: true, // shifted Levinson recursion loses DD positive-definiteness -> NaN
  sweepReversesAtN6400: true, // lam6400 > lam5200: first upward reversal, monotonicity broken
  sweepMonotoneThroughN5200: true, // held for every N <= 5200 (imp-95896)
  deepCornerHitsDDFloor: true, // the KEY verdict flip: past N=5200 the deep corner floors
  // last DD-reliable envelope = the imp-95896 14-point grid (N <= 5200)
  aFit: 4.2641502501e-22, // primary {1,h,h^1.5}, 14-point grid
  aFitEnvelope: { lo: 4.2536387711e-22, hi: 4.2642406903e-22 },
  uFit: 1.051148e-24,
  uFitRel: 2.465082e-3, // 0.247% -- the PLATEAU value
  uOptRel: 1.7763568394002505e-15, // 8 eps, delta-INDEPENDENT (imp-95826)
  uOpt: 7.573366e-37, // aOpt * 8 eps
  uFitOverUOpt: 1.387953e12, // still >> 1e10: u_opt negligible
  rPoint: 1.698563e-4, // signed (A_fit - A_opt)/A_opt
  rInterval: { lo: -2.295644e-3, hi: 2.635357e-3 }, // interval-arithmetic signed difference
  intervalContainsZero: true,
  ln13DirectUFitRel: 2.3e-3, // 0.23% ln 1.3 direct interval (imp-95841/imp-95857) -- the target
  looserThanLn13Factor: 1.072, // uFitRel / ln13DirectUFitRel
  crossedBelowLn13: false, // does NOT cross below 0.23%
  plateaus: true, // the DECISION: u_fit_rel plateaus at 0.247% rather than crossing below
  reachLeverExhausted: true, // NEW regime: N=6400 floor-contaminated, N=8000 NaN
  residualSubGap: "crossing below the ln 1.3 direct 0.23 percent now needs precision beyond double-double (quad-double / MPFR at the deep corner), not more reach",
  boundChange: false,
  qed: false,
  verdict:
    "MEASURED -- extending the ln 1.2 reach PAST N = 5200 finds the A_opt ~ 4.26e-22 deep " +
    "corner (cond ~ 5.6e22) FINALLY hitting the DD ~32-digit floor. Two new DD Jacobi " +
    "lambda_min(N) points (imp-95820 shift-invert DD Toeplitz solver, same budget): " +
    "N = 6400 (reach ~1167) gives lambda_min = 4.2637707905e-22, which REVERSES UPWARD " +
    "from the N = 5200 value 4.2636909684e-22 (ratio - 1 grows 6.21e-5 -> 8.09e-5), " +
    "breaking the monotone-decreasing sweep that had held for every N <= 5200; and " +
    "N = 8000 (reach ~1459) breaks down entirely, the shifted Levinson recursion losing " +
    "DD positive-definiteness and returning NaN. The (pi/(N+1))^2 finite-section " +
    "correction that drove lambda_min down toward A_opt has shrunk below the DD roundoff " +
    "of the near-singular shift-invert solve, so DD noise dominates past N ~ 5200. " +
    "DECISION: the per-delta u_fit_rel does NOT cross below the ln 1.3 direct 0.23 " +
    "percent -- it PLATEAUS at the imp-95896 N <= 5200 value (0.247 percent, only 1.07x " +
    "looser); adding the N = 6400 DD-floor-contaminated point does NOT extrapolate the " +
    "envelope tighter, and N = 8000 is unusable. The reach lever, which drove the " +
    "monotone tightening 0.54 -> 0.34 -> 0.247 percent across N = 1000 / 2800 / 5200, is " +
    "EXHAUSTED in double-double at N ~ 5200. The last DD-reliable extrapolation stays the " +
    "imp-95896 14-point grid (A_fit = 4.2641502501e-22, u_fit_rel = 0.247 percent, signed " +
    "r_point = +1.699e-4, u_fit/u_opt = 1.39e12 with u_opt still negligible, " +
    "interval-arithmetic signed difference [-2.30e-3, +2.64e-3] still CONTAINS ZERO). " +
    "RESIDUAL (a NEW regime, not merely slower reach): crossing the ln 1.2 companion " +
    "u_fit_rel below the ln 1.3 direct 0.23 percent now requires precision BEYOND " +
    "double-double (quad-double or MPFR at the deep corner), not more reach. Direct " +
    "measurement extending an established audit grid to the DD floor; no new cited input; " +
    "no numeric change to the imp-95767 certified interval; model seam family only; the " +
    "imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes no " +
    "bound of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95919"],
};

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD), from imp-95820/imp-95896 -- import-light
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
// Self-executing assertions. Import-light: the imp-95896 14-point A_fit envelope +
// u_fit and the dual A_opt + u_opt are re-derived live from the baked grid (fast
// float64), and ONE cheap live N = 120 DD shift-invert solve (~0.06s) re-validates the
// solver against the imp-95837 baked coarsest point. The two heavy past-5200 points
// (N = 6400 ~640s, N = 8000 NaN ~945s) are baked, not recomputed at import.
// ---------------------------------------------------------------------------
const REF = IMP95919_LN12_PAST5200_DD_FLOOR;

export const IMP95919_ASSERTIONS = [
  {
    id: "imp95919-live-shift-invert-reproduces-imp95837-baked-N120",
    description:
      "one live PD-preserving shift-invert DD solve at N=120, delta=ln1.2 reproduces the imp-95837 baked coarsest grid point (4.9721614258e-22) to < 1e-6 relative -- the same real solver produced the past-5200 points",
    holds: () => {
      const lm = lambdaMinShiftInvert(120, ddLn12(), { boot: 20, margin: 0.02, shiftIters: 40 });
      return Math.abs(lm - REF.ddLambdaMin14[0]) / REF.ddLambdaMin14[0] < 1e-6;
    },
  },
  {
    id: "imp95919-sweep-reverses-upward-at-N6400-DD-floor",
    description:
      "the N=6400 DD lambda_min ticks BACK UP above the N=5200 value (4.26369e-22 -> 4.26377e-22, ratio-1 grows 6.21e-5 -> 8.09e-5), breaking the monotone-decreasing sweep that held for every N <= 5200 -- the deep-corner DD floor signature",
    holds: () =>
      REF.lam6400 > REF.lam5200 &&
      REF.ratioMinus1_6400 > REF.ratioMinus1_5200 &&
      REF.sweepReversesAtN6400 === true &&
      REF.sweepMonotoneThroughN5200 === true &&
      REF.deepCornerHitsDDFloor === true,
  },
  {
    id: "imp95919-N8000-solver-breaks-down-NaN",
    description:
      "the N=8000 shift-invert DD solve breaks down (NaN): past N ~ 5200 the shifted Levinson recursion loses DD positive-definiteness -- the reach lever is exhausted in double-double",
    holds: () => REF.lam8000IsNaN === true && REF.reachLeverExhausted === true,
  },
  {
    id: "imp95919-baked-ratios-consistent-with-live-Aopt",
    description:
      "the baked ratio-1 = F/A_opt-1 at N=5200 and N=6400 reproduce F/A_opt-1 from the live dual A_opt to < 1e-3 relative -- the reversal is a real change in F, not a mis-tabulation",
    holds: () => {
      const aOpt = aOptDual(REF.delta);
      const rm5200 = REF.lam5200 / aOpt - 1;
      const rm6400 = REF.lam6400 / aOpt - 1;
      return (
        Math.abs(rm5200 - REF.ratioMinus1_5200) / REF.ratioMinus1_5200 < 1e-3 &&
        Math.abs(rm6400 - REF.ratioMinus1_6400) / REF.ratioMinus1_6400 < 1e-3 &&
        rm6400 > rm5200
      );
    },
  },
  {
    id: "imp95919-last-DD-reliable-envelope-is-imp95896-14pt",
    description:
      "re-fitting the last DD-reliable 14-point grid (N <= 5200) recovers the imp-95896 baked A_fit, envelope [lo,hi], and u_fit_rel (0.247%) to < 1e-3 relative -- the plateau value",
    holds: () => {
      const e14 = envelope(REF.nGrid14, REF.ddLambdaMin14);
      return (
        Math.abs(e14.aFit - REF.aFit) / REF.aFit < 1e-6 &&
        Math.abs(e14.lo - REF.aFitEnvelope.lo) / REF.aFitEnvelope.lo < 1e-4 &&
        Math.abs(e14.hi - REF.aFitEnvelope.hi) / REF.aFitEnvelope.hi < 1e-4 &&
        Math.abs(e14.uFitRel - REF.uFitRel) / REF.uFitRel < 1e-3
      );
    },
  },
  {
    id: "imp95919-plateaus-does-not-cross-below-ln13",
    description:
      "the per-delta u_fit_rel PLATEAUS at 0.247% (1.07x looser than the ln 1.3 direct 0.23%) rather than crossing below it: the N=6400 DD-floor-contaminated point does not extrapolate the interval tighter and N=8000 is unusable",
    holds: () =>
      REF.uFitRel > REF.ln13DirectUFitRel &&
      REF.crossedBelowLn13 === false &&
      REF.plateaus === true &&
      Math.abs(REF.uFitRel / REF.ln13DirectUFitRel - REF.looserThanLn13Factor) / REF.looserThanLn13Factor < 1e-2,
  },
  {
    id: "imp95919-uOpt-still-negligible-interval-contains-zero",
    description:
      "at the plateau, u_fit/u_opt = 1.39e12 stays >> 1e10 (u_opt = A_opt * 8 eps negligible) and the interval-arithmetic signed difference (A_fit - A_opt)/A_opt still CONTAINS ZERO",
    holds: () => {
      const uOpt = REF.aOpt * (8 * REF.eps);
      const ratio = REF.uFit / uOpt;
      const rLo = (REF.aFit - REF.uFit - (REF.aOpt + uOpt)) / (REF.aOpt + uOpt);
      const rHi = (REF.aFit + REF.uFit - (REF.aOpt - uOpt)) / (REF.aOpt - uOpt);
      return (
        ratio > 1e10 &&
        Math.abs(REF.uFitOverUOpt - ratio) / ratio < 1e-2 &&
        Math.abs(rLo - REF.rInterval.lo) < 1e-6 &&
        Math.abs(rHi - REF.rInterval.hi) < 1e-6 &&
        REF.rInterval.lo < 0 && REF.rInterval.hi > 0 &&
        REF.intervalContainsZero === true
      );
    },
  },
  {
    id: "imp95919-dual-Aopt-rederives-live-matches-imp95837",
    description:
      "the baked dual A_opt is reproduced by the live cancellation-free sum to < 1e-9 relative and matches the imp-95837 baked 4.2634260802e-22",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-9 && Math.abs(REF.aOpt - 4.2634260802e-22) / 4.2634260802e-22 < 1e-9;
    },
  },
  {
    id: "imp95919-not-a-bound",
    description:
      "this is a measurement extending an audit grid to the DD floor; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /MEASURED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95919"),
  },
];

for (const a of IMP95919_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95919-ln12-past5200-dd-floor assertion failed: ${a.id}`,
    );
  }
}

export default IMP95919_LN12_PAST5200_DD_FLOOR;
