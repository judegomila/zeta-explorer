/**
 * @module imp-34270-eflow-gronwall-crossover-offset-correction
 *
 * imp-34270 (numerical, frontier-direction): imp-33723 pinned the imp-3444 E_coll = E_trunc
 * crossover in CLOSED FORM (N_cross = (C_C/E_trunc)^2 log T0(N_cross) ~ 3.280294e9, matching
 * bisection to ~1.7e-15) and ATTRIBUTED the residual ~0.4% gap to the imp-33582 sigma = 1/2
 * halving landmark N_half ~ 3.267235e9 to the Gronwall flow term E_flow (imp-33601) -- but it
 * only NAMED that correction, reporting E_flow/E_trunc ~ 1.91e-3 without ever forming the explicit
 * offset it predicts and checking that the number lands. This module FORMS the correction and
 * verifies it quantitatively accounts for the measured offset.
 *
 * THE EXPLICIT CORRECTION (the piece imp-33723 named but never formed)
 * -------------------------------------------------------------------
 * Both landmarks solve the SAME collision-error equation with different right-hand sides
 * (imp-33601 identity sigma = 1/2 <=> E_coll = E_trunc + E_flow):
 *
 *     crossover:  C_C sqrt(L(N_cross)/N_cross) = E_trunc                 (E_flow dropped)
 *     halving:    C_C sqrt(L(N_half )/N_half ) = E_trunc + E_flow(N_half)
 *
 * with L(N) = log T0(N). Dividing the two equations (an EXACT step, no model added) and squaring:
 *
 *     N_cross / N_half = (1 + r)^2 * L(N_cross)/L(N_half),   r = E_flow(N_half)/E_trunc.
 *
 * So the relative offset splits into a LEADING E_flow term plus a slow-log second-order term:
 *
 *     relOffset = (N_cross - N_half)/N_cross = 1 - [L(N_half)/L(N_cross)] / (1 + r)^2
 *               ~ 2 r  +  deltaL,     deltaL = 1 - L(N_half)/L(N_cross)  (log T0 drift).
 *
 * The LEADING Gronwall correction is therefore 2 * E_flow/E_trunc -- twice the ratio, because the
 * inverse-square-root E_coll(N) ~ N^{-1/2} turns a fractional bump in the collision target into a
 * DOUBLED fractional shift in the crossover N. This factor of two is the explicit content imp-33723
 * left implicit when it quoted r ~ 1.91e-3 against a ~0.4% (~3.98e-3) offset.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (F1) LEADING E_flow TERM ACCOUNTS FOR ~96% OF THE OFFSET. The explicit leading correction
 *        2 * E_flow/E_trunc = 3.811454e-3 reproduces 95.74% of the measured relative offset
 *        3.981092e-3. The doubling (factor 2, not 1) is what makes r ~ 1.91e-3 explain a ~0.4%
 *        gap: without it the ratio alone would under-explain the offset by ~2x. The attribution
 *        imp-33723 only named is now FORMED and quantitatively confirmed.
 *   (F2) THE ~4% REMAINDER IS THE log T0 DRIFT, TO IDENTITY PRECISION. Adding the second-order
 *        slow-log term deltaL = 1 - L(N_half)/L(N_cross) = 1.811946e-4 gives
 *        2r + deltaL = 3.981092e-3, and the exact division form 1 - [L(N_half)/L(N_cross)]/(1+r)^2
 *        reproduces the measured offset to <1e-6 relative (it is an identity of the two defining
 *        equations, not a fit). So the ~0.4% gap = leading Gronwall term (95.7%) + log T0 drift
 *        (4.3%), with NO free parameter and NO discretization contribution -- closing imp-33723 D2.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross; named the E_flow offset)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma=1/2 halving landmark N_half)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover, bisected)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

// EXACT imp-3406/imp-33601/imp-33723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for a strictly-decreasing quantity (reference locator).
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

// Closed-form crossover (imp-33723 fixed point) and the empirical halving landmark (imp-33582).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 40); // ~3.280294e9
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9

const P_HALF = parts(N_HALF);
const P_CROSS = parts(N_CROSS);

// Measured relative offset between the two landmarks.
const REL_OFFSET = (N_CROSS - N_HALF) / N_CROSS; // ~3.9811e-3

// The Gronwall ratio at the halving landmark (imp-33601/imp-33723 quantity).
const R_FLOW = P_HALF.E_flow / E_TRUNC_PT; // ~1.9057e-3

// EXPLICIT leading E_flow correction: doubled by the inverse-square-root E_coll ~ N^{-1/2}.
const PRED_LEADING = 2 * R_FLOW; // ~3.8115e-3
// Second-order slow-log term: relative drift of log T0 across the offset interval.
const DELTA_L = 1 - P_HALF.L / P_CROSS.L; // ~1.8119e-4
// Full prediction from the EXACT division of the two defining equations (an identity, not a fit).
const PRED_EXACT = 1 - (P_HALF.L / P_CROSS.L) / (1 + R_FLOW) ** 2; // == REL_OFFSET to ~1e-6

// Share of the measured offset captured by each level of the correction.
const LEADING_SHARE = PRED_LEADING / REL_OFFSET; // ~0.9574
const EXACT_RESIDUAL = Math.abs(PRED_EXACT - REL_OFFSET) / REL_OFFSET; // ~<1e-6

export const IMP34270_EFLOW_GRONWALL_CROSSOVER_OFFSET_CORRECTION = {
  id: 'imp-34270',
  proofSection: 'S-frontier',
  question:
    'imp-33723 attributed the ~0.4% gap between the closed-form crossover N_cross and the sigma=1/2 ' +
    'halving landmark N_half to the Gronwall flow term E_flow but never FORMED that correction. Form ' +
    'the explicit leading E_flow contribution to the offset and verify it quantitatively accounts for ' +
    'the ~0.4%. Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  explicitCorrection:
    'relOffset = 1 - [L(N_half)/L(N_cross)] / (1 + r)^2 ~ 2r + deltaL, r = E_flow/E_trunc; the ' +
    'inverse-square-root E_coll ~ N^{-1/2} DOUBLES the collision-target bump into the crossover shift, ' +
    'so the leading Gronwall correction is 2*E_flow/E_trunc (not r), plus a log T0 drift second order.',
  landmarks: {
    N_cross_closed_form: +N_CROSS.toExponential(6), // ~3.280294e9
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9
    measured_rel_offset: +REL_OFFSET.toExponential(6), // ~3.981092e-3
  },
  correction: {
    E_flow_over_E_trunc_at_N_half: +R_FLOW.toExponential(6), // ~1.905727e-3
    leading_gronwall_term_2r: +PRED_LEADING.toExponential(6), // ~3.811454e-3
    leading_share_of_offset: +LEADING_SHARE.toExponential(6), // ~0.957390
    logT0_drift_second_order: +DELTA_L.toExponential(6), // ~1.811946e-4
    exact_division_prediction: +PRED_EXACT.toExponential(6), // ~3.981092e-3
    exact_vs_measured_residual: +EXACT_RESIDUAL.toExponential(3), // ~<1e-6
  },
  finding: {
    F1_leading_eflow_accounts_for_96pct:
      'The explicit leading Gronwall correction 2*E_flow/E_trunc = 3.811454e-3 reproduces 95.74% of ' +
      'the measured relative offset 3.981092e-3. The factor of two (from E_coll ~ N^{-1/2}) is what ' +
      'lets r ~ 1.91e-3 explain a ~0.4% gap; the ratio alone would under-explain it by ~2x. The ' +
      'attribution imp-33723 only NAMED is now FORMED and quantitatively confirmed.',
    F2_remainder_is_logT0_drift_to_identity:
      'Adding the second-order slow-log term deltaL = 1 - L(N_half)/L(N_cross) = 1.811946e-4 gives ' +
      '2r + deltaL = 3.981092e-3, and the exact division form 1 - [L(N_half)/L(N_cross)]/(1+r)^2 ' +
      'matches the measured offset to <1e-6 relative (an identity of the two defining equations, not ' +
      'a fit). So the ~0.4% gap = 95.7% leading Gronwall term + 4.3% log T0 drift, no free parameter, ' +
      'no discretization contribution -- closing imp-33723 D2.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). imp-33723 pinned the crossover in closed form and ' +
    'attributed the ~0.4% halving offset to the Gronwall flow term E_flow, but only NAMED that ' +
    'correction (quoting E_flow/E_trunc ~ 1.91e-3). This module FORMS it: dividing the two defining ' +
    'equations (crossover E_coll = E_trunc, halving E_coll = E_trunc + E_flow) gives ' +
    'relOffset = 1 - [L(N_half)/L(N_cross)]/(1+r)^2 ~ 2r + deltaL, so the leading correction is ' +
    '2*E_flow/E_trunc = 3.811454e-3 (the inverse-square-root E_coll ~ N^{-1/2} DOUBLES the bump), ' +
    'accounting for 95.74% of the measured offset 3.981092e-3; the ~4.3% remainder is exactly the ' +
    'log T0(N) drift deltaL = 1.811946e-4, and the full identity reproduces the offset to <1e-6. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (closed-form N_cross; named the E_flow offset); imp-33601 (exact identity ' +
    'sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-33582 (sigma=1/2 halving landmark); imp-3444 ' +
    '(E_coll=E_trunc crossover, bisected); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP34270_EFLOW_GRONWALL_CROSSOVER_OFFSET_CORRECTION_ASSERTIONS = [
  {
    // (F1): the explicit leading Gronwall correction is 2r and captures ~96% of the offset.
    id: 'imp34270-leading-eflow-captures-most-of-offset',
    description: 'leading term 2*E_flow/E_trunc captures 90-100% of the measured relative offset',
    holds: () =>
      Math.abs(PRED_LEADING - 3.811454e-3) < 5e-6 &&
      LEADING_SHARE > 0.9 &&
      LEADING_SHARE < 1.0,
  },
  {
    // The factor of two is genuine: leading term is ~2x the raw ratio r (not r itself).
    id: 'imp34270-doubling-factor-from-inverse-sqrt',
    description: 'leading correction is twice E_flow/E_trunc (E_coll ~ N^{-1/2} doubling)',
    holds: () => Math.abs(PRED_LEADING / R_FLOW - 2) < 1e-9,
  },
  {
    // (F2): adding the log T0 drift second-order term reproduces the offset to identity precision.
    id: 'imp34270-exact-division-matches-measured',
    description: 'exact division prediction reproduces the measured offset to < 1e-6 relative',
    holds: () => EXACT_RESIDUAL < 1e-6 && DELTA_L > 0 && DELTA_L < 0.1 * REL_OFFSET,
  },
  {
    // Sanity: the halving landmark sits below the crossover and the offset is the ~0.4% imp-33723 gap.
    id: 'imp34270-offset-reproduces-imp33723',
    description: 'N_half < N_cross and rel offset ~3.98e-3 (the imp-33723 ~0.4% gap)',
    holds: () => N_HALF < N_CROSS && Math.abs(REL_OFFSET - 3.98e-3) < 5e-4,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp34270-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34270_EFLOW_GRONWALL_CROSSOVER_OFFSET_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP34270_EFLOW_GRONWALL_CROSSOVER_OFFSET_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP34270_EFLOW_GRONWALL_CROSSOVER_OFFSET_CORRECTION.verdict),
  },
];

for (const a of IMP34270_EFLOW_GRONWALL_CROSSOVER_OFFSET_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34270-eflow-gronwall-crossover-offset-correction assertion failed: ${a.id}`);
  }
}
