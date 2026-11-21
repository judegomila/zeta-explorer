/**
 * @module imp-36170-imp3606x67x82x95x96x97-cross-reference-integrity-audit
 *
 * imp-36170 (meta, audit): a cross-reference @see integrity audit (imp-35186/imp-35327/imp-35776
 * method) on the S-frontier cohort imp-36066/36067/36082/36095/36096/36097. Resolves every
 * filename-suffixed @see target and named ES import against the src/data directory listing and
 * every bare "imp-NNNNN" ticket citation against an id in improvement-queue.js / improvements.js.
 *
 * SCOPE NOTE. The predecessor imp-36110 audit swept the imp-36033/36034/36046/36061/36062/36064/
 * 36065 cohort clean; the newer imp-36066/36067/36082/36095/36096/36097 modules were never checked.
 *
 * METHOD. grep -n "@see" and grep -n "^import" on all six files; every filename-suffixed @see
 * target checked against the src/data directory listing; the two named ES imports (only
 * imp-36066 carries any) checked against the target module's actual exports; every bare
 * imp-NNNNN citation (grep -oE "imp-[0-9]+[a-z]?") checked for a literal occurrence in
 * improvement-queue.js.
 *
 * FINDING. Zero dangling references across all six files. imp-36066's four filename @see targets
 * (imp-35969-krawczyk-residual-directed-rounding-width, imp-36017-krawczyk-residual-surrogate-vs-
 * layer-discrepancy, imp-34687-crossover-interval-arithmetic-scope, imp-34714-krawczyk-existence-
 * uniqueness-lemma) and its two named ES imports (IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH,
 * IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY) all resolve. imp-36067's two @see
 * targets (glossary.js, imp-36023-kbn-combined-worst-ladder) resolve. imp-36082's three @see
 * targets (imp-36045-perN-translation-route-readiness-assessment, lambda-burgers-shock-lipschitz,
 * lambda-polymath15-bridge) resolve. imp-36095's six @see targets (imp-36062-kbn-kahan-separation-
 * onset, imp-36124-kbn-kahan-soft-onset-honest-status, imp-36023-kbn-combined-worst-ladder,
 * imp-35852-w1-summation-adversarial-ordering, imp-35812-w1-summation-scheme-measured-cost, plus a
 * Higham 2002 literature cite) resolve. imp-36096's six @see targets (imp-36061-w1-accumulator-
 * recovery-detuning-width, imp-35991-w1-accumulator-baseline-margin-to-resonance, imp-35949-w1-
 * accumulator-frequency-grid-robustness, imp-35890-w1-running-accumulator-apriori-bound, imp-35812-
 * w1-summation-scheme-measured-cost, plus a Higham 2002 literature cite) resolve. imp-36097's four
 * @see targets (imp-36046-e-share-tail-landmarks-viz-data, imp-35997-eflow-max-share-height,
 * imp-35971-etrunc-sole-survivor-height, imp-35889-e-share-decomposition-at-knees) resolve. All 39
 * distinct bare imp-NNNNN citations across the six files (imp-2519, imp-2564, imp-2631, imp-2642,
 * imp-2643, imp-33582, imp-3406, imp-34687, imp-34687a, imp-34714, imp-34714a, imp-35681, imp-35725,
 * imp-35760, imp-35761, imp-35812, imp-35852, imp-35889, imp-35890, imp-35949, imp-35969, imp-35971,
 * imp-35991, imp-35997, imp-36017, imp-36023, imp-36045, imp-36046, imp-36061, imp-36062, imp-36066,
 * imp-36067, imp-36082, imp-36085, imp-36095, imp-36096, imp-36097, imp-36124, imp-3715) resolve to
 * real occurrences in improvement-queue.js (including each file's own self-citation of its ticket
 * id). The two sub-gap-suffixed
 * citations (imp-34687a, imp-34714a) resolve to sub-gap labels documented inside their parent
 * modules (imp-34687-crossover-interval-arithmetic-scope.js, imp-34714-krawczyk-existence-
 * uniqueness-lemma.js), not to standalone queue ids -- consistent with the imp-34687a/imp-34714a
 * sub-gap convention used elsewhere (e.g. glossary.js).
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check (none needed
 * correction). Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * C_mb GUE-conditional per imp-486 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit.js (predecessor audit, prior cohort)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status.js (audited: clean)
 * @see imp-36067-glossary-headword-duplicate-audit.js (audited: clean)
 * @see imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (audited: clean)
 * @see imp-36095-kbn-kahan-intermittency-band.js (audited: clean)
 * @see imp-36096-w1-accumulator-joint-recovery-contour.js (audited: clean)
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (audited: clean)
 */

const AUDITED_COHORT = [
  'imp-36066-residual-node-no-machine-certificate-honest-status',
  'imp-36067-glossary-headword-duplicate-audit',
  'imp-36082-routeB-perN-rate-form-and-bridge-consumability',
  'imp-36095-kbn-kahan-intermittency-band',
  'imp-36096-w1-accumulator-joint-recovery-contour',
  'imp-36097-e-share-threshold-crossings-viz-data',
];

const DISTINCT_FILENAME_TARGETS_CHECKED = 21;
const DISTINCT_NAMED_IMPORTS_CHECKED = 2;
const DISTINCT_BARE_CITATIONS_CHECKED = 39;
const DANGLING_REFERENCES_FOUND = 0;

export const IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-36170',
  proofSection: 'audit',
  question:
    'Do the @see tags, ES imports, and bare imp-NNNNN ticket citations in the ' +
    'imp-36066/36067/36082/36095/36096/36097 cohort all resolve to real files, real exports, ' +
    'and real tickets -- or are there dangling references (the imp-58685 typo class)?',
  verdictShort:
    'CLEAN. Zero dangling references. All 21 distinct filename-suffixed @see targets, both ' +
    'named ES imports, and all 39 distinct bare imp-NNNNN citations across the six-module ' +
    'cohort resolve to real files, real exports, or real tickets.',
  auditedCohort: AUDITED_COHORT,
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  distinctNamedImportsChecked: DISTINCT_NAMED_IMPORTS_CHECKED,
  distinctBareCitationsChecked: DISTINCT_BARE_CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every ' +
    '@see tag, named ES import, and bare imp-NNNNN citation in the six imp-3606x/3609x cohort ' +
    'files against the actual src/data file listing, export lists, and improvement-queue.js. ' +
    'Zero dangling references found. Changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; C_mb GUE-conditional per imp-486 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36110 (predecessor audit, same ' +
    'method, prior cohort); imp-36066/36067/36082/36095/36096/36097 (the audited cohort).',
};

export const IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36170-cohort-size',
    description: 'the audit covers exactly the six named cohort members',
    holds: () => IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.auditedCohort.length === 6,
  },
  {
    id: 'imp36170-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, imports, or bare ticket citations',
    holds: () => IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36170-citation-counts-recorded',
    description: 'the distinct filename-target, named-import, and bare-citation counts checked are all positive',
    holds: () =>
      IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked > 0 &&
      IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctNamedImportsChecked > 0 &&
      IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctBareCitationsChecked > 0,
  },
  {
    id: 'imp36170-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36170-imp3606x67x82x95x96x97-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36170_CROSS_REFERENCE_INTEGRITY_AUDIT;
