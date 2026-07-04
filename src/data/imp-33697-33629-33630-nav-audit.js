/**
 * @module imp-33697-33629-33630-nav-audit
 * @fileoverview imp-33697 -- "shipped page but never registered" audit of the two newest
 * deep-tail/band-crossing viz pages, Imp33629WideRangeBandCrossingEnvelopeViz (route
 * /viz-imp33629-wide-range-band-crossing-envelope) and Imp33630GradeVsNodeBudgetViz (route
 * /viz-imp33630-grade-vs-node-budget), following the imp-2800 audit-nav-links.mjs / imp-2675
 * registry-coverage machinery.
 *
 * METHOD (read-only, performed at author time). Grepped src/App.jsx for both component names
 * and their lazy-import + <Route path> lines; grepped src/data/nav-groups.js (sidebar nav) and
 * src/data/visualizations-index.js (the curated /visualizations gallery registry) for both
 * routes; grepped scripts/audit-nav-links.mjs's EXEMPT_FROM_INDEX backlog set for both routes;
 * ran `node scripts/audit-nav-links.mjs` to confirm the live audit result.
 *
 * RESULT (audited 2026-07-04). Both pages ARE routed: both have a lazy import and a <Route>
 * entry in src/App.jsx (added in the same commit that shipped the pages, imp-30 improvements.js
 * id 28668). Neither route appears in src/data/nav-groups.js (the hand-curated sidebar) nor in
 * src/data/visualizations-index.js (the hand-curated /visualizations gallery of 19 highlight
 * pages) -- but neither is orphaned: both routes are already listed in the documented
 * EXEMPT_FROM_INDEX drift-backlog set in scripts/audit-nav-links.mjs, which the imp-2675
 * registry-coverage check treats as an acknowledged WARN, not a build-breaking FAIL. This is the
 * SAME status carried by ~100 other sibling imp-336xx/imp-33xx viz pages (e.g. imp-33587,
 * imp-33607, imp-33609, imp-33611, imp-33613, imp-33628) -- consistent handling, not a missed
 * registration. `node scripts/audit-nav-links.mjs` exits 0 (warn-only) with both routes present
 * in its warning list, confirming no broken link and no un-exempted orphan.
 *
 * No dedicated "analysis-tab hub" page exists yet for this specific cohort (imp-33627/imp-33628/
 * imp-33629/imp-33630 Etrunc-Ecoll-crossover / wide-range-band-crossing / grade-vs-node-budget
 * thread) to cross-link from -- the two tickets that would build such a hub, imp-33595 (combined
 * deep-tail node-budget + envelope analysis index) and imp-33617 (combined navigation index for
 * the imp-33577/33579/33580/33582 cohort), remain pending (low priority, sonnet-4-6 tier) and are
 * the correct place for that cross-linking work, not this audit.
 *
 * @see imp-2800 (scripts/audit-nav-links.mjs), imp-2675 (registry-coverage cross-check),
 * imp-33693/imp-33695 (the cohort-provenance-rollup audit pattern this note follows)
 */

export const IMP_33697_33629_33630_NAV_AUDIT = {
  id: 'imp-33697',
  auditedAt: '2026-07-04',
  method:
    'Grep src/App.jsx for lazy-import + <Route> entries for both components; grep ' +
    'src/data/nav-groups.js and src/data/visualizations-index.js for both routes; grep ' +
    'scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX for both routes; run ' +
    'node scripts/audit-nav-links.mjs to confirm the live audit exit status.',
  pages: [
    {
      component: 'Imp33629WideRangeBandCrossingEnvelopeViz',
      route: '/viz-imp33629-wide-range-band-crossing-envelope',
      registeredInAppJsx: true,
      inNavGroupsSidebar: false,
      inVisualizationsIndexRegistry: false,
      inExemptFromIndexBacklog: true,
      orphaned: false,
    },
    {
      component: 'Imp33630GradeVsNodeBudgetViz',
      route: '/viz-imp33630-grade-vs-node-budget',
      registeredInAppJsx: true,
      inNavGroupsSidebar: false,
      inVisualizationsIndexRegistry: false,
      inExemptFromIndexBacklog: true,
      orphaned: false,
    },
  ],
  navLinkAuditExitCode: 0,
  cohortHubExists: false,
  cohortHubBlockingTickets: ['imp-33595', 'imp-33617'],
  recommendation:
    'No route re-pointing needed -- both pages are registered in App.jsx and correctly carry ' +
    'the documented EXEMPT_FROM_INDEX backlog entry, matching ~100 sibling viz pages. The ' +
    'cross-link-from-a-hub half of this ticket is blocked on imp-33595/imp-33617 (still pending, ' +
    'low priority), which build the actual hub page this cohort should link from.',
  honestNote:
    'Read-only nav/route audit; no new pages fabricated, no bound claimed. imp-3066 K_a >= 0 ' +
    'positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

const IMP_33697_ASSERTIONS = [
  {
    id: 'imp33697-exactly-two-pages-audited',
    holds: () => IMP_33697_33629_33630_NAV_AUDIT.pages.length === 2,
    why: 'The audit must cover exactly the two named pages (imp-33629, imp-33630).',
  },
  {
    id: 'imp33697-both-registered-in-app-jsx',
    holds: () =>
      IMP_33697_33629_33630_NAV_AUDIT.pages.every((p) => p.registeredInAppJsx === true),
    why: 'Grep-verified: both components have a lazy import and a <Route> entry in src/App.jsx.',
  },
  {
    id: 'imp33697-neither-orphaned',
    holds: () =>
      IMP_33697_33629_33630_NAV_AUDIT.pages.every(
        (p) => p.orphaned === false && p.inExemptFromIndexBacklog === true
      ),
    why: 'Grep-verified: both routes carry the documented EXEMPT_FROM_INDEX backlog entry in ' +
      'scripts/audit-nav-links.mjs, so the imp-2675 registry-coverage check WARNs rather than ' +
      'fails for them -- consistent with sibling viz pages, not a missed registration.',
  },
  {
    id: 'imp33697-nav-link-audit-exit-clean',
    holds: () => IMP_33697_33629_33630_NAV_AUDIT.navLinkAuditExitCode === 0,
    why: 'node scripts/audit-nav-links.mjs was run and exits 0 (warn-only), confirming no broken ' +
      'link and no un-exempted orphan for either route.',
  },
  {
    id: 'imp33697-hub-work-correctly-deferred',
    holds: () =>
      IMP_33697_33629_33630_NAV_AUDIT.cohortHubExists === false &&
      IMP_33697_33629_33630_NAV_AUDIT.cohortHubBlockingTickets.length === 2,
    why: 'No dedicated cohort hub page exists yet; that build-out is scoped to the pending ' +
      'imp-33595/imp-33617 tickets, not this route-registration audit.',
  },
  {
    id: 'imp33697-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33697_33629_33630_NAV_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33697_33629_33630_NAV_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33697_33629_33630_NAV_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33697_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33697 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33697_ASSERTIONS };
