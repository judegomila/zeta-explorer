/**
 * @module imp-36169-imp3606x82x95x96x97x-registration-reachability-audit
 *
 * imp-36169 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-36007/imp-35982/imp-35905 method) over the imp-3606x-3609x S-frontier cohort --
 * imp-36066 (residual-node-no-machine-certificate-honest-status), imp-36067
 * (glossary-headword-duplicate-audit), imp-36082 (routeB-perN-rate-form-and-bridge-consumability),
 * imp-36095 (kbn-kahan-intermittency-band), imp-36096 (w1-accumulator-joint-recovery-contour),
 * and imp-36097 (e-share-threshold-crossings-viz-data) -- confirming each is wired into
 * scripts/run-assertions.mjs DATA_MODULES and none transitively imports the 16.7MB
 * zeros-to-1e6.js bundle. The pending imp-36109 sweep stopped at cohort imp-36065; this
 * audit covers the six modules committed after it.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for a direct entry for each of the
 * six cohort file paths. Grepped each cohort file's own `^import` lines for the literal
 * "zeros-to-1e6", then walked one level further into any direct dependency chain.
 *
 * FINDING -- ALL SIX CLEAN, NO ORPHANS. All six cohort files already carry a direct
 * scripts/run-assertions.mjs DATA_MODULES entry. imp-36067/36082/36095/36096/36097 have no
 * `import` statements at all (self-contained baked-literal modules). imp-36066 imports
 * imp-35969-krawczyk-residual-directed-rounding-width.js and
 * imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js, both of which import only
 * lambda-rh-height-mapping.js and polymath15-constant-C-C.js -- neither of which references
 * "zeros-to-1e6" either. No orphans, no heavy-bundle imports anywhere in the swept set.
 *
 * Read-only confirmation; no correction needed this run. Changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36109-imp3603x46x61x62x-registration-reachability-audit.js (prior sweep, stops at imp-36065)
 * @see imp-35982-imp3589x-registration-reachability-audit.js (registration/reachability method)
 * @see imp-35905-frontier-measurement-cohort-import-guard.js (import-light guard method)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status.js (audited module)
 * @see imp-36067-glossary-headword-duplicate-audit.js (audited module)
 * @see imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (audited module)
 * @see imp-36095-kbn-kahan-intermittency-band.js (audited module)
 * @see imp-36096-w1-accumulator-joint-recovery-contour.js (audited module)
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (audited module)
 */

const AUDITED_FILES = [
  { file: 'imp-36066-residual-node-no-machine-certificate-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36067-glossary-headword-duplicate-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36082-routeB-perN-rate-form-and-bridge-consumability', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36095-kbn-kahan-intermittency-band', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36096-w1-accumulator-joint-recovery-contour', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36097-e-share-threshold-crossings-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = 0;

export const IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36169',
  proofSection: 'audit',
  question:
    'Is each of the imp-3606x-3609x S-frontier cohort modules (imp-36066, imp-36067, ' +
    'imp-36082, imp-36095, imp-36096, imp-36097) wired into scripts/run-assertions.mjs ' +
    'DATA_MODULES (directly or transitively), and does none transitively import the ' +
    '16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'ALL SIX CLEAN, NO ORPHANS. Every cohort file already carries a direct ' +
    'scripts/run-assertions.mjs DATA_MODULES entry. Five of six have no imports at all; ' +
    'imp-36066 imports two modules whose own import chain (lambda-rh-height-mapping.js, ' +
    'polymath15-constant-C-C.js) is also zeros-to-1e6-free. Zero "zeros-to-1e6" matches ' +
    'anywhere in the swept set.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 6
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: false,
  isRigorous: false,
  verdict:
    'AUDIT ONLY, NO FIX NEEDED (not rigorous, not a measurement of a mathematical quantity). ' +
    'Checked scripts/run-assertions.mjs DATA_MODULES membership (direct) and a "zeros-to-1e6" ' +
    'import grep, one level into the dependency chain, for all six imp-3606x-3609x cohort ' +
    'files. Result: six of six already reachable pre-audit, zero orphans, zero heavy-bundle ' +
    'imports. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36007/imp-35982/imp-35905 (registration/reachability + import-light guard audit ' +
    'method); imp-36109 (prior sweep this audit picks up after).',
};

export const IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36169-audited-six-files',
    description: 'exactly six imp-3606x-3609x cohort modules were audited',
    holds: () => IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 6,
  },
  {
    id: 'imp36169-no-orphans-found',
    description: 'none of the six were orphaned',
    holds: () =>
      IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT.orphanedFound === 0 &&
      AUDITED_FILES.every((f) => f.reachability === 'direct-data-modules-entry'),
  },
  {
    id: 'imp36169-no-heavy-bundle-imports',
    description: 'none of the six cohort files import the 16.7MB zeros-to-1e6.js bundle',
    holds: () =>
      IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0 &&
      AUDITED_FILES.every((f) => f.importsZerosBundle === false),
  },
  {
    id: 'imp36169-no-fix-flag-set',
    description: 'no fix was applied since no orphans were found',
    holds: () => IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT.orphanFixedInThisCommit === false,
  },
];

for (const assertion of IMP36169_IMP3606X82X95X96X97X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36169-imp3606x82x95x96x97x-registration-reachability-audit assertion failed: ${assertion.id}`);
  }
}
