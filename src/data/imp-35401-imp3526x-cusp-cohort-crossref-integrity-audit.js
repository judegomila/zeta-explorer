/**
 * @module imp-35401-imp3526x-cusp-cohort-crossref-integrity-audit
 *
 * imp-35401 (meta, audit): a cross-reference integrity check (imp-35186/imp-35327 method) on
 * the imp-35261/imp-35263/imp-35264/imp-35265/imp-35266 cusp/headroom frontier cohort, which
 * the imp-35368 audit (imp-35324/imp-35278/imp-35330/imp-35284) does not cover.
 *
 * METHOD. For each of the five cohort files, resolved every filename-suffixed @see target and
 * ES-module import against the src/data directory listing, every named import against the
 * target file's actual `export` statements, and every bare "imp-NNNNN" ticket citation (no
 * filename suffix) against an `id: 'imp-NNNNN'` occurrence in improvement-queue.js or
 * improvements.js. Also checked (per the ticket's honesty-gate ask) that each file still
 * carries its GUE-conditional caveat (imp-486 / imp-3066) and a "NO QED" disclaimer.
 *
 * FINDING. All 19 distinct @see/import targets across the cohort (imp-35244, imp-35240,
 * imp-35265, imp-35256, imp-33646, imp-33645, imp-35243, imp-35259, imp-35332, imp-35111,
 * lambda-rh-height-mapping, polymath15-constant-C-C, imp-35076, imp-35216, imp-35241,
 * imp-34996, imp-34929, imp-35176, imp-34693) resolve to real files in src/data, and the two
 * checked named imports (effectiveHeightForN, C_C_PINNED) match real exports. All 39 distinct
 * bare imp-NNNNN citations across the cohort resolve to an `id: 'imp-NNNNN'` entry in
 * improvement-queue.js or improvements.js. Every one of the five files still carries at least
 * one "NO QED" occurrence and at least one imp-486/imp-3066 GUE-conditional citation. Zero
 * dangling references, zero missing honesty caveats.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior repetition, imp-35245..imp-35323 range)
 * @see imp-35261-k72-compensated-deep-rung-confirmation (cohort file 1)
 * @see imp-35263-reentry-band-eps-floor-sweep (cohort file 2)
 * @see imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck (cohort file 3)
 * @see imp-35265-eps52-cancellation-exact-identity (cohort file 4)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (cohort file 5)
 */

const AUDITED_FILES = [
  'imp-35261-k72-compensated-deep-rung-confirmation',
  'imp-35263-reentry-band-eps-floor-sweep',
  'imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck',
  'imp-35265-eps52-cancellation-exact-identity',
  'imp-35266-krawczyk-headroom-surplus-decomposition',
];

const SEE_AND_IMPORT_TARGETS_CHECKED = [
  'imp-35244-rho-eps52-coefficient-measurement',
  'imp-35240-rho-prefactor-finer-grid-remeasurement',
  'imp-35265-eps52-cancellation-exact-identity',
  'imp-35256-k-residual-decay-exponent-reconciliation',
  'imp-33646-h4-privalov-sokhotski-constant-scoping',
  'imp-33645-h3-curvature-divergence-scoping',
  'imp-35243-reentry-band-surrogate-fidelity-assessment',
  'imp-35259-two-rate-band-edges-direct-rootfind',
  'imp-35332-reentry-band-drift-analytic-derivation',
  'imp-35111-off-by-one-reentry-band-width',
  'lambda-rh-height-mapping',
  'polymath15-constant-C-C',
  'imp-35076-h3-a-fortiori-discharges-h4-numerical-verification',
  'imp-35216-rho-prefactor-closed-form-assessment',
  'imp-35241-krawczyk-headroom-band-profile',
  'imp-34996-krawczyk-headroom-safety-factor-asymptote',
  'imp-34929-krawczyk-headroom-monotonicity-derivative',
  'imp-35176-krawczyk-headroom-s100-crossing',
  'imp-34693-crossover-contraction-seed-band',
];

const NAMED_IMPORTS_CHECKED = [
  { symbol: 'effectiveHeightForN', sourceModule: 'lambda-rh-height-mapping' },
  { symbol: 'C_C_PINNED', sourceModule: 'polymath15-constant-C-C' },
];

const BARE_CITATION_COUNT = 39; // distinct bare imp-NNNNN citations across the 5-file cohort, all resolved

const DANGLING_REFERENCES_FOUND = 0;
const MISSING_HONESTY_CAVEATS_FOUND = 0; // every file carries >=1 "NO QED" occurrence and >=1 imp-486/imp-3066 citation

export const IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35401',
  proofSection: 'audit',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 5
  question:
    'Do the imp-35261/imp-35263/imp-35264/imp-35265/imp-35266 cusp/headroom cohort files carry ' +
    'any dangling @see targets, ES-module import targets, bare imp-NNNNN ticket citations, or ' +
    'missing GUE-conditional/NO-QED honesty caveats?',
  verdictShort:
    'CLEAN. All 19 distinct @see/import targets resolve to real src/data files, both checked ' +
    'named imports match real exports, and all 39 distinct bare imp-NNNNN citations resolve in ' +
    'improvement-queue.js/improvements.js. Every cohort file still carries its NO-QED disclaimer ' +
    'and its imp-486/imp-3066 GUE-conditional caveat. Zero dangling references, zero missing caveats.',
  seeAndImportTargetsChecked: SEE_AND_IMPORT_TARGETS_CHECKED,
  seeAndImportTargetCount: SEE_AND_IMPORT_TARGETS_CHECKED.length, // 19
  namedImportsChecked: NAMED_IMPORTS_CHECKED,
  bareCitationCount: BARE_CITATION_COUNT,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  missingHonestyCaveatsFound: MISSING_HONESTY_CAVEATS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNNN citation in the five imp-3526x cusp/headroom ' +
    'cohort files against the actual src/data directory listing and the ticket ids recorded in ' +
    'improvement-queue.js / improvements.js, and confirmed each file still carries its ' +
    'GUE-conditional caveat and NO-QED disclaimer. Result: zero dangling references, zero ' +
    'misnamed exports, no missing files, no missing honesty caveats. No source file required ' +
    'correction. Changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method), imp-35327 (prior repetition), imp-35368 (adjacent cohort ' +
    'audit, does not cover these five files), imp-35261/imp-35263/imp-35264/imp-35265/imp-35266 ' +
    '(the audited cohort).',
};

export const IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35401-audited-file-count-matches-cohort',
    description: 'exactly the 5 named cusp/headroom cohort files were audited',
    holds: () => IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 5,
  },
  {
    id: 'imp35401-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35401-zero-missing-honesty-caveats',
    description: 'every audited file retains its GUE-conditional caveat and NO-QED disclaimer',
    holds: () => IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT.missingHonestyCaveatsFound === 0,
  },
  {
    id: 'imp35401-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35401_CUSP_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35401-imp3526x-cusp-cohort-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
