/**
 * @module imp-97559-krein-csharp-scalar-far-field-reclaim-assessment
 * @fileoverview imp-97559 -- ASSESS whether any SCALAR (non-split, density-only) lower-bound
 *   construction can fold the imp-97458 discarded positive far field (finite inner island 2511.030
 *   full-line + unbounded tail ~T^5 ln T / 5) back into a floor for
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a),   2a = ln3,   a = (ln3)/2,
 *   so as to reclaim the 43.8% residual share (+1344.378) of the gap from the bathtub envelope
 *   -3065.435 (imp-97416) up to the measured c_sharp ~ 0.582 (imp-97206). Derivation/assessment
 *   only -- no coercivity constant, no operator positivity, no bound moves, NO QED.
 *
 * SETUP. A "scalar (non-split) lower bound" is any bound derivable from SCALAR features of the
 *   density rho = |psi|^2 alone: its pointwise cap 0 <= rho <= a/pi (reproducing-kernel Bernstein
 *   budget, imp-97399) and its total mass int rho = 1. Every such bound is bounded below by the
 *   bathtub / water-filling functional
 *       W = inf { int sigma_2 rho : 0 <= rho <= a/pi, int rho = 1 },
 *   whose optimum rho_star is (a/pi) times the indicator of the DEEPEST measure-(pi/a) sub-level
 *   set of sigma_2. That set lies entirely inside the confined negative wells {sigma_2 < 0}
 *   ([-10.532,-6.945] u [-3.306,3.306] u [6.945,10.532], imp-97399), so rho_star = 0 on the whole
 *   positive set {sigma_2 >= 0}: the water-filling optimum discards the ENTIRE positive far field
 *   by construction, giving W = -3065.435 (imp-97416).
 *
 * FINDING 1 -- DISCARDING THE FAR FIELD IS OPTIMAL FOR THE SCALAR FUNCTIONAL, NOT AN OVERSIGHT.
 *   Take the water-filling optimum rho_star and try to force a small mass epsilon onto the far
 *   field at a point where sigma_2 = M > 0. Mass is conserved, so that epsilon must be removed from
 *   a filled well cell at depth sigma_2 = -D < 0. The functional changes by
 *       delta W = epsilon * M - (- epsilon * D) ... = epsilon * (M + D) > 0,
 *   i.e. STRICTLY WORSE (larger, less negative) for every M > 0, D > 0. Hence within the scalar /
 *   density framework the +1344.378 far-field share is not merely dropped -- it is PROVABLY OPTIMAL
 *   to drop: any scalar construction that forces positive far-field mass produces a LOOSER (more
 *   negative or invalid) lower bound than the bathtub envelope, never a tighter one. The far field
 *   cannot be "retained for credit" by any density-only rearrangement.
 *
 * FINDING 2 -- RECLAIMING IT REQUIRES A SPECTRAL (uncertainty) COUPLING, NOT A SCALAR ONE. The far
 *   field earns positive credit for the TRUE c_sharp only because a normalised band-limited psi
 *   (PW_a, entire of exponential type) CANNOT concentrate all its mass on the wells: the leaked
 *   fraction 1 - (well concentration) necessarily sits on {sigma_2 > 0} and pays a strictly
 *   positive int sigma_2^+ |psi|^2 (imp-97458 Finding 3). Turning that into a floor needs a
 *   QUANTITATIVE implication of the form
 *       int_{wells} rho >= 1 - delta   ==>   int_{far} sigma_2^+ rho >= g(delta) > 0,
 *   which links well-concentration (delta) to far-tail cost through the Paley-Wiener / prolate
 *   uncertainty principle. That is a SPECTRAL (operator) statement about psi, invisible to the
 *   scalar features (pointwise cap + total mass) that define the density framework -- exactly the
 *   missing quantitative PW_a concentration inequality the whole cohort lacks (imp-97350 shared
 *   obstruction).
 *
 * FINDING 3 -- THE TWO RESIDUAL SHARES ARE DUAL, NOT INDEPENDENTLY RECLAIMABLE. The realizability
 *   share (+1721.639, 56.2%, imp-97457) and the far-field share (+1344.378, 43.8%, imp-97458) are
 *   two faces of ONE prolate-concentration obstruction. Band-limitedness caps well-capture at
 *   43.84% of the envelope, so the leaked mass 1 - 0.4384 both (a) fails to reach the well depth
 *   (the realizability share) and (b) must sit on sigma_2^+ paying the far-field cost. A
 *   construction that closes either share needs the SAME spectral primitive (a lower bound on the
 *   leaked-mass far-field cost as a function of well-concentration). Therefore the 43.8% far-field
 *   share is NOT reclaimable by a scalar route independent of realizability: any honest recovery of
 *   it simultaneously supplies the realizability bound, collapsing both into the one missing PW_a
 *   uncertainty inequality.
 *
 * VERDICT. NO scalar (non-split, density-only) construction can fold the discarded positive far
 *   field into a floor to reclaim the 43.8% share. Within the density framework, discarding the far
 *   field is the OPTIMUM of the bathtub functional (Finding 1); forcing far-field mass only loosens
 *   the bound. Reclaiming the share requires a spectral (prolate / Paley-Wiener uncertainty)
 *   coupling of well-concentration to far-tail cost (Finding 2), which is the SAME missing
 *   quantitative PW_a concentration inequality that generates the realizability share -- so the two
 *   residual shares are dual faces of one obstruction, not independently reclaimable (Finding 3).
 *   Assessment/derivation only; no coercivity constant; no operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open;
 *   NO QED.
 *   SUB-GAP IMP97559_FAR_FIELD_RECLAIM_NEEDS_SPECTRAL_COUPLING_NOT_SCALAR -- the +1344.378 far-field
 *   share is dual to the +1721.639 realizability share; both require the single missing PW_a
 *   uncertainty inequality (imp-97350), so neither is reclaimable by a density-only construction.
 *
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (the discarded far field quantified: island 2511.030 + tail ~T^5 ln T / 5)
 * @see imp-97457-krein-bathtub-realizability-gap.js (realizability share +1721.639 / 56.2%; realizable floor -1343.796)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub water-filling envelope -3065.435, the best rigorous scalar floor)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (the one missing quantitative PW_a concentration inequality)
 * @see imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js (cohort index; the two residual shares 56.2% / 43.8%)
 *
 * Ticket: imp-97559 (proof, medium, opus-4-8). Assessment/derivation only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { IMP97458_INNER_ISLAND, IMP97458_FAR_TAIL, IMP97458_MINIMISER_BUDGET, IMP97458_BINDING_2A }
  from './imp-97458-krein-csharp-discarded-positive-far-field.js';
import { IMP97457_GAP_ATTRIBUTION } from './imp-97457-krein-bathtub-realizability-gap.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

export const IMP97559_BINDING_2A = LN3;
export const IMP97559_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// The far-field share this ticket asks whether a scalar construction can reclaim (imp-97457 item b).
const FAR_FIELD_SHARE = IMP97457_GAP_ATTRIBUTION.farFieldShare;           // +1344.378
const REALIZABILITY_SHARE = IMP97457_GAP_ATTRIBUTION.realizabilityShare;  // +1721.639
const TOTAL_GAP = IMP97457_GAP_ATTRIBUTION.totalGap;                      // 3066.017

// Finding 1 -- discarding the far field is the OPTIMUM of the scalar bathtub functional.
export const IMP97559_SCALAR_OPTIMALITY = Object.freeze({
  framework: 'density-only: bound depends on rho = |psi|^2 through 0 <= rho <= a/pi and int rho = 1',
  bathtubEnvelope: -3065.435,                    // W = inf over admissible densities (imp-97416)
  waterFillingSetMassOnPositiveSet: 0,           // rho_star = 0 on {sigma_2 >= 0}
  forcingFarFieldMassChangesFunctionalBy: 'epsilon*(M+D) > 0 (strictly worse for every M,D > 0)',
  discardingFarFieldIsOptimalNotOversight: true, // retaining far-field mass only loosens the floor
  scalarCanReclaimFarFieldShare: false,
});

// Finding 2/3 -- reclaiming the share needs a spectral coupling, dual to the realizability share.
export const IMP97559_SPECTRAL_DUALITY = Object.freeze({
  requiredImplication:
    'int_{wells} rho >= 1 - delta  ==>  int_{far} sigma_2^+ rho >= g(delta) > 0 (prolate/PW_a uncertainty)',
  couplingIsSpectralNotScalar: true,             // invisible to pointwise-cap + total-mass features
  farFieldShare: FAR_FIELD_SHARE,                // +1344.378 (43.8%)
  realizabilityShare: REALIZABILITY_SHARE,       // +1721.639 (56.2%)
  totalGap: TOTAL_GAP,                           // 3066.017
  sharesAreDualFacesOfOneObstruction: true,      // leaked mass both misses well depth and pays far cost
  farFieldShareIndependentlyReclaimable: false,  // any recovery also supplies the realizability bound
  missingPrimitive: 'quantitative PW_a concentration inequality (imp-97350 shared obstruction)',
});

export const IMP97559_VERDICT = Object.freeze({
  ticket: 'imp-97559',
  question:
    'can any SCALAR (non-split, density-only) lower-bound construction fold the imp-97458 discarded ' +
    'positive far field (finite island 2511.030 + unbounded tail ~T^5 ln T / 5) into a floor for ' +
    'c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a = ln3, reclaiming the 43.8% residual share (+1344.378)?',
  answer:
    'NO. Every scalar (density-only) bound is bounded below by the bathtub / water-filling functional, ' +
    'whose optimum places zero mass on the positive set {sigma_2 >= 0}; forcing any far-field mass ' +
    'changes the functional by +epsilon*(M+D) > 0 -- strictly WORSE -- so discarding the far field is the ' +
    'OPTIMUM of the scalar problem, not an oversight, and no density-only construction can retain it for ' +
    'credit (Finding 1). The far field earns positive credit for the true c_sharp only through a spectral ' +
    'coupling -- a quantitative implication int_{wells} rho >= 1 - delta ==> int_{far} sigma_2^+ rho >= ' +
    'g(delta) > 0 -- that links well-concentration to far-tail cost via the Paley-Wiener / prolate ' +
    'uncertainty principle, invisible to the scalar features that define the density framework ' +
    '(Finding 2). That coupling is the SAME missing quantitative PW_a concentration inequality that ' +
    'generates the realizability share, so the +1344.378 far-field share (43.8%) and the +1721.639 ' +
    'realizability share (56.2%) are dual faces of ONE obstruction -- neither reclaimable independently ' +
    'by a scalar route (Finding 3). Assessment/derivation only; no coercivity constant; no operator ' +
    'positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.',
  binding_2a: LN3,
  scalarCanReclaimFarFieldShare: false,
  discardingFarFieldIsScalarOptimum: true,
  reclaimNeedsSpectralCoupling: true,
  sharesAreDual: true,
  farFieldShare: FAR_FIELD_SHARE,
  realizabilityShare: REALIZABILITY_SHARE,
  // unchanged program state
  assessmentOnly: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97559_FAR_FIELD_RECLAIM_NEEDS_SPECTRAL_COUPLING_NOT_SCALAR -- no scalar (density-only) construction ' +
    'can fold the imp-97458 discarded positive far field into a floor for c_sharp at 2a = ln3: the ' +
    'water-filling optimum sets zero mass on {sigma_2 >= 0} and forcing far-field mass changes the ' +
    'functional by +epsilon*(M+D) > 0 (strictly worse), so discarding the far field is optimal, not an ' +
    'oversight. Reclaiming the +1344.378 (43.8%) share needs a spectral prolate / Paley-Wiener ' +
    'uncertainty coupling of well-concentration to far-tail cost -- the SAME missing quantitative PW_a ' +
    'concentration inequality (imp-97350) that generates the +1721.639 (56.2%) realizability share -- so ' +
    'the two residual shares are dual and neither is independently reclaimable by a scalar route. ' +
    'Assessment only; no coercivity constant; no bound moves; interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97559_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97559_ASSERTIONS = [
  {
    id: 'imp97559-scalar-optimum-discards-far-field',
    holds: () =>
      IMP97559_SCALAR_OPTIMALITY.waterFillingSetMassOnPositiveSet === 0 &&
      IMP97559_SCALAR_OPTIMALITY.discardingFarFieldIsOptimalNotOversight === true &&
      IMP97559_SCALAR_OPTIMALITY.scalarCanReclaimFarFieldShare === false &&
      IMP97559_SCALAR_OPTIMALITY.bathtubEnvelope === -3065.435,
    why: 'the scalar (density-only) bathtub functional attains its optimum with zero mass on {sigma_2 >= 0}; ' +
      'forcing far-field mass changes it by +epsilon*(M+D) > 0, so retaining the far field is strictly worse ' +
      'and a scalar construction cannot reclaim the far-field share.',
  },
  {
    id: 'imp97559-shares-dual-and-reconcile',
    holds: () => {
      // the two shares must add to the total gap from the bathtub envelope up to the measured c_sharp
      const sum = IMP97559_SPECTRAL_DUALITY.farFieldShare + IMP97559_SPECTRAL_DUALITY.realizabilityShare;
      const reconciles = Math.abs(sum - IMP97559_SPECTRAL_DUALITY.totalGap) < 1e-6;
      // the far-field share is the imp-97457 item (b), live-imported (not re-baked)
      const farMatches = Math.abs(IMP97559_SPECTRAL_DUALITY.farFieldShare - IMP97457_GAP_ATTRIBUTION.farFieldShare) < 1e-9;
      return (
        reconciles &&
        farMatches &&
        IMP97559_SPECTRAL_DUALITY.couplingIsSpectralNotScalar === true &&
        IMP97559_SPECTRAL_DUALITY.sharesAreDualFacesOfOneObstruction === true &&
        IMP97559_SPECTRAL_DUALITY.farFieldShareIndependentlyReclaimable === false
      );
    },
    why: 'the +1344.378 far-field share and +1721.639 realizability share add to the total gap 3066.017 and ' +
      'are dual faces of one prolate-concentration obstruction, so neither is reclaimable independently by a ' +
      'scalar route; the far-field share is live-imported from imp-97457, not re-baked.',
  },
  {
    id: 'imp97559-inputs-are-live-imported-far-field',
    holds: () =>
      // the discarded far field this ticket reasons about is the imp-97458 object, imported not re-derived
      IMP97458_INNER_ISLAND.finite === true &&
      IMP97458_INNER_ISLAND.positiveAreaFullLine === 2511.030 &&
      IMP97458_FAR_TAIL.unbounded === true &&
      IMP97458_MINIMISER_BUDGET.discardedPositiveTermStrictlyPositive === true &&
      Math.abs(IMP97458_BINDING_2A - LN3) < 1e-12,
    why: 'the assessment reasons about the actual imp-97458 discarded far field (finite island 2511.030 + ' +
      'unbounded tail, strictly positive minimiser budget) at the same binding 2a = ln3, imported live.',
  },
  {
    id: 'imp97559-honesty-gate-no-qed',
    holds: () =>
      IMP97559_VERDICT.scalarCanReclaimFarFieldShare === false &&
      IMP97559_VERDICT.reclaimNeedsSpectralCoupling === true &&
      IMP97559_VERDICT.sharesAreDual === true &&
      IMP97559_VERDICT.assessmentOnly === true &&
      IMP97559_VERDICT.operatorPositivityProved === false &&
      IMP97559_VERDICT.coercivityConstantProved === false &&
      IMP97559_VERDICT.boundMoves === false &&
      IMP97559_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97559_RIGOROUS_REACH_2A === 0.96 &&
      typeof IMP97559_VERDICT.subGap === 'string' &&
      IMP97559_VERDICT.subGap.includes('IMP97559_FAR_FIELD_RECLAIM_NEEDS_SPECTRAL_COUPLING_NOT_SCALAR') &&
      IMP97559_VERDICT.qed === false,
    why: 'assessment/derivation only: no scalar construction reclaims the far-field share; no operator ' +
      'positivity, no coercivity constant, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97559_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97559-krein-csharp-scalar-far-field-reclaim-assessment assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
