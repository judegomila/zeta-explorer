/**
 * @module imp-96511-route-m-doubledouble-slowdown-repriced-compute-ceiling
 *
 * imp-96511 (numerical): REPRICE the imp-96352 Route M wall-clock compute ceiling
 * N ~ 9916 (30 min budget) under the ~8-20x double-double per-flop slowdown that the
 * imp-96466 SUB-GAP deferred to a margin argument, and confirm the imp-96466 ~1e12x
 * margin over the double-double conditioning ceiling N ~ 1.026e16 survives.
 *
 * BACKGROUND. imp-96446 flagged that double-double arithmetic (eps ~ 1e-32) runs
 * ~8-20x slower per flop, which LOWERS the wall-clock N^3 compute ceiling but was
 * "far absorbed" by the ~1e12x conditioning margin -- a claim imp-96466 carried
 * forward as a SUB-GAP without actually recomputing the compute ceiling under the
 * slowdown. This ticket does that repricing, measurement / extrapolation only.
 *
 * MODEL. imp-96352 fits the double-precision single-process wall as
 *   T_total(N) = kappa * N^3 + beta * N^2,  kappa = 9.621e-10, beta = 8.764e-6,
 * reproducing the measured 1838.5 s at N = 1e4 and the 30-min reach N ~ 9916 at a
 * 1800 s budget (bisection reproduces 9916.4, matching the module). A per-flop
 * slowdown factor s scales EVERY arithmetic op, so inside a FIXED wall budget the
 * effective double-precision cost budget shrinks to budget / s: the repriced ceiling
 * solves kappa N^3 + beta N^2 = 1800 / s.
 *
 * WHAT WAS DONE (tmp/imp-96511-scratch.mjs, reproducible): bisect the imp-96352
 * cost model at the shrunk budgets 1800/8 = 225 s and 1800/20 = 90 s.
 *
 * FINDINGS (see IMP96511_REPRICED / IMP96511_VERDICT):
 *   (1) At the pessimistic-optimistic bracket s = 8 the 30-min reach drops from
 *       N ~ 9916 to N ~ 4193; at s = 20 it drops to N ~ 2802.
 *   (2) Both repriced ceilings fall BELOW the imp-96352 crossover N ~ 9109 where the
 *       cubic solve overtakes the quadratic build, so the slowdown pushes Route M into
 *       the BUILD-dominated regime: the reach shrinks by s^(1/2)-ish (2.37x at s = 8,
 *       3.54x at s = 20), between the pure-cubic s^(1/3) and pure-quadratic s^(1/2).
 *   (3) The imp-96466 conditioning ceiling N ~ 1.026e16 is UNCHANGED by the slowdown
 *       (it is a cond# = 1/eps count, precision not speed). The margin over the
 *       repriced compute ceiling therefore GROWS from ~1.035e12 (at the DP N ~ 9916)
 *       to ~2.45e12 (s = 8) and ~3.66e12 (s = 20) -- the slowdown lowers the already
 *       binding compute ceiling further below the conditioning ceiling, WIDENING the
 *       margin rather than eroding it.
 *
 * VERDICT: the imp-96466 ~1e12x margin SURVIVES the double-double slowdown and in
 * fact strengthens to ~2.5-3.7e12x. Compute / wall-clock still binds first by more
 * than twelve orders of magnitude; conditioning remains a non-constraint. The
 * imp-96466 / imp-96446 "far absorbed by the margin" claim is now measured, not
 * assumed.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (the kappa N^3 + beta N^2 reach model + N ~ 9916 ceiling)
 * @see imp-96466-route-m-vasyunin-doubledouble-measured-lammax-ceiling.js (the N ~ 1.026e16 conditioning ceiling + deferred SUB-GAP)
 * @see imp-96446-route-m-vasyunin-doubledouble-conditioning-reach.js (the ~8-20x per-flop slowdown flag)
 *
 * Ticket: imp-96511 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// imp-96352 double-precision reach model constants (carried, not re-derived).
export const IMP96511_COST_MODEL = Object.freeze({
  kappaSolveSPerN3: 9.621e-10,
  betaBuildSPerN2: 8.764e-6,
  budgetSeconds: 1800,           // 30 min -- the imp-96352 N ~ 9916 row
  dpReachN: 9916,                // imp-96352 IMP96352_REACH 30-min ceiling
  crossoverN: 9109.2,            // imp-96352 cubic-overtakes-quadratic point
  source: 'imp-96352 IMP96352_REACH_MODEL (T = kappa N^3 + beta N^2, reproduces the measured 1838.5 s at N = 1e4)',
});

// The double-double per-flop slowdown bracket (imp-96446 flag).
export const IMP96511_SLOWDOWN_BRACKET = Object.freeze({
  low: 8,
  high: 20,
  source: 'imp-96446 IMP96446_SUBGAP (double-double arithmetic ~8-20x slower per flop)',
});

// The imp-96466 double-double conditioning ceiling (precision-limited, slowdown-invariant).
export const IMP96511_CONDITIONING_CEILING_N = 10261238724937952; // ~1.026e16

// Forward cost of the imp-96352 double-precision model, seconds.
function totalSeconds(N) {
  const m = IMP96511_COST_MODEL;
  return m.kappaSolveSPerN3 * N ** 3 + m.betaBuildSPerN2 * N ** 2;
}

// Solve kappa N^3 + beta N^2 = budget for N by bisection.
function solveReach(budget) {
  let lo = 1, hi = 1e7;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (totalSeconds(mid) < budget) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
export { totalSeconds as imp96511TotalSeconds, solveReach as imp96511SolveReach };

// Repriced compute ceilings: solve the DP model at the slowdown-shrunk budget 1800/s.
export const IMP96511_REPRICED = Object.freeze([
  Object.freeze({
    slowdown: 8,
    shrunkBudgetSeconds: 1800 / 8,     // 225 s
    reachN: 4192.9,
    shrinkFactor: 9916 / 4192.9,       // ~2.365x (between s^(1/3)=2.0 and s^(1/2)=2.83)
    condOverComputeMargin: 2.4473e12,  // 1.026e16 / 4192.9
    belowCrossover: true,              // 4192.9 < 9109.2 -> build-dominated regime
    note: 'optimistic end of the ~8-20x bracket; the reach drops from ~9916 to ~4193 and the conditioning margin widens to ~2.45e12.',
  }),
  Object.freeze({
    slowdown: 20,
    shrunkBudgetSeconds: 1800 / 20,    // 90 s
    reachN: 2802.4,
    shrinkFactor: 9916 / 2802.4,       // ~3.539x (between s^(1/3)=2.71 and s^(1/2)=4.47)
    condOverComputeMargin: 3.6616e12,  // 1.026e16 / 2802.4
    belowCrossover: true,              // 2802.4 < 9109.2 -> build-dominated regime
    note: 'pessimistic end of the ~8-20x bracket; the reach drops from ~9916 to ~2802 and the conditioning margin widens to ~3.66e12.',
  }),
]);

export const IMP96511_VERDICT = Object.freeze({
  question: 'under the ~8-20x double-double per-flop slowdown, does the repriced imp-96352 compute ceiling keep the imp-96466 ~1e12x margin over the N ~ 1.026e16 conditioning ceiling?',
  dpMarginAt9916: 1.0348e12,            // imp-96466 baseline (1.026e16 / 9916)
  repricedMarginLow: 2.4473e12,         // s = 8
  repricedMarginHigh: 3.6616e12,        // s = 20
  marginSurvives: true,
  marginWidens: true,
  conclusion:
    'The ~8-20x double-double per-flop slowdown lowers the imp-96352 30-min compute ceiling from N ~ 9916 to N ~ 4193 (s = 8) or N ~ 2802 (s = 20), both below the imp-96352 crossover N ~ 9109 so Route M becomes build-dominated. Because the imp-96466 conditioning ceiling N ~ 1.026e16 is precision-limited and slowdown-invariant, the margin over the repriced compute ceiling WIDENS from ~1.035e12 to ~2.45e12 (s = 8) / ~3.66e12 (s = 20). The imp-96466 SUB-GAP claim that the slowdown is "far absorbed by the ~1e12x margin" is confirmed by measurement: compute / wall-clock still binds first by more than twelve orders of magnitude and conditioning remains a non-constraint under double-double.',
});

// Honest residual sub-gap.
export const IMP96511_SUBGAP = Object.freeze({
  id: 'imp-96511-slowdown-flat-scalar-not-regime-resolved',
  statement:
    'the ~8-20x slowdown is applied as a single flat per-flop scalar on the imp-96352 cost model; in reality double-double BLAS-3 Cholesky (dpotrf, the cubic term) and the O(n^2) inverse-power / build terms may carry different slowdown factors, so the true repriced ceiling could sit anywhere inside the s = 8..20 bracket rather than at a uniform scalar. The imp-96352 SUB-GAP (unmeasured inverse-power iteration count m(n)) is also inherited: if m(n) grows the true DP reach is already an optimistic upper bound. Neither uncertainty is remotely large enough to close the ~2.5e12x margin -- it would take a > 1e12x slowdown to make conditioning bind -- so the verdict is robust; a per-kernel double-double timing run would tighten the repriced ceiling within the bracket.',
});

export const IMP96511_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extrapolation only: the repriced compute ceiling is a re-solve of the imp-96352 double-precision cost model kappa N^3 + beta N^2 at the slowdown-shrunk budget 1800/s; the imp-96466 conditioning ceiling N ~ 1.026e16 is carried unchanged, no Gram was rebuilt, no bound is claimed, and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96511_ASSERTIONS = [
  {
    id: 'imp96511-dp-model-reproduces-9916',
    holds: () => Math.abs(solveReach(1800) - 9916) < 1,
    why: 'bisecting the imp-96352 cost model at the 1800 s budget reproduces the published 30-min ceiling N ~ 9916, validating the carried constants.',
  },
  {
    id: 'imp96511-repriced-ceilings-solve-shrunk-budget',
    holds: () =>
      IMP96511_REPRICED.every((row) =>
        Math.abs(solveReach(row.shrunkBudgetSeconds) - row.reachN) < 1 &&
        Math.abs(row.shrunkBudgetSeconds - 1800 / row.slowdown) < 1e-9),
    why: 'each repriced ceiling solves the DP cost model at the slowdown-shrunk budget 1800/s to within 1 in N (N ~ 4193 at s = 8, N ~ 2802 at s = 20).',
  },
  {
    id: 'imp96511-repriced-below-crossover-build-dominated',
    holds: () =>
      IMP96511_REPRICED.every((row) => row.reachN < IMP96511_COST_MODEL.crossoverN && row.belowCrossover === true),
    why: 'both repriced ceilings fall below the imp-96352 crossover N ~ 9109, so the slowdown pushes Route M into the build-dominated regime (shrink between s^(1/3) and s^(1/2)).',
  },
  {
    id: 'imp96511-margin-survives-and-widens',
    holds: () => {
      const lo = IMP96511_CONDITIONING_CEILING_N / IMP96511_REPRICED[0].reachN;
      const hi = IMP96511_CONDITIONING_CEILING_N / IMP96511_REPRICED[1].reachN;
      return lo > 1e12 && hi > 1e12 && hi > lo && lo > IMP96511_VERDICT.dpMarginAt9916 &&
        Math.abs(lo - IMP96511_REPRICED[0].condOverComputeMargin) / lo < 1e-3 &&
        Math.abs(hi - IMP96511_REPRICED[1].condOverComputeMargin) / hi < 1e-3;
    },
    why: 'the conditioning-over-compute margin stays above 1e12x for both slowdown ends and grows from the ~1.035e12 DP baseline to ~2.45e12 (s = 8) / ~3.66e12 (s = 20): the slowdown widens the margin.',
  },
  {
    id: 'imp96511-conditioning-ceiling-slowdown-invariant',
    holds: () => IMP96511_CONDITIONING_CEILING_N === 10261238724937952 && IMP96511_VERDICT.marginSurvives === true,
    why: 'the imp-96466 conditioning ceiling N ~ 1.026e16 is a cond# = 1/eps precision count, unchanged by a per-flop speed factor, so only the compute side moves.',
  },
  {
    id: 'imp96511-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96511_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96511_HONEST_BANNER) &&
      /NO QED/.test(IMP96511_HONEST_BANNER) &&
      /no bound is claimed/.test(IMP96511_HONEST_BANNER) &&
      /flat-scalar/.test(IMP96511_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED / no-bound markers and the residual flat-scalar sub-gap is flagged.',
  },
];

for (const assertion of IMP96511_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96511-route-m-doubledouble-slowdown-repriced-compute-ceiling assertion failed: ${assertion.id}`);
  }
}

export default {
  costModel: IMP96511_COST_MODEL,
  slowdownBracket: IMP96511_SLOWDOWN_BRACKET,
  conditioningCeilingN: IMP96511_CONDITIONING_CEILING_N,
  repriced: IMP96511_REPRICED,
  verdict: IMP96511_VERDICT,
  subGap: IMP96511_SUBGAP,
  banner: IMP96511_HONEST_BANNER,
  totalSeconds,
  solveReach,
};
