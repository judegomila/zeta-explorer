/**
 * @module imp-34694-sigma-exponent-knee-closed-form-location
 *
 * imp-34694 (numerical, frontier-direction): imp-33701 characterized the post-peak sigma(N) =
 * E_coll/E(N) decay-exponent ladder (imp-33582) as an S-shaped approach to the 1/2 asymptote whose
 * ramp acceleration (the second difference of the local exponent) changes sign convex -> concave
 * EXACTLY ONCE -- a single knee. imp-33701 could only place that knee in the coarse whole-decade
 * [1e10,1e11] bracket from six-decade finite-differencing. This module SHARPENS the location two ways:
 * (i) a DIRECT continuous-in-ln-N root-find of the exponent-ramp second derivative p''(ln N) = 0 with
 * a step-refinement error estimate, and (ii) an ANALYTIC closed form for the knee as the crossover
 * (sigma = 1/2) plus a small slowly-varying-v correction.
 *
 * STALE-PREMISE NOTE (honest reconciliation)
 * ------------------------------------------
 * The ticket premise "only bracketed to the [1e10,1e11] decade" is STALE: imp-33721 already relocated
 * the knee to N* ~ 3.38e9 by sub-decade OLS differencing, imp-34111 pinned log10 N* ~ 9.52903 by
 * bisection on a tight grid, and imp-33744/imp-33771 gave a closed form for the sigma VALUE at the
 * knee (sigma_infl = 1/2 - g_prime/(2 g^2)). What is NEW here and was NOT done before: (a) the knee is
 * reproduced by a DIRECT continuous central-difference root-find of p''(ln N) = 0 -- an independent
 * numerical route to the same landmark, not the OLS sub-bracket ladder -- with a Richardson-style
 * step-refinement error bar; and (b) an explicit closed form for the knee LOCATION (not the sigma
 * value) as N_cross times a small factor, sigma* = 1/2 + delta.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33701 / imp-33816 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * Near the knee (N ~ 3.3e9, T0 ~ 1.3e9) E_flow ~ 1e-8 is negligible against E_trunc = E_coll ~ 3e-5,
 * so the analytic route drops it and the direct route keeps it (they agree to the error bar).
 *
 * THE DIRECT ROOT-FIND
 * --------------------
 * With x = ln N, the local decay exponent is p(x) = -d ln sigma / d ln N (imp-3529/imp-33582). The
 * knee is the ramp-acceleration zero p''(x) = 0. Both derivatives are taken by symmetric central
 * differences of the EXACT full-model ln sigma, and the single zero is bracketed by bisection over
 * [ln 1e9, ln 1e11]. Step refinement h = 4e-3 .. 5e-4 pins log10 N* = 9.52906 with a plateau spread
 * ~2e-5 (the h = 5e-4 rung shows the onset of third-difference roundoff amplification). This lands the
 * imp-34111 value (9.52903) to ~3e-5 -- an independent confirmation of the same knee.
 *
 * THE ANALYTIC CLOSED FORM
 * ------------------------
 * Dropping E_flow, sigma = r/(1+r) is logistic in u = ln r = ln(C_C/E_trunc) + (1/2) ln L - x/2, and
 * p(x) = (1 - sigma) v with v(x) = -u'(x) = 1/2 - L'/(2L) (slowly varying, ~0.4773). Differentiating
 * twice gives the exact knee condition
 *     S v^3 (2S - 1) + 3 S v v' + v'' = 0,   S = sigma.
 * To LEADING order (v slowly varying, v', v'' -> 0) this is S = 1/2: the knee coincides with the
 * crossover / halving landmark. The first correction, writing S = 1/2 + delta, is
 *     delta = -(3 v') / (2 v^2) - v'' / v^3,
 * which is NEGATIVE (v increasing), i.e. the knee sits ABOVE the crossover in N (sigma slightly below
 * 1/2). Evaluated at the crossover this gives delta ~ -5.6e-3 (sigma* ~ 0.4944) and log10 N* ~ 9.536.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) THE KNEE IS AT log10 N* = 9.52906 (N* ~ 3.3811e9), NOT THE [1e10,1e11] DECADE. The direct
 *        continuous root-find of p''(ln N) = 0 pins log10 N* = 9.52906 +/- ~2e-5 (step-refinement
 *        plateau), sigma(N*) ~ 0.4959. This reproduces the imp-34111 bisection value 9.52903 to ~3e-5
 *        by a fully independent estimator, closing the imp-33701 coarse whole-decade bracket.
 *   (F2) THE KNEE COINCIDES WITH THE CROSSOVER TO LEADING ORDER. The exact knee condition
 *        S v^3 (2S-1) + 3 S v v' + v'' = 0 reduces at leading order (slowly-varying v) to S = 1/2 --
 *        the imp-33723 crossover N_cross ~ 3.2803e9 (log10 9.51591) and imp-33582 halving ~3.2672e9
 *        (log10 9.51418). The measured knee sits just ABOVE both, by +0.01315 in log10 N (+3.07%).
 *   (F3) THE FIRST-ORDER CORRECTION HAS THE RIGHT SIGN, HALVES THE RESIDUAL, BUT DOES NOT CLOSE IT.
 *        delta = -(3 v')/(2 v^2) - v''/v^3 ~ -5.6e-3 is negative (knee above crossover), correctly
 *        predicting sigma* < 1/2. It moves log10 N* from the leading-order 9.51591 to 9.53646, cutting
 *        the residual to the true 9.52906 from 0.01315 (leading order) to 0.00740 (first order) -- but
 *        OVERSHOOTS by ~56%, so the exact knee still needs the direct root-find. The closed form is a
 *        sign-correct order-of-magnitude locator, not a tight formula.
 *
 * The punchline: the imp-33701 knee is NOT a whole-decade object -- it is a sharp landmark at
 * log10 N* = 9.52906 (N* ~ 3.381e9), reproduced here by an independent continuous root-find, and it is
 * the crossover/halving point (sigma = 1/2) to leading analytic order, displaced ABOVE it by ~3% by a
 * slowly-varying-v correction whose first-order form gets the sign and roughly half the offset.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (the coarse whole-decade [1e10,1e11] bracket this sharpens)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade OLS relocation to N* ~ 3.38e9)
 * @see imp-34111-sigma-inflection-knee-vs-crossover-tightgrid (tight-grid bisection log10 N* ~ 9.52903)
 * @see imp-33744 / imp-33771-inflection-closed-form-vs-d2-zero-crosscheck (closed form for the sigma VALUE at the knee)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (crossover N_cross ~ 3.2803e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (halving landmark ~3.267e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// EXACT full-model sigma in ln-N space (identical sub-terms to imp-33701/imp-33816).
function lnSigmaFull(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // negligible ~1e-8 near the knee
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_TRUNC_PT + E_flow + E_coll));
}

// Local decay exponent p(x) = -d ln sigma / d ln N, and its second derivative p''(x),
// by symmetric central differences of the exact full-model ln sigma (step h).
function pLocal(x, h) {
  return -(lnSigmaFull(x + h) - lnSigmaFull(x - h)) / (2 * h);
}
function pSecond(x, h) {
  return (pLocal(x + h, h) - 2 * pLocal(x, h) + pLocal(x - h, h)) / (h * h);
}

// Bisection for the single sign change of f over [a,b].
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

// (F1) DIRECT continuous root-find of p''(ln N) = 0, with a step-refinement error estimate.
const STEP_REFINE = [4e-3, 2e-3, 1e-3, 5e-4].map((h) => {
  const x = bisect((xx) => pSecond(xx, h), LO, HI);
  return { h, log10Nstar: +(x / Math.LN10).toFixed(7) };
});
const X_STAR = bisect((xx) => pSecond(xx, 1e-3), LO, HI); // reference rung h = 1e-3
const LOG10_N_STAR = X_STAR / Math.LN10;
const N_STAR = Math.exp(X_STAR);
const SIGMA_AT_STAR = Math.exp(lnSigmaFull(X_STAR));
// error bar = spread of the stable rungs (h = 4e-3, 2e-3, 1e-3), excluding the roundoff-onset rung.
const STABLE = STEP_REFINE.slice(0, 3).map((r) => r.log10Nstar);
const ERR_LOG10 = Math.max(...STABLE) - Math.min(...STABLE);

// (F2) Crossover N_cross: E_coll = E_trunc, i.e. r = 1, fixed point N = A^2 log T0(N) (imp-33723).
let N_CROSS = 3e9;
for (let i = 0; i < 200; i++) {
  N_CROSS = A * A * Math.log(effectiveHeightForN(N_CROSS));
}
const LOG10_N_CROSS = Math.log10(N_CROSS);
// Halving landmark: full-model sigma = 1/2 (imp-33582), slightly below crossover (E_flow shift).
const X_HALF = bisect((xx) => lnSigmaFull(xx) - Math.log(0.5), LO, HI);
const LOG10_N_HALF = X_HALF / Math.LN10;

const OFFSET_LOG10 = LOG10_N_STAR - LOG10_N_CROSS; // knee above crossover
const OFFSET_PCT = (N_STAR / N_CROSS - 1) * 100;

// (F3) ANALYTIC closed form: drop E_flow, sigma logistic in u = ln r; v = -u'; delta = -(3v')/(2v^2) - v''/v^3.
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, no E_flow
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
const X_CROSS = bisect((xx) => uOf(xx), LO, HI); // u = 0 <=> r = 1 <=> crossover (no E_flow)
const V = -d1(uOf, X_CROSS); // v = -u'
const V_P = -d2(uOf, X_CROSS); // v'
const V_PP = -d3(uOf, X_CROSS); // v''
const DELTA = -(3 * V_P) / (2 * V * V) - V_PP / (V * V * V); // sigma* = 1/2 + delta
const SIGMA_STAR_CF = 0.5 + DELTA;
const U_STAR_CF = Math.log(SIGMA_STAR_CF / (1 - SIGMA_STAR_CF));
const X_STAR_CF = bisect((xx) => uOf(xx) - U_STAR_CF, LO, HI); // invert logistic sigma to N
const LOG10_N_STAR_CF = X_STAR_CF / Math.LN10;
const RESIDUAL_LEADING = Math.abs(LOG10_N_CROSS - LOG10_N_STAR); // leading order = crossover
const RESIDUAL_FIRST = Math.abs(LOG10_N_STAR_CF - LOG10_N_STAR); // first-order correction

export const IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION = {
  id: 'imp-34694',
  proofSection: 'S-frontier',
  question:
    'Sharpen the imp-33701 single sigmoid knee -- the convex->concave second-difference sign change ' +
    'of the sigma(N) post-peak decay-exponent ladder -- from the coarse [1e10,1e11] whole-decade ' +
    'bracket: locate the exponent-ramp acceleration zero p_secondDeriv(ln N) = 0 by a direct ' +
    'continuous root-find with an error estimate, assess a closed-form location, and cross-check ' +
    'against the halving landmark (~3.27e9) and the crossover (~3.28e9). Measurement/derivation only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the ln N location of p_secondDeriv(ln N) = 0 for p(N) = -d ln sigma/d ln N, via direct ' +
    'central-difference root-find with step-refinement error bar; and the analytic knee condition ' +
    'S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv = 0 with leading order S = 1/2 plus a first correction',
  directRootFind: {
    log10Nstar: +LOG10_N_STAR.toFixed(6), // ~9.52906
    Nstar: +N_STAR.toExponential(4), // ~3.3811e9
    sigmaAtKnee: +SIGMA_AT_STAR.toFixed(5), // ~0.49593
    errorLog10FromStepRefine: +ERR_LOG10.toExponential(2), // ~2e-5 plateau spread
    stepRefinement: STEP_REFINE, // h = 4e-3..5e-4; last rung shows roundoff onset
    matchesImp34111Log10: 9.52903, // imp-34111 tight-grid bisection value (independent estimator)
  },
  crossoverAndHalving: {
    log10Ncross: +LOG10_N_CROSS.toFixed(6), // ~9.51591 (imp-33723)
    Ncross: +N_CROSS.toExponential(6), // ~3.280294e9
    log10Nhalf: +LOG10_N_HALF.toFixed(6), // ~9.51418 (imp-33582 halving, full model)
    kneeOffsetAboveCrossoverLog10: +OFFSET_LOG10.toFixed(5), // ~+0.01315
    kneeOffsetAboveCrossoverPct: +OFFSET_PCT.toFixed(2), // ~+3.07%
  },
  analyticClosedForm: {
    exactKneeCondition: 'S v^3 (2S - 1) + 3 S v v_prime + v_secondDeriv = 0,  S = sigma,  v = -u_prime = 1/2 - L_prime/(2 L)',
    leadingOrder: 'v slowly varying => S = 1/2: the knee coincides with the crossover/halving',
    firstCorrection: 'S = 1/2 + delta,  delta = -(3 v_prime)/(2 v^2) - v_secondDeriv/v^3',
    v_at_crossover: +V.toFixed(6), // ~0.477288
    v_prime_at_crossover: +V_P.toExponential(3), // ~9.69e-4
    v_secondDeriv_at_crossover: +V_PP.toExponential(3), // ~-7.99e-5
    delta: +DELTA.toExponential(4), // ~-5.64e-3 (negative => knee above crossover)
    sigmaStarClosedForm: +SIGMA_STAR_CF.toFixed(5), // ~0.49436
    log10NstarClosedForm: +LOG10_N_STAR_CF.toFixed(6), // ~9.53646
    residualLeadingOrderLog10: +RESIDUAL_LEADING.toFixed(5), // ~0.01315 (crossover vs true knee)
    residualFirstOrderLog10: +RESIDUAL_FIRST.toFixed(5), // ~0.00740 (halved, but overshoots)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_direct_rootfind_pins_the_knee:
      'The direct continuous root-find of p_secondDeriv(ln N) = 0 (central differences of the exact ' +
      'full-model ln sigma) pins log10 N* = 9.52906 (N* ~ 3.3811e9, sigma ~ 0.4959) with a ' +
      'step-refinement plateau spread ~2e-5. This reproduces the imp-34111 tight-grid bisection value ' +
      '9.52903 to ~3e-5 by an INDEPENDENT estimator, closing the imp-33701 whole-decade [1e10,1e11] ' +
      'bracket to a sharp landmark.',
    F2_knee_is_crossover_to_leading_order:
      'The exact knee condition S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv = 0 reduces at leading ' +
      'order (slowly-varying v) to S = 1/2 -- the crossover N_cross ~ 3.2803e9 (log10 9.51591, ' +
      'imp-33723) and halving ~3.2672e9 (log10 9.51418, imp-33582). The measured knee sits just ABOVE ' +
      'both, by +0.01315 in log10 N (+3.07%).',
    F3_first_correction_right_sign_halves_residual:
      'The first correction delta = -(3 v_prime)/(2 v^2) - v_secondDeriv/v^3 ~ -5.6e-3 is negative ' +
      '(knee above crossover), correctly giving sigma* < 1/2. It moves log10 N* from 9.51591 (leading ' +
      'order) to 9.53646, cutting the residual to the true 9.52906 from 0.01315 to 0.00740 -- but ' +
      'OVERSHOOTS by ~56%, so the exact knee still needs the direct root-find. The closed form is a ' +
      'sign-correct order-of-magnitude locator, not a tight formula.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). The imp-33701 single sigmoid knee ' +
    '(the convex->concave second-difference sign change of the sigma(N) post-peak decay-exponent ' +
    'ramp), left in the coarse whole-decade [1e10,1e11] bracket, is pinned by a DIRECT continuous ' +
    'root-find of p_secondDeriv(ln N) = 0 at log10 N* = 9.52906 (N* ~ 3.3811e9), reproducing the ' +
    'imp-34111 tight-grid value 9.52903 to ~3e-5 with a step-refinement error ~2e-5. Analytically the ' +
    'knee condition S v^3 (2S-1) + 3 S v v_prime + v_secondDeriv = 0 gives S = 1/2 to leading order -- ' +
    'the crossover (imp-33723, ~3.2803e9) and halving (imp-33582, ~3.2672e9) -- with the knee ' +
    'displaced ABOVE by +3.07%; the first-order correction delta = -(3 v_prime)/(2 v^2) - ' +
    'v_secondDeriv/v^3 ~ -5.6e-3 has the right sign and halves the leading-order residual (0.01315 -> ' +
    '0.00740 in log10 N) but overshoots by ~56%, so the exact knee is not a tight closed form. ' +
    'Sub-gap: a higher-order or self-consistent expansion of delta is left OPEN. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'A tight closed form for the knee is OPEN: the first-order slowly-varying-v correction delta = ' +
    '-(3 v_prime)/(2 v^2) - v_secondDeriv/v^3 recovers the sign and ~halves the residual but overshoots ' +
    'the true offset by ~56%. A higher-order or self-consistent (delta-evaluated-at-the-knee, not the ' +
    'crossover) expansion would close the remaining ~0.0074 in log10 N.',
  citation:
    'imp-33701 (coarse whole-decade [1e10,1e11] knee bracket this sharpens); imp-33721 (sub-decade ' +
    'relocation ~3.38e9); imp-34111 (tight-grid bisection log10 N* ~ 9.52903); imp-33744/imp-33771 ' +
    '(closed form for the sigma VALUE at the knee); imp-33723 (crossover N_cross ~ 3.2803e9); ' +
    'imp-33582 (halving ~3.267e9); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION_ASSERTIONS = [
  {
    // (F1): the direct continuous root-find lands the knee at log10 N* ~ 9.529, reproducing the
    // imp-34111 tight-grid bisection value to a few 1e-5, with a small step-refinement error bar.
    id: 'imp34694-direct-rootfind-matches-imp34111',
    description: 'p_secondDeriv(ln N)=0 root-find lands log10 N* ~ 9.529, matching imp-34111 (9.52903) to <1e-3',
    holds: () =>
      LOG10_N_STAR > 9.52 &&
      LOG10_N_STAR < 9.54 &&
      Math.abs(LOG10_N_STAR - 9.52903) < 1e-3 &&
      ERR_LOG10 < 5e-4,
  },
  {
    // (F2): the knee sits strictly ABOVE the crossover and the halving landmark, by a small (~3%)
    // offset -- confirming leading-order coincidence (S=1/2) plus a positive displacement in N.
    id: 'imp34694-knee-above-crossover-and-halving',
    description: 'knee log10 N* > crossover > halving, offset above crossover ~+0.013 (~+3%)',
    holds: () =>
      LOG10_N_STAR > LOG10_N_CROSS &&
      LOG10_N_CROSS > LOG10_N_HALF &&
      OFFSET_LOG10 > 0.008 &&
      OFFSET_LOG10 < 0.02 &&
      OFFSET_PCT > 2 &&
      OFFSET_PCT < 4,
  },
  {
    // crossover reproduces the imp-33723 closed-form fixed point ~3.2803e9.
    id: 'imp34694-crossover-reproduces-imp33723',
    description: 'crossover fixed point N = A^2 log T0(N) reproduces imp-33723 ~3.2803e9',
    holds: () => Math.abs(N_CROSS - 3.280294e9) / 3.280294e9 < 1e-3,
  },
  {
    // (F3): the closed-form correction delta is NEGATIVE (knee above crossover), and the first-order
    // location halves the leading-order residual (crossover vs true knee) but overshoots (does not
    // beat the direct root-find) -- an honest sign-correct order-of-magnitude locator.
    id: 'imp34694-closed-form-right-sign-halves-residual',
    description: 'delta<0 (sigma*<1/2); first-order residual < leading-order residual but > 0 (overshoot, not tight)',
    holds: () =>
      DELTA < 0 &&
      SIGMA_STAR_CF < 0.5 &&
      RESIDUAL_FIRST < RESIDUAL_LEADING &&
      RESIDUAL_FIRST > 1e-3 &&
      LOG10_N_STAR_CF > LOG10_N_STAR, // first-order overshoots above the true knee
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), OPEN sub-gap,
    // no QED, no refereed bound is changed.
    id: 'imp34694-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, OPEN sub-gap, no QED, no refereed bound is changed',
    holds: () =>
      IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION.isRigorous === false &&
      IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION.farTailExponent === 0.5 &&
      typeof IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION.subGap === 'string' &&
      /NO QED/.test(IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION.verdict) &&
      /refereed bound is changed/i.test(IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION.verdict),
  },
];

for (const a of IMP34694_SIGMA_EXPONENT_KNEE_CLOSED_FORM_LOCATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34694-sigma-exponent-knee-closed-form-location assertion failed: ${a.id}`);
  }
}
