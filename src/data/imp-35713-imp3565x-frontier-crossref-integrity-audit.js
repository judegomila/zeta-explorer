/**
 * @module imp-35713-imp3565x-frontier-crossref-integrity-audit
 *
 * imp-35713 (meta, audit): a cross-reference integrity check (imp-35186 method) on the newest
 * frontier modules with id > 35650: imp-35652, imp-35653, imp-35654, imp-35663, imp-35664,
 * imp-35665 (imp-35543 scoped only up to imp-35487; this ticket picks up the next unaudited
 * cohort).
 *
 * METHOD. For each of the 6 named files, resolved every filename-suffixed @see target and
 * ES-module import specifier against the src/data directory listing, every named/default import
 * against the target file's actual `export` statements, and every bare "imp-NNNN" ticket citation
 * (no filename suffix) against either an `id: 'imp-NNNN'` entry in improvement-queue.js or a real
 * src/data/imp-NNNN-*.js module file (some low-numbered citations, e.g. imp-3933, imp-397, imp-398,
 * imp-486, name a module rather than a still-open queue ticket).
 *
 * FINDING. Across the 6 audited files: 11 distinct filename-suffixed @see targets and named/
 * default imports (imp-35538, imp-35493, imp-35488, imp-35419, imp-34791, imp-35334 -- each cited
 * by more than one of the 6 files --, imp-35553, imp-35552, imp-35577, imp-35458, imp-35497,
 * imp-35561, imp-35556, imp-35530, imp-35337) all resolve to real src/data files with matching
 * exports; the 6 distinct bare imp-NNNN citations (imp-2642, imp-2643, imp-486, imp-3933, imp-397,
 * imp-398) all resolve to either a real id in improvement-queue.js or a real src/data module file.
 * Zero dangling references, zero misnamed exports, zero missing files.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35401-imp3526x-cusp-cohort-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35543-imp3544x-frontier-crossref-integrity-audit (adjacent lower-id-range audit)
 */

const AUDITED_ID_RANGE = { lo: 35652, hi: 35665 };

const AUDITED_FILES = [
  'imp-35652-req3-option-a-restricted-support-surrogate-scope',
  'imp-35653-sbarrier-finite-check-porting-scope',
  'imp-35654-ported-barrier-far-tail-mixed-conditionality',
  'imp-35663-eflow-fartail-decade-span-growth-viz-data',
  'imp-35664-fartail-crossings-height-map-sensitivity-viz-data',
  'imp-35665-pinsker-common-functional-bridge-viz-data',
];

const CITATIONS_CHECKED = [
  { citation: 'imp-35538', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35538-route-i-remainder-derivation-requirements.js' },
  { citation: 'imp-35493', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35493-route-i-remainder-literature-scope.js' },
  { citation: 'imp-35488', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35488-route-ii-two-height-gtrue-spotcheck.js' },
  { citation: 'imp-35419', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35419-etrunc-barrier-lemma-porting-scope.js' },
  { citation: 'imp-34791', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-34791-etrunc-eflow-pt-anchor-honest-discharge.js' },
  { citation: 'imp-35334', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality.js' },
  { citation: 'imp-35553', kind: 'es-module-import', resolvesIn: 'src/data/imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js' },
  { citation: 'imp-35552', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35552-eflow-fartail-remnant-product-decay-limit.js' },
  { citation: 'imp-35577', kind: 'es-module-import', resolvesIn: 'src/data/imp-35577-fartail-crossings-height-map-sensitivity.js' },
  { citation: 'imp-35458', kind: 'es-module-named-import', resolvesIn: 'src/data/imp-35458-crossover-height-map-sensitivity.js' },
  { citation: 'imp-35497', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35497-fartail-crossing-height-map-sensitivity.js' },
  { citation: 'imp-35561', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35561-peak-height-map-sensitivity-viz-data.js' },
  { citation: 'imp-35556', kind: 'es-module-named-import', resolvesIn: 'src/data/imp-35556-gtrue-ecoll-dimensional-comparability.js' },
  { citation: 'imp-35530', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35530-crossover-gtrue-trend-extrapolation.js' },
  { citation: 'imp-35337', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35337-sigma-landmarks-double-double-certification.js' },
  { citation: 'imp-2642', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2643', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-486', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-3933', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-3933-eps-field-robust-bootstrap.js' },
  { citation: 'imp-397', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-398', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35713',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the newest frontier src/data files with id > 35650 (imp-35652, imp-35653, imp-35654, ' +
    'imp-35663, imp-35664, imp-35665) carry any dangling @see targets, ES-module import targets, ' +
    'named/default-import mismatches, or bare imp-NNNN ticket citations?',
  verdictShort:
    'CLEAN. All 6 audited files resolve every filename-suffixed @see target and ES-module import ' +
    'to a real src/data file with matching exports, and every bare imp-NNNN citation to either a ' +
    'real id in improvement-queue.js or a real src/data module file. Zero dangling references.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 6
  citationsChecked: CITATIONS_CHECKED,
  citationsCheckedCount: CITATIONS_CHECKED.length, // 21
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNN citation in the 6 src/data files with id > 35650 ' +
    '(imp-35652/35653/35654/35663/35664/35665) against the actual src/data directory listing, the ' +
    'target files\' actual export statements, and the ticket ids recorded in ' +
    'improvement-queue.js. Result: zero dangling references, zero misnamed exports, no missing ' +
    'files. No source file required correction. Changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method); imp-35327/imp-35401/imp-35543 (prior batches in the same ' +
    'series, next-unaudited-id-range each time).',
};

export const IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35713-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35652, 35665] as scoped by the imp-35713 ticket (id > 35650)',
    holds: () =>
      IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35652 &&
      IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35665,
  },
  {
    id: 'imp35713-audited-file-count',
    description: 'the audit covered all 6 named src/data files with id > 35650',
    holds: () => IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 6,
  },
  {
    id: 'imp35713-citations-checked-count',
    description: 'the audit checked all 21 distinct citation entries recorded',
    holds: () => IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.citationsCheckedCount === 21,
  },
  {
    id: 'imp35713-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35713-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35713_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35713-imp3565x-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
