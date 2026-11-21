/**
 * @module imp-35532-n2000-both-envelope-definitions-tabulation-reference
 * @fileoverview imp-35532: side-by-side tabulation of the imp-35351 N=2000
 * dense-output worst-case flow envelope under BOTH envelope definitions the
 * imp-35474 HONEST NUANCE flagged -- (1) the RK4 ENDPOINT members and (2) the
 * imp-35416 RK4 + cubic-Hermite DENSE members -- recomputing the full descending
 * rank, argmax, max, min, and the imp-857 t_c_hi=1.2e-3 slack for each, and
 * measuring how far the argmax member identity and the max-member value shift.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35474 CONFIRMED that the RK4 dt/2 reference 1.1924935719e-3 is the argmax of
 * the imp-35351 envelope AS DEFINED (RK4 endpoint members) but noted -- as an
 * honest nuance -- that the argmax SHIFTS to the RK4 dt Hermite value
 * 1.1923500033e-3 if the imp-35416 RK4 + cubic-Hermite DENSE crossings are
 * substituted for the RK4 endpoint members. imp-35474 stated this qualitatively in
 * its definitionSensitivity block but NEVER tabulated the two envelopes side by
 * side: the full descending rank under the Hermite-dense definition, its min, its
 * slack, and the numeric max-member gap between the two definitions were never
 * recorded. This module fills exactly that measurement gap.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * Both envelopes share the SAME two DP45 dense members (imp-35351 DENSE_REFERENCES)
 * and differ only in the two RK4 members:
 *   DP45 dt    dense 1.1923008536e-3  (imp-35351, both definitions)
 *   DP45 dt/2  dense 1.1919828898e-3  (imp-35351, both definitions)
 *   -- Definition 1 (RK4 ENDPOINT, the imp-35351 envelope AS DEFINED) --
 *   RK4  dt    endpoint 1.1924488124e-3  (imp-35278)
 *   RK4  dt/2  endpoint 1.1924935719e-3  (imp-35278)
 *   -- Definition 2 (RK4 + cubic-Hermite DENSE) --
 *   RK4  dt    Hermite  1.1923500033e-3  (imp-35416)
 *   RK4  dt/2  Hermite  1.1920364654e-3  (imp-35416)
 * For EACH definition it independently folds max, min, argmax, argmin, the full
 * four-member descending rank, and the slack T_C_HI - max against the imp-857 map
 * upper bracket t_c_hi = 1.2e-3, then measures the max-member gap, slack gap, and
 * min gap between the two definitions.
 *
 * HONEST OUTCOME -- THE ARGMAX AND RANK SHIFT, THE MIN AND CONSERVATISM DO NOT
 * ---------------------------------------------------------------------------
 *   - Definition 1 rank: RK4 dt/2 (1.1924935719e-3) > RK4 dt (1.1924488124e-3) >
 *     DP45 dt (1.1923008536e-3) > DP45 dt/2 (1.1919828898e-3); argmax RK4 dt/2,
 *     slack +7.5064281e-6, span 5.106821e-7.
 *   - Definition 2 rank: RK4 dt Hermite (1.1923500033e-3) > DP45 dt
 *     (1.1923008536e-3) > RK4 dt/2 Hermite (1.1920364654e-3) > DP45 dt/2
 *     (1.1919828898e-3); argmax RK4 dt Hermite, slack +7.6499967e-6, span
 *     3.671135e-7.
 *   - The argmax member identity SHIFTS (RK4 dt/2 endpoint -> RK4 dt Hermite) and
 *     the rank RESHUFFLES: the RK4 dt/2 member falls from rank 1 (endpoint) to
 *     rank 3 (Hermite dense), and the DP45 dt member RISES from rank 3 to rank 2,
 *     overtaking the collapsed RK4 dt/2 Hermite crossing.
 *   - The max-member gap is Definition 1 max - Definition 2 max = 1.435686e-7 (the
 *     endpoint envelope sits HIGHER), and because both use the same t_c_hi the
 *     slack gap is EXACTLY equal and opposite: Definition 2 carries +1.435686e-7
 *     MORE headroom.
 *   - The MIN is IDENTICAL under both definitions: the DP45 dt/2 dense crossing
 *     1.1919828898e-3 is the argmin either way (min gap = 0 exactly), since the
 *     DP45 members are shared and DP45 dt/2 is the smallest of all six values.
 *   - BOTH definitions clear t_c_hi = 1.2e-3 with a positive slack, so the
 *     conservatism conclusion (envelope well below the upper bracket) is robust to
 *     the RK4 endpoint-vs-Hermite-dense choice; only the argmax member identity,
 *     the interior rank order, and the max/slack magnitude are definition-dependent.
 *
 * SCOPE: MEASUREMENT / VERIFICATION ONLY. Adopts NO new slack denominator
 * (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case per imp-35412/imp-35455);
 * changes NO bound; does NOT advance the R2 ladder past N=1000 (imp-35221/
 * imp-35324); does NOT extend the C_mb certificate; does NOT remove the imp-486
 * GUE conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35474  honest nuance that the argmax member is envelope-definition-dependent
 * @see imp-35351  DP45 dense-output envelope (shared DP45 members)
 * @see imp-35278  RK4 endpoint crossings (Definition 1 RK4 members)
 * @see imp-35416  RK4 + cubic-Hermite dense crossings (Definition 2 RK4 members)
 * @see imp-857    map upper bracket t_c_hi = 1.2e-3
 * @see imp-35412  R2 KEEP verdict that keeps the endpoint DP45 dt/2 worst-case
 */

// -- Shared DP45 dense members (imp-35351 DENSE_REFERENCES), both definitions. ----
const DP45_DT = 0.0011923008536;      // imp-35351 dense, dt = tauC_est/1000
const DP45_DTHALF = 0.0011919828898;  // imp-35351 dense, dt/2 within-step step-over

// -- Definition 1: RK4 ENDPOINT members (imp-35278, the imp-35351 envelope). ------
const RK4_DT = 0.0011924488124;       // imp-35278 RK4 dt endpoint
const RK4_DTHALF = 0.0011924935719;   // imp-35278 RK4 dt/2 endpoint

// -- Definition 2: RK4 + cubic-Hermite DENSE members (imp-35416). -----------------
const RK4H_DT = 0.0011923500033;      // imp-35416 RK4-Hermite dense, dt
const RK4H_DTHALF = 0.0011920364654;  // imp-35416 RK4-Hermite dense, dt/2

// imp-857 fixed-dt=1e-4 MAP upper bracket at N=2000 (one-sided upper target).
const T_C_HI = 1.2e-3;

// -- Independent per-definition fold. --------------------------------------------
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
    slack: T_C_HI - max,          // one-sided upper slack against t_c_hi
    span: max - min,
  };
}

const DEF1_MEMBERS = [
  { key: 'rk4-dt-half', integrator: 'rk4', dt: 'dt/2', event: 'endpoint', t_c: RK4_DTHALF, source: 'imp-35278' },
  { key: 'rk4-dt', integrator: 'rk4', dt: 'dt', event: 'endpoint', t_c: RK4_DT, source: 'imp-35278' },
  { key: 'dp45-dt', integrator: 'dp45', dt: 'dt', event: 'dense', t_c: DP45_DT, source: 'imp-35351' },
  { key: 'dp45-dt-half', integrator: 'dp45', dt: 'dt/2', event: 'dense', t_c: DP45_DTHALF, source: 'imp-35351' },
];

const DEF2_MEMBERS = [
  { key: 'rk4-hermite-dt', integrator: 'rk4-hermite', dt: 'dt', event: 'dense', t_c: RK4H_DT, source: 'imp-35416' },
  { key: 'rk4-hermite-dt-half', integrator: 'rk4-hermite', dt: 'dt/2', event: 'dense', t_c: RK4H_DTHALF, source: 'imp-35416' },
  { key: 'dp45-dt', integrator: 'dp45', dt: 'dt', event: 'dense', t_c: DP45_DT, source: 'imp-35351' },
  { key: 'dp45-dt-half', integrator: 'dp45', dt: 'dt/2', event: 'dense', t_c: DP45_DTHALF, source: 'imp-35351' },
];

const DEF1 = foldEnvelope(DEF1_MEMBERS); // RK4 endpoint envelope (imp-35351 as defined)
const DEF2 = foldEnvelope(DEF2_MEMBERS); // RK4 + cubic-Hermite dense envelope

// -- Between-definition gaps. ----------------------------------------------------
const MAX_MEMBER_GAP = DEF1.max - DEF2.max;  // endpoint sits higher -> positive
const SLACK_GAP = DEF2.slack - DEF1.slack;   // Def2 carries more headroom
const MIN_GAP = DEF1.min - DEF2.min;         // identical -> 0
// Rank the RK4 dt/2 member takes under each definition (1-based descending).
const RK4_DTHALF_RANK_DEF1 =
  DEF1.sortedDescending.findIndex((m) => m.key === 'rk4-dt-half') + 1;
const RK4H_DTHALF_RANK_DEF2 =
  DEF2.sortedDescending.findIndex((m) => m.key === 'rk4-hermite-dt-half') + 1;

export const IMP_35532_BOTH_ENVELOPE_DEFINITIONS_TABULATION_REFERENCE = {
  id: 'imp-35532',
  title:
    'Side-by-side tabulation of the imp-35351 N=2000 dense-output envelope under ' +
    'both definitions (RK4 endpoint vs RK4 + cubic-Hermite dense members), ' +
    'measuring how the argmax member identity, interior rank, and max/slack shift',
  kind: 'measurement-verification-only',
  changesNoBound: true,
  adoptsNewSlackDenominator: false,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'argmax-and-rank-shift-min-and-conservatism-robust',

  tcHi: T_C_HI,
  definition1_rk4Endpoint: {
    label: 'RK4 endpoint (imp-35351 envelope as defined)',
    members: DEF1_MEMBERS,
    ...DEF1,
  },
  definition2_rk4HermiteDense: {
    label: 'RK4 + cubic-Hermite dense (imp-35416 variant)',
    members: DEF2_MEMBERS,
    ...DEF2,
  },
  betweenDefinitionGaps: {
    maxMemberGap: MAX_MEMBER_GAP,    // Def1 max - Def2 max = +1.435686e-7
    slackGap: SLACK_GAP,             // Def2 slack - Def1 slack = +1.435686e-7
    minGap: MIN_GAP,                 // 0 exactly (shared DP45 dt/2 argmin)
    argmaxShifts: DEF1.argmaxKey !== DEF2.argmaxKey,
    argminIdentical: DEF1.argminKey === DEF2.argminKey,
    rk4DtHalfRankDef1: RK4_DTHALF_RANK_DEF1,       // 1 (endpoint top)
    rk4HermiteDtHalfRankDef2: RK4H_DTHALF_RANK_DEF2, // 3 (dense collapse)
  },

  verdict: {
    argmaxDef1: DEF1.argmaxKey,      // rk4-dt-half
    argmaxDef2: DEF2.argmaxKey,      // rk4-hermite-dt
    bothClearTcHi: DEF1.max < T_C_HI && DEF2.max < T_C_HI,
    interpretation:
      'Folding the imp-35351 N=2000 envelope under both definitions side by side: ' +
      'Definition 1 (RK4 endpoint) ranks RK4 dt/2 > RK4 dt > DP45 dt > DP45 dt/2 ' +
      'with argmax RK4 dt/2 (1.1924935719e-3, slack +7.5064281e-6); Definition 2 ' +
      '(RK4 + cubic-Hermite dense) ranks RK4 dt Hermite > DP45 dt > RK4 dt/2 ' +
      'Hermite > DP45 dt/2 with argmax RK4 dt Hermite (1.1923500033e-3, slack ' +
      '+7.6499967e-6). The argmax member identity SHIFTS and the RK4 dt/2 member ' +
      'falls from rank 1 to rank 3 as the DP45 dt dense crossing overtakes it; the ' +
      'max-member gap is +1.435686e-7 (endpoint higher) and the slack gap is ' +
      'exactly equal (+1.435686e-7 more headroom for Definition 2, same t_c_hi). ' +
      'The MIN is identical under both (DP45 dt/2 dense 1.1919828898e-3, min gap 0) ' +
      'and BOTH definitions clear t_c_hi=1.2e-3, so the conservatism conclusion is ' +
      'robust while the argmax identity, interior rank, and max magnitude are ' +
      'envelope-definition-dependent.',
    doesNotAchieve:
      'Measurement only: adopts NO new slack denominator (imp-35412 KEEPS the ' +
      'endpoint DP45 dt/2 worst-case); does NOT advance the R2 ladder past N=1000; ' +
      'does NOT extend the C_mb certificate; does NOT remove the imp-486 GUE ' +
      'conditional; changes NO Lambda bound. No refereed bound is changed' +
      '. NO QED.',
  },
};

// -- Build-time assertions (import-light; only baked literals). -------------------
export const IMP_35532_BOTH_ENVELOPE_DEFINITIONS_TABULATION_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35532-def1-endpoint-rank-and-argmax',
    holds: () =>
      DEF1.argmaxKey === 'rk4-dt-half' &&
      DEF1.sortedDescending[0].key === 'rk4-dt-half' &&
      DEF1.sortedDescending[1].key === 'rk4-dt' &&
      DEF1.sortedDescending[2].key === 'dp45-dt' &&
      DEF1.sortedDescending[3].key === 'dp45-dt-half' &&
      Math.abs(DEF1.max - 0.0011924935719) < 1e-13 &&
      Math.abs(DEF1.slack - 7.5064281e-6) < 1e-13,
    why:
      'Definition 1 (RK4 endpoint) descending rank is RK4 dt/2 > RK4 dt > DP45 dt ' +
      '> DP45 dt/2 with argmax RK4 dt/2 (1.1924935719e-3) and slack +7.5064281e-6, ' +
      'matching the imp-35474 confirmed fold for the imp-35351 envelope as defined.',
  },
  {
    id: 'imp35532-def2-hermite-rank-and-argmax',
    holds: () =>
      DEF2.argmaxKey === 'rk4-hermite-dt' &&
      DEF2.sortedDescending[0].key === 'rk4-hermite-dt' &&
      DEF2.sortedDescending[1].key === 'dp45-dt' &&
      DEF2.sortedDescending[2].key === 'rk4-hermite-dt-half' &&
      DEF2.sortedDescending[3].key === 'dp45-dt-half' &&
      Math.abs(DEF2.max - 0.0011923500033) < 1e-13 &&
      Math.abs(DEF2.slack - 7.6499967e-6) < 1e-13,
    why:
      'Definition 2 (RK4 + cubic-Hermite dense) descending rank is RK4 dt Hermite ' +
      '> DP45 dt > RK4 dt/2 Hermite > DP45 dt/2 with argmax RK4 dt Hermite ' +
      '(1.1923500033e-3) and slack +7.6499967e-6; the DP45 dt member overtakes the ' +
      'collapsed RK4 dt/2 Hermite crossing.',
  },
  {
    id: 'imp35532-argmax-shifts-rank-reshuffles',
    holds: () =>
      DEF1.argmaxKey !== DEF2.argmaxKey &&
      RK4_DTHALF_RANK_DEF1 === 1 &&
      RK4H_DTHALF_RANK_DEF2 === 3,
    why:
      'The argmax member identity shifts from RK4 dt/2 endpoint to RK4 dt Hermite, ' +
      'and the RK4 dt/2 member falls from rank 1 (Definition 1) to rank 3 ' +
      '(Definition 2) -- the interior rank order is envelope-definition-dependent.',
  },
  {
    id: 'imp35532-max-member-gap-equals-slack-gap',
    holds: () =>
      Math.abs(MAX_MEMBER_GAP - 1.435686e-7) < 1e-13 &&
      Math.abs(SLACK_GAP - 1.435686e-7) < 1e-13 &&
      Math.abs(MAX_MEMBER_GAP - SLACK_GAP) < 1e-16,
    why:
      'The max-member gap (Def1 max - Def2 max) is +1.435686e-7, and because both ' +
      'definitions use the same t_c_hi=1.2e-3 the slack gap is exactly equal: ' +
      'Definition 2 carries +1.435686e-7 more one-sided upper headroom.',
  },
  {
    id: 'imp35532-min-identical-across-definitions',
    holds: () =>
      DEF1.argminKey === 'dp45-dt-half' &&
      DEF2.argminKey === 'dp45-dt-half' &&
      Math.abs(MIN_GAP) < 1e-16 &&
      Math.abs(DEF1.min - 0.0011919828898) < 1e-13,
    why:
      'The DP45 dt/2 dense crossing 1.1919828898e-3 is the argmin under BOTH ' +
      'definitions (min gap = 0 exactly), since the DP45 members are shared and ' +
      'DP45 dt/2 is the smallest of all six values.',
  },
  {
    id: 'imp35532-both-definitions-clear-tc-hi',
    holds: () =>
      DEF1.max < T_C_HI && DEF2.max < T_C_HI &&
      DEF1.slack > 0 && DEF2.slack > 0,
    why:
      'Both envelope definitions clear the imp-857 upper bracket t_c_hi=1.2e-3 ' +
      'with a positive slack, so the conservatism conclusion is robust to the RK4 ' +
      'endpoint-vs-Hermite-dense choice; only the argmax and magnitude shift.',
  },
  {
    id: 'imp35532-measurement-only-no-qed',
    holds: () =>
      IMP_35532_BOTH_ENVELOPE_DEFINITIONS_TABULATION_REFERENCE.noQED === true &&
      IMP_35532_BOTH_ENVELOPE_DEFINITIONS_TABULATION_REFERENCE.changesNoBound === true &&
      IMP_35532_BOTH_ENVELOPE_DEFINITIONS_TABULATION_REFERENCE.adoptsNewSlackDenominator === false,
    why:
      'Measurement only: adopts NO new slack denominator (imp-35412 keeps the ' +
      'endpoint DP45 dt/2 worst-case), advances NO ladder past N=1000, changes NO ' +
      'bound. C_mb stays GUE-conditional (imp-486); no refereed bound is changed. NO QED.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35532_BOTH_ENVELOPE_DEFINITIONS_TABULATION_REFERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`[imp-35532 both-envelope-definitions tabulation] FAILED: ${a.id}`);
  }
}
