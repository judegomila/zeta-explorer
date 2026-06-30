/**
 * @module imp-3177-equal-product-cell-invariance-lock
 * @fileoverview imp-3177 -- Cross-module build-assertion lock for the imp-3146
 *   EQUAL-PRODUCT-CELL invariance: the orthogonalized residual operator
 *   R_orth = L H L^T (full passive cosh Gram P, Cholesky-de-homogenized, shear
 *   sinh Hankel H) depends only on the product s = a*U, so any two cells sharing
 *   the same s = a*U produce IDENTICAL saturating residual gaps
 *       ||R_orth|| - max_j R_orth_jj   (the basis-invariant survivor).
 *   imp-3146 states this (inheriting imp-3102) and self-asserts a grid-wide
 *   equal-product SPREAD < 1e-9 in one module, but the coincidence is never
 *   re-derived by an INDEPENDENT cross-module tripwire that rebuilds R_orth from
 *   scratch at the explicit equal-s cell PAIRS.
 *
 *   WHAT THIS MODULE ADDS (the imp-3177 deliverable)
 *   ------------------------------------------------
 *   A SINGLE cross-module tripwire that, from its own self-contained quadrature +
 *   Cholesky + Jacobi code path (the same deterministic routines as imp-3146, so
 *   the recompute reproduces the live numerics to ~1e-9), rebuilds R_orth = L H L^T
 *   at every equal-product cell PAIR on the imp-3146 A_GRID x U_GRID --
 *       s = 0.8: (a=0.2,U=4) = (a=0.1,U=8),
 *       s = 1.2: (a=0.3,U=4) = (a=0.2,U=6),
 *       s = 2.0: (a=0.5,U=4) = (a=0.2,U=10),
 *       s = 3.0: (a=0.5,U=6) = (a=0.3,U=10)   (the ticket headline pair),
 *   extracts the per-cell saturating gap ||R_orth|| - max_j R_orth_jj, and certifies:
 *     (1) the two cells of EACH equal-s pair produce the same saturating gap to
 *         MACHINE PRECISION (~1e-9; measured spread ~1e-12) -- the a*U invariance
 *         re-derived pairwise from a clean rebuild;
 *     (2) each rebuilt gap equals the LIVE imp-3146 per-cell rebuiltResidualGap
 *         export to ~1e-9 (the cross-module drift sentinel);
 *     (3) the closed-form saturating LIMIT G(s) = tanh(s) - tanh(s/2) is the SAME
 *         single-variable value for both cells of a pair (it equals the live
 *         imp-3146 analyticGapLimit for each cell to ~1e-12), and the finite-DEG
 *         rebuilt gap saturates that limit FROM BELOW (strictly positive, strictly
 *         below G(s)) -- saturation is a limit, NOT equality.
 *   So a silent edit to the imp-3146 construction (basis, Gram, Hankel, U prefactor,
 *   or the A_GRID x U_GRID cells) that breaks the s = a*U invariance or rebaselines
 *   a survivor is caught here even if the per-module spread assertion were also
 *   (wrongly) re-baselined.
 *
 *   NO new math: every value is recomputed from the imp-3146 construction and
 *   cross-checked against the imp-3146 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation as
 *   imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125 / imp-3146; NOT the
 *   section-26 Gram, and RH-EQUIVALENT. This LOCKS an invariance of a saturating,
 *   strictly-positive residual gap; it neither claims the cover holds nor that it
 *   fails, and carries NO RH verdict. The off-diagonal endpoint-Hankel operator step
 *   (imp-3066) remains the lone obstruction and is untouched. Lock only, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-3146-residual-gap-limit-aU-grid.js (the equal-product-cell grid sweep)
 *   @see imp-3147-residual-gap-saturation-lock.js (companion saturating-gap lock at the headline cell)
 *   @see imp-3102-orthogonalized-gap-aU-grid.js (imp-3102: R_orth depends only on s = a*U)
 *
 *   Ticket: imp-3177 (accuracy, medium).
 */

import IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID from './imp-3146-residual-gap-limit-aU-grid.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG = 4;                 // representative (DEG+1) x (DEG+1) truncation (matches imp-3146)
const NQ = 4000;               // midpoint quadrature panels (matches imp-3146)
const N = DEG + 1;

// The explicit equal-product cell PAIRS on the imp-3146 A_GRID = {0.5,0.3,0.2,0.1}
// x U_GRID = {4,6,8,10}: every product s = a*U that two distinct cells share.
const EQUAL_PRODUCT_PAIRS = Object.freeze([
  Object.freeze({ s: 0.8, cellA: { a: 0.2, U: 4 }, cellB: { a: 0.1, U: 8 } }),
  Object.freeze({ s: 1.2, cellA: { a: 0.3, U: 4 }, cellB: { a: 0.2, U: 6 } }),
  Object.freeze({ s: 2.0, cellA: { a: 0.5, U: 4 }, cellB: { a: 0.2, U: 10 } }),
  Object.freeze({ s: 3.0, cellA: { a: 0.5, U: 6 }, cellB: { a: 0.3, U: 10 } }),
]);

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

/** The imp-3146 saturating gap limit as a closed form in the single product s = a*U. */
function gapLimit(s) {
  return tanh(s) - tanh(s / 2);
}

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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (matches imp-3146). */
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

/** Independent rebuild of one cell: returns the saturating gap ||R_orth|| - max_j R_orth_jj. */
function rebuildCellGap(a, U) {
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));
  const eigenvalues = symmetricEigenvalues(Rorth);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diag = Rorth.map((row, i) => row[i]);
  const maxDiagonal = Math.max(...diag);
  return operatorNorm - maxDiagonal;
}

// Live imp-3146 grid (drift sentinel): find a cell by (a, U).
const LIVE_GRID = IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID.measured.grid;
function liveCell(a, U) {
  return LIVE_GRID.find((cell) => cell.a === a && cell.U === U);
}

// Rebuild every pair and assemble the cross-certified record.
const PAIR_RESULTS = EQUAL_PRODUCT_PAIRS.map((pair) => {
  const gapA = rebuildCellGap(pair.cellA.a, pair.cellA.U);
  const gapB = rebuildCellGap(pair.cellB.a, pair.cellB.U);
  const liveA = liveCell(pair.cellA.a, pair.cellA.U);
  const liveB = liveCell(pair.cellB.a, pair.cellB.U);
  const limit = gapLimit(pair.s);
  return Object.freeze({
    product: pair.s,
    cellA: pair.cellA,
    cellB: pair.cellB,
    rebuiltGapA: gapA,
    rebuiltGapB: gapB,
    pairSpread: Math.abs(gapA - gapB),               // ~1e-12: the a*U invariance, re-derived pairwise
    liveGapA: liveA.rebuiltResidualGap,
    liveGapB: liveB.rebuiltResidualGap,
    driftA: Math.abs(gapA - liveA.rebuiltResidualGap),   // cross-module drift sentinel vs imp-3146
    driftB: Math.abs(gapB - liveB.rebuiltResidualGap),
    gapLimit: limit,                                 // G(s) = tanh(s) - tanh(s/2), the single-variable limit
    liveLimitA: liveA.analyticGapLimit,
    liveLimitB: liveB.analyticGapLimit,
    distanceBelowLimitA: limit - gapA,               // > 0: finite-DEG gap saturates G(s) FROM BELOW
    distanceBelowLimitB: limit - gapB,
  });
});

const MAX_PAIR_SPREAD = Math.max(...PAIR_RESULTS.map((r) => r.pairSpread));
const MAX_DRIFT = Math.max(...PAIR_RESULTS.flatMap((r) => [r.driftA, r.driftB]));

export const IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK = Object.freeze({
  id: 'imp-3177-equal-product-cell-invariance-lock',
  ticket: 'imp-3177',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedEqualProductGrid: 'imp-3146-residual-gap-limit-aU-grid.js',
  relatedSaturationLock: 'imp-3147-residual-gap-saturation-lock.js',
  relatedSurvivorAUSweep: 'imp-3102-orthogonalized-gap-aU-grid.js',

  summary:
    'Single cross-module build assertion locking the imp-3146 EQUAL-PRODUCT-CELL ' +
    'invariance: R_orth = L H L^T depends only on s = a*U, so equal-s cells produce ' +
    'identical saturating gaps ||R_orth|| - max_j R_orth_jj. Independently rebuilds ' +
    'R_orth from its own quadrature + Cholesky + Jacobi path at every equal-product PAIR ' +
    'on the A_GRID x U_GRID -- s = 0.8 (a=0.2,U=4)=(a=0.1,U=8), s = 1.2 (a=0.3,U=4)=' +
    '(a=0.2,U=6), s = 2.0 (a=0.5,U=4)=(a=0.2,U=10), s = 3.0 (a=0.5,U=6)=(a=0.3,U=10) -- ' +
    'and certifies (1) the two cells of each pair give the same saturating gap to machine ' +
    'precision (spread ~1e-12); (2) each rebuilt gap equals the LIVE imp-3146 per-cell ' +
    'rebuiltResidualGap export to ~1e-9 (drift sentinel); and (3) the closed-form limit ' +
    'G(s) = tanh(s) - tanh(s/2) is the same single-variable value for both cells of a pair ' +
    '(equals the live analyticGapLimit to ~1e-12), with the finite-DEG gap saturating it ' +
    'FROM BELOW. A silent edit breaking the a*U invariance is caught here. RH-EQUIVALENT; ' +
    'representative truncation diagnostic; NOT the operator step.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3146-residual-gap-limit-aU-grid.js (R_orth = L H L^T depends only on s = a*U)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}',
    invariant: 's = a*U: the U prefactor cancels in L H L^T, so R_orth is a function of s alone',
    saturatingLimitClosedForm: 'G(s) = tanh(s) - tanh(s/2), s = a*U',
    degree: DEG,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    pairs: PAIR_RESULTS,                             // per pair: both rebuilt gaps, spread, live drift, limit, distance below
    maxPairSpread: MAX_PAIR_SPREAD,                  // largest equal-s gap mismatch across all pairs (~1e-12)
    maxDriftVsLiveGrid: MAX_DRIFT,                   // largest rebuilt-vs-live imp-3146 mismatch (~1e-9)
    pairCount: PAIR_RESULTS.length,
  }),

  interpretation: Object.freeze({
    invarianceReDerivedPairwise:
      'For each shared product s the two cells (a1,U1) and (a2,U2) with a1*U1 = a2*U2 = s are ' +
      'rebuilt from scratch; their saturating gaps coincide to machine precision because the ' +
      'midpoint quadrature factorizes as P_jk = U * f(s, j+k) (and likewise H), so the common U ' +
      'prefactor cancels in R_orth = L H L^T and only s survives. The coincidence is therefore ' +
      'EXACT up to floating-point, not approximate.',
    limitIsTheSameSingleVariableValue:
      'The closed-form saturating limit G(s) = tanh(s) - tanh(s/2) is, by construction, a function ' +
      'of s alone, so both cells of a pair carry the identical limit. The finite-DEG rebuilt gap ' +
      'saturates that limit FROM BELOW (distanceBelowLimit > 0 at DEG = 4); saturation is a limit, ' +
      'NOT equality, so the rebuilt gap is strictly below G(s) and matches it only in the DEG -> inf ' +
      'limit.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    didNotAttemptPositivity: true,
    operatorStepUntouched:
      'Locks an invariance of a saturating, strictly-positive residual gap of the representative ' +
      'monomial truncation; the off-diagonal endpoint-Hankel operator step (imp-3066) remains the ' +
      'lone obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK_ASSERTIONS = [
  {
    id: 'imp3177-covers-every-equal-product-pair',
    why: 'The lock must rebuild every equal-product cell PAIR on the imp-3146 A_GRID x U_GRID ' +
         '(s = 0.8, 1.2, 2.0, 3.0). A missing pair means the invariance is only partially locked. ' +
         'Each pair must reference two DISTINCT cells whose products both equal s.',
    holds: () =>
      PAIR_RESULTS.length === 4 &&
      PAIR_RESULTS.every(
        (r) =>
          Math.abs(r.cellA.a * r.cellA.U - r.product) < 1e-12 &&
          Math.abs(r.cellB.a * r.cellB.U - r.product) < 1e-12 &&
          !(r.cellA.a === r.cellB.a && r.cellA.U === r.cellB.U),
      ),
  },
  {
    id: 'imp3177-equal-product-cells-coincide-to-machine-precision',
    why: 'THE DELIVERABLE: the two cells of each equal-s pair must produce the SAME saturating gap ' +
         '||R_orth|| - max_j R_orth_jj to machine precision (~1e-9; measured spread ~1e-12). This ' +
         're-derives the imp-3146 / imp-3102 a*U invariance pairwise from an independent rebuild.',
    holds: () => MAX_PAIR_SPREAD < 1e-9 && PAIR_RESULTS.every((r) => r.pairSpread < 1e-9),
  },
  {
    id: 'imp3177-rebuilt-gaps-match-live-imp3146-grid',
    why: 'Cross-module drift sentinel: each independently rebuilt per-cell gap must equal the LIVE ' +
         'imp-3146 grid rebuiltResidualGap export to ~1e-9. A drift means the imp-3146 construction ' +
         '(basis, Gram, Hankel, U prefactor, or a grid cell) was silently rebaselined.',
    holds: () => MAX_DRIFT < 1e-9 && PAIR_RESULTS.every((r) => r.driftA < 1e-9 && r.driftB < 1e-9),
  },
  {
    id: 'imp3177-limit-is-single-variable-and-saturated-from-below',
    why: 'THE LIMIT: the closed-form G(s) = tanh(s) - tanh(s/2) is a function of s alone, so both ' +
         'cells of a pair carry the identical limit (matching the live imp-3146 analyticGapLimit to ' +
         '~1e-12), and the finite-DEG rebuilt gap saturates it FROM BELOW (strictly positive, strictly ' +
         'below G(s)) -- saturation is a limit, NOT equality.',
    holds: () =>
      PAIR_RESULTS.every(
        (r) =>
          Math.abs(r.gapLimit - r.liveLimitA) < 1e-12 &&
          Math.abs(r.gapLimit - r.liveLimitB) < 1e-12 &&
          r.rebuiltGapA > 1e-3 &&
          r.rebuiltGapB > 1e-3 &&
          r.distanceBelowLimitA > 0 &&
          r.distanceBelowLimitB > 0 &&
          r.rebuiltGapA < r.gapLimit &&
          r.rebuiltGapB < r.gapLimit,
      ),
  },
  {
    id: 'imp3177-headline-pair-reproduces-s3-anchor',
    why: 'Cross-check against the ticket headline pair: s = 3 = (a=0.5,U=6) = (a=0.3,U=10) must carry ' +
         'the closed-form limit tanh(3) - tanh(1.5) ~ 0.08991 (the imp-3125 / imp-3146 anchor), with ' +
         'both cells coinciding. A mismatch means the inherited closed form drifted.',
    holds: () => {
      const headline = PAIR_RESULTS.find((r) => r.product === 3.0);
      return (
        headline &&
        Math.abs(headline.gapLimit - 0.089907) < 1e-5 &&
        headline.pairSpread < 1e-9
      );
    },
  },
  {
    id: 'imp3177-honest-rh-equivalent-not-a-verdict',
    why: 'Mandatory honesty: this is an invariance LOCK, RH-EQUIVALENT, representative truncation ' +
         'diagnostic, leaves the operator step untouched, did not attempt positivity, is not a proof, ' +
         'not a reduction below RH, and PT 0.2 stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3177-equal-product-cell-invariance-lock assertion failed: ${assertion.id}`);
  }
}

export default IMP3177_EQUAL_PRODUCT_CELL_INVARIANCE_LOCK;
