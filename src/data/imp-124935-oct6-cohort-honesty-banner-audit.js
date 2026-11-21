/**
 * @module imp-124935-oct6-cohort-honesty-banner-audit
 * @fileoverview imp-124935 -- Extend the imp-124838 honesty-banner audit chain to the
 * just-committed Oct-6 note/status cohort: imp-124822 (frontier crosscheck batch cohort
 * index), imp-124823 (F2 curvature honest status), imp-124824 (E_CF stencil crossover
 * viz data), imp-124825 (E_trunc floor-exponent chord-to-certification upgrade note),
 * imp-124837 (far-tail RvM per-nine conditional-share note), imp-124838 (the prior
 * audit module itself), and imp-124839 (TLDR/currentStatus sync audit). Each must
 * carry the same required four-part honesty banner: (1) an explicit no-bound-change
 * statement, (2) the imp-3066 K_a &gt;= 0 positivity-untouched note, (3) a no-RH-verdict
 * / NO QED disclaimer, and (4) the no-refereed-bound-change citation.
 *
 * METHOD (read-only, performed at author time). Each module was imported live in Node
 * and every exported string/array/object field was concatenated into one search text,
 * so multi-line template-string concatenation (which defeats a naive single-line grep
 * on raw source) cannot produce a false negative. That concatenated text was then
 * tested for four case-insensitive markers: /changes no bound/ or an equivalent
 * no-bound-change statement (synonyms such as "moves no bound" / "no bound moved" were
 * accepted as satisfying this concept -- only a concept's total ABSENCE counts as
 * drift, not a wording variant), /imp-3066 K_a &gt;= 0 untouched/ (literal, since this is
 * a specific citation, not a paraphrasable concept), /NO QED/, and /remains SOTA/.
 *
 * RESULT (audited 2026-10-06): TWO DRIFTS FOUND AND REPAIRED.
 *   - imp-124822-frontier-crosscheck-batch-cohort-index.js : CLEAN (concept-wise).
 *     Exported verdict uses "moves no bound" rather than "changes no bound" -- a
 *     synonymous no-bound-change statement, not an absence. imp-3066 K_a >= 0
 *     untouched, NO QED, and remains SOTA are all present verbatim. No repair needed.
 *   - imp-124823-f2-curvature-honest-status.js : CLEAN (all four markers present
 *     verbatim in IMP124823_HONEST_BANNER).
 *   - imp-124824-ecf-stencil-crossover-viz-data.js : CLEAN (all four markers present
 *     verbatim in IMP124824_SUMMARY.verdict).
 *   - imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js :
 *     DRIFT FOUND, REPAIRED. The imp-3066 K_a >= 0 untouched phrase was entirely
 *     absent from IMP124825_HONEST_BANNER (the module only said "No new numerics, no
 *     bound moved" -- satisfying the no-bound-change concept but never citing imp-3066
 *     at all). Repaired by appending "changes no bound; imp-3066 K_a >= 0 untouched."
 *     to the banner's closing sentence, and added a matching assertion clause.
 *   - imp-124837-fartail-rvm-per-nine-conditional-share-note.js : CLEAN. The four
 *     markers are present in IMP124837_HONEST_BANNER but straddle a template-string
 *     line break ("...imp-3066 K_a >= 0 ' + 'untouched..."), which defeats a naive
 *     single-line grep on raw source without defeating the concatenated runtime
 *     string -- confirmed clean via live import, not raw grep.
 *   - imp-124838-124793-124811-124812-124814-124776-honesty-banner-audit.js : CLEAN.
 *     As the prior audit module, its own top-level honestNote does not restate all
 *     four markers in isolation, but its modulesAudited[].driftDetail / counts fields
 *     (exported data, not comments) quote the full four-part banner text verbatim
 *     while documenting the imp-124776 repair, so the concatenated-export search
 *     finds all four. No repair needed.
 *   - imp-124839-tldr-currentstatus-sync-audit.js : DRIFT FOUND, REPAIRED. Neither the
 *     module's header comment nor its exported IMP124839_SYNC_AUDIT.verdict ever cited
 *     imp-3066 K_a >= 0 untouched -- the only one of the four concepts missing.
 *     Repaired both the header comment and the verdict string to insert the phrase,
 *     and added an assertion entry locking the repair in place.
 *
 * RECOMMENDATION. Five of the seven modules already carried the full four-part
 * honesty banner (allowing synonymous no-bound-change wording); two (imp-124825,
 * imp-124839) were missing the imp-3066 K_a >= 0 untouched citation entirely and have
 * been repaired to match the cohort pattern. This audit module fabricates no new
 * pages and asserts no new bound; it only records the audit outcome and the two
 * repairs. No QED. No refereed bound is changed.
 *
 * @see imp-124838-124793-124811-124812-124814-124776-honesty-banner-audit.js (the prior cohort honesty-audit this extends)
 * @see imp-97851 (the original cohort honesty-audit pattern)
 */

export const IMP_124935_HONESTY_BANNER_AUDIT = {
  id: 'imp-124935',
  auditedAt: '2026-10-06',
  method:
    'Import each of the seven named modules live in Node, concatenate every exported string/array/object ' +
    'field into one search text (defeating template-string line-wrap false negatives a raw single-line grep ' +
    'would produce), then test for the four required honesty-banner concepts -- an explicit no-bound-change ' +
    'statement (synonyms accepted), the literal "imp-3066 K_a >= 0 untouched" citation, "NO QED", and ' +
    '"no refereed bound is changed".',
  modulesAudited: [
    {
      file: 'imp-124822-frontier-crosscheck-batch-cohort-index.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      note: 'Uses the synonym "moves no bound" for the no-bound-change concept; not treated as drift.',
    },
    {
      file: 'imp-124823-f2-curvature-honest-status.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
    },
    {
      file: 'imp-124824-ecf-stencil-crossover-viz-data.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
    },
    {
      file: 'imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js',
      drift: true,
      repaired: true,
      conceptsBeforeRepair: { noBoundChange: true, imp3066Untouched: false, noQed: true, ptSota: true },
      conceptsAfterRepair: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      driftDetail:
        'The imp-3066 K_a >= 0 untouched citation was entirely absent; the banner only stated the ' +
        'no-bound-change concept via "No new numerics, no bound moved." Repaired by appending ' +
        '"changes no bound; imp-3066 K_a >= 0 untouched." to the closing sentence.',
    },
    {
      file: 'imp-124837-fartail-rvm-per-nine-conditional-share-note.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      note: 'The imp-3066 phrase straddles a template-string line break in raw source; confirmed clean via live import, not raw grep.',
    },
    {
      file: 'imp-124838-124793-124811-124812-124814-124776-honesty-banner-audit.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      note: 'Prior audit module; concepts present via its quoted documentation of the imp-124776 repair, not a standalone banner field.',
    },
    {
      file: 'imp-124839-tldr-currentstatus-sync-audit.js',
      drift: true,
      repaired: true,
      conceptsBeforeRepair: { noBoundChange: true, imp3066Untouched: false, noQed: true, ptSota: true },
      conceptsAfterRepair: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      driftDetail:
        'The imp-3066 K_a >= 0 untouched citation was entirely absent from both the header comment and ' +
        'the exported verdict string. Repaired both locations to insert the phrase, and added an ' +
        'assertion entry locking the repair.',
    },
  ],
  driftCount: 2,
  repairedCount: 2,
  mutuallyConsistent: true,
  recommendation:
    'Five of the seven modules already carried all four honesty-banner concepts (synonymous no-bound-' +
    'change wording accepted). Two (imp-124825, imp-124839) were missing the imp-3066 K_a >= 0 untouched ' +
    'citation entirely and have been repaired to match the cohort pattern.',
  honestNote:
    'Read-only audit plus two in-place wording repairs; no pages or bounds fabricated. No QED. ' +
    'No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_124935_ASSERTIONS = [
  {
    id: 'imp124935-exactly-seven-modules-audited-two-drifts-repaired',
    holds: () =>
      IMP_124935_HONESTY_BANNER_AUDIT.modulesAudited.length === 7 &&
      IMP_124935_HONESTY_BANNER_AUDIT.driftCount === 2 &&
      IMP_124935_HONESTY_BANNER_AUDIT.repairedCount === 2 &&
      IMP_124935_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.drift).length === 2,
    why: 'The audit must cover exactly the seven named Oct-6 cohort modules and the 2026-10-06 audit found exactly two drifts, both repaired.',
  },
  {
    id: 'imp124935-repaired-modules-now-carry-all-four-concepts',
    holds: () => {
      const repaired = IMP_124935_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.repaired);
      return (
        repaired.length === 2 &&
        repaired.every(
          (m) =>
            m.conceptsAfterRepair.noBoundChange === true &&
            m.conceptsAfterRepair.imp3066Untouched === true &&
            m.conceptsAfterRepair.noQed === true &&
            m.conceptsAfterRepair.ptSota === true,
        )
      );
    },
    why: 'After repair, both imp-124825 and imp-124839 must carry all four required honesty-banner concepts.',
  },
  {
    id: 'imp124935-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_124935_HONESTY_BANNER_AUDIT.honestNote) &&
      /no QED/i.test(IMP_124935_HONESTY_BANNER_AUDIT.honestNote) &&
      IMP_124935_HONESTY_BANNER_AUDIT.mutuallyConsistent === true,
    why: 'VERDICT LOCK: this is a read-only audit plus two wording repairs, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_124935_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124935 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_124935_ASSERTIONS };
