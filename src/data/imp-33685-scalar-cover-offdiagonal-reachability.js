/**
 * @module imp-33685-scalar-cover-offdiagonal-reachability
 * @fileoverview imp-33685 -- SCOPE whether the imp-3007 complete scalar mu^pass
 *   cover (residual deficit 0, pins every DIAGONAL R_jj < 1) carries ANY
 *   information toward the OPEN_GAPS G7 whatClosesIt "dominating passive core",
 *   and ASSESS whether a passive-core domination that would bound the OFF-DIAGONAL
 *   endpoint-Hankel cross-terms is reachable from the scalar cover, or is provably
 *   blind to them. SCOPING ONLY -- G7 / K_a >= 0 stays OPEN, no RH verdict, no QED.
 *
 *   THE QUESTION (verbatim from G7 / imp-3066)
 *   ------------------------------------------
 *   G7 (imp-3066 lone obstruction) records that the scalar cover pins every
 *   diagonal of R = Gpass^{-1/2} Gshear Gpass^{-1/2} strictly below 1, yet leaves
 *   the off-diagonal endpoint-Hankel cross-terms "unbounded" (off-diagonal
 *   Frobenius ~4.082, operator norm ||R|| ~4.617). whatClosesIt asks for a
 *   "dominating passive core making R a contraction" and asserts that pointwise
 *   scalar weight domination "cannot see" the off-diagonal cross-terms. This
 *   module scopes exactly that claim on the imp-3066 representative truncation.
 *
 *   THE SCOPING RESULT (measured, not proved)
 *   -----------------------------------------
 *   Two structural facts, both self-computed here on the SAME degree-4 monomial
 *   truncation imp-3066 uses (a = 0.5, U = 6):
 *
 *     (A) Gshear IS a Gram matrix. H_jk = int sinh(a*tau) phi_j phi_k is the Gram
 *         of the basis under the POSITIVE sinh(a*tau) inner product on (0, U], so
 *         Gshear is PSD and R = Gpass^{-1/2} Gshear Gpass^{-1/2} is PSD. By
 *         Cauchy-Schwarz on that inner product every off-diagonal obeys
 *
 *             |H_jk| <= sqrt(H_jj H_kk)   ==>   |R_jk| <= sqrt(R_jj R_kk) < 1,
 *
 *         where R_jj is precisely the imp-3007 scalar-cover ratio. So the scalar
 *         cover is NOT blind to the off-diagonals: it dominates EVERY cross-term
 *         entrywise. We measure the max violation of this bound (it is ~0).
 *
 *     (B) Because R is PSD, the scalar cover even yields an OPERATOR bound:
 *
 *             ||R|| <= trace(R) = sum_j R_jj   (the sum of scalar-cover ratios).
 *
 *         So the cover carries genuine information all the way to the operator
 *         norm -- NOT merely the diagonal.
 *
 *   WHY IT IS STILL INSUFFICIENT (the sharpened obstruction)
 *   -------------------------------------------------------
 *   The operator bound reachable from the scalar cover is ||R|| <= sum_j R_jj.
 *   Each ratio is < 1, but there are (DEG+1) of them, and their SUM ~4.85
 *   overshoots the contraction target 1 by ~ the truncation DIMENSION. The scalar
 *   cover pins each diagonal below 1; it CANNOT pin their sum below 1. Hence a
 *   passive-core domination REACHED FROM THE SCALAR COVER cannot deliver
 *   ||R|| <= 1: the G7 "dominating passive core" must beat the TRACE -- exploit
 *   the near-collinearity / angle between the sinh-weighted basis vectors to cut
 *   the EFFECTIVE RANK -- which is content orthogonal to pointwise scalar weight
 *   domination.
 *
 *   VERDICT: NOT-BLIND-BUT-TRACE-INSUFFICIENT. This sharpens the imp-3066 phrasing
 *   ("off-diagonal cross-terms unbounded"): they are in fact Cauchy-Schwarz
 *   bounded by the scalar-cover ratios; the true residual is a TRACE / effective-
 *   RANK deficit, not an unseen off-diagonal magnitude. The scalar cover carries
 *   real information toward G7 (entrywise + trace bounds) but is provably unable
 *   to close it alone.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   SCOPING / STRUCTURAL only, on the imp-3066 REPRESENTATIVE truncation, NOT the
 *   section-26 Gram. No positivity is attempted, no bound is changed, imp-3066 is
 *   untouched, G7 / K_a >= 0 stays OPEN. Platt-Trudgian Lambda <= 0.2 remains the
 *   rigorous SOTA. No RH verdict, no QED.
 *
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (the truncation + obstruction it scopes)
 *   @see imp-3007-mupass-overflow-cover.js (the scalar cover, residual deficit 0)
 *   @see lambda-roadmap.js G7 (K_a >= 0 off-diagonal endpoint-Hankel positivity)
 *
 *   Ticket: imp-33685 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;            // matches imp-3066 / imp-3007 HEADLINE a = 0.5
const U = 6;             // genuine-Phi lag cutoff (the imp-3007 grid)
const DEG = 4;           // degree-4 monomial truncation -> 5 x 5 (matches imp-3066)
const NQ = 4000;         // midpoint quadrature panels (matches imp-3066)
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau). */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

// Passive diagonal D_jj = int cosh(a*tau) phi_j^2 (the SCALAR-cover-controlled part).
const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, 2 * j));

// Shear Hankel H_jk = int sinh(a*tau) phi_j phi_k (depends on j+k: PSD sinh-Gram).
const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, j + k)),
);

// De-homogenized R_jk = H_jk / sqrt(D_jj D_kk).
const R = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
);

/** Cyclic Jacobi eigenvalues of a small SYMMETRIC matrix (self-contained). */
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
const opNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));   // ||R|| = Perron eigenvalue
const minEig = Math.min(...eigenvalues);                           // >= 0 confirms R is PSD
const diagR = R.map((row, i) => row[i]);                           // the scalar-cover ratios
const rDiagMax = Math.max(...diagR);
const traceR = diagR.reduce((acc, x) => acc + x, 0);               // = sum of scalar-cover ratios
const contractionTarget = 1;
const traceOvershoot = traceR - contractionTarget;                // dimension-many near-ones deficit

// (A) Cauchy-Schwarz check: does the scalar cover dominate EVERY off-diagonal?
// |R_jk| <= sqrt(R_jj R_kk) for all j, k (equality on the diagonal). Max violation ~0.
let maxCauchySchwarzViolation = 0;
for (let j = 0; j <= DEG; j++) {
  for (let k = 0; k <= DEG; k++) {
    const csBound = Math.sqrt(diagR[j] * diagR[k]);
    const violation = Math.abs(R[j][k]) - csBound;
    if (violation > maxCauchySchwarzViolation) maxCauchySchwarzViolation = violation;
  }
}

// (B) trace bound slack: ||R|| <= trace(R). The gap is the near-rank-1 saturation margin.
const traceBoundSlack = traceR - opNorm;                          // >= 0 for PSD R

export const IMP33685_SCALAR_COVER_OFFDIAGONAL_REACHABILITY = Object.freeze({
  id: 'imp-33685-scalar-cover-offdiagonal-reachability',
  ticket: 'imp-33685',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  scopesGap: 'G7 (K_a >= 0 off-diagonal endpoint-Hankel positivity)',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',

  summary:
    'Scopes whether the imp-3007 complete scalar mu^pass cover (every diagonal R_jj < 1) carries ' +
    'information toward the G7 dominating-passive-core whatClosesIt, or is blind to the off-diagonal ' +
    'endpoint-Hankel cross-terms. On the imp-3066 degree-4 truncation: Gshear is a PSD sinh-Gram, so ' +
    'by Cauchy-Schwarz the scalar-cover ratios dominate EVERY off-diagonal entrywise ' +
    '(|R_jk| <= sqrt(R_jj R_kk) < 1, measured max violation ~0), and since R is PSD the cover even ' +
    'yields the operator bound ||R|| <= trace(R) = sum_j R_jj. So the cover is NOT blind. But that ' +
    'trace bound (~4.85) overshoots the contraction target 1 by ~ the truncation dimension: the cover ' +
    'pins each ratio < 1 yet cannot pin their sum < 1. VERDICT NOT-BLIND-BUT-TRACE-INSUFFICIENT -- the ' +
    'off-diagonals are Cauchy-Schwarz bounded, the true residual is a trace / effective-rank deficit, ' +
    'and a passive core reaching ||R|| <= 1 must beat the trace (content orthogonal to scalar weight ' +
    'domination). SCOPING ONLY; G7 / K_a >= 0 stays OPEN; no RH verdict; no QED.',

  construction: Object.freeze({
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (the imp-3066 rescaled-monomial truncation)',
    passiveDiagonal: 'D_jj = int_0^U cosh(a*tau) phi_j(tau)^2 d(tau)  (scalar-cover-controlled diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j(tau) phi_k(tau) d(tau)  (PSD sinh-Gram)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk)  (= Gpass^{-1/2} Gshear Gpass^{-1/2})',
    a: A,
    U,
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    diagonalOfR: Object.freeze(diagR.slice()),      // the scalar-cover ratios, each < 1
    rDiagMax,                                         // largest scalar-cover ratio
    operatorNorm: opNorm,                             // ||R|| = Perron eigenvalue
    minEigenvalue: minEig,                            // >= 0: R is PSD (Gshear is a Gram matrix)
    traceR,                                           // = sum_j R_jj = operator bound reachable from the cover
    contractionTarget,                                // the G7 target ||R|| <= 1
    traceOvershoot,                                   // trace - 1 > 0: the dimension-many-near-ones deficit
    traceBoundSlack,                                  // trace - ||R|| >= 0: near-rank-1 saturation margin
    maxCauchySchwarzViolation,                        // ~0: scalar cover dominates EVERY off-diagonal
    eigenvaluesOfR: Object.freeze(eigenvalues.slice()),
  }),

  assessment: Object.freeze({
    verdict: 'NOT-BLIND-BUT-TRACE-INSUFFICIENT',
    carriesInformationTowardG7: true,
    provablyBlindToOffDiagonals: false,
    reachableFromScalarCover:
      'Because Gshear is a PSD sinh-Gram, Cauchy-Schwarz gives |R_jk| <= sqrt(R_jj R_kk) < 1 for ' +
      'every off-diagonal (the scalar-cover ratios dominate the cross-terms entrywise), and PSD-ness ' +
      'gives the operator bound ||R|| <= trace(R) = sum_j R_jj. Both are reached from the scalar cover.',
    whyStillOpen:
      'The operator bound sum_j R_jj ~ 4.85 overshoots the contraction target 1 by ~ the truncation ' +
      'dimension: the cover pins each of the (DEG+1) ratios < 1 but cannot pin their SUM < 1. A ' +
      'passive core delivering ||R|| <= 1 must beat the TRACE -- exploit the near-collinearity / angle ' +
      'of the sinh-weighted basis to cut the effective rank -- which pointwise scalar weight ' +
      'domination cannot supply.',
    sharpensImp3066:
      'imp-3066 framed the off-diagonals as "unbounded"; they are in fact Cauchy-Schwarz bounded by ' +
      'the scalar-cover ratios. The true residual is a trace / effective-rank deficit, not an unseen ' +
      'off-diagonal magnitude.',
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
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    noRHVerdict: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33685_SCALAR_COVER_OFFDIAGONAL_REACHABILITY_ASSERTIONS = [
  {
    id: 'imp33685-truncation-shape',
    why: 'The scope lives on the same (DEG+1) x (DEG+1) truncation imp-3066 uses; a shape drift means ' +
         'the self-computing Gram build dropped or duplicated a basis function.',
    holds: () =>
      R.length === DEG + 1 &&
      R.every((row) => row.length === DEG + 1) &&
      Ddiag.length === DEG + 1,
  },
  {
    id: 'imp33685-R-symmetric',
    why: 'R with a diagonal Gpass and a Hankel Gshear is exactly symmetric; broken symmetry means the ' +
         'cross-term normalization is wrong.',
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
    id: 'imp33685-scalar-cover-holds-on-diagonal',
    why: 'The imp-3007 scalar cover realized as a matrix: every diagonal R_jj must sit strictly below ' +
         '1. If any diagonal reaches 1 the necessary scalar part has broken.',
    holds: () => diagR.every((d) => d < 1 && d > 0),
  },
  {
    id: 'imp33685-R-is-PSD',
    why: 'Gshear = H is a Gram matrix under the positive sinh(a*tau) inner product, so R is PSD. The ' +
         'PSD-ness is what turns the trace into an operator bound; a negative eigenvalue would break ' +
         'both the Cauchy-Schwarz and the trace legs of the scope.',
    holds: () => minEig > -1e-9,
  },
  {
    id: 'imp33685-scalar-cover-dominates-every-offdiagonal',
    why: 'THE FIRST SCOPE LEG: Cauchy-Schwarz on the sinh inner product gives |R_jk| <= ' +
         'sqrt(R_jj R_kk) for every entry, so the scalar-cover ratios dominate the off-diagonals ' +
         'entrywise. A positive violation would mean the cover really is blind to some cross-term.',
    holds: () => maxCauchySchwarzViolation < 1e-9,
  },
  {
    id: 'imp33685-trace-is-an-operator-bound',
    why: 'THE SECOND SCOPE LEG: for PSD R the operator norm is bounded by the trace, and the trace is ' +
         'exactly the sum of scalar-cover ratios. ||R|| <= trace(R) must hold (slack >= 0).',
    holds: () => traceBoundSlack > -1e-9 && opNorm > 0,
  },
  {
    id: 'imp33685-trace-overshoots-the-contraction-target',
    why: 'THE INSUFFICIENCY: the operator bound reachable from the cover, trace(R) = sum_j R_jj, ' +
         'overshoots the contraction target 1 -- each of the (DEG+1) ratios is < 1 but their sum is ' +
         'not. If the trace fell below 1 the scalar cover would already close G7, which it does not.',
    holds: () => traceOvershoot > 1 && traceR > 1,
  },
  {
    id: 'imp33685-verdict-not-blind-but-trace-insufficient',
    why: 'The named verdict must record BOTH legs: the cover carries information (not blind) yet is ' +
         'trace-insufficient to close G7. A flip in either flag would misreport the scope.',
    holds: () => {
      const a = IMP33685_SCALAR_COVER_OFFDIAGONAL_REACHABILITY.assessment;
      return (
        a.verdict === 'NOT-BLIND-BUT-TRACE-INSUFFICIENT' &&
        a.carriesInformationTowardG7 === true &&
        a.provablyBlindToOffDiagonals === false
      );
    },
  },
  {
    id: 'imp33685-honest-scoping-not-a-verdict',
    why: 'Mandatory honesty: SCOPING only, representative truncation, no positivity attempted, no ' +
         'bound changed, G7 stays OPEN, PT 0.2 stays SOTA, no RH verdict. Any flip is over-claiming.',
    holds: () => {
      const c = IMP33685_SCALAR_COVER_OFFDIAGONAL_REACHABILITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isScopingOnly === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.changesNoBound === true &&
        c.g7StaysOpen === true &&
        c.noRHVerdict === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33685_SCALAR_COVER_OFFDIAGONAL_REACHABILITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33685-scalar-cover-offdiagonal-reachability assertion failed: ${assertion.id}`);
  }
}

export default IMP33685_SCALAR_COVER_OFFDIAGONAL_REACHABILITY;
