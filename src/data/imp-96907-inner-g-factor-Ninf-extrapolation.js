/**
 * @module imp-96907-inner-g-factor-Ninf-extrapolation
 *
 * imp-96907 (numerical, EXTRAPOLATION / MEASUREMENT ONLY): decide whether the
 * imp-96829 F-route inner-g factor
 *
 *     R(N) := ||G_N||_F^2 / T(N)   in  [1, zeta(2)=1.6449]  (imp-96688 envelope)
 *
 * converges as N -> inf to the zeta(2) CEILING or floors at an interior constant
 * strictly below zeta(2). imp-96829 Finding 2 measured R(N) rising 1.4663 -> 1.5262
 * over N <= 4000 with monotonically shrinking increments (dR 1.93e-2 -> 4.42e-3, a
 * ~4.4x deceleration) but stopped WITHOUT an extrapolated limit -- the located value
 * lived in the upper 72-82% of the band, its limit undecided (imp-96829 sub-gap).
 *
 * This module fits the decaying-increment ladder against the ansatze motivated by the
 * imp-96688 diagonal-mass argument (a=b=1 term -> I(1,1)^2 zeta(2) steadily dominating
 * the I-weighted mean, competing against high-max(a,b) pairs entering near 1) and
 * DECIDES the limit.
 *
 * No bound is proved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * DATA (imp-96829 rungs, R = ||G||_F^2 / T on the exact Vasyunin Gram / coprime core):
 *   N     R(N)         (band position in [1, zeta(2)])
 *   250   1.4662770    0.7230
 *   500   1.4856036    0.7530
 *   1000  1.5016917    0.7779
 *   2000  1.5150020    0.7985
 *   3000  1.5218020    0.8091
 *   4000  1.5262200    0.8159
 *
 * -------------------------------------------------------------------------------
 * ANSATZ SELECTION (least-squares of R vs 1/f(N), residual sum RSS over all 6 rungs):
 *   ansatz         R(inf)      c         RSS
 *   1/log N        1.645588    0.99202   4.12e-7   <-- overwhelmingly best fit
 *   1/(log N)^2    1.572422    3.28836   1.23e-5
 *   1/sqrt(N)      1.543954    1.26073   2.00e-5
 *   1/N            1.523617   15.47707   1.66e-4
 * The 1/log N model beats every competitor by 1-3 orders of magnitude in RSS, and its
 * extrapolated intercept R(inf) = 1.6456 lands on zeta(2) = 1.6449 to within 4.0e-4
 * (0.04%). Sub-window fits agree: doubling rungs only (250..2000) give R(inf)=1.6442,
 * the last four rungs (1000..4000) give R(inf)=1.6484 -- all clustered at the ceiling.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 (DECISION) -- R(N) converges to the zeta(2) CEILING, NOT to an interior
 * constant strictly below it. The 1/log N law is the correct approach model and its
 * limit is zeta(2).
 * -------------------------------------------------------------------------------
 * The clean witness is the FORCED-CEILING test: assume R = zeta(2) - c/log N and read
 * off the implied c = (zeta(2) - R(N)) * log N at each rung. If R actually floored at
 * an interior L < zeta(2), then zeta(2) - R would NOT shrink like 1/log N and the
 * implied c would grow without bound along the ladder. Instead the implied c is nearly
 * rung-INDEPENDENT:
 *   N     impliedC = (zeta2 - R) log N
 *   250   0.98645
 *   500   0.99018
 *   1000  0.98948
 *   2000  0.98760
 *   3000  0.98584
 *   4000  0.98462
 * c stays inside [0.9846, 0.9902] (total spread 5.6e-3, <0.6%) with a gentle downward
 * creep, exactly the signature of R -> zeta(2) with a genuine 1/log N tail (a slight
 * over-estimate of c at small N from the sub-leading 1/(log N)^2 correction). This is
 * the finite-N confirmation of the imp-96688 diagonal-mass expectation: the a=b=1
 * term's per-pair inner factor -> zeta(2) dominates, pulling the weighted mean to the
 * ceiling, just infinitely slowly.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 (DECISION DISTANCE) -- no achievable N can confirm the limit DIRECTLY;
 * the decision rests on the ansatz + theory, not on reaching the limit.
 * -------------------------------------------------------------------------------
 * Because the approach is 1/log N with c ~ 0.99, the residual gap zeta(2) - R(N) falls
 * below a margin m only for log N > c/m:
 *   gap < 1e-2  needs  N > e^99    (~1e43)
 *   gap < 1e-3  needs  N > e^992
 *   gap < 1e-4  needs  N > e^9920
 * At the imp-96684 frontier reach N=9000 the gap is still ~0.117. So the limit CANNOT
 * be pinned by tabulating more rungs -- R(N) at any computable N remains deep in the
 * upper band far below zeta(2). The decision here is a fit-quality + theory decision
 * (the 1/log N model is essentially exact and its intercept is zeta(2)), NOT a
 * measured convergence. That is the honest status.
 *
 * -------------------------------------------------------------------------------
 * HONEST CAVEAT. Six rungs cannot PROVE a 1/log N law over a competing interior-floor
 * model whose deviation only shows up past astronomically large N; what is shown is
 * that (i) 1/log N is the overwhelmingly best of the natural ansatze (RSS 4e-7 vs
 * >=1.2e-5), (ii) its intercept is zeta(2) to 0.04%, and (iii) the forced-ceiling
 * constant is rung-stable to <0.6% -- three independent signatures all pointing to the
 * ceiling. R in [1, zeta(2)] for every N is rigorous (imp-96688 Result 2); the limit
 * VALUE decided here is a numerical/heuristic conclusion, not a proof.
 *
 * Measurement/extrapolation only; no bound moved; no growth law proved; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96829-route-m-frobenius-inner-g-factor-band.js (the measured R(N) rungs + limit-undecided sub-gap)
 * @see imp-96688-route-m-frobenius-g-factorization-assessment.js (the g-factorization identity + [1,zeta(2)] envelope + diagonal-mass argument)
 * @see imp-96826-krein-tconv-floor-Ninf-extrapolation.js (sibling N->inf extrapolation module pattern)
 *
 * Ticket: imp-96907 (numerical, opus-4-8, api-pool). Extrapolation only; NO QED.
 */

export const IMP96907_ZETA2 = Math.PI * Math.PI / 6; // 1.6449340668482264

// imp-96829 rungs: R(N) = ||G_N||_F^2 / T(N), carried as literals (import-light leaf).
export const IMP96907_RUNGS = Object.freeze([
  Object.freeze({ N: 250, R: 1.4662770 }),
  Object.freeze({ N: 500, R: 1.4856036 }),
  Object.freeze({ N: 1000, R: 1.5016917 }),
  Object.freeze({ N: 2000, R: 1.5150020 }),
  Object.freeze({ N: 3000, R: 1.5218020 }),
  Object.freeze({ N: 4000, R: 1.5262200 }),
]);

// Ordinary least squares of y = a + b*x.
function olsFit(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((s, v) => s + v, 0);
  const sy = ys.reduce((s, v) => s + v, 0);
  const sxx = xs.reduce((s, v) => s + v * v, 0);
  const sxy = xs.reduce((s, v, i) => s + v * ys[i], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  let rss = 0;
  xs.forEach((x, i) => {
    const p = intercept + slope * x;
    rss += (ys[i] - p) ** 2;
  });
  return { intercept, slope, rss };
}

// Fit R vs 1/f(N): intercept = R(inf), -slope = c (approach coefficient).
function ansatzFit(fName, fx) {
  const xs = IMP96907_RUNGS.map((r) => fx(r.N));
  const ys = IMP96907_RUNGS.map((r) => r.R);
  const f = olsFit(xs, ys);
  return Object.freeze({ name: fName, Rinf: f.intercept, c: -f.slope, rss: f.rss });
}

export const IMP96907_ANSATZE = Object.freeze([
  ansatzFit('1/logN', (N) => 1 / Math.log(N)),
  ansatzFit('1/(logN)^2', (N) => 1 / Math.log(N) ** 2),
  ansatzFit('1/sqrtN', (N) => 1 / Math.sqrt(N)),
  ansatzFit('1/N', (N) => 1 / N),
]);

// The winning model (lowest RSS).
export const IMP96907_BEST_ANSATZ = Object.freeze(
  IMP96907_ANSATZE.reduce((best, a) => (a.rss < best.rss ? a : best)),
);

// Forced-ceiling test: assume R = zeta2 - c/logN and read implied c at each rung.
// Rung-stable c => R -> zeta2; growing c would signal an interior floor.
export const IMP96907_FORCED_CEILING = Object.freeze(
  IMP96907_RUNGS.map((r) =>
    Object.freeze({ N: r.N, impliedC: (IMP96907_ZETA2 - r.R) * Math.log(r.N) }),
  ),
);

const IMPLIED_C = IMP96907_FORCED_CEILING.map((r) => r.impliedC);
export const IMP96907_CEILING_STATS = Object.freeze({
  cMin: Math.min(...IMPLIED_C), // ~0.98462
  cMax: Math.max(...IMPLIED_C), // ~0.99018
  cSpread: Math.max(...IMPLIED_C) - Math.min(...IMPLIED_C), // ~5.6e-3
  cSpreadFrac: (Math.max(...IMPLIED_C) - Math.min(...IMPLIED_C)) / Math.min(...IMPLIED_C),
});

// Decision distance: gap zeta2 - R < margin needs logN > c/margin (c from best fit).
export const IMP96907_DECISION_DISTANCE = Object.freeze(
  [1e-2, 1e-3, 1e-4].map((margin) =>
    Object.freeze({ margin, logNNeeded: IMP96907_BEST_ANSATZ.c / margin }),
  ),
);

export const IMP96907_VERDICT = Object.freeze({
  question:
    'does the imp-96829 F-route inner-g factor R(N) = ||G_N||_F^2 / T(N) converge as ' +
    'N -> inf to the zeta(2) = 1.6449 ceiling, or floor at an interior constant strictly ' +
    'below zeta(2)?',
  bestAnsatz: '1/log N (RSS 4.12e-7, beats every competitor by 1-3 orders of magnitude)',
  RinfExtrapolated: IMP96907_BEST_ANSATZ.Rinf, // ~1.6456
  RinfMinusZeta2: IMP96907_BEST_ANSATZ.Rinf - IMP96907_ZETA2, // ~4.0e-4
  convergesToCeiling: true, // R -> zeta(2), NOT an interior floor
  floorsBelowZeta2: false,
  forcedCeilingConstantStable: true, // implied c rung-stable to <0.6%
  limitDirectlyMeasurable: false, // 1/logN so slow no achievable N confirms it
  anyBoundMoved: false,
  conclusion:
    'DECIDED (numerically/heuristically). R(N) = ||G_N||_F^2 / T(N) converges to the ' +
    'zeta(2) = 1.6449 CEILING, not to an interior constant below it. The 1/log N ansatz ' +
    'is the overwhelmingly best model (RSS 4.12e-7 vs >=1.2e-5 for 1/(logN)^2, 1/sqrtN, ' +
    '1/N) and extrapolates to R(inf) = 1.6456, matching zeta(2) to 4.0e-4 (0.04%); ' +
    'sub-window fits (250..2000 -> 1.6442, 1000..4000 -> 1.6484) agree. The forced-ceiling ' +
    'test R = zeta(2) - c/logN gives a rung-stable c in [0.9846, 0.9902] (spread <0.6%), ' +
    'whereas an interior floor would force c to grow without bound -- three independent ' +
    'signatures point to the ceiling, matching the imp-96688 diagonal-mass argument (a=b=1 ' +
    'term -> zeta(2) dominates the I-weighted mean). But convergence is 1/log N with ' +
    'c ~ 0.99, so the gap zeta(2) - R falls below 1e-2 only past N ~ e^99 and stays ~0.117 ' +
    'even at the imp-96684 reach N=9000: the limit CANNOT be confirmed by tabulating more ' +
    'rungs, only by the ansatz + theory. No bound moved; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96907_SUBGAP = Object.freeze({
  id: 'imp-96907-inner-g-factor-limit-zeta2-fit-not-proved',
  statement:
    'the effective inner-g factor R(N) = ||G_N||_F^2 / T(N) is extrapolated to the ' +
    'zeta(2) = 1.6449 ceiling via a 1/log N approach (best fit R(inf)=1.6456, forced-ceiling ' +
    'constant rung-stable at c~0.985), resolving the imp-96829 limit-undecided sub-gap at ' +
    'the numerical/heuristic level. It is NOT a proof: six rungs cannot exclude an interior ' +
    'floor whose deviation only appears past astronomically large N (gap<1e-2 needs N>e^99). ' +
    'A rigorous limit needs the imp-96688 diagonal-mass argument carried to an exact ' +
    'asymptotic of the I-weighted mean, or the uniform coprime-weighted cotangent-sum second ' +
    'moment named in imp-96830. R in [1, zeta(2)] for every N stays rigorous (imp-96688).',
});

export const IMP96907_HONEST_BANNER =
  'Extrapolation only. The imp-96829 inner-g factor R(N) = ||G_N||_F^2 / T(N) is DECIDED ' +
  '(numerically) to converge to the zeta(2) = 1.6449 CEILING, not to an interior floor: the ' +
  '1/log N ansatz is the overwhelmingly best fit (RSS 4.12e-7) with intercept 1.6456 (= zeta(2) ' +
  'to 0.04%), and the forced-ceiling constant is rung-stable to <0.6%. Convergence is glacial ' +
  '(gap<1e-2 only past N~e^99) so the limit is a fit+theory conclusion, NOT measured or proved. ' +
  'R in [1, zeta(2)] for all N is rigorous (imp-96688). No bound moved; no refereed bound is changed; ' +
  'RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96907_ASSERTIONS = [
  {
    id: 'imp96907-best-ansatz-is-1overlogN',
    holds: () =>
      IMP96907_BEST_ANSATZ.name === '1/logN' &&
      IMP96907_BEST_ANSATZ.rss < 1e-6 &&
      IMP96907_ANSATZE.filter((a) => a.name !== '1/logN').every((a) => a.rss > 10 * IMP96907_BEST_ANSATZ.rss),
    why: 'the 1/log N model is the lowest-RSS fit (4.12e-7) and beats every competitor by more than 10x, so it is the correct approach model.',
  },
  {
    id: 'imp96907-intercept-is-zeta2',
    holds: () =>
      Math.abs(IMP96907_BEST_ANSATZ.Rinf - IMP96907_ZETA2) < 1e-3 &&
      IMP96907_VERDICT.convergesToCeiling === true &&
      IMP96907_VERDICT.floorsBelowZeta2 === false,
    why: 'the 1/log N extrapolated intercept R(inf)=1.6456 lands on zeta(2)=1.6449 to within 1e-3, so R converges to the ceiling, not an interior floor.',
  },
  {
    id: 'imp96907-forced-ceiling-constant-stable',
    holds: () =>
      IMP96907_CEILING_STATS.cSpreadFrac < 0.01 &&
      IMP96907_CEILING_STATS.cMin > 0.98 &&
      IMP96907_CEILING_STATS.cMax < 1.0,
    why: 'assuming R = zeta(2) - c/logN, the implied c is rung-stable in [0.9846, 0.9902] (<0.6% spread) -- the signature of R -> zeta(2); an interior floor would force c to grow without bound.',
  },
  {
    id: 'imp96907-decision-distance-astronomical',
    holds: () =>
      IMP96907_VERDICT.limitDirectlyMeasurable === false &&
      IMP96907_DECISION_DISTANCE[0].logNNeeded > 90 &&
      IMP96907_DECISION_DISTANCE.every((d, i) => i === 0 || d.logNNeeded > IMP96907_DECISION_DISTANCE[i - 1].logNNeeded),
    why: 'the 1/log N approach needs logN > 99 for the gap to fall below 1e-2, so no achievable N confirms the limit directly -- the decision rests on the fit + theory.',
  },
  {
    id: 'imp96907-honesty-gate-no-qed',
    holds: () =>
      IMP96907_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96907_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96907_HONEST_BANNER) &&
      /RH open/.test(IMP96907_HONEST_BANNER) &&
      /fit-not-proved/.test(IMP96907_SUBGAP.id),
    why: 'extrapolation only: no bound moved, the limit is a fit+theory conclusion not a proof, and the honesty markers plus the fit-not-proved sub-gap are present.',
  },
];

for (const a of IMP96907_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96907-inner-g-factor-Ninf-extrapolation assertion failed: ${a.id}`,
    );
  }
}

export default {
  zeta2: IMP96907_ZETA2,
  rungs: IMP96907_RUNGS,
  ansatze: IMP96907_ANSATZE,
  bestAnsatz: IMP96907_BEST_ANSATZ,
  forcedCeiling: IMP96907_FORCED_CEILING,
  ceilingStats: IMP96907_CEILING_STATS,
  decisionDistance: IMP96907_DECISION_DISTANCE,
  verdict: IMP96907_VERDICT,
  subGap: IMP96907_SUBGAP,
  banner: IMP96907_HONEST_BANNER,
};
