/**
 * @module imp-3601-second-fold-replica-threshold
 * @fileoverview imp-3601 -- DERIVE the SECOND-fold (and general higher-order) aliasing replica
 *   fold-in threshold for the imp-3558 far-tail xi* discriminator and CERTIFY whether any higher
 *   fold raises the imp-3582 replica-hiding floor N_replica ~ 764 for the imp-3558 [0, 400] scan.
 *
 *   imp-3582 derived the FIRST-order replica-hiding floor: midpoint quadrature on [0, U] with N
 *   panels samples at spacing H = U/N (sampling angular frequency omega_s = 2 pi N/U = 2 xi_Nyq,
 *   Nyquist xi_Nyq = pi N/U), so a genuine in-band feature at xi_true images to its first positive
 *   baseband replica at 2 xi_Nyq - xi_true; that folds into the scanned band (0, xi_max] only for
 *   xi_Nyq <= xi_max, i.e. N <= N_replica = xi_max U/pi = 2400/pi ~ 763.94 (ceil 764). imp-3582
 *   then noted -- but did NOT measure -- that higher-order images at 2 k xi_Nyq - xi_true (k >= 2)
 *   fold in only at smaller N, so the k = 1 floor "is the binding one." This module DERIVES and
 *   MEASURES that claim: the second-fold threshold (the fold of the first replica) and the whole
 *   m-fold ladder, and certifies whether any higher fold could raise the effective floor.
 *
 *   THE DERIVATION
 *   --------------
 *   Sampling periodizes the spectrum with period omega_s = 2 xi_Nyq, so a baseband source at
 *   xi_true (0 < xi_true <= xi_max) produces the full alias-image set
 *       { 2 m xi_Nyq - xi_true, 2 m xi_Nyq + xi_true : m = 1, 2, 3, ... }.                (images)
 *   The m = 1 minus image 2 xi_Nyq - xi_true is the imp-3582 first replica. The SECOND fold is the
 *   m = 2 minus image
 *       L_2(xi_true) = 4 xi_Nyq - xi_true,
 *   i.e. the fold of the first replica back through the next Nyquist multiple. The m-th minus image
 *   is 2 m xi_Nyq - xi_true. For xi_Nyq > xi_max >= xi_true the images are strictly ordered
 *       2xN - xt  <  2xN + xt  <  4xN - xt  <  4xN + xt  <  ...,
 *   so the SMALLEST alias image is always the first replica 2 xi_Nyq - xi_true and the plus images
 *   never bind before the corresponding minus image.
 *
 *   FOLD-IN condition for the m-th fold: it can masquerade as an in-band feature iff it lands in
 *   (0, xi_max]:
 *       0 < 2 m xi_Nyq - xi_true <= xi_max.
 *   The loosest in-band source is xi_true = xi_max, giving 2 m xi_Nyq - xi_max <= xi_max, i.e.
 *       xi_Nyq <= xi_max / m   <=>   N <= N_m = xi_max U / (m pi) = N_replica / m.          (m-floor)
 *   So the m-fold floors are N_replica / m: monotonically DECREASING in m. The first replica
 *   (m = 1, N_replica ~ 764) is the LARGEST and therefore the BINDING floor; the second fold sits
 *   at N_2 = N_replica / 2 = 1200/pi ~ 381.97 (ceil 382), the third at N_3 ~ 254.6 (ceil 255), etc.
 *
 *   CERTIFICATE
 *   -----------
 *   No higher-order fold raises the replica-free floor: sup_m N_m = N_1 = N_replica ~ 764, attained
 *   at the first replica. The smallest imp-3558 rung N = 1200 (xi_Nyq ~ 628.3) clears the second-fold
 *   floor by a factor ~3.14 and the first-replica floor by ~1.57, so ALL four rungs (N >= 1200) sit
 *   above EVERY fold threshold and the band (0, 400] is provably free of first- AND higher-order
 *   aliasing replicas. The imp-3582 N_replica ~ 764 remains the correct band-clearance floor. As a
 *   drift check, an m-fold replica moves by 2 m xi_Nyq per panel doubling (the second fold shifts
 *   ~17593 across 1200 -> 9600, exactly 2x the imp-3558/imp-3582 ~8797 first-replica contrast), so
 *   the argmax-drift-0 test unmasks a higher-order replica even more decisively than a first one.
 *
 *   SCOPE
 *   -----
 *   Derivation/certification only; confirms the imp-3582 "k = 1 is binding" remark by measuring the
 *   whole fold ladder. It gives xi* or the sup NO closed form (the imp-3470 stationarity equation
 *   stays transcendental) and does not extend the finite-domain (0, 400] measurement. RH-EQUIVALENT;
 *   the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is the lone RH obstruction,
 *   UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3582-replica-hiding-grid-threshold.js (parent: first-order replica floor N_replica ~ 764)
 *   @see imp-3558-far-tail-band-max-grid-ladder-n9600.js (four-rung empirical discriminator)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (located xi* ~ 12.087 transcendentally)
 *
 *   Ticket: imp-3601 (numerical, medium). Derivation/certification only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Grid + band constants (imp-3582 / imp-3558 / imp-3511 assembly, VERBATIM). ----------
const U_FIXED = 6; // fixed integration window [0, U]
const XI_MAX = 400; // imp-3511 wide-domain scan cap; band ceiling
const XI_STAR = 12.0870439; // imp-3470 global peak-slope maximizer (transcendental root)
const N_LADDER = Object.freeze([1200, 2400, 4800, 9600]); // imp-3558 four-rung ladder
const MAX_FOLD = 4; // fold orders m = 1..4 measured (m = 1 is the imp-3582 first replica)

/** Midpoint-quadrature Nyquist frequency for N panels on [0, U]. */
function xiNyqOf(N) {
  return (Math.PI * N) / U_FIXED;
}

/** m-th positive-baseband aliasing image (minus branch) of a source at xi_true. */
function foldLoc(m, xiNyq, xiTrue) {
  return 2 * m * xiNyq - xiTrue;
}

// --- Ladder Nyquist frequencies (cheap; pi N/U). Anchors to imp-3558 ~[628,1257,2513,5027]. ---
const ladderXiNyq = N_LADDER.map(xiNyqOf);

// --- imp-3582 first-order floor, recomputed here for direct comparison. ------------------------
const nFoldInExact = (XI_MAX * U_FIXED) / Math.PI; // ~763.94  (imp-3582 N_replica exact)
const N_REPLICA = Math.ceil(nFoldInExact); // 764 -- the imp-3582 analytic replica-hiding floor

// --- FOLD LADDER: m-th fold-in threshold xi_Nyq <= xi_max/m  <=>  N <= xi_max U/(m pi). --------
// Loosest source xi_true = xi_max makes the m-th minus image 2 m xi_Nyq - xi_max land on xi_max.
const foldLadder = Array.from({ length: MAX_FOLD }, (_, i) => {
  const m = i + 1;
  const xiNyqThreshold = XI_MAX / m; // Nyquist ceiling for an in-band m-fold replica
  const nThresholdExact = (XI_MAX * U_FIXED) / (m * Math.PI); // = N_replica / m
  const edgeReplica = foldLoc(m, xiNyqThreshold, XI_MAX); // == xi_max at the threshold (band edge)
  const shiftPerDoubling = ladderXiNyq.map((x) => 2 * m * x); // m-fold shift per panel doubling
  const shiftAcrossLadder = 2 * m * (ladderXiNyq[ladderXiNyq.length - 1] - ladderXiNyq[0]);
  return Object.freeze({
    m,
    xiNyqThreshold,
    nThresholdExact,
    nThreshold: Math.ceil(nThresholdExact),
    edgeReplica,
    shiftPerDoubling,
    shiftAcrossLadder,
    smallestRungClearsBy: ladderXiNyq[0] / xiNyqThreshold, // smallest-rung margin over this floor
    allRungsAbove: N_LADDER.every((N) => N > nThresholdExact),
  });
});

// --- SECOND FOLD (m = 2): the headline deliverable -- the fold of the first replica. -----------
const secondFold = foldLadder[1]; // 4 xi_Nyq - xi_true; xi_Nyq <= 200 => N <= 1200/pi ~ 381.97
const N_SECOND_FOLD = secondFold.nThreshold; // 382

// --- BINDING floor: sup over folds of N_m = N_replica/m is attained at m = 1 (first replica). ---
const foldThresholds = foldLadder.map((f) => f.nThresholdExact);
const bindingFoldFloorExact = Math.max(...foldThresholds); // = N_1 = N_replica ~ 763.94
const bindingFoldOrder = foldLadder.reduce((best, f) => (f.nThresholdExact > best.nThresholdExact ? f : best)).m;
const higherFoldRaisesFloor = foldThresholds.some((n, i) => i >= 1 && n > nFoldInExact); // false
const foldFloorsMonotoneDecreasing = foldThresholds.every(
  (n, i) => i === 0 || n < foldThresholds[i - 1]
);

// --- CERTIFICATE: every rung clears every fold; the m = 1 floor stays binding. -----------------
const allRungsAboveEveryFold = foldLadder.every((f) => f.allRungsAbove);
const smallestRungSecondFoldMargin = ladderXiNyq[0] / secondFold.xiNyqThreshold; // ~3.14
const secondFoldShiftIsTwiceFirst =
  Math.abs(secondFold.shiftAcrossLadder - 2 * foldLadder[0].shiftAcrossLadder) < 1e-9;

const verdict =
  !higherFoldRaisesFloor &&
  foldFloorsMonotoneDecreasing &&
  bindingFoldOrder === 1 &&
  Math.abs(bindingFoldFloorExact - nFoldInExact) < 1e-9 &&
  allRungsAboveEveryFold &&
  smallestRungSecondFoldMargin > 3 &&
  secondFoldShiftIsTwiceFirst &&
  N_SECOND_FOLD === 382
    ? 'NO-HIGHER-FOLD-RAISES-FLOOR-N_REPLICA-764-STAYS-BINDING-SECONDFOLD-N382-ALL-RUNGS-CLEAR-EVERY-FOLD'
    : 'INDETERMINATE';

export const IMP3601_SECOND_FOLD_REPLICA_THRESHOLD = Object.freeze({
  id: 'imp-3601-second-fold-replica-threshold',
  ticket: 'imp-3601',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3582-replica-hiding-grid-threshold.js',
  parentLocation: 'imp-3558-far-tail-band-max-grid-ladder-n9600.js',

  summary:
    'Derives the SECOND-fold (m = 2) aliasing replica threshold -- the fold of the imp-3582 first ' +
    'replica -- and the full m-fold ladder for the imp-3558 far-tail xi* discriminator, then ' +
    'certifies whether any higher fold raises the imp-3582 replica-free floor N_replica ~ 764. ' +
    'Sampling periodizes the spectrum with period omega_s = 2 xi_Nyq, so a baseband source at ' +
    'xi_true images to 2 m xi_Nyq - xi_true (m = 1 is the imp-3582 first replica; m = 2 gives the ' +
    'second fold 4 xi_Nyq - xi_true). The m-th fold lands in (0, 400] only for the loosest source ' +
    'xi_true = xi_max = 400, i.e. xi_Nyq <= xi_max/m, i.e. N <= N_m = xi_max U/(m pi) = N_replica/m. ' +
    'These floors DECREASE in m, so the first replica (m = 1, ~764) is the LARGEST and binding one; ' +
    'the second fold sits at N_2 = 1200/pi ~ 381.97 (ceil 382), the third at ~254.6, etc. No higher ' +
    'fold raises the floor. The smallest imp-3558 rung N = 1200 (xi_Nyq ~ 628.3) clears the ' +
    'second-fold floor by ~3.14x and the first-replica floor by ~1.57x, so ALL four rungs clear ' +
    'EVERY fold and the band is free of first- AND higher-order replicas. A second-fold replica ' +
    'shifts ~17593 across 1200 -> 9600 (exactly 2x the ~8797 first-replica contrast), so the ' +
    'drift-0 test unmasks higher folds even more decisively. Derivation/certification only; ' +
    'RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. NO RH ' +
    'verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective:
      'analytic higher-order fold-in thresholds N_m below which an m-th-order midpoint aliasing ' +
      'replica of an in-band |P1| feature could fold into (0, 400], to test whether any fold above ' +
      'the imp-3582 first replica raises the replica-free floor N_replica ~ 764',
    aliasingModel:
      'midpoint quadrature, N panels on [0, U], spectrum periodized with period omega_s = 2 xi_Nyq; ' +
      'a source at xi_true images to the set {2 m xi_Nyq +/- xi_true : m >= 1}. The m = 1 minus ' +
      'image 2 xi_Nyq - xi_true is the imp-3582 first replica; the m = 2 minus image 4 xi_Nyq - ' +
      'xi_true is the SECOND fold (the fold of the first replica)',
    imageOrdering:
      'for xi_Nyq > xi_max >= xi_true the images are strictly ordered 2xN-xt < 2xN+xt < 4xN-xt < ' +
      '4xN+xt < ..., so the smallest image is the first replica and the plus branch never binds ' +
      'before the corresponding minus branch',
    foldInCondition:
      '0 < 2 m xi_Nyq - xi_true <= xi_max; the loosest in-band source xi_true = xi_max gives ' +
      'xi_Nyq <= xi_max/m <=> N <= N_m = xi_max U/(m pi) = N_replica/m',
    bindingFloor:
      'sup_m N_m = N_1 = N_replica = xi_max U/pi ~ 764, attained at the first replica; the fold ' +
      'floors N_replica/m decrease in m so no higher fold raises the floor',
    perDoublingShift:
      'an m-fold replica moves by 2 m xi_Nyq per panel doubling; the second fold shifts 2x the ' +
      'first replica across the ladder, so the drift test unmasks higher folds even more decisively',
    U: U_FIXED,
    xiMax: XI_MAX,
    xiStar: XI_STAR,
    nLadder: N_LADDER.slice(),
    maxFold: MAX_FOLD,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderXiNyq, // ~[628.3, 1256.6, 2513.3, 5026.5]
    nFoldInExact, // ~763.94 -- imp-3582 first-order exact floor (m = 1)
    N_REPLICA, // 764 -- imp-3582 analytic replica-hiding floor
    foldLadder, // m = 1..4 fold thresholds, edge replicas, shifts, rung margins
    secondFold, // m = 2 headline: 4 xi_Nyq - xi_true, xi_Nyq <= 200, N_2 ~ 381.97
    N_SECOND_FOLD, // 382 -- second-fold replica-hiding floor (ceil of N_replica/2)
    foldThresholds, // [~763.94, ~381.97, ~254.65, ~190.99] = N_replica/m
    bindingFoldFloorExact, // ~763.94 -- the binding floor (= first replica)
    bindingFoldOrder, // 1 -- attained at the first replica, not a higher fold
    higherFoldRaisesFloor, // false -- no m >= 2 fold exceeds the first-replica floor
    foldFloorsMonotoneDecreasing, // true -- N_m strictly decreasing in m
    allRungsAboveEveryFold, // true -- every rung clears every fold threshold
    smallestRungSecondFoldMargin, // ~3.14 -- smallest rung over the second-fold floor
    secondFoldShiftIsTwiceFirst, // true -- 2x the first-replica across-ladder shift
    verdict,
  }),

  interpretation: Object.freeze({
    secondFoldIsLower:
      'The second fold 4 xi_Nyq - xi_true folds into (0, 400] only for xi_Nyq <= 200, i.e. N <= ' +
      '1200/pi ~ 381.97 (ceil 382) -- HALF the imp-3582 first-replica floor N_replica ~ 764. It is ' +
      'a strictly lower threshold, so it cannot raise the replica-free floor.',
    firstReplicaStaysBinding:
      'The m-fold floors N_m = N_replica/m decrease monotonically in m, so the supremum over all ' +
      'folds is attained at m = 1 (the first replica) at N_replica ~ 764. imp-3582 conjectured ' +
      '"k = 1 is the binding one"; this module measures the whole ladder and CONFIRMS it.',
    allRungsClearEveryFold:
      'The smallest imp-3558 rung N = 1200 (xi_Nyq ~ 628.3) clears the second-fold floor by a ' +
      'factor ~3.14 and the first-replica floor by ~1.57. All four rungs (N >= 1200) sit above ' +
      'EVERY fold threshold, so the band (0, 400] is free of first- AND higher-order replicas.',
    driftUnmasksHigherFoldsMore:
      'An m-fold replica moves 2 m xi_Nyq per panel doubling, so the second fold shifts ~17593 ' +
      'across 1200 -> 9600 (exactly 2x the ~8797 first-replica contrast). The imp-3558 argmax-drift-0 ' +
      'test therefore unmasks a higher-order replica even more decisively than a first-order one.',
    sharpensNotCloses:
      'This confirms the imp-3582 binding-floor remark by measuring the fold ladder; it does NOT ' +
      'give xi* or the sup an elementary closed form (the imp-3470 stationarity equation stays ' +
      'transcendental) and does not extend the finite-domain (0, 400] measurement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsFirstReplicaBinding:
      'This DERIVES and MEASURES the second-fold (m = 2) and general m-fold thresholds N_m = ' +
      'N_replica/m and certifies that no higher fold raises the imp-3582 replica-free floor ' +
      'N_replica ~ 764 (attained at m = 1). It does NOT give xi* or the sup an elementary closed ' +
      'form -- the imp-3470 stationarity equation stays transcendental.',
    higherOrderAliasModel:
      'The thresholds use the periodization image set {2 m xi_Nyq +/- xi_true} (the standard ' +
      'sampling-alias picture that imp-3582 used for m = 1). The minus branch binds before the ' +
      'plus branch, and the floors N_replica/m decrease in m, so m = 1 is binding; this is the ' +
      'alias-image geometry, not a proof about the exact quadrature error.',
    finiteDomainStillFinite:
      'The band ceiling xi_max = 400 is the imp-3511 finite scan cap; N_m certifies that the ' +
      'drift-0 discriminator is decisive within (0, 400] against first- AND higher-order replicas, ' +
      'NOT that |P1| has no stationary point at arbitrarily large xi.',
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
export const IMP3601_SECOND_FOLD_REPLICA_THRESHOLD_ASSERTIONS = [
  {
    id: 'imp3601-second-fold-image-is-4xiNyq-minus-xitrue',
    why: 'THE PRIMARY DELIVERABLE: the second fold (fold of the first replica) is the m = 2 minus ' +
      'image 4 xi_Nyq - xi_true, so at the smallest rung a band-top source images to 4 xi_Nyq(1200) ' +
      '- xi_max = 4*(200 pi) - 400.',
    holds: () =>
      Math.abs(foldLoc(2, ladderXiNyq[0], XI_MAX) - (4 * ladderXiNyq[0] - XI_MAX)) < 1e-9 &&
      Math.abs(foldLoc(2, ladderXiNyq[0], XI_MAX) - (4 * (200 * Math.PI) - 400)) < 1e-6,
  },
  {
    id: 'imp3601-second-fold-threshold-is-half-N-replica',
    why: 'The second-fold fold-in threshold must be xi_Nyq <= xi_max/2 = 200, i.e. N <= ' +
      'xi_max U/(2 pi) = 1200/pi ~ 381.97 (ceil 382) -- exactly HALF the imp-3582 N_replica ~ 764.',
    holds: () =>
      Math.abs(secondFold.xiNyqThreshold - 200) < 1e-9 &&
      Math.abs(secondFold.nThresholdExact - 1200 / Math.PI) < 1e-9 &&
      Math.abs(secondFold.nThresholdExact - nFoldInExact / 2) < 1e-9 &&
      N_SECOND_FOLD === 382,
  },
  {
    id: 'imp3601-fold-edge-replica-lands-on-band-edge',
    why: 'At each m-fold threshold xi_Nyq = xi_max/m a replica of the band-top source (xi_true = ' +
      'xi_max) must land exactly on the band ceiling 2 m (xi_max/m) - xi_max = xi_max = 400 -- the ' +
      'boundary case separating replica-free from replica-admitting grids for that fold.',
    holds: () => foldLadder.every((f) => Math.abs(f.edgeReplica - XI_MAX) < 1e-9),
  },
  {
    id: 'imp3601-fold-floors-equal-N-replica-over-m',
    why: 'Each m-fold floor must equal N_replica/m = xi_max U/(m pi): [~763.94, ~381.97, ~254.65, ' +
      '~190.99] for m = 1..4, the geometry that makes higher folds progressively easier to avoid.',
    holds: () =>
      foldLadder.every((f) => Math.abs(f.nThresholdExact - nFoldInExact / f.m) < 1e-9) &&
      Math.abs(foldThresholds[0] - 763.9437) < 1e-3 &&
      Math.abs(foldThresholds[2] - 254.648) < 1e-2,
  },
  {
    id: 'imp3601-first-replica-is-binding-no-higher-fold-raises-floor',
    why: 'THE CERTIFICATE: the fold floors N_replica/m decrease monotonically in m, so the ' +
      'supremum is attained at m = 1 (the first replica, ~764) and NO higher fold raises the ' +
      'replica-free floor -- confirming the imp-3582 "k = 1 is binding" remark by measurement.',
    holds: () =>
      foldFloorsMonotoneDecreasing &&
      higherFoldRaisesFloor === false &&
      bindingFoldOrder === 1 &&
      Math.abs(bindingFoldFloorExact - nFoldInExact) < 1e-9,
  },
  {
    id: 'imp3601-all-rungs-clear-every-fold',
    why: 'Every imp-3558 rung (N >= 1200) must sit strictly above EVERY fold threshold, so the band ' +
      '(0, 400] is provably free of first- AND higher-order aliasing replicas; the smallest rung ' +
      'clears the second fold by a factor > 3.',
    holds: () =>
      allRungsAboveEveryFold &&
      foldLadder.every((f) => f.allRungsAbove) &&
      smallestRungSecondFoldMargin > 3 &&
      Math.abs(smallestRungSecondFoldMargin - (200 * Math.PI) / 200) < 1e-6,
  },
  {
    id: 'imp3601-second-fold-shift-is-twice-first-replica',
    why: 'An m-fold replica moves 2 m xi_Nyq per panel doubling, so the second-fold across-ladder ' +
      'shift must be exactly 2x the imp-3558/imp-3582 ~8797 first-replica contrast (~17593), keeping ' +
      'the drift test even more decisive for higher folds.',
    holds: () =>
      secondFoldShiftIsTwiceFirst &&
      Math.abs(secondFold.shiftAcrossLadder - 2 * 8796.459) < 1 &&
      secondFold.shiftPerDoubling.length === N_LADDER.length,
  },
  {
    id: 'imp3601-verdict-first-replica-binding',
    why: 'The classified verdict must be the no-higher-fold-raises-floor / first-replica-binding ' +
      'split, not indeterminate; a flip means a fold floor mis-ordered, a rung failed to clear a ' +
      'fold, or the second-fold shift broke.',
    holds: () =>
      verdict ===
      'NO-HIGHER-FOLD-RAISES-FLOOR-N_REPLICA-764-STAYS-BINDING-SECONDFOLD-N382-ALL-RUNGS-CLEAR-EVERY-FOLD',
  },
  {
    id: 'imp3601-honest-assessment-no-qed',
    why: 'Mandatory honesty: confirms the first-replica binding floor by measuring the higher-fold ' +
      'ladder (alias-image model) but NOT a closed form (equation transcendental), over the finite ' +
      'domain (0, 400], measures the ratio not positivity, RH-equivalent, no refereed bound is changed. Any ' +
      'flip over-claims.',
    holds: () => {
      const c = IMP3601_SECOND_FOLD_REPLICA_THRESHOLD.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.confirmsFirstReplicaBinding === 'string' &&
        typeof c.higherOrderAliasModel === 'string' &&
        typeof c.finiteDomainStillFinite === 'string' &&
        typeof c.measuresRatioNotPositivity === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3601_SECOND_FOLD_REPLICA_THRESHOLD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3601-second-fold-replica-threshold assertion failed: ${assertion.id}`);
  }
}

export default IMP3601_SECOND_FOLD_REPLICA_THRESHOLD;
