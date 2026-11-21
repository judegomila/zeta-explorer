/**
 * @module imp-34631-eflow-attr-log-slope-concavity-near-side
 * @fileoverview imp-34631 -- EXTEND the imp-34613 symbolic log-concavity sign result for the
 *   eflow_attr log-slope second derivative from the FAR side of the pole k* ~ 21.28095 to the
 *   NEAR side (k < k*), where imp-34585/imp-34589 fit the rungs. imp-34613 derived symbolically
 *   that the inherited imp-3220/imp-3406 surrogate E_flow ~ log^3(N)/N (with E_N flat, imp-34570
 *   F3) makes d2(ln eflow_attr)/dk2 strictly NEGATIVE (log-concave) for all L > 3, but its
 *   derivation and numerical match were far-side of the pole. This module re-derives the same
 *   second derivative in the ticket-requested FACTORED form and confirms it holds on the near side.
 *
 *   SETUP (surrogate only, import-light -- no zeros bundle in the chain, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). Write u = L = ln N (natural
 *   log; here u and L denote the same variable, ln N = k * ln10 under N = 10^k). Under the imp-34613
 *   surrogate eflow_attr = K0 * e^{-L} * (L^3 - 3 L^2), K0 > 0, so
 *
 *       ln eflow_attr = ln K0 - L + 2 ln L + ln(L - 3)            (since L^3 - 3 L^2 = L^2 (L - 3)).
 *
 *   Differentiating twice in k (dL/dk = ln10 constant) the ticket-requested FACTORED form is
 *
 *       d2(ln eflow_attr)/dk2 = ln10^2 * [ -3/u^2 - 3 (2u - 3) / (u^2 - 3u)^2 ].            (star)
 *
 *   This is ALGEBRAICALLY IDENTICAL to the imp-34613 far-side form ln10^2 * (-2/u^2 - 1/(u-3)^2):
 *   putting both over the common denominator u^2 (u-3)^2 gives, for each,
 *
 *       -3 (u^2 - 4u + 6) / ( u^2 (u - 3)^2 )                     (identical numerator/denominator).
 *
 *   (star) is thus not a new surrogate -- it is the imp-34613 identity re-expressed as a factored
 *   TWO-TERM sum whose per-term signs are transparent on the near side.
 *
 *   FINDINGS (closed-form sign extended to the near side, surrogate only).
 *   ---------------------------------------------------------------------------------
 *   (F1) BOTH TERMS OF (star) ARE STRICTLY NEGATIVE FOR ALL u > 3 -- NEAR-SIDE CONCAVITY IS
 *        STRUCTURAL. Term 1 = -3/u^2 < 0 for every u =/= 0. Term 2 = -3 (2u - 3) / (u^2 - 3u)^2 has a
 *        positive squared denominator and, for u > 3, a numerator -3 (2u - 3) < 0 (2u - 3 > 3 > 0).
 *        So d2(ln eflow_attr)/dk2 < 0 for ALL u > 3 -- the same one-signed concavity imp-34613
 *        proved far-side now holds on the NEAR side k < k* with no window restriction. Equivalently
 *        the collapsed numerator -3 (u^2 - 4u + 6) is negative for all real u (the quadratic
 *        u^2 - 4u + 6 has discriminant 16 - 24 = -8 < 0, hence is everywhere positive), so the sign
 *        is one-signed on BOTH sides of the pole, not merely above k*.
 *   (F2) THE FACTORED FORM (star) EQUALS THE imp-34613 FORM TO THE DOUBLE-PRECISION FLOOR. Evaluated
 *        across the near-side rungs (L = k * ln10, k = 21.1 .. 21.4) the two expressions agree to
 *        < 1e-15 absolute, confirming (star) is the imp-34613 identity re-factored, not a distinct
 *        model. Both give ~ -6.9e-3 to -7.0e-3 per k^2 across the near side (all < 0).
 *   (F3) THE NEAR-SIDE RUNGS CONFIRM THE SIGN. The imp-34406 near rungs (k = 21.0 .. 21.5, baked
 *        reference literals) give an empirical evenly-spaced second difference of ln eflow_attr of
 *        -6.86e-3 -> -6.67e-3 per k^2 at the four interior nodes k = 21.1 .. 21.4 -- all strictly
 *        NEGATIVE and matching the surrogate (star) to ~2.6% (empirical -6.86e-3 vs model -7.04e-3
 *        at k = 21.1). So the observed near-side log-slope is CONCAVE, in the sign the surrogate
 *        predicts, anchoring the derivation to the actual near-side recovery.
 *
 *   The punchline: the imp-34613 log-concavity sign is NOT a far-side artifact -- the identical
 *   second derivative, written in the factored form (star), is a sum of two terms both strictly
 *   negative for every u > 3, so eflow_attr is log-CONCAVE (log-slope steepens) on the NEAR side
 *   k < k* just as on the far side, and the imp-34406 near rungs confirm the sign empirically.
 *
 *   SURROGATE DERIVATION ONLY. A symbolic sign computation inside the inherited imp-3220/imp-3406
 *   component surrogate under the imp-34570 F3 E_N-flat regime, extended to the near-side domain;
 *   NOT a rigorous asymptotic of the true residual; establishes no operator positivity and no new
 *   bound; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH
 *   verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34613-eflow-attr-log-slope-second-deriv-sign.js (the FAR-side concavity sign this extends)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the 8 near rungs, source of the baked literals)
 *   @see imp-34585-eflow-attr-log-corrected-fit.js (near-side log-corrected fit)
 *   @see imp-34589-eflow-attr-far-side-power-law-slope-continuity.js (near/far rung fits)
 */

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const LN10 = Math.LN10; // ln 10, dL/dk under N = 10^k
const LMIN_CONCAVE = 3; // u > 3 (N > e^3 ~ 20.09) -- pole of the surrogate |g| = |1 - 3/L|

// --- (star) the ticket-requested FACTORED second derivative and the imp-34613 form ---------
// Both are functions of u = L = ln N. They are algebraically identical (see header): each
// collapses to -3 (u^2 - 4u + 6) / (u^2 (u - 3)^2) times ln10^2.
export function imp34631LogCurvatureFactored(u) {
  // d2(ln eflow_attr)/dk2 = ln10^2 * [ -3/u^2 - 3 (2u - 3) / (u^2 - 3u)^2 ]
  const denom = u * u - 3 * u; // u (u - 3)
  return LN10 * LN10 * (-3 / (u * u) - (3 * (2 * u - 3)) / (denom * denom));
}
export function imp34631LogCurvature34613Form(u) {
  // imp-34613 form: ln10^2 * ( -2/u^2 - 1/(u - 3)^2 )
  return LN10 * LN10 * (-2 / (u * u) - 1 / ((u - 3) * (u - 3)));
}
// The two per-term pieces of (star), exposed so the sign of each is checkable on the near side.
export function imp34631Term1(u) {
  return LN10 * LN10 * (-3 / (u * u)); // < 0 for every u =/= 0
}
export function imp34631Term2(u) {
  const denom = u * u - 3 * u;
  return LN10 * LN10 * (-(3 * (2 * u - 3)) / (denom * denom)); // < 0 for u > 3
}

// --- (F3) near-side rungs (imp-34406, k = 21.0 .. 21.5), baked verbatim as reference literals --
// (no import of the imp-34310 chain -- keep the module import-light, matching imp-34613 which
// baked its measured rungs rather than importing). Even-spaced (h = 0.1) subset used for the
// second difference of ln eflow_attr; the pole-adjacent 21.25/21.28095 rungs are omitted so the
// central difference stays on a uniform grid.
export const IMP34631_NEAR_RUNGS = Object.freeze([
  { k: 21.0, eflowAttr: 8.28715423e-15 },
  { k: 21.1, eflowAttr: 6.67906852e-15 },
  { k: 21.2, eflowAttr: 5.38265555e-15 },
  { k: 21.3, eflowAttr: 4.33758269e-15 },
  { k: 21.4, eflowAttr: 3.49518130e-15 },
  { k: 21.5, eflowAttr: 2.81619473e-15 },
]);

// empirical evenly-spaced second difference of ln eflow_attr at the interior near-side nodes,
// cross-checked against the surrogate (star) at u = k * ln10.
const H = 0.1;
export const IMP34631_NEAR_CROSSCHECK = Object.freeze(
  IMP34631_NEAR_RUNGS.slice(1, -1).map((r, i) => {
    const y0 = Math.log(IMP34631_NEAR_RUNGS[i].eflowAttr);
    const y1 = Math.log(IMP34631_NEAR_RUNGS[i + 1].eflowAttr);
    const y2 = Math.log(IMP34631_NEAR_RUNGS[i + 2].eflowAttr);
    const empD2 = (y2 - 2 * y1 + y0) / (H * H);
    const u = r.k * LN10;
    const model = imp34631LogCurvatureFactored(u);
    return {
      k: r.k,
      u: +u.toFixed(4),
      empD2: +empD2.toExponential(4),
      model: +model.toExponential(4),
      relErr: +Math.abs((empD2 - model) / model).toFixed(4),
    };
  }),
);
export const IMP34631_MAX_REL_ERR = IMP34631_NEAR_CROSSCHECK.reduce(
  (m, r) => Math.max(m, r.relErr),
  0,
); // ~0.026

// max absolute discrepancy between (star) and the imp-34613 form across the near side -- both are
// the same identity, so this is at the double-precision floor.
const FORM_MISMATCH = IMP34631_NEAR_RUNGS.slice(1, -1).reduce((m, r) => {
  const u = r.k * LN10;
  return Math.max(m, Math.abs(imp34631LogCurvatureFactored(u) - imp34631LogCurvature34613Form(u)));
}, 0);

export const IMP34631_EFLOW_ATTR_LOG_SLOPE_CONCAVITY_NEAR_SIDE = {
  ticket: 'imp-34631',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34613 derived symbolically that the log^3(N)/N surrogate makes d2(ln eflow_attr)/dk2 ' +
    'strictly negative (log-concave), but only FAR-side of the pole k* ~ 21.281. Does the same ' +
    'concavity sign hold on the NEAR side (k < k*), where imp-34585/imp-34589 fit the rungs? ' +
    'Re-derive the second derivative in the factored form ln10^2 [ -3/u^2 - 3(2u-3)/(u^2-3u)^2 ], ' +
    'confirm both terms stay negative for u > 3, and cross-check the sign against the near rungs. ' +
    'Surrogate derivation only; NO QED.',
  factoredForm: 'd2(ln eflow_attr)/dk2 = ln10^2 * [ -3/u^2 - 3 (2u - 3) / (u^2 - 3u)^2 ]',
  collapsedNumerator: '-3 (u^2 - 4u + 6) / ( u^2 (u - 3)^2 )  (identical to the imp-34613 form)',
  lminConcave: LMIN_CONCAVE,
  nearCrossCheck: IMP34631_NEAR_CROSSCHECK,
  maxRelErr: +IMP34631_MAX_REL_ERR.toFixed(4),
  formMismatch: +FORM_MISMATCH.toExponential(4),
  finding: {
    F1_both_terms_negative_for_u_gt_3_structural:
      'In the factored form (star), Term1 = -3/u^2 < 0 for every u =/= 0, and Term2 = ' +
      '-3(2u-3)/(u^2-3u)^2 has a positive squared denominator and a numerator -3(2u-3) < 0 for ' +
      'u > 3 (2u-3 > 3). So d2(ln eflow_attr)/dk2 < 0 for ALL u > 3 -- the imp-34613 far-side ' +
      'concavity extends to the NEAR side k < k* with no window restriction. The collapsed ' +
      'numerator -3(u^2 - 4u + 6) is negative for every real u (discriminant 16 - 24 < 0), so the ' +
      'sign is one-signed on both sides of the pole.',
    F2_factored_form_equals_imp34613_form:
      'Across the near-side rungs (u = k*ln10, k = 21.1 .. 21.4) the factored form (star) and the ' +
      'imp-34613 form -2/u^2 - 1/(u-3)^2 agree to < 1e-15 absolute -- (star) is the imp-34613 ' +
      'identity re-factored, not a distinct surrogate; both give ~ -6.9e-3 to -7.0e-3 per k^2.',
    F3_near_rungs_confirm_the_sign:
      'The imp-34406 near rungs give an empirical evenly-spaced second difference of ln eflow_attr ' +
      'of -6.86e-3 -> -6.67e-3 per k^2 at k = 21.1 .. 21.4, all strictly NEGATIVE and matching the ' +
      'surrogate (star) to ~2.6% -- the observed near-side log-slope is concave, in the predicted ' +
      'sign, anchoring the derivation to the actual near-side recovery.',
  },
  isRigorous: false,
  honest:
    'SURROGATE DERIVATION ONLY -- a symbolic sign computation inside the inherited imp-3220/imp-3406 ' +
    'component surrogate E_flow ~ log^3(N)/N under the imp-34570 F3 E_N-flat regime, extending the ' +
    'imp-34613 far-side log-concavity to the NEAR side k < k*. The second derivative in the factored ' +
    'form ln10^2 [ -3/u^2 - 3(2u-3)/(u^2-3u)^2 ] is a sum of two terms both strictly negative for ' +
    'every u > 3 (equivalently the collapsed numerator -3(u^2-4u+6) < 0 for all real u), and the ' +
    'imp-34406 near rungs confirm the concave sign to ~2.6%. This is NOT a rigorous asymptotic of ' +
    'the true residual; establishes no operator positivity and no new bound; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34631_ASSERTIONS = [
  {
    // (F1) both terms of (star) strictly negative across the near side AND at the near-side extremes
    // (u just above 3, and u at the near rungs) -- structural, not window-bounded.
    id: 'imp-34631-both-terms-negative-for-u-gt-3',
    description: 'both terms of the factored second derivative are < 0 for all u > 3 (near rungs + u=3.001 + u=48): near-side log-concave',
    holds: () =>
      IMP34631_NEAR_CROSSCHECK.every((r) => imp34631Term1(r.u) < 0 && imp34631Term2(r.u) < 0) &&
      imp34631Term1(3.001) < 0 &&
      imp34631Term2(3.001) < 0 &&
      imp34631Term1(48) < 0 &&
      imp34631Term2(48) < 0 &&
      imp34631LogCurvatureFactored(3.001) < 0 &&
      imp34631LogCurvatureFactored(48) < 0,
  },
  {
    // (F2) the factored form equals the imp-34613 form to the double-precision floor -- same identity.
    id: 'imp-34631-factored-equals-imp34613-form',
    description: 'the factored (star) form and the imp-34613 -2/u^2 - 1/(u-3)^2 form agree to < 1e-14 across the near side',
    holds: () =>
      FORM_MISMATCH < 1e-14 &&
      IMP34631_NEAR_RUNGS.slice(1, -1).every((r) => {
        const u = r.k * LN10;
        return Math.abs(imp34631LogCurvatureFactored(u) - imp34631LogCurvature34613Form(u)) < 1e-14;
      }),
  },
  {
    // (F3) near-side rungs confirm the concave sign: empirical second differences all < 0, matching
    // the surrogate to a few percent.
    id: 'imp-34631-near-rungs-confirm-concave-sign',
    description: 'the imp-34406 near rungs give a strictly negative empirical second difference of ln eflow_attr, matching (star) to < 5%',
    holds: () =>
      IMP34631_NEAR_CROSSCHECK.length === 4 &&
      IMP34631_NEAR_CROSSCHECK.every((r) => r.empD2 < 0 && r.model < 0 && r.relErr < 0.05) &&
      IMP34631_MAX_REL_ERR < 0.05,
  },
  {
    // Honesty gate: surrogate derivation only, isRigorous false, no QED, no refereed bound is changed, C_mb/K_a untouched.
    id: 'imp-34631-honesty-gate-no-qed',
    description: 'Surrogate derivation only: isRigorous false, no QED, no refereed bound is changed, C_mb/K_a untouched',
    holds: () =>
      IMP34631_EFLOW_ATTR_LOG_SLOPE_CONCAVITY_NEAR_SIDE.isRigorous === false &&
      /NO QED/.test(IMP34631_EFLOW_ATTR_LOG_SLOPE_CONCAVITY_NEAR_SIDE.honest) &&
      /refereed bound is changed/i.test(IMP34631_EFLOW_ATTR_LOG_SLOPE_CONCAVITY_NEAR_SIDE.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34631_EFLOW_ATTR_LOG_SLOPE_CONCAVITY_NEAR_SIDE.honest),
  },
];

for (const a of IMP34631_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34631-eflow-attr-log-slope-concavity-near-side assertion failed: ${a.id}`);
  }
}
