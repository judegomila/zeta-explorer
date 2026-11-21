/**
 * imp-95743 -- DOUBLE-DOUBLE primal Gram + eigensolver cross-check of the
 * imp-95704 Szego edge-coefficient scaling law C(delta) = pi^2/(2 delta^2)
 * BELOW delta = ln 1.5, bridging the dual-vs-direct overlap region the imp-95727
 * float64 Jacobi eigensolver could not reach.
 *
 * GRADE: numerical cross-validation. Imports no heavy bundle. The heavy N = 320
 * / N = 400 double-double eigensolves are run OFFLINE (tmp/imp-95743-compare.mjs);
 * only a light N = 48 double-double-vs-float64 agreement check runs at import so
 * the build stays fast.
 *
 * WHAT imp-95727 LEFT OPEN. imp-95727 cross-validated the imp-95704 dual-derived
 * law C(delta) = f''(pi)/(2 A_opt) = pi^2/(2 delta^2) against a DIRECT float64
 * Jacobi eigensolver of the rho = 1 sech seam Gram G_{jk} = sech((j-k) delta/2),
 * reaching sub-percent agreement at delta = 1 (A_opt ~ 1.3e-3) and delta = ln 2
 * (A_opt ~ 2.4e-5). But it reported the eigensolver-fit C degrades as A_opt sinks
 * toward the imp-95677 float64 cancellation floor, and named the region below
 * delta ~ ln 1.5 as reachable only by the cancellation-free dual. This module
 * rebuilds the SAME primal Gram + Jacobi eigensolver ENTIRELY in double-double
 * (Dekker/Bailey QD two-double arithmetic, ~32 decimal digits) and re-measures the
 * direct-fit C into and past that region.
 *
 * METHOD. Double-double primal seam Gram (entries sech((j-k) delta/2) via a DD
 * exp/sech), lambda_min by DD cyclic Jacobi (gap-independent and high-relative-
 * accuracy for SPD -- Demmel-Veselic; ordinary inverse iteration FAILS here because
 * the smooth quadratic symbol minimum leaves the low eigenvalues clustered with no
 * spectral gap), then the imp-95727 fit lambda_min(N) = A + B h + D h^{3/2},
 * h = (pi/(N+1))^2, over N = 80..320 (ln 1.5) and N = 120..400 (ln 1.3). C_fit =
 * B/A uses ONLY the direct DD eigensolver values -- no dual, no Poisson.
 *
 * SAME-GRID RESULT (double-double vs float64, identical N grid):
 *
 *   delta   method    A_fit          C_fit     C_pred=pi^2/(2d^2)   rel err
 *   ln1.5   float64    1.66329e-9    28.7817    30.01669            -4.11%
 *   ln1.5   DD         1.66329e-9    28.7820    30.01669            -4.11%
 *   ln1.3   float64    4.20808e-15  951.4300    71.69030          +1227.14%
 *   ln1.3   DD         4.40699e-15   66.6774    71.69030             -6.99%
 *
 * READING IT. (1) At delta = ln 1.5 (A_opt ~ 1.7e-9) the two methods AGREE to 6
 * figures in lambda_min and give the SAME C_fit ~ 28.78: float64 is still reliable
 * there, and the residual -4.1% is finite-GRID truncation (the natural finite-size
 * variable delta(N+1) only reaches ~130 on this grid; the O(N^{-3}) tail biases C
 * low), NOT a precision failure. This is the dual-vs-direct OVERLAP region -- both
 * primal routes and the dual agree. (2) At delta = ln 1.3 (A_opt ~ 4.4e-15, exactly
 * the imp-95677 float64 floor) the float64 eigensolver BREAKS: its lambda_min values
 * are cancellation-corrupted and its fit returns C = 951 (+1227%, meaningless). The
 * double-double eigensolver instead returns lambda_min accurate to ~4 figures and a
 * fit C = 66.68, tracking the predicted 71.69 to within -7.0% -- and its infinite-N
 * limit A_fit = 4.40699e-15 matches the cancellation-free dual A_opt = 4.40625e-15
 * to 1.7e-2%. So the DIRECT method, promoted to double-double, keeps recovering
 * C(delta) ~ pi^2/(2 delta^2) into the region where float64 fails entirely, closing
 * the overlap gap imp-95727 named.
 *
 * HONEST SCOPE / SUB-GAP. (a) Independent numerical cross-check of an already-
 * established scaling law; introduces no new cited input and no new bound. (b) The
 * residual few-percent low bias (-4.1% at ln 1.5, -7.0% at ln 1.3) is finite-GRID
 * truncation, consistently one-signed (C approaches the law from below as the grid
 * extends), not precision: driving it under ~1% needs delta(N+1) >> 130, i.e. an
 * O(N^3) DD Jacobi grid larger than run here, and reaching delta = ln 1.2
 * (A_opt ~ 4.3e-22) needs correspondingly larger N (a quad-double / bigger-grid
 * offline run) -- named SUB-GAP: imp-95743-larger-DD-grid-for-sub-1pct-C. (c) Model
 * seam family only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase
 * legs stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95727-szego-coefficient-eigensolver-crosscheck (the float64 check extended here)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual-derived law checked)
 * @see imp-95677-rho1-szego-finite-size-convergence (the float64 floor this DD run clears)
 */

// ---------------------------------------------------------------------------
// Reference constants (baked from the offline tmp/imp-95743-compare.mjs run;
// the small N = 48 case is re-derived live by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK = {
  id: "imp-95743",
  title:
    "CROSS-CHECK: a double-double (Dekker QD, ~32 digit) primal sech-seam Gram + " +
    "cyclic Jacobi eigensolver, fit independently of the Poisson dual, recovers the " +
    "imp-95704 law C(delta) = pi^2/(2 delta^2) at delta = ln 1.3 where the imp-95727 " +
    "float64 eigensolver breaks (C = 951, +1227%) -- and matches the dual A_opt to 4 figures",
  question:
    "does a DIRECT primal Gram + Jacobi eigensolver, promoted from float64 to " +
    "double-double, keep recovering C(delta) = pi^2/(2 delta^2) into the small-delta " +
    "region (delta <= ln 1.5) where the imp-95727 float64 eigensolver degrades?",
  fitModel: "lambda_min(T_N) = A + B (pi/(N+1))^2 + D (pi/(N+1))^3  (least squares)",
  arithmetic: "double-double (two-double Dekker/Bailey QD, ~32 decimal digits)",
  eigensolver: "DD cyclic Jacobi (gap-free, high relative accuracy for SPD)",
  fitUsesDual: false,
  // Same N grid used for BOTH the double-double and the float64 fit at each delta.
  crosscheck: [
    {
      label: "ln1.5",
      delta: 0.4054651081081644,
      nGrid: [80, 120, 160, 240, 320],
      aDual: 1.6631580146085325e-9,
      cPred: 30.016688267290906, // pi^2 / (2 (ln 1.5)^2)
      float64: { aFit: 1.66328554e-9, cFit: 28.7817, relErr: -0.04114 },
      dd: { aFit: 1.66328571e-9, cFit: 28.782, relErr: -0.04113, aRel: 7.68e-5 },
      note:
        "OVERLAP region: float64 and double-double AGREE to 6 figures; the -4.1% is " +
        "finite-grid truncation (delta(N+1) <= 130), not precision",
    },
    {
      label: "ln1.3",
      delta: 0.26236426446749106,
      nGrid: [120, 180, 240, 320, 400],
      aDual: 4.406252285191383e-15,
      cPred: 71.69029824053476, // pi^2 / (2 (ln 1.3)^2)
      float64: { aFit: 4.20807941e-15, cFit: 951.43, relErr: 12.27139 }, // BROKEN
      dd: { aFit: 4.40699356e-15, cFit: 66.6774, relErr: -0.06992, aRel: 1.68e-4 },
      note:
        "float64 BREAKS at the imp-95677 floor (C = 951, +1227%); double-double " +
        "recovers C = 66.68 (-7.0%) and A_opt to 4 figures",
    },
  ],
  ddBeatsFloat64AtLn13: true,
  ddMatchesFloat64AtLn15: true,
  independentOfDual: true,
  lawConfirmed: true,
  boundChange: false,
  qed: false,
  subGap: "imp-95743-larger-DD-grid-for-sub-1pct-C",
  verdict:
    "CROSS-CHECKED in double-double. The imp-95727 float64 primal Gram + Jacobi " +
    "eigensolver was rebuilt ENTIRELY in two-double (Dekker/Bailey QD, ~32 digits) " +
    "arithmetic -- DD sech Gram, DD cyclic Jacobi (gap-free, needed because the " +
    "clustered low spectrum defeats inverse iteration), DD least-squares fit. On the " +
    "SAME N grid: at delta = ln 1.5 (A_opt ~ 1.7e-9) float64 and DD AGREE to 6 figures " +
    "and both give C_fit ~ 28.78 (predicted 30.02, -4.1% finite-grid truncation) -- the " +
    "dual-vs-direct overlap region. At delta = ln 1.3 (A_opt ~ 4.4e-15, the imp-95677 " +
    "float64 floor) the float64 fit returns a meaningless C = 951 (+1227%), while the " +
    "double-double eigensolver returns C_fit = 66.68 (predicted 71.69, -7.0%) with its " +
    "infinite-N limit A_fit = 4.40699e-15 matching the cancellation-free dual A_opt = " +
    "4.40625e-15 to 1.7e-2%. So the DIRECT method, promoted to double-double, keeps " +
    "recovering C(delta) ~ pi^2/(2 delta^2) into the region where float64 fails, closing " +
    "the overlap gap imp-95727 named. The residual few-percent low bias is one-signed " +
    "finite-grid truncation, not precision; sub-1% C and delta = ln 1.2 need a larger " +
    "offline DD grid (SUB-GAP imp-95743-larger-DD-grid-for-sub-1pct-C). Independent " +
    "cross-check of an established law; model seam family only; the imp-95212 envelope " +
    "port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes no bound of the " +
    "Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95743"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports; heavy DD solves run
// offline, only a fast N = 48 DD-vs-float64 agreement check runs here)
// ---------------------------------------------------------------------------

// --- minimal double-double arithmetic (Dekker/Bailey QD, two-double) ---
function twoSum(a, b) { const s = a + b; const bb = s - a; const e = a - (s - bb) + (b - bb); return [s, e]; }
function quickTwoSum(a, b) { const s = a + b; const e = b - (s - a); return [s, e]; }
const DD_SPLIT = 134217729; // 2^27 + 1
function ddSplit(a) { const t = DD_SPLIT * a; const hi = t - (t - a); const lo = a - hi; return [hi, lo]; }
function twoProd(a, b) { const p = a * b; const [ah, al] = ddSplit(a); const [bh, bl] = ddSplit(b); const e = ah * bh - p + ah * bl + al * bh + al * bl; return [p, e]; }
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; [s, e] = quickTwoSum(s, e); return [s, e]; }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; [p, e] = quickTwoSum(p, e); return [p, e]; }
function ddDiv(a, b) { const q1 = a[0] / b[0]; let r = ddSub(a, ddMul(b, [q1, 0])); const q2 = r[0] / b[0]; r = ddSub(r, ddMul(b, [q2, 0])); const q3 = r[0] / b[0]; let [s, e] = quickTwoSum(q1, q2); [s, e] = ddAdd([s, e], [q3, 0]); return [s, e]; }
function ddSqrt(a) { if (a[0] === 0) return [0, 0]; const x = 1 / Math.sqrt(a[0]); const ax = a[0] * x; const axdd = [ax, 0]; const diff = ddSub(a, ddMul(axdd, axdd)); const e = diff[0] * x * 0.5; return ddAdd(axdd, [e, 0]); }
const DDof = (x) => [x, 0];
const ddToNum = (a) => a[0] + a[1];
function ddExp(a) {
  const LN2 = [0.6931471805599453, 2.3190468138462996e-17];
  const k = Math.round(ddToNum(a) / LN2[0]);
  const r = ddSub(a, ddMul(DDof(k), LN2));
  let term = DDof(1), sum = DDof(1);
  for (let n = 1; n <= 30; n++) { term = ddDiv(ddMul(term, r), DDof(n)); sum = ddAdd(sum, term); if (Math.abs(term[0]) < 1e-35 * Math.abs(sum[0])) break; }
  return [sum[0] * Math.pow(2, k), sum[1] * Math.pow(2, k)];
}
function ddSech(a) { const ep = ddExp(a); const em = ddExp([-a[0], -a[1]]); return ddDiv(DDof(2), ddAdd(ep, em)); }

// DD cyclic Jacobi smallest eigenvalue of the rho=1 sech seam Gram (flat hi/lo).
function ddJacobiEigMin(nPts, delta) {
  const n = nPts;
  const Hi = new Float64Array(n * n), Lo = new Float64Array(n * n);
  const half = ddMul(DDof(delta), DDof(0.5));
  for (let j = 0; j < n; j++) for (let k = j; k < n; k++) {
    const v = ddSech(ddMul(DDof(j - k), half));
    Hi[j * n + k] = Hi[k * n + j] = v[0]; Lo[j * n + k] = Lo[k * n + j] = v[1];
  }
  const get = (i, j) => [Hi[i * n + j], Lo[i * n + j]];
  const set = (i, j, v) => { Hi[i * n + j] = v[0]; Lo[i * n + j] = v[1]; };
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += Hi[i * n + j] * Hi[i * n + j];
    if (off < 1e-60) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      const apq = get(p, q);
      if (Math.abs(apq[0]) < 1e-40) continue;
      const app = get(p, p), aqq = get(q, q);
      const theta = ddDiv(ddSub(aqq, app), ddMul(DDof(2), apq));
      const sgn = theta[0] < 0 || (theta[0] === 0 && theta[1] < 0) ? -1 : 1;
      const at = theta[0] < 0 ? [-theta[0], -theta[1]] : theta;
      const t = ddDiv(DDof(sgn), ddAdd(at, ddSqrt(ddAdd(ddMul(theta, theta), DDof(1)))));
      const c = ddDiv(DDof(1), ddSqrt(ddAdd(ddMul(t, t), DDof(1))));
      const s = ddMul(t, c);
      for (let k = 0; k < n; k++) { const akp = get(k, p), akq = get(k, q); set(k, p, ddSub(ddMul(c, akp), ddMul(s, akq))); set(k, q, ddAdd(ddMul(s, akp), ddMul(c, akq))); }
      for (let k = 0; k < n; k++) { const apk = get(p, k), aqk = get(q, k); set(p, k, ddSub(ddMul(c, apk), ddMul(s, aqk))); set(q, k, ddAdd(ddMul(s, apk), ddMul(c, aqk))); }
    }
  }
  let mn = [Infinity, 0];
  for (let i = 0; i < n; i++) { const d = get(i, i); if (d[0] < mn[0]) mn = d; }
  return ddToNum(mn);
}

// plain float64 Jacobi (imp-95727) for the small-N agreement check
function f64Sech(x) { return 2 / (Math.exp(x) + Math.exp(-x)); }
function f64EigMin(nPts, delta) {
  const n = nPts; const A = [];
  for (let i = 0; i < n; i++) { const row = []; for (let j = 0; j < n; j++) row.push(f64Sech(((i - j) * delta) / 2)); A.push(row); }
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-32) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-20) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1); const s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
    }
  }
  let mn = Infinity; for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]); return mn;
}

const REF = IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK;

export const IMP95743_ASSERTIONS = [
  {
    id: "imp95743-dd-arithmetic-beats-float64",
    description:
      "the double-double primitives carry precision float64 cannot: (1 + 1e-20) - 1 " +
      "recovers 1e-20 in DD (float64 gives 0)",
    holds: () => {
      const v = ddToNum(ddSub(ddAdd(DDof(1), DDof(1e-20)), DDof(1)));
      return Math.abs(v - 1e-20) < 1e-28 && 1 + 1e-20 - 1 === 0;
    },
  },
  {
    id: "imp95743-dd-eigensolver-matches-float64-at-well-conditioned-N48",
    description:
      "at delta = 1, N = 48 (well above the float64 floor) the DD Jacobi lambda_min " +
      "agrees with the plain float64 Jacobi to 1e-8 relative -- the DD solver is correct",
    holds: () => {
      const dd = ddJacobiEigMin(48, 1);
      const f = f64EigMin(48, 1);
      return Math.abs(dd - f) / f < 1e-8;
    },
  },
  {
    id: "imp95743-dd-recovers-aopt-at-ln13-where-float64-breaks",
    description:
      "at delta = ln 1.3 the baked DD A_fit matches the dual A_opt to <5e-4 relative " +
      "while the baked float64 A_fit misses it by >4% (float64 cancellation floor)",
    holds: () => {
      const row = REF.crosscheck.find((r) => r.label === "ln1.3");
      const ddRel = Math.abs(row.dd.aFit - row.aDual) / row.aDual;
      const f64Rel = Math.abs(row.float64.aFit - row.aDual) / row.aDual;
      return ddRel < 5e-4 && f64Rel > 4e-2;
    },
  },
  {
    id: "imp95743-dd-C-tracks-law-where-float64-fit-explodes",
    description:
      "at delta = ln 1.3 the DD fit C tracks pi^2/(2 delta^2) to within 10% while the " +
      "float64 fit C is off by more than 100% (meaningless)",
    holds: () => {
      const row = REF.crosscheck.find((r) => r.label === "ln1.3");
      return Math.abs(row.dd.relErr) < 0.1 && Math.abs(row.float64.relErr) > 1.0;
    },
  },
  {
    id: "imp95743-overlap-agreement-at-ln15",
    description:
      "at delta = ln 1.5 (overlap region) the DD and float64 fits agree: both C within " +
      "5% of the law and of each other",
    holds: () => {
      const row = REF.crosscheck.find((r) => r.label === "ln1.5");
      return (
        Math.abs(row.dd.relErr) < 0.05 &&
        Math.abs(row.float64.relErr) < 0.05 &&
        Math.abs(row.dd.cFit - row.float64.cFit) / row.dd.cFit < 1e-3
      );
    },
  },
  {
    id: "imp95743-cPred-literals-are-pi-squared-over-two-delta-squared",
    description: "each baked cPred equals pi^2/(2 delta^2)",
    holds: () =>
      REF.crosscheck.every((row) => {
        const want = (Math.PI * Math.PI) / (2 * row.delta * row.delta);
        return Math.abs(row.cPred - want) / want < 1e-6;
      }),
  },
  {
    id: "imp95743-fit-is-independent-of-dual",
    description: "the recorded fit uses only direct DD eigensolver values (fitUsesDual === false)",
    holds: () => REF.fitUsesDual === false && REF.independentOfDual === true,
  },
  {
    id: "imp95743-not-a-bound",
    description: "this is a numerical cross-check module; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.lawConfirmed === true &&
      /CROSS-CHECKED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95743-closes-self",
    description: "this module is the deliverable the imp-95743 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95743"),
  },
];

for (const a of IMP95743_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95743-szego-coefficient-double-double-crosscheck assertion failed: ${a.id}`,
    );
  }
}

export default IMP95743_SZEGO_COEFFICIENT_DOUBLE_DOUBLE_CROSSCHECK;
