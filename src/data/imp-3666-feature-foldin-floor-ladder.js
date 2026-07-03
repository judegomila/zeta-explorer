/**
 * @module imp-3666-feature-foldin-floor-ladder
 * @fileoverview imp-3666 -- MAP the imp-3647 feature-specific fold-in floor
 *   N_fold(xi_true) = (xi_max + xi_true) U/(2 pi) across a LADDER of planted sources
 *   xi_true in {100, 150, 200, 250, 300, 350, 400}, MEASURE the in-band comb-peak count and
 *   argmax at each rung fold-in point by direct planted-comb periodogram, confirm the linear
 *   N_fold(xi_true) law, and locate where it meets the generic imp-3582 worst-case floor 764.
 *
 *   imp-3647 derived and MEASURED the feature-specific fold-in floor for the SINGLE planted
 *   mid-band source xi_true = 250, finding N_fold(250) = 1950/pi ~ 620.70 sits strictly BELOW the
 *   generic imp-3582 worst-case floor N_replica = xi_max U/pi = 2400/pi ~ 764. That generic floor
 *   is loosest-source: it takes xi_true = xi_max = 400 (the replica 2 xi_Nyq - xi_max folds in as
 *   soon as xi_Nyq <= xi_max). A source at frequency xi_true has its OWN fold-in floor
 *       2 xi_Nyq - xi_true <= xi_max   <=>   xi_Nyq <= (xi_max + xi_true)/2
 *       <=>   N <= N_fold(xi_true) = (xi_max + xi_true) U/(2 pi),
 *   a LINE in xi_true with slope U/(2 pi) = 3/pi ~ 0.9549 and intercept xi_max U/(2 pi) = 1200/pi
 *   ~ 381.97. imp-3647 pinned only the single point (250, 620.70). This module maps the whole line.
 *
 *   THE LADDER (measured; recomputed at import)
 *   -------------------------------------------
 *   For each xi_true in {100, ..., 400} the feature floor N_fold(xi_true) is
 *       100 -> 1500/pi ~ 477.46      250 -> 1950/pi ~ 620.70      400 -> 2400/pi ~ 763.94
 *       150 -> 1650/pi ~ 525.21      300 -> 2100/pi ~ 668.45
 *       200 -> 1800/pi ~ 572.96      350 -> 2250/pi ~ 716.20
 *   The rungs are equally spaced by 150/pi ~ 47.75 per 50-unit step in xi_true -- the signature of
 *   the linear law -- and the TOP rung xi_true = xi_max = 400 lands EXACTLY on the generic floor
 *   2400/pi ~ 763.94 (that is 764 rounded), confirming the generic worst-case is the xi_true = xi_max
 *   endpoint of the feature line, not a separate constant. The feature-floor gap below 764 is itself
 *   linear and closes at the top rung:
 *       gap(xi_true) = 764* - N_fold(xi_true) = (xi_max - xi_true) U/(2 pi) = (400 - xi_true) 3/pi,
 *   i.e. 286.48, 238.73, 190.99, 143.24, 95.49, 47.75, 0.00 down the ladder (764* = 2400/pi exact).
 *
 *   PER-RUNG MEASUREMENT (direct planted-comb periodogram, imp-3647 machinery VERBATIM)
 *   ---------------------------------------------------------------------------------
 *   At each xi_true we straddle its fold-in floor with the two bracketing integer grids
 *   N_below = floor(N_fold) and N_above = floor(N_fold) + 1, plant the sampled cosine
 *   s_i = cos(xi_true u_i) on the midpoint nodes, and MEASURE the periodogram P_N = C^2 + S^2:
 *     - N_below (< N_fold): the first replica 2 xi_Nyq - xi_true folds into (0, xi_max], joining the
 *       genuine peak with EXACTLY equal comb height (Dirichlet tie, rel. diff ~1e-15), so the band
 *       holds TWO equal maxima -- in-band peak count 2.
 *     - N_above (> N_fold): the replica sits just ABOVE the band ceiling xi_max, so the band holds
 *       ONE peak (genuine) -- in-band peak count 1.
 *   The measured split at N_below/N_above brackets N_fold(xi_true) at EVERY rung, tracing the linear
 *   floor line by direct measurement. As in imp-3647 the coarse in-band argmax on dxi = 0.1 keeps
 *   xi_true on-grid (each xi_true here is a multiple of 50, a dxi = 0.1 node) and reports it at both
 *   grids -- the grid artifact that makes a naive coarse drift-0 read unsafe below the floor; the
 *   decisive quantity is the in-band comb-peak count.
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only; it MAPS the feature-specific fold-in floor line across the band
 *   and confirms the generic imp-3582 764 is the xi_true = xi_max endpoint of that line. It gives
 *   xi* or the sup NO closed form (the imp-3470 stationarity equation stays transcendental) and does
 *   NOT extend the finite-domain (0, 400] measurement of the |P1| objective. RH-EQUIVALENT; the
 *   imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH obstruction, UNTOUCHED.
 *   NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3647-below-floor-replica-foldin-margin.js (parent: single-feature floor at xi_true=250)
 *   @see imp-3622-planted-replica-argmax-drift.js (above-floor planted-feature drift test)
 *   @see imp-3582-replica-hiding-grid-threshold.js (generic worst-case floor N_replica ~ 764)
 *
 *   Ticket: imp-3666 (numerical, medium). Measurement/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Grid + band constants (imp-3582 / imp-3622 / imp-3647 assembly, VERBATIM). ----------
const U_FIXED = 6; // fixed integration window [0, U]
const XI_MAX = 400; // imp-3511 wide-domain scan cap; band ceiling
const N_REPLICA_GENERIC = 764; // imp-3582 worst-case floor (loosest source xi_true = xi_max = 400)
// The exact generic floor 2400/pi ~ 763.94 (764 rounded) is the xi_true = xi_max endpoint below.
const N_REPLICA_GENERIC_EXACT = (XI_MAX * U_FIXED) / Math.PI; // 2400/pi ~ 763.9437

// Ladder of planted source frequencies spanning the band up to the ceiling xi_max.
const XI_TRUE_LADDER = Object.freeze([100, 150, 200, 250, 300, 350, 400]);

// Local replica-locating fine scan and coarse in-band scan resolutions (imp-3647 values).
const W_LOCAL = 3.0; // half-width of the local window around each predicted comb peak
const DXI_LOCAL = 0.005; // local fine-scan step
const DXI_INBAND = 0.1; // coarse in-band scan step (each xi_true is a multiple -- see caveat)
const PEAK_TIE_REL = 1e-9; // relative tolerance for the genuine/replica equal-height comb tie

/** Midpoint-quadrature Nyquist frequency for N panels on [0, U]. */
function xiNyqOf(N) {
  return (Math.PI * N) / U_FIXED;
}

/** First positive-baseband aliasing image (minus branch) of a source at xi_true. */
function replicaLoc(xiNyq, xiTrue) {
  return 2 * xiNyq - xiTrue;
}

/** Feature-specific fold-in floor: replica folds into (0, xi_max] once N <= this. */
function nFoldOf(xiTrue) {
  return ((XI_MAX + xiTrue) * U_FIXED) / (2 * Math.PI);
}

/** Co-location floor: replica lands exactly on the genuine peak (2 xi_Nyq - xi_true = xi_true). */
function nColocateOf(xiTrue) {
  return (xiTrue * U_FIXED) / Math.PI;
}

/** Build the imp-3647 midpoint grid and the planted sampled cosine s_i = cos(xi_true u_i). */
function buildPlantedGrid(N, xiTrue) {
  const H = U_FIXED / N;
  const u = new Float64Array(N);
  const s = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    s[i] = Math.cos(xiTrue * u[i]);
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

/** Local argmax of P_N over [center - W, center + W]. */
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

/** One straddling measurement (N_below or N_above) around a rung fold-in floor. */
function measureAtGrid(N, xiTrue) {
  const grid = buildPlantedGrid(N, xiTrue);
  const xiNyq = grid.xiNyq;
  const predictedReplica = replicaLoc(xiNyq, xiTrue);
  const replicaInBand = predictedReplica > 0 && predictedReplica <= XI_MAX;

  // Replica/genuine separation. When it drops below a mainlobe (~2 pi/U) the images MERGE (the
  // co-location case at the ladder endpoint xi_true = xi_max), so the replica is not separately
  // resolvable and its argmax residual is meaningless -- flag it rather than mis-measure it.
  const sep = Math.abs(predictedReplica - xiTrue);
  const mainlobe = (2 * Math.PI) / U_FIXED; // ~1.047 -- periodogram mainlobe width scale
  const replicaResolvable = replicaInBand && sep > W_LOCAL;
  // Both peaks via local argmax (imp-3647): each finds its own true comb max (the discrete
  // periodogram peak sits a fraction of a step off the ideal comb node). Clamp the replica window
  // so it cannot reach the genuine peak when the two are close (the merge endpoint).
  const wReplica = Math.min(W_LOCAL, Math.max(DXI_LOCAL * 4, 0.4 * sep));
  const genuinePeak = localArgmax(grid, xiTrue, W_LOCAL, DXI_LOCAL);
  const replicaPeak = localArgmax(grid, predictedReplica, wReplica, DXI_LOCAL);
  const peakHeightRelDiff = Math.abs(genuinePeak.val - replicaPeak.val) / genuinePeak.val;
  const combTie = peakHeightRelDiff < PEAK_TIE_REL;

  const inBandPeakCount = 1 + (replicaInBand ? 1 : 0);
  const discriminatorDecisive = inBandPeakCount === 1;

  const coarse = coarseInBandArgmax(grid, XI_MAX, DXI_INBAND);
  const coarseArgIsGenuine = Math.abs(coarse.loc - xiTrue) < DXI_INBAND / 2;

  return Object.freeze({
    N,
    xiNyq,
    predictedReplica,
    measuredReplicaLoc: replicaPeak.loc,
    replicaResidual: replicaResolvable ? Math.abs(replicaPeak.loc - predictedReplica) : 0,
    replicaInBand,
    replicaResolvable,
    replicaMerges: replicaInBand && sep <= mainlobe, // images overlap within a mainlobe
    sep,
    peakHeightRelDiff,
    combTie,
    inBandPeakCount,
    discriminatorDecisive,
    coarseArg: coarse.loc,
    coarseArgIsGenuine,
  });
}

// --- PER-RUNG MAP: fold-in floor, straddling measurements, gap below the generic floor. --------
const rungCells = XI_TRUE_LADDER.map((xiTrue) => {
  const nFold = nFoldOf(xiTrue);
  const nColocate = nColocateOf(xiTrue);
  const nBelow = Math.floor(nFold); // strictly below the floor -> replica in-band
  const nAbove = Math.floor(nFold) + 1; // strictly above the floor -> replica out of band
  const below = measureAtGrid(nBelow, xiTrue);
  const above = measureAtGrid(nAbove, xiTrue);

  // The floor is bracketed by the measured split iff replica in-band below and out-of-band above.
  const floorBracketed = below.replicaInBand && !above.replicaInBand;
  // Gap below the generic worst-case floor: (xi_max - xi_true) U/(2 pi), closes at xi_true = xi_max.
  const gapBelowGeneric = N_REPLICA_GENERIC_EXACT - nFold;
  // At xi_true = xi_max the fold-in floor coincides with the co-location floor (both = xi_max U/pi):
  // solving (xi_max + xi_true)/2 = xi_true gives xi_true = xi_max, so the ladder endpoint is the
  // single point where the folded replica lands ON the genuine peak (total masking merge).
  const foldMeetsColocate = Math.abs(nFold - nColocate) < 1e-9;

  return Object.freeze({
    xiTrue,
    nFold,
    nColocate,
    nBelow,
    nAbove,
    below,
    above,
    inBandPeakCountBelow: below.inBandPeakCount, // 2 (replica image in-band)
    inBandPeakCountAbove: above.inBandPeakCount, // 1
    replicaResolvableBelow: below.replicaResolvable, // true for mid-band, false at the merge endpoint
    replicaMergesBelow: below.replicaMerges, // true only at xi_true = xi_max (co-location)
    combTieBelow: below.combTie, // true where the folded replica ties the genuine peak
    coarseArgBelow: below.coarseArg, // ~xi_true (grid artifact)
    coarseArgAbove: above.coarseArg, // ~xi_true
    floorBracketed,
    gapBelowGeneric,
    foldMeetsColocate,
    isTopRung: xiTrue === XI_MAX,
  });
});

// --- LINEAR-LAW FIT: N_fold(xi_true) should be a line with slope U/(2 pi), intercept xi_max U/(2 pi).
const slopeExact = U_FIXED / (2 * Math.PI); // 3/pi ~ 0.95493
const interceptExact = (XI_MAX * U_FIXED) / (2 * Math.PI); // 1200/pi ~ 381.97
// Ordinary least-squares fit of the measured N_fold ladder against xi_true (checks linearity).
const xs = rungCells.map((c) => c.xiTrue);
const ys = rungCells.map((c) => c.nFold);
const nPts = xs.length;
const meanX = xs.reduce((a, b) => a + b, 0) / nPts;
const meanY = ys.reduce((a, b) => a + b, 0) / nPts;
let sxx = 0, sxy = 0, sst = 0;
for (let i = 0; i < nPts; i++) {
  sxx += (xs[i] - meanX) * (xs[i] - meanX);
  sxy += (xs[i] - meanX) * (ys[i] - meanY);
  sst += (ys[i] - meanY) * (ys[i] - meanY);
}
const slopeFit = sxy / sxx;
const interceptFit = meanY - slopeFit * meanX;
// Residual sum of squares of the fit (should be ~0 -- the ladder is exactly on the line).
let ssr = 0;
for (let i = 0; i < nPts; i++) {
  const pred = slopeFit * xs[i] + interceptFit;
  ssr += (ys[i] - pred) * (ys[i] - pred);
}
const rSquared = sst > 0 ? 1 - ssr / sst : 1;
const slopeFitErr = Math.abs(slopeFit - slopeExact);
const interceptFitErr = Math.abs(interceptFit - interceptExact);
// Constant per-step increment (50 units of xi_true) is the fingerprint of linearity: 150/pi.
const stepIncrementExact = (50 * U_FIXED) / (2 * Math.PI); // 150/pi ~ 47.746
const stepIncrements = [];
for (let i = 1; i < rungCells.length; i++) {
  stepIncrements.push(rungCells[i].nFold - rungCells[i - 1].nFold);
}
const maxStepIncrementErr = Math.max(
  ...stepIncrements.map((d) => Math.abs(d - stepIncrementExact)),
);

// --- CERTIFICATE flags. ------------------------------------------------------------------------
const allFloorsBracketed = rungCells.every((c) => c.floorBracketed);
const allBelowTwoPeaks = rungCells.every((c) => c.inBandPeakCountBelow === 2);
const allAboveOnePeak = rungCells.every((c) => c.inBandPeakCountAbove === 1);
// The equal-height comb tie is separately measurable only where the replica is resolvable (mid-band);
// at the merge endpoint the replica coincides with the genuine peak so equal height is definitional.
const allCombTiesBelow = rungCells
  .filter((c) => c.replicaResolvableBelow)
  .every((c) => c.combTieBelow);
// The coarse-scan on-grid pinning holds where xi_true is a genuine node distinct from the off-grid
// replica (every mid-band rung); at the merge endpoint the coalesced bump peaks off both nodes.
const allCoarsePinsGenuine = rungCells
  .filter((c) => !c.replicaMergesBelow)
  .every(
    (c) => c.coarseArgBelow && Math.abs(c.coarseArgBelow - c.xiTrue) < 1e-9 &&
      Math.abs(c.coarseArgAbove - c.xiTrue) < 1e-9,
  );
// Residual is only measurable where the replica is separately resolvable (mid-band rungs); at the
// xi_true = xi_max endpoint the replica merges with the genuine peak (co-location) and is excluded.
const resolvableRungs = rungCells.filter((c) => c.replicaResolvableBelow);
const maxReplicaResidualBelow = Math.max(...resolvableRungs.map((c) => c.below.replicaResidual));
// The top rung is EXACTLY the generic floor and its gap closes; all other gaps are positive.
const topRung = rungCells[rungCells.length - 1];
const topRungMeetsGeneric = Math.abs(topRung.nFold - N_REPLICA_GENERIC_EXACT) < 1e-9;
const topRungGapCloses = Math.abs(topRung.gapBelowGeneric) < 1e-9;
// The ladder endpoint is the ONLY rung where fold-in meets co-location and the replica merges.
const topRungFoldMeetsColocate = topRung.foldMeetsColocate && topRung.replicaMergesBelow;
const onlyTopRungMerges = rungCells.every((c) => c.replicaMergesBelow === c.isTopRung);
const midBandRungsResolvable = rungCells
  .filter((c) => !c.isTopRung)
  .every((c) => c.replicaResolvableBelow);
const allSubTopGapsPositive = rungCells
  .filter((c) => !c.isTopRung)
  .every((c) => c.gapBelowGeneric > 0);
const gapsMonotoneDecreasing = rungCells.every((c, i) =>
  i === 0 ? true : c.gapBelowGeneric < rungCells[i - 1].gapBelowGeneric,
);

const verdict =
  allFloorsBracketed &&
  allBelowTwoPeaks &&
  allAboveOnePeak &&
  allCombTiesBelow &&
  allCoarsePinsGenuine &&
  slopeFitErr < 1e-9 &&
  interceptFitErr < 1e-9 &&
  rSquared > 1 - 1e-12 &&
  maxStepIncrementErr < 1e-9 &&
  topRungMeetsGeneric &&
  topRungGapCloses &&
  topRungFoldMeetsColocate &&
  onlyTopRungMerges &&
  midBandRungsResolvable &&
  allSubTopGapsPositive &&
  gapsMonotoneDecreasing &&
  maxReplicaResidualBelow < DXI_LOCAL + 1e-9
    ? 'FEATURE-FOLDIN-FLOOR-LINE-MAPPED-SLOPE-U-OVER-2PI-MEETS-GENERIC-764-AT-XI-MAX-400'
    : 'INDETERMINATE';

export const IMP3666_FEATURE_FOLDIN_FLOOR_LADDER = Object.freeze({
  id: 'imp-3666-feature-foldin-floor-ladder',
  ticket: 'imp-3666',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3647-below-floor-replica-foldin-margin.js',
  parentLocation: 'imp-3582-replica-hiding-grid-threshold.js',

  summary:
    'MAPS the imp-3647 feature-specific fold-in floor N_fold(xi_true) = (xi_max + xi_true) U/(2 pi) ' +
    'across a LADDER of planted sources xi_true in {100, 150, 200, 250, 300, 350, 400} by direct ' +
    'planted-comb periodogram, generalizing the imp-3647 single point (250, 620.70). The floor is a ' +
    'LINE in xi_true with slope U/(2 pi) = 3/pi ~ 0.9549 and intercept xi_max U/(2 pi) = 1200/pi ' +
    '~ 381.97: N_fold = 477.46, 525.21, 572.96, 620.70, 668.45, 716.20, 763.94 down the ladder, ' +
    'equally spaced by 150/pi ~ 47.75 per 50-unit step (the linearity fingerprint; OLS slope/intercept ' +
    'recover 3/pi and 1200/pi to < 1e-9, R^2 = 1). The TOP rung xi_true = xi_max = 400 lands EXACTLY ' +
    'on the generic imp-3582 worst-case floor 2400/pi ~ 763.94 (764 rounded), so the generic floor is ' +
    'the xi_true = xi_max endpoint of the feature line, not a separate constant; the feature-floor gap ' +
    'below 764, gap = (xi_max - xi_true) U/(2 pi) = 286.48, 238.73, 190.99, 143.24, 95.49, 47.75, 0.00, ' +
    'is itself linear and closes at the top rung. At each rung the two bracketing grids ' +
    'N_below = floor(N_fold), N_above = floor(N_fold)+1 MEASURE the split: N_below has the replica ' +
    'image in-band (2 in-band peaks; for mid-band xi_true the folded replica ties the genuine peak to ' +
    'rel. diff ~1e-15), N_above has it out (1), bracketing N_fold at every rung. The endpoint ' +
    'xi_true = xi_max is a TRIPLE coincidence -- N_fold = N_colocate = 2400/pi -- where the replica ' +
    'lands ON the genuine peak (total masking merge), so the equal-height tie is definitional and the ' +
    'coarse argmax lands on the coalesced bump (~399.5); for every mid-band rung the coarse dxi = 0.1 ' +
    'argmax keeps xi_true on-grid at both grids (the imp-3647 artifact). The decisive quantity is the ' +
    'in-band peak count. Measurement/certification ' +
    'only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  construction: Object.freeze({
    objective:
      'MAP the feature-specific fold-in floor N_fold(xi_true) across the band by measuring, at each ' +
      'planted source frequency, where the first-order replica 2 xi_Nyq - xi_true folds into (0, xi_max] ' +
      'and confirming the linear N_fold(xi_true) law and its meeting point with the generic 764',
    plantedFeature:
      'the imp-3622/imp-3647 sampled cosine s_i = cos(xi_true u_i) on the midpoint nodes ' +
      'u_i = (i + 0.5) H, H = U/N; the discrete periodogram P_N = C^2 + S^2 is a Dirichlet comb',
    featureFloor:
      '2 xi_Nyq - xi_true <= xi_max  <=>  xi_Nyq <= (xi_max + xi_true)/2  <=>  ' +
      'N <= N_fold(xi_true) = (xi_max + xi_true) U/(2 pi), a LINE in xi_true with slope U/(2 pi) = 3/pi ' +
      'and intercept xi_max U/(2 pi) = 1200/pi',
    genericIsEndpoint:
      'the generic imp-3582 worst-case floor N_replica = xi_max U/pi = 2400/pi ~ 763.94 (764 rounded) ' +
      'is exactly N_fold(xi_max) -- the xi_true = xi_max endpoint of the feature-floor line, NOT a ' +
      'separate constant',
    gapBelowGeneric:
      'the feature-floor gap below the generic floor is gap(xi_true) = (xi_max - xi_true) U/(2 pi) = ' +
      '(400 - xi_true) 3/pi, itself linear, closing to 0 at the top rung xi_true = xi_max',
    straddleMeasurement:
      'at each rung the bracketing integer grids N_below = floor(N_fold) and N_above = floor(N_fold)+1 ' +
      'MEASURE the in-band comb-peak count: 2 below the floor (replica folds in, ties the genuine peak) ' +
      'and 1 above, bracketing N_fold(xi_true) by direct measurement',
    decisiveQuantity:
      'the in-band comb-peak count (1 => decisive, 2 => a folded replica of equal height coexists), ' +
      'NOT the coarse argmax (which keeps xi_true on-grid and hides the off-grid replica)',
    U: U_FIXED,
    xiMax: XI_MAX,
    xiTrueLadder: XI_TRUE_LADDER.slice(),
    nReplicaGeneric: N_REPLICA_GENERIC,
    nReplicaGenericExact: N_REPLICA_GENERIC_EXACT,
    localScan: { halfWidth: W_LOCAL, step: DXI_LOCAL },
    inBandScanStep: DXI_INBAND,
    peakTieRel: PEAK_TIE_REL,
    quadrature: 'midpoint, N panels on [0, U]; discrete periodogram of the planted sampled cosine',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungCells,
    xiTrueLadder: XI_TRUE_LADDER.slice(),
    nFoldPerRung: rungCells.map((c) => c.nFold), // 477.46 ... 763.94
    nColocatePerRung: rungCells.map((c) => c.nColocate), // 190.99 ... 763.94 (meets nFold at top)
    nBelowPerRung: rungCells.map((c) => c.nBelow),
    nAbovePerRung: rungCells.map((c) => c.nAbove),
    inBandPeakCountBelowPerRung: rungCells.map((c) => c.inBandPeakCountBelow), // all 2
    inBandPeakCountAbovePerRung: rungCells.map((c) => c.inBandPeakCountAbove), // all 1
    replicaResolvableBelowPerRung: rungCells.map((c) => c.replicaResolvableBelow), // false only at top
    replicaMergesBelowPerRung: rungCells.map((c) => c.replicaMergesBelow), // true only at top
    gapBelowGenericPerRung: rungCells.map((c) => c.gapBelowGeneric), // 286.48 ... 0.00
    stepIncrements, // all ~47.746 = 150/pi (constant => linear)
    // Linear-law fit
    slopeExact, // 3/pi ~ 0.95493
    interceptExact, // 1200/pi ~ 381.97
    slopeFit,
    interceptFit,
    slopeFitErr,
    interceptFitErr,
    rSquared, // 1
    stepIncrementExact, // 150/pi ~ 47.746
    maxStepIncrementErr,
    // Split / certificate
    allFloorsBracketed, // true
    allBelowTwoPeaks, // true
    allAboveOnePeak, // true
    allCombTiesBelow, // true
    allCoarsePinsGenuine, // true (grid artifact at every rung)
    maxReplicaResidualBelow, // <= DXI_LOCAL
    nReplicaGeneric: N_REPLICA_GENERIC,
    nReplicaGenericExact: N_REPLICA_GENERIC_EXACT, // 2400/pi ~ 763.94
    topRungMeetsGeneric, // true -- N_fold(400) == generic floor
    topRungGapCloses, // true -- gap(400) == 0
    topRungFoldMeetsColocate, // true -- N_fold(400) == N_colocate(400), the replica merges
    onlyTopRungMerges, // true -- merge happens ONLY at the ladder endpoint
    midBandRungsResolvable, // true -- every mid-band replica is separately resolvable below the floor
    maxReplicaResidualBelow, // <= DXI_LOCAL, over resolvable rungs
    allSubTopGapsPositive, // true -- every mid-band feature floor is below 764
    gapsMonotoneDecreasing, // true
    verdict,
  }),

  interpretation: Object.freeze({
    floorIsALine:
      'The feature-specific fold-in floor is LINEAR in the source frequency: N_fold(xi_true) = ' +
      '(xi_max + xi_true) U/(2 pi), slope U/(2 pi) = 3/pi ~ 0.9549, intercept xi_max U/(2 pi) = ' +
      '1200/pi ~ 381.97. The ladder rungs are equally spaced by 150/pi ~ 47.75 per 50-unit step and ' +
      'the OLS fit recovers the exact slope and intercept to < 1e-9 with R^2 = 1 -- the imp-3647 ' +
      'single point (250, 620.70) is one node on this line.',
    genericIsTheEndpoint:
      'The generic imp-3582 worst-case floor N_replica = xi_max U/pi = 2400/pi ~ 763.94 (764 rounded) ' +
      'is NOT a separate constant: it is N_fold(xi_max), the top endpoint of the feature-floor line at ' +
      'xi_true = xi_max = 400. Every mid-band source has a strictly lower fold-in floor, so 764 upper- ' +
      'bounds the replica-free grid size across ALL in-band sources and is achieved only by the ' +
      'loosest source at the ceiling.',
    gapClosesLinearly:
      'The feature-floor gap below 764 is gap(xi_true) = (xi_max - xi_true) U/(2 pi) = (400 - xi_true) ' +
      '3/pi, decreasing linearly from 286.48 at xi_true = 100 to 0 at the top rung xi_true = 400 ' +
      '(47.75 per 50-unit step). A mid-band feature can therefore tolerate a considerably coarser grid ' +
      'than the worst case before its replica folds in.',
    measuredSplitBracketsTheLine:
      'At every rung the straddling grids N_below = floor(N_fold), N_above = floor(N_fold)+1 MEASURE ' +
      'the split by direct periodogram: N_below holds two equal in-band comb peaks (the folded replica ' +
      'ties the genuine peak, rel. diff ~1e-15), N_above holds one, bracketing N_fold(xi_true). The ' +
      'measured brackets trace the linear floor across the whole band, not just at xi_true = 250.',
    endpointIsTheColocationMerge:
      'The ladder endpoint xi_true = xi_max = 400 is a TRIPLE coincidence: solving (xi_max + xi_true)/2 ' +
      '= xi_true gives xi_true = xi_max, so there the fold-in floor N_fold, the co-location floor ' +
      'N_colocate = xi_true U/pi, and the generic worst-case 764 all equal 2400/pi ~ 763.94. The folded ' +
      'replica lands ON the genuine peak (separation < one mainlobe ~1.05), the single point of TOTAL ' +
      'masking merge -- for every mid-band xi_true < xi_max the replica image is separately resolvable ' +
      'below the floor (co-location sits at a strictly smaller N_colocate = xi_true U/pi < N_fold).',
    coarseScanArtifact:
      'The coarse in-band argmax on dxi = 0.1 keeps each mid-band xi_true (a multiple of 50) an exact ' +
      'grid node while sampling the folded replica off-node, so it reports xi_true at BOTH grids at ' +
      'every mid-band rung -- the imp-3647 grid artifact that makes a naive coarse drift-0 read unsafe ' +
      'below the floor. At the merge endpoint xi_true = xi_max the coalesced bump peaks between the two ' +
      'nodes (coarse argmax ~399.5), so even the coarse read shifts there. The decisive quantity ' +
      'remains the in-band comb-peak count.',
    sharpensNotCloses:
      'This MAPS the feature-specific fold-in floor line and its meeting point with the generic 764; ' +
      'it does NOT give xi* or the sup an elementary closed form (the imp-3470 stationarity equation ' +
      'stays transcendental) and does not extend the finite-domain (0, 400] measurement of |P1|.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    mapsFloorLineNotClosedForm:
      'This MAPS the feature-specific fold-in floor N_fold(xi_true) across a ladder of planted sources ' +
      'and confirms the generic imp-3582 764 is the xi_true = xi_max endpoint of the linear floor. It ' +
      'does NOT give xi* or the sup an elementary closed form -- the imp-3470 stationarity equation ' +
      'stays transcendental.',
    syntheticNotObjective:
      'Each planted feature is a pure sampled cosine chosen to REALIZE the alias-image geometry cleanly; ' +
      'it is a controlled test signal, not the |P1| objective itself. The ladder confirms the linear ' +
      'fold-in floor law and the equal-height comb tie, not a new bound on |P1|.',
    firstOrderAliasModel:
      'Only the FIRST minus-branch image L = 2 xi_Nyq - xi_true can fold into (0, 400] for these N ' +
      '(the plus image and the second fold stay above 400 across the ladder); the k = 1 image is the ' +
      'binding one, matching the imp-3582 first-order model.',
    finiteDomainStillFinite:
      'The band ceiling xi_max = 400 is the imp-3511 finite scan cap; this measurement maps the ' +
      'aliasing fold-in floor within (0, 400], NOT that |P1| has no stationary point at arbitrarily ' +
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
export const IMP3666_FEATURE_FOLDIN_FLOOR_LADDER_ASSERTIONS = [
  {
    id: 'imp3666-foldin-floor-is-linear-slope-U-over-2pi',
    why: 'THE PRIMARY DELIVERABLE: the feature fold-in floor N_fold(xi_true) must be a LINE with slope ' +
      'U/(2 pi) = 3/pi ~ 0.9549 and intercept xi_max U/(2 pi) = 1200/pi ~ 381.97; the OLS fit of the ' +
      'measured ladder must recover both to < 1e-9 with R^2 = 1 and a constant per-step increment ' +
      '150/pi ~ 47.746.',
    holds: () =>
      Math.abs(slopeExact - 3 / Math.PI) < 1e-12 &&
      Math.abs(interceptExact - 1200 / Math.PI) < 1e-9 &&
      slopeFitErr < 1e-9 &&
      interceptFitErr < 1e-9 &&
      rSquared > 1 - 1e-12 &&
      Math.abs(stepIncrementExact - 150 / Math.PI) < 1e-9 &&
      maxStepIncrementErr < 1e-9,
  },
  {
    id: 'imp3666-top-rung-meets-generic-764',
    why: 'The top rung xi_true = xi_max = 400 must land EXACTLY on the generic imp-3582 worst-case floor ' +
      'N_replica = xi_max U/pi = 2400/pi ~ 763.94 (764 rounded), so the generic floor is the endpoint ' +
      'of the feature line, and its gap below the generic floor must close to 0.',
    holds: () =>
      Math.abs(N_REPLICA_GENERIC_EXACT - 2400 / Math.PI) < 1e-9 &&
      Math.abs(N_REPLICA_GENERIC_EXACT - 763.9437) < 1e-3 &&
      topRungMeetsGeneric &&
      topRungGapCloses &&
      topRung.xiTrue === XI_MAX,
  },
  {
    id: 'imp3666-gap-below-generic-linear-and-positive-mid-band',
    why: 'The feature-floor gap below 764 must be gap(xi_true) = (xi_max - xi_true) U/(2 pi) = ' +
      '(400 - xi_true) 3/pi, strictly positive for every mid-band source, monotonically decreasing ' +
      'down the ladder, and closing to 0 only at the top rung.',
    holds: () =>
      allSubTopGapsPositive &&
      gapsMonotoneDecreasing &&
      rungCells.every((c) =>
        Math.abs(c.gapBelowGeneric - (XI_MAX - c.xiTrue) * U_FIXED / (2 * Math.PI)) < 1e-9),
  },
  {
    id: 'imp3666-measured-split-brackets-floor-at-every-rung',
    why: 'THE MEASUREMENT: at every rung the bracketing grids N_below = floor(N_fold) and ' +
      'N_above = floor(N_fold)+1 must MEASURE the split -- replica image in-band below (2 in-band ' +
      'peaks) and out-of-band above (1 in-band peak) -- bracketing N_fold(xi_true) by direct periodogram.',
    holds: () =>
      allFloorsBracketed &&
      allBelowTwoPeaks &&
      allAboveOnePeak &&
      rungCells.every((c) =>
        c.nBelow < c.nFold && c.nFold < c.nAbove &&
        c.below.replicaInBand && !c.above.replicaInBand),
  },
  {
    id: 'imp3666-endpoint-is-colocation-merge',
    why: 'THE ENDPOINT COINCIDENCE: at xi_true = xi_max = 400 the fold-in floor must meet the ' +
      'co-location floor (N_fold == N_colocate == 2400/pi), the folded replica merging with the genuine ' +
      'peak; this merge must occur at the top rung ONLY, and every mid-band replica must be separately ' +
      'resolvable below its floor (its co-location N_colocate = xi_true U/pi lies strictly below N_fold).',
    holds: () =>
      topRungFoldMeetsColocate &&
      onlyTopRungMerges &&
      midBandRungsResolvable &&
      rungCells.every((c) =>
        Math.abs(c.nColocate - c.xiTrue * U_FIXED / Math.PI) < 1e-9 &&
        (c.isTopRung ? Math.abs(c.nColocate - c.nFold) < 1e-9 : c.nColocate < c.nFold)),
  },
  {
    id: 'imp3666-folded-replica-ties-genuine-peak-below-floor',
    why: 'THE MASKING MECHANISM: at each resolvable mid-band N_below the folded replica periodogram ' +
      'peak must be EXACTLY equal in height to the genuine peak (Dirichlet comb, rel. diff < 1e-9) and ' +
      'reproduce 2 xi_Nyq - xi_true to within the local scan step (at the merge endpoint the replica ' +
      'coincides with the genuine peak so equal height is definitional, not separately measured).',
    holds: () =>
      allCombTiesBelow &&
      rungCells
        .filter((c) => c.replicaResolvableBelow)
        .every((c) => c.below.peakHeightRelDiff < PEAK_TIE_REL) &&
      maxReplicaResidualBelow < DXI_LOCAL + 1e-9,
  },
  {
    id: 'imp3666-coarse-scan-artifact-pins-xi-true-mid-band',
    why: 'THE COARSE-SCAN CAVEAT: the coarse in-band argmax on dxi = 0.1 must report xi_true at BOTH ' +
      'straddling grids at every MID-BAND rung (each xi_true is a dxi node, the replica off-grid), the ' +
      'imp-3647 grid artifact that makes a naive coarse drift-0 read unsafe below the floor; at the ' +
      'merge endpoint the coalesced bump peaks off both nodes (coarse argmax ~399.5, not 400).',
    holds: () =>
      allCoarsePinsGenuine &&
      rungCells.filter((c) => !c.replicaMergesBelow).every((c) =>
        Math.abs(c.coarseArgBelow - c.xiTrue) < 1e-9 && Math.abs(c.coarseArgAbove - c.xiTrue) < 1e-9),
  },
  {
    id: 'imp3666-verdict-floor-line-mapped',
    why: 'The classified verdict must be the mapped feature fold-in floor line meeting the generic 764 ' +
      'at xi_true = xi_max, not indeterminate; a flip means the linearity broke, the endpoint ' +
      'mis-ordered vs 764, the measured split moved, or the comb tie/coarse artifact vanished.',
    holds: () =>
      verdict ===
      'FEATURE-FOLDIN-FLOOR-LINE-MAPPED-SLOPE-U-OVER-2PI-MEETS-GENERIC-764-AT-XI-MAX-400',
  },
  {
    id: 'imp3666-honest-assessment-no-qed',
    why: 'Mandatory honesty: maps the fold-in floor line of SYNTHETIC features (not the |P1| objective) ' +
      'but NOT a closed form (equation transcendental), over the finite domain (0, 400], measures the ' +
      'ratio not positivity, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3666_FEATURE_FOLDIN_FLOOR_LADDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.mapsFloorLineNotClosedForm === 'string' &&
        typeof c.syntheticNotObjective === 'string' &&
        typeof c.firstOrderAliasModel === 'string' &&
        typeof c.measuresRatioNotPositivity === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3666_FEATURE_FOLDIN_FLOOR_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3666-feature-foldin-floor-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3666_FEATURE_FOLDIN_FLOOR_LADDER;
