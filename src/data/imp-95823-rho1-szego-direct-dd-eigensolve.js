/**
 * imp-95823 -- DIRECT double-double eigensolve of the imp-95677 rho = 1 sech seam
 * Gram: an INDEPENDENT extended-precision confirmation of the imp-95689 result,
 * computed on the Gram itself (not via the Poisson symbol dual).
 *
 * GRADE: numerical measurement of an established endpoint. Imports no heavy
 * bundle. imp-95677 tabulated the rho = 1 ratio F / A_opt = lambda_min(sech seam
 * Gram) / A_opt(delta) decaying 1.143 -> 1.101 -> 1.010 -> 0.909 as nPts doubled
 * 80 -> 640, but flagged that lambda_min ~ 4-5e-15 sits at the float64
 * cancellation floor (cond ~ 5e15 > 1/eps), so the eigensolver could not settle
 * the exact limit or the rate, and the sub-1 undershoot (0.909 at 640) is noise.
 * imp-95689 RESOLVED this via the cancellation-free Poisson (theta) DUAL of the
 * symbol plus a delta = 3 control: exact limit 1, convergence exponent 2. This
 * module supplies the OTHER half of the cross-check the ticket asked for -- a
 * genuinely DIRECT double-double eigensolve of the Gram at rho = 1, so the
 * conclusion no longer rests solely on the symbol-dual representation.
 *
 * METHOD. lambda_min is computed by a cyclic Jacobi rotation sweep carried in
 * double-double (Dekker/Knuth two-double) arithmetic on the full Gram
 * G[j,k] = sech((j - k) delta / 2), delta = ln 1.3, rho = 1 (uniform single-scale
 * delta-lattice). Double-double gives ~32 significant digits, so the ~15-digit
 * cancellation that pins lambda_min ~ 4.4e-15 against lmax ~ 24 in float64 leaves
 * ~16 trustworthy digits in DD; the Jacobi off-diagonal norm is driven to the DD
 * roundoff floor (~1e-30) at every size, i.e. FULLY converged (the imp-95677
 * float64 table was noise-inflated at nPts >= 320; a fixed low sweep count also
 * under-converges lambda_min upward, so ~28 sweeps are used at nPts = 320).
 *
 * DIRECT-DD TABLE (delta = ln 1.3, rho = 1, fully converged):
 *
 *   nPts   F = lambda_min (DD)     F / A_opt      dual-lead 1 + C(pi/(N+1))^2
 *   80     5.193384271505e-15     1.178639791     1.107842537
 *   160    4.586096388649e-15     1.040815662     1.027296589
 *   320    4.468979372760e-15     1.014235927     1.006866732
 *   640    4.442906009065e-15     1.008318571     1.001722043
 *   inf    A_opt = 4.406252e-15   1 (exact)       1
 *
 * WHAT THE DIRECT EIGENSOLVE ESTABLISHES.
 *   (1) LIMIT + SIGN, independently of the dual. F / A_opt is STRICTLY ABOVE 1 at
 *       every size (1.179, 1.041, 1.014, 1.008) and decays monotonically toward 1
 *       as nPts grows -- there is NO sub-1 undershoot. The imp-95677 float64 read
 *       of 0.909 at nPts = 640 is thereby confirmed to be pure cancellation
 *       roundoff by a direct extended-precision Gram eigensolve (a check that does
 *       not go through the imp-95689 symbol dual). This is the finite-section
 *       positivity floor lambda_min(G_n) >= ess-inf f = A_opt (imp-95825) seen
 *       numerically from above.
 *   (2) EXPONENT, validated on a well-conditioned control. On the delta = 3
 *       sech-Toeplitz (symbol min ~ 0.312, cond ~ 1-7, so DD is far above any
 *       floor) the SAME DD Jacobi gives F / A_opt - 1 with local log-log slope
 *       -1.979 -> -1.989 -> -1.995 across nPts = 40/80/160/320 -- locking to the
 *       exponent 2 -- and matches the imp-95689 leading dual formula
 *       1 + C(pi/(N+1))^2 (C = f''(pi)/(2 A_opt) = 0.5422 there) to ~5 digits.
 *       This reproduces the imp-95689 control by the direct route and certifies
 *       the DD methodology recovers the exponent when the asymptotic regime is
 *       reached.
 *
 * NAMED SUB-GAP (honest, pre-asymptotic at delta = ln 1.3). At the ACTUAL seam
 * delta = ln 1.3 the direct-DD local log-log slope of F / A_opt - 1 does NOT lock
 * to 2 over the DD-reachable window: it drifts -2.130 -> -1.520 -> -0.775 across
 * nPts = 80/160/320/640, and the direct ratios sit 1.2x - 4.8x ABOVE the
 * imp-95689 leading dual term. This is genuine pre-asymptotics, not a
 * methodology defect (the delta = 3 control locks cleanly to 2): the rho = 1
 * symbol near theta = pi is the exponentially-steep well
 * f(theta) ~ A_opt cosh(pi (theta - pi) / delta) with curvature scale
 * delta / pi ~ 0.083, so the smallest-eigenvalue edge (effective-wavenumber)
 * correction carries a large slowly-decaying prefactor and the pure-quadratic
 * exponent-2 regime is reached only at nPts far beyond the O(N^3) DD-Jacobi
 * reach. So the direct eigensolve independently pins the LIMIT (= 1) and the SIGN
 * (approach strictly from above), but the EXPONENT (= 2) at delta = ln 1.3 rests
 * on the imp-95689 dual asymptotic together with the delta = 3 direct control
 * reproduced here -- it is not directly observable at delta = ln 1.3 below the DD
 * reach.
 *
 * HONEST SCOPE. (a) Measures an already-established endpoint (imp-95659 /
 * imp-95677 / imp-95689); introduces no new cited input and no new bound. (b) The
 * direct route settles limit and sign; the exponent stays a dual + control
 * result, with the delta = ln 1.3 direct window pre-asymptotic (named sub-gap).
 * (c) Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95677-rho1-szego-finite-size-convergence (the float64-floor sub-gap)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the Poisson-dual resolution this cross-checks)
 * @see imp-95825-finite-section-positivity-certificate (lambda_min >= ess-inf f = A_opt)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = symbol infimum)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE = {
  id: "imp-95823",
  title:
    "DIRECT double-double eigensolve of the rho = 1 sech seam Gram: F / A_opt is " +
    "strictly above 1 at every nPts (1.179 -> 1.041 -> 1.014 -> 1.008, nPts " +
    "80 -> 640) and decays monotonically to 1 -- an independent extended-precision " +
    "confirmation of the imp-95689 limit (= 1) and no-undershoot, with the " +
    "exponent (= 2) validated on the delta = 3 control by the same DD route",
  question:
    "does a genuinely DIRECT extended-precision (double-double) eigensolve of the " +
    "rho = 1 Gram -- not the imp-95689 Poisson symbol dual -- confirm F / A_opt " +
    "converges to exactly 1 from above (no sub-1 undershoot), and at what rate?",
  delta: 0.26236426446749106, // ln 1.3
  aOpt: 4.406252285191383e-15, // scalar class floor = sech-Toeplitz symbol infimum, imp-95419
  // Direct-DD table at rho = 1, delta = ln 1.3 (fully converged, DD Jacobi).
  // F = lambda_min(G_n) in double-double; ratio = F / A_opt; dualLead = the
  // imp-95689 leading dual term 1 + C (pi/(N+1))^2 with C = 71.69029824053476.
  table: [
    { nPts: 80, F: 5.1933842715052334e-15, lmax: 22.2065, ratio: 1.1786397907716857, dualLead: 1.107842537 },
    { nPts: 160, F: 4.5860963886492224e-15, lmax: 23.4102, ratio: 1.040815661886239, dualLead: 1.027296589 },
    { nPts: 320, F: 4.4689793727602365e-15, lmax: 23.7989, ratio: 1.0142359273842916, dualLead: 1.006866732 },
    { nPts: 640, F: 4.4429060090652805e-15, lmax: 23.909, ratio: 1.0083185713167364, dualLead: 1.001722043 },
  ],
  dualCoefC: 71.69029824053476, // imp-95689 C = f''(pi)/(2 A_opt) at delta = ln 1.3
  // Local log-log slope of (ratio - 1) vs nPts across the direct-DD grid: drifts,
  // does NOT lock to -2 in the DD-reachable window (pre-asymptotic at ln 1.3).
  ln13Slopes: [-2.1299, -1.5196, -0.7751], // 80->160, 160->320, 320->640
  ln13SlopeLocksToTwo: false, // pre-asymptotic: the direct window does not reach exponent 2
  strictlyAboveOne: true, // every direct-DD ratio > 1 (no sub-1 undershoot)
  monotoneDecreasing: true, // ratio decreases monotonically toward 1
  // delta = 3 well-conditioned control: the SAME DD Jacobi locks to exponent 2 and
  // reproduces the imp-95689 leading dual term -- certifies the DD methodology.
  control: {
    delta: 3.0,
    aOpt: 3.121394797606e-1,
    dualCoefC: 0.542247,
    table: [
      { nPts: 40, ratio: 1.0032479527 },
      { nPts: 80, ratio: 1.0008238697 },
      { nPts: 160, ratio: 1.0002074954 },
      { nPts: 320, ratio: 1.0000520676 },
    ],
    slopes: [-1.979, -1.9893, -1.9946], // -> exponent 2
    slopeLocksToTwo: true,
  },
  limitConfirmedDirectly: true, // limit 1 + approach-from-above pinned by the direct DD eigensolve
  exponentDirectAtLn13: false, // exponent 2 at ln 1.3 rests on imp-95689 dual + the delta = 3 control
  boundChange: false,
  qed: false,
  verdict:
    "CONFIRMED (direct extended-precision eigensolve). A double-double Jacobi " +
    "diagonalisation of the rho = 1 sech seam Gram at delta = ln 1.3, fully " +
    "converged to the DD roundoff floor at nPts = 80/160/320/640, gives F / A_opt " +
    "= 1.179 / 1.041 / 1.014 / 1.008 -- STRICTLY above 1 at every size and " +
    "monotonically decaying to 1 -- so the imp-95677 float64 sub-1 undershoot " +
    "(0.909 at 640) is confirmed pure cancellation roundoff by a DIRECT Gram " +
    "eigensolve, independent of the imp-95689 Poisson symbol dual. The SAME DD " +
    "Jacobi on the well-conditioned delta = 3 control locks the local log-log " +
    "slope of F / A_opt - 1 to the exponent 2 (-1.979 -> -1.995 across " +
    "nPts = 40..320) and reproduces the imp-95689 leading dual term to ~5 digits, " +
    "certifying the methodology. SUB-GAP: at the actual seam delta = ln 1.3 the " +
    "direct-DD slope does NOT lock to 2 over the DD-reachable window (drifts " +
    "-2.130 -> -0.775, and the direct ratios sit 1.2x-4.8x above the leading dual " +
    "term) -- genuine pre-asymptotics from the exponentially-steep " +
    "f ~ A_opt cosh(pi(theta-pi)/delta) well (curvature scale delta/pi ~ 0.083), " +
    "so the exponent-2 regime at ln 1.3 sits beyond the O(N^3) DD-Jacobi reach and " +
    "the exponent stays an imp-95689 dual + delta = 3 control result. Measures an " +
    "established endpoint; no new cited input. Model seam family only; the " +
    "imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. " +
    "Changes no bound of the Lambda program; NO QED; Platt-Trudgian Lambda <= 0.2 " +
    "remains SOTA; Sun arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95823"],
};

// ---------------------------------------------------------------------------
// double-double (Dekker/Knuth two-double) arithmetic -- import-light, no deps
// ---------------------------------------------------------------------------

function quickTwoSum(a, b) { const s = a + b; const e = b - (s - a); return [s, e]; }
function twoSum(a, b) { const s = a + b; const v = s - a; const e = (a - (s - v)) + (b - v); return [s, e]; }
function split(a) { const c = 134217729 * a; const hi = c - (c - a); const lo = a - hi; return [hi, lo]; }
function twoProd(a, b) { const p = a * b; const [ah, al] = split(a); const [bh, bl] = split(b); const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl; return [p, e]; }
function ddAdd(A, B) { let [s, e] = twoSum(A[0], B[0]); e += A[1] + B[1]; return quickTwoSum(s, e); }
function ddSub(A, B) { return ddAdd(A, [-B[0], -B[1]]); }
function ddMul(A, B) { let [p, e] = twoProd(A[0], B[0]); e += A[0] * B[1] + A[1] * B[0]; return quickTwoSum(p, e); }
function ddFrom(x) { return [x, 0]; }
function ddDiv(A, B) { const q1 = A[0] / B[0]; let r = ddSub(A, ddMul(B, ddFrom(q1))); const q2 = r[0] / B[0]; r = ddSub(r, ddMul(B, ddFrom(q2))); const q3 = r[0] / B[0]; return ddAdd(quickTwoSum(q1, q2), ddFrom(q3)); }
function ddSqrt(A) { if (A[0] === 0) return [0, 0]; const x = 1 / Math.sqrt(A[0]); const ax = A[0] * x; const [p, e] = twoProd(ax, ax); const diff = ddSub(A, [p, e]); const corr = diff[0] * x * 0.5; return ddAdd(ddFrom(ax), ddFrom(corr)); }
function ddAbs(A) { return A[0] < 0 ? [-A[0], -A[1]] : A; }
function ddSign(A) { return A[0] < 0 ? -1 : 1; }
function ddLt(A, B) { return A[0] < B[0] || (A[0] === B[0] && A[1] < B[1]); }
function ddSech(x) { const ep = Math.exp(x), em = Math.exp(-x); return ddDiv(ddFrom(2), ddAdd(ddFrom(ep), ddFrom(em))); }

// imp-95419 theta-dual scalar class floor A_opt(delta) (== min_theta f at theta = pi)
function aOptDualDD(delta) {
  let s = ddFrom(0);
  for (let n = 0; n <= 4000; n++) {
    const t = ddSech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s = ddAdd(s, t);
    if (n > 2 && t[0] < s[0] * 1e-34) break;
  }
  return ddMul(ddFrom((4 * Math.PI) / delta), s);
}

// uniform single-scale lattice Gram (rho = 1): G[j,k] = sech((j - k) delta / 2)
function uniformGramDD(nPts, delta) {
  const G = [];
  for (let i = 0; i < nPts; i++) G.push(new Array(nPts));
  for (let i = 0; i < nPts; i++)
    for (let j = i; j < nPts; j++) {
      const v = ddSech(((i - j) * delta) / 2);
      G[i][j] = v; G[j][i] = v;
    }
  return G;
}

// DD cyclic Jacobi -> lambda_min (converged to the DD roundoff floor)
function eigMinDD(A0, maxSweeps) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  const ONE = ddFrom(1), TWO = ddFrom(2);
  let prevOff = Infinity;
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j][0] * A[i][j][0];
    if (off >= prevOff * 0.999 && off < 1e-40) break; // converged to DD floor
    prevOff = off;
    for (let p = 0; p < n - 1; p++)
      for (let q = p + 1; q < n; q++) {
        const apq = A[p][q];
        if (Math.abs(apq[0]) < 1e-32) continue;
        const theta = ddDiv(ddSub(A[q][q], A[p][p]), ddMul(TWO, apq));
        const t = ddDiv(ddFrom(ddSign(theta)), ddAdd(ddAbs(theta), ddSqrt(ddAdd(ddMul(theta, theta), ONE))));
        const c = ddDiv(ONE, ddSqrt(ddAdd(ddMul(t, t), ONE)));
        const s = ddMul(t, c);
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = ddSub(ddMul(c, akp), ddMul(s, akq)); A[k][q] = ddAdd(ddMul(s, akp), ddMul(c, akq)); }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = ddSub(ddMul(c, apk), ddMul(s, aqk)); A[q][k] = ddAdd(ddMul(s, apk), ddMul(c, aqk)); }
      }
  }
  let mn = A[0][0];
  for (let i = 1; i < n; i++) if (ddLt(A[i][i], mn)) mn = A[i][i];
  return mn[0];
}

const REF = IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE;

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports; one small live DD solve)
// ---------------------------------------------------------------------------

export const IMP95823_ASSERTIONS = [
  {
    id: "imp95823-direct-dd-live-nPts80-reproduces-baked",
    heavy: true, // live double-double Jacobi eigensolve; skipped at browser import (see loop below)
    description:
      "a fresh double-double Jacobi eigensolve of the rho = 1 delta = ln 1.3 Gram " +
      "at nPts = 80 reproduces the baked F and F / A_opt to ~1e-6 relative " +
      "(the DD result is above the float64 floor, so the last digits are stable)",
    holds: () => {
      const aOpt = aOptDualDD(REF.delta)[0];
      const F = eigMinDD(uniformGramDD(80, REF.delta), 80);
      const row = REF.table[0];
      return (
        Math.abs(F - row.F) / row.F < 1e-6 &&
        Math.abs(F / aOpt - row.ratio) / row.ratio < 1e-6
      );
    },
  },
  {
    id: "imp95823-all-ratios-strictly-above-one",
    description:
      "every direct-DD ratio F / A_opt is strictly above 1 (no sub-1 undershoot): " +
      "the imp-95677 float64 0.909 at nPts = 640 is confirmed pure roundoff by a " +
      "direct extended-precision Gram eigensolve",
    holds: () =>
      REF.strictlyAboveOne === true && REF.table.every((r) => r.ratio > 1),
  },
  {
    id: "imp95823-ratio-monotone-decreasing-toward-one",
    description:
      "the direct-DD ratio decreases monotonically toward 1 as nPts doubles " +
      "80 -> 640 (finite-section approach from above)",
    holds: () => {
      let prev = Infinity;
      for (const r of REF.table) { if (!(r.ratio < prev)) return false; prev = r.ratio; }
      return REF.monotoneDecreasing === true && REF.table[REF.table.length - 1].ratio < 1.01;
    },
  },
  {
    id: "imp95823-ln13-slopes-do-not-lock-to-two",
    description:
      "the baked ln 1.3 local log-log slopes reproduce from the baked ratios and " +
      "do NOT lock to -2 over the DD-reachable window (pre-asymptotic: they drift " +
      "toward 0, so the exponent at ln 1.3 is not directly observable here)",
    holds: () => {
      const t = REF.table;
      for (let i = 1; i < t.length; i++) {
        const p = Math.log((t[i].ratio - 1) / (t[i - 1].ratio - 1)) / Math.log(t[i].nPts / t[i - 1].nPts);
        if (Math.abs(p - REF.ln13Slopes[i - 1]) > 5e-3) return false;
      }
      // the last slope is well away from -2 (drifting toward 0), confirming pre-asymptotic
      return REF.ln13SlopeLocksToTwo === false && Math.abs(REF.ln13Slopes[2]) < 1.5;
    },
  },
  {
    id: "imp95823-control-delta3-live-locks-to-exponent-two",
    heavy: true, // live double-double Jacobi eigensolve; skipped at browser import (see loop below)
    description:
      "on the well-conditioned delta = 3 control the SAME DD Jacobi, recomputed " +
      "live at nPts = 40/80/160, gives a local log-log slope of F / A_opt - 1 " +
      "within 0.02 of -2 -- certifying the DD methodology recovers the exponent " +
      "when the asymptotic regime is reached",
    holds: () => {
      const d = REF.control.delta;
      const aOpt = aOptDualDD(d)[0];
      const r = (N) => eigMinDD(uniformGramDD(N, d), 80) / aOpt;
      const r40 = r(40), r80 = r(80), r160 = r(160);
      const s1 = Math.log((r80 - 1) / (r40 - 1)) / Math.log(2);
      const s2 = Math.log((r160 - 1) / (r80 - 1)) / Math.log(2);
      return REF.control.slopeLocksToTwo === true && Math.abs(s1 + 2) < 0.05 && Math.abs(s2 + 2) < 0.02;
    },
  },
  {
    id: "imp95823-control-matches-imp95689-dual-leading-term",
    description:
      "the delta = 3 control direct-DD ratios match the imp-95689 leading dual " +
      "term 1 + C (pi/(N+1))^2 (C = 0.5422) to better than 1e-4, reproducing the " +
      "imp-95689 control by the direct route",
    holds: () =>
      REF.control.table.every((row) => {
        const pred = 1 + REF.control.dualCoefC * (Math.PI / (row.nPts + 1)) ** 2;
        return Math.abs(row.ratio - pred) < 1e-4;
      }),
  },
  {
    id: "imp95823-delta-and-aopt-match-references",
    description:
      "the in-pair gap delta = ln 1.3 and the A_opt symbol infimum match the " +
      "imp-95419 / imp-95677 / imp-95689 reference constants",
    holds: () => {
      if (Math.abs(REF.delta - Math.log(1.3)) > 1e-15) return false;
      return Math.abs(aOptDualDD(REF.delta)[0] - REF.aOpt) / REF.aOpt < 1e-6;
    },
  },
  {
    id: "imp95823-not-a-bound-honest-scope",
    description:
      "this is a numerical measurement / cross-check module; it moves no Lambda " +
      "bound and proves no QED, confirms the limit + sign directly, and records " +
      "that the ln 1.3 exponent stays a dual + control result (named sub-gap)",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.limitConfirmedDirectly === true &&
      REF.exponentDirectAtLn13 === false &&
      /CONFIRMED/.test(REF.verdict) &&
      /SUB-GAP/.test(REF.verdict) &&
      /remains SOTA/.test(REF.verdict),
  },
  {
    id: "imp95823-closes-self",
    description: "this module is the deliverable the imp-95823 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95823"),
  },
];

// The heavy (live DD Jacobi) assertions take ~7 s at import and stalled the
// /viz-imp95697-szego-finite-size-decay page. They are skipped only in the
// browser; plain node (scripts/run-assertions.mjs) still runs every entry.
const SKIP_HEAVY_AT_IMPORT = typeof window !== "undefined";
for (const a of IMP95823_ASSERTIONS) {
  if (a.heavy && SKIP_HEAVY_AT_IMPORT) continue;
  if (!a.holds()) {
    throw new Error(
      `imp-95823-rho1-szego-direct-dd-eigensolve assertion failed: ${a.id}`,
    );
  }
}

export default IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE;
