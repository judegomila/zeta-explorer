/**
 * @module imp-35533-n2000-six-member-bs3-envelope-reference
 * @fileoverview imp-35533: fold the imp-35477 Bogacki-Shampine BS3 (order-3) dense
 * crossings into the imp-35474 N=2000 worst-case flow envelope, extending the
 * four-member DP45/RK4 fold to a SIX-member fold, and measure where the two BS3
 * members rank and whether they displace the RK4 dt/2 argmax or the DP45 dt/2
 * minimum.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35474 folded the imp-35351 N=2000 dense-output envelope from FOUR members --
 * the two RK4 endpoint crossings (imp-35278) and the two DP45 dense crossings
 * (imp-35351) -- and confirmed the descending rank RK4 dt/2 > RK4 dt > DP45 dt >
 * DP45 dt/2 with argmax RK4 dt/2 (1.1924935719e-3) and argmin DP45 dt/2
 * (1.1919828898e-3). imp-35477 later added a THIRD integrator family, the
 * Bogacki-Shampine BS3 (order-3, FSAL) + natural cubic-Hermite dense output, which
 * caught the SAME within-step crossing (step 1004 at dt, step 2007 at dt/2, pair
 * 1495) at t_c = 1.1923806919e-3 (dt) / 1.1921020374e-3 (dt/2), scheme-invariant to
 * ~1e-4 relative across integrator orders 3, 4, 5. But those two BS3 members were
 * never folded INTO the imp-35474 envelope rank: where they land among the four
 * existing members, and whether they push out the argmax or the min, was unrecorded.
 * This module fills exactly that measurement gap.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * Independently folds the SIX-member envelope from its PRIMARY sources:
 *   RK4  dt/2  endpoint 1.1924935719e-3  (imp-35278)
 *   RK4  dt    endpoint 1.1924488124e-3  (imp-35278)
 *   BS3  dt    dense    1.1923806919e-3  (imp-35477)
 *   DP45 dt    dense    1.1923008536e-3  (imp-35351)
 *   BS3  dt/2  dense    1.1921020374e-3  (imp-35477)
 *   DP45 dt/2  dense    1.1919828898e-3  (imp-35351)
 * It recomputes the full descending rank, argmax, argmin, max, min, span, and the
 * one-sided upper slack T_C_HI - max against the imp-857 map upper bracket
 * t_c_hi = 1.2e-3, then measures the 1-based rank the two BS3 members take and
 * compares the six-member argmax/argmin/max/min/slack/span to the four-member fold.
 *
 * HONEST OUTCOME -- BS3 MEMBERS ARE STRICTLY INTERIOR; ARGMAX AND MIN DO NOT MOVE
 * ------------------------------------------------------------------------------
 *   - Six-member descending rank: RK4 dt/2 (1.1924935719e-3) > RK4 dt
 *     (1.1924488124e-3) > BS3 dt (1.1923806919e-3) > DP45 dt (1.1923008536e-3) >
 *     BS3 dt/2 (1.1921020374e-3) > DP45 dt/2 (1.1919828898e-3).
 *   - The BS3 dt member inserts at RANK 3, strictly between RK4 dt (above, gap
 *     +6.81205e-8) and DP45 dt (below, gap +7.98383e-8). The BS3 dt/2 member
 *     inserts at RANK 5, strictly between DP45 dt (above, gap +1.988162e-7) and
 *     DP45 dt/2 (below, gap +1.191476e-7). Both BS3 members are strictly interior.
 *   - The argmax STAYS RK4 dt/2 (1.1924935719e-3) and the argmin STAYS DP45 dt/2
 *     (1.1919828898e-3): the BS3 members displace NEITHER. Consequently the max,
 *     min, span (5.106821e-7), and the one-sided slack (+7.5064281e-6) are
 *     IDENTICAL to the imp-35474 four-member fold -- folding BS3 in changes the
 *     rank membership but not the envelope extremes.
 *   - Both BS3 members clear t_c_hi = 1.2e-3 on their own (BS3 dt slack +7.6193081e-6,
 *     BS3 dt/2 slack +7.8979626e-6), consistent with the imp-35477 scheme-invariance
 *     finding, and both sit below the RK4 dt/2 argmax (margins +1.128800e-7 and
 *     +3.915345e-7), so the third integrator family reinforces rather than tightens
 *     the conservatism reading.
 *
 * SCOPE: MEASUREMENT / VERIFICATION ONLY. Adopts NO new slack denominator
 * (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case per imp-35412/imp-35455);
 * changes NO bound; does NOT advance the R2 ladder past N=1000 (imp-35221/
 * imp-35324); does NOT extend the C_mb certificate; does NOT remove the imp-486
 * GUE conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35474  four-member DP45/RK4 fold this module extends to six members
 * @see imp-35477  BS3 (order-3) dense crossings folded in here
 * @see imp-35351  DP45 dense-output crossings (shared DP45 members)
 * @see imp-35278  RK4 endpoint crossings (RK4 members)
 * @see imp-857    map upper bracket t_c_hi = 1.2e-3
 * @see imp-35412  R2 KEEP verdict that keeps the endpoint DP45 dt/2 worst-case
 */

import { IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE } from './imp-35474-dense-envelope-max-reverify-reference.js';

// -- DP45 dense members (imp-35351 DENSE_REFERENCES). -----------------------------
const DP45_DT = 0.0011923008536;      // imp-35351 dense, dt = tauC_est/1000
const DP45_DTHALF = 0.0011919828898;  // imp-35351 dense, dt/2 within-step step-over

// -- RK4 endpoint members (imp-35278). --------------------------------------------
const RK4_DT = 0.0011924488124;       // imp-35278 RK4 dt endpoint
const RK4_DTHALF = 0.0011924935719;   // imp-35278 RK4 dt/2 endpoint

// -- BS3 (order-3, FSAL) + cubic-Hermite dense members (imp-35477). ----------------
const BS3_DT = 0.0011923806919;       // imp-35477 BS3 dense, dt
const BS3_DTHALF = 0.0011921020374;   // imp-35477 BS3 dense, dt/2

// imp-857 fixed-dt=1e-4 MAP upper bracket at N=2000 (one-sided upper target).
const T_C_HI = 1.2e-3;

// -- Independent fold over an arbitrary member set. -------------------------------
function foldEnvelope(members) {
  const sorted = [...members].sort((a, b) => b.t_c - a.t_c);
  const max = sorted[0].t_c;
  const min = sorted[sorted.length - 1].t_c;
  return {
    sortedDescending: sorted.map((m) => ({ key: m.key, t_c: m.t_c })),
    max,
    min,
    argmaxKey: sorted[0].key,
    argminKey: sorted[sorted.length - 1].key,
    slack: T_C_HI - max, // one-sided upper slack against t_c_hi
    span: max - min,
  };
}

// Rank (1-based, descending) of a member key inside a folded envelope.
function rankOf(fold, key) {
  return fold.sortedDescending.findIndex((m) => m.key === key) + 1;
}

// The imp-35474 four-member envelope (RK4 endpoint + DP45 dense).
const FOUR_MEMBERS = [
  { key: 'rk4-dt-half', integrator: 'rk4', dt: 'dt/2', event: 'endpoint', t_c: RK4_DTHALF, source: 'imp-35278' },
  { key: 'rk4-dt', integrator: 'rk4', dt: 'dt', event: 'endpoint', t_c: RK4_DT, source: 'imp-35278' },
  { key: 'dp45-dt', integrator: 'dp45', dt: 'dt', event: 'dense', t_c: DP45_DT, source: 'imp-35351' },
  { key: 'dp45-dt-half', integrator: 'dp45', dt: 'dt/2', event: 'dense', t_c: DP45_DTHALF, source: 'imp-35351' },
];

// The imp-35477 BS3 members added on top.
const BS3_MEMBERS = [
  { key: 'bs3-dt', integrator: 'bs3', dt: 'dt', event: 'dense', t_c: BS3_DT, source: 'imp-35477' },
  { key: 'bs3-dt-half', integrator: 'bs3', dt: 'dt/2', event: 'dense', t_c: BS3_DTHALF, source: 'imp-35477' },
];

// The six-member envelope (four + BS3).
const SIX_MEMBERS = [...FOUR_MEMBERS, ...BS3_MEMBERS];

const FOUR = foldEnvelope(FOUR_MEMBERS); // imp-35474 baseline fold
const SIX = foldEnvelope(SIX_MEMBERS);   // this module: BS3 folded in

// -- Where the BS3 members land in the six-member fold. ---------------------------
const BS3_DT_RANK = rankOf(SIX, 'bs3-dt');            // 3 (interior)
const BS3_DTHALF_RANK = rankOf(SIX, 'bs3-dt-half');   // 5 (interior)

// -- Does folding BS3 in move the envelope extremes? ------------------------------
const ARGMAX_UNCHANGED = FOUR.argmaxKey === SIX.argmaxKey; // both rk4-dt-half
const ARGMIN_UNCHANGED = FOUR.argminKey === SIX.argminKey; // both dp45-dt-half
const MAX_DELTA = SIX.max - FOUR.max;   // 0 exactly
const MIN_DELTA = SIX.min - FOUR.min;   // 0 exactly
const SLACK_DELTA = SIX.slack - FOUR.slack; // 0 exactly

// -- BS3 members clear t_c_hi on their own; margins below the argmax. --------------
const BS3_DT_SLACK = T_C_HI - BS3_DT;               // +7.6193081e-6
const BS3_DTHALF_SLACK = T_C_HI - BS3_DTHALF;       // +7.8979626e-6
const BS3_DT_BELOW_ARGMAX = SIX.max - BS3_DT;       // +1.128800e-7
const BS3_DTHALF_BELOW_ARGMAX = SIX.max - BS3_DTHALF; // +3.915345e-7

export const IMP_35533_SIX_MEMBER_BS3_ENVELOPE_REFERENCE = {
  id: 'imp-35533',
  title:
    'Fold the imp-35477 BS3 (order-3) dense crossings into the imp-35474 N=2000 ' +
    'envelope: measure where BS3 dt and dt/2 rank among the DP45/RK4 members and ' +
    'whether they change the argmax or min',
  kind: 'measurement-verification-only',
  changesNoBound: true,
  adoptsNewSlackDenominator: false,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'bs3-members-strictly-interior-argmax-and-min-unchanged',

  tcHi: T_C_HI,
  fourMemberBaseline: {
    label: 'imp-35474 four-member fold (RK4 endpoint + DP45 dense)',
    members: FOUR_MEMBERS,
    ...FOUR,
  },
  sixMemberFold: {
    label: 'six-member fold (four + imp-35477 BS3 dense)',
    members: SIX_MEMBERS,
    ...SIX,
  },
  bs3Placement: {
    bs3DtRank: BS3_DT_RANK,               // 3
    bs3DtHalfRank: BS3_DTHALF_RANK,       // 5
    bs3DtSlack: BS3_DT_SLACK,             // +7.6193081e-6
    bs3DtHalfSlack: BS3_DTHALF_SLACK,     // +7.8979626e-6
    bs3DtBelowArgmax: BS3_DT_BELOW_ARGMAX,       // +1.128800e-7
    bs3DtHalfBelowArgmax: BS3_DTHALF_BELOW_ARGMAX, // +3.915345e-7
  },
  extremesUnchanged: {
    argmaxUnchanged: ARGMAX_UNCHANGED,    // true
    argminUnchanged: ARGMIN_UNCHANGED,    // true
    maxDelta: MAX_DELTA,                  // 0
    minDelta: MIN_DELTA,                  // 0
    slackDelta: SLACK_DELTA,              // 0
  },

  verdict: {
    argmaxKey: SIX.argmaxKey,   // rk4-dt-half
    argminKey: SIX.argminKey,   // dp45-dt-half
    bothBs3ClearTcHi: BS3_DT < T_C_HI && BS3_DTHALF < T_C_HI,
    interpretation:
      'Folding the imp-35477 BS3 (order-3) dense crossings into the imp-35474 ' +
      'four-member N=2000 envelope gives the six-member descending rank RK4 dt/2 > ' +
      'RK4 dt > BS3 dt > DP45 dt > BS3 dt/2 > DP45 dt/2. The BS3 dt member inserts ' +
      'at rank 3 (between RK4 dt and DP45 dt) and the BS3 dt/2 member at rank 5 ' +
      '(between DP45 dt and DP45 dt/2) -- both strictly interior. The argmax stays ' +
      'RK4 dt/2 (1.1924935719e-3) and the argmin stays DP45 dt/2 (1.1919828898e-3), ' +
      'so folding BS3 in leaves the max, min, span (5.106821e-7) and one-sided slack ' +
      '(+7.5064281e-6) identical to the four-member fold. Both BS3 members clear ' +
      't_c_hi=1.2e-3 on their own (slacks +7.6193081e-6 and +7.8979626e-6) and sit ' +
      'below the RK4 dt/2 argmax, so the third integrator family reinforces the ' +
      'conservatism reading without moving the envelope extremes.',
    doesNotAchieve:
      'Measurement only: adopts NO new slack denominator (imp-35412 KEEPS the ' +
      'endpoint DP45 dt/2 worst-case); does NOT advance the R2 ladder past N=1000; ' +
      'does NOT extend the C_mb certificate; does NOT remove the imp-486 GUE ' +
      'conditional; changes NO Lambda bound. No refereed bound is changed' +
      '. NO QED.',
  },
};

// -- Build-time assertions (import-light; only baked literals). -------------------
export const IMP_35533_SIX_MEMBER_BS3_ENVELOPE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35533-six-member-descending-rank',
    holds: () =>
      SIX.sortedDescending[0].key === 'rk4-dt-half' &&
      SIX.sortedDescending[1].key === 'rk4-dt' &&
      SIX.sortedDescending[2].key === 'bs3-dt' &&
      SIX.sortedDescending[3].key === 'dp45-dt' &&
      SIX.sortedDescending[4].key === 'bs3-dt-half' &&
      SIX.sortedDescending[5].key === 'dp45-dt-half',
    why:
      'The six-member envelope descending rank is RK4 dt/2 > RK4 dt > BS3 dt > ' +
      'DP45 dt > BS3 dt/2 > DP45 dt/2, folding the imp-35477 BS3 members into the ' +
      'imp-35474 four-member fold from their primary sources.',
  },
  {
    id: 'imp35533-bs3-members-strictly-interior',
    holds: () =>
      BS3_DT_RANK === 3 &&
      BS3_DTHALF_RANK === 5 &&
      BS3_DT < RK4_DT && BS3_DT > DP45_DT &&
      BS3_DTHALF < DP45_DT && BS3_DTHALF > DP45_DTHALF,
    why:
      'The BS3 dt member lands at rank 3 (strictly between RK4 dt above and DP45 ' +
      'dt below) and the BS3 dt/2 member at rank 5 (strictly between DP45 dt above ' +
      'and DP45 dt/2 below): both are strictly interior to the four-member envelope.',
  },
  {
    id: 'imp35533-argmax-and-min-unchanged',
    holds: () =>
      ARGMAX_UNCHANGED &&
      ARGMIN_UNCHANGED &&
      SIX.argmaxKey === 'rk4-dt-half' &&
      SIX.argminKey === 'dp45-dt-half' &&
      Math.abs(MAX_DELTA) < 1e-16 &&
      Math.abs(MIN_DELTA) < 1e-16,
    why:
      'Folding BS3 in leaves the argmax RK4 dt/2 and argmin DP45 dt/2 unchanged ' +
      '(max delta = min delta = 0 exactly): the BS3 members displace neither ' +
      'envelope extreme.',
  },
  {
    id: 'imp35533-slack-and-span-match-four-member',
    holds: () =>
      Math.abs(SLACK_DELTA) < 1e-16 &&
      Math.abs(SIX.slack - 7.5064281e-6) < 1e-13 &&
      Math.abs(SIX.span - 5.106821e-7) < 1e-13 &&
      Math.abs(SIX.span - FOUR.span) < 1e-16,
    why:
      'Because the extremes are unchanged, the six-member one-sided slack ' +
      '(+7.5064281e-6) and span (5.106821e-7) are identical to the imp-35474 ' +
      'four-member fold -- folding BS3 in changes rank membership, not extremes.',
  },
  {
    id: 'imp35533-bs3-members-clear-tc-hi-and-sit-below-argmax',
    holds: () =>
      BS3_DT < T_C_HI && BS3_DTHALF < T_C_HI &&
      Math.abs(BS3_DT_SLACK - 7.6193081e-6) < 1e-13 &&
      Math.abs(BS3_DTHALF_SLACK - 7.8979626e-6) < 1e-13 &&
      BS3_DT_BELOW_ARGMAX > 0 && BS3_DTHALF_BELOW_ARGMAX > 0,
    why:
      'Both BS3 members clear t_c_hi=1.2e-3 on their own (slacks +7.6193081e-6 and ' +
      '+7.8979626e-6) and sit strictly below the RK4 dt/2 argmax, consistent with ' +
      'the imp-35477 scheme-invariance finding.',
  },
  {
    id: 'imp35533-cross-module-consistency-with-imp35474',
    holds: () => {
      const liveFour = IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE.fold;
      return (
        liveFour.argmaxKey === FOUR.argmaxKey &&
        liveFour.argminKey === FOUR.argminKey &&
        Math.abs(liveFour.max - FOUR.max) < 1e-16 &&
        Math.abs(liveFour.min - FOUR.min) < 1e-16 &&
        Math.abs(liveFour.max - SIX.max) < 1e-16 &&
        Math.abs(liveFour.min - SIX.min) < 1e-16
      );
    },
    why:
      'This module derives its own FOUR-member baseline from duplicated raw ' +
      'literals rather than importing imp-35474 directly, so a future edit to ' +
      'the imp-35474 module could silently drift out of sync. This assertion ' +
      'imports imp-35474 LIVE and checks its actual exported argmax/argmin/max/ ' +
      'min still match both the locally recomputed FOUR baseline and the ' +
      'SIX-member fold above -- a genuine cross-module regression guard, not a ' +
      'self-check against the same hardcoded numbers.',
  },
  {
    id: 'imp35533-measurement-only-no-qed',
    holds: () =>
      IMP_35533_SIX_MEMBER_BS3_ENVELOPE_REFERENCE.noQED === true &&
      IMP_35533_SIX_MEMBER_BS3_ENVELOPE_REFERENCE.changesNoBound === true &&
      IMP_35533_SIX_MEMBER_BS3_ENVELOPE_REFERENCE.adoptsNewSlackDenominator === false,
    why:
      'Measurement only: adopts NO new slack denominator (imp-35412 keeps the ' +
      'endpoint DP45 dt/2 worst-case), advances NO ladder past N=1000, changes NO ' +
      'bound. C_mb stays GUE-conditional (imp-486); no refereed bound is changed. NO QED.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35533_SIX_MEMBER_BS3_ENVELOPE_REFERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`[imp-35533 six-member BS3 envelope] FAILED: ${a.id}`);
  }
}
