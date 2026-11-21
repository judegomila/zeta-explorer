/**
 * @module imp-33844-hump-peak-closed-form
 *
 * imp-33844 (numerical, frontier-direction): imp-33809 located the global M3 intra-decade
 * saturation-curvature hump amplitude peak NUMERICALLY at the k = 9 E_coll = E_trunc crossover
 * decade (peak ~ 6.4758e-2), the one attribution left standing after the imp-33810 M2
 * refutation, but reported the peak only as a tabulated number. This module DERIVES whether
 * that peak amplitude admits a CLOSED FORM from the inherited component model
 * sigma = E_coll / (E_trunc + E_flow + E_coll) evaluated at the crossover (E_coll = E_trunc),
 * mirroring the imp-33723 Banach closed form for the crossover N itself, and reports the
 * closed-form-vs-measured residual.
 *
 * THE DERIVATION (no fresh model -- pure algebra on the inherited imp-3220/imp-3406 sigma)
 * --------------------------------------------------------------------------------------
 *   The imp-33809 hump is hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma, i.e. the endpoint-local
 *   sigma decay-exponent minus the OLS decade-averaged one. Write x = ln N and g(x) = ln sigma.
 *   With u = E_coll / E_trunc and E_trunc N-independent, d ln u / dx = -p_ecoll (magnitude),
 *   and sigma = u / (1 + u) is LOGISTIC in ln u, giving the exact local identities
 *     g_prime  = d ln sigma / dx      = -p_ecoll (1 - sigma),
 *     sigma_prime = d sigma / dx      = -p_ecoll sigma (1 - sigma),
 *     g_2prime = d2 ln sigma / dx2    = -p_ecoll^2 sigma (1 - sigma).
 *   The hump is the gap between the endpoint slope and the decade-secant slope; to leading
 *   order in the decade width dx = ln 10 that gap is the curvature term
 *     hump(k) ~ -(1/2) g_2prime dx = (1/2) p_ecoll^2 sigma (1 - sigma) ln 10.
 *   This is MAXIMIZED where sigma (1 - sigma) peaks, i.e. at sigma = 1/2 -- which by the
 *   component model is EXACTLY the E_coll = E_trunc crossover (E_flow-dropped, sigma = 1/2
 *   iff E_coll = E_trunc). So the M3 hump peaks at the crossover decade BECAUSE the logistic
 *   curvature of sigma peaks there, and the peak amplitude has the closed form
 *     hump_peak ~ (1/2) p_ecoll^2 (1/4) ln 10 = p_ecoll^2 ln 10 / 8,
 *   whose leading value (p_ecoll -> 1/2, the pure N^(-1/2) collision exponent) is the clean
 *     CF0 = ln 10 / 32 ~ 7.19558e-2.
 *
 * THE MEASUREMENT (derivation + residual only -- confirms the imp-33809 peak is closed-form)
 * ----------------------------------------------------------------------------------------
 *   (D1) THE CROSSOVER IS THE CURVATURE MAXIMUM. Bisecting E_coll = E_trunc reproduces the
 *        imp-3444/imp-33723 crossover N ~ 3.2803e9 with sigma(N_cross) ~ 0.49953 ~ 1/2, so the
 *        sigma (1 - sigma) logistic curvature is at its maximum exactly at the crossover --
 *        the analytic reason imp-33809 found the hump argmax at the k = 9 crossover decade.
 *   (D2) THE LEADING CLOSED FORM CF0 = ln 10 / 32 ~ 7.19558e-2 OVERSHOOTS the imp-33809
 *        measured decade-peak 6.47579e-2 by +11.12%. The overshoot is signed and structural:
 *        CF0 is the CONTINUOUS pointwise curvature at the exact crossover N, while the
 *        measured hump is a DISCRETE decade quantity (OLS over [1e9,1e10] with sigma_hi at the
 *        decade endpoint, not sigma = 1/2 at the interior crossover).
 *   (D3) RESTORING THE MEASURED p_ecoll CLOSES MOST OF THE GAP. The collision exponent is not
 *        exactly 1/2: the log T0 drift pulls p_ecoll to ~0.47724 over the k = 9 decade, and
 *        squaring it (the curvature carries p_ecoll^2) drops the closed form to
 *        p_ecoll^2 ln 10 / 8 ~ 6.55527e-2, a +1.23% residual to the measured peak -- a ~9x
 *        tightening. So ~90% of the 11% leading gap is the leading-order p_ecoll = 1/2
 *        approximation (the same log T0 correction imp-33620/imp-33727 track), and only ~1.2%
 *        remains for the discrete-OLS-vs-continuous-curvature and higher-order Taylor terms.
 *
 * The punchline: the imp-33810-surviving M3 hump peak is NOT a bare numerical coincidence --
 * it is the maximum of the logistic curvature of sigma, hump_peak ~ (1/2) p_ecoll^2 sigma
 * (1 - sigma) ln 10, attained at sigma = 1/2 which IS the E_coll = E_trunc crossover. The
 * leading closed form ln 10 / 32 matches the imp-33809 peak to ~11%, and restoring the
 * measured p_ecoll tightens it to ~1.2% -- the same leading-then-correction pattern imp-33723
 * used for the crossover N itself.
 *
 * DERIVATION / MEASUREMENT ONLY. Confirms the imp-33809 peak is closed-form; NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33809-saturation-curvature-hump-vs-k (M3 hump peak located numerically at k=9)
 * @see imp-33810-eflow-resid-ratio-N-ladder (M2 refutation leaving M3 the one attribution standing)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form Banach crossover N ~ 3.2803e9)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover landmark)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (separated-E_coll exponent ladder, log T0 drift)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773/imp-33809)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33809/imp-33773 exactly
const LN10 = Math.log(10);

// EXACT inherited imp-3406/imp-33809 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaOf = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaOf(N)));
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

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// --- The imp-33809 measured M3 hump peak at the k=9 crossover decade (reuse gate) ---
const LO_K9 = 1e9;
const HI_K9 = 1e10;
const P_SIGMA_K9 = olsSigmaExponent(LO_K9, HI_K9);
const P_ECOLL_K9 = ecollExponentMag(LO_K9, HI_K9); // ~0.47724 (log T0 drift below 1/2)
const SIGMA_HI_K9 = parts(HI_K9).sigma;
const HUMP_PEAK_MEASURED = P_ECOLL_K9 * (1 - SIGMA_HI_K9) - P_SIGMA_K9; // ~6.47579e-2

// --- The E_coll = E_trunc crossover (imp-3444/imp-33723): bisection, sigma there ~ 1/2 ---
function crossoverN() {
  let a = 1e8;
  let b = 1e11;
  for (let i = 0; i < 200; i++) {
    const m = Math.sqrt(a * b);
    if (parts(m).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.sqrt(a * b);
}
const N_CROSS = crossoverN(); // ~3.2803e9, matches imp-33723
const SIGMA_CROSS = parts(N_CROSS).sigma; // ~0.49953 ~ 1/2

// --- The closed form: hump_peak ~ (1/2) p_ecoll^2 sigma(1-sigma) ln10, max at sigma=1/2 ---
// CF0: leading collision exponent p_ecoll -> 1/2 and sigma -> 1/2 => (1/2)(1/4)(1/4)ln10 = ln10/32.
const CF_PEAK_LEADING = LN10 / 32; // ~7.19558e-2
// CF corrected: restore the measured p_ecoll (log T0 drift), still at the sigma=1/2 curvature max.
const CF_PEAK_CORRECTED = (P_ECOLL_K9 * P_ECOLL_K9 * LN10) / 8; // ~6.55527e-2

const RESID_LEADING = (CF_PEAK_LEADING - HUMP_PEAK_MEASURED) / HUMP_PEAK_MEASURED; // ~+0.1112
const RESID_CORRECTED = (CF_PEAK_CORRECTED - HUMP_PEAK_MEASURED) / HUMP_PEAK_MEASURED; // ~+0.0123

export const IMP33844_HUMP_PEAK_CLOSED_FORM = {
  id: 'imp-33844',
  proofSection: 'S-frontier',
  question:
    'imp-33809 located the global M3 saturation-curvature hump amplitude peak numerically at the ' +
    'k = 9 E_coll = E_trunc crossover decade (~6.4758e-2), the attribution left standing after the ' +
    'imp-33810 M2 refutation, but only as a tabulated number. Does the peak amplitude admit a CLOSED ' +
    'FORM from the component model sigma = E_coll/(E_trunc + E_flow + E_coll) evaluated at the ' +
    'crossover (E_coll = E_trunc), mirroring the imp-33723 Banach closed form for the crossover N, and ' +
    'what is the closed-form-vs-measured residual? Derivation only; establishes no positivity; no QED.',
  derivedClosedForm:
    'hump_peak ~ (1/2) p_ecoll^2 sigma (1 - sigma) ln 10, the leading curvature term of the LOGISTIC ' +
    'sigma = u/(1+u) (u = E_coll/E_trunc), maximized at sigma = 1/2 which by the component model is ' +
    'EXACTLY the E_coll = E_trunc crossover; leading value CF0 = ln 10 / 32.',
  crossoverN: +N_CROSS.toExponential(6),
  sigmaAtCrossover: +SIGMA_CROSS.toFixed(6),
  measured: {
    pSigma_k9: +P_SIGMA_K9.toFixed(6),
    pEcoll_k9: +P_ECOLL_K9.toFixed(6),
    sigmaHi_k9: +SIGMA_HI_K9.toFixed(6),
    humpPeak: +HUMP_PEAK_MEASURED.toExponential(6), // ~6.47579e-2, matches imp-33809
  },
  closedForm: {
    leading_ln10_over_32: +CF_PEAK_LEADING.toExponential(6), // ~7.19558e-2
    corrected_pEcoll2_ln10_over_8: +CF_PEAK_CORRECTED.toExponential(6), // ~6.55527e-2
  },
  residual: {
    leading_relative: +RESID_LEADING.toExponential(4), // ~+1.1115e-1 (+11.12%)
    corrected_relative: +RESID_CORRECTED.toExponential(4), // ~+1.227e-2 (+1.23%)
    tightening_factor: +(Math.abs(RESID_LEADING) / Math.abs(RESID_CORRECTED)).toFixed(2), // ~9x
  },
  finding: {
    D1_crossover_is_curvature_max:
      'Bisecting E_coll = E_trunc reproduces the imp-3444/imp-33723 crossover N ~ 3.2803e9 with ' +
      'sigma(N_cross) ~ 0.49953 ~ 1/2, so the logistic curvature sigma (1 - sigma) is at its maximum ' +
      'exactly at the crossover -- the analytic reason imp-33809 found the hump argmax at k = 9.',
    D2_leading_closed_form_overshoots_11pct:
      'The leading closed form CF0 = ln 10 / 32 ~ 7.19558e-2 overshoots the imp-33809 measured ' +
      'decade-peak 6.47579e-2 by +11.12%; the overshoot is structural (CF0 is the continuous pointwise ' +
      'curvature at the exact crossover N, the measured hump a discrete decade OLS with sigma_hi at the ' +
      'decade endpoint, not sigma = 1/2 at the interior crossover).',
    D3_restoring_pEcoll_closes_to_1pct:
      'The collision exponent is not exactly 1/2 (log T0 drift pulls p_ecoll to ~0.47724 over the ' +
      'k = 9 decade); since the curvature carries p_ecoll^2, restoring it drops the closed form to ' +
      'p_ecoll^2 ln 10 / 8 ~ 6.55527e-2, a +1.23% residual -- a ~9x tightening, so ~90% of the leading ' +
      'gap is the p_ecoll = 1/2 approximation and only ~1.2% is discrete-OLS-vs-continuous-curvature.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). YES -- the imp-33810-surviving M3 hump peak admits ' +
    'a closed form: it is the MAXIMUM of the logistic curvature of sigma, hump_peak ~ (1/2) p_ecoll^2 ' +
    'sigma (1 - sigma) ln 10, attained at sigma = 1/2 which by the component model IS the ' +
    'E_coll = E_trunc crossover (bisection gives N ~ 3.2803e9, sigma ~ 0.49953), analytically ' +
    'explaining why imp-33809 found the hump argmax at the k = 9 crossover decade. The leading closed ' +
    'form CF0 = ln 10 / 32 ~ 7.19558e-2 matches the imp-33809 measured peak 6.47579e-2 to +11.12%, and ' +
    'restoring the measured collision exponent p_ecoll ~ 0.47724 (the imp-33620/imp-33727 log T0 drift ' +
    'below 1/2) tightens the closed form to p_ecoll^2 ln 10 / 8 ~ 6.55527e-2, a +1.23% residual (~9x ' +
    'tighter) -- the same leading-then-correction pattern imp-33723 used for the crossover N. So the ' +
    'peak is closed-form to ~1% once the log T0 drift is restored, with the residual being the ' +
    'discrete-decade-OLS-vs-continuous-curvature and higher-order Taylor terms. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33809 (M3 hump peak located numerically at k=9); imp-33810 (M2 refutation leaving M3 standing); ' +
    'imp-33723 (closed-form Banach crossover N ~ 3.2803e9); imp-3444 (E_coll = E_trunc crossover ' +
    'landmark); imp-33620/imp-33727 (separated-E_coll exponent ladder, log T0 drift); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33844_HUMP_PEAK_CLOSED_FORM_ASSERTIONS = [
  {
    // (Reuse gate) The recomputed k=9 measured hump reproduces the imp-33809 published peak 6.4758e-2.
    id: 'imp33844-reproduces-imp33809-peak',
    description: 'recomputed k=9 hump peak matches the imp-33809 published 6.4758e-2 to <5e-4',
    holds: () => Math.abs(HUMP_PEAK_MEASURED - 6.4758e-2) < 5e-4,
  },
  {
    // (D1) The E_coll = E_trunc crossover reproduces imp-33723 N and sits at sigma ~ 1/2 (curvature max).
    id: 'imp33844-crossover-is-sigma-half',
    description: 'bisected crossover N ~ 3.2803e9 (imp-33723) with sigma ~ 1/2 (logistic curvature maximum)',
    holds: () =>
      Math.abs(N_CROSS - 3.280294e9) / 3.280294e9 < 1e-3 &&
      Math.abs(SIGMA_CROSS - 0.5) < 5e-3,
  },
  {
    // (D2) The leading closed form ln10/32 overshoots the measured peak by ~11% (signed positive).
    id: 'imp33844-leading-cf-overshoots-11pct',
    description: 'CF0 = ln10/32 ~ 7.1956e-2 overshoots the measured peak, relative residual in (0.08, 0.14)',
    holds: () =>
      Math.abs(CF_PEAK_LEADING - LN10 / 32) < 1e-12 &&
      RESID_LEADING > 0.08 &&
      RESID_LEADING < 0.14,
  },
  {
    // (D3) Restoring the measured p_ecoll tightens the closed form to ~1% (>=5x tighter than leading).
    id: 'imp33844-corrected-cf-within-2pct',
    description: 'p_ecoll^2 ln10/8 residual < 2% and >= 5x tighter than the leading ln10/32 residual',
    holds: () =>
      Math.abs(RESID_CORRECTED) < 0.02 &&
      Math.abs(RESID_LEADING) / Math.abs(RESID_CORRECTED) >= 5,
  },
  {
    // Honesty gate: derivation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33844-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, crossover sigma ~ 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP33844_HUMP_PEAK_CLOSED_FORM.isRigorous === false &&
      Math.abs(IMP33844_HUMP_PEAK_CLOSED_FORM.sigmaAtCrossover - 0.5) < 5e-3 &&
      /NO QED/.test(IMP33844_HUMP_PEAK_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP33844_HUMP_PEAK_CLOSED_FORM.verdict),
  },
];

for (const a of IMP33844_HUMP_PEAK_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33844-hump-peak-closed-form assertion failed: ${a.id}`);
  }
}
