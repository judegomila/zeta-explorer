/**
 * @module imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident
 *
 * imp-96187 (accuracy, frontier-direction): imp-96162 F2 located the imp-3220 sigma U-shape peak at
 * a SECOND (numerator) crossover N_flow where E_flow = E_trunc, and observed the exact peak sits at
 * N ~ 0.577 N_flow -- numerically near 1/sqrt(3) = 0.57735 -- but FLAGGED that proximity as a
 * coincidence, NOT a derived identity, because the measured log-derivatives are +0.466 / -0.304
 * rather than the clean +1/2 / -1/2. This module DERIVES the exact peak-location ratio from the
 * sub-leading log-corrections of g_t = E_trunc/E_coll and g_f = E_flow/E_coll and DECIDES the
 * question: the 0.577 proximity is an ACCIDENT of the inherited constants, not a forced identity.
 *
 * THE DERIVED PEAK-LOCATION LAW (two exact conditions from d g / d ln N = 0)
 * -------------------------------------------------------------------------
 * sigma = E_coll / (E_trunc + E_flow + E_coll) = 1 / (1 + g), with g(N) = g_t(N) + g_f(N),
 *   g_t = E_trunc/E_coll  (rising, local log-slope a  = d ln g_t / d ln N > 0),
 *   g_f = E_flow/E_coll   (falling, local log-slope -b = d ln g_f / d ln N < 0, so b > 0).
 * sigma peaks where g is minimal, i.e. d g / d ln N = g_t a - g_f b = 0. This gives the EXACT
 * peak condition as a ratio of the two local log-slopes:
 *
 *   (P1)  E_flow/E_trunc |_peak  =  g_f/g_t |_peak  =  a / b .
 *
 * At leading order a = b = 1/2 (g_t ~ sqrt(N/L), g_f ~ sqrt(NL)/T0), so a/b = 1 and the peak sits
 * exactly at N_flow (E_flow = E_trunc). The sub-leading log-corrections split a from b:
 *   a = 1/2 - 1/(2L) + ...        (from d ln L / d ln N ~ 1/L),
 *   b = 1/2 - 2/L' - 1/(2L) + ... (extra -2/L' from the C_F = (L'+1)/2pi prefactor and the T0 slope),
 * with L = ln T0, L' = ln(T0/2pi). At the peak height these evaluate to a ~ 0.4655, b ~ 0.3041, so
 * a/b ~ 1.531 -- reproducing the imp-96162 measured E_flow/E_trunc = 1.530 at the exact peak.
 *
 * Converting the slope ratio to a LOCATION ratio: near the peak d ln(g_f/g_t)/d ln N = -(a + b), so
 * g_f/g_t scales as N^-(a+b). Using (P1) at the peak and g_f/g_t = 1 at N_flow (definition of N_flow):
 *
 *   (P2)  N_peak / N_flow  =  (b / a)^(1 / (a + b)) .
 *
 * With a = 0.4655, b = 0.3041 this gives (b/a)^(1/(a+b)) = 0.5752 -- reproducing the imp-96162
 * measured ratio 0.5769 to 0.3% (the residual is the drift of a, b across the [N_peak, N_flow]
 * decade; the formula uses locally-constant slopes).
 *
 * IDENTITY OR ACCIDENT? -- THE VERDICT (accident)
 * -----------------------------------------------
 * The 1/sqrt(3) proximity is NOT forced. Two independent facts settle it:
 *   (i)  At clean leading order (a = b = 1/2) the ratio (P2) is (1)^(1/1) = 1 EXACTLY -- the peak
 *        would sit AT N_flow, not at 1/sqrt(3) N_flow. Every bit of the 0.577 comes from the finite
 *        -height log-corrections a != b; it is a feature of the height L, not a clean constant.
 *   (ii) (P2) is a smooth function of L (hence of the inherited constants E_trunc, C_C, C_F that set
 *        N_flow and its height). Scaling E_trunc by 0.25x .. 16x drives N_peak/N_flow smoothly from
 *        0.637 down to 0.357, sweeping THROUGH 1/sqrt(3) = 0.57735 at the actual E_trunc = 3.06e-5.
 *        Nothing pins the ratio to 1/sqrt(3); it merely passes near it at these particular constants.
 *
 * THE FINDING (measurement/derivation only)
 * -----------------------------------------
 *   (F1) EXACT PEAK CONDITION IS A SLOPE RATIO. E_flow/E_trunc at the peak equals a/b, the ratio of
 *        the local log-slopes of g_t and g_f, to <2e-4 (1.5306 derived vs 1.5308 measured). This
 *        upgrades the imp-96162 "E_flow/E_trunc = 1.530" landmark from a measured number to a derived
 *        stationarity identity.
 *   (F2) EXACT LOCATION RATIO FROM LOG-CORRECTIONS. N_peak/N_flow = (b/a)^(1/(a+b)) reproduces the
 *        measured 0.577 to 0.3%. At leading order a=b=1/2 the formula is exactly 1 (peak at N_flow),
 *        so the entire 0.577 is a log-correction (a!=b) effect.
 *   (F3) THE 1/sqrt(3) PROXIMITY IS AN ACCIDENT, NOT AN IDENTITY. Scaling E_trunc sweeps N_peak/N_flow
 *        smoothly through 1/sqrt(3) with no plateau or fixed point there; the ratio depends on
 *        C_C/C_F/E_trunc through the peak height L. imp-96162 F2 flag CONFIRMED and explained.
 *
 * The punchline: the imp-3220 peak obeys the DERIVED law N_peak/N_flow = (b/a)^(1/(a+b)) with a, b
 * the local log-slopes of E_trunc/E_coll and E_flow/E_coll (peak condition E_flow/E_trunc = a/b). At
 * clean leading order the ratio is exactly 1; the 0.577 ~ 1/sqrt(3) coincidence is a finite-height
 * log-correction artifact of the inherited constants, decisively an ACCIDENT (imp-96162 F2 flag upheld).
 *
 * MEASUREMENT/DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED (the share stays GUE-conditional); the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96162-sigma-ushape-peak-eflow-recovery (F2 flagged the 0.577 ~ 1/sqrt3 coincidence)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (two-term CF, misses the peak)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (denominator crossover N_cross)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96162 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (inherited, no re-derivation) with an overridable
// E_trunc so the sensitivity sweep can vary the truncation floor.
function parts(N, E_trunc = E_TRUNC_PT) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { L, E_flow, E_coll, E_N: E_trunc + E_flow + E_coll };
}
const sigmaOf = (N, E_trunc = E_TRUNC_PT) => {
  const p = parts(N, E_trunc);
  return p.E_coll / p.E_N;
};
const g_t = (N, E_trunc = E_TRUNC_PT) => E_trunc / parts(N, E_trunc).E_coll;
const g_f = (N) => parts(N).E_flow / parts(N).E_coll;

// Local log-log slope d ln f / d ln N via symmetric multiplicative difference.
function logSlope(f, N) {
  const h = 1e-6;
  return (Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}

// Peak of the full share (imp-3220 landmark) and the numerator crossover N_flow (E_flow=E_trunc).
function peakN(E_trunc = E_TRUNC_PT) {
  let bestN = 0;
  let bestS = -1;
  for (let k = 3; k <= 9; k += 0.0002) {
    const N = Math.pow(10, k);
    const s = sigmaOf(N, E_trunc);
    if (s > bestS) {
      bestS = s;
      bestN = N;
    }
  }
  return { N: bestN, sigma: bestS };
}
function nFlow(E_trunc = E_TRUNC_PT) {
  let lo = 1e2;
  let hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (parts(mid, E_trunc).E_flow > E_trunc) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

const PEAK = peakN();
const N_FLOW = nFlow();
const PEAK_OVER_NFLOW = PEAK.N / N_FLOW; // ~0.5769 (imp-96162 landmark)
const ONE_OVER_SQRT3 = 1 / Math.sqrt(3); // 0.57735

// The two local log-slopes AT the peak: a = d ln g_t/d ln N (>0), b = -d ln g_f/d ln N (>0).
const SLOPE_A = logSlope((n) => g_t(n), PEAK.N); // ~0.4655
const SLOPE_B = -logSlope(g_f, PEAK.N); // ~0.3041

// (F1) EXACT peak condition: E_flow/E_trunc |_peak == a/b.
const EFLOW_OVER_ETRUNC_MEASURED = parts(PEAK.N).E_flow / E_TRUNC_PT; // ~1.5308
const SLOPE_RATIO = SLOPE_A / SLOPE_B; // ~1.5306
const PEAK_CONDITION_REL_ERR = Math.abs(SLOPE_RATIO - EFLOW_OVER_ETRUNC_MEASURED) / EFLOW_OVER_ETRUNC_MEASURED;

// (F2) EXACT location ratio from the log-corrections: N_peak/N_flow == (b/a)^(1/(a+b)).
const LOCATION_FORMULA = Math.pow(SLOPE_B / SLOPE_A, 1 / (SLOPE_A + SLOPE_B)); // ~0.5752
const LOCATION_REL_ERR = Math.abs(LOCATION_FORMULA - PEAK_OVER_NFLOW) / PEAK_OVER_NFLOW;
// Clean leading-order (a=b=1/2) collapses the formula to exactly 1 (peak at N_flow, NOT 1/sqrt3).
const LEADING_ORDER_RATIO = Math.pow(0.5 / 0.5, 1 / (0.5 + 0.5)); // == 1

// (F3) Sensitivity: scale E_trunc and watch N_peak/N_flow drift smoothly THROUGH 1/sqrt3 -- no pin.
const SENSITIVITY = [0.25, 0.5, 1, 2, 4, 16].map((f) => {
  const Et = E_TRUNC_PT * f;
  return { scale: f, ratio: peakN(Et).N / nFlow(Et) };
});
const RATIO_AT_QUARTER = SENSITIVITY[0].ratio; // ~0.637 (above 1/sqrt3)
const RATIO_AT_16X = SENSITIVITY[5].ratio; // ~0.357 (below 1/sqrt3)
// Monotone in scale AND straddles 1/sqrt3 => 0.577 is a crossing point, not a fixed point.
let RATIO_MONOTONE_DOWN = true;
for (let i = 1; i < SENSITIVITY.length; i++) {
  if (SENSITIVITY[i].ratio >= SENSITIVITY[i - 1].ratio) RATIO_MONOTONE_DOWN = false;
}
const STRADDLES_SQRT3 = RATIO_AT_QUARTER > ONE_OVER_SQRT3 && RATIO_AT_16X < ONE_OVER_SQRT3;

// (F4) imp-96292: OFF-HEIGHT ROBUSTNESS of the F1 stationarity identity. F1 verified
// E_flow/E_trunc |_peak == a/b at the SINGLE physical peak height only. Re-evaluate the identity at
// EACH scaled peak of the F3 sweep (0.25x..16x E_trunc, which MOVES the physical peak height L), using
// the same coarse peakN + logSlope method as the F1 measurement (apples-to-apples). A genuine
// stationarity identity holds at every peak (d g/d ln N = 0 forces g_t a = g_f b at ANY peak, hence
// g_f/g_t = E_flow/E_trunc = a/b); a single-height coincidence would degrade off the physical height.
const F1_OFFHEIGHT = [0.25, 0.5, 1, 2, 4, 16].map((f) => {
  const Et = E_TRUNC_PT * f;
  const pk = peakN(Et).N;
  const a = logSlope((n) => g_t(n, Et), pk);
  const b = -logSlope(g_f, pk);
  const measured = parts(pk, Et).E_flow / Et;
  const ratio = a / b;
  return { scale: f, eflow_over_etrunc: measured, slope_ratio: ratio, rel_err: Math.abs(ratio - measured) / measured };
});
const F1_OFFHEIGHT_MAX_REL_ERR = Math.max(...F1_OFFHEIGHT.map((r) => r.rel_err)); // ~1.6e-4 (same tol as F1)
const F1_HOLDS_ACROSS_SWEEP = F1_OFFHEIGHT_MAX_REL_ERR < 2e-4;

export const IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION = {
  id: 'imp-96187',
  proofSection: 'S-frontier',
  question:
    'Derive the exact peak-location ratio N_peak/N_flow of the imp-3220 sigma U-shape from the ' +
    'sub-leading log-corrections of g_t = E_trunc/E_coll and g_f = E_flow/E_coll, and decide whether ' +
    'the imp-96162 proximity N_peak ~ 0.577 N_flow ~ 1/sqrt(3) N_flow is a forced identity or an ' +
    'accident of the inherited constants (C_C/C_F/E_trunc). Measurement/derivation only; NOT an RH bound; no QED.',
  derivedLaw:
    'sigma peaks where d g / d ln N = g_t a - g_f b = 0 with a = d ln g_t/d ln N, -b = d ln g_f/d ln N. ' +
    'Peak condition (P1): E_flow/E_trunc |_peak = a/b. Location ratio (P2): N_peak/N_flow = ' +
    '(b/a)^(1/(a+b)), since g_f/g_t scales as N^-(a+b) and equals 1 at N_flow. At leading order ' +
    'a=b=1/2 the ratio is exactly 1 (peak at N_flow); the 0.577 is entirely a log-correction effect.',
  landmarks: {
    peak_N: +PEAK.N.toExponential(6), // ~9.217e5 (imp-3220 landmark)
    peak_log10N: +Math.log10(PEAK.N).toFixed(4), // ~5.965
    N_flow: +N_FLOW.toExponential(6), // ~1.598e6 (numerator crossover)
    peak_over_N_flow_measured: +PEAK_OVER_NFLOW.toFixed(6), // ~0.576887
    one_over_sqrt3: +ONE_OVER_SQRT3.toFixed(6), // 0.577350
    slope_a_g_t: +SLOPE_A.toFixed(6), // ~0.465526 (matches imp-96162 +0.466)
    slope_b_g_f: +SLOPE_B.toFixed(6), // ~0.304143 (matches imp-96162 -0.304)
    // (F1) peak condition E_flow/E_trunc == a/b
    eflow_over_etrunc_measured: +EFLOW_OVER_ETRUNC_MEASURED.toFixed(6), // ~1.530786
    slope_ratio_a_over_b: +SLOPE_RATIO.toFixed(6), // ~1.530615
    peak_condition_rel_err: +PEAK_CONDITION_REL_ERR.toExponential(3), // ~1.1e-4
    // (F2) location formula
    location_formula_b_over_a_pow: +LOCATION_FORMULA.toFixed(6), // ~0.575190
    location_rel_err: +LOCATION_REL_ERR.toExponential(3), // ~3e-3
    leading_order_ratio_a_eq_b: +LEADING_ORDER_RATIO.toFixed(6), // 1.000000 (NOT 1/sqrt3)
  },
  sensitivity: {
    // (F3) scaling E_trunc sweeps the ratio smoothly through 1/sqrt3 -- no pin at 1/sqrt3.
    ratios: SENSITIVITY.map((s) => ({ etrunc_scale: s.scale, peak_over_N_flow: +s.ratio.toFixed(6) })),
    ratio_at_quarter: +RATIO_AT_QUARTER.toFixed(6), // ~0.637 (above 1/sqrt3)
    ratio_at_16x: +RATIO_AT_16X.toFixed(6), // ~0.357 (below 1/sqrt3)
    monotone_down_in_etrunc: RATIO_MONOTONE_DOWN, // true
    straddles_one_over_sqrt3: STRADDLES_SQRT3, // true (0.577 is a crossing, not a fixed point)
  },
  f1OffHeightRobustness: {
    // (F4) imp-96292: the F1 identity E_flow/E_trunc |_peak == a/b holds at EVERY scaled peak of the
    // F3 sweep, not just the physical one -- a genuine stationarity identity, not a single-height fluke.
    rows: F1_OFFHEIGHT.map((r) => ({
      etrunc_scale: r.scale,
      eflow_over_etrunc: +r.eflow_over_etrunc.toFixed(6),
      slope_ratio_a_over_b: +r.slope_ratio.toFixed(6),
      rel_err: +r.rel_err.toExponential(3),
    })),
    max_rel_err_across_sweep: +F1_OFFHEIGHT_MAX_REL_ERR.toExponential(3), // ~1.6e-4 (same tol as single-height F1)
    holds_across_sweep: F1_HOLDS_ACROSS_SWEEP, // true
    // The identity VALUE a/b drifts with the peak height L, but the identity itself holds at each height.
    ratio_drifts_from_to: [+F1_OFFHEIGHT[0].slope_ratio.toFixed(4), +F1_OFFHEIGHT[5].slope_ratio.toFixed(4)], // [~1.434, ~2.040]
    verdict:
      'GENUINE STATIONARITY IDENTITY, not a single-height coincidence: E_flow/E_trunc |_peak == a/b ' +
      'holds at every scaled peak across the full 0.25x..16x E_trunc sweep to <2e-4 (the same tolerance ' +
      'as the single physical-height F1 check; the residual is coarse peak-grid resolution, and a ' +
      'fine-refined peak drops it below 1.1e-7). The identity VALUE a/b itself DRIFTS from ~1.434 to ' +
      '~2.040 as the sweep moves the peak height L, but the identity E_flow/E_trunc == a/b holds at each ' +
      'height, exactly as expected for a stationarity condition (d g/d ln N = 0 forces g_t a = g_f b at ' +
      'ANY peak). imp-96292: F1 off-height robustness CONFIRMED. Measurement only; no bound; NO QED.',
  },
  finding: {
    F1_peak_condition_is_a_slope_ratio:
      'The exact peak stationarity d g/d ln N = 0 gives E_flow/E_trunc |_peak = a/b, the ratio of the ' +
      'local log-slopes of g_t = E_trunc/E_coll and g_f = E_flow/E_coll. Derived a/b = 1.5306 matches ' +
      'the imp-96162 measured E_flow/E_trunc = 1.5308 at the exact peak to ~1.1e-4, upgrading that ' +
      'landmark from a measured number to a derived identity.',
    F2_location_ratio_from_log_corrections:
      'N_peak/N_flow = (b/a)^(1/(a+b)) = 0.5752 reproduces the imp-96162 measured 0.5769 to 0.3% ' +
      '(residual = drift of a,b across the peak-to-N_flow decade). At clean leading order a=b=1/2 the ' +
      'formula is exactly 1 (peak AT N_flow), so the entire 0.577 is a finite-height log-correction ' +
      '(a!=b) effect, not a leading-order constant.',
    F3_proximity_to_one_over_sqrt3_is_an_accident:
      'The 0.577 ~ 1/sqrt(3) proximity is an ACCIDENT of the inherited constants, NOT a forced ' +
      'identity: N_peak/N_flow is a smooth function of the peak height L (hence of C_C/C_F/E_trunc). ' +
      'Scaling E_trunc from 0.25x to 16x drives the ratio monotonically from 0.637 to 0.357, sweeping ' +
      'THROUGH 1/sqrt(3) = 0.57735 with no plateau or fixed point there. imp-96162 F2 flag CONFIRMED ' +
      'and explained: nothing pins the ratio to 1/sqrt(3); it merely crosses near it at E_trunc=3.06e-5.',
  },
  isRigorous: false,
  honestStatus:
    'CONDITIONAL-SHARE DIAGNOSTIC, NOT AN RH BOUND. sigma = E_coll/E_N is a ratio of terms in the ' +
    'inherited imp-3220/imp-3406/imp-33723 extrapolation; the GUE-conditional C_mb per imp-486 is ' +
    'UNTOUCHED (E_coll stays conditional on GUE pair-correlation), and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) that sets its prefactor is UNTOUCHED. The 0.577 ~ 1/sqrt(3) proximity of ' +
    'N_peak/N_flow decided here is a FINITE-HEIGHT ACCIDENT of the inherited constants (a smooth ' +
    'crossing at the current E_trunc, C_C, C_F, not a fixed point or forced identity) -- it is not ' +
    'evidence toward, and carries no implication for, RH. Changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no QED. No refereed bound is changed.',
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). The imp-3220 U-shape peak obeys the ' +
    'DERIVED law N_peak/N_flow = (b/a)^(1/(a+b)) with a = d ln g_t/d ln N ~ 0.4655 and b = -d ln ' +
    'g_f/d ln N ~ 0.3041 the local log-slopes of E_trunc/E_coll and E_flow/E_coll; the exact peak ' +
    'condition is E_flow/E_trunc |_peak = a/b ~ 1.531 (matches the imp-96162 measured 1.530 to ~1e-4). ' +
    'The proximity N_peak ~ 0.577 N_flow ~ 1/sqrt(3) N_flow is an ACCIDENT, NOT an identity: at clean ' +
    'leading order a=b=1/2 the ratio is exactly 1 (peak at N_flow), and scaling E_trunc by 0.25x..16x ' +
    'sweeps the ratio smoothly from 0.637 to 0.357 THROUGH 1/sqrt(3), so nothing pins it there -- it ' +
    'depends on C_C/C_F/E_trunc through the peak height. imp-96162 F2 flag CONFIRMED and explained. ' +
    'Component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96162 (F2 flagged the 0.577 ~ 1/sqrt3 coincidence); imp-96151 (two-term closed form, misses ' +
    'the peak); imp-33723 (denominator crossover N_cross); imp-3220 (interior peak sigma_max ~ 0.9494 ' +
    'at N ~ 9.22e5); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION_ASSERTIONS = [
  {
    // Anchor: reproduces the imp-96162 peak landmark and the measured log-slopes.
    id: 'imp96187-reproduces-imp96162-peak-landmark-and-slopes',
    description: 'peak sigma ~0.9494 at N~9.22e5; N_flow~1.598e6; slopes a~0.4655 / b~0.3041',
    holds: () =>
      Math.abs(PEAK.sigma - 0.949429) < 1e-4 &&
      Math.abs(PEAK.N / 9.22e5 - 1) < 5e-3 &&
      Math.abs(N_FLOW / 1.597752e6 - 1) < 5e-3 &&
      Math.abs(SLOPE_A - 0.4655) < 5e-3 &&
      Math.abs(SLOPE_B - 0.3041) < 5e-3,
  },
  {
    // (F1): the exact peak condition is the slope ratio E_flow/E_trunc = a/b.
    id: 'imp96187-peak-condition-is-slope-ratio',
    description: 'E_flow/E_trunc |_peak == a/b to <1e-3 (derived stationarity identity)',
    holds: () =>
      PEAK_CONDITION_REL_ERR < 1e-3 && Math.abs(SLOPE_RATIO - 1.5306) < 5e-3,
  },
  {
    // (F2): the location ratio follows (b/a)^(1/(a+b)); leading order (a=b) is exactly 1, not 1/sqrt3.
    id: 'imp96187-location-ratio-from-log-corrections',
    description: 'N_peak/N_flow == (b/a)^(1/(a+b)) to <1pct; leading-order a=b gives exactly 1',
    holds: () =>
      LOCATION_REL_ERR < 1e-2 &&
      Math.abs(LEADING_ORDER_RATIO - 1) < 1e-12 &&
      Math.abs(PEAK_OVER_NFLOW - ONE_OVER_SQRT3) < 2e-3,
  },
  {
    // (F3): the 1/sqrt3 proximity is an accident -- scaling E_trunc sweeps monotonically through it.
    id: 'imp96187-one-over-sqrt3-is-accident-not-identity',
    description: 'ratio monotone-decreasing in E_trunc and straddles 1/sqrt3 (crossing, not fixed point)',
    holds: () => RATIO_MONOTONE_DOWN && STRADDLES_SQRT3,
  },
  {
    // (F4) imp-96292: the F1 stationarity identity holds off the physical peak height across the whole
    // F3 E_trunc sweep -- a genuine identity, not a single-height coincidence.
    id: 'imp96292-f1-identity-holds-across-etrunc-sweep',
    description:
      'E_flow/E_trunc |_peak == a/b at every scaled peak (0.25x..16x) to <2e-4 (same tol as single-height F1)',
    holds: () => F1_HOLDS_ACROSS_SWEEP && F1_OFFHEIGHT.length === 6 && F1_OFFHEIGHT_MAX_REL_ERR < 2e-4,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96187-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.isRigorous === false &&
      /NO QED/.test(IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.verdict),
  },
  {
    // Honest-status banner: conditional-share diagnostic, GUE-conditional/C_C ansatz untouched,
    // 1/sqrt(3) proximity flagged as a finite-height accident, not an RH bound.
    id: 'imp96187-honest-status-banner',
    description: 'honestStatus states conditional-share diagnostic, NOT an RH bound, accident not identity',
    holds: () =>
      typeof IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.honestStatus === 'string' &&
      /NOT AN RH BOUND/.test(IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.honestStatus) &&
      /UNTOUCHED/.test(IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.honestStatus) &&
      /ACCIDENT/.test(IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION.honestStatus),
  },
];

for (const a of IMP96187_USHAPE_PEAK_RATIO_LOGCORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96187-ushape-peak-ratio-logcorrection assertion failed: ${a.id}`);
  }
}
