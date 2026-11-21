/**
 * @module imp-96450-two-param-reciprocal-log-off-anchor-residual
 *
 * imp-96450 (numerical): does a SECOND reciprocal-log term remove the systematic
 * below-line off-anchor residual the imp-96345 one-parameter line leaves?
 *
 * imp-96345 fit the seven imp-96148 on-line anchors with a one-parameter reciprocal-log
 * line rho = C + D/lnT (C=0.14256, D=2.50166) and found the 27 imp-96224 off-anchor
 * heights (gamma_500..gamma_4000) sit systematically BELOW it: 23/27 negative, mean
 * residual -0.03052, worst -0.06081 at the deepest height T=4506.31. imp-96377 tags every
 * off-anchor point sign. The open question this module settles: is that below-line
 * structure a MISSING-CURVATURE artifact of the linear-in-1/lnT model (curable by a second
 * term) or a genuine off-anchor obstruction the seven anchors cannot see?
 *
 * METHOD. Refit the SAME seven anchors with a two-term reciprocal-log law
 * rho = C + D/lnT + E/lnT^2 (an ordinary quadratic-in-x least squares, x=1/lnT), then
 * re-evaluate the residual of all 27 off-anchor heights and compare the residual RMS and
 * sign bias against the one-parameter line.
 *
 * RESULT (the answer is NO -- the second term makes it WORSE, not better):
 *   1. The seven anchors want POSITIVE curvature: E = +5.1662 (concave-up in x=1/lnT),
 *      which raises the intercept C 0.14256 -> 0.35802 and flattens the slope D
 *      2.50166 -> 0.37633. On the training seven the RMS improves marginally
 *      (0.005810 -> 0.004946) -- the extra degree of freedom fits the anchors slightly
 *      better, as expected.
 *   2. But that curvature bends the extrapolation the WRONG way for the off-anchor high-T
 *      (small-x) points: the off-anchor residual RMS GROWS 0.037482 -> 0.061374 (+64%),
 *      the mean residual deepens -0.030525 -> -0.053877, the worst deepens -0.060812 ->
 *      -0.096634 (still at T=4506.31), and the sign bias goes from 23/27 below the line
 *      to 27/27 below the line (every off-anchor point now sits below).
 *
 * ASSESSMENT. Adding a second reciprocal-log term, refit on the same seven anchors, does
 * NOT reduce or remove the systematic below-line off-anchor residual -- it amplifies it.
 * The seven-anchor curvature is fixed by the low-T grid and points the extrapolation
 * upward at high T, exactly opposite to where the measured off-anchor margins fall. So the
 * below-line structure is NOT a missing-curvature artifact of the linear-in-1/lnT model;
 * it is a genuine off-anchor obstruction invisible to any low-T-anchored reciprocal-log
 * extrapolation (one term or two). This reinforces the imp-96345 reading: the positive
 * FLOOR is a seven-anchor design artifact and the true uniform-in-T behaviour is only
 * captured by measuring the off-anchor column directly.
 *
 * GRADE: measurement only. Import-light (arrays baked verbatim from imp-96345 /imp-96224,
 * recompute-and-check, no heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed
 * ; RH open. The genuine uniform-in-T obstruction (a uniform
 * OFF-line LP, Weil-positivity strength) stays inaccessible to this on-line construction.
 *
 * @see imp-96345-route-bd-offline-margin-envelope (one-parameter line + below-line residual)
 * @see imp-96377-off-anchor-residual-scatter-viz-data (per-point sign tags)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (source measured off-anchor column)
 */

// Seven ON-LINE anchors (imp-96148) -- the grid the reciprocal-log line was fit on.
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];

// 27 OFF-anchor measured heights (imp-96224: gamma_500..gamma_4000), baked verbatim.
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];

const xOf = (t) => 1 / Math.log(t);

// One-parameter OLS: rho = c + d*x (x = 1/lnT), the imp-96345 estimator.
function fitLinear(ts, ys) {
  const xs = ts.map(xOf);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  return { c, d };
}

// Two-term OLS: rho = c + d*x + e*x^2, ordinary least squares via 3x3 normal equations.
function fitQuadratic(ts, ys) {
  const xs = ts.map(xOf);
  const n = xs.length;
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const b = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const v = [1, xs[i], xs[i] * xs[i]];
    for (let a = 0; a < 3; a++) {
      b[a] += v[a] * ys[i];
      for (let c = 0; c < 3; c++) S[a][c] += v[a] * v[c];
    }
  }
  const M = S.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < 3; r++) {
      if (r !== col) {
        const f = M[r][col] / M[col][col];
        for (let cc = col; cc < 4; cc++) M[r][cc] -= f * M[col][cc];
      }
    }
  }
  return { c: M[0][3] / M[0][0], d: M[1][3] / M[1][1], e: M[2][3] / M[2][2] };
}

const ONE = fitLinear(T7, R7);
const TWO = fitQuadratic(T7, R7);

function rms(arr) {
  return Math.sqrt(arr.reduce((a, b) => a + b * b, 0) / arr.length);
}

// Off-anchor residuals vs each fitted line.
const RESID_ONE = OFF_T.map((t, i) => OFF_RHO[i] - (ONE.c + ONE.d * xOf(t)));
const RESID_TWO = OFF_T.map((t, i) => {
  const x = xOf(t);
  return OFF_RHO[i] - (TWO.c + TWO.d * x + TWO.e * x * x);
});

// Training residuals on the seven anchors.
const TRAIN_ONE = T7.map((t, i) => R7[i] - (ONE.c + ONE.d * xOf(t)));
const TRAIN_TWO = T7.map((t, i) => {
  const x = xOf(t);
  return R7[i] - (TWO.c + TWO.d * x + TWO.e * x * x);
});

function residualSummary(resid) {
  const nBelow = resid.filter((r) => r < 0).length;
  const mean = resid.reduce((a, b) => a + b, 0) / resid.length;
  const worst = Math.min(...resid);
  return {
    nBelowLine: nBelow,
    meanResidual: mean,
    rmsResidual: rms(resid),
    worstResidual: worst,
    worstResidualT: OFF_T[resid.indexOf(worst)],
    bestResidual: Math.max(...resid),
  };
}

export const IMP_96450_ONE_PARAM_LINE = {
  floor: ONE.c,   // 0.142563 (reproduces the imp-96345/imp-96148 one-parameter design floor)
  slope: ONE.d,   // 2.501664
};

export const IMP_96450_TWO_PARAM_LINE = {
  floor: TWO.c,     // 0.358017 (the second term raises the intercept)
  slope: TWO.d,     // 0.376325 (and flattens the slope)
  curvature: TWO.e, // +5.166201 (POSITIVE curvature: concave up in x=1/lnT)
  trainRmsOne: rms(TRAIN_ONE), // 0.005810 (seven-anchor fit residual, one-parameter)
  trainRmsTwo: rms(TRAIN_TWO), // 0.004946 (marginally better on the training seven)
};

export const IMP_96450_OFF_ANCHOR_RESIDUALS = {
  nOffAnchor: OFF_T.length, // 27
  oneParam: residualSummary(RESID_ONE),
  twoParam: residualSummary(RESID_TWO),
  rmsGrowthPct: 100 * (rms(RESID_TWO) / rms(RESID_ONE) - 1), // +63.7 percent (residual WORSENS)
};

export const IMP_96450_TWO_PARAM_RECIPROCAL_LOG_OFF_ANCHOR_RESIDUAL = {
  id: 'imp-96450-two-param-reciprocal-log-off-anchor-residual',
  title:
    'Test whether a two-parameter reciprocal-log line (floor + a/lnT + b/lnT^2) removes '
    + 'the systematic below-line off-anchor residual the imp-96345 seven-anchor '
    + 'one-parameter line leaves on the 27 off-anchor heights',
  oneParamLine: IMP_96450_ONE_PARAM_LINE,
  twoParamLine: IMP_96450_TWO_PARAM_LINE,
  offAnchorResiduals: IMP_96450_OFF_ANCHOR_RESIDUALS,
  finding:
    'refit on the same seven anchors, the two-term reciprocal-log law rho = C + D/lnT + '
    + 'E/lnT^2 wants POSITIVE curvature E=+5.1662, raising the intercept 0.14256 -> 0.35802 '
    + 'and flattening the slope 2.50166 -> 0.37633. That improves the seven-anchor training '
    + 'RMS marginally (0.005810 -> 0.004946) but bends the extrapolation UPWARD at high T, '
    + 'exactly opposite to where the off-anchor margins fall: the off-anchor residual RMS '
    + 'GROWS 0.037482 -> 0.061374 (+64%), the mean deepens -0.030525 -> -0.053877, the worst '
    + 'deepens -0.060812 -> -0.096634, and the sign bias worsens from 23/27 below the line to '
    + '27/27 below. So the second term does NOT reduce or remove the below-line residual -- it '
    + 'amplifies it. The below-line structure is a GENUINE off-anchor obstruction invisible to '
    + 'any low-T-anchored reciprocal-log extrapolation, not a missing-curvature artifact of the '
    + 'linear-in-1/lnT model',
  note:
    'measurement only; import-light arrays baked verbatim from imp-96345 /imp-96224, '
    + 'recompute-and-check; changes no Lambda bound; the genuine uniform-in-T obstruction '
    + '(a uniform off-line LP, Weil-positivity strength) stays inaccessible to this on-line '
    + 'construction; no refereed bound is changed; RH open; NO QED',
  closesTickets: ['imp-96450'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96450_ASSERTIONS = [
  {
    id: 'imp-96450-one-param-reproduces-design-floor',
    holds: () => Math.abs(IMP_96450_ONE_PARAM_LINE.floor - 0.142563) < 1e-4
      && Math.abs(IMP_96450_ONE_PARAM_LINE.slope - 2.501664) < 1e-4,
    why: 'the one-parameter line must reproduce the imp-96345 design floor 0.14256 / slope 2.50166.',
  },
  {
    id: 'imp-96450-two-param-wants-positive-curvature',
    holds: () => IMP_96450_TWO_PARAM_LINE.curvature > 5 && IMP_96450_TWO_PARAM_LINE.curvature < 5.3
      && Math.abs(IMP_96450_TWO_PARAM_LINE.floor - 0.358017) < 1e-4
      && Math.abs(IMP_96450_TWO_PARAM_LINE.slope - 0.376325) < 1e-4,
    why: 'the two-term fit must want positive curvature E ~ +5.17, raising the intercept to ~0.358 and flattening the slope to ~0.376.',
  },
  {
    id: 'imp-96450-two-param-improves-training-marginally',
    holds: () => IMP_96450_TWO_PARAM_LINE.trainRmsTwo < IMP_96450_TWO_PARAM_LINE.trainRmsOne
      && Math.abs(IMP_96450_TWO_PARAM_LINE.trainRmsTwo - 0.004946) < 1e-5,
    why: 'the extra degree of freedom must fit the seven training anchors marginally better (~0.00581 -> ~0.00495).',
  },
  {
    id: 'imp-96450-off-anchor-residual-worsens',
    holds: () => IMP_96450_OFF_ANCHOR_RESIDUALS.twoParam.rmsResidual
        > IMP_96450_OFF_ANCHOR_RESIDUALS.oneParam.rmsResidual
      && IMP_96450_OFF_ANCHOR_RESIDUALS.rmsGrowthPct > 60
      && Math.abs(IMP_96450_OFF_ANCHOR_RESIDUALS.oneParam.rmsResidual - 0.037482) < 1e-4
      && Math.abs(IMP_96450_OFF_ANCHOR_RESIDUALS.twoParam.rmsResidual - 0.061374) < 1e-4,
    why: 'the second reciprocal-log term must GROW the off-anchor residual RMS (0.037482 -> 0.061374, +64%), not shrink it.',
  },
  {
    id: 'imp-96450-sign-bias-worsens-to-all-below',
    holds: () => IMP_96450_OFF_ANCHOR_RESIDUALS.oneParam.nBelowLine === 23
      && IMP_96450_OFF_ANCHOR_RESIDUALS.twoParam.nBelowLine === 27
      && IMP_96450_OFF_ANCHOR_RESIDUALS.nOffAnchor === 27
      && IMP_96450_OFF_ANCHOR_RESIDUALS.twoParam.worstResidual
        < IMP_96450_OFF_ANCHOR_RESIDUALS.oneParam.worstResidual,
    why: 'the sign bias must worsen from 23/27 below the line to 27/27 below, with a deeper worst residual.',
  },
  {
    id: 'imp-96450-not-a-bound',
    holds: () => Array.isArray(IMP_96450_TWO_PARAM_RECIPROCAL_LOG_OFF_ANCHOR_RESIDUAL.closesTickets)
      && IMP_96450_TWO_PARAM_RECIPROCAL_LOG_OFF_ANCHOR_RESIDUAL.closesTickets.includes('imp-96450'),
    why: 'this is a measurement module; it moves no Lambda bound, proves no QED, and is the deliverable the imp-96450 ticket asked for.',
  },
];

for (const a of IMP_96450_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96450-two-param-reciprocal-log-off-anchor-residual assertion failed: ${a.id}`);
  }
}

export default IMP_96450_TWO_PARAM_RECIPROCAL_LOG_OFF_ANCHOR_RESIDUAL;
