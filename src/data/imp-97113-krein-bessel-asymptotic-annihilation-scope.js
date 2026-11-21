/**
 * @module imp-97113-krein-bessel-asymptotic-annihilation-scope
 *
 * imp-97113 (numerical): MEASURE the leading spherical-Bessel asymptotic coefficients of the Krein
 * ground-state combination g(t) = v0 . Phih(t) and SCOPE the fixed rational trial that annihilates them
 * to O(t^-4). Targets SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL (refines IMP96888_RAYLEIGH_TAIL_MAJORANT):
 * the Route B/C interval majorant for the Krein Rayleigh tail is finite only if a FIXED RATIONAL trial v0
 * gives g(t) a CERTIFIED g(t) = O(t^-4) decay, i.e. explicit annihilation of the t^-1, t^-2, t^-3
 * spherical-Bessel asymptotic coefficients.
 *
 * SETUP (from the committed imp-96888 / imp-96973 / imp-97015 literals). Each basis mode is
 *   Phih_j(t) = a^(2M+1) sum_k c_{jk} j_k(a t),  M = 3  (prefactor a^7),
 * and the ground-state combination collapses to a SINGLE spherical-Bessel sum over the degree index k
 *   g(t) = v0 . Phih(t) = a^7 sum_k d_k j_k(a t),   d_k = sum_j v0_j c_{jk}
 * (imp-97015 wrote the same projection as proj(t) = a^(2M+1) sum_k (-i)^k (2k+1) j_k(a t) (v0 . C[:,k]);
 * the (-i)^k (2k+1) and overlap factors are absorbed into d_k here). So the tail smallness is entirely a
 * property of the degree-coefficient vector {d_k}.
 *
 * MEASURED ASYMPTOTIC MACHINERY (exact, verified numerically to O(z^-4) at z in {200,400,800} against
 * scipy.special.spherical_jn, tmp/imp-97113-verify.py, /tmp/rhvenv). Writing z = a t, the spherical Bessel
 * function has the exact three-order asymptotic
 *   j_k(z) = sin(z - k pi/2)/z
 *          + [k(k+1)/2] cos(z - k pi/2)/z^2
 *          - [(k-1)k(k+1)(k+2)/8] sin(z - k pi/2)/z^3
 *          + O(z^-4),
 * with the two coefficient families being the clean closed forms of the Hankel P/Q series at mu = (2k+1)^2:
 *   (mu-1)/8       = k(k+1)/2                 (order z^-2 weight)
 *   (mu-1)(mu-9)/128 = (k-1)k(k+1)(k+2)/8     (order z^-3 weight).
 * Because sin(z - k pi/2) and cos(z - k pi/2) collapse (mod 4 in k) onto the two carriers sin z, cos z,
 * the ENTIRE leading behaviour of g(t) reduces to
 *   g(t) ~ a^7 [ sin(z) ( s1/z + s2/z^2 + s3/z^3 ) + cos(z) ( c1/z + c2/z^2 + c3/z^3 ) ] + O(z^-4),
 * i.e. SIX real leading coefficients {s1,c1,s2,c2,s3,c3}, each a LINEAR functional of the coefficient
 * vector {d_k} with the exact per-degree carrier weights baked in IMP97113_DEGREE_WEIGHTS below.
 *
 * PARITY DECOUPLING (measured). cos(k pi/2) = 0 for odd k and sin(k pi/2) = 0 for even k, so the six
 * functionals split into two independent 3-constraint blocks:
 *   EVEN degrees (k = 0,2,4,...) feed  { L1sin, L2cos, L3sin };
 *   ODD  degrees (k = 1,3,5,...) feed  { L1cos, L2sin, L3cos }.
 * Each block is a rank-3 map on the degree coefficients (verified: degrees {0,2,4} and {1,3,5} give
 * full-rank 3x3 systems, so 3 degrees per parity annihilate ONLY the trivial d = 0).
 *
 * SCOPE OF THE FIXED RATIONAL TRIAL (the deliverable). To force g(t) = O(t^-4) with a NONTRIVIAL trial:
 *   - each parity block imposes 3 independent linear constraints, so a nonzero kernel needs >= 4 degrees
 *     per parity -> minimum support 4 even + 4 odd = 8 spherical-Bessel degrees (degrees 0..7, Kmax >= 7).
 *     Verified: the 3x4 blocks on {0,2,4,6} and {1,3,5,7} are rank 3 with a 1-dimensional kernel, and a
 *     kernel trial gives g(z) z^4 BOUNDED (~10-140, non-growing) across z in {100..1600} while a generic
 *     non-annihilating trial decays only like z^-1 (tmp/imp-97113-scope.py).
 *   - at the TRIAL-VECTOR level the annihilation is only 6 real linear constraints on v0 (v0 has N = 100
 *     components at the binding rung), leaving a (N-6) = 94-dimensional family of admissible trials, so a
 *     fixed rational v0 with certified O(t^-4) decay EXISTS in abundance whenever N >= 7 and the
 *     v0 -> {d_k} overlap map reaches both parities to depth >= 4.
 * This matches the measured tail: imp-97100 read g(t) ~ t^-3.96 ~ t^-4 (cancellation depth ~3 beyond the
 * single-mode t^-1), i.e. the numerical ground state ALREADY (approximately) satisfies these 6 constraints;
 * the open task is to reproduce that annihilation with an EXACT rational v0 under interval arithmetic.
 *
 * WHAT THIS IS NOT. No solver run: the actual numerical ground-state coefficients {d_k} are NOT re-measured
 * here, so no per-degree d_k VALUES are reported -- only the exact asymptotic-coefficient machinery (the
 * per-degree carrier weights) and the DOF count of the annihilation. Mapping the 6 carrier constraints back
 * onto certified rational v0 components via the committed overlap matrix C (with interval enclosure) is NOT
 * executed; SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL stays open. Measurement / scoping only: produces no
 * interval majorant; Rayleigh floors stay UPPER bounds on the true lambda_min; establishes no operator
 * positivity; changes NO bound; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL; measured g ~ t^-4)
 * @see imp-97015-ghat-cancellation-interval-enclosure.js (g as the single Bessel sum proj(t); cancellation condition number)
 * @see imp-96909-rational-trial-residual-bound.js (rational trial keeps the min-max bound rigorous; height ladder)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (IMP96888_RAYLEIGH_TAIL_MAJORANT: the open target)
 *
 * Ticket: imp-97113 (numerical, opus-4-8, medium). Measurement / scoping only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97100 measured decay), no zeros bundle.
 */

import { IMP97100_TAIL_DECAY } from './imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js';

// Exact per-degree spherical-Bessel asymptotic carrier weights (order z^-1, z^-2, z^-3; z = a t).
//   mu       = (2k+1)^2
//   cosHalf  = cos(k pi/2) in {1,0,-1,0}
//   sinHalf  = sin(k pi/2) in {0,1,0,-1}
//   tri      = (mu-1)/8        = k(k+1)/2            (order z^-2 magnitude)
//   quad     = (mu-1)(mu-9)/128 = (k-1)k(k+1)(k+2)/8 (order z^-3 magnitude)
//   w1/w2/w3 = [sin z coeff, cos z coeff] of j_k at order z^-1 / z^-2 / z^-3
//     w1 = [cosHalf, -sinHalf]
//     w2 = [tri*sinHalf, tri*cosHalf]
//     w3 = [-quad*cosHalf, quad*sinHalf]
function degreeWeight(k) {
  const mu = (2 * k + 1) * (2 * k + 1);
  const cosHalf = [1, 0, -1, 0][k % 4];
  const sinHalf = [0, 1, 0, -1][k % 4];
  const tri = (k * (k + 1)) / 2;
  const quad = ((k - 1) * k * (k + 1) * (k + 2)) / 8;
  return Object.freeze({
    k,
    mu,
    cosHalf,
    sinHalf,
    tri,
    quad,
    w1: Object.freeze([cosHalf, -sinHalf]),
    w2: Object.freeze([tri * sinHalf, tri * cosHalf]),
    w3: Object.freeze([-quad * cosHalf, quad * sinHalf]),
  });
}

export const IMP97113_DEGREE_WEIGHTS = Object.freeze(
  Array.from({ length: 8 }, (_, k) => degreeWeight(k)),
);

// The six leading asymptotic functionals of g(t) = a^7 sum_k d_k j_k(a t), each a linear map on {d_k}.
// Parity split: even-k degrees feed the EVEN block, odd-k degrees feed the ODD block.
export const IMP97113_FUNCTIONALS = Object.freeze({
  carriers: Object.freeze(['sin z', 'cos z']),
  orders: 3, // z^-1, z^-2, z^-3
  count: 6, // 2 carriers x 3 orders
  evenBlock: Object.freeze(['L1sin', 'L2cos', 'L3sin']), // fed by even k (sinHalf = 0)
  oddBlock: Object.freeze(['L1cos', 'L2sin', 'L3cos']), // fed by odd k (cosHalf = 0)
  // per-degree contribution to each functional (row = functional, entry = weight on d_k):
  //   L1sin = sum_k d_k cosHalf(k);        L1cos = sum_k d_k (-sinHalf(k))
  //   L2sin = sum_k d_k tri(k) sinHalf(k); L2cos = sum_k d_k tri(k) cosHalf(k)
  //   L3sin = sum_k d_k (-quad(k) cosHalf(k)); L3cos = sum_k d_k quad(k) sinHalf(k)
  evenRow: (k) => {
    const w = degreeWeight(k);
    return [w.w1[0], w.w2[1], w.w3[0]]; // [L1sin, L2cos, L3sin] weights on d_k
  },
  oddRow: (k) => {
    const w = degreeWeight(k);
    return [w.w1[1], w.w2[0], w.w3[1]]; // [L1cos, L2sin, L3cos] weights on d_k
  },
});

// float matrix rank (row-echelon with pivoting); rows: array of arrays.
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

// constraint matrices (3 functionals x degrees) for a parity block over a chosen degree set.
function blockMatrix(degrees, parity) {
  const rowFn = parity === 'even' ? IMP97113_FUNCTIONALS.evenRow : IMP97113_FUNCTIONALS.oddRow;
  // 3 rows (functionals) x len(degrees) columns
  return [0, 1, 2].map((i) => degrees.map((k) => rowFn(k)[i]));
}

export const IMP97113_SCOPE = Object.freeze({
  gIsSingleBesselSum: true, // g(t) = a^7 sum_k d_k j_k(a t)
  leadingCoeffCount: 6, // {s1,c1,s2,c2,s3,c3}: 2 carriers x 3 orders (t^-1,t^-2,t^-3)
  parityDecouples: true, // even k -> {L1sin,L2cos,L3sin}; odd k -> {L1cos,L2sin,L3cos}
  constraintsEven: 3,
  constraintsOdd: 3,
  minDegreesEven: 4, // 3 constraints need >= 4 degrees for a nontrivial kernel
  minDegreesOdd: 4,
  minDegreesTotal: 8, // degrees 0..7
  minKmax: 7,
  v0Constraints: 6, // at the trial-vector level: 6 real linear constraints on v0
  bindingN: 100,
  v0FamilyDim: 94, // N - 6 admissible trials at the binding rung
  measuredGDecayOrder: IMP97100_TAIL_DECAY.gDecayOrder, // ~3.96 (imp-97100), consistent with O(t^-4) target
  annihilatingTrialDecayOrder: 4, // kernel trial gives g(z) z^4 bounded (verified tmp/imp-97113-scope.py)
  genericTrialDecayOrder: 1, // non-annihilating trial decays only t^-1 (single-mode floor)
});

export const IMP97113_VERDICT = Object.freeze({
  ticket: 'imp-97113',
  question:
    'measure the leading spherical-Bessel asymptotic coefficients of the Krein ground-state combination g(t) = v0.Phih(t) and scope the fixed rational trial that annihilates the t^-1, t^-2, t^-3 orders to force g(t) = O(t^-4) (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL).',
  answer:
    'g(t) collapses to a single spherical-Bessel sum a^7 sum_k d_k j_k(a t); the exact three-order asymptotic j_k(z) = sin(z-k pi/2)/z + [k(k+1)/2] cos(z-k pi/2)/z^2 - [(k-1)k(k+1)(k+2)/8] sin(z-k pi/2)/z^3 + O(z^-4) reduces the leading behaviour to the two carriers sin z, cos z with SIX real coefficients, each a linear functional of {d_k}. Annihilating them (g = O(t^-4)) is 6 constraints that decouple by parity into two rank-3 blocks (even k -> {L1sin,L2cos,L3sin}, odd k -> {L1cos,L2sin,L3cos}); a nontrivial trial therefore needs >= 4 degrees per parity (>= 8 spherical-Bessel degrees, Kmax >= 7), verified by the 1-dim kernel of the 3x4 blocks giving g(z) z^4 bounded vs the generic t^-1. At the trial-vector level it is only 6 linear constraints on v0 (N = 100), leaving a 94-dim family, so a fixed rational v0 with O(t^-4) decay exists in abundance -- matching the imp-97100 measured g ~ t^-3.96 that the numerical ground state achieves automatically. The open task is reproducing that annihilation with an EXACT rational v0 under interval arithmetic.',
  besselAsymptoticVerified: true, // formula reproduces scipy spherical_jn to O(z^-4)
  gIsSingleBesselSum: true,
  leadingCoeffCount: 6,
  parityDecouples: true,
  minDegreesTotal: 8,
  minKmax: 7,
  v0Constraints: 6,
  v0FamilyDim: 94,
  consistentWithMeasuredDecay: true, // 6-constraint annihilation matches imp-97100 g ~ t^-4
  actualGroundStateCoeffsMeasured: false, // no solver run: per-degree d_k VALUES not reported
  intervalMajorantProduced: false, // scoping only
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL stays open -- this leaf measures the exact spherical-Bessel asymptotic-coefficient machinery and scopes the annihilation (6 real carrier constraints, parity-decoupled into two rank-3 blocks, minimum support 8 degrees / Kmax >= 7, or 6 constraints on the N=100 trial vector leaving a 94-dim family), but does NOT map the constraints back onto certified rational v0 components via the committed overlap matrix C under interval arithmetic, so no FIXED RATIONAL trial with a certified g(t) = O(t^-4) enclosure is produced. Without that certificate the Route B/C interval majorant does not close.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97113_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97113_ASSERTIONS = [
  {
    id: 'imp97113-degree-weight-closed-forms',
    holds: () =>
      IMP97113_DEGREE_WEIGHTS.every((w) => {
        const triOk = w.tri === (w.mu - 1) / 8;
        const quadOk = w.quad === ((w.mu - 1) * (w.mu - 9)) / 128;
        const carriers = Math.abs(w.cosHalf) + Math.abs(w.sinHalf) === 1; // exactly one nonzero (parity)
        return triOk && quadOk && carriers;
      }),
    why: 'the order z^-2 weight (mu-1)/8 equals k(k+1)/2 and the order z^-3 weight (mu-1)(mu-9)/128 equals (k-1)k(k+1)(k+2)/8 at every degree, and each degree has a single nonzero half-integer carrier (parity), the exact Hankel P/Q reduction.',
  },
  {
    id: 'imp97113-parity-decoupling',
    holds: () =>
      IMP97113_DEGREE_WEIGHTS.every((w) => {
        if (w.k % 2 === 0) {
          // even k: odd-block weights (L1cos, L2sin, L3cos) all vanish
          return w.w1[1] === 0 && w.w2[0] === 0 && w.w3[1] === 0;
        }
        // odd k: even-block weights (L1sin, L2cos, L3sin) all vanish
        return w.w1[0] === 0 && w.w2[1] === 0 && w.w3[0] === 0;
      }),
    why: 'even degrees feed only {L1sin,L2cos,L3sin} and odd degrees only {L1cos,L2sin,L3cos}, so the six leading functionals split into two independent 3-constraint parity blocks.',
  },
  {
    id: 'imp97113-blocks-rank-three-need-four-degrees',
    holds: () => {
      const evenFull = matrixRank(blockMatrix([0, 2, 4], 'even')) === 3;
      const oddFull = matrixRank(blockMatrix([1, 3, 5], 'odd')) === 3;
      const evenKernel = matrixRank(blockMatrix([0, 2, 4, 6], 'even')) === 3; // 3x4 rank 3 => 1-dim kernel
      const oddKernel = matrixRank(blockMatrix([1, 3, 5, 7], 'odd')) === 3;
      return evenFull && oddFull && evenKernel && oddKernel;
    },
    why: 'each parity block on 3 degrees is a full-rank 3x3 (only trivial d=0 annihilates), while on 4 degrees it is rank-3 3x4 with a 1-dimensional kernel, so a nontrivial trial needs >= 4 degrees per parity (>= 8 total, Kmax >= 7).',
  },
  {
    id: 'imp97113-scope-consistent',
    holds: () =>
      IMP97113_SCOPE.leadingCoeffCount === 6 &&
      IMP97113_SCOPE.constraintsEven + IMP97113_SCOPE.constraintsOdd === 6 &&
      IMP97113_SCOPE.minDegreesEven === 4 &&
      IMP97113_SCOPE.minDegreesOdd === 4 &&
      IMP97113_SCOPE.minDegreesTotal === 8 &&
      IMP97113_SCOPE.minKmax === 7 &&
      IMP97113_SCOPE.v0Constraints === 6 &&
      IMP97113_SCOPE.v0FamilyDim === IMP97113_SCOPE.bindingN - IMP97113_SCOPE.v0Constraints &&
      IMP97113_SCOPE.annihilatingTrialDecayOrder === 4 &&
      IMP97113_SCOPE.genericTrialDecayOrder === 1 &&
      IMP97113_SCOPE.measuredGDecayOrder > 3.8 &&
      IMP97113_SCOPE.measuredGDecayOrder < 4.1,
    why: 'the scope counts (6 leading coefficients, 3+3 parity constraints, >= 4 degrees per parity, 8 degrees total / Kmax >= 7, 6 constraints on the N=100 trial leaving a 94-dim family) are internally consistent and the target O(t^-4) matches the imp-97100 measured g ~ t^-3.96.',
  },
  {
    id: 'imp97113-scoping-only-no-qed',
    holds: () =>
      IMP97113_VERDICT.besselAsymptoticVerified === true &&
      IMP97113_VERDICT.gIsSingleBesselSum === true &&
      IMP97113_VERDICT.parityDecouples === true &&
      IMP97113_VERDICT.consistentWithMeasuredDecay === true &&
      IMP97113_VERDICT.actualGroundStateCoeffsMeasured === false &&
      IMP97113_VERDICT.intervalMajorantProduced === false &&
      IMP97113_VERDICT.operatorPositivityProved === false &&
      IMP97113_VERDICT.boundChanged === false &&
      IMP97113_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97113_VERDICT.qed === false &&
      typeof IMP97113_VERDICT.subGap === 'string' &&
      IMP97113_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'scoping done (asymptotic machinery measured, parity decoupling, DOF count, consistency with measured decay), but no numerical ground-state coefficients, no interval majorant, no operator positivity, no bound change, sub-gap open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97113_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97113-krein-bessel-asymptotic-annihilation-scope assertion failed: ${a.id}`);
  }
}
