/**
 * @module imp-3125-orthogonalized-residual-gap-degree-sweep
 * @fileoverview imp-3125 -- Profile how the imp-3086 / imp-3102 BASIS-INVARIANT
 *   SURVIVING residual gap (||R_orth|| - max_j R_orth_jj, ~0.09 at DEG = 4) varies
 *   with monomial truncation degree DEG. imp-3086 collapsed the imp-3066 diagonal-
 *   normalized gap (3.63) to a strictly-positive survivor ~0.09 by orthogonalizing the
 *   FULL passive cosh Gram, and imp-3102 swept that survivor across the a x U grid --
 *   but BOTH measured the survivor at DEG = 4 ONLY. The SEPARATE imp-3104 ticket swept
 *   the operator NORM ||R_orth|| vs DEG (it CONVERGES to tanh(a*U)); the residual GAP
 *   ||R_orth|| - max_j R_orth_jj itself was never profiled vs DEG. This module rebuilds
 *   R_orth = L H L^T on the headline cell a = 0.5, U = 6 across DEG in {2,4,6,8,10} and
 *   classifies whether the surviving intrinsic obstruction grows, saturates, or vanishes.
 *
 *   THE SWEEP (headline a = 0.5, U = 6; only DEG varies, same as imp-3104)
 *   ---------------------------------------------------------------------
 *   For each DEG in {2,4,6,8,10} we build, on the rescaled monomials phi_j = (tau/U)^j,
 *   the FULL passive cosh Gram P and the shear sinh Hankel H, Cholesky-orthogonalize the
 *   FULL passive Gram (L = (Cholesky P)^{-1}; R_orth = L H L^T -- passive Gram becomes the
 *   identity), and extract the surviving basis-invariant gap ||R_orth|| - max_j R_orth_jj.
 *
 *     P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)   (dense positive Hankel)
 *     H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)   (the shear form)
 *
 *   TWO ANALYTIC ANCHORS PIN THE GAP LIMIT (why it saturates, not grows or vanishes)
 *   -------------------------------------------------------------------------------
 *   (1) The operator norm ||R_orth|| is the largest Rayleigh quotient
 *           int sinh(a*tau) f^2 / int cosh(a*tau) f^2 = cosh-weighted average of tanh(a*tau),
 *       strictly bounded by tanh(a*U) and RISING toward it as DEG grows (the imp-3104
 *       CONVERGES result). So the gap top-line climbs to tanh(a*U) = tanh(3) ~ 0.99505.
 *   (2) The largest diagonal max_j R_orth_jj is achieved at j = 0 (the constant-function
 *       direction) at EVERY degree, and that diagonal is DEG-INDEPENDENT and EXACTLY
 *           R_orth_00 = H_00 / P_00 = (cosh(a*U) - 1) / sinh(a*U) = tanh(a*U / 2),
 *       the cosh-weighted Rayleigh quotient of the constant function. Adding higher
 *       monomials cannot raise the constant-direction diagonal, so the floor is pinned.
 *   Hence the SURVIVING gap saturates from below toward the closed-form positive limit
 *           tanh(a*U) - tanh(a*U / 2) = tanh(3) - tanh(1.5) ~ 0.08991,
 *   the asymptotic obstruction the truncation refines toward.
 *
 *   WHAT THE SWEEP FINDS (measured, NOT proved)
 *   -------------------------------------------
 *   The surviving residual gap rises MONOTONICALLY with strictly SHRINKING increments
 *   (0.08471 -> 0.08821 -> 0.08906 -> 0.08939 -> 0.08959; deltas 3.50e-3, 8.51e-4,
 *   3.38e-4, 1.97e-4) and the distance to the analytic limit tanh(3) - tanh(1.5) shrinks
 *   strictly and monotonically (5.20e-3 -> 3.15e-4, ~16x): the gap SATURATES. The
 *   max diagonal stays pinned at tanh(1.5) ~ 0.90515 to machine precision across the whole
 *   sweep. THE VERDICT: the basis-invariant intrinsic obstruction neither grows unbounded
 *   nor vanishes -- it converges to the strictly-positive closed form tanh(a*U) - tanh(a*U/2).
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation as imp-3066
 *   / imp-3086 / imp-3102 / imp-3104; NOT the section-26 Gram. The measured gap and its
 *   DEG-trend carry NO RH verdict -- a saturating, strictly-positive residual gap neither
 *   claims the cover holds nor that it fails. MEASURE ONLY on a representative truncation;
 *   no positivity attempted; not a proof or a reduction; bare-V pilot (imp-1240) NOT re-run.
 *   The swept DEG in {2,4,6,8,10} sits inside the imp-3104 numerically-trustworthy range
 *   (DEG <= 10, where the two orthogonalizers agree and respect the analytic ceiling);
 *   DEG >= 11 is excluded because the cosh-monomial P becomes catastrophically ill-conditioned.
 *   No refereed bound is changed. No false QED.
 *
 *   @see imp-3102-orthogonalized-gap-aU-grid.js (imp-3102: the DEG = 4 survivor a x U sweep)
 *   @see imp-3086-orthogonalized-basis-conditioning.js (imp-3086: the DEG = 4 single-cell survivor)
 *   @see imp-3104-orthogonalized-opnorm-degree-sweep.js (imp-3104: the ||R_orth|| DEG sweep, CONVERGES)
 *
 *   Ticket: imp-3125 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;                                     // headline shear weight (imp-3086 / imp-3102 cell)
const U = 6;                                       // genuine-Phi lag cutoff (the headline cell)
const DEG_SET = Object.freeze([2, 4, 6, 8, 10]);   // swept truncation degrees (inside the imp-3104 trustworthy range)
const NQ = 4000;                                   // midpoint quadrature panels (matches imp-3102 / imp-3104)
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;

// Analytic anchors for the gap limit (see header):
const TANH_AU = Math.tanh(A * U);                  // operator-norm ceiling ||R_orth|| rises toward
const MAX_DIAG_ANALYTIC = (cosh(A * U) - 1) / sinh(A * U); // = tanh(a*U/2): the DEG-independent constant-direction diagonal
const GAP_LIMIT_ANALYTIC = TANH_AU - MAX_DIAG_ANALYTIC;    // = tanh(a*U) - tanh(a*U/2): the saturating gap limit

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

// -- small dense linear algebra (self-contained, same routines as imp-3102 / imp-3104) ---

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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (same as imp-3102). */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
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
  }
  return m.map((row, i) => row[i]);
}

/**
 * One degree: build the FULL passive cosh Gram P and the shear sinh Hankel H on the
 * degree-DEG truncation, orthogonalize (R_orth = L H L^T), and measure the surviving
 * basis-invariant residual gap ||R_orth|| - max_j R_orth_jj.
 */
function measureAtDegree(deg) {
  const N = deg + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));   // TRUE pencil operator: passive Gram is now identity
  const eigenvalues = symmetricEigenvalues(Rorth);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diag = Rorth.map((row, i) => row[i]);
  const maxDiagonal = Math.max(...diag);
  const maxDiagonalIndex = diag.indexOf(maxDiagonal);
  return {
    degree: deg,
    truncationSize: N,
    operatorNorm,                                       // ||R_orth|| -- basis-invariant true operator norm
    maxDiagonal,                                         // max_j R_orth_jj (pinned at the constant direction)
    maxDiagonalIndex,                                    // which diagonal is largest (0 = constant direction)
    residualGap: operatorNorm - maxDiagonal,             // THE SURVIVING basis-invariant gap at this degree
    distanceToGapLimit: GAP_LIMIT_ANALYTIC - (operatorNorm - maxDiagonal), // -> 0 from above as DEG grows
  };
}

const SWEEP = Object.freeze(DEG_SET.map((deg) => Object.freeze(measureAtDegree(deg))));

// Per-degree gap increments (positive AND shrinking <=> rises and saturates).
const gapIncrements = SWEEP.slice(1).map((row, i) => row.residualGap - SWEEP[i].residualGap);
const allIncrementsPositive = gapIncrements.every((d) => d > 0);
const incrementsStrictlyShrinking = gapIncrements.every(
  (d, i) => i === 0 || d < gapIncrements[i - 1],
);

// Distance to the analytic gap limit strictly positive AND strictly shrinking <=> SATURATES.
const distanceStrictlyPositive = SWEEP.every((row) => row.distanceToGapLimit > 0);
const distanceStrictlyShrinking = SWEEP.every(
  (row, i) => i === 0 || row.distanceToGapLimit < SWEEP[i - 1].distanceToGapLimit,
);

// The surviving gap stays strictly positive across the whole sweep (obstruction never vanishes).
const survivorPositiveEverywhere = SWEEP.every((row) => row.residualGap > 1e-3);

// The max diagonal is pinned at the analytic constant-direction value tanh(a*U/2), DEG-independent.
const maxDiagonalIsPinned = SWEEP.every(
  (row) => Math.abs(row.maxDiagonal - MAX_DIAG_ANALYTIC) < 1e-6 && row.maxDiagonalIndex === 0,
);

const firstGap = SWEEP[0].residualGap;
const lastGap = SWEEP[SWEEP.length - 1].residualGap;
const gapDistanceShrinkFactor = SWEEP[0].distanceToGapLimit / SWEEP[SWEEP.length - 1].distanceToGapLimit;

// Classify the trend purely from the measured behaviour.
let trend;
if (distanceStrictlyPositive && distanceStrictlyShrinking && allIncrementsPositive && incrementsStrictlyShrinking) {
  trend = 'SATURATES';            // rises monotonically with shrinking increments to a strictly-positive limit
} else if (lastGap > firstGap * 1.5) {
  trend = 'GROWS';                // would mean the survivor diverges (it does NOT)
} else if (lastGap < firstGap * 0.5) {
  trend = 'VANISHES';             // would mean the survivor shrinks toward 0 (it does NOT)
} else {
  trend = 'SATURATES';
}

export const IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP = Object.freeze({
  id: 'imp-3125-orthogonalized-residual-gap-degree-sweep',
  ticket: 'imp-3125',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSurvivorAUSweep: 'imp-3102-orthogonalized-gap-aU-grid.js',
  relatedSurvivorSingleCell: 'imp-3086-orthogonalized-basis-conditioning.js',
  relatedOpNormDegreeSweep: 'imp-3104-orthogonalized-opnorm-degree-sweep.js',

  summary:
    'Profiles the imp-3086 / imp-3102 BASIS-INVARIANT surviving residual gap ' +
    '||R_orth|| - max_j R_orth_jj (R_orth = L H L^T, L = (Cholesky of the FULL passive cosh Gram)^{-1}) ' +
    'vs monomial truncation degree DEG in {2,4,6,8,10} on the headline cell a = 0.5, U = 6, where ' +
    'imp-3086 and imp-3102 measured it at DEG = 4 only. Two analytic anchors pin the limit: the operator ' +
    'norm ||R_orth|| (largest Rayleigh quotient int sinh f^2 / int cosh f^2, a cosh-weighted average of ' +
    'tanh(a*tau)) rises toward tanh(a*U) = tanh(3) ~ 0.99505 (the imp-3104 CONVERGES result), while the ' +
    'largest diagonal sits at the constant-function direction j = 0 and equals the DEG-INDEPENDENT ' +
    'closed form R_orth_00 = (cosh(a*U) - 1)/sinh(a*U) = tanh(a*U/2) ~ 0.90515. So the surviving gap ' +
    'SATURATES from below toward the strictly-positive closed form tanh(a*U) - tanh(a*U/2) ~ 0.08991: ' +
    'measured 0.08471 -> 0.08959 with strictly shrinking increments and the distance to the limit ' +
    'shrinking ~16x (5.20e-3 -> 3.15e-4). THE VERDICT: the intrinsic obstruction neither grows unbounded ' +
    'nor vanishes -- it converges to a positive constant. REPRESENTATIVE / DIAGNOSTIC; carries NO RH verdict.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3102-orthogonalized-gap-aU-grid.js (same R_orth = L H L^T orthogonalization)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials, ill-conditioned in the cosh inner product)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (dense positive Hankel, NOT diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}  (TRUE pencil operator; passive Gram -> identity)',
    survivingGap: '||R_orth|| - max_j R_orth_jj  (basis-invariant; the imp-3086 ~0.09 survivor)',
    opNormCeiling: 'tanh(a*U): ||R_orth|| = sup int sinh(a*tau) f^2 / int cosh(a*tau) f^2 <= tanh(a*U) for all f',
    maxDiagonalClosedForm: 'max_j R_orth_jj = R_orth_00 = (cosh(a*U)-1)/sinh(a*U) = tanh(a*U/2), DEG-independent',
    gapLimitClosedForm: 'tanh(a*U) - tanh(a*U/2)  (the strictly-positive value the survivor saturates toward)',
    a: A,
    U,
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    sweep: SWEEP,                                          // per degree: ||R_orth||, max diagonal, residual gap, distance to limit
    gapIncrements: Object.freeze(gapIncrements.slice()),   // positive and shrinking <=> rises and saturates
    allIncrementsPositive,
    incrementsStrictlyShrinking,
    distanceStrictlyPositive,
    distanceStrictlyShrinking,
    trend,                                                 // SATURATES / GROWS / VANISHES, classified on the sweep
    survivorPositiveEverywhere,                            // gap > 0 at every degree (obstruction never vanishes)
    maxDiagonalIsPinned,                                   // max diagonal == tanh(a*U/2) at the j=0 direction, DEG-independent
    firstGap,                                              // gap at DEG = 2
    lastGap,                                               // gap at DEG = 10
    analyticOpNormCeiling: TANH_AU,                        // tanh(a*U) the operator norm rises toward
    analyticMaxDiagonal: MAX_DIAG_ANALYTIC,               // tanh(a*U/2) the pinned floor
    analyticGapLimit: GAP_LIMIT_ANALYTIC,                  // tanh(a*U) - tanh(a*U/2) ~ 0.08991, the saturating limit
    gapDistanceShrinkFactor,                               // ~16x: distance to the gap limit over the sweep
  }),

  interpretation: Object.freeze({
    survivorSaturates:
      'The surviving basis-invariant gap ||R_orth|| - max_j R_orth_jj rises monotonically with strictly ' +
      'shrinking increments and its distance to the analytic limit tanh(a*U) - tanh(a*U/2) shrinks ~16x ' +
      'over DEG in {2,4,6,8,10}: it SATURATES. The intrinsic obstruction is neither a divergence (it stays ' +
      'bounded below tanh(3) - tanh(1.5)) nor an artifact that refining the truncation removes (it stays ' +
      'strictly positive) -- it converges to a fixed positive constant.',
    whyTheLimitIsPinned:
      'Two analytic anchors clamp the gap. The top-line ||R_orth|| is the largest cosh-weighted Rayleigh ' +
      'quotient of tanh(a*tau), bounded by and rising to tanh(a*U) (imp-3104). The floor max_j R_orth_jj is ' +
      'the constant-function direction diagonal R_orth_00 = (cosh(a*U)-1)/sinh(a*U) = tanh(a*U/2), which is ' +
      'DEG-INDEPENDENT because adding higher monomials cannot change the constant-direction normalization. So ' +
      'the gap converges to the closed form tanh(a*U) - tanh(a*U/2).',
    maxDiagonalPinnedAtConstantDirection:
      'The largest diagonal is achieved at j = 0 (the constant function) at every degree and equals ' +
      'tanh(a*U/2) ~ 0.90515 to machine precision throughout the sweep: the saturation is driven entirely ' +
      'by ||R_orth|| climbing toward tanh(a*U), with the floor fixed.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    gapTrendCarriesNoRHVerdict:
      'The measured gap and its DEG-trend are on the SAME representative monomial-moment truncation as ' +
      'imp-3066 / imp-3086 / imp-3102 / imp-3104; they are NOT the section-26 Gram, so a saturating, ' +
      'strictly-positive survivor neither claims the cover holds nor that it fails. Only the existence and ' +
      'direction of the DEG-trend (saturates to tanh(a*U) - tanh(a*U/2), bounded, strictly positive) is asserted.',
    sweptDegreesInsideTrustworthyRange:
      'DEG in {2,4,6,8,10} sits inside the imp-3104 numerically-trustworthy range (DEG <= 10, where the two ' +
      'independent orthogonalizers agree and respect the analytic ceiling). DEG >= 11 is excluded because the ' +
      'cosh-monomial Gram becomes catastrophically ill-conditioned and the orthogonalizer itself breaks down.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP_ASSERTIONS = [
  {
    id: 'imp3125-sweep-covers-degree-set',
    why: 'The sweep must cover exactly the advertised DEG set {2,4,6,8,10} with one row per degree; a ' +
         'length or value drift means a degree was dropped, duplicated, or relabelled.',
    holds: () =>
      SWEEP.length === DEG_SET.length &&
      SWEEP.every((row, i) => row.degree === DEG_SET[i] && row.truncationSize === DEG_SET[i] + 1),
  },
  {
    id: 'imp3125-survivor-positive-everywhere',
    why: 'The imp-3086 residual obstruction survives orthogonalization at every degree: ||R_orth|| must ' +
         'strictly exceed its largest diagonal across the whole sweep. A non-positive gap anywhere would ' +
         'mean refining the truncation removed the survivor.',
    holds: () => survivorPositiveEverywhere && SWEEP.every((row) => row.operatorNorm > row.maxDiagonal),
  },
  {
    id: 'imp3125-max-diagonal-pinned-at-tanh-halfaU',
    why: 'THE FLOOR: the largest diagonal is the constant-function direction R_orth_00 = (cosh(a*U)-1)/' +
         'sinh(a*U) = tanh(a*U/2), DEG-INDEPENDENT because adding higher monomials cannot change the ' +
         'constant-direction normalization. It must be pinned at the analytic value (index 0) at every degree.',
    holds: () => maxDiagonalIsPinned,
  },
  {
    id: 'imp3125-gap-saturates-to-closed-form',
    why: 'THE DELIVERABLE: the surviving gap rises monotonically with strictly shrinking increments and the ' +
         'distance to the closed-form limit tanh(a*U) - tanh(a*U/2) shrinks strictly (~16x). This is ' +
         'SATURATES -- the intrinsic obstruction converges to a strictly-positive constant, it does not ' +
         'grow unbounded or vanish. A non-shrinking distance would contradict the measured saturation.',
    holds: () =>
      trend === 'SATURATES' &&
      allIncrementsPositive &&
      incrementsStrictlyShrinking &&
      distanceStrictlyPositive &&
      distanceStrictlyShrinking &&
      gapDistanceShrinkFactor > 2,
  },
  {
    id: 'imp3125-gap-limit-is-positive-and-bounded',
    why: 'The saturating limit tanh(a*U) - tanh(a*U/2) must be strictly positive (the obstruction never ' +
         'vanishes) and the last measured gap must remain below it (saturation is from below). A limit at ' +
         'or below 0, or a measured gap overshooting it, would break the saturation picture.',
    holds: () =>
      GAP_LIMIT_ANALYTIC > 0 &&
      MAX_DIAG_ANALYTIC > 0 &&
      TANH_AU > MAX_DIAG_ANALYTIC &&
      lastGap < GAP_LIMIT_ANALYTIC &&
      lastGap > firstGap,
  },
  {
    id: 'imp3125-reproduces-imp3086-deg4-survivor',
    why: 'Cross-check against the parents: the DEG = 4 row must reproduce the imp-3086 / imp-3102 single-cell ' +
         'survivor -- residual gap ~0.088 and ||R_orth|| ~0.993. A mismatch means the inherited ' +
         'orthogonalization drifted.',
    holds: () => {
      const deg4 = SWEEP.find((row) => row.degree === 4);
      return (
        Math.abs(deg4.residualGap - 0.0882) < 5e-3 &&
        Math.abs(deg4.operatorNorm - 0.9934) < 5e-3
      );
    },
  },
  {
    id: 'imp3125-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: REPRESENTATIVE diagnostic sweep, the gap-trend carries no RH verdict, ' +
         'positivity not attempted, not a proof or a reduction, bare pilot not re-run, and no refereed bound is changed' +
         '. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP.honestCaveat;
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

for (const assertion of IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3125-orthogonalized-residual-gap-degree-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP;
