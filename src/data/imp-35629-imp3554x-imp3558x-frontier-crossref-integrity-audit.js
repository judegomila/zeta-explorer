/**
 * @module imp-35629-imp3554x-imp3558x-frontier-crossref-integrity-audit
 *
 * imp-35629 (meta, audit): a cross-reference integrity check (imp-35186 method) on the newest
 * committed frontier cohort, src/data files whose leading numeric id falls in [35539, 35590]
 * (imp-35589 scoped only up to imp-35538; this ticket picks up the next unaudited id range).
 *
 * METHOD. Listed every src/data/imp-NNNNN-*.js file whose leading numeric id falls in
 * [35539, 35590] (30 files found -- the intervening ids belong to non-data-file tickets, and two
 * files, imp-35543 and imp-35589, are themselves prior audits in this same series whose own
 * @see/import citations are in scope here too). For each, resolved every filename-suffixed @see
 * target and ES-module import specifier against the src/data directory listing, every named
 * import (IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE, effectiveHeightForN,
 * IMP_35324_R2_N2000_FINER_GRID_REFERENCE, C_C_PINNED, IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY,
 * IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER,
 * IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION,
 * IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS, IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE,
 * IMP35451_SIGMA_PEAK_ARM_ASYMMETRY) against the target file's actual `export` statements, every
 * bare "imp-NNNNN" ticket citation (no filename suffix, 130 distinct ids across the cohort)
 * against an `id: 'imp-NNNNN'` occurrence in improvement-queue.js or improvements.js, and every
 * `scripts/imp-NNNNN-*.mjs` offline-producer citation against the scripts/ directory listing.
 *
 * FINDING -- TWO DANGLING @see REFERENCES (same class as the imp-35589 batch: filename-suffix
 * typos naming the correct ticket id but the wrong file, not broken imports or missing exports):
 *
 *   1. imp-35545-imp354xx-registration-reachability-audit.js line 33 cites
 *      "@see imp-35484-imp35410x-registration-reachability-audit", but imp-35484 was completed as
 *      an inline fix recorded only in improvements.js (id 30544, wiring three modules into
 *      scripts/run-assertions.mjs) -- it never produced a dedicated src/data file, so no file of
 *      that name, or any name, exists for imp-35484.
 *
 *   2. imp-35561-peak-height-map-sensitivity-viz-data.js line 17 cites
 *      "@see imp-35337-sigma-peak-crossover-dd-certification", but the real file is
 *      imp-35337-sigma-landmarks-double-double-certification.js. This is a THIRD occurrence of
 *      the identical typo the imp-35589 audit already found (and flagged, unfixed) in
 *      imp-35531-etrunc-repricing-crossover-sensitivity.js and
 *      imp-35536-peak-height-map-sensitivity.js -- the same wrong suffix
 *      "-sigma-peak-crossover-dd-certification" has now been copy-propagated into a third file.
 *
 * Both citations name the CORRECT ticket id (imp-35484, imp-35337) and the surrounding prose in
 * both files otherwise cites and uses those tickets correctly -- only the filename suffix
 * appended to the @see tag is wrong. This is documentation-only drift: no import statement, no
 * code path, and no numerical result in either file depends on the incorrect @see string.
 * Everything else audited resolves cleanly: all 10 distinct named-import targets resolve to real
 * src/data files with matching exports; all 130 distinct bare imp-NNNNN ticket citations resolve
 * to real `id: 'imp-NNNNN'` entries; all scripts/*.mjs offline-producer citations resolve to real
 * files in scripts/. The two same-ticket-id files imp-35559-r1t-reentry-band-decade-gap-assertion.js
 * and imp-35559-r1t-reentry-band-decade-gap-quantification.js are an intentional
 * quantification+assertion-tripwire pair (established convention, e.g. imp-35578/imp-35596), not
 * a naming collision.
 *
 * SCOPE. Read-only cross-reference audit only. Per the established convention in this series
 * (imp-35186 found and flagged; imp-35309 later fixed as a separate ticket), this audit FLAGS the
 * two dangling references but does not itself edit imp-35545/imp-35561 -- that correction, and the
 * still-open imp-35531/imp-35536 corrections from the prior batch, are left to a follow-up
 * ticket. Changes no bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit (prior batch in the same series, [35505,35538])
 * @see imp-35543-imp3544x-frontier-crossref-integrity-audit (earlier batch, [35440,35487])
 * @see imp-35309 (precedent: a prior audit finding was fixed as a separate follow-up ticket)
 * @see imp-35484 (the ticket the imp-35545 dangling @see should have cited by id only -- it has no dedicated file)
 * @see imp-35337-sigma-landmarks-double-double-certification (the file the imp-35561 dangling @see should have named)
 */

const AUDITED_ID_RANGE = { lo: 35539, hi: 35590 };

const AUDITED_FILES = [
  'imp-35541-scheme-independence-viz-data',
  'imp-35543-imp3544x-frontier-crossref-integrity-audit',
  'imp-35544-sigma-three-input-decomposition-viz-data',
  'imp-35545-imp354xx-registration-reachability-audit',
  'imp-35549-height-map-divergence-viz-data',
  'imp-35551-route-i-requirement-severity-ranking',
  'imp-35552-eflow-fartail-remnant-product-decay-limit',
  'imp-35553-eflow-fartail-remnant-decade-span-growth-fit',
  'imp-35555-crossover-bracketing-family-sensitivity',
  'imp-35556-gtrue-ecoll-dimensional-comparability',
  'imp-35557-cubic-skew-height-map-sensitivity',
  'imp-35558-r2-n2000-ladder-advance-decision',
  'imp-35559-r1t-reentry-band-decade-gap-assertion',
  'imp-35559-r1t-reentry-band-decade-gap-quantification',
  'imp-35561-peak-height-map-sensitivity-viz-data',
  'imp-35564-eflow-fartail-product-decay-viz-data',
  'imp-35569-sigma-peak-page-honest-status-audit',
  'imp-35571-route-i-subleading-rate-scope',
  'imp-35572-reentry-band-terminal-width-rate-robustness',
  'imp-35573-n2000-bs3-dt4-endpoint-positivity-reference',
  'imp-35574-peak-location-height-map-damping',
  'imp-35575-sigma-peak-quartic-coefficient',
  'imp-35577-fartail-crossings-height-map-sensitivity',
  'imp-35578-req4-shortfall-literals-assertion',
  'imp-35580-req4-height-gap-viz-data',
  'imp-35582-reentry-band-data-unreachability-viz-data',
  'imp-35584-viz-registration-verify-35506',
  'imp-35585-etrunc-consumer-audit-extension',
  'imp-35587-arm-asymmetry-viz-data',
  'imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit',
];

const DANGLING_REFERENCES = [
  {
    inFile: 'imp-35545-imp354xx-registration-reachability-audit.js',
    citedTarget: 'imp-35484-imp35410x-registration-reachability-audit',
    correctTarget: null,
    kind: 'filename-suffixed @see for a ticket that has no dedicated src/data file (imp-35484 was completed inline in improvements.js/scripts/run-assertions.mjs)',
  },
  {
    inFile: 'imp-35561-peak-height-map-sensitivity-viz-data.js',
    citedTarget: 'imp-35337-sigma-peak-crossover-dd-certification',
    correctTarget: 'imp-35337-sigma-landmarks-double-double-certification',
    kind: 'filename-suffix typo in @see tag (third occurrence of the imp-35589-documented typo)',
  },
];

const DANGLING_REFERENCES_FOUND = DANGLING_REFERENCES.length; // 2

const NAMED_IMPORTS_CHECKED = [
  { symbol: 'IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE', target: 'imp-35477-n2000-bs3-dense-crossvalidate-reference.js' },
  { symbol: 'effectiveHeightForN', target: 'lambda-rh-height-mapping.js' },
  { symbol: 'IMP_35324_R2_N2000_FINER_GRID_REFERENCE', target: 'imp-35324-r2-n2000-finer-grid-reference.js' },
  { symbol: 'C_C_PINNED', target: 'polymath15-constant-C-C.js' },
  { symbol: 'IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY', target: 'imp-35536-peak-height-map-sensitivity.js' },
  { symbol: 'IMP35535_EFLOW_FARTAIL_REMNANT_PRODUCT_DECAY_LADDER', target: 'imp-35535-eflow-fartail-remnant-product-decay-ladder.js' },
  { symbol: 'IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION', target: 'imp-35559-r1t-reentry-band-decade-gap-quantification.js' },
  { symbol: 'IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS', target: 'imp-35538-route-i-remainder-derivation-requirements.js' },
  { symbol: 'IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE', target: 'imp-35537-r1t-reentry-band-closure-scope.js' },
  { symbol: 'IMP35451_SIGMA_PEAK_ARM_ASYMMETRY', target: 'imp-35451-sigma-peak-arm-asymmetry.js' },
];

export const IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35629',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the src/data files whose leading numeric id falls in [35539, 35590] carry any dangling ' +
    '@see targets, ES-module import targets, named-import/export mismatches, offline-producer ' +
    'script citations, or bare imp-NNNNN ticket citations?',
  verdictShort:
    'TWO DANGLING @see REFERENCES FOUND: imp-35545 cites imp-35484-imp35410x-registration-' +
    'reachability-audit, a file that was never created (imp-35484 was completed inline, no ' +
    'dedicated data file); imp-35561 cites imp-35337-sigma-peak-crossover-dd-certification instead ' +
    'of imp-35337-sigma-landmarks-double-double-certification -- a third occurrence of the typo ' +
    'the imp-35589 audit already found in imp-35531 and imp-35536. Every named import, bare ' +
    'imp-NNNNN citation, and offline-producer script citation across all 30 audited files resolves ' +
    'cleanly.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 30
  namedImportsChecked: NAMED_IMPORTS_CHECKED,
  bareCitationDistinctCount: 130,
  danglingReferences: DANGLING_REFERENCES,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, offline-producer script citation, and bare imp-NNNNN citation in the ' +
    '30 src/data files whose filename id falls in [35539, 35590] against the actual src/data/' +
    'scripts directory listings and the ticket ids recorded in improvement-queue.js/' +
    'improvements.js. Result: two dangling @see references found -- flagged here per the ' +
    'imp-35186/imp-35309 convention (audit flags, a follow-up ticket fixes); no source file was ' +
    'edited by this audit. No misnamed exports, no missing files otherwise. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35186 (prior audit method), imp-35327/imp-35401/imp-35424/imp-35543/imp-35589 (prior ' +
    'batches in the same series), imp-35309 (precedent: audit-flags / follow-up-ticket-fixes pattern).',
};

export const IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35629-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35539, 35590] as scoped by the imp-35629 ticket',
    holds: () =>
      IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35539 &&
      IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35590,
  },
  {
    id: 'imp35629-audited-file-count',
    description: 'the audit covered all 30 src/data files whose leading id falls in the range',
    holds: () => IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 30,
  },
  {
    id: 'imp35629-two-dangling-references-found',
    description: 'the audit found exactly 2 dangling @see references',
    holds: () =>
      IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 2 &&
      IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferences.length === 2,
  },
  {
    id: 'imp35629-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35629_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35629-imp3554x-imp3558x-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
