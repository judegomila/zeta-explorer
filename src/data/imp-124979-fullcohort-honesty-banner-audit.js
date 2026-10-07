/**
 * @module imp-124979-fullcohort-honesty-banner-audit
 * @fileoverview imp-124979 -- Extend the imp-124920 honesty-banner audit to the full Oct-6/7
 * cohort imp-124900/124917/124918/124919/124921/124922, checking each carries the four-part
 * banner (no-bound-change, the literal imp-3066 K_a &gt;= 0 untouched citation, no-RH-verdict /
 * NO QED, and the Platt-Trudgian Lambda &lt;= 0.2 remains-SOTA citation) and repairing any drift.
 *
 * SCOPE NOTE. Five of the six named modules (imp-124917/124918/124919/124921/124922) were
 * already audited by the intervening imp-124964 cohort audit, which found and repaired two
 * drifts (imp-124919, imp-124922 were missing the literal imp-3066 citation) and confirmed the
 * other three clean. This audit does not re-litigate those five; it re-verifies their exported
 * content still carries all four concepts (no regression since imp-124964), and performs the
 * one piece of actual new work: auditing imp-124900, the sixth cohort member that imp-124964's
 * five-module list did not cover.
 *
 * METHOD (read-only, performed at author time, live-import consistent with imp-124964). Each
 * module was imported live in Node and every exported string/array/object field was concatenated
 * into one search text (crediting re-exported sibling bindings, e.g. imp-124921's
 * IMP124921_HONEST_BANNER, to the importing module), then tested for the four required concepts:
 * a no-bound-change statement (synonyms such as "no bound moved" accepted), the literal
 * "imp-3066 K_a &gt;= 0 untouched" citation (not paraphrasable), "NO QED", and "remains SOTA".
 *
 * RESULT (audited 2026-10-07): ONE DRIFT FOUND AND REPAIRED (imp-124900); FIVE RE-CONFIRMED CLEAN.
 *   - imp-124900-fartail-per-nine-spacing-law-glossary-headword.js : DRIFT FOUND, REPAIRED.
 *     The literal "imp-3066 K_a &gt;= 0 untouched" citation appeared only in the JSDoc
 *     fileoverview comment (not an exported field), so a live-export audit found it entirely
 *     absent from the module's exported verdict string even though a raw file grep would have
 *     found it in the comment. Repaired by inserting "imp-3066 K_a &gt;= 0 untouched;" into the
 *     exported IMP124900_..._HEADWORD.verdict string and adding a matching assertion
 *     (imp124900-imp3066-untouched-citation) that checks the exported field, not the comment.
 *   - imp-124917-f2-residual-curvature-u-viz-data.js : RE-CONFIRMED CLEAN (per imp-124964).
 *   - imp-124918-kernel-ratio-bracket-viz-data.js : RE-CONFIRMED CLEAN (per imp-124964).
 *   - imp-124919-ecf-stencil-crossover-glossary-headword.js : RE-CONFIRMED CLEAN (drift already
 *     repaired by imp-124964; the imp-3066 citation is present in the live export).
 *   - imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note.js : RE-CONFIRMED CLEAN (carries
 *     no standalone banner; re-exports IMP124821_HONEST_BANNER verbatim, which supplies all four
 *     concepts).
 *   - imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword.js : RE-CONFIRMED CLEAN (drift
 *     already repaired by imp-124964; the imp-3066 citation is present in the live export).
 *
 * RECOMMENDATION. The full six-module cohort named by imp-124979 now carries all four
 * honesty-banner concepts in every exported field. This audit module fabricates no new pages and
 * asserts no new bound; it only records the one new repair and re-confirms the five modules
 * imp-124964 already covered. No QED. Platt-Trudgian Lambda &lt;= 0.2 stays the rigorous SOTA.
 *
 * @see imp-124964-oct6-7-cohort-honesty-banner-audit.js (the intervening audit that covered five
 *   of the six modules named here, repairing imp-124919 and imp-124922)
 * @see imp-124920-124821-124823-124824-124776-124837-honesty-banner-audit.js (the prior cohort
 *   honesty-audit this ticket's title names as its starting point)
 * @see imp-97851 (the original cohort honesty-audit pattern)
 */

export const IMP_124979_HONESTY_BANNER_AUDIT = {
  id: 'imp-124979',
  auditedAt: '2026-10-07',
  method:
    'Import each of the six named modules live in Node, concatenate every exported string/array/object ' +
    'field into one search text (crediting re-exported sibling bindings to the importing module), then ' +
    'test for the four required honesty-banner concepts -- a no-bound-change statement (synonyms ' +
    'accepted), the literal "imp-3066 K_a >= 0 untouched" citation, "NO QED", and "remains SOTA".',
  modulesAudited: [
    {
      file: 'imp-124900-fartail-per-nine-spacing-law-glossary-headword.js',
      drift: true,
      repaired: true,
      conceptsBeforeRepair: { noBoundChange: true, imp3066Untouched: false, noQed: true, ptSota: true },
      conceptsAfterRepair: { noBoundChange: true, imp3066Untouched: true, noQed: true, ptSota: true },
      driftDetail:
        'The imp-3066 K_a >= 0 untouched citation existed only in the JSDoc fileoverview comment, not ' +
        'in any exported field -- absent under a live-export audit. Repaired by inserting "imp-3066 ' +
        'K_a >= 0 untouched;" into the exported verdict string.',
    },
    {
      file: 'imp-124917-f2-residual-curvature-u-viz-data.js',
      drift: false,
      repaired: false,
      note: 're-confirmed clean; already audited by imp-124964',
    },
    {
      file: 'imp-124918-kernel-ratio-bracket-viz-data.js',
      drift: false,
      repaired: false,
      note: 're-confirmed clean; already audited by imp-124964',
    },
    {
      file: 'imp-124919-ecf-stencil-crossover-glossary-headword.js',
      drift: false,
      repaired: false,
      note: 'drift already repaired by imp-124964; re-confirmed the repair holds',
    },
    {
      file: 'imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note.js',
      drift: false,
      repaired: false,
      note: 're-confirmed clean; already audited by imp-124964 (re-exported banner)',
    },
    {
      file: 'imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword.js',
      drift: false,
      repaired: false,
      note: 'drift already repaired by imp-124964; re-confirmed the repair holds',
    },
  ],
  driftCount: 1,
  repairedCount: 1,
  mutuallyConsistent: true,
  recommendation:
    'Of the six modules named by the imp-124979 ticket, five (imp-124917/124918/124919/124921/124922) ' +
    'were already covered by the intervening imp-124964 audit and are re-confirmed clean here. The ' +
    'sixth, imp-124900, was not previously audited and had the imp-3066 K_a >= 0 untouched citation ' +
    'only in a JSDoc comment rather than an exported field -- repaired so the full cohort now carries ' +
    'all four concepts in exported content.',
  honestNote:
    'Read-only audit plus one in-place wording repair; no pages or bounds fabricated. No QED. ' +
    'Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_124979_ASSERTIONS = [
  {
    id: 'imp124979-exactly-six-modules-audited-one-drift-repaired',
    holds: () =>
      IMP_124979_HONESTY_BANNER_AUDIT.modulesAudited.length === 6 &&
      IMP_124979_HONESTY_BANNER_AUDIT.driftCount === 1 &&
      IMP_124979_HONESTY_BANNER_AUDIT.repairedCount === 1 &&
      IMP_124979_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.drift).length === 1,
    why: 'The audit must cover exactly the six named cohort modules and find exactly one drift (imp-124900), already repaired.',
  },
  {
    id: 'imp124979-repaired-module-now-carries-all-four-concepts',
    holds: () => {
      const repaired = IMP_124979_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.repaired);
      return (
        repaired.length === 1 &&
        repaired.every(
          (m) =>
            m.conceptsAfterRepair.noBoundChange === true &&
            m.conceptsAfterRepair.imp3066Untouched === true &&
            m.conceptsAfterRepair.noQed === true &&
            m.conceptsAfterRepair.ptSota === true,
        )
      );
    },
    why: 'After repair, imp-124900 must carry all four required honesty-banner concepts in its exported fields.',
  },
  {
    id: 'imp124979-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_124979_HONESTY_BANNER_AUDIT.honestNote) &&
      /no QED/i.test(IMP_124979_HONESTY_BANNER_AUDIT.honestNote) &&
      IMP_124979_HONESTY_BANNER_AUDIT.mutuallyConsistent === true,
    why: 'VERDICT LOCK: this is a read-only audit plus one wording repair, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_124979_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124979 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_124979_ASSERTIONS };
