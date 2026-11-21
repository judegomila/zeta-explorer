/**
 * imp-96616 -- Measure the g_min(N)/y_N extreme-gap ratio decay on the Odlyzko zeros to quantify
 * the small-gaps exponent that any fold-law envelope-exponent improvement would demand.
 * Measurement only; NO QED. No refereed bound is changed.
 *
 * WHY THIS RATIO IS THE FOLD-LAW LEVER. rh-bridge-supercritical-fluid-shock-scaling-2026-09-24 Q1
 * establishes that the exact fold law |t_c(N)| = g_min(N)^2 / 8 is a far better per-N ENVELOPE for
 * the collision time than the 1-point-density surrogate 2 pi / log^2(gamma_N / 2 pi). The surrogate
 * is exactly the fold law with g_min replaced by ~1.13 y_N (y_N = 2 pi / log(gamma_N / 2 pi) the local
 * mean spacing): 2 pi / log^2 = y_N^2 / (2 pi) vs the fold y_N^2 / 8 differ by 8 / (2 pi) = 1.27, i.e.
 * g_min -> 1.13 y_N. So the 1-point density can only ever deliver the surrogate 1 / log^2 rate, and
 * EVERY improvement of the envelope exponent is equivalent to g_min(N) / y_N -> 0 -- a small-gaps
 * theorem. This module measures how fast that ratio actually decays and against what GUE prediction.
 *
 * METHOD. The first 2,001,052 Odlyzko ordinates (scripts/.zeros-cache/zeros6, gamma up to ~1.13e6)
 * are read raw; each adjacent gap is unfolded by the local mean spacing,
 *   d_n = (gamma_{n+1} - gamma_n) * log(gamma_n / 2 pi) / (2 pi),
 * and g_min(N) / y_N is taken as the running minimum normalized gap over the first N zeros
 * (min_{n < N} d_n). A least-squares power fit log(ratio) = a + b log(N) gives the decay exponent b.
 * The measured table below is baked (import-light -- no zeros bundle imported here); it is reproduced
 * by tmp/imp-96616-gmin-ratio.mjs.
 *
 * FINDING.
 *   - Measured decay exponent b = -0.3953 over N = 50 .. 1e6 (running-min fit). This is close to,
 *     and slightly steeper than, the GUE (sine-kernel) extreme-gap law exponent -1/3 = -0.3333, and
 *     agrees with the Q1 quoted -0.373 to within fit-method sensitivity (running min vs per-window).
 *   - The GUE s^2 level-repulsion R_2(s) ~ (pi^2/3) s^2 predicts median g_min / y_N =
 *     (9 ln2 / (pi^2 N))^{1/3} = 0.8582 * N^{-1/3}. The measured ratio tracks this median envelope to
 *     within a factor 0.90 .. 2.21 across the whole range, and 1.13x at N = 1e6.
 *   - CONSEQUENCE (measurement only): to beat the surrogate 1 / log^2 envelope exponent one needs
 *     g_min(N) <= C N^{-1/3+eps} y_N, i.e. exactly the GUE cube-root small-gaps law -- unproved
 *     unconditionally. The measured -0.395 is the empirical size of the exponent a per-N improvement
 *     would have to supply. This RELOCATES, does not remove, the pair-correlation wall.
 */

export const GMIN_RATIO_EXTREME_GAP_DECAY = {
  id: 'imp-96616',
  source: {
    zerosFile: 'scripts/.zeros-cache/zeros6',
    zerosCount: 2001052,
    gammaMax: 1132490.658714411,
    reproScript: 'tmp/imp-96616-gmin-ratio.mjs',
    ratioDefinition: 'running min over n<N of normalized gap d_n = (g_{n+1}-g_n) log(g_n/2pi)/(2pi)',
  },
  // N, g_min(N)/y_N, GUE median (9 ln2/pi^2 N)^{1/3}, ratio/GUE, argmin zero index, gamma at argmin
  ladder: [
    { N: 50, ratio: 0.386289, gueMedian: 0.232952, ratioOverGue: 1.6582, argminIdx: 33, gamma: 111.0295 },
    { N: 100, ratio: 0.386289, gueMedian: 0.184894, ratioOverGue: 2.0892, argminIdx: 33, gamma: 111.0295 },
    { N: 200, ratio: 0.324386, gueMedian: 0.146750, ratioOverGue: 2.2105, argminIdx: 185, gamma: 375.8259 },
    { N: 500, ratio: 0.236315, gueMedian: 0.108127, ratioOverGue: 2.1855, argminIdx: 452, gamma: 750.6560 },
    { N: 1000, ratio: 0.137626, gueMedian: 0.085820, ratioOverGue: 1.6037, argminIdx: 921, gamma: 1329.0435 },
    { N: 2000, ratio: 0.089253, gueMedian: 0.068116, ratioOverGue: 1.3103, argminIdx: 1495, gamma: 1977.1739 },
    { N: 5000, ratio: 0.046290, gueMedian: 0.050188, ratioOverGue: 0.9223, argminIdx: 4764, gamma: 5229.1986 },
    { N: 10000, ratio: 0.042098, gueMedian: 0.039834, ratioOverGue: 1.0568, argminIdx: 6708, gamma: 7005.0629 },
    { N: 20000, ratio: 0.042098, gueMedian: 0.031616, ratioOverGue: 1.3315, argminIdx: 6708, gamma: 7005.0629 },
    { N: 50000, ratio: 0.040746, gueMedian: 0.023295, ratioOverGue: 1.7491, argminIdx: 44554, gamma: 36510.1664 },
    { N: 100000, ratio: 0.021860, gueMedian: 0.018489, ratioOverGue: 1.1823, argminIdx: 95247, gamma: 71732.9012 },
    { N: 200000, ratio: 0.021860, gueMedian: 0.014675, ratioOverGue: 1.4896, argminIdx: 95247, gamma: 71732.9012 },
    { N: 500000, ratio: 0.009695, gueMedian: 0.010813, ratioOverGue: 0.8966, argminIdx: 420890, gamma: 273193.6631 },
    { N: 1000000, ratio: 0.009695, gueMedian: 0.008582, ratioOverGue: 1.1297, argminIdx: 420890, gamma: 273193.6631 },
  ],
  fit: {
    exponent: -0.3953,
    prefactor: 2.1147,
    gueExtremeGapExponent: -1 / 3,
    q1QuotedExponent: -0.373,
  },
  gue: {
    // median g_min/y_N = (9 ln2 / (pi^2 N))^{1/3} from R_2(s) ~ (pi^2/3) s^2 level repulsion
    medianConstant: 0.8582,
    ratioOverGueMin: 0.8966,
    ratioOverGueMax: 2.2105,
    ratioOverGueAt1e6: 1.1297,
  },
  reading:
    'Measured g_min(N)/y_N decays as N^{-0.395}, close to (slightly steeper than) the GUE cube-root ' +
    'extreme-gap exponent -1/3, and stays within ~2.2x of the GUE median envelope. Any fold-law ' +
    'envelope-exponent gain beyond the surrogate 1/log^2 requires exactly this cube-root small-gaps ' +
    'decay g_min(N)/y_N -> 0, which is unproved unconditionally. Measurement only; NO QED.',
};

export default GMIN_RATIO_EXTREME_GAP_DECAY;
