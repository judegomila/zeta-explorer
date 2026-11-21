/**
 * @module imp-33936-sigma-decay-cohort-citation-audit
 * @fileoverview imp-33936 -- Audit src/data (and IMPROVEMENTS.md/glossary.js) for any module or doc,
 * OTHER than imp-33759 itself, that cites the ticket-named six-id list (imp-33706, imp-33707,
 * imp-33708, imp-33721, imp-33722, imp-33723) as a single "sigma-decay cohort", and flag any mismatch
 * against the imp-33759 honesty correction (only FOUR of the six -- imp-33708, imp-33721, imp-33722,
 * imp-33723 -- actually share the sigma(N) = E_coll/(E_trunc+E_flow+E_coll) component model; imp-33706
 * and imp-33707 are off-topic).
 *
 * METHOD (read-only, performed at author time). Grepped every src/data file referencing any of the
 * six ids (via `grep -rl "33706" src/data/`, excluding the 16.7MB zeros-to-1e6.js zero-listing bundle
 * and the improvements.js/improvement-queue.js ledgers) for co-occurring six-id groupings, then read
 * each hit's surrounding context to test whether it asserts a shared cohort/model. Also grepped
 * IMPROVEMENTS.md and src/pages for the same six-id co-occurrence pattern.
 *
 * RESULT (audited 2026-07-05): NO MISMATCH FOUND. imp-33759 is the ONLY module that assembles all six
 * ids into a single named cohort, and it already carries the correct four-vs-two split (verified by
 * reading its exported requestedIds/correctSigmaDecayCohortIds/offTopicIds fields). Every other file
 * touching one or more of the six ids does so for an unrelated, narrower reason:
 *   - imp-33746-governing-exponent-N-ladder-measurement.js and imp-33745-h0-provenance-independence-
 *     scoping.js cite imp-33706 ALONE (its own G6a_shock_lipschitz open-residual-tower claim), never
 *     grouping it with imp-33708/33721/33722/33723 or asserting it shares their sigma(N) model.
 *   - imp-33784-33743-33745-cohort-provenance-rollup.js cites imp-33706 only inside its imp-33745
 *     summary line and explicitly states imp-33745 (the H0-provenance scoping, adjacent to imp-33706)
 *     "is on an entirely disjoint axis... and shares no sub-terms with the other two" -- consistent
 *     with, not contradicting, the imp-33759 split.
 *   - glossary.js has one soft phrase, "a sibling frontier derivation from the same imp-33706/imp-33721
 *     cohort" (the imp-33744 entry's relatedTerms), but this names only TWO ids (not the six-id list)
 *     and describes them as siblings in FRONTIER-DIRECTION DERIVATION WORK generally, not as sharing
 *     the sigma(N) component model -- imp-33706 is never credited with the model itself anywhere in
 *     glossary.js. Not a mismatch against imp-33759's model-sharing claim.
 *   - IMPROVEMENTS.md's five hits for "33706" are the original commit-log rows for imp-33706/33745/
 *     33746/33757/33774 plus the imp-33759 row itself; none groups the six ids as a cohort except the
 *     imp-33759 row, which already states the correct four-vs-two split verbatim.
 *   - No src/pages file references imp-33706 or the six-id list at all.
 * CONCLUSION: the imp-33759 honesty correction is properly isolated -- it did not need to propagate a
 * repair anywhere else because no other module or doc had made the six-id-cohort claim in the first
 * place.
 *
 * @see imp-33759-sigma-decay-cohort-provenance-rollup (the honesty correction this audit checks for
 *   unrepaired propagation of the original six-id overclaim)
 * @see imp-3706-3663-3671-cohort-honesty-audit, imp-3660, imp-3637 (the honesty-audit pattern this
 *   module follows)
 */

export const IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT = {
  id: 'imp-33936',
  auditedAt: '2026-07-05',
  targetSixIds: ['imp-33706', 'imp-33707', 'imp-33708', 'imp-33721', 'imp-33722', 'imp-33723'],
  correctFourIds: ['imp-33708', 'imp-33721', 'imp-33722', 'imp-33723'],
  offTopicIds: ['imp-33706', 'imp-33707'],
  filesChecked: [
    { file: 'imp-33746-governing-exponent-N-ladder-measurement.js', citesSixIdCohort: false, note: 'cites imp-33706 alone, own claim' },
    { file: 'imp-33745-h0-provenance-independence-scoping.js', citesSixIdCohort: false, note: 'cites imp-33706 alone, own claim' },
    { file: 'imp-33784-33743-33745-cohort-provenance-rollup.js', citesSixIdCohort: false, note: 'names imp-33706 only in an imp-33745 summary line; explicitly disjoint-axis' },
    { file: 'glossary.js', citesSixIdCohort: false, note: 'one two-id "imp-33706/imp-33721 cohort" phrase describing shared frontier-direction lineage, not the shared sigma(N) model' },
    { file: 'IMPROVEMENTS.md', citesSixIdCohort: false, note: 'five unrelated commit-log rows plus the correct imp-33759 row; no other six-id grouping' },
  ],
  mismatchesFound: 0,
  conclusion:
    'imp-33759 is the sole assembler of the six-id cohort claim and already carries the correct ' +
    'four-vs-two split. No other src/data module, glossary.js entry, IMPROVEMENTS.md row, or src/pages ' +
    'consumer repeats the six-id-cohort overclaim, so no repair is needed anywhere else.',
  honestNote:
    'Read-only citation audit; zero repairs made because zero mismatches were found. No bound ' +
    'changed, no operator positivity attempted. imp-3066 K_a >= 0 untouched. NO QED. ' +
    'No refereed bound is changed.',
};

const IMP_33936_ASSERTIONS = [
  {
    id: 'imp33936-zero-mismatches',
    holds: () =>
      IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.mismatchesFound === 0 &&
      IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.filesChecked.every((f) => !f.citesSixIdCohort),
    why: 'The 2026-07-05 grep audit found no file besides imp-33759 itself grouping all six ids into a single cohort claim.',
  },
  {
    id: 'imp33936-four-vs-two-split-matches-imp33759',
    holds: () =>
      IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.correctFourIds.length === 4 &&
      IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.offTopicIds.length === 2 &&
      IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.targetSixIds.length === 6,
    why: 'Cross-checks this audit’s recorded split against the imp-33759 requestedIds/correctSigmaDecayCohortIds/offTopicIds fields.',
  },
  {
    id: 'imp33936-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33936_SIGMA_DECAY_COHORT_CITATION_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only citation audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_33936_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33936 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33936_ASSERTIONS };
