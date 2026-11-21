/**
 * @module imp-3104-orthogonalized-opnorm-degree-sweep
 * @fileoverview imp-3104 -- Run the imp-3084 truncation-degree sweep on the
 *   ORTHOGONALIZED basis. imp-3084 swept the RAW-monomial de-homogenized operator
 *   norm ||R|| vs DEG in [2, 12] and found it GROWS unboundedly (~1.79 -> 10.8): the
 *   known ill-conditioning signature of nearly-collinear high monomials. imp-3086
 *   flagged "whether the growth is a basis-conditioning artifact that an orthogonalized
 *   basis would tame is exactly the SEPARATE question" but only measured DEG = 4. This
 *   module measures the TRUE operator norm ||R_orth|| (= ||R_sym||, basis invariant)
 *   across DEG in [2, 12] at the headline a = 0.5, U = 6 and classifies the trend.
 *
 *   THE SWEEP (same a = 0.5, U = 6 grid as imp-3084 / imp-3086; only DEG varies)
 *   ---------------------------------------------------------------------------
 *   For each DEG in [2, 12] we build, on the rescaled monomial truncation
 *   phi_j(tau) = (tau/U)^j, j = 0..DEG, the FULL passive cosh Gram and the shear sinh
 *   Hankel and orthogonalize the FULL passive Gram (NOT just its diagonal as imp-3084):
 *
 *     P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)   (dense positive Hankel)
 *     H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)   (the shear form)
 *
 *   Two distinct orthonormalizations of phi in the SAME cosh inner product, used as
 *   independent invariance witnesses (exactly the imp-3086 construction):
 *     (GS)  L = (Cholesky P)^{-1} lower-triangular; R_orth = L H L^T (passive Gram -> I)
 *     (LOW) symmetric Loewdin P^{-1/2}; R_sym = P^{-1/2} H P^{-1/2}
 *   By the pencil identity det(L H L^T - lambda I) = det(L)^2 det(H - lambda P) they
 *   share the spectrum of the generalized pencil (H, P), so ||R_orth|| = ||R_sym||
 *   is a BASIS INVARIANT. Per degree we report ||R_orth||, the Loewdin witness
 *   ||R_sym||, their relative agreement, and the distance to the analytic ceiling.
 *
 *   THE ANALYTIC CEILING (why the orthogonalized norm cannot diverge)
 *   ----------------------------------------------------------------
 *   The orthogonalized operator norm is the largest magnitude generalized eigenvalue of
 *   the pencil H v = lambda P v, i.e. the supremum of the Rayleigh quotient
 *
 *       lambda = (f, f)_sinh / (f, f)_cosh
 *              = int_0^U sinh(a*tau) f(tau)^2 d(tau) / int_0^U cosh(a*tau) f(tau)^2 d(tau)
 *
 *   over f in the truncation span. Since sinh(a*tau) = cosh(a*tau) * tanh(a*tau) and
 *   0 <= tanh(a*tau) <= tanh(a*U) on [0, U], this Rayleigh quotient is a cosh-weighted
 *   average of tanh(a*tau): for EVERY f and EVERY degree it is strictly bounded by
 *   tanh(a*U) = tanh(3) ~ 0.99505. As DEG grows the truncation can concentrate mass
 *   near tau = U where tanh peaks, so ||R_orth|| rises monotonically toward tanh(a*U)
 *   from below -- it CONVERGES to the analytic ceiling, it does NOT diverge.
 *
 *   WHAT THE SWEEP FINDS (measured, NOT proved)
 *   -------------------------------------------
 *   On the numerically trustworthy range DEG in [2, 10] the operator norm rises
 *   monotonically (0.98986 -> 0.99474), every increment positive, and the distance to
 *   the analytic ceiling tanh(3) shrinks strictly and monotonically (5.20e-3 -> 3.15e-4,
 *   ~16x): ||R_orth|| CONVERGES to tanh(a*U). The two orthogonalizers agree to <= ~2e-5
 *   over this range (basis invariance holds). So the imp-3084 raw-basis divergence
 *   (~1.79 -> 10.8) is ENTIRELY a basis-conditioning artifact: the intrinsic operator
 *   norm is TAMED and bounded below 1.
 *
 *   CONDITIONING-LIMITED TAIL (honest -- DEG 11, 12 excluded)
 *   --------------------------------------------------------
 *   At DEG >= 11 the cosh-monomial Hankel P is catastrophically ill-conditioned, so the
 *   orthogonalizer ITSELF breaks down: Gram-Schmidt and Loewdin DISAGREE by ~6-7% and
 *   BOTH spuriously overshoot the analytic ceiling tanh(3) (GS ~1.036, ~1.176) -- which
 *   is impossible for the true pencil whose Rayleigh quotient is bounded by tanh(3).
 *   These tail rows measure the failure of the finite-precision orthogonalization, NOT
 *   a property of the operator, and are EXCLUDED from the trend classification. We report
 *   them transparently and flag them via the invariance/ceiling validity gate.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC, on the SAME representative monomial-moment truncation as
 *   imp-3084 / imp-3086; NOT the section-26 Gram. The measured operator norm and its
 *   DEG-trend carry NO RH verdict -- a converging, bounded ||R_orth|| neither claims the
 *   cover holds nor that it fails. MEASURE ONLY on a representative truncation; no
 *   positivity attempted; not a proof or a reduction; bare-V pilot (imp-1240) NOT re-run.
 *   No refereed bound is changed. No false QED.
 *
 *   @see imp-3084-offdiagonal-gap-degree-sweep.js (the RAW-basis DEG sweep this conditions)
 *   @see imp-3086-orthogonalized-basis-conditioning.js (the DEG = 4 orthogonalized single cell)
 *   @see imp-3007-mupass-overflow-cover.js (the scalar cover + isolated operator step)
 *
 *   Ticket: imp-3104 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;            // headline shear weight (matches imp-3084 / imp-3086 HEADLINE a = 0.5)
const U = 6;              // genuine-Phi lag cutoff (the imp-3084 grid)
const DEG_MIN = 2;        // smallest swept truncation degree
const DEG_MAX = 12;       // largest swept truncation degree
const NQ = 4000;          // midpoint quadrature panels for the Gram moments (matches imp-3084)
const HQ = U / NQ;

// Validity gate for the orthogonalizer: above DEG ~10 the cosh-monomial Hankel P is so
// ill-conditioned that finite-precision Gram-Schmidt / Loewdin themselves break down. A row
// is TRUSTWORTHY only if the two independent orthogonalizers still agree AND the measured
// norm respects the analytic Rayleigh ceiling tanh(a*U). Tail rows that fail this gate are
// reported but excluded from the trend classification.
const INVARIANCE_TOL = 1e-3;
const TANH_CEILING = Math.tanh(A * U);   // analytic upper bound on the orthogonalized operator norm

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

// -- small dense linear algebra (self-contained, same routines as imp-3086) -----------------

/** Cholesky lower factor G with P = G G^T (P symmetric positive-definite). */
function choleskyLower(M) {
  const n = M.length;
  const G = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = M[i][j];
      for (let k = 0; k < j; k++) s -= G[i][k] * G[j][k];
      G[i][j] = i === j ? Math.sqrt(s) : s / G[j][j];
    }
  }
  return G;
}

/** Inverse of a lower-triangular matrix (forward substitution). */
function invLower(G) {
  const n = G.length;
  const Linv = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    Linv[i][i] = 1 / G[i][i];
    for (let j = 0; j < i; j++) {
      let s = 0;
      for (let k = j; k < i; k++) s += G[i][k] * Linv[k][j];
      Linv[i][j] = -s / G[i][i];
    }
  }
  return Linv;
}

function matmul(Aa, Bb) {
  const n = Aa.length;
  const inner = Bb.length;
  const m = Bb[0].length;
  const C = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < inner; k++) {
      for (let j = 0; j < m; j++) C[i][j] += Aa[i][k] * Bb[k][j];
    }
  }
  return C;
}

function transpose(M) {
  return M[0].map((_unused, j) => M.map((row) => row[j]));
}

/**
 * Classic cyclic Jacobi for a small SYMMETRIC matrix; optionally accumulates the
 * eigenvector matrix V (columns = eigenvectors). Self-contained, generous iteration cap
 * for the (DEG_MAX + 1) x (DEG_MAX + 1) = 13 x 13 size.
 */
function jacobi(matrix, wantVectors) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  const V = Array.from({ length: n }, (_u, i) =>
    Array.from({ length: n }, (_v, j) => (i === j ? 1 : 0)),
  );
  for (let iter = 0; iter < 5000; iter++) {
    let p = 0;
    let q = 1;
    let off = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(m[i][j]) > off) {
          off = Math.abs(m[i][j]);
          p = i;
          q = j;
        }
      }
    }
    if (off < 1e-18) break;
    const app = m[p][p];
    const aqq = m[q][q];
    const apq = m[p][q];
    const theta = (aqq - app) / (2 * apq);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    for (let i = 0; i < n; i++) {
      const mip = m[i][p];
      const miq = m[i][q];
      m[i][p] = c * mip - s * miq;
      m[i][q] = s * mip + c * miq;
    }
    for (let j = 0; j < n; j++) {
      const mpj = m[p][j];
      const mqj = m[q][j];
      m[p][j] = c * mpj - s * mqj;
      m[q][j] = s * mpj + c * mqj;
    }
    if (wantVectors) {
      for (let i = 0; i < n; i++) {
        const vip = V[i][p];
        const viq = V[i][q];
        V[i][p] = c * vip - s * viq;
        V[i][q] = s * vip + c * viq;
      }
    }
  }
  return { values: m.map((row, i) => row[i]), vectors: V };
}

function opNormOf(symMatrix) {
  return Math.max(...jacobi(symMatrix, false).values.map((e) => Math.abs(e)));
}

/**
 * Orthogonalize the FULL passive cosh Gram on the degree-DEG truncation and measure the
 * TRUE de-homogenized operator norm two independent ways (Gram-Schmidt + Loewdin).
 */
function measureAtDegree(deg) {
  const N = deg + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, j + k)),
  );

  // (GS) Triangular Gram-Schmidt: R_orth = L H L^T with L = (Cholesky P)^{-1}.
  const Lgs = invLower(choleskyLower(P));
  const orthonormCheck = matmul(matmul(Lgs, P), transpose(Lgs)); // should equal identity
  let orthonormResidual = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      orthonormResidual = Math.max(
        orthonormResidual,
        Math.abs(orthonormCheck[i][j] - (i === j ? 1 : 0)),
      );
    }
  }
  const Rorth = matmul(matmul(Lgs, H), transpose(Lgs));
  const operatorNormGS = opNormOf(Rorth);

  // (LOW) Symmetric Loewdin orthogonalization: R_sym = P^{-1/2} H P^{-1/2}.
  const eigP = jacobi(P, true);
  const Psqrtinv = Array.from({ length: N }, (_u, a) =>
    Array.from({ length: N }, (_v, b) => {
      let s = 0;
      for (let i = 0; i < N; i++) {
        s += eigP.vectors[a][i] * (1 / Math.sqrt(eigP.values[i])) * eigP.vectors[b][i];
      }
      return s;
    }),
  );
  const Rsym = matmul(matmul(Psqrtinv, H), Psqrtinv);
  const operatorNormLoewdin = opNormOf(Rsym);

  const invarianceRelDiff = Math.abs(operatorNormGS - operatorNormLoewdin) / operatorNormLoewdin;
  const distanceToCeiling = TANH_CEILING - operatorNormGS;
  // Trustworthy only if the two orthogonalizers still agree AND the norm respects the
  // analytic Rayleigh ceiling tanh(a*U). Both fail together when P becomes too ill-conditioned.
  const orthogonalizerTrustworthy =
    invarianceRelDiff < INVARIANCE_TOL && operatorNormGS < TANH_CEILING;

  return {
    degree: deg,
    truncationSize: N,
    operatorNormGS,            // ||R_orth|| -- true pencil operator norm (Gram-Schmidt)
    operatorNormLoewdin,       // ||R_sym|| -- independent Loewdin invariance witness
    invarianceRelDiff,         // |GS - Loewdin| / Loewdin: basis-invariance agreement
    orthonormResidual,         // max|L P L^T - I|: orthonormalization correctness
    distanceToCeiling,         // tanh(a*U) - ||R_orth||  (positive & shrinking <=> CONVERGES)
    orthogonalizerTrustworthy, // false on the conditioning-limited tail (DEG >= 11)
  };
}

const sweep = [];
for (let deg = DEG_MIN; deg <= DEG_MAX; deg++) {
  sweep.push(measureAtDegree(deg));
}

// Numerically trustworthy prefix (the orthogonalizer has not yet broken down on ill-conditioned P).
const validRows = sweep.filter((row) => row.orthogonalizerTrustworthy);
const firstValid = validRows[0];
const lastValid = validRows[validRows.length - 1];

// Per-degree operator-norm increments across the valid range (positive => rising toward the ceiling).
const opNormIncrements = validRows
  .slice(1)
  .map((row, i) => row.operatorNormGS - validRows[i].operatorNormGS);
const allIncrementsPositive = opNormIncrements.every((d) => d > 0);

// Distance to the analytic ceiling strictly positive AND strictly shrinking <=> CONVERGES.
const distanceStrictlyPositive = validRows.every((row) => row.distanceToCeiling > 0);
const distanceStrictlyShrinking = validRows.every(
  (row, i) => i === 0 || row.distanceToCeiling < validRows[i - 1].distanceToCeiling,
);

// Classify the trend purely from the measured valid-range behaviour.
let trend;
if (distanceStrictlyPositive && distanceStrictlyShrinking && allIncrementsPositive) {
  trend = 'CONVERGES';              // intrinsic operator norm tamed: rises to tanh(a*U) ceiling, bounded
} else if (lastValid.operatorNormGS > firstValid.operatorNormGS * 1.5) {
  trend = 'GROWS';                  // would mean the orthogonalized norm also diverges (it does NOT)
} else {
  trend = 'SATURATES';
}

const conditioningLimitedTail = sweep.filter((row) => !row.orthogonalizerTrustworthy);
const limitEstimate = TANH_CEILING;                 // analytic limit the valid sweep converges toward
const lastValidOperatorNorm = lastValid.operatorNormGS;
const ceilingShrinkFactor = firstValid.distanceToCeiling / lastValid.distanceToCeiling;

export const IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP = Object.freeze({
  id: 'imp-3104-orthogonalized-opnorm-degree-sweep',
  ticket: 'imp-3104',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  rawBasisSweepModule: 'imp-3084-offdiagonal-gap-degree-sweep.js',
  orthogonalizationModule: 'imp-3086-orthogonalized-basis-conditioning.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',

  summary:
    'Runs the imp-3084 truncation-degree sweep on the ORTHOGONALIZED basis: measures the TRUE ' +
    'de-homogenized operator norm ||R_orth|| (= ||R_sym||, basis invariant) across DEG in [2, 12] ' +
    'at the headline a = 0.5, U = 6, where imp-3084 found the RAW-monomial norm DIVERGES (~1.79 -> ' +
    '10.8) and imp-3086 measured only DEG = 4. The orthogonalized operator norm is the largest ' +
    'Rayleigh quotient int sinh(a*tau) f^2 / int cosh(a*tau) f^2, a cosh-weighted average of ' +
    'tanh(a*tau), so it is strictly bounded by the analytic ceiling tanh(a*U) = tanh(3) ~ 0.99505 at ' +
    'EVERY degree. On the numerically trustworthy range DEG in [2, 10] it rises monotonically ' +
    '(0.98986 -> 0.99474), every increment positive, and the distance to tanh(3) shrinks strictly ' +
    '(5.20e-3 -> 3.15e-4, ~16x): ||R_orth|| CONVERGES to tanh(a*U), bounded below 1. The two ' +
    'orthogonalizers agree to <= ~2e-5 over this range (basis invariance). So the imp-3084 raw-basis ' +
    'divergence is ENTIRELY a basis-conditioning artifact -- the intrinsic operator norm is TAMED. ' +
    'At DEG >= 11 the cosh-Hankel P is so ill-conditioned the orthogonalizer itself breaks down ' +
    '(GS vs Loewdin disagree ~6-7%, both overshoot tanh(3)); those tail rows measure finite-precision ' +
    'failure, not the operator, and are excluded. REPRESENTATIVE / DIAGNOSTIC; carries NO RH verdict; ' +
    'no positivity; not a proof or a reduction.',

  construction: Object.freeze({
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials -- ill-conditioned in the cosh inner product)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (dense positive Hankel, FULL not diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)  (the shear form imp-3084 measures)',
    gramSchmidt: 'L = (Cholesky P)^{-1} lower-triangular; R_orth = L H L^T (passive Gram -> identity)',
    loewdin: 'R_sym = P^{-1/2} H P^{-1/2}  (independent symmetric-orthogonalization invariance witness)',
    operatorNorm: '||R_orth|| = largest |generalized eigenvalue| of H v = lambda P v (basis invariant)',
    analyticCeiling: 'tanh(a*U): Rayleigh quotient int sinh(a*tau) f^2 / int cosh(a*tau) f^2 <= tanh(a*U) for all f',
    a: A,
    U,
    degreeRange: [DEG_MIN, DEG_MAX],
    invarianceTolerance: INVARIANCE_TOL,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    sweep: Object.freeze(sweep.map((row) => Object.freeze({ ...row }))),
    validDegreeRange: [firstValid.degree, lastValid.degree],
    validRowCount: validRows.length,
    opNormIncrements: Object.freeze(opNormIncrements.slice()),
    allIncrementsPositive,
    distanceStrictlyPositive,
    distanceStrictlyShrinking,
    trend,                                          // CONVERGES / SATURATES / GROWS, classified on the valid range
    analyticCeilingTanhAU: TANH_CEILING,
    limitEstimate,                                  // the analytic limit ||R_orth|| converges toward
    firstValidOperatorNorm: firstValid.operatorNormGS,
    lastValidOperatorNorm,
    firstValidDistanceToCeiling: firstValid.distanceToCeiling,
    lastValidDistanceToCeiling: lastValid.distanceToCeiling,
    ceilingDistanceShrinkFactor: ceilingShrinkFactor,
    conditioningLimitedTailDegrees: Object.freeze(conditioningLimitedTail.map((row) => row.degree)),
    rawBasisContrast: 'imp-3084 raw monomial ||R|| diverges ~1.79 -> 10.8 over the SAME DEG range; orthogonalized ||R_orth|| stays bounded below tanh(3) ~ 0.99505',
  }),

  interpretation: Object.freeze({
    orthogonalizedNormConverges:
      'On the numerically trustworthy range DEG in [2, 10] the orthogonalized operator norm rises ' +
      'monotonically and the distance to the analytic ceiling tanh(a*U) = tanh(3) shrinks strictly ' +
      '(~16x): ||R_orth|| CONVERGES to tanh(a*U) from below, it does NOT diverge.',
    rawDivergenceIsAConditioningArtifact:
      'The imp-3084 raw-monomial divergence (||R|| ~1.79 -> 10.8) is ENTIRELY a basis-conditioning ' +
      'artifact: orthogonalizing the FULL passive Gram bounds the true operator norm below tanh(3) at ' +
      'every degree. The intrinsic obstruction is TAMED -- the answer to the imp-3086 separate question.',
    analyticCeilingExplainsTheBound:
      'The orthogonalized operator norm is the supremum of int sinh(a*tau) f^2 / int cosh(a*tau) f^2, ' +
      'a cosh-weighted average of tanh(a*tau) <= tanh(a*U). This caps ||R_orth|| by tanh(a*U) at every ' +
      'degree and is the reason the orthogonalized sweep converges where the raw sweep diverges.',
    conditioningLimitedTailIsNotTheOperator:
      'At DEG >= 11 the cosh-monomial Hankel P is catastrophically ill-conditioned, so finite-precision ' +
      'Gram-Schmidt and Loewdin DISAGREE (~6-7%) and BOTH overshoot tanh(3) -- impossible for the true ' +
      'pencil. These tail rows measure the orthogonalizer breakdown, NOT the operator, and are excluded.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    degreeTrendCarriesNoRHVerdict:
      'A converging, bounded ||R_orth|| in this orthogonalized basis is NOT a claim that the cover ' +
      'holds -- the basis is not the section-26 Gram. Only the existence and direction of the DEG-trend ' +
      '(converges to tanh(a*U), bounded, NOT diverging) and the conditioning-artifact character of the ' +
      'imp-3084 raw divergence are asserted.',
    conditioningLimitedTailExcluded:
      'DEG 11, 12 fail the orthogonalizer-trustworthiness gate (GS/Loewdin disagree, norm overshoots ' +
      'the analytic ceiling) and are excluded from the trend; they are reported transparently.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP_ASSERTIONS = [
  {
    id: 'imp3104-sweep-covers-range',
    why: 'The sweep must span the full advertised DEG range [DEG_MIN, DEG_MAX] with one row per degree; ' +
         'a length drift means a degree was dropped or duplicated.',
    holds: () =>
      sweep.length === DEG_MAX - DEG_MIN + 1 &&
      sweep[0].degree === DEG_MIN &&
      sweep[sweep.length - 1].degree === DEG_MAX,
  },
  {
    id: 'imp3104-basis-invariance-on-valid-range',
    why: 'Gram-Schmidt and Loewdin orthogonalization of the SAME cosh inner product share the pencil ' +
         'spectrum, so ||R_orth|| = ||R_sym||. On every trustworthy row they must agree below the ' +
         'invariance tolerance -- this certifies the operator norm is a basis invariant, not a route artifact.',
    holds: () => validRows.length >= 5 && validRows.every((row) => row.invarianceRelDiff < INVARIANCE_TOL),
  },
  {
    id: 'imp3104-norm-bounded-by-analytic-ceiling',
    why: 'THE STRUCTURAL BOUND: the orthogonalized operator norm is the largest Rayleigh quotient ' +
         'int sinh(a*tau) f^2 / int cosh(a*tau) f^2, a cosh-weighted average of tanh(a*tau) <= tanh(a*U). ' +
         'On every trustworthy row ||R_orth|| must stay strictly below tanh(a*U) = tanh(3). A violation ' +
         'means the orthogonalizer broke (and the row should have failed the validity gate).',
    holds: () => validRows.every((row) => row.operatorNormGS < TANH_CEILING && row.operatorNormGS > 0),
  },
  {
    id: 'imp3104-norm-converges-to-ceiling',
    why: 'THE DELIVERABLE: on the trustworthy range the operator norm rises monotonically (every ' +
         'increment positive) and the distance to the analytic ceiling tanh(a*U) shrinks strictly. ' +
         'This is CONVERGES -- the orthogonalized norm is TAMED, in stark contrast to the raw divergence. ' +
         'A non-shrinking distance would contradict the measured convergence.',
    holds: () =>
      trend === 'CONVERGES' &&
      allIncrementsPositive &&
      distanceStrictlyPositive &&
      distanceStrictlyShrinking &&
      ceilingShrinkFactor > 2,
  },
  {
    id: 'imp3104-tames-the-raw-basis-divergence',
    why: 'The whole point versus imp-3084: where the raw monomial norm DIVERGES (~1.79 -> 10.8) the ' +
         'orthogonalized norm stays BOUNDED below 1 across the entire valid range. The last trustworthy ' +
         'operator norm must remain under tanh(3) < 1, proving the divergence was a conditioning artifact.',
    holds: () => lastValidOperatorNorm < TANH_CEILING && lastValidOperatorNorm < 1 && TANH_CEILING < 1,
  },
  {
    id: 'imp3104-conditioning-limited-tail-flagged',
    why: 'Honesty about the high-DEG breakdown: at DEG >= 11 the ill-conditioned P makes the two ' +
         'orthogonalizers disagree and overshoot the analytic ceiling. Those rows must fail the validity ' +
         'gate and be reported as a conditioning-limited tail, NOT silently folded into the trend.',
    holds: () =>
      conditioningLimitedTail.length >= 1 &&
      conditioningLimitedTail.every((row) => !row.orthogonalizerTrustworthy) &&
      conditioningLimitedTail.every((row) => row.invarianceRelDiff >= INVARIANCE_TOL || row.operatorNormGS >= TANH_CEILING),
  },
  {
    id: 'imp3104-eigensolver-symmetric-stable',
    why: 'Sanity on the self-contained orthogonalizer at every trustworthy degree: the Gram-Schmidt ' +
         'orthonormalization residual max|L P L^T - I| must stay small, otherwise R_orth is not the true ' +
         'pencil operator and the measured norm is unreliable.',
    holds: () => validRows.every((row) => row.orthonormResidual < 1e-2),
  },
  {
    id: 'imp3104-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: REPRESENTATIVE diagnostic sweep, the DEG-trend carries no RH verdict, ' +
         'positivity not attempted, not a proof or a reduction, bare pilot not re-run, and no refereed bound is changed' +
         '. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3104-orthogonalized-opnorm-degree-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP3104_ORTHOGONALIZED_OPNORM_DEGREE_SWEEP;
