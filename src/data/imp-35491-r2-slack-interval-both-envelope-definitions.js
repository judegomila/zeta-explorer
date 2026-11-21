/**
 * @module imp-35491-r2-slack-interval-both-envelope-definitions
 * @fileoverview imp-35491: report the imp-35412 R2 dense-envelope slack (against the
 * imp-857 map upper bracket t_c_hi = 1.2e-3) as an INTERVAL across BOTH envelope
 * definitions that imp-35474 flagged as producing different argmax MEMBERS.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35474 confirmed the imp-35412 R2 max is the RK4 dt/2 endpoint reference
 * 1.1924935719e-3 for the imp-35351 envelope AS DEFINED, but noted the argmax
 * MEMBER is envelope-definition-dependent: substituting the imp-35416 RK4 +
 * cubic-Hermite DENSE crossings for the RK4 members shifts the argmax to the RK4
 * dt Hermite value 1.1923500033e-3. imp-35474 recorded that the dense variant
 * still clears t_c_hi but never TABULATED the two slacks side by side, nor the
 * interval they span. This module fills exactly that gap: it folds both envelope
 * definitions, recomputes the full descending rank + slack under each, and reports
 * the slack as an interval [def-min, def-max], confirming the CONSERVATISM
 * conclusion (max clears t_c_hi) is robust to the envelope-definition choice.
 *
 * THE TWO ENVELOPE DEFINITIONS (each folds the SAME DP45 dense pair) --------------
 *   Definition A = imp-35351 envelope AS DEFINED (RK4 members are imp-35278 ENDPOINT
 *     crossings): {RK4 dt/2 endpoint 1.1924935719e-3, RK4 dt endpoint 1.1924488124e-3,
 *     DP45 dt dense 1.1923008536e-3, DP45 dt/2 dense 1.1919828898e-3}.
 *   Definition B = imp-35416 variant (RK4 members are RK4 + cubic-Hermite DENSE
 *     crossings): {RK4h dt dense 1.1923500033e-3, DP45 dt dense 1.1923008536e-3,
 *     RK4h dt/2 dense 1.1920364654e-3, DP45 dt/2 dense 1.1919828898e-3}.
 *
 * HONEST OUTCOME: THE SLACK IS A NARROW POSITIVE INTERVAL, CONSERVATISM ROBUST -----
 *   Definition A descending rank: RK4 dt/2 > RK4 dt > DP45 dt > DP45 dt/2, so
 *     max_A = 1.1924935719e-3 and slack_A = t_c_hi - max_A = +7.5064281e-6.
 *   Definition B descending rank: RK4h dt > DP45 dt > RK4h dt/2 > DP45 dt/2, so
 *     max_B = 1.1923500033e-3 and slack_B = t_c_hi - max_B = +7.6499967e-6.
 *   The endpoint definition A has the LARGER max (its RK4 endpoint crossings sit
 *   above the dense ones), hence the SMALLER slack; so the interval is
 *     [def-min, def-max] = [slack_A, slack_B] = [+7.5064281e-6, +7.6499967e-6],
 *   width = slack_B - slack_A = 1.435686e-7 = max_A - max_B EXACTLY (the DP45
 *   members are shared, so the interval width is the RK4-endpoint-minus-RK4-dense
 *   gap at the dt/2 vs dt argmax). BOTH endpoints are strictly positive and BOTH
 *   maxima clear t_c_hi = 1.2e-3, so the conservatism conclusion is robust to the
 *   envelope-definition choice imp-35474 flagged -- only the argmax MEMBER identity
 *   (RK4 dt/2 endpoint vs RK4 dt dense) flips between the definitions.
 *
 * SCOPE: MEASUREMENT ONLY. Adopts NO new slack denominator (imp-35412 KEEPS the
 * endpoint DP45 dt/2 worst-case 1.1999384320e-3); changes NO bound; does NOT
 * advance the R2 ladder past N=1000 (certified per imp-35221/imp-35324); does NOT
 * extend the C_mb certificate; does NOT remove the imp-486 GUE conditional.
 * No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35412  R2 dense-envelope-max assessment (KEEPS the endpoint worst-case)
 * @see imp-35474  flags the argmax member is envelope-definition-dependent
 * @see imp-35351  DP45 dense-output envelope (definition A source)
 * @see imp-35278  RK4 endpoint crossings (definition A RK4 members)
 * @see imp-35416  RK4 + cubic-Hermite dense crossings (definition B RK4 members)
 * @see imp-857    map upper bracket t_c_hi = 1.2e-3
 */

// -- Shared DP45 dense members (imp-35351 DENSE_REFERENCES, in BOTH definitions). --
const DP45_DT = 0.0011923008536;      // imp-35351 dense, dt = tauC_est/1000
const DP45_DTHALF = 0.0011919828898;  // imp-35351 dense, dt/2 within-step step-over

// -- Definition A RK4 members: imp-35278 ENDPOINT crossings (imp-35351 as defined). -
const RK4_DT = 0.0011924488124;       // imp-35278 RK4 dt endpoint
const RK4_DTHALF = 0.0011924935719;   // imp-35278 RK4 dt/2 endpoint (the R2 max)

// -- Definition B RK4 members: imp-35416 RK4 + cubic-Hermite DENSE crossings. -------
const RK4H_DT = 0.0011923500033;      // imp-35416 RK4-Hermite dense, dt
const RK4H_DTHALF = 0.0011920364654;  // imp-35416 RK4-Hermite dense, dt/2

// imp-857 fixed-dt=1e-4 MAP upper bracket at N=2000 (one-sided upper target).
const T_C_HI = 1.2e-3;

function foldEnvelope(members) {
  const sorted = [...members].sort((a, b) => b.t_c - a.t_c);
  const max = Math.max(...members.map((m) => m.t_c));
  const min = Math.min(...members.map((m) => m.t_c));
  return {
    sortedDescending: sorted.map((m) => ({ key: m.key, t_c: m.t_c })),
    max,
    min,
    argmaxKey: sorted[0].key,
    slack: T_C_HI - max,
    clearsTcHi: max < T_C_HI,
  };
}

// -- Definition A: imp-35351 envelope AS DEFINED (RK4 ENDPOINT members). -----------
const DEF_A_MEMBERS = [
  { key: 'rk4-dt-half-endpoint', t_c: RK4_DTHALF, source: 'imp-35278' },
  { key: 'rk4-dt-endpoint', t_c: RK4_DT, source: 'imp-35278' },
  { key: 'dp45-dt-dense', t_c: DP45_DT, source: 'imp-35351' },
  { key: 'dp45-dt-half-dense', t_c: DP45_DTHALF, source: 'imp-35351' },
];
const DEF_A = foldEnvelope(DEF_A_MEMBERS);

// -- Definition B: imp-35416 variant (RK4 + cubic-Hermite DENSE members). ----------
const DEF_B_MEMBERS = [
  { key: 'rk4h-dt-dense', t_c: RK4H_DT, source: 'imp-35416' },
  { key: 'dp45-dt-dense', t_c: DP45_DT, source: 'imp-35351' },
  { key: 'rk4h-dt-half-dense', t_c: RK4H_DTHALF, source: 'imp-35416' },
  { key: 'dp45-dt-half-dense', t_c: DP45_DTHALF, source: 'imp-35351' },
];
const DEF_B = foldEnvelope(DEF_B_MEMBERS);

// -- Slack interval across the two definitions. -----------------------------------
const SLACK_INTERVAL_MIN = Math.min(DEF_A.slack, DEF_B.slack); // def-min (larger max)
const SLACK_INTERVAL_MAX = Math.max(DEF_A.slack, DEF_B.slack); // def-max (smaller max)
const SLACK_INTERVAL_WIDTH = SLACK_INTERVAL_MAX - SLACK_INTERVAL_MIN;
const ARGMAX_GAP = DEF_A.max - DEF_B.max; // must equal the interval width exactly
const BOTH_CLEAR = DEF_A.clearsTcHi && DEF_B.clearsTcHi;
const BOTH_SLACKS_POSITIVE = DEF_A.slack > 0 && DEF_B.slack > 0;

export const IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS = {
  id: 'imp-35491',
  title:
    'Report the imp-35412 R2 dense-envelope slack as an INTERVAL under both ' +
    'envelope definitions (imp-35351 RK4 endpoint members vs imp-35416 RK4 + ' +
    'cubic-Hermite dense members) and confirm the conservatism conclusion (max ' +
    'clears t_c_hi = 1.2e-3) is robust to the envelope-definition choice imp-35474 flagged',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'slack-is-narrow-positive-interval-conservatism-robust',

  tcHi: T_C_HI,
  definitionA: {
    label: 'imp-35351 envelope AS DEFINED (RK4 endpoint members)',
    members: DEF_A_MEMBERS,
    ...DEF_A,
  },
  definitionB: {
    label: 'imp-35416 variant (RK4 + cubic-Hermite dense members)',
    members: DEF_B_MEMBERS,
    ...DEF_B,
  },
  slackInterval: {
    min: SLACK_INTERVAL_MIN,          // +7.5064281e-6 (definition A, larger max)
    max: SLACK_INTERVAL_MAX,          // +7.6499967e-6 (definition B, smaller max)
    width: SLACK_INTERVAL_WIDTH,      // 1.435686e-7
    minFromDefinition: DEF_A.slack <= DEF_B.slack ? 'A' : 'B',
    maxFromDefinition: DEF_A.slack >= DEF_B.slack ? 'A' : 'B',
    argmaxGap: ARGMAX_GAP,            // DEF_A.max - DEF_B.max, equals width exactly
    bothEndpointsPositive: BOTH_SLACKS_POSITIVE,
    bothMaximaClearTcHi: BOTH_CLEAR,
  },

  verdict: {
    conservatismRobustToDefinition: BOTH_CLEAR && BOTH_SLACKS_POSITIVE,
    argmaxMemberDefinitionDependent:
      DEF_A.argmaxKey !== DEF_B.argmaxKey,
    interpretation:
      'Folding both envelope definitions against t_c_hi = 1.2e-3: definition A ' +
      '(imp-35351 RK4 endpoint members) has argmax RK4 dt/2 endpoint ' +
      '1.1924935719e-3 (slack +7.5064281e-6); definition B (imp-35416 RK4 + ' +
      'cubic-Hermite dense members) has argmax RK4 dt dense 1.1923500033e-3 ' +
      '(slack +7.6499967e-6). The slack is the narrow positive interval ' +
      '[+7.5064281e-6, +7.6499967e-6], width 1.435686e-7 = the RK4 ' +
      'endpoint-minus-dense argmax gap exactly (the DP45 members are shared). ' +
      'Both maxima clear t_c_hi and both slacks are positive, so the ' +
      'conservatism conclusion is robust to the envelope-definition choice ' +
      'imp-35474 flagged; only the argmax MEMBER identity flips.',
    doesNotAchieve:
      'Adopts NO new slack denominator (imp-35412 KEEPS the endpoint DP45 dt/2 ' +
      'worst-case); does NOT advance the R2 ladder past N=1000; does NOT extend ' +
      'the C_mb certificate; does NOT remove the imp-486 GUE conditional; changes ' +
      'NO Lambda bound. No refereed bound is changed.',
  },
};

// -- Build-time assertions (import-light; only baked literals). -------------------
export const IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS_ASSERTIONS = [
  {
    id: 'imp35491-definition-A-rank-and-slack',
    holds: () =>
      DEF_A.sortedDescending[0].key === 'rk4-dt-half-endpoint' &&
      DEF_A.sortedDescending[1].key === 'rk4-dt-endpoint' &&
      DEF_A.sortedDescending[2].key === 'dp45-dt-dense' &&
      DEF_A.sortedDescending[3].key === 'dp45-dt-half-dense' &&
      Math.abs(DEF_A.max - RK4_DTHALF) < 1e-16 &&
      Math.abs(DEF_A.slack - 7.5064281e-6) < 1e-13,
    why:
      'Definition A (imp-35351 RK4 endpoint members) descending rank is RK4 dt/2 > ' +
      'RK4 dt > DP45 dt > DP45 dt/2; the max is the RK4 dt/2 endpoint reference ' +
      '1.1924935719e-3 and the slack against t_c_hi=1.2e-3 is +7.5064281e-6, ' +
      'matching the imp-35412/imp-35474 baked figure.',
  },
  {
    id: 'imp35491-definition-B-rank-and-slack',
    holds: () =>
      DEF_B.sortedDescending[0].key === 'rk4h-dt-dense' &&
      DEF_B.sortedDescending[1].key === 'dp45-dt-dense' &&
      DEF_B.sortedDescending[2].key === 'rk4h-dt-half-dense' &&
      DEF_B.sortedDescending[3].key === 'dp45-dt-half-dense' &&
      Math.abs(DEF_B.max - RK4H_DT) < 1e-16 &&
      Math.abs(DEF_B.slack - 7.6499967e-6) < 1e-13,
    why:
      'Definition B (imp-35416 RK4 + cubic-Hermite dense members) descending rank ' +
      'is RK4h dt > DP45 dt > RK4h dt/2 > DP45 dt/2; the max is the RK4 dt dense ' +
      'value 1.1923500033e-3 (the imp-35474-flagged argmax shift) and the slack is ' +
      '+7.6499967e-6.',
  },
  {
    id: 'imp35491-slack-interval-and-width-equals-argmax-gap',
    holds: () =>
      Math.abs(SLACK_INTERVAL_MIN - 7.5064281e-6) < 1e-13 &&
      Math.abs(SLACK_INTERVAL_MAX - 7.6499967e-6) < 1e-13 &&
      Math.abs(SLACK_INTERVAL_WIDTH - 1.435686e-7) < 1e-13 &&
      Math.abs(SLACK_INTERVAL_WIDTH - ARGMAX_GAP) < 1e-16 &&
      SLACK_INTERVAL_MIN === DEF_A.slack,
    why:
      'The slack interval [def-min, def-max] = [+7.5064281e-6, +7.6499967e-6] with ' +
      'def-min from the endpoint definition A (larger max -> smaller slack); its ' +
      'width 1.435686e-7 equals the argmax gap max_A - max_B EXACTLY because the ' +
      'DP45 members are shared across both definitions.',
  },
  {
    id: 'imp35491-conservatism-robust-both-definitions',
    holds: () =>
      DEF_A.clearsTcHi === true &&
      DEF_B.clearsTcHi === true &&
      DEF_A.slack > 0 && DEF_B.slack > 0 &&
      IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS.verdict
        .conservatismRobustToDefinition === true,
    why:
      'Both envelope maxima clear the imp-857 upper bracket t_c_hi=1.2e-3 with ' +
      'strictly positive slack, so the conservatism conclusion is robust to the ' +
      'envelope-definition choice imp-35474 flagged; only the argmax member ' +
      'identity flips (RK4 dt/2 endpoint vs RK4 dt dense).',
  },
  {
    id: 'imp35491-argmax-member-definition-dependent',
    holds: () =>
      DEF_A.argmaxKey === 'rk4-dt-half-endpoint' &&
      DEF_B.argmaxKey === 'rk4h-dt-dense' &&
      DEF_A.argmaxKey !== DEF_B.argmaxKey,
    why:
      'The argmax MEMBER is envelope-definition-dependent: definition A picks the ' +
      'RK4 dt/2 endpoint crossing, definition B picks the RK4 dt dense crossing -- ' +
      'the exact sensitivity imp-35474 flagged, now tabulated with its slack interval.',
  },
  {
    id: 'imp35491-measurement-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS.noQED === true &&
      IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS.changesNoBound === true &&
      IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS
        .cMbStaysGueConditional === 'imp-486',
    why:
      'Measurement only: adopts NO new slack denominator (imp-35412 KEEPS the ' +
      'endpoint worst-case), advances NO ladder past N=1000, changes NO bound. ' +
      'C_mb stays GUE-conditional (imp-486); no refereed bound is changed. Never a QED.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35491_R2_SLACK_INTERVAL_BOTH_ENVELOPE_DEFINITIONS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`[imp-35491 R2 slack interval both envelope definitions] FAILED: ${a.id}`);
  }
}
