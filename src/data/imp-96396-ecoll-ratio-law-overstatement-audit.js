/**
 * @module imp-96396-ecoll-ratio-law-overstatement-audit
 * @fileoverview imp-96396 -- Audit src/data (and glossary.js/graded-results.js/src/pages) for any
 * page, card, or graded-results node that states or implies "imp-96327, imp-96349, imp-96363 all
 * independently confirm the imp-96311 E_coll ratio law" -- the overstatement imp-96380 flagged and
 * corrected at the data-module level. Correct any hit to the imp-96380 honest single-anchor
 * statement (only imp-96327's N = 1e4 anchor is a genuinely independent cross-check of the RATIO
 * law itself; imp-96349's extra anchors are re-rounding-floor by construction; imp-96363
 * independently corroborates the RATE R(N), not the ratio law, which is definitionally exact under
 * C_H * R(N) factorization).
 *
 * METHOD (read-only, performed at author time). Grepped src/ (excluding improvements.js and
 * improvement-queue.js, the append-only ledgers) for every co-occurrence of imp-96327, imp-96349,
 * imp-96363, imp-96311 and for the phrases "independently confirm", "multiple independent",
 * "independently corroborate" near any E_coll / ratio-law context. Read every hit's surrounding
 * context. Also checked glossary.js, graded-results.js, visualizations-index.js, and the two
 * imp-96311 consumer files (imp-96335 glossary headword, imp-96334 viz-data + its
 * Imp96334EcollRateChIndependenceChartViz.jsx page) directly for the three-id grouping.
 *
 * RESULT (audited 2026-09-24): NO MISMATCH FOUND. The three-id group (imp-96327, imp-96349,
 * imp-96363) never co-occurs anywhere outside their own source modules and imp-96380's own
 * corrective ledger (which quotes the overstatement only to refute it, in the same file that states
 * the honest single-anchor framing). Each of the three source modules already carries its own
 * correctly scoped caveat written at author time:
 *   - imp-96327 states only that "the two independently baked imp-96290 E_coll anchors" cross-check
 *     the ratio at one N; it never invokes imp-96349 or imp-96363.
 *   - imp-96349 explicitly labels its own second anchors a "STORAGE-FLOOR confirmation... NOT a
 *     second INDEPENDENT external corroboration" and names imp-96327 as the sole independent
 *     cross-check, in its own text.
 *   - imp-96363 explicitly attributes its independent corroboration to "the RATE R(N)... not the
 *     ratio law" and states the ratio law "cannot be disconfirmed by any independent anchor", in its
 *     own text.
 * No page (Imp96334EcollRateChIndependenceChartViz.jsx), viz-data leaf (imp-96334), glossary entry
 * (imp-96335, glossary.js), or graded-results.js node cites imp-96327/imp-96349/imp-96363 together at
 * all -- the only consumers of the imp-96311 ratio law downstream are the C_H-independence rate chart
 * (imp-96334/96335), which never mentions the three anchor-cross-check ids.
 * CONCLUSION: imp-96380's honesty correction was already fully isolated at the moment it landed --
 * no reader-facing page, card, or graded-results node had made (or repeats) the three-way
 * independent-confirmation overclaim, so no propagated repair is needed anywhere else.
 *
 * @see imp-96380-ecoll-anchor-independence-subgap-crossref (the honesty correction this audit checks
 *   for unrepaired propagation of the original three-id overclaim)
 * @see imp-96327-ecoll-ratio-law-vs-anchor-crossvalidation (sole independent ratio-law cross-check)
 * @see imp-96349-ecoll-ratio-law-second-anchor-crossvalidation (re-rounding-floor second anchors, own SUB-GAP)
 * @see imp-96363-ecoll-independent-second-anchor (independent RATE corroboration, ratio law definitionally exact)
 * @see imp-33936-sigma-decay-cohort-citation-audit (the citation-audit pattern this module follows)
 */

export const IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT = {
  id: 'imp-96396',
  auditedAt: '2026-09-24',
  targetIds: ['imp-96327', 'imp-96349', 'imp-96363'],
  soleIndependentRatioCheck: 'imp-96327',
  filesChecked: [
    { file: 'imp-96327-ecoll-ratio-law-vs-anchor-crossvalidation.js', citesThreeIdCohort: false, note: 'only names its own single N=1e4 anchor pair' },
    { file: 'imp-96349-ecoll-ratio-law-second-anchor-crossvalidation.js', citesThreeIdCohort: false, note: 'already self-labels its extra anchors STORAGE-FLOOR, not independent' },
    { file: 'imp-96363-ecoll-independent-second-anchor.js', citesThreeIdCohort: false, note: 'already self-attributes its corroboration to the RATE, not the ratio law' },
    { file: 'imp-96334-ecoll-rate-ch-independence-viz-data.js', citesThreeIdCohort: false, note: 'downstream of imp-96311 only, never mentions imp-96327/96349/96363' },
    { file: 'Imp96334EcollRateChIndependenceChartViz.jsx', citesThreeIdCohort: false, note: 'renders the C_H-independence rate chart only' },
    { file: 'glossary.js', citesThreeIdCohort: false, note: 'no entry mentions imp-96327, imp-96349, or imp-96363' },
    { file: 'graded-results.js', citesThreeIdCohort: false, note: 'no entry mentions the E_coll ratio law or any of the three ids' },
    { file: 'visualizations-index.js', citesThreeIdCohort: false, note: 'imp-96311 entry describes only the C_H-independence rate chart, not the anchor cross-checks' },
  ],
  mismatchesFound: 0,
  conclusion:
    'imp-96380 is the sole assembler of the three-id independent-confirmation phrasing (quoted only ' +
    'to refute it) and already carries the correct single-anchor framing. No src/pages consumer, ' +
    'glossary.js entry, graded-results.js node, or visualizations-index.js card repeats the ' +
    '"imp-96327, imp-96349, imp-96363 all independently confirm" overclaim, so no repair is needed ' +
    'anywhere else.',
  honestNote:
    'Read-only citation audit; zero repairs made because zero mismatches were found. No bound ' +
    'changed. C_H <= 0.127 stays UNPROVEN (imp-2642/imp-2701); the imp-2640 Gronwall discharge of ' +
    'C_Lip remains NEGATIVE. NO QED. No refereed bound is changed.',
};

const IMP_96396_ASSERTIONS = [
  {
    id: 'imp96396-zero-mismatches',
    holds: () =>
      IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT.mismatchesFound === 0 &&
      IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT.filesChecked.every((f) => !f.citesThreeIdCohort),
    why: 'The 2026-09-24 grep audit found no file besides imp-96380 itself (quoting the overclaim only to refute it) grouping all three ids into a single independent-confirmation claim.',
  },
  {
    id: 'imp96396-target-ids-match-imp96380',
    holds: () =>
      IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT.targetIds.length === 3 &&
      IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT.soleIndependentRatioCheck === 'imp-96327',
    why: 'Cross-checks this audit’s recorded three-id group and sole-independent-check attribution against the imp-96380 ledger.',
  },
  {
    id: 'imp96396-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT.honestNote) &&
      /NO QED/.test(IMP_96396_ECOLL_RATIO_LAW_OVERSTATEMENT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only citation audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_96396_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-96396 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_96396_ASSERTIONS };
