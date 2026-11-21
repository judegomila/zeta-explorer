/**
 * imp-96755 -- Bootstrap / Monte-Carlo sampling-variance band on the imp-96734 / imp-96629 small-gap
 * exponent fits: separate a genuine steepening from block-extreme sampling noise. Measurement only;
 * conditional on GUE; NO QED. No refereed bound is changed.
 *
 * BACKGROUND. imp-96629 fit the plateau-free per-window (disjoint dyadic block-minima) normalized-gap
 * exponent at b = -0.3983 (full k=6..20) / -0.3818 (matched k=6..19), and imp-96734 refit it in
 * sliding, high-N-restricted, and split-half windows, finding single powers running to -0.51..-0.65 on
 * the last few blocks. imp-96734's honest LIMITATION: block-extreme scatter is large (per-window rms up
 * to ~0.37), so those -0.51/-0.65 excursions are "dominated by this scatter, not a genuine steepening
 * law", and over N <= ~2e6 a single power resolves the local exponent only to about +/- 0.1. This module
 * QUANTIFIES that noise floor rigorously and asks which measured deviations from GUE -1/3 actually exceed
 * the sampling band.
 *
 * METHOD (Monte-Carlo of the block-extreme distribution under the GUE cube-root null -- no zeros bundle
 * imported, no new quadrature). Under the sine-kernel small-gap law P(gap < s) ~ c s^3 (beta=2 cubic
 * level repulsion), the minimum over M ~ 2^k gaps in a disjoint dyadic block [2^k, 2^{k+1}) is a
 * Weibull(shape 3): P(min > s) = exp(-M c s^3), so s_min = (W/(M c))^{1/3} with W ~ Exp(1). Fixing the
 * median to the measured GUE envelope C_GUE * N_center^{-1/3} (C_GUE = 0.8582, median of W = ln2) gives
 * the generative model
 *     s_min,k = C_GUE * N_center,k^{-1/3} * ( W_k / ln2 )^{1/3},   W_k ~ Exp(1) iid,  k = 6..20.
 * This has EXACTLY the -1/3 cube-root scaling and the correct block-extreme (Weibull-3) fluctuation, so
 * the sampling distribution of any fitted exponent under it is the pure noise band. 200,000 trials; each
 * trial redraws all 15 block minima and refits every imp-96734 estimator (full, matched, high-N-restricted
 * drop-small ladder, split-half, sliding-window trend). Reproduced by tmp/imp-96755-bootstrap-noise-band.mjs.
 *
 * FINDING (the noise floor swallows the whole steepening signal).
 *   - The null model is unbiased: the MC mean of every estimator sits at -1/3 (-0.3330..-0.3336),
 *     confirming the generative model reproduces the -1/3 law with no fit bias.
 *   - NONE of the observed exponents fall OUTSIDE their 95% sampling band. Every measured value -- the
 *     full-range -0.3983, the -0.51/-0.65 restricted / split-half excursions, and the near-zero
 *     sliding-window trend -- is inside the band the pure -1/3 process itself produces.
 *   - The full-range -0.3983 is the most significant single deviation: z = -1.77, one-sided p = 0.039
 *     (~96th percentile of steepness), but still inside the two-sided 95% band [-0.406, -0.261]. So even
 *     the tightest 15-point estimator does NOT reject GUE -1/3 at 95%; the deviation from -1/3 is
 *     borderline (~1.8 sigma), notable but not significant.
 *   - The -0.51/-0.65 high-N-restricted and split-half excursions have MUCH wider bands (MC sd 0.10..0.28
 *     as the point count drops to 8/6/4), and all sit at z = -1.15..-1.93, one-sided p = 0.028..0.112 --
 *     i.e. ordinary scatter of a -1/3 process, confirming imp-96734's LIMITATION quantitatively.
 *   - The sliding-window trend slopes (-0.008 W=5, -0.010 W=3) are indistinguishable from zero
 *     (z = -0.11/-0.13, one-sided p ~ 0.45): no detectable drift of the local exponent with N.
 *
 * VERDICT. Over N <= ~2e6 the block-extreme sampling noise floor is large enough that NO estimator
 * rejects GUE -1/3 at the 95% level. Contrary to the naive reading, the -0.3953..-0.42 full-range
 * deviation does NOT cleanly "exceed the noise band" either -- it is a marginal ~1.8-sigma effect
 * (one-sided p ~ 0.04); and the -0.51/-0.65 excursions are unambiguously pure scatter (well inside their
 * wide bands). This SHARPENS imp-96734: the persistent-vs-finite-N conclusion there is a statement about
 * the ABSENCE of an upward trend, not about a significant steepening -- the data are consistent with an
 * exact -1/3 cube-root law plus Weibull-3 block-extreme noise across the entire measured range. Moves no
 * bound; RELOCATES nothing. Measurement only; conditional on GUE; NO QED. No refereed bound is changed.
 */

export const GMIN_EXPONENT_NOISE_BAND = {
  id: 'imp-96755',
  source: {
    blockDataFrom: 'imp-96629 per-window disjoint dyadic block minima (k=6..20)',
    reproScript: 'tmp/imp-96755-bootstrap-noise-band.mjs',
    note: 'Monte-Carlo of the GUE cube-root null (Weibull-3 block extremes); no zeros bundle imported; no new quadrature.',
  },
  model: {
    description:
      's_min,k = C_GUE * N_center^{-1/3} * (W_k/ln2)^{1/3}, W_k ~ Exp(1) iid; Weibull(shape 3) block minima with exact -1/3 median scaling',
    C_GUE: 0.8582, // median g_min/y_N = C_GUE N^{-1/3}
    weibullShape: 3, // beta=2 sine-kernel cubic level repulsion
    nullExponent: -1 / 3,
    trials: 200000,
  },
  // Each row: fitted estimator under the -1/3 null. obs = measured (imp-96629/imp-96734); mcMean/mcSd =
  // sampling distribution of that estimator when the truth is EXACTLY -1/3; band95 = [2.5%, 97.5%];
  // z = (obs - mcMean)/mcSd; p1Steeper = fraction of null draws at least as steep as obs; outside95 flag.
  bands: [
    { estimator: 'full',           nPts: 15, obs: -0.3983, mcMean: -0.3333, mcSd: 0.0368, band95: [-0.4060, -0.2606], z: -1.77, p1Steeper: 0.0392, outside95: false },
    { estimator: 'matched',        nPts: 14, obs: -0.3818, mcMean: -0.3333, mcSd: 0.0408, band95: [-0.4137, -0.2526], z: -1.19, p1Steeper: 0.1138, outside95: false },
    { estimator: 'restrict_k>=8',  nPts: 13, obs: -0.3923, mcMean: -0.3334, mcSd: 0.0456, band95: [-0.4235, -0.2433], z: -1.29, p1Steeper: 0.0949, outside95: false },
    { estimator: 'restrict_k>=11', nPts: 10, obs: -0.4158, mcMean: -0.3334, mcSd: 0.0680, band95: [-0.4682, -0.1988], z: -1.21, p1Steeper: 0.1076, outside95: false },
    { estimator: 'restrict_k>=13', nPts: 8,  obs: -0.5169, mcMean: -0.3332, mcSd: 0.0951, band95: [-0.5226, -0.1442], z: -1.93, p1Steeper: 0.0282, outside95: false },
    { estimator: 'restrict_k>=15', nPts: 6,  obs: -0.5278, mcMean: -0.3330, mcSd: 0.1477, band95: [-0.6278, -0.0383], z: -1.32, p1Steeper: 0.0868, outside95: false },
    { estimator: 'restrict_k>=17', nPts: 4,  obs: -0.6510, mcMean: -0.3330, mcSd: 0.2758, band95: [-0.8857, 0.2206], z: -1.15, p1Steeper: 0.1122, outside95: false },
    { estimator: 'lowHalf',        nPts: 7,  obs: -0.5103, mcMean: -0.3327, mcSd: 0.1165, band95: [-0.5645, -0.1009], z: -1.52, p1Steeper: 0.0608, outside95: false },
    { estimator: 'highHalf',       nPts: 8,  obs: -0.5169, mcMean: -0.3332, mcSd: 0.0951, band95: [-0.5226, -0.1442], z: -1.93, p1Steeper: 0.0282, outside95: false },
    { estimator: 'slidingTrendW5', nPts: 11, obs: -0.0079, mcMean: -0.0001, mcSd: 0.0709, band95: [-0.1409, 0.1383], z: -0.11, p1Steeper: 0.4522, outside95: false },
    { estimator: 'slidingTrendW3', nPts: 13, obs: -0.0095, mcMean: -0.0001, mcSd: 0.0725, band95: [-0.1532, 0.1322], z: -0.13, p1Steeper: 0.4275, outside95: false },
  ],
  mostSignificant: {
    estimator: 'full',
    obs: -0.3983,
    z: -1.77,
    oneSidedP: 0.039,
    verdict: 'borderline ~1.8-sigma; inside the 95% band; does NOT reject GUE -1/3',
  },
  anyOutside95: false,
  verdict:
    'Over N <= ~2e6 the block-extreme (Weibull-3) sampling noise floor swallows the entire steepening ' +
    'signal: no estimator lands outside its 95% band under the exact -1/3 null. The full-range -0.3983 ' +
    'deviation from GUE -1/3 is a marginal ~1.8-sigma effect (one-sided p ~ 0.04), not a clean band ' +
    'breach; the -0.51/-0.65 high-N-restricted and split-half excursions are ordinary scatter (z ~ ' +
    '-1.1..-1.9, wide bands), and the sliding-window trend is indistinguishable from zero. The data are ' +
    'consistent with an exact -1/3 cube-root law plus block-extreme noise across the whole measured ' +
    'range; imp-96734 persistence is an ABSENCE-of-trend statement, not a significant steepening. ' +
    'Measurement only; conditional on GUE; NO QED. No refereed bound is changed.',
};

export default GMIN_EXPONENT_NOISE_BAND;
