/**
 * @module imp-35557-cubic-skew-height-map-sensitivity
 *
 * imp-35557 (numerical, frontier-direction): imp-35451 measured the CUBIC (skew) coefficient
 * c3 = sigma-triple-prime(u0)/6 ~ -2.623677e-4 of the imp-35337/imp-3406 interior sigma-peak
 * (and the rising-vs-falling arm-imbalance slope A_skew ~ 11.01 decades/tol it predicts) on the
 * BASE Riemann-von Mangoldt height map ONLY. imp-35536 then showed the peak HEIGHT sigma_max is
 * height-map-robust (~0.8 percent under the full ~32-percent surrogate swap) while the peak
 * LOCATION N_max moves moderately (d log10 N_max / d ln(mult) ~ -0.49). This module applies the
 * imp-35536 multiplicative-perturbation method to the THIRD-ORDER skew: re-locate the peak and
 * re-measure c3, k, and A_skew under the RvM x {1.02, 0.98} bracketing pair, and report whether
 * the cubic skew INHERITS the peak robustness or drifts materially.
 *
 * THE MEASUREMENT (single swap: the height map only)
 * --------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), reproduced VERBATIM from imp-35451/imp-35536:
 *   E_coll = C_C_PINNED sqrt(log T0 / N)  (dominant, GUE-conditional C_H),
 *   E_flow = C_F (log T0 / T0) Gronwall,   C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_trunc = 3.06e-5   (N-independent fixed-strip route).
 * Only the height map T0(N) is swapped, across the imp-35536 bracketing arms:
 *   (A) exact RvM inverse effectiveHeightForN (the BASE map imp-35451 used),
 *   (B) RvM x 1.02, (C) RvM x 0.98.
 * At each map the peak is RE-LOCATED by the imp-35451 ternary argmax, then the SAME three
 * quantities are re-measured about THAT map own ln N_max: the 5-point Richardson-extrapolated
 * third derivative (c3), the quadratic curvature k, and the tol = 1e-5 arm-imbalance slope A_skew.
 *
 *   height map     log10 N_max   sigma_max      c3            k             A_skew (meas)
 *   RvM (BASE)     5.96467       0.949429014   -2.623677e-4   6.431916e-3   11.01451
 *   RvM x 1.02     5.95497       0.949947663   -2.599790e-4   6.365650e-3   11.13633
 *   RvM x 0.98     5.97456       0.948894740   -2.648243e-4   6.500125e-3   10.87302
 *
 * THE FINDING
 * -----------
 * The cubic skew INHERITS the peak robustness -- it does NOT drift materially. Under the RvM
 * x {1.02, 0.98} pair c3 stays at -2.6e-4 to within ~0.9 percent per arm (full-pair spread
 * ~1.85 percent of |c3|), A_skew stays at ~11.0 to within ~2.4 percent full-pair spread, and
 * BOTH keep their sign / meaning: c3 stays NEGATIVE (the rising arm stays wider) and the
 * cubic-predicts-imbalance cross-check A_skew_pred = -4 c3 / (k^2 ln10) still matches the directly
 * measured A_skew to < 1.5e-3 relative under EACH perturbed map. The log-response slope
 * d ln|c3| / d ln(mult) ~ -0.46 is the SAME log-damping order as the imp-35536 N_max slope
 * ~ -0.49 -- the skew reparametrises like the location, not wildly.
 *
 * THE ONE HONEST CAVEAT (relative sensitivity, not absolute fragility)
 * -------------------------------------------------------------------
 * In RELATIVE terms the third-order skew is MORE sensitive than the peak height to the SAME map
 * perturbation: over the +/- 2-percent pair sigma_max moves only ~1.05e-3 (~0.11 percent) while
 * |c3| moves ~1.85 percent -- roughly a 17x larger fractional response, the expected ordering
 * (higher derivatives of a flat-topped extremum feel horizontal reparametrisation more). But the
 * ABSOLUTE drift is still only ~1 percent per 2-percent height move (slope ~0.46, well damped),
 * so the skew is a genuine surrogate-channel feature quotable to ~2 significant figures
 * (c3 ~ -2.6e-4), NOT a map artifact -- the same verdict imp-35536 reached for sigma_max/N_max.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; NOT a rigorous
 * asymptotic; changes no bound. Surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; the C_C = (1/8)
 * sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the
 * imp-398 C_F prefactor UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35451-sigma-peak-arm-asymmetry (base-map c3 = -2.623677e-4 and A_skew ~ 11.01, recomputed here)
 * @see imp-35536-peak-height-map-sensitivity (the multiplicative-perturbation method, applied to sigma_max/N_max)
 * @see imp-35450-sigma-peak-curvature-direct-fd (the quadratic curvature k ~ 6.43e-3)
 * @see imp-35492-sigma-peak-plateau-arm-sqrt-law (the arm-difference linear-in-tol law)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35451/imp-35536 exactly

// The EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined from lambda-rh-height-mapping.js effectiveHeightForN (pure Math, no import).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // d/dT of the RvM count = log(T/2pi)/(2pi)
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// The imp-35451/imp-35017/imp-3406 double-surrogate sigma(N), parameterised by a height MULTIPLIER.
function makeSigma(mult) {
  return function sigma(N) {
    const T0 = mult * effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35451).
function argmaxD(sigma, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Measure the skew triplet (c3, k, A_skew) about a given map own peak (imp-35451 stencils, verbatim).
function measureSkew(mult) {
  const sigma = makeSigma(mult);
  const sigU = (u) => sigma(Math.exp(u));
  const Nmax = argmaxD(sigma, 1e4, 1e9);
  const sigmaMax = sigma(Nmax);
  const U0 = Math.log(Nmax);

  // tol = 1e-5 plateau endpoints -> the directly-measured arm-imbalance slope A_skew (imp-35451/imp-35492).
  const tol = 1e-5;
  const targetLo = sigmaMax - tol;
  let a = Math.log(1);
  let b = U0;
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) < targetLo) a = m;
    else b = m;
  }
  const nLo = Math.exp((a + b) / 2);
  a = U0;
  b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > targetLo) a = m;
    else b = m;
  }
  const nHi = Math.exp((a + b) / 2);
  const wRise = (U0 - Math.log(nLo)) / Math.LN10;
  const wFall = (Math.log(nHi) - U0) / Math.LN10;
  const aSkewMeasured = (wRise - wFall) / tol;

  // Direct cubic coefficient c3 = sigma-triple-prime(u0)/6 via the 5-point third-difference stencil,
  // Richardson-extrapolated from the h = 1e-2 / 2e-2 pair (eliminates the leading O(h^2) bias).
  const d3FD = (h) =>
    (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
  const sigmaTriplePrime = (4 * d3FD(1e-2) - d3FD(2e-2)) / 3;
  const c3 = sigmaTriplePrime / 6;

  // Quadratic curvature k = -sigma''(u0) (imp-35450), needed for the cubic -> imbalance prediction.
  const k = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2);

  // Cross-check: the cubic coefficient PREDICTS the arm-imbalance slope A_skew = -4 c3 / (k^2 ln10).
  const aSkewPredicted = (-4 * c3) / (k * k * Math.LN10);
  const crossCheckRel = Math.abs(aSkewPredicted - aSkewMeasured) / aSkewPredicted;

  return { mult, Nmax, sigmaMax, log10Nmax: U0 / Math.LN10, sigmaTriplePrime, c3, k, aSkewMeasured, aSkewPredicted, crossCheckRel };
}

const MULTS = [1.0, 1.02, 0.98];
const MULT_NAMES = { 1.0: 'RvM inverse (BASE)', 1.02: 'RvM x 1.02', 0.98: 'RvM x 0.98' };
const RAW = MULTS.map(measureSkew);
const BASE = RAW[0];

const SKEW_LADDER = RAW.map((r) => ({
  heightMap: MULT_NAMES[r.mult],
  log10_N_max: +r.log10Nmax.toFixed(5),
  sigma_max: +r.sigmaMax.toFixed(9),
  c3: +r.c3.toExponential(6),
  sigma_triple_prime: +r.sigmaTriplePrime.toExponential(6),
  k: +r.k.toExponential(6),
  a_skew_measured: +r.aSkewMeasured.toFixed(5),
  a_skew_predicted: +r.aSkewPredicted.toFixed(5),
  cross_check_rel: +r.crossCheckRel.toExponential(3),
  d_c3_rel_vs_base: +(Math.abs(r.c3 - BASE.c3) / Math.abs(BASE.c3)).toExponential(3),
}));

// Full-pair drift metrics across the {BASE, x1.02, x0.98} triplet.
const C3_SPREAD_FRAC =
  (Math.max(...RAW.map((r) => r.c3)) - Math.min(...RAW.map((r) => r.c3))) / Math.abs(BASE.c3);
const A_SKEW_SPREAD_FRAC =
  (Math.max(...RAW.map((r) => r.aSkewMeasured)) - Math.min(...RAW.map((r) => r.aSkewMeasured))) /
  Math.abs(BASE.aSkewMeasured);
const SIGMA_MAX_SPREAD =
  Math.max(...RAW.map((r) => r.sigmaMax)) - Math.min(...RAW.map((r) => r.sigmaMax));
// Log-response slope d ln|c3| / d ln(mult) from the {x1.02, x0.98} arms (the imp-35536 -0.49 comparison).
const UP = RAW[1];
const DN = RAW[2];
const C3_LOG_SLOPE =
  (Math.log(Math.abs(UP.c3)) - Math.log(Math.abs(DN.c3))) / (Math.log(UP.mult) - Math.log(DN.mult));
// Relative sensitivity ratio: how much more the skew responds than the peak height (same +/- 2 percent pair).
const SIGMA_MAX_SPREAD_FRAC = SIGMA_MAX_SPREAD / BASE.sigmaMax;
const SKEW_VS_HEIGHT_SENSITIVITY = C3_SPREAD_FRAC / SIGMA_MAX_SPREAD_FRAC;

export const IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY = {
  id: 'imp-35557',
  proofSection: 'S-frontier',
  question:
    'imp-35451 measured the interior sigma-peak cubic-skew coefficient c3 ~ -2.623677e-4 (and the ' +
    'arm-imbalance slope A_skew ~ 11.01 it predicts) on the BASE RvM height map only. imp-35536 showed ' +
    'sigma_max is height-map-robust (~0.8 percent) while N_max moves moderately. Re-measure c3, k and ' +
    'A_skew under the RvM x {1.02, 0.98} perturbed maps: does the third-order skew INHERIT the peak ' +
    'robustness or drift materially?',
  method:
    'Swap ONLY the height multiplier in the imp-35451/imp-35017/imp-3406 double-surrogate sigma(N) = ' +
    'E_coll/(E_trunc + E_flow + E_coll), re-locate the peak by the imp-35451 ternary argmax, then re-run ' +
    'the imp-35451 stencils about THAT map own ln N_max: the 5-point Richardson-extrapolated third ' +
    'derivative (c3 = sigma-triple-prime/6), the quadratic curvature k, and the tol = 1e-5 arm-imbalance ' +
    'slope A_skew, under (A) RvM inverse, (B) RvM x 1.02, (C) RvM x 0.98.',
  base: {
    c3: +BASE.c3.toExponential(6), // ~ -2.623677e-4 (reproduces imp-35451 exactly)
    a_skew_measured: +BASE.aSkewMeasured.toFixed(5), // ~11.01451
    k: +BASE.k.toExponential(6), // ~6.431916e-3
  },
  skewLadder: SKEW_LADDER,
  drift: {
    c3_spread_frac: +C3_SPREAD_FRAC.toExponential(4), // ~1.85e-2 across the pair
    a_skew_spread_frac: +A_SKEW_SPREAD_FRAC.toExponential(4), // ~2.39e-2 across the pair
    sigma_max_spread: +SIGMA_MAX_SPREAD.toExponential(4), // ~1.05e-3 over the +/- 2 percent pair
    c3_log_response_slope: +C3_LOG_SLOPE.toFixed(4), // ~ -0.46, near the imp-35536 N_max slope -0.49
    skew_vs_height_sensitivity_ratio: +SKEW_VS_HEIGHT_SENSITIVITY.toFixed(2), // ~17x (relative, not absolute)
  },
  finding: {
    F1_c3_inherits_robustness:
      'The cubic skew INHERITS the peak robustness: under RvM x {1.02, 0.98} c3 stays at ~ -2.6e-4 to ' +
      'within ~0.9 percent per arm (full-pair spread ~1.85 percent of |c3|), A_skew stays at ~11.0 to ' +
      'within ~2.4 percent full-pair spread. It does NOT drift materially.',
    F2_sign_and_cross_check_hold:
      'BOTH the SIGN and the meaning survive: c3 stays NEGATIVE (the rising arm stays wider) under every ' +
      'map, and the cubic-predicts-imbalance cross-check A_skew_pred = -4 c3 / (k^2 ln10) still matches the ' +
      'directly measured A_skew to < 1.5e-3 relative under EACH perturbed map.',
    F3_log_damping_matches_location:
      'The log-response slope d ln|c3| / d ln(mult) ~ -0.46 is the SAME log-damping order as the imp-35536 ' +
      'peak-LOCATION slope d log10 N_max / d ln(mult) ~ -0.49 -- the skew reparametrises like the location, ' +
      'not wildly.',
    F4_honest_relative_caveat:
      'In RELATIVE terms the third-order skew is MORE sensitive than the peak height to the SAME +/- 2 ' +
      'percent map perturbation: sigma_max moves only ~1.05e-3 (~0.11 percent) while |c3| moves ~1.85 ' +
      'percent -- roughly a 17x larger fractional response (the expected ordering for a flat-topped ' +
      'extremum). But the ABSOLUTE drift is still only ~1 percent per 2-percent height move, so c3 ~ -2.6e-4 ' +
      'is a genuine surrogate-channel feature quotable to ~2 significant figures, NOT a map artifact.',
  },
  isRigorous: false,
  honestStatus:
    'Re-running the imp-35451 cubic-skew stencils under the imp-35536 RvM x {1.02, 0.98} perturbed maps: ' +
    'c3 drifts from -2.623677e-4 to -2.599790e-4 (x1.02) / -2.648243e-4 (x0.98) -- ~0.9 percent per arm, ' +
    'full-pair spread ~1.85 percent -- and A_skew from 11.01451 to 11.13633 / 10.87302 (~2.4 percent ' +
    'spread), with c3 NEGATIVE and the cubic-predicts-imbalance cross-check holding (< 1.5e-3) under EACH ' +
    'map. The skew INHERITS the peak robustness (log slope ~ -0.46, near the imp-35536 N_max slope -0.49); ' +
    'it is ~17x more responsive than sigma_max in RELATIVE terms only, still ~1 percent per 2-percent ' +
    'height move in absolute terms. Measurement only on the inherited imp-3220/imp-3406 surrogate; ' +
    'surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Applying the imp-35536 multiplicative-perturbation ' +
    'height-map method to the imp-35451 interior sigma-peak CUBIC skew: under RvM x {1.02, 0.98} the cubic ' +
    'coefficient c3 stays at ~ -2.6e-4 (full-pair spread ~1.85 percent of |c3|), the arm-imbalance slope ' +
    'A_skew stays at ~11.0 (spread ~2.4 percent), c3 stays NEGATIVE (rising arm stays wider) and the ' +
    'cubic-predicts-imbalance cross-check A_skew_pred = -4 c3 / (k^2 ln10) still matches to < 1.5e-3 ' +
    'relative under EACH map. The skew INHERITS the peak robustness -- log-response slope ~ -0.46, the same ' +
    'log-damping order as the imp-35536 N_max slope ~ -0.49 -- and does NOT drift materially. Honest caveat: ' +
    'in RELATIVE terms the third-order skew is ~17x more sensitive than the peak HEIGHT to the same +/- 2 ' +
    'percent map move (sigma_max moves only ~0.11 percent), but its ABSOLUTE drift is still ~1 percent per ' +
    '2-percent height perturbation, so c3 ~ -2.6e-4 is a genuine surrogate-channel feature to ~2 significant ' +
    'figures, not a map artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a ' +
    'rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and the ' +
    'imp-398 C_F prefactor are UNTOUCHED; surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  residual_sub_gap:
    'Inherits imp-35337a: this cross-checks the CUBIC skew of the peak on the imp-3220/imp-3406 double ' +
    'surrogate under a +/- 2 percent height-map bracket. It does NOT establish that the surrogate MAP ' +
    '(E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the true empirical-vs-analytic ' +
    'gap at these heights; that sub-gap imp-35337a stays OPEN.',
  citation:
    'imp-35451 (base-map c3 ~ -2.623677e-4 and A_skew ~ 11.01, recomputed here); imp-35536 (the ' +
    'multiplicative-perturbation method, sigma_max/N_max robustness); imp-35450 (quadratic curvature k ~ ' +
    '6.43e-3); imp-35492 (arm-difference linear-in-tol law); imp-35337 (dd-certified peak VALUE / 2.1e-5 ' +
    'margin); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-486 (C_mb GUE-conditional, UNTOUCHED); effectiveHeightForN (exact RvM inverse).',
};

export const IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: the BASE (RvM) map reproduces the imp-35451 c3 ~ -2.623677e-4 and A_skew ~ 11.01451.
    id: 'imp35557-reproduces-imp35451-base',
    description: 'RvM-base c3 reproduces imp-35451 (~ -2.623677e-4) and A_skew (~11.01451)',
    holds: () =>
      Math.abs(BASE.c3 - -2.623677e-4) < 5e-9 && Math.abs(BASE.aSkewMeasured - 11.01451) < 1e-3,
  },
  {
    // c3 stays NEGATIVE under EVERY perturbed map -- the rising-arm-wider sign is height-map-robust.
    id: 'imp35557-c3-sign-robust',
    description: 'c3 < 0 (rising arm wider) under every map RvM x {1.0, 1.02, 0.98}',
    holds: () => RAW.every((r) => r.c3 < 0),
  },
  {
    // c3 INHERITS the robustness: full-pair spread under 5 percent of |c3| (not a material drift).
    id: 'imp35557-c3-inherits-robustness',
    description: 'c3 full-pair spread under 5e-2 of |c3| across RvM x {1.02, 0.98} -- inherits peak robustness',
    holds: () => C3_SPREAD_FRAC > 0 && C3_SPREAD_FRAC < 5e-2,
  },
  {
    // A_skew is likewise robust: full-pair spread under 5 percent, staying near ~11.
    id: 'imp35557-a-skew-robust',
    description: 'A_skew full-pair spread under 5e-2 and every map A_skew in (10, 12)',
    holds: () => A_SKEW_SPREAD_FRAC < 5e-2 && RAW.every((r) => r.aSkewMeasured > 10 && r.aSkewMeasured < 12),
  },
  {
    // The cubic-predicts-imbalance cross-check survives EACH perturbed map (< 1e-2 relative).
    id: 'imp35557-cross-check-holds-each-map',
    description: 'A_skew_pred = -4 c3/(k^2 ln10) matches measured A_skew to < 1e-2 relative under every map',
    holds: () => RAW.every((r) => r.crossCheckRel < 1e-2),
  },
  {
    // Log-response slope d ln|c3|/d ln(mult) is the same well-damped order as the imp-35536 N_max slope.
    id: 'imp35557-log-slope-matches-location',
    description: 'd ln|c3|/d ln(mult) ~ -0.46, same log-damping order as the imp-35536 N_max slope ~ -0.49',
    holds: () => C3_LOG_SLOPE < 0 && C3_LOG_SLOPE > -0.7,
  },
  {
    // Honest caveat gate: the skew is more RELATIVELY sensitive than sigma_max, but sigma_max still barely moves.
    id: 'imp35557-relative-sensitivity-caveat',
    description: 'skew is more relatively sensitive than sigma_max (ratio > 3) yet sigma_max spread < 2e-3',
    holds: () => SKEW_VS_HEIGHT_SENSITIVITY > 3 && SIGMA_MAX_SPREAD < 2e-3,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35557-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /imp-35337a/.test(IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.residual_sub_gap),
  },
];

for (const a of IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35557-cubic-skew-height-map-sensitivity assertion failed: ${a.id}`);
  }
}

export default IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY;
