/**
 * @module imp-95650-frontier-cluster-reachability-audit
 *
 * imp-95650 (bug, audit): a registration/reachability + import-light guard sweep
 * (imp-36109/imp-35982/imp-35905 method) over the newest frontier cluster --
 * imp-95614, imp-95616, imp-95617, imp-95618, imp-95619, imp-95621, imp-95625, imp-95631,
 * imp-95632 -- confirming each is wired into scripts/run-assertions.mjs DATA_MODULES
 * (directly or transitively) and that none transitively imports the 16.7MB
 * zeros-to-1e6.js bundle.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for a direct entry for each of
 * the nine cluster files. For files with no direct entry, grepped src/ for an `import`
 * statement (not a prose/comment mention of the imp-id) pulling in that file's exports,
 * then checked whether the importer itself had a DATA_MODULES entry. For the import-light
 * guard, grepped each cluster file's own `^import` lines and its direct dependency chain
 * (lambda-rh-height-mapping.js, polymath15-constant-C-C.js) for the literal "zeros-to-1e6".
 *
 * FINDING -- NINE OF NINE ORPHANED, SIX FIXED IN THIS COMMIT. None of the nine carried a
 * direct DATA_MODULES entry. Many are mentioned by imp-id in the prose of sibling data
 * modules (imp-95638, imp-95640, imp-95637, imp-95516, imp-95519, imp-95632, glossary.js)
 * and one pair (imp-95616, imp-95621) is imported by a page component
 * (Imp95645KroneckerTransferConstantViz.jsx, Imp95647ConditionNumberViz.jsx) -- but none of
 * those referencing files is itself a genuine `import` of the target's exports from a
 * DATA_MODULES-registered file, so none of the nine ran under `npm run assert` pre-audit.
 * Six of the nine (imp-95614, imp-95616, imp-95617, imp-95621, imp-95625, imp-95631) carry
 * self-executing throw-on-import assertions (imp-3715 convention) that were dead code from
 * the sweep's perspective -- fixed in this commit by adding direct DATA_MODULES entries.
 * The remaining three (imp-95618, imp-95619, imp-95632) export an *_ASSERTIONS array but
 * have no self-executing throw loop, so registering them alone would not exercise anything;
 * left as read-only orphans for a follow-up ticket that also adds the throw loop. All nine
 * are import-light: zero "zeros-to-1e6" matches anywhere in the swept set or its direct
 * dependency chain.
 *
 * FIX APPLIED. Added direct scripts/run-assertions.mjs DATA_MODULES entries for
 * imp-95614/95616/95617/95621/95625/95631 so their assertions now run under `npm run
 * assert`. Otherwise read-only. Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36109-imp3603x46x61x62x-registration-reachability-audit.js (registration/reachability + import-light guard method)
 * @see imp-35905-frontier-measurement-cohort-import-guard.js (import-light guard method)
 * @see imp-95614-sigma-exponent-ramp-crosscheck.js (audited module, ORPHANED -- fixed)
 * @see imp-95616-kronecker-suprms-crosscheck.js (audited module, ORPHANED -- fixed)
 * @see imp-95617-transition-knee-ordering-joint-2d.js (audited module, ORPHANED -- fixed)
 * @see imp-95618-sun-s9-signfix-placement-robustness.js (audited module, ORPHANED -- no throw loop, left open)
 * @see imp-95619-vk-crossover-reconcile.js (audited module, ORPHANED -- no throw loop, left open)
 * @see imp-95621-alt-form-precision-threshold.js (audited module, ORPHANED -- fixed)
 * @see imp-95625-sigma-exponent-crossing-ladder-table.js (audited module, ORPHANED -- fixed)
 * @see imp-95631-sigma-logspace-vs-direct-overlap-band.js (audited module, ORPHANED -- fixed)
 * @see imp-95632-vk-crossover-height-gap.js (audited module, ORPHANED -- no throw loop, left open)
 */

const AUDITED_FILES = [
  { file: 'imp-95614-sigma-exponent-ramp-crosscheck', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: true, fixedInThisCommit: true, importsZerosBundle: false },
  { file: 'imp-95616-kronecker-suprms-crosscheck', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: true, fixedInThisCommit: true, importsZerosBundle: false },
  { file: 'imp-95617-transition-knee-ordering-joint-2d', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: true, fixedInThisCommit: true, importsZerosBundle: false },
  { file: 'imp-95618-sun-s9-signfix-placement-robustness', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: false, fixedInThisCommit: false, importsZerosBundle: false },
  { file: 'imp-95619-vk-crossover-reconcile', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: false, fixedInThisCommit: false, importsZerosBundle: false },
  { file: 'imp-95621-alt-form-precision-threshold', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: true, fixedInThisCommit: true, importsZerosBundle: false },
  { file: 'imp-95625-sigma-exponent-crossing-ladder-table', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: true, fixedInThisCommit: true, importsZerosBundle: false },
  { file: 'imp-95631-sigma-logspace-vs-direct-overlap-band', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: true, fixedInThisCommit: true, importsZerosBundle: false },
  { file: 'imp-95632-vk-crossover-height-gap', reachability: 'orphaned-not-registered-not-imported', hasThrowLoop: false, fixedInThisCommit: false, importsZerosBundle: false },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = AUDITED_FILES.length; // 9
const FIXED_COUNT = AUDITED_FILES.filter((f) => f.fixedInThisCommit).length; // 6

export const IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT = {
  id: 'imp-95650',
  proofSection: 'audit',
  question:
    'Is each of the newest frontier cluster modules (imp-95614, imp-95616, imp-95617, ' +
    'imp-95618, imp-95619, imp-95621, imp-95625, imp-95631, imp-95632) wired into ' +
    'scripts/run-assertions.mjs DATA_MODULES (directly or transitively), and does any ' +
    'transitively import the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'NINE OF NINE ORPHANED PRE-AUDIT, SIX FIXED IN THIS COMMIT. None carried a direct ' +
    'DATA_MODULES entry and none was reachable via a genuine `import` from a registered ' +
    'file (only prose/comment mentions by imp-id, or a page import that is itself ' +
    'unregistered). Six of nine had self-executing throw-on-import assertions sitting dead; ' +
    'fixed by adding direct DATA_MODULES entries. The other three export an assertions ' +
    'array but have no throw loop, so they are left as read-only orphans for a follow-up ' +
    'ticket. Zero "zeros-to-1e6" matches anywhere in the cluster or its dependency chain.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 9
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedCount: FIXED_COUNT,
  orphanFixedInThisCommit: true,
  isRigorous: false,
  verdict:
    'AUDIT + PARTIAL FIX (not rigorous, not a measurement of a mathematical quantity). ' +
    'Checked scripts/run-assertions.mjs DATA_MODULES membership (direct and transitive-via-' +
    'genuine-import) and a "zeros-to-1e6" import grep for all nine frontier-cluster files. ' +
    'Result: nine of nine orphaned pre-audit; six of nine (the ones with a self-executing ' +
    'throw loop) fixed in this commit by adding direct DATA_MODULES entries; the remaining ' +
    'three left open (no throw loop to exercise even once registered). Changes no bound; ' +
    'establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36109/imp-35982/imp-35905 (registration/reachability + import-light guard audit ' +
    'method); verify-zeros-importers.mjs (import-light guard method, imp-2880).',
};

export const IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp95650-audited-nine-files',
    description: 'exactly nine frontier-cluster modules were audited',
    holds: () => IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT.auditedFileCount === 9,
  },
  {
    id: 'imp95650-nine-orphans-found',
    description: 'all nine were orphaned pre-audit',
    holds: () =>
      IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT.orphanedFound === 9 &&
      AUDITED_FILES.every((f) => f.reachability === 'orphaned-not-registered-not-imported'),
  },
  {
    id: 'imp95650-six-fixed',
    description: 'exactly the six throw-loop-bearing modules were fixed in this commit',
    holds: () =>
      IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT.orphanFixedCount === 6 &&
      AUDITED_FILES.filter((f) => f.fixedInThisCommit).length === 6 &&
      AUDITED_FILES.filter((f) => f.fixedInThisCommit).every((f) => f.hasThrowLoop === true) &&
      AUDITED_FILES.filter((f) => !f.fixedInThisCommit).every((f) => f.hasThrowLoop === false),
  },
  {
    id: 'imp95650-no-heavy-bundle-imports',
    description: 'none of the nine cluster files import the 16.7MB zeros-to-1e6.js bundle',
    holds: () =>
      IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT.zerosBundleImportersFound === 0 &&
      AUDITED_FILES.every((f) => f.importsZerosBundle === false),
  },
];

for (const assertion of IMP95650_FRONTIER_CLUSTER_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95650-frontier-cluster-reachability-audit assertion failed: ${assertion.id}`);
  }
}
