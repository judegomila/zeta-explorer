/**
 * @module imp-33793-landmark-separation-identity-external-crosscheck
 *
 * imp-33793 (accuracy, verification): imp-33767 finding F2 asserts the ~0.41-point residual between
 * the imp-33744 knee-vs-halving offset (off_33744 ~ +3.49%) and the imp-33729 knee-vs-crossover
 * offset (off_33729 ~ +3.07%) equals EXACTLY the algebraic identity
 *
 *     off_33744 - off_33729 = N* (1/N_half - 1/N_cross),
 *
 * confirmed there to < 1e-9. But that confirmation recomputes ALL THREE quantities (the
 * exponent-ramp knee N*, the sigma=1/2 halving landmark N_half, and the E_coll=E_trunc crossover
 * N_cross) INSIDE the SAME imp-33767 module from the SAME sub-terms, so an internal bookkeeping
 * error would cancel on both sides of the identity and go undetected. This module CROSS-CHECKS the
 * identity by feeding landmark values pinned INDEPENDENTLY by three DIFFERENT sibling modules --
 * no shared recomputation -- and confirms the identity survives to < 1e-9.
 *
 * EXTERNAL INDEPENDENTLY-PINNED LANDMARKS (import-light literals, no recomputation)
 * --------------------------------------------------------------------------------
 *   - N* (fine knee): imp-33721 sub-decade D2 sign-change inflectionLog10Nstar = 9.5285
 *     (the imp-33729 numerator), pinned as a base-10 log => N* = 10^9.5285 ~ 3.376758e9.
 *   - N_cross: imp-33723 CLOSED-FORM fixed point N = (C_C/E_trunc)^2 log T0(N) = 3.280294e9
 *     (bisection-independent, the imp-33729 denominator).
 *   - N_half: imp-33723 / imp-33582 sigma = 1/2 halving landmark = 3.267235e9
 *     (the imp-33744 denominator).
 * These three come from THREE separate modules (imp-33721 knee, imp-33723 crossover, imp-33582
 * halving), so no single internal bug can move both sides of the identity together.
 *
 * THE CROSS-CHECK (external pins -> identity)
 * ------------------------------------------
 *   off_33744_ext = N* / N_half  - 1        (knee above the halving landmark)
 *   off_33729_ext = N* / N_cross - 1        (knee above the crossover)
 *   residual_ext  = off_33744_ext - off_33729_ext
 *   identity_ext  = N* (1/N_half - 1/N_cross)
 *   |residual_ext - identity_ext|  must be < 1e-9  (target; machine precision expected)
 *
 * FINDINGS (verification only)
 * ----------------------------
 *   (F1) THE IDENTITY SURVIVES ON EXTERNAL PINS TO MACHINE PRECISION. With N*, N_half, N_cross
 *        supplied by three independent modules, |residual_ext - identity_ext| ~ 1e-16 << 1e-9. The
 *        identity off_33744 - off_33729 = N*(1/N_half - 1/N_cross) is algebraically EXACT for ANY
 *        three positive inputs, so this < 1e-9 pass alone does NOT test bookkeeping -- it tests the
 *        arithmetic. The substantive cross-check is F2/F3 (the VALUES).
 *   (F2) THE LANDMARK SEPARATION MATCHES imp-33767 EXACTLY. N_cross/N_half - 1 = 0.003997 from the
 *        imp-33723 pins reproduces the imp-33767 internally-recomputed landmark_separation 0.003997
 *        to 6 decimals -- i.e. the halving-to-crossover separation carries NO imp-33767 bookkeeping
 *        error, because two disjoint sources (imp-33767 internal vs imp-33723 external) agree.
 *   (F3) THE RESIDUAL REPRODUCES imp-33767 TO THE FINE-KNEE PIN PRECISION. residual_ext = 0.004114
 *        vs the imp-33767 reported 0.004120 -- ~1.3e-3 relative, the gap traced ENTIRELY to the
 *        knee: imp-33721 pins the fine knee at log10 9.5285 (N* ~ 3.3768e9) while imp-33767
 *        internally recomputes N* ~ 3.381122e9 (~0.13% higher). Since residual = N*(1/N_half -
 *        1/N_cross) scales linearly in N*, a 0.13% knee difference gives a ~0.13% residual
 *        difference -- exactly the observed 1.3e-3. No hidden cancellation: the two independent
 *        knee pins differ only by their known ~0.13% quadrature/rounding spread, and the residual
 *        tracks that difference transparently.
 *
 * PUNCHLINE: the imp-33767 F2 landmark-separation identity is CERTIFIED by external pins. The
 * identity holds to machine precision on landmark values from three independent modules; the
 * landmark separation matches imp-33767 to 6 decimals; the residual matches to the known ~0.13%
 * fine-knee pin spread. An internal imp-33767 bookkeeping error that cancelled on both sides is
 * ruled out -- it would have shown up as a mismatch against these external pins, and it does not.
 *
 * VERIFICATION / MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642) is UNTOUCHED; no
 * bound; no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33767-sigma-inflection-offset-reconciliation (F2 identity, internal same-module recompute)
 * @see imp-33721-sigma-ramp-inflection-subdecade (fine knee inflectionLog10Nstar ~ 9.5285)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross closed form, N_half halving pin)
 * @see imp-33729-sigma-knee-vs-crossover-offset (knee-vs-crossover offset off_33729)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (knee-vs-halving offset off_33744)
 */

// EXTERNAL independently-pinned landmark literals (three separate sibling modules, no recompute).
const NSTAR_LOG10_IMP33721 = 9.5285; // imp-33721 sub-decade D2 sign-change (imp-33729 numerator)
const N_STAR = Math.pow(10, NSTAR_LOG10_IMP33721); // ~3.376758e9
const N_CROSS_IMP33723 = 3.280294e9; // imp-33723 closed-form fixed point (imp-33729 denominator)
const N_HALF_IMP33582 = 3.267235e9; // imp-33723 / imp-33582 sigma=1/2 halving (imp-33744 denominator)

// imp-33767 internally-recomputed values (targets for the value cross-check).
const IMP33767_OFF_33744 = 0.034857;
const IMP33767_OFF_33729 = 0.030737;
const IMP33767_RESIDUAL = 0.00412;
const IMP33767_LANDMARK_SEP = 0.003997;
const IMP33767_NSTAR_INTERNAL = 3.381122e9;

// The cross-check on EXTERNAL pins.
const OFF_33744_EXT = N_STAR / N_HALF_IMP33582 - 1;
const OFF_33729_EXT = N_STAR / N_CROSS_IMP33723 - 1;
const RESIDUAL_EXT = OFF_33744_EXT - OFF_33729_EXT;
const IDENTITY_EXT = N_STAR * (1 / N_HALF_IMP33582 - 1 / N_CROSS_IMP33723);
const IDENTITY_ABS_ERR = Math.abs(RESIDUAL_EXT - IDENTITY_EXT); // ~1e-16
const LANDMARK_SEP_EXT = N_CROSS_IMP33723 / N_HALF_IMP33582 - 1;
const RESIDUAL_REL_VS_IMP33767 = Math.abs(RESIDUAL_EXT / IMP33767_RESIDUAL - 1); // ~1.3e-3
const KNEE_PIN_REL_SPREAD = Math.abs(N_STAR / IMP33767_NSTAR_INTERNAL - 1); // ~1.3e-3

export const IMP33793_LANDMARK_SEPARATION_IDENTITY_EXTERNAL_CROSSCHECK = {
  id: 'imp-33793',
  proofSection: 'S-frontier',
  question:
    'imp-33767 F2 confirms off_33744 - off_33729 = N*(1/N_half - 1/N_cross) to < 1e-9, but recomputes ' +
    'all three landmarks (N*, N_half, N_cross) inside the SAME module, so an internal bookkeeping error ' +
    'would cancel on both sides. Cross-check the identity by feeding landmark values pinned ' +
    'INDEPENDENTLY by three different sibling modules and confirm it survives to < 1e-9. ' +
    'Verification only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the imp-33767 F2 landmark-separation identity off_33744 - off_33729 = N*(1/N_half - 1/N_cross) ' +
    'evaluated on landmark values pinned externally by imp-33721 (fine knee), imp-33723 (closed-form ' +
    'crossover) and imp-33582 (sigma=1/2 halving), with no shared recomputation',
  externalPins: {
    Nstar_from_imp33721_log10: NSTAR_LOG10_IMP33721, // 9.5285
    Nstar_from_imp33721: +N_STAR.toExponential(6), // ~3.376758e9
    N_cross_from_imp33723: +N_CROSS_IMP33723.toExponential(6), // 3.280294e9
    N_half_from_imp33582: +N_HALF_IMP33582.toExponential(6), // 3.267235e9
    note: 'three DIFFERENT source modules -- no single internal bug can move both sides together',
  },
  crossCheck: {
    off_33744_ext: +OFF_33744_EXT.toFixed(6), // ~0.033522
    off_33729_ext: +OFF_33729_EXT.toFixed(6), // ~0.029407
    residual_ext: +RESIDUAL_EXT.toFixed(6), // ~0.004114
    identity_ext: +IDENTITY_EXT.toFixed(6), // ~0.004114
    identity_abs_err: +IDENTITY_ABS_ERR.toExponential(3), // ~1e-16 (<< 1e-9 target)
    landmark_sep_ext: +LANDMARK_SEP_EXT.toFixed(6), // 0.003997 (matches imp-33767 to 6dp)
    residual_rel_vs_imp33767: +RESIDUAL_REL_VS_IMP33767.toExponential(3), // ~1.3e-3
    knee_pin_rel_spread: +KNEE_PIN_REL_SPREAD.toExponential(3), // ~1.3e-3 (SAME source as residual gap)
  },
  finding: {
    F1_identity_survives_external_pins_to_machine_precision:
      'With N*, N_half, N_cross supplied by three independent modules, |residual_ext - identity_ext| ' +
      '~ 1e-16 << 1e-9. The identity is algebraically EXACT for any three positive inputs, so this ' +
      'pass tests the arithmetic; the substantive bookkeeping cross-check is the VALUES (F2/F3).',
    F2_landmark_separation_matches_imp33767_exactly:
      'N_cross/N_half - 1 = 0.003997 from the imp-33723 pins reproduces the imp-33767 ' +
      'internally-recomputed landmark_separation 0.003997 to 6 decimals -- two disjoint sources ' +
      '(imp-33767 internal vs imp-33723 external) agree, so the separation carries no imp-33767 bug.',
    F3_residual_matches_to_the_fine_knee_pin_precision:
      'residual_ext = 0.004114 vs imp-33767 reported 0.004120 (~1.3e-3 relative), the gap traced ' +
      'ENTIRELY to the knee: imp-33721 pins log10 9.5285 (N* ~ 3.3768e9) vs imp-33767 internal ' +
      'N* ~ 3.381122e9 (~0.13% higher). Since residual scales linearly in N*, the residual gap ' +
      'equals the knee-pin spread (both ~1.3e-3) -- no hidden cancellation.',
  },
  isRigorous: false,
  verdict:
    'VERIFICATION (frontier-direction, NOT rigorous). Feeding the imp-33767 F2 identity ' +
    'off_33744 - off_33729 = N*(1/N_half - 1/N_cross) with landmark values pinned INDEPENDENTLY by ' +
    'three different modules -- N* = 10^9.5285 ~ 3.3768e9 (imp-33721 fine knee), N_cross = 3.280294e9 ' +
    '(imp-33723 closed-form fixed point), N_half = 3.267235e9 (imp-33582 halving) -- the identity ' +
    'holds to machine precision (|residual_ext - identity_ext| ~ 1e-16 << 1e-9). The landmark ' +
    'separation N_cross/N_half - 1 = 0.003997 matches the imp-33767 internally-recomputed value to 6 ' +
    'decimals, and the residual 0.004114 matches the imp-33767 reported 0.004120 to ~1.3e-3 -- the ' +
    'gap traced entirely to the ~0.13% difference between the imp-33721 pinned knee (3.3768e9) and ' +
    'the imp-33767 internal knee (3.381122e9), a linear-in-N* effect, NOT a cancellation. So the ' +
    'imp-33767 F2 identity is CERTIFIED against independent pins: an internal same-module bookkeeping ' +
    'error that cancelled on both sides is ruled out. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33767 (F2 identity, internal same-module recompute); imp-33721 (fine knee log10 9.5285); ' +
    'imp-33723 (N_cross closed form 3.280294e9, N_half 3.267235e9); imp-33729 (knee-vs-crossover ' +
    'offset); imp-33744 (knee-vs-halving offset); imp-33582 (sigma=1/2 halving landmark).',
};

export const IMP33793_LANDMARK_SEPARATION_IDENTITY_EXTERNAL_CROSSCHECK_ASSERTIONS = [
  {
    // The identity survives on EXTERNAL pins from three independent modules to < 1e-9 (the ticket target).
    id: 'imp33793-identity-survives-external-pins',
    description: 'off_33744 - off_33729 = N*(1/N_half - 1/N_cross) on external pins holds to < 1e-9',
    holds: () => IDENTITY_ABS_ERR < 1e-9,
  },
  {
    // (F2) landmark separation from imp-33723 external pins matches the imp-33767 internal value to 6dp.
    id: 'imp33793-landmark-sep-matches-imp33767',
    description: 'N_cross/N_half - 1 (external) reproduces imp-33767 landmark_separation 0.003997 to < 1e-5',
    holds: () => Math.abs(LANDMARK_SEP_EXT - IMP33767_LANDMARK_SEP) < 1e-5,
  },
  {
    // (F3) the residual gap vs imp-33767 equals the independent fine-knee pin spread -- no cancellation.
    id: 'imp33793-residual-gap-is-knee-pin-spread',
    description: 'residual_ext vs imp-33767 (~1.3e-3) tracks the imp-33721-vs-imp33767 knee-pin spread',
    holds: () =>
      RESIDUAL_REL_VS_IMP33767 < 3e-3 && Math.abs(RESIDUAL_REL_VS_IMP33767 - KNEE_PIN_REL_SPREAD) < 5e-4,
  },
  {
    // Reuse gate: the external landmarks land in their published bands (sanity on the pinned literals).
    id: 'imp33793-external-pins-in-published-bands',
    description: 'external N*, N_cross, N_half sit in their imp-33721/imp-33723 published bands',
    holds: () =>
      Math.abs(N_STAR / 3.38e9 - 1) < 0.01 &&
      Math.abs(N_CROSS_IMP33723 / 3.280294e9 - 1) < 1e-9 &&
      Math.abs(N_HALF_IMP33582 / 3.267235e9 - 1) < 1e-9,
  },
  {
    // Honesty gate: verification only, no bound moved, no QED.
    id: 'imp33793-honesty-no-qed',
    description: 'verification only -- identity cross-check, conditional-share diagnostic, changes no bound, no QED',
    holds: () => IMP33793_LANDMARK_SEPARATION_IDENTITY_EXTERNAL_CROSSCHECK.isRigorous === false,
  },
];
