/**
 * @module imp-3675-dense-lanczos-pair-spread-crossover-viz-data
 * @fileoverview Light viz-data module for the imp-3675 chart of the imp-3643 dense-vs-Lanczos
 *   deep-rung lambda_7=lambda_8 (fourth-pair) spread comparison. Values are literal copies
 *   derived from the baked imp-3643 measurement; import-light, no research-module import.
 */

// N, dense adjacent-pair relative spread (Householder+QL, no Krylov), imp-3619 Lanczos
// (m=440) relative spread -- see imp-3643-skew-toeplitz-third-gap-dense-crossval.js
export const IMP3675_PAIR_SPREAD_LADDER = Object.freeze([
  { N: 1200, densePair78: 2.557092052840398e-15, lanczosPair78: 2.2817129086879246e-14 },
  { N: 1600, densePair78: 1.179017166259571e-15, lanczosPair78: 9.825143052161608e-16 },
  { N: 2000, densePair78: 1.964117495180717e-16, lanczosPair78: 3.985999685893989e-11 },
]);

// dense adjacent-pair degeneracy tolerance used by imp-3643 to certify pairing
export const IMP3675_PAIR_TOL = 1e-14;

// Lanczos/dense ratio at the deepest rung -- the artifact magnitude imp-3643 explains
export const IMP3675_N2000_LANCZOS_OVER_DENSE_RATIO = 202941;
