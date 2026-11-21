/**
 * imp-95837 -- build the missing >= 4-point DD Jacobi lambda_min(N) extrapolation
 * grid at the deep-corner delta = ln 1.2, recompute the primal A_fit envelope, and
 * tabulate u_fit / u_opt to decide DIRECTLY whether the imp-95767 dual-vs-primal
 * certified-interval structure is DD-extrapolation-limited there (the imp-95826
 * sub-gap imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit).
 *
 * GRADE: numerical measurement + envelope re-derivation. Import-light. The five DD
 * Jacobi lambda_min(N) values are BAKED from the offline driver
 * tmp/imp-95837-ln12-dd-grid.mjs (which reuses the imp-95820 PD-preserving
 * shift-invert DD Toeplitz machinery verbatim). The self-executing assertions
 * (1) re-derive the primal A_fit fit-model + leave-one-out envelope and u_fit from
 * the baked grid live (fast float64 fits), (2) re-derive the dual A_opt and u_opt
 * live, and (3) run ONE cheap live N=120 DD shift-invert solve (~0.06s) to
 * re-validate the solver reproduces the baked coarsest grid point. No heavy DD
 * reach sweep at import; no zeros bundle. Measures ONLY; changes NO numeric value
 * of the imp-95767 interval; NO new bound; NO QED.
 *
 * WHAT imp-95826 LEFT AS THE SUB-GAP. imp-95826 audited the imp-95767 dual-vs-primal
 * certified interval per delta and found the u_opt-negligible half holds at ALL three
 * worked deltas (the dual tail sits below the 8-ULP float64 floor everywhere, so
 * u_opt_rel = 8 eps is delta-INDEPENDENT), and the u_fit-dominated half is DIRECTLY
 * confirmed at ln 1.3 (5-point proper envelope, u_fit/u_opt ~ 1.29e12) and ln 1.5
 * (reach-spread surrogate, ~4.3e10). But at ln 1.2 only a TWO-point DD probe existed
 * (N = {120,200}), too few for the 3-parameter {1,h,h^1.5} fit (needs >= 3) or the
 * leave-one-out envelope (needs >= 4), so u_fit was NOT recomputable and the
 * u_fit-dominated half at ln 1.2 was only EXPECTED (via the imp-95761 reach-
 * universality), not directly baked. This module builds the missing grid.
 *
 * THE GRID. A 5-point DD Jacobi lambda_min(N) grid at delta = ln 1.2 on the same
 * N = {120,180,240,320,400} structure imp-95767 used at ln 1.3, computed with the
 * imp-95820 shift-invert DD Toeplitz solver (boot 40 / shift 120; the ln 1.2 bottom
 * eigenvalue ~ 4.3e-22 is well within its budget; every N converged, the sweep is
 * monotone decreasing):
 *
 *   N     reach = delta(N+1)   DD lambda_min
 *   120   22.06               4.9721614258e-22
 *   180   33.00               4.5258636911e-22
 *   240   43.94               4.3992279309e-22
 *   320   58.53               4.3353953376e-22
 *   400   73.11               4.3079193631e-22
 *
 * THE ENVELOPE. Fitting lambda_min = A + B h + D h^1.5, h = (pi/(N+1))^2, over the
 * full grid gives the primary A_fit = 4.2688499403e-22. The extrapolation envelope
 * over the four fit-model bases ({1,h}, {1,h,h^1.5}, {1,h,h^2}, {1,h,h^1.5,h^2})
 * plus the two leave-one-out fits (drop the coarsest N=120, drop the finest N=400)
 * spreads A over [4.2233152463e-22, 4.2707611362e-22]. The half-envelope about the
 * primary A_fit is u_fit = 4.553e-24 (u_fit_rel = 1.067e-2, i.e. 1.07%).
 *
 * THE VERDICT -- ln 1.2 IS DD-EXTRAPOLATION-LIMITED, DIRECTLY BAKED. The dual
 * A_opt = 4.2634260802e-22 (cancellation-free, re-derived live; matches the
 * imp-95826 baked 4.263426e-22 and the primary A_fit to r_point = +1.27e-3) carries
 * only u_opt_rel = 8 eps = 1.78e-15 (u_opt = 7.57e-37). So
 *
 *   u_fit / u_opt = 6.01e12   ( >> 1e10 ),
 *
 * i.e. the ln 1.2 certified-interval width IS a pure DD-grid-reach artifact, exactly
 * as at ln 1.3 (1.29e12) and ln 1.5 (4.3e10). u_opt does NOT become non-negligible
 * at the deep corner. The ratio is even LARGER than at ln 1.3 because the ln 1.2
 * extrapolation is looser (u_fit_rel 1.07% vs ln 1.3's 0.23%: the ln 1.2 reach runs
 * only to ~73 at N=400 vs ln 1.3's ~105, so the finite-grid extrapolation band is
 * wider). The interval-arithmetic signed difference is (A_fit - A_opt)/A_opt in
 * [-9.41e-3, +1.20e-2] around r_point = +1.27e-3, and it CONTAINS ZERO -- the two
 * routes are consistent with exact agreement at ln 1.2 too. This CLOSES the imp-95826
 * ln1.2 sub-gap: the u_fit-dominated / u_opt-negligible structure is now DIRECTLY
 * baked, not merely expected, at all three worked deltas.
 *
 * HONEST SCOPE. Direct measurement filling an already-established audit sub-gap; no
 * new cited input, no new bound, no operator positivity, and NO numeric change to
 * the imp-95767 certified interval (that interval is at ln 1.3; this is the ln 1.2
 * companion measurement). Model seam family only; the imp-95212 envelope port,
 * signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed. Sun arXiv:2609.04176
 * unrefereed.
 *
 * @see imp-95826-dual-primal-dd-extrapolation-limited-per-delta-audit (the sub-gap this closes)
 * @see imp-95767-dual-primal-agreement-interval (the ln1.3 certified interval this mirrors)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert DD solver reused here)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (reach-universality; the ln1.2 2-point probe)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual A_opt)
 */

export const IMP95837_LN12_DD_EXTRAPOLATION_GRID = {
  id: "imp-95837",
  title:
    "MEASURE: build the missing >= 4-point DD Jacobi lambda_min(N) grid at the " +
    "deep-corner delta = ln 1.2 (imp-95820 shift-invert DD Toeplitz solver, 5 points " +
    "N = {120,180,240,320,400}, monotone) and recompute the primal A_fit envelope -- " +
    "A_fit = 4.2689e-22, u_fit_rel = 1.07%, against the delta-independent u_opt_rel = " +
    "8 eps gives u_fit/u_opt = 6.01e12, so the ln 1.2 deep-corner interval IS " +
    "DD-extrapolation-limited (u_opt negligible), DIRECTLY baked -- closing the " +
    "imp-95826 ln1.2 sub-gap",
  question:
    "with a full >= 4-point DD Jacobi grid at ln 1.2, is the deep-corner dual-vs-primal " +
    "interval DD-extrapolation-limited (u_fit dominant, u_opt negligible) as the " +
    "imp-95761 reach-universality predicts, or does u_opt become non-negligible there?",
  delta: 0.18232155679395462, // ln 1.2
  eps: 2.220446049250313e-16,
  nGrid: [120, 180, 240, 320, 400],
  // baked DD Jacobi lambda_min(N) grid (offline tmp/imp-95837-ln12-dd-grid.mjs)
  ddLambdaMin: [
    4.9721614258e-22, 4.5258636911e-22, 4.3992279309e-22, 4.3353953376e-22,
    4.3079193631e-22,
  ],
  sweepMonotoneDecreasing: true,
  aFit: 4.2688499403e-22, // primary fit {1,h,h^1.5}, full grid
  aOpt: 4.2634260802e-22, // dual, cancellation-free (re-derived live below)
  // A extrapolation envelope over fit-model + leave-one-out choices
  aFitEnvelope: { lo: 4.2233152463e-22, hi: 4.2707611362e-22 },
  uFit: 4.553469e-24, // half-envelope around aFit (max deviation, the {1,h}-model lo side)
  uFitRel: 1.066674e-2, // 1.07% -- looser than ln1.3 (0.23%) because reach only ~73 vs ~105
  uOptRel: 1.7763568394002505e-15, // 8 eps, delta-INDEPENDENT (imp-95826)
  uOpt: 7.573366e-37, // aOpt * 8 eps
  uFitOverUOpt: 6.012478e12, // >> 1e10: DD-extrapolation-limited, u_opt negligible
  rPoint: 1.272183e-3, // signed (A_fit - A_opt)/A_opt = +0.127%
  rInterval: { lo: -9.408122e-3, hi: 1.195249e-2 }, // interval-arithmetic signed difference
  intervalContainsZero: true, // routes consistent with exact agreement at ln1.2 too
  ddExtrapolationLimited: true, // u_fit dominates; u_opt does NOT become non-negligible
  uOptBecomesNonNegligible: false,
  directlyBaked: true, // no longer merely EXPECTED via reach-universality
  boundChange: false,
  qed: false,
  subGapClosed: "imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit",
  verdict:
    "MEASURED -- the ln 1.2 deep-corner interval IS DD-extrapolation-limited, now " +
    "DIRECTLY baked. A 5-point DD Jacobi lambda_min(N) grid at delta = ln 1.2 " +
    "(N = {120,180,240,320,400}, imp-95820 shift-invert DD Toeplitz solver, every N " +
    "converged, sweep monotone decreasing 4.972e-22 -> 4.308e-22) fits " +
    "lambda_min = A + B h + D h^1.5 to a primary A_fit = 4.2688e-22. The fit-model " +
    "({1,h}, {1,h,h^1.5}, {1,h,h^2}, {1,h,h^1.5,h^2}) plus leave-one-out (drop " +
    "coarsest / finest) envelope spreads A over [4.2233e-22, 4.2708e-22], giving " +
    "u_fit = 4.553e-24 (u_fit_rel = 1.07%). The dual A_opt = 4.2634e-22 (cancellation- " +
    "free, matching the imp-95826 baked value and A_fit to r_point = +1.27e-3) carries " +
    "only u_opt_rel = 8 eps = 1.78e-15, so u_fit/u_opt = 6.01e12 >> 1e10: the ln 1.2 " +
    "interval width IS a pure DD-grid-reach artifact and u_opt does NOT become " +
    "non-negligible at the deep corner. The ratio is even larger than at ln 1.3 " +
    "(1.29e12) because the ln 1.2 extrapolation is looser (u_fit_rel 1.07% vs 0.23%: " +
    "reach runs only to ~73 at N=400 vs ~105). The interval-arithmetic signed " +
    "difference (A_fit - A_opt)/A_opt in [-9.41e-3, +1.20e-2] CONTAINS ZERO, so the " +
    "two routes are consistent with exact agreement at ln 1.2 too. This CLOSES the " +
    "imp-95826 sub-gap imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit: the " +
    "u_fit-dominated / u_opt-negligible structure is now DIRECTLY baked, not merely " +
    "expected, at all three worked deltas. Direct measurement of an established audit " +
    "sub-gap; no new cited input; no numeric change to the imp-95767 certified " +
    "interval; model seam family only; the imp-95212 envelope port, signed WEIGHT, " +
    "and modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO " +
    "QED; no refereed bound is changed.",
  closesTickets: ["imp-95837"],
};

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD), from imp-95820 -- import-light
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

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: the A_fit envelope + u_fit and the
// dual A_opt + u_opt are re-derived live from the baked grid (fast float64), and
// ONE cheap live N=120 DD shift-invert solve (~0.06s) re-validates the solver.
// ---------------------------------------------------------------------------
const REF = IMP95837_LN12_DD_EXTRAPOLATION_GRID;
const Hs = REF.nGrid.map((N) => Math.pow(Math.PI / (N + 1), 2));

export const IMP95837_ASSERTIONS = [
  {
    id: "imp95837-grid-has-at-least-four-points-and-is-monotone",
    description:
      "the DD Jacobi grid has >= 4 points (enough for the 3-param fit and the LOO envelope) and is monotone decreasing (lambda_min descends to A_opt as N grows)",
    holds: () => {
      if (REF.ddLambdaMin.length < 4) return false;
      for (let i = 1; i < REF.ddLambdaMin.length; i++)
        if (REF.ddLambdaMin[i] >= REF.ddLambdaMin[i - 1]) return false;
      return REF.sweepMonotoneDecreasing === true;
    },
  },
  {
    id: "imp95837-live-shift-invert-reproduces-baked-N120",
    description:
      "one live PD-preserving shift-invert DD solve at N=120, delta=ln1.2 reproduces the baked coarsest grid point (4.9721614258e-22) to < 1e-6 relative -- the baked grid is the real solver output",
    holds: () => {
      const lm = lambdaMinShiftInvert(120, ddLn12(), { boot: 20, margin: 0.02, shiftIters: 40 });
      return Math.abs(lm - REF.ddLambdaMin[0]) / REF.ddLambdaMin[0] < 1e-6;
    },
  },
  {
    id: "imp95837-primary-Afit-rederives-from-baked-grid",
    description:
      "fitting the baked DD grid with {1,h,h^1.5} recovers the baked primary A_fit to < 1e-6 relative",
    holds: () => {
      const A = fitA(Hs, REF.ddLambdaMin, [0, 1, 1.5]);
      return Math.abs(A - REF.aFit) / REF.aFit < 1e-6;
    },
  },
  {
    id: "imp95837-extrapolation-envelope-brackets-all-model-choices",
    description:
      "the four fit-model A choices and the two leave-one-out A choices all lie inside the baked A_fit envelope [lo,hi]",
    holds: () => {
      const As = [
        fitA(Hs, REF.ddLambdaMin, [0, 1]),
        fitA(Hs, REF.ddLambdaMin, [0, 1, 1.5]),
        fitA(Hs, REF.ddLambdaMin, [0, 1, 2]),
        fitA(Hs, REF.ddLambdaMin, [0, 1, 1.5, 2]),
        fitA(Hs.slice(1), REF.ddLambdaMin.slice(1), [0, 1, 1.5]),
        fitA(Hs.slice(0, -1), REF.ddLambdaMin.slice(0, -1), [0, 1, 1.5]),
      ];
      const tol = 1e-27; // envelope endpoints baked to ~10 figures
      return As.every((A) => A >= REF.aFitEnvelope.lo - tol && A <= REF.aFitEnvelope.hi + tol);
    },
  },
  {
    id: "imp95837-uFit-is-the-half-envelope",
    description:
      "u_fit equals the max deviation of the baked A_fit from either envelope endpoint, and u_fit_rel = u_fit/A_fit ~ 1.07%",
    holds: () => {
      const want = Math.max(REF.aFitEnvelope.hi - REF.aFit, REF.aFit - REF.aFitEnvelope.lo);
      return (
        Math.abs(REF.uFit - want) / want < 1e-3 &&
        Math.abs(REF.uFitRel - REF.uFit / REF.aFit) / REF.uFitRel < 1e-3
      );
    },
  },
  {
    id: "imp95837-dual-Aopt-rederives-live-matches-imp95826",
    description:
      "the baked dual A_opt is reproduced by the live cancellation-free sum to < 1e-9 relative and matches the imp-95826 baked 4.263426e-22",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-9 && Math.abs(REF.aOpt - 4.263426e-22) / 4.263426e-22 < 1e-6;
    },
  },
  {
    id: "imp95837-uOptRel-is-eight-ulp-delta-independent",
    description:
      "the dual u_opt_rel equals 8 machine eps (float64 dual rounding, delta-independent per imp-95826) and u_opt = A_opt * u_opt_rel",
    holds: () =>
      Math.abs(REF.uOptRel - 8 * REF.eps) / (8 * REF.eps) < 1e-12 &&
      Math.abs(REF.uOpt - REF.aOpt * REF.uOptRel) / REF.uOpt < 1e-3,
  },
  {
    id: "imp95837-ln12-is-dd-extrapolation-limited",
    description:
      "u_fit/u_opt = 6.01e12 >> 1e10, matches u_fit_rel/u_opt_rel to < 1% relative, so the ln1.2 deep-corner interval IS DD-extrapolation-limited and u_opt does NOT become non-negligible",
    holds: () => {
      const ratio = REF.uFit / REF.uOpt;
      const want = REF.uFitRel / REF.uOptRel;
      return (
        ratio > 1e10 &&
        Math.abs(REF.uFitOverUOpt - ratio) / ratio < 1e-2 &&
        Math.abs(REF.uFitOverUOpt - want) / want < 1e-2 &&
        REF.ddExtrapolationLimited === true &&
        REF.uOptBecomesNonNegligible === false
      );
    },
  },
  {
    id: "imp95837-signed-interval-contains-zero",
    description:
      "the interval-arithmetic signed difference (A_fit - A_opt)/A_opt is reproduced from (A_fit +- u_fit),(A_opt +- u_opt) and CONTAINS ZERO -- the routes agree at ln1.2 too",
    holds: () => {
      const rLo = (REF.aFit - REF.uFit - (REF.aOpt + REF.uOpt)) / (REF.aOpt + REF.uOpt);
      const rHi = (REF.aFit + REF.uFit - (REF.aOpt - REF.uOpt)) / (REF.aOpt - REF.uOpt);
      const rPt = (REF.aFit - REF.aOpt) / REF.aOpt;
      return (
        Math.abs(rLo - REF.rInterval.lo) < 1e-6 &&
        Math.abs(rHi - REF.rInterval.hi) < 1e-6 &&
        Math.abs(rPt - REF.rPoint) < 1e-6 &&
        REF.rInterval.lo < 0 && REF.rInterval.hi > 0 &&
        REF.intervalContainsZero === true
      );
    },
  },
  {
    id: "imp95837-closes-imp95826-ln12-subgap",
    description:
      "this module is the DIRECTLY-baked ln1.2 grid the imp-95826 sub-gap asked for, so the u_fit-dominated structure is no longer merely expected at ln1.2",
    holds: () =>
      REF.subGapClosed === "imp-95826-ln12-dd-extrapolation-grid-for-per-delta-ufit" &&
      REF.directlyBaked === true &&
      REF.closesTickets.includes("imp-95837"),
  },
  {
    id: "imp95837-not-a-bound",
    description:
      "this is a measurement filling an audit sub-gap; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /MEASURED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
];

for (const a of IMP95837_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95837-ln12-dd-extrapolation-grid assertion failed: ${a.id}`,
    );
  }
}

export default IMP95837_LN12_DD_EXTRAPOLATION_GRID;
