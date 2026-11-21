/**
 * @module imp-35606-imp35561-page-registration-reachability-audit
 *
 * imp-35606 (meta, audit): the imp-35569 honest-status audit named
 * Imp35561PeakHeightMapSensitivityViz.jsx as "the only rendered page tied to the imp-35337
 * interior sigma peak's height-map behaviour" but did not itself check registration/reachability
 * (imp-35484/imp-35545 method) -- is the page actually registered in visualizations-index.js and
 * reachable via nav, or only routed in App.jsx?
 *
 * METHOD. Grepped src/App.jsx for the component's lazy import and <Route> entry; grepped
 * src/data/visualizations-index.js for a full registry entry (route, title, oneLine, mathBucket,
 * dataModule, paperSourcePath, ticket, pedagogicalStep, honestCeiling fields, matching the imp-2675
 * registry-coverage convention); grepped src/pages/VisualizationsIndexPage.jsx to confirm it renders
 * every visualizations-index.js entry as a Link card keyed on entry.route (so any registered entry
 * is nav-reachable at /visualizations); ran node scripts/audit-nav-links.mjs to confirm the live
 * result carries no WARN for this route.
 *
 * FINDING. The page IS fully registered, not merely routed: (1) src/App.jsx has both the lazy
 * import (const Imp35561PeakHeightMapSensitivityViz = lazy(...)) and the <Route
 * path="/viz-imp35561-peak-height-map-sensitivity"> entry; (2) src/data/visualizations-index.js
 * carries a complete Object.freeze entry for this route (title "Sigma-Peak Height-Map Sensitivity:
 * Robust Height, Drifting Location", dataModule
 * "src/data/imp-35561-peak-height-map-sensitivity-viz-data.js", ticket "imp-35561",
 * pedagogicalStep 86, and an honestCeiling caveat) -- the same shape as every other curated gallery
 * entry, not a stub; (3) VisualizationsIndexPage.jsx iterates the visualizations-index.js array and
 * renders a <Link to={entry.route}> VizCard for each entry, so the page is reachable by browsing
 * /visualizations, which is itself linked from the nav footer of numerous sibling viz pages; (4)
 * `node scripts/audit-nav-links.mjs` exits 0 with zero WARN lines mentioning
 * /viz-imp35561-peak-height-map-sensitivity -- the route is not even in the documented
 * EXEMPT_FROM_INDEX drift backlog, because it needs no exemption: it is properly registered.
 *
 * SCOPE. Read-only audit. No source file required correction -- the imp-35569 gap this ticket
 * follows up on was about page CONTENT (missing an arm-asymmetry note, since fixed by imp-35603),
 * not registration. Changes no bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35569-sigma-peak-page-honest-status-audit (named this page as the only sigma-peak page)
 * @see imp-35545-imp354xx-registration-reachability-audit (the registration/reachability method this ticket repeats)
 * @see imp-35484-imp35410x-registration-reachability-audit (prior audit establishing the method)
 * @see src/pages/Imp35561PeakHeightMapSensitivityViz.jsx (the audited page)
 * @see imp-35561-peak-height-map-sensitivity-viz-data.js (the audited page's data module)
 */

export const IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35606',
  proofSection: 'audit',
  auditedPage: {
    component: 'Imp35561PeakHeightMapSensitivityViz',
    file: 'src/pages/Imp35561PeakHeightMapSensitivityViz.jsx',
    route: '/viz-imp35561-peak-height-map-sensitivity',
    dataModule: 'src/data/imp-35561-peak-height-map-sensitivity-viz-data.js',
    registeredInAppJsx: true,
    registeredInVisualizationsIndex: true,
    pedagogicalStep: 86,
    reachableViaVisualizationsIndexPage: true,
    inExemptFromIndexBacklog: false,
    orphaned: false,
  },
  question:
    'Is the Imp35561PeakHeightMapSensitivityViz page (named by the imp-35569 audit as the only ' +
    'rendered sigma-peak height-map page) registered in visualizations-index.js and nav-reachable, ' +
    'or only routed in App.jsx?',
  verdictShort:
    'CLEAN. The page has a lazy import and <Route> in App.jsx, a complete registry entry in ' +
    'visualizations-index.js (pedagogicalStep 86), and is rendered as a nav-reachable Link card by ' +
    'VisualizationsIndexPage.jsx at /visualizations. node scripts/audit-nav-links.mjs exits 0 with ' +
    'no WARN for this route -- it does not even need the EXEMPT_FROM_INDEX drift-backlog entry ' +
    'other sibling pages carry, because it is already fully registered.',
  navLinkAuditExitCode: 0,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked App.jsx ' +
    'route wiring, visualizations-index.js registry wiring, and VisualizationsIndexPage.jsx ' +
    'rendering for Imp35561PeakHeightMapSensitivityViz.jsx. Result: fully registered and ' +
    'nav-reachable; no source file required correction. Changes no bound; establishes no operator ' +
    'positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35569 (named this page as the only sigma-peak height-map page, prompting this ' +
    'registration check); imp-35545/imp-35484 (prior audits establishing the method).',
};

export const IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35606-audited-page-identified',
    description: 'the audited page, route, and data module are named explicitly',
    holds: () =>
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage.file ===
        'src/pages/Imp35561PeakHeightMapSensitivityViz.jsx' &&
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage.route ===
        '/viz-imp35561-peak-height-map-sensitivity' &&
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage.dataModule ===
        'src/data/imp-35561-peak-height-map-sensitivity-viz-data.js',
  },
  {
    id: 'imp35606-fully-registered',
    description: 'the page is registered in both App.jsx and visualizations-index.js',
    holds: () =>
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage.registeredInAppJsx === true &&
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage
        .registeredInVisualizationsIndex === true,
  },
  {
    id: 'imp35606-nav-reachable-and-not-orphaned',
    description: 'the page is reachable via VisualizationsIndexPage and is not an orphan needing an exemption',
    holds: () =>
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage
        .reachableViaVisualizationsIndexPage === true &&
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage.inExemptFromIndexBacklog ===
        false &&
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.auditedPage.orphaned === false,
  },
  {
    id: 'imp35606-nav-link-audit-exit-clean',
    description: 'node scripts/audit-nav-links.mjs was run and exits 0',
    holds: () => IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.navLinkAuditExitCode === 0,
  },
  {
    id: 'imp35606-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35606-imp35561-page-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35606_IMP35561_PAGE_REGISTRATION_REACHABILITY_AUDIT;
