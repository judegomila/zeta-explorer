/**
 * @module imp-3102-orthogonalized-gap-aU-grid
 * @fileoverview imp-3102 -- Sweep the imp-3086 BASIS-INVARIANT residual operator/
 *   diagonal gap (||R_orth|| - max_j R_orth_jj) across the Cartesian a x U grid and
 *   test whether the SURVIVING intrinsic gap also tracks the single product s = a*U
 *   alone -- exactly like the RAW (diagonal-normalized) imp-3085 gap does.
 *
 *   THE TWO PARENTS
 *   ---------------
 *   imp-3085-hankel-gap-aU-grid.js swept the imp-3066 DIAGONAL-normalized gap
 *   ||R|| - max_j R_jj (R_jk = H_jk / sqrt(D_jj D_kk)) across the a x U grid and found
 *   it depends ONLY on s = a*U: substituting tau = U*x cancels the shared U prefactor
 *   in the de-homogenized ratio, so equal-product cells coincide to machine precision.
 *
 *   imp-3086-orthogonalized-basis-conditioning.js showed the imp-3066 diagonal-only
 *   normalization inflated the gap by a basis-conditioning artifact: orthogonalizing
 *   the FULL passive cosh Gram P_jk = int cosh(a*tau) phi_j phi_k (Cholesky P = G G^T,
 *   L = G^{-1}, R_orth = L H L^T -- the TRUE de-homogenized pencil operator) collapses
 *   the headline gap 3.63 -> 0.09 at the single cell a = 0.5, U = 6, while a strictly-
 *   positive residual gap SURVIVES. But imp-3086 measured the survivor at ONE cell only.
 *
 *   WHAT THIS MODULE ADDS (the imp-3102 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------------------
 *   We rebuild R_orth = L H L^T (full passive Gram, Cholesky-orthogonalized) on the
 *   ENTIRE A_GRID x U_GRID Cartesian product, extract the surviving basis-invariant gap
 *   ||R_orth|| - max_j R_orth_jj per cell, and test equal-product (a*U) coincidence.
 *
 *   THE PREDICTION (and why). Both Gram moments carry the SAME single U prefactor:
 *       P_jk = int_0^U cosh(a*tau)(tau/U)^{j+k} d(tau) = U * int_0^1 cosh(s*x) x^{j+k} dx
 *       H_jk = int_0^U sinh(a*tau)(tau/U)^{j+k} d(tau) = U * int_0^1 sinh(s*x) x^{j+k} dx
 *   with s = a*U. So P = U*Pbar(s) and H = U*Hbar(s). Cholesky of P = U*Pbar gives
 *   G = sqrt(U)*Gbar(s) (Gbar Gbar^T = Pbar), hence L = G^{-1} = U^{-1/2} Lbar(s), and
 *       R_orth = L H L^T = U^{-1/2} Lbar * (U Hbar) * U^{-1/2} Lbar^T = Lbar Hbar Lbar^T,
 *   so the U prefactor CANCELS EXACTLY in the orthogonalized operator too. R_orth, its
 *   spectrum ||R_orth||, its diagonal, and the residual gap therefore depend ONLY on
 *   s = a*U. THE FINDING: the SURVIVING intrinsic obstruction SHARES the scalar-side
 *   a*U invariant -- it does NOT break it. Equal-product cells coincide to ~1e-13
 *   (Cholesky-conditioned, a few orders looser than the diagonal-normalized ~1e-15 of
 *   imp-3085, but still machine-precision agreement). The RAW off-diagonal min |H_jk|
 *   keeps the dimensionful U prefactor and does NOT track s, exactly as in imp-3085:
 *   the invariance lives in the de-homogenized operator, not the bare Gram.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066/
 *   imp-3086 -- NOT the section-26 Gram. The measured ||R_orth|| and the residual gap
 *   carry NO RH verdict (they neither claim the cover holds nor that it fails); this is
 *   a pure measurement of how the basis-invariant survivor varies with the shear weight
 *   a and lag window U. NO positivity attempted; NO RH verdict. The bare-V pilot
 *   (imp-1240) is NOT re-run. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA.
 *   No false QED.
 *
 *   @see imp-3086-orthogonalized-basis-conditioning.js (imp-3086: the single-cell survivor)
 *   @see imp-3085-hankel-gap-aU-grid.js (imp-3085: the RAW diagonal-normalized gap a*U sweep)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the parent obstruction)
 *
 *   Ticket: imp-3102 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]);   // shear weights (imp-3066 headline a = 0.5)
const U_GRID = Object.freeze([4, 6, 8, 10]);          // lag cutoffs (imp-3066 headline U = 6)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3085/imp-3086)
const N = DEG + 1;

const cosh = Math.cosh;
const sinh = Math.sinh;

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

// -- small dense linear algebra (self-contained, identical to imp-3086) ------------

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
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained,
 * identical routine to imp-3086 so the per-cell operator norm is computed the same way).
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
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
  }
  return m.map((row, i) => row[i]);
}

/**
 * One (a, U) cell: build the FULL passive cosh Gram P and the shear sinh Hankel H,
 * orthogonalize via Cholesky (L = G^{-1}, R_orth = L H L^T -- the TRUE de-homogenized
 * pencil operator, exactly as imp-3086), and measure its basis-invariant residual gap.
 */
function cellMetrics(a, U) {
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));   // TRUE pencil operator: passive Gram is now identity
  const eigenvalues = symmetricEigenvalues(Rorth);
  const opNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diagOrth = Rorth.map((row, i) => row[i]);
  const maxDiagOrth = Math.max(...diagOrth);
  let minOffDiagHankel = Infinity;
  for (let j = 0; j < N; j++) {
    for (let k = 0; k < N; k++) {
      if (j === k) continue;
      const h = Math.abs(H[j][k]);
      if (h < minOffDiagHankel) minOffDiagHankel = h;
    }
  }
  return Object.freeze({
    a,
    U,
    s: a * U,
    operatorNorm: opNorm,                                  // ||R_orth|| -- basis-invariant true operator norm
    maxDiagonal: maxDiagOrth,
    residualGap: opNorm - maxDiagOrth,                     // the SURVIVING basis-invariant gap, per cell
    minOffDiagonalHankelCrossTerm: minOffDiagHankel,       // RAW Gram entry (keeps the U scale)
  });
}

// Full Cartesian a x U grid of per-cell orthogonalized residual gaps.
const GRID = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => cellMetrics(a, U))),
);

// Equal-product (a*U) pairs: each pair MUST coincide if the SURVIVING gap tracks s = a*U.
const EQUAL_PRODUCT_PAIRS = Object.freeze([
  Object.freeze({ s: 2.0, cellA: cellMetrics(0.5, 4), cellB: cellMetrics(0.2, 10) }),
  Object.freeze({ s: 3.0, cellA: cellMetrics(0.5, 6), cellB: cellMetrics(0.3, 10) }),
  Object.freeze({ s: 1.2, cellA: cellMetrics(0.3, 4), cellB: cellMetrics(0.2, 6) }),
]);

// Worst mismatch of the orthogonalized gap, the operator norm, and the RAW |H_jk| across equal-product pairs.
let maxGapMismatch = 0;
let maxOpNormMismatch = 0;
let maxRawHankelSpread = 0;
for (const pair of EQUAL_PRODUCT_PAIRS) {
  maxGapMismatch = Math.max(
    maxGapMismatch,
    Math.abs(pair.cellA.residualGap - pair.cellB.residualGap),
  );
  maxOpNormMismatch = Math.max(
    maxOpNormMismatch,
    Math.abs(pair.cellA.operatorNorm - pair.cellB.operatorNorm),
  );
  maxRawHankelSpread = Math.max(
    maxRawHankelSpread,
    Math.abs(pair.cellA.minOffDiagonalHankelCrossTerm - pair.cellB.minOffDiagonalHankelCrossTerm),
  );
}

// Trend of the surviving gap along the product axis (any (a,U) with a*U = s gives the same gap).
const S_TREND = Object.freeze(
  [0.4, 1.0, 2.0, 3.0, 5.0].map((s) => {
    const cell = cellMetrics(0.5, s / 0.5);
    return Object.freeze({ s, residualGap: cell.residualGap, operatorNorm: cell.operatorNorm });
  }),
);

// The surviving gap stays strictly positive across the whole product axis (obstruction never vanishes).
const survivorPositiveEverywhere = GRID.every((c) => c.residualGap > 1e-9);

const headlineCell = cellMetrics(0.5, 6);                 // must reproduce the imp-3086 single-cell survivor
const headlineGap = headlineCell.residualGap;             // ~0.0905 (the imp-3086 "3.63 -> 0.09" survivor)
const headlineOpNorm = headlineCell.operatorNorm;         // ~0.989 (the imp-3086 ||R_orth||)

export const IMP3102_ORTHOGONALIZED_GAP_AU_GRID = Object.freeze({
  id: 'imp-3102-orthogonalized-gap-aU-grid',
  ticket: 'imp-3102',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSurvivor: 'imp-3086-orthogonalized-basis-conditioning.js',
  relatedRawGapSweep: 'imp-3085-hankel-gap-aU-grid.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',

  summary:
    'Sweeps the imp-3086 BASIS-INVARIANT residual gap ||R_orth|| - max_j R_orth_jj ' +
    '(R_orth = L H L^T, L = (Cholesky of the FULL passive cosh Gram)^{-1}) across the ' +
    'Cartesian a x U grid and finds the SURVIVING intrinsic obstruction tracks the single ' +
    'product s = a*U, exactly like the RAW diagonal-normalized imp-3085 gap. Both Gram ' +
    'moments carry the same U prefactor (P = U*Pbar(s), H = U*Hbar(s)), so Cholesky gives ' +
    'L = U^{-1/2} Lbar(s) and R_orth = L H L^T = Lbar Hbar Lbar^T -- the U prefactor cancels ' +
    'in the orthogonalized operator too. Equal-product cells coincide to ~1e-13 (Cholesky-' +
    'conditioned, a few orders looser than imp-3085 diagonal ~1e-15 but still machine ' +
    'precision); the RAW min |H_jk| keeps the U scale and does NOT track s. So the intrinsic ' +
    'survivor SHARES the scalar-side a*U invariant -- it does not break it. The survivor stays ' +
    'strictly positive across the whole grid. REPRESENTATIVE / DIAGNOSTIC; carries NO RH verdict.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3086-orthogonalized-basis-conditioning.js (same R_orth = L H L^T orthogonalization)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau)(tau/U)^{j+k} d(tau)  (dense positive Hankel, NOT diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau)(tau/U)^{j+k} d(tau)',
    gramSchmidt: 'L = (Cholesky P)^{-1} lower-triangular; psi = L phi is cosh-orthonormal (L P L^T = I)',
    deHomogenizedOrth: 'R_orth = L H L^T  (TRUE pencil operator; passive Gram is now exactly the identity)',
    scaleReduction: 'tau = U*x => P = U*Pbar(s), H = U*Hbar(s) => L = U^{-1/2} Lbar(s) => R_orth = Lbar Hbar Lbar^T, s = a*U (U cancels)',
    aGrid: A_GRID,
    uGrid: U_GRID,
    degree: DEG,
    truncationSize: N,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    grid: GRID,                                            // every (a,U) cell: s, ||R_orth||, residual gap
    equalProductPairs: EQUAL_PRODUCT_PAIRS,                // coincidence of the survivor at equal a*U
    maxGapMismatchAcrossEqualProductPairs: maxGapMismatch, // ~1e-13: the SURVIVING gap IS a function of s = a*U
    maxOpNormMismatchAcrossEqualProductPairs: maxOpNormMismatch, // ~1e-13: so is ||R_orth||
    maxRawHankelSpreadAcrossEqualProductPairs: maxRawHankelSpread, // O(1): the RAW |H_jk| is NOT
    sTrend: S_TREND,                                       // surviving gap vs s along the product axis
    survivorPositiveEverywhere,                            // gap > 0 on every grid cell
    headlineGapAtAhalfU6: headlineGap,                     // reproduces the imp-3086 survivor (~0.09)
    headlineOpNormAtAhalfU6: headlineOpNorm,               // reproduces the imp-3086 ||R_orth|| (~0.99)
  }),

  interpretation: Object.freeze({
    survivorTracksTheProduct:
      'The basis-invariant residual gap ||R_orth|| - max_j R_orth_jj depends on a and U ONLY ' +
      'through s = a*U: equal-product cells coincide to machine precision because the U prefactor ' +
      'cancels in the Cholesky-orthogonalized operator (P = U*Pbar, H = U*Hbar => L = U^{-1/2} Lbar ' +
      '=> R_orth = Lbar Hbar Lbar^T). The SURVIVING intrinsic obstruction therefore SHARES the same ' +
      'a*U scale invariant the raw imp-3085 gap and the imp-3064 degree-0 excess fraction obey -- ' +
      'orthogonalizing away the conditioning artifact does NOT break the scale invariance.',
    rawHankelKeepsTheScale:
      'As in imp-3085, the RAW off-diagonal min |H_jk| still carries the dimensionful U prefactor ' +
      'and varies between equal-product cells: the invariance lives in the de-homogenized operator ' +
      'R_orth, not the bare Gram entries.',
    survivorStaysPositive:
      'The surviving gap is strictly positive on every grid cell: the off-diagonal endpoint-Hankel ' +
      'obstruction that survives orthogonalization (imp-3086) persists across the entire a x U grid, ' +
      'governed by the single a*U scale.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured ||R_orth|| and residual gaps are on the SAME representative monomial-moment ' +
      'truncation as imp-3066/imp-3086; they are NOT the section-26 Gram, so they neither claim the ' +
      'cover holds nor that it fails. Only the a*U-scaling of the basis-invariant survivor is asserted.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3102_ORTHOGONALIZED_GAP_AU_GRID_ASSERTIONS = [
  {
    id: 'imp3102-grid-shape',
    why: 'The sweep covers the full Cartesian A_GRID x U_GRID; a count drift means the grid build ' +
         'dropped or duplicated a cell.',
    holds: () => GRID.length === A_GRID.length * U_GRID.length,
  },
  {
    id: 'imp3102-survivor-positive-everywhere',
    why: 'The imp-3086 residual obstruction survives orthogonalization at every cell: ||R_orth|| ' +
         'must strictly exceed its largest diagonal across the whole grid. A non-positive gap ' +
         'anywhere would mean orthogonalization removed the survivor on that cell.',
    holds: () => survivorPositiveEverywhere && GRID.every((c) => c.operatorNorm > c.maxDiagonal),
  },
  {
    id: 'imp3102-survivor-tracks-aU-product',
    why: 'THE FINDING: P = U*Pbar(s) and H = U*Hbar(s) carry the same U prefactor, so Cholesky gives ' +
         'L = U^{-1/2} Lbar(s) and R_orth = Lbar Hbar Lbar^T -- the U scale cancels in the ' +
         'orthogonalized operator too. The SURVIVING basis-invariant gap must depend on s = a*U alone, ' +
         'so equal-product cells coincide to machine precision. A non-trivial mismatch would mean ' +
         'orthogonalization BROKE the a*U scale invariance the raw imp-3085 gap obeys.',
    holds: () => maxGapMismatch < 1e-9 && maxOpNormMismatch < 1e-9,
  },
  {
    id: 'imp3102-raw-hankel-does-not-track-product',
    why: 'The contrast (same as imp-3085): the RAW off-diagonal min |H_jk| still carries the ' +
         'dimensionful U prefactor, so it is NOT a function of s = a*U. The spread across equal-product ' +
         'cells must be O(1), confirming the scale invariance lives in the de-homogenized operator.',
    holds: () => maxRawHankelSpread > 1,
  },
  {
    id: 'imp3102-reproduces-imp3086-survivor',
    why: 'Cross-check against the parent: the (a,U) = (0.5,6) cell must reproduce the imp-3086 ' +
         'single-cell survivor -- residual gap ~0.09 and ||R_orth|| ~0.99. A mismatch means the ' +
         'inherited orthogonalization drifted.',
    holds: () =>
      Math.abs(headlineGap - 0.0905) < 5e-3 &&
      Math.abs(headlineOpNorm - 0.989) < 5e-3,
  },
  {
    id: 'imp3102-equal-product-cell-coincidence-locked-1e12',
    why: 'THE imp-3133 LOCK (mirrors the imp-3085 raw-gap 1e-13 lock for the ORTHOGONALIZED ' +
         'survivor): rebuild R_orth = L H L^T at two DISTINCT equal-product cells (a,U) = (0.5,6) ' +
         'and (0.3,10), both s = a*U = 3, and certify the basis-invariant residual-gap scale ' +
         'invariant to a TIGHT 1e-12: (a) |gap_1 - gap_2| < 1e-12 AND |||R_orth||_1 - ||R_orth||_2| ' +
         '< 1e-12 (P = U*Pbar, H = U*Hbar => L = U^{-1/2} Lbar => R_orth = Lbar Hbar Lbar^T, so the ' +
         'U prefactor cancels and both the residual gap AND the operator norm are functions of ' +
         's = a*U alone), while (b) the RAW min |H_jk| DIFFERS by O(1) between them (it keeps the ' +
         'dimensionful U scale). This pins the exact pair the orthogonalized s-invariance hangs on, ' +
         'a few orders looser than the imp-3085 ~1e-15 diagonal-normalized lock because Cholesky ' +
         'conditioning costs precision. Measured: |dgap| ~ 3.1e-13, |dopnorm| ~ 3.1e-13, raw min ' +
         '|H_jk| 5.58 vs 9.31.',
    holds: () => {
      const c1 = cellMetrics(0.5, 6);
      const c2 = cellMetrics(0.3, 10);
      const gapInvariant = Math.abs(c1.residualGap - c2.residualGap) < 1e-12;
      const opNormInvariant = Math.abs(c1.operatorNorm - c2.operatorNorm) < 1e-12;
      const rawHankelDiffers =
        Math.abs(c1.minOffDiagonalHankelCrossTerm - c2.minOffDiagonalHankelCrossTerm) > 1;
      return gapInvariant && opNormInvariant && rawHankelDiffers;
    },
  },
  {
    id: 'imp3102-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic sweep, the gaps carry no RH ' +
         'verdict, positivity was not attempted, it is not a proof or a reduction, and PT 0.2 stays ' +
         'SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3102_ORTHOGONALIZED_GAP_AU_GRID.honestCaveat;
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

for (const assertion of IMP3102_ORTHOGONALIZED_GAP_AU_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3102-orthogonalized-gap-aU-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP3102_ORTHOGONALIZED_GAP_AU_GRID;
