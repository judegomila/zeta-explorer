/**
 * @module imp-124891-interior-peak-quadratic-curvature-fit
 *
 * imp-124891 (numerical, frontier-direction): imp-124848 gave the imp-33684 sigma INTERIOR-PEAK
 * floor-elasticity the full ten-floor OLS treatment and found a good but measurably-less-clean
 * power law: log10 N*_peak on log10 E_trunc has an OLS slope p_peak_lsq ~ -1.412 with R^2 ~ 0.99961,
 * an RMS residual ~ 7.8e-3 decades (roughly 5x the far-tail knee residual), and a mildly ASYMMETRIC
 * sign-symmetric residual lobe skewed toward the high-floor (1.5x..2x) side. imp-124848 F2 attributed
 * that extra curvature to E_flow ~ 4.7e-5 still being comparable to E_trunc near the peak, but it
 * never fit an explicit curvature TERM: the residual shape was described qualitatively, and the
 * -1.412-vs-far-tail-(-2.106) gap of ~0.69 was left as a bare exponent difference with no split
 * into "genuinely different linear elasticity" versus "same elasticity, bent by curvature."
 *
 * THIS MODULE fits the explicit quadratic
 *     log10 N*_peak = a + p * log10 E_trunc + c * (log10 E_trunc)^2
 * over the SAME imp-33684 ten-floor sensitivityTable (verbatim, no fresh model), measures the
 * curvature coefficient c and the residual it removes, fits the SAME quadratic to the imp-97822
 * far-tail knee ladder for an apples-to-apples comparison, and DERIVES how much of the -1.412 vs
 * -2.106 apparent-exponent gap is a difference in the linear (power-law) coefficient versus a
 * difference in curvature.
 *
 * THE FIT (no fresh model -- reuses imp-33684 / imp-97822 sensitivityTables verbatim)
 * ---------------------------------------------------------------------------------
 * Quadratic OLS by normal equations over the ten (log10 E_trunc, log10 N*_peak) points. Because
 * both the interior-peak and the far-tail ladders are read on the IDENTICAL floor grid
 * {0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0}, the x samples are identical, so the
 * curvature-to-slope conversion factor D = Cov(x^2, x) / Var(x) is SHARED. The OLS slope of any
 * quadratic sampled on that grid is exactly slope_OLS = p + c * D, so the apparent-exponent gap
 * splits EXACTLY:
 *     (peak slope_OLS) - (far slope_OLS) = (p_peak - p_far) + D * (c_peak - c_far),
 * a linear-coefficient part plus a curvature part, with no cross term.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F0) THE QUADRATIC RESOLVES A REAL CURVATURE TERM AND COLLAPSES THE RESIDUAL. Adding the c*x^2
 *        term lifts R^2 from 0.99961 to 0.99999677 and drops the RMS residual from ~7.84e-3 to
 *        ~7.10e-4 decades -- an ~11x reduction (max-abs 1.45e-2 -> 1.27e-3). So the imp-124848
 *        "measurably-less-clean power law" is, to high fidelity, a clean quadratic: the interior-peak
 *        locus carries a genuine, resolvable curvature term rather than noise.
 *   (F1) THE CURVATURE COEFFICIENT IS c_peak ~ -0.0878, ~4.9x THE FAR-TAIL. The interior-peak
 *        quadratic curvature c_peak ~ -0.08777 (concave-down in log-log) is ~4.9x the far-tail knee
 *        c_far ~ -0.01787 fit on the same grid -- the quantitative form of the imp-124848 "~5x-larger
 *        residual" reading, now attributed to an explicit second-order term.
 *   (F2) THE APPARENT -1.412-vs--2.106 GAP IS ~87% CURVATURE, ~13% LINEAR ELASTICITY. The pure
 *        linear (power-law) coefficient of the interior peak is p_peak ~ -2.167 -- nearly the SAME as
 *        the far-tail knee p_far ~ -2.260 (a gap of only ~0.093, and the peak is marginally SHALLOWER,
 *        not softer). The apparent ~0.6947 exponent gap splits EXACTLY as 0.0929 (linear-coefficient,
 *        ~13.4%) + 0.6019 (curvature, ~86.6%) via the shared D ~ -8.609. So the interior-peak "softer
 *        exponent -1.412" is overwhelmingly a curvature TILT of a common ~E_trunc^(-2.1..-2.26) power
 *        law, not a genuinely different linear elasticity.
 *   (F3) CONFIRMS THE imp-124848 E_flow SOFTENING AS A CURVATURE, NOT AN ELASTICITY SHIFT. The
 *        E_flow ~ 4.7e-5 correction imp-124848 F2 blamed for the extra residual is here isolated as
 *        the c_peak ~ -0.0878 second-order term: it bends the peak locus (curvature ~4.9x the far
 *        tail) while leaving the underlying linear elasticity essentially the common far-tail value.
 *        The two landmarks share a linear power law; they differ almost entirely in how much the
 *        window-confined E_flow curvature tilts the apparent slope.
 *
 * VERDICT: the imp-124848 interior-peak "softer exponent -1.412 vs far-tail -2.106" is DECOMPOSED.
 * An explicit quadratic fit resolves a real curvature term c_peak ~ -0.0878 (R^2 -> 0.99999677, RMS
 * residual cut ~11x), ~4.9x the far-tail c_far ~ -0.0179. Of the ~0.6947 apparent-exponent gap, only
 * ~0.093 (~13%) is a difference in the linear power-law coefficient (p_peak ~ -2.167 vs p_far ~ -2.260,
 * the peak marginally shallower); ~0.602 (~87%) is the curvature tilt D*(c_peak - c_far) with the
 * shared grid factor D ~ -8.609. The interior peak and the far tail obey a common ~E_trunc^(-2.1..-2.26)
 * linear elasticity; the "softening" is an E_flow-driven quadratic curvature confined to the peak window.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit (the linear OLS p_peak ~ -1.412, R^2 ~ 0.99961; the curvature this module fits explicitly)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the far-tail knee linear OLS p_knee ~ -2.106)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the far-tail floorSweep quad-fit here for apples-to-apples)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak sensitivityTable reused verbatim; E_flow ~ 4.7e-5 softening mechanism)
 */

import { IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY } from './imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

// Interior-peak ladder (imp-33684): {floorFactor, E_trunc, log10_N_max} for factors {0.5..5}.
const PEAK_SWEEP = IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.sensitivityTable.filter(
  (r) => r.log10_N_max !== null && Number.isFinite(r.log10_N_max),
);
// Far-tail knee ladder (imp-97822): {floorFactor, E_trunc, log10Nstar} on the SAME floor grid.
const FAR_SWEEP = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep.filter(
  (r) => r.log10Nstar !== null && Number.isFinite(r.log10Nstar),
);

// OLS of log10 N* on log10 E_trunc (linear). Slope = the apparent floor-elasticity.
function linOLS(xs, ys) {
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
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let maxAbs = 0;
  for (let i = 0; i < n; i++) {
    const resid = ys[i] - (slope * xs[i] + intercept);
    ssRes += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
  }
  return {
    slope: +slope.toFixed(6),
    r2: +(1 - ssRes / syy).toFixed(8),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    maxAbsResidualDecades: +maxAbs.toExponential(4),
  };
}

// Quadratic OLS of y = a + p*x + c*x^2 by 3x3 normal equations (Gaussian elimination).
function quadOLS(xs, ys) {
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
    S1 += x;
    S2 += x * x;
    S3 += x * x * x;
    S4 += x * x * x * x;
    T0 += y;
    T1 += x * y;
    T2 += x * x * y;
  }
  const M = [
    [S0, S1, S2],
    [S1, S2, S3],
    [S2, S3, S4],
  ];
  const b = [T0, T1, T2];
  for (let i = 0; i < 3; i++) {
    const piv = M[i][i];
    for (let j = i; j < 3; j++) M[i][j] /= piv;
    b[i] /= piv;
    for (let k = 0; k < 3; k++) {
      if (k !== i) {
        const f = M[k][i];
        for (let j = i; j < 3; j++) M[k][j] -= f * M[i][j];
        b[k] -= f * b[i];
      }
    }
  }
  const [a, p, c] = b;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let syy = 0;
  let ssRes = 0;
  let maxAbs = 0;
  const residuals = [];
  for (let i = 0; i < n; i++) syy += (ys[i] - my) ** 2;
  for (let i = 0; i < n; i++) {
    const resid = ys[i] - (a + p * xs[i] + c * xs[i] * xs[i]);
    residuals.push({ floorFactor: xs.length === PEAK_SWEEP.length ? PEAK_SWEEP[i].floorFactor : null, residualDecades: +resid.toFixed(6) });
    ssRes += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
  }
  return {
    n,
    a: +a.toFixed(6),
    p: +p.toFixed(6),
    c: +c.toFixed(6),
    r2: +(1 - ssRes / syy).toFixed(8),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    maxAbsResidualDecades: +maxAbs.toExponential(4),
    residuals,
  };
}

// Shared grid factor D = Cov(x^2, x) / Var(x); identical for both ladders (same floor grid).
function gridFactorD(xs) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const x2 = xs.map((x) => x * x);
  const mx2 = x2.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varx = 0;
  for (let i = 0; i < n; i++) {
    cov += (x2[i] - mx2) * (xs[i] - mx);
    varx += (xs[i] - mx) ** 2;
  }
  return cov / varx;
}

const PEAK_X = PEAK_SWEEP.map((r) => Math.log10(r.E_trunc));
const PEAK_Y = PEAK_SWEEP.map((r) => r.log10_N_max);
const FAR_X = FAR_SWEEP.map((r) => Math.log10(r.E_trunc));
const FAR_Y = FAR_SWEEP.map((r) => r.log10Nstar);

const PEAK_LIN = linOLS(PEAK_X, PEAK_Y); // reproduces imp-124848: slope ~ -1.4117, R^2 ~ 0.99961
const PEAK_QUAD = quadOLS(PEAK_X, PEAK_Y); // p ~ -2.1674, c ~ -0.0878, R^2 ~ 0.99999677
const FAR_QUAD = quadOLS(FAR_X, FAR_Y); // p ~ -2.2603, c ~ -0.0179, R^2 ~ 0.99999998
const D = gridFactorD(PEAK_X); // ~ -8.6095 (shared)

// Residual the curvature term removes (RMS reduction factor over the linear fit).
const RESIDUAL_REDUCTION_FACTOR = +(PEAK_LIN.rmsResidualDecades / PEAK_QUAD.rmsResidualDecades).toFixed(3); // ~11.0x
const CURVATURE_RATIO_TO_FARTAIL = +(PEAK_QUAD.c / FAR_QUAD.c).toFixed(3); // ~4.91x

// Exact split of the apparent-exponent gap: slope_OLS = p + c*D on the shared grid.
const PEAK_LIN_SLOPE = PEAK_LIN.slope; // ~ -1.4117
const FAR_LIN_SLOPE = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq; // ~ -2.1065
const APPARENT_GAP = +Math.abs(PEAK_LIN_SLOPE - FAR_LIN_SLOPE).toFixed(4); // ~0.6947
const LINEAR_PART = +(PEAK_QUAD.p - FAR_QUAD.p).toFixed(4); // ~0.0929 (peak marginally shallower)
const CURVATURE_PART = +(D * (PEAK_QUAD.c - FAR_QUAD.c)).toFixed(4); // ~0.6019
const SPLIT_SUM_CHECK = +(LINEAR_PART + CURVATURE_PART).toFixed(4); // ~0.6947 == PEAK_LIN_SLOPE - FAR_LIN_SLOPE
const CURVATURE_SHARE_PCT = +(
  (100 * Math.abs(CURVATURE_PART)) /
  (Math.abs(LINEAR_PART) + Math.abs(CURVATURE_PART))
).toFixed(1); // ~86.6%
const LINEAR_SHARE_PCT = +(100 - CURVATURE_SHARE_PCT).toFixed(1); // ~13.4%

export const IMP124891_INTERIOR_PEAK_QUADRATIC_CURVATURE_FIT = {
  id: 'imp-124891',
  proofSection: 'S-frontier',
  question:
    'imp-124848 found the imp-33684 sigma interior-peak floor-elasticity locus (log10 N*_peak on ' +
    'log10 E_trunc) is a good but measurably-less-clean power law (p_peak_lsq ~ -1.412, R^2 ~ 0.99961) ' +
    'with residuals ~5x the far-tail knee and mildly asymmetric, attributing the curvature to E_flow ' +
    'still being comparable to E_trunc near the peak -- but never fit an explicit curvature term. Fit ' +
    'the quadratic log10 N*_peak = a + p*log10 E_trunc + c*(log10 E_trunc)^2 over the same imp-33684 ' +
    'ten-floor ladder, measure the curvature coefficient c and the residual it removes, and derive how ' +
    'much of the -1.412-vs-far-tail-(-2.106) gap is linear-slope versus curvature. Measurement/fit ' +
    'only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the quadratic curvature coefficient c_peak of log10 N*_peak in log10 E_trunc over the imp-33684 ' +
    'ten-floor ladder, the residual it removes vs the imp-124848 linear fit, the far-tail knee ' +
    'curvature c_far on the same grid, and the exact split of the apparent -1.412-vs--2.106 exponent ' +
    'gap into a linear-coefficient part (p_peak - p_far) and a curvature part D*(c_peak - c_far)',
  peakLinearFit: PEAK_LIN, // reproduces imp-124848 (slope ~ -1.4117)
  peakQuadraticFit: PEAK_QUAD, // a, p, c, R^2, residuals
  fartailQuadraticFit: FAR_QUAD, // apples-to-apples on the same grid
  gridFactorD: +D.toFixed(6), // ~ -8.6095 (shared: slope_OLS = p + c*D)
  residualReductionFactor: RESIDUAL_REDUCTION_FACTOR, // ~11.0x RMS cut by the c term
  curvatureRatioToFartail: CURVATURE_RATIO_TO_FARTAIL, // ~4.91x
  gapDecomposition: {
    apparent_gap: APPARENT_GAP, // ~0.6947 (peak linOLS -1.4117 vs far knee -2.1065)
    linear_coefficient_part: LINEAR_PART, // ~0.0929 (p_peak -2.167 vs p_far -2.260, peak shallower)
    curvature_part: CURVATURE_PART, // ~0.6019 = D*(c_peak - c_far)
    split_sum_check: SPLIT_SUM_CHECK, // ~0.6947 (exact: no cross term on the shared grid)
    curvature_share_pct: CURVATURE_SHARE_PCT, // ~86.6%
    linear_share_pct: LINEAR_SHARE_PCT, // ~13.4%
    note:
      'On the shared floor grid the OLS slope of any quadratic is exactly p + c*D, so the apparent ' +
      'exponent gap splits with no cross term: 0.0929 (linear coefficient, ~13.4%) + 0.6019 (curvature, ' +
      '~86.6%). The interior-peak linear power-law coefficient p_peak ~ -2.167 is nearly the far-tail ' +
      'p_far ~ -2.260 (peak marginally SHALLOWER by ~0.093); the ~0.69 apparent softening is ~87% an ' +
      'E_flow curvature tilt of a common ~E_trunc^(-2.1..-2.26) power law, not a different elasticity.',
  },
  finding: {
    F0_quadratic_collapses_the_residual:
      'adding the c*x^2 term lifts R^2 from 0.99961 to 0.99999677 and cuts the RMS residual from ' +
      '~7.84e-3 to ~7.10e-4 decades (~11x; max-abs 1.45e-2 -> 1.27e-3): the imp-124848 less-clean ' +
      'power law is, to high fidelity, a clean quadratic with a genuine resolvable curvature term.',
    F1_curvature_is_negative_and_5x_the_fartail:
      'c_peak ~ -0.08777 (concave-down in log-log) is ~4.9x the far-tail knee c_far ~ -0.01787 fit ' +
      'on the same grid -- the quantitative form of the imp-124848 ~5x-larger residual reading, now ' +
      'attributed to an explicit second-order term.',
    F2_gap_is_mostly_curvature:
      'the pure linear coefficient p_peak ~ -2.167 is nearly the far-tail p_far ~ -2.260 (gap ~0.093, ' +
      'peak marginally shallower). The apparent ~0.6947 exponent gap splits EXACTLY as 0.0929 ' +
      '(linear-coefficient, ~13.4%) + 0.6019 (curvature, ~86.6%) via the shared D ~ -8.609, so the ' +
      'interior-peak softer exponent -1.412 is overwhelmingly a curvature tilt of a common power law.',
    F3_confirms_eflow_softening_as_curvature:
      'the E_flow ~ 4.7e-5 correction imp-124848 F2 blamed for the extra residual is isolated as the ' +
      'c_peak ~ -0.0878 second-order term: it bends the peak locus (~4.9x the far-tail curvature) ' +
      'while leaving the underlying linear elasticity essentially the common far-tail value.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124848 interior-peak softer exponent ' +
    '-1.412 vs far-tail -2.106 is DECOMPOSED by an explicit quadratic fit: it resolves a real ' +
    'curvature term c_peak ~ -0.0878 (R^2 -> 0.99999677, RMS residual cut ~11x), ~4.9x the far-tail ' +
    'c_far ~ -0.0179. Of the ~0.6947 apparent-exponent gap, only ~0.093 (~13%) is a difference in ' +
    'the linear power-law coefficient (p_peak ~ -2.167 vs p_far ~ -2.260, the peak marginally ' +
    'shallower); ~0.602 (~87%) is the curvature tilt D*(c_peak - c_far) with the shared grid factor ' +
    'D ~ -8.609. The interior peak and the far tail obey a common ~E_trunc^(-2.1..-2.26) linear ' +
    'elasticity; the softening is an E_flow-driven quadratic curvature confined to the peak window, ' +
    'confirming the imp-124848 F2 attribution as a curvature rather than an elasticity shift. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-124848 (interior-peak linear OLS p_peak ~ -1.412, R^2 ~ 0.99961; the curvature fit here); ' +
    'imp-124772 (far-tail knee linear OLS p_knee ~ -2.106); imp-97822 (far-tail floorSweep, quad-fit ' +
    'here); imp-33684 (interior-peak sensitivityTable reused verbatim; E_flow ~ 4.7e-5 softening); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124891_INTERIOR_PEAK_QUADRATIC_CURVATURE_FIT_ASSERTIONS = [
  {
    // Reuse gate: the quadratic fit runs over all ten imp-33684 floor factors, and reproduces
    // the imp-124848 linear OLS slope to 6 decimals.
    id: 'imp124891-uses-full-ten-floor-ladder-and-reproduces-imp124848',
    description: 'the quadratic fit runs over all ten floors and its linear-fit slope matches imp-124848 pPeakLsq',
    holds: () =>
      PEAK_QUAD.n === 10 &&
      Math.abs(PEAK_LIN.slope - (-1.411722)) < 1e-5,
  },
  {
    // F0: the c term collapses the residual -- R^2 rises and RMS drops by a large factor.
    id: 'imp124891-quadratic-collapses-residual',
    description: 'quadratic R^2 > linear R^2 and the RMS residual drops by at least 5x',
    holds: () => PEAK_QUAD.r2 > PEAK_LIN.r2 && RESIDUAL_REDUCTION_FACTOR > 5,
  },
  {
    // F1: the interior-peak curvature is negative and several times the far-tail curvature.
    id: 'imp124891-curvature-negative-and-larger-than-fartail',
    description: 'c_peak < 0 and |c_peak| is 3x..7x the far-tail |c_far| on the same grid',
    holds: () =>
      PEAK_QUAD.c < 0 &&
      FAR_QUAD.c < 0 &&
      CURVATURE_RATIO_TO_FARTAIL > 3 &&
      CURVATURE_RATIO_TO_FARTAIL < 7,
  },
  {
    // F2 (exactness): slope_OLS = p + c*D on the shared grid, so the gap splits with no cross term.
    id: 'imp124891-gap-split-is-exact',
    description: 'the linear + curvature parts sum to the apparent exponent gap (shared-grid identity)',
    holds: () =>
      Math.abs(D - gridFactorD(FAR_X)) < 1e-9 &&
      Math.abs(SPLIT_SUM_CHECK - (PEAK_LIN_SLOPE - FAR_LIN_SLOPE)) < 1e-3,
  },
  {
    // F2 (dominance): the curvature part carries the overwhelming majority of the apparent gap.
    id: 'imp124891-gap-is-mostly-curvature',
    description: 'the curvature part is > 75% of the apparent exponent gap; the linear coefficients nearly agree',
    holds: () =>
      CURVATURE_SHARE_PCT > 75 &&
      Math.abs(LINEAR_PART) < 0.15 &&
      APPARENT_GAP > 0.5,
  },
  {
    // Honesty gate: measurement/fit only, no QED, PT SOTA.
    id: 'imp124891-honesty-gate-no-qed',
    description: 'Measurement only: decomposes the interior-peak exponent into linear vs curvature, no QED, PT stays SOTA',
    holds: () =>
      IMP124891_INTERIOR_PEAK_QUADRATIC_CURVATURE_FIT.isRigorous === false &&
      /NO QED/.test(IMP124891_INTERIOR_PEAK_QUADRATIC_CURVATURE_FIT.verdict) &&
      /remains SOTA/.test(IMP124891_INTERIOR_PEAK_QUADRATIC_CURVATURE_FIT.verdict),
  },
];

for (const a of IMP124891_INTERIOR_PEAK_QUADRATIC_CURVATURE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124891-interior-peak-quadratic-curvature-fit assertion failed: ${a.id}`,
    );
  }
}
