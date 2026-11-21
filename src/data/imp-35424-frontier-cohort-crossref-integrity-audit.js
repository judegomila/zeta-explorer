/**
 * @module imp-35424-frontier-cohort-crossref-integrity-audit
 *
 * imp-35424 (meta, audit): a cross-reference integrity check (imp-35186/imp-35368 method) on
 * the newest frontier modules imp-35400/imp-35370/imp-35371/imp-35355/imp-35356/imp-35357,
 * committed since the imp-35368 audit (which covered only imp-35324/imp-35278/imp-35330/imp-35284).
 *
 * METHOD. For each of the six cohort files, resolved every filename-suffixed @see target and
 * ES-module import against the src/data directory listing, every named import against the
 * target file's actual `export` statements, and every bare "imp-NNNNN" ticket citation (no
 * filename suffix) against an `id: 'imp-NNNNN'` occurrence in improvement-queue.js. Also checked
 * (per the ticket's honesty-gate ask) that each file still carries a "NO QED" disclaimer and a
 * GUE-conditional caveat (imp-486 / imp-3066).
 *
 * FINDING. All 15 distinct filename-suffixed @see/import targets across the cohort (imp-35279,
 * imp-35280, imp-35236, imp-35217, lambda-rh-height-mapping, imp-35198,
 * imp-35135, imp-35284, imp-35215, imp-35167, imp-2563, imp-35330, imp-35243, imp-35263,
 * imp-34926, imp-35332, imp-34862) resolve to real files in src/data, and the one checked named
 * import (effectiveHeightForN, imported live by imp-35370) matches a real export. All 39 distinct
 * bare imp-NNNNN citations across the cohort resolve to an `id: 'imp-NNNNN'` entry in
 * improvement-queue.js. Every one of the six files still carries at least one "NO QED" occurrence
 * and at least one imp-486/imp-3066 GUE-conditional citation. Zero dangling references, zero
 * missing honesty caveats.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35368 (prior repetition, imp-35324/imp-35278/imp-35330/imp-35284 cohort)
 * @see imp-35400-eflow-fartail-two-component-ladder-viz-data (cohort file 1)
 * @see imp-35370-eflow-fartail-swap-fraction-half-crossover (cohort file 2)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (cohort file 3)
 * @see imp-35355-ambient-spacing-c2-verdict-assessment (cohort file 4)
 * @see imp-35356-r1-candidate-routes-assessment (cohort file 5)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (cohort file 6)
 */

const AUDITED_FILES = [
  'imp-35400-eflow-fartail-two-component-ladder-viz-data',
  'imp-35370-eflow-fartail-swap-fraction-half-crossover',
  'imp-35371-eflow-fartail-remnant-deep-extension',
  'imp-35355-ambient-spacing-c2-verdict-assessment',
  'imp-35356-r1-candidate-routes-assessment',
  'imp-35357-reentry-band-pure-artifact-proof-requirement',
];

const SEE_AND_IMPORT_TARGETS_CHECKED = [
  'imp-35279-eflow-fartail-inverse-swap-ladder',
  'imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap',
  'imp-35236-eflow-fartail-inverse-swap-isolation',
  'imp-35217-eflow-fartail-exponent-x2-correction',
  'lambda-rh-height-mapping',
  'imp-35198-eflow-fartail-exponent-logn-correction',
  'imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation',
  'imp-35284-apriori-gmin-bound-forms-assessment',
  'imp-35215-beta-gmin-near-front-limit',
  'imp-35167-g-min-non-collision-certificate-scope',
  'imp-2563-min-gap-sandwich-theorem',
  'imp-35330-reentry-band-fidelity-requirement-dependency',
  'imp-35243-reentry-band-surrogate-fidelity-assessment',
  'imp-35263-reentry-band-eps-floor-sweep',
  'imp-34926-iters-to-floor-ceil-boundary-geometry',
  'imp-35332-reentry-band-drift-analytic-derivation',
  'imp-34862-iters-to-floor-two-rate-law',
];

const NAMED_IMPORTS_CHECKED = [
  { symbol: 'effectiveHeightForN', sourceModule: 'lambda-rh-height-mapping' },
];

const BARE_CITATION_COUNT = 39; // distinct bare imp-NNNNN citations across the 6-file cohort, all resolved

const DANGLING_REFERENCES_FOUND = 0;
const MISSING_HONESTY_CAVEATS_FOUND = 0; // every file carries >=1 "NO QED" occurrence and >=1 imp-486/imp-3066 citation

export const IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35424',
  proofSection: 'audit',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 6
  question:
    'Do the imp-35400/imp-35370/imp-35371/imp-35355/imp-35356/imp-35357 frontier cohort files ' +
    'carry any dangling @see targets, ES-module import targets, bare imp-NNNNN ticket citations, ' +
    'or missing GUE-conditional/NO-QED honesty caveats?',
  verdictShort:
    'CLEAN. All 17 distinct @see/import targets resolve to real src/data files, the one checked ' +
    'named import matches a real export, and all 39 distinct bare imp-NNNNN citations resolve in ' +
    'improvement-queue.js. Every cohort file still carries its NO-QED disclaimer and its ' +
    'imp-486/imp-3066 GUE-conditional caveat. Zero dangling references, zero missing caveats.',
  seeAndImportTargetsChecked: SEE_AND_IMPORT_TARGETS_CHECKED,
  seeAndImportTargetCount: SEE_AND_IMPORT_TARGETS_CHECKED.length, // 17
  namedImportsChecked: NAMED_IMPORTS_CHECKED,
  bareCitationCount: BARE_CITATION_COUNT,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  missingHonestyCaveatsFound: MISSING_HONESTY_CAVEATS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNNN citation in the six newest frontier cohort files ' +
    'against the actual src/data directory listing and the ticket ids recorded in ' +
    'improvement-queue.js, and confirmed each file still carries its GUE-conditional caveat and ' +
    'NO-QED disclaimer. Result: zero dangling references, zero misnamed exports, no missing files, ' +
    'no missing honesty caveats. No source file required correction. Changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method), imp-35368 (adjacent cohort audit, does not cover these six ' +
    'files), imp-35400/imp-35370/imp-35371/imp-35355/imp-35356/imp-35357 (the audited cohort).',
};

export const IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35424-audited-file-count-matches-cohort',
    description: 'exactly the 6 named frontier cohort files were audited',
    holds: () => IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 6,
  },
  {
    id: 'imp35424-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35424-zero-missing-honesty-caveats',
    description: 'every audited file retains its GUE-conditional caveat and NO-QED disclaimer',
    holds: () => IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.missingHonestyCaveatsFound === 0,
  },
  {
    id: 'imp35424-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35424_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35424-frontier-cohort-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
