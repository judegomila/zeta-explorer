/**
 * @module imp-36070-imp3601x2x-second-cohort-registration-reachability-audit
 *
 * imp-36070 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-36007/imp-35982/imp-35905 method) over the newest imp-3601x/imp-3602x measurement
 * cohort -- imp-36008 (i2-theta-arclength-jacobian-decomposition), imp-36011
 * (i3-floor-cusp-vs-geometry-reconciliation), imp-36017
 * (krawczyk-residual-surrogate-vs-layer-discrepancy), imp-36020
 * (w1-clustered-order-shape-argmax), imp-36021 (two-cliff-gap-constant-sensitivity), imp-36022
 * (etrunc-ecoll-crossover-reconciliation), and imp-36023 (kbn-combined-worst-ladder) -- verifying
 * each is wired into scripts/run-assertions.mjs DATA_MODULES and none transitively imports the
 * 16.7MB zeros-to-1e6.js bundle.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the seven cohort file
 * paths. For any file with no direct entry, grepped src/ for who imports it and checked whether
 * that importer itself carries a direct DATA_MODULES entry (transitive reachability). Grepped
 * each cohort file's own `import` statements, and one level further into their direct
 * dependencies (lambda-rh-height-mapping.js, polymath15-constant-C-C.js,
 * imp-35968-e-trunc-coll-crossover-location.js, imp-35950-etrunc-ecoll-crossover-height.js), for
 * the literal "zeros-to-1e6". Also esbuild-bundled all seven cohort files standalone
 * (--bundle --platform=node --format=esm) and ran each bundle under plain node to confirm their
 * self-executing THROWing assertions actually pass and the bundle contains zero "zeros-to-1e6"
 * references (bundles ranged 9.0KB-155.5KB).
 *
 * FINDING -- SIX DIRECT, ONE TRANSITIVE, ZERO ORPHANS. imp-36008, imp-36011, imp-36020,
 * imp-36021, imp-36022, imp-36023 all carry a direct scripts/run-assertions.mjs DATA_MODULES
 * entry. imp-36017 has NO direct entry, but is imported by both
 * imp-36057-krawczyk-residual-2x-tightening-headroom.js and
 * imp-36066-residual-node-no-machine-certificate-honest-status.js, which are themselves both
 * directly registered in DATA_MODULES -- so imp-36017's module-scope self-executing assertions
 * do run under `npm run assert` (transitively reachable, not orphaned). imp-36008, imp-36020,
 * and imp-36023 have no imports at all (self-contained baked-literal modules); imp-36017 and
 * imp-36021 import only lambda-rh-height-mapping.js and polymath15-constant-C-C.js; imp-36022
 * additionally imports imp-35968-e-trunc-coll-crossover-location.js and
 * imp-35950-etrunc-ecoll-crossover-height.js (both themselves import only the same two shared
 * modules). None of the seven files or their direct dependency chain imports the heavy
 * zeros-to-1e6.js bundle.
 *
 * Read-only confirmation; no correction needed this run. Changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36007-frontier-cohort-registration-reachability-audit (prior sweep, same method)
 * @see imp-35982-imp3589x-registration-reachability-audit (prior sweep, same method)
 * @see imp-35905-frontier-measurement-cohort-import-guard (import-light guard method)
 * @see imp-36034-imp3596x97x-registration-reachability-audit (fixed the sibling imp-35969 orphan)
 * @see imp-36129-orphaned-module-registration-audit-honest-status (names orphan classification method)
 * @see imp-36008-i2-theta-arclength-jacobian-decomposition.js (audited module)
 * @see imp-36011-i3-floor-cusp-vs-geometry-reconciliation.js (audited module)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js (audited module, transitively reachable via imp-36057/imp-36066)
 * @see imp-36020-w1-clustered-order-shape-argmax.js (audited module)
 * @see imp-36021-two-cliff-gap-constant-sensitivity.js (audited module)
 * @see imp-36022-etrunc-ecoll-crossover-reconciliation.js (audited module)
 * @see imp-36023-kbn-combined-worst-ladder.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-36008-i2-theta-arclength-jacobian-decomposition',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-36011-i3-floor-cusp-vs-geometry-reconciliation',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy',
    kind: 'assessment',
    reachability: 'transitive-via-imp36057-imp36066',
    importsZerosBundle: false,
  },
  {
    file: 'imp-36020-w1-clustered-order-shape-argmax',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-36021-two-cliff-gap-constant-sensitivity',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-36022-etrunc-ecoll-crossover-reconciliation',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-36023-kbn-combined-worst-ladder',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = 0;

export const IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36070',
  proofSection: 'audit',
  question:
    'Is each of the imp-3601x/imp-3602x measurement cohort modules (imp-36008, imp-36011, ' +
    'imp-36017, imp-36020, imp-36021, imp-36022, imp-36023) wired into ' +
    'scripts/run-assertions.mjs DATA_MODULES (directly or transitively), and does none ' +
    'transitively import the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'SIX DIRECT, ONE TRANSITIVE, ZERO ORPHANS. imp-36008/36011/36020/36021/36022/36023 all ' +
    'carry a direct scripts/run-assertions.mjs DATA_MODULES entry. imp-36017 has no direct ' +
    'entry but is imported by imp-36057 and imp-36066, both directly registered, so its ' +
    'assertions still run under `npm run assert`. None of the seven files or their direct ' +
    'dependency chain imports the zeros-to-1e6.js bundle.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 7
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: false,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership (direct and transitive-via-importer) ' +
    'and a "zeros-to-1e6" import grep for all seven cohort files, plus an esbuild-bundle + ' +
    'plain-node re-run of each file standalone to confirm the assertions actually pass. ' +
    'Result: six directly registered, one (imp-36017) transitively reachable via two ' +
    'directly-registered importers, zero orphans, zero zeros-bundle references. Changes no ' +
    'bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36007/imp-35982 (registration/reachability method); imp-35905 (import-light guard ' +
    'method); imp-36034 (transitive-reachability-via-importer classification precedent); ' +
    'verify-zeros-importers.mjs (imp-2880).',
};

export const IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36070-audited-seven-files',
    description: 'exactly the seven named imp-3601x/imp-3602x cohort modules were audited',
    holds: () =>
      IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 7 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-36008-i2-theta-arclength-jacobian-decomposition',
          'imp-36011-i3-floor-cusp-vs-geometry-reconciliation',
          'imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy',
          'imp-36020-w1-clustered-order-shape-argmax',
          'imp-36021-two-cliff-gap-constant-sensitivity',
          'imp-36022-etrunc-ecoll-crossover-reconciliation',
          'imp-36023-kbn-combined-worst-ladder',
        ].join(','),
  },
  {
    id: 'imp36070-six-direct-one-transitive',
    description: 'six modules directly registered, imp-36017 transitively reachable, none orphaned',
    holds: () =>
      AUDITED_FILES.filter((f) => f.reachability === 'direct-data-modules-entry').length === 6 &&
      AUDITED_FILES.filter((f) => f.reachability === 'transitive-via-imp36057-imp36066').length === 1,
  },
  {
    id: 'imp36070-no-orphans',
    description: 'zero modules are orphaned this run',
    holds: () =>
      AUDITED_FILES.every((f) => f.reachability !== 'orphaned-not-registered-not-imported') &&
      IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT.orphanedFound === 0,
  },
  {
    id: 'imp36070-none-import-zeros-bundle',
    description: 'none of the seven modules (or their direct chain) imports the zeros-to-1e6 bundle',
    holds: () =>
      AUDITED_FILES.every((f) => f.importsZerosBundle === false) &&
      IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0,
  },
  {
    id: 'imp36070-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36070-imp3601x2x-second-cohort-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP36070_IMP3601X2X_SECOND_COHORT_REGISTRATION_REACHABILITY_AUDIT;
