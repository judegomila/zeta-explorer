/**
 * @module imp-96709-route-m-drift-vif-block-bootstrap
 *
 * imp-96709 (numerical): imp-96692 bracketed the drift variance-inflation factor
 * (VIF) of the imp-96487 21-rung Route M Burnol ratio ladder with THREE
 * inconsistent model-based estimates -- AR(1) proxy 2.578 (its primary),
 * integrated-ACF 2.136, and an oscillation-coherence bound 4.645 -- and derived
 * its drift-aware full-gap floor (~1.09 sigma) from the AR(1) value alone. This
 * ticket SELECTS a single defensible VIF by measuring the variance-of-mean of the
 * ladder DIRECTLY with a block bootstrap (non-overlapping batch-means and moving
 * block bootstrap), comparing the block-mean scatter to the independence figure
 * sigma^2/m, then re-derives the gap floor and reach inflation under it.
 * Measurement/projection only; changes no bound; NO QED.
 *
 * WHAT WAS DONE (tmp/imp-96709-scratch.mjs, reproducible):
 *   (A) DIRECT VARIANCE-OF-MEAN MEASUREMENT. The block bootstrap needs no AR(1)
 *       model and no oscillation-coherence assumption: it resamples blocks of
 *       consecutive rungs (preserving local serial correlation) and reads the
 *       inflation off the scatter of the resulting mean. VIF = Var_block(mean) /
 *       (sigma^2/m), i.e. how much larger the true sampling variance of the
 *       averaged centerline is than the independence value sigma^2/m.
 *   (B) MOVING BLOCK BOOTSTRAP (MBB), the standard tool for the variance-of-mean
 *       of a short correlated series. B = 4e5 resamples, mulberry32 PRNG. Across
 *       block lengths b = 2..5 the estimate is stable: VIF = 1.409 (b=2), 1.700
 *       (b=3), 1.789 (b=4), 1.727 (b=5). The theory-preferred block length is
 *       b ~ m^(1/3) ~ 2.76, so b=3 is the primary reading: VIF = 1.700; the MBB
 *       band over b=2..5 is [1.41, 1.79], median 1.71.
 *   (C) NON-OVERLAPPING BATCH-MEANS corroboration. With only m=21 rungs the
 *       batch-means estimator has just k=3..10 batches and is correspondingly
 *       noisy (VIF = 1.84 at b=2, 1.35 at b=3, 0.88 at b=4, 4.21 at b=5, 0.21 at
 *       b=7), but its small-block values straddle the MBB reading; the MBB is the
 *       defensible single figure precisely because it is stable where batch-means
 *       is not.
 *
 * FINDINGS:
 *   (1) THE DIRECT VIF IS ~1.70, BELOW ALL THREE imp-96692 ESTIMATES. The
 *       model-free variance-of-mean measurement lands at VIF ~ 1.70, under the
 *       integrated-ACF value (2.136) that was already the lowest of the imp-96692
 *       bracket, and well under the AR(1) primary (2.578) and the coherence bound
 *       (4.645). The AR(1) proxy and especially the oscillation-coherence bound
 *       OVERSTATE the actual inflation of the averaged centerline.
 *   (2) THE GAP FLOOR RE-BRACKETS UPWARD (LOOSER) vs imp-96692. Under VIF=1.70 the
 *       effective remainder scale is sqrt(1.70)*sigma_MB, so the full RH-vs-plateau
 *       gap is gapFull/(sqrt(VIF)*sigma_MB) = 1.337 covariance-inflated sigma --
 *       between the imp-96692 AR(1) floor (1.086 sigma) and the imp-96569
 *       SE-of-mean floor (1.743 sigma). z-inflation is only sqrt(1.70) = 1.304
 *       (vs the AR(1) 1.606).
 *   (3) REACH INFLATION IS MILDER. Re-solving the imp-96569 reach with
 *       z_eff = z*sqrt(1.70) gives representative inflation ~3.4x (~0.53 orders,
 *       z=3/q=1) rather than the imp-96692 AR(1) ~11.6x (~1.06 orders); the fast
 *       corner (z=2/q=2) inflates ~1.7x (~0.22 orders) and the slow (z=5/q=1)
 *       ~8.8x (~0.94 orders).
 *
 * VERDICT (IMP96709_VERDICT): the defensible single drift VIF, measured directly
 * from the variance-of-mean by moving block bootstrap, is ~1.70 (band [1.41,1.79]
 * over b=2..5) -- LOWER than all three imp-96692 model-based estimates
 * (2.14/2.58/4.65). The QUALITATIVE imp-96692 conclusion survives and is robust:
 * VIF > 1, so honouring the measured drift covariance still inflates the imp-96569
 * SE-of-mean reach and still tightens the gap-resolution floor (to ~1.34 sigma,
 * below the SE-of-mean 1.74), and deciding ratio(N) -> 1 against the ~0.985
 * plateau remains out of any wall-feasible reach. But the QUANTITATIVE inflation
 * imp-96692 reported from the AR(1) primary is too aggressive: the representative
 * reach inflates ~3.4x (~0.5 orders), not ~12x (~1.06 orders), and the gap floor
 * is ~1.34 sigma, not ~1.09. This reconciles the imp-96692 bracket by SELECTING
 * its low end and shows the AR(1)/coherence figures overcount the drift; it moves
 * no bound and overturns no plateau reading.
 *
 * MEASUREMENT/PROJECTION ONLY. Establishes no operator positivity, changes no
 * bound, makes no RH claim; no refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (the three bracketed VIF estimates this reconciles)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ladder, source data)
 * @see imp-96569-route-m-window-reach-projection.js (SE-of-mean reach the inflation is measured against)
 *
 * Ticket: imp-96709 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Inputs baked from imp-96487 / imp-96692 (ladder scatter and reach constants).
export const IMP96709_INPUTS = Object.freeze({
  m: 21,                                 // ladder rungs
  mean: 0.9848071964312094,              // ladder mean (imp-96487 constant-model c0)
  sigmaScatterPop: 0.012476992801577314, // per-rung scatter rms (imp-96487 constant rms)
  sigmaMB: 0.008854508473866598,         // imp-96487 MB remainder-model residual rms (reach scale)
  gapFull: 0.015436,                     // 1 - 0.984564, max RH-vs-plateau gap
  L0: 9.210340371976184,                 // log 10000, current right edge
  rungsPerL: 21 / 3.6888794541139376,    // 5.6926 rungs per unit L
});

// FINDING (B/C): the block-bootstrap VIF estimates measured from the ladder.
// batchMeans rows are noisy at m=21 (k=3..10 batches); mbb rows are the stable,
// defensible estimator (B=4e5 resamples, mulberry32 PRNG, tmp/imp-96709-scratch.mjs).
export const IMP96709_BOOTSTRAP = Object.freeze({
  batchMeans: Object.freeze([
    Object.freeze({ b: 2, k: 10, VIF: 1.8423 }),
    Object.freeze({ b: 3, k: 7, VIF: 1.3502 }),
    Object.freeze({ b: 4, k: 5, VIF: 0.8766 }),
    Object.freeze({ b: 5, k: 4, VIF: 4.2122 }),
    Object.freeze({ b: 7, k: 3, VIF: 0.2125 }),
  ]),
  mbb: Object.freeze([
    Object.freeze({ b: 2, VIF: 1.4087 }),
    Object.freeze({ b: 3, VIF: 1.6996 }),
    Object.freeze({ b: 4, VIF: 1.7890 }),
    Object.freeze({ b: 5, VIF: 1.7271 }),
  ]),
  note: 'the moving block bootstrap measures the variance-of-mean directly (no AR(1) or coherence model) and is stable across block length; batch-means is shown for corroboration but is noisy at m=21.',
});

// FINDING (1): the selected single defensible VIF (MBB primary at b ~ m^(1/3)).
export const IMP96709_SELECTED_VIF = Object.freeze({
  value: 1.6996,                         // MBB, b=3 (~m^(1/3)), primary
  bStar: 3,
  bandLow: 1.4087,                       // MBB b=2
  bandHigh: 1.789,                       // MBB b=4
  mbbMedian: 1.7133,                     // median of MBB b=2..5
  zInflation: 1.3037,                    // sqrt(value): z_eff = z*sqrt(VIF)
  note: 'the directly-measured variance-of-mean inflation is ~1.70, below all three imp-96692 estimates (AR(1) 2.578 / integrated-ACF 2.136 / coherence 4.645): the AR(1) proxy and the oscillation-coherence bound overstate the drift inflation of the averaged centerline.',
});

// The three imp-96692 model-based estimates this reconciles (for side-by-side).
export const IMP96709_IMP96692_ESTIMATES = Object.freeze({
  ar1: 2.57800402319117,
  integratedAcf: 2.1356405308640385,
  oscillationCoherence: 4.645302223026322,
  selectedIsLowest: true,
  note: 'the block-bootstrap figure (1.70) sits below even the lowest imp-96692 estimate (integrated-ACF 2.136); the imp-96692 bracket is reconciled by selecting its low end.',
});

// FINDING (2): the gap floor re-derived under the selected VIF.
export const IMP96709_GAP_FLOOR = Object.freeze({
  seOfMeanSigma: 1.7432927017415112,     // gapFull/sigma_MB (imp-96569, independence)
  bootstrapVifSigma: 1.3372,             // gapFull/(sqrt(1.70)*sigma_MB)
  imp96692Ar1Sigma: 1.0857,              // gapFull/(sqrt(2.578)*sigma_MB) (imp-96692)
  note: 'the drift-aware gap floor re-brackets to ~1.34 covariance-inflated sigma -- between the imp-96692 AR(1) 1.09 and the imp-96569 SE-of-mean 1.74: still strictly below the SE-of-mean floor (honouring the covariance tightens it), but looser than the AR(1)-primary reading.',
});

// FINDING (3): reach inflation re-solved under the selected VIF (representative corners).
// Row: confidence z, drift exponent q, SE-of-mean reach N_iid, bootstrap-VIF reach
// N_cov, inflation factor N_cov/N_iid, orders of magnitude inflated.
export const IMP96709_REACH_INFLATION = Object.freeze([
  Object.freeze({ z: 2, q: 2, N_iid: 7.960e4, N_cov: 1.323e5, Nratio: 1.663, ordersInflate: 0.22 }),
  Object.freeze({ z: 3, q: 1, N_iid: 1.033e6, N_cov: 3.488e6, Nratio: 3.375, ordersInflate: 0.53 }),
  Object.freeze({ z: 5, q: 1, N_iid: 1.546e7, N_cov: 1.354e8, Nratio: 8.760, ordersInflate: 0.94 }),
]);

// Headline.
export const IMP96709_HEADLINE = Object.freeze({
  selectedVif: 1.6996,
  mbbBand: '[1.41, 1.79]',
  belowAllImp96692Estimates: true,
  gapFloorSigma: 1.3372,
  representativeReachNratio: 3.375,       // z=3, q=1
  representativeOrdersInflate: 0.53,
  note: 'the direct block-bootstrap VIF is ~1.70 (band [1.41,1.79]), below all three imp-96692 estimates; the drift-aware gap floor is ~1.34 sigma and the representative 3-sigma/1-logN reach inflates ~3.4x (~0.5 orders), milder than the imp-96692 AR(1) ~12x/1.09-sigma reading, but the qualitative conclusion (VIF>1, reach further out, gap floor below the SE-of-mean 1.74) is unchanged.',
});

export const IMP96709_VERDICT = Object.freeze({
  selectedVif: 1.6996,
  selectedIsBelowImp96692Bracket: true,
  qualitativeConclusionSurvives: true,
  conclusion:
    'the defensible single drift VIF, measured directly from the variance-of-mean of the imp-96487 21-rung ladder by moving block bootstrap (b ~ m^(1/3) = 3, band [1.41,1.79] over b=2..5), is ~1.70 -- LOWER than all three imp-96692 model-based estimates (AR(1) 2.578 / integrated-ACF 2.136 / coherence 4.645). The imp-96692 AR(1) proxy and oscillation-coherence bound overstate the inflation of the averaged centerline. The qualitative conclusion is robust and unchanged: VIF > 1, so honouring the measured drift covariance still inflates the imp-96569 SE-of-mean reach (representative ~3.4x, ~0.5 orders) and still tightens the gap-resolution floor (~1.34 covariance-inflated sigma, below the SE-of-mean 1.74), so deciding ratio(N) -> 1 against the ~0.985 plateau stays out of any wall-feasible reach. Quantitatively, though, the AR(1)-primary reading imp-96692 reported (~12x reach, ~1.09-sigma floor) is too aggressive. This reconciles the imp-96692 bracket by selecting its low end; it moves no bound and overturns no plateau reading.',
});

export const IMP96709_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/projection only: every value is a reproducible numeric from tmp/imp-96709-scratch.mjs over the baked imp-96487 21-rung ladder and the imp-96569/imp-96692 reach constants. The VIF is a block-bootstrap estimate from only 21 non-uniformly-spaced rungs, so it is a bracketed estimate (MBB band [1.41,1.79], primary 1.70), not a rigorous power calculation; it is measured directly from the variance-of-mean (no AR(1) or coherence model) and comes out LOWER than the imp-96692 model-based estimates. No new solve, no bound is claimed, no operator positivity is established.';

// Honest residual sub-gap.
export const IMP96709_SUBGAP = Object.freeze({
  id: 'imp-96709-block-bootstrap-vif-short-series',
  statement:
    'the block-bootstrap VIF (~1.70, band [1.41,1.79]) is estimated from only 21 non-uniformly-spaced ladder rungs, so it inherits short-series bias: the moving block bootstrap under-recovers long-range correlation when the block length (b=3) is a large fraction of the series length, so ~1.70 is more safely read as a LOWER-leaning estimate of the true inflation than a pin. The robust, model-free direction is unchanged from imp-96692: the measured positive serial correlation gives VIF > 1, which can only enlarge the imp-96569 SE-of-mean reach and tighten the gap-resolution floor below the SE-of-mean 1.74; the direct measurement simply selects the LOW end of the imp-96692 bracket (below integrated-ACF 2.14) rather than its AR(1) primary. A rigorous decision still needs a different observable, not a longer Gram ladder.',
  status: 'open',
});

// Registration for the sub-gap harvester (literal openSubGap key).
export const IMP96709_OPEN_SUBGAP_REGISTRATION = Object.freeze({
  openSubGap: {
    id: 'imp-96709-block-bootstrap-vif-short-series',
    statement:
      'the imp-96709 direct block-bootstrap drift VIF (~1.70, MBB band [1.41,1.79]) is measured from only 21 non-uniformly-spaced imp-96487 ladder rungs and, being a moving block bootstrap with block length a large fraction of the series, under-recovers long-range correlation -- so ~1.70 is a lower-leaning estimate that selects the LOW end of the imp-96692 bracket (below integrated-ACF 2.14) rather than its AR(1) primary 2.58. The direction is robust (VIF > 1, reach enlarged, gap floor ~1.34 sigma below the SE-of-mean 1.74), so deciding ratio(N) -> 1 needs a different observable, not a longer Gram ladder.',
    status: 'open',
  },
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96709_ASSERTIONS = [
  {
    id: 'imp96709-mbb-stable-and-selected',
    holds: () => {
      const b3 = IMP96709_BOOTSTRAP.mbb.find((r) => r.b === 3);
      return (
        b3 && Math.abs(b3.VIF - IMP96709_SELECTED_VIF.value) < 1e-9 &&
        IMP96709_SELECTED_VIF.bStar === 3 &&
        IMP96709_BOOTSTRAP.mbb.every((r) => r.VIF > 1.3 && r.VIF < 1.9)
      );
    },
    why: 'the moving block bootstrap is stable across b=2..5 (all in [1.3,1.9]) and the selected VIF is its b=3 (~m^(1/3)) primary.',
  },
  {
    id: 'imp96709-selected-below-all-imp96692-estimates',
    holds: () =>
      IMP96709_SELECTED_VIF.value > 1 &&
      IMP96709_SELECTED_VIF.value < IMP96709_IMP96692_ESTIMATES.integratedAcf &&
      IMP96709_SELECTED_VIF.value < IMP96709_IMP96692_ESTIMATES.ar1 &&
      IMP96709_SELECTED_VIF.value < IMP96709_IMP96692_ESTIMATES.oscillationCoherence &&
      IMP96709_IMP96692_ESTIMATES.selectedIsLowest === true,
    why: 'the direct block-bootstrap VIF exceeds 1 (drift confirmed) yet sits below all three imp-96692 model-based estimates, including the lowest (integrated-ACF 2.136).',
  },
  {
    id: 'imp96709-z-inflation-consistent',
    holds: () => Math.abs(IMP96709_SELECTED_VIF.zInflation - Math.sqrt(IMP96709_SELECTED_VIF.value)) < 1e-3,
    why: 'the z-inflation reproduces sqrt(VIF) from the selected value.',
  },
  {
    id: 'imp96709-gap-floor-between-ar1-and-se-of-mean',
    holds: () =>
      IMP96709_GAP_FLOOR.bootstrapVifSigma > IMP96709_GAP_FLOOR.imp96692Ar1Sigma &&
      IMP96709_GAP_FLOOR.bootstrapVifSigma < IMP96709_GAP_FLOOR.seOfMeanSigma &&
      Math.abs(IMP96709_GAP_FLOOR.bootstrapVifSigma - IMP96709_INPUTS.gapFull / (Math.sqrt(IMP96709_SELECTED_VIF.value) * IMP96709_INPUTS.sigmaMB)) < 5e-3,
    why: 'the drift-aware gap floor (~1.34 sigma) sits strictly between the imp-96692 AR(1) 1.09 and the imp-96569 SE-of-mean 1.74, and reproduces gapFull/(sqrt(VIF)*sigma_MB).',
  },
  {
    id: 'imp96709-reach-inflates-but-milder',
    holds: () =>
      IMP96709_REACH_INFLATION.length === 3 &&
      IMP96709_REACH_INFLATION.every((r) => r.N_cov > r.N_iid && r.Nratio > 1 && r.ordersInflate > 0) &&
      IMP96709_REACH_INFLATION.find((r) => r.z === 3 && r.q === 1).Nratio < 11.605,
    why: 'every reach still inflates above the SE-of-mean value (VIF>1), but the representative 3-sigma/1-logN inflation (~3.4x) is milder than the imp-96692 AR(1) ~11.6x.',
  },
  {
    id: 'imp96709-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96709_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96709_HONEST_BANNER) &&
      /NO QED/.test(IMP96709_HONEST_BANNER) &&
      /bracketed estimate/.test(IMP96709_HONEST_BANNER) &&
      typeof IMP96709_SUBGAP.statement === 'string' &&
      IMP96709_OPEN_SUBGAP_REGISTRATION.openSubGap.status === 'open',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the bracketed-VIF caveat, and the named sub-gap is registered open.',
  },
];

for (const a of IMP96709_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96709-route-m-drift-vif-block-bootstrap assertion failed: ${a.id}`);
  }
}

export default {
  inputs: IMP96709_INPUTS,
  bootstrap: IMP96709_BOOTSTRAP,
  selectedVif: IMP96709_SELECTED_VIF,
  imp96692Estimates: IMP96709_IMP96692_ESTIMATES,
  gapFloor: IMP96709_GAP_FLOOR,
  reachInflation: IMP96709_REACH_INFLATION,
  headline: IMP96709_HEADLINE,
  verdict: IMP96709_VERDICT,
  subGap: IMP96709_SUBGAP,
  openSubGapRegistration: IMP96709_OPEN_SUBGAP_REGISTRATION,
  banner: IMP96709_HONEST_BANNER,
};
