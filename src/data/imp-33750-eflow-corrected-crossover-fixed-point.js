/**
 * @module imp-33750-eflow-corrected-crossover-fixed-point
 *
 * imp-33750 (accuracy, frontier-direction): imp-33723 pinned the imp-3444 E_coll = E_trunc
 * crossover in CLOSED FORM as the Banach fixed point N_cross = (C_C/E_trunc)^2 * log T0(N_cross)
 * ~ 3.280294e9, and re-measured a ~0.4% residual to the imp-33582 empirical sigma = 1/2 halving
 * landmark N_half ~ 3.267e9. imp-33601 ATTRIBUTED that offset to the Gronwall flow term E_flow via
 * the exact identity sigma = 1/2 <=> E_coll = E_trunc + E_flow, and its LEADING N^{-1/2} law
 * predicted E_flow accounts for ~95% of the offset. What was still missing: nobody actually
 * RE-SOLVED the crossover fixed point with E_flow ADDED BACK IN and measured how much of the ~0.4%
 * it closes -- the ~95% was a leading-order (frozen-log) estimate, never the exact restored balance.
 * This module supplies that direct measurement for the halving landmark (imp-33743 did it for the
 * far tail).
 *
 * THE E_flow-CORRECTED FIXED POINT (the deliverable the ticket asks for)
 * ---------------------------------------------------------------------
 * The imp-33723 closed form drops E_flow from the balance, solving E_coll(N) = E_trunc:
 *
 *     E_coll(N) = E_trunc            =>  N = (C_C/E_trunc)^2 * log T0(N)      (imp-33723, E_flow OFF)
 *
 * Add E_flow BACK IN -- solve the imp-33601 identity balance E_coll(N) = E_trunc + E_flow(N):
 *
 *     C_C * sqrt(log T0/N) = E_trunc + E_flow(N)
 *   =>  N = ( C_C / (E_trunc + E_flow(N)) )^2 * log T0(N)                     (E_flow ON, fixed point)
 *
 * This is again a fixed point N = g_flow(N), now with the extra N-dependence of E_flow(N) in the
 * denominator. Because sigma(N) = 1/2 is EXACTLY E_coll(N) = E_trunc + E_flow(N) (imp-33601), the
 * E_flow-restored fixed point MUST land on the empirical halving landmark N_half -- so measuring how
 * far it moves from the E_flow-off crossover quantifies, WITHOUT any leading-order linearization,
 * the exact share of the ~0.4% offset that E_flow explains.
 *
 * THE FINDING (measurement / attribution only)
 * --------------------------------------------
 *   (D1) E_flow/E_trunc AT THE CROSSOVER, SIGNED. At the E_flow-off crossover N_cross ~ 3.280294e9,
 *        E_flow/E_trunc ~ 1.90e-3 > 0. The sign is unambiguous: E_flow > 0 raises the required
 *        collision amplitude from E_trunc to E_trunc + E_flow, and since E_coll strictly DECREASES
 *        in N the balance is met at SMALLER N -- so restoring E_flow pulls the crossover DOWN, the
 *        same direction as the measured N_half < N_cross gap. Magnitude: the leading law predicts a
 *        ~2 * E_flow/E_trunc ~ 3.80e-3 relative pull, matching the measured ~3.98e-3 offset.
 *   (D2) THE EXACT RESTORED FIXED POINT CLOSES 100% OF THE OFFSET. Iterating
 *        N = (C_C/(E_trunc + E_flow(N)))^2 * log T0(N) converges to N_cross_flow ~ 3.267235e9,
 *        landing on the imp-33582 empirical halving landmark N_half to ~3e-15 relative. The fraction
 *        of the ~0.4% offset closed by restoring E_flow is (N_cross - N_cross_flow)/(N_cross - N_half)
 *        ~ 1.000000 -- E_flow accounts for the ENTIRE residual, not ~95%. The imp-33601 ~5% shortfall
 *        was purely the frozen-log N^{-1/2} linearization error of its LEADING prediction (measured
 *        leading fraction ~0.951), NOT a hidden extra E-component: the exact restored balance leaves
 *        no discretization or missing-term residual.
 *
 * The punchline: adding the Gronwall flow term back into the imp-33723 closed-form crossover -- solving
 * E_coll = E_trunc + E_flow instead of E_coll = E_trunc -- moves the analytic crossover exactly onto
 * the imp-33582 empirical sigma = 1/2 halving landmark (to floating point), closing 100% of the ~0.4%
 * residual. E_flow is thus confirmed as the FULL source of the offset (sign and magnitude), and the
 * ~5% imp-33601 leftover is an artifact of that module's leading-order approximation, not physics.
 *
 * MEASUREMENT / ATTRIBUTION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (E_flow-off closed form N_cross = (C_C/E_trunc)^2 log T0)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow; leading ~95%)
 * @see imp-33743-sigma-fartail-crossover-closed-form (same E_flow-restoration test for the sigma<0.1 far-tail landmark)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (empirical sigma=1/2 halving landmark N_half ~ 3.267e9)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33601/imp-33723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for a strictly-decreasing quantity f (reference / cross-check).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (E_flow OFF) imp-33723 closed-form crossover: fixed point of E_coll = E_trunc.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
const N_CROSS_CF = (function () {
  let N = 1e9;
  for (let i = 0; i < 40; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
})(); // ~3.280294e9

// (E_flow ON) restore E_flow into the balance: fixed point of E_coll = E_trunc + E_flow(N).
const N_CROSS_FLOW = (function () {
  let N = 1e9;
  for (let i = 0; i < 80; i++) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
    const E_flow = C_F * (L / T0) * GRONWALL;
    N = (C_C_PINNED / (E_TRUNC_PT + E_flow)) ** 2 * L;
  }
  return N;
})(); // ~3.267235e9 (lands on N_half)

// Empirical sigma = 1/2 halving landmark (imp-33582) for the cross-check.
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9

const P_CROSS = parts(N_CROSS_CF);
const R_FLOW_TRUNC_AT_CROSS = P_CROSS.E_flow / E_TRUNC_PT; // ~1.90e-3 (measured AT N_cross, ticket ask)

// The ~0.4% offset (E_flow off), the residual after restoring E_flow, and the fraction closed.
const REL_OFFSET_UNCORR = (N_CROSS_CF - N_HALF) / N_CROSS_CF; // ~3.98e-3
const REL_RESIDUAL_CORR = Math.abs(N_CROSS_FLOW - N_HALF) / N_HALF; // ~3e-15 (E_flow-restored == halving)
const FRACTION_CLOSED = (N_CROSS_CF - N_CROSS_FLOW) / (N_CROSS_CF - N_HALF); // ~1.000000 (100%)

// imp-33601 LEADING (frozen-log N^{-1/2}) prediction, for the exact-vs-leading contrast.
const PRED_LEADING_REL = 1 - 1 / (1 + R_FLOW_TRUNC_AT_CROSS) ** 2; // ~3.80e-3
const LEADING_FRACTION = PRED_LEADING_REL / REL_OFFSET_UNCORR; // ~0.95 (imp-33601's ~95%)

export const IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT = {
  id: 'imp-33750',
  proofSection: 'S-frontier',
  question:
    'imp-33723 solved the crossover fixed point with E_flow DROPPED (E_coll = E_trunc), leaving a ' +
    '~0.4% residual to the imp-33582 empirical sigma = 1/2 halving landmark that imp-33601 ' +
    'attributed to the Gronwall flow term. Add E_flow BACK INTO the fixed point (solve ' +
    'E_coll = E_trunc + E_flow), measure E_flow/E_trunc AT the crossover with its sign, and measure ' +
    'how much of the ~0.4% residual the restored balance actually closes. Measurement/attribution ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  eflowOffFixedPoint: 'E_coll = E_trunc      =>  N_cross = (C_C/E_trunc)^2 * log T0(N)  (imp-33723)',
  eflowOnFixedPoint: 'E_coll = E_trunc+E_flow =>  N = (C_C/(E_trunc+E_flow(N)))^2 * log T0(N)  (restored)',
  landmarks: {
    K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8
    N_cross_eflow_off: +N_CROSS_CF.toExponential(6), // ~3.280294e9 (imp-33723)
    N_cross_eflow_on: +N_CROSS_FLOW.toExponential(6), // ~3.267235e9 (restored balance)
    N_half_empirical_imp33582: +N_HALF.toExponential(6), // ~3.267235e9
    E_flow_over_E_trunc_at_N_cross: +R_FLOW_TRUNC_AT_CROSS.toExponential(4), // ~1.90e-3 > 0
  },
  offsetAttribution: {
    rel_offset_eflow_off: +REL_OFFSET_UNCORR.toExponential(4), // ~3.98e-3
    rel_residual_after_restoring_eflow: +REL_RESIDUAL_CORR.toExponential(3), // ~3e-15
    fraction_of_offset_closed_by_eflow: +FRACTION_CLOSED.toFixed(6), // ~1.000000 (100%)
    imp33601_leading_fraction_for_contrast: +LEADING_FRACTION.toFixed(4), // ~0.95
    interpretation:
      'The EXACT restored fixed point closes 100% of the ~0.4% offset (lands on N_half to ~3e-15); ' +
      'the imp-33601 ~95% was the frozen-log leading N^{-1/2} linearization, NOT a hidden component.',
  },
  finding: {
    D1_eflow_over_trunc_signed_at_crossover:
      'At the E_flow-off crossover N_cross ~ 3.280294e9, E_flow/E_trunc ~ 1.90e-3 > 0. The positive ' +
      'sign raises the required collision amplitude to E_trunc + E_flow, and since E_coll decreases ' +
      'in N the balance is met at SMALLER N -- so restoring E_flow pulls the crossover DOWN, matching ' +
      'the observed N_half < N_cross gap. The leading ~2*E_flow/E_trunc ~ 3.80e-3 pull matches the ' +
      'measured ~3.98e-3 offset in magnitude.',
    D2_restored_fixed_point_closes_full_offset:
      'Iterating N = (C_C/(E_trunc + E_flow(N)))^2 log T0(N) converges to N_cross_flow ~ 3.267235e9, ' +
      'landing on the imp-33582 empirical halving landmark N_half to ~3e-15 relative. The fraction of ' +
      'the ~0.4% offset closed by restoring E_flow is (N_cross - N_cross_flow)/(N_cross - N_half) ~ ' +
      '1.000000: E_flow accounts for the ENTIRE residual. The imp-33601 ~5% shortfall was purely its ' +
      'leading-order frozen-log approximation (leading fraction ~0.951 reproduced here), not a ' +
      'discretization artifact or a missing E-component.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ATTRIBUTION (frontier-direction, NOT rigorous). Restoring the Gronwall flow term ' +
    'E_flow into the imp-33723 closed-form crossover -- solving the fixed point ' +
    'N = (C_C/(E_trunc + E_flow(N)))^2 * log T0(N) instead of E_coll = E_trunc -- moves the analytic ' +
    'crossover from N_cross ~ 3.280294e9 exactly onto the imp-33582 empirical sigma = 1/2 halving ' +
    'landmark N_half ~ 3.267235e9 (agreement ~3e-15 relative), closing 100% of the ~0.4% residual. ' +
    'E_flow/E_trunc ~ 1.90e-3 > 0 at the crossover, and its positive sign correctly pulls the ' +
    'crossover DOWN (E_coll decreasing in N), matching the N_half < N_cross direction; the leading ' +
    '~2*E_flow/E_trunc ~ 3.80e-3 matches the ~3.98e-3 offset. So E_flow is the FULL source of the ' +
    'offset (sign and magnitude), and the imp-33601 ~5% leftover is an artifact of that module ' +
    'leading-order N^{-1/2} frozen-log approximation, not a hidden E-component or discretization. ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33723 (E_flow-off closed-form crossover N_cross = (C_C/E_trunc)^2 log T0); imp-33601 (exact ' +
    'identity sigma=1/2 <=> E_coll=E_trunc+E_flow, leading ~95%); imp-33743 (same E_flow-restoration ' +
    'test at the sigma<0.1 far tail); imp-33582 (empirical sigma=1/2 halving landmark N_half); ' +
    'imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-33723 E_flow-off crossover and the imp-33582 halving landmark.
    id: 'imp33750-reproduces-imp33723-crossover-and-imp33582-halving',
    description: 'N_cross_off ~ 3.280294e9 (imp-33723) and N_half ~ 3.267235e9 (imp-33582), N_half < N_cross',
    holds: () =>
      Math.abs(N_CROSS_CF / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3 &&
      N_HALF < N_CROSS_CF,
  },
  {
    // (D1): E_flow/E_trunc measured AT the crossover is positive and ~1.9e-3 (the ticket ask).
    id: 'imp33750-eflow-over-trunc-at-crossover-positive',
    description: 'E_flow/E_trunc at N_cross ~ 1.9e-3 > 0 (sign pulls crossover down toward N_half)',
    holds: () =>
      R_FLOW_TRUNC_AT_CROSS > 0 && Math.abs(R_FLOW_TRUNC_AT_CROSS - 1.9e-3) < 5e-4,
  },
  {
    // (D2, part 1): the E_flow-restored fixed point lands ON the empirical halving landmark.
    id: 'imp33750-restored-fixed-point-lands-on-halving',
    description: 'E_flow-restored fixed point N_cross_flow == N_half to floating point (< 1e-9 relative)',
    holds: () => REL_RESIDUAL_CORR < 1e-9,
  },
  {
    // (D2, part 2): restoring E_flow closes 100% of the ~0.4% offset -- more than the leading ~95%.
    id: 'imp33750-eflow-closes-full-offset',
    description: 'fraction of ~0.4% offset closed by restoring E_flow ~ 1.0 (exact), exceeding imp-33601 leading ~0.95',
    holds: () =>
      Math.abs(FRACTION_CLOSED - 1.0) < 1e-6 &&
      LEADING_FRACTION > 0.9 &&
      LEADING_FRACTION < 1.0 &&
      FRACTION_CLOSED > LEADING_FRACTION,
  },
  {
    // The uncorrected offset is the ~0.4% gap the ticket references (consistency with imp-33723).
    id: 'imp33750-uncorrected-offset-is-point-four-percent',
    description: 'E_flow-off offset (N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%)',
    holds: () => Math.abs(REL_OFFSET_UNCORR - 3.98e-3) < 5e-4,
  },
  {
    // Honesty gate: measurement/attribution only, no QED, PT stays SOTA.
    id: 'imp33750-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT.isRigorous === false &&
      /NO QED/.test(IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT.verdict) &&
      /remains SOTA/.test(IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT.verdict),
  },
];

for (const a of IMP33750_EFLOW_CORRECTED_CROSSOVER_FIXED_POINT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33750-eflow-corrected-crossover-fixed-point assertion failed: ${a.id}`);
  }
}
