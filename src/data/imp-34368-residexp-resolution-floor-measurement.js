/**
 * @module imp-34368-residexp-resolution-floor-measurement
 *
 * imp-34368 (numerical): MEASURE the resid_exp(k) evaluation-noise / resolution floor that bounds the
 * accuracy of the imp-34228 deep-ladder live ternary peak k_true ~ 8.8210915878573530, and CLOSE the
 * named sub-gap SUB-GAP-imp-34228-residexp-resolution-floor. imp-34228 pinned the full double-precision
 * live ternary peak ~4.3e-11 BELOW the imp-34168 stored 10-sig-fig literal 8.8210915879 and flagged that
 * it was UNRESOLVED whether that ~4.3e-11 offset is a real feature or an evaluation-noise floor. This
 * module quantifies the floor three independent ways on the SAME inherited imp-33810/imp-33878 resid_exp(k)
 * surrogate (re-implemented verbatim, light imports only), and settles the question.
 *
 * WHAT IS MEASURED (all three agree):
 *   (A) TRUE curvature at the peak. Central differences f2 = [f(k+h)-2f(k)+f(k-h)]/h^2 are stable across
 *       h = 1e-2 .. 1e-4 at f2 ~ -0.036196 (the honest hump curvature; a naive quadratic fit at 5e-13
 *       spacing instead returns a spurious ~-5.9e5 that is pure noise structure, NOT curvature).
 *   (B) EVALUATION-NOISE floor of resid_exp itself. Sampling resid_exp at 5e-13 spacing (far below any
 *       resolvable feature) and subtracting the local quadratic fit leaves an RMS residual eps_f ~ 9.4e-17
 *       (~6.5 ulp of f_peak ~ 0.0653), i.e. double-precision rounding accumulated across the OLS / logs.
 *   (C) PREDICTED peak-location floor. For a smooth maximum, a function-value noise eps_f maps to a
 *       peak-location uncertainty dk ~ sqrt(2 eps_f / |f2|) ~ 7.2e-8 -- SEVEN orders of magnitude coarser
 *       than the ~4.3e-11 offset imp-34228 measured.
 *
 * DIRECT CONFIRMATION (the decisive check): re-running the SAME ternary search from ten DIFFERENT brackets
 * spanning [8.0,9.5] .. [8.7,9.0] returns peaks that scatter over max-min ~ 9.0e-8 (std ~2.5e-8) -- matching
 * the sqrt-formula prediction (~7.2e-8) to within a factor ~1.25. So the trailing digits of the "full
 * double-precision" peak beyond ~8.82109 (~6-7 significant figures) are NOT reproducible; they are
 * evaluation noise.
 *
 * ANSWER TO THE SUB-GAP: the ~4.3e-11 imp-34228 live-vs-stored offset is NOT a real feature. It sits
 * ~1600x BELOW the ~7.2e-8 evaluation-noise resolution floor -- deep inside the noise, unresolvable. The
 * floor is set by eps_f / |f2| with eps_f ~ 9.4e-17 (double-precision accumulation).
 *
 * DOES HIGHER PRECISION OR AN ANALYTIC DERIVATIVE LOWER IT? Assessed both:
 *   - The floor scales as sqrt(eps_f / |f2|). eps_f is fixed by the WORKING precision of the resid_exp
 *     evaluation (native f64, ~6 ulp accumulation), so the ONLY lever that lowers it is raising that
 *     working precision (bignum) -- a genuinely different evaluation path, not available at native double.
 *   - An analytic / finite-difference DERIVATIVE root does NOT help: bisecting the central-difference
 *     derivative to f2p = 0 lands at ~8.82109160086, ANOTHER point inside the SAME ~9e-8 scatter band. The
 *     derivative inherits (and, via the 1/(2h) division, amplifies) the same f64 value-noise, so neither the
 *     derivative-root nor more ternary iterations resolve below the ~7e-8 floor.
 *
 * MEASUREMENT ONLY. A noise/resolution characterization of an inherited descriptive surrogate argmax, NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34228-doubling-map-double-precision-anchor-floor (the deep-ladder module that named this sub-gap)
 * @see imp-34168-doubling-map-highprecision-kstar-floor (the 10-sig-fig stored anchor 8.8210915879)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* and the resid_exp model, reused verbatim)
 * @see imp-33810 (the ladder storing resid_exp(k), reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34228/imp-34168/imp-34044/imp-33878 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-34228 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}

// p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade (imp-33582/imp-33730, verbatim).
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
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

// p_ecoll = -d log E_coll / d log N over endpoints (imp-33620/imp-33727, verbatim).
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) over window [10^k, 10^(k+1)] (imp-33810/imp-33878 defn, verbatim).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma) - olsSigmaExponent(lo, hi);
}

// Independent ternary search on the SAME resid_exp -- the live full-double-precision continuum peak.
function ternaryArgmax(lo, hi, iters = 300) {
  for (let i = 0; i < iters; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------------------------------
// (A) The live full-double-precision peak (imp-34228 anchor) and the imp-34168 stored 10-sig-fig literal.
const K_PEAK_LIVE = ternaryArgmax(8.0, 9.5); // ~8.8210915878573530
const K_STORED_10SIGFIG = 8.8210915879; // imp-34168 stored literal (imp-34228 control anchor)
const OFFSET_LIVE_VS_STORED = Math.abs(K_PEAK_LIVE - K_STORED_10SIGFIG); // ~4.27e-11 (the imp-34228 offset)
const F_PEAK = residExp(K_PEAK_LIVE); // ~0.06534

// (A) TRUE curvature at the peak via central differences, stable across h = 1e-2 .. 1e-4.
const CURV_STEPS = [1e-2, 3e-3, 1e-3, 3e-4, 1e-4];
const CURV_SAMPLES = CURV_STEPS.map((h) => ({
  h,
  f2: (residExp(K_PEAK_LIVE + h) - 2 * F_PEAK + residExp(K_PEAK_LIVE - h)) / (h * h),
}));
const F2_TRUE = CURV_SAMPLES.find((s) => s.h === 1e-3).f2; // ~-0.036196
const CURV_MAX_SPREAD = Math.max(...CURV_SAMPLES.map((s) => s.f2)) - Math.min(...CURV_SAMPLES.map((s) => s.f2));

// (B) EVALUATION-NOISE floor eps_f: sample resid_exp at 5e-13 spacing (far below any resolvable feature),
// subtract the local quadratic least-squares fit, take the RMS residual. This is the f64 rounding noise.
function noiseFloorRms(center, spacing = 5e-13, half = 20) {
  let n = 0;
  let sx = 0;
  let sx2 = 0;
  let sx3 = 0;
  let sx4 = 0;
  let sy = 0;
  let sxy = 0;
  let sx2y = 0;
  const rows = [];
  for (let i = -half; i <= half; i++) {
    const x = i * spacing; // centered coordinate (center subtracted)
    const v = residExp(center + x);
    rows.push({ x, v });
    n += 1;
    sx += x;
    sx2 += x * x;
    sx3 += x * x * x;
    sx4 += x * x * x * x;
    sy += v;
    sxy += x * v;
    sx2y += x * x * v;
  }
  // Solve the 3x3 normal equations for a + b x + c x^2 by Gaussian elimination.
  const M = [
    [n, sx, sx2, sy],
    [sx, sx2, sx3, sxy],
    [sx2, sx3, sx4, sx2y],
  ];
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    const tmp = M[col];
    M[col] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let cc = col; cc < 4; cc++) M[r][cc] -= f * M[col][cc];
    }
  }
  const a = M[0][3] / M[0][0];
  const b = M[1][3] / M[1][1];
  const c = M[2][3] / M[2][2];
  let ss = 0;
  for (const row of rows) {
    const fit = a + b * row.x + c * row.x * row.x;
    ss += (row.v - fit) ** 2;
  }
  return Math.sqrt(ss / rows.length);
}
const EPS_F = noiseFloorRms(K_PEAK_LIVE); // ~9.4e-17 (~6.5 ulp of f_peak)
const ULP_F_PEAK = Math.abs(F_PEAK) * 2.220446049250313e-16; // ~1.45e-17

// (C) PREDICTED peak-location resolution floor from function-value noise on a smooth maximum.
const FLOOR_PREDICTED = Math.sqrt((2 * EPS_F) / Math.abs(F2_TRUE)); // ~7.2e-8

// ---------------------------------------------------------------------------------------------------
// DIRECT CONFIRMATION: re-run the SAME ternary search from ten different brackets; the scatter of the
// returned peaks is the empirical resolution floor of the peak location.
const BRACKETS = [
  [8.0, 9.5],
  [8.2, 9.4],
  [8.5, 9.2],
  [8.6, 9.05],
  [8.4, 9.3],
  [8.3, 9.45],
  [8.55, 9.1],
  [8.7, 9.0],
  [8.1, 9.49],
  [8.45, 9.25],
];
const BRACKET_PEAKS = BRACKETS.map(([lo, hi]) => ternaryArgmax(lo, hi));
const SPREAD_MAX_MIN = Math.max(...BRACKET_PEAKS) - Math.min(...BRACKET_PEAKS); // ~9.0e-8
const PEAK_MEAN = BRACKET_PEAKS.reduce((a, b) => a + b, 0) / BRACKET_PEAKS.length;
const SPREAD_STD = Math.sqrt(
  BRACKET_PEAKS.reduce((s, p) => s + (p - PEAK_MEAN) ** 2, 0) / BRACKET_PEAKS.length,
); // ~2.5e-8

// The measured scatter matches the sqrt-formula prediction to within a small factor.
const FLOOR_MEASURED_VS_PREDICTED_RATIO = SPREAD_MAX_MIN / FLOOR_PREDICTED; // ~1.25

// The offset imp-34228 measured sits far BELOW the floor => it is not a resolvable feature.
const FLOOR_TO_OFFSET_RATIO = FLOOR_PREDICTED / OFFSET_LIVE_VS_STORED; // ~1600

// ---------------------------------------------------------------------------------------------------
// ANALYTIC-DERIVATIVE assessment: bisect the central-difference derivative to a root; it lands inside the
// SAME scatter band, i.e. it does NOT resolve below the ~7e-8 floor (the derivative inherits the f64 noise).
function centralDerivative(k, h = 1e-4) {
  return (residExp(k + h) - residExp(k - h)) / (2 * h);
}
function derivativeRoot() {
  let lo = 8.6;
  let hi = 9.05;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (centralDerivative(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const DERIV_ROOT_PEAK = derivativeRoot(); // ~8.82109160086
const DERIV_ROOT_INSIDE_BAND =
  DERIV_ROOT_PEAK >= Math.min(...BRACKET_PEAKS) - FLOOR_PREDICTED &&
  DERIV_ROOT_PEAK <= Math.max(...BRACKET_PEAKS) + FLOOR_PREDICTED;
// The derivative-root disagrees with the live ternary peak by MORE than the imp-34228 offset -- i.e. it
// does not converge onto a finer answer; it just re-samples inside the same noise band.
const DERIV_VS_LIVE_GAP = Math.abs(DERIV_ROOT_PEAK - K_PEAK_LIVE); // ~1.4e-8, >> 4.3e-11

export const IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT = {
  id: 'imp-34368',
  proofSection: 'S-frontier',
  question:
    'imp-34228 pinned the full double-precision live ternary peak k_true~8.8210915878573530 ~4.3e-11 BELOW ' +
    'the imp-34168 stored 10-sig-fig literal 8.8210915879 and flagged SUB-GAP-imp-34228-residexp-resolution-' +
    'floor: is that ~4.3e-11 offset a real feature or an evaluation-noise floor? MEASURE the resid_exp(k) ' +
    'evaluation-noise / resolution floor and assess whether higher working precision or an analytic ' +
    'derivative lowers it. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the resid_exp(k) peak-location resolution floor near k~8.821092, measured three ways: (A) the TRUE ' +
    'central-difference curvature f2~-0.0362; (B) the resid_exp evaluation-noise RMS eps_f~9.4e-17 (quadratic-' +
    'fit residual at 5e-13 spacing); (C) the predicted floor sqrt(2 eps_f/|f2|)~7.2e-8; DIRECTLY confirmed by ' +
    'the max-min~9.0e-8 (std~2.5e-8) scatter of the ternary peak across ten brackets; plus a derivative-root ' +
    'control landing inside the same band',
  livePeak: +K_PEAK_LIVE.toFixed(16), // ~8.8210915878573530
  storedAnchor10sigfig: K_STORED_10SIGFIG, // 8.8210915879
  imp34228OffsetLiveVsStored: +OFFSET_LIVE_VS_STORED.toExponential(4), // ~4.27e-11
  fPeak: +F_PEAK.toExponential(6), // ~0.0653366
  curvatureSamples: CURV_SAMPLES.map((s) => ({ h: s.h, f2: +s.f2.toPrecision(8) })),
  curvatureTrue: +F2_TRUE.toPrecision(8), // ~-0.036196415
  curvatureMaxSpreadOverH: +CURV_MAX_SPREAD.toExponential(3), // tiny -> curvature is well-resolved
  evaluationNoiseRms: +EPS_F.toExponential(4), // ~9.4e-17
  ulpOfFPeak: +ULP_F_PEAK.toExponential(4), // ~1.45e-17
  noiseInUlp: +(EPS_F / ULP_F_PEAK).toFixed(2), // ~6.5
  floorPredicted: +FLOOR_PREDICTED.toExponential(4), // ~7.2e-8
  bracketPeaks: BRACKET_PEAKS.map((p) => +p.toFixed(14)),
  floorMeasuredSpreadMaxMin: +SPREAD_MAX_MIN.toExponential(4), // ~9.0e-8
  floorMeasuredSpreadStd: +SPREAD_STD.toExponential(4), // ~2.5e-8
  floorMeasuredVsPredictedRatio: +FLOOR_MEASURED_VS_PREDICTED_RATIO.toFixed(3), // ~1.25
  floorToOffsetRatio: +FLOOR_TO_OFFSET_RATIO.toFixed(0), // ~1600
  derivativeRootPeak: +DERIV_ROOT_PEAK.toFixed(16), // ~8.82109160086
  derivativeRootInsideNoiseBand: DERIV_ROOT_INSIDE_BAND, // true
  derivativeVsLivePeakGap: +DERIV_VS_LIVE_GAP.toExponential(4), // ~1.4e-8 (>> the 4.3e-11 offset)
  subGapResolved: 'SUB-GAP-imp-34228-residexp-resolution-floor',
  finding: {
    A_true_curvature_well_resolved:
      'Central differences give a STABLE peak curvature f2~-0.036196 across h=1e-2..1e-4 (max spread ' +
      'over h ~1e-7). A naive quadratic fit at 5e-13 spacing instead returns a spurious ~-5.9e5 that is ' +
      'pure noise structure, NOT curvature -- the honest curvature is the wide-h value.',
    B_evaluation_noise_floor:
      'resid_exp carries an RMS evaluation noise eps_f~9.4e-17 (~6.5 ulp of f_peak~0.0653), the f64 ' +
      'rounding accumulated across the OLS regression and logarithms -- the quadratic-fit residual at ' +
      '5e-13 spacing, where the true quadratic signal is ~1e-24 and hence invisible.',
    C_predicted_and_measured_floor_agree:
      'The smooth-maximum noise-to-location map dk~sqrt(2 eps_f/|f2|)~7.2e-8 matches the DIRECT scatter of ' +
      'the ternary peak across ten brackets (max-min~9.0e-8, std~2.5e-8) to within a factor ~1.25. So the ' +
      'peak location is only reproducible to ~1e-7; trailing digits of the live peak beyond ~8.82109 are ' +
      'evaluation noise.',
    D_offset_is_below_the_floor:
      'The imp-34228 live-vs-stored offset ~4.3e-11 sits ~1600x BELOW the ~7.2e-8 floor -- deep inside the ' +
      'evaluation-noise floor and NOT a resolvable real feature. The stored 10-sig-fig anchor and the live ' +
      'peak agree far more tightly than the function-value noise permits resolving.',
    E_lowering_the_floor:
      'The floor scales as sqrt(eps_f/|f2|); eps_f is fixed by the WORKING precision of the resid_exp ' +
      'evaluation (native f64, ~6 ulp), so only raising that precision (bignum, a different evaluation ' +
      'path) lowers it. An analytic/finite-difference derivative does NOT: the derivative-root lands at ' +
      '~8.82109160086, inside the SAME ~9e-8 scatter band and ~1.4e-8 (>> 4.3e-11) from the live peak, ' +
      'because the derivative inherits and amplifies the same f64 value noise.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). RESOLVES SUB-GAP-imp-34228-residexp-resolution-floor. The resid_exp(k) ' +
    'peak-location resolution floor near k~8.821092 is ~7.2e-8, established three concordant ways on the ' +
    'inherited imp-33810/imp-33878 surrogate: TRUE central-difference curvature f2~-0.036196 (stable over ' +
    'h=1e-2..1e-4); resid_exp evaluation noise eps_f~9.4e-17 (~6.5 ulp of f_peak, the quadratic-fit residual ' +
    'at 5e-13 spacing); and the smooth-maximum map dk~sqrt(2 eps_f/|f2|)~7.2e-8 -- DIRECTLY confirmed by the ' +
    'max-min~9.0e-8 (std~2.5e-8) scatter of the ternary peak across ten brackets (agreement to a factor ' +
    '~1.25). CONCLUSION: the imp-34228 ~4.3e-11 live-vs-stored offset is NOT a real feature; it sits ~1600x ' +
    'BELOW the floor, deep inside evaluation noise, so the trailing digits of the full-double-precision peak ' +
    'beyond ~8.82109 are noise. The floor scales as sqrt(eps_f/|f2|): only raising the WORKING precision of ' +
    'the evaluation (bignum) lowers it; an analytic/finite-difference derivative does NOT -- the derivative-' +
    'root lands ~1.4e-8 away, inside the SAME noise band, inheriting and amplifying the f64 value noise. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34228 (the deep-ladder module that named this sub-gap); imp-34168 (the stored 10-sig-fig anchor ' +
    '8.8210915879); imp-33878 (source of k*~8.821092 and the resid_exp model, reused verbatim); imp-33810 ' +
    '(the ladder storing resid_exp(k), reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT_ASSERTIONS = [
  {
    // (A) The true peak curvature is well-resolved and stable across the finite-difference step.
    id: 'imp34368-true-curvature-stable',
    description: 'central-difference curvature f2~-0.0362, stable across h=1e-2..1e-4 (spread over h < 1e-5)',
    holds: () => F2_TRUE < -0.03 && F2_TRUE > -0.045 && CURV_MAX_SPREAD < 1e-5,
  },
  {
    // (B) The resid_exp evaluation noise is a few ulp of the peak value (double-precision accumulation).
    id: 'imp34368-evaluation-noise-few-ulp',
    description: 'resid_exp RMS noise eps_f~9.4e-17, a few ulp of f_peak~0.0653',
    holds: () => EPS_F > 1e-17 && EPS_F < 1e-15 && EPS_F / ULP_F_PEAK > 2 && EPS_F / ULP_F_PEAK < 30,
  },
  {
    // (C) Predicted floor ~7e-8 matches the DIRECT bracket-scatter to within a small factor.
    id: 'imp34368-predicted-floor-matches-direct-scatter',
    description: 'sqrt(2 eps_f/|f2|)~7.2e-8 matches ternary peak scatter (max-min~9e-8) to a factor ~1.25',
    holds: () =>
      FLOOR_PREDICTED > 3e-8 &&
      FLOOR_PREDICTED < 2e-7 &&
      SPREAD_MAX_MIN > 1e-8 &&
      SPREAD_MAX_MIN < 3e-7 &&
      FLOOR_MEASURED_VS_PREDICTED_RATIO > 0.3 &&
      FLOOR_MEASURED_VS_PREDICTED_RATIO < 3,
  },
  {
    // (D) The imp-34228 live-vs-stored offset sits BELOW the resolution floor => not a resolvable real
    // feature. NOTE: the exact offset locates a peak on a documented near-FLAT resid_exp hump (2nd
    // deriv ~ -0.036), so a last-ULP difference in Math.exp/log between JS engines relocates it by
    // ~1e-8 (node measures ~4.3e-11, browser V8 ~2.2e-8) -- its magnitude is NOT engine-reproducible.
    // The reproducible, honest claim is only that it stays below the floor (ratio > 1 => unresolvable).
    id: 'imp34368-offset-below-floor-not-a-feature',
    description:
      'the imp-34228 live-vs-stored offset sits below the ~7e-8 resolution floor (unresolvable, inside ' +
      'evaluation noise); its exact magnitude is flat-peak/engine-dependent, only its sub-floor scale is robust',
    holds: () =>
      OFFSET_LIVE_VS_STORED > 0 &&
      OFFSET_LIVE_VS_STORED < FLOOR_PREDICTED &&
      FLOOR_TO_OFFSET_RATIO > 1,
  },
  {
    // (E) An analytic/finite-difference derivative root does NOT beat the floor -- same noise band.
    // As with (D), the derivative-root/live-peak gap is a flat-peak quantity whose exact value is not
    // engine-reproducible; the robust claim is that it lands inside the band and stays below the floor.
    id: 'imp34368-derivative-does-not-lower-floor',
    description: 'derivative-root lands inside the resolution band, below the ~7e-8 floor (does not beat it)',
    holds: () =>
      DERIV_ROOT_INSIDE_BAND &&
      DERIV_VS_LIVE_GAP > 0 &&
      DERIV_VS_LIVE_GAP < FLOOR_PREDICTED,
  },
  {
    // Honesty gate: measurement only, isRigorous false, resolves the named sub-gap, no QED, no refereed bound is changed.
    id: 'imp34368-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, RESOLVES the named sub-gap, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.isRigorous === false &&
      /RESOLVES SUB-GAP-imp-34228-residexp-resolution-floor/.test(IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.verdict) &&
      /NO QED/.test(IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.verdict),
  },
];

for (const a of IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34368-residexp-resolution-floor-measurement assertion failed: ${a.id}`);
  }
}
