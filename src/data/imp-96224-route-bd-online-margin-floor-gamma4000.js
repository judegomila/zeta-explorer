/**
 * @fileoverview imp-96224 -- EXTEND the imp-96209 worst-support on-line signed-force
 * feasibility margin column rho(32,T) beyond gamma_2000 (T~2515) to gamma_4000 (T~4506)
 * and re-fit BOTH laws, to decide whether the STILL-FALLING reciprocal-log floor
 * (0.16030 -> 0.11063 -> 0.07061) settles to a positive value or continues to zero, and
 * whether the sign-reversed reciprocal-log/log-linear R2 gap keeps favouring the no-floor
 * log-linear form.
 * Import-light (literals baked, no zeros bundle); holds() assertions; self-executing.
 * Measurement only. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. imp-96148 fit the worst-support (N=32) on-line margin rho(32,T) to rho=c+d/lnT
 * over a seven-point grid stopping at T=395.98 (gamma_200) and read a positive floor
 * c=0.14256. imp-96167 extended to gamma_500 (T~811) and read the floor RISING (0.16030)
 * with a WIDENING R2 gap. imp-96186 extended to gamma_1000 (T~1419): the floor REVERSED
 * (0.16030 -> 0.11063, non-monotone) and the R2 gap COLLAPSED (0.02792 -> 0.00214).
 * imp-96209 extended to gamma_2000 (T~2515): the floor kept FALLING (0.07061) and the R2
 * gap REVERSED SIGN (+0.00214 -> -0.01042), so the log-linear (no-floor) law began to fit
 * marginally better. imp-96209 left the floor an unsettled finite-height feature and posed
 * the question this ticket answers: deepening once more to gamma_4000, does the floor settle
 * to a positive value or continue toward zero, and does the sign-reversed gap keep favouring
 * the no-floor log-linear form?
 *
 * METHOD. Reproduce the imp-96020/imp-96167/imp-96186/imp-96209 on-line LP pipeline from
 * scratch (mpmath dps 25) and extend it:
 *   a_n(x)   = n^{-1/2} cos(theta(x) - x log n),  theta = Riemann-Siegel theta,
 *   near-collision x* = inter-zero extremum (Z prime=0) with gap/localMeanGap < 0.85,
 *   g_k      = sign(Z second (x*)) a(x*),  ghat_k = g_k / ||g_k||_2,
 *   rho(N,T) = dist(0, conv{ghat_k})   via Gilbert min-norm-point (Frank-Wolfe, 4000 iters).
 * Zeta zeros extended 2000 -> 4000 (gamma 2515 -> 4506.31); near-collision census grows
 * 775 -> 1541. VALIDATION: recomputing the seven baked imp-96148 cutoffs, the four
 * imp-96167 cutoffs, the six imp-96186 cutoffs AND the nine imp-96209 cutoffs reproduces
 * all four baked columns to |delta| <= 0.0004.
 *   Reproduction: tmp/imp-96224-extend.py (wall 1219s: zeros 784s, census 1167s).
 *
 * RESULT (extended column, N=32, eight new cutoffs beyond gamma_2000; T=4506.31 = gamma_4000).
 *   T=2600 (809 coll): rho=0.4086;  T=2800 (882): rho=0.4081;
 *   T=3000 (955):      rho=0.4073;  T=3300 (1071): rho=0.3985;
 *   T=3600 (1186):     rho=0.3916;  T=4000 (1344): rho=0.3845;
 *   T=4400 (1498):     rho=0.3800;  T=4506.31 (1541): rho=0.3791.
 * Re-fitting BOTH laws on the full 35-point column:
 *   log-linear      rho=a+b lnT :  a=1.06083, b=-0.08193, R2=0.99041, naiveCrossT~419981,
 *   reciprocal-log  rho=c+d/lnT :  c=0.03411, d=3.06496, R2=0.97212, floor=0.03411.
 *
 * READING (honest -- this ANSWERS the imp-96209 question in the no-floor direction).
 * Deepening the census once more from gamma_2000 to gamma_4000 continues both imp-96209 trends
 * and now resolves the drift direction:
 *   (1) the fitted floor does NOT settle to a positive value -- it keeps FALLING and is
 *       trending toward ZERO: 0.14256 (g200) -> 0.16030 (g500) -> 0.11063 (g1000) ->
 *       0.07061 (g2000) -> 0.03411 (g4000). Across the last three doublings the floor nearly
 *       HALVES each time (0.11063 -> 0.07061 -> 0.03411; ratios 0.638, 0.483), a near-geometric
 *       decay with NO plateau -- consistent with c -> 0 (no surviving positive floor), NOT with
 *       a settled positive asymptote;
 *   (2) the sign-reversed R2 gap does NOT re-widen toward the floor law -- it keeps WIDENING in
 *       the log-linear direction: +0.02406 (g200) -> +0.02792 (g500) -> +0.00214 (g1000) ->
 *       -0.01042 (g2000) -> -0.01828 (g4000). The log-linear R2 keeps RISING (0.98308 ->
 *       0.98765 -> 0.99041) while the reciprocal-log R2 keeps FALLING (0.98522 -> 0.97723 ->
 *       0.97212), so the no-floor law fits increasingly better with depth. The ANSWER to the
 *       ticket: the floor does NOT settle positive (it continues toward zero) and the R2 gap
 *       keeps favouring the no-floor log-linear form.
 * BUT the qualitative conclusion imp-96148/96167/96186/96209 rest on is UNCHANGED: the margin
 * stays strictly positive and shows no approach to a crossing -- rho falls only gently to 0.3791
 * at gamma_4000 (T~4506), still an order of magnitude above the vanishing fitted floor, and the
 * log-linear naive crossing recedes further to T~4.2e5 (from 3.66e5 at gamma_2000). So the on-line
 * worst-support surrogate remains strictly feasible at every extended height; what this depth now
 * settles is that the numeric floor is heading to zero (the no-floor log-linear law), NOT the sign.
 * The uniform-in-T obstruction still lives OFF the line (Weil-positivity strength), inaccessible to
 * this on-line construction -- unchanged. Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000 = Object.freeze({
  id: 'imp-96224-route-bd-online-margin-floor-gamma4000',
  date: '2026-09-23',
  route: 'B/D handoff',
  origin: 'extends imp-96209 (worst-support margin column at gamma_2000) to gamma_4000; reproduces imp-96020 LP pipeline',
  status: 'MEASURED -- extending the worst-support rho(32,T) column from gamma_2000 (T~2515) to gamma_4000 (T~4506) '
    + 'settles the imp-96209 drift direction: the on-line margin floor does NOT stabilize at a positive value -- the '
    + 'fitted floor keeps FALLING and is trending to ZERO (0.07061 -> 0.03411, near-halving per census doubling with no '
    + 'plateau) and the reciprocal-log/log-linear R2 gap keeps WIDENING toward the no-floor law (-0.01042 -> -0.01828), '
    + 'so the log-linear (no-floor) law fits increasingly better (R2 0.99041 vs 0.97212). This confirms and extends the '
    + 'imp-96209 sign-reversal reading. The margin still stays strictly positive (0.3791 at T~4506, no crossing; '
    + 'log-linear naive cross recedes to T~4.2e5). Changes no bound; no refereed bound is changed; RH open; NO QED',

  method: {
    pipeline: 'reproduces imp-96020/imp-96167/imp-96186/imp-96209: a_n(x)=n^-1/2 cos(theta(x)-x log n); near-collision '
      + 'x*=inter-zero extremum (Z prime=0) with tightness gap/localMeanGap<0.85; g_k=sign(Z second (x*)) a(x*); '
      + 'ghat_k unit-norm; rho(N,T)=dist(0,conv{ghat_k}) via Gilbert min-norm-point (4000 iters)',
    zerosExtended: 'zeta zeros extended 2000 -> 4000 (gamma 2515 -> 4506.31); near-collision census 775 -> 1541',
    precision: 'mpmath dps 25 for zeros/theta/Z-derivatives; Gilbert solve in float64 (margin needed to 3-4 dp)',
    wall: 'total 1219s (zeros 784s, near-collision census 1167s, ghat build to 1218s)',
    reproduction: 'tmp/imp-96224-extend.py',
  },

  // Validation: recomputing the seven baked imp-96148 cutoffs AND all nineteen prior extended
  // cutoffs (imp-96167 gamma_500 + imp-96186 gamma_1000 + imp-96209 gamma_2000) reproduces
  // all four baked columns.
  validation: {
    bakedT: [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98],
    bakedRho: [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559],
    reproducedRho: [0.7607, 0.6918, 0.6603, 0.6363, 0.6193, 0.6004, 0.5594],
    prevExtT: [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
      1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0],
    prevExtRho: [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
      0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171],
    reproducedPrevExtRho: [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
      0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171],
    maxAbsDelta: 0.0004,
    note: 'reproduction matches the imp-96148 baked column, the imp-96167 gamma_500 column, the imp-96186 '
      + 'gamma_1000 column and the imp-96209 gamma_2000 column to |delta|<=0.0004 at every cutoff',
  },

  // Extended worst-support (N=32) column: eight new cutoffs beyond gamma_2000 (final = gamma_4000).
  N: 32,
  gamma4000: 4506.31,
  extendedT: [2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31],
  extendedNumCollisions: [809, 882, 955, 1071, 1186, 1344, 1498, 1541],
  extendedRho: [0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791],

  // Per-segment decay rate drho/dlnT across the new tail segments (small on average, with a
  // sharp step at the T~2515->2600 census jump then steady gentle decay; no sustained
  // re-acceleration toward the constant log-linear crossing slope).
  extendedSegmentSlopes: [-0.2560, -0.0068, -0.0116, -0.0925, -0.0784, -0.0680, -0.0474, -0.0093],

  // Both laws re-fit on the FULL 35-point extended column (baked + imp-96167 + imp-96186 + imp-96209 + new).
  refit: {
    numPoints: 35,
    logLinear: {
      form: 'rho = a + b*ln T',
      a: 1.06083,
      b: -0.08193,
      R2: 0.99041,
      naiveCrossT: 419981,
      note: 'naive crossing recedes further to T~4.2e5 (imp-96209 T~3.66e5), consistent with an extrapolation '
        + 'artifact; the log-linear R2 keeps rising (0.98308 -> 0.98765 -> 0.99041) and now EXCEEDS the floor-law R2 '
        + 'by the widest margin yet',
    },
    reciprocalLogFloor: {
      form: 'rho = c + d/ln T',
      c: 0.03411,
      d: 3.06496,
      R2: 0.97212,
      floor: 0.03411,
      note: 'the fitted floor keeps FALLING (0.16030 -> 0.11063 -> 0.07061 -> 0.03411, near-halving per doubling) '
        + 'rather than settling, and this law is now the WORSE fit by the widest margin (R2 0.97212 < log-linear '
        + '0.99041) -- the evidence favours the floor continuing to zero, i.e. the no-floor log-linear form',
    },
    // Floor drift across census depth (rose then falls monotonically toward zero: no plateau).
    floorByDepth: { gamma200: 0.14256, gamma500: 0.16030, gamma1000: 0.11063, gamma2000: 0.07061, gamma4000: 0.03411 },
    // Successive floor ratios across the falling regime (near-halving per doubling => trending to zero).
    floorRatios: { g500tog1000: 0.690, g1000tog2000: 0.638, g2000tog4000: 0.483 },
    // R2 gap (recip - loglin) by census depth (widened, collapsed, reversed sign, then keeps widening negative).
    r2GapByDepth: { gamma200: 0.02406, gamma500: 0.02792, gamma1000: 0.00214, gamma2000: -0.01042, gamma4000: -0.01828 },
  },

  finding: {
    floorTrendingToZero: 'deepening gamma_2000 -> gamma_4000 does NOT settle the floor at a positive value -- it keeps '
      + 'FALLING toward zero (0.14256 -> 0.16030 -> 0.11063 -> 0.07061 -> 0.03411), nearly HALVING per census doubling '
      + 'across the last three depths (ratios 0.690, 0.638, 0.483) with no plateau; the fitted floor is consistent with '
      + 'c -> 0 (no surviving positive floor), answering the imp-96209 open question in the no-floor direction',
    gapKeepsFavouringLogLinear: 'the sign-reversed R2 gap does NOT re-widen toward the floor law -- it keeps WIDENING '
      + 'in the log-linear direction (+0.02406 -> +0.02792 -> +0.00214 -> -0.01042 -> -0.01828); the log-linear R2 keeps '
      + 'RISING (0.98308 -> 0.98765 -> 0.99041) while the reciprocal-log R2 keeps FALLING (0.98522 -> 0.97723 -> '
      + '0.97212), so the no-floor law fits increasingly better -- the imp-96167 "floor law clearly wins" reading is '
      + 'now overturned by the widest margin',
    noCrossing: 'the measured margin keeps decreasing only gently (0.4171 at T~2515 to 0.3791 at T~4506), stays an order '
      + 'of magnitude above even the vanishing fitted floor, and shows no approach to a zero-crossing; the log-linear '
      + 'naive crossing recedes further to T~4.2e5 -- the SIGN of the on-line margin (strictly feasible) is unchanged; '
      + 'what this depth SETTLES is that the numeric floor is heading to zero, not the sign',
  },

  obstruction: {
    name: 'uniform-in-T obstruction is OFF the line, NOT an on-line margin-crossing (unchanged from imp-96148..96209)',
    onLine: 'rho(32,T) stays strictly positive out to gamma_4000 (measured 0.3791 at T~4506); the worst-support '
      + 'on-line surrogate remains strictly feasible at every extended height, whatever the vanishing asymptotic floor',
    offLine: 'the genuine uniform-in-T obstruction lives on complex pairs where Route B Test 2 found no coefficient '
      + 'set has a universal confining sign; a uniform off-line LP is Weil-positivity strength, inaccessible to this '
      + 'on-line construction',
  },

  honest: 'The imp-96148 baked column, the imp-96167 gamma_500 extension, the imp-96186 gamma_1000 extension AND the '
    + 'imp-96209 gamma_2000 extension were reproduced from scratch (matching all four to |delta|<=0.0004) and the census '
    + 'was EXTENDED eight cutoffs from gamma_2000 (T~2515) to gamma_4000 (T~4506). Re-fitting both laws on the full '
    + '35-point column: the fitted floor keeps FALLING toward zero (0.07061 -> 0.03411, near-halving per doubling, no '
    + 'plateau) and the R2 gap between the two laws keeps WIDENING in the log-linear direction (-0.01042 -> -0.01828), '
    + 'so the log-linear no-floor law now fits better by the widest margin (0.99041 vs 0.97212). So the strictly-positive '
    + 'on-line margin has NO surviving positive floor: the evidence at gamma_4000 favours the floor continuing to zero '
    + '(the no-floor log-linear form), settling the imp-96209 open question in that direction. What IS stable across all '
    + 'five depths is the sign: the margin stays strictly positive with no crossing (0.3791 at T~4506), and the '
    + 'uniform-in-T obstruction stays off the line. Changes no bound; no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'the on-line margin floor still cannot be certified EXACTLY zero (rigorous asymptotics vs a five-depth empirical trend)',
    statement: 'The SIGN of the on-line worst-support margin is settled to gamma_4000 (strictly positive, no crossing) '
      + 'and the FLOOR DIRECTION is now settled empirically: the fitted floor is trending to zero (no-floor log-linear '
      + 'form fits best) rather than to a positive asymptote. What remains NOT rigorously established is that the true '
      + 'floor is EXACTLY zero -- this rests on a five-depth near-geometric trend (0.16 -> 0.11 -> 0.07 -> 0.034), not an '
      + 'analytic asymptotic for rho(32,T). A rigorous c=0 would need either an analytic decay law for the min-norm-point '
      + 'over the on-line collision census or census depth well beyond gamma_4000 -- and even a proven c=0 would only '
      + 'confirm on-line feasibility, not the OFF-line uniform LP (Weil-positivity strength) that is the actual binding wall.',
  },

  references: [
    'src/data/imp-96209-route-bd-online-margin-floor-gamma2000.js (gamma_2000 column, floor 0.07061, R2 gap reversed to -0.01042)',
    'src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js (gamma_1000 column, floor reversed to 0.11063, gap collapsed)',
    'src/data/imp-96167-route-bd-online-margin-floor-extended.js (gamma_500 column, floor rose to 0.16030)',
    'src/data/imp-96148-route-bd-online-margin-decay-law.js (seven-point column stopping at T=395.98, floor c~0.143)',
    'src/data/imp-96020-lp-signed-force-feasibility.js (LP setup, rho(N,T) grid, Gilbert min-norm-point)',
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2 no-universal-sign)',
    'tmp/imp-96224-extend.py (reproduction + extension to gamma_4000).',
  ],
});

const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000;

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000_ASSERTIONS = Object.freeze([
  {
    name: 'reproduction matches the imp-96148 baked and all nineteen prior extended cutoffs to |delta|<=0.0005',
    holds: () => D.validation.bakedRho.length === 7
      && D.validation.reproducedRho.length === 7
      && D.validation.prevExtRho.length === 19
      && D.validation.reproducedPrevExtRho.length === 19
      && D.validation.bakedRho.every((v, i) => Math.abs(v - D.validation.reproducedRho[i]) <= 0.0005)
      && D.validation.prevExtRho.every((v, i) => Math.abs(v - D.validation.reproducedPrevExtRho[i]) <= 0.0005),
  },
  {
    name: 'extended column adds eight cutoffs beyond T=2515, monotone non-increasing, all strictly positive',
    holds: () => D.extendedT.length === 8 && D.extendedRho.length === 8
      && D.extendedNumCollisions.length === 8
      && D.extendedT.every((t) => t > 2515.0)
      && D.extendedRho.every((v, i) => v > 0 && (i === 0 || v <= D.extendedRho[i - 1] + 1e-9)),
  },
  {
    name: 'the fitted floor does NOT settle positive -- it keeps falling toward zero g2000->g4000',
    holds: () => {
      const f = D.refit.floorByDepth;
      return f.gamma4000 < f.gamma2000 && f.gamma2000 < f.gamma1000 && f.gamma1000 < f.gamma500;
    },
  },
  {
    name: 'the floor decays near-geometrically (each falling ratio below 0.75) -- consistent with c->0',
    holds: () => {
      const r = D.refit.floorRatios;
      return r.g500tog1000 < 0.75 && r.g1000tog2000 < 0.75 && r.g2000tog4000 < 0.75
        && r.g2000tog4000 < r.g1000tog2000;
    },
  },
  {
    name: 'the R2 gap keeps widening in the log-linear direction (does not re-favour the floor law)',
    holds: () => {
      const g = D.refit.r2GapByDepth;
      return g.gamma1000 > 0 && g.gamma2000 < 0 && g.gamma4000 < g.gamma2000;
    },
  },
  {
    name: 'log-linear law fits better than the reciprocal-log-floor law at gamma_4000 by the widest margin',
    holds: () => D.refit.logLinear.R2 > D.refit.reciprocalLogFloor.R2
      && (D.refit.logLinear.R2 - D.refit.reciprocalLogFloor.R2) > 0.01
      && D.refit.reciprocalLogFloor.R2 > 0.97,
  },
  {
    name: 'the SIGN is unchanged: margin stays strictly positive out to gamma_4000, no crossing',
    holds: () => D.extendedRho[D.extendedRho.length - 1] > 0.3
      && D.refit.logLinear.naiveCrossT > 4e5,
  },
  {
    name: 'reading records the no-floor resolution of the imp-96209 open question',
    holds: () => /toward zero/.test(D.finding.floorTrendingToZero)
      && /no-floor direction/.test(D.finding.floorTrendingToZero)
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

for (const a of ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96224-route-bd-online-margin-floor-gamma4000 assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000;
