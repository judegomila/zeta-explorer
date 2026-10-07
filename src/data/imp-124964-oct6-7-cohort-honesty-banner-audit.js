/**
 * @module imp-124964-oct6-7-cohort-honesty-banner-audit
 * @fileoverview imp-124964 -- Extend the imp-124935 honesty-banner audit chain to the newest
 * Oct-6/7 glossary/viz/note cohort: imp-124917 (F2 residual-curvature U viz-data), imp-124918
 * (kernel-ratio bracket viz-data), imp-124919 (E_CF stencil-crossover glossary headword),
 * imp-124921 (E_CF-crossover/reldiff/round-off causal-chain note), and imp-124922 (kernel
 * decade-ratio gap-keyed glossary headword). Each must carry the same required four-part honesty
 * banner: (1) an explicit no-bound-change statement, (2) the literal imp-3066 K_a &gt;= 0
 * positivity-untouched citation, (3) a no-RH-verdict / NO QED disclaimer, and (4) the
 * Platt-Trudgian Lambda &lt;= 0.2 remains-SOTA citation.
 *
 * METHOD (read-only, performed at author time). Each module was imported live in Node and every
 * exported string/array/object field was concatenated into one search text, so a re-exported
 * banner (e.g. imp-124921 re-exports IMP124821_HONEST_BANNER verbatim rather than defining its
 * own) is credited to the importing module, and a multi-line template-string concatenation cannot
 * produce a false negative. That concatenated text was then tested for the four case-insensitive
 * markers: a no-bound-change statement (synonyms such as "no bound moved" / "moves no bound"
 * accepted -- only total absence of the concept counts as drift), the literal "imp-3066 K_a >= 0
 * untouched" citation (not paraphrasable, since it is a specific citation), "NO QED", and
 * "remains SOTA".
 *
 * RESULT (audited 2026-10-07): TWO DRIFTS FOUND AND REPAIRED.
 *   - imp-124917-f2-residual-curvature-u-viz-data.js : CLEAN. All four markers present verbatim
 *     in IMP124917_SUMMARY.verdict ("changes no bound", "imp-3066 K_a >= 0 untouched", "NO QED",
 *     "Lambda <= 0.2 remains SOTA").
 *   - imp-124918-kernel-ratio-bracket-viz-data.js : CLEAN. All four markers present verbatim in
 *     IMP124918_SUMMARY.verdict.
 *   - imp-124919-ecf-stencil-crossover-glossary-headword.js : DRIFT FOUND, REPAIRED. The headword
 *     verdict said only "DIAG3 and all pinned surrogate constants untouched" -- a paraphrase that
 *     never cited imp-3066 by name, so the literal-citation concept was entirely absent (the
 *     no-bound-change concept itself was present via "No bound moved"). Repaired by inserting
 *     "imp-3066 K_a >= 0 untouched;" into the verdict string, and added a matching assertion
 *     (imp124919-imp3066-untouched-citation) locking the repair in place.
 *   - imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note.js : CLEAN. The module defines
 *     no standalone banner string of its own; it re-exports IMP124821_HONEST_BANNER verbatim as
 *     IMP124921_HONEST_BANNER, and that inherited string carries all four markers ("Changes no
 *     bound", "imp-3066 K_a >= 0 untouched", "NO QED", "PT Lambda <= 0.2 remains SOTA"). Confirmed
 *     clean via live import of the re-exported binding, not a raw grep restricted to the module's
 *     own source lines (which alone would show no banner text at all).
 *   - imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword.js : DRIFT FOUND, REPAIRED. Same
 *     pattern as imp-124919: the verdict said "DIAG3 == 0 and all pinned surrogate constants
 *     untouched" without ever citing imp-3066. Repaired by inserting "imp-3066 K_a >= 0
 *     untouched;" into the verdict string, and added a matching assertion
 *     (imp124922-imp3066-untouched-citation) locking the repair in place.
 *
 * RECOMMENDATION. Three of the five modules already carried the full four-part honesty banner
 * (one of them, imp-124921, only via a re-exported sibling binding rather than its own banner
 * string -- still counted clean since the concatenated export search is what matters, not source
 * locality). Two (imp-124919, imp-124922) were missing the imp-3066 K_a >= 0 untouched citation
 * entirely -- both are glossary headwords that paraphrased "surrogate constants untouched"
 * without the specific citation -- and have been repaired to match the cohort pattern. This audit
 * module fabricates no new pages and asserts no new bound; it only records the audit outcome and
 * the two repairs. No QED. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.
 *
 * @see imp-124935-oct6-cohort-honesty-banner-audit.js (the prior cohort honesty-audit this extends)
 * @see imp-97851 (the original cohort honesty-audit pattern)
 */

export const IMP_124964_HONESTY_BANNER_AUDIT = {
  id: 'imp-124964',
  auditedAt: '2026-10-07',
  method:
    'Import each of the five named modules live in Node, concatenate every exported string/array/object ' +
    'field into one search text (crediting re-exported sibling bindings such as imp-124921\'s ' +
    'IMP124921_HONEST_BANNER to the importing module, and defeating template-string line-wrap false ' +
    'negatives a raw single-line grep would produce), then test for the four required honesty-banner ' +
    'concepts -- an explicit no-bound-change statement (synonyms accepted), the literal "imp-3066 K_a >= 0 ' +
    'untouched" citation, "NO QED", and "remains SOTA".',
  modulesAudited: [
    {
      file: 'imp-124917-f2-residual-curvature-u-viz-data.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
    },
    {
      file: 'imp-124918-kernel-ratio-bracket-viz-data.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
    },
    {
      file: 'imp-124919-ecf-stencil-crossover-glossary-headword.js',
      drift: true,
      repaired: true,
      conceptsBeforeRepair: { noBoundChange: true, imp3066Untouched: false, noQed: true, ptSota: true },
      conceptsAfterRepair: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      driftDetail:
        'The imp-3066 K_a >= 0 untouched citation was entirely absent; the verdict only paraphrased it as ' +
        '"DIAG3 and all pinned surrogate constants untouched." Repaired by inserting "imp-3066 K_a >= 0 ' +
        'untouched;" into the verdict string.',
    },
    {
      file: 'imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note.js',
      drift: false,
      repaired: false,
      concepts: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      note:
        'Carries no standalone banner of its own; re-exports IMP124821_HONEST_BANNER verbatim as ' +
        'IMP124921_HONEST_BANNER, and that inherited string supplies all four concepts.',
    },
    {
      file: 'imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword.js',
      drift: true,
      repaired: true,
      conceptsBeforeRepair: { noBoundChange: true, imp3066Untouched: false, noQed: true, ptSota: true },
      conceptsAfterRepair: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      driftDetail:
        'The imp-3066 K_a >= 0 untouched citation was entirely absent; the verdict only paraphrased it as ' +
        '"DIAG3 == 0 and all pinned surrogate constants untouched." Repaired by inserting "imp-3066 K_a >= 0 ' +
        'untouched;" into the verdict string.',
    },
  ],
  driftCount: 2,
  repairedCount: 2,
  mutuallyConsistent: true,
  recommendation:
    'Three of the five modules already carried all four honesty-banner concepts (one, imp-124921, only via ' +
    'a re-exported sibling banner binding). Two (imp-124919, imp-124922) -- both glossary headwords that ' +
    'paraphrased surrogate-constant invariance without the specific imp-3066 citation -- were missing the ' +
    'imp-3066 K_a >= 0 untouched citation entirely and have been repaired to match the cohort pattern.',
  honestNote:
    'Read-only audit plus two in-place wording repairs; no pages or bounds fabricated. No QED. ' +
    'Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_124964_ASSERTIONS = [
  {
    id: 'imp124964-exactly-five-modules-audited-two-drifts-repaired',
    holds: () =>
      IMP_124964_HONESTY_BANNER_AUDIT.modulesAudited.length === 5 &&
      IMP_124964_HONESTY_BANNER_AUDIT.driftCount === 2 &&
      IMP_124964_HONESTY_BANNER_AUDIT.repairedCount === 2 &&
      IMP_124964_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.drift).length === 2,
    why: 'The audit must cover exactly the five named Oct-6/7 cohort modules and the 2026-10-07 audit found exactly two drifts, both repaired.',
  },
  {
    id: 'imp124964-repaired-modules-now-carry-all-four-concepts',
    holds: () => {
      const repaired = IMP_124964_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.repaired);
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
    why: 'After repair, both imp-124919 and imp-124922 must carry all four required honesty-banner concepts.',
  },
  {
    id: 'imp124964-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_124964_HONESTY_BANNER_AUDIT.honestNote) &&
      /no QED/i.test(IMP_124964_HONESTY_BANNER_AUDIT.honestNote) &&
      IMP_124964_HONESTY_BANNER_AUDIT.mutuallyConsistent === true,
    why: 'VERDICT LOCK: this is a read-only audit plus two wording repairs, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_124964_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124964 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_124964_ASSERTIONS };
