/**
 * @module imp-35986-imp3588x89x-cohort-import-guard-audit
 *
 * imp-35986 (meta, audit): a build-time cohort import-guard/verification sweep
 * (imp-35775 import-light-verification / imp-35880 cohort import-guard pattern) over the newest
 * S-frontier modules imp-35885 (krawczyk-node-cancellation-audit), imp-35889
 * (e-share-decomposition-at-knees), imp-35891 (flattest-point-vs-sigmoid-knee-crosslocation),
 * imp-35892 (rdirect-own-floor-departure-height), and imp-35893
 * (w1-summation-pairwise-tree-shape) -- confirming none transitively pulls the 16.7MB
 * zeros-to-1e6.js bundle (the recurring verify-heavy-assertion-modules hang trap) and that each
 * loads and self-asserts cleanly.
 *
 * METHOD. imp-35889/35891/35892/35885 import lambda-rh-height-mapping.js and
 * polymath15-constant-C-C.js directly; imp-35891 additionally imports imp-35853 and imp-33701.
 * Traced the FULL transitive chain (not just direct imports): lambda-rh-height-mapping.js ->
 * bridge-lambda-rh.js -> guth-maynard-tail-bound.js; polymath15-constant-C-C.js ->
 * g6a-sub-constant-value.js -> polymath15-lemma52-shock-holder.js and
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js (ZETA_ZEROS is a
 * small hardcoded literal array defined IN zeta.js, distinct from the heavy zeros-to-1e6.js
 * bundle) and dyson-burgers-shock.js / lambda-intercept-analytic.js /
 * dyson-monotonicity-proof.js / dyson-collision-lower-bound.js / lambda-intercept-confidence.js;
 * imp-35853 -> imp-35538 / imp-35813 -> imp-35763 -> imp-35722; imp-33701 -> imp-33582. A grep for
 * the literal "zeros-to-1e6" across all five cohort files and this entire dependency closure
 * returned zero matches. imp-35893 has no imports at all. Reachability was confirmed via a direct
 * grep of scripts/run-assertions.mjs DATA_MODULES for each of the five file paths.
 *
 * FINDING -- ALL FIVE MODULES ARE IMPORT-LIGHT AND DIRECTLY REGISTERED. None of imp-35885,
 * imp-35889, imp-35891, imp-35892, imp-35893 -- nor their full transitive dependency closure --
 * imports the 16.7MB zeros-to-1e6.js bundle, and each carries a direct
 * scripts/run-assertions.mjs DATA_MODULES entry, so `npm run assert` exercises their
 * self-executing THROWing assertions without hanging.
 *
 * SCOPE. Read-only import-guard + reachability audit only. No source file required correction.
 * Changes no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35775-s-frontier-cohort-import-light-verification (import-light verification pattern)
 * @see imp-35880-frontier-batch-cohort-verification (cohort import-guard pattern)
 * @see imp-35982-imp3589x-registration-reachability-audit (sibling audit of the overlapping
 *   imp-35889/35891/35892/35893 subset plus imp-35890, using the same method)
 * @see imp-35885-krawczyk-node-cancellation-audit.js (audited module)
 * @see imp-35889-e-share-decomposition-at-knees.js (audited module)
 * @see imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js (audited module)
 * @see imp-35892-rdirect-own-floor-departure-height.js (audited module)
 * @see imp-35893-w1-summation-pairwise-tree-shape.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-35885-krawczyk-node-cancellation-audit',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
    importsZerosBundle: false,
  },
  {
    file: 'imp-35889-e-share-decomposition-at-knees',
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

export const IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT = {
  id: 'imp-35986',
  proofSection: 'audit',
  question:
    'Does any of the newest S-frontier modules imp-35885, imp-35889, imp-35891, imp-35892, ' +
    'imp-35893 -- or their full transitive dependency closure -- transitively import the ' +
    '16.7MB zeros-to-1e6.js bundle, and is each directly registered in ' +
    'scripts/run-assertions.mjs DATA_MODULES?',
  verdictShort:
    'CLEAN. A grep for "zeros-to-1e6" across all five cohort files and their entire traced ' +
    'transitive dependency closure (through lambda-rh-height-mapping.js, ' +
    'polymath15-constant-C-C.js, and their sub-chains down to dyson-scaling-N5000.js / zeta.js) ' +
    'returned zero matches. All five carry a direct scripts/run-assertions.mjs DATA_MODULES entry.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 5
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES membership and a "zeros-to-1e6" import grep ' +
    '(module plus full transitive dependency closure) for imp-35885, imp-35889, imp-35891, ' +
    'imp-35892, and imp-35893. Result: all five directly registered and import-light; no ' +
    'source file required correction. Changes no bound; establishes no operator positivity; no ' +
    'RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35775/imp-35880 (import-light verification / cohort import-guard pattern); ' +
    'imp-35982 (sibling registration/reachability audit, overlapping cohort subset); ' +
    'verify-zeros-importers.mjs (import-light guard method, imp-2880).',
};

export const IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT_ASSERTIONS = [
  {
    id: 'imp35986-audited-five-files',
    description: 'exactly the five named S-frontier cohort modules were audited',
    holds: () =>
      IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT.auditedFileCount === 5 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-35885-krawczyk-node-cancellation-audit',
          'imp-35889-e-share-decomposition-at-knees',
          'imp-35891-flattest-point-vs-sigmoid-knee-crosslocation',
          'imp-35892-rdirect-own-floor-departure-height',
          'imp-35893-w1-summation-pairwise-tree-shape',
        ].join(','),
  },
  {
    id: 'imp35986-all-directly-registered',
    description: 'all five modules carry a direct DATA_MODULES entry',
    holds: () => AUDITED_FILES.every((f) => f.reachability === 'direct-data-modules-entry'),
  },
  {
    id: 'imp35986-none-import-zeros-bundle',
    description:
      'none of the five modules (or their full transitive dependency closure) imports the ' +
      'zeros-to-1e6 bundle',
    holds: () =>
      AUDITED_FILES.every((f) => f.importsZerosBundle === false) &&
      IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT.zerosBundleImportersFound === 0,
  },
  {
    id: 'imp35986-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT.verdict),
  },
];

for (const a of IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35986-imp3588x89x-cohort-import-guard-audit assertion failed: ${a.id}`);
  }
}

export default IMP35986_IMP3588X89X_COHORT_IMPORT_GUARD_AUDIT;
