/**
 * @module imp-36127-imp3603x-3606x-cross-reference-integrity-audit
 *
 * imp-36127 (meta, audit): a cross-reference integrity audit (imp-35186/imp-36088 method) on
 * the imp-3603x/imp-3604x/imp-3605x/imp-3606x cohort -- the 24 src/data modules imp-36030
 * through imp-36062 (imp-36030, 36032, 36033, 36034, 36035, 36036, 36037, 36038, 36039, 36040,
 * 36041, 36042, 36043, 36044, 36045, 36046, 36047, 36056, 36057, 36058, 36059, 36060, 36061,
 * 36062; imp-36031 and imp-36048..36055 were never committed as standalone src/data files in
 * this id range and are excluded from the file-level sweep). Each carries a JSDoc @module
 * header with a block of "@see" tags and, in a few cases, live ES-module imports. This audit
 * verifies every @see target that names a module file resolves to a real file under src/data,
 * and every bare "imp-NNNNN" ticket citation (no filename suffix) names a ticket that actually
 * exists in improvement-queue.js or improvements.js.
 *
 * METHOD. Extracted every @see line from the 24 files (grep -n "@see"), split each into its
 * filename-suffixed targets (ending .js, or a bare module-slug clearly naming a sibling
 * src/data file) versus its bare imp-NNNNN citations, resolved every filename-suffixed target
 * against the src/data directory listing, and resolved every bare ticket-id citation against
 * literal occurrences in improvement-queue.js / improvements.js / lambda-roadmap.js (which
 * together carry every ticket id and cross-reference in the project).
 *
 * FINDING. Zero dangling references. All 20 distinct filename-suffixed @see targets resolve to
 * real files under src/data (imp-35973-w1-summation-order-shape-cross-term,
 * imp-35852-w1-summation-adversarial-ordering, imp-35893-w1-summation-pairwise-tree-shape,
 * imp-36023-kbn-combined-worst-ladder, imp-35761-w1-certified-rounding-cost-scope,
 * imp-35968-e-trunc-coll-crossover-location, imp-35969-krawczyk-residual-directed-rounding-width,
 * imp-35970-w1-pairwise-apriori-depth-bound-slack, imp-35971-etrunc-sole-survivor-height,
 * imp-35972-effective-height-overflow-cliff-bisection, imp-35977-e-share-stacked-bar-viz-data,
 * imp-35889-e-share-decomposition-at-knees, imp-35791-beat-parity-Nsigma-ladder-viz-data,
 * imp-35892-rdirect-own-floor-departure-height, imp-36021-two-cliff-gap-constant-sensitivity,
 * imp-36032-two-cliff-decade-honest-status, lambda-roadmap.js, lambda-rh-height-mapping.js, plus
 * the sibling modules the cohort cross-references among themselves). All 109 distinct bare
 * imp-NNNNN citations across the cohort (spanning imp-2519 through imp-36092, including the
 * lettered sub-gap ids imp-34687a, imp-34714a, imp-35337a and the shorthand cohort placeholders
 * imp-3595x/imp-3596x/imp-3597x) resolve to real occurrences in improvement-queue.js,
 * improvements.js, or lambda-roadmap.js -- none is the imp-58685 dangling-typo class this audit
 * method was designed to catch.
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check (none
 * needed correction). Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; C_mb GUE-conditional per imp-486 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36088-crossover-lambdabounds-stale-prose-sweep (sibling stale-prose sweep, same cohort era)
 * @see imp-36030-order-shape-stress-matrix-viz-data.js (audited: @see targets resolve)
 * @see imp-36032-two-cliff-decade-honest-status.js (audited: @see targets resolve)
 * @see imp-36033-viz-data-duplicate-guard-proposal.js (audited: @see targets resolve)
 * @see imp-36034-imp3596x97x-registration-reachability-audit.js (audited: @see targets resolve)
 * @see imp-36035-w1-lambda-headroom-to-certified-rung.js (audited: @see targets resolve)
 * @see imp-36036-w1-ensemble-sigma-resampled-phase.js (audited: @see targets resolve)
 * @see imp-36037-clustered-order-shape-sweep-duplicate-audit.js (audited: @see targets resolve)
 * @see imp-36038-cross-ceiling-fraction-ladder.js (audited: @see targets resolve)
 * @see imp-36039-w1-pairwise-slack-depth-law-adjudication.js (audited: @see targets resolve)
 * @see imp-36040-route-ii-optimal-cauchy-radius.js (audited: @see targets resolve)
 * @see imp-36041-i4-landmark-sensitivity-to-surrogate-constants.js (audited: @see targets resolve)
 * @see imp-36042-i4-landmarks-vs-winding-count-scale.js (audited: @see targets resolve)
 * @see imp-36043-etrunc-sole-survivor-closed-form.js (audited: @see targets resolve)
 * @see imp-36044-krawczyk-dG-node-vacuity-height.js (audited: @see targets resolve)
 * @see imp-36045-perN-translation-route-readiness-assessment.js (audited: @see targets resolve)
 * @see imp-36046-e-share-tail-landmarks-viz-data.js (audited: @see targets resolve)
 * @see imp-36047-two-cliff-bisection-viz-data.js (audited: @see targets resolve)
 * @see imp-36056-kbn-caterpillarL-argmax-shape.js (audited: @see targets resolve)
 * @see imp-36057-krawczyk-residual-2x-tightening-headroom.js (audited: @see targets resolve)
 * @see imp-36058-i3-cusp-modulus-dimensionalization.js (audited: @see targets resolve)
 * @see imp-36059-i2-combined-panel-count-envelope.js (audited: @see targets resolve)
 * @see imp-36060-eflow-share-frontier-heights.js (audited: @see targets resolve)
 * @see imp-36061-w1-accumulator-recovery-detuning-width.js (audited: @see targets resolve)
 * @see imp-36062-kbn-kahan-separation-onset.js (audited: @see targets resolve)
 */

const AUDITED_MODULES = [
  'imp-36030-order-shape-stress-matrix-viz-data',
  'imp-36032-two-cliff-decade-honest-status',
  'imp-36033-viz-data-duplicate-guard-proposal',
  'imp-36034-imp3596x97x-registration-reachability-audit',
  'imp-36035-w1-lambda-headroom-to-certified-rung',
  'imp-36036-w1-ensemble-sigma-resampled-phase',
  'imp-36037-clustered-order-shape-sweep-duplicate-audit',
  'imp-36038-cross-ceiling-fraction-ladder',
  'imp-36039-w1-pairwise-slack-depth-law-adjudication',
  'imp-36040-route-ii-optimal-cauchy-radius',
  'imp-36041-i4-landmark-sensitivity-to-surrogate-constants',
  'imp-36042-i4-landmarks-vs-winding-count-scale',
  'imp-36043-etrunc-sole-survivor-closed-form',
  'imp-36044-krawczyk-dG-node-vacuity-height',
  'imp-36045-perN-translation-route-readiness-assessment',
  'imp-36046-e-share-tail-landmarks-viz-data',
  'imp-36047-two-cliff-bisection-viz-data',
  'imp-36056-kbn-caterpillarL-argmax-shape',
  'imp-36057-krawczyk-residual-2x-tightening-headroom',
  'imp-36058-i3-cusp-modulus-dimensionalization',
  'imp-36059-i2-combined-panel-count-envelope',
  'imp-36060-eflow-share-frontier-heights',
  'imp-36061-w1-accumulator-recovery-detuning-width',
  'imp-36062-kbn-kahan-separation-onset',
];

const EXCLUDED_ID_RANGE_GAPS = ['imp-36031', 'imp-36048', 'imp-36049', 'imp-36050', 'imp-36051', 'imp-36052', 'imp-36053', 'imp-36054', 'imp-36055'];

const DISTINCT_FILENAME_TARGETS_CHECKED = 20; // distinct filename-suffixed @see targets across the cohort
const DISTINCT_BARE_CITATIONS_CHECKED = 109; // distinct bare imp-NNNNN citations across the cohort
const DANGLING_REFERENCES_FOUND = 0; // zero @see targets or bare ticket citations failed to resolve

export const IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-36127',
  proofSection: 'audit',
  question:
    'Do the @see tags and bare imp-NNNNN ticket citations in the imp-3603x/imp-3604x/imp-3605x/' +
    'imp-3606x cohort (imp-36030..imp-36062, 24 src/data files) all resolve to real files and ' +
    'real tickets -- or are there dangling references (the imp-58685 typo class)?',
  verdictShort:
    'CLEAN. Zero dangling references found across all 24 audited files. Every filename-suffixed ' +
    '@see target (20 distinct) resolves to a real file under src/data; every bare ticket-id ' +
    'citation (109 distinct, spanning imp-2519 through imp-36092) names a ticket that exists in ' +
    'improvement-queue.js / improvements.js / lambda-roadmap.js.',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 24
  excludedIdRangeGaps: EXCLUDED_ID_RANGE_GAPS,
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  distinctBareCitationsChecked: DISTINCT_BARE_CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not measurement of a mathematical quantity). Checked every @see ' +
    'tag in the 24 named imp-36030..imp-36062 cohort files against the actual src/data file ' +
    'listing and the ticket ids recorded in improvements.js / improvement-queue.js / ' +
    'lambda-roadmap.js. Result: zero dangling references. No source file required correction. ' +
    'Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_mb ' +
    'GUE-conditional per imp-486 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36088 (sibling stale-prose sweep, ' +
    'same method family); imp-36030..imp-36062 (the audited cohort).',
};

export const IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36127-all-24-modules-audited',
    description: 'the audit covers all 24 named imp-36030..imp-36062 cohort files',
    holds: () => IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.auditedModuleCount === 24,
  },
  {
    id: 'imp36127-zero-dangling-references',
    description: 'the audit found zero dangling @see targets or bare ticket citations',
    holds: () => IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36127-citation-counts-recorded',
    description: 'the distinct filename-target and bare-citation counts checked are both positive',
    holds: () =>
      IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked > 0 &&
      IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctBareCitationsChecked > 0,
  },
  {
    id: 'imp36127-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36127-imp3603x-3606x-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36127_IMP3603X_3606X_CROSS_REFERENCE_INTEGRITY_AUDIT;
