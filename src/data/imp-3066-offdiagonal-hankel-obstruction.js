/**
 * @module imp-3066-offdiagonal-hankel-obstruction
 * @fileoverview imp-3066 -- Assess and characterize the lone operator-positivity
 *   obstruction that the COMPLETE scalar mu^pass cover (imp-3007, residual deficit 0)
 *   leaves untouched: the OFF-DIAGONAL endpoint-Hankel cross-terms of the shear Gram.
 *
 *   THE SETUP (from imp-3007 section 3, the precisely-located residual gap)
 *   ----------------------------------------------------------------------
 *   imp-3007-mupass-overflow-cover.js drives the degree-0 overflow deficit to EXACTLY
 *   zero via the cosh-completion w^pass(tau) = cosh(a*tau) >= sinh(a*tau) = nu(tau).
 *   But that is a SCALAR (pointwise, lag-symbol) statement. The RH-equivalent target
 *   is the OPERATOR positivity K_a >= 0, i.e. the de-homogenized
 *
 *       R = Gpass^{-1/2} Gshear Gpass^{-1/2}
 *
 *   must be a contraction (||R|| <= 1). Pointwise weight domination controls only the
 *   DIAGONAL of the section-26 Gram comparison; the shear Gram Gshear is a genuinely
 *   OFF-DIAGONAL endpoint-Hankel form whose cross-terms scalar domination does not see.
 *   imp-3007 isolated that operator step as the lone remaining obstruction but did not
 *   characterize it. This module does -- DIAGNOSTICALLY, on a representative truncation.
 *
 *   WHAT THIS MODULE ADDS (the imp-3066 deliverable -- SCOPE ONLY)
 *   -------------------------------------------------------------
 *   On a representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j we build
 *   the two Gram objects exactly as the scalar cover delivers them:
 *
 *     - the PASSIVE diagonal D_jj = int_0^U cosh(a*tau) phi_j(tau)^2 d(tau)   -- this is
 *       precisely the part the SCALAR cover controls (the multiplication symbol / diagonal);
 *     - the SHEAR Hankel H_jk = int_0^U sinh(a*tau) phi_j(tau) phi_k(tau) d(tau), whose
 *       entries depend only on j+k -- a genuine (endpoint-)Hankel form with NON-ZERO
 *       off-diagonal cross-terms.
 *
 *   The de-homogenized R is then R_jk = H_jk / sqrt(D_jj D_kk). We MEASURE, not prove:
 *
 *     (1) DIAGONAL of R -- R_jj = [int sinh phi_j^2]/[int cosh phi_j^2] < 1 for every j.
 *         This is exactly the scalar cover, realized as a matrix: every diagonal entry
 *         sits strictly below 1. Scalar domination is NECESSARY and it DOES hold here.
 *     (2) The SMALLEST off-diagonal Hankel cross-term min_{j!=k} |H_jk| > 0 (and the
 *         smallest off-diagonal of R) -- the magnitude of what scalar domination leaves
 *         untouched on this truncation.
 *     (3) The OPERATOR/diagonal GAP: ||R|| - max_j R_jj > 0, STRICTLY. R has strictly
 *         positive entries, so by Perron-Frobenius its top eigenvalue (= operator norm)
 *         strictly exceeds its largest diagonal entry. That strictly-positive gap is the
 *         off-diagonal cross-term contribution -- the obstruction, quantified: the scalar
 *         cover pins every diagonal below 1, yet the operator norm overshoots the diagonal
 *         bound by an amount fed ENTIRELY by the off-diagonal Hankel cross-terms.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC. This is a REPRESENTATIVE monomial-moment truncation chosen
 *   to EXHIBIT and MEASURE the off-diagonal obstruction; it is NOT the actual section-26
 *   Gram, so the measured ||R|| carries NO RH verdict -- in particular ||R|| here is NOT a
 *   claim that the cover fails (nor that it holds). The deliverable is ONLY the existence
 *   and magnitude of the off-diagonal cross-terms and the strictly-positive operator/
 *   diagonal gap that scalar domination cannot reach. We do NOT attempt positivity. The
 *   bare-V pilot (imp-1240) is NOT re-run. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3007-mupass-overflow-cover.js (imp-3007 section 3: the scalar cover + isolated operator step)
 *   @see imp-3065-residual-deficit-quadrature-2026-06-30.js (independent Simpson cross-check of the scalar cover)
 *
 *   Ticket: imp-3066 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;            // headline shear weight (matches imp-3007 HEADLINE a = 0.5)
const U = 6;              // genuine-Phi lag cutoff (the imp-3007 grid)
const DEG = 4;            // monomial degree -> a representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;         // midpoint quadrature panels for the Gram moments
const HQ = U / NQ;

/** Midpoint quadrature of int_0^U weightFn(tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

const cosh = Math.cosh;
const sinh = Math.sinh;

// Passive diagonal D_jj = int cosh(a*tau) phi_j^2  (phi_j = (tau/U)^j -> phi_j^2 = (tau/U)^{2j}).
// This is exactly the part the SCALAR cover controls (the diagonal multiplication symbol).
const Ddiag = Array.from({ length: DEG + 1 }, (_unused, j) => weightedMoment(cosh, 2 * j));

// Shear Hankel H_jk = int sinh(a*tau) phi_j phi_k = moment of sinh at power (j+k): genuine Hankel.
const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, j + k)),
);

// De-homogenized R_jk = H_jk / sqrt(D_jj D_kk). Diagonal = scalar-cover ratios; off-diagonal
// = the Hankel cross-terms scalar domination never sees.
const R = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
);

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix. Returns the diagonal
 * after sweeping the largest off-diagonal to zero; for our positive R the largest is the
 * Perron operator norm. Self-contained (no deps), exact enough for a 5x5 truncation.
 */
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

const eigenvalues = symmetricEigenvalues(R);
const opNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));      // ||R|| = Perron eigenvalue
const diagR = R.map((row, i) => row[i]);
const rDiagMax = Math.max(...diagR);                                  // largest scalar-cover ratio
const operatorDiagonalGap = opNorm - rDiagMax;                        // off-diagonal contribution (> 0)

// Smallest / largest off-diagonal cross-terms of the shear Hankel (the magnitude the ticket asks for).
let minOffDiagHankel = Infinity;
let maxOffDiagHankel = 0;
let minOffDiagR = Infinity;
let offDiagFrobeniusSq = 0;
for (let j = 0; j <= DEG; j++) {
  for (let k = 0; k <= DEG; k++) {
    if (j === k) continue;
    const h = Math.abs(Hshear[j][k]);
    if (h < minOffDiagHankel) minOffDiagHankel = h;
    if (h > maxOffDiagHankel) maxOffDiagHankel = h;
    const r = Math.abs(R[j][k]);
    if (r < minOffDiagR) minOffDiagR = r;
    offDiagFrobeniusSq += R[j][k] * R[j][k];
  }
}
const offDiagFrobenius = Math.sqrt(offDiagFrobeniusSq);
const traceR = diagR.reduce((acc, x) => acc + x, 0);
const sumEig = eigenvalues.reduce((acc, x) => acc + x, 0);

export const IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION = Object.freeze({
  id: 'imp-3066-offdiagonal-hankel-obstruction',
  ticket: 'imp-3066',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedCover: 'imp-3007-mupass-overflow-cover.js',
  relatedQuadrature: 'imp-3065-residual-deficit-quadrature-2026-06-30.js',

  summary:
    'Characterizes -- diagnostically, on a representative degree-4 monomial truncation -- the ' +
    'lone operator-positivity obstruction the COMPLETE scalar mu^pass cover (imp-3007, residual ' +
    'deficit 0) leaves untouched: the off-diagonal endpoint-Hankel cross-terms of the shear Gram. ' +
    'Building the passive diagonal D_jj = int cosh(a*tau) (tau/U)^{2j} (the part scalar domination ' +
    'controls) and the shear Hankel H_jk = int sinh(a*tau) (tau/U)^{j+k} (the off-diagonal form), ' +
    'the de-homogenized R = Gpass^{-1/2} Gshear Gpass^{-1/2} has every DIAGONAL entry strictly ' +
    'below 1 (the scalar cover, realized as a matrix) yet -- because R has strictly positive entries ' +
    '-- a Perron operator norm ||R|| that STRICTLY exceeds its largest diagonal. That strictly-positive ' +
    'operator/diagonal gap is fed entirely by the off-diagonal Hankel cross-terms: the magnitude of ' +
    'what scalar domination cannot reach, measured. REPRESENTATIVE / DIAGNOSTIC; ||R|| carries NO RH ' +
    'verdict; does NOT attempt positivity; not a reduction.',

  construction: Object.freeze({
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials -> O(1), well-conditioned truncation)',
    passiveDiagonal: 'D_jj = int_0^U cosh(a*tau) phi_j(tau)^2 d(tau)  (the SCALAR-cover-controlled diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j(tau) phi_k(tau) d(tau)  (depends on j+k: genuine Hankel)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk)  (= Gpass^{-1/2} Gshear Gpass^{-1/2} with Gpass diagonal)',
    a: A,
    U,
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    diagonalOfR: Object.freeze(diagR.slice()),       // every entry < 1: the scalar cover, as a matrix
    rDiagMax,                                          // largest scalar-cover ratio (< 1)
    operatorNorm: opNorm,                              // ||R|| = Perron eigenvalue of the truncation
    operatorDiagonalGap,                               // ||R|| - max diag(R) > 0: the off-diagonal contribution
    minOffDiagonalHankelCrossTerm: minOffDiagHankel,   // smallest |H_jk|, j != k  (the ticket measurement)
    maxOffDiagonalHankelCrossTerm: maxOffDiagHankel,
    minOffDiagonalR: minOffDiagR,
    offDiagonalFrobeniusNormOfR: offDiagFrobenius,     // total off-diagonal mass of R
    eigenvaluesOfR: Object.freeze(eigenvalues.slice()),
    traceR,                                            // = sum(eigenvalues): eigensolver sanity
  }),

  interpretation: Object.freeze({
    scalarCoverRealizedAsDiagonal:
      'Every diagonal entry R_jj = [int sinh phi_j^2]/[int cosh phi_j^2] < 1: the imp-3007 scalar ' +
      'cover is NECESSARY and it DOES hold, pinning the diagonal multiplication symbol below 1.',
    offDiagonalIsTheObstruction:
      'R has strictly positive off-diagonal Hankel cross-terms (min |H_jk| > 0), so by Perron-' +
      'Frobenius the operator norm ||R|| strictly exceeds the largest diagonal: the gap is the ' +
      'off-diagonal contribution, exactly the content scalar domination leaves untouched.',
    whyNecessaryNotSufficient:
      'A complete scalar cover bounds only the diagonal; the operator contraction ||R|| <= 1 needs ' +
      'the off-diagonal endpoint-Hankel cross-terms bounded too -- the RH-hard step imp-3007 isolated.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured ||R|| is on a representative monomial-moment truncation chosen to EXHIBIT the ' +
      'off-diagonal cross-terms; it is NOT the section-26 Gram, so it neither claims the cover fails ' +
      'nor that it holds. Only the existence and magnitude of the off-diagonal obstruction is asserted.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION_ASSERTIONS = [
  {
    id: 'imp3066-truncation-shape',
    why: 'The diagnostic lives on a (DEG+1) x (DEG+1) symmetric truncation; a shape drift means ' +
         'the self-computing Gram build dropped or duplicated a basis function.',
    holds: () =>
      R.length === DEG + 1 &&
      R.every((row) => row.length === DEG + 1) &&
      Ddiag.length === DEG + 1,
  },
  {
    id: 'imp3066-R-symmetric',
    why: 'R = Gpass^{-1/2} Gshear Gpass^{-1/2} with a diagonal Gpass and a Hankel Gshear is exactly ' +
         'symmetric; a broken symmetry means the cross-term normalization is wrong.',
    holds: () => {
      for (let j = 0; j <= DEG; j++) {
        for (let k = 0; k <= DEG; k++) {
          if (Math.abs(R[j][k] - R[k][j]) > 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp3066-scalar-cover-holds-on-diagonal',
    why: 'The imp-3007 scalar cover, realized as a matrix: every diagonal R_jj = [int sinh phi_j^2]/' +
         '[int cosh phi_j^2] must sit STRICTLY below 1 (sinh < cosh pointwise). If any diagonal ' +
         'reaches 1 the scalar cover -- the necessary part -- has broken.',
    holds: () => diagR.every((d) => d < 1 && d > 0),
  },
  {
    id: 'imp3066-offdiagonal-cross-terms-nonzero',
    why: 'The shear Gram is a genuine Hankel form: its off-diagonal cross-terms must be strictly ' +
         'positive (sinh(a*tau) > 0 on (0, U]). The smallest |H_jk| (j != k) is the magnitude the ' +
         'ticket measures; a zero would mean there is no off-diagonal obstruction to scope.',
    holds: () => minOffDiagHankel > 0 && minOffDiagR > 0,
  },
  {
    id: 'imp3066-operator-exceeds-diagonal-strictly',
    why: 'THE OBSTRUCTION, quantified: R has strictly positive entries, so by Perron-Frobenius the ' +
         'operator norm ||R|| strictly exceeds its largest diagonal entry. The strictly-positive gap ' +
         '||R|| - max diag(R) is the off-diagonal cross-term contribution scalar domination cannot ' +
         'reach. A non-positive gap would mean the off-diagonal terms vanish from the spectrum.',
    holds: () => operatorDiagonalGap > 1e-9 && opNorm > rDiagMax,
  },
  {
    id: 'imp3066-eigensolver-trace-consistent',
    why: 'Sanity on the self-contained Jacobi solver: sum of eigenvalues must equal trace(R) (the ' +
         'rotations are trace-preserving). A mismatch means the eigenvalue extraction is unreliable ' +
         'and the operator norm cannot be trusted.',
    holds: () => Math.abs(sumEig - traceR) < 1e-9,
  },
  {
    id: 'imp3066-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic truncation, the operator norm ' +
         'carries no RH verdict, positivity was not attempted, it is not a proof or a reduction, and ' +
         'no refereed bound is changed. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.honestCaveat;
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

for (const assertion of IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3066-offdiagonal-hankel-obstruction assertion failed: ${assertion.id}`);
  }
}

export default IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION;
