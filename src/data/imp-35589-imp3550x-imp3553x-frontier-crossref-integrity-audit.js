/**
 * @module imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit
 *
 * imp-35589 (meta, audit): a cross-reference integrity check (imp-35186 method) on the newest
 * committed frontier cohort, src/data files whose leading numeric id falls in [35505, 35538]
 * (imp-35543 scoped only up to imp-35487; this ticket picks up the next unaudited id range).
 *
 * METHOD. Listed every src/data/imp-NNNNN-*.js file whose leading numeric id falls in
 * [35505, 35538] (12 files found: imp-35505, imp-35506, imp-35529, imp-35530, imp-35531,
 * imp-35532, imp-35533, imp-35534, imp-35535, imp-35536, imp-35537, imp-35538 -- the
 * intervening ids belong to non-data-file tickets). For each, resolved every filename-suffixed
 * @see target and ES-module import specifier against the src/data directory listing, every
 * named import (IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE,
 * IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE, IMP_35474_DENSE_ENVELOPE_MAX_REVERIFY_REFERENCE,
 * effectiveHeightForN) against the target file's actual `export` statements, every bare
 * "imp-NNNNN" ticket citation (no filename suffix) against an `id: 'imp-NNNNN'` occurrence in
 * improvement-queue.js or improvements.js, and the three `scripts/imp-NNNNN-*.mjs`
 * offline-producer citations against the scripts/ directory listing.
 *
 * FINDING -- TWO DANGLING REFERENCES (unlike every prior batch in this series, which was
 * clean). Both are filename-suffix typos in @see tags, not broken imports or missing files:
 *
 *   1. imp-35531-etrunc-repricing-crossover-sensitivity.js line 51 cites
 *      "@see imp-35042-inflection-offset", but the real file is
 *      imp-35042-inflection-crossover-offset-structural.js. No file named
 *      imp-35042-inflection-offset.js exists.
 *
 *   2. imp-35536-peak-height-map-sensitivity.js line 59 cites
 *      "@see imp-35337-sigma-peak-crossover-dd-certification", but the real file is
 *      imp-35337-sigma-landmarks-double-double-certification.js. No file named
 *      imp-35337-sigma-peak-crossover-dd-certification.js exists.
 *
 * Both citations name the CORRECT ticket id (imp-35042, imp-35337) and the surrounding prose in
 * both files otherwise cites and uses those tickets correctly (imp-35042's effectiveHeightForN
 * channel; imp-35337's peak locator) -- only the filename suffix appended to the @see tag is
 * wrong. This is documentation-only drift: no import statement, no code path, and no numerical
 * result in either file depends on the incorrect @see string. Everything else audited resolves
 * cleanly: all 30 other distinct filename-suffixed @see/import targets resolve to real src/data
 * files with matching exports; all bare imp-NNNNN ticket citations (imp-2631, imp-33723,
 * imp-35278, imp-35351, imp-35412, imp-35416, imp-35458, imp-35474, imp-35477, imp-486, imp-857,
 * imp-35489, imp-35337, imp-33848, imp-3220, imp-3406, imp-35236, imp-3066, imp-34775,
 * imp-34755, imp-35109) resolve to real `id: 'imp-NNNNN'` entries; the letter-suffixed sub-gap
 * labels (imp-35243a, imp-35337a, imp-35488a, imp-35488b, imp-35530a, imp-35530b) are informal
 * in-prose sub-gap names defined by their parent ticket's own narrative, not separately minted
 * tickets, so they are not checked against improvement-queue.js; all 3 scripts/*.mjs
 * offline-producer citations resolve to real files in scripts/.
 *
 * SCOPE. Read-only cross-reference audit only. Per the established convention in this series
 * (imp-35186 found and flagged; imp-35309 later fixed as a separate ticket), this audit FLAGS
 * the two dangling references but does not itself edit imp-35531/imp-35536 -- that correction is
 * left to a follow-up ticket. Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (the audit method this ticket repeats)
 * @see imp-35543-imp3544x-frontier-crossref-integrity-audit (prior batch in the same series, [35440,35487])
 * @see imp-35309 (precedent: a prior audit finding was fixed as a separate follow-up ticket)
 * @see imp-35042-inflection-crossover-offset-structural (the file the imp-35531 dangling @see should have named)
 * @see imp-35337-sigma-landmarks-double-double-certification (the file the imp-35536 dangling @see should have named)
 */

const AUDITED_ID_RANGE = { lo: 35505, hi: 35538 };

const AUDITED_FILES = [
  'imp-35505-etrunc-consumer-audit',
  'imp-35506-endpoint-positivity-map-viz-data',
  'imp-35529-peak-ks-supdistance',
  'imp-35530-crossover-gtrue-trend-extrapolation',
  'imp-35531-etrunc-repricing-crossover-sensitivity',
  'imp-35532-n2000-both-envelope-definitions-tabulation-reference',
  'imp-35533-n2000-six-member-bs3-envelope-reference',
  'imp-35534-eflow-fartail-remnant-sub1e5-crossing',
  'imp-35535-eflow-fartail-remnant-product-decay-ladder',
  'imp-35536-peak-height-map-sensitivity',
  'imp-35537-r1t-reentry-band-closure-scope',
  'imp-35538-route-i-remainder-derivation-requirements',
];

const DANGLING_REFERENCES = [
  {
    inFile: 'imp-35531-etrunc-repricing-crossover-sensitivity.js',
    citedTarget: 'imp-35042-inflection-offset',
    correctTarget: 'imp-35042-inflection-crossover-offset-structural',
    kind: 'filename-suffix typo in @see tag',
  },
  {
    inFile: 'imp-35536-peak-height-map-sensitivity.js',
    citedTarget: 'imp-35337-sigma-peak-crossover-dd-certification',
    correctTarget: 'imp-35337-sigma-landmarks-double-double-certification',
    kind: 'filename-suffix typo in @see tag',
  },
];

const DANGLING_REFERENCES_FOUND = DANGLING_REFERENCES.length; // 2

const CITATIONS_CHECKED = [
  { citation: 'imp-2631', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-33723', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35278', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35351', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35412', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35416', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35458', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35474', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35477', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-486', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-857', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'imp-35489', kind: 'bare-ticket-id', resolvesIn: 'improvement-queue.js' },
  { citation: 'scripts/imp-35529-peak-ks-supdistance-offline.mjs', kind: 'offline-producer', resolvesIn: 'scripts/' },
  { citation: 'scripts/imp-35530-crossover-gtrue-trend-extrapolation-offline.mjs', kind: 'offline-producer', resolvesIn: 'scripts/' },
  { citation: 'scripts/imp-35531-etrunc-repricing-crossover-sensitivity.mjs', kind: 'offline-producer', resolvesIn: 'scripts/' },
];

export const IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35589',
  proofSection: 'audit',
  auditedIdRange: AUDITED_ID_RANGE,
  question:
    'Do the src/data files whose leading numeric id falls in [35505, 35538] carry any dangling ' +
    '@see targets, ES-module import targets, named-import/export mismatches, offline-producer ' +
    'script citations, or bare imp-NNNNN ticket citations?',
  verdictShort:
    'TWO DANGLING REFERENCES FOUND (filename-suffix typos in @see tags, both naming the correct ' +
    'ticket id but the wrong file suffix): imp-35531 cites imp-35042-inflection-offset instead of ' +
    'imp-35042-inflection-crossover-offset-structural; imp-35536 cites ' +
    'imp-35337-sigma-peak-crossover-dd-certification instead of ' +
    'imp-35337-sigma-landmarks-double-double-certification. Every other filename-suffixed @see/' +
    'import target, every bare imp-NNNNN ticket citation, and every offline-producer script ' +
    'citation across all 12 audited files resolves cleanly.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 12
  citationsChecked: CITATIONS_CHECKED,
  danglingReferences: DANGLING_REFERENCES,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 2
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, offline-producer script citation, and bare imp-NNNNN citation in the ' +
    '12 src/data files whose filename id falls in [35505, 35538] against the actual src/data/' +
    'scripts directory listings and the ticket ids recorded in improvement-queue.js. Result: two ' +
    'dangling @see references found (both filename-suffix typos, correct ticket id, wrong file ' +
    'suffix) -- flagged here per the imp-35186/imp-35309 convention (audit flags, a follow-up ' +
    'ticket fixes); no source file was edited by this audit. No misnamed exports, no missing ' +
    'files otherwise. Changes no bound; establishes no operator positivity; no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-35186 (prior audit method), imp-35327/imp-35401/imp-35424/imp-35543 (prior batches in ' +
    'the same series), imp-35309 (precedent: audit-flags / follow-up-ticket-fixes pattern).',
};

export const IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35589-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35505, 35538] as scoped by the imp-35589 ticket',
    holds: () =>
      IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.lo === 35505 &&
      IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedIdRange.hi === 35538,
  },
  {
    id: 'imp35589-audited-file-count',
    description: 'the audit covered all 12 src/data files whose leading id falls in the range',
    holds: () => IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.auditedFileCount === 12,
  },
  {
    id: 'imp35589-two-dangling-references-found',
    description: 'the audit found exactly 2 dangling @see references, both filename-suffix typos',
    holds: () =>
      IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferencesFound === 2 &&
      IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferences.length === 2 &&
      IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.danglingReferences.every(
        (d) => d.citedTarget !== d.correctTarget
      ),
  },
  {
    id: 'imp35589-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35589_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35589-imp3550x-imp3553x-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}
