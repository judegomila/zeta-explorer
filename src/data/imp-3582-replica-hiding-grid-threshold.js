/**
 * @module imp-3582-replica-hiding-grid-threshold
 * @fileoverview imp-3582 -- DERIVE an analytic replica-hiding grid threshold N_replica for the
 *   imp-3558 far-tail xi* aliasing discriminator, hardening the imp-3511 no-missed-maximizer
 *   certificate with an analytic FLOOR under the empirical argmax-drift-0 contrast.
 *
 *   imp-3558 hardened the imp-3511 far-tail |P1| no-missed-maximizer bound to FOUR grid-invariant
 *   rungs (N = {1200, 2400, 4800, 9600}, xi_Nyq = pi N/U doubling 628 -> 5027 at U = 6), resting
 *   the discriminator on an EMPIRICAL contrast: a sub-threshold aliasing replica of the true peak
 *   would sit near 2 xi_Nyq - xi_true and MOVE ~2 (delta xi_Nyq) ~ 8797 across the widened ladder,
 *   whereas the genuine peaks keep a bit-fixed argmax (drift 0). That is a numerical contrast, NOT
 *   an analytic threshold: imp-3558 never derived the grid size below which a replica could still
 *   fold into the observation band and co-locate with a genuine peak, leaving the certificate
 *   without an analytic floor.
 *
 *   THE DERIVATION
 *   --------------
 *   Midpoint quadrature on [0, U] with N panels has sample spacing H = U/N and sampling angular
 *   frequency omega_s = 2 pi/H = 2 pi N/U = 2 xi_Nyq (Nyquist xi_Nyq = pi N/U). A genuine spectral
 *   feature at frequency xi_true produces its first positive-baseband aliasing REPLICA at
 *       L(xi_true) = omega_s - xi_true = 2 xi_Nyq - xi_true.
 *   The replica is OBSERVABLE (can masquerade as an in-band feature) only if it folds back into the
 *   scanned band (0, xi_max], xi_max = 400:
 *       0 < 2 xi_Nyq - xi_true <= xi_max.                                            (fold-in)
 *   For a fixed grid this admits an in-band replica of SOME in-band source iff the largest source
 *   frequency (the band ceiling xi_true = xi_max) still folds in: 2 xi_Nyq - xi_max <= xi_max, i.e.
 *       xi_Nyq <= xi_max   <=>   N <= N_replica = xi_max U / pi.
 *   With xi_max = 400, U = 6: N_replica = 2400/pi ~ 763.94 (take ceil -> 764). For N > N_replica the
 *   ENTIRE band (0, 400] is aliasing-replica-free: no first-order replica of any in-band feature can
 *   appear anywhere in the band, so the drift-0 observation is DECISIVE (there is nothing for a
 *   replica to hide behind). For N <= N_replica a replica can fold in, and -- since a replica moves
 *   by 2 xi_Nyq per doubling, thousands of grid steps, never staying within the argmax resolution
 *   dxi = 0.01 across two rungs -- the drift test would still unmask it, but the analytic floor
 *   below which one COULD co-locate with a genuine peak is what N_replica pins down.
 *
 *   Two refinements are recorded for context:
 *     - Co-location floor: to land within dxi of a genuine PEAK (largest genuine band argmax
 *       xi_peak_max ~ 320.01) rather than merely inside the band, the loosest grid is
 *       xi_Nyq = (xi_max + xi_peak_max)/2 -> N_colocate = (xi_max + xi_peak_max) U /(2 pi) ~ 688.
 *     - Main-maximizer floor: a replica of the global maximizer xi* ~ 12.087 (imp-3470) folds in
 *       only for xi_Nyq <= (xi_max + xi*)/2 -> N ~ 394, far below every rung.
 *
 *   CERTIFICATE
 *   -----------
 *   The smallest imp-3558 rung is N = 1200 (xi_Nyq ~ 628.3), a factor ~1.57 above N_replica ~ 764
 *   (equivalently xi_Nyq ~ 628.3 vs the fold-in ceiling xi_max = 400). ALL four rungs therefore sit
 *   strictly above N_replica, so the band is provably replica-free at every rung and the imp-3558
 *   argmax-drift-0 result is analytically DECISIVE, not merely an empirical contrast.
 *
 *   SCOPE
 *   -----
 *   Derivation/certification only, supplying the analytic floor the imp-3558 empirical discriminator
 *   lacked. It gives xi* or the sup NO closed form (the imp-3470 stationarity equation stays
 *   transcendental) and it does not extend the finite-domain measurement. RH-EQUIVALENT; the imp-3066
 *   off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH obstruction, UNTOUCHED. NO RH
 *   verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3558-far-tail-band-max-grid-ladder-n9600.js (parent: four-rung empirical discriminator)
 *   @see imp-3511-xistar-uniqueness-wide-range-robustness.js (tail bound + aliasing guard)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (located xi* ~ 12.087 transcendentally)
 *
 *   Ticket: imp-3582 (numerical, medium). Derivation/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Grid + band constants (imp-3558 / imp-3511 assembly, VERBATIM). ----------
const U_FIXED = 6; // fixed integration window [0, U]
const XI_MAX = 400; // imp-3511 wide-domain scan cap; band ceiling
const DXI = 0.01; // imp-3511 base xi step = measured argmax resolution
const XI_STAR = 12.0870439; // imp-3470 global peak-slope maximizer (transcendental root)
const XI_PEAK_MAX = 320.01; // imp-3558 largest genuine in-band band-argmax location
const N_LADDER = Object.freeze([1200, 2400, 4800, 9600]); // imp-3558 four-rung ladder

/** Midpoint-quadrature Nyquist frequency for N panels on [0, U]. */
function xiNyqOf(N) {
  return (Math.PI * N) / U_FIXED;
}

/** First positive-baseband aliasing replica location of a source at xi_true. */
function replicaLoc(xiNyq, xiTrue) {
  return 2 * xiNyq - xiTrue;
}

// --- Ladder Nyquist frequencies (cheap; pi N/U). Anchors to imp-3558 ~[628,1257,2513,5027]. ---
const ladderXiNyq = N_LADDER.map(xiNyqOf);

// --- FOLD-IN threshold: largest xi_Nyq admitting an in-band replica of ANY in-band source. -----
// 2 xi_Nyq - xi_true <= xi_max, loosest at xi_true = xi_max  =>  xi_Nyq <= xi_max.
const xiNyqFoldIn = XI_MAX;
const nFoldInExact = (XI_MAX * U_FIXED) / Math.PI; // ~763.94
const N_REPLICA = Math.ceil(nFoldInExact); // 764 -- the analytic replica-hiding floor

// Sanity: at xi_Nyq = xi_max a replica of the band-top source lands exactly on the band edge.
const foldInEdgeReplica = replicaLoc(xiNyqFoldIn, XI_MAX); // == xi_max = 400

// --- CO-LOCATION floor (inner): replica lands within dxi of the largest genuine peak. ----------
// 2 xi_Nyq - xi_true = xi_peak_max, loosest source xi_true = xi_max  =>  xi_Nyq = (xi_max+peak)/2.
const xiNyqColocate = (XI_MAX + XI_PEAK_MAX) / 2;
const nColocateExact = (xiNyqColocate * U_FIXED) / Math.PI; // ~687.6
const N_COLOCATE = Math.ceil(nColocateExact); // ~688

// --- MAIN-MAXIMIZER floor: a replica of xi* itself folds in only for xi_Nyq <= (xi_max+xi*)/2. --
const xiNyqStarFoldIn = (XI_MAX + XI_STAR) / 2; // ~206.04
const nStarFoldInExact = (xiNyqStarFoldIn * U_FIXED) / Math.PI; // ~393.5

// --- Replica per-doubling shift + across-ladder shift (recompute the imp-3558 ~8797 contrast). --
// A replica moves by 2 (delta xi_Nyq) = 2 xi_Nyq(N) per doubling; across 1200 -> 9600 that is
// 2 (xi_Nyq_last - xi_Nyq_first).
const replicaShiftPerDoubling = ladderXiNyq.map((x) => 2 * x); // per-rung doubling shift
const replicaShiftAcrossLadder = 2 * (ladderXiNyq[ladderXiNyq.length - 1] - ladderXiNyq[0]); // ~8797

// --- CERTIFICATE: every rung sits above the floor (band is replica-free at every rung). --------
const rungAboveThreshold = N_LADDER.map((N, i) => ({
  N,
  xiNyq: ladderXiNyq[i],
  aboveN: N > N_REPLICA,
  aboveXiNyq: ladderXiNyq[i] > xiNyqFoldIn,
  replicaFree: ladderXiNyq[i] > xiNyqFoldIn, // no first-order in-band replica possible
}));
const allRungsAboveThreshold = rungAboveThreshold.every((r) => r.aboveN && r.aboveXiNyq);
const smallestRungXiNyqMargin = ladderXiNyq[0] / xiNyqFoldIn; // ~1.571
const smallestRungNMargin = N_LADDER[0] / N_REPLICA; // ~1.571

const verdict =
  allRungsAboveThreshold &&
  N_REPLICA > 0 &&
  N_COLOCATE < N_REPLICA &&
  nStarFoldInExact < N_LADDER[0] &&
  smallestRungXiNyqMargin > 1.5 &&
  Math.abs(replicaShiftAcrossLadder - 8796.46) < 1
    ? 'IMP3558-DRIFT0-DISCRIMINATOR-HAS-ANALYTIC-FLOOR-N_REPLICA-764-ALL-FOUR-RUNGS-REPLICA-FREE-DECISIVE'
    : 'INDETERMINATE';

export const IMP3582_REPLICA_HIDING_GRID_THRESHOLD = Object.freeze({
  id: 'imp-3582-replica-hiding-grid-threshold',
  ticket: 'imp-3582',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3558-far-tail-band-max-grid-ladder-n9600.js',
  parentLocation: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',

  summary:
    'Derives an analytic replica-hiding grid threshold N_replica for the imp-3558 far-tail xi* ' +
    'aliasing discriminator, giving the imp-3511 no-missed-maximizer certificate an analytic floor ' +
    'under the empirical argmax-drift-0 contrast. Midpoint quadrature on [0, U] samples at spacing ' +
    'H = U/N (sampling frequency omega_s = 2 pi N/U = 2 xi_Nyq), so a genuine feature at xi_true ' +
    'produces its first positive-baseband replica at 2 xi_Nyq - xi_true. That replica folds back ' +
    'into the scanned band (0, 400] iff 2 xi_Nyq - xi_true <= 400; the loosest in-band source ' +
    '(xi_true = xi_max = 400) makes this possible only for xi_Nyq <= xi_max, i.e. N <= N_replica = ' +
    'xi_max U/pi = 2400/pi ~ 763.94 (ceil 764). For N > N_replica the whole band is replica-free, so ' +
    'the drift-0 result is analytically DECISIVE. Refinements: a replica lands within dxi of the ' +
    'largest genuine peak (~320.01) only for N <~ 688, and a replica of the maximizer xi* ~ 12.087 ' +
    'itself folds in only for N <~ 394. The smallest imp-3558 rung N = 1200 (xi_Nyq ~ 628.3) sits a ' +
    'factor ~1.57 above N_replica, so ALL FOUR rungs are replica-free and the imp-3558 argmax-drift-0 ' +
    'discriminator has an analytic floor, not just an empirical contrast (replica shift ~8797). ' +
    'Derivation/certification only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone ' +
    'obstruction, UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective:
      'analytic grid threshold N_replica below which a midpoint-quadrature aliasing replica of an ' +
      'in-band |P1| feature could fold into (0, 400] and co-locate with a genuine peak, so the ' +
      'imp-3558 argmax-drift-0 discriminator gains an a-priori floor',
    aliasingModel:
      'midpoint quadrature, N panels on [0, U], sample spacing H = U/N, sampling frequency ' +
      'omega_s = 2 pi/H = 2 pi N/U = 2 xi_Nyq; a source at xi_true images to 2 xi_Nyq - xi_true ' +
      '(the imp-3558 expectedReplicaLoc = 2 xi_Nyq - peakArg, VERBATIM)',
    foldInCondition:
      '0 < 2 xi_Nyq - xi_true <= xi_max; the loosest in-band source xi_true = xi_max gives ' +
      'xi_Nyq <= xi_max <=> N <= N_replica = xi_max U/pi',
    coLocationRefinement:
      'to land within the argmax resolution dxi of the largest genuine peak xi_peak_max, the ' +
      'loosest grid is xi_Nyq = (xi_max + xi_peak_max)/2 -> N_colocate = (xi_max+xi_peak_max) U/(2 pi)',
    mainMaximizerRefinement:
      'a replica of the global maximizer xi* itself folds in only for xi_Nyq <= (xi_max + xi*)/2',
    perDoublingShift:
      'a replica moves by 2 (delta xi_Nyq) = 2 xi_Nyq(N) per panel doubling (thousands of grid ' +
      'steps, never within dxi across two rungs), so the drift test unmasks any folded-in replica',
    U: U_FIXED,
    xiMax: XI_MAX,
    dxi: DXI,
    xiStar: XI_STAR,
    xiPeakMax: XI_PEAK_MAX,
    nLadder: N_LADDER.slice(),
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderXiNyq, // ~[628.3, 1256.6, 2513.3, 5026.5]
    xiNyqFoldIn, // 400 -- the fold-in Nyquist ceiling
    nFoldInExact, // ~763.94
    N_REPLICA, // 764 -- analytic replica-hiding floor (ceil of the fold-in N)
    foldInEdgeReplica, // == 400: a band-top replica lands on the band edge at the threshold
    xiNyqColocate, // ~360.005
    nColocateExact, // ~687.6
    N_COLOCATE, // ~688 -- inner co-location floor onto the largest genuine peak
    xiNyqStarFoldIn, // ~206.04
    nStarFoldInExact, // ~393.5 -- a replica of xi* folds in only below this
    replicaShiftPerDoubling, // per-rung 2 xi_Nyq doubling shift
    replicaShiftAcrossLadder, // ~8796.5 -- reproduces the imp-3558 ~8797 contrast
    rungAboveThreshold,
    allRungsAboveThreshold, // true -- every rung replica-free
    smallestRungXiNyqMargin, // ~1.571
    smallestRungNMargin, // ~1.571
    verdict,
  }),

  interpretation: Object.freeze({
    analyticFloorReplacesContrast:
      'imp-3558 read the argmax-drift-0 result against an empirical replica-shift contrast (~8797) ' +
      'but never derived the grid size at which a replica could still hide. N_replica = xi_max U/pi ' +
      '~ 764 is that floor: for N > N_replica the band (0, 400] is provably free of any first-order ' +
      'aliasing replica of an in-band feature, so the drift-0 observation is decisive by construction.',
    allRungsSitAboveFloor:
      'The smallest rung N = 1200 (xi_Nyq ~ 628.3) exceeds N_replica ~ 764 by a factor ~1.57 ' +
      '(xi_Nyq 628.3 vs the fold-in ceiling xi_max = 400). All four imp-3558 rungs are therefore ' +
      'replica-free; the drift-0 discriminator was never at risk of a hidden replica on this ladder.',
    twoInnerFloorsForContext:
      'Requiring the replica to land within dxi of a genuine PEAK (~320.01) tightens the floor to ' +
      'N ~ 688, and a replica of the maximizer xi* ~ 12.087 itself folds in only below N ~ 394 -- ' +
      'both far under the smallest rung, so no configuration of source/target could hide a replica.',
    sharpensNotCloses:
      'This supplies the analytic floor the imp-3558 discriminator lacked; it does NOT give xi* or ' +
      'the sup an elementary closed form (the imp-3470 stationarity equation stays transcendental), ' +
      'and it does not extend the finite-domain [0, 400] measurement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    hardensDiscriminatorNotClosedForm:
      'This DERIVES the analytic grid floor N_replica = xi_max U/pi ~ 764 below which a midpoint ' +
      'aliasing replica of an in-band feature could fold into (0, 400], hardening the imp-3558 ' +
      'argmax-drift-0 discriminator with an a-priori threshold. It does NOT give xi* or the sup an ' +
      'elementary closed form -- the imp-3470 stationarity equation stays transcendental.',
    firstOrderAliasModel:
      'The threshold uses the FIRST positive-baseband alias image L = 2 xi_Nyq - xi_true (the ' +
      'imp-3558 replica model). Higher-order images sit at 2 k xi_Nyq - xi_true for k >= 2 and fold ' +
      'in only at even smaller N, so the k = 1 floor is the binding one; the model is the standard ' +
      'sampling-alias picture, not a proof about the exact quadrature error.',
    finiteDomainStillFinite:
      'The band ceiling xi_max = 400 is the imp-3511 finite scan cap; N_replica certifies that the ' +
      'drift-0 discriminator is decisive within (0, 400], NOT that |P1| has no stationary point at ' +
      'arbitrarily large xi. It bounds the aliasing risk, it does not prove the tail structure.',
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
export const IMP3582_REPLICA_HIDING_GRID_THRESHOLD_ASSERTIONS = [
  {
    id: 'imp3582-n-replica-reproduces-ximax-U-over-pi',
    why: 'THE PRIMARY DELIVERABLE: the analytic replica-hiding floor must be N_replica = xi_max U/pi ' +
      '= 2400/pi ~ 763.94 (ceil 764), the largest N below which a first-order in-band replica of an ' +
      'in-band source can fold into (0, 400].',
    holds: () =>
      Math.abs(nFoldInExact - 2400 / Math.PI) < 1e-9 &&
      Math.abs(nFoldInExact - 763.9437) < 1e-3 &&
      N_REPLICA === 764,
  },
  {
    id: 'imp3582-fold-in-edge-replica-lands-on-band-edge',
    why: 'At the threshold xi_Nyq = xi_max a replica of the band-top source (xi_true = xi_max) must ' +
      'land exactly on the band ceiling 2 xi_Nyq - xi_max = xi_max = 400 -- the boundary case ' +
      'separating replica-free (N > N_replica) from replica-admitting grids.',
    holds: () => Math.abs(foldInEdgeReplica - XI_MAX) < 1e-9 && Math.abs(xiNyqFoldIn - 400) < 1e-9,
  },
  {
    id: 'imp3582-inner-colocation-floor-below-fold-in',
    why: 'The co-location floor (replica within dxi of the largest genuine peak ~320.01) must be a ' +
      'TIGHTER inner threshold N ~ 688 = (xi_max + xi_peak_max) U/(2 pi), strictly below the ' +
      'fold-in floor N_replica ~ 764.',
    holds: () =>
      Math.abs(nColocateExact - ((XI_MAX + XI_PEAK_MAX) * U_FIXED) / (2 * Math.PI)) < 1e-9 &&
      N_COLOCATE < N_REPLICA &&
      nColocateExact > 680 && nColocateExact < 695,
  },
  {
    id: 'imp3582-main-maximizer-replica-floor-below-smallest-rung',
    why: 'A replica of the global maximizer xi* ~ 12.087 itself folds in only for xi_Nyq <= ' +
      '(xi_max + xi*)/2 -> N ~ 393.5, which must sit far below the smallest imp-3558 rung N = 1200, ' +
      'so the maximizer can never be masqueraded by its own alias on this ladder.',
    holds: () => Math.abs(nStarFoldInExact - 393.5) < 1 && nStarFoldInExact < N_LADDER[0],
  },
  {
    id: 'imp3582-all-four-rungs-above-threshold-replica-free',
    why: 'THE CERTIFICATE: every imp-3558 rung must sit strictly above N_replica (and above the ' +
      'fold-in Nyquist ceiling xi_max), so the band (0, 400] is provably replica-free at all four ' +
      'rungs and the argmax-drift-0 result is analytically decisive.',
    holds: () =>
      allRungsAboveThreshold &&
      rungAboveThreshold.every((r) => r.replicaFree) &&
      ladderXiNyq[0] > XI_MAX,
  },
  {
    id: 'imp3582-smallest-rung-margin-above-1p5',
    why: 'The smallest rung N = 1200 (xi_Nyq ~ 628.3) must clear the floor with margin > 1.5 in both ' +
      'N and xi_Nyq (both ~1.571), so the certificate is not a boundary coincidence.',
    holds: () =>
      smallestRungXiNyqMargin > 1.5 &&
      smallestRungNMargin > 1.5 &&
      Math.abs(smallestRungXiNyqMargin - 628.3185 / 400) < 1e-2,
  },
  {
    id: 'imp3582-replica-shift-reproduces-imp3558-8797-contrast',
    why: 'The across-ladder replica shift 2 (xi_Nyq_last - xi_Nyq_first) must reproduce the imp-3558 ' +
      '~8797 discriminator contrast, anchoring this floor to the same aliasing model imp-3558 used.',
    holds: () =>
      Math.abs(replicaShiftAcrossLadder - 8796.46) < 1 &&
      replicaShiftPerDoubling.length === N_LADDER.length,
  },
  {
    id: 'imp3582-verdict-analytic-floor-decisive',
    why: 'The classified verdict must be the analytic-floor / all-rungs-replica-free split, not ' +
      'indeterminate; a flip means a rung failed to clear the floor, the shift contrast broke, or ' +
      'the inner floors mis-ordered.',
    holds: () =>
      verdict ===
      'IMP3558-DRIFT0-DISCRIMINATOR-HAS-ANALYTIC-FLOOR-N_REPLICA-764-ALL-FOUR-RUNGS-REPLICA-FREE-DECISIVE',
  },
  {
    id: 'imp3582-honest-assessment-no-qed',
    why: 'Mandatory honesty: derives an analytic aliasing FLOOR (first-order alias model) hardening ' +
      'the imp-3558 discriminator but NOT a closed form (equation transcendental), over the finite ' +
      'domain (0, 400], measures the ratio not positivity, RH-equivalent, no refereed bound is changed. Any ' +
      'flip over-claims.',
    holds: () => {
      const c = IMP3582_REPLICA_HIDING_GRID_THRESHOLD.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.hardensDiscriminatorNotClosedForm === 'string' &&
        typeof c.firstOrderAliasModel === 'string' &&
        typeof c.finiteDomainStillFinite === 'string' &&
        typeof c.measuresRatioNotPositivity === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3582_REPLICA_HIDING_GRID_THRESHOLD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3582-replica-hiding-grid-threshold assertion failed: ${assertion.id}`);
  }
}

export default IMP3582_REPLICA_HIDING_GRID_THRESHOLD;
