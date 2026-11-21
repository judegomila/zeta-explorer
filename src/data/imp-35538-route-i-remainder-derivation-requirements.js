/**
 * @module imp-35538-route-i-remainder-derivation-requirements
 *
 * imp-35538 (proof/assessment, S-frontier): ENUMERATE what DERIVING a rigorous
 * finite-N remainder for the E_coll = C_C sqrt(log T0/N) ansatz (C_C =
 * (1/8) sqrt(3 pi), C_H = 1/8; imp-2642/imp-2643) would REQUIRE, per the
 * imp-35475 route-(i) observation that the C_H = 1/8 ansatz currently has NO
 * rigorous finite-N remainder. Where imp-35493 SURVEYED the literature and
 * CONFIRMED no such remainder exists, this module is the complementary
 * FORWARD-LOOKING requirements spec: it lists the analytic inputs a route-(i)
 * derivation would consume (an explicit-rate GUE local law, the C_H = 1/8
 * provenance, a restricted->full Fourier-support upgrade), the height regime
 * where a finite-N bound small enough to bind the landmarks could hold, and
 * whether the remainder can be unconditional or must inherit the imp-486 GUE
 * conditional.
 *
 * ASSESSMENT / SCOPING ONLY. Derives NO remainder; discharges NOTHING; changes
 * no bound; tightens no bound; establishes no operator positivity; no RH
 * verdict, NO QED. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the
 * E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED. No refereed bound is changed.
 *
 * THE OBJECT TO BE DERIVED
 * -----------------------------------------------------------------------------
 * A rigorous, ideally unconditional statement
 *     E_coll_true(N) = C_C sqrt(log T0/N) (1 + err(N)),   |err(N)| <= B(N),
 * with B(N) an EXPLICIT function evaluable at a named finite height T0 = T0(N)
 * (via the imp-3220/imp-3406 Riemann-von Mangoldt surrogate). imp-35475 Part B
 * flagged this route-(i) object as not currently existing; imp-35493 confirmed
 * it is absent from the literature. This module enumerates its INGREDIENTS.
 *
 * THE FIVE DERIVATION REQUIREMENTS
 * -----------------------------------------------------------------------------
 * REQ 1 -- EFFECTIVE C_H = 1/8 PROVENANCE. The leading term C_C sqrt(log T0/N)
 *   encodes the mean minimal-collision gap of the local zero statistics, with
 *   C_C = (1/8) sqrt(3 pi) and C_H = 1/8 (imp-2642/imp-2643). To bound a
 *   remainder you must FIRST express E_coll_true as an explicit functional of
 *   the local statistics (a pair-correlation / near-minimal-spacing integral)
 *   and prove C_C sqrt(log T0/N) is its leading term. Without an effective
 *   derivation of C_H = 1/8 itself there is no object against which |err(N)| is
 *   even defined -- this is the definitional prerequisite.
 *
 * REQ 2 -- A GUE LOCAL LAW WITH AN EXPLICIT FINITE-N RATE. err(N) is exactly the
 *   deviation of the true local zero statistics from their GUE limit at height
 *   T0. Bounding it requires a local law / n-level-correlation theorem carrying
 *   a NAMED quantitative rate: an explicit E_GUE(T0) with
 *   |true statistic - GUE prediction| <= E_GUE(T0) for all T0 >= T0_min. The
 *   rigorous pair-correlation results (Montgomery restricted-support 1973,
 *   Rudnick-Sarnak 1996) are ASYMPTOTIC-only -- they carry no such E_GUE(T0).
 *   So this central input DOES NOT EXIST and would itself have to be proved; it
 *   is the crux of the route-(i) derivation.
 *
 * REQ 3 -- RESTRICTED -> FULL FOURIER-SUPPORT. Montgomery/Rudnick-Sarnak control
 *   only test functions of restricted Fourier support |alpha| < 1, whereas a
 *   minimal / near-minimal collision spacing is a full-support functional. A
 *   route-(i) derivation must EITHER (a) re-express E_coll via a support-limited
 *   statistic reachable inside |alpha| < 1, OR (b) supply the full-support GUE
 *   law (Montgomery's pair-correlation conjecture) -- which is CONJECTURAL.
 *
 * REQ 4 -- A HEIGHT REGIME WHERE THE BOUND CAN BIND. Even granting REQ 2, the
 *   natural leading GUE local-law rate is O(1/log T0) (per imp-35493). For the
 *   remainder to be SMALL ENOUGH to bind the sigma landmarks it must meet the
 *   imp-35475 Part-C budgets. Hitting the 0.5% relative crossover budget with an
 *   O(1/log T0) remainder needs 1/log T0 <= 0.005, i.e. log T0 >= 200, i.e.
 *   T0 >= e^200 ~ 7.23e86. The ACTUAL landmark heights have log T0 ~ 13.23
 *   (peak) and ~20.86 (crossover), and even the PT anchor has log T_PT ~ 28.73
 *   -- so the required log-height is ~9.6x the crossover height and ~7.0x the PT
 *   anchor. A finite-N remainder small enough to bind the landmarks CANNOT hold
 *   at (or anywhere near) the landmark heights on the natural rate; the height
 *   regime is astronomically out of reach.
 *
 * REQ 5 -- CONDITIONALITY. Any GUE-based local law is RH-conditional and, at full
 *   support, rests on Montgomery's conjecture. A route-(i) remainder is therefore
 *   UNAVOIDABLY conditional and INHERITS the imp-486 GUE conditional (exactly as
 *   imp-35475 Part D anticipated); it CANNOT be made unconditional by this route.
 *   An unconditional remainder would require a non-GUE, purely arithmetic
 *   derivation of the collision gap -- no such derivation is known.
 *
 * NET: deriving route-(i) requires (REQ 2) an explicit-rate GUE local law that
 * does not exist, (REQ 3) resolved at full Fourier support (conjectural), (REQ 1)
 * atop an effective C_H = 1/8 provenance, holding (REQ 4) only at heights
 * >= e^200 far beyond the landmarks and even T_PT, and even then (REQ 5)
 * conditional on imp-486. So route-(i) is not merely absent (imp-35493) -- each
 * of its derivation requirements is individually out of reach at these heights.
 * Route-(ii) (the imp-35488 two-height data-anchored spot check, both landmark
 * heights below T_PT = 3e12) remains the only viable partial for the OPEN
 * imp-35337a. Assessment/scoping only; discharges nothing; changes no bound; no
 * positivity; NO QED. No refereed bound is changed.
 *
 * CROSS-REFERENCE (imp-35712): imp-35652 assesses REQ 3's option (a) directly --
 * whether E_coll can be re-expressed via a restricted-Fourier-support surrogate
 * reachable inside the PROVEN |alpha| < 1 correlations, which would DISSOLVE REQ
 * 2 as well. imp-35652 finds option (a) NOT viable: such a surrogate is a
 * band-limited, mean-scale statistic that cannot carry the leading constant
 * C_C = (1/8) sqrt(3 pi) (the near-coincidence scale is inaccessible inside
 * |alpha| < 1). So option (a) does NOT dissolve REQ 2 -- the full-support
 * explicit-rate E_GUE(T0) local law of REQ 2 is still required, and REQ 3 still
 * forces the conjectural option (b).
 *
 * @see imp-35475-sigma-fidelity-closure-scope (Part B flags route-(i) absent; Part C budgets; Part D imp-486)
 * @see imp-35493-route-i-remainder-literature-scope (survey CONFIRMS route-(i) absent; this module scopes its requirements)
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (route-(ii) partial for imp-35337a)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (REQ 3 option (a) assessed and found NOT viable; REQ 2 not dissolved)
 * @see imp-35337-sigma-landmarks-double-double-certification (names imp-35337a)
 * @see imp-486 (GUE-conditional caveat inherited by any pair-correlation remainder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any route-(i) requirements scoping)
const T_PT = 3e12; // Platt-Trudgian verified height

// The two interior landmark N values (imp-35337 / imp-35475), taken as given.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER

// The tightest imp-35475 Part-C budget a route-(i) remainder would have to meet.
const CROSS_ECOLL_REL_BUDGET = 0.005; // 0.5% relative E_coll fidelity (pins N_cross to ~1%)

// Actual landmark log-heights, and the natural O(1/log T0) remainder size there.
const T0_PEAK = effectiveHeightForN(N_PEAK); // ~5.573e5
const T0_CROSS = effectiveHeightForN(N_CROSS); // ~1.144e9
const LOG_T0_PEAK = Math.log(T0_PEAK); // ~13.23
const LOG_T0_CROSS = Math.log(T0_CROSS); // ~20.86
const LOG_T_PT = Math.log(T_PT); // ~28.73
const CORR_CROSS = 1 / LOG_T0_CROSS; // ~4.79e-2, the natural remainder size at the crossover

// REQ 4 -- the log-height a natural O(1/log T0) remainder needs to hit the 0.5% budget,
// and how far the actual landmark / PT heights fall short of it.
const LOG_T0_NEEDED = 1 / CROSS_ECOLL_REL_BUDGET; // 200
const T0_NEEDED = Math.exp(LOG_T0_NEEDED); // ~7.23e86
const SHORTFALL_VS_CROSS = LOG_T0_NEEDED / LOG_T0_CROSS; // ~9.59x
const SHORTFALL_VS_T_PT = LOG_T0_NEEDED / LOG_T_PT; // ~6.96x

// imp-35576 -- REQ 4 budget sweep. imp-35538 REQ 4 fixes a single budget b = 0.5%; here the
// same threshold LOG_T0_NEEDED = 1/b and T0_NEEDED = e^(1/b), with both shortfall factors, is
// tabulated across the fidelity budget b in {0.5%,1%,2%,5%} on the SAME fixed O(1/log T0) rate.
// The required log-height relaxes linearly in the reciprocal budget (200 -> 100 -> 50 -> 20); the
// required height T0_NEEDED first drops below the PT anchor T_PT = 3e12 only once 1/b < log T_PT,
// i.e. b > 1/log T_PT ~ 3.48%, so within this grid only b = 5% is reachable. Tabulation only from
// the fixed rate; discharges nothing; changes no bound; NO QED.
const REQ4_BUDGET_GRID = [0.005, 0.01, 0.02, 0.05]; // relative E_coll fidelity budgets
const REQ4_BUDGET_SWEEP = REQ4_BUDGET_GRID.map((b) => {
  const logT0Needed = 1 / b; // LOG_T0_NEEDED = 1/b
  const t0Needed = Math.exp(logT0Needed); // T0_NEEDED = e^(1/b)
  return {
    budget: b,
    budgetPct: +(100 * b).toPrecision(3), // 0.5, 1, 2, 5
    logT0Needed: +logT0Needed.toFixed(2), // 200, 100, 50, 20
    T0Needed: +t0Needed.toExponential(3), // e^(1/b)
    shortfallVsCross: +(logT0Needed / LOG_T0_CROSS).toFixed(3), // vs log T0 ~ 20.86
    shortfallVsTPT: +(logT0Needed / LOG_T_PT).toFixed(3), // vs log T_PT ~ 28.73
    belowTPT: t0Needed < T_PT, // does the required height drop below the PT anchor?
  };
});
// The budget at which T0_NEEDED first drops below T_PT: 1/b < log T_PT => b > 1/log T_PT.
const REQ4_BUDGET_BELOW_TPT_THRESHOLD = 1 / LOG_T_PT; // ~0.03481 (3.48%)

export const IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS = {
  id: 'imp-35538',
  proofSection: 'S-frontier',
  question:
    'Per the imp-35475 route-(i) observation that the C_H = 1/8 ansatz E_coll = C_C sqrt(log T0/N) has NO ' +
    'rigorous finite-N remainder, ENUMERATE what deriving E_coll_true(N) = C_C sqrt(log T0/N)(1 + err(N)) ' +
    'with |err(N)| explicitly bounded would REQUIRE: the analytic inputs (GUE local-law explicit error ' +
    'terms, the C_H = 1/8 provenance), the height regime where a finite-N bound could hold, and whether the ' +
    'remainder can be unconditional or must inherit the imp-486 GUE conditional. Requirements scoping only; ' +
    'derives no remainder; NO QED.',
  objectToDerive:
    'A rigorous statement E_coll_true(N) = C_C sqrt(log T0/N)(1 + err(N)) with |err(N)| <= B(N) for an ' +
    'EXPLICIT B(N) evaluable at the named finite height T0 = T0(N) (imp-3220/imp-3406 RvM surrogate). ' +
    'imp-35475 Part B flagged this object absent; imp-35493 confirmed it absent from the literature; this ' +
    'module enumerates its ingredients.',
  requirements: {
    req1EffectiveCHProvenance:
      'REQ 1 -- EFFECTIVE C_H = 1/8 PROVENANCE. Express E_coll_true as an explicit functional of the local ' +
      'zero statistics (a pair-correlation / near-minimal-spacing integral) and prove C_C sqrt(log T0/N) ' +
      '(C_C = (1/8) sqrt(3 pi), C_H = 1/8; imp-2642/imp-2643) is its leading term. Without an effective ' +
      'derivation of C_H = 1/8 there is no object against which |err(N)| is even defined -- the definitional ' +
      'prerequisite.',
    req2ExplicitRateGueLocalLaw:
      'REQ 2 -- A GUE LOCAL LAW WITH AN EXPLICIT FINITE-N RATE. err(N) is the deviation of the true local ' +
      'statistics from their GUE limit at height T0; bounding it needs a NAMED E_GUE(T0) with ' +
      '|true - GUE| <= E_GUE(T0) for T0 >= T0_min. The rigorous pair-correlation results (Montgomery ' +
      'restricted-support 1973, Rudnick-Sarnak 1996) are ASYMPTOTIC-only and carry no such rate, so this ' +
      'central input does NOT exist and would itself have to be proved -- the crux.',
    req3RestrictedToFullSupport:
      'REQ 3 -- RESTRICTED -> FULL FOURIER-SUPPORT. Montgomery/Rudnick-Sarnak control only |alpha| < 1, but a ' +
      'minimal/near-minimal spacing is a full-support functional. The derivation must EITHER re-express ' +
      'E_coll via a support-limited statistic inside |alpha| < 1, OR supply the full-support GUE law ' +
      '(Montgomery pair-correlation conjecture) -- which is CONJECTURAL.',
    req4HeightRegime:
      'REQ 4 -- A HEIGHT REGIME WHERE THE BOUND CAN BIND. The natural leading rate is O(1/log T0); hitting ' +
      'the 0.5% relative crossover budget needs log T0 >= 200 (T0 >= e^200 ~ 7.23e86). The actual landmark ' +
      'log-heights are ~13.23 (peak) and ~20.86 (crossover), and log T_PT ~ 28.73 -- so the required ' +
      'log-height is ~9.6x the crossover height and ~7.0x the PT anchor. A remainder small enough to bind ' +
      'the landmarks CANNOT hold at (or near) the landmark heights on the natural rate.',
    req5Conditionality:
      'REQ 5 -- CONDITIONALITY. Any GUE-based local law is RH-conditional and, at full support, rests on ' +
      'Montgomery conjecture; the remainder is UNAVOIDABLY conditional and INHERITS the imp-486 GUE ' +
      'conditional (imp-35475 Part D). It CANNOT be made unconditional by this route -- an unconditional ' +
      'remainder would need a non-GUE, purely arithmetic derivation of the collision gap, which is not known.',
  },
  heightRegime: {
    logT0NeededForHalfPctBudget: LOG_T0_NEEDED, // 200
    T0Needed: +T0_NEEDED.toExponential(3), // ~7.23e86
    logT0Peak: +LOG_T0_PEAK.toFixed(4), // ~13.2309
    logT0Cross: +LOG_T0_CROSS.toFixed(4), // ~20.8576
    logT_PT: +LOG_T_PT.toFixed(4), // ~28.7296
    shortfallVsCross: +SHORTFALL_VS_CROSS.toFixed(2), // ~9.59x
    shortfallVsTPT: +SHORTFALL_VS_T_PT.toFixed(2), // ~6.96x
    naturalCorrAtCross: +CORR_CROSS.toExponential(3), // ~4.794e-2
    crossEcollRelBudget: CROSS_ECOLL_REL_BUDGET, // 0.005
  },
  req4BudgetSweep: {
    // imp-35576: budget -> required-height dependence of the REQ 4 threshold, named but not
    // tabulated by imp-35538 (which fixes only b = 0.5%). LOG_T0_NEEDED = 1/b and T0_NEEDED =
    // e^(1/b), with shortfalls vs the crossover (log T0 ~ 20.86) and PT anchor (log T_PT ~ 28.73).
    note:
      'imp-35576: the REQ 4 threshold LOG_T0_NEEDED = 1/b, T0_NEEDED = e^(1/b) and the shortfall factors vs ' +
      'the crossover (log T0 ~ 20.86) and PT anchor (log T_PT ~ 28.73), swept over the fidelity budget b in ' +
      '{0.5%,1%,2%,5%} on the SAME fixed O(1/log T0) rate. The required log-height 1/b relaxes linearly in ' +
      'the reciprocal budget (200 -> 100 -> 50 -> 20); T0_NEEDED drops below T_PT = 3e12 only once ' +
      'b > 1/log T_PT ~ 3.48%, so within this grid only b = 5% (T0_NEEDED ~ 4.85e8 < 3e12, both shortfalls ' +
      '< 1) is reachable while b <= 2% stays astronomically out of reach (b = 0.5% needs T0 ~ 7.23e86). ' +
      'Tabulation only from the fixed rate; discharges nothing; changes no bound; NO QED.',
    grid: REQ4_BUDGET_SWEEP,
    belowTPTBudgetThreshold: +REQ4_BUDGET_BELOW_TPT_THRESHOLD.toFixed(5), // ~0.03481
    belowTPTBudgetThresholdPct: +(100 * REQ4_BUDGET_BELOW_TPT_THRESHOLD).toFixed(2), // ~3.48
  },
  C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction requirements spec, NOT rigorous). Deriving a rigorous ' +
    'finite-N remainder E_coll_true(N) = C_C sqrt(log T0/N)(1 + err(N)) with |err(N)| explicitly bounded ' +
    'would REQUIRE, in order: (REQ 1) an effective C_H = 1/8 provenance expressing E_coll_true as an ' +
    'explicit local-statistics functional; (REQ 2) a GUE local law carrying an EXPLICIT finite-N rate ' +
    'E_GUE(T0) -- which does NOT exist (the rigorous Montgomery/Rudnick-Sarnak pair-correlation results are ' +
    'asymptotic-only), the crux; (REQ 3) a restricted->full Fourier-support upgrade (Montgomery conjecture, ' +
    'conjectural); (REQ 4) a height regime log T0 >= 200 (T0 >= e^200 ~ 7.23e86) to bind the 0.5% relative ' +
    'crossover budget, ~9.6x the actual crossover log-height ~20.86 and ~7.0x the PT anchor log T_PT ~ ' +
    '28.73, so no reachable height binds the landmarks on the natural O(1/log T0) rate; and (REQ 5) it ' +
    'INHERITS the imp-486 GUE conditional and CANNOT be made unconditional by this route. So route-(i) is ' +
    'not merely absent (imp-35493) -- each derivation requirement is individually out of reach, and ' +
    'route-(ii) (the imp-35488 two-height data-anchored spot check, both landmark heights below T_PT = 3e12) ' +
    'remains the only viable partial for the OPEN imp-35337a. Derives NO remainder; discharges NOTHING; ' +
    'changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631), the imp-398 C_F prefactor and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35475 (Part B flags route-(i) absent, Part C budgets, Part D imp-486); imp-35493 (literature survey ' +
    'CONFIRMS route-(i) absent -- this module scopes its derivation requirements); imp-35488 (route-(ii) ' +
    'two-height partial for imp-35337a); imp-35337 (names imp-35337a); imp-2642/imp-2643 (C_C = (1/8) ' +
    'sqrt(3 pi) ansatz, C_H = 1/8); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat); imp-35652 (assesses REQ 3 option (a), finds it NOT viable, so REQ 2 is still ' +
    'required); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); Platt-Trudgian 2021 ' +
    '(T_PT = 3e12). Literature: Montgomery (1973); Rudnick-Sarnak (1996).',
};

export const IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS_ASSERTIONS = [
  {
    // (1) the five derivation requirements are enumerated, with the explicit-rate GUE local law as the crux.
    id: 'imp35538-five-requirements-enumerated',
    description: 'the requirements spec lists REQ 1-5 (effective C_H=1/8 provenance, explicit-rate GUE local law, restricted->full support, height regime, conditionality) with REQ 2 as the crux',
    holds: () => {
      const r = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.requirements;
      return (
        /C_H = 1\/8/.test(r.req1EffectiveCHProvenance) &&
        /EXPLICIT FINITE-N RATE/.test(r.req2ExplicitRateGueLocalLaw) &&
        /does NOT exist|not exist/i.test(r.req2ExplicitRateGueLocalLaw) &&
        /FULL FOURIER-SUPPORT/.test(r.req3RestrictedToFullSupport) &&
        /HEIGHT REGIME/.test(r.req4HeightRegime) &&
        /CONDITIONALITY/.test(r.req5Conditionality) &&
        Math.abs(C_C - 0.38374752) < 1e-6 // C_C ansatz constant untouched
      );
    },
  },
  {
    // (2) REQ 4 height-regime arithmetic: the natural O(1/log T0) rate needs log T0 >= 200,
    //     far beyond both landmark heights and even the PT anchor; both landmarks stay below T_PT.
    id: 'imp35538-height-regime-out-of-reach',
    description: 'hitting the 0.5% crossover budget on the natural O(1/log T0) rate needs log T0 >= 200 (T0 ~ e^200), ~9.6x the crossover log-height and ~7.0x log T_PT, so no reachable height binds the landmarks',
    holds: () =>
      LOG_T0_NEEDED === 200 &&
      T0_NEEDED > 1e86 && T0_NEEDED < 1e87 && // e^200 ~ 7.23e86, finite in double
      LOG_T0_NEEDED > LOG_T0_CROSS && LOG_T0_NEEDED > LOG_T_PT && // beyond landmark and PT log-heights
      SHORTFALL_VS_CROSS > 9 && SHORTFALL_VS_CROSS < 10 && // ~9.6x the crossover height
      SHORTFALL_VS_T_PT > 6 && SHORTFALL_VS_T_PT < 8 && // ~7.0x the PT anchor
      CORR_CROSS > CROSS_ECOLL_REL_BUDGET && // natural rate at the crossover already overshoots the budget
      T0_PEAK < T_PT && T0_CROSS < T_PT, // both landmark heights below T_PT
  },
  {
    // (2b) imp-35576 REQ 4 budget sweep: LOG_T0_NEEDED = 1/b decreases as the budget loosens
    //      (200 -> 100 -> 50 -> 20), shortfalls scale as 1/(b * log-height), and T0_NEEDED first
    //      drops below T_PT = 3e12 only for b > 1/log T_PT ~ 3.48% (only b = 5% in the grid).
    id: 'imp35576-req4-budget-sweep-monotone-and-tpt-crossing',
    description: 'the REQ 4 threshold LOG_T0_NEEDED = 1/b decreases as the budget loosens (200->100->50->20), the shortfalls track 1/(b*log-height), and T0_NEEDED drops below T_PT = 3e12 only for b > 1/log T_PT ~ 3.48% (only b = 5% in the {0.5,1,2,5}% grid)',
    holds: () => {
      const g = REQ4_BUDGET_SWEEP;
      const logsOk = g.map((r) => r.logT0Needed).join(',') === '200,100,50,20';
      const monotone = g.every((r, i) => i === 0 || r.logT0Needed < g[i - 1].logT0Needed);
      const belowFlags = g.map((r) => r.belowTPT).join(',') === 'false,false,false,true';
      const only5 = g.filter((r) => r.belowTPT).length === 1 && g[3].budgetPct === 5;
      const threshOk =
        REQ4_BUDGET_BELOW_TPT_THRESHOLD > 0.034 && REQ4_BUDGET_BELOW_TPT_THRESHOLD < 0.035;
      const shortfallsConsistent = g.every(
        (r) =>
          Math.abs(r.shortfallVsCross - r.logT0Needed / LOG_T0_CROSS) < 5e-4 &&
          Math.abs(r.shortfallVsTPT - r.logT0Needed / LOG_T_PT) < 5e-4,
      );
      return logsOk && monotone && belowFlags && only5 && threshOk && shortfallsConsistent;
    },
  },
  {
    // (3) honesty gate: conditional (inherits imp-486, not unconditional), no bound moves, no refereed bound is changed, sub-gap named; NO QED.
    id: 'imp35538-conditional-no-bound-moves-no-qed',
    description: 'route-(i) inherits imp-486 and is not unconditional, sigma-fidelity is not a Lambda lever so no bound moves, PT 0.2 unchanged, imp-35337a named, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.isRigorous === false &&
      IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.isUnconditional === false &&
      /imp-486/.test(IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.requirements.req5Conditionality) &&
      /imp-35337a/.test(IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.citation) &&
      /NO QED/.test(IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.verdict) &&
      /refereed bound is changed/i.test(IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.verdict),
  },
];

for (const a of IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35538-route-i-remainder-derivation-requirements assertion failed: ${a.id}`);
  }
}
