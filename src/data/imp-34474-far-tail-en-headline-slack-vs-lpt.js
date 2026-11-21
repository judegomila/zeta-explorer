/**
 * @module imp-34474-far-tail-en-headline-slack-vs-lpt
 *
 * imp-34474 (numerical, frontier-direction): imp-33620 extended the imp-33602 post-peak
 * E_trunc/E_coll ladder three decades and located the sigma < 0.01 FAR-TAIL landmark at
 * N ~ 4.62e13 (log10 N ~ 13.665), where the GUE-conditional collision share has decayed to
 * 1% of the E(N) bridge total -- ~2.16 decades past the imp-33582 sigma < 0.1 point. imp-33620
 * tabulated the landmark (its N and sigma) but never assembled the full headline E(N) =
 * E_trunc + E_flow + E_coll THERE, nor reported the implied Lambda <= E(N) slack against the
 * unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459), nor traced how that slack
 * evolves from the imp-3444 E_coll = E_trunc crossover (imp-34453, sigma ~ 0.5) out to this
 * sigma < 0.01 tail. This module reuses the EXACT imp-33620 / imp-3406 / imp-3220 sub-term
 * formulas, re-pins the sigma < 0.01 threshold by the identical bisection, assembles E(N)
 * there, and reports the headline slack against L_pt and against the imp-34453 crossover slack.
 *
 * THE QUANTITY (identical to imp-33620 / imp-3444 / imp-3406)
 * ----------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent, imp-2631/imp-3220)
 *   The sigma < 0.01 threshold N is bisected on log10 N (sigma decreasing) exactly as imp-33620.
 *
 * THE READING (measurement only)
 * ------------------------------
 *   N_001      = 4.624380576e13         (imp-33620 sigma < 0.01 far-tail landmark, reproduced ===)
 *   T0(N_001)  = 1.069681e13
 *   E_trunc    = 3.060000e-5            (constant floor)
 *   E_coll     = 3.090910e-7            (GUE-conditional, decayed to ~1% of E_trunc)
 *   E_flow     = 1.302080e-11           (negligible: E_flow / E_trunc ~ 4.26e-7)
 *   E(N_001)   = 3.090910406e-5         headline GUE-conditional slack Lambda <= E(N)
 *   sigma      = 0.010000000           (= 0.01 by construction at the threshold)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) At the far-tail landmark the assembled headline E(N) = 3.0909e-5 is, to 1.0%, exactly
 *        the truncation floor E_trunc: E(N) / E_trunc = 1.0101, because E_coll has decayed to
 *        ~1% of E_trunc (that decayed ratio IS sigma here) and E_flow is negligible
 *        (E_flow / E_trunc ~ 4.3e-7). Contrast the imp-3444 crossover (imp-34453) where E_coll
 *        = E_trunc and the headline was ~2 * E_trunc: as the GUE-conditional share vanishes the
 *        headline collapses toward the rigorous E_trunc floor from above.
 *   (F2) The headline slack has HALVED from the crossover to the far tail: the imp-34453
 *        crossover E(N) ~ 6.1258e-5 is 1.9819x the far-tail E(N) ~ 3.0909e-5 (a 49.5% drop of
 *        the headline slack across the 2.16-decade span). The entire reduction is the
 *        E_coll term dropping from = E_trunc (crossover) to ~1% E_trunc (far tail); E_trunc
 *        and E_flow contribute nothing to the change.
 *   (F3) The far-tail headline slack Lambda <= E(N) ~ 3.09e-5 sits a factor ~3915 BELOW the
 *        unconditional finite-height beat L_pt ~ 0.121 (imp-452/imp-459), roughly TWICE the
 *        imp-34453 crossover separation (~1975). But that L_pt / E(N) ratio is now within 1.0%
 *        of its structural CEILING L_pt / E_trunc = 3954.2 (the value it approaches as sigma
 *        -> 0 and E(N) -> E_trunc). So the conditionality headroom relative to L_pt has nearly
 *        saturated: past this landmark the vanishing conditional share can widen the L_pt gap
 *        by at most a further ~1%. It is a CONDITIONALITY gap throughout, not a bound.
 *
 * The punchline: assembling the full headline E(N) at the imp-33620 sigma < 0.01 far-tail
 * landmark N ~ 4.62e13 gives a GUE-conditional slack Lambda <= E(N) ~ 3.09e-5 ~ E_trunc
 * (E_coll ~ 1% E_trunc, E_flow negligible), which is HALF the imp-34453 crossover headline and
 * ~3915x below the unconditional finite-height beat L_pt ~ 0.121 -- within 1.0% of the ceiling
 * L_pt / E_trunc = 3954.2, so the conditionality headroom against L_pt has nearly saturated.
 *
 * ASSESSMENT ONLY. C_mb remains GUE-conditional per imp-486. No positivity, no bridge
 * closure, no bound change, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (sigma < 0.01 far-tail landmark bisection)
 * @see imp-34453-crossover-en-headline-slack-vs-lpt (E_coll = E_trunc crossover headline slack)
 * @see imp-3406-sigma-highN-extrapolation (N-shape sigma(N); component model source)
 * @see finite-height-beats-platt-trudgian (L_pt ~ 0.121 unconditional finite-N beat)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT } from './imp-34453-crossover-en-headline-slack-vs-lpt.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33620/imp-3406/imp-3444 exactly
const L_PT = 0.121; // imp-452/imp-459 unconditional finite-height beat (< PT 0.2)

// EXACT imp-33620/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Re-pin the imp-33620 sigma < 0.01 threshold by the identical log10-N bisection (sigma decreasing).
function sigmaAt(N) {
  return parts(N).sigma;
}
function thresholdLog10(target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 100; it++) {
    const mid = (lo + hi) / 2;
    if (sigmaAt(Math.pow(10, mid)) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const SIGMA_001_LOG10 = thresholdLog10(0.01, 12, 15); // ~13.665
const N_001 = Math.pow(10, SIGMA_001_LOG10); // ~4.624e13
const P = parts(N_001);

// Headline ratios and the L_pt / imp-34453 comparisons.
const E_N_OVER_E_TRUNC = P.E_N / E_TRUNC_PT; // ~1.0101
const E_FLOW_OVER_E_TRUNC = P.E_flow / E_TRUNC_PT; // ~4.26e-7
const L_PT_OVER_E_N = L_PT / P.E_N; // ~3915
const L_PT_OVER_E_TRUNC = L_PT / E_TRUNC_PT; // 3954.2 (structural ceiling as sigma -> 0)
const CEILING_FRACTION = L_PT_OVER_E_N / L_PT_OVER_E_TRUNC; // ~0.990 (within 1.0% of ceiling)
// imp-34453 crossover headline reused verbatim (no recomputation).
const E_N_CROSS = IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT.crossoverHeadline.E_N; // 6.125811677e-5
const CROSS_OVER_TAIL = E_N_CROSS / P.E_N; // ~1.9819 (crossover headline is ~2x the far tail)
const SLACK_DROP_PCT = ((E_N_CROSS - P.E_N) / E_N_CROSS) * 100; // ~49.54% drop crossover -> tail

export const IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT = {
  id: 'imp-34474',
  proofSection: 'S-frontier',
  question:
    'At the imp-33620 sigma < 0.01 far-tail landmark N ~ 4.62e13 (~2.16 decades past the sigma < 0.1 ' +
    'point), assemble the full headline E(N) = E_trunc + E_flow + E_coll and report the Lambda <= E(N) ' +
    'headline slack there, then compare it against the unconditional finite-height beat L_pt ~ 0.121 ' +
    '(imp-452/imp-459) and against the imp-3444 E_coll = E_trunc crossover slack (imp-34453). Reuses ' +
    'the identical imp-33620/imp-3406/imp-3220 sub-term formulas. Measurement only, C_mb remains ' +
    'GUE-conditional per imp-486, no bound change, NO QED.',
  farTailHeadline: {
    N_001: +N_001.toExponential(9), // 4.624380576e13
    log10_N: +SIGMA_001_LOG10.toFixed(6), // 13.665054
    T0: +P.T0.toExponential(6), // 1.069681e13
    E_trunc: +E_TRUNC_PT.toExponential(6), // 3.060000e-5
    E_coll: +P.E_coll.toExponential(6), // 3.090910e-7
    E_flow: +P.E_flow.toExponential(6), // 1.302080e-11
    E_N: +P.E_N.toExponential(9), // 3.090910406e-5
    sigma: +P.sigma.toFixed(9), // 0.010000000
    note:
      'Headline GUE-conditional slack Lambda <= E(N) = 3.0909e-5 assembled at the imp-33620 ' +
      'sigma < 0.01 far-tail landmark N ~ 4.624381e13, reproducing the imp-33620 threshold ' +
      'sigma = 0.01 exactly (same sub-term formulas and bisection).',
  },
  approachesTruncFloor: {
    E_N_over_E_trunc: +E_N_OVER_E_TRUNC.toFixed(6), // 1.010101
    E_flow_over_E_trunc: +E_FLOW_OVER_E_TRUNC.toExponential(4), // 4.2552e-7
    note:
      'At the far-tail landmark the headline E(N) is, to 1.0%, exactly the truncation floor ' +
      '(E(N) / E_trunc = 1.0101), because E_coll has decayed to ~1% of E_trunc (that ratio IS ' +
      'sigma here) and E_flow is negligible. Contrast the imp-34453 crossover where E(N) = ' +
      '2 * E_trunc: the headline collapses toward the E_trunc floor as the conditional share vanishes.',
  },
  vsCrossover: {
    E_N_cross: E_N_CROSS, // 6.125811677e-5 (imp-34453, reused verbatim)
    E_N_far_tail: +P.E_N.toExponential(6), // 3.090910e-5
    cross_over_tail: +CROSS_OVER_TAIL.toFixed(6), // 1.981879
    slack_drop_pct: +SLACK_DROP_PCT.toFixed(4), // 49.5428
    note:
      'The headline slack HALVES from the imp-3444 E_coll = E_trunc crossover (imp-34453, ' +
      'sigma ~ 0.5, E(N) ~ 6.1258e-5) to the sigma < 0.01 far tail (E(N) ~ 3.0909e-5): the ' +
      'crossover headline is 1.9819x the far-tail headline, a 49.5% drop across the 2.16-decade ' +
      'span. The entire reduction is the GUE-conditional E_coll term dropping from = E_trunc to ~1% E_trunc.',
  },
  vsFiniteHeightBeat: {
    L_pt: L_PT, // 0.121 (imp-452/imp-459 unconditional finite-height beat)
    E_N_far_tail: +P.E_N.toExponential(6), // 3.090910e-5
    L_pt_over_E_N: +L_PT_OVER_E_N.toFixed(1), // 3914.7
    L_pt_over_E_trunc_ceiling: +L_PT_OVER_E_TRUNC.toFixed(1), // 3954.2
    ceiling_fraction: +CEILING_FRACTION.toFixed(6), // 0.989986
    note:
      'The GUE-conditional far-tail headline slack Lambda <= E(N) ~ 3.09e-5 sits a factor ~3915 ' +
      'BELOW the unconditional finite-height beat L_pt ~ 0.121 -- roughly TWICE the imp-34453 ' +
      'crossover separation (~1975). But that L_pt / E(N) ratio is now within 1.0% of its ' +
      'structural CEILING L_pt / E_trunc = 3954.2 (the value approached as sigma -> 0, E(N) -> ' +
      'E_trunc): the conditionality headroom against L_pt has nearly saturated. A CONDITIONALITY ' +
      'gap throughout (GUE-conditional E_coll vs fully-unconditional L_pt), NOT a bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Assembling the full headline E(N) = E_trunc + ' +
    'E_flow + E_coll at the imp-33620 sigma < 0.01 far-tail landmark N ~ 4.624381e13 gives a ' +
    'GUE-conditional headline slack Lambda <= E(N) ~ 3.0909e-5, reproducing the imp-33620 threshold ' +
    'sigma = 0.01 exactly. The headline is, to 1.0%, exactly the truncation floor (E(N) / E_trunc = ' +
    '1.0101) because E_coll has decayed to ~1% of E_trunc and E_flow is negligible -- HALF the ' +
    'imp-34453 crossover headline (E(N) ~ 6.1258e-5, a 49.5% drop, the crossover being 1.9819x the ' +
    'far tail). This slack sits a factor ~3915 BELOW the unconditional finite-height beat L_pt ~ 0.121 ' +
    '(imp-452/imp-459), ~2x the crossover separation and within 1.0% of the structural ceiling ' +
    'L_pt / E_trunc = 3954.2 -- so the conditionality headroom against L_pt has nearly saturated. ' +
    'A CONDITIONALITY gap throughout (GUE-conditional E_coll, C_H = 1/8, vs fully-unconditional L_pt). ' +
    'C_mb remains GUE-conditional per imp-486. No positivity, no bridge closure, no bound change, ' +
    'no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-33620 (sigma < 0.01 far-tail landmark N ~ 4.62e13, log10-N bisection); imp-34453 (imp-3444 ' +
    'E_coll = E_trunc crossover headline slack, E(N) ~ 6.1258e-5); imp-3406 (N-shape sigma(N)); ' +
    'imp-452/imp-459 (L_pt ~ 0.121 unconditional finite-height beat); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642 (C_H = 1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT_ASSERTIONS = [
  {
    // Reuse gate: the threshold re-pins to the imp-33620 sigma < 0.01 landmark N ~ 4.624381e13.
    id: 'imp34474-reproduces-imp33620-far-tail-landmark',
    description: 'sigma < 0.01 threshold re-pins to the imp-33620 far-tail landmark N ~ 4.624381e13',
    holds: () =>
      Math.abs(N_001 - 4.624380576e13) / 4.624380576e13 < 1e-6 &&
      Math.abs(P.sigma - 0.01) < 1e-9,
  },
  {
    // (F1): the headline E(N) is, to ~1%, exactly the truncation floor (E_coll ~ 1% E_trunc).
    id: 'imp34474-headline-approaches-etrunc-floor',
    description: 'headline E(N) / E_trunc = 1.0101 (E_coll ~ 1% E_trunc, E_flow negligible)',
    holds: () =>
      Math.abs(E_N_OVER_E_TRUNC - 1.010101) < 1e-4 &&
      E_FLOW_OVER_E_TRUNC < 1e-6 &&
      Math.abs(P.E_N - 3.090910406e-5) / 3.090910406e-5 < 1e-6,
  },
  {
    // (F2): the headline slack halves from the imp-34453 crossover to the far tail.
    id: 'imp34474-slack-halves-vs-crossover',
    description: 'crossover E(N) is ~1.9819x the far-tail E(N) (a ~49.5% headline slack drop)',
    holds: () =>
      Math.abs(CROSS_OVER_TAIL - 1.981879) < 1e-3 &&
      Math.abs(SLACK_DROP_PCT - 49.5428) < 0.05 &&
      P.E_N < E_N_CROSS,
  },
  {
    // (F3): the L_pt / E(N) ratio ~3915 is within 1% of its ceiling L_pt / E_trunc = 3954.2.
    id: 'imp34474-slack-vs-lpt-near-ceiling',
    description: 'L_pt / E(N) ~ 3915 within 1.0% of the ceiling L_pt / E_trunc = 3954.2',
    holds: () =>
      Math.abs(L_PT_OVER_E_N - 3914.7) < 1.0 &&
      Math.abs(L_PT_OVER_E_TRUNC - 3954.2) < 0.1 &&
      L_PT_OVER_E_N < L_PT_OVER_E_TRUNC &&
      CEILING_FRACTION > 0.98,
  },
  {
    // Honesty gate: measurement only, GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp34474-honesty-gate-no-qed',
    description: 'Measurement only: C_mb GUE-conditional, no bound change, no QED, no refereed bound is changed',
    holds: () =>
      IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT.isRigorous === false &&
      /GUE-conditional per imp-486/.test(IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT.verdict) &&
      /NO QED/.test(IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT.verdict) &&
      /refereed bound is changed/i.test(IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT.verdict),
  },
];

for (const a of IMP34474_FAR_TAIL_EN_HEADLINE_SLACK_VS_LPT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34474-far-tail-en-headline-slack-vs-lpt assertion failed: ${a.id}`);
  }
}
