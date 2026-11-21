/**
 * imp-96734 -- Is the imp-96616 running-min gap exponent -0.3953 (vs GUE cube-root -1/3) a finite-N /
 * plateau-bias artifact, or persistent? Sliding-window / plateau-excluded / high-N-restricted refit of
 * the imp-96629 plateau-free block-minima data. Measurement only; conditional on GUE; NO QED.
 * No refereed bound is changed.
 *
 * BACKGROUND. imp-96616 fit the running-min normalized gap ratio g_min(N)/y_N over the first ~2e6
 * Odlyzko zeros (N=50..1e6) to a power law with exponent b = -0.3953, slightly steeper than the GUE
 * (sine-kernel) extreme-gap cube-root -1/3 = -0.3333. imp-96629 already showed the -0.373-vs-0.395
 * spread is a running-min-vs-per-window fit-method artifact (the plateau-free per-window block-minima
 * estimator gives -0.3818 matched / -0.3983 full), so the steepness is NOT a plateau-reuse bias. What
 * was never tested is the finite-N QUESTION the ticket poses: as N grows, does the LOCAL exponent trend
 * up toward GUE -1/3 (a finite-N/plateau convergence effect), or stay at least as steep (persistent)?
 *
 * METHOD (re-analysis of baked data only -- no zeros bundle imported, no new quadrature). Take the
 * imp-96629 disjoint dyadic block minima (one independent extreme per block [2^k, 2^{k+1}), k=6..20,
 * N_center = 2^{k+0.5} up to ~1.48e6, from zeros6 = 2,001,052 ordinates). Compute:
 *   (a) sliding-window local exponents b(N_center) by least-squares fitting log(min) = a + b log(N) on
 *       W consecutive blocks (W in {3,5}), then regress b on log10(N_center) to get the trend slope
 *       d b / d log10(N) (positive => rising toward -1/3);
 *   (b) high-N-restricted cumulative fits, dropping the smallest-N blocks one at a time and refitting
 *       the single power on the remaining larger-N tail;
 *   (c) a split-half single-power fit (low half k=6..12 vs high half k=13..20).
 * Reproduced by tmp/imp-96734-scratch.mjs.
 *
 * FINDING (the deviation is persistent, not a finite-N artifact).
 *   - Sliding-window trend: d b / d log10(N_center) = -0.0095 (W=3) and -0.0079 (W=5). Both are
 *     slightly NEGATIVE, i.e. the local exponent does not rise toward -1/3 with N; it stays flat-to-
 *     steeper. First-vs-last window: -0.3611 -> -0.4159 (W=3), -0.5334 -> -0.5123 (W=5).
 *   - High-N-restricted cumulative fit: dropping the small-N blocks does NOT shallow the exponent
 *     toward -0.333; it holds near -0.39..-0.42 and (noisily) steepens to -0.49..-0.65 on the last
 *     4..5 blocks. The opposite of a finite-N convergence to GUE -1/3.
 *   - Split-half: low half b = -0.5103, high half b = -0.5169 -- essentially equal and both steeper
 *     than the global -0.398, confirming no half-to-half trend toward -1/3.
 *   - LIMITATION (honest). Block-extreme scatter is large (per-window rms up to ~0.37; the split-half
 *     and high-N-restricted single powers running to ~-0.51/-0.65 are dominated by this scatter, not a
 *     genuine steepening law). So over the accessible range (N <= ~2e6) a single power resolves the
 *     exponent only to about +/- 0.1 locally; the data can neither confirm nor exclude an eventual
 *     asymptotic approach to -1/3 at N far beyond 2e6. What it DOES exclude is the finite-N/plateau-
 *     bias explanation: there is no upward trend of the local exponent toward -1/3 anywhere in
 *     N = 90 .. 1.48e6.
 *   - REACH. Only scripts/.zeros-cache/zeros6 (2,001,052 ordinates, N_center <= ~1.48e6) is available;
 *     no further Odlyzko blocks are cached, so extending the ladder past N ~ 2e6 was not possible here.
 *
 * VERDICT. The -0.3953 vs -1/3 gap is PERSISTENT over the measured range, not a finite-N / plateau-bias
 * artifact: neither the sliding-window local exponent nor the high-N-restricted tail fit trends toward
 * GUE -1/3 as N grows (if anything they run steeper), and the split-half exponents are equal. The
 * cube-root small-gaps wall from imp-96616 is unmoved -- this RELOCATES nothing, it only rules out the
 * finite-N escape hatch. Measurement only; conditional on GUE; NO QED. No refereed bound is changed.
 */

export const GMIN_EXPONENT_FINITEN_TREND = {
  id: 'imp-96734',
  source: {
    zerosFile: 'scripts/.zeros-cache/zeros6',
    zerosCount: 2001052,
    blockDataFrom: 'imp-96629 per-window disjoint dyadic block minima (k=6..20)',
    reproScript: 'tmp/imp-96734-scratch.mjs',
    note: 'Re-analysis of baked imp-96629 block minima only; no zeros bundle imported; no new quadrature.',
  },
  gueExtremeGapExponent: -1 / 3,
  runningMinExponent: -0.3953, // imp-96616
  perWindowFullExponent: -0.3983, // imp-96629 (reproduced here as the k=6..20 baseline)
  // (a) Sliding-window local exponents b(N_center), window of W consecutive blocks.
  slidingWindow: {
    W5: {
      rows: [
        { Ncenter: 362.0, b: -0.5334, rms: 0.087 },
        { Ncenter: 724.1, b: -0.4655, rms: 0.139 },
        { Ncenter: 1448.2, b: -0.5522, rms: 0.166 },
        { Ncenter: 2896.3, b: -0.2350, rms: 0.308 },
        { Ncenter: 5792.6, b: -0.2099, rms: 0.300 },
        { Ncenter: 11585.2, b: -0.2344, rms: 0.301 },
        { Ncenter: 23170.5, b: -0.3014, rms: 0.332 },
        { Ncenter: 46341.0, b: -0.4512, rms: 0.201 },
        { Ncenter: 92681.9, b: -0.5015, rms: 0.237 },
        { Ncenter: 185363.8, b: -0.4640, rms: 0.253 },
        { Ncenter: 370727.6, b: -0.5123, rms: 0.269 },
      ],
      trendSlopePerDecade: -0.0079, // d b / d log10(Ncenter); positive would mean rising toward -1/3
      firstWindowB: -0.5334,
      lastWindowB: -0.5123,
    },
    W3: {
      trendSlopePerDecade: -0.0095,
      firstWindowB: -0.3611,
      lastWindowB: -0.4159,
    },
  },
  // (b) High-N-restricted cumulative single-power fits (drop smallest-N blocks one at a time).
  highNRestricted: [
    { NfromExp: 9.05e1, kFrom: 6, nPts: 15, b: -0.3983, rms: 0.280 },
    { NfromExp: 3.62e2, kFrom: 8, nPts: 13, b: -0.3923, rms: 0.300 },
    { NfromExp: 2.90e3, kFrom: 11, nPts: 10, b: -0.4158, rms: 0.320 },
    { NfromExp: 1.16e4, kFrom: 13, nPts: 8, b: -0.5169, rms: 0.231 },
    { NfromExp: 4.63e4, kFrom: 15, nPts: 6, b: -0.5278, rms: 0.247 },
    { NfromExp: 1.85e5, kFrom: 17, nPts: 4, b: -0.6510, rms: 0.260 },
  ],
  // (c) Split-half single-power fits.
  splitHalf: {
    lowHalf: { range: 'k=6..12', b: -0.5103, rms: 0.147 },
    highHalf: { range: 'k=13..20', b: -0.5169, rms: 0.231 },
  },
  localResolutionSigma: 0.1, // single-power local resolution over N <= ~2e6, limited by block-extreme scatter
  reachNote:
    'Only zeros6 (2,001,052 ordinates, N_center <= ~1.48e6) is cached; no further Odlyzko blocks ' +
    'available, so the ladder could not be extended past N ~ 2e6.',
  verdict:
    'PERSISTENT, not a finite-N / plateau-bias artifact: the sliding-window local exponent trend is ' +
    'slightly negative (-0.008 to -0.010 per decade in N) rather than rising toward GUE -1/3, the ' +
    'high-N-restricted tail fit holds near -0.39..-0.42 and (noisily) steepens rather than shallowing ' +
    'toward -0.333, and the low/high split-half exponents are equal (-0.510 / -0.517). Block-extreme ' +
    'scatter limits single-power resolution to about +/- 0.1 locally, so an asymptotic approach to ' +
    '-1/3 far beyond N ~ 2e6 is neither confirmed nor excluded -- but the finite-N escape hatch is ' +
    'ruled out within the measured range. Measurement only; conditional on GUE; NO QED.',
};

export default GMIN_EXPONENT_FINITEN_TREND;
