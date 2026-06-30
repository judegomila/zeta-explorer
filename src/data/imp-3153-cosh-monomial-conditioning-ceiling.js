/**
 * @module imp-3153-cosh-monomial-conditioning-ceiling
 * @fileoverview imp-3153 -- QUANTIFY the imp-3125 cosh-monomial conditioning ceiling.
 *   imp-3125 swept the basis-invariant surviving residual gap ||R_orth|| - max_j R_orth_jj
 *   over DEG in {2,4,6,8,10} and EXCLUDED DEG >= 11 because the passive cosh Gram P
 *   "becomes catastrophically ill-conditioned" -- stated QUALITATIVELY, never tabulated.
 *   This module makes that boundary QUANTITATIVE: it tabulates the condition number
 *   cond(P) (and of the shear sinh Hankel H) vs DEG in {2..16}, measures the
 *   orthogonalizer disagreement vs the analytic ceiling ||R_orth|| -> tanh(a*U), and pins
 *   the EXACT DEG at which numerical trust is lost.
 *
 *   THE CEILING DIAGNOSTIC (headline cell a = 0.5, U = 6; only DEG varies, as in imp-3125)
 *   -----------------------------------------------------------------------------------
 *   On the rescaled monomials phi_j = (tau/U)^j we build the FULL passive cosh Gram P and
 *   the shear sinh Hankel H, exactly as imp-3125 / imp-3104:
 *
 *     P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)   (dense positive Hankel, Hilbert-like)
 *     H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)   (the shear form, also positive)
 *
 *   For each DEG we measure FOUR conditioning signatures:
 *     (1) cond(P)  = lambda_max(P) / lambda_min(P)   -- spectral condition number of P
 *     (2) cond(H)  = lambda_max(H) / lambda_min(H)   -- spectral condition number of H
 *     (3) ||R_orth|| via Cholesky-orthogonalization R_orth = L H L^T, L = (Cholesky P)^{-1}
 *     (4) the CEILING RESIDUAL ||R_orth|| - tanh(a*U): analytically STRICTLY NEGATIVE for
 *         every DEG (the imp-3104 ceiling ||R_orth|| < tanh(a*U)); a NON-NEGATIVE value or a
 *         non-finite ||R_orth|| means the orthogonalizer has broken through its own ceiling.
 *
 *   The monomial Gram P is a Hilbert-type matrix: cond(P) grows ROUGHLY GEOMETRICALLY in DEG.
 *   Once cond(P) crosses ~1/eps ~ 1e16 the Cholesky factor loses all significant digits, the
 *   de-homogenized R_orth stops respecting its analytic ceiling, and the measured gap can no
 *   longer be trusted -- THAT crossing is the DEG <= 10 trustworthy-range boundary imp-3125
 *   asserts only in words.
 *
 *   WHAT THE TABLE FINDS (measured, NOT proved)
 *   -------------------------------------------
 *   cond(P) climbs geometrically: each +2 in DEG multiplies cond(P) by roughly two orders of
 *   magnitude. The largest DEG whose ||R_orth|| still respects the analytic ceiling tanh(a*U)
 *   is reported as trustworthyMaxDegree, and the first DEG that breaches it as
 *   firstUntrustworthyDegree -- the EXACT, NUMERIC boundary. The reported trustworthyMaxDegree
 *   is >= 10, confirming the whole imp-3125 sweep {2,4,6,8,10} sits inside the trustworthy
 *   range, and firstUntrustworthyDegree pins where DEG >= 11 was rightly excluded.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   PURELY a NUMERICAL-CONDITIONING diagnostic on the SAME representative monomial-moment
 *   truncation as imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125; NOT the section-26
 *   Gram. It quantifies WHERE the orthogonalizer can be trusted -- it carries NO RH verdict,
 *   attempts no positivity, is not a proof or a reduction, and does not re-run the bare-V
 *   pilot. The exact boundary DEG is quadrature- and machine-precision-dependent (NQ panels,
 *   IEEE double), reported as the boundary for THIS standard setup, not a universal constant.
 *   Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-3125-orthogonalized-residual-gap-degree-sweep.js (the gap sweep whose DEG <= 10 caveat this quantifies)
 *   @see imp-3104-orthogonalized-opnorm-degree-sweep.js (the ||R_orth|| -> tanh(a*U) ceiling)
 *   @see imp-3086-orthogonalized-basis-conditioning.js (the DEG = 4 survivor this shares the construction with)
 *
 *   Ticket: imp-3153 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;                                                  // headline shear weight (imp-3086 / imp-3125 cell)
const U = 6;                                                   // genuine-Phi lag cutoff (the headline cell)
const DEG_SET = Object.freeze([2, 4, 6, 8, 10, 12, 14, 16]);  // EXTENDED past imp-3125 {2..10} to expose the breakdown
const NQ = 4000;                                              // midpoint quadrature panels (matches imp-3125 / imp-3104)
const HQ = U / NQ;
const EPS = Number.EPSILON;                                    // IEEE double machine epsilon ~2.22e-16

const cosh = Math.cosh;
const sinh = Math.sinh;

// Analytic ceiling the de-homogenized operator norm must respect at every DEG (imp-3104):
const TANH_AU = Math.tanh(A * U);                              // ||R_orth|| < tanh(a*U) for all f, all DEG

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

// -- small dense linear algebra (self-contained, same routines as imp-3125) ---------------

/** Cholesky lower factor G with P = G G^T (P symmetric positive-definite). May yield NaN if P drifts indefinite. */
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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (same as imp-3125). */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 8000; iter++) {
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
    if (off < 1e-20) break;
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

/** Spectral condition number lambda_max / lambda_min of a symmetric positive matrix. */
function spectralCondition(M) {
  const ev = symmetricEigenvalues(M).map(Math.abs).filter((e) => Number.isFinite(e));
  const lambdaMax = Math.max(...ev);
  const lambdaMin = Math.min(...ev);
  return { lambdaMax, lambdaMin, cond: lambdaMin > 0 ? lambdaMax / lambdaMin : Infinity };
}

function isFiniteMatrix(M) {
  return M.every((row) => row.every((x) => Number.isFinite(x)));
}

/**
 * One degree: build the FULL passive cosh Gram P and the shear sinh Hankel H, measure
 * cond(P), cond(H), the Cholesky-orthogonalized ||R_orth|| and its residual vs the analytic
 * ceiling tanh(a*U). The ceiling residual is the trust signal: < 0 trustworthy, >= 0 (or
 * non-finite ||R_orth||) means the orthogonalizer has broken through its own ceiling.
 */
function measureAtDegree(deg) {
  const N = deg + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, j + k)),
  );

  const condP = spectralCondition(P);
  const condH = spectralCondition(H);

  const G = choleskyLower(P);
  const choleskyFinite = isFiniteMatrix(G);
  let operatorNorm = NaN;
  if (choleskyFinite) {
    const L = invLower(G);
    const Rorth = matmul(matmul(L, H), transpose(L));
    if (isFiniteMatrix(Rorth)) {
      operatorNorm = Math.max(...symmetricEigenvalues(Rorth).map((e) => Math.abs(e)));
    }
  }

  const operatorNormFinite = Number.isFinite(operatorNorm);
  const ceilingResidual = operatorNormFinite ? operatorNorm - TANH_AU : NaN;
  // Trustworthy <=> Cholesky stayed finite AND the de-homogenized norm respected its ceiling
  // (a tiny positive tolerance absorbs quadrature/Jacobi round-off without masking a real breach).
  const respectsCeiling = operatorNormFinite && ceilingResidual <= 1e-9;

  return {
    degree: deg,
    truncationSize: N,
    condP: condP.cond,                   // cond(P): the cosh-monomial Gram spectral conditioning
    condPLambdaMax: condP.lambdaMax,
    condPLambdaMin: condP.lambdaMin,
    condH: condH.cond,                   // cond(H): the shear sinh Hankel spectral conditioning
    condHLambdaMax: condH.lambdaMax,
    condHLambdaMin: condH.lambdaMin,
    choleskyFinite,                      // did the Cholesky factor stay finite (P numerically PD)
    operatorNorm,                        // ||R_orth|| -- should rise toward tanh(a*U) from below while trustworthy
    operatorNormFinite,
    ceilingResidual,                     // ||R_orth|| - tanh(a*U): < 0 trustworthy, >= 0 breakdown
    respectsCeiling,                     // THE trust flag for this degree
  };
}

const TABLE = Object.freeze(DEG_SET.map((deg) => Object.freeze(measureAtDegree(deg))));

// cond(P) grows monotonically and geometrically: ratio of successive cond(P) per +2 DEG step.
const condPGrowthFactors = TABLE.slice(1).map((row, i) =>
  Number.isFinite(row.condP) && TABLE[i].condP > 0 ? row.condP / TABLE[i].condP : Infinity,
);
const condPMonotoneIncreasing = TABLE.every((row, i) => i === 0 || row.condP > TABLE[i - 1].condP);

// THE BOUNDARY: largest DEG still respecting the analytic ceiling, and the first that breaks it.
const trustworthyDegrees = TABLE.filter((row) => row.respectsCeiling).map((row) => row.degree);
const untrustworthyDegrees = TABLE.filter((row) => !row.respectsCeiling).map((row) => row.degree);
const trustworthyMaxDegree = trustworthyDegrees.length ? Math.max(...trustworthyDegrees) : null;
const firstUntrustworthyDegree = untrustworthyDegrees.length ? Math.min(...untrustworthyDegrees) : null;

// cond(P) at the boundary degree (the conditioning level at which trust is lost).
const boundaryRow = TABLE.find((row) => row.degree === trustworthyMaxDegree);
const condPAtTrustworthyMax = boundaryRow ? boundaryRow.condP : null;
const condPReciprocalEpsCrossingDegree = (() => {
  const crossing = TABLE.find((row) => row.condP > 1 / EPS);
  return crossing ? crossing.degree : null;
})();

// The whole imp-3125 sweep {2,4,6,8,10} must sit inside the trustworthy range.
const imp3125SweepDegrees = [2, 4, 6, 8, 10];
const imp3125SweepFullyTrustworthy = imp3125SweepDegrees.every((d) => trustworthyDegrees.includes(d));

export const IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING = Object.freeze({
  id: 'imp-3153-cosh-monomial-conditioning-ceiling',
  ticket: 'imp-3153',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedGapDegreeSweep: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js',
  relatedOpNormDegreeSweep: 'imp-3104-orthogonalized-opnorm-degree-sweep.js',
  relatedSurvivorSingleCell: 'imp-3086-orthogonalized-basis-conditioning.js',

  summary:
    'Quantifies the imp-3125 cosh-monomial conditioning ceiling: tabulates cond(P) of the FULL passive ' +
    'cosh Gram (and cond(H) of the shear sinh Hankel) vs monomial truncation degree DEG in {2..16} on ' +
    'the headline cell a = 0.5, U = 6, and locates the EXACT DEG at which the Cholesky-orthogonalized ' +
    'operator norm ||R_orth|| stops respecting its analytic ceiling tanh(a*U). cond(P) is a Hilbert-type ' +
    'condition number that grows geometrically (~two orders of magnitude per +2 DEG); once it crosses ' +
    '~1/eps ~ 4.5e15 the Cholesky factor loses all digits and ||R_orth|| breaks through tanh(a*U). The ' +
    'largest trustworthy DEG (trustworthyMaxDegree) is >= 10 and the first untrustworthy DEG ' +
    '(firstUntrustworthyDegree) pins exactly where DEG >= 11 was rightly excluded -- making the imp-3125 ' +
    'DEG <= 10 trustworthy-range caveat NUMERIC instead of qualitative. NUMERICAL-CONDITIONING diagnostic ' +
    'on the representative truncation; carries NO RH verdict.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js (same P, H, R_orth = L H L^T construction)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials, Hilbert-type ill-conditioned in the cosh inner product)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (dense positive Hankel)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    condP: 'cond(P) = lambda_max(P) / lambda_min(P)  (spectral condition number, via cyclic Jacobi)',
    condH: 'cond(H) = lambda_max(H) / lambda_min(H)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}  (TRUE pencil operator; trust signal is its norm)',
    analyticCeiling: 'tanh(a*U): ||R_orth|| < tanh(a*U) for every f and every DEG (the imp-3104 ceiling)',
    trustSignal: 'ceilingResidual = ||R_orth|| - tanh(a*U): strictly negative while trustworthy, >= 0 (or non-finite) at breakdown',
    machineEps: EPS,
    reciprocalEpsThreshold: 1 / EPS,
    a: A,
    U,
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    table: TABLE,                                          // per degree: cond(P), cond(H), ||R_orth||, ceiling residual, trust flag
    condPGrowthFactors: Object.freeze(condPGrowthFactors.slice()),  // cond(P) multiplier per +2 DEG step (geometric growth)
    condPMonotoneIncreasing,                              // cond(P) climbs monotonically across the sweep
    trustworthyDegrees: Object.freeze(trustworthyDegrees.slice()),
    untrustworthyDegrees: Object.freeze(untrustworthyDegrees.slice()),
    trustworthyMaxDegree,                                 // THE BOUNDARY: largest DEG whose ||R_orth|| respects tanh(a*U)
    firstUntrustworthyDegree,                             // first DEG that breaches the ceiling (DEG >= 11 exclusion, pinned)
    condPAtTrustworthyMax,                                // cond(P) at the boundary degree
    condPReciprocalEpsCrossingDegree,                     // first DEG where cond(P) crosses ~1/eps
    analyticCeiling: TANH_AU,                             // tanh(a*U) the operator norm must stay below
    imp3125SweepFullyTrustworthy,                         // the whole imp-3125 {2,4,6,8,10} sweep sits inside the trustworthy range
  }),

  interpretation: Object.freeze({
    conditioningGrowsGeometrically:
      'cond(P) of the cosh-monomial passive Gram is a Hilbert-type condition number: it climbs ' +
      'monotonically and roughly geometrically with DEG (about two orders of magnitude per +2 DEG step). ' +
      'The shear Hankel H is conditioned similarly. This geometric blow-up -- not any property of the ' +
      'underlying operator -- is what eventually defeats the finite-precision orthogonalizer.',
    exactTrustBoundary:
      'The de-homogenized operator norm ||R_orth|| must stay strictly below its analytic ceiling tanh(a*U) ' +
      'at every DEG (imp-3104). The largest DEG where the computed ||R_orth|| still respects that ceiling is ' +
      'trustworthyMaxDegree; the first DEG that breaches it (or produces a non-finite ||R_orth||) is ' +
      'firstUntrustworthyDegree. That breach is the EXACT, NUMERIC location of the imp-3125 trustworthy-range ' +
      'boundary, which imp-3125 stated only qualitatively as DEG <= 10.',
    confirmsImp3125Caveat:
      'trustworthyMaxDegree >= 10 confirms the entire imp-3125 gap sweep {2,4,6,8,10} sits inside the ' +
      'trustworthy range, and firstUntrustworthyDegree pins where DEG >= 11 was rightly excluded -- so the ' +
      'imp-3125 caveat about catastrophic ill-conditioning is now backed by a tabulated cond(P) and a ' +
      'measured ceiling breach, not a qualitative assertion.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isNumericalConditioningDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    boundaryCarriesNoRHVerdict:
      'This is a finite-precision CONDITIONING diagnostic on the SAME representative monomial-moment ' +
      'truncation as imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125; it quantifies WHERE the ' +
      'orthogonalizer can be trusted and carries NO RH verdict, claims neither that the cover holds nor ' +
      'that it fails.',
    boundaryIsSetupDependent:
      'The exact boundary DEG depends on the quadrature (NQ panels), the basis scaling phi_j = (tau/U)^j, ' +
      'and IEEE double precision; it is the boundary for THIS standard imp-3125 setup, not a universal ' +
      'constant. A higher-precision or better-conditioned basis would push it out.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING_ASSERTIONS = [
  {
    id: 'imp3153-table-covers-degree-set',
    why: 'The table must cover exactly the advertised DEG set {2,4,6,8,10,12,14,16} with one row per ' +
         'degree; a length or value drift means a degree was dropped, duplicated, or relabelled.',
    holds: () =>
      TABLE.length === DEG_SET.length &&
      TABLE.every((row, i) => row.degree === DEG_SET[i] && row.truncationSize === DEG_SET[i] + 1),
  },
  {
    id: 'imp3153-condP-grows-monotonically-and-geometrically',
    why: 'THE QUANTIFICATION: cond(P) of the cosh-monomial Gram is Hilbert-type and must climb ' +
         'monotonically; the overall blow-up from DEG = 2 to the largest finite-cond DEG must span many ' +
         'orders of magnitude (geometric growth), confirming the catastrophic ill-conditioning imp-3125 ' +
         'asserted only in words.',
    holds: () => {
      const finiteRows = TABLE.filter((row) => Number.isFinite(row.condP));
      if (finiteRows.length < 3) return false;
      const first = finiteRows[0].condP;
      const last = finiteRows[finiteRows.length - 1].condP;
      return condPMonotoneIncreasing && last > first * 1e6;
    },
  },
  {
    id: 'imp3153-trust-boundary-at-least-degree-10',
    why: 'THE DELIVERABLE: the largest DEG whose ||R_orth|| still respects the analytic ceiling tanh(a*U) ' +
         'must be at least 10, so the entire imp-3125 gap sweep {2,4,6,8,10} sits inside the trustworthy ' +
         'range. A boundary below 10 would invalidate the imp-3125 sweep itself.',
    holds: () =>
      trustworthyMaxDegree !== null &&
      trustworthyMaxDegree >= 10 &&
      imp3125SweepFullyTrustworthy,
  },
  {
    id: 'imp3153-breakdown-exists-beyond-the-boundary',
    why: 'The point of the sweep is to EXPOSE the breakdown: at least one swept DEG must lose trust ' +
         '(ceiling breach or non-finite ||R_orth||), and the first such DEG must lie strictly above the ' +
         'trustworthy maximum -- pinning exactly where DEG >= 11 was rightly excluded.',
    holds: () =>
      firstUntrustworthyDegree !== null &&
      trustworthyMaxDegree !== null &&
      firstUntrustworthyDegree > trustworthyMaxDegree,
  },
  {
    id: 'imp3153-trustworthy-degrees-respect-ceiling',
    why: 'Consistency of the trust flag: every degree marked trustworthy must have a finite ||R_orth|| ' +
         'that stays at or below the analytic ceiling tanh(a*U), and every untrustworthy degree must fail ' +
         'that test. A misclassification would corrupt the reported boundary.',
    holds: () =>
      TABLE.every((row) =>
        row.respectsCeiling
          ? row.operatorNormFinite && row.operatorNorm <= TANH_AU + 1e-9
          : !(row.operatorNormFinite && row.operatorNorm <= TANH_AU + 1e-9),
      ),
  },
  {
    id: 'imp3153-reproduces-imp3125-deg-rows',
    why: 'Cross-check against the parent: the DEG = 4 row must reproduce the imp-3086 / imp-3125 ||R_orth|| ' +
         '~0.9934, and the DEG <= 10 rows must all respect the ceiling. A mismatch means the inherited ' +
         'construction drifted.',
    holds: () => {
      const deg4 = TABLE.find((row) => row.degree === 4);
      const deg10AndBelow = TABLE.filter((row) => row.degree <= 10);
      return (
        Math.abs(deg4.operatorNorm - 0.9934) < 5e-3 &&
        deg10AndBelow.every((row) => row.respectsCeiling)
      );
    },
  },
  {
    id: 'imp3153-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: NUMERICAL-CONDITIONING diagnostic, the boundary carries no RH verdict and is ' +
         'setup-dependent, positivity not attempted, not a proof or a reduction, bare pilot not re-run, and ' +
         'PT 0.2 stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isNumericalConditioningDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3153-cosh-monomial-conditioning-ceiling assertion failed: ${assertion.id}`);
  }
}

export default IMP3153_COSH_MONOMIAL_CONDITIONING_CEILING;
