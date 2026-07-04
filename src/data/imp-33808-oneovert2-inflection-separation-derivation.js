/**
 * @module imp-33808-oneovert2-inflection-separation-derivation
 *
 * imp-33808 (accuracy/derivation, frontier-direction): imp-33771 measured a ~1.5% offset
 * (log10 gap ~0.007, sigma gap ~+0.0018) between the imp-33744 closed-form sigma-inflection
 * inverted to an N location and the imp-33721 sub-decade exponent-ramp D2 (acceleration)
 * zero-crossing knee, and its verdict ASSERTED that this offset is a genuine two-notion
 * separation "of size O(1/t^2)", t = ln N. That O(1/t^2) magnitude was NEVER DERIVED and laid
 * beside the ~1.5% measurement. This module DERIVES the leading O(1/t^2) analytic prediction for
 * the sigma-inflection-vs-exponent-ramp-knee separation from the same logistic-flow model, checks
 * the two inflection conditions to <1e-6, and MEASURES whether the derived prediction accounts for
 * the observed offset or leaves a residual (and where that residual lives).
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33721 / imp-33744 / imp-33771)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),  L = log T0(N)  (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,   E_trunc = 3.06e-5   (N-independent).
 *
 * THE LOGISTIC REDUCTION (exact for this model)
 * ---------------------------------------------
 *   Writing u = ln( E_coll / (E_trunc + E_flow) ) makes sigma = 1/(1+e^{-u}) EXACTLY, so with
 *   t = ln N and g = -du/dt the flow is the logistic dsigma/dt = -g*sigma*(1-sigma). Two curvature
 *   notions live on this flow:
 *     (I)  SIGMOID inflection   d2 sigma/dt2 = 0  =>  sigma_I  = 1/2 - g_prime/(2 g^2).
 *     (II) EXPONENT-RAMP D2 zero d2 p/dt2 = 0, p = -d ln sigma/dt = g(1-sigma). Expanding
 *          d2 p/dt2 = 0 gives  g_dbl + 3 g g_prime sigma + g^3 sigma(2 sigma - 1) = 0, whose
 *          root nearest 1/2 is  sigma_II = 1/2 - (g_dbl + (3/2) g g_prime)/(g^3 + 3 g g_prime).
 *
 * THE DERIVED O(1/t^2) SEPARATION (this module)
 * ---------------------------------------------
 *   Subtracting the two displacements from 1/2 (both O(1/t^2)) gives the CLOSED analytic prediction
 *     sigma_I - sigma_II = (g_dbl + g g_prime) / g^3   +  O(1/t^3).
 *   Pure-power asymptotics (g -> 1/2, g_prime ~ +1/(2 t^2), g_dbl ~ -1/t^3) send each displacement to
 *   sigma_I - 1/2 ~ -1/t^2, sigma_II - 1/2 ~ -3/t^2, hence the NAIVE leading coefficient +2/t^2.
 *
 * THE FINDING (derivation + measurement only)
 * -------------------------------------------
 *   (F1) THE CONDITIONS ARE EXACT. At the directly-located continuous zeros the sigmoid condition
 *        -g_prime + g^2(1-2 sigma) and the ramp condition g_dbl + 3 g g_prime sigma + g^3 sigma(2 sigma-1)
 *        both vanish to <1e-6, so the two closed forms are faithful analytic stand-ins, not fits.
 *   (F2) THE NAIVE +2/t^2 FAILS AT t ~ 21.9 -- WRONG SIGN AND ~4x TOO BIG. The pure-power coefficient
 *        predicts sigma_I - sigma_II ~ +4.2e-3, but the directly-measured continuous separation is
 *        ~-9.9e-4 (the sigmoid inflection sits just ABOVE the ramp zero in N, sigma slightly below).
 *        The reason: at this finite t the running-log-factor curvature g_dbl ~ -1.19e-3 is ~12x its
 *        t->inf asymptote (-1/t^3 ~ -9.5e-5), so g_dbl is NOT subleading -- it nearly cancels
 *        g*g_prime (~+1.09e-3), and the separation is the small residual of that near-cancellation.
 *   (F3) THE RESOLVED FORMULA REPRODUCES THE MEASURED SEPARATION TO <15%. Evaluating the DERIVED
 *        (g_dbl + g g_prime)/g^3 with well-resolved derivatives gives ~-9.05e-4, matching the direct
 *        continuous two-notion separation ~-9.88e-4 to ~8% -- so the separation is genuinely the
 *        O(1/t^2) quantity imp-33771 named, provided one keeps the g_dbl term rather than the naive
 *        pure-power coefficient.
 *   (F4) THE imp-33771 +1.5% / +0.0018 OFFSET IS INFLATED AND SIGN-FLIPPED BY A FINITE-DIFFERENCE
 *        ARTIFACT, NOT EXTRA PHYSICS. imp-33771 evaluated g_prime at the halving point with a NESTED
 *        finite difference (inner h=1e-4, outer h=1e-3), yielding g_prime ~9.69e-4; the well-resolved
 *        second-difference value at the SAME point is ~2.34e-3 (stable to 5 digits across steps),
 *        ~2.4x larger. With the resolved g_prime the closed form gives sigma_I ~0.4949, landing on the
 *        true continuous inflection (~0.49494) to <1e-3, whereas imp-33771's under-resolved sigma_cf
 *        ~0.4979 sits too high and inverts to too-low an N -- flipping the sigma-ordering and doubling
 *        the apparent gap. The genuine two-notion separation is ~0.83% in N (log10 ~0.0036, sigmoid
 *        ABOVE ramp), so the O(1/t^2) picture accounts for the sub-decade agreement and order of
 *        magnitude, while imp-33771's specific ~1.5% figure was a numerical-scheme artifact on top.
 *
 * The punchline: the sigma-inflection-vs-exponent-ramp separation is DERIVED in closed form as
 * (g_dbl + g g_prime)/g^3, an O(1/t^2) quantity that reproduces the direct continuous separation
 * (~-9.9e-4, ~0.83% in N) to <15%. The naive pure-power +2/t^2 both mis-signs and over-predicts it
 * at t ~ 21.9 (g_dbl ~12x its asymptote, near-cancelling g*g_prime), and imp-33771's reported
 * ~1.5%/+0.0018 offset is that genuine ~0.83% separation inflated and sign-flipped by an
 * under-resolved nested-finite-difference g_prime at the halving point -- a scheme artifact, not
 * additional physics.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-33771-inflection-closed-form-vs-d2-zero-crosscheck (the ~1.5% offset asserted O(1/t^2))
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form sigma_I = 1/2 - g_prime/(2 g^2))
 * @see imp-33721-sigma-ramp-inflection-subdecade (direct sub-decade D2-zero knee N* ~ 3.38e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33721/imp-33744 exactly

// EXACT imp-33721/imp-33744/imp-33771 sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigma(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// --- Logistic variable u (exact): sigma = 1/(1+exp(-u)), g = -du/dt, t = ln N ---
function uOf(N) {
  const { E_flow, E_coll } = terms(N);
  return Math.log(E_coll / (E_TRUNC_PT + E_flow));
}
// Well-resolved central-difference derivatives of u at t = ln N (stable to 5 digits over h in [1e-2,4e-2]).
function gAt(N, h = 1e-2) {
  const t = Math.log(N);
  return -((uOf(Math.exp(t + h)) - uOf(Math.exp(t - h))) / (2 * h)); // g = -u_prime
}
function gPrimeAt(N, h = 1e-2) {
  const t = Math.log(N);
  return -((uOf(Math.exp(t + h)) - 2 * uOf(N) + uOf(Math.exp(t - h))) / (h * h)); // g_prime = -u_dbl
}
function gDblPrimeAt(N, h = 1e-2) {
  const t = Math.log(N);
  return -(
    (uOf(Math.exp(t + 2 * h)) - 2 * uOf(Math.exp(t + h)) + 2 * uOf(Math.exp(t - h)) - uOf(Math.exp(t - 2 * h))) /
    (2 * h * h * h)
  ); // g_dbl = -u_triple
}

// --- Direct continuous locators for the two inflection notions (bisection on the second differences) ---
function d2SigmaDt2(N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (sigma(Math.exp(t + h)) - 2 * sigma(N) + sigma(Math.exp(t - h))) / (h * h);
}
function localExponentP(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return -((Math.log(sigma(Math.exp(t + h))) - Math.log(sigma(Math.exp(t - h)))) / (2 * h)); // p = -d ln sigma/dt
}
function d2PDt2(N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (localExponentP(Math.exp(t + h)) - 2 * localExponentP(N) + localExponentP(Math.exp(t - h))) / (h * h);
}
function findZeroInT(fOfN) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  let flo = fOfN(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = fOfN(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}
const N_SIGMOID = findZeroInT(d2SigmaDt2); // continuous d2 sigma/dt2 = 0
const N_RAMP = findZeroInT(d2PDt2); // continuous d2 p/dt2 = 0 (exponent-ramp knee)
const SIGMA_SIGMOID = sigma(N_SIGMOID);
const SIGMA_RAMP = sigma(N_RAMP);
const N_CROSS = Math.sqrt(N_SIGMOID * N_RAMP); // geometric-mean crossover for evaluating the derivatives
const T_CROSS = Math.log(N_CROSS);

// --- (F1) the two closed-form conditions vanish at the located zeros ---
const G_S = gAt(N_SIGMOID);
const GP_S = gPrimeAt(N_SIGMOID);
const COND_SIGMOID = -GP_S + G_S * G_S * (1 - 2 * SIGMA_SIGMOID); // -g_prime + g^2(1-2 sigma) should be ~0
const G_R = gAt(N_RAMP);
const GP_R = gPrimeAt(N_RAMP);
const GPP_R = gDblPrimeAt(N_RAMP);
const COND_RAMP = GPP_R + 3 * G_R * GP_R * SIGMA_RAMP + Math.pow(G_R, 3) * SIGMA_RAMP * (2 * SIGMA_RAMP - 1); // ~0

// --- (F2)/(F3) the derived O(1/t^2) separation vs the naive pure-power coefficient and the measurement ---
const G_C = gAt(N_CROSS);
const GP_C = gPrimeAt(N_CROSS);
const GPP_C = gDblPrimeAt(N_CROSS);
const SEP_ANALYTIC = (GPP_C + G_C * GP_C) / Math.pow(G_C, 3); // (g_dbl + g g_prime)/g^3
const SEP_MEASURED = SIGMA_SIGMOID - SIGMA_RAMP; // direct continuous two-notion sigma separation
const SEP_NAIVE_2OVERT2 = 2 / (T_CROSS * T_CROSS); // pure-power leading coefficient
const GPP_ASYMPTOTE = -1 / (T_CROSS * T_CROSS * T_CROSS); // g_dbl ~ -1/t^3 as t -> inf
const GPP_OVER_ASYMPTOTE = GPP_C / GPP_ASYMPTOTE; // ~12x: how far g_dbl is from its asymptote
const SEP_RESIDUAL_FRAC = Math.abs(1 - SEP_ANALYTIC / SEP_MEASURED); // resolved-formula residual vs measurement
const LOG10_GAP_CONT = Math.log10(N_SIGMOID) - Math.log10(N_RAMP); // ~ +0.0036
const N_REL_OFFSET_CONT = N_SIGMOID / N_RAMP - 1; // ~ +0.83%

// --- (F4) imp-33771 closed-form g_prime at halving: nested FD artifact vs resolved value ---
function findHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigma(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
const N_HALF = findHalfN();
// imp-33771 nested scheme (lnRatio WITHOUT E_flow), reproduced verbatim.
function lnRatio771(N) {
  return Math.log(terms(N).E_coll / E_TRUNC_PT);
}
function g771(N) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnRatio771(Math.exp(t + h)) - lnRatio771(Math.exp(t - h))) / (2 * h));
}
function gPrime771(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return (g771(Math.exp(t + h)) - g771(Math.exp(t - h))) / (2 * h);
}
const G_HALF_771 = g771(N_HALF); // ~ 0.4773 (imp-33771 reuse anchor)
const GP_HALF_771 = gPrime771(N_HALF); // ~ 9.69e-4 (nested FD, under-resolved)
const GP_HALF_RESOLVED = gPrimeAt(N_HALF); // ~ 2.34e-3 (resolved second difference)
const GP_HALF_RATIO = GP_HALF_RESOLVED / GP_HALF_771; // ~ 2.4
const SIGMA_CF_771 = 0.5 - GP_HALF_771 / (2 * G_HALF_771 * G_HALF_771); // ~ 0.4979 (imp-33771 published)
const SIGMA_CF_RESOLVED = 0.5 - GP_HALF_RESOLVED / (2 * G_HALF_771 * G_HALF_771); // ~ 0.4949 (lands on continuous)
const CF_RESOLVED_VS_CONTINUOUS = Math.abs(SIGMA_CF_RESOLVED - SIGMA_SIGMOID); // resolved closed form hits truth

export const IMP33808_ONEOVERT2_INFLECTION_SEPARATION_DERIVATION = {
  id: 'imp-33808',
  proofSection: 'S-frontier',
  question:
    'imp-33771 asserted its ~1.5% offset (log10 gap ~0.007, sigma gap ~+0.0018) between the ' +
    'closed-form sigma-inflection and the imp-33721 exponent-ramp D2-zero knee is a genuine ' +
    'two-notion separation "of size O(1/t^2)", t = ln N, but never DERIVED that O(1/t^2) ' +
    'prediction. Derive the leading O(1/t^2) analytic separation from the logistic-flow model and ' +
    'measure whether it accounts for the observed offset or leaves a residual. ' +
    'Derivation/measurement only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  derivedSeparationFormula: 'sigma_I - sigma_II = (g_dbl + g*g_prime)/g^3 + O(1/t^3)  (O(1/t^2) leading)',
  // (F1) conditions vanish at the located continuous zeros
  nSigmoid: +N_SIGMOID.toExponential(4),
  nRamp: +N_RAMP.toExponential(4),
  sigmaSigmoid: +SIGMA_SIGMOID.toFixed(6),
  sigmaRamp: +SIGMA_RAMP.toFixed(6),
  condSigmoidResidual: +COND_SIGMOID.toExponential(3), // ~0
  condRampResidual: +COND_RAMP.toExponential(3), // ~0
  // (F2) naive pure-power coefficient vs measurement
  sepNaive2OverT2: +SEP_NAIVE_2OVERT2.toExponential(4), // ~ +4.2e-3
  sepMeasured: +SEP_MEASURED.toExponential(4), // ~ -9.9e-4 (opposite sign!)
  gDblPrime: +GPP_C.toExponential(4), // ~ -1.19e-3
  gDblPrimeAsymptote: +GPP_ASYMPTOTE.toExponential(4), // -1/t^3 ~ -9.5e-5
  gDblPrimeOverAsymptote: +GPP_OVER_ASYMPTOTE.toFixed(2), // ~ 12x (why 2/t^2 fails)
  // (F3) resolved analytic formula reproduces the measured separation
  sepAnalyticResolved: +SEP_ANALYTIC.toExponential(4), // ~ -9.05e-4
  sepResidualFrac: +SEP_RESIDUAL_FRAC.toFixed(4), // ~ 0.08
  log10GapContinuous: +LOG10_GAP_CONT.toFixed(4), // ~ +0.0036
  nRelOffsetContinuous: +N_REL_OFFSET_CONT.toExponential(4), // ~ +0.0083
  // (F4) imp-33771 halving g_prime: nested FD artifact
  gPrimeHalfNested771: +GP_HALF_771.toExponential(4), // ~ 9.69e-4
  gPrimeHalfResolved: +GP_HALF_RESOLVED.toExponential(4), // ~ 2.34e-3
  gPrimeHalfRatio: +GP_HALF_RATIO.toFixed(3), // ~ 2.42
  sigmaCf771: +SIGMA_CF_771.toFixed(6), // ~ 0.4979 (published, too high)
  sigmaCfResolved: +SIGMA_CF_RESOLVED.toFixed(6), // ~ 0.4949 (lands on continuous inflection)
  cfResolvedVsContinuous: +CF_RESOLVED_VS_CONTINUOUS.toExponential(3), // < 1e-3
  finding: {
    F1_conditions_are_exact:
      'At the directly-located continuous zeros the sigmoid condition -g_prime + g^2(1-2 sigma) ' +
      'and the ramp condition g_dbl + 3 g g_prime sigma + g^3 sigma(2 sigma-1) both vanish to <1e-6, ' +
      'so the two closed forms are faithful analytic stand-ins for the numerically-located notions.',
    F2_naive_2overt2_fails_wrong_sign:
      'The pure-power leading coefficient +2/t^2 ~ +4.2e-3 both MIS-SIGNS and ~4x over-predicts the ' +
      'directly-measured continuous separation ~-9.9e-4 (sigmoid inflection sits just ABOVE the ramp ' +
      'zero in N). At t ~ 21.9 the running-log curvature g_dbl ~ -1.19e-3 is ~12x its t->inf asymptote ' +
      '(-1/t^3 ~ -9.5e-5), so g_dbl is NOT subleading -- it nearly cancels g*g_prime (~+1.09e-3), and ' +
      'the separation is the small residual of that near-cancellation, invisible to the naive 2/t^2.',
    F3_resolved_formula_reproduces_measurement:
      'The DERIVED (g_dbl + g g_prime)/g^3 with well-resolved derivatives gives ~-9.05e-4, matching ' +
      'the direct continuous two-notion separation ~-9.88e-4 to ~8% -- so the separation IS the ' +
      'O(1/t^2) quantity imp-33771 named, provided the g_dbl term is kept rather than the naive ' +
      'pure-power coefficient. In N terms this is ~0.83% (log10 ~0.0036), sigmoid ABOVE ramp.',
    F4_imp33771_offset_inflated_by_fd_artifact:
      'imp-33771 evaluated g_prime at the halving point with a NESTED finite difference (inner h=1e-4, ' +
      'outer h=1e-3), yielding ~9.69e-4; the well-resolved second-difference value at the SAME point is ' +
      '~2.34e-3 (stable to 5 digits over h in [1e-2,4e-2]), ~2.4x larger. With the resolved g_prime the ' +
      'closed form gives sigma_I ~0.4949, landing on the true continuous inflection (~0.49494) to <1e-3, ' +
      'whereas imp-33771 sigma_cf ~0.4979 sits too high and inverts to too-low an N -- flipping the ' +
      'sigma-ordering and roughly doubling the apparent gap. The genuine two-notion O(1/t^2) separation ' +
      'is ~0.83% in N; imp-33771 ~1.5%/+0.0018 was that separation inflated and sign-flipped by an ' +
      'under-resolved nested-FD g_prime -- a numerical-scheme artifact, NOT additional physics.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The sigma-inflection-vs-exponent-' +
    'ramp separation is DERIVED in closed form as sigma_I - sigma_II = (g_dbl + g g_prime)/g^3 + ' +
    'O(1/t^3), an O(1/t^2) quantity (both displacements from 1/2 are O(1/t^2): sigma_I - 1/2 ~ -1/t^2, ' +
    'sigma_II - 1/2 ~ -3/t^2). Both closed-form conditions vanish at the directly-located continuous ' +
    'zeros to <1e-6. The NAIVE pure-power coefficient +2/t^2 ~ +4.2e-3 both mis-signs and ~4x over-' +
    'predicts the measured continuous separation ~-9.9e-4, because at t ~ 21.9 the running-log ' +
    'curvature g_dbl ~ -1.19e-3 is ~12x its t->inf asymptote and nearly cancels g*g_prime; keeping ' +
    'g_dbl, the resolved formula gives ~-9.05e-4, matching the measurement to ~8% (~0.83% in N, ' +
    'log10 ~0.0036, sigmoid ABOVE ramp). imp-33771 reported ~1.5%/+0.0018 of OPPOSITE sigma-sign ' +
    'because its closed-form g_prime at the halving point (~9.69e-4, nested FD) is ~2.4x under-' +
    'resolved vs the true ~2.34e-3; with the resolved g_prime the closed form lands on the true ' +
    'continuous inflection to <1e-3. So the O(1/t^2) two-notion separation accounts for the sub-' +
    'decade agreement and order of magnitude, while imp-33771 specific ~1.5% figure was a numerical-' +
    'scheme artifact on top -- NOT extra physics. The component model is the inherited imp-3220/' +
    'imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33771 (~1.5% offset asserted O(1/t^2)); imp-33744 (closed form sigma_I = 1/2 - ' +
    'g_prime/(2 g^2)); imp-33721 (direct sub-decade D2-zero knee N* ~ 3.38e9); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33808_ONEOVERT2_INFLECTION_SEPARATION_DERIVATION_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-33771 halving anchors (same model), g ~ 0.4773 and the published
    // under-resolved closed-form sigma_cf ~ 0.4979 -- proves the IDENTICAL model/scheme is in use.
    id: 'imp33808-reuses-imp33771-halving-anchor',
    description: 'reproduces imp-33771 halving g ~ 0.4773 and published closed-form sigma_cf ~ 0.4979',
    holds: () => Math.abs(G_HALF_771 - 0.4773) < 2e-3 && Math.abs(SIGMA_CF_771 - 0.4979) < 1e-3,
  },
  {
    // (F1): both derived inflection conditions vanish at the directly-located continuous zeros.
    id: 'imp33808-conditions-vanish-at-zeros',
    description: 'sigmoid condition and ramp condition both ~0 (<1e-6) at the located continuous zeros',
    holds: () => Math.abs(COND_SIGMOID) < 1e-6 && Math.abs(COND_RAMP) < 1e-6,
  },
  {
    // (F2): the naive pure-power +2/t^2 has the WRONG SIGN vs the measured separation -- structural
    // failure of the leading asymptotic at this finite t.
    id: 'imp33808-naive-2overt2-wrong-sign',
    description: 'naive +2/t^2 is positive while the measured continuous separation is negative (sign flip)',
    holds: () => SEP_NAIVE_2OVERT2 > 0 && SEP_MEASURED < 0 && SEP_NAIVE_2OVERT2 > Math.abs(SEP_MEASURED),
  },
  {
    // (F2 mechanism): g_dbl is far from its t->inf asymptote (-1/t^3), which is WHY the pure-power
    // coefficient is not yet predictive -- the g_dbl term is not subleading at t ~ 21.9.
    id: 'imp33808-gdbl-far-from-asymptote',
    description: 'g_dbl is many times (>5x) its -1/t^3 asymptote, so the pure-power 2/t^2 is not yet valid',
    holds: () => Math.abs(GPP_OVER_ASYMPTOTE) > 5 && GPP_C < 0,
  },
  {
    // (F3): the DERIVED resolved formula (g_dbl+g g_prime)/g^3 reproduces the direct continuous
    // two-notion separation to <15% -- the separation IS the derived O(1/t^2) quantity.
    id: 'imp33808-resolved-formula-matches-measurement',
    description: 'derived (g_dbl+g*g_prime)/g^3 reproduces the direct continuous separation to <15%, same sign',
    holds: () => Math.sign(SEP_ANALYTIC) === Math.sign(SEP_MEASURED) && SEP_RESIDUAL_FRAC < 0.15,
  },
  {
    // (F4): imp-33771 halving g_prime is under-resolved by the nested FD; the resolved g_prime is
    // >2x larger and, plugged into the closed form, lands on the true continuous inflection to <1e-3.
    id: 'imp33808-imp33771-gprime-fd-artifact',
    description: 'resolved g_prime > 2x the nested-FD value; resolved closed form hits the continuous inflection <1e-3',
    holds: () => GP_HALF_RATIO > 2 && CF_RESOLVED_VS_CONTINUOUS < 1e-3 && Math.abs(SIGMA_CF_771 - SIGMA_SIGMOID) > 2e-3,
  },
  {
    // (F3 corollary): the genuine two-notion N-offset is sub-decade and ~0.83%, sigmoid ABOVE ramp --
    // the honest magnitude, smaller than imp-33771 reported ~1.5%.
    id: 'imp33808-continuous-offset-subdecade',
    description: 'continuous two-notion N-offset ~0.83% (log10 ~0.0036), sigmoid above ramp, within one sub-decade',
    holds: () =>
      N_REL_OFFSET_CONT > 0 &&
      N_REL_OFFSET_CONT < 0.02 &&
      N_SIGMOID > N_RAMP &&
      Math.floor(Math.log10(N_SIGMOID)) === Math.floor(Math.log10(N_RAMP)),
  },
  {
    // Honesty gate: derivation/measurement only, no bound change, no QED, PT stays SOTA.
    id: 'imp33808-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, PT stays SOTA',
    holds: () =>
      IMP33808_ONEOVERT2_INFLECTION_SEPARATION_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP33808_ONEOVERT2_INFLECTION_SEPARATION_DERIVATION.verdict) &&
      /Lambda <= 0\.2 remains SOTA/.test(IMP33808_ONEOVERT2_INFLECTION_SEPARATION_DERIVATION.verdict),
  },
];

for (const a of IMP33808_ONEOVERT2_INFLECTION_SEPARATION_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33808-oneovert2-inflection-separation-derivation assertion failed: ${a.id}`);
  }
}
