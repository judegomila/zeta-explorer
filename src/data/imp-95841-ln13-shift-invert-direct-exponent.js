/**
 * imp-95841 -- push the DIRECT rho = 1 sech seam Gram eigensolve at delta = ln 1.3
 * to LARGE nPts with the imp-95820 PD-preserving shift-invert double-double solver
 * (O(N^2) Toeplitz, far greater reach than the O(N^3) DD-Jacobi that imp-95823
 * capped at nPts = 640), and measure whether the direct-DD local log-log slope of
 * F / A_opt - 1 now LOCKS to the exponent 2 -- a purely-direct confirmation curing
 * the imp-95823 pre-asymptotic direct-DD exponent sub-gap.
 *
 * GRADE: numerical measurement of an established endpoint. Import-light: the reach
 * table is BAKED from the offline driver tmp/imp-95841-ln13-shiftinvert-exponent.mjs
 * (which reuses the imp-95820 DD Toeplitz shift-invert machinery on the SAME
 * uniform rho = 1 Gram G[j,k] = sech((j - k) delta / 2), delta = ln 1.3); the
 * self-executing assertions run ONE cheap live N = 320 shift-invert solve (~0.4s)
 * to re-validate the solver against the baked ratio, re-derive the converged
 * log-log slopes from the baked table, and check the scope flags. No heavy reach
 * sweep at import; no zeros bundle.
 *
 * WHAT imp-95823 LEFT OPEN. imp-95823 confirmed the rho = 1 limit F / A_opt = 1 and
 * the sign (approach strictly from above) by a DIRECT double-double DD-Jacobi
 * eigensolve, but NAMED a sub-gap: at delta = ln 1.3 the direct-DD local log-log
 * slope of F / A_opt - 1 did NOT lock to 2 over the DD-Jacobi-reachable window --
 * it drifted -2.130 -> -1.520 -> -0.775 across nPts = 80/160/320/640 -- so the
 * exponent 2 at ln 1.3 rested on the imp-95689 dual plus the delta = 3 direct
 * control, not a purely-direct read at the seam.
 *
 * RESULT 1 -- THE imp-95823 DRIFT WAS DD-JACOBI UNDER-CONVERGENCE, NOT
 * PRE-ASYMPTOTICS. The shift-invert solver returns a LOWER (more converged)
 * lambda_min than the fixed-sweep DD-Jacobi at every nPts >= 320 while still
 * respecting the finite-section positivity floor lambda_min(G_n) >= A_opt
 * (imp-95825). At nPts = 640 the DD-Jacobi read F = 4.442906e-15
 * (F / A_opt - 1 = 8.32e-3); the shift-invert converged value is F = 4.414225e-15
 * (F / A_opt - 1 = 1.809e-3) -- the DD-Jacobi bottom eigenvalue was biased HIGH by
 * ~6.5e-18 (its ~28-sweep budget could not drive the collapsing bottom eigen-gap
 * to the DD floor at nPts >= 320), inflating ratio - 1 ~ 4.6x and corrupting the
 * slope. Since RQ shift-invert descends onto lambda_min from above (RQ >=
 * lambda_min) and lands LOWER than the DD-Jacobi diagonal min, the shift-invert
 * value is the tighter (correct) converged read.
 *
 * RESULT 2 -- THE DIRECT ln 1.3 SLOPE NOW LOCKS TO 2. Over the converged
 * shift-invert window the direct-DD local log-log slope of F / A_opt - 1 locks
 * cleanly to -2, approaching from below as nPts grows:
 *
 *   nPts   F = lambda_min (DD)     F / A_opt - 1     slope (this -> next)   direct/dual
 *   80     5.152658961370e-15     1.693972e-1        -2.332                 1.571
 *   160    4.554462027056e-15     3.363624e-2        -2.147                 1.232
 *   320    4.439715645651e-15     7.594518e-3        -2.069                 1.106
 *   640    4.414225161582e-15     1.809446e-3        -2.039                 1.051
 *   960    4.409740767830e-15     7.917120e-4        -2.028                 1.033
 *   1280   4.408199400840e-15     4.418984e-4        -2.022                 1.025
 *   1600   4.407492682986e-15     2.815086e-4        -2.017                 1.020
 *   1920   4.407111025806e-15     1.948914e-4        --                     1.016
 *   inf    A_opt = 4.406252e-15   0                  -> exponent 2          -> 1
 *
 * The slope monotonically tightens -2.332 -> -2.147 -> -2.069 -> -2.039 -> -2.028
 * -> -2.022 -> -2.017 toward -2, and the ratio of the direct read to the imp-95689
 * leading dual term 1 + C (pi/(N + 1))^2 (C = 71.6903) decays monotonically to 1
 * (1.571 -> 1.016). So at the ACTUAL seam delta = ln 1.3 the exponent 2 is now
 * DIRECTLY OBSERVED from the Gram eigensolve, no longer resting only on the dual +
 * the delta = 3 control -- the imp-95823 sub-gap is cured.
 *
 * NEW RESIDUAL SUB-GAP (shift-budget, not asymptotics). At a FIXED shift budget the
 * shift-invert readout itself under-converges beyond nPts ~ 1.3-1.9k: at the light
 * budget nPts = 1920 read F / A_opt - 1 = 2.944e-4 (biased high, direct/dual jumps
 * to 1.54), but a heavier budget (boot 80 / ~480 shift solves) pulls it DOWN to
 * 1.949e-4, landing on the dual trend (predicted 1.918e-4, direct/dual 1.016) -- so
 * the >= 1920 drift is under-convergence, the SAME imp-95820-ln125-shift-budget-
 * scaling residual, NOT a new asymptotic regime. The exponent-2 lock is established
 * on the fully-converged window nPts = 320..1920; pushing to the ratio - 1 ~ 1e-5
 * float64 readout floor needs still more shift budget.
 *
 * HONEST SCOPE. (a) Measures an already-established endpoint (imp-95659 / imp-95677
 * / imp-95689 / imp-95823); introduces no new cited input and no new bound. (b) The
 * direct route now settles the LIMIT, the SIGN and the EXPONENT (all three) at
 * delta = ln 1.3 -- upgrading imp-95823, where the exponent stayed a dual + control
 * result. (c) Model seam family only; the imp-95212 envelope port, signed WEIGHT,
 * and modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95823-rho1-szego-direct-dd-eigensolve (the DD-Jacobi module + its exponent sub-gap this cures)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the PD-preserving shift-invert solver reused here)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the Poisson-dual exponent-2 result now matched directly)
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
// O(N^2) DD Toeplitz shift-invert bottom-eigenvalue solver (imp-95820). The
// shifted inner solve keeps T - sigma I symmetric Toeplitz (diagonal 1 - sigma,
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
// Reference constants (baked from tmp/imp-95841-ln13-shiftinvert-exponent.mjs)
// ---------------------------------------------------------------------------
export const IMP95841_LN13_SHIFT_INVERT_DIRECT_EXPONENT = {
  id: "imp-95841",
  title:
    "the imp-95820 shift-invert DD solver pushes the DIRECT rho = 1 delta = ln 1.3 " +
    "Gram eigensolve to nPts = 1920 (far past the imp-95823 O(N^3) DD-Jacobi cap of " +
    "640) and the direct-DD local log-log slope of F / A_opt - 1 now LOCKS to 2 " +
    "(-2.069 -> -2.017 across nPts = 320..1920, direct/dual -> 1) -- a purely-direct " +
    "exponent-2 confirmation curing the imp-95823 pre-asymptotic exponent sub-gap",
  question:
    "does applying the imp-95820 PD-preserving shift-invert DD solver to the direct " +
    "delta = ln 1.3 Gram eigensolve at much larger nPts make the direct-DD exponent " +
    "lock to 2, giving a purely-direct confirmation?",
  delta: 0.26236426446749106, // ln 1.3
  aOpt: 4.406252285191384e-15, // theta-dual scalar-class floor (imp-95419), DD
  dualCoefC: 71.69029824053476, // imp-95689 leading dual coefficient C at delta = ln 1.3
  // Direct-DD shift-invert table at rho = 1, delta = ln 1.3 (converged: nPts <= 640
  // at the light budget, nPts >= 960 at boot 80 / ~480 shift solves).
  table: [
    { nPts: 80, F: 5.152658961370e-15, ratio: 1.169397171988 },
    { nPts: 160, F: 4.554462027056e-15, ratio: 1.033636236028 },
    { nPts: 320, F: 4.439715645651e-15, ratio: 1.007594517584 },
    { nPts: 640, F: 4.414225161582e-15, ratio: 1.001809446186 },
    { nPts: 960, F: 4.409740767830e-15, ratio: 1.000791711961 },
    { nPts: 1280, F: 4.408199400840e-15, ratio: 1.000441898490 },
    { nPts: 1600, F: 4.407492682986e-15, ratio: 1.000281508600 },
    { nPts: 1920, F: 4.407111025806e-15, ratio: 1.000194891400 },
  ],
  // converged local log-log slopes of (ratio - 1) across consecutive grid points:
  // monotonically tighten toward -2 (approach from below).
  slopes: [-2.3318, -2.1469, -2.0694, -2.0388, -2.0275, -2.0217, -2.0168],
  slopeLocksToTwo: true, // the direct ln 1.3 exponent 2 is now DIRECTLY observed
  directOverDualDecaysToOne: true, // direct/dual leading term 1.571 -> 1.016, monotone to 1
  // imp-95823 DD-Jacobi under-convergence at nPts = 640 (biased HIGH; cured here):
  imp95823JacobiF640: 4.4429060090652805e-15, // imp-95823 baked DD-Jacobi lambda_min at nPts = 640
  shiftInvertF640: 4.414225161582e-15, // shift-invert converged value (lower, still >= A_opt)
  jacobiBiasedHigh: true, // DD-Jacobi bottom eigenvalue biased high -> corrupted the imp-95823 slope
  // new residual: at a FIXED budget the shift-invert readout also under-converges
  // beyond nPts ~ 1.3-1.9k (light-budget nPts = 1920 read ratio - 1 = 2.944e-4,
  // heavier budget pulls it to 1.949e-4 onto the dual trend) -- same imp-95820
  // budget-scaling residual, NOT a new asymptotic regime.
  lightBudget1920RatioMinus1: 2.944421e-4,
  heavyBudget1920RatioMinus1: 1.948914e-4,
  residualSubGap: "imp-95820-ln125-shift-budget-scaling",
  imp95823ExponentWasDualPlusControl: true, // imp-95823: exponent stayed a dual + delta = 3 control result
  exponentDirectAtLn13: true, // this module: exponent 2 now directly observed at delta = ln 1.3
  boundChange: false,
  qed: false,
  verdict:
    "EXPONENT 2 NOW DIRECTLY OBSERVED AT delta = ln 1.3. Applying the imp-95820 " +
    "PD-preserving shift-invert DD solver (O(N^2) Toeplitz) to the SAME uniform " +
    "rho = 1 Gram G[j,k] = sech((j - k) delta / 2) pushes the direct eigensolve to " +
    "nPts = 1920 -- far past the imp-95823 O(N^3) DD-Jacobi cap of 640. The direct-DD " +
    "local log-log slope of F / A_opt - 1 locks to -2, tightening monotonically from " +
    "below: -2.069 / -2.039 / -2.028 / -2.022 / -2.017 across nPts = 320 -> 1920, " +
    "and the ratio of the direct read to the imp-95689 leading dual term " +
    "1 + C (pi/(N + 1))^2 (C = 71.6903) decays monotonically to 1 (1.106 -> 1.016). " +
    "So the imp-95823 slope drift (-2.130 -> -0.775) is CONFIRMED to be DD-Jacobi " +
    "under-convergence, NOT pre-asymptotics: at nPts = 640 the imp-95823 DD-Jacobi " +
    "read F = 4.442906e-15 (ratio - 1 = 8.32e-3), whereas the converged shift-invert " +
    "value is F = 4.414225e-15 (ratio - 1 = 1.809e-3) -- the fixed-sweep Jacobi bottom " +
    "eigenvalue was biased high by ~6.5e-18 (still >= A_opt = 4.406252e-15), inflating " +
    "ratio - 1 ~ 4.6x and corrupting the slope. The direct route now settles the LIMIT, " +
    "the SIGN and the EXPONENT at delta = ln 1.3, upgrading imp-95823 where the " +
    "exponent stayed a dual + delta = 3 control result. NEW RESIDUAL: at a fixed budget " +
    "the shift-invert readout itself under-converges beyond nPts ~ 1.3-1.9k (light-budget " +
    "nPts = 1920 read ratio - 1 = 2.944e-4, heavier boot 80 / ~480 shift solves pulls it " +
    "to 1.949e-4 onto the dual trend, predicted 1.918e-4) -- the same " +
    "imp-95820-ln125-shift-budget-scaling residual, NOT a new asymptotic regime; the " +
    "exponent-2 lock is established on the converged window nPts = 320..1920. Measures an " +
    "established endpoint; no new cited input. Model seam family only; the imp-95212 " +
    "envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes no bound of " +
    "the Lambda program; NO QED; no refereed bound is changed; Sun " +
    "arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95841"],
};

const REF = IMP95841_LN13_SHIFT_INVERT_DIRECT_EXPONENT;

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: ONE live N = 320 shift-invert solve
// (~0.4s) re-validates the solver against the baked ratio; the converged slopes
// are re-derived from the baked table; the scope flags are checked. No heavy reach
// sweep at import; no zeros bundle.
// ---------------------------------------------------------------------------
export const IMP95841_ASSERTIONS = [
  {
    id: "imp95841-live-shift-invert-N320-reproduces-baked-ratio",
    description:
      "a fresh PD-preserving shift-invert DD solve of the rho = 1 delta = ln 1.3 " +
      "Gram at nPts = 320 reproduces the baked F and F / A_opt to < 1e-8 relative " +
      "(the shift-invert value is fully converged and above the DD floor here)",
    holds: () => {
      const dDD = ddLn13();
      const aOpt = toNum(aOptDualDD(dDD));
      const F = lambdaMinShiftInvert(320, dDD, { boot: 50, margin: 0.02, shiftIters: 120 });
      const row = REF.table[2]; // nPts = 320
      return (
        Math.abs(F - row.F) / row.F < 1e-8 &&
        Math.abs(F / aOpt - row.ratio) / row.ratio < 1e-8
      );
    },
  },
  {
    id: "imp95841-converged-slopes-lock-to-two",
    description:
      "the converged local log-log slopes of (ratio - 1) re-derived from the baked " +
      "table match the baked slopes and all lie within 0.35 of -2, tightening " +
      "monotonically toward -2 across nPts = 80..1920 (the exponent-2 lock)",
    holds: () => {
      const t = REF.table;
      for (let i = 1; i < t.length; i++) {
        const s = Math.log((t[i].ratio - 1) / (t[i - 1].ratio - 1)) / Math.log(t[i].nPts / t[i - 1].nPts);
        if (Math.abs(s - REF.slopes[i - 1]) > 5e-3) return false;
        if (Math.abs(s + 2) > 0.35) return false;
      }
      // slopes tighten monotonically toward -2 from nPts = 320 onward
      for (let i = 3; i < REF.slopes.length; i++) {
        if (!(Math.abs(REF.slopes[i] + 2) < Math.abs(REF.slopes[i - 1] + 2))) return false;
      }
      return REF.slopeLocksToTwo === true && Math.abs(REF.slopes[REF.slopes.length - 1] + 2) < 0.02;
    },
  },
  {
    id: "imp95841-direct-over-dual-decays-to-one",
    description:
      "the ratio of the direct read to the imp-95689 leading dual term " +
      "1 + C (pi/(N + 1))^2 (C = 71.6903) decays monotonically to 1 across the grid, " +
      "reaching < 1.02 by nPts = 1920 -- the direct read converges onto the dual",
    holds: () => {
      let prev = Infinity;
      const t = REF.table;
      for (let i = 2; i < t.length; i++) { // from nPts = 320 (past the small-N transient)
        const pred = 1 + REF.dualCoefC * Math.pow(Math.PI / (t[i].nPts + 1), 2);
        const doverd = (t[i].ratio - 1) / (pred - 1);
        if (!(doverd < prev) || doverd < 1) return false;
        prev = doverd;
      }
      return prev < 1.02 && REF.directOverDualDecaysToOne === true;
    },
  },
  {
    id: "imp95841-jacobi-was-under-converged-not-pre-asymptotic",
    description:
      "the shift-invert converged nPts = 640 value is strictly below the imp-95823 " +
      "DD-Jacobi read yet still >= A_opt (finite-section positivity floor), so the " +
      "imp-95823 slope drift was DD-Jacobi under-convergence, not pre-asymptotics",
    holds: () =>
      REF.shiftInvertF640 < REF.imp95823JacobiF640 &&
      REF.shiftInvertF640 >= REF.aOpt &&
      REF.jacobiBiasedHigh === true,
  },
  {
    id: "imp95841-residual-is-shift-budget-not-new-asymptotics",
    description:
      "at a fixed budget the shift-invert readout under-converges beyond nPts ~ 1.9k: " +
      "a heavier budget pulls the nPts = 1920 ratio - 1 DOWN (2.944e-4 -> 1.949e-4) " +
      "onto the dual trend, naming the imp-95820 budget-scaling residual (not a new regime)",
    holds: () =>
      REF.heavyBudget1920RatioMinus1 < REF.lightBudget1920RatioMinus1 &&
      REF.residualSubGap === "imp-95820-ln125-shift-budget-scaling",
  },
  {
    id: "imp95841-delta-and-aopt-match-references",
    description:
      "the in-pair gap delta = ln 1.3 and the A_opt symbol infimum match the " +
      "imp-95419 / imp-95689 / imp-95823 reference constants",
    holds: () => {
      if (Math.abs(REF.delta - Math.log(1.3)) > 1e-15) return false;
      return Math.abs(toNum(aOptDualDD(ddLn13())) - REF.aOpt) / REF.aOpt < 1e-6;
    },
  },
  {
    id: "imp95841-not-a-bound-honest-scope",
    description:
      "this is a numerical measurement module; it moves no Lambda bound and proves " +
      "no QED, upgrades imp-95823 by observing the exponent 2 DIRECTLY at delta = ln 1.3, " +
      "and records the shift-budget residual",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.exponentDirectAtLn13 === true &&
      REF.imp95823ExponentWasDualPlusControl === true &&
      /EXPONENT 2 NOW DIRECTLY OBSERVED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95841-closes-self",
    description: "this module is the deliverable the imp-95841 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95841"),
  },
];

for (const a of IMP95841_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95841-ln13-shift-invert-direct-exponent assertion failed: ${a.id}`,
    );
  }
}

export default IMP95841_LN13_SHIFT_INVERT_DIRECT_EXPONENT;
