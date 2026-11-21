/**
 * @module imp-34837-sigmoid-inflection-d2-eflow-reinstatement
 *
 * imp-34837 (numerical, frontier-direction): imp-34820 derived the sibling SECOND-order identity
 * sigma_secondDeriv = S(1-S)[(1-2S) u_prime^2 + u_secondDeriv] and its closed-form D2 inflection locator
 * sigma_infl = 1/2 + u_secondDeriv/(2 u_prime^2), which lands on the finite-difference sigma_secondDeriv = 0
 * inflection to ~3e-8 on the NO-E_flow model. It left OPEN whether that closed-form D2 locator SURVIVES
 * reinstating the dropped E_flow term in the log-odds u -- i.e. whether the full-model sigmoid inflection
 * stays at the exact D2 root once E_flow is carried, and how big the location shift is (the same
 * E_flow-reinstatement sub-gap imp-34796 left open for its third-order knee identity, and which imp-33744 F3
 * estimated adds only a same-order ~0.003 secondary shift). This module MEASURES it, carrying E_flow exactly
 * as the imp-34749 additive log-odds shift phi = -ln(1 + E_flow/E_trunc).
 *
 * THE SETUP (E_flow is an EXACT additive log-odds shift, reused from imp-34749)
 * ----------------------------------------------------------------------------
 * The full model sigma_full = E_coll/(E_trunc + E_flow + E_coll) has log-odds u_full(x) = u_0(x) + phi(x)
 * EXACTLY, where u_0(x) = ln A + 0.5 ln L - x/2 is the imp-34820/imp-34710 no-E_flow log-odds (A = C_C/E_trunc,
 * L = log T0, x = ln N) and phi(x) = -ln(1 + E_flow/E_trunc) is the E_flow perturbation. Because sigma_full =
 * logistic(u_full) EXACTLY, the imp-34820 D2 inflection kernel (1-2S) u_prime^2 + u_secondDeriv evaluated on
 * u_full is the exact full-model inflection condition, no approximation left over. Scaling phi by a strength s
 * (s=0 dropped, s=1 carried) lets us re-solve the D2 root X*(s) and read off both the exact carried shift
 * X*(1) - X*(0) and the first-order implicit-function slope dXstar/ds at s=0.
 *
 * THE MEASUREMENT (h = 1e-2, the imp-34820 step; central-difference u-derivatives)
 * -------------------------------------------------------------------------------
 *   (A) THE CLOSED-FORM D2 LOCATOR SURVIVES E_flow. With E_flow carried (s=1), the D2 root of
 *       (1-2S) u_full_prime^2 + u_full_secondDeriv = 0 still lands on an INDEPENDENT finite-difference
 *       sigma_secondDeriv = 0 root to ~8e-8 -- the same ~3e-8-class agreement imp-34820 reported at s=0.
 *       So the closed form is exact algebra whether or not E_flow is carried; reinstating E_flow does NOT
 *       break the locator, it only MOVES the root.
 *   (B) THE LOCATION SHIFTS +9.03e-3 dex -- ~3x THE imp-33744 F3 ~0.003 ESTIMATE. Carrying E_flow moves the
 *       inflection from the no-E_flow log10 N* ~ 9.52364 (imp-34820) UP to ~9.53267, a +9.03e-3 dex shift.
 *       This is NOT the "same-order ~0.003 secondary shift" imp-33744 F3 estimated -- it is ~3x larger,
 *       comparable in magnitude (opposite sign) to the imp-34749 knee E_flow shift -7.32e-3.
 *   (C) THE FIRST-ORDER SLOPE CAPTURES IT TO ~101%. The implicit-function slope dXstar/ds at s=0 ~ +9.15e-3
 *       dex predicts the full-restore shift to ~101% (deep linear regime: E_flow/E_trunc ~ 1.9e-3 at the
 *       inflection), the second-order analogue of the imp-34749 knee first-order capture.
 *   (D) REINSTATING E_flow REVERSES THE KNEE-VS-INFLECTION ORDERING. The third-order sigma-KNEE shifts DOWN
 *       (-7.32e-3, reproducing imp-34749/imp-34710) while this D2 inflection shifts UP (+9.03e-3), so the two
 *       landmarks CROSS: no-E_flow the knee sits +1.27e-2 dex ABOVE the inflection (imp-34820), but with
 *       E_flow carried the knee sits -3.61e-3 dex BELOW it. E_flow does not merely shrink the gap, it flips
 *       the sign of the separation.
 *
 * THE FINDING (measurement / assessment only; answers imp-34837)
 * --------------------------------------------------------------
 *   (F1) THE CLOSED-FORM D2 LOCATOR SURVIVES. Carrying E_flow as the exact log-odds shift phi, the D2 root of
 *        (1-2S) u_full_prime^2 + u_full_secondDeriv = 0 still coincides with the finite-difference
 *        sigma_secondDeriv = 0 inflection to ~8e-8. The imp-34820 sibling second-order identity is exact
 *        algebra in the full model too; reinstating E_flow does not invalidate the closed form.
 *   (F2) BUT THE LOCATION SHIFT IS ~3x THE imp-33744 F3 ESTIMATE. The inflection moves +9.03e-3 dex
 *        (9.52364 -> 9.53267), first-order-captured to ~101% by dXstar/ds at s=0 ~ +9.15e-3. imp-33744 F3s
 *        ~0.003 same-order guess UNDERSTATES the E_flow shift by ~3x; the true shift is knee-magnitude class.
 *   (F3) E_flow FLIPS THE KNEE-INFLECTION ORDERING. Knee shifts -7.32e-3 (down), inflection +9.03e-3 (up), so
 *        the imp-34820 no-E_flow +1.27e-2 dex knee-above-inflection separation becomes -3.61e-3 dex
 *        (knee below inflection) once E_flow is carried -- the two landmarks cross.
 *
 * MEASUREMENT / ASSESSMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34820-sigmoid-inflection-d2-closed-form-locator (the closed-form D2 locator this reinstates E_flow into; posed this OPEN sub-gap)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc) reused here)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (F3: the ~0.003 secondary-shift estimate this measures against)
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (the knee -7.32e-3 E_flow shift this reproduces)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34710 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x (the small ratio ~1.9e-3 at the inflection that phi packages). Prefactor is the
// imp-398 pinned C_F = (log(T0/2pi)+1)/2pi, identical sub-terms to imp-34749/imp-34710.
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
// No-E_flow log-odds u_0 = ln(E_coll/E_trunc) = ln A + 0.5 ln L - x/2 (imp-34820/imp-34710 uOf).
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// E_flow perturbation of the log-odds, scaled by strength s (s=1 carried, s=0 dropped). phi = -ln(1 + s ratio).
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
// Corrected log-odds u_full = u_0 + phi. sigma_full = logistic(u_full) EXACTLY at s=1.
function uFull(x, s) {
  return u0(x) + phi(x, s);
}
function sigmaOf(x, s) {
  return 1 / (1 + Math.exp(-uFull(x, s)));
}

// central-difference stencils on the log-odds (imp-34820 step h = 1e-2)
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

// SECOND-order sigmoid-inflection kernel (imp-34820 closed-form D2 locator) evaluated on u_full (E_flow carried):
// (1-2S) u_full_prime^2 + u_full_secondDeriv.
function d2Cond(x, s, h) {
  const S = sigmaOf(x, s);
  const up = d1((z) => uFull(z, s), x, h);
  const upp = d2((z) => uFull(z, s), x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition (imp-34749/imp-34710 route) evaluated on u_full, for the ordering check:
// F = S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv with v = -u_full_prime.
function fKnee(x, s, h) {
  const S = sigmaOf(x, s);
  const v = -d1((z) => uFull(z, s), x, h);
  const vp = -d2((z) => uFull(z, s), x, h);
  const vpp = -d3((z) => uFull(z, s), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection on a bracket known to contain a single root
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

// ---- (A) the closed-form D2 locator with E_flow dropped (s=0) vs carried (s=1) ---------------------------
const X_INFL_NOFLOW = bisect((x) => d2Cond(x, 0, H_ID), LO, HI); // no-E_flow inflection (imp-34820 ~9.52364)
const X_INFL_FULL = bisect((x) => d2Cond(x, 1, H_ID), LO, HI); // E_flow-carried inflection (~9.53267)
const LOG10_N_INFL_NOFLOW = X_INFL_NOFLOW / LN10;
const LOG10_N_INFL_FULL = X_INFL_FULL / LN10;
const INFL_SHIFT_LOG10 = (X_INFL_FULL - X_INFL_NOFLOW) / LN10; // ~+9.03e-3 (no -> full)
const EFLOW_RATIO_AT_INFL = eflowRatio(X_INFL_NOFLOW); // ~1.9e-3 (the small parameter phi packages)

// the closed-form D2 root vs an INDEPENDENT finite-difference sigma_secondDeriv=0 root, WITH E_flow carried:
// the locator SURVIVES if the two coincide (as they did at s=0 in imp-34820, ~3e-8).
const X_INFL_FULL_FD = bisect((x) => d2(((z) => sigmaOf(z, 1)), x, H_ID), LO, HI);
const D2_VS_FD_SEP_FULL = Math.abs(X_INFL_FULL - X_INFL_FULL_FD); // ~8e-8: closed form survives E_flow

// ---- (C) first-order (linear-in-strength) correction: implicit-function slope dXstar/ds at s=0 -----------
const S_EPS = 0.02;
function inflAt(s) {
  return bisect((x) => d2Cond(x, s, H_ID), LO, HI);
}
const SLOPE0 = (inflAt(S_EPS) - inflAt(-S_EPS)) / (2 * S_EPS); // dXstar/ds|_0 (ln-N units)
const SLOPE0_LOG10 = SLOPE0 / LN10; // ~+9.15e-3 dex per unit strength
const FO_SHIFT_LOG10 = SLOPE0_LOG10; // first-order predicted shift = slope * 1
const FO_FRACTION_OF_EXACT = FO_SHIFT_LOG10 / INFL_SHIFT_LOG10; // ~1.01 (deep linear regime)

// imp-33744 F3 same-order secondary-shift estimate the ticket measures against
const IMP33744_F3_ESTIMATE = 0.003;
const SHIFT_VS_F3_RATIO = Math.abs(INFL_SHIFT_LOG10) / IMP33744_F3_ESTIMATE; // ~3x (F3 understates)

// ---- (D) knee-vs-inflection ordering, same h, dropped vs carried E_flow ----------------------------------
const X_KNEE_NOFLOW = bisect((x) => fKnee(x, 0, H_ID), LO, HI); // no-E_flow knee (imp-34820 ~9.53638)
const X_KNEE_FULL = bisect((x) => fKnee(x, 1, H_ID), LO, HI); // E_flow-carried knee (imp-34749 ~9.52906)
const KNEE_SHIFT_LOG10 = (X_KNEE_FULL - X_KNEE_NOFLOW) / LN10; // ~-7.32e-3 (reproduces imp-34749/imp-34710)
const KNEE_MINUS_INFL_NOFLOW = (X_KNEE_NOFLOW - X_INFL_NOFLOW) / LN10; // ~+1.27e-2 (knee above; imp-34820)
const KNEE_MINUS_INFL_FULL = (X_KNEE_FULL - X_INFL_FULL) / LN10; // ~-3.61e-3 (knee below: ordering flipped)

export const IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT = {
  id: 'imp-34837',
  proofSection: 'S-frontier',
  question:
    'imp-34820 derived the closed-form D2 inflection locator sigma_infl = 1/2 + u_secondDeriv/(2 u_prime^2) ' +
    'and landed it on the finite-difference sigmoid inflection to ~3e-8 on the no-E_flow model, but left OPEN ' +
    'whether the locator survives reinstating the dropped E_flow term in u -- i.e. whether the full-model ' +
    'inflection stays at the exact D2 root once E_flow is carried, and how big the shift is versus the ' +
    'imp-33744 F3 ~0.003 estimate. Recompute u and its derivatives WITH E_flow carried and MEASURE the shift. ' +
    'Assessment on the inherited surrogate; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'YES the closed-form D2 locator SURVIVES E_flow -- with u_full = u_0 - ln(1+E_flow/E_trunc) carried, the ' +
    'D2 root still lands on the finite-difference sigma_secondDeriv=0 inflection to ~8e-8. But the LOCATION ' +
    'shifts +9.03e-3 dex (~3x the imp-33744 F3 ~0.003 estimate), and since the knee shifts -7.32e-3 the two ' +
    'landmarks CROSS (ordering flips from +1.27e-2 to -3.61e-3 dex).',
  measuredQuantity:
    'the log10 N* shift of the imp-34820 closed-form D2 inflection root (1-2S) u_prime^2 + u_secondDeriv = 0 ' +
    'when the dropped E_flow term is reinstated as the exact additive log-odds shift phi = -ln(1+E_flow/' +
    'E_trunc), its first-order implicit-function slope, and the resulting knee-vs-inflection ordering flip',
  inflectionLocations: {
    log10NstarNoEflow: +LOG10_N_INFL_NOFLOW.toFixed(6), // ~9.52364 (imp-34820 no-E_flow inflection)
    log10NstarEflowCarried: +LOG10_N_INFL_FULL.toFixed(6), // ~9.53267 (E_flow carried)
    inflectionShiftLog10: +INFL_SHIFT_LOG10.toExponential(4), // ~+9.03e-3 (no -> full)
    eflowRatioAtInflection: +EFLOW_RATIO_AT_INFL.toExponential(4), // ~1.9e-3 (small parameter phi packages)
    closedFormVsFiniteDifferenceSepFull: +D2_VS_FD_SEP_FULL.toExponential(3), // ~8e-8: locator survives E_flow
  },
  firstOrder: {
    slope_dXstar_ds_log10: +SLOPE0_LOG10.toExponential(4), // ~+9.15e-3 dex per unit strength
    firstOrderShiftLog10: +FO_SHIFT_LOG10.toExponential(4), // ~+9.15e-3 (slope * 1)
    firstOrderFractionOfExact: +FO_FRACTION_OF_EXACT.toFixed(4), // ~1.01 (deep linear regime)
  },
  vsImp33744F3: {
    imp33744F3EstimateLog10: IMP33744_F3_ESTIMATE, // ~0.003 same-order secondary-shift estimate
    measuredShiftLog10: +Math.abs(INFL_SHIFT_LOG10).toExponential(4), // ~9.03e-3
    ratioMeasuredOverEstimate: +SHIFT_VS_F3_RATIO.toFixed(2), // ~3x: F3 understates the E_flow shift
  },
  kneeVsInflectionOrdering: {
    kneeShiftLog10: +KNEE_SHIFT_LOG10.toExponential(4), // ~-7.32e-3 (reproduces imp-34749/imp-34710)
    kneeMinusInflectionNoEflowDex: +KNEE_MINUS_INFL_NOFLOW.toExponential(4), // ~+1.27e-2 (knee above; imp-34820)
    kneeMinusInflectionEflowDex: +KNEE_MINUS_INFL_FULL.toExponential(4), // ~-3.61e-3 (knee below: flipped)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_closed_form_d2_locator_survives_eflow:
      'Carrying E_flow as the exact log-odds shift phi = -ln(1 + E_flow/E_trunc), the closed-form D2 root of ' +
      '(1-2S) u_full_prime^2 + u_full_secondDeriv = 0 still coincides with an independent finite-difference ' +
      'sigma_secondDeriv = 0 inflection to ~8e-8 -- the same ~3e-8-class agreement imp-34820 reported at s=0. ' +
      'The sibling second-order identity is exact algebra in the full model too; reinstating E_flow does NOT ' +
      'break the locator, it only moves the root.',
    F2_location_shift_is_three_times_the_imp33744_f3_estimate:
      'The inflection moves from the no-E_flow log10 N* ~ 9.52364 UP to ~9.53267 -- a +9.03e-3 dex shift, ' +
      'first-order-captured to ~101% by dXstar/ds|_0 ~ +9.15e-3 (deep linear regime, E_flow/E_trunc ~ 1.9e-3). ' +
      'This is ~3x the imp-33744 F3 same-order ~0.003 estimate, which UNDERSTATES the E_flow shift; the true ' +
      'shift is knee-magnitude class, comparable in size (opposite sign) to the imp-34749 knee -7.32e-3.',
    F3_eflow_flips_the_knee_inflection_ordering:
      'The third-order sigma-KNEE shifts DOWN (-7.32e-3, reproducing imp-34749/imp-34710) while this D2 ' +
      'inflection shifts UP (+9.03e-3), so the imp-34820 no-E_flow +1.27e-2 dex knee-above-inflection ' +
      'separation becomes -3.61e-3 dex (knee below inflection) once E_flow is carried. E_flow does not merely ' +
      'shrink the gap between the two landmarks -- it flips the sign of the separation; they cross.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + MEASUREMENT (frontier-direction, NOT rigorous). The ticket asks whether the imp-34820 ' +
    'closed-form second-order D2 inflection locator sigma_infl = 1/2 + u_secondDeriv/(2 u_prime^2) survives ' +
    'reinstating the dropped E_flow term in u. Carrying E_flow exactly as the imp-34749 additive log-odds ' +
    'shift phi = -ln(1 + E_flow/E_trunc) (so u_full = u_0 + phi and sigma_full = logistic(u_full) EXACTLY): ' +
    '(A) the closed-form D2 root of (1-2S) u_full_prime^2 + u_full_secondDeriv = 0 STILL lands on an ' +
    'independent finite-difference sigma_secondDeriv = 0 inflection to ~8e-8, so the locator SURVIVES -- it is ' +
    'exact algebra in the full model too. (B) But the LOCATION shifts +9.03e-3 dex (from the no-E_flow ' +
    '9.52364 to 9.53267), first-order-captured to ~101% by the slope dXstar/ds|_0 ~ +9.15e-3 -- about 3x the ' +
    'imp-33744 F3 same-order ~0.003 estimate, which UNDERSTATES it. (C) Because the third-order knee shifts ' +
    'DOWN (-7.32e-3, reproducing imp-34749/imp-34710) while this inflection shifts UP, the imp-34820 no-E_flow ' +
    '+1.27e-2 dex knee-above-inflection separation FLIPS to -3.61e-3 dex (knee below inflection): the two ' +
    'landmarks cross. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'ANSWERS imp-34837: the imp-34820 closed-form D2 inflection locator SURVIVES reinstating E_flow (the D2 ' +
    'root still lands on the finite-difference sigma_secondDeriv=0 inflection to ~8e-8 with u_full carried), ' +
    'but the LOCATION shifts +9.03e-3 dex -- ~3x the imp-33744 F3 ~0.003 estimate -- and the knee-vs-inflection ' +
    'ordering FLIPS (from +1.27e-2 to -3.61e-3 dex). What stays OPEN (deferred, changes no bound) is a ' +
    'closed-form (root-free) expression for the E_flow-carried inflection location and whether the ' +
    'ordering-flip crossover point (where the knee-inflection separation passes through zero as the E_flow ' +
    'strength s is dialed from 0 to 1) has an interpretable meaning.',
  citation:
    'imp-34820 (the closed-form D2 locator this reinstates E_flow into; posed this OPEN sub-gap); imp-34749 ' +
    '(the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc) reused here; knee E_flow closure); ' +
    'imp-33744 (F3: the ~0.003 secondary-shift estimate this measures against); imp-34710 (the knee -7.32e-3 ' +
    'E_flow shift this reproduces); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT_ASSERTIONS = [
  {
    // (F1): the closed-form D2 locator SURVIVES E_flow -- the D2 root still lands on the FD sigma''=0 root.
    id: 'imp34837-closed-form-d2-locator-survives-eflow',
    description: 'with E_flow carried, the D2 root matches the FD sigma_secondDeriv=0 inflection to < 1e-6',
    holds: () => D2_VS_FD_SEP_FULL < 1e-6,
  },
  {
    // (F2): carrying E_flow raises the inflection ~+9e-3 dex from the imp-34820 no-E_flow ~9.52364.
    id: 'imp34837-inflection-shift-is-knee-magnitude',
    description: 'inflection shifts UP ~+9e-3 dex (no-E_flow ~9.52364 -> carried ~9.53267)',
    holds: () =>
      Math.abs(LOG10_N_INFL_NOFLOW - 9.52364) < 1e-3 &&
      INFL_SHIFT_LOG10 > 7e-3 &&
      INFL_SHIFT_LOG10 < 1.1e-2 &&
      LOG10_N_INFL_FULL > LOG10_N_INFL_NOFLOW,
  },
  {
    // (F2): the measured shift is ~3x the imp-33744 F3 ~0.003 estimate (F3 understates the E_flow shift).
    id: 'imp34837-shift-exceeds-imp33744-f3-estimate',
    description: 'measured +9e-3 shift is ~3x the imp-33744 F3 ~0.003 estimate (F3 understates)',
    holds: () => SHIFT_VS_F3_RATIO > 2 && SHIFT_VS_F3_RATIO < 4,
  },
  {
    // (F2): the first-order implicit-function slope captures the exact shift to within ~10% (deep linear regime).
    id: 'imp34837-first-order-captures-shift',
    description: 'first-order slope ~+9.15e-3 reproduces the exact shift within ~10% (deep linear regime)',
    holds: () =>
      SLOPE0_LOG10 > 7e-3 &&
      SLOPE0_LOG10 < 1.1e-2 &&
      FO_FRACTION_OF_EXACT > 0.9 &&
      FO_FRACTION_OF_EXACT < 1.1,
  },
  {
    // (F3): reinstating E_flow FLIPS the knee-vs-inflection ordering (from +1.27e-2 to negative separation).
    id: 'imp34837-eflow-flips-knee-inflection-ordering',
    description: 'knee-above (+1.27e-2 dex) no-E_flow becomes knee-below (negative dex) once E_flow is carried',
    holds: () =>
      KNEE_MINUS_INFL_NOFLOW > 1e-2 &&
      KNEE_MINUS_INFL_FULL < 0 &&
      KNEE_SHIFT_LOG10 < -5e-3 &&
      KNEE_SHIFT_LOG10 > -9e-3,
  },
  {
    // Honesty gate: assessment/measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34837-honesty-gate-no-qed',
    description: 'Assessment/measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT.isRigorous === false &&
      IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT.farTailExponent === 0.5 &&
      typeof IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT.subGap === 'string' &&
      /NO QED/.test(IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT.verdict),
  },
];

for (const a of IMP34837_SIGMOID_INFLECTION_D2_EFLOW_REINSTATEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34837-sigmoid-inflection-d2-eflow-reinstatement assertion failed: ${a.id}`);
  }
}
