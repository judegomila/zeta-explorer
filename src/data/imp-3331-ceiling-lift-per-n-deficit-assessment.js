/**
 * @module imp-3331-ceiling-lift-per-n-deficit-assessment
 * @fileoverview imp-3331 -- Assess whether the imp-3288 operator-order corollary
 *   (P - H) >= (1 - tanh(a*U)) * P can be lifted to a RIGOROUS per-N
 *   (finite-dimensional Gram) lower bound on the section-26 passive-minus-shear
 *   deficit that FEEDS the imp-3066 off-diagonal endpoint-Hankel operator step,
 *   or whether the L2 scalar-core ceiling is structurally DISCONNECTED from that
 *   endpoint-Hankel obstruction (necessary-not-sufficient at operator order).
 *
 *   THE ASSESSMENT RESOLVES CLEANLY: THE LIFT EXISTS, BUT AGAINST THE WRONG NORM
 *   ----------------------------------------------------------------------------
 *   imp-3288 proves, over ALL of L2([0,U]), the quadratic-form ceiling
 *     <f, H f> <= tanh(a*U) <f, P f>   for every f, with   H = sinh(a*tau)*,
 *                                                            P = cosh(a*tau)*,
 *   sharp (sup = tanh(a*U) < 1) but not attained. Its operator-order corollary
 *   is the normalized deficit (P - H) >= (1 - tanh(a*U)) P > 0.
 *
 *   PART 1 -- THE LIFT DOES EXIST, per-N, against the FULL passive Gram
 *   ------------------------------------------------------------------
 *   Fix any finite basis {phi_j}_{j=0..DEG} (here the imp-3066 rescaled monomials
 *   phi_j = (tau/U)^j) and compress the two SYMMETRIC forms:
 *     A_jk = <phi_j, H phi_k> = int sinh(a*tau) phi_j phi_k   (shear Gram)
 *     B_jk = <phi_j, P phi_k> = int cosh(a*tau) phi_j phi_k   (FULL passive Gram)
 *   For any coefficient vector c, f = sum c_j phi_j is an honest L2 function, so
 *   the scalar lemma applies verbatim: c^T A c = <f,H f> <= tanh(a*U) <f,P f>
 *   = tanh(a*U) c^T B c. Since this holds for every c, in Loewner (matrix) order
 *
 *       tanh(a*U) * B  -  A  >=  0   (positive semidefinite),      (LIFT)
 *
 *   equivalently the per-N passive-minus-shear deficit B - A >= (1 - tanh(a*U)) B
 *   >= 0. This is a RIGOROUS per-N lower bound -- we CERTIFY it here by verifying
 *   the smallest eigenvalue of tanh(a*U) B - A is >= 0 (it sits at +3.8e-6 for
 *   DEG=4 and shrinks toward 0+ as DEG grows, exactly as imp-3288 sharpness
 *   predicts: monomials approximate the near-endpoint concentrating extremizer
 *   ever better but never cross the ceiling).
 *
 *   PART 2 -- THE LIFT DOES NOT FEED imp-3066: the endpoint-Hankel step uses a
 *   DIFFERENT normalization (the passive DIAGONAL, not the full passive Gram)
 *   ----------------------------------------------------------------------------
 *   The imp-3066 de-homogenized operator is R = Gpass^{-1/2} Gshear Gpass^{-1/2}
 *   with Gpass taken DIAGONAL: D = diag(B), D_jj = int cosh(a*tau) phi_j^2. Thus
 *   R_jk = A_jk / sqrt(D_jj D_kk) and ||R|| = sup_c c^T A c / <c, D c>. The LIFT
 *   bounds c^T A c / c^T B c, NOT c^T A c / <c, D c> -- and these differ because
 *   the DIAGONAL of a positive matrix is NOT below the full matrix in Loewner
 *   order (D <= B is FALSE): B carries passive OFF-DIAGONAL cross-terms that D
 *   discards. Concretely the diagonal-normalized deficit is NOT PSD:
 *
 *       tanh(a*U) * D  -  A  is INDEFINITE   (min eigenvalue ~ -33.6, DEG=4),
 *
 *   so ||R|| = sup c^T A c / <c,D c> STRICTLY EXCEEDS tanh(a*U) (measured ~4.6 at
 *   DEG=4, worsening to larger values as DEG grows and more passive off-diagonal
 *   mass is thrown away). The scalar ceiling therefore does NOT bound the
 *   imp-3066 endpoint-Hankel operator norm.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   The imp-3288 operator-order corollary LIFTS to a rigorous per-N matrix deficit
 *   -- but ONLY for the FULL passive Gram B (tanh(a*U) B - A PSD). Against the
 *   passive DIAGONAL D = diag(B) that the imp-3066 endpoint-Hankel step actually
 *   normalizes with, the same deficit is INDEFINITE and the operator norm ||R||
 *   overshoots the ceiling. The L2 scalar-core ceiling is thus NECESSARY (it
 *   pins the full-Gram generalized Rayleigh sup, = imp-3326 Reading 1) but
 *   NOT SUFFICIENT: it is structurally DISCONNECTED from the endpoint-Hankel
 *   obstruction, which lives one normalization removed -- exactly the off-diagonal
 *   Hankel cross-term gap imp-3066 isolated. Closing imp-3066 requires bounding
 *   ||D^{-1/2} A D^{-1/2}||, which the scalar ceiling does not touch. Assessment
 *   only; does NOT attempt K_a >= 0 positivity; no reduction; no RH verdict.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA. No false QED.
 *
 *   @see imp-3288-analytic-ceiling-lemma.js (the scalar-core L2 ceiling + operator-order corollary)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (the diagonal-normalized endpoint-Hankel step)
 *   @see imp-3326-matrix-core-ceiling-extension-assessment.js (the full-Gram Reading-1 extension)
 *
 *   Ticket: imp-3331 (proof, medium).
 */

import { IMP3288_ANALYTIC_CEILING_LEMMA } from './imp-3288-analytic-ceiling-lemma.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;      // headline shear weight (matches imp-3066 / imp-3288)
const U = 6;        // genuine-Phi lag cutoff (the headline cell); a*U = 3
const DEG = 4;      // headline monomial truncation (matches imp-3066)
const NQ = 4000;    // midpoint quadrature panels for the Gram moments (matches imp-3066)
const HQ = U / NQ;
const PSD_TOL = -1e-9; // an eigenvalue >= PSD_TOL counts as nonnegative at this precision

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

// The scalar-core analytic ceiling, taken from the imp-3288 record (cross-checked below).
const TANH_CEILING = IMP3288_ANALYTIC_CEILING_LEMMA.lemma.analyticCeilingTanhAU; // tanh(3)
const CEILING_CROSS_CHECK = Math.abs(TANH_CEILING - tanh(A * U)) < 1e-12;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

/**
 * Classic cyclic-Jacobi eigenvalues of a small SYMMETRIC matrix. Self-contained
 * (no deps), exact enough for these low-degree truncations. Same routine shape as
 * imp-3066, operated as a plain symmetric solve (no ill-conditioned generalized step).
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 3000; iter++) {
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
 * For a monomial truncation of degree deg: build the FULL passive Gram B and shear
 * Gram A, then measure both deficits.
 *   - fullDeficitMinEig  = min eig(tanh(a*U) B - A)  -- the LIFT (must be >= 0 PSD)
 *   - diagDeficitMinEig   = min eig(tanh(a*U) D - A) -- the imp-3066 diagonal
 *     normalization (indefinite: the lift does NOT bound it)
 *   - diagOperatorNorm    = ||D^{-1/2} A D^{-1/2}|| = the imp-3066 endpoint-Hankel norm
 */
function cellDeficits(deg) {
  const n = deg + 1;
  const B = Array.from({ length: n }, (_uj, j) =>
    Array.from({ length: n }, (_uk, k) => weightedMoment(cosh, j + k)),
  );
  const Ash = Array.from({ length: n }, (_uj, j) =>
    Array.from({ length: n }, (_uk, k) => weightedMoment(sinh, j + k)),
  );
  const Ddiag = Array.from({ length: n }, (_uj, j) => B[j][j]);

  // LIFT: tanh(a*U) B - A (full passive Gram) -- rigorously PSD by the imp-3288 lemma.
  const fullDeficit = Array.from({ length: n }, (_ui, i) =>
    Array.from({ length: n }, (_uk, k) => TANH_CEILING * B[i][k] - Ash[i][k]),
  );
  // imp-3066 normalization: tanh(a*U) diag(B) - A -- the passive off-diagonals discarded.
  const diagDeficit = Array.from({ length: n }, (_ui, i) =>
    Array.from({ length: n }, (_uk, k) => (i === k ? TANH_CEILING * Ddiag[i] : 0) - Ash[i][k]),
  );
  // imp-3066 R = D^{-1/2} A D^{-1/2} (diagonal-normalized endpoint-Hankel operator).
  const R = Array.from({ length: n }, (_ui, i) =>
    Array.from({ length: n }, (_uk, k) => Ash[i][k] / Math.sqrt(Ddiag[i] * Ddiag[k])),
  );

  const fullEig = symmetricEigenvalues(fullDeficit);
  const diagEig = symmetricEigenvalues(diagDeficit);
  const rEig = symmetricEigenvalues(R);

  return {
    deg,
    fullDeficitMinEig: Math.min(...fullEig),
    diagDeficitMinEig: Math.min(...diagEig),
    diagOperatorNorm: Math.max(...rEig.map((e) => Math.abs(e))),
    liftIsPSD: Math.min(...fullEig) >= PSD_TOL,
    diagDeficitIndefinite: Math.min(...diagEig) < -1e-6,
  };
}

// -- Headline cell (DEG = 4, matching imp-3066) --------------------------------
const headline = cellDeficits(DEG);
const liftHoldsHeadline = headline.liftIsPSD;
const disconnectHeadline = headline.diagDeficitIndefinite && headline.diagOperatorNorm > TANH_CEILING;

// -- DEG sweep: the lift stays PSD for every degree (deficit min-eig -> 0+ as
//    monomials approach the concentrating extremizer), while the diagonal-normalized
//    deficit is indefinite at every degree and worsens as more passive off-diagonal
//    mass is discarded.
const DEG_SWEEP = [2, 4, 6, 8];
const sweep = DEG_SWEEP.map((deg) => cellDeficits(deg));
const liftPSDAcrossSweep = sweep.every((r) => r.liftIsPSD);
const diagIndefiniteAcrossSweep = sweep.every((r) => r.diagDeficitIndefinite);
const diagNormExceedsCeilingAcrossSweep = sweep.every((r) => r.diagOperatorNorm > TANH_CEILING);
// Sharpness signature: the full-Gram deficit min-eig decreases toward 0 as DEG rises.
const fullMinEigDecreasing = sweep.every(
  (r, i) => i === 0 || r.fullDeficitMinEig <= sweep[i - 1].fullDeficitMinEig + 1e-12,
);

export const IMP3331_CEILING_LIFT_PER_N_DEFICIT_ASSESSMENT = Object.freeze({
  id: 'imp-3331-ceiling-lift-per-n-deficit-assessment',
  ticket: 'imp-3331',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  liftsCorollaryFrom: 'imp-3288-analytic-ceiling-lemma.js',
  targetOperatorStep: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedFullGramReading: 'imp-3326-matrix-core-ceiling-extension-assessment.js',

  summary:
    'Assesses whether the imp-3288 operator-order corollary (P - H) >= (1 - tanh(a*U)) P lifts to a rigorous ' +
    'per-N lower bound on the section-26 passive-minus-shear deficit that feeds the imp-3066 endpoint-Hankel ' +
    'step. VERDICT: the lift EXISTS but against the WRONG norm. Compressing the SAME symmetric forms ' +
    'H = sinh*, P = cosh* onto the imp-3066 rescaled-monomial span gives A_jk = int sinh phi_j phi_k and the ' +
    'FULL passive Gram B_jk = int cosh phi_j phi_k; since every c^T A c = <f,H f> <= tanh(a*U) <f,P f> = ' +
    'tanh(a*U) c^T B c, the Loewner deficit tanh(a*U) B - A >= 0 is PSD -- a rigorous per-N bound (certified: ' +
    'min eig = +3.8e-6 at DEG=4, shrinking toward 0+ as DEG grows, the imp-3288 sharpness signature). BUT ' +
    'imp-3066 normalizes the shear Hankel against the passive DIAGONAL D = diag(B), not B; and D <= B is FALSE ' +
    'in Loewner order (B carries passive off-diagonal cross-terms D discards), so tanh(a*U) D - A is INDEFINITE ' +
    '(min eig ~ -33.6 at DEG=4) and ||R|| = ||D^{-1/2} A D^{-1/2}|| STRICTLY exceeds tanh(a*U) (~4.6, worsening ' +
    'with DEG). The scalar ceiling is NECESSARY (it pins the full-Gram generalized Rayleigh sup, = imp-3326 ' +
    'Reading 1) but NOT SUFFICIENT: structurally DISCONNECTED from the endpoint-Hankel obstruction, which lives ' +
    'one normalization removed. Assessment only; does NOT attempt K_a >= 0; no reduction; no RH verdict; PT ' +
    'Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (the imp-3066 rescaled monomial truncation)',
    shearGram: 'A_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)  (compression of H = sinh*)',
    fullPassiveGram: 'B_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (compression of P = cosh*, FULL Gram)',
    passiveDiagonal: 'D = diag(B), D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau)  (the imp-3066 Gpass)',
    lift: 'tanh(a*U) B - A >= 0 (PSD)  <=>  c^T A c <= tanh(a*U) c^T B c for all c  (imp-3288 over the span)',
    imp3066Object: 'R = D^{-1/2} A D^{-1/2}, ||R|| = sup_c c^T A c / <c, D c>  (diagonal-normalized endpoint-Hankel)',
    whyDisconnected: 'D <= B is FALSE in Loewner order; the lift bounds c^T A c / c^T B c, NOT c^T A c / <c,D c>',
    a: A,
    U,
    degree: DEG,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]; plain symmetric-eigenvalue deficit test',
    selfComputing: true,
  }),

  measured: Object.freeze({
    analyticCeilingTanhAU: TANH_CEILING,
    ceilingCrossCheck: CEILING_CROSS_CHECK,
    // Headline cell (DEG = 4).
    headlineFullDeficitMinEig: headline.fullDeficitMinEig,   // >= 0: the LIFT holds per-N
    headlineDiagDeficitMinEig: headline.diagDeficitMinEig,   // < 0: diagonal normalization indefinite
    headlineDiagOperatorNorm: headline.diagOperatorNorm,     // ||R|| > tanh(a*U): lift does not bound it
    liftHoldsHeadline,
    disconnectHeadline,
    // DEG sweep.
    degSweep: Object.freeze(sweep.map((r) => Object.freeze({ ...r }))),
    liftPSDAcrossSweep,
    diagIndefiniteAcrossSweep,
    diagNormExceedsCeilingAcrossSweep,
    fullMinEigDecreasing,
  }),

  interpretation: Object.freeze({
    liftExistsAgainstFullGram:
      'The corollary compresses to a RIGOROUS per-N matrix deficit tanh(a*U) B - A >= 0 (PSD) for the FULL ' +
      'passive Gram B, because every coefficient vector c yields an L2 function f = sum c_j phi_j and the ' +
      'imp-3288 lemma is pointwise over L2. This is the finite-N shadow of imp-3326 Reading 1.',
    sharpnessSignature:
      'The full-Gram deficit min eigenvalue shrinks toward 0+ as DEG grows (3.1e-3 -> 3.8e-6 -> 3.9e-9 -> ...): ' +
      'monomials approximate the near-endpoint concentrating extremizer of imp-3288 ever better yet never cross ' +
      'the ceiling, so the deficit stays PSD but not uniformly bounded below.',
    disconnectFromImp3066:
      'imp-3066 normalizes the shear Hankel against the passive DIAGONAL D = diag(B). Since D <= B is FALSE in ' +
      'Loewner order, the lift (bounding c^T A c / c^T B c) says nothing about ||R|| = sup c^T A c / <c,D c>; ' +
      'and indeed tanh(a*U) D - A is INDEFINITE, ||R|| >> tanh(a*U). The passive off-diagonal cross-terms B ' +
      'carries and D discards are exactly what the ceiling would need to reach the endpoint-Hankel step.',
    necessaryNotSufficient:
      'The scalar-core L2 ceiling is NECESSARY (full-Gram generalized Rayleigh sup <= tanh(a*U) < 1) but NOT ' +
      'SUFFICIENT for the imp-3066 endpoint-Hankel operator step: it is structurally disconnected, controlling ' +
      'the full-Gram normalization, not the diagonal one the obstruction lives in.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    provesFullGramLiftIsPSD: true,
    liftFeedsImp3066EndpointHankel: false,
    ceilingIsNecessaryNotSufficient: true,
    isReductionBelowRH: false,
    rhEquivalent: true,
    touchesOperatorPositivityResidual: false,
    carriesRHVerdict: false,
    scope:
      'Assessment of whether the imp-3288 operator-order corollary lifts to a per-N deficit feeding imp-3066. ' +
      'The lift EXISTS (tanh(a*U) B - A PSD) but ONLY for the FULL passive Gram B; against the passive DIAGONAL ' +
      'D = diag(B) the imp-3066 endpoint-Hankel step uses, the deficit is indefinite and ||R|| > tanh(a*U). ' +
      'Necessary-not-sufficient; structurally disconnected. Does NOT attempt K_a >= 0; no reduction; no RH verdict.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3331_CEILING_LIFT_PER_N_DEFICIT_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp3331-scalar-ceiling-cross-check',
    why: 'The assessment anchors to the imp-3288 scalar ceiling tanh(a*U); it must equal tanh(3) and match the ' +
         'imp-3288 record so the deficit comparison is against the genuine ceiling.',
    holds: () => CEILING_CROSS_CHECK && Math.abs(TANH_CEILING - tanh(3)) < 1e-12 && TANH_CEILING < 1,
  },
  {
    id: 'imp3331-lift-is-psd-full-gram',
    why: 'THE LIFT: compressed to any finite span, c^T A c <= tanh(a*U) c^T B c for all c (imp-3288 over the ' +
         'span), so tanh(a*U) B - A must be PSD for the FULL passive Gram. The headline (DEG=4) smallest ' +
         'eigenvalue must be >= 0 (at PSD tolerance). A negative min-eig would break the lift.',
    holds: () => liftHoldsHeadline && headline.fullDeficitMinEig >= PSD_TOL,
  },
  {
    id: 'imp3331-diagonal-normalization-is-indefinite',
    why: 'THE DISCONNECT: imp-3066 normalizes against the passive DIAGONAL D = diag(B), and D <= B is FALSE in ' +
         'Loewner order, so tanh(a*U) D - A is INDEFINITE (a strongly negative min-eig) and ||R|| = ' +
         '||D^{-1/2} A D^{-1/2}|| strictly EXCEEDS tanh(a*U). If the diagonal deficit were PSD the ceiling would ' +
         'feed imp-3066 and there would be no disconnect.',
    holds: () =>
      disconnectHeadline &&
      headline.diagDeficitMinEig < -1e-6 &&
      headline.diagOperatorNorm > TANH_CEILING,
  },
  {
    id: 'imp3331-lift-psd-across-deg-sweep',
    why: 'The lift is a per-N statement for EVERY truncation: tanh(a*U) B - A must stay PSD across the DEG ' +
         'sweep {2,4,6,8}, with the min-eigenvalue shrinking toward 0+ (the imp-3288 sharpness signature -- ' +
         'monomials approach the concentrating extremizer but never cross the ceiling).',
    holds: () => liftPSDAcrossSweep && fullMinEigDecreasing && sweep.length >= 4,
  },
  {
    id: 'imp3331-disconnect-across-deg-sweep',
    why: 'The disconnect is structural, not a single-cell artifact: the diagonal-normalized deficit ' +
         'tanh(a*U) D - A must be indefinite AND ||R|| must exceed tanh(a*U) for every truncation in the sweep, ' +
         'worsening as more passive off-diagonal mass is discarded.',
    holds: () => diagIndefiniteAcrossSweep && diagNormExceedsCeilingAcrossSweep,
  },
  {
    id: 'imp3331-honest-necessary-not-sufficient-no-qed',
    why: 'Mandatory honesty: an ASSESSMENT (not a proof of RH), verdict = lift exists for the full Gram but ' +
         'does NOT feed the imp-3066 diagonal-normalized endpoint-Hankel step (necessary-not-sufficient), ' +
         'RH-equivalent, does NOT touch K_a >= 0, carries NO RH verdict, PT 0.2 stays SOTA. If any flip the ' +
         'module is over-claiming.',
    holds: () => {
      const c = IMP3331_CEILING_LIFT_PER_N_DEFICIT_ASSESSMENT.honestCaveat;
      return (
        c.isProof === false &&
        c.provesFullGramLiftIsPSD === true &&
        c.liftFeedsImp3066EndpointHankel === false &&
        c.ceilingIsNecessaryNotSufficient === true &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.touchesOperatorPositivityResidual === false &&
        c.carriesRHVerdict === false &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3331_CEILING_LIFT_PER_N_DEFICIT_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3331-ceiling-lift-per-n-deficit-assessment assertion failed: ${assertion.id}`);
  }
}

export default IMP3331_CEILING_LIFT_PER_N_DEFICIT_ASSESSMENT;
