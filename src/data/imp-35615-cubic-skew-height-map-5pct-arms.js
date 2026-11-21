/**
 * @module imp-35615-cubic-skew-height-map-5pct-arms
 *
 * imp-35615 (numerical, frontier-direction): imp-35557 measured the interior sigma-peak
 * cubic-skew height-map robustness (c3, k, A_skew) on the RvM x {1.02, 0.98} pair ONLY (+/- 2
 * percent), while imp-35555 (crossover) and imp-35536 (peak height / location) both used the
 * wider RvM x {1.02, 0.98, 1.05, 0.95} bracketing family (+/- 5 percent). This module extends
 * imp-35557 to the +/- 5 percent arms: it re-locates the peak by the imp-35451 ternary argmax and
 * re-measures the 5-point Richardson third derivative c3, the quadratic curvature k and the
 * tol = 1e-5 arm-imbalance slope A_skew on RvM x {1.05, 0.95}, then reports the FULL four-arm
 * bracketing envelope span for c3 / k / A_skew and whether the ~1.85-percent-per-2-percent-arm
 * robustness HOLDS or STEEPENS at +/- 5 percent.
 *
 * THE MEASUREMENT (single swap: the height map only, imp-35557 component model VERBATIM)
 * ------------------------------------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), reproduced VERBATIM from imp-35557/imp-35451:
 *   E_coll = C_C_PINNED sqrt(log T0 / N)  (dominant, GUE-conditional C_H),
 *   E_flow = C_F (log T0 / T0) Gronwall,   C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_trunc = 3.06e-5   (N-independent fixed-strip route).
 * Only the height map T0(N) is swapped, now across the FULL four-arm bracketing family:
 *   (A) exact RvM inverse (BASE), (B) RvM x 1.02, (C) RvM x 0.98, (D) RvM x 1.05, (E) RvM x 0.95.
 * At each map the peak is RE-LOCATED by the imp-35451 ternary argmax, then the SAME three
 * quantities are re-measured about THAT map own ln N_max.
 *
 *   height map     log10 N_max   sigma_max      c3             k              A_skew (meas)
 *   RvM (BASE)     5.96467       0.949429014    -2.623677e-4   6.431916e-3    11.01451
 *   RvM x 1.02     5.95497       0.949947663    -2.599790e-4   6.365650e-3    11.13633
 *   RvM x 0.98     5.97456       0.948894740    -2.648243e-4   6.500125e-3    10.87302
 *   RvM x 1.05     5.94076       0.950697952    -2.565164e-4   6.269701e-3    11.31885
 *   RvM x 0.95     5.98978       0.948062269    -2.686436e-4   6.606300e-3    10.68829
 *
 * THE FINDING
 * -----------
 * The cubic skew STAYS ROBUST at the wider +/- 5 percent bracket -- it does NOT begin to drift or
 * steepen. Across the FULL four-arm envelope {x1.02, x0.98, x1.05, x0.95} plus BASE, c3 spans only
 * ~4.62 percent of |c3| (outer x1.05 -> x0.95) and A_skew spans ~5.72 percent, and the outer 5-percent
 * arms extend the 2-percent pair LINEARLY: the log-response slope d ln|c3| / d ln(mult) measured on
 * the +/- 5 percent arms is ~ -0.4615, essentially IDENTICAL to the +/- 2 percent arm slope ~ -0.4616.
 * The skew reparametrisation is LOG-LINEAR out to +/- 5 percent -- no steepening, no curvature onset.
 * c3 stays NEGATIVE (rising arm wider) on every arm and the cubic-predicts-imbalance cross-check
 * A_skew_pred = -4 c3 / (k^2 ln10) still matches the directly measured A_skew to < 1.6e-3 relative on
 * EACH of the two 5-percent arms.
 *
 * THE HONEST READING
 * ------------------
 * At +/- 2 percent the outer full-pair spread was ~1.85 percent of |c3| (imp-35557); at +/- 5 percent
 * the outer full-pair spread is ~4.62 percent -- a factor ~2.5 that tracks the 2.5x wider bracket
 * ALMOST exactly (log-linear, slope preserved), so the robustness is NOT a small-bracket accident: the
 * ~0.92-percent-per-2-percent-arm response continues smoothly to ~2.3-percent-per-5-percent-arm. The
 * skew is a genuine surrogate-channel feature quotable to ~2 significant figures (c3 ~ -2.6e-4) across
 * the entire +/- 5 percent envelope, NOT a map artifact -- the same verdict imp-35536 / imp-35557 reached.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; NOT a rigorous asymptotic;
 * changes no bound. Surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F
 * prefactor UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35557-cubic-skew-height-map-sensitivity (the +/- 2 percent pair, component model reused verbatim)
 * @see imp-35536-peak-height-map-sensitivity (the +/- 5 percent bracketing family, sigma_max/N_max robustness)
 * @see imp-35555-crossover-height-map-sensitivity (the same +/- 5 percent bracket, crossover channel)
 * @see imp-35451-sigma-peak-arm-asymmetry (base-map c3 ~ -2.623677e-4 and A_skew ~ 11.01, recomputed here)
 * @see imp-35450-sigma-peak-curvature-direct-fd (the quadratic curvature k ~ 6.43e-3)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35557/imp-35451/imp-35536 exactly

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

// The imp-35557/imp-35451/imp-35017/imp-3406 double-surrogate sigma(N), parameterised by a height MULTIPLIER.
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

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35557/imp-35451).
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

// Measure the skew triplet (c3, k, A_skew) about a given map own peak (imp-35557/imp-35451 stencils, verbatim).
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

// FULL four-arm bracketing family: BASE + the imp-35557 +/- 2 percent pair + the NEW +/- 5 percent pair.
const MULTS = [1.0, 1.02, 0.98, 1.05, 0.95];
const MULT_NAMES = {
  1.0: 'RvM inverse (BASE)',
  1.02: 'RvM x 1.02',
  0.98: 'RvM x 0.98',
  1.05: 'RvM x 1.05',
  0.95: 'RvM x 0.95',
};
const RAW = MULTS.map(measureSkew);
const BASE = RAW[0];
const ARM_2_UP = RAW[1];
const ARM_2_DN = RAW[2];
const ARM_5_UP = RAW[3];
const ARM_5_DN = RAW[4];

const SKEW_LADDER = RAW.map((r) => ({
  heightMap: MULT_NAMES[r.mult],
  log10_N_max: +r.log10Nmax.toFixed(5),
  sigma_max: +r.sigmaMax.toFixed(9),
  c3: +r.c3.toExponential(6),
  k: +r.k.toExponential(6),
  a_skew_measured: +r.aSkewMeasured.toFixed(5),
  a_skew_predicted: +r.aSkewPredicted.toFixed(5),
  cross_check_rel: +r.crossCheckRel.toExponential(3),
  d_c3_rel_vs_base: +(Math.abs(r.c3 - BASE.c3) / Math.abs(BASE.c3)).toExponential(3),
}));

// FULL four-arm envelope span (outer x1.05 -> x0.95 dominates; base + inner arms lie inside).
const C3_ENVELOPE_FRAC =
  (Math.max(...RAW.map((r) => r.c3)) - Math.min(...RAW.map((r) => r.c3))) / Math.abs(BASE.c3);
const A_SKEW_ENVELOPE_FRAC =
  (Math.max(...RAW.map((r) => r.aSkewMeasured)) - Math.min(...RAW.map((r) => r.aSkewMeasured))) /
  Math.abs(BASE.aSkewMeasured);
const K_ENVELOPE_FRAC =
  (Math.max(...RAW.map((r) => r.k)) - Math.min(...RAW.map((r) => r.k))) / Math.abs(BASE.k);

// Log-response slopes d ln|c3| / d ln(mult): the NEW +/- 5 percent arms vs the imp-35557 +/- 2 percent arms.
const C3_LOG_SLOPE_5PCT =
  (Math.log(Math.abs(ARM_5_UP.c3)) - Math.log(Math.abs(ARM_5_DN.c3))) /
  (Math.log(ARM_5_UP.mult) - Math.log(ARM_5_DN.mult));
const C3_LOG_SLOPE_2PCT =
  (Math.log(Math.abs(ARM_2_UP.c3)) - Math.log(Math.abs(ARM_2_DN.c3))) /
  (Math.log(ARM_2_UP.mult) - Math.log(ARM_2_DN.mult));
// Log-linearity gate: how far the +/- 5 percent slope departs from the +/- 2 percent slope.
const SLOPE_DRIFT_FRAC = Math.abs((C3_LOG_SLOPE_5PCT - C3_LOG_SLOPE_2PCT) / C3_LOG_SLOPE_2PCT);

export const IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS = {
  id: 'imp-35615',
  proofSection: 'S-frontier',
  question:
    'imp-35557 measured the interior sigma-peak cubic-skew (c3, k, A_skew) height-map robustness on the ' +
    'RvM x {1.02, 0.98} pair ONLY (+/- 2 percent), while imp-35555 and imp-35536 used the wider ' +
    'RvM x {1.02, 0.98, 1.05, 0.95} bracketing family (+/- 5 percent). Extend imp-35557 to the +/- 5 ' +
    'percent arms: re-locate the peak and re-measure c3, k and A_skew on RvM x {1.05, 0.95}, report the ' +
    'full four-arm envelope span, and say whether the ~1.85-percent-per-2-percent robustness HOLDS or ' +
    'STEEPENS at +/- 5 percent.',
  method:
    'Reuse the imp-35557 component model VERBATIM (E_coll = C_C sqrt(log T0/N), E_flow Gronwall, ' +
    'E_trunc = 3.06e-5); swap ONLY the height multiplier across the FULL four-arm family (BASE, x1.02, ' +
    'x0.98, x1.05, x0.95), re-locate the peak by the imp-35451 ternary argmax, then re-run the imp-35451 ' +
    'stencils about each map own ln N_max: the 5-point Richardson third derivative c3, the quadratic ' +
    'curvature k, and the tol = 1e-5 arm-imbalance slope A_skew. Compare the +/- 5 percent log-response ' +
    'slope to the imp-35557 +/- 2 percent slope.',
  base: {
    c3: +BASE.c3.toExponential(6), // ~ -2.623677e-4 (reproduces imp-35451/imp-35557 exactly)
    a_skew_measured: +BASE.aSkewMeasured.toFixed(5), // ~11.01451
    k: +BASE.k.toExponential(6), // ~6.431916e-3
  },
  fivePercentArms: {
    x1_05: {
      c3: +ARM_5_UP.c3.toExponential(6), // ~ -2.565164e-4
      k: +ARM_5_UP.k.toExponential(6), // ~6.269701e-3
      a_skew_measured: +ARM_5_UP.aSkewMeasured.toFixed(5), // ~11.31885
      cross_check_rel: +ARM_5_UP.crossCheckRel.toExponential(3), // ~1.526e-3
    },
    x0_95: {
      c3: +ARM_5_DN.c3.toExponential(6), // ~ -2.686436e-4
      k: +ARM_5_DN.k.toExponential(6), // ~6.606300e-3
      a_skew_measured: +ARM_5_DN.aSkewMeasured.toFixed(5), // ~10.68829
      cross_check_rel: +ARM_5_DN.crossCheckRel.toExponential(3), // ~4.509e-4
    },
  },
  skewLadder: SKEW_LADDER,
  envelope: {
    c3_envelope_frac: +C3_ENVELOPE_FRAC.toExponential(4), // ~4.62e-2 across the full four-arm family
    a_skew_envelope_frac: +A_SKEW_ENVELOPE_FRAC.toExponential(4), // ~5.72e-2
    k_envelope_frac: +K_ENVELOPE_FRAC.toExponential(4), // ~5.23e-2
    c3_log_slope_5pct: +C3_LOG_SLOPE_5PCT.toFixed(4), // ~ -0.4615
    c3_log_slope_2pct: +C3_LOG_SLOPE_2PCT.toFixed(4), // ~ -0.4616 (imp-35557)
    slope_drift_frac: +SLOPE_DRIFT_FRAC.toExponential(3), // ~2e-4 -- log-linear, essentially no steepening
  },
  finding: {
    F1_robustness_holds_at_5pct:
      'The cubic skew STAYS ROBUST at the wider +/- 5 percent bracket: across the full four-arm family ' +
      '{x1.02, x0.98, x1.05, x0.95} plus BASE, c3 spans only ~4.62 percent of |c3| and A_skew ~5.72 ' +
      'percent. It does NOT begin to drift or steepen.',
    F2_log_linear_no_steepening:
      'The +/- 5 percent arms extend the +/- 2 percent pair LINEARLY: the log-response slope ' +
      'd ln|c3|/d ln(mult) ~ -0.4615 on the +/- 5 percent arms is essentially IDENTICAL to the imp-35557 ' +
      '+/- 2 percent slope ~ -0.4616 (drift ~2e-4). The skew reparametrisation is log-linear out to +/- 5 ' +
      'percent -- no curvature onset.',
    F3_sign_and_cross_check_hold:
      'c3 stays NEGATIVE (rising arm wider) on every one of the four arms, and the ' +
      'cubic-predicts-imbalance cross-check A_skew_pred = -4 c3/(k^2 ln10) still matches the directly ' +
      'measured A_skew to < 1.6e-3 relative on EACH 5-percent arm.',
    F4_envelope_tracks_bracket:
      'The +/- 5 percent outer full-pair spread (~4.62 percent of |c3|) is ~2.5x the imp-35557 +/- 2 ' +
      'percent pair spread (~1.85 percent) -- tracking the 2.5x wider bracket almost exactly, so the ' +
      'robustness is NOT a small-bracket accident: c3 ~ -2.6e-4 is a genuine surrogate-channel feature to ' +
      '~2 significant figures across the entire +/- 5 percent envelope, NOT a map artifact.',
  },
  isRigorous: false,
  honestStatus:
    'Extending the imp-35557 cubic-skew stencils to the imp-35536/imp-35555 +/- 5 percent bracket arms: ' +
    'on RvM x 1.05 c3 = -2.565164e-4 (A_skew 11.31885), on RvM x 0.95 c3 = -2.686436e-4 (A_skew 10.68829). ' +
    'Across the full four-arm envelope c3 spans ~4.62 percent and A_skew ~5.72 percent, with c3 NEGATIVE ' +
    'and the cross-check < 1.6e-3 on each 5-percent arm. The +/- 5 percent log slope ~ -0.4615 matches the ' +
    'imp-35557 +/- 2 percent slope ~ -0.4616 to ~2e-4 -- the skew stays LOG-LINEARLY robust, it does NOT ' +
    'steepen. Measurement only on the inherited imp-3220/imp-3406 surrogate; surrogate-vs-true fidelity ' +
    '(imp-35337a) UNTOUCHED; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35557 interior sigma-peak ' +
    'cubic-skew height-map measurement from the +/- 2 percent pair to the imp-35536/imp-35555 +/- 5 ' +
    'percent bracket arms (RvM x {1.05, 0.95}): c3 stays at ~ -2.6e-4 on both new arms (x1.05 -2.565164e-4, ' +
    'x0.95 -2.686436e-4), the full four-arm envelope spans only ~4.62 percent of |c3| (A_skew ~5.72 ' +
    'percent), c3 stays NEGATIVE (rising arm wider) on every arm and the cubic-predicts-imbalance ' +
    'cross-check A_skew_pred = -4 c3/(k^2 ln10) still matches to < 1.6e-3 relative on each 5-percent arm. ' +
    'The +/- 5 percent log-response slope d ln|c3|/d ln(mult) ~ -0.4615 is essentially IDENTICAL to the ' +
    'imp-35557 +/- 2 percent slope ~ -0.4616 (drift ~2e-4), so the cubic skew STAYS ROBUST -- log-linearly, ' +
    'with NO steepening -- at the wider bracket, and the ~1.85-percent-per-2-percent-arm response continues ' +
    'smoothly to ~2.3 percent per 5-percent arm. c3 ~ -2.6e-4 is a genuine surrogate-channel feature to ~2 ' +
    'significant figures across the entire +/- 5 percent envelope, not a map artifact. Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; ' +
    'surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  residual_sub_gap:
    'Inherits imp-35337a: this extends the CUBIC-skew height-map cross-check of the peak from +/- 2 to ' +
    '+/- 5 percent on the imp-3220/imp-3406 double surrogate. It does NOT establish that the surrogate MAP ' +
    '(E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the true empirical-vs-analytic ' +
    'gap at these heights; that sub-gap imp-35337a stays OPEN.',
  citation:
    'imp-35557 (the +/- 2 percent pair, component model reused verbatim); imp-35536 (the +/- 5 percent ' +
    'bracketing family, sigma_max/N_max robustness); imp-35555 (same bracket, crossover channel); ' +
    'imp-35451 (base-map c3 ~ -2.623677e-4 and A_skew ~ 11.01, recomputed here); imp-35450 (quadratic ' +
    'curvature k ~ 6.43e-3); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional, UNTOUCHED); effectiveHeightForN ' +
    '(exact RvM inverse).',
};

export const IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS_ASSERTIONS = [
  {
    // Reuse gate: the BASE (RvM) map reproduces the imp-35451/imp-35557 c3 ~ -2.623677e-4 and A_skew ~ 11.01451.
    id: 'imp35615-reproduces-imp35557-base',
    description: 'RvM-base c3 reproduces imp-35451/imp-35557 (~ -2.623677e-4) and A_skew (~11.01451)',
    holds: () =>
      Math.abs(BASE.c3 - -2.623677e-4) < 5e-9 && Math.abs(BASE.aSkewMeasured - 11.01451) < 1e-3,
  },
  {
    // The NEW 5-percent arms reproduce the offline-computed c3 literals (byte-faithful to the model).
    id: 'imp35615-5pct-arms-c3-literals',
    description: 'RvM x1.05 c3 ~ -2.565164e-4 and RvM x0.95 c3 ~ -2.686436e-4 (5-percent arms)',
    holds: () =>
      Math.abs(ARM_5_UP.c3 - -2.565164e-4) < 5e-9 && Math.abs(ARM_5_DN.c3 - -2.686436e-4) < 5e-9,
  },
  {
    // c3 stays NEGATIVE on EVERY one of the four arms -- the rising-arm-wider sign is height-map-robust.
    id: 'imp35615-c3-sign-robust-four-arm',
    description: 'c3 < 0 (rising arm wider) on every map RvM x {1.0, 1.02, 0.98, 1.05, 0.95}',
    holds: () => RAW.every((r) => r.c3 < 0),
  },
  {
    // c3 STAYS ROBUST at +/- 5 percent: full four-arm envelope span under 6 percent of |c3| (no material drift).
    id: 'imp35615-c3-envelope-robust',
    description: 'c3 four-arm envelope span under 6e-2 of |c3| across RvM x {1.02, 0.98, 1.05, 0.95}',
    holds: () => C3_ENVELOPE_FRAC > 0 && C3_ENVELOPE_FRAC < 6e-2,
  },
  {
    // A_skew likewise robust at +/- 5 percent: envelope span under 7 percent, every arm near ~11.
    id: 'imp35615-a-skew-envelope-robust',
    description: 'A_skew four-arm envelope span under 7e-2 and every map A_skew in (10, 12)',
    holds: () =>
      A_SKEW_ENVELOPE_FRAC < 7e-2 && RAW.every((r) => r.aSkewMeasured > 10 && r.aSkewMeasured < 12),
  },
  {
    // The cubic-predicts-imbalance cross-check survives EACH 5-percent arm (< 2e-3 relative).
    id: 'imp35615-cross-check-holds-5pct-arms',
    description: 'A_skew_pred = -4 c3/(k^2 ln10) matches measured A_skew to < 2e-3 on each 5-percent arm',
    holds: () => ARM_5_UP.crossCheckRel < 2e-3 && ARM_5_DN.crossCheckRel < 2e-3,
  },
  {
    // Log-linearity gate: the +/- 5 percent slope matches the imp-35557 +/- 2 percent slope (no steepening).
    id: 'imp35615-log-linear-no-steepening',
    description: 'd ln|c3|/d ln(mult) at +/- 5 percent (~ -0.4615) matches +/- 2 percent (~ -0.4616) to < 5e-3',
    holds: () =>
      C3_LOG_SLOPE_5PCT < 0 && C3_LOG_SLOPE_5PCT > -0.7 && SLOPE_DRIFT_FRAC < 5e-3,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35615-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS.isRigorous === false &&
      /NO QED/.test(IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS.verdict) &&
      /refereed bound is changed/i.test(IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS.verdict) &&
      /imp-35337a/.test(IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS.residual_sub_gap),
  },
];

for (const a of IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35615-cubic-skew-height-map-5pct-arms assertion failed: ${a.id}`);
  }
}

export default IMP35615_CUBIC_SKEW_HEIGHT_MAP_5PCT_ARMS;
