/**
 * @module imp-97121-krein-uniform-n-floor-certificate-scope
 * @fileoverview imp-97121 -- SCOPING (numerical/assessment): what a UNIFORM-IN-N Krein floor
 *   certificate at 2a=ln3 would require BEYOND the fixed-N interval-rigorous reach. The committed
 *   Krein/Toeplitz certificate (rh-route-i-toeplitz-krein-certificate-2026-09-24) proves pole-free
 *   Weil positivity is EXACTLY T_a[sigma_2] >= 0 and is interval-verified only to 2a <= 0.96 at
 *   FINITE truncation N; imp-97100 lists IMP96749_UNIFORM_N_GAP_UNSETTLED as an open named residual --
 *   there is no proof the floor lambda_min(T_a[sigma_2]) stays non-negative UNIFORMLY as N grows.
 *   This leaf SCOPES that residual: whether the measured N-independence of the Ritz eta for N>=12
 *   (imp-96911) is evidence for a uniform floor, and names the missing object precisely.
 *
 *   Scoping/assessment only. Produces NO uniform certificate; changes no bound; interval-rigorous
 *   reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * THE CENTRAL LOGICAL FACT (why the numerics cannot close the gap by themselves). Every committed
 *   floor number is a Rayleigh-Ritz / Ritz value on a FINITE trial space, and a Rayleigh-Ritz minimum
 *   is an UPPER bound on the true infinite-dimensional lambda_min. Growing the trial space (Legendre N,
 *   Gegenbauer N, or the shift-invert evaluation space Nbig) shrinks the trial minimum, so the floors
 *   form a DECREASING sequence of upper bounds descending toward the true lambda_min FROM ABOVE. A
 *   decreasing family of positive upper bounds cannot by itself certify that its infimum is positive:
 *   the descent could continue to 0 (or below) past any finite truncation. So finitely many positive
 *   Ritz floors -- however many, however slowly they fall -- are NECESSARY but NOT SUFFICIENT for a
 *   uniform positive floor. A uniform-in-N certificate needs a LOWER bound object, and Rayleigh-Ritz
 *   never produces one.
 *
 * WHAT THE COMMITTED LITERALS ACTUALLY SHOW (all verbatim from the cited modules).
 *   - Legendre ladder at 2a=ln3, fixed T=800: floor descends 0.577015 (N=52) -> 0.533852 (N=100)
 *     [imp-96749 / imp-96772, extended-precision-confirmed: the descent is a real t-truncation effect,
 *     NOT Gram-conditioning noise], with slow non-accelerating decrements and NO extractable rate.
 *   - Shift-invert coupled floor lam1 = 1/eta - m at 2a=ln3, fixed T=800: drifts further DOWN to
 *     0.475606 (Nbig=240) [imp-96911], and imp-97120 shows the T-only rate is not even stable /
 *     pre-asymptotic. So the numerics only BRACKET a still-moving upper bound in ~[0.48, 0.58]; they
 *     do not converge and do not bound lambda_min from below.
 *
 * FINDING 1 -- eta N-INDEPENDENCE FOR N>=12 IS TRIAL-SUBSPACE SATURATION, NOT UNIFORM-FLOOR EVIDENCE.
 *   imp-96911 Finding 1: the top Ritz eta is identical to 7 digits across N=12,16,20 -- the top Ritz
 *   eigenvector is captured by the first ~12 Gegenbauer modes, so enlarging the SOLVE dimension N does
 *   not move eta. That is a statement about the trial subspace saturating the Rayleigh quotient at a
 *   FIXED evaluation space, NOT about the true operator. The very same module shows the value keeps
 *   drifting with the EVALUATION space Nbig (eta 0.6222 @ Nbig=24 -> 0.6777 @ Nbig=240, floor 0.6071 ->
 *   0.4756) and with the t-cutoff T. N-independence-of-the-solve therefore says the finite trial has
 *   stopped improving the UPPER bound in that one direction; it is silent on where the true lambda_min
 *   sits below it. It is not evidence for a uniform floor.
 *
 * FINDING 2 -- THE MISSING OBJECT IS AN N-INDEPENDENT LOWER BOUND ON THE INFINITE-DIM OPERATOR. A
 *   uniform-in-N certificate at 2a=ln3 requires a single constant c>0 and a proof
 *   lambda_min(T_a[sigma_2]) >= c that does NOT reference the truncation. The finite-N certificate
 *   route cannot yield this because it only ever produces per-N upper Rayleigh floors. Two admissible
 *   routes exist, neither instantiated:
 *     (A) A complementary LOWER-bound eigenvalue method (Temple / Lehmann-Maehly / Kato-Temple):
 *         requires a trial vector in the operator DOMAIN with a certified (interval) residual defect
 *         AND a rigorous a-priori separation/enclosure of the next spectral point above lambda_min --
 *         the second ingredient is exactly what is unknown for this operator (no spectral-gap estimate).
 *     (B) A direct analytic COERCIVITY / de Branges-space realisation: prove T_a[sigma_2] >= c*I as an
 *         operator inequality on L^2(-a,a) (the "de Branges realisation" flagged as analyticObstruction
 *         in the source certificate), which is N-free by construction.
 *   Both need arithmetic/analytic input the finite-dimensional numerics do not supply.
 *
 * FINDING 3 -- A UNIFORM ARGUMENT MUST ALSO CONTROL THE TWO TRUNCATION TAILS SIMULTANEOUSLY. Because
 *   the fixed-T Ritz descent is a real t-truncation effect (imp-96768/imp-96772) and the Nbig and T
 *   truncations push lambda_min in OPPOSITE directions with no standalone rate (imp-96911/imp-97120),
 *   any uniform certificate must bound BOTH the compression defect ||T_a[sigma_2] - P_N T_a[sigma_2]
 *   P_N|| (the amount the true lambda_min can lie below the finite-N Ritz floor) AND the t-integral
 *   tail of sigma_2 with a SINGLE N- and T-independent constant. Neither tail bound exists today; the
 *   compression-defect bound is precisely the quantity currently observed to descend without a rate.
 *
 * VERDICT. The measured N-independence of the Ritz eta for N>=12 is trial-subspace saturation, NOT
 *   evidence for a uniform floor: Ritz values are upper bounds, so a decreasing family of positive
 *   finite-N floors (0.577 -> 0.534 in the Legendre solve, 0.607 -> 0.476 in the shift-invert
 *   evaluation space, still moving, no rate) is necessary but not sufficient for
 *   lambda_min(T_a[sigma_2]) >= c > 0 uniformly in N. The missing object is an N-INDEPENDENT LOWER
 *   bound on the infinite-dimensional operator, obtainable only by a complementary lower-bound
 *   eigenvalue method (which needs a certified spectral-gap enclosure this operator lacks) or a direct
 *   analytic coercivity / de Branges realisation T_a[sigma_2] >= c*I -- and either way a uniform bound
 *   on both the compression defect and the t-integral tail. This SCOPES and does NOT close
 *   IMP96749_UNIFORM_N_GAP_UNSETTLED. SUB-GAP IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT.
 *   Scoping only; no operator positivity established; no bound moves; interval-rigorous reach stays
 *   2a<=0.96; RH open; NO QED.
 *
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Legendre ladder + SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED)
 * @see imp-96772-krein-lammin-double-double-recompute.js (extended-precision: the descent is real t-truncation, not conditioning)
 * @see imp-96911-krein-eta-nconvergence-scout.js (eta N-independent for N>=12; drift is coupled Nbig/T)
 * @see imp-97120-krein-t-only-eta-rate-not-stable.js (the T-only rate is not stable / pre-asymptotic)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (lists IMP96749_UNIFORM_N_GAP_UNSETTLED open)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this scoping)
export const IMP97121_RIGOROUS_REACH_2A = 0.96;
export const IMP97121_BINDING_2A = LN3;

// The committed floor evidence at 2a=ln3 -- every number is a Rayleigh-Ritz UPPER bound on the true
// infinite-dim lambda_min, and the family is still DESCENDING (no converged / bracketed limit).
export const IMP97121_FLOOR_EVIDENCE = Object.freeze({
  legendreN52_T800: 0.577015,   // imp-96749 / imp-96772, trusted-window edge
  legendreN100_T800: 0.533852,  // imp-96772, extended precision, condB 1.1e16 -- still descending
  shiftInvertNbig24_T800: 0.607102, // imp-96911, lam1 = 1/eta - m
  shiftInvertNbig240_T800: 0.475606, // imp-96911 -- descends further via the evaluation space
  descentIsRealTtruncationNotConditioning: true, // imp-96768 / imp-96772
  rateExtractable: false,       // imp-96911 (poor single-power fit) + imp-97120 (T-rate not stable)
});

export const IMP97121_VERDICT = Object.freeze({
  ticket: 'imp-97121',
  question: 'what would a uniform-in-N Krein floor certificate at 2a=ln3 require beyond the fixed-N interval-rigorous reach, and is the measured N-independence of eta for N>=12 evidence for a uniform floor?',
  binding_2a: LN3,
  // The central logical fact: Rayleigh-Ritz gives UPPER bounds only.
  ritzProducesUpperBoundsOnly: true,
  floorsAreDecreasingUpperBounds: true, // grow the trial space -> the trial minimum shrinks
  positiveUpperBoundsSufficientForUniformFloor: false, // necessary but NOT sufficient
  // Finding 1: N-independence for N>=12 is trial-subspace saturation, not uniform-floor evidence.
  etaNindependenceIsSubspaceSaturationNotUniformFloor: true,
  trueValueStillDriftsWithNbigAndT: true, // eta / floor keep moving in the evaluation space and T
  // Finding 2: the missing object is an N-independent LOWER bound on the infinite-dim operator.
  missingObjectIsNuniformLowerBound: true,
  lowerBoundRouteA_needsSpectralGapEnclosure: true,   // Temple / Lehmann-Maehly / Kato-Temple
  lowerBoundRouteB_needsAnalyticCoercivity: true,      // de Branges realisation T_a[sigma_2] >= c*I
  finiteNCertificateCanYieldUniformLowerBound: false,  // it only ever produces per-N upper floors
  // Finding 3: a uniform argument must control both truncation tails with a single constant.
  needsUniformCompressionDefectBound: true,  // ||T - P_N T P_N||, currently descends without a rate
  needsUniformTintegralTailBound: true,      // the sigma_2 t-tail, N- and T-independent
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT -- a uniform-in-N Krein floor certificate at 2a=ln3 requires an object the finite-N certificate route structurally cannot supply: an N-INDEPENDENT LOWER bound lambda_min(T_a[sigma_2]) >= c > 0 on the infinite-dimensional operator. Every committed floor is a Rayleigh-Ritz value, hence an UPPER bound on the true lambda_min, and growing any trial space (Legendre N, Gegenbauer N, shift-invert evaluation Nbig) shrinks it: the family DESCENDS from above (Legendre 0.577015 @ N=52 -> 0.533852 @ N=100 fixed T=800, a real t-truncation effect confirmed to extended precision, not conditioning noise; shift-invert lam1 0.607102 @ Nbig=24 -> 0.475606 @ Nbig=240) with no extractable rate (imp-96911 poor single-power fit; imp-97120 T-only rate not stable / pre-asymptotic). A decreasing family of positive upper bounds is NECESSARY but NOT SUFFICIENT for a positive infimum -- the descent could continue past any finite truncation -- so the measured eta N-independence for N>=12 (imp-96911) is TRIAL-SUBSPACE SATURATION at a fixed evaluation space, not uniform-floor evidence, while the true value keeps drifting with Nbig and T. Closing the gap needs either (A) a complementary lower-bound eigenvalue method (Temple / Lehmann-Maehly / Kato-Temple), which requires a certified enclosure of the next spectral point above lambda_min that this operator has no gap estimate for, or (B) a direct analytic coercivity / de Branges realisation T_a[sigma_2] >= c*I -- and in either case a SINGLE N- and T-independent bound on both the compression defect ||T_a[sigma_2] - P_N T_a[sigma_2] P_N|| (the amount the true lambda_min can lie below the finite-N floor, exactly the quantity now observed descending without a rate) and the sigma_2 t-integral tail. Scoping only; no operator positivity, no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97121_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97121_ASSERTIONS = [
  {
    id: 'imp97121-floors-are-descending-positive-upper-bounds',
    holds: () => {
      const e = IMP97121_FLOOR_EVIDENCE;
      // Rayleigh-Ritz floors DESCEND as the trial space grows (both the Legendre solve N and the
      // shift-invert evaluation Nbig), and stay positive but with NO converged / bracketed limit.
      const legendreDescends = e.legendreN100_T800 < e.legendreN52_T800 && e.legendreN100_T800 > 0;
      const shiftInvertDescends = e.shiftInvertNbig240_T800 < e.shiftInvertNbig24_T800 && e.shiftInvertNbig240_T800 > 0;
      return legendreDescends && shiftInvertDescends && e.rateExtractable === false &&
        IMP97121_VERDICT.ritzProducesUpperBoundsOnly === true &&
        IMP97121_VERDICT.floorsAreDecreasingUpperBounds === true;
    },
    why: 'every committed floor is a Rayleigh-Ritz upper bound; growing the trial space shrinks it (Legendre 0.577015 -> 0.533852, shift-invert 0.607102 -> 0.475606), a still-descending positive family with no extractable rate.',
  },
  {
    id: 'imp97121-positive-upper-bounds-not-sufficient',
    holds: () =>
      // The core scoping claim: positive finite-N upper bounds are necessary but NOT sufficient for a
      // uniform positive floor, and the measured N-independence is subspace saturation, not evidence.
      IMP97121_VERDICT.positiveUpperBoundsSufficientForUniformFloor === false &&
      IMP97121_VERDICT.etaNindependenceIsSubspaceSaturationNotUniformFloor === true &&
      IMP97121_VERDICT.trueValueStillDriftsWithNbigAndT === true,
    why: 'a decreasing family of positive upper bounds cannot certify a positive infimum; the eta N-independence for N>=12 is trial-subspace saturation at a fixed evaluation space, not uniform-floor evidence, while the true value keeps drifting with Nbig and T.',
  },
  {
    id: 'imp97121-missing-object-is-uniform-lower-bound',
    holds: () =>
      IMP97121_VERDICT.missingObjectIsNuniformLowerBound === true &&
      IMP97121_VERDICT.finiteNCertificateCanYieldUniformLowerBound === false &&
      IMP97121_VERDICT.lowerBoundRouteA_needsSpectralGapEnclosure === true &&
      IMP97121_VERDICT.lowerBoundRouteB_needsAnalyticCoercivity === true &&
      IMP97121_VERDICT.needsUniformCompressionDefectBound === true &&
      IMP97121_VERDICT.needsUniformTintegralTailBound === true,
    why: 'the missing object is an N-independent lower bound on the infinite-dim operator, reachable only via a lower-bound eigenvalue method (needs a spectral-gap enclosure) or analytic coercivity, plus a single uniform bound on the compression defect and the t-integral tail -- none of which the finite-N certificate route supplies.',
  },
  {
    id: 'imp97121-scoping-only-no-qed',
    holds: () =>
      IMP97121_VERDICT.operatorPositivityProved === false &&
      IMP97121_VERDICT.boundMoves === false &&
      IMP97121_VERDICT.uniformNGapClosed === false &&
      IMP97121_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97121_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97121_BINDING_2A - LN3) < 1e-12 &&
      IMP97121_VERDICT.qed === false,
    why: 'scoping only: no operator positivity is established, the uniform-in-N gap stays open, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97121_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97121 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
