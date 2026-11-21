/**
 * @fileoverview imp-96249 -- EXTEND the imp-96224 worst-support on-line signed-force
 * feasibility margin column rho(32,T) beyond gamma_4000 (T~4506) to gamma_8000 (T~8148)
 * and re-fit BOTH laws, to decide whether the STILL-FALLING reciprocal-log floor
 * (0.16030 -> 0.11063 -> 0.07061 -> 0.03411) settles to a positive value or reaches zero,
 * and whether the sign-reversed reciprocal-log/log-linear R2 gap keeps favouring the
 * no-floor log-linear form.
 * Import-light (literals baked, no zeros bundle); holds() assertions; self-executing.
 * Measurement only. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. imp-96148 fit the worst-support (N=32) on-line margin rho(32,T) to rho=c+d/lnT
 * over a seven-point grid stopping at T=395.98 (gamma_200) and read a positive floor
 * c=0.14256. imp-96167 extended to gamma_500 (T~811): floor RISING (0.16030). imp-96186
 * to gamma_1000 (T~1419): floor REVERSED (0.16030 -> 0.11063) and the R2 gap COLLAPSED
 * (0.02792 -> 0.00214). imp-96209 to gamma_2000 (T~2515): floor kept FALLING (0.07061) and
 * the R2 gap REVERSED SIGN (+0.00214 -> -0.01042), the log-linear (no-floor) law fitting
 * marginally better. imp-96224 to gamma_4000 (T~4506): floor kept FALLING (0.03411,
 * near-halving per doubling) with the gap WIDENING to -0.01828, concluding the floor was
 * trending toward zero. imp-96224 left the residual question this ticket answers: deepening
 * once more to gamma_8000, does the fitted floor settle at a positive value, reach zero, or
 * cross below it, and does the sign-reversed gap keep favouring the no-floor form?
 *
 * METHOD. Reproduce the imp-96020/imp-96167/imp-96186/imp-96209/imp-96224 on-line LP
 * pipeline from scratch (mpmath dps 25) and extend it:
 *   a_n(x)   = n^{-1/2} cos(theta(x) - x log n),  theta = Riemann-Siegel theta,
 *   near-collision x* = inter-zero extremum (Z prime=0) with gap/localMeanGap < 0.85,
 *   g_k      = sign(Z second (x*)) a(x*),  ghat_k = g_k / ||g_k||_2,
 *   rho(N,T) = dist(0, conv{ghat_k})   via Gilbert min-norm-point (Frank-Wolfe, 4000 iters).
 * Zeta zeros extended 4000 -> 8000 (gamma 4506.31 -> 8148.19); near-collision census grows
 * 1541 -> 3085. VALIDATION: recomputing the seven baked imp-96148 cutoffs, the nineteen
 * imp-96167/96186/96209 cutoffs AND the eight imp-96224 cutoffs reproduces all baked columns
 * to |delta| <= 0.0004. Reproduction: tmp/imp-96249-extend.py (wall ~2160s: zeros 1346s,
 * census 813s). rho(N,T) is monotone non-increasing in T (adding a near-collision enlarges
 * conv{ghat_k}), so every extended value can only fall.
 *
 * RESULT (extended column, N=32, nine new cutoffs beyond gamma_4000; T=8148.19 = gamma_8000).
 *   T=4800 (1662 coll): rho=0.3702;  T=5200 (1825): rho=0.3660;
 *   T=5600 (1979):      rho=0.3649;  T=6000 (2148): rho=0.3441;
 *   T=6500 (2359):      rho=0.3401;  T=7000 (2575): rho=0.3388;
 *   T=7500 (2803):      rho=0.3359;  T=8000 (3024): rho=0.2371;  T=8148.19 (3085): rho=0.2371.
 * Re-fitting BOTH laws on the full 43-point column:
 *   log-linear      rho=a+b lnT :  a=1.08583, b=-0.08585, R2=0.96835, naiveCrossT~311297,
 *   reciprocal-log  rho=c+d/lnT :  c=-0.02810, d=3.42196, R2=0.91464, floor=-0.02810.
 *
 * READING (honest -- this RESOLVES the imp-96224 residual in the no-floor direction).
 * Deepening the census from gamma_4000 to gamma_8000 completes the drift the earlier depths
 * traced:
 *   (1) the fitted floor does NOT settle at a positive value -- it reaches zero and the
 *       best-fit reciprocal-log constant crosses slightly NEGATIVE: 0.14256 (g200) ->
 *       0.16030 (g500) -> 0.11063 (g1000) -> 0.07061 (g2000) -> 0.03411 (g4000) ->
 *       -0.02810 (g8000). A negative floor is unphysical as a lower asymptote, decisively
 *       ruling out a surviving positive floor. ROBUSTNESS: the final census step carries an
 *       unusually steep single drop (rho 0.3359 -> 0.2371 across T=7500->8000, segment slope
 *       -1.53 vs |slope|<0.31 everywhere earlier) from a tight near-collision entering the
 *       hull; excluding those last two points the fitted floor is c=+0.00449 (essentially
 *       zero) -- so with OR without the drop the floor has collapsed to ~zero and shows no
 *       positive asymptote;
 *   (2) the sign-reversed R2 gap does NOT re-widen toward the floor law -- it keeps WIDENING
 *       in the log-linear direction: +0.02406 (g200) -> +0.02792 (g500) -> +0.00214 (g1000)
 *       -> -0.01042 (g2000) -> -0.01828 (g4000) -> -0.05371 (g8000). The reciprocal-log R2
 *       falls to 0.91464 while the log-linear R2 stays 0.96835 (0.99255 without the drop), so
 *       the no-floor law fits better by the widest margin yet.
 * BUT the qualitative conclusion imp-96148..96224 rest on is UNCHANGED: the margin stays
 * strictly positive and shows no approach to a crossing -- rho falls to 0.2371 at gamma_8000
 * (T~8148), still well above zero, and the log-linear naive crossing stays far out at
 * T~3.1e5. So the on-line worst-support surrogate remains strictly feasible at every extended
 * height; what this depth settles is that the numeric floor has reached zero (the no-floor
 * log-linear law), NOT the sign. The uniform-in-T obstruction still lives OFF the line
 * (Weil-positivity strength), inaccessible to this on-line construction -- unchanged.
 * Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA8000 = Object.freeze({
  id: 'imp-96249-route-bd-online-margin-floor-gamma8000',
  date: '2026-09-24',
  route: 'B/D handoff',
  origin: 'extends imp-96224 (worst-support margin column at gamma_4000) to gamma_8000; reproduces imp-96020 LP pipeline',
  status: 'MEASURED -- extending the worst-support rho(32,T) column from gamma_4000 (T~4506) to gamma_8000 (T~8148) '
    + 'completes the imp-96209/96224 drift: the on-line margin floor does NOT stabilize at a positive value -- the '
    + 'fitted floor reaches zero and crosses slightly NEGATIVE (0.03411 -> -0.02810; c=+0.00449 with the steep final '
    + 'census drop excluded, still ~zero) and the reciprocal-log/log-linear R2 gap keeps WIDENING toward the no-floor '
    + 'law (-0.01828 -> -0.05371), so the log-linear (no-floor) law fits better by the widest margin (R2 0.96835 vs '
    + '0.91464). This confirms and extends the imp-96224 sign-reversal reading. The margin still stays strictly positive '
    + '(0.2371 at T~8148, no crossing; log-linear naive cross stays far out at T~3.1e5). Changes no bound; '
    + 'no refereed bound is changed; RH open; NO QED',

  method: {
    pipeline: 'reproduces imp-96020/imp-96167/imp-96186/imp-96209/imp-96224: a_n(x)=n^-1/2 cos(theta(x)-x log n); '
      + 'near-collision x*=inter-zero extremum (Z prime=0) with tightness gap/localMeanGap<0.85; g_k=sign(Z second (x*)) '
      + 'a(x*); ghat_k unit-norm; rho(N,T)=dist(0,conv{ghat_k}) via Gilbert min-norm-point (4000 iters)',
    zerosExtended: 'zeta zeros extended 4000 -> 8000 (gamma 4506.31 -> 8148.19); near-collision census 1541 -> 3085',
    precision: 'mpmath dps 25 for zeros/theta/Z-derivatives; Gilbert solve in float64 (margin needed to 3-4 dp)',
    monotonicity: 'rho(N,T) is monotone non-increasing in T because conv{ghat_k} only grows as near-collisions are '
      + 'added, so dist(0,conv) can only fall -- the measured column is monotone non-increasing and strictly positive',
    wall: 'total ~2160s (zeros 1346s, near-collision census + ghat build 813s)',
    reproduction: 'tmp/imp-96249-extend.py',
  },

  // Validation: recomputing the seven baked imp-96148 cutoffs AND all twenty-seven prior extended
  // cutoffs (imp-96167 gamma_500 + imp-96186 gamma_1000 + imp-96209 gamma_2000 + imp-96224 gamma_4000)
  // reproduces every baked column to |delta|<=0.0004.
  validation: {
    bakedT: [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98],
    bakedRho: [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559],
    reproducedRho: [0.7607, 0.6918, 0.6603, 0.6363, 0.6193, 0.6004, 0.5594],
    prevExtT: [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
      1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
      2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31],
    prevExtRho: [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
      0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
      0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791],
    reproducedPrevExtRho: [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
      0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
      0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791],
    maxAbsDelta: 0.0004,
    note: 'reproduction matches the imp-96148 baked column, the imp-96167 gamma_500 column, the imp-96186 '
      + 'gamma_1000 column, the imp-96209 gamma_2000 column AND the imp-96224 gamma_4000 column to |delta|<=0.0004 '
      + 'at every cutoff',
  },

  // Extended worst-support (N=32) column: nine new cutoffs beyond gamma_4000 (final = gamma_8000).
  N: 32,
  gamma8000: 8148.19,
  extendedT: [4800.0, 5200.0, 5600.0, 6000.0, 6500.0, 7000.0, 7500.0, 8000.0, 8148.19],
  extendedNumCollisions: [1662, 1825, 1979, 2148, 2359, 2575, 2803, 3024, 3085],
  extendedRho: [0.3702, 0.3660, 0.3649, 0.3441, 0.3401, 0.3388, 0.3359, 0.2371, 0.2371],

  // Per-segment decay rate drho/dlnT across the new tail segments (steady gentle decay with a
  // single unusually steep drop at the T~7500->8000 step -- a tight near-collision entering the
  // hull; the final 8000->8148 segment adds 61 collisions with no further change).
  extendedSegmentSlopes: [-0.1418, -0.0527, -0.0141, -0.3018, -0.0496, -0.0184, -0.0424, -1.5295, 0.0],

  // Both laws re-fit on the FULL 43-point extended column (baked + all prior ext + new).
  refit: {
    numPoints: 43,
    logLinear: {
      form: 'rho = a + b*ln T',
      a: 1.08583,
      b: -0.08585,
      R2: 0.96835,
      naiveCrossT: 311297,
      note: 'the naive crossing stays far out at T~3.1e5 (imp-96224 T~4.2e5; it moves nearer only because the steep '
        + 'final drop steepens the fitted slope, an extrapolation artifact); the log-linear R2 remains the better fit '
        + 'and is 0.99255 once the anomalous last two points are excluded',
    },
    reciprocalLogFloor: {
      form: 'rho = c + d/ln T',
      c: -0.02810,
      d: 3.42196,
      R2: 0.91464,
      floor: -0.02810,
      note: 'the fitted floor keeps FALLING (0.16030 -> 0.11063 -> 0.07061 -> 0.03411 -> -0.02810) and now crosses '
        + 'slightly negative -- unphysical as a lower asymptote, so no positive floor survives; this law is the WORSE '
        + 'fit by the widest margin (R2 0.91464 < log-linear 0.96835)',
    },
    // Robustness: refit excluding the anomalous last two points (the steep 0.2371 drop). The floor
    // is then c=+0.00449 (essentially zero) with the R2 gap still favouring the no-floor law, so the
    // ~zero-floor / no-positive-floor conclusion holds with OR without the drop.
    dropRobustness: {
      excludedPoints: 2,
      logLinearR2: 0.99255,
      reciprocalLogC: 0.00449,
      reciprocalLogR2: 0.96361,
      r2Gap: -0.02894,
      note: 'even with the steep final drop excluded the floor is essentially zero (0.00449) and the log-linear law '
        + 'still fits better (gap -0.02894), so the no-positive-floor reading is robust to the last-point anomaly',
    },
    // Floor drift across census depth (rose then falls monotonically through zero to slightly negative).
    floorByDepth: {
      gamma200: 0.14256, gamma500: 0.16030, gamma1000: 0.11063,
      gamma2000: 0.07061, gamma4000: 0.03411, gamma8000: -0.02810,
    },
    // Successive floor gaps across the falling regime (falls by ~0.036, ~0.040, ~0.062 per doubling: no plateau).
    floorDrops: { g1000tog2000: 0.04002, g2000tog4000: 0.03650, g4000tog8000: 0.06221 },
    // R2 gap (recip - loglin) by census depth (widened, collapsed, reversed sign, then keeps widening negative).
    r2GapByDepth: {
      gamma200: 0.02406, gamma500: 0.02792, gamma1000: 0.00214,
      gamma2000: -0.01042, gamma4000: -0.01828, gamma8000: -0.05371,
    },
  },

  finding: {
    floorReachesZero: 'deepening gamma_4000 -> gamma_8000 does NOT settle the floor at a positive value -- it reaches '
      + 'zero and the best-fit reciprocal-log constant crosses slightly negative (0.14256 -> 0.16030 -> 0.11063 -> '
      + '0.07061 -> 0.03411 -> -0.02810), unphysical as a lower asymptote; excluding the steep final census drop the '
      + 'floor is c=+0.00449 (essentially zero), so no positive floor survives -- answering the imp-96224 residual in '
      + 'the no-floor direction',
    gapKeepsFavouringLogLinear: 'the sign-reversed R2 gap does NOT re-widen toward the floor law -- it keeps WIDENING '
      + 'in the log-linear direction (+0.02406 -> +0.02792 -> +0.00214 -> -0.01042 -> -0.01828 -> -0.05371); the '
      + 'reciprocal-log R2 falls to 0.91464 while the log-linear R2 stays 0.96835 (0.99255 without the drop), so the '
      + 'no-floor law fits better by the widest margin yet',
    noCrossing: 'the measured margin keeps decreasing (0.3791 at T~4506 to 0.2371 at T~8148, with a single steep step '
      + 'at T~7500->8000 from a tight near-collision entering the hull), stays well above zero, and shows no approach '
      + 'to a zero-crossing; the log-linear naive crossing stays far out at T~3.1e5 -- the SIGN of the on-line margin '
      + '(strictly feasible) is unchanged; what this depth SETTLES is that the numeric floor has reached zero, not the '
      + 'sign',
  },

  obstruction: {
    name: 'uniform-in-T obstruction is OFF the line, NOT an on-line margin-crossing (unchanged from imp-96148..96224)',
    onLine: 'rho(32,T) stays strictly positive out to gamma_8000 (measured 0.2371 at T~8148); the worst-support '
      + 'on-line surrogate remains strictly feasible at every extended height, whatever the vanishing asymptotic floor',
    offLine: 'the genuine uniform-in-T obstruction lives on complex pairs where Route B Test 2 found no coefficient '
      + 'set has a universal confining sign; a uniform off-line LP is Weil-positivity strength, inaccessible to this '
      + 'on-line construction',
  },

  honest: 'The imp-96148 baked column and all twenty-seven prior extended cutoffs (imp-96167 gamma_500, imp-96186 '
    + 'gamma_1000, imp-96209 gamma_2000, imp-96224 gamma_4000) were reproduced from scratch (matching all to '
    + '|delta|<=0.0004) and the census was EXTENDED nine cutoffs from gamma_4000 (T~4506) to gamma_8000 (T~8148). '
    + 'Re-fitting both laws on the full 43-point column: the fitted floor reaches zero and crosses slightly negative '
    + '(0.03411 -> -0.02810; c=+0.00449 with the steep final census drop excluded) and the R2 gap between the two laws '
    + 'keeps WIDENING in the log-linear direction (-0.01828 -> -0.05371), so the log-linear no-floor law now fits better '
    + 'by the widest margin (0.96835 vs 0.91464). So the strictly-positive on-line margin has NO surviving positive '
    + 'floor: the evidence at gamma_8000 completes the imp-96224 resolution (the no-floor log-linear form). The final '
    + 'census step carries a single unusually steep drop (rho 0.3359 -> 0.2371) from a tight near-collision entering '
    + 'the hull; the no-positive-floor reading is robust to excluding it. What IS stable across all six depths is the '
    + 'sign: the margin stays strictly positive with no crossing (0.2371 at T~8148), and the uniform-in-T obstruction '
    + 'stays off the line. Changes no bound; no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'the on-line margin floor still cannot be certified EXACTLY zero (rigorous asymptotics vs a six-depth empirical trend, with a steep-drop caveat)',
    statement: 'The SIGN of the on-line worst-support margin is settled to gamma_8000 (strictly positive, no crossing) '
      + 'and the FLOOR DIRECTION is now settled empirically: the fitted floor has reached zero (no-floor log-linear form '
      + 'fits best) rather than a positive asymptote. What remains NOT rigorously established is that the true floor is '
      + 'EXACTLY zero -- this rests on a six-depth trend (0.16 -> 0.11 -> 0.07 -> 0.034 -> -0.028) whose final crossing '
      + 'below zero is partly driven by a single steep census step (rho 0.3359 -> 0.2371 at T~8000). A rigorous c=0 '
      + 'would need either an analytic decay law for the min-norm-point over the on-line collision census or census '
      + 'depth well beyond gamma_8000 -- and even a proven c=0 would only confirm on-line feasibility, not the OFF-line '
      + 'uniform LP (Weil-positivity strength) that is the actual binding wall.',
  },

  references: [
    'src/data/imp-96224-route-bd-online-margin-floor-gamma4000.js (gamma_4000 column, floor 0.03411, R2 gap -0.01828)',
    'src/data/imp-96209-route-bd-online-margin-floor-gamma2000.js (gamma_2000 column, floor 0.07061, R2 gap reversed to -0.01042)',
    'src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js (gamma_1000 column, floor reversed to 0.11063, gap collapsed)',
    'src/data/imp-96167-route-bd-online-margin-floor-extended.js (gamma_500 column, floor rose to 0.16030)',
    'src/data/imp-96148-route-bd-online-margin-decay-law.js (seven-point column stopping at T=395.98, floor c~0.143)',
    'src/data/imp-96020-lp-signed-force-feasibility.js (LP setup, rho(N,T) grid, Gilbert min-norm-point)',
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2 no-universal-sign)',
    'tmp/imp-96249-extend.py (reproduction + extension to gamma_8000).',
  ],
});

const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA8000;

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA8000_ASSERTIONS = Object.freeze([
  {
    name: 'reproduction matches the imp-96148 baked and all twenty-seven prior extended cutoffs to |delta|<=0.0005',
    holds: () => D.validation.bakedRho.length === 7
      && D.validation.reproducedRho.length === 7
      && D.validation.prevExtRho.length === 27
      && D.validation.reproducedPrevExtRho.length === 27
      && D.validation.bakedRho.every((v, i) => Math.abs(v - D.validation.reproducedRho[i]) <= 0.0005)
      && D.validation.prevExtRho.every((v, i) => Math.abs(v - D.validation.reproducedPrevExtRho[i]) <= 0.0005),
  },
  {
    name: 'extended column adds nine cutoffs beyond T=4506, monotone non-increasing, all strictly positive',
    holds: () => D.extendedT.length === 9 && D.extendedRho.length === 9
      && D.extendedNumCollisions.length === 9
      && D.extendedT.every((t) => t > 4506.31)
      && D.extendedRho.every((v, i) => v > 0 && (i === 0 || v <= D.extendedRho[i - 1] + 1e-9)),
  },
  {
    name: 'the fitted floor does NOT settle positive -- it reaches zero and crosses slightly negative g4000->g8000',
    holds: () => {
      const f = D.refit.floorByDepth;
      return f.gamma8000 < 0 && f.gamma8000 < f.gamma4000 && f.gamma4000 < f.gamma2000 && f.gamma2000 < f.gamma1000;
    },
  },
  {
    name: 'the no-positive-floor reading is robust to excluding the steep final drop (floor still ~zero)',
    holds: () => {
      const r = D.refit.dropRobustness;
      return r.excludedPoints === 2 && Math.abs(r.reciprocalLogC) < 0.02
        && r.logLinearR2 > r.reciprocalLogR2 && r.r2Gap < 0;
    },
  },
  {
    name: 'the R2 gap keeps widening in the log-linear direction (does not re-favour the floor law)',
    holds: () => {
      const g = D.refit.r2GapByDepth;
      return g.gamma1000 > 0 && g.gamma2000 < 0 && g.gamma4000 < g.gamma2000 && g.gamma8000 < g.gamma4000;
    },
  },
  {
    name: 'log-linear law fits better than the reciprocal-log-floor law at gamma_8000 by the widest margin',
    holds: () => D.refit.logLinear.R2 > D.refit.reciprocalLogFloor.R2
      && (D.refit.logLinear.R2 - D.refit.reciprocalLogFloor.R2) > 0.03
      && D.refit.reciprocalLogFloor.R2 > 0.9,
  },
  {
    name: 'the SIGN is unchanged: margin stays strictly positive out to gamma_8000, no crossing',
    holds: () => D.extendedRho[D.extendedRho.length - 1] > 0.2
      && D.refit.logLinear.naiveCrossT > 3e5,
  },
  {
    name: 'reading records the no-floor resolution of the imp-96224 residual',
    holds: () => /reaches zero/.test(D.finding.floorReachesZero)
      && /no-floor direction/.test(D.finding.floorReachesZero)
      && /keeps WIDENING/.test(D.finding.gapKeepsFavouringLogLinear)
      && /OFF the line/.test(D.obstruction.name)
      && /Weil/.test(D.obstruction.offLine),
  },
  {
    name: 'honest status: measurement only, no bound change, no QED',
    holds: () => /MEASURED/.test(D.status)
      && /Changes no bound/.test(D.status)
      && /refereed bound is changed/i.test(D.status)
      && /RH open/.test(D.status)
      && /NO QED/.test(D.status),
  },
]);

for (const a of ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA8000_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96249-route-bd-online-margin-floor-gamma8000 assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA8000;
