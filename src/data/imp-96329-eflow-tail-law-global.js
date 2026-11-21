/**
 * @module imp-96329-eflow-tail-law-global
 *
 * imp-96329 (numerical, frontier-direction): MEASURE the imp-96308 reconstruction-tail law
 * err_k = -sigma_CF*(-x)^(k+1)/(1+x) across the FULL N ladder (1e3..1e9), not only at the peak,
 * and at FOURTH order, to confirm the closed-form tail holds pointwise everywhere.
 *
 * imp-96308 measured the E_flow peak-recovery residual at third order (1 - x + x^2 - x^3) AT THE
 * PEAK N* only, confirming the ~x-per-order shrink there. The exact tail
 *     err_k = sigma_CF*(S_k - 1/(1+x)) = -sigma_CF*(-x)^(k+1)/(1+x)
 * is an algebraic identity claimed to hold everywhere but was only checked at the peak. This module
 * measures err_k across the full N ladder at k=1,2,3,4 and confirms the closed form matches
 * pointwise, and that the fourth-order reconstruction (1 - x + x^2 - x^3 + x^4) location/height
 * peak errors continue the monotone ~x-per-order shrink toward the exact 1/(1+x) identity off-peak.
 *
 * THE SETUP (exact inherited sub-terms, identical to imp-96308/imp-96286; no re-derivation)
 * ----------------------------------------------------------------------------------------
 * sigma_full(N) = E_coll/(E_trunc + E_flow + E_coll), sigma_CF(N) = E_coll/(E_trunc + E_coll)
 * (the E_flow-dropped closed form). With x(N) = E_flow(N)/(E_trunc + E_coll(N)) the full share is
 * the EXACT geometric relation sigma_full = sigma_CF/(1 + x). The k-th reconstruction keeps the
 * degree-k Taylor partial sum S_k = Sum_{j=0..k} (-x)^j; its exact error is the tail
 *     err_k = -sigma_CF*(-x)^(k+1)/(1+x).
 * Every constant is the exact inherited imp-3406/imp-33582/imp-33723 value; no fresh fit, no new
 * model, no zeros bundle.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE EXACT GEOMETRIC IDENTITY sigma_full = sigma_CF/(1+x) HOLDS POINTWISE TO MACHINE
 *        PRECISION ACROSS 1e3..1e9. The worst relative gap between the parts-built sigma_full and
 *        the closed form sigma_CF/(1+x) over a 25-point log ladder is < 3e-16 (float rounding), the
 *        algebraic backbone the tail law rests on.
 *   (M2) THE CLOSED-FORM TAIL err_k = -sigma_CF*(-x)^(k+1)/(1+x) MATCHES THE MEASURED RESIDUAL
 *        recon_k - sigma_full POINTWISE ACROSS THE FULL LADDER. Worst relative mismatch over
 *        1e3..1e9: k=1 -> 2.21e-11, k=2 -> 2.19e-8, k=3 -> 2.03e-5, k=4 -> 1.40e-2. The tail law is
 *        confirmed globally, not only at the peak.
 *   (M3) THE k-GROWING MISMATCH IS THE FLOAT CANCELLATION FLOOR, NOT A MODEL DEVIATION. Measuring
 *        recon_k - sigma_full directly subtracts two O(sigma) quantities whose difference is
 *        O(sigma_CF*x^(k+1)); the catastrophic-cancellation floor is eps_mach*(1+x)/x^(k+1) ~
 *        eps/x^(k+1). At the worst point N=1e9 (x=1.889e-3): eps/x^2=6.2e-11, eps/x^3=3.3e-8,
 *        eps/x^4=1.7e-5, eps/x^5=9.2e-3 -- matching the measured 2.21e-11 / 2.19e-8 / 2.03e-5 /
 *        1.40e-2 order for order. The closed form is EXACT; the growth is arithmetic, not physics.
 *   (M4) THE PER-ORDER SHRINK |err_k|/|err_(k-1)| = x HOLDS EXACTLY POINTWISE AT EVERY N (OFF-PEAK
 *        TOO). Evaluated on the closed-form tail (cancellation-free), the ratio equals x(N) to
 *        < 1e-12 at every ladder point: 1.5956e-1 at N=1e3, 6.0472e-2 at N=1e5, 1.4143e-2 at N=1e7,
 *        1.8890e-3 at N=1e9. The imp-96308 "~x shrink per order" is not a peak artifact; it is the
 *        exact tail structure everywhere.
 *   (M5) FOURTH-ORDER PEAK RECOVERY CONTINUES THE MONOTONE SHRINK. The reconstruction
 *        1 - x + x^2 - x^3 + x^4 drops the peak location error from the imp-96308 third-order value
 *        1.84e-4 to 7.20e-6 and the height error from 9.41e-7 to 2.97e-8. The height shrink
 *        order3/order4 is 31.69 = 1/x_peak exactly; the location shrink is 25.49 = (4/5)/x_peak
 *        (the same (k/(k+1))/x law, now with k=4). Location errors 9.08e-2 -> 4.37e-3 -> 1.84e-4 ->
 *        7.20e-6 and heights 9.19e-4 -> 2.99e-5 -> 9.41e-7 -> 2.97e-8 both continue monotonically to
 *        the exact 1/(1+x) identity. No new obstruction.
 *
 * The punchline: the imp-96308 tail law, checked only at the peak, holds POINTWISE across the whole
 * N ladder and at fourth order. sigma_full = sigma_CF/(1+x) is exact to machine precision; the
 * closed-form tail err_k = -sigma_CF*(-x)^(k+1)/(1+x) reproduces recon_k - sigma_full down to the
 * float cancellation floor eps/x^(k+1); and |err_k|/|err_(k-1)| = x exactly at every N, not just at
 * the peak.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-96308-eflow-peak-third-order-shrink (third-order tail measured AT THE PEAK only)
 * @see imp-96286-eflow-peak-location-error-order (M4 predicts the ~x shrink per order)
 * @see imp-96266-eflow-peak-recovery-residual (first-order reconstruction)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (closed-form share model)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross fixed point)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96308

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (identical to imp-96308; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_trunc: E_TRUNC_PT, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// imp-33723 closed-form crossover fixed point (identical to imp-96308).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9
const L_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
function sigmaCF(N) {
  const L = Math.log(effectiveHeightForN(N));
  return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
}
// x(N) = E_flow/(E_trunc+E_coll); sigma_full = sigmaCF/(1+x) is the exact geometric relation.
const xOf = (N) => {
  const p = parts(N);
  return p.E_flow / (p.E_trunc + p.E_coll);
};
// degree-k Taylor reconstruction sigma_CF * Sum_{j=0..k} (-x)^j.
function reconK(N, k) {
  const x = xOf(N);
  let sum = 0;
  let term = 1;
  for (let j = 0; j <= k; j++) {
    sum += term;
    term *= -x;
  }
  return sigmaCF(N) * sum;
}
// exact closed-form tail err_k = -sigma_CF*(-x)^(k+1)/(1+x).
function tailK(N, k) {
  const x = xOf(N);
  return -sigmaCF(N) * Math.pow(-x, k + 1) / (1 + x);
}
const reconExact = (N) => sigmaCF(N) / (1 + xOf(N)); // full geometric sum == sigma_full (identity)

// FULL N ladder 1e3..1e9 on a 25-point log grid (0.25-decade steps).
const N_LADDER = [];
for (let e = 3; e <= 9 + 1e-9; e += 0.25) N_LADDER.push(Math.pow(10, e));

// (M1) exact geometric identity sigma_full == sigmaCF/(1+x) pointwise.
let IDENTITY_WORST_REL = 0;
for (const N of N_LADDER) {
  const rel = Math.abs(sigmaFull(N) / reconExact(N) - 1);
  if (rel > IDENTITY_WORST_REL) IDENTITY_WORST_REL = rel;
}

// (M2)/(M3) global tail match: worst |measured - closed|/|closed| over the ladder per order.
function worstTailMismatch(k) {
  let worst = 0;
  let worstN = 0;
  for (const N of N_LADDER) {
    const measured = reconK(N, k) - sigmaFull(N); // direct residual (cancellation-prone)
    const closed = tailK(N, k); // exact closed form
    const rel = Math.abs(measured - closed) / Math.max(Math.abs(closed), 1e-300);
    if (rel > worst) {
      worst = rel;
      worstN = N;
    }
  }
  return { worst, worstN };
}
const TAIL_MATCH = [1, 2, 3, 4].map((k) => ({ k, ...worstTailMismatch(k) }));

// float cancellation floor eps*(1+x)/x^(k+1) at the worst ladder point (N=1e9).
const EPS_MACH = Number.EPSILON; // 2.220446e-16
const X_HIGH = xOf(1e9);
const CANCEL_FLOOR = [1, 2, 3, 4].map(
  (k) => EPS_MACH * (1 + X_HIGH) / Math.pow(X_HIGH, k + 1)
);

// (M4) per-order shrink |err_k|/|err_(k-1)| = x pointwise (evaluated on the cancellation-free tail).
function shrinkEqualsXWorst() {
  let worst = 0;
  for (const N of N_LADDER) {
    const x = xOf(N);
    for (let k = 2; k <= 4; k++) {
      const ratio = Math.abs(tailK(N, k)) / Math.abs(tailK(N, k - 1));
      const rel = Math.abs(ratio / x - 1);
      if (rel > worst) worst = rel;
    }
  }
  return worst;
}
const SHRINK_EQUALS_X_WORST = shrinkEqualsXWorst();

// (M5) fourth-order peak recovery. Peak locator identical to imp-96308 (6 log-grid passes).
function findPeak(f) {
  let bestN = 0;
  let bestS = -1;
  let lo = 4;
  let hi = 8;
  for (let iter = 0; iter < 6; iter++) {
    const step = (hi - lo) / 400;
    bestS = -1;
    for (let d = lo; d <= hi + 1e-12; d += step) {
      const N = Math.pow(10, d);
      const s = f(N);
      if (s > bestS) {
        bestS = s;
        bestN = N;
      }
    }
    const db = Math.log10(bestN);
    lo = db - step;
    hi = db + step;
  }
  return { N: bestN, sigma: bestS };
}
const PEAK_FULL = findPeak(sigmaFull);
const relLoc = (p) => Math.abs(p.N / PEAK_FULL.N - 1);
const absHt = (p) => Math.abs(p.sigma - PEAK_FULL.sigma);

const PEAK_O1 = findPeak((N) => reconK(N, 1));
const PEAK_O2 = findPeak((N) => reconK(N, 2));
const PEAK_O3 = findPeak((N) => reconK(N, 3));
const PEAK_O4 = findPeak((N) => reconK(N, 4));

const LOC_ERR = [relLoc(PEAK_O1), relLoc(PEAK_O2), relLoc(PEAK_O3), relLoc(PEAK_O4)]; // o1..o4
const HT_ERR = [absHt(PEAK_O1), absHt(PEAK_O2), absHt(PEAK_O3), absHt(PEAK_O4)];
const X_AT_PEAK = xOf(PEAK_FULL.N); // ~3.1552e-2
const INV_X = 1 / X_AT_PEAK; // ~31.69
const HT_SHRINK_O3_TO_O4 = HT_ERR[2] / HT_ERR[3]; // ~31.69 = 1/x
const LOC_SHRINK_O3_TO_O4 = LOC_ERR[2] / LOC_ERR[3]; // ~25.49 = (4/5)/x

export const IMP96329_EFLOW_TAIL_LAW_GLOBAL = {
  id: 'imp-96329',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-96308 reconstruction-tail law err_k = -sigma_CF*(-x)^(k+1)/(1+x) across the ' +
    'FULL N ladder (1e3..1e9), not only at the peak, and at fourth order, to confirm it holds ' +
    'pointwise. Measurement only; conditional-share diagnostic; no QED.',
  exactRelation:
    'sigma_full = sigma_CF/(1 + x), x = E_flow/(E_trunc+E_coll). The degree-k Taylor reconstruction ' +
    'sigma_CF*Sum_{j=0..k}(-x)^j has the exact error err_k = -sigma_CF*(-x)^(k+1)/(1+x); each higher ' +
    'order removes one more factor of x. This module confirms that identity POINTWISE over 1e3..1e9.',
  ladder: {
    range: '1e3..1e9',
    points: N_LADDER.length, // 25 (0.25-decade steps)
    identity_worst_rel: +IDENTITY_WORST_REL.toExponential(3), // < 3e-16 (machine precision)
  },
  tailMatch: {
    // worst relative mismatch between measured (recon_k - sigma_full) and the closed-form tail.
    order1: +TAIL_MATCH[0].worst.toExponential(3), // ~2.21e-11
    order2: +TAIL_MATCH[1].worst.toExponential(3), // ~2.19e-8
    order3: +TAIL_MATCH[2].worst.toExponential(3), // ~2.03e-5
    order4: +TAIL_MATCH[3].worst.toExponential(3), // ~1.40e-2
    worst_at_N: +TAIL_MATCH[3].worstN.toExponential(3), // 1.000e+9 (largest x cancellation)
    // float cancellation floor eps*(1+x)/x^(k+1) at N=1e9 -- matches the mismatch order for order.
    cancellation_floor_order1: +CANCEL_FLOOR[0].toExponential(3), // ~6.2e-11
    cancellation_floor_order2: +CANCEL_FLOOR[1].toExponential(3), // ~3.3e-8
    cancellation_floor_order3: +CANCEL_FLOOR[2].toExponential(3), // ~1.7e-5
    cancellation_floor_order4: +CANCEL_FLOOR[3].toExponential(3), // ~9.2e-3
  },
  perOrderShrink: {
    // |err_k|/|err_(k-1)| on the cancellation-free closed-form tail equals x(N) pointwise.
    ratio_equals_x_worst_rel: +SHRINK_EQUALS_X_WORST.toExponential(3), // < 1e-12
    x_at_1e3: +xOf(1e3).toExponential(4), // ~1.5956e-1
    x_at_1e5: +xOf(1e5).toExponential(4), // ~6.0472e-2
    x_at_1e7: +xOf(1e7).toExponential(4), // ~1.4143e-2
    x_at_1e9: +xOf(1e9).toExponential(4), // ~1.8890e-3
  },
  fourthOrderPeak: {
    order1_loc: +LOC_ERR[0].toExponential(3), // ~9.08e-2
    order2_loc: +LOC_ERR[1].toExponential(3), // ~4.37e-3
    order3_loc: +LOC_ERR[2].toExponential(3), // ~1.84e-4
    order4_loc: +LOC_ERR[3].toExponential(3), // ~7.20e-6 (measured here)
    order1_height: +HT_ERR[0].toExponential(3), // ~9.19e-4
    order2_height: +HT_ERR[1].toExponential(3), // ~2.99e-5
    order3_height: +HT_ERR[2].toExponential(3), // ~9.41e-7
    order4_height: +HT_ERR[3].toExponential(3), // ~2.97e-8 (measured here)
    order4_peak_N: +PEAK_O4.N.toExponential(6), // ~9.218565e5
    x_at_peak: +X_AT_PEAK.toExponential(4), // ~3.1552e-2
    inv_x_at_peak: +INV_X.toFixed(2), // ~31.69
    height_shrink_order3_to_order4: +HT_SHRINK_O3_TO_O4.toFixed(2), // ~31.69 = 1/x
    location_shrink_order3_to_order4: +LOC_SHRINK_O3_TO_O4.toFixed(2), // ~25.49 = (4/5)/x
  },
  finding: {
    M1_exact_identity_pointwise:
      'sigma_full = sigma_CF/(1+x) holds pointwise to machine precision across 1e3..1e9 (worst ' +
      'relative gap < 3e-16), the algebraic backbone the tail law rests on.',
    M2_tail_law_matches_globally:
      'The closed-form tail err_k = -sigma_CF*(-x)^(k+1)/(1+x) reproduces the measured residual ' +
      'recon_k - sigma_full pointwise over the full ladder: worst relative mismatch 2.21e-11 (k=1), ' +
      '2.19e-8 (k=2), 2.03e-5 (k=3), 1.40e-2 (k=4). The tail law is confirmed globally, not only at ' +
      'the peak.',
    M3_growth_is_cancellation_floor:
      'The k-growing mismatch is the float cancellation floor, not a model deviation: measuring ' +
      'recon_k - sigma_full subtracts two O(sigma) numbers whose difference is O(sigma_CF*x^(k+1)), ' +
      'so the floor is eps*(1+x)/x^(k+1) ~ eps/x^(k+1). At N=1e9 (x=1.889e-3) the floor is 6.2e-11 / ' +
      '3.3e-8 / 1.7e-5 / 9.2e-3, matching the measured mismatch order for order. The closed form is ' +
      'exact; the growth is arithmetic, not physics.',
    M4_per_order_shrink_equals_x_pointwise:
      'On the cancellation-free closed-form tail the per-order ratio |err_k|/|err_(k-1)| equals x(N) ' +
      'to < 1e-12 at every ladder point: 1.5956e-1 (1e3), 6.0472e-2 (1e5), 1.4143e-2 (1e7), ' +
      '1.8890e-3 (1e9). The imp-96308 ~x-per-order shrink is not a peak artifact; it is the exact ' +
      'tail structure everywhere.',
    M5_fourth_order_peak_continues_shrink:
      'The reconstruction 1 - x + x^2 - x^3 + x^4 drops the peak location error from 1.84e-4 to ' +
      '7.20e-6 and the height error from 9.41e-7 to 2.97e-8. Height shrink order3/order4 = 31.69 = ' +
      '1/x_peak exactly; location shrink = 25.49 = (4/5)/x_peak (the same (k/(k+1))/x law with k=4). ' +
      'Both channels continue monotonically to the exact 1/(1+x) identity. No new obstruction.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-96308 reconstruction-tail law, checked ' +
    'only at the peak, holds POINTWISE across the full N ladder 1e3..1e9 and at fourth order. The ' +
    'exact geometric identity sigma_full = sigma_CF/(1+x) reproduces to machine precision (< 3e-16) ' +
    'everywhere; the closed-form tail err_k = -sigma_CF*(-x)^(k+1)/(1+x) matches the measured ' +
    'residual recon_k - sigma_full down to the float cancellation floor eps/x^(k+1) (worst mismatch ' +
    '2.21e-11 / 2.19e-8 / 2.03e-5 / 1.40e-2 for k=1..4, exactly the eps*(1+x)/x^(k+1) floor at the ' +
    'largest-x point N=1e9); and the per-order shrink |err_k|/|err_(k-1)| equals x(N) to < 1e-12 at ' +
    'every ladder point, off-peak included. The fourth-order reconstruction continues the monotone ' +
    'shrink (location 1.84e-4 -> 7.20e-6, height 9.41e-7 -> 2.97e-8; height by 1/x = 31.69, location ' +
    'by (4/5)/x = 25.49). No new obstruction. Measurement on the inherited sub-terms only; the C_mb ' +
    'GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96308 (third-order tail measured AT THE PEAK only); imp-96286 (M4 predicts the ~x shrink ' +
    'per order); imp-96266 (first-order reconstruction); imp-96151 (closed-form share model); ' +
    'imp-3220 (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33723 (closed-form crossover ' +
    'N_cross); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96329_EFLOW_TAIL_LAW_GLOBAL_ASSERTIONS = [
  {
    // (M1) exact geometric identity holds pointwise to machine precision across the full ladder.
    id: 'imp96329-identity-pointwise-machine-precision',
    description: 'sigma_full == sigma_CF/(1+x) to < 1e-14 across the 1e3..1e9 ladder',
    holds: () => IDENTITY_WORST_REL < 1e-14,
  },
  {
    // (M2) closed-form tail matches measured residual to high precision at k=1,2 (below cancellation).
    id: 'imp96329-tail-law-matches-globally-low-order',
    description: 'err_k closed form matches recon_k - sigma_full globally to < 1e-6 for k=1 and k=2',
    holds: () => TAIL_MATCH[0].worst < 1e-6 && TAIL_MATCH[1].worst < 1e-6,
  },
  {
    // (M3) the k-growing mismatch tracks the float cancellation floor, not a model deviation.
    id: 'imp96329-growth-is-cancellation-floor',
    description: 'worst k=3,4 mismatch stays within an order of magnitude of eps*(1+x)/x^(k+1)',
    holds: () =>
      TAIL_MATCH[2].worst < 10 * CANCEL_FLOOR[2] &&
      TAIL_MATCH[2].worst > 0.1 * CANCEL_FLOOR[2] &&
      TAIL_MATCH[3].worst < 10 * CANCEL_FLOOR[3] &&
      TAIL_MATCH[3].worst > 0.1 * CANCEL_FLOOR[3],
  },
  {
    // (M4) per-order shrink |err_k|/|err_(k-1)| equals x(N) pointwise everywhere (off-peak too).
    id: 'imp96329-per-order-shrink-equals-x-pointwise',
    description: 'closed-form tail ratio |err_k|/|err_(k-1)| == x(N) to < 1e-9 across the full ladder',
    holds: () => SHRINK_EQUALS_X_WORST < 1e-9,
  },
  {
    // (M5) fourth-order peak recovery drops both errors below the imp-96308 third-order values.
    id: 'imp96329-fourth-order-below-third-order',
    description: 'order-4 peak location error < order-3 1.84e-4 and height error < order-3 9.41e-7',
    holds: () =>
      LOC_ERR[3] < LOC_ERR[2] &&
      HT_ERR[3] < HT_ERR[2] &&
      LOC_ERR[3] < 5e-5 &&
      HT_ERR[3] < 5e-7,
  },
  {
    // (M5) fourth-order height shrink is 1/x and location shrink is (4/5)/x (same ~x law, k=4).
    id: 'imp96329-fourth-order-shrink-laws',
    description: 'height shrink order3/order4 ~ 1/x_peak and location shrink ~ (4/5)/x_peak within 5 percent',
    holds: () =>
      Math.abs(HT_SHRINK_O3_TO_O4 - INV_X) / INV_X < 0.05 &&
      Math.abs(LOC_SHRINK_O3_TO_O4 - 0.8 * INV_X) / (0.8 * INV_X) < 0.05,
  },
  {
    // (M5) monotone convergence across all four orders (both channels).
    id: 'imp96329-monotone-convergence-four-orders',
    description: 'location and height peak errors both fall monotonically order1>order2>order3>order4',
    holds: () =>
      LOC_ERR[0] > LOC_ERR[1] &&
      LOC_ERR[1] > LOC_ERR[2] &&
      LOC_ERR[2] > LOC_ERR[3] &&
      HT_ERR[0] > HT_ERR[1] &&
      HT_ERR[1] > HT_ERR[2] &&
      HT_ERR[2] > HT_ERR[3],
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96329-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96329_EFLOW_TAIL_LAW_GLOBAL.isRigorous === false &&
      /NO QED/.test(IMP96329_EFLOW_TAIL_LAW_GLOBAL.verdict) &&
      /refereed bound is changed/i.test(IMP96329_EFLOW_TAIL_LAW_GLOBAL.verdict),
  },
];

for (const a of IMP96329_EFLOW_TAIL_LAW_GLOBAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96329-eflow-tail-law-global assertion failed: ${a.id}`);
  }
}
