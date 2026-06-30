/**
 * @module imp-3107-dehomogenized-offdiag-aU-grid
 * @fileoverview imp-3107 -- Tabulate the DE-HOMOGENIZED off-diagonal extremes
 *   min_{j!=k} R_jk and max_{j!=k} R_jk (NOT the raw |H_jk|) across the imp-3085
 *   a x U grid and confirm they ARE functions of the single product s = a*U,
 *   unlike the dimensionful raw Hankel entry, then profile their s-trend.
 *
 *   THE GAP THIS FILLS (the imp-3107 ticket)
 *   ----------------------------------------
 *   imp-3085 established that the de-homogenized operator gap and ||R|| depend on
 *   s = a*U alone (equal-product cells coincide), and CONTRASTED that against the
 *   RAW off-diagonal min_{j!=k} |H_jk|, which keeps the dimensionful U prefactor and
 *   is NOT a function of s alone (5.58 at (a,U) = (0.5,6) vs 9.31 at (0.3,10), both
 *   s = 3). But imp-3085 only reported the RAW |H_jk| contrast: the DE-HOMOGENIZED
 *   off-diagonal entries R_jk = H_jk / sqrt(D_jj D_kk) themselves -- which SHOULD be
 *   s-invariant by the same U-cancellation that fixes ||R|| -- were never tabulated
 *   as a curve. This module measures min_{j!=k} R_jk and max_{j!=k} R_jk on the grid,
 *   confirms equal-product coincidence to ~1e-14, and profiles their s-trend.
 *
 *   THE SETUP (inherited verbatim from imp-3085 / imp-3066)
 *   ------------------------------------------------------
 *   On the same representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j,
 *       D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau),
 *       H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau),
 *       R_jk = H_jk / sqrt(D_jj D_kk).
 *   Substituting tau = U*x (x in [0,1]) gives D_jj = U int_0^1 cosh(s*x) x^{2j} dx and
 *   H_jk = U int_0^1 sinh(s*x) x^{j+k} dx, so the shared U prefactor CANCELS in the
 *   ratio: R_jk depends ONLY on s = a*U. Hence EVERY entry of R -- including the
 *   off-diagonal extremes -- is a function of s alone.
 *
 *   WHAT IS MEASURED (the imp-3107 deliverable -- MEASURE ONLY)
 *   ----------------------------------------------------------
 *   (1) THE 2-D GRID. min_{j!=k} R_jk and max_{j!=k} R_jk on the full Cartesian
 *       A_GRID x U_GRID, alongside the raw min_{j!=k} |H_jk| for the contrast.
 *   (2) EQUAL-PRODUCT COINCIDENCE. At equal a*U the de-homogenized off-diagonal
 *       extremes coincide to ~1e-15 (the U prefactor cancels), e.g. at s = 3 both
 *       (0.5,6) and (0.3,10) give min R_jk = 0.77125669, max R_jk = 0.98549338 --
 *       while the RAW min |H_jk| stays split 5.58 vs 9.31. The s-invariance is a
 *       property of the de-homogenized entries, NOT the bare Gram.
 *   (3) THE s-TREND. Along the product axis BOTH off-diagonal extremes rise
 *       MONOTONICALLY and SATURATE below 1: min R_jk climbs 0.1950 (s=0.4) ->
 *       0.9293 (s=8) and max R_jk climbs 0.3387 -> 0.9976, both approaching the
 *       common-exponential Perron limit (cosh/sinh -> e^{s*x}, every R_jk -> 1) from
 *       below. The off-diagonal cross-terms are strongest in the long-lag / strong-
 *       shear regime, exactly tracking the imp-3085 gap; they neither peak nor decay.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as
 *   imp-3066 / imp-3085 -- NOT the section-26 Gram. The measured off-diagonal
 *   entries carry NO RH verdict; this is a pure measurement of how the de-homogenized
 *   off-diagonal magnitude varies with the shear weight a and lag window U, and a
 *   confirmation that (like ||R|| and the gap) it is governed by the single a*U scale
 *   while the raw |H_jk| is not. Positivity is NOT attempted. The bare-V pilot
 *   (imp-1240) is NOT re-run. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous
 *   SOTA. No false QED.
 *
 *   @see imp-3085-hankel-gap-aU-grid.js (imp-3085: the gap + raw |H_jk| contrast)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell gap)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the degree-0 a*U invariant)
 *
 *   Ticket: imp-3107 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1]);   // shear weights (imp-3085 grid)
const U_GRID = Object.freeze([4, 6, 8, 10]);          // lag cutoffs (imp-3085 grid)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3085)

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

/** One (a, U) cell: build R exactly as imp-3085 and read off its off-diagonal extremes. */
function cellMetrics(a, U) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, a, U, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  let minOffDiagR = Infinity;
  let maxOffDiagR = -Infinity;
  let minOffDiagHankel = Infinity;
  for (let j = 0; j <= DEG; j++) {
    for (let k = 0; k <= DEG; k++) {
      if (j === k) continue;
      const r = R[j][k];
      if (r < minOffDiagR) minOffDiagR = r;
      if (r > maxOffDiagR) maxOffDiagR = r;
      const h = Math.abs(Hshear[j][k]);
      if (h < minOffDiagHankel) minOffDiagHankel = h;
    }
  }
  return Object.freeze({
    a,
    U,
    s: a * U,
    minOffDiagonalR: minOffDiagR,                 // de-homogenized -- SHOULD track s
    maxOffDiagonalR: maxOffDiagR,                 // de-homogenized -- SHOULD track s
    minOffDiagonalHankelCrossTerm: minOffDiagHankel,  // raw -- does NOT track s
    offDiagMagnitudesBelowOne: maxOffDiagR < 1 && minOffDiagR > 0,
  });
}

// Full Cartesian a x U grid of per-cell off-diagonal extremes.
const GRID = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => cellMetrics(a, U))),
);

// Equal-product (a*U) pairs: each de-homogenized off-diagonal extreme MUST coincide.
const EQUAL_PRODUCT_PAIRS = Object.freeze([
  Object.freeze({ s: 2.0, cellA: cellMetrics(0.5, 4), cellB: cellMetrics(0.2, 10) }),
  Object.freeze({ s: 3.0, cellA: cellMetrics(0.5, 6), cellB: cellMetrics(0.3, 10) }),
  Object.freeze({ s: 1.2, cellA: cellMetrics(0.3, 4), cellB: cellMetrics(0.2, 6) }),
]);

// Worst coincidence mismatch of the de-homogenized extremes, and the raw-Hankel spread.
let maxOffDiagMismatch = 0;
let maxRawHankelSpread = 0;
for (const pair of EQUAL_PRODUCT_PAIRS) {
  maxOffDiagMismatch = Math.max(
    maxOffDiagMismatch,
    Math.abs(pair.cellA.minOffDiagonalR - pair.cellB.minOffDiagonalR),
    Math.abs(pair.cellA.maxOffDiagonalR - pair.cellB.maxOffDiagonalR),
  );
  maxRawHankelSpread = Math.max(
    maxRawHankelSpread,
    Math.abs(pair.cellA.minOffDiagonalHankelCrossTerm - pair.cellB.minOffDiagonalHankelCrossTerm),
  );
}

// Trend along the product axis: any (a,U) with a*U = s gives the same de-homogenized R.
const S_TREND = Object.freeze(
  [0.4, 1.0, 2.0, 3.0, 5.0, 8.0].map((s) => {
    const cell = cellMetrics(0.5, s / 0.5);
    return Object.freeze({
      s,
      minOffDiagonalR: cell.minOffDiagonalR,
      maxOffDiagonalR: cell.maxOffDiagonalR,
    });
  }),
);

// Both off-diagonal extremes rise monotonically with s (and saturate below 1).
let minTrendMonotoneIncreasing = true;
let maxTrendMonotoneIncreasing = true;
for (let i = 1; i < S_TREND.length; i++) {
  if (S_TREND[i].minOffDiagonalR <= S_TREND[i - 1].minOffDiagonalR) minTrendMonotoneIncreasing = false;
  if (S_TREND[i].maxOffDiagonalR <= S_TREND[i - 1].maxOffDiagonalR) maxTrendMonotoneIncreasing = false;
}
const headlineCell = cellMetrics(0.5, 6);   // s = 3 anchor (matches the imp-3085 headline cell)

export const IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID = Object.freeze({
  id: 'imp-3107-dehomogenized-offdiag-aU-grid',
  ticket: 'imp-3107',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedGapSweep: 'imp-3085-hankel-gap-aU-grid.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedScaleInvariant: 'imp-3064-deficit-excess-fraction-grid.js',

  summary:
    'Tabulates the DE-HOMOGENIZED off-diagonal extremes min_{j!=k} R_jk and max_{j!=k} R_jk ' +
    '(R_jk = H_jk / sqrt(D_jj D_kk)) across the imp-3085 Cartesian a x U grid -- the curve ' +
    'imp-3085 never reported, having only contrasted the RAW |H_jk|. CONFIRMS the de-homogenized ' +
    'off-diagonal entries ARE functions of s = a*U alone (the U prefactor cancels in the ratio): ' +
    'equal-product cells coincide to ~1e-15 (at s = 3 both (0.5,6) and (0.3,10) give min R_jk ' +
    '0.77125669, max R_jk 0.98549338), exactly UNLIKE the raw min |H_jk|, which keeps the U scale ' +
    'and stays split 5.58 vs 9.31. PROFILE: along the s axis BOTH extremes rise monotonically and ' +
    'saturate below 1 (min R_jk 0.1950 at s=0.4 -> 0.9293 at s=8; max R_jk 0.3387 -> 0.9976), ' +
    'approaching the common-exponential Perron limit (every R_jk -> 1) from below -- they grow and ' +
    'saturate, they do not peak or decay. REPRESENTATIVE / DIAGNOSTIC truncation; the off-diagonal ' +
    'entries carry NO RH verdict; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3085-hankel-gap-aU-grid.js (same phi_j = (tau/U)^j truncation and quadrature)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk), D_jj = int cosh(a*tau)(tau/U)^{2j}, H_jk = int sinh(a*tau)(tau/U)^{j+k}',
    scaleReduction: 'tau = U*x => R_jk = [int_0^1 sinh(s*x) x^{j+k}] / sqrt([int cosh(s*x) x^{2j}][int cosh(s*x) x^{2k}]), s = a*U (U cancels in EVERY entry)',
    aGrid: A_GRID,
    uGrid: U_GRID,
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    grid: GRID,                                       // every (a,U) cell: s, min/max off-diag R, raw min |H_jk|
    equalProductPairs: EQUAL_PRODUCT_PAIRS,           // coincidence of the de-homogenized off-diag at equal a*U
    maxOffDiagMismatchAcrossEqualProductPairs: maxOffDiagMismatch,   // ~1e-15: the off-diag R IS a function of s = a*U
    maxRawHankelSpreadAcrossEqualProductPairs: maxRawHankelSpread,   // O(1): the RAW |H_jk| is NOT
    sTrend: S_TREND,                                  // min/max off-diag R vs s along the product axis
    minTrendMonotoneIncreasing,                       // min off-diag R rises with s and saturates
    maxTrendMonotoneIncreasing,                       // max off-diag R rises with s and saturates
    headlineMinOffDiagonalRAtAhalfU6: headlineCell.minOffDiagonalR,  // ~0.77125669 at s = 3
    headlineMaxOffDiagonalRAtAhalfU6: headlineCell.maxOffDiagonalR,  // ~0.98549338 at s = 3
  }),

  interpretation: Object.freeze({
    offDiagTracksTheProduct:
      'The de-homogenized off-diagonal extremes min/max R_jk depend on a and U ONLY through ' +
      's = a*U: equal-product cells coincide to machine precision because the U prefactor cancels ' +
      'in EVERY entry of R, not just in its spectral norm. The off-diagonal magnitude is governed ' +
      'by the single a*U scale, the same invariant imp-3085 found for ||R|| and the operator gap.',
    rawHankelKeepsTheScale:
      'De-homogenization is what removes the length scale. The RAW min |H_jk| still carries the ' +
      'dimensionful U prefactor and varies between equal-product cells (5.58 vs 9.31 at s = 3) -- ' +
      'the invariance lives in the de-homogenized entries R_jk, not the bare Gram cross-terms.',
    trend:
      'Along the product axis BOTH off-diagonal extremes are monotone increasing and saturating ' +
      'below 1: the cross-terms strengthen in the long-lag / strong-shear regime (large s) and ' +
      'approach the common-exponential Perron limit (every R_jk -> 1) from below. They neither ' +
      'peak at an interior s nor decay -- the same long-lag growth the imp-3085 gap exhibits.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    offDiagCarriesNoRHVerdict:
      'The measured off-diagonal entries are on the SAME representative monomial-moment truncation ' +
      'as imp-3066 / imp-3085, chosen to EXHIBIT the off-diagonal cross-terms; they are NOT the ' +
      'section-26 Gram, so they neither claim the cover fails nor that it holds. Only the ' +
      'a*U-scaling of the off-diagonal magnitude is asserted.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID_ASSERTIONS = [
  {
    id: 'imp3107-grid-shape',
    why: 'The sweep covers the full Cartesian A_GRID x U_GRID; a count drift means the grid build ' +
         'dropped or duplicated a cell.',
    holds: () => GRID.length === A_GRID.length * U_GRID.length,
  },
  {
    id: 'imp3107-offdiag-extremes-in-open-unit-interval',
    why: 'Every de-homogenized off-diagonal entry lies strictly in (0,1) on this grid: H_jk > 0 ' +
         '(sinh positive) gives R_jk > 0, and sinh < cosh keeps each below the diagonal-normalized ' +
         'unit ceiling. A value outside (0,1) anywhere would mean the construction drifted.',
    holds: () => GRID.every((c) => c.minOffDiagonalR > 0 && c.maxOffDiagonalR < 1 && c.offDiagMagnitudesBelowOne),
  },
  {
    id: 'imp3107-offdiag-tracks-aU-product',
    why: 'THE FINDING: substituting tau = U*x cancels the U prefactor in EVERY entry of the ' +
         'de-homogenized R, so the off-diagonal extremes min/max R_jk depend on s = a*U alone. ' +
         'Equal-product cells must coincide to machine precision; a non-trivial mismatch would ' +
         'falsify the a*U scale invariance of the off-diagonal entries.',
    holds: () => maxOffDiagMismatch < 1e-9,
  },
  {
    id: 'imp3107-raw-hankel-does-not-track-product',
    why: 'The contrast (the imp-3085 caveat made into a curve): the RAW off-diagonal min |H_jk| ' +
         'still carries the dimensionful U prefactor, so it is NOT a function of s = a*U. The spread ' +
         'across equal-product cells must be O(1), confirming the scale invariance lives in the ' +
         'de-homogenized entries R_jk, not the bare Gram.',
    holds: () => maxRawHankelSpread > 1,
  },
  {
    id: 'imp3107-both-trends-monotone-increasing-in-s',
    why: 'Along the product axis both off-diagonal extremes grow with s and saturate below 1; min ' +
         'and max R_jk must each be strictly increasing on the sampled s ladder. A non-monotone ' +
         'trend would mean the off-diagonal magnitude lacks the expected long-lag growth.',
    holds: () => minTrendMonotoneIncreasing && maxTrendMonotoneIncreasing,
  },
  {
    id: 'imp3107-min-below-max-offdiag',
    why: 'Sanity ordering: at each cell the minimum off-diagonal entry cannot exceed the maximum; ' +
         'a violation means the extreme scan is broken.',
    holds: () => GRID.every((c) => c.minOffDiagonalR <= c.maxOffDiagonalR),
  },
  {
    id: 'imp3107-headline-anchor',
    why: 'Cross-check the s = 3 headline cell (a,U) = (0.5,6) against the directly computed values: ' +
         'min R_jk ~ 0.77125669, max R_jk ~ 0.98549338. A mismatch means the inherited construction ' +
         'drifted from imp-3085.',
    holds: () =>
      Math.abs(headlineCell.minOffDiagonalR - 0.77125669) < 1e-6 &&
      Math.abs(headlineCell.maxOffDiagonalR - 0.98549338) < 1e-6,
  },
  {
    id: 'imp3107-equal-product-offdiag-extremes-locked-1e13',
    why: 'THE imp-3128 LOCK (the off-diagonal analogue of the imp-3113 gap lock): rebuild R at the ' +
         'two DISTINCT equal-product cells (a,U) = (0.5,6) and (0.3,10), both s = a*U = 3, and certify ' +
         'the de-homogenized OFF-DIAGONAL extremes to a TIGHTER 1e-13: (a) |min R_jk^(1) - min R_jk^(2)| ' +
         '< 1e-13 AND |max R_jk^(1) - max R_jk^(2)| < 1e-13 (the U prefactor cancels in EVERY entry of ' +
         'R_jk = H_jk/sqrt(D_jj D_kk), so the off-diagonal min and max are functions of s = a*U alone), ' +
         'while (b) the RAW min |H_jk| DIFFERS by O(1) between them (it keeps the dimensionful U scale). ' +
         'imp-3113 pinned the gap + ||R|| at this exact pair; this pins the off-diagonal min/max R_jk on ' +
         'the SAME pair so a silent construction edit cannot drift the off-diagonal s-invariance. ' +
         'Measured: both extremes coincide to ~1e-15, headline min R_jk ~ 0.77125669, max R_jk ~ 0.98549338.',
    holds: () => {
      const c1 = cellMetrics(0.5, 6);
      const c2 = cellMetrics(0.3, 10);
      const minInvariant = Math.abs(c1.minOffDiagonalR - c2.minOffDiagonalR) < 1e-13;
      const maxInvariant = Math.abs(c1.maxOffDiagonalR - c2.maxOffDiagonalR) < 1e-13;
      const rawHankelDiffers =
        Math.abs(c1.minOffDiagonalHankelCrossTerm - c2.minOffDiagonalHankelCrossTerm) > 1;
      return minInvariant && maxInvariant && rawHankelDiffers;
    },
  },
  {
    id: 'imp3107-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic tabulation, the off-diagonal ' +
         'entries carry no RH verdict, positivity was not attempted, it is not a proof or a ' +
         'reduction, and PT 0.2 stays SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID.honestCaveat;
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

for (const assertion of IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3107-dehomogenized-offdiag-aU-grid assertion failed: ${assertion.id}`);
  }
}

export default IMP3107_DEHOMOGENIZED_OFFDIAG_AU_GRID;
