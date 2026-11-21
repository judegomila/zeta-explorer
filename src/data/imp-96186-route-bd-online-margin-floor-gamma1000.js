/**
 * @fileoverview imp-96186 -- EXTEND the imp-96167 worst-support on-line signed-force
 * feasibility margin column rho(32,T) beyond gamma_500 (T~811) to gamma_1000 (T~1419)
 * and re-fit BOTH laws, to decide whether the strictly-positive reciprocal-log floor c
 * keeps rising, stabilizes, or whether the R2 gap keeps widening -- i.e. whether the
 * on-line margin floor is an asymptote or a still-drifting finite-height feature.
 * Import-light (literals baked, no zeros bundle); holds() assertions; self-executing.
 * Measurement only. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. imp-96148 fit the worst-support (N=32) on-line margin rho(32,T) over a seven-
 * point grid stopping at T=395.98 (gamma_200) to rho=c+d/lnT (c=0.14256, R2=0.99093 vs
 * log-linear 0.96687). imp-96167 extended that column to gamma_500 (T~811, four new
 * cutoffs) and read the result as CONFIRMING a positive asymptote: the reciprocal-log law
 * still won with a WIDER R2 gap (0.99483 vs 0.96691) and the fitted floor ROSE slightly
 * (0.14256 -> 0.16030), which imp-96167 called "not a range artifact ... more high-T data
 * reinforce a positive asymptote". The open question this ticket poses: does the floor
 * keep rising / does the R2 gap keep widening as the census deepens further?
 *
 * METHOD. Reproduce the imp-96020/imp-96167 on-line LP pipeline from scratch (mpmath dps
 * 25) and extend it:
 *   a_n(x)   = n^{-1/2} cos(theta(x) - x log n),  theta = Riemann-Siegel theta,
 *   near-collision x* = inter-zero extremum (Z prime=0) with gap/localMeanGap < 0.85,
 *   g_k      = sign(Z second (x*)) a(x*),  ghat_k = g_k / ||g_k||_2,
 *   rho(N,T) = dist(0, conv{ghat_k})   via Gilbert min-norm-point (Frank-Wolfe, 4000 iters).
 * Zeta zeros extended 500 -> 1000 (gamma 811 -> 1419); near-collision census grows
 * 185 -> 378. VALIDATION: recomputing the seven baked imp-96148 cutoffs AND the four
 * imp-96167 extended cutoffs reproduces both baked columns to |delta| <= 0.0004.
 *   Reproduction: tmp/imp-96186-extend.py.
 *
 * RESULT (extended column, N=32, six new cutoffs beyond gamma_500).
 *   T=900 (213 coll): rho=0.4915;  T=1000 (243): rho=0.4914;
 *   T=1100 (276):     rho=0.4840;  T=1200 (307): rho=0.4783;
 *   T=1300 (341):     rho=0.4754;  T=1419 (378): rho=0.4580.
 * Re-fitting BOTH laws on the full 17-point column:
 *   log-linear      rho=a+b lnT :  a=1.07696, b=-0.08475, R2=0.98308, naiveCrossT~330405,
 *   reciprocal-log  rho=c+d/lnT :  c=0.11063, d=2.66112, R2=0.98522, floor=0.11063.
 *
 * READING (honest -- this PARTLY CORRECTS the imp-96167 over-reading). Deepening the census
 * from gamma_500 to gamma_1000 does NOT continue either trend imp-96167 reported:
 *   (1) the fitted floor does NOT keep rising -- it REVERSES: 0.14256 (g200) -> 0.16030
 *       (g500) -> 0.11063 (g1000). The rise was itself a finite-height feature; the floor
 *       is non-monotone in census depth, so it is NOT yet a settled asymptote;
 *   (2) the R2 gap does NOT keep widening -- it COLLAPSES: 0.02406 (g200) -> 0.02792 (g500)
 *       -> 0.00214 (g1000). At gamma_1000 the reciprocal-log and log-linear laws become
 *       nearly indistinguishable (both R2~0.985), so the fit no longer discriminates the
 *       two functional forms -- the "floor law clearly wins" reading of imp-96167 does not
 *       survive extension. So the ANSWER to the ticket is: STILL-DRIFTING finite-height
 *       feature, NOT an established asymptote.
 * BUT the qualitative conclusion imp-96148/imp-96167 rest on is UNCHANGED: the margin stays
 * strictly positive and shows no approach to a crossing -- rho falls only gently to 0.4580
 * at T~1419, still ~4x above even the reduced fitted floor, and the log-linear naive
 * crossing still sits far out at T~3.3e5. So the on-line worst-support surrogate remains
 * strictly feasible at every extended height; what is UNSETTLED is the numeric floor value
 * and the functional form, not the sign. The uniform-in-T obstruction still lives OFF the
 * line (Weil-positivity strength), inaccessible to this on-line construction -- unchanged.
 * Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000 = Object.freeze({
  id: 'imp-96186-route-bd-online-margin-floor-gamma1000',
  date: '2026-09-23',
  route: 'B/D handoff',
  origin: 'extends imp-96167 (worst-support margin column at gamma_500) to gamma_1000; reproduces imp-96020 LP pipeline',
  status: 'MEASURED -- extending the worst-support rho(32,T) column from gamma_500 (T~811) to gamma_1000 (T~1419) '
    + 'shows the on-line margin floor is a STILL-DRIFTING finite-height feature, NOT a settled asymptote: the fitted '
    + 'floor REVERSES its rise (0.16030 -> 0.11063) and the reciprocal-log/log-linear R2 gap COLLAPSES (0.02792 -> '
    + '0.00214, both laws ~0.985). This partly corrects the imp-96167 "positive asymptote" reading. The margin still '
    + 'stays strictly positive (0.4580 at T~1419, no crossing; log-linear cross recedes to T~3.3e5). '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED',

  method: {
    pipeline: 'reproduces imp-96020/imp-96167: a_n(x)=n^-1/2 cos(theta(x)-x log n); near-collision x*=inter-zero '
      + 'extremum (Z prime=0) with tightness gap/localMeanGap<0.85; g_k=sign(Z second (x*)) a(x*); ghat_k unit-norm; '
      + 'rho(N,T)=dist(0,conv{ghat_k}) via Gilbert min-norm-point (4000 iters)',
    zerosExtended: 'zeta zeros extended 500 -> 1000 (gamma 811 -> 1419); near-collision census 185 -> 378',
    precision: 'mpmath dps 25 for zeros/theta/Z-derivatives; Gilbert solve in float64 (margin needed to 3-4 dp)',
    reproduction: 'tmp/imp-96186-extend.py',
  },

  // Validation: recomputing the seven baked imp-96148 cutoffs AND the four imp-96167
  // extended cutoffs reproduces both baked columns.
  validation: {
    bakedT: [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98],
    bakedRho: [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559],
    reproducedRho: [0.7607, 0.6918, 0.6603, 0.6363, 0.6193, 0.6004, 0.5594],
    prevExtT: [500.0, 600.0, 700.0, 811.0],
    prevExtRho: [0.5522, 0.5358, 0.5331, 0.5241],
    reproducedPrevExtRho: [0.5522, 0.5358, 0.5331, 0.5241],
    maxAbsDelta: 0.0004,
    note: 'reproduction matches the imp-96148 baked column and the imp-96167 extended column to |delta|<=0.0004',
  },

  // Extended worst-support (N=32) column: six new cutoffs beyond gamma_500.
  N: 32,
  extendedT: [900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0],
  extendedNumCollisions: [213, 243, 276, 307, 341, 378],
  extendedRho: [0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580],

  // Per-segment decay rate drho/dlnT across the new tail segments (still small on average,
  // oscillating; no sustained re-acceleration toward the constant log-linear crossing slope).
  extendedSegmentSlopes: [-0.3130, -0.0009, -0.0774, -0.0654, -0.0364, -0.1992],

  // Both laws re-fit on the FULL 17-point extended column (baked + imp-96167 ext + new).
  refit: {
    numPoints: 17,
    logLinear: {
      form: 'rho = a + b*ln T',
      a: 1.07696,
      b: -0.08475,
      R2: 0.98308,
      naiveCrossT: 330405,
      note: 'naive crossing still sits far out at T~3.3e5 (imp-96167 T~347017), consistent with an extrapolation '
        + 'artifact; but the log-linear R2 has RISEN sharply (0.96691 -> 0.98308), nearly catching the floor law',
    },
    reciprocalLogFloor: {
      form: 'rho = c + d/ln T',
      c: 0.11063,
      d: 2.66112,
      R2: 0.98522,
      floor: 0.11063,
      note: 'still marginally the better fit, but the fitted floor REVERSES its rise (0.16030 -> 0.11063) rather than '
        + 'stabilizing -- the floor is non-monotone in census depth, so it is NOT an established asymptote',
    },
    // Floor drift across census depth (non-monotone: rose then fell).
    floorByDepth: { gamma200: 0.14256, gamma500: 0.16030, gamma1000: 0.11063 },
    // R2 gap (recip - loglin) by census depth (widened then collapsed).
    r2GapByDepth: { gamma200: 0.02406, gamma500: 0.02792, gamma1000: 0.00214 },
  },

  finding: {
    floorStillDrifting: 'deepening gamma_500 -> gamma_1000 REVERSES the floor rise (0.14256 -> 0.16030 -> 0.11063) '
      + 'and COLLAPSES the R2 gap (0.02406 -> 0.02792 -> 0.00214); the strictly-positive on-line margin floor is a '
      + 'still-drifting finite-height feature, NOT an established asymptote -- this partly corrects the imp-96167 '
      + '"more high-T data reinforce a positive asymptote" reading',
    lawsNoLongerDiscriminated: 'at gamma_1000 the reciprocal-log-with-floor and log-linear laws fit almost equally '
      + '(R2 0.98522 vs 0.98308); the fit no longer selects a functional form, so neither the floor value nor the '
      + 'log-linear crossing can be trusted as an asymptotic prediction from this census depth',
    noCrossing: 'the measured margin keeps decreasing only gently (0.5241 at T~811 to 0.4580 at T~1419), stays ~4x '
      + 'above even the reduced fitted floor, and shows no approach to a zero-crossing; the log-linear naive crossing '
      + 'stays at T~3.3e5 -- the SIGN of the on-line margin (strictly feasible) is unchanged; only its numeric floor '
      + 'and functional form are unsettled',
  },

  obstruction: {
    name: 'uniform-in-T obstruction is OFF the line, NOT an on-line margin-crossing (unchanged from imp-96148/96167)',
    onLine: 'rho(32,T) stays strictly positive out to gamma_1000 (measured 0.4580 at T~1419); the worst-support '
      + 'on-line surrogate remains strictly feasible at every extended height, whatever the unsettled asymptotic floor',
    offLine: 'the genuine uniform-in-T obstruction lives on complex pairs where Route B Test 2 found no coefficient '
      + 'set has a universal confining sign; a uniform off-line LP is Weil-positivity strength, inaccessible to this '
      + 'on-line construction',
  },

  honest: 'The imp-96148 baked column AND the imp-96167 gamma_500 extension were reproduced from scratch (matching '
    + 'both to |delta|<=0.0004) and the census was EXTENDED six cutoffs from gamma_500 (T~811) to gamma_1000 (T~1419). '
    + 'Re-fitting both laws on the full 17-point column: the fitted floor REVERSES its imp-96167 rise (0.16030 -> '
    + '0.11063) and the R2 gap between the two laws COLLAPSES (0.02792 -> 0.00214, both ~0.985). So the strictly-'
    + 'positive on-line margin floor is a STILL-DRIFTING finite-height feature, not the settled positive asymptote '
    + 'imp-96167 read into the gamma_500 column -- deciding the true asymptote would need census depth well beyond '
    + 'gamma_1000 (or an off-line argument). What IS stable across all depths is the sign: the margin stays strictly '
    + 'positive with no crossing (0.4580 at T~1419), and the uniform-in-T obstruction stays off the line. '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'the on-line margin floor VALUE / functional form is not asymptotically settled by gamma_1000 (finite-height drift)',
    statement: 'The SIGN of the on-line worst-support margin is now settled to gamma_1000 (strictly positive, no '
      + 'crossing). What is NOT settled is its asymptotic floor: the fitted floor is non-monotone in census depth '
      + '(0.143 -> 0.160 -> 0.111) and at gamma_1000 the floor and log-linear laws are statistically '
      + 'indistinguishable. Deciding whether the true floor is positive, zero, or the log-linear form eventually '
      + 'holds would need census depth far beyond gamma_1000 -- and even a settled positive floor would only confirm '
      + 'on-line feasibility, not the OFF-line uniform LP (Weil-positivity strength) that is the actual binding wall.',
  },

  references: [
    'src/data/imp-96167-route-bd-online-margin-floor-extended.js (gamma_500 column, floor rose to 0.16030)',
    'src/data/imp-96148-route-bd-online-margin-decay-law.js (seven-point column stopping at T=395.98, floor c~0.143)',
    'src/data/imp-96020-lp-signed-force-feasibility.js (LP setup, rho(N,T) grid, Gilbert min-norm-point)',
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2 no-universal-sign)',
    'tmp/imp-96186-extend.py (reproduction + extension to gamma_1000).',
  ],
});

const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000;

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000_ASSERTIONS = Object.freeze([
  {
    name: 'reproduction matches the imp-96148 baked and imp-96167 extended columns to |delta|<=0.0005',
    holds: () => D.validation.bakedRho.length === 7
      && D.validation.reproducedRho.length === 7
      && D.validation.bakedRho.every((v, i) => Math.abs(v - D.validation.reproducedRho[i]) <= 0.0005)
      && D.validation.prevExtRho.every((v, i) => Math.abs(v - D.validation.reproducedPrevExtRho[i]) <= 0.0005),
  },
  {
    name: 'extended column adds six cutoffs beyond T=811, monotone non-increasing, all strictly positive',
    holds: () => D.extendedT.length === 6 && D.extendedRho.length === 6
      && D.extendedT.every((t) => t > 811.0)
      && D.extendedRho.every((v, i) => v > 0 && (i === 0 || v <= D.extendedRho[i - 1] + 1e-9)),
  },
  {
    name: 'the fitted floor is NON-monotone in census depth: rose g200->g500, then FELL g500->g1000',
    holds: () => {
      const f = D.refit.floorByDepth;
      return f.gamma500 > f.gamma200 && f.gamma1000 < f.gamma500;
    },
  },
  {
    name: 'the R2 gap did NOT keep widening -- it collapsed at gamma_1000 (both laws ~0.985)',
    holds: () => {
      const g = D.refit.r2GapByDepth;
      return g.gamma500 > g.gamma200 && g.gamma1000 < g.gamma500 && g.gamma1000 < 0.01;
    },
  },
  {
    name: 'reciprocal-log floor still >0 but the two laws are now nearly indistinguishable in fit',
    holds: () => D.refit.reciprocalLogFloor.c > 0
      && D.refit.reciprocalLogFloor.R2 > D.refit.logLinear.R2
      && (D.refit.reciprocalLogFloor.R2 - D.refit.logLinear.R2) < 0.01
      && D.refit.logLinear.R2 > 0.98,
  },
  {
    name: 'the SIGN is unchanged: margin stays strictly positive out to gamma_1000, no crossing',
    holds: () => D.extendedRho[D.extendedRho.length - 1] > 0.3
      && D.refit.logLinear.naiveCrossT > 3e5,
  },
  {
    name: 'reading records the still-drifting finite-height correction to imp-96167',
    holds: () => /still-drifting finite-height feature/.test(D.finding.floorStillDrifting)
      && /corrects/.test(D.finding.floorStillDrifting)
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

for (const a of ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96186-route-bd-online-margin-floor-gamma1000 assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000;
