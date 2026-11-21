/**
 * imp-96654 -- Sensitivity of the imp-96637 GUE crossover N* = 2.09e6 to the fitted small-gaps
 * exponent b = -0.3953, and a tabulation of the running-min two-sided oscillation amplitude about the
 * GUE median envelope. Measurement / sensitivity only; conditional on GUE; NO QED. No refereed bound is changed.
 *
 * SETUP. imp-96637 solved the crossover of the imp-96616 measured single-power fit f(N) = A N^b
 * (A = 2.1147, b = -0.3953) against the GUE median envelope g(N) = C N^c (C = 0.8582, c = -1/3) as
 *   N* = (A/C)^{1/(c-b)} = 2.0917e6.
 * The exponent difference c - b = -1/3 + 0.3953 = 0.0619667 sits in the DENOMINATOR of the exponent,
 * so N* = exp(ln(A/C)/(c-b)) is a pole at b = c: as the fitted b approaches -1/3 from below, N* -> +inf,
 * and once b >= -1/3 the two power laws no longer cross at finite N. imp-96637 quoted only the
 * point-estimate N*; this module (i) reproduces the imp-96616 OLS log-log fit to recover the standard
 * error SE(b), (ii) propagates SE(b) through the pole into a confidence INTERVAL for N*, and
 * (iii) tabulates the two-sided oscillation amplitude of ratioOverGue = f/g about 1.
 *
 * METHOD (i)-(ii). The 14-rung ladder (N, ratio = g_min(N)/y_N) is fit by ordinary least squares in
 * log-log: log(ratio) = a + b log(N). The reproduction returns b = -0.395338, A = exp(a) = 2.1147 --
 * i.e. it reproduces the imp-96616 baked point fit exactly, confirming the baked fit is the plain OLS
 * over these rungs. The residual standard error gives SE(b) = 0.020615 (df = n - 2 = 12). The baked b
 * therefore lies only (b - c)/SE(b) = -0.061967/0.020615 = -3.006 SE below the pole c = -1/3. Because
 * the pole is barely 3 SE away, propagating even a +/-1 SE band on b sends N* across five orders of
 * magnitude, and the two-sided 95% band across ~19 orders of magnitude (still finite only because the
 * 95% upper limit on b, -0.3504, stays just below -1/3).
 *
 * FINDING.
 *   - REPRODUCED FIT: OLS over the 14 rungs gives b = -0.395338 +/- 0.020615 (SE), A = 2.1147 --
 *     matching the imp-96616 baked (b = -0.3953, A = 2.1147) to 4 sig figs. Residual s = 0.2384.
 *   - N* IS ESSENTIALLY UNLOCALIZED BY THE DATA. Point N* = 2.09e6 (log10 = 6.32). Propagating SE(b):
 *       b - 1 SE (-0.41592, steeper): N* = 5.53e4  (log10 = 4.74)
 *       b + 1 SE (-0.37468, shallower): N* = 2.96e9  (log10 = 9.47)
 *       b - t95  (-0.44022): N* = 4.62e3  (log10 = 3.66)
 *       b + t95  (-0.35038): N* = 9.34e22 (log10 = 22.97)
 *     The +/-1 SE band alone spans [5.5e4, 3.0e9] (~5 decades); the 95% band spans [4.6e3, 9.3e22]
 *     (~19 decades). The crossover location is thus NOT robustly determined -- the "2.09e6" is a
 *     point estimate sitting near a pole, and any exponent within ~3 SE of -1/3 pushes the crossing
 *     arbitrarily far out (or removes it). This does not change the imp-96616 consequence; it shows the
 *     crossover N* is a soft, near-singular readout, not a measured scale.
 *   - OSCILLATION AMPLITUDE about 1 (ratioOverGue over the 14 rungs): range 0.8966 .. 2.2105, mean
 *     1.4868, peak-to-peak amplitude 1.3139, RMS deviation from 1 = 0.6509, mean |dev| = 0.5127. Max
 *     upward excursion +121.1% at N = 200; max downward excursion -10.3% at N = 5e5; two sub-1 dips
 *     (N = 5000: 0.9223; N = 5e5: 0.8966).
 *   - SAWTOOTH ARGMIN-FREEZE PLATEAUS. On each plateau where the argmin index is frozen (ratio held at
 *     the last record gap while the GUE median C N^{-1/3} keeps shrinking), ratioOverGue rises exactly
 *     as N^{+1/3}: it multiplies by 2^{1/3} = 1.2599 per doubling of N. Measured plateau doublings
 *     confirm this to 4 sig figs: 50->100 (1.6582->2.0892), 1e4->2e4 (1.0568->1.3315),
 *     1e5->2e5 (1.1823->1.4896), 5e5->1e6 (0.8966->1.1297) -- each ratio 1.260. The record-gap jumps
 *     (argmin 33 -> 185 -> 452 -> 921 -> 1495 -> 4764 -> 6708 -> 44554 -> 95247 -> 420890) reset the
 *     numerator and snap ratioOverGue back down, producing the sawtooth.
 */

export const GMIN_CROSSOVER_SENSITIVITY_OSCILLATION = {
  id: 'imp-96654',
  source: {
    ladderFrom: 'imp-96616 GMIN_RATIO_EXTREME_GAP_DECAY.ladder (14 rungs, N=50..1e6)',
    crossoverFrom: 'imp-96637 GMIN_FIT_GUE_CROSSOVER.crossover',
    reproScript: 'tmp/imp-96654-scratch.mjs',
    measuredFit: { form: 'A N^b', A: 2.1147, b: -0.3953 },
    gueMedianEnvelope: { form: 'C N^c', C: 0.8582, c: -1 / 3 },
  },
  // (i) reproduce the imp-96616 OLS log-log fit and recover SE(b)
  reproducedFit: {
    method: 'OLS of log(ratio) = a + b log(N) over the 14 rungs',
    bHat: -0.395338,
    A: 2.1147, // exp(a)
    matchesBakedFit: true, // imp-96616 baked b=-0.3953, A=2.1147
    residualStdErr: 0.238443,
    degreesOfFreedom: 12,
    seB: 0.020615,
  },
  // (ii) propagate SE(b) through the pole N* = (A/C)^{1/(c-b)}, c=-1/3
  crossoverSensitivity: {
    poleAt: -1 / 3, // b = c => c-b = 0 => N* -> +inf; b >= c => no finite crossing
    exponentDiffAtBaked: 0.0619667, // c - b
    lnPrefactorRatio: 0.901831, // ln(A/C), A=2.1147 C=0.8582
    bakedBDistanceToPoleInSE: -3.006, // (b - c)/SE(b)
    NstarPoint: 2.0917e6,
    log10NstarPoint: 6.3205,
    band1SE: {
      // b +/- 1 SE
      bSteeperMinus1SE: -0.415915,
      NstarSteeper: 5.5297e4, // log10 4.7427
      bShallowerPlus1SE: -0.374685,
      NstarShallower: 2.9610e9, // log10 9.4714
      spanDecades: 4.73,
    },
    band95: {
      // b +/- t_{0.975,12} SE, t = 2.1788
      tCrit: 2.1788,
      bLo: -0.440216,
      NstarLo: 4.6174e3, // log10 3.6644
      bHi: -0.350384,
      NstarHi: 9.3377e22, // log10 22.9702; finite only because bHi < -1/3
      spanDecades: 19.31,
      crossesPole: false, // 95% upper b = -0.3504 still below -1/3
    },
    verdict:
      'N* = 2.09e6 is a point estimate near a pole: b sits only ~3 SE from c=-1/3, so the crossover is not robustly localized -- +/-1 SE spans 5 decades, the 95% band ~19 decades. Soft near-singular readout, not a measured scale.',
  },
  // (iii) two-sided oscillation of ratioOverGue about 1
  oscillation: {
    ratioOverGueMin: 0.8966, // N=5e5
    ratioOverGueMax: 2.2105, // N=200
    mean: 1.4868,
    peakToPeakAmplitude: 1.3139,
    rmsDeviationFromOne: 0.6509,
    meanAbsDeviationFromOne: 0.5127,
    maxUpwardExcursionPct: 121.1, // at N=200
    maxDownwardExcursionPct: -10.3, // at N=5e5
    subOneDips: [
      { N: 5000, ratioOverGue: 0.9223 },
      { N: 500000, ratioOverGue: 0.8966 },
    ],
    plateauSlope: {
      note: 'on an argmin-freeze plateau ratioOverGue rises exactly as N^{+1/3} (x 2^{1/3} = 1.2599 per doubling)',
      twoFold: 1.2599,
      measuredDoublings: [
        { from: 50, to: 100, ratioOverGueFrom: 1.6582, ratioOverGueTo: 2.0892, factor: 1.2599 },
        { from: 10000, to: 20000, ratioOverGueFrom: 1.0568, ratioOverGueTo: 1.3315, factor: 1.2599 },
        { from: 100000, to: 200000, ratioOverGueFrom: 1.1823, ratioOverGueTo: 1.4896, factor: 1.2599 },
        { from: 500000, to: 1000000, ratioOverGueFrom: 0.8966, ratioOverGueTo: 1.1297, factor: 1.2600 },
      ],
      argminJumps: [33, 185, 452, 921, 1495, 4764, 6708, 44554, 95247, 420890],
    },
  },
  reading:
    'Reproducing the imp-96616 OLS fit gives b = -0.395338 +/- 0.0206 (SE), matching the baked point ' +
    'fit exactly. The imp-96637 crossover N* = (A/C)^{1/(c-b)} = 2.09e6 sits near the pole b = c = -1/3 ' +
    '(baked b only ~3 SE below it), so propagating the fit uncertainty on b spreads N* across ~5 decades ' +
    'at +/-1 SE and ~19 decades at 95% -- the crossover is a soft near-singular readout, not a measured ' +
    'scale. The running-min ratioOverGue is a two-sided oscillation about 1 (range 0.897..2.21, RMS ' +
    'deviation 0.65, peak-to-peak 1.31), rising exactly as N^{+1/3} on each argmin-freeze plateau and ' +
    'snapping down at each new record gap. Neither reading changes the imp-96616 consequence: beating ' +
    'the 1/log^2 surrogate still needs the unproved GUE cube-root small-gaps law. Sensitivity/measurement ' +
    'only; conditional on GUE; NO QED.',
};

export default GMIN_CROSSOVER_SENSITIVITY_OSCILLATION;
