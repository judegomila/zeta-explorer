/**
 * @module imp-3710-imp3661-density-factor-consumed-audit
 *
 * imp-3710 (accuracy, frontier-direction): AUDIT which anchor-to-crossover shrink factor the imp-3661
 * propagation actually CONSUMED when it re-derived the E(N)-bridge flow factor -- the imp-398/imp-3620
 * STALE bare-log 0.4410 = 9.1981/20.8576, or the imp-3642 density-corrected 0.3870 =
 * (9.1981 - log 2pi)/(20.8576 - log 2pi). imp-3671 asserts "imp-3661 already propagated exactly this
 * scale" into the E(N) bridge constants, but the queued imp-3620-pin/imp-3604-bracket re-point ticket
 * never audited imp-3661 itself. This module reads the imp-3661 exported closed form and its consumed
 * crossover-scale flow factor, DERIVES the shrink factor imp-3661 actually multiplied the A1 trap by,
 * and records whether a re-point is needed. Accuracy audit only; no new bound, NO QED.
 *
 * WHAT imp-3661 CONSUMED (read from its own exports, not re-transcribed)
 * ---------------------------------------------------------------------
 * imp-3661 pins the collision time as t_c(N) = 2.37e-4 * L2pi(N*)/L2pi(N), where L2pi = log(gamma/2pi) is
 * the DENSITY-corrected argument (imp-3661 constant L_ANCHOR_DENSITY = 7.3603), NOT the bare log gamma
 * (L_ANCHOR_BARE = 9.1981). Its E(N)-bridge propagation -- the parts() E_flow term and BOTH root-solves
 * (argmaxSigmaLnN, crossHalf) -- takes tcFn = collisionTimeDensity, so the flow factor fed into E_flow is
 * the density-corrected one. The bare-log 0.4410 factor survives in imp-3661 ONLY as a labeled imp-3620
 * side-by-side comparison (tc_x_bare_imp3620, flowFactor_bare_cg1_imp3620); it is never consumed by the
 * bridge constant. Reading the exported crossover-scale node:
 *   consumed shrink factor  = tc_x_density / 2.37e-4  = 9.1714e-5 / 2.37e-4 = 0.3870  (DENSITY-corrected)
 *   stale bare-log factor   = tc_x_bare    / 2.37e-4  = 1.0452e-4 / 2.37e-4 = 0.4410  (imp-3620, NOT used)
 * So imp-3661 consumed the imp-3642 density-corrected 0.3870 factor. The flow factor it propagated into
 * E(N) is exp(t_c(N_x)) = 1.0000917 (C_G=1), at ~19.3% of the imp-3604 bracket -- the density-corrected
 * value, not the stale bare-log 1.0001045 (22.05%).
 *
 * COUNTERFACTUAL: THE SHIFT THAT WOULD HAVE BEEN NEEDED IF imp-3661 WERE STALE
 * ---------------------------------------------------------------------------
 * Had imp-3661 consumed the bare-log 0.4410, the flow factor would sit at 1.0001045 (22.05% occupancy),
 * over-stating the surviving crossover collision time by imp-3642 F2s ~13.96% and pushing the pin ~2.7
 * bracket-percent points FARTHER from 1. Because imp-3661 already uses 0.3870, this counterfactual shift
 * is exactly what imp-3661 ALREADY absorbed -- there is nothing left to re-point.
 *
 * NET FINDING
 * -----------
 *   (F1) imp-3661 CONSUMED the density-corrected 0.3870 factor (consumed shrink = 0.3870, matching the
 *        imp-3642 flow-measured value to the published 4-sig-fig closed form), NOT the stale bare-log
 *        0.4410. The bare-log value is present in imp-3661 only as an explicit imp-3620 comparison.
 *   (F2) NO RE-POINT IS NEEDED. The imp-3661 E(N)-bridge flow factor (1.0000917, ~19.3% bracket) is
 *        already the density-corrected pin; the queued imp-3620/imp-3604 re-point does not need to touch
 *        imp-3661. The counterfactual stale-factor shift (bare 0.4410 -> flow factor 1.0001045, 22.05%,
 *        +13.96% over-statement) is the shift imp-3661 already contains, not an outstanding correction.
 *
 * ACCURACY AUDIT / DERIVATION ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3661-sigma-crossover-tc-density-corrected-pin (the propagation this audits; density-corrected pin)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (density-corrected shrink 0.3870 vs bare 0.4410)
 * @see imp-3620-sigma-crossover-tc-closedform-pin (the bare-log 0.4410 pin, present only as comparison)
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (asserts imp-3661 propagated this scale)
 * @see imp-3604-sigma-crossover-flow-factor-invariance (flat flow-factor bracket [1, 1.000474])
 */

import { IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN } from './imp-3661-sigma-crossover-tc-density-corrected-pin.js';

const TC_A1_TRAP = 2.37e-4; // A1 Theta-trap worst case the shrink factor multiplies (imp-2644)
const BARE_FACTOR = 0.4410; // imp-398/imp-3620 stale bare-log 9.1981/20.8576
const DENSITY_FACTOR = 0.3870; // imp-3642 density-corrected (9.1981-log2pi)/(20.8576-log2pi)

// Read what imp-3661 actually consumed from its own exported crossover-scale node (authoritative).
const BRIDGE = IMP3661_SIGMA_CROSSOVER_TC_DENSITY_CORRECTED_PIN.crossoverScaleFactor;
const CONSUMED_TC = BRIDGE.tc_x_density; // t_c(N_x) imp-3661 fed into E_flow (density-corrected)
const BARE_TC_COMPARISON = BRIDGE.tc_x_bare_imp3620; // imp-3620 bare-log value, kept only for comparison
const CONSUMED_FACTOR = CONSUMED_TC / TC_A1_TRAP; // shrink factor imp-3661 multiplied the trap by
const BARE_FACTOR_COMPARISON = BARE_TC_COMPARISON / TC_A1_TRAP; // ~0.4410, NOT consumed

const USED_DENSITY = Math.abs(CONSUMED_FACTOR - DENSITY_FACTOR) < Math.abs(CONSUMED_FACTOR - BARE_FACTOR);
const REPOINT_NEEDED = !USED_DENSITY; // false: imp-3661 already density-corrected

export const IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT = {
  id: 'imp-3710',
  proofSection: 'S-frontier',
  question:
    'Did the imp-3661 propagation of the crossover scale into the E(N) bridge constants consume the ' +
    'imp-398/imp-3620 STALE bare-log 0.4410 anchor-to-crossover factor, or the imp-3642 density-corrected ' +
    '0.3870? Measure which factor imp-3661 actually multiplied the A1 trap 2.37e-4 by, quantify the shift ' +
    'if stale, and record whether a re-point is needed. Accuracy audit only; no new bound, no QED.',
  consumedFactor: +CONSUMED_FACTOR.toFixed(4), // 0.3870: density-corrected
  bareFactorComparison: +BARE_FACTOR_COMPARISON.toFixed(4), // 0.4410: imp-3620, present only for comparison
  densityFactorReference: DENSITY_FACTOR,
  bareFactorReference: BARE_FACTOR,
  consumedFlowFactor_cg1: BRIDGE.flowFactor_density_cg1, // 1.0000917 (density-corrected pin fed into E_flow)
  staleFlowFactor_cg1_counterfactual: BRIDGE.flowFactor_bare_cg1_imp3620, // 1.0001045 (would-be bare-log pin)
  consumedBracketFraction: BRIDGE.bracketFraction_density_cg1, // ~0.1935 (density-corrected occupancy)
  staleBracketFraction_counterfactual: BRIDGE.bracketFraction_bare_cg1_imp3620, // 0.2205 (would-be bare occupancy)
  counterfactualOverstatePct: BRIDGE.overstate_pct, // ~13.96%: over-statement imp-3661 already absorbed
  usedDensityCorrected: USED_DENSITY, // true
  repointNeeded: REPOINT_NEEDED, // false
  finding: {
    F1_consumed_density_factor:
      'imp-3661 consumed the imp-3642 density-corrected shrink factor ' + CONSUMED_FACTOR.toFixed(4) +
      ' (= t_c(N_x)/2.37e-4 = ' + CONSUMED_TC.toExponential(4) + '/2.37e-4), matching 0.3870, NOT the ' +
      'stale imp-398/imp-3620 bare-log ' + BARE_FACTOR_COMPARISON.toFixed(4) + '. The bare-log 0.4410 ' +
      'survives in imp-3661 only as a labeled imp-3620 side-by-side comparison; the E(N)-bridge flow ' +
      'factor (parts() E_flow and both root-solves) is fed the density-corrected collisionTimeDensity.',
    F2_no_repoint_needed:
      'NO re-point is needed. The imp-3661 E(N)-bridge flow factor ' +
      BRIDGE.flowFactor_density_cg1.toFixed(7) + ' (~' + (BRIDGE.bracketFraction_density_cg1 * 100).toFixed(1) +
      '% of the imp-3604 bracket) is already the density-corrected pin. The counterfactual stale shift -- ' +
      'bare-log ' + BARE_FACTOR.toFixed(4) + ' -> flow factor ' + BRIDGE.flowFactor_bare_cg1_imp3620.toFixed(7) +
      ' (~' + (BRIDGE.bracketFraction_bare_cg1_imp3620 * 100).toFixed(1) + '%), +' + BRIDGE.overstate_pct.toFixed(2) +
      '% over-statement -- is exactly what imp-3661 ALREADY absorbed, not an outstanding correction.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY AUDIT (frontier-direction, NOT rigorous). Reading the imp-3661 exported crossover-scale ' +
    'node, the shrink factor it multiplied the A1 trap 2.37e-4 by is t_c(N_x)/2.37e-4 = ' +
    CONSUMED_TC.toExponential(4) + '/2.37e-4 = ' + CONSUMED_FACTOR.toFixed(4) + ', matching the imp-3642 ' +
    'density-corrected 0.3870 and NOT the imp-398/imp-3620 stale bare-log 0.4410 (which appears in ' +
    'imp-3661 only as a labeled comparison). imp-3661s E(N)-bridge propagation -- the parts() E_flow term ' +
    'and both root-solves -- takes collisionTimeDensity, so the flow factor fed into E(N) is the ' +
    'density-corrected 1.0000917 (C_G=1, ~19.3% of the imp-3604 bracket), NOT the bare-log 1.0001045 ' +
    '(22.05%). Therefore imp-3661 is CLEAN: NO re-point is needed, and the queued imp-3620/imp-3604 ' +
    're-point does not need to touch it. The counterfactual stale-factor shift (bare 0.4410 -> 1.0001045, ' +
    '22.05%, +13.96% over-statement) is the shift imp-3661 already contains. Accuracy audit / derivation ' +
    'only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.',
  citation:
    'imp-3661 (density-corrected pin, t_c(N_x)=9.1714e-5, flow factor 1.0000917, ~19.3% bracket); imp-3642 ' +
    '(density-corrected shrink 0.3870 vs bare 0.4410, +13.96% over-statement); imp-3620 (bare-log pin, ' +
    't_c(N_x)=1.0452e-4, flow factor 1.0001045, 22.05%); imp-3604 (flat bracket [1,1.000474]); imp-3671 ' +
    '(asserts imp-3661 propagated exactly this scale into the E(N) bridge constants).',
};

export const IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT_ASSERTIONS = [
  {
    // (F1) The consumed shrink factor matches the density-corrected 0.3870, not the bare-log 0.4410.
    id: 'imp3710-consumed-factor-is-density',
    description: 'imp-3661 consumed the density-corrected 0.3870 factor, not the stale bare-log 0.4410',
    holds: () =>
      USED_DENSITY === true &&
      Math.abs(CONSUMED_FACTOR - DENSITY_FACTOR) < 1e-3 &&
      Math.abs(CONSUMED_FACTOR - BARE_FACTOR) > 5e-2 &&
      Math.abs(BARE_FACTOR_COMPARISON - BARE_FACTOR) < 1e-3,
  },
  {
    // (F1) The consumed flow factor is the density-corrected pin, below the counterfactual bare-log pin.
    id: 'imp3710-consumed-flow-factor-density',
    description: 'consumed E(N) flow factor is the density-corrected 1.0000917, below the bare-log 1.0001045',
    holds: () =>
      BRIDGE.flowFactor_density_cg1 > 1 &&
      BRIDGE.flowFactor_density_cg1 < BRIDGE.flowFactor_bare_cg1_imp3620 &&
      BRIDGE.bracketFraction_density_cg1 < BRIDGE.bracketFraction_bare_cg1_imp3620,
  },
  {
    // (F2) No re-point is needed; the counterfactual over-statement is already absorbed by imp-3661.
    id: 'imp3710-no-repoint-needed',
    description: 'no re-point needed: imp-3661 already density-corrected; counterfactual over-statement ~13.96%',
    holds: () =>
      REPOINT_NEEDED === false &&
      Math.abs(IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT.counterfactualOverstatePct - 13.96) < 0.5,
  },
  {
    // Honesty gate: accuracy audit only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3710-honesty-gate-no-qed',
    description: 'Accuracy audit only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT.verdict),
  },
];

for (const a of IMP3710_IMP3661_DENSITY_FACTOR_CONSUMED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3710-imp3661-density-factor-consumed-audit assertion failed: ${a.id}`);
  }
}
