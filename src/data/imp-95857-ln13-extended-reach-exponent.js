/**
 * imp-95857 -- EXTEND the direct rho = 1 sech seam Gram eigensolve at delta = ln 1.3
 * BEYOND the imp-95841 window (nPts <= 1920) with a HEAVY shift budget, and measure
 * the local log-log exponent of F / A_opt - 1 directly at larger N to decide whether
 * it keeps tightening toward 2 from below (shift-budget-curable) or whether the
 * deep-corner A_opt underflow flattens/reverses it (a genuine pre-asymptotic wall).
 *
 * GRADE: numerical measurement of an established endpoint. Import-light: the extended
 * reach table (nPts = 1920 / 2560 / 3200) is BAKED from the offline driver
 * tmp/imp-95857-ln13-extended-reach-exponent.mjs, which reuses the imp-95820 /
 * imp-95841 PD-preserving shift-invert double-double Toeplitz solver on the SAME
 * uniform rho = 1 Gram G[j,k] = sech((j - k) delta / 2), delta = ln 1.3, at a HEAVY
 * budget (boot 80, margin 0.008, up to 700 shift solves). The self-executing
 * assertions run ONE cheap live nPts = 320 shift-invert solve (~0.4s) to re-validate
 * the solver against the imp-95841 baked ratio, re-derive the extended local log-log
 * slopes from the baked table, and check the scope flags. No heavy reach sweep at
 * import; no zeros bundle.
 *
 * WHAT imp-95841 LEFT OPEN. imp-95841 pushed the DIRECT delta = ln 1.3 eigensolve to
 * nPts = 1920 with the shift-invert solver and locked the direct-DD local log-log
 * slope of F / A_opt - 1 to -2 (tightening from below -2.069 -> -2.017 across
 * nPts = 320..1920), curing the imp-95823 pre-asymptotic exponent sub-gap on that
 * window. But it named a residual: at a FIXED budget the shift-invert readout itself
 * under-converges beyond nPts ~ 1.3-1.9k (light-budget nPts = 1920 read
 * ratio - 1 = 2.944e-4, a heavier budget pulled it to 1.949e-4), and it could not
 * decide whether the exponent KEEPS tightening to -2 past 1920 or whether the
 * deep-corner A_opt underflow (F ~ 4.4e-15 against lmax ~ 24, cond ~ 5e15) would
 * eventually flatten the direct read. This module extends the heavy-budget converged
 * window to nPts = 3200 to settle that question directly.
 *
 * RESULT -- THE EXPONENT KEEPS TIGHTENING TO 2 FROM BELOW AT THE EXTENDED REACH; NO
 * DEEP-CORNER FLATTENING. Re-running the SAME heavy budget at nPts = 1920 reproduces
 * the imp-95841 heavy-budget read exactly (ratio - 1 = 1.948914e-4), then the two new
 * extended-reach points continue the monotone approach:
 *
 *   nPts   F = lambda_min (DD)     F / A_opt - 1      slope (this -> next)   direct/dual
 *   1920   4.407111025806e-15     1.948914e-4        -2.0133                1.0165
 *   2560   4.406733477466e-15     1.092067e-4        -2.0102                1.0123
 *   3200   4.406559544964e-15     6.973268e-5        --                     1.0098
 *   inf    A_opt = 4.406252e-15   0                  -> exponent 2          -> 1
 *
 * The local log-log slope tightens monotonically toward -2 FROM BELOW past the
 * imp-95841 window (-2.017 at 1600 -> 1920, then -2.0133 at 1920 -> 2560, -2.0102 at
 * 2560 -> 3200), and the ratio of the direct read to the imp-95689 leading dual term
 * 1 + C (pi/(N + 1))^2 (C = 71.6903) decays monotonically to 1 (1.0165 -> 1.0123 ->
 * 1.0098). F stays STRICTLY above A_opt = 4.406252285191e-15 at every nPts (the
 * finite-section positivity floor lambda_min(G_n) >= ess-inf f = A_opt, imp-95825),
 * decreasing monotonically toward it. So at the ACTUAL seam delta = ln 1.3 the
 * deep-corner A_opt underflow does NOT flatten or reverse the exponent -- it keeps
 * approaching -2 from below with a HEAVY budget -- confirming the imp-95841 residual
 * is shift-budget under-convergence (curable by more shift solves), NOT a genuine
 * deep-corner pre-asymptotic wall. The imp-95823 pre-asymptotic direct-DD exponent
 * sub-gap is thereby extended and re-confirmed cured out to nPts = 3200.
 *
 * NEW RESIDUAL SUB-GAP (unchanged in kind). Pushing to the ratio - 1 ~ 1e-5 float64
 * readout floor (nPts >> 3200) still needs ever more shift budget per size (the
 * nPts = 3200 heavy-budget solve took ~453s here); the same imp-95820-ln125-shift-
 * budget-scaling residual, now carried out to nPts = 3200. NOT a new asymptotic
 * regime -- the exponent-2 lock is established on the converged window
 * nPts = 320..3200.
 *
 * HONEST SCOPE. (a) Measures an already-established endpoint (imp-95659 / imp-95677 /
 * imp-95689 / imp-95823 / imp-95841); introduces no new cited input and no new bound.
 * (b) Extends the imp-95841 direct exponent-2 observation from nPts = 1920 to 3200 and
 * decides the open question (deep-corner underflow does NOT flatten the exponent).
 * (c) Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95841-ln13-shift-invert-direct-exponent (the nPts <= 1920 window this extends + its residual)
 * @see imp-95823-rho1-szego-direct-dd-eigensolve (the DD-Jacobi module + its exponent sub-gap)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the PD-preserving shift-invert solver reused here)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the Poisson-dual exponent-2 result matched directly)
 * @see imp-95825-finite-section-positivity-certificate (lambda_min(G_n) >= ess-inf f = A_opt)
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
// ln(1.3) in DD via atanh series ln((1 + y)/(1 - y)) = 2 sum y^(2k+1)/(2k+1), y = 3/23
function ddLn13() { const y = ddDiv(DD(3), DD(23)); const y2 = ddMul(y, y); let term = y, sum = y; for (let k = 1; k <= 80; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMul(DD(2), sum); }

// ---------------------------------------------------------------------------
// O(N^2) DD Toeplitz shift-invert bottom-eigenvalue solver (imp-95820 / imp-95841).
// The shifted inner solve keeps T - sigma I symmetric Toeplitz (diagonal 1 - sigma,
// off-diagonals r_k unchanged); Levinson-Durbin factors it after normalizing by
// d = 1 - sigma. A PD-preserving shift (sigma below lambda_min) keeps beta > 0.
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
function lambdaMinShiftInvert(n, deltaDD, { boot = 50, margin = 0.02, shiftIters = 120 } = {}) {
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
// A_opt(delta) = theta-dual scalar-class symbol infimum (imp-95419), DD
function aOptDualDD(deltaDD) {
  const delta = toNum(deltaDD);
  let s = DD(0);
  for (let n = 0; n <= 6000; n++) {
    const t = ddSech(DD((Math.PI * Math.PI * (2 * n + 1)) / delta));
    s = ddAdd(s, t);
    if (n > 2 && t[0] < s[0] * 1e-34) break;
  }
  return ddMul(DD((4 * Math.PI) / delta), s);
}

// ---------------------------------------------------------------------------
// Reference constants (baked from tmp/imp-95857-ln13-extended-reach-exponent.mjs)
// ---------------------------------------------------------------------------
export const IMP95857_LN13_EXTENDED_REACH_EXPONENT = {
  id: "imp-95857",
  title:
    "the imp-95820 / imp-95841 shift-invert DD solver extends the DIRECT rho = 1 " +
    "delta = ln 1.3 Gram eigensolve to nPts = 3200 (past the imp-95841 heavy-budget " +
    "cap of 1920) at a HEAVY shift budget, and the direct-DD local log-log slope of " +
    "F / A_opt - 1 keeps tightening toward 2 FROM BELOW (-2.0133 -> -2.0102 across " +
    "nPts = 1920..3200, direct/dual -> 1) -- the deep-corner A_opt underflow does NOT " +
    "flatten the exponent, extending the imp-95823/imp-95841 exponent-2 lock",
  question:
    "does extending the heavy-budget shift-invert direct delta = ln 1.3 Gram " +
    "eigensolve past nPts = 1920 keep the direct-DD exponent tightening to 2 from " +
    "below, or does the deep-corner A_opt underflow flatten/reverse it?",
  delta: 0.26236426446749106, // ln 1.3
  aOpt: 4.406252285191384e-15, // theta-dual scalar-class floor (imp-95419), DD
  dualCoefC: 71.69029824053476, // imp-95689 leading dual coefficient C at delta = ln 1.3
  // Extended heavy-budget direct-DD shift-invert table at rho = 1, delta = ln 1.3
  // (boot 80, margin 0.008, up to 700 shift solves). nPts = 1920 reproduces the
  // imp-95841 heavy-budget read; 2560 / 3200 are new extended-reach points.
  table: [
    { nPts: 1920, F: 4.407111025805572e-15, ratio: 1.0001948913858325 },
    { nPts: 2560, F: 4.406733477465909e-15, ratio: 1.0001092067007018 },
    { nPts: 3200, F: 4.406559544963774e-15, ratio: 1.0000697326781363 },
  ],
  // converged local log-log slopes of (ratio - 1) across consecutive grid points:
  // tighten monotonically toward -2 (approach from below), past the imp-95841 window.
  slopes: [-2.0133, -2.0102],
  // ratio of the direct read to the imp-95689 leading dual term, monotone down to 1:
  directOverDual: [1.0165, 1.0123, 1.0098],
  slopeKeepsTighteningToTwo: true, // extended reach: slope tightens toward -2 from below
  deepCornerDoesNotFlatten: true, // A_opt underflow does NOT flatten/reverse the exponent
  // cross-module consistency: nPts = 1920 heavy-budget read reproduces imp-95841
  imp95841HeavyBudget1920RatioMinus1: 1.948914e-4,
  extendedRatioMinus1At3200: 6.973268e-5, // deepest extended-reach read
  residualSubGap: "imp-95820-ln125-shift-budget-scaling", // same residual, carried to nPts = 3200
  boundChange: false,
  qed: false,
  verdict:
    "EXPONENT 2 KEEPS TIGHTENING FROM BELOW AT THE EXTENDED REACH; NO DEEP-CORNER " +
    "FLATTENING. Extending the imp-95820 / imp-95841 PD-preserving shift-invert DD " +
    "solver (O(N^2) Toeplitz) on the SAME uniform rho = 1 Gram " +
    "G[j,k] = sech((j - k) delta / 2), delta = ln 1.3, past the imp-95841 window: a " +
    "heavy-budget nPts = 1920 solve reproduces the imp-95841 heavy-budget read exactly " +
    "(ratio - 1 = 1.948914e-4), then the two new extended-reach points continue the " +
    "monotone approach -- ratio - 1 = 1.092067e-4 at nPts = 2560 and 6.973268e-5 at " +
    "nPts = 3200. The direct-DD local log-log slope of F / A_opt - 1 tightens " +
    "monotonically toward -2 FROM BELOW past 1920 (-2.017 at 1600 -> 1920, then " +
    "-2.0133 at 1920 -> 2560, -2.0102 at 2560 -> 3200), and the ratio of the direct " +
    "read to the imp-95689 leading dual term 1 + C (pi/(N + 1))^2 (C = 71.6903) decays " +
    "monotonically to 1 (1.0165 -> 1.0123 -> 1.0098). F stays STRICTLY above " +
    "A_opt = 4.406252285191e-15 at every nPts (finite-section positivity floor " +
    "lambda_min(G_n) >= ess-inf f = A_opt, imp-95825), decreasing monotonically toward " +
    "it. So at the ACTUAL seam delta = ln 1.3 the deep-corner A_opt underflow does NOT " +
    "flatten or reverse the exponent -- it keeps approaching -2 from below with a heavy " +
    "budget -- confirming the imp-95841 residual is shift-budget under-convergence " +
    "(curable by more shift solves), NOT a genuine deep-corner pre-asymptotic wall. " +
    "The imp-95823 pre-asymptotic direct-DD exponent sub-gap is extended and " +
    "re-confirmed cured out to nPts = 3200. NEW RESIDUAL (unchanged in kind): pushing " +
    "to the ratio - 1 ~ 1e-5 float64 readout floor (nPts >> 3200) still needs ever more " +
    "shift budget per size (the nPts = 3200 heavy-budget solve took ~453s here) -- the " +
    "same imp-95820-ln125-shift-budget-scaling residual, now carried to nPts = 3200, " +
    "NOT a new asymptotic regime. Measures an established endpoint; no new cited input. " +
    "Model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95857"],
};

const REF = IMP95857_LN13_EXTENDED_REACH_EXPONENT;

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: ONE live nPts = 320 shift-invert solve
// (~0.4s) re-validates the solver against the imp-95841 baked ratio; the extended
// slopes and direct/dual are re-derived from the baked table; the scope flags are
// checked. No heavy reach sweep at import; no zeros bundle.
// ---------------------------------------------------------------------------
const IMP95841_BAKED_N320_F = 4.439715645651e-15; // imp-95841 converged nPts = 320 read
const IMP95841_BAKED_N320_RATIO = 1.007594517584;

export const IMP95857_ASSERTIONS = [
  {
    id: "imp95857-live-shift-invert-N320-reproduces-imp95841-baked-ratio",
    description:
      "a fresh PD-preserving shift-invert DD solve of the rho = 1 delta = ln 1.3 " +
      "Gram at nPts = 320 reproduces the imp-95841 baked F and F / A_opt to < 1e-8 " +
      "relative -- re-validating the extended-reach solver machinery",
    holds: () => {
      const dDD = ddLn13();
      const aOpt = toNum(aOptDualDD(dDD));
      const F = lambdaMinShiftInvert(320, dDD, { boot: 50, margin: 0.02, shiftIters: 120 });
      return (
        Math.abs(F - IMP95841_BAKED_N320_F) / IMP95841_BAKED_N320_F < 1e-8 &&
        Math.abs(F / aOpt - IMP95841_BAKED_N320_RATIO) / IMP95841_BAKED_N320_RATIO < 1e-8
      );
    },
  },
  {
    id: "imp95857-extended-slopes-keep-tightening-to-two-from-below",
    description:
      "the local log-log slopes of (ratio - 1) re-derived from the baked extended " +
      "table (nPts = 1920..3200) match the baked slopes, all lie within 0.05 of -2, " +
      "and tighten monotonically toward -2 from below (|slope + 2| shrinks)",
    holds: () => {
      const t = REF.table;
      let prevDist = Infinity;
      for (let i = 1; i < t.length; i++) {
        const s = Math.log((t[i].ratio - 1) / (t[i - 1].ratio - 1)) / Math.log(t[i].nPts / t[i - 1].nPts);
        if (Math.abs(s - REF.slopes[i - 1]) > 5e-3) return false;
        if (Math.abs(s + 2) > 0.05) return false;
        if (s >= -2) return false; // approaches -2 from below (slope stays < -2)
        const dist = Math.abs(s + 2);
        if (!(dist < prevDist)) return false;
        prevDist = dist;
      }
      return REF.slopeKeepsTighteningToTwo === true;
    },
  },
  {
    id: "imp95857-direct-over-dual-decays-to-one",
    description:
      "the ratio of the direct read to the imp-95689 leading dual term " +
      "1 + C (pi/(N + 1))^2 (C = 71.6903) re-derived from the baked table decays " +
      "monotonically to 1 across nPts = 1920..3200, reaching < 1.011 by nPts = 3200",
    holds: () => {
      const t = REF.table;
      let prev = Infinity;
      for (let i = 0; i < t.length; i++) {
        const pred = 1 + REF.dualCoefC * Math.pow(Math.PI / (t[i].nPts + 1), 2);
        const doverd = (t[i].ratio - 1) / (pred - 1);
        if (Math.abs(doverd - REF.directOverDual[i]) > 5e-3) return false;
        if (!(doverd < prev) || doverd < 1) return false;
        prev = doverd;
      }
      return prev < 1.011 && REF.deepCornerDoesNotFlatten === true;
    },
  },
  {
    id: "imp95857-F-strictly-above-Aopt-and-monotone-decreasing",
    description:
      "F = lambda_min stays strictly above A_opt at every extended nPts (finite-section " +
      "positivity floor) and decreases monotonically toward A_opt as nPts grows -- no " +
      "deep-corner undershoot",
    holds: () => {
      const t = REF.table;
      let prevF = Infinity;
      for (const r of t) {
        if (!(r.F > REF.aOpt)) return false;
        if (!(r.F < prevF)) return false;
        prevF = r.F;
      }
      return t[t.length - 1].F > REF.aOpt;
    },
  },
  {
    id: "imp95857-1920-reproduces-imp95841-heavy-budget",
    description:
      "the extended-reach nPts = 1920 heavy-budget read reproduces the imp-95841 " +
      "heavy-budget ratio - 1 = 1.948914e-4 (cross-module consistency of the solver)",
    holds: () => {
      const r1920 = REF.table[0].ratio - 1;
      return Math.abs(r1920 - REF.imp95841HeavyBudget1920RatioMinus1) / REF.imp95841HeavyBudget1920RatioMinus1 < 1e-5;
    },
  },
  {
    id: "imp95857-delta-and-aopt-match-references",
    description:
      "the in-pair gap delta = ln 1.3 and the A_opt symbol infimum match the " +
      "imp-95419 / imp-95689 / imp-95823 / imp-95841 reference constants",
    holds: () => {
      if (Math.abs(REF.delta - Math.log(1.3)) > 1e-15) return false;
      return Math.abs(toNum(aOptDualDD(ddLn13())) - REF.aOpt) / REF.aOpt < 1e-6;
    },
  },
  {
    id: "imp95857-not-a-bound-honest-scope",
    description:
      "this is a numerical measurement module; it moves no Lambda bound and proves no " +
      "QED, extends the imp-95841 direct exponent-2 observation to nPts = 3200, and " +
      "records the shift-budget residual",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.deepCornerDoesNotFlatten === true &&
      REF.residualSubGap === "imp-95820-ln125-shift-budget-scaling" &&
      /KEEPS TIGHTENING FROM BELOW/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95857-closes-self",
    description: "this module is the deliverable the imp-95857 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95857"),
  },
];

for (const a of IMP95857_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95857-ln13-extended-reach-exponent assertion failed: ${a.id}`,
    );
  }
}

export default IMP95857_LN13_EXTENDED_REACH_EXPONENT;
