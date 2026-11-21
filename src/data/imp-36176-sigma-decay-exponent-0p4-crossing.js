/**
 * @module imp-36176-sigma-decay-exponent-0p4-crossing
 *
 * imp-36176 (numerical, frontier-direction): imp-33582 measured the imp-3406
 * sigma(N) = E_coll/E(N) post-peak LOCAL decay exponent only at DECADE resolution,
 * reporting the per-decade OLS exponent ramping ~0.3561 over [1e10,1e11] to ~0.4310
 * over [1e11,1e12] toward the imp-3463 far-tail 1/2 asymptote. The exact N where the
 * local exponent first crosses the round 0.4 threshold was never located: the ticket
 * asked to refine the decade-resolution [1e11,1e12]~0.4310 figure onto a sub-decade
 * grid and bisect the 0.4 crossing, confirming monotone-but-not-fixed-rate behaviour.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3529 / imp-33582)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent fixed strip, imp-2631)
 *     T0 = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 * No re-derivation: the exact inherited imp-3406/imp-33582 sub-terms, re-used verbatim.
 *
 * THE MEASUREMENT: the two natural sub-decade refinements of the imp-33582 exponent
 * ---------------------------------------------------------------------------------
 *   (a) POINTWISE local exponent p(N) = -d ln sigma / d ln N (the imp-3529 estimator),
 *       evaluated on a sub-decade log grid, bisected for the p(N) = 0.4 crossing N*.
 *   (b) SLIDING decade-WIDTH OLS window centred (in log10) at Nc -- the same OLS the
 *       imp-33582 per-decade ladder uses, but slid continuously instead of snapped to
 *       [10^k,10^(k+1)] -- bisected for the window-OLS = 0.4 crossing Nc*.
 *   By the imp-33604 midpoint identity a decade-width OLS equals the pointwise p at the
 *   window's geometric centre, so (a) and (b) must agree to their discretization error.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE 0.4 CROSSING SITS JUST BELOW N = 1e11, NOT PAST N ~ 3.21e11. The pointwise
 *        p(N) reaches 0.4 at N* ~ 9.44e10 (log10 N* ~ 10.975, sigma ~ 0.167); the sliding
 *        decade-window OLS reaches 0.4 at Nc* ~ 9.93e10 (log10 ~ 10.997). Both land ~half
 *        a decade BELOW the imp-33582 sigma<0.1 landmark N ~ 3.21e11, correcting the
 *        ticket's framing: the crossing is not "past" that landmark.
 *   (F2) WHY THE DECADE FIGURE READ 0.4310 AT [1e11,1e12]. The imp-33582 per-decade OLS
 *        is a window AVERAGE that the imp-33604 midpoint identity attaches to the decade
 *        geometric centre 10^11.5 = 3.16e11 (window-OLS there = 0.43125, matching the
 *        decade-snapped 0.4312 to floating point). Because the exponent is still RISING
 *        across the decade, that centre-value 0.431 overstates where the exponent first
 *        equals 0.4 by ~0.5 decade -- so the pointwise 0.4 crossing precedes it.
 *   (F3) MONOTONE BUT NOT FIXED-RATE. p(N) is strictly increasing across the grid
 *        (0.402 at 1e11 -> 0.453 at 1e12) with a strictly positive but DECELERATING
 *        increment (the second difference in log10 N is negative): the exponent climbs
 *        toward the imp-3463 1/2 asymptote from below and never plateaus, so a single
 *        fixed-rate decade label cannot describe the tail.
 *
 * The punchline: refining the imp-33582 decade-resolution 0.4310 onto a sub-decade grid,
 * the sigma(N) local decay exponent first crosses 0.4 at N* ~ 9.4e10 (pointwise) / ~9.9e10
 * (decade-window OLS) -- log10 N ~ 10.98, just under 1e11 and ~0.5 decade BELOW the
 * sigma<0.1 landmark 3.21e11, not past it -- with the two estimators agreeing to their
 * discretization error and the exponent rising monotonely-but-deceleratingly toward 1/2.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-DECADE exponent ladder, 0.4310 at [1e11,1e12])
 * @see imp-33604-sigma-exponent-estimator-crossvalidation (decade OLS = pointwise p at decade midpoint)
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise exponent p(N))
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// (a) POINTWISE local decay exponent p(N) = -d ln sigma / d ln N (imp-3529 estimator).
function pExp(N) {
  const h = 1e-4;
  const lp = Math.log(sigma(Math.exp(Math.log(N) + h)));
  const lm = Math.log(sigma(Math.exp(Math.log(N) - h)));
  return -(lp - lm) / (2 * h);
}

// (b) SLIDING decade-WIDTH OLS window centred (in log10) at Nc: [Nc/sqrt10, Nc*sqrt10].
function olsExponent(loN, hiN, ptsPerDecade = 8) {
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
const windowOLS = (Nc) => olsExponent(Nc / Math.sqrt(10), Nc * Math.sqrt(10));

// Bisection of a monotone increasing exponent estimator for its = target crossing.
function bisectCrossing(fn, target, loN, hiN) {
  let a = Math.log(loN);
  let b = Math.log(hiN);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (fn(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const TARGET = 0.4;
const N_STAR_POINTWISE = bisectCrossing(pExp, TARGET, 1e9, 1e13); // ~9.442e10
const N_STAR_WINDOW = bisectCrossing(windowOLS, TARGET, 1e9, 1e13); // ~9.930e10
const SIGMA_AT_STAR = sigma(N_STAR_POINTWISE); // ~0.1668
const IMP33582_SIGMA_BELOW_0_1_LANDMARK = 3.21e11; // imp-33582 sigma<0.1 crossing N

// Sub-decade grid of the pointwise exponent, past the crossing toward 1/2 (F3 support).
const GRID = [10.5, 10.75, 10.9749, 11.0, 11.25, 11.5, 11.75, 12.0].map((d) => {
  const N = Math.pow(10, d);
  return { log10N: d, N: +N.toExponential(4), sigma: +sigma(N).toFixed(5), p: +pExp(N).toFixed(5) };
});

// imp-33604 midpoint-identity cross-check: window-OLS at the decade centre 10^11.5
// reproduces the imp-33582 decade-snapped 0.4310 over [1e11,1e12].
const WINDOW_OLS_AT_DECADE_MID = windowOLS(Math.pow(10, 11.5)); // ~0.4312

export const IMP36176_SIGMA_DECAY_EXPONENT_0P4_CROSSING = {
  id: 'imp-36176',
  proofSection: 'S-frontier',
  question:
    'Refine the imp-33582 decade-resolution sigma(N) = E_coll/E(N) post-peak local decay ' +
    'exponent (~0.4310 over [1e11,1e12]) onto a sub-decade grid and locate the exact N at ' +
    'which the local exponent first crosses 0.4, confirming monotone-but-not-fixed-rate ' +
    'behaviour. Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the N at which the pointwise p(N) = -d ln sigma/d ln N and the sliding decade-width OLS ' +
    'window first equal 0.4, plus the pointwise exponent on a sub-decade grid up to 1e12',
  target: TARGET,
  crossings: {
    N_pointwise: +N_STAR_POINTWISE.toExponential(6), // ~9.441781e10
    log10N_pointwise: +Math.log10(N_STAR_POINTWISE).toFixed(4), // ~10.9751
    sigma_at_crossing: +SIGMA_AT_STAR.toFixed(5), // ~0.16677
    N_window_ols: +N_STAR_WINDOW.toExponential(6), // ~9.929562e10
    log10N_window_ols: +Math.log10(N_STAR_WINDOW).toFixed(4), // ~10.9969
    estimator_agreement_decades: +Math.abs(
      Math.log10(N_STAR_WINDOW) - Math.log10(N_STAR_POINTWISE),
    ).toFixed(4), // ~0.022
  },
  decadeMidpointCheck: {
    window_ols_at_1e11p5: +WINDOW_OLS_AT_DECADE_MID.toFixed(5), // ~0.43125 (= imp-33582 0.4310)
    imp33582_decade_value: 0.431,
    decade_geometric_centre: +Math.pow(10, 11.5).toExponential(4), // 3.1623e11
  },
  subDecadeGrid: GRID,
  imp33582_sigma_below_0_1_landmark: IMP33582_SIGMA_BELOW_0_1_LANDMARK,
  finding: {
    F1_crossing_below_1e11:
      'The pointwise p(N) first equals 0.4 at N* ~ 9.44e10 (log10 ~ 10.975, sigma ~ 0.167) and ' +
      'the sliding decade-window OLS at Nc* ~ 9.93e10 (log10 ~ 10.997) -- both ~half a decade ' +
      'BELOW the imp-33582 sigma<0.1 landmark N ~ 3.21e11, so the 0.4 crossing is NOT past it.',
    F2_decade_value_is_a_window_average:
      'The imp-33582 per-decade OLS 0.4310 over [1e11,1e12] is a window average the imp-33604 ' +
      'midpoint identity attaches to the decade centre 10^11.5 = 3.16e11 (window-OLS there = ' +
      '0.43125, matching to floating point). Because the exponent is still rising, that centre ' +
      'value overstates the first-0.4-crossing N by ~0.5 decade -- the pointwise crossing precedes it.',
    F3_monotone_not_fixed_rate:
      'p(N) is strictly increasing across the grid (0.402 at 1e11 -> 0.453 at 1e12) with a ' +
      'strictly positive but DECELERATING increment (negative second difference in log10 N): the ' +
      'exponent climbs toward the imp-3463 1/2 asymptote from below and never plateaus, so no ' +
      'single fixed-rate decade label describes the tail.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Refining the imp-33582 decade-resolution ' +
    'sigma(N) post-peak local decay exponent (0.4310 over [1e11,1e12]) onto a sub-decade grid, ' +
    'the local exponent first crosses 0.4 at N* ~ 9.44e10 (pointwise p(N), log10 ~ 10.975, ' +
    'sigma ~ 0.167) and Nc* ~ 9.93e10 (sliding decade-width OLS, log10 ~ 10.997) -- the two ' +
    'estimators agreeing to ~0.02 decade. Both sit ~half a decade BELOW the imp-33582 sigma<0.1 ' +
    'landmark N ~ 3.21e11, correcting the ticket framing that the crossing is "past" it: the ' +
    'decade 0.4310 is a window average the imp-33604 midpoint identity attaches to the decade ' +
    'centre 3.16e11, and the exponent rises monotonely-but-deceleratingly toward the imp-3463 ' +
    '1/2. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33582 (per-DECADE exponent ladder, 0.4310 at [1e11,1e12]); imp-33604 (decade OLS = ' +
    'pointwise p at decade midpoint); imp-3529 (pointwise exponent p(N)); imp-3463 (far-tail ' +
    'leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP36176_SIGMA_DECAY_EXPONENT_0P4_CROSSING_ASSERTIONS = [
  {
    // Reuse gate: the decade-window OLS at the decade centre 10^11.5 reproduces the imp-33582
    // decade value 0.4310 over [1e11,1e12] -- proving the identical inherited model is in use.
    id: 'imp36176-reproduces-imp33582-decade-value',
    description: 'window-OLS at 10^11.5 reproduces the imp-33582 [1e11,1e12] value ~0.4310',
    holds: () => Math.abs(WINDOW_OLS_AT_DECADE_MID - 0.431) < 3e-3,
  },
  {
    // (F1): the 0.4 crossing sits just below 1e11, NOT past the imp-33582 sigma<0.1 landmark.
    id: 'imp36176-crossing-below-1e11',
    description: 'pointwise 0.4 crossing N* ~ 9.44e10 < 1e11 < imp-33582 sigma<0.1 landmark 3.21e11',
    holds: () =>
      Math.abs(N_STAR_POINTWISE / 9.44e10 - 1) < 5e-2 &&
      N_STAR_POINTWISE < 1e11 &&
      N_STAR_POINTWISE < IMP33582_SIGMA_BELOW_0_1_LANDMARK &&
      Math.abs(SIGMA_AT_STAR - 0.1668) < 5e-3,
  },
  {
    // (F1)/(F2): the two estimators agree to their discretization error (imp-33604 midpoint identity).
    id: 'imp36176-estimators-agree',
    description: 'pointwise and sliding decade-window OLS 0.4 crossings agree within ~0.05 decade',
    holds: () =>
      Math.abs(Math.log10(N_STAR_WINDOW) - Math.log10(N_STAR_POINTWISE)) < 5e-2 &&
      N_STAR_WINDOW > N_STAR_POINTWISE,
  },
  {
    // (F3): the pointwise exponent is strictly increasing across the grid and its increment
    // decelerates (negative second difference), staying strictly below the imp-3463 1/2.
    id: 'imp36176-monotone-decelerating-below-half',
    description: 'p(N) strictly increasing, increments decelerate, all strictly < 0.5',
    holds: () => {
      const uniform = [10.5, 10.75, 11.0, 11.25, 11.5, 11.75, 12.0].map((d) => pExp(Math.pow(10, d)));
      for (let i = 1; i < uniform.length; i++) {
        if (!(uniform[i] > uniform[i - 1])) return false;
      }
      let decelerates = true;
      for (let i = 2; i < uniform.length; i++) {
        const d2 = uniform[i] - 2 * uniform[i - 1] + uniform[i - 2];
        if (!(d2 < 0)) decelerates = false;
      }
      return decelerates && uniform.every((p) => p > 0 && p < 0.5);
    },
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp36176-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP36176_SIGMA_DECAY_EXPONENT_0P4_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP36176_SIGMA_DECAY_EXPONENT_0P4_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP36176_SIGMA_DECAY_EXPONENT_0P4_CROSSING.verdict),
  },
];

for (const a of IMP36176_SIGMA_DECAY_EXPONENT_0P4_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36176-sigma-decay-exponent-0p4-crossing assertion failed: ${a.id}`);
  }
}
