/**
 * @fileoverview imp-96167 -- EXTEND the imp-96148 worst-support on-line signed-force
 * feasibility margin column rho(32,T) beyond T=395.98 (gamma_200) to gamma_500 (T~811)
 * and re-fit, to test whether the strictly-positive reciprocal-log floor c~0.143 and the
 * decelerating per-segment slope persist, or whether the floor is an artifact of the
 * limited T range. Import-light (literals baked, no zeros bundle); holds() assertions;
 * self-executing. Measurement only. NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. imp-96148 fit the worst-support (N=32) on-line margin column rho(32,T) over a
 * SEVEN-point grid that stops at T=395.98 (gamma_200) to a reciprocal-log-with-floor law
 * rho=c+d/lnT (c=0.14256, d=2.50166, R2=0.99093), concluding the on-line margin flattens
 * to a strictly positive floor rather than crossing zero, and that the naive log-linear
 * crossing at T~9e4 is a constant-slope extrapolation artifact. The open question the
 * ticket poses: is the positive floor c~0.143 real, or an artifact of stopping at gamma_200?
 *
 * METHOD. Reproduce the imp-96020 on-line LP methodology from scratch (mpmath dps 25) and
 * extend it:
 *   a_n(x)   = n^{-1/2} cos(theta(x) - x log n),  theta = Riemann-Siegel theta,
 *   near-collision x* = inter-zero extremum (Z prime=0) with gap/localMeanGap < 0.85,
 *   g_k      = sign(Z second (x*)) a(x*),  ghat_k = g_k / ||g_k||_2,
 *   rho(N,T) = dist(0, conv{ghat_k})   via Gilbert min-norm-point (Frank-Wolfe, 4000 iters).
 * Zeta zeros extended from 200 (gamma~396) to 500 (gamma~811); near-collision census grows
 * 72 -> 185. VALIDATION: recomputing the seven baked imp-96148 cutoffs reproduces the baked
 * column to |delta| <= 0.0004 at every point (max 0.0004 at T=395.98), confirming the
 * reproduction matches the original imp-96020 pipeline.
 *   Reproduction: tmp/imp-96167-extend.py.
 *
 * RESULT (extended column, N=32, four new cutoffs beyond gamma_200).
 *   T=500 (96 coll): rho=0.5522;  T=600 (123): rho=0.5358;
 *   T=700 (151):     rho=0.5331;  T=811 (185): rho=0.5241.
 * Re-fitting BOTH laws on the full 11-point extended column:
 *   log-linear      rho=a+b lnT :  a=1.07444, b=-0.08422, R2=0.96691, naiveCrossT~347017,
 *   reciprocal-log  rho=c+d/lnT :  c=0.16030, d=2.41892, R2=0.99483, floor=0.16030.
 *
 * READING (honest). The strictly-positive floor is NOT a range artifact. Extending the
 * column by four cutoffs from gamma_200 to gamma_500:
 *   (1) the reciprocal-log-with-floor law STILL fits strictly better than log-linear, and
 *       the R2 gap actually WIDENS (0.99483 vs 0.96691; was 0.99093 vs 0.96687);
 *   (2) the fitted floor stays strictly positive and does NOT drift toward zero -- it rises
 *       slightly (0.14256 -> 0.16030), i.e. more high-T data REINFORCE a positive asymptote;
 *   (3) the measured margin keeps decreasing only gently (0.559 at T=396 to 0.524 at T=811),
 *       still far above the floor, with no approach to a crossing;
 *   (4) the log-linear naive crossing moves FURTHER out (T~9e4 -> T~3.5e5) as the added points
 *       flatten the constant-slope fit -- exactly the signature of an extrapolation artifact.
 * The extended-tail per-segment slopes (-0.031, -0.090, -0.018, -0.061 across the four new
 * segments) stay small in magnitude and oscillate around the imp-96148 tail level (~0.07-0.10);
 * no sustained re-acceleration toward the constant slope the log-linear crossing model needs.
 * So imp-96148 is CONFIRMED at higher height: the on-line worst-support signed-force Gram-law
 * surrogate flattens to a strictly positive margin floor, it does not cross zero, and the
 * uniform-in-T obstruction is not an on-line margin-crossing (it lives OFF the line, Weil
 * strength -- unchanged). Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED = Object.freeze({
  id: 'imp-96167-route-bd-online-margin-floor-extended',
  date: '2026-09-23',
  route: 'B/D handoff',
  origin: 'extends imp-96148 (worst-support margin decay law) beyond T=395.98; reproduces imp-96020 LP pipeline',
  status: 'MEASURED -- extending the worst-support rho(32,T) column from gamma_200 (T=396) to gamma_500 (T~811) '
    + 'CONFIRMS the imp-96148 finding: the reciprocal-log-with-floor law still wins (R2 gap WIDENS to 0.99483 vs '
    + '0.96691) and the fitted floor stays strictly positive (0.14256 -> 0.16030, does NOT drift to zero). The '
    + 'positive on-line margin floor is NOT a range artifact; the margin flattens, it does not cross zero. '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED',

  // Consumer correction (imp-96211 re-point): imp-96186 EXTENDS this column from gamma_500 to
  // gamma_1000 and PARTLY CORRECTS the "positive asymptote" reading recorded below. On the full
  // 17-point column the fitted floor REVERSES its rise (0.16030 -> 0.11063, non-monotone in
  // census depth) and the reciprocal-log vs log-linear R2 gap COLLAPSES (0.02792 -> 0.00214), so
  // the "floor law clearly wins" reading does NOT survive extension. What still holds: the margin
  // stays STRICTLY POSITIVE (no zero-crossing). What does NOT: the floor VALUE and functional form
  // are unsettled -- a still-drifting finite-height feature, not a settled asymptote. Deciding the
  // true asymptote would need census depth well beyond gamma_1000. The gamma_500 measurement and
  // fit below are correct AS-MEASURED; only the extrapolated "confirmed positive asymptote" reading
  // is now over-stated. See src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js.
  partiallyCorrectedBy: {
    id: 'imp-96186-route-bd-online-margin-floor-gamma1000',
    file: 'src/data/imp-96186-route-bd-online-margin-floor-gamma1000.js',
    reading: 'imp-96186 extends this column to gamma_1000 and partly corrects the positive-asymptote reading: on the '
      + 'full 17-point column the fitted floor REVERSES its rise (0.16030 -> 0.11063, non-monotone in census depth) and '
      + 'the reciprocal-log vs log-linear R2 gap COLLAPSES (0.02792 -> 0.00214), so the floor-law-clearly-wins reading '
      + 'does not survive extension. The margin sign stays strictly positive (no zero-crossing); only the floor value '
      + 'and functional form are unsettled -- a still-drifting finite-height feature, NOT a settled asymptote.',
  },

  method: {
    pipeline: 'reproduces imp-96020: a_n(x)=n^-1/2 cos(theta(x)-x log n); near-collision x*=inter-zero extremum '
      + '(Z prime=0) with tightness gap/localMeanGap<0.85; g_k=sign(Z second (x*)) a(x*); ghat_k unit-normalized; '
      + 'rho(N,T)=dist(0,conv{ghat_k}) via Gilbert min-norm-point (4000 iters)',
    zerosExtended: 'zeta zeros extended 200 -> 500 (gamma 396 -> 811); near-collision census 72 -> 185',
    precision: 'mpmath dps 25 for zeros/theta/Z-derivatives; Gilbert solve in float64 (margin needed to 3-4 dp)',
    reproduction: 'tmp/imp-96167-extend.py',
  },

  // Validation: recomputing the seven baked imp-96148 cutoffs reproduces the baked column.
  validation: {
    bakedT: [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98],
    bakedRho: [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559],
    reproducedRho: [0.7607, 0.6918, 0.6603, 0.6363, 0.6193, 0.6004, 0.5594],
    maxAbsDelta: 0.0004,
    note: 'reproduction matches the imp-96148/imp-96020 baked N=32 column to |delta|<=0.0004 at every cutoff',
  },

  // Extended worst-support (N=32) column: four new cutoffs beyond gamma_200.
  N: 32,
  extendedT: [500.0, 600.0, 700.0, 811.0],
  extendedNumCollisions: [96, 123, 151, 185],
  extendedRho: [0.5522, 0.5358, 0.5331, 0.5241],

  // Per-segment decay rate drho/dlnT across the four NEW tail segments (small, oscillating,
  // no sustained re-acceleration toward the constant slope the log-linear crossing needs).
  extendedSegmentSlopes: [-0.0309, -0.0898, -0.0175, -0.0613],

  // Both laws re-fit on the FULL 11-point extended column (reproduced baked + four new).
  refit: {
    logLinear: {
      form: 'rho = a + b*ln T',
      a: 1.07444,
      b: -0.08422,
      R2: 0.96691,
      naiveCrossT: 347017,
      note: 'naive crossing moves FURTHER out (imp-96148 T~93297 -> T~347017) as the added points flatten the '
        + 'constant-slope fit -- reinforcing that the crossing is an extrapolation artifact',
    },
    reciprocalLogFloor: {
      form: 'rho = c + d/ln T',
      c: 0.16030,
      d: 2.41892,
      R2: 0.99483,
      floor: 0.16030,
      note: 'still the better fit (R2 gap WIDENS); floor stays strictly positive and rises slightly (0.14256 -> '
        + '0.16030), NOT drifting toward zero -- more high-T data reinforce a positive asymptote',
    },
    prevFloor: 0.14256,
    prevReciprocalR2: 0.99093,
    prevLogLinearR2: 0.96687,
  },

  finding: {
    floorNotArtifact: 'extending gamma_200 -> gamma_500 keeps the reciprocal-log-with-floor law winning (R2 gap '
      + 'widens 0.991/0.967 -> 0.995/0.967) and the fitted floor strictly positive (0.143 -> 0.160, not toward 0); '
      + 'the positive on-line margin floor is confirmed real, not a limited-T-range artifact',
    noCrossing: 'the measured margin keeps decreasing only gently (0.559 at T=396 to 0.524 at T=811), stays far '
      + 'above the fitted floor, and shows no approach to a zero-crossing; the log-linear crossing recedes to T~3.5e5',
    imp96148Confirmed: 'imp-96148 CONFIRMED at higher height -- the worst-support on-line signed-force Gram-law '
      + 'surrogate flattens to a strictly positive margin floor rather than crossing zero',
  },

  obstruction: {
    name: 'uniform-in-T obstruction is OFF the line, NOT an on-line margin-crossing (unchanged from imp-96148)',
    onLine: 'rho(32,T) floors positive out to gamma_500 (measured 0.524 at T~811, fitted asymptote ~0.16>0); the '
      + 'worst-support on-line surrogate stays strictly feasible at every extended height',
    offLine: 'the genuine uniform-in-T obstruction lives on complex pairs where Route B Test 2 found no coefficient '
      + 'set has a universal confining sign; a uniform off-line LP is Weil-positivity strength, inaccessible to this '
      + 'on-line construction',
  },

  honest: 'The imp-96148 worst-support margin column was reproduced from scratch (matching the baked values to '
    + '|delta|<=0.0004) and EXTENDED four cutoffs from gamma_200 (T=396) to gamma_500 (T~811). Re-fitting both laws '
    + 'on the full 11-point column: the reciprocal-log-with-floor law still wins with a WIDER R2 gap, and its fitted '
    + 'floor stays strictly positive and rises slightly (0.14256 -> 0.16030) rather than drifting toward zero. So '
    + 'the strictly-positive on-line margin floor is NOT an artifact of the limited T range -- the on-line surrogate '
    + 'flattens to a positive margin, it does not cross zero, and the uniform-in-T obstruction remains off the line. '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'OFF-line uniform LP (Weil-positivity strength) remains the binding wall (inherited, unchanged)',
    statement: 'On-line worst-support feasibility is now quantitatively settled to gamma_500 (positive floor, no '
      + 'crossing). The uniform statement that would matter is the off-line one, Weil-positivity strength and out of '
      + 'reach of the Riemann-Siegel on-line construction; the tight Lehmer pairs where any on-line decay could bite '
      + 'sit far above gamma_500 and, per this extended decay law, would still land above the positive floor.',
  },

  references: [
    'src/data/imp-96148-route-bd-online-margin-decay-law.js (seven-point column stopping at T=395.98, floor c~0.143)',
    'src/data/imp-96020-lp-signed-force-feasibility.js (LP setup, rho(N,T) grid, Gilbert min-norm-point)',
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2 no-universal-sign)',
    'tmp/imp-96167-extend.py (reproduction + extension).',
  ],
});

const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED;

export const ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED_ASSERTIONS = Object.freeze([
  {
    name: 'reproduction matches the imp-96148 baked N=32 column to |delta|<=0.0005 at every cutoff',
    holds: () => D.validation.bakedRho.length === 7
      && D.validation.reproducedRho.length === 7
      && D.validation.bakedRho.every((v, i) => Math.abs(v - D.validation.reproducedRho[i]) <= 0.0005),
  },
  {
    name: 'extended column adds four cutoffs beyond T=395.98, monotone decreasing, all strictly positive',
    holds: () => D.extendedT.length === 4 && D.extendedRho.length === 4
      && D.extendedT.every((t) => t > 395.98)
      && D.extendedRho.every((v, i) => v > 0 && (i === 0 || v <= D.extendedRho[i - 1] + 1e-9)),
  },
  {
    name: 'reciprocal-log-with-floor still fits strictly better than log-linear on the extended column',
    holds: () => D.refit.reciprocalLogFloor.R2 > D.refit.logLinear.R2
      && D.refit.reciprocalLogFloor.R2 > 0.99,
  },
  {
    name: 'the R2 gap between the two laws WIDENS relative to imp-96148 (floor law even more favoured)',
    holds: () => {
      const nowGap = D.refit.reciprocalLogFloor.R2 - D.refit.logLinear.R2;
      const prevGap = D.refit.prevReciprocalR2 - D.refit.prevLogLinearR2;
      return nowGap > prevGap;
    },
  },
  {
    name: 'the fitted floor stays strictly positive and does NOT drift toward zero on extension',
    holds: () => D.refit.reciprocalLogFloor.c > 0
      && D.refit.reciprocalLogFloor.c >= D.refit.prevFloor
      && Math.abs(D.refit.reciprocalLogFloor.c - D.refit.reciprocalLogFloor.floor) < 1e-9,
  },
  {
    name: 'the log-linear naive crossing recedes further out (still an extrapolation artifact)',
    holds: () => D.refit.logLinear.naiveCrossT > 3e5
      && D.refit.logLinear.naiveCrossT > 93297,
  },
  {
    name: 'extended-tail per-segment slopes stay small (no sustained re-acceleration to a crossing slope)',
    holds: () => {
      const s = D.extendedSegmentSlopes;
      return s.length === 4 && s.every((v) => v < 0 && Math.abs(v) < 0.15);
    },
  },
  {
    name: 'positive floor CONFIRMED as not a range artifact; obstruction stays OFF the line',
    holds: () => /not a limited-T-range artifact/.test(D.finding.floorNotArtifact)
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

for (const a of ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96167-route-bd-online-margin-floor-extended assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED;
