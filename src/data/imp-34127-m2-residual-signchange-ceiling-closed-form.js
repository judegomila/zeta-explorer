/**
 * imp-34127 -- CLOSED-FORM derivation of the imp-34023 M2-residual sign-change
 * ceiling kEnd* ~ 21.281 from the pEcoll = pSigma cancellation condition.
 *
 * imp-34023 located the surrogate ceiling kEnd* ~ 21.281 by BISECTION only, where the
 * imp-33773 M2 residual resid = pEcoll*(1 - sigma) - pSigma crosses zero, attributing it
 * to catastrophic cancellation as pEcoll and pSigma both converge to 0.5 (sigma -> 0).
 * This module derives kEnd* in closed form and identifies WHICH sub-leading term sets it.
 *
 * THE KEY ALGEBRAIC FACT: THE CONTINUOUS RESIDUAL IS IDENTICALLY ZERO.
 *   With E_flow negligible at large N (E_flow/E_N ~ 5e-15 at the crossing), E_N ~ E_TRUNC + E_coll,
 *   so sigma = E_coll/E_N = g/(1 + g) with g = E_coll/E_TRUNC. Then
 *       -log sigma = -log g + log(1 + g),
 *   and with e = -d log E_coll/dx = -d log g/dx (x = ln N) the TRUE sigma exponent is
 *       pSigma_cont = -d log sigma/dx = e/(1 + g) = e*(1 - sigma).
 *   Substituting back, the continuous residual
 *       resid_cont = e*(1 - sigma) - pSigma_cont = e*(1 - sigma) - e*(1 - sigma) = 0  EXACTLY.
 *   So there is NO analytic ceiling: to leading (and to ALL continuous) order the residual
 *   cancels identically. The bisected kEnd* ~ 21.281 is NOT a feature of the component model --
 *   it is a pure ESTIMATOR-DISCRETIZATION artifact.
 *
 * WHICH SUB-LEADING TERM SETS THE CROSSING.
 *   pEcoll is a 2-POINT endpoint secant of -log E_coll over the decade [10^k, 10^(k+1)];
 *   pSigma is a 5-POINT OLS slope of -log sigma over the same decade. Both are centred at the
 *   window midpoint k+1/2, but they carry DIFFERENT cubic biases. For a smooth f over a window of
 *   width D = ln 10 (offsets t about the centre), the 2-point secant slope = f'(centre) + f'''*D^2/24,
 *   while the 5-point evenly-spaced OLS slope = f'(centre) + f'''*(Sum t^4)/(6 Sum t^2) with
 *   Sum t^4 / Sum t^2 = 17 D^2/480, i.e. bias 17 D^2/480. The residual therefore reduces to
 *       resid ~ e*(sigma_mid - sigma_hi)        [the sigma-drag: OLS averages sigma over the decade
 *                                                 whereas the pEcoll term multiplies sigma_hi]
 *             + e''*(D^2/24 - 17 D^2/480)        [the net cubic-bias mismatch on -log E_coll]
 *             + 17 e^3 sigma D^2/480             [the OLS cubic bias on the log(1+g) piece],
 *   where D^2/24 - 17 D^2/480 = D^2/160 EXACTLY. Setting resid = 0 gives the closed-form crossover
 *       sigma* = (-e'' * D^2/160) / ( e^2 * D/2 + 17 e^3 D^2/480 ),
 *   which is inverted through the sigma(N) far-tail law sigma ~ (C_C/E_TRUNC) sqrt(L/N) to give
 *   the crossover log T0, hence N, hence kEnd*.
 *
 * THE VERDICT.
 *   The closed form lands at kEnd* ~ 21.00, a residual of ~ -0.28 below the bisected 21.281.
 *   The SUB-LEADING TERM that sets the crossing is e'' -- the SECOND derivative of the E_coll local
 *   exponent, i.e. the slow log-T0 running curvature -- balanced against the sigma-drag e^2 sigma D/2,
 *   modulated by the net OLS-vs-2pt cubic-bias coefficient D^2/160. The residual sign change is thus
 *   a genuine (but purely discretization-driven) artifact: the continuous residual is exactly zero,
 *   and the ceiling exists only because the two exponents are estimated by DIFFERENT finite operators.
 *   The remaining ~0.28 gap between the closed form (21.00) and the bisection (21.281) is the
 *   O((eD)^2) window-width correction, since the decade width D = ln 10 gives e*D/4 ~ 0.28 -- the
 *   Taylor-in-D expansion of the two estimators converges only slowly at a full-decade window.
 *
 * Derivation/measurement within the inherited imp-3406/imp-33810 component model only; the component
 * model is NOT a rigorous asymptotic; no bound changes; C_mb GUE-conditional per imp-486 untouched;
 * imp-3066 K_a >= 0 untouched; no refereed bound is changed. NO QED.
 *
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected kEnd* ~ 21.281 derived here)
 * @see imp-34087-f4-surrogate-cancellation-digit-loss (the digit-loss view of the same cancellation)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (next-order term extending this closed form)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (widening-slope limit bounded by this kEnd*)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (fixed-band peak terminating at the same pole)
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (viz of the imp-34169 pole)
 * @see imp-34302-m2-ceiling-cohort-canonical-value-gate.js (build-time gate keeping this closed form
 *   distinct from the imp-34237/imp-34023 canonical ceiling on the two cohort pages below)
 * @see Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx (cohort page gated by imp-34302)
 * @see Imp34281M2CeilingCohortIndexPage.jsx (cohort index page gated by imp-34302)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127
 * (this module, leading closed form) -> imp-34189 (next-order term + window-width divergence) ->
 * imp-34188 (widening-slope leading -ln10/2, observed -1 a finite-window coincidence per imp-34246) ->
 * imp-34169/imp-34237 (fixed-band peak re-acceleration
 * terminating at the resid_exp pole). All six share the same kEnd* ceiling; see reciprocal @see links above.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023 exactly
const D = Math.LN10; // decade window width in x = ln N

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34023 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// 5-point OLS sigma exponent over the decade -- verbatim from imp-34023.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
// 2-point endpoint E_coll exponent magnitude -- verbatim from imp-34023.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// The imp-33773 M2 residual at boundary k (the quantity whose zero imp-34023 bisected).
function residAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// ---- Part A: confirm the CONTINUOUS residual is identically zero (the analytic cancellation). ----
// True continuous exponents via central differences on the analytic sub-terms.
function eCont(N) {
  // e = -d log E_coll/dx = 0.5 - L'/(2L), L = log T0, x = ln N.
  const h = 1e-4;
  const Lp = Math.log(effectiveHeightForN(N * Math.exp(h)));
  const Lm = Math.log(effectiveHeightForN(N / Math.exp(h)));
  const Lslope = (Lp - Lm) / (2 * h);
  return 0.5 - Lslope / (2 * Math.log(effectiveHeightForN(N)));
}
function residCont(N) {
  const p = parts(N);
  const h = 1e-4;
  const sp = Math.log(sigma(N * Math.exp(h)));
  const sm = Math.log(sigma(N / Math.exp(h)));
  const pSigmaCont = -(sp - sm) / (2 * h);
  return eCont(N) * (1 - p.sigma) - pSigmaCont;
}
const RESID_CONT_AT_K20 = residCont(Math.pow(10, 21)); // ~ 0 to numerical noise -> identity

// ---- Part B: the ACTUAL bisected crossing (reproduces imp-34023's kEnd* ~ 21.281). ----
function bisectCrossing(residFn, lo0, hi0) {
  let lo = lo0;
  let hi = hi0;
  if (residFn(lo) <= 0 || residFn(hi) >= 0) return NaN;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const KEND_BISECTED = +bisectCrossing(residAt, 20, 22).toFixed(4); // ~21.2809

// ---- Part C: the CLOSED-FORM crossing from the OLS(5pt)-vs-2pt cubic-bias balance. ----
// e and its x-derivatives (x = ln N) via central differences on eCont.
function eDerivs(N) {
  const x = Math.log(N);
  const h = 1e-3;
  const e0 = eCont(N);
  const ep = eCont(Math.exp(x + h));
  const em = eCont(Math.exp(x - h));
  return { e: e0, e2: (ep - 2 * e0 + em) / (h * h) };
}
// Net cubic-bias coefficient: 2pt secant bias D^2/24 minus 5pt OLS bias 17 D^2/480 = D^2/160.
const NET_CUBIC_BIAS_COEFF = D * D / 24 - 17 * D * D / 480; // === D^2/160 exactly
// resid = 0  <=>  sigma = sigma* = (-e'' D^2/160) / (e^2 D/2 + 17 e^3 D^2/480).
function residClosedForm(k) {
  const hi = Math.pow(10, k + 1);
  const { e, e2 } = eDerivs(hi);
  const sigmaStar = (-e2 * D * D / 160) / (e * e * D / 2 + 17 * e * e * e * D * D / 480);
  return sigma(hi) - sigmaStar; // > 0 below crossing, flips sign at kEnd*
}
const KEND_CLOSED_FORM = +bisectCrossing(residClosedForm, 17, 26).toFixed(4); // ~21.00
const CLOSED_FORM_RESIDUAL = +(KEND_CLOSED_FORM - KEND_BISECTED).toFixed(4); // ~ -0.28
const CROSS_DIAG = eDerivs(Math.pow(10, KEND_CLOSED_FORM + 1)); // e, e'' at the closed-form crossing

export const IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM = {
  id: 'imp-34127',
  proofSection: 'S-frontier',
  question:
    'imp-34023 located the M2-residual sign-change ceiling kEnd* ~ 21.281 -- where ' +
    'resid = pEcoll*(1 - sigma) - pSigma crosses zero -- by BISECTION only, attributing it to ' +
    'catastrophic cancellation as pEcoll, pSigma both converge to 0.5 (sigma -> 0). Derive kEnd* in ' +
    'closed form from the pEcoll = pSigma cancellation condition and identify which sub-leading term ' +
    'sets the crossing. Numerical/derivation within the component model only; NO QED.',
  measuredQuantity:
    'The continuous residual (analytic sigma exponent identity), the bisected crossing kEnd* ' +
    '(reproducing imp-34023), and the closed-form crossing kEnd* from the OLS(5pt)-vs-2pt-secant ' +
    'cubic-bias balance sigma* = (-e_pp D^2/160)/(e^2 D/2 + 17 e^3 D^2/480) with e_pp the E_coll exponent ' +
    'curvature, with the residual between ' +
    'closed form and bisection and the identified sub-leading term.',
  continuousIdentity: {
    resid_cont_at_k20: +RESID_CONT_AT_K20.toExponential(4), // ~1e-12: the continuous residual is 0
    statement:
      'With E_flow negligible, sigma = g/(1 + g) and the TRUE sigma exponent pSigma_cont = e*(1 - sigma), ' +
      'so resid_cont = e*(1 - sigma) - e*(1 - sigma) = 0 IDENTICALLY. There is no analytic ceiling; the ' +
      'crossing is a pure estimator-discretization artifact of the 2-point pEcoll vs 5-point OLS pSigma.',
  },
  closedForm: {
    kEnd_bisected: KEND_BISECTED, // ~21.2809 (matches imp-34023 21.281)
    kEnd_closed_form: KEND_CLOSED_FORM, // ~21.00
    residual_closed_minus_bisected: CLOSED_FORM_RESIDUAL, // ~ -0.28
    net_cubic_bias_coeff: +NET_CUBIC_BIAS_COEFF.toFixed(8), // D^2/24 - 17 D^2/480 === D^2/160
    net_cubic_bias_coeff_is_D2_over_160: Math.abs(NET_CUBIC_BIAS_COEFF - D * D / 160) < 1e-12,
    e_at_crossing: +CROSS_DIAG.e.toFixed(6), // ~0.49
    e_second_deriv_at_crossing: +CROSS_DIAG.e2.toExponential(4), // ~ -8e-6 (< 0)
    sub_leading_term:
      "e'' -- the SECOND x-derivative of the E_coll local exponent (the slow log-T0 running curvature) " +
      '-- balanced against the sigma-drag e^2 sigma D/2 through the net OLS-vs-2pt cubic-bias coefficient ' +
      'D^2/160. sigma(N) falls (via the far-tail sqrt(L/N) law) until it matches sigma*, which sets kEnd*.',
  },
  finding: {
    A_continuous_residual_is_exactly_zero:
      'Substituting sigma = g/(1 + g) and pSigma_cont = e*(1 - sigma) into resid = pEcoll*(1 - sigma) - ' +
      'pSigma gives resid_cont == 0 identically (verified ~1e-12 at k=20). So the ceiling is NOT a feature ' +
      'of the component model; the leading balance cancels to all continuous orders.',
    B_crossing_is_a_discretization_artifact:
      'The nonzero residual comes only from the DIFFERENT finite operators: pEcoll is a 2-point endpoint ' +
      'secant (cubic bias D^2/24) and pSigma a 5-point OLS slope (cubic bias 17 D^2/480) over the same ' +
      'decade. Their mismatch on -log E_coll is the net coefficient D^2/24 - 17 D^2/480 = D^2/160 exactly.',
    C_closed_form_and_sub_leading_term:
      'Setting resid = 0 gives sigma* = (-e_pp D^2/160)/(e^2 D/2 + 17 e^3 D^2/480), e_pp the E_coll ' +
      'exponent curvature; inverting sigma(N) = sigma* ' +
      'through the far-tail sqrt(L/N) law yields kEnd* ~ 21.00, a residual ~ -0.28 below the bisected ' +
      "21.281. The sub-leading term that sets the crossing is e'' (the log-T0 running curvature of the " +
      'E_coll exponent). The ~0.28 gap is the O((eD)^2) window-width correction, since e*D/4 ~ 0.28 at a ' +
      'full-decade window D = ln 10.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CLOSED-FORM DERIVATION (frontier-direction, NOT rigorous). The imp-34023 M2-residual ' +
    'sign-change ceiling kEnd* ~ 21.281 is NOT a feature of the component model: with E_flow negligible, ' +
    'sigma = g/(1+g) and the true sigma exponent pSigma_cont = e*(1 - sigma), so the CONTINUOUS residual ' +
    'resid = pEcoll*(1 - sigma) - pSigma vanishes IDENTICALLY (verified ~1e-12). The nonzero residual and ' +
    'its zero crossing are a pure ESTIMATOR-DISCRETIZATION artifact of pEcoll (2-point endpoint secant, ' +
    'cubic bias D^2/24) vs pSigma (5-point OLS, cubic bias 17 D^2/480) over the decade, whose mismatch on ' +
    '-log E_coll is D^2/24 - 17 D^2/480 = D^2/160 exactly. Setting resid = 0 gives the closed-form ' +
    "crossover sigma* = (-e'' D^2/160)/(e^2 D/2 + 17 e^3 D^2/480), which inverts through the sigma ~ " +
    'sqrt(L/N) far-tail law to kEnd* ~ 21.00 -- a residual of ~ -0.28 below the bisected 21.281. The ' +
    "SUB-LEADING TERM that sets the crossing is e'' (the slow log-T0 running curvature of the E_coll " +
    'local exponent), balanced against the sigma-drag e^2 sigma D/2; the ~0.28 gap is the O((eD)^2) ' +
    'window-width correction since e*D/4 ~ 0.28 at a full-decade window. The inherited component model is ' +
    'NOT a rigorous asymptotic; this is descriptive within the model only; changes no bound; establishes ' +
    'no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34023 (bisected the M2-residual sign-change ceiling kEnd* ~ 21.281, derived closed-form here); ' +
    'imp-34087 (digit-loss view of the same F4-surrogate cancellation); imp-33773 (the M2 residual whose ' +
    'sign change caps the surrogate); imp-33810 (the quarter-decade rungs reused verbatim); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM_ASSERTIONS = [
  {
    // (A) The continuous residual is identically zero -- the analytic cancellation.
    id: 'imp34127-continuous-residual-is-exactly-zero',
    description: 'resid_cont = e*(1-sigma) - pSigma_cont vanishes identically (|.| < 1e-8 at k=20)',
    holds: () => Math.abs(RESID_CONT_AT_K20) < 1e-8,
  },
  {
    // (B) The bisected crossing reproduces imp-34023's kEnd* ~ 21.281.
    id: 'imp34127-bisected-crossing-reproduces-imp34023',
    description: 'bisected kEnd* reproduces imp-34023 21.281 to within 0.01',
    holds: () => Number.isFinite(KEND_BISECTED) && Math.abs(KEND_BISECTED - 21.281) < 0.01,
  },
  {
    // (C) The net OLS(5pt)-vs-2pt-secant cubic-bias coefficient is D^2/160 exactly.
    id: 'imp34127-net-cubic-bias-coeff-is-D2-over-160',
    description: 'D^2/24 - 17 D^2/480 === D^2/160 (the net estimator-mismatch coefficient)',
    holds: () => Math.abs(NET_CUBIC_BIAS_COEFF - D * D / 160) < 1e-12,
  },
  {
    // (D) The closed form lands within ~0.3 of the bisected crossing.
    id: 'imp34127-closed-form-within-0p3-of-bisection',
    description: 'closed-form kEnd* ~21.00 is within 0.3 of the bisected 21.281',
    holds: () => Number.isFinite(KEND_CLOSED_FORM) && Math.abs(CLOSED_FORM_RESIDUAL) < 0.3,
  },
  {
    // (E) The closed form under-shoots (residual negative ~ -0.28): the O((eD)^2) window gap.
    id: 'imp34127-closed-form-residual-negative',
    description: 'closed-form kEnd* is below the bisected value (residual ~ -0.28 < 0)',
    holds: () => CLOSED_FORM_RESIDUAL < 0 && CLOSED_FORM_RESIDUAL > -0.5,
  },
  {
    // (F) The sub-leading term e'' is negative at the crossing (the log-T0 running curvature sign).
    id: 'imp34127-sub-leading-e-second-deriv-negative',
    description: "e'' (E_coll exponent curvature) is negative at the closed-form crossing",
    holds: () => CROSS_DIAG.e2 < 0,
  },
];
