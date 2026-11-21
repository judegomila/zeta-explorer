/**
 * @module imp-124786-knee-floor-residual-quadratic-fit
 *
 * imp-124786 (numerical, frontier-direction): imp-124772 F2 reported that after the full 10-floor
 * OLS fit of the knee floor-elasticity p_knee in N* ~ E_trunc^(p_knee), the per-floor residuals form
 * a shallow SIGN-SYMMETRIC deviation (negative at the 0.5x/5x floor extremes, positive in the
 * interior) of amplitude ~3e-3 decades, but only described it qualitatively. A qualitative U does not
 * decide whether the deviation is a genuine higher-order curvature term or merely the finite-difference
 * / storage-rounding jitter of the underlying knee locator.
 *
 * This module CHARACTERIZES that residual by fitting a quadratic in log10 E_trunc to the same
 * imp-97822 floorSweep reused VERBATIM: it reports the quadratic (second-order) coefficient, its
 * standard error from the regression covariance, the t-statistic against zero, and whether the
 * quadratic term is statistically distinguishable from zero at the ~1.6e-3-decade linear-residual
 * noise level.
 *
 * THE FIT (no fresh model -- reuses the imp-97822 floorSweep verbatim)
 * -------------------------------------------------------------------
 * Let x = log10 E_trunc (centered at its mean for conditioning) and y = log10 N*. The linear model
 * y = p1*x + p0 is the imp-124772 OLS with RMS residual ~1.6e-3 decades. We augment it to the
 * quadratic model y = a2*x^2 + a1*x + a0 by ordinary least squares over all ten floor factors and
 * report:
 *   - a2, the quadratic curvature coefficient (decades per centered-decade^2),
 *   - SE(a2) from sigma^2 * (X^T X)^-1 with sigma^2 = SS_res/(n-3),
 *   - t = a2/SE(a2) on n-3 = 7 degrees of freedom (95% critical |t| ~ 2.36),
 *   - the F-statistic for adding the quadratic term over the linear fit,
 *   - the quadratic-model RMS residual vs the linear-model RMS residual.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (G0) THE QUADRATIC TERM IS A GENUINE, HIGHLY SIGNIFICANT CURVATURE. a2 ~ -1.79e-2 decades per
 *        centered-decade^2 with SE ~ 3.6e-4, so t ~ -50 on 7 dof -- ~20x past the 95% critical |t| ~
 *        2.36. The imp-124772 F2 sign-symmetric residual is NOT fit noise; it is a real second-order
 *        term in the (log E_trunc, log N*) relation.
 *   (G1) ADDING THE QUADRATIC COLLAPSES THE RESIDUAL. The RMS residual drops from ~1.59e-3 decades
 *        (linear) to ~8.4e-5 decades (quadratic), a ~19x reduction; the F-statistic for the added
 *        quadratic term is ~2.5e3 on (1,7) dof. The quadratic-model residual ~8.4e-5 decades sits
 *        near the ~3e-5-decade floor implied by the 4-decimal (toFixed(4)) storage of log10 N*, so
 *        the quadratic captures essentially all of the structured residual.
 *   (G2) THE CURVATURE IS CONCAVE-DOWN (a dome), matching the imp-124772 residual shape. a2 < 0
 *        means y = log10 N* bends slightly BELOW its linear trend at the floor extremes and above it
 *        in the interior -- exactly the negative-at-extremes / positive-interior pattern imp-124772
 *        reported. (imp-124772 F2 called this "concave-up U"; the fitted sign shows it is concave-DOWN
 *        in log10 N* -- a hump, not a valley. Same data, corrected orientation.)
 *   (G3) IT DOES NOT THREATEN THE ~ -2.1 IDENTIFICATION. The quadratic coefficient |a2| ~ 0.018 is
 *        ~120x smaller than the linear slope |a1| ~ 2.10; over the ~1-decade E_trunc floor span it
 *        moves the effective local slope by only ~+/-0.02, negligible against the ~0.73-decade gap to
 *        the imp-33684 interior-peak alternative -1.375. p_knee has a MILD real running with floor
 *        depth, but N* ~ E_trunc^(-2.1) remains the correct leading power law.
 *
 * VERDICT: the imp-124772 F2 faint sign-symmetric residual is a GENUINE higher-order curvature term,
 * not fit noise: the quadratic coefficient a2 ~ -0.0179 decades/centered-decade^2 is distinguishable
 * from zero at t ~ -50 (7 dof), and adding it reduces the fit RMS residual by ~19x to ~8.4e-5 decades
 * (near the storage-rounding floor). The curvature is concave-DOWN and ~120x smaller than the linear
 * slope, so p_knee runs mildly with floor depth but the N* ~ E_trunc^(-2.1) leading power law stands.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the 10-floor OLS p_knee fit; F2 residual U characterized here)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee fit; floorSweep reused here verbatim)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor sweep)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak floor exponent ~ -1.375, the softer contrast)
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

// Full imp-97822 floor ladder: {floorFactor, E_trunc, log10Nstar} per factor in {0.5..5}, resolved knees only.
const SWEEP = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep.filter((r) => r.log10Nstar !== null);

// 3x3 matrix inverse (adjugate / determinant) for the quadratic normal equations.
function inv3(m) {
  const [a, b, c] = m[0];
  const [d, e, f] = m[1];
  const [g, h, i] = m[2];
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const D = -(b * i - c * h);
  const E = a * i - c * g;
  const F = -(a * h - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;
  const det = a * A + b * B + c * C;
  return {
    inv: [
      [A / det, D / det, G / det],
      [B / det, E / det, H / det],
      [C / det, F / det, I / det],
    ],
    det,
  };
}

// Quadratic OLS of log10 N* on centered log10 E_trunc, with SE of the quadratic coefficient.
function quadraticResidualFit(rows) {
  const xsRaw = rows.map((r) => Math.log10(r.E_trunc));
  const ys = rows.map((r) => r.log10Nstar);
  const n = xsRaw.length;
  const mx = xsRaw.reduce((s, v) => s + v, 0) / n;
  const xs = xsRaw.map((v) => v - mx); // center for conditioning; a2 is orientation-invariant under centering

  // Linear reference fit (the imp-124772 OLS) for the noise-level baseline.
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += xs[i] * xs[i];
    sxy += xs[i] * (ys[i] - my);
  }
  const linSlope = sxy / sxx;
  let ssResLin = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const pred = my + linSlope * xs[i];
    ssResLin += (ys[i] - pred) ** 2;
    syy += (ys[i] - my) ** 2;
  }

  // Quadratic normal equations: M coef = rhs, M = sum of [1, x, x^2] outer products.
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
    const x2 = x * x;
    S1 += x;
    S2 += x2;
    S3 += x2 * x;
    S4 += x2 * x2;
    T0 += ys[i];
    T1 += x * ys[i];
    T2 += x2 * ys[i];
  }
  const M = [
    [S0, S1, S2],
    [S1, S2, S3],
    [S2, S3, S4],
  ];
  const { inv } = inv3(M);
  const rhs = [T0, T1, T2];
  const coef = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 3; k++) coef[r] += inv[r][k] * rhs[k];
  }
  const [a0, a1, a2] = coef;

  let ssResQuad = 0;
  for (let i = 0; i < n; i++) {
    const pred = a0 + a1 * xs[i] + a2 * xs[i] * xs[i];
    ssResQuad += (ys[i] - pred) ** 2;
  }
  const dof = n - 3;
  const sigma2 = ssResQuad / dof;
  const seA2 = Math.sqrt(sigma2 * inv[2][2]); // covariance = sigma^2 * (X^T X)^-1
  const tA2 = a2 / seA2;
  const fAddedQuad = (ssResLin - ssResQuad) / (ssResQuad / dof); // F(1, dof) for the added term

  return {
    n,
    quadCoef: +a2.toExponential(4), // a2 (decades per centered-decade^2)
    linCoefInQuad: +a1.toFixed(5), // a1 in the quadratic model (~ -2.104)
    seQuadCoef: +seA2.toExponential(4),
    tStatQuad: +tA2.toFixed(2),
    dof,
    tCrit95: 2.36, // two-sided 95% Student-t at 7 dof
    fAddedQuad: +fAddedQuad.toExponential(3),
    rmsResidualLinearDecades: +Math.sqrt(ssResLin / n).toExponential(4),
    rmsResidualQuadDecades: +Math.sqrt(ssResQuad / n).toExponential(4),
    rmsReductionFactor: +(Math.sqrt(ssResLin / n) / Math.sqrt(ssResQuad / n)).toFixed(2),
    storageRoundingFloorDecades: +(1e-4 / Math.sqrt(12)).toExponential(2), // toFixed(4) half-ULP RMS ~3e-5
  };
}

const FIT = quadraticResidualFit(SWEEP);

// Distinguishable-from-zero at the linear-residual noise level: |t| far past the 95% critical value.
const DISTINGUISHABLE = Math.abs(FIT.tStatQuad) > FIT.tCrit95;
// Ratio of quadratic curvature to the linear slope -- how mild the running is.
const CURVATURE_TO_SLOPE = +(Math.abs(FIT.quadCoef) / Math.abs(FIT.linCoefInQuad)).toExponential(3);

export const IMP124786_KNEE_FLOOR_RESIDUAL_QUADRATIC_FIT = {
  id: 'imp-124786',
  proofSection: 'S-frontier',
  question:
    'imp-124772 F2 reported a faint sign-symmetric residual U (negative at the 0.5x/5x floor ' +
    'extremes, positive interior, ~3e-3 decades) after the 10-floor OLS fit of the knee ' +
    'floor-elasticity p_knee, but only qualitatively. Reusing the imp-97822 floorSweep verbatim, fit ' +
    'a quadratic in log10 E_trunc: measure the quadratic coefficient, its standard error, and whether ' +
    'it is statistically distinguishable from zero at the ~1.6e-3-decade linear-residual noise level, ' +
    'deciding whether the U is a genuine curvature correction to N* ~ E_trunc^(-2.1) or fit noise. ' +
    'Measurement/fit only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the quadratic (second-order) coefficient a2 of log10 N* on centered log10 E_trunc over the full ' +
    'imp-97822 floorSweep (ten factors {0.5..5}), with its standard error, t-statistic on 7 dof, the ' +
    'F-statistic for adding the quadratic term, and the linear vs quadratic RMS residual',
  fit: FIT,
  quadCoef: FIT.quadCoef, // ~ -1.79e-2
  seQuadCoef: FIT.seQuadCoef, // ~ 3.6e-4
  tStatQuad: FIT.tStatQuad, // ~ -50
  distinguishableFromZero: DISTINGUISHABLE, // true
  curvatureToSlopeRatio: CURVATURE_TO_SLOPE, // ~ 8.5e-3 (a2 is ~120x smaller than the slope)
  finding: {
    G0_quadratic_term_genuine_and_significant:
      'a2 ~ -1.79e-2 decades per centered-decade^2 with SE ~ 3.6e-4, so t ~ -50 on 7 dof -- ~20x past ' +
      'the 95% critical |t| ~ 2.36. The imp-124772 F2 sign-symmetric residual is NOT fit noise; it is ' +
      'a real second-order term in the (log E_trunc, log N*) relation.',
    G1_adding_quadratic_collapses_residual:
      'the RMS residual drops from ~1.59e-3 decades (linear) to ~8.4e-5 decades (quadratic), a ~19x ' +
      'reduction; the F-statistic for the added quadratic term is ~2.5e3 on (1,7) dof. The ~8.4e-5 ' +
      'quadratic residual sits near the ~3e-5-decade floor implied by the 4-decimal storage of ' +
      'log10 N*, so the quadratic captures essentially all of the structured residual.',
    G2_curvature_is_concave_down:
      'a2 < 0 means log10 N* bends slightly below its linear trend at the floor extremes and above it ' +
      'in the interior -- the negative-at-extremes / positive-interior pattern imp-124772 reported. ' +
      'imp-124772 F2 called this concave-up U; the fitted sign shows it is concave-DOWN in log10 N* ' +
      '(a hump, not a valley) -- same data, corrected orientation.',
    G3_does_not_threaten_the_minus_two_law:
      'the quadratic coefficient |a2| ~ 0.018 is ~120x smaller than the linear slope |a1| ~ 2.10; over ' +
      'the ~1-decade floor span it moves the local slope by only ~+/-0.02, negligible against the ' +
      '~0.73-decade gap to the imp-33684 interior-peak -1.375. p_knee runs mildly with floor depth, ' +
      'but N* ~ E_trunc^(-2.1) remains the correct leading power law.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124772 F2 faint sign-symmetric residual ' +
    'is a GENUINE higher-order curvature term, not fit noise: the quadratic coefficient a2 ~ -0.0179 ' +
    'decades/centered-decade^2 is distinguishable from zero at t ~ -50 (7 dof, 95% critical ~2.36), ' +
    'and adding it reduces the fit RMS residual by ~19x to ~8.4e-5 decades (near the 4-decimal ' +
    'storage-rounding floor), with F ~ 2.5e3 on (1,7) dof. The curvature is concave-DOWN and ~120x ' +
    'smaller than the linear slope, so p_knee runs mildly with floor depth but the N* ~ E_trunc^(-2.1) ' +
    'leading power law stands (a ~0.73-decade gap to the imp-33684 interior-peak -1.375). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124772 (10-floor OLS p_knee fit; F2 residual U characterized here); imp-97822 (two-floor knee ' +
    'fit; floorSweep reused verbatim); imp-33708 (0.5x..5x E_trunc floor sweep); imp-33684 ' +
    '(interior-peak floor exponent ~ -1.375, the softer contrast); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124786_KNEE_FLOOR_RESIDUAL_QUADRATIC_FIT_ASSERTIONS = [
  {
    // Reuse gate: the fit runs over the full imp-97822 ten-floor ladder.
    id: 'imp124786-uses-full-ten-floor-ladder',
    description: 'the quadratic residual fit runs over all ten imp-97822 floor factors',
    holds: () => FIT.n === 10,
  },
  {
    // G0: the quadratic coefficient is distinguishable from zero far past the 95% critical t.
    id: 'imp124786-quad-coef-significant',
    description: 'the quadratic coefficient t-stat exceeds the 95% critical |t| ~ 2.36 by a wide margin',
    holds: () => DISTINGUISHABLE && Math.abs(FIT.tStatQuad) > 10,
  },
  {
    // G1: adding the quadratic term substantially reduces the RMS residual.
    id: 'imp124786-quad-collapses-residual',
    description: 'the quadratic model reduces the RMS residual by more than 5x vs the linear fit',
    holds: () =>
      FIT.rmsReductionFactor > 5 && FIT.rmsResidualQuadDecades < FIT.rmsResidualLinearDecades,
  },
  {
    // G2: the curvature is concave-down (a2 < 0), matching the negative-extremes residual pattern.
    id: 'imp124786-curvature-concave-down',
    description: 'the fitted quadratic coefficient is negative (concave-down hump in log10 N*)',
    holds: () => FIT.quadCoef < 0,
  },
  {
    // G3: the curvature is ~two orders below the linear slope, so it does not threaten the -2.1 law.
    id: 'imp124786-curvature-subdominant',
    description: 'the quadratic coefficient is at least 20x smaller than the linear slope magnitude',
    holds: () => CURVATURE_TO_SLOPE < 0.05,
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp124786-honesty-gate-no-qed',
    description: 'Measurement only: characterizes the imp-124772 residual curvature, no QED, no refereed bound is changed',
    holds: () =>
      IMP124786_KNEE_FLOOR_RESIDUAL_QUADRATIC_FIT.isRigorous === false &&
      /NO QED/.test(IMP124786_KNEE_FLOOR_RESIDUAL_QUADRATIC_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP124786_KNEE_FLOOR_RESIDUAL_QUADRATIC_FIT.verdict),
  },
];

for (const a of IMP124786_KNEE_FLOOR_RESIDUAL_QUADRATIC_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124786-knee-floor-residual-quadratic-fit assertion failed: ${a.id}`);
  }
}
