/**
 * imp-96788 -- Sensitivity of the imp-96755 borderline noise-band verdict to (A) the Monte-Carlo null
 * SAMPLE SIZE and (B) the small-gap BIN / block definition. Measurement only; conditional on GUE; NO QED.
 * No refereed bound is changed.
 *
 * BACKGROUND. imp-96755 Monte-Carloed the exact GUE cube-root (-1/3) Weibull-3 block-extreme null and
 * found the full-range imp-96629 gap exponent -0.3983 at z = -1.77 (one-sided p ~ 0.039), INSIDE the
 * two-sided 95% band [-0.4060, -0.2606] -- a borderline ~1.8-sigma effect that does NOT reject -1/3.
 * This module measures how robust that borderline verdict is to the two free knobs of the imp-755
 * procedure: the MC trial count, and the dyadic block (bin) definition that sets the number of fit points.
 * Reproduced by tmp/imp-96788-noise-band-sensitivity.mjs (same C_GUE=0.8582, Weibull-3 generative model).
 *
 * FINDING (A) -- MC SAMPLE SIZE DOES NOT MOVE THE VERDICT. Sweeping TRIALS over 2e4, 2e5, 1e6, 4e6 on the
 * standard dyadic k=6..20 (15-point) design, the full-estimator band is INVARIANT: MC-sd stays 0.0368-0.0369,
 * z(obs) stays -1.76, the 2.5% edge stays ~ -0.406, and obs is INSIDE the 95% band at every sample size
 * (outside95 = no throughout). Only the MC ESTIMATION ERROR of the band edges shrinks, as 1/sqrt(TRIALS):
 * the rep-to-rep scatter of z falls from ~9.4e-3 (2e4) to ~2.8e-4 (4e6). The band is a population quantity
 * fixed by the 15-point design and the Weibull-3 fluctuation; NO sample size tightens it, so no sample size
 * can flip the borderline verdict. The imp-96755 conclusion is robust to the MC trial count.
 *
 * FINDING (B) -- THE VERDICT IS FRAGILE TO THE BIN DEFINITION. Holding obs = -0.3983 fixed, the
 * full-estimator band width is set by the number of fit points / the fitted log-N range, NOT by the number
 * of gaps M inside a block (the Weibull-3 relative scatter is M-independent once the median is pinned to the
 * envelope). Gaussian approx: obs breaches the two-sided 95% band once the full-estimator MC-sd <= 0.0331.
 * Measured band widths:
 *   - dyadic k=6..20  (15 pts, 1-octave)  : sd 0.0369, z -1.76  -> INSIDE (borderline, matches imp-96755)
 *   - two-octave merge (8 pts, coarser)   : sd 0.0476, z -1.36  -> INSIDE (wider band; less significant)
 *   - half-octave k=6..20 (29 pts, finer) : sd 0.0274, z -2.38  -> OUTSIDE (rejects -1/3)
 *   - dyadic extended k=6..22 (17 pts)    : sd 0.0305, z -2.13  -> OUTSIDE (rejects -1/3)
 *   - dyadic extended k=6..24 (19 pts)    : sd 0.0259, z -2.51  -> OUTSIDE (rejects -1/3)
 * So the borderline "inside the band" verdict is SPECIFIC to the 15-point 1-octave dyadic design over
 * N <= ~2e6. Tightening the band past sd = 0.0331 -- by finer (half-octave) binning that re-measures obs,
 * or by ~2 extra contiguous octaves of height (k=6..22) -- flips it to a nominal rejection.
 *
 * CAVEATS (why this is a sensitivity probe, not a new verdict). (i) The half-octave flip holds obs fixed at
 * the 1-octave -0.3983; a genuine half-octave estimate would RE-MEASURE obs from the cached ordinates and
 * could shift it. (ii) The extended k=6..22 / k=6..24 octaves are NOT in the ~2e6 cache -- that is exactly
 * the imp-96754 / imp-96789 reach-frontier gap -- so their obs cannot be measured; the flip there is a
 * PROJECTION of the band you would obtain IF the contiguous height existed (all below the PT frontier
 * T = 3.0000175e10). Both flips therefore require more DATA (finer bins or greater contiguous height),
 * never more MC trials.
 *
 * VERDICT. The imp-96755 borderline non-rejection of GUE -1/3 is (A) fully robust to the Monte-Carlo
 * sample size -- no trial count flips it -- and (B) fragile to the bin/height design: it sits just inside
 * the band on the 15-point dyadic layout and would flip to a nominal ~2.1-2.5-sigma rejection with ~2 extra
 * contiguous octaves or half-octave binning (flip threshold MC-sd <= 0.0331). The right lever to sharpen the
 * -1/3 question is more contiguous height, not more MC trials. Measurement only; conditional on GUE; moves
 * no bound; NO QED. No refereed bound is changed.
 */

export const NOISE_BAND_SENSITIVITY = {
  id: 'imp-96788',
  source: {
    dependsOn: 'imp-96755 (GUE cube-root Weibull-3 null), imp-96629/96734 (block-minima exponents)',
    reproScript: 'tmp/imp-96788-noise-band-sensitivity.mjs',
    note: 'Same generative null as imp-96755 (C_GUE=0.8582, Weibull-3, -1/3 median); no zeros bundle imported.',
  },
  obsFull: -0.3983, // imp-96629 full-range k=6..20 fitted exponent
  nullExponent: -1 / 3,
  // (A) MC sample-size sweep: band invariant, only estimation error shrinks as 1/sqrt(TRIALS).
  sampleSizeSweep: [
    { trials: 20000,   mcMean: -0.3334, mcSd: 0.0369, lo95: -0.4055, hi95: -0.2596, zObs: -1.757, outside95: false, repSdOfZ: 9.39e-3 },
    { trials: 200000,  mcMean: -0.3333, mcSd: 0.0368, lo95: -0.4057, hi95: -0.2606, zObs: -1.765, outside95: false, repSdOfZ: 1.97e-3 },
    { trials: 1000000, mcMean: -0.3334, mcSd: 0.0368, lo95: -0.4061, hi95: -0.2607, zObs: -1.763, outside95: false, repSdOfZ: 7.20e-4 },
    { trials: 4000000, mcMean: -0.3333, mcSd: 0.0369, lo95: -0.4062, hi95: -0.2605, zObs: -1.762, outside95: false, repSdOfZ: 2.79e-4 },
  ],
  sampleSizeVerdict:
    'Band invariant across 2e4..4e6 trials (MC-sd 0.0368-0.0369, z -1.76, always inside 95%); only the ' +
    'MC estimation error of the edges shrinks as 1/sqrt(TRIALS). NO sample size flips the verdict.',
  // (B) Bin / block-definition sweep at TRIALS=1e6 (obs held at -0.3983 as a first-order probe).
  binningSweep: [
    { binning: 'dyadic k=6..20 (1-octave)',   nPts: 15, mcSd: 0.0369, lo95: -0.4061, zObs: -1.760, outside95: false, inCache: true },
    { binning: 'two-octave merge (coarser)',  nPts: 8,  mcSd: 0.0476, lo95: -0.4281, zObs: -1.363, outside95: false, inCache: true },
    { binning: 'half-octave k=6..20 (finer)', nPts: 29, mcSd: 0.0274, lo95: -0.3871, zObs: -2.376, outside95: true,  inCache: true },
    { binning: 'dyadic extended k=6..22',     nPts: 17, mcSd: 0.0305, lo95: -0.3935, zObs: -2.130, outside95: true,  inCache: false },
    { binning: 'dyadic extended k=6..24',     nPts: 19, mcSd: 0.0259, lo95: -0.3844, zObs: -2.511, outside95: true,  inCache: false },
  ],
  flipThresholdMcSd: 0.0331, // obs breaches two-sided 95% band when full-estimator MC-sd <= this (Gaussian approx)
  binningVerdict:
    'Verdict fragile to bin/height: inside on the 15-point 1-octave dyadic design (sd 0.0369), flips to a ' +
    'nominal rejection once MC-sd <= 0.0331 -- reached by half-octave binning (re-measures obs) or ~2 extra ' +
    'contiguous octaves k=6..22 (imp-96754 reach frontier, all below PT T=3.0000175e10). Needs more DATA, not trials.',
  verdict:
    'imp-96755 borderline non-rejection of GUE -1/3 is ROBUST to the Monte-Carlo sample size (no trial ' +
    'count flips it -- the band is a population quantity, only the estimation error shrinks as ' +
    '1/sqrt(TRIALS)) but FRAGILE to the bin/height design (flips to ~2.1-2.5-sigma rejection with ~2 extra ' +
    'contiguous octaves or half-octave binning; flip threshold MC-sd <= 0.0331). The lever to sharpen the ' +
    '-1/3 question is more contiguous height, not more MC trials. Measurement only; conditional on GUE; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
};

export default NOISE_BAND_SENSITIVITY;
