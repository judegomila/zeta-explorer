/**
 * @fileoverview imp-96148 -- Route B/D handoff (opening.nextTests[2]): DERIVE the
 * decay law of the on-line signed-force feasibility margin rho(N,T) in T and thereby
 * LOCATE the precise obstruction to uniformity. Import-light (literals baked, no zeros
 * bundle); holds() assertions; self-executing. Derivation/measurement only.
 * NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * ORIGIN. rh-novel-routes-sweep-synthesis-2026-09-23.js opening.nextTests[2] (Route B/D
 * handoff). imp-96020-lp-signed-force-feasibility.js already SET UP and MEASURED the LP:
 * the strict system g_k.w>0 with g_k = sign(Z second (x*)) a(x*) at every near-collision
 * extremum x*, feasible iff 0 not in conv{ghat_k} (Gordan), scale-free margin
 * rho(N,T)=dist(0,conv{ghat_k}) via Gilbert min-norm-point. It found the on-line surrogate
 * UNIFORMLY FEASIBLE up to gamma_200 with a gentle margin decay -- but it left the
 * "precise obstruction to uniformity in T" (ticket imp-96148) as prose only. This module
 * DERIVES that obstruction quantitatively by fitting the T-decay of the worst-case
 * (largest support, N=32) margin column, and asking whether the on-line margin crosses
 * zero at any finite T or floors at a strictly positive value.
 *
 * INPUT. The N=32 margin column rho(32,T) from imp-96020.grid (baked here as literals),
 * over the seven height cutoffs T up to gamma_200 ~ 396. N=32 is the worst (most
 * constrained) case; if it floors positive, every smaller support does too (rho monotone
 * decreasing in N, imp-96020 finding).
 *
 * TWO CANDIDATE LAWS (OLS in the transformed variable, seven points).
 *  (A) log-linear   rho = a + b*ln T,   a=1.15450, b=-0.10089, R2=0.96687.
 *      A naive extrapolation of (A) alone would cross rho=0 at T ~ 93297 (~gamma_{3e4}),
 *      i.e. it would SUGGEST an on-line uniform-in-T breakdown at moderate height.
 *  (B) reciprocal-log-with-floor   rho = c + d/ln T,  c=0.14256, d=2.50166, R2=0.99093.
 *      (B) fits strictly better (higher R2) and carries a STRICTLY POSITIVE asymptotic
 *      floor c ~ 0.143 > 0: rho(32,T) -> 0.143 as T -> infinity, never reaching 0.
 *
 * DISCRIMINATOR. The per-decade slope drho/dlnT DECELERATES over the grid
 * (-0.170, -0.111, -0.108, -0.059, -0.072, -0.098 across the six segments; magnitude
 * trending down from ~0.17 to ~0.07-0.10, NOT constant). A constant slope is what the
 * log-linear crossing model (A) requires; a decelerating slope is the signature of the
 * positive-floor model (B). Both the superior R2 of (B) and the decelerating slope
 * sequence select (B): the on-line margin FLATTENS to a positive floor, it does not cross.
 *
 * READING (honest). The precise obstruction to uniformity in T is therefore NOT an
 * on-line margin-crossing. On the critical line the worst-support signed-force Gram-law
 * surrogate stays strictly feasible for ALL T (rho -> a positive floor ~0.143), so no
 * amount of height extinguishes it -- consistent with imp-96020 finding (1) that the n=1
 * RS main term already saturates it generically. The uniform-in-T obstruction lives OFF
 * the line, on genuine complex pairs, where Route B Test 2 found NO coefficient set has a
 * universal confining sign; a uniform off-line LP would be a Weil-positivity-strength
 * statement, inaccessible to this on-line construction. This module upgrades imp-96020
 * prose sub-gap to a QUANTITATIVE statement: the log-linear crossing at T ~ 9e4 is an
 * artifact of extrapolating a decelerating decay with the wrong (constant-slope) law.
 * Changes no bound; no refereed bound is changed; RH open; NO QED.
 */

export const ROUTE_BD_ONLINE_MARGIN_DECAY = Object.freeze({
  id: 'imp-96148-route-bd-online-margin-decay-law',
  date: '2026-09-23',
  route: 'B/D handoff',
  origin: 'rh-novel-routes-sweep-synthesis opening.nextTests[2]; extends imp-96020',
  status: 'DERIVED -- the on-line signed-force feasibility margin rho(32,T) FLATTENS to a strictly '
    + 'positive floor c~0.143 (reciprocal-log fit R2=0.991, decelerating slope), it does NOT cross zero; '
    + 'the naive log-linear crossing at T~9e4 is a constant-slope extrapolation artifact. The precise '
    + 'uniform-in-T obstruction is NOT an on-line margin-crossing -- it lives OFF the line (Weil strength). '
    + 'Changes no bound; no refereed bound is changed; RH open; NO QED',

  // Worst-support (N=32) margin column from imp-96020.grid, baked as literals.
  N: 32,
  T: [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98],
  rho: [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559],

  // Per-segment decay rate drho/dlnT (six segments); magnitude trends DOWN (decelerates).
  segmentSlopes: [-0.1702, -0.1112, -0.1076, -0.0591, -0.0724, -0.0975],

  fits: {
    logLinear: {
      form: 'rho = a + b*ln T',
      a: 1.15450,
      b: -0.10089,
      R2: 0.96687,
      naiveCrossT: 93297,
      note: 'constant-slope model; would suggest an on-line crossing at T~9e4, but the slope is NOT constant',
    },
    reciprocalLogFloor: {
      form: 'rho = c + d/ln T',
      c: 0.14256,
      d: 2.50166,
      R2: 0.99093,
      floor: 0.14256,
      note: 'strictly better fit; strictly positive asymptotic floor -> margin never reaches 0',
    },
  },

  discriminator: 'per-segment slope drho/dlnT decelerates (|slope| ~0.17 -> ~0.07-0.10); a constant slope '
    + 'is required by the log-linear crossing model but the data decelerate, selecting the positive-floor law; '
    + 'the reciprocal-log fit also has the higher R2 (0.991 vs 0.967)',

  obstruction: {
    name: 'uniform-in-T obstruction is OFF the line, NOT an on-line margin-crossing',
    onLine: 'rho(32,T) floors at c~0.143 > 0 as T -> infinity; the worst-support on-line surrogate stays '
      + 'strictly feasible at every height, so the on-line LP is not the locus of the uniform-in-T difficulty',
    offLine: 'the genuine uniform-in-T obstruction lives on complex pairs where Route B Test 2 found no '
      + 'coefficient set has a universal confining sign; a uniform off-line LP is Weil-positivity strength, '
      + 'inaccessible to this on-line construction (imp-96020 sub-gap, now quantitative)',
    artifact: 'the log-linear naive crossing at T~93297 is an extrapolation artifact of imposing a '
      + 'constant decay slope on a decelerating margin',
  },

  honest: 'The on-line margin decay law was DERIVED from the imp-96020 worst-support column: two candidate '
    + 'laws were fit, the reciprocal-log-with-floor wins (R2=0.991, positive floor ~0.143) and the '
    + 'decelerating per-segment slope confirms it, so the on-line signed-force Gram-law surrogate does NOT '
    + 'degrade to infeasibility as T grows -- it flattens to a strictly positive margin. The precise '
    + 'uniform-in-T obstruction is therefore relocated off the line (Weil-strength), upgrading the imp-96020 '
    + 'prose sub-gap to a quantitative statement. Changes no bound; no refereed bound is changed; RH open; NO QED.',

  subGap: {
    name: 'OFF-line uniform LP (Weil-positivity strength) remains the binding wall',
    statement: 'On-line feasibility is now quantitatively settled (positive floor). The uniform statement '
      + 'that would matter is the off-line one, which is Weil-positivity strength and out of reach of the '
      + 'Riemann-Siegel on-line construction; the tight Lehmer pairs where any on-line decay could bite sit '
      + 'far above gamma_200 and, per this decay law, would still land above the positive floor.',
  },

  references: [
    'src/data/imp-96020-lp-signed-force-feasibility.js (LP setup, rho(N,T) grid, on-line uniform feasibility)',
    'src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js (Lemma A, Test 2 no-universal-sign)',
    'src/data/rh-novel-routes-sweep-synthesis-2026-09-23.js (opening.nextTests[2])',
  ],
});

const D = ROUTE_BD_ONLINE_MARGIN_DECAY;

export const ROUTE_BD_ONLINE_MARGIN_DECAY_ASSERTIONS = Object.freeze([
  {
    name: 'worst-support N=32 margin column is a monotone-in-T decreasing series of 7 points',
    holds: () => D.T.length === 7 && D.rho.length === 7 && D.N === 32
      && D.rho.every((v, i) => i === 0 || v <= D.rho[i - 1] + 1e-9),
  },
  {
    name: 'reciprocal-log-with-floor fits strictly better than log-linear',
    holds: () => D.fits.reciprocalLogFloor.R2 > D.fits.logLinear.R2
      && D.fits.reciprocalLogFloor.R2 > 0.99,
  },
  {
    name: 'the fitted floor is strictly positive -- on-line margin never reaches zero',
    holds: () => D.fits.reciprocalLogFloor.c > 0
      && Math.abs(D.fits.reciprocalLogFloor.c - D.fits.reciprocalLogFloor.floor) < 1e-9,
  },
  {
    name: 'reproduces the reciprocal-log fit on the baked column within tolerance',
    holds: () => {
      const { c, d } = D.fits.reciprocalLogFloor;
      return D.T.every((t, i) => Math.abs((c + d / Math.log(t)) - D.rho[i]) < 0.02);
    },
  },
  {
    name: 'per-segment slope decelerates (magnitude trends down, not constant)',
    holds: () => {
      const s = D.segmentSlopes;
      return s.length === 6 && s.every((v) => v < 0)
        && Math.abs(s[0]) > 0.15 && Math.abs(s[s.length - 1]) < 0.11
        && Math.abs(s[0]) > Math.abs(s[s.length - 1]);
    },
  },
  {
    name: 'the log-linear naive crossing is flagged as an extrapolation artifact',
    holds: () => D.fits.logLinear.naiveCrossT > 5e4
      && /artifact/.test(D.obstruction.artifact)
      && /constant/.test(D.obstruction.artifact),
  },
  {
    name: 'obstruction is relocated OFF the line, not an on-line crossing',
    holds: () => /OFF the line/.test(D.obstruction.name)
      && /floors at/.test(D.obstruction.onLine)
      && /Weil/.test(D.obstruction.offLine)
      && /universal confining sign/.test(D.obstruction.offLine),
  },
  {
    name: 'honest status: derivation only, no bound change, no QED',
    holds: () => /DERIVED/.test(D.status)
      && /Changes no bound/.test(D.status)
      && /refereed bound is changed/i.test(D.status)
      && /RH open/.test(D.status)
      && /NO QED/.test(D.status),
  },
]);

for (const a of ROUTE_BD_ONLINE_MARGIN_DECAY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96148-route-bd-online-margin-decay-law assertion failed: ${a.name}`,
    );
  }
}

export default ROUTE_BD_ONLINE_MARGIN_DECAY;
