/**
 * @fileoverview imp-96209 -- EXTEND the imp-96186 worst-support on-line signed-force
 * feasibility margin column rho(32,T) beyond gamma_1000 (T~1419) to gamma_2000 (T~2515)
 * and re-fit BOTH laws, to decide whether the STILL-DRIFTING reciprocal-log floor c
 * stabilizes at gamma_2000 and whether the collapsed reciprocal-log/log-linear R2 gap
 * re-widens or stays collapsed.
 * Import-light (literals baked, no zeros bundle); holds() assertions; self-executing.
 * Measurement only. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. imp-96148 fit the worst-support (N=32) on-line margin rho(32,T) to rho=c+d/lnT
 * over a seven-point grid stopping at T=395.98 (gamma_200) and read a positive floor
 * c=0.14256. imp-96167 extended the column to gamma_500 (T~811) and read the floor as
 * RISING (0.16030) with a WIDENING R2 gap -- a confirmed positive asymptote. imp-96186
 * extended it to gamma_1000 (T~1419) and PARTLY CORRECTED that: the fitted floor REVERSED
 * its rise (0.16030 -> 0.11063, non-monotone) and the reciprocal-log vs log-linear R2 gap
 * COLLAPSED (0.02792 -> 0.00214, both laws ~0.985), so at gamma_1000 the fit no longer
 * discriminated the two functional forms and the floor was declared a STILL-DRIFTING
 * finite-height feature, not a settled asymptote. The open question this ticket poses:
 * deepening once more to gamma_2000, does the floor stabilize and does the R2 gap
 * re-widen or stay collapsed?
 *
 * METHOD. Reproduce the imp-96020/imp-96167/imp-96186 on-line LP pipeline from scratch
 * (mpmath dps 25) and extend it:
 *   a_n(x)   = n^{-1/2} cos(theta(x) - x log n),  theta = Riemann-Siegel theta,
 *   near-collision x* = inter-zero extremum (Z prime=0) with gap/localMeanGap < 0.85,
 *   g_k      = sign(Z second (x*)) a(x*),  ghat_k = g_k / ||g_k||_2,
 *   rho(N,T) = dist(0, conv{ghat_k})   via Gilbert min-norm-point (Frank-Wolfe, 4000 iters).
 * Zeta zeros extended 1000 -> 2000 (gamma 1419 -> 2515); near-collision census grows
 * 378 -> 775. VALIDATION: recomputing the seven baked imp-96148 cutoffs, the four
 * imp-96167 cutoffs AND the six imp-96186 cutoffs reproduces all three baked columns to
 * |delta| <= 0.0004.
 *   Reproduction: tmp/imp-96209-extend.py.
 *
 * RESULT (extended column, N=32, nine new cutoffs beyond gamma_1000).
 *   T=1500 (403 coll): rho=0.4570;  T=1600 (438): rho=0.4566;
 *   T=1700 (476):      rho=0.4565;  T=1800 (512): rho=0.4545;
 *   T=1900 (543):      rho=0.4545;  T=2000 (581): rho=0.4258;
 *   T=2200 (659):      rho=0.4217;  T=2400 (734): rho=0.4173;
 *   T=2515 (775):      rho=0.4171.
 * Re-fitting BOTH laws on the full 26-point column:
 *   log-linear      rho=a+b lnT :  a=1.07088, b=-0.08360, R2=0.98765, naiveCrossT~365645,
 *   reciprocal-log  rho=c+d/lnT :  c=0.07061, d=2.86689, R2=0.97723, floor=0.07061.
 *
 * READING (honest -- this CONFIRMS AND REINFORCES the imp-96186 still-drifting correction).
 * Deepening the census once more from gamma_1000 to gamma_2000 continues the imp-96186 trend
 * and sharpens it:
 *   (1) the fitted floor does NOT stabilize -- it keeps FALLING: 0.16030 (g500) -> 0.11063
 *       (g1000) -> 0.07061 (g2000). Combined with the earlier rise (0.14256 -> 0.16030) the
 *       floor is a non-monotone, still-drifting finite-height feature, with NO sign yet of a
 *       settled positive value;
 *   (2) the R2 gap does NOT re-widen in the floor-law direction -- it REVERSES SIGN: +0.02406
 *       (g200) -> +0.02792 (g500) -> +0.00214 (g1000) -> -0.01042 (g2000). At gamma_2000 the
 *       LOG-LINEAR law now fits marginally BETTER (R2 0.98765 vs 0.97723), so not only does the
 *       fit fail to discriminate a positive floor -- what discrimination remains now slightly
 *       favours the no-floor (log-linear) form. The imp-96167 "floor law clearly wins" reading
 *       is fully overturned by this depth. So the ANSWER to the ticket is: the floor does NOT
 *       stabilize (keeps drifting down) and the R2 gap does NOT re-widen (it flips sign toward
 *       log-linear); the on-line margin floor remains an unsettled finite-height feature.
 * BUT the qualitative conclusion imp-96148/imp-96167/imp-96186 rest on is UNCHANGED: the margin
 * stays strictly positive and shows no approach to a crossing -- rho falls only gently to 0.4171
 * at T~2515, still ~6x above the reduced fitted floor, and the log-linear naive crossing recedes
 * further to T~3.66e5 (from 3.30e5 at gamma_1000). So the on-line worst-support surrogate remains
 * strictly feasible at every extended height; what is UNSETTLED is the numeric floor value and
 * whether any positive floor survives at all, not the sign. The uniform-in-T obstruction still
 * lives OFF the line (Weil-positivity strength), inaccessible to this on-line construction --
 * unchanged. Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000 = Object.freeze({
  id: 'imp-96209-route-bd-online-margin-floor-gamma2000',
  date: '2026-09-23',
  route: 'B/D handoff',
  origin: 'extends imp-96186 (worst-support margin column at gamma_1000) to gamma_2000; reproduces imp-96020 LP pipeline',
  status: 'MEASURED -- extending the worst-support rho(32,T) column from gamma_1000 (T~1419) to gamma_2000 (T~2515) '
    + 'shows the on-line margin floor does NOT stabilize: the fitted floor keeps FALLING (0.11063 -> 0.07061) and the '
    + 'reciprocal-log/log-linear R2 gap does NOT re-widen -- it REVERSES SIGN (+0.00214 -> -0.01042), so the log-linear '
    + '(no-floor) law now fits marginally better (R2 0.98765 vs 0.97723). This confirms and reinforces the imp-96186 '
    + 'still-drifting finding and fully overturns the imp-96167 "floor law clearly wins" reading. The margin still stays '
    + 'strictly positive (0.4171 at T~2515, no crossing; log-linear naive cross recedes to T~3.66e5). '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED',

  method: {
    pipeline: 'reproduces imp-96020/imp-96167/imp-96186: a_n(x)=n^-1/2 cos(theta(x)-x log n); near-collision '
      + 'x*=inter-zero extremum (Z prime=0) with tightness gap/localMeanGap<0.85; g_k=sign(Z second (x*)) a(x*); '
      + 'ghat_k unit-norm; rho(N,T)=dist(0,conv{ghat_k}) via Gilbert min-norm-point (4000 iters)',
    zerosExtended: 'zeta zeros extended 1000 -> 2000 (gamma 1419 -> 2515); near-collision census 378 -> 775',
    precision: 'mpmath dps 25 for zeros/theta/Z-derivatives; Gilbert solve in float64 (margin needed to 3-4 dp)',
    reproduction: 'tmp/imp-96209-extend.py',
  },

  // Validation: recomputing the seven baked imp-96148 cutoffs AND all ten prior extended
  // cutoffs (imp-96167 gamma_500 + imp-96186 gamma_1000) reproduces all three baked columns.
  validation: {
    bakedT: [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98],
    bakedRho: [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559],
    reproducedRho: [0.7607, 0.6918, 0.6603, 0.6363, 0.6193, 0.6004, 0.5594],
    prevExtT: [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0],
    prevExtRho: [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580],
    reproducedPrevExtRho: [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580],
    maxAbsDelta: 0.0004,
    note: 'reproduction matches the imp-96148 baked column, the imp-96167 gamma_500 column and the imp-96186 '
      + 'gamma_1000 column to |delta|<=0.0004 at every cutoff',
  },

  // Extended worst-support (N=32) column: nine new cutoffs beyond gamma_1000.
  N: 32,
  extendedT: [1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0],
  extendedNumCollisions: [403, 438, 476, 512, 543, 581, 659, 734, 775],
  extendedRho: [0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171],

  // Per-segment decay rate drho/dlnT across the new tail segments (still small on average,
  // oscillating; one sharp drop at the T~1900->2000 census jump, no sustained re-acceleration
  // toward the constant log-linear crossing slope).
  extendedSegmentSlopes: [-0.0181, -0.0059, -0.0010, -0.0356, 0.0000, -0.5600, -0.0424, -0.0513, -0.0038],

  // Both laws re-fit on the FULL 26-point extended column (baked + imp-96167 + imp-96186 + new).
  refit: {
    numPoints: 26,
    logLinear: {
      form: 'rho = a + b*ln T',
      a: 1.07088,
      b: -0.08360,
      R2: 0.98765,
      naiveCrossT: 365645,
      note: 'naive crossing recedes further to T~3.66e5 (imp-96186 T~3.30e5), consistent with an extrapolation '
        + 'artifact; the log-linear R2 keeps rising (0.98308 -> 0.98765) and now EXCEEDS the floor-law R2',
    },
    reciprocalLogFloor: {
      form: 'rho = c + d/ln T',
      c: 0.07061,
      d: 2.86689,
      R2: 0.97723,
      floor: 0.07061,
      note: 'the fitted floor keeps FALLING (0.16030 -> 0.11063 -> 0.07061) rather than stabilizing, and this law '
        + 'is now the WORSE fit (R2 0.97723 < log-linear 0.98765) -- the floor is not an established asymptote',
    },
    // Floor drift across census depth (rose then falls monotonically: still drifting, no plateau).
    floorByDepth: { gamma200: 0.14256, gamma500: 0.16030, gamma1000: 0.11063, gamma2000: 0.07061 },
    // R2 gap (recip - loglin) by census depth (widened, collapsed, then REVERSED SIGN toward log-linear).
    r2GapByDepth: { gamma200: 0.02406, gamma500: 0.02792, gamma1000: 0.00214, gamma2000: -0.01042 },
  },

  finding: {
    floorStillDrifting: 'deepening gamma_1000 -> gamma_2000 does NOT stabilize the floor -- it keeps FALLING '
      + '(0.14256 -> 0.16030 -> 0.11063 -> 0.07061); the strictly-positive on-line margin floor remains a '
      + 'still-drifting finite-height feature, NOT an established asymptote, and shows no sign of a settled value -- '
      + 'this confirms and reinforces the imp-96186 correction of the imp-96167 positive-asymptote reading',
    gapReversedSign: 'the R2 gap does NOT re-widen -- it REVERSES SIGN across census depth (+0.02406 -> +0.02792 -> '
      + '+0.00214 -> -0.01042); at gamma_2000 the log-linear (no-floor) law fits marginally BETTER (R2 0.98765 vs '
      + '0.97723), so what little discrimination remains now slightly favours no positive floor -- the imp-96167 '
      + '"floor law clearly wins" reading is fully overturned at this depth',
    noCrossing: 'the measured margin keeps decreasing only gently (0.4580 at T~1419 to 0.4171 at T~2515), stays ~6x '
      + 'above even the reduced fitted floor, and shows no approach to a zero-crossing; the log-linear naive crossing '
      + 'recedes further to T~3.66e5 -- the SIGN of the on-line margin (strictly feasible) is unchanged; only its '
      + 'numeric floor and whether any positive floor survives are unsettled',
  },

  obstruction: {
    name: 'uniform-in-T obstruction is OFF the line, NOT an on-line margin-crossing (unchanged from imp-96148/96167/96186)',
    onLine: 'rho(32,T) stays strictly positive out to gamma_2000 (measured 0.4171 at T~2515); the worst-support '
      + 'on-line surrogate remains strictly feasible at every extended height, whatever the unsettled asymptotic floor',
    offLine: 'the genuine uniform-in-T obstruction lives on complex pairs where Route B Test 2 found no coefficient '
      + 'set has a universal confining sign; a uniform off-line LP is Weil-positivity strength, inaccessible to this '
      + 'on-line construction',
  },

  honest: 'The imp-96148 baked column, the imp-96167 gamma_500 extension AND the imp-96186 gamma_1000 extension were '
    + 'reproduced from scratch (matching all three to |delta|<=0.0004) and the census was EXTENDED nine cutoffs from '
    + 'gamma_1000 (T~1419) to gamma_2000 (T~2515). Re-fitting both laws on the full 26-point column: the fitted floor '
    + 'keeps FALLING (0.11063 -> 0.07061, no plateau) and the R2 gap between the two laws REVERSES SIGN (0.00214 -> '
    + '-0.01042), so the log-linear no-floor law now fits marginally better. So the strictly-positive on-line margin '
    + 'floor is a STILL-DRIFTING finite-height feature that does NOT stabilize by gamma_2000, confirming and reinforcing '
    + 'the imp-96186 correction -- deciding whether any positive floor survives would need census depth well beyond '
    + 'gamma_2000 (or an off-line argument). What IS stable across all four depths is the sign: the margin stays '
    + 'strictly positive with no crossing (0.4171 at T~2515), and the uniform-in-T obstruction stays off the line. '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'the on-line margin floor VALUE / functional form is STILL not settled by gamma_2000 (finite-height drift, gap now favours no-floor)',
    statement: 'The SIGN of the on-line worst-support margin is now settled to gamma_2000 (strictly positive, no '
      + 'crossing). What is NOT settled is its asymptotic floor: the fitted floor keeps drifting down '
      + '(0.143 -> 0.160 -> 0.111 -> 0.071, no plateau) and the R2 gap has reversed to favour the log-linear no-floor '
      + 'form (0.98765 vs 0.97723). Deciding whether the true floor is positive, zero, or the log-linear form '
      + 'eventually holds would need census depth far beyond gamma_2000 -- and even a settled positive floor would only '
      + 'confirm on-line feasibility, not the OFF-line uniform LP (Weil-positivity strength) that is the actual binding wall.',
  },

  references: [
    'src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js (gamma_1000 column, floor reversed to 0.11063, gap collapsed)',
    'src/data/imp-96167-route-bd-online-margin-floor-extended.js (gamma_500 column, floor rose to 0.16030)',
    'src/data/imp-96148-route-bd-online-margin-decay-law.js (seven-point column stopping at T=395.98, floor c~0.143)',
    'src/data/imp-96020-lp-signed-force-feasibility.js (LP setup, rho(N,T) grid, Gilbert min-norm-point)',
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2 no-universal-sign)',
    'tmp/imp-96209-extend.py (reproduction + extension to gamma_2000).',
  ],
});

const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000;

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000_ASSERTIONS = Object.freeze([
  {
    name: 'reproduction matches the imp-96148 baked and all ten prior extended cutoffs to |delta|<=0.0005',
    holds: () => D.validation.bakedRho.length === 7
      && D.validation.reproducedRho.length === 7
      && D.validation.prevExtRho.length === 10
      && D.validation.reproducedPrevExtRho.length === 10
      && D.validation.bakedRho.every((v, i) => Math.abs(v - D.validation.reproducedRho[i]) <= 0.0005)
      && D.validation.prevExtRho.every((v, i) => Math.abs(v - D.validation.reproducedPrevExtRho[i]) <= 0.0005),
  },
  {
    name: 'extended column adds nine cutoffs beyond T=1419, monotone non-increasing, all strictly positive',
    holds: () => D.extendedT.length === 9 && D.extendedRho.length === 9
      && D.extendedNumCollisions.length === 9
      && D.extendedT.every((t) => t > 1419.0)
      && D.extendedRho.every((v, i) => v > 0 && (i === 0 || v <= D.extendedRho[i - 1] + 1e-9)),
  },
  {
    name: 'the fitted floor does NOT stabilize -- it keeps falling g1000->g2000 (still drifting)',
    holds: () => {
      const f = D.refit.floorByDepth;
      return f.gamma2000 < f.gamma1000 && f.gamma1000 < f.gamma500;
    },
  },
  {
    name: 'the R2 gap does NOT re-widen -- it reverses sign to favour the log-linear no-floor law',
    holds: () => {
      const g = D.refit.r2GapByDepth;
      return g.gamma1000 > 0 && g.gamma2000 < 0 && g.gamma2000 < g.gamma1000;
    },
  },
  {
    name: 'log-linear law now fits marginally better than the reciprocal-log-floor law at gamma_2000',
    holds: () => D.refit.logLinear.R2 > D.refit.reciprocalLogFloor.R2
      && (D.refit.logLinear.R2 - D.refit.reciprocalLogFloor.R2) < 0.02
      && D.refit.reciprocalLogFloor.R2 > 0.97,
  },
  {
    name: 'the SIGN is unchanged: margin stays strictly positive out to gamma_2000, no crossing',
    holds: () => D.extendedRho[D.extendedRho.length - 1] > 0.3
      && D.refit.logLinear.naiveCrossT > 3e5,
  },
  {
    name: 'reading records the still-drifting reinforcement of the imp-96186 correction',
    holds: () => /still-drifting finite-height feature/.test(D.finding.floorStillDrifting)
      && /reinforces/.test(D.finding.floorStillDrifting)
      && /REVERSES SIGN/.test(D.finding.gapReversedSign)
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

for (const a of ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96209-route-bd-online-margin-floor-gamma2000 assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000;
