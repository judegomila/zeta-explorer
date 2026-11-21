/**
 * @module imp-35638-crossover-N-etrunc-sensitivity
 *
 * imp-35638 (numerical, frontier-direction): imp-35594 Derivation 1 and imp-33723
 * give the floor CROSSOVER as a Banach fixed point
 *     N_cross = (C_C / E_trunc)^2 * log T0(N_cross)  ==  kappa * L(N_cross),
 *     kappa = (C_C / E_trunc)^2,   L(N) = log T0(N),   T0 = exact RvM inverse,
 * with N_cross ~ 3.28e9 at the anchor E_trunc = 3.06e-5. E_trunc is the SOLE
 * dimensional lever in this landmark (it sits alone on the RHS of E_coll = E_trunc),
 * yet its sensitivity was never quantified. This module DERIVES the closed-form
 * sensitivity dN_cross/dE_trunc, cross-checks the predicted shift against a DIRECT
 * fixed-point recompute at E_trunc in {3.06e-5, 3.6e-5}, and CONTRASTS the resulting
 * log-slope with the imp-35609 measured PEAK-location shift under the same E_trunc swap.
 *
 * THE CLOSED-FORM SENSITIVITY
 * ---------------------------
 * The crossover is the self-consistent root of F(N, E) = N - kappa(E) L(N) = 0 with
 * kappa(E) = C_C^2 E^{-2}. Implicit differentiation in E:
 *     dN/dE = (dkappa/dE) L + kappa L_prime(N) dN/dE,   dkappa/dE = -2 kappa/E,
 *   => dN/dE (1 - kappa L_prime(N)) = -2 (kappa/E) L = -(2/E) N     (kappa L = N),
 *   => dN_cross/dE_trunc = -(2 N_cross / E_trunc) / (1 - kappa L_prime(N_cross)).
 * With the RvM leading log-height elasticity L_prime(N) = d log T0/dN ~ 1/N (same
 * approximation as imp-35594/imp-35636), kappa L_prime = (N/L)(1/N) = 1/L, so
 * 1 - kappa L_prime = (L - 1)/L and
 *     dN_cross/dE_trunc = -(2 N_cross / E_trunc) * L/(L - 1),
 * i.e. in log form
 *     d log N_cross / d log E_trunc = -2 * L/(L - 1).
 * The -2 is the bare log-derivative of kappa = (C_C/E_trunc)^2 (height frozen); the
 * L/(L - 1) factor is the fixed-point SELF-CONSISTENCY correction because L itself
 * moves with N. At the anchor L = 20.858 this gives L/(L - 1) = 1.0504, so the log
 * slope is -2.1007 -- steeper than -2 by ~5% from the feedback, never below it.
 *
 * THE DIRECT CROSS-CHECK (E_trunc swap 3.06e-5 -> 3.6e-5, RvM inverse)
 * -------------------------------------------------------------------
 *   E_trunc       N_cross (fixed pt)   T0(N_cross)     L        d logN/d logE
 *   3.06e-5       3.280281e9           1.143781e9      20.8576   -2.1007
 *   3.60e-5       2.333355e9           8.284319e8      20.5350   -2.1024
 *   => DIRECT ratio N2/N1 = 0.711328 (a -28.867% crossover shift). The closed-form
 *      log-slope prediction exp(-2 L/(L-1) * log(E2/E1)) = 0.710770 (-28.923%) matches
 *      the direct recompute to ~0.06 percentage points; the exact self-consistent form
 *      (E1/E2)^2 * L2/L1 = 0.711327 reproduces it to six digits. The anchor N_cross =
 *      3.280281e9 also matches the imp-33723 Banach fixed point ~3.28e9.
 *
 * THE CONTRAST WITH THE PEAK (imp-35609)
 * --------------------------------------
 * Under the SAME E_trunc swap, imp-35609 measured the interior sigma-PEAK LOCATION
 * move N_max 9.218633e5 -> 7.368509e5 (ratio 0.799306), i.e. a peak log-slope
 * d log N_max/d log E_trunc = -1.3784. The crossover slope -2.1007 is ~1.52x STEEPER.
 * This is exactly the imp-35594 Derivation-1-vs-2 dichotomy read off the E_trunc axis:
 * the crossover pins N ~ (C_C/E_trunc)^2 L, so E_trunc enters QUADRATICALLY through
 * kappa (slope -2 plus the small fixed-point feedback), whereas the peak only feels
 * E_trunc through the O(1) stationarity balance E_flow ~ O(1) E_trunc (imp-35594
 * Derivation 2, imp-35609), a WEAKER first-order dependence. Both landmarks move
 * EARLIER as the floor rises, but the crossover -- where E_trunc is the sole lever --
 * moves ~1.5x faster than the peak, where it is one term among three.
 *
 * MEASUREMENT/DERIVATION ONLY on the inherited imp-3220/imp-3406 double surrogate.
 * The E_trunc = 3.6e-5 value is a sensitivity PROBE, not a re-anchoring; the anchor
 * E_trunc = 3.06e-5 (imp-2631/imp-447) and C_C = (1/8)sqrt(3 pi) (imp-2642/imp-2643)
 * are UNTOUCHED; surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * changes no bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35594-peak-crossover-mechanism-derivation (Derivation 1 closed form used here)
 * @see imp-35636-crossover-damping-residual-gap-decomposition (the L = log T0 elasticity)
 * @see imp-35609-peak-damping-input-sensitivity (the peak E_trunc shift contrasted here)
 * @see imp-33723 (the Banach fixed point N_cross ~ 3.28e9 reproduced)
 * @see imp-35017 (the sigma double-surrogate formula)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // anchor N-independent fixed-strip route (imp-2631/imp-447), UNTOUCHED
const E_TRUNC_VARIANT = 3.6e-5; // the imp-35609 sensitivity probe (NOT a re-anchoring)

// Exact RvM inverse (map A), inlined pure-Math from imp-35594/imp-35609 (no zeros bundle).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // d/dT of the RvM count = log(T/2pi)/(2pi)
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

// The imp-35594/imp-33723 Banach fixed point N = kappa(E) * log T0(N), kappa = (C_C/E)^2.
function crossoverN(eTrunc) {
  const kappa = (C_C_PINNED / eTrunc) ** 2;
  let N = kappa * 20; // seed with L ~ 20
  for (let i = 0; i < 400; i++) {
    const L = Math.log(effectiveHeightForN(N));
    const Nn = kappa * L;
    if (Math.abs(Nn - N) < 1e-4 * Math.max(1, N)) {
      N = Nn;
      break;
    }
    N = Nn;
  }
  return N;
}

// --- Closed-form sensitivity at a given E_trunc ---
function sensitivityAt(eTrunc) {
  const N = crossoverN(eTrunc);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const kappa = (C_C_PINNED / eTrunc) ** 2;
  // dN/dE = -(2 N / E) * L/(L - 1);   d logN/d logE = -2 L/(L - 1).
  const selfConsistency = L / (L - 1); // fixed-point feedback (>1)
  const dN_dE = -(2 * N / eTrunc) * selfConsistency;
  const dlogN_dlogE = -2 * selfConsistency;
  return { N, T0, L, kappa, selfConsistency, dN_dE, dlogN_dlogE };
}

const BASE = sensitivityAt(E_TRUNC_PT);
const VARIANT = sensitivityAt(E_TRUNC_VARIANT);

// --- Direct recompute vs the closed-form prediction over the finite E_trunc step ---
const DLOG_E = Math.log(E_TRUNC_VARIANT / E_TRUNC_PT); // ~+0.16252
const DIRECT_RATIO = VARIANT.N / BASE.N; // ~0.711328
// Prediction 1: integrate the baseline log-slope (log-linear) over the step.
const PRED_RATIO_LOGSLOPE = Math.exp(BASE.dlogN_dlogE * DLOG_E); // ~0.710770
// Prediction 2: the exact self-consistent closed form N = (C_C/E)^2 L, ratio = (E1/E2)^2 * L2/L1.
const PRED_RATIO_EXACT = (E_TRUNC_PT / E_TRUNC_VARIANT) ** 2 * (VARIANT.L / BASE.L); // ~0.711327
const LOGSLOPE_ABS_ERR = Math.abs((PRED_RATIO_LOGSLOPE - DIRECT_RATIO) / 1); // ~5.6e-4 (absolute in ratio)
const EXACT_REL_ERR = Math.abs(PRED_RATIO_EXACT - DIRECT_RATIO) / DIRECT_RATIO; // ~1e-6

// --- Contrast with the imp-35609 measured PEAK-location shift (same E_trunc swap) ---
const PEAK_N_BASE = 9.218633e5; // imp-35609 / imp-35574 (E_trunc 3.06e-5)
const PEAK_N_VARIANT = 7.368509e5; // imp-35609 (E_trunc 3.6e-5)
const PEAK_RATIO = PEAK_N_VARIANT / PEAK_N_BASE; // ~0.799306
const PEAK_DLOGN_DLOGE = Math.log(PEAK_RATIO) / DLOG_E; // ~-1.3784
const CROSSOVER_VS_PEAK_SLOPE = BASE.dlogN_dlogE / PEAK_DLOGN_DLOGE; // ~1.524 (crossover steeper)

export const IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY = {
  id: 'imp-35638',
  proofSection: 'S-frontier',
  question:
    'imp-35594 Derivation 1 / imp-33723 give the floor crossover as a Banach fixed point ' +
    'N_cross = (C_C/E_trunc)^2 log T0(N_cross) ~ 3.28e9, with E_trunc the sole dimensional lever, ' +
    'but its sensitivity was never quantified. Derive the closed-form dN_cross/dE_trunc and ' +
    'cross-check the predicted crossover-N shift against a direct fixed-point recompute at ' +
    'E_trunc in {3.06e-5, 3.6e-5}, then contrast with the imp-35609 peak-location shift.',
  method:
    'Implicit-differentiate F(N,E) = N - (C_C/E)^2 log T0(N) = 0 in E to get ' +
    'dN_cross/dE_trunc = -(2 N/E) / (1 - kappa L_prime), then use the RvM leading elasticity ' +
    'L_prime = d log T0/dN ~ 1/N (kappa L_prime = 1/L) to reduce it to -(2 N/E) L/(L-1), i.e. ' +
    'd logN/d logE = -2 L/(L-1). Recompute the Banach fixed point directly at both E_trunc values ' +
    'on the exact RvM inverse, compare the direct ratio to the closed-form prediction, and read the ' +
    'peak log-slope off the imp-35609 measured N_max shift 9.22e5 -> 7.37e5.',
  closedForm: {
    formula: 'dN_cross/dE_trunc = -(2 N_cross/E_trunc) * L/(L-1),  L = log T0(N_cross)',
    log_derivative_bare: -2, // d log kappa/d log E for kappa = (C_C/E_trunc)^2 (height frozen)
    self_consistency_factor: +BASE.selfConsistency.toFixed(6), // 1.050359 = L/(L-1)
    d_logN_d_logE: +BASE.dlogN_dlogE.toFixed(6), // -2.100717
    dN_cross_dE_trunc: +BASE.dN_dE.toExponential(6), // -2.251942e14
    interpretation:
      'the -2 is the bare log-derivative of kappa = (C_C/E_trunc)^2; L/(L-1) is the fixed-point ' +
      'self-consistency correction (L moves with N), so the slope is -2.10, steeper than -2 by ~5%.',
  },
  anchor: {
    E_trunc: E_TRUNC_PT,
    N_cross: +BASE.N.toExponential(6), // 3.280281e9
    T0_at_cross: +BASE.T0.toExponential(6), // 1.143781e9
    log_T0: +BASE.L.toFixed(6), // 20.857605
    kappa: +BASE.kappa.toExponential(6), // 1.572709e8
    matches_imp33723_banach: Math.abs(BASE.N / 3.28e9 - 1) < 0.01, // ~3.28e9
  },
  variant: {
    E_trunc: E_TRUNC_VARIANT,
    N_cross: +VARIANT.N.toExponential(6), // 2.333355e9
    T0_at_cross: +VARIANT.T0.toExponential(6), // 8.284319e8
    log_T0: +VARIANT.L.toFixed(6), // 20.535045
    d_logN_d_logE: +VARIANT.dlogN_dlogE.toFixed(6), // -2.102380
  },
  crossCheck: {
    dlog_E: +DLOG_E.toFixed(6), // +0.162519
    direct_ratio: +DIRECT_RATIO.toFixed(6), // 0.711328
    direct_shift_pct: +((DIRECT_RATIO - 1) * 100).toFixed(3), // -28.867
    predicted_ratio_logslope: +PRED_RATIO_LOGSLOPE.toFixed(6), // 0.710770
    predicted_shift_logslope_pct: +((PRED_RATIO_LOGSLOPE - 1) * 100).toFixed(3), // -28.923
    predicted_ratio_exact_closed_form: +PRED_RATIO_EXACT.toFixed(6), // 0.711327
    logslope_vs_direct_abs_err: +LOGSLOPE_ABS_ERR.toExponential(3), // ~5.58e-4
    exact_vs_direct_rel_err: +EXACT_REL_ERR.toExponential(3), // ~1e-6
    verdict:
      'the closed-form log-slope prediction (-28.92%) matches the direct fixed-point recompute ' +
      '(-28.87%) to ~0.06 percentage points, and the exact self-consistent form (E1/E2)^2 L2/L1 ' +
      'reproduces the direct ratio to six digits.',
  },
  peakContrast: {
    peak_N_base: +PEAK_N_BASE.toExponential(6), // 9.218633e5 (imp-35609)
    peak_N_variant: +PEAK_N_VARIANT.toExponential(6), // 7.368509e5 (imp-35609)
    peak_ratio: +PEAK_RATIO.toFixed(6), // 0.799306
    peak_d_logN_d_logE: +PEAK_DLOGN_DLOGE.toFixed(6), // -1.378371
    crossover_over_peak_slope: +CROSSOVER_VS_PEAK_SLOPE.toFixed(4), // ~1.5240
    interpretation:
      'the crossover log-slope -2.10 is ~1.52x steeper than the imp-35609 peak slope -1.38: ' +
      'E_trunc enters the crossover quadratically through kappa = (C_C/E_trunc)^2 (its sole lever), ' +
      'but the peak only through the O(1) stationarity balance E_flow ~ O(1) E_trunc (imp-35594 ' +
      'Derivation 2). Both landmarks move earlier as the floor rises; the crossover moves ~1.5x faster.',
  },
  finding: {
    F1_closed_form:
      'dN_cross/dE_trunc = -(2 N_cross/E_trunc) L/(L-1): the bare -2 log-derivative of ' +
      'kappa = (C_C/E_trunc)^2 times the fixed-point self-consistency factor L/(L-1) = 1.0504, ' +
      'giving d logN/d logE = -2.1007 at the anchor (N_cross = 3.280281e9, matching imp-33723).',
    F2_direct_cross_check:
      'The direct Banach recompute under E_trunc 3.06e-5 -> 3.6e-5 gives N_cross 3.280281e9 -> ' +
      '2.333355e9 (ratio 0.711328, -28.87%). The closed-form log-slope predicts 0.710770 (-28.92%, ' +
      'to ~0.06pp) and the exact self-consistent form reproduces the ratio to six digits.',
    F3_peak_contrast:
      'Under the same E_trunc swap the imp-35609 peak location moves 9.22e5 -> 7.37e5 ' +
      '(log-slope -1.38), so the crossover is ~1.52x more E_trunc-sensitive -- exactly the ' +
      'imp-35594 Derivation-1-vs-2 dichotomy: E_trunc is the crossover sole lever (quadratic through ' +
      'kappa) but only an O(1) balance term at the peak.',
  },
  isRigorous: false,
  honestStatus:
    'Derives the closed-form crossover sensitivity dN_cross/dE_trunc = -(2 N_cross/E_trunc) L/(L-1) ' +
    '(bare -2 log-derivative of kappa = (C_C/E_trunc)^2 times the fixed-point self-consistency factor ' +
    'L/(L-1) = 1.0504, log-slope -2.10) and cross-checks it against a direct Banach fixed-point ' +
    'recompute: N_cross 3.280281e9 -> 2.333355e9 under E_trunc 3.06e-5 -> 3.6e-5 (direct -28.87% vs ' +
    'predicted -28.92%, to ~0.06pp; exact closed form to six digits). The crossover slope -2.10 is ' +
    '~1.52x steeper than the imp-35609 peak slope -1.38. Measurement/derivation only on the inherited ' +
    'imp-3220/imp-3406 surrogate; the E_trunc = 3.6e-5 value is a probe, not a re-anchoring; anchor ' +
    'E_trunc = 3.06e-5 and C_C ansatz UNTOUCHED; surrogate-vs-true fidelity (imp-35337a) stays OPEN; ' +
    'changes no bound; NO QED.',
  verdict:
    'MEASUREMENT/DERIVATION ONLY (frontier-direction, NOT rigorous). The imp-35594 Derivation-1 / ' +
    'imp-33723 Banach crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) has closed-form E_trunc ' +
    'sensitivity dN_cross/dE_trunc = -(2 N_cross/E_trunc) L/(L-1): the bare -2 log-derivative of ' +
    'kappa = (C_C/E_trunc)^2 (height frozen) times the fixed-point self-consistency factor ' +
    'L/(L-1) = 1.0504 (L moves with N), giving d logN/d logE = -2.10 at the anchor. A direct ' +
    'fixed-point recompute confirms it: N_cross 3.280281e9 (matching imp-33723 ~3.28e9) -> ' +
    '2.333355e9 under E_trunc 3.06e-5 -> 3.6e-5, a -28.87% shift the closed-form log-slope predicts ' +
    'as -28.92% (to ~0.06 percentage points) and the exact self-consistent form (E1/E2)^2 L2/L1 ' +
    'reproduces to six digits. Contrasted with the imp-35609 peak-location shift (9.22e5 -> 7.37e5, ' +
    'log-slope -1.38) under the same swap, the crossover is ~1.52x more E_trunc-sensitive -- the ' +
    'imp-35594 Derivation-1-vs-2 dichotomy read off the E_trunc axis: E_trunc is the crossover sole ' +
    'lever (quadratic through kappa) but only an O(1) stationarity-balance term at the peak. ' +
    'Measurement/derivation only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous ' +
    'asymptotic; the E_trunc = 3.6e-5 value is a sensitivity probe, not a re-anchoring; the anchor ' +
    'E_trunc = 3.06e-5 (imp-2631/imp-447) and C_C = (1/8)sqrt(3 pi) (imp-2642/imp-2643) UNTOUCHED; ' +
    'surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'E_coll far-tail exponent 1/2 per imp-3463; changes no bound; no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35594 (Derivation-1 closed form N_cross = (C_C/E_trunc)^2 log T0); imp-33723 (Banach fixed ' +
    'point ~3.28e9 reproduced); imp-35636 (the L = log T0 elasticity); imp-35609 (peak E_trunc shift ' +
    'contrasted); imp-2631 (E_trunc = 3.06e-5 anchor, UNTOUCHED); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY_ASSERTIONS = [
  {
    // The anchor Banach fixed point reproduces the imp-33723 crossover N ~ 3.28e9.
    id: 'imp35638-anchor-reproduces-imp33723-banach',
    description: 'the E_trunc = 3.06e-5 Banach fixed point reproduces the imp-33723 crossover N ~ 3.28e9',
    holds: () => Math.abs(BASE.N - 3.280281e9) / 3.280281e9 < 1e-5,
  },
  {
    // The closed-form log-slope is -2 * L/(L-1) ~ -2.10 (steeper than -2 by the fixed-point feedback).
    id: 'imp35638-log-slope-minus-two-times-self-consistency',
    description: 'd logN/d logE = -2 L/(L-1) ~ -2.101 (bare -2 times the fixed-point self-consistency factor)',
    holds: () =>
      Math.abs(BASE.dlogN_dlogE - -2 * BASE.selfConsistency) < 1e-9 &&
      Math.abs(BASE.dlogN_dlogE - -2.100717) < 1e-4 &&
      BASE.dlogN_dlogE < -2 && // strictly steeper than the bare -2
      BASE.selfConsistency > 1,
  },
  {
    // The closed-form log-slope prediction matches the direct fixed-point recompute to ~0.06pp.
    id: 'imp35638-logslope-prediction-matches-direct',
    description: 'the closed-form log-slope shift (-28.92%) matches the direct recompute (-28.87%) within 0.1pp',
    holds: () =>
      Math.abs((PRED_RATIO_LOGSLOPE - 1) * 100 - (DIRECT_RATIO - 1) * 100) < 0.1 &&
      Math.abs(DIRECT_RATIO - 0.711328) < 1e-5,
  },
  {
    // The exact self-consistent closed form (E1/E2)^2 L2/L1 reproduces the direct ratio to ~1e-6.
    id: 'imp35638-exact-closed-form-matches-direct',
    description: 'the exact closed form (E1/E2)^2 L2/L1 reproduces the direct Banach ratio to under 1e-4 relative',
    holds: () => EXACT_REL_ERR < 1e-4,
  },
  {
    // The crossover is more E_trunc-sensitive than the imp-35609 peak (steeper log-slope, ratio ~1.5).
    id: 'imp35638-crossover-steeper-than-peak',
    description: 'the crossover log-slope -2.10 is ~1.52x steeper than the imp-35609 peak slope -1.38',
    holds: () =>
      Math.abs(PEAK_DLOGN_DLOGE - -1.378371) < 1e-4 &&
      CROSSOVER_VS_PEAK_SLOPE > 1.3 &&
      CROSSOVER_VS_PEAK_SLOPE < 1.8 &&
      BASE.dlogN_dlogE < PEAK_DLOGN_DLOGE, // crossover slope more negative (steeper)
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp35638-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY.verdict),
  },
];

for (const a of IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35638-crossover-N-etrunc-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35638_CROSSOVER_N_ETRUNC_SENSITIVITY;
