/**
 * imp-95838 -- MEASURE the ln 1.25 shift-invert iteration-budget scaling law:
 * how does the PD-preserving shift solve count grow with N (bottom-eigenvalue
 * conditioning) as reach increases, and is it genuinely far slower than the
 * sigma = 0 O(N^2) inverse-iteration blow-up as imp-95820 asserted? (the imp-95820
 * sub-gap imp-95820-ln125-shift-budget-scaling.)
 *
 * GRADE: numerical measurement. Import-light. The two iteration-count(N) grids are
 * BAKED from the offline driver tmp/imp-95838-shiftbudget.mjs (which reuses the
 * imp-95820 PD-preserving robust shift-invert DD Toeplitz machinery verbatim: a
 * short plain warm-up sets a HIGH rough estimate, sigma = f * rough is kept below
 * lambda_min so the shifted Levinson stays SPD, and any non-positive-beta overshoot
 * halves f and retries). The self-executing assertions (1) re-derive BOTH power-law
 * fits its ~ C N^p live from the baked grids (fast float64 log-log least squares),
 * and (2) run ONE cheap live N = 150 shift-invert solve (~0.1s) to re-validate the
 * solver reproduces the baked coarsest grid point and its baked iteration count.
 * No heavy DD reach sweep at import; no zeros bundle. Measures ONLY; changes NO
 * numeric value of any interval; NO new bound; NO QED.
 *
 * WHAT imp-95820 LEFT AS THE SUB-GAP. imp-95820 cured the imp-95799 sigma = 0
 * large-N under-convergence with the PD-preserving two-stage shift-invert DD solver
 * and got ln 1.35 to cross sub-1%, but flagged that ln 1.25 (bottom eigenvalue
 * ~ 7e-18, condition ~ 1e17) needs a LARGER shift budget at N ~ 1370-1523: at the
 * small ~ 115-solve budget N = 1372 was still ~ 2e-5 high, which corrupted the
 * small-budget ln 1.25 reach-340 cell. imp-95820 ASSERTED the shift budget grows
 * genuinely far slower than the sigma = 0 O(N^2) blow-up, but never measured the
 * law. This module measures it.
 *
 * THE MEASUREMENT (delta = ln 1.25 = 0.22314355, curvature scale delta/pi = 0.0710,
 * C_pred = pi^2/(2 delta^2) = 99.1063). For each N: the robust shift-invert solver
 * iteration count to a 1e-15 relative Rayleigh-quotient tol (shift cap 1200), and
 * the plain sigma = 0 inverse-iteration count to the same tol (plain cap 3000; the
 * plain solve is too costly past N ~ 660). retries = 0 at every N -- the shift is
 * always a valid SPD solve.
 *
 *   N     lambda_min(shift)   shiftIts   plainIts   plain/shift
 *   150   7.362343722e-18     19         111        5.84
 *   220   7.132905180e-18     26         182        7.00
 *   320   7.039434840e-18     49         457        9.33
 *   460   6.999308008e-18     80         872        10.90
 *   660   6.980880815e-18     131        1531       11.69
 *   900   6.973086304e-18     248        (>cap)     --
 *   1250  6.968808727e-18     456        (>cap)     --
 *   1523  6.967325939e-18     712        (>cap)     --
 *
 * THE GROWTH LAWS. Log-log least squares over the eight non-capped shift points
 * gives shiftIts ~ 5.670e-3 N^1.577; over the five converged plain points
 * plainIts ~ 1.029e-2 N^1.841 (i.e. ~ O(N^2), confirming the imp-95820 sigma = 0
 * characterization). So the shift-invert exponent (1.58) IS below the sigma = 0
 * exponent (1.84), but by a MODEST 0.26 in the exponent -- NOT the dramatic
 * exponent gap "far slower" might suggest.
 *
 * THE VERDICT -- imp-95820 PARTIALLY CONFIRMED and refined. The shift-invert budget
 * grows SLOWER than the sigma = 0 O(N^2) blow-up, but the dominant practical cure is
 * NOT an order-of-magnitude smaller exponent: it is (a) a ~ 10-12x smaller ABSOLUTE
 * constant (plain/shift ratio climbs 5.84 -> 11.69 across N = 150..660), and (b) the
 * shift stays PD-valid (retries = 0) and converges cleanly where the sigma = 0
 * solver stalls (the imp-95799 under-convergence). So imp-95820 "genuinely far
 * slower blow-up" overstates the EXPONENT difference (1.58 vs 1.84); the honest
 * statement is a modestly-slower exponent plus a ~ 10x constant-factor and numerical
 * validity win.
 *
 * THE BUDGET TO CERTIFY THE ln 1.25 SUB-1% CROSSING CLEANLY. Reach 340 -> Nmax =
 * round(340/delta - 1) = 1523. The shift-invert solve there was measured DIRECTLY
 * to need 712 iterations (not extrapolated; the offline run converged to the 1e-15
 * tol at its = 712 < the 1200 cap). So a budget of ~ 750-800 shift solves certifies
 * the reach-340 crossing; the imp-95820 crossing run used maxIter = 500, ~ 1.5x too
 * small at N = 1523, and the ~ 115 / ~ 250-solve budgets the ticket names are
 * ~ 3-6x too small -- exactly why the small-budget N = 1372 cell was still ~ 2e-5
 * high. This QUANTIFIES the imp-95820 sub-gap: certify at N = 1523 with >= ~ 750
 * PD-preserving shift solves.
 *
 * HONEST SCOPE. Direct measurement filling an established solver-cost sub-gap; no
 * new cited input, no new bound, no operator positivity, and NO numeric change to
 * any certified interval. It does NOT itself re-run the reach-340 crossing at the
 * corrected budget (that is a separate compute cell); it measures the LAW and the
 * REQUIRED budget. Model seam family only; the imp-95212 envelope port, signed
 * WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda program;
 * NO QED; no refereed bound is changed. Sun arXiv:2609.04176 unrefereed.
 *
 * SUPERSEDED (endpoint-vs-window). recommendedBudget=800 here is set from the
 * N=1523 endpoint alone. imp-95859 later measured the interior near-degenerate
 * window N ~ 1370-1523 on a fine grid and found the worst cell (N=1400, 870 shift
 * solves) EXCEEDS this endpoint-based 800, refining the honest minimal budget that
 * certifies every window cell upward to ~950 with headroom (see
 * supersededByWindowBudget below). Consumers needing a single figure that covers
 * the whole reach-340 window should cite the imp-95859 ~950 value, not this 800.
 *
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the solver + the sub-gap this closes)
 * @see imp-95837-ln12-dd-extrapolation-grid (sibling deep-corner DD measurement, same solver)
 * @see imp-95799 (the sigma=0 under-convergence the shift-invert cured)
 */

export const IMP95838_LN125_SHIFT_BUDGET_SCALING = {
  id: "imp-95838",
  title:
    "MEASURE: the ln 1.25 PD-preserving shift-invert iteration-budget scaling law " +
    "-- shiftIts ~ 5.670e-3 N^1.577 vs the sigma=0 plainIts ~ 1.029e-2 N^1.841 " +
    "(~O(N^2)); the shift exponent is only MODESTLY lower (1.58 vs 1.84), the real " +
    "cure is a ~10-12x smaller constant plus PD validity; reach-340 (Nmax=1523) " +
    "needs ~712 shift solves measured directly, so >= ~750 certifies the sub-1% " +
    "crossing (imp-95820 maxIter=500 was ~1.5x too small) -- closing the imp-95820 " +
    "ln1.25 shift-budget sub-gap",
  question:
    "how does the PD-preserving shift solve count grow with N (bottom-eigenvalue " +
    "conditioning) for ln 1.25, is it genuinely far slower than the sigma=0 O(N^2) " +
    "blow-up as imp-95820 asserted, and what budget certifies the sub-1% crossing?",
  delta: 0.22314355131420976, // ln 1.25
  cPred: 99.10626494, // pi^2 / (2 delta^2)
  curvatureScale: 0.07102872, // delta / pi
  condApprox: 1e17, // ~ 1/(lambda_min * eps), bottom eigenvalue ~ 7e-18
  eps: 2.220446049250313e-16,
  tol: 1e-15,
  shiftCap: 1200,
  plainCap: 3000,
  // baked shift-invert grid (offline tmp/imp-95838-shiftbudget.mjs), retries=0 at every N
  nGrid: [150, 220, 320, 460, 660, 900, 1250, 1523],
  shiftIts: [19, 26, 49, 80, 131, 248, 456, 712],
  shiftLambdaMin: [
    7.362343722e-18, 7.132905180e-18, 7.039434840e-18, 6.999308008e-18,
    6.980880815e-18, 6.973086304e-18, 6.968808727e-18, 6.967325939e-18,
  ],
  shiftRetriesAllZero: true,
  shiftSweepMonotoneDecreasing: true, // lambda_min descends toward A_opt as N grows
  shiftItsMonotoneIncreasing: true,
  // baked plain sigma=0 grid (only the converged N; plain too costly past ~660)
  nGridPlain: [150, 220, 320, 460, 660],
  plainIts: [111, 182, 457, 872, 1531],
  plainOverShift: [5.84, 7.0, 9.33, 10.9, 11.69], // ratio grows with N
  // log-log power fits its ~ C N^p (re-derived live from the baked grids below)
  shiftFit: { C: 5.669924e-3, p: 1.5769020 },
  plainFit: { C: 1.0285843e-2, p: 1.8414894 },
  shiftExponentBelowPlain: true, // 1.58 < 1.84: slower growth
  exponentGap: 0.2645874, // plain p - shift p: MODEST, not an order of magnitude
  plainNearQuadratic: true, // plain p ~ 1.84 ~ O(N^2), confirming imp-95820
  farSlowerBlowupOverstated: true, // "far slower" overstates the EXPONENT gap
  realCure: "constant-factor (~10-12x) plus PD validity, not a dramatically lower exponent",
  // budget to certify the reach-340 (Nmax=1523) sub-1% crossing cleanly
  reach340Nmax: 1523,
  measuredShiftItsAtNmax: 712, // measured directly (converged, not extrapolated)
  recommendedBudget: 800, // ~712 with headroom; >= ~750 certifies the N=1523 ENDPOINT only
  // SUPERSEDED for the interior near-degenerate window: imp-95859 measured the
  // worst window cell (N=1400) at 870 shift solves, ABOVE this 800 endpoint-based
  // figure, and recommends ~950 with headroom to certify every cell in the window.
  supersededByWindowBudget: {
    ticket: "imp-95859",
    recommendedWindowBudget: 950,
    reason: "worst window cell N=1400 needs 870 shift solves (> the 712-endpoint-based 800 here)",
  },
  imp95820CrossingMaxIter: 500, // ~1.5x too small at N=1523
  ticketBudgetsTooSmall: [115, 250], // ~3-6x too small (the ~2e-5-high N=1372 cell)
  boundChange: false,
  qed: false,
  subGapClosed: "imp-95820-ln125-shift-budget-scaling",
  verdict:
    "MEASURED -- the ln 1.25 PD-preserving shift-invert iteration budget grows as " +
    "shiftIts ~ 5.670e-3 N^1.577 (eight N = 150..1523 points, retries = 0 " +
    "everywhere so every shift is a valid SPD solve), against the sigma = 0 plain " +
    "inverse-iteration plainIts ~ 1.029e-2 N^1.841 (five converged N = 150..660 " +
    "points, ~ O(N^2)). The shift exponent (1.58) IS below the sigma = 0 exponent " +
    "(1.84), confirming the imp-95820 direction, but by only 0.26 in the exponent " +
    "-- so the imp-95820 characterization of a shift budget growing genuinely FAR " +
    "slower than the O(N^2) blow-up OVERSTATES the exponent gap. The dominant " +
    "practical cure is (a) a ~ 10-12x smaller absolute constant (plain/shift ratio " +
    "climbs 5.84 -> 11.69 across N = 150..660) and (b) the shift staying PD-valid " +
    "and converging where the sigma = 0 solver stalls (the imp-95799 " +
    "under-convergence). BUDGET: reach 340 -> Nmax = 1523, where the shift solve " +
    "was measured DIRECTLY to need 712 iterations to the 1e-15 tol, so ~ 750-800 " +
    "PD-preserving shift solves certify the ln 1.25 sub-1% crossing; the imp-95820 " +
    "crossing run used maxIter = 500 (~ 1.5x too small) and the ~ 115 / ~ 250-solve " +
    "budgets are ~ 3-6x too small, exactly why the small-budget N = 1372 cell was " +
    "still ~ 2e-5 high. This CLOSES the imp-95820 sub-gap " +
    "imp-95820-ln125-shift-budget-scaling: the budget law is measured and the " +
    "certifying budget quantified. Direct measurement of a solver-cost sub-gap; no " +
    "new cited input; no numeric change to any certified interval (it does not " +
    "itself re-run the crossing at the corrected budget); model seam family only; " +
    "the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. " +
    "Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95838"],
};

// ---------------------------------------------------------------------------
// double-double arithmetic (Dekker / Bailey QD), from imp-95837 -- import-light
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
// robust shift-invert returning {rq, its} -- the exact imp-95820-crossing solver
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

// log-log least squares -> {p, C} for y ~ C N^p
function powFit(Ns, ys) {
  const xs = Ns.map(Math.log), ls = ys.map(Math.log);
  const n = xs.length; const sx = xs.reduce((a, b) => a + b, 0), sy = ls.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0), sxy = xs.reduce((a, b, i) => a + b * ls[i], 0);
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx); const logC = (sy - p * sx) / n;
  return { p, C: Math.exp(logC) };
}

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: both power fits are re-derived live
// from the baked grids (fast float64), and ONE cheap live N=150 DD shift-invert
// solve (~0.1s) re-validates the solver reproduces the baked coarsest point.
// ---------------------------------------------------------------------------
const REF = IMP95838_LN125_SHIFT_BUDGET_SCALING;

export const IMP95838_ASSERTIONS = [
  {
    id: "imp95838-grids-consistent-shapes-and-monotone",
    description:
      "the shift grid has 8 points with matching its/lambda_min lengths, lambda_min descends and its rises monotonically, and the plain grid has 5 converged points",
    holds: () => {
      if (REF.nGrid.length !== 8 || REF.shiftIts.length !== 8 || REF.shiftLambdaMin.length !== 8) return false;
      for (let i = 1; i < 8; i++) {
        if (REF.shiftLambdaMin[i] >= REF.shiftLambdaMin[i - 1]) return false;
        if (REF.shiftIts[i] <= REF.shiftIts[i - 1]) return false;
      }
      return REF.nGridPlain.length === 5 && REF.plainIts.length === 5 &&
        REF.shiftSweepMonotoneDecreasing === true && REF.shiftItsMonotoneIncreasing === true;
    },
  },
  {
    id: "imp95838-live-shift-invert-reproduces-baked-N150",
    description:
      "one live PD-preserving robust shift-invert DD solve at N=150, delta=ln1.25 reproduces the baked coarsest lambda_min (7.362343722e-18) to < 1e-9 relative AND its baked iteration count (19) and retries=0 -- the baked grid is the real solver output",
    holds: () => {
      const r = lamMinShiftInvertRobust(150, ddLn125(), REF.shiftCap, REF.tol);
      return Math.abs(r.rq - REF.shiftLambdaMin[0]) / REF.shiftLambdaMin[0] < 1e-9 &&
        r.its === REF.shiftIts[0] && r.retries === 0;
    },
  },
  {
    id: "imp95838-shift-power-fit-rederives",
    description:
      "log-log least squares on the baked (N, shiftIts) grid recovers the baked shiftFit {C,p} to < 1e-4 relative and the exponent is ~ 1.58",
    holds: () => {
      const f = powFit(REF.nGrid, REF.shiftIts);
      return Math.abs(f.p - REF.shiftFit.p) / REF.shiftFit.p < 1e-4 &&
        Math.abs(f.C - REF.shiftFit.C) / REF.shiftFit.C < 1e-4 &&
        f.p > 1.5 && f.p < 1.65;
    },
  },
  {
    id: "imp95838-plain-power-fit-rederives-near-quadratic",
    description:
      "log-log least squares on the baked (N, plainIts) grid recovers the baked plainFit {C,p} to < 1e-4 relative and the sigma=0 exponent is ~ O(N^2) (1.8 < p < 1.95)",
    holds: () => {
      const f = powFit(REF.nGridPlain, REF.plainIts);
      return Math.abs(f.p - REF.plainFit.p) / REF.plainFit.p < 1e-4 &&
        Math.abs(f.C - REF.plainFit.C) / REF.plainFit.C < 1e-4 &&
        f.p > 1.8 && f.p < 1.95 && REF.plainNearQuadratic === true;
    },
  },
  {
    id: "imp95838-shift-exponent-below-plain-but-gap-modest",
    description:
      "the shift exponent is below the plain exponent (slower growth) but the exponent gap is MODEST (~0.26, not an order of magnitude), so 'far slower' overstates the exponent difference",
    holds: () => {
      const gap = REF.plainFit.p - REF.shiftFit.p;
      return REF.shiftFit.p < REF.plainFit.p &&
        Math.abs(gap - REF.exponentGap) < 1e-3 &&
        gap > 0.15 && gap < 0.4 &&
        REF.shiftExponentBelowPlain === true &&
        REF.farSlowerBlowupOverstated === true;
    },
  },
  {
    id: "imp95838-constant-factor-cure-ratio-grows",
    description:
      "the plain/shift iteration ratio matches plainIts/shiftIts on the shared grid, grows with N (5.84 -> 11.69), and reaches >= 10 by N=460 -- the real cure is a ~10-12x constant factor",
    holds: () => {
      for (let i = 0; i < REF.nGridPlain.length; i++) {
        const want = REF.plainIts[i] / REF.shiftIts[i];
        if (Math.abs(REF.plainOverShift[i] - want) / want > 5e-3) return false;
      }
      for (let i = 1; i < REF.plainOverShift.length; i++)
        if (REF.plainOverShift[i] <= REF.plainOverShift[i - 1]) return false;
      return REF.plainOverShift[REF.plainOverShift.length - 1] > 11 &&
        REF.plainOverShift[3] >= 10;
    },
  },
  {
    id: "imp95838-reach340-budget-quantified",
    description:
      "reach 340 -> Nmax = round(340/delta - 1) = 1523 matches the baked N; the baked measuredShiftItsAtNmax = the last grid its (712, directly converged); recommendedBudget (800) exceeds it and exceeds the imp-95820 maxIter=500",
    holds: () => {
      const nmax = Math.round(340 / REF.delta - 1);
      return nmax === REF.reach340Nmax &&
        REF.reach340Nmax === REF.nGrid[REF.nGrid.length - 1] &&
        REF.measuredShiftItsAtNmax === REF.shiftIts[REF.shiftIts.length - 1] &&
        REF.recommendedBudget >= REF.measuredShiftItsAtNmax &&
        REF.recommendedBudget > REF.imp95820CrossingMaxIter &&
        REF.imp95820CrossingMaxIter < REF.measuredShiftItsAtNmax;
    },
  },
  {
    id: "imp95838-recommendedbudget-superseded-for-window",
    description:
      "recommendedBudget=800 was set from the N=1523 endpoint only; imp-95859 found the interior worst window cell needs more, so the endpoint budget alone is flagged insufficient for the window and re-pointed to the imp-95859 refined ~950 figure",
    holds: () =>
      REF.supersededByWindowBudget.ticket === "imp-95859" &&
      REF.supersededByWindowBudget.recommendedWindowBudget > REF.recommendedBudget,
  },
  {
    id: "imp95838-closes-imp95820-subgap-not-a-bound",
    description:
      "this closes the named imp-95820 ln1.25 shift-budget sub-gap; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.subGapClosed === "imp-95820-ln125-shift-budget-scaling" &&
      REF.closesTickets.includes("imp-95838") &&
      REF.boundChange === false &&
      REF.qed === false &&
      /MEASURED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
];

for (const a of IMP95838_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95838-ln125-shift-budget-scaling assertion failed: ${a.id}`,
    );
  }
}

export default IMP95838_LN125_SHIFT_BUDGET_SCALING;
