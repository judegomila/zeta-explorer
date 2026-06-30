/**
 * @module imp-3086-orthogonalized-basis-conditioning
 * @fileoverview imp-3086 -- Assess whether Gram-Schmidt orthogonalizing the monomial
 *   basis phi_j shrinks the imp-3066 off-diagonal Hankel cross-terms and the operator/
 *   diagonal gap on the representative truncation: is the measured obstruction partly a
 *   basis-conditioning artifact, or robust?
 *
 *   THE SETUP (inherited verbatim from imp-3066)
 *   --------------------------------------------
 *   imp-3066-offdiagonal-hankel-obstruction.js builds, on the representative degree-DEG
 *   monomial truncation phi_j(tau) = (tau/U)^j, the passive cosh Gram and the shear sinh
 *   Hankel and de-homogenizes them. CRUCIALLY, imp-3066 normalizes by only the DIAGONAL of
 *   the passive Gram: R_jk = H_jk / sqrt(P_jj P_kk). But the monomials phi_j are NOT
 *   orthogonal in the passive cosh inner product -- the FULL passive Gram
 *
 *       P_jk = int_0^U cosh(a*tau) phi_j(tau) phi_k(tau) d(tau)
 *
 *   is itself a dense (positive) Hankel form. Dropping its off-diagonal cross-terms is a
 *   BASIS-CONDITIONING choice: the raw monomial basis is ill-conditioned, so the imp-3066
 *   measured ||R||, operator/diagonal gap, and off-diagonal magnitudes may be inflated by
 *   that conditioning rather than by the intrinsic operator.
 *
 *   WHAT THIS MODULE ADDS (the imp-3086 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------------------
 *   We orthogonalize phi_j in the PASSIVE cosh inner product and re-measure. Two distinct
 *   orthogonalizations of the SAME inner product are used as independent witnesses:
 *
 *     (GS)  Triangular Gram-Schmidt: Cholesky P = G G^T, L = G^{-1} (lower-triangular), so
 *           the basis psi = L phi is cosh-orthonormal (L P L^T = I). The de-homogenized
 *           operator in this basis is R_orth = L H L^T -- the TRUE pencil operator, since
 *           the passive Gram is now exactly the identity.
 *     (LOW) Symmetric (Loewdin) orthogonalization: P^{-1/2} via the eigendecomposition of P,
 *           giving R_sym = P^{-1/2} H P^{-1/2}.
 *
 *   Both are genuine orthonormalizations of phi in the cosh inner product, so by the pencil
 *   identity det(L H L^T - lambda I) = det(L)^2 det(H - lambda P) their spectra COINCIDE:
 *   the operator norm of the true de-homogenized operator is a BASIS INVARIANT. We MEASURE:
 *
 *     (1) ||R_orth|| and ||R_sym|| agree to ~1e-13: the obstruction (operator norm) is a
 *         basis invariant, NOT a conditioning artifact -- Gram-Schmidt cannot shrink it.
 *     (2) Yet the imp-3066 DIAGONAL-ONLY normalization reports a wildly different operator
 *         norm, operator/diagonal gap, and off-diagonal Frobenius mass. Orthogonalizing the
 *         FULL passive Gram collapses all three (||R||: 4.62 -> 0.99, gap: 3.63 -> 0.09,
 *         off-diag Frobenius: 4.08 -> 0.69). So the imp-3066 GAP was LARGELY a basis-
 *         conditioning artifact of dropping the passive off-diagonal cross-terms.
 *     (3) A strictly-positive residual gap (||R_orth|| - max_j R_orth_jj > 0) SURVIVES the
 *         orthogonalization: the off-diagonal endpoint-Hankel obstruction is real, just much
 *         smaller than the raw monomial basis advertised.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC, on the SAME representative monomial truncation as imp-3066;
 *   NOT the actual section-26 Gram. The measured operator norm (0.99 here) carries NO RH
 *   verdict -- it neither claims the cover holds nor that it fails. The deliverable is ONLY
 *   the basis-invariance of the operator norm and the finding that the imp-3066 operator/
 *   diagonal gap is mostly a conditioning artifact while a smaller intrinsic gap survives.
 *   No positivity attempted. Bare-V pilot (imp-1240) NOT re-run. Platt-Trudgian Lambda <= 0.2
 *   REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (the raw-monomial-basis measurement this conditions)
 *   @see imp-3007-mupass-overflow-cover.js (the scalar cover + isolated operator step)
 *
 *   Ticket: imp-3086 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;            // headline shear weight (matches imp-3066 / imp-3007 HEADLINE a = 0.5)
const U = 6;              // genuine-Phi lag cutoff (the imp-3066 grid)
const DEG = 4;            // monomial degree -> representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;         // midpoint quadrature panels (matches imp-3066)
const HQ = U / NQ;
const N = DEG + 1;

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

// FULL passive cosh Gram P_jk = int cosh(a*tau) (tau/U)^{j+k}  (dense Hankel, NOT diagonal).
const P = Array.from({ length: N }, (_u, j) =>
  Array.from({ length: N }, (_v, k) => weightedMoment(cosh, j + k)),
);
// Shear sinh Hankel H_jk = int sinh(a*tau) (tau/U)^{j+k}  (same form imp-3066 uses).
const H = Array.from({ length: N }, (_u, j) =>
  Array.from({ length: N }, (_v, k) => weightedMoment(sinh, j + k)),
);
const Pdiag = Array.from({ length: N }, (_u, j) => P[j][j]);

// -- small dense linear algebra (self-contained, exact enough for a 5x5 truncation) --------

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
 * eigenvector matrix V (columns = eigenvectors). Self-contained, exact for a 5x5.
 */
function jacobi(matrix, wantVectors) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  const V = Array.from({ length: n }, (_u, i) =>
    Array.from({ length: n }, (_v, j) => (i === j ? 1 : 0)),
  );
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

function offDiagFrobenius(M) {
  let acc = 0;
  for (let j = 0; j < N; j++) {
    for (let k = 0; k < N; k++) {
      if (j !== k) acc += M[j][k] * M[j][k];
    }
  }
  return Math.sqrt(acc);
}

// -- (GS) Triangular Gram-Schmidt orthonormalization in the passive cosh inner product ------
// L = (Cholesky P)^{-1} so that psi = L phi is cosh-orthonormal (L P L^T = I).
const Lgs = invLower(choleskyLower(P));
const orthonormCheck = matmul(matmul(Lgs, P), transpose(Lgs)); // should equal identity
const Rorth = matmul(matmul(Lgs, H), transpose(Lgs));          // TRUE de-homogenized pencil operator
const eigOrth = jacobi(Rorth, false).values;
const opNormOrth = Math.max(...eigOrth.map((e) => Math.abs(e)));
const diagOrth = Rorth.map((row, i) => row[i]);
const maxDiagOrth = Math.max(...diagOrth);
const gapOrth = opNormOrth - maxDiagOrth;          // residual operator/diagonal gap (survives)
const offFrobOrth = offDiagFrobenius(Rorth);

// -- (LOW) Symmetric (Loewdin) orthogonalization P^{-1/2}: independent invariance witness ----
const eigP = jacobi(P, true);
const Psqrtinv = Array.from({ length: N }, (_u, a) =>
  Array.from({ length: N }, (_v, b) => {
    let s = 0;
    for (let i = 0; i < N; i++) s += eigP.vectors[a][i] * (1 / Math.sqrt(eigP.values[i])) * eigP.vectors[b][i];
    return s;
  }),
);
const Rsym = matmul(matmul(Psqrtinv, H), Psqrtinv);
const opNormSym = opNormOf(Rsym);
const opNormInvarianceRelDiff = Math.abs(opNormOrth - opNormSym) / opNormSym;

// -- imp-3066 DIAGONAL-ONLY normalization (reproduced for the apples-to-apples comparison) ---
const Rdiag = Array.from({ length: N }, (_u, j) =>
  Array.from({ length: N }, (_v, k) => H[j][k] / Math.sqrt(Pdiag[j] * Pdiag[k])),
);
const eigDiag = jacobi(Rdiag, false).values;
const opNormDiag = Math.max(...eigDiag.map((e) => Math.abs(e)));   // the imp-3066 headline ||R||
const diagD = Rdiag.map((row, i) => row[i]);
const maxDiagD = Math.max(...diagD);
const gapDiag = opNormDiag - maxDiagD;                             // the imp-3066 operator/diagonal gap
const offFrobDiag = offDiagFrobenius(Rdiag);

let maxOrthonormErr = 0;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    maxOrthonormErr = Math.max(maxOrthonormErr, Math.abs(orthonormCheck[i][j] - (i === j ? 1 : 0)));
  }
}

export const IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING = Object.freeze({
  id: 'imp-3086-orthogonalized-basis-conditioning',
  ticket: 'imp-3086',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  conditionsModule: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',

  summary:
    'Re-measures the imp-3066 off-diagonal Hankel obstruction AFTER orthogonalizing the monomial ' +
    'basis phi_j = (tau/U)^j in the passive cosh inner product. imp-3066 normalized only by the ' +
    'DIAGONAL of the passive Gram P_jk = int cosh(a*tau) phi_j phi_k, dropping its dense positive ' +
    'off-diagonal cross-terms -- a basis-conditioning choice on an ill-conditioned monomial basis. ' +
    'Triangular Gram-Schmidt (Cholesky P = G G^T, L = G^{-1}, R_orth = L H L^T) and symmetric ' +
    'Loewdin orthogonalization (R_sym = P^{-1/2} H P^{-1/2}) give the SAME operator norm to ~1e-13: ' +
    'the operator norm of the true de-homogenized pencil is a BASIS INVARIANT, not a conditioning ' +
    'artifact. Yet orthogonalizing the FULL passive Gram collapses the imp-3066 measured numbers -- ' +
    'operator norm 4.62 -> 0.99, operator/diagonal gap 3.63 -> 0.09, off-diagonal Frobenius 4.08 -> ' +
    '0.69 -- so the imp-3066 GAP was LARGELY a basis-conditioning artifact, while a smaller strictly-' +
    'positive residual gap survives. REPRESENTATIVE / DIAGNOSTIC; the operator norm carries NO RH ' +
    'verdict; positivity not attempted; not a reduction.',

  construction: Object.freeze({
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (raw monomials -- ill-conditioned in the cosh inner product)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (dense positive Hankel, NOT diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)  (the shear form imp-3066 measures)',
    gramSchmidt: 'L = (Cholesky P)^{-1} lower-triangular; psi = L phi is cosh-orthonormal (L P L^T = I)',
    deHomogenizedOrth: 'R_orth = L H L^T  (TRUE pencil operator: passive Gram is now exactly the identity)',
    loewdin: 'R_sym = P^{-1/2} H P^{-1/2}  (independent symmetric-orthogonalization invariance witness)',
    imp3066DiagonalOnly: 'R_diag_jk = H_jk / sqrt(P_jj P_kk)  (the imp-3066 diagonal-only normalization)',
    a: A,
    U,
    degree: DEG,
    truncationSize: N,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    operatorNormGramSchmidt: opNormOrth,            // ||R_orth|| -- true pencil operator norm
    operatorNormLoewdin: opNormSym,                 // ||R_sym|| -- agrees to ~1e-13
    operatorNormInvarianceRelDiff: opNormInvarianceRelDiff, // |GS - Loewdin| / Loewdin: basis invariance
    operatorNormImp3066Diagonal: opNormDiag,        // the imp-3066 diagonal-only ||R|| (conditioning-inflated)
    operatorDiagonalGapGramSchmidt: gapOrth,        // residual gap that SURVIVES orthogonalization (> 0)
    operatorDiagonalGapImp3066Diagonal: gapDiag,    // the imp-3066 gap (mostly artifact)
    offDiagonalFrobeniusGramSchmidt: offFrobOrth,   // off-diagonal mass after orthogonalization
    offDiagonalFrobeniusImp3066Diagonal: offFrobDiag, // off-diagonal mass in the raw normalization
    maxDiagonalGramSchmidt: maxDiagOrth,
    maxDiagonalImp3066Diagonal: maxDiagD,
    eigenvaluesGramSchmidt: Object.freeze(eigOrth.slice()),
    orthonormalizationResidual: maxOrthonormErr,    // max|L P L^T - I|: GS orthonormalization correctness
  }),

  interpretation: Object.freeze({
    operatorNormIsBasisInvariant:
      'Triangular Gram-Schmidt (R_orth = L H L^T, L P L^T = I) and symmetric Loewdin ' +
      'orthogonalization (R_sym = P^{-1/2} H P^{-1/2}) are two distinct orthonormalizations of phi ' +
      'in the SAME cosh inner product; by the pencil identity det(L H L^T - lambda I) = det(L)^2 ' +
      'det(H - lambda P) they share the spectrum of the generalized pencil (H, P). Their operator ' +
      'norms agree to ~1e-13: ||R|| of the true de-homogenized operator is a BASIS INVARIANT.',
    imp3066GapIsMostlyArtifact:
      'imp-3066 normalized by ONLY the diagonal of P, dropping its dense positive off-diagonal ' +
      'cosh cross-terms on an ill-conditioned monomial basis. Restoring the full passive Gram via ' +
      'orthogonalization collapses the measured operator norm (4.62 -> 0.99), the operator/diagonal ' +
      'gap (3.63 -> 0.09), and the off-diagonal Frobenius mass (4.08 -> 0.69): the imp-3066 gap was ' +
      'LARGELY a basis-conditioning artifact of the raw monomial basis.',
    residualObstructionSurvives:
      'A strictly-positive residual operator/diagonal gap (||R_orth|| - max_j R_orth_jj > 0) ' +
      'survives the orthogonalization: the off-diagonal endpoint-Hankel obstruction is robust, just ' +
      'far smaller than the raw monomial basis advertised. Conditioning the basis shrinks it but does ' +
      'not remove it.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured operator norm (0.99 on this orthogonalized truncation) is on the SAME ' +
      'representative monomial-moment truncation as imp-3066; it is NOT the section-26 Gram, so it ' +
      'neither claims the cover holds nor that it fails. Only the basis-invariance of the operator ' +
      'norm and the conditioning-artifact character of the imp-3066 gap are asserted.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING_ASSERTIONS = [
  {
    id: 'imp3086-truncation-shape',
    why: 'The diagnostic lives on a (DEG+1) x (DEG+1) symmetric truncation; a shape drift means ' +
         'the self-computing Gram build dropped or duplicated a basis function.',
    holds: () =>
      P.length === N && P.every((row) => row.length === N) &&
      H.length === N && Rorth.length === N && Rorth.every((row) => row.length === N),
  },
  {
    id: 'imp3086-gram-schmidt-orthonormalizes',
    why: 'L = (Cholesky P)^{-1} must make psi = L phi cosh-orthonormal: L P L^T = I. If this drifts ' +
         'the orthogonalization is wrong and R_orth is not the true pencil operator.',
    holds: () => maxOrthonormErr < 1e-6,
  },
  {
    id: 'imp3086-Rorth-symmetric',
    why: 'R_orth = L H L^T with symmetric H is exactly symmetric; a broken symmetry means the ' +
         'congruence was mis-applied.',
    holds: () => {
      for (let j = 0; j < N; j++) {
        for (let k = 0; k < N; k++) {
          if (Math.abs(Rorth[j][k] - Rorth[k][j]) > 1e-10) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp3086-operator-norm-is-basis-invariant',
    why: 'THE HEADLINE: triangular Gram-Schmidt and symmetric Loewdin orthogonalization of the SAME ' +
         'cosh inner product share the pencil spectrum, so their operator norms must agree. ' +
         'Agreement to ~1e-13 certifies ||R|| is a basis invariant, NOT a conditioning artifact.',
    holds: () => opNormInvarianceRelDiff < 1e-7 && opNormOrth > 0 && opNormSym > 0,
  },
  {
    id: 'imp3086-orthogonalization-collapses-imp3066-numbers',
    why: 'imp-3066 normalized by only the diagonal of P, inflating the measured operator norm, gap, ' +
         'and off-diagonal mass. Restoring the full passive Gram must STRICTLY shrink all three -- ' +
         'this is the basis-conditioning-artifact finding the ticket asks for.',
    holds: () =>
      opNormOrth < opNormDiag &&
      gapOrth < gapDiag &&
      offFrobOrth < offFrobDiag,
  },
  {
    id: 'imp3086-residual-obstruction-survives',
    why: 'After orthogonalization a strictly-positive residual operator/diagonal gap must remain: the ' +
         'off-diagonal endpoint-Hankel obstruction is robust (smaller, not gone). A non-positive gap ' +
         'would mean orthogonalization removed the obstruction entirely.',
    holds: () => gapOrth > 1e-9 && opNormOrth > maxDiagOrth,
  },
  {
    id: 'imp3086-basis-invariance-and-collapse-anchors-pinned',
    why: 'imp-3111 lock: pin the THREE published headline numbers against silent drift. ' +
         '(a) ABSOLUTE basis invariance |||R_orth|| - ||R_sym||| < 1e-12 (stronger than the ' +
         'relative-diff tripwire above; certifies the two distinct orthogonalizations of the ' +
         'cosh inner product share the pencil operator norm to full double precision). ' +
         '(b) the residual operator/diagonal gap survives strictly positive. ' +
         '(c) the published collapse anchors ||R||: 4.62 -> 0.99 and gap: 3.63 -> 0.09 -- a ' +
         'silent edit to the F,G moment build or the orthogonalization would drift these.',
    holds: () =>
      Math.abs(opNormOrth - opNormSym) < 1e-12 &&
      gapOrth > 0 &&
      Math.abs(opNormDiag - 4.617) < 5e-3 &&
      Math.abs(opNormOrth - 0.993) < 5e-3 &&
      Math.abs(gapDiag - 3.626) < 5e-3 &&
      Math.abs(gapOrth - 0.088) < 5e-3,
  },
  {
    id: 'imp3086-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: REPRESENTATIVE diagnostic truncation, operator norm carries no RH ' +
         'verdict, positivity not attempted, not a proof or reduction, bare pilot not re-run, and ' +
         'PT 0.2 stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING.honestCaveat;
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

for (const assertion of IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3086-orthogonalized-basis-conditioning assertion failed: ${assertion.id}`);
  }
}

export default IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING;
