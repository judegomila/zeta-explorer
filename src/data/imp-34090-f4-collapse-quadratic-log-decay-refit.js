/**
 * @module imp-34090-f4-collapse-quadratic-log-decay-refit
 *
 * imp-34090 (numerical, frontier-direction): imp-34023 fit the imp-33969 F4 (imp-33773 M2 residual
 * ratio) collapse to a SINGLE exponential ln F4 = a + b*kEnd (b ~ -1.0248, R^2 ~ 0.99942) and noted --
 * in prose only -- that this anchor fit UNDER-predicts the direct over-prediction ratio 1/(F2*F3*F4) at
 * large kEnd because the LOCAL F4 decay rate ACCELERATES (the per-unit factor exp(b) drifts 0.376 near
 * the anchor to 0.327 at large kEnd). imp-34023 never fit that acceleration. This module refits ln F4
 * with an accelerating quadratic-in-kEnd law ln F4 = a + b*kEnd + c*kEnd^2 on the SAME 9 anchor windows,
 * reports the curvature c and R^2, and re-extrapolates the over-prediction ratio using the quadratic
 * surrogate to test whether the accelerated law CLOSES the gap to the direct ladder up to the ~21.3
 * ceiling. All sub-terms are the identical inherited imp-3406/imp-33810 quantities, verbatim.
 *
 * PART A -- THE QUADRATIC REFIT (curvature quantifies the imp-34023 acceleration)
 * -----------------------------------------------------------------------------
 *   A 3-parameter OLS of ln F4 against kEnd over the 9 anchor windows (kEnd = 11.00..13.00 step 0.25)
 *   fits ln F4 = a + b*kEnd + c*kEnd^2 with a NEGATIVE curvature c ~ -0.04299 and R^2 ~ 0.99998 --
 *   a decisive in-window improvement over the single exponential (R^2 ~ 0.99942, ~35x smaller residual
 *   variance). The negative c CONFIRMS and QUANTIFIES the imp-34023 observation: the local log-decay
 *   slope b_local(kEnd) = b + 2c*kEnd steepens with kEnd, so F4 collapses FASTER as the boundary recedes.
 *
 * PART B -- RE-EXTRAPOLATION: the accelerated law closes the gap only NEAR the anchor, then OVER-CORRECTS
 * -------------------------------------------------------------------------------------------------
 *   Using the quadratic surrogate F4_quad(kEnd) = exp(a + b*kEnd + c*kEnd^2) to predict the ratio
 *   1/(F2*F3*F4) (direct F2, F3; only F4 modelled) against the direct ladder:
 *     - NEAR the anchor (kEnd = 13..14) the quadratic CLOSES the under-prediction gap -- RMS log-ratio
 *       error 0.0642 (single-exp) -> 0.0374 (quadratic), a ~1.72x reduction; at kEnd=13..13.5 the
 *       reduction is ~2.52x. So over the first ~1.5 units past the anchor the accelerated law is
 *       genuinely better and the direction of the imp-34023 note is confirmed (single-exp under-predicts).
 *     - But the negative curvature EXTRAPOLATES UNSTABLY: the c*kEnd^2 term runs away, so past kEnd ~ 15
 *       the quadratic OVER-predicts the ratio and the sign of the error flips. Over the FULL sign-stable
 *       extension kEnd = 13..21 the quadratic RMS log-error (0.995) is WORSE than the single-exp (0.754)
 *       -- a ~0.76x "reduction" (i.e. it does NOT close the gap globally; it trades a moderate
 *       under-prediction for a larger over-prediction). At kEnd=20 the direct ratio is ~589238 while the
 *       single-exp under-predicts to ~220450 and the quadratic over-shoots to ~3.39e6.
 *
 * THE HONEST VERDICT
 * ------------------
 *   The accelerated (quadratic) log-decay dramatically improves the IN-WINDOW fit (R^2 0.99942 ->
 *   0.99998, curvature c ~ -0.043 < 0 quantifying the acceleration imp-34023 only noted qualitatively),
 *   and it closes the extrapolation gap in a narrow band ~1.5 units past the anchor (kEnd <~ 15). But it
 *   does NOT close the gap to the ~21.3 ceiling: extrapolated far, its curvature runs away and it
 *   over-predicts, ending with a LARGER RMS log-error than the single exponential across the full
 *   extension. Neither low-order surrogate is a reliable extrapolator to the ceiling; the imp-34023
 *   DIRECT ladder remains the honest source for the far-tail divergence, and the divergence itself
 *   (ratio grows without bound up to the M2 residual sign change at kEnd* ~ 21.281) is unchanged.
 *
 * NUMERICAL / MEASUREMENT ONLY. Curve fit + surrogate extrapolation of an inherited ratio, NOT an RH
 * bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the quadratic
 * refit and its extrapolation are descriptive within that model only; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the single-exponential fit refit here)
 * @see imp-34041-eflow-widening-ratio-growth-law-tournament (exponential wins the ratio-form tournament)
 * @see imp-33969-eflow-decay-widening-ratio-kend-sweep (the 9-window kEnd=11..13 F4 collapse anchored)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate at kEnd~21.3)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the closed-form kEnd* ~ 21.281 ceiling)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33969/imp-34023 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34023 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
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
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810 endpoint rung at boundary k (head k=6, tail k=kEnd) -- the roe = resid/eflow ratio.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, resid, sflow, eflow, roe: resid / eflow, pSigma, pEcoll };
}

const HEAD = rung(6); // fixed head, exactly as imp-34023

// Per-boundary attenuation factors (head fixed at k=6), same identity as imp-33969/imp-34023.
function factors(kEnd) {
  const TAIL = rung(kEnd);
  const F2 = TAIL.E_N / HEAD.E_N; // normaliser collapse
  const F3 = HEAD.sflow / TAIL.sflow; // E_flow log-slope ratio
  const F4 = TAIL.resid / HEAD.resid; // imp-33773 residual ratio (the driver)
  const attenuation = F2 * F3 * F4;
  return { kEnd, F2, F3, F4, attenuation, ratio: 1 / attenuation, resid: TAIL.resid };
}

// Single-exponential log-linear OLS: ln y = a + b*x. Returns {a, b, R2}. (Matches imp-34023 F4_FIT.)
function logLinearFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  const R2 = (sxy * sxy) / (sxx * syy);
  return { a, b, R2 };
}

// 3x3 Gaussian elimination with partial pivoting (for the quadratic normal equations).
function solve3(A, y) {
  const M = [
    [A[0][0], A[0][1], A[0][2], y[0]],
    [A[1][0], A[1][1], A[1][2], y[1]],
    [A[2][0], A[2][1], A[2][2], y[2]],
  ];
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}

// Quadratic OLS: ln y = a + b*x + c*x^2. Returns {a, b, c, R2}.
function quadFit(xs, ys) {
  const n = xs.length;
  let S0 = n;
  let S1 = 0;
  let S2 = 0;
  let S3 = 0;
  let S4 = 0;
  let T0 = 0;
  let T1 = 0;
  let T2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const yv = ys[i];
    const x2 = x * x;
    S1 += x;
    S2 += x2;
    S3 += x2 * x;
    S4 += x2 * x2;
    T0 += yv;
    T1 += x * yv;
    T2 += x2 * yv;
  }
  const [a, b, c] = solve3(
    [
      [S0, S1, S2],
      [S1, S2, S3],
      [S2, S3, S4],
    ],
    [T0, T1, T2]
  );
  const my = T0 / n;
  let ssres = 0;
  let sstot = 0;
  for (let i = 0; i < n; i++) {
    const p = a + b * xs[i] + c * xs[i] * xs[i];
    ssres += (ys[i] - p) ** 2;
    sstot += (ys[i] - my) ** 2;
  }
  return { a, b, c, R2: 1 - ssres / sstot };
}

// -- Part A: refit ln F4 on the SAME 9 anchor windows (kEnd=11..13) -- single-exp vs quadratic.
const ANCHOR_KENDS = [];
for (let k = 11; k <= 13 + 1e-9; k += 0.25) ANCHOR_KENDS.push(+k.toFixed(2));
const ANCHOR = ANCHOR_KENDS.map(factors);
const LN_F4 = ANCHOR.map((r) => Math.log(r.F4));
const LIN_FIT = logLinearFit(ANCHOR_KENDS, LN_F4); // imp-34023 single exponential
const QUAD_FIT = quadFit(ANCHOR_KENDS, LN_F4); // accelerating quadratic

const F4_lin = (kEnd) => Math.exp(LIN_FIT.a + LIN_FIT.b * kEnd);
const F4_quad = (kEnd) => Math.exp(QUAD_FIT.a + QUAD_FIT.b * kEnd + QUAD_FIT.c * kEnd * kEnd);

// -- Part B: re-extrapolate the over-prediction ratio with each surrogate F4 (direct F2, F3) and
// compare to the DIRECT ladder, over the sign-stable extension kEnd=13..21 step 0.5.
const EXTENDED_KENDS = [];
for (let k = 13; k <= 21 + 1e-9; k += 0.5) EXTENDED_KENDS.push(+k.toFixed(2));
const EXTENDED = EXTENDED_KENDS.map((kEnd) => {
  const f = factors(kEnd);
  const directR = f.ratio;
  const linR = 1 / (f.F2 * f.F3 * F4_lin(kEnd));
  const quadR = 1 / (f.F2 * f.F3 * F4_quad(kEnd));
  return {
    kEnd,
    resid: +f.resid.toExponential(4),
    directR: +directR.toFixed(2),
    linR: +linR.toFixed(2),
    quadR: +quadR.toFixed(2),
    logErrLin: +Math.log(linR / directR).toFixed(4), // < 0 => under-predicts
    logErrQuad: +Math.log(quadR / directR).toFixed(4), // > 0 => over-predicts
  };
});

// RMS log-ratio error of each surrogate vs the direct ladder over a kEnd band (sign-stable only).
function bandRMS(loK, hiK) {
  let rl = 0;
  let rq = 0;
  let n = 0;
  for (const kEnd of EXTENDED_KENDS) {
    if (kEnd < loK - 1e-9 || kEnd > hiK + 1e-9) continue;
    const f = factors(kEnd);
    if (f.resid <= 0) continue;
    const eLin = Math.log(1 / (f.F2 * f.F3 * F4_lin(kEnd)) / f.ratio);
    const eQuad = Math.log(1 / (f.F2 * f.F3 * F4_quad(kEnd)) / f.ratio);
    rl += eLin * eLin;
    rq += eQuad * eQuad;
    n++;
  }
  return { rmsLin: Math.sqrt(rl / n), rmsQuad: Math.sqrt(rq / n), n };
}
const NEAR_BAND = bandRMS(13, 14); // ~1.5 units past the anchor: quadratic wins here
const FULL_BAND = bandRMS(13, 21); // full sign-stable extension: quadratic over-corrects, loses

export const IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT = {
  id: 'imp-34090',
  proofSection: 'S-frontier',
  question:
    'imp-34023 fit the imp-33969 F4 collapse to a single exponential ln F4 = a + b*kEnd (R^2 ~ 0.99942) ' +
    'and noted only in prose that it UNDER-predicts the direct over-prediction ratio at large kEnd ' +
    'because the local decay rate ACCELERATES (exp(b) drifts 0.376 -> 0.327). Refit ln F4 with an ' +
    'accelerating quadratic ln F4 = a + b*kEnd + c*kEnd^2 on the same 9 anchor windows, report the ' +
    'curvature c and R^2, and re-extrapolate the ratio 1/(F2*F3*F4) to test whether the accelerated law ' +
    'CLOSES the gap to the direct ladder up to the ~21.3 ceiling. Numerical/measurement only; component ' +
    'model NOT rigorous; NO QED.',
  measuredQuantity:
    'Part A: single-exponential vs quadratic OLS of ln F4 vs kEnd over kEnd=11.00..13.00 step 0.25 (9 ' +
    'windows, head fixed at k=6), reporting the quadratic curvature c and both R^2. Part B: the ratio ' +
    '1/(F2*F3*F4) re-extrapolated over kEnd=13..21 step 0.5 with each surrogate F4 (direct F2, F3), ' +
    'compared to the direct ladder via the log-ratio error and its RMS over a near band (kEnd=13..14) ' +
    'and the full sign-stable band (kEnd=13..21).',
  refit: {
    singleExponential: {
      form: 'ln F4 = a + b*kEnd',
      a: +LIN_FIT.a.toFixed(5), // ~11.16793
      b: +LIN_FIT.b.toFixed(5), // ~-1.02485
      R2: +LIN_FIT.R2.toFixed(8), // ~0.99941950
    },
    quadratic: {
      form: 'ln F4 = a + b*kEnd + c*kEnd^2',
      a: +QUAD_FIT.a.toFixed(5), // ~4.99520
      b: +QUAD_FIT.b.toFixed(5), // ~0.00693
      curvature_c: +QUAD_FIT.c.toFixed(7), // ~-0.0429906 (< 0: decay accelerates)
      R2: +QUAD_FIT.R2.toFixed(8), // ~0.99998373 (decisive in-window improvement)
    },
    R2_improves: QUAD_FIT.R2 > LIN_FIT.R2,
    curvature_negative_confirms_acceleration: QUAD_FIT.c < 0,
    localSlopeAtAnchorEnds: {
      // b_local(kEnd) = b + 2c*kEnd -- steepens as the boundary recedes
      at_kEnd_11: +(QUAD_FIT.b + 2 * QUAD_FIT.c * 11).toFixed(5),
      at_kEnd_13: +(QUAD_FIT.b + 2 * QUAD_FIT.c * 13).toFixed(5),
    },
  },
  extendedLadder: EXTENDED, // {kEnd, resid, directR, linR, quadR, logErrLin, logErrQuad} for 13..21
  gapClosure: {
    near_band_kEnd_13_to_14: {
      rmsLogErr_singleExp: +NEAR_BAND.rmsLin.toFixed(5), // ~0.06420
      rmsLogErr_quadratic: +NEAR_BAND.rmsQuad.toFixed(5), // ~0.03738
      reduction_factor: +(NEAR_BAND.rmsLin / NEAR_BAND.rmsQuad).toFixed(3), // ~1.72 (quadratic closes the gap)
      quadratic_closes_gap: NEAR_BAND.rmsQuad < NEAR_BAND.rmsLin,
    },
    full_band_kEnd_13_to_21: {
      rmsLogErr_singleExp: +FULL_BAND.rmsLin.toFixed(5), // ~0.75405
      rmsLogErr_quadratic: +FULL_BAND.rmsQuad.toFixed(5), // ~0.99467
      reduction_factor: +(FULL_BAND.rmsLin / FULL_BAND.rmsQuad).toFixed(3), // ~0.76 (quadratic loses)
      quadratic_closes_gap: FULL_BAND.rmsQuad < FULL_BAND.rmsLin,
    },
  },
  finding: {
    A_curvature_quantifies_acceleration:
      'The quadratic refit ln F4 = a + b*kEnd + c*kEnd^2 has NEGATIVE curvature c ~ -0.04299 and R^2 ~ ' +
      '0.99998, a decisive in-window improvement over the single exponential (R^2 ~ 0.99942, ~35x ' +
      'smaller residual variance). The negative c confirms and quantifies the imp-34023 prose ' +
      'observation: the local log-decay slope b_local(kEnd) = b + 2c*kEnd steepens as the boundary ' +
      'recedes, so F4 collapses FASTER at larger kEnd.',
    B_closes_gap_near_anchor_only:
      'Re-extrapolating the ratio 1/(F2*F3*F4) with the quadratic F4 surrogate (direct F2, F3) CLOSES ' +
      'the under-prediction gap NEAR the anchor -- RMS log-ratio error 0.0642 (single-exp) -> 0.0374 ' +
      '(quadratic) over kEnd=13..14, a ~1.72x reduction, confirming the direction of the imp-34023 ' +
      'note. But the negative curvature EXTRAPOLATES UNSTABLY: past kEnd ~ 15 the c*kEnd^2 term runs ' +
      'away and the quadratic OVER-predicts (error sign flips). Over the full sign-stable extension ' +
      'kEnd=13..21 the quadratic RMS log-error (0.995) is WORSE than the single-exp (0.754) -- it does ' +
      'NOT close the gap globally; it trades a moderate under-prediction for a larger over-prediction ' +
      '(at kEnd=20 direct ~589238, single-exp ~220450, quadratic ~3.39e6).',
    C_direct_ladder_remains_honest_source:
      'Neither low-order surrogate is a reliable extrapolator to the ~21.3 ceiling. The imp-34023 direct ' +
      'ladder remains the honest source for the far-tail divergence, and the divergence itself -- the ' +
      'ratio growing without bound up to the imp-33773 M2 residual sign change at kEnd* ~ 21.281 -- is ' +
      'unchanged by either fit.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / EXTRAPOLATION (frontier-direction, NOT rigorous). Refitting the imp-33969/imp-34023 F4 ' +
    'collapse with an accelerating quadratic ln F4 = a + b*kEnd + c*kEnd^2 on the same 9 anchor windows ' +
    '(identical inherited imp-3406/imp-33810 sub-terms, head fixed at k=6) establishes: (A) the quadratic ' +
    'has NEGATIVE curvature c ~ -0.043 and R^2 ~ 0.99998 vs the single exponential 0.99942 -- a decisive ' +
    'in-window improvement that quantifies the imp-34023 prose observation that the local F4 decay rate ' +
    'accelerates (b_local = b + 2c*kEnd steepens with kEnd). (B) Re-extrapolating the over-prediction ' +
    'ratio with the quadratic F4 CLOSES the gap to the direct ladder ONLY in a narrow band ~1.5 units ' +
    'past the anchor (RMS log-error 0.0642 -> 0.0374 over kEnd=13..14, ~1.72x reduction), then the ' +
    'negative curvature extrapolates unstably and OVER-corrects, so over the full sign-stable extension ' +
    'kEnd=13..21 the quadratic RMS log-error (0.995) is WORSE than the single exponential (0.754). The ' +
    'accelerated law does NOT close the gap to the ceiling; it trades a moderate under-prediction for a ' +
    'larger over-prediction. (C) Neither low-order surrogate reliably extrapolates to the ~21.3 ceiling; ' +
    'the imp-34023 direct ladder remains the honest source and the divergence up to the imp-33773 M2 ' +
    'residual sign change at kEnd* ~ 21.281 is unchanged. The inherited imp-3220/imp-3406 component model ' +
    'is NOT a rigorous asymptotic; the quadratic refit and its extrapolation are descriptive within the ' +
    'model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34023 (the single-exponential F4 fit and the prose acceleration note refit here); imp-34041 ' +
    '(the exponential-wins ratio-form tournament); imp-33969 (the 9-window kEnd=11..13 F4 collapse); ' +
    'imp-33810 (the quarter-decade rungs); imp-33773 (the M2 residual whose sign change at kEnd~21.3 ' +
    'caps the surrogate); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll ' +
    'prefactor).',
};

export const IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT_ASSERTIONS = [
  {
    // (A) Quadratic refit: negative curvature, decisive in-window R^2 improvement over the single exp.
    id: 'imp34090-quadratic-negative-curvature-improves-fit',
    description: 'ln F4 quadratic: c < 0 (accelerating decay), R2 ~ 0.99998 > single-exp 0.99942',
    holds: () =>
      ANCHOR.length === 9 &&
      QUAD_FIT.c < 0 &&
      Math.abs(QUAD_FIT.c - -0.04299) < 0.001 &&
      QUAD_FIT.R2 > LIN_FIT.R2 &&
      QUAD_FIT.R2 > 0.9999 &&
      LIN_FIT.R2 > 0.999,
  },
  {
    // Local slope steepens: b_local(13) is more negative than b_local(11) (acceleration).
    id: 'imp34090-local-slope-steepens-with-kEnd',
    description: 'b_local(kEnd) = b + 2c*kEnd steepens (more negative) as the boundary recedes',
    holds: () => {
      const bl11 = QUAD_FIT.b + 2 * QUAD_FIT.c * 11;
      const bl13 = QUAD_FIT.b + 2 * QUAD_FIT.c * 13;
      return bl13 < bl11 && bl11 < 0 && bl13 < 0;
    },
  },
  {
    // (B) Near the anchor the quadratic CLOSES the gap (RMS reduction > 1).
    id: 'imp34090-quadratic-closes-gap-near-anchor',
    description: 'kEnd=13..14: quadratic RMS log-error < single-exp (reduction ~1.72x)',
    holds: () =>
      NEAR_BAND.rmsQuad < NEAR_BAND.rmsLin &&
      NEAR_BAND.rmsLin / NEAR_BAND.rmsQuad > 1.4 &&
      NEAR_BAND.n >= 2,
  },
  {
    // (B) Over the full extension the quadratic OVER-corrects and does NOT close the gap globally.
    id: 'imp34090-quadratic-overcorrects-full-band',
    description: 'kEnd=13..21: quadratic RMS log-error WORSE than single-exp (over-correction, reduction < 1)',
    holds: () =>
      FULL_BAND.rmsQuad > FULL_BAND.rmsLin &&
      // single-exp under-predicts (negative log-err) while quadratic over-predicts (positive) at kEnd=20
      EXTENDED.find((r) => r.kEnd === 20).logErrLin < 0 &&
      EXTENDED.find((r) => r.kEnd === 20).logErrQuad > 0,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34090-honesty-gate-no-qed',
    description: 'Curve-fit/extrapolation only: isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT.isRigorous === false &&
      /NO QED/.test(IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT.verdict) &&
      /refereed bound is changed/i.test(IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT.verdict),
  },
];

for (const a of IMP34090_F4_COLLAPSE_QUADRATIC_LOG_DECAY_REFIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34090-f4-collapse-quadratic-log-decay-refit assertion failed: ${a.id}`);
  }
}
