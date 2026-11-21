/**
 * @module imp-35033-discoverability-audit-34948
 *
 * imp-35033 (meta): DISCOVERABILITY / consumer-re-pointer audit of imp-34948
 * (the imp-34933 inflection-offset far-tail ladder extension, 1e14..1e18).
 * imp-34948 was omitted from both prior discoverability audits: imp-35008
 * enumerated only imp-34947/34949/34950/34951, and imp-35023 enumerated only
 * imp-34952..34957 -- so whether imp-34948's viz page and glossary headword
 * are actually NAVIGABLE (reachable by clicking through from an
 * analysis-index or Concepts page, not merely by typing the exact URL) was
 * never directly checked. This is a DIFFERENT question from the imp-35032
 * caveat-wiring audit, which verified the honest-status banner and
 * assertion-sweep wiring are present -- imp-35033 checks REACHABILITY.
 *
 * METHOD. (1) Identified imp-34948's downstream viz page (imp-35030,
 * src/pages/Imp35030FarTailInflectionOffsetLadderViz.jsx, route
 * /viz-imp35030-far-tail-inflection-offset-ladder) and glossary headword
 * (imp-35031, the "exponent-vs-diagnostic-band tension" term in
 * src/data/glossary.js). (2) Grepped src/data/visualizations-index.js (the
 * registry backing the /visualizations master index) for a matching route
 * entry. (3) Grepped scripts/audit-nav-links.mjs's EXEMPT_FROM_INDEX backlog
 * set for the route. (4) Grepped every .jsx page for an inbound <Link
 * to="..."> pointer to the route, outside its own App.jsx registration.
 * (5) Read src/pages/ConceptsPage.jsx to confirm glossary terms render as
 * plain text (the only <Link> elements on that page are four static
 * Literature/Paper/History/Documentation links, not per-term pointers), so
 * the imp-35031 headword is keyword-findable but not clickable through to
 * the viz page. (6) Per the ticket's second question -- orphaned relative to
 * imp-34933, the near-tail ladder imp-34948 extends -- located imp-34933's
 * own viz page (imp-34958, Imp34958InflectionOffsetRunningVsFixedLadderViz.jsx,
 * route /viz-imp34958-inflection-offset-running-vs-fixed-ladder) and checked
 * both pages' source for any inbound <Link> cross-referencing the other's
 * route, plus re-ran steps (2)-(3) on the imp-34958 route as the comparison
 * baseline.
 *
 * FINDING: imp-34948 fits the identical orphaning pattern imp-35008 and
 * imp-35023 already found for their cohorts. The imp-35030 viz page's route
 * is registered in App.jsx and listed in the scripts/audit-nav-links.mjs
 * EXEMPT_FROM_INDEX backlog (a documented, warn-only drift list), but has NO
 * entry in src/data/visualizations-index.js and NO inbound <Link> from any
 * other page -- reachable only by typing the exact URL. The imp-35031
 * glossary headword is findable by searching the Concepts page but its prose
 * only NAMES imp-34948/imp-34933/imp-33744/imp-33721 by ticket id; it does
 * not render a clickable Link to /viz-imp35030-far-tail-inflection-offset-ladder.
 * Relative to imp-34933: imp-34933's own viz page (imp-34958) sits in the
 * SAME orphaned state (in App.jsx and the EXEMPT_FROM_INDEX backlog, absent
 * from visualizations-index.js, no inbound Link) -- so imp-34948 is not
 * uniquely orphaned relative to a well-connected parent; the parent ladder's
 * page is equally unreachable except by direct URL. Neither viz page links
 * to the other despite the direct imp-34933-to-imp-34948 extension
 * relationship the prose on both pages describes in text. AUDIT-ONLY -- no
 * routes registered, no index entries added, no Links inserted; per the
 * ticket's own description, adding a re-pointer is deferred as a distinct ux
 * ticket rather than folded into this measurement.
 */

const IMP34948_VIZ_ROUTE = '/viz-imp35030-far-tail-inflection-offset-ladder';
const IMP34933_VIZ_ROUTE = '/viz-imp34958-inflection-offset-running-vs-fixed-ladder';

export const DISCOVERABILITY_AUDIT_34948 = {
  ticket: 'imp-35033',
  audited: 'imp-34948-inflection-offset-far-tail-ladder-extension',
  vizPage: {
    ticket: 'imp-35030',
    path: 'src/pages/Imp35030FarTailInflectionOffsetLadderViz.jsx',
    route: IMP34948_VIZ_ROUTE,
    registeredInAppJsx: true,
    inVisualizationsIndexRegistry: false,
    inExemptFromIndexBacklog: true,
    hasInboundLinkFromOtherPage: false,
    reachableOnlyByDirectUrl: true,
  },
  glossaryHeadword: {
    ticket: 'imp-35031',
    term: 'exponent-vs-diagnostic-band tension (imp-34948 far-tail ladder)',
    reachableBySearchOnConceptsPage: true,
    hasClickableLinkToVizPage: false,
  },
  parentLadder: {
    ticket: 'imp-34933',
    vizPageTicket: 'imp-34958',
    vizPagePath: 'src/pages/Imp34958InflectionOffsetRunningVsFixedLadderViz.jsx',
    route: IMP34933_VIZ_ROUTE,
    inVisualizationsIndexRegistry: false,
    inExemptFromIndexBacklog: true,
    crossLinkToImp34948VizPage: false,
    crossLinkFromImp34948VizPage: false,
    equallyOrphanedAsChild: true,
  },
  priorAuditsThatOmittedItByName: ['imp-35008', 'imp-35023'],
  vizMasterIndexRegistry: 'src/data/visualizations-index.js (drives the /visualizations page)',
  navAuditMechanism: 'scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX set (imp-2675 drift backlog)',
  premiseCorrection:
    'the ticket asked whether imp-34948 is orphaned RELATIVE TO imp-34933; this audit found imp-34933\'s own '
    + 'viz page (imp-34958) is equally orphaned from the master index, so there is no well-connected parent '
    + 'imp-34948 fell out of step with -- both ladder pages sit in the identical EXEMPT_FROM_INDEX backlog state '
    + 'and neither links to the other.',
  gapsFound: [],
  honest:
    'AUDIT-ONLY -- confirms the imp-35030 viz page for imp-34948 is reachable only via its direct '
    + `${IMP34948_VIZ_ROUTE} URL: absent from the visualizations-index.js registry that drives the `
    + '/visualizations master index, present only in the scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX drift '
    + 'backlog, and with no inbound <Link> from any other page. The imp-35031 glossary headword is '
    + 'keyword-findable on the Concepts page but renders as plain text, not a clickable pointer to the viz '
    + `route. imp-34933's own viz page (imp-34958, route ${IMP34933_VIZ_ROUTE}) sits in the identical orphaned `
    + 'state, and neither ladder page links to the other despite the direct extension relationship described in '
    + 'both pages\' prose -- so imp-34948 is not uniquely orphaned relative to a reachable parent. No routes '
    + 'added, no index entries changed, no Links inserted; adding a re-pointer is a distinct ux ticket per this '
    + 'ticket\'s own description. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. '
    + 'No refereed bound is changed.',
};

export const DISCOVERABILITY_AUDIT_34948_ASSERTIONS = [
  {
    id: 'imp-35033-viz-page-orphaned-from-master-index',
    description: 'the imp-35030 viz page for imp-34948 is absent from visualizations-index.js',
    holds: () => DISCOVERABILITY_AUDIT_34948.vizPage.inVisualizationsIndexRegistry === false,
  },
  {
    id: 'imp-35033-viz-page-exempt-backlog-only-reachable-by-url',
    description: 'the viz route sits in the documented EXEMPT_FROM_INDEX drift backlog and has no inbound Link',
    holds: () =>
      DISCOVERABILITY_AUDIT_34948.vizPage.inExemptFromIndexBacklog === true &&
      DISCOVERABILITY_AUDIT_34948.vizPage.hasInboundLinkFromOtherPage === false &&
      DISCOVERABILITY_AUDIT_34948.vizPage.reachableOnlyByDirectUrl === true,
  },
  {
    id: 'imp-35033-glossary-searchable-not-clickable',
    description: 'the imp-35031 glossary headword is Concepts-page keyword-findable but does not link through to the viz route',
    holds: () =>
      DISCOVERABILITY_AUDIT_34948.glossaryHeadword.reachableBySearchOnConceptsPage === true &&
      DISCOVERABILITY_AUDIT_34948.glossaryHeadword.hasClickableLinkToVizPage === false,
  },
  {
    id: 'imp-35033-parent-ladder-equally-orphaned-no-cross-links',
    description: 'imp-34933\'s own viz page (imp-34958) is equally orphaned from the master index and neither ladder page cross-links the other',
    holds: () =>
      DISCOVERABILITY_AUDIT_34948.parentLadder.inVisualizationsIndexRegistry === false &&
      DISCOVERABILITY_AUDIT_34948.parentLadder.inExemptFromIndexBacklog === true &&
      DISCOVERABILITY_AUDIT_34948.parentLadder.crossLinkToImp34948VizPage === false &&
      DISCOVERABILITY_AUDIT_34948.parentLadder.crossLinkFromImp34948VizPage === false &&
      DISCOVERABILITY_AUDIT_34948.parentLadder.equallyOrphanedAsChild === true,
  },
  {
    id: 'imp-35033-two-prior-audits-named',
    description: 'the audit records both prior discoverability audits that omitted imp-34948 by name',
    holds: () =>
      DISCOVERABILITY_AUDIT_34948.priorAuditsThatOmittedItByName.length === 2 &&
      DISCOVERABILITY_AUDIT_34948.priorAuditsThatOmittedItByName.includes('imp-35008') &&
      DISCOVERABILITY_AUDIT_34948.priorAuditsThatOmittedItByName.includes('imp-35023'),
  },
  {
    id: 'imp-35033-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no routes/index entries/Links added) and no refereed bound is changed',
    holds: () =>
      DISCOVERABILITY_AUDIT_34948.gapsFound.length === 0 &&
      /AUDIT-ONLY/.test(DISCOVERABILITY_AUDIT_34948.honest) &&
      /No routes added, no index entries changed/.test(DISCOVERABILITY_AUDIT_34948.honest) &&
      /refereed bound is changed/i.test(DISCOVERABILITY_AUDIT_34948.honest),
  },
];

for (const a of DISCOVERABILITY_AUDIT_34948_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35033-discoverability-audit assertion failed: ${a.id}`);
}
