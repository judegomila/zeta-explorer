/**
 * imp-373: Kernel-hack analytical Lambda at matched N for direct comparison
 *
 * PURPOSE
 * -------
 * The kernel-hack analytical estimate from spectral-lambda-kernel.js gives
 * Lambda ~ 10^{-10} at Platt scale (N ~ 3*10^{11}).  This file re-evaluates
 * the same formula at the imp-360 N values so its predictions sit beside the
 * OLS-projected t_c column from PATH_C_BASELINE_FIT_V2 in a single table.
 *
 * Formula recap (from spectral-lambda-kernel.js analyticalLambdaBound)
 * --------------------------------------------------------------------
 * For N zeros at height T:
 *   mean_spacing  = 2*pi / log(T / (2*pi))
 *   min_norm_s    = N^{-1/3} * 1.5          (GUE level-repulsion scaling)
 *   s0            = min_norm_s * mean_spacing
 *   Lambda_analyt = s0^2 / 4
 *
 * Height T at each N is obtained from the Riemann--von Mangoldt inverse
 * via effectiveHeightForN (lambda-rh-height-mapping.js).
 *
 * Expected behaviour
 * ------------------
 * At small N (50..870) the analytical and OLS values are within 1--3x of each
 * other: GUE spacing gives a first-order estimate that is the right order of
 * magnitude for finite collision times.  At large N (1e4..1e6) the analytical
 * formula predicts Lambda -> 0 much faster than the OLS intercept (which
 * saturates at a ~ 0.0066), so rate_ratio = analytical / ols_tc decreases
 * monotonically.  A rate_ratio >> 1 at any N >= 870 would indicate a bug in
 * one of the two pipelines (the analytical value would be claiming a
 * collision time LARGER than the measured ODE trajectory, which is impossible).
 *
 * Build-time assertions exported below enforce:
 *   (1) analytical_lambda(870) < ols_projected_tc(870)
 *       (empirically the crossover happens around N = 200-300; above that
 *        the GUE spacing formula predicts smaller Lambda than the OLS fit)
 *   (2) rate_ratio is monotonically non-increasing from N=870 to N=1e6
 *   (3) all analytical values are positive and finite
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';

// ── Analytical Lambda formula ─────────────────────────────────────────────────
// Re-implemented inline from spectral-lambda-kernel.js so this file has
// no circular dependency on the math directory.
function analyticalLambdaAtNT(N, T) {
  const twoPi = 2 * Math.PI;
  const meanSpacing = twoPi / Math.log(T / twoPi);
  const minNormSpacing = Math.pow(N, -1 / 3) * 1.5;
  const s0 = minNormSpacing * meanSpacing;
  return (s0 * s0) / 4;
}

// ── OLS fit from imp-400 ──────────────────────────────────────────────────────
const V2_FIT = PATH_C_BASELINE_FIT_V2.fit;
const OLS_A = V2_FIT !== null ? V2_FIT.intercept_a : 0.0066;  // fallback = old baseline
const OLS_B = V2_FIT !== null ? V2_FIT.slope_b    : 4.91;

function olsProjectedTc(N) {
  return OLS_A + OLS_B / N;
}

// ── imp-360 N values: measured rows + projected rows ─────────────────────────
// Measured:  {50, 100, 200, 500, 870}  (from ZEROS_EXTENDED)
// Projected: {1e4, 1e5, 1e6}           (from PT_SCALE_EXTRAPOLATION)
const IMP360_N_VALUES = [50, 100, 200, 500, 870, 1e4, 1e5, 1e6];

// ── Per-row computation ───────────────────────────────────────────────────────
const ROWS = IMP360_N_VALUES.map((N) => {
  const T = effectiveHeightForN(N);
  const analyticalLambda = analyticalLambdaAtNT(N, T);
  const olsTc = olsProjectedTc(N);
  // rate_ratio < 1 means analytical predicts smaller Lambda (expected at large N)
  // rate_ratio > 1 means analytical predicts larger value (expected only at very small N)
  const rateRatio = olsTc > 0 ? analyticalLambda / olsTc : null;
  return {
    N,
    T_star: +T.toExponential(4),
    analytical_lambda: analyticalLambda,
    ols_projected_tc: olsTc,
    rate_ratio: rateRatio,
    source: N <= 870 ? 'measured-range' : 'projected-range',
  };
});

export const KERNEL_HACK_AT_IMP360 = {
  id: 'imp-373',
  title: 'Kernel-hack analytical Lambda at matched N for direct comparison',
  formula: 'Lambda_analyt = (N^{-1/3} * 1.5 * 2*pi / log(T / (2*pi)))^2 / 4',
  olsFitSource: 'PATH_C_BASELINE_FIT_V2 (imp-400)',
  heightSource: 'effectiveHeightForN (lambda-rh-height-mapping.js, Riemann-von Mangoldt inverse)',
  rows: ROWS,
  summary: {
    nValues: IMP360_N_VALUES,
    smallNAgreement:
      'At N = 50-870 the analytical Lambda and OLS-projected t_c are within 1-3x ' +
      '(order-of-magnitude agreement confirming the GUE spacing heuristic is ' +
      'reasonable at finite N).',
    largeNDivergence:
      'At N = 1e4-1e6 the analytical formula predicts Lambda << OLS intercept: ' +
      'the GUE min-spacing formula drives Lambda to 0 faster than the 1/N OLS ' +
      'fit saturates at the intercept a. This is expected and not a disagreement.',
    bugCondition:
      'A rate_ratio >> 1 at N >= 870 would indicate the analytical formula ' +
      'predicts a collision time LARGER than the measured ODE trajectory, which ' +
      'is impossible and would be a bug in one of the two pipelines.',
  },
};

// ── Build-time assertions ─────────────────────────────────────────────────────
const ROW_870  = ROWS.find((r) => r.N === 870);
const ROW_1E4  = ROWS.find((r) => r.N === 1e4);
const ROW_1E5  = ROWS.find((r) => r.N === 1e5);
const ROW_1E6  = ROWS.find((r) => r.N === 1e6);

export const KERNEL_HACK_AT_IMP360_ASSERTIONS = [
  {
    id: 'analytical-positive-finite',
    holds: () => ROWS.every(
      (r) => Number.isFinite(r.analytical_lambda) && r.analytical_lambda > 0,
    ),
    why:
      'Every analytical Lambda value must be a positive finite number. A zero ' +
      'or NaN would indicate a degenerate height (T too small) or N = 0.',
  },
  {
    id: 'analytical-below-ols-at-N870',
    holds: () =>
      ROW_870 !== undefined &&
      ROW_870.analytical_lambda < ROW_870.ols_projected_tc,
    why:
      'By N = 870 the GUE spacing heuristic predicts a smaller collision time ' +
      'than the OLS fit. If the analytical value is larger here, the GUE ' +
      'scaling constant 1.5 is over-estimated or the mean-spacing formula has ' +
      'diverged from the actual zero density at this height.',
  },
  {
    id: 'rate-ratio-declines-870-to-1e4',
    holds: () =>
      ROW_870 !== undefined &&
      ROW_1E4 !== undefined &&
      ROW_870.rate_ratio !== null &&
      ROW_1E4.rate_ratio !== null &&
      ROW_1E4.rate_ratio <= ROW_870.rate_ratio,
    why:
      'The rate_ratio analytical/ols should decrease as N grows: the GUE ' +
      'formula decays as N^{-2/3} while the OLS saturates at the intercept.',
  },
  {
    id: 'rate-ratio-declines-1e4-to-1e6',
    holds: () =>
      ROW_1E4 !== undefined &&
      ROW_1E5 !== undefined &&
      ROW_1E6 !== undefined &&
      ROW_1E4.rate_ratio !== null &&
      ROW_1E5.rate_ratio !== null &&
      ROW_1E6.rate_ratio !== null &&
      ROW_1E5.rate_ratio <= ROW_1E4.rate_ratio &&
      ROW_1E6.rate_ratio <= ROW_1E5.rate_ratio,
    why:
      'Monotone decay of rate_ratio across the projected range confirms the ' +
      'analytical formula and OLS are in qualitative agreement on direction: ' +
      'both predict Lambda -> 0 as N grows, with analytical decaying faster.',
  },
];
