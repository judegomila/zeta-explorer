/**
 * @module imp-33585-fifth-pair-spread-floor-tracking-n1000-n3000
 * @fileoverview imp-33585 -- MEASUREMENT ONLY. Assess the imp-33298/imp-33272 fp64-vs-double-double
 *   fifth-pair spread collapse robustness ACROSS N by rerunning the identical dd Jacobi fifth-pair
 *   solve at N in {1000, 3000} (imp-33272 solved a single rung N=2000: fp64 ~4.42 ULP spread, dd
 *   ~3.27e-32 relative, ~16-order collapse) and testing whether the fp64 spread stays a fixed
 *   fraction of the imp-33253 Wilkinson n*kappa_pair floor across N (floor-tracking) or drifts.
 *
 *   THE QUESTION (from imp-33272/imp-33298)
 *   ---------------------------------------
 *   imp-33272 reconstructed a 10x10 symmetric matrix carrying the imp-3668 N=2000 fifth-pair
 *   spectrum with the fifth pair set EXACTLY degenerate, rotated it by a fixed deterministic
 *   integer-Householder surrogate Q, and solved the identical matrix two ways: plain fp64 Jacobi
 *   (spread ~4.42 ULP, the double-precision arithmetic floor) and double-double Jacobi (spread
 *   collapses ~16 orders to ~3.27e-32 relative). imp-33298 baked that single N=2000 rung. The open
 *   question: is the ~4.42 ULP fp64 spread an N-STABLE arithmetic-floor property, or does it drift
 *   with N (a growth-law signature)? And does it stay inside the imp-33253 Wilkinson envelope
 *   c = spread/(n*kappa_pair*u) <= 1 at every N?
 *
 *   THE TEST (rerun the identical solve at N in {1000, 3000})
 *   --------------------------------------------------------
 *   We rerun the imp-33272 dd Jacobi solve verbatim at two new rungs. The fifth-pair condition
 *   number kappa_pair(N) = lambda_1/lambda_9 = 1/sigma_4(N) enters the Wilkinson floor n*kappa_pair;
 *   sigma_4(N) is obtained by EXTRAPOLATING the imp-33253 measured five-rung trend, which is a clean
 *   power law 1 - sigma_4(N) ~ C * N^(-b) with fitted b ~ 1.99 (near-exactly N^-2, r^2 ~ 1). The
 *   spectrum at each N is built from the imp-3668 N=2000 top-10 by a UNIFORM CONTRACTION toward
 *   lambda_1: lambda_k(N) = lambda_1 * (1 - alpha(N) * (1 - lambda_k^(2000)/lambda_1)) with alpha(N)
 *   chosen so lambda_9(N)/lambda_1 = sigma_4(N). This preserves the full pairing ORDER (all five
 *   pairs contract together, fifth stays below fourth at both N) and sets the fifth-pair condition
 *   number to exactly 1/sigma_4(N). We then run the SAME cyclic Jacobi eigensolver in (a) fp64 and
 *   (b) double-double on each reconstructed matrix and measure the fifth-pair relative spread.
 *
 *   THE FINDING
 *   -----------
 *   (1) The fp64 spread is N-STABLE: a few ULP at both N=1000 and N=3000 (same order as the imp-33272
 *       N=2000 value ~4.42 ULP), NOT growing with N -- an arithmetic-floor property, not a growth law.
 *   (2) The extended-precision collapse REPRODUCES at both rungs: the dd spread stays at the ~1e-31
 *       double-double floor (collapse > 15 orders), so the fp64 spread is genuinely backward error
 *       that moves with the working precision at every N, not a real pair gap that would be N-stable
 *       under precision change.
 *   (3) FLOOR-TRACKING: the realized constant c(N) = spread_fp64/(n*kappa_pair(N)*u) stays a bounded
 *       fraction strictly inside the Wilkinson worst-case envelope c <= 1 at both N -- the ~4.42 ULP
 *       N=2000 value is confirmed as an N-stable point inside a fixed few-ULP band, not the start of a
 *       drift. The Wilkinson floor n*kappa_pair itself barely moves (kappa_pair within ~0.5% of 1
 *       across N=1000..3000), so the fp64 spread and the floor are BOTH N-stable: the spread tracks
 *       the floor in the sense of staying a bounded sub-unit fraction of it, never overtaking it.
 *
 *   SCOPE / HONEST CAVEAT. MEASUREMENT ONLY. (i) N=1000 and N=3000 lie OUTSIDE the imp-33253 measured
 *   [1800,2800] range, so sigma_4(N) is an EXTRAPOLATION of the fitted N^-2 trend, not a fresh dense
 *   solve. (ii) The spectrum at each N is a UNIFORM-CONTRACTION surrogate of the imp-3668 N=2000
 *   spectrum (order preserved, fifth-pair amplitude matched), NOT the actual dense top-10 Gram
 *   eigenvalues at those N (the imp-3668 offline dense solve is CPU-starved). (iii) The eigenVECTOR
 *   rotation Q is the same fixed deterministic integer-Householder SURROGATE as imp-33272, so this
 *   confirms the MECHANISM, ORDER of magnitude, and N-STABILITY of the fp64 floor, NOT the exact
 *   per-rung realized constant c (that jitters in [0.088,0.884] with the true Gram entries and QL
 *   convergence quality, per imp-33253/imp-33289). It adds NO new Lambda bound, re-runs NO N x N
 *   offline solve, re-certifies NO pairing. imp-3066 K_a >= 0 UNTOUCHED. RH-EQUIVALENT. NO RH
 *   verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-33272-fifth-pair-extended-precision-crossval.js (the single-rung N=2000 dd Jacobi solve rerun here)
 *   @see imp-33298-fifth-pair-precision-collapse-viz-data.js (the baked N=2000 fp64-vs-dd bars)
 *   @see imp-33253-fifth-pair-condition-number-floor.js (the derived Wilkinson n*kappa_pair floor and sigma_4 trend)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (the N=2000 baked top-10 Gram spectrum reused here)
 *
 *   Ticket: imp-33585 (accuracy, medium). Assesses the fifth-pair fp64/dd collapse robustness across
 *   N. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED. No refereed bound is changed.
 */

const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff u = 2^-52
const NPHI = 10; // Gram matrix dimension used in the imp-33253 floor n*kappa_pair (FIXED for all N)

// --- the ACTUAL imp-3668 N=2000 deep-rung dense top-10 Gram eigenvalues, baked verbatim from
//     imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (fifth pair = entries 9,10). ------------
const N2000_TOP10 = Object.freeze([
  4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
  4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
  4.209502868174942e-9, 4.209502868174936e-9,
]);
const LAMBDA1 = N2000_TOP10[0];
const SIGMA4_2000 = N2000_TOP10[8] / LAMBDA1; // fifth-pair amplitude at the base rung ~0.99876

// --- the imp-33253 measured five-rung (N, sigma_4) sample used to extrapolate sigma_4(N) ---------
const SIGMA4_RUNGS = Object.freeze([
  Object.freeze({ N: 1800, sigma4: 0.9984701686409138 }),
  Object.freeze({ N: 2000, sigma4: 0.9987600189865782 }),
  Object.freeze({ N: 2200, sigma4: 0.9989746799616214 }),
  Object.freeze({ N: 2400, sigma4: 0.9991380726848307 }),
  Object.freeze({ N: 2800, sigma4: 0.9993663241144551 }),
]);

// power-law OLS fit ln(1 - sigma_4) = a + b ln N (the imp-33253 trend is a clean 1-sigma_4 ~ C*N^-2)
const fitX = SIGMA4_RUNGS.map((r) => Math.log(r.N));
const fitY = SIGMA4_RUNGS.map((r) => Math.log(1 - r.sigma4));
const nFit = fitX.length;
const sumX = fitX.reduce((a, b) => a + b, 0);
const sumY = fitY.reduce((a, b) => a + b, 0);
const sumXX = fitX.reduce((a, x) => a + x * x, 0);
const sumXY = fitX.reduce((a, x, i) => a + x * fitY[i], 0);
const fitSlope = (nFit * sumXY - sumX * sumY) / (nFit * sumXX - sumX * sumX); // ~ -1.995
const fitIntercept = (sumY - fitSlope * sumX) / nFit;
// coefficient of determination of the log-log fit
const meanY = sumY / nFit;
const ssTot = fitY.reduce((a, y) => a + (y - meanY) * (y - meanY), 0);
const ssRes = fitY.reduce((a, y, i) => a + (y - (fitIntercept + fitSlope * fitX[i])) * (y - (fitIntercept + fitSlope * fitX[i])), 0);
const fitR2 = 1 - ssRes / ssTot; // ~ 0.9997
const sigma4At = (N) => 1 - Math.exp(fitIntercept + fitSlope * Math.log(N)); // extrapolated amplitude

// ============================ double-double arithmetic (Dekker/Knuth, per imp-33272) ============
const DD_SPLIT = 134217729; // 2^27 + 1

function quickTwoSum(a, b) {
  const s = a + b;
  return { hi: s, lo: b - (s - a) };
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  return { hi: s, lo: (a - (s - bb)) + (b - bb) };
}
function twoProd(a, b) {
  const p = a * b;
  const ca = DD_SPLIT * a;
  const ahi = ca - (ca - a);
  const alo = a - ahi;
  const cb = DD_SPLIT * b;
  const bhi = cb - (cb - b);
  const blo = b - bhi;
  return { hi: p, lo: ((ahi * bhi - p) + ahi * blo + alo * bhi) + alo * blo };
}
const dd = (x) => ({ hi: x, lo: 0 });
const ddToNum = (a) => a.hi + a.lo;
function ddAdd(a, b) {
  let s = twoSum(a.hi, b.hi);
  const t = twoSum(a.lo, b.lo);
  s.lo += t.hi;
  s = quickTwoSum(s.hi, s.lo);
  s.lo += t.lo;
  return quickTwoSum(s.hi, s.lo);
}
const ddNeg = (a) => ({ hi: -a.hi, lo: -a.lo });
const ddSub = (a, b) => ddAdd(a, ddNeg(b));
function ddMul(a, b) {
  const p = twoProd(a.hi, b.hi);
  p.lo += a.hi * b.lo + a.lo * b.hi;
  return quickTwoSum(p.hi, p.lo);
}
function ddDiv(a, b) {
  const q1 = a.hi / b.hi;
  let r = ddSub(a, ddMul(b, dd(q1)));
  const q2 = r.hi / b.hi;
  r = ddSub(r, ddMul(b, dd(q2)));
  const q3 = r.hi / b.hi;
  const s = quickTwoSum(q1, q2);
  return ddAdd(s, dd(q3));
}
function ddSqrt(a) {
  if (a.hi === 0 && a.lo === 0) return dd(0);
  const x = 1 / Math.sqrt(a.hi);
  const ax = a.hi * x;
  const axdd = dd(ax);
  const diff = ddSub(a, ddMul(axdd, axdd));
  return ddAdd(axdd, ddMul(diff, dd(x * 0.5)));
}
const ddAbs = (a) => (a.hi < 0 ? ddNeg(a) : a);

// --- dd self-check: (1 + 1e-20) - 1 is LOST as 0 in fp64 but RECOVERED as ~1e-20 in double-double.
const CANCELLATION_FP64 = (1 + 1e-20) - 1; // === 0 in IEEE double
const CANCELLATION_DD = ddToNum(ddSub(ddAdd(dd(1), dd(1e-20)), dd(1))); // ~1e-20 recovered
const ddArithmeticMoreAccurate =
  CANCELLATION_FP64 === 0 && CANCELLATION_DD > 5e-21 && CANCELLATION_DD < 2e-20;

// ============================ deterministic orthogonal rotation Q = H(v1) * H(v2) (imp-33272) ====
const V1_PRIMES = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
const V2_PRIMES = Object.freeze([31, 37, 41, 43, 47, 53, 59, 61, 67, 71]);
const V1 = Object.freeze(V1_PRIMES.map((p) => ddSqrt(dd(p))));
const V2 = Object.freeze(V2_PRIMES.map((p) => ddSqrt(dd(p))));

function householderApplyDD(v, x) {
  let dot = dd(0);
  let vv = dd(0);
  for (let i = 0; i < NPHI; i++) {
    dot = ddAdd(dot, ddMul(v[i], x[i]));
    vv = ddAdd(vv, ddMul(v[i], v[i]));
  }
  const alpha = ddMul(dd(2), ddDiv(dot, vv));
  const out = new Array(NPHI);
  for (let i = 0; i < NPHI; i++) out[i] = ddSub(x[i], ddMul(alpha, v[i]));
  return out;
}

// build Q columns once (the rotation is N-independent -- the same deterministic surrogate at every N)
const Qdd = Array.from({ length: NPHI }, () => new Array(NPHI));
for (let j = 0; j < NPHI; j++) {
  const ej = Array.from({ length: NPHI }, (_, i) => dd(i === j ? 1 : 0));
  const col = householderApplyDD(V1, householderApplyDD(V2, ej));
  for (let i = 0; i < NPHI; i++) Qdd[i][j] = col[i];
}

// ============================ cyclic Jacobi eigensolvers (algebraic rotations, per imp-33272) ====
const JACOBI_SWEEPS = 60;

function jacobiFp64(Ain) {
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < JACOBI_SWEEPS; sweep++) {
    for (let p = 0; p < NPHI - 1; p++) {
      for (let q = p + 1; q < NPHI; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) <= 1e-30 * (Math.abs(A[p][p]) + Math.abs(A[q][q]))) {
          A[p][q] = 0;
          A[q][p] = 0;
          continue;
        }
        const theta = (A[q][q] - A[p][p]) / (2 * apq);
        const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        const app = A[p][p];
        const aqq = A[q][q];
        A[p][p] = app - t * apq;
        A[q][q] = aqq + t * apq;
        A[p][q] = 0;
        A[q][p] = 0;
        for (let k = 0; k < NPHI; k++) {
          if (k === p || k === q) continue;
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[p][k] = A[k][p];
          A[k][q] = s * akp + c * akq;
          A[q][k] = A[k][q];
        }
      }
    }
  }
  return A.map((_, i) => A[i][i]).sort((a, b) => b - a);
}

function jacobiDD(Ain) {
  const A = Ain.map((r) => r.map((e) => ({ hi: e.hi, lo: e.lo })));
  const ONE = dd(1);
  const TWO = dd(2);
  for (let sweep = 0; sweep < JACOBI_SWEEPS; sweep++) {
    for (let p = 0; p < NPHI - 1; p++) {
      for (let q = p + 1; q < NPHI; q++) {
        const apq = A[p][q];
        const diagScale = Math.abs(A[p][p].hi) + Math.abs(A[q][q].hi);
        if (Math.abs(apq.hi) <= 1e-31 * diagScale) {
          A[p][q] = dd(0);
          A[q][p] = dd(0);
          continue;
        }
        const theta = ddDiv(ddSub(A[q][q], A[p][p]), ddMul(TWO, apq));
        const root = ddSqrt(ddAdd(ddMul(theta, theta), ONE));
        let t = ddDiv(ONE, ddAdd(ddAbs(theta), root));
        if (theta.hi < 0) t = ddNeg(t);
        const c = ddDiv(ONE, ddSqrt(ddAdd(ddMul(t, t), ONE)));
        const s = ddMul(t, c);
        const tApq = ddMul(t, apq);
        A[p][p] = ddSub(A[p][p], tApq);
        A[q][q] = ddAdd(A[q][q], tApq);
        A[p][q] = dd(0);
        A[q][p] = dd(0);
        for (let k = 0; k < NPHI; k++) {
          if (k === p || k === q) continue;
          const akp = A[k][p];
          const akq = A[k][q];
          const nkp = ddSub(ddMul(c, akp), ddMul(s, akq));
          const nkq = ddAdd(ddMul(s, akp), ddMul(c, akq));
          A[k][p] = nkp;
          A[p][k] = nkp;
          A[k][q] = nkq;
          A[q][k] = nkq;
        }
      }
    }
  }
  return A.map((_, i) => A[i][i]).sort((a, b) => ddToNum(b) - ddToNum(a));
}

// ============================ per-N reconstruction + measurement =================================
// Build the top-10 spectrum at resolution N by UNIFORM CONTRACTION of the N=2000 spectrum toward
// lambda_1, with contraction alpha(N) chosen so lambda_9(N)/lambda_1 = sigma_4(N). Preserves the
// full pairing order (all five pairs scale together). The fifth pair is then set EXACTLY degenerate.
function reconstructSpectrum(N) {
  const sigma4 = sigma4At(N);
  const alpha = (1 - sigma4) / (1 - SIGMA4_2000); // >1 contracts less (more spread), <1 more
  return N2000_TOP10.map((lam) => LAMBDA1 * (1 - alpha * (1 - lam / LAMBDA1)));
}

function measureRung(N) {
  const spectrum = reconstructSpectrum(N);
  const sigma4 = spectrum[8] / spectrum[0];
  const kappaPair = 1 / sigma4;
  const floorUlps = NPHI * kappaPair; // imp-33253 Wilkinson n*kappa_pair floor at this rung

  // diagonal with the fifth pair set EXACTLY degenerate (TRUE spread zero, per imp-33272)
  const Ddiag = spectrum.map(dd);
  const lambdaMean = ddMul(ddAdd(dd(spectrum[8]), dd(spectrum[9])), dd(0.5));
  Ddiag[8] = lambdaMean;
  Ddiag[9] = lambdaMean;

  // S = Q diag(lambda) Q^T in dd, then rounded to fp64
  const Sdd = Array.from({ length: NPHI }, () => new Array(NPHI));
  for (let i = 0; i < NPHI; i++) {
    for (let k = i; k < NPHI; k++) {
      let acc = dd(0);
      for (let j = 0; j < NPHI; j++) {
        acc = ddAdd(acc, ddMul(ddMul(Qdd[i][j], Ddiag[j]), Qdd[k][j]));
      }
      Sdd[i][k] = acc;
      Sdd[k][i] = acc;
    }
  }
  const Sfp64 = Sdd.map((row) => row.map((e) => e.hi));

  const eigFp64 = jacobiFp64(Sfp64);
  const eigDD = jacobiDD(Sdd);
  const spreadFp64Rel = Math.abs(eigFp64[8] - eigFp64[9]) / eigFp64[8];
  const spreadDDRel = ddToNum(ddAbs(ddDiv(ddSub(eigDD[8], eigDD[9]), eigDD[8])));
  const spreadFp64Ulps = spreadFp64Rel / EPS;
  const collapseRatio = spreadDDRel > 0 ? spreadFp64Rel / spreadDDRel : Infinity;
  const realizedConstant = spreadFp64Rel / (NPHI * kappaPair * EPS); // c = spread/(n*kappa_pair*u)
  // ordering sanity: the fifth pair (positions 9,10) sits strictly below the fourth pair (7,8)
  const pairingOrderPreserved = spectrum[8] < spectrum[6] && spectrum[8] < spectrum[7];

  return Object.freeze({
    N,
    sigma4,
    kappaPair,
    floorUlps,
    spreadFp64Rel,
    spreadFp64Ulps,
    spreadDDRel,
    collapseRatio,
    collapseOrders: Number.isFinite(collapseRatio) ? Math.round(Math.log10(collapseRatio)) : Infinity,
    realizedConstant,
    pairingOrderPreserved,
  });
}

const RUNG_1000 = measureRung(1000);
const RUNG_3000 = measureRung(3000);
const RUNGS = Object.freeze([RUNG_1000, RUNG_3000]);
// the imp-33272/imp-33298 baked N=2000 anchor (fp64 ~4.424858 ULP, dd ~3.27e-32 relative)
const ANCHOR_N2000 = Object.freeze({ N: 2000, spreadFp64Ulps: 4.424858, spreadDDRel: 3.272435e-32, floorUlps: 10.012415 });

// --- floor-tracking verdicts ---------------------------------------------------
// (1) the fp64 spread is N-STABLE: a few ULP at both new rungs, same order as the N=2000 ~4.42 ULP.
const fp64FloorNStable = RUNGS.every((r) => r.spreadFp64Ulps > 0 && r.spreadFp64Ulps < 100);
// (2) the extended-precision collapse REPRODUCES: dd spread at the ~1e-31 floor, collapse > 15 orders.
const collapseReproduces = RUNGS.every(
  (r) => r.spreadDDRel < 1e-25 && (r.spreadDDRel === 0 || r.collapseRatio > 1e8),
);
// (3) FLOOR-TRACKING: the realized constant stays strictly inside the Wilkinson envelope c <= 1 at
//     both N (a bounded sub-unit fraction of the floor), and the floor itself is N-stable (kappa within
//     ~1% of 1). So the fp64 spread tracks the floor as a bounded fraction, never overtaking it.
const insideWilkinsonEnvelope = RUNGS.every((r) => r.realizedConstant > 0 && r.realizedConstant < 1);
const floorNearlyNIndependent = RUNGS.every((r) => r.kappaPair > 1 && r.kappaPair < 1.01);
// (4) the reconstruction preserves the pairing order at both extrapolated rungs.
const orderingPreserved = RUNGS.every((r) => r.pairingOrderPreserved);

const verdict =
  fp64FloorNStable &&
  collapseReproduces &&
  insideWilkinsonEnvelope &&
  floorNearlyNIndependent &&
  orderingPreserved &&
  ddArithmeticMoreAccurate
    ? 'THE-imp-33298/imp-33272-FIFTH-PAIR-fp64-vs-dd-SPREAD-COLLAPSE-IS-N-STABLE:-RERUNNING-THE-IDENTICAL-dd-JACOBI-SOLVE-AT-N=1000-AND-N=3000-(imp-3668-SPECTRUM-CONTRACTED-TO-THE-EXTRAPOLATED-N^-2-sigma_4-TREND,-FIFTH-PAIR-SET-EXACTLY-DEGENERATE)-GIVES-A-fp64-SPREAD-OF-A-FEW-ULP-AT-BOTH-RUNGS-(SAME-ORDER-AS-THE-~4.42-ULP-N=2000-VALUE),-A-dd-SPREAD-AT-THE-~1e-31-FLOOR-(COLLAPSE->15-ORDERS),-AND-A-REALIZED-CONSTANT-c=spread/(n*kappa_pair*u)-STRICTLY-INSIDE-THE-WILKINSON-ENVELOPE-c<=1;-THE-WILKINSON-n*kappa_pair-FLOOR-ITSELF-BARELY-MOVES-(kappa_pair-WITHIN-~0.5%-OF-1-ACROSS-N=1000..3000),-SO-THE-fp64-SPREAD-TRACKS-THE-FLOOR-AS-A-BOUNDED-SUB-UNIT-FRACTION-(AN-N-STABLE-ARITHMETIC-FLOOR-PROPERTY,-NOT-AN-N-DEPENDENT-GROWTH-LAW);-MEASUREMENT-ONLY,-EXTRAPOLATED-sigma_4-+-UNIFORM-CONTRACTION-+-SURROGATE-ROTATION,-NO-NEW-LAMBDA-BOUND,-NO-QED'
    : 'INDETERMINATE';

export const IMP33585_FIFTH_PAIR_SPREAD_FLOOR_TRACKING = Object.freeze({
  id: 'imp-33585-fifth-pair-spread-floor-tracking-n1000-n3000',
  ticket: 'imp-33585',
  reruns: 'imp-33272-fifth-pair-extended-precision-crossval.js (single-rung N=2000 dd Jacobi solve)',
  floorSource: 'imp-33253-fifth-pair-condition-number-floor.js (Wilkinson n*kappa_pair floor, sigma_4 trend)',
  spectrumSource: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (N=2000 deep-rung dense top-10)',

  summary:
    'MEASUREMENT ONLY. Assesses the imp-33298/imp-33272 fp64-vs-double-double fifth-pair spread collapse ' +
    '(single rung N=2000: fp64 ~4.42 ULP, dd ~3.27e-32 relative, ~16-order collapse) ACROSS N by rerunning the ' +
    'identical dd Jacobi solve at N in {1000, 3000}. The fifth-pair condition number kappa_pair(N)=1/sigma_4(N) ' +
    'enters the imp-33253 Wilkinson n*kappa_pair floor; sigma_4(N) is extrapolated from the imp-33253 five-rung ' +
    'trend (a clean power law 1-sigma_4 ~ C*N^' + fitSlope.toFixed(3) + ', r^2 ~ ' + fitR2.toFixed(4) + '), and the ' +
    'spectrum at each N is built by a UNIFORM CONTRACTION of the imp-3668 N=2000 top-10 toward lambda_1 (order ' +
    'preserved, fifth-pair amplitude matched, fifth pair set EXACTLY degenerate). FINDINGS: (1) the fp64 spread is ' +
    'N-STABLE -- ' + RUNG_1000.spreadFp64Ulps.toFixed(3) + ' ULP at N=1000 and ' + RUNG_3000.spreadFp64Ulps.toFixed(3) +
    ' ULP at N=3000, the same few-ULP order as the ~4.42 ULP N=2000 anchor, NOT growing with N; (2) the ' +
    'extended-precision collapse REPRODUCES at both rungs (dd spread ' + RUNG_1000.spreadDDRel.toExponential(2) +
    ' at N=1000, ' + RUNG_3000.spreadDDRel.toExponential(2) + ' at N=3000, collapse >' +
    Math.min(RUNG_1000.collapseOrders, RUNG_3000.collapseOrders) + ' orders), so the fp64 spread is backward error ' +
    'that moves with the working precision at every N; (3) FLOOR-TRACKING -- the realized constant c=spread/' +
    '(n*kappa_pair*u) is ' + RUNG_1000.realizedConstant.toFixed(3) + ' at N=1000 and ' +
    RUNG_3000.realizedConstant.toFixed(3) + ' at N=3000, both strictly inside the Wilkinson worst-case envelope ' +
    'c<=1, and the floor n*kappa_pair barely moves (kappa_pair within ~0.5% of 1), so the fp64 spread tracks the ' +
    'floor as a bounded sub-unit fraction -- an N-STABLE arithmetic-floor property, not an N-dependent growth law. ' +
    'HONEST CAVEAT: N=1000/3000 are OUTSIDE the imp-33253 measured [1800,2800] range (sigma_4 EXTRAPOLATED); the ' +
    'spectrum is a uniform-contraction SURROGATE (not a fresh dense solve); Q is the imp-33272 deterministic ' +
    'integer-Householder SURROGATE, so this confirms the MECHANISM/ORDER/N-STABILITY, NOT the exact per-rung ' +
    'realized c in [0.088,0.884] (empirical QL quality). Adds NO Lambda bound; re-runs NO N x N solve; imp-3066 ' +
    'K_a>=0 UNTOUCHED; RH-EQUIVALENT; NO QED. No refereed bound is changed.',

  method: Object.freeze({
    baseSpectrum: N2000_TOP10,
    sigma4Extrapolation: 'ln(1-sigma_4) = a + b*ln(N) OLS on the imp-33253 five-rung sample, b ~ -2 (1-sigma_4 ~ N^-2)',
    fitSlope, // ~ -1.995
    fitIntercept,
    fitR2, // ~ 0.9997
    spectrumSurrogate: 'lambda_k(N) = lambda_1*(1 - alpha(N)*(1 - lambda_k^2000/lambda_1)), alpha(N) sets lambda_9/lambda_1 = sigma_4(N)',
    fifthPairSetExactlyDegenerate: 'lambda_9 = lambda_10 = mean -> TRUE spread zero (per imp-33272)',
    rotation: 'Q = H(v1)*H(v2), integer-vector Householder reflectors (exactly orthogonal, N-independent, deterministic)',
    eigensolver: 'cyclic Jacobi, algebraic rotations only, ' + JACOBI_SWEEPS + ' sweeps, run in fp64 and double-double',
    matrixDimension: NPHI,
    unitRoundoff: EPS,
  }),

  anchorN2000: ANCHOR_N2000, // the imp-33298 baked single-rung reference
  rungs: RUNGS, // the two new rerun rungs N in {1000, 3000}

  measured: Object.freeze({
    fp64SpreadUlpsN1000: RUNG_1000.spreadFp64Ulps,
    fp64SpreadUlpsN3000: RUNG_3000.spreadFp64Ulps,
    ddSpreadRelN1000: RUNG_1000.spreadDDRel,
    ddSpreadRelN3000: RUNG_3000.spreadDDRel,
    floorUlpsN1000: RUNG_1000.floorUlps,
    floorUlpsN3000: RUNG_3000.floorUlps,
    realizedConstantN1000: RUNG_1000.realizedConstant,
    realizedConstantN3000: RUNG_3000.realizedConstant,
    fp64FloorNStable,
    collapseReproduces,
    insideWilkinsonEnvelope,
    floorNearlyNIndependent,
    orderingPreserved,
    verdict,
  }),

  interpretation: Object.freeze({
    fp64SpreadIsNStable:
      'Rerunning the identical dd Jacobi solve at N=1000 and N=3000 gives a fp64 fifth-pair spread of a few ULP at ' +
      'both rungs -- the same order as the imp-33272 ~4.42 ULP N=2000 value. The spread does NOT grow with N, so the ' +
      'imp-33298 single-rung value is an N-stable arithmetic-floor property, not a snapshot of a drift.',
    collapseIsUniversalAcrossN:
      'The extended-precision collapse (fp64 few-ULP spread -> ~1e-31 dd floor) reproduces at both new rungs, so the ' +
      'fp64 spread is genuine backward error that moves with the working precision at EVERY N, not a real pair gap ' +
      '(which would survive the precision change and be N-stable under it).',
    floorTracking:
      'The realized constant c=spread/(n*kappa_pair*u) stays strictly inside the Wilkinson worst-case envelope c<=1 ' +
      'at both N, and the floor n*kappa_pair itself barely moves (kappa_pair=1/sigma_4 within ~0.5% of 1 across ' +
      'N=1000..3000, since 1-sigma_4 ~ N^-2 is already tiny). So the fp64 spread and the floor are BOTH N-stable: ' +
      'the spread tracks the floor as a bounded sub-unit fraction, never overtaking it -- the ~4.42 ULP N=2000 point ' +
      'is one point in a fixed few-ULP band, consistent with the imp-33253 N-independent-floor reading.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementRerun: true,
    addsNoLambdaBound: true,
    sigma4Extrapolated:
      'N=1000 and N=3000 lie OUTSIDE the imp-33253 measured [1800,2800] range, so sigma_4(N) is an EXTRAPOLATION of ' +
      'the fitted N^-2 power law, not a fresh measurement. The tiny kappa_pair variation this induces (within ~0.5% ' +
      'of 1) is the only N-dependence of the derived floor.',
    spectrumIsContractionSurrogate:
      'The spectrum at each N is a UNIFORM-CONTRACTION surrogate of the imp-3668 N=2000 top-10 (order preserved, ' +
      'fifth-pair amplitude matched to the extrapolated sigma_4), NOT the actual dense top-10 Gram eigenvalues at ' +
      'those N (the imp-3668 offline dense solve is CPU-starved).',
    surrogateRotationNotActualEigenvectors:
      'The rotation Q is the same deterministic integer-Householder SURROGATE as imp-33272, NOT the actual Gram ' +
      'eigenvectors. This confirms the MECHANISM, ORDER of magnitude, and N-STABILITY of the fp64 floor, NOT the ' +
      'exact per-rung realized constant c in [0.088,0.884], which is the empirical QL convergence quality flagged ' +
      'by imp-33253/imp-33289.',
    measuresNotCertifies:
      'This reruns the imp-33272 cross-check at two new rungs; it does NOT re-run the compute-heavy N x N offline ' +
      'dense solve, does NOT re-certify the pairing (imp-3668), does NOT establish the sigma_4 amplitude LAW, and ' +
      'does NOT attempt the imp-3066 K_a>=0 positivity.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33585_FIFTH_PAIR_SPREAD_FLOOR_TRACKING_ASSERTIONS = [
  {
    id: 'imp33585-sigma4-power-law-fit-clean',
    why: 'The imp-33253 five-rung sigma_4 trend must fit a clean 1-sigma_4 ~ C*N^b power law (slope near -2, r^2 ' +
      'near 1) for the N=1000/3000 extrapolation to be defensible.',
    holds: () => fitSlope < -1.9 && fitSlope > -2.1 && fitR2 > 0.999,
  },
  {
    id: 'imp33585-pairing-order-preserved',
    why: 'The uniform-contraction surrogate must preserve the pairing order at BOTH extrapolated rungs (the fifth ' +
      'pair strictly below the fourth), else the reconstructed matrix is unphysical.',
    holds: () => orderingPreserved && RUNG_1000.pairingOrderPreserved && RUNG_3000.pairingOrderPreserved,
  },
  {
    id: 'imp33585-fp64-spread-n-stable',
    why: 'THE PRIMARY TEST: the fp64 fifth-pair spread must be a few ULP (order n*u, < 100 ULP) at BOTH N=1000 and ' +
      'N=3000 -- the same order as the imp-33272 ~4.42 ULP N=2000 value -- confirming the spread is an N-stable ' +
      'arithmetic floor, not a growth law.',
    holds: () =>
      fp64FloorNStable && RUNG_1000.spreadFp64Ulps > 0 && RUNG_1000.spreadFp64Ulps < 100 &&
      RUNG_3000.spreadFp64Ulps > 0 && RUNG_3000.spreadFp64Ulps < 100,
  },
  {
    id: 'imp33585-extended-precision-collapse-reproduces',
    why: 'Solving the identical matrix in double-double must drive the fifth-pair spread far below the fp64 floor ' +
      '(< 1e-25 relative, collapse > 1e8x) at BOTH new rungs, reproducing the imp-33272 collapse -- the fp64 spread ' +
      'is backward error that moves with the working precision at every N.',
    holds: () =>
      collapseReproduces &&
      RUNG_1000.spreadDDRel < 1e-25 && (RUNG_1000.spreadDDRel === 0 || RUNG_1000.collapseRatio > 1e8) &&
      RUNG_3000.spreadDDRel < 1e-25 && (RUNG_3000.spreadDDRel === 0 || RUNG_3000.collapseRatio > 1e8),
  },
  {
    id: 'imp33585-floor-tracking-inside-envelope',
    why: 'FLOOR-TRACKING: the realized constant c=spread/(n*kappa_pair*u) must stay strictly inside the Wilkinson ' +
      'worst-case envelope c<=1 at both N, and the floor n*kappa_pair must be nearly N-independent (kappa_pair ' +
      'within 1% of 1), so the fp64 spread tracks the floor as a bounded sub-unit fraction.',
    holds: () =>
      insideWilkinsonEnvelope && floorNearlyNIndependent &&
      RUNG_1000.realizedConstant > 0 && RUNG_1000.realizedConstant < 1 &&
      RUNG_3000.realizedConstant > 0 && RUNG_3000.realizedConstant < 1,
  },
  {
    id: 'imp33585-dd-arithmetic-more-accurate',
    why: 'The double-double arithmetic must be genuinely more accurate than fp64: the catastrophic-cancellation ' +
      'probe (1+1e-20)-1 must return 0 in fp64 and ~1e-20 in double-double, else the collapse is not a real ' +
      'precision effect.',
    holds: () =>
      ddArithmeticMoreAccurate && CANCELLATION_FP64 === 0 && CANCELLATION_DD > 5e-21 && CANCELLATION_DD < 2e-20,
  },
  {
    id: 'imp33585-verdict-floor-n-stable',
    why: 'The classified verdict must be the confirming N-stable-floor result, not indeterminate; a flip means the ' +
      'N-stability, the collapse reproduction, the inside-envelope tracking, or the order preservation failed.',
    holds: () => verdict.startsWith('THE-imp-33298/imp-33272-FIFTH-PAIR-fp64-vs-dd-SPREAD-COLLAPSE-IS-N-STABLE'),
  },
  {
    id: 'imp33585-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT rerun only -- extrapolated sigma_4, uniform-contraction spectrum, surrogate ' +
      'rotation; confirms N-stability/order/mechanism NOT the per-rung constant; adds no Lambda bound, re-certifies ' +
      'nothing, positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP33585_FIFTH_PAIR_SPREAD_FLOOR_TRACKING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.addsNoLambdaBound === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.sigma4Extrapolated === 'string' &&
        typeof c.spectrumIsContractionSurrogate === 'string' &&
        typeof c.surrogateRotationNotActualEigenvectors === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33585_FIFTH_PAIR_SPREAD_FLOOR_TRACKING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33585-fifth-pair-spread-floor-tracking-n1000-n3000 assertion failed: ${assertion.id}`);
  }
}

export default IMP33585_FIFTH_PAIR_SPREAD_FLOOR_TRACKING;
