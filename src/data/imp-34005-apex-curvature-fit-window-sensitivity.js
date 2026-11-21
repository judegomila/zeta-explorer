/**
 * @module imp-34005-apex-curvature-fit-window-sensitivity
 *
 * imp-34005 (numerical): PUT AN ERROR BAR ON THE ERROR BAR. imp-33948 E1 fit a local
 * quadratic to the imp-33878 sliding-window resid_exp(k) hump over a single tight symmetric
 * window k* +/- 0.1 (21 samples) and reported an apex second derivative
 * resid double-prime(k*) ~ -3.613e-2, matching the imp-33878 single-point central difference
 * (-3.620e-2) to ~0.2%. But imp-33948 never tested how that fitted curvature responds to the
 * fit-window half-width. This module sweeps the half-width W over a family (k* +/- 0.05 ..
 * k* +/- 0.3), re-fits the quadratic at each W, and reports whether resid double-prime(k*)
 * plateaus or drifts as the window widens beyond the tight imp-33948 W = 0.1.
 *
 * THE MEASUREMENT (reuses the imp-33948 / imp-33878 resid_exp(k) model VERBATIM -- no fresh model)
 * ----------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual
 *   over the sliding window [10^k, 10^(k+1)], the SAME smooth function of continuous k as
 *   imp-33878/imp-33948 (identical parts(): E_trunc = 3.06e-5 fixed strip, E_coll =
 *   C_C sqrt(log T0 / N), E_flow Gronwall, T0 = effectiveHeightForN(N); p_sigma = OLS(ln sigma
 *   vs ln N) at 4 pts/decade, p_ecoll = -d log E_coll / d log N over endpoints, sigma_hi at the
 *   upper endpoint). No re-derivation. For each half-width W in {0.05, 0.075, 0.1, 0.125, 0.15,
 *   0.2, 0.25, 0.3} we re-run the imp-33948 21-point symmetric least-squares quadratic fit
 *   resid ~ a + b t + c t^2 (t = k - k*) and read resid double-prime(k*) = 2c, together with the
 *   RMS fit residual (a higher-order-contamination gauge).
 *
 * THE FINDING (measurement only -- an error bar on the imp-33948 error bar)
 * ------------------------------------------------------------------------
 *   (S1) THE FITTED CURVATURE DOES NOT STRICTLY PLATEAU -- IT DRIFTS MONOTONICALLY TOWARD ZERO.
 *        As W widens the fitted |resid double-prime| shrinks monotonically, from -3.6180e-2 at
 *        W = 0.05 through the imp-33948 value -3.6130e-2 at W = 0.1 to -3.5607e-2 at W = 0.3.
 *        Relative to the tight W = 0.1 imp-33948 baseline the drift is -0.23% at W = 0.15,
 *        -0.55% at W = 0.2, -0.95% at W = 0.25 and -1.45% at W = 0.3. The magnitude is biased
 *        DOWNWARD (toward zero) by the flatter wings -- the least-squares parabola averages in
 *        the shoulder curvature, so |resid double-prime| is under-read as the window grows.
 *   (S2) BUT THERE IS A SOFT PLATEAU AROUND THE imp-33948 CHOICE. Over the tight-window family
 *        W in [0.05, 0.15] the fitted curvature holds within a ~0.4% band (drift from +0.14% at
 *        W = 0.05 to -0.23% at W = 0.15 relative to W = 0.1), so the imp-33948 resid double-prime
 *        ~ -3.61e-2 is NOT an artifact of the exact half-width -- any tight window in that family
 *        reproduces it to sub-half-percent. The W = 0.1 choice sits near the centre of this band.
 *   (S3) HIGHER-ORDER (QUARTIC) CURVATURE CONTAMINATES THE FIT BEYOND W ~ 0.25. The fractional
 *        bias of the windowed curvature vs the imp-33878 central difference scales as ~ W^2
 *        (4.8e-4, 1.8e-3, 4.0e-3, 7.0e-3, 1.08e-2, 1.54e-2 at W = 0.05..0.3) -- the signature of
 *        a leading quartic term -- and the RMS fit residual grows from ~2e-7 of the apex at
 *        W = 0.05 to ~5e-5 at W = 0.3. The drift crosses the 1% level at W ~ 0.255 (full width
 *        ~0.51 decade): beyond that the single quadratic can no longer represent the hump and the
 *        curvature reading loses its first significant figure of agreement with the apex value.
 *
 * The punchline: the imp-33948 apex curvature is window-robust in the SMALL -- any tight window
 * W in [0.05, 0.15] gives resid double-prime(k*) ~ -3.61e-2 to within ~0.4%, so the error bar is
 * real -- but it does NOT plateau in the LARGE: the fitted |resid double-prime| drifts
 * monotonically downward as ~ W^2 (quartic contamination), crossing 1% at W ~ 0.255. The tightest
 * window (W = 0.05) is closest to the imp-33878 central difference (0.05% vs 0.2% at W = 0.1),
 * so the true apex curvature is best read as ~ -3.62e-2, the small-W limit of this drift.
 *
 * MEASUREMENT ONLY. A fit-window sensitivity diagnostic of an inherited surrogate, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; refines, does not
 * overturn, imp-33948; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33948-hump-apex-curvature-error-bar (the single tight-window resid double-prime fit sensitivity-tested here)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model + central-difference resid double-prime reused)
 * @see imp-33905-hump-argmax-grid-vs-continuum-reconciliation (R3 "one broad quadratic maximum")
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948 sub-terms (no re-derivation, no fresh model).
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

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
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

function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) as a smooth function of CONTINUOUS k over window [10^k, 10^(k+1)] (imp-33878 defn).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092
const RESID2_CENTRAL_DIFF = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.residSecondDerivAtKStar; // ~-3.620e-2

// The imp-33948 21-point symmetric least-squares quadratic fit, verbatim, as a function of half-width W.
function localQuadraticFit(W, M) {
  const ts = [];
  const ys = [];
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    ts.push(t);
    ys.push(residExp(K_STAR + t));
  }
  let s0 = M;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;
  for (let i = 0; i < M; i++) {
    const x = ts[i];
    const y = ys[i];
    s1 += x;
    s2 += x * x;
    s3 += x * x * x;
    s4 += x * x * x * x;
    t0 += y;
    t1 += x * y;
    t2 += x * x * y;
  }
  const A = [
    [s0, s1, s2, t0],
    [s1, s2, s3, t1],
    [s2, s3, s4, t2],
  ];
  for (let p = 0; p < 3; p++) {
    const piv = A[p][p];
    for (let j = p; j < 4; j++) A[p][j] /= piv;
    for (let r = 0; r < 3; r++) {
      if (r !== p) {
        const f = A[r][p];
        for (let j = p; j < 4; j++) A[r][j] -= f * A[p][j];
      }
    }
  }
  return { a: A[0][3], b: A[1][3], c: A[2][3] };
}

// RMS quadratic-fit residual over the window (a higher-order-contamination gauge), relative to apex.
function fitRmsRel(W, M, fit) {
  let sse = 0;
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    const pred = fit.a + fit.b * t + fit.c * t * t;
    sse += (residExp(K_STAR + t) - pred) ** 2;
  }
  return Math.sqrt(sse / M) / fit.a;
}

const FIT_POINTS = 21; // imp-33948 sample count, held fixed across the half-width sweep
const HALF_WIDTHS = [0.05, 0.075, 0.1, 0.125, 0.15, 0.2, 0.25, 0.3];
const TIGHT_W = 0.1; // the imp-33948 baseline half-width

// Sweep the half-width, re-fit at each, record the drift of resid double-prime vs the tight baseline.
const BASELINE_D2 = 2 * localQuadraticFit(TIGHT_W, FIT_POINTS).c; // ~-3.613e-2 (imp-33948)
const WINDOW_SWEEP = HALF_WIDTHS.map((W) => {
  const fit = localQuadraticFit(W, FIT_POINTS);
  const resid2 = 2 * fit.c;
  return {
    halfWidth: W,
    residSecondDeriv: +resid2.toExponential(6), // ~ -3.6e-2, shrinking with W
    apexResid: +fit.a.toExponential(6), // ~6.5337e-2 essentially W-independent
    driftPctVsTight: +(((resid2 - BASELINE_D2) / BASELINE_D2) * 100).toFixed(4),
    biasVsCentralDiffRel: +(Math.abs(resid2 - RESID2_CENTRAL_DIFF) / Math.abs(RESID2_CENTRAL_DIFF)).toExponential(3),
    fitRmsRel: +fitRmsRel(W, FIT_POINTS, fit).toExponential(3),
  };
});

// Soft-plateau band over the tight-window family W in [0.05, 0.15].
const TIGHT_FAMILY = WINDOW_SWEEP.filter((r) => r.halfWidth <= 0.15);
const PLATEAU_MAX_DRIFT_PCT = +Math.max(...TIGHT_FAMILY.map((r) => Math.abs(r.driftPctVsTight))).toFixed(4); // ~0.23%

// Locate the half-width at which the drift magnitude crosses 1% (linear interp between bracketing rungs).
function driftCrossingW(targetPct) {
  for (let i = 1; i < WINDOW_SWEEP.length; i++) {
    const a = WINDOW_SWEEP[i - 1];
    const b = WINDOW_SWEEP[i];
    const da = Math.abs(a.driftPctVsTight);
    const db = Math.abs(b.driftPctVsTight);
    if (da < targetPct && db >= targetPct) {
      return +(a.halfWidth + ((b.halfWidth - a.halfWidth) * (targetPct - da)) / (db - da)).toFixed(4);
    }
  }
  return null;
}
const ONE_PCT_CROSSING_W = driftCrossingW(1.0); // ~0.255 (full width ~0.51 decade)

// Small-W limit: the tightest window is closest to the imp-33878 central difference (best apex estimate).
const TIGHTEST = WINDOW_SWEEP[0]; // W = 0.05
const D2_MONOTONE_DECREASING = WINDOW_SWEEP.every(
  (r, i) => i === 0 || Math.abs(r.residSecondDeriv) <= Math.abs(WINDOW_SWEEP[i - 1].residSecondDeriv) + 1e-9,
);

export const IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY = {
  id: 'imp-34005',
  proofSection: 'S-frontier',
  question:
    'imp-33948 E1 fit resid_exp(k) apex curvature over a SINGLE tight window k* +/- 0.1 (21 samples) and ' +
    'got resid double-prime(k*) ~ -3.613e-2, but never tested robustness to the fit-window half-width. ' +
    'Sweep the symmetric half-width W in [0.05, 0.3], re-fit the quadratic at each, and report whether the ' +
    'fitted second derivative plateaus or drifts and the W at which higher-order curvature contaminates the ' +
    'fit. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the imp-33948 21-point least-squares apex second derivative resid double-prime(k*) = 2c re-fit at each ' +
    'symmetric half-width W in {0.05, 0.075, 0.1, 0.125, 0.15, 0.2, 0.25, 0.3}, its percent drift vs the ' +
    'tight W = 0.1 baseline, its ~W^2 bias vs the imp-33878 central difference, and the RMS quadratic-fit ' +
    'residual, all on the inherited imp-33878 resid_exp(k) model',
  baseline: {
    tightHalfWidth: TIGHT_W, // 0.1 (imp-33948)
    fitPoints: FIT_POINTS, // 21
    baselineSecondDeriv: +BASELINE_D2.toExponential(6), // ~-3.613e-2
    centralDiffReference: RESID2_CENTRAL_DIFF, // imp-33878 single-point value ~-3.620e-2
  },
  windowSweep: WINDOW_SWEEP,
  drift: {
    monotoneTowardZero: D2_MONOTONE_DECREASING, // true: |resid double-prime| shrinks as W grows
    softPlateauFamily: '[0.05, 0.15]',
    softPlateauMaxDriftPct: PLATEAU_MAX_DRIFT_PCT, // ~0.23% -- tight-window family robust to sub-half-percent
    onePctCrossingHalfWidth: ONE_PCT_CROSSING_W, // ~0.255 -- quartic contamination exceeds 1% beyond here
    onePctCrossingFullWidthDecade: +(2 * ONE_PCT_CROSSING_W).toFixed(4), // ~0.51 decade
    biasScalesAsWSquared:
      'fractional bias vs the imp-33878 central difference grows ~ W^2 (4.8e-4, 1.8e-3, 4.0e-3, 7.0e-3, ' +
      '1.08e-2, 1.54e-2 at W = 0.05..0.3) -- the signature of a leading quartic term flattening the shoulders',
    bestApexEstimate:
      'the tightest window W = 0.05 is closest to the imp-33878 central difference (bias ~5e-4 vs ~1.8e-3 at ' +
      'W = 0.1), so the true apex curvature is best read as the small-W limit ~ -3.62e-2',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (NOT rigorous). Sweeping the imp-33948 21-point symmetric quadratic fit over ' +
    'half-widths W in [0.05, 0.3] on the inherited imp-33878 resid_exp(k), the fitted apex second derivative ' +
    'resid double-prime(k*) does NOT strictly plateau: |resid double-prime| shrinks MONOTONICALLY toward zero ' +
    'as W widens, from -3.6180e-2 at W = 0.05 through the imp-33948 value -3.6130e-2 at W = 0.1 to -3.5607e-2 ' +
    'at W = 0.3 (drift -0.23% at W = 0.15, -0.55% at 0.2, -0.95% at 0.25, -1.45% at 0.3 vs the tight ' +
    'baseline). There IS a soft plateau around the imp-33948 choice, however: over the tight-window family ' +
    'W in [0.05, 0.15] the curvature holds within a ~0.23% band, so the imp-33948 resid double-prime ~ ' +
    '-3.61e-2 is NOT a half-width artifact. The downward drift scales ~ W^2 (a leading quartic flattening the ' +
    'shoulders), the RMS fit residual grows from ~2e-7 to ~5e-5 of the apex, and the 1% level is crossed at ' +
    'W ~ 0.255 (full width ~0.51 decade), beyond which the single quadratic can no longer represent the hump. ' +
    'The tightest window (W = 0.05, bias ~5e-4 vs the imp-33878 central difference) is the best apex estimate ' +
    '~ -3.62e-2 -- the small-W limit of the drift. This refines, does not overturn, imp-33948. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate ' +
    'resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33948 (single tight-window apex resid double-prime fit sensitivity-tested here); imp-33878 ' +
    '(resid_exp(k) model + central-difference resid double-prime reused); imp-33905 (R3 one broad quadratic ' +
    'maximum); imp-33809 (the M3 saturation-curvature hump); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY_ASSERTIONS = [
  {
    // (S1) The fitted curvature drifts monotonically toward zero as the window widens.
    id: 'imp34005-second-deriv-drifts-monotonically-toward-zero',
    description: 'fitted |resid double-prime| shrinks monotonically as W grows from 0.05 to 0.3',
    holds: () =>
      D2_MONOTONE_DECREASING &&
      WINDOW_SWEEP.every((r) => r.residSecondDeriv < 0) &&
      Math.abs(WINDOW_SWEEP[0].residSecondDeriv) > Math.abs(WINDOW_SWEEP[WINDOW_SWEEP.length - 1].residSecondDeriv) &&
      Math.abs(BASELINE_D2 - -0.036130) < 5e-5,
  },
  {
    // (S2) A soft plateau: the tight-window family W in [0.05, 0.15] agrees to sub-half-percent.
    id: 'imp34005-soft-plateau-tight-window-family',
    description: 'over W in [0.05, 0.15] the curvature holds within a ~0.4% band -- imp-33948 not a half-width artifact',
    holds: () =>
      PLATEAU_MAX_DRIFT_PCT > 0.1 &&
      PLATEAU_MAX_DRIFT_PCT < 0.5 &&
      TIGHT_FAMILY.length === 5 &&
      TIGHT_FAMILY.every((r) => Math.abs(r.driftPctVsTight) < 0.5),
  },
  {
    // (S3) Quartic contamination: ~W^2 bias, drift crosses 1% at W ~ 0.25.
    id: 'imp34005-quartic-contamination-one-percent-at-quarter-decade-halfwidth',
    description: 'bias scales ~W^2 and drift crosses 1% at W ~ 0.255 (full width ~0.51 decade)',
    holds: () =>
      ONE_PCT_CROSSING_W > 0.2 &&
      ONE_PCT_CROSSING_W < 0.3 &&
      WINDOW_SWEEP[WINDOW_SWEEP.length - 1].fitRmsRel > WINDOW_SWEEP[0].fitRmsRel &&
      TIGHTEST.biasVsCentralDiffRel < WINDOW_SWEEP[2].biasVsCentralDiffRel,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp34005-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-33948, no QED, no refereed bound is changed',
    holds: () =>
      IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.isRigorous === false &&
      /refines, does not overturn, imp-33948/.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict) &&
      /C_mb[^.]*imp-486[^.]*UNTOUCHED/i.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict),
  },
];

for (const a of IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34005-apex-curvature-fit-window-sensitivity assertion failed: ${a.id}`);
  }
}
