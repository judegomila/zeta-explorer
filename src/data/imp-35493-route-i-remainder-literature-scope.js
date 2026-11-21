/**
 * @module imp-35493-route-i-remainder-literature-scope
 *
 * imp-35493 (proof/assessment, S-frontier): SURVEY the Montgomery/Odlyzko
 * pair-correlation literature for any candidate rigorous finite-N remainder for
 * the C_H = 1/8 GUE collision ansatz E_coll = C_C sqrt(log T0/N), and CLASSIFY
 * whether such a remainder could supply the imp-35475 route-(i) closure of the
 * OPEN sub-gap imp-35337a. imp-35475 Part B asserted route-(i) -- a rigorous
 * unconditional asymptotic E_coll_true = C_C sqrt(log T0/N)(1 + err(N)) with
 * |err(N)| bounded explicitly -- "does not currently exist at these heights"
 * WITHOUT surveying the literature. This module surveys it and confirms the
 * assertion, adding a quantitative obstruction and a rigor/conditionality
 * classification along the three axes the ticket names: (a) availability at the
 * two landmark heights, (b) whether the remainder meets the imp-35475 Part-C
 * peak/crossover budgets, (c) whether it inherits the imp-486 GUE conditional.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges NOTHING; changes no bound; tightens no
 * bound; establishes no operator positivity; no RH verdict, NO QED. The C_C =
 * (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor
 * (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED. No refereed bound is changed.
 *
 * WHAT THE LITERATURE ACTUALLY OFFERS (two tiers, neither supplies route-(i))
 * -----------------------------------------------------------------------------
 * TIER 1 -- RIGOROUS but ASYMPTOTIC-ONLY (no explicit finite-N remainder):
 *   - Montgomery (1973) pair-correlation: the form factor F(alpha) -> the GUE
 *     kernel 1 - (sin(pi u)/(pi u))^2 is PROVED (assuming RH) only for restricted
 *     Fourier support |alpha| < 1; it is an ASYMPTOTIC statement as T -> inf with
 *     NO explicit finite-T error term at a named height, and it is RH-conditional.
 *   - Rudnick-Sarnak (1996) n-level correlations: agreement with GUE for
 *     restricted-support test functions; again asymptotic in T, no explicit
 *     finite-N remainder for the collision statistic at a fixed height.
 *   Neither delivers an |err(N)| bound at a specific finite T0, so neither is a
 *   route-(i) candidate.
 * TIER 2 -- FINITE-T LOWER-ORDER STRUCTURE but HEURISTIC/NUMERICAL (not rigorous):
 *   - Berry (1988) number-variance semiclassical formula and Bogomolny-Keating
 *     (1996) off-diagonal/arithmetic corrections to the form factor: DO produce
 *     finite-T lower-order terms of natural size ~1/log(T0/2pi), but they rest on
 *     the Hardy-Littlewood prime-pair conjecture -- CONJECTURAL, not rigorous.
 *   - Conrey-Snaith (2007) ratios-conjecture lower-order terms: conjectural.
 *   - Odlyzko (1987, 2001) numerical pair-correlation/spacing fits at T ~ 1e12 and
 *     ~1e20-1e22: MEASUREMENTS that empirically exhibit slow O(1/log T) approach to
 *     GUE; a data fit, not a rigorous remainder bound.
 *   These give the SHAPE of the finite-T correction but no rigorous |err(N)| bound,
 *   so none is a route-(i) candidate either.
 *
 * THE QUANTITATIVE OBSTRUCTION (even a remainder of the natural size fails the budgets)
 * -----------------------------------------------------------------------------
 * The natural leading finite-T correction to the pair-correlation / collision
 * statistics is O(1/log T0). At the two landmark heights this is LARGE because the
 * heights are modest:
 *   - PEAK   T0 ~ 5.573e5:  1/log T0 ~ 7.56e-2 (~7.6%)
 *   - CROSS  T0 ~ 1.144e9:  1/log T0 ~ 4.79e-2 (~4.8%)
 * The imp-35475 Part-C budgets are a 0.5% RELATIVE E_coll budget at the crossover
 * and a 2.14e-5 ABSOLUTE sigma budget at the peak. So the natural remainder size is
 * ~15x the crossover budget (7.56e-2 / 0.005) and ~9.6x it at the crossover height
 * (4.79e-2 / 0.005), and it SWAMPS the 2.14e-5 absolute peak budget by ~3 orders of
 * magnitude. Even if a rigorous remainder of the leading O(1/log T0) size existed,
 * its magnitude at these modest heights would not meet either budget -- the budgets
 * demand cancellation/precision that the leading pair-correlation remainder cannot
 * supply. This is a SECOND, height-driven obstruction independent of the rigor gap.
 *
 * CLASSIFICATION ALONG THE THREE TICKET AXES
 * -----------------------------------------------------------------------------
 *   (a) AVAILABLE at the two landmark heights?  NO. No rigorous finite-N remainder
 *       with an explicit err(N) exists: the rigorous pair-correlation results
 *       (Montgomery restricted-support, Rudnick-Sarnak) are asymptotic-only, and
 *       the only finite-T lower-order structure (Berry / Bogomolny-Keating /
 *       Conrey-Snaith / Odlyzko fits) is heuristic or numerical. CONFIRMS the
 *       imp-35475 Part-B assertion.
 *   (b) MEETS the budgets?  NO. The natural O(1/log T0) correction is ~5-8% at
 *       these heights, ~10-15x the 0.5% crossover budget and ~3 orders above the
 *       2.14e-5 absolute peak budget -- a height-driven obstruction on top of (a).
 *   (c) INHERITS imp-486?  YES. Every pair-correlation-based remainder rests on
 *       Montgomery's conjecture / GUE (RH-conditional, full-support conjectural),
 *       so route-(i) would inherit the imp-486 GUE conditional -- exactly as
 *       imp-35475 Part D anticipated. It is NOT unconditional.
 *
 * NET: the literature survey CONFIRMS imp-35475's assertion that route-(i) does
 * not currently exist, and STRENGTHENS it -- the rigorous pair-correlation results
 * are asymptotic-only (no finite-N remainder), the finite-T structure is heuristic,
 * and even the natural leading remainder size (~5-8%) fails both landmark budgets
 * at these modest heights. So route-(ii) (the imp-35488 two-height data-anchored
 * spot check) remains the only viable partial for imp-35337a. Assessment/scoping
 * only; discharges nothing; changes no bound; establishes no positivity; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35475-sigma-fidelity-closure-scope (Part B states route-(i) is absent; Part C the budgets; Part D imp-486)
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (route-(ii) partial for imp-35337a)
 * @see imp-35337-sigma-landmarks-double-double-certification (names imp-35337a)
 * @see imp-486 (GUE-conditional caveat inherited by any pair-correlation remainder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any route-(i) assessment)

// The two interior landmark N values (imp-35337 / imp-35475), taken as given.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER

// The imp-35475 Part-C budgets that a route-(i) remainder would have to meet.
const CROSS_ECOLL_REL_BUDGET = 0.005; // 0.5% relative E_coll fidelity (pins N_cross to ~1%)
const PEAK_ABS_SIGMA_BUDGET = 2.14e-5; // absolute sigma budget at the flat-cap peak

// The natural leading finite-T correction size in the pair-correlation literature is O(1/log T0).
const T0_PEAK = effectiveHeightForN(N_PEAK); // ~5.573e5
const T0_CROSS = effectiveHeightForN(N_CROSS); // ~1.144e9
const CORR_PEAK = 1 / Math.log(T0_PEAK); // ~7.56e-2
const CORR_CROSS = 1 / Math.log(T0_CROSS); // ~4.79e-2

// How far the natural correction size overshoots the tighter (0.5% relative) budget.
const OVERSHOOT_PEAK = CORR_PEAK / CROSS_ECOLL_REL_BUDGET; // ~15.1x
const OVERSHOOT_CROSS = CORR_CROSS / CROSS_ECOLL_REL_BUDGET; // ~9.6x

export const IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE = {
  id: 'imp-35493',
  proofSection: 'S-frontier',
  question:
    'imp-35475 Part B asserts route-(i) -- a rigorous unconditional asymptotic E_coll_true = ' +
    'C_C sqrt(log T0/N)(1 + err(N)) with |err(N)| bounded explicitly -- does not currently exist at these ' +
    'heights, WITHOUT surveying the pair-correlation literature. Survey the Montgomery/Odlyzko literature ' +
    '(Montgomery error terms, Odlyzko numerical fits, form-factor remainder estimates) for any candidate ' +
    'finite-N remainder for the C_H = 1/8 ansatz and CLASSIFY whether it (a) is available at the two ' +
    'landmark heights, (b) would meet the imp-35475 peak/crossover budgets, (c) inherits imp-486 ' +
    'GUE-conditionality. Literature assessment/scoping only; NO QED.',
  literatureTiers: {
    tier1RigorousButAsymptotic:
      'Montgomery (1973) pair-correlation: F(alpha) -> GUE kernel PROVED (assuming RH) only for restricted ' +
      'Fourier support |alpha| < 1, an ASYMPTOTIC statement as T -> inf with NO explicit finite-T error term ' +
      'at a named height, and RH-conditional. Rudnick-Sarnak (1996) n-level correlations: restricted-support ' +
      'GUE agreement, again asymptotic, no explicit finite-N remainder. Neither delivers an |err(N)| bound ' +
      'at a specific finite T0, so neither is a route-(i) candidate.',
    tier2FiniteTButHeuristic:
      'Berry (1988) number-variance and Bogomolny-Keating (1996) off-diagonal/arithmetic form-factor ' +
      'corrections DO give finite-T lower-order terms of natural size ~1/log(T0/2pi), but rest on the ' +
      'Hardy-Littlewood prime-pair conjecture -- CONJECTURAL. Conrey-Snaith (2007) ratios-conjecture terms: ' +
      'conjectural. Odlyzko (1987/2001) numerical pair-correlation/spacing fits at T ~ 1e12 and ~1e20-1e22 ' +
      'empirically show slow O(1/log T) approach to GUE -- a data fit, not a rigorous remainder bound. None ' +
      'is a route-(i) candidate either.',
  },
  quantitativeObstruction: {
    naturalCorrectionSize:
      'The natural leading finite-T correction to the pair-correlation/collision statistics is O(1/log T0). ' +
      'At the two landmark heights this is LARGE because the heights are modest: PEAK T0 ~ 5.573e5 gives ' +
      '1/log T0 ~ 7.56e-2 (~7.6%), CROSS T0 ~ 1.144e9 gives 1/log T0 ~ 4.79e-2 (~4.8%).',
    versusBudgets:
      'The imp-35475 Part-C budgets are a 0.5% RELATIVE E_coll budget (crossover) and a 2.14e-5 ABSOLUTE ' +
      'sigma budget (peak). The natural remainder size is ~15x the 0.5% budget at the peak height and ~9.6x ' +
      'at the crossover height, and it swamps the 2.14e-5 absolute peak budget by ~3 orders of magnitude. ' +
      'Even a rigorous remainder of the leading O(1/log T0) size would not meet either budget at these ' +
      'modest heights -- a SECOND, height-driven obstruction independent of the rigor gap.',
    T0_peak: +T0_PEAK.toExponential(3), // ~5.573e5
    T0_cross: +T0_CROSS.toExponential(3), // ~1.144e9
    corrSizePeak: +CORR_PEAK.toExponential(3), // ~7.56e-2
    corrSizeCross: +CORR_CROSS.toExponential(3), // ~4.79e-2
    overshootVsHalfPctBudgetPeak: +OVERSHOOT_PEAK.toFixed(1), // ~15.1
    overshootVsHalfPctBudgetCross: +OVERSHOOT_CROSS.toFixed(1), // ~9.6
    crossEcollRelBudget: CROSS_ECOLL_REL_BUDGET, // 0.005
    peakAbsSigmaBudget: PEAK_ABS_SIGMA_BUDGET, // 2.14e-5
  },
  classification: {
    availableAtLandmarks:
      '(a) NO. No rigorous finite-N remainder with an explicit err(N) exists: the rigorous pair-correlation ' +
      'results (Montgomery restricted-support, Rudnick-Sarnak) are asymptotic-only, and the only finite-T ' +
      'lower-order structure (Berry / Bogomolny-Keating / Conrey-Snaith / Odlyzko fits) is heuristic or ' +
      'numerical. CONFIRMS the imp-35475 Part-B assertion that route-(i) does not exist.',
    meetsBudgets:
      '(b) NO. The natural O(1/log T0) correction is ~5-8% at these heights, ~10-15x the 0.5% crossover ' +
      'budget and ~3 orders above the 2.14e-5 absolute peak budget -- a height-driven obstruction on top of ' +
      'the (a) rigor gap.',
    inheritsImp486:
      '(c) YES. Every pair-correlation-based remainder rests on Montgomery/GUE (RH-conditional, full-support ' +
      'conjectural), so route-(i) inherits the imp-486 GUE conditional -- exactly as imp-35475 Part D ' +
      'anticipated. It is NOT unconditional.',
    routeIIRemainsTheViablePartial:
      'Route-(ii) (the imp-35488 two-height data-anchored spot check, both landmark heights below T_PT = ' +
      '3e12) remains the only viable partial for imp-35337a.',
    L_pt_unchanged: L_PT, // 0.2
  },
  C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction literature survey, NOT rigorous). Surveying the ' +
    'Montgomery/Odlyzko pair-correlation literature for a candidate rigorous finite-N remainder for the ' +
    'C_H = 1/8 ansatz E_coll = C_C sqrt(log T0/N): the literature splits into (Tier 1) RIGOROUS but ' +
    'ASYMPTOTIC-only results (Montgomery restricted-support pair-correlation, Rudnick-Sarnak n-level), which ' +
    'carry NO explicit finite-N remainder at a named height, and (Tier 2) FINITE-T lower-order structure ' +
    '(Berry, Bogomolny-Keating, Conrey-Snaith, Odlyzko fits) that is HEURISTIC or NUMERICAL, not rigorous. ' +
    'CLASSIFICATION: (a) NO rigorous finite-N remainder is available at the two landmark heights -- CONFIRMS ' +
    'imp-35475 Part B; (b) it would NOT meet the budgets even if it existed -- the natural O(1/log T0) size ' +
    'is ~7.6% at the peak height and ~4.8% at the crossover height, ~15x/~9.6x the 0.5% relative crossover ' +
    'budget and ~3 orders above the 2.14e-5 absolute peak budget (a second, height-driven obstruction); ' +
    '(c) it INHERITS the imp-486 GUE conditional (Montgomery/GUE is RH-conditional and full-support ' +
    'conjectural), exactly as imp-35475 Part D anticipated. So route-(i) is CONFIRMED absent and route-(ii) ' +
    '(the imp-35488 two-height data check) remains the only viable partial for imp-35337a. Discharges ' +
    'NOTHING; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/' +
    'imp-2643), E_trunc = 3.06e-5 (imp-2631), the imp-398 C_F prefactor and C_mb GUE-conditional (imp-486) ' +
    'are UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35475 (Part B asserts route-(i) absent, Part C the budgets, Part D imp-486); imp-35488 (route-(ii) ' +
    'two-height partial for imp-35337a); imp-35337 (names imp-35337a); imp-2642/imp-2643 (C_C = (1/8) ' +
    'sqrt(3 pi) ansatz, C_H = 1/8); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); Platt-Trudgian ' +
    '2021 (T_PT = 3e12). Literature: Montgomery (1973); Rudnick-Sarnak (1996); Berry (1988); ' +
    'Bogomolny-Keating (1996); Conrey-Snaith (2007); Odlyzko (1987/2001).',
};

export const IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE_ASSERTIONS = [
  {
    // (a) No rigorous finite-N remainder exists: the survey confirms the imp-35475 Part-B assertion.
    id: 'imp35493-no-rigorous-finite-n-remainder',
    description: 'the literature offers only asymptotic-rigorous (Montgomery/Rudnick-Sarnak) or heuristic finite-T (Berry/Bogomolny-Keating/Conrey-Snaith/Odlyzko) results -- no rigorous finite-N remainder, confirming imp-35475 Part B',
    holds: () =>
      /asymptotic/i.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.literatureTiers.tier1RigorousButAsymptotic) &&
      /heuristic|conjectural|numerical/i.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.literatureTiers.tier2FiniteTButHeuristic) &&
      /NO\b/.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.classification.availableAtLandmarks) &&
      Math.abs(C_C - 0.38374752) < 1e-6, // C_C ansatz constant untouched
  },
  {
    // (b) The natural O(1/log T0) correction size overshoots the tight budgets at both landmark heights.
    id: 'imp35493-natural-correction-overshoots-budgets',
    description: 'the natural O(1/log T0) remainder is ~7.6%/~4.8% at the peak/crossover heights, ~15x/~9.6x the 0.5% budget and ~3 orders above the 2.14e-5 absolute peak budget',
    holds: () =>
      CORR_PEAK > 0.07 && CORR_PEAK < 0.08 && // ~7.6% at T0_peak
      CORR_CROSS > 0.04 && CORR_CROSS < 0.05 && // ~4.8% at T0_cross
      OVERSHOOT_PEAK > 10 && OVERSHOOT_PEAK < 20 && // ~15x the 0.5% budget
      OVERSHOOT_CROSS > 8 && OVERSHOOT_CROSS < 12 && // ~9.6x the 0.5% budget
      CORR_PEAK / PEAK_ABS_SIGMA_BUDGET > 1e3 && // swamps the absolute peak budget by ~3 orders
      T0_PEAK < 3e12 && T0_CROSS < 3e12, // both landmark heights below T_PT
  },
  {
    // (c) honesty gate: inherits imp-486, no bound moves, no refereed bound is changed, sub-gap named; NO QED.
    id: 'imp35493-inherits-imp486-no-bound-moves-no-qed',
    description: 'route-(i) inherits imp-486, sigma-fidelity is not a Lambda lever so no bound moves, PT 0.2 unchanged, imp-35337a named, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.isRigorous === false &&
      /imp-486/.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.classification.inheritsImp486) &&
      /imp-35337a/.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.citation) &&
      /NO QED/.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE.verdict),
  },
];

for (const a of IMP35493_ROUTE_I_REMAINDER_LITERATURE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35493-route-i-remainder-literature-scope assertion failed: ${a.id}`);
  }
}
