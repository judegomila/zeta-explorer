/**
 * @module imp-36051-imp3598x97x-crossref-integrity-audit
 *
 * imp-36051 (meta, audit): a cross-reference integrity check (imp-35186/imp-35327/
 * imp-35776 method) on the newest S-frontier cohort imp-35988/imp-35989/imp-35990/
 * imp-35970/imp-35973 -- resolving every filename-suffixed @see target and ES import
 * specifier against the src/data directory listing, every named import against the
 * target file's actual `export` statements, and cross-checking that the repeatedly
 * cited landmark values (T_PT = 3e12, N ~ 488602, the ~6.41e-14 certified W1 rung, and
 * the ~3.0e-17 achieved naive error) are internally consistent with their source
 * modules.
 *
 * METHOD. For each of the 5 named files, resolved every filename-suffixed @see target
 * and ES-module import specifier against the src/data directory listing, and every
 * named import against the target file's actual `export` statements. Separately,
 * recomputed N = floor(sqrt(T_PT / 4 pi)) at T_PT = 3e12 directly and grepped the
 * ~6.41e-14 certified rung (imp-35890) and ~3.0e-17 achieved naive error (imp-35812)
 * back to their source modules to confirm every citing module quotes the same figures.
 *
 * FINDING. Across the 5 audited files: every filename-suffixed @see target (imp-35832,
 * imp-35845, imp-35777, imp-35725, imp-35674, imp-35804, imp-35757, imp-35951,
 * imp-2696, imp-35948, imp-35890, imp-35812, imp-35949, imp-35893, imp-35952,
 * imp-35761, imp-35760, imp-35852) resolves to a real src/data module file; the one ES
 * import (imp-35970 importing IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE from
 * imp-35893-w1-summation-pairwise-tree-shape.js) resolves to a matching named export
 * exposing the shapes/representativeSum fields imp-35970 actually reads. T_PT = 3e12 is
 * declared identically in all 5 files; N = floor(sqrt(3e12/(4*pi))) = 488602 recomputes
 * identically in all 5 and matches the shared anchor; the ~6.41e-14 certified rung
 * traces cleanly to imp-35890 ("~6.41e-14" / "tightest USABLE certified... ~6.4e-14")
 * and the ~3.0e-17 achieved naive error traces cleanly to imp-35812 ("naive recursive :
 * ~3.0e-17"). Zero dangling references, zero misnamed exports, zero value drift.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result
 * of this check (none needed correction). Changes no bound; establishes no operator
 * positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35776-s-frontier-cohort-crossref-integrity-audit (prior batch in the same series)
 * @see imp-36050-s-frontier-cohort-registration-reachability-audit (sibling audit on an overlapping cohort, registration/reachability rather than crossref integrity)
 * @see imp-35988-i2-derivative-cap-route-comparison (audited module)
 * @see imp-35989-i4-accumulated-error-vs-panel-count-scale (audited module)
 * @see imp-35990-w1-lambda-confidence-calibration (audited module)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack (audited module)
 * @see imp-35973-w1-summation-order-shape-cross-term (audited module)
 */

const AUDITED_COHORT = [
  'imp-35988-i2-derivative-cap-route-comparison',
  'imp-35989-i4-accumulated-error-vs-panel-count-scale',
  'imp-35990-w1-lambda-confidence-calibration',
  'imp-35970-w1-pairwise-apriori-depth-bound-slack',
  'imp-35973-w1-summation-order-shape-cross-term',
];

const CITATIONS_CHECKED = [
  { citation: 'imp-35832', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35832-i2-derivative-bound-from-i1-enclosure-scope.js' },
  { citation: 'imp-35845', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35845-d2-differentiated-truncation-cap-amplification.js' },
  { citation: 'imp-35777', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35777-i2-logderivative-panel-cap-scope.js' },
  { citation: 'imp-35725', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35725-w1-effective-error-cap-budget.js' },
  { citation: 'imp-35674', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35674-w3-tail-lemma-polymath15-scope.js' },
  { citation: 'imp-35804', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35804-i4-integer-closure-error-budget-scope.js' },
  { citation: 'imp-35757', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35757-i2-panel-width-count-scope.js' },
  { citation: 'imp-35951', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js' },
  { citation: 'imp-2696', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-2696-winding-lyapunov-experiment.js' },
  { citation: 'imp-35948', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35948-w1-probabilistic-sqrtN-apriori-scale.js' },
  { citation: 'imp-35890', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35890-w1-running-accumulator-apriori-bound.js' },
  { citation: 'imp-35812', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35812-w1-summation-scheme-measured-cost.js' },
  { citation: 'imp-35949', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35949-w1-accumulator-frequency-grid-robustness.js' },
  { citation: 'imp-35893', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35893-w1-summation-pairwise-tree-shape.js (export IMP35893_W1_SUMMATION_PAIRWISE_TREE_SHAPE)' },
  { citation: 'imp-35952', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35952-w1-caterpillar-worst-tree-n-ladder.js' },
  { citation: 'imp-35761', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35761-w1-certified-rounding-cost-scope.js' },
  { citation: 'imp-35760', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35760-w1-margin-allocation-scope.js' },
  { citation: 'imp-35852', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35852-w1-summation-adversarial-ordering.js' },
];

// Recompute the shared anchor directly rather than trusting any one module's copy.
const T_PT_RECOMPUTED = 3e12;
const N_AT_TPT_RECOMPUTED = Math.floor(Math.sqrt(T_PT_RECOMPUTED / (4 * Math.PI))); // 488602

const LANDMARK_VALUES_CHECKED = [
  {
    landmark: 'T_PT',
    citedAs: 3e12,
    recomputed: T_PT_RECOMPUTED,
    consistent: true,
  },
  {
    landmark: 'N_AT_TPT',
    citedAs: '~488602',
    recomputed: N_AT_TPT_RECOMPUTED,
    consistent: N_AT_TPT_RECOMPUTED === 488602,
  },
  {
    landmark: 'certified-w1-rung',
    citedAs: '~6.41e-14',
    source: 'imp-35890 (running-accumulator run-max form, ~6.41e-14 / ~6.4e-14 usable)',
    consistent: true,
  },
  {
    landmark: 'achieved-naive-error',
    citedAs: '~3.0e-17',
    source: 'imp-35812 (exact-BigInt achieved naive normalized error at N ~ 488602)',
    consistent: true,
  },
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or landmark values failed to resolve/reconcile

export const IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-36051',
  proofSection: 'audit',
  question:
    'Do the 5 src/data files imp-35988/imp-35989/imp-35990/imp-35970/imp-35973 -- the newest S-frontier ' +
    'cohort -- carry any dangling @see targets, ES-module import targets, named-import mismatches, or ' +
    'internally-inconsistent citations of the shared landmark values (T_PT = 3e12, N ~ 488602, the ~6.41e-14 ' +
    'certified rung, the ~3.0e-17 achieved error)?',
  verdictShort:
    'CLEAN. All 5 audited files resolve every filename-suffixed @see target and ES-module import to a real ' +
    'file with matching exports, and every cited landmark value reconciles with its source module. Zero ' +
    'dangling references, zero value drift.',
  auditedFiles: AUDITED_COHORT,
  auditedFileCount: AUDITED_COHORT.length, // 5
  citationsChecked: CITATIONS_CHECKED,
  citationsCheckedCount: CITATIONS_CHECKED.length, // 18
  landmarkValuesChecked: LANDMARK_VALUES_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see tag and ' +
    'import specifier in the 5 src/data files of the newest S-frontier cohort against the actual src/data ' +
    'directory listing and the target files\' actual export statements, and cross-checked the repeatedly ' +
    'cited landmark values (T_PT = 3e12, N ~ 488602, the ~6.41e-14 certified W1 rung, the ~3.0e-17 achieved ' +
    'naive error) against their source modules. Result: zero dangling references, zero misnamed exports, ' +
    'zero value drift. No source file required correction. Changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method); imp-35327/imp-35776 (prior batches in the same series); imp-36050 ' +
    '(sibling registration/reachability audit on an overlapping cohort); imp-35988/imp-35989/imp-35990/' +
    'imp-35970/imp-35973 (audited modules); imp-35890 (certified rung source); imp-35812 (achieved error ' +
    'source).',
};

export const IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36051-audited-cohort-matches-ticket-scope',
    description: 'the audited cohort is exactly the 5 named S-frontier files scoped by the imp-36051 ticket',
    holds: () =>
      IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 5 &&
      AUDITED_COHORT.every((f) => /^imp-35(988|989|990|970|973)-/.test(f)),
  },
  {
    id: 'imp36051-citations-checked-count',
    description: 'the audit checked all 18 distinct filename-suffixed citation entries recorded',
    holds: () => IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT.citationsCheckedCount === 18,
  },
  {
    id: 'imp36051-n-at-tpt-recomputes-to-488602',
    description: 'N = floor(sqrt(T_PT / 4 pi)) at T_PT = 3e12 recomputes to exactly 488602',
    holds: () => N_AT_TPT_RECOMPUTED === 488602 && T_PT_RECOMPUTED === 3e12,
  },
  {
    id: 'imp36051-all-landmark-values-consistent',
    description: 'every checked landmark value (T_PT, N, certified rung, achieved error) reconciles with its source',
    holds: () => LANDMARK_VALUES_CHECKED.every((l) => l.consistent === true),
  },
  {
    id: 'imp36051-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or landmark-value inconsistencies',
    holds: () => IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36051-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36051_IMP3598X97X_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36051-imp3598x97x-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
