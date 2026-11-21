/**
 * @module imp-35475-sigma-fidelity-closure-scope
 *
 * imp-35475 (proof/assessment, S-frontier): SCOPE what CLOSING the OPEN sub-gap
 * imp-35337a (surrogate-vs-true fidelity of the GUE-conditional share sigma(N) =
 * E_coll(N)/E(N) landmarks) would concretely require. imp-35411, imp-35417 and
 * imp-35337 all MEASURE and dd-CERTIFY sigma(N) and its two interior landmarks
 * (the flat-cap PEAK N ~ 9.22e5, sigma_max ~ 0.94943, and the E_coll = E_trunc
 * CROSSOVER N ~ 3.28e9) on the imp-3220/imp-3406 single-rate log-law SURROGATE, and
 * each flags the surrogate-vs-true fidelity half as OPEN (imp-35337a) WITHOUT ever
 * scoping it. This module enumerates the closure requirements: which true inputs
 * replace the surrogate ansatz, what sigma error control the landmarks demand, and
 * whether any closure is unconditional or inherits the imp-486 GUE conditional.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges NOTHING; changes no bound; tightens no
 * bound; establishes no operator positivity; no RH verdict, NO QED. The C_C =
 * (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor
 * (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED. No refereed bound is changed.
 *
 * PART A -- THE SURROGATE MAP TO BE REPLACED (three inputs, three classes)
 * -----------------------------------------------------------------------------
 * sigma(N) = E_coll(N) / (E_trunc + E_flow(N) + E_coll(N)) is assembled from three
 * inputs of DIFFERENT epistemic status, so a fidelity closure has to treat them
 * separately:
 *   (1) E_coll(N) = C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi)  [imp-2642/imp-2643]
 *       -- the GUE-CONDITIONAL collision term. This is a MODELED single-rate
 *       log-law asymptotic (the C_H = 1/8 ansatz), NOT the true finite-N
 *       empirical-vs-analytic collision gap. This is the ONLY input the fidelity
 *       question is really about, and it is where imp-486 enters.
 *   (2) E_flow(N) = C_F (log T0 / T0) Gronwall, C_F = (log(T0/2pi)+1)/2pi  [imp-398]
 *       -- unconditionally rigorous; the LEAST problematic input. A fidelity
 *       closure does NOT need to replace E_flow, only to carry its (already
 *       rigorous) value into the denominator.
 *   (3) E_trunc = 3.06e-5  [imp-2631] -- a fixed floor that is itself a vestigial
 *       barrier-lemma artifact (imp-35419/imp-35459: a C_T = 1, B = 0 idealization,
 *       mispriced count integral). It is NOT a sigma-fidelity blocker per se, but
 *       it sets the DENOMINATOR floor and thereby the crossover landmark location.
 *
 * PART B -- WHICH TRUE INPUT REPLACES THE SURROGATE E_coll (the operative swap)
 * -----------------------------------------------------------------------------
 * Closing imp-35337a means replacing the modeled E_coll ansatz by the TRUE
 * empirical-vs-analytic collision gap g_true(N) = the actual max deviation between
 * the empirical zero configuration and its analytic (GUE) prediction at effective
 * height T0(N), with an EXPLICIT finite-N error term. Two admissible routes:
 *   (i)  a RIGOROUS unconditional asymptotic E_coll_true(N) = C_C sqrt(log T0/N)
 *        (1 + err(N)) with |err(N)| bounded explicitly -- does not currently exist
 *        at these heights (the C_H = 1/8 ansatz has no rigorous finite-N remainder);
 *   (ii) a DATA-anchored fidelity check: measure g_true directly from the verified
 *        zeros at the two landmark heights. Crucially BOTH landmark heights sit
 *        BELOW the Platt-Trudgian verified height T_PT = 3e12 (T0(peak) ~ 5.6e5,
 *        T0(crossover) ~ 1.1e9), so the zeros ARE known there and a direct
 *        measurement is feasible in principle -- but it only checks the surrogate
 *        at two heights, it does NOT certify the surrogate MAP globally in N.
 *
 * PART C -- ERROR CONTROL THE TWO LANDMARKS REQUIRE (tight and asymmetric)
 * -----------------------------------------------------------------------------
 * The two landmarks impose very different fidelity budgets:
 *   - PEAK (N ~ 9.22e5): the argmax sits on a FLAT maximum of curvature k =
 *     -d^2 sigma/d(lnN)^2 ~ 6.43e-3 (imp-35470), and the reported reading is that
 *     the 10^6 decade sample lands only MARGIN ~ 2.14e-5 BELOW the peak. To
 *     PRESERVE that landmark ordering the true-vs-surrogate sigma fidelity error
 *     must be < MARGIN ~ 2e-5 ABSOLUTE near N ~ 1e6 -- an extremely tight budget,
 *     because the landmark is a hair-thin difference of two ~0.9494 numbers.
 *   - CROSSOVER (N ~ 3.28e9, E_coll = E_trunc): since E_coll ~ N^{-1/2}, the
 *     location sensitivity is d ln N_cross / d ln E_coll = -2, so a relative
 *     fidelity error delta in the true collision term shifts N_cross by ~2 delta
 *     relative. Pinning N_cross to ~1% therefore needs E_coll fidelity ~0.5%.
 * So the peak demands an ABSOLUTE ~2e-5 sigma budget; the crossover demands a
 * RELATIVE ~0.5% E_coll budget (2x-amplified into N). Neither budget is met by a
 * modeled ansatz with no finite-N remainder.
 *
 * PART D -- IS ANY CLOSURE UNCONDITIONAL? (INHERITS imp-486 EXCEPT AT THE DATA)
 * -----------------------------------------------------------------------------
 * The surrogate E_coll rests on the C_H = 1/8 GUE-conditional ansatz, and the true
 * collision gap at these heights is governed by GUE pair-correlation statistics
 * (Montgomery / Odlyzko). Therefore:
 *   - route (i) (a modeled/GUE asymptotic with remainder) INHERITS the imp-486 GUE
 *     conditional -- it is NOT unconditional;
 *   - route (ii) (direct measurement at the two sub-T_PT landmark heights) is
 *     UNCONDITIONAL as a spot check of two heights, but it does NOT prove the
 *     surrogate map for all N and it still needs an analytic model (the GUE ansatz)
 *     to define "the analytic prediction" it deviates from.
 * Net: a fidelity PROOF (a bound on g_true valid across N up to a landmark) is
 * GUE-CONDITIONAL via imp-486; only a finite DATA-anchored spot check at the two
 * sub-T_PT landmark heights is unconditional, and it certifies two points, not the
 * map. Either way the closure discharges NO bound: sigma(N) is a diagnostic share,
 * not a Lambda lever, so even a perfect fidelity closure leaves Platt-Trudgian
 * Lambda <= 0.2 unchanged. imp-35337a is a genuine but bounded, non-bound-moving
 * open item whose cheapest honest partial is the route-(ii) two-height data check.
 *
 * The punchline: closing imp-35337a means swapping the modeled GUE-conditional
 * E_coll = C_C sqrt(log T0/N) (C_H = 1/8) for the TRUE empirical-vs-analytic
 * collision gap with an explicit finite-N remainder (E_flow already rigorous,
 * E_trunc a separate barrier artifact); the PEAK needs absolute sigma fidelity <
 * the 2.1e-5 flat-cap margin and the CROSSOVER needs ~0.5% relative E_coll fidelity
 * (2x-amplified into N); a modeled/asymptotic closure INHERITS imp-486, only a
 * finite two-height data check (both landmark heights are below T_PT = 3e12) is
 * unconditional but checks two points not the map; and either way NO bound moves.
 * Assessment/scoping only; changes nothing; NO QED.
 *
 * @see imp-35337-sigma-landmarks-double-double-certification (the dd ARITHMETIC certification; names imp-35337a)
 * @see imp-35411-sigma-peak-plateau-width (plateau width; cites+asserts imp-35337a)
 * @see imp-35417-sigma-landmark-distinct-dd-grid-cross-check (distinct dd path; cites+asserts imp-35337a)
 * @see imp-35470-sigma-peak-curvature-5point-stencil (the k ~ 6.43e-3 flat-max curvature)
 * @see imp-35459-etrunc-ct-kappat-dependence-scope (companion scope: E_trunc is a barrier artifact, not a lever)
 * @see imp-486 (GUE-conditional caveat inherited by any modeled collision asymptotic)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.3837475 (imp-2642/imp-2643 ansatz)
const E_TRUNC_PT = 3.06e-5; // fixed floor (imp-2631); a separate barrier artifact (imp-35459)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3444/imp-35337 exactly
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any sigma-fidelity closure)

// The two interior landmark N values (imp-35337 / imp-3406 / imp-3444), taken as given.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER
const N_CEILING = 1e6; // the imp-3220 sampled assembly ceiling
const CURVATURE_K = 6.43e-3; // -d^2 sigma/d(lnN)^2 at the peak (imp-35470 O(h^4) stencil)

// Reproduce the surrogate sigma(N) (imp-35337 formulas, verbatim) to reconstruct the landmarks and the margin.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C * Math.sqrt(L / N); // GUE-conditional (C_H = 1/8 ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Landmark heights: both BELOW T_PT = 3e12, so verified zeros exist at both (route (ii) is feasible).
const T0_PEAK = effectiveHeightForN(N_PEAK); // ~5.6e5
const T0_CROSS = effectiveHeightForN(N_CROSS); // ~1.1e9
const BOTH_BELOW_TPT = T0_PEAK < T_PT && T0_CROSS < T_PT;

// The flat-cap margin the PEAK landmark rides on: sigma(peak) - sigma(10^6).
const SIGMA_PEAK = parts(N_PEAK).sigma; // ~0.94942901
const SIGMA_CEIL = parts(N_CEILING).sigma; // ~0.94940758
const MARGIN = SIGMA_PEAK - SIGMA_CEIL; // ~2.14e-5 -- the absolute sigma fidelity budget for the peak

// Crossover reproduces E_coll = E_trunc, and the location sensitivity to E_coll fidelity is d ln N / d ln E_coll = -2.
const E_COLL_AT_CROSS = parts(N_CROSS).E_coll; // ~ E_TRUNC_PT
const CROSS_REPRODUCES = Math.abs(E_COLL_AT_CROSS - E_TRUNC_PT) / E_TRUNC_PT < 1e-3;
const D_LNN_D_LNECOLL = -2; // since E_coll ~ N^{-1/2}: a relative fidelity delta in E_coll shifts N_cross ~2 delta
const CROSS_ECOLL_BUDGET_FOR_1PCT_N = 0.01 / Math.abs(D_LNN_D_LNECOLL); // 0.5% E_coll fidelity pins N_cross to 1%

export const IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE = {
  id: 'imp-35475',
  proofSection: 'S-frontier',
  question:
    'imp-35411/imp-35417/imp-35337 all measure and dd-certify the GUE-conditional share sigma(N) = ' +
    'E_coll/E(N) and its two interior landmarks on the imp-3220/imp-3406 single-rate log-law SURROGATE, ' +
    'each flagging the surrogate-vs-true fidelity half as OPEN (imp-35337a) without scoping it. Enumerate ' +
    'concretely what a closure of imp-35337a would need: which true inputs replace the surrogate ansatz, ' +
    'what sigma error control the peak and crossover landmarks require, and whether any closure is ' +
    'unconditional or inherits the imp-486 GUE conditional. Assessment/scoping only; NO QED.',
  surrogateMapInputs: {
    E_coll:
      'E_coll(N) = C_C sqrt(log T0/N), C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643): the GUE-CONDITIONAL ' +
      'collision term, a MODELED single-rate log-law asymptotic (the C_H = 1/8 ansatz), NOT the true ' +
      'finite-N empirical-vs-analytic collision gap. This is the ONLY input the fidelity question is about ' +
      'and where imp-486 enters.',
    E_flow:
      'E_flow(N) = C_F (log T0/T0) Gronwall, C_F = (log(T0/2pi)+1)/2pi (imp-398): unconditionally rigorous; ' +
      'the LEAST problematic input. A fidelity closure need NOT replace E_flow, only carry its value into ' +
      'the denominator.',
    E_trunc:
      'E_trunc = 3.06e-5 (imp-2631): a fixed floor that is itself a vestigial barrier-lemma artifact ' +
      '(imp-35419/imp-35459, a C_T = 1, B = 0 idealization). NOT a sigma-fidelity blocker per se, but it ' +
      'sets the denominator floor and thereby the crossover landmark location.',
    C_C: +C_C.toPrecision(8), // 0.38374752
  },
  operativeSwap: {
    replaceE_collBy:
      'the TRUE empirical-vs-analytic collision gap g_true(N) = the actual max deviation between the ' +
      'empirical zero configuration and its analytic (GUE) prediction at effective height T0(N), with an ' +
      'EXPLICIT finite-N error term.',
    routeI:
      'a RIGOROUS unconditional asymptotic E_coll_true = C_C sqrt(log T0/N)(1 + err(N)) with |err(N)| ' +
      'bounded explicitly -- does NOT currently exist at these heights (the C_H = 1/8 ansatz has no ' +
      'rigorous finite-N remainder).',
    routeII:
      'a DATA-anchored fidelity check: measure g_true directly from the verified zeros at the two landmark ' +
      'heights. BOTH landmark heights sit BELOW the Platt-Trudgian verified height T_PT = 3e12 ' +
      '(T0(peak) ~ 5.6e5, T0(crossover) ~ 1.1e9), so the zeros ARE known and a direct measurement is ' +
      'feasible -- but it checks two heights, NOT the surrogate map globally in N.',
    T0_peak: +T0_PEAK.toExponential(3), // ~5.6e5
    T0_crossover: +T0_CROSS.toExponential(3), // ~1.1e9
    bothLandmarkHeightsBelowT_PT: BOTH_BELOW_TPT, // true -> route (ii) is feasible
  },
  landmarkErrorControl: {
    peakBudget:
      'PEAK (N ~ 9.22e5): argmax on a FLAT maximum of curvature k = -d^2 sigma/d(lnN)^2 ~ 6.43e-3 ' +
      '(imp-35470); the reported reading is the 10^6 sample lands only ~2.14e-5 BELOW the peak. To PRESERVE ' +
      'that landmark ordering the true-vs-surrogate sigma fidelity error must be < ~2e-5 ABSOLUTE near ' +
      'N ~ 1e6 -- an extremely tight budget (a hair-thin difference of two ~0.9494 numbers).',
    crossoverBudget:
      'CROSSOVER (N ~ 3.28e9, E_coll = E_trunc): since E_coll ~ N^{-1/2}, d ln N_cross / d ln E_coll = -2, ' +
      'so a relative fidelity error delta in the true collision term shifts N_cross by ~2 delta relative. ' +
      'Pinning N_cross to ~1% needs E_coll fidelity ~0.5%.',
    peakAbsSigmaBudget: +MARGIN.toExponential(3), // ~2.14e-5
    curvatureK: CURVATURE_K, // 6.43e-3
    crossoverSensitivity_dLnN_dLnEcoll: D_LNN_D_LNECOLL, // -2
    crossoverEcollBudgetFor1pctN: CROSS_ECOLL_BUDGET_FOR_1PCT_N, // 0.005 (0.5%)
  },
  unconditionalOrGUE: {
    routeIInheritsImp486:
      'The surrogate E_coll rests on the C_H = 1/8 GUE-conditional ansatz and the true collision gap is ' +
      'governed by GUE pair-correlation statistics (Montgomery/Odlyzko), so a modeled/GUE asymptotic ' +
      '(route (i)) INHERITS the imp-486 GUE conditional -- it is NOT unconditional.',
    routeIIUnconditionalButTwoPoints:
      'Direct measurement at the two sub-T_PT landmark heights (route (ii)) is UNCONDITIONAL as a spot ' +
      'check of two heights, but it does NOT prove the surrogate map for all N and still needs the GUE ' +
      'ansatz to define the analytic prediction it deviates from.',
    noBoundMoves:
      'sigma(N) is a diagnostic share, not a Lambda lever: even a PERFECT fidelity closure leaves ' +
      'Platt-Trudgian Lambda <= 0.2 unchanged. imp-35337a is a genuine but bounded, non-bound-moving open ' +
      'item; its cheapest honest partial is the route-(ii) two-height data check.',
    L_pt_unchanged: L_PT, // 0.2
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). Closing imp-35337a (surrogate-vs-true ' +
    'fidelity of the sigma(N) landmarks) means: (A) treating the three surrogate inputs by class -- the ' +
    'GUE-conditional E_coll = C_C sqrt(log T0/N) (C_H = 1/8) is the ONLY fidelity target, E_flow is already ' +
    'rigorous (imp-398), E_trunc = 3.06e-5 is a separate barrier artifact (imp-2631/imp-35459); (B) ' +
    'swapping the modeled E_coll for the TRUE empirical-vs-analytic collision gap g_true(N) with an ' +
    'explicit finite-N remainder, via either a rigorous asymptotic (does not exist) or a data check at the ' +
    'two landmark heights (both below T_PT = 3e12, so feasible but two-point); (C) meeting an ABSOLUTE ' +
    'sigma budget < the 2.14e-5 flat-cap margin at the PEAK (flat max, k ~ 6.43e-3) and a ~0.5% RELATIVE ' +
    'E_coll budget at the CROSSOVER (2x-amplified into N since E_coll ~ N^{-1/2}); (D) accepting that a ' +
    'modeled/asymptotic closure INHERITS the imp-486 GUE conditional and only a finite two-height data ' +
    'check is unconditional (and checks two points, not the map). Either way sigma is a diagnostic share, ' +
    'not a Lambda lever, so NO bound moves. Discharges NOTHING; changes no bound; establishes no operator ' +
    'positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), the imp-398 C_F ' +
    'prefactor and C_mb GUE-conditional (imp-486) are UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35337 (dd arithmetic certification; names imp-35337a); imp-35411/imp-35417 (cite+assert ' +
    'imp-35337a); imp-35470 (peak curvature k ~ 6.43e-3); imp-3406/imp-3444 (the two landmarks on double); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz, C_H = 1/8); imp-398 (E_flow C_F prefactor); imp-2631 ' +
    '(E_trunc floor); imp-35419/imp-35459 (E_trunc is a barrier artifact, not a lever); imp-486 ' +
    '(GUE-conditional caveat); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); Platt-Trudgian ' +
    '2021 (T_PT = 3e12); Montgomery/Odlyzko (GUE pair-correlation).',
};

export const IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE_ASSERTIONS = [
  {
    // Part A/B: the surrogate reproduces the two landmarks and BOTH landmark heights sit below T_PT = 3e12.
    id: 'imp35475-landmark-heights-below-tpt',
    description: 'both landmark heights (peak T0 ~ 5.6e5, crossover T0 ~ 1.1e9) sit below T_PT = 3e12 so route (ii) is feasible',
    holds: () =>
      BOTH_BELOW_TPT === true &&
      T0_PEAK > 1e5 && T0_PEAK < 1e6 &&
      T0_CROSS > 1e8 && T0_CROSS < 1e10 &&
      CROSS_REPRODUCES === true && // the crossover reproduces E_coll = E_trunc on the surrogate
      Math.abs(C_C - 0.38374752) < 1e-6, // C_C = (1/8) sqrt(3 pi) reproduces the ansatz constant
  },
  {
    // Part C: the peak rides a ~2.1e-5 absolute margin; the crossover has a -2 (amplified) E_coll sensitivity.
    id: 'imp35475-landmark-error-budgets',
    description: 'PEAK needs absolute sigma fidelity < the ~2.14e-5 flat-cap margin; CROSSOVER needs ~0.5% E_coll fidelity (d lnN/d lnE_coll = -2)',
    holds: () =>
      MARGIN > 1e-5 && MARGIN < 3e-5 && // the flat-cap margin reproduces ~2.1e-5
      SIGMA_PEAK > SIGMA_CEIL && // the peak genuinely sits above the 10^6 sample
      D_LNN_D_LNECOLL === -2 && // E_coll ~ N^{-1/2} location amplification
      Math.abs(CROSS_ECOLL_BUDGET_FOR_1PCT_N - 0.005) < 1e-12, // 0.5% E_coll fidelity pins N_cross to 1%
  },
  {
    // Part D honesty gate: modeled closure inherits imp-486, no bound moves, no refereed bound is changed, sub-gap named; NO QED.
    id: 'imp35475-inherits-imp486-no-bound-moves-no-qed',
    description: 'a modeled closure INHERITS imp-486, sigma is not a Lambda lever so no bound moves, PT 0.2 unchanged, imp-35337a named, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE.isRigorous === false &&
      /imp-486/.test(IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE.verdict) &&
      /NO bound moves/.test(IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE.verdict) &&
      /imp-35337a/.test(IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE.citation) &&
      /NO QED/.test(IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE.verdict),
  },
];

for (const a of IMP35475_SIGMA_FIDELITY_CLOSURE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35475-sigma-fidelity-closure-scope assertion failed: ${a.id}`);
  }
}
