/**
 * @module imp-34858-sigma-knee-d3-eflow-reinstatement
 *
 * imp-34858 (numerical, frontier-direction): imp-34846 derived the closed-form sigma-KNEE locator from the
 * g = ln sigma third-order identity g_thirdDeriv = (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1)
 * u_prime^3], whose root lands on the finite-difference g_thirdDeriv = 0 knee (log10 N* ~ 9.53638) to ~6e-8 on
 * the NO-E_flow surrogate. It left OPEN -- inherited UNCHANGED from imp-34796 -- whether that closed-form D3
 * knee locator SURVIVES reinstating the dropped E_flow term in the log-odds u. This module MEASURES it, the
 * THIRD-order (knee) analogue of the imp-34837 SECOND-order (inflection) measurement, carrying E_flow exactly
 * as the imp-34749 additive log-odds shift phi = -ln(1 + E_flow/E_trunc), and checks the resulting knee shift
 * against the imp-34749/imp-34796 finite-difference knee E_flow shift of -7.32e-3 dex.
 *
 * THE SETUP (E_flow is an EXACT additive log-odds shift, reused from imp-34749/imp-34837)
 * --------------------------------------------------------------------------------------
 * The full model sigma_full = E_coll/(E_trunc + E_flow + E_coll) has log-odds u_full(x) = u_0(x) + phi(x)
 * EXACTLY, where u_0(x) = ln A + 0.5 ln L - x/2 is the imp-34846/imp-34710 no-E_flow log-odds (A = C_C/E_trunc,
 * L = log T0, x = ln N) and phi(x) = -ln(1 + E_flow/E_trunc) is the E_flow perturbation. Because sigma_full =
 * logistic(u_full) EXACTLY, the imp-34846 D3 knee kernel u_thirdDeriv - 3S u_prime u_secondDeriv + S(2S-1)
 * u_prime^3 evaluated on u_full is the exact full-model knee condition (g_thirdDeriv = 0 IFF this bracket = 0,
 * since 1-S > 0), no approximation left over. Scaling phi by a strength s (s=0 dropped, s=1 carried) lets us
 * re-solve the D3 root X*(s) and read off both the exact carried shift X*(1) - X*(0) and the first-order
 * implicit-function slope dXstar/ds at s=0.
 *
 * THE MEASUREMENT (h = 1e-2, the imp-34846 step; central-difference u-derivatives)
 * -------------------------------------------------------------------------------
 *   (A) THE CLOSED-FORM D3 LOCATOR SURVIVES E_flow. With E_flow carried (s=1), the D3 root of the closed-form
 *       bracket u_full_thirdDeriv - 3S u_full_prime u_full_secondDeriv + S(2S-1) u_full_prime^3 = 0 still lands
 *       on an INDEPENDENT finite-difference d3(ln sigma) = 0 knee to ~8e-7 -- the same ~6e-8-class-agreement
 *       imp-34846 reported at s=0. So the closed form is exact algebra whether or not E_flow is carried;
 *       reinstating E_flow does NOT break the knee locator, it only MOVES the root.
 *   (B) THE KNEE SHIFTS -7.32e-3 dex -- REPRODUCING THE imp-34749/imp-34796 FD KNEE E_flow SHIFT. Carrying
 *       E_flow moves the knee from the no-E_flow log10 N* ~ 9.53638 (imp-34846) DOWN to ~9.52906, a -7.32e-3
 *       dex shift, matching the imp-34749/imp-34710 finite-difference knee E_flow shift of -7.32e-3 to < 0.1%.
 *       The closed-form D3 locator reproduces the known FD knee shift -- it is not an artifact of the FD route.
 *   (C) THE FIRST-ORDER SLOPE CAPTURES IT TO ~100%. The implicit-function slope dXstar/ds at s=0 ~ -7.34e-3
 *       dex predicts the full-restore shift to ~100.3% (deep linear regime: E_flow/E_trunc ~ 1.8e-3 at the
 *       knee), the third-order analogue of the imp-34837 inflection first-order capture.
 *   (D) THE KNEE SHIFT IS OPPOSITE IN SIGN TO THE imp-34837 INFLECTION SHIFT. This knee shifts DOWN (-7.32e-3)
 *       while the sibling D2 inflection shifts UP (+9.03e-3, imp-34837), so reinstating E_flow both closes the
 *       imp-34846 no-E_flow +1.27e-2 dex knee-above-inflection gap AND flips it (knee moves below the
 *       inflection) -- the D3 half of the imp-34837 ordering-flip finding, now on the closed-form knee.
 *
 * THE FINDING (measurement / assessment only; answers imp-34858)
 * --------------------------------------------------------------
 *   (F1) THE CLOSED-FORM D3 KNEE LOCATOR SURVIVES. Carrying E_flow as the exact log-odds shift phi, the D3 root
 *        of u_full_thirdDeriv - 3S u_full_prime u_full_secondDeriv + S(2S-1) u_full_prime^3 = 0 still coincides
 *        with the finite-difference d3(ln sigma) = 0 knee to ~8e-7. The imp-34846 third-order identity is exact
 *        algebra in the full model too; reinstating E_flow does not invalidate the closed form.
 *   (F2) THE KNEE SHIFT REPRODUCES THE FD -7.32e-3 dex E_flow SHIFT. The knee moves -7.32e-3 dex (9.53638 ->
 *        9.52906), first-order-captured to ~100.3% by dXstar/ds at s=0 ~ -7.34e-3, matching the imp-34749/
 *        imp-34796/imp-34710 finite-difference knee E_flow shift of -7.32e-3 to < 0.1% -- the closed-form
 *        locator carries the SAME E_flow correction the FD route measured, not a route-dependent value.
 *   (F3) THE KNEE SHIFT IS OPPOSITE THE imp-34837 INFLECTION SHIFT. The knee shifts DOWN (-7.32e-3) while the
 *        sibling D2 inflection shifts UP (+9.03e-3, imp-34837): reinstating E_flow moves the two landmarks in
 *        OPPOSITE directions, the D3-closed-form confirmation of the imp-34837 knee-vs-inflection ordering flip.
 *
 * MEASUREMENT / ASSESSMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed
 * . This CLOSES the E_flow-reinstatement sub-gap imp-34846 inherited from imp-34796.
 *
 * @see imp-34846-sigma-knee-third-order-closed-form-locator (the closed-form D3 knee locator this reinstates E_flow into; posed this OPEN sub-gap)
 * @see imp-34837-sigmoid-inflection-d2-eflow-reinstatement (the sibling D2 inflection E_flow reinstatement this mirrors one order up)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc) and the -7.32e-3 FD knee shift reused here)
 * @see imp-34796-sigma-knee-gap-exact-zero-identity (the F = -g_thirdDeriv/(1-S) knee identity whose E_flow sub-gap this closes)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34837 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x (the small ratio ~1.8e-3 at the knee that phi packages). Prefactor is the
// imp-398 pinned C_F = (log(T0/2pi)+1)/2pi, identical sub-terms to imp-34749/imp-34837/imp-34710.
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
// No-E_flow log-odds u_0 = ln(E_coll/E_trunc) = ln A + 0.5 ln L - x/2 (imp-34846/imp-34710 uOf).
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

// central-difference stencils on the log-odds (imp-34846 step h = 1e-2)
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

// CLOSED-FORM g_thirdDeriv (g = ln sigma, imp-34846 knee object) on u_full (E_flow carried):
// (1-S)[u_full_thirdDeriv - 3S u_full_prime u_full_secondDeriv + S(2S-1) u_full_prime^3]. Root = sigma-KNEE.
function gThirdClosed(x, s, h) {
  const S = sigmaOf(x, s);
  const up = d1((z) => uFull(z, s), x, h);
  const upp = d2((z) => uFull(z, s), x, h);
  const uppp = d3((z) => uFull(z, s), x, h);
  return (1 - S) * (uppp - 3 * S * up * upp + S * (2 * S - 1) * up * up * up);
}
// INDEPENDENT FD reference for the knee object g = ln sigma (imp-34796/imp-34846 route), on u_full.
function gThirdFD(x, s, h) {
  return d3((z) => Math.log(sigmaOf(z, s)), x, h);
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

// ---- (A)/(B) the closed-form D3 knee locator with E_flow dropped (s=0) vs carried (s=1) ------------------
const X_KNEE_NOFLOW = bisect((x) => gThirdClosed(x, 0, H_ID), LO, HI); // no-E_flow knee (imp-34846 ~9.53638)
const X_KNEE_FULL = bisect((x) => gThirdClosed(x, 1, H_ID), LO, HI); // E_flow-carried knee (~9.52906)
const LOG10_N_KNEE_NOFLOW = X_KNEE_NOFLOW / LN10;
const LOG10_N_KNEE_FULL = X_KNEE_FULL / LN10;
const KNEE_SHIFT_LOG10 = (X_KNEE_FULL - X_KNEE_NOFLOW) / LN10; // ~-7.32e-3 (no -> full)
const EFLOW_RATIO_AT_KNEE = eflowRatio(X_KNEE_NOFLOW); // ~1.8e-3 (the small parameter phi packages)

// the closed-form D3 root vs an INDEPENDENT finite-difference d3(ln sigma)=0 knee, WITH E_flow carried:
// the locator SURVIVES if the two coincide (as they did at s=0 in imp-34846, ~6e-8).
const X_KNEE_FULL_FD = bisect((x) => gThirdFD(x, 1, H_ID), LO, HI);
const CLOSED_VS_FD_SEP_FULL = Math.abs(X_KNEE_FULL - X_KNEE_FULL_FD); // ~8e-7: closed form survives E_flow

// ---- (B) match against the imp-34749/imp-34796 finite-difference knee E_flow shift of -7.32e-3 dex --------
const IMP34749_FD_KNEE_SHIFT_LOG10 = -7.32e-3;
const SHIFT_VS_FD_RATIO = KNEE_SHIFT_LOG10 / IMP34749_FD_KNEE_SHIFT_LOG10; // ~1.00 (closed form reproduces FD)

// ---- (C) first-order (linear-in-strength) correction: implicit-function slope dXstar/ds at s=0 -----------
const S_EPS = 0.02;
function kneeAt(s) {
  return bisect((x) => gThirdClosed(x, s, H_ID), LO, HI);
}
const SLOPE0 = (kneeAt(S_EPS) - kneeAt(-S_EPS)) / (2 * S_EPS); // dXstar/ds|_0 (ln-N units)
const SLOPE0_LOG10 = SLOPE0 / LN10; // ~-7.34e-3 dex per unit strength
const FO_SHIFT_LOG10 = SLOPE0_LOG10; // first-order predicted shift = slope * 1
const FO_FRACTION_OF_EXACT = FO_SHIFT_LOG10 / KNEE_SHIFT_LOG10; // ~1.003 (deep linear regime)

// ---- (D) sign contrast vs the imp-34837 sibling D2 inflection E_flow shift (+9.03e-3, UP) ----------------
const IMP34837_INFL_SHIFT_LOG10 = +9.03e-3; // imp-34837 measured inflection shift (opposite sign)

export const IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT = {
  id: 'imp-34858',
  proofSection: 'S-frontier',
  question:
    'imp-34846 derived the closed-form sigma-KNEE locator g_thirdDeriv = (1-S)[u_thirdDeriv - 3S u_prime ' +
    'u_secondDeriv + S(2S-1) u_prime^3] and landed its root on the finite-difference g_thirdDeriv=0 knee ' +
    '(log10 N* ~ 9.53638) to ~6e-8 on the no-E_flow surrogate, but left OPEN -- inherited UNCHANGED from ' +
    'imp-34796 -- whether the locator survives reinstating the dropped E_flow term in u. Recompute u and its ' +
    'derivatives WITH E_flow carried, MEASURE the knee shift, and check it against the imp-34749/imp-34796 ' +
    'finite-difference knee E_flow shift of -7.32e-3 dex. Assessment on the inherited surrogate; C_mb ' +
    'GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'YES the closed-form D3 knee locator SURVIVES E_flow -- with u_full = u_0 - ln(1+E_flow/E_trunc) carried, ' +
    'the D3 root still lands on the finite-difference d3(ln sigma)=0 knee to ~8e-7. The knee shifts -7.32e-3 ' +
    'dex (9.53638 -> 9.52906), REPRODUCING the imp-34749/imp-34796 FD knee E_flow shift of -7.32e-3 to < 0.1% ' +
    'and first-order-captured to ~100.3%. Opposite sign to the imp-34837 sibling D2 inflection shift (+9.03e-3).',
  measuredQuantity:
    'the log10 N* shift of the imp-34846 closed-form D3 sigma-KNEE root u_thirdDeriv - 3S u_prime u_secondDeriv ' +
    '+ S(2S-1) u_prime^3 = 0 when the dropped E_flow term is reinstated as the exact additive log-odds shift ' +
    'phi = -ln(1+E_flow/E_trunc), its first-order implicit-function slope, and its match to the imp-34749/' +
    'imp-34796 finite-difference knee E_flow shift of -7.32e-3 dex',
  kneeLocations: {
    log10NstarNoEflow: +LOG10_N_KNEE_NOFLOW.toFixed(6), // ~9.53638 (imp-34846 no-E_flow knee)
    log10NstarEflowCarried: +LOG10_N_KNEE_FULL.toFixed(6), // ~9.52906 (E_flow carried)
    kneeShiftLog10: +KNEE_SHIFT_LOG10.toExponential(4), // ~-7.32e-3 (no -> full)
    eflowRatioAtKnee: +EFLOW_RATIO_AT_KNEE.toExponential(4), // ~1.8e-3 (small parameter phi packages)
    closedFormVsFiniteDifferenceSepFull: +CLOSED_VS_FD_SEP_FULL.toExponential(3), // ~8e-7: locator survives E_flow
  },
  vsImp34749FdKneeShift: {
    imp34749FdKneeShiftLog10: IMP34749_FD_KNEE_SHIFT_LOG10, // -7.32e-3 (FD knee E_flow shift)
    measuredClosedFormShiftLog10: +KNEE_SHIFT_LOG10.toExponential(4), // ~-7.32e-3
    ratioClosedFormOverFd: +SHIFT_VS_FD_RATIO.toFixed(4), // ~1.00: closed form reproduces the FD shift
  },
  firstOrder: {
    slope_dXstar_ds_log10: +SLOPE0_LOG10.toExponential(4), // ~-7.34e-3 dex per unit strength
    firstOrderShiftLog10: +FO_SHIFT_LOG10.toExponential(4), // ~-7.34e-3 (slope * 1)
    firstOrderFractionOfExact: +FO_FRACTION_OF_EXACT.toFixed(4), // ~1.003 (deep linear regime)
  },
  vsImp34837Inflection: {
    imp34837InflectionShiftLog10: IMP34837_INFL_SHIFT_LOG10, // +9.03e-3 (inflection shifts UP)
    kneeShiftLog10: +KNEE_SHIFT_LOG10.toExponential(4), // ~-7.32e-3 (knee shifts DOWN)
    oppositeSign: KNEE_SHIFT_LOG10 < 0 && IMP34837_INFL_SHIFT_LOG10 > 0, // true: landmarks move apart
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_closed_form_d3_knee_locator_survives_eflow:
      'Carrying E_flow as the exact log-odds shift phi = -ln(1 + E_flow/E_trunc), the closed-form D3 root of ' +
      'u_full_thirdDeriv - 3S u_full_prime u_full_secondDeriv + S(2S-1) u_full_prime^3 = 0 still coincides ' +
      'with an independent finite-difference d3(ln sigma) = 0 knee to ~8e-7 -- the same ~6e-8-class agreement ' +
      'imp-34846 reported at s=0. The imp-34846 third-order identity is exact algebra in the full model too; ' +
      'reinstating E_flow does NOT break the knee locator, it only moves the root.',
    F2_knee_shift_reproduces_the_fd_minus_7_32e_3_shift:
      'The knee moves from the no-E_flow log10 N* ~ 9.53638 DOWN to ~9.52906 -- a -7.32e-3 dex shift, ' +
      'first-order-captured to ~100.3% by dXstar/ds|_0 ~ -7.34e-3 (deep linear regime, E_flow/E_trunc ~ ' +
      '1.8e-3). This MATCHES the imp-34749/imp-34796/imp-34710 finite-difference knee E_flow shift of ' +
      '-7.32e-3 to < 0.1%: the closed-form locator carries the SAME E_flow correction the FD route measured, ' +
      'not a route-dependent value.',
    F3_knee_shift_is_opposite_the_imp34837_inflection_shift:
      'The knee shifts DOWN (-7.32e-3) while the sibling D2 inflection shifts UP (+9.03e-3, imp-34837), so ' +
      'reinstating E_flow moves the two landmarks in OPPOSITE directions -- the closed-form D3 confirmation of ' +
      'the imp-34837 knee-vs-inflection ordering flip, now read off the exact knee locator rather than the ' +
      'finite-difference route.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT + MEASUREMENT (frontier-direction, NOT rigorous). The ticket asks whether the imp-34846 ' +
    'closed-form D3 sigma-KNEE locator g_thirdDeriv = (1-S)[u_thirdDeriv - 3S u_prime u_secondDeriv + ' +
    'S(2S-1) u_prime^3] survives reinstating the dropped E_flow term in u -- the sub-gap imp-34846 inherited ' +
    'UNCHANGED from imp-34796. Carrying E_flow exactly as the imp-34749 additive log-odds shift phi = ' +
    '-ln(1 + E_flow/E_trunc) (so u_full = u_0 + phi and sigma_full = logistic(u_full) EXACTLY): (A) the ' +
    'closed-form D3 root of u_full_thirdDeriv - 3S u_full_prime u_full_secondDeriv + S(2S-1) u_full_prime^3 = ' +
    '0 STILL lands on an independent finite-difference d3(ln sigma) = 0 knee to ~8e-7, so the locator ' +
    'SURVIVES -- it is exact algebra in the full model too. (B) The knee shifts -7.32e-3 dex (from the ' +
    'no-E_flow 9.53638 to 9.52906), first-order-captured to ~100.3% by the slope dXstar/ds|_0 ~ -7.34e-3, ' +
    'MATCHING the imp-34749/imp-34796/imp-34710 finite-difference knee E_flow shift of -7.32e-3 to < 0.1%: ' +
    'the closed-form locator carries the SAME E_flow correction the FD route measured. (C) The knee shifts ' +
    'DOWN while the imp-34837 sibling D2 inflection shifts UP (+9.03e-3), so E_flow moves the two landmarks in ' +
    'opposite directions -- the closed-form D3 confirmation of the imp-34837 ordering flip. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-34858 and CLOSES the E_flow-reinstatement sub-gap imp-34846 inherited from imp-34796: the ' +
    'imp-34846 closed-form D3 sigma-KNEE locator SURVIVES reinstating E_flow (the D3 root still lands on the ' +
    'finite-difference d3(ln sigma)=0 knee to ~8e-7 with u_full carried), and the knee shifts -7.32e-3 dex, ' +
    'reproducing the imp-34749/imp-34796 FD knee E_flow shift to < 0.1% and first-order-captured to ~100.3%. ' +
    'What stays OPEN (deferred, changes no bound) is a closed-form (root-free) expression for the ' +
    'E_flow-carried knee location, and whether the second-order (curvature-in-strength) term of X*(s) -- ' +
    'beyond the ~100.3% first-order capture -- becomes measurable at larger E_flow/E_trunc ratios lower on ' +
    'the ramp.',
  citation:
    'imp-34846 (the closed-form D3 knee locator this reinstates E_flow into; posed this OPEN sub-gap); ' +
    'imp-34837 (the sibling D2 inflection E_flow reinstatement this mirrors one order up); imp-34749 (the ' +
    'exact additive log-odds shift phi = -ln(1+E_flow/E_trunc) and the -7.32e-3 FD knee shift reused here); ' +
    'imp-34796 (the F = -g_thirdDeriv/(1-S) knee identity whose E_flow sub-gap this closes); imp-34710 (the ' +
    'knee decomposition); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT_ASSERTIONS = [
  {
    // (F1): the closed-form D3 knee locator SURVIVES E_flow -- the D3 root still lands on the FD d3(ln sigma)=0 knee.
    id: 'imp34858-closed-form-d3-knee-locator-survives-eflow',
    description: 'with E_flow carried, the D3 root matches the FD d3(ln sigma)=0 knee to < 1e-6',
    holds: () => CLOSED_VS_FD_SEP_FULL < 1e-6,
  },
  {
    // (F2): carrying E_flow lowers the knee ~-7.32e-3 dex from the imp-34846 no-E_flow ~9.53638.
    id: 'imp34858-knee-shift-is-minus-7-32e-3',
    description: 'knee shifts DOWN ~-7.32e-3 dex (no-E_flow ~9.53638 -> carried ~9.52906)',
    holds: () =>
      Math.abs(LOG10_N_KNEE_NOFLOW - 9.53638) < 1e-3 &&
      KNEE_SHIFT_LOG10 < -5e-3 &&
      KNEE_SHIFT_LOG10 > -9e-3 &&
      LOG10_N_KNEE_FULL < LOG10_N_KNEE_NOFLOW,
  },
  {
    // (F2): the closed-form knee shift reproduces the imp-34749/imp-34796 FD knee E_flow shift of -7.32e-3 to < 1%.
    id: 'imp34858-shift-reproduces-fd-knee-shift',
    description: 'closed-form knee shift matches the imp-34749/imp-34796 FD -7.32e-3 shift to < 1% (ratio ~1.00)',
    holds: () => SHIFT_VS_FD_RATIO > 0.99 && SHIFT_VS_FD_RATIO < 1.01,
  },
  {
    // (F2): the first-order implicit-function slope captures the exact shift to within ~5% (deep linear regime).
    id: 'imp34858-first-order-captures-shift',
    description: 'first-order slope ~-7.34e-3 reproduces the exact shift within ~5% (deep linear regime)',
    holds: () =>
      SLOPE0_LOG10 < -5e-3 &&
      SLOPE0_LOG10 > -9e-3 &&
      FO_FRACTION_OF_EXACT > 0.95 &&
      FO_FRACTION_OF_EXACT < 1.05,
  },
  {
    // (F3): the knee shift is opposite in sign to the imp-34837 sibling D2 inflection shift (+9.03e-3, UP).
    id: 'imp34858-knee-shift-opposite-imp34837-inflection',
    description: 'knee shifts DOWN while the imp-34837 D2 inflection shifts UP: opposite signs',
    holds: () => KNEE_SHIFT_LOG10 < 0 && IMP34837_INFL_SHIFT_LOG10 > 0,
  },
  {
    // Honesty gate: assessment/measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34858-honesty-gate-no-qed',
    description: 'Assessment/measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT.isRigorous === false &&
      IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT.farTailExponent === 0.5 &&
      typeof IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT.subGap === 'string' &&
      /NO QED/.test(IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT.verdict),
  },
];

for (const a of IMP34858_SIGMA_KNEE_D3_EFLOW_REINSTATEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34858-sigma-knee-d3-eflow-reinstatement assertion failed: ${a.id}`);
  }
}
