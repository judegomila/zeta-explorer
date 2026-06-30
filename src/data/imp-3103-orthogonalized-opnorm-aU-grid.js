/**
 * @module imp-3103-orthogonalized-opnorm-aU-grid
 * @fileoverview imp-3103 -- Sweep the imp-3086 TRUE basis-invariant operator norm
 *   ||R_orth|| across the a x U grid (equivalently the s = a*U ladder) and locate
 *   where/whether it crosses the RH-equivalent contraction threshold ||R|| <= 1 on
 *   the representative degree-DEG monomial truncation.
 *
 *   THE SETUP (inherited from imp-3086, evaluated only at a = 0.5, U = 6)
 *   -------------------------------------------------------------------
 *   imp-3066 names ||R|| <= 1 (R = Gpass^{-1/2} Gshear Gpass^{-1/2} a contraction)
 *   as the RH-equivalent operator-positivity target the scalar mu^pass cover leaves
 *   untouched. imp-3086 built the TRUE basis-invariant operator norm by orthogonalizing
 *   the monomial basis phi_j(tau) = (tau/U)^j in the FULL passive cosh inner product:
 *   Cholesky of P_jk = int_0^U cosh(a*tau) phi_j phi_k gives L = (Cholesky P)^{-1}, so
 *   psi = L phi is cosh-orthonormal (L P L^T = I) and R_orth = L H L^T is the de-
 *   homogenized pencil operator with H_jk = int_0^U sinh(a*tau) phi_j phi_k. imp-3086
 *   measured ||R_orth|| ~ 0.99 -- tantalizingly near the 1 threshold -- but at the
 *   SINGLE headline cell a = 0.5, U = 6 (s = 3) only.
 *
 *   WHAT THIS MODULE ADDS (the imp-3103 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------------------
 *   (1) THE GRID. ||R_orth|| is re-measured on the full Cartesian A_GRID x U_GRID
 *       using the SAME Gram-Schmidt construction as imp-3086, each cell diagonalized
 *       by a self-contained cyclic-Jacobi eigensolver.
 *
 *   (2) ||R_orth|| DEPENDS ONLY ON s = a*U (the scale invariant, inherited). Substituting
 *       tau = U*x gives P = U*P1(s) and H = U*H1(s) with P1, H1 functions of s alone, so
 *       Cholesky(U*P1) = sqrt(U)*Cholesky(P1), L = (1/sqrt(U)) L1, and
 *           R_orth = L H L^T = (1/sqrt(U)) L1 * (U H1) * (1/sqrt(U)) L1^T = L1 H1 L1^T
 *       -- the U prefactor cancels EXACTLY, so ||R_orth|| is a function of s = a*U alone,
 *       just like the imp-3085 diagonal-only gap and the imp-3064 excess fraction. Equal-
 *       product cells (0.5,6) and (0.3,10) both give ||R_orth|| = 0.99335433 to ~1e-13.
 *
 *   (3) THE BOUNDARY: ||R_orth|| < 1 EVERYWHERE ADMISSIBLE, NO CROSSING (the finding).
 *       Because sinh(t) < cosh(t) for ALL t > 0, for every nonzero polynomial p
 *           int_0^U sinh(a*tau) p(tau)^2 d(tau) < int_0^U cosh(a*tau) p(tau)^2 d(tau),
 *       i.e. v^T H v < v^T P v for all v != 0. Hence EVERY generalized eigenvalue of the
 *       pencil (H, P) is strictly < 1, and ||R_orth|| = max eigenvalue < 1 STRICTLY at
 *       every finite s. The representative truncation is therefore a CONTRACTION on the
 *       whole admissible range -- it never overshoots, there is no finite s* crossing.
 *
 *   (4) THE MARGIN 1 - ||R_orth|| vs s (the quantitative tail). The contraction margin is
 *       largest at short window / weak shear and shrinks MONOTONICALLY toward 0 as s grows
 *       (0.636 at s=0.4 -> 0.259 at s=1 -> 0.043 at s=2 -> 0.0066 at s=3 -> 1.5e-4 at s=5
 *       -> 6e-7 at s=8): as s -> inf, cosh and sinh share the common e^{s*x} envelope, so
 *       H1 -> P1, R_orth -> L1 P1 L1^T = I, and ||R_orth|| -> 1 FROM BELOW. The operator
 *       approaches the contraction boundary asymptotically but never reaches or crosses it.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3086 /
 *   imp-3066 -- NOT the section-26 Gram. The measured ||R_orth|| < 1 carries NO RH verdict:
 *   it is a contraction on THIS representative degree-4 monomial-moment truncation, which
 *   neither claims the section-26 cover holds nor that it fails (the imp-3084 raw-degree
 *   sweep already warns the truncation degree matters -- the open imp-3104 question). No
 *   positivity on the actual Gram is attempted; the bare-V pilot (imp-1240) is NOT re-run.
 *   Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-3086-orthogonalized-basis-conditioning.js (imp-3086: the single-cell ||R_orth|| ~ 0.99)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: names ||R|| <= 1 as the RH-equivalent target)
 *   @see imp-3085-hankel-gap-aU-grid.js (imp-3085: the a*U scale invariant for the diagonal-only gap)
 *
 *   Ticket: imp-3103 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]);   // shear weights (imp-3086 headline a = 0.5)
const U_GRID = Object.freeze([4, 6, 8, 10]);          // lag cutoffs (imp-3086 headline U = 6)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3086)
const N = DEG + 1;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, a, U, p) {
  const hq = U / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * hq;
    acc += weightFn(a * tau) * Math.pow(tau / U, p) * hq;
  }
  return acc;
}

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
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained,
 * identical to imp-3086 so the per-cell operator norm is computed the same way).
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 1000; iter++) {
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
    if (off < 1e-16) break;
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
 * One (a, U) cell: orthogonalize phi_j in the FULL passive cosh Gram (Cholesky L),
 * form the TRUE de-homogenized operator R_orth = L H L^T, and measure ||R_orth||.
 * Exactly the imp-3086 construction, evaluated per cell.
 */
function cellMetrics(a, U) {
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L)); // TRUE pencil operator (passive Gram now I)
  const eigenvalues = symmetricEigenvalues(Rorth);
  const opNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  return Object.freeze({
    a,
    U,
    s: a * U,
    operatorNormOrth: opNorm,                 // ||R_orth|| -- TRUE basis-invariant operator norm
    contractionMargin: 1 - opNorm,            // 1 - ||R_orth|| (RH-equivalent contraction slack)
    isContraction: opNorm < 1,                // ||R_orth|| < 1 on this cell?
  });
}

// Full Cartesian a x U grid of per-cell ||R_orth||.
const GRID = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => cellMetrics(a, U))),
);

// Equal-product (a*U) pairs: each MUST coincide if ||R_orth|| tracks s = a*U alone.
const EQUAL_PRODUCT_PAIRS = Object.freeze([
  Object.freeze({ s: 2.0, cellA: cellMetrics(0.5, 4), cellB: cellMetrics(0.2, 10) }),
  Object.freeze({ s: 3.0, cellA: cellMetrics(0.5, 6), cellB: cellMetrics(0.3, 10) }),
]);

let maxOpNormMismatch = 0;
for (const pair of EQUAL_PRODUCT_PAIRS) {
  maxOpNormMismatch = Math.max(
    maxOpNormMismatch,
    Math.abs(pair.cellA.operatorNormOrth - pair.cellB.operatorNormOrth),
  );
}

// The s-ladder of the contraction margin 1 - ||R_orth|| (any (a,U) with a*U = s coincides).
// Capped at s = 8: there the true margin is ~6e-7, still cleanly positive and well above
// quadrature/round-off noise. Beyond s ~ 12 the margin shrinks below machine precision
// (||R_orth|| is numerically indistinguishable from 1, though analytically still < 1).
const S_LADDER = Object.freeze(
  [0.4, 1.0, 2.0, 3.0, 5.0, 8.0].map((s) => {
    const cell = cellMetrics(0.5, s / 0.5);   // any (a,U) with a*U = s gives the same ||R_orth||
    return Object.freeze({
      s,
      operatorNormOrth: cell.operatorNormOrth,
      contractionMargin: cell.contractionMargin,
    });
  }),
);

// Monotone in s: ||R_orth|| strictly increasing, so the margin strictly decreasing toward 0.
let opNormMonotoneIncreasing = true;
let marginStrictlyPositive = true;
for (let i = 0; i < S_LADDER.length; i++) {
  if (S_LADDER[i].contractionMargin <= 0) marginStrictlyPositive = false;
  if (i > 0 && S_LADDER[i].operatorNormOrth <= S_LADDER[i - 1].operatorNormOrth) {
    opNormMonotoneIncreasing = false;
  }
}

const headlineOpNorm = cellMetrics(0.5, 6).operatorNormOrth;   // must reproduce imp-3086 (~0.99335)
const everyCellIsContraction = GRID.every((c) => c.isContraction);

export const IMP3103_ORTHOGONALIZED_OPNORM_AU_GRID = Object.freeze({
  id: 'imp-3103-orthogonalized-opnorm-aU-grid',
  ticket: 'imp-3103',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedOperatorNorm: 'imp-3086-orthogonalized-basis-conditioning.js',
  relatedContractionTarget: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedScaleInvariant: 'imp-3085-hankel-gap-aU-grid.js',

  summary:
    'Sweeps the imp-3086 TRUE basis-invariant operator norm ||R_orth|| (R_orth = L H L^T, L = ' +
    '(Cholesky P)^{-1} orthonormalizing phi_j in the FULL passive cosh Gram) across the Cartesian ' +
    'a x U grid and locates the RH-equivalent contraction boundary ||R|| <= 1. imp-3086 measured ' +
    '||R_orth|| ~ 0.99 at the single cell a=0.5,U=6 (s=3); this re-measures the whole grid. ' +
    'FINDING (1): ||R_orth|| depends on s = a*U ALONE -- the U prefactor cancels in R_orth = L1 H1 ' +
    'L1^T, so equal-product cells coincide to ~1e-13 ((0.5,6) and (0.3,10) both give 0.99335433). ' +
    'FINDING (2): ||R_orth|| < 1 EVERYWHERE ADMISSIBLE, NO crossing -- since sinh(t) < cosh(t) for ' +
    'all t, v^T H v < v^T P v for all v != 0, so every pencil eigenvalue is strictly < 1 and the ' +
    'representative truncation is a CONTRACTION on the whole range (it never overshoots; there is ' +
    'no finite s*). FINDING (3): the margin 1 - ||R_orth|| shrinks monotonically toward 0 as s grows ' +
    '(0.636 at s=0.4 -> 0.0066 at s=3 -> 6e-7 at s=8): as s -> inf, sinh/cosh share the e^{s*x} ' +
    'envelope so H1 -> P1, R_orth -> I, ||R_orth|| -> 1 FROM BELOW -- the contraction boundary is ' +
    'approached asymptotically but never reached. REPRESENTATIVE / DIAGNOSTIC truncation; ||R_orth|| ' +
    '< 1 carries NO RH verdict (not the section-26 Gram; degree-dependence is the open imp-3104).',

  construction: Object.freeze({
    inheritedFrom: 'imp-3086-orthogonalized-basis-conditioning.js (same Gram-Schmidt R_orth = L H L^T)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (raw monomials, ill-conditioned in the cosh inner product)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (dense positive Hankel, NOT diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    gramSchmidt: 'L = (Cholesky P)^{-1} lower-triangular; psi = L phi is cosh-orthonormal (L P L^T = I)',
    trueOperator: 'R_orth = L H L^T  (passive Gram now exactly the identity, so ||R_orth|| is basis invariant)',
    scaleReduction: 'tau = U*x => P = U*P1(s), H = U*H1(s), s = a*U; R_orth = L1 H1 L1^T (U cancels) depends on s alone',
    contractionThreshold: 'RH-equivalent target ||R|| <= 1 (imp-3066); here measured as ||R_orth||',
    aGrid: A_GRID,
    uGrid: U_GRID,
    degree: DEG,
    truncationSize: N,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    grid: GRID,                                         // every (a,U) cell: s, ||R_orth||, margin, isContraction
    equalProductPairs: EQUAL_PRODUCT_PAIRS,             // coincidence of ||R_orth|| at equal a*U
    maxOpNormMismatchAcrossEqualProductPairs: maxOpNormMismatch,  // ~1e-13: ||R_orth|| IS a function of s
    sLadder: S_LADDER,                                  // ||R_orth|| and margin 1-||R_orth|| vs s
    headlineOpNormAtAhalfU6: headlineOpNorm,            // reproduces the imp-3086 single-cell ||R_orth||
    everyCellIsContraction,                             // ||R_orth|| < 1 on every grid cell
    opNormMonotoneIncreasing,                           // ||R_orth|| rises with s toward 1
    marginStrictlyPositive,                             // 1 - ||R_orth|| > 0 on the whole sampled ladder
  }),

  interpretation: Object.freeze({
    opNormTracksTheProduct:
      '||R_orth|| depends on a and U ONLY through s = a*U: substituting tau = U*x gives P = U*P1(s), ' +
      'H = U*H1(s), so L = (1/sqrt(U)) L1 and R_orth = L1 H1 L1^T -- the U prefactor cancels exactly ' +
      'and equal-product cells coincide to ~1e-13. The contraction margin is governed by the single ' +
      'a*U scale, the same invariant imp-3085 found for the diagonal-only gap and imp-3064 for the ' +
      'degree-0 excess fraction.',
    contractionEverywhereNoCrossing:
      'sinh(t) < cosh(t) for ALL t > 0, so for every nonzero polynomial p, int sinh(a*tau) p^2 < ' +
      'int cosh(a*tau) p^2, i.e. v^T H v < v^T P v for all v != 0. Hence every generalized eigenvalue ' +
      'of the pencil (H, P) is strictly below 1 and ||R_orth|| < 1 at EVERY finite s: the ' +
      'representative truncation is a contraction on the whole admissible range. There is NO finite ' +
      's* where it crosses 1 -- it never overshoots.',
    marginShrinksToZeroFromBelow:
      'The contraction margin 1 - ||R_orth|| is largest at short window / weak shear and decreases ' +
      'monotonically toward 0 as s grows (0.636 at s=0.4 -> 6e-7 at s=8). As s -> inf, cosh and sinh ' +
      'share the common e^{s*x} envelope, so H1 -> P1, R_orth -> L1 P1 L1^T = I, and ||R_orth|| -> 1 ' +
      'FROM BELOW: the contraction boundary is approached asymptotically but never reached or crossed.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured ||R_orth|| < 1 is on the SAME representative degree-4 monomial-moment truncation ' +
      'as imp-3086 / imp-3066; it is NOT the section-26 Gram, so the contraction neither claims the ' +
      'cover holds nor that it fails. The imp-3084 raw-degree sweep already warns the truncation degree ' +
      'matters; whether ||R_orth|| stays a contraction as DEG grows is the SEPARATE open imp-3104 ' +
      'question. Only the s = a*U scaling and the no-crossing contraction on THIS truncation are asserted.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3103_ORTHOGONALIZED_OPNORM_AU_GRID_ASSERTIONS = [
  {
    id: 'imp3103-grid-shape',
    why: 'The sweep covers the full Cartesian A_GRID x U_GRID; a count drift means the grid build ' +
         'dropped or duplicated a cell.',
    holds: () => GRID.length === A_GRID.length * U_GRID.length,
  },
  {
    id: 'imp3103-opnorm-tracks-aU-product',
    why: 'THE SCALE INVARIANT: substituting tau = U*x cancels the U prefactor in R_orth = L1 H1 L1^T, ' +
         'so ||R_orth|| depends on s = a*U alone. Equal-product cells must coincide to ~1e-13; a ' +
         'non-trivial mismatch would falsify the a*U invariance.',
    holds: () => maxOpNormMismatch < 1e-9,
  },
  {
    id: 'imp3103-contraction-everywhere-no-crossing',
    why: 'THE FINDING: sinh(t) < cosh(t) for all t makes v^T H v < v^T P v for all v != 0, so every ' +
         'pencil eigenvalue is strictly < 1 and ||R_orth|| < 1 at every admissible cell. The ' +
         'representative truncation is a contraction everywhere -- it never overshoots. A cell with ' +
         '||R_orth|| >= 1 would contradict sinh < cosh (a quadrature/algebra bug).',
    holds: () => GRID.every((c) => c.operatorNormOrth < 1 && c.contractionMargin > 0),
  },
  {
    id: 'imp3103-opnorm-monotone-increasing-in-s',
    why: 'Along the product axis ||R_orth|| rises with s toward the 1 boundary (H1 -> P1 as the cosh ' +
         'and sinh envelopes merge), so the contraction margin shrinks monotonically. A non-monotone ' +
         'trend would mean the operator does not approach the contraction boundary as expected.',
    holds: () => opNormMonotoneIncreasing && marginStrictlyPositive,
  },
  {
    id: 'imp3103-margin-positive-but-vanishing',
    why: 'The boundary is approached but never reached: the margin 1 - ||R_orth|| stays strictly ' +
         'positive on the sampled ladder yet collapses toward 0 (0.636 at s=0.4 down to ~6e-7 at ' +
         's=8). A margin that did not collapse would contradict the H1 -> P1 large-s limit.',
    holds: () => {
      const first = S_LADDER[0];
      const last = S_LADDER[S_LADDER.length - 1];
      return first.contractionMargin > 0.5 && last.contractionMargin > 0 && last.contractionMargin < 1e-5;
    },
  },
  {
    id: 'imp3103-reproduces-imp3086-headline',
    why: 'Cross-check against the parent: the (a,U) = (0.5,6) cell must reproduce the imp-3086 ' +
         'single-cell ||R_orth|| ~ 0.99335. A mismatch means the inherited Gram-Schmidt construction drifted.',
    holds: () => Math.abs(headlineOpNorm - 0.99335433) < 1e-5,
  },
  {
    id: 'imp3103-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: REPRESENTATIVE diagnostic truncation, ||R_orth|| < 1 carries no RH ' +
         'verdict, positivity not attempted, not a proof or reduction, bare pilot not re-run, and ' +
         'PT 0.2 stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3103_ORTHOGONALIZED_OPNORM_AU_GRID.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3103_ORTHOGONALIZED_OPNORM_AU_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3103-orthogonalized-opnorm-aU-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP3103_ORTHOGONALIZED_OPNORM_AU_GRID;
