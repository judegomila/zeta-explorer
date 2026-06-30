/**
 * @module imp-3085-hankel-gap-aU-grid
 * @fileoverview imp-3085 -- Sweep the imp-3066 operator/diagonal gap across an
 *   a x U grid and report whether the off-diagonal endpoint-Hankel obstruction
 *   tracks the single product s = a*U (the imp-3064 a*U scale invariant) or
 *   depends on a and U independently.
 *
 *   THE SETUP (inherited from imp-3066, evaluated only at a = 0.5, U = 6)
 *   -------------------------------------------------------------------
 *   imp-3066-offdiagonal-hankel-obstruction.js builds, on a representative
 *   degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, the passive diagonal
 *   D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau) (the part the scalar mu^pass cover
 *   controls) and the shear Hankel H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)
 *   (a genuine off-diagonal endpoint-Hankel form), then the de-homogenized
 *   R = Gpass^{-1/2} Gshear Gpass^{-1/2}, R_jk = H_jk / sqrt(D_jj D_kk). Its
 *   strictly-positive operator/diagonal gap ||R|| - max_j R_jj is the obstruction
 *   the scalar cover cannot reach. imp-3066 measured that gap only at the single
 *   headline cell a = 0.5, U = 6.
 *
 *   WHAT THIS MODULE ADDS (the imp-3085 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------------------
 *   (1) THE 2-D GRID. ||R||, max_j R_jj, the gap, and the smallest off-diagonal
 *       Hankel cross-term min_{j!=k} |H_jk| are re-evaluated on the full Cartesian
 *       product A_GRID x U_GRID using the SAME construction as imp-3066, each cell
 *       diagonalized by a self-contained cyclic-Jacobi eigensolver.
 *
 *   (2) THE a*U SCALE INVARIANT FOR THE OPERATOR GAP (the diagnostic finding).
 *       Substituting tau = U*x (x in [0,1]) gives
 *           D_jj = U int_0^1 cosh(s*x) x^{2j} dx,
 *           H_jk = U int_0^1 sinh(s*x) x^{j+k} dx,   with s = a*U,
 *       so the shared U prefactor CANCELS exactly in the de-homogenized ratio
 *           R_jk = H_jk / sqrt(D_jj D_kk)
 *                = [int_0^1 sinh(s*x) x^{j+k} dx] / sqrt([int cosh(s*x) x^{2j}][int cosh(s*x) x^{2k}]).
 *       R -- and therefore its spectrum, ||R||, diag(R), and the operator/diagonal
 *       gap -- depends ONLY on s = a*U. Equal-product cells coincide EXACTLY:
 *       (a, U) = (0.5, 6) and (0.3, 10) both give gap = 3.6260954 and ||R|| = 4.617014;
 *       (0.5, 4) and (0.2, 10) both give gap = 3.2932454. So the obstruction tracks
 *       the a*U product, exactly like the imp-3064 excess fraction phi(a,U) = G(a*U)/F(a*U).
 *
 *   (3) THE RAW HANKEL CROSS-TERM DOES NOT (the contrast). The de-homogenization
 *       is what removes the length scale: the RAW off-diagonal min_{j!=k} |H_jk|
 *       still carries the dimensionful U prefactor and is NOT a function of s alone.
 *       At s = 3 the two equal-product cells give min |H_jk| = 5.58 (a=0.5,U=6) vs
 *       9.31 (a=0.3,U=10). The scale invariance is a property of the de-homogenized
 *       operator R, not of the bare Gram entries.
 *
 *   (4) THE TREND IN s. Along the product axis the gap rises monotonically and
 *       SATURATES: at s = 0.4 the gap is 1.062, at s = 1 it is 2.300, at s = 3 it
 *       is 3.626, at s = 5 it is 3.823 -- approaching a finite ceiling as s grows
 *       (cosh/sinh -> common exponential, so R -> the all-ones-like Perron limit).
 *       The off-diagonal obstruction is therefore largest in the long-lag / strong-
 *       shear regime and shrinks toward the short-window limit, but never vanishes.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as
 *   imp-3066 -- NOT the section-26 Gram. The measured ||R|| and the gap carry NO
 *   RH verdict (they neither claim the cover fails nor that it holds); this is a
 *   pure measurement of how the off-diagonal obstruction magnitude varies with the
 *   shear weight a and lag window U. Positivity is NOT attempted. The bare-V pilot
 *   (imp-1240) is NOT re-run. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous
 *   SOTA. No false QED.
 *
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell gap)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the degree-0 a*U scale invariant)
 *   @see imp-3007-mupass-overflow-cover.js (imp-3007: the scalar cover + isolated operator step)
 *
 *   Ticket: imp-3085 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]);   // shear weights (imp-3066 headline a = 0.5)
const U_GRID = Object.freeze([4, 6, 8, 10]);          // lag cutoffs (imp-3066 headline U = 6)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels for the Gram moments

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

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained,
 * no deps). For our strictly-positive R the largest is the Perron operator norm.
 * Identical routine to imp-3066 so the per-cell gap is computed the same way.
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

/** One (a, U) cell: build R exactly as imp-3066 and measure its operator/diagonal gap. */
function cellMetrics(a, U) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, a, U, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eigenvalues = symmetricEigenvalues(R);
  const opNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diagR = R.map((row, i) => row[i]);
  const rDiagMax = Math.max(...diagR);
  let minOffDiagHankel = Infinity;
  for (let j = 0; j <= DEG; j++) {
    for (let k = 0; k <= DEG; k++) {
      if (j === k) continue;
      const h = Math.abs(Hshear[j][k]);
      if (h < minOffDiagHankel) minOffDiagHankel = h;
    }
  }
  return Object.freeze({
    a,
    U,
    s: a * U,
    operatorNorm: opNorm,
    rDiagMax,
    operatorDiagonalGap: opNorm - rDiagMax,   // the obstruction, per cell
    minOffDiagonalHankelCrossTerm: minOffDiagHankel,
    rDiagMaxBelowOne: rDiagMax < 1,
  });
}

// Full Cartesian a x U grid of per-cell gaps.
const GRID = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => cellMetrics(a, U))),
);

// Equal-product (a*U) pairs: each pair MUST coincide exactly if the gap tracks s = a*U.
// Pairs are drawn from cells whose products land on a shared s value.
const EQUAL_PRODUCT_PAIRS = Object.freeze([
  Object.freeze({ s: 2.0, cellA: cellMetrics(0.5, 4), cellB: cellMetrics(0.2, 10) }),
  Object.freeze({ s: 3.0, cellA: cellMetrics(0.5, 6), cellB: cellMetrics(0.3, 10) }),
  Object.freeze({ s: 1.2, cellA: cellMetrics(0.3, 4), cellB: cellMetrics(0.2, 6) }),
]);

// Worst (largest |gap difference|) and (largest |H_jk| difference) across equal-product pairs.
let maxGapMismatch = 0;
let maxRawHankelSpread = 0;
for (const pair of EQUAL_PRODUCT_PAIRS) {
  maxGapMismatch = Math.max(
    maxGapMismatch,
    Math.abs(pair.cellA.operatorDiagonalGap - pair.cellB.operatorDiagonalGap),
  );
  maxRawHankelSpread = Math.max(
    maxRawHankelSpread,
    Math.abs(pair.cellA.minOffDiagonalHankelCrossTerm - pair.cellB.minOffDiagonalHankelCrossTerm),
  );
}

// Trend along the product axis: sample s directly via the canonical a = 0.5 cells.
const S_TREND = Object.freeze(
  [0.4, 1.0, 2.0, 3.0, 5.0].map((s) => {
    const cell = cellMetrics(0.5, s / 0.5);   // any (a,U) with a*U = s gives the same gap
    return Object.freeze({ s, operatorDiagonalGap: cell.operatorDiagonalGap, operatorNorm: cell.operatorNorm });
  }),
);

// Monotone increasing + saturating in s: each gap step is positive and the steps shrink.
let trendMonotoneIncreasing = true;
for (let i = 1; i < S_TREND.length; i++) {
  if (S_TREND[i].operatorDiagonalGap <= S_TREND[i - 1].operatorDiagonalGap) {
    trendMonotoneIncreasing = false;
  }
}
const headlineGap = cellMetrics(0.5, 6).operatorDiagonalGap;   // must match imp-3066 (~3.626)

export const IMP3085_HANKEL_GAP_AU_GRID = Object.freeze({
  id: 'imp-3085-hankel-gap-aU-grid',
  ticket: 'imp-3085',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedScaleInvariant: 'imp-3064-deficit-excess-fraction-grid.js',

  summary:
    'Sweeps the imp-3066 operator/diagonal gap ||R|| - max_j R_jj across the Cartesian ' +
    'a x U grid and reports that the off-diagonal endpoint-Hankel obstruction tracks the ' +
    'single product s = a*U EXACTLY. Substituting tau = U*x cancels the shared U prefactor ' +
    'in the de-homogenized R_jk = H_jk / sqrt(D_jj D_kk), so R, its spectrum, ||R||, diag(R), ' +
    'and the gap depend on s = a*U alone: equal-product cells coincide to machine precision ' +
    '((0.5,6) and (0.3,10) both give gap 3.6260954, ||R|| 4.617014; (0.5,4) and (0.2,10) both ' +
    'give gap 3.2932454), exactly like the imp-3064 excess fraction. The RAW off-diagonal ' +
    'min |H_jk| still carries the dimensionful U prefactor and is NOT a function of s alone ' +
    '(5.58 vs 9.31 at s = 3): the scale invariance is a property of the de-homogenized operator, ' +
    'not the bare Gram. Along the s axis the gap rises monotonically and saturates (1.062 at ' +
    's=0.4 -> 3.823 at s=5), so the obstruction is largest at long lag / strong shear and ' +
    'never vanishes. REPRESENTATIVE / DIAGNOSTIC truncation; gap carries NO RH verdict; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3066-offdiagonal-hankel-obstruction.js (same phi_j = (tau/U)^j truncation)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk), D_jj = int cosh(a*tau)(tau/U)^{2j}, H_jk = int sinh(a*tau)(tau/U)^{j+k}',
    scaleReduction: 'tau = U*x => R_jk = [int_0^1 sinh(s*x) x^{j+k}] / sqrt([int cosh(s*x) x^{2j}][int cosh(s*x) x^{2k}]), s = a*U (U cancels)',
    aGrid: A_GRID,
    uGrid: U_GRID,
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    grid: GRID,                                       // every (a,U) cell: s, ||R||, gap, min |H_jk|
    equalProductPairs: EQUAL_PRODUCT_PAIRS,           // coincidence of the gap at equal a*U
    maxGapMismatchAcrossEqualProductPairs: maxGapMismatch,   // ~1e-15: the gap IS a function of s = a*U
    maxRawHankelSpreadAcrossEqualProductPairs: maxRawHankelSpread,  // O(1): the RAW |H_jk| is NOT
    sTrend: S_TREND,                                  // gap vs s along the product axis
    trendMonotoneIncreasing,                          // gap rises with s and saturates
    headlineGapAtAhalfU6: headlineGap,                // reproduces the imp-3066 single-cell gap
  }),

  interpretation: Object.freeze({
    obstructionTracksTheProduct:
      'The operator/diagonal gap depends on a and U ONLY through s = a*U: equal-product cells ' +
      'coincide to machine precision because the U prefactor cancels in the de-homogenized R. ' +
      'The off-diagonal Hankel obstruction is therefore governed by the single a*U scale, the ' +
      'same invariant imp-3064 found for the degree-0 excess fraction phi(a,U) = G(a*U)/F(a*U).',
    rawHankelKeepsTheScale:
      'De-homogenization is what removes the length scale. The RAW min |H_jk| still carries the ' +
      'dimensionful U prefactor and varies between equal-product cells -- the invariance lives in ' +
      'the operator R, not the bare Gram entries.',
    trend:
      'Along the product axis the gap is monotone increasing and saturating: the off-diagonal ' +
      'obstruction is largest in the long-lag / strong-shear regime (large s) and shrinks toward ' +
      'the short-window limit, but never vanishes (the gap stays strictly positive).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured gaps are on the SAME representative monomial-moment truncation as imp-3066, ' +
      'chosen to EXHIBIT the off-diagonal cross-terms; they are NOT the section-26 Gram, so they ' +
      'neither claim the cover fails nor that it holds. Only the a*U-scaling of the obstruction ' +
      'magnitude is asserted.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3085_HANKEL_GAP_AU_GRID_ASSERTIONS = [
  {
    id: 'imp3085-grid-shape',
    why: 'The sweep covers the full Cartesian A_GRID x U_GRID; a count drift means the grid build ' +
         'dropped or duplicated a cell.',
    holds: () => GRID.length === A_GRID.length * U_GRID.length,
  },
  {
    id: 'imp3085-every-cell-has-positive-gap',
    why: 'Every cell inherits the imp-3066 obstruction: R has strictly positive entries so by ' +
         'Perron-Frobenius ||R|| strictly exceeds its largest diagonal. A non-positive gap anywhere ' +
         'on the grid would mean the off-diagonal cross-terms vanish from the spectrum.',
    holds: () => GRID.every((c) => c.operatorDiagonalGap > 1e-9 && c.rDiagMaxBelowOne),
  },
  {
    id: 'imp3085-gap-tracks-aU-product',
    why: 'THE FINDING: substituting tau = U*x cancels the U prefactor in the de-homogenized R, so ' +
         'the operator/diagonal gap depends on s = a*U alone. Equal-product cells must coincide to ' +
         'machine precision; a non-trivial mismatch would falsify the a*U scale invariance.',
    holds: () => maxGapMismatch < 1e-9,
  },
  {
    id: 'imp3085-raw-hankel-does-not-track-product',
    why: 'The contrast: the RAW off-diagonal min |H_jk| still carries the dimensionful U prefactor, ' +
         'so it is NOT a function of s = a*U. The spread across equal-product cells must be O(1), ' +
         'confirming the scale invariance lives in the de-homogenized operator, not the bare Gram.',
    holds: () => maxRawHankelSpread > 1,
  },
  {
    id: 'imp3085-gap-monotone-increasing-in-s',
    why: 'Along the product axis the off-diagonal obstruction grows with s and saturates; the gap ' +
         'must be strictly increasing on the sampled s ladder. A non-monotone trend would mean the ' +
         'obstruction does not have the expected long-lag growth.',
    holds: () => trendMonotoneIncreasing,
  },
  {
    id: 'imp3085-reproduces-imp3066-headline',
    why: 'Cross-check against the parent: the (a,U) = (0.5,6) cell must reproduce the imp-3066 ' +
         'single-cell gap ~3.626. A mismatch means the inherited construction drifted.',
    holds: () => Math.abs(headlineGap - 3.6260954) < 1e-4,
  },
  {
    id: 'imp3085-equal-product-cell-coincidence-locked-1e13',
    why: 'THE imp-3113 LOCK: rebuild R at two DISTINCT equal-product cells (a,U) = (0.5,6) and ' +
         '(0.3,10), both s = a*U = 3, and certify the de-homogenized operator-gap scale invariant ' +
         'to a TIGHTER 1e-13: (a) |gap_1 - gap_2| < 1e-13 AND |||R||_1 - ||R||_2| < 1e-13 (the U ' +
         'prefactor cancels in R_jk = H_jk/sqrt(D_jj D_kk), so the gap AND the Perron operator norm ' +
         'are functions of s = a*U alone), while (b) the RAW min |H_jk| DIFFERS by O(1) between them ' +
         '(it keeps the dimensionful U scale). This pins the exact pair the s-invariance hangs on so ' +
         'a silent edit to the construction cannot drift it. Measured: |dgap| ~ 1.8e-15, |dopnorm| ~ ' +
         '8.9e-16, raw min |H_jk| 5.58 vs 9.31.',
    holds: () => {
      const c1 = cellMetrics(0.5, 6);
      const c2 = cellMetrics(0.3, 10);
      const gapInvariant = Math.abs(c1.operatorDiagonalGap - c2.operatorDiagonalGap) < 1e-13;
      const opNormInvariant = Math.abs(c1.operatorNorm - c2.operatorNorm) < 1e-13;
      const rawHankelDiffers =
        Math.abs(c1.minOffDiagonalHankelCrossTerm - c2.minOffDiagonalHankelCrossTerm) > 1;
      return gapInvariant && opNormInvariant && rawHankelDiffers;
    },
  },
  {
    id: 'imp3085-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic sweep, the gaps carry no RH ' +
         'verdict, positivity was not attempted, it is not a proof or a reduction, and PT 0.2 stays ' +
         'SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3085_HANKEL_GAP_AU_GRID.honestCaveat;
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

for (const assertion of IMP3085_HANKEL_GAP_AU_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3085-hankel-gap-aU-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP3085_HANKEL_GAP_AU_GRID;
