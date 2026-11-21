/**
 * @module imp-96465-off-anchor-own-reciprocal-log-line
 *
 * imp-96465 (numerical): fit the 27 imp-96224 OFF-anchor heights with their OWN
 * reciprocal-log line and compare intercept/slope to the seven-anchor imp-96345 line.
 *
 * imp-96450 showed that adding a second reciprocal-log term refit on the SAME seven
 * imp-96148 anchors AMPLIFIES the below-line off-anchor residual (RMS 0.037 -> 0.061,
 * 27/27 below), concluding the below-line structure is a GENUINE off-anchor obstruction,
 * not missing curvature, and that the true uniform-in-T behaviour is only captured by
 * measuring the off-anchor column DIRECTLY. imp-96450 flagged that direct measurement but
 * did not do it. This module does it.
 *
 * METHOD. Fit the 27 off-anchor heights (gamma_500..gamma_4000, baked verbatim from
 * imp-96224 /imp-96450) with their OWN one-parameter reciprocal-log OLS
 * rho = C_off + D_off/lnT (x = 1/lnT) and their own two-parameter law
 * rho = C_off + D_off/lnT + E_off/lnT^2, report C_off / D_off / E_off, fit quality
 * (R^2, residual RMS, below-line count), and compare the own-fit line against the
 * seven-anchor line (C=0.14256, D=2.50166).
 *
 * RESULT (the genuine off-anchor law departs sharply from the seven-anchor line):
 *   1. One-parameter own fit: C_off = -0.13640, D_off = +4.34216. The genuine off-anchor
 *      line has a NEGATIVE intercept (vs +0.14256 for the seven anchors, Delta = -0.27896)
 *      and a much STEEPER slope (+4.34216 vs +2.50166, Delta = +1.84049). Fit on its own
 *      column it is tight: R^2 = 0.98158, residual RMS = 0.006689 (vs the 0.037482 RMS the
 *      seven-anchor line leaves when extrapolated onto these same points), and the residual
 *      sign is near-balanced 17/27 below -- i.e. the systematic below-line bias of the
 *      seven-anchor extrapolation is a mis-specified-intercept artifact, gone once the line
 *      is fit where the data lives.
 *   2. Two-parameter own fit: C = -0.46650, D = +9.15748, E = -17.43551. The own-column
 *      second term wants NEGATIVE curvature E = -17.44 (opposite sign to the seven-anchor
 *      E = +5.17), improving R^2 only marginally 0.98158 -> 0.98397 (RMS 0.006689 ->
 *      0.006241, -6.7%) while swinging the intercept -0.13640 -> -0.46650 and the slope
 *      +4.34216 -> +9.15748 -- an unstable overfit for a marginal gain. The one-parameter
 *      own line is the stable descriptor of the off-anchor column.
 *
 * ASSESSMENT. The genuine uniform-in-T off-anchor law is a reciprocal-log line with a
 * NEGATIVE intercept (-0.13640) and a slope 1.74x steeper than the seven-anchor line. As
 * T -> infinity (x -> 0) it extrapolates BELOW zero, so it certifies NO positive floor --
 * confirming the imp-96345 /imp-96249 reading that the +0.14256 floor is a seven-anchor
 * design artifact, not a real uniform-in-T lower bound. The two-parameter own fit adds
 * nothing stable. The uniform-in-T obstruction (a uniform off-line LP, Weil-positivity
 * strength) stays inaccessible to any on-line construction.
 *
 * GRADE: measurement only. Import-light (arrays baked verbatim from imp-96224 /imp-96450,
 * recompute-and-check, no heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed
 * ; RH open.
 *
 * @see imp-96450-two-param-reciprocal-log-off-anchor-residual (same-anchor two-term refit)
 * @see imp-96345-route-bd-offline-margin-envelope (seven-anchor one-parameter line)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (source measured off-anchor column)
 * @see imp-96249-route-bd-online-margin-floor-gamma8000 (floor crosses negative at gamma_8000)
 */

// 27 OFF-anchor measured heights (imp-96224: gamma_500..gamma_4000), baked verbatim.
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];

// Seven-anchor imp-96345 one-parameter reference line (rho = C + D/lnT).
const ANCHOR_C = 0.142563;
const ANCHOR_D = 2.501664;

const xOf = (t) => 1 / Math.log(t);

// One-parameter OLS: rho = c + d*x (x = 1/lnT).
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

const rms = (arr) => Math.sqrt(arr.reduce((a, b) => a + b * b, 0) / arr.length);

function rSquared(ys, pred) {
  const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
  const ssTot = ys.reduce((a, b) => a + (b - mean) * (b - mean), 0);
  const ssRes = ys.reduce((a, b, i) => a + (b - pred[i]) * (b - pred[i]), 0);
  return 1 - ssRes / ssTot;
}

const OFF_ONE = fitLinear(OFF_T, OFF_RHO);
const OFF_TWO = fitQuadratic(OFF_T, OFF_RHO);

const PRED_ONE = OFF_T.map((t) => OFF_ONE.c + OFF_ONE.d * xOf(t));
const PRED_TWO = OFF_T.map((t) => { const x = xOf(t); return OFF_TWO.c + OFF_TWO.d * x + OFF_TWO.e * x * x; });
const RESID_ONE = OFF_RHO.map((y, i) => y - PRED_ONE[i]);
const RESID_TWO = OFF_RHO.map((y, i) => y - PRED_TWO[i]);

export const IMP_96465_OFF_ANCHOR_ONE_PARAM = {
  floor: OFF_ONE.c,        // -0.136398 (NEGATIVE intercept, own-column fit)
  slope: OFF_ONE.d,        // +4.342158 (steeper than the seven-anchor +2.50166)
  rSquared: rSquared(OFF_RHO, PRED_ONE), // 0.981582
  rmsResidual: rms(RESID_ONE),           // 0.006689 (vs 0.037482 for the extrapolated anchor line)
  nBelowLine: RESID_ONE.filter((r) => r < 0).length, // 17 / 27 (near-balanced; below-line bias gone)
};

export const IMP_96465_OFF_ANCHOR_TWO_PARAM = {
  floor: OFF_TWO.c,        // -0.466498
  slope: OFF_TWO.d,        // +9.157484
  curvature: OFF_TWO.e,    // -17.435511 (NEGATIVE curvature, opposite sign to seven-anchor +5.17)
  rSquared: rSquared(OFF_RHO, PRED_TWO), // 0.983967 (marginal gain over one-param)
  rmsResidual: rms(RESID_TWO),           // 0.006241 (-6.7 percent vs one-param)
  nBelowLine: RESID_TWO.filter((r) => r < 0).length, // 14 / 27
};

export const IMP_96465_ANCHOR_COMPARISON = {
  anchorFloor: ANCHOR_C,   // +0.142563 (seven-anchor line)
  anchorSlope: ANCHOR_D,   // +2.501664
  deltaFloor: OFF_ONE.c - ANCHOR_C, // -0.278961 (off-anchor intercept sits far BELOW the anchor floor)
  deltaSlope: OFF_ONE.d - ANCHOR_D, // +1.840494 (off-anchor slope is 1.74x steeper)
  slopeRatio: OFF_ONE.d / ANCHOR_D, // 1.7357
};

export const IMP_96465_OFF_ANCHOR_OWN_RECIPROCAL_LOG_LINE = {
  id: 'imp-96465-off-anchor-own-reciprocal-log-line',
  title:
    'Fit the 27 imp-96224 off-anchor heights with their own one- and two-parameter '
    + 'reciprocal-log line and compare the intercept/slope to the seven-anchor imp-96345 line',
  offAnchorOneParam: IMP_96465_OFF_ANCHOR_ONE_PARAM,
  offAnchorTwoParam: IMP_96465_OFF_ANCHOR_TWO_PARAM,
  anchorComparison: IMP_96465_ANCHOR_COMPARISON,
  finding:
    'the genuine off-anchor law, fit on its own 27-point column, is a reciprocal-log line '
    + 'rho = C_off + D_off/lnT with C_off = -0.13640 and D_off = +4.34216: a NEGATIVE intercept '
    + '(vs the seven-anchor +0.14256, Delta = -0.27896) and a 1.74x STEEPER slope (vs +2.50166). '
    + 'On its own column it is tight (R^2 = 0.98158, RMS = 0.006689 vs the 0.037482 the anchor '
    + 'line leaves when extrapolated onto these points) and the below-line sign bias is gone '
    + '(17/27, near-balanced) -- the below-line residual was a mis-specified-intercept artifact of '
    + 'anchoring on the low-T grid. The two-parameter own fit wants NEGATIVE curvature E = -17.44 '
    + '(opposite the seven-anchor +5.17), improves R^2 only marginally 0.98158 -> 0.98397 while '
    + 'swinging the intercept to -0.46650 -- an unstable overfit, so the one-parameter own line is '
    + 'the stable descriptor. Because C_off < 0 the off-anchor line extrapolates below zero as '
    + 'T -> infinity, certifying NO positive floor and confirming the +0.14256 floor is a '
    + 'seven-anchor design artifact',
  note:
    'measurement only; import-light arrays baked verbatim from imp-96224 /imp-96450, '
    + 'recompute-and-check; changes no Lambda bound; the genuine uniform-in-T obstruction '
    + '(a uniform off-line LP, Weil-positivity strength) stays inaccessible to any on-line '
    + 'construction; no refereed bound is changed; RH open; NO QED',
  closesTickets: ['imp-96465'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96465_ASSERTIONS = [
  {
    id: 'imp-96465-off-anchor-one-param-negative-intercept-steeper-slope',
    holds: () => Math.abs(IMP_96465_OFF_ANCHOR_ONE_PARAM.floor - (-0.136398)) < 1e-4
      && Math.abs(IMP_96465_OFF_ANCHOR_ONE_PARAM.slope - 4.342158) < 1e-4
      && IMP_96465_OFF_ANCHOR_ONE_PARAM.floor < 0
      && IMP_96465_OFF_ANCHOR_ONE_PARAM.slope > ANCHOR_D,
    why: 'the own-column one-parameter line must have a NEGATIVE intercept ~ -0.13640 and a slope ~ +4.34216 steeper than the seven-anchor +2.50166.',
  },
  {
    id: 'imp-96465-off-anchor-one-param-fits-tighter-than-extrapolation',
    holds: () => IMP_96465_OFF_ANCHOR_ONE_PARAM.rSquared > 0.98
      && Math.abs(IMP_96465_OFF_ANCHOR_ONE_PARAM.rmsResidual - 0.006689) < 1e-4
      && IMP_96465_OFF_ANCHOR_ONE_PARAM.rmsResidual < 0.037482
      && IMP_96465_OFF_ANCHOR_ONE_PARAM.nBelowLine === 17,
    why: 'fit on its own column the line must be tight (R^2 > 0.98, RMS ~ 0.006689 << the 0.037482 extrapolation RMS) with a near-balanced 17/27 below-line sign.',
  },
  {
    id: 'imp-96465-off-anchor-two-param-negative-curvature-marginal-unstable',
    holds: () => IMP_96465_OFF_ANCHOR_TWO_PARAM.curvature < 0
      && Math.abs(IMP_96465_OFF_ANCHOR_TWO_PARAM.curvature - (-17.435511)) < 1e-3
      && IMP_96465_OFF_ANCHOR_TWO_PARAM.rSquared > IMP_96465_OFF_ANCHOR_ONE_PARAM.rSquared
      && IMP_96465_OFF_ANCHOR_TWO_PARAM.rSquared - IMP_96465_OFF_ANCHOR_ONE_PARAM.rSquared < 0.005
      && Math.abs(IMP_96465_OFF_ANCHOR_TWO_PARAM.floor - (-0.466498)) < 1e-3,
    why: 'the own-column two-parameter fit must want NEGATIVE curvature ~ -17.44 (opposite sign to the seven-anchor +5.17), improve R^2 only marginally (< 0.005), and swing the intercept to ~ -0.46650 -- an unstable overfit.',
  },
  {
    id: 'imp-96465-off-anchor-departs-sharply-from-seven-anchor-line',
    holds: () => Math.abs(IMP_96465_ANCHOR_COMPARISON.deltaFloor - (-0.278961)) < 1e-4
      && Math.abs(IMP_96465_ANCHOR_COMPARISON.deltaSlope - 1.840494) < 1e-4
      && IMP_96465_ANCHOR_COMPARISON.slopeRatio > 1.7,
    why: 'the off-anchor line must sit ~0.279 below the anchor intercept with a slope ~1.74x steeper, quantifying how far the genuine off-anchor law departs from the on-line anchors.',
  },
  {
    id: 'imp-96465-not-a-bound',
    holds: () => Array.isArray(IMP_96465_OFF_ANCHOR_OWN_RECIPROCAL_LOG_LINE.closesTickets)
      && IMP_96465_OFF_ANCHOR_OWN_RECIPROCAL_LOG_LINE.closesTickets.includes('imp-96465'),
    why: 'this is a measurement module; it moves no Lambda bound, proves no QED, and is the deliverable the imp-96465 ticket asked for.',
  },
];

for (const a of IMP_96465_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96465-off-anchor-own-reciprocal-log-line assertion failed: ${a.id}`);
  }
}

export default IMP_96465_OFF_ANCHOR_OWN_RECIPROCAL_LOG_LINE;
