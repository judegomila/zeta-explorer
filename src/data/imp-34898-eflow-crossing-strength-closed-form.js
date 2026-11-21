/**
 * @module imp-34898-eflow-crossing-strength-closed-form
 *
 * imp-34898 (numerical, frontier-direction): imp-34886 located the knee-vs-inflection E_flow crossing
 * strength at s* ~ 0.78 by BISECTION on Gap(s) = X*_knee(s) - X*_infl(s) = 0, corroborated by the linear
 * (secant) estimate Gap(0)/(Gap(0)-Gap(1)) ~ 0.779, but explicitly left OPEN a ROOT-FREE CLOSED FORM that
 * would express the crossing strength directly from the two landmark slopes and curvatures. This module
 * DERIVES that closed form -- a Taylor-in-s expansion of Gap(s) anchored at s=0 -- and measures how far it
 * departs from both the bisected 0.7777 and the linear ~0.77 estimate, quantifying the curvature correction.
 *
 * THE DERIVATION (root-free, from the imp-34858 knee slope and the imp-34837 inflection slope + curvatures)
 * -------------------------------------------------------------------------------------------------------
 * Carry E_flow EXACTLY as the imp-34749 additive log-odds shift phi = -ln(1 + E_flow/E_trunc) scaled by a
 * strength s in [0,1] (u_full = u_0 + s*phi, reused VERBATIM from imp-34886). Both landmarks are read off the
 * reused imp-34820 D2 inflection kernel and the imp-34710/34749/34858 D3 knee kernel. Taylor-expand the signed
 * dex gap Gap(s) about s=0:
 *   Gap(s) = G0 + G1 s + (1/2) G2 s^2 + O(s^3),
 *   G0 = Gap(0) ~ +1.27e-2 dex (imp-34820 knee-above-inflection separation),
 *   G1 = dGap/ds|_0 = dKnee/ds|_0 - dInfl/ds|_0 ~ (-7.34e-3) - (+9.15e-3) = -1.649e-2 dex/unit,
 *   G2 = d2Gap/ds2|_0 = dKnee2 - dInfl2 ~ (-2.21e-4) - (-2.57e-4) = +3.64e-5 dex/unit^2.
 * G1 is the imp-34886 sensitivity (sum of the imp-34858 knee slope and the imp-34837 inflection slope), and
 * G2 is the difference of the two first-order-capture curvatures. Setting Gap(s*)=0:
 *   - LINEAR (tangent-at-0) closed form:  s*_lin = -G0 / G1 = +G0 / |G1|  ~ 0.7722.
 *   - QUADRATIC (curvature-corrected) closed form, the physical root that reduces to s*_lin as G2 -> 0:
 *       s*_quad = ( -G1 - sqrt(G1^2 - 2 G2 G0) ) / G2  ~ 0.7729.
 * Both are ROOT-FREE: no bisection, no evaluation of Gap at any interior s -- only the two landmark slopes and
 * curvatures at s=0, exactly the quantities imp-34858/34837 already published.
 *
 * THE MEASUREMENT (closed form vs the imp-34886 bisected 0.7777 and linear 0.77)
 * -----------------------------------------------------------------------------
 *   (M1) The QUADRATIC closed form gives s*_quad ~ 0.7729, and the LINEAR one s*_lin ~ 0.7722. The curvature
 *        correction s*_quad - s*_lin ~ +6.6e-4 (~0.09%) is TINY -- the direct consequence of the ~100%
 *        first-order capture (imp-34837 ~101%, imp-34858 ~100.3%) in the deep-linear E_flow/E_trunc ~ 1.8e-3
 *        regime, where the log-odds shift phi is nearly linear in s (d2phi/ds2 ~ ratio^2 is order 1e-6).
 *   (M2) Both closed forms sit ~5e-3 BELOW the imp-34886 bisected root 0.7777 (s*_quad - s* ~ -4.8e-3,
 *        s*_lin - s* ~ -5.4e-3). This is NOT a curvature failure but an anchoring effect: the expansion is
 *        centred at s=0, ~0.78 away from the root, so the truncated (convex, G2>0) parabola under-reaches the
 *        true crossing; the ~5e-3 residual is the un-captured cubic-and-higher Taylor tail. The two-endpoint
 *        secant Gap(0)/(Gap(0)-Gap(1)) ~ 0.7792 (imp-34886) does better (+1.5e-3) precisely because it uses
 *        the far endpoint, but it is NOT a pure slope-plus-curvature closed form.
 *   (M3) The curvature term MOVES s* in the right direction (toward the bisected root): s*_quad is closer to
 *        s* than s*_lin by exactly the +6.6e-4 correction. So the quadratic closed form is a strict, if mild,
 *        improvement on the linear estimate, consistent with the sign of G2 > 0.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34886-eflow-strength-knee-inflection-crossing (the bisected s* ~ 0.78 and the deferred root-free closed form this answers)
 * @see imp-34858-sigma-knee-d3-eflow-reinstatement (the D3 knee slope -7.34e-3 dex/unit reused as dKnee/ds)
 * @see imp-34837-sigmoid-inflection-d2-eflow-reinstatement (the D2 inflection slope +9.15e-3 dex/unit reused as dInfl/ds)
 * @see imp-34820-sigmoid-inflection-d2-closed-form-locator (the closed-form D2 inflection kernel and the +1.27e-2 no-E_flow gap)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34837/imp-34858/imp-34886 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x -- imp-398 pinned C_F, identical sub-terms to imp-34749/34837/34858/34886.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
// No-E_flow log-odds u_0 = ln(E_coll/E_trunc) = ln A + 0.5 ln L - x/2 (imp-34820/34846/34710 uOf).
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// E_flow perturbation of the log-odds, scaled by strength s. phi = -ln(1 + s ratio).
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s) {
  return u0(x) + phi(x, s);
}
function sigmaOf(x, s) {
  return 1 / (1 + Math.exp(-uFull(x, s)));
}

// central-difference stencils on the log-odds (imp-34820/34846/34886 step h = 1e-2)
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// D2 sigmoid-INFLECTION kernel (imp-34820/34837) and D3 sigma-KNEE condition (imp-34710/34749/34858) on u_full,
// both reused VERBATIM from imp-34886.
function d2Cond(x, s, h) {
  const S = sigmaOf(x, s);
  const up = d1((z) => uFull(z, s), x, h);
  const upp = d2((z) => uFull(z, s), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, h) {
  const S = sigmaOf(x, s);
  const v = -d1((z) => uFull(z, s), x, h);
  const vp = -d2((z) => uFull(z, s), x, h);
  const vpp = -d3((z) => uFull(z, s), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}

const LN10 = Math.LN10;
const LO = Math.log(1e9);
const HI = Math.log(1e11);

function kneeAt(s) {
  return bisect((x) => fKnee(x, s, H_ID), LO, HI);
}
function inflAt(s) {
  return bisect((x) => d2Cond(x, s, H_ID), LO, HI);
}
// signed knee-minus-inflection gap in dex (positive => knee above inflection, imp-34820 ordering)
function gapAt(s) {
  return (kneeAt(s) - inflAt(s)) / LN10;
}

// ---- Taylor-in-s coefficients of Gap(s) at s=0 (central differences, step dS) --------------------------------
const S_EPS = 0.02;
const G0 = gapAt(0); // ~+1.27e-2 dex (imp-34820 no-E_flow knee-above-inflection separation)
const G1 = (gapAt(S_EPS) - gapAt(-S_EPS)) / (2 * S_EPS); // dGap/ds|_0 ~ -1.649e-2 dex/unit (imp-34886 sensitivity)
const G2 = (gapAt(S_EPS) - 2 * gapAt(0) + gapAt(-S_EPS)) / (S_EPS * S_EPS); // d2Gap/ds2|_0 ~ +3.64e-5 dex/unit^2

// the two landmark slopes and curvatures whose differences build G1 and G2 (imp-34858 knee, imp-34837 inflection)
const DKNEE_DS0 = (kneeAt(S_EPS) - kneeAt(-S_EPS)) / (2 * S_EPS) / LN10; // ~-7.34e-3 dex/unit (imp-34858)
const DINFL_DS0 = (inflAt(S_EPS) - inflAt(-S_EPS)) / (2 * S_EPS) / LN10; // ~+9.15e-3 dex/unit (imp-34837)
const DKNEE_DS0_2 = (kneeAt(S_EPS) - 2 * kneeAt(0) + kneeAt(-S_EPS)) / (S_EPS * S_EPS) / LN10; // ~-2.21e-4
const DINFL_DS0_2 = (inflAt(S_EPS) - 2 * inflAt(0) + inflAt(-S_EPS)) / (S_EPS * S_EPS) / LN10; // ~-2.57e-4

// ---- the ROOT-FREE closed forms for the crossing strength s* -------------------------------------------------
// LINEAR (tangent-at-0): solve G0 + G1 s = 0 => s* = -G0/G1 = +G0/|G1|.
const S_STAR_LINEAR = -G0 / G1; // ~0.7722
// QUADRATIC (curvature-corrected): solve (1/2) G2 s^2 + G1 s + G0 = 0, physical root reducing to linear as G2->0.
const DISC = G1 * G1 - 2 * G2 * G0;
const S_STAR_QUAD = (-G1 - Math.sqrt(DISC)) / G2; // ~0.7729
const CURVATURE_CORRECTION = S_STAR_QUAD - S_STAR_LINEAR; // ~+6.6e-4 (tiny, ~100% first-order capture)

// ---- reference: the imp-34886 bisected root and secant estimate the closed forms are measured against --------
const GAP_S1 = gapAt(1); // ~-3.61e-3 dex (imp-34837 flipped gap at s=1)
const S_STAR_BISECTED = bisect((s) => gapAt(s), 0, 1); // ~0.7777 (imp-34886)
const S_STAR_SECANT = G0 / (G0 - GAP_S1); // ~0.7792 (imp-34886 two-endpoint linear estimate)
const QUAD_MINUS_BISECTED = S_STAR_QUAD - S_STAR_BISECTED; // ~-4.8e-3
const LINEAR_MINUS_BISECTED = S_STAR_LINEAR - S_STAR_BISECTED; // ~-5.4e-3

export const IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM = {
  id: 'imp-34898',
  proofSection: 'S-frontier',
  question:
    'imp-34886 located the knee-vs-inflection E_flow crossing strength s* ~ 0.78 by bisection on Gap(s) = ' +
    'X*_knee(s) - X*_infl(s) = 0 but left OPEN a ROOT-FREE closed form for s* built directly from the two ' +
    'landmark slopes and curvatures. Derive that closed form (linear tangent plus quadratic curvature term via ' +
    'the additive log-odds shift phi = -ln(1+E_flow/E_trunc) scaled by s), measure it against the bisected ' +
    '0.7777 and the linear ~0.77 estimate, and quantify the curvature correction. Measurement/derivation on the ' +
    'inherited surrogate; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'The root-free QUADRATIC closed form s* = (-G1 - sqrt(G1^2 - 2 G2 G0))/G2 ~ 0.7729, built purely from the ' +
    'imp-34858 knee slope, imp-34837 inflection slope (G1 = -1.649e-2) and their curvature difference ' +
    '(G2 = +3.64e-5), reproduces the bisected 0.7777 to ~5e-3. The curvature correction over the linear ' +
    'tangent form -G0/G1 ~ 0.7722 is a TINY +6.6e-4 (~0.09%), reflecting the ~100% first-order capture; the ' +
    '~5e-3 residual to the bisected root is the un-captured cubic-and-higher Taylor tail (expansion anchored at s=0).',
  measuredQuantity:
    'the root-free closed form for the imp-34886 crossing strength s* (where X*_knee(s*) = X*_infl(s*)), ' +
    'obtained from a Taylor-in-s expansion of the signed dex gap Gap(s) = X*_knee(s) - X*_infl(s) about s=0: ' +
    'the linear tangent root s*_lin = -G0/G1 and the quadratic curvature-corrected root s*_quad = ' +
    '(-G1 - sqrt(G1^2 - 2 G2 G0))/G2, with G1 = dKnee/ds - dInfl/ds and G2 = dKnee2 - dInfl2, measured against ' +
    'the imp-34886 bisected 0.7777 and secant 0.7792 estimates',
  taylorCoefficients: {
    G0_gapAt0_log10: +G0.toExponential(6), // ~+1.273599e-2 (imp-34820 no-E_flow gap)
    G1_dGap_ds0_log10: +G1.toExponential(6), // ~-1.649304e-2 dex/unit (imp-34886 sensitivity)
    G2_d2Gap_ds20_log10: +G2.toExponential(6), // ~+3.636994e-5 dex/unit^2
    dKnee_ds0_log10: +DKNEE_DS0.toExponential(6), // ~-7.34e-3 (imp-34858 knee slope)
    dInfl_ds0_log10: +DINFL_DS0.toExponential(6), // ~+9.15e-3 (imp-34837 inflection slope)
    dKnee2_ds0_log10: +DKNEE_DS0_2.toExponential(6), // ~-2.21e-4 (knee curvature)
    dInfl2_ds0_log10: +DINFL_DS0_2.toExponential(6), // ~-2.57e-4 (inflection curvature)
  },
  closedForm: {
    sStarLinearTangent: +S_STAR_LINEAR.toFixed(6), // ~0.772204 = -G0/G1
    sStarQuadratic: +S_STAR_QUAD.toFixed(6), // ~0.772863 = (-G1 - sqrt(G1^2 - 2 G2 G0))/G2
    curvatureCorrection: +CURVATURE_CORRECTION.toExponential(4), // ~+6.6e-4 (quad - linear)
    discriminant: +DISC.toExponential(4), // ~+2.71e-4 (> 0, real physical root)
  },
  vsReference: {
    sStarBisected: +S_STAR_BISECTED.toFixed(6), // ~0.777653 (imp-34886)
    sStarSecant: +S_STAR_SECANT.toFixed(6), // ~0.779188 (imp-34886 two-endpoint linear)
    quadMinusBisected: +QUAD_MINUS_BISECTED.toExponential(4), // ~-4.8e-3
    linearMinusBisected: +LINEAR_MINUS_BISECTED.toExponential(4), // ~-5.4e-3
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    M1_root_free_closed_form:
      'The crossing strength admits a ROOT-FREE closed form built entirely from the two landmark slopes and ' +
      'curvatures at s=0: linear tangent s*_lin = -G0/G1 ~ 0.7722, quadratic curvature-corrected s*_quad = ' +
      '(-G1 - sqrt(G1^2 - 2 G2 G0))/G2 ~ 0.7729, where G1 = dKnee/ds - dInfl/ds ~ -1.649e-2 (the imp-34886 ' +
      'sensitivity) and G2 = dKnee2 - dInfl2 ~ +3.64e-5. No bisection, no interior Gap evaluation.',
    M2_curvature_correction_is_tiny:
      'The curvature correction s*_quad - s*_lin ~ +6.6e-4 (~0.09%) is TINY -- a direct consequence of the ' +
      '~100% first-order capture (imp-34837 ~101%, imp-34858 ~100.3%) in the deep-linear E_flow/E_trunc ~ ' +
      '1.8e-3 regime, where phi = -ln(1 + s ratio) is nearly linear in s (d2phi/ds2 ~ ratio^2 ~ 1e-6). The ' +
      'linear tangent form already pins s* to within the curvature scale.',
    M3_residual_to_bisected_is_the_taylor_tail:
      'Both closed forms sit ~5e-3 BELOW the imp-34886 bisected 0.7777 (quad -4.8e-3, linear -5.4e-3) -- an ' +
      'ANCHORING effect, not a curvature failure: the Taylor expansion is centred at s=0, ~0.78 from the root, ' +
      'so truncating the convex (G2>0) parabola under-reaches the true crossing, the ~5e-3 residual being the ' +
      'un-captured cubic-and-higher tail. The quadratic term nonetheless moves s* in the right direction ' +
      '(toward the bisected root) by exactly the +6.6e-4 correction. The imp-34886 two-endpoint secant 0.7792 ' +
      'does better (+1.5e-3) but uses the far endpoint and is not a pure slope-plus-curvature closed form.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). imp-34886 located the knee-vs-inflection ' +
    'E_flow crossing strength s* ~ 0.78 by bisection on Gap(s) = X*_knee(s) - X*_infl(s) = 0 and left OPEN a ' +
    'root-free closed form. Carrying E_flow exactly as the imp-34749 additive log-odds shift phi = ' +
    '-ln(1 + E_flow/E_trunc) scaled by s (u_full = u_0 + s*phi) and Taylor-expanding Gap(s) about s=0 gives a ' +
    'ROOT-FREE closed form from the two landmark slopes and curvatures alone: (M1) linear tangent s*_lin = ' +
    '-G0/G1 ~ 0.7722 and quadratic curvature-corrected s*_quad = (-G1 - sqrt(G1^2 - 2 G2 G0))/G2 ~ 0.7729, ' +
    'with G1 = dKnee/ds - dInfl/ds ~ -1.649e-2 (the imp-34886 sensitivity, sum of the imp-34858 knee slope ' +
    '-7.34e-3 and imp-34837 inflection slope +9.15e-3) and G2 = dKnee2 - dInfl2 ~ +3.64e-5 (difference of the ' +
    'two first-order-capture curvatures). (M2) The curvature correction s*_quad - s*_lin ~ +6.6e-4 (~0.09%) is ' +
    'TINY, reflecting the ~100% first-order capture in the deep-linear E_flow/E_trunc ~ 1.8e-3 regime. (M3) ' +
    'Both closed forms sit ~5e-3 below the bisected 0.7777 -- an anchoring effect (expansion centred at s=0, ' +
    '~0.78 from the root), the ~5e-3 residual being the un-captured cubic-and-higher Taylor tail; the quadratic ' +
    'term moves s* toward the bisected root by the +6.6e-4 correction, while the imp-34886 two-endpoint secant ' +
    '0.7792 (+1.5e-3) does better but is not a pure slope-plus-curvature closed form. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-34898: the imp-34886 crossing strength s* admits a ROOT-FREE closed form s*_quad = ' +
    '(-G1 - sqrt(G1^2 - 2 G2 G0))/G2 ~ 0.7729 from the two landmark slopes (G1 ~ -1.649e-2) and curvatures ' +
    '(G2 ~ +3.64e-5); the curvature correction over the linear tangent -G0/G1 ~ 0.7722 is a tiny +6.6e-4, and ' +
    'both sit ~5e-3 below the bisected 0.7777 (the cubic-and-higher Taylor tail from anchoring at s=0). What ' +
    'stays OPEN (deferred, changes no bound): a higher-order (cubic) closed form or a re-anchored expansion ' +
    'that closes the ~5e-3 residual, and imp-34899 whether s* drifts at larger E_flow/E_trunc ratios lower on the ramp.',
  citation:
    'imp-34886 (the bisected s* ~ 0.78, secant 0.7792, and the deferred root-free closed form this answers); ' +
    'imp-34858 (the D3 knee slope -7.34e-3 dex/unit reused as dKnee/ds); imp-34837 (the D2 inflection slope ' +
    '+9.15e-3 dex/unit reused as dInfl/ds); imp-34820 (the closed-form D2 inflection kernel and the +1.27e-2 ' +
    'no-E_flow gap); imp-34749 (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc)); imp-3463 ' +
    '(far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM_ASSERTIONS = [
  {
    // (M1): the linear tangent closed form -G0/G1 lands in the physical [0,1] range near 0.772.
    id: 'imp34898-linear-tangent-closed-form-physical',
    description: 's*_lin = -G0/G1 ~ 0.7722 lies strictly inside [0,1]',
    holds: () =>
      S_STAR_LINEAR > 0.7 && S_STAR_LINEAR < 0.85 && Math.abs(S_STAR_LINEAR - 0.7722) < 5e-3,
  },
  {
    // (M1): the quadratic curvature-corrected closed form is real (disc>0) and near 0.7729.
    id: 'imp34898-quadratic-closed-form-real-and-near-0773',
    description: 'discriminant > 0 and s*_quad ~ 0.7729 (root-free curvature-corrected crossing)',
    holds: () =>
      DISC > 0 && S_STAR_QUAD > 0.7 && S_STAR_QUAD < 0.85 && Math.abs(S_STAR_QUAD - 0.7729) < 5e-3,
  },
  {
    // (M1): the Taylor coefficients are built from the imp-34858/34837 slopes and curvatures.
    id: 'imp34898-taylor-coeffs-from-landmark-slopes',
    description: 'G1 = dKnee/ds - dInfl/ds (< 0) and G2 = dKnee2 - dInfl2 (> 0)',
    holds: () =>
      G1 < 0 &&
      Math.abs(G1 - (DKNEE_DS0 - DINFL_DS0)) < 1e-6 &&
      G2 > 0 &&
      Math.abs(G2 - (DKNEE_DS0_2 - DINFL_DS0_2)) < 1e-6 &&
      DKNEE_DS0 < 0 &&
      DINFL_DS0 > 0,
  },
  {
    // (M2): the curvature correction is tiny and positive (moves toward the bisected root).
    id: 'imp34898-curvature-correction-tiny-positive',
    description: 's*_quad - s*_lin ~ +6.6e-4 (small, positive)',
    holds: () =>
      CURVATURE_CORRECTION > 0 &&
      CURVATURE_CORRECTION < 2e-3 &&
      Math.abs(CURVATURE_CORRECTION - 6.6e-4) < 3e-4,
  },
  {
    // (M3): both closed forms sit ~5e-3 below the imp-34886 bisected 0.7777, quad closer than linear.
    id: 'imp34898-closed-forms-below-bisected-quad-closer',
    description: 'quad and linear ~5e-3 below bisected 0.7777, quad closer than linear',
    holds: () =>
      Math.abs(S_STAR_BISECTED - 0.7777) < 5e-3 &&
      QUAD_MINUS_BISECTED < 0 &&
      LINEAR_MINUS_BISECTED < 0 &&
      Math.abs(QUAD_MINUS_BISECTED) < Math.abs(LINEAR_MINUS_BISECTED) &&
      Math.abs(QUAD_MINUS_BISECTED) < 1e-2,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34898-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM.isRigorous === false &&
      IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM.farTailExponent === 0.5 &&
      typeof IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM.subGap === 'string' &&
      /NO QED/.test(IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM.verdict),
  },
];

for (const a of IMP34898_EFLOW_CROSSING_STRENGTH_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34898-eflow-crossing-strength-closed-form assertion failed: ${a.id}`);
  }
}
