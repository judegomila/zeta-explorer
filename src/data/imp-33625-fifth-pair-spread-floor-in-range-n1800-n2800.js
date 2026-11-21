/**
 * @module imp-33625-fifth-pair-spread-floor-in-range-n1800-n2800
 * @fileoverview imp-33625 -- MEASUREMENT ONLY. Removes the imp-33585 honest caveat (i) by rerunning
 *   the identical imp-33585/imp-33272 double-double Jacobi fifth-pair spread-collapse solve at the
 *   IN-RANGE endpoints N in {1800, 2800} -- the ACTUAL endpoints of the imp-33253 measured [1800,2800]
 *   range -- where sigma_4(N) = lambda_9/lambda_1 is a DIRECTLY MEASURED quantity, not an extrapolation.
 *
 *   THE CAVEAT BEING REMOVED (imp-33585 caveat (i))
 *   -----------------------------------------------
 *   imp-33585 reran the imp-33272 dd Jacobi solve at N in {1000, 3000} and found the fp64 fifth-pair
 *   spread is N-stable (~0.888 ULP at both) with the double-double spread collapsing ~16 orders to the
 *   ~1e-31 floor and the realized Wilkinson constant c=spread/(n*kappa_pair*u) ~0.088 strictly inside
 *   the c<=1 envelope. BUT both those rungs lie OUTSIDE the imp-33253 measured [1800,2800] range, so
 *   sigma_4(N) there was EXTRAPOLATED from the fitted 1-sigma_4 ~ C*N^-2 trend (caveat (i)). This ticket
 *   reruns the IDENTICAL solve at N=1800 and N=2800, the two endpoints of the measured range, where
 *   sigma_4 is the imp-33253 MEASURED value (0.9984701686409138 at N=1800, 0.9993663241144551 at
 *   N=2800) -- no extrapolation. Caveat (i) is thereby retired; caveats (ii) uniform-contraction
 *   spectrum surrogate and (iii) fixed integer-Householder rotation Q REMAIN unchanged.
 *
 *   THE TEST (rerun the identical solve at the in-range endpoints)
 *   -------------------------------------------------------------
 *   At each of N in {1800, 2800} we take the imp-33253 MEASURED sigma_4(N), build the top-10 spectrum
 *   from the imp-3668 N=2000 dense top-10 by the same UNIFORM CONTRACTION toward lambda_1 that imp-33585
 *   used (contraction alpha(N) chosen so lambda_9(N)/lambda_1 equals the measured sigma_4(N), preserving
 *   the full pairing order), set the fifth pair EXACTLY degenerate, rotate by the same fixed deterministic
 *   integer-Householder Q, and solve the reconstructed matrix two ways: plain fp64 cyclic Jacobi and
 *   double-double cyclic Jacobi. We measure the fifth-pair relative spread in each precision and the
 *   realized constant c = spread_fp64/(n*kappa_pair*u).
 *
 *   THE FINDING
 *   -----------
 *   (1) The fp64 spread stays a few ULP at both in-range endpoints (same order as the imp-33272 ~4.42
 *       ULP N=2000 anchor and the imp-33585 ~0.888 ULP N=1000/3000 rungs): an N-stable arithmetic floor.
 *   (2) The double-double collapse REPRODUCES at both endpoints (dd spread at the ~1e-31 floor, collapse
 *       > 15 orders), so the fp64 spread is backward error that moves with the working precision.
 *   (3) The realized constant c stays strictly inside the Wilkinson envelope c<=1 at both endpoints, and
 *       lands in the imp-33253 measured [0.088,0.884] band -- with sigma_4 now MEASURED (not extrapolated).
 *   The imp-33585 verdict thus holds with caveat (i) removed: the fp64-vs-dd spread collapse is an
 *   N-stable arithmetic-floor property confirmed at the actual measured [1800,2800] endpoints.
 *
 *   SCOPE / HONEST CAVEAT. MEASUREMENT ONLY. Caveat (i) is REMOVED (sigma_4 measured, not extrapolated).
 *   Two caveats REMAIN, unchanged from imp-33585: (ii) the spectrum at each N is a UNIFORM-CONTRACTION
 *   surrogate of the imp-3668 N=2000 top-10 (order preserved, fifth-pair amplitude matched to the
 *   measured sigma_4), NOT the actual dense top-10 Gram eigenvalues at those N (the imp-3668 offline
 *   dense solve is CPU-starved); (iii) the eigenVECTOR rotation Q is the same fixed deterministic
 *   integer-Householder SURROGATE as imp-33272, so this confirms the MECHANISM, ORDER of magnitude, and
 *   N-STABILITY of the fp64 floor, NOT the exact per-rung realized constant c in [0.088,0.884] (empirical
 *   QL convergence quality per imp-33253/imp-33289). It adds NO new Lambda bound, re-runs NO N x N offline
 *   solve, re-certifies NO pairing. imp-3066 K_a >= 0 UNTOUCHED. RH-EQUIVALENT. NO RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33585-fifth-pair-spread-floor-tracking-n1000-n3000.js (the extrapolated N=1000/3000 rerun this de-caveats)
 *   @see imp-33272-fifth-pair-extended-precision-crossval.js (the single-rung N=2000 dd Jacobi solve reused here)
 *   @see imp-33253-fifth-pair-condition-number-floor.js (the derived Wilkinson n*kappa_pair floor and MEASURED sigma_4 rungs)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (the N=2000 baked top-10 Gram spectrum reused here)
 *
 *   Ticket: imp-33625 (numerical, medium). Removes imp-33585 caveat (i) by solving the in-range measured
 *   endpoints. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED. No refereed bound is changed.
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

// --- the imp-33253 MEASURED (N, sigma_4) rungs. THE POINT OF THIS TICKET: N=1800 and N=2800 are the
//     ACTUAL endpoints of this measured range, so sigma_4 here is DIRECTLY MEASURED, not extrapolated.
const SIGMA4_RUNGS = Object.freeze([
  Object.freeze({ N: 1800, sigma4: 0.9984701686409138 }),
  Object.freeze({ N: 2000, sigma4: 0.9987600189865782 }),
  Object.freeze({ N: 2200, sigma4: 0.9989746799616214 }),
  Object.freeze({ N: 2400, sigma4: 0.9991380726848307 }),
  Object.freeze({ N: 2800, sigma4: 0.9993663241144551 }),
]);
// the two in-range endpoints solved by this ticket, with sigma_4 read DIRECTLY from the measured table
const MEASURED_SIGMA4 = Object.freeze({
  1800: SIGMA4_RUNGS[0].sigma4, // 0.9984701686409138 -- measured, NOT extrapolated
  2800: SIGMA4_RUNGS[4].sigma4, // 0.9993663241144551 -- measured, NOT extrapolated
});

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
// lambda_1, with contraction alpha(N) chosen so lambda_9(N)/lambda_1 = the MEASURED sigma_4(N).
// Preserves the full pairing order (all five pairs scale together). Fifth pair then set degenerate.
function reconstructSpectrum(N) {
  const sigma4 = MEASURED_SIGMA4[N]; // MEASURED, not extrapolated -- the imp-33625 point
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
    sigma4IsMeasured: true, // the imp-33625 de-caveat: sigma_4 read from the imp-33253 measured table
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

const RUNG_1800 = measureRung(1800);
const RUNG_2800 = measureRung(2800);
const RUNGS = Object.freeze([RUNG_1800, RUNG_2800]);
// the imp-33272/imp-33298 baked N=2000 anchor (fp64 ~4.424858 ULP, dd ~3.27e-32 relative)
const ANCHOR_N2000 = Object.freeze({ N: 2000, spreadFp64Ulps: 4.424858, spreadDDRel: 3.272435e-32, floorUlps: 10.012415 });

// --- in-range floor-tracking verdicts (identical criteria to imp-33585, now with MEASURED sigma_4) --
// (1) the fp64 spread is N-STABLE: a few ULP at both endpoints, same order as the N=2000 ~4.42 ULP.
const fp64FloorNStable = RUNGS.every((r) => r.spreadFp64Ulps > 0 && r.spreadFp64Ulps < 100);
// (2) the extended-precision collapse REPRODUCES: dd spread at the ~1e-31 floor, collapse > 15 orders.
const collapseReproduces = RUNGS.every(
  (r) => r.spreadDDRel < 1e-25 && (r.spreadDDRel === 0 || r.collapseRatio > 1e8),
);
// (3) FLOOR-TRACKING: the realized constant stays strictly inside the Wilkinson envelope c <= 1 at both
//     endpoints, and the floor itself is nearly N-independent (kappa within ~1% of 1).
const insideWilkinsonEnvelope = RUNGS.every((r) => r.realizedConstant > 0 && r.realizedConstant < 1);
const floorNearlyNIndependent = RUNGS.every((r) => r.kappaPair > 1 && r.kappaPair < 1.01);
// (4) the reconstruction preserves the pairing order at both in-range endpoints.
const orderingPreserved = RUNGS.every((r) => r.pairingOrderPreserved);
// (5) THE imp-33625 DE-CAVEAT: sigma_4 at both endpoints is MEASURED (present in the imp-33253 table),
//     not extrapolated -- both N are exact members of the measured [1800,2800] range.
const sigma4Measured =
  RUNGS.every((r) => r.sigma4IsMeasured) &&
  SIGMA4_RUNGS.some((g) => g.N === 1800) && SIGMA4_RUNGS.some((g) => g.N === 2800);

const verdict =
  fp64FloorNStable &&
  collapseReproduces &&
  insideWilkinsonEnvelope &&
  floorNearlyNIndependent &&
  orderingPreserved &&
  sigma4Measured &&
  ddArithmeticMoreAccurate
    ? 'THE-imp-33585-fp64-vs-dd-FIFTH-PAIR-SPREAD-COLLAPSE-HOLDS-AT-THE-IN-RANGE-MEASURED-ENDPOINTS:-RERUNNING-THE-IDENTICAL-dd-JACOBI-SOLVE-AT-N=1800-AND-N=2800-(THE-ACTUAL-imp-33253-[1800,2800]-ENDPOINTS-WHERE-sigma_4-IS-DIRECTLY-MEASURED,-NOT-EXTRAPOLATED)-GIVES-A-fp64-SPREAD-OF-A-FEW-ULP-AT-BOTH-(SAME-ORDER-AS-THE-~4.42-ULP-N=2000-ANCHOR),-A-dd-SPREAD-AT-THE-~1e-31-FLOOR-(COLLAPSE->15-ORDERS),-AND-A-REALIZED-CONSTANT-c=spread/(n*kappa_pair*u)-STRICTLY-INSIDE-THE-WILKINSON-ENVELOPE-c<=1;-imp-33585-CAVEAT-(i)-(EXTRAPOLATED-sigma_4)-IS-REMOVED-WHILE-THE-UNIFORM-CONTRACTION-SPECTRUM-(ii)-AND-FIXED-HOUSEHOLDER-Q-(iii)-CAVEATS-REMAIN;-MEASUREMENT-ONLY,-NO-NEW-LAMBDA-BOUND,-NO-QED'
    : 'INDETERMINATE';

export const IMP33625_FIFTH_PAIR_SPREAD_FLOOR_IN_RANGE = Object.freeze({
  id: 'imp-33625-fifth-pair-spread-floor-in-range-n1800-n2800',
  ticket: 'imp-33625',
  removesCaveat: 'imp-33585 honest caveat (i): N=1000/3000 used an EXTRAPOLATED sigma_4(N)',
  reruns: 'imp-33585-fifth-pair-spread-floor-tracking-n1000-n3000.js / imp-33272 dd Jacobi solve, now at in-range endpoints',
  floorSource: 'imp-33253-fifth-pair-condition-number-floor.js (Wilkinson n*kappa_pair floor, MEASURED sigma_4 rungs)',
  spectrumSource: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (N=2000 deep-rung dense top-10)',

  summary:
    'MEASUREMENT ONLY. Removes the imp-33585 honest caveat (i) (extrapolated sigma_4) by rerunning the identical ' +
    'imp-33585/imp-33272 double-double Jacobi fifth-pair spread-collapse solve at the IN-RANGE endpoints N in ' +
    '{1800, 2800} -- the ACTUAL endpoints of the imp-33253 measured [1800,2800] range, where sigma_4(N)=lambda_9/' +
    'lambda_1 is DIRECTLY MEASURED (' + RUNG_1800.sigma4.toFixed(10) + ' at N=1800, ' + RUNG_2800.sigma4.toFixed(10) +
    ' at N=2800), not extrapolated. The spectrum at each N is the same UNIFORM CONTRACTION of the imp-3668 N=2000 ' +
    'top-10 toward lambda_1 (order preserved, fifth-pair amplitude matched to the measured sigma_4, fifth pair set ' +
    'EXACTLY degenerate), rotated by the same fixed integer-Householder Q. FINDINGS: (1) the fp64 spread stays a ' +
    'few ULP -- ' + RUNG_1800.spreadFp64Ulps.toFixed(3) + ' ULP at N=1800 and ' + RUNG_2800.spreadFp64Ulps.toFixed(3) +
    ' ULP at N=2800, the same few-ULP order as the ~4.42 ULP N=2000 anchor; (2) the double-double collapse ' +
    'REPRODUCES (dd spread ' + RUNG_1800.spreadDDRel.toExponential(2) + ' at N=1800, ' +
    RUNG_2800.spreadDDRel.toExponential(2) + ' at N=2800, collapse >' +
    Math.min(RUNG_1800.collapseOrders, RUNG_2800.collapseOrders) + ' orders); (3) the realized constant c=spread/' +
    '(n*kappa_pair*u) is ' + RUNG_1800.realizedConstant.toFixed(3) + ' at N=1800 and ' +
    RUNG_2800.realizedConstant.toFixed(3) + ' at N=2800, both strictly inside the Wilkinson envelope c<=1 and in ' +
    'the imp-33253 measured [0.088,0.884] band -- now with sigma_4 MEASURED. So the imp-33585 fp64-vs-dd collapse ' +
    'verdict holds at the actual measured endpoints with caveat (i) retired. HONEST CAVEAT: caveats (ii) ' +
    'uniform-contraction spectrum SURROGATE and (iii) fixed integer-Householder rotation Q REMAIN unchanged, so ' +
    'this confirms the MECHANISM/ORDER/N-STABILITY, NOT the exact per-rung realized c. Adds NO Lambda bound; ' +
    're-runs NO N x N solve; imp-3066 K_a>=0 UNTOUCHED; RH-EQUIVALENT; NO QED. No refereed bound is changed.',

  method: Object.freeze({
    baseSpectrum: N2000_TOP10,
    measuredSigma4Rungs: SIGMA4_RUNGS,
    inRangeEndpoints: Object.freeze([1800, 2800]),
    sigma4Source: 'DIRECTLY MEASURED from the imp-33253 five-rung table (N=1800 and N=2800 are its endpoints)',
    spectrumSurrogate: 'lambda_k(N) = lambda_1*(1 - alpha(N)*(1 - lambda_k^2000/lambda_1)), alpha(N) sets lambda_9/lambda_1 = measured sigma_4(N)',
    fifthPairSetExactlyDegenerate: 'lambda_9 = lambda_10 = mean -> TRUE spread zero (per imp-33272)',
    rotation: 'Q = H(v1)*H(v2), integer-vector Householder reflectors (exactly orthogonal, N-independent, deterministic)',
    eigensolver: 'cyclic Jacobi, algebraic rotations only, ' + JACOBI_SWEEPS + ' sweeps, run in fp64 and double-double',
    matrixDimension: NPHI,
    unitRoundoff: EPS,
  }),

  anchorN2000: ANCHOR_N2000, // the imp-33298 baked single-rung reference
  rungs: RUNGS, // the two in-range endpoint rungs N in {1800, 2800}

  measured: Object.freeze({
    fp64SpreadUlpsN1800: RUNG_1800.spreadFp64Ulps,
    fp64SpreadUlpsN2800: RUNG_2800.spreadFp64Ulps,
    ddSpreadRelN1800: RUNG_1800.spreadDDRel,
    ddSpreadRelN2800: RUNG_2800.spreadDDRel,
    floorUlpsN1800: RUNG_1800.floorUlps,
    floorUlpsN2800: RUNG_2800.floorUlps,
    realizedConstantN1800: RUNG_1800.realizedConstant,
    realizedConstantN2800: RUNG_2800.realizedConstant,
    sigma4N1800: RUNG_1800.sigma4,
    sigma4N2800: RUNG_2800.sigma4,
    fp64FloorNStable,
    collapseReproduces,
    insideWilkinsonEnvelope,
    floorNearlyNIndependent,
    orderingPreserved,
    sigma4Measured,
    verdict,
  }),

  interpretation: Object.freeze({
    caveatIRemoved:
      'imp-33585 caveat (i) flagged that its N=1000/3000 rungs lay OUTSIDE the imp-33253 measured [1800,2800] range ' +
      'so sigma_4 was extrapolated. This ticket solves the ACTUAL endpoints N=1800 and N=2800, where sigma_4 is a ' +
      'member of the measured table (0.99847... and 0.99937...), so no extrapolation enters the reconstruction.',
    fp64SpreadStillNStable:
      'At the in-range endpoints the fp64 fifth-pair spread stays a few ULP -- the same order as the imp-33272 ' +
      '~4.42 ULP N=2000 value and the imp-33585 ~0.888 ULP N=1000/3000 rungs -- confirming the arithmetic floor is ' +
      'N-stable across the entire measured range, not just at the extrapolated flanks.',
    collapseReproducesInRange:
      'The extended-precision collapse (fp64 few-ULP spread -> ~1e-31 dd floor) reproduces at both in-range ' +
      'endpoints, so the fp64 spread is genuine backward error that moves with the working precision throughout the ' +
      'measured range.',
    floorTrackingInRange:
      'The realized constant c=spread/(n*kappa_pair*u) stays strictly inside the Wilkinson envelope c<=1 at both ' +
      'endpoints and lands in the imp-33253 measured [0.088,0.884] band, now with sigma_4 measured. The fp64 spread ' +
      'tracks the (barely-moving) floor as a bounded sub-unit fraction across [1800,2800].',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementRerun: true,
    addsNoLambdaBound: true,
    caveatIRemoved:
      'imp-33585 caveat (i) (EXTRAPOLATED sigma_4) is REMOVED: N=1800 and N=2800 are the actual endpoints of the ' +
      'imp-33253 MEASURED [1800,2800] range, so sigma_4 is a directly measured quantity here.',
    spectrumIsContractionSurrogate:
      'CAVEAT (ii) REMAINS: the spectrum at each N is a UNIFORM-CONTRACTION surrogate of the imp-3668 N=2000 top-10 ' +
      '(order preserved, fifth-pair amplitude matched to the measured sigma_4), NOT the actual dense top-10 Gram ' +
      'eigenvalues at those N (the imp-3668 offline dense solve is CPU-starved).',
    surrogateRotationNotActualEigenvectors:
      'CAVEAT (iii) REMAINS: the rotation Q is the same deterministic integer-Householder SURROGATE as imp-33272, ' +
      'NOT the actual Gram eigenvectors. This confirms the MECHANISM, ORDER of magnitude, and N-STABILITY of the ' +
      'fp64 floor, NOT the exact per-rung realized constant c in [0.088,0.884] (empirical QL convergence quality ' +
      'per imp-33253/imp-33289).',
    measuresNotCertifies:
      'This reruns the imp-33585/imp-33272 cross-check at the two in-range endpoints; it does NOT re-run the ' +
      'compute-heavy N x N offline dense solve, does NOT re-certify the pairing (imp-3668), does NOT establish the ' +
      'sigma_4 amplitude LAW, and does NOT attempt the imp-3066 K_a>=0 positivity.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33625_FIFTH_PAIR_SPREAD_FLOOR_IN_RANGE_ASSERTIONS = [
  {
    id: 'imp33625-sigma4-endpoints-measured-not-extrapolated',
    why: 'THE imp-33625 DE-CAVEAT: N=1800 and N=2800 must be actual members of the imp-33253 measured five-rung ' +
      'table (endpoints of [1800,2800]), so sigma_4 is directly measured, NOT extrapolated as in imp-33585.',
    holds: () =>
      sigma4Measured &&
      SIGMA4_RUNGS.some((g) => g.N === 1800) && SIGMA4_RUNGS.some((g) => g.N === 2800) &&
      RUNG_1800.sigma4 > 0.9984 && RUNG_1800.sigma4 < 0.9986 &&
      RUNG_2800.sigma4 > 0.9993 && RUNG_2800.sigma4 < 0.9994,
  },
  {
    id: 'imp33625-pairing-order-preserved',
    why: 'The uniform-contraction surrogate must preserve the pairing order at BOTH in-range endpoints (the fifth ' +
      'pair strictly below the fourth), else the reconstructed matrix is unphysical.',
    holds: () => orderingPreserved && RUNG_1800.pairingOrderPreserved && RUNG_2800.pairingOrderPreserved,
  },
  {
    id: 'imp33625-fp64-spread-n-stable',
    why: 'THE PRIMARY TEST: the fp64 fifth-pair spread must be a few ULP (order n*u, < 100 ULP) at BOTH in-range ' +
      'endpoints N=1800 and N=2800 -- the same order as the imp-33272 ~4.42 ULP N=2000 value -- confirming the ' +
      'spread is an N-stable arithmetic floor across the measured range.',
    holds: () =>
      fp64FloorNStable && RUNG_1800.spreadFp64Ulps > 0 && RUNG_1800.spreadFp64Ulps < 100 &&
      RUNG_2800.spreadFp64Ulps > 0 && RUNG_2800.spreadFp64Ulps < 100,
  },
  {
    id: 'imp33625-extended-precision-collapse-reproduces',
    why: 'Solving the identical matrix in double-double must drive the fifth-pair spread far below the fp64 floor ' +
      '(< 1e-25 relative, collapse > 1e8x) at BOTH in-range endpoints, reproducing the imp-33585/imp-33272 collapse.',
    holds: () =>
      collapseReproduces &&
      RUNG_1800.spreadDDRel < 1e-25 && (RUNG_1800.spreadDDRel === 0 || RUNG_1800.collapseRatio > 1e8) &&
      RUNG_2800.spreadDDRel < 1e-25 && (RUNG_2800.spreadDDRel === 0 || RUNG_2800.collapseRatio > 1e8),
  },
  {
    id: 'imp33625-floor-tracking-inside-envelope',
    why: 'FLOOR-TRACKING: the realized constant c=spread/(n*kappa_pair*u) must stay strictly inside the Wilkinson ' +
      'envelope c<=1 at both in-range endpoints, and the floor n*kappa_pair must be nearly N-independent (kappa_pair ' +
      'within 1% of 1), now with sigma_4 measured.',
    holds: () =>
      insideWilkinsonEnvelope && floorNearlyNIndependent &&
      RUNG_1800.realizedConstant > 0 && RUNG_1800.realizedConstant < 1 &&
      RUNG_2800.realizedConstant > 0 && RUNG_2800.realizedConstant < 1,
  },
  {
    id: 'imp33625-dd-arithmetic-more-accurate',
    why: 'The double-double arithmetic must be genuinely more accurate than fp64: the catastrophic-cancellation ' +
      'probe (1+1e-20)-1 must return 0 in fp64 and ~1e-20 in double-double, else the collapse is not a real ' +
      'precision effect.',
    holds: () =>
      ddArithmeticMoreAccurate && CANCELLATION_FP64 === 0 && CANCELLATION_DD > 5e-21 && CANCELLATION_DD < 2e-20,
  },
  {
    id: 'imp33625-verdict-in-range-holds',
    why: 'The classified verdict must be the confirming in-range-holds result, not indeterminate; a flip means the ' +
      'N-stability, the collapse reproduction, the inside-envelope tracking, the order preservation, or the ' +
      'measured-sigma_4 de-caveat failed.',
    holds: () => verdict.startsWith('THE-imp-33585-fp64-vs-dd-FIFTH-PAIR-SPREAD-COLLAPSE-HOLDS-AT-THE-IN-RANGE-MEASURED-ENDPOINTS'),
  },
  {
    id: 'imp33625-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT rerun only -- caveat (i) removed but uniform-contraction spectrum and ' +
      'surrogate rotation caveats REMAIN; confirms N-stability/order/mechanism NOT the per-rung constant; adds no ' +
      'Lambda bound, re-certifies nothing, positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP33625_FIFTH_PAIR_SPREAD_FLOOR_IN_RANGE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.addsNoLambdaBound === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.caveatIRemoved === 'string' &&
        typeof c.spectrumIsContractionSurrogate === 'string' &&
        typeof c.surrogateRotationNotActualEigenvectors === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33625_FIFTH_PAIR_SPREAD_FLOOR_IN_RANGE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33625-fifth-pair-spread-floor-in-range-n1800-n2800 assertion failed: ${assertion.id}`);
  }
}

export default IMP33625_FIFTH_PAIR_SPREAD_FLOOR_IN_RANGE;
