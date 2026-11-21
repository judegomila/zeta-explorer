/**
 * @module imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation
 *
 * imp-35135 (numerical, frontier-direction): imp-33848 proved the strict ordering
 * N_half < N_cross, whose sign rests on the Gronwall flow surplus E_flow(N_cross) > 0
 * (imp-398). imp-35041 then reported that deep in the far tail E_flow is negligible,
 * E_flow/E_coll < 5e-4 (~4.2e-5 at the sigma < 0.01 crossing, ~5.7e-6 at sigma < 0.001).
 * Those two facts sit in apparent tension: a term the ordering NEEDS strictly positive is
 * simultaneously called negligible. This module reconciles them by MEASURING the far-tail
 * E_flow decay exponent against E_coll's -1/2 across the N in [1e6, 1e16] ladder, showing
 * E_flow vanishes a full power of N FASTER than E_coll (so the ratio -> 0) while remaining a
 * product of strictly positive factors (so E_flow > 0 at every finite N). Negligible is not
 * zero.
 *
 * THE QUANTITIES (identical sub-terms to imp-3220 / imp-33582 / imp-35041 -- no fresh model)
 * -----------------------------------------------------------------------------------------
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     C_F    = (log(T0/2pi) + 1) / 2pi             (imp-398 pinned prefactor)
 *     E_flow = C_F * (log T0 / T0) * Gronwall      (unconditionally rigorous; STRICTLY > 0)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional C_H; ~ sqrt(1/N))
 * Because T0 ~ 2pi N / log N (RvM), E_flow ~ (log T0)^2 / (2pi T0) ~ (log N)^3 / N decays like
 * N^(-1) up to log powers, whereas E_coll decays like N^(-1/2); hence E_flow/E_coll ~ N^(-1/2).
 *
 * THE MEASUREMENT: local log-log decay exponents on the far-tail ladder
 * --------------------------------------------------------------------
 *   For each N in {1e6, ..., 1e16} the local exponent d(log X)/d(log N) is estimated by a
 *   central log-log difference for X = E_flow, E_coll, and the ratio E_flow/E_coll, alongside
 *   the exponent GAP (E_flow exponent minus E_coll exponent).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) E_flow DECAYS ~ ONE FULL POWER OF N. Its local exponent drifts from ~-0.77 at N = 1e6
 *        toward ~-0.91 at N = 1e16, approaching the leading -1 from above with (log N)-power
 *        corrections -- almost exactly twice as steep as E_coll.
 *   (F2) E_coll DECAYS ~ HALF A POWER. Its local exponent sits at ~-0.47 to ~-0.49 across the
 *        ladder, approaching -1/2 from above (the sqrt(1/N) law, imp-3463 far-tail exponent).
 *   (F3) THE GAP IS ~ -1/2 AND DEEPENING. E_flow_exponent - E_coll_exponent runs from ~-0.31
 *        (N = 1e6) to ~-0.43 (N = 1e16), heading for -1/2: so E_flow/E_coll itself decays like
 *        N^(-1/2), consistent with the imp-35041 crossings (ratio ~4.4e-6 at N = 1e16).
 *   (F4) RECONCILIATION. At every rung E_flow is a product of STRICTLY POSITIVE factors
 *        (C_F > 0 for T0 > 2pi/e, log T0 / T0 > 0, Gronwall > 0), so E_flow > 0 at every finite
 *        N (e.g. E_flow ~ 9.92e-14 at N = 1e16). It is negligible RELATIVE to E_coll -- the
 *        ratio -> 0 -- but never itself zero. The imp-33848 strictness (which needs only the
 *        SIGN of E_flow, not its size) and the imp-35041 negligibility (a statement about the
 *        RATIO) are therefore fully compatible: E_flow vanishes faster than E_coll without
 *        vanishing at any finite N.
 *
 * The punchline: on the identical inherited surrogate, E_flow decays with a local exponent
 * approaching -1 while E_coll approaches -1/2, so their ratio decays like ~N^(-1/2) and drops
 * below 5e-4 deep in the tail -- yet E_flow, a product of strictly positive factors, stays
 * strictly positive at every finite N. imp-33848's E_flow > 0 strictness (a sign fact) and
 * imp-35041's E_flow/E_coll < 5e-4 negligibility (a ratio fact) are reconciled, not in tension.
 *
 * MEASUREMENT / FIT ONLY. Decay-exponent diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33848-nhalf-ncross-strict-ordering-closed-form (E_flow > 0 strictness the ordering rests on)
 * @see imp-35041-sigma-deep-tail-threshold-extension (E_flow/E_coll < 5e-4 negligibility reconciled here)
 * @see imp-398 (C_F Gronwall flow prefactor)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35041/imp-33582 exactly

// EXACT imp-35041 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor, > 0 for T0 > 2pi/e
  return C_F * (L / T0) * GRONWALL; // product of strictly positive factors
}
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N); // GUE-conditional (C_H)
}
const ratio = (N) => eFlow(N) / eColl(N);

// Local log-log decay exponent d(log X)/d(log N) via a central difference in N.
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

const LADDER = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16];

const RUNGS = LADDER.map((N) => {
  const ef = eFlow(N);
  const ec = eColl(N);
  const expF = localExponent(eFlow, N);
  const expC = localExponent(eColl, N);
  return {
    N: +N.toExponential(0),
    eFlow: +ef.toExponential(4),
    eColl: +ec.toExponential(4),
    ratio: +(ef / ec).toExponential(4),
    expEflow: +expF.toFixed(4),
    expEcoll: +expC.toFixed(4),
    exponentGap: +(expF - expC).toFixed(4),
  };
});

const TOP = RUNGS[0]; // N = 1e6
const DEEP = RUNGS[RUNGS.length - 1]; // N = 1e16
const RATIO_EXP_DEEP = +localExponent(ratio, 1e16).toFixed(4); // ~ -0.43, heading for -1/2
const ALL_EFLOW_POSITIVE = RUNGS.every((r) => r.eFlow > 0);

export const IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION = {
  id: 'imp-35135',
  proofSection: 'S-frontier',
  question:
    'Measure the far-tail E_flow decay exponent (N up to ~1e16) against E_coll -1/2 and reconcile ' +
    'the imp-33848 strict-positivity requirement E_flow > 0 with the imp-35041 negligibility ' +
    'E_flow/E_coll < 5e-4. Measurement only on the inherited surrogate; changes no bound; no QED.',
  measuredQuantity:
    'local log-log decay exponents d(log X)/d(log N) for X = E_flow, E_coll and the ratio ' +
    'E_flow/E_coll across N in [1e6, 1e16], plus the exponent gap (E_flow exp - E_coll exp)',
  ladder: RUNGS,
  topRung: { N: TOP.N, eFlow: TOP.eFlow, eColl: TOP.eColl, ratio: TOP.ratio, expEflow: TOP.expEflow, expEcoll: TOP.expEcoll },
  deepRung: { N: DEEP.N, eFlow: DEEP.eFlow, eColl: DEEP.eColl, ratio: DEEP.ratio, expEflow: DEEP.expEflow, expEcoll: DEEP.expEcoll },
  ratioExponentDeep: RATIO_EXP_DEEP, // ~ -0.43 at 1e16, deepening toward -1/2
  farTailExponent: 0.5, // imp-3463 asymptote for E_coll
  allEflowStrictlyPositive: ALL_EFLOW_POSITIVE,
  finding: {
    F1_eflow_decays_full_power:
      'E_flow local exponent drifts from ~-0.77 at N = 1e6 toward ~-0.91 at N = 1e16, approaching ' +
      'the leading -1 from above with (log N)-power corrections -- roughly twice as steep as E_coll.',
    F2_ecoll_decays_half_power:
      'E_coll local exponent sits at ~-0.47 to ~-0.49 across the ladder, approaching -1/2 from ' +
      'above -- the sqrt(1/N) far-tail law (imp-3463 exponent 1/2).',
    F3_gap_heads_to_half:
      'The exponent gap (E_flow - E_coll) runs from ~-0.31 (1e6) to ~-0.43 (1e16), heading for ' +
      '-1/2, so E_flow/E_coll itself decays like N^(-1/2), consistent with imp-35041 (ratio ' +
      '~4.4e-6 at N = 1e16).',
    F4_reconciliation:
      'At every rung E_flow is a product of STRICTLY POSITIVE factors (C_F > 0, log T0/T0 > 0, ' +
      'Gronwall > 0), so E_flow > 0 at every finite N (~9.92e-14 at 1e16). It is negligible ' +
      'RELATIVE to E_coll (ratio -> 0) but never itself zero: imp-33848 needs only the SIGN of ' +
      'E_flow, imp-35041 reports the RATIO, so the strictness and the negligibility are compatible.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). On the identical inherited surrogate, E_flow ' +
    'decays with a local log-log exponent approaching -1 (~-0.77 -> ~-0.91 over N in [1e6, 1e16]) ' +
    'while E_coll approaches -1/2 (~-0.47 -> ~-0.49), so their ratio decays like ~N^(-1/2) and ' +
    'drops below 5e-4 deep in the tail (~4.4e-6 at 1e16) -- yet E_flow, a product of strictly ' +
    'positive factors, stays strictly positive at every finite N (~9.92e-14 at 1e16). The ' +
    'imp-33848 E_flow > 0 strictness (a SIGN fact the ordering needs) and the imp-35041 ' +
    'E_flow/E_coll < 5e-4 negligibility (a RATIO fact) are reconciled, not in tension: E_flow ' +
    'vanishes a full power of N faster than E_coll without vanishing at any finite N. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33848 (E_flow > 0 strict ordering reconciled here); imp-35041 (E_flow/E_coll < 5e-4 ' +
    'negligibility); imp-398 (C_F Gronwall flow prefactor); imp-3463 (far-tail exponent 1/2); ' +
    'imp-486 (C_mb GUE-conditional, UNTOUCHED); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: the E_flow/E_coll ratio at the deep rung reproduces the imp-35041 far-tail
    // negligibility (< 5e-4), proving the identical inherited sub-terms are in use.
    id: 'imp35135-reproduces-imp35041-negligibility',
    description: 'E_flow/E_coll < 5e-4 at N = 1e16 (imp-35041 far-tail negligibility)',
    holds: () => DEEP.ratio < 5e-4 && DEEP.ratio > 0,
  },
  {
    // (F1)+(F2): E_flow decays strictly faster (more negative exponent) than E_coll at the deep
    // rung, with E_flow near -1 and E_coll near -1/2.
    id: 'imp35135-eflow-steeper-than-ecoll',
    description: 'E_flow exponent (~-0.91) is more negative than E_coll (~-0.49) at N = 1e16',
    holds: () =>
      DEEP.expEflow < DEEP.expEcoll &&
      DEEP.expEflow < -0.85 &&
      DEEP.expEflow > -1.0 &&
      DEEP.expEcoll < -0.45 &&
      DEEP.expEcoll > -0.5,
  },
  {
    // (F3): the exponent gap deepens toward -1/2 across the ladder (top less negative than deep),
    // and the ratio local exponent at 1e16 sits near -1/2.
    id: 'imp35135-gap-deepens-toward-half',
    description: 'exponent gap deepens (~-0.31 -> ~-0.43) and ratio exponent ~-0.43 at 1e16',
    holds: () =>
      DEEP.exponentGap < TOP.exponentGap &&
      DEEP.exponentGap < -0.4 &&
      DEEP.exponentGap > -0.5 &&
      RATIO_EXP_DEEP < -0.4 &&
      RATIO_EXP_DEEP > -0.5,
  },
  {
    // (F4) reconciliation: E_flow is strictly positive at every rung including the deepest.
    id: 'imp35135-eflow-strictly-positive-everywhere',
    description: 'E_flow > 0 at every rung (product of strictly positive factors), ~9.9e-14 at 1e16',
    holds: () => ALL_EFLOW_POSITIVE && DEEP.eFlow > 0 && DEEP.eFlow < 1e-12,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35135-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.isRigorous === false &&
      IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.verdict),
  },
];

for (const a of IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation assertion failed: ${a.id}`,
    );
  }
}
