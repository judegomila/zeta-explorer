/**
 * @module imp-35474-dense-envelope-max-reverify-reference
 * @fileoverview imp-35474: INDEPENDENT verification of the imp-35412 R2 reason
 * that the RK4 dt/2 reference 1.1924935719e-3 is the TRUE MAX over the imp-35351
 * N=2000 dense-output worst-case flow envelope, and that the naive ~8.0e-6 slack
 * the ticket rebuts is a double-mis-selection.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35412's KEEP verdict rests on reason R2: within imp-35351's OWN dense-output
 * envelope the DP45 dt/2 interior crossing 1.1919828898e-3 is NOT the worst case,
 * and folding it with the RK4 dt and RK4 dt/2 endpoint crossings makes the
 * envelope MAX the RK4 dt/2 reference 1.1924935719e-3 (slack +7.506e-6). BUT
 * imp-35412's own assertions only check that the RK4 dt/2 max EXCEEDS the DP45
 * dt/2 crossing -- they never fold in ALL FOUR envelope members (they do not test
 * against the DP45 dt dense crossing 1.1923008536e-3 or the RK4 dt endpoint
 * crossing 1.1924488124e-3), so the "true max over the full envelope" selection
 * was never independently recomputed. This module fills exactly that gap.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * Independently re-folds the imp-35351 dense-output envelope from its FOUR members
 * pulled from their PRIMARY sources (NOT from imp-35412's derived
 * DENSE_ENVELOPE_MAX literal):
 *   - DP45 dt   dense crossing 1.1923008536e-3  (imp-35351 DENSE_REFERENCES)
 *   - DP45 dt/2 dense crossing 1.1919828898e-3  (imp-35351 DENSE_REFERENCES)
 *   - RK4  dt   endpoint crossing 1.1924488124e-3 (imp-35278, carried by imp-35351)
 *   - RK4  dt/2 endpoint crossing 1.1924935719e-3 (imp-35278, carried by imp-35351)
 * and recomputes the argmax, the max, the min, the per-member descending rank, and
 * the slack against the imp-857 map upper bracket t_c_hi = 1.2e-3.
 *
 * HONEST OUTCOME: THE R2 SELECTION IS CONFIRMED (FOR THE IMP-35351 ENVELOPE)
 * ------------------------------------------------------------------------
 * The independent fold reproduces the imp-35412 claim exactly:
 *   - descending rank: RK4 dt/2 (1.1924935719e-3) > RK4 dt (1.1924488124e-3) >
 *     DP45 dt (1.1923008536e-3) > DP45 dt/2 (1.1919828898e-3);
 *   - the true max IS the RK4 dt/2 reference 1.1924935719e-3, matching imp-35412's
 *     DENSE_ENVELOPE_MAX to full precision, with slack +7.5064281e-6;
 *   - the naive ticket figure ~8.0e-6 is a DOUBLE-MIS-SELECTION: it picks the DP45
 *     dt/2 dense crossing -- which is the envelope MINIMUM (rank 4 of 4), the WORST
 *     possible choice for a conservative one-sided UPPER slack -- and its inflation
 *     over the honest slack is EXACTLY the envelope span RK4 dt/2 - DP45 dt/2 =
 *     8.0171102e-6 - 7.5064281e-6 = 5.106821e-7.
 *
 * HONEST NUANCE -- THE MAX MEMBER IS ENVELOPE-DEFINITION-DEPENDENT
 * ---------------------------------------------------------------
 * The RK4-dt/2-is-the-max identity holds for the imp-35351 envelope AS DEFINED,
 * which folds the imp-35278 RK4 ENDPOINT crossings. If instead the imp-35416 RK4 +
 * cubic-Hermite DENSE crossings (dt 1.1923500033e-3, dt/2 1.1920364654e-3) are
 * substituted for the RK4 members, the argmax shifts to the RK4 dt Hermite value
 * 1.1923500033e-3. Either way the max still clears t_c_hi = 1.2e-3 with a positive
 * slack, so the CONSERVATISM conclusion (envelope well below the upper bracket) is
 * robust to the RK4 endpoint-vs-dense choice; only the member IDENTITY of the
 * argmax is definition-dependent. The imp-35412 claim is scoped to the imp-35351
 * envelope, and under that envelope RK4 dt/2 IS the max.
 *
 * SCOPE: VERIFICATION / ASSESSMENT ONLY. Confirms the imp-35412 R2 arithmetic
 * selection; the R2 predicate remains ONE-SIDED (imp-2528); adopts NO new slack
 * denominator (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case 1.1999384320e-3);
 * changes NO bound; does NOT advance the R2 ladder (certified at N=1000 per
 * imp-35221/imp-35324); does NOT extend the C_mb certificate; does NOT remove the
 * imp-486 GUE conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35412  R2 dense-envelope-max assessment being verified
 * @see imp-35351  DP45 dense-output envelope (source of the four members)
 * @see imp-35278  RK4 endpoint crossings carried into the envelope
 * @see imp-35416  RK4 + cubic-Hermite dense variant (definition-sensitivity cross-check)
 * @see imp-857    map upper bracket t_c_hi = 1.2e-3
 */

// -- imp-35351 dense-output envelope members, from their PRIMARY sources. ---------
// DP45 dense crossings: imp-35351 DENSE_REFERENCES (Hairer/Wanner CONTD5, 256 nodes).
const DP45_DT = 0.0011923008536;      // imp-35351 dense, dt = tauC_est/1000
const DP45_DTHALF = 0.0011919828898;  // imp-35351 dense, dt/2 within-step step-over
// RK4 endpoint crossings: imp-35278 signed-crossing, carried into imp-35351.
const RK4_DT = 0.0011924488124;       // imp-35278 RK4 dt endpoint
const RK4_DTHALF = 0.0011924935719;   // imp-35278 RK4 dt/2 endpoint (the R2 claimed max)

// imp-857 fixed-dt=1e-4 MAP upper bracket at N=2000 (one-sided upper target).
const T_C_HI = 1.2e-3;

// imp-35412's DERIVED literal, used ONLY as an equality cross-check target -- the
// independent fold below does NOT read it to compute the max.
const IMP35412_DENSE_ENVELOPE_MAX = 0.0011924935719;
const IMP35412_DENSE_ENVELOPE_SLACK = 7.5064281e-6; // T_C_HI - max (imp-35412 baked)
const IMP35412_NAIVE_SLACK = 8.0171102e-6;          // T_C_HI - DP45 dt/2 (the rebutted figure)

// -- Independent fold over the FOUR members. -------------------------------------
const MEMBERS = [
  { key: 'rk4-dt-half', integrator: 'rk4', dt: 'dt/2', event: 'endpoint', t_c: RK4_DTHALF, source: 'imp-35278' },
  { key: 'rk4-dt', integrator: 'rk4', dt: 'dt', event: 'endpoint', t_c: RK4_DT, source: 'imp-35278' },
  { key: 'dp45-dt', integrator: 'dp45', dt: 'dt', event: 'dense', t_c: DP45_DT, source: 'imp-35351' },
  { key: 'dp45-dt-half', integrator: 'dp45', dt: 'dt/2', event: 'dense', t_c: DP45_DTHALF, source: 'imp-35351' },
];

const SORTED_DESC = [...MEMBERS].sort((a, b) => b.t_c - a.t_c);
const ENV_MAX = Math.max(...MEMBERS.map((m) => m.t_c));
const ENV_MIN = Math.min(...MEMBERS.map((m) => m.t_c));
const ARGMAX = SORTED_DESC[0];
const ARGMIN = SORTED_DESC[SORTED_DESC.length - 1];

const ENV_SLACK = T_C_HI - ENV_MAX;          // honest conservative slack ~7.506e-6
const NAIVE_SLACK = T_C_HI - DP45_DTHALF;    // the rebutted ~8.017e-6
const SLACK_INFLATION = NAIVE_SLACK - ENV_SLACK;
const ENV_SPAN = ENV_MAX - ENV_MIN;          // must equal SLACK_INFLATION exactly

// Rank (1-based, descending) of the DP45 dt/2 crossing the naive figure picks.
const NAIVE_PICK_RANK = SORTED_DESC.findIndex((m) => m.key === 'dp45-dt-half') + 1;

// -- imp-35416 RK4 + cubic-Hermite DENSE variant (definition-sensitivity check). --
const RK4H_DT = 0.0011923500033;      // imp-35416 RK4-Hermite dense, dt
const RK4H_DTHALF = 0.0011920364654;  // imp-35416 RK4-Hermite dense, dt/2
const VARIANT_MAX = Math.max(RK4H_DT, RK4H_DTHALF, DP45_DT, DP45_DTHALF);
const VARIANT_ARGMAX_IS_RK4H_DT = VARIANT_MAX === RK4H_DT;

export const IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE = {
  id: 'imp-35474',
  title:
    'Independent verification that the RK4 dt/2 reference 1.1924935719e-3 is the ' +
    'true max over the imp-35351 N=2000 dense-output envelope (folding all four ' +
    'members from their primary sources) and that the naive ~8.0e-6 slack is a ' +
    'double-mis-selection of the envelope MINIMUM',
  kind: 'verification-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'r2-dense-envelope-max-selection-confirmed',

  members: MEMBERS,
  sortedDescending: SORTED_DESC.map((m) => ({ key: m.key, t_c: m.t_c })),
  fold: {
    max: ENV_MAX,
    min: ENV_MIN,
    argmaxKey: ARGMAX.key,
    argminKey: ARGMIN.key,
    tcHi: T_C_HI,
    envelopeSlack: ENV_SLACK,
    naiveSlack: NAIVE_SLACK,
    slackInflation: SLACK_INFLATION,
    envelopeSpan: ENV_SPAN,
    naivePickRank: NAIVE_PICK_RANK,
  },
  imp35412CrossCheck: {
    denseEnvelopeMax: IMP35412_DENSE_ENVELOPE_MAX,
    denseEnvelopeSlack: IMP35412_DENSE_ENVELOPE_SLACK,
    naiveSlack: IMP35412_NAIVE_SLACK,
    maxMatches: Math.abs(ENV_MAX - IMP35412_DENSE_ENVELOPE_MAX) < 1e-16,
  },
  definitionSensitivity: {
    rk4HermiteVariantMax: VARIANT_MAX,
    variantArgmaxIsRk4HermiteDt: VARIANT_ARGMAX_IS_RK4H_DT,
    variantClearsTcHi: VARIANT_MAX < T_C_HI,
    note:
      'Under the imp-35416 RK4 + cubic-Hermite DENSE crossings the argmax shifts ' +
      'from RK4 dt/2 to RK4 dt Hermite (1.1923500033e-3); the max still clears ' +
      't_c_hi, so the conservatism conclusion is robust while the argmax member ' +
      'identity is envelope-definition-dependent (RK4 endpoint vs dense).',
  },

  verdict: {
    r2SelectionConfirmed: true,
    argmaxIsRk4DtHalf: ARGMAX.key === 'rk4-dt-half',
    naivePickIsEnvelopeMin: ARGMIN.key === 'dp45-dt-half',
    interpretation:
      'Independently re-folding the imp-35351 envelope from its four members ' +
      '(imp-35278 RK4 dt/dt-half endpoint, imp-35351 DP45 dt/dt-half dense) ' +
      'reproduces the imp-35412 R2 selection: the true max is the RK4 dt/2 ' +
      'reference 1.1924935719e-3 (slack +7.5064281e-6), and the naive ~8.0e-6 ' +
      'figure picks the DP45 dt/2 dense crossing which is the envelope MINIMUM ' +
      '(rank 4 of 4) -- the worst choice for a conservative one-sided upper ' +
      'slack. The inflation of the naive slack over the honest slack equals the ' +
      'envelope span RK4 dt/2 - DP45 dt/2 = 5.106821e-7 exactly.',
    doesNotAchieve:
      'The R2 predicate stays one-sided (imp-2528); adopts NO new slack ' +
      'denominator (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case); does NOT ' +
      'advance the R2 ladder past N=1000; does NOT extend the C_mb certificate; ' +
      'does NOT remove the imp-486 GUE conditional; changes NO Lambda bound. ' +
      'No refereed bound is changed.',
  },
};

// -- Build-time assertions (import-light; only baked literals). -------------------
export const IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35474-independent-fold-max-is-rk4-dt-half',
    holds: () =>
      ARGMAX.key === 'rk4-dt-half' &&
      Math.abs(ENV_MAX - RK4_DTHALF) < 1e-16 &&
      Math.abs(ENV_MAX - 0.0011924935719) < 1e-13,
    why:
      'Independently folding the four imp-35351 envelope members (from imp-35278 ' +
      'RK4 endpoint and imp-35351 DP45 dense sources), the true max is the RK4 ' +
      'dt/2 reference 1.1924935719e-3, confirming the imp-35412 R2 selection.',
  },
  {
    id: 'imp35474-descending-rank-full-envelope',
    holds: () =>
      SORTED_DESC[0].key === 'rk4-dt-half' &&
      SORTED_DESC[1].key === 'rk4-dt' &&
      SORTED_DESC[2].key === 'dp45-dt' &&
      SORTED_DESC[3].key === 'dp45-dt-half' &&
      RK4_DTHALF > RK4_DT && RK4_DT > DP45_DT && DP45_DT > DP45_DTHALF,
    why:
      'The full four-member descending rank is RK4 dt/2 > RK4 dt > DP45 dt > DP45 ' +
      'dt/2 -- the DP45 dt dense and RK4 dt endpoint members imp-35412 never ' +
      'folded both sit strictly below the RK4 dt/2 max, so the max is unambiguous.',
  },
  {
    id: 'imp35474-naive-pick-is-envelope-minimum',
    holds: () =>
      ARGMIN.key === 'dp45-dt-half' &&
      NAIVE_PICK_RANK === 4 &&
      Math.abs(ENV_MIN - DP45_DTHALF) < 1e-16,
    why:
      'The naive ~8.0e-6 figure picks the DP45 dt/2 dense crossing, which is the ' +
      'envelope MINIMUM (rank 4 of 4) -- the single worst choice for a ' +
      'conservative one-sided UPPER slack; that is the first mis-selection.',
  },
  {
    id: 'imp35474-double-mis-selection-inflation-equals-span',
    holds: () =>
      Math.abs(ENV_SLACK - 7.5064281e-6) < 1e-13 &&
      Math.abs(NAIVE_SLACK - 8.0171102e-6) < 1e-13 &&
      Math.abs(SLACK_INFLATION - ENV_SPAN) < 1e-16 &&
      Math.abs(SLACK_INFLATION - 5.106821e-7) < 1e-13,
    why:
      'Honest envelope slack +7.5064281e-6 (max) vs naive +8.0171102e-6 (min); the ' +
      'naive inflation over the honest slack equals the envelope span RK4 dt/2 - ' +
      'DP45 dt/2 = 5.106821e-7 EXACTLY -- the double-mis-selection quantified.',
  },
  {
    id: 'imp35474-matches-imp35412-baked-max-and-slacks',
    holds: () =>
      Math.abs(ENV_MAX - IMP35412_DENSE_ENVELOPE_MAX) < 1e-16 &&
      Math.abs(ENV_SLACK - IMP35412_DENSE_ENVELOPE_SLACK) < 1e-12 &&
      Math.abs(NAIVE_SLACK - IMP35412_NAIVE_SLACK) < 1e-12,
    why:
      'The independent fold reproduces imp-35412 baked DENSE_ENVELOPE_MAX ' +
      '(1.1924935719e-3), denseEnvelopeSlack (+7.5064281e-6), and the naive ' +
      'figure (+8.0171102e-6) to full precision, so imp-35412 baked no ' +
      'transcription error.',
  },
  {
    id: 'imp35474-all-members-clear-tc-hi',
    holds: () =>
      MEMBERS.every((m) => m.t_c < T_C_HI) &&
      ENV_MAX < T_C_HI && ENV_SLACK > 0,
    why:
      'Every envelope member clears the imp-857 upper bracket t_c_hi=1.2e-3; the ' +
      'bound holds under the conservative max regardless of which member is ' +
      'picked -- the verification is about which slack to REPORT, not whether the ' +
      'rung clears (it does, provisionally).',
  },
  {
    id: 'imp35474-definition-sensitivity-robust-conservatism',
    holds: () =>
      VARIANT_ARGMAX_IS_RK4H_DT === true &&
      Math.abs(VARIANT_MAX - 0.0011923500033) < 1e-13 &&
      VARIANT_MAX < T_C_HI,
    why:
      'Under the imp-35416 RK4-Hermite DENSE variant the argmax shifts to RK4 dt ' +
      'Hermite (1.1923500033e-3) yet still clears t_c_hi -- the argmax member ' +
      'identity is envelope-definition-dependent while the conservatism ' +
      'conclusion is robust; the imp-35412 claim is scoped to the imp-35351 envelope.',
  },
  {
    id: 'imp35474-verification-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE.noQED === true &&
      IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE.changesNoBound === true &&
      IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE.verdict.r2SelectionConfirmed === true,
    why:
      'Verification only: confirms the imp-35412 R2 selection but adopts NO new ' +
      'slack denominator, advances NO ladder past N=1000, changes NO bound. C_mb ' +
      'stays GUE-conditional (imp-486); no refereed bound is changed. Never a QED.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`[imp-35474 dense-envelope-max reverify] FAILED: ${a.id}`);
  }
}
