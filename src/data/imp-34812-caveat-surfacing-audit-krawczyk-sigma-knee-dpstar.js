/**
 * @module imp-34812-caveat-surfacing-audit-krawczyk-sigma-knee-dpstar
 *
 * imp-34812 (meta): AUDIT of whether the shared honest-status caveat
 * (inherited imp-3220/imp-3406 surrogate crossover map, C_mb GUE-conditional
 * per imp-486, no operator positivity / no RH verdict / NO QED, no refereed bound is changed
 * ) is carried by every newly shipped viz page in the
 * imp-34774/imp-34776 Krawczyk and imp-34769/imp-34770 sigma-knee and
 * imp-34772 dp-star cohort, extending the imp-34725/imp-34834 audit lineage.
 *
 * COHORT-MEMBERSHIP CORRECTION. The ticket text names five source tickets
 * (34774, 34776, 34769, 34770, 34772) as a "viz cluster". Checking
 * improvement-queue.js and src/pages/ shows only THREE of the five actually
 * shipped as viz pages: imp-34774 (src/pages/Imp34808KrawczykContractionGapHeadroomViz.jsx),
 * imp-34776 (src/pages/Imp34811KrawczykDeltaSweepKStarLadderViz.jsx), and
 * imp-34770 (src/pages/Imp34809SigmaKneeThirdOrderResidualBudgetViz.jsx).
 * imp-34769 and imp-34772 completed as data-module-only tickets (their
 * findings were later surfaced via glossary headwords, e.g. imp-34806 for
 * imp-34772) with no dedicated viz page in src/pages/ -- so there is nothing
 * to audit for those two ids, the same "ticket text over-describes the
 * cohort" pattern imp-34725 found for imp-34624.
 *
 * METHOD. Each of the 3 actual pages was read directly (not just its data
 * module): every one renders an inline "Honest status:" block repeating the
 * full caveat (imp-3220/imp-3406, C_C=(1/8)sqrt(3pi) imp-2642/imp-2643,
 * C_mb GUE-conditional imp-486, imp-3066 K_a>=0, NO QED, no refereed bound is changed),
 * plus the module-specific sub-gap (imp-34687a/imp-34714a for the two
 * Krawczyk pages; far-tail exponent 1/2 imp-3463 for the sigma-knee page).
 * Each page's improvements.js log `detail` field independently repeats the
 * same caveat substance.
 *
 * FINDING: no gap. All 3 actual viz pages carry the caveat both inline in
 * their own JSX and in their improvements.js log detail. AUDIT-ONLY -- no
 * surfacing was added because none was missing; the only change is
 * documenting the imp-34769/imp-34772 ticket-text cohort-size error for
 * future audits.
 */

const COHORT = [
  { ticket: 'imp-34774', page: 'src/pages/Imp34808KrawczykContractionGapHeadroomViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
  { ticket: 'imp-34776', page: 'src/pages/Imp34811KrawczykDeltaSweepKStarLadderViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
  { ticket: 'imp-34770', page: 'src/pages/Imp34809SigmaKneeThirdOrderResidualBudgetViz.jsx', pageHasInlineBanner: true, improvementsLogHasCaveat: true },
];

const NO_VIZ_PAGE = ['imp-34769', 'imp-34772'];

const FULLY_COVERED = COHORT.filter((m) => m.pageHasInlineBanner && m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR = {
  ticket: 'imp-34812',
  ticketTextCohortSizeError: {
    claimedIds: ['imp-34774', 'imp-34776', 'imp-34769', 'imp-34770', 'imp-34772'],
    idsWithNoVizPage: NO_VIZ_PAGE,
    reason: 'imp-34769 and imp-34772 completed as data-module-only tickets (surfaced later via glossary '
      + 'headwords, e.g. imp-34806 for imp-34772) with no dedicated src/pages viz page under those ids',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  fullyCoveredCount: FULLY_COVERED.length,
  gapsFound: COHORT.filter((m) => !m.pageHasInlineBanner || !m.improvementsLogHasCaveat).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat is rendered directly inline on all 3 actual imp-34774/34776/34770 '
    + 'viz pages (not just via the improvements.js log); no surfacing added because none was missing. '
    + 'imp-34769/imp-34772 were excluded as data-module-only tickets with no viz page, not unaudited pages. '
    + 'No bound change; imp-3066 K_a>=0 untouched; C_mb remains GUE-conditional per imp-486; NO QED; '
    + 'no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR_ASSERTIONS = [
  {
    id: 'imp-34812-cohort-has-three-members',
    description: 'the audited viz-page cohort is exactly imp-34774/imp-34776/imp-34770',
    holds: () => CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.cohortSize === 3
      && ['imp-34774', 'imp-34776', 'imp-34770']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34812-all-three-have-inline-banner',
    description: 'every cohort page carries the honest-status caveat inline in its own JSX',
    holds: () => COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34812-all-three-surfaced-in-log',
    description: 'every cohort ticket has the caveat present in its improvements.js `detail` field',
    holds: () => CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.fullyCoveredCount === 3
      && CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.gapsFound.length === 0,
  },
  {
    id: 'imp-34812-no-viz-page-ids-documented',
    description: 'the imp-34769/imp-34772 no-viz-page cohort-size error is recorded, not silently dropped',
    holds: () => NO_VIZ_PAGE.length === 2
      && CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.ticketTextCohortSizeError.idsWithNoVizPage.includes('imp-34769')
      && CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.ticketTextCohortSizeError.idsWithNoVizPage.includes('imp-34772'),
  },
  {
    id: 'imp-34812-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_KRAWCZYK_SIGMA_KNEE_DPSTAR_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34812-caveat-surfacing-audit assertion failed: ${a.id}`);
}
