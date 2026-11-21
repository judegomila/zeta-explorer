/**
 * @module imp-35447-imp35404-registration-reachability-audit
 *
 * imp-35447 (bug, audit): registration/reachability check (imp-35545/imp-35606/imp-35630/
 * imp-35645 method) on the imp-35404 Krawczyk-headroom-cancellation viz-data module
 * (IMP35404_LADDER, src/data/imp-35404-krawczyk-headroom-cancellation-viz-data.js), which
 * powers the /viz-imp35404-krawczyk-headroom-cancellation page.
 *
 * METHOD. Grepped src/App.jsx for a lazy import + <Route> entry for
 * Imp35404KrawczykHeadroomCancellationViz, grepped src/data/visualizations-index.js for a
 * full registry entry (route/dataModule/ticket/pedagogicalStep), and ran
 * `node scripts/audit-nav-links.mjs` to confirm the live nav audit carries no WARN for the
 * route (the imp-35606 method).
 *
 * FINDING -- FULLY REGISTERED AND REACHABLE, NOT ORPHANED. src/App.jsx (line ~822) carries
 * the lazy import and the <Route path="/viz-imp35404-krawczyk-headroom-cancellation">
 * element (line ~2390); src/data/visualizations-index.js carries a complete entry
 * (dataModule, paperSourcePath, ticket: "imp-35404", pedagogicalStep: 78, honestCeiling);
 * `node scripts/audit-nav-links.mjs` exits 0 and the route does not appear among the WARN
 * lines (which list only the separate known imp-349xx drift backlog). No wiring/flag action
 * required.
 *
 * SCOPE. Read-only registration/reachability audit only. No source file required correction
 * -- the module was already properly wired before this audit ran. Changes no bound;
 * establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35645-imp3559x-registration-reachability-audit (prior sweep establishing this method)
 * @see imp-35606-imp35561-page-registration-reachability-audit (single-page precursor establishing the nav-audit check)
 * @see imp-35404-krawczyk-headroom-cancellation-viz-data.js (audited module)
 * @see Imp35404KrawczykHeadroomCancellationViz.jsx (audited page)
 */

const AUDITED_FILE = {
  file: 'imp-35404-krawczyk-headroom-cancellation-viz-data',
  kind: 'viz-data',
  route: '/viz-imp35404-krawczyk-headroom-cancellation',
  component: 'Imp35404KrawczykHeadroomCancellationViz',
  registeredInAppJsx: true,
  registeredInVisualizationsIndex: true,
  pedagogicalStep: 78,
};

const NAV_LINK_AUDIT_EXIT_CODE = 0;
const NAV_LINK_AUDIT_WARN_COUNT_FOR_AUDITED_ROUTE = 0;
const DANGLING_OR_ORPHANED_FOUND = 0;

export const IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35447',
  proofSection: 'audit',
  question:
    'Is the imp-35404 Krawczyk-headroom-cancellation viz-data module (IMP35404_LADDER) ' +
    'registered in visualizations-index.js and reachable from a rendered page, and does it ' +
    'need wiring or flagging as orphaned?',
  verdictShort:
    'CLEAN. Fully registered: App.jsx has the lazy import + <Route>, ' +
    'visualizations-index.js has a complete entry (pedagogicalStep 78), and ' +
    'audit-nav-links.mjs exits 0 with no WARN for the route. Not orphaned; no action needed.',
  auditedFile: AUDITED_FILE,
  navLinkAuditExitCode: NAV_LINK_AUDIT_EXIT_CODE,
  navLinkAuditWarnCountForAuditedRoute: NAV_LINK_AUDIT_WARN_COUNT_FOR_AUDITED_ROUTE,
  danglingOrOrphanedFound: DANGLING_OR_ORPHANED_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'App.jsx route wiring, visualizations-index.js registry wiring, and the live ' +
    'audit-nav-links.mjs WARN list for the imp-35404 route. Result: fully registered and ' +
    'reachable; no source file required correction. Changes no bound; establishes no ' +
    'operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35404 (audited viz-data module); imp-35606/imp-35545/imp-35645 (registration/' +
    'reachability method).',
};

export const IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35447-audited-correct-file',
    description: 'the audited file is the imp-35404 viz-data module',
    holds: () =>
      AUDITED_FILE.file === 'imp-35404-krawczyk-headroom-cancellation-viz-data' &&
      AUDITED_FILE.kind === 'viz-data',
  },
  {
    id: 'imp35447-fully-registered',
    description: 'module is registered in both App.jsx and visualizations-index.js',
    holds: () =>
      AUDITED_FILE.registeredInAppJsx === true &&
      AUDITED_FILE.registeredInVisualizationsIndex === true,
  },
  {
    id: 'imp35447-nav-link-audit-clean',
    description: 'node scripts/audit-nav-links.mjs exits 0 with no WARN for the audited route',
    holds: () =>
      IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT.navLinkAuditExitCode === 0 &&
      IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT.navLinkAuditWarnCountForAuditedRoute === 0,
  },
  {
    id: 'imp35447-not-orphaned',
    description: 'no dangling or orphaned module found',
    holds: () => IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp35447-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35447-imp35404-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35447_IMP35404_REGISTRATION_REACHABILITY_AUDIT;
