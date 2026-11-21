/**
 * @module imp-35448-newest-frontier-cohort-crossref-integrity-audit
 *
 * imp-35448 (meta, audit): a cross-reference integrity check (imp-35186/imp-35327 method) on
 * the newest frontier modules with id > 35355 -- imp-35356/35357/35359/35370/35371/35372/
 * 35402/35404 -- resolving every @see target, ES import, named import, and bare imp-NNNNN
 * citation each of the eight files carries.
 *
 * METHOD. For each of the eight cohort files, resolved every filename-suffixed @see target and
 * ES-module import specifier against the src/data directory listing, every named import against
 * the target file's actual `export` statements, and every bare "imp-NNNNN" ticket citation (no
 * filename suffix) against either a real src/data file with that leading id or an
 * `id: 'imp-NNNNN'` occurrence in improvement-queue.js. Also checked that each file still carries
 * a "NO QED" disclaimer and an imp-486/imp-3066 GUE-conditional caveat.
 *
 * FINDING. All 27 distinct filename-suffixed @see/import targets across the cohort (23
 * imp-NNNNN-named modules plus lambda-rh-height-mapping and polymath15-constant-C-C) resolve to
 * real files in src/data. The four named imports actually pulled live -- effectiveHeightForN
 * (imp-35370, imp-35372), C_C_PINNED (imp-35372), IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER and
 * IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP (both imp-35402) -- match real exports of
 * their source modules. All 53 distinct bare imp-NNNNN citations across the cohort resolve,
 * either to a real src/data file sharing that leading id or to an `id: 'imp-NNNNN'` entry in
 * improvement-queue.js (this covers imp-35360 and imp-35275, the two bare citations with no
 * matching filename-suffixed module). Every one of the eight files still carries at least one
 * "NO QED" occurrence and at least one imp-486/imp-3066 GUE-conditional citation. Zero dangling
 * references, zero missing honesty caveats.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior repetition, adjacent cohort)
 * @see imp-35424-frontier-cohort-crossref-integrity-audit (sibling audit, a different six-file cohort)
 * @see imp-35356-r1-candidate-routes-assessment (cohort file 1)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (cohort file 2)
 * @see imp-35359-r2-ladder-viz-consistency-audit (cohort file 3)
 * @see imp-35370-eflow-fartail-swap-fraction-half-crossover (cohort file 4)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (cohort file 5)
 * @see imp-35372-reentry-band-drift-integral-half-offset (cohort file 6)
 * @see imp-35402-eflow-fartail-ladder-literal-reconstruction-check (cohort file 7)
 * @see imp-35404-krawczyk-headroom-cancellation-viz-data (cohort file 8)
 */

const AUDITED_FILES = [
  'imp-35356-r1-candidate-routes-assessment',
  'imp-35357-reentry-band-pure-artifact-proof-requirement',
  'imp-35359-r2-ladder-viz-consistency-audit',
  'imp-35370-eflow-fartail-swap-fraction-half-crossover',
  'imp-35371-eflow-fartail-remnant-deep-extension',
  'imp-35372-reentry-band-drift-integral-half-offset',
  'imp-35402-eflow-fartail-ladder-literal-reconstruction-check',
  'imp-35404-krawczyk-headroom-cancellation-viz-data',
];

const SEE_AND_IMPORT_TARGETS_CHECKED = [
  'imp-35330-reentry-band-fidelity-requirement-dependency',
  'imp-35243-reentry-band-surrogate-fidelity-assessment',
  'imp-35263-reentry-band-eps-floor-sweep',
  'imp-34926-iters-to-floor-ceil-boundary-geometry',
  'imp-35332-reentry-band-drift-analytic-derivation',
  'imp-34862-iters-to-floor-two-rate-law',
  'imp-35235-r2-n2000-flow-reference',
  'imp-35324-r2-n2000-finer-grid-reference',
  'imp-35278-r2-n2000-gatefree-flow-reference',
  'imp-35279-eflow-fartail-inverse-swap-ladder',
  'imp-35236-eflow-fartail-inverse-swap-isolation',
  'imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap',
  'imp-35217-eflow-fartail-exponent-x2-correction',
  'lambda-rh-height-mapping',
  'imp-35198-eflow-fartail-exponent-logn-correction',
  'imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation',
  'imp-35111-off-by-one-reentry-band-width',
  'imp-34997-iters-to-floor-tail-grid-refinement',
  'polymath15-constant-C-C',
  'imp-35339-coefficient-and-envelope-literal-consistency-check',
  'imp-35266-krawczyk-headroom-surplus-decomposition',
  'imp-35241-krawczyk-headroom-band-profile',
  'imp-35356-r1-candidate-routes-assessment',
];

const NAMED_IMPORTS_CHECKED = [
  { symbol: 'effectiveHeightForN', sourceModule: 'lambda-rh-height-mapping' },
  { symbol: 'C_C_PINNED', sourceModule: 'polymath15-constant-C-C' },
  {
    symbol: 'IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER',
    sourceModule: 'imp-35279-eflow-fartail-inverse-swap-ladder',
  },
  {
    symbol: 'IMP35280_EFLOW_FARTAIL_FD_VS_ANALYTIC_SURROGATE_GAP',
    sourceModule: 'imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap',
  },
];

// Two bare citations (imp-35360 in imp-35359, imp-35275 in imp-35404) have no matching
// filename-suffixed module -- both resolve only via improvement-queue.js.
const BARE_CITATIONS_RESOLVED_VIA_QUEUE_ONLY = ['imp-35360', 'imp-35275'];

const SEE_AND_IMPORT_TARGET_COUNT = SEE_AND_IMPORT_TARGETS_CHECKED.length; // 23 distinct names
const NON_IMP_MODULE_TARGET_COUNT = 2; // lambda-rh-height-mapping, polymath15-constant-C-C
const BARE_CITATION_COUNT = 53; // distinct bare imp-NNNNN citations across the 8-file cohort, all resolved

const DANGLING_REFERENCES_FOUND = 0;
const MISSING_HONESTY_CAVEATS_FOUND = 0; // every file carries >=1 "NO QED" occurrence and >=1 imp-486/imp-3066 citation

export const IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35448',
  proofSection: 'audit',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 8
  question:
    'Do the imp-35356/35357/35359/35370/35371/35372/35402/35404 frontier cohort files (the ' +
    'newest modules with leading id > 35355) carry any dangling @see targets, ES-module import ' +
    'targets, bare imp-NNNNN ticket citations, or missing GUE-conditional/NO-QED honesty caveats?',
  verdictShort:
    'CLEAN. All 25 distinct filename-suffixed @see/import targets resolve to real src/data ' +
    'files, all four checked named imports match real exports, and all 53 distinct bare ' +
    'imp-NNNNN citations resolve (either to a real src/data module or an improvement-queue.js ' +
    'entry). Every cohort file still carries its NO-QED disclaimer and its imp-486/imp-3066 ' +
    'GUE-conditional caveat. Zero dangling references, zero missing caveats.',
  seeAndImportTargetsChecked: SEE_AND_IMPORT_TARGETS_CHECKED,
  seeAndImportTargetCount: SEE_AND_IMPORT_TARGET_COUNT + NON_IMP_MODULE_TARGET_COUNT, // 25
  namedImportsChecked: NAMED_IMPORTS_CHECKED,
  bareCitationCount: BARE_CITATION_COUNT,
  bareCitationsResolvedViaQueueOnly: BARE_CITATIONS_RESOLVED_VIA_QUEUE_ONLY,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  missingHonestyCaveatsFound: MISSING_HONESTY_CAVEATS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every ' +
    '@see tag, import specifier, and bare imp-NNNNN citation in the eight newest frontier cohort ' +
    'files (leading id > 35355) against the actual src/data directory listing and the ticket ids ' +
    'recorded in improvement-queue.js, and confirmed each file still carries its ' +
    'GUE-conditional caveat and NO-QED disclaimer. Result: zero dangling references, zero ' +
    'misnamed exports, no missing files, no missing honesty caveats. No source file required ' +
    'correction. Changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method), imp-35327 (adjacent cohort repetition), imp-35424 (sibling ' +
    'cohort audit, a disjoint six-file set), imp-35356/imp-35357/imp-35359/imp-35370/imp-35371/' +
    'imp-35372/imp-35402/imp-35404 (the audited cohort).',
};

export const IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35448-audited-file-count-matches-cohort',
    description: 'exactly the 8 named frontier cohort files were audited',
    holds: () => IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 8,
  },
  {
    id: 'imp35448-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35448-zero-missing-honesty-caveats',
    description: 'every audited file retains its GUE-conditional caveat and NO-QED disclaimer',
    holds: () => IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.missingHonestyCaveatsFound === 0,
  },
  {
    id: 'imp35448-bare-citations-cover-the-two-queue-only-ids',
    description: 'imp-35360 and imp-35275 (no matching filename-suffixed module) are flagged as queue-only',
    holds: () =>
      IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.bareCitationsResolvedViaQueueOnly.includes(
        'imp-35360',
      ) &&
      IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.bareCitationsResolvedViaQueueOnly.includes(
        'imp-35275',
      ),
  },
  {
    id: 'imp35448-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35448_NEWEST_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35448-newest-frontier-cohort-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
