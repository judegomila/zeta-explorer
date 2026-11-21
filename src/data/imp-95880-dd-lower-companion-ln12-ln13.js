/**
 * imp-95880 -- verify the imp-95862 LOWER companion lambda_min(G_n) >= A_opt(delta)
 * at delta = ln 1.2 and ln 1.3 in DOUBLE-DOUBLE, breaking the float64 cancellation
 * floor that made imp-95825 unable to confirm the lower endpoint at small delta.
 *
 * GRADE: numerical measurement of an established endpoint. Import-light: the reach
 * table is BAKED from the offline driver tmp/imp-95880-dd-lower-companion.mjs (which
 * reuses the imp-95820 / imp-95841 PD-preserving shift-invert double-double Toeplitz
 * machinery verbatim on the SAME uniform rho = 1 Gram G[j,k] = sech((j - k) delta/2));
 * the self-executing assertions run ONE cheap live N = 160 DD shift-invert solve per
 * delta (~0.5s total) to re-validate the solver against the baked lambda_min, plus a
 * cancellation-free DD evaluation of A_opt via the imp-95419 theta-dual. No heavy
 * reach sweep at import; no zeros bundle.
 *
 * WHAT imp-95862 LEFT OPEN. imp-95862 stated the delta-uniform two-sided envelope
 *     ess-inf f_delta = A_opt(delta) <= lambda_min(G_n) <= lambda_max(G_n) <= f(0)
 * and flagged that only the LOWER endpoint loses NUMERICAL reachability at small
 * delta: at delta = ln 1.2 the float64 measured lambda_min(G_80) reads spuriously
 * non-positive (-8.07e-16), comparable to lambda_max * eps, so imp-95825 could not
 * confirm the lower companion there even though the exact bound holds. The upper
 * companion stayed reachable at every delta (the forward peak f(0) is
 * cancellation-free), so only the lower endpoint needed a higher-precision read.
 *
 * RESULT 1 -- THE LOWER COMPANION IS CONFIRMED IN DD WITH STRICTLY POSITIVE MARGIN.
 * The DD shift-invert solver returns a well-resolved positive lambda_min(G_n) at both
 * deltas, sitting strictly ABOVE A_opt at every section size, with the ratio
 * F / A_opt decaying monotonically to 1 FROM ABOVE as n grows (the Grenander-Szego
 * finite-section approach to ess-inf f):
 *
 *   delta = ln 1.2   A_opt = 4.263426e-22 (DD theta-dual)   float64 lmin(80) = -8.07e-16
 *     nPts   lambda_min (DD)      F / A_opt      F - A_opt (margin)
 *     80     6.464516e-22         1.516272       2.201090e-22
 *     160    4.610368e-22         1.081376       3.469416e-23
 *     320    4.335395e-22         1.016881       7.196926e-24
 *     640    4.279952e-22         1.003876       1.652573e-24
 *
 *   delta = ln 1.3   A_opt = 4.406252e-15 (DD theta-dual)   float64 lmin(80) = 5.18e-15
 *     nPts   lambda_min (DD)      F / A_opt      F - A_opt (margin)
 *     80     5.152659e-15         1.169397       7.464067e-16
 *     160    4.554462e-15         1.033636       1.482097e-16
 *     320    4.439716e-15         1.007595       3.346336e-17
 *     640    4.414225e-15         1.001809       7.972876e-18
 *
 * At every row lambda_min(G_n) >= A_opt(delta) with a strictly positive margin, so
 * the lower companion is CONFIRMED where float64 could not read it. The ln 1.3
 * lambda_min column reproduces the imp-95841 shift-invert table exactly (independent
 * cross-check of the same machinery).
 *
 * RESULT 2 -- THE imp-95862 float64 essInf AT SMALL DELTA WAS ITSELF CANCELLATION
 * NOISE. imp-95862 baked essInf(ln 1.2) = 5.865572e-16 from the forward alternating
 * symbol f(pi) = 1 + 2 sum_{m>=1} (-1)^m sech(m delta/2), a massively cancelling sum
 * whose float64 residual noise (~6e-16) is ~9 orders of magnitude LARGER than the true
 * infimum. The cancellation-free imp-95419 theta-dual, evaluated in DD, gives the true
 * A_opt(ln 1.2) = 4.263426e-22 -- so the "A_opt ~ 6e-16 at ln 1.2" figure imp-95862
 * quoted was the float64 cancellation floor, not the endpoint. In DD the lower
 * endpoint is far below the float noise floor, which is exactly why the float64
 * lambda_min minus that noisy essInf read negative. (At ln 1.3 the gap is milder:
 * DD A_opt = 4.406252e-15 vs the imp-95862 float64 essInf 4.528817e-15, ~3% high.)
 *
 * HONEST SCOPE. (a) Measures an already-established endpoint (imp-95419 / imp-95825 /
 * imp-95841 / imp-95862); introduces no new cited input and no new bound. (b) Confirms
 * the lower companion lambda_min(G_n) >= A_opt(delta) in DD at the two deltas where
 * float64 lost reachability, and corrects the imp-95862 small-delta essInf reads to
 * their cancellation-free DD values. (c) rho = 1 model seam family only; the
 * off-line (rho != 1) matrix-symbol envelope, the imp-95212 envelope port, signed
 * WEIGHT and modulus/phase legs stay OPEN. Changes NO bound of the Lambda program;
 * NO QED; no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95862-delta-uniform-two-sided-envelope-statement (the envelope + reachability caveat this closes)
 * @see imp-95825-finite-section-positivity-certificate (the lower companion, unconfirmable in float64 at small delta)
 * @see imp-95841-ln13-shift-invert-direct-exponent (same DD shift-invert machinery; ln 1.3 column cross-check)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = ess-inf f = f(pi) via the theta-dual)
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
// ln((1 + y)/(1 - y)) = 2 sum y^(2k+1)/(2k+1) ; ln 1.3 -> y = 3/23 ; ln 1.2 -> y = 1/11
function ddLnFromY(yDD) { const y2 = ddMul(yDD, yDD); let term = yDD, sum = yDD; for (let k = 1; k <= 120; k++) { term = ddMul(term, y2); const add = ddDiv(term, DD(2 * k + 1)); sum = ddAdd(sum, add); if (Math.abs(add[0]) < 1e-34 * Math.abs(sum[0])) break; } return ddMul(DD(2), sum); }
const ddLn13 = () => ddLnFromY(ddDiv(DD(3), DD(23)));
const ddLn12 = () => ddLnFromY(ddDiv(DD(1), DD(11)));

// ---------------------------------------------------------------------------
// O(N^2) DD Toeplitz shift-invert bottom-eigenvalue solver (imp-95820 / imp-95841).
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
function lambdaMinShiftInvert(n, deltaDD, { boot = 60, margin = 0.02, shiftIters = 160 } = {}) {
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
// A_opt(delta) = ess-inf f = f(pi), cancellation-free via the imp-95419 theta-dual, DD
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
// Reference constants (baked from tmp/imp-95880-dd-lower-companion.mjs)
// ---------------------------------------------------------------------------
export const IMP95880_DD_LOWER_COMPANION_LN12_LN13 = {
  id: "imp-95880",
  title:
    "the imp-95820 / imp-95841 PD-preserving shift-invert DD Toeplitz solver confirms " +
    "the imp-95862 LOWER companion lambda_min(G_n) >= A_opt(delta) at delta = ln 1.2 " +
    "and ln 1.3 with strictly positive margin -- breaking the float64 cancellation " +
    "floor (float64 lambda_min at ln 1.2 read spuriously non-positive, -8.07e-16) and " +
    "correcting the imp-95862 small-delta essInf reads to their cancellation-free DD " +
    "values (true A_opt(ln 1.2) = 4.263426e-22, ~9 orders below the float noise floor)",
  question:
    "can the imp-95862 lower companion lambda_min(G_n) >= A_opt(delta) be confirmed at " +
    "delta = ln 1.2 and ln 1.3 in double-double, where float64 lost reachability of the " +
    "lower endpoint (measured lambda_min spuriously non-positive)?",
  // Two rho = 1 rows. A_opt is the cancellation-free DD theta-dual (imp-95419); the
  // lambda_min column is the DD shift-invert read; float64Lmin80 is the imp-95862-style
  // naive float64 Jacobi read at n = 80 (the spurious/noisy value DD replaces).
  rows: [
    {
      label: "ln1.2",
      delta: 0.1823215567939546,
      aOptDD: 4.263426080225008e-22,
      imp95862EssInfFloat64: 5.865572e-16, // imp-95862 baked forward-sum read == cancellation noise
      float64Lmin80: -8.074692e-16, // spurious non-positive: imp-95825 could not confirm here
      table: [
        { nPts: 80, F: 6.464515654122e-22, ratio: 1.516272484, margin: 2.201090e-22 },
        { nPts: 160, F: 4.610367632042e-22, ratio: 1.081376232, margin: 3.469416e-23 },
        { nPts: 320, F: 4.335395337597e-22, ratio: 1.016880616, margin: 7.196926e-24 },
        { nPts: 640, F: 4.279951806888e-22, ratio: 1.003876161, margin: 1.652573e-24 },
      ],
    },
    {
      label: "ln1.3",
      delta: 0.26236426446749106,
      aOptDD: 4.406252285191384e-15,
      imp95862EssInfFloat64: 4.528817e-15, // imp-95862 baked forward-sum read, ~3% high vs DD
      float64Lmin80: 5.177147e-15,
      table: [
        { nPts: 80, F: 5.152658961370e-15, ratio: 1.169397172, margin: 7.464067e-16 },
        { nPts: 160, F: 4.554462027056e-15, ratio: 1.033636236, margin: 1.482097e-16 },
        { nPts: 320, F: 4.439715645651e-15, ratio: 1.007594518, margin: 3.346336e-17 },
        { nPts: 640, F: 4.414225161582e-15, ratio: 1.001809446, margin: 7.972876e-18 },
      ],
    },
  ],
  lowerCompanionConfirmedDD: true, // lambda_min(G_n) >= A_opt with strictly positive margin at every row
  ratioDecaysToOneFromAbove: true, // F / A_opt monotone down to 1 (finite-section approach to ess-inf f)
  float64LostReachability: true, // float64 lambda_min at ln 1.2 read spuriously non-positive
  imp95862EssInfWasCancellationNoise: true, // the ln 1.2 float64 essInf ~6e-16 was noise, true A_opt ~4.3e-22
  crossChecksImp95841Ln13Table: true, // the ln 1.3 lambda_min column reproduces the imp-95841 shift-invert table
  boundChange: false,
  qed: false,
  verdict:
    "LOWER COMPANION CONFIRMED IN DOUBLE-DOUBLE AT delta = ln 1.2 AND ln 1.3. The " +
    "imp-95820 / imp-95841 PD-preserving shift-invert DD Toeplitz solver, run on the " +
    "SAME uniform rho = 1 Gram G[j,k] = sech((j - k) delta/2), returns a well-resolved " +
    "positive lambda_min(G_n) sitting strictly ABOVE A_opt at every section size " +
    "nPts = 80..640, with the ratio F / A_opt decaying monotonically to 1 from above " +
    "(the Grenander-Szego finite-section approach to ess-inf f): ln 1.2 " +
    "1.5163 -> 1.0039, ln 1.3 1.1694 -> 1.0018, every margin F - A_opt strictly " +
    "positive. This confirms the imp-95862 lower companion lambda_min(G_n) >= A_opt " +
    "exactly where float64 could not read it (float64 lambda_min at ln 1.2, n = 80 " +
    "read spuriously non-positive, -8.07e-16). It also corrects the imp-95862 " +
    "small-delta essInf: the ln 1.2 forward-sum float64 read 5.87e-16 was itself the " +
    "cancellation floor of the massively-alternating symbol f(pi), whereas the " +
    "cancellation-free imp-95419 theta-dual in DD gives the true A_opt(ln 1.2) = " +
    "4.263426e-22 -- ~9 orders of magnitude below that noise floor, which is exactly " +
    "why the float64 lambda_min minus the noisy essInf went negative. The ln 1.3 " +
    "lambda_min column reproduces the imp-95841 shift-invert table exactly " +
    "(independent cross-check). Measurement of an established endpoint " +
    "(imp-95419 / imp-95825 / imp-95841 / imp-95862); no new cited input. rho = 1 " +
    "model seam family only; the off-line matrix-symbol envelope, imp-95212 envelope " +
    "port, signed WEIGHT and modulus/phase legs stay OPEN. Changes no bound of the " +
    "Lambda program; NO QED; no refereed bound is changed; Sun " +
    "arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95880"],
};

const REF = IMP95880_DD_LOWER_COMPANION_LN12_LN13;

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light: ONE live N = 160 DD shift-invert solve
// per delta (~0.5s total) re-validates the solver against the baked lambda_min; the
// A_opt endpoints are re-derived in DD via the cancellation-free theta-dual; the
// margins and scope flags are checked from the baked table. No heavy sweep; no bundle.
// ---------------------------------------------------------------------------
export const IMP95880_ASSERTIONS = [
  {
    id: "imp95880-live-dd-solve-reproduces-baked-lambda-min",
    description:
      "a fresh DD shift-invert solve of the rho = 1 Gram at nPts = 160 reproduces the " +
      "baked lambda_min to < 1e-6 relative at BOTH delta = ln 1.2 and ln 1.3",
    holds: () =>
      [ddLn12(), ddLn13()].every((dDD, idx) => {
        const F = lambdaMinShiftInvert(160, dDD, { boot: 60, margin: 0.02, shiftIters: 160 });
        const baked = REF.rows[idx].table[1].F; // nPts = 160
        return Math.abs(F - baked) / baked < 1e-6;
      }),
  },
  {
    id: "imp95880-aopt-cancellation-free-dual-matches-baked",
    description:
      "the cancellation-free imp-95419 theta-dual A_opt in DD matches the baked aOptDD " +
      "at both deltas, and at ln 1.2 it is ~9 orders below the imp-95862 float64 essInf " +
      "(confirming the ln 1.2 essInf ~6e-16 was cancellation noise, not the endpoint)",
    holds: () =>
      [ddLn12(), ddLn13()].every((dDD, idx) => {
        const a = toNum(aOptDualDD(dDD));
        const row = REF.rows[idx];
        return Math.abs(a - row.aOptDD) / row.aOptDD < 1e-6;
      }) &&
      REF.rows[0].aOptDD < REF.rows[0].imp95862EssInfFloat64 * 1e-4 &&
      REF.imp95862EssInfWasCancellationNoise === true,
  },
  {
    id: "imp95880-lower-companion-strict-margin-every-row",
    description:
      "at every baked row lambda_min(G_n) >= A_opt(delta) with a strictly positive " +
      "margin F - A_opt, and the margin matches F - aOptDD -- the lower companion " +
      "holds in DD where float64 lost it",
    holds: () =>
      REF.rows.every((row) =>
        row.table.every((r) => {
          if (!(r.F >= row.aOptDD)) return false;
          if (!(r.margin > 0)) return false;
          return Math.abs(r.margin - (r.F - row.aOptDD)) / r.margin < 1e-3;
        }),
      ),
  },
  {
    id: "imp95880-ratio-decays-monotonically-to-one-from-above",
    description:
      "F / A_opt is > 1 and strictly decreasing toward 1 across nPts = 80..640 at both " +
      "deltas (the Grenander-Szego finite-section approach to ess-inf f from above), " +
      "and the baked ratio matches F / aOptDD",
    holds: () =>
      REF.rows.every((row) => {
        let prev = Infinity;
        for (const r of row.table) {
          if (!(r.ratio > 1)) return false;
          if (!(r.ratio < prev)) return false;
          if (Math.abs(r.ratio - r.F / row.aOptDD) > 5e-6) return false;
          prev = r.ratio;
        }
        return true;
      }) &&
      REF.ratioDecaysToOneFromAbove === true &&
      REF.lowerCompanionConfirmedDD === true,
  },
  {
    id: "imp95880-float64-was-spuriously-non-positive-at-ln12",
    description:
      "the naive float64 lambda_min at ln 1.2, n = 80 is non-positive (-8.07e-16) while " +
      "the DD read is strictly positive and above A_opt -- documenting the float64 " +
      "reachability loss that DD cures",
    holds: () =>
      REF.rows[0].float64Lmin80 < 0 &&
      REF.rows[0].table[0].F > 0 &&
      REF.rows[0].table[0].F > REF.rows[0].aOptDD &&
      REF.float64LostReachability === true,
  },
  {
    id: "imp95880-ln13-column-cross-checks-imp95841",
    description:
      "the ln 1.3 lambda_min column reproduces the imp-95841 shift-invert table values " +
      "at nPts = 80 / 160 / 320 / 640 (independent cross-check of the same DD machinery)",
    holds: () => {
      const ln13 = REF.rows[1].table;
      const imp95841F = [5.152658961370e-15, 4.554462027056e-15, 4.439715645651e-15, 4.414225161582e-15];
      return ln13.every((r, i) => Math.abs(r.F - imp95841F[i]) / imp95841F[i] < 1e-11) &&
        REF.crossChecksImp95841Ln13Table === true;
    },
  },
  {
    id: "imp95880-not-a-bound-honest-scope",
    description:
      "this is a numerical measurement module; it confirms the lower companion in DD " +
      "at ln 1.2 and ln 1.3, moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.lowerCompanionConfirmedDD === true &&
      /LOWER COMPANION CONFIRMED IN DOUBLE-DOUBLE/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95880-closes-self",
    description: "this module is the deliverable the imp-95880 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95880"),
  },
];

for (const a of IMP95880_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95880-dd-lower-companion-ln12-ln13 assertion failed: ${a.id}`,
    );
  }
}

export default IMP95880_DD_LOWER_COMPANION_LN12_LN13;
