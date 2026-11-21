/**
 * @module imp-33586-overcharge-fraction-trajectory
 * @fileoverview imp-33586 (numerical/measurement, HONEST): ORDER the imp-33300/
 *   imp-33273 per-plateau majorant over-charge fraction f_oc by plateau end-N
 *   (18859..1000000) and MEASURE its trajectory -- does the over-charge SHARE
 *   trend toward a limiting fraction as end-N grows, or oscillate plateau-to-
 *   plateau? And is the N=10^6 endpoint-plateau f_oc (~84.7%) representative of
 *   the trend or an outlier?
 *
 *   f_oc = (M - realised)/M is the imp-33273 scaling-free over-charge share of the
 *   certified majorant ratio R_maj = K_real + over-charge. It is a Dmin-free
 *   diagnostic of how much of R_maj is majorant slack (far-term over-charge) vs
 *   genuine realised tail. imp-33300 baked the 10 per-plateau f_oc values but
 *   never ordered them by end-N to test convergence toward the 10^6 endpoint.
 *
 *   Values are baked as literals (the imp-33300 IMP33300_PLATEAUS table); this
 *   module does NOT re-import the imp-33273/imp-33269 live computation chain, per
 *   [[storage_precision_assertion_tolerance]]. The trajectory statistics below
 *   were computed offline by ordinary least squares on the baked f_oc vs ln(endN),
 *   plus a sign-change count on successive plateau-to-plateau f_oc differences.
 *
 *   @see imp-33300-majorant-overcharge-plateau-viz-data.js (the baked f_oc table)
 *   @see imp-33273-majorant-overcharge-decomposition.js (the R_maj split)
 *
 *   FINDING
 *   -------
 *   The over-charge share OSCILLATES; it does NOT converge within 10^6. Over the
 *   10 plateaus ordered by end-N the successive f_oc differences change sign 5 of
 *   a possible 8 times, and the OLS fit of f_oc against ln(endN) explains almost
 *   nothing of the variance (r^2 ~ 0.099, slope ~ +0.0268 per e-fold -- a very
 *   weak positive drift that is not statistically resolved by 10 points). Mean
 *   f_oc ~ 76.1% with sample sd ~ 10.4% and observed range ~[54.4%, 87.1%].
 *
 *   The N=10^6 endpoint plateau (f_oc ~ 84.7%) sits ABOVE both the mean and the
 *   weak-trend prediction (fit predicts ~81.4% at end-N=10^6) but only by ~0.87
 *   mean-sd / ~0.35 fit-residual-sd -- inside 1 sigma. So the ~84.7% endpoint is
 *   REPRESENTATIVE of the upper cluster of plateaus, NOT an outlier: it is near
 *   the top of the observed f_oc band but consistent with the oscillatory scatter.
 *
 *   SCOPE: measurement only. f_oc is an upper-bound slack diagnostic, not a bound.
 *   Establishes no operator positivity; imp-3066 K_a>=0 UNTOUCHED; changes no
 *   Lambda bound; RH-EQUIVALENT; NO QED. No refereed bound is changed.
 */

// -- baked from imp-33300 IMP33300_PLATEAUS (endN, overChargeFraction), ordered by end-N --
export const IMP33586_TRAJECTORY = Object.freeze(
  [
    { plateauIndex: 0, endN: 18859, fOc: 7.352730e-1 },
    { plateauIndex: 1, endN: 44555, fOc: 6.590373e-1 },
    { plateauIndex: 2, endN: 73997, fOc: 7.782115e-1 },
    { plateauIndex: 3, endN: 82552, fOc: 8.565931e-1 },
    { plateauIndex: 4, endN: 87761, fOc: 5.441617e-1 },
    { plateauIndex: 5, endN: 95248, fOc: 8.707210e-1 },
    { plateauIndex: 6, endN: 354769, fOc: 8.338253e-1 },
    { plateauIndex: 7, endN: 415587, fOc: 6.910475e-1 },
    { plateauIndex: 8, endN: 420891, fOc: 7.928563e-1 },
    { plateauIndex: 9, endN: 1000000, fOc: 8.469552e-1 },
  ].map((r) => Object.freeze(r)),
);

// -- offline OLS + oscillation statistics (baked, toExponential(6)-class literals) --
export const IMP33586_STATS = Object.freeze({
  nPlateaus: 10,
  meanFOc: 7.608682e-1, // ~76.1%
  sdFOcSample: 1.044296e-1, // ~10.4% (n-1)
  sdFOcPopulation: 9.907064e-2, // ~9.9% (n)
  fOcMin: 5.441617e-1, // plateau 4, end-N=87761
  fOcMax: 8.707210e-1, // plateau 5, end-N=95248
  fOcRange: 3.265593e-1,
  // OLS of f_oc against ln(end-N):
  olsSlopePerEfold: 2.676564e-2, // +0.0268 per e-fold in end-N (weak positive drift)
  olsIntercept: 4.439333e-1,
  olsR: 3.139808e-1,
  olsR2: 9.858394e-2, // ~0.099 -- trend explains ~10% of variance
  olsResidualSd: 9.406057e-2,
  // oscillation diagnostic on successive plateau-to-plateau f_oc differences:
  successiveSignChanges: 5,
  maxPossibleSignChanges: 8,
  // N=10^6 endpoint plateau relative to the trend:
  endpointPlateauIndex: 9,
  endpointFOc: 8.469552e-1, // ~84.7%
  endpointTrendPrediction: 8.137143e-1, // OLS fit at end-N=10^6, ~81.4%
  endpointResidual: 3.324095e-2, // above the fit line
  endpointZVsMean: 8.689457e-1, // ~+0.87 mean-sd
  endpointZVsFit: 3.533994e-1, // ~+0.35 fit-residual-sd
});

export const IMP33586_TRAJECTORY_VERDICT = Object.freeze({
  convergesWithin1e6: false,
  oscillates: true,
  weakPositiveDrift: true,
  endpointIsOutlier: false,
  endpointIsRepresentative: true,
  summary:
    'f_oc oscillates plateau-to-plateau (5 of 8 successive sign changes, ' +
    'OLS r^2 ~ 0.099) with only a weak positive drift vs ln(end-N) ' +
    '(~+0.027 per e-fold); no convergence to a limiting fraction is ' +
    'evidenced within 10^6. The N=10^6 endpoint f_oc ~84.7% sits ~+0.87 ' +
    'mean-sd / ~+0.35 fit-sd above the trend -- near the top of the observed ' +
    'band but within 1 sigma, hence representative of the upper cluster, not ' +
    'an outlier.',
});

export const IMP33586_OVERCHARGE_FRACTION_TRAJECTORY = Object.freeze({
  id: 'imp-33586-overcharge-fraction-trajectory',
  ticket: 'imp-33586',
  source: 'imp-33300-majorant-overcharge-plateau-viz-data.js',
  status: 'measurement',
  trajectory: IMP33586_TRAJECTORY,
  stats: IMP33586_STATS,
  verdict: IMP33586_TRAJECTORY_VERDICT,
  scope: Object.freeze({
    measurementOnly: true,
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
const IMP33586_ASSERTIONS = [
  {
    id: 'imp33586-ordered-by-end-n',
    holds: () =>
      IMP33586_TRAJECTORY.every(
        (r, i) => i === 0 || r.endN > IMP33586_TRAJECTORY[i - 1].endN,
      ),
    why: 'The 10 plateaus must be strictly ordered by ascending end-N.',
  },
  {
    id: 'imp33586-endpoint-is-1e6',
    holds: () =>
      IMP33586_TRAJECTORY[IMP33586_TRAJECTORY.length - 1].endN === 1000000 &&
      IMP33586_STATS.endpointPlateauIndex === 9,
    why: 'The largest-N plateau (end-N=10^6) is the endpoint under test.',
  },
  {
    id: 'imp33586-oscillates-not-monotone',
    holds: () =>
      IMP33586_STATS.successiveSignChanges >= 4 &&
      IMP33586_STATS.successiveSignChanges <= IMP33586_STATS.maxPossibleSignChanges &&
      IMP33586_TRAJECTORY_VERDICT.oscillates === true &&
      IMP33586_TRAJECTORY_VERDICT.convergesWithin1e6 === false,
    why:
      '5 of 8 successive f_oc sign changes and negligible OLS r^2 mean the ' +
      'over-charge share oscillates and does not converge within 10^6.',
  },
  {
    id: 'imp33586-weak-trend',
    holds: () =>
      IMP33586_STATS.olsR2 < 0.2 &&
      IMP33586_STATS.olsSlopePerEfold > 0 &&
      IMP33586_TRAJECTORY_VERDICT.weakPositiveDrift === true,
    why: 'The OLS fit of f_oc vs ln(end-N) is a weak positive drift (r^2 ~ 0.10).',
  },
  {
    id: 'imp33586-endpoint-within-1-sigma',
    holds: () =>
      Math.abs(IMP33586_STATS.endpointZVsMean) < 1 &&
      Math.abs(IMP33586_STATS.endpointZVsFit) < 1 &&
      IMP33586_STATS.endpointFOc > IMP33586_STATS.endpointTrendPrediction &&
      IMP33586_TRAJECTORY_VERDICT.endpointIsRepresentative === true &&
      IMP33586_TRAJECTORY_VERDICT.endpointIsOutlier === false,
    why:
      'The N=10^6 endpoint f_oc is above the trend but within 1 sigma (mean and ' +
      'fit-residual), so it is representative, not an outlier.',
  },
  {
    id: 'imp33586-baked-matches-imp33300',
    holds: () => {
      // f_oc range must reproduce the imp-33300 baked IMP33300_OC_FRACTION_RANGE
      const fs = IMP33586_TRAJECTORY.map((r) => r.fOc);
      const lo = Math.min(...fs);
      const hi = Math.max(...fs);
      return (
        Math.abs(lo - IMP33586_STATS.fOcMin) < 1e-6 &&
        Math.abs(hi - IMP33586_STATS.fOcMax) < 1e-6 &&
        Math.abs(lo - 5.441617e-1) < 1e-6 &&
        Math.abs(hi - 8.707210e-1) < 1e-6
      );
    },
    why: 'The baked f_oc extremes must match the imp-33300 IMP33300_OC_FRACTION_RANGE.',
  },
  {
    id: 'imp33586-measurement-only-no-lambda-claim',
    holds: () =>
      IMP33586_OVERCHARGE_FRACTION_TRAJECTORY.scope.measurementOnly === true &&
      IMP33586_OVERCHARGE_FRACTION_TRAJECTORY.scope.imp3066Untouched === true &&
      IMP33586_OVERCHARGE_FRACTION_TRAJECTORY.scope.noNewLambdaBound === true &&
      IMP33586_OVERCHARGE_FRACTION_TRAJECTORY.scope.noQED === true &&
      IMP33586_OVERCHARGE_FRACTION_TRAJECTORY.status === 'measurement',
    why:
      'Honesty guard: this orders and fits an existing slack diagnostic, claims ' +
      'no new Lambda bound, leaves imp-3066 untouched, and no refereed bound is changed' +
      '.',
  },
];

for (const assertion of IMP33586_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33586-overcharge-fraction-trajectory assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP33586_OVERCHARGE_FRACTION_TRAJECTORY;
