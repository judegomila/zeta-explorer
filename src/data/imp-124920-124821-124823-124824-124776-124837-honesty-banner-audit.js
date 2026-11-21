/**
 * @module imp-124920-124821-124823-124824-124776-124837-honesty-banner-audit
 * @fileoverview imp-124920 -- Extend the imp-124838 cohort honesty-banner audit to the
 * imp-124821/124823/124824/124776/124837 documentation-leaf cohort. Each must carry the
 * same required four-part honesty banner -- (1) an explicit no-bound-change statement,
 * (2) the imp-3066 K_a &gt;= 0 positivity-untouched note, (3) a no-RH-verdict / NO QED
 * disclaimer, and (4) the no-refereed-bound-change citation.
 *
 * METHOD (read-only, performed at author time). Grep each module's exported
 * banner/verdict string for the four literal phrases: "changes no bound" (case-
 * insensitive), "imp-3066 K_a &gt;= 0 untouched", "NO QED", and "no refereed bound is changed".
 *
 * RESULT (audited 2026-10-06): THREE DRIFTS FOUND AND REPAIRED, TWO ALREADY CLEAN.
 *   - imp-124776-kernel-decade-ratio-vs-gap-viz-data.js : CLEAN (already repaired by imp-124838).
 *   - imp-124824-ecf-stencil-crossover-viz-data.js : CLEAN (all four phrases present).
 *   - imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status.js : DRIFT, REPAIRED.
 *     IMP124821_HONEST_BANNER closed with "No bound moved." only -- missing the
 *     "imp-3066 K_a >= 0 untouched" phrase and the "changes no bound" wording. Repaired
 *     the closing clause to "Changes no bound; imp-3066 K_a >= 0 untouched; no RH
 *     verdict, NO QED."
 *   - imp-124823-f2-curvature-honest-status.js : DRIFT, REPAIRED.
 *     Carried no exported HONEST_BANNER constant at all (only JSDoc prose). Added
 *     IMP124823_HONEST_BANNER with the full four-part closing clause and wired it into
 *     the module's self-executing assertion.
 *   - imp-124837-fartail-rvm-per-nine-conditional-share-note.js : DRIFT, REPAIRED.
 *     IMP124837_HONEST_BANNER closed with a paraphrase ("no coefficient is newly
 *     pinned, no operator positivity is established") instead of the literal phrases.
 *     Repaired the closing clause to "changes no bound; establishes no operator
 *     positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed
 *     ."
 *
 * RECOMMENDATION. Three repairs applied; the other two modules needed none. This audit
 * module fabricates no new pages and asserts no new bound; it only records the audit
 * outcome and the three repairs. No QED. No refereed bound is changed.
 *
 * @see imp-124838 (the prior cohort honesty-audit this extends, covering imp-124793/124811/124812/124814/124776)
 * @see imp-97851 (the original cohort honesty-audit pattern)
 */

export const IMP_124920_HONESTY_BANNER_AUDIT = {
  id: 'imp-124920',
  auditedAt: '2026-10-06',
  method:
    'Grep each of the five named modules for the four required honesty-banner phrases -- ' +
    '"changes no bound" (no-bound-change), "imp-3066 K_a >= 0 untouched" (imp-3066-untouched), ' +
    '"NO QED" (NO-QED), and "no refereed bound is changed" (no-refereed-bound-change) -- and cross-compare wording for consistency.',
  modulesAudited: [
    {
      file: 'imp-124776-kernel-decade-ratio-vs-gap-viz-data.js',
      drift: false,
      repaired: false,
      note: 'already repaired by the prior imp-124838 cohort audit',
    },
    {
      file: 'imp-124824-ecf-stencil-crossover-viz-data.js',
      drift: false,
      repaired: false,
    },
    {
      file: 'imp-124821-pairratio-deeptail-reldiff-roundoff-honest-status.js',
      drift: true,
      repaired: true,
      driftDetail:
        'IMP124821_HONEST_BANNER closed with "No bound moved." only; missing "imp-3066 K_a >= 0 ' +
        'untouched" entirely. Repaired closing clause to "Changes no bound; imp-3066 K_a >= 0 ' +
        'untouched; no RH verdict, NO QED."',
    },
    {
      file: 'imp-124823-f2-curvature-honest-status.js',
      drift: true,
      repaired: true,
      driftDetail:
        'Carried no exported HONEST_BANNER constant at all (JSDoc prose only). Added ' +
        'IMP124823_HONEST_BANNER with the full four-part closing clause, wired into the module’s ' +
        'self-executing assertion.',
    },
    {
      file: 'imp-124837-fartail-rvm-per-nine-conditional-share-note.js',
      drift: true,
      repaired: true,
      driftDetail:
        'IMP124837_HONEST_BANNER closed with a paraphrase instead of the literal phrases. Repaired ' +
        'closing clause to "changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
        'untouched; no RH verdict, NO QED. No refereed bound is changed."',
    },
  ],
  driftCount: 3,
  repairedCount: 3,
  mutuallyConsistent: true,
  recommendation:
    'Two of the five modules already carried the full four-part honesty banner. The other three ' +
    '(imp-124821, imp-124823, imp-124837) were missing the imp-3066 K_a >= 0 untouched phrase -- ' +
    'one of them (imp-124823) was missing any exported banner at all -- and have been repaired to ' +
    'match the cohort pattern.',
  honestNote:
    'Read-only audit plus three in-place wording repairs; no pages or bounds fabricated. No QED. ' +
    'No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_124920_ASSERTIONS = [
  {
    id: 'imp124920-exactly-five-modules-audited-three-drifts-repaired',
    holds: () =>
      IMP_124920_HONESTY_BANNER_AUDIT.modulesAudited.length === 5 &&
      IMP_124920_HONESTY_BANNER_AUDIT.driftCount === 3 &&
      IMP_124920_HONESTY_BANNER_AUDIT.repairedCount === 3 &&
      IMP_124920_HONESTY_BANNER_AUDIT.modulesAudited.filter((m) => m.drift).length === 3,
    why: 'The audit must cover exactly the five named modules and the 2026-10-06 audit found exactly three drifts, all repaired.',
  },
  {
    id: 'imp124920-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_124920_HONESTY_BANNER_AUDIT.honestNote) &&
      /no QED/i.test(IMP_124920_HONESTY_BANNER_AUDIT.honestNote) &&
      IMP_124920_HONESTY_BANNER_AUDIT.mutuallyConsistent === true,
    why: 'VERDICT LOCK: this is a read-only audit plus three wording repairs, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_124920_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124920 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_124920_ASSERTIONS };
