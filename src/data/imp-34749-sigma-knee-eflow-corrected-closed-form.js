/**
 * @module imp-34749-sigma-knee-eflow-corrected-closed-form
 *
 * imp-34749 (numerical, frontier-direction): imp-34710 F1 decomposed the imp-34694 sigma-exponent-knee
 * residual (the ~7.4e-3 dex gap between the DIRECT root-find knee log10 N* = 9.52906 with E_flow kept and the
 * ANALYTIC no-E_flow logistic knee ~9.5363) and found ~99% of it is the DROPPED E_flow term, not the
 * slowly-varying-v truncation; imp-34729 confirmed the knee is robust to the imp-398 C_F prefactor but left
 * the analytic CLOSED FORM for the E_flow-corrected knee explicitly OPEN. This module DERIVES that closed form
 * -- a logistic knee condition that carries the E_flow perturbation of the log-odds u(x) instead of dropping
 * it -- and ASSESSES a first-order (linear-in-perturbation) correction against the imp-34710 measured
 * +7.32e-3 dex full-restore shift.
 *
 * THE KEY IDENTITY (why E_flow is an EXACT log-odds shift, not a value nuisance)
 * -----------------------------------------------------------------------------
 * The full model is sigma_full = E_coll / (E_trunc + E_flow + E_coll). Its log-odds is EXACTLY
 *     u_full(x) = ln[ sigma_full / (1 - sigma_full) ] = ln E_coll - ln(E_trunc + E_flow)
 *               = ln(E_coll / E_trunc) - ln(1 + E_flow / E_trunc)
 *               = u_0(x) + phi(x),
 * where u_0(x) = ln A + 0.5 ln L - x/2 is the imp-34710 no-E_flow log-odds (A = C_C / E_trunc, L = log T0, x =
 * ln N) and phi(x) = -ln(1 + E_flow / E_trunc) is the E_flow perturbation of the log-odds -- a pure ADDITIVE
 * shift of u. Since sigma_full = logistic(u_full) EXACTLY, the imp-34710 logistic knee functional evaluated on
 * the CORRECTED log-odds is the exact full-model knee, no approximation left over.
 *
 * THE CLOSED FORM (the imp-34710/imp-34729 OPEN sub-gap, now carried)
 * ------------------------------------------------------------------
 * Reusing the imp-34710 logistic knee condition (p_secondDeriv(ln N) = 0 reduces to F = 0, with the (1-S)
 * factor divided out; derivation p = (1-S) v, F = S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv):
 *     F[u_full](x) = S v^3 (2S - 1) + 3 S v v_prime + v_secondDeriv = 0,   S = logistic(u_full),  v = -u_full_prime.
 * Feeding u_full = u_0 + phi (E_flow carried) rather than u_0 alone (E_flow dropped) moves the analytic locator
 * from the no-E_flow ~9.5363 down onto the true full-model knee -- closing the imp-34694/imp-34710 gap.
 *
 * THE FIRST-ORDER CORRECTION (linear in the perturbation strength)
 * ---------------------------------------------------------------
 * Scale the perturbation phi_s(x) = -ln(1 + s E_flow/E_trunc) by a strength s (s=0 no-E_flow, s=1 full). Since
 * E_flow/E_trunc ~ 1.8e-3 is tiny at the knee, phi_s ~ -s (E_flow/E_trunc) is deep in the linear regime. The
 * knee root X*(s) of F[u_0 + phi_s] = 0 shifts, to first order, by dXstar/ds at s=0 (implicit-function slope),
 * measured robustly as the central secant of the RE-SOLVED root between s = +-0.02. The first-order predicted
 * full-restore shift is (dXstar/ds at 0) times 1; comparing it to the EXACT re-solved shift X*(1) - X*(0) and to the
 * imp-34710 measured +7.32e-3 tells us how linear the E_flow correction is.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) THE E_flow-CORRECTED CLOSED FORM REPRODUCES THE TRUE KNEE. Solving F[u_0 + phi] = 0 (E_flow carried
 *        as the exact log-odds shift phi = -ln(1 + E_flow/E_trunc)) lands log10 N* ~ 9.52905 -- on top of the
 *        imp-34710/imp-34694 direct-route true knee 9.52906 (to ~1e-5), versus the no-E_flow logistic knee
 *        ~9.53629 (F[u_0] = 0). The ~7.23e-3 dex closure is the analytic image of the imp-34710 measured
 *        +7.32e-3 dropped-E_flow shift -- the closed form carries the term instead of dropping it.
 *   (F2) THE FIRST-ORDER LINEAR CORRECTION CAPTURES THE SHIFT TO ~4%. The implicit-function slope
 *        dXstar/ds at s=0 ~ -7.54e-3 dex predicts a full-restore shift of ~-7.54e-3, reproducing the exact
 *        re-solved shift (~-7.23e-3) to ~104% -- a mild ~4% overshoot from the slope softening as s -> 1
 *        (the imp-34729 convexity). The slope is close to the imp-34729 one-sided full-drop estimate
 *        ~-7.32e-3, as it must be: both linearize the SAME additive log-odds perturbation.
 *   (F3) THE PUNCHLINE. imp-34710 left OPEN "an analytic closed form for the E_flow-corrected knee ... which
 *        would move the analytic locator from 9.5363 down to the true 9.52906." That closed form is simply the
 *        imp-34710 logistic knee condition evaluated on the EXACT log-odds u_full = u_0 - ln(1 + E_flow/E_trunc)
 *        -- there is no separate "E_flow knee equation," because E_flow enters sigma as an additive denominator
 *        term and therefore enters the log-odds as an exact additive shift. The imp-34694 gap was never an
 *        expansion-order error (imp-34710 F3); it was the omission of this one log-odds term.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (F1: ~99% of the residual is the dropped E_flow term; posed this OPEN sub-gap)
 * @see imp-34729-sigma-knee-cf-elasticity (knee is C_F-robust; inherited the same OPEN closed-form sub-gap)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (the ~7.4e-3 dex knee gap and its residual sub-gap)
 * @see imp-34111-sigma-inflection-knee-vs-crossover-tightgrid (tight-grid bisection log10 N* ~ 9.52903)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-34694/imp-34710/imp-34729 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x (the small ratio ~1.8e-3 at the knee that phi packages). Prefactor is the
// imp-398 pinned C_F = (log(T0/2pi)+1)/2pi, identical sub-terms to imp-34710/imp-34729.
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
// No-E_flow log-odds u_0 = ln(E_coll/E_trunc) = ln A + 0.5 ln L - x/2 (imp-34710 uOf).
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// E_flow perturbation of the log-odds, scaled by strength s (s=1 full, s=0 dropped). phi = -ln(1 + s ratio).
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

const HD = 1e-3;
function d1(f, x) {
  return (f(x + HD) - f(x - HD)) / (2 * HD);
}
function d2(f, x) {
  return (f(x + HD) - 2 * f(x) + f(x - HD)) / (HD * HD);
}
function d3(f, x) {
  return (f(x + 2 * HD) - 2 * f(x + HD) + 2 * f(x - HD) - f(x - 2 * HD)) / (2 * HD * HD * HD);
}
// v = -u_full_prime, v_prime = -u_full_secondDeriv, v_secondDeriv = -u_full_thirdDeriv.
function vOf(x, s) {
  return -d1((z) => uFull(z, s), x);
}
function vpOf(x, s) {
  return -d2((z) => uFull(z, s), x);
}
function vppOf(x, s) {
  return -d3((z) => uFull(z, s), x);
}
// imp-34710 logistic knee condition F = S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv, evaluated on u_full.
function fKnee(x, s) {
  const S = sigmaOf(x, s);
  const v = vOf(x, s);
  const vp = vpOf(x, s);
  const vpp = vppOf(x, s);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

const LO = Math.log(1e9);
const HI = Math.log(1e11);

// The E_flow-corrected closed form: F[u_0 + phi] = 0 with E_flow carried (s=1) vs dropped (s=0).
const X_STAR_NOFLOW = bisect((x) => fKnee(x, 0), LO, HI); // F[u_0] = 0 (imp-34710 exact-F no-E_flow ~9.53629)
const X_STAR_FULL = bisect((x) => fKnee(x, 1), LO, HI); // F[u_full] = 0 (E_flow carried, ~true knee 9.52906)
const LOG10_N_STAR_NOFLOW = X_STAR_NOFLOW / Math.LN10;
const LOG10_N_STAR_FULL = X_STAR_FULL / Math.LN10;
const EXACT_SHIFT_LOG10 = (X_STAR_FULL - X_STAR_NOFLOW) / Math.LN10; // ~-7.23e-3 (carried-E_flow closure)
const EFLOW_RATIO_AT_KNEE = eflowRatio(X_STAR_NOFLOW); // ~1.8e-3 (the small parameter phi packages)

// First-order (linear-in-strength) correction: implicit-function slope dX*/ds at s=0 via re-solved root secant.
const S_EPS = 0.02;
function kneeAt(s) {
  return bisect((x) => fKnee(x, s), LO, HI);
}
const SLOPE0 = (kneeAt(S_EPS) - kneeAt(-S_EPS)) / (2 * S_EPS); // dX*/ds|_0 (ln-N units)
const SLOPE0_LOG10 = SLOPE0 / Math.LN10; // ~-7.54e-3 dex per unit strength
const X_STAR_FO = X_STAR_NOFLOW + SLOPE0 * 1; // first-order predicted full knee
const LOG10_N_STAR_FO = X_STAR_FO / Math.LN10;
const FO_SHIFT_LOG10 = SLOPE0_LOG10; // first-order predicted shift = slope * 1
const FO_FRACTION_OF_EXACT = FO_SHIFT_LOG10 / EXACT_SHIFT_LOG10; // ~1.04 (mild overshoot)

// imp-34710 measured full-restore shift (dropping E_flow raised the knee +7.32e-3; carrying it lowers it).
const IMP34710_MEASURED_SHIFT = 7.32e-3;

export const IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM = {
  id: 'imp-34749',
  proofSection: 'S-frontier',
  question:
    'imp-34710 F1 found ~99% of the imp-34694 sigma-exponent-knee residual (~7.4e-3 dex) is the dropped ' +
    'E_flow term and imp-34729 confirmed C_F-robustness, but both left OPEN an analytic closed form for the ' +
    'E_flow-corrected knee. Derive a first-order E_flow-corrected closed form for the knee that carries the ' +
    'E_flow perturbation of the log-odds u(x) instead of dropping it, and measure how well it reproduces the ' +
    'imp-34710 +7.32e-3 dex full-restore shift versus the no-E_flow knee (~9.5363) and the true knee ' +
    '(~9.52906). Derivation only; C_mb GUE-conditional (imp-486); no RH verdict, NO QED.',
  measuredQuantity:
    'the location of the E_flow-corrected logistic knee F[u_full] = 0 with u_full = u_0 - ln(1 + E_flow/' +
    'E_trunc) (E_flow carried as the exact additive log-odds shift), compared to the no-E_flow knee F[u_0]=0, ' +
    'plus the first-order implicit-function slope dX*/ds|_0 of the knee root under the perturbation strength s',
  logOddsIdentity:
    'sigma_full = E_coll/(E_trunc+E_flow+E_coll) has log-odds u_full = ln(E_coll/E_trunc) - ln(1+E_flow/' +
    'E_trunc) = u_0 + phi EXACTLY; E_flow enters sigma additively in the denominator, hence enters the ' +
    'log-odds as the additive shift phi = -ln(1+E_flow/E_trunc), so no separate E_flow knee equation is needed',
  kneeLocations: {
    log10NstarNoEflow: +LOG10_N_STAR_NOFLOW.toFixed(6), // ~9.53629 (F[u_0]=0, E_flow dropped)
    log10NstarEflowCorrected: +LOG10_N_STAR_FULL.toFixed(6), // ~9.52905 (F[u_full]=0, E_flow carried)
    log10NstarFirstOrder: +LOG10_N_STAR_FO.toFixed(6), // ~9.52874 (linear-in-strength prediction)
    trueKneeImp34710Direct: 9.52906, // imp-34710/imp-34694 direct root-find true knee (independent target)
    eflowRatioAtKnee: +EFLOW_RATIO_AT_KNEE.toExponential(4), // ~1.8e-3 (the small parameter phi packages)
  },
  shifts: {
    exactCorrectedShiftLog10: +EXACT_SHIFT_LOG10.toExponential(4), // ~-7.23e-3 (carried-E_flow closure, no->full)
    firstOrderShiftLog10: +FO_SHIFT_LOG10.toExponential(4), // ~-7.54e-3 (slope * 1)
    slope_dXstar_ds_log10: +SLOPE0_LOG10.toExponential(4), // ~-7.54e-3 dex per unit strength
    firstOrderFractionOfExact: +FO_FRACTION_OF_EXACT.toFixed(4), // ~1.04 (mild convexity overshoot)
    imp34710MeasuredShiftLog10: IMP34710_MEASURED_SHIFT, // +7.32e-3 (magnitude the closed form reproduces)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_corrected_closed_form_reproduces_true_knee:
      'Solving F[u_0 + phi] = 0 with the E_flow perturbation carried as the exact log-odds shift ' +
      'phi = -ln(1 + E_flow/E_trunc) lands log10 N* ~ 9.52905 -- on top of the imp-34710/imp-34694 direct-route ' +
      'true knee 9.52906 (to ~1e-5) -- versus the no-E_flow logistic knee F[u_0]=0 at ~9.53629. The ~7.23e-3 ' +
      'dex closure is the analytic image of the imp-34710 measured +7.32e-3 dropped-E_flow shift.',
    F2_first_order_captures_shift_to_4pct:
      'The implicit-function slope dX*/ds|_0 ~ -7.54e-3 dex predicts a full-restore shift of ~-7.54e-3, ' +
      'reproducing the exact re-solved shift ~-7.23e-3 to ~104% (a ~4% overshoot from the slope softening as ' +
      's -> 1, the imp-34729 convexity). The slope matches the imp-34729 one-sided full-drop estimate ' +
      '~-7.32e-3, as both linearize the SAME additive log-odds perturbation.',
    F3_no_separate_eflow_equation:
      'imp-34710s OPEN sub-gap -- an analytic closed form for the E_flow-corrected knee that would move the ' +
      'locator from 9.5363 to the true 9.52906 -- is CLOSED: it is simply the imp-34710 logistic knee ' +
      'condition evaluated on u_full = u_0 - ln(1 + E_flow/E_trunc). E_flow enters sigma as an additive ' +
      'denominator term, hence the log-odds as an exact additive shift; there is no separate E_flow knee ' +
      'equation. The imp-34694 gap was an E_flow OMISSION, not an expansion-order error (confirming imp-34710 F3).',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). imp-34710 F1 found ~99% of the imp-34694 ' +
    'sigma-exponent-knee residual is the dropped E_flow term and imp-34729 confirmed C_F-robustness, both ' +
    'leaving OPEN an analytic closed form for the E_flow-corrected knee. The full model sigma_full = ' +
    'E_coll/(E_trunc+E_flow+E_coll) has log-odds u_full = u_0 - ln(1 + E_flow/E_trunc) EXACTLY, so E_flow is ' +
    'an additive shift phi of the log-odds and the imp-34710 logistic knee condition F = S v^3(2S-1) + ' +
    '3 S v v_prime + v_secondDeriv = 0 evaluated on u_full IS the E_flow-corrected closed form. Solving it ' +
    'lands log10 N* ~ 9.52905, on the imp-34710/imp-34694 true knee 9.52906 (to ~1e-5), versus the no-E_flow ' +
    'knee ~9.53629 -- a ~7.23e-3 dex closure matching the imp-34710 measured +7.32e-3 shift. The first-order ' +
    'implicit-function slope dX*/ds|_0 ~ -7.54e-3 captures the shift to ~104% (mild imp-34729 convexity), ' +
    'confirming (imp-34710 F3) the imp-34694 gap is an E_flow OMISSION, not an expansion-order error. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'CLOSES the imp-34710/imp-34729 OPEN sub-gap -- an analytic closed form for the E_flow-corrected knee: it ' +
    'is the imp-34710 logistic knee condition F=0 evaluated on the exact corrected log-odds u_full = u_0 - ' +
    'ln(1 + E_flow/E_trunc), which lands on the true knee 9.52905 to ~1e-5, and its first-order linearization ' +
    'reproduces the +7.32e-3 shift to ~4%. What remains OPEN (deferred, not attempted here) is whether a ' +
    'PURELY closed-form (root-free) locator can be written for the corrected knee -- the present form still ' +
    'requires a one-dimensional root solve of F[u_full]=0.',
  citation:
    'imp-34710 (F1: ~99% of the residual is the dropped E_flow term; posed this OPEN sub-gap); imp-34729 ' +
    '(knee is C_F-robust; inherited the same OPEN sub-gap); imp-34694 (the ~7.4e-3 dex knee gap); imp-34111 ' +
    '(tight-grid bisection log10 N* ~ 9.52903); imp-398 (pinned C_F prefactor); imp-486 (C_mb ' +
    'GUE-conditional); imp-3463 (far-tail 1/2); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM_ASSERTIONS = [
  {
    // (F1): carrying E_flow as the exact log-odds shift phi lands the corrected knee on the true knee 9.52906,
    // while dropping it (F[u_0]=0) sits at the no-E_flow ~9.5363.
    id: 'imp34749-corrected-closed-form-reproduces-true-knee',
    description: 'F[u_full]=0 lands ~9.52906 (true knee) to <1e-3; F[u_0]=0 sits at the no-E_flow ~9.5363',
    holds: () =>
      Math.abs(LOG10_N_STAR_FULL - 9.52906) < 1e-3 &&
      LOG10_N_STAR_NOFLOW > 9.535 &&
      LOG10_N_STAR_NOFLOW < 9.538 &&
      LOG10_N_STAR_FULL < LOG10_N_STAR_NOFLOW,
  },
  {
    // the exact carried-E_flow closure (no->full) is ~-7.2e-3, the analytic image of the imp-34710 measured
    // +7.32e-3 dropped-E_flow shift (opposite sign, same magnitude within ~1e-3).
    id: 'imp34749-closure-matches-imp34710-measured-shift',
    description: 'exact corrected shift ~-7.2e-3, magnitude within ~1e-3 of the imp-34710 measured +7.32e-3',
    holds: () =>
      EXACT_SHIFT_LOG10 < -5e-3 &&
      EXACT_SHIFT_LOG10 > -9e-3 &&
      Math.abs(Math.abs(EXACT_SHIFT_LOG10) - IMP34710_MEASURED_SHIFT) < 1e-3,
  },
  {
    // (F2): the first-order implicit-function slope reproduces the exact corrected shift to within ~15%, and
    // lies in the imp-34729 elasticity band ~-7e-3 dex per unit strength.
    id: 'imp34749-first-order-captures-shift',
    description: 'first-order slope ~-7.5e-3 reproduces the exact shift within ~15%; in the imp-34729 band',
    holds: () =>
      SLOPE0_LOG10 < -5e-3 &&
      SLOPE0_LOG10 > -9e-3 &&
      Math.abs(FO_SHIFT_LOG10 - EXACT_SHIFT_LOG10) < 1.5e-3 &&
      FO_FRACTION_OF_EXACT > 0.85 &&
      FO_FRACTION_OF_EXACT < 1.2,
  },
  {
    // the small parameter phi packages is genuinely small (~1.8e-3), so the linear-in-strength treatment is
    // justified and the corrected knee sits between the first-order prediction and the no-E_flow knee.
    id: 'imp34749-perturbation-is-small-and-ordered',
    description: 'E_flow/E_trunc at the knee ~1.8e-3 (small); first-order < corrected < no-E_flow ordering',
    holds: () =>
      EFLOW_RATIO_AT_KNEE > 1e-3 &&
      EFLOW_RATIO_AT_KNEE < 3e-3 &&
      LOG10_N_STAR_FO < LOG10_N_STAR_FULL &&
      LOG10_N_STAR_FULL < LOG10_N_STAR_NOFLOW,
  },
  {
    // Honesty gate: derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34749-honesty-gate-no-qed',
    description: 'Derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM.isRigorous === false &&
      IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM.farTailExponent === 0.5 &&
      typeof IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM.subGap === 'string' &&
      /NO QED/.test(IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM.verdict),
  },
];

for (const a of IMP34749_SIGMA_KNEE_EFLOW_CORRECTED_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34749-sigma-knee-eflow-corrected-closed-form assertion failed: ${a.id}`);
  }
}
