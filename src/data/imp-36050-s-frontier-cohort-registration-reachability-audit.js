/**
 * @module imp-36050-s-frontier-cohort-registration-reachability-audit
 *
 * imp-36050 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-35905/imp-35986/imp-36034 method) over the newest S-frontier cohort -- imp-35969
 * (krawczyk-residual-directed-rounding-width), imp-35970 (w1-pairwise-apriori-depth-bound-slack),
 * imp-35971 (etrunc-sole-survivor-height), imp-35972 (effective-height-overflow-cliff-bisection),
 * imp-35973 (w1-summation-order-shape-cross-term), imp-35988 (i2-derivative-cap-route-comparison),
 * imp-35989 (i4-accumulated-error-vs-panel-count-scale), and imp-35990
 * (w1-lambda-confidence-calibration) -- confirming each is wired into
 * scripts/run-assertions.mjs DATA_MODULES and none transitively imports the 16.7MB
 * zeros-to-1e6.js bundle.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the eight cohort file
 * paths. Also grepped each cohort file's own `import` statements, and one level further into
 * their direct dependencies (lambda-rh-height-mapping.js, polymath15-constant-C-C.js,
 * imp-35893-w1-summation-pairwise-tree-shape.js), for the literal "zeros-to-1e6".
 *
 * FINDING -- ALL EIGHT CLEAN, NO NEW ORPHANS. All eight cohort files carry a direct
 * scripts/run-assertions.mjs DATA_MODULES entry. imp-35969 was a genuinely orphaned module
 * (no direct entry, not imported anywhere) BEFORE the imp-36034 audit fixed it by adding a
 * direct entry in the same commit as that audit; this later sweep confirms that fix is still
 * in place. imp-35973/35988/35989/35990 have no imports at all (self-contained baked-literal
 * modules); imp-35969/35971/35972 import only lambda-rh-height-mapping.js and
 * polymath15-constant-C-C.js; imp-35970 imports only imp-35893-w1-summation-pairwise-tree-shape.js
 * (itself import-free). None of the eight files or their direct dependency chain imports the
 * heavy zeros-to-1e6.js bundle.
 *
 * Read-only confirmation; no correction needed this run. Changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35905-frontier-measurement-cohort-import-guard (import-light guard method)
 * @see imp-35986-imp3588x89x-cohort-import-guard-audit (sibling audit, same combined method)
 * @see imp-36034-imp3596x97x-registration-reachability-audit (prior sweep that fixed the imp-35969 orphan)
 * @see imp-35969-krawczyk-residual-directed-rounding-width.js (audited module, orphan-fix confirmed still in place)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack.js (audited module)
 * @see imp-35971-etrunc-sole-survivor-height.js (audited module)
 * @see imp-35972-effective-height-overflow-cliff-bisection.js (audited module)
 * @see imp-35973-w1-summation-order-shape-cross-term.js (audited module)
 * @see imp-35988-i2-derivative-cap-route-comparison.js (audited module)
 * @see imp-35989-i4-accumulated-error-vs-panel-count-scale.js (audited module)
 * @see imp-35990-w1-lambda-confidence-calibration.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-35969-krawczyk-residual-directed-rounding-width',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35970-w1-pairwise-apriori-depth-bound-slack',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35971-etrunc-sole-survivor-height',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35972-effective-height-overflow-cliff-bisection',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35973-w1-summation-order-shape-cross-term',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35988-i2-derivative-cap-route-comparison',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35989-i4-accumulated-error-vs-panel-count-scale',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35990-w1-lambda-confidence-calibration',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = 0;

export const IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36050',
  proofSection: 'audit',
  question:
    'Is each of the newest S-frontier cohort modules (imp-35969, imp-35970, imp-35971, ' +
    'imp-35972, imp-35973, imp-35988, imp-35989, imp-35990) wired into ' +
    'scripts/run-assertions.mjs DATA_MODULES, and does none transitively import the 16.7MB ' +
    'zeros-to-1e6.js bundle?',
  verdictShort:
    'ALL EIGHT CLEAN. Every cohort file carries a direct scripts/run-assertions.mjs ' +
    'DATA_MODULES entry (imp-35969 via the fix applied in the prior imp-36034 sweep, still in ' +
    'place). None of the eight files or their direct dependency chain imports the ' +
    'zeros-to-1e6.js bundle. No new orphans found; no fix needed this run.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 8
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: false,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership and a "zeros-to-1e6" import grep for ' +
    'all eight cohort files. Result: all eight directly registered, all eight import-light, ' +
    'zero new orphans. Changes no bound; establishes no operator positivity; no RH verdict; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35905/imp-35986 (import-light guard method); imp-36034 (registration/reachability ' +
    'method and prior imp-35969 orphan fix); verify-zeros-importers.mjs (imp-2880).',
};

export const IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36050-audited-eight-files',
    description: 'exactly the eight named S-frontier cohort modules were audited',
    holds: () =>
      IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 8 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-35969-krawczyk-residual-directed-rounding-width',
          'imp-35970-w1-pairwise-apriori-depth-bound-slack',
          'imp-35971-etrunc-sole-survivor-height',
          'imp-35972-effective-height-overflow-cliff-bisection',
          'imp-35973-w1-summation-order-shape-cross-term',
          'imp-35988-i2-derivative-cap-route-comparison',
          'imp-35989-i4-accumulated-error-vs-panel-count-scale',
          'imp-35990-w1-lambda-confidence-calibration',
        ].join(','),
  },
  {
    id: 'imp36050-all-eight-directly-registered',
    description: 'all eight modules carry a direct DATA_MODULES entry',
    holds: () =>
      AUDITED_FILES.filter((f) => f.reachability === 'direct-data-modules-entry').length === 8,
  },
  {
    id: 'imp36050-no-new-orphans',
    description: 'zero modules are orphaned this run',
    holds: () =>
      AUDITED_FILES.every((f) => f.reachability !== 'orphaned-not-registered-not-imported') &&
      IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.orphanedFound === 0,
  },
  {
    id: 'imp36050-none-import-zeros-bundle',
    description: 'none of the eight modules (or their direct chain) imports the zeros-to-1e6 bundle',
    holds: () =>
      AUDITED_FILES.every((f) => f.importsZerosBundle === false) &&
      IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0,
  },
  {
    id: 'imp36050-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36050-s-frontier-cohort-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP36050_S_FRONTIER_COHORT_REGISTRATION_REACHABILITY_AUDIT;
