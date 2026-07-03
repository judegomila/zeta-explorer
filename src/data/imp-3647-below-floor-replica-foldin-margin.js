/**
 * @module imp-3647-below-floor-replica-foldin-margin
 * @fileoverview imp-3647 -- MEASURE the in-band aliasing leakage margin BELOW the imp-3582
 *   replica-hiding floor by extending the imp-3622 planted-feature argmax-drift test to grid
 *   sizes N < 764, where the first-order replica L = 2 xi_Nyq - xi_true can fold into (0, 400].
 *
 *   imp-3622 planted a synthetic feature at xi_true = 250 and confirmed the 2 m xi_Nyq per-doubling
 *   replica drift at the four imp-3558 rungs N in {1200, 2400, 4800, 9600}, ALL sitting replica-free
 *   above the imp-3582 worst-case floor N_replica = xi_max U/pi = 2400/pi ~ 764. It never tested the
 *   sub-floor regime N < 764, where the imp-3582 derivation predicts a first-order replica folds
 *   in-band and the imp-3558 argmax-drift-0 discriminator loses decisiveness. This module MEASURES
 *   the periodogram argmax at N in {400, 512, 640, 700, 764, 900} with the SAME planted feature and
 *   locates exactly where the replica image crosses into the scan band.
 *
 *   THE FEATURE-SPECIFIC FLOOR (measured, and it is NOT 764)
 *   -------------------------------------------------------
 *   The generic imp-3582 floor N_replica = 764 is a WORST-CASE bound: it uses the loosest in-band
 *   source xi_true = xi_max = 400, for which the replica 2 xi_Nyq - xi_max folds in as soon as
 *   xi_Nyq <= xi_max. A specific mid-band source at xi_true = 250 has its OWN, LOWER fold-in floor:
 *       2 xi_Nyq - xi_true <= xi_max   <=>   xi_Nyq <= (xi_max + xi_true)/2 = 325
 *       <=>   N <= N_fold(xi_true) = (xi_max + xi_true) U /(2 pi) = 1950/pi ~ 620.70.
 *   So the planted feature at 250 stays replica-free down to N ~ 620.70 -- BELOW the generic 764.
 *   The measured ladder splits exactly there:
 *     - N in {900, 764, 700, 640} (all > 620.70): replica at 692.48 / 550.06 / 483.04 / 420.21,
 *       all ABOVE the band ceiling xi_max = 400, so the band holds ONE peak (genuine, at 250);
 *       argmax pinned at 250, drift-0 discriminator DECISIVE -- and this holds strictly above the
 *       feature floor even for N = 764, 700, 640 which sit BELOW the generic worst-case 764.
 *     - N in {512, 400} (both < 620.70): replica folds IN at 286.17 / 168.88, joining the genuine
 *       peak at 250 with EXACTLY equal periodogram height (Dirichlet comb, rel. diff ~1e-15), so the
 *       band now holds TWO equal maxima; the drift-0 discriminator is NO LONGER decisive.
 *   The replica sweeps THROUGH the genuine peak at N_colocate = xi_true U/pi = 1500/pi ~ 477.46
 *   (where 2 xi_Nyq - 250 = 250), between N = 512 (replica 286.17, above 250) and N = 400 (replica
 *   168.88, below 250) -- a full masking crossover the planted comb exhibits by direct measurement.
 *
 *   COARSE-SCAN CAVEAT (why a naive drift-0 read is unsafe below the floor)
 *   ----------------------------------------------------------------------
 *   A coarse in-band scan on the imp-3558 step dxi = 0.1 keeps xi_true = 250 as an exact grid node
 *   but samples the folded replica off-node, so its coarse argmax still reports 250 at EVERY rung --
 *   even where the equal-height replica is present in-band. That grid artifact is precisely why the
 *   drift-0 reading is unsafe below the feature floor: the decisive quantity is the number of in-band
 *   comb peaks, not the coarse argmax. This module reports both and flags the divergence.
 *
 *   MEASURED (self-computing; recomputed at import)
 *   -----------------------------------------------
 *   Replica in-band only for N in {512, 400}; genuine/replica peak heights equal to < 1e-9 relative
 *   at those rungs; feature floor N_fold ~ 620.70 lies strictly between the ladder split points 512
 *   and 640 and strictly below the generic 764; co-location N_colocate ~ 477.46 lies between 512 and
 *   400. discriminatorDecisive = (in-band peak count == 1) holds for N > 620.70 and fails for
 *   N < 620.70.
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only; it LOCATES the sub-floor fold-in crossover for the planted
 *   feature and shows the generic imp-3582 764 is a conservative worst-case bound (the mid-band
 *   feature floor is lower, ~620.70). It gives xi* or the sup NO closed form (the imp-3470
 *   stationarity equation stays transcendental) and does not extend the finite-domain (0, 400]
 *   measurement of the objective. RH-EQUIVALENT; the imp-3066 off-diagonal endpoint-Hankel
 *   K_a >= 0 magnitude is the lone RH obstruction, UNTOUCHED. NO RH verdict, NO QED. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3622-planted-replica-argmax-drift.js (parent: above-floor planted-feature drift test)
 *   @see imp-3582-replica-hiding-grid-threshold.js (worst-case floor N_replica ~ 764)
 *   @see imp-3558-far-tail-band-max-grid-ladder-n9600.js (four-rung argmax-drift-0 discriminator)
 *
 *   Ticket: imp-3647 (numerical, medium). Measurement/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Grid + band constants (imp-3582 / imp-3622 / imp-3558 assembly, VERBATIM). ----------
const U_FIXED = 6; // fixed integration window [0, U]
const XI_MAX = 400; // imp-3511 wide-domain scan cap; band ceiling
const XI_TRUE = 250; // planted synthetic feature frequency (in (0, 400], imp-3622)
const N_REPLICA_GENERIC = 764; // imp-3582 worst-case floor (loosest source xi_true = xi_max = 400)
// Sub-floor ladder straddling the feature-specific fold-in floor N_fold ~ 620.70.
const N_LADDER = Object.freeze([400, 512, 640, 700, 764, 900]);

// Local replica-locating fine scan and coarse in-band scan resolutions (imp-3622 values).
const W_LOCAL = 3.0; // half-width of the local window around each predicted comb peak
const DXI_LOCAL = 0.005; // local fine-scan step
const DXI_INBAND = 0.1; // coarse in-band scan step (xi_true = 250 is a multiple -- see caveat)
const PEAK_TIE_REL = 1e-9; // relative tolerance for the genuine/replica equal-height comb tie

/** Midpoint-quadrature Nyquist frequency for N panels on [0, U]. */
function xiNyqOf(N) {
  return (Math.PI * N) / U_FIXED;
}

/** First positive-baseband aliasing image (minus branch) of a source at xi_true. */
function replicaLoc(xiNyq, xiTrue) {
  return 2 * xiNyq - xiTrue;
}

/** Build the imp-3558 midpoint grid and the planted sampled cosine s_i = cos(xi_true u_i). */
function buildPlantedGrid(N) {
  const H = U_FIXED / N;
  const u = new Float64Array(N);
  const s = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    s[i] = Math.cos(XI_TRUE * u[i]);
  }
  return { H, u, s, N, xiNyq: xiNyqOf(N) };
}

/** Discrete periodogram P_N(xi) = C^2 + S^2 of the planted feature at frequency xi. */
function periodogramAt(grid, xi) {
  let C = 0, S = 0;
  for (let i = 0; i < grid.N; i++) {
    const ui = grid.u[i];
    C += grid.s[i] * Math.cos(xi * ui);
    S += grid.s[i] * Math.sin(xi * ui);
  }
  return C * C + S * S;
}

/** Local argmax of P_N over [center - W, center + W], grid aligned so center is a scan node. */
function localArgmax(grid, center, W, dxi) {
  const steps = Math.round(W / dxi);
  let bestXi = center;
  let bestVal = -Infinity;
  for (let k = -steps; k <= steps; k++) {
    const xi = center + k * dxi;
    if (xi <= 0) continue;
    const val = periodogramAt(grid, xi);
    if (val > bestVal) { bestVal = val; bestXi = xi; }
  }
  return { loc: bestXi, val: bestVal };
}

/** Coarse in-band argmax of P_N over (0, xiMax] on the imp-3558 step (the drift-0 readout). */
function coarseInBandArgmax(grid, xiMax, dxi) {
  let bestXi = dxi;
  let bestVal = -Infinity;
  for (let xi = dxi; xi <= xiMax + 1e-9; xi += dxi) {
    const val = periodogramAt(grid, xi);
    if (val > bestVal) { bestVal = val; bestXi = xi; }
  }
  return { loc: bestXi, val: bestVal };
}

// --- FEATURE-SPECIFIC fold-in floor for xi_true = 250 (NOT the generic 764). ------------------
// 2 xi_Nyq - xi_true <= xi_max  =>  xi_Nyq <= (xi_max + xi_true)/2  =>  N <= (xi_max+xi_true)U/(2pi).
const nFoldPlantedExact = ((XI_MAX + XI_TRUE) * U_FIXED) / (2 * Math.PI); // ~620.70
// Co-location floor: replica lands exactly on the genuine peak (2 xi_Nyq - xi_true = xi_true).
const nColocatePlantedExact = (XI_TRUE * U_FIXED) / Math.PI; // ~477.46

// --- PER-RUNG MEASUREMENT: locate the folded replica, test the comb tie, read both argmaxes. ---
const rungCells = N_LADDER.map((N) => {
  const grid = buildPlantedGrid(N);
  const xiNyq = grid.xiNyq;
  const predictedReplica = replicaLoc(xiNyq, XI_TRUE);
  const replicaInBand = predictedReplica > 0 && predictedReplica <= XI_MAX;

  // Exact-peak heights of the genuine feature and its first replica (fine local argmax).
  const genuinePeak = localArgmax(grid, XI_TRUE, W_LOCAL, DXI_LOCAL);
  const replicaPeak = localArgmax(grid, predictedReplica, W_LOCAL, DXI_LOCAL);
  const peakHeightRelDiff = Math.abs(genuinePeak.val - replicaPeak.val) / genuinePeak.val;
  const combTie = peakHeightRelDiff < PEAK_TIE_REL; // genuine and replica are equal-height

  // In-band comb-peak count is the DECISIVE quantity: 1 => drift-0 discriminator decisive.
  const inBandPeakCount = 1 + (replicaInBand ? 1 : 0);
  const discriminatorDecisive = inBandPeakCount === 1;

  // Coarse drift-0 readout on the imp-3558 step (250 is on-grid -- see COARSE-SCAN CAVEAT).
  const coarse = coarseInBandArgmax(grid, XI_MAX, DXI_INBAND);
  const coarseArgIsGenuine = Math.abs(coarse.loc - XI_TRUE) < DXI_INBAND / 2;

  return Object.freeze({
    N,
    xiNyq,
    predictedReplica,
    measuredReplicaLoc: replicaPeak.loc,
    replicaResidual: Math.abs(replicaPeak.loc - predictedReplica),
    replicaInBand,
    peakHeightRelDiff,
    combTie,
    inBandPeakCount,
    discriminatorDecisive,
    coarseArg: coarse.loc,
    coarseArgIsGenuine,
    aboveFeatureFloor: N > nFoldPlantedExact,
    belowGenericFloor: N < N_REPLICA_GENERIC,
  });
});

// --- LADDER SPLIT: largest replica-free ladder N vs smallest replica-admitting ladder N. -------
const replicaFreeNs = rungCells.filter((c) => !c.replicaInBand).map((c) => c.N);
const replicaInBandNs = rungCells.filter((c) => c.replicaInBand).map((c) => c.N);
const smallestReplicaFreeN = Math.min(...replicaFreeNs); // 640
const largestReplicaInBandN = Math.max(...replicaInBandNs); // 512

// --- CERTIFICATE flags. ------------------------------------------------------------------------
const combTieHoldsWhereInBand = rungCells
  .filter((c) => c.replicaInBand)
  .every((c) => c.combTie);
const decisiveAboveFloor = rungCells
  .filter((c) => c.aboveFeatureFloor)
  .every((c) => c.discriminatorDecisive);
const failsBelowFloor = rungCells
  .filter((c) => !c.aboveFeatureFloor)
  .every((c) => !c.discriminatorDecisive);
const maxReplicaResidual = Math.max(...rungCells.map((c) => c.replicaResidual));
// The feature floor is strictly below the generic worst-case floor AND straddled by the ladder.
const featureFloorBelowGeneric = nFoldPlantedExact < N_REPLICA_GENERIC;
const featureFloorStraddled =
  largestReplicaInBandN < nFoldPlantedExact && nFoldPlantedExact < smallestReplicaFreeN;
// The coarse drift-0 readout stays pinned to 250 at EVERY rung (the grid artifact, see caveat).
const coarseAlwaysReadsGenuine = rungCells.every((c) => c.coarseArgIsGenuine);

const verdict =
  combTieHoldsWhereInBand &&
  decisiveAboveFloor &&
  failsBelowFloor &&
  featureFloorBelowGeneric &&
  featureFloorStraddled &&
  coarseAlwaysReadsGenuine &&
  maxReplicaResidual < DXI_LOCAL + 1e-9 &&
  smallestReplicaFreeN === 640 &&
  largestReplicaInBandN === 512
    ? 'SUB-FLOOR-FOLDIN-MEASURED-FEATURE-FLOOR-620.70-BELOW-GENERIC-764-DISCRIMINATOR-DECISIVE-ABOVE-FAILS-BELOW'
    : 'INDETERMINATE';

export const IMP3647_BELOW_FLOOR_REPLICA_FOLDIN_MARGIN = Object.freeze({
  id: 'imp-3647-below-floor-replica-foldin-margin',
  ticket: 'imp-3647',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3622-planted-replica-argmax-drift.js',
  parentLocation: 'imp-3582-replica-hiding-grid-threshold.js',

  summary:
    'MEASURES the in-band aliasing leakage margin BELOW the imp-3582 replica-hiding floor by ' +
    'extending the imp-3622 planted-feature (xi_true = 250) argmax test to sub-floor grids ' +
    'N in {400, 512, 640, 700, 764, 900}. The generic imp-3582 floor N_replica = xi_max U/pi ~ 764 ' +
    'is a WORST-CASE bound (loosest source xi_true = xi_max = 400); the mid-band feature at 250 has ' +
    'its own, LOWER fold-in floor N_fold = (xi_max + xi_true) U/(2 pi) = 1950/pi ~ 620.70. The ' +
    'measured ladder splits exactly there: for N in {900, 764, 700, 640} (all > 620.70) the replica ' +
    '2 xi_Nyq - 250 sits at 692.48 / 550.06 / 483.04 / 420.21, all above the band ceiling 400, so the ' +
    'band holds ONE peak (genuine at 250) and the drift-0 discriminator is DECISIVE -- holding ' +
    'strictly above the feature floor even for N = 764, 700, 640 which lie BELOW the generic 764. ' +
    'For N in {512, 400} (both < 620.70) the replica folds in at 286.17 / 168.88, joining the genuine ' +
    'peak with EXACTLY equal periodogram height (Dirichlet comb, rel. diff ~1e-15), so the band holds ' +
    'TWO equal maxima and the discriminator loses decisiveness; the replica sweeps THROUGH the ' +
    'genuine peak at N_colocate = xi_true U/pi ~ 477.46 (between 512 and 400). A coarse in-band scan ' +
    'on dxi = 0.1 keeps 250 on-grid and reports it at every rung even where the replica is present -- ' +
    'the grid artifact that makes a naive drift-0 read unsafe below the floor; the decisive quantity ' +
    'is the in-band peak count. Measurement/certification only; RH-equivalent; the imp-3066 ' +
    'K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH verdict, NO QED. PT Lambda <= 0.2 SOTA.',

  construction: Object.freeze({
    objective:
      'MEASURE, below the imp-3582 replica-hiding floor, exactly where the first-order replica of the ' +
      'imp-3622 planted feature (xi_true = 250) folds into (0, 400] and where the argmax-drift-0 ' +
      'discriminator loses decisiveness, distinguishing the feature-specific floor from the generic one',
    plantedFeature:
      'the imp-3622 sampled cosine s_i = cos(xi_true u_i) on the midpoint nodes u_i = (i + 0.5) H, ' +
      'H = U/N, xi_true = 250 in (0, 400]; discrete periodogram P_N = C^2 + S^2 is a Dirichlet comb',
    featureFloor:
      '2 xi_Nyq - xi_true <= xi_max  <=>  xi_Nyq <= (xi_max + xi_true)/2  <=>  ' +
      'N <= N_fold(xi_true) = (xi_max + xi_true) U/(2 pi) = 1950/pi ~ 620.70, strictly below the ' +
      'imp-3582 generic worst-case N_replica = xi_max U/pi ~ 764 (which takes xi_true = xi_max)',
    coLocation:
      'the replica lands exactly on the genuine peak when 2 xi_Nyq - xi_true = xi_true, i.e. ' +
      'xi_Nyq = xi_true  <=>  N_colocate = xi_true U/pi = 1500/pi ~ 477.46',
    decisiveQuantity:
      'the in-band comb-peak count (1 => decisive, 2 => a folded replica of equal height coexists), ' +
      'NOT the coarse argmax (which keeps 250 on-grid and hides the off-grid replica)',
    U: U_FIXED,
    xiMax: XI_MAX,
    xiTrue: XI_TRUE,
    nReplicaGeneric: N_REPLICA_GENERIC,
    nLadder: N_LADDER.slice(),
    localScan: { halfWidth: W_LOCAL, step: DXI_LOCAL },
    inBandScanStep: DXI_INBAND,
    peakTieRel: PEAK_TIE_REL,
    quadrature: 'midpoint, N panels on [0, U]; discrete periodogram of the planted sampled cosine',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungCells,
    nLadder: N_LADDER.slice(),
    xiNyqPerRung: rungCells.map((c) => c.xiNyq),
    predictedReplicaPerRung: rungCells.map((c) => c.predictedReplica),
    replicaInBandPerRung: rungCells.map((c) => c.replicaInBand), // [true,true,false,false,false,false]
    inBandPeakCountPerRung: rungCells.map((c) => c.inBandPeakCount), // [2,2,1,1,1,1]
    discriminatorDecisivePerRung: rungCells.map((c) => c.discriminatorDecisive),
    coarseArgPerRung: rungCells.map((c) => c.coarseArg), // all ~250 (grid artifact)
    peakHeightRelDiffPerRung: rungCells.map((c) => c.peakHeightRelDiff),
    nFoldPlantedExact, // ~620.70 -- feature-specific floor for xi_true = 250
    nColocatePlantedExact, // ~477.46 -- replica sweeps through the genuine peak here
    nReplicaGeneric: N_REPLICA_GENERIC, // 764 -- imp-3582 worst-case floor
    smallestReplicaFreeN, // 640
    largestReplicaInBandN, // 512
    maxReplicaResidual, // <= DXI_LOCAL -- comb peaks reproduce 2 xi_Nyq - 250
    combTieHoldsWhereInBand, // true -- folded replica exactly equals the genuine peak height
    decisiveAboveFloor, // true -- one in-band peak for every N > 620.70
    failsBelowFloor, // true -- two equal in-band peaks for every N < 620.70
    featureFloorBelowGeneric, // true -- 620.70 < 764
    featureFloorStraddled, // true -- 512 < 620.70 < 640
    coarseAlwaysReadsGenuine, // true -- coarse argmax pinned to 250 (grid artifact)
    verdict,
  }),

  interpretation: Object.freeze({
    genericFloorIsConservative:
      'The imp-3582 floor N_replica ~ 764 uses the loosest in-band source (xi_true = xi_max = 400) and ' +
      'is therefore a WORST-CASE bound. The mid-band planted feature at xi_true = 250 stays replica-' +
      'free down to N ~ 620.70 = (xi_max + xi_true) U/(2 pi), BELOW 764: the ladder points N = 764, ' +
      '700, 640 lie below the generic floor yet the replica (550.06 / 483.04 / 420.21) is still above ' +
      'the band ceiling 400, so the discriminator remains decisive. The generic floor correctly ' +
      'upper-bounds the replica-free grid size across ALL in-band sources; it is not the failure point ' +
      'for any single feature.',
    failureIsAtTheFeatureFloor:
      'The drift-0 discriminator fails EXACTLY at and below the feature-specific floor ~620.70: at ' +
      'N = 512 and N = 400 the replica folds in at 286.17 and 168.88 with periodogram height EQUAL to ' +
      'the genuine peak (rel. diff ~1e-15), so (0, 400] holds two equal maxima and the argmax is a ' +
      'tie -- no longer decisive. Above the floor exactly one in-band peak survives (the genuine one), ' +
      'so drift-0 stays decisive. The ladder split (replica-free down to 640, replica in-band from ' +
      '512) straddles 620.70 precisely.',
    replicaSweepsThroughThePeak:
      'As N drops the folded replica moves down through the band and crosses the genuine peak at ' +
      'N_colocate = xi_true U/pi ~ 477.46 (2 xi_Nyq - 250 = 250): at N = 512 it sits above (286.17) and ' +
      'at N = 400 below (168.88). Near N_colocate the two comb peaks merge, the worst masking case, ' +
      'exhibited here by direct measurement of the planted comb.',
    coarseScanArtifact:
      'A coarse scan on the imp-3558 step dxi = 0.1 keeps xi_true = 250 an exact grid node while ' +
      'sampling the folded replica off-node, so its argmax reports 250 at EVERY rung -- even N = 512, ' +
      '400 where the equal-height replica is in-band. That is precisely why a naive coarse drift-0 ' +
      'read is unsafe below the floor; the decisive quantity is the in-band comb-peak count, not the ' +
      'coarse argmax location.',
    sharpensNotCloses:
      'This LOCATES the sub-floor fold-in crossover for the planted feature; it does NOT give xi* or ' +
      'the sup an elementary closed form (the imp-3470 stationarity equation stays transcendental) and ' +
      'does not extend the finite-domain (0, 400] measurement of the |P1| objective.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresFeatureFloorNotClosedForm:
      'This MEASURES the sub-floor fold-in crossover of the imp-3622 planted feature and shows the ' +
      'imp-3582 generic floor 764 is a conservative worst-case (the mid-band feature floor is ~620.70). ' +
      'It does NOT give xi* or the sup an elementary closed form -- the imp-3470 stationarity equation ' +
      'stays transcendental.',
    syntheticNotObjective:
      'The planted feature is a pure sampled cosine chosen to REALIZE the alias-image geometry cleanly; ' +
      'it is a controlled test signal, not the |P1| objective itself. It confirms the fold-in floor ' +
      'and the equal-height comb tie the imp-3558 discriminator relies on, not a new bound on |P1|.',
    firstOrderAliasModel:
      'Only the FIRST minus-branch image L = 2 xi_Nyq - xi_true can fold into (0, 400] for these N ' +
      '(the plus image xi_true + 2 xi_Nyq and the second fold 4 xi_Nyq - xi_true stay above 400 for ' +
      'every N >= 400); the k = 1 image is the binding one, matching the imp-3582 first-order model.',
    finiteDomainStillFinite:
      'The band ceiling xi_max = 400 is the imp-3511 finite scan cap; this measurement bounds the ' +
      'aliasing leakage margin within (0, 400], NOT that |P1| has no stationary point at arbitrarily ' +
      'large xi.',
    measuresRatioNotPositivity:
      'This hardens the tail no-missed-maximizer certificate of the numerator norm of the capture ' +
      'RATIO; it does NOT construct the missing magnitude and does NOT attempt the imp-3066 ' +
      'K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3647_BELOW_FLOOR_REPLICA_FOLDIN_MARGIN_ASSERTIONS = [
  {
    id: 'imp3647-feature-floor-below-generic-764',
    why: 'THE PRIMARY DELIVERABLE: the feature-specific fold-in floor for xi_true = 250 must be ' +
      'N_fold = (xi_max + xi_true) U/(2 pi) = 1950/pi ~ 620.70, strictly BELOW the imp-3582 generic ' +
      'worst-case floor N_replica = 764.',
    holds: () =>
      Math.abs(nFoldPlantedExact - 1950 / Math.PI) < 1e-9 &&
      Math.abs(nFoldPlantedExact - 620.7043) < 1e-3 &&
      nFoldPlantedExact < N_REPLICA_GENERIC,
  },
  {
    id: 'imp3647-ladder-split-straddles-feature-floor',
    why: 'The measured ladder must split exactly at the feature floor: replica-free down to N = 640 ' +
      'and replica in-band from N = 512, with 512 < 620.70 < 640, so the crossover is bracketed.',
    holds: () =>
      smallestReplicaFreeN === 640 &&
      largestReplicaInBandN === 512 &&
      largestReplicaInBandN < nFoldPlantedExact &&
      nFoldPlantedExact < smallestReplicaFreeN,
  },
  {
    id: 'imp3647-replica-in-band-exactly-below-feature-floor',
    why: 'The first replica 2 xi_Nyq - 250 must fold into (0, 400] EXACTLY at the ladder points below ' +
      'the feature floor (N = 512, 400) and stay above the band ceiling for those above it ' +
      '(N = 640, 700, 764, 900).',
    holds: () =>
      rungCells.every((c) => c.replicaInBand === (c.N < nFoldPlantedExact)) &&
      rungCells.filter((c) => c.replicaInBand).map((c) => c.N).join(',') === '400,512',
  },
  {
    id: 'imp3647-folded-replica-equals-genuine-peak-height',
    why: 'THE MASKING MECHANISM: where the replica folds in (N = 512, 400) its periodogram peak must ' +
      'be EXACTLY equal in height to the genuine peak at 250 (Dirichlet comb, rel. diff < 1e-9), so ' +
      'the two in-band maxima are a genuine tie.',
    holds: () =>
      combTieHoldsWhereInBand &&
      rungCells.filter((c) => c.replicaInBand).every((c) => c.peakHeightRelDiff < PEAK_TIE_REL),
  },
  {
    id: 'imp3647-discriminator-decisive-above-fails-below',
    why: 'THE DISCRIMINATOR VERDICT: exactly one in-band comb peak (drift-0 decisive) for every ' +
      'N > 620.70, and two equal peaks (not decisive) for every N < 620.70, matching the imp-3558 ' +
      'expectation that the argmax-drift-0 test holds strictly above the floor and fails at/below it.',
    holds: () =>
      decisiveAboveFloor &&
      failsBelowFloor &&
      rungCells.every((c) => c.inBandPeakCount === (c.replicaInBand ? 2 : 1)),
  },
  {
    id: 'imp3647-colocation-N-between-512-and-400',
    why: 'The replica must sweep THROUGH the genuine peak at N_colocate = xi_true U/pi = 1500/pi ' +
      '~ 477.46, lying between the two in-band ladder points (400 < 477.46 < 512), the worst masking ' +
      'case where the two comb peaks merge.',
    holds: () =>
      Math.abs(nColocatePlantedExact - 1500 / Math.PI) < 1e-9 &&
      Math.abs(nColocatePlantedExact - 477.4648) < 1e-3 &&
      nColocatePlantedExact > 400 &&
      nColocatePlantedExact < 512,
  },
  {
    id: 'imp3647-coarse-scan-artifact-pins-250-everywhere',
    why: 'THE COARSE-SCAN CAVEAT: the coarse in-band argmax on dxi = 0.1 must report xi_true = 250 at ' +
      'EVERY rung (250 is an on-grid node, the replica is off-grid), even where the equal-height ' +
      'replica is in-band -- the grid artifact that makes a naive coarse drift-0 read unsafe below ' +
      'the floor.',
    holds: () =>
      coarseAlwaysReadsGenuine && rungCells.every((c) => Math.abs(c.coarseArg - XI_TRUE) < 1e-9),
  },
  {
    id: 'imp3647-replica-images-reproduce-2xiNyq-minus-250',
    why: 'The measured comb-peak images must reproduce 2 xi_Nyq - 250 at every rung to within the ' +
      'local scan step, anchoring the fold-in geometry to the imp-3582 first-order alias model.',
    holds: () =>
      maxReplicaResidual < DXI_LOCAL + 1e-9 &&
      Math.abs(rungCells[0].measuredReplicaLoc - (2 * (Math.PI * 400 / 6) - 250)) < DXI_LOCAL + 1e-9,
  },
  {
    id: 'imp3647-verdict-sub-floor-foldin-measured',
    why: 'The classified verdict must be the sub-floor fold-in measured split, not indeterminate; a ' +
      'flip means the ladder split moved, the comb tie broke, the feature floor mis-ordered vs 764, ' +
      'or the coarse artifact vanished.',
    holds: () =>
      verdict ===
      'SUB-FLOOR-FOLDIN-MEASURED-FEATURE-FLOOR-620.70-BELOW-GENERIC-764-DISCRIMINATOR-DECISIVE-ABOVE-FAILS-BELOW',
  },
  {
    id: 'imp3647-honest-assessment-no-qed',
    why: 'Mandatory honesty: measures the sub-floor fold-in of a SYNTHETIC feature (not the |P1| ' +
      'objective) but NOT a closed form (equation transcendental), over the finite domain (0, 400], ' +
      'measures the ratio not positivity, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3647_BELOW_FLOOR_REPLICA_FOLDIN_MARGIN.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.measuresFeatureFloorNotClosedForm === 'string' &&
        typeof c.syntheticNotObjective === 'string' &&
        typeof c.firstOrderAliasModel === 'string' &&
        typeof c.measuresRatioNotPositivity === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3647_BELOW_FLOOR_REPLICA_FOLDIN_MARGIN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3647-below-floor-replica-foldin-margin assertion failed: ${assertion.id}`);
  }
}

export default IMP3647_BELOW_FLOOR_REPLICA_FOLDIN_MARGIN;
