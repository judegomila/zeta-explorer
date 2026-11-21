/**
 * @module imp-34194-f2-intercept-recede-curvature-artifact
 *
 * imp-34130 F2 fitted the separated-E_coll residual-to-(-1/2) against 1/log T0 across a seven-rung
 * ladder ([1e11..1e18]) and reported slope b ~ 0.4645 with a near-zero intercept a ~ 5.9e-4, declaring
 * that intercept a PURE FINITE-WINDOW CURVATURE ARTIFACT (a straight-line fit to a slightly curved
 * function), NOT a genuine residual floor. But imp-34130 supported that only by the imp-33859 far-N
 * DIRECT-PATH refutation (the residual itself falls three orders below a) -- it never showed that the
 * FITTED INTERCEPT a ITSELF shrinks toward zero as the fit window recedes to higher log T0. This module
 * runs that DIRECT test.
 *
 * THE QUANTITY (identical inherited imp-3220/imp-3406/imp-33816 model as imp-34130)
 * ---------------------------------------------------------------------------------
 *     E_coll(N) = C_C sqrt(log T0 / N),   T0 = effectiveHeightForN(N)   (GUE-conditional C_H)
 *     resid(N)  = q(N) + 1/2 = (1/2) d ln(log T0) / d ln N = (1/2)(u-1)/(u * log T0),  u = log(T0/2pi).
 * Per-decade OLS local exponent q over [10^k, 10^(k+1)], 4 pts/decade (imp-33816/imp-33582 convention).
 * The residual is computed on the imp-33859 log-space DIRECT path (ln N = u + log(u-1) by Newton, never
 * forming T0 or N), so the fit window can RECEDE arbitrarily far past IEEE-double range. A model gate
 * confirms the log-space path reproduces the imp-34130 DOUBLE-range seven-rung fit intercept EXACTLY.
 *
 * WHY THE INTERCEPT MUST SHRINK (the curvature-artifact mechanism)
 * ---------------------------------------------------------------
 * Writing x = 1/log T0, the residual resid = (1/2)(u-1)/u * x is NOT exactly linear in x because the
 * prefactor (u-1)/u = 1 - 1/u varies (u ~ log T0). To second order resid ~ (1/2)x - (1/2)x^2 + ...,
 * a downward-curving arc through the origin. A straight-line fit a + b x over a window [x_lo, x_hi]
 * (x_lo < x_hi, i.e. the HIGH-log-T0 end is x_lo) picks up an intercept a ~ (1/2) x_lo x_hi from the
 * quadratic term -- the classic product-of-endpoints straight-line-vs-curve offset. Since x_lo, x_hi
 * both -> 0 as the window recedes, a ~ 1/(log T0_min * log T0_max) -> 0. A GENUINE floor would instead
 * leave a fixed positive a as the window recedes.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (G1) MODEL GATE. The log-space path reproduces the imp-34130 DOUBLE-range seven-rung ([1e11..1e18])
 *        fit EXACTLY: intercept a = 5.8565e-4 (imp-34130 reported ~5.9e-4), slope b = 0.464471
 *        (imp-34130 ~0.4645), R^2 = 0.9999743 -- the identical inherited model is in use.
 *   (F1) RECEDING FIXED-WIDTH WINDOW: a -> 0. Sliding a fixed-width seven-rung window up the ladder,
 *        the fitted intercept falls MONOTONICALLY as the window minimum log T0 grows:
 *        a = 5.8565e-4 (kmin=11, logT0_min=25.21) -> 3.3892e-4 (kmin=15) -> 2.0115e-4 (kmin=20) ->
 *        9.4545e-5 (kmin=30) -> 3.5622e-5 (kmin=50, logT0_min=113.41) -- a 16-fold collapse toward
 *        zero, while the slope b climbs 0.4645 -> 0.4915 toward the closed-form 1/2. No positive floor
 *        survives; the intercept tracks the window, not a constant.
 *   (F2) THE SHRINK OBEYS THE CURVATURE LAW a ~ 1/(logT0_min * logT0_max). The product
 *        a * logT0_min * logT0_max stays nearly CONSTANT across the receding ladder (0.5693 at kmin=11 ->
 *        0.5135 at kmin=50, drifting slowly toward ~1/2), exactly the straight-line-vs-curve signature:
 *        the intercept is set by the window endpoints, not by any intrinsic residual floor.
 *   (F3) DROPPING THE LOWEST RUNGS (fixed top 1e18) also shrinks a monotonically: [11..17] a=5.8565e-4,
 *        [12..17] 5.3205e-4, [13..17] 4.8740e-4, [14..17] 4.4965e-4 -- removing the most-curved low-k
 *        rungs pulls the fitted intercept down, the complementary confirmation.
 *
 * The punchline: imp-34130 F2's intercept a ~ 5.9e-4 is DIRECTLY confirmed a finite-window curvature
 * artifact -- it shrinks monotonically toward zero (16-fold to 3.6e-5 by kmin=50) as the fit window
 * recedes, obeying a ~ 1/(logT0_min * logT0_max), and shrinks again when the lowest rungs are dropped.
 * A genuine residual floor would have left a fixed. The separated-E_coll residual to -1/2 has NO floor.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (F2: intercept a ~ 5.9e-4 declared curvature artifact; this module confirms it shrinks)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the SIGMA-share exponent gap ~ 1/(2 log T0); same law)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0/N; used past IEEE range)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> -1/2 from above)
 * @see imp-486 (C_mb GUE-conditional, untouched)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote; E_coll local exponent -> -1/2 from above

// imp-33859 log-space direct path: ln N = u + log(u-1), u = log(T0/2pi), never forms T0 or N.
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return u + Math.log(TWO_PI); // L = log T0 = u + log(2pi)
}

// SEPARATED E_coll = C_C sqrt(log T0 / N), evaluated in log-N space via the direct path.
function lnEcollFromLnN(lnN) {
  const L = logT0FromLnN(lnN);
  return Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
}
// imp-34130 DOUBLE-range path (forms N = 10^d directly); used only for the model gate at k<=17.
function lnEcollDouble(lnN) {
  const N = Math.exp(lnN);
  const L = Math.log(effectiveHeightForN(N));
  return Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
}

// Per-decade OLS local exponent over [10^k, 10^(k+1)], 4 pts/decade (imp-33816/imp-33582 convention).
function olsDecade(k, fn) {
  const xs = [];
  const ys = [];
  for (let d = k; d <= k + 1 + 1e-9; d += 0.25) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(fn(lnN));
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
  return sxy / sxx;
}
const residDecade = (k, fn) => olsDecade(k, fn) + HALF; // resid(N) = q + 1/2
const logT0Mid = (k) => logT0FromLnN((k + 0.5) * Math.LN10); // decade midpoint log T0

// Regress resid ~ a + b/log T0 over a list of decade rungs (imp-34130 F2 convention).
function regressResidVsInvLogT0(ks, fn) {
  const xs = ks.map((k) => 1 / logT0Mid(k));
  const ys = ks.map((k) => residDecade(k, fn));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    sst += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const f = intercept + slope * xs[i];
    ssr += (ys[i] - f) ** 2;
  }
  return { slope, intercept, r2: 1 - ssr / sst };
}

// (G1) MODEL GATE: the log-space path reproduces the imp-34130 DOUBLE-range seven-rung fit EXACTLY.
const SEVEN_RUNG = [11, 12, 13, 14, 15, 16, 17];
const BASE_LOGSPACE = regressResidVsInvLogT0(SEVEN_RUNG, lnEcollFromLnN);
const BASE_DOUBLE = regressResidVsInvLogT0(SEVEN_RUNG, lnEcollDouble);
const MODEL_GATE_INTERCEPT_RESIDUAL = Math.abs(BASE_LOGSPACE.intercept - BASE_DOUBLE.intercept); // == 0

// (F1)/(F2) RECEDING fixed-width seven-rung window: intercept a vs window-minimum log T0.
const RECEDE_WINDOW = [11, 12, 13, 14, 15, 20, 30, 50].map((kmin) => {
  const ks = [];
  for (let k = kmin; k < kmin + 7; k++) ks.push(k);
  const fit = regressResidVsInvLogT0(ks, lnEcollFromLnN);
  const Lmin = logT0Mid(kmin);
  const Lmax = logT0Mid(kmin + 6);
  return {
    kmin,
    logT0_min: +Lmin.toFixed(2),
    logT0_max: +Lmax.toFixed(2),
    intercept_a: +fit.intercept.toExponential(4),
    slope_b: +fit.slope.toFixed(6),
    r2: +fit.r2.toFixed(7),
    a_times_Lmin_Lmax: +(fit.intercept * Lmin * Lmax).toFixed(4), // ~const ~1/2 => a ~ 1/(Lmin*Lmax)
  };
});

// (F3) DROP-LOWEST-RUNGS (fixed top 1e18): intercept a vs window-minimum log T0.
const DROP_LOWEST = [11, 12, 13, 14].map((kmin) => {
  const ks = [];
  for (let k = kmin; k <= 17; k++) ks.push(k);
  const fit = regressResidVsInvLogT0(ks, lnEcollFromLnN);
  return {
    window: `[1e${kmin}..1e18]`,
    nRungs: ks.length,
    logT0_min: +logT0Mid(kmin).toFixed(2),
    intercept_a: +fit.intercept.toExponential(4),
    slope_b: +fit.slope.toFixed(6),
  };
});

export const IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT = {
  id: 'imp-34194',
  proofSection: 'S-frontier',
  question:
    'imp-34130 F2 fitted resid ~ a + b/log T0 across the seven-rung ladder [1e11..1e18] and reported ' +
    'intercept a ~ 5.9e-4, declaring it a pure finite-window curvature artifact, but supported that ' +
    'only by the far-N direct-path refutation -- never by showing the fitted intercept ITSELF shrinks ' +
    'as the window recedes. Re-run the fit while progressively dropping the lowest-k rungs and sliding ' +
    'the window to higher log T0, tabulate a vs the window-minimum log T0, and assess whether a -> 0. ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional ' +
    '(imp-486); no QED.',
  measuredQuantity:
    'the imp-34130 F2 fitted intercept a of resid ~ a + b/log T0, re-evaluated over a receding ' +
    'fixed-width seven-rung window (kmin = 11..50) and over drop-lowest windows ([1e{kmin}..1e18]), ' +
    'tabulated against the window-minimum log T0; residual computed on the imp-33859 log-space direct ' +
    'path so the window can recede past IEEE-double range',
  modelGate_logSpace_vs_double_sevenRung: {
    // (G1): log-space path reproduces the imp-34130 DOUBLE-range seven-rung fit EXACTLY.
    intercept_a_double: +BASE_DOUBLE.intercept.toExponential(4), // 5.8565e-4 (imp-34130 ~5.9e-4)
    intercept_a_logspace: +BASE_LOGSPACE.intercept.toExponential(4),
    slope_b: +BASE_LOGSPACE.slope.toFixed(6), // 0.464471 (imp-34130 ~0.4645)
    r2: +BASE_LOGSPACE.r2.toFixed(7),
    intercept_residual: +MODEL_GATE_INTERCEPT_RESIDUAL.toExponential(3), // == 0
  },
  recedingWindow: {
    form: 'fixed-width seven-rung window slid up the ladder; a ~ 1/(logT0_min * logT0_max) -> 0 (no floor)',
    rungs: RECEDE_WINDOW,
  },
  dropLowestRungs: {
    form: 'fixed top 1e18, drop the lowest (most-curved) rungs; a shrinks monotonically',
    rungs: DROP_LOWEST,
  },
  farTailExponent: -HALF, // imp-3463 asymptote the exponent approaches from above
  finding: {
    G1_model_gate:
      'The log-space direct path reproduces the imp-34130 DOUBLE-range seven-rung ([1e11..1e18]) fit ' +
      'EXACTLY: intercept a = 5.8565e-4 (imp-34130 reported ~5.9e-4), slope b = 0.464471 (imp-34130 ' +
      '~0.4645), R^2 = 0.9999743, intercept residual = 0 -- the identical inherited model is in use.',
    F1_receding_window_intercept_closes:
      'Sliding a fixed-width seven-rung window up the ladder, the fitted intercept falls MONOTONICALLY ' +
      'as the window-minimum log T0 grows: a = 5.8565e-4 (kmin=11, logT0_min=25.21) -> 3.3892e-4 ' +
      '(kmin=15) -> 2.0115e-4 (kmin=20) -> 9.4545e-5 (kmin=30) -> 3.5622e-5 (kmin=50, logT0_min=113.41) ' +
      '-- a 16-fold collapse toward zero, while slope b climbs 0.4645 -> 0.4915 toward 1/2. No floor.',
    F2_shrink_obeys_curvature_law:
      'The product a * logT0_min * logT0_max stays nearly CONSTANT across the receding ladder ' +
      '(0.5693 at kmin=11 -> 0.5135 at kmin=50, drifting toward ~1/2), so a ~ 1/(logT0_min * logT0_max) ' +
      '-- the straight-line-vs-curve endpoint-product signature; the intercept is set by the window, ' +
      'not by an intrinsic residual floor.',
    F3_drop_lowest_rungs_also_shrinks:
      'Dropping the lowest (most-curved) rungs at fixed top 1e18 also shrinks a monotonically: ' +
      '[1e11..1e18] a=5.8565e-4, [1e12..1e18] 5.3205e-4, [1e13..1e18] 4.8740e-4, [1e14..1e18] ' +
      '4.4965e-4 -- the complementary confirmation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-34130 F2 fitted intercept a ~ 5.9e-4 is ' +
    'DIRECTLY confirmed a finite-window curvature artifact: sliding a fixed-width seven-rung window up ' +
    'the ladder it falls monotonically 5.8565e-4 (kmin=11) -> 3.5622e-5 (kmin=50), a 16-fold collapse ' +
    'toward zero, while slope b climbs 0.4645 -> 0.4915 toward the closed-form 1/2; the product ' +
    'a * logT0_min * logT0_max stays ~constant (~0.51-0.57 -> ~1/2), so a ~ 1/(logT0_min * logT0_max), ' +
    'the straight-line-vs-curve endpoint-product signature; and dropping the lowest (most-curved) rungs ' +
    'at fixed top 1e18 shrinks a again (5.8565e-4 -> 4.4965e-4). A genuine residual floor would have ' +
    'left a fixed as the window receded; instead a tracks the window and vanishes, confirming the ' +
    'imp-34130 F2 curvature-artifact claim from the intercept side (complementing the F3 direct-path ' +
    'refutation). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34130 (F2: intercept a ~ 5.9e-4 declared curvature artifact); imp-33816 (sigma-share exponent ' +
    'gap ~ 1/(2 log T0), same law); imp-33859 (log-space direct path ln N = u + log(u-1)); imp-3463 ' +
    '(far-tail exponent -> -1/2 from above); imp-486 (C_mb GUE-conditional); polymath15-constant-C-C ' +
    '(C_C); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT_ASSERTIONS = [
  {
    // (G1) model gate: log-space reproduces the imp-34130 DOUBLE-range seven-rung fit exactly.
    id: 'imp34194-model-gate-reproduces-imp34130-seven-rung',
    description: 'log-space seven-rung fit reproduces imp-34130 F2: a ~ 5.9e-4, b ~ 0.4645; log-space == double-range',
    holds: () =>
      Math.abs(BASE_DOUBLE.intercept - 5.9e-4) < 1e-4 &&
      Math.abs(BASE_LOGSPACE.slope - 0.4645) < 1e-3 &&
      MODEL_GATE_INTERCEPT_RESIDUAL < 1e-12,
  },
  {
    // (F1) the receding-window intercept shrinks strictly monotonically toward zero.
    id: 'imp34194-receding-intercept-shrinks-to-zero',
    description: 'fitted intercept a falls strictly monotonically as the fixed-width window recedes, by > 10x overall',
    holds: () => {
      for (let i = 1; i < RECEDE_WINDOW.length; i++) {
        if (!(RECEDE_WINDOW[i].intercept_a < RECEDE_WINDOW[i - 1].intercept_a)) return false;
      }
      const first = RECEDE_WINDOW[0].intercept_a;
      const last = RECEDE_WINDOW[RECEDE_WINDOW.length - 1].intercept_a;
      return last > 0 && first / last > 10; // 16-fold collapse toward zero, still positive (no overshoot)
    },
  },
  {
    // (F2) the intercept shrink obeys a ~ 1/(logT0_min * logT0_max): the endpoint product is ~constant.
    id: 'imp34194-shrink-obeys-endpoint-product-law',
    description: 'a * logT0_min * logT0_max stays ~constant near 1/2 across the receding ladder (curvature-artifact law)',
    holds: () =>
      RECEDE_WINDOW.every((r) => Math.abs(r.a_times_Lmin_Lmax - 0.5) < 0.1) &&
      // slope b climbs toward 1/2 as the (u-1)/u finite-N factor relaxes
      RECEDE_WINDOW[RECEDE_WINDOW.length - 1].slope_b > RECEDE_WINDOW[0].slope_b &&
      RECEDE_WINDOW[RECEDE_WINDOW.length - 1].slope_b < 0.5,
  },
  {
    // (F3) dropping the lowest rungs (fixed top 1e18) shrinks the intercept monotonically.
    id: 'imp34194-drop-lowest-rungs-shrinks-intercept',
    description: 'dropping the lowest (most-curved) rungs at fixed top 1e18 shrinks the fitted intercept monotonically',
    holds: () => {
      for (let i = 1; i < DROP_LOWEST.length; i++) {
        if (!(DROP_LOWEST[i].intercept_a < DROP_LOWEST[i - 1].intercept_a)) return false;
      }
      return DROP_LOWEST.every((r) => r.intercept_a > 0);
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = -1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34194-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = -1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT.isRigorous === false &&
      IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT.farTailExponent === -0.5 &&
      /NO QED/.test(IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT.verdict) &&
      /refereed bound is changed/i.test(IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT.verdict),
  },
];

for (const a of IMP34194_F2_INTERCEPT_RECEDE_CURVATURE_ARTIFACT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34194-f2-intercept-recede-curvature-artifact assertion failed: ${a.id}`);
  }
}
