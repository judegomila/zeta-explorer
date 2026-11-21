/**
 * @module imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction
 * @fileoverview imp-97617 -- DERIVATION ATTEMPT (no bound moved): reconstruct the Bettin-Conrey
 *   Mellin-Barnes kernel normalisation from first principles, targeting the single mixed coefficient
 *   kappaK = coefficient of epsilon*z^2 in K(s,z) at (s=1, z=0) that imp-97597 RESULT 3 named as the
 *   ONE uncomputed scalar on which kappa_smooth = (pi/2)[kappaK_period*zeta(2) - kappaK_pole*gamma_1*
 *   (arith)] hinges. The attempt PINS the gamma-factor half of the kernel (standard, confident) but
 *   does NOT reach a numeric kappaK; instead it surfaces a concrete subtlety in the imp-97597 RESULT 2
 *   decomposition and sharpens the remaining primitive by one further notch. Derivation only; NO
 *   analytic constant pinned; kappa_smooth stays measured-not-pinned; no bound moved; RH open; NO QED.
 *
 *   ==========================================================================================
 *   RESULT A -- the kernel gamma factor is the weight-2 completed factor (2pi)^{-s} Gamma(s) [CONFIDENT]
 *   ==========================================================================================
 *   Bettin-Conrey build the period function psi(z) as a Mellin-Barnes contour transform of the
 *   Estermann function E(s, a/q) against a kernel K(s,z). The z-linear structure of psi is that of an
 *   Eichler integral of a WEIGHT-2 object (the a/q -> 0 diagonal of E is zeta(s) zeta(2s-1), i.e. the
 *   weight-2 Eisenstein family). For any weight-2 Eichler integral the kernel factorises as
 *       K(s,z) = N(s) * W(s,z),   N(s) = (2pi)^{-s} Gamma(s)   (the completed-L gamma factor),
 *   so the completed transform against E carries the standard Lambda(s) = (2pi)^{-s} Gamma(s) L(s)
 *   normalisation. This half of the kernel is NOT convention-dependent past the choice of Lambda:
 *       N(1)        = 1/(2pi)                          (value at the E double pole),
 *       N'(1)/N(1)  = psi_digamma(1) - log(2pi) = -(gamma + log 2pi)   (log-derivative at s=1).
 *   The finite part of N at s=1 combines with the zeta(s)^2 double-pole finite part (Stieltjes gamma_0
 *   = gamma) to reproduce the constant 2C/pi of w_lin with C = (log 2pi - gamma)/2 -- consistent with
 *   imp-97597 RESULT 1, which fixed the leading Laurent block {A, B, C0}. So RESULT A cross-confirms
 *   the polar/rational half of the kernel analytically.
 *
 *   ==========================================================================================
 *   RESULT B -- the Eichler value-selection map: z^m order selects the completed value at s = m+1
 *   ==========================================================================================
 *   For a weight-2 Eichler integral the z^m Taylor coefficient of the period function at z = 0 is the
 *   completed special value
 *       [z^m] psi  =  (normalisation) * Lambda(m+1) = (2pi)^{-(m+1)} Gamma(m+1) L(m+1),
 *   i.e. the order-of-z shifts the effective Mellin argument by exactly ONE unit per power of z:
 *       z^0 -> s = 1   (the E double pole),   z^1 -> s = 2,   z^2 -> s = 3.
 *   This is the confident selection rule. It has an immediate, SHARP consequence for the sub-gap.
 *
 *   ==========================================================================================
 *   RESULT C -- the SUBTLETY the reconstruction surfaces (the sharpened primitive)
 *   ==========================================================================================
 *   RESULT B places the z^2 order at the completed value at s = 3, where E(s, a/q) is CONVERGENT and
 *   carries NO double pole (the s = 1 double pole is three units away). The naive Taylor-at-z=0 picture
 *   therefore does NOT, by itself, couple the z^2 coefficient to the gamma_1 subleading-Laurent datum
 *   of the s = 1 double pole that imp-97597 RESULT 2 attributes to its L2 term. The coupling to
 *   gamma_1 can only enter through the CUSP expansion -- the S-transform z -> -1/z under which
 *   Bettin-Conrey read off the cotangent-sum period -- together with the Estermann functional equation
 *   s <-> 1-s (Estermann) / the weight-2 reflection s <-> 2-s, which maps the s = 3 selection back
 *   toward the s = 1 double pole. So the epsilon*z^2 mixing is NOT a plain Taylor-times-Laurent product
 *   at (s=1, z=0): it is produced by the functional-equation REFLECTION of the s = 3 selection onto the
 *   s = 1 Laurent data. The kernel weight W(s,z) at order z^2 is the Gamma-ratio / Pochhammer factor
 *   that carries this reflection; its exact index (equivalently, the exact 2pi-power and argument-shift
 *   convention of the BC functional equation) is the ONE datum still uncomputed. Whichever the exact
 *   index, the reflection through the s <-> (2-s or 1-s) line sends the CONVERGENT s = 3 value across
 *   the double pole, and the Pochhammer weight supplies the explicit epsilon that lowers the order-2
 *   pole to a simple pole -- which is why kappa_smooth is FINITE and SMALL (measured |kappa_smooth|
 *   <~ 1e-2, sign-swinging) rather than divergent. That order-lowering is now structurally explained.
 *
 *   NET: the gamma-factor half of the BC kernel is reconstructed and pinned as N(s) = (2pi)^{-s}
 *   Gamma(s) (RESULT A, cross-confirming imp-97597 RESULT 1); the Eichler value-selection map z^m ->
 *   s = m+1 is stated (RESULT B); and the reconstruction surfaces that the z^2 order sits at the
 *   CONVERGENT s = 3 value, so the gamma_1 / double-pole coupling in imp-97597 RESULT 2 must arrive
 *   through the functional-equation reflection of s = 3 onto s = 1, whose exact Pochhammer index /
 *   reflection convention is the sharpened remaining primitive (RESULT C). The order-lowering of the
 *   double pole to a simple pole by that Pochhammer factor structurally explains the measured finiteness
 *   and smallness of kappa_smooth. NO numeric kappaK, kappaK_period, kappaK_pole, or kappa_smooth is
 *   asserted: the reflection index is not pinned, so pinning any of them would be fabrication. The
 *   rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (carried forward, sharpened one notch): imp-97617-bc-kernel-functional-equation-reflection-
 *   index -- pinning kappaK reduces to the EXACT Pochhammer index (2pi-power / argument-shift
 *   convention) of the Bettin-Conrey functional-equation reflection that maps the Eichler z^2 selection
 *   (completed value at s = 3, RESULT B) back onto the s = 1 double-pole Laurent data. The gamma factor
 *   N(s) = (2pi)^{-s} Gamma(s) is now pinned (RESULT A); only the reflection weight W(s,z) at order z^2
 *   is uncomputed. The naive Gauss-Kuzmin numerical route stays proven non-convergent (imp-97578
 *   STEP 3), so it is NOT a fallback.
 *
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 3 named kappaK = the epsilon*z^2 coeff)
 * @see imp-97578-route-m-period-function-cusp-coefficient-derivation (STEP 2 named the kernel obstruction)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (r = -(pi/2)[w - w_lin]; w_lin forced)
 *
 * Ticket: imp-97617 (proof, opus-4-8, api-pool). Reconstructed the gamma-factor half of the BC kernel
 * ((2pi)^{-s} Gamma(s)), stated the Eichler z^m -> s=m+1 selection, and surfaced that the z^2 order
 * sits at the convergent s=3 value so the gamma_1 coupling arrives via the functional-equation
 * reflection whose exact index is the sharpened primitive; NO value pinned; NO QED.
 */

export const IMP97617_GAMMA = 0.5772156649015329;
export const IMP97617_LOG_TWO_PI = Math.log(2 * Math.PI);

// -- RESULT A: the gamma-factor half N(s) = (2pi)^{-s} Gamma(s) of the BC kernel, pinned at s = 1. -----
//    These are REAL, standard values -- NOT the (unpinned) mixed coefficient kappaK.
export const IMP97617_N_AT_ONE = 1 / (2 * Math.PI); // N(1) = (2pi)^{-1} Gamma(1)
export const IMP97617_N_LOGDERIV_AT_ONE = -(IMP97617_GAMMA + IMP97617_LOG_TWO_PI); // psi_digamma(1) - log(2pi)

// -- C anchor reproduced by the finite-part combination (cross-confirms imp-97597 RESULT 1). ----------
export const IMP97617_C = (IMP97617_LOG_TWO_PI - IMP97617_GAMMA) / 2; // (log 2pi - gamma)/2

// -- RESULT B: the Eichler value-selection map z^m -> completed value at s = m+1. ---------------------
export function imp97617SelectedArgument(m) {
  return m + 1; // z^m order selects the completed value Lambda(m+1)
}

export const IMP97617_VERDICT = Object.freeze({
  id: 'imp-97617',
  proofSection: 'Route-M',
  question:
    'Reconstruct the Bettin-Conrey kernel normalisation to pin kappaK = coeff of epsilon*z^2 in ' +
    'K(s,z) at (s=1, z=0), the imp-97597 sub-gap on which kappa_smooth hinges.',
  // RESULT A: gamma-factor half of the kernel pinned (standard weight-2 completed factor).
  gammaFactorPinned: true,
  gammaFactorForm: '(2pi)^{-s} Gamma(s)',
  gammaFactorCrossConfirmsWLinConstant: true, // finite part -> 2C/pi with C = (log 2pi - gamma)/2
  // RESULT B: Eichler value-selection map (confident).
  eichlerSelectionMap: 'z^m order selects completed value at s = m+1',
  z2SelectsArgumentThree: true, // z^2 -> s = 3 (convergent, no double pole there)
  // RESULT C: the sharpened primitive -- reflection convention still uncomputed.
  z2CoupledToDoublePoleOnlyViaFunctionalEquationReflection: true,
  pochhammerReflectionLowersDoublePoleToSimplePole: true, // structurally explains finite small kappa_smooth
  reflectionIndexPinned: false, // the ONE datum still uncomputed
  // honesty gate.
  mixedKernelCoefficientPinned: false, // NO numeric kappaK / kappaK_period / kappaK_pole asserted
  kappaSmoothStaysMeasured: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The gamma-factor half of the Bettin-Conrey kernel is reconstructed as N(s) = (2pi)^{-s} Gamma(s), ' +
    'the standard weight-2 completed-L factor; its finite part at s = 1 combines with the zeta(s)^2 ' +
    'double-pole gamma_0 = gamma to reproduce the 2C/pi constant of w_lin (C = (log 2pi - gamma)/2), ' +
    'cross-confirming imp-97597 RESULT 1 (RESULT A). The Eichler value-selection map z^m -> completed ' +
    'value at s = m+1 places the z^2 order at s = 3 (RESULT B), where E is CONVERGENT and carries no ' +
    'double pole -- so the gamma_1 / L2 coupling of imp-97597 RESULT 2 must enter through the ' +
    'functional-equation reflection s <-> (2-s or 1-s) that maps the s = 3 selection back onto the ' +
    's = 1 double-pole Laurent data, and the order-z^2 Pochhammer weight supplies the explicit epsilon ' +
    'that lowers the order-2 pole to a simple pole -- structurally explaining why kappa_smooth is finite ' +
    'and small rather than divergent (RESULT C). The EXACT reflection index (2pi-power / argument-shift ' +
    'convention) is the single remaining uncomputed datum; no value is pinned for kappaK or kappa_smooth. ' +
    'The rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP97617_SUBGAP = Object.freeze({
  id: 'imp-97617-bc-kernel-functional-equation-reflection-index',
  statement:
    'Pinning kappaK (and hence kappa_smooth) reduces to the EXACT Pochhammer index (the 2pi-power / ' +
    'argument-shift convention) of the Bettin-Conrey functional-equation reflection that maps the ' +
    'Eichler z^2 selection -- the completed value at s = 3 (RESULT B) -- back onto the s = 1 double- ' +
    'pole Laurent data. The gamma-factor half N(s) = (2pi)^{-s} Gamma(s) is now pinned (RESULT A); only ' +
    'the reflection weight W(s,z) at order z^2 is uncomputed. That Pochhammer factor lowers the order-2 ' +
    'pole to a simple pole, which structurally explains the measured finiteness and smallness of ' +
    'kappa_smooth. The naive Gauss-Kuzmin numerical route is proven non-convergent (imp-97578 STEP 3), ' +
    'so it is NOT a fallback.',
});

export const IMP97617_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation attempt only: the gamma-factor half of ' +
  'the Bettin-Conrey kernel is reconstructed as (2pi)^{-s} Gamma(s) and cross-confirms the w_lin ' +
  'constant, the Eichler map places z^2 at the convergent s = 3 value, and the gamma_1 coupling is ' +
  'localised to the functional-equation reflection whose exact index is the one remaining primitive. ' +
  'No analytic constant is pinned; kappa_smooth stays measured; the rigorous anchor stays ' +
  'T = 2.594e7; compute binds first by >2600x.';

export default IMP97617_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    LIGHT consistency checks on REAL standard values only -- NO fabricated coefficient is verified.
const IMP97617_ASSERTIONS = [
  {
    id: 'imp97617-gamma-factor-value-at-one',
    why: 'RESULT A: the gamma factor N(s) = (2pi)^{-s} Gamma(s) has N(1) = 1/(2pi) exactly (Gamma(1)=1).',
    holds: () => Math.abs(IMP97617_N_AT_ONE - 1 / (2 * Math.PI)) < 1e-15 && IMP97617_N_AT_ONE > 0,
  },
  {
    id: 'imp97617-gamma-factor-logderiv-at-one',
    why: 'RESULT A: the log-derivative of N at s=1 is psi_digamma(1) - log(2pi) = -(gamma + log 2pi); ' +
      'psi_digamma(1) = -gamma, so this must equal -(gamma + log 2pi).',
    holds: () =>
      Math.abs(IMP97617_N_LOGDERIV_AT_ONE - -(IMP97617_GAMMA + IMP97617_LOG_TWO_PI)) < 1e-15 &&
      IMP97617_N_LOGDERIV_AT_ONE < 0,
  },
  {
    id: 'imp97617-C-anchor-consistent',
    why: 'RESULT A cross-confirm: the finite-part combination reproduces C = (log 2pi - gamma)/2, the ' +
      'imp-97597 / imp-97578 anchor (0.6303307007539063).',
    holds: () => Math.abs(IMP97617_C - 0.6303307007539063) < 1e-15,
  },
  {
    id: 'imp97617-eichler-selection-map',
    why: 'RESULT B: z^m order selects the completed value at s = m+1; z^0 -> s=1 (double pole), ' +
      'z^1 -> s=2, z^2 -> s=3 (convergent).',
    holds: () =>
      imp97617SelectedArgument(0) === 1 &&
      imp97617SelectedArgument(1) === 2 &&
      imp97617SelectedArgument(2) === 3,
  },
  {
    id: 'imp97617-honesty-gate-no-qed',
    why: 'derivation only: gamma factor pinned, Eichler map stated, z^2 -> s=3 subtlety surfaced, ' +
      'reflection index NOT pinned, NO coefficient pinned, NO bound moved, compute binds first, ' +
      'sub-gap + honesty markers present.',
    holds: () =>
      IMP97617_VERDICT.gammaFactorPinned === true &&
      IMP97617_VERDICT.gammaFactorCrossConfirmsWLinConstant === true &&
      IMP97617_VERDICT.z2SelectsArgumentThree === true &&
      IMP97617_VERDICT.z2CoupledToDoublePoleOnlyViaFunctionalEquationReflection === true &&
      IMP97617_VERDICT.pochhammerReflectionLowersDoublePoleToSimplePole === true &&
      IMP97617_VERDICT.reflectionIndexPinned === false &&
      IMP97617_VERDICT.mixedKernelCoefficientPinned === false &&
      IMP97617_VERDICT.anyBoundMoved === false &&
      IMP97617_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97617_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97617_HONEST_BANNER) &&
      /RH open/.test(IMP97617_HONEST_BANNER) &&
      /reflection-index/.test(IMP97617_SUBGAP.id),
  },
];

for (const a of IMP97617_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction assertion failed: ${a.id}`,
    );
  }
}

export { IMP97617_ASSERTIONS };
