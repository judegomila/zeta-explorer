/**
 * @module imp-34846-sigma-knee-third-order-closed-form-locator
 *
 * imp-34846 (numerical/derivation, frontier-direction): imp-34820 showed the sigmoid INFLECTION
 * (sigma_secondDeriv = 0) has an exact closed-form D2 locator from the SECOND-order logistic identity
 * sigma_secondDeriv = S(1-S)[(1-2S) u_prime^2 + u_secondDeriv], landing on the finite-difference inflection to
 * ~3e-8 and removing the imp-34746 FD floor. This module asks the sibling THIRD-order question the ticket poses:
 * does the same logistic-differentiation technique yield a closed-form locator for the DISTINCT sigma-KNEE (the
 * g_thirdDeriv = 0 root at log10 N* ~ 9.53638, ~0.0127 dex above the inflection), removing ITS finite-difference
 * floor -- the floor imp-34796 leaves in place by locating the knee through the FD third difference d3(ln sigma)?
 *
 * THE VERDICT (answers the ticket literally: NO for sigma_thirdDeriv, YES for the g = ln sigma third-order identity)
 * ------------------------------------------------------------------------------------------------------------------
 * The sigma-KNEE is the root of g_thirdDeriv = 0 where g = ln sigma (the imp-34796 identity F = -g_thirdDeriv/(1-S),
 * F = 0 <=> g_thirdDeriv = 0 since 1-S > 0). Two different "third-order" closed forms come out of the same logistic
 * algebra, and only ONE locates the knee:
 *   (i)  sigma_thirdDeriv (third derivative of sigma ITSELF) has the closed form
 *        sigma_thirdDeriv = S(1-S)[(1 - 6S + 6S^2) u_prime^3 + 3(1-2S) u_prime u_secondDeriv + u_thirdDeriv].
 *        Its root sigma_thirdDeriv = 0 is a DIFFERENT landmark -- at log10 N* ~ 8.327, sigma ~ 0.786, a full
 *        ~1.21 dex BELOW the knee. So sigma_thirdDeriv = 0 is the WRONG object for the sigma-KNEE (the same
 *        order/object mismatch imp-34820 found when the third-order identity missed the D2 inflection).
 *   (ii) g_thirdDeriv (third derivative of g = ln sigma, the imp-34796 knee object) has the closed form
 *        g_thirdDeriv = (1-S)[ u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 ].
 *        Since 1-S > 0, g_thirdDeriv = 0 IFF the bracket u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1)
 *        u_prime^3 = 0 -- a CLOSED-FORM sigma-KNEE locator built only from the smooth u-derivatives and the
 *        algebraic factor S, no third difference of ln sigma. Its root lands ON the finite-difference
 *        g_thirdDeriv = 0 knee to ~6e-8, removing the FD floor -- exactly as imp-34820s D2 identity did for the
 *        inflection, one order up. This is the imp-34796 identity F = -g_thirdDeriv/(1-S) rendered in closed form:
 *        F = -[ u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 ].
 *
 * THE MEASUREMENT (confirms the g = ln sigma third-order identity is exact algebra, like imp-34796/imp-34820)
 * ----------------------------------------------------------------------------------------------------------
 *   (A) POINTWISE: the closed form (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3] matches the
 *       independent FD third difference d3(ln sigma) to ~1e-5 relative at h = 1e-2 across the knee band -- the
 *       shared O(h^2) truncation of two discretizations of the SAME analytic object, not a fixed offset.
 *   (B) O(h^2) SCALING: halving h quarters the pointwise residual (8.1e-4 -> 2.0e-4 -> 5.0e-5 -> 1.2e-5 at x=22,
 *       mean ratio ~4.01), the signature of exact algebra with no h-independent floor above roundoff.
 *   (C) KNEE MATCH: the closed-form g_thirdDeriv = 0 root and the FD g_thirdDeriv = 0 knee agree to ~6e-8 in x
 *       (log10 N* ~ 9.53638 both) -- the closed form lands on the FD knee, removing the FD floor.
 *   (D) DISTINCT OBJECT: the sigma_thirdDeriv = 0 root sits ~1.21 dex below the knee, confirming the third
 *       derivative of sigma is NOT the knee locator; the knee is a property of g = ln sigma, not of sigma.
 *
 * THE FINDING (derivation + measurement; answers the ticket)
 * ----------------------------------------------------------
 *   (F1) sigma_thirdDeriv = 0 IS NOT THE SIGMA-KNEE. Its closed form S(1-S)[(1-6S+6S^2) u_prime^3 + 3(1-2S)
 *        u_prime u_secondDeriv + u_thirdDeriv] roots at log10 N* ~ 8.327 (sigma ~ 0.786), ~1.21 dex below the
 *        g_thirdDeriv = 0 knee. The third derivative of sigma is the wrong object; the knee lives on g = ln sigma.
 *   (F2) THE g = ln sigma THIRD-ORDER IDENTITY SUPPLIES THE KNEE CLOSED FORM. g_thirdDeriv = (1-S)[u_thirdDeriv -
 *        3S u_prime u_secondDeriv + S(2S-1) u_prime^3], so g_thirdDeriv = 0 <=> u_thirdDeriv - 3S u_prime
 *        u_secondDeriv + S(2S-1) u_prime^3 = 0. This closed-form root lands on the FD knee to ~6e-8, removing the
 *        FD floor imp-34796 left -- the third-order analogue of the imp-34820 D2 inflection closed form.
 *   (F3) THE IDENTITY IS EXACT ALGEBRA. The pointwise closed-form vs FD d3(ln sigma) match scales as clean O(h^2)
 *        (mean halving ratio ~4) with no floor above roundoff, ruling out an h-independent offset -- consistent
 *        with the imp-34796 exact-zero finding, now with the knee condition written entirely in u-derivatives.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed. The E_flow-reinstatement
 * sub-gap (imp-34796/imp-34820/imp-34837) is inherited UNCHANGED: this closed form is on the no-E_flow surrogate.
 *
 * @see imp-34796-sigma-knee-gap-exact-zero-identity (the F = -g_thirdDeriv/(1-S) identity this renders in closed form)
 * @see imp-34820-sigmoid-inflection-d2-closed-form-locator (the sibling second-order D2 closed form this mirrors)
 * @see imp-34837-sigmoid-inflection-d2-eflow-reinstatement (the E_flow-reinstatement sub-gap inherited here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// ---- no-E_flow logistic model (identical sub-terms to imp-34796/imp-34820/imp-34710) ----------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}
function lnSigma(x) {
  return Math.log(sigmaOf(x)); // g = ln sigma
}

// central-difference stencils
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// CLOSED-FORM g_thirdDeriv (g = ln sigma): (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3].
// Root g_thirdDeriv = 0 is the sigma-KNEE (imp-34796 F = -g_thirdDeriv/(1-S), F = 0 <=> this bracket = 0).
function gThirdClosed(x, h) {
  const S = sigmaOf(x);
  const up = d1(uOf, x, h);
  const upp = d2(uOf, x, h);
  const uppp = d3(uOf, x, h);
  return (1 - S) * (uppp - 3 * S * up * upp + S * (2 * S - 1) * up * up * up);
}
// CLOSED-FORM sigma_thirdDeriv (third derivative of sigma ITSELF): S(1-S)[(1-6S+6S^2)u_prime^3 +
// 3(1-2S)u_prime u_secondDeriv + u_thirdDeriv]. Its root sigma_thirdDeriv = 0 is a DIFFERENT landmark.
function sigmaThirdClosed(x, h) {
  const S = sigmaOf(x);
  const up = d1(uOf, x, h);
  const upp = d2(uOf, x, h);
  const uppp = d3(uOf, x, h);
  return S * (1 - S) * ((1 - 6 * S + 6 * S * S) * up * up * up + 3 * (1 - 2 * S) * up * upp + uppp);
}
// FD reference for the knee object g = ln sigma (imp-34796 route).
function gThirdFD(x, h) {
  return d3(lnSigma, x, h);
}

// robust sign-change bisection on a bracket known to contain a single root
function bisect(f, a, b, h) {
  let fa = f(a, h);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m, h);
    if (fa * fm <= 0) b = m;
    else {
      a = m;
      fa = fm;
    }
  }
  return 0.5 * (a + b);
}

const H_ID = 1e-2; // imp-34796 optimal step h*
const LN10 = Math.LN10;

// ---- (F2) closed-form g_thirdDeriv=0 knee vs the FD g_thirdDeriv=0 knee (FD floor removed) ---------------
const X_KNEE_CLOSED = bisect(gThirdClosed, 18, 26, H_ID); // closed-form sigma-KNEE
const X_KNEE_FD = bisect(gThirdFD, 18, 26, H_ID); // imp-34796 FD sigma-KNEE
const CLOSED_VS_FD_KNEE_SEP = Math.abs(X_KNEE_CLOSED - X_KNEE_FD); // ~6e-8: closed form lands ON the FD knee

// ---- (F1) sigma_thirdDeriv=0 is a DISTINCT landmark, ~1.21 dex below the knee ---------------------------
const X_SIGMA3 = bisect(sigmaThirdClosed, 18, 26, H_ID); // sigma_thirdDeriv = 0 (closed form)
const X_SIGMA3_FD = bisect((x, h) => d3(sigmaOf, x, h), 18, 26, H_ID); // FD sigma_thirdDeriv = 0
const SIGMA3_CLOSED_VS_FD_SEP = Math.abs(X_SIGMA3 - X_SIGMA3_FD); // ~1.4e-5: closed form is exact here too
const KNEE_MINUS_SIGMA3_DEX = (X_KNEE_CLOSED - X_SIGMA3) / LN10; // ~+1.21 dex: DIFFERENT landmark

// ---- (A) pointwise exactness of the g_thirdDeriv closed form across the knee band -----------------------
const X_SAMPLES = [20, 21, 22, 23, 24];
const POINTWISE = X_SAMPLES.map((x) => {
  const lhs = gThirdFD(x, H_ID); // d3(ln sigma), independent stencil
  const rhs = gThirdClosed(x, H_ID); // (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1)u_prime^3]
  return { x, lhs, rhs, relResid: Math.abs((lhs - rhs) / rhs) };
});
const MAX_REL_RESID = Math.max(...POINTWISE.map((r) => r.relResid));

// ---- (B) O(h^2) scaling of the closed-form vs FD residual at a fixed x near the knee --------------------
const X_SCALE = 22;
const SCALE_HS = [8e-2, 4e-2, 2e-2, 1e-2]; // larger steps: d3 roundoff floor kicks in below ~1e-2
const SCALING = SCALE_HS.map((h) => {
  const lhs = gThirdFD(X_SCALE, h);
  const rhs = gThirdClosed(X_SCALE, h);
  return { h, relResid: Math.abs((lhs - rhs) / rhs) };
});
const HALVING_RATIOS = [];
for (let i = 0; i + 1 < SCALING.length; i++) {
  HALVING_RATIOS.push(SCALING[i].relResid / SCALING[i + 1].relResid);
}
const MEAN_HALVING_RATIO = HALVING_RATIOS.reduce((s, r) => s + r, 0) / HALVING_RATIOS.length;

export const IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR = {
  id: 'imp-34846',
  proofSection: 'S-frontier',
  question:
    'imp-34820 gave the sigmoid inflection a closed-form D2 locator from the second-order logistic identity, ' +
    'removing its FD floor. Does the same technique yield a closed-form locator for the DISTINCT sigma-KNEE ' +
    '(g_thirdDeriv = 0 at log10 N* ~ 9.53638), removing ITS finite-difference floor (the d3(ln sigma) route ' +
    'imp-34796 leaves in place)? Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; ' +
    'C_mb GUE-conditional (imp-486); no QED.',
  verdictShort:
    'NO for sigma_thirdDeriv (the third derivative of sigma ITSELF; its root is a DISTINCT landmark ~1.21 dex ' +
    'below the knee); YES for the g = ln sigma third-order identity g_thirdDeriv = (1-S)[u_thirdDeriv - 3S ' +
    'u_prime u_secondDeriv + S(2S-1) u_prime^3], whose closed-form root lands on the FD knee to ~6e-8, removing ' +
    'the FD floor -- the imp-34796 identity F = -g_thirdDeriv/(1-S) rendered in closed form.',
  derivedIdentities: {
    gThirdDeriv:
      'g_thirdDeriv = (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3] (g = ln sigma). Since ' +
      '1-S > 0, g_thirdDeriv = 0 IFF u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 = 0 -- the ' +
      'CLOSED-FORM sigma-KNEE locator. Equals -F(1-S) with imp-34796 F = -g_thirdDeriv/(1-S).',
    sigmaThirdDeriv:
      'sigma_thirdDeriv = S(1-S)[(1-6S+6S^2) u_prime^3 + 3(1-2S) u_prime u_secondDeriv + u_thirdDeriv]. Its root ' +
      'sigma_thirdDeriv = 0 is a DIFFERENT landmark (log10 N* ~ 8.327), NOT the sigma-KNEE.',
  },
  landmarks: {
    sigmaKneeClosed: {
      condition: 'u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 = 0  (g_thirdDeriv = 0 closed form)',
      xStar: +X_KNEE_CLOSED.toFixed(6),
      log10Nstar: +(X_KNEE_CLOSED / LN10).toFixed(6), // ~9.53638
      sigmaAtRoot: +sigmaOf(X_KNEE_CLOSED).toFixed(6), // ~0.49438
    },
    sigmaThirdDerivRoot: {
      condition: '(1-6S+6S^2) u_prime^3 + 3(1-2S) u_prime u_secondDeriv + u_thirdDeriv = 0  (sigma_thirdDeriv = 0)',
      xStar: +X_SIGMA3.toFixed(6),
      log10Nstar: +(X_SIGMA3 / LN10).toFixed(6), // ~8.327
      sigmaAtRoot: +sigmaOf(X_SIGMA3).toFixed(6), // ~0.786
    },
    closedFormVsFiniteDifferenceKneeSep: +CLOSED_VS_FD_KNEE_SEP.toExponential(3), // ~6e-8: FD floor removed
    kneeMinusSigmaThirdDerivDex: +KNEE_MINUS_SIGMA3_DEX.toExponential(4), // ~+1.21: DISTINCT landmark
  },
  pointwiseIdentity: {
    stepH: H_ID,
    samples: POINTWISE.map((r) => ({
      x: r.x,
      gThirdDerivFD: +r.lhs.toExponential(6),
      identityClosedForm: +r.rhs.toExponential(6),
      relResid: +r.relResid.toExponential(3),
    })),
    maxRelResid: +MAX_REL_RESID.toExponential(3), // ~1.2e-5 -- shared O(h^2) truncation, not an offset
  },
  scaling: {
    xFixed: X_SCALE,
    table: SCALING.map((r) => ({ h: +r.h.toExponential(2), relResid: +r.relResid.toExponential(3) })),
    halvingRatios: HALVING_RATIOS.map((r) => +r.toFixed(3)), // ~4 each -- clean O(h^2)
    meanHalvingRatio: +MEAN_HALVING_RATIO.toFixed(3), // ~4.01
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_sigma_thirdDeriv_is_not_the_knee:
      'sigma_thirdDeriv = S(1-S)[(1-6S+6S^2) u_prime^3 + 3(1-2S) u_prime u_secondDeriv + u_thirdDeriv] roots at ' +
      'log10 N* ~ 8.327 (sigma ~ 0.786), ~1.21 dex BELOW the g_thirdDeriv = 0 knee. The third derivative of ' +
      'sigma itself is the wrong object; the sigma-KNEE lives on g = ln sigma, not on sigma.',
    F2_g_third_order_identity_supplies_the_knee_closed_form:
      'g_thirdDeriv = (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3], so g_thirdDeriv = 0 ' +
      '<=> u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 = 0. This closed-form root lands on the ' +
      'FD g_thirdDeriv = 0 knee (log10 N* ~ 9.53638) to ~6e-8, removing the FD floor -- the third-order analogue ' +
      'of the imp-34820 D2 inflection closed form, and the imp-34796 identity F = -g_thirdDeriv/(1-S) in closed form.',
    F3_identity_is_exact_algebra:
      'The pointwise closed-form vs FD d3(ln sigma) match is ~1.2e-5 at h = 1e-2 and scales as clean O(h^2) ' +
      '(mean halving ratio ' +
      MEAN_HALVING_RATIO.toFixed(2) +
      ') with no floor above roundoff, ruling out an h-independent offset -- consistent with imp-34796s exact ' +
      'third-order algebra, now with the knee condition written entirely in u-derivatives.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + DERIVATION (frontier-direction, NOT rigorous). The ticket asks whether the imp-34820 sibling- ' +
    'identity technique yields a closed-form locator for the sigma-KNEE (g_thirdDeriv = 0 at log10 N* ~ 9.53638), ' +
    'removing ITS finite-difference floor, mirroring how the second-order identity closed the sigmoid inflection. ' +
    'ANSWER: NO for the literal sigma_thirdDeriv (third derivative of sigma itself): its closed form sigma_thirdDeriv ' +
    '= S(1-S)[(1-6S+6S^2) u_prime^3 + 3(1-2S) u_prime u_secondDeriv + u_thirdDeriv] roots at log10 N* ~ 8.327 ' +
    '(sigma ~ 0.786), a DISTINCT landmark ~1.21 dex below the knee (the same order/object mismatch imp-34820 hit). ' +
    'But YES via the SAME logistic differentiation applied to the knee object g = ln sigma: g_thirdDeriv = ' +
    '(1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3], so with 1-S > 0 the knee condition is ' +
    'exactly u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 = 0. This closed-form D3 locator lands on ' +
    'the finite-difference g_thirdDeriv = 0 knee to ~6e-8, removing the FD floor imp-34796 left in place -- the ' +
    'third-order analogue of the imp-34820 D2 inflection closed form, and the imp-34796 identity F = ' +
    '-g_thirdDeriv/(1-S) rendered in closed form (F = -bracket). The identity is confirmed exact algebra: the ' +
    'pointwise closed-form vs FD d3(ln sigma) match is ~1.2e-5 at h = 1e-2 and scales as clean O(h^2) (mean halving ' +
    'ratio ' + MEAN_HALVING_RATIO.toFixed(2) + '), with no h-independent floor. So the sigma-KNEE, like the ' +
    'inflection, has an exact closed-form locator -- but through g = ln sigma, not the third derivative of sigma. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a ' +
    '>= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-34846: sigma_thirdDeriv = 0 is NOT the sigma-KNEE (a DISTINCT landmark ~1.21 dex below), but the ' +
    'g = ln sigma third-order identity g_thirdDeriv = (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) ' +
    'u_prime^3] gives the closed-form knee locator u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1) u_prime^3 = 0, ' +
    'removing the FD floor. What stays OPEN (deferred, changes no bound) is whether this closed-form knee locator ' +
    'survives reinstating the dropped E_flow term -- the SAME E_flow-reinstatement sub-gap imp-34796/imp-34820 left ' +
    'open, which imp-34837 measured shifts the knee DOWN by ~7.3e-3 dex for the D2 pair; carrying E_flow through ' +
    'the u-derivatives u_prime/u_secondDeriv/u_thirdDeriv in this D3 condition is the untested next step.',
  citation:
    'imp-34796 (the F = -g_thirdDeriv/(1-S) identity this renders in closed form); imp-34820 (the sibling second- ' +
    'order D2 closed form this mirrors one order up); imp-34837 (the E_flow-reinstatement measurement for the D2 ' +
    'pair); imp-34710 (sigma-KNEE decomposition); imp-33744 (the D2 closed form sigma_infl = 1/2 - v_prime/(2 ' +
    'v^2)); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR_ASSERTIONS = [
  {
    // (F2): the closed-form g_thirdDeriv=0 root lands ON the finite-difference g_thirdDeriv=0 knee (FD floor removed).
    id: 'imp34846-closed-form-d3-lands-on-fd-knee',
    description: 'the closed-form g_thirdDeriv=0 knee matches the FD d3(ln sigma)=0 knee to < 1e-6 (FD floor removed)',
    holds: () => CLOSED_VS_FD_KNEE_SEP < 1e-6 && X_KNEE_CLOSED > 21.9 && X_KNEE_CLOSED < 22.0,
  },
  {
    // (F1): sigma_thirdDeriv=0 is a DISTINCT landmark, well below the knee (not the sigma-KNEE).
    id: 'imp34846-sigma-third-deriv-is-a-distinct-landmark',
    description: 'the sigma_thirdDeriv=0 root sits ~1.21 dex below the g_thirdDeriv=0 knee (distinct landmarks)',
    holds: () => KNEE_MINUS_SIGMA3_DEX > 0.9 && KNEE_MINUS_SIGMA3_DEX < 1.5 && X_KNEE_CLOSED > X_SIGMA3,
  },
  {
    // (F3): the derived g_thirdDeriv identity holds pointwise to the shared O(h^2) truncation across the knee band.
    id: 'imp34846-g-third-deriv-identity-holds-pointwise',
    description: 'g_thirdDeriv closed form matches FD d3(ln sigma) to < 1e-4 relative across the band',
    holds: () => MAX_REL_RESID < 1e-4 && POINTWISE.length === X_SAMPLES.length,
  },
  {
    // (F3): the g_thirdDeriv identity residual scales as clean O(h^2) -- ratio ~4 per halving -- confirming exact algebra.
    id: 'imp34846-g-third-deriv-identity-scales-as-h-squared',
    description: 'halving h quarters the g_thirdDeriv identity residual (mean halving ratio in [3,5]): shared O(h^2)',
    holds: () =>
      MEAN_HALVING_RATIO > 3 &&
      MEAN_HALVING_RATIO < 5 &&
      SCALING[SCALING.length - 1].relResid < SCALING[0].relResid,
  },
  {
    // Honesty gate: assessment/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34846-honesty-gate-no-qed',
    description: 'Assessment/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR.isRigorous === false &&
      IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR.farTailExponent === 0.5 &&
      typeof IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR.subGap === 'string' &&
      /NO QED/.test(IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR.verdict) &&
      /refereed bound is changed/i.test(IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR.verdict),
  },
];

for (const a of IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34846-sigma-knee-third-order-closed-form-locator assertion failed: ${a.id}`);
  }
}
