/**
 * @module imp-34923-gronwall-halving-surplus-identity-derivation
 *
 * imp-34923 (numerical, frontier-direction): the imp-34904 four-landmark
 * reconciliation attributes the ~0.407% L1-L3 gap (closed-form E_coll = E_trunc
 * crossover N_cross ~ 3.280e9 vs the sigma = 1/2 halving landmark N_half ~ 3.267e9)
 * to the imp-33601/imp-33848 Gronwall E_flow term through the STATED identity
 *
 *     1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc),
 *
 * but never derives it or residual-checks it. This module DERIVES the exact
 * relation from the definition sigma(N) = E_coll/E(N), MEASURES both candidate
 * sides on the inherited imp-3220/imp-3406 surrogate, and quantifies the residual
 * between them and against the measured 0.407% landmark gap.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33601 / imp-3406; no re-derivation)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)           (Riemann-von Mangoldt inverse)
 *
 * THE DERIVATION (the exact identity the ticket asks for)
 * -------------------------------------------------------
 * At the crossover E_coll = E_trunc. Write a = E_coll = E_trunc, f = E_flow, so
 * E = E_coll + E_trunc + E_flow = 2a + f. Then
 *
 *     sigma(N_cross) = E_coll / E = a / (2a + f) = 1 / (2 + f/a)
 *                    = 1 / (2 + E_flow/E_trunc).                       (EXACT)
 *
 * So the closed form 1/(2 + E_flow/E_trunc) is sigma(N_cross) ITSELF -- NOT the
 * surplus 1/2 - sigma(N_cross). The imp-34904 attribution text misplaces the
 * "1/2 -": the correct surplus is the SMALL correction obtained by subtracting,
 *
 *     1/2 - sigma(N_cross) = 1/2 - 1/(2 + r) = r / (2 (2 + r)),
 *     r := E_flow/E_trunc  (evaluated at N_cross).             (SURPLUS CLOSED FORM)
 *
 * For small r this is ~ r/4, i.e. THREE orders below the 1/(2 + r) ~ 1/2 value that
 * imp-34904 equates it to. Both closed forms are checked to floating point here.
 *
 * THE MEASURED RESIDUALS (measurement only)
 * -----------------------------------------
 *   (M1) sigma(N_cross) = 1/(2 + r) to ~2.2e-16 relative (the CORRECT identity).
 *   (M2) 1/2 - sigma(N_cross) = r/(2(2+r)) to ~2.4e-16 relative (the SURPLUS closed
 *        form). The measured surplus is ~4.744e-4.
 *   (M3) The imp-34904 stated RHS 1/(2 + r) ~ 0.49953 overstates the surplus
 *        ~4.744e-4 by a factor ~1052 (rel error ~1.05e3): the stated identity is
 *        an ERROR of "1/2 -" placement, not a small residual.
 *   (M4) Against the 0.407% LANDMARK gap: 1/2 - sigma(N_cross) ~ 4.744e-4 is a
 *        SIGMA-space quantity, whereas the landmark gap (N_cross - N_half)/N_cross
 *        ~ 3.981e-3 is a relative-N quantity. They are linked by the local
 *        E_coll ~ N^{-1/2} slope, not equal: 8 * (1/2 - sigma(N_cross)) ~ 3.795e-3
 *        ~ 2r ~ the imp-33601 leading N-gap prediction (~95% of the measured
 *        3.981e-3). So the surplus does NOT directly equal the 0.407% gap; the ~8x
 *        factor is the sigma-vs-log N conversion, not a new component.
 *
 * The punchline: the imp-34904 L1-L3 attribution is directionally right (the gap is
 * the Gronwall E_flow term) but the stated identity is WRONG as literal equality --
 * 1/(2 + E_flow/E_trunc) equals sigma(N_cross), not 1/2 - sigma(N_cross). The
 * correct surplus closed form is r/(2(2+r)) ~ r/4, and it lives in sigma-space, a
 * factor ~8 below the relative-N landmark gap it is being compared to.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34904-landmark-3p3e9-reconciliation-table (states the identity as the
 *      L1-L3 gap cause but never derives or residual-checks it)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact relation sigma=1/2
 *      <=> E_coll = E_trunc + E_flow; leading N-gap prediction (1+r)^2)
 * @see imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-33582 (sigma=1/2
 *      halving landmark N ~ 3.267e9); imp-398 (E_flow C_F prefactor)
 * @see imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33582/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

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

// The imp-3444 crossover E_coll = E_trunc and the imp-33582 sigma = 1/2 halving point.
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const N_HALF = crossBelow(sigma, 0.5, 1e6, 1e18); // ~3.267235e9

const P_CROSS = parts(N_CROSS);

// r := E_flow/E_trunc evaluated AT the crossover (the argument of the closed forms).
const R_FLOW_TRUNC = P_CROSS.E_flow / E_TRUNC_PT; // ~1.8992e-3

// The two candidate closed forms.
const SIGMA_CROSS = P_CROSS.sigma; // measured sigma(N_cross) ~ 0.499526
const CLOSED_FORM_1_OVER_2_PLUS_R = 1 / (2 + R_FLOW_TRUNC); // imp-34904 stated RHS ~ 0.499526
const SURPLUS_MEASURED = 0.5 - SIGMA_CROSS; // 1/2 - sigma(N_cross) ~ 4.744e-4
const SURPLUS_CLOSED_FORM = R_FLOW_TRUNC / (2 * (2 + R_FLOW_TRUNC)); // r/(2(2+r)) ~ 4.744e-4

// (M1) sigma(N_cross) = 1/(2 + r)  -- the CORRECT identity.
const IDENTITY_SIGMA_RESIDUAL =
  Math.abs(SIGMA_CROSS - CLOSED_FORM_1_OVER_2_PLUS_R) / SIGMA_CROSS; // ~2.2e-16

// (M2) 1/2 - sigma(N_cross) = r/(2(2+r))  -- the SURPLUS closed form.
const SURPLUS_CLOSED_RESIDUAL =
  Math.abs(SURPLUS_MEASURED - SURPLUS_CLOSED_FORM) / SURPLUS_MEASURED; // ~2.4e-16

// (M3) imp-34904 stated identity 1/2 - sigma(N_cross) = 1/(2 + r): the RHS is
// sigma itself, so it overstates the surplus by the huge factor below.
const STATED_IDENTITY_REL_ERROR =
  Math.abs(CLOSED_FORM_1_OVER_2_PLUS_R - SURPLUS_MEASURED) / SURPLUS_MEASURED; // ~1.05e3

// (M4) the surplus lives in sigma-space; the landmark gap is a relative-N quantity.
const REL_N_GAP = (N_CROSS - N_HALF) / N_CROSS; // ~3.981e-3 (the imp-34904 L1-L3 gap)
const SURPLUS_TO_NGAP_FACTOR = REL_N_GAP / SURPLUS_MEASURED; // ~8.39 (sigma-vs-log N slope)
const EIGHT_TIMES_SURPLUS = 8 * SURPLUS_MEASURED; // ~3.795e-3 ~ 2r ~ leading N-gap prediction

export const IMP34923_GRONWALL_HALVING_SURPLUS_IDENTITY_DERIVATION = {
  id: 'imp-34923',
  proofSection: 'S-frontier',
  question:
    'The imp-34904 four-landmark reconciliation attributes the ~0.407% L1-L3 gap (closed-form ' +
    'E_coll=E_trunc crossover N_cross ~3.280e9 vs the sigma=1/2 halving landmark N_half ~3.267e9) ' +
    'to the Gronwall E_flow term via the STATED identity 1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc), ' +
    'but never derives or residual-checks it. Derive the identity from sigma(N)=E_coll/E at the ' +
    'crossover E_coll=E_trunc, measure both candidate sides on the inherited surrogate, and quantify ' +
    'the residual between them and against the measured 0.407% landmark gap. Measurement/derivation ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'sigma(N_cross), the two closed forms 1/(2 + r) and r/(2(2+r)) with r = E_flow/E_trunc at N_cross, ' +
    'the surplus 1/2 - sigma(N_cross), their floating-point residuals, the rel error of the imp-34904 ' +
    'stated identity, and the sigma-surplus-to-relative-N-gap conversion factor.',
  derivation:
    'At the crossover E_coll = E_trunc = a, E_flow = f: sigma(N_cross) = a/(2a+f) = 1/(2 + f/a) = ' +
    '1/(2 + E_flow/E_trunc) EXACTLY. Hence 1/(2 + E_flow/E_trunc) IS sigma(N_cross), not the surplus. ' +
    'Subtracting gives the correct surplus closed form 1/2 - sigma(N_cross) = r/(2(2+r)) ~ r/4.',
  landmarks: {
    N_cross_Ecoll_eq_Etrunc: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444)
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9 (imp-33582)
    E_flow_at_N_cross: +P_CROSS.E_flow.toExponential(4), // ~5.812e-8
    r_E_flow_over_E_trunc_at_N_cross: +R_FLOW_TRUNC.toExponential(6), // ~1.899241e-3
  },
  identityCheck: {
    // (M1) sigma(N_cross) = 1/(2 + r): the CORRECT clean identity.
    sigma_N_cross: +SIGMA_CROSS.toFixed(10), // ~0.4995256403
    closed_form_1_over_2_plus_r: +CLOSED_FORM_1_OVER_2_PLUS_R.toFixed(10), // ~0.4995256403
    sigma_identity_residual: +IDENTITY_SIGMA_RESIDUAL.toExponential(3), // ~2.2e-16
    // (M2) 1/2 - sigma(N_cross) = r/(2(2+r)): the SURPLUS closed form.
    surplus_measured: +SURPLUS_MEASURED.toExponential(6), // ~4.743597e-4
    surplus_closed_form_r_over_2_2_plus_r: +SURPLUS_CLOSED_FORM.toExponential(6), // ~4.743597e-4
    surplus_closed_residual: +SURPLUS_CLOSED_RESIDUAL.toExponential(3), // ~2.4e-16
  },
  statedIdentityAudit: {
    // (M3) the imp-34904 text equates the surplus to 1/(2 + r), which is ~1052x too big.
    imp34904_stated_rhs_1_over_2_plus_r: +CLOSED_FORM_1_OVER_2_PLUS_R.toFixed(10), // ~0.4995256403
    surplus_it_is_equated_to: +SURPLUS_MEASURED.toExponential(6), // ~4.743597e-4
    stated_identity_rel_error: +STATED_IDENTITY_REL_ERROR.toExponential(4), // ~1.0521e3
    diagnosis:
      'The imp-34904 stated identity misplaces the "1/2 -": the closed form 1/(2 + E_flow/E_trunc) ' +
      'equals sigma(N_cross) itself (~0.49953), NOT the surplus 1/2 - sigma(N_cross) (~4.744e-4). ' +
      'The correct surplus closed form is r/(2(2+r)) ~ r/4.',
  },
  landmarkGapComparison: {
    // (M4) surplus is sigma-space; the 0.407% landmark gap is relative-N.
    rel_N_gap_L1_L3: +REL_N_GAP.toExponential(6), // ~3.981092e-3 (the ~0.407% gap)
    surplus_sigma_space: +SURPLUS_MEASURED.toExponential(6), // ~4.743597e-4
    conversion_factor_gap_over_surplus: +SURPLUS_TO_NGAP_FACTOR.toFixed(4), // ~8.3926
    eight_times_surplus: +EIGHT_TIMES_SURPLUS.toExponential(6), // ~3.794878e-3 ~ 2r
    note:
      'The surplus does NOT directly equal the 0.407% landmark gap: it is a sigma-value quantity, the ' +
      'gap is a relative-N quantity. They are linked by the local E_coll ~ N^{-1/2} slope, so ' +
      '8 * (1/2 - sigma(N_cross)) ~ 2r ~ the imp-33601 leading N-gap prediction (~95% of the measured gap).',
  },
  finding:
    'DERIVED: sigma(N_cross) = 1/(2 + E_flow/E_trunc) EXACTLY (residual ~2.2e-16). The imp-34904 stated ' +
    'identity 1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc) is therefore an ERROR of "1/2 -" placement -- ' +
    'its RHS equals sigma(N_cross) itself and overstates the actual surplus by ~1052x. The correct ' +
    'surplus closed form is 1/2 - sigma(N_cross) = r/(2(2+r)) ~ 4.744e-4 (residual ~2.4e-16). That ' +
    'surplus is a sigma-space quantity ~8x below the relative-N landmark gap 3.981e-3 (~0.407%); the ~8x ' +
    'factor is the sigma-vs-log N conversion (8 * surplus ~ 2r ~ the imp-33601 leading N-gap prediction), ' +
    'NOT a new component. The L1-L3 gap IS the Gronwall E_flow term, but the imp-34904 identity as written ' +
    'is wrong as a literal equality.',
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The imp-34904 L1-L3 attribution is ' +
    'directionally correct (the ~0.407% gap is the Gronwall E_flow term) but its stated identity ' +
    '1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc) is WRONG as literal equality: the RHS is sigma(N_cross) ' +
    'itself. The correct clean identity is sigma(N_cross) = 1/(2 + E_flow/E_trunc), and the correct surplus ' +
    'closed form is 1/2 - sigma(N_cross) = r/(2(2+r)) ~ r/4, both checked to floating point. The surplus ' +
    'lives in sigma-space a factor ~8 below the relative-N landmark gap. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34904 (landmark reconciliation stating the identity); imp-33601 (sigma=1/2 <=> E_coll=E_trunc+E_flow, ' +
    'leading (1+r)^2 N-gap prediction); imp-3444 (E_coll=E_trunc crossover N ~3.280e9); imp-33582 (sigma=1/2 ' +
    'halving landmark N ~3.267e9); imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34923_GRONWALL_HALVING_SURPLUS_IDENTITY_DERIVATION_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3444 crossover and imp-33582 half-crossing landmarks,
    // proving the identical inherited component model is in use.
    id: 'imp34923-reproduces-imp3444-and-imp33582-landmarks',
    description: 'N_cross ~ 3.280e9 (imp-3444) and N_half ~ 3.267e9 (imp-33582), N_half < N_cross',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_HALF / 3.267e9 - 1) < 5e-3 &&
      N_HALF < N_CROSS,
  },
  {
    // (M1): the CORRECT identity sigma(N_cross) = 1/(2 + E_flow/E_trunc) holds to floating point.
    id: 'imp34923-correct-identity-sigma-equals-1-over-2-plus-r',
    description: 'sigma(N_cross) = 1/(2 + E_flow/E_trunc) to floating point (residual < 1e-12)',
    holds: () => IDENTITY_SIGMA_RESIDUAL < 1e-12,
  },
  {
    // (M2): the SURPLUS closed form 1/2 - sigma(N_cross) = r/(2(2+r)) holds to floating point.
    id: 'imp34923-surplus-closed-form-holds',
    description: '1/2 - sigma(N_cross) = r/(2(2+r)) to floating point (residual < 1e-12)',
    holds: () => SURPLUS_CLOSED_RESIDUAL < 1e-12,
  },
  {
    // (M3): the imp-34904 stated identity is an ERROR -- 1/(2 + r) overstates the surplus by ~1000x.
    id: 'imp34923-stated-identity-is-large-error',
    description: 'imp-34904 stated RHS 1/(2+r) overstates the surplus by a factor > 100 (rel error ~1e3)',
    holds: () =>
      STATED_IDENTITY_REL_ERROR > 1e2 &&
      Math.abs(CLOSED_FORM_1_OVER_2_PLUS_R - SIGMA_CROSS) / SIGMA_CROSS < 1e-12,
  },
  {
    // (M4): the surplus is sigma-space, ~8x below the relative-N landmark gap; 8*surplus ~ the
    // imp-33601 leading N-gap prediction 2r, and the landmark gap itself is ~0.4%.
    id: 'imp34923-surplus-is-sigma-space-not-the-ngap',
    description: 'surplus ~4.7e-4 is a factor ~8 below the ~0.4% relative-N landmark gap 3.98e-3',
    holds: () =>
      Math.abs(REL_N_GAP - 3.98e-3) < 5e-4 &&
      SURPLUS_TO_NGAP_FACTOR > 5 &&
      SURPLUS_TO_NGAP_FACTOR < 12 &&
      Math.abs(EIGHT_TIMES_SURPLUS - 2 * R_FLOW_TRUNC) / (2 * R_FLOW_TRUNC) < 0.05,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp34923-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34923_GRONWALL_HALVING_SURPLUS_IDENTITY_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP34923_GRONWALL_HALVING_SURPLUS_IDENTITY_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP34923_GRONWALL_HALVING_SURPLUS_IDENTITY_DERIVATION.verdict),
  },
];

for (const a of IMP34923_GRONWALL_HALVING_SURPLUS_IDENTITY_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34923-gronwall-halving-surplus-identity-derivation assertion failed: ${a.id}`);
  }
}
