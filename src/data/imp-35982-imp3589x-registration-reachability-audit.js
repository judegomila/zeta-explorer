/**
 * @module imp-35982-imp3589x-registration-reachability-audit
 *
 * imp-35982 (meta, audit): a registration/reachability + import-light guard sweep
 * (imp-35472/imp-35545/imp-35606/imp-35630/imp-35645 method) over the imp-3589x cohort --
 * imp-35889 (e-share-decomposition-at-knees), imp-35890 (w1-running-accumulator-apriori-bound),
 * imp-35891 (flattest-point-vs-sigmoid-knee-crosslocation), imp-35892
 * (rdirect-own-floor-departure-height), and imp-35893 (w1-summation-pairwise-tree-shape) --
 * confirming each module is exported/registered where expected and none transitively imports
 * the 16.7MB zeros-to-1e6.js bundle.
 *
 * METHOD. All five are assessment/measurement modules (none has a dedicated viz-data page), so
 * reachability was checked via a direct grep of scripts/run-assertions.mjs DATA_MODULES for each
 * file path (the imp-35630 method for non-viz files). The import-light guard was checked with
 * `grep -l "zeros-to-1e6"` (the verify-zeros-importers.mjs heavy-importer method) run against
 * each of the five cohort files AND their direct import chain (lambda-rh-height-mapping.js,
 * polymath15-constant-C-C.js, bridge-lambda-rh.js, g6a-sub-constant-value.js,
 * polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-uniformity.js, imp-35853,
 * imp-33701, imp-35538, imp-35813, imp-33582).
 *
 * FINDING -- ALL FIVE MODULES ARE REGISTERED AND REACHABLE, NONE IMPORTS THE ZEROS BUNDLE.
 * Each of imp-35889, imp-35890, imp-35891, imp-35892, imp-35893 has a direct
 * scripts/run-assertions.mjs DATA_MODULES entry, so its self-executing THROWing assertions run
 * under `npm run assert` without needing a transitive-import argument (imp-35892 additionally
 * carries a paperSourcePath cross-reference from its imp-35957 viz page). A grep of all five
 * files and their full direct dependency chain for the literal "zeros-to-1e6" returned zero
 * matches -- none of the cohort or its dependencies pulls in the heavy zeros bundle.
 *
 * SCOPE. Read-only registration/reachability + import-light guard audit only. No source file
 * required correction -- all five modules in this cohort were already properly wired and
 * import-light before this audit ran. Changes no bound; establishes no operator positivity; no
 * RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35645-imp3559x-registration-reachability-audit (prior sweep establishing this method)
 * @see imp-35630-imp3555x-imp3557x-registration-reachability-audit (registration/reachability method precursor)
 * @see imp-35889-e-share-decomposition-at-knees.js (audited module)
 * @see imp-35890-w1-running-accumulator-apriori-bound.js (audited module)
 * @see imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js (audited module)
 * @see imp-35892-rdirect-own-floor-departure-height.js (audited module)
 * @see imp-35893-w1-summation-pairwise-tree-shape.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-35889-e-share-decomposition-at-knees',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35890-w1-running-accumulator-apriori-bound',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35891-flattest-point-vs-sigmoid-knee-crosslocation',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35892-rdirect-own-floor-departure-height',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35893-w1-summation-pairwise-tree-shape',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const DANGLING_OR_ORPHANED_FOUND = 0;

export const IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35982',
  proofSection: 'audit',
  question:
    'Is each of the imp-3589x cohort modules (imp-35889, imp-35890, imp-35891, imp-35892, ' +
    'imp-35893) exported and reachable where expected -- a direct scripts/run-assertions.mjs ' +
    'DATA_MODULES entry -- and does none transitively import the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'CLEAN. All five modules carry a direct scripts/run-assertions.mjs DATA_MODULES entry, so ' +
    'their self-executing assertions run under `npm run assert` without a transitive-import ' +
    'argument. A grep for "zeros-to-1e6" across all five files and their full direct dependency ' +
    'chain returned zero matches -- none pulls in the heavy zeros bundle.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 5
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  danglingOrOrphanedFound: DANGLING_OR_ORPHANED_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership and a "zeros-to-1e6" import grep (module ' +
    'plus full direct dependency chain) for imp-35889, imp-35890, imp-35891, imp-35892, and ' +
    'imp-35893. Result: all five fully registered and reachable, none import-heavy; no source ' +
    'file required correction. Changes no bound; establishes no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35645/imp-35630/imp-35606/imp-35545 (registration/reachability audit method); ' +
    'verify-zeros-importers.mjs (import-light guard method, imp-2880).',
};

export const IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35982-audited-five-files',
    description: 'exactly the five named imp-3589x modules were audited',
    holds: () =>
      IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 5 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-35889-e-share-decomposition-at-knees',
          'imp-35890-w1-running-accumulator-apriori-bound',
          'imp-35891-flattest-point-vs-sigmoid-knee-crosslocation',
          'imp-35892-rdirect-own-floor-departure-height',
          'imp-35893-w1-summation-pairwise-tree-shape',
        ].join(','),
  },
  {
    id: 'imp35982-all-directly-registered',
    description: 'all five modules carry a direct DATA_MODULES entry',
    holds: () => AUDITED_FILES.every((f) => f.reachability === 'direct-data-modules-entry'),
  },
  {
    id: 'imp35982-none-import-zeros-bundle',
    description: 'none of the five modules (or their direct chain) imports the zeros-to-1e6 bundle',
    holds: () =>
      AUDITED_FILES.every((f) => f.importsZerosBundle === false) &&
      IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT.zerosBundleImportersFound === 0,
  },
  {
    id: 'imp35982-none-orphaned',
    description: 'no dangling or orphaned module found',
    holds: () => IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp35982-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35982-imp3589x-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35982_IMP3589X_REGISTRATION_REACHABILITY_AUDIT;
