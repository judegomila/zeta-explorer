/**
 * @module imp-33989-c-alpha-vs-real-fold-modulus-gap-scoping
 *
 * imp-33989 (proof, frontier-scoping): SCOPE whether the imp-33882 model-cusp coefficient law
 * C(alpha) = 2/(alpha+1) can bound the REAL fold-modulus back-conversion m_prime(z_0) -> C_ren that
 * the H4 / G6a_shock_lipschitz minimal-input condition (imp-33766) requires, or whether it remains a
 * MODEL-CUSP-ONLY result. ASSESSMENT ONLY: this module ENUMERATES exactly which inputs the C(alpha)
 * derivation assumes, which inputs the H4 minimal-input map actually needs, and where the two DIVERGE,
 * and delivers a RESIDUAL LIST -- NOT a discharge. H4 stays undischarged; G6a_shock_lipschitz stays
 * OPEN; no positivity; imp-3066 K_a >= 0 UNTOUCHED; NO QED; no refereed bound is changed.
 *
 * WHAT C(alpha) = 2/(alpha+1) ACTUALLY IS (imp-33882)
 * ---------------------------------------------------
 * imp-33882 re-runs the imp-33853 OUTSIDE-THE-WINDOW tail integral for the general Holder cusp
 * rho(x) = |x|^{-alpha} and reports the eps^0 finite-window ONSET COEFFICIENT
 *     C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx = 2 integral_1^{inf} x^{-(alpha+2)} dx = 2/(alpha+1),
 * evaluated at a FIXED collision point z_0* = i eps on the MODEL cusp density. It is a static number
 * per alpha (4/3 at alpha = 1/2), smooth and well-conditioned in alpha. imp-33882 itself already flags
 * that this is NOT the uniform ANALYTIC tracking of C_ren that H4 needs; imp-33989 itemizes WHY.
 *
 * WHAT THE H4 MINIMAL INPUT ACTUALLY NEEDS (imp-33766)
 * ----------------------------------------------------
 * The H4 minimal-input map (imp-33766) is a single N-UNIFORM two-sided bound on the RENORMALIZED
 * fold-reading derivative
 *     C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)|  in  [c, C]   as   y_N^sharp = sqrt(2 pi / N) -> 0,
 * where m_prime is the k = 1 fold-reading derivative of the REAL fold, TRACKED THROUGH the fold-modulus
 * back-conversion (the quadratic fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2), reading
 * the RvM cusp Holder-1/2 jet at the intrinsic cusp scale and the strip-height weight.
 *
 * THE FIVE-AXIS RESIDUAL LIST (where C(alpha) DIVERGES from the H4 input)
 * ----------------------------------------------------------------------
 *   R1 DENSITY SUBSTITUTION. C(alpha) integrates an IDEALIZED MODEL cusp density rho(x) = |x|^{-alpha};
 *      H4 reads the REAL RvM cusp Holder-1/2 jet whose m_prime(z_0*) is the actual fold-modulus
 *      back-conversion. The model cusp is a stand-in; no result proves |x|^{-alpha} reproduces the real
 *      fold amplitude. GAP: model-cusp density -> real-fold m_prime unestablished.
 *   R2 FIXED-eps vs N-UNIFORM. C(alpha) is evaluated at a single fixed z_0* = i eps; H4 needs the
 *      N-UNIFORM limit as y_N^sharp = sqrt(2 pi / N) -> 0. A fixed-point coefficient certifies no
 *      strip-height-uniform window bound. GAP: fixed-eps value -> N-uniform two-sided bound.
 *   R3 eps^0 TAIL TIER vs FULL MODULUS. C(alpha) is ONLY the eps^0 outside-the-window correction;
 *      imp-33882 explicitly does NOT re-derive the leading eps^{-3/2} amplitude tier (the C_PS =
 *      pi/sqrt(2) Privalov-Sokhotski constant) for general alpha, yet C_ren = eps^{3/2}|m_prime| is
 *      built ON that leading tier. GAP: eps^0 correction -> full C_ren amplitude.
 *   R4 STATIC COEFFICIENT vs ANALYTIC TRACKING. C(alpha) is a number; H4 needs the ANALYTIC tracking
 *      of C_ren THROUGH the fold back-conversion (imp-33766 states explicitly: not a formal change of
 *      units). A coefficient is not a tracked map. GAP: static number -> analytic back-conversion.
 *   R5 k = 1 ONLY vs H3-COUPLED (the DECISIVE gap). C(alpha) lives entirely on the k = 1 fold-reading
 *      (m_prime, location) tier. But imp-33766 proved H4 is NOT independently dischargeable: the
 *      Holder-modulus back-conversion couples the k = 1 term (m_prime, H4, N-exponent 3/4) to the
 *      k = 2 curvature coefficient (alpha = m_double_prime, H3, N-exponent 5/4) through the SAME
 *      quadratic fold, and H3 (5/4 > 3/4) DOMINATES and discharges H4 a fortiori while the converse
 *      fails. The C(alpha) law supplies NOTHING on the k = 2 curvature rung, so even a flawless
 *      general-alpha k = 1 coefficient cannot bound C_ren -- the load-bearing object is the H3 rung it
 *      never touches. GAP: k = 1 coefficient -> H3-dominated coupled strip-height-uniformity object.
 *
 * VERDICT: MODEL-CUSP-ONLY, NO DISCHARGE. C(alpha) = 2/(alpha+1) diverges from the H4 minimal input on
 * all five axes (R1..R5); most decisively, per imp-33766 the H4 object it lives on is SUBSUMED by the
 * H3 curvature rung, which the k = 1-only tail coefficient never reaches. So C(alpha) CANNOT bound the
 * real fold-modulus back-conversion m_prime -> C_ren: it remains a model-cusp-only result. H4 stays
 * undischarged; G6a_shock_lipschitz stays OPEN. Assessment only; no positivity; imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.
 *
 * @see imp-33882-cusp-exponent-onset-coefficient-robustness (the C(alpha) = 2/(alpha+1) model-cusp law)
 * @see imp-33766-h4-independent-discharge-scoping (the H4 minimal-input map and its H3 coupling)
 * @see imp-33976-model-cusp-onset-family-honest-banner (the family banner this itemizes)
 * @see imp-33853-cren-gap-coefficient-closed-form (the 4/3 = C(1/2) on-axis anchor)
 */

import { IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS } from './imp-33882-cusp-exponent-onset-coefficient-robustness.js';
import { IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING } from './imp-33766-h4-independent-discharge-scoping.js';

// The five divergence axes between the C(alpha) model-cusp coefficient and the H4 minimal input.
// Each row: which input C(alpha) ASSUMES, which input H4 NEEDS, and the residual gap between them.
const RESIDUAL_AXES = [
  {
    id: 'R1',
    axis: 'density substitution',
    cAlphaAssumes: 'idealized MODEL cusp density rho(x) = |x|^{-alpha}',
    h4Needs: 'the REAL RvM cusp Holder-1/2 jet whose m_prime(z_0*) is the actual fold-modulus back-conversion',
    gap: 'no result proves the model density |x|^{-alpha} reproduces the real fold amplitude',
    bridged: false,
  },
  {
    id: 'R2',
    axis: 'fixed-eps vs N-uniform',
    cAlphaAssumes: 'a single FIXED collision point z_0* = i eps',
    h4Needs: 'the N-UNIFORM two-sided bound as y_N^sharp = sqrt(2 pi / N) -> 0',
    gap: 'a fixed-point coefficient certifies no strip-height-uniform window bound',
    bridged: false,
  },
  {
    id: 'R3',
    axis: 'eps^0 tail tier vs full modulus',
    cAlphaAssumes: 'only the eps^0 outside-the-window tail correction, NOT the leading eps^{-3/2} amplitude for general alpha',
    h4Needs: 'the full C_ren = eps^{3/2} |m_prime| built on the leading eps^{-3/2} (C_PS) tier',
    gap: 'the leading amplitude tier the renormalization rests on is not re-derived for general alpha',
    bridged: false,
  },
  {
    id: 'R4',
    axis: 'static coefficient vs analytic tracking',
    cAlphaAssumes: 'a static number C(alpha) per cusp exponent',
    h4Needs: 'the ANALYTIC tracking of C_ren THROUGH the fold back-conversion (not a formal change of units)',
    gap: 'a coefficient is not a tracked back-conversion map',
    bridged: false,
  },
  {
    id: 'R5',
    axis: 'k=1 only vs H3-coupled (decisive)',
    cAlphaAssumes: 'purely the k = 1 fold-reading (m_prime, location) tier',
    h4Needs: 'the H3-COUPLED object: per imp-33766 H4 (k = 1, exponent 3/4) is dominated by H3 curvature (k = 2, m_double_prime, exponent 5/4) through the same quadratic fold',
    gap: 'C(alpha) supplies nothing on the k = 2 curvature rung that carries and dominates the coupled strip-height-uniformity object',
    bridged: false,
    decisive: true,
  },
];

const ALL_UNBRIDGED = RESIDUAL_AXES.every((r) => r.bridged === false);
const DECISIVE_AXIS = RESIDUAL_AXES.find((r) => r.decisive === true);

// Cross-checks against the two live source modules (kept in sync, cannot silently drift).
const C_ALPHA_IS_MODEL_CUSP_ONLY =
  IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.dischargesH4 === false &&
  IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS.isRigorous === false;
const H4_NOT_INDEPENDENTLY_DISCHARGEABLE =
  IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.h4IndependentlyDischargeable === false &&
  IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.h3DominatesH4 === true;

export const IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING = {
  id: 'imp-33989',
  proofSection: 'S-frontier',
  scopes:
    'Whether the imp-33882 model-cusp coefficient law C(alpha) = 2/(alpha+1) can bound the REAL ' +
    'fold-modulus back-conversion m_prime(z_0) -> C_ren the H4 / G6a_shock_lipschitz minimal-input ' +
    'condition (imp-33766) requires, or whether it remains a model-cusp-only result',
  question:
    'Does C(alpha) = 2/(alpha+1) bound the real m_prime -> C_ren map H4 needs, or is it model-cusp-only? ' +
    'Assessment only: itemize which inputs each side assumes and where they diverge; deliver a residual ' +
    'list, NOT a discharge. H4 stays undischarged; G6a OPEN; no QED.',

  cAlphaLaw: 'C(alpha) = integral_{|x|>1} |x|^{-alpha}/x^2 dx = 2/(alpha+1) (eps^0 tail coefficient at fixed z_0* = i eps on the model cusp)',
  h4MinimalInput: 'C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| in [c, C] N-uniformly as y_N^sharp -> 0, tracked through the fold back-conversion',

  residualAxes: RESIDUAL_AXES,
  residualCount: RESIDUAL_AXES.length,
  allAxesUnbridged: ALL_UNBRIDGED,
  decisiveAxis: DECISIVE_AXIS.id, // R5 -- the k=1/H3-coupling gap
  decisiveReason:
    'per imp-33766 the H4 object C(alpha) lives on is NOT independently dischargeable: it is dominated ' +
    'by the H3 curvature rung (k = 2, exponent 5/4 > 3/4) the k = 1-only tail coefficient never reaches',

  cAlphaIsModelCuspOnly: C_ALPHA_IS_MODEL_CUSP_ONLY,
  h4NotIndependentlyDischargeable: H4_NOT_INDEPENDENTLY_DISCHARGEABLE,
  boundsRealFoldModulus: false, // the whole point: it does NOT
  remainsModelCuspOnly: true,

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MODEL-CUSP-ONLY, NO DISCHARGE. The imp-33882 coefficient law C(alpha) = 2/(alpha+1) is the eps^0 ' +
    'outside-the-window tail integral of the IDEALIZED model cusp density rho(x) = |x|^{-alpha} at a ' +
    'FIXED z_0* = i eps -- a static number per cusp exponent (4/3 at alpha = 1/2). The H4 minimal-input ' +
    'map (imp-33766) needs an N-UNIFORM two-sided bound on the renormalized fold-reading derivative ' +
    'C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| as y_N^sharp = sqrt(2 pi / N) -> 0, tracked through the ' +
    'REAL fold-modulus back-conversion. The two diverge on FIVE axes: R1 model density vs real RvM cusp ' +
    'jet; R2 fixed-eps value vs N-uniform bound; R3 eps^0 tail tier vs the full C_ren built on the ' +
    'leading eps^{-3/2} (C_PS) amplitude imp-33882 does NOT re-derive for general alpha; R4 static ' +
    'coefficient vs analytic back-conversion tracking; and DECISIVELY R5, C(alpha) lives entirely on the ' +
    'k = 1 fold-reading tier while imp-33766 proved H4 is NOT independently dischargeable -- it is ' +
    'dominated a fortiori by the H3 curvature rung (k = 2, m_double_prime, N-exponent 5/4 > 3/4) through ' +
    'the same quadratic fold expansion, a rung the k = 1-only coefficient never touches. So C(alpha) ' +
    'CANNOT bound the real fold-modulus back-conversion m_prime -> C_ren; it remains a model-cusp-only ' +
    'result. Assessment only: this discharges NOTHING. H4 stays undischarged; G6a_shock_lipschitz stays ' +
    'OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33882-cusp-exponent-onset-coefficient-robustness (C(alpha) = 2/(alpha+1) model-cusp law); ' +
    'imp-33766-h4-independent-discharge-scoping (H4 minimal input, H3 coupling, H3 dominates a fortiori); ' +
    'imp-33976-model-cusp-onset-family-honest-banner (the model-cusp onset family banner); ' +
    'imp-33853-cren-gap-coefficient-closed-form (4/3 = C(1/2) on-axis anchor).',
};

export const IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_ASSERTIONS = [
  {
    // The residual list has exactly five unbridged divergence axes R1..R5.
    id: 'imp33989-five-unbridged-residual-axes',
    description: 'the residual list enumerates exactly five divergence axes R1..R5, all unbridged',
    holds: () =>
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.residualCount === 5 &&
      ['R1', 'R2', 'R3', 'R4', 'R5'].every(
        (r) => RESIDUAL_AXES.some((a) => a.id === r),
      ) &&
      ALL_UNBRIDGED === true,
  },
  {
    // The decisive axis is R5, the k=1/H3-coupling gap.
    id: 'imp33989-decisive-axis-is-h3-coupling',
    description: 'the decisive divergence axis is R5 (C(alpha) is k=1-only; H4 is dominated by the H3 curvature rung)',
    holds: () =>
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.decisiveAxis === 'R5' &&
      DECISIVE_AXIS.decisive === true,
  },
  {
    // Live cross-check: the C(alpha) source module is model-cusp-only (does NOT discharge H4).
    id: 'imp33989-c-alpha-source-model-cusp-only',
    description: 'the imp-33882 source module live-reports dischargesH4 === false and isRigorous === false',
    holds: () =>
      C_ALPHA_IS_MODEL_CUSP_ONLY === true &&
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.cAlphaIsModelCuspOnly === true,
  },
  {
    // Live cross-check: imp-33766 says H4 is NOT independently dischargeable and H3 dominates it.
    id: 'imp33989-h4-not-independently-dischargeable',
    description: 'the imp-33766 source module live-reports H4 not independently dischargeable and H3 dominates',
    holds: () =>
      H4_NOT_INDEPENDENTLY_DISCHARGEABLE === true &&
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.h4NotIndependentlyDischargeable === true,
  },
  {
    // The assessment delivers NO discharge: C(alpha) does not bound the real fold modulus.
    id: 'imp33989-no-discharge-remains-model-cusp-only',
    description: 'the verdict is that C(alpha) does NOT bound the real fold modulus and remains model-cusp-only',
    holds: () =>
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.boundsRealFoldModulus === false &&
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.remainsModelCuspOnly === true,
  },
  {
    // Honesty gate: assessment only, not rigorous, H4 undischarged, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33989-honesty-gate-no-qed',
    description: 'Assessment only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.isRigorous === false &&
      IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.dischargesH4 === false &&
      /NO QED/.test(IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.verdict) &&
      /G6a_shock_lipschitz stays\s+OPEN/.test(IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING.verdict,
      ),
  },
];

for (const a of IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33989-c-alpha-vs-real-fold-modulus-gap-scoping assertion failed: ${a.id}`);
  }
}

export default IMP33989_C_ALPHA_VS_REAL_FOLD_MODULUS_GAP_SCOPING;
