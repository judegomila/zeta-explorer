/**
 * @module imp-3622-planted-replica-argmax-drift
 * @fileoverview imp-3622 -- NUMERICALLY CONFIRM the imp-3601 argmax-drift-0 discriminator against
 *   PLANTED higher-order aliasing replicas by MEASURING the m-fold replica shift 2 m xi_Nyq per
 *   panel doubling on a synthetic in-band feature.
 *
 *   imp-3601 DERIVED the m-fold aliasing fold-in ladder N_m = N_replica/m (binding floor m = 1,
 *   ~764) and ASSERTED -- from the alias-image geometry, without measuring -- that an m-fold replica
 *   shifts by 2 m xi_Nyq per panel doubling, so the imp-3558 argmax-drift-0 test unmasks a higher-
 *   order replica even more decisively than a first-order one. This module MEASURES that claim end
 *   to end: it plants a synthetic feature at a KNOWN xi_true in (0, 400], runs the imp-3558/imp-3511
 *   midpoint-quadrature periodogram scan at the four rungs N in {1200, 2400, 4800, 9600}, and records
 *   the ACTUAL argmax location of the first- and second-fold replica images at each rung.
 *
 *   THE PLANTED FEATURE
 *   -------------------
 *   A pure sampled cosine s_i = cos(xi_true u_i) on the imp-3558 midpoint nodes u_i = (i + 0.5) H,
 *   H = U/N, is the cleanest realizable in-band feature: its discrete periodogram
 *       P_N(xi) = ( sum_i s_i cos(xi u_i) )^2 + ( sum_i s_i sin(xi u_i) )^2
 *   is a Dirichlet-kernel comb whose peaks sit EXACTLY at the imp-3601 alias-image set
 *       xi_true + 2 k xi_Nyq   and   2 m xi_Nyq - xi_true     (m, k = 1, 2, 3, ...),
 *   since sampling at spacing H periodizes the spectrum with period omega_s = 2 xi_Nyq = 2 pi/H.
 *   The m = 1 minus image 2 xi_Nyq - xi_true is the imp-3582 first replica; the m = 2 minus image
 *   4 xi_Nyq - xi_true is the imp-3601 second fold. We locate each replica by a LOCAL fine scan of
 *   P_N around its predicted position and read off the measured argmax.
 *
 *   MEASURED (self-computing; recomputed at import)
 *   -----------------------------------------------
 *   With xi_true = 250 the measured replica argmaxes reproduce 2 m xi_Nyq - xi_true to < 1e-6 at
 *   every rung and fold:
 *     - first fold  (m = 1): [1006.64, 2263.27, 4776.55, 9803.10], moving 2 xi_Nyq per doubling
 *       ([1256.64, 2513.27, 5026.55]) for an across-ladder shift ~8796.46 (matches imp-3601 ~8797);
 *     - second fold (m = 2): [2263.27, 4776.55, 9803.10, 19856.19], moving 4 xi_Nyq per doubling
 *       for an across-ladder shift ~17592.92 (matches imp-3601 ~17593, exactly 2x the first fold).
 *   Meanwhile the GENUINE in-band feature keeps its argmax pinned at xi_true = 250 at every rung
 *   (in-band drift 0), and BOTH replica images sit far above the band ceiling xi_max = 400 for every
 *   N >= 1200 (smallest first-fold image ~1006.64 > 400), so no fold lands in-band. The measured
 *   drift contrast -- 0 for the genuine feature vs ~8797 / ~17593 for the replicas -- is exactly the
 *   imp-3558 argmax-drift-0 discriminator, now confirmed on a planted feature.
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only; it CONFIRMS the imp-3601 asserted 2 m xi_Nyq per-doubling drift
 *   and the drift-unmasking decisiveness on a synthetic feature. It gives xi* or the sup NO closed
 *   form (the imp-3470 stationarity equation stays transcendental) and does not extend the finite-
 *   domain (0, 400] measurement. RH-EQUIVALENT; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 *   magnitude is the lone RH obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3601-second-fold-replica-threshold.js (parent: DERIVED m-fold ladder + asserted drift)
 *   @see imp-3558-far-tail-band-max-grid-ladder-n9600.js (four-rung argmax-drift-0 discriminator)
 *   @see imp-3582-replica-hiding-grid-threshold.js (first-order replica floor N_replica ~ 764)
 *
 *   Ticket: imp-3622 (numerical, medium). Measurement/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Grid + band constants (imp-3582 / imp-3558 / imp-3511 assembly, VERBATIM). ----------
const U_FIXED = 6; // fixed integration window [0, U]
const XI_MAX = 400; // imp-3511 wide-domain scan cap; band ceiling
const N_LADDER = Object.freeze([1200, 2400, 4800, 9600]); // imp-3558 four-rung ladder
const XI_TRUE = 250; // planted synthetic feature frequency (in (0, 400], grid-aligned)
const FOLD_ORDERS = Object.freeze([1, 2]); // first fold (imp-3582) and second fold (imp-3601)

// Local replica-locating fine scan and coarse in-band scan resolutions.
const W_LOCAL = 3.0; // half-width of the local window around each predicted replica image
const DXI_LOCAL = 0.005; // local fine-scan step (aligned so the predicted image is a grid node)
const DXI_INBAND = 0.1; // coarse in-band scan step (xi_true = 250 is a multiple)

/** Midpoint-quadrature Nyquist frequency for N panels on [0, U]. */
function xiNyqOf(N) {
  return (Math.PI * N) / U_FIXED;
}

/** m-th positive-baseband aliasing image (minus branch) of a source at xi_true (imp-3601 foldLoc). */
function foldLoc(m, xiNyq, xiTrue) {
  return 2 * m * xiNyq - xiTrue;
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

/** In-band argmax of P_N over (0, xiMax], the imp-3558 argmax-drift-0 discriminator readout. */
function inBandArgmax(grid, xiMax, dxi) {
  let bestXi = dxi;
  let bestVal = -Infinity;
  for (let xi = dxi; xi <= xiMax + 1e-9; xi += dxi) {
    const val = periodogramAt(grid, xi);
    if (val > bestVal) { bestVal = val; bestXi = xi; }
  }
  return { loc: bestXi, val: bestVal };
}

// --- PER-RUNG MEASUREMENT: locate each fold image + read the genuine in-band argmax. ---
const rungCells = N_LADDER.map((N) => {
  const grid = buildPlantedGrid(N);
  const inBand = inBandArgmax(grid, XI_MAX, DXI_INBAND);
  const folds = FOLD_ORDERS.map((m) => {
    const predicted = foldLoc(m, grid.xiNyq, XI_TRUE);
    const measured = localArgmax(grid, predicted, W_LOCAL, DXI_LOCAL);
    return Object.freeze({
      m,
      predicted,
      measuredLoc: measured.loc,
      residual: Math.abs(measured.loc - predicted),
      inBand: predicted <= XI_MAX, // does this fold land inside the scanned band?
    });
  });
  return Object.freeze({
    N,
    xiNyq: grid.xiNyq,
    inBandArg: inBand.loc, // must be pinned to xi_true = 250 (genuine feature)
    inBandDrift: Math.abs(inBand.loc - XI_TRUE),
    folds,
  });
});

// --- FIRST- and SECOND-fold measured image locations across the ladder. ---
const firstFoldLocs = rungCells.map((c) => c.folds[0].measuredLoc);
const secondFoldLocs = rungCells.map((c) => c.folds[1].measuredLoc);

// --- MEASURED per-doubling shift = L_m(2N) - L_m(N); must equal 2 m xi_Nyq(N). ---
function perDoublingShifts(locs) {
  const out = [];
  for (let r = 1; r < locs.length; r++) out.push(locs[r] - locs[r - 1]);
  return out;
}
const firstFoldShiftPerDoubling = perDoublingShifts(firstFoldLocs); // ~[1256.6, 2513.3, 5026.5]
const secondFoldShiftPerDoubling = perDoublingShifts(secondFoldLocs); // ~[2513.3, 5026.5, 10053.1]

// Predicted per-doubling shifts 2 m xi_Nyq(N) for the first three rungs (the doubled-from rungs).
const firstFoldShiftPredicted = rungCells.slice(0, -1).map((c) => 2 * 1 * c.xiNyq);
const secondFoldShiftPredicted = rungCells.slice(0, -1).map((c) => 2 * 2 * c.xiNyq);

// --- ACROSS-LADDER shift (1200 -> 9600), matching the imp-3601 ~8797 / ~17593 contrasts. ---
const firstFoldShiftAcrossLadder = firstFoldLocs[firstFoldLocs.length - 1] - firstFoldLocs[0]; // ~8796.46
const secondFoldShiftAcrossLadder = secondFoldLocs[secondFoldLocs.length - 1] - secondFoldLocs[0]; // ~17592.92

// --- RESIDUALS + certificate flags. ---
const maxReplicaResidual = Math.max(...rungCells.flatMap((c) => c.folds.map((f) => f.residual)));
const maxInBandDrift = Math.max(...rungCells.map((c) => c.inBandDrift));
const noFoldLandsInBand = rungCells.every((c) => c.folds.every((f) => !f.inBand));
const secondFoldShiftIsTwiceFirst =
  Math.abs(secondFoldShiftAcrossLadder - 2 * firstFoldShiftAcrossLadder) < 1e-6;
const firstFoldShiftMatchesPrediction = firstFoldShiftPerDoubling.every(
  (d, i) => Math.abs(d - firstFoldShiftPredicted[i]) < 1e-6
);
const secondFoldShiftMatchesPrediction = secondFoldShiftPerDoubling.every(
  (d, i) => Math.abs(d - secondFoldShiftPredicted[i]) < 1e-6
);

const verdict =
  maxReplicaResidual < 1e-6 &&
  maxInBandDrift < 1e-9 &&
  noFoldLandsInBand &&
  secondFoldShiftIsTwiceFirst &&
  firstFoldShiftMatchesPrediction &&
  secondFoldShiftMatchesPrediction &&
  Math.abs(firstFoldShiftAcrossLadder - 8796.459) < 1e-2 &&
  Math.abs(secondFoldShiftAcrossLadder - 17592.919) < 1e-2
    ? 'PLANTED-REPLICA-DRIFT-CONFIRMS-IMP3601-2mXINYQ-PER-DOUBLING-INBAND-DRIFT-0-NO-FOLD-INBAND-N>=1200'
    : 'INDETERMINATE';

export const IMP3622_PLANTED_REPLICA_ARGMAX_DRIFT = Object.freeze({
  id: 'imp-3622-planted-replica-argmax-drift',
  ticket: 'imp-3622',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3601-second-fold-replica-threshold.js',
  parentLocation: 'imp-3558-far-tail-band-max-grid-ladder-n9600.js',

  summary:
    'Numerically CONFIRMS the imp-3601 argmax-drift-0 discriminator against PLANTED higher-order ' +
    'aliasing replicas by MEASURING the m-fold replica shift 2 m xi_Nyq per panel doubling. ' +
    'imp-3601 DERIVED the fold ladder N_m = N_replica/m and ASSERTED -- without measuring -- that an ' +
    'm-fold replica shifts 2 m xi_Nyq per doubling. This module plants a synthetic feature at ' +
    'xi_true = 250 (a sampled cosine on the imp-3558 midpoint nodes), whose discrete periodogram is a ' +
    'Dirichlet comb with peaks exactly at the imp-3601 image set {xi_true + 2 k xi_Nyq, 2 m xi_Nyq - ' +
    'xi_true}, and locates the first- (m = 1) and second-fold (m = 2) images by a local fine scan at ' +
    'each rung N in {1200, 2400, 4800, 9600}. The measured images reproduce 2 m xi_Nyq - xi_true to ' +
    '< 1e-6: first fold [1006.64, 2263.27, 4776.55, 9803.10] shifting 2 xi_Nyq per doubling ' +
    '(across-ladder ~8796.46, matches imp-3601 ~8797); second fold [2263.27, 4776.55, 9803.10, ' +
    '19856.19] shifting 4 xi_Nyq per doubling (across-ladder ~17592.92, exactly 2x the first fold, ' +
    'matches imp-3601 ~17593). The GENUINE in-band feature keeps its argmax pinned at xi_true = 250 ' +
    'at every rung (in-band drift 0), and BOTH replica images sit above xi_max = 400 for every ' +
    'N >= 1200 (smallest ~1006.64 > 400), so no fold lands in-band -- the measured drift contrast ' +
    '(0 vs ~8797 / ~17593) IS the imp-3558 argmax-drift-0 discriminator, now confirmed on a planted ' +
    'feature. Measurement/certification only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the ' +
    'lone obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective:
      'MEASURE the actual argmax drift of the first- and second-fold aliasing replica images of a ' +
      'planted in-band feature across the imp-3558 panel-doubling ladder, confirming the imp-3601 ' +
      'asserted 2 m xi_Nyq per-doubling shift and that no fold lands in (0, 400] for N >= 1200',
    plantedFeature:
      'a pure sampled cosine s_i = cos(xi_true u_i) on the imp-3558 midpoint nodes u_i = (i + 0.5) H, ' +
      'H = U/N, xi_true = 250 in (0, 400]; its discrete periodogram P_N(xi) = C^2 + S^2 is a ' +
      'Dirichlet comb peaking exactly at the imp-3601 image set',
    imageModel:
      'sampling at spacing H periodizes the spectrum with period omega_s = 2 xi_Nyq = 2 pi/H, so a ' +
      'baseband source at xi_true images to {xi_true + 2 k xi_Nyq} and {2 m xi_Nyq - xi_true}; the ' +
      'm = 1 minus image is the imp-3582 first replica, the m = 2 minus image the imp-3601 second fold',
    locateReplicas:
      'a local fine scan of P_N (half-width 3, step 0.005) around each predicted image 2 m xi_Nyq - ' +
      'xi_true reads off the measured argmax; a coarse in-band scan (step 0.1 over (0, 400]) reads the ' +
      'genuine feature argmax for the drift-0 discriminator',
    driftCheck:
      'measured per-doubling shift L_m(2N) - L_m(N) must equal 2 m xi_Nyq(N); across-ladder shift ' +
      '(1200 -> 9600) must match imp-3601 ~8796.46 (m = 1) and ~17592.92 (m = 2, exactly 2x)',
    U: U_FIXED,
    xiMax: XI_MAX,
    xiTrue: XI_TRUE,
    nLadder: N_LADDER.slice(),
    foldOrders: FOLD_ORDERS.slice(),
    localScan: { halfWidth: W_LOCAL, step: DXI_LOCAL },
    inBandScanStep: DXI_INBAND,
    quadrature: 'midpoint, N panels on [0, U]; discrete periodogram of the planted sampled cosine',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungCells,
    nLadder: N_LADDER.slice(),
    xiNyqPerRung: rungCells.map((c) => c.xiNyq), // ~[628, 1257, 2513, 5027]
    firstFoldLocs, // ~[1006.64, 2263.27, 4776.55, 9803.10]
    secondFoldLocs, // ~[2263.27, 4776.55, 9803.10, 19856.19]
    firstFoldShiftPerDoubling, // ~[1256.6, 2513.3, 5026.5] = 2 xi_Nyq(N)
    secondFoldShiftPerDoubling, // ~[2513.3, 5026.5, 10053.1] = 4 xi_Nyq(N)
    firstFoldShiftPredicted,
    secondFoldShiftPredicted,
    firstFoldShiftAcrossLadder, // ~8796.46 -- matches imp-3601 ~8797 (m = 1)
    secondFoldShiftAcrossLadder, // ~17592.92 -- matches imp-3601 ~17593 (m = 2)
    maxReplicaResidual, // < 1e-6 -- measured images reproduce 2 m xi_Nyq - xi_true
    inBandArgPerRung: rungCells.map((c) => c.inBandArg), // pinned to xi_true = 250
    maxInBandDrift, // 0 -- genuine feature argmax grid-invariant
    noFoldLandsInBand, // true -- both folds above xi_max = 400 for every N >= 1200
    firstFoldShiftMatchesPrediction, // true
    secondFoldShiftMatchesPrediction, // true
    secondFoldShiftIsTwiceFirst, // true
    verdict,
  }),

  interpretation: Object.freeze({
    replicaDriftMeasuredNotAsserted:
      'imp-3601 asserted the 2 m xi_Nyq per-doubling drift from the alias-image geometry; this module ' +
      'MEASURES it. The located first-fold images move exactly 2 xi_Nyq per doubling and the second-' +
      'fold images 4 xi_Nyq, reproducing 2 m xi_Nyq - xi_true to < 1e-6, so the asserted drift law is ' +
      'confirmed on a concrete planted feature.',
    secondFoldTwiceAsDecisive:
      'The second-fold across-ladder shift ~17592.92 is exactly 2x the first-fold ~8796.46, matching ' +
      'the imp-3601 ~17593 / ~8797 contrast. A higher-order replica therefore moves FARTHER per octave, ' +
      'so the imp-3558 argmax-drift-0 test unmasks it even more decisively than a first-order one -- ' +
      'now a measured fact, not a derived remark.',
    genuineFeatureStaysPut:
      'The genuine in-band feature keeps its argmax pinned at xi_true = 250 at all four rungs ' +
      '(in-band drift 0) while the replica images sweep ~8797 / ~17593 across the ladder. This 0-vs-' +
      'huge drift split is exactly the imp-3558 signature separating a genuine decaying feature from ' +
      'a Nyquist replica, here exhibited on a synthetic feature of known frequency.',
    noFoldInBand:
      'The smallest first-fold image ~1006.64 (at N = 1200) already exceeds the band ceiling ' +
      'xi_max = 400, and every higher rung and fold sits farther out, so NO aliasing fold lands in ' +
      '(0, 400] for any N >= 1200 -- confirming the imp-3601 certificate that all four rungs clear ' +
      'every fold threshold by direct measurement.',
    sharpensNotCloses:
      'This confirms the imp-3601 asserted drift law by measurement; it does NOT give xi* or the sup ' +
      'an elementary closed form (the imp-3470 stationarity equation stays transcendental) and does ' +
      'not extend the finite-domain (0, 400] measurement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsAssertedDrift:
      'This MEASURES the imp-3601 asserted 2 m xi_Nyq per-doubling replica drift and the drift-0 ' +
      'discriminator on a planted synthetic feature; it does NOT give xi* or the sup an elementary ' +
      'closed form -- the imp-3470 stationarity equation stays transcendental.',
    syntheticNotObjective:
      'The planted feature is a pure sampled cosine chosen to REALIZE the imp-3601 alias-image set ' +
      'cleanly; it is a controlled test signal, not the |P1| objective itself. It confirms the ' +
      'aliasing geometry and drift law the imp-3558 discriminator relies on, not a new bound on |P1|.',
    finiteDomainStillFinite:
      'The band ceiling xi_max = 400 is the imp-3511 finite scan cap; the measurement certifies the ' +
      'drift-0 discriminator is decisive within (0, 400] against first- AND second-fold replicas, NOT ' +
      'that |P1| has no stationary point at arbitrarily large xi.',
    measuresRatioNotPositivity:
      'This hardens the tail no-missed-maximizer certificate of the numerator norm of the capture ' +
      'RATIO; it does NOT construct the missing magnitude and does NOT attempt the imp-3066 ' +
      'K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3622_PLANTED_REPLICA_ARGMAX_DRIFT_ASSERTIONS = [
  {
    id: 'imp3622-first-fold-images-match-2xiNyq-minus-xitrue',
    why: 'THE PRIMARY DELIVERABLE: the measured first-fold (m = 1) replica argmaxes must reproduce ' +
      'the imp-3582/imp-3601 image 2 xi_Nyq - xi_true at every rung to < 1e-6, i.e. ' +
      '[1006.64, 2263.27, 4776.55, 9803.10] for xi_true = 250.',
    holds: () =>
      rungCells.every((c) => Math.abs(c.folds[0].measuredLoc - foldLoc(1, c.xiNyq, XI_TRUE)) < 1e-6) &&
      Math.abs(firstFoldLocs[0] - (2 * (200 * Math.PI) - 250)) < 1e-6 &&
      Math.abs(firstFoldLocs[3] - (2 * (1600 * Math.PI) - 250)) < 1e-6,
  },
  {
    id: 'imp3622-second-fold-images-match-4xiNyq-minus-xitrue',
    why: 'The measured second-fold (m = 2) replica argmaxes must reproduce the imp-3601 image ' +
      '4 xi_Nyq - xi_true at every rung to < 1e-6, i.e. [2263.27, 4776.55, 9803.10, 19856.19].',
    holds: () =>
      rungCells.every((c) => Math.abs(c.folds[1].measuredLoc - foldLoc(2, c.xiNyq, XI_TRUE)) < 1e-6) &&
      Math.abs(secondFoldLocs[0] - (4 * (200 * Math.PI) - 250)) < 1e-6,
  },
  {
    id: 'imp3622-first-fold-shifts-2xiNyq-per-doubling',
    why: 'THE DRIFT MEASUREMENT: the measured first-fold image must move exactly 2 xi_Nyq(N) per ' +
      'panel doubling (L_1(2N) - L_1(N) = 2 xi_Nyq(N)), confirming the imp-3601 2 m xi_Nyq per-' +
      'doubling law for m = 1.',
    holds: () => firstFoldShiftMatchesPrediction && firstFoldShiftPerDoubling.length === 3,
  },
  {
    id: 'imp3622-second-fold-shifts-4xiNyq-per-doubling',
    why: 'The measured second-fold image must move exactly 4 xi_Nyq(N) = 2 (2 xi_Nyq) per panel ' +
      'doubling, confirming the imp-3601 2 m xi_Nyq per-doubling law for m = 2.',
    holds: () => secondFoldShiftMatchesPrediction && secondFoldShiftPerDoubling.length === 3,
  },
  {
    id: 'imp3622-across-ladder-shifts-match-imp3601',
    why: 'The measured across-ladder (1200 -> 9600) replica shifts must match the imp-3601 contrasts ' +
      '~8796.46 (m = 1) and ~17592.92 (m = 2, exactly 2x the first fold), the numbers imp-3601 ' +
      'asserted from geometry.',
    holds: () =>
      Math.abs(firstFoldShiftAcrossLadder - 8796.459) < 1e-2 &&
      Math.abs(secondFoldShiftAcrossLadder - 17592.919) < 1e-2 &&
      secondFoldShiftIsTwiceFirst,
  },
  {
    id: 'imp3622-genuine-inband-argmax-pinned-drift-0',
    why: 'THE DISCRIMINATOR: the genuine planted feature must keep its in-band argmax pinned at ' +
      'xi_true = 250 at every rung (drift 0), the 0-drift half of the imp-3558 argmax-drift-0 ' +
      'signature the replica sweep contrasts against.',
    holds: () =>
      maxInBandDrift < 1e-9 && rungCells.every((c) => Math.abs(c.inBandArg - XI_TRUE) < 1e-9),
  },
  {
    id: 'imp3622-no-fold-lands-in-band-for-all-rungs',
    why: 'Both fold images must sit above the band ceiling xi_max = 400 for every N >= 1200 (smallest ' +
      'first-fold image ~1006.64 > 400), so NO aliasing fold lands in (0, 400] -- confirming the ' +
      'imp-3601 all-rungs-clear-every-fold certificate by measurement.',
    holds: () =>
      noFoldLandsInBand && rungCells.every((c) => c.folds.every((f) => f.measuredLoc > XI_MAX)),
  },
  {
    id: 'imp3622-verdict-planted-drift-confirms-imp3601',
    why: 'The classified verdict must be the planted-replica-drift-confirms split, not indeterminate; ' +
      'a flip means a measured image mislocated, a per-doubling shift broke, the in-band drift lifted ' +
      'off 0, or a fold folded into the band.',
    holds: () =>
      verdict ===
      'PLANTED-REPLICA-DRIFT-CONFIRMS-IMP3601-2mXINYQ-PER-DOUBLING-INBAND-DRIFT-0-NO-FOLD-INBAND-N>=1200',
  },
  {
    id: 'imp3622-honest-assessment-no-qed',
    why: 'Mandatory honesty: measures the imp-3601 asserted drift on a SYNTHETIC feature (not the ' +
      '|P1| objective) but NOT a closed form (equation transcendental), over the finite domain ' +
      '(0, 400], measures the ratio not positivity, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3622_PLANTED_REPLICA_ARGMAX_DRIFT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.confirmsAssertedDrift === 'string' &&
        typeof c.syntheticNotObjective === 'string' &&
        typeof c.finiteDomainStillFinite === 'string' &&
        typeof c.measuresRatioNotPositivity === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3622_PLANTED_REPLICA_ARGMAX_DRIFT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3622-planted-replica-argmax-drift assertion failed: ${assertion.id}`);
  }
}

export default IMP3622_PLANTED_REPLICA_ARGMAX_DRIFT;
