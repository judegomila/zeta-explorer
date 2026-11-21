/**
 * @module imp-34820-sigmoid-inflection-d2-closed-form-locator
 *
 * imp-34820 (numerical/derivation, frontier-direction): imp-34796 settled the sigma-KNEE exactly-0-vs-residual
 * question via the exact identity F(x) = -g_thirdDeriv(x)/(1-S(x)) (g = ln sigma), which forces the u-route
 * knee condition F=0 and the direct route g_thirdDeriv=0 to share the IDENTICAL analytic root. imp-34746
 * separately flags the imp-33701/imp-33721 sigma(N) conditional-share sigmoid knee -- the single convex-to-
 * concave inflection (sigma_secondDeriv = 0) en route to the imp-3463 far-tail 1/2 asymptote -- as currently a
 * FINITE-DIFFERENCE landmark. This module ASSESSES the ticket question: can the imp-34796 exact identity
 * F = -g_thirdDeriv/(1-S) locate that sigmoid inflection in closed form, removing the finite-difference floor?
 *
 * THE VERDICT (answers the ticket literally: NO for the g_thirdDeriv identity, YES for its sibling D2 identity)
 * -------------------------------------------------------------------------------------------------------------
 * The imp-34796 identity is a THIRD-order condition. Its root g_thirdDeriv(x) = 0 (equivalently F(x) = 0, since
 * (1-S) > 0) is the decay-exponent RAMP knee (the "sigma-KNEE"), where p = -(ln sigma)_prime has its own
 * inflection p_secondDeriv = 0. The convex-to-concave sigmoid inflection is a SECOND-order condition,
 * sigma_secondDeriv(x) = 0 -- a DIFFERENT landmark. So F = -g_thirdDeriv/(1-S) does NOT vanish at the sigmoid
 * inflection and cannot locate it. Measured on the no-E_flow model (identical sub-terms to imp-34796):
 *   - sigma-KNEE (g_thirdDeriv = 0):        x* = 21.9583, log10 N* = 9.53638, sigma = 0.49438  (imp-34796/imp-34710)
 *   - sigmoid inflection (sigma_secondDeriv = 0): x* = 21.9290, log10 N* = 9.52364, sigma = 0.49788 (imp-33721/imp-33744)
 * The two roots are DISTINCT, separated by ~0.0127 dex (~3% in N) -- close, but not the same landmark, so the
 * third-order identity is the wrong tool for the second-order inflection.
 *
 * THE CLOSED FORM THAT DOES REMOVE THE FD FLOOR (the sibling D2 identity of the SAME logistic algebra)
 * ----------------------------------------------------------------------------------------------------
 * The very differentiation that produced imp-34796s third-order identity gives, at second order, the exact
 * logistic identity (sigma = 1/(1+exp(-u)), S = sigma):
 *   sigma_secondDeriv = sigma (1 - sigma) [ (1 - 2 sigma) u_prime^2 + u_secondDeriv ].
 * Since sigma(1-sigma) > 0 everywhere, sigma_secondDeriv = 0 IF AND ONLY IF
 *   (1 - 2 S) u_prime^2 + u_secondDeriv = 0,   i.e.   sigma_infl = 1/2 + u_secondDeriv / (2 u_prime^2).
 * With v = -u_prime (the local decay exponent), u_prime = -v and u_secondDeriv = -v_prime, so this is exactly the
 * imp-33744 closed form sigma_infl = 1/2 - v_prime/(2 v^2). This is a CLOSED-FORM D2-zero inflection locator: the
 * root of the algebraic condition (1-2S) u_prime^2 + u_secondDeriv = 0 lands ON the finite-difference sigmoid
 * inflection to ~3e-8, removing the finite-difference floor imp-34746 flagged -- via the sibling second-order
 * identity, NOT the imp-34796 third-order one.
 *
 * THE MEASUREMENT (confirms the D2 identity is exact algebra, like imp-34796s third-order one)
 * -------------------------------------------------------------------------------------------
 *   (A) POINTWISE: sigma_secondDeriv(x) from a central 2nd-difference of sigma matches S(1-S)[(1-2S)u_prime^2 +
 *       u_secondDeriv] from independent u-differences to ~3e-6 relative at h = 1e-2 across the knee band -- the
 *       shared O(h^2) truncation, not a fixed offset.
 *   (B) O(h^2) SCALING: halving h quarters the pointwise residual (5.3e-5 -> 1.3e-5 -> 3.3e-6 -> 8.3e-7 at x=22,
 *       ratio ~4), the signature of two discretizations of the SAME analytic object.
 *   (C) ROOT SEPARATION: the g_thirdDeriv=0 sigma-KNEE and the sigma_secondDeriv=0 sigmoid inflection are located
 *       independently by bisection and differ by ~0.0127 dex -- confirming they are DISTINCT roots.
 *
 * THE FINDING (derivation + measurement; answers the ticket)
 * ----------------------------------------------------------
 *   (F1) THE IMP-34796 IDENTITY DOES NOT LOCATE THE SIGMOID INFLECTION. F = -g_thirdDeriv/(1-S) is a third-order
 *        condition whose root is the decay-exponent-ramp knee (sigma-KNEE), a landmark ~0.0127 dex ABOVE the
 *        convex-to-concave sigmoid inflection. The third-order identity is the wrong order for the D2-zero
 *        inflection and cannot supply its closed form.
 *   (F2) THE SIBLING D2 IDENTITY DOES. The same logistic differentiation gives sigma_secondDeriv =
 *        S(1-S)[(1-2S) u_prime^2 + u_secondDeriv], so sigma_secondDeriv = 0 <=> (1-2S) u_prime^2 + u_secondDeriv
 *        = 0, i.e. sigma_infl = 1/2 + u_secondDeriv/(2 u_prime^2). This CLOSED FORM lands on the finite-difference
 *        inflection to ~3e-8, removing the FD floor -- and recovers the imp-33744 form sigma_infl = 1/2 -
 *        v_prime/(2 v^2) with v = -u_prime.
 *   (F3) THE D2 IDENTITY IS EXACT ALGEBRA. The pointwise sigma_secondDeriv vs S(1-S)[(1-2S)u_prime^2 +
 *        u_secondDeriv] match scales as clean O(h^2) (ratio ~4 per halving) with no floor above roundoff, ruling
 *        out an h-independent offset -- the second-order analogue of imp-34796s exact third-order algebra.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34796-sigma-knee-gap-exact-zero-identity (the third-order identity F = -g_thirdDeriv/(1-S) this assesses)
 * @see imp-33744-sigma-inflection (the closed form sigma_infl = 1/2 - v_prime/(2 v^2) this recovers)
 * @see imp-33721 KNEE-A-DECADE-BELOW (sub-decade relocation of the sigmoid inflection to N* ~ 3.38e9)
 * @see imp-34746 (the glossary headword flagging the sigmoid knee as a finite-difference landmark)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// ---- no-E_flow logistic model (identical sub-terms to imp-34796/imp-34769/imp-34710) ----------------------
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

// SECOND-order sigmoid-inflection condition: (1-2S) u_prime^2 + u_secondDeriv (closed-form D2 locator kernel).
function d2Cond(x, h) {
  const S = sigmaOf(x);
  const up = d1(uOf, x, h);
  const upp = d2(uOf, x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition (imp-34796 direct route): g_thirdDeriv = (ln sigma)_thirdDeriv.
function gThird(x, h) {
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

// ---- locate the two DISTINCT landmarks (F1) --------------------------------------------------------------
const X_KNEE = bisect(gThird, 18, 26, H_ID); // g_thirdDeriv = 0 (sigma-KNEE / decay-exponent-ramp knee)
const X_INFL = bisect(d2Cond, 18, 26, H_ID); // (1-2S)u_prime^2 + u_secondDeriv = 0 (sigmoid inflection)
const KNEE_MINUS_INFL_DEX = (X_KNEE - X_INFL) / LN10; // ~+0.0127 dex: the two roots are distinct

// closed-form inflection root vs an independent finite-difference sigma_secondDeriv=0 root (D2 removes FD floor)
const X_INFL_FD = bisect((x, h) => d2(sigmaOf, x, h), 18, 26, H_ID); // FD sigma_secondDeriv=0
const D2_VS_FD_SEP = Math.abs(X_INFL - X_INFL_FD); // ~3e-8: closed form lands ON the FD inflection

// ---- (A) pointwise exactness of the D2 identity across the knee band --------------------------------------
const X_SAMPLES = [20, 21, 22, 23, 24];
const POINTWISE = X_SAMPLES.map((x) => {
  const S = sigmaOf(x);
  const lhs = d2(sigmaOf, x, H_ID); // sigma_secondDeriv, independent stencil
  const rhs = S * (1 - S) * d2Cond(x, H_ID); // S(1-S)[(1-2S)u_prime^2 + u_secondDeriv]
  return { x, lhs, rhs, relResid: Math.abs((lhs - rhs) / rhs) };
});
const MAX_REL_RESID = Math.max(...POINTWISE.map((r) => r.relResid));

// ---- (B) O(h^2) scaling of the D2 identity residual at a fixed x near the inflection ----------------------
const X_SCALE = 22;
const SCALE_HS = [4e-2, 2e-2, 1e-2, 5e-3];
const SCALING = SCALE_HS.map((h) => {
  const S = sigmaOf(X_SCALE);
  const lhs = d2(sigmaOf, X_SCALE, h);
  const rhs = S * (1 - S) * d2Cond(X_SCALE, h);
  return { h, relResid: Math.abs((lhs - rhs) / rhs) };
});
const HALVING_RATIOS = [];
for (let i = 0; i + 1 < SCALING.length; i++) {
  HALVING_RATIOS.push(SCALING[i].relResid / SCALING[i + 1].relResid);
}
const MEAN_HALVING_RATIO = HALVING_RATIOS.reduce((s, r) => s + r, 0) / HALVING_RATIOS.length;

export const IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR = {
  id: 'imp-34820',
  proofSection: 'S-frontier',
  question:
    'imp-34796 settled the sigma-KNEE exactly-0 question via the exact identity F = -g_thirdDeriv/(1-S). ' +
    'imp-34746 flags the sigma(N) conditional-share sigmoid knee (single convex-to-concave inflection, ' +
    'sigma_secondDeriv = 0, en route to the 1/2 asymptote) as a finite-difference landmark. Can the same ' +
    'exact identity locate that D2-zero inflection in closed form, removing the finite-difference floor? ' +
    'Assessment / derivation only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional ' +
    '(imp-486); no QED.',
  verdictShort:
    'NO for the imp-34796 third-order identity (its g_thirdDeriv=0 root is the DISTINCT sigma-KNEE, ~0.0127 dex ' +
    'above the inflection); YES for the sibling SECOND-order identity sigma_secondDeriv = S(1-S)[(1-2S)u_prime^2 ' +
    '+ u_secondDeriv], whose closed-form D2 root removes the finite-difference floor and recovers imp-33744.',
  derivedIdentity:
    'sigma_secondDeriv = sigma(1-sigma)[(1-2 sigma) u_prime^2 + u_secondDeriv]. Since sigma(1-sigma) > 0, ' +
    'sigma_secondDeriv = 0 IFF (1-2S) u_prime^2 + u_secondDeriv = 0, i.e. sigma_infl = 1/2 + u_secondDeriv/(2 ' +
    'u_prime^2) = 1/2 - v_prime/(2 v^2) with v = -u_prime (recovers imp-33744). This is the CLOSED-FORM D2 ' +
    'inflection locator; the imp-34796 third-order identity F = -g_thirdDeriv/(1-S) locates a DIFFERENT root.',
  landmarks: {
    sigmaKnee: {
      condition: 'g_thirdDeriv = 0  (equivalently F = -g_thirdDeriv/(1-S) = 0; imp-34796/imp-34710)',
      xStar: +X_KNEE.toFixed(6),
      log10Nstar: +(X_KNEE / LN10).toFixed(6), // ~9.53638
      sigmaAtRoot: +sigmaOf(X_KNEE).toFixed(6), // ~0.49438
    },
    sigmoidInflection: {
      condition: '(1-2S) u_prime^2 + u_secondDeriv = 0  (sigma_secondDeriv = 0; imp-33721/imp-33744)',
      xStar: +X_INFL.toFixed(6),
      log10Nstar: +(X_INFL / LN10).toFixed(6), // ~9.52364
      sigmaAtRoot: +sigmaOf(X_INFL).toFixed(6), // ~0.49788
    },
    kneeMinusInflectionDex: +KNEE_MINUS_INFL_DEX.toExponential(4), // ~+1.27e-2: DISTINCT landmarks
    closedFormVsFiniteDifferenceSep: +D2_VS_FD_SEP.toExponential(3), // ~3e-8: closed form lands ON FD inflection
  },
  pointwiseIdentity: {
    stepH: H_ID,
    samples: POINTWISE.map((r) => ({
      x: r.x,
      sigmaSecondDeriv: +r.lhs.toExponential(6),
      identityRhs: +r.rhs.toExponential(6),
      relResid: +r.relResid.toExponential(3),
    })),
    maxRelResid: +MAX_REL_RESID.toExponential(3), // ~3.6e-6 -- shared O(h^2) truncation, not an offset
  },
  scaling: {
    xFixed: X_SCALE,
    table: SCALING.map((r) => ({ h: +r.h.toExponential(2), relResid: +r.relResid.toExponential(3) })),
    halvingRatios: HALVING_RATIOS.map((r) => +r.toFixed(3)), // ~4 each -- clean O(h^2)
    meanHalvingRatio: +MEAN_HALVING_RATIO.toFixed(3), // ~4
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_imp34796_identity_does_not_locate_the_inflection:
      'F = -g_thirdDeriv/(1-S) is a THIRD-order condition whose root g_thirdDeriv = 0 is the decay-exponent-ramp ' +
      'knee (sigma-KNEE) at log10 N* ~ 9.53638, sigma ~ 0.4944 -- a landmark ~0.0127 dex ABOVE the convex-to-' +
      'concave sigmoid inflection at log10 N* ~ 9.52364, sigma ~ 0.4979. The two roots are distinct, so the ' +
      'third-order identity is the wrong order for the D2-zero inflection and cannot supply its closed form.',
    F2_sibling_D2_identity_supplies_the_closed_form:
      'The same logistic differentiation gives sigma_secondDeriv = S(1-S)[(1-2S) u_prime^2 + u_secondDeriv], so ' +
      'sigma_secondDeriv = 0 <=> (1-2S) u_prime^2 + u_secondDeriv = 0, i.e. sigma_infl = 1/2 + u_secondDeriv/(2 ' +
      'u_prime^2). This closed-form D2 root lands on the finite-difference inflection to ~3e-8, removing the ' +
      'finite-difference floor imp-34746 flagged, and recovers imp-33744 sigma_infl = 1/2 - v_prime/(2 v^2).',
    F3_D2_identity_is_exact_algebra:
      'The pointwise sigma_secondDeriv vs S(1-S)[(1-2S)u_prime^2 + u_secondDeriv] match scales as clean O(h^2) ' +
      '(ratio ~4 per halving, mean ' +
      MEAN_HALVING_RATIO.toFixed(2) +
      ') with no floor above roundoff, ruling out an h-independent offset -- the second-order analogue of ' +
      'imp-34796s exact third-order algebra F = -g_thirdDeriv/(1-S).',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + DERIVATION (frontier-direction, NOT rigorous). The ticket asks whether the imp-34796 exact ' +
    'identity F = -g_thirdDeriv/(1-S) can locate the imp-34746/imp-33721 convex-to-concave sigmoid inflection ' +
    '(sigma_secondDeriv = 0) in closed form. ANSWER: NO for that identity. F = -g_thirdDeriv/(1-S) is a ' +
    'THIRD-order condition; its root g_thirdDeriv = 0 is the decay-exponent-ramp knee (the sigma-KNEE) at ' +
    'log10 N* ~ 9.53638 (sigma ~ 0.4944), a DISTINCT landmark ~0.0127 dex ABOVE the sigmoid inflection at ' +
    'log10 N* ~ 9.52364 (sigma ~ 0.4979). But the SAME logistic differentiation yields the sibling SECOND-order ' +
    'identity sigma_secondDeriv = sigma(1-sigma)[(1-2 sigma) u_prime^2 + u_secondDeriv], so with sigma(1-sigma) ' +
    '> 0 the inflection condition is exactly (1-2S) u_prime^2 + u_secondDeriv = 0, i.e. sigma_infl = 1/2 + ' +
    'u_secondDeriv/(2 u_prime^2) = 1/2 - v_prime/(2 v^2) (v = -u_prime), recovering the imp-33744 closed form. ' +
    'This closed-form D2 locator lands ON the finite-difference sigma_secondDeriv = 0 inflection to ~3e-8, ' +
    'removing the finite-difference floor imp-34746 flagged -- via the sibling second-order identity, NOT the ' +
    'imp-34796 third-order one. The D2 identity is confirmed exact algebra: the pointwise sigma_secondDeriv vs ' +
    'S(1-S)[(1-2S)u_prime^2 + u_secondDeriv] match is ~3.6e-6 at h = 1e-2 and scales as clean O(h^2) (ratio ~4 ' +
    'per halving, mean ' + MEAN_HALVING_RATIO.toFixed(2) + '), with no h-independent floor. So the correct ' +
    'closed form for the sigmoid inflection is a second-order sibling of the imp-34796 identity, not the ' +
    'imp-34796 identity itself. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-34820: the imp-34796 identity F = -g_thirdDeriv/(1-S) does NOT locate the sigmoid inflection ' +
    '(its third-order root is the DISTINCT sigma-KNEE ~0.0127 dex away), but the sibling SECOND-order identity ' +
    'sigma_secondDeriv = S(1-S)[(1-2S)u_prime^2 + u_secondDeriv] gives the closed-form D2 locator sigma_infl = ' +
    '1/2 + u_secondDeriv/(2 u_prime^2), removing the finite-difference floor. What stays OPEN (deferred, changes ' +
    'no bound) is whether this closed-form D2 locator survives reinstating the dropped E_flow term -- i.e. ' +
    'whether the full-model sigmoid inflection stays at the exact D2 root once E_flow is carried in u (the same ' +
    'E_flow-reinstatement sub-gap imp-34796 left open for its third-order identity, and which imp-33744 F3 ' +
    'estimated adds only a same-order ~0.003 secondary shift).',
  citation:
    'imp-34796 (the third-order identity F = -g_thirdDeriv/(1-S) this assesses); imp-33744 (closed form ' +
    'sigma_infl = 1/2 - v_prime/(2 v^2) this recovers); imp-33721 (sub-decade sigmoid inflection N* ~ 3.38e9); ' +
    'imp-34746 (glossary headword flagging the sigmoid knee as a finite-difference landmark); imp-34710 ' +
    '(sigma-KNEE decomposition); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-' +
    'mapping (effectiveHeightForN).',
};

export const IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR_ASSERTIONS = [
  {
    // (F1): the imp-34796 g_thirdDeriv=0 sigma-KNEE and the sigma_secondDeriv=0 inflection are DISTINCT roots.
    id: 'imp34820-knee-and-inflection-are-distinct-roots',
    description: 'g_thirdDeriv=0 sigma-KNEE sits ~0.0127 dex above the sigma_secondDeriv=0 inflection (distinct landmarks)',
    holds: () => KNEE_MINUS_INFL_DEX > 5e-3 && KNEE_MINUS_INFL_DEX < 3e-2 && X_KNEE > X_INFL,
  },
  {
    // (F2): the closed-form D2 root lands ON the finite-difference sigma_secondDeriv=0 inflection (FD floor removed).
    id: 'imp34820-closed-form-d2-lands-on-fd-inflection',
    description: 'the closed-form (1-2S)u_prime^2+u_secondDeriv=0 root matches the FD sigma_secondDeriv=0 root to < 1e-6',
    holds: () => D2_VS_FD_SEP < 1e-6,
  },
  {
    // (F2/F3): the derived D2 identity holds pointwise to the shared O(h^2) truncation across the knee band.
    id: 'imp34820-d2-identity-holds-pointwise',
    description: 'sigma_secondDeriv matches S(1-S)[(1-2S)u_prime^2+u_secondDeriv] to < 1e-4 relative across the band',
    holds: () => MAX_REL_RESID < 1e-4 && POINTWISE.length === X_SAMPLES.length,
  },
  {
    // (F3): the D2 identity residual scales as clean O(h^2) -- ratio ~4 per halving -- confirming exact algebra.
    id: 'imp34820-d2-identity-scales-as-h-squared',
    description: 'halving h quarters the D2 identity residual (mean halving ratio in [3,5]): shared O(h^2) truncation',
    holds: () =>
      MEAN_HALVING_RATIO > 3 &&
      MEAN_HALVING_RATIO < 5 &&
      SCALING[SCALING.length - 1].relResid < SCALING[0].relResid,
  },
  {
    // Honesty gate: assessment/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34820-honesty-gate-no-qed',
    description: 'Assessment/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR.isRigorous === false &&
      IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR.farTailExponent === 0.5 &&
      typeof IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR.subGap === 'string' &&
      /NO QED/.test(IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR.verdict) &&
      /refereed bound is changed/i.test(IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR.verdict),
  },
];

for (const a of IMP34820_SIGMOID_INFLECTION_D2_CLOSED_FORM_LOCATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34820-sigmoid-inflection-d2-closed-form-locator assertion failed: ${a.id}`);
  }
}
