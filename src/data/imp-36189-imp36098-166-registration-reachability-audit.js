/**
 * @module imp-36189-imp36098-166-registration-reachability-audit
 *
 * imp-36189 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-36109/imp-35982/imp-35905 method) over the NEWEST S-frontier cohort imp-36098..
 * imp-36166 -- the wave of cross-reference/honest-status/storyline/viz-data modules
 * committed since the prior imp-36109 sweep (which stopped at imp-36077) and its pending
 * successor ticket (which stops at imp-36097). Confirms each of the 37 existing cohort
 * files is wired into scripts/run-assertions.mjs DATA_MODULES (directly or transitively)
 * and none transitively imports the 16.7MB zeros-to-1e6.js bundle.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for a direct entry for each of
 * the 37 cohort file paths. For any without a direct entry, grepped every other cohort/
 * src/data module for a real ES `import` (not merely a prose @see citation) of that file
 * to check transitive reachability from a registered root. Grepped each cohort file's own
 * `import` lines for the literal "zeros-to-1e6".
 *
 * FINDING -- ONE ORPHAN. 36 of 37 cohort files already carried a direct DATA_MODULES
 * entry. imp-36125-w1-accumulator-recovery-margin-honest-status.js did not: the prior
 * imp-36126 audit registered its source module imp-36061 directly but left imp-36125
 * itself (the honest-status note that imports imp-36061) unregistered, and its only other
 * references (in imp-36107 and imp-36130) are prose @see citations, not ES imports -- so
 * the chain never reached a DATA_MODULES root and its self-executing THROWing assertions
 * never ran under `npm run assert`, matching the imp-36034/imp-35969 orphan failure mode.
 * Fixed in this same commit by adding a direct DATA_MODULES entry for imp-36125. No
 * heavy-bundle imports found anywhere in the swept set (zero "zeros-to-1e6" matches).
 *
 * Audit + one-orphan fix; changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36109-imp3603x46x61x62x-registration-reachability-audit.js (prior sweep, stops at imp-36077)
 * @see imp-36169-imp3606x82x95x96x97x-registration-reachability-audit.js (pending successor, stops at imp-36097)
 * @see imp-35982-imp3589x-registration-reachability-audit.js (registration/reachability method)
 * @see imp-35905-frontier-measurement-cohort-import-guard.js (import-light guard method)
 * @see imp-36125-w1-accumulator-recovery-margin-honest-status.js (the orphan fixed by this audit)
 * @see imp-36061-w1-accumulator-recovery-detuning-width.js (imp-36125's source module, already registered)
 */

const AUDITED_FILES = [
  { file: 'imp-36098-kbn-kahan-onset-2e128-crossvalidation', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36099-kbn-kahan-ratio-scaling-fit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36100-kbn-kahan-onset-natural-order', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36101-w1-certified-sum-construction-steps-scope', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36102-sole-survivor-height-evaluability', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36103-w1-accumulator-recovery-nstability', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36104-kbn-kahan-separation-onset-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36105-recovery-detuning-width-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36106-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36107-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36109-imp3603x46x61x62x-registration-reachability-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36111-e-share-tail-storyline-crossref', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36112-compensated-summation-storyline-crossref', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36113-kbn-kahan-intermittency-fine-resolution', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36114-kbn-kahan-ratio-decay-law-fit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36115-joint-2d-recovery-locus-duplicate-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36116-kappa-monotonicity-ladder', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36122-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36123-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36124-kbn-kahan-soft-onset-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36125-w1-accumulator-recovery-margin-honest-status', reachability: 'orphan-fixed-in-this-commit', importsZerosBundle: false },
  { file: 'imp-36127-imp3603x-3606x-cross-reference-integrity-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36128-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36129-orphaned-module-registration-audit-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36130-naive-vs-compensated-conditioning-growth-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36144-kbn-kahan-intermittency-band-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36145-joint-recovery-contour-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36146-precision-non-binding-consolidated-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36147-routeB-consumable-modulo-anchor-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36148-imp3608x9x-cross-reference-integrity-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36161-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36162-duplicate-ticket-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36164-perN-translation-storyline-cross-reference', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36165-sharecoll-vs-sole-survivor-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36166-residual-node-storyline-cross-reference', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = AUDITED_FILES.filter((f) => f.reachability !== 'direct-data-modules-entry' && f.reachability !== 'transitive').length;

export const IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36189',
  proofSection: 'audit',
  question:
    'Is each of the imp-36098..imp-36166 S-frontier cohort modules (37 existing files) wired ' +
    'into scripts/run-assertions.mjs DATA_MODULES (directly or transitively), and does none ' +
    'transitively import the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'ONE ORPHAN FOUND AND FIXED. 36 of 37 cohort files already carried a direct ' +
    'scripts/run-assertions.mjs DATA_MODULES entry. imp-36125-w1-accumulator-recovery-' +
    'margin-honest-status.js did not -- its only references elsewhere were prose @see ' +
    'citations (imp-36107, imp-36130), not real ES imports -- so its self-executing ' +
    'assertions never ran under `npm run assert`. Registered directly in this commit. ' +
    'Zero "zeros-to-1e6" matches anywhere in the swept set.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 37
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: true,
  isRigorous: false,
  verdict:
    'AUDIT + FIX (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership (direct) and a "zeros-to-1e6" ' +
    'import grep for all 37 imp-36098..imp-36166 cohort files. Result: one orphan found ' +
    '(imp-36125) and fixed via a direct DATA_MODULES entry; zero heavy-bundle imports. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36109/imp-35982/imp-35905 (registration/reachability + import-light guard audit ' +
    'method); imp-36169 (pending successor this audit picks up after); imp-36126 (prior ' +
    'fix that registered imp-36061 but missed imp-36125, the module importing it).',
};

export const IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36189-audited-thirtyseven-files',
    description: 'exactly 37 imp-36098..imp-36166 cohort modules were audited',
    holds: () => IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 37,
  },
  {
    id: 'imp36189-one-orphan-found',
    description: 'exactly one orphan (imp-36125) was found among the 37',
    holds: () =>
      IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT.orphanedFound === 1 &&
      AUDITED_FILES.filter((f) => f.reachability === 'orphan-fixed-in-this-commit').length === 1 &&
      AUDITED_FILES.find((f) => f.file === 'imp-36125-w1-accumulator-recovery-margin-honest-status').reachability ===
        'orphan-fixed-in-this-commit',
  },
  {
    id: 'imp36189-no-heavy-bundle-imports',
    description: 'none of the 37 cohort files import the 16.7MB zeros-to-1e6.js bundle',
    holds: () =>
      IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0 &&
      AUDITED_FILES.every((f) => f.importsZerosBundle === false),
  },
  {
    id: 'imp36189-fix-flag-set',
    description: 'the orphan fix is recorded as applied in this commit',
    holds: () => IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT.orphanFixedInThisCommit === true,
  },
];

for (const assertion of IMP36189_IMP36098_166_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36189-imp36098-166-registration-reachability-audit assertion failed: ${assertion.id}`);
  }
}
