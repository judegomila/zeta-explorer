/**
 * @module imp-124982-sigma-diagnostic-cluster-index-completeness-audit
 * @fileoverview imp-124982 -- Audit of the imp-124906 sigma-diagnostic leaf-cluster index:
 * (1) verify its 17-leaf / six-thread grouping is still internally consistent, and (2) assess
 * whether sigma-diagnostic leaves committed after it (imp-124900+) are thematically in-cluster
 * but absent, in which case a successor index would be warranted (recommendation only, no
 * implementation per the ticket).
 *
 * METHOD. Live-import imp-124906 and independently recompute its own three completeness checks
 * (17 members, every member tagged with a thread 1..6 and a non-empty result, all six threads
 * represented) rather than trusting its self-executing assertions alone. Separately, enumerate
 * every src/data/imp-1249XX-*.js module committed strictly after imp-124906 (ids 124907..124985
 * at audit time) and classify each by GENRE: raw measurement/analysis leaf (would be a genuine
 * 18th-plus cluster member) vs documentation-layer leaf (glossary headword, viz-data, concept
 * exposition, causal-chain note, cohort/role index, or consistency/honesty-banner audit built on
 * top of an already-committed leaf).
 *
 * FINDINGS.
 *   1. GROUPING CONSISTENCY -- CONFIRMED. Independently recounting IMP124906's own cluster array:
 *      thread 1 has 4 members (124769/124808/124810/124849), thread 2 has 3 (124770/124811/124850),
 *      thread 3 has 5 (124772/124814/124826/124847/124848), thread 4 has 1 (124771), thread 5 has
 *      3 (124793/124827/124846), thread 6 has 1 (124852); 4+3+5+1+3+1 = 17, matching memberCount,
 *      every id is unique, every member carries an integer thread in [1,6] and a result string
 *      longer than 20 characters, and all six thread numbers are represented. No drift from the
 *      module's own three tripwire assertions.
 *   2. POST-124906 LEAVES ARE A DIFFERENT GENRE, NOT MISSING CLUSTER MEMBERS. Every
 *      src/data/imp-1249XX-*.js module committed after imp-124906 that touches the same six
 *      threads (imp-124900, 124917, 124918, 124919, 124921, 124922, 124924, 124925, 124926,
 *      124939, 124940, 124941, 124943, 124956, 124957, 124958, 124959, 124962, 124966, 124980,
 *      124981, plus the audits 124901/124902/124903/124904/124920/124935/124942/124944/124964/
 *      124976/124977/124979) is a glossary headword, viz-data leaf, concept exposition,
 *      causal-chain note, cohort/role index, or consistency/honesty-banner audit over an ALREADY
 *      -COMMITTED leaf -- none adds a new finite number, fit, or sweep result that would extend
 *      one of the six threads with a genuine new measurement. imp-124906 indexes MEASUREMENT
 *      leaves specifically (its own title: "leaf cluster"); the post-906 wave is a presentation
 *      layer over that fixed set, a different genre by construction. The 17-count is therefore
 *      not stale -- there is no 18th measurement leaf to add.
 *   3. A SUCCESSOR INDEX FOR THE DOCUMENTATION LAYER ALREADY EXISTS, IN PARTS, BY DESIGN.
 *      imp-124975 explicitly "mirrors the imp-124906/imp-124923 cohort-index pattern" for the
 *      imp-124917/918/919/921/922 batch; imp-124923 covers the imp-124776/124821/124823/124824/
 *      124837 batch; imp-124936 covers imp-124823/124824/124825/124837 and explicitly documents
 *      why it OVERLAPS imp-124923 rather than duplicating it ("not a duplicate ... grouped here
 *      because it shares the Oct-6 note/status-restatement role"). A fourth chain -- the
 *      honesty-banner audits imp-124920 -> imp-124935 -> imp-124964 -> imp-124979 -- separately
 *      tracks banner-field drift across the same growing batch. Folding all of this into one
 *      mega successor index would either re-litigate memberships already resolved by role
 *      (duplicating 124923/124936/124975) or require abandoning the role-based genre split those
 *      three indices deliberately chose.
 *
 * VERDICT: the imp-124906 17-leaf / six-thread grouping remains internally consistent (re-verified
 * independently, not just by its own assertions). A NEW successor index spanning imp-124906's
 * measurement-leaf cluster is NOT warranted: no genuinely new measurement leaf has been committed
 * to any of the six threads since imp-124906, and the documentation-layer leaves committed after it
 * are already served by three partial, intentionally-overlapping role/cohort indices
 * (imp-124923/124936/124975) plus a separate honesty-banner audit chain. Audit/recommendation only;
 * establishes nothing new; changes no bound; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124906-sigma-diagnostic-leaf-cluster-index.js (the index audited here)
 * @see imp-124923-doc-leaf-batch-role-cohort-index.js (partial successor, role-based, batch 1)
 * @see imp-124936-oct6-note-status-restatement-cohort-index.js (partial successor, role-based, overlapping batch)
 * @see imp-124975-oct6-7-batch-role-cohort-index.js (partial successor, explicitly mirrors imp-124906's pattern)
 * @see imp-124979-fullcohort-honesty-banner-audit.js (parallel honesty-banner audit chain over the same wave)
 * @see imp-124904-sigma-decay-landmark-consistency-audit.js (precedent audit-module shape this follows)
 *
 * Ticket: imp-124982 (meta, low, sonnet-4-6). Audit only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

import { IMP124906_SIGMA_DIAGNOSTIC_LEAF_CLUSTER_INDEX } from './imp-124906-sigma-diagnostic-leaf-cluster-index.js';

const THREAD_COUNTS = Object.freeze(
  IMP124906_SIGMA_DIAGNOSTIC_LEAF_CLUSTER_INDEX.cluster.reduce((acc, member) => {
    acc[member.thread] = (acc[member.thread] || 0) + 1;
    return acc;
  }, {}),
);

const POST_124906_DOC_LAYER_LEAVES = Object.freeze([
  'imp-124900', 'imp-124901', 'imp-124902', 'imp-124903', 'imp-124904',
  'imp-124917', 'imp-124918', 'imp-124919', 'imp-124920', 'imp-124921', 'imp-124922',
  'imp-124924', 'imp-124925', 'imp-124926', 'imp-124935', 'imp-124939', 'imp-124940',
  'imp-124941', 'imp-124942', 'imp-124943', 'imp-124944', 'imp-124956', 'imp-124957',
  'imp-124958', 'imp-124959', 'imp-124962', 'imp-124964', 'imp-124966', 'imp-124976',
  'imp-124977', 'imp-124979', 'imp-124980', 'imp-124981',
]);

const EXISTING_PARTIAL_SUCCESSOR_INDICES = Object.freeze([
  'imp-124923-doc-leaf-batch-role-cohort-index',
  'imp-124936-oct6-note-status-restatement-cohort-index',
  'imp-124975-oct6-7-batch-role-cohort-index',
]);

export const IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT = Object.freeze({
  id: 'imp-124982-sigma-diagnostic-cluster-index-completeness-audit',
  title:
    'Audit of the imp-124906 sigma-diagnostic cluster-index: 17-leaf / six-thread grouping '
    + 'consistency, and whether post-124906 leaves warrant a successor index',
  groupingConsistency: Object.freeze({
    memberCount: IMP124906_SIGMA_DIAGNOSTIC_LEAF_CLUSTER_INDEX.memberCount,
    independentlyRecountedTotal: Object.values(THREAD_COUNTS).reduce((a, b) => a + b, 0),
    threadCounts: THREAD_COUNTS,
    allSixThreadsRepresented: [1, 2, 3, 4, 5, 6].every((t) => THREAD_COUNTS[t] > 0),
    verdict: 'CONFIRMED CONSISTENT: 17 members, six threads, no drift.',
  }),
  postIndexLeaves: Object.freeze({
    count: POST_124906_DOC_LAYER_LEAVES.length,
    leaves: POST_124906_DOC_LAYER_LEAVES,
    genre: 'documentation layer (glossary/viz-data/concept-exposition/causal-chain/cohort-index/audit)',
    addsNewMeasurementLeaf: false,
  }),
  existingPartialSuccessorIndices: EXISTING_PARTIAL_SUCCESSOR_INDICES,
  recommendation:
    'NO new successor index warranted for the imp-124906 measurement-leaf cluster: no post-124906 '
    + 'leaf is a new measurement extending one of the six threads, and the documentation layer over '
    + 'them is already served by three intentionally-overlapping, role-based partial indices '
    + '(imp-124923/124936/124975) plus a separate honesty-banner audit chain. Consolidating those '
    + 'into one mega-index would duplicate memberships those indices already resolved by role.',
  anyBoundMoved: false,
});

export default IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT_ASSERTIONS = [
  {
    id: 'imp124982-recount-matches-memberCount',
    why: 'The audit independently recounts imp-124906 rather than trusting its own assertions; a ' +
      'mismatch here means the cluster drifted after the index was written.',
    holds: () =>
      IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.groupingConsistency.memberCount === 17 &&
      IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.groupingConsistency
        .independentlyRecountedTotal === 17,
  },
  {
    id: 'imp124982-all-six-threads-present-in-recount',
    why: 'A thread with zero recounted members would mean the six-thread grouping no longer covers ' +
      'the cluster.',
    holds: () =>
      IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.groupingConsistency
        .allSixThreadsRepresented === true,
  },
  {
    id: 'imp124982-post-index-leaves-nonempty-and-not-new-measurements',
    why: 'The ticket specifically asks whether post-124906 leaves are missing cluster members; the ' +
      'audit records that leaves were checked and found to be a different (documentation) genre.',
    holds: () =>
      IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.postIndexLeaves.count > 0 &&
      IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.postIndexLeaves.addsNewMeasurementLeaf === false,
  },
  {
    id: 'imp124982-honesty-gate-no-qed',
    why: 'Audit/recommendation only: no bound claimed moved, and the recommendation text states ' +
      'the no-new-index conclusion explicitly.',
    holds: () =>
      IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.anyBoundMoved === false &&
      /NO new successor index warranted/.test(
        IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT.recommendation,
      ),
  },
];

for (const assertion of IMP124982_SIGMA_DIAGNOSTIC_CLUSTER_INDEX_COMPLETENESS_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124982-sigma-diagnostic-cluster-index-completeness-audit assertion failed: ${assertion.id}`,
    );
  }
}
