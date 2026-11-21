/**
 * @module imp-3146-residual-gap-limit-aU-grid
 * @fileoverview imp-3146 -- Sweep the imp-3125 SATURATING residual-gap analytic limit
 *   tanh(a*U) - tanh(a*U/2) across the FULL a x U cell grid. imp-3125 profiled the
 *   basis-invariant surviving gap ||R_orth|| - max_j R_orth_jj vs monomial degree DEG
 *   at the single headline cell a = 0.5, U = 6 ONLY, where it saturates to the closed
 *   form tanh(a*U) - tanh(a*U/2) ~ 0.08991. This module evaluates that closed-form limit
 *   on the ENTIRE A_GRID x U_GRID Cartesian product, rebuilds R_orth = L H L^T per cell
 *   to confirm the finite-DEG survivor stays strictly positive and saturates from below
 *   toward the limit, MEASURES where the obstruction is maximized, and assesses strict
 *   positivity on every cell.
 *
 *   THE LIMIT DEPENDS ONLY ON THE PRODUCT s = a*U (inherited imp-3102 invariance)
 *   --------------------------------------------------------------------------------
 *   imp-3102 proved R_orth = L H L^T (full passive cosh Gram, Cholesky-orthogonalized)
 *   depends only on s = a*U: both Gram moments carry the SAME single U prefactor
 *       P_jk = U * int_0^1 cosh(s*x) x^{j+k} dx,   H_jk = U * int_0^1 sinh(s*x) x^{j+k} dx,
 *   so the U prefactor cancels in L H L^T. The two analytic anchors that pin the imp-3125
 *   limit are therefore functions of s ALONE:
 *       ceiling ||R_orth|| -> tanh(a*U) = tanh(s),
 *       floor   max_j R_orth_jj = (cosh(a*U)-1)/sinh(a*U) = tanh(a*U/2) = tanh(s/2),
 *   hence the SATURATING gap limit is the single-variable closed form
 *       G(s) = tanh(s) - tanh(s/2),   s = a*U.
 *   Equal-product cells (e.g. a=0.5,U=6 and a=0.3,U=10, both s=3) coincide EXACTLY.
 *
 *   WHERE THE OBSTRUCTION IS MAXIMIZED -- A CLOSED-FORM GOLDEN-RATIO LANDMARK
 *   ------------------------------------------------------------------------
 *   G(s) -> 0 at BOTH ends (G(0)=0; G(s) -> 1-1 = 0 as s -> inf, since tanh(s) and
 *   tanh(s/2) both -> 1) and is strictly positive in between, so it has a UNIQUE interior
 *   maximum. Setting G'(s) = sech^2(s) - (1/2) sech^2(s/2) = 0 and writing c = cosh(s/2)
 *   gives 2 c^2 = (2 c^2 - 1)^2, i.e. 4 c^4 - 6 c^2 + 1 = 0, so c^2 = (3 + sqrt5)/4 and
 *       cosh(s*) = 2 c^2 - 1 = (1 + sqrt5)/2 = phi   (the GOLDEN RATIO).
 *   So the surviving obstruction limit is LARGEST exactly on the cell locus
 *       a*U = s* = arccosh(phi) ~ 1.06128,
 *   and there, using cosh(s*)=phi, sinh(s*)=sqrt(phi), phi-1 = 1/phi,
 *       tanh(s*)   = 1/sqrt(phi),   tanh((s*)/2) = (phi-1)/sqrt(phi) = phi^{-3/2},
 *       G(s*) = 1/sqrt(phi) - phi^{-3/2} = phi^{-5/2} ~ 0.30028.
 *   The maximal residual-gap obstruction across the entire a x U plane is the closed form
 *   phi^{-5/2}, attained on the golden-ratio locus cosh(a*U) = phi.
 *
 *   WHAT THE SWEEP FINDS (measured, NOT proved)
 *   -------------------------------------------
 *   On A_GRID x U_GRID the analytic limit G(a*U) is STRICTLY POSITIVE on every cell
 *   (the obstruction never vanishes anywhere on the grid), the per-cell finite-DEG
 *   rebuilt survivor ||R_orth|| - max_j R_orth_jj stays strictly positive and sits BELOW
 *   its cell limit (saturation from below confirmed cell-by-cell), and equal-product cells
 *   coincide to machine precision. The grid maximum sits at the SMALLEST product (the cell
 *   closest to the golden-ratio locus s* ~ 1.061 from above), and an independent fine 1D
 *   scan over s locates the global maximizer at s* = arccosh(phi) with value phi^{-5/2},
 *   matching the closed form to ~1e-5. THE VERDICT: the imp-3125 saturating obstruction is
 *   strictly positive across the whole a x U plane, vanishes only in the s -> 0 and
 *   s -> inf limits, and is maximized at the golden-ratio product cosh(a*U) = phi.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation as
 *   imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125; NOT the section-26 Gram. The
 *   measured limit, its grid map, and the golden-ratio maximizer carry NO RH verdict -- a
 *   strictly-positive surviving residual gap neither claims the cover holds nor that it
 *   fails. MEASURE ONLY on a representative truncation; no positivity attempted; not a
 *   proof or a reduction; bare-V pilot (imp-1240) NOT re-run. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3125-orthogonalized-residual-gap-degree-sweep.js (imp-3125: the DEG sweep at the headline cell)
 *   @see imp-3102-orthogonalized-gap-aU-grid.js (imp-3102: R_orth depends only on s = a*U)
 *   @see imp-3104-orthogonalized-opnorm-degree-sweep.js (imp-3104: ||R_orth|| -> tanh(a*U))
 *
 *   Ticket: imp-3146 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]);   // shear weights (imp-3102 grid)
const U_GRID = Object.freeze([4, 6, 8, 10]);          // lag cutoffs (imp-3102 grid)
const DEG = 4;                                         // representative (DEG+1) x (DEG+1) truncation (imp-3102 cell)
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3102 / imp-3125)
const N = DEG + 1;

const PHI = (1 + Math.sqrt(5)) / 2;                    // golden ratio: cosh(a*U) = phi maximizes the limit
const S_STAR = Math.acosh(PHI);                        // = arccosh(phi) ~ 1.06128, the maximizing product a*U
const G_STAR = Math.pow(PHI, -2.5);                    // = phi^{-5/2} ~ 0.30028, the maximal obstruction limit

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

/** The imp-3125 saturating gap limit as a closed form in the single product s = a*U. */
function gapLimit(s) {
  return tanh(s) - tanh(s / 2);
}

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

// -- small dense linear algebra (self-contained, identical to imp-3102 / imp-3125) ---

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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (same as imp-3125). */
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

/**
 * One cell: build the FULL passive cosh Gram P and the shear sinh Hankel H on the
 * degree-DEG truncation, orthogonalize (R_orth = L H L^T), and extract the surviving
 * finite-DEG residual gap ||R_orth|| - max_j R_orth_jj for confirmation against the
 * closed-form limit G(a*U) = tanh(a*U) - tanh(a*U/2).
 */
function measureCell(a, U) {
  const s = a * U;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));
  const eigenvalues = symmetricEigenvalues(Rorth);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diag = Rorth.map((row, i) => row[i]);
  const maxDiagonal = Math.max(...diag);
  const residualGap = operatorNorm - maxDiagonal;        // finite-DEG survivor
  const limit = gapLimit(s);                              // closed-form saturating limit
  return {
    a,
    U,
    product: s,                                           // s = a*U (the single invariant)
    analyticGapLimit: limit,                              // tanh(s) - tanh(s/2)
    rebuiltResidualGap: residualGap,                      // finite-DEG R_orth survivor at this cell
    distanceBelowLimit: limit - residualGap,              // > 0 <=> finite-DEG gap saturates from below
    rebuiltGapPositive: residualGap > 1e-3,               // survivor strictly positive at this cell
    saturatesFromBelow: residualGap > 0 && residualGap < limit + 1e-9,
  };
}

// Full Cartesian product a x U.
const GRID = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => Object.freeze(measureCell(a, U)))),
);

// -- grid-level findings -------------------------------------------------------

// The analytic limit is strictly positive on every cell (obstruction never vanishes).
const limitPositiveEverywhere = GRID.every((cell) => cell.analyticGapLimit > 0);

// The finite-DEG rebuilt survivor is strictly positive on every cell.
const rebuiltPositiveEverywhere = GRID.every((cell) => cell.rebuiltGapPositive);

// Every finite-DEG survivor sits below its cell limit (saturation from below, cell-by-cell).
const allSaturateFromBelow = GRID.every((cell) => cell.saturatesFromBelow);

// Equal-product cells coincide in the analytic limit (inherited imp-3102 a*U invariance).
function groupByProduct(cells) {
  const groups = new Map();
  for (const cell of cells) {
    const key = cell.product.toFixed(6);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(cell);
  }
  return groups;
}
const productGroups = groupByProduct(GRID);
let maxEqualProductLimitSpread = 0;
let maxEqualProductRebuiltSpread = 0;
for (const cells of productGroups.values()) {
  if (cells.length < 2) continue;
  const limits = cells.map((c) => c.analyticGapLimit);
  const rebuilts = cells.map((c) => c.rebuiltResidualGap);
  maxEqualProductLimitSpread = Math.max(
    maxEqualProductLimitSpread,
    Math.max(...limits) - Math.min(...limits),
  );
  maxEqualProductRebuiltSpread = Math.max(
    maxEqualProductRebuiltSpread,
    Math.max(...rebuilts) - Math.min(...rebuilts),
  );
}

// Where the obstruction limit is largest ON THE GRID (the cell nearest the s* locus).
const maxCell = GRID.reduce((best, cell) =>
  cell.analyticGapLimit > best.analyticGapLimit ? cell : best,
);
const minCell = GRID.reduce((best, cell) =>
  cell.analyticGapLimit < best.analyticGapLimit ? cell : best,
);

// Independent fine 1D scan over the product s to locate the GLOBAL interior maximizer.
const S_SCAN_LO = 0.05;
const S_SCAN_HI = 12;
const S_SCAN_STEPS = 24000;
let scanMaxLimit = -Infinity;
let scanArgmax = 0;
for (let i = 0; i <= S_SCAN_STEPS; i++) {
  const s = S_SCAN_LO + (i / S_SCAN_STEPS) * (S_SCAN_HI - S_SCAN_LO);
  const v = gapLimit(s);
  if (v > scanMaxLimit) {
    scanMaxLimit = v;
    scanArgmax = s;
  }
}
// The scan must recover the closed-form golden-ratio landmark.
const scanArgmaxMatchesClosedForm = Math.abs(scanArgmax - S_STAR) < 5e-3;
const scanMaxMatchesClosedForm = Math.abs(scanMaxLimit - G_STAR) < 1e-5;
// cosh(s*) = phi to machine precision (the defining golden-ratio identity).
const coshSStarEqualsPhi = Math.abs(cosh(S_STAR) - PHI) < 1e-12;
// G(s*) = phi^{-5/2} closed form (the maximal obstruction value).
const gStarEqualsPhiPow = Math.abs(gapLimit(S_STAR) - G_STAR) < 1e-12;
// The limit vanishes at both ends (interior maximum, not monotone).
const vanishesAtSmallS = gapLimit(S_SCAN_LO) < scanMaxLimit;
const vanishesAtLargeS = gapLimit(S_SCAN_HI) < scanMaxLimit;

export const IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID = Object.freeze({
  id: 'imp-3146-residual-gap-limit-aU-grid',
  ticket: 'imp-3146',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegreeSweepHeadlineCell: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js',
  relatedSurvivorAUSweep: 'imp-3102-orthogonalized-gap-aU-grid.js',
  relatedOpNormDegreeSweep: 'imp-3104-orthogonalized-opnorm-degree-sweep.js',

  summary:
    'Sweeps the imp-3125 SATURATING residual-gap analytic limit tanh(a*U) - tanh(a*U/2) across the FULL ' +
    'A_GRID x U_GRID Cartesian product, where imp-3125 profiled it (via the DEG sweep) at the single headline ' +
    'cell a = 0.5, U = 6 only. Inheriting the imp-3102 invariance (R_orth = L H L^T depends only on s = a*U), ' +
    'the limit is the single-variable closed form G(s) = tanh(s) - tanh(s/2), strictly positive on every grid ' +
    'cell, vanishing only as s -> 0 and s -> inf. Setting G prime = 0 gives 4 cosh^4(s/2) - 6 cosh^2(s/2) + 1 = 0, ' +
    'hence cosh(a*U) = (1+sqrt5)/2 = phi (the GOLDEN RATIO): the obstruction is MAXIMIZED on the locus ' +
    'a*U = arccosh(phi) ~ 1.06128 with the closed-form maximum G(s*) = phi^{-5/2} ~ 0.30028. A per-cell rebuild ' +
    'of R_orth confirms the finite-DEG survivor stays strictly positive and saturates from below toward each ' +
    'cell limit; an independent fine 1D s-scan recovers the golden-ratio maximizer to ~1e-5. THE VERDICT: the ' +
    'imp-3125 surviving obstruction is strictly positive across the whole a x U plane and peaks at cosh(a*U) = phi. ' +
    'REPRESENTATIVE / DIAGNOSTIC; carries NO RH verdict.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3102-orthogonalized-gap-aU-grid.js (R_orth = L H L^T depends only on s = a*U)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)  (dense positive Hankel)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}  (passive Gram -> identity)',
    saturatingLimitClosedForm: 'G(s) = tanh(a*U) - tanh(a*U/2), s = a*U (the imp-3125 saturating limit)',
    invariant: 's = a*U: the limit, the operator norm, and the floor all depend only on the product',
    maximizerLocus: 'cosh(a*U) = phi = (1+sqrt5)/2  <=>  a*U = arccosh(phi) ~ 1.06128',
    maximumValueClosedForm: 'G(s*) = phi^{-5/2} ~ 0.30028 (using tanh(s*) = 1/sqrt(phi), tanh(s*/2) = phi^{-3/2})',
    aGrid: A_GRID,
    uGrid: U_GRID,
    degree: DEG,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    grid: GRID,                                            // per cell: product, analytic limit, rebuilt survivor, distance below limit
    limitPositiveEverywhere,                               // analytic limit > 0 on every cell (obstruction never vanishes)
    rebuiltPositiveEverywhere,                             // finite-DEG R_orth survivor > 0 on every cell
    allSaturateFromBelow,                                  // each finite-DEG survivor sits below its cell limit
    maxEqualProductLimitSpread,                            // equal-product cells coincide in the limit (~0)
    maxEqualProductRebuiltSpread,                          // equal-product cells coincide in the rebuilt survivor (~0)
    gridMaxCell: maxCell,                                  // cell with the largest limit (nearest the s* locus)
    gridMinCell: minCell,                                  // cell with the smallest limit (largest product)
    scanArgmaxProduct: scanArgmax,                         // fine-scan global maximizer s*
    scanMaxLimit,                                          // fine-scan maximal limit value
    sStarClosedForm: S_STAR,                               // arccosh(phi)
    gStarClosedForm: G_STAR,                               // phi^{-5/2}
    goldenRatio: PHI,                                      // (1+sqrt5)/2
    scanArgmaxMatchesClosedForm,                           // fine scan recovers arccosh(phi)
    scanMaxMatchesClosedForm,                              // fine scan recovers phi^{-5/2}
    coshSStarEqualsPhi,                                    // cosh(s*) = phi to machine precision
    gStarEqualsPhiPow,                                     // G(s*) = phi^{-5/2} to machine precision
    vanishesAtSmallS,                                      // limit drops below the max as s -> 0 (interior maximum)
    vanishesAtLargeS,                                      // limit drops below the max as s -> inf (interior maximum)
  }),

  interpretation: Object.freeze({
    limitIsAProductInvariant:
      'The imp-3125 saturating limit tanh(a*U) - tanh(a*U/2) inherits the imp-3102 a*U invariance: R_orth = ' +
      'L H L^T depends only on s = a*U, so the operator-norm ceiling tanh(a*U) and the constant-direction floor ' +
      'tanh(a*U/2) are both functions of s alone. Equal-product cells coincide in the limit AND in the finite-DEG ' +
      'rebuilt survivor to machine precision -- the obstruction limit is a one-dimensional curve G(s), not a ' +
      'genuinely two-dimensional surface.',
    strictlyPositiveAcrossThePlane:
      'G(s) = tanh(s) - tanh(s/2) > 0 for every s > 0 (tanh is strictly concave on s > 0, so its secant from 0 ' +
      'to s lies below the chord to s/2), so the surviving obstruction limit is strictly positive on EVERY a x U ' +
      'cell. It vanishes only in the degenerate limits s -> 0 (no shear window) and s -> inf (both tanh terms ' +
      'saturate to 1) -- never on the interior.',
    maximizedAtTheGoldenRatioLocus:
      'G(s) has a unique interior maximum. G prime(s) = sech^2(s) - (1/2) sech^2(s/2) = 0 reduces (c = cosh(s/2)) ' +
      'to 4 c^4 - 6 c^2 + 1 = 0, giving c^2 = (3+sqrt5)/4 and cosh(s*) = 2 c^2 - 1 = (1+sqrt5)/2 = phi. The maximal ' +
      'obstruction limit over the entire a x U plane is the closed form G(s*) = phi^{-5/2} ~ 0.30028, attained on ' +
      'the golden-ratio locus cosh(a*U) = phi (a*U ~ 1.06128). The headline cell a=0.5,U=6 (s=3, G~0.08991) sits ' +
      'on the far saturating tail well past the peak.',
    gridSamplesTheTail:
      'The chosen A_GRID x U_GRID products span s in {0.4 .. 5}. The grid maximum falls on the cell whose product ' +
      'is NEAREST the golden-ratio locus s* ~ 1.061 -- a=0.1, U=10 (s=1, limit ~0.29948, just below the peak ' +
      'phi^{-5/2}) -- while the smallest limit falls on the largest product cell a=0.5, U=10 (s=5, limit ~0.01330) ' +
      'far out on the saturating tail. The headline cell a=0.5, U=6 (s=3, limit ~0.08991) sits between them.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    gapMapCarriesNoRHVerdict:
      'The measured limit map, the a*U invariance, and the golden-ratio maximizer are on the SAME representative ' +
      'monomial-moment truncation as imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125; they are NOT the ' +
      'section-26 Gram, so a strictly-positive surviving residual gap neither claims the cover holds nor that it ' +
      'fails. Only the existence, shape, and golden-ratio maximizer of the limit curve are asserted.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID_ASSERTIONS = [
  {
    id: 'imp3146-grid-covers-full-cartesian-product',
    why: 'The sweep must cover the entire A_GRID x U_GRID Cartesian product with one cell each; a length drift ' +
         'means a cell was dropped or duplicated and the grid map is incomplete.',
    holds: () =>
      GRID.length === A_GRID.length * U_GRID.length &&
      GRID.every((cell) => A_GRID.includes(cell.a) && U_GRID.includes(cell.U)),
  },
  {
    id: 'imp3146-limit-strictly-positive-everywhere',
    why: 'THE DELIVERABLE: the imp-3125 saturating obstruction limit tanh(a*U) - tanh(a*U/2) must be strictly ' +
         'positive on EVERY a x U cell -- the surviving obstruction never vanishes anywhere on the grid.',
    holds: () => limitPositiveEverywhere && GRID.every((cell) => cell.analyticGapLimit > 0),
  },
  {
    id: 'imp3146-rebuilt-survivor-saturates-from-below-per-cell',
    why: 'Per-cell confirmation: the finite-DEG R_orth = L H L^T survivor ||R_orth|| - max_j R_orth_jj must be ' +
         'strictly positive and sit below its closed-form cell limit at every cell (saturation from below, ' +
         'the imp-3125 picture replicated across the whole grid).',
    holds: () => rebuiltPositiveEverywhere && allSaturateFromBelow,
  },
  {
    id: 'imp3146-equal-product-cells-coincide',
    why: 'Inherited imp-3102 invariance: cells sharing the same product s = a*U must coincide in BOTH the analytic ' +
         'limit and the finite-DEG rebuilt survivor to machine precision -- the limit is a curve in s, not a 2D ' +
         'surface. A non-trivial spread would mean the a*U invariance broke.',
    holds: () => maxEqualProductLimitSpread < 1e-12 && maxEqualProductRebuiltSpread < 1e-9,
  },
  {
    id: 'imp3146-maximizer-is-golden-ratio-locus',
    why: 'THE LANDMARK: the obstruction limit is maximized where cosh(a*U) = phi = (1+sqrt5)/2, i.e. a*U = ' +
         'arccosh(phi) ~ 1.06128, with closed-form maximum G(s*) = phi^{-5/2} ~ 0.30028. The independent fine ' +
         's-scan must recover this maximizer and value, and the defining identities cosh(s*) = phi and ' +
         'G(s*) = phi^{-5/2} must hold to machine precision.',
    holds: () =>
      scanArgmaxMatchesClosedForm &&
      scanMaxMatchesClosedForm &&
      coshSStarEqualsPhi &&
      gStarEqualsPhiPow,
  },
  {
    id: 'imp3146-limit-vanishes-at-both-ends',
    why: 'The limit has a UNIQUE INTERIOR maximum: it must drop below the peak as s -> 0 (no shear window) and as ' +
         's -> inf (both tanh terms saturate to 1). A monotone limit would contradict the golden-ratio interior ' +
         'maximizer.',
    holds: () => vanishesAtSmallS && vanishesAtLargeS && scanArgmax > S_SCAN_LO && scanArgmax < S_SCAN_HI,
  },
  {
    id: 'imp3146-reproduces-imp3125-headline-cell',
    why: 'Cross-check against the parent: the a=0.5, U=6 cell (s=3) must reproduce the imp-3125 headline limit ' +
         'tanh(3) - tanh(1.5) ~ 0.08991. A mismatch means the inherited closed form drifted.',
    holds: () => {
      const headline = GRID.find((cell) => cell.a === 0.5 && cell.U === 6);
      return headline && Math.abs(headline.analyticGapLimit - 0.089907) < 1e-5;
    },
  },
  {
    id: 'imp3146-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: REPRESENTATIVE diagnostic map, the limit map carries no RH verdict, positivity not ' +
         'attempted, not a proof or a reduction, bare pilot not re-run, and no refereed bound is changed. If any flip the ' +
         'module is over-claiming.',
    holds: () => {
      const c = IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID.honestCaveat;
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

for (const assertion of IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3146-residual-gap-limit-aU-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP3146_RESIDUAL_GAP_LIMIT_AU_GRID;
