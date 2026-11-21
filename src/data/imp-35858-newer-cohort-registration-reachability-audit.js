/**
 * @module imp-35858-newer-cohort-registration-reachability-audit
 *
 * imp-35858 (meta, audit): registration/reachability check (imp-35590/imp-35838 method) on
 * the newer committed batch imp-35809/imp-35810/imp-35811/imp-35812/imp-35813.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the five file paths,
 * confirmed each source module exports both a result-object const and a `*_ASSERTIONS` array,
 * then grepped src/App.jsx and src/data/visualizations-index.js to check viz-suffixed vs
 * registry-only status.
 *
 * FINDING -- ONE GENUINE ORPHAN. imp-35809, imp-35810, imp-35811, imp-35812 were all
 * DATA_MODULES-listed and export a result-object const plus a `*_ASSERTIONS` array. But
 * imp-35813-req4-required-height-sigma-landmark-extend.js -- despite exporting
 * IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND and its paired `_ASSERTIONS` array
 * correctly -- was NEVER added to DATA_MODULES, so its six self-executing assertions
 * silently never ran under `npm run assert`. This is the exact orphan class imp-35827 fixed
 * for the earlier imp-3576x/imp-3577x cohort: a module can be fully self-contained and
 * correctly exported yet still never execute if the DATA_MODULES wiring step is missed. None
 * of the five modules is viz-suffixed and none has a registered page in App.jsx or
 * visualizations-index.js, which is the expected registry-only status for this batch (no viz
 * mismatch).
 *
 * FIX. Added '/src/data/imp-35813-req4-required-height-sigma-landmark-extend.js' to
 * scripts/run-assertions.mjs DATA_MODULES (minimal fix, alongside this audit module).
 *
 * SCOPE. Audit + minimal wiring fix only. No mathematical content was changed in any audited
 * module. Changes no bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35590-registration-reachability-audit (method precedent)
 * @see imp-35838-frontier-batch-registration-reachability-audit.js (method precedent, prior cohort)
 * @see imp-35827 (fixed the identical orphan-DATA_MODULES-entry class for the prior cohort)
 * @see imp-35809-krawczyk-surplus-split-band-and-height-profile.js (audited module)
 * @see imp-35810-cancellation-onset-height.js (audited module)
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table.js (audited module)
 * @see imp-35812-w1-summation-scheme-measured-cost.js (audited module)
 * @see imp-35813-req4-required-height-sigma-landmark-extend.js (audited module -- was orphaned, now fixed)
 */

const AUDITED_BATCH = [
  {
    file: 'imp-35809-krawczyk-surplus-split-band-and-height-profile',
    resultExport: 'IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
  {
    file: 'imp-35810-cancellation-onset-height',
    resultExport: 'IMP35810_CANCELLATION_ONSET_HEIGHT',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
  {
    file: 'imp-35811-exact-debruijn-arbitrary-precision-digit-table',
    resultExport: 'IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
  {
    file: 'imp-35812-w1-summation-scheme-measured-cost',
    resultExport: 'IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST',
    listedInDataModulesBeforeFix: true,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
  {
    file: 'imp-35813-req4-required-height-sigma-landmark-extend',
    resultExport: 'IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND',
    listedInDataModulesBeforeFix: false,
    hasAssertionsExport: true,
    hasVizPage: false,
  },
];

const ORPHANS_FOUND = AUDITED_BATCH.filter((m) => !m.listedInDataModulesBeforeFix);
const VIZ_STATUS_MISMATCH_FOUND = 0;

export const IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35858',
  proofSection: 'audit',
  question:
    'Do the five newer committed modules imp-35809/imp-35810/imp-35811/imp-35812/imp-35813 ' +
    'each export a result-object const plus a wired *_ASSERTIONS array registered in ' +
    'scripts/run-assertions.mjs, and does viz-suffixed vs registry-only status match ' +
    'App.jsx / visualizations-index.js?',
  verdictShort:
    'ONE ORPHAN FOUND AND FIXED. imp-35809/imp-35810/imp-35811/imp-35812 were already fully ' +
    'wired. imp-35813-req4-required-height-sigma-landmark-extend.js exported a correct result ' +
    'const and *_ASSERTIONS array but was never added to DATA_MODULES, so its assertions never ' +
    'ran under `npm run assert`. Fixed by adding it to DATA_MODULES. No viz-status mismatch: ' +
    'all five are correctly registry-only (none is viz-suffixed or registered in App.jsx / ' +
    'visualizations-index.js).',
  auditedBatch: AUDITED_BATCH,
  danglingOrOrphanedFound: ORPHANS_FOUND.length,
  orphanedFiles: ORPHANS_FOUND.map((m) => m.file),
  vizStatusMismatchFound: VIZ_STATUS_MISMATCH_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT + MINIMAL FIX (not rigorous, not a measurement of a mathematical quantity). ' +
    'Checked scripts/run-assertions.mjs DATA_MODULES wiring, each module’s exports, and ' +
    'App.jsx / visualizations-index.js viz-page registration for five recently committed ' +
    'modules. Result: one genuine orphan (imp-35813, missing DATA_MODULES entry) found and ' +
    'fixed; no viz-status mismatch. Changes no bound; establishes no operator positivity; no ' +
    'RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35809, imp-35810, imp-35811, imp-35812, imp-35813 (audited modules); imp-35590/' +
    'imp-35838 (registration/reachability method); imp-35827 (identical orphan class fixed ' +
    'in the prior cohort).',
};

export const IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35858-batch-size-five',
    description: 'exactly five modules were audited',
    holds: () => AUDITED_BATCH.length === 5,
  },
  {
    id: 'imp35858-all-have-assertions-export-and-result-export',
    description: 'every audited file exports a result-object const and a *_ASSERTIONS export',
    holds: () => AUDITED_BATCH.every((m) => m.hasAssertionsExport === true && !!m.resultExport),
  },
  {
    id: 'imp35858-exactly-one-orphan-found',
    description: 'exactly one module (imp-35813) was missing from DATA_MODULES before this fix',
    holds: () =>
      ORPHANS_FOUND.length === 1 &&
      ORPHANS_FOUND[0].file === 'imp-35813-req4-required-height-sigma-landmark-extend',
  },
  {
    id: 'imp35858-orphan-count-matches-summary-field',
    description: 'danglingOrOrphanedFound matches the actual orphan count',
    holds: () =>
      IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound ===
      ORPHANS_FOUND.length,
  },
  {
    id: 'imp35858-no-viz-page-for-any-module',
    description: 'all five modules are registry-only (no viz page), matching App.jsx / visualizations-index.js absence',
    holds: () => AUDITED_BATCH.every((m) => m.hasVizPage === false),
  },
  {
    id: 'imp35858-honesty-gate-no-qed',
    description: 'Audit + minimal fix only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35858-newer-cohort-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35858_NEWER_COHORT_REGISTRATION_REACHABILITY_AUDIT;
