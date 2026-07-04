/**
 * @module imp-33788-eflow-displacement-sqrtlog-running-correction
 *
 * imp-33788 (numerical, frontier-direction): imp-33767 finding F3 mapped the halving-to-crossover
 * landmark separation N_cross/N_half - 1 to the E_flow displacement, predicting the LEADING
 * 2*(E_flow/E_trunc) ~ 0.381% against a MEASURED 0.400%, and attributed the residual ~5% gap to
 * "the sqrt-log running of L" WITHOUT quantifying it. This module MEASURES that running correction
 * explicitly by re-deriving the exact map from the fractional E_coll excess x = E_flow/E_trunc to
 * the landmark separation, retaining the L = log T0 running inside E_coll ~ C_C sqrt(L/N).
 *
 * THE EXACT MAP (identical sub-terms to imp-33744 / imp-33767 -- no fresh model)
 * ----------------------------------------------------------------------------
 *   Both landmarks are E_coll level sets of the SAME curve E_coll(N) = C_C sqrt(L(N)/N):
 *       crossover: E_coll(N_cross) = E_trunc,
 *       halving:   E_coll(N_half)  = E_trunc + E_flow = E_trunc (1 + x),   x = E_flow/E_trunc.
 *   Squaring E_coll and taking the ratio kills C_C exactly:
 *       L(N_cross)/N_cross   E_trunc^2
 *       ------------------ = ------------- = 1/(1+x)^2
 *       L(N_half)/N_half     (E_trunc(1+x))^2
 *   =>  N_cross/N_half = (1 + x)^2 * ( L(N_cross)/L(N_half) ).                       [EXACT]
 *   The FIRST factor (1+x)^2 is the pure inverse-sqrt power map; its linearisation gives the
 *   imp-33767 leading 2x (plus an x^2 term). The SECOND factor L(N_cross)/L(N_half) > 1 is the
 *   sqrt-log RUNNING: N_cross sits at slightly larger height, so log T0 is slightly larger there,
 *   which AMPLIFIES the separation above the frozen-L value.
 *
 * THE RUNNING CORRECTION FACTOR (the object imp-33767 F3 left unquantified)
 * ------------------------------------------------------------------------
 *   Write r = N_cross/N_half - 1 (small). With beta = d ln L / d ln N (the local sqrt-log running
 *   exponent read at N_half), L(N_cross)/L(N_half) ~ 1 + beta * r, so to leading order
 *       r * (1 - beta) ~ 2x + x^2   =>   r ~ (2x + x^2) / (1 - beta).
 *   Equivalently, the effective decay exponent of E_coll is p_eff = 1/2 - beta/2 (< 1/2 because the
 *   L^{1/2} factor slows the N^{-1/2} decay), and ln(N_cross/N_half) = ln(1 + x)/p_eff exactly.
 *   So the correction to the leading "2x" splits into TWO named pieces:
 *       (i)  RUNNING amplification   1/(1 - beta)   -- the sqrt-log running of L (dominant), and
 *       (ii) POWER-MAP curvature     (1 + x/2)      -- the (1+x)^2 vs 1+2x quadratic term (tiny).
 *   Measured beta ~ 0.0454 gives 1/(1-beta) ~ 1.0476, i.e. a +4.76% lift; the x/2 term adds a
 *   further ~+0.10%. Together the correction factor r/2x ~ 1.0487 -- which reproduces the measured
 *   0.400% from the 2x-predicted 0.381% to floating-point. So the imp-33767 ~5% gap is ENTIRELY the
 *   sqrt-log running (with a sub-tenth-point power-map sliver), leaving NO residual.
 *
 * THE FINDING (measurement / interpretation only)
 * -----------------------------------------------
 *   (F1) THE ~5% GAP IS THE RUNNING FACTOR 1/(1-beta). The frozen-L 2x prediction under-shoots by
 *        4.87%; the local sqrt-log running exponent beta = d ln L/d ln N ~ 0.0454 at N_half yields a
 *        1/(1-beta) ~ 1.0476 amplification -- +4.76 of the 4.87 gap points, essentially all of it.
 *   (F2) THE POWER-MAP CURVATURE CLOSES THE LAST SLIVER. The (1+x)^2 map (vs the linear 1+2x)
 *        contributes an extra 1 + x/2 ~ 1.00095 (~+0.10 points). Running x (1/(1-beta)) times power
 *        (1+x/2) gives r/2x ~ 1.0487, matching the measured correction factor to < 1e-3.
 *   (F3) NO RESIDUAL SURVIVES. The exact map r = (1+x)^2 (L(N_cross)/L(N_half)) - 1 reproduces the
 *        measured landmark separation to < 1e-3 relative; the leading-order (2x + x^2)/(1-beta)
 *        surrogate matches to < 5e-4 relative. The ~5% "sqrt-log running" imp-33767 named is fully
 *        accounted for -- it is 1/(1 - d ln L/d ln N) and nothing further is missing.
 *
 * MEASUREMENT / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642) is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33767-sigma-inflection-offset-reconciliation (F3 named the ~5% gap, left it unquantified)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma=1/2 halving landmark, shared sub-terms)
 * @see imp-33729-sigma-knee-vs-crossover-offset (E_coll=E_trunc crossover landmark)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33744/imp-33767 exactly

// EXACT imp-33744/imp-33767 sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFull(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// sigma_full = 1/2 halving landmark (imp-33744 denominator).
function findHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFull(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
// E_coll = E_trunc crossover landmark (imp-33729 denominator).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// --- the two landmarks and the measured separation (imp-33767 axis) ---
const N_HALF = findHalfN(); // ~3.267e9
const N_CROSS = crossBelow((N) => terms(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280e9
const R_MEAS = N_CROSS / N_HALF - 1; // measured landmark separation ~+0.400%

// --- the fractional E_coll excess x = E_flow/E_trunc (drives the displacement) ---
const X_EXCESS = terms(N_HALF).E_flow / E_TRUNC_PT; // ~1.906e-3
const PRED_LEADING_2X = 2 * X_EXCESS; // imp-33767 leading prediction ~+0.381%
const GAP_2X = R_MEAS / PRED_LEADING_2X - 1; // the ~5% (~+4.9%) gap imp-33767 F3 named

// --- the sqrt-log running exponent beta = d ln L / d ln N, read at N_half ---
function lnL(N) {
  return Math.log(terms(N).L);
}
const T_HALF = Math.log(N_HALF);
const H_BETA = 1e-4;
const BETA_RUN = (lnL(Math.exp(T_HALF + H_BETA)) - lnL(Math.exp(T_HALF - H_BETA))) / (2 * H_BETA);
const RUNNING_FACTOR = 1 / (1 - BETA_RUN); // 1/(1-beta) ~ 1.0476  (the object F3 left unquantified)
const POWERMAP_FACTOR = 1 + X_EXCESS / 2; // (1+x)^2 vs 1+2x sliver ~ 1.00095
const CORR_FACTOR_MEAS = R_MEAS / PRED_LEADING_2X; // measured r/2x ~ 1.0487

// --- reconstructed predictions with the running retained ---
// (a) leading-order surrogate: r ~ (2x + x^2)/(1 - beta).
const PRED_RUNNING_SURROGATE = (2 * X_EXCESS + X_EXCESS * X_EXCESS) / (1 - BETA_RUN);
// (b) exact map: r = (1+x)^2 * (L(N_cross)/L(N_half)) - 1.
const L_RATIO = terms(N_CROSS).L / terms(N_HALF).L; // > 1: the running amplification
const PRED_EXACT_MAP = (1 + X_EXCESS) * (1 + X_EXCESS) * L_RATIO - 1;

export const IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION = {
  id: 'imp-33788',
  proofSection: 'S-frontier',
  question:
    'imp-33767 F3 mapped the halving-to-crossover landmark separation N_cross/N_half - 1 to the ' +
    'E_flow displacement, predicting the leading 2*(E_flow/E_trunc) ~ 0.381% against a measured ' +
    '0.400%, and attributed the ~5% gap to "the sqrt-log running of L" without quantifying it. ' +
    'MEASURE that running correction explicitly: re-derive the exact map from the fractional E_coll ' +
    'excess x = E_flow/E_trunc to the separation, retaining the L = log T0 running inside ' +
    'E_coll ~ C_C sqrt(L/N), and report how the correction factor departs from the leading 2x and ' +
    'whether it accounts for the full ~5% offset or leaves a residual. ' +
    'Measurement/interpretation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the sqrt-log running correction factor 1/(1 - d ln L/d ln N) that lifts the frozen-L leading ' +
    '2*(E_flow/E_trunc) prediction to the measured landmark separation N_cross/N_half - 1',
  landmarks: {
    N_half: +N_HALF.toExponential(6), // ~3.267235e9 (sigma_full = 1/2)
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (E_coll = E_trunc)
    r_meas_landmark_separation: +R_MEAS.toFixed(6), // ~+0.003997
    r_meas_percent: +(R_MEAS * 100).toFixed(4), // ~+0.3997 %
  },
  leadingPrediction: {
    x_eflow_over_etrunc: +X_EXCESS.toExponential(4), // ~1.9057e-3
    pred_leading_2x: +PRED_LEADING_2X.toFixed(6), // ~+0.003811
    pred_leading_2x_percent: +(PRED_LEADING_2X * 100).toFixed(4), // ~+0.3811 %
    gap_2x_to_measured: +GAP_2X.toFixed(6), // ~+0.048686 (the ~5% imp-33767 named)
    gap_2x_percent: +(GAP_2X * 100).toFixed(3), // ~+4.869 %
  },
  runningCorrection: {
    beta_dlnL_dlnN_at_half: +BETA_RUN.toFixed(6), // ~0.045431 (local sqrt-log running exponent)
    running_factor_1_over_1_minus_beta: +RUNNING_FACTOR.toFixed(6), // ~1.047593 (the dominant lift)
    powermap_factor_1_plus_half_x: +POWERMAP_FACTOR.toFixed(6), // ~1.000953 ((1+x)^2 vs 1+2x sliver)
    L_ratio_cross_over_half: +L_RATIO.toFixed(8), // ~1.00018123 (> 1: running amplification)
    measured_correction_factor_r_over_2x: +CORR_FACTOR_MEAS.toFixed(6), // ~1.048682
    p_eff_effective_decay_exponent: +(0.5 - BETA_RUN / 2).toFixed(6), // ~0.477285 (< 1/2)
    note:
      'The correction to the leading 2x splits into (i) the sqrt-log RUNNING amplification ' +
      '1/(1-beta) ~ 1.0476 (dominant, +4.76 of the 4.87 gap points) and (ii) the POWER-MAP curvature ' +
      '(1 + x/2) ~ 1.00095 (the (1+x)^2 vs 1+2x sliver, ~+0.10 points). Product r/2x ~ 1.0487.',
  },
  reconstruction: {
    pred_running_surrogate_percent: +(PRED_RUNNING_SURROGATE * 100).toFixed(4), // ~+0.3997 %
    surrogate_rel_residual: +(R_MEAS / PRED_RUNNING_SURROGATE - 1).toFixed(6), // ~+0.00009 (< 5e-4)
    pred_exact_map_percent: +(PRED_EXACT_MAP * 100).toFixed(4), // ~+0.3997 %
    exact_map_rel_residual: +(R_MEAS / PRED_EXACT_MAP - 1).toFixed(9), // ~0 (< 1e-3)
    note:
      'The exact map r = (1+x)^2 (L(N_cross)/L(N_half)) - 1 reproduces the measured separation to ' +
      '< 1e-3 relative; the leading (2x + x^2)/(1-beta) surrogate matches to < 5e-4. The ~5% is ' +
      'ENTIRELY the sqrt-log running; no residual survives.',
  },
  finding: {
    F1_gap_is_the_running_factor:
      'The frozen-L 2x prediction under-shoots the measured separation by ~+4.87%. The local ' +
      'sqrt-log running exponent beta = d ln L/d ln N ~ 0.0454 at N_half gives an amplification ' +
      '1/(1-beta) ~ 1.0476 -- +4.76 of the 4.87 gap points, essentially the entire "sqrt-log ' +
      'running of L" imp-33767 F3 named but did not quantify.',
    F2_powermap_curvature_closes_the_sliver:
      'The remaining ~0.10 points is the (1+x)^2 vs linear 1+2x power-map curvature, a factor ' +
      '1 + x/2 ~ 1.00095. Running (1/(1-beta)) times power (1+x/2) gives the measured correction ' +
      'factor r/2x ~ 1.0487 to < 1e-3.',
    F3_no_residual_survives:
      'The exact map r = (1+x)^2 (L(N_cross)/L(N_half)) - 1 reproduces the measured 0.400% ' +
      'separation to < 1e-3 relative (surrogate (2x+x^2)/(1-beta) to < 5e-4). The ~5% offset is ' +
      'FULLY accounted for as 1/(1 - d ln L/d ln N) with a sub-tenth-point power-map sliver -- no ' +
      'residual is missing.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-33767 F3 predicted the leading ' +
    '2*(E_flow/E_trunc) ~ +0.381% for the halving-to-crossover separation N_cross/N_half - 1 vs a ' +
    'measured ~+0.400%, and attributed the ~+4.9% gap to unquantified "sqrt-log running of L". ' +
    'Re-deriving the EXACT E_coll level-set map N_cross/N_half = (1+x)^2 (L(N_cross)/L(N_half)) with ' +
    'x = E_flow/E_trunc: the running factor 1/(1 - d ln L/d ln N) with beta ~ 0.0454 at N_half gives ' +
    '~1.0476 (+4.76 points, the dominant correction), and the (1+x)^2-vs-1+2x power-map curvature ' +
    '1 + x/2 ~ 1.00095 adds ~+0.10 points; their product r/2x ~ 1.0487 reproduces the measured ' +
    'correction factor. The exact map matches the measured separation to < 1e-3 relative and the ' +
    'leading (2x + x^2)/(1-beta) surrogate to < 5e-4: the ~5% is ENTIRELY the sqrt-log running of L ' +
    '(equivalently an effective E_coll decay exponent p_eff = 1/2 - beta/2 ~ 0.477 < 1/2), with a ' +
    'sub-tenth-point power-map sliver, leaving NO residual. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33767 (F3 named the ~5% gap, left it unquantified); imp-33744 (sigma=1/2 halving landmark); ' +
    'imp-33729 (E_coll=E_trunc crossover); imp-3444 (crossover landmark); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION_ASSERTIONS = [
  {
    // Reuse gate: reproduces the imp-33767 axis -- the two landmarks and the measured ~0.400%
    // separation -- before any running decomposition.
    id: 'imp33788-reproduces-imp33767-landmark-separation',
    description: 'N_half ~ 3.267e9, N_cross ~ 3.280e9, and the measured separation r ~ +0.400%',
    holds: () =>
      Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3 &&
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      R_MEAS > 0.0035 &&
      R_MEAS < 0.0045,
  },
  {
    // The leading 2x under-shoots by ~+4.9% -- the gap imp-33767 F3 named.
    id: 'imp33788-leading-2x-gap-is-about-5pct',
    description: 'measured/pred_2x - 1 lands in [3%,7%] (the ~5% gap)',
    holds: () => GAP_2X > 0.03 && GAP_2X < 0.07,
  },
  {
    // (F1): the running factor 1/(1-beta) with a positive small beta accounts for the bulk of the
    // gap -- beta in a sane sqrt-log-running band, factor within ~1 point of the measured r/2x.
    id: 'imp33788-running-factor-explains-the-gap',
    description: 'beta = d ln L/d ln N in (0, 0.1); 1/(1-beta) within 1.2% of the measured r/2x',
    holds: () =>
      BETA_RUN > 0 &&
      BETA_RUN < 0.1 &&
      Math.abs(RUNNING_FACTOR / CORR_FACTOR_MEAS - 1) < 0.012,
  },
  {
    // (F3): the exact level-set map reproduces the measured separation to < 1e-3 relative -- no
    // residual survives; the ~5% is fully the sqrt-log running.
    id: 'imp33788-exact-map-leaves-no-residual',
    description: 'r = (1+x)^2 (L(N_cross)/L(N_half)) - 1 matches the measured separation to < 1e-3 relative',
    holds: () => Math.abs(R_MEAS / PRED_EXACT_MAP - 1) < 1e-3,
  },
  {
    // (F2): the leading-order surrogate (2x+x^2)/(1-beta) also closes the gap to < 5e-4 relative,
    // confirming running (dominant) + power-map (sliver) is the full decomposition.
    id: 'imp33788-running-surrogate-closes-gap',
    description: '(2x + x^2)/(1-beta) matches the measured separation to < 5e-4 relative',
    holds: () => Math.abs(R_MEAS / PRED_RUNNING_SURROGATE - 1) < 5e-4,
  },
  {
    // Honesty gate: measurement/interpretation only, no QED, PT stays SOTA.
    id: 'imp33788-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION.verdict) &&
      /remains SOTA/.test(IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION.verdict),
  },
];

for (const a of IMP33788_EFLOW_DISPLACEMENT_SQRTLOG_RUNNING_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33788-eflow-displacement-sqrtlog-running-correction assertion failed: ${a.id}`);
  }
}
