/**
 * imp-96637 -- Crossover N* of the imp-96616 measured single-power fit ratio = 2.1147 N^{-0.3953}
 * against the GUE median envelope 0.8582 N^{-1/3}, and whether the measured running-min curve is a
 * strict upper bound or a two-sided oscillation about that envelope.
 * Analytic + tabular reconciliation; conditional on GUE; NO QED. No refereed bound is changed.
 *
 * SETUP. imp-96616 gives two curves for g_min(N)/y_N: the measured free-power FIT
 *   f(N) = A N^b with A = 2.1147, b = -0.3953, and the GUE median ENVELOPE
 *   g(N) = C N^c with C = 0.8582, c = -1/3, from R_2(s) ~ (pi^2/3) s^2 level repulsion.
 * The tabulated ratioOverGue = f/g swings between 0.8966 and 2.2105 and equals 1.1297 at N=1e6,
 * so the two curves must cross. This module (i) solves the analytic crossover, (ii) re-reads the
 * 14-rung ladder to classify the measured curve as one-sided vs two-sided, and (iii) reconciles the
 * smooth-fit crossing with the tabular sub-1 dips.
 *
 * CROSSOVER. A N^b = C N^c  =>  N* = (A/C)^{1/(c-b)}.
 *   A/C = 2.464111, c-b = -1/3 + 0.3953 = 0.0619667, ln(A/C) = 0.901831,
 *   N* = exp(0.901831/0.0619667) = 2.0917e6 (log10 N* = 6.3205), ratio(N*) = 6.71e-3.
 * N* lies just BEYOND the tabulated range (max N = 1e6), so over N = 50..1e6 the smooth fit predicts
 * ratioOverGue_fit(N) = (A/C) N^{b-c} DECREASING monotonically from 1.9337 (N=50) to 1.0468 (N=1e6),
 * staying strictly above 1 across the whole tabulated ladder and dipping below 1 only at N*.
 *
 * FINDING.
 *   - The two FITTED power laws cross ONCE, at N* = 2.09e6 (log10 = 6.32), just past the data. Below
 *     N* the measured-fit envelope is above the GUE median; above N* (if the free power persisted) it
 *     would fall below. The 1.13x at N=1e6 is consistent with the smooth fit value 1.0468 given the
 *     running-min staircase noise.
 *   - The measured RUNNING-MIN curve itself is a TWO-SIDED OSCILLATION about the median envelope, NOT
 *     a strict upper bound: ratioOverGue dips BELOW 1 at N=5000 (0.9223) and N=5e5 (0.8966) while
 *     rising as high as 2.2105 (N=200) elsewhere. The oscillation is the sawtooth artifact of the
 *     running minimum -- the numerator g_min(N) stays frozen at the last record gap while the GUE
 *     median C N^{-1/3} keeps shrinking, so ratioOverGue climbs on each plateau then snaps down when a
 *     new smaller normalized gap sets a fresh record (argmin index jumps 33 -> 185 -> ... -> 420890).
 *   - RECONCILIATION: smooth single-power fit = one-sided upper envelope over N <= 1e6 crossing the
 *     median only at N* ~ 2.1e6; underlying staircase = two-sided oscillation already crossing below 1
 *     twice. The two descriptions are consistent -- the fit smooths the sawtooth. Neither statement
 *     changes the imp-96616 consequence: beating the surrogate 1/log^2 fold envelope still demands the
 *     (unproved) GUE cube-root small-gaps decay g_min(N)/y_N -> 0.
 */

export const GMIN_FIT_GUE_CROSSOVER = {
  id: 'imp-96637',
  source: {
    ladderFrom: 'imp-96616 GMIN_RATIO_EXTREME_GAP_DECAY.ladder (14 rungs, N=50..1e6)',
    reproScript: 'tmp/imp-96637-crossover.mjs',
    measuredFit: { form: 'A N^b', A: 2.1147, b: -0.3953 },
    gueMedianEnvelope: { form: 'C N^c', C: 0.8582, c: -1 / 3, from: 'R_2(s) ~ (pi^2/3) s^2 => (9 ln2/(pi^2 N))^{1/3}' },
  },
  crossover: {
    // A N^b = C N^c  =>  N* = (A/C)^{1/(c-b)}
    prefactorRatioAoverC: 2.464111,
    exponentDiffCminusB: 0.0619667,
    lnPrefactorRatio: 0.901831,
    Nstar: 2.091698e6,
    log10Nstar: 6.3205,
    ratioAtNstar: 6.7105e-3,
    beyondTabulatedRange: true, // tabulated max N = 1e6 < N*
    crossings: 1,
  },
  // fit-predicted ratioOverGue = (A/C) N^{b-c} vs the imp-96616 tabular ratioOverGue at each rung
  ladder: [
    { N: 50, ratioOverGueTabular: 1.6582, ratioOverGueFit: 1.9337, side: 'above' },
    { N: 100, ratioOverGueTabular: 2.0892, ratioOverGueFit: 1.8524, side: 'above' },
    { N: 200, ratioOverGueTabular: 2.2105, ratioOverGueFit: 1.7745, side: 'above' },
    { N: 500, ratioOverGueTabular: 2.1855, ratioOverGueFit: 1.6765, side: 'above' },
    { N: 1000, ratioOverGueTabular: 1.6037, ratioOverGueFit: 1.6061, side: 'above' },
    { N: 2000, ratioOverGueTabular: 1.3103, ratioOverGueFit: 1.5385, side: 'above' },
    { N: 5000, ratioOverGueTabular: 0.9223, ratioOverGueFit: 1.4536, side: 'BELOW' },
    { N: 10000, ratioOverGueTabular: 1.0568, ratioOverGueFit: 1.3925, side: 'above' },
    { N: 20000, ratioOverGueTabular: 1.3315, ratioOverGueFit: 1.3340, side: 'above' },
    { N: 50000, ratioOverGueTabular: 1.7491, ratioOverGueFit: 1.2603, side: 'above' },
    { N: 100000, ratioOverGueTabular: 1.1823, ratioOverGueFit: 1.2073, side: 'above' },
    { N: 200000, ratioOverGueTabular: 1.4896, ratioOverGueFit: 1.1566, side: 'above' },
    { N: 500000, ratioOverGueTabular: 0.8966, ratioOverGueFit: 1.0927, side: 'BELOW' },
    { N: 1000000, ratioOverGueTabular: 1.1297, ratioOverGueFit: 1.0468, side: 'above' },
  ],
  classification: {
    measuredRunningMin: 'two-sided oscillation about the GUE median envelope',
    strictUpperBound: false,
    subOneTabularDips: [
      { N: 5000, ratioOverGue: 0.9223 },
      { N: 500000, ratioOverGue: 0.8966 },
    ],
    tabularMin: 0.8966,
    tabularMax: 2.2105,
    smoothFitEnvelopeOverData: 'one-sided upper (ratioOverGueFit > 1 for all N <= 1e6)',
    fitCrossesMedianAt: 2.091698e6,
    oscillationCause:
      'running-min sawtooth -- g_min(N) frozen at last record gap while C N^{-1/3} median keeps shrinking, ratio climbs on plateaus then snaps down on a new record (argmin 33->185->...->420890)',
  },
  verdict: {
    curvesCross: true,
    crossoverNstar: 2.091698e6,
    measuredIsStrictUpperBound: false,
    measuredIsTwoSidedOscillation: true,
    smoothFitOneSidedOverTabulatedRange: true,
    changesImp96616Consequence: false,
  },
  reading:
    'The imp-96616 measured single-power fit 2.1147 N^{-0.3953} and the GUE median 0.8582 N^{-1/3} ' +
    'cross once at N* = 2.09e6 (just beyond the N=1e6 data); over the tabulated range the smooth fit ' +
    'is a one-sided upper envelope (ratioOverGue_fit falls 1.93 -> 1.05 but stays above 1). The ' +
    'underlying running-min curve is a TWO-SIDED oscillation about the median (dips 0.9223 at N=5000 ' +
    'and 0.8966 at N=5e5, peaks 2.2105), a sawtooth artifact of the frozen record minimum. Neither ' +
    'reading removes the imp-96616 consequence: beating 1/log^2 needs the unproved GUE cube-root ' +
    'small-gaps law. Analytic + tabular reconciliation; conditional on GUE; NO QED.',
};

export default GMIN_FIT_GUE_CROSSOVER;
