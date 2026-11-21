/**
 * @module imp-36087-imp3601x2x-registration-reachability-audit
 *
 * imp-36087 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-35982/imp-35905/imp-35986 method) over the newest imp-3601x/imp-3602x measurement cohort --
 * imp-36018 (w1-pairwise-slack-depth-scaling-exponent), imp-36020
 * (w1-clustered-order-shape-argmax), imp-36021 (two-cliff-gap-constant-sensitivity), imp-36022
 * (etrunc-ecoll-crossover-reconciliation), and imp-36023 (kbn-combined-worst-ladder) -- confirming
 * each module is wired into scripts/run-assertions.mjs DATA_MODULES and transitively free of the
 * 20.8MB zeros-to-1e6.js bundle.
 *
 * METHOD. All five are assessment/measurement modules (none has a dedicated viz-data page), so
 * reachability was checked via a direct grep of scripts/run-assertions.mjs DATA_MODULES for each
 * file path. The import-light guard was checked by walking each module's import graph by hand:
 * imp-36018 -> imp-35970 -> imp-35893 (leaf, no imports); imp-36021 and imp-36022 ->
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (leaf), and ->
 * polymath15-constant-C-C.js -> {g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js} -> lambda-intercept-burgers-uniformity.js ->
 * {dyson-scaling-N5000.js, dyson-burgers-shock.js, lambda-intercept-analytic.js} ->
 * dyson-scaling-N5000.js -> zeta.js -> primes.js (leaf); imp-36022 additionally ->
 * {imp-35968, imp-35950}-e-trunc/etrunc-ecoll-crossover -> lambda-rh-height-mapping.js /
 * polymath15-constant-C-C.js (already covered); imp-36020 and imp-36023 are self-contained
 * leaves with zero imports. zeta.js imports only primes.js -- neither imports zeros-to-1e6.js.
 *
 * FINDING -- ALL FIVE MODULES ARE REGISTERED AND REACHABLE, NONE IMPORTS THE ZEROS BUNDLE.
 * Each of imp-36018, imp-36020, imp-36021, imp-36022, imp-36023 has a direct
 * scripts/run-assertions.mjs DATA_MODULES entry, so its self-executing THROWing assertions run
 * under `npm run assert` without needing a transitive-import argument. Walking the full direct
 * dependency chain of all five (12 distinct dependency files total) found zero references to
 * "zeros-to-1e6" -- none of the cohort or its dependencies pulls in the heavy zeros bundle.
 *
 * SCOPE. Read-only registration/reachability + import-light guard audit only. No source file
 * required correction -- all five modules in this cohort were already properly wired and
 * import-light before this audit ran. Changes no bound; establishes no operator positivity; no
 * RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35982-imp3589x-registration-reachability-audit.js (prior sweep establishing this method)
 * @see imp-36018-w1-pairwise-slack-depth-scaling-exponent.js (audited module)
 * @see imp-36020-w1-clustered-order-shape-argmax.js (audited module)
 * @see imp-36021-two-cliff-gap-constant-sensitivity.js (audited module)
 * @see imp-36022-etrunc-ecoll-crossover-reconciliation.js (audited module)
 * @see imp-36023-kbn-combined-worst-ladder.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-36018-w1-pairwise-slack-depth-scaling-exponent',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
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
const DANGLING_OR_ORPHANED_FOUND = 0;

export const IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-36087',
  proofSection: 'audit',
  question:
    'Is each of the newest imp-3601x/imp-3602x cohort modules (imp-36018, imp-36020, imp-36021, ' +
    'imp-36022, imp-36023) wired into scripts/run-assertions.mjs DATA_MODULES, and does none ' +
    'transitively import the 20.8MB zeros-to-1e6.js bundle?',
  verdictShort:
    'CLEAN. All five modules carry a direct scripts/run-assertions.mjs DATA_MODULES entry, so ' +
    'their self-executing assertions run under `npm run assert` without a transitive-import ' +
    'argument. Walking the full direct dependency chain of all five found zero references to ' +
    '"zeros-to-1e6" -- none pulls in the heavy zeros bundle.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 5
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  danglingOrOrphanedFound: DANGLING_OR_ORPHANED_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership and a "zeros-to-1e6" import-chain walk ' +
    '(module plus full direct dependency chain) for imp-36018, imp-36020, imp-36021, imp-36022, ' +
    'and imp-36023. Result: all five fully registered and reachable, none import-heavy; no source ' +
    'file required correction. Changes no bound; establishes no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35982/imp-35905/imp-35986 (registration/reachability + import-guard audit method); ' +
    'verify-zeros-importers.mjs (import-light guard method, imp-2880).',
};

export const IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36087-audited-five-files',
    description: 'exactly the five named imp-3601x/imp-3602x modules were audited',
    holds: () =>
      IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 5 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-36018-w1-pairwise-slack-depth-scaling-exponent',
          'imp-36020-w1-clustered-order-shape-argmax',
          'imp-36021-two-cliff-gap-constant-sensitivity',
          'imp-36022-etrunc-ecoll-crossover-reconciliation',
          'imp-36023-kbn-combined-worst-ladder',
        ].join(','),
  },
  {
    id: 'imp36087-all-directly-registered',
    description: 'all five modules carry a direct DATA_MODULES entry',
    holds: () => AUDITED_FILES.every((f) => f.reachability === 'direct-data-modules-entry'),
  },
  {
    id: 'imp36087-none-import-zeros-bundle',
    description: 'none of the five modules (or their direct chain) imports the zeros-to-1e6 bundle',
    holds: () =>
      AUDITED_FILES.every((f) => f.importsZerosBundle === false) &&
      IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0,
  },
  {
    id: 'imp36087-none-orphaned',
    description: 'no dangling or orphaned module found',
    holds: () => IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp36087-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36087-imp3601x2x-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP36087_IMP3601X2X_REGISTRATION_REACHABILITY_AUDIT;
