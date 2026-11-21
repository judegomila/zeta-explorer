/**
 * @module imp-35941-numerical-cohort-registration-reachability-audit
 *
 * imp-35941 (meta, audit): registration/reachability + import-light check (imp-35590/
 * imp-35838/imp-35858 method) on the four-module numerical cohort imp-35852/imp-35853/
 * imp-35854/imp-35855.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the four file
 * paths, confirmed each source module exports both a result-object const and a paired
 * `*_ASSERTIONS` array, then grepped src/App.jsx, src/data/visualizations-index.js, and
 * src/data/glossary.js to classify each module as viz-registered vs registry-only, and
 * finally walked each module's static-import closure by hand to confirm none
 * transitively imports src/data/zeros-to-1e6.js (the ~16.7MB zeros bundle).
 *
 * FINDING -- ONE GENUINE ORPHAN. imp-35853, imp-35854, and imp-35855 were all
 * DATA_MODULES-listed and export a result-object const plus a `*_ASSERTIONS` array.
 * But imp-35852-w1-summation-adversarial-ordering.js -- despite exporting
 * IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING and its paired `_ASSERTIONS` array
 * correctly -- was NEVER added to DATA_MODULES, so its five self-executing assertions
 * silently never ran under `npm run assert`. This is the exact orphan class imp-35827/
 * imp-35858 fixed for earlier cohorts. Fixed by adding it to DATA_MODULES (this commit,
 * alongside this audit module).
 *
 * VIZ STATUS (no mismatch -- each module's status is the intended one). imp-35852,
 * imp-35853, and imp-35854 each have a dedicated baked-literal viz-data module
 * (imp-35935/imp-35936/imp-35934 respectively) registered in
 * src/data/visualizations-index.js with its own page, none of which imports the source
 * module (per [[no_heavy_imports_in_pages]] -- literals are copied verbatim). imp-35855
 * is registry-only: it is mentioned by name in two src/data/glossary.js prose entries
 * (no live import) and has no viz page, which matches its role as a scoping/assessment
 * note rather than a chartable measurement.
 *
 * IMPORT-LIGHT. Walked the static-import closure of all four source modules by hand:
 * imp-35852 and imp-35854 import nothing (closure size 1, self-contained); imp-35853
 * pulls in lambda-rh-height-mapping.js, polymath15-constant-C-C.js, and two upstream
 * scope modules (closure size 19); imp-35855 pulls in lambda-rh-height-mapping.js and
 * polymath15-constant-C-C.js (closure size 14). Neither closure reaches
 * src/data/zeros-to-1e6.js or any other zeros-table module.
 *
 * SCOPE. Audit + minimal wiring fix only. No mathematical content was changed in any
 * audited module. Changes no bound; establishes no operator positivity; no RH verdict;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35590-registration-reachability-audit (method precedent)
 * @see imp-35838-frontier-batch-registration-reachability-audit.js (method precedent)
 * @see imp-35858-newer-cohort-registration-reachability-audit.js (method precedent, prior cohort)
 * @see imp-35827 (fixed the identical orphan-DATA_MODULES-entry class for an earlier cohort)
 * @see imp-35852-w1-summation-adversarial-ordering.js (audited module -- was orphaned, now fixed)
 * @see imp-35853-req4-required-height-continuous-sigma-knee.js (audited module)
 * @see imp-35854-w1-summation-kappa-sweep.js (audited module)
 * @see imp-35855-rclean-interval-de-cancellation-assessment.js (audited module)
 */

const AUDITED_BATCH = [
  {
    file: 'imp-35852-w1-summation-adversarial-ordering',
    resultExport: 'IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING',
    listedInDataModulesBeforeFix: false,
    hasAssertionsExport: true,
    hasVizPage: true,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35853-req4-required-height-continuous-sigma-knee',
    resultExport: 'IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35854-w1-summation-kappa-sweep',
    resultExport: 'IMP35854_W1_SUMMATION_KAPPA_SWEEP',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    importClosureReachesZerosBundle: false,
  },
  {
    file: 'imp-35855-rclean-interval-de-cancellation-assessment',
    resultExport: 'IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    importClosureReachesZerosBundle: false,
  },
];

const ORPHANS_FOUND = AUDITED_BATCH.filter((m) => !m.listedInDataModulesBeforeFix);

export const IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35941',
  proofSection: 'audit',
  question:
    'Do the four numerical-cohort modules imp-35852/imp-35853/imp-35854/imp-35855 each ' +
    'export a result-object const plus a wired *_ASSERTIONS array registered in ' +
    'scripts/run-assertions.mjs, is each reachable from a page or index (viz page or ' +
    'glossary), and does none transitively import the 16.7MB zeros bundle?',
  verdictShort:
    'ONE ORPHAN FOUND AND FIXED. imp-35853/imp-35854/imp-35855 were already fully wired. ' +
    'imp-35852-w1-summation-adversarial-ordering.js exported a correct result const and ' +
    '*_ASSERTIONS array but was never added to DATA_MODULES, so its assertions never ran ' +
    'under `npm run assert`. Fixed by adding it to DATA_MODULES. No viz-status mismatch: ' +
    'three modules (imp-35852/35853/35854) have dedicated viz pages via ' +
    'visualizations-index.js and one (imp-35855) is intentionally registry-only, named in ' +
    'glossary.js prose. All four import-light: none transitively reaches zeros-to-1e6.js.',
  auditedBatch: AUDITED_BATCH,
  danglingOrOrphanedFound: ORPHANS_FOUND.length,
  orphanedFiles: ORPHANS_FOUND.map((m) => m.file),
  vizStatusMismatchFound: 0,
  importHeavyBundleFound: 0,
  isRigorous: false,
  verdict:
    'AUDIT + MINIMAL FIX (not rigorous, not a measurement of a mathematical quantity). ' +
    'Checked scripts/run-assertions.mjs DATA_MODULES wiring, each module’s exports, ' +
    'src/data/visualizations-index.js / src/data/glossary.js reachability, and each ' +
    'module’s static-import closure for four cohort modules. Result: one genuine orphan ' +
    '(imp-35852, missing DATA_MODULES entry) found and fixed; no viz-status mismatch; no ' +
    'heavy-bundle import. Changes no bound; establishes no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35852, imp-35853, imp-35854, imp-35855 (audited modules); imp-35590/imp-35838/' +
    'imp-35858 (registration/reachability method); imp-35827 (identical orphan class ' +
    'fixed in an earlier cohort); imp-35935/imp-35936/imp-35934 (viz-data modules for ' +
    'imp-35852/imp-35853/imp-35854 respectively).',
};

export const IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35941-batch-size-four',
    description: 'exactly four modules were audited',
    holds: () => AUDITED_BATCH.length === 4,
  },
  {
    id: 'imp35941-all-have-assertions-export-and-result-export',
    description: 'every audited file exports a result-object const and a *_ASSERTIONS export',
    holds: () => AUDITED_BATCH.every((m) => m.hasAssertionsExport === true && !!m.resultExport),
  },
  {
    id: 'imp35941-exactly-one-orphan-found',
    description: 'exactly one module (imp-35852) was missing from DATA_MODULES before this fix',
    holds: () =>
      ORPHANS_FOUND.length === 1 &&
      ORPHANS_FOUND[0].file === 'imp-35852-w1-summation-adversarial-ordering',
  },
  {
    id: 'imp35941-orphan-count-matches-summary-field',
    description: 'danglingOrOrphanedFound matches the actual orphan count',
    holds: () =>
      IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound ===
      ORPHANS_FOUND.length,
  },
  {
    id: 'imp35941-viz-page-status-matches-expected-mix',
    description: 'three modules have a viz page (imp-35852/35853/35854), one does not (imp-35855)',
    holds: () =>
      AUDITED_BATCH.filter((m) => m.hasVizPage === true).length === 3 &&
      AUDITED_BATCH.find((m) => m.file.startsWith('imp-35855')).hasVizPage === false,
  },
  {
    id: 'imp35941-no-module-imports-heavy-zeros-bundle',
    description: 'no audited module transitively imports the 16.7MB zeros-to-1e6.js bundle',
    holds: () => AUDITED_BATCH.every((m) => m.importClosureReachesZerosBundle === false),
  },
  {
    id: 'imp35941-honesty-gate-no-qed',
    description: 'Audit + minimal fix only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35941_NUMERICAL_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35941-numerical-cohort-registration-reachability-audit assertion failed: ${a.id}`);
  }
}
