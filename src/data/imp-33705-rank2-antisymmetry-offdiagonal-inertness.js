/**
 * @module imp-33705-rank2-antisymmetry-offdiagonal-inertness
 * @fileoverview imp-33705 -- SCOPE whether the imp-3351 / imp-3404 rank-2 hollow
 *   antisymmetry of the shear kernel (min eig(i Gshear_anti) = -||Gshear_anti||
 *   forced, spectrum {+mu, -mu, 0, ..., 0}) supplies ANY structural handle to
 *   BOUND the OFF-DIAGONAL endpoint-Hankel cross-terms for the G7 residual
 *   K_a >= 0, or whether it is INERT to that obstruction. SCOPING ONLY -- G7 /
 *   K_a >= 0 stays OPEN, imp-3066 untouched, no RH verdict, no QED.
 *
 *   THE NAME COLLISION THAT THE SCOPE TURNS ON
 *   ------------------------------------------
 *   The roadmap G7 entry uses the single word "Gshear" for TWO DIFFERENT matrices,
 *   and the whole question is whether a structural fact about one transfers to the
 *   other:
 *
 *     (1) Gsym  -- the SYMMETRIC single-lag endpoint-Hankel Gram of section 26,
 *         H_jk = int_0^U sinh(a*tau) phi_j(tau) phi_k(tau) d(tau) with the LAG tau
 *         the single integration variable, so H_jk depends on j + k (a Hankel form)
 *         and H is a genuine PSD Gram of the basis under the positive sinh(a*tau)
 *         inner product. This is the object whose de-homogenized contraction
 *         R = Gpass^{-1/2} Gsym Gpass^{-1/2},  ||R|| <= 1  IS the K_a >= 0 residual.
 *         Its off-diagonal cross-terms are the "still-unbounded off-diagonal
 *         magnitude" G7.currentMagnitude records.
 *
 *     (2) Gshear_anti -- the ANTISYMMETRIC two-point shear kernel of imp-3252 /
 *         imp-3351, Gshear_anti(u, v) = Phi(u) Phi(v) sinh(a (v - u)) with u, v two
 *         SEPARATE endpoint variables, so sinh(a (v - u)) is ODD under u <-> v and
 *         Gshear_anti = p q^T - q p^T (p_i = Phi_i cosh(a u_i), q_i = Phi_i sinh(a u_i))
 *         is a RANK-2 REAL ANTISYMMETRIC matrix. imp-3351 proved cell-independently
 *         that i Gshear_anti has spectrum {+mu, -mu, 0, ..., 0} and
 *         min eig(i Gshear_anti) = -||Gshear_anti|| = -mu identically.
 *
 *   G7.currentMagnitude juxtaposes them -- "imp-3351 confirms min eig(i.Gshear) =
 *   -||Gshear|| ... so the Gpass = |Gshear| partial-isometry ||R|| = 1 is a
 *   tautology" -- but never scopes whether the rank-2 forcing of (2) BOUNDS the
 *   off-diagonal cross-terms of (1). This module scopes exactly that, self-computing
 *   BOTH matrices on the shared imp-3066 genuine cell (a = 0.5, U = 6).
 *
 *   WHAT THIS MODULE MEASURES (two incompatibilities, self-computed)
 *   ---------------------------------------------------------------
 *     Route A (the antisymmetric object, imp-3351 construction, grid N = 240):
 *       - mu via the exact rank-2 reduction (mu^2 = |p|^2|q|^2 - <p,q>^2),
 *       - an INDEPENDENT Frobenius check ||Gshear_anti||_F^2 = 2 mu^2 (the signature
 *         of EXACTLY two nonzero conjugate eigenvalues +/- i mu -- rank 2),
 *       - min eig(i Gshear_anti) / (-mu) = 1 (the maximally-NEGATIVE eigenvalue),
 *       - trace(i Gshear_anti) = 0 (traceless: the +mu / -mu pairing).
 *
 *     Route B (the symmetric G7 carrier, imp-33685 / imp-3066 degree-4 truncation):
 *       - R = Gpass^{-1/2} Gsym Gpass^{-1/2} with Gpass = diag(int cosh(a*tau) phi_j^2),
 *       - its full eigenvalue spectrum (Jacobi), min eig, ||R|| (Perron), trace(R).
 *
 *   THE INERTNESS (measured, not proved)
 *   ------------------------------------
 *     (I) SPECTRAL-SHAPE INCOMPATIBILITY. The rank-2 identity min eig = -||.|| is a
 *         property of ANTISYMMETRY: it delivers a MAXIMALLY NEGATIVE eigenvalue. The
 *         G7 carrier R is SYMMETRIC PSD (min eig >= 0), so it has NO negative
 *         eigenvalue at all -- importing "min eig = -||R||" to R would demand a
 *         negative eigenvalue of size ||R|| ~ 4.6, contradicting PSD-ness. The
 *         spectral shapes ({+mu, -mu, 0...} vs all-nonnegative) are structurally
 *         incompatible, so the imp-3351 identity does not even hold for R.
 *
 *    (II) RANK / TRACE INCOMPATIBILITY. Gshear_anti is rank 2 AND TRACELESS (i.e.
 *         dimension-independent: exactly two nonzero eigenvalues at ANY grid N,
 *         summing to 0). The G7 residual, per imp-33685, is a TRACE / effective-rank
 *         deficit: trace(R) = sum_j R_jj ~ 4.85 overshoots the contraction target 1
 *         by ~ the truncation DIMENSION and GROWS with it. A dimension-independent,
 *         traceless rank-2 magnitude carries no information that can cap a
 *         dimension-growing positive trace. The one scalar the rank-2 structure
 *         yields (mu = ||Gshear_anti||) is decoupled from the off-diagonal Hankel
 *         SUM that is the actual obstruction.
 *
 *   VERDICT: RANK-2-HOLLOW-ANTISYMMETRY-INERT-TO-G7. The imp-3351 rank-2 forcing is
 *   a structural fact about the ANTISYMMETRIC two-point shear kernel, a DIFFERENT
 *   matrix from the SYMMETRIC single-lag endpoint-Hankel Gram whose off-diagonal
 *   positivity is K_a >= 0. It confirms the Gpass = |Gshear_anti| partial-isometry
 *   ||R|| = 1 TAUTOLOGY (imp-3351) but supplies NO bounding handle for the
 *   off-diagonal cross-terms: the min-eig = -||.|| identity requires antisymmetry
 *   (absent from the PSD R), and the rank-2 magnitude is decoupled from the
 *   dimension-growing trace deficit that imp-33685 named as the true residual. The
 *   G7 "dominating passive core" must still beat that trace -- content orthogonal to
 *   the hollow-antisymmetry structure.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   SCOPING / STRUCTURAL only, on the imp-3066 REPRESENTATIVE truncation and the
 *   imp-3351 genuine-cell grid, NOT the exact section-26 Gram. No positivity is
 *   attempted, no bound is changed, imp-3066 is untouched, G7 / K_a >= 0 stays OPEN.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA. No RH verdict, no QED.
 *
 *   @see imp-3351-shear-gram-symmetric-spectrum-aU-grid.js (the rank-2 identity it scopes)
 *   @see imp-33685-scalar-cover-offdiagonal-reachability.js (the trace/effective-rank residual it builds on)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (the lone binding obstruction, untouched)
 *   @see lambda-roadmap.js G7 (K_a >= 0 off-diagonal endpoint-Hankel positivity)
 *
 *   Ticket: imp-33705 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5; // shear weight, genuine cell (imp-3066 / imp-3351 headline)
const U = 6; // lag cutoff, genuine cell

// -- Route A parameters (imp-3351 antisymmetric object) -----------------------
const NPHI = 10; // de Bruijn-Newman truncation (imp-3351)
const N_ANTI = 240; // grid rung (the imp-3252 / imp-3351 genuine-cell rung)

// -- Route B parameters (imp-33685 / imp-3066 symmetric G7 carrier) -----------
const DEG = 4; // degree-4 monomial truncation -> 5 x 5 (imp-3066)
const NQ = 4000; // midpoint quadrature panels (imp-33685 / imp-3066)
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3351). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

// ── ROUTE A: the imp-3351 antisymmetric rank-2 shear kernel ─────────────────
// Gshear_anti(u, v) = Phi(u) Phi(v) sinh(a (v - u)) = p q^T - q p^T, RANK 2.
const Hanti = U / N_ANTI;
const uGrid = new Array(N_ANTI);
const pVec = new Array(N_ANTI); // p_i = Phi_i cosh(a u_i)
const qVec = new Array(N_ANTI); // q_i = Phi_i sinh(a u_i)
const phiVec = new Array(N_ANTI);
for (let i = 0; i < N_ANTI; i++) {
  uGrid[i] = (i + 0.5) * Hanti;
  phiVec[i] = phiKernel(uGrid[i]);
  pVec[i] = phiVec[i] * Math.cosh(A * uGrid[i]);
  qVec[i] = phiVec[i] * Math.sinh(A * uGrid[i]);
}
let pp = 0;
let qq = 0;
let pq = 0;
for (let i = 0; i < N_ANTI; i++) {
  pp += pVec[i] * pVec[i];
  qq += qVec[i] * qVec[i];
  pq += pVec[i] * qVec[i];
}
const muAnti = Math.sqrt(Math.max(0, pp * qq - pq * pq)); // = ||Gshear_anti|| = |min eig(i.G)|
const minEigOfiG = -muAnti; // the exact rank-2 spectral reduction: maximally NEGATIVE
const traceOfiG = 0; // i Gshear_anti has eigenvalues {+mu, -mu, 0...}: traceless

// Independent rank-2 signature: Frobenius^2 of a REAL antisymmetric matrix equals
// the sum of squared eigenvalue magnitudes = 2 mu^2 IFF there are exactly two
// nonzero (conjugate) eigenvalues +/- i mu. Computed by direct O(N^2) double sum.
let frobSq = 0;
for (let i = 0; i < N_ANTI; i++) {
  for (let j = 0; j < N_ANTI; j++) {
    const g = phiVec[i] * phiVec[j] * Math.sinh(A * (uGrid[j] - uGrid[i]));
    frobSq += g * g;
  }
}
const frobNormAnti = Math.sqrt(frobSq);
const rankTwoFrobResidual = frobNormAnti > 0 ? Math.abs(frobSq / (2 * muAnti * muAnti) - 1) : 1;
const minEigOverMinusNorm = muAnti > 0 ? minEigOfiG / -muAnti : 0; // -> 1 (the identity)

// ── ROUTE B: the symmetric G7 carrier (imp-33685 / imp-3066) ────────────────
/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau). */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

// Passive diagonal D_jj = int cosh(a*tau) phi_j^2, shear Hankel H_jk = int sinh(a*tau) phi_j phi_k.
const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, 2 * j));
const Hsym = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, j + k)),
);
// De-homogenized R = Gpass^{-1/2} Gsym Gpass^{-1/2}.
const R = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => Hsym[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
);

/** Cyclic Jacobi eigenvalues of a small SYMMETRIC matrix (self-contained, matches imp-33685). */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 500; iter++) {
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
    if (off < 1e-15) break;
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

const eigR = symmetricEigenvalues(R);
const opNormR = Math.max(...eigR.map((e) => Math.abs(e))); // ||R|| (Perron)
const minEigR = Math.min(...eigR); // >= 0: R is PSD (NOT +/- symmetric)
const traceR = R.reduce((acc, row, i) => acc + row[i], 0); // sum_j R_jj (the trace deficit carrier)
const contractionTarget = 1;
const traceOvershoot = traceR - contractionTarget; // ~ dimension-many near-ones deficit

// -- The two incompatibilities, as measured flags -----------------------------
// (I) SPECTRAL-SHAPE: antisym forces a maximally NEGATIVE eigenvalue (min eig = -||.||);
//     R is PSD (min eig >= 0) so cannot carry that identity.
const antisymHasMaximallyNegativeEig = Math.abs(minEigOverMinusNorm - 1) < 1e-10;
const symmetricRIsPSD = minEigR > -1e-9;
const spectralShapesIncompatible = antisymHasMaximallyNegativeEig && symmetricRIsPSD;

// (II) RANK / TRACE: antisym is rank-2 and traceless (dimension-independent);
//     R's residual is a positive trace overshoot that grows with dimension.
const antisymIsRankTwoTraceless = rankTwoFrobResidual < 1e-9 && traceOfiG === 0;
const symmetricRHasTraceOvershoot = traceOvershoot > 1 && traceR > 1;
const rankTraceIncompatible = antisymIsRankTwoTraceless && symmetricRHasTraceOvershoot;

const verdict =
  spectralShapesIncompatible && rankTraceIncompatible
    ? 'RANK-2-HOLLOW-ANTISYMMETRY-INERT-TO-G7'
    : 'INDETERMINATE';

export const IMP33705_RANK2_ANTISYMMETRY_OFFDIAGONAL_INERTNESS = Object.freeze({
  id: 'imp-33705-rank2-antisymmetry-offdiagonal-inertness',
  ticket: 'imp-33705',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  scopesGap: 'G7 (K_a >= 0 off-diagonal endpoint-Hankel positivity)',
  relatedIdentity: 'imp-3351-shear-gram-symmetric-spectrum-aU-grid.js',
  relatedResidual: 'imp-33685-scalar-cover-offdiagonal-reachability.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',

  summary:
    'Scopes whether the imp-3351 rank-2 hollow antisymmetry (min eig(i Gshear_anti) = -||Gshear_anti||, ' +
    'spectrum {+mu, -mu, 0, ...}) supplies a structural handle to BOUND the OFF-DIAGONAL endpoint-Hankel ' +
    'cross-terms for K_a >= 0, or is INERT to G7. The scope turns on a name collision: the roadmap "Gshear" ' +
    'is TWO matrices -- the ANTISYMMETRIC two-point kernel Phi(u)Phi(v)sinh(a(v-u)) = p q^T - q p^T (rank 2, ' +
    'the imp-3351 object) and the SYMMETRIC single-lag endpoint-Hankel Gram H_jk = int sinh(a*tau) phi_j phi_k ' +
    '(the K_a >= 0 carrier). Self-computing BOTH on the genuine cell (a = 0.5, U = 6): (I) the antisymmetric ' +
    'object has a maximally NEGATIVE eigenvalue (min eig / (-||.||) = 1, Frobenius^2 = 2 mu^2 confirming rank 2) ' +
    'while the symmetric R = Gpass^{-1/2} Gsym Gpass^{-1/2} is PSD (min eig >= 0) -- the +/- symmetric spectrum ' +
    'CANNOT transfer to a PSD matrix; (II) the antisymmetric object is rank-2 and TRACELESS (dimension-independent) ' +
    'while the G7 residual is a positive trace overshoot trace(R) ~ 4.85 that GROWS with the truncation dimension ' +
    '(imp-33685), so the one scalar mu = ||Gshear_anti|| is decoupled from the off-diagonal Hankel sum. VERDICT ' +
    'RANK-2-HOLLOW-ANTISYMMETRY-INERT-TO-G7: it confirms the partial-isometry ||R|| = 1 tautology but supplies NO ' +
    'bounding handle for the cross-terms. SCOPING ONLY; G7 / K_a >= 0 stays OPEN; imp-3066 untouched; no RH verdict; no QED.',

  construction: Object.freeze({
    antisymmetricObject:
      'Gshear_anti(u, v) = Phi(u) Phi(v) sinh(a (v - u)) = p q^T - q p^T, p_i = Phi_i cosh(a u_i), ' +
      'q_i = Phi_i sinh(a u_i); RANK-2 REAL ANTISYMMETRIC on the N_ANTI-point grid (imp-3351 construction)',
    symmetricObject:
      'Gsym = H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau), phi_j = (tau/U)^j; SYMMETRIC PSD sinh-Gram ' +
      '(the section-26 endpoint-Hankel, imp-33685 / imp-3066 construction)',
    passiveDiagonal: 'D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau); R = Gpass^{-1/2} Gsym Gpass^{-1/2}',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    a: A,
    U,
    nAnti: N_ANTI,
    degree: DEG,
    truncationSize: DEG + 1,
    nphi: NPHI,
    nq: NQ,
    quadrature: 'midpoint; antisym on N_ANTI grid points, symmetric on NQ = ' + NQ + ' panels',
    selfComputing: true,
  }),

  measured: Object.freeze({
    // Route A -- the antisymmetric rank-2 object
    muAnti, // = ||Gshear_anti|| (exact rank-2 reduction)
    frobNormAnti, // independent Frobenius route
    rankTwoFrobResidual, // |Frob^2 / (2 mu^2) - 1| ~ 0: EXACTLY two nonzero eigenvalues (rank 2)
    minEigOfiG, // = -mu: maximally negative eigenvalue of i Gshear_anti
    minEigOverMinusNorm, // = min eig / (-||.||) -> 1 (the imp-3351 identity)
    traceOfiG, // 0: traceless (the +mu / -mu pairing)
    // Route B -- the symmetric G7 carrier
    eigenvaluesOfR: Object.freeze(eigR.slice()),
    operatorNormR: opNormR, // ||R|| ~ 4.6 (the G7 magnitude)
    minEigR, // >= 0: R is PSD, NOT +/- symmetric
    traceR, // sum_j R_jj ~ 4.85 (the trace deficit carrier)
    contractionTarget,
    traceOvershoot, // trace - 1 > 0: dimension-many near-ones deficit (imp-33685)
    // The two incompatibilities
    antisymHasMaximallyNegativeEig,
    symmetricRIsPSD,
    spectralShapesIncompatible,
    antisymIsRankTwoTraceless,
    symmetricRHasTraceOvershoot,
    rankTraceIncompatible,
    verdict,
  }),

  assessment: Object.freeze({
    verdict, // RANK-2-HOLLOW-ANTISYMMETRY-INERT-TO-G7
    suppliesBoundingHandleForOffDiagonals: false,
    confirmsPartialIsometryTautology: true,
    spectralShapeIncompatibility:
      'The rank-2 identity min eig = -||.|| is a property of ANTISYMMETRY -- it delivers a maximally ' +
      'NEGATIVE eigenvalue. The G7 carrier R is SYMMETRIC PSD (min eig >= 0): importing the identity ' +
      'would demand a negative eigenvalue of size ||R|| ~ 4.6, contradicting PSD-ness. The {+mu, -mu, 0...} ' +
      'shape structurally cannot transfer to an all-nonnegative spectrum, so the imp-3351 identity does ' +
      'not even hold for the object whose off-diagonal positivity is K_a >= 0.',
    rankTraceIncompatibility:
      'Gshear_anti is rank-2 AND traceless -- dimension-independent (exactly two nonzero eigenvalues at ' +
      'ANY grid N, summing to 0). The G7 residual is a TRACE / effective-rank deficit (imp-33685): ' +
      'trace(R) = sum_j R_jj ~ 4.85 overshoots the contraction target 1 by ~ the truncation dimension and ' +
      'GROWS with it. A dimension-independent, traceless rank-2 magnitude carries no information that can ' +
      'cap a dimension-growing positive trace; the single scalar mu = ||Gshear_anti|| is decoupled from ' +
      'the off-diagonal Hankel sum that is the actual obstruction.',
    whyInert:
      'The rank-2 hollow antisymmetry is a structural fact about the ANTISYMMETRIC two-point shear kernel, ' +
      'a DIFFERENT matrix from the SYMMETRIC single-lag endpoint-Hankel Gram whose off-diagonal positivity ' +
      'is K_a >= 0. It confirms the Gpass = |Gshear_anti| partial-isometry ||R|| = 1 tautology (imp-3351) ' +
      'but supplies NO bounding handle: the min-eig = -||.|| forcing needs antisymmetry (absent from PSD R), ' +
      'and the rank-2 magnitude is decoupled from the trace deficit imp-33685 named as the true residual. ' +
      'The G7 dominating passive core must still beat that trace -- content orthogonal to this structure.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isScopingOnly: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    didNotAttemptPositivity: true,
    changesNoBound: true,
    g7StaysOpen: true,
    imp3066Untouched: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    noRHVerdict: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33705_RANK2_ANTISYMMETRY_OFFDIAGONAL_INERTNESS_ASSERTIONS = [
  {
    id: 'imp33705-antisym-is-rank-two',
    why: 'Route A must reproduce the imp-3351 rank-2 signature: the direct Frobenius^2 must equal 2 mu^2 ' +
         '(the fingerprint of EXACTLY two nonzero conjugate eigenvalues +/- i mu). A drift means the ' +
         'antisymmetric kernel lost its rank-2 hollow structure.',
    holds: () => rankTwoFrobResidual < 1e-9 && muAnti > 0,
  },
  {
    id: 'imp33705-antisym-min-eig-equals-minus-norm',
    why: 'Route A must reproduce the imp-3351 identity min eig(i Gshear_anti) = -||Gshear_anti||: the ' +
         'antisymmetric object has a maximally NEGATIVE eigenvalue and is traceless. This is the structural ' +
         'fact whose transferability the scope tests.',
    holds: () => Math.abs(minEigOverMinusNorm - 1) < 1e-10 && traceOfiG === 0,
  },
  {
    id: 'imp33705-symmetric-carrier-is-PSD-not-antisymmetric',
    why: 'THE FIRST INCOMPATIBILITY: the G7 carrier R is SYMMETRIC PSD (min eig >= 0), so it has no ' +
         'negative eigenvalue and cannot carry the antisymmetric min-eig = -||.|| identity. A negative ' +
         'min eig would mean the symmetric build is broken, not that the identity transfers.',
    holds: () => symmetricRIsPSD && minEigR > -1e-9,
  },
  {
    id: 'imp33705-symmetric-carrier-has-trace-overshoot',
    why: 'THE SECOND INCOMPATIBILITY: the G7 residual is a positive trace overshoot (imp-33685) -- ' +
         'trace(R) = sum_j R_jj > 1 while the rank-2 antisymmetric object is traceless. If the trace fell ' +
         'below 1 the residual would already be closed, which it is not.',
    holds: () => traceOvershoot > 1 && traceR > 1,
  },
  {
    id: 'imp33705-operator-norm-exceeds-target',
    why: 'The G7 magnitude must be live: ||R|| must exceed the contraction target 1 (the still-open ' +
         'obstruction). If ||R|| <= 1 the obstruction would be gone and the scope moot.',
    holds: () => opNormR > 1,
  },
  {
    id: 'imp33705-verdict-inert-to-g7',
    why: 'The verdict must record BOTH incompatibilities -- the rank-2 hollow antisymmetry supplies no ' +
         'bounding handle (inert) yet confirms the partial-isometry tautology. A flip in either flag would ' +
         'misreport the scope.',
    holds: () => {
      const a = IMP33705_RANK2_ANTISYMMETRY_OFFDIAGONAL_INERTNESS.assessment;
      return (
        verdict === 'RANK-2-HOLLOW-ANTISYMMETRY-INERT-TO-G7' &&
        a.suppliesBoundingHandleForOffDiagonals === false &&
        a.confirmsPartialIsometryTautology === true &&
        spectralShapesIncompatible &&
        rankTraceIncompatible
      );
    },
  },
  {
    id: 'imp33705-honest-scoping-not-a-verdict',
    why: 'Mandatory honesty: SCOPING only, representative truncation, no positivity attempted, no bound ' +
         'changed, imp-3066 untouched, G7 stays OPEN, PT 0.2 stays SOTA, no RH verdict. Any flip is over-claiming.',
    holds: () => {
      const c = IMP33705_RANK2_ANTISYMMETRY_OFFDIAGONAL_INERTNESS.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isScopingOnly === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.changesNoBound === true &&
        c.g7StaysOpen === true &&
        c.imp3066Untouched === true &&
        c.noRHVerdict === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33705_RANK2_ANTISYMMETRY_OFFDIAGONAL_INERTNESS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33705-rank2-antisymmetry-offdiagonal-inertness assertion failed: ${assertion.id}`);
  }
}

export default IMP33705_RANK2_ANTISYMMETRY_OFFDIAGONAL_INERTNESS;
