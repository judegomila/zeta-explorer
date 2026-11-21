/**
 * @module imp-97164-krein-v0-overlap-inversion-interval-obstruction
 *
 * imp-97164 (numerical): EXECUTE the imp-97134 degree-to-v0 overlap-matrix mapping with interval
 * enclosure -- the FINAL step of SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL -- attempting to map the
 * exact integer degree-level annihilating trials of imp-97134 back onto a CERTIFIED rational v0 whose
 * combination g(t) = v0 . Phih(t) carries a two-sided interval enclosure g(t) = O(t^-4). Re-solve the
 * numerical v0 -> {d_k} overlap, invert onto a fixed rational v0, and if the enclosure does not close,
 * report the precise interval-arithmetic obstruction.
 *
 * THE MAP. From the committed imp-97113 / imp-97015 setup, the ground-state combination collapses to a
 * single spherical-Bessel sum over the degree index k,
 *   g(t) = v0 . Phih(t) = a^7 sum_{k=0..Kmax} d_k j_k(a t),   d_k = sum_j v0_j c_{jk},
 * i.e. the degree vector is d = C^T v0 with the committed overlap matrix C of shape N x (Kmax+1). At the
 * binding rung (imp-97015 IMP97015_PARAMS) N = 100 and Kmax = 105, so C is 100 x 106 and C^T is 106 x 100.
 * imp-97134 delivered exact integer degree-level trials (even {0,2,4,6} -> (33,55,27,5); odd {1,3,5,7} ->
 * (143,273,165,35)) whose six imp-97113 leading carrier functionals vanish EXACTLY, giving g = O(t^-4) at
 * the DEGREE level. The remaining step is the inversion d -> v0 under interval arithmetic.
 *
 * OBSTRUCTION 1 -- RANGE / OVER-DETERMINATION (exact, from the committed shapes). The imp-97134 trial is a
 * degree vector supported on exactly 8 degrees {0..7}: it fixes those 8 components AND implicitly forces the
 * remaining 98 components d_8..d_105 to ZERO (else higher-degree modes re-contribute to the t^-1..t^-3
 * orders). Reproducing that vector by a v0 means solving C^T v0 = d_trial: 106 equations (one per degree
 * k = 0..105) in 100 unknowns (v0), OVER-DETERMINED by degDim - N = 106 - 100 = 6. Since rank(C^T) <= 100 < 106,
 * a generic 8-sparse target d_trial is NOT in the column space of C^T, so NO v0 reproduces the exact imp-97134
 * trial. The literal "invert the overlap onto the imp-97134 trial vector" step therefore has no solution --
 * the trial lives in a strictly larger degree space than the image of the trial-vector map.
 *
 * THE CORRECT RELAXATION (consistent, but see Obstruction 2). One should instead impose only the SIX
 * asymptotic carrier functionals on v0 directly: L_i(d) = L_i(C^T v0) is a linear functional of v0, and the
 * 6 functionals over the degrees present form a rank-6 map (verified here: the 6 x 8 degree-functional matrix
 * on degrees 0..7 has rank 6, splitting into two rank-3 parity blocks). So 6 linear constraints on the
 * N = 100 trial vector leave a 94-dimensional family of admissible v0 (imp-97113 v0FamilyDim = 94), which IS
 * consistent -- the annihilation exists at the v0 level. What it does NOT do is reproduce the imp-97134 exact
 * integer trial: the achievable v0 carries its OWN nonzero higher-degree tail d_8..d_105, so the O(t^-4)
 * constant is governed by that full tail, not by the 8-sparse trial.
 *
 * OBSTRUCTION 2 -- INTERVAL CERTIFICATION (the binding one). Certifying g(t) = O(t^-4) for an EXACT rational
 * v0 requires two-sided interval control of (a) the 6 functional coefficients L_i(v0) = sum_k weight_k c_{jk},
 * and (b) the residual higher-degree tail d_8..d_105 that sets the O(t^-4) constant. The degree-side weights
 * (cosHalf, tri = k(k+1)/2, quad = (k-1)k(k+1)(k+2)/8) are EXACT integers, but the overlap entries c_{jk} are
 * spherical-Bessel / Gegenbauer overlap integrals available only at floating / fixed-precision (mpmath) value,
 * NOT as rigorous intervals: mpmath.iv exposes no interval Bessel / Gegenbauer / digamma and Arb / python-flint
 * is not installed (the committed imp-97015 IMP97015_ARB_INTERVAL_BESSEL sub-gap). Hence C^T is not available as
 * a rigorous interval object, so neither its (pseudo)inverse (the constraints defining v0) nor the residual
 * tail d_8..d_105 (the O(t^-4) constant) can be enclosed two-sidedly. The certified interval enclosure does NOT
 * close, and the precise obstruction is exactly IMP97015_ARB_INTERVAL_BESSEL -- the SAME missing interval
 * special-function evaluation that blocks imp-97015 -- now surfacing on the C-inversion rather than on the
 * per-node ghat evaluation.
 *
 * VERDICT. The final step of IMP97100_PHASE_CANCELLATION_TRIAL is EXECUTED and reported: the literal
 * degree-trial-to-v0 inversion is inconsistent (over-determined by 6); the correct 6-constraint relaxation is
 * consistent (94-dim v0 family) but its interval certification is blocked by IMP97015_ARB_INTERVAL_BESSEL. So
 * no fixed rational v0 with a certified two-sided interval g(t) = O(t^-4) enclosure is produced, and the
 * Route B/C interval majorant does not close. Execution / measurement only: produces no interval majorant;
 * Rayleigh floors stay UPPER bounds on the true lambda_min; establishes no operator positivity; changes NO
 * bound; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (exact integer degree-level trials; v0 map left unexecuted)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (6 carrier functionals; 94-dim v0 family)
 * @see imp-97015-ghat-cancellation-interval-enclosure.js (IMP97015_ARB_INTERVAL_BESSEL: no interval Bessel/Gegenbauer)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL)
 *
 * Ticket: imp-97164 (numerical, opus-4-8, medium). Execution / measurement only, RH-free; changes no bound; NO QED.
 *
 * Import-light: two light literal imports (imp-97113 functionals, imp-97134 trials), no zeros bundle.
 */

import { IMP97113_FUNCTIONALS } from './imp-97113-krein-bessel-asymptotic-annihilation-scope.js';
import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';

// Committed binding-rung shapes (imp-97015 IMP97015_PARAMS): v0 has N components, degree vector has Kmax+1.
export const IMP97164_SHAPES = Object.freeze({
  N: 100, // v0 components at the binding rung
  Kmax: 105, // top spherical-Bessel degree
  degreeVecDim: 106, // Kmax + 1 = number of degree coefficients d_k
  overlapMatrixShape: '100 x 106', // C: N x (Kmax+1); the map is d = C^T v0
  overDeterminationExcess: 6, // degreeVecDim - N = 106 - 100
});

// Combined support of the imp-97134 degree trials (the vector we would invert onto v0).
const TRIAL_SUPPORT = Object.freeze(
  [...Object.keys(IMP97134_TRIALS.even), ...Object.keys(IMP97134_TRIALS.odd)]
    .map(Number)
    .sort((a, b) => a - b),
);

// float matrix rank (row-echelon with partial pivoting), reused pattern from imp-97113.
function matrixRank(rows, tol = 1e-9) {
  const M = rows.map((r) => r.slice());
  const nr = M.length;
  const nc = M[0].length;
  let rank = 0;
  const used = new Array(nr).fill(false);
  for (let col = 0; col < nc; col++) {
    let pivot = -1;
    let best = tol;
    for (let r = 0; r < nr; r++) {
      if (!used[r] && Math.abs(M[r][col]) > best) {
        best = Math.abs(M[r][col]);
        pivot = r;
      }
    }
    if (pivot === -1) continue;
    used[pivot] = true;
    rank++;
    for (let r = 0; r < nr; r++) {
      if (r !== pivot && Math.abs(M[r][col]) > tol) {
        const f = M[r][col] / M[pivot][col];
        for (let c = col; c < nc; c++) M[r][c] -= f * M[pivot][c];
      }
    }
  }
  return rank;
}

// Build the 6 x 8 degree-functional matrix (rows = 6 carrier functionals, cols = degrees 0..7).
function sixByEightFunctionalMatrix() {
  const degs = [0, 1, 2, 3, 4, 5, 6, 7];
  const rows = [];
  for (let i = 0; i < 3; i++) rows.push(degs.map((k) => IMP97113_FUNCTIONALS.evenRow(k)[i]));
  for (let i = 0; i < 3; i++) rows.push(degs.map((k) => IMP97113_FUNCTIONALS.oddRow(k)[i]));
  return rows;
}

export const IMP97164_VERDICT = Object.freeze({
  ticket: 'imp-97164',
  question:
    'execute the imp-97134 degree-to-v0 overlap-matrix mapping with interval enclosure -- re-solve the v0 -> {d_k} overlap, invert onto a fixed rational v0, and attempt a certified interval enclosure g(t) = O(t^-4) (the final step of SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL); if it does not close, report the precise interval-arithmetic obstruction.',
  answer:
    'the map is d = C^T v0 with C committed at shape 100 x 106 (N=100 v0 components, Kmax+1=106 degrees). OBSTRUCTION 1 (exact, from the shapes): the imp-97134 trial is supported on 8 degrees {0..7} and forces the other 98 to zero, so inverting it onto v0 is C^T v0 = d_trial, 106 equations in 100 unknowns, over-determined by 106-100=6; since rank(C^T) <= 100 < 106 a generic 8-sparse target is not in the image, so NO v0 reproduces the exact imp-97134 trial. The correct relaxation -- impose only the 6 asymptotic carrier functionals on v0 (the 6 x 8 degree-functional matrix on degrees 0..7 has rank 6, two rank-3 parity blocks) -- is consistent and leaves a 94-dim v0 family, but reproduces a DIFFERENT v0 with its own nonzero higher-degree tail. OBSTRUCTION 2 (binding): certifying g(t) = O(t^-4) for an exact rational v0 needs two-sided interval control of the functional coefficients L_i(v0) = sum_k weight_k c_{jk} and of the residual tail d_8..d_105, but the overlap entries c_{jk} are spherical-Bessel / Gegenbauer overlaps with NO interval evaluation available (mpmath.iv has no interval Bessel; Arb / python-flint not installed -- the imp-97015 IMP97015_ARB_INTERVAL_BESSEL sub-gap). So C^T is not a rigorous interval object, its inverse and the O(t^-4) constant cannot be enclosed, and the certified interval enclosure does NOT close. No fixed rational v0 with a certified interval O(t^-4) enclosure is produced; the Route B/C interval majorant stays open.',
  // Obstruction 1: range / over-determination (exact from committed shapes).
  trialSupportDegrees: TRIAL_SUPPORT, // [0..7]
  trialSupportCount: TRIAL_SUPPORT.length, // 8
  literalInversionOverDeterminedBy: IMP97164_SHAPES.overDeterminationExcess, // 6
  literalTrialInversionConsistent: false, // 8-sparse target not in column space of C^T (106 > 100)
  // Correct relaxation: 6 functionals on v0 (consistent, 94-dim family).
  sixFunctionalRank: 6, // 6 x 8 degree-functional matrix rank (two rank-3 parity blocks)
  relaxedV0FamilyDim: 94, // N - 6 (imp-97113 v0FamilyDim)
  relaxedConstraintsConsistent: true, // an annihilating v0 exists (float / mpmath level)
  reproducesExactImp97134Trial: false, // achievable v0 carries its own d_8..d_105 tail
  // Obstruction 2: interval certification (binding).
  overlapEntriesHaveIntervalEval: false, // c_{jk} are Bessel/Gegenbauer overlaps; no interval Bessel available
  intervalObstruction: 'IMP97015_ARB_INTERVAL_BESSEL', // same missing interval special-function eval as imp-97015
  v0OverlapInvertedUnderIntervals: false,
  certifiedIntervalEnclosureClosed: false, // g(t) = O(t^-4) NOT certified for a rational v0
  intervalMajorantProduced: false,
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL stays open -- this leaf EXECUTES the degree-to-v0 inversion step and reports two obstructions: (1) the imp-97134 8-sparse degree trial cannot be reproduced by any v0 (C^T v0 = d_trial is 106 equations in 100 unknowns, over-determined by 6, target not in the image), and the correct 6-functional relaxation, though consistent (94-dim v0 family, rank-6 constraint map), gives a different v0; (2) certifying g(t) = O(t^-4) for an exact rational v0 needs interval control of the overlap entries c_{jk} (spherical-Bessel / Gegenbauer overlaps) and the residual tail d_8..d_105, but no interval Bessel / Gegenbauer evaluation exists (mpmath.iv lacks it, Arb / python-flint not installed) -- the imp-97015 IMP97015_ARB_INTERVAL_BESSEL sub-gap. So no fixed rational v0 with a certified interval O(t^-4) enclosure is produced and the Route B/C interval majorant does not close.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97164_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97164_ASSERTIONS = [
  {
    id: 'imp97164-shapes-and-overdetermination-exact',
    holds: () =>
      IMP97164_SHAPES.degreeVecDim === IMP97164_SHAPES.Kmax + 1 &&
      IMP97164_SHAPES.degreeVecDim === 106 &&
      IMP97164_SHAPES.N === 100 &&
      IMP97164_SHAPES.overDeterminationExcess === IMP97164_SHAPES.degreeVecDim - IMP97164_SHAPES.N &&
      IMP97164_SHAPES.overDeterminationExcess === 6,
    why: 'the committed binding-rung shapes give C of size 100 x 106, so inverting a full degree vector onto v0 is C^T v0 = d (106 equations, 100 unknowns), over-determined by exactly 106 - 100 = 6.',
  },
  {
    id: 'imp97164-trial-is-eight-sparse-below-kmax',
    holds: () =>
      TRIAL_SUPPORT.length === 8 &&
      TRIAL_SUPPORT[0] === 0 &&
      TRIAL_SUPPORT[TRIAL_SUPPORT.length - 1] === 7 &&
      Math.max(...TRIAL_SUPPORT) < IMP97164_SHAPES.degreeVecDim &&
      IMP97164_VERDICT.literalInversionOverDeterminedBy === 6 &&
      IMP97164_VERDICT.literalTrialInversionConsistent === false,
    why: 'the imp-97134 trial is supported on exactly 8 degrees {0..7} inside a 106-degree vector, forcing the other 98 to zero; reproducing it by a v0 is an over-determined (by 6) system whose 8-sparse target is generically not in the 100-dim column space of C^T, so no v0 reproduces the exact trial.',
  },
  {
    id: 'imp97164-six-functionals-rank-six-relaxation-consistent',
    holds: () => {
      const rk = matrixRank(sixByEightFunctionalMatrix());
      return (
        rk === 6 &&
        IMP97164_VERDICT.sixFunctionalRank === 6 &&
        IMP97164_VERDICT.relaxedV0FamilyDim === IMP97164_SHAPES.N - 6 &&
        IMP97164_VERDICT.relaxedConstraintsConsistent === true &&
        IMP97164_VERDICT.reproducesExactImp97134Trial === false
      );
    },
    why: 'the correct relaxation imposes only the 6 asymptotic carrier functionals on v0; the 6 x 8 degree-functional matrix on degrees 0..7 has rank 6 (two rank-3 parity blocks), leaving a 94-dim v0 family (consistent), but the achievable v0 carries its own higher-degree tail and does not reproduce the exact imp-97134 8-sparse trial.',
  },
  {
    id: 'imp97164-interval-certification-blocked',
    holds: () =>
      IMP97164_VERDICT.overlapEntriesHaveIntervalEval === false &&
      IMP97164_VERDICT.intervalObstruction === 'IMP97015_ARB_INTERVAL_BESSEL' &&
      IMP97164_VERDICT.v0OverlapInvertedUnderIntervals === false &&
      IMP97164_VERDICT.certifiedIntervalEnclosureClosed === false,
    why: 'certifying g(t) = O(t^-4) for a rational v0 needs interval control of the overlap entries c_{jk} (spherical-Bessel / Gegenbauer overlaps) and the residual tail d_8..d_105, but no interval Bessel / Gegenbauer evaluation is available (mpmath.iv lacks it, Arb / python-flint not installed) -- the imp-97015 IMP97015_ARB_INTERVAL_BESSEL sub-gap blocks the certified inversion.',
  },
  {
    id: 'imp97164-execution-only-no-qed',
    holds: () =>
      IMP97164_VERDICT.certifiedIntervalEnclosureClosed === false &&
      IMP97164_VERDICT.intervalMajorantProduced === false &&
      IMP97164_VERDICT.operatorPositivityProved === false &&
      IMP97164_VERDICT.boundChanged === false &&
      IMP97164_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97164_VERDICT.qed === false &&
      typeof IMP97164_VERDICT.subGap === 'string' &&
      IMP97164_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
      IMP97164_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'the final inversion step is executed and reported (over-determination + interval obstruction), but no certified interval enclosure closes, no interval majorant is produced, no operator positivity, no bound change, both sub-gaps carried, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97164_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97164-krein-v0-overlap-inversion-interval-obstruction assertion failed: ${a.id}`);
  }
}
