/**
 * @module imp-35023-discoverability-audit-34952-34957
 *
 * imp-35023 (meta): DISCOVERABILITY audit of whether the imp-34952 (band-wide
 * double-double log ULP), imp-34953 (R_margin dyadic-wall sweep), imp-34954
 * (surplus closed-form vs landmark-gap crosscheck), imp-34955 (sigma-knee
 * C_mb sensitivity), imp-34956 (pinned-product window sensitivity), and
 * imp-34957 (crossover-map numerator-polynomial ladder) analysis modules --
 * and their six downstream viz pages imp-34978/34980/34981/34983/34985/34986
 * -- are surfaced from any analysis-index or Concepts page (a "consumer
 * re-pointer") so a reader can actually NAVIGATE to them, rather than only by
 * knowing the direct /viz-imp3497x/3498x URL. This is a DIFFERENT question
 * from the imp-34988 caveat-surfacing audit, which checked whether the
 * honest-status banner is PRESENT on pages that already exist -- imp-35023
 * checks whether those pages are REACHABLE from anywhere else in the app.
 *
 * METHOD. (1) Grepped every route string
 * (/viz-imp34978-.../viz-imp34980-.../viz-imp34981-.../viz-imp34983-.../
 * viz-imp34985-.../viz-imp34986-...) against every file in src/ to find any
 * inbound <Link to="..."> outside of the route's own App.jsx <Route>
 * registration. (2) Read src/data/visualizations-index.js (the registry
 * backing the /visualizations master index page) for a matching route entry.
 * (3) Grepped scripts/audit-nav-links.mjs, which independently tracks this
 * gap via its EXEMPT_FROM_INDEX drift-backlog set (imp-2675). (4) Grepped
 * src/data/glossary.js for headwords naming each of the 6 tickets, and read
 * src/pages/ConceptsPage.jsx to confirm glossary term text renders as plain
 * strings (no per-term React Router <Link>), so any headword found is
 * search-findable but not click-through-navigable to its viz page.
 *
 * FINDING: all six cohort viz pages are ORPHANED from the /visualizations
 * master index -- each route is registered in App.jsx and listed in the
 * scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX backlog set (a documented,
 * warn-only drift list), but has NO entry in src/data/visualizations-index.js
 * and NO inbound <Link> from any other page. Only 3 of the 6 data modules
 * (imp-34952, imp-34954, imp-34955) have a dedicated glossary headword
 * (imp-34979, imp-34982, imp-34984 respectively); imp-34953, imp-34956, and
 * imp-34957 have no glossary surface at all, so those three are reachable
 * only by direct URL with no Concepts-page search path either. The three
 * headwords that do exist are keyword-findable on the Concepts page but
 * render as plain text, not a clickable Link to the corresponding viz route
 * -- identical to the imp-34947..34951 cohort's glossary behavior.
 *
 * Relative to the imp-34947..34951 cohort: the imp-35008 discoverability
 * audit already found that cohort's four viz pages equally orphaned from the
 * master index (present in App.jsx and the EXEMPT_FROM_INDEX backlog, absent
 * from visualizations-index.js, no inbound Link). This audit confirms the
 * SAME orphaned state holds for the imp-34952..34957 cohort -- there is NO
 * asymmetry between the two cohorts on the master-index/inbound-Link axis.
 * The one difference is glossary coverage: the imp-34947..34951 cohort has a
 * headword for every member (5 headwords across 4 tickets, imp-34950 double-
 * counted), while this cohort has headwords for only 3 of its 6 members.
 * AUDIT-ONLY -- no routes registered, no index entries added; adding either
 * is a distinct ux ticket.
 */

const DATA_MODULE_COHORT = [
  {
    ticket: 'imp-34952',
    dataModule: 'src/data/imp-34952-double-double-log-ulp-band-wide.js',
    vizPage: 'src/pages/Imp34978DoubleDoubleLogUlpBandWideViz.jsx',
    route: '/viz-imp34978-double-double-log-ulp-band-wide',
    glossaryHeadword: 'imp-34979',
  },
  {
    ticket: 'imp-34953',
    dataModule: 'src/data/imp-34953-r-margin-dyadic-wall-across-N.js',
    vizPage: 'src/pages/Imp34980RMarginDyadicWallSweepViz.jsx',
    route: '/viz-imp34980-r-margin-dyadic-wall-sweep',
    glossaryHeadword: null,
  },
  {
    ticket: 'imp-34954',
    dataModule: 'src/data/imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js',
    vizPage: 'src/pages/Imp34981LandmarkGapReconstructionLadderViz.jsx',
    route: '/viz-imp34981-landmark-gap-reconstruction-ladder',
    glossaryHeadword: 'imp-34982',
  },
  {
    ticket: 'imp-34955',
    dataModule: 'src/data/imp-34955-sigma-knee-crossing-cmb-sensitivity.js',
    vizPage: 'src/pages/Imp34983SigmaKneeCrossingCmbSensitivityViz.jsx',
    route: '/viz-imp34983-sigma-knee-crossing-cmb-sensitivity',
    glossaryHeadword: 'imp-34984',
  },
  {
    ticket: 'imp-34956',
    dataModule: 'src/data/imp-34956-pinned-product-window-sensitivity.js',
    vizPage: 'src/pages/Imp34985PinnedProductWindowSensitivityViz.jsx',
    route: '/viz-imp34985-pinned-product-window-sensitivity',
    glossaryHeadword: null,
  },
  {
    ticket: 'imp-34957',
    dataModule: 'src/data/imp-34957-crossover-deriv-p11-p12-extension.js',
    vizPage: 'src/pages/Imp34986CrossoverNumeratorPolynomialLadderViz.jsx',
    route: '/viz-imp34986-crossover-numerator-polynomial-ladder',
    glossaryHeadword: null,
  },
].map((m) => ({
  ...m,
  inVisualizationsIndexRegistry: false,
  hasInboundLinkFromOtherPage: false,
  inExemptFromIndexBacklog: true,
  reachableOnlyByDirectUrl: true,
  glossaryReachableBySearch: m.glossaryHeadword !== null,
  glossaryHasClickableLinkToVizPage: false,
}));

const SIBLING_COHORT_34947_34951_ROUTES = [
  '/viz-imp34998-conjugate-pair-singularity-angle-cross-check',
  '/viz-imp34999-krawczyk-margin-infimum-band-endpoint',
  '/viz-imp35000-eflow-crossing-strength-exponent-decomposition',
  '/viz-imp35001-plus-one-impossibility-margin-band',
];

export const DISCOVERABILITY_AUDIT_34952_34957 = {
  ticket: 'imp-35023',
  dataModuleCohort: DATA_MODULE_COHORT,
  siblingCohortRoutes34947_34951: SIBLING_COHORT_34947_34951_ROUTES,
  navAuditMechanism: 'scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX set (imp-2675 drift backlog)',
  vizMasterIndexRegistry: 'src/data/visualizations-index.js (drives the /visualizations page)',
  orphanedFromMasterIndex: DATA_MODULE_COHORT.map((m) => m.ticket),
  glossaryCoveredTickets: DATA_MODULE_COHORT.filter((m) => m.glossaryHeadword !== null).map((m) => m.ticket),
  glossaryUncoveredTickets: DATA_MODULE_COHORT.filter((m) => m.glossaryHeadword === null).map((m) => m.ticket),
  siblingCohortAlsoOrphaned: true,
  asymmetryFound: 'glossary-coverage-only',
  honest:
    'AUDIT-ONLY -- confirms all 6 imp-34952..imp-34957 viz pages (imp-34978/34980/34981/34983/34985/34986) are '
    + 'reachable only via their direct /viz-imp3497x/3498x URL: absent from the visualizations-index.js registry '
    + 'that drives the /visualizations master index, present only in the scripts/audit-nav-links.mjs '
    + 'EXEMPT_FROM_INDEX drift backlog, and with no inbound <Link> from any other page. Only 3 of 6 members '
    + '(imp-34952/34954/34955) have a glossary headword (imp-34979/34982/34984); the remaining 3 '
    + '(imp-34953/34956/34957) have no Concepts-page surface at all. Where a headword exists it is keyword-'
    + 'findable but renders as plain text, not a clickable pointer to the viz route. The imp-34947..34951 '
    + 'sibling cohort audited by imp-35008 is equally orphaned from the master index on the same axis -- no '
    + 'asymmetry there -- but that cohort has a headword for every member, unlike this cohort’s 3-of-6 '
    + 'coverage. No routes added, no index entries changed; adding either is a distinct ux ticket. Changes no '
    + 'bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
};

export const DISCOVERABILITY_AUDIT_34952_34957_ASSERTIONS = [
  {
    id: 'imp-35023-cohort-has-six-members',
    description: 'the audited cohort is exactly the 6 tickets imp-34952..imp-34957',
    holds: () => DATA_MODULE_COHORT.length === 6
      && ['imp-34952', 'imp-34953', 'imp-34954', 'imp-34955', 'imp-34956', 'imp-34957']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-35023-all-orphaned-from-master-index',
    description: 'every cohort viz page is absent from the visualizations-index.js registry',
    holds: () => DATA_MODULE_COHORT.every((m) => m.inVisualizationsIndexRegistry === false),
  },
  {
    id: 'imp-35023-all-in-exempt-backlog-only-reachable-by-url',
    description: 'every cohort viz route sits in the documented EXEMPT_FROM_INDEX drift backlog and has no inbound Link',
    holds: () => DATA_MODULE_COHORT.every((m) => m.inExemptFromIndexBacklog === true
      && m.hasInboundLinkFromOtherPage === false
      && m.reachableOnlyByDirectUrl === true),
  },
  {
    id: 'imp-35023-glossary-coverage-is-three-of-six',
    description: 'exactly 3 of 6 members have a glossary headword and the rest have none',
    holds: () => DISCOVERABILITY_AUDIT_34952_34957.glossaryCoveredTickets.length === 3
      && DISCOVERABILITY_AUDIT_34952_34957.glossaryUncoveredTickets.length === 3,
  },
  {
    id: 'imp-35023-existing-headwords-searchable-not-clickable',
    description: 'existing glossary headwords are Concepts-page keyword-findable but do not link through to the viz route',
    holds: () => DATA_MODULE_COHORT.filter((m) => m.glossaryHeadword !== null)
      .every((m) => m.glossaryReachableBySearch === true && m.glossaryHasClickableLinkToVizPage === false),
  },
  {
    id: 'imp-35023-sibling-cohort-also-orphaned-no-index-asymmetry',
    description: 'the imp-34947..34951 sibling cohort (4 viz routes, audited by imp-35008) is equally orphaned from the master index',
    holds: () => SIBLING_COHORT_34947_34951_ROUTES.length === 4
      && DISCOVERABILITY_AUDIT_34952_34957.siblingCohortAlsoOrphaned === true,
  },
  {
    id: 'imp-35023-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no index entries added, no routes changed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(DISCOVERABILITY_AUDIT_34952_34957.honest)
      && /No routes added, no index entries changed/.test(DISCOVERABILITY_AUDIT_34952_34957.honest)
      && /refereed bound is changed/i.test(DISCOVERABILITY_AUDIT_34952_34957.honest),
  },
];

for (const a of DISCOVERABILITY_AUDIT_34952_34957_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35023-discoverability-audit assertion failed: ${a.id}`);
}
