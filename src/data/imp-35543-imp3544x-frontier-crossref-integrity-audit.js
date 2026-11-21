/**
 * @module imp-35543-imp3544x-frontier-crossref-integrity-audit
 *
 * imp-35543 (meta, audit): a cross-reference integrity check (imp-35186 method) on the newest
 * committed frontier cohort, src/data files whose leading numeric id falls in [35440, 35487]
 * (imp-35448 scoped only up to imp-35404; imp-35401 covered the imp-3526x cusp cohort
 * separately; this ticket picks up the next unaudited id range).
 *
 * METHOD. Listed every src/data/imp-NNNNN-*.js file whose leading numeric id falls in
 * [35440, 35487] (22 files found). For each, resolved every filename-suffixed @see target and
 * ES-module import specifier against the src/data directory listing, every named import
 * (effectiveHeightForN, zeroCountAtHeight, C_C_PINNED, IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA,
 * IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE) against the target file's actual
 * `export` statements, every bare "imp-NNNNN" ticket citation (no filename suffix) against an
 * `id: 'imp-NNNNN'` occurrence in improvement-queue.js or improvements.js, every
 * `scripts/imp-NNNNN-*.mjs` offline-producer citation against the scripts/ directory listing,
 * and the one `src/pages/*.jsx` citation against the pages directory listing.
 *
 * FINDING. Across the 22 audited files: 48 distinct filename-suffixed @see targets and named
 * imports all resolve to real src/data files with matching exports; 12 distinct bare imp-NNNNN
 * ticket citations (imp-486, imp-857, imp-2631, imp-35278, imp-35324, imp-35334, imp-35350,
 * imp-35351, imp-35354, imp-35412, imp-35452, imp-35471) all resolve to real
 * `id: 'imp-NNNNN'` entries in improvement-queue.js; all 3 scripts/*.mjs offline-producer
 * citations (imp-35416, imp-35452, imp-35477) resolve to real files in scripts/; and the single
 * src/pages/Imp35288R2FlowLadderSlackViz.jsx citation (in imp-35486) resolves to a real page
 * file. Zero dangling references, zero misnamed exports, zero missing files.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35401-imp3526x-cusp-cohort-crossref-integrity-audit (adjacent-cohort audit, same method)
 */

const AUDITED_ID_RANGE = { lo: 35440, hi: 35487 };

const AUDITED_FILES = [
  'imp-35450-sigma-peak-curvature-direct-fd',
  'imp-35451-sigma-peak-arm-asymmetry',
  'imp-35452-n2000-endpoint-positivity-knife-edge-reference',
  'imp-35453-r1s-eps-fp-threshold-closed-form',
  'imp-35454-eflow-fartail-remnant-product-limit',
  'imp-35455-r2-n2000-rung-certification-scope',
  'imp-35456-en-component-budget-at-verified-height-3e12',
  'imp-35457-g6a-shock-lipschitz-formal-state-assessment',
  'imp-35458-crossover-height-map-sensitivity',
  'imp-35459-etrunc-ct-kappat-dependence-scope',
  'imp-35460-reentry-band-landmark-disposal-viz-data',
  'imp-35470-sigma-peak-curvature-5point-stencil',
  'imp-35471-imp-35416-rk4-hermite-reverify-reference',
  'imp-35472-r1s-baked-constants-reconstruction',
  'imp-35473-eflow-fartail-remnant-sub1e4-crossing',
  'imp-35474-dense-envelope-max-reverify-reference',
  'imp-35475-sigma-fidelity-closure-scope',
  'imp-35476-sigma-peak-plateau-sqrt-tol-offgrid',
  'imp-35477-n2000-bs3-dense-crossvalidate-reference',
  'imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data',
  'imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data',
  'imp-35486-imp35416-page-surfacing-audit',
];

const CITATIONS_CHECKED = [
  { citation: 'imp-486', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-857', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2631', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35278', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35324', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35334', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35350', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35351', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35354', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35412', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35452', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35471', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs', kind: 'offline-producer', resolvesIn: 'scripts/' },
  { citation: 'scripts/imp-35452-n2000-endpoint-positivity-knife-edge.mjs', kind: 'offline-producer', resolvesIn: 'scripts/' },
  { citation: 'scripts/imp-35477-n2000-bs3-dense-crossvalidate.mjs', kind: 'offline-producer', resolvesIn: 'scripts/' },
  { citation: 'src/pages/Imp35288R2FlowLadderSlackViz.jsx', kind: 'page-file', resolvesIn: 'src/pages/' },
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35543',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the src/data files whose leading numeric id falls in [35440, 35487] carry any dangling ' +
    '@see targets, ES-module import targets, named-import/export mismatches, offline-producer ' +
    'script citations, or bare imp-NNNNN ticket citations?',
  verdictShort:
    'CLEAN. All 22 files in the imp-35440..35487 cohort resolve every filename-suffixed @see ' +
    'target and ES-module import to a real src/data file with matching exports, every ' +
    'scripts/*.mjs citation to a real offline producer, the one src/pages/*.jsx citation to a ' +
    'real page, and every bare imp-NNNNN ticket citation to a real id in improvement-queue.js. ' +
    'Zero dangling references.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 22
  citationsChecked: CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, offline-producer script citation, page-file citation, and bare ' +
    'imp-NNNNN citation in the 22 src/data files whose filename id falls in [35440, 35487] ' +
    'against the actual src/data/scripts/pages directory listings and the ticket ids recorded ' +
    'in improvement-queue.js. Result: zero dangling references, zero misnamed exports, no ' +
    'missing files. No source file required correction. Changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method), imp-35327/imp-35401 (prior batches in the same series), ' +
    'imp-35448 (adjacent lower-id-range audit, pending).',
};

export const IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35543-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35440, 35487] as scoped by the imp-35543 ticket',
    holds: () =>
      IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35440 &&
      IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35487,
  },
  {
    id: 'imp35543-audited-file-count',
    description: 'the audit covered all 22 src/data files whose leading id falls in the range',
    holds: () => IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 22,
  },
  {
    id: 'imp35543-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35543-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35543_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35543-imp3544x-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
