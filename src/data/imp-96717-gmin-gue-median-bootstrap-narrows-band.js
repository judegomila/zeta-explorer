/**
 * imp-96717 -- Narrow the imp-96616/imp-96639 GUE cube-root extreme-gap tracking band with a
 * variance-reduced disjoint-window MEDIAN estimator on the full 2,001,052-zero zeros6 dataset.
 * Measurement only; NO QED. No refereed bound is changed.
 *
 * THE OPEN QUESTION (imp-96639 headword). imp-96616 measured g_min(N)/y_N as a single RUNNING
 * MINIMUM over the first N zeros and reported it tracks the GUE median envelope 0.8582 N^{-1/3}
 * only to within a wide 0.90x .. 2.21x band, with a fitted decay exponent -0.3953 slightly
 * steeper than the GUE cube-root -1/3 = -0.3333. The imp-96639 gloss left open whether that
 * band and that exponent gap narrow toward the GUE prediction at higher N, or are finite-N
 * effects of the estimator itself.
 *
 * WHY THE RUNNING MIN IS THE WRONG ESTIMATOR FOR THE MEDIAN. The GUE prediction
 * median g_min/y_N = (9 ln2 / (pi^2 N))^{1/3} = 0.8582 N^{-1/3} is the MEDIAN of the
 * window-minimum over an ensemble of length-N windows. A single running minimum over [1,N] is
 * ONE draw of that random variable -- it has O(1) relative variance that never shrinks with N,
 * so its ratio to the median wanders in a wide band and its log-log slope is biased by the few
 * extreme outlier gaps that set the running min. Extending the running min to the full 2e6
 * zeros does NOT fix this: the exponent drifts further to -0.4071 and the band widens to
 * [0.7996, 2.21], confirming the deviation is estimator variance, not a real departure from GUE.
 *
 * THE FIX. Partition the 2,001,052 zeros into floor((M-1)/w) DISJOINT windows of size w, take
 * the min normalized gap d_n = (g_{n+1}-g_n) log(g_n/2pi)/(2pi) in each window, then take the
 * MEDIAN across windows. This is a direct estimate of the GUE median window-min with variance
 * ~1 / (#windows), so it collapses toward the true envelope as w shrinks (more windows). It is
 * exactly the "bootstrap the median-ratio estimate" alternative named in the imp-96717 ticket.
 *
 * FINDING (reproduced by tmp/imp-96717-gue-median-bootstrap.mjs; import-light -- no zeros
 * bundle imported here, table baked).
 *   - The median estimator tracks the GUE envelope 0.8582 w^{-1/3} to within a factor
 *     0.9843 .. 1.0674 across w = 50 .. 200000 -- a ~15x narrower band than the running-min
 *     0.90 .. 2.21, and it does NOT drift with w (it is flat, not widening).
 *   - Its fitted decay exponent is -0.3430, within 3% of the GUE cube-root -1/3 = -0.3333 and
 *     far closer than the running-min -0.3953 / -0.4071. Its fitted prefactor 0.9590 is close
 *     to the GUE median constant 0.8582.
 *   - CONCLUSION (measurement only): the imp-96616/imp-96639 wide band and the -0.3953 vs -1/3
 *     exponent gap are FINITE-SAMPLE VARIANCE ARTIFACTS of the single running-min draw, not a
 *     real deviation from GUE. The variance-reduced median estimator confirms the GUE cube-root
 *     small-gaps envelope tightly. This does NOT prove the unconditional small-gaps theorem
 *     (still a finite-N sample, still no asymptotic bound) -- it only sharpens the empirical
 *     evidence that the pair-correlation wall sits exactly on that (unproved) cube-root exponent.
 */

export const GMIN_GUE_MEDIAN_BOOTSTRAP = {
  id: 'imp-96717',
  glosses: 'imp-96616',
  refines: 'imp-96639',
  source: {
    zerosFile: 'scripts/.zeros-cache/zeros6',
    zerosCount: 2001052,
    gammaMax: 1132490.658714411,
    reproScript: 'tmp/imp-96717-gue-median-bootstrap.mjs',
    normalizedGap: 'd_n = (g_{n+1}-g_n) log(g_n/2pi)/(2pi)',
    gueMedianConstant: 0.8582, // (9 ln2 / pi^2)^{1/3}, envelope 0.8582 w^{-1/3}
  },
  // (a) running-min ladder EXTENDED to the full 2e6 zeros (single high-variance draw).
  runningMinExtended: {
    tail: [
      { N: 1000000, ratio: 0.009695, gueMedian: 0.008582, dataOverGue: 1.1297 },
      { N: 2000000, ratio: 0.005447, gueMedian: 0.006812, dataOverGue: 0.7996 },
      { N: 2001052, ratio: 0.005447, gueMedian: 0.006810, dataOverGue: 0.7998 },
    ],
    fitExponent: -0.4071, // WIDER than imp-96616's -0.3953 -- extending does not help
    fitPrefactor: 2.3006,
    bandMin: 0.7996,
    bandMax: 2.2105,
  },
  // (b) disjoint-window MEDIAN estimator: median over floor((M-1)/w) blocks of the block-min.
  // w, #blocks, median block-min, GUE median 0.8582 w^{-1/3}, median/GUE.
  windowMedianLadder: [
    { w: 50, blocks: 40021, median: 0.247611, gueMedian: 0.232952, medianOverGue: 1.0629 },
    { w: 100, blocks: 20010, median: 0.197364, gueMedian: 0.184894, medianOverGue: 1.0674 },
    { w: 200, blocks: 10005, median: 0.156116, gueMedian: 0.146750, medianOverGue: 1.0638 },
    { w: 500, blocks: 4002, median: 0.113883, gueMedian: 0.108127, medianOverGue: 1.0532 },
    { w: 1000, blocks: 2001, median: 0.090281, gueMedian: 0.085820, medianOverGue: 1.0520 },
    { w: 2000, blocks: 1000, median: 0.072352, gueMedian: 0.068116, medianOverGue: 1.0622 },
    { w: 5000, blocks: 400, median: 0.049872, gueMedian: 0.050188, medianOverGue: 0.9937 },
    { w: 10000, blocks: 200, median: 0.041357, gueMedian: 0.039834, medianOverGue: 1.0382 },
    { w: 20000, blocks: 100, median: 0.032748, gueMedian: 0.031616, medianOverGue: 1.0358 },
    { w: 50000, blocks: 40, median: 0.023063, gueMedian: 0.023295, medianOverGue: 0.9900 },
    { w: 100000, blocks: 20, median: 0.018543, gueMedian: 0.018489, medianOverGue: 1.0029 },
    { w: 200000, blocks: 10, median: 0.014444, gueMedian: 0.014675, medianOverGue: 0.9843 },
  ],
  windowMedianFit: {
    exponent: -0.3430, // vs GUE cube-root -1/3 = -0.3333 (within 3%)
    prefactor: 0.9590, // vs GUE median constant 0.8582
    bandMin: 0.9843,
    bandMax: 1.0674,
  },
  comparison: {
    runningMinBand: [0.8966, 2.2105], // imp-96616 reported band
    windowMedianBand: [0.9843, 1.0674],
    bandTighteningFactor: (2.2105 - 0.8966) / (1.0674 - 0.9843), // ~15.8x
    runningMinExponent: -0.3953,
    windowMedianExponent: -0.3430,
    gueCubeRootExponent: -1 / 3,
  },
  reading:
    'The imp-96616/imp-96639 wide 0.90x-2.21x band and the -0.3953 vs -1/3 exponent gap are ' +
    'finite-sample variance artifacts of the single running-min draw. A disjoint-window MEDIAN ' +
    'estimator over the full 2,001,052 zeros tracks the GUE envelope 0.8582 w^{-1/3} to within ' +
    '0.9843x-1.0674x (~15x narrower) with a fitted exponent -0.3430 (within 3% of -1/3). This ' +
    'confirms GUE cube-root small-gaps behavior tightly but proves no unconditional small-gaps ' +
    'theorem -- it sharpens, does not remove, the relocated pair-correlation wall. NO QED.',
};

export default GMIN_GUE_MEDIAN_BOOTSTRAP;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96717_ASSERTIONS = [
  {
    id: 'imp96717-median-band-narrower-than-running-min',
    why: 'The whole point: the disjoint-window median estimator must give a materially ' +
      'tighter band around the GUE envelope than the single running-min draw.',
    holds: () => {
      const f = GMIN_GUE_MEDIAN_BOOTSTRAP.windowMedianFit;
      const medWidth = f.bandMax - f.bandMin;
      const rmWidth = GMIN_GUE_MEDIAN_BOOTSTRAP.runningMinExtended.bandMax -
        GMIN_GUE_MEDIAN_BOOTSTRAP.runningMinExtended.bandMin;
      return medWidth > 0 && rmWidth > 5 * medWidth;
    },
  },
  {
    id: 'imp96717-median-exponent-closer-to-cube-root',
    why: 'The median estimator exponent must sit closer to the GUE -1/3 than the running-min ' +
      '-0.3953, showing the exponent gap was a variance artifact.',
    holds: () => {
      const cube = 1 / 3;
      const med = Math.abs(GMIN_GUE_MEDIAN_BOOTSTRAP.windowMedianFit.exponent) - cube;
      const rm = Math.abs(-0.3953) - cube;
      return Math.abs(med) < Math.abs(rm);
    },
  },
  {
    id: 'imp96717-ladder-tracks-gue-per-rung',
    why: 'Every window-median rung must land within 10% of the GUE median 0.8582 w^{-1/3}, ' +
      'confirming per-rung (not just fitted) tracking.',
    holds: () =>
      GMIN_GUE_MEDIAN_BOOTSTRAP.windowMedianLadder.every(
        (r) => r.medianOverGue > 0.9 && r.medianOverGue < 1.1,
      ),
  },
  {
    id: 'imp96717-honesty-gate-no-qed',
    why: 'Measurement only: no bound moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(GMIN_GUE_MEDIAN_BOOTSTRAP.reading) &&
      GMIN_GUE_MEDIAN_BOOTSTRAP.glosses === 'imp-96616',
  },
];

for (const assertion of IMP96717_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96717-gmin-gue-median-bootstrap assertion failed: ${assertion.id}`);
  }
}
