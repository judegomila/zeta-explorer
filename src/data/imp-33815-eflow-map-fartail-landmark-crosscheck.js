/**
 * @module imp-33815-eflow-map-fartail-landmark-crosscheck
 *
 * imp-33815 (numerical, frontier-direction): imp-33788 showed the EXACT running-correction map
 *   r = (1+x)^2 * (L(N_cross)/L(N_half)) - 1,   x = E_flow/E_trunc
 * accounts ENTIRELY for the ~5% gap in the HALVING-to-crossover landmark separation, leaving no
 * residual and attributing it to sqrt-log running. imp-33788 never tested whether the SAME exact
 * map reproduces the OTHER pinned landmark separation -- the imp-33743 thr = 0.1 FAR-TAIL landmark,
 * whose closed-form-vs-empirical residual (~7.4e-5) was ~54x TIGHTER than the halving residual.
 * This module applies the imp-33788 exact map to the thr = 0.1 landmark separation and measures
 * whether it also closes to no residual or leaves one.
 *
 * THE SAME MAP, THE SAME LEVEL-SET STRUCTURE (no fresh model)
 * ----------------------------------------------------------
 *   The thr = 0.1 landmark is pinned two ways, both E_coll level sets of the SAME curve
 *   E_coll(N) = C_C sqrt(L(N)/N) (imp-3406/imp-33582 model), differing only by whether the tiny
 *   flow term E_flow is retained in the threshold balance E_coll (1 - thr) = thr (E_trunc + E_flow):
 *       no-flow (imp-33743 closed form):  E_coll(N_CF)  = E_trunc * thr/(1-thr),
 *       with-flow (imp-33582 bisection):  E_coll(N_emp) = (E_trunc + E_flow) * thr/(1-thr)
 *                                                       = E_trunc * thr/(1-thr) * (1 + x),  x = E_flow/E_trunc.
 *   The thr/(1-thr) amplitude cancels in the ratio exactly as E_trunc did at the halving landmark:
 *       E_coll(N_CF)/E_coll(N_emp) = 1/(1 + x)
 *   =>  L(N_CF)/N_CF  =  1/(1+x)^2  *  L(N_emp)/N_emp
 *   =>  N_CF/N_emp = (1 + x)^2 * ( L(N_CF)/L(N_emp) ).                              [EXACT -- imp-33788 map]
 *   So the imp-33788 map transfers VERBATIM: the halving-to-crossover pair (E_trunc+E_flow vs E_trunc)
 *   and the thr=0.1 with-flow-vs-no-flow pair are the SAME (1+x) level-set displacement; only the
 *   value of x differs (evaluated at the far tail here, at N_half there).
 *
 * THE FINDING (measurement / interpretation only)
 * -----------------------------------------------
 *   (F1) THE MAP CLOSES THE FAR-TAIL SEPARATION TO NO RESIDUAL, EXACTLY AS AT THE HALVING LANDMARK.
 *        The measured separation r = N_CF/N_emp - 1 ~ +7.378e-5 (the imp-33743 ~7.4e-5 residual);
 *        the exact map r = (1+x)^2 (L(N_CF)/L(N_emp)) - 1 with x = E_flow/E_trunc ~ 3.55e-5 at the
 *        far-tail landmark reproduces it to ~9e-12 relative -- floating-point zero, matching the
 *        imp-33788 halving result (< 1e-3). YES: the same map reproduces the thr=0.1 separation
 *        with no surviving residual.
 *   (F2) THE SEPARATION IS ~54x SMALLER BECAUSE x IS ~54x SMALLER, NOT BECAUSE THE MAP DIFFERS.
 *        x = E_flow/E_trunc falls from ~1.906e-3 at N_half to ~3.549e-5 at the far tail (a ~53.7x
 *        drop, since E_flow ~ log T0 / T0 decays down the tail), and the separation r ~ 2x tracks it
 *        (7.4e-5 vs 0.4%, ~54x). The map is universal; only its single input x rescales.
 *   (F3) THE LEADING 2x UNDER-SHOOTS BY ~3.95%, ALL RUNNING, POWER-MAP SLIVER NOW NEGLIGIBLE.
 *        The frozen-L leading 2x prediction under-shoots r by ~+3.95% (cf ~+4.87% at the halving
 *        landmark). The running factor 1/(1 - d ln L/d ln N) with beta ~ 0.0379 at the far tail gives
 *        ~1.0394 (+3.94 of the 3.95 gap points, essentially all of it); the power-map curvature
 *        (1 + x/2) ~ 1.0000177 is now utterly negligible (x is ~54x smaller than at halving). So the
 *        SAME decomposition (running dominant + power-map sliver) holds, with the sliver vanishing.
 *
 * This re-confirms the imp-33743 D2 finding ("restoring E_flow in the threshold balance closes the
 * gap to ~1e-15") from the imp-33788 running-map angle: the two statements are IDENTICAL -- the
 * (1+x)^2 (L-ratio) map IS the E_flow restoration, so the ~7.4e-5 far-tail residual is fully the
 * flow displacement with no residual, exactly as the ~0.4% halving separation was.
 *
 * MEASUREMENT / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642) is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33788-eflow-displacement-sqrtlog-running-correction (the exact map, halving-to-crossover)
 * @see imp-33743-sigma-fartail-crossover-closed-form (thr=0.1 landmark, ~7.4e-5 residual, D2 = E_flow)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.1 crossing N ~ 3.21e11, bisected)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-33788 exactly
const THR = 0.1; // imp-33582/imp-33743 far-tail landmark threshold (sigma < 0.1)

// EXACT imp-3406/imp-33582/imp-33743/imp-33788 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// with-flow empirical landmark: sigma = thr downslope bisection (imp-33582 reference).
function crossBelowSigma(thr, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// no-flow closed-form landmark: fixed point N = K_thr log T0(N), K_thr = ((1-thr)/thr)^2 (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
const K_THR = ((1 - THR) / THR) ** 2 * K_AMPL; // ~1.2739e10 at thr=0.1
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_THR * Math.log(effectiveHeightForN(N));
  return N;
}

// --- the two thr=0.1 landmarks and the measured separation (imp-33743 residual axis) ---
const N_CF = crossoverFixedPoint(1e11, 60); // no-flow closed form ~3.2134e11
const N_EMP = crossBelowSigma(THR, 1e6, 1e18); // with-flow bisection ~3.2132e11
const R_MEAS = N_CF / N_EMP - 1; // measured landmark separation ~+7.38e-5 (imp-33743 residual)

// --- the fractional E_coll displacement x = E_flow/E_trunc, read at the far-tail landmark ---
const X_EXCESS = parts(N_EMP).E_flow / E_TRUNC_PT; // ~3.549e-5 (cf ~1.906e-3 at N_half)
const PRED_LEADING_2X = 2 * X_EXCESS; // frozen-L leading prediction ~+7.10e-5
const GAP_2X = R_MEAS / PRED_LEADING_2X - 1; // the ~3.95% gap (cf ~4.87% at halving)

// --- the sqrt-log running exponent beta = d ln L / d ln N, read at the far-tail landmark ---
function lnL(N) {
  return Math.log(parts(N).L);
}
const T_EMP = Math.log(N_EMP);
const H_BETA = 1e-4;
const BETA_RUN = (lnL(Math.exp(T_EMP + H_BETA)) - lnL(Math.exp(T_EMP - H_BETA))) / (2 * H_BETA);
const RUNNING_FACTOR = 1 / (1 - BETA_RUN); // ~1.0394 (dominant lift)
const POWERMAP_FACTOR = 1 + X_EXCESS / 2; // ~1.0000177 (now negligible: x ~54x smaller than at halving)
const CORR_FACTOR_MEAS = R_MEAS / PRED_LEADING_2X; // measured r/2x ~1.0395

// --- reconstructed predictions with the running retained (the imp-33788 objects) ---
// (a) leading-order surrogate: r ~ (2x + x^2)/(1 - beta).
const PRED_RUNNING_SURROGATE = (2 * X_EXCESS + X_EXCESS * X_EXCESS) / (1 - BETA_RUN);
// (b) exact map: r = (1+x)^2 * (L(N_CF)/L(N_emp)) - 1.
const L_RATIO = parts(N_CF).L / parts(N_EMP).L; // > 1: the running amplification
const PRED_EXACT_MAP = (1 + X_EXCESS) * (1 + X_EXCESS) * L_RATIO - 1;

// imp-33788 halving-landmark x, for the ~54x displacement-ratio contrast.
const X_HALVING_REF = 1.9057e-3; // imp-33788 x = E_flow/E_trunc at N_half
const X_RATIO_HALF_OVER_FARTAIL = X_HALVING_REF / X_EXCESS; // ~53.7 (matches the ~54x residual ratio)

export const IMP33815_EFLOW_MAP_FARTAIL_LANDMARK_CROSSCHECK = {
  id: 'imp-33815',
  proofSection: 'S-frontier',
  question:
    'imp-33788 showed the exact map r = (1+x)^2 * (L(N_cross)/L(N_half)) - 1, x = E_flow/E_trunc, ' +
    'accounts entirely for the ~5% gap in the HALVING-to-crossover landmark separation with no ' +
    'residual. It never tested whether the SAME map reproduces the imp-33743 thr = 0.1 FAR-TAIL ' +
    'landmark separation (closed-form-vs-empirical residual ~7.4e-5, ~54x tighter than the halving). ' +
    'Apply the imp-33788 exact map to the thr = 0.1 landmark separation and measure whether it also ' +
    'closes to no residual or leaves one. ' +
    'Measurement/interpretation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the relative residual of the imp-33788 exact map r = (1+x)^2 (L(N_CF)/L(N_emp)) - 1 against the ' +
    'imp-33743 thr = 0.1 far-tail landmark separation N_CF/N_emp - 1 (no-flow closed form vs with-flow bisection)',
  landmarks: {
    threshold: THR,
    N_cf_no_flow_closed_form: +N_CF.toExponential(6), // ~3.213418e11 (E_coll = E_trunc thr/(1-thr))
    N_emp_with_flow_bisection: +N_EMP.toExponential(6), // ~3.213181e11 (imp-33582 sigma<0.1)
    r_meas_landmark_separation: +R_MEAS.toFixed(8), // ~+0.00007378 (the imp-33743 ~7.4e-5 residual)
    r_meas_percent: +(R_MEAS * 100).toFixed(5), // ~+0.00738 %
  },
  leadingPrediction: {
    x_eflow_over_etrunc_fartail: +X_EXCESS.toExponential(4), // ~3.549e-5
    pred_leading_2x: +PRED_LEADING_2X.toExponential(4), // ~+7.098e-5
    gap_2x_to_measured: +GAP_2X.toFixed(6), // ~+0.039465 (the ~3.95% far-tail gap)
    gap_2x_percent: +(GAP_2X * 100).toFixed(3), // ~+3.946 % (cf ~+4.869 % at halving)
  },
  runningCorrection: {
    beta_dlnL_dlnN_at_fartail: +BETA_RUN.toFixed(6), // ~0.037948 (< the ~0.0454 at halving; T0 larger)
    running_factor_1_over_1_minus_beta: +RUNNING_FACTOR.toFixed(6), // ~1.039445 (dominant lift)
    powermap_factor_1_plus_half_x: +POWERMAP_FACTOR.toFixed(8), // ~1.00001774 (now negligible)
    L_ratio_cf_over_emp: +L_RATIO.toFixed(10), // ~1.0000027996 (> 1: running amplification)
    measured_correction_factor_r_over_2x: +CORR_FACTOR_MEAS.toFixed(6), // ~1.039465
    p_eff_effective_decay_exponent: +(0.5 - BETA_RUN / 2).toFixed(6), // ~0.481026 (< 1/2)
    note:
      'The correction to the leading 2x is now almost purely the sqrt-log RUNNING amplification ' +
      '1/(1-beta) ~ 1.0394 (+3.94 of the 3.95 gap points); the POWER-MAP curvature (1 + x/2) ~ ' +
      '1.0000177 is negligible because x is ~54x smaller on the far tail than at the halving landmark.',
  },
  reconstruction: {
    pred_running_surrogate: +PRED_RUNNING_SURROGATE.toExponential(4), // ~+7.378e-5
    surrogate_rel_residual: +(R_MEAS / PRED_RUNNING_SURROGATE - 1).toExponential(3), // ~1.3e-6 (< 5e-4)
    pred_exact_map: +PRED_EXACT_MAP.toExponential(4), // ~+7.378e-5
    exact_map_rel_residual: +(R_MEAS / PRED_EXACT_MAP - 1).toExponential(3), // ~9e-12 (< 1e-3, no residual)
    note:
      'The exact map r = (1+x)^2 (L(N_CF)/L(N_emp)) - 1 reproduces the measured far-tail separation ' +
      'to ~9e-12 relative -- floating-point zero, matching the imp-33788 halving result (< 1e-3). ' +
      'The (2x + x^2)/(1-beta) surrogate matches to ~1.3e-6. NO residual survives.',
  },
  displacementContrast: {
    x_fartail: +X_EXCESS.toExponential(4), // ~3.549e-5
    x_halving_imp33788: X_HALVING_REF, // ~1.9057e-3
    x_ratio_half_over_fartail: +X_RATIO_HALF_OVER_FARTAIL.toFixed(2), // ~53.7 (matches ~54x residual ratio)
    note:
      'The thr=0.1 separation is ~54x smaller than the halving separation because its single map input ' +
      'x = E_flow/E_trunc is ~54x smaller (~3.55e-5 vs ~1.91e-3), NOT because the map differs. The map ' +
      'is universal; only x rescales. This re-confirms the imp-33743 D2 (E_flow is the entire residual).',
  },
  finding: {
    F1_map_closes_fartail_to_no_residual:
      'The imp-33788 exact map r = (1+x)^2 (L(N_CF)/L(N_emp)) - 1 with x = E_flow/E_trunc ~ 3.55e-5 at ' +
      'the far-tail landmark reproduces the measured thr=0.1 separation N_CF/N_emp - 1 ~ +7.38e-5 to ' +
      '~9e-12 relative -- floating-point zero, exactly as it closed the ~0.4% halving separation ' +
      '(< 1e-3). YES: the same map reproduces the far-tail landmark separation with no residual.',
    F2_separation_54x_smaller_because_x_54x_smaller:
      'The far-tail separation is ~54x smaller than the halving separation (7.4e-5 vs 0.4%) purely ' +
      'because the map input x = E_flow/E_trunc is ~54x smaller (~3.55e-5 vs ~1.91e-3), E_flow ~ ' +
      'log T0 / T0 decaying down the tail. The map is universal; only its single input rescales.',
    F3_leading_2x_gap_is_running_powermap_sliver_now_negligible:
      'The frozen-L 2x prediction under-shoots by ~+3.95% (cf ~+4.87% at halving). The running factor ' +
      '1/(1-beta) with beta ~ 0.0379 gives ~1.0394 -- +3.94 of the 3.95 gap points, essentially all of ' +
      'it; the (1+x)^2-vs-1+2x power-map curvature 1 + x/2 ~ 1.0000177 is now negligible (x ~54x ' +
      'smaller). The same running-dominant decomposition holds, with the power-map sliver vanishing.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Applying the imp-33788 exact E_coll level-set map ' +
    'N_CF/N_emp = (1+x)^2 (L(N_CF)/L(N_emp)), x = E_flow/E_trunc, to the imp-33743 thr = 0.1 FAR-TAIL ' +
    'landmark separation (no-flow closed form N_CF ~ 3.2134e11 vs with-flow bisection N_emp ~ ' +
    '3.2132e11, measured separation ~ +7.38e-5): the map reproduces the separation to ~9e-12 relative ' +
    '-- floating-point zero, exactly as it closed the ~0.4% halving separation (< 1e-3). So the SAME ' +
    'map reproduces BOTH pinned landmark separations with NO residual. The far-tail separation is ' +
    '~54x smaller only because its single map input x = E_flow/E_trunc is ~54x smaller (~3.55e-5 vs ' +
    '~1.91e-3, E_flow ~ log T0/T0 decaying down the tail); the leading 2x under-shoots by ~+3.95% (cf ' +
    '~+4.87% at halving), which the running factor 1/(1 - d ln L/d ln N) with beta ~ 0.0379 (~1.0394) ' +
    'accounts for almost entirely, the power-map sliver (1 + x/2) ~ 1.0000177 now being negligible. ' +
    'This re-confirms the imp-33743 D2 ("restoring E_flow closes the gap to ~1e-15") from the ' +
    'imp-33788 running-map angle -- the (1+x)^2 (L-ratio) map IS the E_flow restoration. Component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33788 (the exact map, halving-to-crossover, ~5% gap closed with no residual); imp-33743 ' +
    '(thr=0.1 far-tail landmark, ~7.4e-5 residual, D2 = the E_flow term); imp-33723 (halving-landmark ' +
    'closed form); imp-33582 (sigma < 0.1 crossing N ~ 3.21e11, bisected); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33815_EFLOW_MAP_FARTAIL_LANDMARK_CROSSCHECK_ASSERTIONS = [
  {
    // Reuse gate: reproduces the imp-33743 axis -- the two thr=0.1 landmarks and the ~7.4e-5 separation.
    id: 'imp33815-reproduces-imp33743-fartail-landmark-separation',
    description: 'N_CF ~ 3.2134e11, N_emp ~ 3.2132e11, and the measured separation r ~ +7.4e-5',
    holds: () =>
      Math.abs(N_CF / 3.213418e11 - 1) < 5e-3 &&
      Math.abs(N_EMP / 3.213181e11 - 1) < 5e-3 &&
      R_MEAS > 5e-5 &&
      R_MEAS < 1e-4,
  },
  {
    // The leading 2x under-shoots by ~+3.95% -- the far-tail analog of the halving ~4.87% gap.
    id: 'imp33815-leading-2x-gap-is-about-4pct',
    description: 'measured/pred_2x - 1 lands in [2.5%,5.5%] (the ~3.95% far-tail gap)',
    holds: () => GAP_2X > 0.025 && GAP_2X < 0.055,
  },
  {
    // (F1): the KEY finding -- the same exact map closes the far-tail separation to no residual.
    id: 'imp33815-exact-map-leaves-no-residual-at-fartail',
    description: 'r = (1+x)^2 (L(N_CF)/L(N_emp)) - 1 matches the measured far-tail separation to < 1e-3 relative',
    holds: () => Math.abs(R_MEAS / PRED_EXACT_MAP - 1) < 1e-3,
  },
  {
    // (F1 tightened): far tighter than the < 1e-3 halving bar -- floating-point closure.
    id: 'imp33815-exact-map-closes-to-floating-point',
    description: 'the exact-map residual at the far tail is < 1e-6 (machine-precision closure)',
    holds: () => Math.abs(R_MEAS / PRED_EXACT_MAP - 1) < 1e-6,
  },
  {
    // (F3): the running factor 1/(1-beta) with a small positive beta accounts for the bulk of the gap.
    id: 'imp33815-running-factor-explains-the-fartail-gap',
    description: 'beta = d ln L/d ln N in (0, 0.1); 1/(1-beta) within 1% of the measured r/2x',
    holds: () =>
      BETA_RUN > 0 &&
      BETA_RUN < 0.1 &&
      Math.abs(RUNNING_FACTOR / CORR_FACTOR_MEAS - 1) < 0.01,
  },
  {
    // (F2): the displacement x is ~54x smaller on the far tail, matching the ~54x residual tightening.
    id: 'imp33815-displacement-is-54x-smaller-on-fartail',
    description: 'x_halving/x_fartail ~ 54 (the same factor as the imp-33743 residual tightening)',
    holds: () => X_RATIO_HALF_OVER_FARTAIL > 40 && X_RATIO_HALF_OVER_FARTAIL < 70,
  },
  {
    // Honesty gate: measurement/interpretation only, no QED, no refereed bound is changed.
    id: 'imp33815-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33815_EFLOW_MAP_FARTAIL_LANDMARK_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP33815_EFLOW_MAP_FARTAIL_LANDMARK_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP33815_EFLOW_MAP_FARTAIL_LANDMARK_CROSSCHECK.verdict),
  },
];

for (const a of IMP33815_EFLOW_MAP_FARTAIL_LANDMARK_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33815-eflow-map-fartail-landmark-crosscheck assertion failed: ${a.id}`);
  }
}
