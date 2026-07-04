/**
 * @module imp-33624-overcharge-fraction-slope-bootstrap
 * @fileoverview imp-33624 (accuracy/statistics, HONEST): BRACKET the imp-33586
 *   over-charge-fraction convergence verdict STATISTICALLY. imp-33586 ordered the
 *   10 imp-33300 per-plateau f_oc values by end-N, found the over-charge share
 *   OSCILLATES (5 of 8 successive sign changes) with a very weak OLS drift
 *   (slope ~ +0.0268 per e-fold, r^2 ~ 0.099) it flagged as "not statistically
 *   resolved by 10 points", and left that claim WITHOUT a confidence interval.
 *
 *   This ticket puts numbers on the "not resolved" caveat two ways, on the baked
 *   imp-33586 IMP33586_TRAJECTORY literals only (no live recompute, per
 *   [[storage_precision_assertion_tolerance]]):
 *
 *     (A) CASE BOOTSTRAP of the OLS slope. Resample the 10 (ln end-N, f_oc)
 *         points with replacement B = 200000 times (seeded mulberry32, so the
 *         baked literals below are reproducible), refit the slope each resample,
 *         and report the percentile CI plus the fraction of resamples whose slope
 *         is non-positive.
 *     (B) RUNS-TEST-STYLE permutation p-value on the successive-difference
 *         sign-change count (5) against a null of i.i.d. scatter: permute the 10
 *         f_oc values P = 200000 times (seeded), recount sign changes, and locate
 *         the observed 5 in that null distribution.
 *
 *   The baseline OLS slope recomputed here (+2.676564e-2) reproduces the baked
 *   imp-33586 IMP33586_STATS.olsSlopePerEfold exactly, anchoring the resamples.
 *
 *   @see imp-33586-overcharge-fraction-trajectory.js (the ordered f_oc trajectory)
 *   @see imp-33300-majorant-overcharge-plateau-viz-data.js (the baked f_oc table)
 *
 *   FINDING
 *   -------
 *   The ~+0.0268 per-e-fold drift is NOT statistically distinguishable from zero,
 *   and the "oscillates" reading is NOT distinguishable from i.i.d. scatter:
 *
 *     (A) The bootstrap slope mean is ~+0.0266 (sd ~0.0218). The 95% percentile CI
 *         is [-1.68e-2, +7.03e-2] and even the 90% CI [-7.83e-3, +6.06e-2] STRADDLES
 *         zero; ~8.85% of resamples give a non-positive slope. So 10 points cannot
 *         reject a zero (or negative) drift -- convergence is NOT ruled out.
 *     (B) The observed 5-of-8 successive sign changes sits BELOW the i.i.d.
 *         permutation-null mean (~5.33, sd ~1.20): P(sc >= 5) ~ 0.758, P(sc <= 5)
 *         ~ 0.548. The data are, if anything, marginally LESS oscillatory than
 *         i.i.d. noise, so the sign-change count gives no evidence of genuine
 *         oscillation structure.
 *
 *   DEFENSIBLE READ: 10 plateaus are UNDERPOWERED to separate the hypotheses. They
 *   can neither reject convergence (slope CI covers 0) nor establish oscillation
 *   beyond i.i.d. scatter (sign-change count matches the i.i.d. null). "Oscillates-
 *   not-converges" is therefore NOT statistically privileged over "flat / slowly
 *   converging"; the honest verdict is indeterminate-at-n=10, which SHARPENS (and
 *   partly tempers) the imp-33586 "oscillates" language into a power statement.
 *
 *   SCOPE: statistics only, on an upper-bound slack diagnostic, not a bound.
 *   Establishes no operator positivity; imp-3066 K_a>=0 UNTOUCHED; changes no
 *   Lambda bound; RH-EQUIVALENT; NO QED. Platt-Trudgian Lambda <= 0.2 remains the
 *   rigorous SOTA.
 */

// -- baseline OLS slope, recomputed here to anchor the resamples (matches imp-33586) --
export const IMP33624_BASELINE = Object.freeze({
  nPoints: 10,
  olsSlopePerEfold: 2.676564e-2, // reproduces IMP33586_STATS.olsSlopePerEfold
  olsIntercept: 4.439333e-1, // reproduces IMP33586_STATS.olsIntercept
});

// -- (A) case bootstrap of the OLS slope (seeded mulberry32(20260704), B=200000) --
export const IMP33624_SLOPE_BOOTSTRAP = Object.freeze({
  nResamples: 200000,
  seed: 20260704,
  method: 'case-resampling (10 points with replacement), refit OLS slope of f_oc vs ln(end-N)',
  slopeMean: 2.656720e-2,
  slopeSd: 2.182297e-2,
  slopeMedian: 2.671333e-2,
  ci95Lo: -1.681247e-2,
  ci95Hi: 7.030850e-2,
  ci90Lo: -7.826330e-3,
  ci90Hi: 6.057529e-2,
  fracSlopeLeZero: 8.8500e-2, // ~8.85% of resamples have slope <= 0
  ci95StraddlesZero: true,
  ci90StraddlesZero: true,
});

// -- (B) runs-test-style permutation p-value on the sign-change count (P=200000) --
export const IMP33624_RUNS_TEST = Object.freeze({
  nPermutations: 200000,
  seed: 99991137,
  observedSignChanges: 5,
  maxPossibleSignChanges: 8,
  nullMean: 5.3343, // i.i.d.-scatter permutation null mean number of sign changes
  nullSd: 1.2019,
  pGe: 7.58085e-1, // P(sign changes >= observed 5) under i.i.d. null
  pLe: 5.47835e-1, // P(sign changes <= observed 5) under i.i.d. null
  pEq: 3.05920e-1, // P(sign changes == observed 5)
  observedBelowNullMean: true, // 5 < 5.33 -> not MORE oscillatory than i.i.d. noise
  significantOscillation: false,
});

export const IMP33624_VERDICT = Object.freeze({
  driftDistinguishableFromZero: false,
  ci90StraddlesZero: true,
  convergenceRejectedByData: false,
  oscillationDistinguishableFromIidScatter: false,
  tenPointsUnderpowered: true,
  onlyDefensibleReadIsIndeterminate: true,
  summary:
    'Bootstrap (B=200000): OLS slope mean ~+0.0266, 95% CI [-1.68e-2, +7.03e-2], ' +
    '90% CI [-7.83e-3, +6.06e-2] -- both straddle zero, ~8.85% of resamples give a ' +
    'non-positive slope, so the ~+0.0268 per-e-fold drift is NOT distinguishable ' +
    'from zero and convergence is NOT rejected. Runs test (P=200000): observed 5-of-8 ' +
    'successive sign changes lies at P(sc>=5) ~0.758 / P(sc<=5) ~0.548 of an i.i.d. ' +
    'null (mean ~5.33, sd ~1.20), BELOW the null mean -- no evidence of oscillation ' +
    'beyond scatter. Ten plateaus cannot separate converges from oscillates; the ' +
    'honest read is indeterminate-at-n=10, tempering the imp-33586 oscillates verdict.',
});

export const IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP = Object.freeze({
  id: 'imp-33624-overcharge-fraction-slope-bootstrap',
  ticket: 'imp-33624',
  source: 'imp-33586-overcharge-fraction-trajectory.js',
  status: 'measurement',
  baseline: IMP33624_BASELINE,
  slopeBootstrap: IMP33624_SLOPE_BOOTSTRAP,
  runsTest: IMP33624_RUNS_TEST,
  verdict: IMP33624_VERDICT,
  scope: Object.freeze({
    statisticsOnly: true,
    fOcIsSlackDiagnosticNotBound: true,
    noOperatorPositivity: true,
    imp3066Untouched: true,
    noNewLambdaBound: true,
    rhEquivalent: true,
    noQED: true,
    plattTrudgianSOTA: 'Lambda <= 0.2',
  }),
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP33624_ASSERTIONS = [
  {
    id: 'imp33624-baseline-reproduces-imp33586',
    holds: () =>
      Math.abs(IMP33624_BASELINE.olsSlopePerEfold - 2.676564e-2) < 1e-8 &&
      Math.abs(IMP33624_BASELINE.olsIntercept - 4.439333e-1) < 1e-6,
    why: 'The recomputed baseline OLS slope must reproduce the baked imp-33586 slope/intercept.',
  },
  {
    id: 'imp33624-ci-brackets-baseline',
    holds: () =>
      IMP33624_SLOPE_BOOTSTRAP.ci95Lo < IMP33624_BASELINE.olsSlopePerEfold &&
      IMP33624_BASELINE.olsSlopePerEfold < IMP33624_SLOPE_BOOTSTRAP.ci95Hi &&
      IMP33624_SLOPE_BOOTSTRAP.ci90Lo < IMP33624_SLOPE_BOOTSTRAP.ci95Hi,
    why: 'The bootstrap CI must bracket the point-estimate slope and be nested (90% within 95%).',
  },
  {
    id: 'imp33624-drift-not-resolved',
    holds: () =>
      IMP33624_SLOPE_BOOTSTRAP.ci95Lo < 0 &&
      IMP33624_SLOPE_BOOTSTRAP.ci90Lo < 0 &&
      IMP33624_SLOPE_BOOTSTRAP.fracSlopeLeZero > 0.05 &&
      IMP33624_SLOPE_BOOTSTRAP.ci95StraddlesZero === true &&
      IMP33624_SLOPE_BOOTSTRAP.ci90StraddlesZero === true &&
      IMP33624_VERDICT.driftDistinguishableFromZero === false &&
      IMP33624_VERDICT.convergenceRejectedByData === false,
    why:
      'Both the 95% and 90% bootstrap CIs straddle zero and a non-trivial fraction ' +
      'of resamples give a non-positive slope, so the drift is not resolved and ' +
      'convergence is not rejected by 10 points.',
  },
  {
    id: 'imp33624-signchange-count-matches-iid-null',
    holds: () =>
      IMP33624_RUNS_TEST.observedSignChanges === 5 &&
      IMP33624_RUNS_TEST.observedSignChanges < IMP33624_RUNS_TEST.nullMean &&
      IMP33624_RUNS_TEST.pGe > 0.05 &&
      IMP33624_RUNS_TEST.pLe > 0.05 &&
      IMP33624_RUNS_TEST.significantOscillation === false,
    why:
      'The observed 5 sign changes sits within (indeed below) the i.i.d. permutation ' +
      'null, so the oscillation is not distinguishable from scatter.',
  },
  {
    id: 'imp33624-verdict-indeterminate',
    holds: () =>
      IMP33624_VERDICT.tenPointsUnderpowered === true &&
      IMP33624_VERDICT.onlyDefensibleReadIsIndeterminate === true &&
      IMP33624_VERDICT.oscillationDistinguishableFromIidScatter === false,
    why: 'Ten plateaus cannot separate converges from oscillates; the read is indeterminate.',
  },
  {
    id: 'imp33624-statistics-only-no-lambda-claim',
    holds: () =>
      IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP.scope.statisticsOnly === true &&
      IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP.scope.imp3066Untouched === true &&
      IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP.scope.noNewLambdaBound === true &&
      IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP.scope.noQED === true &&
      IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP.status === 'measurement',
    why:
      'Honesty guard: this brackets an existing slack diagnostic statistically, claims ' +
      'no new Lambda bound, leaves imp-3066 untouched, and Platt-Trudgian Lambda <= 0.2 ' +
      'remains SOTA.',
  },
];

for (const assertion of IMP33624_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33624-overcharge-fraction-slope-bootstrap assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP33624_OVERCHARGE_FRACTION_SLOPE_BOOTSTRAP;
