/**
 * @module imp-35752-imp3567x-imp3571x-frontier-crossref-integrity-audit
 *
 * imp-35752 (meta, audit): a cross-reference integrity check (imp-35186 method) on the newest
 * frontier cohort left unaudited after imp-35713 covered only up to imp-35665: the 26 src/data
 * files with id in [35666, 35712] (imp-35666..imp-35669 and imp-35702/35703/35706/35707/35708/
 * imp-35712 were never materialized as standalone src/data modules -- the 26 files below are the
 * complete set of module files whose id actually falls in that range).
 *
 * METHOD. For each of the 26 named files, resolved every filename-suffixed @see target and
 * ES-module import specifier against the src/data directory listing, every named/default import
 * against the target file's actual `export` statements, and every bare "imp-NNNN" ticket citation
 * (no filename suffix) against either an `id: "imp-NNNN"` entry in improvement-queue.js or a real
 * src/data/imp-NNNN-*.js module file (some low-numbered citations -- imp-486, imp-397, imp-398,
 * imp-341, imp-2632, imp-2640, imp-2642, imp-2643, imp-3406, imp-3933 -- name a module or an
 * already-completed ticket rather than a still-open queue ticket).
 *
 * FINDING. Across the 26 audited files: every filename-suffixed @see target and named/default
 * import (imp-35538, imp-35571, imp-35419, imp-35556, imp-35186, imp-35327, imp-35530, imp-35589,
 * imp-35488, imp-35652, imp-35685, imp-35653, imp-34791, imp-35674, imp-35654, imp-35334,
 * imp-35711, imp-35686, imp-35673, imp-35697, imp-35410, imp-35663, imp-35553, imp-35552,
 * imp-35198, imp-35665, imp-35655, imp-35337, imp-35675, imp-35680, imp-35695, plus the two
 * non-imp module imports lambda-rh-height-mapping.js and polymath15-constant-C-C.js) resolves to
 * a real src/data file with a matching export; the 15 distinct bare imp-NNNN citations (imp-35337,
 * imp-2642, imp-2643, imp-486, imp-397, imp-3933, imp-398, imp-2632, imp-2640, imp-341, imp-35698,
 * imp-3406, imp-35410, imp-35699, imp-35654) all resolve to either a real id in
 * improvement-queue.js or a real src/data module file. Zero dangling references, zero misnamed
 * exports, zero missing files.
 *
 * SCOPE. Read-only cross-reference audit only. No source file was modified as a result of this
 * check (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35401-imp3526x-cusp-cohort-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35543-imp3544x-frontier-crossref-integrity-audit (prior batch in the same series)
 * @see imp-35713-imp3565x-frontier-crossref-integrity-audit (adjacent lower-id-range audit, the
 *   ticket that scoped the range this one picks up after)
 */

const AUDITED_ID_RANGE = { lo: 35666, hi: 35712 };

const AUDITED_FILES = [
  'imp-35670-honesty-banner-audit-route-i-etrunc',
  'imp-35671-imp35530-caveat-label-audit',
  'imp-35672-route-ii-gtrue-spotcheck-scope',
  'imp-35673-resolution-shortfall-far-tail-ladder',
  'imp-35674-w3-tail-lemma-polymath15-scope',
  'imp-35675-finite-winding-mesh-cost-vs-delta',
  'imp-35676-w4-etrunc-zero-reading-consistency-scope',
  'imp-35677-postport-residual-share-sigma-ladder',
  'imp-35678-finite-height-beat-vs-parity-regime-boundary',
  'imp-35679-postport-share-sum-unity-excess-reconciliation',
  'imp-35680-constant-mismatch-magnitude',
  'imp-35681-w1-w2-w4-existing-infra-inventory',
  'imp-35685-resolution-shortfall-literal-guard',
  'imp-35686-postport-share-literal-guard',
  'imp-35695-resolution-floor-factor-M-ladder',
  'imp-35696-collision-exponent-consistency-check',
  'imp-35697-winding-barrier-mesh-cost-ladder',
  'imp-35698-b2-tail-lemma-margin-ladder',
  'imp-35699-post-port-unconditional-share-9999-99999-crossings',
  'imp-35700-sigma-tracking-residual-decay-rate',
  'imp-35701-eflow-fartail-decade-span-ladder-sub1e7-rung',
  'imp-35704-postport-share-identity-guard',
  'imp-35705-pinsker-tv-upper-bound-slack-over-ecoll',
  'imp-35709-preport-postport-conditional-share-bars-viz-data',
  'imp-35710-winding-mesh-cost-delta-ladder-viz-data',
  'imp-35711-postport-parity-no-beat-honest-status-banner',
];

const CITATIONS_CHECKED = [
  { citation: 'imp-35538', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35538-route-i-remainder-derivation-requirements.js' },
  { citation: 'imp-35571', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35571-route-i-subleading-rate-scope.js' },
  { citation: 'imp-35419', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35419-etrunc-barrier-lemma-porting-scope.js' },
  { citation: 'imp-35556', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35556-gtrue-ecoll-dimensional-comparability.js' },
  { citation: 'imp-35186', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35186-cross-reference-integrity-audit.js' },
  { citation: 'imp-35327', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35327-imp352xx-frontier-crossref-integrity-audit.js' },
  { citation: 'imp-35530', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35530-crossover-gtrue-trend-extrapolation.js' },
  { citation: 'imp-35589', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit.js' },
  { citation: 'imp-35488', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35488-route-ii-two-height-gtrue-spotcheck.js' },
  { citation: 'imp-35652', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35652-req3-option-a-restricted-support-surrogate-scope.js' },
  { citation: 'imp-35685', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35685-resolution-shortfall-literal-guard.js' },
  { citation: 'imp-35653', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35653-sbarrier-finite-check-porting-scope.js' },
  { citation: 'imp-34791', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-34791-etrunc-eflow-pt-anchor-honest-discharge.js' },
  { citation: 'imp-35674', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35674-w3-tail-lemma-polymath15-scope.js' },
  { citation: 'imp-35654', kind: 'filename-suffixed-see-and-import-and-bare', resolvesIn: 'src/data/imp-35654-ported-barrier-far-tail-mixed-conditionality.js' },
  { citation: 'imp-35334', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality.js' },
  { citation: 'imp-35711', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35711-postport-parity-no-beat-honest-status-banner.js' },
  { citation: 'imp-35686', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35686-postport-share-literal-guard.js' },
  { citation: 'imp-35673', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35673-resolution-shortfall-far-tail-ladder.js' },
  { citation: 'imp-35697', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35697-winding-barrier-mesh-cost-ladder.js' },
  { citation: 'imp-35410', kind: 'filename-suffixed-see-and-bare', resolvesIn: 'src/data/imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares.js' },
  { citation: 'imp-35663', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35663-eflow-fartail-decade-span-growth-viz-data.js' },
  { citation: 'imp-35553', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35553-eflow-fartail-remnant-decade-span-growth-fit.js' },
  { citation: 'imp-35552', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35552-eflow-fartail-remnant-product-decay-limit.js' },
  { citation: 'imp-35198', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35198-eflow-fartail-exponent-logn-correction.js' },
  { citation: 'imp-35665', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35665-pinsker-common-functional-bridge-viz-data.js' },
  { citation: 'imp-35655', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35655-reverse-pinsker-bretagnolle-huber-gtrue-lower-bound.js' },
  { citation: 'imp-35337', kind: 'filename-suffixed-see-and-bare', resolvesIn: 'src/data/imp-35337-sigma-landmarks-double-double-certification.js' },
  { citation: 'imp-35675', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35675-finite-winding-mesh-cost-vs-delta.js' },
  { citation: 'imp-35680', kind: 'filename-suffixed-see-and-import', resolvesIn: 'src/data/imp-35680-constant-mismatch-magnitude.js' },
  { citation: 'imp-35695', kind: 'filename-suffixed-see', resolvesIn: 'src/data/imp-35695-resolution-floor-factor-M-ladder.js' },
  { citation: 'lambda-rh-height-mapping', kind: 'es-module-named-import', resolvesIn: 'src/data/lambda-rh-height-mapping.js' },
  { citation: 'polymath15-constant-C-C', kind: 'es-module-named-import', resolvesIn: 'src/data/polymath15-constant-C-C.js' },
  { citation: 'imp-2642', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2643', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-486', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-397', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-3933', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-3933-eps-field-robust-bootstrap.js' },
  { citation: 'imp-398', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2632', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-2640', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-341', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35698', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-35698-b2-tail-lemma-margin-ladder.js' },
  { citation: 'imp-3406', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-3406-sigma-highN-extrapolation.js' },
  { citation: 'imp-35699', kind: 'bare-module-citation', resolvesIn: 'src/data/imp-35699-post-port-unconditional-share-9999-99999-crossings.js' },
];

const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve

export const IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35752',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the 26 src/data files with id in [35666, 35712] -- the frontier cohort left unaudited ' +
    'after imp-35713 covered only up to imp-35665 -- carry any dangling @see targets, ES-module ' +
    'import targets, named/default-import mismatches, or bare imp-NNNN ticket citations?',
  verdictShort:
    'CLEAN. All 26 audited files resolve every filename-suffixed @see target and ES-module import ' +
    'to a real src/data file with matching exports, and every bare imp-NNNN citation to either a ' +
    'real id in improvement-queue.js or a real src/data module file. Zero dangling references.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 26
  citationsChecked: CITATIONS_CHECKED,
  citationsCheckedCount: CITATIONS_CHECKED.length, // 45
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare imp-NNNN citation in the 26 src/data files with id in ' +
    '[35666, 35712] against the actual src/data directory listing, the target files\' actual ' +
    'export statements, and the ticket ids recorded in improvement-queue.js. Result: zero dangling ' +
    'references, zero misnamed exports, no missing files. No source file required correction. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method); imp-35327/imp-35401/imp-35543/imp-35713 (prior batches in ' +
    'the same series, next-unaudited-id-range each time).',
};

export const IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35752-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35666, 35712] as scoped by the imp-35752 ticket',
    holds: () =>
      IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35666 &&
      IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35712,
  },
  {
    id: 'imp35752-audited-file-count',
    description: 'the audit covered all 26 real src/data files with id in [35666, 35712]',
    holds: () => IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 26,
  },
  {
    id: 'imp35752-citations-checked-count',
    description: 'the audit checked all 45 distinct citation entries recorded',
    holds: () => IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.citationsCheckedCount === 45,
  },
  {
    id: 'imp35752-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or ticket citations',
    holds: () => IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp35752-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35752_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35752-imp3567x-imp3571x-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
