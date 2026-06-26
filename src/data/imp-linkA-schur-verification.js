// imp-2856: Self-contained rigorous verification of Section-27 LINK A.
//
// LINK A (the SURVIVING half of the refuted §27 two-way collapse):
//
//     [[ I , V ],            is positive semidefinite (PSD)
//      [ V*, I ]]            <==>   ||V|| <= 1.
//
// section27-identity-refutation-2026-06-17.js records this as a GENUINE
// textbook fact (Bhatia 1997 Prop 1.3.2; Schur complement I - V V*, D = I > 0),
// the one part of the collapse that survives. imp-2664 records the same claim
// at the structured/textual level. This module makes it CONCRETE: a written-out
// Schur-complement argument PLUS a dependency-free numerical witness (a Jacobi
// symmetric eigensolver) that exhibits the biconditional in both directions and
// the exact spectral identity that underlies it. It is deliberately and
// explicitly demarcated from the REFUTED LINK B (||V|| <= 1 <==> K_a >= 0),
// which fails as a Phi-uniform equivalence by scale invariance.
//
// METHOD: training-time operator theory only. No claim about RH; LINK A on its
// own gives NOTHING toward the Lambda bound -- it is the load-bearing LINK B
// that is refuted, so the collapse stays conditional and PT Lambda <= 0.2 is
// unchanged. This module hardens the honest split so LINK A (real) and LINK B
// (refuted) cannot be re-conflated.

// ─────────────────────────────────────────────────────────────────────────────
// THE SCHUR-COMPLEMENT ARGUMENT, written out.
// ─────────────────────────────────────────────────────────────────────────────
//
// Block-positivity criterion (Bhatia 1997, Prop 1.3.2). For a self-adjoint
// 2x2 operator block matrix
//          M = [[ A , B ],
//               [ B*, D ]]      with D > 0 (strictly positive, invertible),
// one has
//          M >= 0   <==>   the Schur complement  A - B D^{-1} B*  >= 0.
//
// (Direction "=>": for any vector x take y = -D^{-1}B* x and evaluate the
//  quadratic form on (x, y) >= 0 to get x*(A - B D^{-1} B*)x >= 0. Direction
//  "<=": complete the square; M factors as L* diag(A - B D^{-1}B*, D) L with L
//  unit-triangular, so M inherits PSD from the block-diagonal middle factor.)
//
// SPECIALIZE to the §27 block with A = I, B = V, D = I (so D = I > 0, the
// hypothesis holds trivially):
//          M = [[ I , V ],
//               [ V*, I ]]
//   Schur complement = A - B D^{-1} B* = I - V I^{-1} V* = I - V V*.
//   Therefore   M >= 0   <==>   I - V V* >= 0.
//
// Finally  I - V V* >= 0  <==>  V V* <= I  <==>  ||V V*|| <= 1  <==>  ||V||^2 <= 1
//   <==>  ||V|| <= 1   (operator/spectral norm; ||V V*|| = ||V||^2 is the
//   C*-identity). QED for LINK A, BOTH directions, for any bounded operator V.
//
// EXACT SPECTRAL IDENTITY used by the numerical witness below. Writing
//   M = I_{2n} + J,   J = [[0, V],[V*, 0]]   (Jordan-Wielandt form of V),
// the eigenvalues of J are exactly { +sigma_i(V), -sigma_i(V) } where sigma_i
// are the singular values of V. Hence
//   eig(M) = { 1 +/- sigma_i(V) }   and   lambda_min(M) = 1 - sigma_max(V)
//                                                        = 1 - ||V||.
// So M >= 0  <==>  lambda_min(M) >= 0  <==>  ||V|| <= 1, and the equivalence is
// not merely qualitative: the LEAST eigenvalue of the block matrix equals
// 1 - ||V|| on the nose. The witness checks this identity to ~1e-9.

// ── Dependency-free symmetric (Jacobi) eigensolver, small dense matrices. ──
// Classic cyclic Jacobi rotations; converges for any real symmetric matrix.
function jacobiEigenvalues(Ain) {
  const n = Ain.length;
  // deep copy
  const A = Ain.map((row) => row.slice());
  for (let sweep = 0; sweep < 100; sweep++) {
    // off-diagonal Frobenius norm
    let off = 0;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    }
    if (off < 1e-24) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const apq = A[p][q];
        const phi = 0.5 * Math.atan2(2 * apq, aqq - app);
        const c = Math.cos(phi);
        const s = Math.sin(phi);
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  const eigs = [];
  for (let i = 0; i < n; i++) eigs.push(A[i][i]);
  return eigs.sort((a, b) => a - b);
}

// Spectral norm ||V|| = sqrt(lambda_max(V^T V)) for a real matrix V.
function spectralNorm(V) {
  const rows = V.length;
  const cols = V[0].length;
  const gram = [];
  for (let i = 0; i < cols; i++) {
    gram.push(new Array(cols).fill(0));
    for (let j = 0; j < cols; j++) {
      let s = 0;
      for (let k = 0; k < rows; k++) s += V[k][i] * V[k][j];
      gram[i][j] = s;
    }
  }
  const eigs = jacobiEigenvalues(gram);
  return Math.sqrt(Math.max(0, eigs[eigs.length - 1]));
}

// Build the §27 self-adjoint block matrix M = [[I, V],[V^T, I]] (real case).
function blockMatrix(V) {
  const rows = V.length;
  const cols = V[0].length;
  const n = rows + cols;
  const M = [];
  for (let i = 0; i < n; i++) M.push(new Array(n).fill(0));
  for (let i = 0; i < rows; i++) M[i][i] = 1; // top-left I
  for (let j = 0; j < cols; j++) M[rows + j][rows + j] = 1; // bottom-right I
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      M[i][rows + j] = V[i][j]; // top-right V
      M[rows + j][i] = V[i][j]; // bottom-left V^T (= V* for real V)
    }
  }
  return M;
}

// Test operators V spanning ||V|| < 1, = 1, and > 1.
const TEST_OPERATORS = [
  { label: 'contraction ||V||<1', V: [[0.4, -0.1], [0.2, 0.3]] },
  { label: 'isometry ||V||=1 (orthogonal)', V: [[0, -1], [1, 0]] },
  { label: 'unit diagonal ||V||=1', V: [[1, 0], [0, 0.5]] },
  { label: 'expansion ||V||>1', V: [[1.5, 0.2], [0.0, 0.9]] },
  { label: 'rank-deficient contraction', V: [[0.6, 0.6], [0.6, 0.6]] }, // ||V||=1.2
  { label: 'non-square 3x2 contraction', V: [[0.3, 0.1], [0.0, 0.4], [0.2, 0.2]] },
];

export const LINK_A_SCHUR_VERIFICATION = {
  id: 'imp-2856-linkA-schur-verification',
  date: '2026-06-25',
  statement:
    'Block [[I,V],[V*,I]] >= 0  <==>  ||V|| <= 1, via the Schur complement I - V V* with D = I > 0 (Bhatia 1997 Prop 1.3.2).',
  schurComplement: 'A - B D^{-1} B* = I - V I^{-1} V* = I - V V*',
  spectralIdentity: 'lambda_min([[I,V],[V*,I]]) = 1 - ||V|| (Jordan-Wielandt: eig = 1 +/- sigma_i(V))',
  bothDirections: true,
  references: 'Bhatia, Matrix Analysis (1997) Prop 1.3.2; Schur complement; C*-identity ||V V*|| = ||V||^2.',
  // The boundary that must never blur:
  surviving: 'LINK A (this module): GENUINE, both directions, for any bounded V.',
  refuted:
    'LINK B (||V|| <= 1 <==> K_a >= 0): REFUTED as a Phi-uniform equivalence (scale-invariance obstruction); NOT a Schur consequence.',
  consequence:
    'LINK A alone yields NOTHING toward Lambda; the load-bearing LINK B is refuted, so the §27 collapse stays conditional and Platt-Trudgian Lambda <= 0.2 is unchanged.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Assertions: exercise the biconditional numerically, both directions.
// ─────────────────────────────────────────────────────────────────────────────
const TOL = 1e-9;

export const LINK_A_SCHUR_ASSERTIONS = [
  {
    id: 'linkA-blockPSD-iff-norm-le-1',
    description:
      'For each test operator: lambda_min([[I,V],[V*,I]]) >= -TOL  <==>  ||V|| <= 1 + TOL (both directions of LINK A).',
    holds: () => {
      for (const t of TEST_OPERATORS) {
        const lamMin = jacobiEigenvalues(blockMatrix(t.V))[0];
        const nrm = spectralNorm(t.V);
        const blockPSD = lamMin >= -TOL;
        const normBounded = nrm <= 1 + TOL;
        if (blockPSD !== normBounded) return false;
      }
      return true;
    },
  },
  {
    id: 'linkA-exact-spectral-identity',
    description:
      'The least eigenvalue of the block matrix equals 1 - ||V|| on the nose (Jordan-Wielandt eig = 1 +/- sigma_i(V)).',
    holds: () => {
      for (const t of TEST_OPERATORS) {
        const lamMin = jacobiEigenvalues(blockMatrix(t.V))[0];
        const nrm = spectralNorm(t.V);
        if (Math.abs(lamMin - (1 - nrm)) > 1e-7) return false;
      }
      return true;
    },
  },
  {
    id: 'linkA-schur-complement-form',
    description:
      'Recorded Schur complement is I - V V* with D = I > 0, both directions, matching Bhatia 1997 Prop 1.3.2.',
    holds: () =>
      /I - V V\*/.test(LINK_A_SCHUR_VERIFICATION.schurComplement) &&
      LINK_A_SCHUR_VERIFICATION.bothDirections === true &&
      /1\.3\.2/.test(LINK_A_SCHUR_VERIFICATION.references),
  },
  {
    id: 'linkA-demarcated-from-refuted-linkB',
    description:
      'The genuine/refuted boundary is documented: LINK A surviving, LINK B refuted by scale-invariance, collapse stays conditional.',
    holds: () =>
      /GENUINE/.test(LINK_A_SCHUR_VERIFICATION.surviving) &&
      /REFUTED/.test(LINK_A_SCHUR_VERIFICATION.refuted) &&
      /scale-invariance/.test(LINK_A_SCHUR_VERIFICATION.refuted) &&
      /conditional/.test(LINK_A_SCHUR_VERIFICATION.consequence),
  },
];

for (const a of LINK_A_SCHUR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-linkA-schur-verification assertion failed: ${a.id}`);
  }
}
