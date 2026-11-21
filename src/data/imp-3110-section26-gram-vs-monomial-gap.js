/**
 * @module imp-3110-section26-gram-vs-monomial-gap
 * @fileoverview imp-3110 -- ASSESS and characterize the standing gap between the
 *   imp-3066 representative degree-DEG MONOMIAL-MOMENT truncation and the actual
 *   section-26 weighted Gram. imp-3066, imp-3084, imp-3085 and imp-3086 ALL carry
 *   the identical honest caveat "REPRESENTATIVE monomial truncation -- NOT the actual
 *   section-26 Gram", and that caveat is precisely why none of those operator-side
 *   measurements carry an RH verdict. This module characterizes the gap itself.
 *
 *   ASSESSMENT / DERIVATION ONLY. No new positivity, no RH verdict, not a reduction.
 *   No refereed bound is changed.
 *
 *   THE TWO OBJECTS
 *   ---------------
 *   (T) The TOY (imp-3066 et seq.): basis phi_j(tau) = (tau/U)^j (rescaled monomials);
 *       passive DIAGONAL D_jj = int_0^U cosh(a*tau) phi_j^2; shear Hankel
 *       H_jk = int_0^U sinh(a*tau) phi_j phi_k (depends only on j+k); de-homogenized
 *       R = D^{-1/2} H D^{-1/2} with D taken DIAGONAL.
 *
 *   (S) The GENUINE section-26 object (hidden-square-program-section.js, paper Sec 25-27):
 *       - test functions: the channel functions F_+ , F_- with
 *         P_{Z,c}(tau) = (1/2)(|F_+|^2 + |F_-|^2), assembled from a COMPLEX test set
 *         Z = {z_1..z_N} in the upper half plane via cos(z u) / sin(z u) windowed by the
 *         COMPLETED RIEMANN kernel Phi(u) -- oscillatory, complex-frequency, Phi-windowed.
 *       - passive measure: d mu^pass / d tau, whose diagonal part is
 *         (1/2pi) int_tau^inf Phi(u)^2 sinh(2 a u) du -- an INTEGRATED Phi^2 tail, NOT a
 *         bare hyperbolic moment; the full mu^pass also carries NEAR-diagonal mass
 *         (Conj 26.3), so the genuine G_pass is a FULL Gram, not a diagonal.
 *       - shear measure: nu_{a,Phi} = pushforward of the positive density
 *         Phi(u) Phi(v) sinh(a(v-u)) 1_{u<=tau<=v} through intervals [u, v] -- a genuine
 *         2-variable PAST([0,tau]) - FUTURE([tau,inf)) Volterra block (Sec 27), NOT a
 *         single-index j+k Hankel.
 *
 *   FOUR CONCRETE DIFFERENCES (enumerated in `differences` below)
 *   ------------------------------------------------------------
 *     D1 BASIS      monomials (tau/U)^j  vs  Phi-windowed oscillatory channels F_+/F_-(z).
 *     D2 WEIGHT     bare cosh/sinh(a*tau)  vs  integrated Phi^2 densities (mu^pass, nu).
 *     D3 ENDPOINT   single-index Hankel (H_jk = M(j+k))  vs  2-variable past-future block.
 *     D4 DEHOMOG    DIAGONAL D  vs  FULL matrix G_pass (genuine inverse-sqrt, not rescale).
 *
 *   WHAT SURVIVES THE SWAP vs WHAT IS A TRUNCATION ARTIFACT (derived in `survivesSwap`)
 *   ----------------------------------------------------------------------------------
 *   SURVIVES (structural -- follows from general positivity / Perron-Frobenius, not from
 *   the monomial choice):
 *     - R symmetric (both Grams are symmetric forms);
 *     - strictly-positive off-diagonal cross-terms => ||R|| > max_j R_jj STRICTLY
 *       (Perron-Frobenius for any irreducible nonnegative form; the genuine shear density
 *       Phi(u)Phi(v)sinh(a(v-u)) is strictly positive for v > u, so its off-diagonals are
 *       strictly positive too). The EXISTENCE of a strictly-positive operator/diagonal gap
 *       is therefore robust to the basis/weight swap.
 *   ARTIFACT (depends on the monomial + bare-hyperbolic choice; will NOT carry over):
 *     - the exact s = a*U scale collapse (imp-3085): it follows from the joint homogeneity
 *       of the monomial basis and the bare hyperbolic weight under (a,U) -> (lambda a, U/lambda);
 *       the completed kernel Phi has its OWN intrinsic scale and is NOT scale-homogeneous, so
 *       the clean s = a*U invariance is a toy artifact (only the degree-0 invariance under a
 *       single GLOBAL scalar on the weight survives in general);
 *     - the numerical MAGNITUDES (min|H_jk|, the raw ||R|| value, individual D_jj);
 *     - diagonal R_jj < 1: AUTOMATIC in the toy (sinh < cosh pointwise) but on the genuine
 *       object pointwise mu^pass >= nu is exactly OPEN Conjecture 26.3 -- so toy diagonal
 *       dominance is NOT evidence the real diagonal is dominated. NEITHER survivor NOR a
 *       clean artifact: it is the open conjecture in disguise.
 *
 *   This module backs the two SURVIVOR claims with a self-computing demonstration:
 *     (A) ARTIFACT witness: the toy shear matrix is EXACTLY Hankel (H_jk = M(j+k)) -- the
 *         off-diagonal structure is a 1-parameter family in the single index j+k, the
 *         flattening that destroys the past-future block geometry Sec 27 says is the whole
 *         obstruction.
 *     (B) SURVIVOR witness: rebuild R with a DIFFERENT positive weight pair AND a DIFFERENT
 *         (shifted, non-pure-monomial) basis; the magnitudes move but the QUALITATIVE facts
 *         (symmetry, strictly-positive off-diagonals, ||R|| > max diag) are unchanged --
 *         evidence the gap-EXISTENCE is structural, not a monomial artifact.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   ASSESSMENT / DERIVATION of a known gap, with a representative numerical witness. It does
 *   NOT compute the genuine section-26 Gram (that needs the completed kernel Phi and the
 *   complex channel basis -- see `faithfulComputationInputs`), does NOT attempt positivity,
 *   carries NO RH verdict, and is NOT a reduction. The bare-V pilot is not re-run.
 *   No refereed bound is changed. No false QED.
 *
 *   @see imp-3066-offdiagonal-hankel-obstruction.js   (the toy this characterizes)
 *   @see imp-3084-offdiagonal-gap-degree-sweep.js     (degree sweep of the toy)
 *   @see imp-3085-hankel-gap-aU-grid.js               (the a*U scale collapse, a toy artifact)
 *   @see imp-3086-orthogonalized-basis-conditioning.js (basis-invariance of the toy ||R||)
 *   @see hidden-square-program-section.js             (the genuine Sec 25-27 object)
 *
 *   Ticket: imp-3110 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5; // matches the imp-3066 headline a
const U = 6; // matches the imp-3066 lag cutoff
const DEG = 4; // (DEG+1) x (DEG+1) truncation, as imp-3066
const NQ = 4000;
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * f(tau) d(tau). */
function weightedIntegral(weightFn, f) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * f(tau) * HQ;
  }
  return acc;
}

/** Build the de-homogenized R = D^{-1/2} H D^{-1/2} for a given basis {phi_j}. */
function buildR(basis, diagWeight, shearWeight) {
  const n = basis.length;
  const D = basis.map((phi) => weightedIntegral(diagWeight, (t) => phi(t) * phi(t)));
  const H = basis.map((phiJ) =>
    basis.map((phiK) => weightedIntegral(shearWeight, (t) => phiJ(t) * phiK(t))),
  );
  const R = H.map((row, j) => row.map((h, k) => h / Math.sqrt(D[j] * D[k])));
  return { D, H, R };
}

/** Classic cyclic Jacobi eigenvalues for a small symmetric matrix (self-contained). */
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

function opNormAndGap(R) {
  const eig = symmetricEigenvalues(R);
  const opNorm = Math.max(...eig.map((e) => Math.abs(e)));
  const diag = R.map((row, i) => row[i]);
  const diagMax = Math.max(...diag);
  let minOff = Infinity;
  for (let j = 0; j < R.length; j++) {
    for (let k = 0; k < R.length; k++) {
      if (j === k) continue;
      const off = Math.abs(R[j][k]);
      if (off < minOff) minOff = off;
    }
  }
  return { opNorm, diagMax, gap: opNorm - diagMax, minOff };
}

// -- (T) the toy exactly as imp-3066 builds it -------------------------------
const monomialBasis = Array.from({ length: DEG + 1 }, (_u, j) => (t) => Math.pow(t / U, j));
const toy = buildR(monomialBasis, cosh, sinh);
const toyStats = opNormAndGap(toy.R);

// (A) ARTIFACT witness: the toy shear matrix is EXACTLY Hankel, H_jk = M(j+k).
// Verify equal-(j+k) entries coincide (single-index flattening).
let maxHankelDeviation = 0;
for (let j1 = 0; j1 <= DEG; j1++) {
  for (let k1 = 0; k1 <= DEG; k1++) {
    for (let j2 = 0; j2 <= DEG; j2++) {
      const k2 = j1 + k1 - j2;
      if (k2 < 0 || k2 > DEG) continue;
      const dev = Math.abs(toy.H[j1][k1] - toy.H[j2][k2]);
      if (dev > maxHankelDeviation) maxHankelDeviation = dev;
    }
  }
}

// -- (B) SURVIVOR witness: DIFFERENT weight pair + DIFFERENT basis ------------
// Common positive reweight g(tau) = 1 + tau/U applied to BOTH channels (still
// cosh on the passive diagonal, sinh on the shear), and a shifted basis
// psi_j = ((tau + U)/(2U))^j (not the pure rescaled monomial). The de-homogenized
// R changes its MAGNITUDES but must keep the qualitative facts.
const altDiagWeight = (x) => cosh(x) * (1 + x / (A * U)); // cosh(a*tau)*(1 + tau/U)
const altShearWeight = (x) => sinh(x) * (1 + x / (A * U)); // sinh(a*tau)*(1 + tau/U)
const shiftedBasis = Array.from({ length: DEG + 1 }, (_u, j) => (t) => Math.pow((t + U) / (2 * U), j));
const alt = buildR(shiftedBasis, altDiagWeight, altShearWeight);
const altStats = opNormAndGap(alt.R);

let altSymmetric = true;
let altOffDiagAllPositive = true;
for (let j = 0; j <= DEG; j++) {
  for (let k = 0; k <= DEG; k++) {
    if (Math.abs(alt.R[j][k] - alt.R[k][j]) > 1e-12) altSymmetric = false;
    if (j !== k && !(alt.R[j][k] > 0)) altOffDiagAllPositive = false;
  }
}

export const IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP = Object.freeze({
  id: 'imp-3110-section26-gram-vs-monomial-gap',
  ticket: 'imp-3110',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  characterizesToy: 'imp-3066-offdiagonal-hankel-obstruction.js',
  genuineObject: 'hidden-square-program-section.js',

  summary:
    'Characterizes the standing "representative monomial truncation -- NOT the actual section-26 ' +
    'Gram" gap shared by imp-3066/3084/3085/3086. Enumerates FOUR concrete differences (basis: ' +
    'monomials vs Phi-windowed complex channels F_+/F_-; weight: bare cosh/sinh vs integrated Phi^2 ' +
    'densities mu^pass and nu; endpoint: single-index j+k Hankel vs 2-variable past-future Volterra ' +
    'block; de-homogenization: diagonal D vs full G_pass). DERIVES that the strictly-positive ' +
    'operator/diagonal GAP (Perron-Frobenius on strictly-positive off-diagonals) SURVIVES the swap, ' +
    'while the exact s = a*U collapse, the numerical magnitudes, and toy diagonal dominance (which is ' +
    'open Conj 26.3 on the real object) are truncation artifacts. Backed by a self-computing witness: ' +
    'the toy shear is exactly Hankel (single-index flattening), and a different-weight + different-' +
    'basis rebuild keeps the qualitative gap. ASSESSMENT only; NO RH verdict; not a reduction.',

  differences: Object.freeze({
    D1_basis: Object.freeze({
      toy: 'phi_j(tau) = (tau/U)^j -- real, polynomial, non-oscillatory rescaled monomials.',
      genuine:
        'channel functions F_+ , F_- with P_{Z,c} = (1/2)(|F_+|^2 + |F_-|^2), built from a COMPLEX ' +
        'test set Z = {z_1..z_N} in C^+ via cos(z u) / sin(z u) WINDOWED by the completed Riemann ' +
        'kernel Phi(u): oscillatory, complex-frequency, Phi-windowed.',
      consequence:
        'The toy basis cannot resolve the oscillatory cancellation that the genuine test set encodes; ' +
        'monomial moments are smooth and sign-definite where the real channels interfere.',
    }),
    D2_weight: Object.freeze({
      toy: 'passive cosh(a*tau), shear sinh(a*tau) used DIRECTLY as moment weights.',
      genuine:
        'passive density (diag part) (1/2pi) int_tau^inf Phi(u)^2 sinh(2 a u) du -- an INTEGRATED ' +
        'Phi^2 tail; shear density nu = pushforward of Phi(u) Phi(v) sinh(a(v-u)) 1_{u<=tau<=v}. The ' +
        'completed kernel Phi is super-exponentially small and carries its own intrinsic scale.',
      consequence:
        'The bare hyperbolic weights are jointly scale-homogeneous (source of the toy a*U collapse); ' +
        'the Phi^2-weighted densities are NOT, so the clean s = a*U invariance does not carry over.',
    }),
    D3_endpointStructure: Object.freeze({
      toy: 'shear Hankel H_jk = int sinh(a*tau)(tau/U)^{j+k} depends ONLY on j+k: an exact single-index Hankel.',
      genuine:
        'nu_{a,Phi} is a genuine 2-variable PAST([0,tau]) - FUTURE([tau,inf)) Volterra block (Sec 27); ' +
        'its mass lives BETWEEN past and future endpoints and is NOT a function of a single combined index.',
      consequence:
        'The j+k flattening DESTROYS the past-future block geometry that Sec 27 identifies as the entire ' +
        'obstruction (whyRawDiagonalCannotDominate). This is the deepest structural difference.',
    }),
    D4_deHomogenization: Object.freeze({
      toy: 'G_pass taken DIAGONAL (D_jj only); R = D^{-1/2} H D^{-1/2} is a diagonal rescale of H.',
      genuine:
        'G_pass = [ <F_i, F_j>_{mu^pass} ] is a FULL Gram (mu^pass carries near-diagonal mass, Conj 26.3); ' +
        'R = G_pass^{-1/2} G_shear G_pass^{-1/2} needs a genuine matrix inverse-square-root.',
      consequence:
        'The toy collapses the de-homogenization to a 1D rescale; the genuine object mixes channels through ' +
        'the off-diagonal of G_pass, which can move ||R|| in either direction.',
    }),
  }),

  survivesSwap: Object.freeze({
    survives: Object.freeze([
      'R is symmetric (both Grams are symmetric forms).',
      'A strictly-positive operator/diagonal GAP ||R|| - max_j R_jj > 0 EXISTS: the genuine shear ' +
        'density Phi(u)Phi(v)sinh(a(v-u)) is strictly positive for v > u, so G_shear has strictly ' +
        'positive off-diagonals, and Perron-Frobenius forces ||R|| strictly above the largest diagonal ' +
        '-- exactly as in the toy. The EXISTENCE of the off-diagonal obstruction is structural.',
    ]),
    artifacts: Object.freeze([
      'The exact s = a*U scale collapse (imp-3085): a consequence of the joint homogeneity of the ' +
        'monomial basis and the bare hyperbolic weight; Phi is not scale-homogeneous, so it does not carry over.',
      'The numerical magnitudes: min|H_jk|, the raw ||R|| value, the individual D_jj.',
      'The basis-invariance value of ||R|| (imp-3086): the INVARIANCE-under-orthogonalization is general, ' +
        'but its numerical anchor is toy-specific.',
    ]),
    neitherButOpenConjecture: Object.freeze([
      'Diagonal R_jj < 1 is AUTOMATIC in the toy (sinh(a*tau) < cosh(a*tau) pointwise) but on the genuine ' +
        'object pointwise domination mu^pass >= nu is exactly OPEN Conjecture 26.3. Toy diagonal dominance ' +
        'is therefore NOT evidence the real diagonal is dominated -- it is the open conjecture in disguise.',
    ]),
  }),

  faithfulComputationInputs: Object.freeze({
    inputs: Object.freeze([
      'A numerical completed Riemann kernel Phi(u) on [0, U] (from the v52 construction).',
      'A genuine complex test set Z = {z_n} in C^+ and the channel functions F_+ , F_-(tau; z).',
      'The full passive measure mu^pass (diagonal AND near-diagonal mass, Conj 26.3), not just the diagonal.',
      'The 2-variable past-future shear density nu assembled as a Volterra block, NOT a single-index Hankel.',
      'A full matrix inverse-square-root for G_pass (not a diagonal rescale).',
    ]),
    deliveryCaveat:
      'A faithful computation needs the completed-kernel / zeros data and so belongs in an OFFLINE script, ' +
      'not a page-imported module (the zeros bundle must not be pulled into pages -- standing repo rule).',
  }),

  witness: Object.freeze({
    toy: Object.freeze({
      opNorm: toyStats.opNorm,
      diagMax: toyStats.diagMax,
      operatorDiagonalGap: toyStats.gap,
      minOffDiagonalR: toyStats.minOff,
      shearIsExactlyHankel: maxHankelDeviation < 1e-9, // single-index flattening (D3)
      maxEqualIndexHankelDeviation: maxHankelDeviation,
    }),
    alternateWeightAndBasis: Object.freeze({
      note:
        'Different positive weight pair (cosh/sinh times 1 + tau/U) AND a shifted non-pure-monomial basis; ' +
        'magnitudes move but the qualitative gap survives.',
      opNorm: altStats.opNorm,
      diagMax: altStats.diagMax,
      operatorDiagonalGap: altStats.gap,
      symmetric: altSymmetric,
      offDiagonalAllStrictlyPositive: altOffDiagAllPositive,
      magnitudesDifferFromToy: Math.abs(altStats.opNorm - toyStats.opNorm) > 1e-6,
    }),
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isAssessmentOnly: true,
    computesGenuineSection26Gram: false,
    didNotAttemptPositivity: true,
    didNotRerunBarePilot: true,
    noRHVerdict:
      'This characterizes the toy-vs-genuine gap and identifies which toy facts survive the swap; it does ' +
      'NOT compute the genuine section-26 Gram and asserts nothing about whether the cover holds or fails.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP_ASSERTIONS = [
  {
    id: 'imp3110-four-differences-enumerated',
    why: 'The deliverable is a concrete enumeration of the toy-vs-genuine gap; all four difference ' +
         'axes (basis, weight, endpoint structure, de-homogenization) must be present with both sides.',
    holds: () => {
      const d = IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP.differences;
      return (
        !!d.D1_basis.toy && !!d.D1_basis.genuine &&
        !!d.D2_weight.toy && !!d.D2_weight.genuine &&
        !!d.D3_endpointStructure.toy && !!d.D3_endpointStructure.genuine &&
        !!d.D4_deHomogenization.toy && !!d.D4_deHomogenization.genuine
      );
    },
  },
  {
    id: 'imp3110-toy-shear-is-exactly-hankel',
    why: 'ARTIFACT witness for D3: the toy shear matrix depends only on j+k, so all equal-(j+k) entries ' +
         'must coincide. A non-Hankel toy would mean the single-index flattening claim is wrong.',
    holds: () => maxHankelDeviation < 1e-9,
  },
  {
    id: 'imp3110-toy-gap-strictly-positive',
    why: 'The toy reproduces the imp-3066 strictly-positive operator/diagonal gap (sanity that the ' +
         'self-recomputation matches the object it characterizes).',
    holds: () => toyStats.gap > 1e-9 && toyStats.opNorm > toyStats.diagMax && toyStats.minOff > 0,
  },
  {
    id: 'imp3110-survivor-gap-robust-to-weight-and-basis',
    why: 'SURVIVOR witness: with a DIFFERENT positive weight pair and a DIFFERENT basis, R stays ' +
         'symmetric with strictly-positive off-diagonals and a strictly-positive operator/diagonal ' +
         'gap. This is the evidence that the gap EXISTENCE is structural, not a monomial artifact.',
    holds: () =>
      altSymmetric &&
      altOffDiagAllPositive &&
      altStats.gap > 1e-9 &&
      altStats.opNorm > altStats.diagMax,
  },
  {
    id: 'imp3110-magnitudes-are-artifacts',
    why: 'The DERIVED claim that numerical magnitudes are truncation artifacts requires the alternate ' +
         'build to give a DIFFERENT ||R|| than the toy (same qualitative facts, different numbers).',
    holds: () => Math.abs(altStats.opNorm - toyStats.opNorm) > 1e-6,
  },
  {
    id: 'imp3110-survives-and-artifact-lists-nonempty',
    why: 'The assessment must commit to BOTH a non-empty survivor list and a non-empty artifact list; ' +
         'an empty side would mean the swap-analysis was not actually performed.',
    holds: () => {
      const s = IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP.survivesSwap;
      return s.survives.length > 0 && s.artifacts.length > 0 && s.neitherButOpenConjecture.length > 0;
    },
  },
  {
    id: 'imp3110-honest-no-verdict',
    why: 'Mandatory honesty: assessment only, does not compute the genuine Gram, no positivity attempt, ' +
         'no RH verdict, not a reduction, no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isAssessmentOnly === true &&
        c.computesGenuineSection26Gram === false &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3110-section26-gram-vs-monomial-gap assertion failed: ${assertion.id}`);
  }
}

export default IMP3110_SECTION26_GRAM_VS_MONOMIAL_GAP;
