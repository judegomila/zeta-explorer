/**
 * @module imp-35102-nhalf-ncross-strictness-multirung-verify
 *
 * imp-35102 (accuracy, frontier-direction): imp-33848 reduced the strict ordering
 * N_half < N_cross (the sigma = 1/2 halving landmark strictly below the E_coll = E_trunc
 * crossover) to TWO closed-form conditions within the inherited imp-3220/imp-3406 component
 * model:
 *
 *     (C1)  E_flow(N_cross) > 0        -- the imp-398 Gronwall flow term strictly positive
 *     (C2)  sigma strictly decreasing on [N_half, N_cross]
 *
 * Together (C1) forces sigma(N_cross) = E_trunc/(2 E_trunc + E_flow) = 1/(2 + E_flow/E_trunc)
 * to sit strictly BELOW 1/2 = sigma(N_half), and (C2) converts that sigma-ordering into the
 * N-ordering N_half < N_cross. imp-33848 checked both only at the single recomputed pair
 * (~3.267e9 < ~3.280e9). This module VERIFIES both conditions at additional INDEPENDENT N
 * rungs bracketing the crossover -- fixed N landmarks, NOT bisected from the located pair --
 * so the strict ordering is certified STRUCTURAL, not a two-point coincidence of the
 * recomputed values.
 *
 * THE COMPONENT MODEL (identical pinned sub-terms to imp-33601 / imp-33848 -- no fresh terms)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)          (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall, C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                                 (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)                  (Riemann-von Mangoldt inverse)
 *
 * THE SURPLUS IDENTITY (imp-33848, restated and checked here)
 * ----------------------------------------------------------
 * At the crossover E_coll = E_trunc, so
 *
 *     sigma(N_cross) = E_trunc / (2 E_trunc + E_flow) = 1 / (2 + E_flow/E_trunc),
 *     surplus := 1/2 - sigma(N_cross) = E_flow / (2 (2 E_trunc + E_flow))  (~ E_flow/(4 E_trunc)).
 *
 * The sigma-space surplus is ~4.74e-4; the N-space gap (N_cross - N_half)/N_cross ~ 3.98e-3
 * (~0.4%) is that surplus AMPLIFIED by the E_coll ~ N^{-1/2} Jacobian: (N-gap) ~ 2 E_flow/E_trunc
 * ~ 8 * surplus. This module reports BOTH and does NOT conflate the sigma-space surplus with
 * the ~0.4% N-space gap -- they are one quantity read on two axes, linked by the known factor.
 *
 * THE FINDING (verification / measurement only)
 * ---------------------------------------------
 *   (V1) (C1) HOLDS AT EVERY RUNG. E_flow(N) > 0 at all nine independent rungs across
 *        [3.20e9, 3.36e9] (which strictly brackets both N_half and N_cross), and at both
 *        located landmarks: E_flow is a product of strictly positive factors (C_F, log T0,
 *        1/T0, Gronwall), so positivity is structural, not a coincidence of one evaluation.
 *   (V2) (C2) HOLDS AT EVERY RUNG. sigma is strictly monotone decreasing across the nine
 *        rungs, and the local slope dsigma/dlog N < 0 at each -- so the sigma-ordering
 *        sigma(N_cross) < sigma(N_half) unambiguously inverts to N_half < N_cross on the
 *        whole bracketing interval, not just at the two recomputed points.
 *   (V3) THE SURPLUS IDENTITY IS EXACT. 1/2 - sigma(N_cross) reproduces both closed forms
 *        E_flow/(2(2 E_trunc + E_flow)) and 1/(2+E_flow/E_trunc) to floating point, and the
 *        ~0.4% N-space gap equals that sigma-surplus times the ~8x N^{-1/2} amplification.
 *
 * The punchline: the two imp-33848 strictness conditions are not two-point artifacts of the
 * ~3.267e9 < ~3.280e9 recompute -- E_flow > 0 and sigma monotone-decreasing both hold across
 * an independent nine-rung bracket, certifying N_half < N_cross as a structural feature of the
 * inherited component model.
 *
 * VERIFICATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33848-nhalf-ncross-strict-ordering-closed-form (the two closed-form conditions)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (source parts(N) model + surplus identity)
 * @see imp-34290-nhalf-ncross-exact-rvm-forward-count (same ordering on the height/count axis)
 * @see imp-34174-crossover-surplus-threshold-family-decay (surplus generalised over thr)
 * @see imp-35121-ecoll-etrunc-eflow-decomposition-viz-data (baked landmark component readout)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaOf = (N) => parts(N).sigma;

// Downslope bisection in log N for a strictly-decreasing quantity f: first N with f < target.
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

// The imp-3444 crossover E_coll = E_trunc, and the imp-33582 sigma = 1/2 halving point.
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const N_HALF = crossBelow(sigmaOf, 0.5, 1e6, 1e18); // ~3.267235e9

// Local slope dsigma/dlog N via a symmetric multiplicative difference (h small).
function sigmaLogSlope(N) {
  const h = 1e-4;
  return (sigmaOf(N * (1 + h)) - sigmaOf(N * (1 - h))) / (2 * h);
}

// INDEPENDENT rungs: nine FIXED N landmarks spanning [3.20e9, 3.36e9], which strictly brackets
// both N_half (~3.267e9) and N_cross (~3.280e9). These are literal N values, NOT bisected from
// the located pair -- so agreement here certifies the ordering is not a two-point coincidence.
const RUNG_NS = Object.freeze([
  3.2e9, 3.23e9, 3.26e9, 3.27e9, 3.28e9, 3.29e9, 3.31e9, 3.34e9, 3.36e9,
]);

const RUNGS = RUNG_NS.map((N) => {
  const p = parts(N);
  return {
    N,
    E_flow: +p.E_flow.toExponential(6), // (C1) target: strictly positive
    E_coll: +p.E_coll.toExponential(6),
    sigma: +p.sigma.toFixed(9),
    dsigma_dlogN: +sigmaLogSlope(N).toExponential(4), // (C2) target: strictly negative
  };
});

// (C1) E_flow(N_cross) > 0 and E_flow > 0 at every independent rung.
const P_CROSS = parts(N_CROSS);
const P_HALF = parts(N_HALF);
const E_FLOW_AT_CROSS = P_CROSS.E_flow;
const C1_ALL_POSITIVE = RUNGS.every((r) => r.E_flow > 0) && E_FLOW_AT_CROSS > 0;

// (C2) sigma strictly decreasing across the rungs, and local slope < 0 at each rung.
let C2_STRICTLY_DECREASING = true;
for (let i = 1; i < RUNGS.length; i++) {
  if (!(RUNGS[i].sigma < RUNGS[i - 1].sigma)) C2_STRICTLY_DECREASING = false;
}
const C2_ALL_SLOPES_NEGATIVE = RUNGS.every((r) => r.dsigma_dlogN < 0);

// (V3) surplus identity at the crossover: 1/2 - sigma(N_cross), two closed forms + measured.
const R_FLOW_TRUNC_CROSS = E_FLOW_AT_CROSS / E_TRUNC_PT; // ~1.9e-3
const SIGMA_CROSS_MEASURED = P_CROSS.sigma; // ~0.499526
const SIGMA_CROSS_CLOSED = 1 / (2 + R_FLOW_TRUNC_CROSS); // = E_trunc/(2 E_trunc + E_flow)
const SURPLUS_MEASURED = 0.5 - SIGMA_CROSS_MEASURED; // ~4.74e-4
const SURPLUS_CLOSED = E_FLOW_AT_CROSS / (2 * (2 * E_TRUNC_PT + E_FLOW_AT_CROSS)); // closed form
const SURPLUS_REL_RESIDUAL = Math.abs(SURPLUS_MEASURED - SURPLUS_CLOSED) / SURPLUS_CLOSED;
const SIGMA_CLOSED_REL_RESIDUAL =
  Math.abs(SIGMA_CROSS_MEASURED - SIGMA_CROSS_CLOSED) / SIGMA_CROSS_CLOSED;

// The ~0.4% N-space gap is the sigma-space surplus amplified by the E_coll ~ N^{-1/2} Jacobian.
const N_GAP = (N_CROSS - N_HALF) / N_CROSS; // ~3.98e-3 (~0.4%)
const N_GAP_OVER_SURPLUS = N_GAP / SURPLUS_MEASURED; // ~8 (the N^{-1/2} amplification factor)

export const IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY = {
  id: 'imp-35102',
  proofSection: 'S-frontier',
  question:
    'Verify the imp-33848 two closed-form strictness conditions for N_half < N_cross -- ' +
    '(C1) E_flow(N_cross) > 0 and (C2) sigma strictly decreasing on [N_half, N_cross] -- at ' +
    'additional INDEPENDENT N rungs bracketing the crossover, confirming the strict ordering is ' +
    'structural, not an artifact of the recomputed ~3.267e9 < ~3.280e9 pair. Verification / ' +
    'measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  conditions: {
    C1: 'E_flow(N_cross) > 0  (imp-398 Gronwall flow term strictly positive)',
    C2: 'sigma strictly decreasing on [N_half, N_cross]  (converts sigma-order to N-order)',
  },
  landmarks: {
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9
    N_cross_Ecoll_eq_Etrunc: +N_CROSS.toExponential(6), // ~3.280294e9
    E_flow_at_N_cross: +E_FLOW_AT_CROSS.toExponential(6), // ~5.81e-8 (C1 target, > 0)
    E_flow_over_E_trunc_at_N_cross: +R_FLOW_TRUNC_CROSS.toExponential(4), // ~1.9e-3
    sigma_at_N_cross_measured: +SIGMA_CROSS_MEASURED.toFixed(6), // ~0.499526
    strict_ordering_holds: N_HALF < N_CROSS,
  },
  rungs: RUNGS,
  surplusIdentity: {
    sigma_cross_measured: +SIGMA_CROSS_MEASURED.toFixed(9),
    sigma_cross_closed_form: +SIGMA_CROSS_CLOSED.toFixed(9), // 1/(2 + E_flow/E_trunc)
    sigma_closed_rel_residual: +SIGMA_CLOSED_REL_RESIDUAL.toExponential(3), // ~floating-point zero
    surplus_measured: +SURPLUS_MEASURED.toExponential(6), // 1/2 - sigma(N_cross), ~4.74e-4
    surplus_closed_form: +SURPLUS_CLOSED.toExponential(6), // E_flow/(2(2 E_trunc + E_flow))
    surplus_rel_residual: +SURPLUS_REL_RESIDUAL.toExponential(3), // ~floating-point zero
    N_space_gap: +N_GAP.toExponential(4), // ~3.98e-3 (~0.4%)
    N_gap_over_sigma_surplus: +N_GAP_OVER_SURPLUS.toFixed(3), // ~8 (N^{-1/2} amplification)
  },
  finding: {
    V1_C1_holds_at_every_rung:
      'E_flow(N) > 0 at all nine independent rungs across [3.20e9, 3.36e9] and at N_cross ' +
      '(E_flow ~5.81e-8): E_flow is a product of strictly positive factors (C_F, log T0, 1/T0, ' +
      'Gronwall), so (C1) is structural, not a single-point coincidence.',
    V2_C2_holds_at_every_rung:
      'sigma is strictly monotone decreasing across the nine rungs and the local slope ' +
      'dsigma/dlog N is negative at each, so the sigma-ordering sigma(N_cross) < sigma(N_half) ' +
      'inverts to N_half < N_cross across the whole bracketing interval, not just the two ' +
      'recomputed points.',
    V3_surplus_identity_exact:
      '1/2 - sigma(N_cross) reproduces both closed forms E_flow/(2(2 E_trunc + E_flow)) and ' +
      '1/(2 + E_flow/E_trunc) to floating point (~4.74e-4); the ~0.4% N-space gap is that ' +
      'sigma-surplus times the ~8x E_coll ~ N^{-1/2} amplification, NOT the same number -- one ' +
      'quantity read on two axes.',
  },
  isRigorous: false,
  verdict:
    'VERIFICATION (frontier-direction, NOT rigorous). Both imp-33848 strictness conditions -- ' +
    '(C1) E_flow(N_cross) > 0 and (C2) sigma strictly decreasing -- hold across an INDEPENDENT ' +
    'nine-rung bracket [3.20e9, 3.36e9] straddling N_half ~3.267e9 and N_cross ~3.280e9, so the ' +
    'strict ordering N_half < N_cross is a STRUCTURAL feature of the inherited imp-3220/imp-3406 ' +
    'component model, not a two-point coincidence of the recomputed values. The surplus identity ' +
    '1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow)) = 1/2 - 1/(2 + E_flow/E_trunc) holds to ' +
    'floating point, and the ~0.4% N-space gap is that ~4.74e-4 sigma-surplus amplified ~8x by the ' +
    'E_coll ~ N^{-1/2} Jacobian. The component model is the inherited extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33848 (two closed-form strictness conditions); imp-33796 (numerical N_half < N_cross); ' +
    'imp-33601 (parts(N) model + surplus identity); imp-33723 (closed-form N_cross); imp-398 ' +
    '(E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3444 crossover and imp-33582 half-crossing landmarks in the
    // strict ordering, proving the identical inherited component model is in use.
    id: 'imp35102-reproduces-nhalf-ncross-ordering',
    description: 'N_half ~3.267e9 < N_cross ~3.280e9 in the inherited component model',
    holds: () =>
      Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3 &&
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      N_HALF < N_CROSS,
  },
  {
    // (V1)/(C1): the Gronwall flow term is strictly positive at N_cross AND at every rung.
    id: 'imp35102-C1-eflow-positive-all-rungs',
    description: 'E_flow(N_cross) > 0 and E_flow > 0 at all nine independent rungs',
    holds: () => C1_ALL_POSITIVE && E_FLOW_AT_CROSS > 0,
  },
  {
    // (V2)/(C2): sigma is strictly decreasing across the rungs and every local slope is < 0,
    // so the ordering is not a two-point coincidence.
    id: 'imp35102-C2-sigma-strictly-decreasing-all-rungs',
    description: 'sigma strictly decreasing across nine rungs; dsigma/dlogN < 0 at each',
    holds: () => C2_STRICTLY_DECREASING && C2_ALL_SLOPES_NEGATIVE,
  },
  {
    // The rung bracket straddles BOTH landmarks (independent evidence, not bisected).
    id: 'imp35102-rungs-bracket-both-landmarks',
    description: 'the nine fixed rungs strictly bracket both N_half and N_cross',
    holds: () =>
      RUNG_NS[0] < N_HALF &&
      N_CROSS < RUNG_NS[RUNG_NS.length - 1] &&
      RUNGS.length === 9,
  },
  {
    // (V3): the surplus identity 1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow))
    // = 1/2 - 1/(2 + E_flow/E_trunc) holds to floating point.
    id: 'imp35102-surplus-identity-exact',
    description: 'surplus 1/2 - sigma(N_cross) matches both closed forms (rel residual < 1e-9)',
    holds: () =>
      SURPLUS_REL_RESIDUAL < 1e-9 &&
      SIGMA_CLOSED_REL_RESIDUAL < 1e-9 &&
      SURPLUS_MEASURED > 0,
  },
  {
    // (V3): the ~0.4% N-space gap is the ~4.74e-4 sigma-surplus amplified by ~8x (NOT equal).
    id: 'imp35102-Ngap-is-surplus-amplified',
    description: 'N-space gap ~3.98e-3 ~ 8x the ~4.74e-4 sigma-surplus (N^{-1/2} Jacobian)',
    holds: () =>
      Math.abs(N_GAP - 3.98e-3) < 5e-4 &&
      Math.abs(SURPLUS_MEASURED - 4.74e-4) < 5e-5 &&
      Math.abs(N_GAP_OVER_SURPLUS - 8) < 1.5,
  },
  {
    // Honesty gate: verification/measurement only, no QED, no refereed bound is changed.
    id: 'imp35102-honesty-gate-no-qed',
    description: 'Verification only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY.isRigorous === false &&
      /NO QED/.test(IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY.verdict) &&
      /refereed bound is changed/i.test(IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY.verdict),
  },
];

for (const a of IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35102-nhalf-ncross-strictness-multirung-verify assertion failed: ${a.id}`);
  }
}
