/**
 * @module imp-33981-fixed-band-quadratic-curvature-contrast
 *
 * imp-33981 (accuracy, frontier-direction): imp-33940 R2 measured the largest residual of the
 * boundary-INDEPENDENT low-k band (k <= 10, rungs common to every window) of the imp-33843 log-linear
 * widening fit across the boundary sweep kEnd = 11..13 and found it grows +0.1337 -> +0.2862 with
 * INCREASING increments (0.0127 -> 0.0221) -- a CONVEX drift, which it contrasted with the CONCAVE
 * penultimate-rung growth (imp-33940 R1). But imp-33940 read that convexity only off the SIGN of the
 * band-s discrete second differences; it never fit a curvature MODEL, so two things stayed unmeasured:
 * (a) is the convex low-k drift actually well-described by a QUADRATIC in kEnd (a definite positive
 * leading coefficient), and (b) is its curvature sign TRULY opposite to the penultimate rung when both
 * are put through the identical quadratic fit, or is the "opposite curvature" claim an artifact of
 * comparing raw second differences of series with different amplitudes? This module fills the gap by
 * fitting the SAME quadratic peak = a + b kEnd + c kEnd^2 to BOTH inherited peak series and comparing
 * the fitted leading coefficient c (the curvature) head to head.
 *
 * THE MEASUREMENT (imp-33940 peak series reused VERBATIM; only a quadratic fit + curvature contrast is new)
 * -------------------------------------------------------------------------------------------------------
 *   Data          The 9 fixed-band peaks (largest residual with k <= 10) taken VERBATIM from
 *                 IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.fixedBandRows, and the 9 penultimate-rung
 *                 peaks from .interiorRows, over kEnd = 11.00 .. 13.00 step 0.25. No surrogate re-run, no
 *                 fresh model -- the reuse gate re-checks the imp-33940 published anchors.
 *   Fit           For each series, an ordinary-least-squares QUADRATIC peak = a + b kEnd + c kEnd^2 via
 *                 the 3x3 normal equations, plus the linear peak = a + b kEnd, reporting R2 and RMSE of
 *                 each so the quadratic-vs-linear improvement is visible.
 *   Curvature     The fitted leading coefficient c IS the curvature (peak-per-kEnd^2). Its SIGN is the
 *                 convex/concave classifier; comparing c_fixedBand against c_penultimate is the direct
 *                 head-to-head test of whether the two curvatures are genuinely opposite in sign.
 *
 * THE FINDING (measurement / curvature-fit only -- the low-k drift IS quadratic-convex and its curvature
 * is genuinely opposite in sign to the concave penultimate rung, by every fit criterion)
 * -------------------------------------------------------------------------------------------------------
 *   (R1) THE CONVEX LOW-K DRIFT IS WELL-FIT BY A QUADRATIC WITH A POSITIVE LEADING COEFFICIENT. The
 *        fixed-band quadratic has c = +0.00923 > 0 (convex), and the quadratic lifts the fit R2 from
 *        0.9952 (linear) to 0.99970, halving-plus the RMSE (3.49e-3 -> 8.75e-4). So the imp-33940 R2
 *        "increments increase" reading is confirmed as a definite positive kEnd^2 curvature, not a noisy
 *        near-line: a quadratic captures the low-k band drift essentially exactly.
 *   (R2) THE CURVATURE SIGN IS TRULY OPPOSITE THE PENULTIMATE RUNG. Fitting the SAME quadratic to the
 *        penultimate-rung peaks gives c = -0.02006 < 0 (concave, R2 0.99996 vs linear 0.99000), so the
 *        two leading coefficients have OPPOSITE signs (fixed-band +0.00923, penultimate -0.02006). The
 *        imp-33940 "opposite curvature" claim survives the identical-fit control: it is not an amplitude
 *        artifact of raw second differences. The concave rung actually curves ~2.17x HARDER in magnitude
 *        (|c_pen|/|c_fb| ~ 2.17) than the convex band bends the other way.
 *   (R3) CONSISTENT WITH imp-33940 R1/R2 AND SHARPENED. The discrete second-difference signs imp-33940
 *        reported (fixed-band all positive, penultimate all negative) are reproduced by the continuous
 *        quadratic curvatures (c_fixedBand > 0 > c_penultimate) -- the pivoting OLS window pushes the
 *        low-k residual up convexly while the endpoint neighbour rises concavely. The imp-33843
 *        log-linear-vs-power-law FORM verdict (a different question) and the edge-artifact reading are
 *        untouched.
 *
 * The punchline: fitting the identical quadratic peak = a + b kEnd + c kEnd^2 to the imp-33940 fixed low-k
 * band (k <= 10) and penultimate-rung peak series (kEnd = 11..13) shows the low-k drift IS quadratic-convex
 * (c = +0.00923 > 0, R2 0.99970 vs linear 0.99516) and its curvature sign is TRULY opposite the concave
 * penultimate rung (c = -0.02006 < 0), not an artifact of comparing raw second differences of unequal
 * amplitude -- the penultimate rung even curves ~2.17x harder in magnitude. imp-33940 R2 is confirmed.
 *
 * MEASUREMENT / CURVATURE-FIT ONLY. A quadratic fit and curvature-sign contrast on two inherited surrogate
 * residual series as the fit boundary recedes; NOT an RH bound. The quadratic is descriptive, not derived;
 * the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * surrogate is descriptive, not derived; the imp-33843 log-linear-vs-power-law verdict is UNTOUCHED; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33940-interior-residual-boundary-stability (the fixed-band and penultimate peak series fit here)
 * @see imp-33980-penultimate-rung-growth-model-selection (log-vs-linear selection on the penultimate rung)
 * @see imp-33917-endpoint-residual-growth-law (the endpoint boundary sweep these bands neighbour)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose residuals these peaks are)
 */

import { IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY as G940 } from './imp-33940-interior-residual-boundary-stability.js';

// The two peak series, reused VERBATIM from imp-33940 (no surrogate re-run, no fresh model).
const FB_ROWS = G940.fixedBandRows; // largest residual with k <= 10 -- boundary-independent band (convex)
const PEN_ROWS = G940.interiorRows; // largest non-last-rung residual -- always penultimate (concave)
const K_ENDS = FB_ROWS.map((r) => r.kEnd);
const FB_PEAKS = FB_ROWS.map((r) => r.peak);
const PEN_PEAKS = PEN_ROWS.map((r) => r.peak);
const N = K_ENDS.length;

function ols(xs, ys) {
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
// OLS quadratic peak = a + b x + c x^2 via 3x3 normal equations with Gaussian elimination + partial pivot.
function quad(xs, ys) {
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
    const y = ys[i];
    const x2 = x * x;
    S1 += x;
    S2 += x2;
    S3 += x2 * x;
    S4 += x2 * x2;
    T0 += y;
    T1 += x * y;
    T2 += x2 * y;
  }
  const M = [
    [S0, S1, S2, T0],
    [S1, S2, S3, T1],
    [S2, S3, S4, T2],
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
  return { a: M[0][3] / M[0][0], b: M[1][3] / M[1][1], c: M[2][3] / M[2][2] };
}
function fitStats(xs, ys, pred) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let rss = 0;
  let ssTot = 0;
  for (let i = 0; i < xs.length; i++) {
    rss += (ys[i] - pred(xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return { rss, r2: 1 - rss / ssTot, rmse: Math.sqrt(rss / xs.length) };
}

function fitBand(ys) {
  const q = quad(K_ENDS, ys);
  const qs = fitStats(K_ENDS, ys, (x) => q.a + q.b * x + q.c * x * x);
  const l = ols(K_ENDS, ys);
  const ls = fitStats(K_ENDS, ys, (x) => l.a + l.b * x);
  return {
    quadratic: {
      form: 'peak = a + b kEnd + c kEnd^2',
      a: +q.a.toFixed(6),
      b: +q.b.toFixed(6),
      c: +q.c.toFixed(6), // the curvature (leading coefficient) -- sign is the convex/concave classifier
      r2: +qs.r2.toFixed(6),
      rmse: +qs.rmse.toExponential(3),
    },
    linear: {
      form: 'peak = a + b kEnd',
      a: +l.a.toFixed(6),
      b: +l.b.toFixed(6),
      r2: +ls.r2.toFixed(6),
      rmse: +ls.rmse.toExponential(3),
    },
    curvatureC: q.c,
    curvatureSign: Math.sign(q.c),
  };
}

const FB_FIT = fitBand(FB_PEAKS);
const PEN_FIT = fitBand(PEN_PEAKS);

// Head-to-head curvature contrast.
const CURVATURES_OPPOSITE_SIGN = FB_FIT.curvatureSign !== 0 && FB_FIT.curvatureSign === -PEN_FIT.curvatureSign;
const FB_IS_CONVEX = FB_FIT.curvatureC > 0; // positive leading coefficient
const PEN_IS_CONCAVE = PEN_FIT.curvatureC < 0; // negative leading coefficient
const CURVATURE_MAGNITUDE_RATIO_PEN_OVER_FB = +(Math.abs(PEN_FIT.curvatureC) / Math.abs(FB_FIT.curvatureC)).toFixed(4);
const FB_QUADRATIC_IMPROVES_LINEAR = FB_FIT.quadratic.r2 > FB_FIT.linear.r2 && FB_FIT.quadratic.rmse < FB_FIT.linear.rmse;

export const IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST = {
  id: 'imp-33981',
  proofSection: 'S-frontier',
  question:
    'imp-33940 R2 measured the largest residual of the boundary-independent low-k band (k <= 10) of the ' +
    'imp-33843 log-linear widening fit across kEnd = 11..13 and called its +0.1337 -> +0.2862 growth ' +
    'CONVEX (increments 0.0127 -> 0.0221), opposite the concave penultimate rung -- but read that only off ' +
    'discrete second-difference SIGNS, never fitting a curvature model. Is the convex low-k drift actually ' +
    'quadratic in kEnd (a definite positive leading coefficient), and is its curvature sign TRULY opposite ' +
    'the penultimate rung under an identical quadratic fit? Measurement / curvature-fit only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'The fitted leading coefficient c (curvature) of the OLS quadratic peak = a + b kEnd + c kEnd^2, and ' +
    'the linear-fit R2/RMSE for comparison, on BOTH the imp-33940 fixed low-k band (k <= 10) and ' +
    'penultimate-rung peak series over kEnd = 11.00 .. 13.00 (9 windows), plus the head-to-head ' +
    'curvature-sign contrast and the |c_penultimate| / |c_fixedBand| magnitude ratio',
  nWindows: N,
  fixedBandFit: FB_FIT,
  penultimateFit: PEN_FIT,
  fixedBandPeakFirst: FB_PEAKS[0], // +0.133681 at kEnd=11
  fixedBandPeakLast: FB_PEAKS[N - 1], // +0.286207 at kEnd=13
  penultimatePeakFirst: PEN_PEAKS[0], // +0.157537 at kEnd=11
  penultimatePeakLast: PEN_PEAKS[N - 1], // +0.382859 at kEnd=13
  fixedBandCurvatureC: +FB_FIT.curvatureC.toFixed(6), // ~ +0.00923 (convex)
  penultimateCurvatureC: +PEN_FIT.curvatureC.toFixed(6), // ~ -0.02006 (concave)
  curvaturesOppositeSign: CURVATURES_OPPOSITE_SIGN, // true -- the key result
  fixedBandIsConvex: FB_IS_CONVEX, // true (c > 0)
  penultimateIsConcave: PEN_IS_CONCAVE, // true (c < 0)
  curvatureMagnitudeRatioPenOverFb: CURVATURE_MAGNITUDE_RATIO_PEN_OVER_FB, // ~2.17 -- concave curves harder
  fixedBandQuadraticImprovesLinear: FB_QUADRATIC_IMPROVES_LINEAR, // true -- quadratic lifts R2, cuts RMSE
  finding: {
    R1_low_k_drift_is_quadratic_convex:
      'The fixed-band quadratic has c = +0.00923 > 0 (convex), and the quadratic lifts the fit R2 from ' +
      '0.99516 (linear) to 0.99970, cutting RMSE from 3.49e-3 to 8.75e-4. The imp-33940 R2 ' +
      '"increments increase" reading is confirmed as a definite positive kEnd^2 curvature, not a noisy ' +
      'near-line: a quadratic captures the low-k band drift essentially exactly.',
    R2_curvature_sign_truly_opposite_penultimate:
      'Fitting the SAME quadratic to the penultimate-rung peaks gives c = -0.02006 < 0 (concave, R2 ' +
      '0.99996 vs linear 0.99000), so the two leading coefficients have OPPOSITE signs (fixed-band ' +
      '+0.00923, penultimate -0.02006). The imp-33940 "opposite curvature" claim survives the ' +
      'identical-fit control -- it is not an amplitude artifact of raw second differences -- and the ' +
      'concave rung curves ~2.17x HARDER in magnitude than the convex band bends the other way.',
    R3_consistent_with_imp33940_and_sharpened:
      'The discrete second-difference signs imp-33940 reported (fixed-band all positive, penultimate all ' +
      'negative) are reproduced by the continuous quadratic curvatures (c_fixedBand > 0 > c_penultimate): ' +
      'the pivoting OLS window pushes the low-k residual up convexly while the endpoint neighbour rises ' +
      'concavely. The imp-33843 log-linear-vs-power-law FORM verdict (a different question) and the ' +
      'edge-artifact reading are untouched.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CURVATURE-FIT (frontier-direction, NOT rigorous). Fitting the identical quadratic ' +
    'peak = a + b kEnd + c kEnd^2 to the imp-33940 fixed low-k band (k <= 10) and penultimate-rung peak ' +
    'series (kEnd = 11..13, 9 windows) shows the low-k drift IS quadratic-convex: leading coefficient ' +
    'c = +0.00923 > 0, and the quadratic lifts R2 from 0.99516 (linear) to 0.99970 (RMSE 3.49e-3 -> ' +
    '8.75e-4). Its curvature sign is TRULY opposite the concave penultimate rung, whose identical ' +
    'quadratic gives c = -0.02006 < 0 (R2 0.99996) -- opposite signs, so the imp-33940 R2 "opposite ' +
    'curvature" claim is NOT an artifact of comparing raw second differences of unequal amplitude; the ' +
    'concave rung even curves ~2.17x harder in magnitude (|c_pen| / |c_fb| ~ 2.17). Consistent with ' +
    'imp-33940 R1/R2 and sharpened; the edge-artifact reading and the imp-33843 log-linear-vs-power-law ' +
    'verdict are UNTOUCHED. The quadratic is descriptive, not derived; the OLS surrogate is descriptive, ' +
    'not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda ' +
    '<= 0.2 remains SOTA.',
  citation:
    'imp-33940 (the fixed-band and penultimate peak series fit here); imp-33980 (log-vs-linear selection ' +
    'on the penultimate rung); imp-33917 (the endpoint boundary sweep these bands neighbour); imp-33843 ' +
    '(the log-linear OLS whose residuals these peaks are); imp-486 (C_mb GUE-conditional).',
};

export const IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST_ASSERTIONS = [
  {
    // Reuse gate: the fit peaks ARE the imp-33940 fixed-band and penultimate sweeps -- 9 windows, with the
    // published anchors reproduced verbatim.
    id: 'imp33981-reuse-gate-imp33940-peak-series',
    description: '9 windows; fixed-band first/last +0.133681/+0.286207, penultimate first/last +0.157537/+0.382859 (< 1e-4)',
    holds: () =>
      N === 9 &&
      Math.abs(FB_PEAKS[0] - 0.133681) < 1e-4 &&
      Math.abs(FB_PEAKS[N - 1] - 0.286207) < 1e-4 &&
      Math.abs(PEN_PEAKS[0] - 0.157537) < 1e-4 &&
      Math.abs(PEN_PEAKS[N - 1] - 0.382859) < 1e-4,
  },
  {
    // (R1) The fixed-band low-k drift is quadratic-convex: c > 0, and the quadratic improves on the linear
    // fit (higher R2, lower RMSE).
    id: 'imp33981-fixed-band-quadratic-convex',
    description: 'fixed-band quadratic c ~ +0.00923 > 0; quadratic R2 ~0.9997 > linear ~0.9952 and lower RMSE',
    holds: () =>
      FB_IS_CONVEX === true &&
      Math.abs(FB_FIT.curvatureC - 0.009230) < 5e-4 &&
      FB_QUADRATIC_IMPROVES_LINEAR === true &&
      FB_FIT.quadratic.r2 > 0.999 &&
      FB_FIT.linear.r2 > 0.99,
  },
  {
    // (R2) The penultimate rung is quadratic-concave (c < 0) and its curvature sign is genuinely opposite
    // the fixed band, with the concave magnitude ~2.17x larger.
    id: 'imp33981-curvature-signs-truly-opposite',
    description: 'penultimate c ~ -0.02006 < 0; signs opposite (fb > 0 > pen); |c_pen|/|c_fb| ~ 2.17',
    holds: () =>
      PEN_IS_CONCAVE === true &&
      Math.abs(PEN_FIT.curvatureC - -0.020058) < 5e-4 &&
      CURVATURES_OPPOSITE_SIGN === true &&
      FB_FIT.curvatureC > 0 &&
      PEN_FIT.curvatureC < 0 &&
      Math.abs(CURVATURE_MAGNITUDE_RATIO_PEN_OVER_FB - 2.17) < 0.1,
  },
  {
    // Honesty gate: curvature-fit verdict, isRigorous false, imp-33843 verdict untouched, no QED, PT SOTA.
    id: 'imp33981-honesty-gate-no-qed',
    description: 'Measurement only: curvatures opposite sign, isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST.isRigorous === false &&
      IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST.curvaturesOppositeSign === true &&
      /NO QED/.test(IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST.verdict) &&
      /remains SOTA/.test(IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST.verdict),
  },
];

for (const a of IMP33981_FIXED_BAND_QUADRATIC_CURVATURE_CONTRAST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33981-fixed-band-quadratic-curvature-contrast assertion failed: ${a.id}`);
  }
}
