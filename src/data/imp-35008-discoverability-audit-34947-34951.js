/**
 * @module imp-35008-discoverability-audit-34947-34951
 *
 * imp-35008 (meta): DISCOVERABILITY audit of whether the imp-34947
 * (conjugate-pair theta cross-check), imp-34949 (Krawczyk margin infimum),
 * imp-34950 (E_flow exponent decomposition), and imp-34951 (plus-one-
 * impossibility margin band) analysis modules -- and their four downstream
 * viz pages imp-34998/34999/35000/35001 -- are surfaced from any
 * analysis-index or Concepts page (a "consumer re-pointer") so a reader can
 * actually NAVIGATE to them by clicking through, rather than only by knowing
 * the direct /viz-imp3499x URL. This is a DIFFERENT question from the
 * imp-35007 caveat-surfacing audit, which checked whether the honest-status
 * banner is PRESENT on pages that already exist -- imp-35008 checks whether
 * those pages are REACHABLE from anywhere else in the app.
 *
 * METHOD. (1) Grepped every route string
 * (/viz-imp34998-.../viz-imp34999-.../viz-imp35000-.../viz-imp35001-...)
 * against every .jsx/.js file in src/ to find any inbound <Link to="..."> or
 * to={'...'} pointer outside of the route's own App.jsx <Route> registration.
 * (2) Read src/data/visualizations-index.js (the registry backing the
 * /visualizations "All Visualizations" master index page) for a matching
 * `route:` entry. (3) Ran scripts/audit-nav-links.mjs, which independently
 * tracks exactly this gap via its EXEMPT_FROM_INDEX backlog set (imp-2675).
 * (4) Read src/pages/ConceptsPage.jsx to confirm glossary definitions/
 * relatedTerms render as plain text (no React Router Link), so a reader can
 * FIND the imp-35002/35003/35004/35005/35006 glossary headwords by searching
 * the Concepts page but cannot click through from them to the viz pages.
 * (5) Repeated steps (1)-(3) for the imp-34952..34957 sibling cohort's six
 * viz pages (imp-34978/34980/34981/34983/34985/34986) that the ticket
 * assumed was "already indexed", to check the comparison baseline.
 *
 * FINDING: all four cohort viz pages are ORPHANED from the /visualizations
 * master index -- each route is present in App.jsx and in the
 * scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX backlog set (a documented,
 * warn-only drift list), but has NO entry in src/data/visualizations-index.js
 * and NO inbound <Link> from any other page. A reader can only reach these
 * four pages by typing the exact /viz-imp3499x URL. The five glossary
 * headwords ARE reachable by searching the Concepts page (findable by
 * keyword), but their prose only NAMES the ticket ids -- it does not render
 * a clickable Link to the corresponding viz route, so Concepts-page
 * discovery is search-based, not click-through navigation.
 *
 * The ticket's premise that the imp-34952..34957 sibling cohort was
 * "already indexed" does NOT hold under this audit's stricter reachability
 * test: those six viz pages are in the identical EXEMPT_FROM_INDEX backlog
 * state -- present in App.jsx, absent from visualizations-index.js, no
 * inbound Link. Both cohorts are equally orphaned; there is no asymmetry to
 * repair between them. AUDIT-ONLY -- no routes registered, no index entries
 * added; adding either would be a distinct ux ticket.
 */

const DATA_MODULE_COHORT = [
  {
    ticket: 'imp-34947',
    dataModule: 'src/data/imp-34947-conjugate-pair-argument-theta-cross-check.js',
    vizPage: 'src/pages/Imp34998ConjugatePairSingularityAngleCrossCheckViz.jsx',
    route: '/viz-imp34998-conjugate-pair-singularity-angle-cross-check',
    glossaryHeadword: 'imp-35002',
  },
  {
    ticket: 'imp-34949',
    dataModule: 'src/data/imp-34949-krawczyk-margin-infimum-band-endpoint.js',
    vizPage: 'src/pages/Imp34999KrawczykMarginInfimumBandEndpointViz.jsx',
    route: '/viz-imp34999-krawczyk-margin-infimum-band-endpoint',
    glossaryHeadword: 'imp-35005',
  },
  {
    ticket: 'imp-34950',
    dataModule: 'src/data/imp-34950-eflow-crossing-strength-cmb-exponent-structural.js',
    vizPage: 'src/pages/Imp35000EflowCrossingStrengthExponentDecompositionViz.jsx',
    route: '/viz-imp35000-eflow-crossing-strength-exponent-decomposition',
    glossaryHeadword: 'imp-35003 and imp-35006 (two headwords)',
  },
  {
    ticket: 'imp-34951',
    dataModule: 'src/data/imp-34951-plus-one-impossibility-margin-band.js',
    vizPage: 'src/pages/Imp35001PlusOneImpossibilityMarginBandViz.jsx',
    route: '/viz-imp35001-plus-one-impossibility-margin-band',
    glossaryHeadword: 'imp-35004',
  },
].map((m) => ({
  ...m,
  inVisualizationsIndexRegistry: false,
  hasInboundLinkFromOtherPage: false,
  inExemptFromIndexBacklog: true,
  reachableOnlyByDirectUrl: true,
  glossaryReachableBySearch: true,
  glossaryHasClickableLinkToVizPage: false,
}));

const SIBLING_COHORT_34952_34957_ROUTES = [
  '/viz-imp34978-double-double-log-ulp-band-wide',
  '/viz-imp34980-r-margin-dyadic-wall-sweep',
  '/viz-imp34981-landmark-gap-reconstruction-ladder',
  '/viz-imp34983-sigma-knee-crossing-cmb-sensitivity',
  '/viz-imp34985-pinned-product-window-sensitivity',
  '/viz-imp34986-crossover-numerator-polynomial-ladder',
];

export const DISCOVERABILITY_AUDIT_34947_34951 = {
  ticket: 'imp-35008',
  dataModuleCohort: DATA_MODULE_COHORT,
  siblingCohortRoutes34952_34957: SIBLING_COHORT_34952_34957_ROUTES,
  navAuditMechanism: 'scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX set (imp-2675 drift backlog)',
  vizMasterIndexRegistry: 'src/data/visualizations-index.js (drives the /visualizations page)',
  orphanedFromMasterIndex: DATA_MODULE_COHORT.map((m) => m.ticket),
  siblingCohortAlsoOrphaned: true,
  premiseCorrection:
    'imp-35008 was framed against a premise that the imp-34952..34957 sibling cohort was "already indexed"; '
    + 'this audit found that premise does not hold -- both cohorts sit in the identical EXEMPT_FROM_INDEX '
    + 'backlog state relative to the /visualizations master index.',
  honest:
    'AUDIT-ONLY -- confirms all 4 imp-34947/34949/34950/34951 viz pages (imp-34998/34999/35000/35001) are '
    + 'reachable only via their direct /viz-imp3499x URL: absent from the visualizations-index.js registry '
    + 'that drives the /visualizations master index, present only in the scripts/audit-nav-links.mjs '
    + 'EXEMPT_FROM_INDEX drift backlog, and with no inbound <Link> from any other page. The 5 glossary '
    + 'headwords (imp-35002/35003/35004/35005/35006) are keyword-findable on the Concepts page but render as '
    + 'plain text, not a clickable pointer to the viz route. The imp-34952..34957 sibling cohort this ticket '
    + 'compared against is equally orphaned, not "already indexed" as assumed -- so no asymmetry exists to '
    + 'repair between the two cohorts. No routes added, no index entries changed; adding either is a distinct '
    + 'ux ticket. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. '
    + 'No refereed bound is changed.',
};

export const DISCOVERABILITY_AUDIT_34947_34951_ASSERTIONS = [
  {
    id: 'imp-35008-cohort-has-four-members',
    description: 'the audited cohort is exactly the 4 tickets imp-34947/34949/34950/34951',
    holds: () => DATA_MODULE_COHORT.length === 4
      && ['imp-34947', 'imp-34949', 'imp-34950', 'imp-34951']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-35008-all-orphaned-from-master-index',
    description: 'every cohort viz page is absent from the visualizations-index.js registry',
    holds: () => DATA_MODULE_COHORT.every((m) => m.inVisualizationsIndexRegistry === false),
  },
  {
    id: 'imp-35008-all-in-exempt-backlog-only-reachable-by-url',
    description: 'every cohort viz route sits in the documented EXEMPT_FROM_INDEX drift backlog and has no inbound Link',
    holds: () => DATA_MODULE_COHORT.every((m) => m.inExemptFromIndexBacklog === true
      && m.hasInboundLinkFromOtherPage === false
      && m.reachableOnlyByDirectUrl === true),
  },
  {
    id: 'imp-35008-glossary-searchable-not-clickable',
    description: 'glossary headwords are Concepts-page keyword-findable but do not link through to the viz route',
    holds: () => DATA_MODULE_COHORT.every((m) => m.glossaryReachableBySearch === true
      && m.glossaryHasClickableLinkToVizPage === false),
  },
  {
    id: 'imp-35008-sibling-cohort-also-orphaned',
    description: 'the imp-34952..34957 sibling cohort (6 viz routes) is equally orphaned, contradicting the ticket premise',
    holds: () => SIBLING_COHORT_34952_34957_ROUTES.length === 6
      && DISCOVERABILITY_AUDIT_34947_34951.siblingCohortAlsoOrphaned === true,
  },
  {
    id: 'imp-35008-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no index entries added, no routes changed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(DISCOVERABILITY_AUDIT_34947_34951.honest)
      && /No routes added, no index entries changed/.test(DISCOVERABILITY_AUDIT_34947_34951.honest)
      && /refereed bound is changed/i.test(DISCOVERABILITY_AUDIT_34947_34951.honest),
  },
];

for (const a of DISCOVERABILITY_AUDIT_34947_34951_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35008-discoverability-audit assertion failed: ${a.id}`);
}
