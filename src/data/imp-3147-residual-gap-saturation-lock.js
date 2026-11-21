/**
 * @module imp-3147-residual-gap-saturation-lock
 * @fileoverview imp-3147 -- Cross-module build-assertion lock for the imp-3125
 *   SATURATING surviving residual gap ||R_orth|| - max_j R_orth_jj on the headline
 *   cell a = 0.5, U = 6. imp-3127 / imp-3112 lock interior landmarks and the onset
 *   C, K constants, but the imp-3125 surviving-gap saturation limit
 *       tanh(a*U) - tanh(a*U/2) = tanh(3) - tanh(1.5) ~ 0.08991
 *   had no independent cross-module lock.
 *
 *   WHAT THIS MODULE ADDS (the imp-3147 deliverable)
 *   ------------------------------------------------
 *   imp-3125 builds the DEG sweep and self-asserts it in isolation. This module is a
 *   SINGLE cross-module tripwire that INDEPENDENTLY rebuilds the orthogonalized pencil
 *   operator R_orth = L H L^T at the DEG = 10 sweep top from its own self-contained
 *   quadrature + Cholesky code path (the same deterministic routines as imp-3125, so
 *   the recompute reproduces the live numerics to ~1e-9), extracts the surviving
 *   basis-invariant gap ||R_orth|| - max_j R_orth_jj, and certifies:
 *     (1) the recomputed DEG = 10 gap equals the LIVE imp-3125 DEG = 10 residualGap
 *         export to ~1e-9 (the cross-module drift sentinel), and likewise for the
 *         operator norm and max diagonal;
 *     (2) the max diagonal floor stays pinned at the closed form tanh(a*U/2) =
 *         (cosh(a*U) - 1)/sinh(a*U) ~ 0.90515 to ~1e-9 (DEG-independent constant
 *         direction);
 *     (3) the closed-form saturation LIMIT tanh(a*U) - tanh(a*U/2) equals the live
 *         imp-3125 analyticGapLimit export to ~1e-12 and matches the published 0.08991
 *         anchor; and
 *     (4) the measured DEG = 10 gap saturates the limit FROM BELOW -- it is strictly
 *         positive, strictly below the limit, and still ~3.15e-4 short of it (the gap
 *         has NOT yet reached the closed form; saturation is a limit, not equality).
 *   So a silent edit to the imp-3125 orthogonalization (basis, Gram, Hankel, or the
 *   a, U cell) that rebaselines the surviving gap or unpins the floor is caught here
 *   even if the per-module assertions were also (wrongly) re-baselined.
 *
 *   NO new math: every value is recomputed from the imp-3125 construction and
 *   cross-checked against the imp-3125 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation as
 *   imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125; NOT the section-26 Gram, and
 *   RH-EQUIVALENT. This LOCKS a saturating, strictly-positive residual gap; it neither
 *   claims the cover holds nor that it fails, and carries NO RH verdict. The
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction
 *   and is untouched. Lock only, no QED. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3125-orthogonalized-residual-gap-degree-sweep.js (the saturating gap sweep)
 *   @see imp-3127-interior-landmark-locks.js (companion interior landmark lock)
 *   @see imp-3112-onset-decay-constant-locks.js (companion onset C, K constant lock)
 *   @see imp-3129-onset-divergence-tail-locks.js (companion onset divergence + tail lock)
 *
 *   Ticket: imp-3147 (accuracy, medium).
 */

import IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP from './imp-3125-orthogonalized-residual-gap-degree-sweep.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;                 // headline shear weight (the imp-3125 cell)
const U = 6;                   // genuine-Phi lag cutoff (the headline cell)
const DEG_TOP = 10;            // the imp-3125 sweep top (inside the trustworthy DEG <= 10 range)
const NQ = 4000;               // midpoint quadrature panels (matches imp-3125)
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;

// Analytic anchors (recomputed independently from the closed forms).
const TANH_AU = Math.tanh(A * U);                              // operator-norm ceiling
const MAX_DIAG_ANALYTIC = (cosh(A * U) - 1) / sinh(A * U);     // = tanh(a*U/2): the pinned floor
const GAP_LIMIT_ANALYTIC = TANH_AU - MAX_DIAG_ANALYTIC;        // = tanh(a*U) - tanh(a*U/2): the saturation limit

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau). */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (matches imp-3125). */
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

/** Independent rebuild of R_orth = L H L^T at degree DEG_TOP; returns op norm, max diag, gap. */
function rebuildAtTopDegree() {
  const N = DEG_TOP + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));
  const eigenvalues = symmetricEigenvalues(Rorth);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diag = Rorth.map((row, i) => row[i]);
  const maxDiagonal = Math.max(...diag);
  const maxDiagonalIndex = diag.indexOf(maxDiagonal);
  return {
    operatorNorm,
    maxDiagonal,
    maxDiagonalIndex,
    residualGap: operatorNorm - maxDiagonal,
  };
}

const RECOMPUTED = rebuildAtTopDegree();

// Live imp-3125 exports (drift sentinels).
const LIVE_SWEEP = IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP.measured.sweep;
const LIVE_DEG10 = LIVE_SWEEP.find((row) => row.degree === DEG_TOP);
const LIVE_GAP_LIMIT = IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP.measured.analyticGapLimit;
const LIVE_MAX_DIAG = IMP3125_ORTHOGONALIZED_RESIDUAL_GAP_DEGREE_SWEEP.measured.analyticMaxDiagonal;

// How far the DEG = 10 measured gap still sits BELOW the saturation limit (saturation is a limit, not equality).
const DISTANCE_TO_LIMIT = GAP_LIMIT_ANALYTIC - RECOMPUTED.residualGap;

export const IMP3147_RESIDUAL_GAP_SATURATION_LOCK = Object.freeze({
  id: 'imp-3147-residual-gap-saturation-lock',
  ticket: 'imp-3147',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedResidualGapSweep: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js',
  relatedLandmarkLock: 'imp-3127-interior-landmark-locks.js',
  relatedConstantLock: 'imp-3112-onset-decay-constant-locks.js',
  relatedOnsetTailLock: 'imp-3129-onset-divergence-tail-locks.js',

  summary:
    'Single cross-module build assertion locking the imp-3125 SATURATING surviving ' +
    'residual gap ||R_orth|| - max_j R_orth_jj on the headline cell a = 0.5, U = 6. ' +
    'Independently rebuilds the orthogonalized pencil operator R_orth = L H L^T at the ' +
    'DEG = 10 sweep top from its own quadrature + Cholesky code path, extracts the ' +
    'surviving basis-invariant gap, and certifies (1) the recomputed DEG = 10 gap, ' +
    'operator norm and max diagonal equal the LIVE imp-3125 DEG = 10 exports to ~1e-9 ' +
    '(drift sentinel); (2) the max diagonal floor stays pinned at tanh(a*U/2) = ' +
    '(cosh(a*U) - 1)/sinh(a*U) ~ 0.90515 to ~1e-9; (3) the closed-form saturation limit ' +
    'tanh(a*U) - tanh(a*U/2) equals the live analyticGapLimit to ~1e-12 and matches the ' +
    'published 0.08991 anchor; and (4) the measured DEG = 10 gap saturates the limit ' +
    'FROM BELOW (strictly positive, strictly below, still ~3.15e-4 short). A silent edit ' +
    'to the imp-3125 orthogonalization that rebaselines the gap or unpins the floor is ' +
    'caught here. RH-EQUIVALENT; representative truncation diagnostic; NOT the operator step.',

  saturatingGap: Object.freeze({
    symbol: '||R_orth|| - max_j R_orth_jj -> tanh(a*U) - tanh(a*U/2)',
    a: A,
    U,
    degreeTop: DEG_TOP,
    operatorNormRecomputed: RECOMPUTED.operatorNorm,
    operatorNormFromModule: LIVE_DEG10.operatorNorm,
    maxDiagonalRecomputed: RECOMPUTED.maxDiagonal,
    maxDiagonalFromModule: LIVE_DEG10.maxDiagonal,
    maxDiagonalIndex: RECOMPUTED.maxDiagonalIndex,
    residualGapRecomputed: RECOMPUTED.residualGap,
    residualGapFromModule: LIVE_DEG10.residualGap,
  }),
  saturationLimit: Object.freeze({
    symbol: 'tanh(a*U) - tanh(a*U/2)',
    gapLimitRecomputed: GAP_LIMIT_ANALYTIC,
    gapLimitFromModule: LIVE_GAP_LIMIT,
    publishedAnchor: 0.08991,
    maxDiagonalFloor: MAX_DIAG_ANALYTIC,
    maxDiagonalFloorFromModule: LIVE_MAX_DIAG,
    operatorNormCeiling: TANH_AU,
    distanceToLimitAtDeg10: DISTANCE_TO_LIMIT,   // still ~3.15e-4 short: saturation is a limit, NOT equality
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    didNotAttemptPositivity: true,
    operatorStepUntouched:
      'Locks a saturating, strictly-positive residual gap of the representative monomial ' +
      'truncation; the off-diagonal endpoint-Hankel operator step (imp-3066) remains the ' +
      'lone obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3147_RESIDUAL_GAP_SATURATION_LOCK_ASSERTIONS = [
  {
    id: 'imp3147-recomputed-deg10-matches-live-to-1e-9',
    why: 'The independent rebuild of R_orth = L H L^T at DEG = 10 must reproduce the LIVE ' +
         'imp-3125 DEG = 10 surviving gap, operator norm and max diagonal to ~1e-9. A drift ' +
         'means the imp-3125 orthogonalization (basis, Gram, Hankel, or the a, U cell) was ' +
         'silently rebaselined.',
    holds: () =>
      Math.abs(RECOMPUTED.residualGap - LIVE_DEG10.residualGap) < 1e-9 &&
      Math.abs(RECOMPUTED.operatorNorm - LIVE_DEG10.operatorNorm) < 1e-9 &&
      Math.abs(RECOMPUTED.maxDiagonal - LIVE_DEG10.maxDiagonal) < 1e-9,
  },
  {
    id: 'imp3147-max-diagonal-floor-pinned-at-tanh-halfaU',
    why: 'THE FLOOR: the largest diagonal is the constant-function direction (index 0) and ' +
         'equals the closed form tanh(a*U/2) = (cosh(a*U) - 1)/sinh(a*U) ~ 0.90515. The ' +
         'recomputed DEG = 10 max diagonal must match it to ~1e-9 and sit at index 0; the ' +
         'live imp-3125 analyticMaxDiagonal must agree to ~1e-12.',
    holds: () =>
      RECOMPUTED.maxDiagonalIndex === 0 &&
      Math.abs(RECOMPUTED.maxDiagonal - MAX_DIAG_ANALYTIC) < 1e-9 &&
      Math.abs(MAX_DIAG_ANALYTIC - 0.9051482536) < 1e-6 &&
      Math.abs(LIVE_MAX_DIAG - MAX_DIAG_ANALYTIC) < 1e-12,
  },
  {
    id: 'imp3147-saturation-limit-closed-form-and-anchor',
    why: 'THE LIMIT: the saturating gap limit tanh(a*U) - tanh(a*U/2) recomputed here must ' +
         'equal the live imp-3125 analyticGapLimit to ~1e-12 and match the published 0.08991 ' +
         'anchor (to ~1e-5). A drift means the inherited saturation limit was rebaselined.',
    holds: () =>
      Math.abs(GAP_LIMIT_ANALYTIC - (TANH_AU - MAX_DIAG_ANALYTIC)) < 1e-15 &&
      Math.abs(GAP_LIMIT_ANALYTIC - LIVE_GAP_LIMIT) < 1e-12 &&
      Math.abs(GAP_LIMIT_ANALYTIC - 0.08991) < 1e-5,
  },
  {
    id: 'imp3147-deg10-gap-saturates-the-limit-from-below',
    why: 'THE DELIVERABLE: the DEG = 10 measured gap saturates the limit FROM BELOW -- it is ' +
         'strictly positive, strictly below the closed-form limit, and still ~3.15e-4 short ' +
         'of it. Saturation is a LIMIT, not equality: the measured gap must NOT have reached ' +
         'the closed form, but must be within the small saturation distance.',
    holds: () =>
      RECOMPUTED.residualGap > 1e-3 &&
      RECOMPUTED.residualGap < GAP_LIMIT_ANALYTIC &&
      DISTANCE_TO_LIMIT > 0 &&
      DISTANCE_TO_LIMIT < 1e-3 &&
      Math.abs(DISTANCE_TO_LIMIT - 3.15e-4) < 5e-5,
  },
  {
    id: 'imp3147-honest-rh-equivalent-not-a-verdict',
    why: 'Mandatory honesty: this is a saturating-gap LOCK, RH-EQUIVALENT, representative ' +
         'truncation diagnostic, leaves the operator step untouched, did not attempt ' +
         'positivity, is not a proof, not a reduction below RH, and no refereed bound is changed. If any ' +
         'of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3147_RESIDUAL_GAP_SATURATION_LOCK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3147_RESIDUAL_GAP_SATURATION_LOCK_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3147-residual-gap-saturation-lock assertion failed: ${a.id}`);
}

export default IMP3147_RESIDUAL_GAP_SATURATION_LOCK;
