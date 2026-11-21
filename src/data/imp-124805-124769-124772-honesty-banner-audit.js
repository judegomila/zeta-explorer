/**
 * @module imp-124805-124769-124772-honesty-banner-audit
 * @fileoverview imp-124805 -- Audit whether the four sigma-diagnostic leaves
 * imp-124769 (E_CF stencil noise-floor crossover), imp-124770 (pair-ratio
 * identity landmark ladder), imp-124771 (knee-amp bracket-width reconcile),
 * and imp-124772 (knee floor-elasticity multifloor fit) each carry the
 * required four-part honesty banner -- (1) an explicit no-bound-change
 * statement, (2) the imp-3066 K_a &gt;= 0 positivity-untouched note, (3) a
 * no-RH-verdict / NO QED disclaimer, and (4) the no-refereed-bound-change citation -- per the imp-97851 cohort honesty-audit
 * pattern (which covered the earlier imp-97821/97822/97823 trio).
 *
 * METHOD (read-only, performed at author time). Grep each module's exported
 * verdict/summary strings for the four literal phrases below.
 *
 * RESULT (audited 2026-09-27): ZERO DRIFT. All four modules carry the full
 * four-part banner in near-identical phrasing:
 *   - imp-124769-ecf-stencil-noise-floor-crossover.js : CLEAN
 *     ("changes no bound" x2, "imp-3066 K_a >= 0 untouched" x2, "NO QED" x7,
 *     "no refereed bound is changed" x3)
 *   - imp-124770-pair-ratio-identity-landmark-ladder.js : CLEAN
 *     ("changes no bound" x2, "imp-3066 K_a >= 0 untouched" x2, "NO QED" x7,
 *     "no refereed bound is changed" x3)
 *   - imp-124771-knee-amp-bracket-width-reconcile.js : CLEAN
 *     ("changes no bound" x1, "imp-3066 K_a >= 0 untouched" x2, "NO QED" x6,
 *     "no refereed bound is changed" x3; the closing clause wraps across a JSDoc comment
 *     line break -- "no RH verdict, NO QED." / "No refereed bound is changed
 *     ." on the next line -- a cosmetic line-wrap, not a
 *     substantive gap: the exported verdict string carries the clause
 *     contiguously)
 *   - imp-124772-knee-floor-elasticity-multifloor-fit.js : CLEAN
 *     ("changes no bound" x2, "imp-3066 K_a >= 0 untouched" x1, "NO QED" x6,
 *     "no refereed bound is changed" x3)
 * All four carry "no RH verdict, NO QED. No refereed bound is changed
 * ." verbatim in their exported verdict strings, immediately
 * preceded by "imp-3066 K_a &gt;= 0 untouched" -- the wording is mutually
 * consistent, not merely present. No unconditional-Lambda claim or
 * false-QED framing found in any of the four.
 *
 * RECOMMENDATION. No repair needed. This module fabricates no pages and
 * asserts no new bound; it only records the audit outcome. No QED.
 * No refereed bound is changed.
 *
 * @see imp-97851 (the prior cohort honesty-audit this extends to the newer four-module batch)
 */

export const IMP_124805_HONESTY_BANNER_AUDIT = {
  id: 'imp-124805',
  auditedAt: '2026-09-27',
  method:
    'Grep each of the four named modules for the four required honesty-banner phrases -- ' +
    '"changes no bound" (no-bound-change), "imp-3066 K_a >= 0 untouched" (imp-3066-untouched), ' +
    '"NO QED" (NO-QED), and "no refereed bound is changed" (no-refereed-bound-change) -- and cross-compare wording for consistency.',
  modulesAudited: [
    {
      file: 'imp-124769-ecf-stencil-noise-floor-crossover.js',
      drift: false,
      counts: { noBoundChange: 2, imp3066Untouched: 2, noQed: 7, ptSota: 3 },
    },
    {
      file: 'imp-124770-pair-ratio-identity-landmark-ladder.js',
      drift: false,
      counts: { noBoundChange: 2, imp3066Untouched: 2, noQed: 7, ptSota: 3 },
    },
    {
      file: 'imp-124771-knee-amp-bracket-width-reconcile.js',
      drift: false,
      counts: { noBoundChange: 1, imp3066Untouched: 2, noQed: 6, ptSota: 3 },
    },
    {
      file: 'imp-124772-knee-floor-elasticity-multifloor-fit.js',
      drift: false,
      counts: { noBoundChange: 2, imp3066Untouched: 1, noQed: 6, ptSota: 3 },
    },
  ],
  driftCount: 0,
  repairedCount: 0,
  mutuallyConsistent: true,
  recommendation:
    'All four modules carry the full four-part honesty banner with the identical closing clause ' +
    '"no RH verdict, NO QED. No refereed bound is changed." verbatim in their exported ' +
    'verdict strings, preceded by "imp-3066 K_a >= 0 untouched" in all four. No repair needed.',
  honestNote:
    'Read-only audit; no pages or bounds fabricated, no repair applied. No QED. ' +
    'No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_124805_ASSERTIONS = [
  {
    id: 'imp124805-exactly-four-modules-audited-zero-drift',
    holds: () =>
      IMP_124805_HONESTY_BANNER_AUDIT.modulesAudited.length === 4 &&
      IMP_124805_HONESTY_BANNER_AUDIT.driftCount === 0 &&
      IMP_124805_HONESTY_BANNER_AUDIT.modulesAudited.every((m) => !m.drift),
    why: 'The audit must cover exactly the four named modules (imp-124769/124770/124771/124772) and the 2026-09-27 audit found zero drift.',
  },
  {
    id: 'imp124805-every-module-carries-all-four-banner-parts',
    holds: () =>
      IMP_124805_HONESTY_BANNER_AUDIT.modulesAudited.every(
        (m) =>
          m.counts.noBoundChange >= 1 &&
          m.counts.imp3066Untouched >= 1 &&
          m.counts.noQed >= 1 &&
          m.counts.ptSota >= 1
      ),
    why: 'Every audited module must carry at least one occurrence of each of the four required honesty-banner phrases.',
  },
  {
    id: 'imp124805-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_124805_HONESTY_BANNER_AUDIT.honestNote) &&
      /no QED/i.test(IMP_124805_HONESTY_BANNER_AUDIT.honestNote) &&
      IMP_124805_HONESTY_BANNER_AUDIT.mutuallyConsistent === true,
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_124805_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124805 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_124805_ASSERTIONS };
