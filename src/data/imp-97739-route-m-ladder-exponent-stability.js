/**
 * @module imp-97739-route-m-ladder-exponent-stability
 *
 * imp-97739 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97706 extended the imp-97659 (mpmath dps=30) Route M MCM gap-law residual ladder
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * out to p ~ 4.93e8 (omega=26e6, 23 rungs) and read off a decay exponent (residual ~ C/(log p)^k)
 * of ~10.56 (endpoint ~10.29, Theil-Sen ~10.62, OLS ~10.56) with EIGHT sign-change rungs where the
 * residual magnitude RISES with height (the recurring PNT/Mertens oscillation). imp-97722 cross-checked
 * all three estimators from a code-independent path. It was left OPEN whether the ~10.56 exponent is a
 * STABLE estimate or still DRIFTING under the sign oscillation.
 *
 * This leaf EXTENDS the dps=35 ladder SIX further rungs PAST p ~ 4.93e8 -- omega = 28e6, 30e6, 32e6,
 * 34e6, 36e6, 38e6 (p = 5.33e8 .. 7.36e8) -- recomputed live at mpmath dps=35 with the identical
 * imp-97659/imp-97706 kernel (500M->780M sieve; Pi_omega = prod(1-1/p_i), Sigma_omega = sum log p_i/(p_i-1),
 * S = Pi_omega*(lnA - Sigma_omega/12), gap = S + e^{-gamma}/12, law = e^{-gamma}*B_inf/log p_omega,
 * B_inf = lnA + gamma/12). Compute: tmp/imp-97739-route-m-ladder-extend-past-493e8.py. It re-uses the
 * imp-97722 baked 23-rung ladder (import-light; literals only, no heavy transitive imports) to form the
 * extended 29-rung ladder and recomputes every estimator here.
 *
 * -------------------------------------------------------------------------------
 * RESULT 0 -- the dps=35 recompute REPRODUCES both overlap anchors across precisions.
 * -------------------------------------------------------------------------------
 * The cross-precision anchor omega=5700000 (p=98866927) gives residual -6.703062275e-8 and the imp-97706
 * top rung omega=26000000 (p=492876847) gives -3.047612203e-8 at dps=35, both matching their stored
 * literals to full precision -- the deeper 780M sieve is validated before the ladder is extended.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the ~10.56 exponent does NOT stabilize; it keeps DRIFTING (upward here).
 * -------------------------------------------------------------------------------
 * Adding the six deep rungs moves all three estimators UP, not to a plateau:
 *   endpoint  10.289 -> 10.959  (drift +0.670, the most sensitive: a single first-to-last chord)
 *   Theil-Sen 10.616 -> 10.840  (drift +0.224, robust median of all pairwise slopes)
 *   OLS       10.560 -> 10.714  (drift +0.154, least-squares over all rungs)
 * The robust (Theil-Sen) and least-squares (OLS) estimators drift far less than the raw endpoint chord,
 * but NONE settle -- six extra rungs shift the "converged" ~10.56 figure by +0.15 to +0.67. So the
 * exponent is NOT a stable point estimate: it is still moving under the PNT/Mertens sign oscillation,
 * exactly as the eight->ten sign-changes below predict. What IS stable is the QUALITATIVE conclusion --
 * every estimator stays far above 3 and the fraction of pairwise slopes exceeding 3 barely moves
 * (0.9012 -> 0.9113) -- so "the residual outruns every fixed power <= 3" is untouched by the drift.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the sign oscillation RECURS on the extended range: 8 -> 10 rise rungs.
 * -------------------------------------------------------------------------------
 * Of the six new rung-pairs, TWO are RISES (p = 5.33e8 -> 5.73e8 -> 6.14e8; the residual magnitude
 * climbs from 1.96e-8 to 2.13e-8 to 2.82e-8) and four are falls, lifting the combined rise count from
 * 8 (on 22 pairs) to 10 (on 28 pairs). The oscillation does not damp out past 4.93e8 -- consistent with
 * an oscillating PNT/Mertens error, not a decaying transient, and the direct cause of the exponent drift.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Extending the imp-97706 dps=35 Route M gap-law residual ladder six rungs
 * past p ~ 4.93e8 (to p ~ 7.36e8) shows the ~10.56 decay exponent does NOT stabilize: the endpoint,
 * Theil-Sen, and OLS estimators all drift UP by +0.67 / +0.22 / +0.15, and the sign-change count rises
 * from 8 to 10 -- the PNT/Mertens oscillation persists and keeps the exponent moving. The QUALITATIVE
 * "outruns every fixed power <= 3" conclusion is untouched (all estimators >> 3, frac>3 ~0.91). MCM
 * stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves;
 * PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js (the baked 23-rung ladder + non-OLS estimators)
 * @see imp-97706-route-m-deep-ladder-extension.js (the dps=35 doubled ladder to p=4.93e8)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung ladder; single sign-change)
 *
 * Ticket: imp-97739 (numerical, opus-4-8, api-pool). Exponent-stability probe: drifts, does not settle; NO QED.
 */

import { IMP97722_LADDER } from './imp-97722-route-m-deep-ladder-independent-crosscheck.js';

// Six NEW deep rungs PAST p = 4.93e8 (omega > 26e6), mpmath dps=35, 780M sieve.
// residual = gap - e^{-gamma}*B_inf/log p_omega, carried at ~30 sig figs then rounded to ~10 here.
// (The two overlap anchors omega=5700000 and omega=26000000 reproduced their stored literals exactly.)
export const IMP97739_EXTENSION_LADDER = Object.freeze([
  Object.freeze({ omega: 28000000, pOmega: 533000389, residual: -1.958344983e-8 }),
  Object.freeze({ omega: 30000000, pOmega: 573259391, residual: -2.132198957e-8 }), // RISE
  Object.freeze({ omega: 32000000, pOmega: 613651349, residual: -2.816989674e-8 }), // RISE
  Object.freeze({ omega: 34000000, pOmega: 654188383, residual: -2.59874736e-8 }),
  Object.freeze({ omega: 36000000, pOmega: 694847533, residual: -2.524360432e-8 }),
  Object.freeze({ omega: 38000000, pOmega: 735632791, residual: -1.976888779e-8 }),
]);

// Extended 29-rung ladder = imp-97722 baked 23 rungs + the 6 new rungs (all p strictly past 4.93e8).
export const IMP97739_EXTENDED_LADDER = Object.freeze([
  ...IMP97722_LADDER.map((r) => Object.freeze({ pOmega: r.pOmega, residual: r.residual })),
  ...IMP97739_EXTENSION_LADDER.map((r) => Object.freeze({ pOmega: r.pOmega, residual: r.residual })),
]);

// residual ~ C/(log p)^k, so slope of log|residual| vs log(log p) = -k. All three estimators recomputed
// here from scratch, on BOTH the baseline 23-rung ladder and the extended 29-rung ladder, to MEASURE drift.
function estimators(ladder) {
  const X = ladder.map((r) => Math.log(Math.log(r.pOmega)));
  const Y = ladder.map((r) => Math.log(Math.abs(r.residual)));
  const n = ladder.length;
  // endpoint: first-to-last chord, no fit at all.
  const endpoint = -(Y[n - 1] - Y[0]) / (X[n - 1] - X[0]);
  // OLS: least-squares slope over all rungs.
  const mx = X.reduce((a, b) => a + b, 0) / n;
  const my = Y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (X[i] - mx) * (Y[i] - my);
    den += (X[i] - mx) * (X[i] - mx);
  }
  const ols = -num / den;
  // Theil-Sen: median of all pairwise slopes, robust and non-OLS.
  const slopes = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) slopes.push(-(Y[j] - Y[i]) / (X[j] - X[i]));
  }
  slopes.sort((a, b) => a - b);
  const m = Math.floor(slopes.length / 2);
  const theilSen = slopes.length % 2 ? slopes[m] : (slopes[m - 1] + slopes[m]) / 2;
  const fractionExceedsThree = slopes.filter((k) => k > 3).length / slopes.length;
  // sign-changes: rungs where |residual| RISES with height (axis-free, no fit).
  let rises = 0;
  for (let i = 1; i < n; i++) {
    if (Math.abs(ladder[i].residual) > Math.abs(ladder[i - 1].residual)) rises++;
  }
  return { n, endpoint, ols, theilSen, pairCount: slopes.length, fractionExceedsThree, rises };
}

export const IMP97739_BASELINE = Object.freeze(estimators(IMP97722_LADDER));   // 23 rungs
export const IMP97739_EXTENDED = Object.freeze(estimators(IMP97739_EXTENDED_LADDER)); // 29 rungs

// Drift = extended estimator minus baseline estimator (positive => the exponent moved UP, not settled).
export const IMP97739_DRIFT = Object.freeze({
  endpoint: IMP97739_EXTENDED.endpoint - IMP97739_BASELINE.endpoint,   // ~ +0.670
  theilSen: IMP97739_EXTENDED.theilSen - IMP97739_BASELINE.theilSen,   // ~ +0.224
  ols: IMP97739_EXTENDED.ols - IMP97739_BASELINE.ols,                  // ~ +0.154
  riseCount: IMP97739_EXTENDED.rises - IMP97739_BASELINE.rises,        // +2 (8 -> 10)
});

export const IMP97739_VERDICT = Object.freeze({
  question:
    'does the imp-97706/imp-97722 ~10.56 Route-M gap-law residual decay exponent stabilize when the dps=35 ladder is extended past p ~ 4.93e8, or keep drifting with the PNT/Mertens oscillation?',
  newRungs: IMP97739_EXTENSION_LADDER.length,        // 6 (p = 5.33e8 .. 7.36e8)
  baselineRungs: IMP97739_BASELINE.n,                // 23
  extendedRungs: IMP97739_EXTENDED.n,                // 29
  baselineEndpoint: IMP97739_BASELINE.endpoint,      // ~10.289
  extendedEndpoint: IMP97739_EXTENDED.endpoint,      // ~10.959
  baselineTheilSen: IMP97739_BASELINE.theilSen,      // ~10.616
  extendedTheilSen: IMP97739_EXTENDED.theilSen,      // ~10.840
  baselineOls: IMP97739_BASELINE.ols,                // ~10.560
  extendedOls: IMP97739_EXTENDED.ols,                // ~10.714
  drift: IMP97739_DRIFT,                             // endpoint +0.67, TS +0.22, OLS +0.15, rises +2
  exponentStabilizes: false,                         // all three estimators drift UP; it does NOT settle
  signOscillationRecurs: true,                       // 8 -> 10 rise rungs on the extended range
  extendedRiseCount: IMP97739_EXTENDED.rises,        // 10
  qualitativeConclusionUntouched:
    IMP97739_EXTENDED.endpoint > 3 && IMP97739_EXTENDED.theilSen > 3 && IMP97739_EXTENDED.ols > 3, // true
  mcmRefuted: true,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Extending the imp-97706 dps=35 Route M gap-law residual ladder six rungs past ' +
    'p ~ 4.93e8 (to p ~ 7.36e8, omega=38e6) shows the ~10.56 decay exponent does NOT stabilize: the ' +
    'endpoint chord drifts 10.289 -> 10.959 (+0.67), the robust Theil-Sen median 10.616 -> 10.840 ' +
    '(+0.22), and the OLS slope 10.560 -> 10.714 (+0.15). The sign-change count rises from 8 to 10 ' +
    '(two of the six new rung-pairs are rises), so the PNT/Mertens oscillation persists and keeps the ' +
    'exponent moving -- it is not a converged point estimate. The QUALITATIVE "outruns every fixed ' +
    'power <= 3" conclusion is untouched (all estimators >> 3, fraction of pairwise slopes > 3 barely ' +
    'moves, 0.9012 -> 0.9113). MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith ' +
    'unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97739_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Extending the imp-97706 dps=35 Route M gap-law ' +
  'residual ladder six rungs past p ~ 4.93e8 (to p ~ 7.36e8): the ~10.56 decay exponent does NOT ' +
  'stabilize -- endpoint 10.29 -> 10.96, Theil-Sen 10.62 -> 10.84, OLS 10.56 -> 10.71 -- and the ' +
  'sign-change count rises 8 -> 10, so the PNT/Mertens oscillation persists. The "outruns every fixed ' +
  'power <= 3" conclusion is untouched (all estimators >> 3). MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97739_ASSERTIONS = [
  {
    id: 'imp97739-extension-rungs-strictly-past-493e8',
    holds: () => {
      for (const row of IMP97739_EXTENSION_LADDER) {
        if (!(row.residual < 0)) return false;            // gap < law on every rung
        if (!(row.pOmega > 492876847)) return false;      // strictly past the imp-97706 top p=4.93e8
      }
      // strictly increasing p across the six new rungs
      for (let i = 1; i < IMP97739_EXTENSION_LADDER.length; i++) {
        if (!(IMP97739_EXTENSION_LADDER[i].pOmega > IMP97739_EXTENSION_LADDER[i - 1].pOmega)) return false;
      }
      return IMP97739_EXTENDED.n === IMP97739_BASELINE.n + 6;
    },
    why: 'the six new rungs (p = 5.33e8 .. 7.36e8) are all strictly past the imp-97706 top p=4.93e8, all have gap < law, and extend the baseline 23-rung ladder to 29 rungs.',
  },
  {
    id: 'imp97739-baseline-reproduces-imp97722',
    holds: () =>
      Math.abs(IMP97739_BASELINE.endpoint - 10.2888) < 0.01 &&
      Math.abs(IMP97739_BASELINE.theilSen - 10.6160) < 0.01 &&
      Math.abs(IMP97739_BASELINE.ols - 10.5600) < 0.01 &&
      IMP97739_BASELINE.rises === 8 &&
      IMP97739_BASELINE.pairCount === 253,
    why: 'recomputing the three estimators on the imported imp-97722 23-rung ladder reproduces its endpoint ~10.29, Theil-Sen ~10.62, OLS ~10.56, and eight sign-changes -- the baseline anchor for the drift measurement.',
  },
  {
    id: 'imp97739-exponent-does-not-stabilize',
    holds: () =>
      IMP97739_DRIFT.endpoint > 0.3 &&        // endpoint chord drifts up markedly (+0.67)
      IMP97739_DRIFT.theilSen > 0.1 &&        // robust median still drifts up (+0.22)
      IMP97739_DRIFT.ols > 0.1 &&             // OLS still drifts up (+0.15)
      IMP97739_VERDICT.exponentStabilizes === false,
    why: 'all three estimators drift UP on the extended ladder (endpoint +0.67, Theil-Sen +0.22, OLS +0.15), so the ~10.56 exponent is not a converged point estimate -- it keeps moving under the sign oscillation.',
  },
  {
    id: 'imp97739-sign-oscillation-recurs',
    holds: () =>
      IMP97739_EXTENDED.rises === 10 &&
      IMP97739_DRIFT.riseCount === 2 &&
      IMP97739_VERDICT.signOscillationRecurs === true,
    why: 'two of the six new rung-pairs are rises, lifting the combined sign-change count from 8 to 10 -- the PNT/Mertens oscillation persists past 4.93e8, the direct cause of the exponent drift.',
  },
  {
    id: 'imp97739-qualitative-outruns-power-three-untouched',
    holds: () =>
      IMP97739_EXTENDED.endpoint > 3 &&
      IMP97739_EXTENDED.theilSen > 3 &&
      IMP97739_EXTENDED.ols > 3 &&
      IMP97739_EXTENDED.fractionExceedsThree > 0.85 &&
      IMP97739_VERDICT.qualitativeConclusionUntouched === true,
    why: 'despite the drift, every estimator on the extended ladder stays far above 3 and the fraction of pairwise slopes exceeding 3 barely moves (~0.91), so the "outruns every fixed power <= 3" conclusion is not affected.',
  },
  {
    id: 'imp97739-honesty-gate-no-qed',
    holds: () =>
      IMP97739_VERDICT.exponentStabilizes === false &&
      IMP97739_VERDICT.signOscillationRecurs === true &&
      IMP97739_VERDICT.mcmRefuted === true &&
      IMP97739_VERDICT.ceilingTouched === false &&
      IMP97739_VERDICT.anyBoundMoved === false &&
      IMP97739_VERDICT.qed === false &&
      /NO QED/.test(IMP97739_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97739_HONEST_BANNER) &&
      /RH open/.test(IMP97739_HONEST_BANNER),
    why: 'measurement only -- the exponent drifts (does not stabilize) and the sign oscillation recurs; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97739_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97739-route-m-ladder-exponent-stability assertion failed: ${a.id}`);
  }
}

export default {
  extensionLadder: IMP97739_EXTENSION_LADDER,
  extendedLadder: IMP97739_EXTENDED_LADDER,
  baseline: IMP97739_BASELINE,
  extended: IMP97739_EXTENDED,
  drift: IMP97739_DRIFT,
  verdict: IMP97739_VERDICT,
  banner: IMP97739_HONEST_BANNER,
};
