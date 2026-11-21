/**
 * imp-95047 - The 0.1399-row directed final-time-tail (hypothesis b) lane:
 * assessing how the tail of Theorem 4.5 differs in scope from the 0.14-row
 * final-time tail, what a directed proof would require, and what machinery it
 * shares with the reference 0.14 tail.
 * HONEST STATUS: ASSESSMENT ONLY (derives no bound, closes no gap, NO QED).
 *
 * CONTEXT. The imp-95012 frozen spec records ROW_01399_DECISION =
 * UNPARK-INDEPENDENT: Theorem 4.5 reaches Lambda <= 0.1399 with
 *   y* = 33/200 = 0.165,  t* = 10103/80000 = 0.1262875,
 * from TWO sharply delimited NEW hypotheses -- (a) the rectangular slab (4.4)
 * tracked in imp-95046, and (b) the DIRECTED FINAL-TIME TAIL tracked here:
 *   H_{t*}(x + iv) != 0  for  x >= X+1,  y* <= v <= sqrt(1 - 2 t*).
 * This module isolates hypothesis (b), pins the tail band to the frozen spec,
 * and characterizes its scope against the 0.14-row analog tail.
 *
 * THE 0.14-ROW ANALOG (the reference tail). The active 0.14 row (eq. 8) carries
 * the same tail geometry at its own final time: at row coordinates
 *   t0 = 24727519/200000000 = 0.123637595,  y0 = 1809/10000 = 0.1809,
 * the final-time tail is the semi-infinite horizontal slice
 *   H_{t0}(x + iv) != 0  for  x >= X+1,  y0 <= v <= sqrt(1 - 2 t0),
 * on the same landmark anchor X = 6000000185827. It is the more-developed
 * reference tail; whether either tail is certified beyond the Platt-Trudgian
 * Lambda <= 0.2 SOTA is OUTSIDE this assessment (neither is claimed as a project
 * fact below 0.2 here).
 *
 * HOW THE 0.1399 TAIL DIFFERS IN SCOPE (measured against the 0.14 tail).
 *   1. LATER final time. t* = 0.1262875 > t0 = 0.123637595 (by 0.002649905):
 *      the tail is evaluated at a later heat-flow time, so the flow constants
 *      that control the terminal slice change.
 *   2. LOWER band start. y* = 0.165 < y0 = 0.1809 (by 0.0159): the tail must
 *      hold non-vanishing DOWN to a lower height than the 0.14 tail ever
 *      covered -- new territory, not inherited.
 *   3. LOWER band top. sqrt(1 - 2 t*) = 0.864537449 < sqrt(1 - 2 t0) =
 *      0.867597147 (by 0.003059699), because the larger t* shrinks 1 - 2 t*.
 *   4. NET WIDER band. width 0.699537449 (0.1399) vs 0.686697147 (0.14): the
 *      lower start outweighs the lower top, so the 0.1399 band is wider by
 *      about 0.01284 -- the extra work sits at the bottom of the band.
 *   5. SAME real domain and anchor. Both are the semi-infinite x >= X+1 tail on
 *      the same X; the difference is purely the (t, y-lo, y-hi) parametrization.
 *   6. SHARED height verification, DIFFERENT initial ratio. Both initial
 *      conditions are covered by the SAME published zeta-zero verification
 *      (height exceeds X/2), but the ratios are NOT equal: (1 + y*)/2 =
 *      233/400 = 0.5825 for the 0.1399 row vs (1 + y0)/2 = 0.59045 for the 0.14
 *      row -- both exceed 1/2, so the same X/2 height covers both, but the tail
 *      does not inherit the 0.14 initial condition verbatim.
 *
 * WHAT A DIRECTED PROOF WOULD REQUIRE. "Directed" is the flow-direction (winding
 * / monotone) argument along increasing x, anchored at the seam x = X+1 that the
 * slab lane (imp-95046 short final join) hands over. A certification of
 * hypothesis (b) would have to close the items in TAIL_PROOF_REQUIREMENTS below:
 * a large-x asymptotic non-vanishing certificate for H_{t*} (the tail is
 * semi-infinite, so a finite sample cannot close it), a finite transition-region
 * certificate connecting the seam to the asymptotic regime, uniform-in-x control
 * across the whole band including the top edge v = sqrt(1 - 2 t*), and the seam
 * match to the slab lane join width. The frozen spec discharges none of these.
 *
 * WHAT MACHINERY IS SHARED WITH THE 0.14 TAIL. The de Bruijn-Newman heat flow
 * H_tau, the semi-infinite tail geometry x >= X+1, the anchor X, the final-time
 * slice architecture (non-vanishing on a horizontal tail up to sqrt(1 - 2 t)),
 * and the zeta-zero height verification are STRUCTURALLY the same; the 0.1399
 * tail is a RE-PARAMETRIZATION (t0, y0) -> (t*, y*) of the 0.14 tail. But the
 * sharing is structural, NOT automatic transfer: the lower band start y* < y0
 * extends control into a region the 0.14 tail never covered, and the later t*
 * moves the terminal-slice constants, so the tail needs its own certificate --
 * it is not inherited from the 0.14 tail. This module characterizes the lane and
 * names the sub-gap; it proves nothing new. Changes no bound; closes no gap;
 * NO QED; no refereed bound is changed.
 */

import { ROW_01399_DECISION, GATE2_ROW } from './imp-95012-gate2-frozen-spec.js';

// beta = sqrt(1 - 2 t): the final-time tail band top for each row, pinned to the
// frozen spec times so the arithmetic stays anchored.
const betaOf = (t) => Math.sqrt(1 - 2 * t);
const T_STAR = ROW_01399_DECISION.tStar.value; // 10103/80000 = 0.1262875
const Y_STAR = ROW_01399_DECISION.yStar.value; // 33/200 = 0.165
const T0 = GATE2_ROW.t0.value; // 0.123637595
const Y0 = GATE2_ROW.y0.value; // 0.1809
const BETA_STAR = betaOf(T_STAR); // 0.864537449
const BETA_0 = betaOf(T0); // 0.867597147

// ── the directed final-time tail (hypothesis b), made explicit ──────────────
// H_{t*}(x + iv) != 0 for x >= X+1, y* <= v <= sqrt(1 - 2 t*).
export const TAIL_HYPOTHESIS = Object.freeze({
  statement: 'H_{t*}(x + iv) != 0 for x >= X+1, y* <= v <= sqrt(1 - 2 t*)',
  xDomain: { lo: 'X+1', hi: '+inf', note: 'semi-infinite horizontal tail; X = GATE2_ROW.X' },
  vBand: { lo: Y_STAR, hi: BETA_STAR }, // [0.165, 0.864537449]
  finalTime: T_STAR, // 10103/80000 = 0.1262875
  X: GATE2_ROW.X,
  yStar: Y_STAR,
  betaStar: BETA_STAR,
  target: ROW_01399_DECISION.target.value, // t* + y*^2/2 = 0.1399
  initialRatio: (1 + Y_STAR) / 2, // 233/400 = 0.5825
  directed: true,
  presupposesOpenFamily: false,
});

// ── the 0.14-row analog tail (the reference tail) ───────────────────────────
export const TAIL_REFERENCE_014 = Object.freeze({
  statement: 'H_{t0}(x + iv) != 0 for x >= X+1, y0 <= v <= sqrt(1 - 2 t0)',
  vBand: { lo: Y0, hi: BETA_0 }, // [0.1809, 0.867597147]
  finalTime: T0, // 0.123637595
  yZero: Y0,
  beta0: BETA_0,
  initialRatio: (1 + Y0) / 2, // 0.59045
});

// ── how the 0.1399 tail differs in scope from the 0.14 tail (measured) ──────
export const TAIL_SCOPE_VS_014 = Object.freeze({
  laterFinalTime: { delta: T_STAR - T0, later: T_STAR > T0 }, // +0.002649905
  lowerBandStart: { delta: Y_STAR - Y0, lower: Y_STAR < Y0 }, // -0.0159
  lowerBandTop: { delta: BETA_STAR - BETA_0, lower: BETA_STAR < BETA_0 }, // -0.003059699
  netWiderBand: {
    width014: BETA_0 - Y0, // 0.686697147
    width01399: BETA_STAR - Y_STAR, // 0.699537449
    wider: BETA_STAR - Y_STAR > BETA_0 - Y0,
  },
  sameRealDomain: true, // both x >= X+1 on the same X
  sameHeightVerificationDifferentRatio: {
    ratio01399: (1 + Y_STAR) / 2, // 0.5825
    ratio014: (1 + Y0) / 2, // 0.59045
    bothExceedHalf: (1 + Y_STAR) / 2 > 0.5 && (1 + Y0) / 2 > 0.5,
    ratiosEqual: false,
  },
});

// ── what a directed proof of hypothesis (b) would have to close ─────────────
// None of these is discharged by the imp-95012 frozen spec; each is a residual.
export const TAIL_PROOF_REQUIREMENTS = Object.freeze([
  {
    key: 'large_x_asymptotic_certificate',
    what: 'a certified large-x non-vanishing statement for H_{t*} on the semi-infinite tail x >= X+1 (a finite sample cannot close a semi-infinite domain)',
    dischargedBySpec: false,
  },
  {
    key: 'finite_transition_region',
    what: 'a rigorous certificate on the finite transition interval connecting the seam x = X+1 to the large-x asymptotic regime',
    dischargedBySpec: false,
  },
  {
    key: 'uniform_band_control',
    what: 'uniform-in-x non-vanishing across the whole band y* <= v <= sqrt(1 - 2 t*) including the top edge v = sqrt(1 - 2 t*), at the later final time t*',
    dischargedBySpec: false,
  },
  {
    key: 'seam_match_to_slab_join',
    what: 'the directed (winding/monotone) argument anchored at the seam x = X+1, matched to the slab-lane short final join width of imp-95046',
    dischargedBySpec: false,
  },
]);

// ── machinery shared with the reference 0.14 tail (structural, not automatic) ─
export const SHARED_MACHINERY = Object.freeze([
  { key: 'heat_flow', what: 'the same de Bruijn-Newman heat flow H_tau (same carrier, same flow equation)', shared: true },
  { key: 'tail_geometry', what: 'the same semi-infinite tail geometry x >= X+1 on the same anchor X', shared: true },
  { key: 'final_time_slice', what: 'the same final-time-slice architecture: non-vanishing on a horizontal tail up to v = sqrt(1 - 2 t)', shared: true },
  { key: 'height_verification', what: 'the same published zeta-zero height verification (height exceeds X/2) for the initial condition', shared: true },
  {
    key: 'not_automatic_transfer',
    what: 'the lower band start y* < y0 extends control below the 0.14 tail band and the later t* moves the terminal-slice constants, so the tail needs its own certificate -- structural sharing, not inheritance',
    shared: false,
  },
]);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95047_DIRECTED_TAIL = Object.freeze({
  ticket: 'imp-95047',
  proofSection: 'S-frontier / Theorem 4.5 tail lane',
  source:
    'Permuting the Zeta Twin Ladder Section 4.10 (Theorem 4.5 hypothesis b); imp-95012 frozen spec ROW_01399_DECISION',
  disposition: 'INDEPENDENT-CONDITIONAL-TARGET',
  hypothesis: TAIL_HYPOTHESIS,
  reference014: TAIL_REFERENCE_014,
  scopeVs014: TAIL_SCOPE_VS_014,
  proofRequirements: TAIL_PROOF_REQUIREMENTS,
  sharedMachinery: SHARED_MACHINERY,
  independentOfOpenFamily: true,
  independentOfSlabLane: true, // the slab (hypothesis a) is tracked separately in imp-95046
  provesBound: false,
  isRigorous: false,
  namedSubGap: 'imp-95047-sub-directed-tail-nonvanishing-certificate',
  subGapStatement:
    'the directed final-time tail H_{t*} != 0 for x >= X+1, y* <= v <= sqrt(1 - 2 t*) is an exact standalone conditional target: it re-parametrizes the reference 0.14 tail (t0,y0) -> (t*,y*) to a LATER final time (t* > t0), a LOWER band start (y* < y0, new territory) and a slightly lower but net-wider band, sharing the heat flow, tail geometry, final-time-slice architecture and height verification with the 0.14 tail but NOT inheriting its certificate; closing it requires a large-x asymptotic non-vanishing statement, a finite transition-region certificate, uniform-in-x band control to the top edge, and a seam match to the slab-lane join -- the frozen spec discharges none, so the tail lane stays conditional and independent of the Gate-2 open family and the slab lane',
  verdict:
    'ASSESSMENT ONLY: the directed final-time tail (hypothesis b) is characterized ' +
    'as a standalone conditional target -- a semi-infinite slice H_{t*} != 0 for ' +
    'x >= X+1 across y* <= v <= sqrt(1 - 2 t*). Against the 0.14 reference tail it is ' +
    'a re-parametrization to a later final time (t* > t0), a lower band start (y* < y0) ' +
    'and a net-wider band, sharing the de Bruijn-Newman flow, tail geometry, final-time ' +
    'architecture and height verification but not the certificate. It is independent of ' +
    'the Gate-2 open family and of the slab lane, but none of the four proof requirements ' +
    'is discharged by the frozen spec, so it is a target, not a result. Changes no bound; ' +
    'closes no gap; NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ───────────
export const IMP95047_DIRECTED_TAIL_ASSERTIONS = [
  {
    id: 'imp95047-tail-target-hits-01399',
    description: 't* + y*^2/2 = 1399/10000 = 0.1399 exactly from the pinned tail coordinates',
    holds: () =>
      Math.abs(TAIL_HYPOTHESIS.finalTime + (TAIL_HYPOTHESIS.yStar ** 2) / 2 - 0.1399) < 1e-12 &&
      Math.abs(TAIL_HYPOTHESIS.target - 0.1399) < 1e-12,
  },
  {
    id: 'imp95047-later-final-time',
    description: 't* = 10103/80000 > t0 = 24727519/200000000 (later final time)',
    holds: () =>
      TAIL_SCOPE_VS_014.laterFinalTime.later === true &&
      Math.abs(TAIL_SCOPE_VS_014.laterFinalTime.delta - 0.002649905) < 1e-12,
  },
  {
    id: 'imp95047-lower-band-start',
    description: 'y* = 33/200 = 0.165 < y0 = 1809/10000 = 0.1809 (lower band start, new territory)',
    holds: () =>
      TAIL_SCOPE_VS_014.lowerBandStart.lower === true &&
      Math.abs(TAIL_SCOPE_VS_014.lowerBandStart.delta + 0.0159) < 1e-12,
  },
  {
    id: 'imp95047-lower-top-net-wider-band',
    description: 'band top sqrt(1-2t*) < sqrt(1-2t0) yet the net band is wider (lower start outweighs)',
    holds: () =>
      TAIL_SCOPE_VS_014.lowerBandTop.lower === true &&
      TAIL_SCOPE_VS_014.netWiderBand.wider === true &&
      TAIL_SCOPE_VS_014.netWiderBand.width01399 > TAIL_SCOPE_VS_014.netWiderBand.width014,
  },
  {
    id: 'imp95047-shared-height-different-ratio',
    description: 'same X/2 height verification but the two initial ratios differ (0.5825 vs 0.59045), both > 1/2',
    holds: () =>
      TAIL_SCOPE_VS_014.sameHeightVerificationDifferentRatio.bothExceedHalf === true &&
      TAIL_SCOPE_VS_014.sameHeightVerificationDifferentRatio.ratiosEqual === false &&
      Math.abs(TAIL_SCOPE_VS_014.sameHeightVerificationDifferentRatio.ratio01399 - 233 / 400) < 1e-15 &&
      Math.abs(TAIL_SCOPE_VS_014.sameHeightVerificationDifferentRatio.ratio014 - 0.59045) < 1e-12,
  },
  {
    id: 'imp95047-four-proof-requirements-open',
    description: 'every directed-proof requirement is still open (undischarged by the frozen spec)',
    holds: () =>
      TAIL_PROOF_REQUIREMENTS.length === 4 &&
      TAIL_PROOF_REQUIREMENTS.every((r) => r.dischargedBySpec === false),
  },
  {
    id: 'imp95047-shared-machinery-structural-not-automatic',
    description: 'four machinery items shared with the 0.14 tail, but transfer is not automatic',
    holds: () =>
      SHARED_MACHINERY.filter((m) => m.shared === true).length === 4 &&
      SHARED_MACHINERY.some((m) => m.key === 'not_automatic_transfer' && m.shared === false),
  },
  {
    id: 'imp95047-independent-conditional-no-qed',
    description: 'the tail lane is an independent conditional target: no bound, not rigorous, sub-gap named, no refereed bound is changed',
    holds: () =>
      IMP95047_DIRECTED_TAIL.independentOfOpenFamily === true &&
      IMP95047_DIRECTED_TAIL.independentOfSlabLane === true &&
      IMP95047_DIRECTED_TAIL.provesBound === false &&
      IMP95047_DIRECTED_TAIL.isRigorous === false &&
      TAIL_HYPOTHESIS.presupposesOpenFamily === false &&
      IMP95047_DIRECTED_TAIL.namedSubGap === 'imp-95047-sub-directed-tail-nonvanishing-certificate' &&
      /NO QED/.test(IMP95047_DIRECTED_TAIL.verdict) &&
      /refereed bound is changed/i.test(IMP95047_DIRECTED_TAIL.verdict),
  },
];

for (const a of IMP95047_DIRECTED_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95047-directed-final-time-tail assertion failed: ${a.id}`);
  }
}

export default IMP95047_DIRECTED_TAIL;
