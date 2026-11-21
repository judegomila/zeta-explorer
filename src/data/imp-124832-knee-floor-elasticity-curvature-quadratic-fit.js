/**
 * @module imp-124832-knee-floor-elasticity-curvature-quadratic-fit
 *
 * imp-124832 (accuracy, frontier-direction): imp-124814 reproduced the imp-124772/imp-97822 knee
 * floor-elasticity p_knee ~ -2.106 from a FRESH exponent-curvature locator and noted (its R2) that the
 * OLS residuals of log10 N* on log10 E_trunc form a shallow sign-symmetric hump -- negative at the
 * 0.5x/5x floor extremes, positive in the interior -- calling it "a genuine feature" but never fitting
 * it. This leaf FITS that residual to a quadratic-in-log10(E_trunc) curvature term, extracts the
 * curvature coefficient, and ASSESSES whether that second-order floor-elasticity is a manifestation of
 * the imp-97720 second-order (Hessian) structure of the sigma model, or a distinct locator-specific
 * effect. Measurement / cross-validation only; C_mb GUE-conditional per imp-486 untouched; no bound
 * moves; NO QED.
 *
 * THE FIT (fresh knees, recomputed here on the imp-124814 grid; floorSweep never imported)
 * --------------------------------------------------------------------------------------
 * The ten knees are re-located with the identical imp-124814 fresh exponent-curvature locator (scan
 * step 0.0025, central-difference h = 1.5e-4, second-difference dd = 1.2e-3), so the residual is a
 * property of the model, not of a reused array. Two nested OLS fits of y = log10 N* on x = log10 E_trunc:
 *   (LIN)  y = a0 + b0 x                 -- the imp-124772/imp-124814 straight line (slope ~ -2.106).
 *   (QUAD) y = a + b (x - xbar) + c (x - xbar)^2   -- x centered for conditioning; c is the curvature.
 * The residual hump is a genuine second-order term: the quadratic coefficient c is measured, and the
 * quadratic RMS residual is compared against the linear RMS to quantify how much of the residual it
 * absorbs.
 *
 * THE CONTROL (freeze the running log-factor L = log T0(N))
 * -------------------------------------------------------
 * To isolate the source of the curvature, the whole knee sweep is re-run with L held FROZEN at its
 * baseline-knee value L(N*_1) (so E_coll = C_C sqrt(L_frozen / N) is a clean power in N, E_flow uses the
 * frozen L in its numerator), and the quadratic is refit. Comparing the frozen curvature to the running
 * curvature separates the log-factor-running contribution from the intrinsic single-axis knee-locus
 * curvature.
 *
 * THE FINDING (measurement / cross-validation only)
 * ------------------------------------------------
 *   (F0) THE RESIDUAL HUMP IS A CLEAN QUADRATIC. Fitting y = a + b(x - xbar) + c(x - xbar)^2 drives the
 *        RMS residual from ~1.59e-3 (linear) to ~8.0e-5 decades -- a ~20x reduction, R2 ~ 0.99999998 --
 *        with a NEGATIVE curvature coefficient c ~ -1.79e-2 per (decade E_trunc)^2 (the residual is a
 *        downward hump: negative at the floor extremes, positive in the interior, as imp-124814 read
 *        off). The second-order floor-elasticity is a real, well-defined single number.
 *   (F1) DISTINCT FROM THE imp-97720 AMPLITUDE HESSIAN. The imp-97720 Hessian is d2(ln sigma)/(du_i du_j)
 *        at FIXED N in the three log-amplitude axes -- ZEROTH order in N-derivatives, degree-0
 *        homogeneous / doubly-centered (row + column sums = 0, the second-order DIAG3), with order-0.1
 *        POSITIVE off-diagonals (H_ce = sigma * E_trunc/E_N ~ +8.1e-2/+2.5e-1/+9.0e-2 at L2/L3/L4). The
 *        knee floor-elasticity curvature lives in a DIFFERENT derivative space: it is the second
 *        derivative of the knee ABSCISSA log10 N*(log10 E_trunc), where the knee is defined by a
 *        THIRD-order-in-N condition (c(d) = d2p/d(log10 N)^2 = 0, p = -d ln sigma/d ln N). It couples an
 *        amplitude derivative to N-derivatives of the ramp SHAPE, exactly what the fixed-N Hessian holds
 *        constant; its sign is NEGATIVE and its magnitude ~ -1.8e-2 neither matches nor is derivable
 *        from any Hessian entry. The imp-97720 homogeneity protects only the DIAGONAL (all-amplitude)
 *        move; single-axis E_trunc floor scaling is unprotected and is what carries both the ~ -2.106
 *        slope and its curvature.
 *   (F2) THE CURVATURE IS MOSTLY INTRINSIC, NOT LOG-RUNNING. Freezing the running log-factor L pulls the
 *        slope toward the clean dimensional -2 (b0 ~ -2.106 -> ~ -2.018) but reduces the curvature by
 *        only ~1/3 (c ~ -1.79e-2 -> ~ -1.18e-2, a factor ~1.52). So the residual hump is NOT primarily a
 *        log-factor-running artifact; it is mostly the intrinsic single-axis response of the
 *        exponent-curvature knee locus to the E_coll ~ E_trunc balance -- a distinct locator-specific
 *        effect, not a shadow of the amplitude Hessian.
 *
 * VERDICT: the imp-124814 residual hump fits a single quadratic curvature term c ~ -1.79e-2 per
 * (decade E_trunc)^2 (RMS ~20x below the linear fit). It is a DISTINCT locator-specific second-order
 * effect -- the curvature of the third-order-in-N knee abscissa along the single E_trunc axis -- NOT a
 * manifestation of the imp-97720 fixed-N amplitude Hessian, which is degree-0 homogeneous, doubly
 * centered, positive-off-diagonal and lives in a different derivative space; the freeze control confirms
 * the curvature survives (only ~1/3 removed) when the running log-factor is frozen.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486, the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F
 * prefactor are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro (the fresh locator + residual hump, unfit there)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the OLS certification p_knee ~ -2.106)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee fit p_knee ~ -2.099)
 * @see imp-97720-diag3-second-order-hessian (the fixed-N second-order amplitude Hessian compared against)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP97720_DIAG3_SECOND_ORDER_HESSIAN } from './imp-97720-diag3-second-order-hessian.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582/imp-33708/imp-124814 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97822/imp-33708/imp-124814 exactly
const LN10 = Math.LN10;

// EXACT imp-124814/imp-97822 sub-terms; E_trunc is the swept floor, freezeL optionally pins log T0.
function sigmaWith(N, E_trunc, freezeL) {
  const T0 = effectiveHeightForN(N);
  const L = Number.isFinite(freezeL) ? freezeL : Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_trunc + E_flow + E_coll);
}

// pointwise ramp local exponent p(d) = -d ln sigma/d ln N at log10 N = d (central diff of step h).
function pPointwise(d, h, E_trunc, freezeL) {
  const sp = Math.log(sigmaWith(Math.pow(10, d + h), E_trunc, freezeL));
  const sm = Math.log(sigmaWith(Math.pow(10, d - h), E_trunc, freezeL));
  return -(sp - sm) / ((2 * h) * LN10);
}

// imp-124814 fresh exponent-curvature knee: single zero-crossing of c(d) = d2p/d(log10 N)^2.
function expCurvatureKnee(E_trunc, freezeL) {
  let prev = null;
  const crossings = [];
  for (let d = SCAN_LO; d <= SCAN_HI + 1e-9; d += A_STEP) {
    const c =
      (pPointwise(d + A_DD, A_H, E_trunc, freezeL) - 2 * pPointwise(d, A_H, E_trunc, freezeL) + pPointwise(d - A_DD, A_H, E_trunc, freezeL)) /
      (A_DD * A_DD);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

// imp-124814 grid (byte-for-byte): the residual must be a property of the model, not of a reused array.
const SCAN_LO = 7.0;
const SCAN_HI = 13.0;
const A_STEP = 0.0025;
const A_H = 1.5e-4;
const A_DD = 1.2e-3;
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

function knees(freezeL) {
  return FLOOR_FACTORS.map((f) => {
    const E_trunc = E_TRUNC_BASE * f;
    const cr = expCurvatureKnee(E_trunc, freezeL);
    return { floorFactor: f, E_trunc, numCrossings: cr.length, log10Nstar: cr.length === 1 ? cr[0] : null };
  });
}

// LINEAR OLS of y = log10 N* on x = log10 E_trunc; returns slope, R2, RMS residual and the per-floor residuals.
function olsLinear(rows) {
  const xs = rows.map((r) => Math.log10(r.E_trunc));
  const ys = rows.map((r) => r.log10Nstar);
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
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const resid = ys[i] - (slope * xs[i] + intercept);
    residuals.push({ floorFactor: rows[i].floorFactor, residualDecades: +resid.toExponential(4) });
    ssRes += resid * resid;
  }
  return {
    slope: +slope.toFixed(6),
    r2: +(1 - ssRes / syy).toFixed(9),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    residuals,
  };
}

// QUADRATIC OLS of y on centered x: y = a + b(x - xbar) + c(x - xbar)^2 (normal equations, 3x3 solve).
function olsQuadratic(rows) {
  const xraw = rows.map((r) => Math.log10(r.E_trunc));
  const xbar = xraw.reduce((a, b) => a + b, 0) / xraw.length;
  const xs = xraw.map((x) => x - xbar);
  const ys = rows.map((r) => r.log10Nstar);
  const n = xs.length;
  let s0 = n;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    s1 += x;
    s2 += x * x;
    s3 += x * x * x;
    s4 += x * x * x * x;
    t0 += y;
    t1 += x * y;
    t2 += x * x * y;
  }
  const M = [
    [s0, s1, s2],
    [s1, s2, s3],
    [s2, s3, s4],
  ];
  const V = [t0, t1, t2];
  for (let i = 0; i < 3; i++) {
    const piv = M[i][i];
    for (let k = i + 1; k < 3; k++) {
      const fr = M[k][i] / piv;
      for (let j = i; j < 3; j++) M[k][j] -= fr * M[i][j];
      V[k] -= fr * V[i];
    }
  }
  const sol = [0, 0, 0];
  for (let i = 2; i >= 0; i--) {
    let acc = V[i];
    for (let j = i + 1; j < 3; j++) acc -= M[i][j] * sol[j];
    sol[i] = acc / M[i][i];
  }
  const [a, b, c] = sol;
  const my = ys.reduce((p, q) => p + q, 0) / n;
  let ssRes = 0;
  let maxAbs = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const resid = ys[i] - (a + b * xs[i] + c * xs[i] * xs[i]);
    ssRes += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
    syy += (ys[i] - my) ** 2;
  }
  return {
    xbar: +xbar.toFixed(5),
    linearTerm: +b.toFixed(6),
    curvatureCoeff: +c.toExponential(5), // c: curvature per (decade E_trunc)^2
    r2: +(1 - ssRes / syy).toFixed(10),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    maxAbsResidualDecades: +maxAbs.toExponential(4),
  };
}

// RUNNING-L sweep (the imp-124814 baseline): knees, linear and quadratic fits.
const SWEEP = knees(NaN);
const LIN = olsLinear(SWEEP);
const QUAD = olsQuadratic(SWEEP);

// FREEZE control: pin L = log T0 at the factor-1.0 knee abscissa, re-locate the knees, refit the curvature.
const N1 = Math.pow(10, SWEEP.find((r) => r.floorFactor === 1.0).log10Nstar);
const L_FROZEN = Math.log(effectiveHeightForN(N1));
const SWEEP_FROZEN = knees(L_FROZEN);
const LIN_FROZEN = olsLinear(SWEEP_FROZEN);
const QUAD_FROZEN = olsQuadratic(SWEEP_FROZEN);

const RMS_DROP_LIN_TO_QUAD = +(LIN.rmsResidualDecades / QUAD.rmsResidualDecades).toFixed(2); // ~20x
const CURVATURE_RUNNING_OVER_FROZEN = +(QUAD.curvatureCoeff / QUAD_FROZEN.curvatureCoeff).toFixed(3); // ~1.52

// imp-97720 fixed-N Hessian off-diagonal H_ce (= sigma * E_trunc/E_N) at the three landmarks, for contrast.
const IMP97720_HCE = IMP97720_DIAG3_SECOND_ORDER_HESSIAN.perLandmark.map((r) => ({
  landmark: r.key,
  Hoff_CC_ET: r.Hoff_CC_ET,
}));

export const IMP124832_KNEE_FLOOR_ELASTICITY_CURVATURE_QUADRATIC_FIT = {
  id: 'imp-124832',
  proofSection: 'S-frontier',
  question:
    'imp-124814 reproduced the knee floor-elasticity p_knee ~ -2.106 from a fresh exponent-curvature ' +
    'locator and noted the OLS residuals of log10 N* on log10 E_trunc form a shallow sign-symmetric ' +
    'hump (negative at the 0.5x/5x floor extremes, positive interior) called "a genuine feature" but ' +
    'never fit. FIT that residual to a quadratic-in-log10(E_trunc) curvature term, extract the ' +
    'curvature coefficient, and ASSESS whether the second-order floor-elasticity is a manifestation of ' +
    'the imp-97720 fixed-N second-order (Hessian) structure or a distinct locator-specific effect. ' +
    'Measurement/cross-validation only; C_mb GUE-conditional per imp-486 untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the quadratic curvature coefficient c of log10 N* = a + b(x - xbar) + c(x - xbar)^2 in ' +
    'x = log10 E_trunc over the imp-33708 floor ladder {0.5..5}, its RMS-residual reduction vs the ' +
    'linear fit, a freeze-the-running-log-factor control, and a comparison against the imp-97720 ' +
    'fixed-N amplitude Hessian off-diagonal H_ce',
  sweep: SWEEP.map((r) => ({
    floorFactor: r.floorFactor,
    E_trunc: +r.E_trunc.toExponential(3),
    log10Nstar: r.log10Nstar !== null ? +r.log10Nstar.toFixed(5) : null,
    numCrossings: r.numCrossings,
  })),
  linearFit: LIN,
  quadraticFit: QUAD,
  curvatureCoeff: QUAD.curvatureCoeff, // ~ -1.79e-2 per (decade E_trunc)^2
  rmsDropLinearToQuad: RMS_DROP_LIN_TO_QUAD, // ~20x
  freezeControl: {
    N1: +N1.toExponential(4),
    L_frozen: +L_FROZEN.toFixed(6),
    frozenLinearSlope: LIN_FROZEN.slope, // ~ -2.018 (toward the clean dimensional -2)
    frozenCurvatureCoeff: QUAD_FROZEN.curvatureCoeff, // ~ -1.18e-2
    curvatureRunningOverFrozen: CURVATURE_RUNNING_OVER_FROZEN, // ~1.52 (only ~1/3 removed)
    note:
      'freezing the running log-factor L pulls the slope toward the clean dimensional -2 but removes ' +
      'only ~1/3 of the curvature -- the residual hump is mostly the intrinsic single-axis knee-locus ' +
      'response, not a log-running artifact',
  },
  imp97720Comparison: {
    imp97720_Hce_offdiagonal: IMP97720_HCE, // fixed-N amplitude Hessian off-diagonal, +0.08..+0.25
    knee_curvature_coeff: QUAD.curvatureCoeff, // knee-abscissa curvature, ~ -0.018
    note:
      'the imp-97720 Hessian is d2(ln sigma)/(du_i du_j) at FIXED N (zeroth order in N-derivatives), ' +
      'degree-0 homogeneous / doubly-centered, with order-0.1 POSITIVE off-diagonals; the knee ' +
      'floor-elasticity curvature is the second derivative of the THIRD-order-in-N knee abscissa along ' +
      'the single E_trunc axis, NEGATIVE and ~ -0.018 -- a different derivative space, sign and ' +
      'magnitude, not derivable from any Hessian entry',
  },
  finding: {
    F0_residual_hump_is_a_clean_quadratic:
      'fitting log10 N* = a + b(x - xbar) + c(x - xbar)^2 drives the RMS residual from ~1.59e-3 ' +
      '(linear) to ~8.0e-5 decades (~' + RMS_DROP_LIN_TO_QUAD + 'x, R2 ~ 0.99999998) with a NEGATIVE ' +
      'curvature coefficient c ~ ' + QUAD.curvatureCoeff + ' per (decade E_trunc)^2: the residual is a ' +
      'downward hump (negative at the floor extremes, positive interior) captured by one quadratic term.',
    F1_distinct_from_imp97720_amplitude_hessian:
      'the imp-97720 Hessian is d2(ln sigma)/(du_i du_j) at FIXED N in the three log-amplitude axes -- ' +
      'ZEROTH order in N-derivatives, degree-0 homogeneous / doubly-centered (row + column sums = 0, ' +
      'the second-order DIAG3), with order-0.1 POSITIVE off-diagonals (H_ce ~ +8.1e-2/+2.5e-1/+9.0e-2 ' +
      'at L2/L3/L4). The knee floor-elasticity curvature is the second derivative of the knee ABSCISSA ' +
      'log10 N*(log10 E_trunc), where the knee is a THIRD-order-in-N condition; it couples an amplitude ' +
      'derivative to N-derivatives of the ramp shape (which the fixed-N Hessian holds constant), is ' +
      'NEGATIVE and ~ -1.8e-2, and is not derivable from any Hessian entry. The homogeneity protects ' +
      'only the DIAGONAL all-amplitude move; single-axis E_trunc scaling carries both the -2.106 slope ' +
      'and its curvature -- a distinct locator-specific effect.',
    F2_curvature_mostly_intrinsic_not_log_running:
      'freezing the running log-factor L pulls the slope toward the clean dimensional -2 ' +
      '(b0 ~ -2.106 -> ~ -2.018) but reduces the curvature by only ~1/3 (c ~ -1.79e-2 -> ~ -1.18e-2, ' +
      'factor ~' + CURVATURE_RUNNING_OVER_FROZEN + '): the residual hump is mostly the intrinsic ' +
      'single-axis knee-locus response to the E_coll ~ E_trunc balance, not a log-factor-running ' +
      'artifact -- reinforcing that it is a distinct locator-specific second-order effect.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124814 residual hump fits a single ' +
    'quadratic-in-log10(E_trunc) curvature term c ~ ' + QUAD.curvatureCoeff + ' per (decade E_trunc)^2, ' +
    'dropping the RMS residual ~' + RMS_DROP_LIN_TO_QUAD + 'x below the linear fit (R2 ~ 0.99999998); ' +
    'the residual is a downward hump (negative at the 0.5x/5x extremes, positive interior). This ' +
    'second-order floor-elasticity is a DISTINCT locator-specific effect -- the curvature of the ' +
    'third-order-in-N knee abscissa along the single E_trunc axis -- NOT a manifestation of the ' +
    'imp-97720 fixed-N amplitude Hessian, which is degree-0 homogeneous, doubly centered, ' +
    'positive-off-diagonal (H_ce ~ +0.08..+0.25) and lives in a different derivative space (zeroth ' +
    'order in N-derivatives). A freeze-the-running-log-factor control confirms the curvature is mostly ' +
    'intrinsic: freezing L pulls the slope toward the clean dimensional -2 (-2.106 -> -2.018) but ' +
    'removes only ~1/3 of the curvature (factor ~' + CURVATURE_RUNNING_OVER_FROZEN + '). Conditional-share ' +
    'diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486, the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F ' +
    'prefactor are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124814 (fresh exponent-curvature locator + residual hump, unfit there); imp-124772 (OLS ' +
    'certification p_knee ~ -2.106); imp-97822 (two-floor knee fit p_knee ~ -2.099); imp-97720 (fixed-N ' +
    'second-order amplitude Hessian compared against); imp-33708 (0.5x..5x E_trunc floor ladder); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124832_KNEE_FLOOR_ELASTICITY_CURVATURE_QUADRATIC_FIT_ASSERTIONS = [
  {
    // Locator gate: the fresh knees resolve all ten floors and reproduce the imp-124814 linear slope.
    id: 'imp124832-knees-resolve-and-reproduce-imp124814-slope',
    description: 'all ten fresh knees resolve to a single crossing and the linear slope reproduces imp-124814 ~ -2.106',
    holds: () =>
      SWEEP.length === 10 &&
      SWEEP.every((r) => r.numCrossings === 1 && r.log10Nstar !== null) &&
      Math.abs(LIN.slope + 2.106) < 5e-3,
  },
  {
    // F0: the quadratic curvature coefficient is a well-defined NEGATIVE number (downward hump).
    id: 'imp124832-curvature-coefficient-negative-order-1e-2',
    description: 'the quadratic curvature coefficient c is negative and of order 1e-2 per (decade E_trunc)^2',
    holds: () => QUAD.curvatureCoeff < 0 && Math.abs(QUAD.curvatureCoeff) > 5e-3 && Math.abs(QUAD.curvatureCoeff) < 5e-2,
  },
  {
    // F0: the quadratic term absorbs the residual hump -- large RMS reduction, near-perfect R2.
    id: 'imp124832-quadratic-absorbs-residual-hump',
    description: 'the quadratic RMS residual is >= 5x below the linear RMS and R2 > 0.9999999',
    holds: () => RMS_DROP_LIN_TO_QUAD >= 5 && QUAD.r2 > 0.9999999,
  },
  {
    // F0: the linear residual is the sign-symmetric hump imp-124814 read off (negative extremes, positive interior).
    id: 'imp124832-linear-residual-is-sign-symmetric-hump',
    description: 'the linear residuals are negative at both floor extremes and positive in the interior',
    holds: () => {
      const first = LIN.residuals[0].residualDecades;
      const last = LIN.residuals[LIN.residuals.length - 1].residualDecades;
      const mid = LIN.residuals[Math.floor(LIN.residuals.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    // F1: the knee curvature is a DIFFERENT object from the imp-97720 Hessian -- opposite sign and much smaller.
    id: 'imp124832-distinct-from-imp97720-hessian',
    description: 'the knee curvature is negative while every imp-97720 H_ce off-diagonal is positive and order 0.1',
    holds: () =>
      QUAD.curvatureCoeff < 0 &&
      IMP97720_HCE.every((r) => r.Hoff_CC_ET > 0) &&
      IMP97720_HCE.every((r) => Math.abs(r.Hoff_CC_ET) > Math.abs(QUAD.curvatureCoeff)),
  },
  {
    // F2: freezing the running log-factor removes only part of the curvature (curvature is mostly intrinsic).
    id: 'imp124832-freeze-control-curvature-mostly-intrinsic',
    description: 'freezing L keeps the same-sign curvature and the running/frozen ratio is between 1 and 3',
    holds: () =>
      QUAD_FROZEN.curvatureCoeff < 0 &&
      CURVATURE_RUNNING_OVER_FROZEN > 1 &&
      CURVATURE_RUNNING_OVER_FROZEN < 3 &&
      LIN_FROZEN.slope > LIN.slope, // frozen slope moves toward -2 (less negative)
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124832-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124832_KNEE_FLOOR_ELASTICITY_CURVATURE_QUADRATIC_FIT.isRigorous === false &&
      /NO QED/.test(IMP124832_KNEE_FLOOR_ELASTICITY_CURVATURE_QUADRATIC_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP124832_KNEE_FLOOR_ELASTICITY_CURVATURE_QUADRATIC_FIT.verdict),
  },
];

for (const a of IMP124832_KNEE_FLOOR_ELASTICITY_CURVATURE_QUADRATIC_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124832-knee-floor-elasticity-curvature-quadratic-fit assertion failed: ${a.id}`);
  }
}
