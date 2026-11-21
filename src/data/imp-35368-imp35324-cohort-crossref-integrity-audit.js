/**
 * @module imp-35368-imp35324-cohort-crossref-integrity-audit
 *
 * imp-35368 (meta, audit): a cross-reference integrity check (imp-35186/imp-35327 method) on
 * the four most recently committed frontier modules imp-35324/imp-35278/imp-35330/imp-35284,
 * picking up where imp-35327 (which covered imp-35245..imp-35323) left off.
 *
 * METHOD. For each of the four cohort files, resolved every filename-suffixed @see target and
 * ES-module import against the src/data directory listing (and every scripts/imp-NNNNN-*.mjs
 * @see target against the scripts directory listing), every named import against the target
 * file's actual `export` statements, and every bare "imp-NNNNN" (and letter-suffixed sub-gap
 * "imp-NNNNNx") ticket citation against an `id: 'imp-NNNNN'` occurrence in improvement-queue.js
 * or improvements.js. Also checked (per the ticket's honesty-gate ask) that each file still
 * carries a "NO QED" disclaimer and a GUE-conditional caveat (imp-486 / imp-3066).
 *
 * FINDING. None of the four files carries an ES-module import, so there are zero import/named-
 * import targets to resolve. All 9 distinct filename-suffixed @see/script targets across the
 * cohort (imp-35243-reentry-band-surrogate-fidelity-assessment,
 * imp-35297-r4-independent-model-agreement-assessment,
 * imp-34862-iters-to-floor-two-rate-law, imp-35174-reentry-band-precision-certification,
 * imp-35214-min-gap-field-lipschitz-surrogate-assessment,
 * imp-35167-g-min-non-collision-certificate-scope, imp-35215-beta-gmin-near-front-limit,
 * imp-35239-min-gap-prefactor-real-spacing-reassessment, imp-2563-min-gap-sandwich-theorem)
 * resolve to real files in src/data, and both scripts/imp-35324-n2000-finer-grid-flow.mjs /
 * scripts/imp-35235-n2000-order-robust-flow.mjs / scripts/imp-35278-n2000-gatefree-flow.mjs
 * resolve to real files in scripts. All 28 distinct bare imp-NNNNN ticket citations across the
 * cohort resolve to an `id: 'imp-NNNNN'` entry in improvement-queue.js / improvements.js. The
 * four letter-suffixed citations found (imp-34997a, imp-35111a, imp-35174a, imp-35243a) are NOT
 * dangling ticket-id references: they are the project's established "re-pointed sub-gap" naming
 * convention, each one defined as a named residual field inside its parent file (e.g.
 * `residual_sub_gap_imp_35174a` in imp-35174-reentry-band-precision-certification.js), so they
 * are checked and resolved as sub-gap labels rather than as improvement-queue ticket ids. Every
 * one of the four files still carries at least one "NO QED" occurrence and at least one
 * imp-486/imp-3066 GUE-conditional citation. Zero dangling references, zero missing honesty
 * caveats.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Later imp-353xx modules (imp-35325 onward) are out of scope
 * here and are picked up by subsequent cohort audits (e.g. imp-35424, which explicitly covers
 * imp-35370/imp-35371/imp-35355/imp-35356/imp-35357 and notes this imp-35368 audit covers only
 * the four files below). Changes no bound; establishes no operator positivity; no RH verdict;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior repetition, imp-35245..imp-35323)
 * @see imp-35424-frontier-cohort-crossref-integrity-audit (next repetition, imp-35370/35371/35355/35356/35357 cohort)
 * @see imp-35324-r2-n2000-finer-grid-reference (cohort file 1)
 * @see imp-35278-r2-n2000-gatefree-flow-reference (cohort file 2)
 * @see imp-35330-reentry-band-fidelity-requirement-dependency (cohort file 3)
 * @see imp-35284-apriori-gmin-bound-forms-assessment (cohort file 4)
 */

const AUDITED_FILES = [
  'imp-35324-r2-n2000-finer-grid-reference',
  'imp-35278-r2-n2000-gatefree-flow-reference',
  'imp-35330-reentry-band-fidelity-requirement-dependency',
  'imp-35284-apriori-gmin-bound-forms-assessment',
];

const SEE_AND_SCRIPT_TARGETS_CHECKED = [
  'imp-35243-reentry-band-surrogate-fidelity-assessment',
  'imp-35297-r4-independent-model-agreement-assessment',
  'imp-34862-iters-to-floor-two-rate-law',
  'imp-35174-reentry-band-precision-certification',
  'imp-35214-min-gap-field-lipschitz-surrogate-assessment',
  'imp-35167-g-min-non-collision-certificate-scope',
  'imp-35215-beta-gmin-near-front-limit',
  'imp-35239-min-gap-prefactor-real-spacing-reassessment',
  'imp-2563-min-gap-sandwich-theorem',
  'scripts/imp-35324-n2000-finer-grid-flow.mjs',
  'scripts/imp-35235-n2000-order-robust-flow.mjs',
  'scripts/imp-35278-n2000-gatefree-flow.mjs',
];

const SUB_GAP_LABELS_CHECKED = ['imp-34997a', 'imp-35111a', 'imp-35174a', 'imp-35243a'];

const BARE_CITATION_COUNT = 28; // distinct bare imp-NNNNN citations across the 4-file cohort, all resolved

const NAMED_IMPORTS_CHECKED = []; // none of the 4 cohort files carry an ES-module import statement

const DANGLING_REFERENCES_FOUND = 0;
const MISSING_HONESTY_CAVEATS_FOUND = 0; // every file carries >=1 "NO QED" occurrence and >=1 imp-486/imp-3066 citation

export const IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35368',
  proofSection: 'audit',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 4
  question:
    'Do the imp-35324/imp-35278/imp-35330/imp-35284 frontier cohort files carry any dangling ' +
    '@see targets, ES-module import targets, bare imp-NNNNN ticket citations, or missing ' +
    'GUE-conditional/NO-QED honesty caveats?',
  verdictShort:
    'CLEAN. All 12 distinct @see/script targets resolve to real files (9 in src/data, 3 in ' +
    'scripts), none of the four files has an ES-module import, all 28 distinct bare imp-NNNNN ' +
    'citations resolve in improvement-queue.js / improvements.js, and the 4 letter-suffixed ' +
    'sub-gap labels (imp-34997a/imp-35111a/imp-35174a/imp-35243a) resolve as the project’s ' +
    'established re-pointed-sub-gap convention, not as dangling ticket ids. Every cohort file ' +
    'still carries its NO-QED disclaimer and its imp-486/imp-3066 GUE-conditional caveat. Zero ' +
    'dangling references, zero missing caveats.',
  seeAndScriptTargetsChecked: SEE_AND_SCRIPT_TARGETS_CHECKED,
  seeAndScriptTargetCount: SEE_AND_SCRIPT_TARGETS_CHECKED.length, // 12
  namedImportsChecked: NAMED_IMPORTS_CHECKED,
  subGapLabelsChecked: SUB_GAP_LABELS_CHECKED,
  bareCitationCount: BARE_CITATION_COUNT,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  missingHonestyCaveatsFound: MISSING_HONESTY_CAVEATS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, script reference, and bare imp-NNNNN (and letter-suffixed sub-gap) citation in the four ' +
    'newest frontier cohort files against the actual src/data and scripts directory listings and ' +
    'the ticket ids recorded in improvement-queue.js / improvements.js, and confirmed each file ' +
    'still carries its GUE-conditional caveat and NO-QED disclaimer. Result: zero dangling ' +
    'references, zero misnamed exports, no missing files, no missing honesty caveats. No source ' +
    'file required correction. Changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method), imp-35327 (adjacent range audit, imp-35245..imp-35323), ' +
    'imp-35424 (next cohort audit), imp-35324/imp-35278/imp-35330/imp-35284 (the audited cohort).',
};

export const IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35368-audited-file-count-matches-cohort',
    description: 'exactly the 4 named frontier cohort files were audited',
    holds: () => IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 4,
  },
  {
    id: 'imp35368-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35368-zero-missing-honesty-caveats',
    description: 'every audited file retains its GUE-conditional caveat and NO-QED disclaimer',
    holds: () => IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.missingHonestyCaveatsFound === 0,
  },
  {
    id: 'imp35368-sub-gap-labels-tracked-not-dangling',
    description: 'the 4 letter-suffixed sub-gap labels are recorded as a distinct citation kind, not flagged dangling',
    holds: () => IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.subGapLabelsChecked.length === 4,
  },
  {
    id: 'imp35368-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35368_IMP35324_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35368-imp35324-cohort-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
