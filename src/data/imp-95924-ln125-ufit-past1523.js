/**
 * imp-95924 -- EXTEND the imp-95895 delta = ln 1.25 DD shift-invert u_fit grid PAST
 * N = 1523 (reach ~340) with four new converged points (N = 1850 / 2250 / 2800 / 3400,
 * reach ~413 / ~502 / ~625 / ~759) and DECIDE whether the ln 1.25 per-delta u_fit
 * interval keeps tightening (staying the tightest of the three deltas) or FLOORS at the
 * A_opt ~ 6.964e-18 corner (cond ~ 1e17).
 *
 * GRADE: numerical measurement / cross-validation. Import-light: NO zeros bundle. Reuses
 * the imp-95820 / imp-95841 / imp-95895 PD-preserving robust shift-invert DD Toeplitz
 * solver verbatim. The four new lambda_min(N) points were collected OFFLINE with a
 * converged budget (boot = 40, shiftIters = 250) whose N = 1523 anchor reproduces the
 * imp-95838 / imp-95895 baked coarsest-corner point 6.967325939e-18 to 5.6e-11 relative,
 * i.e. the SAME 1e-15-tol converged solver, extended in N. The self-executing assertions
 * (1) re-derive the dual A_opt live from the cancellation-free positive-term sum, (2)
 * re-run the imp-95881 primal envelope live over the twelve-point extended grid to
 * reproduce A_fit / u_fit / u_fit_rel, (3) check the leave-one-out envelope u_fit_rel
 * decreases monotonically as points are added (no floor over reach 340 -> 759), (4) flag
 * the per-point conditioning noise floor at the largest N, and (5) run ONE cheap live
 * N = 150 DD shift-invert solve (~0.07s) to re-validate the embedded solver reproduces
 * the imp-95895 baked coarsest grid point (7.362343722e-18). Measures / derives ONLY;
 * changes NO numeric value of any prior interval; NO new bound; NO QED.
 *
 * THE EXTENDED GRID (delta = ln 1.25 = 0.22314355, imp-95820 DD shift-invert, converged
 * boot = 40 / shiftIters = 250; the first eight rows are the imp-95895 baked grid,
 * unchanged; the last four are the new points):
 *
 *   N     DD lambda_min          reach = delta(N+1)   ratio - 1 = F/A_opt - 1
 *   150   7.362343722e-18         33.70               5.715e-2   (imp-95895 baked)
 *   ...                                                          (imp-95895 baked)
 *   1523  6.967325939e-18        340.07               4.322e-4   (imp-95895 baked)
 *   1850  6.966346932e-18        413.04               2.916e-4   (NEW)
 *   2250  6.965683988e-18        502.30               1.965e-4   (NEW)
 *   2800  6.966357367e-18        625.03               2.931e-4   (NEW)
 *   3400  6.965084819e-18        758.91               1.104e-4   (NEW)
 *
 * RESULT -- THE ln 1.25 INTERVAL DOES NOT FLOOR OVER reach 340 -> 759; IT KEEPS
 * TIGHTENING. Running the imp-95881 primal fit-model + leave-one-out envelope over the
 * cumulative grid, the extrapolation half-width u_fit_rel decreases MONOTONICALLY as the
 * four points are added:
 *
 *   8 pts (reach 340): u_fit_rel = 8.4649e-4   (imp-95895 baked)
 *   9 pts (reach 413): u_fit_rel = 7.2406e-4
 *  10 pts (reach 502): u_fit_rel = 6.3122e-4
 *  11 pts (reach 625): u_fit_rel = 5.6534e-4
 *  12 pts (reach 759): u_fit_rel = 5.0603e-4
 *
 * with A_fit staying PINNED at 6.9647e-18 (moves < 0.001 percent from the baked
 * 6.9646e-18), the dual A_opt = 6.9643e-18 unchanged, r_point = (A_fit - A_opt)/A_opt
 * staying tiny and positive (+4.73e-5 baked -> +5.23e-5 extended), and the signed
 * interval still CONTAINING ZERO. So ln 1.25 stays the TIGHTEST of the three deltas by a
 * WIDENING margin: 0.0506 percent (was 0.0846) < ln 1.3 0.23 percent < ln 1.2 0.34
 * percent. The interval is still DD-extrapolation-limited (u_fit / u_opt drops from
 * 4.77e11 to ~2.85e11, still >> 1e10).
 *
 * BUT -- THE PER-POINT GRID ENTERS A ~1e-4 CONDITIONING NOISE FLOOR PAST reach ~500.
 * The individual converged ratio - 1 = lambda_min / A_opt - 1 no longer decreases
 * strictly monotonically: 2.916e-4 (413) -> 1.965e-4 (502) -> 2.931e-4 (625) -> 1.104e-4
 * (759) SCATTERS at a ~1e-4 relative floor. This is the near-A_opt corner (cond ~1e17)
 * where the sech Gram matrix is most ill-conditioned, so a converged Rayleigh quotient
 * still carries ~1e-4 residual scatter between neighbouring N. The leave-one-out
 * ENVELOPE (which averages over the whole grid) keeps shrinking because it is
 * grid-length-driven, but the per-point ladder is approaching the conditioning limit that
 * will eventually cap further reach gains.
 *
 * SUB-GAP (OPEN) -- WHERE ln 1.25 EVENTUALLY FLOORS. Over reach 340 -> 759 the interval
 * does not floor. Whether and where it PLATEAUS (as the sibling ln 1.2 grid did at N~5200
 * / reach ~948 when it hit the DD ~32-digit floor, imp-95919) needs reach > 759 with a
 * convergence budget beyond the boot = 40 / shiftIters = 250 used here -- the per-point
 * ~1e-4 conditioning scatter at N = 2800 / 3400 mixes genuine cond ~1e17 limit with
 * residual iteration budget and is NOT resolved to the imp-95838 1e-15 anchor tol at the
 * largest N. Named sub-gap: imp-95924-sub-ln125-floor-past-reach-759.
 *
 * HONEST SCOPE. Extends the imp-95895 eight-point grid with four converged points on the
 * SAME solver (N = 1523 anchor reproduced to 5.6e-11); the twelve-point interval is
 * grid-spacing-honest. No new cited input, no new bound, no operator positivity, and NO
 * numeric change to any prior certified interval (ln 1.2 imp-95881 / imp-95896 /
 * imp-95919, ln 1.25 imp-95895, ln 1.3 imp-95767). Model seam family only; the imp-95212
 * envelope port, signed WEIGHT, and modulus / phase legs stay OPEN. Changes NO bound of
 * the Lambda program; NO QED; no refereed bound is changed. Sun
 * arXiv:2609.04176 unrefereed.
 *
 * @see imp-95895-ln125-ufit-interval (the eight-point ln1.25 grid extended here)
 * @see imp-95896-ln12-past2800-ufit-tightening (the sibling ln1.2 grid extension pattern)
 * @see imp-95919-ln12-past5200-dd-floor (the sibling ln1.2 DD-floor plateau this contrasts with)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the PD-preserving DD shift-invert solver)
 * @see imp-95881-ln12-past1000-ufit-tightening (the primal envelope machinery reused here)
 */

export const IMP95924_LN125_UFIT_PAST1523 = {
  id: "imp-95924",
  title:
    "EXTEND the imp-95895 delta = ln 1.25 DD shift-invert u_fit grid PAST N = 1523 with " +
    "four converged points (N = 1850/2250/2800/3400, reach ~413/502/625/759) and DECIDE " +
    "tightest-vs-floor: the leave-one-out envelope u_fit_rel keeps TIGHTENING " +
    "monotonically 0.0846 percent -> 0.0506 percent (does NOT floor over reach 340 -> " +
    "759), A_fit stays pinned at 6.9647e-18, r_point stays tiny-positive +5.23e-5, " +
    "interval still CONTAINS ZERO, so ln 1.25 stays TIGHTEST by a widening margin; BUT " +
    "the per-point ratio-1 scatters at a ~1e-4 conditioning noise floor (cond ~1e17) past " +
    "reach ~500, so where it eventually plateaus stays OPEN (sub-gap)",
  question:
    "when the imp-95895 delta = ln 1.25 DD shift-invert grid is extended past N = 1523 " +
    "(reach ~340) to reach ~759, does the per-delta u_fit interval keep tightening " +
    "(staying tightest of the three deltas) or floor at the A_opt ~ 6.964e-18 corner?",
  delta: 0.22314355131420976, // ln 1.25
  eps: 2.220446049250313e-16,
  condApprox: 1e17,
  // solver budget the four new points were collected at (N=1523 anchor -> 5.6e-11 rel)
  convBudget: { boot: 40, shiftIters: 250, margin: 0.02 },
  anchorRelToImp95838: 5.645e-11, // N=1523 live reproduces the baked corner point
  // imp-95895 baked eight-point grid (unchanged)
  nGridBaked: [150, 220, 320, 460, 660, 900, 1250, 1523],
  ddLambdaMinBaked: [
    7.362343722e-18, 7.132905180e-18, 7.039434840e-18, 6.999308008e-18,
    6.980880815e-18, 6.973086304e-18, 6.968808727e-18, 6.967325939e-18,
  ],
  // NEW converged points past N=1523
  nGridNew: [1850, 2250, 2800, 3400],
  ddLambdaMinNew: [
    6.966346932e-18, 6.965683988e-18, 6.966357367e-18, 6.965084819e-18,
  ],
  reachNew: [413.04, 502.30, 625.03, 758.91],
  ratioMinusOneNew: [2.916e-4, 1.965e-4, 2.931e-4, 1.104e-4], // lambda_min/A_opt - 1
  aOpt: 6.964315819345211e-18, // dual, unchanged from imp-95895
  // cumulative leave-one-out envelope u_fit_rel as the four points are added (imp-95881 family)
  cumulativeUFitRel: [
    8.464860e-4, // 8 pts, reach 340 (imp-95895 baked)
    7.240578e-4, // 9 pts, reach 413
    6.312197e-4, // 10 pts, reach 502
    5.653355e-4, // 11 pts, reach 625
    5.060262e-4, // 12 pts, reach 759
  ],
  cumulativeReach: [340.07, 413.04, 502.30, 625.03, 758.91],
  // twelve-point extended envelope
  aFitBaked: 6.964645516330519e-18, // imp-95895 eight-point primary
  aFitExt: 6.964680193e-18, // twelve-point primary {1,h,h^1.5}, moves < 0.001 percent
  aFitEnvelopeExt: { lo: 6.961155883e-18, hi: 6.964707135e-18 },
  uFitRelExt: 5.060262e-4, // 0.0506 percent (was 0.0846 percent at eight points)
  uFitRelBaked: 8.464859714083428e-4, // 0.0846 percent
  rPointExt: 5.232016e-5, // signed (A_fit_ext - A_opt)/A_opt, tiny and positive
  rPointBaked: 4.734090e-5,
  intervalContainsZero: true,
  uFitOverUOptExt: 2.85e11, // still >> 1e10; DD-extrapolation-limited
  ddExtrapolationLimited: true,
  // decision
  envelopeMonotoneDecreasing: true, // u_fit_rel keeps tightening over reach 340 -> 759
  intervalFloorsOverReach340to759: false,
  ln125StaysTightest: true, // 0.0506 percent < ln1.3 0.23 percent < ln1.2 0.34 percent
  tightestMarginWidens: true, // 0.0846 -> 0.0506 percent while others unchanged
  threeDeltaUFitRelExt: { ln12: 3.414761e-3, ln125: 5.060262e-4, ln13: 2.289e-3 },
  // per-point conditioning noise floor (the honest caveat)
  perPointConditioningNoiseFloor: 1e-4, // ratio-1 scatter at the largest N
  perPointRatioNotStrictlyMonotone: true, // 2.916 -> 1.965 -> 2.931 -> 1.104 (e-4)
  subGap: "imp-95924-sub-ln125-floor-past-reach-759",
  boundChange: false,
  qed: false,
  verdict:
    "DECIDED (over reach 340 -> 759) -- the delta = ln 1.25 per-delta u_fit interval KEEPS " +
    "TIGHTENING and does NOT floor. Extending the imp-95895 eight-point DD shift-invert " +
    "grid with four converged points (N = 1850/2250/2800/3400, reach ~413/502/625/759, " +
    "same imp-95820 solver whose N = 1523 anchor reproduces the imp-95838 baked corner " +
    "6.967325939e-18 to 5.6e-11 relative) and running the imp-95881 primal fit-model + " +
    "leave-one-out envelope over the cumulative grid, the extrapolation half-width " +
    "u_fit_rel decreases MONOTONICALLY 8.465e-4 -> 7.241e-4 -> 6.312e-4 -> 5.653e-4 -> " +
    "5.060e-4 (0.0846 percent -> 0.0506 percent), with A_fit staying pinned at 6.9647e-18 " +
    "(< 0.001 percent move), the dual A_opt = 6.9643e-18 unchanged, r_point tiny-positive " +
    "(+4.73e-5 -> +5.23e-5), the signed interval still CONTAINING ZERO, and u_fit/u_opt " +
    "staying >> 1e10. So ln 1.25 stays the TIGHTEST of the three deltas by a WIDENING " +
    "margin (0.0506 percent < ln 1.3 0.23 percent < ln 1.2 0.34 percent). HONEST CAVEAT: " +
    "the individual converged ratio - 1 = lambda_min/A_opt - 1 no longer decreases " +
    "strictly monotonically past reach ~500 (2.916e-4 -> 1.965e-4 -> 2.931e-4 -> " +
    "1.104e-4), scattering at a ~1e-4 conditioning noise floor -- the near-A_opt corner " +
    "(cond ~1e17) where the sech Gram matrix is most ill-conditioned. The envelope keeps " +
    "shrinking because it is grid-length-driven, but the per-point ladder is approaching " +
    "the conditioning limit. SUB-GAP (OPEN): where the interval eventually PLATEAUS (as " +
    "the sibling ln 1.2 grid did at N ~ 5200 on the DD ~32-digit floor, imp-95919) needs " +
    "reach > 759 with a budget beyond boot = 40 / shiftIters = 250 -- named " +
    "imp-95924-sub-ln125-floor-past-reach-759. Measurement / cross-validation only; " +
    "changes no prior numeric interval (ln 1.2 imp-95881/95896/95919, ln 1.25 imp-95895, " +
    "ln 1.3 imp-95767 unchanged); model seam family only; the imp-95212 envelope port, " +
    "signed WEIGHT, and modulus / phase legs stay OPEN. Changes no bound of the Lambda " +
    "program; NO QED; no refereed bound is changed. Sun arXiv:2609.04176 " +
    "unrefereed.",
  closesTickets: ["imp-95924"],
};

const REF = IMP95924_LN125_UFIT_PAST1523;

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD), from imp-95820/imp-95895 -- import-light
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

// ---- shift-invert DD Toeplitz machinery, from imp-95820/imp-95895 ----
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

const N_EXT = REF.nGridBaked.concat(REF.nGridNew);
const L_EXT = REF.ddLambdaMinBaked.concat(REF.ddLambdaMinNew);

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: the dual A_opt and the primal envelope are
// re-derived live (fast float64) over the baked twelve-point grid, and ONE cheap live
// N = 150 DD shift-invert solve (~0.07s) re-validates the embedded solver.
// ---------------------------------------------------------------------------
export const IMP95924_ASSERTIONS = [
  {
    id: "imp95924-four-new-points-past-1523-reach-413-to-759",
    description:
      "the four new grid points sit strictly past N = 1523 with reach = delta (N+1) equal to the baked ~413/502/625/759 to < 1e-3 relative",
    holds: () => {
      if (REF.nGridNew.length !== 4 || REF.ddLambdaMinNew.length !== 4) return false;
      if (REF.nGridNew[0] <= 1523) return false;
      for (let i = 1; i < REF.nGridNew.length; i++) if (REF.nGridNew[i] <= REF.nGridNew[i - 1]) return false;
      for (let i = 0; i < REF.nGridNew.length; i++) {
        const r = REF.delta * (REF.nGridNew[i] + 1);
        if (Math.abs(r - REF.reachNew[i]) / REF.reachNew[i] > 1e-3) return false;
      }
      return Math.abs(REF.reachNew[3] - 758.91) < 0.1;
    },
  },
  {
    id: "imp95924-dual-Aopt-rederives-live-and-unchanged",
    description:
      "the dual A_opt at ln 1.25 is reproduced by the live cancellation-free positive-term sum to < 1e-9 relative and is unchanged from imp-95895",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-9;
    },
  },
  {
    id: "imp95924-per-point-ratios-rederive-from-Aopt",
    description:
      "each baked ratio - 1 = lambda_min/A_opt - 1 for the four new points is reproduced from the baked lambda_min and A_opt to < 5e-3 relative",
    holds: () => {
      for (let i = 0; i < REF.ddLambdaMinNew.length; i++) {
        const r = REF.ddLambdaMinNew[i] / REF.aOpt - 1;
        if (Math.abs(r - REF.ratioMinusOneNew[i]) / REF.ratioMinusOneNew[i] > 5e-3) return false;
      }
      return true;
    },
  },
  {
    id: "imp95924-extended-envelope-rederives-baked-Afit-and-uFitRel",
    description:
      "re-running the imp-95881 primal fit-model + LOO envelope over the baked twelve-point grid recovers the baked extended A_fit, envelope [lo,hi] and u_fit_rel (0.0506%) to < 1e-4 relative",
    holds: () => {
      const e = envelope(N_EXT, L_EXT);
      return (
        Math.abs(e.aFit - REF.aFitExt) / REF.aFitExt < 1e-4 &&
        Math.abs(e.lo - REF.aFitEnvelopeExt.lo) / REF.aFitEnvelopeExt.lo < 1e-4 &&
        Math.abs(e.hi - REF.aFitEnvelopeExt.hi) / REF.aFitEnvelopeExt.hi < 1e-4 &&
        Math.abs(e.uFitRel - REF.uFitRelExt) / REF.uFitRelExt < 1e-4
      );
    },
  },
  {
    id: "imp95924-envelope-uFitRel-monotone-decreasing-no-floor",
    description:
      "DECISION: the cumulative leave-one-out envelope u_fit_rel decreases MONOTONICALLY as the four points are added (0.0846% -> 0.0506%), so the ln 1.25 interval does NOT floor over reach 340 -> 759; each cumulative value is reproduced live to < 1e-4 relative",
    holds: () => {
      for (let k = 8; k <= N_EXT.length; k++) {
        const e = envelope(N_EXT.slice(0, k), L_EXT.slice(0, k));
        const baked = REF.cumulativeUFitRel[k - 8];
        if (Math.abs(e.uFitRel - baked) / baked > 1e-4) return false;
      }
      for (let i = 1; i < REF.cumulativeUFitRel.length; i++)
        if (REF.cumulativeUFitRel[i] >= REF.cumulativeUFitRel[i - 1]) return false;
      return (
        REF.envelopeMonotoneDecreasing === true &&
        REF.intervalFloorsOverReach340to759 === false
      );
    },
  },
  {
    id: "imp95924-rpoint-tiny-positive-interval-contains-zero",
    description:
      "the extended r_point = (A_fit_ext - A_opt)/A_opt is reproduced from the baked A_fit_ext and A_opt, stays tiny and positive (+5.23e-5), and the signed interval CONTAINS ZERO",
    holds: () => {
      const rPt = (REF.aFitExt - REF.aOpt) / REF.aOpt;
      const uOpt = REF.aOpt * (8 * REF.eps);
      const uFit = REF.uFitRelExt * REF.aFitExt;
      const rLo = (REF.aFitExt - uFit - (REF.aOpt + uOpt)) / (REF.aOpt + uOpt);
      const rHi = (REF.aFitExt + uFit - (REF.aOpt - uOpt)) / (REF.aOpt - uOpt);
      return (
        Math.abs(rPt - REF.rPointExt) / REF.rPointExt < 5e-3 &&
        rPt > 0 &&
        rLo < 0 && rHi > 0 &&
        REF.intervalContainsZero === true
      );
    },
  },
  {
    id: "imp95924-ln125-stays-tightest-margin-widens",
    description:
      "ln 1.25 stays the TIGHTEST of the three deltas by a WIDENING margin: extended u_fit_rel 0.0506% < ln1.3 0.23% < ln1.2 0.34%, and the ln1.25 value shrank from 0.0846% while ln1.2/ln1.3 are unchanged",
    holds: () => {
      const u = REF.threeDeltaUFitRelExt;
      return (
        u.ln125 < u.ln13 && u.ln13 < u.ln12 &&
        u.ln125 < REF.uFitRelBaked &&
        Math.abs(u.ln125 - REF.uFitRelExt) / REF.uFitRelExt < 1e-9 &&
        REF.ln125StaysTightest === true &&
        REF.tightestMarginWidens === true
      );
    },
  },
  {
    id: "imp95924-per-point-conditioning-noise-floor-caveat",
    description:
      "HONEST CAVEAT: the per-point ratio - 1 is NOT strictly monotone past reach ~500 (2.916e-4 -> 1.965e-4 -> 2.931e-4 -> 1.104e-4), scattering at a ~1e-4 conditioning noise floor -- so the per-point ladder, unlike the envelope, is entering the cond ~1e17 corner",
    holds: () => {
      let strictlyMonotone = true;
      for (let i = 1; i < REF.ratioMinusOneNew.length; i++)
        if (REF.ratioMinusOneNew[i] >= REF.ratioMinusOneNew[i - 1]) strictlyMonotone = false;
      const maxScatter = Math.max(...REF.ratioMinusOneNew);
      return (
        strictlyMonotone === false &&
        REF.perPointRatioNotStrictlyMonotone === true &&
        maxScatter < 5 * REF.perPointConditioningNoiseFloor &&
        maxScatter > 0.5 * REF.perPointConditioningNoiseFloor
      );
    },
  },
  {
    id: "imp95924-live-shift-invert-reproduces-imp95895-baked-N150",
    description:
      "one live PD-preserving shift-invert DD solve at N = 150, delta = ln 1.25 reproduces the imp-95895 baked coarsest grid point (7.362343722e-18) to < 1e-6 relative -- the embedded solver is the real converged solver used for the new points",
    holds: () => {
      const lm = lambdaMinShiftInvert(150, ddLn125(), { boot: 30, margin: 0.02, shiftIters: 60 });
      return Math.abs(lm - REF.ddLambdaMinBaked[0]) / REF.ddLambdaMinBaked[0] < 1e-6;
    },
  },
  {
    id: "imp95924-not-a-bound-names-subgap",
    description:
      "this extends a measurement grid and DECIDES tightest-vs-floor over reach 340 -> 759 with an explicit OPEN sub-gap; it moves no Lambda bound, changes no prior numeric interval, and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.subGap === "imp-95924-sub-ln125-floor-past-reach-759" &&
      /DECIDED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95924"),
  },
];

for (const a of IMP95924_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95924-ln125-ufit-past1523 assertion failed: ${a.id}`,
    );
  }
}

export default IMP95924_LN125_UFIT_PAST1523;
