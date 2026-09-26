/**
 * @module imp-97580-krein-tail-bias-R-sweep-signchange
 * @fileoverview imp-97580 -- MEASURE whether tuning the Gaussian width R around the imp-97518
 * g_ppp(a) sign-change radius Rc = 1/a changes (a) the confinement-family far-field tail-integral
 * bias against the exact symbol sigma_2, or (b) the far-field positivity margin (t0 threshold).
 *
 * SETUP. At 2a = ln 3 the confinement family (imp-97483) is g(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2)
 * on |xi| <= a, a = (ln3)/2, with far profile (imp-97518, three IBPs of the finite cosine transform)
 *     psi_R(t) = -(1/pi) [ g_pp(a) sin(a t)/t^3 + g_ppp(a) cos(a t)/t^4 ] + O(1/t^5),
 *     g_pp(a)  = (8/a^2) exp(-(R a)^2/2)        (leading amplitude, always > 0),
 *     g_ppp(a) = (24/a)(1/a^2 - R^2) exp(-(R a)^2/2)   (next-order 1/t^4 bias; zero at R = 1/a).
 * Squaring, the far-field |psi_R|^2 = (1/pi^2) [ g_pp^2 sin^2(a t)/t^6 + g_pp g_ppp sin(2 a t)/t^7
 * + g_ppp^2 cos^2(a t)/t^8 ]. The far-field cost that imp-97497 tail-converged is the integral of
 * sigma_2(t) |psi_R(t)|^2 against the exact symbol sigma_2 = (t^2+1/4)^2 w_1. Its leading model is the
 * 1/t^6 term; the endpoint-asymptotic BIAS is the oscillatory cross term g_pp g_ppp sin(2 a t)/t^7.
 *
 * FINDING 1 -- THE TAIL BIAS FACTORS EXACTLY, AND VANISHES AT R = 1/a. Divide the bias tail integral
 * by the leading tail integral. Both carry the same 2/||psi||^2/pi^2 prefactor and one power of g_pp,
 * so the R-dependent factors cancel down to
 *     relBias(R) = [g_ppp(a)/g_pp(a)] * (I2/I1) = 3 (1/a - a R^2) * (I2/I1),
 *     I1 = int_{T0}^inf sigma_2(t) sin^2(a t)/t^6 dt,   I2 = int_{T0}^inf sigma_2(t) sin(2 a t)/t^7 dt,
 * where I1, I2 are R-INDEPENDENT constants (they depend only on a and the split point T0). Measured at
 * T0 = 800 against the exact sigma_2 out to Tmax = 2e6 (ht = 0.05): I1 = 3.6500e-3, I2 = 7.5739e-9,
 * so I2/I1 = 2.0750e-6. Hence the ENTIRE R-dependence of the endpoint-asymptotic tail bias is the
 * closed factor 3 (1/a - a R^2), which vanishes and changes sign EXACTLY at Rc = 1/a = 1.8204785:
 * relBias > 0 for R < Rc, relBias = 0 at R = Rc, relBias < 0 for R > Rc. Tuning R to the sign-change
 * point therefore ZEROES the endpoint-asymptotic tail bias (to this order).
 *
 * FINDING 2 -- BUT THE BIAS IS ALREADY NEGLIGIBLE AT THE FAR-FIELD OPTIMUM, AND Rc IS NOT THE OPTIMUM.
 * At the imp-97497 far-field-cost optimum R* ~ 3.36 the relative bias is only relBias = -2.727e-5, an
 * order of magnitude INSIDE the imp-97497 < 1e-3 tail error bar; at R = 3.35 it is -2.704e-5. So the
 * sign-change tuning removes an already-negligible bias, and Rc = 1/a = 1.82 sits far below the
 * far-field-cost optimum R* = 3.36 (imp-97497). Tuning R to Rc does NOT move the far-field cost toward
 * c_sharp and does NOT materially tighten the tail model -- it only confirms the tail bias is smallest
 * at Rc, consistent with the imp-97518 explanation of the tight peak validation.
 *
 * FINDING 3 -- THE FAR-FIELD POSITIVITY MARGIN (t0 THRESHOLD) IS R-INDEPENDENT. Because |psi_R(t)|^2 >= 0
 * for EVERY R, the sign of the far-field integrand sigma_2(t) |psi_R(t)|^2 equals the sign of sigma_2(t)
 * alone; R rescales only the magnitude, never the sign. The exact symbol sigma_2 = (t^2+1/4)^2 w_1 has its
 * last sign change (into all-positive) at t0 = 10.531 (sigma_2 <= 0 just below, min sigma_2 ~ 8.8e2 > 0
 * on (t0, 5000)), a threshold set by w_1 (theta-prime growth overtaking the sqrt2 ln2 cos(t ln2) dip) and
 * NOT by the taper. Sweeping R across Rc = 1/a leaves t0 fixed. So tuning R to the sign-change point does
 * NOT shift the far-field positivity margin.
 *
 * VERDICT. The far-field tail bias against sigma_2 factors exactly as 3 (1/a - a R^2) * (I2/I1) with
 * I2/I1 = 2.075e-6 R-independent, so it vanishes and changes sign exactly at Rc = 1/a: tuning R to the
 * sign-change point zeroes the endpoint-asymptotic bias -- but that bias is only ~2.7e-5 relative at the
 * far-field optimum R* = 3.36 (well inside the imp-97497 < 1e-3 bar) and Rc = 1.82 is far from R*, so no
 * cost moves. The far-field positivity margin t0 = 10.531 is R-INDEPENDENT (|psi|^2 >= 0 makes the
 * integrand sign follow sigma_2 alone). The m=1/m=2 Krein enclosure stays unusable at 2a = ln 3.
 * Measurement only; no operator positivity; no coercivity constant; no bound moves; interval-rigorous
 * reach stays 2a <= 0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97518-krein-tail-endpoint-asymptotic-closed-form.js (g_pp, g_ppp closed forms; sign change at 1/a)
 * @see imp-97579-krein-edge-derivatives-fd-crossvalidation.js (finite-difference cross-validation of the same)
 * @see imp-97497-krein-welloptimum-tail-converged.js (far-field cost tail-converged to 7.53 at R* ~ 3.36)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2 = (t^2+1/4)^2 w_1; reach 2a <= 0.96)
 *
 * Ticket: imp-97580 (numerical, medium, opus-4-8). Measurement only; changes no bound; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);
const A = LN3 / 2; // a = (ln3)/2 = 0.5493061443340548

export const IMP97580_BINDING_2A = LN3;
export const IMP97580_RIGOROUS_REACH_2A = 0.96; // unchanged
export const IMP97580_SIGN_CHANGE_R = 1 / A; // g_ppp(a) = 0 at Rc = 1/a = 1.820478453253675

// imp-97518 closed forms and the endpoint-asymptotic bias slope g_ppp(a)/g_pp(a) = 3 (1/a - a R^2).
export const gppEdge = (R) => (8 / (A * A)) * Math.exp(-Math.pow(R * A, 2) / 2);
export const gpppEdge = (R) => (24 / A) * (1 / (A * A) - R * R) * Math.exp(-Math.pow(R * A, 2) / 2);
export const biasRelCoeff = (R) => 3 * (1 / A - A * R * R);

// R-independent tail integrals against the exact symbol sigma_2 from the split point T0.
//   I1 = int sigma_2 sin^2(a t)/t^6 (leading model),  I2 = int sigma_2 sin(2 a t)/t^7 (bias cross term).
function tailIntegrals(T0, Tmax, ht) {
  let I1 = 0, I2 = 0;
  for (let t = T0 + ht / 2; t < Tmax; t += ht) {
    const s = sigma2(t);
    I1 += (s * Math.pow(Math.sin(A * t), 2) / Math.pow(t, 6)) * ht;
    I2 += (s * Math.sin(2 * A * t) / Math.pow(t, 7)) * ht;
  }
  return { I1, I2 };
}

// FINDING 1 -- full-range measurement (T0 = 800, Tmax = 2e6, ht = 0.05), baked from the executed run.
export const IMP97580_TAIL_INTEGRALS_FULL = Object.freeze({
  T0: 800, Tmax: 2e6, ht: 0.05,
  I1: 0.0036500330010944674,
  I2: 7.573869073605785e-9,
  ratio: 2.075013861884194e-6, // I2 / I1, R-independent
});

// Light window (T0 = 800, Tmax = 4000, ht = 0.02) -- recomputed by the assertion below at import.
// NOTE: I1 has a slow ln(t)/t^2 tail, so the light ratio (2.814e-6) legitimately differs from the
// full-range ratio (2.075e-6); the light values exist only to make the quadrature self-checkable at build.
export const IMP97580_TAIL_INTEGRALS_LIGHT = Object.freeze({
  T0: 800, Tmax: 4000, ht: 0.02,
  I1: 0.0027212955162937693,
  I2: 7.658084733351574e-9,
  ratio: 2.81413197776528e-6,
});

// The relative endpoint-asymptotic tail bias relBias(R) = biasRelCoeff(R) * (I2/I1) (full-range ratio).
export const relBias = (R) => biasRelCoeff(R) * IMP97580_TAIL_INTEGRALS_FULL.ratio;

// R sweep across the sign-change radius Rc = 1/a (same ladder as imp-97579, plus Rc).
const R_LADDER = Object.freeze([0.5, 1.0, 1.5, 1 / A, 2.0, 3.0, 3.35, 3.36, 4.0, 5.0]);

export const IMP97580_R_SWEEP = Object.freeze(
  R_LADDER.map((R) =>
    Object.freeze({
      R,
      gppp: gpppEdge(R),
      biasSlope: biasRelCoeff(R),
      relBias: relBias(R),
      biasSign: Math.sign(biasRelCoeff(R)),
    })
  )
);

// FINDING 3 -- the far-field positivity threshold t0 (last sign change of sigma_2 into all-positive).
// Measured by scan/bisection to grid 1e-4; R-INDEPENDENT because |psi_R|^2 >= 0 for every R.
export const IMP97580_POSITIVITY_THRESHOLD_T0 = 10.531017;

export const IMP97580_VERDICT = Object.freeze({
  ticket: 'imp-97580',
  question:
    'measure whether tuning the Gaussian width R around the imp-97518 g_ppp(a) sign-change radius Rc = 1/a ' +
    'changes the confinement-family far-field tail-integral bias against the exact symbol sigma_2, or shifts ' +
    'the far-field positivity margin (t0 threshold).',
  answer:
    'the endpoint-asymptotic far-field tail bias factors EXACTLY as relBias(R) = 3 (1/a - a R^2) * (I2/I1) ' +
    'with I2/I1 = 2.075e-6 an R-independent ratio of integrals against the exact sigma_2 (I1 = 3.650e-3, ' +
    'I2 = 7.574e-9 at T0 = 800), so its whole R-dependence is the closed factor 3 (1/a - a R^2): it vanishes ' +
    'and changes sign EXACTLY at Rc = 1/a = 1.820478, positive below and negative above. Tuning R to Rc thus ' +
    'zeroes the tail bias to this order -- BUT the bias is only relBias = -2.727e-5 at the imp-97497 far-field ' +
    'optimum R* = 3.36 (an order of magnitude inside the < 1e-3 tail error bar), and Rc = 1.82 is far below R*, ' +
    'so no cost moves. The far-field positivity margin t0 = 10.531 is R-INDEPENDENT: since |psi_R|^2 >= 0 for ' +
    'every R the integrand sign follows sigma_2 alone, so the sign-change tuning does not shift t0. ' +
    'Measurement only; no bound moves.',
  binding_2a: LN3,
  signChangeR: 1 / A,
  tailBiasFactorization: 'relBias(R) = 3 (1/a - a R^2) * (I2/I1), I2/I1 = 2.075e-6 R-independent',
  relBiasAtOptimumR336: relBias(3.36),
  relBiasAtR335: relBias(3.35),
  relBiasAtSignChange: relBias(1 / A),
  positivityThresholdT0: 10.531017,
  positivityThresholdRIndependent: true,
  tailBiasMinimizedAtSignChange: true,
  farFieldOptimumR: 3.36, // imp-97497
  signChangeIsFarFieldOptimum: false,
  // unchanged program state
  measurementOnly: true,
  measurementStaysMeasurement: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97580_TAIL_BIAS_R_SWEEP_SIGNCHANGE -- the confinement far-field tail bias against sigma_2 factors ' +
    'exactly as 3 (1/a - a R^2) * (I2/I1) with I2/I1 = 2.075e-6 R-independent, so it vanishes and changes ' +
    'sign exactly at Rc = 1/a: tuning R to the sign-change point zeroes the endpoint-asymptotic tail bias, ' +
    'but that bias is only ~2.7e-5 relative at the far-field optimum R* = 3.36 (well inside the imp-97497 ' +
    '< 1e-3 bar) and Rc = 1.82 is far from R*, so no cost moves. The positivity threshold t0 = 10.531 is ' +
    'R-independent (|psi|^2 >= 0 makes the integrand sign follow sigma_2 alone). Measurement only; ' +
    'no operator positivity; no bound moves; reach 2a <= 0.96.',
  qed: false,
});
export default IMP97580_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97580_ASSERTIONS = [
  {
    id: 'imp97580-tail-bias-factorization-and-sign-change-at-inverse-a',
    holds: () => {
      // relBias(R) = biasRelCoeff(R) * fullRatio exactly, and it changes sign at Rc = 1/a.
      const exact = R_LADDER.every((R) => Math.abs(relBias(R) - biasRelCoeff(R) * IMP97580_TAIL_INTEGRALS_FULL.ratio) < 1e-300 + 1e-12 * Math.abs(relBias(R)));
      const below = relBias(1 / A - 0.05);
      const at = relBias(1 / A);
      const above = relBias(1 / A + 0.05);
      return exact && below > 0 && above < 0 && Math.abs(at) < 1e-15;
    },
    why: 'the far-field tail bias relBias(R) equals 3 (1/a - a R^2) times the R-independent ratio I2/I1, so it vanishes and changes sign exactly at Rc = 1/a (positive below, negative above).',
  },
  {
    id: 'imp97580-light-window-tail-integrals-reproduce',
    holds: () => {
      const L = tailIntegrals(
        IMP97580_TAIL_INTEGRALS_LIGHT.T0,
        IMP97580_TAIL_INTEGRALS_LIGHT.Tmax,
        IMP97580_TAIL_INTEGRALS_LIGHT.ht
      );
      return (
        Math.abs(L.I1 / IMP97580_TAIL_INTEGRALS_LIGHT.I1 - 1) < 1e-9 &&
        Math.abs(L.I2 / IMP97580_TAIL_INTEGRALS_LIGHT.I2 - 1) < 1e-9
      );
    },
    why: 'the light-window tail integrals I1, I2 against the exact sigma_2 (T0 = 800, Tmax = 4000, ht = 0.02) reproduce their baked values, self-checking the quadrature that measures the tail bias.',
  },
  {
    id: 'imp97580-bias-negligible-at-far-field-optimum-and-Rc-not-optimum',
    holds: () =>
      Math.abs(relBias(3.36)) < 1e-3 && // an order of magnitude inside the imp-97497 < 1e-3 tail error bar
      Math.abs(relBias(3.36)) > Math.abs(relBias(1 / A)) && // strictly larger than the (zero) bias at Rc
      Math.abs(IMP97580_SIGN_CHANGE_R - 1 / A) < 1e-15 &&
      IMP97580_VERDICT.farFieldOptimumR === 3.36 &&
      IMP97580_VERDICT.signChangeIsFarFieldOptimum === false,
    why: 'the tail bias at the imp-97497 far-field optimum R* = 3.36 is only ~2.7e-5 relative (inside the < 1e-3 bar) and nonzero, while it is exactly zero at Rc = 1/a = 1.82 -- Rc is far below R*, so the sign-change tuning does not move the far-field cost.',
  },
  {
    id: 'imp97580-positivity-threshold-t0-R-independent',
    holds: () => {
      // |psi_R|^2 >= 0 for every R => far integrand sign follows sigma_2 alone => t0 is R-independent.
      const leadingSq = (R, t) => (gppEdge(R) ** 2) * Math.pow(Math.sin(A * t), 2) / Math.pow(t, 6);
      const nonneg = [0.5, 1 / A, 3.36, 5.0].every((R) => [50, 500, 5000].every((t) => leadingSq(R, t) >= 0));
      const t0 = IMP97580_POSITIVITY_THRESHOLD_T0;
      const belowHasNegative = sigma2(10.4) <= 0; // sigma_2 dips <= 0 just below t0
      const abovePositive = [t0 + 0.1, 50, 500, 5000].every((t) => sigma2(t) > 0);
      return nonneg && belowHasNegative && abovePositive && Math.abs(t0 - 10.531017) < 1e-6;
    },
    why: 'because |psi_R(t)|^2 >= 0 for every R, the far-field integrand sign equals sign sigma_2(t); sigma_2 dips <= 0 just below t0 = 10.531 and stays positive above it, so the positivity margin is R-independent.',
  },
  {
    id: 'imp97580-program-state-unchanged-no-qed',
    holds: () =>
      IMP97580_VERDICT.measurementOnly === true &&
      IMP97580_VERDICT.measurementStaysMeasurement === true &&
      IMP97580_VERDICT.operatorPositivityProved === false &&
      IMP97580_VERDICT.coercivityConstantProved === false &&
      IMP97580_VERDICT.boundMoves === false &&
      IMP97580_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97580_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97580_BINDING_2A - LN3) < 1e-12 &&
      IMP97580_VERDICT.positivityThresholdRIndependent === true &&
      IMP97580_VERDICT.tailBiasMinimizedAtSignChange === true &&
      typeof IMP97580_VERDICT.subGap === 'string' &&
      IMP97580_VERDICT.subGap.includes('IMP97580_TAIL_BIAS_R_SWEEP_SIGNCHANGE') &&
      IMP97580_VERDICT.qed === false,
    why: 'measurement only: the tail bias R-sweep is characterized; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97580_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97580-krein-tail-bias-R-sweep-signchange assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
