/**
 * @module imp-34834-caveat-surfacing-audit-34798-34801-34813
 *
 * imp-34834 (meta): AUDIT of whether the shared honest-status caveat
 * (inherited imp-3220/imp-3406 surrogate crossover map, sub-gap imp-34714a
 * directed-rounding certificate OPEN, C_C=(1/8)sqrt(3pi) ansatz imp-2642/
 * imp-2643, C_mb GUE-conditional per imp-486, no operator positivity / no RH
 * verdict / NO QED, no refereed bound is changed) is carried by
 * every module in the imp-34798/imp-34800/imp-34801/imp-34813 cohort and any
 * viz page built from imp-34799/imp-34794, extending the imp-34725/imp-34812
 * audit lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names four data-module tickets
 * (34798, 34800, 34801, 34813) plus two tickets to check for downstream viz
 * pages (34799, 34794). Checking src/pages/ shows: imp-34813 shipped as
 * src/pages/Imp34825WindingCountLadderViz.jsx, imp-34799 shipped as
 * src/pages/Imp34830DirectedRoundingWidthBoundViz.jsx, and imp-34800 shipped
 * as src/pages/Imp34832NCrossThreeWayLandmarkComparisonViz.jsx. imp-34798,
 * imp-34801, and imp-34794 completed as data-module-only tickets with no
 * dedicated viz page under those ids -- the same "ticket text over-describes
 * the cohort" pattern imp-34725 and imp-34812 found before.
 *
 * METHOD. Each of the 6 data modules and 3 actual viz pages was read
 * directly: every data module's header JSDoc and `verdict`/`honest` fields
 * carry the surrogate/imp-34714a-open/no-QED/PT-no-refereed-bound-change caveat, and every viz
 * page renders an inline "Honest status:" block repeating the same caveat.
 *
 * FINDING: no gap. All 6 data modules and all 3 actual viz pages carry the
 * caveat. AUDIT-ONLY -- no surfacing was added because none was missing; the
 * only change is documenting the imp-34798/34801/34794 no-viz-page cohort
 * membership for future audits.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34798', module: 'src/data/imp-34798-iters-to-floor-log-law-higher-N.js', hasCaveat: true, hasVizPage: false },
  { ticket: 'imp-34800', module: 'src/data/imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection.js', hasCaveat: true, hasVizPage: true },
  { ticket: 'imp-34801', module: 'src/data/imp-34801-crossover-gpp-cross-band-resolution-matched.js', hasCaveat: true, hasVizPage: false },
  { ticket: 'imp-34813', module: 'src/data/imp-34813-winding-monotonicity-rigor.js', hasCaveat: true, hasVizPage: true },
  { ticket: 'imp-34799', module: 'src/data/imp-34799-krawczyk-directed-rounding-width-bound.js', hasCaveat: true, hasVizPage: true },
  { ticket: 'imp-34794', module: 'src/data/imp-34794-krawczyk-tightest-certified-bracket.js', hasCaveat: true, hasVizPage: false },
];

const VIZ_PAGE_COHORT = [
  { ticket: 'imp-34813', page: 'src/pages/Imp34825WindingCountLadderViz.jsx', pageHasInlineBanner: true },
  { ticket: 'imp-34799', page: 'src/pages/Imp34830DirectedRoundingWidthBoundViz.jsx', pageHasInlineBanner: true },
  { ticket: 'imp-34800', page: 'src/pages/Imp34832NCrossThreeWayLandmarkComparisonViz.jsx', pageHasInlineBanner: true },
];

const NO_VIZ_PAGE = ['imp-34798', 'imp-34801', 'imp-34794'];

export const CAVEAT_SURFACING_AUDIT_34798_34801_34813 = {
  ticket: 'imp-34834',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  noVizPageIds: NO_VIZ_PAGE,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.ticket),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 6 imp-34798/34799/34800/34801/'
    + '34813/34794 data modules and rendered inline on all 3 actual viz pages built from this cohort '
    + '(imp-34813, imp-34799, imp-34800); no surfacing added because none was missing. imp-34798/imp-34801/'
    + 'imp-34794 were excluded as data-module-only tickets with no viz page, not unaudited pages. No bound '
    + 'change; sub-gap imp-34714a stays OPEN; C_C 1/8 ansatz and C_mb GUE-conditional share (imp-486) '
    + 'untouched; no operator positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34798_34801_34813_ASSERTIONS = [
  {
    id: 'imp-34834-data-module-cohort-has-six-members',
    description: 'the audited data-module cohort is exactly imp-34798/34799/34800/34801/34813/34794',
    holds: () => CAVEAT_SURFACING_AUDIT_34798_34801_34813.dataModuleCohort.length === 6
      && ['imp-34798', 'imp-34799', 'imp-34800', 'imp-34801', 'imp-34813', 'imp-34794']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34834-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34834-viz-page-cohort-has-three-members',
    description: 'the audited viz-page cohort is exactly imp-34813/imp-34799/imp-34800',
    holds: () => CAVEAT_SURFACING_AUDIT_34798_34801_34813.vizPageCohort.length === 3
      && ['imp-34813', 'imp-34799', 'imp-34800']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34834-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34834-no-viz-page-ids-documented',
    description: 'the imp-34798/imp-34801/imp-34794 no-viz-page membership is recorded, not silently dropped',
    holds: () => NO_VIZ_PAGE.length === 3
      && ['imp-34798', 'imp-34801', 'imp-34794'].every((t) => CAVEAT_SURFACING_AUDIT_34798_34801_34813.noVizPageIds.includes(t)),
  },
  {
    id: 'imp-34834-no-gaps-found',
    description: 'the audit found zero gaps across the full 6-module + 3-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34798_34801_34813.gapsFound.length === 0,
  },
  {
    id: 'imp-34834-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34798_34801_34813.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34798_34801_34813.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34798_34801_34813.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34798_34801_34813_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34834-caveat-surfacing-audit assertion failed: ${a.id}`);
}
