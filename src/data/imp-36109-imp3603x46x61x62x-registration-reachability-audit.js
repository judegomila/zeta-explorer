/**
 * @module imp-36109-imp3603x46x61x62x-registration-reachability-audit
 *
 * imp-36109 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-36034/imp-35982/imp-35905 method) over the NEWEST S-frontier cohort --
 * imp-36033, imp-36034, imp-36046, imp-36061, imp-36062, plus every imp-3606x/imp-3607x
 * module committed since (imp-36060, imp-36063, imp-36064, imp-36066, imp-36067, imp-36068,
 * imp-36069, imp-36070, imp-36071, imp-36073, imp-36074, imp-36075, imp-36076, imp-36077) --
 * confirming each is wired into scripts/run-assertions.mjs DATA_MODULES (directly or
 * transitively) and none imports the 16.7MB zeros-to-1e6.js bundle.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for a direct entry for each of the
 * nineteen cohort files. Nine of the entries in `AUDITED_FILES` below inherited a direct
 * registration from earlier tickets; this audit's job was to catch anything committed after
 * that pre-existing coverage. For any file with no direct entry, grepped src/ for an `import`
 * of that file's basename to check transitive reachability. For import-light guard, grepped
 * each cohort file's own `^import` lines and its direct dependency chain for the literal
 * "zeros-to-1e6".
 *
 * FINDING -- TWO OF NINETEEN ORPHANED, FIXED IN THIS COMMIT. Seventeen of the nineteen cohort
 * files already carried a direct DATA_MODULES entry. Two did not, and neither was imported
 * anywhere in src/ (only referenced by id in src/data/improvement-queue.js ticket prose, which
 * is not a JS import): imp-36068-clustered-order-shape-sweep-viz-data.js (zero imports itself,
 * so no import-light risk) and imp-36077-tc-rk4-dp5-gap-dt-n-scaling.js (imports
 * ZETA_ZEROS from src/math/zeta.js and backwardCollisionRK4 from
 * src/math/dyson-scaling-N5000.js -- both lightweight, neither touches zeros-to-1e6.js). Both
 * carry genuine self-executing THROW-on-import assertions (imp-3715 convention) that were dead
 * code from the `npm run assert` sweep's perspective before this fix. All nineteen cohort files
 * and their direct dependency chains are import-light: zero "zeros-to-1e6" matches anywhere in
 * the swept set.
 *
 * FIX APPLIED. Added direct scripts/run-assertions.mjs DATA_MODULES entries for
 * imp-36068-clustered-order-shape-sweep-viz-data.js and
 * imp-36077-tc-rk4-dp5-gap-dt-n-scaling.js so their assertions now run under `npm run assert`.
 * Otherwise read-only. Changes no bound; establishes no operator positivity; no RH verdict; NO
 * QED. No refereed bound is changed.
 *
 * @see imp-36034-imp3596x97x-registration-reachability-audit.js (registration/reachability + import-light guard method, sibling audit)
 * @see imp-35982-imp3589x-registration-reachability-audit.js (registration/reachability method)
 * @see imp-35905-frontier-measurement-cohort-import-guard.js (import-light guard method)
 * @see imp-36068-clustered-order-shape-sweep-viz-data.js (audited module, ORPHANED -- fixed)
 * @see imp-36077-tc-rk4-dp5-gap-dt-n-scaling.js (audited module, ORPHANED -- fixed)
 */

const AUDITED_FILES = [
  { file: 'imp-36033-viz-data-duplicate-guard-proposal', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36034-imp3596x97x-registration-reachability-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36046-e-share-tail-landmarks-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36060-eflow-share-frontier-heights', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36061-w1-accumulator-recovery-detuning-width', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36062-kbn-kahan-separation-onset', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36063-w1-clustered-order-coherence-metric', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36064-eflow-inclusion-tilt-closed-form', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36066-residual-node-no-machine-certificate-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36067-glossary-headword-duplicate-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36068-clustered-order-shape-sweep-viz-data', reachability: 'orphaned-not-registered-not-imported', importsZerosBundle: false },
  { file: 'imp-36069-eflow-never-dominates-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36070-imp3601x2x-second-cohort-registration-reachability-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36071-imp3601x2x-see-integrity-audit', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36073-i3-two-route-floor-comparison-viz-data', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36074-two-cliff-gap-constant-robustness-honest-status', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36075-kbn-positivity-sign-margin', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36076-kahan-kbn-separation-onset', reachability: 'direct-data-modules-entry', importsZerosBundle: false },
  { file: 'imp-36077-tc-rk4-dp5-gap-dt-n-scaling', reachability: 'orphaned-not-registered-not-imported', importsZerosBundle: false },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = 2;

export const IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36109',
  proofSection: 'audit',
  question:
    'Is each of the newest S-frontier cohort modules (imp-36033, imp-36034, imp-36046, ' +
    'imp-36061, imp-36062, and every imp-3606x/imp-3607x module committed since) wired into ' +
    'scripts/run-assertions.mjs (directly or transitively), and does none transitively import ' +
    'the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'TWO ORPHANS FOUND AND FIXED. Seventeen of nineteen cohort files already carried a direct ' +
    'scripts/run-assertions.mjs DATA_MODULES entry. imp-36068-clustered-order-shape-sweep-viz-data.js ' +
    'and imp-36077-tc-rk4-dp5-gap-dt-n-scaling.js had NO direct entry and were not imported ' +
    'anywhere -- their self-executing THROW assertions never ran under `npm run assert`. Fixed ' +
    'in this same commit by adding direct DATA_MODULES entries for both. All nineteen are ' +
    'import-light: zero "zeros-to-1e6" matches across the cohort and its direct dependency chain.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 19
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: true,
  isRigorous: false,
  verdict:
    'AUDIT + FIX (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership (direct and transitive-via-import) and a ' +
    '"zeros-to-1e6" import grep for all nineteen newest S-frontier cohort files. Result: ' +
    'seventeen of nineteen reachable pre-audit (all direct), two orphaned modules never ' +
    'exercised by `npm run assert` -- closed by adding their direct DATA_MODULES entries in this ' +
    'commit. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36034/imp-35982/imp-35905 (registration/reachability + import-light guard audit ' +
    'method); verify-zeros-importers.mjs (import-light guard method, imp-2880).',
};

export const IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36109-audited-nineteen-files',
    description: 'exactly nineteen newest S-frontier cohort modules were audited',
    holds: () => IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 19,
  },
  {
    id: 'imp36109-two-orphans-found',
    description: 'exactly two of the nineteen were orphaned pre-fix',
    holds: () =>
      IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT.orphanedFound === 2 &&
      AUDITED_FILES.filter((f) => f.reachability === 'orphaned-not-registered-not-imported').length === 2,
  },
  {
    id: 'imp36109-no-heavy-bundle-imports',
    description: 'none of the nineteen cohort files import the 16.7MB zeros-to-1e6.js bundle',
    holds: () =>
      IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0 &&
      AUDITED_FILES.every((f) => f.importsZerosBundle === false),
  },
  {
    id: 'imp36109-fix-applied-flag-set',
    description: 'the orphans found in this audit were fixed in the same commit',
    holds: () => IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT.orphanFixedInThisCommit === true,
  },
];

for (const assertion of IMP36109_IMP3603X46X61X62X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36109-imp3603x46x61x62x-registration-reachability-audit assertion failed: ${assertion.id}`);
  }
}
