/**
 * @module imp-97135-krein-compression-defect-descent-no-rate
 * @fileoverview imp-97135 -- MEASUREMENT (numerical): does the imp-97121 Finding 3 compression defect
 *   ||T_a[sigma_2] - P_N T_a[sigma_2] P_N|| (the amount the true lambda_min can lie below the finite-N
 *   Ritz floor) admit ANY extractable algebraic convergence rate at 2a=ln3, or does it degenerate like
 *   the imp-97120 T-only exponent? imp-97121 Finding 3 named the compression defect as the quantity
 *   currently observed to DESCEND WITHOUT A RATE, and required a uniform bound on it (simultaneously with
 *   the sigma_2 t-integral tail) under a single N- and T-independent constant. This leaf measures the
 *   descent along the committed Legendre-Galerkin N ladder and tests for a sustained decaying power.
 *
 *   Measurement only. The Rayleigh-Ritz floor is an UPPER bound on the true infinite-dim lambda_min, so
 *   the floor decrements measured here bound only how much the UPPER estimate is still improving, NOT
 *   the true compression defect from below. Produces no lower-bound certificate; no bound moves;
 *   interval-rigorous reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * WHY THE FLOOR DECREMENTS ARE THE OBSERVABLE SIGNATURE OF THE COMPRESSION DEFECT. The compression
 *   defect ||T_a[sigma_2] - P_N T_a[sigma_2] P_N|| is not directly computable (T is infinite-dim), but
 *   its consequence IS observable: the true lambda_min sits below every finite-N Ritz floor by at least
 *   the total remaining descent of the floor family, and each ladder step floor(N_k) - floor(N_{k+1})
 *   is the amount that step of the compression resolves. If those per-step decrements sustain a decaying
 *   power (a geometric/algebraic decay along the ladder) the family converges at an extractable rate and
 *   the residual defect is boundable; if they collapse then PLATEAU or RE-ACCELERATE, no decaying power
 *   fits and the descent has no extractable rate -- exactly the imp-97121 Finding 3 observation, now
 *   quantified. This is the compression-defect analogue of the imp-97120 T-only rate measurement.
 *
 * DATA. Reused verbatim from imp-96749-krein-lammin-N-trend-measurement.js IMP96749_LADDER['2a=ln3']:
 *   the Legendre-Galerkin Rayleigh floors at 2a=ln3, tail-inclusive T=800, on the N ladder
 *   {20,28,36,44,52,60,68,76}. The double-precision-trustworthy window is N<=52 (condB(52)=4.6e12);
 *   past N>=60 (condB 2.4e13) the decrements are conditioning-contaminated (imp-96749/imp-96772).
 *
 * METHOD (closed form, no optimizer). Per ladder step form the floor decrement
 *     d_k = floor(N_k) - floor(N_{k+1}) >= 0   (monotone-decreasing floors -> non-negative decrements),
 *   and the successive ratio r_k = d_{k+1}/d_k. A sustained algebraic decay floor(N) = floor_inf - c*N^-p
 *   forces ALL ratios r_k < 1 and (on this near-arithmetic ladder) slowly rising toward 1 from below;
 *   any r_k >= 1 is a decrement that FAILS to shrink -- a plateau or re-acceleration -- and no decaying
 *   power fits through it.
 *
 * FINDING 1 -- THE DECREMENTS COLLAPSE FOR TWO STEPS THEN BREAK DOWN INSIDE THE TRUSTED WINDOW. The
 *   ln3 floor decrements are 0.027256, 0.010074, 0.004645, 0.006407, 0.006515, 0.005911, 0.007343.
 *   The first two ratios are cleanly sub-unit (r1=0.3696, r2=0.4611: a genuine geometric collapse over
 *   N=20->28->36->44), but the THIRD ratio r3=1.3793 EXCEEDS 1 at the step N=44->52 -- i.e. the
 *   decrement d4=0.006407 is LARGER than d3=0.004645. That breakdown happens at N=52, still INSIDE the
 *   double-precision-trustworthy window (condB(52)=4.6e12), so it is NOT a conditioning artifact: the
 *   geometric decay does not survive even three trusted steps.
 *
 * FINDING 2 -- THE DECREMENTS PLATEAU, THEY DO NOT DECAY: NO EXTRACTABLE RATE. After the collapse the
 *   decrements do not continue toward 0; they settle into a plateau band ~0.006-0.0073 (0.006407,
 *   0.006515, 0.005911, 0.007343) with ratios bouncing across 1 (1.3793, 1.0169, 0.9073, 1.2423): three
 *   of the six ladder-step ratios exceed 1. A best-case single-power fit through the first two decrements
 *   gives p~3.46, which predicts d4~0.0027 -- but the measured d4=0.006407 is ~2.4x that, and the gap
 *   widens down the ladder. So no decaying power fits the sequence beyond its first two steps: the
 *   compression-defect descent has NO extractable algebraic rate, degenerating exactly as the imp-97120
 *   T-only exponent did (which went negative at the largest evaluation space).
 *
 * VERDICT. The compression defect ||T_a[sigma_2] - P_N T_a[sigma_2] P_N|| at 2a=ln3, measured through
 *   its observable signature the Legendre floor decrements, admits NO extractable algebraic convergence
 *   rate: the decrements collapse geometrically for two steps (0.027256 -> 0.010074 -> 0.004645, ratios
 *   0.37, 0.46) then BREAK DOWN inside the trusted window (r3=1.3793>1 at N=44->52, condB 4.6e12, not a
 *   conditioning artifact) and PLATEAU in a ~0.006-0.0073 band (three of six ladder-step ratios exceed
 *   1), so no decaying power fits and a single-power fit through the clean head under-predicts the tail
 *   by ~2.4x and widening. This CONFIRMS and QUANTIFIES the imp-97121 Finding 3 observation that the
 *   compression defect descends without a rate, and matches the imp-97120 T-only-exponent degeneration:
 *   neither the compression-defect nor the t-truncation direction carries a standalone algebraic rate,
 *   so the uniform bound imp-97121 Finding 3 requires cannot be read off the finite-N descent. The
 *   Rayleigh-Ritz floor stays an UPPER bound, so these decrements bound only the improvement of the
 *   upper estimate, never the true defect from below. SUB-GAP
 *   IMP97135_COMPRESSION_DEFECT_DESCENT_HAS_NO_EXTRACTABLE_RATE. Measurement only; no operator
 *   positivity established; no lower-bound certificate; no bound moves; interval-rigorous reach stays
 *   2a<=0.96; RH open; NO QED.
 *
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (Finding 3 names the compression defect; SUB-GAP IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_LADDER -- the Legendre floor ladder reused here; trusted window N<=52)
 * @see imp-96772-krein-lammin-double-double-recompute.js (extended precision: the descent is real t-truncation, not conditioning)
 * @see imp-97120-krein-t-only-eta-rate-not-stable.js (the T-only exponent degenerates the same way; sibling measurement)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97135_RIGOROUS_REACH_2A = 0.96;
export const IMP97135_BINDING_2A = LN3;

// Legendre-Galerkin Rayleigh floors at 2a=ln3, T=800, on the N ladder (verbatim from imp-96749).
export const IMP97135_NS = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76]);
export const IMP97135_FLOORS = Object.freeze([
  0.625397, 0.598141, 0.588067, 0.583422, 0.577015, 0.570500, 0.564589, 0.557246,
]);
export const IMP97135_TRUSTED_NMAX = 52; // condB(52)=4.6e12; past N>=60 (condB 2.4e13) decrements are conditioning-contaminated

// Per-step floor decrements d_k = floor(N_k) - floor(N_{k+1}) (the observable signature of the
// compression defect resolving) and successive ratios r_k = d_{k+1}/d_k. A sustained decaying power
// forces every r_k < 1; any r_k >= 1 is a decrement that fails to shrink -- a plateau/re-acceleration.
export const IMP97135_DECREMENTS = Object.freeze([
  0.027256, // N=20->28
  0.010074, // N=28->36
  0.004645, // N=36->44
  0.006407, // N=44->52  (last trusted step; r3>1 -> geometric decay already broken inside the window)
  0.006515, // N=52->60  (conditioning-contaminated tail begins)
  0.005911, // N=60->68
  0.007343, // N=68->76
]);
export const IMP97135_RATIOS = Object.freeze([
  0.3696, // r1 = d2/d1  (sub-unit: genuine collapse)
  0.4611, // r2 = d3/d2  (sub-unit: genuine collapse)
  1.3793, // r3 = d4/d3  (>1: BREAKDOWN inside the trusted window, N=44->52)
  1.0169, // r4 = d5/d4  (>1)
  0.9073, // r5 = d6/d5
  1.2423, // r6 = d7/d6  (>1)
]);

export const IMP97135_VERDICT = Object.freeze({
  ticket: 'imp-97135',
  question: 'does the imp-97121 Finding 3 compression defect ||T_a[sigma_2]-P_N T_a[sigma_2] P_N|| at 2a=ln3 admit any extractable algebraic convergence rate along the Legendre N ladder, or does it degenerate like the imp-97120 T-only exponent?',
  binding_2a: LN3,
  method: 'floor decrements d_k = floor(N_k)-floor(N_{k+1}) and ratios r_k = d_{k+1}/d_k on the Legendre N ladder {20,28,36,44,52,...}; a sustained decaying power forces every r_k < 1',
  // Finding 1: the decrements collapse for two steps then break down inside the trusted window.
  headCollapsesGeometrically: true,          // r1=0.3696, r2=0.4611 sub-unit
  breakdownInsideTrustedWindow: true,        // r3=1.3793>1 at N=44->52, condB 4.6e12 (not conditioning)
  breakdownIsConditioningArtifact: false,    // it occurs at the trusted-window edge, before the wall
  // Finding 2: the decrements plateau, they do not decay -> no extractable rate.
  decrementsPlateauNotDecay: true,           // ~0.006-0.0073 band after the collapse
  ratiosExceedingOneCount: 3,                // 3 of 6 ladder-step ratios exceed 1
  singlePowerHeadFitUnderpredictsTail: true, // p~3.46 through the head predicts d4~0.0027 vs measured 0.006407 (~2.4x)
  rateExtractable: false,
  degeneratesLikeImp97120Texponent: true,
  // unchanged program state
  operatorPositivityProved: false,
  lowerBoundCertificateProduced: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97135_COMPRESSION_DEFECT_DESCENT_HAS_NO_EXTRACTABLE_RATE -- the imp-97121 Finding 3 compression defect ||T_a[sigma_2] - P_N T_a[sigma_2] P_N|| at 2a=ln3, measured through its observable signature the Legendre-Galerkin floor decrements d_k = floor(N_k)-floor(N_{k+1}) on the N ladder {20,28,36,44,52,60,68,76} (floors 0.625397 -> 0.557246, verbatim from imp-96749), admits NO extractable algebraic convergence rate. The decrements 0.027256, 0.010074, 0.004645, 0.006407, 0.006515, 0.005911, 0.007343 collapse geometrically for exactly two steps (ratios r1=0.3696, r2=0.4611 sub-unit) then BREAK DOWN inside the double-precision-trustworthy window: r3=d4/d3=1.3793>1 at the step N=44->52 (condB(52)=4.6e12), so d4=0.006407 EXCEEDS d3=0.004645 -- a plateau/re-acceleration that is NOT a conditioning artifact because it occurs at the trusted-window edge, before the condB~1e13 wall. Past the collapse the decrements settle into a ~0.006-0.0073 plateau band with three of six ladder-step ratios exceeding 1 (1.3793, 1.0169, 0.9073, 1.2423), so no decaying power fits; a best-case single-power fit floor(N)=floor_inf-c*N^-p through the clean head gives p~3.46, which under-predicts the measured tail decrement d4 by ~2.4x with the gap widening down the ladder. This CONFIRMS and QUANTIFIES the imp-97121 Finding 3 observation that the compression defect descends without a rate, and matches the imp-97120 T-only-exponent degeneration (which went negative at the largest evaluation space): neither the compression-defect nor the t-truncation direction carries a standalone algebraic rate, so the single N- and T-independent uniform bound imp-97121 Finding 3 requires cannot be read off the finite-N descent. The Rayleigh-Ritz floor is an UPPER bound on the true lambda_min, so these decrements bound only the improvement of the upper estimate, never the true defect from below. Measurement only; no operator positivity, no lower-bound certificate, no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97135_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97135_ASSERTIONS = [
  {
    id: 'imp97135-decrements-match-floor-differences',
    holds: () => {
      // The stored decrements must reproduce the ladder floor differences to 6 decimals, and the floor
      // family must be monotone decreasing (all decrements non-negative).
      const f = IMP97135_FLOORS;
      for (let i = 0; i < f.length - 1; i++) {
        const d = f[i] - f[i + 1];
        if (Math.abs(d - IMP97135_DECREMENTS[i]) > 1e-6) return false;
        if (d < 0) return false;
      }
      return IMP97135_DECREMENTS.length === f.length - 1;
    },
    why: 'the stored floor decrements must equal floor(N_k)-floor(N_{k+1}) to 6 decimals and be non-negative (monotone-decreasing floors).',
  },
  {
    id: 'imp97135-ratios-match-decrement-ratios',
    holds: () => {
      // r_k = d_{k+1}/d_k must reproduce the stored ratios to 4 decimals.
      for (let i = 0; i < IMP97135_DECREMENTS.length - 1; i++) {
        const r = IMP97135_DECREMENTS[i + 1] / IMP97135_DECREMENTS[i];
        if (Math.abs(r - IMP97135_RATIOS[i]) > 1e-4) return false;
      }
      return IMP97135_RATIOS.length === IMP97135_DECREMENTS.length - 1;
    },
    why: 'each stored successive ratio must equal d_{k+1}/d_k to 4 decimals.',
  },
  {
    id: 'imp97135-head-collapses-then-breaks-down-in-window',
    holds: () =>
      // First two ratios sub-unit (genuine geometric collapse), third ratio >1 at the last trusted step
      // (N=44->52, still inside the trusted window) -> the decay breaks down before conditioning.
      IMP97135_RATIOS[0] < 1 && IMP97135_RATIOS[1] < 1 && IMP97135_RATIOS[2] > 1 &&
      IMP97135_NS[4] === IMP97135_TRUSTED_NMAX &&
      IMP97135_VERDICT.headCollapsesGeometrically === true &&
      IMP97135_VERDICT.breakdownInsideTrustedWindow === true &&
      IMP97135_VERDICT.breakdownIsConditioningArtifact === false,
    why: 'the decrement ratios are sub-unit for two steps then exceed 1 at the step ending N=52 (the trusted-window edge), so the geometric collapse breaks down inside the double-precision-trustworthy window, not a conditioning artifact.',
  },
  {
    id: 'imp97135-plateau-no-extractable-rate',
    holds: () => {
      // At least three ladder-step ratios exceed 1 (plateau/re-acceleration) -> no sustained decaying
      // power; the sequence carries no extractable rate.
      const above1 = IMP97135_RATIOS.filter((r) => r > 1).length;
      return above1 >= 3 && above1 === IMP97135_VERDICT.ratiosExceedingOneCount &&
        IMP97135_VERDICT.decrementsPlateauNotDecay === true &&
        IMP97135_VERDICT.rateExtractable === false &&
        IMP97135_VERDICT.degeneratesLikeImp97120Texponent === true;
    },
    why: 'three of six ladder-step ratios exceed 1, so the decrements plateau rather than decay: no decaying power fits and the compression-defect descent carries no extractable algebraic rate.',
  },
  {
    id: 'imp97135-measurement-only-no-qed',
    holds: () =>
      IMP97135_VERDICT.operatorPositivityProved === false &&
      IMP97135_VERDICT.lowerBoundCertificateProduced === false &&
      IMP97135_VERDICT.boundMoves === false &&
      IMP97135_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97135_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97135_BINDING_2A - LN3) < 1e-12 &&
      IMP97135_VERDICT.qed === false,
    why: 'measurement only: no operator positivity, no lower-bound certificate, no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97135_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97135 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
