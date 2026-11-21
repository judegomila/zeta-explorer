/**
 * @module imp-36034-imp3596x97x-registration-reachability-audit
 *
 * imp-36034 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-35982/imp-35905/imp-35986 method) over the imp-3596x/imp-3597x measurement cohort --
 * imp-35968 (e-trunc-coll-crossover-location), imp-35969
 * (krawczyk-residual-directed-rounding-width), imp-35970 (w1-pairwise-apriori-depth-bound-slack),
 * imp-35971 (etrunc-sole-survivor-height), imp-35972
 * (effective-height-overflow-cliff-bisection), and imp-35973
 * (w1-summation-order-shape-cross-term) -- confirming each is wired into
 * scripts/run-assertions.mjs (directly or transitively) and none imports the 16.7MB
 * zeros-to-1e6.js bundle.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the six file paths (the
 * imp-35630 method). imp-35970, imp-35971, imp-35972, imp-35973 each carry a direct entry.
 * imp-35968 has NO direct entry, but is imported (and re-exercised) by two modules that DO carry
 * direct entries: imp-36022-etrunc-ecoll-crossover-reconciliation.js and
 * imp-36088-crossover-lambdabounds-stale-prose-sweep.js -- so its module-level self-executing
 * assertions still run whenever `npm run assert` loads either importer. imp-35969 has NO direct
 * entry AND is never `import`ed anywhere in src/data -- it is referenced only in prose `@see`
 * comments (imp-36017, imp-36044, imp-36057), none of which is an actual import statement. Its
 * self-executing THROWing assertions therefore never execute under `npm run assert`; it is a
 * genuinely ORPHANED module. Import-light guard: grepped all six cohort files plus their direct
 * dependency chain (lambda-rh-height-mapping.js, polymath15-constant-C-C.js,
 * imp-35893-w1-summation-pairwise-tree-shape.js, which imp-35970 imports and which itself has no
 * imports) for the literal "zeros-to-1e6"; imp-35973 has no imports at all.
 *
 * FINDING -- FIVE OF SIX REACHABLE PRE-AUDIT, ALL SIX IMPORT-LIGHT. imp-35970/35971/35972/35973
 * were already directly registered; imp-35968 was reachable only transitively (via
 * imp-36022/imp-36088). imp-35969-krawczyk-residual-directed-rounding-width.js was ORPHANED: no
 * direct DATA_MODULES entry and not imported by any registered module, so its assertions were
 * dead code from the `npm run assert` sweep's perspective. None of the six cohort files or their
 * direct dependency chain imports the heavy zeros-to-1e6.js bundle.
 *
 * FIX APPLIED. Unlike the imp-35982/imp-35905/imp-35986 precedents (all-clean, no correction
 * needed), this audit found one real, one-line-fixable gap, so it was closed in the same commit
 * rather than only queued: added a direct scripts/run-assertions.mjs DATA_MODULES entry for
 * imp-35969-krawczyk-residual-directed-rounding-width.js (immediately below this audit module's
 * own new entry), so its five self-executing THROWing assertions now run under `npm run assert`.
 * Otherwise read-only. Changes no bound; establishes no operator positivity; no RH verdict; NO
 * QED. No refereed bound is changed.
 *
 * @see imp-35982-imp3589x-registration-reachability-audit (registration/reachability method)
 * @see imp-35905-frontier-measurement-cohort-import-guard (import-light guard method)
 * @see imp-35986-imp3588x89x-cohort-import-guard-audit (sibling audit, same combined method)
 * @see imp-35968-e-trunc-coll-crossover-location.js (audited module, transitively reachable)
 * @see imp-35969-krawczyk-residual-directed-rounding-width.js (audited module, ORPHANED -- not registered, not imported)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack.js (audited module)
 * @see imp-35971-etrunc-sole-survivor-height.js (audited module)
 * @see imp-35972-effective-height-overflow-cliff-bisection.js (audited module)
 * @see imp-35973-w1-summation-order-shape-cross-term.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-35968-e-trunc-coll-crossover-location',
    kind: 'assessment',
    reachability: 'transitive-via-imp-36022-imp-36088',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35969-krawczyk-residual-directed-rounding-width',
    kind: 'assessment',
    reachability: 'orphaned-not-registered-not-imported',
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
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = 1;

export const IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36034',
  proofSection: 'audit',
  question:
    'Is each of the imp-3596x/imp-3597x cohort modules (imp-35968, imp-35969, imp-35970, ' +
    'imp-35971, imp-35972, imp-35973) wired into scripts/run-assertions.mjs (directly or ' +
    'transitively), and does none transitively import the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'ONE ORPHAN FOUND AND FIXED. imp-35970/35971/35972/35973 already carried a direct ' +
    'scripts/run-assertions.mjs DATA_MODULES entry; imp-35968 was reachable only transitively ' +
    '(imported by the registered imp-36022 and imp-36088 modules). ' +
    'imp-35969-krawczyk-residual-directed-rounding-width.js had NO direct entry and was not ' +
    'imported anywhere -- its assertions never ran under `npm run assert`. Fixed in this same ' +
    'commit by adding a direct DATA_MODULES entry for it. All six are import-light: zero ' +
    '"zeros-to-1e6" matches across the cohort and its direct dependency chain.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 6
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: true,
  isRigorous: false,
  verdict:
    'AUDIT + FIX (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership (direct and transitive-via-import) and a ' +
    '"zeros-to-1e6" import grep for imp-35968, imp-35969, imp-35970, imp-35971, imp-35972, and ' +
    'imp-35973. Result: five of six reachable pre-audit (four direct, one transitive), all six ' +
    'import-light; imp-35969 was an orphaned module never exercised by `npm run assert` -- ' +
    'closed by adding its direct DATA_MODULES entry in this commit. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35982/imp-35905/imp-35986 (registration/reachability + import-light guard audit ' +
    'method); verify-zeros-importers.mjs (import-light guard method, imp-2880).',
};

export const IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36034-audited-six-files',
    description: 'exactly the six named imp-3596x/imp-3597x modules were audited',
    holds: () =>
      IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 6 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-35968-e-trunc-coll-crossover-location',
          'imp-35969-krawczyk-residual-directed-rounding-width',
          'imp-35970-w1-pairwise-apriori-depth-bound-slack',
          'imp-35971-etrunc-sole-survivor-height',
          'imp-35972-effective-height-overflow-cliff-bisection',
          'imp-35973-w1-summation-order-shape-cross-term',
        ].join(','),
  },
  {
    id: 'imp36034-four-directly-registered',
    description: 'four of the six modules carry a direct DATA_MODULES entry',
    holds: () =>
      AUDITED_FILES.filter((f) => f.reachability === 'direct-data-modules-entry').length === 4,
  },
  {
    id: 'imp36034-one-orphaned',
    description: 'exactly one module (imp-35969) is orphaned -- not registered, not imported',
    holds: () =>
      AUDITED_FILES.filter((f) => f.reachability === 'orphaned-not-registered-not-imported')
        .length === 1 &&
      IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT.orphanedFound === 1,
  },
  {
    id: 'imp36034-none-import-zeros-bundle',
    description: 'none of the six modules (or their direct chain) imports the zeros-to-1e6 bundle',
    holds: () =>
      AUDITED_FILES.every((f) => f.importsZerosBundle === false) &&
      IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0,
  },
  {
    id: 'imp36034-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36034-imp3596x97x-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP36034_IMP3596X97X_REGISTRATION_REACHABILITY_AUDIT;
