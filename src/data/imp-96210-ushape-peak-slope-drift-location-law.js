/**
 * @module imp-96210-ushape-peak-slope-drift-location-law
 *
 * imp-96210 (numerical, frontier-direction): imp-96187 derived the exact U-shape peak-location law
 * N_peak/N_flow = (b/a)^(1/(a+b)) with a = d ln g_t/d ln N, b = -d ln g_f/d ln N the LOCAL log-slopes
 * of g_t = E_trunc/E_coll and g_f = E_flow/E_coll, and reproduced the imp-96162 measured 0.5769 to
 * 0.3%. imp-96187 F2 ATTRIBUTED that residual 0.3% to the drift of a, b across the [N_peak, N_flow]
 * decade -- the formula uses the peak-evaluated locally-constant slopes a ~ 0.4655, b ~ 0.3041. This
 * module MEASURES a(N) and b(N) explicitly across that decade, quantifies the drift, re-evaluates the
 * location law with the drift-integrated (decade-averaged) slope sum, and CONFIRMS the residual is the
 * slope drift and the derived law is otherwise exact.
 *
 * WHERE THE RESIDUAL LIVES (constant-slope vs drift-integrated)
 * ------------------------------------------------------------
 * The exact stationarity chain is drift-free: let r(N) = g_f/g_t = E_flow/E_trunc. Then
 *   d ln r / d ln N = d ln g_f/d ln N - d ln g_t/d ln N = -(a(N) + b(N)).
 * Integrating from ln N_peak to ln N_flow, with r(N_flow) = 1 (definition of N_flow: E_flow = E_trunc)
 * and r(N_peak) = a_peak/b_peak (the imp-96187 P1 peak condition), gives the EXACT location identity:
 *
 *   (D1)  ln(N_flow / N_peak) = ln(a_peak / b_peak) / <a + b>,   <a + b> = decade-averaged slope sum,
 *   (D2)  N_peak / N_flow = (b_peak / a_peak)^(1 / <a + b>).
 *
 * The imp-96187 formula (P2) is (D2) with the decade average <a+b> REPLACED by its peak value
 * (a_peak + b_peak). That single substitution is the sole approximation, so the 0.3% residual must
 * equal the gap between <a+b> and (a_peak+b_peak). Measured directly on the sigma(N) grid:
 *   a: 0.465526 (N_peak) -> 0.466653 (N_flow), drift +0.001127 (nearly flat),
 *   b: 0.304143 (N_peak) -> 0.311563 (N_flow), drift +0.007420 (b drifts ~6.6x more than a),
 *   (a+b) at peak = 0.769670, decade-averaged <a+b> = 0.773994 (a +0.56pct upward drift).
 * Feeding <a+b> = 0.773994 into (D2) yields N_peak/N_flow = 0.576970, matching the measured 0.576887
 * to 1.4e-4 -- a 20x tightening of the imp-96187 constant-slope 0.575190 (residual 2.94e-3). The 0.3pct
 * residual is ACCOUNTED FOR: it is exactly the b-dominated upward slope drift across the peak decade.
 *
 * F1 STATIONARITY IDENTITY, DIRECT ON THE GRID
 * --------------------------------------------
 * The imp-96187 P1 peak condition E_flow/E_trunc |_peak = a/b is re-verified here directly on the
 * sigma(N) grid (not re-imported): the measured E_flow/E_trunc = 1.530786 at the exact peak equals the
 * local slope ratio a_peak/b_peak = 1.530615 to 1.1e-4, independently reconfirming the imp-96187 F1
 * upgrade of that landmark from a measured number to a derived stationarity identity.
 *
 * THE FINDING (measurement/derivation only)
 * -----------------------------------------
 *   (G1) THE SLOPES DRIFT UPWARD, b-DOMINATED. Across [N_peak, N_flow] a rises +0.001127 (flat) and b
 *        rises +0.007420, so <a+b> = 0.773994 exceeds the peak (a+b) = 0.769670 by +0.56pct. The drift
 *        is monotone and b carries ~87pct of it.
 *   (G2) DRIFT-INTEGRATED LOCATION LAW IS EXACT TO 1.4e-4. Replacing the constant peak slope sum with
 *        the decade average in (D2) drives the location residual from 2.94e-3 to 1.44e-4 (20x), so the
 *        imp-96187 F2 0.3pct residual is fully explained as the b-dominated slope drift; the derived law
 *        is otherwise exact.
 *   (G3) F1 SLOPE-RATIO IDENTITY RECONFIRMED ON THE GRID. E_flow/E_trunc |_peak = a_peak/b_peak to
 *        1.1e-4, independently reproducing the imp-96187 F1 stationarity identity.
 *
 * MEASUREMENT/DERIVATION ONLY. Conditional-share diagnostic (GUE-conditional C_mb per imp-486), NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED (the share stays
 * GUE-conditional); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (derived P1/P2, flagged the 0.3pct residual)
 * @see imp-96162-sigma-ushape-peak-eflow-recovery (measured 0.5769 and the +0.466/-0.304 slopes)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96162/imp-96187 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (inherited, no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { L, E_flow, E_coll, E_N: E_TRUNC_PT + E_flow + E_coll };
}
const sigmaOf = (N) => { const p = parts(N); return p.E_coll / p.E_N; };
const g_t = (N) => E_TRUNC_PT / parts(N).E_coll;
const g_f = (N) => parts(N).E_flow / parts(N).E_coll;

// Local log-log slope d ln f / d ln N via symmetric multiplicative difference.
function logSlope(f, N) {
  const h = 1e-6;
  return (Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}

// Peak of the full share (imp-3220 landmark) and the numerator crossover N_flow (E_flow=E_trunc).
function peakN() {
  let bestN = 0;
  let bestS = -1;
  for (let k = 3; k <= 9; k += 0.0002) {
    const N = Math.pow(10, k);
    const s = sigmaOf(N);
    if (s > bestS) { bestS = s; bestN = N; }
  }
  return { N: bestN, sigma: bestS };
}
function nFlow() {
  let lo = 1e2;
  let hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (parts(mid).E_flow > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

const PEAK = peakN();
const N_FLOW = nFlow();
const PEAK_OVER_NFLOW = PEAK.N / N_FLOW; // ~0.576887 (imp-96162 landmark)

// The two local log-slopes AT the peak (imp-96187 constants).
const A_PEAK = logSlope(g_t, PEAK.N); // ~0.4655
const B_PEAK = -logSlope(g_f, PEAK.N); // ~0.3041
const SUM_AT_PEAK = A_PEAK + B_PEAK; // ~0.769670

// imp-96187 constant-slope location formula (P2): uses the peak slope sum.
const CONST_SLOPE_FORMULA = Math.pow(B_PEAK / A_PEAK, 1 / SUM_AT_PEAK); // ~0.575190
const CONST_SLOPE_REL_ERR = Math.abs(CONST_SLOPE_FORMULA - PEAK_OVER_NFLOW) / PEAK_OVER_NFLOW; // ~2.94e-3

// (G1) MEASURE a(N), b(N) across the [N_peak, N_flow] decade and integrate the slope sum.
const DRIFT_STEPS = 40;
const LN_LO = Math.log(PEAK.N);
const LN_HI = Math.log(N_FLOW);
const A_AT = [];
const B_AT = [];
const SUM_AT = [];
for (let i = 0; i <= DRIFT_STEPS; i++) {
  const N = Math.exp(LN_LO + ((LN_HI - LN_LO) * i) / DRIFT_STEPS);
  const aN = logSlope(g_t, N);
  const bN = -logSlope(g_f, N);
  A_AT.push(aN);
  B_AT.push(bN);
  SUM_AT.push(aN + bN);
}
const A_AT_NFLOW = A_AT[DRIFT_STEPS]; // ~0.466653
const B_AT_NFLOW = B_AT[DRIFT_STEPS]; // ~0.311563
const A_DRIFT = A_AT_NFLOW - A_PEAK; // ~+0.001127 (flat)
const B_DRIFT = B_AT_NFLOW - B_PEAK; // ~+0.007420 (b drifts ~6.6x more)
// Trapezoid average of (a+b) over ln N across the decade.
let SUM_INTEGRAL = 0;
for (let i = 0; i < DRIFT_STEPS; i++) SUM_INTEGRAL += 0.5 * (SUM_AT[i] + SUM_AT[i + 1]);
SUM_INTEGRAL *= (LN_HI - LN_LO) / DRIFT_STEPS;
const AVG_SUM_DECADE = SUM_INTEGRAL / (LN_HI - LN_LO); // ~0.773994 (> peak sum 0.769670)
const SUM_DRIFT_FRAC = (AVG_SUM_DECADE - SUM_AT_PEAK) / SUM_AT_PEAK; // ~+5.6e-3 upward drift
const B_SHARE_OF_DRIFT = B_DRIFT / (A_DRIFT + B_DRIFT); // ~0.868 (b carries ~87pct)

// (G2) DRIFT-INTEGRATED location law (D2): decade-averaged slope sum in the exponent.
const DRIFT_FORMULA = Math.pow(B_PEAK / A_PEAK, 1 / AVG_SUM_DECADE); // ~0.576970
const DRIFT_REL_ERR = Math.abs(DRIFT_FORMULA - PEAK_OVER_NFLOW) / PEAK_OVER_NFLOW; // ~1.44e-4
const RESIDUAL_TIGHTENING = CONST_SLOPE_REL_ERR / DRIFT_REL_ERR; // ~20x

// (G3) F1 stationarity identity direct on the grid: E_flow/E_trunc |_peak == a/b.
const EFLOW_OVER_ETRUNC_MEASURED = parts(PEAK.N).E_flow / E_TRUNC_PT; // ~1.530786
const SLOPE_RATIO = A_PEAK / B_PEAK; // ~1.530615
const F1_REL_ERR = Math.abs(SLOPE_RATIO - EFLOW_OVER_ETRUNC_MEASURED) / EFLOW_OVER_ETRUNC_MEASURED; // ~1.1e-4

export const IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW = {
  id: 'imp-96210',
  proofSection: 'S-frontier',
  question:
    'Measure the a, b log-slope drift across the [N_peak, N_flow] decade in imp-96187 and re-evaluate ' +
    'the peak-location law N_peak/N_flow = (b/a)^(1/(a+b)) with drift included, to account for the ' +
    'residual 0.3pct locally-constant-slope error. Also verify the F1 stationarity identity ' +
    'E_flow/E_trunc |_peak = a/b directly on the sigma(N) grid. Measurement/derivation only; NOT an RH bound; no QED.',
  derivedLaw:
    'Exact stationarity chain is drift-free: with r = g_f/g_t = E_flow/E_trunc, d ln r/d ln N = ' +
    '-(a(N)+b(N)); integrating with r(N_flow)=1 and r(N_peak)=a_peak/b_peak gives (D1) ' +
    'ln(N_flow/N_peak) = ln(a_peak/b_peak)/<a+b> and (D2) N_peak/N_flow = (b_peak/a_peak)^(1/<a+b>), ' +
    '<a+b> the decade-averaged slope sum. The imp-96187 P2 formula is (D2) with <a+b> replaced by the ' +
    'peak value (a_peak+b_peak); that single substitution is the entire 0.3pct residual.',
  landmarks: {
    peak_N: +PEAK.N.toExponential(6), // ~9.217e5 (imp-3220 landmark)
    N_flow: +N_FLOW.toExponential(6), // ~1.598e6 (numerator crossover)
    peak_over_N_flow_measured: +PEAK_OVER_NFLOW.toFixed(6), // ~0.576887
    // (G1) slope drift across the decade
    a_at_peak: +A_PEAK.toFixed(6), // ~0.465526
    a_at_N_flow: +A_AT_NFLOW.toFixed(6), // ~0.466653
    a_drift: +A_DRIFT.toExponential(3), // ~+1.127e-3 (flat)
    b_at_peak: +B_PEAK.toFixed(6), // ~0.304143
    b_at_N_flow: +B_AT_NFLOW.toFixed(6), // ~0.311563
    b_drift: +B_DRIFT.toExponential(3), // ~+7.420e-3 (b drifts ~6.6x more than a)
    b_share_of_slope_drift: +B_SHARE_OF_DRIFT.toFixed(4), // ~0.868
    sum_at_peak: +SUM_AT_PEAK.toFixed(6), // ~0.769670
    avg_sum_decade: +AVG_SUM_DECADE.toFixed(6), // ~0.773994
    sum_drift_frac: +SUM_DRIFT_FRAC.toExponential(3), // ~+5.6e-3 upward
    // (G2) constant-slope vs drift-integrated location law
    const_slope_formula: +CONST_SLOPE_FORMULA.toFixed(6), // ~0.575190 (imp-96187 P2)
    const_slope_rel_err: +CONST_SLOPE_REL_ERR.toExponential(3), // ~2.94e-3
    drift_integrated_formula: +DRIFT_FORMULA.toFixed(6), // ~0.576970
    drift_integrated_rel_err: +DRIFT_REL_ERR.toExponential(3), // ~1.44e-4
    residual_tightening_x: +RESIDUAL_TIGHTENING.toFixed(1), // ~20
    // (G3) F1 stationarity identity direct on the grid
    eflow_over_etrunc_measured: +EFLOW_OVER_ETRUNC_MEASURED.toFixed(6), // ~1.530786
    slope_ratio_a_over_b: +SLOPE_RATIO.toFixed(6), // ~1.530615
    f1_rel_err: +F1_REL_ERR.toExponential(3), // ~1.1e-4
  },
  finding: {
    G1_slopes_drift_upward_b_dominated:
      'Measured directly on the sigma(N) grid across [N_peak, N_flow]: a rises +0.001127 (nearly flat) ' +
      'while b rises +0.007420, so b carries ~87pct of the slope drift. The decade-averaged slope sum ' +
      '<a+b> = 0.773994 exceeds the peak value a_peak+b_peak = 0.769670 by +0.56pct; the drift is monotone.',
    G2_drift_integrated_location_law_exact:
      'The exact location identity (D2) N_peak/N_flow = (b_peak/a_peak)^(1/<a+b>) uses the decade-averaged ' +
      'slope sum in place of the peak value. Feeding <a+b> = 0.773994 gives 0.576970, matching the ' +
      'measured 0.576887 to 1.44e-4 -- a 20x tightening of the imp-96187 constant-slope 0.575190 ' +
      '(residual 2.94e-3). The imp-96187 F2 0.3pct residual is ACCOUNTED FOR as the b-dominated slope ' +
      'drift; the derived law is otherwise exact.',
    G3_f1_slope_ratio_identity_reconfirmed:
      'The imp-96187 F1 peak condition E_flow/E_trunc |_peak = a/b is re-verified directly on the grid: ' +
      'measured E_flow/E_trunc = 1.530786 equals the local slope ratio a_peak/b_peak = 1.530615 to ' +
      '1.1e-4, independently reproducing the derived stationarity identity.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). The imp-96187 constant-slope location ' +
    'law N_peak/N_flow = (b/a)^(1/(a+b)) is the exact drift-free identity (D2) ' +
    'N_peak/N_flow = (b_peak/a_peak)^(1/<a+b>) with the decade-averaged slope sum <a+b> replaced by its ' +
    'peak value. Measuring a(N), b(N) across the [N_peak, N_flow] decade: a is flat (+0.001127) and b ' +
    'rises +0.007420 (b carries ~87pct of the drift), so <a+b> = 0.773994 vs the peak 0.769670 (+0.56pct). ' +
    'The drift-integrated formula gives 0.576970 vs the measured 0.576887 (rel err 1.44e-4), a 20x ' +
    'tightening of the constant-slope 0.575190 (2.94e-3): the imp-96187 F2 0.3pct residual is fully ' +
    'accounted for as the b-dominated slope drift, and the derived law is otherwise exact. The F1 ' +
    'stationarity identity E_flow/E_trunc |_peak = a/b is reconfirmed directly on the grid to 1.1e-4. ' +
    'Component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96187 (derived P1/P2, attributed the 0.3pct residual to slope drift); imp-96162 (measured ' +
    '0.5769 and the +0.466/-0.304 slopes); imp-3220 (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); ' +
    'imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW_ASSERTIONS = [
  {
    // Anchor: reproduces the imp-96187/imp-96162 peak landmark and the peak slopes.
    id: 'imp96210-reproduces-peak-landmark-and-peak-slopes',
    description: 'peak sigma ~0.9494 at N~9.22e5; N_flow~1.598e6; a_peak~0.4655 / b_peak~0.3041',
    holds: () =>
      Math.abs(PEAK.sigma - 0.949429) < 1e-4 &&
      Math.abs(PEAK.N / 9.22e5 - 1) < 5e-3 &&
      Math.abs(N_FLOW / 1.597752e6 - 1) < 5e-3 &&
      Math.abs(A_PEAK - 0.4655) < 5e-3 &&
      Math.abs(B_PEAK - 0.3041) < 5e-3,
  },
  {
    // (G1): the slopes drift upward across the decade and b carries the bulk of it.
    id: 'imp96210-slopes-drift-upward-b-dominated',
    description: 'a drift ~+1.1e-3 (flat), b drift ~+7.4e-3; <a+b> decade > peak sum; b carries >80pct',
    holds: () =>
      A_DRIFT > 0 &&
      B_DRIFT > 0 &&
      B_DRIFT > 4 * A_DRIFT &&
      AVG_SUM_DECADE > SUM_AT_PEAK &&
      B_SHARE_OF_DRIFT > 0.8,
  },
  {
    // (G2): the drift-integrated location law lands the residual an order of magnitude tighter.
    id: 'imp96210-drift-integrated-location-law-tighter',
    description: 'drift-integrated rel err <5e-4 and at least 5x tighter than the constant-slope residual',
    holds: () =>
      DRIFT_REL_ERR < 5e-4 &&
      CONST_SLOPE_REL_ERR > 2e-3 &&
      RESIDUAL_TIGHTENING > 5,
  },
  {
    // (G3): the F1 slope-ratio stationarity identity is reconfirmed on the grid.
    id: 'imp96210-f1-slope-ratio-identity-on-grid',
    description: 'E_flow/E_trunc |_peak == a_peak/b_peak to <1e-3 (imp-96187 F1 reconfirmed)',
    holds: () => F1_REL_ERR < 1e-3 && Math.abs(SLOPE_RATIO - 1.5306) < 5e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96210-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW.isRigorous === false &&
      /NO QED/.test(IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW.verdict),
  },
];

for (const a of IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96210-ushape-peak-slope-drift-location-law assertion failed: ${a.id}`);
  }
}
