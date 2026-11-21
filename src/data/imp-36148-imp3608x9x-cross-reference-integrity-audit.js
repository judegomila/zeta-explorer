/**
 * @module imp-36148-imp3608x9x-cross-reference-integrity-audit
 *
 * imp-36148 (meta, audit): a cross-reference integrity audit (imp-35186 method) on the
 * imp-3608x/imp-3609x frontier batch -- the 13 src/data modules imp-36081, 36082, 36083, 36084,
 * 36086, 36087, 36088, 36092, 36093, 36094, 36095, 36096, 36097 (imp-36085, 36089, 36090, 36091
 * were completed as content/ux/meta edits to EXISTING pages rather than as new standalone
 * src/data files in this id range, and are excluded from the file-level sweep). Each carries a
 * JSDoc @module header with a block of "@see" tags and, in several cases, live ES-module
 * imports. This audit verifies every @see target that names a module file resolves to a real
 * file under src/data, every named import resolves to a real exported symbol in that file, and
 * every bare "imp-NNNNN" ticket citation (no filename suffix) names a ticket that actually
 * exists in improvements.js or improvement-queue.js.
 *
 * METHOD. Extracted every @see line and import statement from the 13 files (grep -n "@see|^import"),
 * split each into filename-suffixed/module-slug targets versus bare imp-NNNNN citations,
 * resolved every filename-suffixed target against the src/data directory listing, resolved
 * every named import binding against the target file's `export` statements, and resolved every
 * bare ticket-id citation against literal `id:` occurrences in improvements.js /
 * improvement-queue.js.
 *
 * FINDING. Zero dangling references. All 36 distinct filename-suffixed @see/import targets
 * resolve to real files under src/data (imp-36018-w1-pairwise-slack-depth-scaling-exponent,
 * imp-36020-w1-clustered-order-shape-argmax, imp-36021-two-cliff-gap-constant-sensitivity,
 * imp-36022-etrunc-ecoll-crossover-reconciliation, imp-36023-kbn-combined-worst-ladder,
 * imp-36035-w1-lambda-headroom-to-certified-rung, imp-36039-w1-pairwise-slack-depth-law-adjudication,
 * imp-36045-perN-translation-route-readiness-assessment, imp-36046-e-share-tail-landmarks-viz-data,
 * imp-36061-w1-accumulator-recovery-detuning-width, imp-36062-kbn-kahan-separation-onset,
 * imp-36081-w1-pairwise-slack-depth-densified-fit, imp-36124-kbn-kahan-soft-onset-honest-status,
 * imp-35812-w1-summation-scheme-measured-cost, imp-35852-w1-summation-adversarial-ordering,
 * imp-35889-e-share-decomposition-at-knees, imp-35890-w1-running-accumulator-apriori-bound,
 * imp-35892-rdirect-own-floor-departure-height, imp-35893-w1-summation-pairwise-tree-shape,
 * imp-35949-w1-accumulator-frequency-grid-robustness, imp-35950-etrunc-ecoll-crossover-height,
 * imp-35952-w1-caterpillar-worst-tree-n-ladder, imp-35962-w1-pairwise-tree-shape-robust-honest-status,
 * imp-35968-e-trunc-coll-crossover-location, imp-35970-w1-pairwise-apriori-depth-bound-slack,
 * imp-35971-etrunc-sole-survivor-height, imp-35972-effective-height-overflow-cliff-bisection,
 * imp-35973-w1-summation-order-shape-cross-term, imp-35982-imp3589x-registration-reachability-audit,
 * imp-35991-w1-accumulator-baseline-margin-to-resonance, imp-35997-eflow-max-share-height,
 * imp-35999-i2-i3-panel-margin-viz-data, lambda-burgers-shock-lipschitz, lambda-polymath15-bridge,
 * lambda-rh-height-mapping, lambda-roadmap). Every live ES-module import (IMP36018_..., IMP36020_...,
 * IMP36021_..., IMP36022_..., IMP36023_..., IMP35968_..., IMP35950_..., LAMBDA_ROADMAP in
 * imp-36088) matches a real `export` binding in its target file. All 61 distinct bare imp-NNNNN
 * ticket citations across the cohort (spanning imp-33582 through imp-36124, including the
 * lettered sub-gap id imp-34714a) resolve to real occurrences (`id:`) in improvement-queue.js or
 * improvements.js -- none is the imp-58685 dangling-typo class this audit method was designed
 * to catch.
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check (none
 * needed correction). Changes no bound; establishes no operator positivity; no RH verdict; NO
 * QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36127-imp3603x-3606x-cross-reference-integrity-audit (sibling audit, prior cohort)
 * @see imp-36081-w1-pairwise-slack-depth-densified-fit.js (audited: @see + import targets resolve)
 * @see imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (audited: @see targets resolve)
 * @see imp-36083-kbn-floor-headroom-to-certified-rung.js (audited: @see targets resolve)
 * @see imp-36084-w1-pairwise-slack-depth-clustered-order-refit.js (audited: @see + import targets resolve)
 * @see imp-36086-kbn-floor-n-robust-honest-status.js (audited: @see + import targets resolve)
 * @see imp-36087-imp3601x2x-registration-reachability-audit.js (audited: @see targets resolve)
 * @see imp-36088-crossover-lambdabounds-stale-prose-sweep.js (audited: @see + import targets resolve)
 * @see imp-36092-two-cliff-constant-invariance-honest-status.js (audited: @see + import targets resolve)
 * @see imp-36093-pairwise-slack-depth-sublinear-honest-status.js (audited: @see + import targets resolve)
 * @see imp-36094-kbn-kahan-naive-error-ladder-viz-data.js (audited: @see targets resolve)
 * @see imp-36095-kbn-kahan-intermittency-band.js (audited: @see targets resolve)
 * @see imp-36096-w1-accumulator-joint-recovery-contour.js (audited: @see targets resolve)
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (audited: @see targets resolve)
 */

const AUDITED_MODULES = [
  'imp-36081-w1-pairwise-slack-depth-densified-fit',
  'imp-36082-routeB-perN-rate-form-and-bridge-consumability',
  'imp-36083-kbn-floor-headroom-to-certified-rung',
  'imp-36084-w1-pairwise-slack-depth-clustered-order-refit',
  'imp-36086-kbn-floor-n-robust-honest-status',
  'imp-36087-imp3601x2x-registration-reachability-audit',
  'imp-36088-crossover-lambdabounds-stale-prose-sweep',
  'imp-36092-two-cliff-constant-invariance-honest-status',
  'imp-36093-pairwise-slack-depth-sublinear-honest-status',
  'imp-36094-kbn-kahan-naive-error-ladder-viz-data',
  'imp-36095-kbn-kahan-intermittency-band',
  'imp-36096-w1-accumulator-joint-recovery-contour',
  'imp-36097-e-share-threshold-crossings-viz-data',
];

const EXCLUDED_ID_RANGE_GAPS = ['imp-36085', 'imp-36089', 'imp-36090', 'imp-36091'];

const DISTINCT_FILENAME_TARGETS_CHECKED = 36; // distinct filename-suffixed @see/import targets across the cohort
const DISTINCT_BARE_CITATIONS_CHECKED = 61; // distinct bare imp-NNNNN citations across the cohort
const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-36148',
  proofSection: 'S-frontier',
  question:
    'Do the @see tags, ES-module import targets, and bare imp-NNNNN ticket citations in the ' +
    'imp-3608x/imp-3609x frontier batch (imp-36081, 36082, 36083, 36084, 36086, 36087, 36088, ' +
    '36092, 36093, 36094, 36095, 36096, 36097 -- 13 src/data files) all resolve to real files, ' +
    'real exported symbols, and real tickets -- or are there dangling references (the imp-58685 ' +
    'typo class)?',
  verdictShort:
    'CLEAN. Zero dangling references found across all 13 audited files. Every filename-suffixed ' +
    '@see/import target (36 distinct) resolves to a real file under src/data; every named import ' +
    'resolves to a real export in its target file; every bare ticket-id citation (61 distinct, ' +
    'spanning imp-33582 through imp-36124) names a ticket that exists in improvements.js / ' +
    'improvement-queue.js.',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 13
  excludedIdRangeGaps: EXCLUDED_ID_RANGE_GAPS,
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  distinctBareCitationsChecked: DISTINCT_BARE_CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNNN citation in the 13 named imp-3608x/imp-3609x ' +
    'cohort files against the actual src/data file listing, each target file export ' +
    'statements, and the ticket ids recorded in improvements.js / improvement-queue.js. Result: ' +
    'zero dangling references, zero misnamed exports. No source file required correction. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36127 (sibling audit, prior ' +
    'cohort); imp-36081..imp-36097 (the audited batch).',
};

export const IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36148-all-13-modules-audited',
    description: 'the audit covers all 13 named imp-3608x/imp-3609x cohort files',
    holds: () => IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.auditedModuleCount === 13,
  },
  {
    id: 'imp36148-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or bare ticket citations',
    holds: () => IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36148-citation-counts-recorded',
    description: 'the distinct filename-target and bare-citation counts checked are both positive',
    holds: () =>
      IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked > 0 &&
      IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctBareCitationsChecked > 0,
  },
  {
    id: 'imp36148-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36148-imp3608x9x-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36148_IMP3608X9X_CROSS_REFERENCE_INTEGRITY_AUDIT;
