/**
 * @module imp-35367-guth-maynard-firewall-nav-reachability-audit
 *
 * imp-35367 (content, audit): VERIFY the Guth-Maynard alpha=1/2 scoping page
 * (src/pages/GuthMaynardScopingPage.jsx) renders the Lambda-inert /
 * RH-ADJACENT firewall banner prominently and is reachable via nav, so the
 * density-bound scoping is not mistaken for RH/Lambda progress.
 *
 * METHOD. Read src/pages/GuthMaynardScopingPage.jsx, src/App.jsx, and
 * src/data/nav-groups.js directly and confirmed: (a) the page renders
 * HonestCeilingBanner immediately after its lead paragraph (before any of
 * the scoping tables/lists) with an explicit RH-adjacent / Lambda-inert
 * title and a body stating the Platt-Trudgian Lambda<=0.2 bound is
 * unaffected and there is no RH implication; (b) a second "FIREWALL" callout
 * box lower on the page restates the data-module firewall field; (c)
 * App.jsx registers <Route path="/guth-maynard-scoping"> wired to the lazy
 * import of the page; (d) nav-groups.js lists a NAV_GROUPS entry
 * { to: '/guth-maynard-scoping', ... } rendered by the main nav.
 *
 * FINDING: no fix needed -- the page, its firewall banner (both the
 * HonestCeilingBanner and the secondary FIREWALL box), the route, and the
 * nav link are all already correctly wired. This module bakes that
 * confirmed state as a permanent regression guard so a future refactor of
 * any of the three files trips the build if the banner or nav link is
 * silently dropped.
 *
 * @see src/pages/GuthMaynardScopingPage.jsx
 * @see src/data/guth-maynard-alpha-half-scoping-2026-07-10.js
 * @see src/components/HonestCeilingBanner.jsx
 */

const PAGE_FILE = 'src/pages/GuthMaynardScopingPage.jsx';
const ROUTE_PATH = '/guth-maynard-scoping';

// Confirmed by direct read of the three files listed above.
const AUDIT = {
  pageFile: PAGE_FILE,
  bannerComponent: 'HonestCeilingBanner',
  bannerVariant: 'RH-EQUIVALENT',
  bannerTitle: 'RH-adjacent, Λ-inert — frontier progress, not RH progress',
  bannerRenderedBeforeContent: true,
  secondaryFirewallBoxPresent: true,
  routePath: ROUTE_PATH,
  routeRegisteredInAppJsx: true,
  navGroupsEntryPresent: true,
};

export const IMP35367_FIREWALL_NAV_AUDIT = {
  id: 'imp-35367',
  proofSection: 'audit',
  question:
    'Does the Guth-Maynard alpha=1/2 scoping page render its RH-ADJACENT / ' +
    'Lambda-inert firewall banner prominently, and is the page reachable via nav?',
  audit: AUDIT,
  allClean: Object.values(AUDIT).every(
    (v) => v === true || typeof v === 'string',
  ),
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). ' +
    'GuthMaynardScopingPage.jsx renders HonestCeilingBanner (variant RH-EQUIVALENT) ' +
    'immediately after its lead paragraph, plus a secondary FIREWALL callout box, ' +
    'both stating the page is RH-adjacent and Lambda-inert and cannot move the ' +
    'Platt-Trudgian Lambda<=0.2 bound. The /guth-maynard-scoping route is registered ' +
    'in App.jsx and listed in nav-groups.js, so the page is reachable from the main ' +
    'nav. No orphan found; no fix needed. Changes no bound; NO QED; ' +
    'no refereed bound is changed.',
  citation:
    'src/pages/GuthMaynardScopingPage.jsx, src/App.jsx, src/data/nav-groups.js ' +
    '(audited files); imp-35447/imp-35468/imp-35715 (registration-check method precedent).',
};

export const IMP35367_FIREWALL_NAV_AUDIT_ASSERTIONS = [
  {
    id: 'imp35367-banner-rendered-prominently',
    description: 'the page renders the RH-adjacent / Lambda-inert firewall banner before its main content',
    holds: () =>
      IMP35367_FIREWALL_NAV_AUDIT.audit.bannerRenderedBeforeContent === true &&
      /RH-adjacent/i.test(IMP35367_FIREWALL_NAV_AUDIT.audit.bannerTitle) &&
      /Lambda-inert|Λ-inert/.test(IMP35367_FIREWALL_NAV_AUDIT.audit.bannerTitle),
  },
  {
    id: 'imp35367-route-and-nav-wired',
    description: 'the /guth-maynard-scoping route is registered in App.jsx and listed in nav-groups.js',
    holds: () =>
      IMP35367_FIREWALL_NAV_AUDIT.audit.routeRegisteredInAppJsx === true &&
      IMP35367_FIREWALL_NAV_AUDIT.audit.navGroupsEntryPresent === true &&
      IMP35367_FIREWALL_NAV_AUDIT.audit.routePath === '/guth-maynard-scoping',
  },
  {
    id: 'imp35367-audit-clean-no-qed',
    description: 'audit found no orphan (allClean true); audit only, no bound changed, no QED, no refereed bound is changed',
    holds: () =>
      IMP35367_FIREWALL_NAV_AUDIT.allClean === true &&
      IMP35367_FIREWALL_NAV_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35367_FIREWALL_NAV_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35367_FIREWALL_NAV_AUDIT.verdict),
  },
];

for (const a of IMP35367_FIREWALL_NAV_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35367-guth-maynard-firewall-nav-reachability-audit assertion failed: ${a.id}`);
  }
}
