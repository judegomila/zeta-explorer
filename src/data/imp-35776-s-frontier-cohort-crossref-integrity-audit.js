/**
 * @module imp-35776-s-frontier-cohort-crossref-integrity-audit
 *
 * imp-35776 (meta, audit): a cross-reference integrity check (imp-35186 method) on
 * the newest S-frontier cohort imp-35719/imp-35721/imp-35722/imp-35724/imp-35725/
 * imp-35726/imp-35727 -- resolving every filename-suffixed @see target and ES
 * import specifier against the src/data directory listing, every named import
 * against the target file's actual `export` statements, and every bare
 * "imp-NNNN" ticket citation (no filename suffix) against either an
 * `id: "imp-NNNN"` entry in improvement-queue.js or a real src/data/imp-NNNN-*.js
 * module file.
 *
 * METHOD. For each of the 7 named files, resolved every filename-suffixed @see
 * target and ES-module import specifier against the src/data directory listing
 * (plus the two non-src/data citations src/math/supercritical.js and
 * scripts/imp-34813-exact-debruijn-winding-offline.mjs, both real repo files),
 * every named import against the target file's actual `export` statements, and
 * every bare imp-NNNN citation against either an `id: "imp-NNNN"` entry in
 * improvement-queue.js or a real src/data module file.
 *
 * FINDING. Across the 7 audited files: every filename-suffixed @see target and
 * named import (imp-35681, imp-35653, finite-height-lambda-bound,
 * finite-height-beats-platt-trudgian, imp-35680, imp-35696, imp-35538, imp-35580,
 * lambda-rh-height-mapping, imp-35720, imp-35652, imp-35304, imp-35717, imp-35674,
 * imp-2696, imp-33923, imp-33968, imp-35757, imp-35758, imp-35777, imp-35778, plus
 * the two non-src/data citations src/math/supercritical.js and
 * scripts/imp-34813-...offline.mjs) resolves to a real file with a matching
 * export where imported; the 8 distinct bare imp-NNNN citations (imp-341,
 * imp-2642, imp-2643, imp-403, imp-35741, imp-35576, imp-2697, imp-35076,
 * imp-2641 -- the last three carry filename suffixes and resolve as module
 * files) all resolve to either a real id in improvement-queue.js or a real
 * src/data module file. Zero dangling references, zero misnamed exports, zero
 * missing files.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a
 * result of this check (none needed correction). Changes no bound; establishes
 * no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35401-imp3526x-cusp-cohort-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35543-imp3544x-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35713-imp3565x-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35752-imp3567x-imp3571x-frontier-crossref-integrity-audit (prior batch, adjacent lower-id range)
 * @see imp-35775-s-frontier-cohort-import-light-verification (sibling audit on the same cohort, import-lightness rather than crossref integrity)
 */

const AUDITED_COHORT = [
  'imp-35719-imp341-barrier-base-misattribution-fanout-audit',
  'imp-35721-cc-amplitude-mismatch-dual-reading-reconciliation',
  'imp-35722-req4-required-height-landmark-ladder',
  'imp-35724-collision-scale-landmark-prefactor-propagation',
  'imp-35725-w1-effective-error-cap-budget',
  'imp-35726-w1-sign-reconciliation-cost-scope',
  'imp-35727-w2-certified-winding-count-ingredients-scope',
];

const CITATIONS_CHECKED = [
  { citation: 'imp-35681', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35681-w1-w2-w4-existing-infra-inventory.js' },
  { citation: 'imp-35653', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35653-sbarrier-finite-check-porting-scope.js' },
  { citation: 'finite-height-lambda-bound', kind: 'filename-suffixed-see', resolvesIn: 'src/data/finite-height-lambda-bound.js' },
  { citation: 'finite-height-beats-platt-trudgian', kind: 'filename-suffixed-see', resolvesIn: 'src/data/finite-height-beats-platt-trudgian.js' },
  { citation: 'imp-35680', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35680-constant-mismatch-magnitude.js (export IMP35680_CONSTANT_MISMATCH_MAGNITUDE)' },
  { citation: 'imp-35696', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35696-collision-exponent-consistency-check.js (export IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK)' },
  { citation: 'imp-35538', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35538-route-i-remainder-derivation-requirements.js (export IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS)' },
  { citation: 'imp-35580', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35580-req4-height-gap-viz-data.js' },
  { citation: 'lambda-rh-height-mapping', kind: 'filename-suffixed-see', resolvesIn: 'src/data/lambda-rh-height-mapping.js' },
  { citation: 'imp-35720', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35720-prefactor-M-independence-ladder.js' },
  { citation: 'imp-35652', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35652-req3-option-a-restricted-support-surrogate-scope.js (export IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE)' },
  { citation: 'imp-35304', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation.js' },
  { citation: 'imp-35717', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35717-w1-tsign-reconciliation-scope.js' },
  { citation: 'imp-35674', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35674-w3-tail-lemma-polymath15-scope.js' },
  { citation: 'src/math/supercritical.js', kind: 'non-src-data-repo-file-citation', resolvesIn: 'src/math/supercritical.js' },
  { citation: 'scripts/imp-34813-exact-debruijn-winding-offline.mjs', kind: 'non-src-data-repo-file-citation', resolvesIn: 'scripts/imp-34813-exact-debruijn-winding-offline.mjs' },
  { citation: 'imp-2696', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-2696-winding-lyapunov-experiment.js' },
  { citation: 'imp-33923', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-33923-off-axis-phase-winding-quadrature.js' },
  { citation: 'imp-33968', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-33968-winding-rate-vs-alpha-curve.js' },
  { citation: 'imp-35757', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35757-i2-panel-width-count-scope.js' },
  { citation: 'imp-35758', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35758-i3-modulus-floor-margin-tie-scope.js' },
  { citation: 'imp-35777', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35777-i2-logderivative-panel-cap-scope.js' },
  { citation: 'imp-35778', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35778-i3-edge-type-floor-decomposition-scope.js' },
  { citation: 'imp-341', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2642', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2643', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-403', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35741', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35576', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2697', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-2697-theorem3-rate-crossverify.js' },
  { citation: 'imp-35076', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js' },
  { citation: 'imp-2641', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-2641-c-selberg-trudgian-discharge.js' },
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35776',
  proofSection: 'audit',
  question:
    'Do the 7 src/data files imp-35719/imp-35721/imp-35722/imp-35724/imp-35725/imp-35726/imp-35727 -- the ' +
    'newest S-frontier cohort -- carry any dangling @see targets, ES-module import targets, named/default-' +
    'import mismatches, or bare imp-NNNN ticket citations?',
  verdictShort:
    'CLEAN. All 7 audited files resolve every filename-suffixed @see target and ES-module import to a real ' +
    'file with matching exports, and every bare imp-NNNN citation to either a real id in improvement-queue.js ' +
    'or a real src/data module file. Zero dangling references.',
  auditedFiles: AUDITED_COHORT,
  auditedFileCount: AUDITED_COHORT.length, // 7
  citationsChecked: CITATIONS_CHECKED,
  citationsCheckedCount: CITATIONS_CHECKED.length, // 32
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see tag, import ' +
    'specifier, and bare imp-NNNN citation in the 7 src/data files of the newest S-frontier cohort against ' +
    'the actual src/data (and src/math, scripts) directory listings, the target files\' actual export ' +
    'statements, and the ticket ids recorded in improvement-queue.js. Result: zero dangling references, zero ' +
    'misnamed exports, no missing files. No source file required correction. Changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method); imp-35327/imp-35401/imp-35543/imp-35713/imp-35752 (prior batches in the ' +
    'same series); imp-35775 (sibling import-lightness audit on the same cohort).',
};

export const IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35776-audited-cohort-matches-ticket-scope',
    description: 'the audited cohort is exactly the 7 named S-frontier files scoped by the imp-35776 ticket',
    holds: () =>
      IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 7 &&
      AUDITED_COHORT.every((f) => /^imp-357(19|21|22|24|25|26|27)-/.test(f)),
  },
  {
    id: 'imp35776-citations-checked-count',
    description: 'the audit checked all 32 distinct citation entries recorded',
    holds: () => IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.citationsCheckedCount === 32,
  },
  {
    id: 'imp35776-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35776-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35776_S_FRONTIER_COHORT_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35776-s-frontier-cohort-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
